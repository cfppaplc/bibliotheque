/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — barres.js (sorti d'index.html le 15 nov.) */
/* ---- Reprendre où on était, signets, aide, mode classe, gros texte ---- */
function suivrePos(s){
  if (!RD.book || !RD.drv || !$("#reader").classList.contains("open")) return;   /* livre fermé : on ne touche pas à la position gardée */
  if (RD.first === undefined) RD.first = s.label;
  else if (!RD.armed && s.label !== RD.first) RD.armed = true;
  if (RD.armed){ POS[RD.book] = { n:parseInt(s.label, 10) || 1, tot:s.tot || RD.tot || 0, label:s.label, t:Date.now() }; ecrireLS("pos", POS); }
  majSignet();
}
function offrirReprise(){
  RD.offered = true;
  /* ouvert depuis la recherche ou un code QR : on va directement à la page demandée */
  if (RD.allerA){ const n = RD.allerA; RD.allerA = 0; RD.armed = true; RD.bouge = false; $("#resume").hidden = true;
    setTimeout(() => { try { RD.drv.goto(n); } catch(e){} setTimeout(() => { try { syncSecond(); poll(); } catch(e){} }, 300); }, 250);
    /* sur un ordinateur lent, certains livres reviennent tout seuls à la dernière page lue : on revérifie quelques fois */
    const livre = RD.book, sur = lbl => { const m = String(lbl || "").match(/\d+/g) || []; return m.some(x => +x === n); };
    [900, 1800, 3000, 4500].forEach(ms => setTimeout(() => { try { if (RD.book !== livre || !RD.drv || RD.bouge) return;
      if (!sur(RD.drv.state().label)){ RD.drv.goto(n); setTimeout(() => { try { syncSecond(); poll(); } catch(e){} }, 300); } } catch(e){} }, ms));
    return; }
  const sv = POS[RD.book], rp = (window.PREF && window.PREF().reprise) || "demander";
  if (sv && sv.n > 1 && (!sv.tot || sv.n < sv.tot) && rp !== "demander"){   /* préférence du prof : reprendre toujours / jamais, sans demander */
    if (rp === "toujours"){ setTimeout(() => { try { RD.drv.goto(sv.n); setTimeout(() => { syncSecond(); poll(); RD.armed = true; }, 400); } catch(e){ RD.armed = true; } }, 250); }
    else RD.armed = true;
    return; }
  if (sv && sv.n > 1 && (!sv.tot || sv.n < sv.tot)){
    $("#resumeTxt").textContent = "Reprendre à la page " + (sv.label || sv.n) + " ?";
    $("#resume").hidden = false;
    const bar = $("#resumeBar"); bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = "";   /* la barre repart à 15 s */
    clearTimeout(RD.resT); RD.resT = setTimeout(() => { $("#resume").hidden = true; }, 15000);
  } else RD.armed = true;
}
$("#resumeYes").onclick = () => {
  const sv = POS[RD.book]; $("#resume").hidden = true; clearTimeout(RD.resT);
  if (sv && RD.drv){ RD.drv.goto(sv.n); setTimeout(() => { syncSecond(); poll(); RD.armed = true; }, 400); }
};
$("#resumeNo").onclick = () => { $("#resume").hidden = true; clearTimeout(RD.resT); };

const MARKS = lireLS("marks", {});
/* Un signet = { p:"page", nom:"nom choisi (facultatif)" }. Les anciens signets (simple page) sont convertis. */
Object.keys(MARKS).forEach(k => { MARKS[k] = (MARKS[k] || []).map(m => typeof m === "string" ? { p:m, nom:"" } : m); });
const nomSignet = m => m.nom || ("Page " + m.p);
function majSignet(){ $("#tbMark").classList.toggle("on", (MARKS[RD.book] || []).some(m => m.p === RD.label)); }
function toggleMark(){
  if (!RD.book || !RD.label) return;
  const a = MARKS[RD.book] || (MARKS[RD.book] = []), i = a.findIndex(m => m.p === RD.label);
  if (i >= 0){ a.splice(i, 1); aviser("Signet retiré."); }
  else { a.push({ p:RD.label, nom:"" }); a.sort((x, y) => (parseInt(x.p, 10) || 0) - (parseInt(y.p, 10) || 0)); aviser("Signet ajouté à la page " + RD.label + "."); }
  ecrireLS("marks", MARKS); majSignet();
}
$("#tbMark").onclick = toggleMark;
function toggleHelp(){ closeMenu(true); $("#help").hidden = !$("#help").hidden; }
$("#tbHelp").onclick = toggleHelp;
$("#help").addEventListener("click", e => { if (e.target.id === "help") $("#help").hidden = true; });


function setGros(on){
  document.body.classList.toggle("gros", on); $("#grosBtn").classList.toggle("on", on); $("#grosBtn").setAttribute("aria-pressed", on);
  try { localStorage.setItem("gros", on ? "1" : "0"); } catch(e){}
}
$("#grosBtn").onclick = () => setGros(!document.body.classList.contains("gros"));
$("#wbBtn").onclick = () => ouvrirTableauBlanc();   /* accès rapide au tableau blanc (mêmes dessins que depuis le tableau de bord) */
try { if (localStorage.getItem("gros") === "1") setGros(true); } catch(e){}
function setClasse(on){
  document.body.classList.toggle("classe", on); $("#classeBtn").classList.toggle("on", on);
  try {
    if (on){ view = "all"; query = ""; $("#search").value = ""; render(); const r = document.documentElement.requestFullscreen; if (r) r.call(document.documentElement).catch(() => {}); }
    else if (document.fullscreenElement) document.exitFullscreen();
  } catch(e){}
}
$("#classeBtn").onclick = () => setClasse(true);
$("#classeOut").onclick = () => setClasse(false);
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement && document.body.classList.contains("classe") && !$("#reader").classList.contains("open")) setClasse(false);
});

