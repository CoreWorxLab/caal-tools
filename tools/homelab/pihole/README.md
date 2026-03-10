# pihole

Pi-hole DNS ad blocker - view stats, manage blocking, and query DNS logs.

## Voice Triggers

- "Hey Cal, how many ads has Pi-hole blocked?"
- "Hey Cal, disable Pi-hole for 5 minutes"
- "Hey Cal, what's the top blocked domain?"
- "Hey Cal, show recent DNS queries"

## Required Services

pihole

## Setup

### Environment Variables

- **PIHOLE_URL** - Your Pi-hole server URL (e.g. `http://YOUR_PIHOLE_HOST`)
- **PIHOLE_PASSWORD** - Your Pi-hole app password (Settings > API > App Passwords)

## Installation

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "pihole"
4. Click Install and follow prompts

## Usage

## REQUIRED (always include):
  **action** (string) - must be exactly one of: `status`, `top_blocked`, `top_clients`, `enable`, `disable`, `query_log`.

---

## STATUS

**action: "status"**

  Returns: total queries, blocked count, block percentage, unique domains, clients, blocklist size, and whether blocking is enabled.

  WHEN TO USE: When asked about Pi-hole stats or status. Examples: "How many ads blocked?", "Is Pi-hole running?", "Pi-hole stats"

---

## TOP BLOCKED

**action: "top_blocked"**
  limit (integer, optional) - max domains to return. Default: 10

  Returns: most frequently blocked domains with hit counts.

  WHEN TO USE: When asked about blocked domains. Examples: "What's the top blocked domain?", "Most blocked domains"

---

## TOP CLIENTS

**action: "top_clients"**
  limit (integer, optional) - max clients to return. Default: 10

  Returns: most active DNS clients by query count.

  WHEN TO USE: When asked about network clients or who's using DNS most. Examples: "Top clients", "Who's making the most queries?"

---

## ENABLE

**action: "enable"**

  Returns: confirmation that blocking has been enabled.

  WHEN TO USE: When asked to enable or turn on Pi-hole. Examples: "Enable Pi-hole", "Turn on ad blocking"

---

## DISABLE

**action: "disable"**
  duration (integer, optional) - seconds to disable for. Omit for permanent disable.

  Returns: confirmation with duration if temporary.

  WHEN TO USE: When asked to disable or pause Pi-hole. Examples: "Disable Pi-hole for 5 minutes", "Turn off ad blocking", "Pause Pi-hole for 30 seconds"

---

## QUERY LOG

**action: "query_log"**
  limit (integer, optional) - max queries to return. Default: 20

  Returns: recent DNS queries with domain, client, status (allowed/blocked), and timestamp.

  WHEN TO USE: When asked about recent DNS activity. Examples: "Show recent queries", "What domains were looked up?", "Any blocked queries?"

---

## RULES:
  - Duration for disable is in seconds. Convert minutes to seconds (e.g. 5 minutes = 300).
  - Only include fields that are listed for the action you chose.

## Author

[@cmac86](https://github.com/cmac86)

## Category

homelab

## Tags

homelab, dns, ad-blocker, pi-hole, network
