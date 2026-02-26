# Twitter Block List

A shared block list for X (Twitter). This repository only hosts the list data and is intended to be consumed as JSON by extensions or automation.

## Extension

This block list is used by the [Twitter Bot Blocker](https://chromewebstore.google.com/detail/twitter-bot-blocker/ghmmbpjgbalbncdogdecijnkdncnokpc?authuser=0&hl=tr) Chrome extension. The accounts in the blocklist are managed by **abdulkadir aktaş**. If you think there's an error or inappropriate block, you can open a PR.

## List Format

The blocklist uses this format:

```json
{
  "version": 1,
  "updated": "2026-02-20",
  "accounts": ["bothandle1", "bothandle2"]
}
```

- version: List version number (a change triggers updates)
- updated: Last update date
- accounts: Usernames to block (no @, lowercase)

## Rules

- All usernames must be lowercase
- Do not use @
- Do not add duplicates

## Update Flow

To add new accounts, you can use the following script:

```bash
node scripts/add_accounts.js <username1> <username2> ...
```

This script automatically:
- Normalizes accounts (lowercase, removes @)
- Sorts the list alphabetically
- Increments the version number
- Updates the updated date

If updating manually:
1. Add or remove accounts in accounts
2. Increment version by 1
3. Update the updated date

## PR Flow

1. Fork the repo and create a new branch
2. Update blocklist.json
3. Keep changes small and focused
4. Fill in the PR checklist
5. CODEOWNERS approval is required
6. Automated checks (blocklist validation) must pass

## Automatic PR (Plan)

The Chrome extension exports the local list and generates a link that opens the PR page in the browser. The user performs final checks in the browser and completes the PR. This keeps the flow secure without storing tokens in the extension.

## Usage

This file can be fetched periodically by Chrome extensions or automation tools. See the twitter_bot_blocker repository for a reference implementation.