/* ---- Pointeur laser et écran noir ---- */
function placerLaser(x, y){ if (!RD.laser) return; const l = $("#laser"); l.hidden = false; l.style.left = x + "px"; l.style.top = y + "px"; }
function toggleLaser(){
  RD.laser = !RD.laser; $("#tbLaser").classList.toggle("on", RD.laser);
  if (!RD.laser) $("#laser").hidden = true;
  majCurseur();
  if (RD.laser) aviser("Pointeur laser : bouge la souris. Touche O pour l'arrêter.");
}
$("#tbLaser").onclick = toggleLaser;
$("#reader").addEventListener("mousemove", e => placerLaser(e.clientX, e.clientY));
$("#reader").addEventListener("mouseleave", () => { $("#laser").hidden = true; });
function toggleNoir(){ $("#noir").hidden = !$("#noir").hidden; }
$("#tbNoir").onclick = toggleNoir;
$("#noir").onclick = () => { $("#noir").hidden = true; };
document.body.classList.add("intro"); setTimeout(() => document.body.classList.remove("intro"), 1600);
/* ---- Barres d'outils qui se retirent toutes seules : le livre prend toute la place ---- */
const BAR = { fixe:false, t:null };
try { BAR.fixe = localStorage.getItem("barresFixes") === "1"; } catch(e){}
function barresOccupees(){
  const m = sel => { try { return $(sel).matches(":hover"); } catch(e){ return false; } };
  return m("#tb") || $("#tb").classList.contains("edit") || m(".reader-bar") || m("#penBar") || m("#timer") || document.activeElement === $("#tbPg")
    || !$("#mmenu").hidden || !$("#help").hidden;
}
function planifierBarres(ms){
  clearTimeout(BAR.t);
  if (BAR.fixe) return;
  BAR.t = setTimeout(() => {
    if (!$("#reader").classList.contains("open") || BAR.fixe) return;
    if (barresOccupees()){ planifierBarres(1500); return; }
    $("#reader").classList.add("calme");
  }, ms || 8000);   /* 10 nov. : 3,2 s → 8 s (« disparaît trop tôt ») */
}
/* 13 nov. (« trop sensible pour réapparaître ») : la souris doit rester 0,4 s tout près du bord (28 px en haut, 40 px en bas),
   sans bouton enfoncé; avant : 70 / 110 px, aussitôt. */
