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
  - **Correction:** earlier reports wrongly called exact-page mapping "blocked / needs Vision API." It is not — the searchable book is local and PyMuPDF is installed (verified). OPEN items below rewritten accordingly.
  - Exact-page mapping pass run via PyMuPDF (per-page printed-number detection from headers, all 5 chapters anchor-validated, chapter-restricted multi-keyword search). **17/30** `ax-` questions got exact verified printed pages; **13** stayed low-confidence and were left unchanged. `b7b40b5`

## Reporting & verification discipline (to prevent the mistakes that triggered this correction)
- **No blocker claim without a probe.** Before writing "blocked / requires / not possible / pending," run the real check (`ls` the path, import the tool, open the file) and keep the evidence. Rule #1 of the global CLAUDE.md; do not skip it.
- **Headline must match the body.** Each item gets one label only — ✅ Done (verified by a check actually run) · 🟡 Open (with the real reason) · 🔴 Blocked (with tested proof). A summary may say "done" only if every sub-item is ✅. Never pair "all closed" with a 🟡.
- **"Verified live" means a check was run** against the deployed artifact — never "should work."

## Exact-page mapping — status (2026-06-22)
- **Method:** local `English RE Sales Associate SalesPreBook.pdf` (628 pp) + PyMuPDF. Printed page numbers read **per page** from the running header (number leads on even pages, trails on odd; offset is +7 but detection is per-page, not assumed). Search restricted to each question's chapter window (from `CHPAGE`); a page must contain **≥2 distinct signature terms**; all 5 priority chapters passed ≥3 anchor checks against existing scanned `book.page` values.
- **Result: 17/30 high-confidence → exact pages deployed** (`b7b40b5`). Each carries `printedPage`, `pdfPageIndex` (kept distinct), `bookPage` (display), and a "(exact page verified)" `verificationBasis`.
  - Ch10: 01→164, 02→170, 03→174, 04→174, 05→164 · Ch11: 01→182, 02→202, 03→202, 05→182 · Ch12: 01→210, 04→216, 05→208 · Ch14: 02→266, 04→266, 05→274, 06→262 · Ch16: 03→302
- **13 low-confidence → left UNCHANGED** (still broad curriculum refs; no fabricated pages): `ax-ch10-06, ax-ch11-04, ax-ch11-06, ax-ch12-02, ax-ch12-03, ax-ch12-06, ax-ch14-01, ax-ch14-03, ax-ch16-01, ax-ch16-02, ax-ch16-04, ax-ch16-05, ax-ch16-06`.
  - Causes: keyword tie across pages, single-keyword match, or **no in-chapter match** (e.g. negative amortization / progression-regression likely taught in a neighboring chapter than the one the question is tagged to). A future targeted pass can widen to adjacent chapters and use the `SalesPreChapterHighlights 14thEd.pdf` to pinpoint teaching passages.

## OPEN audit items
- **13 low-confidence `ax-` page citations** (listed above) — re-run with adjacent-chapter search + chapter-highlights PDF; deploy only what clears the same high-confidence bar.
- **Pixel-accurate highlights** for `ax-` questions and the 14 honest-note questions: NOT blocked — `search_for()` rectangles (normalized by page width/height) can produce `hl` boxes from the local PDF without OCR. Gated by priority: add for questions the user repeatedly misses or in high-weight chapters.
