import {useEffect,useRef} from 'react';
import './responsive-frame.css';
export function ResponsiveFrame({active}:{active:boolean}){
 const frame=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const el=frame.current,hero=el?.closest<HTMLElement>('.hero');
  if(!el||!hero||!active||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let raf=0;
  const reset=()=>{el.style.setProperty('--frame-x','0px');el.style.setProperty('--frame-y','0px');el.classList.remove('frame-held');hero.querySelectorAll<HTMLElement>('.kinetic-glyph').forEach(g=>g.style.removeProperty('translate'));};
  const move=(event:PointerEvent)=>{
   cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{
    const held=!!hero.querySelector('.is-dragging'),r=hero.getBoundingClientRect();
    el.classList.toggle('frame-held',held);
    el.style.setProperty('--frame-x',`${(event.clientX-r.left-r.width/2)*(held?.018:.005)}px`);
    el.style.setProperty('--frame-y',`${(event.clientY-r.top-r.height/2)*(held?.018:.005)}px`);
    hero.querySelectorAll<HTMLElement>('.kinetic-glyph').forEach(g=>{
     if(!held){g.style.removeProperty('translate');return;}
     const b=g.getBoundingClientRect(),dx=b.left+b.width/2-event.clientX,dy=b.top+b.height/2-event.clientY,d=Math.hypot(dx,dy),force=Math.max(0,1-d/180)*18;
     g.style.translate=`${dx/Math.max(d,1)*force}px ${dy/Math.max(d,1)*force}px`;
    });
   });
  };
  hero.addEventListener('pointermove',move);hero.addEventListener('pointerleave',reset);window.addEventListener('pointerup',reset);window.addEventListener('pointercancel',reset);
  return()=>{cancelAnimationFrame(raf);reset();hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',reset);window.removeEventListener('pointerup',reset);window.removeEventListener('pointercancel',reset);};
 },[active]);
 return <div className="responsive-frame" ref={frame} aria-hidden="true"><span className="frame-corner corner-tl"/><span className="frame-corner corner-tr"/><span className="frame-corner corner-bl"/><span className="frame-corner corner-br"/><span className="frame-axis"/></div>;
}
