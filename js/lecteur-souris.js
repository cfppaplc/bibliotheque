/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — lecteur-souris.js (sorti d'index.html le 15 nov.) */
/* ---- Souris : glisser pour se déplacer, molette fluide, Ctrl + molette pour zoomer ---- */
const PAN = { on:false, x:0, y:0, l:0, t:0, alvo:null, raf:0 };
/* glisser la page zoomée, avec un petit jeu élastique au-delà des bords (la page revient en place au relâchement) */
function panVers(sc, l, t){ const mx = sc.scrollWidth - sc.clientWidth, my = sc.scrollHeight - sc.clientHeight, cl = Math.max(0, Math.min(mx, l)), ct = Math.max(0, Math.min(my, t));
  sc.scrollLeft = cl; sc.scrollTop = ct; const el = $("#rinner"), j = d => Math.sign(d) * Math.min(90, Math.abs(d) * .35), ox = j(cl - l), oy = j(ct - t);
  el.style.transition = "none"; el.style.translate = (ox || oy) ? ox + "px " + oy + "px" : ""; }
function panFin(){ const el = $("#rinner"); if (!el.style.translate) return; el.style.transition = "translate .35s cubic-bezier(.2,.8,.2,1)"; el.style.translate = ""; setTimeout(() => { if (!PAN.on) el.style.transition = ""; }, 400); }
const outilActif = () => RD.pen || RD.wb;
function defiler(dx, dy){
  const st = $("#rstage");
  if (!PAN.alvo) PAN.alvo = { x:st.scrollLeft, y:st.scrollTop };
  PAN.alvo.x = Math.max(0, Math.min(st.scrollWidth - st.clientWidth, PAN.alvo.x + dx));
  PAN.alvo.y = Math.max(0, Math.min(st.scrollHeight - st.clientHeight, PAN.alvo.y + dy));
  if (!PAN.raf) PAN.raf = requestAnimationFrame(pasDefilement);
}
function pasDefilement(){
  PAN.raf = 0; const st = $("#rstage"), a = PAN.alvo; if (!a) return;
  const ax = a.x - st.scrollLeft, ay = a.y - st.scrollTop;
  if (Math.abs(ax) < .6 && Math.abs(ay) < .6){ st.scrollLeft = a.x; st.scrollTop = a.y; PAN.alvo = null; return; }
  st.scrollLeft += ax * .28; st.scrollTop += ay * .28;
  PAN.raf = requestAnimationFrame(pasDefilement);
}
const ZS = { d:0, px:0, py:0, raf:0 };
/* Zoom : pas de fondu de page (7 nov.). Quand le livre se remet à l'échelle, sa page peut rejouer son fondu d'ouverture (opacité 0 → 1) = écran qui flashe noir.
   Pendant un zoom et 1,6 s après, cette animation dure 0 s (pas « animation:none » : la remettre la faisait rejouer = flash à la fin du zoom). */
/* Livre zoomé qu'on glisse (7 nov.) : les animations qui tournent en boucle dans le livre (lueurs, pulsations) obligeaient à redessiner
   la page agrandie à chaque image : jusqu'à 0,9 s par image sur le tableau interactif. On les met en pause pendant qu'on glisse ou zoome
   (seulement si le livre est zoomé), et elles repartent 0,5 s après. Les pages elles-mêmes (fondu d'arrivée) ne sont pas touchées. */
let ZPAUSE = 0;
function pauseLivre(){
  if (RD.z <= 1.01 && !ZS.on) return;
  ["#readerFrame", "#readerFrame2"].forEach(id => { try { const d = $(id).contentDocument; if (!d || !d.head || d.getElementById("zpause")) return;
    const st = d.createElement("style"); st.id = "zpause"; st.textContent = "body *:not(.page),body *::before,body *::after{animation-play-state:paused!important}"; d.head.appendChild(st);
    d.querySelectorAll("svg").forEach(v => { try { if (v.animationsPaused && !v.animationsPaused()){ v.pauseAnimations(); v.dataset.zp = "1"; } } catch(e){} }); } catch(e){} });
  clearTimeout(ZPAUSE);
  ZPAUSE = setTimeout(() => ["#readerFrame", "#readerFrame2"].forEach(id => { try { const d = $(id).contentDocument, x = d.getElementById("zpause"); if (x) x.remove();
    d.querySelectorAll("svg[data-zp]").forEach(v => { try { v.unpauseAnimations(); } catch(e){} delete v.dataset.zp; }); } catch(e){} }), 500);
}
let ZCALME = 0;
function calmePage(){
  ["#readerFrame", "#readerFrame2", "#readerFrame3", "#readerFrame4"].forEach(id => { try { const d = $(id).contentDocument; if (!d || !d.head) return;
    if (!d.getElementById("zcalme")){ const st = d.createElement("style"); st.id = "zcalme"; st.textContent = ".page,.page.vis,.page.hcur,#book>.page,#book>.page.cur,#book>.page.out{animation-duration:0s!important;animation-delay:0s!important;transition:none!important}"; d.head.appendChild(st); } } catch(e){} });
  clearTimeout(ZCALME);
  ZCALME = setTimeout(() => ["#readerFrame", "#readerFrame2", "#readerFrame3", "#readerFrame4"].forEach(id => { try { const x = $(id).contentDocument.getElementById("zcalme"); if (x) x.remove(); } catch(e){} }), 1600);
}
function zoomSouris(e, frame){ ZS.t = Date.now();
  const st = $("#rstage"), sr = st.getBoundingClientRect(), fr = frame ? frame.getBoundingClientRect() : sr;
  const kf = frame && !e.ecran ? fr.width / (frame.offsetWidth || fr.width) : 1;   /* cadre agrandi par le zoom : ses coordonnées sont à remettre à l'échelle de l'écran */
  ZS.px = (frame ? fr.left + e.clientX * kf : e.clientX) - sr.left; ZS.py = (frame ? fr.top + e.clientY * kf : e.clientY) - sr.top;
  ZS.d += Math.max(-40, Math.min(40, e.deltaY * (e.deltaMode === 1 ? 33 : 1)));
  if (!ZS.raf) ZS.raf = requestAnimationFrame(zoomSourisPas);
}
/* Zoom à la roulette (4 nov.) : pendant le geste, on agrandit seulement l'image (transform, très léger); le vrai redimensionnement du livre
   (qui fait recalculer toute la page) se fait une seule fois, quand la roulette s'arrête. Le point sous la souris reste sous la souris. */
function zoomSourisPas(){
  ZS.raf = 0; const st = $("#rstage"), inn = $("#rinner"), px = ZS.px, py = ZS.py, d = Math.max(-80, Math.min(80, ZS.d)); ZS.d = 0;
  if (!RD.wb) pauseLivre(); if (!ZS.on){ calmePage(); ZS.on = true;
    /* (7 nov.) pendant le geste : pas de flou derrière les barres (le flou est recalculé à chaque image pendant que le livre grossit : très lourd sur le tableau interactif)
       et toile du crayon cachée si la page n'a aucun trait (une image de plus de 8 millions de pixels à agrandir pour rien) */
    $("#reader").classList.add("zg"); try { if (!strokes().length) $("#inkCanvas").style.visibility = "hidden"; } catch(e){} ZS.z0 = RD.z; ZS.z = RD.z; ZS.sl = st.scrollLeft; ZS.stp = st.scrollTop; ZS.mx0 = RD.mx || 0; ZS.my0 = RD.my || 0; ZS.tx = 0; ZS.ty = 0; ZS.s = 1; PAN.alvo = null; }
  const z = Math.max(zMin(), Math.min(zMax(), ZS.z * Math.exp(-d * .0075)));
  if (Math.abs(z - ZS.z) > .0005){
    const s0 = ZS.s, s1 = z / ZS.z0, bx = ZS.mx0 - ZS.sl, by = ZS.my0 - ZS.stp;
    const ux = (px - bx - ZS.tx) / s0, uy = (py - by - ZS.ty) / s0;          /* point du livre sous la souris (unités du zoom de départ) */
    ZS.tx = px - bx - ux * s1; ZS.ty = py - by - uy * s1; ZS.s = s1; ZS.z = z; ZS.px1 = px; ZS.py1 = py;
    inn.style.willChange = "transform"; inn.style.transformOrigin = "0 0"; inn.style.transform = "translate(" + ZS.tx + "px," + ZS.ty + "px) scale(" + s1 + ")";
    const t = Math.round(z * 100) + "%"; $("#tbZv").textContent = t; $("#wbZv").textContent = t;
  }
  clearTimeout(ZS.fin); if (!ZS.tenu) ZS.fin = setTimeout(zoomSourisFin, 140);   /* doigts posés (pincement) : on attend qu'ils se lèvent, sinon une pause de 140 ms refait tout le livre et l'écran clignote */
}
function zoomSourisFin(){
  if (!ZS.on) return; const st = $("#rstage"), inn = $("#rinner"), K = RD.wb ? WBK : 1;
  const px = ZS.px1 == null ? ZS.px : ZS.px1, py = ZS.py1 == null ? ZS.py : ZS.py1;
  const cx = ((px - (ZS.mx0 - ZS.sl) - ZS.tx) / ZS.s) / (ZS.z0 * K), cy = ((py - (ZS.my0 - ZS.stp) - ZS.ty) / ZS.s) / (ZS.z0 * K), z = ZS.z;
  ZS.on = false; ZS.px1 = ZS.py1 = null; inn.style.transform = ""; inn.style.transformOrigin = ""; inn.style.willChange = ""; $("#reader").classList.remove("zg"); $("#inkCanvas").style.visibility = "";
  /* (12 nov., vidéo du TNI) après un zoom, le tableau met ~2 s à redessiner la page agrandie : on voyait le fond noir (écran noir).
     Pendant ce temps, fond blanc comme la page : on ne voit plus de flash noir. */
  if (!RD.wb){ const R = $("#reader"); R.classList.add("zredess"); clearTimeout(ZS.blanc); ZS.blanc = setTimeout(() => R.classList.remove("zredess"), 3500); }
  if (Math.abs(z - RD.z) > .002){ setZoom(z, true);
    st.scrollLeft = cx * RD.z * K + (RD.mx || 0) - px; st.scrollTop = cy * RD.z * K + (RD.my || 0) - py; }
  try { sizeInner(); } catch(e){}   /* toile et dessin remis nets */
}
/* Pincement à deux doigts = zoom (6 nov., écran tactile) : même zoom que la roulette (zoomSouris), centré entre les deux doigts.
   Le petit trait que le 1er doigt a pu tracer avant l'arrivée du 2e est annulé à la fin du geste. */
/* (7 nov.) les doigts sont suivis pour TOUS les documents ensemble (bibliothèque + pages du livre) : en double page, un doigt sur chaque page
   = deux documents qui ne voyaient chacun qu'un seul doigt, et le pincement ne marchait pas. Positions gardées en coordonnées de l'écran. */
const PZ = { pts:new Map(), actif:false, apres:false, d0:0, n0:0 };
function brancherPincement(cible, frame){
  const nom = frame ? frame.id : "biblio";
  const ecran = t => { if (!frame) return [t.clientX, t.clientY]; const r = frame.getBoundingClientRect(), k = frame.offsetWidth ? r.width / frame.offsetWidth : 1; return [r.left + t.clientX * k, r.top + t.clientY * k]; };
  const garde = e => !frame ? ($("#reader") && $("#reader").classList.contains("open") && $("#reader").contains(e.target)) : true;
  const sync = e => { const n = Date.now(); [...PZ.pts.keys()].forEach(c => { if (c.startsWith(nom + ":t") || n - PZ.pts.get(c).t > 4000) PZ.pts.delete(c); });   /* les doigts de ce document = ceux de e.touches */
    for (const t of e.touches) PZ.pts.set(nom + ":t" + t.identifier, { p:ecran(t), t:n }); };
  const deux = () => { const v = [...PZ.pts.values()]; return v.length === 2 ? v.map(o => o.p) : null; };
  cible.addEventListener("touchstart", e => {
    if (!garde(e)) return; sync(e);
    const q = deux(); if (q && !PZ.actif){ PZ.d0 = Math.hypot(q[0][0] - q[1][0], q[0][1] - q[1][1]); PZ.actif = PZ.d0 > 12; if (PZ.actif){ PZ.apres = true; ZS.tenu = true; clearTimeout(ZS.fin); } }
  }, { capture:true, passive:true });
  /* nombre de traits avant que le 1er doigt (pointerdown, qui précède touchstart) ne commence le sien */
  cible.addEventListener("pointerdown", e => { if ((e.pointerType === "touch" || e.pointerType === "pen") && e.isPrimary && !PZ.actif && !PZ.pts.size){ try { PZ.n0 = strokes().length; } catch(x){ PZ.n0 = 0; } } }, { capture:true, passive:true });
  cible.addEventListener("touchmove", e => {
    sync(e);
    if (PZ.apres && !PZ.actif && PZ.pts.size === 1){ e.preventDefault(); return; }   /* un doigt levé avant l'autre : celui qui reste ne fait plus glisser la page */
    const q = deux(); if (!q) return;
    if (!PZ.actif){ PZ.d0 = Math.hypot(q[0][0] - q[1][0], q[0][1] - q[1][1]); PZ.actif = PZ.d0 > 12; if (PZ.actif){ PZ.apres = true; ZS.tenu = true; clearTimeout(ZS.fin); e.preventDefault(); } return; }   /* le 2e doigt est arrivé ailleurs (autre page, bord de l'écran) : le navigateur ne l'annonce qu'au 1er mouvement */
    const d = Math.hypot(q[0][0] - q[1][0], q[0][1] - q[1][1]); if (d < 12 || !PZ.d0) return;
    e.preventDefault();
    zoomSouris({ clientX:(q[0][0] + q[1][0]) / 2, clientY:(q[0][1] + q[1][1]) / 2, deltaY: -Math.log(d / PZ.d0) * 2.2 / .0075, deltaMode:0 }, null);
    PZ.d0 = d;
  }, { capture:true, passive:false });
  const fin = e => {
    sync(e);
    if (PZ.actif && PZ.pts.size < 2){ PZ.actif = false; ZS.tenu = false; clearTimeout(ZS.fin); ZS.fin = setTimeout(zoomSourisFin, 60); }   /* le zoom se termine dès qu'un doigt se lève */
    if (PZ.pts.size || !PZ.apres) return; PZ.apres = false;
    const n0 = PZ.n0; setTimeout(() => { try { if (strokes().length > n0) undoInk(); } catch(x){} }, 350);   /* trait parasite du 1er doigt */
  };
  cible.addEventListener("touchend", fin, { capture:true, passive:true });
  cible.addEventListener("touchcancel", fin, { capture:true, passive:true });
  /* (12 nov.) TNI SMART : dans un pincement, un des deux doigts arrive souvent en « pen » 1 × 1 px (vidéo de contact.html).
     Un « pen » ne donne aucun événement touch : le pincement ne voyait qu'un doigt, et ce doigt-là faisait glisser la page
     pendant que l'autre défilait = page qui saute / flash. On compte donc aussi ces doigts « pen » (petits, sans gomme). */
  const estDoigtPen = e => e.pointerType === "pen" && !(e.buttons & 32) && Math.max(e.width || 1, e.height || 1) < 18;
  const menage = () => { const n = Date.now(); [...PZ.pts.keys()].forEach(c => { if (c.includes(":p") && n - PZ.pts.get(c).t > 1200) PZ.pts.delete(c); }); };   /* un doigt « pen » dont on n'a pas vu le relâchement (il s'est levé dans l'autre document) ne doit jamais rester compté */
  const evaluer = e => {
    menage(); const q = deux(); if (!q) return;
    const d = Math.hypot(q[0][0] - q[1][0], q[0][1] - q[1][1]);
    if (!PZ.actif){ PZ.d0 = d; PZ.actif = d > 12; if (PZ.actif){ PZ.apres = true; ZS.tenu = true; clearTimeout(ZS.fin); if (PAN.on){ PAN.on = false; try { panFin(); } catch(x){} } } return; }
    if (d < 12 || !PZ.d0) return;
    if (e.cancelable) e.preventDefault();
    zoomSouris({ clientX:(q[0][0] + q[1][0]) / 2, clientY:(q[0][1] + q[1][1]) / 2, deltaY: -Math.log(d / PZ.d0) * 2.2 / .0075, deltaMode:0 }, null);
    PZ.d0 = d;
  };
  cible.addEventListener("pointerdown", e => { if (!estDoigtPen(e) || !garde(e)) return; menage(); [...PZ.pts.keys()].forEach(c => { if (c.endsWith(":p" + e.pointerId)) PZ.pts.delete(c); }); PZ.pts.set(nom + ":p" + e.pointerId, { p:ecran(e), t:Date.now() });
    if (PZ.pts.size === 2){ try { PZ.n0 = Math.min(PZ.n0 == null ? 1e9 : PZ.n0, strokes().length); } catch(x){} evaluer(e); if (PZ.actif) e.preventDefault(); } }, { capture:true });
  cible.addEventListener("pointermove", e => { const c = nom + ":p" + e.pointerId; if (!PZ.pts.has(c)) return; if (!e.buttons){ finPen(e); return; } PZ.pts.set(c, { p:ecran(e), t:Date.now() });
    menage(); if (PZ.pts.size < 2){ PZ.actif = false; return; } evaluer(e); e.stopImmediatePropagation(); }, { capture:true });   /* (16 nov.) un stylet seul n'est jamais un pincement */
  function finPen(e){ if (e.pointerType !== "pen") return; let vu = false; [...PZ.pts.keys()].forEach(c => { if (c.endsWith(":p" + e.pointerId)){ PZ.pts.delete(c); vu = true; } }); if (!vu) return;
    if (PZ.actif && PZ.pts.size < 2){ PZ.actif = false; ZS.tenu = false; clearTimeout(ZS.fin); ZS.fin = setTimeout(zoomSourisFin, 60); }
    if (!PZ.pts.size && PZ.apres){ PZ.apres = false; const n0 = PZ.n0; setTimeout(() => { try { if (strokes().length > n0) undoInk(); } catch(x){} }, 350); } }
  cible.addEventListener("pointerup", finPen, { capture:true });
  cible.addEventListener("pointercancel", finPen, { capture:true });
}
brancherPincement(document, null);
function majCurseur(){
  const c = RD.laser ? "none" : (RD.z > 1 && !outilActif() ? "grab" : "");
  [$("#readerFrame"), $("#readerFrame2")].forEach(f => { try {
    const d = f.contentDocument, h = d.documentElement; h.style.cursor = c;
    if (!d.getElementById("laserCur")){ const st = d.createElement("style"); st.id = "laserCur"; st.textContent = "html.laseron,html.laseron *{cursor:none!important}"; (d.head || h).appendChild(st); }
    h.classList.toggle("laseron", !!RD.laser);
  } catch(e){} });
  $("#rstage").style.cursor = c; $("#reader").classList.toggle("laseron", !!RD.laser);
}
function brancherSouris(win){
  const doc = win.document, st = () => $("#rstage");
  brancherPincement(win, win.frameElement);
  /* les barres reviennent quand la souris touche le haut ou le bas de l'écran, ou qu'on touche le bas */
  win.addEventListener("mousemove", e => { if (e.buttons) return; bordBarres(e.clientY, win.innerHeight); }, { passive:true });
  win.addEventListener("touchstart", e => { const t = e.touches && e.touches[0]; if (t && (t.clientY < 28 || t.clientY > win.innerHeight - 36)) afficherBarres(); }, { passive:true });
  /* Balayer à gauche ou à droite = page suivante ou précédente; un toucher simple au milieu affiche ou cache les barres */
  let bal = null;
  win.addEventListener("touchstart", e => { bal = null; if (!e.touches || e.touches.length !== 1 || RD.pen || RD.wb || RD.text || RD.obj || RD.z > 1.01) return;
    const t = e.touches[0]; bal = { x:t.clientX, y:t.clientY, t:Date.now(), cible:e.target }; }, { passive:true });
  win.addEventListener("touchmove", e => { if (bal && e.touches && e.touches.length > 1) bal = null; }, { passive:true });
  win.addEventListener("touchend", e => { if (!bal) return; const b = bal; bal = null; const t = e.changedTouches && e.changedTouches[0]; if (!t) return;
    const dx = t.clientX - b.x, dy = t.clientY - b.y, dt = Date.now() - b.t;
    let sel = ""; try { sel = String(win.getSelection() || ""); } catch(er){}
    const ax = Math.abs(dx), seuil = Math.max(26, Math.min(70, (win.innerWidth || 800) * .07)), vif = ax / Math.max(dt, 1) > .45;   /* seuil = 7 % de la largeur (26 à 70 px); un coup sec (> 0,45 px/ms) passe dès 22 px */
    if ((ax > seuil || (vif && ax > 22)) && ax > Math.abs(dy) * 1.15 && dt < 1100 && !sel){ RD.bouge = true; turn(dx < 0 ? 1 : -1); return; }
    const actif = b.cible && b.cible.closest && b.cible.closest("a,button,input,select,textarea,label,summary,[onclick],[role=button],[contenteditable]");
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && dt < 350 && !actif && matchMedia("(max-width:900px) and (pointer:coarse)").matches){
      const y = t.clientY / win.innerHeight; if (y > .18 && y < .82){ const R = $("#reader"); if (R.classList.contains("calme")) afficherBarres(); else if (R.classList.contains("auto")) { R.classList.add("calme"); } } } }, { passive:true });
  const fin = () => { if (!PAN.on) return; PAN.on = false; panFin(); majCurseur(); };
  /* (3 nov.) roulette enfoncée : jamais le défilement automatique de Windows (la page montait ou descendait toute seule et la roulette ne zoomait plus) */
  win.addEventListener("mousedown", e => { if (e.button === 1) e.preventDefault(); }, true);
  win.addEventListener("auxclick", e => { if (e.button === 1) e.preventDefault(); }, true);
  win.addEventListener("mousedown", e => {
    if (e.button === 1){ e.preventDefault(); e.stopImmediatePropagation(); if (RD.z <= 1.01) return; PAN.b = 4; PAN.on = true; PAN.alvo = null; PAN.x = e.screenX; PAN.y = e.screenY; PAN.l = st().scrollLeft; PAN.t = st().scrollTop; doc.documentElement.style.cursor = "grabbing"; return; }   /* roulette enfoncée : on glisse la page (pas le défilement automatique du navigateur) */
    if (e.button !== 0 || RD.z <= 1.01 || outilActif()) return;
    if (e.target.closest && e.target.closest("a,button,input,select,textarea,label,summary,video,audio,[contenteditable]")) return;
    PAN.b = 1; PAN.on = true; PAN.alvo = null; PAN.x = e.screenX; PAN.y = e.screenY; PAN.l = st().scrollLeft; PAN.t = st().scrollTop;
    doc.documentElement.style.cursor = RD.laser ? "none" : "grabbing"; e.preventDefault();
  });
  win.addEventListener("mousemove", e => {
    if (!PAN.on) return;
    if (!(e.buttons & (PAN.b || 1))){ fin(); return; }
    panVers(st(), PAN.l - (e.screenX - PAN.x), PAN.t - (e.screenY - PAN.y));
  });
  win.addEventListener("mouseup", fin); win.addEventListener("blur", fin);
  win.addEventListener("mousemove", e => { if (RD.laser && win.frameElement){ const r = win.frameElement.getBoundingClientRect(); const k = r.width / (win.innerWidth || r.width) || 1; placerLaser(r.left + e.clientX * k, r.top + e.clientY * k); } });
  doc.addEventListener("mouseleave", () => { $("#laser").hidden = true; });
  /* page simple : le cadre est rogné à la page, donc le zoom propre au livre (C9, M11…) ne montrerait qu'une bande; la bibliothèque zoome elle-même */
  win.addEventListener("wheel", e => {
    if ((!RD.single && !win.__incendie) || RD.wb || e.shiftKey || (RD.drv && RD.drv.defile) || (win.frameElement !== $("#readerFrame") && win.frameElement !== $("#readerFrame2"))) return;   /* protection incendie : toujours le zoom de la bibliothèque, comme les autres livres */
    e.preventDefault(); e.stopImmediatePropagation(); zoomSouris(e, win.frameElement); }, { capture:true, passive:false });
  if (win.__incendie){ const d = win.document, zv = d.getElementById("zv");   /* protection incendie : son zoom à lui (double-clic, deux doigts) est annulé aussitôt; seul le zoom de la bibliothèque reste */
    if (zv && win.MutationObserver) new win.MutationObserver(() => { if (d.body.classList.contains("zoomed")) zv.click(); }).observe(d.body, { attributes:true, attributeFilter:["class"] }); }
  win.addEventListener("wheel", e => {
    if (e.ctrlKey || e.metaKey || RD.wb){ e.preventDefault(); zoomSouris(e, win.frameElement); return; }
    /* roulette seule = zoom, comme dans les livres qui ont leur propre zoom (ceux-là gèrent la roulette eux-mêmes : defaultPrevented) */
    if (!e.defaultPrevented && !e.shiftKey && RD.drv && !RD.drv.defile){ e.preventDefault(); zoomSouris(e, win.frameElement); return; }   /* (3 nov.) même avec le crayon : la roulette zoome toujours, elle ne fait plus descendre la page */
    if (RD.z > 1 && !outilActif()){
      e.preventDefault();
      const h = e.shiftKey && !e.deltaX;
      defiler(h ? e.deltaY : e.deltaX, h ? 0 : e.deltaY);
    }
  }, { passive:false });
}
(function(){
  const st = $("#rstage");
  document.addEventListener("mousedown", e => { if (e.button === 1 && $("#reader").classList.contains("open")) e.preventDefault(); }, true);   /* idem en dehors du livre (marges, toile du crayon) */
  document.addEventListener("auxclick", e => { if (e.button === 1 && $("#reader").classList.contains("open")) e.preventDefault(); }, true);
  st.addEventListener("mousedown", e => {
    if (e.button === 1){ e.preventDefault(); if (RD.z <= 1) return; } else if (e.button !== 0 || RD.z <= 1 || outilActif() || !(e.target === st || e.target.id === "rinner" || e.target.id === "spine")) return;
    PAN.b = e.button === 1 ? 4 : 1; PAN.on = true; PAN.alvo = null; PAN.x = e.screenX; PAN.y = e.screenY; PAN.l = st.scrollLeft; PAN.t = st.scrollTop; e.preventDefault();
    st.style.cursor = "grabbing";
  });
  document.addEventListener("mousemove", e => { if (!PAN.on) return; if (!(e.buttons & (PAN.b || 1))){ PAN.on = false; panFin(); majCurseur(); return; }
    panVers(st, PAN.l - (e.screenX - PAN.x), PAN.t - (e.screenY - PAN.y)); });
  document.addEventListener("mouseup", () => { if (PAN.on){ PAN.on = false; panFin(); majCurseur(); } });
  st.addEventListener("wheel", e => {
    if (e.ctrlKey || e.metaKey || RD.wb){ e.preventDefault(); zoomSouris(e, null); return; }
    if (!e.shiftKey && RD.drv && !RD.drv.defile){ e.preventDefault(); zoomSouris(e, null); return; }
    if (RD.z > 1 && !outilActif()){ e.preventDefault(); const h = e.shiftKey && !e.deltaX; defiler(h ? e.deltaY : e.deltaX, h ? 0 : e.deltaY); }
  }, { passive:false });
})();
/* ---- Double page : une 2e copie du livre à droite, pilotée en tandem ---- */
function curPage(){ try { return parseInt(RD.drv.state().label, 10) || 1; } catch(e){ return 1; } }
function totPages(){ try { return RD.drv.state().tot || 0; } catch(e){ return 0; } }
function setupSecond(){
  const f2 = $("#readerFrame2");
  try {
    const win = f2.contentWindow, doc = f2.contentDocument;
    if (!doc || !doc.body) return;
    RD.drv2 = buildDriver(win, doc); hookKeys(win); try { verrouEleve(win, doc); } catch(e){}
    try { brancherSouris(win); } catch(e){}   /* (3 nov.) double page : la roulette, le glisser et la roulette enfoncée marchent aussi sur la page de droite (avant : la page défilait au lieu de zoomer) */
    try { installAnim(win, doc); } catch(e){}
    try { win.dispatchEvent(new Event("resize")); } catch(e){}
    syncSecond(); setTimeout(layoutDbl, 400);
    /* Certains livres gardent leur affichage « 2 pages » dans le cadre de gauche : on le remet sur une seule page */
    setTimeout(() => { try { if (RD.dbl && RD.drv && /\d\s*[-–]\s*\d/.test(RD.drv.state().label)){ RD.drv.goto(curPage()); setTimeout(() => { syncSecond(); layoutDbl(); }, 350); } } catch(e){} }, 700);
    setTimeout(() => (window.requestIdleCallback || (f => setTimeout(f, 1)))(setupExtras, { timeout:4000 }), 6000);   /* (7 nov.) copies pour l'animation de page : 6 s après l'ouverture, quand l'ordinateur est libre (avant : 0,3 s = 4 copies du livre qui se chargent en même temps) */
  } catch(e){}
}
function syncSecond(){
  if (!RD.dbl || !RD.drv2) return;
  const n = curPage(), t = totPages(), f1 = $("#readerFrame"), f2 = $("#readerFrame2");
  if (n <= 1){                                  /* couverture : seule, sur la page de droite */
    f1.style.visibility = "hidden"; f2.style.visibility = "visible";
    try { RD.drv2.goto(1); } catch(e){}
  } else {
    f1.style.visibility = "visible";
    if (t && n + 1 > t) f2.style.visibility = "hidden";   /* dernière page seule, à gauche */
    else { f2.style.visibility = "visible"; try { RD.drv2.goto(n + 1); } catch(e){} }
  }
  relayoutLater(); setTimeout(layoutDbl, 350);
}
/* Page de départ du tour suivant ou précédent : couverture seule, puis pages paires à gauche */
function cibleTour(dir){ const n = curPage(); return dir > 0 ? (n <= 1 ? 2 : n + 2) : (n <= 2 ? 1 : n - 2); }
/* Les pages impaires (sauf la couverture) vont à droite : on recale sur la page paire à gauche */
function caler(s){
  if (!RD.dbl || RD.flip || !RD.drv2) return false;
  const n = parseInt(s.label, 10), t = s.tot || 0, prev = parseInt(RD.label, 10) || 1;
  if (!n || n <= 1 || n % 2 === 0) return false;
  let to = n - 1;
  if (Math.abs(n - prev) === 1 && n > prev && (!t || n + 1 <= t)) to = n + 1;   /* un pas en avant (balayage) */
  try { RD.drv.goto(to); } catch(e){}
  return true;
}
let RELAY = [];
function relayoutLater(){ RELAY.forEach(clearTimeout); RELAY = [150, 500, 1100].map(d => setTimeout(layoutDbl, d)); }
function killExtras(){
  [3, 4].forEach(i => { const f = $("#readerFrame" + i); f.onload = null; f.srcdoc = ""; f.hidden = true; f.style.visibility = ""; RD["drv" + i] = null; });
  RD.flip = false;
}
/* Appareils à mémoire limitée (iPhone, iPad, peu de RAM) : pas de copies supplémentaires pour l'animation */
const APPAREIL_LEGER = (function(){
  try {
    const ua = navigator.userAgent || "";
    return /iPhone|iPad|iPod|Android/.test(ua) || (navigator.maxTouchPoints > 1 && /Mac/.test(ua)) || (navigator.deviceMemory && navigator.deviceMemory <= 4);
  } catch(e){ return true; }
})();
window.addEventListener("resize", () => { try { majBoutonDbl(); } catch(e){} });
function setupExtras(){
  if (APPAREIL_LEGER || document.documentElement.classList.contains("sobre")) return;
  [3, 4].forEach(i => {
    const f = $("#readerFrame" + i);
    const go = () => { try { const d = f.contentDocument; if (d && d.body) RD["drv" + i] = buildDriver(f.contentWindow, d); } catch(e){} };
    f.onload = () => setTimeout(go, 60);
    f.hidden = false; f.srcdoc = RD.html;
  });
}
function flipTurn(dir){
  try { flipTurnAnime(dir); } catch(e){
    RD.flip = false; try { $("#rinner").classList.remove("flip"); $("#rscale").style.perspective = ""; } catch(_){}
    try { RD.drv.goto(cibleTour(dir)); setTimeout(() => { syncSecond(); poll(); }, 200); } catch(_){}
  }
}
function flipTurnAnime(dir){
  if (RD.flip){ RD.queued = dir; return; }   /* un tour demandé pendant l'animation est gardé pour la suite */
  const n = curPage(), t = totPages(), m = cibleTour(dir);
  if (m === n || m < 1 || (t && m > t)) return;
  const normal = n >= 2 && m >= 2 && (!t || n + 1 <= t);   /* couverture et dernière page seule : sans animation */
  const inn = $("#rinner"), f = [0, $("#readerFrame"), $("#readerFrame2"), $("#readerFrame3"), $("#readerFrame4")];
  const calme = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!normal || !RD.drv3 || !RD.drv4 || !RD.m1 || !RD.m2 || calme){
    RD.drv.goto(m); setTimeout(() => { syncSecond(); poll(); }, 200); return;
  }
  RD.flip = true;
  const m1 = RD.m1, m2 = RD.m2, D = 320;
  const go = (d, p) => { RD.calme = true; try { d.goto(p); } catch(e){} RD.calme = false; };   /* copies montrées déjà « jouées » */
  let flipper, lander, fo, lo, from, to;
  if (dir > 0){
    go(RD.drv3, m + 1); go(RD.drv4, m);
    f[3].style.visibility = (t && m + 1 > t) ? "hidden" : "visible";
    flipper = f[2]; fo = m2.l; lander = f[4]; lo = m1.r;
    f[3].style.zIndex = 0; f[1].style.zIndex = 1; f[2].style.zIndex = 2; f[4].style.zIndex = 3;
    from = ["0deg", "-90deg"]; to = ["90deg", "0deg"];
  } else {
    go(RD.drv4, m); go(RD.drv3, m + 1);
    f[4].style.visibility = "visible";
    flipper = f[1]; fo = m1.r; lander = f[3]; lo = m2.l;
    f[4].style.zIndex = 0; f[2].style.zIndex = 1; f[1].style.zIndex = 2; f[3].style.zIndex = 3;
    from = ["0deg", "90deg"]; to = ["-90deg", "0deg"];
  }
  inn.classList.add("flip"); $("#rscale").style.perspective = "2600px";
  flipper.style.transformOrigin = fo + "px 50%"; lander.style.transformOrigin = lo + "px 50%";
  const fin = () => {
    RD.calme = true;
    try { RD.drv.goto(m); } catch(e){}
    setTimeout(() => { syncSecond(); RD.calme = false; }, 90);
    setTimeout(() => {
      [1, 2, 3, 4].forEach(i => { f[i].getAnimations().forEach(a => a.cancel()); f[i].style.transform = ""; f[i].style.zIndex = ""; f[i].style.transformOrigin = ""; });
      f[3].style.visibility = "hidden"; f[4].style.visibility = "hidden";
      f[1].style.visibility = "visible";
      if (!(t && m + 1 > t)) f[2].style.visibility = "visible";
      inn.classList.remove("flip"); $("#rscale").style.perspective = "";
      RD.flip = false; poll();
      if (RD.queued){ const q = RD.queued; RD.queued = 0; setTimeout(() => flipTurn(q), 30); }
    }, 330);
  };
  setTimeout(() => {
    const a = flipper.animate([{ transform:"rotateY(" + from[0] + ")", filter:"brightness(1)" }, { transform:"rotateY(" + from[1] + ")", filter:"brightness(.55)" }],
      { duration:D, easing:"ease-in", fill:"forwards" });
    a.onfinish = () => {
      flipper.style.visibility = "hidden";
      lander.style.visibility = "visible";
      const b = lander.animate([{ transform:"rotateY(" + to[0] + ")", filter:"brightness(.55)" }, { transform:"rotateY(" + to[1] + ")", filter:"brightness(1)" }],
        { duration:D, easing:"ease-out", fill:"forwards" });
      b.onfinish = fin;
    };
  }, 100);
}
function retourSimple(essai, tentes){
  if (RD.dbl || !RD.drv || essai > 16) return;
  try {
    const f = $("#readerFrame"), w = f.contentWindow, lab = String(RD.drv.state().label || ""), n = parseInt(lab, 10) || 1;
    if (/\d\s*[-–]\s*\d/.test(lab) || n <= 1) return;                       /* déjà en vue double du livre, ou couverture : rien à faire */
    if (w.innerWidth / w.innerHeight > 1.25 && tentes < 3){ RD.drv.goto(n); tentes++; setTimeout(poll, 250); }
  } catch(e){ return; }
  setTimeout(() => retourSimple(essai + 1, tentes), 250);
}
/* Page simple : les livres qui affichent déjà 2 pages d'eux-mêmes (C9, plomberie) n'ont rien à gagner d'une 2e copie ;
   pour eux le bouton 📖 sert à passer à UNE seule page, centrée. Les autres livres gardent la vraie double page. */
