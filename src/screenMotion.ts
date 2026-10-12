import gsap from 'gsap';
export type TransitionOrigin={x:number,y:number};
export function screenMotion({id,outgoing,incoming,overlay,open,complete,origin}:{id:string,outgoing:HTMLElement,incoming:HTMLElement,overlay:HTMLElement,open:()=>void,complete:()=>void,origin?:TransitionOrigin}){
 const orb=overlay.querySelector('.transition-orb'),turn=overlay.querySelector('.transition-turn'),folds=overlay.querySelectorAll('.transition-fold');
 const facets=overlay.querySelectorAll('.transition-facet');
 const timeline=gsap.timeline({onComplete:complete});
 timeline.set(overlay,{visibility:'visible'}).set([orb,turn,...folds,...facets],{visibility:'hidden'});
 const reveal=()=>{open();gsap.set(outgoing,{clearProps:'transform,opacity'});};
 if(id==='work'){
  // The folder grows from the selected piece, then its cover opens upward.
  const x=origin?.x??innerWidth*.5,y=origin?.y??innerHeight*.5;
  timeline.set(orb,{visibility:'visible',background:'#191b22',clipPath:'polygon(0 8%,35% 8%,40% 0,65% 0,70% 8%,100% 8%,100% 100%,0 100%)',transformOrigin:`${x}px ${y}px`,scale:0,rotation:-8})
   .to(orb,{scale:1.12,rotation:0,duration:.58,ease:'power3.inOut'})
   .set(turn,{visibility:'visible',background:'#2d3038',clipPath:'none',transformOrigin:'center bottom',rotationX:70,yPercent:35})
   .to(turn,{rotationX:0,yPercent:0,duration:.3,ease:'power2.out'},.35)
   .call(reveal).set(orb,{visibility:'hidden'})
   .to(turn,{yPercent:-105,rotationX:-12,duration:.65,ease:'power3.inOut'})
   .fromTo(incoming.querySelector('.project-collection')??incoming,{y:35,opacity:0},{y:0,opacity:1,duration:.6,ease:'power3.out',clearProps:'transform,opacity'},.8);
 }else if(id==='about'){
  // Two viewpoints cross, then open into the profile screen.
  timeline.set(orb,{visibility:'visible',background:'#2946e8',clipPath:'ellipse(0% 0% at 28% 50%)'})
   .set(turn,{visibility:'visible',background:'#191b22',clipPath:'ellipse(0% 0% at 72% 50%)'})
   .to(orb,{clipPath:'ellipse(90% 110% at 58% 50%)',duration:.5,ease:'power3.inOut'},0)
   .to(turn,{clipPath:'ellipse(90% 110% at 42% 50%)',duration:.5,ease:'power3.inOut'},.06)
   .call(reveal)
   .to(turn,{clipPath:'ellipse(0% 0% at 28% 50%)',duration:.5,ease:'power3.inOut'})
   .to(orb,{clipPath:'ellipse(0% 0% at 72% 50%)',duration:.5,ease:'power3.inOut'},.56)
   .fromTo(incoming.querySelector('.profile-focus'),{y:12,opacity:0},{y:0,opacity:1,duration:.4,ease:'power2.out',clearProps:'transform,opacity'},.7);
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
 timeline.set(overlay,{visibility:'hidden'}).set([orb,turn,...folds,...facets],{clearProps:'all'});
 return timeline;
}
