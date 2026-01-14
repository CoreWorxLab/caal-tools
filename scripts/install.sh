#!/bin/bash
set -e

TOOL_NAME="$1"
REPO_BASE="https://raw.githubusercontent.com/CoreWorxLab/caal-tools/refs/heads/main"

if [ -z "$TOOL_NAME" ]; then
  echo "Usage: install.sh <tool-name>"
  echo "Example: install.sh truenas-get-status"
  echo ""
  echo "Environment variables:"
  echo "  N8N_URL      n8n instance URL (default: http://localhost:5678)"
  echo "  N8N_API_KEY  n8n API key for auto-import (optional, prompts manual import if not set)"
  echo "  CAAL_URL     CAAL webhook URL (default: http://localhost:8889)"
  echo ""
  echo "Example with env vars:"
  echo "  N8N_API_KEY=xxx CAAL_URL=http://192.168.1.50:8889 bash install.sh truenas-get-status"
  exit 1
fi

echo ""
echo "Looking up $TOOL_NAME..."

# Search through categories
TOOL_PATH=""
for category in smart-home media homelab productivity utilities; do
  manifest_url="$REPO_BASE/tools/$category/$TOOL_NAME/manifest.json"
  if curl -sf "$manifest_url" > /dev/null 2>&1; then
    TOOL_PATH="tools/$category/$TOOL_NAME"
    break
  fi
done

if [ -z "$TOOL_PATH" ]; then
  echo " Tool not found: $TOOL_NAME"
  echo ""
  echo "Browse available tools at: https://coreworxlab.github.io/caal-tools/"
  exit 1
fi

echo " Found: $TOOL_PATH"

# Download files
MANIFEST=$(curl -sf "$REPO_BASE/$TOOL_PATH/manifest.json")
WORKFLOW=$(curl -sf "$REPO_BASE/$TOOL_PATH/workflow.json")

if [ -z "$MANIFEST" ] || [ -z "$WORKFLOW" ]; then
  echo " Failed to download tool files"
  exit 1
fi

# Show tool info
DESCRIPTION=$(echo "$MANIFEST" | jq -r '.description')
echo ""
echo "$DESCRIPTION"
echo ""

# Check for required variables
VARIABLES=$(echo "$MANIFEST" | jq -r '.required_variables[]? | "\(.name)|\(.description)|\(.example)"' 2>/dev/null || true)

declare -A VAR_VALUES

if [ -n "$VARIABLES" ]; then
  echo "This tool requires configuration:"
  echo ""

  while IFS='|' read -r name desc example; do
    [ -z "$name" ] && continue
    echo "$name"
    echo "  $desc"
    echo "  Example: $example"
    read -p "  > " value
    VAR_VALUES[$name]="$value"
    echo ""
  done <<< "$VARIABLES"
fi

# Check for required credentials
CREDENTIALS=$(echo "$MANIFEST" | jq -r '.required_credentials[]? | "\(.name)|\(.description)"' 2>/dev/null || true)

if [ -n "$CREDENTIALS" ]; then
  echo "Credentials needed (create these in n8n):"
  echo ""

  while IFS='|' read -r name desc; do
    [ -z "$name" ] && continue
    echo "  - $name: $desc"
  done <<< "$CREDENTIALS"
  echo ""
fi

# Substitute variables in workflow
FINAL_WORKFLOW="$WORKFLOW"
for var in "${!VAR_VALUES[@]}"; do
  FINAL_WORKFLOW=$(echo "$FINAL_WORKFLOW" | sed "s|\${$var}|${VAR_VALUES[$var]}|g")
done

# Import to n8n
echo " Importing workflow to n8n..."

N8N_URL="${N8N_URL:-http://localhost:5678}"
N8N_API_KEY="${N8N_API_KEY:-}"

if [ -z "$N8N_API_KEY" ]; then
  # Save to temp file for manual import
  TEMP_FILE="/tmp/$TOOL_NAME.json"
  echo "$FINAL_WORKFLOW" > "$TEMP_FILE"
  echo ""
  echo " N8N_API_KEY not set. Workflow saved to: $TEMP_FILE"
  echo ""
  echo "To import manually:"
  echo "  1. Open n8n at $N8N_URL"
  echo "  2. Go to Settings > Import from File"
  echo "  3. Select $TEMP_FILE"
  echo "  4. Create required credentials"
  echo "  5. Activate the workflow"
else
  # Import via API
  RESPONSE=$(curl -sf -X POST "$N8N_URL/api/v1/workflows" \
    -H "Content-Type: application/json" \
    -H "X-N8N-API-KEY: $N8N_API_KEY" \
    -d "$FINAL_WORKFLOW" 2>&1) || {
    echo " Failed to import workflow to n8n"
    echo "$RESPONSE"
    exit 1
  }
  echo " Workflow imported"
fi

# Trigger CAAL refresh
CAAL_URL="${CAAL_URL:-http://localhost:8889}"
echo ""
echo " Refreshing CAAL tools..."
curl -sf -X POST "$CAAL_URL/reload-tools" > /dev/null 2>&1 && echo " Tools refreshed" || echo " Could not refresh (CAAL not running?)"

# Done
echo ""
echo " Installed: $TOOL_NAME"
echo ""

# Show example triggers
TRIGGERS=$(echo "$MANIFEST" | jq -r '.voice_triggers[0:2][]' 2>/dev/null || true)
if [ -n "$TRIGGERS" ]; then
  echo "Try saying:"
  while read -r trigger; do
    [ -z "$trigger" ] && continue
    echo "  \"Hey Cal, $trigger\""
  done <<< "$TRIGGERS"
  echo ""
fi
