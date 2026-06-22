// Reproducible integrity audit for citizenship-quiz.html
// Pure Node (no dependencies). Run:  node tests/citizenship-integrity.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(__dir, '..', 'citizenship-quiz.html'), 'utf8');
const m = html.match(/<script id="quizData" type="application\/json">([\s\S]*?)<\/script>/);
if (!m) { console.error('FAIL: embedded quizData not found'); process.exit(1); }
const DATA = JSON.parse(m[1].replace(/<\\\//g, '</'));
const B = DATA.bank;

let pass = 0, fail = 0;
const T = (n, c) => { if (c) { pass++; console.log('  ✅', n); } else { fail++; console.log('  ❌', n); } };

console.log('USCIS Citizenship Quiz — integrity audit');
T('128 questions', B.length === 128);
T('128 unique ids', new Set(B.map(q => q.id)).size === 128);
T('question numbers 1..128 complete', JSON.stringify(B.map(q => q.questionNumber).sort((a, b) => a - b)) === JSON.stringify([...Array(128)].map((_, i) => i + 1)));
T('every question has >=1 nonempty accepted answer', B.every(q => q.acceptedAnswers.length > 0 && q.acceptedAnswers.every(a => a.trim())));
T('exactly 20 marked 65/20', B.filter(q => q.special65_20).length === 20);
const dyn = B.filter(q => q.dynamicAnswer).map(q => q.questionNumber);
T('8 dynamic flagged (23,29,30,38,39,57,61,62)', JSON.stringify(dyn.sort((a, b) => a - b)) === JSON.stringify([23, 29, 30, 38, 39, 57, 61, 62]));
T('every dynamic (except rep #29) has currentAnswer + lastVerified', B.filter(q => q.dynamicAnswer && q.questionNumber !== 29).every(q => q.currentAnswer && q.lastVerified));
T('rep #29 intentionally has NO hardcoded current answer (asks ZIP)', B.find(q => q.questionNumber === 29).currentAnswer === '');
T('official PDF pages in 2..19', B.every(q => q.officialPdfPage >= 2 && q.officialPdfPage <= 19));
T('study-guide TEACHING pages in 5..69 (chapters, not the 77-87 index)', B.every(q => q.studyGuidePage >= 5 && q.studyGuidePage <= 69));
T('every question has a study-guide chapter label', B.every(q => q.studyGuideChapter && /^Ch\d+/.test(q.studyGuideChapter)));
// audit fix: reading vocab not truncated
const father = DATA.vocab.reading.find(w => w.word.startsWith('Father'));
T('reading vocab "Father of Our Country" not truncated', father && father.word === 'Father of Our Country');
T('reading vocab present (>=60 words)', DATA.vocab.reading.length >= 60);
T('writing vocab present (>=70 words)', Object.values(DATA.vocab.writing).flat().length >= 70);
// known verified current officials
T('President current = Trump', B.find(q => q.questionNumber === 38).currentAnswer.includes('Trump'));
T('VP current = Vance', B.find(q => q.questionNumber === 39).currentAnswer.includes('Vance'));
T('Speaker current = Johnson', B.find(q => q.questionNumber === 30).currentAnswer.includes('Johnson'));
T('Chief Justice current = Roberts', B.find(q => q.questionNumber === 57).currentAnswer.includes('Roberts'));

console.log(`\n==== INTEGRITY: ${pass} passed, ${fail} failed ====`);
process.exit(fail ? 1 : 0);
