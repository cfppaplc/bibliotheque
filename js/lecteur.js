/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — lecteur.js (sorti d'index.html le 15 nov.) */
/* ---- Projecteur, cache, minuterie ---- */
(function(){
  const spot = $("#spot");
  spot.addEventListener("pointermove", e => { const r = spot.getBoundingClientRect();
    spot.style.setProperty("--x", (e.clientX - r.left) + "px"); spot.style.setProperty("--y", (e.clientY - r.top) + "px"); });
  spot.addEventListener("wheel", e => { e.preventDefault(); RD.r = Math.max(60, Math.min(500, RD.r + (e.deltaY < 0 ? 20 : -20)));
    spot.style.setProperty("--r", RD.r + "px"); }, { passive:false });
  const h = $("#cacheHandle"); let drag = false;
  h.addEventListener("pointerdown", e => { drag = true; h.setPointerCapture(e.pointerId); });
  h.addEventListener("pointermove", e => { if (!drag) return; const r = $("#rinner").getBoundingClientRect();
    $("#cache").style.top = Math.max(0, Math.min(r.height - 30, e.clientY - r.top)) + "px"; });
  h.addEventListener("pointerup", () => { drag = false; });
  const t = $("#timer"), th = $("#timerTime"); let d = null;
  th.addEventListener("pointerdown", e => { const r = t.getBoundingClientRect(); d = { dx:e.clientX - r.left, dy:e.clientY - r.top }; th.setPointerCapture(e.pointerId); });
  th.addEventListener("pointermove", e => { if (!d) return; const p = $("#reader").getBoundingClientRect();
    t.style.left = (e.clientX - p.left - d.dx) + "px"; t.style.top = (e.clientY - p.top - d.dy) + "px"; t.style.right = "auto"; });
  th.addEventListener("pointerup", () => { d = null; });
})();
const TM = { secs:300, left:300, run:false, end:0, id:null };
const fmt = s => { s = Math.max(0, Math.ceil(s)); return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); };
function tmRender(){ if (!TM.edit) $("#timerTime").textContent = fmt(TM.left); setIcn($("#tmGo"), TM.run ? "pause" : "play"); $("#timer").classList.toggle("done", TM.left <= 0); }
let SON = true; try { SON = localStorage.getItem("son") !== "0"; } catch(e){}
let AUDIO = null;
function audioPret(){ try { AUDIO = AUDIO || new (window.AudioContext || window.webkitAudioContext)(); if (AUDIO.state === "suspended") AUDIO.resume(); } catch(e){} }
function beep(){
  if (!SON) return;
  audioPret(); if (!AUDIO) return;
  try {
    const t0 = AUDIO.currentTime + .05;
    for (let i = 0; i < 4; i++){
      const o = AUDIO.createOscillator(), g = AUDIO.createGain(), t = t0 + i * .6;
      o.type = "sine"; o.frequency.value = i % 2 ? 660 : 880; o.connect(g); g.connect(AUDIO.destination);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(.35, t + .03); g.gain.exponentialRampToValueAtTime(.001, t + .5);
      o.start(t); o.stop(t + .52);
    }
  } catch(e){}
}
function majSon(){ setIcn($("#tmSon"), SON ? "bell" : "bellOff"); }
setIcn($("#tmReset"), "reset");
$("#tmSon").onclick = () => { SON = !SON; try { localStorage.setItem("son", SON ? "1" : "0"); } catch(e){} majSon(); if (SON){ audioPret(); beep(); } };
majSon();
function tmTick(){ TM.left = (TM.end - Date.now()) / 1000; if (TM.left <= 0){ TM.left = 0; TM.run = false; clearInterval(TM.id); beep(); } tmRender(); }
function tmAdj(d){ TM.secs = Math.max(60, TM.secs + d); if (TM.run) TM.end += d * 1000; else TM.left = TM.secs; tmRender(); }
$("#tmGo").onclick = () => {
  if (TM.run){ TM.run = false; clearInterval(TM.id); }
  else { audioPret(); if (TM.left <= 0) TM.left = TM.secs; TM.run = true; TM.end = Date.now() + TM.left * 1000; TM.id = setInterval(tmTick, 250); }
  tmRender();
};
$("#tmMinus").onclick = () => tmAdj(-60);
$("#tmPlus").onclick = () => tmAdj(60);
/* Double-clic sur le temps : on tape la durée (5 = 5 min, 7:30 = 7 min 30 s, 45s = 45 secondes) */
function tmLire(v){
  v = String(v).trim().toLowerCase().replace(",", ".").replace(/\s+/g, "");
  let m;
  if ((m = /^(\d{1,3}):(\d{1,2})$/.exec(v))) return +m[1] * 60 + Math.min(59, +m[2]);
  if ((m = /^(\d{1,4})s(?:ec)?$/.exec(v))) return +m[1];
  if ((m = /^(\d{1,3})(?:\.(\d+))?(?:m|min)?$/.exec(v))) return Math.round(parseFloat(m[1] + "." + (m[2] || "0")) * 60);
  return null;
}
function tmEditer(){
  if (TM.edit) return;
  const th = $("#timerTime"), cur = fmt(TM.left);
  TM.edit = true; th.textContent = "";
  const inp = document.createElement("input");
  inp.className = "tm-edit"; inp.value = cur; inp.inputMode = "text"; inp.maxLength = 6; inp.setAttribute("aria-label", "Durée du minuteur : minutes, ou minutes:secondes");
  th.appendChild(inp);
  const fin = ok => {
    if (!TM.edit) return; TM.edit = false;
    const n = ok ? tmLire(inp.value) : null;
    inp.remove();
    if (ok && n === null) aviser("Durée non comprise. Exemples : 5, 7:30, 45s.");
    else if (n !== null){
      const sec = Math.max(1, Math.min(5999, n));
      TM.secs = sec; TM.left = sec;
      if (TM.run) TM.end = Date.now() + sec * 1000;
    }
    tmRender();
  };
  inp.addEventListener("keydown", e => { e.stopPropagation(); if (e.key === "Enter"){ e.preventDefault(); fin(true); } else if (e.key === "Escape"){ e.preventDefault(); fin(false); } });
  inp.addEventListener("pointerdown", e => e.stopPropagation());
  inp.addEventListener("blur", () => fin(true));
  TM.fin = fin;
  inp.focus(); inp.select();
}
$("#timerTime").addEventListener("dblclick", e => { e.preventDefault(); tmEditer(); });
document.addEventListener("pointerdown", e => { if (TM.edit && TM.fin && !(e.target.closest && e.target.closest(".tm-edit"))) TM.fin(true); }, true);
window.addEventListener("blur", () => { if (TM.edit && TM.fin) TM.fin(true); });
$("#timerTime").title = "Double-clic pour changer le temps";
$("#tmReset").onclick = () => { TM.run = false; clearInterval(TM.id); TM.left = TM.secs; tmRender(); };

/* ---- État des outils ---- */
function refreshTools(){ try { if (window.majPopGomme) majPopGomme(); } catch(e){} { const t = $("#toast"); if (t && !t.hidden && /^Aucun outil choisi/.test(t.textContent) && (RD.eraser || RD.text || RD.obj || !RD.crayonOff)) t.hidden = true; }   /* l'avis « Aucun outil » disparaît dès qu'un outil est choisi */   /* fenêtre et cercle de la gomme suivent l'outil */ if (!RD.text) document.querySelectorAll(".inktxt").forEach(t => t.blur());   /* quitter l'outil Texte termine la case en cours */
  try { majCurseur(); } catch(e){}
  const drawing = RD.pen || RD.wb;
  $("#tbPen").classList.toggle("on", RD.pen);
  $("#tbWb").classList.toggle("on", RD.wb);
  $("#tbSpot").classList.toggle("on", RD.spot);
  $("#tbCache").classList.toggle("on", RD.cache);
  $("#tbTimer").classList.toggle("on", !$("#timer").hidden);
  $("#wbBoard").hidden = !RD.wb;
  $("#spot").hidden = !RD.spot;
  $("#cache").hidden = !RD.cache;
  $("#penBar").hidden = !drawing;
  $("#inkCanvas").classList.toggle("live", drawing);
  $("#penE").classList.toggle("on", RD.eraser); $("#penT").classList.toggle("on", !!RD.text && !RD.eraser);
  document.querySelectorAll(".wbonly").forEach(e => { e.hidden = !RD.wb; });
  $("#reader").classList.toggle("wbon", !!RD.wb);   /* tableau blanc : la barre du livre (pages, zoom…) est cachée */
  $("#penO").hidden = false;   /* Formes et objets : partout (formes sur les livres; objets isométriques et électriques sur le tableau blanc) */
  if (RD.wb) majFond();
  setIcn($("#penS"), RD.shape || "libre"); $("#penS").classList.toggle("on", !!RD.shape && !RD.eraser); $("#penS").title = "Forme : " + SHAPE_NOM[RD.shape || ""] + " (clic pour changer)";
  const sw = document.querySelector('#penBar .sw[data-c="#24282c"]'); if (sw){ sw.style.setProperty("--c", wbSombre() ? "#f4f1ea" : "#24282c"); sw.setAttribute("aria-label", wbSombre() ? "Craie blanche" : "Noir"); }
  document.querySelectorAll("#penBar .sw").forEach(b => b.classList.toggle("on", !RD.eraser && b.dataset.c === RD.color)); if (RD.swx) RD.swx.classList.toggle("on", !RD.eraser && !document.querySelector("#penBar .sw.on"));
  if (RD.obj && !(RD.pen || RD.wb)) RD.obj = false;
  if (RD.obj && RD.objTab && RD.objTab !== "formes" && RD.objTab !== "plomb" && !RD.wb) RD.objTab = "formes";
  if (RD.sim && (!RD.obj || !modeElec())) simStop(true);
  $("#penO").classList.toggle("on", !!RD.obj);
  redrawInk(); if (!RD.text) SEL.s = null; if (!RD.obj) SELO.s = null; majBarTxt(); majSelTxt(); majObjUI();
}
function togglePen(){ RD.pen = !RD.pen; if (RD.pen) RD.spot = false; refreshTools(); }
function toggleWb(){
  RD.wb = !RD.wb; if (RD.wb){ RD.spot = false; RD.crayonOff = true; RD.eraser = false; RD.text = false; RD.obj = false; RD.formeK = null; RD.objKi = null; RD.objKe = null; try { SELO.s = null; } catch(e){} setTimeout(() => { try { aviser("Aucun outil choisi : touche le crayon pour écrire, ou touche une forme pour la choisir.", 3500); } catch(e){} }, 400); }   /* chaque ouverture : aucun outil choisi */
  const st = $("#rstage"); $("#reader").classList.toggle("wbon", !!RD.wb);
  $("#reader").classList.toggle("wblivre", !!RD.wb && RD.book !== "tableau-blanc");   /* tableau blanc ouvert par-dessus un livre : bouton « Revenir au livre » */
  if (RD.wb){ RD.z = zMin(); /* tableau blanc : toujours dézoomé à l'ouverture */ sizeInner(); st.scrollLeft = (st.scrollWidth - st.clientWidth) / 2; st.scrollTop = (st.scrollHeight - st.clientHeight) / 2; }
  else { RD.z = Math.max(1, RD.z); sizeInner(); st.scrollLeft = RD.mx || 0; st.scrollTop = RD.my || 0; }
  refreshTools();
}
function toggleSpot(){ RD.spot = !RD.spot; refreshTools(); }
function toggleCache(){ RD.cache = !RD.cache; refreshTools(); }
function toggleTimer(){ const t = $("#timer"); t.hidden = !t.hidden; tmRender(); refreshTools(); }
function toggleFs(){
  try {
    if (document.fullscreenElement){ document.exitFullscreen(); return; }
    document.documentElement.requestFullscreen().catch(() => aviser("Plein écran indisponible ici. Essaie la touche F11."));
  } catch(e){ aviser("Plein écran indisponible ici. Essaie la touche F11."); }
}
/* ---- Table des matières uniforme pour tous les livres ----
   Mêmes icônes (style de la barre d'outils) pour les mêmes sortes d'entrées, numéros pour les modules,
   lettre pour les parties, ordre des pages quand il est connu. */
