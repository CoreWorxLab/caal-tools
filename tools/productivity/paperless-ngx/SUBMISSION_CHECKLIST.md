# CAAL Tools Submission Checklist - Paperless-ngx

## Pre-Submission Checklist

### ✅ Required Files
- [x] `workflow.json` - n8n workflow export
- [x] `manifest.json` - Tool metadata
- [x] `README.md` - Complete documentation

### ✅ Workflow Requirements
- [x] Webhook trigger configured with path `paperless_ngx`
- [x] Webhook notes contain comprehensive tool description
- [x] Webhook notes document all parameters with examples
- [x] MCP enabled: `"settings": {"availableInMCP": true}`
- [x] Returns voice-friendly responses in format `{message: "...", data: {...}}`
- [x] Error handling with helpful messages
- [x] All actions properly routed via Switch node

### ✅ Manifest Requirements
- [x] Unique ID: `paperless-ngx-suite`
- [x] Tool suite name: `paperless-ngx`
- [x] Friendly name: `Paperless-ngx`
- [x] Category: `productivity`
- [x] Tool suite flag: `true`
- [x] Actions listed: `search`, `get`, `update`, `tags`, `correspondents`, `types`
- [x] At least 2 voice triggers provided
- [x] Required credentials documented
- [x] Required variables documented (PAPERLESS_URL)
- [x] Author information included
- [x] Tags added for searchability

### ✅ Security & Portability
- [x] No hardcoded secrets
- [x] No hardcoded URLs (uses `$env.PAPERLESS_URL`)
- [x] Credentials use n8n credential system
- [x] User-specific values parameterized

### ✅ Documentation Requirements
- [x] Clear description of what the tool does
- [x] Installation instructions with all steps
- [x] Environment variable setup instructions
- [x] Credential setup instructions
- [x] Voice trigger examples
- [x] Parameter reference for all actions
- [x] Testing instructions
- [x] Troubleshooting guide
- [x] Example responses

### ✅ Voice-First Design
- [x] Responses are brief and conversational
- [x] Plain text output (no markdown/JSON in voice responses)
- [x] Natural language phrasing
- [x] Limited list sizes (5 items max in voice response)
- [x] Both `message` and `data` fields returned

### ✅ Testing
- [x] Tested in n8n with manual execution
- [x] All 6 actions tested successfully
- [x] Credentials work correctly
- [x] Environment variable access works
- [x] API responses are properly formatted
- [x] Error cases handled gracefully

## Submission Information

### Tool Details
- **Name**: paperless-ngx
- **Category**: productivity
- **Tier**: coreworxlab
- **Author**: JdCpuWiz (shad@deckerzoo.com)
- **Version**: 1.0.0
- **Created**: 2026-02-09

### Actions Supported
1. **search** - Full-text document search
2. **get** - Retrieve specific or recent documents
3. **update** - Modify document metadata
4. **tags** - List tags or filter documents by tag
5. **correspondents** - Browse correspondents and their documents
6. **types** - List document types

### Required Services
- Paperless-ngx (self-hosted document management system)

### Required Credentials
- httpHeaderAuth: Paperless API token (format: `Token YOUR_KEY`)

### Required Variables
- `PAPERLESS_URL`: Paperless-ngx instance URL (e.g., `http://192.168.1.100:8000`)
- `N8N_BLOCK_ENV_ACCESS_IN_NODE=false`: n8n setting to allow env var access

## How to Submit to CAAL Tools Registry

### Option 1: Submit as Pull Request

1. **Fork the CAAL Tools Repository**
   ```bash
   # Visit https://github.com/CoreWorxLab/caal-tools
   # Click "Fork" button
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/caal-tools
   cd caal-tools
   ```

3. **Copy your tool files**
   ```bash
   mkdir -p tools/productivity/paperless-ngx
   cp /path/to/your/workflow.json tools/productivity/paperless-ngx/
   cp /path/to/your/manifest.json tools/productivity/paperless-ngx/
   cp /path/to/your/README.md tools/productivity/paperless-ngx/
   ```

4. **Validate (if scripts available)**
   ```bash
   node scripts/validate.js tools/productivity/paperless-ngx
   node scripts/check-secrets.js tools/productivity/paperless-ngx/workflow.json
   ```

5. **Create a branch and commit**
   ```bash
   git checkout -b add-paperless-ngx
   git add tools/productivity/paperless-ngx/
   git commit -m "feat: add paperless-ngx document management tool"
   git push origin add-paperless-ngx
   ```

6. **Open Pull Request**
   - Go to your fork on GitHub
   - Click "Compare & pull request"
   - Fill in the PR template with:
     - Description of the tool
     - What it does
     - Testing performed
     - Screenshots/examples if applicable

### Option 2: Share Directly

If you prefer to share your tool without going through the PR process:

1. **Ensure your repository is public**
   - https://github.com/JdCpuWiz/n8n_workflows

2. **Share the tool location**
   - Tool path: `tools/productivity/paperless-ngx/`
   - Direct link: https://github.com/JdCpuWiz/n8n_workflows/tree/main/tools/productivity/paperless-ngx

3. **Contact CAAL team**
   - Open an issue on the CAAL tools repository
   - Share your tool repository link
   - Provide brief description

## Post-Submission

After submission:
- Monitor PR for feedback/review comments
- Address any requested changes
- Update documentation if needed
- Celebrate when merged! 🎉

## Future Enhancements

Ideas for v2.0:
- [ ] Add document upload functionality
- [ ] Support for custom fields
- [ ] Bulk operations (tag multiple documents)
- [ ] Advanced search with filters
- [ ] Document download/export
- [ ] Integration with document content search
- [ ] Support for saved views
- [ ] Workflow automation triggers

## Notes

- Tool has been tested and verified working on 2026-02-09
- Requires n8n with environment variable access enabled
- Works with Paperless-ngx v1.x and v2.x
- No external dependencies beyond Paperless-ngx API
