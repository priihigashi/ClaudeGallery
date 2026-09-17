/* Named Cameron sections. Extra course material stays encrypted; keys never ship in source. */
'use strict';
function mergeCameronSections(base,pack,validate){
  validate(base);validate(pack);
  const section=pack.section;
  if(!section||!/^FLREEPS[1-9]\d*$/.test(section.id)||section.id!==('FLREEPS'+section.number)||!section.title||section.total!==pack.questions.length||pack.questions.some(q=>q.sectionId!==section.id||!Number.isInteger(q.sourceQuestion)||q.sourceQuestion<1||q.sourceQuestion>section.total||!q.courseExplanation))throw Error('Section source metadata needs review.');
  if(new Set(pack.questions.map(q=>q.sourceQuestion)).size!==pack.questions.length)throw Error('Duplicate source question numbers.');
  const first={id:'FLREEPS1',number:1,title:'Section 1: Sales Associate (Unit 2) and Brokers (Unit 1)',total:base.questions.length+(base.pending||[]).length};
  const sections=base.sections||[first];
  if(sections.some(s=>s.id===section.id))throw Error('This quiz section is already imported.');
  const questions=base.sections?base.questions:base.questions.map(q=>({...q,sectionId:first.id,sectionTitle:first.title}));
  const pending=base.sections?(base.pending||[]):(base.pending||[]).map(q=>({...q,sectionId:first.id,sectionTitle:first.title}));
  const ids=[...questions,...pending,...pack.questions,...(pack.pending||[])].map(q=>q.id);
  if(new Set(ids).size!==ids.length)throw Error('Duplicate question IDs; existing progress is unchanged.');
  const sourceAttempts=[...(base.sourceAttempts||[]),...(pack.sourceAttempt?[pack.sourceAttempt]:[]),...(pack.sourceAttempts||[])];
  const allSections=[...sections,section];
  for(const attempt of sourceAttempts){
    if(!allSections.some(s=>s.id===attempt.sectionId)||!Number.isInteger(attempt.correct)||!Number.isInteger(attempt.total)||attempt.correct<0||attempt.correct>attempt.total||attempt.total<1||attempt.importAsAppProgress!==false)throw Error('Source attempt metadata needs review.');
  }
  return validate({...base,capturedThrough:pack.capturedThrough||base.capturedThrough,questions:[...questions,...pack.questions],pending:[...pending,...(pack.pending||[])],sections:allSections,sourceAttempts});
}
async function extendCameronCollection(data,key){
  const bytes=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
  const cryptoKey=await crypto.subtle.importKey('raw',bytes(key),{name:'AES-GCM'},false,['decrypt']);
  for(const number of [3,4,5,6]){
    const response=await fetch('cameron-section-'+number+'.enc.json',{cache:'no-cache',referrerPolicy:'no-referrer'});
    if(!response.ok)throw Error('Section '+number+' could not be loaded. Please refresh and try again. Your saved progress is unchanged.');
    const envelope=await response.json();
    if(envelope.version!==1||envelope.algorithm!=='AES-GCM'||envelope.compression!=='gzip')throw Error('Unsupported section collection.');
    const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(envelope.iv)},cryptoKey,bytes(envelope.ciphertext));
    const text=await new Response(new Blob([plain]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
    data=mergeCameronSections(data,JSON.parse(text),checkedBank);
  }
  return data;
}
function cameronSectionsRuntime(){
  const meta=window.CAMERON_SECTIONS,sections=meta.sections;
  const bySection=Object.fromEntries(sections.map(s=>[s.id,s]));
  let selected='all',roundDone=false;
  const $=id=>document.getElementById(id),safe=esc;
  const pool=()=>selected==='all'?BANK:BANK.filter(q=>q.sectionId===selected);
  const infer=ids=>{const values=[...new Set(ids.map(id=>BYID[id]?.sectionId).filter(Boolean))];return values.length===1&&bySection[values[0]]?values[0]:'all';};
  const label=q=>(bySection[q.sectionId]?.title||'Cameron Academy')+' · '+(q.sourceQuestion?'Source question '+q.sourceQuestion:q.sourceRef)+' · '+q.topic;
  const panel=document.createElement('section');panel.className='card';panel.id='sectionPanel';
  panel.innerHTML='<label for="sectionSelect" style="display:block;font-weight:bold;margin-bottom:8px">Choose your Cameron quiz</label><select id="sectionSelect" style="font:inherit;width:100%;max-width:100%;padding:12px;border:1px solid #b9c8d9;border-radius:9px;background:white;color:#19314f"><option value="all">All captured sections ('+BANK.length+' ready)</option>'+sections.map(s=>'<option value="'+safe(s.id)+'">'+safe(s.title)+' — '+BANK.filter(q=>q.sectionId===s.id).length+' ready</option>').join('')+'</select><p id="sectionNote" class="ca-caption" style="margin-bottom:0"></p><p class="ca-caption" style="margin-bottom:0"><b>Section 2 is not imported.</b> This does not establish whether you completed it on Cameron’s website. The separate Unit 1 class transcript is not Section 2.</p>';
  document.querySelector('.toolbar').before(panel);
  function syncLabels(){
    $('sectionSelect').value=selected;
    const list=pool(),s=bySection[selected],pending=(CAMERON_META.pending||[]).filter(q=>selected==='all'||q.sectionId===selected).length;
    $('allBtn').querySelector('.glabel').textContent='All '+list.length+' questions';
    $('examBtn').querySelector('.glabel').textContent='Timed practice ('+list.length+' Q)';
    document.querySelector('.sub').textContent=(s?s.title:'All captured Cameron sections')+' · '+list.length+' ready · Progress saved separately from Gold Coast';
    $('sectionNote').textContent=(s?s.title+'. ':sections.length+' imported section quizzes. ')+list.length+' questions ready'+(pending?'; '+pending+' answer still needs review':'')+'. Textbook not attached. My progress combines your Cameron sections. Course answers are preserved as supplied, not independently verified against current law.';
  }
  const oldStart=start,oldFinish=finish,oldResume=resume,oldRender=render,oldReview=reviewQ,oldTeach=teachBlock,oldStats=showStats;
  window.start=function(list,retry,opts){roundDone=false;return oldStart(list,retry,opts);};
  window.finish=function(partial){roundDone=true;return oldFinish(partial);};
  window.resume=function(c){selected=infer(c.ids||[]);syncLabels();roundDone=false;return oldResume(c);};
  function begin(list,opts){
    if(!list.length){alert('No matching questions in this section yet.');return;}
    if(!roundDone&&(right+wrong>0||$('resumeBar'))){
      if(!confirm('Start a new practice round? Answers already recorded stay in your history; the current resumable round will end.'))return;
      if(right+wrong>0)finish(true);
      else{const c=loadJ('reqz_cameron_current',null);if(c)archiveAbandoned(c);}
    }
    clearCurrent();start(list,false,opts);
  }
  $('sectionSelect').onchange=()=>{
    const next=$('sectionSelect').value,previous=selected;
    if(!bySection[next]&&next!=='all')return;
    const list=next==='all'?BANK:BANK.filter(q=>q.sectionId===next);
    if(!roundDone&&(right+wrong>0||$('resumeBar'))){
      if(!confirm('Switch quiz sections? Answers already recorded stay in your history; the current resumable round will end.')){$('sectionSelect').value=previous;return;}
      if(right+wrong>0)finish(true);else{const c=loadJ('reqz_cameron_current',null);if(c)archiveAbandoned(c);}
    }
    clearCurrent();selected=next;syncLabels();start(list,false);
  };
  window.render=function(){oldRender();const q=order[viewIdx];if(q)$('qSrc').textContent=(viewIdx<idx?'Reviewing · ':'')+label(q);};
  window.reviewQ=function(id){oldReview(id);const q=BYID[id];if(q)document.querySelector('#rvBody .qnum').textContent=label(q);};
  window.refLine=q=>'<div class="ref">'+safe(bySection[q.sectionId]?.title||'Cameron Academy')+' · '+safe(q.sourceQuestion?'Source question '+q.sourceQuestion:q.sourceRef)+(q.sourcePdfPages?' · Quiz-results PDF page'+(q.sourcePdfPages.length>1?'s ':' ')+q.sourcePdfPages.join('–'):'')+' · No textbook attached.</div>';
  window.teachBlock=function(q){
    if(q.sectionId==='FLREEPS1')return oldTeach(q);
    let s='<div class="teach"><p><b>Correct answer: '+safe(q.finalAnswer.toUpperCase())+'. '+safe(q.options[q.finalAnswer])+'</b></p><details class="ca-help" open><summary>Course explanation</summary><p class="ca-caption">Cameron’s explanation from your completed-quiz PDF; not a textbook quotation.</p><div class="ca-text">'+safe(q.courseExplanation)+'</div></details>';
    if(q.sourceWarning)s+='<div class="ca-help ca-source-warning"><b>Source note</b><p>'+safe(q.sourceWarning)+'</p></div>';
    if(q.doubt)s+='<details class="ca-help" open><summary>'+safe(q.doubt.question)+'</summary><p class="ca-caption">Additional clarification based on this source.</p><p>'+safe(q.doubt.answer)+'</p></details>';
    return s+'<p class="ca-caption">Reading check: '+safe(q.readingTip)+'</p></div>';
  };
  window.showStats=function(){
    oldStats();const h=loadJ('reqz_cameron_hist',{});
    const box=document.createElement('div');box.id='sectionStats';
    box.innerHTML='<h3>By Cameron section</h3>'+sections.map(s=>{const list=BANK.filter(q=>q.sectionId===s.id),seen=list.filter(q=>h[q.id]?.s>0),correct=seen.filter(q=>h[q.id].last===1).length;return '<p><b>'+safe(s.title)+'</b><br>'+seen.length+' / '+list.length+' practiced'+(seen.length?' · '+correct+' / '+seen.length+' correct on your latest answers':'')+'</p>';}).join('');
    $('statsBody').prepend(box);
    if(meta.sourceAttempts?.length){
      const sourceBox=document.createElement('details');sourceBox.className='ca-help';sourceBox.id='sourceAttempts';
      const heading=document.createElement('summary');heading.textContent='Saved PDF attempts — separate from app progress';sourceBox.append(heading);
      for(const attempt of meta.sourceAttempts){const note=document.createElement('p');note.className='ca-caption';note.textContent='Section '+bySection[attempt.sectionId].number+' · '+(attempt.capturedAtLocal||'Saved PDF')+' · '+attempt.correct+' / '+attempt.total+' correct in '+attempt.duration+(attempt.duplicateQuestions?' · '+attempt.duplicateQuestions+' repeated questions; none added twice.':'.');sourceBox.append(note);}
      const note=document.createElement('p');note.className='ca-caption';note.textContent='These are source results only. They do not change app scores, missed-question drills, or resumable sessions.';sourceBox.append(note);$('statsBody').append(sourceBox);
    }
  };
  wire('allBtn',()=>begin(pool()));wire('restartBtn',()=>begin(pool()));
  wire('examBtn',()=>begin(pool(),{exam:true,limit:pool().length}));
  const drill=weak=>{const h=loadJ('reqz_cameron_hist',{});begin(pool().filter(q=>h[q.id]&&(weak?h[q.id].weak:h[q.id].w)>0));};
  wire('wrongBtn',()=>drill(false));wire('practiceWeakBtn',()=>drill(false));wire('practiceWeak2Btn',()=>drill(true));
  wire('statsBtn',showStats);wire('statsBtn2',showStats);
  wire('resetBtn',()=>{if(!confirm('Erase all Cameron progress on this device, for all imported sections? Gold Coast will not change.'))return;['hist','log','sessions','queue','current'].forEach(k=>localStorage.removeItem('reqz_cameron_'+k));sessionResults={};roundDone=true;start(pool(),false);});
  syncLabels();render();window.RE_SECTION_IDS=sections.map(s=>s.id);
}
if(typeof document!=='undefined'){
  const originalBuilder=buildCameronHTML;
  window.buildCameronHTML=function(original,data){
    let html=originalBuilder(original,data);if(!data.sections)return html;
    const config='<script>window.CAMERON_SECTIONS='+scriptJSON({sections:data.sections,sourceAttempts:data.sourceAttempts||[]})+';('+cameronSectionsRuntime.toString()+')();<\/script>';
    return html.replace('</body>',config+'</body>');
  };
}
if(typeof module!=='undefined'&&module.exports)module.exports={mergeCameronSections,cameronSectionsRuntime};
