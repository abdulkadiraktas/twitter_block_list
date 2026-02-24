const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '..', 'blocklist.json');

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function main() {
    if (!fs.existsSync(FILE_PATH)) {
        console.error('Error: blocklist.json not found.');
        process.exit(1);
    }

    let data;
    try {
        data = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
    } catch (err) {
        console.error('Error parsing blocklist.json:', err);
        process.exit(1);
    }

    const originalAccounts = [...data.accounts]; // Copy original array
    const newAccounts = process.argv.slice(2);
    let addedCount = 0;
    const seen = new Set(data.accounts);

    newAccounts.forEach(arg => {
        let username = arg.trim().toLowerCase();

        // Remove @ if present
        if (username.startsWith('@')) {
            username = username.slice(1);
        }

        if (username.length > 0) {
            if (!seen.has(username)) {
                data.accounts.push(username);
                seen.add(username);
                addedCount++;
                console.log(`Added: ${username}`);
            } else {
                console.log(`Skipped (duplicate): ${username}`);
            }
        }
    });

    // Sort alphabetically
    data.accounts.sort((a, b) => a.localeCompare(b));

    // Check if changes occurred (either new accounts or re-sorting needed)
    const isChanged = JSON.stringify(data.accounts) !== JSON.stringify(originalAccounts);

    if (isChanged) {
         data.version += 1;
         data.updated = formatDate(new Date());

         fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2) + '\n');
         console.log(`Success! Version bumped to ${data.version}. Updated date to ${data.updated}.`);
         if (addedCount > 0) {
             console.log(`Added ${addedCount} new accounts.`);
         } else {
             console.log(`Sorted existing list.`);
         }
    } else {
        console.log('No changes needed.');
    }
}

main();
