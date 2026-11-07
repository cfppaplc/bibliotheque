// Convertit un livre « moteur A » vers le format des normes (pages simples affichées par la bibliothèque)
const {chromium}=require('playwright');const fs=require('fs');
const TOC=JSON.parse(fs.readFileSync('/tmp/conv/toc.json','utf8'));
(async()=>{const b=await chromium.launch();
for(const n of process.argv.slice(2)){
 const ctx=await b.newContext({javaScriptEnabled:false});const p=await ctx.newPage();
 await p.goto('file:///tmp/audit/'+n+'.html');
 const rep=await p.evaluate((A)=>{const toc=A.toc;
  const d=document, pages=[...d.querySelectorAll('.page')], spread=pages[0].parentElement, info={pages:pages.length,retires:[],scriptsGardes:[]};
  // 1) affichage d'origine de chaque page (avant de toucher au reste)
  pages.forEach(pg=>{pg.classList.add('vis');}); const disp=pages.map(pg=>getComputedStyle(pg).display); pages.forEach(pg=>pg.classList.remove('vis'));
  // 2) éléments d'interface du livre (barre, menu, crayon, minuterie, projecteur…)
  const UI=['ui','menu','pen','zl','zr','bar','tpop','timer','spot','cover','ba','zv','ink','wb'];
  UI.forEach(id=>{const e=d.getElementById(id); if(e&&!e.contains(pages[0])){e.remove();info.retires.push(id);}});
  d.querySelectorAll('.zone').forEach(e=>{if(!e.contains(pages[0])){e.remove();}});
  // éléments du conteneur qui ne sont pas des pages (toile de crayon, etc.)
  [...spread.children].forEach(c=>{if(!c.classList.contains('page')){info.retires.push('spread>'+c.tagName+'#'+(c.id||'')+'.'+c.className);c.remove();}});
  // frères des ancêtres des pages qui sont de l'interface (boutons, toiles)
  let a=spread; const anc=[]; while(a&&a!==d.body&&a!==d.documentElement){anc.push(a);
    [...a.parentElement.children].forEach(s=>{if(s!==a&&/^(CANVAS|BUTTON)$/.test(s.tagName)){info.retires.push('frere '+s.tagName+'#'+s.id);s.remove();}}); a=a.parentElement;}
  // 3) scripts : on garde seulement ceux qui ne dépendent pas du moteur du livre
  [...d.querySelectorAll('script')].forEach(s=>{const t=s.textContent;
    const moteur=/#spread|IDLE=|Corrigé|Changement de page|groups=\[\]|getElementById\(['"](tpop|ui|pg|bp)['"]\)|\$\(['"]tpop['"]\)|ansState|function render|keydown/.test(t);
    if(moteur){s.remove();} else info.scriptsGardes.push((s.id||'')+':'+t.slice(0,50));});
  // préparations que faisait le moteur du livre au démarrage (micro-ordinateur)
  if(A.micro){document.querySelectorAll('.opts span.ok,.vf span.ok').forEach(function(e){e.classList.add('ansob')});
   document.querySelectorAll('.fig svg').forEach(function(s){[].forEach.call(s.children,function(c,i){c.style.setProperty('--i',Math.min(i,40))})});
   document.querySelectorAll('svg circle').forEach(function(c){var f=(c.getAttribute('fill')||'').toUpperCase(),r=+c.getAttribute('r');if(f==='#E8572A'&&r>=3&&r<=12)c.classList.add('pulse')});info.prep='micro';}
  // 4) couverture, réponses
  pages[0].classList.add('cover');
  let nr=0; d.querySelectorAll('.ans,.ans-w').forEach(e=>{e.classList.add('reponse');nr++;}); info.reponses=nr;
  let nc=0; d.querySelectorAll('.opts span.ok,.opts span.ansob,.vf span.ok,.vf span.ansob,.ch label.ok').forEach(e=>{e.classList.add('reponse-choix');nc++;}); info.choix=nc;
  // 5) table des matières : titre caché « Module N — … » au début de chaque module
  let nm=0; [].concat(toc||[]).forEach(t=>{ if(!t.page||!/^[0-9]+$|^[A-Z]$/.test(t.tag)) return; const pg=pages[t.page-1]; if(!pg) return;
    const h=d.createElement('h2'); h.className='mod'; h.hidden=true; h.textContent=(/^[0-9]+$/.test(t.tag)?'Module ':'Partie ')+t.tag+' — '+t.txt; pg.insertBefore(h,pg.firstChild); nm++; }); info.modules=nm;
  // 6) CSS : ancêtres neutres, affichage d'origine des pages, réponses en pas à pas qui gardent leur place
  const ids=anc.filter(e=>e.id).map(e=>'#'+e.id);
  const kinds={}; pages.forEach((pg,i)=>{const k=disp[i]==='none'?'block':disp[i]; if(k!=='block'){pg.setAttribute('data-aff',k);} kinds[k]=(kinds[k]||0)+1;}); info.affichages=kinds;
  const st=d.createElement('style'); st.id='normes-biblio';
  st.textContent='/* Format des normes de la bibliothèque (7 nov. 2026) */\n'
   +(ids.length?ids.join(',')+'{position:static!important;transform:none!important;filter:none!important;contain:none!important;perspective:none!important;will-change:auto!important;zoom:1!important;overflow:visible!important;display:block!important}\n':'')
   +Object.keys(kinds).filter(k=>k!=='block').map(k=>'html body .page.hcur[data-aff="'+k+'"]{display:'+k+'!important}').join('\n')
   +'\nbody.stepans .ans.reponse:not(.shown){display:revert}';
  d.head.appendChild(st);
  // 7) pont : classes de la bibliothèque → classes du livre (vis, answers, stepans, shown)
  const sh=d.createElement('script'); sh.id='pont-biblio';
  sh.textContent='(function(){var d=document,b=d.body;function pg(p){var v=p.classList.contains("live")||p.classList.contains("hcur");if(p.classList.contains("vis")!==v)p.classList.toggle("vis",v);}'
   +'function corps(){var r=b.classList.contains("h-rep"),s=b.classList.contains("h-pas");if(b.classList.contains("answers")!==(r||s))b.classList.toggle("answers",r||s);if(b.classList.contains("stepans")!==s)b.classList.toggle("stepans",s);}'
   +'new MutationObserver(function(ms){ms.forEach(function(m){var t=m.target;if(!t.classList)return;if(t===b)corps();else if(t.classList.contains("page"))pg(t);else if(t.classList.contains("reponse")||t.classList.contains("reponse-choix")){var v=t.classList.contains("h-vu");if(t.classList.contains("shown")!==v)t.classList.toggle("shown",v);}});})'
   +'.observe(d.documentElement,{subtree:true,attributes:true,attributeFilter:["class"]});})();';
  d.body.appendChild(sh);
  return info;},{toc:TOC[n],micro:n==='micro-ordinateur'});
 const html='<!DOCTYPE html>\n'+await p.evaluate(()=>document.documentElement.outerHTML);
 fs.writeFileSync('/tmp/conv/'+n+'.html',html);
 console.log(n,(html.length/1e6).toFixed(2)+' Mo',JSON.stringify(rep).slice(0,900));await ctx.close();}
await b.close()})()
