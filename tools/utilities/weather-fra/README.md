# weather-fra

Gets current weather conditions and forecast data for French cities using the Open-Meteo API.

## Voice Triggers

- "Hey Cal, What's the weather in Paris?"
- "Hey Cal, Paris forecast"

## Required Services



## Setup

No environment variables required.

No credentials required.

## Installation

### Via CAAL Tools Panel (Recommended)

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "weather-fra"
4. Click Install and follow prompts

### Via Command Line

```bash
curl -s https://raw.githubusercontent.com/CoreWorxLab/caal-tools/main/scripts/install.sh | bash -s weather-fra
```

## Usage

Weather tool - forecast and current conditions for France.
Uses Open-Meteo API (free, no key required).

Parameters:
- action (required): 'forecast' or 'current'
- location (required): French city name (e.g., Paris, Lyon, Marseille, Toulouse, Bordeaux)
- days (optional, default 5): forecast days ahead (1-7)
- target_day (optional): specific weekday like 'Lundi', use for 'on Friday' style queries

Examples: 'Paris weather', 'Lyon forecast', 'Marseille right now' (action='current'), 'Toulouse on Wednesday' (target_day='Mercredi')

## Author

[@mmaudet](https://github.com/mmaudet)

## Category

utilities

## Tags

utilities
