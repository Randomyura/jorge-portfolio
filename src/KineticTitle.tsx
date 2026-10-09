import {useEffect,useRef,type CSSProperties} from 'react';
import gsap from 'gsap';
import './kinetic-title.css';

type Props={first:string,second:string,variant:'home'|'work'|'about'|'contact',level?:1|2};
export function KineticTitle({first,second,variant,level=2}:Props){
 const root=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{
  const el=root.current!,section=el.closest('section')!;
  const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)',()=>{
   let tween:gsap.core.Tween|undefined,rest:gsap.core.Tween|undefined,glitchStart:gsap.core.Tween|undefined,glitchEnd:gsap.core.Tween|undefined;
   const enter=()=>{
    tween?.kill();rest?.kill();glitchStart?.kill();glitchEnd?.kill();el.classList.remove('title-glitch');
    if(section.getAttribute('aria-hidden')!=='false')return;
    el.classList.remove('title-resting');
    const letters=el.querySelectorAll('.glyph-reveal');
    tween=gsap.fromTo(letters,{opacity:0,yPercent:variant==='work'?105:variant==='home'?50:0,x:variant==='about'?-22:0,rotationX:variant==='contact'?-65:0,scale:variant==='about'?.75:1},{opacity:1,yPercent:0,x:0,rotationX:0,scale:1,duration:.85,stagger:{each:.025,from:variant==='about'?'center':'start'},ease:'power3.out',delay:.12,clearProps:'all',onComplete:()=>{
     glitchStart=gsap.delayedCall(.22,()=>{
      if(section.getAttribute('aria-hidden')!=='false')return;
      el.classList.add('title-glitch');
      glitchEnd=gsap.delayedCall(.72,()=>el.classList.remove('title-glitch'));
     });
    }});
    rest=gsap.delayedCall(9,()=>el.classList.add('title-resting'));
   };
   const observer=new MutationObserver(enter);observer.observe(section,{attributes:true,attributeFilter:['aria-hidden']});enter();
   return()=>{observer.disconnect();tween?.kill();rest?.kill();glitchStart?.kill();glitchEnd?.kill();el.classList.remove('title-resting','title-glitch');gsap.set(el.querySelectorAll('.glyph-reveal'),{clearProps:'all'});};
  });
  return()=>mm.revert();
 },[first,second,variant]);
 const line=(text:string,accent:boolean)=><span className={`kinetic-line ${accent?'kinetic-accent':''}`} aria-hidden="true">{text.split(' ').map((word,w)=><span className="kinetic-word" key={w}>{Array.from(word).map((letter,i)=><span className="glyph-reveal" key={i}><span className="kinetic-glyph" data-letter={letter} style={{'--i':i+w*5} as CSSProperties}>{letter}</span></span>)}{w<text.split(' ').length-1&&<span className="kinetic-space"> </span>}</span>)}</span>;
 const Tag=level===1?'h1':'h2';
 return <Tag ref={root} className={`kinetic-title kinetic-${variant}`} aria-label={`${first} ${second}`} onPointerMove={e=>{if(e.pointerType!=='mouse'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--title-x',`${(e.clientX-r.left-r.width/2)*.012}px`);e.currentTarget.style.setProperty('--title-y',`${(e.clientY-r.top-r.height/2)*.025}px`);}} onPointerLeave={e=>{e.currentTarget.style.setProperty('--title-x','0px');e.currentTarget.style.setProperty('--title-y','0px');}}>{line(first,false)}{line(second,true)}</Tag>;
}