function natifDouble(){ try { return typeof $("#readerFrame").contentWindow.two === "function" || /\d\s*[-–]\s*\d/.test(String(RD.drv.state().label)); } catch(e){ return false; } }
function layoutSingle(){
  if (!RD.single) return;
  const inn = $("#rscale"), W = inn.clientWidth, H = inn.clientHeight, f = $("#readerFrame");
  const pd = RD.drv && RD.drv.pad, w = Math.floor(Math.min(W, pd ? (H - 16) * PAGE_RATIO + pd.w : H * PAGE_RATIO));
  f.style.width = w + "px"; f.style.left = Math.round((W - w) / 2) + "px"; f.style.clipPath = "";
  /* on rogne le cadre à la page elle-même, centrée */
  clearTimeout(RD.tSimple);
  RD.tSimple = setTimeout(() => { if (!RD.single) return; const m = measurePage(f); if (!m) return;
    const pw = m.r - m.l; f.style.left = Math.round((W - pw) / 2 - m.l) + "px"; f.style.clipPath = `inset(0 ${Math.max(0, w - m.r)}px 0 ${m.l}px)`; }, 350);
}
function majBoutonDbl(){
  const b = $("#tbDbl"); if (!b) return;
  b.hidden = window.innerWidth < 700 || !!(RD.drv && RD.drv.noDbl);
  const simple = RD.single || (!RD.dbl && natifDouble()), t = simple ? "Page simple (D)" : "Double page (D)";
  if (b.title !== t){ b.title = t; b.setAttribute("aria-label", simple ? "Page simple" : "Double page"); }
  b.classList.toggle("on", !!(RD.single || RD.dbl));
}
function forcerRendu(essai){
  if (essai > 4) return;
  try {
    RD.drv.goto(curPage()); setTimeout(poll, 200);
    if (RD.single && /\d\s*[-–]\s*\d/.test(String(RD.drv.state().label))) setTimeout(() => forcerRendu(essai + 1), 350);
  } catch(e){}
}
function entrerSimple(){
  RD.single = true; $("#rinner").classList.add("dbl"); layoutSingle();
  try { $("#readerFrame").contentWindow.dispatchEvent(new Event("resize")); } catch(e){}
  setTimeout(() => { if (RD.single) forcerRendu(0); }, 150);
  majBoutonDbl(); redrawInk();
}
function quitterSimple(){
  RD.single = false; const f = $("#readerFrame"); $("#rinner").classList.remove("dbl");
  f.style.left = f.style.width = f.style.clipPath = "";
  try { f.contentWindow.dispatchEvent(new Event("resize")); } catch(e){}
  retourSimple(0, 0); majBoutonDbl(); redrawInk();
}
function toggleDbl(){
  if (RD.drv && RD.drv.noDbl) return;
  if (RD.single){ quitterSimple(); return; }
  if (!RD.dbl && natifDouble()){ entrerSimple(); return; }
  RD.dbl = !RD.dbl;
  const f2 = $("#readerFrame2");
  $("#rinner").classList.toggle("dbl", RD.dbl);
  $("#tbDbl").classList.toggle("on", RD.dbl);
  const f1 = $("#readerFrame");
  if (!RD.dbl){ f1.style.left = f1.style.width = f1.style.clipPath = ""; $("#spine").hidden = true; }
  if (!RD.dbl){ f1.style.visibility = ""; f2.style.visibility = ""; }
  RD.lastW = 0;
  if (RD.dbl){
    layoutDbl(); f2.hidden = false; RD.drv2 = null; RD.label2 = "";
    f2.onload = () => setTimeout(setupSecond, 60);
    f2.srcdoc = RD.html;
    try { const s0 = RD.drv.state(), n0 = parseInt(s0.label, 10); if (n0 > 1 && n0 % 2) RD.drv.goto(n0 - 1); } catch(e){}
  } else { f2.hidden = true; f2.onload = null; f2.srcdoc = ""; RD.drv2 = null; killExtras(); }
  try { $("#readerFrame").contentWindow.dispatchEvent(new Event("resize")); } catch(e){}
  /* Le livre ne choisit 1 ou 2 pages qu'en changeant de page : après le retour à la pleine largeur, on lui fait recalculer son affichage.
     On attend que sa fenêtre soit vraiment redevenue large (ordinateur lent) et on réessaie au besoin. */
  if (!RD.dbl) retourSimple(0, 0);
}
$("#readerFrame").addEventListener("load", () => { if ($("#reader").classList.contains("open") && $("#readerFrame").srcdoc) attach(); });