const BORD = { t:null };
function bordBarres(y, h){
  const r = $("#reader"); if (!r || !r.classList.contains("calme")){ clearTimeout(BORD.t); BORD.t = null; return; }
  if (y < 28 || y > h - 40){ if (!BORD.t) BORD.t = setTimeout(() => { BORD.t = null; afficherBarres(); }, 400); }
  else { clearTimeout(BORD.t); BORD.t = null; }
}
function afficherBarres(){
  const r = $("#reader"); if (!r.classList.contains("open")) return;
  r.classList.remove("calme"); planifierBarres();
}
/* Tableau interactif (7 nov.) : barres cachées, un toucher du doigt ou du crayon en haut de l'écran les fait revenir (Retour, etc.) au lieu de tracer un trait.
   À la souris, c'est déjà fait en approchant du haut (mousemove). */
window.addEventListener("pointerdown", e => {
  if (e.pointerType === "mouse" || e.clientY > 56) return;
  const r = $("#reader"); if (!r || !r.classList.contains("open") || !r.classList.contains("calme")) return;
  e.preventDefault(); e.stopImmediatePropagation(); afficherBarres();
}, true);
function basculerBarres(){
  const r = $("#reader");
  if (BAR.fixe){ return; }
  if (r.classList.contains("calme")) afficherBarres(); else { clearTimeout(BAR.t); r.classList.add("calme"); }
}
function majEpingle(){ $("#tbPin").classList.toggle("on", BAR.fixe); $("#tbPin").setAttribute("aria-pressed", String(BAR.fixe)); }
function initBarres(){
  const r = $("#reader"); r.classList.toggle("auto", !BAR.fixe); r.classList.remove("calme"); majEpingle();
  planifierBarres(4500);
}
$("#tbPin").onclick = () => {
  BAR.fixe = !BAR.fixe; try { localStorage.setItem("barresFixes", BAR.fixe ? "1" : "0"); } catch(e){}
  const r = $("#reader"); r.classList.toggle("auto", !BAR.fixe); r.classList.remove("calme"); majEpingle();
  if (!BAR.fixe) planifierBarres(); else clearTimeout(BAR.t);
  aviser(BAR.fixe ? "Barres fixes : le livre est un peu plus petit." : "Barres automatiques : elles se cachent après quelques secondes.");
  setTimeout(() => { try { sizeInner(); } catch(e){} window.dispatchEvent(new Event("resize")); }, 60);
};
$("#barresHandle").onclick = afficherBarres;
document.addEventListener("mousemove", e => { if (!e.buttons && $("#reader").classList.contains("open")) bordBarres(e.clientY, window.innerHeight); }, { passive:true });
document.addEventListener("fullscreenchange", () => { if ($("#reader").classList.contains("open")) setTimeout(afficherBarres, 100); });


