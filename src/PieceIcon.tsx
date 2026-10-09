/** Draw the portfolio pieces instead of relying on platform emoji fonts. */
export function PieceIcon({index}:{index:number}){
 return <svg className="piece-icon" width="1em" height="1em" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" style={{display:'inline-block',verticalAlign:'middle',flexShrink:0}}>
  {index===0?<path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93 4.93 19.07" stroke="currentColor" strokeWidth="1.2"/>:
   index===1?<path d="M5 19 19 5M6 5h13v13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter"/>:
   index===2?<><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M3 12h18a9 9 0 0 1-18 0Z" fill="currentColor"/></>:
   <path d="m12 2 10 10-10 10L2 12Z" stroke="currentColor" strokeWidth="1.2"/>}
 </svg>;
}

type InlineKind='arrow'|'back'|'next'|'up'|'down'|'reset'|'close'|'check'|'dot';
export function InlineIcon({kind='arrow'}:{kind?:InlineKind}){
 const paths:Record<Exclude<InlineKind,'dot'>,string>={
  arrow:'M6 18 18 6M6 6h12v12',back:'M20 12H4m6-6-6 6 6 6',next:'M4 12h16m-6-6 6 6-6 6',
  up:'M12 20V4m-6 6 6-6 6 6',down:'M12 4v16m-6-6 6 6 6-6',
  reset:'M20 7V2h-5M20 7a8 8 0 1 0 .4 8',close:'M6 6l12 12M18 6 6 18',check:'m5 12 4 4L19 6',
 };
 return <svg className="inline-icon" width="1em" height="1em" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" style={{display:'inline-block',verticalAlign:'-.12em',flexShrink:0}}>{kind==='dot'?<circle cx="12" cy="12" r="3" fill="currentColor"/>:<path d={paths[kind]} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>}</svg>;
}
