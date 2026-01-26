# CAAL Tool Icons

This directory contains SVG icons for tools in the CAAL registry.

## How Icons Are Added

Icons are automatically added via tool submissions when:
1. A user selects an icon from [dashboardicons.com](https://dashboardicons.com)
2. A user provides a custom SVG URL
3. A user uploads a custom SVG file

The icon is included in the pull request and added to this directory when merged.

## Naming Convention

- Icons from dashboardicons.com keep their original name (e.g., `notion.svg`, `plex.svg`)
- Custom icons are named after the tool (e.g., `my-custom-tool.svg`)

## Icon Requirements

- Format: SVG only
- Size: Icons should be square and work well at small sizes (24x24 to 64x64)
- Style: Prefer simple, recognizable icons that look good on both light and dark backgrounds

## Usage

Tools reference icons in their `manifest.json`:

```json
{
  "icon": "notion.svg"
}
```

The CAAL frontend displays these icons in the tool browser and installed tools list.
