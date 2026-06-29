# Boletim Diário — feedback sync

Backend for the 👍/👎/★ buttons on `boletim-diario.html`. Same pattern as `study-sync`:
a Google Apps Script Web App writing to a Google Sheet, called by the static page.

## What it does
- **`doPost`** — the page sends each 👍/👎/★ → appended to the **Feedback** tab of the sheet.
- **`doGet?action=downvotes`** (JSONP) — returns everything Priscila 👎'd, so the daily
  routine reads it and avoids repeating those cards/topics.

## One-time deploy (~5 min)
1. Open the sheet **Boletim Diário — Tracking & Master Plan**
   (`1TAcpBw8j1R1nqLTzbmVt4g0EuvAP4ToWtfpMgZmQn-8`) → **Extensions ▸ Apps Script**.
2. Paste the contents of [`boletim-sync.gs`](./boletim-sync.gs). Save.
3. **Deploy ▸ New deployment ▸** type **Web app**.
   - **Execute as:** Me
   - **Who has access:** Anyone
4. **Deploy** → authorize → **copy the Web app URL**.
5. Paste that URL into `SYNC_URL` near the top of `boletim-diario.html`, commit, done.

Until `SYNC_URL` is set, feedback still works — it's just saved on the device (localStorage)
and not yet logged to the sheet. The page never breaks.

## Data
- Sheet tab **Feedback**: `ts, date, topic, cardId, title, vote, fav`.
- The daily routine reads `?action=downvotes` (or the tab directly via the native Sheets
  connector) before researching, to skip disliked topics/cards.
