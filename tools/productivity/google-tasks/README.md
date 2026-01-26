# google-tasks

Manage Google Tasks - get, add, complete, and delete tasks with optional due dates and notes.

## Voice Triggers

- "Hey Cal, What's on my task list?"
- "Hey Cal, Add task buy groceries"

## Required Services

google tasks

## Setup

No environment variables required.

### n8n Credentials

- **GOOGLETASKSOAUTH2API_CREDENTIAL** (`googleTasksOAuth2Api`)
  - n8n credential type: googleTasksOAuth2Api


## Installation

### Via CAAL Tools Panel (Recommended)

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "google-tasks"
4. Click Install and follow prompts

### Via Command Line

```bash
curl -s https://raw.githubusercontent.com/CoreWorxLab/caal-tools/main/scripts/install.sh | bash -s google-tasks
```

## Usage

Google Tasks suite - manage tasks. Parameters: action (required) - 'get', 'add', 'complete', or 'delete'; title (required for add) - task name; task_id (required for complete/delete) - task ID; notes (optional for add); due (optional for add) - YYYY-MM-DD; show_completed (optional for get, default false). Examples: 'what's on my task list', 'add task buy groceries', 'mark the groceries task done'.

## Author

[@cmac86](https://github.com/cmac86)

## Category

productivity

## Tags

productivity, google tasks