const ICO_MOD = (() => {
  const s = d => '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  return {
    couverture: s('<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>'),
    table: s('<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r=".8"/><circle cx="4.5" cy="12" r=".8"/><circle cx="4.5" cy="18" r=".8"/>'),
    intro: s('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.5"/>'),
    formatif: s('<path d="M9 4h6v3H9z"/><path d="M15 5h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h3"/><path d="M9 14l2 2 4-4"/>'),
    lexique: s('<path d="M4 19l4.5-12L13 19M5.6 15h5.8"/><path d="M15 9h5M17.5 7v2M15.5 13c1.5 2 3.5 3 5 3M20 9c-.5 3-2.5 5.5-5 7"/>'),
    sources: s('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
    annexe: s('<path d="M20 11.5l-8.3 8.3a5 5 0 0 1-7-7l8.6-8.6a3.3 3.3 0 0 1 4.7 4.7l-8.6 8.6a1.7 1.7 0 0 1-2.4-2.4l7.9-7.9"/>'),
    projet: s('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>'),
    labo: s('<path d="M14.7 6.3a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3z"/><path d="M14.7 6.3L17 4l3 3-2.3 2.3"/>'),
    simulateur: s('<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/><path d="M10 8l4 2-4 2z" fill="currentColor"/>'),
    delais: s('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9.5 2.5h5"/>'),
    bravo: s('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>'),
    signet: s('<path d="M7 4h10v16l-5-4-5 4z"/>'),
    autre: s('<circle cx="12" cy="12" r="2.5" fill="currentColor"/>')
  };
})();
function sorteModule(t){
  const x = t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (/^annexe/.test(x)) return "annexe";
  if (/couverture/.test(x)) return "couverture";
  if (/table des matieres|sommaire/.test(x)) return "table";
  if (/^introduction|^intro\b|^avant-propos|^presentation/.test(x)) return "intro";
  if (/formatif|examen|evaluation finale|epreuve|test final/.test(x)) return "formatif";
  if (/lexique|glossaire|vocabulaire/.test(x)) return "lexique";
  if (/sources|references|bibliographie/.test(x)) return "sources";
  if (/laboratoire|atelier|cartes\b|jeu\b|jeux de role/.test(x)) return "labo";
  if (/projet|mise en situation|une semaine|etude de cas|cas pratique|fil conducteur/.test(x)) return "projet";
  if (/simulat/.test(x)) return "simulateur";
  if (/delais|aide-memoire/.test(x)) return "delais";
  if (/felicitation|bravo/.test(x)) return "bravo";
  if (/annexe|revision|tableaux/.test(x)) return "annexe";
  return "autre";
}
function uniformiserModules(mods){
  const out = mods.map((m, i) => {
    let text = String(m.text || "").replace(/^[\s▶►•★✓⏱]+/, "").replace(/\s+/g, " ").trim();
    const tag0 = String(m.tag || "").trim();
    const partie = /^partie\s+([a-z0-9]+)\s*[—:.-]?\s*(.*)$/i.exec(text);
    const num = /^(?:module|chapitre|chapter|competence|compétence)\s+(\d+)\s*[—:.-]?\s*(.*)$/i.exec(text);
    let tag, ico = null, kind = "module";
    if (partie){ tag = partie[1].toUpperCase(); kind = "partie"; text = "Partie " + tag + (partie[2] ? " — " + partie[2] : ""); }
    else if (num){ tag = num[1]; text = num[2] || text; }
    else {
      const k = sorteModule(text);
      const fort = ["couverture", "table", "intro", "formatif", "lexique", "sources", "bravo"].includes(k);   /* même si le livre leur donne un numéro */
      if ((k !== "autre" && (fort || !/^\d+$/.test(tag0))) || (k === "autre" && !/^\d+$/.test(tag0))){ kind = k; ico = ICO_MOD[k]; tag = ""; }
      else tag = tag0;
    }
    if (kind === "module" && !/^\d+$/.test(tag)){ const n = /^\d+$/.test(tag0) ? tag0 : ""; if (n) tag = n; else { kind = "autre"; ico = ICO_MOD.autre; tag = ""; } }
    return { ...m, text, tag, ico, kind, ordre:i, color:kind === "module" ? (m.color || "") : kind === "partie" ? "#9aa3ad" : "#6b7280" };
  });
  if (out.length && out.every(m => typeof m.page === "number" && !isNaN(m.page))) out.sort((a, b) => a.page - b.page || a.ordre - b.ordre);
  /* tous les livres commencent par la couverture dans la liste */
  if (out.length && !out.some(m => m.kind === "couverture") && RD.drv && RD.drv.goto)
    out.unshift({ kind:"couverture", ico:ICO_MOD.couverture, tag:"", text:"Couverture", color:"#6b7280", page:1, run:() => RD.drv.goto(1) });
  return out;
}
function openMenu(){
  const mods = RD.drv ? uniformiserModules(RD.drv.modules()) : [];
  if (!mods.length && !(MARKS[RD.book] || []).length){ aviser("Ce livre n'a pas de liste de modules ni de signets."); return; }
  RD.modsMenu = mods; RD.editMark = -1; RD.mmVue = ""; $("#mmQ").value = "";
  dessinerMenu(); tdmOutils();
  $("#help").hidden = true; $("#mmenu").hidden = false;
}
function dessinerMenu(){
  const mods = RD.modsMenu || [], marks = MARKS[RD.book] || [];
  let h = "";
  if (marks.length){
    h += `<div class="mm-h">Signets <span class="mm-sub">— ✏ pour renommer, ✕ pour retirer</span></div>`;
    h += marks.map((m, i) => i === RD.editMark
      ? `<div class="mmrow mm-edit"><input data-mname="${i}" value="${esc(m.nom)}" placeholder="Page ${esc(m.p)}" maxlength="60" aria-label="Nom du signet de la page ${esc(m.p)}"><button class="mmb ok" data-msave="${i}" aria-label="Enregistrer le nom">✓</button><button class="mmb" data-mcancel aria-label="Annuler">↩</button></div>`
      : `<div class="mmrow"><button class="mm" data-mark="${esc(m.p)}" style="--a:#fff200"><b>${ICO_MOD.signet}</b><span>${esc(nomSignet(m))}${m.nom ? ` <small>· page ${esc(m.p)}</small>` : ""}</span></button><button class="mmb" data-mren="${i}" aria-label="Renommer le signet" title="Renommer">✏</button><button class="mmb" data-mdel="${i}" aria-label="Retirer le signet" title="Retirer">✕</button></div>`).join("");
    if (mods.length) h += `<div class="mm-h">Modules</div>`;
  }
  const pc = tdmPageCourante(); let ici = -1;
  if (pc) mods.forEach((m, i) => { if (typeof m.page === "number" && m.page <= pc && (ici < 0 || m.page >= mods[ici].page)) ici = i; });
  const tot = (() => { try { return RD.drv.state().tot || 0; } catch(e){ return 0; } })();
  tdmEntete(pc, tot); RD.mmPc = pc;
  const finMod = i => { const n = mods.slice(i + 1).find(m => typeof m.page === "number" && m.page > mods[i].page); return n ? n.page - 1 : tot || mods[i].page; };
  h += mods.map((m, i) => { const ic = i === ici, f = typeof m.page === "number" ? finMod(i) : 0, nb = f && f >= m.page ? f - m.page + 1 : 0;
    const av = ic && nb ? Math.max(4, Math.round((pc - m.page + 1) / nb * 100)) : 0;
    return `<button class="mm mm-${m.kind || "module"}${ic ? " mm-ici" : ""}" data-i="${i}" style="--a:${esc(m.color || "#EB6A22")}"><b>${m.ico || esc(m.tag)}</b><span>${esc(m.text)}${ic && nb > 1 ? `<small class="mm-sous">Page ${pc - m.page + 1} sur ${nb} de ce module</small><i class="mm-av" style="--av:${av}%"></i>` : ""}</span>${ic ? '<em class="mm-tag">Tu es ici</em>' : typeof m.page === "number" ? `<small class="mm-p">p. ${m.page}</small>` : ""}</button>`; }).join("");
  const L = $("#mmenuList"); L.innerHTML = h;
  setTimeout(() => { const e = L.querySelector(".mm-ici"); if (e) e.scrollIntoView({ block:"center" }); }, 0);
  L.querySelectorAll(".mm[data-i]").forEach(b => b.onclick = () => { closeMenu(); mods[+b.dataset.i].run(); setTimeout(() => { syncSecond(); poll(); }, 300); });
  L.querySelectorAll(".mm[data-mark]").forEach(b => b.onclick = () => { closeMenu(); const n = parseInt(b.dataset.mark, 10); if (n && RD.drv) RD.drv.goto(n); setTimeout(() => { syncSecond(); poll(); }, 300); });
  L.querySelectorAll("[data-mren]").forEach(b => b.onclick = () => { RD.editMark = +b.dataset.mren; dessinerMenu(); const i = L.querySelector("[data-mname]"); if (i){ i.focus(); i.select(); } });
  L.querySelectorAll("[data-mdel]").forEach(b => b.onclick = () => {
    const a = MARKS[RD.book]; a.splice(+b.dataset.mdel, 1); ecrireLS("marks", MARKS); RD.editMark = -1; majSignet();
    if (!a.length && !(RD.modsMenu || []).length){ closeMenu(); } else dessinerMenu();
    aviser("Signet retiré.");
  });
  const sauver = i => { MARKS[RD.book][i].nom = (L.querySelector("[data-mname]").value || "").trim(); ecrireLS("marks", MARKS); RD.editMark = -1; dessinerMenu(); aviser("Signet renommé."); };
  L.querySelectorAll("[data-msave]").forEach(b => b.onclick = () => sauver(+b.dataset.msave));
  L.querySelectorAll("[data-mcancel]").forEach(b => b.onclick = () => { RD.editMark = -1; dessinerMenu(); });
  L.querySelectorAll("[data-mname]").forEach(inp => inp.addEventListener("keydown", e => {
    if (e.key === "Enter"){ e.preventDefault(); sauver(+inp.dataset.mname); }
    else if (e.key === "Escape"){ e.preventDefault(); e.stopPropagation(); RD.editMark = -1; dessinerMenu(); }
    else e.stopPropagation();
  }));
}
/* ---- Table des matières (7 nov., idée D de Jeremy) : panneau à droite, recherche, Animations / Exercices ---- */
function tdmDoc(){ try { return $("#readerFrame").contentDocument; } catch(e){ return null; } }
function tdmEntete(pc, tot){ if (!$("#mmOu")) return; $("#mmOu").textContent = pc ? "Page " + pc + (tot ? " sur " + tot : "") : ""; $("#mmProg").style.width = (pc && tot ? Math.round(pc / tot * 100) : 0) + "%"; }
/* « Tu es ici » en direct : appelé par poll() (aux 300 ms) pendant que la table est ouverte */
function tdmSuivre(){
  if ($("#mmenu").hidden || !RD.drv) return;
  const pc = tdmPageCourante(); if (!pc || pc === RD.mmPc) return;
  RD.mmPc = pc;
  if (RD.mmVue || $("#mmQ").value.trim().length >= 2){
    let tot = 0; try { tot = RD.drv.state().tot || 0; } catch(e){}
    tdmEntete(pc, tot);
    $("#mmenuList").querySelectorAll("[data-pg]").forEach(b => b.classList.toggle("mm-ici", +b.dataset.pg === pc));
  } else if (RD.editMark < 0) dessinerMenu();
}
function tdmPageCourante(){ try { return parseInt(RD.drv.state().label, 10) || 0; } catch(e){ return 0; } }
function tdmPages(){
  const d = tdmDoc(); if (!d) return [];
  if (RD.tdmCache && RD.tdmCache.d === d) return RD.tdmCache.p;
  const p = [...d.querySelectorAll(".page")].map((e, i) => {
    let h = [...e.querySelectorAll("h1,h2,h3,.titre,.title")].map(x => x.textContent.replace(/\s+/g, " ").trim()).find(t => t && t.length < 90 && !/^module\s/i.test(t)) || "";
    if (!h){ let best = 0; const w = e.ownerDocument.defaultView;   /* pas de titre balisé : le plus gros texte court de la page */
      [...e.querySelectorAll("*")].slice(0, 400).forEach(x => { const t = [...x.childNodes].filter(c => c.nodeType === 3).map(c => c.nodeValue).join("").replace(/\s+/g, " ").trim();
        if (t.length < 4 || t.length > 80 || /^module\s/i.test(t)) return; const f = parseFloat(w.getComputedStyle(x).fontSize) || 0; if (f > best + .5){ best = f; h = t; } });
      if (best < 17) h = ""; }
    const tw = e.ownerDocument.createTreeWalker(e, 4), mo = []; let nd; while ((nd = tw.nextNode())) if (!/^(SCRIPT|STYLE)$/.test(nd.parentNode.nodeName)) mo.push(nd.nodeValue);
    const txt = mo.join(" ").replace(/\s+/g, " ").replace(/ ([,.;:!?)])/g, "$1");
    const anim = !!e.querySelector('[class*="-st1"],[class*="dmc-"]') || /^\s*animation\b/i.test(h) || /\banim/i.test(e.className);
    const exo = !!e.querySelector(".reponse:not(.exa),.reponse-choix,.ans:not(.exa),input,textarea");
    return { n:i + 1, h, txt, anim, exo };
  });
  RD.tdmCache = { d, p }; return p;
}
function tdmOutils(){
  const P = tdmPages(), grp = k => { let n = 0, d = null; P.forEach(x => { if (!x[k]) return; const t = x.h || ""; if (!(d && d.t === t && d.f === x.n - 1)) n++; d = { t, f:x.n }; }); return n; };
  const na = grp("anim"), ne = grp("exo");
  const B = $("#mmPuces");
  const ic = d => '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  B.innerHTML = (na ? `<button data-vue="anim" class="${RD.mmVue === "anim" ? "on" : ""}">${ic('<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z" fill="currentColor"/>')}Animations <small>${na}</small></button>` : "")
    + (ne ? `<button data-vue="exo" class="${RD.mmVue === "exo" ? "on" : ""}">${ic('<path d="M9 4h6v3H9z"/><path d="M15 5h3v16H6V5h3"/><path d="M9 14l2 2 4-4"/>')}Exercices <small>${ne}</small></button>` : "");
  B.querySelectorAll("button").forEach(b => b.onclick = () => { RD.mmVue = RD.mmVue === b.dataset.vue ? "" : b.dataset.vue; $("#mmQ").value = ""; tdmOutils(); tdmListe(); });
  $("#mmQ").parentElement.hidden = !P.length;
}
function tdmListe(){
  const q = $("#mmQ").value.trim();
  if (!RD.mmVue && q.length < 2){ dessinerMenu(); return; }
  const P = tdmPages(), sans = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  let res, titre;
  if (q.length >= 2){
    const k = sans(q); titre = "Résultats pour « " + q + " »";
    res = P.filter(x => sans(x.txt).includes(k)).slice(0, 40).map(x => { const t = sans(x.txt), j = t.indexOf(k), a = Math.max(0, j - 40);
      return { n:x.n, t:x.h || "Page " + x.n, s:(a ? "…" : "") + x.txt.slice(a, j + k.length + 50).trim() + "…" }; });
  } else {
    titre = RD.mmVue === "anim" ? "Animations" : "Exercices";
    res = [];
    P.filter(x => RD.mmVue === "anim" ? x.anim : x.exo).forEach(x => { const t = x.h || "Page " + x.n, d = res[res.length - 1];
      if (d && d.t === t && d.fin === x.n - 1){ d.fin = x.n; d.s = "Pages " + d.n + " à " + x.n; } else res.push({ n:x.n, fin:x.n, t, s:"" }); });
  }
  const pc = tdmPageCourante();
  const L = $("#mmenuList");
  L.innerHTML = `<div class="mm-h">${esc(titre)} <span class="mm-sub">— ${res.length || "aucun"}${res.length === 40 ? "+" : ""}</span></div>`
    + res.map(r => `<button class="mm mm-res${r.n === pc ? " mm-ici" : ""}" data-pg="${r.n}" style="--a:${RD.mmVue === "anim" ? "#534AB7" : RD.mmVue === "exo" ? "#0F6E56" : "#185FA5"}"><b>${r.n}</b><span>${esc(r.t)}${r.s ? `<small class="mm-ext">${esc(r.s)}</small>` : ""}</span></button>`).join("");
  L.querySelectorAll("[data-pg]").forEach(b => b.onclick = () => { closeMenu(); if (RD.drv) RD.drv.goto(+b.dataset.pg); setTimeout(() => { syncSecond(); poll(); }, 300); });
  L.scrollTop = 0;
}
$("#mmQ").addEventListener("input", () => { if ($("#mmQ").value.trim().length >= 2) RD.mmVue = ""; tdmOutils(); tdmListe(); });
$("#mmQ").addEventListener("keydown", e => { e.stopPropagation(); if (e.key === "Escape") closeMenu(); if (e.key === "Enter"){ const b = $("#mmenuList [data-pg]"); if (b) b.click(); } });
$("#mmX").onclick = () => closeMenu();
function closeMenu(garderAide){ $("#noir").hidden = true; $("#mmenu").hidden = true; if (garderAide !== true) $("#help").hidden = true; }
function turn(dir){ if (Date.now() - (ZS.t || 0) < 350) return;   /* pendant et juste après un zoom à la roulette, aucune page ne se tourne */
  RD.bouge = true;
  if (RD.wb){ wbAller(dir); return; }
  if (!RD.drv) return;
  if (ansPas(dir)){ setTimeout(poll, 60); return; }
  if (RD.dbl && RD.drv2){
    flipTurn(dir); return;
  }
  if (dir > 0) RD.drv.next(); else RD.drv.prev(); setTimeout(poll, 150);
}
function toggleAnim(){ if (RD.drv){ RD.drv.toggleAnim(); if (RD.dbl && RD.drv2){ try { RD.drv2.toggleAnim(); } catch(e){} } setTimeout(poll, 100); } }
/* Réponses : cachées → pas à pas → toutes → cachées, identique sur les deux pages en double page */
function pagesDrv(){ return [RD.drv].concat(RD.dbl && RD.drv2 ? [RD.drv2] : []).filter(d => d && d.answers); }
const estEleve = () => !!(window.ACCES && ACCES.eleve);
/* élèves : les réponses du livre restent cachées (rien ne peut les afficher) */
function verrouEleve(win, doc){
  if (!estEleve() || doc.__eleve) return; doc.__eleve = true;
  const CL = ["answers", "stepans", "h-rep", "h-pas"], net = () => CL.forEach(c => doc.body.classList.contains(c) && doc.body.classList.remove(c)); net();
  new win.MutationObserver(net).observe(doc.body, { attributes:true, attributeFilter:["class"] });
  win.addEventListener("keydown", e => { if (/^r$/i.test(e.key || "") && !enSaisie(e.target)){ e.preventDefault(); e.stopImmediatePropagation(); } }, true);
  /* l'élève touche le livre lui-même (sans outil) : écrire sur la ligne, cocher la case, encercler la réponse, écrire dans la zone de développement */
  win.addEventListener("dblclick", e => { if (estEleve() && !(e.target.closest && e.target.closest("button,input,textarea,select"))){ e.preventDefault(); e.stopImmediatePropagation(); } }, true);   /* élève : deux réponses touchées vite ne font pas zoomer le livre (Administration, Incendie, Ventilation, Plomberie) */
  doc.addEventListener("pointerdown", e => { try { const pg = e.target.closest && e.target.closest(".page"); if (pg && pg.querySelector(".blk")) imagePage(pg, win); } catch(x){} }, true);   /* page en image : on lit l'image pendant que le doigt est posé */
  doc.addEventListener("click", e => {
    if (!estEleve() || RD.wb || (RD.pen && !RD.crayonOff)) return;
    if (e.target.closest && e.target.closest("a[href],button,input,select,textarea,summary,[contenteditable],[onclick],.nav,.toc,nav")) return;
    for (let el = e.target, k = 0; el && el !== doc.body && k < 5; el = el.parentElement, k++)          /* élément cliquable du livre (simulateur, bouton dessiné) : le livre garde la main */
      if (win.getComputedStyle(el).cursor === "pointer" && !el.closest(".opts,.choix,.vf,.options,.qcm,.choices,td,th,.blk")) return;   /* .blk (Administration) : « rejouer l'animation » d'un schéma, la réponse de l'élève passe avant */   /* une case de tableau cliquable (révèle le corrigé) : l'élève y écrit plutôt sa réponse */
    const f = [$("#readerFrame"), $("#readerFrame2")].find(x => x && x.contentDocument === doc); if (!f) return;
    const fr = f.getBoundingClientRect(), k = fr.width / (win.innerWidth || fr.width), X = fr.left + e.clientX * k, Y = fr.top + e.clientY * k;
    if (ecrireIci(X, Y)){ e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);
}
/* encre de l'élève : bleu stylo, sauf s'il a choisi une autre couleur au crayon */
const encreEleve = () => RD.color && !/^hl/.test(RD.color) && RD.color !== "#e2483d" ? RD.color : "#1d4ed8";
function ecrireIci(X, Y){
  const c = $("#inkCanvas"), r = c.getBoundingClientRect(); if (!r.width) return false;
  const q = [(X - r.left) / r.width, (Y - r.top) / r.height], tx = texteSous(q);
  if (tx){ modifierTexte(tx); return true; }                                   /* sa réponse déjà écrite : on la modifie */
  const old = RD.color; RD.color = encreEleve();
  try {
    if (cocherDansLivre(X, Y)) return true;                                      /* case, V/F, choix */
    const T = celluleDuLivre(X, Y);                                              /* cellule vide d'un tableau : le texte reste dans sa case */
    if (T){ ouvrirTexte(T.x, T.y, [(T.x - r.left) / r.width, (T.y - r.top) / r.height], T.w, T.hL, null, T); return true; }
    const L = ligneDuLivre(X, Y);
    if (L){ ouvrirTexte(L.x, L.y - L.hL, [(L.x - r.left) / r.width, (L.y - L.hL - r.top) / r.height], L.w, L.hL, null, L); return true; }
    const Z = zoneDuLivre(X, Y);                                                 /* question à développement : grande case vide */
    if (Z){ ouvrirTexte(Z.x, Z.y, [(Z.x - r.left) / r.width, (Z.y - r.top) / r.height], Z.w, Z.hL, null, Z); return true; }
    const I = reponseImage(X, Y);                                                /* page en image (Administration) : guidé par le corrigé caché */
    if (I && I.kind === "rond") return cocherDansLivre(X, Y, I);
    if (I){ ouvrirTexte(I.x, I.y, [(I.x - r.left) / r.width, (I.y - r.top) / r.height], I.w, I.hL, null, I); return true; }
  } finally { RD.color = old; }
  return false;
}
/* Texte vraiment visible dans un élément (la réponse cachée du corrigé ne compte pas : transparente, invisible, opacité 0) */
function texteVisible(el, win){
  const tw = el.ownerDocument.createTreeWalker(el, NodeFilter.SHOW_TEXT); let t, n = 0;
  while ((t = tw.nextNode()) && ++n < 400){ if (!t.data.replace(/[\s\u00a0]+/g, "")) continue;
    let e = t.parentElement, ok = true;
    for (; e && ok; e = e === el ? null : e.parentElement){ const cs = win.getComputedStyle(e);
      if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0 || parseFloat(cs.fontSize) === 0 || /rgba\([^)]*,\s*0\)|transparent/.test(cs.color)) ok = false; }
    if (ok) return true; }
  return false;
}
/* Cellule vide d'un tableau sous le doigt (td/th sans texte) : rend { x, y, w, hL, fs } (en haut à gauche de la cellule, marge comprise), ou null */
function celluleDuLivre(X, Y){
  for (const id of ["#readerFrame", "#readerFrame2"]){
    const f = $(id); if (!f || f.hidden) continue; const fr = f.getBoundingClientRect(); if (X < fr.left || X > fr.right || Y < fr.top || Y > fr.bottom) continue;
    let win, doc; try { win = f.contentWindow; doc = f.contentDocument; } catch(e){ continue; } if (!doc || !doc.body) continue;
    const s = fr.width / (win.innerWidth || fr.width), bx = (X - fr.left) / s, by = (Y - fr.top) / s;
    const td = doc.elementsFromPoint(bx, by).find(e => /^(TD|TH)$/.test(e.tagName)); if (!td) return null;
    if (texteVisible(td, win) || td.querySelector("img,svg,input,canvas")) return null;
    const rr = td.getBoundingClientRect(), sc = td.offsetWidth ? rr.width / td.offsetWidth : 1; if (rr.width < 30 * sc || rr.height < 14 * sc) return null;
    const cs = win.getComputedStyle(td), pl = (parseFloat(cs.paddingLeft) || 4) * sc, pt = Math.min((parseFloat(cs.paddingTop) || 4) * sc, rr.height * .25);
    const voisin = [...(td.parentElement ? td.parentElement.children : [])].find(x => x !== td && x.textContent.trim()), fsLivre = (voisin ? parseFloat(win.getComputedStyle(voisin).fontSize) || 14 : 14) * sc;
    const fs = Math.min(fsLivre, Math.max(9 * sc, rr.height * .42)) * s, hL = fs * 1.4;   /* même taille que le texte du livre (ou plus petite si la case est basse) */
    return { x:fr.left + (rr.left + pl) * s, y:fr.top + (rr.top + pt) * s, w:(rr.width - 2 * pl) * s, hL, fs, h:(rr.height - 2 * pt) * s };
  }
  return null;
}
/* Page faite d'une image (ex. Administration) : le texte n'est pas lisible par le site, mais le corrigé caché (.ans) donne les places des réponses.
   Près d'une réponse écrite (.hw) → case d'écriture à sa place; sur une rangée de choix (rond .ring du corrigé à moins de 70 px) → rond de même taille
   dans la colonne des lettres, à la hauteur touchée; ailleurs sur la page → petite case d'écriture au doigt. */
