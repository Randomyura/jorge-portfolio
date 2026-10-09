import gsap from 'gsap';
export type TransitionOrigin={x:number,y:number};
export function screenMotion({id,outgoing,incoming,overlay,open,complete,origin}:{id:string,outgoing:HTMLElement,incoming:HTMLElement,overlay:HTMLElement,open:()=>void,complete:()=>void,origin?:TransitionOrigin}){
 const orb=overlay.querySelector('.transition-orb'),turn=overlay.querySelector('.transition-turn'),folds=overlay.querySelectorAll('.transition-fold');
 const timeline=gsap.timeline({onComplete:complete});
 timeline.set(overlay,{visibility:'visible'}).set([orb,turn,...folds],{visibility:'hidden'});
 const reveal=()=>{open();gsap.set(outgoing,{clearProps:'transform,opacity'});};
 if(id==='work'){
  const point=origin?`${origin.x}px ${origin.y}px`:'50% 58%';
  timeline.set(orb,{visibility:'visible',clipPath:`circle(0% at ${point})`})
   .to(orb,{clipPath:`circle(150% at ${point})`,duration:.6,ease:'power3.inOut'})
   .call(reveal).to(orb,{clipPath:'circle(0% at 78% 48%)',duration:.6,ease:'power3.inOut'})
   .fromTo(incoming.querySelector('.archive-stage')??incoming.querySelector('.gallery-play'),{scale:.75,opacity:0},{scale:1,opacity:1,duration:.8,ease:'power3.out',clearProps:'transform,opacity'},.65);
 }else if(id==='about'){
  timeline.set(turn,{visibility:'visible',rotationY:-90,transformOrigin:'left center',opacity:1})
   .to(outgoing,{rotationY:8,scale:.96,opacity:.45,duration:.42,ease:'power2.in'},0)
   .to(turn,{rotationY:0,duration:.5,ease:'power3.inOut'},0)
   .call(reveal).set(turn,{transformOrigin:'right center'})
   .to(turn,{rotationY:90,duration:.6,ease:'power3.inOut'})
   .fromTo(incoming.querySelector('.profile-play'),{rotationY:-18,x:35,opacity:0},{rotationY:0,x:0,opacity:1,duration:.8,ease:'power3.out',clearProps:'transform,opacity'},.58);
 }else if(id==='contact'){
  timeline.set(folds,{visibility:'visible'})
   .fromTo(folds[0],{yPercent:-100},{yPercent:0,duration:.52,ease:'power3.inOut'},0)
   .fromTo(folds[1],{yPercent:100},{yPercent:0,duration:.52,ease:'power3.inOut'},.05)
   .call(reveal).set(folds[0],{transformOrigin:'top center'}).set(folds[1],{transformOrigin:'bottom center'})
   .to(folds[0],{rotationX:-100,opacity:0,duration:.65,ease:'power3.inOut'},.6)
   .to(folds[1],{yPercent:100,duration:.65,ease:'power3.inOut'},.6)
   .fromTo(incoming.querySelector('.contact-play'),{y:40,opacity:0},{y:0,opacity:1,duration:.75,ease:'power3.out',clearProps:'transform,opacity'},.7);
 }else{
  timeline.to(outgoing,{scale:1.04,opacity:0,duration:.32,ease:'power2.in'}).call(reveal)
   .fromTo(incoming,{scale:.97,opacity:0},{scale:1,opacity:1,duration:.65,ease:'power3.out',clearProps:'transform,opacity'});
 }
 timeline.set(overlay,{visibility:'hidden'}).set([orb,turn,...folds],{clearProps:'all'});
 return timeline;
}
