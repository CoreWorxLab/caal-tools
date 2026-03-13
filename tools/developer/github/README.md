# GitHub

Manage pull requests, issues, discussions, notifications, and repositories via the GitHub API. Requires a GitHub Personal Access Token.

## Voice Triggers

- "What are my open pull requests"
- "Read the comments on PR 84"
- "Read me the issues on caal-tools"
- "Any GitHub notifications"
- "Check the latest discussions"
- "Read the comment from nerdbeast"
- "Create an issue for the bug we found"
- "Merge that pull request"

## Required Services

- GitHub account with a Personal Access Token (classic or fine-grained)

## Setup

### n8n Credentials

1. In n8n, go to Credentials → Add Credential → GitHub API
2. Paste your GitHub Personal Access Token
   - Create one at GitHub → Settings → Developer settings → Personal access tokens
   - Scopes needed: `repo`, `notifications`, `read:discussion`
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
- `limit` (optional) — max results. Default: 5

### read_pr
Read details of a specific pull request.
- `pr_number` (required) — the PR number
- `repo` (optional)

### read_pr_comments
Read conversation comments on a pull request.
- `pr_number` (required) — the PR number
- `repo` (optional)
- `limit` (optional) — max results. Default: 5

### list_issues
List issues for a repository.
- `repo` (optional)
- `state` (optional) — open, closed, or all. Default: open
- `labels` (optional) — comma-separated label names to filter by
- `limit` (optional) — max results. Default: 5

### read_issue
Read details of a specific issue.
- `issue_number` (required) — the issue number
- `repo` (optional)

### list_notifications
List your unread GitHub notifications.
- `limit` (optional) — max results. Default: 5

### list_repos
List your recent repositories, sorted by last updated.
- `limit` (optional) — max results. Default: 5

### list_discussions
List the 3 most recent discussions on a repository.
- `repo` (optional)

### read_discussion
Read a discussion's post and list all commenters with their comment IDs.
- `discussion_number` (required) — the discussion number
- `repo` (optional)

### read_discussion_comment
Read a specific discussion comment in full, including any threaded replies.
- `comment_id` (required) — the comment's node ID (from read_discussion data)

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

### comment_discussion
Post a top-level comment on a discussion.
- `discussion_number` (required) — the discussion number
- `body` (required) — comment text
- `repo` (optional)

### reply_discussion_comment
Post a threaded reply to a specific discussion comment.
- `discussion_id` (required) — the discussion's node ID (from read_discussion data)
- `comment_id` (required) — the comment's node ID (from read_discussion data)
- `body` (required) — reply text

### merge_pr
Merge a pull request. This action is irreversible.
- `pr_number` (required) — the PR number
- `repo` (optional)
- `merge_method` (optional) — merge, squash, or rebase. Default: merge

### close_issue
Close an issue.
- `issue_number` (required) — the issue number
- `repo` (optional)
