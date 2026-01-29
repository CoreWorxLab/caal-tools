# sonarr

Manage Sonarr TV show library - view upcoming episodes and search for shows.

## Voice Triggers

- "Hey Cal, What TV shows are coming up?"
- "Hey Cal, Search for Breaking Bad on Sonarr"

## Required Services

sonarr

## Setup

### Environment Variables

- `SONARR_URL`: Your Sonarr server URL and port
  - Example: `http://192.168.1.100:8282`


### n8n Credentials

- **HTTPHEADERAUTH_CREDENTIAL** (`httpHeaderAuth`)
  - n8n credential type: httpHeaderAuth


## Installation

### Via CAAL Tools Panel (Recommended)

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "sonarr"
4. Click Install and follow prompts

### Via Command Line

```bash
curl -s https://raw.githubusercontent.com/CoreWorxLab/caal-tools/main/scripts/install.sh | bash -s sonarr
```

## Usage

Sonarr TV show suite - calendar and search. Parameters: action (required) - 'calendar' or 'search'; query (required for search) - show name; days (optional for calendar, default 7) - days to look ahead. Examples: 'what TV shows are coming up', 'search for Breaking Bad on Sonarr', 'what's on TV this week'.

## Author

[@cmac86](https://github.com/cmac86)

## Category

media

## Tags

media, sonarr
