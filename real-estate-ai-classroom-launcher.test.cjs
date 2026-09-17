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
assert(html.includes('Choose how you want to study.'),'Landing copy should describe study paths');
assert(html.includes('271 questions · Existing progress preserved'),'Gold Coast metadata changed');
assert(html.includes('100 ready · Sections 1, 3, 4, 5 &amp; 6 · EN/PT study help'),'Cameron metadata changed');
assert(html.includes('real-estate-ai-classroom.config.js'),'AI Classroom config missing');
assert(html.includes('real-estate-ai-classroom.js'),'AI Classroom bridge missing');
assert(/status:\s*'not-deployed'/.test(cfg),'No verified protected deployment yet');
assert(/url:\s*''/.test(cfg),'Unverified deployment URL must not be invented');
// Credential checks must never themselves contain a real credential.
const checkedFiles=['real-estate-study.html','real-estate-ai-classroom.config.js','real-estate-ai-classroom.js','real-estate-ai-classroom-launcher.test.cjs'];
for(const filename of checkedFiles){
  const text=fs.readFileSync(filename,'utf8');
  assert(!/sk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{32,}/.test(text),'Potential API credential in '+filename);
  assert(!/[#?&]key=[A-Za-z0-9_-]{40,}/.test(text),'Credential-bearing URL in '+filename);
  assert(!/ACCESS_CODE\s*=\s*[A-Za-z0-9_-]{16,}/.test(text),'Access-code assignment in '+filename);
}
const bank=original.match(/^const BANK = (\[.*\]);$/m);
assert(bank,'Gold Coast bank missing');
assert.equal(JSON.parse(bank[1]).length,271);
console.log('PASS: three-path launcher staged; destination not invented; generic credential guards (not a historical secret-clean claim); Gold Coast bank remains 271.');
