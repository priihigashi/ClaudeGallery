// Reproducible behavior tests for citizenship-quiz.html
// Requires jsdom:  npm i jsdom    then:  node tests/citizenship-behavior.mjs
import { JSDOM, VirtualConsole } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(__dir, '..', 'citizenship-quiz.html'), 'utf8');

let pass = 0, fail = 0, errs = [];
const T = (n, c) => { if (c) { pass++; console.log('  ✅', n); } else { fail++; console.log('  ❌', n); } };

function freshDom(seed) {
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errs.push(e.message));
  const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc, url: 'https://example.com/citizenship-quiz.html' });
  const w = dom.window;
  w.alert = () => {}; w.confirm = () => true; w.scrollTo = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  if (seed) seed(w);
  return w;
}
const wait = ms => new Promise(r => setTimeout(r, ms));

// ---- main suite ----
const w = freshDom(w => {
  w.localStorage.setItem('reqz_hist', JSON.stringify({ foo: 1 }));   // real-estate quiz data (must survive reset)
  w.localStorage.setItem('unrelated_key', 'keepme');
});
await wait(300);
const E = c => w.eval(c);

console.log('\n[1] Data + integrity surfaced to app');
T('BANK 128', E('BANK.length') === 128);
T('20 starred', E('BANK.filter(q=>q.special65_20).length') === 20);
T('8 dynamic', E('BANK.filter(q=>q.dynamicAnswer).length') === 8);
T('study-guide pages are teaching chapters (5..69)', E('BANK.every(q=>q.studyGuidePage>=5&&q.studyGuidePage<=69)') === true);

console.log('\n[2] Hybrid: typed auto-check (hint only, never authoritative)');
// strong exact match
E("start([BYID['uscis-002']],{})"); // Q2 supreme law => (U.S.) Constitution
w.document.getElementById('typedIn').value = 'the constitution';
T('exact/alias => strong "Looks correct"', E('checkTyped().level') === 'strong');
// minor spelling tolerance
w.document.getElementById('typedIn').value = 'constituton';
T('minor spelling => still matches (strong/possible)', ['strong', 'possible'].includes(E('checkTyped().level')));
// unrelated => none
w.document.getElementById('typedIn').value = 'banana';
T('unrelated => no clear match', E('checkTyped().level') === 'none');

