# google-contacts

Search and list Google Contacts with support for filtering by name and retrieving contact details including emails and phone numbers.

## Voice Triggers

- "Hey Cal, Find Mom's email"
- "Hey Cal, Lookup John Smith"

## Required Services

google contacts

## Setup

No environment variables required.

### n8n Credentials

- **GOOGLECONTACTSOAUTH2API_CREDENTIAL** (`googleContactsOAuth2Api`)
  - n8n credential type: googleContactsOAuth2Api


## Installation

### Via CAAL Tools Panel (Recommended)

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "google-contacts"
4. Click Install and follow prompts

### Via Command Line

```bash
curl -s https://raw.githubusercontent.com/CoreWorxLab/caal-tools/main/scripts/install.sh | bash -s google-contacts
```

## Usage

Google Contacts suite - lookup contact information. Parameters: action (required) - 'search' or 'list'; query (required for search) - name to search for; limit (optional for list, default 10) - max contacts to return. Examples: 'find Mom's email', 'lookup John Smith', 'list my contacts'.

## Author

[@cmac86](https://github.com/cmac86)

## Category

productivity

## Tags

productivity, google contacts
