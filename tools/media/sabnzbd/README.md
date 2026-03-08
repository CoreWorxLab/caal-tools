# sabnzbd

Monitor and control your SABnzbd Usenet download client. Check queue status, view history, pause/resume downloads, and set speed limits.

## Voice Triggers

- "Hey Cal, what's downloading?"
- "Hey Cal, any failed downloads?"
- "Hey Cal, pause downloads"
- "Hey Cal, what's the download speed?"

## Required Services

sabnzbd

## Setup

### Environment Variables

- **SABNZBD_URL** - Your SABnzbd server URL (e.g. `http://YOUR_SABNZBD_HOST:8080`)

### n8n Credentials

- **SABNZBD_API_KEY** (`httpQueryAuth`)
  - Query Parameter Name: `apikey`
  - Query Parameter Value: Your SABnzbd API key (found in SABnzbd Config > General > API Key)

## Usage

## REQUIRED (always include):
  **action** (string) - must be exactly one of: `queue`, `history`, `status`, `pause`, `resume`, `speed_limit`.

---

## QUEUE

**action: "queue"**
  limit (integer, optional) - max items to return. Default: 10

  Returns: current downloads with name, progress percentage, speed, size remaining, and ETA.

  WHEN TO USE: When asked about current downloads or download progress. Examples: "What's downloading?", "Download progress", "What's in the queue?"

---

## HISTORY

**action: "history"**
  limit (integer, optional) - max items to return. Default: 10

  Returns: recently completed and failed downloads with name, status, size, and completion date.

  WHEN TO USE: When asked about completed or failed downloads. Examples: "What finished downloading?", "Any failed downloads?", "Recent downloads"

---

## STATUS

**action: "status"**

  Returns: overall SABnzbd status including speed, pause state, queue size, disk space, and speed limit.

  WHEN TO USE: When asked about download speed, disk space, or general download status. Examples: "What's the download speed?", "How much disk space is left?", "Is downloading paused?"

---

## PAUSE

**action: "pause"**

  Returns: confirmation that the download queue has been paused.

  WHEN TO USE: When asked to pause or stop downloads. Examples: "Pause downloads", "Stop downloading"

---

## RESUME

**action: "resume"**

  Returns: confirmation that the download queue has been resumed.

  WHEN TO USE: When asked to resume or start downloads again. Examples: "Resume downloads", "Start downloading again"

---

## SPEED LIMIT

**action: "speed_limit"**
  speed (string, required) - speed limit value. Examples: "50" (50%), "5M" (5 MB/s), "500K" (500 KB/s), "0" (unlimited)

  Returns: confirmation of the new speed limit.

  WHEN TO USE: When asked to limit or change download speed. Examples: "Limit download speed to 5 megabytes", "Set speed to 50%", "Remove speed limit"

---

## RULES:
  - Speed values: percentage ("50"), absolute with suffix ("5M" for MB/s, "500K" for KB/s), or "0" to remove limit.
  - Only include fields that are listed for the action you chose.

---

## TOOL CHAINING EXAMPLES:

  **Q: "Is anything downloading?"**
  → Use queue action

  **Q: "Did my downloads finish?"**
  → Use history action

  **Q: "Pause downloads and tell me what was in the queue"**
  → Step 1: Use queue to see current downloads
  → Step 2: Use pause to pause the queue

  **Q: "Slow down downloads to 5 megabytes per second"**
  → Use speed_limit with speed "5M"

## Author

[@cmac86](https://github.com/cmac86)

## Category

media

## Tags

media, downloads, usenet, sabnzbd, nzb
