# calendar-get-events

Get calendar events. Parameters: start_date and end_date in YYYY-MM-DD format. Note: end_date is EXCLUSIVE, so to get events for a single day, set end_date to the NEXT day. Example: for January 16th events, use start_date=2026-01-16, end_date=2026-01-17.

## Voice Triggers

- "Hey Cal, what's on the calendar today"
- "Hey Cal, check the calendar for tomorrow"

## What It Does

Get calendar events. Parameters: start_date and end_date in YYYY-MM-DD format. Note: end_date is EXCLUSIVE, so to get events for a single day, set end_date to the NEXT day. Example: for January 16th events, use start_date=2026-01-16, end_date=2026-01-17.

## Requirements

- google calendar instance
- API key for authentication

## Installation

### Quick Install

```bash
curl -s https://raw.githubusercontent.com/CoreWorxLab/caal-tools/main/scripts/install.sh | bash -s calendar-get-events
```

### Manual

1. Download `workflow.json`
2. Import into n8n (Settings > Import from File)
3. Create credential "google_calendar"
4. Update service URL: `CALENDAR`
5. Activate the workflow

## Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `CALENDAR` | calendar - Cor and Ash's Calendar | `8hgqtcsiej7sucgg50ub3v1uss@group.calendar.google.com` |

## Example Response

> "TODO: Add example of what CAAL says"
