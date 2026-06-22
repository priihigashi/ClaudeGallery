# citizenship-quiz.html — tests

Reproducible tests for the U.S. Citizenship Civics Test app. They read the embedded
question data and behavior directly from `../citizenship-quiz.html` (no separate copy).

## Integrity audit (no dependencies)

```
node tests/citizenship-integrity.mjs
```

Checks: 128 questions, 128 unique IDs, numbers 1–128 complete, every answer non-empty,
exactly 20 starred (65/20), the 8 dynamic questions flagged with verified `currentAnswer`
+ `lastVerified` (except #29 which asks for ZIP), official PDF pages 2–19, study-guide
**teaching** pages 5–69 (chapters — not the 77–87 index), reading vocab not truncated
("Father of Our Country"), and current officials (Trump/Vance/Johnson/Roberts).

## Behavior tests (requires jsdom)

```
npm i jsdom
node tests/citizenship-behavior.mjs
```

Checks the hybrid oral flow: typed auto-check is a non-authoritative hint
(strong / possible / no-match), "Name two/three" requires that many distinct concepts
(typing one holiday is NOT marked correct), 3-way self-grade (`right`/`almost`/`missed`)
where only `right` counts correct and both `almost` and `missed` go to the final-attempt
round, first-attempt vs retry scoring kept separate (trend excludes recovery), typed
answers stored for review only, modes (65/20, dynamic, oral exam, MC practice), PDF popups
by immutable question ID opening the teaching chapter, reset touching only `uscisQuiz_*`
(real-estate quiz + unrelated storage survive), export, and **backward compatibility**
(a previous user's old-schema `uscisQuiz_*` progress still loads and resumes).

`node_modules/` is intentionally not committed.
