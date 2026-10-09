import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {PieceIcon} from './PieceIcon';

export function LivingField({variant='home'}:{variant?:'home'|'work'|'about'|'contact'}){
 const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const el=canvas.current!,ctx=el.getContext('2d');if(!ctx)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),section=el.closest('section')!;
  let width=0,height=0,frame=0,t=0,last=0;
  const pointer={x:-1000,y:-1000,targetX:-1000,targetY:-1000};
  let signal='#2349dc',dark=false;
  const theme=()=>{signal=getComputedStyle(section).getPropertyValue('--signal').trim()||'#2349dc';dark=!!section.closest('.dark');};theme();
  const active=()=>!document.hidden&&section.getAttribute('aria-hidden')!=='true';
  const paint=(delta:number)=>{
   ctx.clearRect(0,0,width,height);t+=reduced.matches?0:Math.min(delta,.08)*.36;
   pointer.x+=(pointer.targetX-pointer.x)*.12;pointer.y+=(pointer.targetY-pointer.y)*.12;
   if(variant!=='home'){
    const px=pointer.x<0?.5:Math.max(0,Math.min(1,pointer.x/width)),py=pointer.y<0?.5:Math.max(0,Math.min(1,pointer.y/height));
    const unit=Math.min(width,height);
    if(variant==='work'){
     // Broad translucent fragments drift past one another, opening around the cursor.
     for(let i=0;i<6;i++){
      const phase=t*.7+i*1.37,baseX=width*(.12+(i%3)*.36)+Math.sin(phase)*unit*.045,baseY=height*(.22+Math.floor(i/3)*.55)+Math.cos(phase)*unit*.045;
      const dx=pointer.x-baseX,dy=pointer.y-baseY,force=reduced.matches?0:Math.max(0,1-Math.hypot(dx,dy)/(unit*.5));
      const size=unit*(.2+(i%3)*.025);
      ctx.save();ctx.translate(baseX-dx*force*.16,baseY-dy*force*.16);ctx.rotate(-.45+i*.3+Math.sin(phase)*.12);ctx.globalAlpha=dark?.075:.055;ctx.fillStyle=signal;
      ctx.beginPath();ctx.moveTo(-size,-size*.5);ctx.quadraticCurveTo(-size*.8,-size*.7,size*.55,-size*.45);ctx.lineTo(size,size*.18);ctx.quadraticCurveTo(size*.9,size*.5,-size*.5,size*.58);ctx.closePath();ctx.fill();ctx.restore();
     }
    }else if(variant==='about'){
     // Different translucent lenses overlap as the viewpoint changes.
     for(let i=0;i<4;i++){
      const phase=t*.8+i*1.7,x=width*(.28+(i%2)*.44)+(px-.5)*unit*(i%2?-.14:.14)+Math.sin(phase)*unit*.06,y=height*(.32+Math.floor(i/2)*.38)+(py-.5)*unit*(i%2?.12:-.12);
      const radius=unit*(.21+i*.018),gradient=ctx.createRadialGradient(x-radius*.22,y-radius*.3,0,x,y,radius);
      gradient.addColorStop(0,signal);gradient.addColorStop(.62,signal);gradient.addColorStop(1,'transparent');
      ctx.save();ctx.globalAlpha=dark?.10:.065;ctx.fillStyle=gradient;ctx.beginPath();ctx.ellipse(x,y,radius,radius*.78,Math.sin(phase)*.4,0,Math.PI*2);ctx.fill();ctx.restore();
     }
    }else{
     // Soft paper-like surfaces fold gently towards the pointer, echoing the letter.
     for(let i=0;i<5;i++){
      const phase=t*.55+i*1.8,x=width*(.1+i*.21)+(px-.5)*unit*.065,y=height*(.26+(i%3)*.23)+Math.sin(phase)*unit*.065,size=unit*(.17+(i%2)*.05);
      ctx.save();ctx.translate(x,y);ctx.rotate(-.65+Math.cos(phase)*.22+(px-.5)*.18);ctx.globalAlpha=dark?.065:.05;ctx.fillStyle=signal;
      ctx.beginPath();ctx.moveTo(-size,-size*.55);ctx.lineTo(size*.9,-size*.42);ctx.quadraticCurveTo(size*.65,size*.2,-size*.35,size*.7);ctx.quadraticCurveTo(-size*.8,size*.4,-size,-size*.55);ctx.fill();
      ctx.globalAlpha=dark?.035:.025;ctx.beginPath();ctx.moveTo(-size,-size*.55);ctx.lineTo(size*.9,-size*.42);ctx.lineTo(size*.1,size*.08);ctx.closePath();ctx.fill();ctx.restore();
     }
    }
    return;
   }
   for(let i=0;i<7;i++){
    const phase=i*.48+t,x=width*(.5+.34*Math.sin(phase)),y=height*(.5+.28*Math.cos(phase*1.4));
    const dx=pointer.x-x,dy=pointer.y-y,distance=Math.hypot(dx,dy),force=reduced.matches?0:Math.max(0,1-distance/260);
    ctx.save();ctx.translate(x-dx*force*.25,y-dy*force*.25);ctx.rotate(phase*.7);
    const radius=Math.max(35,width*.075)+i*3,gradient=ctx.createRadialGradient(-radius*.3,-20,0,0,0,radius*1.3);
    gradient.addColorStop(0,i%3===0?'#526dc030':'#8490ad35');gradient.addColorStop(1,'#c7bdf000');ctx.fillStyle=gradient;
    ctx.beginPath();ctx.ellipse(0,0,Math.max(25,width*.075)+i*3,35+i*7,phase,0,Math.PI*2);ctx.fill();ctx.restore();
   }
  };
  const draw=(now:number)=>{frame=0;if(!active())return;if(!last||now-last>=32){paint(last?(now-last)/1000:0);last=now;}if(!reduced.matches)frame=requestAnimationFrame(draw);};
  const resume=()=>{cancelAnimationFrame(frame);frame=0;last=0;if(active())frame=requestAnimationFrame(draw);};
  const resize=new ResizeObserver(()=>{const r=el.getBoundingClientRect();width=r.width;height=r.height;const d=Math.min(devicePixelRatio,2);el.width=width*d;el.height=height*d;ctx.setTransform(d,0,0,d,0,0);resume();});resize.observe(el);
  const observer=new MutationObserver(resume);observer.observe(section,{attributes:true,attributeFilter:['aria-hidden']});
  const themeObserver=new MutationObserver(()=>{theme();resume();});const site=section.closest('.play-site');if(site)themeObserver.observe(site,{attributes:true,attributeFilter:['class']});
  const move=(e:PointerEvent)=>{if(e.pointerType!=='mouse'||reduced.matches||!active())return;const r=el.getBoundingClientRect();pointer.targetX=e.clientX-r.left;pointer.targetY=e.clientY-r.top;};
  const leave=(e:PointerEvent)=>{if(!e.relatedTarget){pointer.targetX=-1000;pointer.targetY=-1000;}};
  window.addEventListener('pointermove',move);window.addEventListener('pointerout',leave);document.addEventListener('visibilitychange',resume);reduced.addEventListener('change',resume);resume();
  return()=>{cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();themeObserver.disconnect();window.removeEventListener('pointermove',move);window.removeEventListener('pointerout',leave);document.removeEventListener('visibilitychange',resume);reduced.removeEventListener('change',resume);};
 },[variant]);
 return <canvas ref={canvas} className={`living-field ${variant!=='home'?`screen-atmosphere atmosphere-${variant}`:''}`} aria-hidden="true"/>;
}

