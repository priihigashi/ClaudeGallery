/* Cameron study aids: encrypted Portuguese translation + optional question-reading cues.
   English source, scoring, question IDs and progress storage remain canonical and unchanged. */
'use strict';

function checkedCameronStudyAidPack(pack,data){
  if(!pack||pack.version!==1||pack.school!=='cameron'||pack.language!=='pt-BR'||pack.kind!=='study-aid'||!pack.translations||typeof pack.translations!=='object') throw Error('Invalid Cameron Portuguese study-aid collection.');
  const ids=new Set([...(data.questions||[]),...(data.pending||[])].map(q=>q.id));
  const translated=Object.keys(pack.translations);
  if(translated.length!==ids.size||translated.some(id=>!ids.has(id))) throw Error('Portuguese study-aid IDs do not match Cameron questions.');
  for(const id of translated){const t=pack.translations[id];if(!t||!t.question||!t.options||['a','b','c','d'].some(k=>!t.options[k])||typeof t.study!=='string')throw Error('Incomplete Portuguese study aid: '+id);}
  return pack;
}
async function loadCameronStudyAids(data,key){
  const r=await fetch('cameron-pt-study.json',{cache:'no-cache',referrerPolicy:'no-referrer'});if(!r.ok)throw Error('Portuguese study aid could not be loaded. Your questions and progress are unchanged.');
  const e=await r.json();if(e.version!==1||e.algorithm!=='AES-GCM'||e.compression!=='gzip'||e.language!=='pt-BR')throw Error('Unsupported Portuguese study-aid format.');
  let ciphertext=e.ciphertext||'';
  if(!ciphertext&&Array.isArray(e.parts)&&e.parts.length){const chunks=await Promise.all(e.parts.map(async name=>{if(!/^cameron-pt-study-\d{2}\.txt$/.test(name))throw Error('Invalid Portuguese study-aid part.');const p=await fetch(name,{cache:'no-cache',referrerPolicy:'no-referrer'});if(!p.ok)throw Error('Portuguese study aid is incomplete.');return p.text();}));ciphertext=chunks.join('');}
  if(!ciphertext)throw Error('Portuguese study aid is empty.');
  const bytes=x=>Uint8Array.from(atob(x.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
  const k=await crypto.subtle.importKey('raw',bytes(key),{name:'AES-GCM'},false,['decrypt']);
  const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(e.iv)},k,bytes(ciphertext));
  const text=await new Response(new Blob([plain]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
  const pack=checkedCameronStudyAidPack(JSON.parse(text),data);
  for(const q of [...(data.questions||[]),...(data.pending||[])])q.pt=pack.translations[q.id];
  data.studyTranslation={language:'pt-BR',canonical:'en',kind:'study-aid'};return data;
}
if(typeof extendCameronCollection==='function'){
  const extendBeforeStudyAids=extendCameronCollection;
  extendCameronCollection=async function(data,key){
    data=await extendBeforeStudyAids(data,key);
    try{return await loadCameronStudyAids(data,key);}
    catch(_){data.studyTranslation={language:'pt-BR',canonical:'en',kind:'study-aid',available:false};return data;}
  };
}

function cameronStudyAidsRuntime(){
  const LANG_KEY='reqz_cameron_study_lang', CUE_KEY='reqz_cameron_reading_cues';
  let lang=loadJ(LANG_KEY,'en'); if(lang!=='pt') lang='en';
  let cues=loadJ(CUE_KEY,false)===true;
  let reviewId=null;
  const safe=esc;

  const style=document.createElement('style');
  style.textContent=`
    .ca-studybar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:10px 0 13px;border-bottom:1px solid #e6edf5;margin-bottom:13px}
    .ca-studybar .ca-studylabel{font-size:12px;font-weight:800;color:#63758b;margin-right:2px}
    .ca-seg{display:inline-flex;border:1px solid #b9c8d9;border-radius:9px;overflow:hidden;background:#fff}
    .ca-seg button,.ca-cuebtn{font:inherit;font-size:13px;font-weight:750;padding:7px 10px;border:0;background:#fff;color:#35516f;min-height:34px}
    .ca-seg button+button{border-left:1px solid #d7e1ec}.ca-seg button.on,.ca-cuebtn.on{background:#e9f1fc;color:#0b55a1}
    .ca-cuebtn{border:1px solid #b9c8d9;border-radius:9px}
    .ca-study-note{width:100%;font-size:12px;line-height:1.45;color:#63758b;margin:0}
    .ca-cue{font-weight:850;text-decoration-line:underline;text-decoration-thickness:3px;text-decoration-color:rgba(232,80,143,.45);text-underline-offset:3px;background:rgba(232,80,143,.08);border-radius:2px}
    .ca-source-warning{border-color:#d9a441!important;background:#fffaf0!important}
    @media(max-width:520px){.ca-studybar{gap:6px}.ca-studybar .ca-studylabel{width:100%}}
  `;
  document.head.append(style);

  const section=document.getElementById('sectionPanel');
  if(section){
    const bar=document.createElement('div'); bar.className='ca-studybar'; bar.id='caStudyBar';
    bar.innerHTML='<span class="ca-studylabel">Study help</span><span class="ca-seg" role="group" aria-label="Question language"><button type="button" id="caLangEn">EN</button><button type="button" id="caLangPt">PT</button></span><button type="button" class="ca-cuebtn" id="caCueBtn" aria-pressed="false">Reading cues</button><p class="ca-study-note" id="caStudyNote"></p>';
    section.insertBefore(bar,section.firstChild);
  }

  const oldTeach=teachBlock, oldFeedback=feedbackHTML, oldRender=render, oldAnswer=answer, oldReview=reviewQ;

  function translation(q){ return q && q.pt ? q.pt : null; }
  function setPref(k,v){ try{saveJ(k,v);}catch(_){ try{localStorage.setItem(k,JSON.stringify(v));}catch(__){} } }
  function cueHTML(text){
    let out=safe(text||'');
    const source=lang==='pt'
      ? '(?:NÃO|EXCETO|DEVE|VERDADEIR[AO]|FALS[AO]|APENAS|NUNCA|SEMPRE|ANTES|DEPOIS|DENTRO DE|EM ATÉ|NO MÁXIMO|NO MÍNIMO|AMBOS|AMBAS|CADA|TODOS OS TRÊS|TODAS AS TRÊS|MAS|PORÉM|A MENOS QUE|DESDE QUE)'
      : '(?:NOT|EXCEPT|MUST|TRUE|FALSE|ONLY|NEVER|ALWAYS|BEFORE|AFTER|WITHIN|AT LEAST|AT MOST|BOTH|EACH|ALL THREE|BUT|HOWEVER|UNLESS|PROVIDED)';
    const number='(?:\\b\\d+(?:,\\d{3})*(?:\\.\\d+)?(?:\\s*(?:business\\s+)?(?:days?|hours?|years?|acres?|units?|lots?))?\\b)';
    const ptNumber='(?:\\b\\d+(?:[.,]\\d+)?(?:\\s*(?:dias(?:\\s+úteis)?|horas|anos|acres|unidades|lotes))?\\b)';
    const re=new RegExp(source+'|'+(lang==='pt'?ptNumber:number),'giu');
    return out.replace(re,m=>'<span class="ca-cue">'+m+'</span>');
  }

  function ptTeach(q){
    const t=translation(q); if(!t) return oldTeach(q);
    let s='<div class="teach"><div class="tline"><span class="tlabel">✅ Resposta correta:</span> <b>'+safe(q.finalAnswer.toUpperCase()+'. '+t.options[q.finalAnswer])+'</b></div>';
    if(t.course) s+='<details class="ca-help" open><summary>Explicação do curso — tradução de estudo</summary><div class="ca-text">'+safe(t.course)+'</div></details>';
    if(t.study) s+='<details class="ca-help" open><summary>Ajuda para entender</summary><div class="ca-text">'+safe(t.study)+'</div></details>';
    if(q.sourceWarning) s+='<div class="ca-help ca-source-warning"><b>⚠️ Nota da fonte</b><p>Esta questão tem uma observação ou inconsistência na fonte original. A tradução é apenas um auxílio de estudo; confira o aviso em inglês para os detalhes exatos.</p></div>';
    return s+'</div>';
  }

  teachBlock=function(q){ return lang==='pt' ? ptTeach(q) : oldTeach(q); };
  feedbackHTML=function(q,sel){
    if(lang!=='pt') return oldFeedback(q,sel);
    const t=translation(q); if(!t) return oldFeedback(q,sel);
    const correct=q.finalAnswer, expl=teachBlock(q)+refLine(q), ans=safe(correct.toUpperCase()+'. '+t.options[correct]);
    if(sel==='?') return '<b>📌 Você respondeu esta questão anteriormente.</b> A resposta é <b>'+ans+'</b>. '+expl;
    return sel===correct ? '<b>✅ Correto!</b> '+expl : '<b>❌ Ainda não.</b> A resposta é <b>'+ans+'</b>. '+expl;
  };

  function applyQuestion(){
    const q=order[viewIdx],t=translation(q); if(!q) return;
    const text=(lang==='pt'&&t)?t.question:q.question;
    const qt=document.getElementById('qText');
    if(qt){ if(cues) qt.innerHTML=cueHTML(text); else qt.textContent=text; }
    const opts=document.querySelectorAll('#opts .opt');
    opts.forEach(b=>{const k=b.dataset.k;if(!k)return;const label=(lang==='pt'&&t)?t.options[k]:q.options[k];b.textContent=k.toUpperCase()+'.  '+label;});
  }
  function applyReview(id){
    const q=BYID[id],t=translation(q); if(!q) return;
    const body=document.getElementById('rvBody'); if(!body) return;
    const qtext=body.querySelector('.qtext'); const text=(lang==='pt'&&t)?t.question:q.question;
    if(qtext){if(cues)qtext.innerHTML=cueHTML(text);else qtext.textContent=text;}
    const opts=[...body.querySelectorAll('.opt')];
    opts.slice(0,4).forEach((el,i)=>{const k=['a','b','c','d'][i],label=(lang==='pt'&&t)?t.options[k]:q.options[k];el.textContent=k.toUpperCase()+'.  '+label;});
  }
  function syncToolbar(){
    const en=document.getElementById('caLangEn'),pt=document.getElementById('caLangPt'),cb=document.getElementById('caCueBtn'),note=document.getElementById('caStudyNote');
    if(en){en.classList.toggle('on',lang==='en');en.setAttribute('aria-pressed',String(lang==='en'));}
    if(pt){pt.classList.toggle('on',lang==='pt');pt.setAttribute('aria-pressed',String(lang==='pt'));}
    if(cb){cb.classList.toggle('on',cues);cb.setAttribute('aria-pressed',String(cues));cb.textContent=lang==='pt'?'Pistas de leitura':'Reading cues';}
    if(note) note.textContent=lang==='pt'?'Tradução para estudo. O inglês continua sendo o texto de referência; mantenha os termos técnicos em inglês.':(cues?'Cues mark reading operators, contrasts and numbers in the question only; they never mark an answer choice.':'English is the source text. Turn on Reading cues only when you want help spotting the wording that changes the question.');
  }

  render=function(){ oldRender(); applyQuestion(); syncToolbar(); };
  answer=function(k,b){ oldAnswer(k,b); if(lang==='pt') render(); };
  reviewQ=function(id){ reviewId=id; oldReview(id); applyReview(id); syncToolbar(); };

  function refresh(){ render(); const modal=document.getElementById('rvModal'); if(reviewId&&modal&&modal.classList.contains('open')) reviewQ(reviewId); }
  const en=document.getElementById('caLangEn'),pt=document.getElementById('caLangPt'),cb=document.getElementById('caCueBtn');
  if(en) en.onclick=()=>{lang='en';setPref(LANG_KEY,lang);refresh();};
  if(pt) pt.onclick=()=>{lang='pt';setPref(LANG_KEY,lang);refresh();};
  if(cb) cb.onclick=()=>{cues=!cues;setPref(CUE_KEY,cues);refresh();};

  window.CAMERON_STUDY_AIDS_READY=true;
  window.CAMERON_STUDY_LANG=()=>lang;
  window.CAMERON_READING_CUES=()=>cues;
  render();
}

if(typeof document!=='undefined' && typeof buildCameronHTML==='function'){
  const builderBeforeStudyAids=buildCameronHTML;
  buildCameronHTML=function(original,data){
    let html=builderBeforeStudyAids(original,data);
    const hasPT=[...(data.questions||[]),...(data.pending||[])].every(q=>q.pt&&q.pt.question&&q.pt.options&&q.pt.study!==undefined);
    if(!hasPT) return html;
    const config='<script>('+cameronStudyAidsRuntime.toString()+')();<\/script>';
    return html.replace('</body>',config+'</body>');
  };
}
if(typeof module!=='undefined'&&module.exports) module.exports={checkedCameronStudyAidPack,cameronStudyAidsRuntime};
