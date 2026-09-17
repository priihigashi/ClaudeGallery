'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const html=fs.readFileSync('real-estate-study.html','utf8');
const cfg=fs.readFileSync('real-estate-ai-classroom.config.js','utf8');
const bridge=fs.readFileSync('real-estate-ai-classroom.js','utf8');
const original=fs.readFileSync('real-estate-quiz.html','utf8');
assert(html.includes('id="goldCoast"'),'Gold Coast launcher missing');
assert(html.includes('id="cameron"'),'Cameron launcher missing');
assert(html.includes('id="aiClassroom"'),'AI Classroom launcher missing');
assert(html.includes('Choose how you want to study.'),'Landing copy should describe study paths, not three schools');
assert(html.includes('271 questions · Existing progress preserved'),'Gold Coast count/contract changed unexpectedly');
assert(html.includes('100 ready · Sections 1, 3, 4, 5 &amp; 6 · EN/PT study help'),'Cameron launcher metadata changed unexpectedly');
assert(html.includes('real-estate-ai-classroom.config.js'),'AI Classroom config not loaded');
assert(html.includes('real-estate-ai-classroom.js'),'AI Classroom bridge not loaded');
assert(/status:\s*'not-deployed'/.test(cfg),'Feature branch must remain explicitly not-deployed until a real protected URL is verified');
assert(/url:\s*''/.test(cfg),'Unverified deployment URL must not be invented');
for(const text of [html,cfg,bridge]){
  assert(!/sk-[A-Za-z0-9_-]{16,}/.test(text),'Possible API key exposed in public launcher source');
  assert(!/ACCESS_CODE\s*=/.test(text),'Access code must not be in public launcher source');
  assert(!/SBIVbSRyI6jLRMwIz6TCJT6ptFQojToz6qkaBAUj3Y0/.test(text),'Cameron access key must not be copied into public launcher files');
}
const bank=original.match(/^const BANK = (\[.*\]);$/m);
assert(bank,'Gold Coast bank missing');
assert.equal(JSON.parse(bank[1]).length,271,'Gold Coast bank must remain 271 questions');
console.log('PASS: three-path launcher staged; no deployment invented; no secrets in launcher; Gold Coast bank still 271.');
