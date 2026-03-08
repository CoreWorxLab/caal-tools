# google-calendar

Manage Google Calendar events - view, create, update, and delete events with support for timed and all-day events.

## Voice Triggers

- "Hey Cal, What's on my calendar today?"
- "Hey Cal, Add dentist appointment tomorrow at 2pm"

## Required Services

google calendar

## Setup

### Environment Variables

- `CALENDAR`: Your Google Calendar identifier
  - Example: `primary`


### n8n Credentials

- **GOOGLECALENDAROAUTH2API_CREDENTIAL** (`googleCalendarOAuth2Api`)
  - n8n credential type: googleCalendarOAuth2Api


## Installation

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "google-calendar"
4. Click Install and follow prompts

## Usage

Google Calendar suite - view and manage events. Parameters: action (required) - 'get', 'create', 'update', or 'delete'; start_date (required for get) - YYYY-MM-DD; end_date (required for get) - YYYY-MM-DD (exclusive); title (required for create, optional for update) - event name; date (required for create, optional for update) - YYYY-MM-DD; start_time (optional for create/update) - HH:MM 24hr format; end_time (optional for create/update) - HH:MM; description (optional for create/update); location (optional for create/update); event_id (required for update/delete) - event ID from get. For update, only send fields you want to change. Examples: 'what's on my calendar today', 'add dentist appointment tomorrow at 2pm', 'move the dentist appointment to 3pm', 'delete the dentist appointment'.

## Author

[@cmac86](https://github.com/cmac86)

## Category

productivity

## Tags

productivity, google calendar
