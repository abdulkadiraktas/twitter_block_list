const fs = require('fs');
const path = require('path');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function isLowercase(value) {
  return value === value.toLowerCase();
}

const filePath = path.join(process.cwd(), 'blocklist.json');
if (!fs.existsSync(filePath)) {
  fail('blocklist.json not found.');
}

let data;
try {
  data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
} catch (err) {
  fail(`blocklist.json is not valid JSON: ${err.message}`);
}

if (typeof data !== 'object' || data === null || Array.isArray(data)) {
  fail('blocklist.json must be an object.');
}

if (!Object.prototype.hasOwnProperty.call(data, 'version')) {
  fail('Missing "version" field.');
}
if (!Object.prototype.hasOwnProperty.call(data, 'updated')) {
  fail('Missing "updated" field.');
}
if (!Object.prototype.hasOwnProperty.call(data, 'accounts')) {
  fail('Missing "accounts" field.');
}

if (typeof data.version !== 'number' || !Number.isInteger(data.version)) {
  fail('"version" must be an integer.');
}

if (typeof data.updated !== 'string') {
  fail('"updated" must be a string.');
}

if (!Array.isArray(data.accounts)) {
  fail('"accounts" must be an array.');
}

const seen = new Set();
for (const raw of data.accounts) {
  if (typeof raw !== 'string') {
    fail('All account entries must be strings.');
  }

  const value = raw.trim();
  if (value.length === 0) {
    fail('Account entries cannot be empty.');
  }

  if (value.startsWith('@')) {
    fail(`Account "${value}" must not include '@'.`);
  }

  if (!isLowercase(value)) {
    fail(`Account "${value}" must be lowercase.`);
  }

  if (seen.has(value)) {
    fail(`Duplicate account found: "${value}".`);
  }

  seen.add(value);
}

console.log(`OK: ${data.accounts.length} accounts validated.`);
