// Table des matières : ouvre le livre original (son propre moteur) et note la page de chaque bouton du menu
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const out={};
for(const n of process.argv.slice(2)){
 const p=await b.newPage({viewport:{width:800,height:1100}});
 await p.goto('file:///tmp/audit/'+n+'.html');await p.waitForTimeout(1500);
 out[n]=await p.evaluate(async()=>{const r=[];const btns=[...document.querySelectorAll('#menu button')];
  for(const bt of btns){bt.click();await new Promise(x=>setTimeout(x,250));
   const pg=document.getElementById('pg');const v=pg?String(pg.value||pg.textContent):'';const m=v.match(/\d+/);
   r.push({tag:((bt.querySelector('b,strong')||{}).textContent||'').trim(),txt:((bt.querySelector('span')||bt).textContent||'').replace(/\s+/g,' ').trim(),page:m?+m[0]:null});}
  return r;});
 console.log(n,JSON.stringify(out[n]).slice(0,600));await p.close();}
fs.writeFileSync('/tmp/conv/toc.json',JSON.stringify(out,null,1));await b.close()})()