/* image d'une page (fond des .blk), lue en pixels pour trouver les rangées de texte; gardée pour les 6 dernières pages */
const IMGPAGE = new Map();
function imagePage(page, win){
  const b = [...page.querySelectorAll(".blk")].find(x => !x.classList.contains("sk")) || page.querySelector(".blk"); if (!b) return null;
  const m = (win.getComputedStyle(b).backgroundImage || "").match(/url\("?([^")]+)"?\)/); if (!m) return null;
  let e = IMGPAGE.get(m[1]); if (e) return e.ctx || null;
  e = {}; IMGPAGE.set(m[1], e); if (IMGPAGE.size > 6) IMGPAGE.delete(IMGPAGE.keys().next().value);
  const im = new Image(); im.onload = () => { const W = page.offsetWidth || 816, H = page.offsetHeight || 1056, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    const x = cv.getContext("2d", { willReadFrequently:true }); x.drawImage(im, 0, 0, W, H); e.ctx = x; }; im.src = m[1];
  return null;
}
/* Page faite d'une image (ex. Administration) : le texte n'est pas lisible par le site, mais le corrigé caché (.ans) donne les places des réponses,
   et l'image de la page (lue en pixels) donne les rangées de texte.
   - rangée d'une réponse écrite (.hw) → case d'écriture à sa place;
   - rangée de choix (un petit ○ gris devant la lettre, près d'un rond .ring du corrigé) → rond centré sur la lettre (ou sur le mot touché, si les choix sont côte à côte);
   - titre de question ou ailleurs → petite case d'écriture au doigt. */
