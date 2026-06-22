# Study Progress Sync (optional cross-device sync)

Lets the citizenship quiz (and the real-estate quiz) keep progress in sync across phone +
laptop, with no login. Your data lives in **one small Google Sheet in your own Drive** —
one row per profile, overwritten on each sync, so it never piles up. One sheet serves both
quizzes (separate columns), so it doesn't create a cluster of spreadsheets.

## How it works
- **Write** (`POST`): the quiz sends a snapshot of your progress; the script upserts your row.
- **Read** (`JSONP GET`): on load, the quiz pulls your snapshot and **merges** it with the
  device — it unions the answer logs and re-derives your stats, so two devices combine
  instead of overwriting each other. Apps Script can't send CORS headers, hence JSONP.
- Each profile is protected by a **passphrase**, stored only as a SHA-256 hash.

Sheet (already created, in the Studies drive):
https://docs.google.com/spreadsheets/d/1ECBcw0Ycc5RGZ2-fRzjLbzn52rLUZCGrZby5lYvM9Xk/edit

## One-time setup (~3 minutes, once ever)
0. Make sure you're signed into the **Google account that owns the Studies drive**
   (priscila@oakpark-construction.com) — the script reads/writes the sheet above.
1. Go to **script.google.com** → **New project**.
2. Delete the default code, paste the contents of [`study-sync.gs`](study-sync.gs), Save.
   (The sheet ID is already filled in.)
3. **Deploy → New deployment**. Click the gear → **Web app**.
4. **Execute as: Me** · **Who has access: Anyone** → **Deploy**.
5. **Authorize access** → choose your Google account → Allow (you may see an "unverified app"
   screen — it's your own script; Advanced → Go to project → Allow).
6. Copy the **Web app URL** (ends in `/exec`).

## Turn it on in the quiz
On each device: open **📊 Progress → ☁️ Cross-device sync**, paste the URL, pick a **profile
name + passphrase** (use the same on every device), tap **Enable & sync now**. Done — it
syncs automatically after that.

## Notes
- The sheet auto-creates as **"Study Progress Sync"** in your Drive on first save. Move it into
  your Studies folder if you want it filed with the project; the script remembers it by ID.
- Privacy: gated by your profile + passphrase, not bank-grade encryption — appropriate for a
  study app. No Google password or API key is ever exposed; the script runs under your account.
- To wipe sync data, just delete the row (or the sheet) in your Drive.
