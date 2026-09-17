'use strict';
// Synthetic-only browser regression test. No real Cameron key or course text enters CI logs.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto'),zlib=require('node:zlib'),assert=require('node:assert/strict');
const {chromium}=require('playwright');

async function verifyLive(){
  const names=['real-estate-study.html','real-estate-study-aids.js','cameron-pt-study.json','cameron-pt-study-01.txt','cameron-pt-study-02.txt','cameron-pt-study-03.txt','cameron-pt-study-04.txt','cameron-pt-study-05.txt','cameron-pt-study-06.txt','cameron-pt-study-07.txt','cameron-pt-study-08.txt','real-estate-schools-sections.js'];
  for(let attempt=0;attempt<12;attempt++){
    let good=true;
    for(const name of names){try{const r=await fetch('https://priihigashi.github.io/ClaudeGallery/'+name+'?studyverify='+process.env.GITHUB_SHA,{signal:AbortSignal.timeout(15000)});if(!r.ok||!Buffer.from(await r.arrayBuffer()).equals(fs.readFileSync(name))){good=false;break;}}catch(_){good=false;break;}}
    if(good){console.log('PASS study-aids live: homepage, encrypted Portuguese pack, runtime and section loader exactly match deployed files.');return;}
    if(attempt<11)await new Promise(r=>setTimeout(r,10000));
  }
  throw Error('Live study-aid files did not match this revision.');
}