export function Experiment({index,lang}:{index:number,lang:'es'|'en'}){
 const [value,setValue]=useState(45),[taps,setTaps]=useState(0),[rotation,setRotation]=useState({x:-20,y:30});
 const drag=useRef<{x:number,y:number,rx:number,ry:number}|null>(null);
 const es=lang==='es';
 return <div className={`experiment experiment-${index}`}>
  <div className="experiment-stage">
   {index===0&&<div className="variable-mark" style={{gap:value*.5,transform:`rotate(${(value-50)*.16}deg)`}}><span style={{transform:`scaleX(${.55+value/80})`}}>F</span><span style={{borderRadius:`${value}%`,transform:`rotate(${value*1.8}deg)`}}><PieceIcon index={0}/></span></div>}
   {index===1&&<div className="orbit-system" style={{'--orbit-speed':`${14-value*.12}s`,'--orbit-size':`${.7+value/140}`} as CSSProperties}><strong>OFF<br/><em>ORBIT</em></strong>{['↗','◒','✳'].map((s,i)=><span className={`satellite satellite-${i}`} key={s}><PieceIcon index={[1,2,0][i]}/></span>)}</div>}
   {index===2&&<button className="play-app" onClick={()=>setTaps(n=>n+1)}><small>{taps<6?(es?'Toca para componer':'Tap to compose'):(es?'Sigue tocando para transformar':'Keep tapping to transform')}</small><div className="app-bubbles">{Array.from({length:Math.min(taps+3,9)},(_,i)=><span key={i} style={{background:['#8fa9ff','#d9dde6','#a9b4ce'][i%3],transform:`rotate(${(taps+i)*23}deg)`,borderRadius:`${15+(taps+i)%4*15}%`}}><PieceIcon index={i%3}/></span>)}</div><strong>{String(taps).padStart(2,'0')} / PLAY</strong></button>}
   {index===3&&<div className="sculpture-control" role="slider" tabIndex={0} aria-label={es?'Girar escultura':'Rotate sculpture'} aria-valuemin={0} aria-valuemax={360} aria-valuenow={Math.round((rotation.y%360+360)%360)} onKeyDown={e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();setRotation(r=>({x:r.x+(e.key==='ArrowUp'?-15:e.key==='ArrowDown'?15:0),y:r.y+(e.key==='ArrowLeft'?-15:e.key==='ArrowRight'?15:0)}));}}} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);drag.current={x:e.clientX,y:e.clientY,rx:rotation.x,ry:rotation.y};}} onPointerMove={e=>{if(drag.current)setRotation({x:drag.current.rx-(e.clientY-drag.current.y)*.6,y:drag.current.ry+(e.clientX-drag.current.x)*.6});}} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}}><div className="sculpture" style={{transform:`rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`}}>{Array.from({length:9},(_,i)=><span key={i} style={{transform:`translateZ(${(i-4)*18}px) rotateZ(${i*8}deg)`}}/>)}</div><small>{es?'Arrastra para girar · o usa las flechas':'Drag to rotate · or use arrow keys'}</small></div>}
  </div>
  {index<2?<label className="experiment-slider">{index===0?(es?'De rígido a líquido':'From rigid to liquid'):(es?'Cambia la órbita':'Change the orbit')}<input type="range" min="0" max="100" value={value} onChange={e=>setValue(Number(e.target.value))}/></label>:index===2&&taps>0?<button className="experiment-reset" onClick={()=>setTaps(0)}>{es?'Limpiar composición':'Clear composition'} ↺</button>:null}
 </div>;
}




