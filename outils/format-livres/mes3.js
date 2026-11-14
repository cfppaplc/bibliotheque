// Mesure l'espace libre au bas du contenu de chaque page .mp (négatif = déborde). Usage : node mes3.js <fichier.html>
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1000,height:1200}});
await p.goto('file:///tmp/mp/mesure.html',{waitUntil:'load'});await p.waitForTimeout(2000);
const r=await p.evaluate(()=>[...document.querySelectorAll('section.page')].map((pg,i)=>{if(!pg.classList.contains('mp'))return [i,null];
const bd=pg.querySelector(pg.classList.contains('mp-ouv')?'.mp-bas':'.body');if(!bd)return [i,null];const B=bd.getBoundingClientRect();let m=B.top;
const w=e=>{for(const c of e.children){const r=c.getBoundingClientRect();if(r.height&&getComputedStyle(c).position!=='absolute')m=Math.max(m,r.bottom)}};w(bd);for(const c of bd.children)if(c.children.length)w(c);
return [i,Math.round(B.bottom-m),pg.classList.contains('mp-ouv')]}));
require('fs').writeFileSync('/tmp/mp/mesure.json',JSON.stringify(r));await b.close()})();
