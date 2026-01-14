# Tool Name

Brief description of what this tool does.

## Voice Triggers

- "Hey Cal, example trigger"
- "Hey Cal, another way to ask"

## What It Does

Detailed explanation of the tool's functionality and what information it returns.

## Requirements

- Service Name (with link to service if applicable)
- API key or other credentials needed

## Installation

### Self-Hosted

```bash
curl -s https://raw.githubusercontent.com/CoreWorxLab/caal-tools/refs/heads/main/scripts/install.sh | bash -s tool-name
```

### Manual

1. Download `workflow.json`
2. Import into n8n (Settings → Import from File)
3. Create required credentials
4. Update any service URLs in the HTTP nodes
5. Activate the workflow

## Example Response

> "Example of what CAAL would say in response to this tool being triggered."

## Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `SERVICE_URL` | Your service instance URL | `http://192.168.1.50:8080` |

## Related Tools

- [related-tool](../related-tool) - Description of related tool
