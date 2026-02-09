# Paperless-ngx Document Management

Voice-controlled document management for your Paperless-ngx instance. Search, retrieve, update, and organize your documents through CAAL.

## What It Does

This tool suite integrates your Paperless-ngx document management system with CAAL, allowing you to:

- 🔍 Search documents by keyword
- 📄 Retrieve document details and recent documents
- ✏️ Update document metadata (tags, correspondents, types, dates)
- 🏷️ Manage and query tags
- 👤 Browse correspondents and their documents
- 📁 List document types and filter by type

## Voice Triggers

**Search documents:**
- "Search paperless for tax documents"
- "Find invoices in paperless"
- "Look up receipt in my documents"

**Get documents:**
- "Show me recent documents in paperless"
- "Get document 123 from paperless"
- "What documents did I add today?"
- "Show documents from this week"

**Update documents:**
- "Update document 456 with tag invoice"
- "Tag document 789 as important"
- "Set correspondent for document 123 to John Doe"

**Browse tags:**
- "List all tags in paperless"
- "What tags do I have?"
- "Show documents tagged as receipt"

**Browse correspondents:**
- "List my correspondents in paperless"
- "Show documents from John Doe"
- "What documents are from the IRS?"

**Browse document types:**
- "What document types do I have?"
- "Show all invoices"
- "List documents of type tax"

## Requirements

### Services
- **Paperless-ngx** - Self-hosted document management system

### Credentials
You'll need to create a credential in n8n:

| Credential Type | Name | Configuration |
|----------------|------|---------------|
| `httpHeaderAuth` | `Paperless API` | Header: `Authorization`<br>Value: `Token YOUR_API_KEY` |

**To get your API key:**
1. Log into Paperless-ngx web UI
2. Go to **Settings** → **API Tokens**
3. Create a new token or copy existing token
4. Use format: `Token <your_token_here>`

## Installation

### 1. Enable Environment Variable Access in n8n

By default, n8n blocks access to environment variables for security. You need to enable it:

**For Docker/Docker Compose**, add this to your n8n service environment:

```yaml
services:
  n8n:
    environment:
      - N8N_BLOCK_ENV_ACCESS_IN_NODE=false
      - PAPERLESS_URL=http://YOUR_PAPERLESS_IP:8000
```

**Or add to your `.env` file:**

```bash
N8N_BLOCK_ENV_ACCESS_IN_NODE=false
PAPERLESS_URL=http://192.168.1.100:8000
```

**Then restart n8n:**
```bash
docker-compose restart n8n
```

### 2. Import Workflow

1. Download `workflow.json` from this repository
2. In n8n: **+ Add workflow** → **Import from file**
3. Select the downloaded file

### 3. Create Credential in n8n

1. Open n8n → **Settings** → **Credentials**
2. Click **Add Credential**
3. Select **Header Auth**
4. Configure exactly as follows:
   - **Credential Name**: `Paperless API` (or any name you prefer)
   - **Name**: `Authorization` (exactly as shown, capital A)
   - **Value**: `Token YOUR_API_KEY_HERE`
     - Replace YOUR_API_KEY_HERE with your actual Paperless API token
     - **Important**: There must be exactly ONE space between "Token" and your key
     - Example: `Token abc123def456` (not `Token  abc123` or `Tokenabc123`)
5. Click **Save**

**To get your Paperless API key:**
- Log into Paperless-ngx web UI
- Go to Settings → API Tokens
- Create a new token or copy an existing one

### 4. Link Credential to Workflow

1. Open the paperless_ngx workflow
2. Click on **each HTTP Request node** (Search Documents, Get Documents, Update Document, Get Tags, Get Correspondents, Get Types)
3. For each node, configure authentication:
   - **Authentication**: `Predefined Credential Type`
   - **Credential Type**: `Header Auth`
   - **Credential for Header Auth**: Select your `Paperless API` credential from dropdown
4. After linking all nodes, **Save** the workflow
5. **Activate the workflow** (toggle in top right)
6. Verify **"Available in MCP"** is enabled in workflow settings → Settings tab

### 5. Configure CAAL

1. Open CAAL Settings → **Integrations** → **n8n**
2. Ensure n8n is connected
3. Run: `/reload-tools` or say "reload tools"
4. The `paperless_ngx` tool should appear in your tools list

## Usage Examples

