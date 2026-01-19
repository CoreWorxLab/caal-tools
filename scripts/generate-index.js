#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const toolsDir = process.argv[2] || './tools';
const outputDir = process.argv[3] || './docs';

if (!fs.existsSync(toolsDir)) {
  console.error(`Tools directory not found: ${toolsDir}`);
  process.exit(1);
}

const index = [];
const byCategory = {};
const byService = {};

// Walk through all tools
const categories = fs.readdirSync(toolsDir);

for (const category of categories) {
  const categoryPath = path.join(toolsDir, category);
  if (!fs.statSync(categoryPath).isDirectory()) continue;

  byCategory[category] = [];

  const tools = fs.readdirSync(categoryPath);
  for (const tool of tools) {
    const toolPath = path.join(categoryPath, tool);
    if (!fs.statSync(toolPath).isDirectory()) continue;

    const manifestPath = path.join(toolPath, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
      console.warn(`  Skipping ${tool} - no manifest.json`);
      continue;
    }

    let manifest;
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (e) {
      console.warn(`  Skipping ${tool} - invalid manifest.json: ${e.message}`);
      continue;
    }

    const entry = {
      id: manifest.id || null,  // Registry ID for tracking
      name: manifest.name,
      version: manifest.version || '1.0.0',
      description: manifest.description,
      category: category,
      path: `tools/${category}/${tool}`,
      voice_triggers: manifest.voice_triggers || [],
      required_services: manifest.required_services || [],
      tier: manifest.tier || 'experimental',
      author: manifest.author?.github || 'unknown',
      tags: manifest.tags || [],
      updated: manifest.updated || manifest.created
    };

    index.push(entry);
    byCategory[category].push(entry);

    // Index by service
    for (const service of entry.required_services) {
      if (!byService[service]) byService[service] = [];
      byService[service].push(entry);
    }
  }
}

// Sort by name
index.sort((a, b) => a.name.localeCompare(b.name));

// Ensure output directory exists
fs.mkdirSync(outputDir, { recursive: true });

// Write outputs
fs.writeFileSync(path.join(outputDir, 'index.json'), JSON.stringify(index, null, 2));
fs.writeFileSync(path.join(outputDir, 'by-category.json'), JSON.stringify(byCategory, null, 2));
fs.writeFileSync(path.join(outputDir, 'by-service.json'), JSON.stringify(byService, null, 2));

console.log(`\nGenerated index with ${index.length} tools`);
console.log(`Categories: ${Object.keys(byCategory).filter(c => byCategory[c].length > 0).join(', ') || '(none)'}`);
console.log(`Services: ${Object.keys(byService).join(', ') || '(none)'}`);
console.log(`\nOutput written to: ${outputDir}/`);
