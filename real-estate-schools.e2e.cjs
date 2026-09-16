'use strict';
// Only synthetic questions and an ephemeral key are used in public CI.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const crypto=require('node:crypto'),zlib=require('node:zlib'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function verifyLive(){
  const names=['real-estate-study.html','real-estate-schools.js','cameron-bank.enc.json','real-estate-quiz.html'];
  for(let attempt=0;attempt<12;attempt++){
    let good=true;
    for(const name of names){
      try{
        const r=await fetch('https://priihigashi.github.io/ClaudeGallery/'+name+'?verify='+process.env.GITHUB_SHA,{signal:AbortSignal.timeout(15000)});
        if(!r.ok||!Buffer.from(await r.arrayBuffer()).equals(fs.readFileSync(name))){good=false;break;}
      }catch(_){good=false;break;}
    }
    if(good){console.log('PASS: live homepage, shared quiz adapter, encrypted collection and original quiz exactly match the deployed files.');return;}
    if(attempt<11)await wait(10000);
  }
  throw Error('Live files did not match this revision; do not report this revision as verified live.');
}
async function main(){
  const filename='cameron-bank.enc.json',saved=fs.readFileSync(filename);
  const question=(id)=>({id:'ca-'+id,sourceRef:id,source:'Cameron Academy',topic:'Synthetic CI fixture',ch:0,teach:{},question:'Fixture: select the first choice.',options:{a:'First choice',b:'Second choice',c:'Third choice',d:'Fourth choice'},finalAnswer:'a',aiReasoning:'The instruction asks for the first choice.',courseExplanation:'Synthetic explanation for testing, not a course quote.',readingTip:'Read the instruction.',doubt:{question:'Why not the second?',answer:'The instruction explicitly asks for the first.'}});
  const data={version:1,school:'cameron',capturedThrough:'fixture',questions:[question('Q900'),question('Q901')],pending:[{id:'ca-Q902',sourceRef:'Q902',question:'Fixture without an answer.',options:{a:'A',b:'B',c:'C',d:'D'},reason:'Answer not captured.'}]};
  const key=crypto.randomBytes(32),iv=crypto.randomBytes(12),cipher=crypto.createCipheriv('aes-256-gcm',key,iv);
  const encrypted=Buffer.concat([cipher.update(zlib.gzipSync(Buffer.from(JSON.stringify(data)))),cipher.final(),cipher.getAuthTag()]);
  fs.writeFileSync(filename,JSON.stringify({version:1,algorithm:'AES-GCM',compression:'gzip',iv:iv.toString('base64'),ciphertext:encrypted.toString('base64')}));
  let browser,server;
  try{
    server=http.createServer((req,res)=>{
      const url=new URL(req.url,'http://localhost'),name=decodeURIComponent(url.pathname).replace(/^\//,'');
      if(!name||name.includes('..')||!fs.existsSync(name)||!fs.statSync(name).isFile()){res.writeHead(404).end();return;}
      const ext=path.extname(name);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json','.jpg':'image/jpeg'})[ext]||'application/octet-stream');res.end(fs.readFileSync(name));
    });
    await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
    browser=await chromium.launch();const context=await browser.newContext({viewport:{width:390,height:844}});
    // Never connect to a real user's cross-device backend from a test.
    await context.route('**/*',route=>route.request().url().startsWith(origin)?route.continue():route.abort());
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
    const address=origin+'/real-estate-study.html';await page.goto(address+'#key='+key.toString('base64url'));
    const sentinel=JSON.stringify({'gold-coast-sentinel':{s:7,w:2}});await page.evaluate(s=>localStorage.setItem('reqz_hist',s),sentinel);
    assert(await page.locator('#goldCoast').isVisible());assert(await page.locator('#cameron').isVisible());
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    fs.mkdirSync('school-test-screenshots',{recursive:true});await page.screenshot({path:'school-test-screenshots/home-mobile.png',fullPage:true});
    await page.locator('#cameron').click();let frame=await (await page.locator('#quizFrame').elementHandle()).contentFrame();
    await frame.waitForFunction(()=>window.RE_BANK_COUNT===2);assert.equal(await frame.locator('#qTotal').innerText(),'2');
    assert.equal(await frame.locator('#searchBookBtn').isVisible(),false);assert(!await frame.locator('#qSrc').innerText().then(s=>s.includes('Ch ')));
    await frame.locator('[data-k="a"]').click();assert.equal(await frame.locator('#nRight').innerText(),'1');
    assert((await frame.locator('#fb').innerText()).includes('Course explanation'));await page.screenshot({path:'school-test-screenshots/cameron-fixture.png',fullPage:true});
    await page.locator('#homeBtn').click();await page.locator('#goldCoast').click();frame=await (await page.locator('#quizFrame').elementHandle()).contentFrame();
    await frame.waitForFunction(()=>typeof BANK!=='undefined'&&BANK.length===271);assert(await frame.locator('#searchBookBtn').isVisible());
    await page.locator('#homeBtn').click();await page.locator('#cameron').click();frame=await (await page.locator('#quizFrame').elementHandle()).contentFrame();
    await frame.locator('#resumeBar button').first().click();assert.equal(await frame.locator('#nRight').innerText(),'1');assert.equal(await frame.locator('.opt:disabled').count(),4);
    await frame.locator('#nextBtn').click();await frame.locator('[data-k="b"]').click();assert.equal(await frame.locator('#nWrong').innerText(),'1');
    await frame.locator('#statsBtn').click();assert((await frame.locator('#statsBody').innerText()).includes('Q902'));assert(!(await frame.locator('#statsBody').innerText()).includes('Projected exam'));
    await frame.locator('.gtile').first().click();assert(await frame.locator('#rvModal').isVisible());assert.equal(await frame.locator('#rvBody [data-bk]').count(),0);assert(await frame.locator('#rvBody .feedback').isVisible());
    await frame.locator('#rvModal button').first().click();await frame.locator('#statsBackBtn').click();await frame.locator('#finishHereBtn').click();assert.equal(await frame.evaluate(()=>loadJ('reqz_cameron_sessions',[]).at(-1).n),2);
    assert.equal(await page.evaluate(()=>localStorage.getItem('reqz_hist')),sentinel);
    await page.goto(address);await page.locator('#cameron').click();frame=await (await page.locator('#quizFrame').elementHandle()).contentFrame();await frame.waitForFunction(()=>window.RE_BANK_COUNT===2);
    await page.locator('#homeBtn').click();await page.setViewportSize({width:1280,height:900});await page.screenshot({path:'school-test-screenshots/home-desktop.png',fullPage:true});
    const fresh=await browser.newContext();await fresh.route('**/*',route=>route.request().url().startsWith(origin)?route.continue():route.abort());const locked=await fresh.newPage();await locked.goto(address);await locked.locator('#cameron').click();await locked.locator('#unlock').waitFor({state:'visible'});assert(await locked.locator('#home').isVisible());
    assert.deepEqual(errors,[]);console.log('PASS browser: real fetch/decrypt, school switching, unchanged Gold Coast, answer-locked resume, separate storage, review panel, pending-answer exclusion, early finish, remembered key, locked fresh device, 390px and 1280px layouts.');
  }finally{fs.writeFileSync(filename,saved);if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));}
  if(process.env.GITHUB_ACTIONS)await verifyLive();
}
main().catch(e=>{console.error(e);process.exitCode=1;});
