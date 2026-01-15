# Contributing to CAAL Tool Registry

Thanks for contributing! This registry grows through community submissions.

## Submitting a Tool

### 1. Fork and Clone

```bash
git clone https://github.com/YOUR_USERNAME/caal-tools
cd caal-tools
```

### 2. Create Your Tool

```bash
# Pick the right category
mkdir -p tools/media/my-awesome-tool
cd tools/media/my-awesome-tool
```

### 3. Add Required Files

Copy from templates:

```bash
cp ../../../templates/workflow-template.json workflow.json
cp ../../../templates/manifest-template.json manifest.json
cp ../../../templates/readme-template.md README.md
```

### 4. Build Your Workflow

1. Create and test your workflow in n8n
2. Export the workflow JSON
3. Replace any hardcoded URLs with `${VARIABLE_NAME}` placeholders
4. Ensure your webhook node has a description in the notes field

**Important:** The webhook description is what CAAL uses to understand what your tool does. Write it in plain English, include example phrases, and document the parameters.

Example webhook notes:
```
Gets the current price of a stock by ticker symbol.
User says: "what's the price of AAPL?"

Parameters:
- symbol (string, required): Stock ticker symbol (e.g., AAPL, GOOGL)
```

### 5. Fill Out the Manifest

Update `manifest.json` with:

| Field | Description |
|-------|-------------|
| `name` | kebab-case identifier (e.g., `jellyseerr-search`) |
| `description` | Voice-friendly description of what it does |
| `category` | One of: `smart-home`, `media`, `homelab`, `productivity`, `utilities` |
| `voice_triggers` | Array of example phrases (at least 2) |
| `required_services` | External services needed (e.g., `["jellyseerr"]`) |
| `required_credentials` | Credentials to create in n8n |
| `required_variables` | URLs or config values the user must provide |
| `author` | Your GitHub username and name |
| `tags` | Searchable keywords |

### 6. Write the README

- Show example voice triggers
- Explain what the tool does
- List requirements
- Include an example of what CAAL says in response

### 7. Validate Locally

```bash
node scripts/validate.js tools/media/my-awesome-tool
node scripts/check-secrets.js tools/media/my-awesome-tool/workflow.json
```

### 8. Submit PR

```bash
git checkout -b add-my-awesome-tool
git add .
git commit -m "feat: add my-awesome-tool"
git push origin add-my-awesome-tool
```

Open a PR. The review process will:
1. Validate your submission structure
2. Check for hardcoded secrets
3. Review for voice-friendliness
4. Post feedback as PR comments

## Quality Standards

Your tool must:

- [ ] Have a webhook trigger with description in notes
- [ ] Include at least 2 voice trigger examples
- [ ] Return voice-friendly responses (not raw JSON)
- [ ] Handle errors gracefully with helpful messages
- [ ] Not contain hardcoded secrets or user-specific URLs
- [ ] Complete in under 5 seconds for good voice UX

## Tool Tiers

| Tier | Badge | Meaning |
|------|-------|---------|
| Verified | Gold | Passed auto + manual review, proven usage |
| Community | Silver | Passed automated review |
| Experimental | Warning | Submitted, awaiting review |

New submissions start as Experimental and get promoted based on reviews and usage.

## Categories

| Category | Description |
|----------|-------------|
| `smart-home` | Home Assistant, lights, climate, security |
| `media` | Plex, Jellyfin, Jellyseerr, Sonarr, Radarr |
| `homelab` | TrueNAS, Docker, Proxmox, Unraid, PiHole, server monitoring |
| `productivity` | Calendar, tasks, email, notes |
| `utilities` | Weather, timers, reminders, general purpose |
| `social` | Discord, Slack, Reddit, Telegram, messaging |
| `other` | Everything else |

## Voice-First Design Principles

1. **Speak naturally** - Triggers should be how people actually talk
2. **Be concise** - Voice responses should be brief and scannable by ear
3. **Handle ambiguity** - Multiple ways to ask for the same thing
4. **Fail gracefully** - Error messages should be helpful, not technical

## Questions?

Open an issue with the "question" label or join the [CAAL Discord](https://discord.gg/caal).
