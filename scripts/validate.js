#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const toolDir = process.argv[2];

if (!toolDir) {
  console.error('Usage: validate.js <tool-directory>');
  console.error('Example: validate.js tools/media/jellyseerr-search');
  process.exit(1);
}

const errors = [];
const warnings = [];

// Check required files exist
const requiredFiles = ['workflow.json', 'manifest.json', 'README.md'];
for (const file of requiredFiles) {
  const filePath = path.join(toolDir, file);
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing required file: ${file}`);
  }
}

if (errors.length > 0) {
  console.error(`\n Validation failed for ${toolDir}:\n`);
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
}

// Validate manifest
let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(path.join(toolDir, 'manifest.json'), 'utf8'));
} catch (e) {
  errors.push(`Invalid JSON in manifest.json: ${e.message}`);
}

if (manifest) {
  const requiredFields = ['name', 'version', 'description', 'category', 'voice_triggers', 'author'];
  for (const field of requiredFields) {
    if (!manifest[field]) {
      errors.push(`Manifest missing required field: ${field}`);
    }
  }

  if (manifest.voice_triggers && manifest.voice_triggers.length < 1) {
    errors.push('Must include at least one voice trigger example');
  }

  if (manifest.voice_triggers && manifest.voice_triggers.length < 2) {
    warnings.push('Consider adding more voice trigger examples (at least 2 recommended)');
  }

  const validCategories = ['smart-home', 'media', 'homelab', 'productivity', 'utilities', 'social', 'other'];
  if (manifest.category && !validCategories.includes(manifest.category)) {
    errors.push(`Invalid category: ${manifest.category}. Must be one of: ${validCategories.join(', ')}`);
  }

  if (manifest.author && !manifest.author.github) {
    errors.push('Author must include github username');
  }
}

// Validate workflow
let workflow;
try {
  workflow = JSON.parse(fs.readFileSync(path.join(toolDir, 'workflow.json'), 'utf8'));
} catch (e) {
  errors.push(`Invalid JSON in workflow.json: ${e.message}`);
}

if (workflow) {
  // Check for webhook trigger
  const webhookNode = workflow.nodes?.find(n =>
    n.type === 'n8n-nodes-base.webhook' ||
    n.type === '@n8n/n8n-nodes-langchain.webhook'
  );

  if (!webhookNode) {
    errors.push('Workflow must have a webhook trigger node');
  } else {
    // Check webhook has description in notes
    if (!webhookNode.notes || webhookNode.notes.trim().length < 20) {
      errors.push('Webhook node must have a meaningful description in the notes field');
    }
  }

  // Check for Respond to Webhook node
  const respondNode = workflow.nodes?.find(n =>
    n.type === 'n8n-nodes-base.respondToWebhook'
  );

  if (!respondNode) {
    warnings.push('Consider adding a "Respond to Webhook" node for proper voice responses');
  }
}

// Report results
if (errors.length > 0) {
  console.error(`\n Validation failed for ${toolDir}:\n`);
  errors.forEach(e => console.error(`  - ${e}`));
  if (warnings.length > 0) {
    console.warn(`\n Warnings:\n`);
    warnings.forEach(w => console.warn(`  - ${w}`));
  }
  process.exit(1);
}

if (warnings.length > 0) {
  console.warn(`\n Warnings for ${toolDir}:\n`);
  warnings.forEach(w => console.warn(`  - ${w}`));
}

console.log(`\n ${toolDir} passed validation\n`);
