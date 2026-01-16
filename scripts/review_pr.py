#!/usr/bin/env python3
"""
CAAL Tool Registry - PR Review Script

Triggered by GitHub webhook via the `webhook` binary.
Runs Claude CLI to review PRs and posts results back to GitHub.
"""

import json
import os
import re
import subprocess
import sys
from pathlib import Path

import requests

# Configuration
REPO_OWNER = "CoreWorxLab"
REPO_NAME = "caal-tools"
REPO_PATH = "/var/www/caal-tools"
REVIEW_SEED_PATH = f"{REPO_PATH}/REVIEW_SEED.md"
REVIEWED_PRS_PATH = f"{REPO_PATH}/.reviewed_prs.json"
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
CLAUDE_PATH = os.environ.get("CLAUDE_PATH", "claude")

# Valid actions to process
VALID_ACTIONS = ["opened", "synchronize", "reopened"]


def load_reviewed_prs() -> dict:
    """Load the record of reviewed PRs."""
    if Path(REVIEWED_PRS_PATH).exists():
        with open(REVIEWED_PRS_PATH) as f:
            return json.load(f)
    return {}


def save_reviewed_prs(reviewed: dict):
    """Save the record of reviewed PRs."""
    with open(REVIEWED_PRS_PATH, "w") as f:
        json.dump(reviewed, f, indent=2)


def parse_webhook_payload(payload: dict) -> dict | None:
    """Parse GitHub webhook payload, return PR info or None if should skip."""
    action = payload.get("action")
    pr = payload.get("pull_request")

    if not pr:
        print("No pull_request in payload, skipping")
        return None

    if action not in VALID_ACTIONS:
        print(f"Action '{action}' not in valid actions, skipping")
        return None

    # Check if already reviewed this commit
    reviewed = load_reviewed_prs()
    pr_number = str(pr["number"])
    head_sha = pr["head"]["sha"]

    if reviewed.get(pr_number) == head_sha:
        print(f"PR #{pr_number} already reviewed at {head_sha}, skipping")
        return None

    return {
        "number": pr["number"],
        "title": pr["title"],
        "url": pr["html_url"],
        "head_ref": pr["head"]["ref"],
        "head_sha": head_sha,
        "user": pr["user"]["login"],
        "action": action,
    }


LOG_DIR = "/var/log/caal-tools"


def run_claude_review(pr_info: dict) -> str:
    """Run Claude CLI to review the PR."""
    prompt = f"""You are reviewing a PR for the CAAL Tool Registry. Follow the instructions in {REVIEW_SEED_PATH} exactly.

PR Number: {pr_info['number']}
PR Title: {pr_info['title']}
PR URL: {pr_info['url']}
Branch: {pr_info['head_ref']}
Author: {pr_info['user']}

Read the seed file, then immediately execute the review steps. Do not ask for confirmation - just do the review and output the structured response with verdict, fixes, issues, and feedback blocks.
"""

    cmd = [
        CLAUDE_PATH,
        "--model", "sonnet",
        "--print",
        "--output-format", "json",
        "--allowedTools", "Read,Edit,Write,Bash(git *),Bash(node *),Bash(gh *),Bash(cat *),git commit",
        "-p", prompt,
    ]

    print(f"Running Claude CLI for PR #{pr_info['number']}...")
    result = subprocess.run(
        cmd,
        cwd=REPO_PATH,
        capture_output=True,
        text=True,
        timeout=300,  # 5 minute timeout
    )

    # Force cleanup to pristine state after review
    print("Cleaning up repository state...")
    subprocess.run(['git', 'checkout', '-f', 'main'], cwd=REPO_PATH, check=True)
    subprocess.run(['git', 'clean', '-fd'], cwd=REPO_PATH, check=True)

    # Log raw output for debugging
    os.makedirs(LOG_DIR, exist_ok=True)
    log_path = f"{LOG_DIR}/review_{pr_info['number']}_{pr_info['head_sha'][:7]}.log"

    # Try to extract session ID from JSON output
    session_id = None
    try:
        output_json = json.loads(result.stdout)
        session_id = output_json.get("session_id") or output_json.get("sessionId")
    except json.JSONDecodeError:
        pass

    with open(log_path, "w") as f:
        f.write(f"PR: #{pr_info['number']} - {pr_info['title']}\n")
        f.write(f"SHA: {pr_info['head_sha']}\n")
        f.write(f"Return code: {result.returncode}\n")
        if session_id:
            f.write(f"Session ID: {session_id}\n")
            f.write(f"Resume: claude --resume {session_id}\n")
        f.write(f"\n=== STDOUT ===\n{result.stdout}\n\n")
        f.write(f"=== STDERR ===\n{result.stderr}\n")
    print(f"Claude output logged to {log_path}")
    if session_id:
        print(f"Session ID: {session_id}")

    if result.returncode != 0:
        print(f"Claude CLI failed: {result.stderr}")
        raise RuntimeError(f"Claude CLI failed: {result.stderr}")

    # Parse JSON output
    try:
        output = json.loads(result.stdout)
        return output.get("result", result.stdout)
    except json.JSONDecodeError:
        return result.stdout


