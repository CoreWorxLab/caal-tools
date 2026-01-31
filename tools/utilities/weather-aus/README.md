# weather-aus

Get Australian weather forecasts or current conditions for any city, suburb, or postcode.

## Voice Triggers

- "Hey Cal, What's the weather in Sydney?"
- "Hey Cal, Give me the forecast for Melbourne"

## Required Services



## Setup

No environment variables required.

No credentials required.

## Installation

### Via CAAL Tools Panel (Recommended)

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "weather-aus"
4. Click Install and follow prompts

### Via Command Line

```bash
curl -s https://raw.githubusercontent.com/CoreWorxLab/caal-tools/main/scripts/install.sh | bash -s weather-aus
```

## Usage

Australian weather tool.
Parameters:

action (required)
- "forecast" | "current"

location (required)
- Australian city, suburb, or postcode
- Do not include state or country (e.g. "Sydney", not "Sydney NSW")

days (optional)
- Integer 1–7
- Forecast only

target_day (optional)
- Weekday name (e.g. "Monday")
- Forecast only

## Author

[@AbdulShahzeb](https://github.com/AbdulShahzeb)

## Category

utilities

## Tags

utilities