function reponseImage(X, Y){
  for (const id of ["#readerFrame", "#readerFrame2"]){
    const f = $(id); if (!f || f.hidden) continue; const fr = f.getBoundingClientRect(); if (X < fr.left || X > fr.right || Y < fr.top || Y > fr.bottom) continue;
    let win, doc; try { win = f.contentWindow; doc = f.contentDocument; } catch(e){ continue; } if (!doc || !doc.body) continue;
    const s = fr.width / (win.innerWidth || fr.width), bx = (X - fr.left) / s, by = (Y - fr.top) / s;
    const page = doc.elementsFromPoint(bx, by).find(e => e.matches && e.matches(".page,section,[data-page]") && e.querySelector(".blk") && (!e.checkVisibility || e.checkVisibility({ visibilityProperty:true, opacityProperty:true })));   /* la page vraiment affichée (les autres sont empilées, cachées) */
    if (!page) continue;
    const pr = page.getBoundingClientRect(), k = page.offsetWidth ? pr.width / page.offsetWidth : 1;
    const P = r => ({ l:(r.left - pr.left) / k, t:(r.top - pr.top) / k, w:r.width / k, h:r.height / k }), px = (bx - pr.left) / k, py = (by - pr.top) / k;   /* coordonnées de la page (816 px de large) */
    const E = (x, y) => ({ x:fr.left + (pr.left + x * k) * s, y:fr.top + (pr.top + y * k) * s }), ech = k * s;            /* page → écran */
    const A = [...page.querySelectorAll(".ans")].map(e => ({ e, r:P(e.getBoundingClientRect()), c:e.className })).filter(a => a.r.w || a.r.h);
    /* 2. rangée de choix : on lit l'image. Un choix commence par un petit ○ gris; on encercle le premier mot après le ○ le plus proche à gauche du doigt. */
    const g = imagePage(page, win);
    if (g){
      const W = g.canvas.width, H = g.canvas.height, lum = (d, i) => .299 * d[i] + .587 * d[i + 1] + .114 * d[i + 2];
      const x0 = Math.max(0, Math.round(px - 220)), x1 = Math.min(W - 1, Math.round(px + 60)), y0 = Math.max(0, Math.round(py - 14)), y1 = Math.min(H - 1, Math.round(py + 14));
      const D = g.getImageData(x0, y0, x1 - x0 + 1, y1 - y0 + 1).data, LW = x1 - x0 + 1, L = (x, y) => lum(D, ((y - y0) * LW + (x - x0)) * 4);
      /* rangée de texte sous le doigt */
      const ligneEncre = y => { for (let x = x0; x <= x1; x++) if (L(x, y) < 215) return true; return false; };
      let t = Math.round(py), b = Math.round(py); if (!ligneEncre(t)){ let u = t, v = t; while (u > y0 && !ligneEncre(u)) u--; while (v < y1 && !ligneEncre(v)) v++; t = b = (py - u <= v - py && ligneEncre(u)) ? u : v; }
      while (t > y0 && ligneEncre(t - 1)) t--; while (b < y1 && ligneEncre(b + 1)) b++;
      if (b - t >= 5 && b - t <= 26){
        const col = x => { let gris = 0, noir = 0; for (let y = t; y <= b; y++){ const v = L(x, y); if (v < 110) noir++; else if (v < 215) gris++; } return [gris, noir]; };
        /* petits ○ gris : colonnes avec du gris et aucun noir, sur 6 à 15 px de large */
        const R = []; let deb = -1;
        const creux = (a, z) => { const m = Math.round((a + z) / 2); let haut = -1, bas = -1;   /* un ○ : du gris en haut et en bas de la colonne du milieu, du blanc au centre */
          for (let y = t; y <= b; y++){ const v = L(m, y); if (v < 215){ if (haut < 0) haut = y; bas = y; } } const yc = Math.round((haut + bas) / 2); creux.v = [haut, bas]; return haut >= 0 && bas - haut >= 5 && bas - haut <= 16 && Math.abs((z - a) - (bas - haut)) <= 3 && haut > t - 1 && L(a, t) > 215 && L(z, t) > 215 && L(m, yc) > 215 && L(m, yc - 1) > 200 && L(m, yc + 1) > 200; };
        for (let x = x0; x <= Math.min(x1, Math.round(px + 6)); x++){ const [gr, no] = col(x), rad = gr >= 1 && no === 0; if (rad && deb < 0) deb = x; if (!rad && deb >= 0){ if (x - deb >= 6 && x - deb <= 15 && creux(deb, x - 1)) R.push([deb, x - 1, creux.v[0], creux.v[1]]); deb = -1; } }
        const rd = R.filter(r => r[0] <= px + 6 && r[0] > 40).pop();   /* pas dans la marge de la page */
        if (rd){
          let l = rd[1] + 1; while (l < x1 && col(l)[1] === 0 && l - rd[1] < 12) l++;          /* début du mot après le ○ */
          let r = l, vide = 0; for (let x = l; x <= x1 && vide < 4; x++){ if (col(x)[1] > 0){ r = x; vide = 0; } else vide++; }   /* fin du mot : 4 colonnes vides */
          if (col(l)[1] > 0 && r - l >= 3 && r - l <= 120){ const yc = (rd[2] + rd[3]) / 2, c = E((l + r) / 2, yc), w = (r - l + 12) * ech, h = (rd[3] - rd[2] + 9) * ech;   /* hauteur et centre du ○ : le rond suit la lettre, pas toute la rangée */ return { kind:"rond", x:c.x - w / 2, y:c.y - h / 2, w, h, pad:0 }; }
        }
      }
    } else {
      let ring = null, dr = 1e9; A.filter(a => /\bring\b/.test(a.c)).forEach(a => { const d = Math.abs(a.r.t + a.r.h / 2 - py); if (d < dr && px >= a.r.l - 40 && px <= a.r.l + 440){ dr = d; ring = a; } });
      if (ring && dr < 10){ const c = E(ring.r.l + ring.r.w / 2, ring.r.t + ring.r.h / 2), w = ring.r.w * ech, h = ring.r.h * ech; return { kind:"rond", x:c.x - w / 2, y:c.y - h / 2, w, h, pad:0 }; }   /* image pas encore lue : seulement sur la rangée du corrigé */
    }
    /* 1. rangée d'une réponse écrite du corrigé */
    let hw = null, dh = 1e9;
    A.filter(a => /\bhw\b/.test(a.c)).forEach(a => { const hy = Math.max(a.r.h, 14), dy = Math.max(a.r.t - py, 0, py - (a.r.t + hy)), dx = Math.max(a.r.l - 40 - px, 0, px - (a.r.l + Math.max(a.r.w, 300)));
      const d = Math.hypot(dx, dy * 2); if (dy <= 9 && dx <= 0 && d < dh){ dh = d; hw = a; } });
    if (!hw) A.filter(a => /\bhw\b/.test(a.c)).forEach(a => { const d = Math.hypot(Math.max(a.r.l - px, 0, px - (a.r.l + a.r.w)), Math.max(a.r.t - py, 0, py - (a.r.t + a.r.h))); if (d <= 22 && d < dh){ dh = d; hw = a; } });
    if (hw){ const fsP = (parseFloat(win.getComputedStyle(hw.e).fontSize) || 18) * .78, o = E(hw.r.l, hw.r.t);
      return { kind:"texte", x:o.x, y:o.y, w:Math.min(Math.max(hw.r.w, 140), (page.offsetWidth || 816) - hw.r.l - 30) * ech, fs:fsP * ech, hL:fsP * 1.35 * ech }; }
    const fs = 14 * ech; return { kind:"texte", x:X - 6, y:Y - fs * .9, w:Math.min(300 * ech, fr.right - X), fs, hL:fs * 1.4 };
  }
  return null;
}
/* Zone de réponse vide sous le doigt (cadre bordé ou fond pâle, sans texte) : rend { x, y, w, hL, fs } comme ligneDuLivre, ou null */
function zoneDuLivre(X, Y){
  for (const id of ["#readerFrame", "#readerFrame2"]){
    const f = $(id); if (!f || f.hidden) continue; const fr = f.getBoundingClientRect(); if (X < fr.left || X > fr.right || Y < fr.top || Y > fr.bottom) continue;
    let win, doc; try { win = f.contentWindow; doc = f.contentDocument; } catch(e){ continue; } if (!doc || !doc.body) continue;
    const s = fr.width / (win.innerWidth || fr.width), bx = (X - fr.left) / s, by = (Y - fr.top) / s;
    for (const e of doc.elementsFromPoint(bx, by)){
      if (e === doc.body || e === doc.documentElement || (e.matches && e.matches(".page,section,[data-page]"))) break;
      const rr = e.getBoundingClientRect(), sc = e.offsetWidth ? rr.width / e.offsetWidth : 1; if (rr.width < 110 * sc || rr.height < 34 * sc || rr.height > 700 * sc) continue;
      if (texteVisible(e, win) || e.querySelector("img,svg,canvas,table")) continue;
      const cs = win.getComputedStyle(e), bord = ["Top", "Right", "Bottom", "Left"].filter(c => (parseFloat(cs["border" + c + "Width"]) || 0) >= .5 && cs["border" + c + "Style"] !== "none").length;
      if (cs.backgroundImage && cs.backgroundImage !== "none") continue;          /* image ou dégradé décoratif : pas une zone de réponse */
      const m = (cs.backgroundColor || "").match(/[\d.]+/g) || [], a = m.length > 3 ? +m[3] : (m.length ? 1 : 0), lum = m.length ? (.299 * m[0] + .587 * m[1] + .114 * m[2]) / 255 : 0;
      const pale = a > .3 && lum > .85;                                           /* fond blanc ou pâle (feuille de réponse) */
      if (!(bord >= 3 && (pale || a < .05)) && !(pale && rr.height >= 60 * sc && bord >= 1)) continue;
      const fs = 14 * sc * s, hL = 22 * sc * s, pad = 6 * sc * s;
      return { x:fr.left + rr.left * s + pad, y:fr.top + rr.top * s + pad, w:rr.width * s - 2 * pad, hL, fs, h:rr.height * s - 2 * pad };
    }
  }
  return null;
}
function answers(){
  if (estEleve()) return;
  const ds = pagesDrv(); if (!ds.length) return;
  const sans = d => { try { return d.ansInfo ? d.ansInfo() : null; } catch(e){ return null; } };
  const inf = ds.map(sans).filter(i => i && !i.dis);
  if (!inf.length){ if (!ds[0].ansInfo) ds.forEach(d => { try { d.answers(); } catch(e){} }); return; }
  const cible = ds.every(d => d.ansSimple) ? (Math.max(...inf.map(i => i.mode)) > 0 ? 0 : 2) : (Math.max(...inf.map(i => i.mode)) + 1) % 3;
  ds.forEach(d => { for (let k = 0; k < 3; k++){ const i = sans(d); if (!i || i.dis || i.mode === cible) break; try { d.answers(); } catch(e){} } });
  setTimeout(poll, 80);
}
/* Mode pas à pas : → montre la réponse suivante (page de gauche puis de droite), ← la retire. Quand tout est montré, → tourne la page. */
function ansPas(dir){
  const ds = pagesDrv(); if (!ds.length || !ds.every(d => d.ansInfo)) return false;
  const inf = ds.map(d => d.ansInfo());
  if (!inf.some(i => i.mode === 1 && !i.dis)) return false;
  if (dir > 0){ const k = inf.findIndex(i => i.mode === 1 && !i.dis && i.s < i.t); if (k < 0) return false; ds[k].next(); return true; }
  let k = -1; inf.forEach((i, j) => { if (i.mode === 1 && !i.dis && i.s > 0) k = j; });
  if (k < 0) return false; ds[k].prev(); return true;
}
function ansEtat(){
  let ok = false, m = 0, st = 0, t = 0;
  pagesDrv().forEach(d => { if (!d.ansInfo) return; const i = d.ansInfo(); if (i.dis) return; ok = true; m = Math.max(m, i.mode); st += i.s; t += i.t; });
  return { ok, m, s:st, t };
}

