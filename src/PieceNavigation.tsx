import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import gsap from 'gsap';
import type {TransitionOrigin} from './screenMotion';
import {PieceIcon,InlineIcon} from './PieceIcon';
const destinations=['work','about','contact'],symbols=['✳','↗','◒'];
type Props={lang:'es'|'en',labels:string[],intro:string,hint:string,isActive:boolean,onNavigate:(id:string,origin?:TransitionOrigin)=>void};
export function PieceNavigation({lang,labels,intro,hint,isActive,onNavigate}:Props){
 const [selected,setSelected]=useState<number|null>(null),[near,setNear]=useState(false),[snapping,setSnapping]=useState(false);
 const field=useRef<HTMLDivElement>(null),socket=useRef<HTMLSpanElement>(null),busy=useRef(false),snap=useRef<gsap.core.Tween|null>(null);
 const destination=useRef<HTMLDivElement>(null),lastSpot=useRef<{x:number,y:number}|null>(null);
 const [spot,setSpot]=useState<{x:number,y:number}|null>(null);
 useLayoutEffect(()=>{
  if(selected===null||!field.current||!destination.current)return;
  const place=()=>{
   const area=field.current!,target=destination.current!,w=target.offsetWidth,h=target.offsetHeight;
   const styles=getComputedStyle(area),dx=parseFloat(styles.getPropertyValue('--drift-x'))||24,dy=parseFloat(styles.getPropertyValue('--drift-y'))||32,caption=parseFloat(styles.getPropertyValue('--caption-space'))||36;
   // Reserve each piece's entire idle path and its caption, not just its current position.
   const occupied=Array.from(area.querySelectorAll<HTMLButtonElement>('.toy')).map(el=>({left:el.offsetLeft-dx-8,right:el.offsetLeft+el.offsetWidth+dx+8,top:el.offsetTop-8,bottom:el.offsetTop+el.offsetHeight+dy+caption}));
   const candidates:{x:number,y:number}[]=[];
   for(let y=8;y<=area.clientHeight-h-8;y+=8)for(let x=8;x<=area.clientWidth-w-8;x+=8){
    if(occupied.every(r=>x+w<r.left||x>r.right||y+h<r.top||y>r.bottom))candidates.push({x,y});
   }
   const previous=lastSpot.current;
   const fresh=previous?candidates.filter(p=>Math.hypot(p.x-previous.x,p.y-previous.y)>Math.min(100,area.clientWidth*.2)):candidates;
   const pool=fresh.length?fresh:candidates;
   // A reserved lower lane remains available on compact screens.
   const next=pool.length?pool[Math.floor(Math.random()*pool.length)]:{x:8+Math.random()*Math.max(0,area.clientWidth-w-16),y:Math.max(0,area.clientHeight-h-8)};
   lastSpot.current=next;setSpot(next);
  };
  place();let size=`${field.current.clientWidth}:${field.current.clientHeight}`;
  const observer=new ResizeObserver(()=>{if(!field.current)return;const nextSize=`${field.current.clientWidth}:${field.current.clientHeight}`;if(nextSize!==size){size=nextSize;place();}});observer.observe(field.current);
  return()=>observer.disconnect();
 },[selected,lang,isActive]);
 const drag=useRef<{el:HTMLButtonElement,id:number,x:number,y:number,baseX:number,baseY:number,wasSelected:boolean,moved:boolean}|null>(null);
 const motion=()=>!matchMedia('(prefers-reduced-motion: reduce)').matches;
 const dismissDestination=()=>{setSelected(null);setNear(false);setSnapping(false);setSpot(null);};
 const constrain=(el:HTMLButtonElement,x:number,y:number)=>{
  const bounds=field.current!.closest<HTMLElement>('.hero')!.getBoundingClientRect(),r=el.getBoundingClientRect();
  const baseX=r.left+r.width/2-Number(gsap.getProperty(el,'x')),baseY=r.top+r.height/2-Number(gsap.getProperty(el,'y'));
  return {x:Math.max(bounds.left+r.width/2+8-baseX,Math.min(bounds.right-r.width/2-8-baseX,x)),y:Math.max(bounds.top+r.height/2+8-baseY,Math.min(bounds.bottom-r.height/2-8-baseY,y))};
 };
 const cancelDrag=()=>{const d=drag.current;if(!d)return;drag.current=null;delete field.current?.closest<HTMLElement>('.play-site')?.dataset.pieceBusy;d.el.classList.remove('is-dragging');dismissDestination();gsap.to(d.el,{x:0,y:0,duration:motion()?.3:0,ease:'power3.out'});};
 useEffect(()=>{window.addEventListener('blur',cancelDrag);return()=>{window.removeEventListener('blur',cancelDrag);delete field.current?.closest<HTMLElement>('.play-site')?.dataset.pieceBusy;};},[]);
 const clear=()=>{snap.current?.kill();busy.current=false;delete field.current?.closest<HTMLElement>('.play-site')?.dataset.pieceBusy;drag.current=null;setSelected(null);setNear(false);setSnapping(false);gsap.set(field.current?.querySelectorAll('.toy')??[],{x:0,y:0,scale:1,rotation:0});};
 useEffect(()=>{if(!isActive)clear();},[isActive]);
 useEffect(()=>()=>{snap.current?.kill();},[]);
 const docking=(el:HTMLButtonElement)=>{
  if(busy.current||!socket.current)return;
  busy.current=true;setSnapping(true);setNear(true);
  const site=field.current!.closest<HTMLElement>('.play-site')!;site.dataset.pieceBusy='true';
  const r=el.getBoundingClientRect(),s=socket.current.getBoundingClientRect(),x=s.left+s.width/2,y=s.top+s.height/2;
  snap.current=gsap.to(el,{x:Number(gsap.getProperty(el,'x'))+x-r.left-r.width/2,y:Number(gsap.getProperty(el,'y'))+y-r.top-r.height/2,rotation:0,scale:s.width/el.offsetWidth,duration:motion()?.32:0,ease:'power3.out',onComplete:()=>{delete site.dataset.pieceBusy;busy.current=false;onNavigate(destinations[Number(el.dataset.piece)],{x,y});}});
 };
 const choose=(i:number,el:HTMLButtonElement)=>{if(busy.current)return;if(selected===i)docking(el);else{gsap.to(field.current!.querySelectorAll('.toy'),{x:0,y:0,duration:motion()?.3:0});setSelected(i);setNear(false);}};
 const reset=()=>{snap.current?.kill();busy.current=false;delete field.current!.closest<HTMLElement>('.play-site')!.dataset.pieceBusy;drag.current=null;setSelected(null);setNear(false);setSnapping(false);gsap.to(field.current!.querySelectorAll('.toy'),{x:0,y:0,scale:1,rotation:0,duration:motion()?.4:0,ease:'power3.out'});};
 return <><div ref={field} className={`playfield navigation-field piece-field ${selected!==null?'has-selection':''} ${snapping?'piece-snapping':''}`} aria-label={hint}>
  {symbols.map((symbol,i)=><button key={symbol} data-piece={i} className={`toy toy-${i} ${selected===i?'selected':''}`} aria-label={`${labels[i]}. ${lang==='es'?'Selecciona y arrastra a la silueta, o pulsa otra vez para abrir.':'Select and drag to the silhouette, or activate again to open.'}`} onClick={e=>{if(e.detail===0)choose(i,e.currentTarget);}}
   onPointerDown={e=>{if(busy.current||e.button!==0||!e.isPrimary)return;const el=e.currentTarget;field.current!.closest<HTMLElement>('.play-site')!.dataset.pieceBusy='true';gsap.killTweensOf(el);gsap.set(el,{scale:1});drag.current={el,id:e.pointerId,x:e.clientX,y:e.clientY,baseX:Number(gsap.getProperty(el,'x')),baseY:Number(gsap.getProperty(el,'y')),wasSelected:selected===i,moved:false};setSelected(i);setNear(false);el.setPointerCapture(e.pointerId);}}
   onPointerMove={e=>{const d=drag.current;if(!d||d.id!==e.pointerId||busy.current)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;if(Math.hypot(dx,dy)<6&&!d.moved)return;d.moved=true;d.el.classList.add('is-dragging');const r=d.el.getBoundingClientRect();let {x,y}=constrain(d.el,d.baseX+dx,d.baseY+dy);const baseCenterX=r.left+r.width/2-Number(gsap.getProperty(d.el,'x')),baseCenterY=r.top+r.height/2-Number(gsap.getProperty(d.el,'y'));const s=socket.current?.getBoundingClientRect();if(s){const sx=s.left+s.width/2-(baseCenterX+x),sy=s.top+s.height/2-(baseCenterY+y),distance=Math.hypot(sx,sy),radius=e.pointerType==='touch'?95:120;setNear(distance<radius*.65);if(distance<radius){const pull=(1-distance/radius)*.32;x+=sx*pull;y+=sy*pull;}}gsap.set(d.el,constrain(d.el,x,y));}}
   onPointerUp={e=>{const d=drag.current;if(!d||d.id!==e.pointerId)return;drag.current=null;delete field.current!.closest<HTMLElement>('.play-site')!.dataset.pieceBusy;d.el.classList.remove('is-dragging');if(!d.moved){if(d.wasSelected)docking(d.el);return;}const r=d.el.getBoundingClientRect(),s=socket.current?.getBoundingClientRect();if(s&&Math.hypot(r.left+r.width/2-s.left-s.width/2,r.top+r.height/2-s.top-s.height/2)<s.width*.75+18)docking(d.el);else{dismissDestination();gsap.to(d.el,{x:0,y:0,duration:motion()?.4:0,ease:'power3.out'});}}}
   onPointerCancel={cancelDrag} onLostPointerCapture={cancelDrag}
   onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();reset();}else if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(i,e.currentTarget);}else if(e.key.startsWith('Arrow')){e.preventDefault();setSelected(i);gsap.set(e.currentTarget,constrain(e.currentTarget,Number(gsap.getProperty(e.currentTarget,'x'))+(e.key==='ArrowRight'?20:e.key==='ArrowLeft'?-20:0),Number(gsap.getProperty(e.currentTarget,'y'))+(e.key==='ArrowDown'?20:e.key==='ArrowUp'?-20:0)));}}}>
   <span className="toy-object"><span className="toy-symbol"><PieceIcon index={i}/></span></span><small>{labels[i]}</small>
  </button>)}
  <div ref={destination} className="piece-destination roaming-destination" style={{left:spot?.x??8,top:spot?.y??8,visibility:selected!==null&&spot?'visible':'hidden'}} aria-live="polite">{selected!==null&&<button key={selected} className={`piece-slot slot-${selected} ${near?'is-near':''}`} onClick={()=>{const el=field.current!.querySelector<HTMLButtonElement>(`[data-piece="${selected}"]`);if(el)docking(el);}} aria-label={`${lang==='es'?'Abrir':'Open'} ${labels[selected]}`}><span ref={socket} data-socket className="piece-silhouette" aria-hidden="true"><PieceIcon index={selected}/></span><span className="piece-slot-label">{near?(lang==='es'?'Aquí':'Here'):labels[selected]} <span aria-hidden="true"><InlineIcon kind="arrow"/></span></span></button>}</div>
 </div><div className="hero-bottom"><p>{intro}</p><div><span>{selected!==null?(lang==='es'?'Arrastra a su silueta. O vuelve a tocarla.':'Drag to its silhouette. Or tap it again.'):hint}</span>{selected!==null&&<button className="reset" onClick={reset}>{lang==='es'?'Otra vez':'Play again'} <InlineIcon kind="reset"/></button>}</div><a className="scroll-link" href="#work" aria-label={labels[0]}><svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg></a></div></>;
}
