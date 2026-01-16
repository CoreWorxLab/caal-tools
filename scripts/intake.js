#!/usr/bin/env node

/**
 * Intake script for sanitizing and importing n8n workflows into the registry.
 *
 * Usage: node scripts/intake.js <workflow.json> <category> [tool-name]
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

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('\nUsage: node scripts/intake.js <workflow.json> <category> [tool-name]\n');
    console.error('Categories: smart-home, media, homelab, productivity, utilities\n');
    console.error('Example: node scripts/intake.js ~/workflows/truenas_get_status.json homelab\n');
    process.exit(1);
  }

  const [workflowPath, category, customName] = args;
  const validCategories = ['smart-home', 'media', 'homelab', 'productivity', 'utilities', 'social', 'other'];

  if (!validCategories.includes(category)) {
    console.error(`\nInvalid category: ${category}`);
    console.error(`Must be one of: ${validCategories.join(', ')}\n`);
    process.exit(1);
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
  console.log(`[1/5] Checking for hardcoded secrets...`);
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
  console.log(`[2/5] Detecting hardcoded URLs...`);
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

  // Step 3: Sanitize workflow
  console.log(`[3/5] Sanitizing workflow...`);

  let sanitizedStr = workflowStr;

  // Replace URLs with variables
  for (const [url, variable] of Object.entries(urlReplacements)) {
    sanitizedStr = sanitizedStr.split(url).join(variable);
  }

  let sanitized = JSON.parse(sanitizedStr);

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
  console.log(`  ${Object.keys(urlReplacements).length} URL(s) replaced.\n`);

  // Step 4: Generate manifest
  console.log(`[4/5] Generating manifest...\n`);

  // Build required_variables from replacements
  const requiredVariables = [];
  for (const [url, variable] of Object.entries(urlReplacements)) {
    const varName = variable.replace('${', '').replace('}', '');
    requiredVariables.push({
      name: varName,
      description: `Your service URL`,
      example: url
    });
  }

  // Build required_credentials from detected credential types
  const requiredCredentials = [];

  // Known predefined credential types (n8n built-in)
  const predefinedTypes = {
    githubApi: 'GitHub API',
    slackApi: 'Slack API',
    notionApi: 'Notion API',
    googleApi: 'Google API',
    discordApi: 'Discord API',
    spotifyApi: 'Spotify API',
    twilioApi: 'Twilio API',
    telegramApi: 'Telegram API',
    homeAssistantApi: 'Home Assistant API',
  };

  // Generic credential type display names
  const genericTypeNames = {
    httpHeaderAuth: 'Header Auth',
    httpBasicAuth: 'Basic Auth',
    httpDigestAuth: 'Digest Auth',
    oAuth2Api: 'OAuth2',
    sshPassword: 'SSH Password',
    sshPrivateKey: 'SSH Private Key',
  };

  for (const credType of credentialTypes) {
    const servicePart = toolName.split(/[_-]/)[0].toUpperCase();
    const isPredefined = predefinedTypes.hasOwnProperty(credType);
    const isSSH = credType.toLowerCase().includes('ssh');

    if (isPredefined) {
      // Predefined n8n credential type
      requiredCredentials.push({
        auth_type: 'predefined',
        credential_type: credType,
        name: `${servicePart.toLowerCase()}_account`,
        description: predefinedTypes[credType],
        node: 'Various'
      });
    } else {
      // Generic credential type
      const typePart = genericTypeNames[credType] || credType;
      const credName = isSSH ? `${servicePart} SSH` : `${servicePart} API Key`;
      const credDesc = isSSH
        ? `${servicePart} - ${typePart} Credential`
        : `${servicePart} API - ${typePart} Credential`;
      requiredCredentials.push({
        auth_type: 'generic',
        credential_type: credType,
        name: credName,
        description: credDesc,
        node: isSSH ? 'SSH' : 'HTTP Request',
        header_name: isSSH ? undefined : 'Authorization'
      });
    }
  }

  // Prompt for voice triggers
  console.log(`  Enter voice trigger examples (how users would say this):`);
  const trigger1 = await question(`  Trigger 1: "Hey Cal, `);
  const trigger2 = await question(`  Trigger 2: "Hey Cal, `);

  // Prompt for service name
  const serviceName = await question(`\n  Required service (e.g., truenas, jellyfin): `);

  const manifest = {
    name: toolName.replace(/_/g, '-'),
    version: "1.0.0",
    description: webhookDescription.split('\n')[0] || `${toolName} tool`,
    category: category,
    voice_triggers: [trigger1, trigger2].filter(t => t),
    required_services: serviceName ? [serviceName.toLowerCase()] : [],
    required_credentials: requiredCredentials,
    required_variables: requiredVariables,
    author: {
      github: "cmac",
      name: "Chris Mac"
    },
    tier: "experimental",
    tags: [category, serviceName?.toLowerCase()].filter(Boolean),
    dependencies: [],
    created: new Date().toISOString().split('T')[0],
    updated: new Date().toISOString().split('T')[0]
  };

  // Step 5: Write files
  console.log(`\n[5/6] Writing files...`);

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

- ${serviceName || 'Service'} instance
- API key for authentication

## Installation

### Quick Install

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

## Example Response

> "TODO: Add example of what CAAL says"
`;

  fs.writeFileSync(path.join(toolDir, 'README.md'), readme);
  console.log(`  Created: ${toolDir}/README.md`);

  // Step 6: Run validation automatically
  console.log(`\n[6/6] Running validation...\n`);

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
    console.log(`  2. Create PR: git checkout -b add-${manifest.name} && git add . && git commit -m "feat: add ${manifest.name}" && git push\n`);
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