/* Suppr, Ctrl+C/V/X/D, Échap sur le tableau : aussi quand le clavier est dans le cadre du livre (tableau blanc vide) */
function toucheTableau(e){
  if ((e.ctrlKey || e.metaKey) && !e.altKey && (RD.pen || RD.wb) && /^[cvxd]$/i.test(e.key || "")){ if (copierColler(e.key.toLowerCase())) return true; }
  if (e.key === "Escape" && SELM.length){ SELM = []; redrawInk(); }
  if ((e.key === "Delete" || e.key === "Backspace") && (RD.pen || RD.wb)){                 /* Suppr : efface ce qui est choisi, partout */
    if ((SELM.length && SELM.some(x => strokes().includes(x))) || (typeof SELO !== "undefined" && SELO.s && strokes().includes(SELO.s))){ effacerChoix(); return true; }
    if (typeof SEL !== "undefined" && SEL.s && strokes().includes(SEL.s)){ snapInk(); INKS[inkKey()] = strokes().filter(x => x !== SEL.s); SEL.s = null; redrawInk(); try { majBarTxt(); majSelTxt(); } catch(er){} return true; } }
  return false; }
const HOSTKEYS = { p:(...a) => togglePen(...a), t:(...a) => toggleTimer(...a), l:(...a) => toggleSpot(...a), c:(...a) => toggleCache(...a), b:(...a) => toggleWb(...a), m:(...a) => openMenu(...a), f:(...a) => toggleFs(...a), h:() => basculerBarres(), d:(...a) => toggleDbl(...a), o:(...a) => toggleLaser(...a), n:(...a) => toggleNoir(...a), k:(...a) => toggleMark(...a), e:() => allerTableauDeBord(), "?":(...a) => toggleHelp(...a),
  "+":(...a) => zin(...a), "=":(...a) => zin(...a), "-":(...a) => zout(...a), "_":(...a) => zout(...a), "0":(...a) => zreset(...a), r:(...a) => answers(...a), a:(...a) => toggleAnim(...a), q:() => montrerQr(), z:() => {} };
const verrou = () => !!(RD.wb || RD.text || RD.obj);     /* tableau blanc ou texte : aucun raccourci, sauf annuler / rétablir */
function hostKey(e){
  if (verrou() && !((e.ctrlKey || e.metaKey) && /^[zy]$/i.test(e.key || ""))) return false;
  if (e.ctrlKey || e.metaKey || e.altKey){
    if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z")){ if (e.shiftKey) redoInk(); else undoInk(); return true; }
    if ((e.ctrlKey || e.metaKey) && (e.key === "y" || e.key === "Y")){ redoInk(); return true; }
    return false;
  }
  const k0 = (e.key || "").toLowerCase();
  if (estEleve() && "rbetlconkq".includes(k0) && k0) return true;   /* élèves : pas de réponses, tableau blanc, tableau de bord ni outils de présentation */
  const f = HOSTKEYS[k0];
  if (!f) return false;
  f(); return true;
}
document.addEventListener("keydown", e => {
  if (!$("#reader").classList.contains("open")) return;
  const t = e.target, tag = t && t.tagName;
  if (enSaisie(t)) return;
  if (toucheTableau(e)){ e.preventDefault(); return; }
  if (e.key === "Escape"){ if (!$("#mmenu").hidden || !$("#help").hidden || !$("#noir").hidden){ closeMenu(); e.stopImmediatePropagation(); } return; }
  if (verrou() && !((e.ctrlKey || e.metaKey) && /^[zy]$/i.test(e.key || ""))) return;
  if (e.key === "ArrowRight" || e.key === "PageDown" || (e.key === " " && tag !== "BUTTON")){ e.preventDefault(); turn(1); return; }
  if (e.key === "ArrowLeft" || e.key === "PageUp"){ e.preventDefault(); turn(-1); return; }
  if (hostKey(e)) e.preventDefault();
});

/* ---- Boutons ---- */
$("#tbPrev").onclick = () => turn(-1);
$("#tbNext").onclick = () => turn(1);
/* Bouton tenu enfoncé = avance (ou recul) rapide : après une demi-seconde, les pages défilent de plus en plus vite */
function avanceRapide(btn, dir){
  let rep = null, t0 = 0, tenu = false;
  const stop = () => { clearTimeout(rep); rep = null; btn.classList.remove("rapide"); setTimeout(() => { tenu = false; }, 50); };
  btn.addEventListener("pointerdown", e => { if (e.button > 0) return; tenu = false; t0 = Date.now(); clearTimeout(rep);
    const pas = () => { tenu = true; btn.classList.add("rapide"); RD.bouge = true; turn(dir); const dt = Date.now() - t0; rep = setTimeout(pas, dt > 2500 ? 110 : dt > 1200 ? 160 : 230); };
    rep = setTimeout(pas, 450); });
  ["pointerup", "pointercancel", "pointerleave", "lostpointercapture"].forEach(ev => btn.addEventListener(ev, stop));
  btn.addEventListener("click", e => { if (tenu){ e.stopImmediatePropagation(); e.preventDefault(); tenu = false; } }, true);   /* pas de page en plus au relâchement */
  btn.addEventListener("contextmenu", e => e.preventDefault());
}
avanceRapide($("#tbPrev"), -1); avanceRapide($("#tbNext"), 1);
$("#tbPen").onclick = togglePen;
$("#tbAns").onclick = answers;
$("#tbAnim").onclick = toggleAnim;
$("#tbZo").onclick = zout; $("#tbZv").onclick = zreset; $("#tbZi").onclick = zin;
$("#tbTimer").onclick = toggleTimer;
$("#tbSpot").onclick = toggleSpot;
$("#tbCache").onclick = toggleCache;
$("#tbWb").onclick = toggleWb;
$("#readerLivre").onclick = () => { if (RD.wb) toggleWb(); };
$("#tbMenu").onclick = openMenu;
$("#tbFs").onclick = toggleFs;
$("#tbDbl").onclick = toggleDbl;
$("#mmenu").addEventListener("click", e => { if (e.target.id === "mmenu") closeMenu(); });
$("#tbPg").addEventListener("keydown", e => {
  if (e.key !== "Enter") return;
  const n = parseInt(e.target.value, 10);
  if (n && RD.drv) RD.drv.goto(n);
  e.target.blur(); setTimeout(() => { syncSecond(); poll(); }, 250);
});
(function(){
  const bar = $("#penBar"), ref = bar.querySelector(".sep");
  const x = document.createElement("input"); x.type = "color"; x.className = "swx"; x.value = "#ff00aa"; x.title = "Autre couleur"; x.setAttribute("aria-label", "Autre couleur");
  try { const m = localStorage.getItem("penPerso"); if (m) x.value = m; } catch(e){}               /* la dernière couleur personnalisée est retenue */
  x.oninput = () => { x.style.setProperty("--perso", x.value); try { localStorage.setItem("penPerso", x.value); } catch(e){} RD.color = x.value; RD.eraser = false; RD.crayonOff = false; recolorerSel(); refreshTools(); x.classList.add("on"); };
  x.style.setProperty("--perso", x.value); bar.insertBefore(x, ref); RD.swx = x;
})();
/* Ctrl+C copie ce qui est choisi, Ctrl+V colle une copie un peu décalée (sur la grille), Ctrl+X coupe, Ctrl+D duplique */
function copierColler(t){
  const choix = () => { let L = SELM.filter(x => x && strokes().includes(x)); if (!L.length) L = [SELO.s].filter(x => x && strokes().includes(x)); L.slice().forEach(o => { if (o.t !== "cote" && o.t !== "texte") try { (liensCotes(o) || []).forEach(([q]) => { if (!L.includes(q)) L.push(q); }); } catch(er){} }); return L; };   /* copier une forme copie aussi ses cotes */
  if (t === "c" || t === "x" || t === "d"){ const L = choix(); if (!L.length) return false; window.PRESSE = { L:JSON.parse(JSON.stringify(L)), n:0 };
    if (t === "x"){ effacerChoix(); aviser(L.length + " élément" + (L.length > 1 ? "s coupés" : " coupé") + " : Ctrl+V pour coller.", 2500); return true; }
    if (t === "c"){ aviser(L.length + " élément" + (L.length > 1 ? "s copiés" : " copié") + " : Ctrl+V pour coller.", 2500); return true; } }
  const P = window.PRESSE; if (!P || !P.L.length) return false; P.n++;
  const c = $("#inkCanvas"), W = c.width, H = c.height, dpr = DPRI();
  let dx, dy; if (/^iso/.test(wbBg())){ const a = 34 * RD.z * 1.2 * dpr; dx = 2 * a * .8660254 / W; dy = 0; } else { const u = 34 * RD.z * dpr; dx = 2 * u / W; dy = 2 * u / H; }
  snapInk(); const neufs = JSON.parse(JSON.stringify(P.L)).map(o => { o.p = o.p.map(q => [q[0] + dx * P.n, q[1] + dy * P.n]); return o; });
  neufs.forEach(o => strokes().push(o)); SELO.s = null; SELM = neufs.length > 1 ? neufs : []; if (neufs.length === 1) SELO.s = neufs[0];
  redrawInk(); try { majObjUI(); } catch(er){} return true; }
function effacerChoix(){ let sel = (window.SELM || []).filter(x => x && strokes().includes(x)); if (!sel.length) sel = [SELO.s].filter(x => x && strokes().includes(x)); if (!sel.length) return;   /* un groupe d'un autre tableau ne bloque pas Suppr */
  sel.slice().forEach(o => { if (o.t !== "cote" && o.t !== "texte") try { (liensCotes(o) || []).forEach(([q]) => { if (!sel.includes(q)) sel.push(q); }); } catch(er){} });   /* une forme ou un objet effacé emporte ses cotes et ses textes */
  snapInk(); sel.forEach(o => { if (o.t === "objet" && typeof window.reparerApresSuppression === "function") window.reparerApresSuppression(o); });
  INKS[inkKey()] = strokes().filter(x => !sel.includes(x)); SELO.s = null; window.SELM = []; try { nettoyerJonctions(); } catch(er){} redrawInk(); try { majObjUI(); } catch(er){} }
function recolorerSel(){ const M = (window.SELM || []).filter(x => strokes().includes(x)); if (M.length && !/^hl/.test(RD.color)){ snapInk(); M.forEach(x => x.c = RD.color); redrawInk(); return; }
  const o = typeof SELO !== "undefined" && SELO.s && strokes().includes(SELO.s) ? SELO.s : (RD.aRecolorer && strokes().includes(RD.aRecolorer) ? RD.aRecolorer : null); if (!o || /^hl/.test(RD.color) || o.c === RD.color) return; snapInk(); o.c = RD.color; redrawInk(); }   /* l'objet ou la forme choisi prend la couleur du crayon */
