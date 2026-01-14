# truenas-get-status

Get TrueNAS system status including CPU, memory, storage pools, and running apps.

## Voice Triggers

- "Hey Cal, what's my TrueNAS status"
- "Hey Cal, how's my NAS doing"
- "Hey Cal, check TrueNAS"

## What It Does

Queries your TrueNAS instance and returns:
- System hostname and uptime
- CPU usage (estimated from load average)
- Memory usage (used/total)
- Storage pool health status
- Count of running apps

## Requirements

- TrueNAS Scale instance
- API key (Credentials > API Keys > Add in TrueNAS UI)

## Installation

### Quick Install

```bash
curl -s https://raw.githubusercontent.com/CoreWorxLab/caal-tools/refs/heads/main/scripts/install.sh | bash -s truenas-get-status
```

### Manual

1. Download `workflow.json`
2. Import into n8n (Settings > Import from File)
3. Create an "HTTP Header Auth" credential named "TrueNAS API Key"
   - Header Name: `Authorization`
   - Header Value: `Bearer YOUR_API_KEY_HERE`
4. Find/replace `${TRUENAS_URL}` with your TrueNAS URL (e.g., `http://192.168.1.100`)
5. Activate the workflow

## Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `TRUENAS_URL` | Your TrueNAS instance URL | `http://192.168.1.100` |

## Example Response

> "Your TrueNAS machine truenas is running. Uptime is 45 days. CPU at 12 percent. 18 of 32 gigs of RAM used. Storage pools are healthy. 8 apps running."

## Related Tools

- [truenas-control-app](../truenas-control-app) - Start, stop, and restart TrueNAS apps
