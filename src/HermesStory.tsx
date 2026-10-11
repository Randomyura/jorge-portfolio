export const hermesImage=(page:number)=>`${import.meta.env.BASE_URL}projects/hermes/page-${String(page).padStart(2,'0')}.webp`;
export function HermesStory({lang}:{lang:'es'|'en'}){
 const es=lang==='es';
 return <article className="hermes-story">
  <span className="hermes-eyebrow">001 / Graphic Design · Packaging</span>
  <h3>{es?'Dar forma al detalle.':'Shaping the details.'}</h3>
  <p>{es?'Una propuesta académica de packaging cosmético inspirada en la identidad visual de Hermès. El negro y el dorado conectan el envase y la caja, explorando texturas, transparencias y acabados.':'An academic cosmetic packaging concept inspired by the visual identity of Hermès. Black and gold connect the container and box through textures, transparency and finishes.'}</p>
  <dl className="hermes-facts"><div><dt>{es?'Autor':'Author'}</dt><dd>Jorge Sunyer Guirado</dd></div><div><dt>{es?'Herramienta':'Tool'}</dt><dd>Adobe Illustrator</dd></div><div><dt>{es?'Proceso':'Process'}</dt><dd>{es?'Diseño y representaciones 3D realizados íntegramente en Illustrator.':'Design and 3D representations created entirely in Illustrator.'}</dd></div></dl>
  <p className="hermes-note">{es?'Proyecto conceptual académico independiente. No es una colaboración oficial con Hermès.':'Independent academic concept. This is not an official collaboration with Hermès.'}</p>
  <section className="hermes-materials"><h4>{es?'Materiales y acabados propuestos':'Proposed materials and finishes'}</h4><p>{es?'Caja de cartón folding, papel Ad Bright Gold e impresión por serigrafía. Para el envase: cristal, plástico transparente, brillante y mate; etiqueta de papel, serigrafía y foil dorado.':'Folding carton, Ad Bright Gold paper and screen printing for the box. For the container: glass, transparent, glossy and matte plastic; a paper label, screen printing and gold foil.'}</p></section>
 </article>;
}