document.querySelectorAll("#penBar .sw").forEach(b => b.onclick = () => { RD.color = b.dataset.c; RD.eraser = false; RD.crayonOff = false; recolorerSel(); refreshTools(); });
$("#penW").onclick = () => { RD.wIdx = (RD.wIdx + 1) % WIDTHS.length; majEpaisseur(); };
function majEpaisseur(){ const c = $("#penW circle"); if (c) c.setAttribute("r", 2.5 + RD.wIdx * 2.5); }
$("#penS").onclick = () => { const i = SHAPES.indexOf(RD.shape || null); RD.shape = SHAPES[(i + 1) % SHAPES.length]; RD.eraser = false; RD.text = false; RD.crayonOff = false; refreshTools(); };
$("#wbF").onclick = wbFondSuivant; $("#wbP").onclick = () => wbAller(-1); $("#wbN").onclick = () => wbAller(1); $("#wbPlus").onclick = wbNouveau; $("#wbMoins").onclick = wbSupprimer; $("#wbS").onclick = wbEnregistrer;
[["penW","dot"],["wbHand","main"],["penE","eraser"],["penU","undo"],["penO","objet"],["wbZo","zmoins"],["wbZi","zplus"],["penT","texte"],["penR","redo"],["penC","trash"],["penX","close"],["wbF","fond"],["wbP","prev"],["wbN","next"],["wbPlus","plus"],["wbMoins","trash"],["wbS","save"]].forEach(([id, n]) => setIcn($("#" + id), n));
majEpaisseur();
(function(){
  const bar = $("#penBar"), rd = $("#reader");
  const SV = {
    fold:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
    open:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20l1-4L16.5 4.5a2 2 0 0 1 3 3L8 19z"/><path d="M14.5 6.5l3 3"/></svg>',
    side:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M9 5v14"/></svg>'
  };
  let st = {fold:false, side:false};
  try { st = Object.assign(st, JSON.parse(localStorage.getItem("penDock") || "{}")); } catch(e){}
  const f = document.createElement("button"); f.id = "penFold"; f.className = "pf";
  const d = document.createElement("button"); d.id = "penSide"; d.className = "pf"; d.innerHTML = SV.side;
  d.title = "Ancrer le menu sur le côté droit / en bas"; d.setAttribute("aria-label", "Ancrer le menu sur le côté droit");
  bar.insertBefore(d, bar.firstChild); bar.insertBefore(f, bar.firstChild);
  function maj(){
    rd.classList.toggle("pen-fold", !!st.fold); rd.classList.toggle("pen-side", !!st.side);
    f.innerHTML = st.fold ? SV.open : SV.fold; f.title = st.fold ? "Rouvrir le menu" : "Rétracter le menu";
    f.setAttribute("aria-label", f.title); d.classList.toggle("on", !!st.side);
    try { localStorage.setItem("penDock", JSON.stringify(st)); } catch(e){}
  }
  f.onclick = () => { st.fold = !st.fold; maj(); };
  d.onclick = () => { st.side = !st.side; maj(); };
  maj();
  // même principe pour la barre des objets
  const ob = $("#objBar"); if (ob){
    const o = document.createElement("button"); o.id = "objF"; o.innerHTML = SV.fold; o.title = "Rétracter / rouvrir les objets";
    const te = ob.querySelector(".tete"); if (te) te.appendChild(o); else ob.insertBefore(o, ob.firstChild);
    o.onclick = () => { ob.classList.toggle("of"); o.innerHTML = ob.classList.contains("of") ? SV.open.replace(/<path d="M4 20[^>]*>.*?<path d="M14.5[^>]*>/, '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5"/>') : SV.fold; };
  }
})();
/* ---- Barre du haut du tableau blanc : la cacher / la rouvrir (9 nov.) ---- */
(function(){
  const rd = $("#reader"), bar = rd && rd.querySelector(".reader-bar"); if (!bar) return;
  const ch = d => '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';
  const f = document.createElement("button"); f.id = "rbFold"; f.type = "button"; f.innerHTML = ch("M6 15l6-6 6 6");
  f.title = "Cacher la barre du haut"; f.setAttribute("aria-label", f.title); bar.appendChild(f);
  const o = document.createElement("button"); o.id = "rbOpen"; o.type = "button"; o.innerHTML = ch("M6 9l6 6 6-6");
  o.title = "Montrer la barre du haut"; o.setAttribute("aria-label", o.title); rd.appendChild(o);
  function maj(v){ rd.classList.toggle("rb-fold", v); try { localStorage.setItem("wbBarreCachee", v ? "1" : "0"); } catch(e){} setTimeout(() => window.dispatchEvent(new Event("resize")), 30); }
  f.onclick = () => maj(true); o.onclick = () => maj(false);
  try { if (localStorage.getItem("wbBarreCachee") === "1") rd.classList.add("rb-fold"); } catch(e){}
})();
/* ---- Barre du crayon simplifiée pour les débutants : rien n'est retiré, les outils moins utilisés vont dans deux menus ---- */
(function(){
  const bar = $("#penBar"), X = id => $("#" + id);
  const dots = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>';
  const pop = id => { const p = document.createElement("div"); p.className = "ppop"; p.id = id; p.hidden = true; p.addEventListener("pointerdown", e => e.stopPropagation()); return p; };
  const rang = (lab, els, wb) => { const r = document.createElement("div"); r.className = "prang" + (wb ? " wbonly" : ""); if (wb) r.hidden = !RD.wb;
    r.innerHTML = '<span class="lab">' + lab + '</span>'; els.forEach(e => e && r.appendChild(e)); return r; };
  const nomme = (id, lab) => { const b = X(id); if (b) b.dataset.lab = lab; return b; };
  /* Couleur + épaisseur */
  const bc = document.createElement("button"); bc.id = "penCol"; bc.title = "Couleur et épaisseur du trait"; bc.setAttribute("aria-label", "Couleur et épaisseur"); bc.innerHTML = '<span class="pcur"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16.5 3.5l3 3L9 17l-4 1 1-4z"/><path d="M14.5 5.5l3 3"/><path class="pointe" stroke="none" d="M6 14l3 3-4 1z"/><path class="trait" stroke-width="2.6" d="M12 21h8"/></svg></span>';   /* symbole de crayon : la pointe et le trait ont la couleur choisie */
  const pc = pop("popCol");
  /* une seule ligne : couleurs, autre couleur, | surligneurs (ronds = crayon, carrés = surligneur) */
  { const sws = [...bar.querySelectorAll(".sw")], sep = document.createElement("span"); sep.className = "psep";
    const r1 = rang("Couleur", sws.filter(b => !b.classList.contains("hl")).concat(RD.swx ? [RD.swx] : [], [sep], sws.filter(b => b.classList.contains("hl"))));
    r1.querySelectorAll(".sw").forEach(b => { if (!b.title) b.title = (b.classList.contains("hl") ? "Surligneur " : "Crayon ") + (b.getAttribute("aria-label") || "").toLowerCase().replace(/^surligneur /, ""); });
    pc.appendChild(r1); }
  /* épaisseur : une glissière (1 à 40) avec un aperçu du trait */
  try { RD.wPx = +localStorage.getItem("penLargeur") || 4; } catch(e){ RD.wPx = 4; }
  const lg = document.createElement("div"); lg.className = "plarg";
  lg.innerHTML = '<input type="range" min="1" max="40" step="1" aria-label="Épaisseur du trait" title="Épaisseur du trait"><svg viewBox="0 0 60 44" width="60" height="44" aria-hidden="true"><line x1="8" y1="22" x2="52" y2="22" stroke-linecap="round"/></svg><b></b>';
  const lgI = lg.querySelector("input"), lgL = lg.querySelector("line"), lgB = lg.querySelector("b");
  window.majLargeur = () => { const c = RD.color || "#e2483d"; lgI.value = RD.wPx; lgB.textContent = RD.wPx; lgL.setAttribute("stroke-width", Math.min(40, RD.wPx)); lgL.setAttribute("stroke", /^hl:/.test(c) ? c.slice(3) : c); };
  lgI.addEventListener("input", () => { RD.wPx = +lgI.value; RD.crayonOff = false; try { localStorage.setItem("penLargeur", RD.wPx); } catch(e){} majLargeur(); refreshTools(); });
  /* tracé du crayon (l'ancien bouton « Forme » de la barre) : trait libre, ligne, flèche, rectangle, ellipse */
  const traces = SHAPES.map(k => { const b = document.createElement("button"); b.type = "button"; b.className = "ptrace"; b.dataset.sh = k || ""; b.title = SHAPE_NOM[k || ""]; b.setAttribute("aria-label", SHAPE_NOM[k || ""]); b.innerHTML = icn(k || "libre");
    b.onclick = () => { RD.shape = k; RD.eraser = false; RD.text = false; RD.obj = false; RD.crayonOff = false; refreshTools(); }; return b; });
  pc.appendChild(rang("Tracé", traces));
  if (X("penS")) X("penS").style.display = "none";   /* le bouton Forme de la barre est remplacé par la rangée « Tracé » */
  pc.appendChild(rang("Épaisseur", [lg])); majLargeur(); if (X("penW")) X("penW").remove();   /* l'ancien bouton à 3 grosseurs est remplacé par la glissière */
  /* Plus */
  const bp = document.createElement("button"); bp.id = "penPlus"; bp.title = "Plus d'outils : rétablir, tout effacer, zoom, tableaux, enregistrer"; bp.setAttribute("aria-label", "Plus d'outils"); bp.innerHTML = dots;
  const pp = pop("popPlus");
  pp.appendChild(rang("Modifier", [nomme("penR", "Rétablir"), nomme("penC", "Tout effacer")]));
  pp.appendChild(rang("Affichage", [X("wbZo"), X("wbZv"), X("wbZi"), nomme("wbHand", "Déplacer")], true));
  pp.appendChild(rang("Tableaux", [X("wbP"), X("wbLbl"), X("wbN"), nomme("wbPlus", "Nouveau"), nomme("wbMoins", "Sûr ? Touche encore")], true));
  const bsch = document.createElement("button"); bsch.id = "wbSch"; bsch.dataset.lab = "Mes schémas et modèles"; bsch.title = "Enregistrer, rouvrir, exporter un tableau; circuits prêts à utiliser";
  bsch.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h12l4 4v12H4z"/><path d="M8 4v5h7V4M8 20v-6h8v6"/></svg>';
  bsch.onclick = () => { fermer(); ouvrirSchemas(); };
  pp.appendChild(rang("Image", [nomme("wbS", "Enregistrer en PNG")], true));
  pp.appendChild(rang("Schémas", [bsch], true));
  /* ligne principale */
  bar.querySelectorAll(":scope > .sep").forEach(e => e.remove());
  const sep = () => { const e = document.createElement("span"); e.className = "sep"; return e; };
  const bfs = document.createElement("button"); bfs.id = "penFs"; bfs.title = "Plein écran"; bfs.setAttribute("aria-label", "Plein écran");
  bfs.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
  bfs.onclick = () => { fermer(); toggleFs(); };
  [sep(), bc, X("penT"), X("penO"), X("penE"), X("penU"), X("wbF"), bfs, bp].forEach(e => e && bar.appendChild(e));
  { const x = $("#penX"); if (x) x.style.display = "none"; }   /* plus de ✕ dans la barre : on sort par « Retour » (tableau blanc) ou le bouton crayon du livre */
  bar.appendChild(pc); bar.appendChild(pp);
  /* toucher un autre outil de la barre ferme le menu ouvert (« … » ou couleurs) */
  bar.addEventListener("click", e => { const t = e.target; if (!t.closest) return;
    if (!pp.hidden && !pp.contains(t) && !t.closest("#penPlus")){ pp.hidden = true; bp.classList.remove("open"); }
    if (!pc.hidden && !pc.contains(t) && !t.closest("#penCol")){ pc.hidden = true; bc.classList.remove("open"); }
    if (!pp.hidden && t.closest("#penC, #wbPlus, #wbS")) setTimeout(fermer, 60); }, true);   /* Tout effacer, Nouveau, Enregistrer : le menu se ferme; zoom et flèches de tableaux le gardent ouvert */
  const fermer = () => { pc.hidden = pp.hidden = true; bc.classList.remove("open"); bp.classList.remove("open"); };
  const basculer = (p, b) => { const ouvrir = p.hidden; fermer(); if (ouvrir){ p.hidden = false; b.classList.add("open"); } };
  /* toucher « Couleur » ramène toujours au crayon (quitte l'efface, le texte ou les objets) */
  bc.onclick = () => { RD.aRecolorer = SELO.s && strokes().includes(SELO.s) ? SELO.s : null;   /* l'objet choisi pourra prendre la couleur touchée */
    const actif = !RD.eraser && !RD.text && !RD.obj && !RD.crayonOff;
    if (actif){ RD.crayonOff = true; fermer(); refreshTools(); return; }                     /* crayon actif : on le désactive */
    RD.eraser = false; RD.text = false; RD.obj = false; RD.crayonOff = false; refreshTools(); fermer(); pc.hidden = false; bc.classList.add("open"); majLargeur(); };   /* on l'active et les couleurs s'ouvrent */   /* les formes gardent la palette : on change seulement leur couleur */ bp.onclick = () => basculer(pp, bp);
  pc.querySelectorAll(".sw").forEach(b => b.addEventListener("click", () => setTimeout(fermer, 120)));
  document.addEventListener("pointerdown", e => { if (bar.contains(e.target) || (pc.hidden && pp.hidden)) return; const couleurs = !pc.hidden && pp.hidden; fermer();
    if (e.target.id === "inkCanvas" && !(couleurs && !RD.crayonOff)){ e.stopPropagation(); e.preventDefault(); } }, true);   /* fermer le menu ⋯ ne dessine pas de point; mais crayon actif + couleurs ouvertes : le premier trait se dessine tout de suite */
  document.addEventListener("keydown", e => { if (e.key === "Escape") fermer(); });
  window.majCouleurCrayon = () => { const c = RD.color || "#e2483d", hl = /^hl:/.test(c), cur = bc.querySelector(".pcur");
    const v = hl ? c.slice(3) : (RD.swx && RD.swx.classList.contains("on") ? RD.swx.value : (c === "#24282c" && wbSombre() ? "#f4f1ea" : c));
    cur.style.setProperty("--pc", v); cur.classList.toggle("hl", hl); bc.classList.toggle("on", !RD.eraser && !RD.text && !RD.obj && !RD.crayonOff);
    pc.querySelectorAll(".ptrace").forEach(b => b.classList.toggle("on", b.dataset.sh === (RD.shape || ""))); bc.title = RD.crayonOff ? "Crayon désactivé : touche pour écrire (couleur et épaisseur)" : "Crayon : touche pour le désactiver"; try { majLargeur(); } catch(e){} };
  const rt = refreshTools; refreshTools = function(){ rt.apply(this, arguments); try { majCouleurCrayon(); } catch(e){} };
  majCouleurCrayon();
})();
$("#penE").onclick = () => { RD.eraser = !RD.eraser; if (RD.eraser){ RD.text = false; RD.obj = false; } RD.crayonOff = true; refreshTools(); majPopGomme(); };   /* la gomme remplace le crayon : en la rangeant, aucun outil (pas de retour au crayon) */
/* taille de la gomme : petite fenêtre qui s'ouvre avec la gomme */
(function(){
  const bar = $("#penBar"), pg = document.createElement("div"); pg.className = "ppop"; pg.id = "popGom"; pg.hidden = true;
  try { RD.gommeT = +localStorage.getItem("gommeTaille") || 1; } catch(e){ RD.gommeT = 1; }
  pg.innerHTML = '<div class="prang"><span class="lab">Taille de la gomme</span><div class="plarg"><input type="range" min="0.5" max="6" step="0.5" aria-label="Taille de la gomme"><svg viewBox="0 0 60 44" width="60" height="44" aria-hidden="true"><circle cx="30" cy="22" r="6" fill="none" stroke="#e4e4e7" stroke-width="2"/></svg><b></b></div></div>';
  pg.addEventListener("pointerdown", e => e.stopPropagation()); bar.appendChild(pg);
  const inp = pg.querySelector("input"), cer = pg.querySelector("circle"), val = pg.querySelector("b");
  const maj = () => { inp.value = RD.gommeT; cer.setAttribute("r", Math.min(20, 3 + RD.gommeT * 3)); val.textContent = "× " + String(RD.gommeT).replace(".", ","); };
  inp.addEventListener("input", () => { RD.gommeT = +inp.value; try { localStorage.setItem("gommeTaille", RD.gommeT); } catch(e){} maj(); });
  /* 13 nov. (« la fenêtre de la gomme gêne et cache le tableau ») : elle s'ouvre quand on prend la gomme, puis se cache seule
     2,5 s après le dernier réglage (ou dès qu'on touche le tableau); la gomme reste active. */
  let avant = false, minu = null;
  const cacherBientot = (ms) => { clearTimeout(minu); minu = setTimeout(() => { if (!pg.matches(":hover")) pg.hidden = true; else cacherBientot(1200); }, ms); };
  window.majPopGomme = () => { if (!RD.eraser) pg.hidden = true; else if (!avant){ pg.hidden = false; cacherBientot(3000); } avant = !!RD.eraser; maj(); try { majGommeCur(); } catch(e){} };
  inp.addEventListener("input", () => cacherBientot(2500));
  pg.addEventListener("pointerup", () => cacherBientot(2500));
  $("#inkCanvas").addEventListener("pointerdown", () => { if (RD.eraser){ clearTimeout(minu); pg.hidden = true; } }, true);
  /* la fenêtre reste ouverte tant que la gomme est active (avant : elle se fermait au premier coup de gomme) */
  /* cercle sous la souris : la vraie taille de la gomme */
  const cur = document.createElement("div"); cur.id = "gommeCur"; cur.hidden = true;
  cur.style.cssText = "position:fixed;z-index:90;pointer-events:none;border-radius:50%;border:2px solid rgba(20,20,20,.75);box-shadow:0 0 0 1.5px rgba(255,255,255,.9),inset 0 0 0 1.5px rgba(255,255,255,.9);transform:translate(-50%,-50%)";
  document.body.appendChild(cur); let dern = null;
  const placer = (x, y) => { const c = $("#inkCanvas"), r = c.getBoundingClientRect(), d = Math.max(6, 2 * rayonGomme() * r.height); cur.style.width = cur.style.height = d + "px"; cur.style.left = x + "px"; cur.style.top = y + "px"; };
  const c0 = $("#inkCanvas");
  c0.addEventListener("pointermove", e => { dern = [e.clientX, e.clientY]; if (RD.eraser && (RD.pen || RD.wb)){ cur.hidden = false; placer(e.clientX, e.clientY); } else cur.hidden = true; });
  c0.addEventListener("pointerleave", () => { cur.hidden = true; });
  inp.addEventListener("input", () => { if (dern && RD.eraser){ cur.hidden = false; placer(dern[0], dern[1]); } });
  window.majGommeCur = () => { if (!RD.eraser) cur.hidden = true; };
  maj();
})();
$("#penO").onclick = () => { RD.obj = !RD.obj; if (RD.obj){ RD.text = false; RD.eraser = false; RD.objTab = null; RD.formeK = null; RD.objKi = null; RD.objKe = null; SELO.s = null; }
  refreshTools();
  if (RD.obj) aviser(modeElec() ? "Échelle L1 / L2 : trace les rails, pose un symbole sur un échelon, relie les points bleus." : RD.objTab === "iso" ? "Touche un objet pour le choisir. Double-clic : le nommer." : "Touche une forme pour la choisir. Double-clic : écrire sa valeur.", modeElec() ? 10000 : 0); };
