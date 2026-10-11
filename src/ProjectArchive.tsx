import {useEffect,useRef,useState} from 'react';
import gsap from 'gsap';
import {SprinterStory,sprinterImage} from './SprinterStory';
import {App156Story,app156Image} from './App156Story';
import {SelectedStory,selectedProjects,selectedImage} from './SelectedStory';
import {BufaloStory,bufaloImage} from './BufaloStory';
import {DesignStory,designImage} from './DesignStory';
import {FlyerStory,flyerImage} from './FlyerStory';
import {StargyStory,stargyCover} from './StargyStory';
import {KineticTitle} from './KineticTitle';
import {HermesStory,hermesImage} from './HermesStory';
import {InlineIcon} from './PieceIcon';
import './project-archive.css';
import './hermes.css';

type Lang='es'|'en';
type Category='all'|'design'|'app'|'web'|'3d';
const projectRoute=()=>location.hash==='#work/sprinter'?'sprinter':location.hash==='#work/app156'?'app156':location.hash==='#work/hermes'?'hermes':location.hash==='#work/stargy'?'stargy':location.hash==='#work/flyer'?'flyer':location.hash==='#work/design'?'design':location.hash==='#work/bufalo'?'bufalo':selectedProjects.find(p=>location.hash===`#work/${p.id}`)?.id??null;
export function ProjectArchive({lang,isActive}:{lang:Lang;isActive:boolean}){
 const es=lang==='es';
 const [detail,setDetail]=useState(projectRoute);
 const [category,setCategory]=useState<Category>('all');
 const categories:{id:Category;label:string;count:number}[]=[{id:'all',label:es?'Todo':'All',count:13},{id:'design',label:es?'Diseño':'Design',count:10},{id:'app',label:'App',count:1},{id:'web',label:'Web',count:1},{id:'3d',label:'3D',count:1}];
 const shows=(group:Category)=>category==='all'||category===group;
 const root=useRef<HTMLDivElement>(null),card=useRef<HTMLAnchorElement>(null);
 const returnProject=useRef('hermes');
 const openedHere=useRef(false),restoreFocus=useRef(false);
 useEffect(()=>{
  const sync=()=>{const next=projectRoute();if(!next&&restoreFocus.current){requestAnimationFrame(()=>root.current?.querySelector<HTMLAnchorElement>(`a[href="#work/${returnProject.current}"]`)?.focus({preventScroll:true}));restoreFocus.current=false;}setDetail(next);};
  window.addEventListener('hashchange',sync);return()=>window.removeEventListener('hashchange',sync);
 },[]);
 useEffect(()=>{
  if(!isActive)return;
  root.current?.closest('section')?.scrollTo(0,0);
  if(detail){root.current?.querySelector<HTMLElement>('.project-return')?.focus({preventScroll:true});}
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const ctx=gsap.context(()=>{gsap.fromTo('.project-reveal',{y:22,opacity:0},{y:0,opacity:1,duration:.65,stagger:.08,ease:'power3.out',clearProps:'all'});},root);
  return()=>ctx.revert();
 },[isActive,detail]);
 const back=()=>{restoreFocus.current=true;if(openedHere.current){openedHere.current=false;history.back();}else{location.hash='work';}};
 return <div className={`project-collection ${detail?'project-page':'project-list'} ${detail==='stargy'?'stargy-page':detail==='design'?'design-page':''}`} ref={root}>
  {detail?<>
   <div className="project-page-nav project-reveal"><button className="project-return" onClick={back}><InlineIcon kind="back"/>{es?'Todos los proyectos':'All projects'}</button><span>{detail==='stargy'?'002':detail==='flyer'?'003':detail==='design'?'004':detail==='bufalo'?'005':detail==='app156'?'012':detail==='sprinter'?'013':selectedProjects.find(p=>p.id===detail)?.number??'001'} / {detail==='bufalo'?'3D':detail==='app156'?'App':detail==='sprinter'?'Web':es?'Diseño':'Design'}</span></div>
   {detail==='sprinter'?<SprinterStory lang={lang}/>:detail==='app156'?<App156Story lang={lang}/>:detail==='stargy'?<StargyStory lang={lang}/>:detail==='flyer'?<FlyerStory lang={lang}/>:detail==='design'?<DesignStory lang={lang}/>:detail==='bufalo'?<BufaloStory lang={lang}/>:selectedProjects.some(p=>p.id===detail)?<SelectedStory id={detail} lang={lang}/>:<>
   <div className="project-page-heading project-reveal"><span className="project-kicker">{es?'Concepto académico · Adobe Illustrator':'Academic concept · Adobe Illustrator'}</span><h2>Hermès<span>Packaging Concept</span></h2></div>
   <figure className="project-hero project-reveal"><img src={hermesImage(17)} alt={es?'Propuesta de envase cosmético Hermès, caja y tapa sobre fondo blanco':'Hermès cosmetic packaging concept, box and lid on a white background'} width="1200" height="1200"/><figcaption>{es?'Envase, caja y representaciones 3D realizados en Illustrator.':'Container, box and 3D representations created in Illustrator.'}</figcaption></figure>
   <div className="project-story project-reveal"><HermesStory lang={lang}/></div>
   </>}
   <div className="project-page-end"><button className="project-return" onClick={back}><InlineIcon kind="back"/>{es?'Volver a proyectos':'Back to projects'}</button></div>
  </>:<>
   <div className="project-list-heading project-reveal"><KineticTitle first={es?'En':'In'} second={es?'juego.':'play.'} variant="work"/><span className="project-kicker">{es?'Selección de proyectos':'Selected work'} / 13</span></div>
   <div className="project-category-filters" role="group" aria-label={es?'Categorías de proyectos':'Project categories'}>{categories.map(c=><button key={c.id} aria-pressed={category===c.id} onClick={()=>setCategory(c.id)}>{c.label}<span>{c.count}</span></button>)}</div>
   {false&&<p className="project-empty" role="status">{es?'Todavía no hay proyectos publicados en esta categoría.':'There are no projects in this category yet.'}</p>}
   <div className="project-grid">
   {shows('web')&&<a className="project-card project-reveal sprinter-card" href="#work/sprinter" onClick={()=>{openedHere.current=true;returnProject.current='sprinter';}}><div className="project-card-media"><img src={sprinterImage('home')} alt={es?'Sprinter · propuesta de rediseño web':'Sprinter · website redesign concept'} style={{objectPosition:'top'}}/><span className="project-card-open">{es?'Ver proyecto':'View project'}<InlineIcon kind="arrow"/></span></div><div className="project-card-caption"><div><span className="project-kicker">013 / Web · Figma</span><h3>Sprinter <span>— {es?'Rediseño web':'Website redesign'}</span></h3></div><span className="project-card-arrow"><InlineIcon kind="arrow"/></span></div></a>}

    {shows('app')&&<a className="project-card project-reveal" href="#work/app156" onClick={()=>{openedHere.current=true;returnProject.current='app156';}}><div className="project-card-media"><img src={app156Image} alt={es?'App 156 · presentación del diseño en Figma':'App 156 · Figma design presentation'} width="1600" height="900"/><span className="project-card-open">{es?'Ver proyecto':'View project'}<InlineIcon kind="arrow"/></span></div><div className="project-card-caption"><div><span className="project-kicker">012 / App · Figma</span><h3>App 156 <span>— {es?'Donación de sangre':'Blood donation'}</span></h3></div><span className="project-card-arrow"><InlineIcon kind="arrow"/></span></div></a>}

    {shows('design')&&<>    <a className="project-card project-reveal" ref={card} href="#work/hermes" onClick={e=>{if(e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey){openedHere.current=true;returnProject.current='hermes';}}}>
     <div className="project-card-media"><img src={hermesImage(17)} alt={es?'Envase, caja y tapa del concepto Hermès sobre fondo blanco':'Hermès packaging concept with container, box and lid on white'} width="1200" height="1200"/><span className="project-card-open">{es?'Ver proyecto':'View project'}<InlineIcon kind="arrow"/></span></div>
     <div className="project-card-caption"><div><span className="project-kicker">001 / Graphic Design · Packaging</span><h3>Hermès <span>— Packaging Concept</span></h3></div><span className="project-card-arrow" aria-hidden="true"><InlineIcon kind="arrow"/></span></div>
    </a></>}
    {shows('design')&&<>    <a className="project-card project-reveal" href="#work/stargy" onClick={e=>{if(e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey){openedHere.current=true;returnProject.current='stargy';}}}>
     <div className="project-card-media"><img src={stargyCover} alt={es?'STARGY · lata roja con símbolo de flor de loto blanco':'STARGY · red can with a white lotus flower symbol'} width="1500" height="1000"/><span className="project-card-open">{es?'Ver proyecto':'View project'}<InlineIcon kind="arrow"/></span></div>
     <div className="project-card-caption"><div><span className="project-kicker">002 / {es?'Identidad visual':'Visual identity'}</span><h3>STARGY <span>— {es?'Manual de identidad':'Identity manual'}</span></h3></div><span className="project-card-arrow" aria-hidden="true"><InlineIcon kind="arrow"/></span></div>
    </a></>}
    {shows('design')&&<>    <a className="project-card project-reveal" href="#work/flyer" onClick={e=>{if(e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey){openedHere.current=true;returnProject.current='flyer';}}}>
     <div className="project-card-media flyer-card-media"><img src={flyerImage} alt={es?'Flyer STARGY · The Ultimate Party, fotografía de concierto y tipografía rosa':'STARGY flyer · The Ultimate Party, concert photograph and pink typography'} width="1132" height="1600"/><span className="project-card-open">{es?'Ver proyecto':'View project'}<InlineIcon kind="arrow"/></span></div>
     <div className="project-card-caption"><div><span className="project-kicker">003 / {es?'Diseño gráfico · Flyer':'Graphic design · Flyer'}</span><h3>The Ultimate Party <span>— STARGY</span></h3></div><span className="project-card-arrow" aria-hidden="true"><InlineIcon kind="arrow"/></span></div>
    </a></>}
    {shows('design')&&<>    <a className="project-card project-reveal" href="#work/design" onClick={e=>{if(e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey){openedHere.current=true;returnProject.current='design';}}}>
     <div className="project-card-media"><img src={designImage(1)} alt={es?'Identidad DESIGN con silueta de Barcelona y marcador de ubicación':'DESIGN identity with Barcelona skyline and a location pin'} width="1400" height="990"/><span className="project-card-open">{es?'Ver proyecto':'View project'}<InlineIcon kind="arrow"/></span></div>
     <div className="project-card-caption"><div><span className="project-kicker">004 / {es?'Identidad de app':'App identity'}</span><h3>DESIGN <span>— {es?'Barcelona e identidad':'Barcelona and identity'}</span></h3></div><span className="project-card-arrow" aria-hidden="true"><InlineIcon kind="arrow"/></span></div>
    </a></>}
    {shows('3d')&&<>    <a className="project-card project-reveal" href="#work/bufalo" onClick={e=>{if(e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey){openedHere.current=true;returnProject.current='bufalo';}}}>
     <div className="project-card-media"><img src={bufaloImage(10)} alt={es?'BÚFALO · caja envuelta en perspectiva':'BÚFALO · wrapped packaging in perspective'} width="1000" height="1000"/><span className="project-card-open">{es?'Ver proyecto':'View project'}<InlineIcon kind="arrow"/></span></div>
     <div className="project-card-caption"><div><span className="project-kicker">005 / 3D · Packaging</span><h3>BÚFALO <span>— Packaging Concept</span></h3></div><span className="project-card-arrow" aria-hidden="true"><InlineIcon kind="arrow"/></span></div>
    </a></>}
    {(shows('design')?selectedProjects:[]).map(p=><a key={p.id} className="project-card project-reveal" href={`#work/${p.id}`} onClick={()=>{openedHere.current=true;returnProject.current=p.id;}}><div className="project-card-media"><img src={selectedImage(p.id,p.id==='sherlock'?1:0)} alt={p.title}/><span className="project-card-open">{es?'Ver proyecto':'View project'}<InlineIcon kind="arrow"/></span></div><div className="project-card-caption"><div><span className="project-kicker">{p.number} / {es?p.categoryEs:p.categoryEn}</span><h3>{p.title}</h3></div><span className="project-card-arrow"><InlineIcon kind="arrow"/></span></div></a>)}
   </div>
  </>}
 </div>;
}
