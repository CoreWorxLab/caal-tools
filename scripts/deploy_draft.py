#!/usr/bin/env python3
"""Deploy a draft tool to n8n for testing.

Mimics the production install path:
1. Reads manifest.json for required_variables and required_credentials
2. Prompts user for each value
3. Substitutes ${VAR} placeholders in workflow.json
4. Creates the workflow in n8n via API
5. Activates the workflow

Usage:
    python scripts/deploy_draft.py draft-tools/seerr
"""

import json
import re
import sys
from pathlib import Path

import requests

N8N_API = "http://192.168.86.47:5678/api/v1"
KEYS_FILE = Path(__file__).resolve().parent.parent.parent / "n8n-workflows" / "CLAUDE_KEYS"


def get_api_key() -> str:
    for line in KEYS_FILE.read_text().strip().split("\n"):
        if line.startswith("n8n="):
            return line.split("=", 1)[1]
    raise ValueError("n8n key not found in CLAUDE_KEYS")


def substitute_variables(workflow: dict, variables: dict) -> dict:
    """Replace ${VAR} placeholders in workflow JSON — matches production."""
    text = json.dumps(workflow)
    for key, value in variables.items():
        # Escape for JSON string context
        escaped = value.replace("\\", "\\\\").replace('"', '\\"')
        text = text.replace(f"${{{key}}}", escaped)
    return json.loads(text)


def get_existing_workflow(headers: dict, name: str) -> dict | None:
    resp = requests.get(f"{N8N_API}/workflows", headers=headers)
    if resp.status_code != 200:
        return None
    for wf in resp.json().get("data", []):
        if wf["name"] == name and not wf.get("isArchived"):
            return wf
    return None


def main():
    if len(sys.argv) < 2:
        print("Usage: deploy_draft.py <draft-tool-dir>")
        print("  e.g. deploy_draft.py draft-tools/seerr")
        sys.exit(1)

    tool_dir = Path(sys.argv[1])
    manifest_path = tool_dir / "manifest.json"
    workflow_path = tool_dir / "workflow.json"

    if not manifest_path.exists():
        print(f"Error: {manifest_path} not found")
        sys.exit(1)
    if not workflow_path.exists():
        print(f"Error: {workflow_path} not found")
        sys.exit(1)

    manifest = json.loads(manifest_path.read_text())
    workflow = json.loads(workflow_path.read_text())

    print(f"\n  Deploy: {manifest['friendlyName']} v{manifest['version']}")
    print(f"  Actions: {', '.join(manifest.get('actions', []))}")
    print()

    # Collect variables
    variables = {}

    for var in manifest.get("required_variables", []):
        name = var["name"]
        desc = var.get("description", "")
        example = var.get("example", "")
        prompt = f"  {name}"
        if example:
            prompt += f" ({example})"
        prompt += ": "
        print(f"  {desc}")
        value = input(prompt).strip()
        if not value:
            print(f"  Skipped (will remain as placeholder)")
        else:
            variables[name] = value

    # Collect credentials
    for cred in manifest.get("required_credentials", []):
        name = cred["name"]
        cred_type = cred.get("credential_type", "")
        desc = cred.get("description", "")
        print(f"\n  {desc}")
        print(f"  n8n credential name to use for {name}")
        value = input(f"  {name}: ").strip()
        if value:
            variables[name] = value

    # Substitute
    if variables:
        print(f"\n  Substituting {len(variables)} variable(s)...")
        workflow = substitute_variables(workflow, variables)

    # Check remaining unsubstituted vars
    text = json.dumps(workflow)
    remaining = set(re.findall(r'\$\{([^}]+)\}', text))
    if remaining:
        print(f"\n  Warning: unsubstituted variables: {', '.join(remaining)}")

    # Connect to n8n
    api_key = get_api_key()
    headers = {"Content-Type": "application/json", "X-N8N-API-KEY": api_key}

    # Check for existing
    existing = get_existing_workflow(headers, workflow["name"])
    if existing:
        wf_id = existing["id"]
        print(f"\n  Existing workflow found: {workflow['name']} (ID: {wf_id})")
        choice = input("  Update it? [y/N]: ").strip().lower()
        if choice != "y":
            print("  Aborted.")
            sys.exit(0)

        # Update existing
        update_payload = {
            "name": workflow["name"],
            "nodes": workflow["nodes"],
            "connections": workflow["connections"],
            "settings": workflow.get("settings", {}),
        }
        resp = requests.put(
            f"{N8N_API}/workflows/{wf_id}", headers=headers, json=update_payload
        )
        if resp.status_code != 200:
            print(f"  Error updating: {resp.text}")
            sys.exit(1)
        print(f"  Updated: {workflow['name']} (ID: {wf_id})")

        # Ensure active
        if not existing.get("active"):
            resp = requests.post(
                f"{N8N_API}/workflows/{wf_id}/activate", headers=headers
            )
            if resp.status_code == 200:
                print(f"  Activated.")
    else:
        # Create new
        create_payload = {
            "name": workflow["name"],
            "nodes": workflow["nodes"],
            "connections": workflow["connections"],
            "settings": workflow.get("settings", {}),
        }
        resp = requests.post(f"{N8N_API}/workflows", headers=headers, json=create_payload)
        if resp.status_code not in (200, 201):
            print(f"  Error creating: {resp.text}")
            sys.exit(1)

        data = resp.json()
        wf_id = data["id"]
        print(f"\n  Created: {data['name']} (ID: {wf_id})")

        # Activate
        resp = requests.post(
            f"{N8N_API}/workflows/{wf_id}/activate", headers=headers
        )
        if resp.status_code == 200:
            print(f"  Activated.")
        else:
            print(f"  Warning: could not activate: {resp.text}")

    # Show webhook
    for node in workflow.get("nodes", []):
        if node.get("type") == "n8n-nodes-base.webhook":
            path = node.get("parameters", {}).get("path", "")
            if path:
                print(f"\n  Webhook: http://192.168.86.47:5678/webhook/{path}")
                break

    print()


if __name__ == "__main__":
    main()