$("#penT").onclick = () => { RD.text = !RD.text; if (RD.text){ RD.eraser = false; RD.obj = false; } refreshTools(); if (RD.text) aviser("Touche le tableau (ou dessine un rectangle), puis écris. Entrée = nouvelle ligne; touche à côté pour terminer."); };
$("#wbZo").onclick = zout; $("#wbZi").onclick = zin; $("#penU").onclick = undoInk; $("#penR").onclick = redoInk;
$("#penC").onclick = () => { if (!strokes().length) return; snapInk(); INKS[inkKey()] = []; redrawInk(); };
$("#penX").onclick = () => { const w = RD.wb; RD.pen = false; RD.eraser = false; RD.text = false; if (w){ RD.wb = true; toggleWb(); } else { RD.wb = false; refreshTools(); } };

/* ---- Ouvrir et fermer le lecteur ---- */
function ouvrirLivre(l, brut){
  try {
    const html = avecFormatMp(injectHead(brut, HOSTCSS + (document.documentElement.classList.contains("leger") ? LEGERCSS : "")));
    killExtras(); RD.html = html; marquerVu(l); $("#readerFrame2").hidden = true; $("#readerFrame2").srcdoc = ""; $("#rinner").classList.remove("dbl"); $("#tbDbl").classList.remove("on"); $("#spine").hidden = true; $("#readerFrame").style.left = $("#readerFrame").style.width = $("#readerFrame").style.clipPath = "";
    RD.t0 = Date.now(); RD.retry = 0; RD.first = undefined; RD.armed = false; RD.offered = false; $("#resume").hidden = true; clearTimeout(RD.resT);
    Object.assign(RD, { single:false, dbl:false, drv2:null, book:l.fichier, drv:null, attached:false, z:1, pen:false, wb:false, spot:false, cache:false, eraser:false, label:"", tot:0 });
    $("#cache").style.top = "40%"; $("#tbTot").textContent = ""; $("#tbPg").value = "";
    $("#readerTitle").textContent = l.titre;
    $("#reader").classList.add("open"); initBarres();
    closeModal(); closeMenu();
    document.body.style.overflow = "hidden";
    sizeInner(); refreshTools();
    $("#readerFrame").srcdoc = html;
    clearInterval(RD.poll); RD.poll = setInterval(poll, 300);
    clearTimeout(RD.attT); RD.attT = setTimeout(attach, 5000);
  } catch(err){
    aviser("Impossible d'ouvrir ce livre : " + err.message);
  }
}
function lire(l){
  try { if (window.COFFRE && window.ACCES && ACCES.session && !ACCES.eleve) COFFRE.stat(l.fichier === "tableau-blanc" ? "outil:tableau" : "livre:" + (l.fichier || "ajoute")); } catch(e){}   /* statistiques anonymes */
  /* « Lire » ouvre le livre en plein écran (réglage Mes préférences → Livre en plein écran); demandé tout de suite, pendant le geste de l'enseignant */
  try { if (!document.fullscreenElement && !document.body.classList.contains("classe") && !(window.PREF && window.PREF().plein === false)){ window.FS_PAR = "livre"; document.documentElement.requestFullscreen().catch(() => { window.FS_PAR = ""; }); } } catch(e){}
  if (l.user){
    DB.getHtml(l.id).then(h => { if (h) ouvrirLivre(l, h); else aviser("Ce livre est introuvable sur cet ordinateur."); })
      .catch(() => aviser("Impossible de lire le livre enregistré."));
    return;
  }
  if (l.fichier && window.ACCES && location.protocol.startsWith("http")){                  /* livres protégés (chiffrés) : compte enseignant */
    if (!ACCES.estPret){ ACCES.pret.then(() => lire(l)); return; }
    if (ACCES.protege(l.fichier)){
      if (!ACCES.permis(l.fichier)){   /* le cadenas du livre bouge un peu, puis la connexion s'ouvre */
        const cads = [...document.querySelectorAll('.book[data-f="' + l.fichier + '"] .cadenas')].filter(c => c.offsetParent);
        cads.forEach(c => { c.classList.remove("secoue"); void c.offsetWidth; c.classList.add("secoue"); });
        setTimeout(() => { if (!ACCES.session) ACCES.dlgConnexion(() => lire(l)); else aviser("Ce livre ne t'est pas encore permis. Demande l'accès à Jeremy."); }, cads.length ? 520 : 0); return; }
      chargement(l, true);   /* 10 nov. (TNI) : garder l'écran de chargement jusqu'à ce que le livre soit prêt (avant : caché après 4 s → écran noir) */
      ACCES.ouvrir(l).then(h => ouvrirLivre(l, h)).catch(err => { chargement(null); aviser("Impossible d'ouvrir ce livre : " + err.message + "."); });
      return; } }
  if (l.fichier && window.LIVRES_DATA && LIVRES_DATA[l.fichier]){
    try {
      const bin = atob(LIVRES_DATA[l.fichier]);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      ouvrirLivre(l, new TextDecoder("utf-8").decode(bytes));
    } catch(err){
      aviser("Impossible d'ouvrir ce livre : " + err.message);
    }
  } else if (l.fichier && (window.LIVRES_EXTERNES || location.protocol.startsWith("http"))) {
    chargement(l, true);
    fetch("livres/" + encodeURIComponent(l.fichier) + ".html", { cache: "no-cache" })
      .then(r => { if (!r.ok) throw new Error("fichier introuvable (" + r.status + ")"); return r.text(); })
      .then(h => ouvrirLivre(l, h))
      .catch(err => { chargement(null); aviser("Impossible d'ouvrir ce livre : " + err.message + ". Vérifie la connexion Internet."); });
  } else if (l.lien) window.open(l.lien, "_blank");
  else aviser("Ce livre n'est pas encore disponible en ligne.");
}
window.FS_PAR = "";   /* qui a demandé le plein écran : "livre" | "accueil" | "" (toi, par un bouton ou F11 : jamais quitté automatiquement) */
document.addEventListener("fullscreenchange", () => { if (!document.fullscreenElement) window.FS_PAR = ""; });
function closeReader(){
  setTimeout(() => { try { renderHero(); } catch(e){} }, 400);
  clearInterval(RD.poll); clearTimeout(BAR.t); clearTimeout(RD.attT);
  /* 8 nov. (« ça quitte le plein écran même si on ne l'a pas demandé ») : on ne quitte que le plein écran que le livre a lui-même demandé */
  try { if (document.fullscreenElement && window.FS_PAR === "livre" && !document.body.classList.contains("classe") && !window.TDB_ACTIF) document.exitFullscreen(); } catch(e){}
  $("#reader").classList.remove("open");
  $("#resume").hidden = true; clearTimeout(RD.resT); $("#noir").hidden = true; if (RD.laser) toggleLaser();
  killExtras(); $("#readerFrame").srcdoc = ""; $("#readerFrame2").srcdoc = ""; $("#readerFrame2").hidden = true; $("#rinner").classList.remove("dbl"); RD.dbl = false; RD.single = false; RD.drv2 = null;
  RD.drv = null; RD.attached = false; RD.book = null; RD.armed = false;
  document.body.style.overflow = "";
  try { render(); } catch(e){}
  if (window.RETOUR_ACTIVITES_LIVRE){ window.RETOUR_ACTIVITES_LIVRE = false; try { document.getElementById("actBtn").click(); } catch(e){} }
}
$("#readerBack").onclick = () => { if (window.TDB_ACTIF) allerTableauDeBord(); else closeReader(); };
$("#tdbPill").onclick = () => allerTableauDeBord();
$("#readerTdb").onclick = () => allerTableauDeBord();
/* l'enseignant tourne lui-même les pages : on arrête de forcer la page demandée */
document.addEventListener("keydown", e => { if (/^(ArrowLeft|ArrowRight|PageUp|PageDown| )$/.test(e.key)) RD.bouge = true; }, true);
["#tbPrev", "#tbNext", "#tbPg", "#mmenu"].forEach(sel => { const el = document.querySelector(sel); if (el) el.addEventListener("pointerdown", () => { RD.bouge = true; }, true); });
/* ---- Contenus ouverts depuis le tableau de bord (accueil de classe) ----
   livre + page · schéma (modèle ou « Mes schémas ») sur un tableau blanc · dossier de plans. En fermant, on revient au tableau de bord. */
