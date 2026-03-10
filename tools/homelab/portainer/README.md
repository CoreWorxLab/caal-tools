# portainer

Portainer - manage Docker containers and stacks via voice.

## Voice Triggers

- "Hey Cal, what containers are running?"
- "Hey Cal, restart the sonarr container"
- "Hey Cal, show me logs for jellyfin"
- "Hey Cal, stop the minecraft server"

## Required Services

portainer

## Setup

### Environment Variables

- **PORTAINER_URL** - Your Portainer server URL (e.g. `https://YOUR_PORTAINER_HOST:9443`)
- **PORTAINER_ENV_ID** - Portainer environment/endpoint ID (usually `1`)

### n8n Credentials

- **PORTAINER_API_KEY** (`httpHeaderAuth`)
  - Header Name: `X-API-KEY`
  - Header Value: Your Portainer API key (My Account > Access Tokens > Add Access Token)

## Installation

1. Open CAAL web interface
2. Click Tools panel (wrench icon)
3. Search for "portainer"
4. Click Install and follow prompts

## Usage

## REQUIRED (always include):
  **action** (string) - must be exactly one of: `containers`, `start`, `stop`, `restart`, `logs`, `stacks`, `prune_images`.

---

## CONTAINERS

**action: "containers"**

  Returns: all containers with name, image, state (running/stopped), and status.

  WHEN TO USE: When asked about Docker containers. Examples: "What containers are running?", "List my containers", "Docker status"

---

## START

**action: "start"**
  container (string, required) - container name or ID.

  Returns: confirmation that the container was started.

  WHEN TO USE: When asked to start a container. Examples: "Start the sonarr container", "Bring up jellyfin"

---

## STOP

**action: "stop"**
  container (string, required) - container name or ID.

  Returns: confirmation that the container was stopped.

  WHEN TO USE: When asked to stop a container. Examples: "Stop the minecraft server", "Shut down plex"

---

## RESTART

**action: "restart"**
  container (string, required) - container name or ID.

  Returns: confirmation that the container was restarted.

  WHEN TO USE: When asked to restart a container. Examples: "Restart sonarr", "Reboot the jellyfin container"

---

## LOGS

**action: "logs"**
  container (string, required) - container name or ID.
  tail (integer, optional) - number of log lines to return. Default: 50

  Returns: recent log lines for the container.

  WHEN TO USE: When asked about container logs. Examples: "Show me logs for jellyfin", "What's in the sonarr logs?"

---

## STACKS

**action: "stacks"**

  Returns: all stacks with name, status (active/inactive), and type (compose/swarm).

  WHEN TO USE: When asked about Docker stacks. Examples: "What stacks do I have?", "List my stacks"

---

## PRUNE IMAGES

**action: "prune_images"**

  Returns: number of images removed and disk space reclaimed.

  WHEN TO USE: When asked to clean up Docker images. Examples: "Clean up unused images", "Prune Docker images", "Free up disk space"

---

## RULES:
  - Container name or ID is required for start, stop, restart, and logs actions.
  - Use the container name as shown in Portainer (without leading slash).

## Author

[@cmac86](https://github.com/cmac86)

## Category

homelab

## Tags

homelab, docker, containers, portainer, devops
