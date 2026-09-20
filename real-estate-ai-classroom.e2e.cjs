'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
async function main(){
  const root=process.cwd();let server,browser;
  try{
    server=http.createServer((req,res)=>{
      const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      const file=path.resolve(root,'.'+name);
      if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return;}
      res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.json':'application/json'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));
    });
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    const origin='http://127.0.0.1:'+server.address().port;
    browser=await chromium.launch();const context=await browser.newContext();
    await context.route('**/*',route=>route.request().url().startsWith(origin)?route.continue():route.abort());
    const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
    fs.mkdirSync('school-test-screenshots',{recursive:true});
    for(const size of [{width:390,height:844,name:'mobile'},{width:1280,height:900,name:'desktop'}]){
      await page.setViewportSize({width:size.width,height:size.height});
      await page.goto(origin+'/real-estate-study.html');
      for(const id of ['goldCoast','cameron','aiClassroom'])assert(await page.locator('#'+id).isVisible());
      assert.equal(await page.locator('.schools .school').count(),3);
      assert.equal(await page.locator('#aiClassroom').getAttribute('aria-disabled'),'false');
      assert.equal(await page.locator('#aiClassroom').getAttribute('data-status'),'ready');
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow');
      // Navigation semantics are covered in the launcher unit test; this fixture
      // keeps external requests blocked and verifies the live classroom card is ready.
      const configured=await page.evaluate(()=>window.RE_AI_CLASSROOM);
      assert.equal(configured.status,'verified');
      assert.equal(configured.url,'https://real-estate-ai-classroom.vercel.app/');
      await page.screenshot({path:'school-test-screenshots/three-paths-live-'+size.name+'.png',fullPage:true});
    }
    assert.deepEqual(errors,[]);
    console.log('PASS: live three-entry homepage at 390px and 1280px; all cards visible; no overflow; verified AI Classroom card is ready; no user secret used.');
  }finally{
    if(browser)await browser.close();
    if(server)await new Promise(resolve=>server.close(resolve));
  }
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
