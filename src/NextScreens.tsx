import {PieceIcon} from './PieceIcon';
import {useRef,useState,type CSSProperties} from 'react';
import {contactEmail} from './contact';
type Props={lang:'es'|'en'};
export function ProfilePlay({lang}:{lang:'es'|'en'}){
 const [discipline,setDiscipline]=useState(0),[explored,setExplored]=useState(false);
 const object=useRef<HTMLButtonElement>(null);
 const labels=lang==='es'?['Gráfico','Web','App','3D']:['Graphic','Web','App','3D'];
 const copy=lang==='es'?['Identidad y comunicación visual.','Experiencias que se exploran.','Interfaces que responden.','Ideas que toman volumen.']:['Identity and visual communication.','Experiences to explore.','Interfaces that respond.','Ideas that take shape.'];
 return <><div className="profile-play"><button className="perspective-object" ref={object} aria-label={lang==='es'?'Girar y explorar la siguiente disciplina':'Turn and explore the next discipline'} onClick={()=>{setExplored(true);setDiscipline(n=>(n+1)%4);}} onPointerMove={e=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--lean-x',`${(e.clientY-r.top-r.height/2)*-.08}deg`);e.currentTarget.style.setProperty('--lean-y',`${(e.clientX-r.left-r.width/2)*.08}deg`);}} onPointerLeave={e=>{e.currentTarget.style.setProperty('--lean-x','0deg');e.currentTarget.style.setProperty('--lean-y','0deg');}}><div className="perspective-rotor" style={{'--turn':`${discipline*90}deg`} as CSSProperties}>{labels.map((label,i)=><div className={`rotor-face rotor-face-${i}`} key={label}><span aria-hidden="true"><PieceIcon index={i}/></span><small>{label}</small></div>)}</div></button><p className="perspective-copy" key={discipline} aria-live="polite">{copy[discipline]}</p>{!explored&&<span className="profile-play-hint">{lang==='es'?'Toca para girar y explorar':'Tap to turn and explore'} ↻</span>}</div><div className="profile-bottom"><div className="gallery-disciplines" role="group" aria-label={lang==='es'?'Explorar mi enfoque':'Explore my approach'}>{labels.map((label,i)=><button key={label} aria-pressed={discipline===i} onClick={()=>{setExplored(true);setDiscipline(i);}}>{label}<span aria-hidden="true">↗</span></button>)}</div><details className="profile-biography"><summary>{lang==='es'?'Detrás de las piezas':'Behind the pieces'} <span>↗</span></summary><p>{lang==='es'?'Soy Jorge Sunyer Guirado. Trabajo entre diseño gráfico, web, app y 3D. Me interesa cruzar estas disciplinas para construir experiencias con personalidad.':'I’m Jorge Sunyer Guirado. I work across graphic, web, app and 3D design, combining these disciplines to build experiences with character.'}</p></details></div></>;
}

export function ContactPlay({lang}:Props){
 const [open,setOpen]=useState(false),[kind,setKind]=useState(1),[note,setNote]=useState(''),[prepared,setPrepared]=useState(false);
 const es=lang==='es';
 const labels=es?['Gráfico','Web','App','3D']:['Graphic','Web','App','3D'];
 const send=()=>{
  if(!contactEmail)return;
  setPrepared(true);
  const subject=`${es?'Hablemos de':'Let’s talk about'} ${labels[kind]} — Portfolio`;
  const body=`${es?'Hola Jorge,':'Hi Jorge,'}\n\n${note.trim()||`${es?'Me gustaría hablar sobre un proyecto de':'I’d like to discuss a project in'} ${labels[kind].toLowerCase()}.`}\n`;
  window.location.href=`mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
 };
 return <div className={`contact-play polished-letter ${open?'is-open':''}`}>
  <button className="letter-trigger" aria-expanded={open} aria-controls="contact-draft" onClick={()=>setOpen(!open)}>
   <div className="letter-object" aria-hidden="true"><div className="letter-insert"><span>{es?'Hola, Jorge.':'Hello, Jorge.'}</span><b>↗</b></div><div className="letter-pocket"/><div className="letter-flap"/></div>
   <span className="letter-caption">{open?(es?'Cerrar carta':'Close letter'):(es?'Escríbeme':'Write to me')} <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={open?'M6 6 18 18M18 6 6 18':'M6 18 18 6M6 6h12v12'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
  </button>
  <form id="contact-draft" className="contact-draft" hidden={!open} onSubmit={e=>{e.preventDefault();send();}}>
   <fieldset className="letter-disciplines"><legend>{es?'Hablemos de…':'Let’s talk about…'}</legend><div>{labels.map((label,i)=><label key={label}><input type="radio" name="contact-discipline" value={i} checked={kind===i} onChange={()=>setKind(i)}/><span>{label}</span></label>)}</div></fieldset>
   <label className="letter-message" htmlFor="brief-note">{es?'Tu mensaje':'Your message'}</label>
   <textarea id="brief-note" value={note} onChange={e=>{setNote(e.target.value);setPrepared(false);}} placeholder={es?'Cuéntame qué tienes en mente…':'Tell me what you have in mind…'} maxLength={1200} rows={3}/>
   <div className="letter-actions"><button className="letter-send" type="submit" disabled={!contactEmail}>{es?'Enviar por correo':'Send by email'} <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m4 12 16-8-6 16-3-7-7-1Zm7 1 9-9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/></svg></button></div>
   <p className="draft-status">{contactEmail?(es?'Se abrirá tu aplicación de correo con el mensaje preparado.':'Your email app will open with your message ready.'):(es?'El contacto por correo estará disponible próximamente.':'Email contact will be available soon.')}</p>
   {prepared&&<p className="contact-fallback" role="status">{es?'¿No se abrió? Escríbeme directamente:':'Didn’t open? Write to me directly:'}<br/><a href={`mailto:${contactEmail}`}>{contactEmail}</a></p>}
  </form>
 </div>;
}

