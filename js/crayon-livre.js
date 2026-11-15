/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — crayon-livre.js (sorti d'index.html le 15 nov.) */
/* 11 nov. : (1) crayon ouvert dans un livre = la bulle des couleurs et grosseurs s'ouvre tout de suite;
   (2) effacer avec la main (paume) sur le tableau interactif : un gros contact tactile efface pendant le geste, puis l'outil d'avant revient */
(function(){
  document.addEventListener("click", e => { if (!e.target.closest || !e.target.closest("#tbPen")) return;
    setTimeout(() => { try { const pb = document.getElementById("penBar"), pc = document.getElementById("popCol"), rd = document.getElementById("reader");
      if (!pb || pb.hidden || !pc || !pc.hidden || (rd && rd.classList.contains("wbon")) || RD.eraser || RD.text || RD.obj) return;
      pc.hidden = false; const b = document.getElementById("penCol"); if (b) b.classList.add("open"); } catch(x){} }, 120); });

  /* La bulle du crayon s'ouvre au-dessus du bouton Crayon (pas collée à gauche de la barre) */
  const placerBulle = () => { try { const pc = document.getElementById("popCol"), pb = document.getElementById("penBar"), b = document.getElementById("penCol"), rd = document.getElementById("reader");
    if (!pc || pc.hidden || !pb || !b || !rd || rd.classList.contains("pen-side")) return;
    const r = pb.getBoundingClientRect(), rb = b.getBoundingClientRect(), w = pc.offsetWidth;
    let x = rb.left + rb.width / 2 - w / 2; x = Math.max(8, Math.min(innerWidth - w - 8, x));
    pc.style.setProperty("left", (x - r.left) + "px", "important"); pc.style.setProperty("right", "auto", "important"); pc.style.setProperty("transform", "none", "important");
  } catch(x){} };
  const pcEl = document.getElementById("popCol");
  if (pcEl) new MutationObserver(() => requestAnimationFrame(placerBulle)).observe(pcEl, { attributes: true, attributeFilter: ["hidden"] });
  addEventListener("resize", placerBulle);
  /* Tableau SMART (vidéo du 11 nov.) : le bout des doigts arrive en « touch » 1 × 1 px, la paume et le dos de la main en « pen » de 20 à 80 px,
     et la taille grandit souvent après le début du contact : on vérifie au début ET pendant le geste */
  let P = null, SYN = false; const SEUIL = { touch: 30, pen: 18 };
  const estToile = t => t && (t.id === "inkCanvas" || (t.classList && t.classList.contains("ink")));
  window.paumeSeuil = SEUIL;
  const taille = e => Math.max(e.width || 0, e.height || 0);
  const estPaume = e => (e.pointerType === "pen" && (e.buttons & 32)) || ((e.pointerType === "touch" || e.pointerType === "pen") && taille(e) >= SEUIL[e.pointerType]);
  const activer = e => { P = { id: e.pointerId, av: { eraser: RD.eraser, text: RD.text, obj: RD.obj, crayonOff: RD.crayonOff, g: RD.gommeT } };
    RD.eraser = true; RD.text = false; RD.obj = false; RD.crayonOff = false;
    RD.gommeT = Math.max(RD.gommeT || 1, Math.min(8, Math.max(3, taille(e) / 18))); };   /* la gomme a la taille de la main */
  const faux = (t, e, cible) => { SYN = true; try { cible.dispatchEvent(new PointerEvent(t, { pointerId: e.pointerId, pointerType: e.pointerType, isPrimary: true, clientX: e.clientX, clientY: e.clientY, buttons: t === "pointerup" ? 0 : 1, bubbles: true, cancelable: true })); } finally { SYN = false; } };
  let trait = null;   /* contact qui dessine en ce moment avec le crayon (peut devenir une paume en cours de route) */
  document.addEventListener("pointerdown", e => { try {
    if (SYN || !estToile(e.target) || P) return;
    if (!(RD.pen || RD.wb) || RD.sim) return;
    if (estPaume(e)){ activer(e); trait = null; return; }
    trait = (!RD.eraser && !RD.text && !RD.obj && !RD.crayonOff) ? { id: e.pointerId, cible: e.target, t: performance.now() } : null;
  } catch(x){} }, true);
  document.addEventListener("pointermove", e => { try {
    if (SYN || P || !trait || e.pointerId !== trait.id || !estPaume(e)) return;
    if (performance.now() - trait.t > 1500) { trait = null; return; }   /* un vrai trait commencé depuis longtemps : on n'y touche pas */
    const cible = trait.cible; trait = null;
    faux("pointerup", e, cible);                   /* termine le trait commencé par la main… */
    try { undoInk(); } catch(x){}                  /* …et l'enlève */
    activer(e); faux("pointerdown", e, cible);     /* puis la même main continue en gomme */
  } catch(x){} }, true);
  /* Pendant la paume : les autres contacts (bouts des doigts de la même main) ne dessinent pas et ne font pas zoomer (zoom = l'écran qui « saute ») */
  let finPaume = 0; const occupe = () => P || PL || performance.now() - finPaume < 200;
  const bloque = e => { if (!occupe()) return; const id = P ? P.id : PL ? PL.id : null; if (e.pointerId !== undefined && e.pointerId === id) return; e.stopImmediatePropagation(); if (e.cancelable && e.type !== "pointerdown") e.preventDefault(); };
  ["pointerdown", "pointermove", "pointerup"].forEach(t => window.addEventListener(t, e => { if (!SYN && e.pointerType === "touch") bloque(e); }, true));
  ["touchstart", "touchmove"].forEach(t => window.addEventListener(t, e => { if (occupe()) e.stopImmediatePropagation(); }, { capture: true, passive: true }));
  /* Livre sans crayon ouvert : la paume efface quand même (on efface directement, sans ouvrir la barre du crayon) */
  let PL = null;
  const versToile = (e, fr) => { const c = document.getElementById("inkCanvas"), rc = c.getBoundingClientRect(), rf = fr.getBoundingClientRect(), k = fr.offsetWidth ? rf.width / fr.offsetWidth : 1;
    return [(rf.left + e.clientX * k - rc.left) / rc.width, (rf.top + e.clientY * k - rc.top) / rc.height]; };
  const brancher = fr => { let w; try { w = fr.contentWindow; if (!w || w.__paumeOk) return; w.__paumeOk = 1; } catch(x){ return; }
    w.addEventListener("pointerdown", e => { try {
      if (PL || P || RD.pen || RD.wb || !estPaume(e)) return;
      /* 12 nov. (« le déplacement après un zoom ne marche plus ») : au SMART, un doigt qui glisse peut arriver en « pen » de 20 px et était pris pour une paume.
         Sans crayon ouvert : seulement une vraie main (≥ 35 px) et seulement s'il y a des traits sur la page; sinon le geste reste un déplacement. */
      if (!(e.buttons & 32) && taille(e) < 35) return;
      try { const L = INKS[inkKey()]; if (!L || !L.length) return; } catch(x) { return; }
      const rd = document.getElementById("reader"); if (!rd || !rd.classList.contains("open")) return;
      PL = { id: e.pointerId, fr, g: RD.gommeT }; RD.gommeT = Math.max(3, Math.min(8, taille(e) / 18)); RD.erSnap = false;
      e.stopImmediatePropagation(); e.preventDefault(); eraseAt(versToile(e, fr));
    } catch(x){} }, true);
    w.addEventListener("pointermove", e => { if (PL && e.pointerId === PL.id){ e.stopImmediatePropagation(); e.preventDefault(); try { eraseAt(versToile(e, PL.fr)); } catch(x){} }
      else if (PL && e.pointerType === "touch") e.stopImmediatePropagation(); }, true);
    const finL = e => { if (!PL || e.pointerId !== PL.id) return; e.stopImmediatePropagation(); RD.gommeT = PL.g; RD.erSnap = false; PL = null; finPaume = performance.now();
      try { (window.planifierSauvegarde || window.sauverTableaux || (() => {}))(); } catch(x){} };
    w.addEventListener("pointerup", finL, true); w.addEventListener("pointercancel", finL, true);
    ["touchstart", "touchmove"].forEach(t => w.addEventListener(t, e => { if (occupe()) e.stopImmediatePropagation(); }, { capture: true, passive: true }));
  };
  setInterval(() => { try { const rd = document.getElementById("reader"); if (rd && rd.classList.contains("open")) rd.querySelectorAll("iframe").forEach(brancher); } catch(x){} }, 1000);
  const fin = e => { if (SYN) return; if (trait && e.pointerId === trait.id) trait = null;
    if (!P || e.pointerId !== P.id) return; finPaume = performance.now(); const av = P.av; P = null;
    setTimeout(() => { try { RD.eraser = av.eraser; RD.text = av.text; RD.obj = av.obj; RD.crayonOff = av.crayonOff; RD.gommeT = av.g; if (window.redrawInk) redrawInk(); } catch(x){} }, 0); };
  document.addEventListener("pointerup", fin, true); document.addEventListener("pointercancel", fin, true);
})();
