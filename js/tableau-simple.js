/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — tableau-simple.js (sorti d'index.html le 15 nov.) */
(function(){
  if (typeof toggleWb !== "function" || typeof RD === "undefined") return;
  const Q = s => document.querySelector(s), bar = Q("#penBar"); if (!bar) return;
  const svg = d => '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';

  /* 1. le dessin suit toujours le fond (avant : il restait sur l'ancien fond, avec un avis « Apporter ici ») */
  apresFond = function(ancienne){ let nouv; try { nouv = inkKey(); } catch(e){ return; } if (ancienne === nouv) return;
    const av = INKS[ancienne] || []; if (!av.length) return;
    INKS[nouv] = (INKS[nouv] || []).concat(av); INKS[ancienne] = [];
    try { SELO.s = null; window.SELM = []; } catch(e){} try { redrawInk(); } catch(e){} try { planifierSauvegarde(); } catch(e){} };

  /* 2. tableau vide = crayon prêt (rien à déplacer); tableau avec un dessin = aucun outil, comme avant (toucher un objet le déplace). Texte plus gros au tableau. */
  const tw0 = toggleWb;
  window.toggleWb = toggleWb = function(){ const r = tw0.apply(this, arguments);
    try {
      if (RD.wb){ if (TX.fs === 32){ TX.fs = 60; TX._wb = 1; }
        if (wbVide(wbEtat().n)){ RD.crayonOff = false; refreshTools(); [300, 700, 1200].forEach(t => setTimeout(() => { try { refreshTools(); } catch(e){} }, t)); } }
      else { if (TX._wb){ TX.fs = 32; TX._wb = 0; } const c = Q("#wbCalc"), g = Q("#wbRegle"); if (c) c.hidden = true; if (g) g.hidden = true; }
    } catch(e){}
    return r; };

  /* 3. mots sous les icônes */
  /* la rangée « Tracé » est cachée sur le tableau blanc : toujours revenir au trait libre */
  document.addEventListener("click", e => { if (!e.target.closest || !e.target.closest("#penCol") || innerWidth < 900) return;
    const t = document.querySelector("#popCol .ptrace"); if (t && !t.classList.contains("on")) t.click();
    /* crayon déjà actif : toucher « Crayon » ouvre la bulle des couleurs (un 2e toucher range le crayon) */
    const pc = document.getElementById("popCol"), actif = !RD.eraser && !RD.text && !RD.obj && !RD.crayonOff;
    if (actif && pc && pc.hidden){ e.stopPropagation(); e.preventDefault(); const pp = document.getElementById("popPlus"); if (pp) pp.hidden = true; pc.hidden = false; e.target.closest("#penCol").classList.add("open"); } }, true);
  /* Lecteur de livres (9 nov.) : mots sous les icônes de la barre, bouton « Terminé » de la barre du crayon */
  { const M = { tbPen:"Crayon", tbAns:"Réponses", tbAnim:"Animation", tbWb:"Tableau blanc", tbMenu:"Sommaire", tbDbl:"2 pages", tbTele:"Télécommande", tbFs:"Plein écran", tbMore:"Plus", tbTimer:"Minuterie", tbSpot:"Projecteur", tbCache:"Cache", tbLaser:"Laser", tbNoir:"Écran noir", tbMark:"Signet", tbHelp:"Raccourcis", tbPin:"Barres", tbPrint:"Imprimer", tbQr:"Code QR" };
    Object.keys(M).forEach(id => { const b = document.getElementById(id); if (b) b.dataset.mot = M[id]; });
    const d = document.createElement("button"); d.type = "button"; d.id = "penDone"; d.textContent = "Terminé"; d.title = "Ranger le crayon et revenir aux outils du livre"; d.onclick = () => { const t = Q("#tbPen"); if (t) t.click(); }; bar.appendChild(d); }
  const MOTS = { penFold:"Cacher", penCol:"Crayon", penT:"Texte", penO:"Objets", penE:"Gomme", penU:"Annuler", wbF:"Fond", penPlus:"Plus" };
  Object.keys(MOTS).forEach(id => { const b = document.getElementById(id); if (b && b.parentNode === bar) b.dataset.mot = MOTS[id]; });

  /* 4. couleurs et grosseurs directement sur la barre */
  const COUL = ["#e2483d", "#2a7bcf", "#2f9e4f", "#24282c"], GROS = [[3, 6], [8, 12], [16, 20]];
  const qc = document.createElement("span"); qc.className = "wbq coul";
  qc.innerHTML = COUL.map(c => `<button type="button" class="c" data-qc="${c}" style="--c:${c}" aria-label="Couleur"></button>`).join("");
  const qg = document.createElement("span"); qg.className = "wbq gros";
  qg.innerHTML = GROS.map(([w, d], k) => `<button type="button" class="g" data-qg="${w}" style="--d:${d}px" title="${["Trait fin", "Trait moyen", "Gros trait"][k]}" aria-label="${["Trait fin", "Trait moyen", "Gros trait"][k]}"><i></i></button>`).join("");
  const apresCrayon = Q("#penCol"); if (apresCrayon && apresCrayon.parentNode === bar){ bar.insertBefore(qg, apresCrayon.nextSibling); bar.insertBefore(qc, qg); }
  { const pc = Q("#popCol"); if (pc) pc.appendChild(qg); }   /* les 3 grosseurs vont dans la bulle du crayon */
  /* Rétablir sur la barre, poubelle à côté des tableaux, Tout effacer dans le menu de la gomme : ils cliquent les vrais boutons de « Plus » */
  setTimeout(() => { try {
    const pr = Q("#penR"), pu = Q("#penU"), pm = Q("#wbMoins"), pcl = Q("#penC"), nav = bar.querySelector(".wbq.nav"), pg = Q("#popGom");
    if (pr && pu && !Q("#wbRetB")){ const b = document.createElement("button"); b.type = "button"; b.id = "wbRetB"; b.className = "wbq"; b.title = "Rétablir (Ctrl+Y)"; b.setAttribute("aria-label", "Rétablir"); b.dataset.mot = "Rétablir"; b.innerHTML = (pr.querySelector("svg") || {}).outerHTML || "↷"; b.onclick = () => pr.click(); bar.insertBefore(b, pu.nextSibling);
      b.style.cssText = "border:1px solid #2f2f33;border-radius:10px;padding:5px 6px"; }
    if (pm && nav && !Q("#wbSupB")){ const b = document.createElement("button"); b.type = "button"; b.id = "wbSupB"; b.title = "Effacer tout le tableau (toucher deux fois; Annuler le ramène)"; b.setAttribute("aria-label", "Effacer tout le tableau"); b.innerHTML = (pm.querySelector("svg") || {}).outerHTML || "✕"; let t = 0;
      /* 10 nov. (Jeremy) : la poubelle efface ce qu'il y a au tableau (comme « Tout effacer »); supprimer le tableau = menu Plus */
      b.onclick = () => { clearTimeout(t); if (b.classList.contains("sur")) { b.classList.remove("sur"); if (pcl) pcl.click(); } else { b.classList.add("sur"); t = setTimeout(() => b.classList.remove("sur"), 3000); } };
      nav.appendChild(b); setInterval(() => { if (RD.wb) { let n = 0; try { n = strokes().length; } catch(x) {} b.disabled = !n; if (!n) b.classList.remove("sur"); } }, 500); }
    if (pcl && pg && !Q("#wbToutB")){ const b = document.createElement("button"); b.type = "button"; b.id = "wbToutB"; b.innerHTML = ((pcl.querySelector("svg") || {}).outerHTML || "") + "<span>Tout effacer</span>"; b.onclick = () => pcl.click(); pg.appendChild(b); }
  } catch(e){} }, 0);
  const crayon = () => { RD.eraser = false; RD.text = false; RD.crayonOff = false; };
  qc.addEventListener("click", e => { const b = e.target.closest("[data-qc]"); if (!b) return; e.stopPropagation();
    const sw = document.querySelector('#popCol .sw[data-c="' + b.dataset.qc + '"]'); if (sw) sw.click(); else RD.color = b.dataset.qc; crayon(); refreshTools(); });
  qg.addEventListener("click", e => { const b = e.target.closest("[data-qg]"); if (!b) return; e.stopPropagation();
    const i = document.querySelector("#popCol .plarg input"); if (i){ i.value = b.dataset.qg; i.dispatchEvent(new Event("input", {bubbles:true})); } else RD.wPx = +b.dataset.qg; crayon(); refreshTools(); });
  /* le menu de la gomme s'ouvre au-dessus de son bouton */
  bar.addEventListener("click", e => { if (innerWidth < 900 || !e.target.closest || !e.target.closest("#penE")) return;
    setTimeout(() => { const g = Q("#popGom"), b = Q("#penE"); if (g && b){ g.style.left = Math.max(8, Math.min(b.offsetLeft, bar.clientWidth - g.offsetWidth - 8)) + "px"; g.style.transform = "none"; } }, 0); });
  setInterval(() => { try { const bc = (RD.wb || RD.book) && document.hidden === false ? Q("#penCol") : null, cur = bc && bc.querySelector(".pcur"); if (cur && bc.offsetWidth) bc.style.setProperty("--pcb", cur.style.getPropertyValue("--pc") || "#e2483d"); } catch(e){}
    if (!RD.wb) return; const actif = !RD.crayonOff && !RD.eraser && !RD.text;
    try {   /* pastille de la couleur en cours sur « Crayon » */
      const zv = Q("#wbZv"), t = Math.round(RD.z / zMin() * 100) + "%"; if (zv && zv.textContent !== t) zv.textContent = t; } catch(e){}   /* 100 % = la vue de départ du tableau */
    qc.querySelectorAll("button").forEach(b => b.classList.toggle("on", actif && RD.color === b.dataset.qc));
    qg.querySelectorAll("button").forEach(b => b.classList.toggle("on", actif && +RD.wPx === +b.dataset.qg)); }, 300);

  /* 5. tableaux ‹ 1 / N › + sur la barre (avant : cachés dans « Plus ») */
  { const nav = document.createElement("span"); nav.className = "wbq nav";
    ["wbP", "wbLbl", "wbN", "wbPlus"].forEach(id => { const e = document.getElementById(id); if (e){ e.hidden = false; delete e.dataset.lab; nav.appendChild(e); } });
    const plus = Q("#penPlus"); if (nav.children.length && plus && plus.parentNode === bar) bar.insertBefore(nav, plus);
    const p = nav.querySelector("#wbPlus"); if (p) p.title = "Nouveau tableau";
    /* un tableau vide (nouveau, ou en changeant de tableau) : crayon prêt */
    nav.addEventListener("click", () => setTimeout(() => { try { if (RD.wb && wbVide(wbEtat().n) && RD.crayonOff && !RD.obj && !RD.text && !RD.eraser){ RD.crayonOff = false; refreshTools(); } } catch(e){} }, 150)); }

  /* Palette Objets revue (9 nov.) : couleurs Métier+, onglets sur une rangée, formes principales + « Plus de formes », plomberie par groupes, Animer en haut */
  try { const ob = Q("#objBar"); if (ob && !ob.dataset.revu){ ob.dataset.revu = "1";
    const court = { elec:"Élec.", plomb:"Plomb." }; ob.querySelectorAll(".onglets [data-tab]").forEach(b => { if (court[b.dataset.tab]){ if (!b.title) b.title = b.textContent; b.textContent = court[b.dataset.tab]; } });
    const gf = ob.querySelector('.grp[data-g="formes"] .cgrid'), PRINC = ["ligne", "fleche", "cote", "rect", "cercle", "triangle", "angle", "crochet"];
    if (gf){ PRINC.slice().reverse().forEach(k => { const b = gf.querySelector('[data-f="' + k + '"]'); if (b) gf.insertBefore(b, gf.firstChild); });
      gf.querySelectorAll("[data-f]").forEach(b => { if (!PRINC.includes(b.dataset.f)) b.classList.add("sec"); });
      const pl = document.createElement("button"); pl.type = "button"; pl.className = "plusF"; const g = gf.parentNode; let ouvert = false; try { ouvert = localStorage.formesTout === "1"; } catch(e){}
      const maj = () => { g.classList.toggle("tout", ouvert); pl.textContent = ouvert ? "▴ Moins de formes" : "▾ Plus de formes (12)"; }; pl.onclick = () => { ouvert = !ouvert; try { localStorage.formesTout = ouvert ? "1" : "0"; } catch(e){} maj(); }; gf.after(pl); maj(); }
    const gp = ob.querySelector('.grp[data-g="plomb"] .cgrid');
    if (gp){ [["Maison et tuyaux", ["maison", "tuyEF", "tuyEC", "tuyDR", "tuyEV", "tuyGZ"]], ["Raccords et robinets", ["plVanne", "plClapet", "plTe", "plCoude", "plSiphon", "plCompteur", "plCF", "plCC"]], ["Appareils", ["plCE", "plLav", "plWC", "plBain", "plEvier", "plLaveuse", "plAvaloir"]]].forEach(([n, ks]) => {
        const t = document.createElement("span"); t.className = "ctit"; t.textContent = n; gp.appendChild(t); ks.forEach(k => { const b = gp.querySelector('[data-f="' + k + '"]'); if (b) gp.appendChild(b); }); }); }
    const stl = document.createElement("style"); stl.textContent = '#objBar .tete{order:-5}#objBar .onglets{order:-4;grid-template-columns:repeat(4,1fr)!important}#objBar .onglets button{font-size:.66rem!important;padding:0!important}#objBar #objSim{order:-3;min-height:40px!important;font-weight:700}#objBar .simAide{order:-2}'
      + '#objBar .onglets button.on{background:#EB6A22!important;border-color:#EB6A22!important}#objBar button.on{border-color:#EB6A22}#objBar button:hover,#objBar .cgrid button:hover{border-color:#F28A3C}'
      + '#objBar .cgrid button.on{background:#fdebdd!important;border-color:#EB6A22!important;color:#7a3410!important;box-shadow:inset 0 0 0 1px #EB6A22!important}#objBar .filcols button.on{border-color:#EB6A22!important;box-shadow:0 0 0 2px #EB6A22!important}'
      + '#objBar .aide,#objBar .taille em{color:#b9bfcc!important}#objBar .aide b{color:#F28A3C!important}'
      + '#objBar .sch-btn{order:90;background:transparent!important;border-color:#3a3a40!important;color:#d4d4d8!important;margin:4px 0 0!important}#objBar #objX{order:99}'
      + '#objBar .grp[data-g="formes"]:not(.tout) .sec{display:none!important}#objBar .plusF{text-align:center!important;background:transparent!important;color:#a1a1aa!important;font-size:.74rem;min-height:30px!important}'
      + '#objBar .ctit{grid-column:1/-1;font-size:.7rem;text-transform:uppercase;letter-spacing:.04em;color:#a1a1aa;padding:6px 2px 1px}#objBar .ctit:first-child{padding-top:0}';
    document.head.appendChild(stl); } } catch(e){}
  /* « Animer » sur la barre du tableau blanc dès qu'il y a un symbole électrique ou un fil sur le tableau (avant : bouton tout en bas de l'onglet Électricité) */
  try { const ab = document.createElement("button"); ab.type = "button"; ab.id = "wbAnimB"; ab.hidden = true; ab.dataset.mot = "Animer"; ab.title = "Faire fonctionner le schéma électrique : le courant circule";
    const IC = ['<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>', '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>'];
    ab.innerHTML = IC[0]; const ro = Q("#penO"); if (ro && ro.parentNode === bar) bar.insertBefore(ab, ro.nextSibling); else bar.appendChild(ab);
    ab.onclick = () => { try { if (RD.sim){ simStop(); return; }
      if (!RD.obj){ const o = Q("#penO"); if (o) o.click(); } const t = Q('#objBar [data-tab="elec"]'); if (t && RD.objTab !== "elec") t.click(); setTimeout(() => { try { simStart(); } catch(e){} }, 60); } catch(e){} };
    setInterval(() => { try { if (!RD.wb){ if (!ab.hidden) ab.hidden = true; return; } const L = INKS[inkKey()] || [], y = !!RD.sim || (wbBg() === "quad" && L.some(s => s && (s.fil || (s.t === "objet" && ELEC[s.k]))));
      if (ab.hidden === y) ab.hidden = !y; const on = !!RD.sim; if (ab.classList.contains("stop") !== on){ ab.classList.toggle("stop", on); ab.innerHTML = IC[on ? 1 : 0]; ab.dataset.mot = on ? "Arrêter" : "Animer"; } } catch(e){} }, 400); } catch(e){}

  /* 6. calculatrice */
  const calc = document.createElement("div"); calc.id = "wbCalc"; calc.hidden = true;
  const T = [["C","pt"],["⌫","pt"],["(","pt"],[")","pt"], ["7"],["8"],["9"],["÷","op"], ["4"],["5"],["6"],["×","op"], ["1"],["2"],["3"],["−","op"], ["0"],[","],["=","eg"],["+","op"], ["√","pt"],["x²","pt"],["π","pt"],["%","pt"]];
  const SCI = ["sin(", "cos(", "tan(", "xʸ", "sin⁻¹(", "cos⁻¹(", "tan⁻¹(", "log("];
  calc.innerHTML = '<div class="ct">Calculatrice<button type="button" class="bsci" data-sci aria-label="Fonctions scientifiques">Sci</button><button type="button" data-x aria-label="Fermer">✕</button></div><div class="cexp"></div><div class="cres">0</div><div class="ck sci">' + SCI.map(t => `<button type="button" class="pt" data-t="${t === "xʸ" ? "^" : t}">${t.replace("(", "")}</button>`).join("") + '</div><div class="ck">' + T.map(([t, c]) => `<button type="button" class="${c || ""}" data-t="${t}">${t}</button>`).join("") + '</div>';
  document.body.appendChild(calc);
  let exp = "", fait = false;
  const fr = n => { if (!isFinite(n)) return "Erreur"; const r = Math.round(n * 1e10) / 1e10; return String(r).replace(".", ","); };
  const evalue = s => { let e = s.replace(/÷/g, "/").replace(/×/g, "*").replace(/−/g, "-").replace(/,/g, ".").replace(/π/g, "(3.141592653589793)").replace(/(\d+(?:\.\d+)?)%/g, "($1/100)").replace(/²/g, "**2").replace(/\^/g, "**");
    e = e.replace(/sin⁻¹\(/g, "AS(").replace(/cos⁻¹\(/g, "AC(").replace(/tan⁻¹\(/g, "AT(").replace(/sin\(/g, "SI(").replace(/cos\(/g, "CO(").replace(/tan\(/g, "TA(").replace(/log\(/g, "LG(");
    e = e.replace(/√\(/g, "SQ(").replace(/√(\d+(?:\.\d+)?)/g, "SQ($1)").replace(/(\d|\))\(/g, "$1*(").replace(/\)(\d)/g, ")*$1").replace(/(\d|\))([A-Z])/g, "$1*$2");
    if (!/^[\d+\-*/().\s]*$/.test(e.replace(/\b(?:AS|AC|AT|SI|CO|TA|LG|SQ)\(/g, "("))) throw 0; const o = (e.match(/\(/g) || []).length - (e.match(/\)/g) || []).length; if (o > 0) e += ")".repeat(o);
    const D = Math.PI / 180;   /* angles en degrés */
    return Function("SI", "CO", "TA", "AS", "AC", "AT", "LG", "SQ", '"use strict";return (' + e + ')')(x => Math.sin(x * D), x => Math.cos(x * D), x => Math.tan(x * D), x => Math.asin(x) / D, x => Math.acos(x) / D, x => Math.atan(x) / D, x => Math.log10(x), x => Math.sqrt(x)); };
  const montre = () => { calc.querySelector(".cexp").textContent = fait ? exp + " =" : ""; let v = exp || "0"; if (fait){ try { v = fr(evalue(exp)); } catch(e){ v = "Erreur"; } } calc.querySelector(".cres").textContent = v;
    const R = calc.querySelector(".cres"); R.style.fontSize = v.length > 11 ? (v.length > 16 ? "24px" : "32px") : "44px"; };
  const sci = v => { calc.classList.toggle("sci", v); try { localStorage.calcSci = v ? "1" : "0"; } catch(x){} }; try { sci(localStorage.calcSci === "1"); } catch(x){}
  calc.querySelector("[data-sci]").onclick = () => sci(!calc.classList.contains("sci"));
  calc.addEventListener("click", e => { if (!e.target.closest(".ck")) return; const b = e.target.closest("[data-t]"); if (!b) return; const t = b.dataset.t;
    if (t === "C"){ exp = ""; fait = false; }
    else if (t === "⌫"){ if (fait){ fait = false; } else exp = exp.slice(0, -1); }
    else if (t === "="){ if (exp) fait = true; }
    else { if (fait){ let v = ""; try { v = fr(evalue(exp)); } catch(x){} fait = false; exp = /[\d,π(√]/.test(t) && t !== "x²" && t !== "%" && t !== "^" ? "" : (v === "Erreur" ? "" : v); }
      exp += t === "x²" ? "²" : t === "√" ? "√(" : t; }
    montre(); });
  calc.querySelector("[data-x]").onclick = () => { calc.hidden = true; };
  const glisser = (poignee, el, quoi) => { let d = null;
    poignee.addEventListener("pointerdown", e => { if (e.target.closest("button")) return; d = quoi(e); try { poignee.setPointerCapture(e.pointerId); } catch(x){} e.preventDefault(); e.stopPropagation(); });
    poignee.addEventListener("pointermove", e => { if (d){ d.bouge(e); e.stopPropagation(); } });
    const fin = e => { if (d && d.fin){ try { d.fin(e); } catch(x){} } d = null; }; poignee.addEventListener("pointerup", fin); poignee.addEventListener("pointercancel", fin); };
  glisser(calc.querySelector(".ct"), calc, e => { const r = calc.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top;
    return { bouge: m => { calc.style.left = Math.max(0, Math.min(innerWidth - 80, m.clientX - dx)) + "px"; calc.style.top = Math.max(0, Math.min(innerHeight - 60, m.clientY - dy)) + "px"; calc.style.right = "auto"; } }; });
  ["pointerdown", "pointerup", "click", "touchstart"].forEach(t => calc.addEventListener(t, e => e.stopPropagation()));

  /* 7. règle graduée (1 graduation numérotée = 1 carreau du quadrillé), qu'on glisse et qu'on tourne par la poignée orange */
  const reg = document.createElement("div"); reg.id = "wbRegle"; reg.hidden = true;
  reg.innerHTML = '<div class="grad"></div><div class="nums"></div><div class="trace" hidden></div><div class="rinfo"><span id="wbRegL">cm</span><span id="wbRegA">0°</span><button type="button" data-a="0">0°</button><button type="button" data-a="45">45°</button><button type="button" data-a="90">90°</button><button type="button" class="brap" title="Rapporteur">Angles</button></div><div class="rap" hidden></div><button type="button" class="rx" aria-label="Ranger la règle">✕</button><div class="rot" title="Glisse pour tourner la règle">⟳</div>';
  document.body.appendChild(reg);
  const RG = { x: 0, y: 0, a: 0, n: 20 };
  const pasNum = u => u >= 30 ? 1 : u >= 15 ? 2 : 5;
  const poser = () => { const u = 34 * (RD.z || 1); RG.n = Math.max(8, Math.round(Math.min(1100, innerWidth * .55) / u)); reg.style.setProperty("--u", u + "px"); reg.style.width = (RG.n * u + 2) + "px";
    reg.style.left = RG.x + "px"; reg.style.top = RG.y + "px"; reg.style.transform = "rotate(" + RG.a + "deg)";
    reg.querySelector("#wbRegA").textContent = (Math.round((-RG.a % 360 + 360) % 360)) + "°";
    const N = reg.querySelector(".nums"); if (N.dataset.u !== String(u)){ N.dataset.u = u; const pn = pasNum(u); N.innerHTML = Array.from({length: RG.n + 1}, (_, k) => k % pn ? "" : `<i style="left:${k * u + (k ? 0 : 8)}px">${k}</i>`).join(""); } };
  glisser(reg, reg, e => {
    /* crayon actif + départ sur le bord gradué : trait droit le long de la règle, longueur affichée en cm (1 cm = 1 carreau) */
    if (e.target.closest(".grad") && RD.wb && !RD.crayonOff && !RD.eraser && !RD.text && !RD.obj){
      const u = 34 * (RD.z || 1), rad = RG.a * Math.PI / 180, dx = Math.cos(rad), dy = Math.sin(rad), L = RG.n * u, tr = reg.querySelector(".trace"), lab = reg.querySelector("#wbRegL");
      const proj = m => Math.max(0, Math.min(L, (m.clientX - RG.x) * dx + (m.clientY - RG.y) * dy)), col = /^hl/.test(RD.color || "") ? "#24282c" : (RD.color || "#e2483d");
      const t0 = proj(e); let t1 = t0;
      const voir = () => { tr.hidden = false; tr.style.left = Math.min(t0, t1) + "px"; tr.style.width = Math.abs(t1 - t0) + "px"; tr.style.background = col; tr.style.height = Math.max(3, (RD.wPx || 4) * (RD.z || 1)) + "px"; lab.textContent = (Math.round(Math.abs(t1 - t0) / u * 10) / 10).toString().replace(".", ",") + " cm"; };
      voir();
      return { bouge: m => { t1 = proj(m); voir(); }, fin: () => { tr.hidden = true; lab.textContent = "cm"; if (Math.abs(t1 - t0) < 4) return;
        const c = document.getElementById("inkCanvas"), r = c.getBoundingClientRect(), q = t => [(RG.x + dx * t - r.left) / r.width, (RG.y + dy * t - r.top) / r.height];
        snapInk(); const k = inkKey(); (INKS[k] = INKS[k] || []).push({ t:"ligne", c:col, w:RD.wPx || 4, p:[q(t0), q(t1)] }); redrawInk(); try { planifierSauvegarde(); } catch(x){} } }; }
    if (e.target.closest(".rot")){ return { bouge: m => { let a = Math.atan2(m.clientY - RG.y, m.clientX - RG.x) * 180 / Math.PI; const s = Math.round(a / 15) * 15; if (Math.abs(a - s) < 3) a = s; RG.a = a; poser(); } }; }
    const dx = e.clientX - RG.x, dy = e.clientY - RG.y; return { bouge: m => { RG.x = m.clientX - dx; RG.y = m.clientY - dy; poser(); } }; });
  { /* rapporteur : demi-cercle gradué centré sur le 0 de la règle (angles mesurés à partir du bord gradué) */
    const R = 170, P = (r, a) => [(R + r * Math.cos(a * Math.PI / 180)).toFixed(1), (R - r * Math.sin(a * Math.PI / 180)).toFixed(1)]; let h = "";
    for (let a = 0; a <= 180; a += 5){ const l = a % 45 === 0 ? 20 : a % 15 === 0 ? 14 : 8, p = P(R, a), q = P(R - l, a); h += `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="#fff" stroke-width="${a % 15 ? 1 : 2}"/>`; }
    [22.5, 67.5, 112.5, 157.5].forEach(a => { const p = P(R, a), q = P(R - 16, a); h += `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="#F28A3C" stroke-width="2"/>`; });
    [0, 30, 45, 60, 90, 120, 135, 150, 180].forEach(a => { const p = P(R - 36, a); if (a % 180 === 0) p[1] = (p[1] - 12).toFixed(1); h += `<text x="${p[0]}" y="${p[1]}" text-anchor="middle" dominant-baseline="middle" font-size="15" font-weight="700" fill="#fff">${a}</text>`; });
    [22.5, 157.5].forEach(a => { const p = P(R - 34, a); h += `<text x="${p[0]}" y="${p[1]}" text-anchor="middle" dominant-baseline="middle" font-size="12" font-weight="700" fill="#F28A3C">${String(a).replace(".", ",")}</text>`; });
    const rp = reg.querySelector(".rap"); rp.innerHTML = `<svg width="${2 * R}" height="${R}" viewBox="0 0 ${2 * R} ${R}"><path d="M0 ${R}A${R} ${R} 0 0 1 ${2 * R} ${R}Z" fill="rgba(30,42,68,.72)" stroke="#EB6A22" stroke-width="2"/>${h}<circle cx="${R}" cy="${R}" r="4" fill="#EB6A22"/></svg>`;
    rp.style.cssText = `position:absolute;left:${-R}px;top:${-R - 2}px;width:${2 * R}px;height:${R}px;pointer-events:none`; }
  reg.addEventListener("click", e => { const b = e.target.closest("[data-a]"); if (b){ RG.a = -(+b.dataset.a); poser(); } if (e.target.closest(".brap")){ const rp = reg.querySelector(".rap"); rp.hidden = !rp.hidden; } if (e.target.closest(".rx")) reg.hidden = true; e.stopPropagation(); });
  setInterval(() => { if (!reg.hidden) poser(); }, 500);

  /* boutons Calculatrice et Règle sur la barre */
  const bouton = (id, mot, d, f) => { const b = document.createElement("button"); b.type = "button"; b.id = id; b.className = "wbonly"; b.dataset.mot = mot; b.title = mot; b.setAttribute("aria-label", mot); b.innerHTML = svg(d); b.onclick = e => { e.stopPropagation(); f(); };
    const plus = Q("#penPlus"); const nav = bar.querySelector(".wbq.nav"); bar.insertBefore(b, nav || plus); b.hidden = !RD.wb; return b; };
  const bC = bouton("wbCalcB", "Calcul", '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01"/>', () => { calc.hidden = !calc.hidden; });
  const bR = bouton("wbRegB", "Règle", '<path d="M3 16L16 3l5 5L8 21z"/><path d="M7 12l2 2M10 9l2 2M13 6l2 2"/>', () => { if (reg.hidden){ RG.x = Math.round(innerWidth * .22); RG.y = Math.round(innerHeight * .45); RG.a = 0; reg.hidden = false; poser(); } else reg.hidden = true; });
  setInterval(() => { bC.hidden = bR.hidden = !RD.wb; bC.classList.toggle("on", !calc.hidden); bR.classList.toggle("on", !reg.hidden); }, 400);
})();
