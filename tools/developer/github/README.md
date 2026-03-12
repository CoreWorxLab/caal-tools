# GitHub

Manage pull requests, issues, notifications, and repositories via the GitHub API. Requires a GitHub Personal Access Token.

## Voice Triggers

- "What are my open pull requests"
- "Show me the issues on caal-tools"
- "Any GitHub notifications"
- "Create an issue for the bug we found"
- "Merge that pull request"
- "What repos do I have"

## Required Services

- GitHub account with a Personal Access Token (classic or fine-grained)

## Setup

### n8n Credentials

1. In n8n, go to Credentials → Add Credential → GitHub API
2. Paste your GitHub Personal Access Token
   - Create one at GitHub → Settings → Developer settings → Personal access tokens
   - Scopes needed: `repo`, `notifications`
3. Name the credential (e.g., `github`)

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GITHUB_DEFAULT_REPO` | Default repo in owner/repo format | `CoreWorxLab/caal-tools` |

## Installation

1. Open the CAAL web interface
2. Navigate to the Tool Store
3. Find "GitHub" and click Install
4. Enter your n8n credential name and default repo when prompted

## Usage

### list_prs
List pull requests for a repository.
- `repo` (optional) — owner/repo format, defaults to configured default
- `state` (optional) — open, closed, or all. Default: open
- `limit` (optional) — max results. Default: 10

### show_pr
Show details of a specific pull request.
- `pr_number` (required) — the PR number
- `repo` (optional)

### list_issues
List issues for a repository.
- `repo` (optional)
- `state` (optional) — open, closed, or all. Default: open
- `labels` (optional) — comma-separated label names to filter by
- `limit` (optional) — max results. Default: 10

### show_issue
Show details of a specific issue.
- `issue_number` (required) — the issue number
- `repo` (optional)

### list_notifications
List your unread GitHub notifications.
- `limit` (optional) — max results. Default: 10

### list_repos
List your recent repositories, sorted by last updated.
- `limit` (optional) — max results. Default: 10

### create_issue
Create a new issue on a repository.
- `title` (required) — issue title
- `repo` (optional)
- `body` (optional) — issue body/description
- `labels` (optional) — comma-separated labels

### comment
Post a comment on a PR or issue.
- `issue_number` (required) — PR or issue number (GitHub uses same numbering)
- `body` (required) — comment text
- `repo` (optional)

### merge_pr
Merge a pull request. This action is irreversible.
- `pr_number` (required) — the PR number
- `repo` (optional)
- `merge_method` (optional) — merge, squash, or rebase. Default: merge

### close_issue
Close an issue.
- `issue_number` (required) — the issue number
- `repo` (optional)
