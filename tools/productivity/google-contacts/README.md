# google-contacts

Manage Google Contacts - search, list, create, update, and delete contacts with support for names, emails, phone numbers, and companies.

## Voice Triggers

- "Hey Cal, Find Mom's email"
- "Hey Cal, Lookup John Smith"
- "Hey Cal, Add a contact for Jane Doe"
- "Hey Cal, Update John's phone number"

## Required Services

google contacts

## Setup

No environment variables required.

### n8n Credentials

- **GOOGLECONTACTSOAUTH2API_CREDENTIAL** (`googleContactsOAuth2Api`)
  - n8n credential type: googleContactsOAuth2Api


## Installation

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "google-contacts"
4. Click Install and follow prompts

## Usage

Google Contacts suite - manage contacts. Parameters: action (required) - 'search', 'list', 'create', 'update', or 'delete'; query (required for search) - name to search for; limit (optional for list, default 10) - max contacts to return; first_name (required for create, optional for update); last_name (optional for create/update); email (optional for create/update); phone (optional for create/update); company (optional for create/update); contact_id (required for update/delete) - from search/list results. For update, only send fields you want to change. Examples: 'find Mom's email', 'add contact Jane Doe with email jane@example.com', 'update John's phone to 555-1234', 'delete the contact for Bob'.

## Author

[@cmac86](https://github.com/cmac86)

## Category

productivity

## Tags

productivity, google contacts