### Search for Documents

**You say:** "Search paperless for tax documents"

**CAAL responds:** "Found 5 documents. Top results: 2023 Tax Return, 2024 Tax Estimate, Property Tax Bill"

**Data returned:**
```json
{
  "message": "Found 5 documents...",
  "documents": [
    {
      "id": 123,
      "title": "2023 Tax Return",
      "created": "2024-03-15",
      "correspondent": "IRS",
      "tags": ["tax", "important"]
    }
  ],
  "total": 5
}
```

### Get Recent Documents

**You say:** "Show me documents from this week"

**CAAL responds:** "Found 8 recent documents. Latest: Invoice 2024-02-09, Receipt Costco, Bank Statement February"

### Get Specific Document

**You say:** "Get document 123"

**CAAL responds:** "Document 123: 2023 Tax Return. Created March 15, 2024. From IRS. Tags: tax, important."

### Update Document

**You say:** "Update document 456 with tag invoice"

**CAAL responds:** "Updated document 456: February Invoice. Tags: invoice, paid"

### List Tags

**You say:** "List all tags in paperless"

**CAAL responds:** "Found 15 tags: invoice, receipt, tax, important, paid, bank, insurance, medical, utilities, and more"

### Browse by Correspondent

**You say:** "Show documents from John Doe"

**CAAL responds:** "Found 12 documents from that correspondent. Top results: Contract 2024, Invoice Feb, Letter Jan 15"

## Parameters Reference

### Action: `search`
Search documents by keyword or phrase.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `action` | string | Yes | Must be `search` |
| `query` | string | Yes | Search terms or keywords |
| `limit` | integer | No | Number of results (default: 10) |
| `ordering` | string | No | Sort order: `created` or `-created` (newest first, default) |

**Example:**
```json
{
  "action": "search",
  "query": "tax invoice",
  "limit": 5
}
```

### Action: `get`
Retrieve document details or recent documents.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `action` | string | Yes | Must be `get` |
| `document_id` | integer | No | Specific document ID; if omitted, returns recent documents |
| `limit` | integer | No | Number of recent documents (default: 10) |
| `filter` | string | No | Date filter: `today`, `week`, `month` |

**Example (specific document):**
```json
{
  "action": "get",
  "document_id": 123
}
```

**Example (recent documents):**
```json
{
  "action": "get",
  "filter": "week",
  "limit": 5
}
```

### Action: `update`
Update document metadata.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `action` | string | Yes | Must be `update` |
| `document_id` | integer | Yes | Document ID to update |
| `title` | string | No | New document title |
| `tags` | string | No | Comma-separated tag names or IDs |
| `correspondent` | string | No | Correspondent name or ID |
| `document_type` | string | No | Document type name or ID |
| `date` | string | No | Document date (YYYY-MM-DD) |
| `archive_serial_number` | string | No | ASN for the document |

**Example:**
```json
{
  "action": "update",
  "document_id": 456,
  "title": "Updated Invoice Title",
  "tags": "invoice,paid",
  "correspondent": "Vendor ABC",
  "date": "2024-02-09"
}
```

### Action: `tags`
List all tags or get documents by tag.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `action` | string | Yes | Must be `tags` |
| `action_type` | string | No | `list` (default) or `get` |
| `tag_name` | string | No | Tag name to filter by (when action_type=`get`) |
| `tag_id` | integer | No | Specific tag ID (when action_type=`get`) |

**Example (list all tags):**
```json
{
  "action": "tags",
  "action_type": "list"
}
```

**Example (get documents by tag):**
```json
{
  "action": "tags",
  "action_type": "get",
  "tag_name": "invoice"
}
```

### Action: `correspondents`
List all correspondents or get documents by correspondent.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `action` | string | Yes | Must be `correspondents` |
| `action_type` | string | No | `list` (default) or `get` |
| `correspondent_name` | string | No | Correspondent name to filter by (when action_type=`get`) |
| `correspondent_id` | integer | No | Specific correspondent ID (when action_type=`get`) |

**Example (list all correspondents):**
```json
{
  "action": "correspondents",
  "action_type": "list"
}
```

**Example (get documents by correspondent):**
```json
{
  "action": "correspondents",
  "action_type": "get",
  "correspondent_name": "John Doe"
}
```

