# youtube

Manage YouTube with comprehensive search, channel/video information retrieval, subscription management, and video rating capabilities.

## Voice Triggers

- "Hey Cal, Search for Python tutorials on YouTube"
- "Hey Cal, How many subscribers does MrBeast have?"

## Required Services

youtube

## Setup

No environment variables required.

### n8n Credentials

- **YOUTUBEOAUTH2API_CREDENTIAL** (`youTubeOAuth2Api`)
  - n8n credential type: youTubeOAuth2Api


## Installation

### Via CAAL Tools Panel (Recommended)

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "youtube"
4. Click Install and follow prompts

### Via Command Line

```bash
curl -s https://raw.githubusercontent.com/CoreWorxLab/caal-tools/main/scripts/install.sh | bash -s youtube
```

## Usage

# YouTube API Automation Tool

## REQUIRED (always include):
  **action** (string) — must be exactly one of: `search`, `get`, `subscribe`, `unsubscribe`, `rate`. Do not invent other values.

---

## SEARCH OPERATIONS

**action: "search"**

Search operations return basic information only (IDs, titles, channel names). For detailed statistics, use `get` operations afterward.

  **operation: "channel_by_query"**
    query (string, required) — free-text search for channels (e.g. "pewdiepie", "mr beast")
    
    Returns: channel ID, title, thumbnail. Does NOT include subscriber count or statistics.
    
    WHEN TO USE: When asked to find a channel by name or description. Examples: "Find PewDiePie's channel", "Search for cooking channels"

  **operation: "videos_by_query"**
    query (string, required) — free-text search for videos
    maxResults (number, optional) — 1-10 results, default: 5
    
    Returns: video IDs, titles, channel names. Does NOT include view counts, like counts, or detailed stats.
    
    WHEN TO USE: When asked to find videos by topic or keyword. Examples: "Search for Python tutorials", "Find cat videos"

  **operation: "playlists_by_query"**
    query (string, required) — free-text search for playlists
    maxResults (number, optional) — 1-10 results, default: 5
    
    Returns: playlist IDs, titles, channel names. Does NOT include video counts or statistics.
    
    WHEN TO USE: When asked to find playlists by topic. Examples: "Find workout playlists", "Search for study music playlists"

  **operation: "my_videos"**
    maxResults (number, optional) — 1-10 results, default: 5
    
    Returns: your uploaded video IDs and titles. Does NOT include view counts or engagement stats.
    
    WHEN TO USE: When asked about the user's own uploaded videos. Examples: "Show my videos", "What have I uploaded?"

---

## GET OPERATIONS

**action: "get"**

Get operations return comprehensive details including all statistics (subscribers, views, likes, comments, etc.), descriptions, thumbnails, profile pictures, verification status, and connection info.

  **operation: "channel_by_id"**
    channel_id (string, required) — the YouTube channel ID
    
    Returns: full channel profile including subscriber count, video count, view count, description, thumbnails, handle, custom URL, verification status
    
    WHEN TO USE: When you have a channel ID and need detailed statistics. Examples: "How many subscribers does this channel have?", "Is this channel verified?"

  **operation: "channel_by_handle"**
    handle (string, required) — the channel handle WITHOUT the @ symbol (e.g. "pewdiepie" not "@pewdiepie")
    
    Returns: full channel profile with all statistics
    
    WHEN TO USE: When you know the exact channel handle. Examples: "Get details for @MrBeast", "How many subscribers does @mkbhd have?"

  **operation: "my_channel"**
    (no other fields needed)
    
    Returns: the authenticated user's own channel profile with all statistics
    
    WHEN TO USE: When asked about the user's own channel. Examples: "How many subscribers do I have?", "What's my channel description?"

  **operation: "video_by_id"**
    video_id (string, required) — the YouTube video ID
    
    Returns: comprehensive video details including view count, like count, comment count, description, thumbnails, duration, upload date, tags, category
    
    WHEN TO USE: When you have a video ID and need detailed statistics or metadata. Examples: "How many views does this video have?", "What's the like/dislike ratio?", "When was this uploaded?"

  **operation: "video_rating"**
    video_id (string, required) — the YouTube video ID
    
    Returns: your current rating on the video (like/dislike/none)
    
    WHEN TO USE: When asked if the user has liked or rated a specific video. Examples: "Did I like this video?", "Have I rated this?"

  **operation: "most_recent_video"**
    channel_id (string, required) — the YouTube channel ID
    
    Returns: the channel's latest uploaded video with full details and statistics
    
    WHEN TO USE: When asked about a channel's most recent upload. Examples: "What's PewDiePie's latest video?", "Show the newest video from this channel"

  **operation: "top_comments"**
    video_id (string, required) — the YouTube video ID
    maxResults (number, optional) — 1-10 results, default: 5
    
    Returns: top comments with author names, text, like counts, reply counts, publish dates
    
    WHEN TO USE: When asked about popular or top comments on a video. Examples: "What are the top comments?", "Show me the most liked comments"

  **operation: "most_recent_comments"**
    video_id (string, required) — the YouTube video ID
    maxResults (number, optional) — 1-10 results, default: 2
    
    Returns: most recent comments with author names, text, like counts, reply counts, publish dates
    
    WHEN TO USE: When asked about recent or new comments. Examples: "What are people saying recently?", "Show me the latest comments"

  **operation: "subscription_by_channel_id"**
    channel_id (string, required) — the YouTube channel ID
    
    Returns: subscription details including subscription ID, subscribe date, channel info. Returns null if not subscribed.
    
    WHEN TO USE: When checking if the user is subscribed to a specific channel. Examples: "Am I subscribed to MrBeast?", "Do I follow this channel?"

  **operation: "my_subscriptions"**
    maxResults (number, optional) — 1-50 results, default: 5
    
    Returns: list of channels you're subscribed to with channel IDs, titles, thumbnails
    
    WHEN TO USE: When asked about the user's subscriptions. Examples: "Who am I subscribed to?", "Show my subscriptions"

