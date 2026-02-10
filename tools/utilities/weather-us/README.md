# weather-us

Gets weather forecasts and current conditions for US cities using NOAA Weather.gov official data.

## Voice Triggers

- "Hey Cal, What's the weather in Chicago?"
- "Hey Cal, Austin forecast for next week"
- "Hey Cal, What's the current weather in Seattle?"
- "Hey Cal, Portland weather tomorrow"
- "Hey Cal, Miami forecast for Wednesday"

## Required Services

None - uses free NOAA Weather.gov API and OpenStreetMap Nominatim geocoding

## Setup

No environment variables required.

No credentials required.

No API keys needed.

## Installation

### Via CAAL Tools Panel (Recommended)

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "weather-us"
4. Click Install and follow prompts

### Via Command Line

```bash
curl -s https://raw.githubusercontent.com/CoreWorxLab/caal-tools/main/scripts/install.sh | bash -s weather-us
```

## Usage

Weather tool - forecast and current conditions for US locations.
Uses NOAA Weather.gov official data with automatic location geocoding.

### Parameters

- **action** (required): 'forecast' or 'current'
- **location** (required): US city name with state
  - Formats: 'Chicago Illinois', 'Chicago, Illinois', 'Austin TX', 'Austin, TX'
- **days** (optional, default 3): forecast days ahead (1-7)
  - Use for 'next week' queries
- **target_day** (optional): specific weekday like 'Monday'
  - Use only for 'on Friday' style queries

### Examples

Voice queries:
- "Chicago weather" → 3-day forecast for Chicago
- "Austin forecast" → 3-day forecast for Austin
- "Portland tomorrow" → 1-day forecast (days=1)
- "Seattle on Wednesday" → Wednesday's forecast (target_day='Wednesday')
- "What's the current weather in Miami" → Current conditions

API request:
```bash
curl -X POST 'http://your-n8n:5678/webhook/weather_us' \
  -H 'Content-Type: application/json' \
  -d '{"action": "forecast", "location": "Chicago Illinois"}'
```

### Response Format

```json
{
  "error": false,
  "message": "Chicago, Illinois. Today: Partly Sunny, 36 degrees, wind 10 mph. Tuesday: Partly Sunny, 41 degrees.",
  "location": "Chicago",
  "state": "Illinois",
  "forecasts": [
    {
      "name": "Today",
      "temperature": 36,
      "temperatureUnit": "F",
      "shortForecast": "Partly Sunny",
      "detailedForecast": "...",
      "windSpeed": "10 mph",
      "windDirection": "NW",
      "isDaytime": true
    }
  ]
}
```

## How It Works

1. **Location Input**: Receives city/state location name from CAAL
2. **Geocoding**: Converts location to coordinates using OpenStreetMap Nominatim
   - Uses structured query format for reliability
   - Handles multiple location formats (with/without commas, state abbreviations)
3. **Zone Lookup**: Calls Weather.gov /points API to find the correct NOAA forecast zone
4. **Data Retrieval**: Fetches forecast or current observation data from NOAA
5. **Voice Format**: Returns brief, conversational response optimized for voice output

## Technical Details

- **Geocoding**: OpenStreetMap Nominatim (structured city/state/country queries)
- **Weather Data**: NOAA Weather.gov API (free, no authentication)
- **Coverage**: Continental United States
- **Response Time**: ~2-3 seconds per request
- **Rate Limiting**: None (uses free public APIs)

## Troubleshooting

### "Sorry, I couldn't find [location]"
- Include the full state name: "Portland Oregon" not just "Portland"
- Try state abbreviation: "Portland OR"
- Verify the city name spelling

### No current weather data
- NOAA observation stations may not be available for all locations
- Try a larger nearby city
- Use "forecast" action instead

### Weather data not available
- Location may be outside continental US
- NOAA service may be temporarily unavailable

## Author

[@shad](https://github.com/shad)

## Category

utilities

## Tags

weather, utilities, us, noaa, forecast, geocoding
