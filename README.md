# CAAL Tool Registry

Community-driven voice tools for [CAAL](https://github.com/CoreWorxLab/caal) - the voice assistant that actually does things.

## What is this?

This registry contains **voice-first n8n workflows** that extend CAAL's capabilities. Unlike generic n8n templates, these are optimized for:

- Voice triggers (how you'd actually say it)
- Low latency (< 5 second responses)
- Conversational responses (not raw JSON)
- One-click installation

## Browse Tools

**Have CAAL installed?** Browse and install tools directly in your CAAL web interface.

**Exploring before installing CAAL?** Browse by category below:

| Category | Tools |
|----------|-------|
| [Smart Home](tools/smart-home) | Home Assistant, lights, climate, security |
| [Media](tools/media) | Plex, Jellyfin, Jellyseerr, Sonarr, Radarr |
| [Homelab](tools/homelab) | TrueNAS, Docker, Proxmox, Unraid, PiHole |
| [Productivity](tools/productivity) | Calendar, tasks, email, notes |
| [Utilities](tools/utilities) | Weather, timers, reminders |
| [Social](tools/social) | Discord, Slack, Reddit, Telegram |
| [Other](tools/other) | Everything else |

## Install a Tool

### Quick Install

```bash
curl -s https://raw.githubusercontent.com/CoreWorxLab/caal-tools/main/scripts/install.sh | bash -s <tool-name>
```

Example:
```bash
curl -s https://raw.githubusercontent.com/CoreWorxLab/caal-tools/main/scripts/install.sh | bash -s truenas-get-status
```

### Manual Install

1. Download the `workflow.json` from the tool's folder
2. Import into n8n (Settings > Import from File)
3. Create required credentials (listed in the tool's README)
4. Update any service URLs
5. Activate the workflow
6. Tell CAAL to refresh: `curl -X POST http://localhost:8889/reload-tools`

## Contribute

We need tools! See [CONTRIBUTING.md](CONTRIBUTING.md) for how to submit your own.

**Want a tool that doesn't exist?** [Request it](https://github.com/CoreWorxLab/caal-tools/issues/new?template=tool-request.md)!

## Tool Quality Tiers

| Tier | Badge | Meaning |
|------|-------|---------|
| Verified | Gold | Reviewed + tested + proven |
| Community | Silver | Passed automated review |
| Experimental | Warning | New submission |

## For CAAL Developers

CAAL can query this registry directly:

```python
import httpx

REGISTRY_INDEX = "https://registry.caal.io/index.json"

async def search_registry(query: str) -> list[dict]:
    async with httpx.AsyncClient() as client:
        resp = await client.get(REGISTRY_INDEX)
        tools = resp.json()

    query_lower = query.lower()
    return [t for t in tools if query_lower in t['name'] or query_lower in t['description'].lower()]
```

## License

MIT - Build what you want, share what you can.
