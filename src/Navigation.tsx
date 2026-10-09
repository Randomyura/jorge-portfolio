import {useEffect,useRef,useState} from 'react';

export function Navigation({lang,labels,screen}:{lang:'es'|'en',labels:string[],screen:string}){
 const [open,setOpen]=useState(false);
 const root=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null);
 useEffect(()=>{setOpen(false);},[screen]);
 useEffect(()=>{
  if(!open)return;
  const outside=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))setOpen(false);};
  const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'){setOpen(false);trigger.current?.focus();}};
  document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);
  return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape);};
 },[open]);
 return <div className={`compact-navigation ${open?'is-open':''}`} ref={root} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node))setOpen(false);}}>
  <button ref={trigger} className="navigation-trigger" aria-label={lang==='es'?(open?'Cerrar menú':'Abrir menú'):(open?'Close menu':'Open menu')} aria-expanded={open} aria-controls="section-navigation" onClick={()=>setOpen(!open)}><svg className="menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path className="menu-stroke menu-stroke-top" d="M4 8h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/><path className="menu-stroke menu-stroke-bottom" d="M4 16h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg><span>{open?(lang==='es'?'Cerrar':'Close'):(lang==='es'?'Menú':'Menu')}</span></button>
  <nav id="section-navigation" className="navigation-dropdown" aria-label={lang==='es'?'Secciones':'Sections'} hidden={!open}>{['work','about','contact'].map((id,i)=><a key={id} href={`#${id}`} aria-current={screen===id?'page':undefined} onClick={()=>setOpen(false)}><span className="navigation-symbol" aria-hidden="true">{['✳','↗','◒'][i]}</span><span>{labels[i]}</span><span className="navigation-arrow" aria-hidden="true">{screen===id?'•':'↗'}</span></a>)}</nav>
 </div>;
}
