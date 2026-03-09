# google-tasks

Manage Google Tasks - get, add, update, complete, and delete tasks with optional due dates and notes.

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

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "google-tasks"
4. Click Install and follow prompts

## Usage

Google Tasks suite - manage tasks. Parameters: action (required) - 'get', 'add', 'update', 'complete', or 'delete'; title (required for add, optional for update) - task name; task_id (required for update/complete/delete) - task ID; notes (optional for add/update); due (optional for add/update) - YYYY-MM-DD; show_completed (optional for get, default false). For update, only send fields you want to change. Examples: 'what's on my task list', 'add task buy groceries', 'change the groceries task to due tomorrow', 'mark the groceries task done'.

## Author

[@cmac86](https://github.com/cmac86)

## Category

productivity

## Tags

productivity, google tasks
