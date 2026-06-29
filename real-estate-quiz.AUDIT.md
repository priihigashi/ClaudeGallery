# Real Estate Quiz — Conventions & Audit Log

Durable reference for `real-estate-quiz.html` (Florida real estate pre-license exam study tool).
This is the project's source of truth for *how it's built and deployed* and *what has been audited*.


## INVARIANT — "See it in the book" on every question (NON-NEGOTIABLE)
**Every question in `BANK`, with no exception, must offer a per-question link to the exact book
page that proves its answer.** This is the core promise of the tool and must never be removed or
silently weakened again.
- A question satisfies the rule iff it has **`book.imgs`** (with `book.page`) **or** **`pageImg`**.
- After answering — whether the student was **right or wrong** — and in **every** review surface
  (correct feedback, wrong feedback, exam-mode review, end-of-round missed list, weakness list),
  `refLine(q)` must render a **"📖 See it in the book"** button.
- The **"Search the book"** full-text box is a **secondary, optional** tool. It is **NOT** a
  substitute for the per-question page button and must never replace it.
- **Enforcement (so it can't disappear quietly):**
  1. `refLine(q)` renders a red **`⚠️ Missing book page`** warning if a question has neither source.
  2. An on-load guard in the HTML logs to console + shows a red banner if any question lacks proof.
  3. `real-estate-quiz.test.js` (run before every deploy) **exits non-zero** if
     `count(BANK) !== count(questions with proof)`.
- **Reliability — DONE 2026-06-29:** all 241 `book.imgs` page scans were migrated **in-repo** to `book-pages/scan-<driveId>.jpg` (240 unique images) and `bkRender` now loads them directly. **No `drive.google.com` dependency** — book pages always load, including on mobile. Commit `0c846a0b` (+ batched asset commits).

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
  - Exact-page mapping pass run via PyMuPDF; deployed 17 citations. `b7b40b5`
  - **Reverted all 17** — deeper audit proved the local PDF is a different edition/pagination than the quiz's scanned 14th-ed `book.page` scheme (ch6 penalty content on PDF p.96 vs quiz p.104; cross-chapter offset not constant, −7..+19). Restored honest curriculum refs. `fdfc086`

## Reporting & verification discipline (to prevent the mistakes that triggered this correction)
- **No blocker claim without a probe.** Before writing "blocked / requires / not possible / pending," run the real check (`ls` the path, import the tool, open the file) and keep the evidence. Rule #1 of the global CLAUDE.md; do not skip it.
- **Headline must match the body.** Each item gets one label only — ✅ Done (verified by a check actually run) · 🟡 Open (with the real reason) · 🔴 Blocked (with tested proof). A summary may say "done" only if every sub-item is ✅. Never pair "all closed" with a 🟡.
- **"Verified live" means a check was run** against the deployed artifact — never "should work."
- **Anchor/validation checks must require STRONG agreement, not a single common word.** The reverted page-mapping passed a ≥1-token anchor check that was coincidence-level. A source/edition match must be confirmed by distinctive multi-term agreement on the *expected* page (and ideally a known answer phrase landing where the citation claims) before trusting it.

## Exact-page mapping — ATTEMPTED, then REVERTED (2026-06-22)
- A first pass mapped 17/30 `ax-` questions to pages in the local `English RE Sales Associate SalesPreBook.pdf` and deployed them (`b7b40b5`).
- **A deeper audit found the local PDF is a DIFFERENT EDITION/pagination than the quiz's `book.page` scheme** (the scanned 14th ed. the displayed page images come from):
  - ch6 penalty content ("misleading advertising"/misdemeanor) is on the PDF's printed **p.96**, but the quiz cites **p.104** (verified-correct against the scan). Same content, ~8-page shift.
  - The shift is **NOT a clean constant** — measured deltas across chapters scatter from −7 to +19, so there is no reliable PDF→quiz-page conversion.
  - Therefore the 17 PDF-based citations were in the wrong numbering for this quiz and mixed two page schemes.
- **Action: all 17 reverted** to honest curriculum/statute references (`fdfc086`). No fabricated/inconsistent pages remain. The `ax-ch14-02/03` statute content and precise wording were preserved (those were separate, correct fixes).
- **Root cause of the miss:** the page-mapping anchor check accepted ≥1 matching common word, which is coincidence-level — it gave false confidence and let the edition mismatch through. See discipline note below.

## OPEN audit items
- **Exact-page citations + highlights still want the CORRECT edition.** What's needed: the *same edition the scanned `book.imgs` came from* (the 14th ed.). Options: (a) OCR the displayed Drive scan images themselves (gives both the right pages AND box coordinates that align with what the user sees — needs Tesseract/Vision, neither installed yet); (b) obtain a 14th-ed PDF whose pagination matches the quiz scheme. The local PDFs (`English RE…`, `Gold Coast …Jan 2024`) are byte-identical to each other but are NOT that edition.
- **Highlights specifically:** must be computed in the **displayed scan's** coordinate space, not this PDF's — proven by stored boxes resolving to unrelated text when interpreted against the PDF. Not feasible from the local PDF.

## Feature backlog
- **Cross-device sync (phone ↔ laptop)** — DONE (2026-06-22). No login (single user). Reused the **already-deployed citizenship study-sync backend** (`study-sync/`), which was built to serve BOTH quizzes (the Sync sheet `1ECBcw0…` already has a `realestate` column). No new deployment needed.
  - The real-estate quiz now has a **☁️ Cross-device sync** panel under 📊 My progress: pre-filled URL, enter the same **profile + passphrase** on each device, **Enable** → it auto-syncs (debounced push on every save + pull/merge on load).
  - Model: snapshot **blob** per profile (overwritten each sync — never piles up). Merge = union answer logs + sessions, rebuild stats, then **MAX with local & server** so progress can never shrink or be wiped. Reads via JSONP, writes via no-cors POST. Verified end-to-end against `app=realestate`.
  - **Cleanup:** the redundant sheet I first created (`1GyA77…`) was trashed and its Hub rows removed; my redundant `sync-appscript.gs` removed from the repo. The proven `study-sync/study-sync.gs` is the single backend.
- **Keyword search box in the book-page viewer** (Priscila request, 2026-06-22): a text input in the page modal — type a word and it highlights every occurrence on the page, live. *Plan:* for the 30 PDF-rendered `ax-` pages we already have exact word coordinates from PyMuPDF — pre-extract a compact per-page word-box map, ship it with the quiz, and have the search box draw `.bkhl` overlays on matches client-side. Works for the new rendered pages out of the box; the old scanned-image pages would need OCR word boxes to support the same search.

## Done — book-page highlights (2026-06-22)
- 30 `ax-` questions now have a self-contained highlighted page image rendered from the SalesPreBook PDF (answer text boxed), hosted in-repo at `book-pages/` and shown via a "📖 See it in the book — highlighted" button. No page-number citation is attached (the image is self-contained), which avoids the edition-pagination mismatch. Commit `1638b59`.