const files=['cameron-bank.enc.json','cameron-section-3.enc.json','cameron-section-4.enc.json','cameron-section-5.enc.json','cameron-section-6.enc.json','cameron-pt-study.json'];
function encrypt(file,data,key,extra){const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv('aes-256-gcm',key,iv),body=zlib.gzipSync(Buffer.from(JSON.stringify(data))),ct=Buffer.concat([cipher.update(body),cipher.final(),cipher.getAuthTag()]);fs.writeFileSync(file,JSON.stringify({version:1,algorithm:'AES-GCM',compression:'gzip',...(extra||{}),iv:iv.toString('base64'),ciphertext:ct.toString('base64')}));}
function q(id,label){return {id:'ca-'+id,source:'Cameron Academy',sourceRef:id,topic:'Synthetic study-aid fixture',ch:0,teach:{},question:'Fixture '+label+': which statement is NOT true within 30 days?',options:{a:'First choice',b:'Second choice',c:'Third choice',d:'Fourth choice'},finalAnswer:'a',aiReasoning:'Synthetic English explanation.',courseExplanation:'Synthetic English course explanation.',readingTip:'Read NOT and the time limit.',doubt:{question:'What matters?',answer:'The operator and time limit.'},pt:{question:'Questão '+label+': qual afirmação NÃO é verdadeira em até 30 dias?',options:{a:'Primeira escolha',b:'Segunda escolha',c:'Terceira escolha',d:'Quarta escolha'},study:'Ajuda em português para entender a regra.',course:'Explicação do curso em português.'}};}
async function main(){
  const saved=Object.fromEntries(files.map(f=>[f,fs.readFileSync(f)]));let browser,server;
  try{
    const key=crypto.randomBytes(32);
    encrypt(files[0],{version:1,school:'cameron',questions:[q('Q900','base')],pending:[]},key);
    for(const n of [3,4,5,6])encrypt('cameron-section-'+n+'.enc.json',{version:1,school:'cameron',section:{id:'FLREEPS'+n,number:n,title:'Section '+n+': Synthetic',total:1},questions:[{...q('Q90'+n,'section '+n),sectionId:'FLREEPS'+n,sourceQuestion:1,sourcePdfPages:[1]}],pending:[]},key);
    const aidQs=[q('Q900','base'),...([3,4,5,6].map(n=>q('Q90'+n,'section '+n)))],translations=Object.fromEntries(aidQs.map(x=>[x.id,x.pt]));
    encrypt('cameron-pt-study.json',{version:1,school:'cameron',language:'pt-BR',kind:'study-aid',translations},key,{language:'pt-BR'});
    server=http.createServer((req,res)=>{const u=new URL(req.url,'http://localhost'),name=decodeURIComponent(u.pathname).replace(/^\//,'');if(!name||name.includes('..')||!fs.existsSync(name)||!fs.statSync(name).isFile())return res.writeHead(404).end();const ext=path.extname(name);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json'})[ext]||'application/octet-stream');res.end(fs.readFileSync(name));});
    await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
    browser=await chromium.launch();const context=await browser.newContext({viewport:{width:390,height:844}});await context.route('**/*',route=>route.request().url().startsWith(origin)?route.continue():route.abort());
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
    await page.goto(origin+'/real-estate-study.html#key='+key.toString('base64url'));
    const sentinel='gold-coast-safe';await page.evaluate(s=>localStorage.setItem('reqz_hist',s),sentinel);
    await page.locator('#cameron').click();const frame=await (await page.locator('#quizFrame').elementHandle()).contentFrame();
    await frame.waitForFunction(()=>window.CAMERON_STUDY_AIDS_READY===true&&window.RE_BANK_COUNT===5);
    await frame.locator('#sectionSelect').selectOption('FLREEPS6');assert.equal(await frame.locator('#qTotal').innerText(),'1');
    assert((await frame.locator('#qText').innerText()).includes('NOT true within 30 days'));assert.equal(await frame.locator('#qText .ca-cue').count(),0);assert.equal(await frame.locator('#opts .ca-cue').count(),0);assert.equal(await frame.locator('#fb').innerText(),'');assert.equal(await frame.locator('.opt.correct').count(),0);
    await frame.locator('#caCueBtn').click();assert((await frame.locator('#qText .ca-cue').count())>=2);assert.equal(await frame.locator('#opts .ca-cue').count(),0);assert.equal(await frame.locator('.opt.correct').count(),0);
    await frame.locator('#caLangPt').click();assert((await frame.locator('#qText').innerText()).includes('NÃO é verdadeira em até 30 dias'));assert((await frame.locator('[data-k="a"]').innerText()).includes('Primeira escolha'));assert.equal(await frame.locator('#fb').innerText(),'');assert.equal(await frame.locator('.opt.correct').count(),0);
    await frame.locator('[data-k="a"]').click();const ptfb=await frame.locator('#fb').innerText();assert(ptfb.includes('Correto!'));assert(ptfb.includes('Resposta correta'));assert(ptfb.includes('Explicação do curso em português'));assert.equal(await frame.locator('.opt.correct').count(),1);
    await frame.locator('#caLangEn').click();assert((await frame.locator('#qText').innerText()).includes('NOT true within 30 days'));assert((await frame.locator('#fb').innerText()).includes('Correct!'));
    await frame.locator('#caLangPt').click();assert((await frame.locator('#fb').innerText()).includes('Explicação do curso em português'));
    fs.mkdirSync('school-test-screenshots',{recursive:true});await page.screenshot({path:'school-test-screenshots/study-aids-mobile.png',fullPage:true});
    await page.locator('#homeBtn').click();await page.locator('#goldCoast').click();const gc=await (await page.locator('#quizFrame').elementHandle()).contentFrame();await gc.waitForFunction(()=>typeof BANK!=='undefined'&&BANK.length===271);assert.equal(await page.evaluate(()=>localStorage.getItem('reqz_hist')),sentinel);
    await page.locator('#homeBtn').click();await page.locator('#cameron').click();const frame2=await (await page.locator('#quizFrame').elementHandle()).contentFrame();await frame2.waitForFunction(()=>window.CAMERON_STUDY_AIDS_READY===true);assert.equal(await frame2.evaluate(()=>window.CAMERON_STUDY_LANG()),'pt');assert.equal(await frame2.evaluate(()=>window.CAMERON_READING_CUES()),true);
    assert.deepEqual(errors,[]);console.log('PASS study-aids browser: English default, Portuguese on demand, no pre-answer reveal, translated post-answer feedback, question-only reading cues, persisted preferences, unchanged Gold Coast storage.');
  } finally {for(const [f,b] of Object.entries(saved))fs.writeFileSync(f,b);if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));}
  if(process.env.GITHUB_ACTIONS)await verifyLive();
}
main().catch(e=>{console.error(e);process.exitCode=1;});
