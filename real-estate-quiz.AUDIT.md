# Real Estate Quiz — Conventions & Audit Log

Durable reference for `real-estate-quiz.html` (Florida real estate pre-license exam study tool).
This is the project's source of truth for *how it's built and deployed* and *what has been audited*.

## Location & deploy
- **Repo / file:** `priihigashi/ClaudeGallery` → `real-estate-quiz.html` (single self-contained HTML file).
- **Hosting:** GitHub Pages off branch `main`. **Push to `main` → auto-redeploys in ~1 min.** No build step.
- **Live URL:** https://priihigashi.github.io/ClaudeGallery/real-estate-quiz.html
- **Verify a deploy:** poll `gh api repos/priihigashi/ClaudeGallery/pages/builds/latest -q .status` until `built`, then fetch the live URL with a cache-buster and grep for the changed string.

## Question bank conventions
- Bank lives in one JS array, `const BANK = [ ... ];`. Edit it **programmatically** (parse JSON → modify → re-serialize); never hand-edit the giant line.
- **ID prefixes:**
  - `chN-qNN`, `gc-*`, `cr-*` = questions scanned/derived from the **Gold Coast SalesPreBook (14th ed.)** with a `book` object (page image IDs + `hl` highlight rectangles).
  - `ax-chN-NN` = **Audited Expansion** questions authored from standard FL pre-license curriculum (no book scan). `source: "Audited Expansion — FL RE Curriculum"`.
- **`verificationBasis`** (string field): the audit citation for a question — statute (e.g. F.S. 201.02) and/or book chapter+page. Rendered to the student after answering as "🔎 Basis: …".
- **Book modal:** only renders for questions whose `book.imgs` has entries. When `book.hl` is empty, the note must NOT promise a highlight — it shows an honest "exact line isn't pinpointed; read the full page" message.

## Scoring / progress model
- A round is logged once via `logSession({t,n,r,exam,retry})`.
- **Main round** is logged with `retry:false` even when it spawns a recovery round (logged at the branch point, before `start(missed,true)`).
- **Recovery (retry) rounds** are logged with `retry:true`.
- **Improvement trend** averages only `retry:false` sessions (recoveries excluded, so a 2/2 recovery can't inflate the trend).
- Session-history rows for recoveries are tagged `↩️ … recovery`.
- Resume: in-progress main round saved to `localStorage.reqz_current`; offered on reload. Reset: 🗑️ button clears all `reqz_*` keys.

## Audit log
- **2026-06-22**
  - Fixed invisible "Practice exam" button (white text on blue). `ef6a2e9`
  - Added resume-unfinished-round + reset-progress button. `5540764`
  - Honest book-modal note for 14 pages with empty highlights (no false highlight promise). `e5d09c2`
  - Verified penalty questions `ch6-q07` / `ch6-q15` (page 104) — correct & consistent.
  - +30 audited questions across Ch 10/11/12/14/16 (~40% of exam). Bank 241 → 271. `a8fb64e`
  - Scoring fix (log original round, trend excludes recoveries) + `verificationBasis` on all 30 + Ch14-02 Miami-Dade wording + Ch14-03 $2,450 cap note. `9ee1aee`
  - Ch14-03 wording made precise (note cap $2,450; recorded FL mortgage taxed once, uncapped). `54e719b`

## OPEN audit items
- **Exact-page mapping for the 30 `ax-` questions is NOT complete.** Current `verificationBasis` cites statutes for the FL-tax and Statute-of-Frauds items, but the rest use broad chapter + approximate chapter-start page (e.g. "Ch 10, book p.163+"). These are useful curriculum references, **not exact per-concept page citations.** Producing exact pages requires the Gold Coast SalesPreBook (14th ed.) page index/scans. Do not fabricate page numbers.
- **Pixel-accurate highlights** for `ax-` questions and the 14 honest-note questions: parked. Trigger = a question the user repeatedly misses, or a high-weight chapter. Requires OCR of book page images (Vision API key pending).