console.log('\n[3] "Name three" requires 3 distinct concepts (your example)');
const q126 = E("JSON.stringify(BANK.find(q=>q.questionNumber===126).acceptedAnswers)");
E("start([BANK.find(q=>q.questionNumber===126)],{})");
T('Q126 requiredCount === 3', E("requiredCount(order[0])") === 3);
const oneHoliday = JSON.parse(q126)[0];
w.document.getElementById('typedIn').value = oneHoliday;
T('typing ONE holiday => NOT strong (possible at most)', E('checkTyped().level') !== 'strong');
const three = JSON.parse(q126).slice(0, 3).join(', ');
w.document.getElementById('typedIn').value = three;
T('typing THREE holidays => strong', E('checkTyped().level') === 'strong');
T('never relies on acceptedAnswers[0] only (uses all aliases)', E('matchTyped("'+three.replace(/"/g,'')+'", order[0]).strong') >= 3);

console.log('\n[4] 3-way self-grade routes correctly');
E("start([BYID['uscis-001'],BYID['uscis-002'],BYID['uscis-003']],{})");
E("document.getElementById('typedIn').value='republic'");
E('reveal()'); E("grade('right')"); E('next()');     // Q1 right
E('reveal()'); E("grade('almost')"); E('next()');    // Q2 almost
E('reveal()'); E("grade('missed')"); E('next()');    // Q3 missed -> end of first pass; almost+missed -> retry
const log = JSON.parse(w.localStorage.getItem('uscisQuiz_log'));
T('grade values stored (right/almost/missed)', ['right','almost','missed'].every(g => log.some(r => r.grade === g)));
T('only "right" counted correct (isCorrect)', log.filter(r => r.grade === 'right').every(r => r.isCorrect) && log.filter(r => r.grade !== 'right').every(r => !r.isCorrect));
T('typed answer stored for review', log.some(r => r.typed === 'republic'));
T('both almost AND missed went to final-attempt round', E('order.length') === 2 && E('isRetry') === true);
const sess = JSON.parse(w.localStorage.getItem('uscisQuiz_sessions'));
T('first-pass session logged retry:false', sess.some(s => s.retry === false));

console.log('\n[5] Trend stays first-attempt-only');
E('reveal()'); E("grade('right')"); E('next()');
E('reveal()'); E("grade('right')"); E('next()');     // finish retry
const sess2 = JSON.parse(w.localStorage.getItem('uscisQuiz_sessions'));
T('recovery session logged retry:true', sess2.some(s => s.retry === true));
T('recentCatAcc counts first attempts only', E('Object.values(recentCatAcc()).every(v=>typeof v.acc==="number")') === true);

console.log('\n[6] Modes preserved');
E('start(BANK.filter(q=>q.special65_20),{})'); T('65/20 = 20', E('order.length') === 20);
E('start(BANK.filter(q=>q.dynamicAnswer),{})'); T('dynamic = 8', E('order.length') === 8);
E('start(BANK,{exam:EXAM_STD})'); T('oral exam = 20 pass 12', E('order.length') === 20 && E('examCfg.pass') === 12);
E("start([BYID['uscis-001']],{mc:true})"); T('MC practice renders 4 opts', w.document.querySelectorAll('#opts .opt').length === 4);

console.log('\n[7] PDF popups: immutable id + teaching-chapter page');
E("openPdf('uscis-038','q')");
T('official PDF at correct page', w.document.getElementById('pdfFrame').src.includes('#page=' + E("BYID['uscis-038'].officialPdfPage")));
E("openPdf('uscis-038','guide')");
T('guide PDF opens at TEACHING page (not index)', w.document.getElementById('pdfFrame').src.includes('#page=' + E("BYID['uscis-038'].studyGuidePage")));
T('guide note mentions teaching chapter', w.document.getElementById('pdfNote').innerHTML.includes('teaching chapter'));

console.log('\n[8] Reset isolation (uscisQuiz_* only)');
E('resetProgress()');
T('reqz_hist (real-estate quiz) SURVIVES', w.localStorage.getItem('reqz_hist') !== null);
T('unrelated_key SURVIVES', w.localStorage.getItem('unrelated_key') === 'keepme');
T('uscisQuiz_hist removed', w.localStorage.getItem('uscisQuiz_hist') === null);

console.log('\n[9] Export/import round-trip');
let blob = null; w.URL.createObjectURL = b => { blob = b; return 'blob:x'; };
w.HTMLAnchorElement.prototype.click = function () {};
E("logAnswer(BYID['uscis-005'], true, false, 'right', 'amendments')");
E('exportProgress()'); T('export produced a blob', blob !== null);

// ---- backward compatibility: a PREVIOUS user's stored progress (old schema) still loads ----
console.log('\n[10] Backward compatibility — old uscisQuiz_* progress still loads');
const w2 = freshDom(win => {
  // OLD-format data: hist entries WITHOUT the new "almost" field; sessions/log from before this update
  win.localStorage.setItem('uscisQuiz_hist', JSON.stringify({ 'uscis-001': { seen: 3, miss: 1, weak: 0, rec: 0, last: 1, t: 1 } }));
  win.localStorage.setItem('uscisQuiz_sessions', JSON.stringify([{ t: 1, n: 10, r: 8, retry: false }, { t: 2, n: 10, r: 9, retry: false }]));
  win.localStorage.setItem('uscisQuiz_log', JSON.stringify([{ questionId: 'uscis-001', catId: 1, attemptNumber: 1, isCorrect: true, ts: 1 }]));
  // an in-progress round saved by the OLD version (no mc/mode fields)
  win.localStorage.setItem('uscisQuiz_current', JSON.stringify({ ids: ['uscis-001', 'uscis-002', 'uscis-003'], idx: 1, right: 1, wrong: 0, missed: [], t: 1 }));
});
await wait(300);
T('old hist preserved on load', JSON.parse(w2.localStorage.getItem('uscisQuiz_hist'))['uscis-001'].seen === 3);
T('resume bar offered for old in-progress round', !!w2.document.body.innerHTML.includes('You left off at'));
w2.eval("showStats()");
T('stats render with old sessions (no crash)', w2.document.getElementById('statsBody').innerHTML.length > 50);
w2.eval("resume({ids:['uscis-001','uscis-002','uscis-003'],idx:1,right:1,wrong:0,missed:[],t:1})");
T('old saved round resumes to correct position', w2.eval('idx') === 1 && w2.eval('order.length') === 3);

console.log('\n[11] No runtime errors');
T('no jsdom/script errors', errs.length === 0); if (errs.length) console.log('   ', errs.slice(0, 3));

console.log(`\n==== BEHAVIOR: ${pass} passed, ${fail} failed ====`);
process.exit(fail ? 1 : 0);
