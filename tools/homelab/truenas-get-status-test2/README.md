# truenas-get-status-test2

Get TrueNAS system status including CPU, memory, storage pools, and running apps. No parameters required.

## Voice Triggers

- "Hey Cal, what's my TrueNAS status"
- "Hey Cal, how's my NAS doing"

## Required Services

truenas

## Setup

### Environment Variables

- `SERVICE_URL`: Your service URL
  - Example: `http://192.168.86.245`


### n8n Credentials

- **truenas_api** (`httpHeaderAuth`)
  - n8n credential type: httpHeaderAuth


## Installation

### Via CAAL Tools Panel (Recommended)

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "truenas-get-status-test2"
4. Click Install and follow prompts

### Via Command Line

```bash
curl -s https://raw.githubusercontent.com/CoreWorxLab/caal-tools/main/scripts/install.sh | bash -s truenas-get-status-test2
```

## Usage

Get TrueNAS system status including CPU, memory, storage pools, and running apps. No parameters required.

## Author

[@cmac86](https://github.com/cmac86)

## Category

homelab

## Tags

homelab, truenas
