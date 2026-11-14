const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1000,height:1200}});
await p.goto('file:///tmp/mp/mesure.html');await p.waitForTimeout(1500);
const r=await p.evaluate(()=>[...document.querySelectorAll('.page.mp-ouv')].map(pg=>{const b=pg.querySelector('.mp-bas').getBoundingClientRect();let m=0;for(const c of pg.querySelector('.mp-bas').children)m=Math.max(m,c.getBoundingClientRect().bottom);return Math.round(b.bottom-m)}));console.log(r);await b.close()})();
