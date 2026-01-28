# gmail

Manage Gmail - check unread emails and send messages to recipients.

## Voice Triggers

- "Hey Cal, Do I have any new emails?"
- "Hey Cal, Check my unread emails"

## Required Services

gmail

## Setup

No environment variables required.

### n8n Credentials

- **GMAILOAUTH2_CREDENTIAL** (`gmailOAuth2`)
  - n8n credential type: gmailOAuth2


## Installation

### Via CAAL Tools Panel (Recommended)

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "gmail"
4. Click Install and follow prompts

### Via Command Line

```bash
curl -s https://raw.githubusercontent.com/CoreWorxLab/caal-tools/main/scripts/install.sh | bash -s gmail
```

## Usage

Gmail suite - check and send emails. Parameters: action (required) - 'get_unread' or 'send'; limit (optional for get_unread, default 10) - number of emails; to (required for send) - recipient email address; subject (required for send); body (required for send). For send: if user provides a name instead of email address, use contacts lookup tool first to get their email, then confirm before sending. Examples: 'do I have any new emails', 'send email to john@example.com saying I'll be late', 'email Mom to say happy birthday'.

## Author

[@cmac86](https://github.com/cmac86)

## Category

productivity

## Tags

productivity, gmail