---

## SUBSCRIPTION MANAGEMENT

**action: "subscribe"**
  channel_id (string, required) — the YouTube channel ID to subscribe to
  
  (operation field not required)
  
  WHEN TO USE: When asked to subscribe to a channel. Examples: "Subscribe to PewDiePie", "Follow this channel"

**action: "unsubscribe"**
  channel_id (string, required) — the YouTube channel ID to unsubscribe from
  
  (operation field not required)
  
  Note: Internally retrieves subscription_id from channel_id before unsubscribing
  
  WHEN TO USE: When asked to unsubscribe from a channel. Examples: "Unsubscribe from this channel", "Unfollow MrBeast"

---

## VIDEO RATING

**action: "rate"**
  video_id (string, required) — the YouTube video ID to rate
  rating (string, optional) — must be exactly `like`, `dislike`, or `none`. Default: `none`
  
  (operation field not required)
  
  WHEN TO USE: When asked to like, dislike, or remove rating from a video. Examples: "Like this video", "Dislike this video", "Remove my rating"

---

## RULES:
  - All IDs are strings. Always wrap them in quotes, never send as numbers.
  - **channel_id** is always a YouTube channel ID (e.g. "UCX6OQ3DkcsbYNE6H8uQQuVA"). Never a handle, never a channel name.
  - **video_id** is always a YouTube video ID (e.g. "dQw4w9WgXcQ"). Never a URL, never video title.
  - **handle** must NOT include the @ symbol (use "pewdiepie" not "@pewdiepie").
  - Only include fields that are listed for the operation you chose. Do not send extra fields.
  - If you do not have a required ID, do NOT guess or fabricate one. Use search first to retrieve it, then use the returned ID in a follow-up request.
  - **CRITICAL**: Search operations return minimal info. Always follow up with get operations when statistics are needed.

---

## TOOL CHAINING EXAMPLES:

  **Q: "Subscribe to PewDiePie"**
  → Step 1: Use search with operation: "channel_by_query", query: "pewdiepie"
  → Step 2: Use subscribe with the returned channel_id

  **Q: "How many subscribers does MrBeast have?"**
  → Step 1: Use search with operation: "channel_by_query", query: "mrbeast"
  → Step 2: Use get with operation: "channel_by_id" and the returned channel_id

  **Q: "Am I subscribed to MKBHD?"**
  → Step 1: Use get with operation: "channel_by_handle", handle: "mkbhd"
  → Step 2: Use get with operation: "subscription_by_channel_id" and the returned channel_id

  **Q: "Like the latest video from Veritasium"**
  → Step 1: Use search with operation: "channel_by_query", query: "veritasium"
  → Step 2: Use get with operation: "most_recent_video" and the returned channel_id
  → Step 3: Use rate with the returned video_id and rating: "like"

  **Q: "How many views does PewDiePie's latest video have?"**
  → Step 1: Use search with operation: "channel_by_query", query: "pewdiepie"
  → Step 2: Use get with operation: "most_recent_video" and the returned channel_id
  → (statistics are included in most_recent_video response)

  **Q: "Search for Python tutorials and like the most popular one"**
  → Step 1: Use search with operation: "videos_by_query", query: "python tutorial"
  → Step 2: Use get with operation: "video_by_id" for each result to get view counts
  → Step 3: Use rate with the highest-viewed video_id and rating: "like"

  **Q: "Show me my subscriber count"**
  → Use get with operation: "my_channel"

  **Q: "What are the top comments on video dQw4w9WgXcQ?"**
  → Use get with operation: "top_comments", video_id: "dQw4w9WgXcQ"

  **Q: "Unsubscribe from all channels with less than 1000 subscribers"**
  → Step 1: Use get with operation: "my_subscriptions", maxResults: 50
  → Step 2: Use get with operation: "channel_by_id" for each channel_id to get subscriber counts
  → Step 3: Use unsubscribe for each channel_id below threshold

## Author

[@AbdulShahzeb](https://github.com/AbdulShahzeb)

## Category

media

## Tags

media, youtube
