# notion-tasks

Manage tasks in Notion - get, add, complete, and delete tasks with due date support.

## Voice Triggers

- "Hey Cal, What's on my notion task list?"
- "Hey Cal, Add notion task buy groceries due friday"

## Required Services

notion

## Setup

### Environment Variables

- `NOTION_DATABASE_ID`: Your Notion database ID for tasks
  - Example: `abc123def456789ghi012jkl`


### n8n Credentials

- **NOTIONAPI_CREDENTIAL** (`notionApi`)
  - n8n credential type: notionApi


## Installation

### Via CAAL Tools Panel (Recommended)

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "notion-tasks"
4. Click Install and follow prompts

### Via Command Line

```bash
curl -s https://raw.githubusercontent.com/CoreWorxLab/caal-tools/main/scripts/install.sh | bash -s notion-tasks
```

## Usage

Notion Tasks suite - manage tasks in Notion database. Parameters: action (required) - 'get', 'add', 'complete', or 'delete'; task (required for add/complete/delete) - task name; filter (optional for get) - 'all', 'today', 'tomorrow', 'week', 'overdue'; due (optional for add) - due date like 'today', 'tomorrow', 'friday', or 'YYYY-MM-DD'; notes (optional for add); show_completed (optional for get, default false). Examples: 'what's on my notion task list', 'add notion task buy groceries due friday', 'complete buy groceries in notion', 'delete old task from notion'.

## Author

[@cmac86](https://github.com/cmac86)

## Category

productivity

## Tags

productivity, notion
