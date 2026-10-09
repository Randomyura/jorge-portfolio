import {PieceIcon} from './PieceIcon';
import React, {useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import gsap from 'gsap';
import './playground.css';
import './atelier.css';
import './lab.css';
import {LivingField} from './Experiments';
import {ProfilePlay,ContactPlay} from './NextScreens';
import './next-screens.css';
import {Navigation} from './Navigation';
import {KineticTitle} from './KineticTitle';
import {PieceNavigation} from './PieceNavigation';
import {screenMotion,type TransitionOrigin} from './screenMotion';
import './piece-motion.css';
import {HeaderControls} from './HeaderControls';
import {Footer} from './Footer';
import './refinements.css';
import {ProjectArchive} from './ProjectArchive';
type Lang='es'|'en';
const words={es:{work:'Proyectos',about:'Sobre mí',hello:'Hablemos',hint:'Elige una pieza. O sigue con scroll.',title:'Fuera del',second:'molde.',intro:'Gráfico. Web. App. 3D.',selected:'Cosas que he',made:'puesto en juego.',demo:'Conceptos de muestra · proyectos reales pendientes',bio:'Soy Jorge Sunyer Guirado. Me interesa lo que pasa cuando el diseño y el código dejan de ir por separado. Trabajo en diseño gráfico, web, app y 3D: distintas herramientas para dar forma a una idea.',cta:'¿Y si probamos',cta2:'algo distinto?',note:'Contacto real pendiente de configurar',reset:'Otra vez',close:'Cerrar',drag:'Pieza interactiva. Usa las flechas para moverla; Enter para girarla.',detail:'Este experimento es una muestra interactiva para explorar el portafolio, no un encargo real.'},en:{work:'Work',about:'About me',hello:'Let’s talk',hint:'Choose a piece. Or keep scrolling.',title:'Beyond the',second:'expected.',intro:'Graphic. Web. App. 3D.',selected:'Things I have',made:'put into play.',demo:'Sample concepts · real projects to be added',bio:'I’m Jorge Sunyer Guirado. I’m interested in what happens when design and code stop being separate. I work across graphic, web, app and 3D design: different tools to give an idea its shape.',cta:'What if we try',cta2:'something different?',note:'Real contact to be configured',reset:'Play again',close:'Close',drag:'Interactive piece. Use arrow keys to move it; Enter to rotate it.',detail:'This experiment is an interactive portfolio sample, not a client commission.'}};
function App(){
 const [lang,setLang]=useState<Lang>(()=>localStorage.getItem('jorge-language')==='en'?'en':'es');
 const [dark,setDark]=useState(()=>localStorage.getItem('jorge-theme')==='dark');
 const [activeScreen,setActiveScreen]=useState(()=>['home','work','about','contact'].includes(location.hash.slice(1))?location.hash.slice(1):'home');
 const page=useRef<HTMLDivElement>(null);
 const t=words[lang];
 useEffect(()=>{document.documentElement.lang=lang;localStorage.setItem('jorge-language',lang);},[lang]);
 useEffect(()=>{localStorage.setItem('jorge-theme',dark?'dark':'light');document.querySelector('meta[name="theme-color"]')?.setAttribute('content',dark?'#15171c':'#eeede8');},[dark]);
 useEffect(()=>{const title=activeScreen==='home'?'Creative Developer':activeScreen==='work'?t.work:activeScreen==='about'?t.about:t.hello;document.title=`Jorge Sunyer Guirado — ${title}`;},[activeScreen,lang]);
 const languageMotion=useRef<gsap.core.Timeline|null>(null);
 useEffect(()=>()=>{languageMotion.current?.kill();},[]);
 useEffect(()=>{
  const mm=gsap.matchMedia();mm.add('(prefers-reduced-motion: no-preference)',()=>{const ctx=gsap.context(()=>{gsap.from('.toy',{scale:0,rotation:-70,duration:.9,stagger:.12,ease:'back.out(1.5)',delay:.3});},page);return()=>ctx.revert();});return()=>mm.revert();
 },[]);
 const motion=()=>!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const transition=useRef<HTMLDivElement>(null),navigating=useRef(false);
 const screenId=useRef('home'),navigateRef=useRef<(id:string)=>void>(()=>{});
 const navigationTween=useRef<gsap.core.Timeline|null>(null);
 const navigate=(id:string,origin?:TransitionOrigin)=>{
  const section=document.getElementById(id),outgoing=document.getElementById(screenId.current);
  if(!section||!outgoing||navigating.current||id===screenId.current)return;
  const open=()=>{page.current?.querySelectorAll<HTMLElement>('main>section').forEach(panel=>{const shown=panel.id===id;panel.inert=!shown;panel.style.visibility=shown?'visible':'hidden';panel.setAttribute('aria-hidden',String(!shown));});screenId.current=id;setActiveScreen(id);section.scrollTop=0;section.tabIndex=-1;section.focus({preventScroll:true});history.replaceState(null,'','#'+id);};
  if(!motion()){open();return;}
  navigating.current=true;
  navigationTween.current=screenMotion({id,outgoing,incoming:section,overlay:transition.current!,open,origin,complete:()=>{navigating.current=false;}});
 };
 navigateRef.current=navigate;
 const changeLanguage=(next:Lang)=>{if(next===lang||navigating.current)return;languageMotion.current?.kill();const main=page.current!.querySelector('main')!;if(!motion()){setLang(next);return;}navigating.current=true;languageMotion.current=gsap.timeline({onComplete:()=>{navigating.current=false;}}).to(main,{opacity:.3,filter:'blur(3px)',duration:.16,ease:'power2.in'}).call(()=>setLang(next)).to(main,{opacity:1,filter:'blur(0px)',duration:.3,ease:'power2.out',clearProps:'opacity,filter'});};
 useEffect(()=>{
  const container=page.current!;
  const panels=Array.from(container.querySelectorAll<HTMLElement>('main>section'));
  const ids=panels.map(p=>p.id);
  const initial=ids.includes(location.hash.slice(1))?location.hash.slice(1):'home';screenId.current=initial;
  // Keep the fixed-screen class declared in JSX across theme updates.
  panels.forEach(panel=>{panel.tabIndex=-1;panel.inert=panel.id!==initial;panel.style.visibility=panel.id===initial?'visible':'hidden';panel.setAttribute('aria-hidden',String(panel.id!==initial));});
  let lastWheel=0,total=0,waitForPause=false,touchY=0,touchAtEdge=false;
  const edge=(direction:number)=>{const panel=document.getElementById(screenId.current)!;return panel.id==='home'||(direction>0?panel.scrollTop+panel.clientHeight>=panel.scrollHeight-3:panel.scrollTop<=2);};
  const step=(direction:number)=>{const id=ids[ids.indexOf(screenId.current)+direction];if(id){waitForPause=true;navigateRef.current(id);}};
  const wheel=(e:WheelEvent)=>{
   if(e.ctrlKey||document.querySelector('dialog[open]'))return;
   if(container.dataset.pieceBusy==='true'){e.preventDefault();return;}
   const direction=Math.sign(e.deltaY);if(!direction)return;
   if(!navigating.current&&!edge(direction)){total=0;return;}
   e.preventDefault();const now=performance.now();
   if(navigating.current){lastWheel=now;total=0;return;}
   if(waitForPause&&now-lastWheel<180){lastWheel=now;return;}
   waitForPause=false;if(now-lastWheel>180)total=0;lastWheel=now;
   total+=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?window.innerHeight:1);
   if(Math.abs(total)>65){total=0;step(direction);}
  };
  const click=(e:MouseEvent)=>{const link=(e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');if(!link)return;const id=link.hash.slice(1);if(ids.includes(id)){e.preventDefault();navigateRef.current(id);}else if(id==='main'){e.preventDefault();document.getElementById(screenId.current)?.focus();}};
  const key=(e:KeyboardEvent)=>{if(container.dataset.pieceBusy==='true'||document.querySelector('dialog[open]')||(e.target as Element).closest('button,a,summary,input,textarea,select,[role=slider],[contenteditable=true]')||e.ctrlKey||e.metaKey||e.altKey)return;const d=['ArrowDown','PageDown',' '].includes(e.key)?(e.shiftKey?-1:1):['ArrowUp','PageUp'].includes(e.key)?-1:0;if(d&&edge(d)){e.preventDefault();step(d);}if(e.key==='Home'||e.key==='End'){e.preventDefault();navigateRef.current(e.key==='Home'?ids[0]:ids[ids.length-1]);}};
  const start=(e:TouchEvent)=>{touchY=e.touches[0].clientY;touchAtEdge=edge(1)||edge(-1);};
  const end=(e:TouchEvent)=>{if(container.dataset.pieceBusy==='true'||document.querySelector('dialog[open]')||(e.target as Element).closest('button,a,summary,.archive-stage,.sculpture-control,input,textarea,select,[contenteditable=true]'))return;const dy=touchY-e.changedTouches[0].clientY;if(touchAtEdge&&Math.abs(dy)>65&&edge(Math.sign(dy)))step(Math.sign(dy));};
  const hash=()=>{const id=location.hash.slice(1);if(ids.includes(id))navigateRef.current(id);};
  container.addEventListener('wheel',wheel,{passive:false});container.addEventListener('click',click);container.addEventListener('touchstart',start,{passive:true});container.addEventListener('touchend',end,{passive:true});window.addEventListener('keydown',key);window.addEventListener('hashchange',hash);
  return()=>{navigationTween.current?.kill();container.removeEventListener('wheel',wheel);container.removeEventListener('click',click);container.removeEventListener('touchstart',start);container.removeEventListener('touchend',end);window.removeEventListener('keydown',key);window.removeEventListener('hashchange',hash);panels.forEach(p=>{p.inert=false;p.removeAttribute('aria-hidden');p.style.removeProperty('visibility');});};
 },[]);
 return <div className={`play-site fixed-screens ${dark?'dark':''}`} data-screen={activeScreen} ref={page}>
 <div className="navigation-transition spatial-transition" ref={transition} aria-hidden="true"><div className="transition-orb"/><div className="transition-turn"/><div className="transition-fold transition-fold-top"/><div className="transition-fold transition-fold-bottom"/></div>
 <a className="skip" href="#main">{lang==='es'?'Saltar al contenido':'Skip to content'}</a>
 <header><a className="signature" href="#home">Jorge Sunyer Guirado<span>Creative Developer</span></a><Navigation lang={lang} labels={[t.work,t.about,t.hello]} screen={activeScreen}/><HeaderControls lang={lang} dark={dark} onTheme={()=>setDark(!dark)} onLanguage={changeLanguage}/></header>
 <main id="main"><section className="hero" id="home"><LivingField/><div className="hero-stamp" aria-hidden="true"><span>INDEPENDENT</span><b><PieceIcon index={1}/></b><span>DESIGN PLAYGROUND</span></div><div className="hero-kicker"><span>DESIGN + CODE + A LITTLE CHAOS</span><span>PORTFOLIO / 2026</span></div><KineticTitle first={t.title} second={t.second} variant="home" level={1}/><PieceNavigation lang={lang} labels={[t.work,t.about,t.hello]} intro={t.intro} hint={t.hint} isActive={activeScreen==='home'} onNavigate={navigate}/></section>
 <section className="work archive-screen" id="work"><LivingField variant="work"/><ProjectArchive lang={lang} isActive={activeScreen==='work'}/></section>
 <section className="about perspective-screen" id="about"><LivingField variant="about"/><div className="gallery-title"><KineticTitle first={lang==='es'?'Cruzar':'Fresh'} second={lang==='es'?'miradas.':'perspectives.'} variant="about"/></div><ProfilePlay lang={lang}/></section>
 <section className="contact letter-screen" id="contact"><LivingField variant="contact"/><div className="gallery-title"><KineticTitle first={lang==='es'?'Lo que':'What comes'} second={lang==='es'?'viene.':'next.'} variant="contact"/><p className="letter-intro">{lang==='es'?'Empieza con una idea.':'It starts with an idea.'}</p></div><ContactPlay lang={lang}/></section></main>
 <Footer lang={lang} screen={activeScreen}/>
 </div>;
}
const appRoot=createRoot(document.getElementById('root')!);
appRoot.render(<React.StrictMode><App/></React.StrictMode>);
if(import.meta.hot)import.meta.hot.dispose(()=>appRoot.unmount());

// playground v2














