# truenas

Manage TrueNAS system status and control apps - check system health, resources, and storage pools, or start, stop, and restart applications.

## Voice Triggers

- "Hey Cal, What's my TrueNAS status?"
- "Hey Cal, Check my NAS"

## Required Services

truenas

## Setup

### Environment Variables

- `TRUENAS_URL`: Your TrueNAS server URL and port
  - Example: `http://192.168.1.100:8080`
- `CAAL_ANNOUNCE_URL`: Your CAAL announcement service URL
  - Example: `http://192.168.1.50:8889`


### n8n Credentials

- **HTTPHEADERAUTH_CREDENTIAL** (`httpHeaderAuth`)
  - n8n credential type: httpHeaderAuth


## Installation

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "truenas"
4. Click Install and follow prompts

## Usage

TrueNAS server suite - status and app control. Parameters: action (required) - 'status' or 'control'; app (required for control) - app name; command (required for control) - 'start', 'stop', or 'restart'. Examples: 'what's my TrueNAS status', 'restart Plex on TrueNAS', 'stop the Jellyfin app'.

## Author

[@cmac86](https://github.com/cmac86)

## Category

homelab

## Tags

homelab, truenas