/* ---- Imprimer la page affichée (ou une des deux pages d'une double page) ---- */
function pagesAffichees(win, doc){
  return [...doc.querySelectorAll(".page")].filter(x => { const r = x.getBoundingClientRect(), cs = win.getComputedStyle(x);
    return cs.display !== "none" && cs.visibility !== "hidden" && r.width > 0 && r.right > 2 && r.left < win.innerWidth - 2 && r.bottom > 2 && r.top < win.innerHeight - 2; }).sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
}
const NEUTRE_IMP = { transform:"none", zoom:"1", margin:"0", padding:"0", overflow:"visible", inset:"auto", position:"static", width:"auto", height:"auto", display:"block", perspective:"none", filter:"none", opacity:"1", visibility:"visible", "max-width":"none", "max-height":"none", "min-height":"0" };
function fragImpression(doc, pg){      /* copie d'une page, avec ses conteneurs remis à plat (sans zoom ni décalage) */
  const copie = pg.cloneNode(true); copie.querySelectorAll("script").forEach(n => n.remove());
  ["transform", "zoom", "margin", "opacity", "visibility", "inset", "perspective", "filter"].forEach(k => copie.style.setProperty(k, NEUTRE_IMP[k], "important"));
  copie.style.setProperty("position", "relative", "important"); copie.style.setProperty("width", "816px", "important"); copie.style.setProperty("height", "1056px", "important");
  copie.style.setProperty("overflow", "hidden", "important"); copie.style.setProperty("break-after", "page", "important"); copie.style.setProperty("page-break-after", "always", "important");
  let h = copie.outerHTML; const chaine = []; for (let n = pg.parentElement; n && n !== doc.body && n !== doc.documentElement; n = n.parentElement) chaine.push(n);
  chaine.forEach(n => { const w = n.cloneNode(false); w.removeAttribute("style"); Object.keys(NEUTRE_IMP).forEach(k => w.style.setProperty(k, NEUTRE_IMP[k], "important")); w.innerHTML = h; h = w.outerHTML; });
  return h;
}
function htmlImpression(doc, pgs, frags){
  const head = doc.createElement("head"); doc.querySelectorAll("style,link[rel=stylesheet],meta[charset]").forEach(n => head.appendChild(n.cloneNode(true)));   /* certains livres rangent leurs styles dans le corps */
  const corps = (frags || pgs.map(pg => fragImpression(doc, pg))).join("");
  return "<!doctype html><html lang=\"fr\"><head>" + head.innerHTML + "<style>@page{size:816px 1056px;margin:0}html,body{margin:0!important;padding:0!important;background:#fff!important;overflow:visible!important;height:auto!important;width:auto!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}"
    + "*{animation-duration:.001s!important;animation-delay:0s!important;animation-fill-mode:both!important;animation-iteration-count:1!important;transition:none!important}</style></head><body class=\"" + (doc.body.className || "") + "\">" + corps + "</body></html>";
}
function lancerImpression(html){
  const f = document.createElement("iframe"); f.setAttribute("aria-hidden", "true"); f.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden";
  f.srcdoc = html; document.body.appendChild(f);
  f.onload = () => { const w = f.contentWindow; Promise.resolve(w.document.fonts && w.document.fonts.ready).catch(() => {}).then(() => setTimeout(() => { try { w.focus(); w.print(); } catch(e){ aviser("Impression impossible ici : ouvre bibliotheque.html directement dans Edge ou Chrome."); } }, 500)); };
  setTimeout(() => f.remove(), 120000);
}
const attendre = ms => new Promise(r => setTimeout(r, ms));
function listePages(txt, tot){
  const out = [];
  String(txt || "").split(/[,;\s]+/).filter(Boolean).forEach(t => { const m = /^(\d+)(?:\s*[-–à]\s*(\d+))?$/.exec(t); if (!m) return; let a = +m[1], b = m[2] ? +m[2] : a; if (a > b) [a, b] = [b, a];
    for (let n = Math.max(1, a); n <= Math.min(tot || 9999, b); n++) if (!out.includes(n)) out.push(n); });
  return out;
}
async function imprimerPlusieurs(nums, doc, win){
  const drv = RD.drv, retour = parseInt(drv.state().label, 10) || 1, frags = []; let n0 = 0;
  aviser("Préparation de " + nums.length + " page" + (nums.length > 1 ? "s" : "") + "…");
  for (const n of nums){
    drv.goto(n);
    for (let t = 0; t < 40; t++){ await attendre(100); const l = String(drv.state().label || "").match(/\d+/g) || []; if (l.some(x => +x === n)) break; }   /* on attend que la page demandée soit bien affichée */
    await attendre(800);
    const pgs = pagesAffichees(win, doc); if (!pgs.length) continue;
    const lab = String(drv.state().label || "").match(/\d+/g) || [], a = +lab[0] || n;
    const pg = pgs.length > 1 ? (n === a ? pgs[0] : pgs[pgs.length - 1]) : pgs[0];
    frags.push(fragImpression(doc, pg)); n0++;
  }
  drv.goto(retour);
  if (!frags.length){ aviser("Aucune page à imprimer."); return; }
  lancerImpression(htmlImpression(doc, null, frags));
}
function imprimerPage(){
  const fr = $("#readerFrame"); let win, doc; try { win = fr.contentWindow; doc = fr.contentDocument; } catch(e){}
  if (!doc || !doc.body){ aviser("Ouvre d'abord un livre."); return; }
  const pgs = pagesAffichees(win, doc);
  if (!pgs.length){ aviser("Aucune page à imprimer."); return; }
  const st = RD.drv.state(), lab = String(st.label || "").match(/\d+/g) || [], tot = st.tot || 0;
  const bs = "min-height:44px;border-radius:10px;border:1px solid #555;background:#2a2a2d;color:#fff;font:inherit;cursor:pointer;padding:0 14px";
  const box = document.createElement("div"); box.style.cssText = "position:fixed;inset:0;z-index:500;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55)";
  box.innerHTML = '<div style="background:#1c1c1e;color:#eee;border:1px solid #3a3a3e;border-radius:14px;padding:18px 20px;font:600 1rem system-ui,sans-serif;display:flex;flex-direction:column;gap:10px;min-width:290px;max-width:92vw"><div style="text-align:center;margin-bottom:4px">Imprimer</div>'
    + (pgs.length > 1 ? '<button data-i="0" style="' + bs + '">Page de gauche' + (lab[0] ? " (" + lab[0] + ")" : "") + '</button><button data-i="1" style="' + bs + '">Page de droite' + (lab.length > 1 ? " (" + lab[lab.length - 1] + ")" : "") + '</button><button data-i="2" style="' + bs + '">Les deux pages affichées</button>'
        : '<button data-i="0" style="' + bs + '">Page affichée' + (lab[0] ? " (" + lab[0] + ")" : "") + '</button>')
    + '<div style="font-weight:500;color:#bbb;margin-top:6px">Ou plusieurs pages' + (tot ? " (1 à " + tot + ")" : "") + ' :</div>'
    + '<input id="prtPages" inputmode="numeric" autocomplete="off" placeholder="ex. 12-17, 20" style="min-height:44px;border-radius:10px;border:1px solid #555;background:#111;color:#fff;font:inherit;padding:0 12px">'
    + '<button data-i="m" style="' + bs + ';background:#2f6fdb;border-color:#2f6fdb">Imprimer ces pages</button>'
    + '<button data-i="x" style="min-height:40px;border-radius:10px;border:0;background:transparent;color:#aaa;font:inherit;cursor:pointer">Annuler</button></div>';
  document.body.appendChild(box);
  const inp = box.querySelector("#prtPages"); inp.addEventListener("keydown", e => { e.stopPropagation(); if (e.key === "Enter") box.querySelector('[data-i="m"]').click(); if (e.key === "Escape") box.remove(); });
  box.addEventListener("click", e => { const b = e.target.closest("button"); if (e.target === box || (b && b.dataset.i === "x")){ box.remove(); return; } if (!b) return;
    const i = b.dataset.i;
    if (i === "m"){ const nums = listePages(inp.value, tot); if (!nums.length){ aviser("Écris les pages à imprimer, par exemple 12-17, 20."); return; } if (nums.length > 100){ aviser("100 pages au maximum à la fois."); return; } box.remove(); imprimerPlusieurs(nums, doc, win); return; }
    box.remove(); lancerImpression(htmlImpression(doc, i === "2" ? pgs : [pgs[+i]])); });
}
$("#tbPrint").onclick = imprimerPage;
$("#tbQr").onclick = () => montrerQr();
window.__htmlImpression = htmlImpression;