function poll(){
  try { tdmSuivre(); } catch(e){}
  /* Un livre lent à démarrer (polices, scripts) : on réessaie de brancher la barre jusqu'à 8 fois */
  if ($("#reader").classList.contains("open") && RD.t0 && RD.book !== "tableau-blanc" && (RD.retry || 0) < 8 && (!RD.drv || (RD.tot || 0) <= 1) && Date.now() - RD.t0 > 1800 * ((RD.retry || 0) + 1)){
    RD.retry = (RD.retry || 0) + 1; RD.attached = false; attach();
  }
  if (!RD.drv) return;
  try {
    const s = RD.drv.state();
    if (caler(s)) return;
    if (s.label !== RD.label){ RD.label = s.label; resetAnimPos(); redrawInk(); if (RD.dbl) syncSecond(); suivrePos(s); }
    if (!RD.offered && (s.tot || RD.tot)) offrirReprise();
    if (s.tot !== RD.tot){ RD.tot = s.tot; $("#tbTot").textContent = s.tot ? "/ " + s.tot : ""; }
    const inp = $("#tbPg"); if (document.activeElement !== inp) inp.value = s.label;
    const an = RD.drv.animOn() ? "p" : "l", ab = $("#tbAnim");
    majBoutonDbl();
    if (ab.dataset.i !== an){ ab.dataset.i = an; const lb = ab.querySelector(".tbl"); ab.innerHTML = an === "p" ? ICO_PAUSE : ICO_PLAY; if (lb) ab.appendChild(lb); }
    if (RD.drv.ansInfo){
      const e = ansEtat(), bt = $("#tbAns"), key = e.ok + "|" + e.m + "|" + e.s + "|" + e.t;
      if (bt.dataset.k !== key){
        bt.dataset.k = key; bt.disabled = !e.ok; bt.classList.toggle("on", e.m > 0);
        bt.innerHTML = e.m === 1 ? '<span class="ansn">' + e.s + "/" + e.t + "</span>" : ICO_CHECK;
        bt.title = !e.ok ? "Pas de réponses sur ces pages" : e.m === 0 ? (RD.drv.ansSimple ? "Afficher les réponses (R)" : "Réponses : pas à pas (R)") : e.m === 1 ? "Réponses : toutes (R)" : "Cacher les réponses (R)";
        bt.setAttribute("aria-label", bt.title);
      }
    }
  } catch(e){}
}

