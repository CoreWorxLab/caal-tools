# seerr

Search and request movies and TV shows for your media library. Works with Overseerr, Jellyseerr, and Seerr.

## Voice Triggers

- "Hey Cal, download Inception"
- "Hey Cal, search for Breaking Bad"
- "Hey Cal, what's trending?"
- "Hey Cal, what movies are coming out?"
- "Hey Cal, what have I requested?"
- "Hey Cal, cancel my last request"

## Required Services

seerr

## Setup

### Environment Variables

- **SEERR_URL** - Your Seerr server URL (e.g. `http://YOUR_SEERR_HOST:5055`)

### n8n Credentials

- **SEERR_API_KEY** (`httpHeaderAuth`)
  - Header Name: `X-Api-Key`
  - Header Value: Your Seerr API key

## Installation

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "seerr"
4. Click Install and follow prompts

## Usage

## REQUIRED (always include):
  **action** (string) - must be exactly one of: `search`, `request`, `my_requests`, `trending`, `upcoming`, `details`, `cancel_request`.

---

## SEARCH

**action: "search"**
  query (string, required) - search term, e.g. "Inception", "Breaking Bad"
  media_type (string, optional) - filter results: "movie" or "tv"

  Returns: numbered list of results with media_id, title, year, type, and availability status.

  WHEN TO USE: When asked to find a movie or TV show. Examples: "Search for Inception", "Find Breaking Bad", "Look up The Matrix"

---

## REQUEST

**action: "request"**
  media_id (integer, required) - TMDB media ID from search results
  media_type (string, required) - "movie" or "tv"
  seasons (array|string, optional) - season numbers to request, e.g. [1, 2] or "all". Omit for all seasons. TV only.

  Returns: confirmation with request_id.

  WHEN TO USE: When asked to download or request a movie/show. Always search first to get the media_id. Examples: "Download Inception", "Request Breaking Bad season 3", "Get all seasons of The Office"

---

## MY REQUESTS

**action: "my_requests"**
  filter (string, optional) - one of: "all", "pending", "approved", "available", "declined"

  Returns: list of your media requests with status.

  WHEN TO USE: When asked about request status. Examples: "What have I requested?", "My requests", "Is Inception ready?"

---

## TRENDING

**action: "trending"**
  media_type (string, optional) - filter: "movie" or "tv". Omit for both.

  Returns: top 10 trending titles with year and overview.

  WHEN TO USE: When asked what's popular. Examples: "What's trending?", "Popular movies", "Trending TV shows"

---

## UPCOMING

**action: "upcoming"**

  Returns: upcoming movie releases with release dates.

  WHEN TO USE: When asked about future releases. Examples: "What movies are coming out?", "Upcoming releases"

---

## DETAILS

**action: "details"**
  media_id (integer, required) - TMDB media ID from search results
  media_type (string, required) - "movie" or "tv"

  Returns: full details including rating, genres, runtime/seasons, overview, and availability status.

  WHEN TO USE: When asked for details about a specific title. Always search first. Examples: "Tell me about Inception", "What's the rating for Breaking Bad?"

---

## CANCEL REQUEST

**action: "cancel_request"**
  request_id (integer, required) - request ID from my_requests

  Returns: confirmation of cancellation.

  WHEN TO USE: When asked to cancel a pending request. Check my_requests first. Examples: "Cancel my last request", "Remove that request"

---

## RULES:
  - **media_id** comes from search results. Never fabricate IDs.
  - **media_type** is either "movie" or "tv".
  - **request_id** comes from my_requests. Never fabricate request IDs.
  - Always search first before requesting or getting details.

---

## TOOL CHAINING EXAMPLES:

  **Q: "Download Inception"**
  -> Step 1: search with query "Inception"
  -> Step 2: request with media_id and media_type from results

  **Q: "What's trending on TV?"**
  -> trending with media_type "tv"

  **Q: "Cancel my last request"**
  -> Step 1: my_requests to get request_id
  -> Step 2: cancel_request with request_id

  **Q: "Download Drive to Survive latest season"**
  -> Step 1: search with query "Drive to Survive", media_type "tv"
  -> Step 2: details to find number of seasons
  -> Step 3: request with media_id, media_type "tv", seasons [8]

  **Q: "Tell me about Breaking Bad"**
  -> Step 1: search with query "Breaking Bad"
  -> Step 2: details with media_id and media_type from results

  **Q: "Is Inception available?"**
  -> search with query "Inception" (status is included in results)

## Author

[@cmac86](https://github.com/cmac86)

## Category

media

## Tags

media, movies, tv, seerr, overseerr, jellyseerr
