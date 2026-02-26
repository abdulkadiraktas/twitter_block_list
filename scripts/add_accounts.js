const fs = require('fs');
const path = require('path');

const blocklistPath = path.join(__dirname, '../blocklist.json');

function addAccounts(newAccounts) {
  if (newAccounts.length === 0) {
    console.log('No accounts provided.');
    return;
  }

  try {
    const data = JSON.parse(fs.readFileSync(blocklistPath, 'utf8'));
    const initialCount = data.accounts.length;
    const accountSet = new Set(data.accounts);

    let addedCount = 0;
    newAccounts.forEach(acc => {
      // Normalize: remove @, lowercase, trim
      let cleanAcc = acc.replace(/^@/, '').trim().toLowerCase();
      if (cleanAcc && !accountSet.has(cleanAcc)) {
        accountSet.add(cleanAcc);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      data.accounts = Array.from(accountSet).sort();
      data.version += 1;

      const now = new Date();
      // Format date as YYYY-MM-DD
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      data.updated = `${year}-${month}-${day}`;

      fs.writeFileSync(blocklistPath, JSON.stringify(data, null, 2) + '\n');
      console.log(`Successfully added ${addedCount} new account(s). Version updated to ${data.version}.`);
    } else {
      console.log('No new unique accounts were added.');
    }

  } catch (error) {
    console.error('Error updating blocklist:', error);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
addAccounts(args);
