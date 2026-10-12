import {PieceIcon,InlineIcon} from './PieceIcon';
import {useState,type CSSProperties} from 'react';
import {contactEmail} from './contact';
type Props={lang:'es'|'en'};
export function ProfilePlay({lang}:Props){
 const [discipline,setDiscipline]=useState(0);
 const es=lang==='es';
 const areas=[{name:es?'Diseño gráfico':'Graphic design',title:es?'Una identidad que se reconoce.':'An identity you recognise.',text:es?'Me interesa dar forma a marcas y mensajes a través de la tipografía, el color y la composición. Exploro identidad visual, diseño editorial y packaging.':'I’m interested in shaping brands and messages through typography, colour and composition. I explore visual identity, editorial design and packaging.',tools:'Illustrator · InDesign',project:'stargy',example:'STARGY'},{name:'Web · UI/UX',title:es?'Interfaces que guían.':'Interfaces that guide.',text:es?'Me interesa cómo se organiza una experiencia: qué se ve primero, cómo se navega y qué facilita cada decisión. Diseño interfaces y exploro su desarrollo en la web.':'I’m interested in how an experience is organised: what you see first, how you navigate and what helps each decision. I design interfaces and explore their development for the web.',tools:'Figma · HTML · CSS · JavaScript',project:'sprinter',example:'Sprinter'},{name:'App · UI/UX',title:es?'De una necesidad a una pantalla.':'From a need to a screen.',text:es?'Exploro recorridos y pantallas para aplicaciones, buscando claridad en la información y coherencia entre las distintas partes de la interfaz.':'I explore user journeys and app screens, looking for clear information and consistency across the interface.',tools:'Figma',project:'app156',example:'App 156'}];
 const current=areas[discipline];
 return <div className="profile-editorial">
 <div className="profile-introduction"><span className="project-kicker">{es?'Sobre mí':'About me'}</span><p>{es?'Me interesa crear identidades visuales e interfaces para web y aplicaciones, combinando diseño gráfico y UI/UX.':'I’m interested in creating visual identities and interfaces for websites and apps, combining graphic design and UI/UX.'}</p></div>
 <div className="profile-focus"><div className="profile-play"><button className="perspective-object" aria-label={es?'Girar y explorar el siguiente enfoque':'Turn and explore the next focus'} onClick={()=>setDiscipline(n=>(n+1)%3)} onPointerMove={e=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--lean-x',`${(e.clientY-r.top-r.height/2)*-.08}deg`);e.currentTarget.style.setProperty('--lean-y',`${(e.clientX-r.left-r.width/2)*.08}deg`);}} onPointerLeave={e=>{e.currentTarget.style.setProperty('--lean-x','0deg');e.currentTarget.style.setProperty('--lean-y','0deg');}}><div className="perspective-rotor" style={{'--turn':`${discipline*90}deg`} as CSSProperties}>{[es?'Gráfico':'Graphic','Web','App','UI/UX'].map((label,i)=><div className={`rotor-face rotor-face-${i}`} key={label}><span aria-hidden="true"><PieceIcon index={i===3?1:i}/></span><small>{label}</small></div>)}</div></button><span className="profile-turn-hint">{es?'Gira la pieza o elige un enfoque.':'Turn the piece or choose a focus.'}</span></div>
 <div className="profile-focus-detail"><div className="profile-area-controls" role="group" aria-label={es?'Mis principales intereses':'My main interests'}>{areas.map((area,i)=><button key={area.name} aria-pressed={discipline===i} onClick={()=>setDiscipline(i)}>{area.name}</button>)}</div><div className="profile-area-copy" aria-live="polite"><div key={discipline} className="focus-copy-motion"><h3>{current.title}</h3><p>{current.text}</p></div></div></div></div>
 <div className="profile-editorial-bottom"><a className="profile-contact-link" href="#contact">{es?'Hablemos':'Let’s talk'} <InlineIcon kind="arrow"/></a></div>
 </div>;
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
   <div className="letter-object" aria-hidden="true"><div className="letter-insert"><span>{es?'Hola, Jorge.':'Hello, Jorge.'}</span><b><InlineIcon kind="arrow"/></b></div><div className="letter-pocket"/><div className="letter-flap"/></div>
   <span className="letter-caption">{open?(es?'Cerrar carta':'Close letter'):(es?'Escríbeme':'Write to me')} <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={open?'M6 6 18 18M18 6 6 18':'M6 18 18 6M6 6h12v12'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
  </button>
  <form id="contact-draft" className="contact-draft" hidden={!open} onSubmit={e=>{e.preventDefault();send();}}>
   <fieldset className="letter-disciplines"><legend>{es?'Proyecto':'Project'}</legend><div>{labels.map((label,i)=><label key={label}><input type="radio" name="contact-discipline" value={i} checked={kind===i} onChange={()=>setKind(i)}/><span>{label}</span></label>)}</div></fieldset>
   <label className="letter-message" htmlFor="brief-note">{es?'Mensaje':'Message'}</label>
   <textarea id="brief-note" value={note} onChange={e=>{setNote(e.target.value);setPrepared(false);}} placeholder={es?'Cuéntame tu idea…':'Tell me your idea…'} maxLength={1200} rows={3}/>
   <div className="letter-actions"><button className="letter-send" type="submit" disabled={!contactEmail}>{es?'Preparar correo':'Prepare email'} <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m4 12 16-8-6 16-3-7-7-1Zm7 1 9-9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/></svg></button></div>
   <p className="draft-status">{contactEmail?(es?'Abre el mensaje en tu correo.':'Opens the message in your email app.'):(es?'El contacto por correo estará disponible próximamente.':'Email contact will be available soon.')}</p>
   {prepared&&<p className="contact-fallback" role="status">{es?'¿No se abrió? Escríbeme directamente:':'Didn’t open? Write to me directly:'}<br/><a href={`mailto:${contactEmail}`}>{contactEmail}</a></p>}
  </form>
 </div>;
}

