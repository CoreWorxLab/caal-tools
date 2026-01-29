# google-calendar

Manage Google Calendar events - view, create, and delete events with support for timed and all-day events.

## Voice Triggers

- "Hey Cal, What's on my calendar today?"
- "Hey Cal, Add a dentist appointment tomorrow at 2pm"

## Required Services

google calendar

## Setup

### Environment Variables

- `CALENDAR`: Your calendar identifier
  - Example: `None`
- `CALENDAR`: Your calendar identifier
  - Example: `None`
- `CALENDAR`: Your calendar identifier
  - Example: `None`
- `CALENDAR`: Your calendar identifier
  - Example: `None`
- `CALENDAR`: Your Google Calendar identifier
  - Example: `primary`


### n8n Credentials

- **GOOGLECALENDAROAUTH2API_CREDENTIAL** (`googleCalendarOAuth2Api`)
  - n8n credential type: googleCalendarOAuth2Api


## Installation

### Via CAAL Tools Panel (Recommended)

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "google-calendar"
4. Click Install and follow prompts

### Via Command Line

```bash
curl -s https://raw.githubusercontent.com/CoreWorxLab/caal-tools/main/scripts/install.sh | bash -s google-calendar
```

## Usage

Google Calendar suite - view and manage events. Parameters: action (required) - 'get', 'create', or 'delete'; start_date (required for get) - YYYY-MM-DD; end_date (required for get) - YYYY-MM-DD (exclusive); title (required for create) - event name; date (required for create) - YYYY-MM-DD; start_time (optional for create) - HH:MM 24hr format; end_time (optional for create) - HH:MM; event_id (required for delete) - event ID from get. Examples: 'what's on my calendar today', 'add dentist appointment tomorrow at 2pm', 'delete the dentist appointment'.

## Author

[@cmac86](https://github.com/cmac86)

## Category

productivity

## Tags

productivity, google calendar