/* ---- Zoom : agrandit la zone du livre, qui s'adapte et défile ---- */
const PAGE_RATIO = 0.7727; /* page de livre (lettre) : largeur / hauteur */
function measurePage(f){
  try {
    const d = f.contentDocument, w = f.contentWindow, fw = f.clientWidth, fh = f.clientHeight;
    let e = d.elementFromPoint(fw / 2, fh / 2);
    if (!e) return null;
    while (e.parentElement && e.parentElement !== d.body && e.parentElement !== d.documentElement
           && e.parentElement.getBoundingClientRect().width < fw - 4) e = e.parentElement;
    /* page qui remplit tout le cadre (livre C13…) : la page, c'est elle, pas le contenu à l'intérieur (sinon ses marges blanches étaient rognées en double page) */
    { const pg = e.closest && e.closest(".page"); if (pg && pg.getBoundingClientRect().width >= fw - 4) e = pg; }   /* (7 nov.) même si le centre tombe sur un élément plus profond dans la page */
    const r = e.getBoundingClientRect();
    if (r.width < fw * .4 || r.width > fw) return null;
    return { l:Math.max(0, r.left), r:Math.min(fw, r.right) };
  } catch(err){ return null; }
}
function layoutDbl(){
  if (RD.single){ layoutSingle(); return; }
  if (!RD.dbl) return;
  const inn = $("#rscale"), W = inn.clientWidth, H = inn.clientHeight;
  if (W < 50 || H < 50) return;
  const pd = RD.drv && RD.drv.pad, w = Math.floor(Math.min(W / 2, pd ? (H - 16) * PAGE_RATIO + pd.w : H * PAGE_RATIO));
  const f1 = $("#readerFrame"), f2 = $("#readerFrame2");
  if (RD.lastW !== w){            /* la taille a changé : les livres se remettent à l'échelle, on mesure à nouveau ensuite */
    RD.lastW = w;
    f1.style.width = f2.style.width = w + "px";
    ["#readerFrame", "#readerFrame2", "#readerFrame3", "#readerFrame4"].forEach(id => { try { $(id).contentWindow.dispatchEvent(new Event("resize")); } catch(e){} });
    relayoutLater();
  }
  f1.style.width = f2.style.width = w + "px";
  const n = curPage(), t = totPages(), cov = n <= 1, fin = !cov && t && n + 1 > t;
  /* Pages collées : on rogne chaque cadre à sa page, puis on les place bord à bord au centre */
  const m1 = measurePage(f1) || { l:0, r:w }, m2 = (RD.drv2 && measurePage(f2)) || { l:0, r:w };
  const p1 = m1.r - m1.l, p2 = m2.r - m2.l;
  let l1, l2, sp;
  if (cov){ sp = Math.round(W / 2); l2 = sp - m2.l; l1 = sp - m1.r; }            /* couverture seule, à droite */
  else if (fin){ sp = Math.round(W / 2); l1 = sp - m1.r; l2 = sp - m2.l; }       /* dernière page seule, à gauche */
  else { const start = Math.round((W - p1 - p2) / 2); sp = start + p1; l1 = start - m1.l; l2 = start + p1 - m2.l; }
  f1.style.left = l1 + "px"; f2.style.left = l2 + "px";
  f1.style.clipPath = `inset(0 ${w - m1.r}px 0 ${m1.l}px)`;
  f2.style.clipPath = `inset(0 ${w - m2.r}px 0 ${m2.l}px)`;
  RD.m1 = m1; RD.m2 = m2;
  [["#readerFrame4", f1], ["#readerFrame3", f2]].forEach(([id, src]) => {
    const e = $(id); e.style.width = src.style.width; e.style.left = src.style.left; e.style.clipPath = src.style.clipPath;
  });
  const spn = $("#spine"); spn.hidden = false; spn.style.left = sp + "px";
}
function appliquerPad(){
  const pad = RD.drv && RD.drv.pad;
  $("#rinner").classList.toggle("pad", !!pad);
  ["#readerFrame", "#readerFrame2", "#readerFrame3", "#readerFrame4"].forEach(id => {
    const f = $(id); if (!f) return;
    f.style.top = pad ? pad.t + "px" : ""; f.style.height = pad ? "calc(100% + " + pad.h + "px)" : "";
  });
}
/* Zoom « photo » (7 nov.) : par défaut; ?zoom=normal sur un appareil = ancien zoom (gardé dans localStorage.zoomPhoto), ?zoom=photo pour revenir.
   Version d'avant ce changement : étiquette git « avant-zoom-photo ». */
