#!/usr/bin/env node

/**
 * Intake script for sanitizing and importing n8n workflows into the registry.
 *
 * Usage: node scripts/intake.js <workflow.json> [category] [tool-name]
 *
 * This script will:
 * 1. Check for hardcoded secrets
 * 2. Detect and prompt for URL replacements (convert to variables)
 * 3. Nullify credential IDs (keep names for reference)
 * 4. Extract webhook description
 * 5. Generate manifest.json and README.md templates
 * 6. Place files in tools/<category>/<tool-name>/
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

// Secret detection patterns
const SECRET_PATTERNS = [
  { name: 'API Key', regex: /api[_-]?key\s*[:=]\s*["'][^"']{10,}["']/gi },
  { name: 'Bearer token', regex: /bearer\s+[a-zA-Z0-9_-]{20,}/gi },
  { name: 'OpenAI key', regex: /sk-[a-zA-Z0-9]{20,}/g },
  { name: 'GitHub PAT', regex: /ghp_[a-zA-Z0-9]{36}/g },
  { name: 'Password', regex: /password\s*[:=]\s*["'][^"']+["']/gi },
];

// URL pattern to detect hardcoded URLs
const URL_PATTERN = /https?:\/\/[\d.]+(?::\d+)?/g;
const LOCALHOST_PATTERN = /https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/g;

/**
 * Recursively find all __rl (resource locator) fields with mode: "list"
 * These are dropdown selections that need to be converted to id mode
 */
function findResourceLocators(obj, path = '', results = []) {
  if (!obj || typeof obj !== 'object') return results;

  if (obj.__rl === true && obj.mode === 'list') {
    results.push({
      path,
      value: obj.value,
      cachedName: obj.cachedResultName || obj.cachedResultUrl || null
    });
  }

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      findResourceLocators(value, path ? `${path}.${key}` : key, results);
    }
  }

  return results;
}

/**
 * Convert a resource locator from list mode to id mode
 */
function convertResourceLocatorToId(obj, variablePlaceholder) {
  return {
    __rl: true,
    mode: 'id',
    value: variablePlaceholder
  };
}

/**
 * Set a nested property by path (e.g., "nodes.0.parameters.calendar")
 */
function setNestedProperty(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}