window.RETOUR_ACCUEIL = false;
/* Session « tableau de bord » : le livre reste ouvert sous le tableau de bord, on passe de l'un à l'autre en un clic */
window.TDB_ACTIF = false;
const ICO_TDB = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="4" width="17" height="12.5" rx="1.5"/><path d="M8 20h8M12 16.5V20"/></svg>';
function marquerTdb(on){
  window.TDB_ACTIF = on; $("#reader").classList.toggle("tdb", on);
  $("#readerBack").innerHTML = on ? ICO_TDB + "Tableau de bord" : "← Retour";
  $("#readerBack").title = on ? "Retour au tableau de bord (E) — le livre reste ouvert" : "";
}
function allerTableauDeBord(){ marquerTdb(true); try { window.ouvrirAccueil(); } catch(e){} }
function fermerLivreVraiment(){ const t = window.TDB_ACTIF; marquerTdb(false); window.TDB_ACTIF = t; closeReader(); window.TDB_ACTIF = t; }
function ouvrirTableauBlanc(apres){
  try { localStorage.setItem("dernierTableau", String(Date.now())); } catch(e){}
  try { if (window.COFFRE && window.ACCES && ACCES.session && !ACCES.eleve) COFFRE.stat("outil:tableau"); } catch(e){}
  const l = { fichier:"tableau-blanc", titre:"Tableau blanc" };
  ouvrirLivre(l, '<!doctype html><html><head><meta charset="utf-8"><title>Tableau blanc</title></head><body style="margin:0;background:#fff;height:100vh"></body></html>');
  let n = 0; const t = setInterval(() => { n++;
    let pret = false; try { pret = !!(RD.drv && RD.drv.state().tot > 0); } catch(e){}
    if (pret || n > 60){ clearInterval(t); if (!RD.wb) toggleWb();
      try { const P = window.PREF ? window.PREF() : {}, st = wbEtat();   /* préférences du prof : fond et couleur du crayon au départ */
        if (P.fond && WBFONDS.some(f => f.k === P.fond)){
          /* le dessin déjà là n'est jamais touché : on va sur un tableau vide (celui affiché, un autre déjà vide, sinon un nouveau à la fin) avec le fond préféré */
          let v = wbVide(st.n) ? st.n : 0; for (let i = 1; !v && i <= st.count; i++) if (wbVide(i)) v = i;
          if (!v){ st.count++; v = st.count; setTimeout(() => aviser("Nouveau tableau " + v + ". Ton dessin d'avant est au tableau " + (v - 1) + " (flèche ←).", 4500), 600); }
          if (v !== st.n || st.bg[v] !== P.fond){ st.n = v; st.bg[v] = P.fond; majFond(); redrawInk(); refreshTools(); planifierSauvegarde(); } }
        if (P.crayon) { RD.color = P.crayon; refreshTools(); } } catch(e){}
      if (apres) setTimeout(apres, 120); } }, 100);
}
function ouvrirContenu(c){
  if (!c) return;
  if (c.type === "livre"){ const l = LIVRES.find(x => x.fichier === c.f); if (!l){ aviser("Ce livre n'est plus dans la bibliothèque."); return; }
    marquerTdb(true); if (c.page > 1) RD.allerA = c.page; lire(l); return; }
  if (c.type === "schema"){ marquerTdb(true);
    ouvrirTableauBlanc(() => { marquerTdb(true);
      if (c.modele){ const m = MODELES.find(x => x.id === c.modele); if (m) poserModele(m); }
      else if (c.sch){ const sc = lireSch().find(x => String(x.id) === String(c.sch)); if (sc) ouvrirSchema(sc); else aviser("Ce schéma n'est plus dans « Mes schémas »."); }
      else { wbEtat().bg[wbEtat().n] = "quad"; majFond(); RD.obj = true; refreshTools(); } });
    return; }
  if (c.type === "tableau"){ marquerTdb(true); ouvrirTableauBlanc(() => { marquerTdb(true); if (c.fond){ wbEtat().bg[wbEtat().n] = c.fond; majFond(); refreshTools(); } }); return; }
  if (c.type === "plan"){ window.RETOUR_ACCUEIL = true; $("#planBtn").click(); setTimeout(() => { const b = document.querySelector('.pl-ex[data-ex="' + c.n + '"]'); if (b) b.click(); }, 250); }
}
/* retour au tableau de bord quand on ferme les plans */
document.addEventListener("DOMContentLoaded", () => { const ov = document.getElementById("planOv"); if (!ov) return;
  new MutationObserver(() => { if (ov.hidden && window.RETOUR_ACTIVITES){ window.RETOUR_ACTIVITES = false; try { document.getElementById("actBtn").click(); } catch(e){} }
    if (ov.hidden && window.RETOUR_ACCUEIL){ window.RETOUR_ACCUEIL = false; try { window.ouvrirAccueil(); } catch(e){} } }).observe(ov, { attributes:true, attributeFilter:["hidden"] }); });
/* version du livre (champ « version » de LIVRES) et date de la dernière mise à jour connue (Quoi de neuf) */
function versionLivre(l){ const e = (typeof NOUV !== "undefined" ? NOUV : []).filter(n => n.livre === l.fichier && n.date).sort((a, b) => b.date.localeCompare(a.date))[0];
  const v = l.version ? "Version " + l.version : "", d = e ? (e.type === "ajout" ? "ajouté le " : "mis à jour le ") + dateFr(e.date) : "";
  return v && d ? v + " · " + d : v ? v : d ? d.charAt(0).toUpperCase() + d.slice(1) : ""; }
/* Imprimer un livre ou l'enregistrer en PDF : toutes les pages l'une sous l'autre, format Lettre sans marges, en vectoriel (texte net à toute taille) */
function openModal(l){
  $("#panel").innerHTML = `
    <div class="panel-top ${couv(l) ? 'with-cover' : ''}" style="${couv(l) ? 'background:' + fond(l) : coverStyle(l) + ';background-size:cover'}">
      <button class="close" aria-label="Fermer">✕</button>
      ${couv(l) ? `<img class="panel-cover" src="${esc(couv(l))}" alt="">` : ""}
      <h2>${esc(l.titre)}</h2>
    </div>
    <div class="panel-body">
      <div class="meta">
        ${l.enConstruction ? '<span class="constr">' + ICO_CONSTR + ' En construction — pas encore la version finale</span>' : ''}${l.enConstruction ? '' : majRecente(l) ? `<span class="green">Mis à jour le ${esc(dateFr(majRecente(l).date))}</span>` : estNouveau(l) ? '<span class="green">Nouveau</span>' : ''}
        <span>${esc(l.annee)}</span><span>${l.pages ? esc(l.pages) + ' pages' : ''}</span>
        <span>${l.competence ? 'Compétence ' + esc(l.competence) : ''}</span><span>${esc(l.categorie)}</span><span>${l.niveau ? 'Niveau : ' + esc(l.niveau) : ''}</span>
      </div>
      <p><strong>Par ${esc(l.auteur)}</strong></p>
      ${versionLivre(l) ? `<p class="m-version">${esc(versionLivre(l))}</p>` : ""}
      <p>${esc(l.description)}</p>
      <button class="btn btn-play" id="mRead">▶ Lire</button>
      <button class="btn btn-fav" id="mFav">${isFav(l) ? "✓ Dans ma liste" : "+ Ma liste"}</button>
    </div>`;
  $("#modal").classList.add("open");
  $(".close").onclick = closeModal;
  $("#mRead").onclick = () => lire(l);
  $("#mFav").onclick = () => {
    favs = isFav(l) ? favs.filter(f => f !== l.fichier) : [...favs, l.fichier];
    saveFavs(); openModal(l); render();
  };
}
function closeModal(){ $("#modal").classList.remove("open", "sur-act"); }
$("#modal").addEventListener("click", e => { if (e.target.id === "modal") closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

/* ---- Écran tactile : un seul doigt dessine (6 nov.). Un 2e doigt, la paume ou un pincement ne tracent rien et ne volent pas le trait en cours ---- */
(function(){
  const bas = new Map(), ignores = new Set();   /* bas : doigt → dernier mouvement (un doigt oublié depuis 1,5 s ne bloque rien) */
  const surToile = e => e.pointerType === "touch" && e.target && e.target.classList && e.target.classList.contains("ink");
  document.addEventListener("pointerdown", e => {
    if (e.pointerType !== "touch") return;
    const t = performance.now(); bas.forEach((v, id) => { if (t - v > 1500) bas.delete(id); });
    if (bas.size && surToile(e)){ ignores.add(e.pointerId); e.stopImmediatePropagation(); e.preventDefault(); return; }
    if (surToile(e)) bas.set(e.pointerId, t);
  }, true);
  document.addEventListener("pointermove", e => { if (ignores.has(e.pointerId)) e.stopImmediatePropagation(); else if (bas.has(e.pointerId)) bas.set(e.pointerId, performance.now()); }, true);
  const fin = e => {
    if (ignores.has(e.pointerId)){ ignores.delete(e.pointerId); e.stopImmediatePropagation(); return; }
    bas.delete(e.pointerId);
  };
  document.addEventListener("pointerup", fin, true);
  document.addEventListener("pointercancel", fin, true);
})();

/* ---- Glissement des rangées (flèches ‹ ›) : un seul mouvement doux, sans à-coups ---- */
function glisserRangee(sc, dx){
  const max = sc.scrollWidth - sc.clientWidth;
  const depart = sc.scrollLeft;
  /* clics rapprochés : on part de la destination déjà visée, le glissement continue au lieu de recommencer */
  const but0 = sc._but != null ? sc._but : depart;
  const but = Math.max(0, Math.min(max, but0 + dx));
  if (Math.abs(but - depart) < 1) return;
  sc._but = but;
  if (sc._anim) cancelAnimationFrame(sc._anim);
  if (matchMedia("(prefers-reduced-motion:reduce)").matches){ sc.style.scrollBehavior = "auto"; sc.scrollLeft = but; sc._but = null; return; }
  sc.style.scrollBehavior = "auto";
  const dist = but - depart, dur = Math.max(450, Math.min(1100, Math.abs(dist) * 0.9));
  const t0 = performance.now();
  const ease = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
  const stop = () => { if (sc._anim){ cancelAnimationFrame(sc._anim); sc._anim = 0; } sc._but = null; sc.style.scrollBehavior = ""; };
  ["wheel","touchstart","pointerdown"].forEach(ev => sc.addEventListener(ev, stop, { once:true, passive:true }));
  const pas = now => {
    const t = Math.min(1, (now - t0) / dur);
    sc.scrollLeft = depart + dist * ease(t);
    if (t < 1) sc._anim = requestAnimationFrame(pas);
    else { sc._anim = 0; sc._but = null; sc.style.scrollBehavior = ""; }
  };
  sc._anim = requestAnimationFrame(pas);
}

/* ---- Événements ---- */
$("#rows").addEventListener("click", e => {
  const arrow = e.target.closest(".arrow");
  if (arrow){
    const sc = arrow.parentElement.querySelector(".scroller");
    glisserRangee(sc, (arrow.classList.contains("left") ? -1 : 1) * sc.clientWidth * .8);
    return;
  }
  const card = e.target.closest(".book");
  const l = card && LIVRES.find(x => x.fichier === card.dataset.f);
  if (l) openModal(l);
});
$("#search").addEventListener("input", e => { query = e.target.value.trim(); render(); });
document.querySelectorAll("nav a[data-view]").forEach(a => a.onclick = () => {
  document.querySelectorAll("nav a[data-view]").forEach(x => x.classList.remove("active"));
  a.classList.add("active"); view = a.dataset.view; render();
  window.scrollTo({ top: view === "all" ? 0 : 80, behavior:"smooth" });
});
window.addEventListener("scroll", () => $("#topbar").classList.toggle("solid", scrollY > 60));

renderHero();
render();
