# package_tracker

Track packages by tracking number with automatic carrier detection across 2000+ carriers worldwide including UPS, FedEx, USPS, DHL, Australia Post, Royal Mail, and Canada Post. This tool uses the 17track API to provide real-time tracking status, delivery updates, and shipment history without requiring manual carrier selection.

## Voice Triggers

- "Hey Cal, track my package"
- "Hey Cal, where is my order"
- "Hey Cal, check tracking number 1Z999AA10123456784"
- "Hey Cal, has my delivery arrived"
- "Hey Cal, what's the status of my package"
- "Hey Cal, track this number 9400111899223856226452"
- "Hey Cal, where is my FedEx package"
- "Hey Cal, check if my Amazon order has been delivered"

## Required Services

17track API

## Setup

### Setting up 17track API

The 17track API provides package tracking across 2000+ carriers with automatic carrier detection. Each account includes 100 free tracking requests per month for testing.

1. Register for a 17track API account at [https://features.17track.net/en/api](https://features.17track.net/en/api)
2. Log in to the 17track admin console at [https://admin.17track.net/api](https://admin.17track.net/api)
3. Navigate to **Settings → Security → Access Key**
4. Copy your API key (a string token used for authentication)
5. In n8n, create a new **HTTP Header Auth** credential
6. Set the header name to: `17token`
7. Paste your API key as the header value

**Free Tier:** Each account includes 100 free tracking requests per month. If you need more, you'll need to upgrade your account.

**Note:** API keys take effect within 5 minutes. If you change your key, the old one will expire immediately once the new key is active. It's recommended to use separate API accounts for testing and production environments.

### n8n Credentials

- **HTTPHEADERAUTH_CREDENTIAL** (`httpHeaderAuth`)
  - Used for authenticating requests to the 17track API
  - Header name: `17token`
  - Header value: Your 17track API key

## Installation

### Via CAAL Tools Panel (Recommended)

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "package_tracker"
4. Click Install and follow prompts

### Via Command Line

```bash
curl -s https://raw.githubusercontent.com/CoreWorxLab/caal-tools/main/scripts/install.sh | bash -s package_tracker
```

## Usage

This tool tracks packages by tracking number with automatic carrier detection. Simply provide the tracking number and the tool will identify the carrier and return the current package status, delivery updates, and tracking history.

### Parameters

- **tracking_number** (string, required) — The package tracking number from any supported carrier. The tool automatically detects the carrier from the tracking number format.

### Supported Tracking Number Formats

The tool supports tracking numbers from 2000+ carriers including:

- **UPS**: 1Z999AA10123456784 (starts with 1Z, 18 characters)
- **USPS**: 9400111899223856226452 (20-22 digits)
- **FedEx**: 7489999223, 61299998820821171811 (12 or 15 digits typically)
- **DHL**: Various formats (10-11 digit numeric or alphanumeric)
- **Australia Post**: Various formats
- **Royal Mail**: Various formats
- **Canada Post**: Various formats
- And 1990+ more carriers worldwide

### Returns

The tool returns:

- **status**: Current package status (Delivered, InTransit, PickedUp, InfoReceived, etc.)
- **carrier**: Detected carrier name (e.g., "UPS", "USPS", "FedEx")
- **latest_event**: Most recent tracking event with description, location, and timestamp
- **events**: Array of recent tracking history (up to 10 events)
- **days_in_transit**: Number of days the package has been in transit
- **local_carrier**: Local delivery carrier if different from origin carrier
- **destination**: Destination country
- **estimated_delivery_date**: If available from the carrier

### Status Values

- **NotFound**: Tracking number not yet in system (may take a day to appear)
- **InfoReceived**: Carrier has shipment info but hasn't picked it up yet
- **PickedUp**: Package picked up by carrier
- **InTransit**: Package is on its way
- **Delivered**: Package has been delivered
- **Undelivered**: Delivery issue or package undeliverable
- **Alert**: Flagged with an alert or exception
- **Expired**: Tracking information expired

### Examples

**User:** "Track my package 1Z999AA10123456784"

**Response:** "Your UPS package is in transit. Last update: Arrived at facility in Memphis, TN. 2 days in transit. Estimated delivery: 2026-02-14."

---

**User:** "Where is my order with tracking number 9400111899223856226452"

**Response:** "Your USPS package is delivered. Last update: Delivered, In/At Mailbox in Los Angeles, CA."

---

**User:** "Check tracking 7489999223"

**Response:** "Your FedEx package is picked up. Last update: Picked up in San Francisco, CA. 1 day in transit."

---

**User:** "Has my delivery arrived"

This will prompt CAAL to ask for the tracking number, then return the current status.

### Common Scenarios

**New tracking numbers**: If you just received a tracking number and there's no tracking info yet, the tool will register it with 17track and inform you that tracking data isn't available yet. Check back in a few hours once the carrier scans the package.

**Multiple carriers**: Some international shipments transfer between carriers (e.g., USPS to local postal service). The tool will show both the origin carrier and local delivery carrier when applicable.

**API limits**: The free tier allows 100 tracking requests per month. If you exceed this, you'll receive a rate limit error.

## Author

[@CoreWorxLab](https://github.com/CoreWorxLab)

## Category

utilities

## Tags

package-tracking, shipping, delivery, logistics, carrier-detection, 17track, ups, fedex, usps, dhl