def parse_review_response(response: str) -> dict:
    """Parse Claude's structured review response."""
    # Extract verdict
    verdict_match = re.search(r"```verdict\s*\n([\s\S]*?)\n```", response)
    verdict = verdict_match.group(1).strip() if verdict_match else "NEEDS_CHANGES"

    # Extract fixes
    fixes_match = re.search(r"```fixes\s*\n([\s\S]*?)\n```", response)
    fixes_raw = fixes_match.group(1).strip() if fixes_match else ""
    fixes = [line.strip() for line in fixes_raw.split("\n") if line.strip().startswith("-")]

    # Extract issues
    issues_match = re.search(r"```issues\s*\n([\s\S]*?)\n```", response)
    issues_raw = issues_match.group(1).strip() if issues_match else ""
    issues = [line.strip() for line in issues_raw.split("\n") if line.strip().startswith("-")]

    # Extract feedback
    feedback_match = re.search(r"```feedback\s*\n([\s\S]*?)\n```", response)
    feedback = feedback_match.group(1).strip() if feedback_match else "Review completed."

    return {
        "verdict": verdict,
        "fixes": fixes,
        "issues": issues,
        "feedback": feedback,
    }


def build_comment_body(review: dict) -> str:
    """Build the GitHub comment body from review results."""
    emoji = "✅" if review["verdict"] == "APPROVED" else "❌"

    body = f"## {emoji} Tool Review: {review['verdict']}\n\n"

    if review["fixes"] and review["fixes"][0].lower() != "none":
        body += "### Auto-Fixes Applied\n"
        body += "\n".join(review["fixes"]) + "\n\n"

    if review["issues"]:
        body += "### Issues\n"
        body += "\n".join(review["issues"]) + "\n\n"

    body += f"### Feedback\n{review['feedback']}\n\n"
    body += "---\n*Automated review by CAAL Tool Registry Bot*"

    return body


def post_comment(pr_number: int, body: str):
    """Post a comment to the GitHub PR."""
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/issues/{pr_number}/comments"
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json",
    }

    response = requests.post(url, headers=headers, json={"body": body})
    response.raise_for_status()
    print(f"Posted comment to PR #{pr_number}")


def add_label(pr_number: int, label: str):
    """Add a label to the GitHub PR."""
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/issues/{pr_number}/labels"
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json",
    }

    response = requests.post(url, headers=headers, json={"labels": [label]})
    response.raise_for_status()
    print(f"Added label '{label}' to PR #{pr_number}")


def mark_reviewed(pr_number: int, sha: str):
    """Mark PR as reviewed to avoid duplicate reviews."""
    reviewed = load_reviewed_prs()
    reviewed[str(pr_number)] = sha
    save_reviewed_prs(reviewed)
    print(f"Marked PR #{pr_number} as reviewed at {sha}")


def main():
    """Main entry point - reads webhook payload from stdin."""
    if not GITHUB_TOKEN:
        print("ERROR: GITHUB_TOKEN environment variable not set")
        sys.exit(1)

    # Read payload from stdin (webhook binary pipes it in)
    payload_raw = sys.stdin.read()

    try:
        payload = json.loads(payload_raw)
    except json.JSONDecodeError as e:
        print(f"Failed to parse webhook payload: {e}")
        sys.exit(1)

    # Parse and validate
    pr_info = parse_webhook_payload(payload)
    if not pr_info:
        sys.exit(0)  # Skip this webhook, not an error

    print(f"Reviewing PR #{pr_info['number']}: {pr_info['title']}")

    try:
        # Run Claude review
        response = run_claude_review(pr_info)

        # Parse response
        review = parse_review_response(response)

        # Build and post comment
        comment_body = build_comment_body(review)
        post_comment(pr_info["number"], comment_body)

        # Add label
        label = "ready-to-merge" if review["verdict"] == "APPROVED" else "needs-changes"
        add_label(pr_info["number"], label)

        # Mark as reviewed
        mark_reviewed(pr_info["number"], pr_info["head_sha"])

        print(f"Review complete: {review['verdict']}")

    except Exception as e:
        print(f"Review failed: {e}")
        # Post error comment
        error_body = f"""## ⚠️ Review Failed

An error occurred while reviewing this PR:

```
{str(e)}
```

A maintainer will review manually.

---
*Automated review by CAAL Tool Registry Bot*"""

        try:
            post_comment(pr_info["number"], error_body)
        except Exception:
            pass  # Best effort

        sys.exit(1)


if __name__ == "__main__":
    main()
