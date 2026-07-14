# Real-Estate Quiz — Master Manual & Behavior Spec

Canonical spec for `real-estate-quiz.html` — Priscila's **Florida real-estate pre-license study quiz**.
Live: https://priihigashi.github.io/ClaudeGallery/real-estate-quiz.html
Companion doc: `real-estate-quiz.AUDIT.md` (conventions + audit log). Local progress checklist: `C:\Users\Admin\real-estate-quiz-CHECKLIST.md`.

## 1. What it is
- Single self-contained HTML file. `BANK` = a JS array of **271** questions. GitHub Pages off `main` → a commit auto-deploys in ~1 min.
- Purpose: study for the FL sales-associate exam (pass mark **75%**).

## 2. Invariants (must always hold)
1. **Book page on EVERY question (#1 rule).** Every question shows a "📖 See it in the book" button → the page(s) that prove the answer. Satisfied by `q.book.imgs` (+`q.book.page`) OR `q.pageImg`. Never remove. `real-estate-quiz.test.js` fails if any question loses this.
2. **Never break what works.** Changes ADD / IMPROVE only.
3. **Math never clusters** in the study deck (§3.4).
4. **Honesty.** Explanations never invent a book quote; if the page doesn't contain it, omit.

## 3. Features & how the app should behave

### 3.1 Answering flow
One question at a time; tap an option → locks, shows ✅/❌ + correct answer + explanation + book button → tap **Next**. Score bar + counters up top. End of round → summary + "retry missed". **Exam mode** (📝) = 100-question timed test, fully random order, minimal feedback until the end, NO review mid-exam (it is a real test).

### 3.2 Book viewer — 3-page scroll
"📖 See it in the book" opens the answer page **centered**; **scroll up = page before, down = page after** (each question stores `[P-1, P, P+1]`). Answer line highlighted. The 30 `ax-` questions are single pre-highlighted pages (no neighbors).

### 3.3 Teach explanations (ALL 271)
After answering, each question shows: 📌 what it's really asking · ✅ why the answer is right (MATH shows the full worked steps) · ❌ why each wrong option is wrong (only when instructive). Schema: `teach = {focus, answer, why, wrong:{a..d}, quote?, hl?}`. `wrong` never includes the correct-answer letter.

### 3.4 Deck reorder — weighted + math spread
Study-deck ordering = `spreadOrder()`: stratified per-chapter interleave (high-frequency topics appear more/earlier) with math questions woven into evenly-spaced gaps. **Guarantees: never 2 math in a row, never starts on math** (verified 500 sim runs). Exam mode stays fully random. Per-round shuffle + resume preserved.

### 3.5 Cross-device sync
Progress saves to Priscila's Google Drive via a Google Apps Script backend (shared with the citizenship quiz, `app='realestate'`). **Pinned profile `Pri` / `Pri`** on every device — no typing, auto-heals a lowercase `pri`. Anti-clobber: an empty device never overwrites the cloud; manual sync PULLS before it pushes; merge is field-wise max (progress can't shrink). The in-round bookmark (`reqz_current`) also syncs → a round can resume across devices.

### 3.6 Review previous questions
- **◀ Back** button: flip back through questions answered THIS round, shown **locked** (your pick + correct answer + explanation + book link; options frozen — review but never change a submitted answer). **↩ Back to current** returns you. Off during exam mode.
- **End-of-round recap:** the summary shows the whole round as tappable green/red tiles → tap to re-read.

### 3.7 Gabarito (results sheet) in 📊 My Progress
Two tabs: **This session** (answered since opening the app) and **Overall** (ever answered). **Only questions already answered appear — no spoilers.** Green = right, red = wrong, gray = answered-earlier / pick-unknown. Each tab shows "X / Y correct = Z%". **Tap a tile** → review pop-up (question + correct answer + explanation + "📖 See it in the book"). The exam-style **Projected score /100** (weighted by exam frequency, unpracticed = 0) stays as the "exam readiness" number.

## 4. Scoring philosophy
- **Practice accuracy** (This session / Overall) = of what you answered, % right = your real skill level right now.
- **Projected exam score /100** = exam-style, weighted, unpracticed topics count as 0.
- Keep the EXAM at 100; do NOT score daily practice out of 100 (discouraging early). Use accuracy for practice, /100 for exam readiness.

## 5. Data model (localStorage)
- `reqz_hist[id] = {s,w,weak,rec,last,t}` — per-question history (s=seen, w=wrong, weak=missed-twice, last=1 if last correct).
- `reqz_current = {ids, idx, right, wrong, missed, t}` — resumable in-progress round.
- `reqz_sessions`, `reqz_log` — session history + per-answer log.
- `reqz_settings.sync = {url, profile:'Pri', pass:'Pri', on:true}`.
- In-memory (per page load): `picks[]` (this round's selections), `sessionResults{}` (this-session gabarito), `viewIdx` (which question is on screen).

## 6. Operational — how to change the app
- **No git/gh on the machine.** Edit + deploy via Composio GitHub tools (connected as `priihigashi`); prepare/serialize the big file inside the Composio workbench so it never passes through chat. Edit `BANK` programmatically (parse → modify → `JSON.stringify` → replace), never by hand.
- **Multiple chats edit this file.** Before EVERY commit: re-pull latest HEAD, apply a SMALL diff, never regenerate from an old copy. Verify: BANK byte-identical (unless intentionally editing data), all `<script>` blocks parse (`new vm.Script`), integrity markers present (`spreadOrder`, `offerResume`, `pin ONE shared profile`, `bkpageimg`, `teachBlock`), 0 leaked strings (`Reference: Ch` / `Math Concept:` == 0); then confirm live on Pages.

## 7. Request history (what was built, in order)
1. Book-page invariant + guardrails; Drive→in-repo book scans (mobile reliability).
2. Cross-device sync (profile Pri, anti-clobber, cross-device resume).
3. Deck reorder (weighted by exam frequency, math never clusters).
4. Teach explanations added to all 271 questions.
5. Book viewer upgraded to 3-page scroll (before/after).
6. Review previous questions (Back button + end-of-round recap).
7. Gabarito with two tabs (This session / Overall).

## 8. Open / optional follow-ups (NOT done)
- Rename the "Sync now" button to something clearer (e.g., "⬇️ Get my progress").
- Fix the `book p. 541` boilerplate page number that is wrong on some cram-question explanations.
