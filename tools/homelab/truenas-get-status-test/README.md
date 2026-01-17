# truenas-get-status-test

Get TrueNAS system status including CPU, memory, storage pools, and running apps.

## Voice Triggers

- "Hey Cal, what's my TrueNAS status"
- "Hey Cal, how's my NAS doing"

## Required Services

truenas

## Setup

### Environment Variables

- `TRUENAS_URL`: Your TrueNAS server URL
  - Example: `http://192.168.1.100`


### n8n Credentials

- **TrueNAS API Key** (`httpHeaderAuth`)
  - n8n credential type: httpHeaderAuth


## Installation

### Via CAAL Tools Panel (Recommended)

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "truenas-get-status-test"
4. Click Install and follow prompts

### Via Command Line

```bash
curl -s https://raw.githubusercontent.com/CoreWorxLab/caal-tools/main/scripts/install.sh | bash -s truenas-get-status-test
```

## Usage

Get TrueNAS system status including CPU, memory, storage pools, and running apps.

## Author

[@cmac86](https://github.com/cmac86)

## Category

homelab

## Tags

homelab, truenas
