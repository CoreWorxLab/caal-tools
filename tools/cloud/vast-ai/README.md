# vast-ai

Vast.ai GPU cloud management: search GPU offers, rent instances, start/stop/reboot/destroy, check balance, view logs, and label instances. Requires a [Vast.ai account](https://vast.ai/) with credit balance.

## Voice Triggers

- "Find me a cheap 4090"
- "Search for GPU offers"
- "What instances do I have running?"
- "Show me my GPU instance"
- "How much credit do I have on Vast?"
- "Rent a GPU"
- "Start my instance"
- "Stop my instance"
- "Reboot the GPU server"
- "Destroy my instance"
- "Show me the instance logs"
- "Label that instance"

## Required Services

vast-ai

## Setup

### n8n Credentials

- **VASTAI_API_KEY** (`httpHeaderAuth`)
  - Header Name: `Authorization`
  - Header Value: `Bearer YOUR_API_KEY`
  - Get your API key from [Vast.ai Console](https://cloud.vast.ai/cli/)

### Environment Variables

- **VASTAI_SEARCH_REGION** - Comma-separated ISO 3166-1 alpha-2 country codes to filter GPU search results by region. Defaults to `US,CA` (North America) if not set.

  Examples:
  - `US,CA` - North America
  - `US,CA,MX` - North America including Mexico
  - `DE,FR,NL,SE,FI` - Western/Northern Europe
  - `GB,IE` - UK and Ireland
  - `JP,KR,SG,AU` - Asia-Pacific
  - `US` - United States only

  Common country codes: US, CA, MX, GB, DE, FR, NL, SE, NO, FI, DK, PL, CZ, RO, BG, UA, IS, ES, IT, JP, KR, SG, AU, IN, BR

## Actions

| Action | Description | Required Params |
|--------|-------------|-----------------|
| `search_offers` | Search available GPU rental offers | Optional: `gpu_name`, `num_gpus`, `max_price`, `min_ram`, `limit` |
| `list_instances` | List all your rented instances | None |
| `show_instance` | Get detailed instance info (SSH, status, specs) | `instance_id` |
| `get_balance` | Check account credit balance | None |
| `create_instance` | Rent a GPU from a search offer | `offer_id`, optional: `image`, `disk`, `label` |
| `start_instance` | Start a stopped instance | `instance_id` |
| `stop_instance` | Stop a running instance | `instance_id` |
| `reboot_instance` | Reboot an instance | `instance_id` |
| `destroy_instance` | Permanently destroy an instance | `instance_id` |
| `get_logs` | Get container logs | `instance_id` |
| `label_instance` | Set a label on an instance | `instance_id`, `label` |

## Defaults

- **Search region**: `US,CA` (configurable via `VASTAI_SEARCH_REGION`)
- **Docker image**: `vastai/pytorch:@vastai-automatic-tag` (if not specified on create)
- **Disk space**: 100 GB (if not specified on create)
- **Connection type**: Direct port (always filtered in search)
- **Sort order**: Price ascending (cheapest first)
- **Verified hosts only**: Yes
