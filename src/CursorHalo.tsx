import {useEffect,useRef} from 'react';
export function CursorHalo(){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const media=matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  let cleanup=()=>{};
  const setup=()=>{cleanup();const el=ref.current!;if(!media.matches){el.hidden=true;return;}el.hidden=false;let frame=0,seen=false,x=0,y=0,tx=0,ty=0;
   const move=(e:PointerEvent)=>{if(e.pointerType!=='mouse')return;tx=e.clientX;ty=e.clientY;if(!seen){x=tx;y=ty;seen=true;}el.classList.add('cursor-visible');const target=e.target as Element;el.classList.toggle('cursor-link',!!target.closest('a,button,[role=button]'));el.classList.toggle('cursor-on-wine',!!target.closest('.new-contact,.discipline-strip'));};
   const tick=()=>{x+=(tx-x)*.2;y+=(ty-y)*.2;el.style.transform=`translate3d(${x}px,${y}px,0)`;frame=requestAnimationFrame(tick);};
   const hide=()=>el.classList.remove('cursor-visible','cursor-pressed');const down=()=>el.classList.add('cursor-pressed');const up=()=>el.classList.remove('cursor-pressed');
   window.addEventListener('pointermove',move,{passive:true});window.addEventListener('pointerdown',down);window.addEventListener('pointerup',up);window.addEventListener('blur',hide);document.documentElement.addEventListener('pointerleave',hide);tick();
   cleanup=()=>{cancelAnimationFrame(frame);window.removeEventListener('pointermove',move);window.removeEventListener('pointerdown',down);window.removeEventListener('pointerup',up);window.removeEventListener('blur',hide);document.documentElement.removeEventListener('pointerleave',hide);hide();};
  };setup();media.addEventListener('change',setup);return()=>{cleanup();media.removeEventListener('change',setup);};
 },[]);
 return <div ref={ref} className="cursor-halo" hidden aria-hidden="true"><span/></div>;
}
