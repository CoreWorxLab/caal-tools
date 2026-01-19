# truenas-get-status

Gets TrueNAS system status including CPU, memory, storage pools, and running apps.

## Voice Triggers

- "Hey Cal, What's my TrueNAS status?"
- "Hey Cal, Check my NAS"

## Required Services

truenas

## Setup

### Environment Variables

- `TRUENAS_URL`: Your TrueNAS server URL (IP and port)
  - Example: `http://192.168.1.100:80`


### n8n Credentials

- **HTTPHEADERAUTH_CREDENTIAL** (`httpHeaderAuth`)
  - n8n credential type: httpHeaderAuth


## Installation

### Via CAAL Tools Panel (Recommended)

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "truenas-get-status"
4. Click Install and follow prompts

### Via Command Line

```bash
curl -s https://raw.githubusercontent.com/CoreWorxLab/caal-tools/main/scripts/install.sh | bash -s truenas-get-status
```

## Usage

Get TrueNAS system status including CPU, memory, storage pools, and running apps. No parameters required.

## Author

[@cmac86](https://github.com/cmac86)

## Category

homelab

## Tags

homelab, truenas