/* ---- Téléphone : barre d'onglets et feuille « Plus » (renvoient vers les boutons existants) ---- */
(function(){
  const bar = document.getElementById("tabbar"), ov = document.getElementById("plusOv"); if (!bar) return;
  const onglet = t => bar.querySelectorAll("[data-tab]").forEach(b => b.classList.toggle("on", b.dataset.tab === t));
  const vue = v => { const a = document.querySelector('nav a[data-view="' + v + '"]'); if (a) a.click(); window.scrollTo({ top:0, behavior:"smooth" }); onglet(v); };
  bar.addEventListener("click", e => { const b = e.target.closest("[data-tab]"); if (!b) return;
    const t = b.dataset.tab;
    if (t === "all" || t === "fav") vue(t);
    else if (t === "qn") { const q = document.getElementById("quoiNeuf"); if (q) q.click(); }
    else if (t === "plus") ov.hidden = false; });
  const fermer = () => { ov.hidden = true; };
  ov.addEventListener("click", e => { if (e.target === ov) { fermer(); return; } const b = e.target.closest("[data-plus]"); if (!b) return; fermer();
    const k = b.dataset.plus, clic = id => { const x = document.getElementById(id); if (x) x.click(); };
    if (k === "aide") clic("lienAide"); else if (k === "plans") clic("planBtn"); else if (k === "activites") clic("actBtn"); else if (k === "sim") clic("simBtn"); else if (k === "accueil") clic("accueilBtn"); else if (k === "gros") clic("grosBtn"); else if (k === "wb") clic("wbBtn"); else if (k === "theme") clic("themeBtn"); else if (k === "compte") clic("compteBtn"); });
  /* « Ma liste » et le point rouge de « Quoi de neuf » suivent ceux de l'en-tête */
  const sync = () => { const lf = document.querySelector('nav a[data-view="fav"]'), qp = document.getElementById("qnPoint");
    bar.querySelector('[data-tab="fav"]').hidden = !lf || lf.hidden; bar.querySelector(".tab-point").hidden = !qp || qp.hidden;
    const act = document.querySelector("nav a[data-view].active"); if (act) onglet(act.dataset.view); };
  new MutationObserver(sync).observe(document.querySelector("header nav"), { attributes:true, subtree:true, attributeFilter:["hidden", "class"] });
  sync();
})();
/* ---- Barre d'outils : menu déroulant « Plus d'outils » + boutons déplaçables ---- */
(function(){
  const tb = $("#tb"), more = $("#tbMore"), pop = $("#tbPop"), grid = $("#tbGrid");
  const MOV = ["tbPen","tbAns","tbAnim","tbZo","tbZv","tbZi","tbTimer","tbSpot","tbCache","tbWb","tbMenu","tbLaser","tbNoir","tbMark","tbHelp","tbDbl","tbPin","tbPrint","tbQr","tbTele","tbFs"];
  const DEF = { bar:["tbAns","tbMenu","tbPen","tbWb","tbZv","tbDbl","tbFs","tbTele"], menu:["tbAnim","tbTimer","tbSpot","tbCache","tbLaser","tbNoir","tbMark","tbHelp","tbPin","tbPrint","tbQr","tbZo","tbZi"] };   /* 9 nov. : groupes Présenter · Écrire · Affichage; zoom − / + dans « Plus d'outils » (roulette et pincement suffisent) */
  MOV.forEach(id => $("#" + id).classList.add("mov"));
  const el = id => document.getElementById(id);
  const etiquette = b => { let l = b.querySelector(".tbl"); if (grid.contains(b)){ if (!l){ l = document.createElement("span"); l.className = "tbl"; b.appendChild(l); } l.textContent = b.getAttribute("aria-label") || b.title; } else if (l) l.remove(); };
  /* téléphone : une seule rangée (page précédente, numéro, page suivante, réponses, modules, plus) */
  const TEL = matchMedia("(max-width:640px)").matches;
  const DEF_TEL = { bar:["tbAns","tbMenu"], menu:["tbPen","tbQr","tbMark","tbAnim","tbZo","tbZv","tbZi","tbTimer","tbSpot","tbCache","tbWb","tbLaser","tbNoir","tbHelp","tbDbl","tbPin","tbPrint","tbFs","tbTele"] };
  const lire = () => { const L = lireLS(TEL ? "tbLayoutTel" : "tbLayout3", null); const ok = L && Array.isArray(L.bar) && Array.isArray(L.menu); return ok ? L : TEL ? DEF_TEL : DEF; };
  const appliquer = L => {
    const vus = new Set(), place = (id, cont, avant) => { const b = el(id); if (!b || vus.has(id) || !MOV.includes(id)) return; vus.add(id); if (avant) cont.insertBefore(b, avant); else cont.appendChild(b); };
    L.bar.forEach(id => place(id, tb, more)); L.menu.forEach(id => place(id, grid));
    MOV.forEach(id => { if (!vus.has(id)) place(id, DEF.menu.includes(id) ? grid : tb, DEF.menu.includes(id) ? null : more); });
    MOV.forEach(id => etiquette(el(id)));
  };
  const sauver = () => { try { localStorage.setItem(TEL ? "tbLayoutTel" : "tbLayout3", JSON.stringify({ bar:MOV.filter(id => el(id).parentNode === tb).sort((a, b) => (el(a).compareDocumentPosition(el(b)) & 4) ? -1 : 1), menu:[...grid.children].map(b => b.id) })); } catch(e){} };
  appliquer(lire());
  const fermer = () => { if (tb.classList.contains("edit")) return; pop.classList.remove("open"); more.setAttribute("aria-expanded", "false"); more.classList.remove("on"); };
  const ouvrir = () => { pop.classList.add("open"); more.setAttribute("aria-expanded", "true"); more.classList.add("on"); };
  more.onclick = e => { e.stopPropagation(); if (pop.classList.contains("open")){ tb.classList.remove("edit"); fermer(); } else ouvrir(); };
  $("#tbOrg").onclick = () => { tb.classList.toggle("edit"); $("#tbOrg").textContent = tb.classList.contains("edit") ? "✔ Terminé" : "✎ Organiser"; if (!tb.classList.contains("edit")) sauver(); };
  $("#tbRaz").onclick = () => { try { localStorage.removeItem(TEL ? "tbLayoutTel" : "tbLayout3"); } catch(e){} appliquer(TEL ? DEF_TEL : DEF); };
  /* un clic sur un outil du menu le referme (sauf en mode organiser) */
  grid.addEventListener("click", () => setTimeout(fermer, 0));
  document.addEventListener("pointerdown", e => { if (pop.classList.contains("open") && !tb.classList.contains("edit") && !pop.contains(e.target) && e.target !== more && !more.contains(e.target)) fermer(); }, true);
  /* mode organiser : pas d'action sur les boutons, on les glisse */
  tb.addEventListener("click", e => { if (tb.classList.contains("edit") && e.target.closest(".mov")){ e.stopPropagation(); e.preventDefault(); } }, true);
  let D = null;
  tb.addEventListener("pointerdown", e => {
    if (!tb.classList.contains("edit")) return; const b = e.target.closest(".mov"); if (!b) return;
    e.preventDefault(); const r = b.getBoundingClientRect(), g = b.cloneNode(true); g.removeAttribute("id"); g.className = "tbghost"; g.style.cssText = "left:" + r.left + "px;top:" + r.top + "px;width:" + r.width + "px;height:" + r.height + "px";
    document.body.appendChild(g); b.classList.add("drag"); D = { b, g, dx:e.clientX - r.left, dy:e.clientY - r.top };
  });
  document.addEventListener("pointermove", e => {
    if (!D) return; D.g.style.left = e.clientX - D.dx + "px"; D.g.style.top = e.clientY - D.dy + "px";
    const t = document.elementFromPoint(e.clientX, e.clientY); if (!t) return;
    const cible = t.closest(".mov");
    if (cible && cible !== D.b){ const r = cible.getBoundingClientRect(), apres = (e.clientY > r.top + r.height * .75) || (Math.abs(e.clientY - (r.top + r.height / 2)) <= r.height * .25 && e.clientX > r.left + r.width / 2); cible.parentNode.insertBefore(D.b, apres ? cible.nextSibling : cible); etiquette(D.b); }
    else if (!cible && grid.contains(t) && t === grid){ grid.appendChild(D.b); etiquette(D.b); }
    else if (!cible && (t === tb || (tb.contains(t) && !pop.contains(t) && !t.closest("button,input")))){ tb.insertBefore(D.b, more); etiquette(D.b); }
  });
  const fin = () => { if (!D) return; D.g.remove(); D.b.classList.remove("drag"); D = null; sauver(); };
  document.addEventListener("pointerup", fin); document.addEventListener("pointercancel", fin);
})();

initDonnees();
