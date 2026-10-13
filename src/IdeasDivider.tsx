import {useEffect,useRef} from 'react';
export function IdeasDivider(){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{const el=ref.current!;let frame=0;const update=()=>{const top=el.getBoundingClientRect().top,p=Math.max(0,Math.min(1,(innerHeight*.9-top)/(innerHeight*.55)));el.style.setProperty('--alignment',String(p));};const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update);};window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);update();return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);};},[]);
 return <div ref={ref} className="ideas-divider" aria-hidden="true">{Array.from({length:12},(_,i)=><span className={i%2?'segment-down':'segment-up'} key={i}/>)}<i/></div>;
}
