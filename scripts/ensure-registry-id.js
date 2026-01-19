#!/usr/bin/env node

/**
 * Ensure Registry ID - Auto-adds registry IDs to tools submitted via manual PRs
 *
 * Usage:
 *   node ensure-registry-id.js                    # Scan all tools (for backfill)
 *   node ensure-registry-id.js --changed "file1 file2"  # Only check specific changed files
 *
 * For any tool missing an id in manifest.json:
 * 1. Generates a new registry ID
 * 2. Adds it to manifest.json
 * 3. Adds CAAL registry tracking sticky note to workflow.json
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const toolsDir = './tools';

function generateRegistryId() {
  // Generate URL-safe base64 ID (~22 chars, similar to nanoid)
  return crypto.randomBytes(16).toString('base64url');
}

function generateUUID() {
  return crypto.randomUUID();
}

function createRegistryStickyNote(registryId, version, toolName, description, category) {
  const link = `https://github.com/CoreWorxLab/caal-tools/tree/main/tools/${category}/${toolName}`;

  const content = `## CAAL Registry Tracking
**Tool Name:** ${toolName}
**Description:** ${description}
**version:** v${version}
**id:** ${registryId}
**link:** [Registry](${link})

### (Do not delete this sticky)`;

  return {
    parameters: {
      content,
      height: 260,
      width: 360,
    },
    type: 'n8n-nodes-base.stickyNote',
    position: [-200, 100],
    typeVersion: 1,
    id: generateUUID(),
    name: 'Sticky Note',
  };
}

function processToolDirectory(toolPath) {
  const manifestPath = path.join(toolPath, 'manifest.json');
  const workflowPath = path.join(toolPath, 'workflow.json');

  if (!fs.existsSync(manifestPath)) {
    console.log(`  Skipping ${toolPath} - no manifest.json`);
    return false;
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (e) {
    console.warn(`  Skipping ${toolPath} - invalid manifest.json: ${e.message}`);
    return false;
  }

  // Check if ID already exists
  if (manifest.id) {
    console.log(`  ${manifest.name} - already has ID: ${manifest.id}`);
    return false;
  }

  // Generate new ID
  const newId = generateRegistryId();
  const version = manifest.version || '1.0.0';

  // Extract category from path (e.g., "tools/homelab/my-tool" -> "homelab")
  const pathParts = toolPath.split(path.sep);
  const category = pathParts[pathParts.indexOf('tools') + 1] || 'other';
  const toolName = manifest.name || pathParts[pathParts.length - 1];

  console.log(`  ${toolName} - adding ID: ${newId}`);

  // Update manifest
  manifest.id = newId;
  if (!manifest.version) {
    manifest.version = version;
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

  // Update workflow if it exists - add sticky note for registry tracking
  if (fs.existsSync(workflowPath)) {
    try {
      const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));

      // Check if sticky note already exists
      const hasSticky = workflow.nodes?.some(
        (n) => n.type === 'n8n-nodes-base.stickyNote' && n.parameters?.content?.includes('CAAL Registry Tracking')
      );

      if (!hasSticky) {
        const stickyNote = createRegistryStickyNote(
          newId,
          version,
          toolName,
          manifest.description || '',
          category
        );

        if (!workflow.nodes) {
          workflow.nodes = [];
        }
        workflow.nodes.push(stickyNote);

        fs.writeFileSync(workflowPath, JSON.stringify(workflow, null, 2) + '\n');
        console.log(`    Added registry tracking sticky note to workflow.json`);
      }
    } catch (e) {
      console.warn(`    Could not update workflow.json: ${e.message}`);
    }
  }

  return true;
}

// Parse arguments
const args = process.argv.slice(2);
const changedIndex = args.indexOf('--changed');
const changedFiles = changedIndex !== -1 ? args[changedIndex + 1] : null;

console.log('Checking for missing registry IDs...\n');

let updated = 0;

if (changedFiles) {
  // Only process specific changed files (efficient for PRs)
  const files = changedFiles.split(/\s+/).filter(f => f.trim());

  if (files.length === 0) {
    console.log('No tool files changed in this PR.');
  } else {
    // Extract unique tool directories from changed file paths
    const toolDirs = new Set();
    for (const file of files) {
      // e.g., "tools/homelab/my-tool/manifest.json" -> "tools/homelab/my-tool"
      const match = file.match(/^(tools\/[^/]+\/[^/]+)\//);
      if (match) {
        toolDirs.add(match[1]);
      }
    }

    for (const toolPath of toolDirs) {
      if (fs.existsSync(toolPath) && fs.statSync(toolPath).isDirectory()) {
        if (processToolDirectory(toolPath)) {
          updated++;
        }
      }
    }
  }
} else {
  // Full scan (for backfill or manual runs)
  const categories = fs.readdirSync(toolsDir);
  for (const category of categories) {
    const categoryPath = path.join(toolsDir, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    const tools = fs.readdirSync(categoryPath);
    for (const tool of tools) {
      const toolPath = path.join(categoryPath, tool);
      if (!fs.statSync(toolPath).isDirectory()) continue;

      if (processToolDirectory(toolPath)) {
        updated++;
      }
    }
  }
}

console.log(`\nDone. Updated ${updated} tool(s).`);
