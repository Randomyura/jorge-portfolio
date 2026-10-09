import {useEffect,useRef,useState} from 'react';
export function Footer({lang,screen}:{lang:'es'|'en',screen:string}){
 const [open,setOpen]=useState(false),root=useRef<HTMLElement>(null),trigger=useRef<HTMLButtonElement>(null);
 const es=lang==='es';
 useEffect(()=>{setOpen(false);},[screen]);
 useEffect(()=>{
  if(!open)return;
  const outside=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false);};
  const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);trigger.current?.focus();}};
  document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);
  return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape);};
 },[open]);
 return <footer className="portfolio-footer" ref={root}><span className="footer-credit">Jorge Sunyer Guirado <span>© {new Date().getFullYear()}</span></span><div className="footer-actions"><button ref={trigger} className="footer-guide" aria-expanded={open} aria-controls="exploration-guide" onClick={()=>setOpen(!open)}><span>{es?'Cómo explorar':'How to explore'}</span><svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4m0 3v.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></button>{screen!=='home'&&<a className="footer-home" href="#home" aria-label={es?'Volver a la portada':'Back to home'}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 20V4m-6 6 6-6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></a>}</div><aside className="exploration-guide" id="exploration-guide" hidden={!open} aria-label={es?'Cómo explorar el portafolio':'How to explore the portfolio'}><p>{es?'Tres formas de explorar.':'Three ways to explore.'}</p><dl><div><dt>{es?'Piezas':'Pieces'}</dt><dd>{es?'Elige una pieza y encájala. También puedes tocarla otra vez.':'Choose a piece and fit it in place. You can also tap it again.'}</dd></div><div><dt>Scroll</dt><dd>{es?'Desliza para cambiar de pantalla.':'Scroll or swipe to change screens.'}</dd></div><div><dt>{es?'Menú':'Menu'}</dt><dd>{es?'Accede directamente a cualquier sección.':'Jump directly to any section.'}</dd></div></dl><button onClick={()=>{setOpen(false);trigger.current?.focus();}}>{es?'Entendido':'Got it'} ↗</button></aside></footer>;
}
