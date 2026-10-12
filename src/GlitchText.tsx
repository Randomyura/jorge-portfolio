import {useEffect,useRef} from 'react';
export function GlitchText({text}:{text:string}){
 const root=useRef<HTMLSpanElement>(null);
 useEffect(()=>{const el=root.current!;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;let timer:ReturnType<typeof setTimeout>|undefined;const pulse=()=>{el.classList.remove('glitch-active');requestAnimationFrame(()=>el.classList.add('glitch-active'));clearTimeout(timer);timer=setTimeout(()=>el.classList.remove('glitch-active'),650);};const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)pulse();}),{threshold:.6});observer.observe(el);el.addEventListener('pointerenter',pulse);return()=>{observer.disconnect();el.removeEventListener('pointerenter',pulse);clearTimeout(timer);};},[text]);
 return <span ref={root} className="heading-glitch" data-text={text}>{text}</span>;
}
