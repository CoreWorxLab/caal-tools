# radarr

Manage Radarr movies - view upcoming releases and search your library.

## Voice Triggers

- "Hey Cal, What movies are coming out?"
- "Hey Cal, Search for Dune on Radarr"

## Required Services

radarr

## Setup

### Environment Variables

- `RADARR_URL`: Your Radarr server URL and port
  - Example: `http://192.168.1.100:8484`


### n8n Credentials

- **HTTPHEADERAUTH_CREDENTIAL** (`httpHeaderAuth`)
  - n8n credential type: httpHeaderAuth


## Installation

### Via CAAL Tools Panel (Recommended)

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "radarr"
4. Click Install and follow prompts

### Via Command Line

```bash
curl -s https://raw.githubusercontent.com/CoreWorxLab/caal-tools/main/scripts/install.sh | bash -s radarr
```

## Usage

Radarr movie suite - calendar and search. Parameters: action (required) - 'calendar' or 'search'; query (required for search) - movie name; days (optional for calendar, default 30) - days to look ahead. Examples: 'what movies are coming out', 'search for Dune on Radarr', 'do I have Inception'.

## Author

[@cmac86](https://github.com/cmac86)

## Category

media

## Tags

media, radarr
