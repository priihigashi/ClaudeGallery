---
name: boletim-diario
description: Continue/operate Priscila's "Boletim Diário" daily-briefing app — live site, data pipeline, feedback backend, and the daily routine.
---

# Boletim Diário — operating skill

Priscila's personal daily briefing web app. Dark glassmorphism + pink `#D88FAC`, Playfair, mobile-first, PT-BR.

## Where everything lives
- **Live app:** https://priihigashi.github.io/ClaudeGallery/boletim-diario.html
- **Repo:** `priihigashi/ClaudeGallery`, branch `main`. Commit via the Composio GitHub connection (authorize as `priihigashi`).
  - `boletim-diario.html` — the app (static; fetches data, never needs redeploy for content)
  - `boletim-data.json` — today's content (the daily routine overwrites this)
  - `boletim-data/<YYYY-MM-DD>.json` — dated archives (day-chips/history)
  - `boletim-sync/boletim-sync.gs` — feedback Apps Script (👍/👎/★ → Sheet)
- **Sheet (feedback + highlights):** `1TAcpBw8j1R1nqLTzbmVt4g0EuvAP4ToWtfpMgZmQn-8` (Productivity & Routine folder `1b8Cfc8lJhu5unDaxDQIdo4xdN6X7n1nS`).
- **Ideas & Inbox:** `1IrFrCNGVIF7cvAr9cIuAXvCtUR_-eQN1mdCpHXpfbcU`.

## Accounts
- Use Priscila's **native** Google connector `priscila@oakpark-construction.com` for Sheets/Gmail/Calendar.
- **Composio** is on `mcfollingproperties@gmail.com` and CANNOT write her Drives — use it **only** for GitHub commits.

## 8 topics (order)
`tip`, `receita`, `merch`, `conteudo`, `obra`, `geo`, `ads`, `iafim`.

## boletim-data.json schema
```
{ "date":"YYYY-MM-DD",
  "highlights":[{"tag":"","t":"","why":"","go":"<topicId>"}],
  "history":[{"date":"","label":"","note":""}],
  "topics":{"<topicId>":[{"id":"<topic>-<date>","top":true,"t":"","resumo":"","porque":"","aplicar":"","plano":"","fonte":{"t":"","u":""},"video":{"t":"","u":""}}]} }
```

## Daily routine (10:00 America/New_York)
1. Read 👎 (Feedback tab or `GET ?action=downvotes`) → skip disliked.
2. 1 lightweight WebSearch per topic (8 total).
3. Synthesize each card (PT-BR, concrete, short).
4. Top-10 Highlights from Gmail + Calendar + quality; log with 'Foi Highlight'.
5. Write `boletim-data.json` + archive `boletim-data/<date>.json`; commit via Composio GitHub.
6. Fail-safe: research fails → keep yesterday's JSON.

## Content rules
- Receita: vegan/veg, easy, kid-friendly, NEVER fish/seafood, no cow's milk, loves cheese (vegan, FL); 1 elaborate every ~4 days.
- Merch: quality POD + embroidery + women's longline tees; real reviews.
- Tip: non-generic ADHD productivity.
