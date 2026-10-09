import type {CSSProperties} from 'react';
import './discipline-object.css';

function Extrusion({text,className=''}:{text:string;className?:string}){
 return <span className={`object-extrusion ${className}`}>{Array.from({length:10},(_,i)=><span key={i} className={i===9?'extrusion-front':'extrusion-side'} style={{'--depth':`${(i-9)*1.5}px`} as CSSProperties}>{text}</span>)}</span>;
}
export function DisciplineObject({discipline}:{discipline:number}){
 return <div className={`discipline-object discipline-${discipline}`} aria-hidden="true"
  onPointerMove={e=>{if(e.pointerType!=='mouse'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--object-rx',`${-(e.clientY-r.top-r.height/2)/r.height*16}deg`);e.currentTarget.style.setProperty('--object-ry',`${(e.clientX-r.left-r.width/2)/r.width*20}deg`);}}
  onPointerLeave={e=>{e.currentTarget.style.setProperty('--object-rx','0deg');e.currentTarget.style.setProperty('--object-ry','0deg');}}>
  <span className="object-floor"/>
  <div className="object-tilt"><div className="object-float">
   {discipline===0&&<div className="graphic-object"><span className="graphic-swatch swatch-back"/><span className="graphic-swatch swatch-front"/><Extrusion text="Aa" className="graphic-letter"/></div>}
   {discipline===1&&<div className="web-object"><Extrusion text="https://"/><span className="web-cursor">↖</span></div>}
   {discipline===2&&<div className="app-object"><span className="phone-depth"/><div className="phone-screen"><span className="phone-camera"/><span className="phone-greeting">Hello.</span><span className="phone-tile"><span>✳</span></span><span className="phone-row"><i/><i/></span><span className="phone-action">↗</span></div></div>}
   {discipline===3&&<div className="spatial-object"><span className="spatial-face face-front"/><span className="spatial-face face-back"/><span className="spatial-face face-left"/><span className="spatial-face face-right"/><span className="spatial-face face-top"/><span className="spatial-face face-bottom"/><span className="spatial-core">✳</span></div>}
  </div></div>
 </div>;
}
