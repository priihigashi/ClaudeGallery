/* Public bridge from the static Real Estate Study home to the separately deployed
   protected AI Classroom. No secret belongs in this file. */
'use strict';
(function(){
  const cfg=window.RE_AI_CLASSROOM||{};
  const button=document.getElementById('aiClassroom');
  const status=document.getElementById('status');
  if(!button)return;
  const url=typeof cfg.url==='string'?cfg.url.trim():'';
  const ready=/^https:\/\//i.test(url);
  button.dataset.status=ready?'ready':'not-deployed';
  button.setAttribute('aria-disabled',String(!ready));
  button.onclick=()=>{
    if(!ready){
      if(status)status.textContent='AI Classroom is staged on the feature branch but its protected OpenMAIC deployment is not live yet.';
      return;
    }
    location.assign(url);
  };
})();
