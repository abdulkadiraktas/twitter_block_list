const fs = require('fs');
const path = require('path');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

const filePath = path.join(process.cwd(), 'blocklist.json');

let data;

if (fs.existsSync(filePath)) {
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    fail(`blocklist.json is not valid JSON: ${err.message}`);
  }
} else {
  // Initialize new blocklist if not found
  data = {
    version: 0,
    updated: new Date().toISOString().split('T')[0],
    accounts: []
  };
  console.log('blocklist.json not found. Creating a new one.');
}

// Parse arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node scripts/add_accounts.js [username...]');
  // If we just created the file but didn't add anything, we might want to save it anyway?
  // But usually this script is for adding.
  // Let's allow creating empty file if arguments are missing but file was missing.
  if (data.version === 0 && data.accounts.length === 0) {
     // write the empty file
  } else {
     process.exit(0);
  }
}

if (!Array.isArray(data.accounts)) {
  fail('"accounts" field must be an array.');
}

const existingAccounts = new Set(data.accounts);
let addedCount = 0;
let skippedCount = 0;

for (const arg of args) {
  let username = arg.trim();

  // Remove leading @ if present
  if (username.startsWith('@')) {
    username = username.slice(1);
  }

  // Convert to lowercase
  username = username.toLowerCase();

  // Validate
  if (username.length === 0) {
    console.warn('Skipping empty username.');
    continue;
  }

  if (existingAccounts.has(username)) {
    console.log(`Skipping duplicate: ${username}`);
    skippedCount++;
    continue;
  }

  data.accounts.push(username);
  existingAccounts.add(username);
  console.log(`Added: ${username}`);
  addedCount++;
}

if (addedCount > 0 || (data.version === 0 && args.length === 0)) {
  // Sort alphabetically
  data.accounts.sort();

  // Update metadata
  if (addedCount > 0) {
      data.version = (data.version || 0) + 1;
  }
  data.updated = new Date().toISOString().split('T')[0];

  // Write back to file
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
    if (addedCount > 0) {
        console.log(`Success: Added ${addedCount} accounts. Updated version to ${data.version}.`);
    } else {
        console.log(`Initialized blocklist.json.`);
    }
  } catch (err) {
    fail(`Failed to write to blocklist.json: ${err.message}`);
  }
} else {
  console.log('No new accounts added.');
}
