import {useEffect,useRef} from 'react';
export function ScissorDivider(){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{const el=ref.current!;let frame=0;const update=()=>{const r=el.getBoundingClientRect(),p=Math.max(0,Math.min(1,(innerHeight*.85-r.top)/(innerHeight*.55)));el.style.setProperty('--line-progress',String(p));};const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update);};window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);update();return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);};},[]);
 return <div ref={ref} className="perspective-divider" aria-hidden="true"><span className="divider-draw-line"/></div>;
}
