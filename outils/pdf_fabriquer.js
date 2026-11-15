// PDF d'un livre (15 nov.; version élève : réponses cachées, pages « Animation » / « Guide animé » retirées) : node outils/pdf_fabriquer.js <fichier>  (lit /home/claude/originaux/livres/<fichier>.html, écrit <fichier>.pdf dans le dossier courant)
const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:816,height:1056}});
const f=process.argv[2];
await p.goto('file:///home/claude/originaux/livres/'+f+'.html');await p.waitForTimeout(2000);
const css=fs.readFileSync('/home/claude/bibliotheque/format/livre-mp.css','utf8');
const info=await p.evaluate(css=>{const s=document.createElement('style');s.id='mp-commun';s.textContent=css;document.head.appendChild(s);
 document.querySelectorAll('section.page,div.page').forEach(e=>{const h=((e.querySelector('h1,h2:not(.mod),h3,.ttl')||{}).textContent||'').trim();
  if(/^\W*Animation(?![a-zà-ÿ])/.test(h)||/Guide animé/.test(e.textContent)||e.querySelector('[class*="dmc-"]'))e.remove();});
 document.querySelectorAll('section.page,div.page').forEach(e=>e.classList.add('hcur','live','vis','cur'));
 const P=[...document.querySelectorAll('section.page,div.page')];const b=P[1].getBoundingClientRect();return [P.length,b.width,b.height]},css);
console.log(info);
await p.addStyleTag({content:`@page{size:8.5in 11in;margin:0}html,body{margin:0!important;padding:0!important;background:#fff!important}
html,body{height:auto!important;overflow:visible!important}#spread,#book,#stage,#desk{display:block!important;position:static!important;height:auto!important;width:auto!important;overflow:visible!important;transform:none!important;left:auto!important;top:auto!important}
section.page,div.page{display:block!important}section.page[data-aff=flex]{display:flex!important}svg.fx{display:none!important}:is(.reponse,.answer,.solution,.correction,[data-reponse],[data-answer],.ans):not(.exa){visibility:hidden!important}html body .page.pdfcache.pdfcache.pdfcache[class]{display:none!important}.page.pdfder{break-after:auto!important;page-break-after:auto!important}
section.page,div.page{position:relative!important;max-height:11in!important;break-inside:avoid;break-after:page;page-break-after:always;margin:0!important;box-shadow:none!important;overflow:hidden!important}`});
await p.waitForTimeout(2500);
const N=info[0], T=60, parts=[];
for(let a=0;a<N;a+=T){await p.evaluate(([a,T,N])=>{document.querySelectorAll('section.page,div.page').forEach((e,i)=>{e.classList.toggle('pdfcache',i<a||i>=a+T);e.classList.toggle('pdfder',i===Math.min(a+T,N)-1);if(i>=a&&i<a+T)e.classList.add('hcur','live','vis','cur')})},[a,T,N]);
 await p.waitForTimeout(600); await p.evaluate(([a,T])=>{document.querySelectorAll('section.page,div.page').forEach((e,i)=>{if(i>=a&&i<a+T)e.classList.add('hcur','live','vis','cur')})},[a,T]); await p.waitForTimeout(400);
 const nm=f+'.part'+a+'.pdf';await p.pdf({path:nm,timeout:0,width:'8.5in',height:'11in',printBackground:true,preferCSSPageSize:true});parts.push(nm);}
const cp=require('child_process'),args=[];
for(const x of parts){const n=+(/Pages:\s+(\d+)/.exec(cp.execFileSync('pdfinfo',[x]).toString())[1]);
 const txt=cp.execFileSync('pdftotext',['-f',''+n,'-l',''+n,x,'-']).toString().trim();
 const img=cp.execFileSync('pdfimages',['-f',''+n,'-l',''+n,'-list',x]).toString().trim().split('\n').length>2;
 args.push(x, (n>1&&!txt&&!img)?'1-'+(n-1):'1-'+n);}
cp.execFileSync('qpdf',['--empty','--pages',...args,'--',f+'.pdf']);parts.forEach(x=>fs.unlinkSync(x));
await b.close();})();
