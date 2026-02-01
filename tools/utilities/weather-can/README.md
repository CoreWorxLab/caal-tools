# weather-can

Gets current weather conditions or forecast for Canadian cities using Environment Canada official data.

## Voice Triggers

- "Hey Cal, What's the weather in Toronto?"
- "Hey Cal, Vancouver forecast"

## Required Services



## Setup

No environment variables required.

No credentials required.

## Installation

### Via CAAL Tools Panel (Recommended)

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "weather-can"
4. Click Install and follow prompts

### Via Command Line

```bash
curl -s https://raw.githubusercontent.com/CoreWorxLab/caal-tools/main/scripts/install.sh | bash -s weather-can
```

## Usage

Weather tool - forecast and current conditions for Canada.
Uses Environment Canada official data.

Parameters:
- action (required): 'forecast' or 'current'
- location (required): Canadian city name (e.g., Toronto, Vancouver, Calgary, Montreal, Ottawa)
- days (optional, default 5): forecast days ahead (1-6), use for 'next week' queries
- target_day (optional): specific weekday like 'Monday', use only for 'on Friday' style queries

Examples: 'Toronto weather', 'Vancouver forecast', 'Calgary right now' (action='current'), 'Montreal on Wednesday' (target_day='Wednesday')

## Author

[@cmac86](https://github.com/cmac86)

## Category

utilities

## Tags

utilities
