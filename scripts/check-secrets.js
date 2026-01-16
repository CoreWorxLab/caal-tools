#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

let file = process.argv[2];

if (!file) {
  console.error('Usage: check-secrets.js <file-or-directory>');
  console.error('Example: check-secrets.js tools/media/jellyseerr-search');
  console.error('         check-secrets.js tools/media/jellyseerr-search/workflow.json');
  process.exit(1);
}

if (!fs.existsSync(file)) {
  console.error(`File not found: ${file}`);
  process.exit(1);
}

// If directory, look for workflow.json inside
if (fs.statSync(file).isDirectory()) {
  file = path.join(file, 'workflow.json');
  if (!fs.existsSync(file)) {
    console.error(`workflow.json not found in directory`);
    process.exit(1);
  }
}

const content = fs.readFileSync(file, 'utf8');

const patterns = [
  { name: 'API Key assignment', regex: /api[_-]?key\s*[:=]\s*["'][^"']{10,}["']/gi },
  { name: 'Bearer token', regex: /bearer\s+[a-zA-Z0-9_-]{20,}/gi },
  { name: 'OpenAI key', regex: /sk-[a-zA-Z0-9]{20,}/g },
  { name: 'GitHub PAT', regex: /ghp_[a-zA-Z0-9]{36}/g },
  { name: 'GitHub OAuth', regex: /gho_[a-zA-Z0-9]{36}/g },
  { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/g },
  { name: 'Password assignment', regex: /password\s*[:=]\s*["'][^"']+["']/gi },
  { name: 'Secret assignment', regex: /secret\s*[:=]\s*["'][^"']+["']/gi },
  { name: 'Private key', regex: /-----BEGIN [A-Z]+ PRIVATE KEY-----/g },
  { name: 'URL with credentials', regex: /https?:\/\/[^:]+:[^@]+@/g },
];

const findings = [];

for (const { name, regex } of patterns) {
  // Reset regex state
  regex.lastIndex = 0;
  const matches = content.match(regex);
  if (matches) {
    findings.push({ name, count: matches.length, samples: matches.slice(0, 2) });
  }
}

if (findings.length > 0) {
  console.error(`\n Potential secrets found in ${file}:\n`);
  findings.forEach(f => {
    console.error(`  ${f.name}: ${f.count} occurrence(s)`);
    f.samples.forEach(s => {
      // Redact most of the match for safety
      const redacted = s.length > 20 ? s.substring(0, 10) + '...[REDACTED]' : s;
      console.error(`    - ${redacted}`);
    });
  });
  console.error('\nPlease remove hardcoded secrets and use n8n credentials instead.');
  console.error('See: https://docs.n8n.io/credentials/\n');
  process.exit(1);
}

console.log(` ${file} - no secrets detected\n`);