const CATEGORIES = [
  { key: 'smart-home', label: 'Smart Home', desc: 'Home Assistant, lights, climate, security' },
  { key: 'media', label: 'Media', desc: 'Plex, Jellyfin, Jellyseerr, Sonarr, Radarr' },
  { key: 'homelab', label: 'Homelab', desc: 'TrueNAS, Docker, Proxmox, server monitoring' },
  { key: 'productivity', label: 'Productivity', desc: 'Calendar, tasks, email, notes' },
  { key: 'utilities', label: 'Utilities', desc: 'Weather, timers, reminders, general purpose' },
  { key: 'social', label: 'Social', desc: 'Discord, Slack, Reddit, Telegram' },
  { key: 'other', label: 'Other', desc: 'Everything else' },
];

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('\nUsage: node scripts/intake.js <workflow.json> [category] [tool-name]\n');
    console.error('Example: node scripts/intake.js ~/workflows/truenas_get_status.json\n');
    process.exit(1);
  }

  const [workflowPath, categoryArg, customName] = args;
  const validCategories = CATEGORIES.map(c => c.key);

  let category = categoryArg;

  // If category not provided or invalid, prompt for it
  if (!category || !validCategories.includes(category)) {
    console.log('\n  Select a category:\n');
    CATEGORIES.forEach((cat, i) => {
      console.log(`    ${i + 1}) ${cat.label.padEnd(14)} - ${cat.desc}`);
    });
    console.log('');

    const choice = await question('  Category (1-7): ');
    const idx = parseInt(choice, 10) - 1;

    if (idx < 0 || idx >= CATEGORIES.length) {
      console.error('\n  Invalid selection.\n');
      rl.close();
      process.exit(1);
    }

    category = CATEGORIES[idx].key;
  }

  // Read workflow
  if (!fs.existsSync(workflowPath)) {
    console.error(`\nWorkflow not found: ${workflowPath}\n`);
    process.exit(1);
  }

  let workflow;
  try {
    workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
  } catch (e) {
    console.error(`\nInvalid JSON: ${e.message}\n`);
    process.exit(1);
  }

  const toolName = customName || workflow.name || path.basename(workflowPath, '.json');

  console.log(`\n========================================`);
  console.log(`  CAAL Tool Registry - Intake`);
  console.log(`========================================\n`);
  console.log(`Workflow: ${workflow.name || 'unnamed'}`);
  console.log(`Category: ${category}`);
  console.log(`Tool name: ${toolName}\n`);

  // Step 1: Check for secrets
  console.log(`[1/7] Checking for hardcoded secrets...`);
  const workflowStr = JSON.stringify(workflow);
  const secretFindings = [];

  for (const { name, regex } of SECRET_PATTERNS) {
    regex.lastIndex = 0;
    if (regex.test(workflowStr)) {
      secretFindings.push(name);
    }
  }

  if (secretFindings.length > 0) {
    console.error(`\n  BLOCKED: Found potential secrets:`);
    secretFindings.forEach(s => console.error(`    - ${s}`));
    console.error(`\n  Please remove secrets from the workflow and try again.\n`);
    rl.close();
    process.exit(1);
  }
  console.log(`  No secrets detected.\n`);

  // Step 2: Detect hardcoded URLs
  console.log(`[2/7] Detecting hardcoded URLs...`);
  const urlMatches = workflowStr.match(URL_PATTERN) || [];
  const uniqueUrls = [...new Set(urlMatches)].filter(url => !LOCALHOST_PATTERN.test(url));

  const urlReplacements = {};

  if (uniqueUrls.length > 0) {
    console.log(`\n  Found ${uniqueUrls.length} hardcoded URL(s):\n`);

    for (const url of uniqueUrls) {
      console.log(`  URL: ${url}`);
      const varName = await question(`  Variable name (e.g., TRUENAS_URL) or 'skip': `);

      if (varName && varName.toLowerCase() !== 'skip') {
        urlReplacements[url] = `\${${varName.toUpperCase()}}`;
        console.log(`  -> Will replace with \${${varName.toUpperCase()}}\n`);
      } else {
        console.log(`  -> Skipped\n`);
      }
    }
  } else {
    console.log(`  No hardcoded URLs found.\n`);
  }

  // Step 3: Detect resource locators (dropdown selections)
  console.log(`[3/7] Detecting resource locators (dropdown selections)...`);
  const resourceLocators = findResourceLocators(workflow);
  const rlReplacements = {};

  if (resourceLocators.length > 0) {
    console.log(`\n  Found ${resourceLocators.length} dropdown selection(s) that need parameterizing:\n`);

    for (const rl of resourceLocators) {
      const fieldName = rl.path.split('.').pop();
      const displayName = rl.cachedName || rl.value;
      console.log(`  Field: ${fieldName}`);
      console.log(`  Current value: ${displayName}`);

      const suggestedVar = fieldName.toUpperCase().replace(/([a-z])([A-Z])/g, '$1_$2');
      const varName = await question(`  Variable name (Enter to use ${suggestedVar} or type your own): `);

      const finalVar = varName.trim().toUpperCase() || suggestedVar;
      rlReplacements[rl.path] = {
        variable: `\${${finalVar}}`,
        varName: finalVar,
        originalValue: rl.value,
        description: `${fieldName} - ${rl.cachedName || 'ID'}`
      };
      console.log(`  -> Will replace with \${${finalVar}}\n`);
    }
  } else {
    console.log(`  No dropdown selections found.\n`);
  }

  // Step 4: Sanitize workflow
  console.log(`[4/7] Sanitizing workflow...`);

  let sanitizedStr = workflowStr;

  // Replace URLs with variables
  for (const [url, variable] of Object.entries(urlReplacements)) {
    sanitizedStr = sanitizedStr.split(url).join(variable);
  }

  let sanitized = JSON.parse(sanitizedStr);

  // Apply resource locator replacements (convert list mode to id mode)
  for (const [path, replacement] of Object.entries(rlReplacements)) {
    setNestedProperty(sanitized, path, convertResourceLocatorToId({}, replacement.variable));
  }

  // Strip instanceId from meta (user-specific)
  if (sanitized.meta) {
    delete sanitized.meta.instanceId;
  }

  // Nullify credential IDs but keep names
  const credentialTypes = new Set();

  sanitized.nodes = sanitized.nodes.map(node => {
    if (node.credentials) {
      for (const [credType, credInfo] of Object.entries(node.credentials)) {
        credentialTypes.add(credType);
        node.credentials[credType] = {
          id: null,
          name: credInfo.name || `${toolName}_credential`
        };
      }
    }
    return node;
  });

  // Extract webhook info
  const webhookNode = sanitized.nodes.find(n =>
    n.type === 'n8n-nodes-base.webhook' ||
    n.type?.includes('webhook')
  );

  const webhookDescription = webhookNode?.notes || '';

  if (!webhookDescription) {
    console.log(`\n  WARNING: No webhook description found.`);
    console.log(`  Add a description to the webhook node's 'notes' field.\n`);
  } else {
    console.log(`  Webhook description found.`);
  }

  console.log(`  Credential IDs nullified.`);
  console.log(`  ${Object.keys(urlReplacements).length} URL(s) replaced.`);
  console.log(`  ${Object.keys(rlReplacements).length} resource locator(s) converted.`);
  if (sanitized.meta) console.log(`  Instance ID stripped from meta.`);
  console.log('');

  // Step 5: Generate manifest
  console.log(`[5/7] Generating manifest...\n`);

  // Build required_variables from URL and resource locator replacements
  const requiredVariables = [];
  for (const [url, variable] of Object.entries(urlReplacements)) {
    const varName = variable.replace('${', '').replace('}', '');
    requiredVariables.push({
      name: varName,
      description: `Your service URL`,
      example: url
    });
  }

  // Add resource locator variables
  for (const [path, replacement] of Object.entries(rlReplacements)) {
    requiredVariables.push({
      name: replacement.varName,
      description: replacement.description,
      example: replacement.originalValue
    });
  }

  // Build required_credentials from detected credential types
  const requiredCredentials = [];

  for (const credType of credentialTypes) {
    // Find the credential name from the workflow
    let credName = null;
    for (const node of sanitized.nodes) {
      if (node.credentials?.[credType]?.name) {
        credName = node.credentials[credType].name;
        break;
      }
    }

    requiredCredentials.push({
      credential_type: credType,
      name: credName || credType,
      description: `n8n credential type: ${credType}`
    });
  }

  // Prompt for voice triggers
  console.log(`  Enter voice trigger examples (how users would say this):`);
  const trigger1 = await question(`  Trigger 1: Hey Cal, `);
  const trigger2 = await question(`  Trigger 2: Hey Cal, `);

  // Prompt for service name
  const servicesInput = await question(`\n  Required services (comma-separated, e.g., truenas, jellyfin): `);
  const services = servicesInput ? servicesInput.split(',').map(s => s.trim().toLowerCase()).filter(s => s) : [];

  // Prompt for GitHub username
  const githubUsername = await question(`\n  GitHub username: `);

  const manifest = {
    name: toolName.replace(/_/g, '-'),
    version: "1.0.0",
    description: webhookDescription.split('\n')[0] || `${toolName} tool`,
    category: category,
    voice_triggers: [trigger1, trigger2].filter(t => t),
    required_services: services,
    required_credentials: requiredCredentials,
    required_variables: requiredVariables,
    author: {
      github: githubUsername || "unknown"
    },
    tier: "community",
    tags: [category, ...services].filter(Boolean),
    dependencies: [],
    created: new Date().toISOString().split('T')[0],
    updated: new Date().toISOString().split('T')[0]
  };

  // Step 6: Write files
  console.log(`\n[6/7] Writing files...`);

  const toolDir = path.join(process.cwd(), 'tools', category, toolName.replace(/_/g, '-'));
  fs.mkdirSync(toolDir, { recursive: true });

  // Write workflow
  fs.writeFileSync(
    path.join(toolDir, 'workflow.json'),
    JSON.stringify(sanitized, null, 2)
  );
  console.log(`  Created: ${toolDir}/workflow.json`);

  // Write manifest
  fs.writeFileSync(
    path.join(toolDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log(`  Created: ${toolDir}/manifest.json`);

  // Generate README
  const readme = `# ${manifest.name}

${manifest.description}

## Voice Triggers

${manifest.voice_triggers.map(t => `- "Hey Cal, ${t}"`).join('\n')}

## What It Does

${webhookDescription || 'TODO: Add description'}

## Requirements

- ${services.length ? services.join(', ') : 'Service'} instance
- API key for authentication

## Installation

### CAAL Frontend (Recommended)

1. Open CAAL web interface
2. Browse to this tool
3. Click Install

### Install Script

\`\`\`bash
curl -s https://raw.githubusercontent.com/CoreWorxLab/caal-tools/main/scripts/install.sh | bash -s ${manifest.name}
\`\`\`

### Manual

1. Download \`workflow.json\`
2. Import into n8n (Settings > Import from File)
3. Create credential "${requiredCredentials[0]?.name || 'API Key'}"
4. Update service URL: \`${requiredVariables[0]?.name || 'SERVICE_URL'}\`
5. Activate the workflow

## Configuration

| Variable | Description | Example |
|----------|-------------|---------|
${requiredVariables.map(v => `| \`${v.name}\` | ${v.description} | \`${v.example}\` |`).join('\n')}
`;

  fs.writeFileSync(path.join(toolDir, 'README.md'), readme);
  console.log(`  Created: ${toolDir}/README.md`);

  // Step 7: Run validation automatically
  console.log(`\n[7/7] Running validation...\n`);

  const { execSync } = require('child_process');
  const scriptsDir = path.dirname(__filename);

  let validationPassed = true;

  // Run validate.js
  try {
    execSync(`node "${path.join(scriptsDir, 'validate.js')}" "${toolDir}"`, { stdio: 'inherit' });
  } catch (e) {
    validationPassed = false;
  }

  // Run check-secrets.js
  try {
    execSync(`node "${path.join(scriptsDir, 'check-secrets.js')}" "${toolDir}"`, { stdio: 'inherit' });
  } catch (e) {
    validationPassed = false;
  }

  console.log(`\n========================================`);
  console.log(`  Intake complete!`);
  console.log(`========================================\n`);
  console.log(`Tool created at: ${toolDir}\n`);

  if (validationPassed) {
    console.log(`Validation passed! Next steps:`);
    console.log(`  1. Review the generated files`);
    console.log(`  2. Create PR:`);
    console.log(`     git checkout -b add-${manifest.name}`);
    console.log(`     git add .`);
    console.log(`     git commit -m "feat: add ${manifest.name}"`);
    console.log(`     git push -u origin add-${manifest.name}`);
    console.log(`     gh pr create --title "feat: add ${manifest.name}" --body "Adds ${manifest.name} tool to the registry."\n`);
  } else {
    console.log(`Validation failed. Please fix the issues above and re-run:`);
    console.log(`  node scripts/validate.js ${toolDir}`);
    console.log(`  node scripts/check-secrets.js ${toolDir}\n`);
  }

  rl.close();
}

main().catch(err => {
  console.error(err);
  rl.close();
  process.exit(1);
});
