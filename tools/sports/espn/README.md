# espn

Get live scores, upcoming schedules, and league standings for NBA, NFL, NHL, EPL (English Premier League), MLS, and Formula 1. This tool provides real-time sports data directly from ESPN's API, covering major North American leagues and international soccer/racing.

## Voice Triggers

- "Hey Cal, What's the score of the Lakers game?"
- "Hey Cal, When do the Seahawks play next?"
- "Hey Cal, Show me the NBA standings"
- "Hey Cal, How is the Premier League table looking?"
- "Hey Cal, Who won the F1 race?"
- "Hey Cal, What are the NHL scores tonight?"
- "Hey Cal, Show me the Eastern Conference standings"
- "Hey Cal, When does Arsenal play next?"
- "Hey Cal, What's the MLS Western Conference standings?"

## Required Services

No external services required.

## Setup

This tool requires no API keys or credentials. It uses ESPN's public API endpoints.

## Installation

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "espn"
4. Click Install and follow prompts

## Usage

This is a **Tool Suite** that provides three distinct actions for retrieving sports data across six major leagues.

### REQUIRED Parameter

**action** (string) — Must be exactly one of: `scores`, `schedule`, `standings`

**sport** (string) — Must be exactly one of: `nba`, `nfl`, `nhl`, `epl`, `mls`, `f1`

---

### Scores

**action: "scores"**

Retrieves live and recent game results for the specified sport.

**Parameters:**
- `sport` (string, required) — One of: `nba`, `nfl`, `nhl`, `epl`, `mls`, `f1`
- `team` (string, optional) — Team name, nickname, or abbreviation to filter results (e.g., "lakers", "seahawks", "arsenal")

**Returns:** Live scores, final scores, or upcoming game times. For F1, returns the most recent race podium results.

**WHEN TO USE:**
- User asks "what's the score", "who won", "who's playing", "game results"
- User wants to know live game status or recent outcomes
- User asks about F1 race results (use `action: "scores"` for F1 results, not "results")

**Examples:**
- "What's the Lakers score?" → `{action: "scores", sport: "nba", team: "lakers"}`
- "NBA scores tonight" → `{action: "scores", sport: "nba"}`
- "Who won the F1 race?" → `{action: "scores", sport: "f1"}`
- "Arsenal result" → `{action: "scores", sport: "epl", team: "arsenal"}`

---

### Schedule

**action: "schedule"**

Retrieves upcoming games for a specific team or upcoming races (F1).

**Parameters:**
- `sport` (string, required) — One of: `nba`, `nfl`, `nhl`, `epl`, `mls`, `f1`
- `team` (string, required for team sports, optional for F1) — Team name or abbreviation

**Returns:** Upcoming games/races with dates, times, and opponents.

**WHEN TO USE:**
- User asks "when does X play next", "upcoming games", "next match", "schedule"
- User wants to know future game dates

**Examples:**
- "When do the Seahawks play next?" → `{action: "schedule", sport: "nfl", team: "seahawks"}`
- "F1 schedule" → `{action: "schedule", sport: "f1"}`
- "Sounders next game" → `{action: "schedule", sport: "mls", team: "sounders"}`

**IMPORTANT:** For team sports (NBA, NFL, NHL, EPL, MLS), the `team` parameter is **required**. F1 does not use the team parameter.

---

### Standings

**action: "standings"**

Retrieves current league standings, rankings, or points tables.

**Parameters:**
- `sport` (string, required) — One of: `nba`, `nfl`, `nhl`, `epl`, `mls`, `f1`
- `team` (string, optional) — Filter to show only a specific team's standing
- `conference` (string, optional) — Filter by conference for NBA, NFL, or MLS. One of: `east`, `west`. **Only use if explicitly requested.**

**Returns:** Win-loss records (NBA, NFL, NHL), points tables (EPL, MLS), or driver championship standings (F1).

**WHEN TO USE:**
- User asks "standings", "rankings", "league table", "who's leading", "playoff picture"
- User wants to see season records or points

**Examples:**
- "NBA standings" → `{action: "standings", sport: "nba"}`
- "Eastern Conference standings" → `{action: "standings", sport: "nba", conference: "east"}`
- "Where are the 49ers in the standings?" → `{action: "standings", sport: "nfl", team: "49ers"}`
- "Premier League table" → `{action: "standings", sport: "epl"}`
- "F1 driver standings" → `{action: "standings", sport: "f1"}`

**IMPORTANT:** Only NBA, NFL, and MLS have conferences. Do **not** add `conference` unless the user specifically asks for "Eastern Conference" or "Western Conference".

---

## RULES

### Sport Codes
- `nba` — National Basketball Association
- `nfl` — National Football League
- `nhl` — National Hockey League
- `epl` — English Premier League (soccer)
- `mls` — Major League Soccer
- `f1` — Formula 1

### Team Identifiers
The tool accepts flexible team names:
- **Full names:** "Los Angeles Lakers", "Seattle Seahawks", "Arsenal"
- **City names:** "Seattle", "Boston", "Manchester City"
- **Nicknames:** "Lakers", "Seahawks", "Gunners"
- **Abbreviations:** "LAL", "SEA", "ARS"

Team names are case-insensitive.

### F1 Special Behavior
- For F1 **results**, use `action: "scores"` (not "results")
- F1 schedule shows upcoming race calendar
- F1 standings show driver championship points
- F1 does not use the `team` parameter (use for driver filtering instead)

### Conference Filter
- **Only use `conference` for standings** when user explicitly mentions "Eastern Conference" or "Western Conference"
- Valid values: `east`, `west`
- Only applies to: NBA, NFL, MLS
- Do **not** add conference unless specifically requested

### Common Mistakes to Avoid
- Don't use `action: "results"` — use `action: "scores"` instead
- Don't add `conference` parameter unless explicitly requested
- For schedule, always include `team` (except F1)
- For F1 results, use `action: "scores"`, not `action: "results"`

---

## EXAMPLES

### Multi-Step Workflows

**Example 1: Playoff Race Check**
1. User: "Are the Lakers in playoff position?"
   - Tool call: `{action: "standings", sport: "nba", conference: "west"}`
   - Response: Shows Western Conference standings
2. User: "When's their next game?"
   - Tool call: `{action: "schedule", sport: "nba", team: "lakers"}`
   - Response: Shows upcoming Lakers games

**Example 2: Game Day Experience**
1. User: "What's the score of the Seahawks game?"
   - Tool call: `{action: "scores", sport: "nfl", team: "seahawks"}`
   - Response: Live score or final result
2. User: "Show me the NFC West standings"
   - Tool call: `{action: "standings", sport: "nfl"}`
   - Response: Shows NFL standings (filter displayed results to NFC West)

**Example 3: F1 Weekend**
1. User: "Who won the F1 race?"
   - Tool call: `{action: "scores", sport: "f1"}`
   - Response: Most recent race podium
2. User: "What's the driver standings?"
   - Tool call: `{action: "standings", sport: "f1"}`
   - Response: Championship points table
3. User: "When's the next race?"
   - Tool call: `{action: "schedule", sport: "f1"}`
   - Response: Upcoming F1 calendar

---

## Author

[@cmac86](https://github.com/cmac86)

## Category

sports

## Tags

espn, sports, nba, nfl, nhl, soccer, football, basketball, hockey, f1, formula1, mls, epl, scores, standings, schedule, live-scores