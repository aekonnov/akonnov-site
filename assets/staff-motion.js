/* Article-only viewer of actual exported game frames, not a game simulation. */
(()=>{
 'use strict';
 const canvas=document.querySelector('#sm-canvas');if(!canvas)return;
 const context=canvas.getContext('2d');if(!context)return;
 const person=document.querySelector('#sm-person'),direction=document.querySelector('#sm-direction');
 const button=document.querySelector('#sm-play'),status=document.querySelector('#sm-status'),counter=document.querySelector('#sm-frame');
 const allowed=new Set(['igor','marta','petr','olga_neutral']);
 let image=null,frame=0,running=false,last=0,elapsed=0,request=0,loadId=0;
 const cycleSeconds=(4/3)/1.794;
 function draw(){
  context.clearRect(0,0,384,512);
  if(image)context.drawImage(image,frame*192,Number(direction.value)*256,192,256,0,0,384,512);
  counter.textContent=`${counter.dataset.label} ${frame+1} / 16`;
 }
 function stop(){running=false;cancelAnimationFrame(request);button.textContent=button.dataset.play;button.setAttribute('aria-pressed','false');last=0;}
 function tick(now){
  if(!running)return;
  if(document.hidden){last=0;request=requestAnimationFrame(tick);return;}
  if(last)elapsed+=(now-last)/1000;
  last=now;frame=Math.floor((elapsed/cycleSeconds)*16)%16;draw();request=requestAnimationFrame(tick);
 }
 async function load(){
  stop();const id=++loadId;image=null;frame=0;elapsed=0;draw();button.disabled=true;status.textContent=status.dataset.loading;
  const key=person.value;if(!allowed.has(key))return;
  const next=new Image();next.src=`/assets/staff-motion/${key}-walk.webp`;
  try{await next.decode();if(id!==loadId)return;if(next.width!==3072||next.height!==2048)throw new Error('Atlas size');image=next;status.textContent='';button.disabled=false;draw();}
  catch{if(id===loadId)status.textContent=status.dataset.error;}
 }
 button.addEventListener('click',()=>{if(running){stop();return;}running=true;button.textContent=button.dataset.pause;button.setAttribute('aria-pressed','true');last=0;request=requestAnimationFrame(tick);});
 person.addEventListener('change',load);direction.addEventListener('change',draw);
 window.addEventListener('pagehide',stop);load();
})();
