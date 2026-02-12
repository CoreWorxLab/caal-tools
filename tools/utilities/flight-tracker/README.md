Now I'll generate the comprehensive README.md:

# Flight Tracker

Track real-time flight status, airport departures, and arrivals using the AviationStack API. This tool provides live flight information including delays, gates, terminals, and estimated arrival times for any commercial flight worldwide.

## Voice Triggers

- "Hey Cal, where is flight QF1?"
- "Hey Cal, what flights are departing from Sydney?"
- "Hey Cal, show me arrivals at LAX"
- "Hey Cal, is my flight on time?"
- "Hey Cal, check the status of flight UA123"
- "Hey Cal, what gate is flight EK456 at?"
- "Hey Cal, are there any delays at Heathrow departures?"
- "Hey Cal, show me flights arriving at JFK"
- "Hey Cal, what's the ETA for my flight?"

## Required Services

AviationStack

## Setup

### Setting up AviationStack API

1. Go to [AviationStack Signup](https://aviationstack.com/signup/free)
2. Create a free account (no credit card required)
3. Once registered, your personal API Access Key will be available in your account Dashboard
4. Copy your API access key

### n8n Credentials

- **HTTPQUERYAUTH_CREDENTIAL** (`httpQueryAuth`)
  - This credential is used to authenticate with the AviationStack API
  - In n8n, create a new HTTP Query Auth credential
  - Set the **Name** field to `access_key`
  - Paste your AviationStack API key in the **Value** field

**Important Notes:**
- The free tier provides **100 API requests per month** with HTTPS encryption
- HTTPS access is now included in the free tier (as of 2026)
- Keep your API access key secure at all times
- You can reset your key anytime from your Account Dashboard
- Error code 101 indicates an invalid access key
- Error code 104 indicates you've reached the monthly request limit
- Error code 105 indicates HTTPS access issues (should not occur with current free tier)
- Error code 106 indicates a feature that requires a paid plan

### Free Tier Limitations

The AviationStack free tier includes:
- 100 API requests per month
- Real-time flight data access
- HTTPS encryption
- Access to flights, departures, and arrivals endpoints

For higher usage or additional features (historical data, airline routes, etc.), consider upgrading to a paid plan at [AviationStack Pricing](https://aviationstack.com/pricing).

## Installation

### Via CAAL Tools Panel (Recommended)

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "Flight Tracker"
4. Click Install and follow prompts

### Via Command Line

```bash
curl -s https://raw.githubusercontent.com/CoreWorxLab/caal-tools/main/scripts/install.sh | bash -s flight_tracker
```

## Usage

Flight Tracker is a **Tool Suite** that provides three distinct actions for tracking flights and monitoring airport activity. The **action** field is **required** for every request and must be exactly one of: `track`, `departures`, `arrivals`.

### REQUIRED Parameter

- **action** (string) — must be exactly one of: `track`, `departures`, `arrivals`

---

### Flight Tracking

**action: "track"**

Track a specific flight's real-time status, including delays, gate information, and estimated times.

**Parameters:**
- **flight_iata** (string, required) — IATA flight code like "QF1", "UA123", "EK456". Format: airline code + flight number with no spaces.

**Returns:** Flight status (scheduled, active, landed, cancelled, diverted), departure and arrival airports, scheduled and estimated times, delays in minutes, gate, terminal.

**WHEN TO USE:** When asked about a specific flight's status, delays, gate, or ETA.

**Examples:**
- "Where is flight QF1?"
- "Is UA123 on time?"
- "What gate is my flight at?"
- "Has EK456 landed?"
- "Check the status of flight AA100"

---

### Airport Departures

**action: "departures"**

Get a list of flights departing from a specific airport.

**Parameters:**
- **airport_iata** (string, required) — 3-letter IATA airport code like "SYD", "LAX", "LHR".
- **limit** (number, optional, default 5) — Number of flights to return, between 1-10.

**Returns:** List of departing flights with airline, flight number, destination, scheduled time, status, delay, gate, terminal.

**WHEN TO USE:** When asked about flights leaving an airport.

**Examples:**
- "What's departing from SYD?"
- "Show me LAX departures"
- "Any flights leaving Heathrow?"
- "What flights are leaving Melbourne in the next few hours?"
- "Show me 10 departures from JFK"

---

### Airport Arrivals

**action: "arrivals"**

Get a list of flights arriving at a specific airport.

**Parameters:**
- **airport_iata** (string, required) — 3-letter IATA airport code like "SYD", "LAX", "LHR".
- **limit** (number, optional, default 5) — Number of flights to return, between 1-10.

**Returns:** List of arriving flights with airline, flight number, origin, scheduled time, status, delay, gate, terminal.

**WHEN TO USE:** When asked about flights arriving at an airport.

**Examples:**
- "What's arriving at LAX?"
- "Arrivals at Melbourne?"
- "Any flights landing at JFK?"
- "Show me arrivals at Heathrow"
- "What's coming into SFO?"

---

### RULES

- **flight_iata** must be airline code + flight number with no space ("QF1" not "QF 1")
- **airport_iata** must be a valid 3-letter IATA code ("SYD", "LAX", "LHR")
- Only include parameters listed for the chosen action — do not send extra fields
- The limit parameter is capped at 10 flights maximum
- All airport codes are case-insensitive but will be converted to uppercase
- Flight codes are case-insensitive but will be converted to uppercase

### EXAMPLES

**Single Flight Tracking:**

Q: "Where is flight QF1?"
→ Use action: "track" with flight_iata: "QF1"

Q: "Is my flight UA123 on time?"
→ Use action: "track" with flight_iata: "UA123"

Q: "What gate is flight EK456 at?"
→ Use action: "track" with flight_iata: "EK456"

**Airport Departures:**

Q: "What flights are departing from Sydney?"
→ Use action: "departures" with airport_iata: "SYD"

Q: "Show me the next 10 departures from LAX"
→ Use action: "departures" with airport_iata: "LAX", limit: 10

**Airport Arrivals:**

Q: "Show me arrivals at LAX"
→ Use action: "arrivals" with airport_iata: "LAX"

Q: "Any delays at Heathrow arrivals?"
→ Use action: "arrivals" with airport_iata: "LHR"

**Multi-Step Workflow:**

1. User: "What flights are leaving Sydney?"
   → Track departures from SYD
2. User: "Check if QF1 is on time"
   → Track specific flight QF1
3. User: "What about arrivals at LAX?"
   → Track arrivals at LAX

## Author

[@cmac86](https://github.com/cmac86)

## Category

utilities

## Tags

flight-tracking, aviation, airports, travel, real-time-data, flight-status, aviationstack