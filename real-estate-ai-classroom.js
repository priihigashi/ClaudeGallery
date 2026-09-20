/* Public bridge to a separately deployed protected classroom. No secret belongs here. */
'use strict';
function resolveClassroomDestination(config){
  if(!config||config.status!=='verified'||typeof config.url!=='string')return null;
  try{
    const url=new URL(config.url);
    if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash)return null;
    if(url.port&&url.port!=='443')return null;
    if(url.hostname==='localhost'||url.hostname.endsWith('.local')||/^\[|^\d+\./.test(url.hostname))return null;
    return url.href;
  }catch(_){return null;}
}
function setupClassroomLauncher(){
  const destination=resolveClassroomDestination(window.RE_AI_CLASSROOM);
  const button=document.getElementById('aiClassroom');
  const status=document.getElementById('status');
  if(!button)return;
  button.dataset.status=destination?'ready':'not-deployed';
  button.setAttribute('aria-disabled',String(!destination));
  button.onclick=()=>{
    if(!destination){
      if(status)status.textContent='AI Classroom is not available yet. Its protected deployment must pass verification before this study path opens.';
      return;
    }
    // No access key, local progress, or source material is passed to the new app.
    location.assign(destination);
  };
}
if(typeof module!=='undefined'&&module.exports)module.exports={resolveClassroomDestination};
if(typeof document!=='undefined')setupClassroomLauncher();
