/* Shared-source school launcher. Gold Coast is loaded without changing its file or keys.
   Cameron uses the same renderer with a separate, encrypted, source-tagged question bank.
   Never commit an unlock key or unencrypted Cameron source material to this repository. */
'use strict';
function checkedBank(data){
  if(!data || data.version!==1 || data.school!=='cameron' || !Array.isArray(data.questions) || !data.questions.length) throw Error('Invalid Cameron collection.');
  const ids=new Set();
  for(const q of data.questions){
    if(!/^ca-Q\d+$/.test(q.id)||ids.has(q.id)||!q.question||!q.options||!['a','b','c','d'].includes(q.finalAnswer)||['a','b','c','d'].some(k=>typeof q.options[k]!=='string')||q.book||q.pageImg) throw Error('A Cameron question needs source review.');
    ids.add(q.id);
  }
  for(const q of data.pending||[]) if(ids.has(q.id)||q.finalAnswer) throw Error('An unverified question entered the scored bank.');
  return data;
}
function scriptJSON(value){return JSON.stringify(value).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');}
function exactlyOne(source,pattern,replacement,label){let count=0;const out=source.replace(pattern,(...args)=>{count++;return typeof replacement==='function'?replacement(...args):replacement;});if(count!==1)throw Error('Quiz compatibility check failed: '+label+'. Gold Coast is unchanged.');return out;}
function buildCameronHTML(original,data){
  checkedBank(data);
  let html=exactlyOne(original,/^const BANK = \[.*\];$/m,'const BANK = '+scriptJSON(data.questions)+';','question bank');
  html=exactlyOne(html,/\/\* INVARIANT GUARD[\s\S]*?\nconst SYNC_URL = '';/,'/* Cameron has saved course answers, not textbook scans. */\nconst SYNC_URL = \"\";','school-specific source guard');
  html=exactlyOne(html,/<script>\s*\/\* ===== Cross-device sync[\s\S]*?<\/script>/,'<script>function schedulePush(){}<\/script>','isolated progress');
  html=exactlyOne(html,/<script src="book-text\.js"><\/script>/,'','no Cameron textbook');
  html=exactlyOne(html,/\nboot\(\);\n/,'\n/* Boot after school-specific configuration. */\n','startup');
  html=html.replace(/reqz_/g,'reqz_cameron_');
  const style='<style>.opt:disabled{color:#222;opacity:1}#searchBookBtn,#bkModal,#bsModal,.bookbtn,[data-bk]{display:none!important}.ca-text{white-space:pre-line;line-height:1.65}.ca-help{padding:12px 14px;margin:12px 0;border:1px solid #d4e0ed;border-radius:10px;background:#f7faff}.ca-help summary{cursor:pointer;font-weight:bold}.ca-help p{margin:9px 0}.ca-caption{font-size:.8em;color:#63758b}.ca-tag{background:#e8eff9;border-radius:5px;padding:2px 6px}.feedback:has(.ca-help){line-height:1.6}</style>';
  html=html.replace('</head>',style+'</head>');
  const config='<script>window.CAMERON_META='+scriptJSON({pending:data.pending||[],capturedThrough:data.capturedThrough})+';('+cameronRuntime.toString()+')();<\/script>';
  return html.replace('</body>',config+'</body>');
}
function cameronRuntime(){
  const oldRender=render, oldAnswer=answer, oldFinish=finish, oldReview=reviewQ;
  const safe=esc;
  let ended=false;
  document.title='Cameron Academy — Real Estate Practice';
  document.querySelector('h1').textContent='Cameron Academy · Real Estate Practice';
  document.querySelector('.sub').textContent=BANK.length+' saved questions · Separate progress on this device · No textbook attached';
  document.querySelector('#allBtn .glabel').textContent='All '+BANK.length+' questions';
  document.querySelector('#examBtn .glabel').textContent='Timed practice ('+BANK.length+' Q)';
  for(const id of ['starBtn','practiceStarBtn']){const b=document.getElementById(id);b.disabled=true;b.title='Teacher-highlight flags were not included in this saved collection.';b.style.opacity='.55';const label=b.querySelector('.glabel')||b;label.textContent='Teacher highlights not saved';}
  document.getElementById('syncPanel').innerHTML='<h3>Saved on this device</h3><p>Cameron progress is separate from Gold Coast. Use <b>Backup history</b> and <b>Restore history</b> to move it between devices. Automatic cross-device sync is not connected for Cameron.</p>';
  window.refLine=q=>'<div class="ref">Source: Cameron Academy · '+safe(q.sourceRef)+' · Saved course question. No textbook page attached.</div>';
  window.teachBlock=function(q){
    let s='<div class="teach"><div class="ca-help"><b>Read the wording carefully</b><p>'+safe(q.readingTip||'Check what the question asks before comparing the choices.')+'</p></div>';
    s+='<div class="tline"><b>Correct answer: '+safe(q.finalAnswer.toUpperCase())+'. '+safe(q.options[q.finalAnswer])+'</b></div>';
    s+='<details class="ca-help" open><summary>Why this answer fits — and why the others do not</summary><p class="ca-caption">Saved study explanation, separate from the course quotation below.</p><div class="ca-text">'+safe(q.aiReasoning||'No additional study explanation was saved.')+'</div></details>';
    s+='<details class="ca-help"><summary>Course explanation</summary><p class="ca-text">'+safe(q.courseExplanation||'The course explanation was not captured for this question. The answer and saved study explanation are available above.')+'</p></details>';
    if(q.doubt)s+='<details class="ca-help" open><summary>'+safe(q.doubt.question)+'</summary><p>'+safe(q.doubt.answer)+'</p></details>';
    return s+'</div>';
  };
  window.render=function(){
    oldRender();const q=order[viewIdx];if(!q)return;
    document.getElementById('qSrc').textContent=(viewIdx<idx?'Reviewing · ':'')+'Cameron Academy · '+q.sourceRef+' · '+q.topic;
  };
  window.saveCurrent=function(){
    if(ended||examMode||isRetry||!order.length||(!right&&!wrong))return;
    saveJ('reqz_cameron_current',{ids:order.map(q=>q.id),idx,right,wrong,missed:missed.map(q=>q.id),picks:picks.slice(),t:Date.now()});
  };
  window.answer=function(k,b){oldAnswer(k,b);saveCurrent();};
  window.resume=function(c){
    const valid=Array.isArray(c.ids)&&c.ids.length&&c.ids.every(id=>!!BYID[id]);
    if(!valid){clearCurrent();return start(BANK,false);}
    stopExamTimer();ended=false;order=c.ids.map(id=>BYID[id]);idx=Math.max(0,Math.min(c.idx||0,order.length-1));viewIdx=idx;
    right=c.right||0;wrong=c.wrong||0;missed=(c.missed||[]).map(id=>BYID[id]).filter(Boolean);picks=Array.isArray(c.picks)?c.picks.slice():[];
    for(let i=0;i<idx;i++)if(picks[i]===undefined)picks[i]='?';
    for(let i=0;i<picks.length;i++)if(picks[i]&&picks[i]!=='?')sessionResults[order[i].id]={ok:picks[i]===order[i].finalAnswer,ch:0,pick:picks[i]};
    examMode=false;isRetry=false;document.getElementById('roundBanner').style.display='none';document.getElementById('examTimer').style.display='none';show('quizCard');render();
  };
  const oldStart=start;
  window.start=function(list,retry,opts){ended=false;return oldStart(list,retry,Object.assign({},opts,{paceStars:false}));};
  window.gtiles=function(items){return '<div class="ggrid">'+items.map(it=>'<button type="button" class="gtile '+(it.ok===true?'good':it.ok===false?'bad':'unk')+'" title="'+safe(it.q.sourceRef)+'" aria-label="Review '+safe(it.q.sourceRef)+'" data-qid="'+it.q.id+'">'+Number(it.q.sourceRef.slice(1))+'</button>').join('')+'</div>';};
  window.reviewQ=function(id){oldReview(id);const q=BYID[id];if(!q)return;document.querySelector('#rvBody .qnum').textContent='Cameron Academy · '+q.sourceRef+' · '+q.topic;document.querySelectorAll('#rvBody [data-bk]').forEach(b=>b.remove());const f=document.querySelector('#rvBody .feedback');if(f)f.style.display='block';};
  window.finish=function(partial){
    ended=true;const n=right+wrong;if(partial)idx=n;oldFinish(partial);const pct=n?Math.round(right/n*100):0;
    document.getElementById('finalLine').innerHTML='You answered <b>'+n+'</b> questions: <b>'+right+' correct · '+pct+'%</b>.'+(isRetry?' This was your retry round.':'')+'<p class="ca-caption">This is practice accuracy for your saved Cameron questions, not a prediction of your state-exam score.</p>';
  };
  window.showStats=function(){
    stopExamTimer();show('statsCard');const h=loadJ('reqz_cameron_hist',{}),sessions=loadJ('reqz_cameron_sessions',[]),any=BANK.filter(q=>h[q.id]&&h[q.id].w),twice=BANK.filter(q=>h[q.id]&&h[q.id].weak);
    let s=gaboPanelHTML()+'<h3>Session history</h3>';
    s+=sessions.length?sessions.slice(-20).reverse().map(x=>'<p>'+new Date(x.t).toLocaleString()+' · <b>'+x.r+'/'+x.n+'</b> correct'+(x.retry?' · Retry':'')+'</p>').join(''):'<p>No completed sessions yet.</p>';
    s+='<h3>What needs another look?</h3><p>'+any.length+' questions missed at least once · '+twice.length+' missed again on a retry.</p>';
    s+='<p class="ca-caption">Only '+BANK.length+' saved questions are counted. This partial collection cannot establish full exam readiness.</p>';
    const pending=window.CAMERON_META.pending;
    if(pending.length){s+='<h3>Needs review — excluded from scoring</h3>';for(const q of pending)s+='<details class="ca-help"><summary>'+safe(q.sourceRef)+' · Correct answer not captured</summary><p>'+safe(q.question)+'</p>'+['a','b','c','d'].map(k=>'<p>'+k.toUpperCase()+'. '+safe(q.options[k])+'</p>').join('')+'<p><b>'+safe(q.reason)+'</b></p></details>';}
    document.getElementById('statsBody').innerHTML=s;document.getElementById('practiceWeakBtn').style.display=any.length?'inline-block':'none';document.getElementById('practiceWeak2Btn').style.display=twice.length?'inline-block':'none';
  };
  window.backupHistory=function(){
    const data={version:1,school:'cameron',hist:loadJ('reqz_cameron_hist',{}),sessions:loadJ('reqz_cameron_sessions',[]),log:loadJ('reqz_cameron_log',[]),current:loadJ('reqz_cameron_current',null)};
    const url=URL.createObjectURL(new Blob([JSON.stringify(data)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='cameron-history-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  window.restoreHistory=function(){
    const input=document.createElement('input');input.type='file';input.accept='.json';input.onchange=async()=>{try{if(!input.files[0])return;const d=JSON.parse(await input.files[0].text());
      if(d.school!=='cameron'||!d.hist||typeof d.hist!=='object'||Array.isArray(d.hist)||Object.keys(d.hist).some(id=>!BYID[id])||!Array.isArray(d.log)||d.log.some(x=>!BYID[x.questionId])||!Array.isArray(d.sessions)||(d.current&&(!Array.isArray(d.current.ids)||d.current.ids.some(id=>!BYID[id]))))throw Error('This is not a valid Cameron backup. No progress was changed.');
      if(!confirm('Replace Cameron progress on this device with this backup? Gold Coast will not change.'))return;
      saveJ('reqz_cameron_hist',d.hist);saveJ('reqz_cameron_log',d.log);saveJ('reqz_cameron_sessions',d.sessions);saveJ('reqz_cameron_current',d.current||null);showStats();
    }catch(e){alert(e.message||'Could not read this backup.');}};input.click();
  };
  wire('statsBtn',showStats);wire('statsBtn2',showStats);wire('backupBtn',backupHistory);wire('restoreBtn',restoreHistory);
  wire('statsBackBtn',()=>{show('quizCard');render();});wire('examBtn',()=>start(BANK,false,{exam:true,limit:BANK.length}));
  wire('finishHereBtn',()=>{if(confirm('Finish this Cameron practice session now?'))finish(true);});
  window.addEventListener('pagehide',saveCurrent);
  window.RE_SCHOOL='cameron';window.RE_BANK_COUNT=BANK.length;
  boot();
}
function setupSchoolHome(){
  const $=id=>document.getElementById(id);const keyName='re_study_cameron_key_v1';let key='',busyId=0,school=null;
  const readKey=()=>{try{return localStorage.getItem(keyName)||'';}catch(_){return '';}};
  const fragment=new URLSearchParams(location.hash.slice(1));key=fragment.get('key')||readKey();
  function status(message,error){$('status').textContent=message;$('status').classList.toggle('error',!!error);}
  function remember(){try{localStorage.setItem(keyName,key);$('forgetKey').hidden=false;}catch(_){status('This browser cannot remember the unlock key. Keep your private link.');}}
  function persistCurrent(){const w=$('quizFrame').contentWindow;try{if(w&&typeof w.saveCurrent==='function')w.saveCurrent();}catch(_){} }
  function home(){busyId++;persistCurrent();$('quizFrame').removeAttribute('srcdoc');$('quizFrame').src='about:blank';$('study').hidden=true;$('home').hidden=false;school=null;status('');$('goldCoast').focus();}
  function showFrame(label){$('schoolLabel').textContent=label;$('quizFrame').title=label+' study quiz';$('home').hidden=true;$('study').hidden=false;}
  async function fetchText(path){const r=await fetch(path,{cache:'no-cache',referrerPolicy:'no-referrer'});if(!r.ok)throw Error('Could not load the study app. Please try again.');return r.text();}
  function bytes(b64){return Uint8Array.from(atob(b64.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));}
  async function unlock(){
    if(!/^[A-Za-z0-9_-]{43}$/.test(key))throw Error('Open the private study link, or enter its access key.');
    const envelope=JSON.parse(await fetchText('cameron-bank.enc.json'));
    const cryptoKey=await crypto.subtle.importKey('raw',bytes(key),{name:'AES-GCM'},false,['decrypt']);
    let plain;try{plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(envelope.iv)},cryptoKey,bytes(envelope.ciphertext));}catch(_){throw Error('That key did not unlock Cameron. Use the private link provided with this app.');}
    if(envelope.compression!=='gzip')throw Error('Unsupported collection format.');
    const stream=new Blob([plain]).stream().pipeThrough(new DecompressionStream('gzip'));
    return checkedBank(JSON.parse(await new Response(stream).text()));
  }
  $('goldCoast').onclick=()=>{busyId++;school='gold-coast';$('quizFrame').removeAttribute('srcdoc');$('quizFrame').src='real-estate-quiz.html';showFrame('Gold Coast');};
  $('cameron').onclick=async()=>{const job=++busyId;status('Opening Cameron Academy…');try{
    const data=await unlock();const original=await fetchText('real-estate-quiz.html');if(job!==busyId)return;
    const html=buildCameronHTML(original,data);remember();$('unlock').hidden=true;school='cameron';$('quizFrame').removeAttribute('src');$('quizFrame').srcdoc=html;showFrame('Cameron Academy');status('');
  }catch(e){if(job!==busyId)return;status(e.message||'Cameron could not be opened. Gold Coast is unchanged.',true);$('unlock').hidden=false;$('accessKey').focus();}};
  $('homeBtn').onclick=()=>{const w=$('quizFrame').contentWindow;try{if(w.eval('examMode || isRetry')&&!confirm('Timed practice and retry rounds do not resume. Return to the school chooser?'))return;}catch(_){}home();};
  $('unlock').onsubmit=e=>{e.preventDefault();key=$('accessKey').value.trim();$('accessKey').value='';$('cameron').click();};
  $('forgetKey').onclick=()=>{if(!confirm('Lock Cameron on this device? Your progress stays saved. Keep your private link to unlock it again.'))return;try{localStorage.removeItem(keyName);}catch(_){}key='';history.replaceState(null,'',location.pathname+location.search);$('forgetKey').hidden=true;status('Cameron is locked. Your progress has not been erased.');};
  $('forgetKey').hidden=!readKey();window.addEventListener('pagehide',persistCurrent);
}
if(typeof module!=='undefined'&&module.exports)module.exports={buildCameronHTML,checkedBank};
if(typeof document!=='undefined')setupSchoolHome();
