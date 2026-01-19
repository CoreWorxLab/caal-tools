# github-get-repo-activity

Check CoreWorxLab/CAAL for actionable items: open PRs, open issues, and unread notifications.

## Voice Triggers

- "Hey Cal, check the github repo status"
- "Hey Cal, check the CAAL repo"

## What It Does

Check CoreWorxLab/CAAL for actionable items: open PRs, open issues, and unread notifications.

## Requirements

- github instance
- API key for authentication

## Installation

### CAAL Frontend (Recommended)

1. Open CAAL web interface
2. Browse to this tool
3. Click Install

### Install Script

```bash
curl -s https://raw.githubusercontent.com/CoreWorxLab/caal-tools/main/scripts/install.sh | bash -s github-get-repo-activity
```

### Manual

1. Download `workflow.json`
2. Import into n8n (Settings > Import from File)
3. Create credential "github_account"
4. Update service URL: `SERVICE_URL`
5. Activate the workflow

## Configuration

| Variable | Description | Example |
|----------|-------------|---------|

