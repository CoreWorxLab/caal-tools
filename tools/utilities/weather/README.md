# Weather

A comprehensive weather tool providing current conditions and multi-day forecasts for locations across Australia, Canada, France, and the United States. Access real-time weather data from official meteorological services including Australia's Bureau of Meteorology, Environment and Climate Change Canada, Météo-France via Open-Meteo, and the US National Weather Service.

## Voice Triggers

- "Hey Cal, What's the weather in Sydney?"
- "Hey Cal, Is it raining in Chicago?"
- "Hey Cal, What's the forecast for this weekend?"
- "Hey Cal, Will it rain on Thursday in Vancouver?"
- "Hey Cal, What's the temperature in Paris?"
- "Hey Cal, Give me the weather forecast for Melbourne this week"
- "Hey Cal, Is it going to snow in Montreal tomorrow?"
- "Hey Cal, What's the current weather in Los Angeles?"

## Required Services

No external services required.

## Setup

This tool uses free, public weather APIs and requires no API keys or credentials.

### Installation

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "weather"
4. Click Install and follow prompts

## Usage

The Weather tool is a **Tool Suite** that provides weather information for four regions using official meteorological data sources. You must specify the `action` and `region` for every request.

### REQUIRED Parameters

- **action** (string) — Must be exactly one of: `current`, `forecast`
- **region** (string) — Must be exactly one of: `aus`, `can`, `fra`, `us`
- **location** (string) — City name (e.g., Sydney, Vancouver, Paris, Chicago)

---

### Current Conditions

**action: "current"**

Returns right-now weather conditions including temperature, conditions, wind, and humidity.

**Parameters:**
- **region** (string, required) — Region code: `aus`, `can`, `fra`, or `us`
- **location** (string, required) — City name

**Returns:** Current temperature, conditions description, feels-like temperature (where available), wind speed/direction, humidity, and region-specific details (UV index for Australia, wind chill/humidex for Canada, precipitation for France).

**WHEN TO USE:** For questions like "What's the weather?", "Is it raining in X?", "How cold is it?", "What's the temperature in X?"

---

### Multi-Day Forecast

**action: "forecast"**

Returns multi-day weather outlook with daily high/low temperatures and conditions.

**Parameters:**
- **region** (string, required) — Region code: `aus`, `can`, `fra`, or `us`
- **location** (string, required) — City name
- **days** (integer, optional) — Number of days (1-7). Defaults: US=3, AUS=7, FRA/CAN=5
- **target_day** (string, optional) — Specific weekday (e.g., "Thursday", "Saturday")

**Returns:** Daily forecasts with high/low temperatures, conditions summary, precipitation chances (varies by region), and weather warnings where applicable.

**WHEN TO USE:** For questions like "What's the forecast?", "Weather this week", "Will it rain Thursday?", "Weekend weather in X?"

---

## Region and City Mapping

Match cities to their correct region code:

**aus** — Australian cities: Sydney, Melbourne, Brisbane, Perth, Adelaide, Canberra, Gold Coast, Darwin

**can** — Canadian cities: Toronto, Vancouver, Montreal, Ottawa, Calgary, Edmonton, Winnipeg, Halifax

**fra** — French cities: Paris, Lyon, Marseille, Toulouse, Nice, Bordeaux, Strasbourg

**us** — American cities: New York, Chicago, Los Angeles, Houston, Miami, Seattle, Boston, Denver, Dallas

For cities with common names across countries, the tool expects you to provide the most likely region. If unsure, default to the region where that city is most well-known.

## Regional Notes

### Australia (BOM)
- Uses Bureau of Meteorology API
- Includes UV index in current conditions
- Supports location search by city name or postcode
- Forecasts available up to 7 days

### Canada (Environment Canada)
- Uses official Environment and Climate Change Canada data
- Includes wind chill (winter) and humidex (summer) values
- Returns active weather warnings when present
- Supports French city names with proper accents (Montréal, Québec)
- Forecasts available up to 6 days

### France (Open-Meteo)
- Uses Open-Meteo API with European meteorological data
- All responses in French
- Includes wind speed and precipitation forecasts
- Supports major French cities
- Forecasts available up to 7 days

### United States (NOAA)
- Uses National Weather Service API
- Includes detailed wind information
- Returns period-based forecasts (Today, Tonight, Tomorrow, etc.)
- Best results when including state name (e.g., "Chicago Illinois")
- Forecasts available up to 7 days

## Rules

- **region** and **location** are always required
- If you're unsure about the region, choose the most common country for that city name (e.g., Paris → fra, Sydney → aus)
- **days** parameter only applies to forecast action (1-7 range, region-specific defaults)
- **target_day** is for specific day queries (e.g., "What's the weather on Thursday?")
- For US locations, including the state name improves accuracy (e.g., "Portland Oregon" vs "Portland Maine")
- Canadian and French cities with accents can be spelled with or without accents

## Examples

**Simple current conditions:**
```
User: "What's the weather in Sydney?"
Tool call: { "action": "current", "region": "aus", "location": "Sydney" }
```

**Multi-day forecast:**
```
User: "Give me the weather forecast for Toronto this week"
Tool call: { "action": "forecast", "region": "can", "location": "Toronto", "days": 7 }
```

**Specific day query:**
```
User: "Will it rain on Saturday in Paris?"
Tool call: { "action": "forecast", "region": "fra", "location": "Paris", "target_day": "Saturday" }
```

**US location with state:**
```
User: "What's the forecast for Portland Oregon?"
Tool call: { "action": "forecast", "region": "us", "location": "Portland Oregon" }
```

## Author

[@cmac86](https://github.com/cmac86)

## Category

utilities

## Tags

weather, forecast, current-conditions, international, australia, canada, france, usa, meteorology