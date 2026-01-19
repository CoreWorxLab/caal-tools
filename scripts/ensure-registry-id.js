#!/usr/bin/env node

/**
 * Ensure Registry ID - Auto-adds registry IDs to tools submitted via manual PRs
 *
 * Checks all tools in tools/ directory. For any tool missing an id in manifest.json:
 * 1. Generates a new registry ID
 * 2. Adds it to manifest.json
 * 3. Adds caal_registry_id and caal_registry_version to workflow.json settings
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const toolsDir = './tools';

function generateRegistryId() {
  // Generate URL-safe base64 ID (~22 chars, similar to nanoid)
  return crypto.randomBytes(16).toString('base64url');
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

  console.log(`  ${manifest.name} - adding ID: ${newId}`);

  // Update manifest
  manifest.id = newId;
  if (!manifest.version) {
    manifest.version = version;
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

  // Update workflow if it exists
  if (fs.existsSync(workflowPath)) {
    try {
      const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));

      if (!workflow.settings) {
        workflow.settings = {};
      }
      workflow.settings.caal_registry_id = newId;
      workflow.settings.caal_registry_version = version;

      fs.writeFileSync(workflowPath, JSON.stringify(workflow, null, 2) + '\n');
      console.log(`    Updated workflow.json settings`);
    } catch (e) {
      console.warn(`    Could not update workflow.json: ${e.message}`);
    }
  }

  return true;
}

// Main
console.log('Checking for missing registry IDs...\n');

let updated = 0;

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

console.log(`\nDone. Updated ${updated} tool(s).`);
