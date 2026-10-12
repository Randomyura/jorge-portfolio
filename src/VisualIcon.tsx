type Kind='arrow'|'down'|'up'|'star'|'menu'|'close'|'sun'|'moon';
export function VisualIcon({kind}:{kind:Kind}){
 const paths:Record<Kind,string>={arrow:'M5 19 19 5M5 5h14v14',down:'M12 3v18M4 13l8 8 8-8',up:'M12 21V3M4 11l8-8 8 8',star:'M12 2v20M2 12h20M5 5l14 14M5 19 19 5',menu:'M4 7h16M4 12h16M4 17h16',close:'M5 5l14 14M5 19 19 5',moon:'M20.5 14.5A9 9 0 0 1 9.5 3.5 9 9 0 1 0 20.5 14.5Z',sun:'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10M12 1v2M12 21v2M1 12h2M21 12h2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4'};
 return <svg className={`visual-icon visual-icon-${kind}`} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d={paths[kind]} stroke="currentColor" strokeWidth={kind==='star'?2:1.6} strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