### Action: `types`
List all document types or get documents by type.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `action` | string | Yes | Must be `types` |
| `action_type` | string | No | `list` (default) or `get` |
| `type_name` | string | No | Document type name to filter by (when action_type=`get`) |
| `type_id` | integer | No | Specific document type ID (when action_type=`get`) |

**Example (list all types):**
```json
{
  "action": "types",
  "action_type": "list"
}
```

**Example (get documents by type):**
```json
{
  "action": "types",
  "action_type": "get",
  "type_name": "invoice"
}
```

## Testing

Test the webhook directly with curl:

```bash
# Search for documents
curl -X POST http://your-n8n:5678/webhook/paperless_ngx \
  -H "Content-Type: application/json" \
  -d '{
    "action": "search",
    "query": "invoice",
    "limit": 5
  }'

# Get recent documents
curl -X POST http://your-n8n:5678/webhook/paperless_ngx \
  -H "Content-Type: application/json" \
  -d '{
    "action": "get",
    "filter": "week"
  }'

# Get specific document
curl -X POST http://your-n8n:5678/webhook/paperless_ngx \
  -H "Content-Type: application/json" \
  -d '{
    "action": "get",
    "document_id": 123
  }'

# Update document
curl -X POST http://your-n8n:5678/webhook/paperless_ngx \
  -H "Content-Type: application/json" \
  -d '{
    "action": "update",
    "document_id": 456,
    "tags": "invoice,paid"
  }'

# List tags
curl -X POST http://your-n8n:5678/webhook/paperless_ngx \
  -H "Content-Type: application/json" \
  -d '{
    "action": "tags",
    "action_type": "list"
  }'
```

## Testing

Before using with CAAL, test the workflow directly in n8n:

### Test with curl

Verify your Paperless API is accessible:

```bash
curl -H "Authorization: Token YOUR_API_KEY" \
  http://YOUR_PAPERLESS_URL:8000/api/correspondents/
```

You should get a JSON response with your correspondents list.

### Test in n8n

1. Open the workflow in n8n
2. Click **"Execute Workflow"** button
3. Click on the **Webhook** node
4. Click **"Listen for Test Event"** or manually provide test data
5. Use this test JSON:
   ```json
   {
     "action": "correspondents",
     "action_type": "list"
   }
   ```
6. Click **"Execute Node"**
7. Check the results - you should see your correspondents list

### Other Test Cases

**Search documents:**
```json
{"action": "search", "query": "invoice"}
```

**Get recent documents:**
```json
{"action": "get", "filter": "week"}
```

**List tags:**
```json
{"action": "tags", "action_type": "list"}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Access to env vars denied" | Set `N8N_BLOCK_ENV_ACCESS_IN_NODE=false` in n8n environment and restart |
| "Connection refused" | Verify `PAPERLESS_URL` is correct and Paperless-ngx is running |
| "Unauthorized" or "403" | Check API token is correct with format `Token YOUR_KEY` (one space between Token and key) |
| "Tool not appearing in CAAL" | Ensure workflow is active and "Available in MCP" is enabled, then run `/reload-tools` in CAAL |
| "No documents found" | Verify documents exist in Paperless-ngx and query terms are correct |
| "Empty response" | Check n8n workflow execution log for errors |
| "$env.PAPERLESS_URL is undefined" | Verify environment variable is set and n8n has been restarted |

## Notes

- Document searches use Paperless-ngx's built-in full-text search
- Tag, correspondent, and document type names are matched by exact name or ID
- The `update` action uses PATCH, so only fields you specify will be updated
- All date filters use ISO format (YYYY-MM-DD)
- Document lists are limited to 5 items in voice responses to keep output concise

## API Reference

This tool uses the Paperless-ngx REST API. For more details, see:
- [Paperless-ngx Documentation](https://docs.paperless-ngx.com/)
- [Paperless-ngx API Documentation](https://docs.paperless-ngx.com/api/)

## Support

For issues or questions:
- Check the [CAAL Discord](https://discord.gg/caal)
- Open an issue in the [CAAL Tools Repository](https://github.com/CoreWorxLab/caal-tools)
- Review Paperless-ngx logs for API errors

## Version

- **Version**: 1.0.0
- **Created**: 2026-02-09
- **Author**: [@cmac86](https://github.com/cmac86)
- **Category**: Productivity
- **Tier**: CoreWorxLab