const ZOOM_PHOTO = (() => { try { const q = new URLSearchParams(location.search).get("zoom"); if (q) localStorage.zoomPhoto = q === "photo" ? "oui" : "non"; return localStorage.zoomPhoto !== "non"; } catch(e){ return true; } })();   /* (7 nov.) par défaut pour tous; ?zoom=normal = ancien zoom sur cet appareil */
function zPhoto(){ return ZOOM_PHOTO; }   /* 16 nov. : aussi le tableau blanc (au TNI, le tableau redimensionné devenait noir au zoom) */
function sizeInner(rapide){   /* rapide = pendant la roulette : on agrandit seulement l'affichage; la toile du crayon est refaite à la fin (sinon 20 ms par cran) */
  appliquerPad(); try { majFond(); } catch(e){}
  const st = $("#rstage"), inn = $("#rinner"), c = $("#inkCanvas");
  const w = st.clientWidth, h = st.clientHeight, dpr = DPRI();
  const K = RD.wb ? WBK : 1;                                              /* tableau blanc : espace de travail 2 fois plus grand que l'écran */
  const fz = RD.wb ? 0 : Math.max(0, Math.min(1, (RD.z - 1) / .5));                 /* livre zoomé : marge autour pour pouvoir amener un bord au milieu */
  RD.mx = Math.round(w * .4 * fz); RD.my = Math.round(h * .4 * fz); inn.style.margin = RD.my + "px " + RD.mx + "px";
  inn.style.width = (w * RD.z * K) + "px"; inn.style.height = (h * RD.z * K) + "px";
  const S = zPhoto() ? 1 : RD.z, rs = $("#rscale");                       /* S = échelle de mise en page; le reste du zoom est un transform */
  rs.style.width = (w * S * K) + "px"; rs.style.height = (h * S * K) + "px"; rs.style.transform = zPhoto() && RD.z !== 1 ? "scale(" + RD.z + ")" : "";
  ["#readerFrame", "#readerFrame2"].forEach(id => { try { $(id).contentDocument.documentElement.style.setProperty("--zb", zPhoto() ? RD.z : 1); } catch(e){} });
  if (!rapide){ const d0 = window.devicePixelRatio || 1, px = (w * RD.z * K) * (h * RD.z * K) * d0 * d0;
    RD.dprInk = d0 * Math.min(1, Math.sqrt((RD.wb ? 16e6 : 24e6) / Math.max(1, px)));   /* 13 nov. : tableau blanc zoomé = lag au TNI, toile plafonnée à 9 millions de pixels */
    c.width = Math.round(w * RD.z * K * RD.dprInk); c.height = Math.round(h * RD.z * K * RD.dprInk); }
  c.style.width = (w * S * K) + "px"; c.style.height = (h * S * K) + "px";
  $("#tbZv").textContent = Math.round(RD.z * 100) + "%"; $("#wbZv").textContent = Math.round(RD.z * 100) + "%";
  layoutDbl();
  majCurseur();
  if (!rapide) redrawInk();
}
/* Toile du crayon : résolution plafonnée (7 nov.). Livre zoomé à 300 % sur le tableau interactif = toile de 70 à 300 Mo (transparente, mais gardée en mémoire graphique) :
   le navigateur n'arrivait plus à dessiner le livre en glissant (zones grises). Au-delà de 24 millions de pixels, la toile est moins fine (seulement quand c'est très zoomé). */
