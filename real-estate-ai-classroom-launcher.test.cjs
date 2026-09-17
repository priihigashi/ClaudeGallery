'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const {resolveClassroomDestination}=require('./real-estate-ai-classroom.js');
const html=fs.readFileSync('real-estate-study.html','utf8');
const cfg=fs.readFileSync('real-estate-ai-classroom.config.js','utf8');
const bridge=fs.readFileSync('real-estate-ai-classroom.js','utf8');
const original=fs.readFileSync('real-estate-quiz.html','utf8');
for(const id of ['goldCoast','cameron','aiClassroom'])assert(html.includes('id="'+id+'"'),'Missing study path: '+id);
assert(html.includes('Choose how you want to study.'),'Landing copy should describe study paths');
assert(html.includes('271 questions · Existing progress preserved'),'Gold Coast metadata changed');
assert(html.includes('100 ready · Sections 1, 3, 4, 5 &amp; 6 · EN/PT study help'),'Cameron metadata changed');
assert(html.includes('real-estate-ai-classroom.config.js')&&html.includes('real-estate-ai-classroom.js'),'Classroom bridge/config missing');
assert(/status:\s*'not-deployed'/.test(cfg),'No verified protected deployment yet');
assert(/url:\s*''/.test(cfg),'Unverified deployment URL must not be invented');
// Never include an actual credential in its own detection rule.
for(const filename of ['real-estate-study.html','real-estate-ai-classroom.config.js','real-estate-ai-classroom.js','real-estate-ai-classroom-launcher.test.cjs']){
  const text=fs.readFileSync(filename,'utf8');
  assert(!/sk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{32,}/.test(text),'Potential API credential in '+filename);
  assert(!/[#?&]key=[A-Za-z0-9_-]{40,}/.test(text),'Credential-bearing URL in '+filename);
  assert(!/ACCESS_CODE\s*=\s*[A-Za-z0-9_-]{16,}/.test(text),'Access-code assignment in '+filename);
}
const bank=original.match(/^const BANK = (\[.*\]);$/m);assert(bank);assert.equal(JSON.parse(bank[1]).length,271);
const testURL='https://classroom.example/florida';
for(const config of [null,{}, {status:'not-deployed',url:testURL}, {status:'verified',url:''}])assert.equal(resolveClassroomDestination(config),null);
for(const url of ['http://classroom.example/','javascript:alert(1)','https://person:password@classroom.example/','https://classroom.example/?token=test','https://classroom.example/#private','https://localhost/','https://127.0.0.1/','https://[::1]/','https://classroom.example:8443/'])assert.equal(resolveClassroomDestination({status:'verified',url}),null,'Unsafe destination accepted');
assert.equal(resolveClassroomDestination({status:'verified',url:testURL}),testURL);
function simulate(config){
  const nodes={aiClassroom:{dataset:{},setAttribute(k,v){this[k]=v;}},status:{textContent:''}};
  const navigations=[];
  const context={URL,window:{RE_AI_CLASSROOM:config},document:{getElementById:id=>nodes[id]},location:{assign:url=>navigations.push(url)}};
  Object.defineProperty(context,'localStorage',{get(){throw Error('Classroom bridge must not touch quiz storage');}});
  vm.runInNewContext(bridge,context);nodes.aiClassroom.onclick();return {nodes,navigations};
}
const disabled=simulate({status:'not-deployed',url:testURL});assert.equal(disabled.navigations.length,0);assert.equal(disabled.nodes.aiClassroom['aria-disabled'],'true');assert(disabled.nodes.status.textContent.includes('not available yet'));
const enabled=simulate({status:'verified',url:testURL});assert.deepEqual(enabled.navigations,[testURL]);assert.equal(enabled.nodes.aiClassroom['aria-disabled'],'false');
console.log('PASS: three unchanged study entry points; unverified destination disabled; credential-bearing/local URLs rejected; verified destination uses normal navigation; no quiz-storage reads. Current-source credential guard is not a historical secret-clean claim.');
