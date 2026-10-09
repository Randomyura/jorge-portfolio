import {InlineIcon} from './PieceIcon';
import {useEffect,useRef,useState} from 'react';
type Lang='es'|'en';
export function HeaderControls({lang,dark,onTheme,onLanguage}:{lang:Lang,dark:boolean,onTheme:()=>void,onLanguage:(lang:Lang)=>void}){
 const [open,setOpen]=useState(false),root=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  if(!open)return;
  const outside=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false);};
  const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);trigger.current?.focus();}};
  document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);
  return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape);};
 },[open]);
 return <div className="controls refined-controls">
  <button className="theme-control" onClick={onTheme} aria-label={lang==='es'?'Modo oscuro':'Dark mode'} aria-pressed={dark} title={lang==='es'?(dark?'Cambiar a modo claro':'Cambiar a modo oscuro'):(dark?'Switch to light mode':'Switch to dark mode')}><svg key={String(dark)} width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">{dark?<><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>:<path d="M20.5 14.2A8.7 8.7 0 0 1 9.8 3.5a8.8 8.8 0 1 0 10.7 10.7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>}</svg></button>
  <div className="language-control" ref={root} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setOpen(false);}}>
   <button ref={trigger} className="language-trigger" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="language-options" aria-label={lang==='es'?'Elegir idioma':'Choose language'}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><ellipse cx="12" cy="12" rx="4" ry="9" stroke="currentColor" strokeWidth="1.5"/><path d="M3 12h18" stroke="currentColor" strokeWidth="1.5"/></svg><span>{lang.toUpperCase()}</span></button>
   <div id="language-options" className="language-options" hidden={!open} role="group" aria-label={lang==='es'?'Idiomas':'Languages'}>{(['es','en'] as const).map(code=><button key={code} lang={code} aria-pressed={code===lang} onClick={()=>{setOpen(false);onLanguage(code);trigger.current?.focus();}}><span>{code==='es'?'Español':'English'}</span><span aria-hidden="true"><InlineIcon kind={code===lang?"check":"arrow"}/></span></button>)}</div>
  </div>
 </div>;
}
