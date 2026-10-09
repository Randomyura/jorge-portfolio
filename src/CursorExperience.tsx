import {useEffect,useRef} from 'react';
import './cursor-experience.css';

export function CursorExperience(){
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const el=root.current!,parts=Array.from(el.children) as HTMLElement[];
  const media=matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  let frame=0,last=0,idle=0,shown=false;
  const target={x:0,y:0,hx:0,hy:0},points=Array.from({length:4},()=>({x:0,y:0}));
  const hide=()=>{shown=false;el.classList.remove('is-visible');cancelAnimationFrame(frame);frame=0;clearTimeout(idle);};
  const draw=(now:number)=>{
   frame=0;if(!shown||!media.matches||document.hidden)return;
   const dt=last?Math.min((now-last)/16.67,3):1;last=now;
   let moving=false;
   points.forEach((point,i)=>{
    const destination=i===0?target:i===1?{x:target.hx,y:target.hy}:points[i-1];
    const blend=i===0?1:1-Math.pow(1-[1,.18,.14,.11][i],dt);
    point.x+=(destination.x-point.x)*blend;point.y+=(destination.y-point.y)*blend;
    moving||=Math.hypot(destination.x-point.x,destination.y-point.y)>.2;
    parts[i].style.transform=`translate3d(${point.x}px,${point.y}px,0) translate(-50%,-50%)`;
   });
   if(moving)frame=requestAnimationFrame(draw);
  };
  const move=(event:PointerEvent)=>{
   if(event.pointerType!=='mouse'||!media.matches||document.hidden)return;
   const node=event.target as Element;
   // Leave forms and native dialogs to the ordinary system cursor.
   if(node.closest('dialog,input,textarea,select,[contenteditable=true]')){hide();return;}
   target.x=target.hx=event.clientX;target.y=target.hy=event.clientY;
   const piece=node.closest('.toy,.archive-front,.perspective-object,.letter-trigger'),title=node.closest('.kinetic-title');
   el.dataset.mode=piece?'piece':title?'title':node.closest('button,a,summary')?'control':'free';
   if(piece){const r=piece.getBoundingClientRect();target.hx+=Math.max(-16,Math.min(16,(r.left+r.width/2-event.clientX)*.18));target.hy+=Math.max(-16,Math.min(16,(r.top+r.height/2-event.clientY)*.18));}
   if(!shown){points.forEach(p=>{p.x=target.x;p.y=target.y;});shown=true;last=0;el.classList.add('is-visible');}
   clearTimeout(idle);idle=window.setTimeout(hide,1100);
   if(!frame)frame=requestAnimationFrame(draw);
  };
  const leave=(event:PointerEvent)=>{if(!event.relatedTarget)hide();};
  const visibility=()=>{if(document.hidden)hide();};
  const preference=()=>{if(!media.matches)hide();};
  window.addEventListener('pointermove',move,{passive:true});window.addEventListener('pointerout',leave);window.addEventListener('blur',hide);
  document.addEventListener('visibilitychange',visibility);media.addEventListener('change',preference);
  return()=>{hide();window.removeEventListener('pointermove',move);window.removeEventListener('pointerout',leave);window.removeEventListener('blur',hide);document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',preference);};
 },[]);
 return <div ref={root} className="cursor-experience" aria-hidden="true"><span className="cursor-point"/><span className="cursor-halo"/><span className="cursor-trail trail-one"/><span className="cursor-trail trail-two"/></div>;
}
