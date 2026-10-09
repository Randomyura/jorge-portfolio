import {useEffect,useRef,useState} from 'react';
import gsap from 'gsap';
import {KineticTitle} from './KineticTitle';
import {Experiment} from './Experiments';
import './project-archive.css';
import {DisciplineObject} from './DisciplineObject';
import {PieceIcon,InlineIcon} from './PieceIcon';

type Lang='es'|'en';
type Project={id:number;discipline:number;featured:boolean};
// Layout samples only. Replace these slots with Jorge's actual work and media.
const projects:Project[]=Array.from({length:24},(_,i)=>({id:i+1,discipline:i%4,featured:i<6}));
const pad=(n:number)=>String(n).padStart(2,'0');
function Artwork({project,mini=false}:{project:Project;mini?:boolean}){
 return <div className={`archive-art art-${project.discipline} ${mini?'art-mini':''}`} aria-hidden="true">{mini?<><span className="art-mark"><PieceIcon index={project.discipline}/></span><span className="art-number">{pad(project.id)}</span></>:<DisciplineObject discipline={project.discipline}/>}</div>;
}
export function ProjectArchive({lang,isActive}:{lang:Lang;isActive:boolean}){
 const es=lang==='es',labels=es?['Gráfico','Web','App','3D']:['Graphic','Web','App','3D'];
 const [filter,setFilter]=useState(-1),[all,setAll]=useState(false),[cursor,setCursor]=useState(0);
 const [panel,setPanel]=useState<'index'|'detail'|'lab'|null>(null),[query,setQuery]=useState(''),[lab,setLab]=useState(0);
 const dialog=useRef<HTMLDialogElement>(null),returnTo=useRef<HTMLElement|null>(null),stage=useRef<HTMLDivElement>(null);
 const gesture=useRef<{x:number;y:number;pointer:number}|null>(null);
 const suppressClick=useRef(false);
 const travel=useRef(1);
 const detailMotion=useRef<gsap.core.Timeline|null>(null),closing=useRef(false);
 const sourceRect=useRef<DOMRect|null>(null);
 const pool=projects.filter(p=>(all||p.featured)&&(filter===-1||p.discipline===filter));
 const project=pool[cursor%pool.length],index=cursor%pool.length;
 const name=(p:Project)=>`${es?'Proyecto':'Project'} ${pad(p.id)}`;
 const selectFilter=(n:number)=>{setFilter(n);setCursor(0);};
 const step=(direction:number)=>{travel.current=direction;setCursor((index+direction+pool.length)%pool.length);};
 const open=(next:'index'|'detail'|'lab',trigger:HTMLElement)=>{returnTo.current=trigger;sourceRect.current=stage.current?.querySelector('.archive-art')?.getBoundingClientRect()??null;setPanel(next);};
 const finishClose=()=>{closing.current=false;setPanel(null);};
 const close=()=>{
  if(closing.current)return;
  detailMotion.current?.kill();
  const art=dialog.current?.querySelector('.archive-detail-layout>.archive-art'),source=stage.current?.querySelector('.archive-art');
  if(panel!=='detail'||!art||!source||matchMedia('(prefers-reduced-motion: reduce)').matches){finishClose();return;}
  closing.current=true;
  const a=art.getBoundingClientRect(),b=source.getBoundingClientRect();
  detailMotion.current=gsap.timeline({onComplete:finishClose}).to(dialog.current!.querySelectorAll('.archive-dialog-header,.archive-detail-copy'),{opacity:0,y:8,duration:.18}).to(art,{x:b.left+b.width/2-a.left-a.width/2,y:b.top+b.height/2-a.top-a.height/2,scale:Math.min(b.width/a.width,b.height/a.height),opacity:0,duration:.38,ease:'power3.inOut'},0);
 };
 useEffect(()=>{
  const el=dialog.current!;
  if(!panel){el.close();returnTo.current?.focus({preventScroll:true});return;}
  el.showModal();closing.current=false;
  if(panel!=='detail'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const art=el.querySelector('.archive-detail-layout>.archive-art')!,target=art.getBoundingClientRect(),source=sourceRect.current;
  const ctx=gsap.context(()=>{
   detailMotion.current=gsap.timeline().fromTo(art,{x:source?source.left+source.width/2-target.left-target.width/2:0,y:source?source.top+source.height/2-target.top-target.height/2:30,scale:source?Math.min(source.width/target.width,source.height/target.height):.7,opacity:.35},{x:0,y:0,scale:1,opacity:1,duration:.65,ease:'power3.inOut',clearProps:'transform,opacity'}).fromTo('.archive-dialog-header,.archive-detail-copy',{opacity:0,y:18},{opacity:1,y:0,duration:.4,stagger:.06,clearProps:'opacity,transform'},.25);
  },el);
  return()=>{detailMotion.current?.kill();ctx.revert();};
 },[panel]);
 useEffect(()=>{if(!isActive)setPanel(null);},[isActive]);
 useEffect(()=>{
  if(!isActive||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const ctx=gsap.context(()=>{
   gsap.fromTo('.archive-front',{opacity:.25,x:55*travel.current,rotation:8*travel.current,scale:.82},{opacity:1,x:0,rotation:0,scale:1,duration:.65,ease:'power3.out'});
   gsap.fromTo('.archive-current-copy',{y:14,opacity:0},{y:0,opacity:1,duration:.45,delay:.1,clearProps:'all'});
  },stage);
  return()=>ctx.revert();
 },[project.id,isActive]);
 const visible=projects.filter(p=>(filter===-1||p.discipline===filter)&&(`${name(p)} ${labels[p.discipline]}`).toLowerCase().includes(query.toLowerCase()));
 return <>
  <div className="archive-heading"><KineticTitle first={es?'En':'In'} second={es?'juego.':'play.'} variant="work"/><div className="archive-tools"><button onClick={e=>open('index',e.currentTarget)}>{es?'Ver todos':'View all'} <span>24 <InlineIcon kind="arrow"/></span></button><button className="archive-lab-link" onClick={e=>open('lab',e.currentTarget)}>{es?'Laboratorio':'Laboratory'} <PieceIcon index={0}/></button></div></div>
  <div className="archive-filters" role="group" aria-label={es?'Filtrar proyectos':'Filter projects'}>{[es?'Todo':'All',...labels].map((label,i)=><button key={label} aria-pressed={filter===i-1} onClick={()=>selectFilter(i-1)}>{label}<span className="archive-filter-icon"><InlineIcon kind="arrow"/></span></button>)}</div>
  <div className="archive-stage" ref={stage} role="group" tabIndex={0} aria-label={es?'Explorador de proyectos. Usa las flechas izquierda y derecha.':'Project explorer. Use left and right arrows.'}
   onKeyDown={e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();e.stopPropagation();step(e.key==='ArrowRight'?1:-1);}}}
   onPointerDown={e=>{if((e.target as Element).closest('.archive-current-copy button')||e.button!==0)return;suppressClick.current=false;gesture.current={x:e.clientX,y:e.clientY,pointer:e.pointerId};}}
   onPointerMove={e=>{const g=gesture.current;if(!g||g.pointer!==e.pointerId)return;if(Math.abs(e.clientX-g.x)>8&&Math.abs(e.clientX-g.x)>Math.abs(e.clientY-g.y)){suppressClick.current=true;e.currentTarget.setPointerCapture(e.pointerId);}}}
   onPointerUp={e=>{const g=gesture.current;gesture.current=null;if(!g||g.pointer!==e.pointerId)return;const dx=e.clientX-g.x,dy=e.clientY-g.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))step(dx<0?1:-1);}}
   onPointerCancel={()=>{gesture.current=null;}}>
   <button className="archive-front" onClick={e=>{if(e.detail===0||!suppressClick.current)open('detail',e.currentTarget);}} aria-label={`${es?'Abrir':'Open'} ${name(project)}`}><Artwork project={project}/><span className="archive-open-cue" aria-hidden="true"><InlineIcon kind="arrow"/></span></button>
   <div className="archive-current-copy" aria-live="polite"><span>{labels[project.discipline]} <span className="archive-sample">/ {es?'Provisional':'Placeholder'}</span></span><h3>{name(project)}</h3><button onClick={e=>open('detail',e.currentTarget)}>{es?'Abrir':'Open'} <InlineIcon kind="arrow"/></button></div>
  </div>
  <div className="archive-bottom"><button className="archive-scope" aria-pressed={all} onClick={()=>{setAll(!all);setCursor(0);}}>{all?(es?'Todos':'All projects'):(es?'Destacados':'Featured')} <span><InlineIcon kind="arrow"/></span></button><span className="archive-drag-hint">{es?'Arrastra para explorar':'Drag to explore'}</span><div className="archive-paging"><button onClick={()=>step(-1)} aria-label={es?'Proyecto anterior':'Previous project'}><InlineIcon kind="back"/></button><span aria-live="polite">{pad(index+1)} <span>/ {pad(pool.length)}</span></span><button onClick={()=>step(1)} aria-label={es?'Proyecto siguiente':'Next project'}><InlineIcon kind="next"/></button></div></div>
  <dialog className={`archive-dialog archive-dialog-${panel}`} ref={dialog} aria-labelledby="archive-dialog-title" onCancel={e=>{e.preventDefault();close();}} onClick={e=>{if(e.target===e.currentTarget)close();}}>
   <div className="archive-dialog-header"><h2 id="archive-dialog-title">{panel==='index'?(es?'El archivo.':'The archive.'):panel==='lab'?(es?'Laboratorio.':'Laboratory.'):name(project)}</h2><button onClick={close} aria-label={es?'Cerrar':'Close'}><InlineIcon kind="close"/></button></div>
   {panel==='index'&&<><label className="archive-search">{es?'Encontrar un proyecto':'Find a project'}<input value={query} onChange={e=>setQuery(e.target.value)} placeholder={es?'Nombre o disciplina…':'Name or discipline…'}/></label><div className="archive-index-filters" role="group" aria-label={es?'Filtrar archivo':'Filter archive'}>{[es?'Todo':'All',...labels].map((label,i)=><button key={label} aria-pressed={filter===i-1} onClick={()=>selectFilter(i-1)}>{label}<span className="archive-filter-icon"><InlineIcon kind="arrow"/></span></button>)}</div><div className="archive-index">{visible.map(p=><button key={p.id} onClick={()=>{setAll(true);setCursor(projects.filter(v=>filter===-1||v.discipline===filter).findIndex(v=>v.id===p.id));close();}}><Artwork project={p} mini/><span><strong>{name(p)}</strong><small>{labels[p.discipline]}</small></span><span aria-hidden="true"><InlineIcon kind="arrow"/></span></button>)}</div>{!visible.length&&<p>{es?'No hay resultados. Prueba otra búsqueda.':'No results. Try another search.'}</p>}<p className="archive-disclosure">{es?'24 proyectos provisionales · vista de prueba.':'24 placeholder projects · preview.'}</p></>}
   {panel==='detail'&&<div className="archive-detail-layout"><Artwork project={project}/><div className="archive-detail-copy"><span className="archive-detail-discipline">{labels[project.discipline]}</span><p>{es?'Vista provisional. Aquí irán las imágenes y la historia del proyecto.':'Placeholder. Project images and its story will go here.'}</p><button className="archive-detail-back" onClick={close}>{es?'Volver a explorar':'Back to explore'} <InlineIcon kind="back"/></button></div></div>}
   {panel==='lab'&&<><div className="archive-index-filters" role="group" aria-label={es?'Elegir experimento':'Choose experiment'}>{labels.map((label,i)=><button key={label} aria-pressed={lab===i} onClick={()=>setLab(i)}>{label}</button>)}</div><div className="gallery-play archive-lab"><Experiment key={lab} index={lab} lang={lang}/></div><p className="archive-disclosure">{es?'Experimentos de muestra.':'Sample experiments.'}</p></>}
  </dialog>
 </>;
}