function DPRI(){ return RD.dprInk || window.devicePixelRatio || 1; }
const WBK = 2, zMin = () => RD.wb ? .5 : 1, zMax = () => RD.wb ? 2 : 3;
function setZoom(z, rapide){
  calmePage();
  if (ZS.on && !ZS.enFin){ ZS.on = false; clearTimeout(ZS.fin); const i = $("#rinner"); i.style.transform = ""; i.style.transformOrigin = ""; i.style.willChange = ""; $("#reader").classList.remove("zg"); $("#inkCanvas").style.visibility = ""; }
  const st = $("#rstage"), inn = $("#rinner"), ow = inn.offsetWidth || 1, oh = inn.offsetHeight || 1;
  const fx = (st.scrollLeft + st.clientWidth / 2 - (RD.mx || 0)) / ow, fy = (st.scrollTop + st.clientHeight / 2 - (RD.my || 0)) / oh;
  RD.z = Math.max(zMin(), Math.min(zMax(), z)); sizeInner(rapide);
  st.scrollLeft = fx * inn.offsetWidth + RD.mx - st.clientWidth / 2; st.scrollTop = fy * inn.offsetHeight + RD.my - st.clientHeight / 2;   /* on zoome vers le centre de ce qu'on regarde (avant : vers le coin en haut à gauche, ce qui donnait un effet de rognage) */
}
/* en page simple, le premier cran du zoom est « pleine largeur » : la page remplit toute la largeur de l'écran */
function zPleineLargeur(){ if (!RD.single || RD.wb) return 0; try { const st = $("#rstage"), f = $("#readerFrame"), m = measurePage(f);
  const base = m ? (m.r - m.l) / (zPhoto() ? 1 : RD.z) : st.clientHeight * PAGE_RATIO, z = (st.clientWidth - 8) / base; return z > zMin() + .05 ? Math.min(z, zMax()) : 0; } catch(e){ return 0; } }
const ZL = () => { const pl = zPleineLargeur(), t = [.5, .75, ...ZOOMS].filter(v => v >= zMin() && v <= zMax());
  return pl ? [...t.filter(v => v <= zMin() + .001 || v > pl + .12), pl].sort((a, b) => a - b) : t; };
function zin(){ const pl = zPleineLargeur(), z0 = RD.z, z = ZL().find(v => v > RD.z + .01) || zMax(); setZoom(z);
  if (pl && Math.abs(z - pl) < .01 && z0 <= zMin() + .01) $("#rstage").scrollTop = RD.my || 0; }   /* pleine largeur : on commence en haut de la page */
function zout(){ setZoom(ZL().reverse().find(v => v < RD.z - .01) || zMin()); }
function zreset(){ setZoom(1); }
window.addEventListener("resize", () => { if ($("#reader").classList.contains("open")) sizeInner(); });
