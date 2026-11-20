/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — tableau-blanc.js (sorti d'index.html le 15 nov.) */
/* ---- Crayon et tableau blanc ---- */
/* ---- Icônes sobres du crayon et du tableau ---- */
const ICN = {
  dot:'<circle cx="12" cy="12" r="5" fill="currentColor"/>',
  main:'<path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"/>',
  eraser:'<path d="M9 19h10M5.5 14.5L14 6l5 5-6.5 6.5H8.5z"/>', redo:'<path d="M15 7l5 5-5 5M20 12h-9a6 6 0 0 0-6 6"/>', texte:'<path d="M5 6V4h14v2M12 4v16M9 20h6"/>', zmoins:'<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5M8.5 11h5"/>', zplus:'<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5M8.5 11h5M11 8.5v5"/>', objet:'<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5"/>', undo:'<path d="M9 7L4 12l5 5M4 12h9a6 6 0 0 1 6 6"/>',
  trash:'<path d="M5 7h14M10 7V4.5h4V7M7 7l1 13h8l1-13"/>', close:'<path d="M6 6l12 12M18 6L6 18"/>',
  play:'<path d="M8 5l11 7-11 7z"/>', pause:'<path d="M8 5v14M16 5v14"/>',
  bell:'<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 21h4"/>', bellOff:'<path d="M6 16v-5a6 6 0 0 1 9-5.2M18 11v5l1.5 2h-15M10 21h4M4 4l16 16"/>',
  libre:'<path d="M4 17c3-8 5 4 8-3s5-5 8-7"/>', ligne:'<path d="M5 19L19 5"/>', fleche:'<path d="M5 19L19 5M10 5h9v9"/>',
  rect:'<rect x="4" y="6" width="16" height="12" rx="1.2"/>', ellipse:'<ellipse cx="12" cy="12" rx="8" ry="6"/>',
  fond:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
  prev:'<path d="M15 5l-7 7 7 7"/>', next:'<path d="M9 5l7 7-7 7"/>', plus:'<path d="M12 5v14M5 12h14"/>',
  save:'<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>', reset:'<path d="M4.5 12a7.5 7.5 0 1 0 2.4-5.5M4.5 4.5v4h4"/>'
};
const icn = n => '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICN[n] || "") + '</svg>';
const setIcn = (el, n) => { if (el && el.dataset.icn !== n){ el.dataset.icn = n; el.innerHTML = icn(n); } };
const SHAPES = [null, "ligne", "fleche", "rect", "ellipse"], SHAPE_NOM = { "": "Trait libre", ligne:"Ligne droite", fleche:"Flèche", rect:"Rectangle", ellipse:"Ellipse" };
/* ---- Tableau blanc : plusieurs tableaux par livre, fonds au choix ---- */
const WBFONDS = [ { k:"blanc", n:"Fond blanc", dark:false }, { k:"quad", n:"Quadrillé (schéma électrique en échelle)", dark:false }, { k:"lignes", n:"Lignes", dark:false }, { k:"iso", n:"Plan isométrique (lignes)", dark:false }, { k:"isopts", n:"Plan isométrique (points)", dark:false },
  { k:"noir", n:"Tableau noir", dark:true }, { k:"vert", n:"Tableau vert", dark:true } ];
const WB = {};
const wbEtat = () => WB[RD.book] || (WB[RD.book] = { n:1, count:1, bg:{} });
const wbBg = () => wbEtat().bg[wbEtat().n] || "blanc";
const wbSombre = () => !!RD.wb && !!(WBFONDS.find(f => f.k === wbBg()) || {}).dark;
const inkKey = () => RD.book + "|" + (RD.wb ? "wb" + wbEtat().n + (wbBg() === "blanc" ? "" : ":" + wbBg()) : RD.label + (RD.dbl ? "|d" : ""));   /* chaque fond a son propre dessin */
/* après un changement de fond : le dessin reste sur l'ancien fond; un bouton permet de l'apporter */
function apresFond(ancienne, nomAncien){
  const nouv = inkKey(); if (ancienne === nouv) return;
  let t = document.getElementById("fondToast"); const orig = t && t.dataset.cle; if (t) t.remove();
  if (!(INKS[ancienne] || []).length && orig && orig !== nouv){ ancienne = orig; nomAncien = t.dataset.nom; }   /* on passe plusieurs fonds de suite : on garde le fond où est le dessin */
  const av = INKS[ancienne] || []; if (!av.length || ancienne === nouv) return;
  t = document.createElement("div"); t.id = "fondToast";
  t.style.cssText = "position:fixed;left:50%;bottom:110px;transform:translateX(-50%);z-index:100000;display:flex;align-items:center;gap:6px;padding:5px 6px 5px 10px;border-radius:10px;background:#0e0e0fe6;border:1px solid #3a3a40;color:#e4e4e7;font:600 .76rem system-ui;box-shadow:0 8px 24px rgba(0,0,0,.4);max-width:92vw";
  t.innerHTML = '<span>Dessin resté sur « ' + nomAncien + ' »</span><button type="button" style="min-height:32px;padding:0 10px;border-radius:8px;border:1px solid #6aa9ff;background:#1f6fc2;color:#fff;font:800 .76rem system-ui;cursor:pointer">Apporter ici</button><button type="button" data-x title="Fermer" aria-label="Fermer" style="width:32px;min-height:32px;border-radius:9px;border:1px solid #3a3a40;background:#1c1c1f;color:#e4e4e7;cursor:pointer;display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
  t.dataset.cle = ancienne; t.dataset.nom = nomAncien; document.body.appendChild(t); { const pb = $("#penBar"), r = pb && pb.offsetParent ? pb.getBoundingClientRect() : null; t.style.bottom = (r && r.height ? Math.max(16, innerHeight - r.top + 14) : 110) + "px"; }   /* au-dessus de la barre d'outils */ const fin = setTimeout(() => t.remove(), 8000);
  t.querySelector("[data-x]").onclick = () => { clearTimeout(fin); t.remove(); };   /* ✕ : fermer l'avis, le dessin reste sur l'autre fond */
  t.querySelector("button").onclick = () => { clearTimeout(fin); t.remove(); if (inkKey() !== nouv) return; snapInk(); INKS[nouv] = (INKS[nouv] || []).concat(INKS[ancienne] || []); INKS[ancienne] = []; SELO.s = null; window.SELM = []; redrawInk(); aviser("Dessin apporté sur ce fond.", 2500); };
}
const nomFond = k => ((WBFONDS.find(f => f.k === k) || {}).n || k).replace(/ \(.*\)$/, "");
function majFond(){
  const b = $("#wbBoard"); b.dataset.fond = wbBg(); b.style.setProperty("--u", (34 * (zPhoto() ? 1 : RD.z)) + "px");
  const st = wbEtat(); $("#wbLbl").textContent = st.n + " / " + st.count;
  $("#wbP").disabled = st.n <= 1; $("#wbN").disabled = st.n >= st.count; const m = $("#wbMoins"); if (m) m.disabled = st.count <= 1;
}
function wbAller(dir){
  const st = wbEtat();
  if (dir > 0){ if (st.n >= st.count){ aviser("Dernier tableau. Utilise + pour en ajouter un."); return; } st.n++; }
  else { if (st.n <= 1) return; st.n--; }
  /* 20 nov. (Jeremy) : un tableau laissé vide se supprime tout seul quand on le quitte */
  { const quitte = st.n - dir; if (st.count > 1 && wbVide(quitte) && !Object.keys(REFS).some(k => { const b = RD.book + "|wb" + quitte; return (k === b || k.startsWith(b + ":")) && REFS[k]; })){ retirerTableau(quitte); if (dir > 0) st.n = quitte; } }
  majFond(); redrawInk(); refreshTools();
}
function wbSupprimer(){   /* supprime le tableau affiché : 1er toucher = « Sûr ? », 2e toucher (dans les 3 s) = supprimé; les tableaux suivants reculent d'un rang */
  const b = $("#wbMoins"), st = wbEtat();
  if (st.count <= 1){ aviser("Il reste un seul tableau. Pour le vider : « Tout effacer »."); return; }
  if (!b.classList.contains("sur")){ b.classList.add("sur"); clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove("sur"), 3000); return; }
  clearTimeout(b._t); b.classList.remove("sur");
  const n = st.n; retirerTableau(n);
  SELO.s = null; window.SELM = []; majFond(); redrawInk(); refreshTools(); planifierSauvegarde(); aviser("Tableau " + n + " supprimé.");
}
function retirerTableau(n){ const st = wbEtat(), L = RD.book + "|wb", re = new RegExp("^" + L.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(\\d+)(:.*)?$");
  [INKS, UNDO, REDO, REFS].forEach(T => { const neuf = {};
    Object.keys(T).forEach(k => { const m = re.exec(k); if (!m) return; const i = +m[1], v = T[k]; delete T[k]; if (i === n) return; neuf[L + (i > n ? i - 1 : i) + (m[2] || "")] = v; });
    Object.assign(T, neuf); });
  const bg = {}; for (let i = 1; i <= st.count; i++) if (i !== n && st.bg[i]) bg[i > n ? i - 1 : i] = st.bg[i];
  st.bg = bg; st.count--; st.n = Math.min(st.n > n ? st.n - 1 : st.n, st.count); planifierSauvegarde();
}
const wbVide = n => { const base = RD.book + "|wb" + n; return !Object.keys(INKS).some(k => (k === base || k.startsWith(base + ":")) && INKS[k] && INKS[k].length); };
function wbNouveau(){ const st = wbEtat(), P = window.PREF ? window.PREF() : {}; st.count++; st.n = st.count; st.bg[st.n] = (P.fond && WBFONDS.some(f => f.k === P.fond)) ? P.fond : (st.bg[st.n - 1] || "blanc"); majFond(); redrawInk(); refreshTools(); aviser("Tableau " + st.n + " ajouté."); }
function wbFondSuivant(){
  const st = wbEtat(), i = WBFONDS.findIndex(f => f.k === wbBg()), f = WBFONDS[(i + 1) % WBFONDS.length], av = inkKey(), avn = nomFond(wbBg());
  st.bg[st.n] = f.k; SELO.s = null; window.SELM = []; majFond(); redrawInk(); refreshTools(); aviser(f.n); apresFond(av, avn);
}
/* ---- Objets du plan isométrique (plinthe, radiateur, chaudière…) : ils se placent sur la grille et les tuyaux s'y raccordent ---- */
function enveloppe(pts){
  const v = pts.slice().sort((p, q) => p[0] - q[0] || p[1] - q[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), h = [];
  for (let pass = 0; pass < 2; pass++){ const st = h.length; v.forEach(q => { while (h.length >= st + 2 && cr(h[h.length - 2], h[h.length - 1], q) <= 0) h.pop(); h.push(q); }); h.pop(); v.reverse(); }
  return h;
}
/* collecteur : départ (haut, rouge) en n=0, retour (bas, bleu) en n=1 ; ports = [départ principal, retour principal, N départs de boucle, N retours de boucle] */
const manP = N => [[-1,0],[-1,1], ...Array.from({length:N}, (_, i) => [i+1, 0]), ...Array.from({length:N}, (_, i) => [i+1, 1])];
const DEBOUT_OK = /^(plinthe|radiateur|pompe|vanne|boisseau|vannemot|vanne3|valvesol)$/;   /* objets qu'on peut mettre debout (tuyau vertical) */
const OBJETS = {
  plinthe:   { n:"Plinthe chauffante", ports:[[0,0],[3,0]], fill:"#d9dee5" },
  radiateur: { n:"Radiateur",          ports:[[0,0],[2,0]], fill:"#e8ecf1" },
  chaudiere: { n:"Chaudière",          ports:[[0,1],[1,2]], fill:"#c7d1dd" },
  pompe:     { n:"Pompe circulatrice",              ports:[[0,0],[1,0]], fill:"#cfe0f2" },
  vanne:     { n:"Valve",              ports:[[0,0],[1,0]], fill:"#f0c9c9" },
  boisseau:  { n:"Valve à bille",  ports:[[0,0],[1,0]], fill:"#d9b45a" },
  collecteur4:{ n:"Collecteur 4 boucles", ports:manP(4), fill:"#d9dee5" },
  collecteur6:{ n:"Collecteur 6 boucles", ports:manP(6), fill:"#d9dee5" },
  serpentin: { n:"Serpentin (plancher radiant)", ports:[[0,0]], fill:"#e07070" },
  vanne3:    { n:"Valve 3 voies",     ports:[[0,0],[2,0],[1,1]], fill:"#d9a3a3" },
  vannemot:  { n:"Valve motorisée",    ports:[[0,0],[1,0]], fill:"#d9a3a3" },
  valvesol:  { n:"Valve solénoïde",    ports:[[0,0],[1,0]], fill:"#d9b45a" },   /* 9 nov. : valve électrique à bobine rouge sur corps de laiton (le genre utilisé à l'atelier), sans marque dessinée */
  vase:      { n:"Vase d'expansion",   ports:[[0,0]],       fill:"#f3dcc2" }
};
/* ---- Schéma électrique en échelle : symboles posés sur le quadrillé ; les fils s'accrochent aux bornes et suivent le symbole ---- */
const ELEC = {
  fil:          { g:"base", n:"✎ Fil", c:"Fil" },
  rails:        { g:"base", n:"Échelle L1 / L2", c:"Échelle L1/L2", lb:"L1 / L2" },
  jonction:     { g:"base", n:"• Jonction", c:"Jonction" },
  bp:           { g:"cmd",  n:"Bouton-poussoir", nf:1, lb:"PB1" },
  inter:        { g:"cmd",  n:"Interrupteur (SPST, SPDT, DPST, DPDT)", c:"Interrupteur", nf:1, lb:"S1" },
  thermostat:   { g:"cmd",  n:"Thermostat", nf:1, lb:"TH" },
  pression:     { g:"cmd",  n:"Pressostat", nf:1, lb:"PS" },
  flotteur:     { g:"cmd",  n:"Interrupteur à flotteur", c:"Flotteur", nf:1, lb:"FS" },
  fincourse:    { g:"cmd",  n:"Interrupteur de fin de course", c:"Fin de course", nf:1, lb:"LS" },
  relais:       { g:"rel",  n:"Relais complet : bobine + contact NO + contact NF (même repère)", c:"Relais complet", lb:"CR1" },
  bobine:       { g:"rel",  n:"Bobine (relais, contacteur)", c:"Bobine", lb:"CR1" },
  contact:      { g:"rel",  n:"Contact de relais", c:"Contact", nf:1, lb:"CR1" },
  bobineT:      { g:"rel",  n:"Relais temporisé (bobine)", c:"Relais temporisé", lb:"TR1" },
  contactT:     { g:"rel",  n:"Contact temporisé (au travail)", c:"Contact temporisé", nf:1, lb:"TR1" },
  surcharge:    { g:"rel",  n:"Contact de surcharge (OL)", c:"Surcharge OL", lb:"OL" },
  lampe:        { g:"ch",   n:"Lampe témoin", lb:"R" },
  ampoule:      { g:"ch",   n:"Ampoule (éclairage)", c:"Ampoule", lb:"L1" },
  moteur:       { g:"ch",   n:"Moteur", lb:"M" },
  solenoide:    { g:"ch",   n:"Solénoïde (électrovanne)", c:"Solénoïde", lb:"SOL" },
  sonnerie:     { g:"ch",   n:"Sonnerie / avertisseur", c:"Sonnerie", lb:"BZ" },
  chauffant:    { g:"ch",   n:"Élément chauffant", c:"Élément chauffant", lb:"HTR" },
  pile:         { g:"alim", n:"Pile / source c.c. (+ à gauche)", c:"Pile", lb:"B1" },
  transfo:      { g:"alim", n:"Transformateur", lb:"T1" },
  fusible:      { g:"alim", n:"Fusible", lb:"F1" },
  terre:        { g:"alim", n:"Mise à la terre", c:"Terre" },
  resistance:   { g:"comp", n:"Résistance", lb:"R1" },
  condensateur: { g:"comp", n:"Condensateur", lb:"C1" },
  diode:        { g:"comp", n:"Diode", lb:"D1" },
  del:          { g:"comp", n:"DEL (diode électroluminescente)", c:"DEL", lb:"DEL1" }
};
const ELEC_CAT = [["base", "Tracer"], ["cmd", "Boutons et interrupteurs"], ["rel", "Relais et contacts"], ["ch", "Charges"], ["alim", "Alimentation et protection"], ["comp", "Composants"]];
const POLES = { spst:"SPST — unipolaire, unidirectionnel", spdt:"SPDT — unipolaire, bidirectionnel", dpst:"DPST — bipolaire, unidirectionnel", dpdt:"DPDT — bipolaire, bidirectionnel" };
const polDe = s => s.k === "inter" ? (s.pol || "spst") : "";
function surRails(s, G, x, y, m){ const [w, h] = s.sz || [8, 10], u = G.u, lx = (x - G.ox) / u, ly = (y - G.oy) / u;
  return ly > -1 - m && ly < h + m && (Math.abs(lx) < .45 + m || Math.abs(lx - w) < .45 + m); }
const modeElec = () => !!RD.wb && wbBg() === "quad";
const elecU = () => 34 * RD.z * DPRI();
function elecGeo(s, W, H){
  const u = s.__u || elecU(), ox = s.p[0][0] * W, oy = s.p[0][1] * H, o = s.k !== "rails" && !!s.o;
  const P = (x, y) => o ? [ox - y * u, oy + x * u] : [ox + x * u, oy + y * u];
  let lp, bx;
  if (s.k === "rails"){ const [w, h] = s.sz || [8, 10]; lp = []; for (let y = 1; y < h; y += 2) lp.push([0, y], [w, y]); bx = [-1.1, -1, w + .4, h + .2]; }
  else if (s.k === "jonction"){ lp = [[0, 0]]; bx = [-.3, -.3, .3, .3]; }
  else if (s.k === "transfo"){ lp = [[0, 0], [4, 0], [0, 2], [4, 2]]; bx = [0, -1.3, 4, 3]; }
  else if (s.k === "terre"){ lp = [[0, 0]]; bx = [-.45, -.15, .45, 1]; }
  else if (polDe(s) === "spdt"){ lp = [[0, 0], [2, 0], [2, 1]]; bx = [0, -1.1, 2, 1.35]; }
  else if (polDe(s) === "dpst"){ lp = [[0, 0], [2, 0], [0, 2], [2, 2]]; bx = [0, -1.1, 2, 2.4]; }
  else if (polDe(s) === "dpdt"){ lp = [[0, 0], [2, 0], [2, 1], [0, 2], [2, 2], [2, 3]]; bx = [0, -1.1, 2, 3.35]; }
  else if (s.k === "contactT"){ lp = [[0, 0], [2, 0]]; bx = [0, -1.3, 2, .8]; }
  else { lp = [[0, 0], [2, 0]]; bx = [0, -1.1, 2, .8]; }
  const c0 = P(bx[0], bx[1]), c1 = P(bx[2], bx[3]);
  return { el:true, u, o, ox, oy, P, ports:lp.map(([x, y]) => P(x, y)), bbox:[Math.min(c0[0], c1[0]), Math.min(c0[1], c1[1]), Math.max(c0[0], c1[0]), Math.max(c0[1], c1[1])] };
}
/* numéros de bornes d'un contact : 1er contact du relais = 13-14 (NO) ou 11-12 (NF), 2e = 23-24 / 21-22, etc. */
function numBornes(s){ if (!s.lb || !/^(contact|contactT)$/.test(s.k)) return null; const n = x => String(x || "").trim().toUpperCase();
  let i = 0; for (const o of strokes()){ if (/^(contact|contactT)$/.test(o.k) && n(o.lb) === n(s.lb)){ i++; if (o === s) break; } }
  i = Math.max(1, i); return s.nf ? [i + "1", i + "2"] : [i + "3", i + "4"]; }
function dessinerElec(g, s, W, H, k, col){
  const G = elecGeo(s, W, H), u = G.u, d = ELEC[s.k] || {}, K = s.k, nf = K === "surcharge" || (d.nf && s.nf);
  const SM = RD.sim && !s.__u ? SIM : null, ferme = SM ? SM.ferme.get(s) : undefined, actif = SM ? SM.charges.has(s) || SM.trOn.has(s) : false;   /* animation : état réel */
  const police = (f, gr) => (gr || 700) + " " + f + "px system-ui,'Segoe UI',Arial,sans-serif";
  g.save(); g.translate(G.ox, G.oy); if (G.o) g.rotate(Math.PI / 2);
  g.strokeStyle = col; g.fillStyle = col; g.lineCap = "round"; g.lineJoin = "round"; g.lineWidth = Math.max(1.5, 2.5 * k); g.setLineDash([]);
  const L = (...q) => { g.beginPath(); for (let i = 0; i < q.length; i += 2) i ? g.lineTo(q[i] * u, q[i + 1] * u) : g.moveTo(q[i] * u, q[i + 1] * u); g.stroke(); };
  const C = (x, y, r, plein) => { g.beginPath(); g.arc(x * u, y * u, r * u, 0, Math.PI * 2); if (plein) g.fill(); else { g.save(); g.fillStyle = "#fff"; g.fill(); g.restore(); g.stroke(); } };
  const T = (txt, x, y, sz, mode, maxW, gr) => { if (!txt) return; g.save(); g.translate(x * u, y * u); if (G.o) g.rotate(-Math.PI / 2);
    let f = sz * u; g.font = police(f, gr);
    if (maxW){ const m = g.measureText(txt).width; if (m > maxW * u){ f *= maxW * u / m; g.font = police(f, gr); } }
    g.textAlign = mode === "droite" ? "right" : (G.o && mode === "dessus") ? "left" : "center"; g.textBaseline = "middle"; g.fillStyle = col;
    g.fillText(txt, 0, 0); g.restore(); };
  const bornes = () => { C(.6, 0, .07, true); C(1.4, 0, .07, true); };
  /* (les fils qui passent sous un symbole sont coupés entre ses bornes : voir nettoyerFils) */
  if (K === "contact" || K === "surcharge" || K === "contactT"){
    L(0, 0, .75, 0); L(1.25, 0, 2, 0); L(.75, -.38, .75, .38); L(1.25, -.38, 1.25, .38);
    if (nf) L(.55, .45, 1.45, -.45);
    if (ferme){ g.save(); g.strokeStyle = "#2f9e44"; g.lineWidth = Math.max(2, 3.5 * k); L(.75, 0, 1.25, 0); g.restore(); }
    if (!s.__u && K !== "surcharge"){ const nb = numBornes(s); if (nb){ T(nb[0], .3, .34, .2, null, 0, 600); T(nb[1], 1.7, .34, .2, null, 0, 600); } }   /* numéros de bornes : 13-14 (NO), 11-12 (NF) */
    if (K === "contactT"){ g.save(); g.lineWidth = Math.max(1.2, 1.8 * k); L(1, -.38, 1, -.6); g.beginPath(); g.arc(u, -.82 * u, .26 * u, .15 * Math.PI, .85 * Math.PI, false); g.stroke(); g.restore();   /* parapluie : temporisé au travail */
      T(s.lb, 1, -1.1, .34, "dessus"); }
    else T(s.lb, 1, -.75, .36, "dessus");
  } else if (K === "ampoule"){
    L(0, 0, .6, 0); L(1.4, 0, 2, 0);
    if (actif){ g.save(); g.shadowColor = "#ffd43b"; g.shadowBlur = u * .9; g.beginPath(); g.arc(u, 0, .4 * u, 0, Math.PI * 2); g.fillStyle = "#fff3bf"; g.fill(); g.restore(); }
    else C(1, 0, .4, false);
    g.beginPath(); g.arc(u, 0, .4 * u, 0, Math.PI * 2); g.stroke(); const r7 = .4 * .7071; L(1 - r7, -r7, 1 + r7, r7); L(1 - r7, r7, 1 + r7, -r7);
    T(s.lb, 1, -.68, .32, "dessus");
  } else if (K === "bobine" || K === "bobineT" || K === "lampe" || K === "moteur"){
    const r = K === "moteur" ? .45 : .4; L(0, 0, 1 - r, 0); L(1 + r, 0, 2, 0);
    if (actif){ const lc = { R:"#ff6b6b", G:"#51cf66", V:"#51cf66", A:"#ffd43b", J:"#ffd43b", Y:"#ffd43b", B:"#4dabf7", W:"#fff9db" }[(s.lb || "").trim().toUpperCase()[0]] || "#ffd43b";
      const fc = K === "lampe" ? lc : K === "moteur" ? "#b2f2bb" : "#ffc9c9"; g.save(); if (K === "lampe"){ g.shadowColor = lc; g.shadowBlur = u * .8; }
      g.beginPath(); g.arc(u, 0, r * u, 0, Math.PI * 2); g.fillStyle = fc; g.fill(); g.restore(); g.beginPath(); g.arc(u, 0, r * u, 0, Math.PI * 2); g.stroke(); }
    else C(1, 0, r, false);
    if (K === "lampe") for (let i = 0; i < 8; i++){ const a = i * Math.PI / 4 + Math.PI / 8; L(1 + Math.cos(a) * (r + .07), Math.sin(a) * (r + .07), 1 + Math.cos(a) * (r + .22), Math.sin(a) * (r + .22)); }
    T(s.lb, 1, .02, .34, null, r * 1.55);
    if (K === "bobineT") T("⏱ " + (s.del || 3) + " s", 1, .66, .26, null, 0, 600);
    if ((K === "bobine" || K === "bobineT") && !s.__u){ T("A1", .2, -.3, .2, null, 0, 600); T("A2", 1.8, -.3, .2, null, 0, 600); }   /* bornes de la bobine */
  } else if (K === "solenoide"){
    L(0, 0, .55, 0); L(1.45, 0, 2, 0); g.save(); if (actif){ g.strokeStyle = "#e03131"; g.lineWidth = Math.max(2, 3.5 * k); } g.beginPath(); for (let i = 0; i < 3; i++) g.arc((.7 + i * .3) * u, 0, .15 * u, Math.PI, 0, false); g.stroke(); g.restore();
    T(s.lb, 1, -.6, .34, "dessus");
  } else if (K === "fusible"){
    L(0, 0, .5, 0); L(1.5, 0, 2, 0); g.beginPath(); g.rect(.5 * u, -.18 * u, u, .36 * u); g.stroke();
    if (ferme === false){ L(.5, 0, .85, 0); L(1.15, 0, 1.5, 0); g.save(); g.strokeStyle = "#e03131"; L(.88, -.14, 1.12, .14); L(.88, .14, 1.12, -.14); g.restore(); } else L(.5, 0, 1.5, 0);
    T(s.lb, 1, -.6, .34, "dessus");
  } else if (K === "bp"){
    L(0, 0, .6, 0); L(1.4, 0, 2, 0); bornes();
    const yb = SM ? (ferme ? (nf ? .1 : .02) : -.3) : (nf ? .1 : -.3); if (ferme) g.strokeStyle = "#2f9e44"; L(.45, yb, 1.55, yb); g.strokeStyle = col; L(1, yb, 1, -.62); L(.82, -.62, 1.18, -.62);
    T(s.lb, 1, -.9, .34, "dessus");
  } else if (K === "inter" && polDe(s) !== "spst"){
    const pol = polDe(s), act = SM ? SM.act.has(s) : false, vert = c2 => { if (SM) g.strokeStyle = c2; };
    const pole = y => { if (pol.endsWith("dt")){
        L(0, y, .6, y); L(1.4, y, 2, y); L(1.4, y + 1, 2, y + 1); C(.6, y, .07, true); C(1.4, y, .07, true); C(1.4, y + 1, .07, true);
        vert("#2f9e44"); const e = act ? [1.4, y + 1] : [1.4, y]; L(.6, y, e[0], e[1]); g.strokeStyle = col; return [1, (y + e[1]) / 2]; }
      const cl = SM ? (nf ? !act : act) : nf, ye = cl ? y + .03 : y - .42;
      L(0, y, .6, y); L(1.4, y, 2, y); C(.6, y, .07, true); C(1.4, y, .07, true); if (SM && cl) g.strokeStyle = "#2f9e44"; L(.6, y, 1.45, ye); g.strokeStyle = col; return [1.02, (y + ye) / 2]; };
    const m1 = pole(0);
    if (pol[0] === "d"){ const m2 = pole(2); g.save(); g.lineWidth = Math.max(1, 1.4 * k); g.setLineDash([.08 * u, .08 * u]); L(m1[0], m1[1], m2[0], m2[1]); g.restore(); }
    T(s.lb, 1, -.8, .34, "dessus"); T(pol.toUpperCase(), 1.75, pol === "spdt" ? .55 : pol === "dpst" ? 1 : 1.55, .22, null, 0, 600);
  } else if (/^(inter|thermostat|pression|flotteur|fincourse)$/.test(K)){
    L(0, 0, .6, 0); L(1.4, 0, 2, 0); bornes();
    const ye = SM ? (ferme ? .03 : -.42) : (nf ? .16 : -.42), mx = 1.02, my = ye * .5; if (ferme) g.strokeStyle = "#2f9e44"; L(.6, 0, 1.45, ye); g.strokeStyle = col;
    if (K !== "inter"){
      g.save(); g.lineWidth = Math.max(1, 1.4 * k); g.setLineDash([.07 * u, .07 * u]); L(mx, my, mx, .44); g.restore();
      g.save(); g.lineWidth = Math.max(1.2, 2 * k);
      if (K === "thermostat") L(.8, .5, .89, .66, .98, .5, 1.07, .66, 1.16, .5, 1.24, .62);
      else if (K === "pression"){ g.beginPath(); g.arc(mx * u, .64 * u, .2 * u, Math.PI, 0, false); g.closePath(); g.stroke(); }
      else if (K === "flotteur") C(mx, .6, .15, false);
      else { g.beginPath(); g.moveTo(.84 * u, .64 * u); g.lineTo(1.2 * u, .64 * u); g.lineTo(mx * u, .44 * u); g.closePath(); g.stroke(); }
      g.restore();
    }
    T(s.lb, 1, -.8, .34, "dessus");
  } else if (K === "transfo"){
    L(0, 0, 1, 0); L(3, 0, 4, 0); L(0, 2, 1, 2); L(3, 2, 4, 2);
    g.beginPath(); for (let i = 0; i < 4; i++) g.arc((1.25 + i * .5) * u, 0, .25 * u, Math.PI, 0, true); g.stroke();
    g.beginPath(); for (let i = 0; i < 4; i++) g.arc((1.25 + i * .5) * u, 2 * u, .25 * u, Math.PI, 0, false); g.stroke();
    L(1, .86, 3, .86); L(1, 1.14, 3, 1.14);
    T("H1", .45, -.32, .27, null, 0, 600); T("H2", 3.55, -.32, .27, null, 0, 600); T("X1", .45, 2.32, .27, null, 0, 600); T("X2", 3.55, 2.32, .27, null, 0, 600);
    T(s.lb, 2, -.62, .34);
    if (s.vp) T("Primaire " + s.vp, 2, -1.05, .3, null, 0, 700); if (s.vs) T("Secondaire " + s.vs, 2, 2.7, .3, null, 0, 700);   /* tensions du transformateur */
  } else if (K === "resistance" || K === "chauffant"){
    if (K === "chauffant"){ L(0, 0, .4, 0); L(1.6, 0, 2, 0); g.save(); g.beginPath(); g.rect(.4 * u, -.28 * u, 1.2 * u, .56 * u); g.fillStyle = actif ? "#ffa94d" : "#fff"; if (actif){ g.shadowColor = "#ff6b00"; g.shadowBlur = u * .6; } g.fill(); g.restore(); g.beginPath(); g.rect(.4 * u, -.28 * u, 1.2 * u, .56 * u); g.stroke(); }
    else { L(0, 0, .45, 0); L(1.55, 0, 2, 0); }
    const x0 = K === "chauffant" ? .5 : .45, x1 = K === "chauffant" ? 1.5 : 1.55, n = 6, a = K === "chauffant" ? .14 : .2, q = [x0, 0];
    for (let i = 0; i < n; i++) q.push(x0 + (x1 - x0) * (i + .5) / n, i % 2 ? a : -a); q.push(x1, 0);
    g.save(); if (actif && K === "resistance") g.strokeStyle = "#e8590c"; L(...q); g.restore();
    T(s.lb, 1, -.6, .32, "dessus");
  } else if (K === "condensateur"){
    L(0, 0, .9, 0); L(1.1, 0, 2, 0); g.save(); g.lineWidth = Math.max(2, 3 * k); L(.9, -.36, .9, .36); L(1.1, -.36, 1.1, .36); g.restore();
    T(s.lb, 1, -.65, .32, "dessus");
  } else if (K === "diode" || K === "del"){
    L(0, 0, .72, 0); L(1.28, 0, 2, 0);
    g.beginPath(); g.moveTo(.72 * u, -.26 * u); g.lineTo(.72 * u, .26 * u); g.lineTo(1.22 * u, 0); g.closePath();
    g.save(); g.fillStyle = K === "del" && actif ? "#ff4d4d" : "#fff"; if (K === "del" && actif){ g.shadowColor = "#ff2020"; g.shadowBlur = u * .7; } g.fill(); g.restore(); g.stroke();
    L(1.24, -.28, 1.24, .28);
    if (K === "del"){ g.save(); g.lineWidth = Math.max(1, 1.5 * k); if (actif) g.strokeStyle = "#e03131";
      [[.95, -.32], [1.15, -.3]].forEach(([x, y]) => { L(x, y, x + .2, y - .22); L(x + .2, y - .22, x + .1, y - .2); L(x + .2, y - .22, x + .18, y - .12); }); g.restore(); }
    T(s.lb, 1, K === "del" ? -.8 : -.6, .3, "dessus");
  } else if (K === "pile"){
    L(0, 0, .74, 0); L(1.26, 0, 2, 0); g.save();
    [[.74, .4, 2.4], [.9, .2, 3.6], [1.1, .4, 2.4], [1.26, .2, 3.6]].forEach(([x, h, w]) => { g.lineWidth = Math.max(1.5, w * k); L(x, -h, x, h); }); g.restore();
    T("+", .52, -.32, .3, null, 0, 800); T("−", 1.5, -.3, .3, null, 0, 800); T(s.lb, 1, -.68, .3, "dessus");
  } else if (K === "sonnerie"){
    L(0, 0, .6, 0); L(1.4, 0, 2, 0); g.beginPath(); g.moveTo(.6 * u, 0); g.arc(u, 0, .4 * u, Math.PI, 0, false); g.closePath();
    g.save(); g.fillStyle = actif ? "#ffe066" : "#fff"; g.fill(); g.restore(); g.stroke(); L(.6, 0, 1.4, 0);
    T(s.lb, 1, .32, .24, null, 0, 700);
  } else if (K === "terre"){
    L(0, 0, 0, .5); L(-.38, .5, .38, .5); L(-.25, .66, .25, .66); L(-.12, .82, .12, .82);
  } else if (K === "jonction"){
    C(0, 0, .13, true);
  } else if (K === "rails"){
    const [w, h] = s.sz || [8, 10]; g.lineWidth = Math.max(2, 4 * k); if (SM) g.strokeStyle = "#e03131"; L(0, 0, 0, h); if (SM) g.strokeStyle = "#1c7ed6"; L(w, 0, w, h); g.strokeStyle = col;
    const lb = String(s.lb == null ? "L1 / L2" : s.lb).split("/"); T((lb[0] || "").trim(), 0, -.5, .4); T((lb[1] || "").trim(), w, -.5, .4);
    if (s.v) T(s.v, w / 2, -.5, .38, null, Math.max(2, w - 2));                     /* tension de l'échelle, au centre */
    let n = 1; for (let y = 1; y < h; y += 2) T(String(n++), -.4, y, .3, "droite", 0, 600);
    if (RD.obj && !RD.sim && !s.__u && typeof SELO !== "undefined" && SELO.s === s){ g.fillStyle = "#2a7bcf"; g.fillRect((w - .3) * u, (h - .3) * u, .6 * u, .6 * u);
      g.strokeStyle = "#fff"; g.lineWidth = Math.max(1.5, 2 * k); L(w - .15, h + .15, w + .15, h - .15); L(w + .02, h - .15, w + .15, h - .15, w + .15, h - .02); L(w - .15, h + .02, w - .15, h + .15, w - .02, h + .15); }
  }
  g.restore();
  if (RD.obj && !RD.sim && !s.__u){ const sel = typeof SELO !== "undefined" && SELO.s === s; g.save(); g.fillStyle = "#2a7bcf"; g.strokeStyle = "#2a7bcf"; g.lineWidth = Math.max(1.2, 1.6 * k);
    G.ports.forEach(q => { g.beginPath(); g.arc(q[0], q[1], Math.max(2.5, u * (sel ? .1 : .08)), 0, 7); if (sel) g.fill(); else { g.fillStyle = "rgba(42,123,207,.25)"; g.fill(); g.stroke(); } }); g.restore(); }
  return G;
}
function objGeo(s, W, H){
  if (ELEC[s.k]) return elecGeo(s, W, H);
  const dpr = DPRI(), a = (34 * RD.z) * 1.2 * dpr, d = a * .8660254, ox = s.p[0][0] * W, oy = s.p[0][1] * H, sw = s.o ? 1 : 0;
  /* pivoter = image en miroir gauche-droite : les mêmes faces restent visibles, donc l'objet est toujours complet */
  const P = (m, n, h) => [ox + (sw ? -(m + n) : (m + n)) * d, oy + (n - m) * a / 2 - (h || 0) * a];
  const def = OBJETS[s.k] || OBJETS.plinthe, shapes = [];
  const box = (m0, n0, m1, n1, h0, h1, fill, extra) => shapes.push({ t:"box", m0, n0, m1, n1, h0, h1, fill:fill || def.fill, extra });
  const sph = (m, n, h, R, fill) => shapes.push({ t:"sph", m, n, h, R, fill:fill || def.fill });
  const cylN = (m, h, R, n0, n1, fill) => shapes.push({ t:"cyln", m, h, R, n0, n1, fill:fill || def.fill });
  const cyl = (m, n, R, h0, h1, fill, rings) => shapes.push({ t:"cyl", m, n, R, h0, h1, fill:fill || def.fill, rings });
  if (s.k === "plinthe")      box(0, 0, 3, .3, 0, .45, null, { fins:[.2, 2.8, .2, .08, .37] });
  else if (s.k === "radiateur") box(0, 0, 2, .18, 0, 1.3, null, { fins:[.15, 1.85, .15, .1, 1.2] });
  else if (s.k === "chaudiere"){
    box(-.3, .88, 0, 1.12, .12, .34, "#e07070"); box(.88, 2, 1.12, 2.3, .12, .34, "#6f9fe0");   /* départ (rouge, face gauche) et retour (bleu, face droite) */
    box(0, 0, 2, 2, 0, 2, null, { chaud:true }); box(.15, .15, 1.85, 1.85, 2, 2.08, "#aab4c0"); cyl(1, 1, .26, 2.08, 3, "#aeb6c0", 2);
  }
  else if (s.k === "pompe"){
    box(.9, -.12, 1, .12, .03, .36, "#9aa7b5"); box(.7, -.06, .9, .06, .1, .26, "#aab4c0");      /* côté éloigné : bride et tuyau */
    cylN(.5, .25, .23, -.09, .09);                                                               /* volute */
    cylN(.5, .25, .17, .09, .5, "#4f78a8");                                                      /* moteur */
    box(.42, .17, .58, .34, .4, .55, "#3c4650");                                                 /* boîte à bornes */
    box(.1, -.06, .3, .06, .1, .26, "#aab4c0"); box(0, -.12, .1, .12, .03, .36, "#9aa7b5");      /* côté proche : tuyau et bride */
  }
  else if (s.k === "vanne"){
    box(.7, -.07, 1, .07, .08, .3, "#aab4c0"); box(.28, -.2, .72, .2, 0, .5, "#d9b45a");           /* tuyau éloigné et corps (laiton) */
    cyl(.5, 0, .13, .5, .85, "#c79a3a"); cyl(.5, 0, .045, .85, 1.1, "#aeb7c2"); cyl(.5, 0, .3, 1.1, 1.17, "#d6342a", 0);   /* chapeau, tige, volant rouge */
    box(0, -.07, .3, .07, .08, .3, "#aab4c0");                                                      /* tuyau proche */
  }
  else if (s.k === "collecteur4" || s.k === "collecteur6"){
    const N = s.k === "collecteur4" ? 4 : 6, L = N + 1, H0 = 1.15, H1 = 1.41, R0 = .45, R1 = .71;
    box(0, -.13, L, .13, H0, H1, "#d65a50"); box(0, .87, L, 1.13, R0, R1, "#4a86d8");              /* départ (haut, rouge) et retour (bas, bleu) */
    [.4, L - .4].forEach(m => { box(m - .06, -.17, m + .06, .17, H0 - .04, H1 + .04, "#8f9cab"); box(m - .06, .83, m + .06, 1.17, R0 - .04, R1 + .04, "#8f9cab"); });   /* supports */
    box(-1.07, -.07, 0, .07, H0 + .06, H1 - .06, "#e07070"); box(-1.07, -.07, -.93, .07, 0, H1 - .06, "#e07070"); box(-1.12, -.12, -.88, .12, 0, .08, "#c25a5a");   /* arrivée d'eau chaude : tuyau puis colonne jusqu'au plancher = attache */
    box(-1.07, .93, 0, 1.07, R0 + .06, R1 - .06, "#6f9fe0"); box(-1.07, .93, -.93, 1.07, 0, R1 - .06, "#6f9fe0"); box(-1.12, .88, -.88, 1.12, 0, .08, "#3f72c0");   /* retour vers la chaudière : même chose, côté bleu */
    for (let i = 1; i <= N; i++){
      cyl(i, 0, .09, H1, H1 + .1, "#d9534f"); cyl(i, 0, .07, H1 + .1, H1 + .45, "#eaf3fb");        /* débitmètre sur le départ */
      box(i - .07, -.07, i + .07, .07, 0, H0, "#aab4c0"); box(i - .1, -.1, i + .1, .1, 0, .14, "#8f9cab");   /* sortie de boucle (départ) */
      cyl(i, 1, .1, R1, R1 + .26, "#f2f2f2");                                                        /* tête thermique sur le retour */
      box(i - .07, .93, i + .07, 1.07, 0, R0, "#aab4c0"); box(i - .1, .9, i + .1, 1.1, 0, .14, "#8f9cab");     /* entrée de boucle (retour) */
    }
    box(L, -.1, L + .12, .1, H0 - .02, H1 + .02, "#aab4c0"); box(L, .9, L + .12, 1.1, R0 - .02, R1 + .02, "#aab4c0");   /* bouchons */
    cyl(L + .35, 0, .1, H1, H1 + .3, "#c9a227"); cyl(L + .35, 0, .13, H1 + .3, H1 + .38, "#2f3b48");    /* purgeur d'air */
  }
  else if (s.k === "serpentin"){ const [dm, dn] = s.sz || [4, 3]; shapes.push({ t:"serp", dm, dn, pas:s.pas || .5 }); }
  else if (s.k === "vanne3"){
    box(1.4, -.07, 2, .07, .08, .3, "#aab4c0"); box(.6, -.2, 1.4, .2, 0, .5);                       /* tuyau éloigné et corps en T */
    cyl(1, 0, .11, .5, .78, "#9aa7b5"); box(.72, -.2, 1.28, .2, .78, 1.22, "#35506b", { fins:[.1, .46, .09, .86, 1.14] });   /* tige et servomoteur */
    cyl(1, 0, .15, 1.22, 1.38, "#2f3b48");
    box(.88, .2, 1.12, 1, .08, .3, "#aab4c0"); box(.84, .2, 1.16, .34, .05, .33, "#8f9cab");       /* branche vers l'avant (3e voie) */
    box(.6, -.1, .7, .1, .05, .33, "#8f9cab"); box(0, -.07, .6, .07, .08, .3, "#aab4c0");           /* écrou et tuyau proche */
  }
  else if (s.k === "boisseau"){
    box(.7, -.07, 1, .07, .08, .3, "#aab4c0"); box(.62, -.1, .72, .1, .05, .33, "#8f9cab"); sph(.5, 0, .19, .3);   /* tuyau éloigné, écrou, boule */
    cyl(.5, 0, .05, .45, .62, "#9aa7b5"); box(.12, -.04, .88, .04, .62, .7, "#c0392b");                          /* tige et poignée (ouverte) */
    box(.28, -.1, .38, .1, .05, .33, "#8f9cab"); box(0, -.07, .3, .07, .08, .3, "#aab4c0");                     /* écrou et tuyau proche */
  }
  else if (s.k === "valvesol"){
    box(.7, -.07, 1, .07, .08, .3, "#aab4c0"); box(.28, -.2, .72, .2, 0, .5, "#d9b45a");           /* tuyau éloigné et corps de laiton */
    cyl(.5, 0, .11, .5, .72, "#3c4650");                                                           /* tube du plongeur */
    box(.28, -.24, .72, .24, .72, 1.3, "#c8102e");                                                 /* bobine rouge */
    box(.4, .24, .6, .42, .86, 1.12, "#9aa7b5");                                                   /* entrée du conduit électrique */
    cyl(.5, 0, .08, 1.3, 1.38, "#d7dce2", 0);                                                      /* écrou du dessus */
    box(0, -.07, .3, .07, .08, .3, "#aab4c0");                                                     /* tuyau proche */
  }
  else if (s.k === "vannemot"){
    box(.7, -.07, 1, .07, .08, .3, "#aab4c0"); box(.3, -.2, .7, .2, 0, .45);                       /* tuyau éloigné et corps de vanne */
    cyl(.5, 0, .11, .45, .75, "#9aa7b5"); box(.26, -.2, .74, .2, .75, 1.2, "#35506b", { fins:[.08, .4, .08, .83, 1.12] });   /* tige et servomoteur */
    cyl(.5, 0, .15, 1.2, 1.36, "#2f3b48"); box(.48, .2, .66, .34, .85, 1.05, "#3c4650");           /* capot et presse-étoupe */
    box(0, -.07, .3, .07, .08, .3, "#aab4c0");                                                    /* tuyau proche */
  }
  else if (s.k === "vase"){ cyl(0, 0, .09, 0, .4, "#9aa7b5"); cyl(0, 0, .5, .35, 1.55, "#d4574f", 1); cyl(0, 0, .08, 1.55, 1.7, "#8f9cab"); }
  const LV = def.ports && def.ports.length ? Math.round(Math.max(...def.ports.map(q => q[0]))) : 1;   /* debout : les raccords restent sur la grille; vers le haut et vers le bas échangent les deux raccords */
  { const cH = { vanne:.19, boisseau:.19, vannemot:.19, vanne3:.19, valvesol:.19, pompe:.185 }[s.k];   /* le bout de tuyau de l'objet est centré sur le raccord (avant, le raccord était sous le tuyau) */
    if (cH) shapes.forEach(sh => ["h", "h0", "h1"].forEach(c => { if (typeof sh[c] === "number") sh[c] -= cH; })); }
  if (/^(vanne|boisseau|vannemot|vanne3|valvesol)$/.test(s.k)){ const f = .68;                          /* vannes plus fines : même longueur (raccords sur la grille), section et volant réduits */
    shapes.forEach(sh => { ["n", "n0", "n1", "h", "h0", "h1", "R"].forEach(c => { if (typeof sh[c] === "number" && !(c[0] === "n" && Math.abs(sh[c]) > .9)) sh[c] *= f; });   /* une branche qui va jusqu'à un raccord garde sa longueur */
      if (sh.extra && sh.extra.fins){ const F = sh.extra.fins.slice(); F[3] *= f; F[4] *= f; sh.extra = Object.assign({}, sh.extra, { fins:F }); } }); }
  /* objet debout : l'axe du tuyau devient vertical. Vers le haut : volant tourné vers la gauche; vers le bas : volant vers la droite (raccords échangés) */
  const RV = !s.v || !DEBOUT_OK.test(s.k) ? null : s.v > 0 ? (m, n, h) => [-h, n, m] : (m, n, h) => [-n, h, LV - m];
  if (RV){
    const cylAxe = (A, B, R, fill, rings) => { const ax = [0, 1, 2].reduce((b, c) => Math.abs(B[c] - A[c]) > Math.abs(B[b] - A[b]) ? c : b, 0), lo = Math.min(A[ax], B[ax]), hi = Math.max(A[ax], B[ax]);
      if (ax === 0) return { t:"cylm", m0:lo, m1:hi, n:A[1], h:A[2], R, fill, rings };
      if (ax === 1) return { t:"cyln", m:A[0], h:A[2], R, n0:lo, n1:hi, fill };
      return { t:"cyl", m:A[0], n:A[1], R, h0:lo, h1:hi, fill, rings }; };
    shapes.forEach((sh, i) => {
      if (sh.t === "box"){ const A = RV(sh.m0, sh.n0, sh.h0), B = RV(sh.m1, sh.n1, sh.h1), nb = Object.assign({}, sh, { m0:Math.min(A[0], B[0]), m1:Math.max(A[0], B[0]), n0:Math.min(A[1], B[1]), n1:Math.max(A[1], B[1]), h0:Math.min(A[2], B[2]), h1:Math.max(A[2], B[2]) });
        if (sh.extra && sh.extra.fins){ const [f0, f1, st, y0, y1] = sh.extra.fins, segs = []; for (let m = f0; m <= f1 + .001; m += st) segs.push([RV(sh.m0 + m, sh.n1, y0), RV(sh.m0 + m, sh.n1, y1)]); nb.extra = Object.assign({}, sh.extra, { fins:null, segs }); }
        shapes[i] = nb; }
      else if (sh.t === "cyl") shapes[i] = cylAxe(RV(sh.m, sh.n, sh.h0), RV(sh.m, sh.n, sh.h1), sh.R, sh.fill, sh.rings);
      else if (sh.t === "cyln") shapes[i] = cylAxe(RV(sh.m, sh.n0, sh.h), RV(sh.m, sh.n1, sh.h), sh.R, sh.fill);
      else if (sh.t === "sph"){ const A = RV(sh.m, sh.n, sh.h); shapes[i] = Object.assign({}, sh, { m:A[0], n:A[1], h:A[2] }); } });
    const prof = sh => sh.t === "box" ? -(sh.m0 + sh.m1) / 2 + (sh.n0 + sh.n1) / 2 + (sh.h0 + sh.h1) / 2 : sh.t === "cylm" ? -(sh.m0 + sh.m1) / 2 + sh.n + sh.h : sh.t === "cyln" ? -sh.m + (sh.n0 + sh.n1) / 2 + sh.h : sh.t === "cyl" ? -sh.m + sh.n + (sh.h0 + sh.h1) / 2 : -sh.m + sh.n + sh.h;
    shapes.sort((x, y) => prof(x) - prof(y)); }                                                   /* on dessine du plus loin au plus proche */
  let lp = def.ports;
  if (s.k === "serpentin"){ const [dm, dn] = s.sz || [4, 3], lignes = Math.round(Math.abs(dn) / (s.pas || .5)) + 1; lp = [[0, 0], [lignes % 2 ? dm : 0, dn]]; }
  const ports = lp.map(([m, n]) => { if (!RV) return P(m, n, 0); const A = RV(m, n, 0); return P(A[0], A[1], A[2]); });
  const pts = []; shapes.forEach(sh => {
    if (sh.t === "box") [[sh.m0, sh.n0], [sh.m1, sh.n0], [sh.m1, sh.n1], [sh.m0, sh.n1]].forEach(([m, n]) => { pts.push(P(m, n, sh.h0), P(m, n, sh.h1)); });
    else if (sh.t === "serp"){ pts.push(P(0, 0, 0), P(sh.dm, 0, 0), P(sh.dm, sh.dn, 0), P(0, sh.dn, 0)); }
    else if (sh.t === "sph"){ const c = P(sh.m, sh.n, sh.h); pts.push([c[0] - sh.R * a, c[1] - sh.R * a], [c[0] + sh.R * a, c[1] + sh.R * a]); }
    else if (sh.t === "cyln"){ for (let i = 0; i < 24; i++){ const th = i / 24 * Math.PI * 2; pts.push(P(sh.m + sh.R * Math.cos(th), sh.n0, sh.h + sh.R * Math.sin(th)), P(sh.m + sh.R * Math.cos(th), sh.n1, sh.h + sh.R * Math.sin(th))); } }
    else if (sh.t === "cylm"){ [sh.m0, sh.m1].forEach(m => { pts.push(P(m, sh.n - sh.R, sh.h - sh.R), P(m, sh.n + sh.R, sh.h + sh.R), P(m, sh.n - sh.R, sh.h + sh.R), P(m, sh.n + sh.R, sh.h - sh.R)); }); }
    else if (sh.t === "cyl"){ const c = P(sh.m, sh.n, 0); pts.push([c[0] - sh.R * a * 1.22, c[1] - sh.h1 * a - sh.R * a * .71], [c[0] + sh.R * a * 1.22, c[1] + sh.R * a * .71]); }
    else { pts.push(P(0, 0, .5), P(1, 0, -.5), P(.5, 0, 1.2)); }
  });
  ports.forEach(q => pts.push(q));
  const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
  return { a, d, P, shapes, ports, bbox:[Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] };
}
function dessinerObjet(g, s, W, H, k, col){
  if (ELEC[s.k]) return dessinerElec(g, s, W, H, k, col);
  const G = objGeo(s, W, H), P = G.P, a = G.a;
  g.lineJoin = "round"; g.lineCap = "round"; g.lineWidth = Math.max(1.2, 2 * k);
  const poly = (pts, fill) => { g.beginPath(); pts.forEach((q, i) => i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.closePath(); g.fillStyle = fill; g.fill(); g.strokeStyle = col; g.stroke(); };
  const ombre = (hex, f) => { const n = parseInt(hex.slice(1), 16), r = n >> 16, gg = (n >> 8) & 255, b = n & 255; return "rgb(" + Math.round(r * f) + "," + Math.round(gg * f) + "," + Math.round(b * f) + ")"; };
  /* Rendu soigné (9 nov., essai sur la vanne, liste BEAU) : faces plus contrastées, dessus éclairci, reflets sur les cylindres, volant à rayons */
  const beau = BEAU.has(s.k), clair = (hex, f) => { const n = parseInt(hex.slice(1), 16), r = n >> 16, gg = (n >> 8) & 255, b = n & 255; return "rgb(" + Math.round(r + (255 - r) * f) + "," + Math.round(gg + (255 - gg) * f) + "," + Math.round(b + (255 - b) * f) + ")"; };
  G.shapes.forEach(sh => {
    if (sh.t === "box"){
      const { m0, n0, m1, n1, h0, h1 } = sh;
      poly([P(m0, n0, h0), P(m0, n1, h0), P(m0, n1, h1), P(m0, n0, h1)], ombre(sh.fill, beau ? .9 : .86));
      poly([P(m0, n1, h0), P(m1, n1, h0), P(m1, n1, h1), P(m0, n1, h1)], ombre(sh.fill, beau ? .64 : .72));
      poly([P(m0, n0, h1), P(m1, n0, h1), P(m1, n1, h1), P(m0, n1, h1)], beau ? clair(sh.fill, .32) : sh.fill);
      if (beau){ const A = P(m0, n1, h1), B = P(m1, n1, h1); g.save(); g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = Math.max(1, 1.1 * k); g.beginPath(); g.moveTo(A[0] + (B[0] - A[0]) * .12, A[1] + (B[1] - A[1]) * .12 - 1.5 * k); g.lineTo(A[0] + (B[0] - A[0]) * .88, A[1] + (B[1] - A[1]) * .88 - 1.5 * k); g.stroke(); g.restore(); }
      if (sh.extra && sh.extra.segs){ g.lineWidth = Math.max(1, 1.2 * k); g.beginPath(); sh.extra.segs.forEach(([u, v]) => { const A = P(...u), B = P(...v); g.moveTo(A[0], A[1]); g.lineTo(B[0], B[1]); }); g.stroke(); g.lineWidth = Math.max(1.2, 2 * k); }
      if (sh.extra && sh.extra.fins){ const [f0, f1, st, y0, y1] = sh.extra.fins; g.lineWidth = Math.max(1, 1.2 * k); g.beginPath();
        for (let m = f0; m <= f1 + .001; m += st){ const A = P(m0 + m, n1, y0), B = P(m0 + m, n1, y1); g.moveTo(A[0], A[1]); g.lineTo(B[0], B[1]); } g.stroke(); g.lineWidth = Math.max(1.2, 2 * k); }
      if (sh.extra && sh.extra.chaud){
        const q = (m, h) => P(m, n1, h), pan = [q(.25, 1.75), q(1.05, 1.75), q(1.05, .95), q(.25, .95)];
        poly(pan, "#2b3036"); poly([q(.35, 1.65), q(.95, 1.65), q(.95, 1.3), q(.35, 1.3)], "#7fd1b9");
        [[.45, 1.12], [.75, 1.12]].forEach(([m, h]) => { const c = q(m, h); g.beginPath(); g.ellipse(c[0], c[1], a * .09, a * .13, 0, 0, 7); g.fillStyle = "#d7dce2"; g.fill(); g.stroke(); });
        const f = P(0, 1.1, 1.0), fh = a * .34; g.fillStyle = "#f08c00"; g.beginPath(); g.moveTo(f[0], f[1] + fh * .6); g.quadraticCurveTo(f[0] - a * .26, f[1] + fh * .1, f[0] - a * .04, f[1] - fh * .6); g.quadraticCurveTo(f[0] + a * .02, f[1] - fh * .1, f[0] + a * .12, f[1] - fh * .25); g.quadraticCurveTo(f[0] + a * .28, f[1] + fh * .1, f[0], f[1] + fh * .6); g.fill(); g.stroke();
        g.fillStyle = "#ffd43b"; g.beginPath(); g.ellipse(f[0], f[1] + fh * .25, a * .07, a * .11, 0, 0, 7); g.fill();
      }
    } else if (sh.t === "serp"){
      const pas = sh.pas || .5, sg = Math.sign(sh.dn) || 1, nl = Math.round(Math.abs(sh.dn) / pas) + 1, pts = [];
      for (let i = 0; i < nl; i++){ const n = i * pas * sg, a0 = i % 2 ? sh.dm : 0, a1 = i % 2 ? 0 : sh.dm; pts.push(P(a0, n, 0), P(a1, n, 0)); }
      const tot = pts.length - 1; g.lineCap = "round"; g.lineJoin = "round";
      const trace = (w, col2, from, to) => { g.beginPath(); for (let i = from; i <= to; i++) i === from ? g.moveTo(pts[i][0], pts[i][1]) : g.lineTo(pts[i][0], pts[i][1]); g.lineWidth = w; g.strokeStyle = col2; g.stroke(); };
      const w0 = Math.max(3, a * .13 * Math.min(1, (sh.pas || .5) * 1.6));
      trace(w0 + 3 * k, "#3a424b", 0, tot);
      for (let i = 0; i < tot; i++){ const f = i / Math.max(1, tot - 1), c1 = "rgb(" + Math.round(224 - 150 * f) + "," + Math.round(80 + 60 * f) + "," + Math.round(80 + 130 * f) + ")"; trace(w0, c1, i, i + 1); }
    } else if (sh.t === "sph"){
      const c = P(sh.m, sh.n, sh.h); g.beginPath(); g.arc(c[0], c[1], sh.R * a, 0, Math.PI * 2); g.fillStyle = ombre(sh.fill, .85); g.fill(); g.strokeStyle = col; g.stroke();
      g.beginPath(); g.arc(c[0] - sh.R * a * .22, c[1] - sh.R * a * .25, sh.R * a * .5, 0, Math.PI * 2); g.fillStyle = sh.fill; g.fill();
    } else if (sh.t === "cyln"){
      const cap = n => Array.from({ length:40 }, (_, i) => { const th = i / 40 * Math.PI * 2; return P(sh.m + sh.R * Math.cos(th), n, sh.h + sh.R * Math.sin(th)); });
      poly(enveloppe(cap(sh.n0).concat(cap(sh.n1))), ombre(sh.fill, beau ? .68 : .78)); poly(cap(sh.n1), beau ? clair(sh.fill, .22) : sh.fill);
      const c = P(sh.m, sh.n1, sh.h); g.beginPath(); g.arc(c[0], c[1], a * .09, 0, 7); g.fillStyle = ombre(sh.fill, .7); g.fill(); g.stroke();
      g.beginPath(); cap(sh.n1).forEach((q, i) => { const r = .62, x = c[0] + (q[0] - c[0]) * r, y = c[1] + (q[1] - c[1]) * r; i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.closePath(); g.lineWidth = Math.max(1, 1.2 * k); g.stroke(); g.lineWidth = Math.max(1.2, 2 * k);
    } else if (sh.t === "cylm"){                                           /* cylindre couché (objet debout) : on voit le bout côté m0 */
      const cap = m => Array.from({ length:40 }, (_, i) => { const th = i / 40 * Math.PI * 2; return P(m, sh.n + sh.R * Math.cos(th), sh.h + sh.R * Math.sin(th)); });
      poly(enveloppe(cap(sh.m0).concat(cap(sh.m1))), ombre(sh.fill, beau ? .68 : .8)); poly(cap(sh.m0), beau ? clair(sh.fill, .22) : sh.fill);
    } else if (sh.t === "cyl"){
      const c0 = P(sh.m, sh.n, sh.h0), c1 = P(sh.m, sh.n, sh.h1), rx = sh.R * a * 1.22, ry = sh.R * a * .71;
      g.beginPath(); g.moveTo(c0[0] - rx, c0[1]); g.ellipse(c0[0], c0[1], rx, ry, 0, Math.PI, 0, true); g.lineTo(c1[0] + rx, c1[1]); g.ellipse(c1[0], c1[1], rx, ry, 0, 0, Math.PI, false); g.closePath();
      if (beau){ const gr = g.createLinearGradient(c0[0] - rx, 0, c0[0] + rx, 0); gr.addColorStop(0, ombre(sh.fill, .6)); gr.addColorStop(.3, clair(sh.fill, .45)); gr.addColorStop(.62, sh.fill); gr.addColorStop(1, ombre(sh.fill, .55)); g.fillStyle = gr; } else g.fillStyle = ombre(sh.fill, .8);
      g.fill(); g.strokeStyle = col; g.stroke();
      if (sh.rings){ g.lineWidth = Math.max(1, 1.2 * k); for (let i = 1; i <= sh.rings; i++){ const cy = c0[1] + (c1[1] - c0[1]) * i / (sh.rings + 1); g.beginPath(); g.ellipse(c0[0], cy, rx, ry, 0, 0, Math.PI, false); g.stroke(); } g.lineWidth = Math.max(1.2, 2 * k); }
      g.beginPath(); g.ellipse(c1[0], c1[1], rx, ry, 0, 0, Math.PI * 2); g.fillStyle = beau ? clair(sh.fill, .2) : sh.fill; g.fill(); g.stroke();
      if (beau && sh.R >= .18 && sh.h1 - sh.h0 < .12){   /* volant : jante, 4 rayons et moyeu */
        g.save(); g.lineWidth = Math.max(1, 1.2 * k); g.beginPath(); g.ellipse(c1[0], c1[1], rx * .7, ry * .7, 0, 0, 7); g.fillStyle = ombre(sh.fill, .7); g.fill(); g.stroke();
        g.lineWidth = Math.max(1.5, 2.6 * k); g.strokeStyle = clair(sh.fill, .15); g.beginPath(); [[1, 0], [0, 1], [.7, .7], [.7, -.7]].forEach(([x, y]) => { g.moveTo(c1[0] - rx * .7 * x, c1[1] - ry * .7 * y); g.lineTo(c1[0] + rx * .7 * x, c1[1] + ry * .7 * y); }); g.stroke();
        g.strokeStyle = col; g.lineWidth = Math.max(1, 1.2 * k); g.beginPath(); g.ellipse(c1[0], c1[1], rx * .22, ry * .22, 0, 0, 7); g.fillStyle = "#e9edf2"; g.fill(); g.stroke(); g.restore(); }
    } else if (sh.t === "vanne"){
      poly([P(0, 0, .35), P(0, 0, -.35), P(.5, 0, 0)], def2(s)); poly([P(1, 0, .35), P(1, 0, -.35), P(.5, 0, 0)], def2(s));
      const c = P(.5, 0, 0), t = P(.5, 0, .95); g.beginPath(); g.moveTo(c[0], c[1]); g.lineTo(t[0], t[1]); g.stroke(); g.beginPath(); g.ellipse(t[0], t[1], a * .22, a * .11, 0, 0, 7); g.stroke();
    }
  });
  g.fillStyle = "#2a7bcf"; G.ports.forEach(q => { g.beginPath(); g.arc(q[0], q[1], Math.max(2.5, a * .07), 0, 7); g.fill(); });
  return G;
}
const def2 = s => OBJETS[s.k].fill;
const BEAU = new Set(["vanne", "valvesol"]);   /* objets iso au rendu soigné (essai du 9 nov. : la vanne; ajouter les autres si Jeremy aime) */
const TXFONTS = [["Sans","system-ui,'Segoe UI',Arial,sans-serif"],["Serif","Georgia,'Times New Roman',serif"],["Mono","ui-monospace,Consolas,'Courier New',monospace"],["Manuscrite","'Segoe Print','Comic Sans MS','Bradley Hand',cursive"],["Titre","Impact,'Arial Black',sans-serif"]];
const txFs = s => s.fs || (12 + s.w * 5);
const txFont = (s, px) => (s.i ? "italic " : "") + (s.b === false ? 400 : s.b === true ? 700 : 600) + " " + px + "px " + (s.f || TXFONTS[0][1]);
function habiller(g, txt, maxW){
  const out = [];
  String(txt).split("\n").forEach(par => {
    let ln = "";
    par.split(" ").forEach(w => {
      const t = ln ? ln + " " + w : w;
      if (ln && g.measureText(t).width > maxW){ out.push(ln); ln = w; } else ln = t;
      while (maxW > 0 && ln.length > 1 && g.measureText(ln).width > maxW){       /* un mot plus long que la case : on le coupe (comme dans la case de saisie) */
        let i = ln.length - 1; while (i > 1 && g.measureText(ln.slice(0, i)).width > maxW) i--;
        out.push(ln.slice(0, i)); ln = ln.slice(i); }
    });
    out.push(ln);
  });
  return out;
}
function drawStroke(g, s, W, H, k){
  g.lineCap = "round"; g.lineJoin = "round";
  let col = s.c; if (s.hl){ const h = (s.hc || "#fff200").slice(1); col = "rgba(" + parseInt(h.slice(0,2),16) + "," + parseInt(h.slice(2,4),16) + "," + parseInt(h.slice(4,6),16) + ",.4)"; }
  if (!s.hl && s.c === "#24282c" && wbSombre()) col = "#f4f1ea";          /* le « noir » devient craie sur un tableau foncé */
  const coulPot = pt => pt === "h" ? "#e03131" : pt === "n" ? "#1c7ed6" : "#a3aab3";
  if (RD.sim && s.fil){ const pt = SIM.pot.get(s);
    if (Array.isArray(pt)){ const a = [s.p[0][0] * W, s.p[0][1] * H], b = [s.p[1][0] * W, s.p[1][1] * H], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      g.lineCap = "round"; g.lineWidth = s.w * k; [[a, pt[0]], [b, pt[1]]].forEach(([e, v]) => { g.strokeStyle = coulPot(v); g.beginPath(); g.moveTo(e[0], e[1]); g.lineTo(m[0], m[1]); g.stroke(); }); return; }
    col = coulPot(pt); }   /* animation : rouge = L1, bleu = L2 */
  g.strokeStyle = col; g.lineWidth = (s.hl ? s.w * 4 : s.w) * k;
  if (s.t === "objet"){ const colO = (!s.c || s.c === "#24282c") ? (wbSombre() ? "#f4f1ea" : "#3a424b") : s.c, G = dessinerObjet(g, s, W, H, k, colO);
    if (s.lb && !ELEC[s.k]){ const [ex, ey, al] = posEtiquette(s.lp || "bas", G.bbox, k, s.tz); etiquette(g, s.lb, ex, ey, k, colO, al, s.tz); }   /* nom d'un objet isométrique (double-clic) */ if (typeof SELO !== "undefined" && SELO.s === s){ g.save(); g.setLineDash([8 * k, 6 * k]); g.strokeStyle = "#6aa9ff"; g.lineWidth = 2 * k; g.strokeRect(G.bbox[0] - 6, G.bbox[1] - 6, G.bbox[2] - G.bbox[0] + 12, G.bbox[3] - G.bbox[1] + 12); g.restore(); } return; }
  if (s.t === "texte"){
    if (s.cache) return;
    const fs = txFs(s) * k, lh = s.lig ? (s.lh ? s.lh * H : 34 * 1.25 * k) : fs * 1.25; g.font = txFont(s, fs); g.fillStyle = s.hl ? "#24282c" : col; g.textBaseline = s.lig ? "alphabetic" : "top";
    habiller(g, s.txt, s.bw ? s.bw * W : 1e9).forEach((ln, i) => g.fillText(ln, s.p[0][0] * W, s.p[0][1] * H + (s.lig ? (i + 1) * lh - 3 * k : i * lh))); return;
  }
  g.beginPath();
  if (s.t && s.p.length >= 2){
    const x1 = s.p[0][0] * W, y1 = s.p[0][1] * H, x2 = s.p[s.p.length - 1][0] * W, y2 = s.p[s.p.length - 1][1] * H;
    if (s.t === "ligne" || s.t === "fleche"){
      g.moveTo(x1, y1); g.lineTo(x2, y2);
      if (s.t === "fleche"){
        const an = Math.atan2(y2 - y1, x2 - x1), L = Math.max(14 * k, g.lineWidth * 4);
        g.moveTo(x2 - L * Math.cos(an - .45), y2 - L * Math.sin(an - .45)); g.lineTo(x2, y2); g.lineTo(x2 - L * Math.cos(an + .45), y2 - L * Math.sin(an + .45));
      }
    } else if (s.t === "rect"){ g.rect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1)); }
    else if (s.t === "ellipse"){ g.ellipse((x1 + x2) / 2, (y1 + y2) / 2, Math.max(1, Math.abs(x2 - x1) / 2), Math.max(1, Math.abs(y2 - y1) / 2), 0, 0, Math.PI * 2); }
    const habillage = () => {     /* cadre de sélection et étiquette (double-clic), pour toutes les formes */
      if ((s.lbA || s.lbB) && /^(fleche|fleche2|ligne)$/.test(s.t)){ const L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L, tzz = s.tz || 1, m = 12 * k * tzz;   /* texte au départ et à la pointe */
        const bout = (txt, x, y, sg) => { const dx = ux * sg, dy = uy * sg; if (Math.abs(dx) >= Math.abs(dy) * .6) etiquette(g, txt, x + dx * m * .6, y + dy * m * .6, k, col, dx > 0 ? "left" : "right", tzz); else etiquette(g, txt, x + dx * m * 1.3, y + dy * m * 1.3, k, col, "center", tzz); };
        if (s.lbA) bout(s.lbA, x1, y1, -1); if (s.lbB) bout(s.lbB, x2, y2, 1); }
      if (RD.obj && typeof SELO !== "undefined" && SELO.s === s) cadreForme(g, s, W, H, k);
      if (s.lb && s.lp && /^(ligne|fleche|fleche2|tuy[A-Z]+)$/.test(s.t)){ const tz = s.tz || 1, m = 10 * k * tz + (s.w || 4) * k * .9, A = [x1, y1], B = [x2, y2];   /* l'écart suit l'épaisseur de la flèche */
        if (s.lp === "gauche" || s.lp === "droite"){ const E = (s.lp === "droite") === (B[0] >= A[0]) ? B : A, O = E === B ? A : B, L = Math.hypot(E[0] - O[0], E[1] - O[1]) || 1, ux = (E[0] - O[0]) / L, uy = (E[1] - O[1]) / L;
          const al = Math.abs(ux) < .35 ? "center" : ux > 0 ? "left" : "right";   /* au bout de la flèche, dans son prolongement */
          etiquette(g, s.lb, E[0] + ux * m + (al === "center" ? 0 : 0), E[1] + uy * (al === "center" ? m * 1.4 : m * .6), k, col, al, tz); }
        else { const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, an = Math.atan2(y2 - y1, x2 - x1); let nx = Math.sin(an), ny = -Math.cos(an); if (ny > 0){ nx = -nx; ny = -ny; }
          const sg = s.lp === "bas" ? -1 : s.lp === "centre" ? 0 : 1; etiquette(g, s.lb, mx + nx * 16 * k * tz * sg, my + ny * 16 * k * tz * sg, k, col, "center", tz); } }
      else if (s.lb && !VALEURS_FORME[s.t] && s.lp){ const [ex, ey, al] = posEtiquette(s.lp, cadrePx(s, W, H), k, s.tz); etiquette(g, s.lb, ex, ey, k, col, al, s.tz); }
      else if (s.lb && !VALEURS_FORME[s.t]){ const ligneT = /^(ligne|fleche|fleche2|tuy[A-Z]+)$/.test(s.t), an = Math.atan2(y2 - y1, x2 - x1); let nx = Math.sin(an), ny = -Math.cos(an); if (ny > 0){ nx = -nx; ny = -ny; }   /* au-dessus d'une ligne, au centre d'une forme */
        etiquette(g, s.lb, (x1 + x2) / 2 + (ligneT ? nx * 16 * k * (s.tz || 1) : 0), (y1 + y2) / 2 + (ligneT ? ny * 16 * k * (s.tz || 1) : 0), k, col, "center", s.tz); } };
    if (FORMES[s.t] && !/^(ligne|fleche|rect|ellipse)$/.test(s.t)){ g.stroke(); dessinerForme(g, s, x1, y1, x2, y2, k, col); habillage(); return; }
    g.stroke(); if (FORMES[s.t]) habillage(); return;
  }
  { const P = s.p, n = P.length; g.moveTo(P[0][0] * W, P[0][1] * H);                     /* trait libre lissé : courbe qui passe par le milieu de chaque petit bout */
    if (n < 3 || s.iso) P.slice(1).forEach(q => g.lineTo(q[0] * W, q[1] * H));
    else { for (let i = 1; i < n - 1; i++){ const mx = (P[i][0] + P[i + 1][0]) / 2 * W, my = (P[i][1] + P[i + 1][1]) / 2 * H; g.quadraticCurveTo(P[i][0] * W, P[i][1] * H, mx, my); } g.lineTo(P[n - 1][0] * W, P[n - 1][1] * H); } }
  if (s.p.length === 1) g.lineTo(s.p[0][0] * W + .01, s.p[0][1] * H);
  g.stroke();
}
/* ---- Formes pour l'enseignement (onglet « Formes » de la palette) : on les trace en glissant du point A au point B ---- */
const FORMES = {
  ligne:{ n:"Ligne" }, fleche:{ n:"Flèche" }, fleche2:{ n:"Double flèche" }, cote:{ n:"Cote (mesure)" },
  rect:{ n:"Rectangle" }, ellipse:{ n:"Ellipse" }, cercle:{ n:"Cercle (rayon)" }, triangle:{ n:"Triangle" },
  triangleR:{ n:"Triangle rectangle" }, losange:{ n:"Losange" }, hexagone:{ n:"Hexagone" }, angle:{ n:"Angle (degrés)" },
  axes:{ n:"Axes x – y" }, cube:{ n:"Prisme (cube)" }, cylindre:{ n:"Cylindre" }, accolade:{ n:"Accolade" },
  nuage:{ n:"Nuage de révision" }, bulle:{ n:"Bulle numérotée" }, crochet:{ n:"Crochet (bon)" }, croix:{ n:"Croix (erreur)" },
  /* plomberie en coupe (pl:1 = section « Plomberie » de la palette) */
  maison:{ n:"Maison en coupe", pl:1 }, tuyEF:{ n:"Eau froide (EF)", pl:1 }, tuyEC:{ n:"Eau chaude (EC)", pl:1 }, tuyDR:{ n:"Drain (renvoi)", pl:1 }, tuyEV:{ n:"Évent", pl:1 }, tuyGZ:{ n:"Gaz", pl:1 },
  plCE:{ n:"Chauffe-eau", pl:1 }, plCF:{ n:"Collecteur EF", pl:1 }, plCC:{ n:"Collecteur EC", pl:1 }, plCompteur:{ n:"Compteur d'eau", pl:1 }, plVanne:{ n:"Robinet d'arrêt", pl:1 }, plClapet:{ n:"Clapet antiretour", pl:1 },
  plTe:{ n:"Té", pl:1 }, plCoude:{ n:"Coude 90°", pl:1 }, plSiphon:{ n:"Siphon en P", pl:1 }, plAvaloir:{ n:"Avaloir de sol", pl:1 },
  plLav:{ n:"Lavabo", pl:1 }, plWC:{ n:"Toilette", pl:1 }, plBain:{ n:"Baignoire", pl:1 }, plEvier:{ n:"Évier", pl:1 }, plLaveuse:{ n:"Laveuse", pl:1 }
};
/* taille d'un simple clic (px à 100 %), centrée sur le clic */
const FORMES_TAILLE = { maison:[960, 720], plCE:[64, 120], plCF:[150, 56], plCC:[150, 56], plCompteur:[56, 40], plVanne:[56, 36], plClapet:[56, 36], plTe:[44, 36], plCoude:[40, 40], plSiphon:[60, 50], plAvaloir:[50, 34],
  plLav:[80, 90], plWC:[84, 96], plBain:[190, 70], plEvier:[130, 90], plLaveuse:[84, 96] };
const COUL_TUY = { tuyEF:"#1c7ed6", tuyEC:"#e03131", tuyDR:"#2f9e44", tuyEV:"#2f9e44", tuyGZ:"#d9a400" };
/* dessin des éléments de plomberie, dans la boîte [xa, ya, xb, yb] */
/* géométrie commune de la maison en coupe (dessin et raccords) */
function geoMaison(xa, ya, w, h){ const tw = w * .03, yb = ya + h;
  return { tw, roofT:ya, roofB:ya + h * .045, yEt:ya + h * .36, yRdc:ya + h * .64, ySol:ya + h * .70, slabT:yb - h * .035, fT:h * .025, yb,
    eau:[xa + tw, ya + h * .70 + (h * .265) * .35], egout:[xa + w - tw, yb - h * .07], event:[xa + w * .72, ya + h * .045] }; }
function dessinerMaison(g, xa, ya, w, h, k){
  const G = geoMaison(xa, ya, w, h), xb = xa + w, yb = ya + h, { tw, fT } = G, L = "#4a4f55";
  const R = (x, y, ww, hh, fill) => { g.beginPath(); g.rect(x, y, ww, hh); if (fill){ g.fillStyle = fill; g.fill(); } g.strokeStyle = L; g.lineWidth = Math.max(1, 1.2 * k); g.stroke(); };
  const pts = (x, y, ww, hh, n, c2) => { g.fillStyle = c2; for (let i = 0; i < n; i++){ const fx = (Math.sin(i * 12.9898) * 43758.5453) % 1, fy = (Math.sin(i * 78.233) * 12345.678) % 1; g.fillRect(x + Math.abs(fx) * ww, y + Math.abs(fy) * hh, 1.6 * k, 1.6 * k); } };
  const tx = (txt, x, y, taille, c2, al) => { g.save(); g.fillStyle = c2; g.font = "700 " + Math.round(taille) + "px system-ui, sans-serif"; g.textAlign = al || "center"; g.textBaseline = "middle"; g.fillText(txt, x, y); g.restore(); };
  /* terrain : terre, gazon */
  const ext = w * .16;
  [[xa - ext, ext], [xb, ext]].forEach(([x, ww]) => { g.fillStyle = "rgba(176,132,84,.38)"; g.fillRect(x, G.ySol, ww, yb - G.ySol); pts(x, G.ySol + 4 * k, ww, yb - G.ySol - 6 * k, 60, "rgba(110,78,44,.55)"); });
  g.save(); g.strokeStyle = "#3f9b45"; g.lineWidth = 3 * k; g.beginPath(); g.moveTo(xa - ext, G.ySol); g.lineTo(xa, G.ySol); g.moveTo(xb, G.ySol); g.lineTo(xb + ext, G.ySol); g.stroke();
  for (let x = xa - ext + 3 * k; x < xa - 2 * k; x += 7 * k){ g.beginPath(); g.moveTo(x, G.ySol); g.lineTo(x + 2 * k, G.ySol - 5 * k); g.stroke(); }
  for (let x = xb + 3 * k; x < xb + ext - 2 * k; x += 7 * k){ g.beginPath(); g.moveTo(x, G.ySol); g.lineTo(x + 2 * k, G.ySol - 5 * k); g.stroke(); } g.restore();
  /* intérieur clair */
  g.fillStyle = "rgba(255,252,245,.85)"; g.fillRect(xa + tw, G.roofB, w - 2 * tw, G.slabT - G.roofB);
  /* fondation : semelles, dalle, murs de béton */
  const beton = "#cfd2d6";
  R(xa - tw, yb - h * .06, tw * 3, h * .06, beton); R(xb - tw * 2, yb - h * .06, tw * 3, h * .06, beton);
  R(xa, G.slabT, w, yb - G.slabT, beton); pts(xa, G.slabT, w, yb - G.slabT, 80, "#8d939a");
  R(xa, G.yRdc, tw, G.slabT - G.yRdc, beton); R(xb - tw, G.yRdc, tw, G.slabT - G.yRdc, beton);
  pts(xa, G.yRdc, tw, G.slabT - G.yRdc, 25, "#8d939a"); pts(xb - tw, G.yRdc, tw, G.slabT - G.yRdc, 25, "#8d939a");
  /* murs à ossature (isolant rose) */
  [[xa], [xb - tw]].forEach(([x]) => { R(x, G.roofB, tw, G.yRdc - G.roofB, "#efdcbc");
    g.save(); g.strokeStyle = "#e58fa6"; g.lineWidth = Math.max(1, 1.1 * k); g.beginPath(); const z = tw * .32;
    for (let y = G.roofB + 2 * k, i = 0; y < G.yRdc - 2 * k; y += 5 * k, i++) g.lineTo(x + tw / 2 + (i % 2 ? z : -z), y); g.stroke(); g.restore(); });
  /* planchers (solives) */
  [G.yEt, G.yRdc].forEach(y => { R(xa + tw, y, w - 2 * tw, fT, "#ddb98a"); g.save(); g.strokeStyle = "rgba(120,80,40,.6)"; g.lineWidth = Math.max(1, k); g.beginPath();
    for (let x = xa + tw + w * .03; x < xb - tw; x += w * .04){ g.moveTo(x, y + 1.5 * k); g.lineTo(x, y + fT - 1.5 * k); } g.stroke(); g.restore(); });
  /* toit plat : isolant et membrane */
  R(xa - tw * .6, G.roofT, w + tw * 1.2, G.roofB - G.roofT, "#a7b0ba"); g.save(); g.strokeStyle = "#2f3337"; g.lineWidth = 2.5 * k; g.beginPath(); g.moveTo(xa - tw * .6, G.roofT); g.lineTo(xb + tw * .6, G.roofT); g.stroke(); g.restore();
  /* fenêtres */
  const vitre = (x, y, hh) => { R(x, y, tw, hh, "#bfe3f7"); g.save(); g.strokeStyle = "#7fb6d6"; g.lineWidth = Math.max(1, k); g.beginPath(); g.moveTo(x + tw / 2, y + 2 * k); g.lineTo(x + tw / 2, y + hh - 2 * k); g.stroke(); g.restore(); };
  [[G.roofB, G.yEt], [G.yEt + fT, G.yRdc]].forEach(([y0, y1]) => { const hh = (y1 - y0) * .38, y = y0 + (y1 - y0) * .28; vitre(xa, y, hh); vitre(xb - tw, y, hh); });
  vitre(xa, G.yRdc + fT + 2 * k, G.ySol - G.yRdc - fT - 4 * k);
  /* escaliers */
  const esc = (x0, y0, x1, y1) => { const n = 9, dx = (x1 - x0) / n, dy = (y1 - y0) / n; g.save(); g.strokeStyle = "#8a8f96"; g.lineWidth = Math.max(1, 1.2 * k); g.beginPath(); g.moveTo(x0, y0);
    for (let i = 0; i < n; i++){ g.lineTo(x0 + dx * i, y0 + dy * (i + 1)); g.lineTo(x0 + dx * (i + 1), y0 + dy * (i + 1)); } g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); g.restore(); };
  esc(xa + w * .1, G.slabT, xa + w * .3, G.yRdc); esc(xa + w * .1, G.yRdc, xa + w * .3, G.yEt);
  /* niveaux */
  [["Étage", G.roofB], ["Rez-de-chaussée", G.yEt + fT], ["Sous-sol", G.yRdc + fT]].forEach(([n, y]) => tx(n, xb - tw - 8 * k, y + 13 * k, 12 * k, "#5b6168", "right"));
  /* services : entrée d'eau (aqueduc), égout, évent sur le toit */
  g.save(); g.lineCap = "round";
  g.strokeStyle = COUL_TUY.tuyEF; g.lineWidth = 4.5 * k; g.beginPath(); g.moveTo(xa - ext * .85, G.eau[1]); g.lineTo(G.eau[0], G.eau[1]); g.stroke();
  g.strokeStyle = COUL_TUY.tuyDR; g.lineWidth = 7 * k; g.beginPath(); g.moveTo(G.egout[0], G.egout[1]); g.lineTo(xb + ext * .85, G.egout[1]); g.stroke();
  g.lineWidth = 4 * k; g.setLineDash([8 * k, 5 * k]); g.beginPath(); g.moveTo(G.event[0], G.roofT); g.lineTo(G.event[0], G.roofT - h * .05); g.stroke(); g.restore();
  tx("Aqueduc", xa - ext * .5, G.eau[1] - 11 * k, 11 * k, COUL_TUY.tuyEF); tx("Égout", xb + ext * .5, G.egout[1] - 12 * k, 11 * k, COUL_TUY.tuyDR); tx("Évent", G.event[0] + 26 * k, G.roofT - h * .03, 10 * k, COUL_TUY.tuyDR);
}
/* raccords des appareils : [type, fx, fy] dans la boîte (EF, EC, DR = drain, EV = évent, * = tous) */
const PORTS_PL = {
  plCE:[["EF", .3, 0], ["EC", .7, 0]], plCF:[["EF", 0, .32], ["EF", .25, 1], ["EF", .45, 1], ["EF", .65, 1], ["EF", .85, 1]], plCC:[["EC", 0, .32], ["EC", .25, 1], ["EC", .45, 1], ["EC", .65, 1], ["EC", .85, 1]],
  plCompteur:[["*", 0, .5], ["*", 1, .5]], plVanne:[["*", 0, .65], ["*", 1, .65]], plClapet:[["*", 0, .5], ["*", 1, .5]], plTe:[["*", 0, .3], ["*", 1, .3], ["*", .5, 1]], plCoude:[["*", 0, .3], ["*", .5, 1]],
  plSiphon:[["DR", .22, 0], ["DR", 1, .38]], plAvaloir:[["DR", .5, 1]],
  plLav:[["EF", .38, .66], ["EC", .62, .66], ["DR", .5, 1]], plWC:[["EF", 1, .3], ["DR", .6, 1]], plBain:[["EF", 0, .38], ["EC", 0, .55], ["DR", .14, 1]],
  plEvier:[["EF", .3, 1], ["EC", .7, 1], ["DR", .5, 1]], plLaveuse:[["EF", .25, 0], ["EC", .45, 0], ["DR", .8, 0]], maison:[] };
/* taille réelle (m) des appareils posés dans une maison en coupe; SOL_PL = posé sur le plancher */
const DIM_PL = { plLav:[.55, .9], plWC:[.7, .8], plBain:[1.5, .6], plEvier:[.9, 1.15], plLaveuse:[.7, .95], plCE:[.56, 1.5], plCF:[.6, .3], plCC:[.6, .3], plCompteur:[.3, .2], plVanne:[.25, .18], plClapet:[.25, .18], plTe:[.2, .15], plCoude:[.18, .18], plSiphon:[.3, .28], plAvaloir:[.25, .17] };
const SOL_PL = /^(plLav|plWC|plBain|plEvier|plLaveuse|plCE|plAvaloir)$/;
function portsPlomb(s, W, H){ if (!PORTS_PL[s.t] || !s.p || s.p.length < 2) return [];
  const xa = Math.min(s.p[0][0], s.p[1][0]) * W, xb = Math.max(s.p[0][0], s.p[1][0]) * W, ya = Math.min(s.p[0][1], s.p[1][1]) * H, yb = Math.max(s.p[0][1], s.p[1][1]) * H;
  if (s.t === "maison"){ const G = geoMaison(xa, ya, xb - xa, yb - ya); return [{ ty:"EF", x:G.eau[0], y:G.eau[1] }, { ty:"DR", x:G.egout[0], y:G.egout[1] }, { ty:"EV", x:G.event[0], y:G.event[1] }]; }
  return PORTS_PL[s.t].map(([ty, fx, fy]) => ({ ty, x:xa + (xb - xa) * fx, y:ya + (yb - ya) * fy })); }
const portCompat = (pt, ty) => !ty || pt === "*" || pt === ty || (ty === "EV" && pt === "DR") || (ty === "DR" && pt === "EV");
/* points de raccord visibles quand l'onglet Plomberie est ouvert */
function dessinerPorts(g, s, k){ const c = $("#inkCanvas"), ty = RD.formeK && /^tuy/.test(RD.formeK) ? RD.formeK.slice(3) : null, CO = { EF:COUL_TUY.tuyEF, EC:COUL_TUY.tuyEC, DR:COUL_TUY.tuyDR, EV:COUL_TUY.tuyDR, "*":"#6b7280" };
  portsPlomb(s, c.width, c.height).forEach(pt => { const ok = ty && portCompat(pt.ty, ty), r = (ok ? 6 : 4) * k; g.save(); g.beginPath(); g.arc(pt.x, pt.y, r, 0, Math.PI * 2); g.fillStyle = "#fff"; g.fill(); g.lineWidth = (ok ? 3 : 2) * k; g.strokeStyle = CO[pt.ty]; g.stroke(); g.restore(); }); }
function dessinerPlomb(g, s, x1, y1, x2, y2, k, col){ dessinerPlomb0(g, s, x1, y1, x2, y2, k, col); if (RD.obj && RD.objTab === "plomb" && PORTS_PL[s.t] && g.canvas === $("#inkCanvas")) dessinerPorts(g, s, k); }
function dessinerPlomb0(g, s, x1, y1, x2, y2, k, col){
  const t = s.t, xa = Math.min(x1, x2), xb = Math.max(x1, x2), ya = Math.min(y1, y2), yb = Math.max(y1, y2), w = xb - xa, h = yb - ya, lw0 = g.lineWidth;
  const tx = (txt, x, y, taille, c2, al) => { g.save(); g.fillStyle = c2 || col; g.font = "700 " + Math.round(taille) + "px system-ui, sans-serif"; g.textAlign = al || "center"; g.textBaseline = "middle"; g.fillText(txt, x, y); g.restore(); };
  g.save(); g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = col;
  if (COUL_TUY[t]){
    const cc = COUL_TUY[t]; g.strokeStyle = cc; g.lineWidth = Math.max(lw0, (t === "tuyDR" ? 7 : t === "tuyEV" ? 4 : 4.5) * k);
    if (t === "tuyEV") g.setLineDash([10 * k, 7 * k]); if (t === "tuyGZ") g.setLineDash([16 * k, 5 * k, 3 * k, 5 * k]);
    g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); g.setLineDash([]);
    const L = Math.hypot(x2 - x1, y2 - y1);
    if (!s.lb && L > 80 * k){ const an = Math.atan2(y2 - y1, x2 - x1); let nx = Math.sin(an), ny = -Math.cos(an); if (ny > 0){ nx = -nx; ny = -ny; }
      tx({ tuyEF:"EF", tuyEC:"EC", tuyDR:"D", tuyEV:"É", tuyGZ:"G" }[t], (x1 + x2) / 2 + nx * 13 * k, (y1 + y2) / 2 + ny * 13 * k, 11 * k, cc); }
    g.restore(); return; }
  g.lineWidth = Math.max(1.4 * k, lw0 * .55);
  const R = (x, y, ww, hh, f) => { g.beginPath(); g.rect(x, y, ww, hh); if (f){ g.save(); g.globalAlpha = f; g.fillStyle = col; g.fill(); g.restore(); } g.stroke(); };
  const Ln = (...pts) => { g.beginPath(); g.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]); g.stroke(); };
  const tuyau = (c2, ...pts) => { g.save(); g.strokeStyle = c2; g.lineWidth = Math.max(2.5 * k, lw0 * .8); Ln(...pts); g.restore(); };
  const vanne = (x, y, r, vert) => { g.beginPath(); if (vert){ g.moveTo(x - r, y - r); g.lineTo(x + r, y + r); g.lineTo(x - r, y + r); g.lineTo(x + r, y - r); } else { g.moveTo(x - r, y - r); g.lineTo(x + r, y + r); g.lineTo(x + r, y - r); g.lineTo(x - r, y + r); } g.closePath(); g.save(); g.fillStyle = "#fff"; g.fill(); g.restore(); g.stroke(); };
  const xm = xa + w / 2, ym = ya + h / 2;
  if (t === "maison"){ dessinerMaison(g, xa, ya, w, h, k); g.restore(); return; }
  if (t === "plCE"){ const r0 = Math.min(w * .2, 12 * k); g.beginPath(); g.roundRect ? g.roundRect(xa + w * .1, ya + h * .14, w * .8, h * .86, r0) : g.rect(xa + w * .1, ya + h * .14, w * .8, h * .86); g.stroke();
    tuyau(COUL_TUY.tuyEF, xa + w * .3, ya + h * .14, xa + w * .3, ya); tuyau(COUL_TUY.tuyEC, xa + w * .7, ya + h * .14, xa + w * .7, ya); tx("CE", xm, ya + h * .5, Math.min(w * .32, 16 * k)); }
  else if (t === "plCF" || t === "plCC"){ const cc = t === "plCF" ? COUL_TUY.tuyEF : COUL_TUY.tuyEC, yb0 = ya + h * .32;
    g.save(); g.strokeStyle = cc; g.lineWidth = Math.max(5 * k, lw0); Ln(xa, yb0, xb - w * .04, yb0); g.restore();
    [.25, .45, .65, .85].forEach(f => { tuyau(cc, xa + w * f, yb0, xa + w * f, yb); vanne(xa + w * f, ya + h * .68, Math.min(5 * k, w * .04), true); });
    tx(t === "plCF" ? "EF" : "EC", xa + w * .08, ya + h * .08, 11 * k, cc); }
  else if (t === "plCompteur"){ tuyau(COUL_TUY.tuyEF, xa, ym, xb, ym); g.beginPath(); g.arc(xm, ym, Math.min(w, h) * .38, 0, Math.PI * 2); g.save(); g.fillStyle = "#fff"; g.fill(); g.restore(); g.stroke(); tx("C", xm, ym, Math.min(w, h) * .4); }
  else if (t === "plVanne"){ Ln(xa, ym + h * .15, xb, ym + h * .15); vanne(xm, ym + h * .15, Math.min(w * .2, h * .3)); Ln(xm, ym + h * .15, xm, ya + h * .08); Ln(xm - w * .18, ya + h * .08, xm + w * .18, ya + h * .08); }
  else if (t === "plClapet"){ Ln(xa, ym, xb, ym); const r0 = Math.min(w * .2, h * .35); g.beginPath(); g.moveTo(xm - r0, ym - r0); g.lineTo(xm + r0, ym); g.lineTo(xm - r0, ym + r0); g.closePath(); g.save(); g.fillStyle = col; g.fill(); g.restore(); g.stroke(); Ln(xm + r0, ym - r0, xm + r0, ym + r0); }
  else if (t === "plTe"){ g.lineWidth = Math.max(3 * k, lw0 * .8); Ln(xa, ya + h * .3, xb, ya + h * .3); Ln(xm, ya + h * .3, xm, yb); }
  else if (t === "plCoude"){ g.lineWidth = Math.max(3 * k, lw0 * .8); g.beginPath(); g.moveTo(xa, ya + h * .3); g.arcTo(xm, ya + h * .3, xm, yb, Math.min(w, h) * .3); g.lineTo(xm, yb); g.stroke(); }
  else if (t === "plSiphon"){ g.save(); g.strokeStyle = COUL_TUY.tuyDR; g.lineWidth = Math.max(4 * k, lw0); const r0 = w * .17, xg = xa + w * .22, xd = xg + 2 * r0, yu = ya + h * .62;
    g.beginPath(); g.moveTo(xg, ya); g.lineTo(xg, yu); g.arc(xg + r0, yu, r0, Math.PI, 0, true); g.lineTo(xd, ya + h * .38); g.lineTo(xb, ya + h * .38); g.stroke(); g.restore(); }
  else if (t === "plAvaloir"){ R(xa, ya, w, h * .35); for (let i = 1; i < 6; i++) Ln(xa + w * i / 6, ya, xa + w * i / 6, ya + h * .35); tuyau(COUL_TUY.tuyDR, xm, ya + h * .35, xm, yb); }
  else if (t === "plLav"){ g.beginPath(); g.moveTo(xa, ya + h * .3); g.lineTo(xb, ya + h * .3); g.quadraticCurveTo(xb - w * .05, ya + h * .58, xm + w * .1, ya + h * .58); g.lineTo(xm - w * .1, ya + h * .58); g.quadraticCurveTo(xa + w * .05, ya + h * .58, xa, ya + h * .3); g.stroke();
    R(xm - w * .1, ya + h * .58, w * .2, h * .42); Ln(xm + w * .22, ya + h * .3, xm + w * .22, ya + h * .08, xm + w * .02, ya + h * .08, xm + w * .02, ya + h * .16); }
  else if (t === "plWC"){ R(xa + w * .58, ya, w * .42, h * .42); g.beginPath(); g.moveTo(xb, ya + h * .48); g.lineTo(xa, ya + h * .48); g.quadraticCurveTo(xa + w * .05, ya + h * .78, xa + w * .4, ya + h * .8); g.lineTo(xa + w * .38, yb); g.lineTo(xb - w * .05, yb); g.lineTo(xb - w * .05, ya + h * .48); g.stroke(); }
  else if (t === "plBain"){ g.beginPath(); g.moveTo(xa, ya + h * .3); g.lineTo(xb, ya + h * .3); g.lineTo(xb - w * .04, yb); g.lineTo(xa + w * .04, yb); g.closePath(); g.stroke(); Ln(xa + w * .05, ya + h * .45, xb - w * .05, ya + h * .45);
    Ln(xa + w * .06, ya + h * .3, xa + w * .06, ya + h * .05, xa + w * .14, ya + h * .05, xa + w * .14, ya + h * .14); }
  else if (t === "plEvier"){ R(xa, ya + h * .3, w, h * .7); Ln(xa - w * .03, ya + h * .3, xb + w * .03, ya + h * .3); g.save(); g.setLineDash([5 * k, 4 * k]); R(xa + w * .25, ya + h * .3, w * .5, h * .28); g.restore();
    Ln(xm + w * .08, ya + h * .3, xm + w * .08, ya + h * .04, xm - w * .06, ya + h * .04, xm - w * .06, ya + h * .12); Ln(xm, ya + h * .62, xm, yb); }
  else if (t === "plLaveuse"){ R(xa, ya, w, h); Ln(xa, ya + h * .16, xb, ya + h * .16); g.beginPath(); g.arc(xm, ya + h * .58, Math.min(w, h) * .3, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(xa + w * .2, ya + h * .08, 2.5 * k, 0, Math.PI * 2); g.stroke(); }
  g.restore(); }
const FORMES_CLIC = { bulle:.009, crochet:.012, croix:.012, cercle:.025 };   /* un simple clic pose la forme à une taille par défaut */
function dessinerForme(g, s, x1, y1, x2, y2, k, col){
  const t = s.t, lw = g.lineWidth, L = Math.max(12 * k, lw * 3.5), xa = Math.min(x1, x2), xb = Math.max(x1, x2), ya = Math.min(y1, y2), yb = Math.max(y1, y2), w = xb - xa, h = yb - ya;
  const tete = (fx, fy, tx, ty) => { const an = Math.atan2(ty - fy, tx - fx); g.moveTo(tx - L * Math.cos(an - .45), ty - L * Math.sin(an - .45)); g.lineTo(tx, ty); g.lineTo(tx - L * Math.cos(an + .45), ty - L * Math.sin(an + .45)); };
  const poly = pts => { g.moveTo(pts[0][0], pts[0][1]); pts.slice(1).forEach(q => g.lineTo(q[0], q[1])); g.closePath(); };
  const texte = (tx, x, y, taille, al) => { g.save(); g.fillStyle = col; g.font = "700 " + Math.round(taille) + "px system-ui, sans-serif"; g.textAlign = al || "center"; g.textBaseline = "middle"; g.fillText(tx, x, y); g.restore(); };
  g.beginPath();
  if (FORMES[t] && FORMES[t].pl){ dessinerPlomb(g, s, x1, y1, x2, y2, k, col); return; }
  if (t === "fleche2"){ g.moveTo(x1, y1); g.lineTo(x2, y2); tete(x1, y1, x2, y2); tete(x2, y2, x1, y1); }
  else if (t === "cote"){
    { const an0 = Math.atan2(y2 - y1, x2 - x1), off = (s.d || 0) * (g.canvas ? g.canvas.height : 0), DC = dirCote(s, an0), ox = DC[0] * off, oy = DC[1] * off;
      if (s.txt){ const tz = s.tz || 1; g.save(); g.fillStyle = col; g.font = "700 " + Math.round(16 * k * tz) + "px system-ui, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";   /* texte sur un côté (sans ligne de cote) */
        const tx = s.lb || "?", tw = g.measureText(tx).width, th = 16 * k * tz, sg = Math.sign(off) || 1, ux = DC[0] * sg, uy = DC[1] * sg, ext = Math.abs(ux) * tw / 2 + Math.abs(uy) * th / 2;   /* le texte ne touche jamais le côté */
        const ext2 = s.dt ? 0 : s.iso ? th * .7 : ext, txx = (x1 + x2) / 2 + ux * (Math.abs(off) + ext2), txy = (y1 + y2) / 2 + uy * (Math.abs(off) + ext2); g.lineJoin = "round"; g.lineWidth = 4 * k * tz; g.strokeStyle = wbSombre() ? "rgba(0,0,0,.55)" : "rgba(255,255,255,.9)";
        g.translate(txx, txy); if (s.iso){ let a3 = an0; if (a3 > Math.PI / 2 + .01) a3 -= Math.PI; if (a3 < -Math.PI / 2 + .01) a3 += Math.PI;   /* plan iso : le texte suit l'angle de la pièce (lettres droites, comme un dessin iso) */
          if (Math.abs(Math.cos(a3)) > .3) g.transform(Math.cos(a3), Math.sin(a3), 0, 1, 0, 0); else g.transform(0, -1, Math.cos(Math.PI / 6), -Math.sin(Math.PI / 6), 0, 0); }
        if (s.rot) g.rotate(s.rot * Math.PI / 180);   /* rotation choisie dans la case */
        g.strokeText(tx, 0, 0); g.fillText(tx, 0, 0); g.restore(); return; }
      if (Math.abs(off) > 2){ const sg = Math.sign(off), ux = DC[0] * sg, uy = DC[1] * sg, gap = 4 * k, dep = 8 * k;   /* lignes de rappel */
        g.save(); g.lineWidth = Math.max(1, lw * .5); g.beginPath();
        [[x1, y1], [x2, y2]].forEach(([x, y]) => { g.moveTo(x + ux * gap, y + uy * gap); g.lineTo(x + ox + ux * dep, y + oy + uy * dep); }); g.stroke(); g.restore(); g.beginPath(); }
      x1 += ox; y1 += oy; x2 += ox; y2 += oy; }
    const an = Math.atan2(y2 - y1, x2 - x1), DT = s.iso ? dirCote(s, an) : [-Math.sin(an), Math.cos(an)], nx = DT[0], ny = DT[1], e = 9 * k, Lc = Math.max(8 * k, lw * 2.4);   /* cote iso : traits d'extrémité sur l'axe de la grille */
    g.moveTo(x1, y1); g.lineTo(x2, y2);
    [[x1, y1], [x2, y2]].forEach(([x, y]) => { g.moveTo(x - nx * e * 1.4, y - ny * e * 1.4); g.lineTo(x + nx * e * 1.4, y + ny * e * 1.4); });
    const tt = (fx, fy, tx, ty) => { const a2 = Math.atan2(ty - fy, tx - fx); g.moveTo(tx - Lc * Math.cos(a2 - .35), ty - Lc * Math.sin(a2 - .35)); g.lineTo(tx, ty); g.lineTo(tx - Lc * Math.cos(a2 + .35), ty - Lc * Math.sin(a2 + .35)); };
    tt(x1, y1, x2, y2); tt(x2, y2, x1, y1);
    g.stroke(); if (s.lb || (RD.wb && /^(quad|iso|isopts)$/.test(wbBg()))){        /* valeur choisie (double-clic), sinon sur une grille : longueur en carreaux */
      const u = 34 * RD.z * DPRI() * (/^iso/.test(wbBg()) ? 1.2 : 1), n = Math.hypot(x2 - x1, y2 - y1) / u;   /* plan iso : un pas de la grille iso */
      const r = Math.round(n * 10) / 10, txt = s.lb || ((String(r).replace(".", ",")) + " carr.");
      g.save(); const sgL = s.d ? Math.sign(s.d) : 1, ec = 19 * k * Math.max(1, (s.tz || 1) * .85); g.translate((x1 + x2) / 2 + nx * ec * sgL, (y1 + y2) / 2 + ny * ec * sgL);   /* texte du côté extérieur */ let a3 = an; if (a3 > Math.PI / 2 || a3 < -Math.PI / 2) a3 += Math.PI; g.rotate(a3 + (s.rot || 0) * Math.PI / 180);
      g.fillStyle = col; g.font = "700 " + Math.round(13 * k * (s.tz || 1)) + "px system-ui, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 0, 0); g.restore(); }
    return; }
  else if (t === "cercle"){ const r = Math.max(2, Math.hypot(x2 - x1, y2 - y1)); g.arc(x1, y1, r, 0, Math.PI * 2); g.moveTo(x1 - 6 * k, y1); g.lineTo(x1 + 6 * k, y1); g.moveTo(x1, y1 - 6 * k); g.lineTo(x1, y1 + 6 * k); g.stroke();
    g.save(); g.setLineDash([6 * k, 5 * k]); g.lineWidth = Math.max(1, lw * .6); g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); g.restore();
    texte(s.lb || "r", (x1 + x2) / 2 - Math.sin(Math.atan2(y2 - y1, x2 - x1)) * 11 * k, (y1 + y2) / 2 + Math.cos(Math.atan2(y2 - y1, x2 - x1)) * 11 * k * (s.tz || 1), 14 * k * (s.tz || 1)); return; }
  else if (t === "triangle") poly([[xa + w / 2, ya], [xb, yb], [xa, yb]]);
  else if (t === "triangleR"){ poly([[xa, ya], [xa, yb], [xb, yb]]); const q = Math.min(w, h) * .14; g.moveTo(xa + q, yb); g.lineTo(xa + q, yb - q); g.lineTo(xa, yb - q); }
  else if (t === "losange") poly([[xa + w / 2, ya], [xb, ya + h / 2], [xa + w / 2, yb], [xa, ya + h / 2]]);
  else if (t === "hexagone"){ const pts = []; for (let i = 0; i < 6; i++){ const a = Math.PI / 3 * i; pts.push([xa + w / 2 + w / 2 * Math.cos(a), ya + h / 2 + h / 2 * Math.sin(a)]); } poly(pts); }
  else if (t === "angle"){
    const R = Math.hypot(x2 - x1, y2 - y1); if (R < 2) return;
    g.moveTo(x1, y1); g.lineTo(x1 + R, y1); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
    const a = Math.atan2(y2 - y1, x2 - x1), deg = Math.round(Math.abs(a) * 180 / Math.PI), r = Math.min(R * .32, 60 * k);
    g.beginPath(); g.arc(x1, y1, r, 0, a, a < 0); g.stroke();
    texte(s.lb ? s.lb : deg + "°", x1 + Math.cos(a / 2) * (r + 18 * k), y1 + Math.sin(a / 2) * (r + 18 * k * (s.tz || 1)), 15 * k * (s.tz || 1)); return; }
  else if (t === "axes"){
    g.moveTo(xa, yb); g.lineTo(xb, yb); tete(xa, yb, xb, yb); g.moveTo(xa, yb); g.lineTo(xa, ya); tete(xa, yb, xa, ya);
    const n = 10, tk = 5 * k; for (let i = 1; i < n; i++){ g.moveTo(xa + w * i / n, yb - tk); g.lineTo(xa + w * i / n, yb + tk); g.moveTo(xa - tk, yb - h * i / n); g.lineTo(xa + tk, yb - h * i / n); }
    g.stroke(); texte("x", xb + 12 * k, yb, 15 * k); texte("y", xa, ya - 13 * k, 15 * k); texte("0", xa - 10 * k, yb + 11 * k, 12 * k); return; }
  else if (t === "cube"){ const d = Math.min(w, h) * .32, fw = w - d, fh = h - d;
    g.rect(xa, ya + d, fw, fh); g.moveTo(xa, ya + d); g.lineTo(xa + d, ya); g.lineTo(xb, ya); g.lineTo(xb, ya + fh); g.lineTo(xa + fw, yb); g.moveTo(xa + fw, ya + d); g.lineTo(xb, ya); g.stroke();
    g.save(); g.setLineDash([6 * k, 5 * k]); g.lineWidth = Math.max(1, lw * .6); g.beginPath(); g.moveTo(xa + d, ya); g.lineTo(xa + d, ya + fh); g.lineTo(xb, ya + fh); g.moveTo(xa + d, ya + fh); g.lineTo(xa, yb); g.stroke(); g.restore(); return; }
  else if (t === "cylindre"){ const ry = Math.max(3, Math.min(h * .14, w * .3));
    g.ellipse(xa + w / 2, ya + ry, w / 2, ry, 0, 0, Math.PI * 2); g.moveTo(xa, ya + ry); g.lineTo(xa, yb - ry); g.moveTo(xb, ya + ry); g.lineTo(xb, yb - ry);
    g.moveTo(xb, yb - ry); g.ellipse(xa + w / 2, yb - ry, w / 2, ry, 0, 0, Math.PI); g.stroke();
    g.save(); g.setLineDash([6 * k, 5 * k]); g.lineWidth = Math.max(1, lw * .6); g.beginPath(); g.ellipse(xa + w / 2, yb - ry, w / 2, ry, 0, Math.PI, Math.PI * 2); g.stroke(); g.restore(); return; }
  else if (t === "accolade"){
    if (h >= w){ const xm = xa + w / 2, ym = ya + h / 2, b = Math.max(w / 2, 6 * k);
      g.moveTo(xm + b, ya); g.quadraticCurveTo(xm, ya, xm, ya + h * .1); g.lineTo(xm, ym - h * .08); g.quadraticCurveTo(xm, ym, xm - b, ym);
      g.quadraticCurveTo(xm, ym, xm, ym + h * .08); g.lineTo(xm, yb - h * .1); g.quadraticCurveTo(xm, yb, xm + b, yb); }
    else { const ym = ya + h / 2, xm = xa + w / 2, b = Math.max(h / 2, 6 * k);
      g.moveTo(xa, ym + b); g.quadraticCurveTo(xa, ym, xa + w * .1, ym); g.lineTo(xm - w * .08, ym); g.quadraticCurveTo(xm, ym, xm, ym - b);
      g.quadraticCurveTo(xm, ym, xm + w * .08, ym); g.lineTo(xb - w * .1, ym); g.quadraticCurveTo(xb, ym, xb, ym + b); } }
  else if (t === "nuage"){
    const r = Math.max(8 * k, Math.min(w, h) / 8), arcs = (ax, ay, bx, by) => { const Lg = Math.hypot(bx - ax, by - ay), n = Math.max(1, Math.round(Lg / (r * 1.6))), an = Math.atan2(by - ay, bx - ax);
      for (let i = 0; i < n; i++){ const cx = ax + (bx - ax) * (i + .5) / n, cy = ay + (by - ay) * (i + .5) / n, rr = Lg / n / 2; g.moveTo(cx - Math.cos(an) * rr, cy - Math.sin(an) * rr); g.arc(cx, cy, rr, an + Math.PI, an, false); } };
    arcs(xa, ya, xb, ya); arcs(xb, ya, xb, yb); arcs(xb, yb, xa, yb); arcs(xa, yb, xa, ya); }
  else if (t === "bulle"){ const r = Math.max(10 * k, Math.hypot(x2 - x1, y2 - y1)); g.arc(x1, y1, r, 0, Math.PI * 2); g.stroke(); const tb = String(s.lb || s.n || 1); texte(tb, x1, y1 + r * .04, r * 1.05 / Math.max(1, tb.length * .6)); return; }
  else if (t === "crochet"){ g.save(); g.lineWidth = lw * 1.6; g.strokeStyle = s.c === col && !s.hl ? "#2f9e44" : col; g.beginPath(); g.moveTo(xa, ya + h * .55); g.lineTo(xa + w * .38, yb); g.lineTo(xb, ya); g.stroke(); g.restore(); return; }
  else if (t === "croix"){ g.save(); g.lineWidth = lw * 1.6; g.strokeStyle = s.c === col && !s.hl ? "#e03131" : col; g.beginPath(); g.moveTo(xa, ya); g.lineTo(xb, yb); g.moveTo(xb, ya); g.lineTo(xa, yb); g.stroke(); g.restore(); return; }
  g.stroke();
}
/* La grille isométrique est dessinée ici, avec exactement les mêmes calculs que les objets et le crayon : plus aucun décalage après un zoom */
function grilleIso(g, W, H, k){
  const a = 34 * k * 1.2, d = a * .8660254, sl = (a / 2) / d, dpr = DPRI();
  g.save(); g.lineWidth = Math.max(1, dpr); g.strokeStyle = "#b4c6e0";
  if (wbBg() === "quad"){                                    /* quadrillé : un carreau = une unité des symboles électriques */
    const u = 34 * k; g.strokeStyle = "#cfd8e6"; g.beginPath();
    for (let x = 0; x <= W; x += u){ const xx = Math.round(x) + .5; g.moveTo(xx, 0); g.lineTo(xx, H); }
    for (let y = 0; y <= H; y += u){ const yy = Math.round(y) + .5; g.moveTo(0, yy); g.lineTo(W, yy); } g.stroke();
  } else if (wbBg() === "lignes"){                                  /* feuille lignée : une ligne tous les 42,5 px, pour écrire dessus */
    const h = 34 * 1.25 * k; g.strokeStyle = "#aec3e3"; g.beginPath();
    for (let y = h; y < H + h; y += h){ g.moveTo(0, y); g.lineTo(W, y); } g.stroke();
  } else if (wbBg() === "iso"){
    g.beginPath();
    for (let x = 0; x <= W + d; x += d){ g.moveTo(x, 0); g.lineTo(x, H); }
    const j0 = Math.floor(-sl * W / a) - 1, j1 = Math.ceil((H + sl * W) / a) + 1;
    for (let j = j0; j <= j1; j++){ const y = j * a; g.moveTo(0, y); g.lineTo(W, y + sl * W); g.moveTo(0, y); g.lineTo(W, y - sl * W); }
    g.stroke();
  } else {
    g.fillStyle = "#7f97bd"; const r = Math.max(1.6, a * .05); g.beginPath();
    for (let i = 0; i * d <= W + d; i++) for (let j = 0; j * a <= H + a; j++){ const x = i * d, y = (j + (i & 1 ? .5 : 0)) * a; g.moveTo(x + r, y); g.arc(x, y, r, 0, 7); }
    g.fill();
  }
  g.restore();
}
function redrawInk(){
  try { recalerWb(); } catch(e){}
  const c = $("#inkCanvas"), g = c.getContext("2d");
  g.clearRect(0, 0, c.width, c.height);
  const k = DPRI() * RD.z;
  if (RD.wb){ try { const bc = getComputedStyle($("#wbBoard")).backgroundColor;   /* 16 nov. : la toile peint aussi le fond (le TNI montrait du noir sous la toile une fois zoomé) */
    const f0 = wbBg(), W0 = c.width, H0 = c.height;
    if (f0 === "noir" || f0 === "vert"){ const gr = g.createRadialGradient(W0 / 2, H0 * .4, 10, W0 / 2, H0 * .4, Math.max(W0, H0) * .75); gr.addColorStop(0, f0 === "noir" ? "#2b3133" : "#2e6b52"); gr.addColorStop(1, f0 === "noir" ? "#1a1f21" : "#1d4a38"); g.fillStyle = gr; g.fillRect(0, 0, W0, H0); }
    else if (bc && !/rgba\(0, 0, 0, 0\)|transparent/.test(bc)){ g.fillStyle = bc; g.fillRect(0, 0, W0, H0); }
    if (wbBg() === "lignes"){ g.fillStyle = "#e8a0a0"; g.fillRect(34 * 2.4 * k, 0, 2 * k, c.height); } } catch(e){} }
  if (RD.wb && (/^iso/.test(wbBg()) || wbBg() === "lignes" || wbBg() === "quad")) grilleIso(g, c.width, c.height, k);
  const tous = INKS[inkKey()] || [];                                       /* les objets cachent les traits qui passent derrière ; les textes restent par-dessus */
  [s => s.t !== "objet" && s.t !== "texte" && s.t !== "cote", s => s.t === "objet", s => s.t === "cote", s => s.t === "texte"].forEach((f, i) => { tous.filter(f).forEach(s => drawStroke(g, s, c.width, c.height, k));
    });
  if (window.SELM && SELM.length){ g.save(); g.setLineDash([6 * k, 4 * k]); g.lineWidth = 1.6 * k; g.strokeStyle = "#2a7bcf";
    let T = null; SELM.forEach(o => { if (!strokes().includes(o)) return; const b = boiteDe(o, c.width, c.height); if (!b) return;
      T = T ? [Math.min(T[0], b[0]), Math.min(T[1], b[1]), Math.max(T[2], b[2]), Math.max(T[3], b[3])] : b.slice();
      if (o.t === "objet" || (o.t && FORMES[o.t] && !/^(ligne|fleche|fleche2|tuy[A-Z]+)$/.test(o.t))){ g.strokeRect(b[0] - 5 * k, b[1] - 5 * k, b[2] - b[0] + 10 * k, b[3] - b[1] + 10 * k); return; }
      g.save(); g.setLineDash([]); g.strokeStyle = "rgba(42,123,207,.35)"; g.lineCap = "round"; g.lineJoin = "round"; g.lineWidth = ((o.w || 3) + 9) * k; g.beginPath();   /* trait choisi : surligné en bleu */
      o.p.forEach((q, i) => i ? g.lineTo(q[0] * c.width, q[1] * c.height) : g.moveTo(q[0] * c.width, q[1] * c.height)); g.stroke(); g.restore(); });
    if (T && SELM.length > 1){ g.lineWidth = 1.4 * k; g.strokeRect(T[0] - 10 * k, T[1] - 10 * k, T[2] - T[0] + 20 * k, T[3] - T[1] + 20 * k); }   /* un seul cadre autour du groupe */
    g.restore(); }
  if (window.APERCU){ g.save(); g.globalAlpha = .55; drawStroke(g, window.APERCU, c.width, c.height, k); g.restore(); }      /* aperçu pendant le glisser-déposer */
  if (typeof majSelTxt === "function") majSelTxt();
  try { if (!window.APERCU) planifierSauvegarde(); } catch(e){}
}
function strokes(){ return INKS[inkKey()] || (INKS[inkKey()] = []); }
const REDO = {}, UNDO = {};
/* Historique par instantanés : chaque action (trait, texte, gomme, effacer tout) peut être annulée puis rétablie */
const clonerInk = a => a.map(s => s.t ? Object.assign({}, s, { p:s.p.map(q => q.slice()) }) : s);   /* les textes se modifient sur place : on en garde une copie */
function snapInk(key){ key = key || inkKey(); const u = (UNDO[key] = UNDO[key] || []); u.push(clonerInk(INKS[key] || [])); if (u.length > 200) u.shift(); REDO[key] = []; }
function undoInk(){ const k = inkKey(), u = UNDO[k]; if (!u || !u.length) return; (REDO[k] = REDO[k] || []).push(clonerInk(strokes())); INKS[k] = u.pop(); SEL.s = null; redrawInk(); }
function redoInk(){ const k = inkKey(), r = REDO[k]; if (!r || !r.length) return; (UNDO[k] = UNDO[k] || []).push(clonerInk(strokes())); INKS[k] = r.pop(); SEL.s = null; redrawInk(); }
/* Plan isométrique : un trait le long de la grille est découpé en petits segments (un par côté de triangle) pour que la gomme les efface un à un */
function decouperIso(cur){
  if (cur.hl || (cur.t && cur.t !== "ligne")) return null;
  const c = $("#inkCanvas"), r = c.getBoundingClientRect(), k = r.width / (c.offsetWidth || r.width), a = (34 * RD.z) * 1.2 * k, W = r.width, H = r.height;
  const pts = (cur.t ? [cur.p[0], cur.p[cur.p.length - 1]] : cur.p).filter((q, i, v) => !i || q[0] !== v[i - 1][0] || q[1] !== v[i - 1][1]);
  const out = [], g = Date.now() + Math.random();
  for (let i = 0; i + 1 < pts.length; i++){
    const A = pts[i], B = pts[i + 1], dx = (B[0] - A[0]) * W, dy = (B[1] - A[1]) * H, len = Math.hypot(dx, dy); if (len < 1) continue;
    const ang = (((Math.atan2(dy, dx) * 180 / Math.PI) % 180) + 180) % 180, grille = [30, 90, 150].some(t => Math.abs(ang - t) < 2), n = grille ? Math.max(1, Math.round(len / a)) : 1;
    for (let j = 0; j < n; j++) out.push({ c:cur.c, hl:false, hc:null, w:cur.w, t:"ligne", g, p:[[A[0] + (B[0] - A[0]) * j / n, A[1] + (B[1] - A[1]) * j / n], [A[0] + (B[0] - A[0]) * (j + 1) / n, A[1] + (B[1] - A[1]) * (j + 1) / n]] });
  }
  return out.length ? out : null;
}
/* petit texte lisible (contour blanc) : étiquettes des formes et des objets */
function etiquette(g, txt, x, y, k, col, al, tz){ tz = tz || 1; g.save(); g.font = "700 " + Math.round(15 * k * tz) + "px system-ui, sans-serif"; g.textAlign = al || "center"; g.textBaseline = "middle";
  g.lineJoin = "round"; g.lineWidth = 4 * k * tz; g.strokeStyle = wbSombre() ? "rgba(0,0,0,.55)" : "rgba(255,255,255,.9)"; g.strokeText(txt, x, y); g.fillStyle = col; g.fillText(txt, x, y); g.restore(); }
/* position du texte d'un élément (s.lp : haut, bas, gauche, droite, centre) autour de son cadre [x0, y0, x1, y1] */
function posEtiquette(lp, bb, k, tz){ const cx = (bb[0] + bb[2]) / 2, cy = (bb[1] + bb[3]) / 2, m = 14 * k * (tz || 1);
  return lp === "haut" ? [cx, bb[1] - m, "center"] : lp === "bas" ? [cx, bb[3] + m, "center"] : lp === "gauche" ? [bb[0] - m * .6, cy, "right"] : lp === "droite" ? [bb[2] + m * .6, cy, "left"] : [cx, cy, "center"]; }
function cadrePx(s, W, H){ const P = pointsTrait(s); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; P.forEach(([x, y]) => { x0 = Math.min(x0, x * W); x1 = Math.max(x1, x * W); y0 = Math.min(y0, y * H); y1 = Math.max(y1, y * H); }); return [x0, y0, x1, y1]; }
/* forme sélectionnée (onglet Formes) : cadre pointillé bleu */
function cadreForme(g, s, W, H, k){ const P = pointsTrait(s); if (!P || !P.length) return;
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; P.forEach(([x, y]) => { x0 = Math.min(x0, x * W); x1 = Math.max(x1, x * W); y0 = Math.min(y0, y * H); y1 = Math.max(y1, y * H); });
  const m = 10 * k; g.save(); g.setLineDash([8 * k, 6 * k]); g.strokeStyle = "#2a7bcf"; g.lineWidth = 2 * k; g.strokeRect(x0 - m, y0 - m, x1 - x0 + 2 * m, y1 - y0 + 2 * m);
  g.setLineDash([]); if (s.t === "cote") poigneeCote(g, s, W, H, k); const hp = (matchMedia("(any-pointer:coarse)").matches ? 13 : 7) * k; s.p.slice(0, 2).forEach(([x, y], i) => { if (i === 0 && (s.t === "bulle" || s.t === "cercle")) return; g.fillStyle = "#fff"; g.fillRect(x * W - hp, y * H - hp, 2 * hp, 2 * hp); g.strokeRect(x * W - hp, y * H - hp, 2 * hp, 2 * hp); });
  g.restore(); }
/* direction du décalage d'une cote : perpendiculaire au côté, ou (cote iso) l'axe de la grille iso le plus proche, vertical de préférence */
function dirCote(s, an){ const px = -Math.sin(an), py = Math.cos(an); if (!s.iso) return [px, py, 1];
  const C = [[0, 1], [.8660254, .5], [-.8660254, .5]]; let b = null;
  C.forEach((u, i) => { const par = Math.abs(u[0] * Math.sin(an) - u[1] * Math.cos(an)) < .2; if (par) return; let k = u[0] * px + u[1] * py, v = u; if (k < 0){ v = [-u[0], -u[1]]; k = -k; } const sc = k + (i === 0 ? .05 : 0); if (!b || sc > b[3]) b = [v[0], v[1], k, sc]; });
  return b ? [b[0], b[1], b[2]] : [px, py, 1]; }
function milieuCote(s, W, H){ const a = s.p[0], b = s.p[1], an = Math.atan2((b[1] - a[1]) * H, (b[0] - a[0]) * W), off = (s.d || 0) * H, [ux, uy] = dirCote(s, an);
  let e = 0; if (s.txt && !s.dt){ const k = DPRI() * RD.z, tz = s.tz || 1, th = 16 * k * tz, g = $("#inkCanvas").getContext("2d"); g.save(); g.font = "700 " + Math.round(th) + "px system-ui, sans-serif"; const tw = g.measureText(s.lb || "?").width; g.restore();   /* texte de côté : la poignée est au centre du texte */
    const sg = Math.sign(off) || 1, L = Math.hypot((b[0] - a[0]) * W, (b[1] - a[1]) * H); e = sg * (s.iso ? th * .7 : Math.abs(ux) * tw / 2 + Math.abs(uy) * th / 2); }
  return [(a[0] + b[0]) / 2 * W + ux * (off + e), (a[1] + b[1]) / 2 * H + uy * (off + e)]; }
function poigneeCote(g, s, W, H, k){ const [x, y] = milieuCote(s, W, H), r = 11 * k, f = 6.5 * k, t = 2.6 * k;
  g.save(); g.setLineDash([]); g.fillStyle = "#2a7bcf"; g.strokeStyle = "#fff"; g.lineWidth = 1.5 * k; g.beginPath(); g.rect(x - r, y - r, 2 * r, 2 * r); g.fill(); g.stroke();
  g.strokeStyle = "#fff"; g.lineWidth = 1.6 * k; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); g.moveTo(x - f, y); g.lineTo(x + f, y); g.moveTo(x, y - f); g.lineTo(x, y + f);
  [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const px = x + dx * f, py = y + dy * f; g.moveTo(px - dx * t + dy * t, py - dy * t + dx * t); g.lineTo(px, py); g.lineTo(px - dx * t - dy * t, py - dy * t - dx * t); }); g.stroke(); g.restore(); }
/* poignée de la forme sélectionnée sous le doigt (0 = début, 1 = fin, 2 = décalage de la cote) */
function poigneeSous(s, q){ if (!s || !s.t || !FORMES[s.t] || !strokes().includes(s)) return -1; const c = $("#inkCanvas"), W = c.width, H = c.height, tol = (matchMedia("(any-pointer:coarse)").matches ? 34 : 16) * DPRI();   /* 13 nov. : poignées plus faciles à prendre au doigt (TNI) */
  if (s.t === "cote"){ const [mx, my] = milieuCote(s, W, H); if (Math.hypot(mx - q[0] * W, my - q[1] * H) < tol * 1.1) return 2; }
  const lg = Math.hypot((s.p[1][0] - s.p[0][0]) * W, (s.p[1][1] - s.p[0][1]) * H), tp = /^(ligne|fleche|fleche2|cote|tuy[A-Z]+)$/.test(s.t) ? Math.min(tol, lg * .22) : tol;   /* courte flèche : le milieu sert à la déplacer */
  for (let i = 1; i >= 0; i--){ if (i === 0 && (s.t === "bulle" || s.t === "cercle")) continue; if (Math.hypot((s.p[i][0] - q[0]) * W, (s.p[i][1] - q[1]) * H) < tp) return i; } return -1; }
/* forme sous le doigt (la plus récente d'abord) : près de son trait, ou n'importe où dans une petite forme */
function formeSous(q){ const c = $("#inkCanvas"), W = c.width, H = c.height, tol = 14 * DPRI(), arr = strokes(); let dedans = null, pres = null;
  for (let i = arr.length - 1; i >= 0; i--){ const s = arr[i]; if (!s.t || !FORMES[s.t] || !s.p || s.p.length < 2) continue;
    const P = pointsTrait(s), x = q[0] * W, y = q[1] * H; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (let j = 0; j < P.length; j++){ const px = P[j][0] * W, py = P[j][1] * H; x0 = Math.min(x0, px); x1 = Math.max(x1, px); y0 = Math.min(y0, py); y1 = Math.max(y1, py);
      if (j){ const dd = distSeg([x, y], [P[j - 1][0] * W, P[j - 1][1] * H], [px, py], 1), lim = s.t === "cote" ? tol * 2.4 : /^(ligne|fleche|fleche2|tuy[A-Z]+)$/.test(s.t) ? tol * 1.6 : tol;   /* cote : on peut toucher son texte */
        if (dd < lim){ const sc = dd / lim - (s.t === "cote" ? .6 : 0); if (!pres || sc < pres[1]) pres = [s, sc]; } } }   /* trait le plus proche; une cote passe avant le trait qu'elle mesure */
    const petite = x1 - x0 < 90 * DPRI() && y1 - y0 < 90 * DPRI(), fermee = !/^(ligne|fleche|fleche2|cote|angle|axes|accolade|maison|tuy[A-Z]+)$/.test(s.t);
    if ((petite || fermee) && x > x0 - tol && x < x1 + tol && y > y0 - tol && y < y1 + tol){ const aire = (x1 - x0) * (y1 - y0); if (!dedans || aire < dedans[1]) dedans = [s, aire]; } }   /* l'intérieur compte aussi (la plus petite forme gagne) */
  return pres ? pres[0] : dedans ? dedans[0] : null; }
/* double-clic sur une forme : choisir sa valeur (cote, angle, rayon, numéro de bulle) */
const VALEURS_FORME = {
  cote:{ q:"Cote (ex. 1200 mm, 4'-6\")", ex:"1200 mm" },
  angle:{ q:"Angle en degrés (1 à 180). La forme s'ajuste. Ajoute du texte pour une étiquette (ex. « 45° pente »).", ex:"45" },
  cercle:{ q:"Étiquette du rayon (ex. r = 50 mm)", ex:"r = 50 mm" },
  bulle:{ q:"Numéro ou lettre de la bulle", ex:"A" } };
function modifierForme(s, cx, cy){
  const V = s.t === "objet" ? (s.k === "jonction" ? null : ELEC[s.k] ? (s.k === "rails" ? { q:"Nom des rails (ex. L1 / L2, 120 V)", ex:"L1 / L2" } : { q:"Repère du symbole (ex. CR1, M, PB2)", ex:"CR1" }) : { q:"Nom de l'objet (ex. P-1, Chaudière 1)", ex:"P-1" })
    : ((s.t === "cote" && s.txt ? { q:"Texte sur ce côté (ex. a, 3 m, hypoténuse)", ex:"a" } : VALEURS_FORME[s.t]) || (/^tuy/.test(s.t) ? { q:"Diamètre du tuyau (ex. 3/4 po, 3 po ABS)", ex:"3/4 po" } : (/^(fleche|fleche2|ligne)$/.test(s.t) ? { q:"Texte au milieu (facultatif)", ex:"" } : { q:"Nom au centre (facultatif)", ex:"A" })));
  if (!V) return;
  const old = document.getElementById("formeVal"); if (old) old.remove();
  const box = document.createElement("div"); box.id = "formeVal";
  box.style.cssText = "position:fixed;z-index:90;left:" + Math.max(8, Math.min(innerWidth - 300, cx - 140)) + "px;top:" + Math.max(8, Math.min(innerHeight - (s.t === "cote" ? 300 : 130), cy + 18)) + "px;width:280px;padding:10px;border-radius:12px;background:#0e0e0f;border:1px solid #6aa9ff;color:#e4e4e7;font:600 .8rem system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.4)";
  const actuel = s.t === "angle" && !s.lb ? String(Math.round(Math.abs(Math.atan2(s.p[1][1] - s.p[0][1], (s.p[1][0] - s.p[0][0]) * ($("#inkCanvas").width / $("#inkCanvas").height))) * 180 / Math.PI)) : (s.lb || (s.t === "bulle" ? String(s.n || 1) : ""));
  box.innerHTML = '<div style="margin-bottom:6px;line-height:1.3">' + V.q + '</div><div style="display:flex;gap:6px"><input style="flex:1;min-width:0;min-height:38px;border-radius:8px;border:1px solid #2f2f33;padding:0 8px;font:700 1rem system-ui;color:#111;background:#fff" placeholder="' + V.ex + '"><button style="min-height:38px;padding:0 12px;border-radius:8px;border:0;background:#1f6fc2;color:#fff;font:700 .85rem system-ui;cursor:pointer">OK</button></div>';
  const sansNom = s.t === "objet" && !ELEC[s.k];   /* objet iso : plus de case « Nom » (les textes sur un côté la remplacent) */
  if (sansNom){ [...box.children].slice(0, 2).forEach(el => el.style.display = "none"); }
  const extras = /^(fleche|fleche2|ligne)$/.test(s.t) && s.g === undefined ? [["Texte où la flèche commence", "lbA", "ex. Eau froide"], [s.t === "ligne" ? "Texte au bout" : "Texte où la flèche pointe", "lbB", "ex. Robinet"]] : s.t !== "objet" ? [] : s.k === "transfo" ? [["Tension au primaire (H1-H2)", "vp", "120 V"], ["Tension au secondaire (X1-X2)", "vs", "24 V"]] : s.k === "rails" ? [["Tension de l'échelle (au centre)", "v", "120 V c.a."]] : [];
  extras.forEach(([lab, cle, ph]) => { const r = document.createElement("label"); r.style.cssText = "display:flex;flex-direction:column;gap:3px;margin-top:8px;line-height:1.3";
    r.innerHTML = '<span>' + lab + '</span><input data-cle="' + cle + '" placeholder="' + ph + '" style="min-height:36px;border-radius:8px;border:1px solid #2f2f33;padding:0 8px;font:700 .95rem system-ui;color:#111;background:#fff">';
    r.querySelector("input").value = s[cle] || ""; box.appendChild(r); });
  if (s.k !== "jonction" && s.t !== "maison" && !/^tuy/.test(s.t) && !s.hl) couleurForme(box, s);
  if (s.t !== "bulle" && s.t !== "objet") tailleTexte(box, s);
  if (s.t === "cote") pivoterTexte(box, s);   /* objet : plus de nom, donc pas de taille de texte (chaque texte d'un côté a la sienne) */
  /* pavé de position (flèches) retiré à la demande de Jeremy : la cote se décale avec sa poignée bleue */   /* forme qui accepte « + Texte sur un côté » : pas besoin du pavé de position */
  if (cotesPossibles(s)){ const rang = document.createElement("div"); rang.style.cssText = "display:flex;gap:6px;margin-top:10px";
    const st = "flex:1;min-height:40px;border-radius:9px;border:1px solid #6aa9ff;border-bottom-width:4px;color:#fff;font:800 .85rem system-ui;cursor:pointer;padding:0 6px";
    const flecheSeule = /^(fleche|fleche2|ligne)$/.test(s.t) && s.g === undefined;   /* flèche : textes au départ / à la pointe plus haut, pas besoin de « + Texte sur un côté » */
    rang.innerHTML = (flecheSeule ? '' : '<button type="button" data-plus="txt" title="Ajoute un texte (a, b, c…) sur le côté que tu choisis" style="' + st + ';background:#1f6fc2">+ Texte sur un côté</button>') + '<button type="button" data-plus="cote" title="Ajoute une ligne de cote sur le côté que tu choisis" style="' + st + ';background:#2a2a30">+ Cote</button>';
    rang.addEventListener("mousedown", e => e.preventDefault()); box.appendChild(rang); }
  if (sansNom){ const bf = document.createElement("button"); bf.type = "button"; bf.textContent = "Fermer"; bf.style.cssText = "width:100%;margin-top:10px;min-height:38px;border-radius:9px;border:1px solid #3a3a40;background:#1c1c1f;color:#e4e4e7;font:800 .9rem system-ui;cursor:pointer"; bf.addEventListener("mousedown", e => e.preventDefault()); bf.onclick = () => fin(true); box.appendChild(bf); }
  glisserCase(box);
  $("#reader").appendChild(box); placerCase(box, s, cx, cy);   /* la case se met à côté de l'objet, jamais dessus */
  const inp = box.querySelector("input"); inp.value = actuel; if (!sansNom) setTimeout(() => { inp.focus(); inp.select(); }, 30);
  box.addEventListener("pointerdown", e => e.stopPropagation());
  let fini = false;
  const fin = ok => { if (fini) return; fini = true; box.remove(); if (!ok) return; const v = inp.value.trim(); snapInk();
    if (s.t === "angle"){ const m = /^\s*(\d+(?:[.,]\d+)?)\s*°?\s*$/.exec(v);
      if (m){ const c = $("#inkCanvas"), W = c.width, H = c.height, a = s.p[0], b = s.p[1], R = Math.hypot((b[0] - a[0]) * W, (b[1] - a[1]) * H), haut = b[1] <= a[1];
        const d = Math.max(1, Math.min(180, parseFloat(m[1].replace(",", ".")))), ar = d * Math.PI / 180 * (haut ? -1 : 1);
        s.p[1] = [a[0] + Math.cos(ar) * R / W, a[1] + Math.sin(ar) * R / H]; delete s.lb; }
      else if (v) s.lb = v; else delete s.lb; }
    else if (v) s.lb = s.t === "objet" && ELEC[s.k] ? v.slice(0, 14) : v; else delete s.lb;
    box.querySelectorAll("[data-cle]").forEach(i => { const w = i.value.trim(); if (w) s[i.dataset.cle] = w; else delete s[i.dataset.cle]; });
    redrawInk(); try { majObjUI(); } catch(e){} };
  inp.addEventListener("keydown", e => { e.stopPropagation(); if (e.key === "Enter"){ e.preventDefault(); fin(true); } else if (e.key === "Escape"){ e.preventDefault(); fin(false); } });
  box.querySelector("button").onclick = () => fin(true);
  if (sansNom) setTimeout(() => { const h = e => { if (!box.isConnected || fini){ document.removeEventListener("pointerdown", h, true); return; } if (!box.contains(e.target)){ document.removeEventListener("pointerdown", h, true); fin(true); } }; document.addEventListener("pointerdown", h, true); }, 0);   /* sans case de saisie : toucher ailleurs ferme */
  box.querySelectorAll("[data-plus]").forEach(bp => bp.onclick = () => { fin(true); ajouterCote(s, bp.dataset.plus === "txt"); });
  const quitte = () => setTimeout(() => { if (!box.contains(document.activeElement)) fin(true); }, 150);   /* on peut passer d'une case à l'autre */
  inp.addEventListener("blur", quitte);
  box.querySelectorAll("[data-cle]").forEach(i => { i.addEventListener("blur", quitte); i.addEventListener("keydown", e => { e.stopPropagation(); if (e.key === "Enter"){ e.preventDefault(); fin(true); } else if (e.key === "Escape"){ e.preventDefault(); fin(false); } }); }); }
/* case du double-clic : à droite de l'objet, sinon à gauche, en dessous ou au-dessus (toujours dans l'écran) */
function placerCase(box, s, cx, cy){
  const c = $("#inkCanvas"), r = c.getBoundingClientRect(), sx = r.width / c.width, sy = r.height / c.height, bw = box.offsetWidth, bh = box.offsetHeight, M = 8;
  let b = null; try { b = s.t === "objet" ? objGeo(s, c.width, c.height).bbox : cadrePx(s, c.width, c.height); } catch(e){}
  if (b && s.t === "cote") try { const f = groupeCotes(s)[0]; if (f){ const bf = f.t === "objet" ? objGeo(f, c.width, c.height).bbox : cadrePx(f, c.width, c.height); b = [Math.min(b[0], bf[0]), Math.min(b[1], bf[1]), Math.max(b[2], bf[2]), Math.max(b[3], bf[3])]; } } catch(e){}   /* la case ne cache ni la cote ni sa forme */
  const dans = (x, y) => x >= M && y >= M && x + bw <= innerWidth - M && y + bh <= innerHeight - M, cx2 = x => Math.max(M, Math.min(innerWidth - bw - M, x)), cy2 = y => Math.max(M, Math.min(innerHeight - bh - M, y));
  if (!b){ box.style.left = cx2(cx - bw / 2) + "px"; box.style.top = cy2(cy + 18) + "px"; return; }
  const m = 30, o = [r.left + b[0] * sx - m, r.top + b[1] * sy - m, r.left + b[2] * sx + m, r.top + b[3] * sy + m];   /* marge : texte de la cote ou de l'étiquette */
  const recouvre = (x, y) => Math.max(0, Math.min(x + bw, o[2]) - Math.max(x, o[0])) * Math.max(0, Math.min(y + bh, o[3]) - Math.max(y, o[1]));
  const C = [[o[2] + 6, cy2((o[1] + o[3]) / 2 - bh / 2)], [o[0] - 6 - bw, cy2((o[1] + o[3]) / 2 - bh / 2)], [cx2((o[0] + o[2]) / 2 - bw / 2), o[3] + 6], [cx2((o[0] + o[2]) / 2 - bw / 2), o[1] - 6 - bh]];
  let best = C.find(([x, y]) => dans(x, y) && !recouvre(x, y));
  if (!best) best = C.map(([x, y]) => [cx2(x), cy2(y)]).sort((A, B) => recouvre(A[0], A[1]) - recouvre(B[0], B[1]))[0];
  box.style.left = best[0] + "px"; box.style.top = best[1] + "px"; }
/* sommets d'une forme (pour coter ses côtés) */
/* trait iso coupé en pas de grille (même groupe g) : la suite de coins de la partie continue qui contient s */
function cheminGroupe(s){ const c = $("#inkCanvas"), W = c.width, H = c.height, pres = (u, v) => Math.hypot((u[0] - v[0]) * W, (u[1] - v[1]) * H) < 3;
  const segs = strokes().filter(x => x.t === "ligne" && x.g === s.g && x.p && x.p.length === 2); if (segs.length < 2) return null;
  const chaines = []; segs.forEach(x => { const ch = chaines[chaines.length - 1]; if (ch && pres(ch[ch.length - 1].p[1], x.p[0])) ch.push(x); else chaines.push([x]); });
  const ch = chaines.find(k => k.includes(s)); if (!ch) return null;
  const P = [ch[0].p[0]].concat(ch.map(x => x.p[1])), Q = [P[0]];
  for (let i = 1; i < P.length; i++){ const A = Q[Q.length - 1], B = P[i], C2 = P[i + 1]; if (C2){ const cr = ((B[0] - A[0]) * W) * ((C2[1] - B[1]) * H) - ((B[1] - A[1]) * H) * ((C2[0] - B[0]) * W); if (Math.abs(cr) < 1) continue; } Q.push(B); }
  return Q.map(q => q.slice()); }
function sommetsForme(s){ if (s && s.t === "objet" && !ELEC[s.k] && s.p){ const c = $("#inkCanvas"), G = objGeo(s, c.width, c.height); return { P:G.ports.map(q => [q[0] / c.width, q[1] / c.height]), ferme:false }; }   /* même un objet à un seul raccord (vase d'expansion) : ses arêtes servent de côtés */   /* objet iso : cote d'un raccord à l'autre */
  if (!s || !s.p || s.p.length < 2) return null; const [a, b] = s.p, x0 = Math.min(a[0], b[0]), x1 = Math.max(a[0], b[0]), y0 = Math.min(a[1], b[1]), y1 = Math.max(a[1], b[1]), xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
  if (s.t === "ligne" && s.g !== undefined){ const P = cheminGroupe(s); if (P) return { P, ferme:false }; }
  if (/^(ligne|fleche|fleche2|tuy[A-Z]+)$/.test(s.t)) return { P:[a, b], ferme:false };
  if (s.t === "rect" || s.t === "maison" || s.t === "cube") return { P:[[x0, y0], [x1, y0], [x1, y1], [x0, y1]], ferme:true };
  if (s.t === "triangle") return { P:[[xm, y0], [x1, y1], [x0, y1]], ferme:true };
  if (s.t === "triangleR") return { P:[[x0, y0], [x0, y1], [x1, y1]], ferme:true };
  if (s.t === "losange") return { P:[[xm, y0], [x1, ym], [xm, y1], [x0, ym]], ferme:true };
  if (s.t === "hexagone"){ const P = []; for (let i = 0; i < 6; i++){ const an = Math.PI / 3 * i; P.push([xm + (x1 - x0) / 2 * Math.cos(an), ym + (y1 - y0) / 2 * Math.sin(an)]); } return { P, ferme:true }; }
  return null; }
const cotesPossibles = s => s.t === "cote" || !!sommetsForme(s);
/* côtés qu'on peut coter ou nommer : ceux de la forme; pour un objet iso, aussi la longueur, la profondeur et la hauteur de son corps */
function arcsForme(f){ const S = sommetsForme(f); if (!S) return []; let A = []; for (let i = 0; i < S.P.length - (S.ferme ? 0 : 1); i++) A.push([S.P[i], S.P[(i + 1) % S.P.length]]);
  if (f.t === "objet" && !ELEC[f.k]){ const ports = A; A = []; const c = $("#inkCanvas"), W = c.width, H = c.height, G = objGeo(f, W, H); let B = null;
    { const E = { m0:1e9, m1:-1e9, n0:1e9, n1:-1e9, h0:1e9, h1:-1e9 }, add = (m0, m1, n0, n1, h0, h1) => { E.m0 = Math.min(E.m0, m0); E.m1 = Math.max(E.m1, m1); E.n0 = Math.min(E.n0, n0); E.n1 = Math.max(E.n1, n1); E.h0 = Math.min(E.h0, h0); E.h1 = Math.max(E.h1, h1); };   /* enveloppe de tout l'objet (pompe, vannes : cylindres compris) */
      G.shapes.forEach(sh => { if (sh.t === "box") add(sh.m0, sh.m1, sh.n0, sh.n1, sh.h0, sh.h1); else if (sh.t === "cyl") add(sh.m - sh.R, sh.m + sh.R, sh.n - sh.R, sh.n + sh.R, sh.h0, sh.h1); else if (sh.t === "cyln") add(sh.m - sh.R, sh.m + sh.R, sh.n0, sh.n1, sh.h - sh.R, sh.h + sh.R);
        else if (sh.t === "cylm") add(sh.m0, sh.m1, sh.n - sh.R, sh.n + sh.R, sh.h - sh.R, sh.h + sh.R); else if (sh.t === "sph") add(sh.m - sh.R, sh.m + sh.R, sh.n - sh.R, sh.n + sh.R, sh.h - sh.R, sh.h + sh.R); });
      if (E.m1 > E.m0) B = [0, E]; }
    if (B){ const b = B[1], N = q => [q[0] / W, q[1] / H], pres = (u, v) => Math.hypot((u[0] - v[0]) * W, (u[1] - v[1]) * H) < 6;
      [[[b.m0, b.n1, b.h0], [b.m1, b.n1, b.h0]], [[b.m0, b.n0, b.h0], [b.m0, b.n1, b.h0]], [[b.m0, b.n0, b.h0], [b.m0, b.n0, b.h1]], [[b.m0, b.n0, b.h1], [b.m1, b.n0, b.h1]], [[b.m1, b.n0, b.h1], [b.m1, b.n1, b.h1]]].forEach(([U, V]) => {   /* arêtes du contour : longueur, profondeur, hauteur, puis les deux arêtes du haut */
        const u = N(G.P(...U)), v = N(G.P(...V)); if (!pres(u, v)) A.push([u, v]); }); }
    const proche = ([u, v]) => A.some(([a, b2]) => { const d1 = [(v[0] - u[0]) * W, (v[1] - u[1]) * H], d2 = [(b2[0] - a[0]) * W, (b2[1] - a[1]) * H], L1 = Math.hypot(...d1), L2 = Math.hypot(...d2);   /* raccord à raccord : gardé s'il n'est pas presque sur une arête */
      if (Math.abs(d1[0] * d2[1] - d1[1] * d2[0]) > .1 * L1 * L2) return false; const m = [((u[0] + v[0]) / 2 - a[0]) * W, ((u[1] + v[1]) / 2 - a[1]) * H]; return Math.abs(m[0] * d2[1] - m[1] * d2[0]) / (L2 || 1) < 18 * DPRI(); });
    A = ports.filter(q => !proche(q)).concat(A); }
  return A; }
/* + : une cote sur le prochain côté qui n'en a pas (pour une cote : sur un autre côté de la même forme) */
function ajouterCote(s, txt, choixIdx){
  const c = $("#inkCanvas"), W = c.width, H = c.height, pres = (u, v) => Math.hypot((u[0] - v[0]) * W, (u[1] - v[1]) * H) < 4;
  const arcs = arcsForme;
  let f = s;
  if (s.t === "cote") f = strokes().find(o => o !== s && o.t !== "cote" && arcs(o).some(([u, v]) => (pres(u, s.p[0]) && pres(v, s.p[1])) || (pres(v, s.p[0]) && pres(u, s.p[1]))));
  if (!f){ aviser("Pour une autre cote, double-clique sur la forme elle-même.", 3500); return; }
  const cotes = strokes().filter(o => o.t === "cote" && !!o.txt === !!txt), occupe = ([u, v]) => cotes.some(o => (pres(u, o.p[0]) && pres(v, o.p[1])) || (pres(v, o.p[0]) && pres(u, o.p[1])));
  const tous = arcs(f), libres = tous.map((A, i) => i).filter(i => !occupe(tous[i]));
  if (!libres.length){ aviser(txt ? "Tous les côtés de cette forme ont déjà un texte." : "Tous les côtés de cette forme ont déjà une cote.", 3000); return; }
  if (choixIdx === undefined){ choisirCote(f, tous, libres, txt, i => ajouterCote(f, txt, i)); return; }   /* l'enseignant touche le côté voulu */
  const libre = tous[choixIdx];
  const S = sommetsForme(f), Cx = S.P.reduce((t, q) => t + q[0], 0) / S.P.length * W, Cy = S.P.reduce((t, q) => t + q[1], 0) / S.P.length * H;
  const [u, v] = libre, an = Math.atan2((v[1] - u[1]) * H, (v[0] - u[0]) * W), nx = -Math.sin(an), ny = Math.cos(an), mx = (u[0] + v[0]) / 2 * W, my = (u[1] + v[1]) / 2 * H;
  const iso = RD.wb && /^iso/.test(wbBg()) && (f.t === "objet" || (f.t === "ligne" && f.g !== undefined)), [dx0, dy0] = iso ? dirCote({ iso:1 }, an) : [nx, ny];
  let sg = S.ferme ? (Math.sign(dx0 * (mx - Cx) + dy0 * (my - Cy)) || 1) : (ny > 0 ? -1 : 1), ec = 30 * RD.z * DPRI();
  if (f.t === "objet"){ const B = objGeo(f, W, H).bbox, bx = (B[0] + B[2]) / 2, by = (B[1] + B[3]) / 2; sg = Math.sign(dx0 * (mx - bx) + dy0 * (my - by)) || 1; }   /* objet : du côté opposé au corps de l'objet, pour ne pas le cacher */
  snapInk(); const n = { t:"cote", c:f.c && !/^tuy|^maison/.test(f.t) ? f.c : "#24282c", hl:false, hc:null, w:2.5, p:[u.slice(), v.slice()], d:sg * (txt ? ec * .25 : ec) / H };
  if (RD.wb && /^iso/.test(wbBg()) && (f.t === "objet" || (f.t === "ligne" && f.g !== undefined))) n.iso = 1;   /* objet iso ou tuyau iso : le texte suit l'angle de la pièce; une forme (rectangle, triangle…) garde son texte à plat */
  if (txt){ n.txt = 1; n.lb = "abcdefgh"[arcs(f).findIndex(([a2, b2]) => pres(a2, u) && pres(b2, v))] || "a"; }
  strokes().push(n); SELO.s = n; redrawInk(); try { majObjUI(); } catch(e){}
  const r = c.getBoundingClientRect(); modifierForme(n, r.left + mx * r.width / W, r.top + my * r.height / H); }
/* choisir le côté : chaque côté libre est surligné avec un gros bouton +; toucher ailleurs ou Échap = annuler */
function choisirCote(f, tous, libres, txt, ok){
  const c = $("#inkCanvas"), r = c.getBoundingClientRect(), X = q => [r.left + q[0] * r.width, r.top + q[1] * r.height];
  const S = sommetsForme(f); let C = X([S.P.reduce((t, q) => t + q[0], 0) / S.P.length, S.P.reduce((t, q) => t + q[1], 0) / S.P.length]);
  const obj = f.t === "objet"; if (obj){ const B = objGeo(f, c.width, c.height).bbox; C = X([(B[0] + B[2]) / 2 / c.width, (B[1] + B[3]) / 2 / c.height]); }
  document.querySelectorAll(".choixCote").forEach(e => e.remove());
  const ov = document.createElementNS("http://www.w3.org/2000/svg", "svg"); ov.setAttribute("class", "choixCote");
  ov.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;z-index:100001;cursor:default";
  let h = '<rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,.08)"/>';
  libres.forEach(i => { const [u, v] = tous[i].map(X), mx = (u[0] + v[0]) / 2, my = (u[1] + v[1]) / 2, L = Math.hypot(v[0] - u[0], v[1] - u[1]) || 1;
    let nx = -(v[1] - u[1]) / L, ny = (v[0] - u[0]) / L; if (S.ferme || obj ? nx * (mx - C[0]) + ny * (my - C[1]) < 0 : ny > 0){ nx = -nx; ny = -ny; }
    const bx = mx + nx * 30, by = my + ny * 30;
    h += '<g data-i="' + i + '" style="cursor:pointer"><line x1="' + u[0] + '" y1="' + u[1] + '" x2="' + v[0] + '" y2="' + v[1] + '" stroke="#1f6fc2" stroke-opacity=".55" stroke-width="16" stroke-linecap="round"/>' +
      '<line x1="' + u[0] + '" y1="' + u[1] + '" x2="' + v[0] + '" y2="' + v[1] + '" stroke="transparent" stroke-width="40"/>' +
      '<circle cx="' + bx + '" cy="' + by + '" r="22" fill="#1f6fc2" stroke="#fff" stroke-width="3"/><path d="M' + (bx - 9) + ' ' + by + 'h18M' + bx + ' ' + (by - 9) + 'v18" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/></g>'; });
  ov.innerHTML = h; document.body.appendChild(ov);
  aviser(txt ? "Touche le côté où mettre le texte." : "Touche le côté à coter.", 4000);
  const fin = () => { ov.remove(); removeEventListener("keydown", esc, true); }, esc = e => { if (e.key === "Escape"){ e.preventDefault(); e.stopPropagation(); fin(); } };
  addEventListener("keydown", esc, true);
  ov.addEventListener("pointerdown", e => { e.preventDefault(); e.stopPropagation(); const g = e.target.closest("g[data-i]"); fin(); if (g) ok(+g.dataset.i); }); }
/* la case du double-clic se déplace en la glissant par sa barre du haut (pour voir l'objet dessous) */
function glisserCase(box){
  const bar = document.createElement("div"); bar.title = "Glisse pour déplacer la case";
  bar.style.cssText = "display:flex;align-items:center;justify-content:center;height:18px;margin:-6px -4px 6px;cursor:grab;touch-action:none;color:#71717a;user-select:none";
  bar.innerHTML = '<svg viewBox="0 0 24 8" width="40" height="10" aria-hidden="true"><g fill="currentColor"><circle cx="4" cy="2" r="1.6"/><circle cx="12" cy="2" r="1.6"/><circle cx="20" cy="2" r="1.6"/><circle cx="4" cy="6.5" r="1.6"/><circle cx="12" cy="6.5" r="1.6"/><circle cx="20" cy="6.5" r="1.6"/></g></svg>';
  box.prepend(bar); let d = null;
  bar.addEventListener("pointerdown", e => { e.preventDefault(); const r = box.getBoundingClientRect(); d = { dx:e.clientX - r.left, dy:e.clientY - r.top }; bar.setPointerCapture(e.pointerId); bar.style.cursor = "grabbing"; });
  bar.addEventListener("pointermove", e => { if (!d) return; box.style.left = Math.max(0, Math.min(innerWidth - box.offsetWidth, e.clientX - d.dx)) + "px"; box.style.top = Math.max(0, Math.min(innerHeight - 40, e.clientY - d.dy)) + "px"; });
  ["pointerup", "pointercancel"].forEach(t => bar.addEventListener(t, () => { d = null; bar.style.cursor = "grab"; }));
  bar.addEventListener("mousedown", e => e.preventDefault()); }
/* une forme et les cotes / textes posés sur ses côtés (à partir de la forme ou d'une de ses cotes) */
function groupeCotes(s){ const c = $("#inkCanvas"), W = c.width, H = c.height, pres = (u, v) => Math.hypot((u[0] - v[0]) * W, (u[1] - v[1]) * H) < 4;
  const arcs = arcsForme;
  const sur = (o, f) => arcs(f).some(([u, v]) => (pres(u, o.p[0]) && pres(v, o.p[1])) || (pres(v, o.p[0]) && pres(u, o.p[1])));
  const tous = strokes(), f = s.t === "cote" ? tous.find(o => o !== s && o.t !== "cote" && o.p && sur(s, o)) : s;
  if (!f) return []; return [f].concat(tous.filter(o => o.t === "cote" && o !== f && sur(o, f))).filter(o => o !== s); }
/* cotes et textes posés sur les côtés d'une forme : on retient le côté (et le sens) pour qu'ils suivent quand la forme bouge ou change de taille */
function liensCotes(f){ if (!f || f.t === "cote" || !sommetsForme(f)) return null; const c = $("#inkCanvas"), W = c.width, H = c.height, pres = (u, v) => Math.hypot((u[0] - v[0]) * W, (u[1] - v[1]) * H) < 4;
  const A = arcsForme(f), n = A.length, L = [];
  strokes().forEach(o => { if (o.t !== "cote" || !o.p) return; for (let i = 0; i < n; i++){ const [u, v] = A[i];
    if (pres(u, o.p[0]) && pres(v, o.p[1])){ L.push([o, i, false]); return; } if (pres(v, o.p[0]) && pres(u, o.p[1])){ L.push([o, i, true]); return; } } });
  return L.length ? L : null; }
function suivreCotes(L, f){ const A = arcsForme(f); if (!A.length || !L) return; L.forEach(([o, i, rev]) => { if (!A[i]) return; const [u, v] = A[i]; o.p = rev ? [v.slice(), u.slice()] : [u.slice(), v.slice()]; }); }
/* couleur de la forme, dans la case du double-clic */
function couleurForme(box, s){
  const row = document.createElement("div"); row.style.cssText = "display:flex;align-items:center;gap:6px;margin-top:10px;flex-wrap:wrap";
  const C = [["#24282c", "Noir"], ["#e2483d", "Rouge"], ["#2a7bcf", "Bleu"], ["#2f9e4f", "Vert"], ["#f08c00", "Orange"], ["#8a8f98", "Gris"]];
  row.innerHTML = '<span style="flex:1 0 100%;font-size:.85rem">Couleur</span>' + C.map(([c, n]) => '<button type="button" data-fcol="' + c + '" title="' + n + '" aria-label="' + n + '" style="width:32px;height:32px;flex:0 0 32px;border-radius:50%;border:3px solid ' + ((s.c || "#24282c") === c ? "#fff" : "#3a3a40") + ';background:' + (c === "#24282c" && wbSombre() ? "#f4f1ea" : c) + ';cursor:pointer;box-shadow:' + ((s.c || "#24282c") === c ? "0 0 0 2px #2a7bcf" : "none") + '"></button>').join("");
  row.addEventListener("mousedown", e => e.preventDefault());
  row.querySelectorAll("[data-fcol]").forEach(b => b.onclick = () => { snapInk(); s.c = b.dataset.fcol; groupeCotes(s).forEach(o => o.c = s.c);   /* forme, ses cotes et ses textes : même couleur */ row.querySelectorAll("[data-fcol]").forEach(x => { const on = x === b; x.style.borderColor = on ? "#fff" : "#3a3a40"; x.style.boxShadow = on ? "0 0 0 2px #2a7bcf" : "none"; }); redrawInk(); });
  box.appendChild(row); }
/* rotation du texte d'une cote ou d'un texte de côté (s.rot, en degrés, ajoutée à l'angle automatique) */
function pivoterTexte(box, s){
  const row = document.createElement("div"); row.style.cssText = "display:flex;align-items:center;gap:6px;margin-top:10px";
  const bt = 'style="min-width:44px;min-height:38px;border-radius:9px;border:1px solid #3a3a40;border-bottom-width:4px;background:#1c1c1f;color:#e4e4e7;font:800 .95rem system-ui;cursor:pointer;padding:0 8px"';
  row.innerHTML = '<span style="flex:1">Pivoter le texte</span><button type="button" data-r="-15" title="Tourner vers la gauche" ' + bt + '>⟲</button><b style="min-width:3em;text-align:center;font-variant-numeric:tabular-nums"></b><button type="button" data-r="15" title="Tourner vers la droite" ' + bt + '>⟳</button><button type="button" data-r="0" title="Revenir à l\'angle automatique" ' + bt + '>Auto</button>';
  const aff = () => { row.querySelector("b").textContent = (s.rot || 0) + "°"; }; aff();
  let snap = false;
  row.querySelectorAll("[data-r]").forEach(b => b.onclick = () => { if (!snap){ snapInk(); snap = true; } const d = +b.dataset.r; if (!d) delete s.rot; else { let r = ((s.rot || 0) + d) % 360; if (r > 180) r -= 360; if (r <= -180) r += 360; if (r) s.rot = r; else delete s.rot; } aff(); redrawInk(); });
  row.addEventListener("mousedown", e => e.preventDefault()); box.appendChild(row); }
/* taille du texte (s.tz) : − / + */
function tailleTexte(box, s){
  const row = document.createElement("div"); row.style.cssText = "display:flex;align-items:center;gap:6px;margin-top:10px";
  const bt = 'style="width:44px;min-height:38px;border-radius:9px;border:1px solid #3a3a40;border-bottom-width:4px;background:#1c1c1f;color:#e4e4e7;font:800 1rem system-ui;cursor:pointer"';
  row.innerHTML = '<span style="flex:1">Taille du texte</span><button type="button" data-tz="-1" ' + bt + ' aria-label="Texte plus petit" title="Plus petit">A−</button><span data-v style="min-width:46px;text-align:center;font-weight:800"></span><button type="button" data-tz="1" ' + bt + ' aria-label="Texte plus gros" title="Plus gros">A+</button>';
  box.appendChild(row);
  const maj = () => { row.querySelector("[data-v]").textContent = Math.round((s.tz || 1) * 100) + " %"; };
  row.addEventListener("pointerdown", e => e.preventDefault()); row.addEventListener("mousedown", e => e.preventDefault());   /* la case de texte garde le curseur */
  row.querySelectorAll("[data-tz]").forEach(b => b.onclick = () => { const v = Math.max(.5, Math.min(4, Math.round(((s.tz || 1) + (+b.dataset.tz) * .25) * 100) / 100));
    if (v === (s.tz || 1)) return; snapInk(); if (v === 1) delete s.tz; else s.tz = v; redrawInk(); maj(); });
  maj(); }
let dernierTap = null;
function tapElement(o, e){ if (!o || !e) return; const t = performance.now(), d = dernierTap; dernierTap = { o, t, x:e.clientX, y:e.clientY };
  if (d && d.o === o && t - d.t < 550 && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 24 && strokes().includes(o)){ dernierTap = null; SELO.s = o; redrawInk(); majObjUI(); modifierForme(o, e.clientX, e.clientY); } }
/* sélectionner un élément d'une autre catégorie : la palette passe à son onglet (Formes, Iso ou Électricité) */
function ongletPour(o){ return o.fil ? "elec" : FORMES[o.t] && FORMES[o.t].pl ? "plomb" : o.t !== "objet" ? "formes" : ELEC[o.k] ? "elec" : "iso"; }
function choisirAutre(o){ const t = ongletPour(o), isoBg = !!RD.wb && /^iso/.test(wbBg());
  if ((t === "iso" && !isoBg) || (t === "elec" && !modeElec())){ aviser(t === "iso" ? "Cet objet isométrique se modifie sur le fond « plan isométrique » (bouton Fond)." : "Ce symbole électrique se modifie sur le fond quadrillé (bouton Fond).", 4500); return false; }
  if (RD.objTab !== t){ RD.formeK = null; RD.objKi = null; RD.objKe = null; } RD.objTab = t; SELO.s = o; majObjUI(); redrawInk(); return true; }
/* objet (iso ou électrique) sous le doigt, le plus récent d'abord */
/* boîte d'un élément, en pixels du canevas (sélection multiple) */
function boiteDe(s, W, H){
  if (s.t === "objet") return objGeo(s, W, H).bbox;
  if (!s.p || !s.p.length) return null;
  const xs = s.p.map(q => q[0] * W), ys = s.p.map(q => q[1] * H);
  if (s.t === "cercle" || s.t === "bulle"){ const r = Math.hypot(xs[1] - xs[0], ys[1] - ys[0]); return [xs[0] - r, ys[0] - r, xs[0] + r, ys[0] + r]; }
  if (s.t === "texte"){ const k = DPRI() * RD.z; return [xs[0], ys[0], xs[0] + Math.max(40 * k, (s.bw || .1) * W), ys[0] + (s.fs || 28) * k * ((s.lig || [1]).length || 1) * 1.3]; }
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; }
window.SELM = [];
function objetSous(q){ const c = $("#inkCanvas"), arr = strokes(), x = q[0] * c.width, y = q[1] * c.height;
  for (let i = arr.length - 1; i >= 0; i--){ const s = arr[i]; if (s.t !== "objet" || s.k === "fil") continue; const G = objGeo(s, c.width, c.height); if (x >= G.bbox[0] - 4 && x <= G.bbox[2] + 4 && y >= G.bbox[1] - 4 && y <= G.bbox[3] + 4) return s; } return null; }
/* points d'un trait (pour la gomme) : les formes sont échantillonnées sur leur contour */
function pointsTrait(s){
  if (s.t === "objet"){ const c = $("#inkCanvas"), G = objGeo(s, c.width, c.height), out = []; for (let i = 0; i <= 6; i++) for (let j = 0; j <= 4; j++) out.push([(G.bbox[0] + (G.bbox[2] - G.bbox[0]) * i / 6) / c.width, (G.bbox[1] + (G.bbox[3] - G.bbox[1]) * j / 4) / c.height]); return out; }
  if (s.t === "texte"){ const out = [], bw = s.bb ? s.bb[0] : .05, bh = s.bb ? s.bb[1] : .03; for (let i = 0; i <= 8; i++) for (let j = 0; j <= 3; j++) out.push([s.p[0][0] + bw * i / 8, s.p[0][1] + bh * j / 3]); return out; }
  if (!s.t || s.p.length < 2) return s.p;
  const a = s.p[0], b = s.p[s.p.length - 1], out = [], N = 28;
  const seg = (u, v) => { for (let i = 0; i <= N; i++) out.push([u[0] + (v[0] - u[0]) * i / N, u[1] + (v[1] - u[1]) * i / N]); };
  if (s.t === "cote"){ const cv = $("#inkCanvas"), W = cv.width || 1, H = cv.height || 1, an = Math.atan2((b[1] - a[1]) * H, (b[0] - a[0]) * W), off = (s.d || 0) * H, DC = dirCote(s, an), ox = DC[0] * off / W, oy = DC[1] * off / H;
    seg([a[0] + ox, a[1] + oy], [b[0] + ox, b[1] + oy]); if (s.d){ seg(a, [a[0] + ox, a[1] + oy]); seg(b, [b[0] + ox, b[1] + oy]); } }
  else if (s.t === "ligne" || s.t === "fleche" || s.t === "fleche2" || /^tuy/.test(s.t)) seg(a, b);
  else if (s.t === "angle"){ seg(a, b); seg(a, [a[0] + Math.hypot(b[0] - a[0], b[1] - a[1]), a[1]]); }
  else if (s.t === "cercle" || s.t === "bulle"){ const cv = $("#inkCanvas"), W = cv.width || 1, H = cv.height || 1, r = Math.hypot((b[0] - a[0]) * W, (b[1] - a[1]) * H); for (let i = 0; i < 72; i++){ const t = i / 72 * Math.PI * 2; out.push([a[0] + r * Math.cos(t) / W, a[1] + r * Math.sin(t) / H]); } out.push(a); }
  else if (FORMES[s.t] && s.t !== "ellipse"){ const x0 = Math.min(a[0], b[0]), x1 = Math.max(a[0], b[0]), y0 = Math.min(a[1], b[1]), y1 = Math.max(a[1], b[1]);
    seg([x0, y0], [x1, y0]); seg([x1, y0], [x1, y1]); seg([x1, y1], [x0, y1]); seg([x0, y1], [x0, y0]); }   /* contour seulement (une diagonale faisait choisir la mauvaise forme) */
  else if (s.t === "rect"){ const c1 = [a[0], a[1]], c2 = [b[0], a[1]], c3 = [b[0], b[1]], c4 = [a[0], b[1]]; seg(c1, c2); seg(c2, c3); seg(c3, c4); seg(c4, c1); }
  else { const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2, rx = Math.abs(b[0] - a[0]) / 2, ry = Math.abs(b[1] - a[1]) / 2; for (let i = 0; i < 72; i++){ const t = i / 72 * Math.PI * 2; out.push([cx + rx * Math.cos(t), cy + ry * Math.sin(t)]); } }
  return out;
}
function rayonIso(){ const c = $("#inkCanvas"), r = c.getBoundingClientRect(), k = r.width / (c.offsetWidth || r.width); return .3 * (34 * RD.z) * 1.2 * k / r.height; }
const rayonGomme = () => ((RD.wb && /^iso/.test(wbBg())) ? rayonIso() * .75 : .012) * (RD.gommeT || 1);   /* RD.gommeT : glissière « Taille de la gomme » */
function distSeg(p, u, v, a){
  const ux = (v[0] - u[0]) * a, uy = v[1] - u[1], px = (p[0] - u[0]) * a, py = p[1] - u[1], l2 = ux * ux + uy * uy;
  const t = l2 ? Math.max(0, Math.min(1, (px * ux + py * uy) / l2)) : 0; return Math.hypot(px - t * ux, py - t * uy);
}
function eraseAt(p){
  const c = $("#inkCanvas"), a = c.width / c.height, arr = strokes(), r = rayonGomme();
  const k0 = DPRI() * RD.z, rs = s => s.hl ? r + (s.w * 4 * k0 / 2) / c.height * .7 : r;   /* le surligneur est large : la gomme en tient compte */
  const touche = s => { const P = (!s.t ? s.p : pointsTrait(s)); if (!P || !P.length) return false; const r = rs(s);
    if (P.length === 1) return Math.hypot((P[0][0] - p[0]) * a, P[0][1] - p[1]) < r;
    for (let i = 1; i < P.length; i++) if (distSeg(p, P[i - 1], P[i], a) < r) return true; return false; };
  let hits = new Set();
  arr.forEach(s => { if (s.t === "objet") return;
    if (s.t === "texte"){ mesurerTexte(s); if (p[0] >= s.p[0][0] && p[0] <= s.p[0][0] + s.bw && p[1] >= s.p[0][1] && p[1] <= s.p[0][1] + s.bb[1]) hits.add(s); }
    else if (touche(s)) hits.add(s); });
  if (!hits.size){      /* un objet n'est effacé que si rien d'autre n'est sous la gomme, et seulement en son centre */
    const px = p[0] * c.width, py = p[1] * c.height;
    for (let k = arr.length - 1; k >= 0; k--){ const s = arr[k]; if (s.t !== "objet") continue; const G = objGeo(s, c.width, c.height), m = Math.min(G.bbox[2] - G.bbox[0], G.bbox[3] - G.bbox[1]) * .15;
      if (s.k === "rails"){ if (surRails(s, G, px, py, -.1)){ hits.add(s); break; } continue; }
      if (px > G.bbox[0] + m && px < G.bbox[2] - m && py > G.bbox[1] + m && py < G.bbox[3] - m){ hits.add(s); break; } }
  }
  if (!hits.size) return;
  [...hits].forEach(h => { if (h.t && h.t !== "cote" && h.t !== "texte") try { (liensCotes(h) || []).forEach(([o]) => hits.add(o)); } catch(er){} });   /* ses cotes et textes partent avec */
  const out = [];
  arr.forEach(s => {
    if (!hits.has(s)){ out.push(s); return; }
    if (s.t) return;                                  /* forme, texte ou objet : effacé en entier */
    const r = rs(s);
    const D = [];                                     /* trait libre : on n'enlève que le morceau touché */
    for (let i = 0; i < s.p.length; i++){ D.push(s.p[i]); const n = s.p[i + 1]; if (!n) break;
      const L = Math.hypot((n[0] - s.p[i][0]) * a, n[1] - s.p[i][1]), K = Math.ceil(L / (r * .5));
      for (let q = 1; q < K; q++) D.push([s.p[i][0] + (n[0] - s.p[i][0]) * q / K, s.p[i][1] + (n[1] - s.p[i][1]) * q / K]); }
    let run = [];
    const fin = () => { if (run.length >= 2) out.push(Object.assign({}, s, { p:run })); run = []; };
    D.forEach(q => { if (Math.hypot((q[0] - p[0]) * a, q[1] - p[1]) < r) fin(); else run.push(q); }); fin();
  });
  if (!RD.erSnap){ snapInk(); RD.erSnap = true; } INKS[inkKey()] = out; redrawBientot();
}
/* Un seul dessin complet par image (60 par seconde au maximum) : la gomme reste fluide même avec beaucoup de traits */
let rafInk = 0;
function redrawBientot(){ if (!rafInk) rafInk = requestAnimationFrame(() => { rafInk = 0; redrawInk(); }); }

/* ---- Déplacer le tableau blanc sans zoomer : bouton main, clic molette ou Espace + glisser ---- */
(function(){
  const c = $("#inkCanvas"), st = $("#rstage"), btn = $("#wbHand"); let spc = false, P = null;
  const majHand = () => { btn.classList.toggle("on", !!RD.hand); c.style.cursor = (RD.hand || spc) ? (P ? "grabbing" : "grab") : ""; };
  btn.onclick = () => { RD.hand = !RD.hand; if (RD.hand){ RD.eraser = false; RD.text = false; RD.obj = false; try { refreshTools(); } catch(e){} } majHand(); };
  $("#penBar").addEventListener("click", e => { const b = e.target.closest("button"); if (b && RD.hand && !/^(wbHand|wbZo|wbZi|wbP|wbN|wbPlus|wbMoins|wbS|penFold|penSide|penU|penR)$/.test(b.id)){ RD.hand = false; majHand(); } }, true);
  document.addEventListener("keydown", e => { if (e.code !== "Space" || !RD.wb || /^(TEXTAREA|INPUT|SELECT)$/.test((e.target.tagName || ""))) return; e.preventDefault(); if (!spc){ spc = true; majHand(); } }, true);
  document.addEventListener("keyup", e => { if (e.code === "Space" && spc){ spc = false; majHand(); } }, true);
  document.addEventListener("pointerdown", e => {
    if (e.target !== c || !RD.wb || !(RD.hand || spc || e.button === 1)) return;
    e.preventDefault(); e.stopPropagation(); c.setPointerCapture(e.pointerId);
    P = { x:e.clientX, y:e.clientY, l:st.scrollLeft, t:st.scrollTop, id:e.pointerId }; majHand();
  }, true);
  document.addEventListener("pointermove", e => { if (!P || e.pointerId !== P.id) return; e.stopPropagation(); st.scrollLeft = P.l - (e.clientX - P.x); st.scrollTop = P.t - (e.clientY - P.y); }, true);
  const fin = e => { if (!P || e.pointerId !== P.id) return; e.stopPropagation(); P = null; majHand(); };
  document.addEventListener("pointerup", fin, true); document.addEventListener("pointercancel", fin, true);
  c.addEventListener("auxclick", e => e.preventDefault());
  window.majHand = majHand;
})();
/* rond qui montre la zone réellement effacée */
(function(){
  const ring = document.createElement("div"); ring.id = "gommeRond";
  ring.style.cssText = "position:fixed;z-index:79;pointer-events:none;border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 1px #000;display:none;transform:translate(-50%,-50%)";
  document.addEventListener("DOMContentLoaded", () => {}); const att = () => { const rd = $("#reader"); if (rd && !ring.parentNode) rd.appendChild(ring); }; att();
  document.addEventListener("pointermove", e => {
    const c = $("#inkCanvas"); if (!RD.eraser || !(RD.pen || RD.wb) || !c){ ring.style.display = "none"; return; }
    const r = c.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom){ ring.style.display = "none"; return; }
    att(); const d = Math.max(8, rayonGomme() * r.height * 2); ring.style.cssText += ";display:block;width:" + d + "px;height:" + d + "px;left:" + e.clientX + "px;top:" + e.clientY + "px";
  }, true);
})();
/* ---- Zones de texte : créer, déplacer, modifier (police, taille, gras, italique, couleur) ---- */
const TX = { f:TXFONTS[0][1], fs:32, b:true, i:false }, SEL = { s:null };
function mesurerTexte(s){
  const c = $("#inkCanvas"), g = c.getContext("2d"), k = DPRI() * RD.z, f = txFs(s) * k;
  g.font = txFont(s, f); const lg = habiller(g, s.txt, s.bw * c.width); s.bb = [s.bw, lg.length * (s.lig ? (s.lh ? s.lh * c.height : 34 * 1.25 * k) : f * 1.25) / c.height];
}
function rectTexte(s){ const c = $("#inkCanvas"), r = c.getBoundingClientRect(); mesurerTexte(s);
  return { x:r.left + s.p[0][0] * r.width, y:r.top + s.p[0][1] * r.height, w:s.bw * r.width, h:Math.max(24, s.bb[1] * r.height) }; }
function texteSous(q){
  const arr = strokes(); for (let i = arr.length - 1; i >= 0; i--){ const s = arr[i]; if (s.t !== "texte") continue; mesurerTexte(s);
    if (q[0] >= s.p[0][0] - .004 && q[0] <= s.p[0][0] + s.bw + .004 && q[1] >= s.p[0][1] - .004 && q[1] <= s.p[0][1] + s.bb[1] + .004) return s; }
  return null;
}
function ouvrirTexte(cx, cy, q, bw, bh, ex, lv){   /* lv = ligne d'un livre { hL, fs } : la case s'aligne sur la ligne de réponse */
  document.querySelectorAll(".inktxt").forEach(t => t.blur());
  const c = $("#inkCanvas"), key = inkKey(), P = ex || (lv ? { f:TX.f, fs:lv.fs / RD.z, b:false, i:false } : { f:TX.f, fs:TX.fs, b:TX.b, i:TX.i });
  const col = ex ? ex.c : (/^hl/.test(RD.color) ? "#24282c" : RD.color), fsCss = txFs(P) * RD.z;
  const lig = ex ? !!ex.lig : (lv ? true : !!(RD.wb && wbBg() === "lignes")), hL = lv ? lv.hL : (ex && ex.lh ? ex.lh * c.getBoundingClientRect().height : 34 * 1.25 * RD.z);        /* feuille lignée : le texte s'écrit sur les lignes */
  if (lig && !ex && !lv){ const r = c.getBoundingClientRect(), top = Math.round((cy - r.top) / hL) * hL; cy = r.top + top; q = [q[0], top / r.height]; bh = Math.max(2 * hL, Math.round(bh / hL) * hL); }
  const ta = document.createElement("textarea"); ta.className = "inktxt"; ta.spellcheck = false; ta.placeholder = "Écrire…"; if (ex){ ta.value = ex.txt; ex.cache = true; redrawInk(); }
  ta.style.cssText = "position:fixed;z-index:80;box-sizing:border-box;left:" + cx + "px;top:" + cy + "px;width:" + bw + "px;height:" + bh + "px;margin:0;padding:0;border:0;outline:2px dashed #6aa9ff;outline-offset:0;background:rgba(255,255,255,.08);resize:none;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;line-height:1.25;color:" + (col === "#24282c" && wbSombre() ? "#f4f1ea" : col);
  ta.style.font = txFont(P, fsCss).replace(/^((italic )?\d+ )/, "$1") ; ta.style.lineHeight = "1.25";
  if (lig){ const g2 = c.getContext("2d"); g2.font = txFont(P, fsCss); const mm = g2.measureText("Mg"), asc = mm.fontBoundingBoxAscent || fsCss * .9, desc = mm.fontBoundingBoxDescent || fsCss * .25;
    ta.style.lineHeight = hL + "px"; ta.style.paddingTop = Math.max(0, hL - 3 * RD.z - ((hL - (asc + desc)) / 2 + asc)) + "px"; }
  let fini = false;
  const fin = ok => { if (fini) return; fini = true; const txt = ta.value.replace(/\s+$/, ""); ta.remove();
    if (ex){ ex.cache = false;
      if (ok && txt !== ex.txt){ snapInk(key); if (!txt){ INKS[key] = INKS[key].filter(x => x !== ex); SEL.s = null; } else { ex.txt = txt; mesurerTexte(ex); if (ex.ch){ if (ex.fs0) { ex.fs = ex.fs0; ex.lh = ex.lh0; mesurerTexte(ex); } for (let k = 0; k < 10 && ex.bb && ex.bb[1] > ex.ch * 1.02; k++){ ex.fs *= .88; ex.lh *= .88; mesurerTexte(ex); } } } }
      redrawInk(); return; }
    if (ok && txt){ const s = { c:col, hl:false, w:4, t:"texte", lig, txt, p:[q, q], bw:bw / c.getBoundingClientRect().width, f:P.f, fs:P.fs, b:P.b, i:P.i };
      if (lv) s.lh = hL / c.getBoundingClientRect().height;
      mesurerTexte(s);
      if (lv && lv.h){ s.fs0 = s.fs; s.lh0 = s.lh; } if (lv && lv.h){ const Hc = s.ch = lv.h / c.getBoundingClientRect().height; for (let k = 0; k < 10 && s.bb && s.bb[1] > Hc * 1.02; k++){ s.fs *= .88; s.lh *= .88; mesurerTexte(s); } }   /* case d'un tableau : la réponse rapetisse pour rester dans sa case */ snapInk(key); (INKS[key] = INKS[key] || []).push(s); SEL.s = s; redrawInk(); } };
  ta.onkeydown = e => { e.stopPropagation(); if (e.key === "Escape"){ e.preventDefault(); fin(false); } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)){ e.preventDefault(); fin(true); } };   /* Entrée = nouvelle ligne; Ctrl+Entrée ou toucher à côté = terminé */
  if (!lig) ta.oninput = () => { if (ta.scrollHeight > ta.clientHeight){ ta.style.height = ta.scrollHeight + 4 + "px"; } };   /* la case grandit avec les lignes */
  if (lig) ta.oninput = () => { ta.style.height = "auto"; ta.style.height = Math.max(bh, Math.ceil(ta.scrollHeight / hL) * hL) + "px"; };   /* feuille lignée : Entrée passe à la ligne suivante, la zone grandit ; Ctrl+Entrée ou un clic ailleurs valide */
  ta.onblur = () => fin(true);
  $("#reader").appendChild(ta); setTimeout(() => { ta.focus(); }, 0);
}
/* Ligne de réponse d'un livre sous le doigt (x, y de l'écran) : bordure du bas (ligne, case à remplir) ou lignes répétées en fond.
   Rend { x, y (la ligne), w, hL (interligne), fs } en pixels de l'écran, ou null. Marche pour tous les livres, sans connaître leurs classes. */
/* Case ou choix d'un livre sous le doigt : case dessinée (☐ □ ▢), petit carré vide (span.box…), ou choix à encercler (.opts > span, .choix > span, .vf > span).
   Rend { kind:"case"|"rond", x, y, w, h } en pixels de l'écran, ou null. Sert aux élèves (et aux profs) pour cocher et encercler au bon endroit. */
function caseDuLivre(X, Y){
  for (const id of ["#readerFrame", "#readerFrame2"]){
    const f = $(id); if (!f || f.hidden) continue; const fr = f.getBoundingClientRect(); if (X < fr.left || X > fr.right || Y < fr.top || Y > fr.bottom) continue;
    let win, doc; try { win = f.contentWindow; doc = f.contentDocument; } catch(e){ continue; } if (!doc || !doc.body) continue;
    const s = fr.width / (win.innerWidth || fr.width), bx = (X - fr.left) / s, by = (Y - fr.top) / s, tol = 16 / s;
    const vis = e => { const cs = win.getComputedStyle(e); return cs.visibility !== "hidden" && cs.display !== "none" && +cs.opacity !== 0; };
    const dist = r => Math.hypot(Math.max(r.left - bx, 0, bx - r.right), Math.max(r.top - by, 0, by - r.bottom));
    const sous = doc.elementsFromPoint(bx, by), boite = (sous.find(e => e.matches && e.matches(".page,.slide,.diapo,section,[data-page]")) || doc.body);
    let best = null; const prendre = (kind, r, d) => { if (d <= tol && (!best || d < best.d)) best = { kind, r, d }; };
    /* 1. cases dessinées avec un caractère */
    const tw = doc.createTreeWalker(boite, NodeFilter.SHOW_TEXT, { acceptNode:t => /[☐□▢◻⬜]/.test(t.data) ? 1 : 3 }); let t, n = 0;
    while ((t = tw.nextNode()) && ++n < 3000){ const pr = t.parentElement && t.parentElement.getBoundingClientRect(); if (!pr || dist(pr) > tol || !vis(t.parentElement)) continue;
      for (let i = 0; i < t.data.length; i++) if (/[☐□▢◻⬜]/.test(t.data[i])){ const rg = doc.createRange(); rg.setStart(t, i); rg.setEnd(t, i + 1); const r = rg.getBoundingClientRect(); if (r.width) prendre("case", r, dist(r)); } }
    /* 2. petits carrés vides (bordure ou fond) */
    n = 0; for (const e of boite.querySelectorAll("span,i,b,div,td")){ if (++n > 5000) break;
      const r = e.getBoundingClientRect(); if (dist(r) > tol) continue;
      if (r.width < 7 || r.width > 46 || r.height < 7 || r.height > 46 || Math.abs(r.width - r.height) > Math.max(r.width, r.height) * .35 || e.textContent.trim() || e.children.length) continue;
      const cs = win.getComputedStyle(e); if (!vis(e)) continue; if ((parseFloat(cs.borderTopWidth) || 0) >= .5 && cs.borderTopStyle !== "none" || (parseFloat(cs.borderBottomWidth) || 0) >= .5 && (parseFloat(cs.borderLeftWidth) || 0) >= .5) prendre("case", r, dist(r)); }
    if (best && best.d * s > 3){ const L = ligneDuLivre(X, Y); if (L && X >= L.x - 2 && X <= L.x + L.w + 2 && Math.abs(Y - L.y) < 26) best = null; }   /* doigt à côté de la case, sur une ligne : c'est la ligne qui gagne */
    if (best) return { kind:best.kind, x:fr.left + best.r.left * s, y:fr.top + best.r.top * s, w:best.r.width * s, h:best.r.height * s };
    /* 3. choix à encercler : un enfant d'un groupe .opts / .choix / .vf (ou options, choices, qcm) */
    const CH = /(^|\s)(opts?|options?|choix|choices?|vf|qcm)(\s|$)/;
    for (const e of sous){ const p = e.parentElement; if (!p || !CH.test(p.className || "") || !vis(e) || !texteVisible(e, win) || e.textContent.trim().length > 120) continue;   /* un choix a des mots (une ligne de réponse vide n'est pas un choix) */
      let r = e.getBoundingClientRect(); try { const rg = doc.createRange(); rg.selectNodeContents(e); const rt = rg.getBoundingClientRect(); if (rt.width && rt.width < r.width) r = rt; } catch(x){}   /* le rond suit les mots, pas toute la largeur du bloc */
      if (r.width && r.height < 120) return { kind:"rond", x:fr.left + r.left * s, y:fr.top + r.top * s, w:r.width * s, h:r.height * s }; }
  }
  return null;
}
/* Coche (✓) une case ou encercle un choix au point touché; un 2e toucher au même endroit l'enlève. Rend true si quelque chose a été fait. */
function cocherDansLivre(X, Y, B0){
  if (RD.wb) return false; const B = B0 || caseDuLivre(X, Y); if (!B) return false;
  const c = $("#inkCanvas"), r = c.getBoundingClientRect(), N = (x, y) => [(x - r.left) / r.width, (y - r.top) / r.height];
  const cle = B.kind + ":" + Math.round((B.x + B.w / 2 - r.left) / r.width * 400) + "," + Math.round((B.y + B.h / 2 - r.top) / r.height * 400), arr = strokes();
  const dans = o => { if (!o.coche || !o.cc) return false; const X0 = r.left + o.cc[0] * r.width, Y0 = r.top + o.cc[1] * r.height; return X0 >= B.x - 6 && X0 <= B.x + B.w + 6 && Y0 >= B.y - 6 && Y0 <= B.y + B.h + 6; };
  snapInk(); const deja = arr.findIndex(o => o.coche === cle || dans(o));   /* même case (même si l'élément a un peu bougé sous le doigt) */
  if (deja >= 0){ arr.splice(deja, 1); redrawInk(); return true; }
  const col = /^hl/.test(RD.color) ? "#e2483d" : (RD.color || "#e2483d"), pts = [];
  const seg = (a, b, k) => { for (let i = 0; i <= k; i++) pts.push(N(a[0] + (b[0] - a[0]) * i / k, a[1] + (b[1] - a[1]) * i / k)); };
  if (B.kind === "case"){ const { x, y, w, h } = B, m = Math.max(w, h);
    const A = [x + w * .12, y + h * .52], M = [x + w * .42, y + h * .86], Z = [x + w / 2 + m * .62, y + h / 2 - m * .78];   /* le crochet dépasse un peu en haut à droite, comme à la main */
    seg(A, M, 6); pts.pop(); seg(M, Z, 10);
    arr.push({ c:col, hl:false, w:Math.max(2.2, Math.min(5, m / RD.z * .17)), p:pts, coche:cle, cc:N(x + w / 2, y + h / 2) }); }
  else { const cx = B.x + B.w / 2, cy = B.y + B.h / 2, rx = B.w / 2 + (B.pad === 0 ? 0 : 7), ry = B.h / 2 + (B.pad === 0 ? 0 : 5);
    for (let i = 0; i <= 44; i++){ const a = -Math.PI * .6 + i / 40 * Math.PI * 2; pts.push(N(cx + rx * Math.cos(a), cy + ry * Math.sin(a))); }   /* un peu plus qu'un tour, comme un rond fait à la main */
    arr.push({ c:col, hl:false, w:2.6, p:pts, coche:cle, cc:N(cx, cy) }); }
  redrawInk(); try { planifierSauvegarde(); } catch(e){} return true;
}
function ligneDuLivre(X, Y){
  for (const id of ["#readerFrame", "#readerFrame2"]){
    const f = $(id); if (!f || f.hidden) continue; const fr = f.getBoundingClientRect(); if (X < fr.left || X > fr.right || Y < fr.top || Y > fr.bottom) continue;
    let win, doc; try { win = f.contentWindow; doc = f.contentDocument; } catch(e){ continue; } if (!doc || !doc.body) continue;
    const s = fr.width / (win.innerWidth || fr.width), bx = (X - fr.left) / s, by = (Y - fr.top) / s;
    const sous = doc.elementsFromPoint(bx, by), boite = (sous.find(e => e.matches && e.matches(".page,.slide,.diapo,section,[data-page]")) || doc.body);
    const C = []; let n = 0;
    for (const e of boite.querySelectorAll("*")){ if (++n > 4000) break;
      const r = e.getBoundingClientRect(); if (r.width < 24 || r.right < bx - 4 || r.left > bx + 4 || r.bottom < by - 40 || r.top > by + 48) continue;
      const cs = win.getComputedStyle(e); if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity === 0) continue;
      const sc = e.offsetWidth ? r.width / e.offsetWidth : 1, bb = parseFloat(cs.borderBottomWidth) || 0;
      if (bb >= .5 && cs.borderBottomStyle !== "none" && r.height <= 70 * sc){
        let sp = 0; const nx = e.nextElementSibling; if (nx && nx.className === e.className){ const r2 = nx.getBoundingClientRect(); sp = r2.bottom - r.bottom; if (sp < 12 * sc || sp > 70 * sc) sp = 0; }
        C.push({ y:r.bottom - bb * sc / 2, l:r.left, r:r.right, sp, sc }); }
      const bg = cs.backgroundImage || "";
      if (/linear-gradient/.test(bg) && r.height >= 16 * sc && by >= r.top - 4 && by <= r.bottom + 4){
        const bs = (cs.backgroundSize || "").split(" "); let P = bs[1] && /px$/.test(bs[1]) ? parseFloat(bs[1]) : Math.max(0, ...[...bg.matchAll(/([\d.]+)px/g)].map(m => +m[1]));
        if (P >= 10 && P <= 80){ const Pv = P * sc, k = Math.max(1, Math.ceil((by - r.top) / Pv - .1)), y = Math.min(r.top + k * Pv, r.top + Math.floor(r.height / Pv + .01) * Pv);
          C.push({ y, l:r.left, r:r.right, sp:Pv, sc }); } } }
    let best = null, bd = 1e9;
    C.forEach(c => { const d = c.y - by, cout = d >= 0 ? d : d >= -8 ? 14 - 2 * d : 40 - d; if (Math.abs(d) <= 40 && cout < bd){ bd = cout; best = c; } });   /* on écrit au-dessus d'une ligne : la ligne sous le doigt gagne (avant : la ligne d'au-dessus passait devant) */
    if (!best) return null;
    const sc = best.sc || 1, fsB = Math.max(11 * sc, Math.min(30 * sc, (best.sp || 26 * sc) * .62)), hL = best.sp || fsB * 1.6;
    return { x:fr.left + best.l * s + 2, y:fr.top + best.y * s, w:Math.max(60, (best.r - best.l) * s - 4), hL:hL * s, fs:fsB * s };
  }
  return null;
}
function modifierTexte(s){ const r = rectTexte(s); ouvrirTexte(r.x, r.y, s.p[0], r.w, r.h, s); }
/* barre d'options du texte + cadre de sélection */
function majSelTxt(){
  const sel = $("#txSel"), bar = $("#txBar"); if (!sel || !bar) return;
  const on = !!RD.text && (RD.pen || RD.wb); bar.hidden = !on;
  const s = SEL.s; if (!on || !s || !strokes().includes(s) || s.cache){ sel.hidden = true; return; }
  const r = rectTexte(s); sel.hidden = false; sel.style.left = r.x - 4 + "px"; sel.style.top = r.y - 4 + "px"; sel.style.width = r.w + 8 + "px"; sel.style.height = r.h + 8 + "px";
}
function majBarTxt(){
  const s = SEL.s && strokes().includes(SEL.s) ? SEL.s : null, P = s || TX;
  $("#txF").value = P.f || TXFONTS[0][1]; $("#txS").textContent = Math.round(txFs(P));
  $("#txB").classList.toggle("on", P.b !== false && (s ? s.b !== undefined || true : true) && P.b !== false); $("#txI").classList.toggle("on", !!P.i);
  $("#txC").value = /^#[0-9a-f]{6}$/i.test(s ? s.c : "") ? s.c : "#24282c";
  $("#txC").style.visibility = s ? "visible" : "hidden"; ["txE", "txD"].forEach(id => $("#" + id).style.display = s ? "" : "none");
}
function appliquerTxt(maj){
  const s = SEL.s && strokes().includes(SEL.s) ? SEL.s : null;
  if (s){ snapInk(); maj(s); mesurerTexte(s); redrawInk(); } else maj(TX);
  majBarTxt();
}
(function(){
  const bar = document.createElement("div"); bar.id = "txBar"; bar.hidden = true;
  bar.style.cssText = "position:absolute;z-index:75;left:50%;top:64px;transform:translateX(-50%);display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:center;padding:8px 10px;border-radius:12px;background:rgba(14,14,15,.96);border:1px solid #2f2f33;color:#d4d4d8;font:600 .85rem system-ui,sans-serif";
  bar.innerHTML = '<select id="txF" aria-label="Police" style="height:34px;border-radius:8px;background:#18181a;color:#fff;border:1px solid #2f2f33;padding:0 6px">' + TXFONTS.map(f => '<option value="' + f[1].replace(/"/g, "&quot;") + '">' + f[0] + '</option>').join("") + '</select>'
    + '<button id="txM" title="Plus petit" aria-label="Plus petit">A−</button><span id="txS" style="min-width:2.2em;text-align:center">32</span><button id="txP" title="Plus grand" aria-label="Plus grand">A+</button>'
    + '<button id="txB" title="Gras" aria-label="Gras"><b>G</b></button><button id="txI" title="Italique" aria-label="Italique"><i>I</i></button>'
    + '<input id="txC" type="color" title="Couleur du texte" aria-label="Couleur du texte" style="width:34px;height:34px;padding:0;border:1px solid #2f2f33;border-radius:8px;background:#18181a">'
    + '<button id="txE" title="Modifier le texte (ou double-clic)" aria-label="Modifier le texte">✎ Modifier</button><button id="txD" title="Supprimer ce texte" aria-label="Supprimer ce texte">🗑</button>';
  const st = document.createElement("style");
  st.textContent = '#txBar button{min-width:34px;height:34px;padding:0 9px;border-radius:8px;border:1px solid #2f2f33;background:#18181a;color:#d4d4d8;cursor:pointer;font:inherit}#txBar button:hover{border-color:#6a6a70}#txBar button.on{background:#2a2a2d;border-color:#8a8a90;color:#fff}#txSel{position:fixed;z-index:74;pointer-events:none;border:2px solid #6aa9ff;border-radius:4px;box-shadow:0 0 0 1px #0006}';
  document.head.appendChild(st); $("#reader").appendChild(bar);
  const sel = document.createElement("div"); sel.id = "txSel"; sel.hidden = true; $("#reader").appendChild(sel);
  bar.addEventListener("pointerdown", e => e.stopPropagation());
  $("#txF").onchange = e => appliquerTxt(P => { P.f = e.target.value; });
  $("#txM").onclick = () => appliquerTxt(P => { P.fs = Math.max(12, Math.round(txFs(P)) - 4); });
  $("#txP").onclick = () => appliquerTxt(P => { P.fs = Math.min(200, Math.round(txFs(P)) + 4); });
  $("#txB").onclick = () => appliquerTxt(P => { P.b = P.b === false; });
  $("#txI").onclick = () => appliquerTxt(P => { P.i = !P.i; });
  $("#txC").oninput = e => { const s = SEL.s; if (s && strokes().includes(s)){ s.c = e.target.value; redrawInk(); } };
  $("#txC").onchange = () => {};
  $("#txE").onclick = () => { if (SEL.s) modifierTexte(SEL.s); };
  $("#txD").onclick = () => { const s = SEL.s; if (!s) return; snapInk(); INKS[inkKey()] = strokes().filter(x => x !== s); SEL.s = null; redrawInk(); majBarTxt(); };
  $("#rstage").addEventListener("scroll", () => { majSelTxt(); if (!RD.wb) pauseLivre(); }, { passive:true });
})();


/* ---- Animation du schéma en échelle : on calcule où passe le courant, de L1 vers L2 ----
   Les fils et les rails relient des points de la grille ; un contact fermé relie ses deux bornes ; une charge (bobine, lampe,
   moteur, solénoïde) est alimentée quand une borne touche L1 et l'autre L2. Une bobine alimentée change l'état de tous les
   contacts qui portent le même repère (CR1, M…) : c'est ce qui fait fonctionner le contact de maintien. */
const SIM = { tdeb:{}, tfini:new Set(), minut:[], sonneries:[], act:new Set(), press:new Set(), bob:{}, ferme:new Map(), pot:new Map(), charges:new Set(), trOn:new Set(), flux:[], moteurs:[], court:false, key:"", raf:0, tenu:null };
const SIM_SW = /^(contact|contactT|surcharge|bp|inter|thermostat|pression|flotteur|fincourse|fusible)$/, SIM_CH = /^(bobine|bobineT|lampe|ampoule|moteur|solenoide|sonnerie|chauffant|resistance|del)$/, SIM_ACT = /^(bp|inter|thermostat|pression|flotteur|fincourse|surcharge|fusible)$/;
function simCalc(prof){
  const cv = $("#inkCanvas"), W = cv.width, Hc = cv.height, u = elecU(), arr = strokes(), now = performance.now();
  const gk = p => Math.round(p[0] * W / u) + "," + Math.round(p[1] * Hc / u), gkPx = q => Math.round(q[0] / u) + "," + Math.round(q[1] / u);
  const px = k => k.split("|")[0].split(",").map(Number);                      /* en carreaux : converti en pixels à chaque image, donc juste même après un zoom */
  const norm = t => (t || "").trim().toUpperCase();
  const fils = arr.filter(o => o.t === "ligne" && o.fil), objs = arr.filter(o => o.t === "objet" && ELEC[o.k]);
  const PN = SIM.panne && arr.includes(SIM.panne.cible) ? SIM.panne : null;             /* panne ajoutée par l'enseignant */
  const conn = new Set(), ports = new Map(), E = [], hotS = new Set(), neuS = new Set();
  fils.forEach(f => f.p.forEach(p => conn.add(gk(p))));
  objs.forEach(o => { const Pp = objGeo(o, W, Hc).ports.map(gkPx); ports.set(o, Pp); Pp.forEach(k => conn.add(k)); });
  const sous = new Set();                                                                          /* pas de grille entre les bornes d'un symbole : seul le symbole relie ses bornes */
  objs.forEach(o => { if (/^(rails|jonction|terre)$/.test(o.k)) return; const Pp = ports.get(o);
    (o.k === "transfo" ? [[0, 1], [2, 3]] : ({ dpst:[[0, 1], [2, 3]], dpdt:[[0, 1], [3, 4]] }[o.k === "inter" ? polDe(o) : ""] || [[0, 1]])).forEach(([i, j]) => { if (!Pp[i] || !Pp[j]) return;
      const [ax, ay] = Pp[i].split(",").map(Number), [bx, by] = Pp[j].split(",").map(Number); if (ax !== bx && ay !== by) return;
      const n = Math.max(Math.abs(bx - ax), Math.abs(by - ay)), sx = Math.sign(bx - ax), sy = Math.sign(by - ay);
      for (let t = 0; t < n; t++){ const a = (ax + sx * t) + "," + (ay + sy * t), b = (ax + sx * (t + 1)) + "," + (ay + sy * (t + 1)); sous.add(a + ">" + b); sous.add(b + ">" + a); } }); });
  fils.forEach((f, idx) => { if (PN && PN.type === "coupe" && PN.cible === f) return; const [ax, ay] = gk(f.p[0]).split(",").map(Number), [bx, by] = gk(f.p[1]).split(",").map(Number);
    if (ax !== bx && ay !== by){ E.push([ax + "," + ay, bx + "," + by]); return; }
    const n = Math.max(Math.abs(bx - ax), Math.abs(by - ay)), sx = Math.sign(bx - ax), sy = Math.sign(by - ay); let prev = ax + "," + ay;
    for (let i = 1; i <= n; i++){ const k0 = (ax + sx * i) + "," + (ay + sy * i), k = (i === n || conn.has(k0)) ? k0 : k0 + "|" + idx, p0 = prev.split("|")[0];
      if (!sous.has(p0 + ">" + k0)) E.push([prev, k]); prev = k; } });   /* deux fils qui se croisent sans point de jonction ne sont pas reliés */
  objs.filter(o => o.k === "rails").forEach(o => { const [w, h] = o.sz || [8, 10], [x0, y0] = gk(o.p[0]).split(",").map(Number);
    [[x0, hotS], [x0 + w, neuS]].forEach(([x, S]) => { for (let y = y0; y <= y0 + h; y++){ S.add(x + "," + y); if (y > y0) E.push([x + "," + (y - 1), x + "," + y]); } }); });
  objs.filter(o => o.k === "pile").forEach(o => { const Pp = ports.get(o); hotS.add(Pp[0]); neuS.add(Pp[1]); });   /* une pile est une source : + à gauche */
  const uf = () => { const par = new Map(), f = k => { while (par.has(k)){ const p = par.get(k); if (par.has(p)) par.set(k, par.get(p)); k = p; } return k; };
    return { f, un:(a, b) => { a = f(a); b = f(b); if (a !== b) par.set(a, b); } }; };
  const chargesT = objs.filter(o => (SIM_CH.test(o.k) || o.k === "transfo") && !(PN && PN.type === "ouvert" && PN.cible === o));
  let bob = Object.assign({}, SIM.bob), R = null;
  for (let it = 0; it < 16; it++){
    const ferme = new Map(), paires = [];
    objs.forEach(o => { const lb = norm(o.lb), Pp = ports.get(o);
      if (o.k === "inter"){ const pol = polDe(o), act = SIM.act.has(o), cl = o.nf ? !act : act;
        ferme.set(o, pol.endsWith("dt") ? act : cl);
        if (PN && PN.cible === o) return;
        ({ spst:cl ? [[0, 1]] : [], dpst:cl ? [[0, 1], [2, 3]] : [], spdt:act ? [[0, 2]] : [[0, 1]], dpdt:act ? [[0, 2], [3, 5]] : [[0, 1], [3, 4]] })[pol].forEach(([a, b]) => paires.push([Pp[a], Pp[b]])); return; }
      if (o.k === "diode"){ paires.push([Pp[0], Pp[1]]); return; }
      if (!SIM_SW.test(o.k)) return;
      const act = o.k === "contact" ? !!bob[lb] : o.k === "contactT" ? SIM.tfini.has(lb) : o.k === "bp" ? SIM.press.has(o) : SIM.act.has(o);
      const cl = (o.k === "surcharge" || o.k === "fusible" || o.nf) ? !act : act, reel = PN && PN.cible === o ? PN.type === "colle" : cl;
      ferme.set(o, cl); if (reel) paires.push([Pp[0], Pp[1]]); });   /* le dessin montre l'état normal : la panne se trouve en suivant les couleurs */
    const U = uf(); E.forEach(([a, b]) => U.un(a, b)); paires.forEach(([a, b]) => U.un(a, b));
    const HS = new Set([...hotS].map(U.f)), NS = new Set([...neuS].map(U.f)), court = [...HS].some(r => NS.has(r));
    /* une charge fonctionne si, sans elle, une de ses bornes rejoint L1 (ou +) et l'autre L2 (ou −), au besoin à travers d'autres charges en série */
    const alim = new Set(), trOn = new Set();
    if (!court) for (let pass = 0; pass < 3; pass++){
      chargesT.forEach(o => { const Pp = ports.get(o), a = U.f(Pp[0]), b = U.f(Pp[1]); if (a === b) return;
        /* chemin L1 → borne a et borne b → L2 à travers d'autres charges en série, sans repasser par le même point
           (avant : toutes les autres charges étaient vues comme des fils, et un échelon voisin rempli de charges reliait L1 à L2) */
        const adjL = new Map(), lien = (p, q) => { if (!adjL.has(p)) adjL.set(p, []); adjL.get(p).push(q); };
        chargesT.forEach(x => { if (x === o) return; const Q = ports.get(x), p = U.f(Q[0]), q = U.f(Q[1]); if (p !== q){ lien(p, q); lien(q, p); } });
        const bfs = (dep, buts, interdit) => { if (buts.has(dep)) return [dep]; const vu = new Map([[dep, null]]), fi = [dep];
          while (fi.length){ const k0 = fi.shift(); for (const n of adjL.get(k0) || []){ if (vu.has(n) || interdit.has(n)) continue; vu.set(n, k0);
            if (buts.has(n)){ const ch = []; for (let x = n; x !== null; x = vu.get(x)) ch.push(x); return ch; } fi.push(n); } } return null; };
        const essai = (x, y) => { if (NS.has(x) || HS.has(y)) return false; const c1 = bfs(x, HS, new Set([y, ...NS])); if (!c1) return false; return !!bfs(y, NS, new Set([...c1, ...HS])); };
        if (essai(a, b) || essai(b, a)) (o.k === "transfo" ? trOn : alim).add(o); });
      let ajout = false; trOn.forEach(o => { const Pp = ports.get(o), x1 = U.f(Pp[2]); if (!HS.has(x1)){ HS.add(x1); NS.add(U.f(Pp[3])); ajout = true; } });
      if (!ajout) break;
    }
    const nb = {}; alim.forEach(o => { if ((o.k === "bobine" || o.k === "bobineT") && o.lb) nb[norm(o.lb)] = true; });
    R = { ferme, paires, U, HS, NS, court, alim, trOn };
    const pareil = Object.keys(nb).sort().join() === Object.keys(bob).filter(k => bob[k]).sort().join(); bob = nb; if (pareil) break;
  }
  /* relais temporisés : le contact change après le délai, tant que la bobine reste alimentée */
  const trE = new Map(); R.alim.forEach(o => { if (o.k === "bobineT") trE.set(norm(o.lb), o); });
  trE.forEach((o, lb) => { if (!SIM.tdeb[lb]) SIM.tdeb[lb] = now; });
  let refaire = false; Object.keys(SIM.tdeb).forEach(lb => { if (!trE.has(lb)){ delete SIM.tdeb[lb]; if (SIM.tfini.delete(lb)) refaire = true; } });
  if (refaire && (prof || 0) < 3){ SIM.bob = bob; return simCalc((prof || 0) + 1); }
  const { U, HS } = R, pot = new Map(), potK = k => { const r = U.f(k); return HS.has(r) ? "h" : R.NS.has(r) ? "n" : ""; };
  fils.forEach(w => pot.set(w, potK(gk(w.p[0]))));
  if (PN && PN.type === "coupe"){ const w = PN.cible; pot.set(w, [potK(gk(w.p[0])), potK(gk(w.p[1]))]); }   /* fil coupé : chaque moitié garde la tension de son côté */
  /* trajet du courant (points jaunes) : de la source jusqu'à la charge, à travers la charge, puis jusqu'au retour */
  const adj = new Map(), aj = (a, b, o) => { if (!adj.has(a)) adj.set(a, []); adj.get(a).push([b, o]); };
  E.concat(R.paires).forEach(([a, b]) => { aj(a, b, null); aj(b, a, null); });
  [...R.alim].forEach(o => { const Pp = ports.get(o); aj(Pp[0], Pp[1], o); aj(Pp[1], Pp[0], o); });
  const chemin = (dep, buts, sauf) => { const vu = new Map([[dep, null]]), file = [dep];
    while (file.length){ const k = file.shift(); if (buts.has(k)){ const ch = []; for (let x = k; x !== null; x = vu.get(x)) ch.push(x); return ch; }
      (adj.get(k) || []).forEach(([n, o]) => { if (o !== sauf && (!o || o !== sauf) && !vu.has(n)){ vu.set(n, k); file.push(n); } }); } return null; };
  const srcH = new Set(hotS), srcN = new Set(neuS); R.trOn.forEach(o => { const Pp = ports.get(o); srcH.add(Pp[2]); srcN.add(Pp[3]); });
  const flux = [], vus = new Set(), seg = (a, b) => { const id = a + ">" + b; if (!vus.has(id)){ vus.add(id); flux.push([px(a), px(b)]); } };
  [...R.alim, ...R.trOn].forEach(o => { const Pp = ports.get(o); let c1 = chemin(Pp[0], srcH, o), ph = Pp[0], pn = Pp[1]; if (!c1){ c1 = chemin(Pp[1], srcH, o); ph = Pp[1]; pn = Pp[0]; }
    if (c1) for (let i = 0; i < c1.length - 1; i++) seg(c1[i], c1[i + 1]);          /* L1 (ou +) → charge */
    if (/^(resistance|chauffant|del|solenoide)$/.test(o.k)) seg(ph, pn);          /* les points ne passent pas sur le repère des bobines et lampes */
    const c2 = chemin(pn, srcN, o); if (c2) for (let i = c2.length - 1; i > 0; i--) seg(c2[i], c2[i - 1]); });   /* charge → L2 (ou −) */
  const minut = [...trE].map(([lb, o]) => ({ c:objGeo(o, W, Hc).P(1, 0).map(v => v / u), f:SIM.tfini.has(lb) ? 1 : Math.min(1, (now - SIM.tdeb[lb]) / ((o.del || 3) * 1000)), lb, d:o.del || 3 }));
  Object.assign(SIM, { bob, ferme:R.ferme, charges:R.alim, trOn:R.trOn, court:R.court, pot, flux, minut,
    moteurs:[...R.alim].filter(o => o.k === "moteur").map(o => objGeo(o, W, Hc).P(1, 0).map(v => v / u)), sonneries:[...R.alim].filter(o => o.k === "sonnerie").map(o => objGeo(o, W, Hc).P(1, 0).map(v => v / u)) });
}
function simAide(){
  const z = document.querySelector("#objBar .simAide"); if (!z) return;
  const noms = [...SIM.charges].map(o => (ELEC[o.k].c || ELEC[o.k].n).split(" (")[0].toLowerCase() + (o.lb ? " " + o.lb : ""));
  z.innerHTML = (SIM.court ? '<div class="court">⚠ Court-circuit ! L1 rejoint L2 sans passer par une charge.</div>' : "")
    + '<div>Clique un <b>bouton-poussoir</b> (garde-le enfoncé) ou un <b>interrupteur</b> pour l\'actionner.</div>'
    + '<div style="margin-top:4px"><span style="color:#ff8787">■</span> sous tension (L1) &nbsp;<span style="color:#74c0fc">■</span> retour (L2)</div>'
    + '<div style="margin-top:4px" class="' + (noms.length ? "on" : "") + '">' + (noms.length ? "En marche : " + noms.join(", ") : "Rien n'est alimenté.") + '</div>'
    + '<div class="panne"><div class="pt">🔧 Trouve la panne</div>'
    + (SIM.choix ? '<div class="pc">Clique le fil ou le symbole à briser (reclique pour changer le type de panne).</div>' : '')
    + (SIM.panne ? '<div class="pe">' + (SIM.panne.vu ? '⚠ ' + panneNom(SIM.panne) : 'Une panne est cachée dans le schéma.') + '</div>' : '')
    + '<div class="pb"><button data-p="hasard" title="Une panne au hasard, cachée aux élèves">🎲 Au hasard</button><button data-p="choisir" class="' + (SIM.choix ? "on" : "") + '" title="Clique toi-même le fil ou le symbole à briser">🎯 Choisir</button>'
    + (SIM.panne ? '<button data-p="voir">' + (SIM.panne.vu ? "🙈 Cacher" : "👁 Révéler") + '</button><button data-p="reparer">✔ Réparer</button>' : '') + '</div></div>';
}
function panneNom(pn){ const o = pn.cible, d = o.t === "objet" ? (ELEC[o.k].c || ELEC[o.k].n).split(" (")[0] + (o.lb ? " " + o.lb : "") : "";
  if (pn.type === "coupe") return "Fil coupé";
  if (pn.type === "colle") return d + " collé (reste fermé)";
  return SIM_CH.test(o.k) ? d + " grillé (circuit ouvert)" : o.k === "fusible" ? d + " sauté" : d + " défectueux (ne ferme plus)"; }
function panneTypes(o){ if (o.t === "ligne") return ["coupe"]; if (/^(contact|contactT|bp|thermostat|pression|flotteur|fincourse)$/.test(o.k) || (o.k === "inter" && polDe(o) !== "spdt" && polDe(o) !== "dpdt")) return /^(contact|contactT)$/.test(o.k) ? ["ouvert", "colle"] : ["ouvert"];
  if (SIM_CH.test(o.k) || /^(fusible|surcharge|inter)$/.test(o.k)) return ["ouvert"]; return []; }
function panneHasard(){
  const arr = strokes(), cands = [];
  arr.forEach(o => { if (o.t === "ligne" && o.fil){ if (SIM.pot.get(o)) cands.push([o, "coupe"]); } else if (o.t === "objet" && ELEC[o.k]) panneTypes(o).forEach(t => cands.push([o, t])); });
  if (!cands.length){ aviser("Dessine d'abord un circuit complet."); return; }
  const [cible, type] = cands[Math.floor(Math.random() * cands.length)]; SIM.panne = { cible, type, vu:false }; simMaj();
  aviser("Une panne est cachée dans le schéma. À vous de la trouver !", 4000);
}
function simMaj(){ simCalc(); redrawInk(); simAide(); }
function simOv(){ let ov = $("#simOv"); if (!ov){ ov = document.createElement("canvas"); ov.id = "simOv"; ov.style.cssText = "position:fixed;z-index:60;pointer-events:none"; $("#reader").appendChild(ov); } return ov; }
function simFrame(t){
  if (!RD.sim) return;
  if (SIM.key !== inkKey()){ simStop(true); return; }
  const ink = $("#inkCanvas"), ov = simOv(), S = $("#rstage").getBoundingClientRect(), r = ink.getBoundingClientRect(), dpr = DPRI();
  const w = Math.round(S.width * dpr), h = Math.round(S.height * dpr);
  if (ov.width !== w || ov.height !== h){ ov.width = w; ov.height = h; }
  Object.assign(ov.style, { left:S.left + "px", top:S.top + "px", width:S.width + "px", height:S.height + "px" }); ov.hidden = false;
  const g = ov.getContext("2d"), sx = r.width / ink.width; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, w, h);
  g.setTransform(dpr * sx, 0, 0, dpr * sx, dpr * (r.left - S.left), dpr * (r.top - S.top));
  const u = elecU(), esp = u / 3, ph = (t / 1000 * u * 1.2) % esp, R = Math.max(1.6, u * .055);   /* petits points, un peu plus serrés */
  g.fillStyle = "#ffd43b"; g.strokeStyle = "#8a6d00"; g.lineWidth = Math.max(.6, u * .015);
  SIM.flux.forEach(([a0, b0]) => { const a = [a0[0] * u, a0[1] * u], b = [b0[0] * u, b0[1] * u], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (!L) return;
    for (let d = ph; d < L; d += esp){ const x = a[0] + (b[0] - a[0]) * d / L, y = a[1] + (b[1] - a[1]) * d / L; g.beginPath(); g.arc(x, y, R, 0, 7); g.fill(); g.stroke(); } });
  g.strokeStyle = "#2b8a3e"; g.lineWidth = Math.max(2, u * .07); g.lineCap = "round";
  SIM.sonneries.forEach(([x0, y0]) => { const x = x0 * u, y = y0 * u; g.save(); g.strokeStyle = "#f08c00"; g.lineWidth = Math.max(1.5, u * .05); const ph2 = (t / 300) % 1;
    for (let i = 0; i < 2; i++){ const rr = u * (.55 + .25 * ((ph2 + i * .5) % 1)); g.globalAlpha = 1 - ((ph2 + i * .5) % 1); g.beginPath(); g.arc(x, y, rr, -2.4, -.75); g.stroke(); } g.restore(); });
  let attente = false;
  SIM.minut.forEach(m => { const f = SIM.tfini.has(m.lb) ? 1 : Math.min(1, (performance.now() - (SIM.tdeb[m.lb] || performance.now())) / (m.d * 1000)); if (f < 1) attente = true;
    g.save(); g.lineWidth = Math.max(3, u * .1); g.strokeStyle = "rgba(42,123,207,.25)"; g.beginPath(); g.arc(m.c[0] * u, m.c[1] * u, u * .58, 0, 7); g.stroke();
    g.strokeStyle = f >= 1 ? "#2f9e44" : "#2a7bcf"; g.beginPath(); g.arc(m.c[0] * u, m.c[1] * u, u * .58, -Math.PI / 2, -Math.PI / 2 + f * Math.PI * 2); g.stroke(); g.restore();
    if (f >= 1 && !SIM.tfini.has(m.lb)){ SIM.tfini.add(m.lb); setTimeout(simMaj, 0); } });
  if (attente && !(t % 4)) {}
  if (SIM.panne && (SIM.panne.vu || SIM.choix) && strokes().includes(SIM.panne.cible)){ const o = SIM.panne.cible, cv = $("#inkCanvas"); let cx, cy, rr;
    if (o.t === "ligne"){ cx = (o.p[0][0] + o.p[1][0]) / 2 * cv.width; cy = (o.p[0][1] + o.p[1][1]) / 2 * cv.height; rr = u * .5; }
    else { const G = objGeo(o, cv.width, cv.height); cx = (G.bbox[0] + G.bbox[2]) / 2; cy = (G.bbox[1] + G.bbox[3]) / 2; rr = Math.max(G.bbox[2] - G.bbox[0], G.bbox[3] - G.bbox[1]) * .62; }
    g.save(); g.strokeStyle = "#e03131"; g.lineWidth = Math.max(2, u * .08); g.setLineDash([u * .2, u * .12]); g.lineDashOffset = -t / 40; g.beginPath(); g.arc(cx, cy, rr, 0, 7); g.stroke();
    g.setLineDash([]); g.fillStyle = "#e03131"; g.font = "800 " + Math.round(u * .34) + "px system-ui,sans-serif"; g.textAlign = "center"; g.fillText(o.t === "ligne" ? "✂" : "⚠", cx, cy - rr - u * .12); g.restore(); }
  SIM.moteurs.forEach(([x0, y0]) => { const x = x0 * u, y = y0 * u; const a0 = t / 1000 * 4; for (let i = 0; i < 2; i++){ g.beginPath(); g.arc(x, y, u * .62, a0 + i * Math.PI, a0 + i * Math.PI + 1.6); g.stroke(); } });
  SIM.raf = requestAnimationFrame(simFrame);
}
function simStart(){
  if (!modeElec()) return; RD.sim = true; SELO.s = null; SIM.act = new Set(); SIM.press = new Set(); SIM.bob = {}; SIM.tdeb = {}; SIM.tfini = new Set(); SIM.panne = null; SIM.choix = false; SIM.key = inkKey();
  simMaj(); majObjUI(); cancelAnimationFrame(SIM.raf); SIM.raf = requestAnimationFrame(simFrame);
  aviser("Animation : clique un bouton-poussoir ou un interrupteur pour faire fonctionner le schéma.", 5000);
}
function simStop(silence){
  if (!RD.sim) return; RD.sim = false; cancelAnimationFrame(SIM.raf); const ov = $("#simOv"); if (ov) ov.hidden = true;
  SIM.flux = []; SIM.charges = new Set(); SIM.trOn = new Set(); redrawInk(); if (!silence) majObjUI();
}
(function(){
  const c = $("#inkCanvas");
  document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("#objBar .simAide [data-p]"); if (!b) return; const a = b.dataset.p;
    if (a === "hasard"){ SIM.choix = false; panneHasard(); }
    else if (a === "choisir"){ SIM.choix = !SIM.choix; simAide(); }
    else if (a === "voir" && SIM.panne){ SIM.panne.vu = !SIM.panne.vu; simAide(); }
    else if (a === "reparer"){ SIM.panne = null; SIM.choix = false; simMaj(); aviser("Circuit réparé."); } });
  c.addEventListener("pointerdown", e => {
    if (!RD.sim || !SIM.choix) return; e.preventDefault(); e.stopImmediatePropagation();
    const r = c.getBoundingClientRect(), x = (e.clientX - r.left) * c.width / r.width, y = (e.clientY - r.top) * c.height / r.height, u = elecU();
    let cible = strokes().slice().reverse().find(s => { if (s.t !== "objet" || !ELEC[s.k] || !panneTypes(s).length) return false; const G = objGeo(s, c.width, c.height); return x > G.bbox[0] && x < G.bbox[2] && y > G.bbox[1] && y < G.bbox[3]; });
    if (!cible) cible = strokes().find(f => { if (f.t !== "ligne" || !f.fil) return false; const ax = f.p[0][0] * c.width, ay = f.p[0][1] * c.height, bx = f.p[1][0] * c.width, by = f.p[1][1] * c.height, l2 = (bx - ax) ** 2 + (by - ay) ** 2;
      const t = l2 ? Math.max(0, Math.min(1, ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / l2)) : 0; return Math.hypot(x - ax - t * (bx - ax), y - ay - t * (by - ay)) < u * .3; });
    if (!cible){ aviser("Clique un fil ou un symbole."); return; }
    const types = panneTypes(cible); let type = types[0];
    if (SIM.panne && SIM.panne.cible === cible){ const i = types.indexOf(SIM.panne.type); if (i === types.length - 1){ SIM.panne = null; simMaj(); return; } type = types[i + 1]; }
    SIM.panne = { cible, type, vu:false }; simMaj(); }, true);
  c.addEventListener("pointerdown", e => {
    if (!RD.sim || SIM.choix) return; e.preventDefault();
    const r = c.getBoundingClientRect(), x = (e.clientX - r.left) * c.width / r.width, y = (e.clientY - r.top) * c.height / r.height, m = elecU() * .25;
    const o = strokes().slice().reverse().find(s => { if (s.t !== "objet" || !SIM_ACT.test(s.k)) return false; const G = objGeo(s, c.width, c.height); return x > G.bbox[0] - m && x < G.bbox[2] + m && y > G.bbox[1] - m && y < G.bbox[3] + m; });
    if (!o) return; c.setPointerCapture(e.pointerId);
    if (o.k === "bp"){ SIM.press.add(o); SIM.tenu = o; } else if (SIM.act.has(o)) SIM.act.delete(o); else SIM.act.add(o);
    simMaj();
  });
  ["pointerup", "pointercancel"].forEach(t => c.addEventListener(t, () => { if (SIM.tenu){ SIM.press.delete(SIM.tenu); SIM.tenu = null; if (RD.sim) simMaj(); } }));
})();

/* ---- Sauvegarde automatique des dessins et des tableaux (sur cet ordinateur) ----
   Un tableau blanc garde la taille de la surface où il a été dessiné (REFS) : s'il est rouvert sur un écran d'une autre
   taille, ses traits sont remis à la même échelle que la grille, sinon les fils ne tomberaient plus sur les bornes. */
const REFS = {}, CLE_SAUVE = "tableauxSauves";
const baseCanevas = () => { const c = $("#inkCanvas"), d = DPRI() * RD.z; return [c.width / d, c.height / d]; };
function recalerWb(){
  if (!RD.wb) return; const k = inkKey(), b = baseCanevas(), arr = INKS[k]; if (!b[0]) return;
  if (!REFS[k]){ REFS[k] = b; return; }
  const [rw, rh] = REFS[k]; if (Math.abs(rw - b[0]) < 1 && Math.abs(rh - b[1]) < 1) return;
  const fx = rw / b[0], fy = rh / b[1];
  const ech = L => (L || []).forEach(s => { if (s.p) s.p = s.p.map(q => [q[0] * fx, q[1] * fy]); if (s.bw) s.bw *= fx; if (s.bb) s.bb = [s.bb[0] * fx, s.bb[1] * fy]; });
  ech(arr);
  /* 13 nov. : les étapes d'Annuler suivent aussi (avant, elles étaient effacées à chaque changement de taille du tableau : au TNI, Ctrl+Z ne marchait que 1 ou 2 fois) */
  (UNDO[k] || []).forEach(ech); (REDO[k] || []).forEach(ech);
  REFS[k] = b;
}
const arrondir = v => typeof v === "number" ? Math.round(v * 1e5) / 1e5 : Array.isArray(v) ? v.map(arrondir) : v;
const copieTraits = arr => (arr || []).map(s => { const o = {}; for (const k in s) if (k !== "cache") o[k] = (k === "p" || k === "bb" || k === "bw") ? arrondir(s[k]) : s[k]; return o; });
let sauveT = 0, sauveAvis = false;
function planifierSauvegarde(){ clearTimeout(sauveT); sauveT = setTimeout(() => { if (window.requestIdleCallback) requestIdleCallback(sauverTableaux, { timeout:2500 }); else sauverTableaux(); }, 1800); }   /* 17 nov. : 1,8 s + moment libre (avec beaucoup de tableaux, l'enregistrement prend ~0,1 s sur ordinateur, plus au TNI) */
function sauverTableaux(){ if (RD.enTrait){ planifierSauvegarde(); return; }   /* jamais pendant un trait : ça le faisait saccader */
  const inks = {}; for (const k in INKS) if (INKS[k] && INKS[k].length) inks[k] = copieTraits(INKS[k]);
  try { localStorage.setItem(CLE_SAUVE, JSON.stringify({ v:1, inks, wb:WB, refs:REFS })); sauveAvis = false; }
  catch(e){ if (!sauveAvis){ sauveAvis = true; const m = "Mémoire pleine : tes derniers traits ne sont plus enregistrés. Supprime de vieux tableaux (menu Plus) ou enregistre-les dans « Mes schémas ».";
    aviser(m, 6000); try { let d = document.getElementById("wbPlein"); if (!d){ d = document.createElement("div"); d.id = "wbPlein"; d.style.cssText = "position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:100001;background:#B5574D;color:#fff;padding:12px 18px;border-radius:12px;font:600 15px system-ui;max-width:min(680px,92vw);box-shadow:0 6px 24px rgba(0,0,0,.35);cursor:pointer"; d.onclick = () => d.remove(); document.body.append(d); } d.textContent = m; setTimeout(() => d && d.remove(), 12000); } catch(x){} } }
}
(function(){ try { const d = JSON.parse(localStorage.getItem(CLE_SAUVE) || "null"); if (!d) return;
  Object.assign(INKS, d.inks || {}); Object.assign(WB, d.wb || {}); Object.assign(REFS, d.refs || {}); } catch(e){} })();
window.addEventListener("pagehide", () => { try { sauverTableaux(); } catch(e){} });

/* ---- Mes schémas et modèles ---- */
const CLE_SCH = "mesSchemas";
const lireSch = () => { try { return JSON.parse(localStorage.getItem(CLE_SCH) || "[]"); } catch(e){ return []; } };
const ecrireSch = l => { try { localStorage.setItem(CLE_SCH, JSON.stringify(l)); return true; } catch(e){ aviser("Mémoire pleine : exporte un schéma puis supprime-le de la liste.", 6000); return false; } };
/* modèles : coordonnées en carreaux ; [type, x, y, options] et fils [[x1, y1], [x2, y2]] */
const MODELES = [
  { id:"marche-arret", nom:"Marche-arrêt avec maintien", txt:"PB1 arrêt (NF), PB2 marche (NO), surcharge, bobine M et contact de maintien; lampes verte (en marche) et rouge (arrêté).",
    sz:[18, 8], o:[["bp", 1, 1, { lb:"PB1", nf:1 }], ["bp", 4, 1, { lb:"PB2" }], ["surcharge", 10, 1], ["bobine", 14, 1, { lb:"M" }], ["contact", 4, 3, { lb:"M" }],
      ["contact", 6, 5, { lb:"M" }], ["lampe", 14, 5, { lb:"G" }], ["contact", 6, 7, { lb:"M", nf:1 }], ["lampe", 14, 7, { lb:"R" }], ["jonction", 3, 1], ["jonction", 6, 1]],
    f:[[[0,1],[1,1]], [[3,1],[4,1]], [[6,1],[10,1]], [[12,1],[14,1]], [[16,1],[18,1]], [[3,1],[3,3]], [[3,3],[4,3]], [[6,3],[6,1]],
      [[0,5],[6,5]], [[8,5],[14,5]], [[16,5],[18,5]], [[0,7],[6,7]], [[8,7],[14,7]], [[16,7],[18,7]]] },
  { id:"chauffage", nom:"Chauffage 24 V : thermostat, limite et brûleur", txt:"Le thermostat et l'aquastat de limite haute commandent le relais CR1, qui ouvre la soupape de gaz et démarre le circulateur.",
    sz:[18, 6], lb:"R / C", o:[["thermostat", 2, 1, { lb:"TH" }], ["thermostat", 7, 1, { lb:"HL", nf:1 }], ["bobine", 14, 1, { lb:"CR1" }],
      ["contact", 6, 3, { lb:"CR1" }], ["solenoide", 14, 3, { lb:"GV" }], ["contact", 6, 5, { lb:"CR1" }], ["moteur", 14, 5, { lb:"P" }]],
    f:[[[0,1],[2,1]], [[4,1],[7,1]], [[9,1],[14,1]], [[16,1],[18,1]], [[0,3],[6,3]], [[8,3],[14,3]], [[16,3],[18,3]], [[0,5],[6,5]], [[8,5],[14,5]], [[16,5],[18,5]]] },
  { id:"puisard", nom:"Pompe de puisard et alarme de niveau haut", txt:"Le flotteur FS1 démarre la pompe; si l'eau monte encore, FS2 fait sonner l'alarme. Fusible de protection sur la pompe.",
    sz:[18, 4], o:[["fusible", 2, 1, { lb:"F1" }], ["flotteur", 7, 1, { lb:"FS1" }], ["moteur", 14, 1, { lb:"P" }], ["flotteur", 7, 3, { lb:"FS2" }], ["sonnerie", 14, 3, { lb:"BZ" }]],
    f:[[[0,1],[2,1]], [[4,1],[7,1]], [[9,1],[14,1]], [[16,1],[18,1]], [[0,3],[7,3]], [[9,3],[14,3]], [[16,3],[18,3]]] },
  { id:"temporise", nom:"Démarrage temporisé", txt:"S1 alimente le relais temporisé TR1 (5 s) : la lampe ambre s'éteint et le moteur démarre après le délai.",
    sz:[18, 6], o:[["inter", 4, 1, { lb:"S1" }], ["bobineT", 14, 1, { lb:"TR1", del:5 }], ["contactT", 6, 3, { lb:"TR1" }], ["moteur", 14, 3, { lb:"M" }], ["contactT", 6, 5, { lb:"TR1", nf:1 }], ["lampe", 14, 5, { lb:"A" }]],
    f:[[[0,1],[4,1]], [[6,1],[14,1]], [[16,1],[18,1]], [[0,3],[6,3]], [[8,3],[14,3]], [[16,3],[18,3]], [[0,5],[6,5]], [[8,5],[14,5]], [[16,5],[18,5]]] },
  { id:"selecteur", nom:"Sélecteur deux positions (SPDT)", txt:"Un interrupteur SPDT allume la lampe rouge au repos, ou la lampe verte quand on le bascule.",
    sz:[18, 4], o:[["inter", 4, 1, { lb:"S1", pol:"spdt" }], ["lampe", 14, 1, { lb:"R" }], ["lampe", 14, 3, { lb:"G" }]],
    f:[[[0,1],[4,1]], [[6,1],[14,1]], [[16,1],[18,1]], [[6,2],[6,3]], [[6,3],[14,3]], [[16,3],[18,3]]] },
  { id:"cc", nom:"Circuit c.c. : pile, résistance et DEL", txt:"Une pile, un interrupteur, une résistance qui limite le courant et une DEL, en série.",
    o:[["pile", 0, 4, { lb:"B1" }], ["inter", 0, 1, { lb:"S1" }], ["resistance", 4, 1, { lb:"R1" }], ["del", 8, 1, { lb:"DEL1" }]],
    f:[[[0,4],[0,1]], [[2,1],[4,1]], [[6,1],[8,1]], [[10,1],[10,4]], [[10,4],[2,4]]] }
];
function nouveauTableau(fond){ if (!RD.wb) toggleWb(); const st = wbEtat(); if (strokes().length){ st.count++; st.n = st.count; } st.bg[st.n] = fond || st.bg[st.n] || "blanc"; majFond(); redrawInk(); refreshTools(); }
/* Modèles du plan isométrique : objets [clé, m, n, miroir, debout, hauteur] et tuyaux [couleur, [[m, n, h], …]] en pas de la grille iso */
const ROUGE_ISO = "#e03131", BLEU_ISO = "#1c7ed6";
const MODELES_ISO = [
  { id:"iso-pompe", nom:"Pompe avec vannes d'isolement", txt:"Une conduite avec une vanne de chaque côté de la pompe circulatrice, pour la sortir sans vider le système.",
    o:[["vanne", 2, 0], ["pompe", 5, 0], ["vanne", 8, 0]],
    t:[[ROUGE_ISO, [[0, 0, 0], [2, 0, 0]]], [ROUGE_ISO, [[3, 0, 0], [5, 0, 0]]], [ROUGE_ISO, [[6, 0, 0], [8, 0, 0]]], [ROUGE_ISO, [[9, 0, 0], [11, 0, 0]]]] },
  { id:"iso-radiateur", nom:"Radiateur avec vannes", txt:"Départ (rouge) avec une vanne, radiateur, retour (bleu) avec une vanne à boisseau.",
    o:[["vanne", 1, 0], ["radiateur", 3, 0], ["boisseau", 6, 0]],
    t:[[ROUGE_ISO, [[-1, 0, 0], [1, 0, 0]]], [ROUGE_ISO, [[2, 0, 0], [3, 0, 0]]], [BLEU_ISO, [[5, 0, 0], [6, 0, 0]]], [BLEU_ISO, [[7, 0, 0], [9, 0, 0]]]] },
  { id:"iso-boucle", nom:"Boucle de chauffage avec plinthes", txt:"Chaudière, pompe sur le départ, deux plinthes chauffantes, vanne et vase d'expansion sur le retour.",
    o:[["chaudiere", 0, 0], ["pompe", -2, 1], ["plinthe", -4, 8, 1], ["plinthe", -3, 10], ["vanne", 1, 4, 1], ["vase", 1, 6]],
    t:[[ROUGE_ISO, [[0, 1, 0], [-1, 1, 0]]], [ROUGE_ISO, [[-2, 1, 0], [-4, 1, 0], [-4, 5, 0]]], [ROUGE_ISO, [[-4, 8, 0], [-4, 10, 0], [-3, 10, 0]]],
       [BLEU_ISO, [[0, 10, 0], [1, 10, 0], [1, 4, 0]]], [BLEU_ISO, [[1, 3, 0], [1, 2, 0]]]] },
  { id:"iso-2zones", nom:"Chauffage sur 2 étages avec vannes de zone", txt:"Chaudière, pompe, deux zones commandées par des vannes motorisées : plinthe et radiateur au rez-de-chaussée; colonne montante, radiateur et plinthe à l'étage; retour commun avec vanne et vase d'expansion.",
    o:[["chaudiere", 0, 0], ["pompe", -3, 1], ["vannemot", -5, 4, 1], ["plinthe", -5, 9, 1], ["radiateur", -3, 11], ["vannemot", -7, 1, 0, 1, 1], ["radiateur", -12, 1, 0, 0, 4], ["plinthe", -13, -3, 0, 0, 4], ["vanne", 1, 4, 1], ["vase", 1, 6]],
    t:[[ROUGE_ISO, [[0, 1, 0], [-2, 1, 0]]], [ROUGE_ISO, [[-3, 1, 0], [-7, 1, 0]]], [ROUGE_ISO, [[-5, 1, 0], [-5, 3, 0]]], [ROUGE_ISO, [[-5, 4, 0], [-5, 6, 0]]],
       [BLEU_ISO, [[-5, 9, 0], [-5, 11, 0], [-3, 11, 0]]], [BLEU_ISO, [[-1, 11, 0], [1, 11, 0], [1, 4, 0]]], [BLEU_ISO, [[1, 3, 0], [1, 2, 0]]],
       [ROUGE_ISO, [[-7, 1, 0], [-7, 1, 1]]], [ROUGE_ISO, [[-7, 1, 2], [-7, 1, 4], [-10, 1, 4]]], [BLEU_ISO, [[-12, 1, 4], [-14, 1, 4], [-14, -3, 4], [-13, -3, 4]]],
       [BLEU_ISO, [[-10, -3, 4], [-9, -3, 4], [-9, -3, 0], [-9, 12, 0], [1, 12, 0], [1, 11, 0]]]] },
  { id:"iso-radiant", nom:"Plancher radiant avec collecteur 4 boucles", txt:"Chaudière, pompe et vanne 3 voies (eau tempérée), collecteur à 4 boucles de plancher radiant, retour vers la chaudière avec dérivation vers la vanne 3 voies et vase d'expansion.",
    o:[["collecteur4", 0, 0], ["vanne3", -5, 0], ["pompe", -8, 0], ["chaudiere", -12, -3], ["vase", -8, 3]],
    t:[[ROUGE_ISO, [[-12, -2, 0], [-13, -2, 0], [-13, 0, 0], [-8, 0, 0]]], [ROUGE_ISO, [[-7, 0, 0], [-5, 0, 0]]], [ROUGE_ISO, [[-3, 0, 0], [-1, 0, 0]]],
       [BLEU_ISO, [[-1, 1, 0], [-1, 3, 0], [-11, 3, 0], [-11, -1, 0]]], [BLEU_ISO, [[-4, 3, 0], [-4, 1, 0]]],
       ...[0, 1, 2, 3].map(i => ["#f08c00", [[i + 1, 0, 0], [i + 1, i - 5, 0], [9 - i, i - 5, 0], [9 - i, 6 - i, 0], [i + 1, 6 - i, 0], [i + 1, 1, 0]]])] }
];
function poserModeleIso(m){
  nouveauTableau("iso");
  const c = $("#inkCanvas"), r = c.getBoundingClientRect(), S = $("#rstage").getBoundingClientRect(), W = c.width, H = c.height, k = W / r.width, a = 34 * RD.z * 1.2 * k, d = a * .8660254;
  const pts = m.o.map(o => [o[1], o[2], o[5] || 0]).concat(m.o.map(o => [o[1], o[2], (o[5] || 0) + (o[0] === "chaudiere" ? 3 : 1.5)]), ...m.t.map(t => t[1])), rel = pts.map(([mm, nn, hh]) => [(mm + nn) * d, (nn - mm) * a / 2 - (hh || 0) * a]);   /* le modèle est centré dans l'écran (à droite de la palette) */
  const ob = $("#objBar"), gauche = ob && !ob.hidden && ob.offsetParent ? ob.getBoundingClientRect().right + 20 : S.left, mx = (Math.min(...rel.map(q => q[0])) + Math.max(...rel.map(q => q[0]))) / 2, my = (Math.min(...rel.map(q => q[1])) + Math.max(...rel.map(q => q[1]))) / 2;
  const cx = ((gauche + S.right) / 2 - r.left) * k - mx, cy = ((S.top + S.bottom) / 2 - r.top) * k - my - a, i0 = Math.round(cx / d), j0 = Math.round(cy / a - (i0 & 1) * .5);   /* origine sur un point de la grille */
  const x0 = i0 * d, y0 = (j0 + (i0 & 1) * .5) * a, G = (mm, nn, hh) => [(x0 + (mm + nn) * d) / W, (y0 + (nn - mm) * a / 2 - (hh || 0) * a) / H], arr = strokes();
  m.t.forEach(([col, pts]) => { for (let i = 0; i + 1 < pts.length; i++){ const n = { c:col, hl:false, hc:null, w:4, t:"ligne", p:[G(...pts[i]), G(...pts[i + 1])] }; (decouperIso(n) || [n]).forEach(x => arr.push(x)); } });
  m.o.forEach(([kk, mm, nn, mir, deb, hh]) => { const o = { t:"objet", k:kk, o:mir ? 1 : 0, c:"#24282c", p:[G(mm, nn, hh || 0)], w:4 }; if (deb) o.v = deb; arr.push(o); });
  REFS[inkKey()] = baseCanevas(); redrawInk();
  aviser("Modèle « " + m.nom + " » posé. Touche un objet pour le déplacer, double-clic pour ajouter un texte ou une cote.", 5000);
}
function poserModele(m){
  nouveauTableau("quad");
  const c = $("#inkCanvas"), r = c.getBoundingClientRect(), S = $("#rstage").getBoundingClientRect(), W = c.width, H = c.height, u = elecU(), f = r.width / W;
  const ob = $("#objBar"), gauche = ob && !ob.hidden ? Math.max(S.left, ob.getBoundingClientRect().right + 40) : S.left + 120;   /* à droite de la palette */
  const ox = Math.ceil((gauche - r.left) / f / u) + 1, oy = Math.ceil((S.top - r.top) / f / u) + 3;
  const P = (x, y) => [(ox + x) * u / W, (oy + y) * u / H], arr = strokes();
  if (m.sz) arr.push({ t:"objet", k:"rails", o:0, c:"#24282c", p:[P(0, 0)], w:4, sz:m.sz.slice(), lb:m.lb || "L1 / L2", v:m.v || "120 V c.a." });
  m.o.forEach(([k, x, y, ex]) => arr.push(Object.assign({ t:"objet", k, o:0, c:"#24282c", p:[P(x, y)], w:4, lb:ELEC[k].lb || "", nf:0 }, ex ? JSON.parse(JSON.stringify(ex)) : {})));
  m.f.forEach(([a, b]) => arr.push({ c:"#24282c", hl:false, hc:null, w:2.5, t:"ligne", fil:true, p:[P(...a), P(...b)] }));
  REFS[inkKey()] = baseCanevas(); redrawInk();
  if (!RD.obj){ RD.obj = true; RD.text = false; RD.eraser = false; refreshTools(); }
  aviser("Modèle « " + m.nom + " » posé. Appuie sur ▶ Animer le schéma pour le faire fonctionner.", 5000);
}
function ouvrirSchema(sc){
  nouveauTableau(sc.bg || "blanc"); const k = inkKey();
  INKS[k] = JSON.parse(JSON.stringify(sc.strokes || [])); REFS[k] = sc.ref ? sc.ref.slice() : baseCanevas(); UNDO[k] = []; REDO[k] = [];
  redrawInk(); aviser("« " + sc.nom + " » ouvert.");
}
function telecharger(nom, texte){ const blob = new Blob([texte], { type:"application/json" }), a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = nom;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
const nomFichier = t => (t || "schema").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "schema";
function ouvrirSchemas(){
  let ov = $("#schOv");
  if (!ov){
    ov = document.createElement("div"); ov.id = "schOv"; ov.className = "sch-ov"; ov.hidden = true;
    ov.innerHTML = '<div class="sch-box" role="dialog" aria-label="Mes schémas et modèles"><div class="sch-tete"><h2>Schémas</h2><button class="sch-x" data-a="fermer" aria-label="Fermer">✕</button></div>'
      + '<div class="sch-onglets"><button data-o="modeles" class="on">Modèles prêts à utiliser</button><button data-o="miens">Mes schémas</button></div>'
      + '<div class="sch-corps" data-o="modeles"></div><div class="sch-corps" data-o="miens" hidden></div></div>';
    $("#reader").appendChild(ov);
    ov.addEventListener("pointerdown", e => e.stopPropagation());
    ov.addEventListener("keydown", e => e.stopPropagation());
    ov.addEventListener("click", e => {
      if (e.target === ov) { ov.hidden = true; return; }
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.a === "fermer"){ ov.hidden = true; return; }
      if (b.dataset.o){ ov.querySelectorAll(".sch-onglets button").forEach(x => x.classList.toggle("on", x === b)); ov.querySelectorAll(".sch-corps").forEach(x => x.hidden = x.dataset.o !== b.dataset.o); return; }
      const l = lireSch(), i = +b.dataset.i;
      if (b.dataset.a === "modele"){ ov.hidden = true; poserModele(MODELES[i]); }
      else if (b.dataset.a === "modeleIso"){ ov.hidden = true; poserModeleIso(MODELES_ISO[i]); }
      else if (b.dataset.a === "garder"){ const inp = ov.querySelector("#schNom"), nom = inp.value.trim() || ("Tableau du " + new Date().toLocaleDateString("fr-CA"));
        if (!RD.wb || !strokes().length){ aviser("Le tableau est vide."); return; }
        l.unshift({ id:Date.now(), nom, date:new Date().toLocaleDateString("sv-SE"), bg:wbBg(), ref:REFS[inkKey()] || baseCanevas(), strokes:copieTraits(strokes()) });
        if (ecrireSch(l)){ inp.value = ""; remplir(); aviser("« " + nom + " » enregistré dans Mes schémas.");
          const g = ov.querySelector('[data-a="garder"]'); if (g){ const t0 = g.innerHTML; g.classList.add("fait"); g.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="ok" d="M5 12.5l4.5 4.5L19 7.5"/></svg> Enregistré !';
            setTimeout(() => { g.classList.remove("fait"); g.innerHTML = t0; }, 1800); } } }
      else if (b.dataset.a === "ouvrir"){ ov.hidden = true; ouvrirSchema(l[i]); }
      else if (b.dataset.a === "exporter"){ const sc = l[i]; telecharger(nomFichier(sc.nom) + ".schema.json", JSON.stringify({ type:"schema-pavillon", v:1, nom:sc.nom, date:sc.date, bg:sc.bg, ref:sc.ref, strokes:sc.strokes })); }
      else if (b.dataset.a === "renommer"){ const li = b.closest(".sch-it"), sp = li.querySelector(".sch-n"), inp = document.createElement("input"); inp.value = l[i].nom; inp.className = "sch-in"; sp.replaceWith(inp); inp.focus(); inp.select();
        const fin = ok => { if (ok && inp.value.trim()){ l[i].nom = inp.value.trim(); ecrireSch(l); } remplir(); };
        inp.addEventListener("keydown", e => { if (e.key === "Enter") fin(true); if (e.key === "Escape") fin(false); }); inp.addEventListener("blur", () => fin(true)); }
      else if (b.dataset.a === "supprimer"){ if (b.dataset.ok){ l.splice(i, 1); ecrireSch(l); remplir(); } else { b.dataset.ok = "1"; b.textContent = "Confirmer ?"; b.classList.add("danger"); setTimeout(() => { if (b.isConnected){ delete b.dataset.ok; b.textContent = "Supprimer"; b.classList.remove("danger"); } }, 3000); } }
      else if (b.dataset.a === "importer") ov.querySelector("#schFich").click();
    });
    ov.addEventListener("change", e => { if (e.target.id !== "schFich") return; const fs = [...e.target.files]; e.target.value = "";
      Promise.all(fs.map(f => f.text().then(t => { try { const d = JSON.parse(t); if (d.type !== "schema-pavillon" || !Array.isArray(d.strokes)) return null; return { id:Date.now() + Math.random(), nom:d.nom || f.name, date:d.date || new Date().toLocaleDateString("sv-SE"), bg:d.bg, ref:d.ref, strokes:d.strokes }; } catch(err){ return null; } })))
        .then(res => { const ok = res.filter(Boolean), l = lireSch(); ok.forEach(x => l.unshift(x)); if (ok.length && ecrireSch(l)) remplir(); aviser(ok.length ? ok.length + " schéma(s) importé(s)." : "Ce fichier n'est pas un schéma de la bibliothèque.", 4000); }); });
  }
  function apercu(sc){ /* petite vignette du tableau, avec les vrais symboles */
    const cv = document.createElement("canvas"), W = 300, H = 164; cv.width = W; cv.height = H; const g = cv.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, W, H);
    const ref = sc.ref || [1600, 900], css = q => [q[0] * ref[0], q[1] * ref[1]], pts = [];
    (sc.strokes || []).forEach(s => { if (!s.p) return; s.p.forEach(q => pts.push(css(q))); if (s.t === "objet" && ELEC[s.k]){ const [x, y] = css(s.p[0]), w = s.k === "rails" ? (s.sz || [8])[0] * 34 : s.k === "transfo" ? 136 : 68; pts.push([x + w, y + (s.k === "rails" ? (s.sz || [8, 10])[1] * 34 : 40)], [x, y - 34]); } });
    if (!pts.length) return cv;
    const x0 = Math.min(...pts.map(q => q[0])), x1 = Math.max(...pts.map(q => q[0])), y0 = Math.min(...pts.map(q => q[1])), y1 = Math.max(...pts.map(q => q[1]));
    const sc2 = Math.min((W - 16) / Math.max(1, x1 - x0), (H - 16) / Math.max(1, y1 - y0)), T = q => { const c = css(q); return [8 + (c[0] - x0) * sc2, 8 + (c[1] - y0) * sc2]; };
    g.lineCap = "round"; g.lineJoin = "round";
    (sc.strokes || []).forEach(s => { if (!s.p || s.t === "objet" || s.t === "texte") return; g.strokeStyle = s.fil ? "#24282c" : (s.c || "#24282c"); g.lineWidth = Math.max(1, (s.w || 2) * sc2 * .8);
      g.beginPath(); const q = s.p.map(T); if (s.t === "rect"){ g.rect(q[0][0], q[0][1], q[q.length - 1][0] - q[0][0], q[q.length - 1][1] - q[0][1]); } else q.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke(); });
    (sc.strokes || []).forEach(s => { if (s.t !== "objet") return; const p = T(s.p[0]);
      if (ELEC[s.k]){ try { dessinerElec(g, Object.assign({}, s, { p:[[p[0] / W, p[1] / H]], __u:34 * sc2 }), W, H, Math.max(.35, sc2), "#24282c"); } catch(e){} }
      else { g.fillStyle = "#2a7bcf"; g.fillRect(p[0] - 3, p[1] - 3, 6, 6); } });
    return cv; }
  function remplir(){
    const cats = [["Électricité : schémas en échelle (prêts à animer)", MODELES.map((m, i) => '<button class="sch-m" data-a="modele" data-i="' + i + '"><b>' + esc(m.nom) + '</b><span>' + esc(m.txt) + '</span></button>')],
      ["Plan isométrique : chauffage et plomberie", MODELES_ISO.map((m, i) => '<button class="sch-m" data-a="modeleIso" data-i="' + i + '"><b>' + esc(m.nom) + '</b><span>' + esc(m.txt) + '</span></button>')]];
    ov.querySelector('.sch-corps[data-o="modeles"]').innerHTML = '<p class="sch-aide">Ouvre une catégorie, puis choisis un modèle : il est posé sur un nouveau tableau.</p>'   /* catégories repliées au départ */
      + cats.map(([t, l]) => '<details class="sch-cat"><summary>' + esc(t) + ' <span>(' + l.length + ')</span></summary><div class="sch-mod">' + l.join("") + '</div></details>').join("");
    const l = lireSch(), z = ov.querySelector('.sch-corps[data-o="miens"]');
    z.innerHTML = '<div class="sch-gard"><input id="schNom" placeholder="Nom du tableau affiché (ex. Démarreur moteur)" maxlength="60"><button data-a="garder" class="prim">Enregistrer ce tableau</button></div>'
      + '<p class="sch-aide">Tes tableaux sont aussi gardés automatiquement sur cet ordinateur. Ici, tu leur donnes un nom pour les retrouver, et « Exporter » crée un fichier à apporter sur un autre ordinateur ou à donner à un collègue.</p>'
      + '<div class="sch-liste">' + (l.length ? l.map((sc, i) => '<div class="sch-it"><div class="sch-v" data-v="' + i + '"></div><div class="sch-i"><span class="sch-n">' + esc(sc.nom) + '</span><small>' + esc(dateFr(sc.date)) + ' · ' + (sc.strokes || []).length + ' éléments</small>'
        + '<div class="sch-b"><button data-a="ouvrir" data-i="' + i + '" class="prim">Ouvrir</button><button data-a="renommer" data-i="' + i + '">Renommer</button><button data-a="exporter" data-i="' + i + '">Exporter</button><button data-a="supprimer" data-i="' + i + '">Supprimer</button></div></div></div>').join("")
        : '<p class="sch-vide">Aucun schéma enregistré pour l\'instant.</p>') + '</div>'
      + '<div class="sch-imp"><button data-a="importer">Importer un fichier .schema.json</button><input type="file" id="schFich" accept=".json,application/json" multiple hidden></div>';
    z.querySelectorAll(".sch-v").forEach(v => v.appendChild(apercu(l[+v.dataset.v])));
  }
  remplir(); ov.hidden = false;
}
/* ---- Barre et souris des objets ---- */
const SELO = { s:null };
RD.objK = null; RD.objO = 0;   /* aucun outil au départ */
function majObjUI(){ const b = $("#objBar"); if (!b) return; b.hidden = !RD.obj;
  if (!RD.obj){ if (RD.formeK){ RD.formeK = null; } return; }
  /* onglet : Formes, Isométrique (fond iso) ou Électricité (fond quadrillé) */
  const isoBg = !!RD.wb && /^iso/.test(wbBg());
  if (!RD.objTab || (RD.objTab === "iso" && !isoBg) || (RD.objTab === "elec" && !modeElec())) RD.objTab = modeElec() ? "elec" : isoBg ? "iso" : "formes";
  if (RD.objTab !== "formes" && RD.objTab !== "plomb") RD.formeK = null;
  const tab = RD.objTab, el = tab === "elec"; RD.objK = el ? (RD.objKe || null) : (RD.objKi || null);   /* aucun outil par défaut : on choisit, déplace et nomme */
  b.querySelectorAll("[data-tab]").forEach(x => { x.classList.toggle("on", x.dataset.tab === tab); x.disabled = !/^(formes|plomb)$/.test(x.dataset.tab) && !RD.wb; x.setAttribute("aria-selected", x.dataset.tab === tab); });
  b.querySelectorAll(".grp").forEach(x => x.hidden = x.dataset.g !== tab); b.querySelectorAll(".grpE").forEach(x => x.hidden = !el);
  b.querySelectorAll("[data-f]").forEach(x => x.classList.toggle("on", x.dataset.f === RD.formeK));
  b.querySelector(".tit").textContent = el ? "Schéma électrique" : tab === "iso" ? "Objets isométriques" : tab === "plomb" ? "Plomberie en coupe" : "Formes"; b.classList.toggle("sim", !!RD.sim); $("#objSim").textContent = RD.sim ? "■ Arrêter l'animation" : "▶ Animer le schéma";
  b.querySelectorAll("[data-k]").forEach(x => x.classList.toggle("on", x.dataset.k === RD.objK));
  b.querySelectorAll("[data-fc]").forEach(x => x.classList.toggle("on", x.dataset.fc === (RD.filCol || "#24282c")));
  const se = SELO.s && strokes().includes(SELO.s) && ELEC[SELO.s.k] ? SELO.s : null, de = ELEC[se ? se.k : RD.objK] || null, bn = b.querySelector("#objNF"), bl = b.querySelector("#objL");
  const nfV = se ? !!se.nf : !!RD.objNF; bn.style.display = el && de && de.nf ? "" : "none"; bn.textContent = nfV ? "Normalement fermé (NF)" : "Normalement ouvert (NO)"; bn.classList.toggle("on", nfV);
  bl.style.display = se && de && de.lb ? "" : "none";
  const kc = se ? se.k : RD.objK, polV = se ? polDe(se) : (RD.objPol || "spst"), bpol = b.querySelector("#objPol");
  bpol.style.display = el && kc === "inter" ? "" : "none"; bpol.querySelectorAll("[data-pol]").forEach(x => x.classList.toggle("on", x.dataset.pol === polV));
  bpol.querySelectorAll("[data-pp]").forEach(x => x.classList.toggle("on", polV[0] === x.dataset.pp)); bpol.querySelectorAll("[data-pt]").forEach(x => x.classList.toggle("on", polV.slice(2) === x.dataset.pt));
  bpol.querySelector("[data-code]").textContent = "Symbole : " + POLES[polV];
  if (kc === "inter" && /dt$/.test(polV)) bn.style.display = "none";
  const bd = b.querySelector("#objDelW"); bd.style.display = se && se.k === "bobineT" ? "" : "none"; if (se && se.k === "bobineT" && document.activeElement !== b.querySelector("#objDel")) b.querySelector("#objDel").value = se.del || 3; if (se && document.activeElement !== bl) bl.value = se.lb || "";
  const sel = SELO.s && strokes().includes(SELO.s), sp = sel && SELO.s.k === "serpentin" ? SELO.s : null, pasV = sp ? (sp.pas || .5) : (RD.pas || .5), bp = b.querySelector("#objP");
  bp.style.display = (sp || RD.objK === "serpentin") ? "" : "none"; bp.textContent = "Tubes : " + (pasV >= 1 ? "30 cm" : "15 cm");
  ["objR", "objD"].forEach(id => b.querySelector("#" + id).style.display = sel || (id === "objD" && (window.SELM || []).some(x => strokes().includes(x))) ? "" : "none");   /* Supprimer aussi pour un groupe */
  { const bv = b.querySelector("#objV"); if (bv){ const o = sel ? SELO.s : null, ok = o && o.t === "objet" && DEBOUT_OK.test(o.k); bv.style.display = ok ? "" : "none"; if (ok) bv.textContent = !o.v ? "↕ Debout" : o.v > 0 ? "↕ Autre côté" : "↕ Couché"; } }
  if ((se && (se.k === "rails" || se.k === "jonction")) || (sel && FORMES[SELO.s.t])) b.querySelector("#objR").style.display = "none";
  b.querySelector("#objTaille").style.display = se && se.k === "rails" ? "" : "none"; }
(function(){
  const bar = document.createElement("div"); bar.id = "objBar"; bar.hidden = true;
  bar.style.cssText = "position:absolute;z-index:75;left:12px;top:70px;display:flex;flex-direction:column;gap:6px;width:184px;max-height:calc(100% - 150px);overflow-y:auto;overflow-x:hidden;padding:8px;border-radius:12px;background:rgba(14,14,15,.96);border:1px solid #2f2f33;color:#d4d4d8;font:600 .8rem system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.35)";
  bar.innerHTML = '<div class="tete" title="Glisse ici pour déplacer la palette"><span class="poig">⠿</span><span class="tit">Objets</span></div>'
    + '<div class="onglets" role="tablist"><button data-tab="formes" role="tab">Formes</button><button data-tab="iso" role="tab" title="Objets isométriques (plomberie, chauffage)">Iso</button><button data-tab="elec" role="tab">Électricité</button><button data-tab="plomb" role="tab" title="Plomberie en coupe : maison, tuyaux EF/EC, drain, appareils">Plomberie</button></div>'
    + '<button id="objSch" class="sch-btn" title="Enregistrer ce tableau, rouvrir un tableau enregistré, circuits prêts à utiliser"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-3px;margin-right:6px"><path d="M5 3h11l3 3v15H5z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/></svg>Mes modèles</button>'
    + '<div class="grp" data-g="formes"><div class="cgrid cform">' + Object.keys(FORMES).filter(k => !FORMES[k].pl).map(k => '<button data-f="' + k + '" title="' + FORMES[k].n + '"><canvas width="120" height="64"></canvas><span>' + FORMES[k].n + '</span></button>').join("") + '</div>'
    + '<div class="aide"><b>Touche</b> une forme pour la choisir, glisse pour la déplacer. <b>Double-clic</b> : cote ou nom.</div>'
    + '</div><div class="grp" data-g="plomb"><div class="cgrid cform">' + Object.keys(FORMES).filter(k => FORMES[k].pl).map(k => '<button data-f="' + k + '" title="' + FORMES[k].n + '"><canvas width="120" height="64"></canvas><span>' + FORMES[k].n + '</span></button>').join("") + '</div>'
    + '<div class="aide"><b>Maison</b> : touche puis clique. <b>Tuyaux</b> : glisse d\'un point à l\'autre. <b>Appareils</b> : un clic.</div></div>'
    + '<div class="grp" data-g="iso"><div class="cgrid ciso">' + Object.keys(OBJETS).map(k => '<button data-k="' + k + '" title="' + OBJETS[k].n + '"><canvas width="120" height="64"></canvas><span>' + OBJETS[k].n + '</span></button>').join("") + '</div>'
    + '<div class="aide"><b>Glisse</b> un objet sur le tableau : il se branche sur un tuyau. <b>Double-clic</b> : le nommer.</div></div>'
    + '<div class="grp" data-g="elec">' + ELEC_CAT.map(([cg, cn]) => '<button class="cat" data-cat="' + cg + '">' + cn + '</button><div class="cgrid" data-cat="' + cg + '">'
      + Object.keys(ELEC).filter(k => ELEC[k].g === cg).map(k => '<button data-k="' + k + '" title="' + ELEC[k].n.replace(/^[✎•] /, "") + '"><canvas width="120" height="64"></canvas><span>' + (ELEC[k].c || ELEC[k].n.replace(/^[✎•] /, "")) + '</span></button>').join("") + '</div>').join("") + '</div>'
    + '<div class="aide grpE">Pour relier : glisse d\'un <b>point bleu</b> à l\'autre</div>'
    + '<div class="filcols grpE"><span>Couleur des nouveaux fils</span><div>' + [["#24282c", "Noir"], ["#e03131", "Rouge"], ["#1c7ed6", "Bleu"], ["#adb5bd", "Blanc (gris)"], ["#2f9e44", "Vert (terre)"], ["#f2c200", "Jaune"], ["#f08c00", "Orange"], ["#8b5a2b", "Brun"]].map(([c, n]) => '<button data-fc="' + c + '" title="' + n + '" aria-label="' + n + '" style="background:' + c + '"></button>').join("") + '</div></div>'
    + '<button id="objP" title="Espacement des tubes du serpentin"></button><button id="objNF" title="Normalement ouvert ou normalement fermé"></button><div class="pol" id="objPol">' + Object.keys(POLES).map(p => '<button class="orig" data-pol="' + p + '" title="' + POLES[p] + '">' + p.toUpperCase() + '</button>').join("")
    + '<span class="pl">Pôles (circuits coupés)</span><button data-pp="s" title="1 pôle (unipolaire)">1 pôle</button><button data-pp="d" title="2 pôles (bipolaire)">2 pôles</button>'
    + '<span class="pl">Positions (directions)</span><button data-pt="st" title="1 position (unidirectionnel)">1 position</button><button data-pt="dt" title="2 positions (bidirectionnel)">2 positions</button><span class="pl" data-code></span></div><label class="del" id="objDelW">Délai <input id="objDel" type="number" min="1" max="60" step="1" value="3"> s</label><input id="objL" maxlength="10" placeholder="Repère" title="Repère du symbole (ex. CR1, M, PB2)" aria-label="Repère du symbole">'
    + '<div class="taille" id="objTaille"><span>Largeur</span><button data-t="w-1" title="Rapprocher L2">−</button><button data-t="w1" title="Éloigner L2">+</button><span>Hauteur</span><button data-t="h-1" title="Raccourcir l\'échelle">−</button><button data-t="h1" title="Allonger l\'échelle">+</button><em>ou glisse le carré bleu en bas à droite</em></div>'
    + '<div class="rang"><button id="objR" title="Pivoter l\'objet sélectionné">⟳ Pivoter</button><button id="objV" title="Mettre l\'objet debout (volant à gauche, puis à droite), puis couché">↕ Debout</button><button id="objD" title="Supprimer l\'objet sélectionné" aria-label="Supprimer">🗑</button></div>'
    + '<button id="objSim" class="grpE" title="Faire fonctionner le schéma : le courant circule, les bobines, lampes et moteurs s\'activent">▶ Animer le schéma</button><div class="simAide"></div><button id="objX">Terminé</button>';
  const st = document.createElement("style");
  st.textContent = '#objBar button{min-height:32px;padding:0 8px;border-radius:8px;border:1px solid #2f2f33;background:#18181a;color:#d4d4d8;cursor:pointer;font:inherit;text-align:left}#objBar button:hover{border-color:#6a6a70}#objBar button.on{background:#2a2a2d;border-color:#6aa9ff;color:#fff}'
    + '#objBar .tete{display:flex;align-items:center;gap:6px;cursor:grab;user-select:none;touch-action:none;padding:2px 0 4px 2px;position:sticky;top:-8px;z-index:2;background:rgb(14,14,15);margin:-8px -8px 0;padding:8px 8px 6px;color:#a1a1aa;font-size:.78rem;letter-spacing:.04em;text-transform:uppercase}#objBar .tete:active{cursor:grabbing}#objBar .poig{font-size:1.1rem;line-height:1}'
    + '#objBar #objF{margin-left:auto;flex:none;min-height:28px;width:28px;padding:0;display:flex;align-items:center;justify-content:center}#objBar.of{width:auto!important}#objBar.of .tit{display:none}'
    + '#objBar .onglets{display:grid;grid-template-columns:repeat(2,1fr);gap:3px;margin-bottom:4px}#objBar .onglets button{min-height:30px;padding:0 2px;text-align:center;font-size:.7rem;border-radius:7px}#objBar .onglets button.on{background:#1f6fc2;border-color:#1f6fc2;color:#fff}#objBar .onglets button[disabled]{opacity:.35;cursor:not-allowed}'
    + '#objBar .grp{display:flex;flex-direction:column;gap:4px}#objBar .grp[hidden],#objBar .grpE[hidden]{display:none!important}'
    + '#objBar .sch-btn{text-align:center!important;background:#1f6fc2!important;border-color:#1f6fc2!important;color:#fff!important;margin-bottom:4px}#objBar .cat{background:transparent!important;border:0!important;color:#a1a1aa!important;font-size:.72rem;text-transform:uppercase;letter-spacing:.04em;min-height:26px!important;padding:0 2px!important;display:flex;align-items:center;gap:6px}#objBar .cat::before{content:"▾";font-size:.8rem;width:10px}#objBar .cat.ferme::before{content:"▸"}#objBar .cat:hover{color:#fff!important}'
    + '#objBar .cgrid{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:4px}#objBar .cgrid[hidden]{display:none}#objBar .pol{display:grid;grid-template-columns:1fr 1fr;gap:4px}#objBar .pol button{text-align:center;font-size:.78rem}#objBar .del{display:flex;align-items:center;gap:6px;font-size:.78rem}#objBar .del input{width:56px;min-height:30px;border-radius:8px;border:1px solid #2f2f33;background:#fff;color:#111;font:inherit;font-weight:700;padding:0 6px}'
    + '#objBar .cgrid button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;padding:4px 2px;min-height:50px;text-align:center;background:#f4f6f9;border-color:#d5dbe3;color:#1f2329;font-size:.68rem;line-height:1.1}'
    + '#objBar .cgrid button:hover{border-color:#6aa9ff}#objBar .cgrid button.on{background:#dbeafe;border-color:#2a7bcf;color:#0b3d75;box-shadow:inset 0 0 0 1px #2a7bcf}#objBar .cgrid canvas{width:60px;height:32px}'
    + '#objBar .aide{color:#9fc6f5;font-size:.68rem;line-height:1.25;padding:2px}#objBar .aide b{color:#6aa9ff}#objBar .rang{display:flex;gap:4px}#objBar .taille{display:grid;grid-template-columns:1fr 38px 38px;gap:4px;align-items:center;font-size:.74rem}#objBar .taille button{text-align:center;font-size:1.05rem;padding:0}#objBar .taille em{grid-column:1/-1;font-style:normal;font-size:.68rem;color:#9fc6f5}#objBar .rang button{flex:1;text-align:center}'
    + '#objBar .filcols{display:flex;flex-direction:column;gap:4px;font-size:.72rem;color:#a1a1aa;padding:2px}#objBar .filcols div{display:grid;grid-template-columns:repeat(4,1fr);gap:4px}#objBar .filcols button{min-height:26px!important;padding:0!important;border-radius:50%!important;border:2px solid #3a3a40!important}#objBar .filcols button.on{border-color:#6aa9ff!important;box-shadow:0 0 0 2px #6aa9ff}'
    + '#objBar .pol .orig{display:none}#objBar .pol .pp{display:contents}#objBar .pol .pl{grid-column:1/-1;font-size:.7rem;color:#a1a1aa;margin-top:2px}'
    + '#objBar details.plomb{margin-top:6px;border-top:1px solid #2f2f33;padding-top:6px}#objBar details.plomb summary{cursor:pointer;font-size:.74rem;letter-spacing:.04em;text-transform:uppercase;color:#a1a1aa;padding:4px 2px;list-style:none}#objBar details.plomb summary::before{content:"▸ ";}#objBar details.plomb[open] summary::before{content:"▾ ";}'
    + '#objBar #objL{min-height:32px;padding:0 8px;border-radius:8px;border:1px solid #2f2f33;background:#fff;color:#111;font:inherit;font-weight:700;text-transform:uppercase}'
    + '#objBar #objSim{background:#1f7a3f;border-color:#2f9e44;color:#fff;text-align:center}#objBar.sim #objSim{background:#a61e1e;border-color:#e03131}#objBar #objX{text-align:center}'
    + '#objBar .simAide{display:none;font-size:.74rem;line-height:1.35;color:#d4d4d8;padding:2px}#objBar.sim .simAide{display:block}#objBar .simAide .court{color:#ff8787;font-weight:800}#objBar .panne{margin-top:10px;padding-top:8px;border-top:1px solid #2f2f33}#objBar .panne .pt{font-weight:800;color:#fff;margin-bottom:4px}#objBar .panne .pc{color:#ffd43b;margin-bottom:4px}#objBar .panne .pe{color:#ff8787;font-weight:700;margin-bottom:4px}#objBar .panne .pb{display:grid;grid-template-columns:1fr 1fr;gap:4px}#objBar .panne .pb button{text-align:center;font-size:.74rem;padding:0 4px}#objBar .simAide .on{color:#8ce99a}';
  document.head.appendChild(st); $("#reader").appendChild(bar);
  bar.addEventListener("pointerdown", e => e.stopPropagation());
  /* catégories : on replie celles qu'on n'utilise pas (mémorisé) */
  let cats = { base:1, cmd:1, rel:1 }; try { cats = JSON.parse(localStorage.getItem("objCats") || "null") || cats; } catch(e){}
  const majCats = () => bar.querySelectorAll(".cat").forEach(h => { const o = !!cats[h.dataset.cat]; h.classList.toggle("ferme", !o); bar.querySelector('.cgrid[data-cat="' + h.dataset.cat + '"]').hidden = !o; });
  bar.querySelectorAll(".cat").forEach(h => h.onclick = () => { cats[h.dataset.cat] = cats[h.dataset.cat] ? 0 : 1; try { localStorage.setItem("objCats", JSON.stringify(cats)); } catch(e){} majCats(); });
  majCats();
  bar.querySelectorAll(".cgrid button").forEach(b => { const k = b.dataset.k, cv = b.querySelector("canvas"), g = cv.getContext("2d"), W = cv.width, H = cv.height;
    g.strokeStyle = "#24282c"; g.fillStyle = "#24282c"; g.lineWidth = 3; g.lineCap = "round";
    if (k === "fil"){ g.beginPath(); g.moveTo(14, 44); g.lineTo(60, 44); g.lineTo(60, 20); g.lineTo(106, 20); g.stroke(); g.fillStyle = "#2a7bcf"; [[14, 44], [106, 20]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 6, 0, 7); g.fill(); }); return; }
    if (k === "rails"){ g.lineWidth = 4; g.beginPath(); g.moveTo(26, 8); g.lineTo(26, 60); g.moveTo(94, 8); g.lineTo(94, 60); g.stroke(); g.lineWidth = 2.5; g.beginPath(); [24, 44].forEach(y => { g.moveTo(26, y); g.lineTo(94, y); }); g.stroke(); return; }
    if (k === "jonction"){ g.beginPath(); g.moveTo(20, 32); g.lineTo(100, 32); g.moveTo(60, 32); g.lineTo(60, 60); g.stroke(); g.beginPath(); g.arc(60, 32, 7, 0, 7); g.fill(); return; }
    if (k === "terre"){ dessinerElec(g, { t:"objet", k, p:[[.5, 14 / H]], lb:"", __u:40 }, W, H, 1.2, "#24282c"); return; }
    const U = k === "transfo" ? 17 : 34, w = k === "transfo" ? 4 : 2, y0 = k === "transfo" ? 18 : (k === "bp" ? 40 : k === "contactT" ? 44 : 36);
    if (k === "relais"){ dessinerElec(g, { t:"objet", k:"bobine", p:[[(W - 2 * 30) / 2 / W, 20 / H]], lb:"CR", __u:30 }, W, H, 1.2, "#24282c");
      dessinerElec(g, { t:"objet", k:"contact", p:[[(W - 2 * 22) / 2 / W, 50 / H]], lb:"", __u:22 }, W, H, 1, "#24282c"); return; }
    dessinerElec(g, { t:"objet", k, p:[[(W - w * U) / 2 / W, y0 / H]], lb:{ bobine:"CR", moteur:"M" }[k] || "", nf:0, __u:U }, W, H, 1.2, "#24282c"); });
  bar.querySelectorAll("[data-k]").forEach(b => b.onclick = ev => { if (b.dataset.glisse) return;
    if (ev && (ev.ctrlKey || ev.metaKey) && SELO.s && SELO.s.t === "objet" && strokes().includes(SELO.s) && !/^(fil|rails|jonction|serpentin|relais)$/.test(b.dataset.k) && SELO.s.k !== "rails" && SELO.s.k !== "serpentin"){ if (window.remplacerObjet(SELO.s, b.dataset.k)) return; }   /* Ctrl + vignette : remplace l'objet choisi */
    const k = b.dataset.k, deja = RD.objK === k; if (ELEC[k]) RD.objKe = deja ? null : k; else RD.objKi = deja ? null : k; RD.formeK = null; SELO.s = null; redrawInk(); majObjUI(); });
  /* glisser une vignette (objet iso ou symbole) jusqu'au tableau */
  bar.querySelectorAll(".cgrid [data-k]").forEach(b => { const k = b.dataset.k; if (/^(fil|rails|jonction|serpentin)$/.test(k)) return;
    b.style.touchAction = "pan-y"; let g0 = null, fant = null;
    b.addEventListener("pointerdown", e => { g0 = { x:e.clientX, y:e.clientY, id:e.pointerId }; try { b.setPointerCapture(e.pointerId); } catch(er){} });
    b.addEventListener("pointermove", e => { if (!g0) return;
      if (!fant){ if (Math.hypot(e.clientX - g0.x, e.clientY - g0.y) < 10) return;
        const cv = b.querySelector("canvas"); fant = document.createElement("div"); fant.style.cssText = "position:fixed;z-index:95;pointer-events:none;width:120px;height:64px;margin:-32px 0 0 -60px;border-radius:10px;background:rgba(255,255,255,.85);border:2px dashed #2a7bcf;box-shadow:0 8px 20px rgba(0,0,0,.3)";
        const im = document.createElement("img"); im.src = cv.toDataURL(); im.style.cssText = "width:100%;height:100%"; fant.appendChild(im); document.body.appendChild(fant); }
      fant.style.left = e.clientX + "px"; fant.style.top = e.clientY + "px";
      const cx = e.clientX, cy = e.clientY; if (!b.__raf) b.__raf = requestAnimationFrame(() => { b.__raf = 0; if (!fant) return; fant.style.opacity = apercuObjet(k, cx, cy) ? ".25" : "1"; }); });   /* l'objet apparaît à sa place sur le tableau */
    const fin = e => { if (fant){ fant.remove(); fant = null; if (e.type !== "pointerup"){ window.APERCU = null; redrawInk(); } b.dataset.glisse = "1"; setTimeout(() => delete b.dataset.glisse, 300); if (e.type === "pointerup") deposerObjet(k, e.clientX, e.clientY); } g0 = null; };
    b.addEventListener("pointerup", fin); b.addEventListener("pointercancel", fin); });
  /* vignettes des formes (dessinées avec le vrai moteur) */
  const P_FORME = { maison:[[.1, .06], [.9, .94]], tuyEF:[[.12, .5], [.88, .5]], tuyEC:[[.12, .5], [.88, .5]], tuyDR:[[.12, .5], [.88, .5]], tuyEV:[[.12, .5], [.88, .5]], tuyGZ:[[.12, .5], [.88, .5]], plCF:[[.15, .2], [.85, .8]], plCC:[[.15, .2], [.85, .8]], plBain:[[.15, .25], [.85, .8]], plEvier:[[.25, .12], [.75, .9]], cercle:[[.5, .5], [.8, .5]], bulle:[[.5, .5], [.68, .5]], angle:[[.25, .8], [.75, .2]], fleche:[[.15, .7], [.85, .3]], fleche2:[[.15, .5], [.85, .5]], cote:[[.15, .55], [.85, .55]], ligne:[[.15, .75], [.85, .25]] };
  bar.querySelectorAll("[data-f]").forEach(b => { const t = b.dataset.f, cv = b.querySelector("canvas"), g = cv.getContext("2d"), W = cv.width, H = cv.height, wb = RD.wb; RD.wb = false;
    try { drawStroke(g, { t, c:"#24282c", hl:false, hc:null, w:2.2, n:1, p:P_FORME[t] || [[.3, .15], [.7, .85]] }, W, H, 1); } catch(e){} RD.wb = wb;
    b.onclick = ev => { const o = SELO.s;
      if (ev && (ev.ctrlKey || ev.metaKey) && o && FORMES[o.t] && o.t !== t && strokes().includes(o)){                /* Ctrl + forme : la forme choisie change de type, même place et même taille */
        snapInk(); const C = ["cercle", "bulle"], W = $("#inkCanvas").width, H = $("#inkCanvas").height, [a, z] = o.p;
        if (C.includes(o.t) && !C.includes(t)){ const r = Math.hypot((z[0] - a[0]) * W, (z[1] - a[1]) * H); o.p = [[a[0] - r / W, a[1] - r / H], [a[0] + r / W, a[1] + r / H]]; }
        else if (!C.includes(o.t) && C.includes(t)){ const m = [(a[0] + z[0]) / 2, (a[1] + z[1]) / 2], r = Math.max(Math.abs(z[0] - a[0]) * W, Math.abs(z[1] - a[1]) * H) / 2; o.p = [m, [m[0] + r / W, m[1]]]; }
        o.t = t; if (t === "bulle" && !o.n) o.n = strokes().filter(x => x.t === "bulle").length; redrawInk(); majObjUI(); return; }
      RD.formeK = RD.formeK === t ? null : t; SELO.s = null; redrawInk(); majObjUI(); }; });
  /* (3 nov.) Plomberie : glisser une vignette jusqu'au tableau la pose (comme un clic à cet endroit, pour la maison, les appareils et les raccords) */
  bar.querySelectorAll('[data-g="plomb"] [data-f]').forEach(b => { const t = b.dataset.f, oc = b.onclick; let g0 = null, fant = null;
    b.style.touchAction = "pan-y"; b.onclick = ev => { if (b.dataset.glisse) return; oc.call(b, ev); };
    b.addEventListener("pointerdown", e => { g0 = { x:e.clientX, y:e.clientY }; try { b.setPointerCapture(e.pointerId); } catch(er){} });
    b.addEventListener("pointermove", e => { if (!g0) return;
      if (!fant){ if (Math.hypot(e.clientX - g0.x, e.clientY - g0.y) < 10) return;
        fant = document.createElement("div"); fant.style.cssText = "position:fixed;z-index:95;pointer-events:none;width:120px;height:64px;margin:-32px 0 0 -60px;border-radius:10px;background:rgba(255,255,255,.85);border:2px dashed #2a7bcf;box-shadow:0 8px 20px rgba(0,0,0,.3)";
        const im = document.createElement("img"); im.src = b.querySelector("canvas").toDataURL(); im.style.cssText = "width:100%;height:100%"; fant.appendChild(im); document.body.appendChild(fant); }
      fant.style.left = e.clientX + "px"; fant.style.top = e.clientY + "px"; });
    const fin = e => { if (fant){ fant.remove(); fant = null; b.dataset.glisse = "1"; setTimeout(() => delete b.dataset.glisse, 300);
        if (e.type === "pointerup"){ const c = $("#inkCanvas"), r = c.getBoundingClientRect(), bb = bar.getBoundingClientRect();
          if (c && e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom && !(e.clientX >= bb.left && e.clientX <= bb.right && e.clientY >= bb.top && e.clientY <= bb.bottom)){
            RD.formeK = t; SELO.s = null; majObjUI();
            const o = { bubbles:true, cancelable:true, clientX:e.clientX, clientY:e.clientY, pointerId:9001, pointerType:"mouse", isPrimary:true, button:0 };
            c.dispatchEvent(new PointerEvent("pointerdown", Object.assign({ buttons:1 }, o))); c.dispatchEvent(new PointerEvent("pointerup", Object.assign({ buttons:0 }, o))); } } } g0 = null; };
    b.addEventListener("pointerup", fin); b.addEventListener("pointercancel", fin); });
  /* vignettes des objets isométriques : on dessine l'objet à petite échelle puis on le centre */
  bar.querySelectorAll(".ciso [data-k]").forEach(b => { const k = b.dataset.k, cv = b.querySelector("canvas"), g = cv.getContext("2d"), W = cv.width, H = cv.height;
    const z0 = RD.z, dpr = DPRI();
    try { RD.z = 9 / (34 * 1.2 * dpr); const s0 = { t:"objet", k, p:[[0, 0]] }, G = objGeo(s0, W, H), bw = G.bbox[2] - G.bbox[0], bh = G.bbox[3] - G.bbox[1];
      const f = Math.min((W - 10) / Math.max(1, bw), (H - 8) / Math.max(1, bh)); RD.z *= Math.min(f, 3.5);
      const G2 = objGeo(s0, W, H), s1 = { t:"objet", k, p:[[(W / 2 - (G2.bbox[0] + G2.bbox[2]) / 2) / W, (H / 2 - (G2.bbox[1] + G2.bbox[3]) / 2) / H]] };
      dessinerObjet(g, s1, W, H, RD.z * dpr, "#3a424b"); } catch(e){} RD.z = z0; });
  /* onglets : Formes partout; Isométrique et Électricité changent le fond du tableau au besoin */
  bar.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => { const t = b.dataset.tab;
    if (t !== "formes" && t !== "plomb" && !RD.wb){ aviser("Les objets isométriques et les symboles électriques se posent sur le tableau blanc (bouton Tableau blanc)."); return; }
    RD.objTab = t; SELO.s = null;
    RD.formeK = null; RD.objKi = null; RD.objKe = null;
    if (t !== "formes" && t !== "plomb"){ const voulu = t === "iso" ? /^iso/ : /^quad$/;
      if (!voulu.test(wbBg())){ const av = inkKey(), avn = nomFond(wbBg()); wbEtat().bg[wbEtat().n] = t === "iso" ? "iso" : "quad"; majFond(); setTimeout(() => apresFond(av, avn), 50); aviser(t === "iso" ? "Fond : plan isométrique." : "Fond : quadrillé (schéma électrique en échelle)."); } }
    redrawInk(); refreshTools(); });
  bar.querySelectorAll("[data-fc]").forEach(x => x.onclick = () => { RD.filCol = x.dataset.fc; RD.objKe = "fil"; RD.objKi = null; SELO.s = null; majObjUI(); redrawInk(); aviser("Fil " + x.title.toLowerCase() + " : glisse d'un point bleu à l'autre.", 2500); });
  $("#objNF").onclick = () => { const s = SELO.s && strokes().includes(SELO.s) && ELEC[SELO.s.k] ? SELO.s : null;
    if (s){ snapInk(); s.nf = s.nf ? 0 : 1; RD.objNF = s.nf; redrawInk(); } else RD.objNF = RD.objNF ? 0 : 1; majObjUI(); };
  RD.lbK = {};
  bar.querySelectorAll("#objPol [data-pp], #objPol [data-pt]").forEach(x => x.onclick = () => { const se = SELO.s && strokes().includes(SELO.s) && SELO.s.k === "inter" ? SELO.s : null, cur0 = se ? polDe(se) : (RD.objPol || "spst");
    const pol = (x.dataset.pp || cur0[0]) + "p" + (x.dataset.pt || cur0.slice(2)); const bt = bar.querySelector('#objPol [data-pol="' + pol + '"]'); if (bt) bt.onclick(); });
  bar.querySelectorAll("#objPol [data-pol]").forEach(x => x.onclick = () => { const se = SELO.s && strokes().includes(SELO.s) && SELO.s.k === "inter" ? SELO.s : null;
    if (se){ snapInk(); const c = $("#inkCanvas"), av = objGeo(se, c.width, c.height).ports; se.pol = x.dataset.pol; const ap = objGeo(se, c.width, c.height).ports;
      strokes().forEach(t => { if (t.t !== "ligne" || !t.p) return; [0, 1].forEach(i => { const j = av.findIndex(q => Math.hypot(q[0] - t.p[i][0] * c.width, q[1] - t.p[i][1] * c.height) < 4); if (j >= 0 && ap[j]) t.p[i] = [ap[j][0] / c.width, ap[j][1] / c.height]; }); });
      redrawInk(); } RD.objPol = x.dataset.pol; majObjUI(); });
  const bdel = $("#objDel"); bdel.addEventListener("keydown", e => { e.stopPropagation(); if (e.key === "Enter") bdel.blur(); });
  bdel.addEventListener("change", () => { const se = SELO.s; if (!se || se.k !== "bobineT") return; snapInk(); se.del = Math.max(1, Math.min(60, Math.round(+bdel.value || 3))); bdel.value = se.del; redrawInk(); });
  const bl = $("#objL"); let lbSnap = false;
  bl.addEventListener("keydown", e => { e.stopPropagation(); if (e.key === "Enter" || e.key === "Escape") bl.blur(); });
  bl.addEventListener("focus", () => { lbSnap = false; });
  bl.addEventListener("input", () => { const s = SELO.s; if (!s || !ELEC[s.k]) return; if (!lbSnap){ snapInk(); lbSnap = true; }
    s.lb = s.k === "rails" ? bl.value : bl.value.toUpperCase(); RD.lbK[s.k] = s.lb; redrawInk(); });
  $("#objP").onclick = () => { const sp = SELO.s && strokes().includes(SELO.s) && SELO.s.k === "serpentin" ? SELO.s : null, nv = ((sp ? sp.pas : RD.pas) || .5) >= 1 ? .5 : 1;
    if (sp){ snapInk(); sp.pas = nv; redrawInk(); } RD.pas = nv; majObjUI(); };
  $("#objR").onclick = () => { const s = SELO.s; if (!s) return; snapInk(); const c = $("#inkCanvas"), W = c.width, H = c.height, av = objGeo(s, W, H).ports;
    s.o = s.o ? 0 : 1; RD.objO = s.o; const ap = objGeo(s, W, H).ports;             /* les fils et tuyaux raccordés suivent la rotation */
    strokes().forEach(t => { if (t.t !== "ligne" || !t.p) return; [0, 1].forEach(i => { const j = av.findIndex(q => Math.hypot(q[0] - t.p[i][0] * W, q[1] - t.p[i][1] * H) < 4); if (j >= 0) t.p[i] = [ap[j][0] / W, ap[j][1] / H]; }); });
    redrawInk(); };
  $("#objV").onclick = () => { const s = SELO.s; if (!s || s.t !== "objet" || !DEBOUT_OK.test(s.k)) return; snapInk(); const c = $("#inkCanvas"), W = c.width, H = c.height, av = objGeo(s, W, H).ports;
    const liens = []; strokes().forEach(t => { if (t.t !== "ligne" || !t.p) return; [0, 1].forEach(i => { const j = av.findIndex(q => Math.hypot(q[0] - t.p[i][0] * W, q[1] - t.p[i][1] * H) < 4); if (j >= 0) liens.push([t, i, t.p[i][0], t.p[i][1], j]); }); });
    const cotesV = liensCotes(s); s.v = !s.v ? 1 : s.v > 0 ? -1 : 0; const ap = objGeo(s, W, H).ports; if (cotesV) suivreCotes(cotesV, s);
    const libres = ap.map((q, j) => j).filter(j => !liens.some(([t, i]) => Math.hypot(ap[j][0] - t.p[i][0] * W, ap[j][1] - t.p[i][1] * H) < 4));
    const aRefaire = liens.filter(([t, i]) => !ap.some(q => Math.hypot(q[0] - t.p[i][0] * W, q[1] - t.p[i][1] * H) < 4));   /* bas ↔ haut : les raccords s'échangent, rien à refaire */
    aRefaire.forEach(l => { const [t, i] = l; let jb = libres[0], db = 1e9; libres.forEach(j => { const dd = Math.hypot(ap[j][0] - t.p[i][0] * W, ap[j][1] - t.p[i][1] * H); if (dd < db){ db = dd; jb = j; } });
      if (jb === undefined) return; libres.splice(libres.indexOf(jb), 1); t.p[i] = [ap[jb][0] / W, ap[jb][1] / H]; });
    if (aRefaire.length && window.redresserIso && /^iso/.test(wbBg())) redresserIso(s, aRefaire.map(l => l.slice(0, 4)));   /* les tuyaux se refont droits sur la grille */
    redrawInk(); majObjUI(); aviser(!s.v ? "Objet couché." : s.v > 0 ? "Objet debout, volant à gauche." : "Objet debout, volant à droite.", 2200); };
  $("#objD").onclick = () => effacerChoix();
  $("#objX").onclick = () => { RD.obj = false; refreshTools(); };
  (function(){ const h = bar.querySelector(".tete"); let d = null;
    const borner = (x, y) => { const R = $("#reader").getBoundingClientRect(); return [Math.max(4, Math.min(R.width - 60, x)), Math.max(4, Math.min(R.height - 40, y))]; };
    const poser = (x, y) => { [x, y] = borner(x, y); bar.style.left = x + "px"; bar.style.top = y + "px"; };
    try { const p = JSON.parse(localStorage.getItem("objPos") || "null"); if (p) requestAnimationFrame(() => poser(p[0], p[1])); } catch(e){}
    h.addEventListener("pointerdown", e => { if (e.target.closest("button")) return; const R = $("#reader").getBoundingClientRect(), b = bar.getBoundingClientRect(); d = [e.clientX - b.left + R.left, e.clientY - b.top + R.top]; h.setPointerCapture(e.pointerId); e.preventDefault(); });
    h.addEventListener("pointermove", e => { if (d) poser(e.clientX - d[0], e.clientY - d[1]); });
    ["pointerup", "pointercancel"].forEach(t => h.addEventListener(t, () => { if (!d) return; d = null; try { localStorage.setItem("objPos", JSON.stringify([parseFloat(bar.style.left), parseFloat(bar.style.top)])); } catch(e){} }));
  })();
  bar.querySelectorAll("#objTaille [data-t]").forEach(b => b.onclick = () => { const o = SELO.s; if (!o || o.k !== "rails") return; const t = b.dataset.t, d = +t.slice(1), [w, h] = o.sz || [8, 10];
    snapInk(); redimEchelle(o, t[0] === "w" ? w + d : w, t[0] === "h" ? h + d * 2 : h); redrawInk(); });
  $("#objSch").onclick = () => { ouvrirSchemas(); if (RD.objTab !== "elec"){ const b = document.querySelector('#schOv .sch-onglets [data-o="miens"]'); if (b) b.click(); } };   /* hors électricité : on ouvre « Mes schémas » (enregistrer ce tableau) */
  $("#objSim").onclick = () => { if (RD.sim) simStop(); else simStart(); };
  const c = $("#inkCanvas"); let mv = null;
  const cur = e => { const r = c.getBoundingClientRect(); let x = e.clientX - r.left, y = e.clientY - r.top;
    if (modeElec()){ const u = 34 * RD.z * (r.width / (c.offsetWidth || r.width)); return { raw:[x / r.width, y / r.height], snap:[Math.round(x / u) * u / r.width, Math.round(y / u) * u / r.height] }; }
    const k = r.width / (c.offsetWidth || r.width), a = (34 * RD.z) * 1.2 * k, d = a * .8660254, i0 = Math.round(x / d); let best = null;
    for (let i = i0 - 1; i <= i0 + 1; i++){ const yy = (Math.round(y / a - (i & 1 ? .5 : 0)) + (i & 1 ? .5 : 0)) * a, dd = Math.hypot(x - i * d, y - yy); if (!best || dd < best[0]) best = [dd, i * d, yy]; }
    return { raw:[(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height], snap:[best[1] / r.width, best[2] / r.height] }; };
  const majZone = () => { const r = c.getBoundingClientRect(), q1 = mv.q1 || mv.q0;
    if (!mv.box){ mv.box = document.createElement("div"); mv.box.style.cssText = "position:fixed;z-index:79;pointer-events:none;border-left:4px solid #24282c;border-right:4px solid #24282c;background:rgba(106,169,255,.10);outline:2px dashed #6aa9ff"; $("#reader").appendChild(mv.box); }
    const x0 = r.left + Math.min(q1[0], mv.q0[0]) * r.width, y0 = r.top + Math.min(q1[1], mv.q0[1]) * r.height;
    Object.assign(mv.box.style, { left:x0 + "px", top:y0 + "px", width:Math.abs(q1[0] - mv.q0[0]) * r.width + "px", height:Math.abs(q1[1] - mv.q0[1]) * r.height + "px" }); };
  /* borne la plus proche (symboles, rails, extrémités de fils) : l'aimant fait 0,6 carreau, assez gros pour le doigt sur le TNI */
  const borneProche = (raw, sauf) => { const x = raw[0] * c.width, y = raw[1] * c.height, lim = elecU() * .6; let best = null;
    strokes().forEach(s => { let pts = [];
      if (s.t === "objet" && ELEC[s.k]) pts = objGeo(s, c.width, c.height).ports.map(p => [p[0] / c.width, p[1] / c.height]);
      else if (s.t === "ligne" && s.fil && !(sauf && sauf.includes(s))) pts = s.p;
      pts.forEach(p => { const d = Math.hypot(p[0] * c.width - x, p[1] * c.height - y); if (d < lim && (!best || d < best[0])) best = [d, p]; }); });
    return best ? best[1].slice() : null; };
  const nouveauFil = (a, b, c0) => ({ c:c0 || RD.filCol || "#24282c", hl:false, hc:null, w:2.5, t:"ligne", fil:true, p:[a.slice(), b.slice()] });
  const longueur = (a, b) => Math.hypot((b[0] - a[0]) * c.width, (b[1] - a[1]) * c.height);
  /* fil en cours : un trait droit, ou deux (un coude) quand les bornes ne sont pas alignées ; le premier mouvement choisit le sens du coude */
  const tracerFil = () => { const arr = strokes(); mv.segs.forEach(f => { const i = arr.indexOf(f); if (i >= 0) arr.splice(i, 1); }); mv.segs = [];
    const A = mv.A, B = mv.B, dx = Math.abs(B[0] - A[0]) * c.width, dy = Math.abs(B[1] - A[1]) * c.height;
    if (dx < 2 && dy < 2) return;
    if (dx < 2 || dy < 2){ mv.segs = [nouveauFil(A, B)]; }
    else { const K = mv.dir === "v" ? [A[0], B[1]] : [B[0], A[1]]; mv.segs = [nouveauFil(A, K), nouveauFil(K, B)]; }
    mv.segs.forEach(f => arr.push(f)); };
  /* point de jonction automatique quand un fil arrive au milieu d'un autre fil (raccord en T) */
  const surFil = (p, f) => { const [a, b] = f.p, x = p[0] * c.width, y = p[1] * c.height, ax = a[0] * c.width, ay = a[1] * c.height, bx = b[0] * c.width, by = b[1] * c.height, m = 3;
    if (Math.abs(ay - by) < 1) return Math.abs(y - ay) < 2 && x > Math.min(ax, bx) + m && x < Math.max(ax, bx) - m;
    if (Math.abs(ax - bx) < 1) return Math.abs(x - ax) < 2 && y > Math.min(ay, by) + m && y < Math.max(ay, by) - m; return false; };
  const jonctionsAuto = segs => { const arr = strokes(), fils = arr.filter(f => f.t === "ligne" && f.fil), pts = [];
    segs.forEach(f => f.p.forEach(p => { if (fils.some(o => !segs.includes(o) && surFil(p, o))) pts.push(p); }));
    fils.filter(o => !segs.includes(o)).forEach(o => o.p.forEach(p => { if (segs.some(f => surFil(p, f))) pts.push(p); }));
    pts.forEach(p => { if (!arr.some(o => o.t === "objet" && o.k === "jonction" && longueur(o.p[0], p) < 3)) arr.push({ t:"objet", k:"jonction", o:0, c:"#24282c", p:[p.slice()], w:4 }); }); };
  const bout = (p, f) => f.p.some(e => longueur(e, p) < 2);
  const couperFils = o => { if (!ELEC[o.k] || /^(rails|jonction|terre)$/.test(o.k)) return; const P = objGeo(o, c.width, c.height).ports.map(p => [p[0] / c.width, p[1] / c.height]), arr = strokes();
    (o.k === "transfo" ? [[P[0], P[1]], [P[2], P[3]]] : ({ dpst:[[P[0], P[1]], [P[2], P[3]]], dpdt:[[P[0], P[1]], [P[3], P[4]]] }[polDe(o)] || [[P[0], P[1]]])).forEach(([A, B]) => arr.filter(f => f.t === "ligne" && f.fil).forEach(f => {
      let ax0; const W = c.width, H = c.height, hz = Math.abs(A[1] - B[1]) * H < 2, vt = Math.abs(A[0] - B[0]) * W < 2; if (!hz && !vt) return;
      f.p.forEach((e, i) => { const dA = longueur(e, A), dB = longueur(e, B), L = longueur(A, B);           /* un fil qui arrive au milieu du symbole : on le branche sur la borne la plus proche */
        if (dA > 2 && dB > 2 && Math.abs(dA + dB - L) < 2){ const o2 = f.p[1 - i], perp = hz ? Math.abs(o2[0] - e[0]) * W < 2 : Math.abs(o2[1] - e[1]) * H < 2;
          if (perp){ const D2 = A[ax0 = hz ? 0 : 1] > B[ax0] ? A : B, q = Math.abs(dA - dB) < 2 ? D2 : dA < dB ? A : B, d = q.slice(), o0 = o2.slice();   /* à égalité : la borne vers L2 (à droite ou en bas) */
            f.p[i] = d; f.p[1 - i] = hz ? [d[0], o0[1]] : [o0[0], d[1]]; arr.push(nouveauFil(f.p[1 - i], o0, f.c)); } } });   /* le fil se décale et un petit bout le rejoint à son autre bout */
      const [p0, p1] = f.p, ax = hz ? 0 : 1, au = ax ? 0 : 1, D = ax ? H : W;                     /* ax : l'axe du symbole (x si horizontal) */
      if (Math.abs(p0[au] - A[au]) * (ax ? W : H) > 2 || Math.abs(p1[au] - A[au]) * (ax ? W : H) > 2) return;   /* fil pas sur la même ligne */
      const lo = Math.min(A[ax], B[ax]), hi = Math.max(A[ax], B[ax]), f0 = Math.min(p0[ax], p1[ax]), f1 = Math.max(p0[ax], p1[ax]);
      if (f1 * D <= lo * D + 2 || f0 * D >= hi * D - 2) return;                                     /* ne passe pas sous le symbole */
      const pt = v => { const q = A.slice(); q[ax] = v; return q; }, morceaux = [];
      if ((lo - f0) * D > 3) morceaux.push(nouveauFil(pt(f0), pt(lo), f.c)); if ((f1 - hi) * D > 3) morceaux.push(nouveauFil(pt(hi), pt(f1), f.c));
      arr.splice(arr.indexOf(f), 1, ...morceaux); })); };
  const redimEchelle = (o, w, h, fixes) => { const W = c.width, H = c.height, u = elecU(), [w0] = o.sz || [8, 10]; w = Math.max(3, w); h = Math.max(2, h);
    const x2 = o.p[0][0] + w0 * u / W, nx = o.p[0][0] + w * u / W;
    (fixes || strokes().filter(f => f.t === "ligne" && f.fil).flatMap(f => [0, 1].filter(i => Math.abs(f.p[i][0] - x2) * W < 2).map(i => [f, i]))).forEach(([f, i]) => { f.p[i][0] = nx; });
    o.sz = [w, h]; };
  const nettoyerFils = () => { strokes().filter(o => o.t === "objet" && ELEC[o.k]).forEach(couperFils); nettoyerJonctions(); };   /* après chaque fil ou déplacement */
  /* point de jonction inutile (moins de 3 branchements) : il s'efface */
  const nettoyerJonctions = () => { const arr = strokes(), fils = arr.filter(f => f.t === "ligne" && f.fil);
    arr.filter(o => o.t === "objet" && o.k === "jonction").forEach(o => { const p = o.p[0]; let n = 0;
      fils.forEach(f => { if (bout(p, f)) n++; else if (surFil(p, f)) n += 2; });
      arr.filter(x => x.t === "objet" && ELEC[x.k] && x.k !== "jonction" && x.k !== "rails").forEach(x => objGeo(x, c.width, c.height).ports.forEach(q => { if (longueur([q[0] / c.width, q[1] / c.height], p) < 3) n++; }));
      if (n < 3){ const i = arr.indexOf(o); if (i >= 0) arr.splice(i, 1); } }); };
  window.nettoyerJonctions = nettoyerJonctions; window.borneProche = q => borneProche(q);
  window.remplacerObjet = (o, k) => { const el = !!ELEC[k]; if (el !== !!ELEC[o.k] || o.k === k) return false;
    snapInk(); const lb = ELEC[o.k] && o.lb === ELEC[o.k].lb ? null : o.lb; ["nf", "pol", "del", "vp", "vs"].forEach(x => delete o[x]); o.k = k;
    if (el){ completerObjet(o); if (lb && ELEC[k].lb && !/^(bobine|bobineT|contact|contactT)$/.test(k)) o.lb = lb; couperFils(o); nettoyerFils(); }
    else if (o.lb && !OBJETS[k]) delete o.lb;
    SELO.s = o; redrawInk(); majObjUI(); aviser("Remplacé par : " + (el ? ELEC[k].c || ELEC[k].n : OBJETS[k].n) + ". Les fils, tuyaux et cotes restent en place.", 3500); return true; };
  /* repère proposé : CR1, CR2… pour les bobines; un contact reprend le repère de la bobine choisie (ou de la dernière posée) */
  const etiqAuto = k => { const de = ELEC[k]; if (!de || !de.lb) return null; const arr = strokes(), norm = x => String(x || "").trim().toUpperCase();
    if (k === "bobine" || k === "bobineT" || k === "relais"){ const pre = k === "bobineT" ? "TR" : "CR", re = new RegExp("^" + pre + "(\\d+)$"); let m = 0;
      arr.forEach(o => { const r = re.exec(norm(o.lb)); if (r && /^(bobine|bobineT)$/.test(o.k)) m = Math.max(m, +r[1]); }); return pre + (m + 1); }
    if (k === "contact" || k === "contactT"){ const kb = k === "contact" ? "bobine" : "bobineT";
      if (SELO.s && SELO.s.k === kb && strokes().includes(SELO.s)) return SELO.s.lb;
      for (let i = arr.length - 1; i >= 0; i--) if (arr[i].k === kb && arr[i].lb) return arr[i].lb; }
    return RD.lbK[k] || de.lb; };
  const completerObjet = o => { const de = ELEC[o.k]; if (!de) return; const lb = etiqAuto(o.k); if (lb) o.lb = lb;
    if (o.k === "inter") o.pol = o.pol || RD.objPol || "spst"; if (o.k === "bobineT") o.del = 3; if (o.k === "transfo"){ o.vp = "120 V"; o.vs = "24 V"; } if (o.k === "rails" && o.v === undefined) o.v = "120 V c.a."; };
  /* relais complet : la bobine, puis un contact NO et un contact NF du même repère, à gauche, deux échelons plus bas */
  const poserRelais = (q, coul) => { const u = elecU(), lb = etiqAuto("relais"), arr = strokes(), dx = 6 * u / c.width, dy = 2 * u / c.height;
    const b0 = { t:"objet", k:"bobine", o:0, c:coul, p:[q.slice()], w:4, lb }, c1 = { t:"objet", k:"contact", o:0, c:coul, p:[[q[0] - dx, q[1] + dy]], w:4, lb, nf:0 }, c2 = { t:"objet", k:"contact", o:0, c:coul, p:[[q[0] - dx, q[1] + 2 * dy]], w:4, lb, nf:1 };
    arr.push(b0, c1, c2); [b0, c1, c2].forEach(couperFils); aviser("Relais " + lb + " : bobine A1-A2, contact NO 13-14 et contact NF 21-22. Déplace les contacts sur leurs échelons.", 6000); return b0; };
  /* objet supprimé : les fils ou les tuyaux qui y arrivaient sont reliés entre eux */
  window.reparerApresSuppression = o => { if (o.t !== "objet" || o.k === "rails" || o.k === "jonction") return; const W = c.width, H = c.height, P = objGeo(o, W, H).ports.map(q => [q[0] / W, q[1] / H]); if (P.length !== 2) return;
    const arr = strokes(), el = !!ELEC[o.k], lie = q => arr.find(f => (el ? f.t === "ligne" && f.fil : !f.fil && !f.hl && (!f.t || f.t === "ligne")) && f.p && f.p.some(e => longueur(e, q) < 4));
    const fa = lie(P[0]), fb = lie(P[1]); if (!fa || !fb) return;
    if (el) arr.push(nouveauFil(P[0], P[1], fa.c));
    else { const t = { c:fa.c, hl:false, hc:null, w:fa.w, t:"ligne", p:[P[0].slice(), P[1].slice()] }, seg = decouperIso(t); (seg || [t]).forEach(x => arr.push(x)); } };
  /* ---- Glisser un objet de la palette sur le tableau : il se branche tout seul sur un fil ou un tuyau tout près ----
     On essaie les points de grille autour de l'endroit lâché (et les deux sens) et on garde celui où le plus de bornes tombent sur un fil (électricité)
     ou sur un tuyau (isométrique). Le fil est ensuite coupé (couperFils); le bout de tuyau entre les deux raccords est enlevé (objet en ligne). */
  const tuyaux = () => strokes().filter(f => f.t === "ligne" && !f.fil && f.p && f.p.length === 2);
  const surTuyau = p => tuyaux().some(f => f.p.some(e => longueur(e, p) < 4));
  const entreTuyaux = o => { const P = objGeo(o, c.width, c.height).ports.map(p => [p[0] / c.width, p[1] / c.height]); if (P.length !== 2 || !P.every(surTuyau)) return;
    const [A, B] = P, W = c.width, H = c.height, dedans = e => distSeg([e[0] * W, e[1] * H], [A[0] * W, A[1] * H], [B[0] * W, B[1] * H], 1) < 2;
    const arr = strokes(); tuyaux().filter(f => dedans(f.p[0]) && dedans(f.p[1])).forEach(f => arr.splice(arr.indexOf(f), 1)); };
  const placer = (k, cx, cy) => {
    const el = !!ELEC[k], r = c.getBoundingClientRect(); if (cx < r.left || cx > r.right || cy < r.top || cy > r.bottom) return null;
    if (el ? !modeElec() : !/^iso/.test(wbBg())) return { mauvaisFond:true, el };
    const o = { t:"objet", k, o:0, c:/^hl/.test(RD.color) ? "#24282c" : RD.color, p:[cur({ clientX:cx, clientY:cy }).snap], w:4 };
    if (el){ completerObjet(o); if (ELEC[k].nf) o.nf = 0; if (k === "relais") o.k = "bobine"; }
    const fils = strokes().filter(f => f.t === "ligne" && f.fil);
    const branche = p => el ? fils.some(f => surFil(p, f) || bout(p, f)) : surTuyau(p);
    const pas = el ? elecU() * r.width / c.width : 34 * RD.z * 1.2 * (r.width / (c.offsetWidth || r.width)) * .55, vus = new Set(); let best = null;
    for (let dx = -3; dx <= 3; dx++) for (let dy = -3; dy <= 3; dy++){ const q = cur({ clientX:cx + dx * pas, clientY:cy + dy * pas }).snap, cle = q.map(v => v.toFixed(5)).join(); if (vus.has(cle)) continue; vus.add(cle);
      for (const ori of [0, 1]) for (const vv of (!el && DEBOUT_OK.test(k) ? [0, 1] : [0])){ const t = { ...o, p:[q], o:ori, v:vv }, P = objGeo(t, c.width, c.height).ports.map(pp => [pp[0] / c.width, pp[1] / c.height]), n = P.filter(branche).length;   /* sur un tuyau vertical, l'objet se pose debout */
        if (!n) continue; const d = Math.hypot(dx, dy) + ori * .01 + vv * .02, sc = n * 10 - d; if (!best || sc > best[0]) best = [sc, q, ori, n, vv]; } }
    if (best){ o.p = [best[1]]; o.o = best[2]; if (best[4]) o.v = best[4]; }
    return { o, best, el }; };
  window.apercuObjet = (k, cx, cy) => { const pl = k ? placer(k, cx, cy) : null; window.APERCU = pl && pl.o ? pl.o : null; redrawInk(); return !!window.APERCU; };
  window.deposerObjet = (k, cx, cy) => {
    window.APERCU = null; const pl = placer(k, cx, cy); if (!pl){ redrawInk(); return false; }
    if (pl.mauvaisFond){ aviser(pl.el ? "Les symboles électriques se posent sur le fond quadrillé." : "Les objets isométriques se posent sur le fond « plan isométrique ».", 4000); redrawInk(); return false; }
    const { o, best, el } = pl;
    snapInk(); let o2 = o;
    if (k === "relais"){ o2 = poserRelais(o.p[0], o.c); } else { strokes().push(o); if (el) couperFils(o); else if (best) entreTuyaux(o); }
    RD.objKi = null; RD.objKe = null; SELO.s = o2; redrawInk(); majObjUI();
    if (k !== "relais") aviser(best ? (el ? ELEC[k].n.replace(/^[✎•] /, "") : OBJETS[k].n) + " branché sur " + (el ? "le fil." : "le tuyau.") : "Posé. Glisse-le sur un " + (el ? "fil" : "tuyau") + " pour le brancher tout seul.", 3500);
    return true; };
  const touche = q => { const arr = strokes(); for (let i = arr.length - 1; i >= 0; i--){ const s = arr[i]; if (s.t !== "objet") continue; const G = objGeo(s, c.width, c.height), x = q[0] * c.width, y = q[1] * c.height;
    if (s.k === "rails"){ if (surRails(s, G, x, y, .1) && (RD.objK === "rails" || (y - G.oy) / G.u < .4)) return s; continue; }
    if (x >= G.bbox[0] - 4 && x <= G.bbox[2] + 4 && y >= G.bbox[1] - 4 && y <= G.bbox[3] + 4) return s; } return null; };
  /* objet iso déplacé ou mis debout : chaque tuyau branché (liens = [tuyau, bout, x0, y0]) est refait droit sur la grille iso */
  const redresserIso = window.redresserIso = (obj, liensIso) => {
      const W = c.width, H = c.height, dpr = DPRI(), a = 34 * RD.z * 1.2 * dpr, d = a * .8660254, arr = strokes();
      const AX = [[d, a / 2], [-d, a / 2], [0, a]];
      const cr = (u, v) => u[0] * v[1] - u[1] * v[0], dot = (u, v) => u[0] * v[0] + u[1] * v[1], N = q => [q[0] / W, q[1] / H], P = q => [q[0] * W, q[1] * H], pres = (u, v) => Math.hypot(u[0] - v[0], u[1] - v[1]) < 2;
      const sens = v => { let best = null; AX.forEach(A => [1, -1].forEach(sg => { const D = [A[0] * sg, A[1] * sg], k = dot(D, v) / (a * Math.hypot(v[0], v[1]) || 1); if (!best || k > best.k) best = { D, k }; })); return best.D; };
      const G = objGeo(obj, W, H), bx = G.bbox, ctr = [(bx[0] + bx[2]) / 2, (bx[1] + bx[3]) / 2];
      const dansObjet = (u, v) => { for (let t = .15; t < .9; t += .15){ const x = u[0] + (v[0] - u[0]) * t, y = u[1] + (v[1] - u[1]) * t; if (x > bx[0] + 3 && x < bx[2] - 3 && y > bx[1] + 3 && y < bx[3] - 3) return true; } return false; };
      const tuyaux = () => arr.filter(x => x.t === "ligne" && !x.fil && x.p && x.p.length === 2);
      const poser = (u, v, modele) => { if (pres(u, v)) return; const n = { c:modele.c, hl:false, hc:null, w:modele.w, t:"ligne", p:[N(u), N(v)] }; (decouperIso(n) || [n]).forEach(x => arr.push(x)); };
      /* trajet de F à K : tout droit, ou deux bouts sur deux axes iso (le plus court, sans traverser l'objet, vertical préféré) */
      const trajet = (F, K, arrivee) => { const v = [K[0] - F[0], K[1] - F[1]], L = Math.hypot(v[0], v[1]); if (L < 2) return { pts:[F, K], cout:0 };
        const cands = [];
        AX.forEach(A => { if (Math.abs(cr(A, v)) / (a * L) < .02) cands.push({ pts:[F, K], cout:L / a }); });
        AX.forEach(A1 => AX.forEach(A2 => { if (A1 === A2) return; const den = cr(A1, A2); const t1 = cr(v, A2) / den, t2 = cr(A1, v) / den, E = [F[0] + A1[0] * t1, F[1] + A1[1] * t1];
          let cout = Math.abs(t1) + Math.abs(t2) + .6;
          const D2 = [K[0] - E[0], K[1] - E[1]]; if (arrivee && dot(D2, arrivee) < -.6 * Math.hypot(D2[0], D2[1]) * Math.hypot(arrivee[0], arrivee[1])) cout += 4;                 /* le 2e bout ne doit pas revenir en arrière vers le raccord */
          if (dansObjet(F, E) || dansObjet(E, K)) cout += 20; cands.push({ pts:[F, E, K], cout }); }));
        return cands.sort((x, y) => x.cout - y.cout)[0]; };
      liensIso.forEach(([f, i]) => { if (!arr.includes(f)) return;
        const M = P(f.p[i]); let F = P(f.p[1 - i]);
        const autres = G.ports.filter(q => !pres(q, M)), ref = autres.length === 1 ? autres[0] : ctr;          /* objet à 2 raccords : l'axe va d'un raccord à l'autre */
        const out = sens([M[0] - ref[0], M[1] - ref[1]]), K = [M[0] + out[0], M[1] + out[1]];                /* le tuyau sort droit du raccord, vers l'extérieur de l'objet */
        const v = [M[0] - F[0], M[1] - F[1]]; if (Math.abs(cr(out, v)) < 2) return;                          /* glissé dans l'axe du raccord : rien à refaire (le tuyau sous l'objet est enlevé plus bas) */
        arr.splice(arr.indexOf(f), 1);
        let best = trajet(F, K, [-out[0], -out[1]]);
        for (let essai = 0; essai < 30; essai++){                                                           /* si le 1er bout repart sur le tuyau précédent, on raccourcit ce tuyau */
          const E = best.pts[1], prec = tuyaux().find(x => x.p.some(q => pres(P(q), F)));
          if (!prec || best.pts.length < 2) break; const o = P(prec.p.find(q => !pres(P(q), F)) || prec.p[0]), back = [o[0] - F[0], o[1] - F[1]], go = [E[0] - F[0], E[1] - F[1]];
          if (Math.hypot(...go) < 2 || Math.abs(cr(back, go)) > 2 || dot(back, go) <= 0) break;
          arr.splice(arr.indexOf(prec), 1); F = o; best = trajet(F, K, [-out[0], -out[1]]); }
        for (let j = 0; j + 1 < best.pts.length; j++) poser(best.pts[j], best.pts[j + 1], f);
        poser(K, M, f); });
      try { entreTuyaux(obj); } catch(er){}                                                              /* les bouts de tuyau restés sous l'objet disparaissent */
      redrawInk();
    };
  c.addEventListener("pointerdown", e => {
    if (!RD.obj || !RD.wb || RD.eraser || RD.sim || RD.objTab === "formes" || RD.objTab === "plomb") return;
    const q = cur(e), el = modeElec();
    { const o = touche(q.raw); if (o && ongletPour(o) !== RD.objTab){ e.stopImmediatePropagation(); if (choisirAutre(o)) tapElement(o, e); return; }
      if (!o && !(el && borneProche(q.raw))){ const f = formeSous(q.raw);
        if (f && el && f.fil && RD.objK !== "jonction"){ e.stopImmediatePropagation();          /* sur un fil : glisser = nouveau fil (avec jonction); simple clic = choisir le fil */
          snapInk(); const A = q.snap; mv = { fil:true, A, B:A, segs:[], dir:null, filSous:f }; SELO.s = null; tracerFil(); redrawInk(); majObjUI(); return; }
        if (f){ e.stopImmediatePropagation(); if (choisirAutre(f)) tapElement(f, e); return; } } }   /* le crayon ne doit pas recevoir ce même clic */
    if (el && SELO.s && SELO.s.k === "rails" && strokes().includes(SELO.s)){           /* poignée de l'échelle : on change sa largeur et sa hauteur */
      const o = SELO.s, G = objGeo(o, c.width, c.height), [w, h] = o.sz || [8, 10], cx = G.ox + w * G.u, cy = G.oy + h * G.u;
      if (Math.hypot(q.raw[0] * c.width - cx, q.raw[1] * c.height - cy) < G.u * .6){
        snapInk(); const x2 = o.p[0][0] + w * G.u / c.width;
        mv = { redim:o, w0:w, h0:h, q0:q.snap, fixes:strokes().filter(f => f.t === "ligne" && f.fil).flatMap(f => [0, 1].filter(i => Math.abs(f.p[i][0] - x2) * c.width < 2).map(i => [f, i])) };
        redrawInk(); return; }
    }
    if (!touche(q.raw) && !(el && borneProche(q.raw)) && (!RD.objK || (SELO.s && strokes().includes(SELO.s) && !/^(fil|rails|serpentin)$/.test(RD.objK)))){   /* clic à côté : rien de choisi, aucun outil */
      const avait = !!(SELO.s || RD.objK); SELO.s = null; if (RD.objK){ RD.objKi = null; RD.objKe = null; } if (avait){ redrawInk(); majObjUI(); } return; }
    if (el && RD.objK !== "jonction"){
      const b = borneProche(q.raw), h0 = b ? null : touche(q.raw);
      if (b || RD.objK === "fil"){                                    /* fil : on part d'une borne (ou d'un point de la grille avec l'outil Fil) */
        snapInk(); const A = b || q.snap; mv = { fil:true, A, B:A, segs:[], dir:null, surObjet:touche(q.raw) }; SELO.s = null; tracerFil(); redrawInk(); majObjUI(); return;
      }
    }
    let hit = touche(q.raw);
    if (el && RD.objK === "jonction" && hit && hit.k !== "jonction") hit = null;   /* un point de jonction se pose aussi sur la borne d'un symbole */
    if (hit){
      SELO.s = hit; RD.objO = hit.o || 0;
      const G = objGeo(hit, c.width, c.height), liens = [];                 /* extrémités de tuyaux posées sur un raccord */
      strokes().forEach(s => { if (s.t !== "ligne" || !s.p) return; [0, 1].forEach(i => { const px = s.p[i][0] * c.width, py = s.p[i][1] * c.height; if (G.ports.some(pt => Math.hypot(pt[0] - px, pt[1] - py) < 4)) liens.push([s, i]); }); });
      mv = { s:hit, q0:q.snap, p0:[hit.p[0][0], hit.p[0][1]], liens:liens.map(([s, i]) => [s, i, s.p[i][0], s.p[i][1]]), snap:false };
    } else if (RD.objK === "serpentin" || (el && RD.objK === "rails")){
      mv = { zone:true, q0:q.snap, el, raz:!!(SELO.s && strokes().includes(SELO.s)) };                                                         /* zone à remplir : on glisse d'un coin à l'autre */
    } else {
      snapInk(); const coul = /^hl/.test(RD.color) ? "#24282c" : RD.color;
      if (el && RD.objK === "relais"){ SELO.s = poserRelais(q.snap, coul); RD.objKe = null; redrawInk(); majObjUI(); return; }
      const o = { t:"objet", k:RD.objK, o:RD.objO, c:coul, p:[q.snap], w:4 };
      if (el){ const de = ELEC[RD.objK]; completerObjet(o); if (de.nf) o.nf = RD.objNF ? 1 : 0; if ((o.k === "contact" || o.k === "contactT") && o.lb) aviser("Contact relié à la bobine " + o.lb + " (même repère).", 3000); }
      strokes().push(o); SELO.s = o; if (el) couperFils(o);
      if (el && RD.objK !== "jonction"){ RD.objKe = "fil"; RD.objNF = 0; if (!/^(contact|contactT)$/.test(o.k)) aviser(ELEC[o.k].n + " posé. Relie-le : glisse d'un point bleu à l'autre.", 4500); }
    }
    redrawInk(); majObjUI();
  });
  c.addEventListener("pointermove", e => {
    if (mv && mv.redim){ const q = cur(e).snap, u = elecU(); redimEchelle(mv.redim, mv.w0 + Math.round((q[0] - mv.q0[0]) * c.width / u), mv.h0 + Math.round((q[1] - mv.q0[1]) * c.height / u), mv.fixes); redrawInk(); return; }
    if (!mv) return; if (mv.zone){ mv.q1 = cur(e).snap; if (mv.el) majZone(); return; }
    if (mv.fil){ const q = cur(e); mv.B = borneProche(q.raw, mv.segs) || q.snap;
      if (mv.dir && longueur(q.raw, mv.A) < elecU() * .3) mv.dir = null;   /* revenu au point de départ (sans lâcher) : le coude se choisit à nouveau */
      if (!mv.dir){ const ddx = Math.abs(q.raw[0] - mv.A[0]) * c.width, ddy = Math.abs(q.raw[1] - mv.A[1]) * c.height; if (Math.max(ddx, ddy) > elecU() * .35) mv.dir = ddy > ddx ? "v" : "h"; }
      tracerFil(); redrawInk(); return; }
    const q = cur(e), dx = q.snap[0] - mv.q0[0], dy = q.snap[1] - mv.q0[1];
    if (!mv.snap){ if (Math.hypot(dx * c.width, dy * c.height) < 4) return; snapInk(); mv.snap = true; mv.cotes = liensCotes(mv.s);   /* ses cotes suivent */
      mv.liens = mv.liens.map(([s, i, x, y]) => { const i2 = strokes().findIndex(t => t.t === "ligne" && t.p[i] && t.p[i][0] === x && t.p[i][1] === y); return [s, i, x, y]; }); }
    mv.s.p[0] = [mv.p0[0] + dx, mv.p0[1] + dy];
    mv.liens.forEach(([s, i, x, y]) => { s.p[i] = [x + dx, y + dy]; }); if (mv.cotes) suivreCotes(mv.cotes, mv.s);
    redrawInk();
  });
  ["pointerup", "pointercancel"].forEach(t => c.addEventListener(t, ev => {
    if (mv && mv.s && !mv.snap && ev.type === "pointerup") tapElement(mv.s, ev);      /* toucher sans bouger : compte pour le double-clic (renommer) */
    if (mv && mv.fil){ if (mv.segs.length){ jonctionsAuto(mv.segs); nettoyerFils(); } else { (UNDO[inkKey()] || []).pop(); if (!mv.B || mv.B === mv.A){ RD.objKe = null; SELO.s = null; const ch = mv.surObjet || mv.filSous; if (ch && strokes().includes(ch)){ SELO.s = ch; RD.objO = ch.o || 0; tapElement(ch, ev); } } }   /* simple clic sur un symbole ou un fil, même avec l'outil Fil : on le choisit (double-clic = repère) */   /* clic sans tracer : retour à aucun outil */ mv = null; redrawInk(); majObjUI(); return; }
    if (mv && mv.s && mv.snap && !ELEC[mv.s.k] && /^iso/.test(wbBg())) redresserIso(mv.s, mv.liens);
    if (mv && mv.s && mv.snap && ELEC[mv.s.k]){                                  /* symbole déplacé : ses fils restent droits (un coude s'ajoute au besoin) */
      const ux = elecU() / c.width, uy = elecU() / c.height;
      mv.liens.forEach(([f, i, x0, y0]) => { const M = f.p[i].slice(), F = f.p[1 - i]; if (Math.abs(M[0] - F[0]) * c.width <= 2 || Math.abs(M[1] - F[1]) * c.height <= 2) return;
        const horiz = Math.abs(y0 - F[1]) * c.height < 2;                     /* le fil garde son tracé ; le coude se fait juste avant la borne déplacée */
        if (horiz && Math.abs(M[0] - F[0]) > ux * 1.5){ const X = M[0] - Math.sign(M[0] - F[0]) * ux; f.p[i] = [X, F[1]]; strokes().push(nouveauFil([X, F[1]], [X, M[1]]), nouveauFil([X, M[1]], M)); }
        else if (!horiz && Math.abs(M[1] - F[1]) > uy * 1.5){ const Y = M[1] - Math.sign(M[1] - F[1]) * uy; f.p[i] = [F[0], Y]; strokes().push(nouveauFil([F[0], Y], [M[0], Y]), nouveauFil([M[0], Y], M)); }
        else { const K = horiz ? [F[0], M[1]] : [M[0], F[1]]; f.p[i] = K; strokes().push(nouveauFil(K, M)); } });
      nettoyerFils(); redrawInk();
    }
    if (mv && mv.zone && mv.raz && (!mv.q1 || Math.hypot((mv.q1[0] - mv.q0[0]) * c.width, (mv.q1[1] - mv.q0[1]) * c.height) < 6)){ if (mv.box) mv.box.remove(); RD.objKi = null; RD.objKe = null; SELO.s = null; mv = null; redrawInk(); majObjUI(); return; }
    if (mv && mv.zone && mv.el){
      if (mv.box) mv.box.remove();
      const r = c.getBoundingClientRect(), u = 34 * RD.z, q1 = mv.q1 || mv.q0;
      let w = Math.round(Math.abs(q1[0] - mv.q0[0]) * r.width / u), h = Math.round(Math.abs(q1[1] - mv.q0[1]) * r.height / u);
      const p0 = [Math.min(q1[0], mv.q0[0]), Math.min(q1[1], mv.q0[1])];
      const petit = w < 3 || h < 2; if (petit){ w = 12; h = 11; }                              /* simple clic : échelle standard */
      snapInk(); const o = { t:"objet", k:"rails", o:0, c:/^hl/.test(RD.color) ? "#24282c" : RD.color, p:[petit ? mv.q0 : p0], w:4, sz:[w, h], lb:RD.lbK.rails || "L1 / L2", v:"120 V c.a." }; strokes().push(o); SELO.s = o; RD.objKe = "fil";
      mv = null; redrawInk(); majObjUI(); return;
    }
    if (mv && mv.zone){
      const a = (34 * RD.z) * 1.2, d = a * .8660254, r = c.getBoundingClientRect(), q1 = mv.q1 || mv.q0;
      const dxp = (q1[0] - mv.q0[0]) * r.width, dyp = (q1[1] - mv.q0[1]) * r.height;
      let dm = Math.round((dxp / d - 2 * dyp / a) / 2), dn = Math.round((dxp / d + 2 * dyp / a) / 2);
      dm = dm || (dn ? 4 : 4); dn = dn || 3;                                                      /* simple clic : zone standard */
      snapInk(); const o = { t:"objet", k:"serpentin", o:0, c:/^hl/.test(RD.color) ? "#24282c" : RD.color, p:[mv.q0], w:4, sz:[dm, dn], pas:RD.pas || .5 }; strokes().push(o); SELO.s = o; redrawInk();
    }
    mv = null; majObjUI(); }));
})();
/* souris : cliquer un texte = le sélectionner et le déplacer ; double-clic = le modifier ; sinon dessiner une zone pour écrire */
(function(){
  const c = $("#inkCanvas");
  c.addEventListener("pointerdown", () => { if (!RD.text) document.querySelectorAll(".inktxt").forEach(t => t.blur()); }, true);   /* toucher le tableau avec un autre outil termine le texte */ let z = null, box = null, mv = null, dernier = { s:null, t:0 };
  const qOf = e => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
  c.addEventListener("pointerdown", e => {
    if (!(RD.pen || RD.wb) || !RD.text || RD.eraser) return;
    const q = qOf(e), hit = texteSous(q);
    if (hit){ document.querySelectorAll(".inktxt").forEach(t => t.blur());   /* une case ouverte se termine : Suppr et Ctrl+Z reviennent au tableau */
      const dbl = dernier.s === hit && e.timeStamp - dernier.t < 400; dernier = { s:hit, t:e.timeStamp }; SEL.s = hit; majBarTxt(); majSelTxt();
      if (dbl){ modifierTexte(hit); return; }
      mv = { s:hit, q0:q, p0:[hit.p[0][0], hit.p[0][1]], snap:false }; return;
    }
    const ouverte = document.querySelector(".inktxt");
    if (ouverte || (SEL.s && SEL.s.t === "texte")){ e.stopImmediatePropagation(); e.preventDefault();   /* texte terminé, toucher dans le vide : on sort de l'outil Texte (pas de nouvelle case) */
      if (ouverte) ouverte.blur(); SEL.s = null; RD.text = false; RD.crayonOff = true; majBarTxt(); majSelTxt(); refreshTools(); redrawInk(); return; }
    SEL.s = null; majBarTxt(); majSelTxt();
    z = { x:e.clientX, y:e.clientY, x2:e.clientX, y2:e.clientY };
    box = document.createElement("div"); box.style.cssText = "position:fixed;z-index:79;pointer-events:none;border:2px dashed #6aa9ff;background:rgba(106,169,255,.12)"; $("#reader").appendChild(box);
  });
  c.addEventListener("pointermove", e => {
    if (mv){ const q = qOf(e); if (!mv.snap && Math.hypot(q[0] - mv.q0[0], q[1] - mv.q0[1]) > .003){ snapInk(); mv.snap = true; }
      if (mv.snap){ mv.s.p[0] = [mv.p0[0] + q[0] - mv.q0[0], mv.p0[1] + q[1] - mv.q0[1]]; mv.s.p[1] = mv.s.p[0]; redrawBientot(); } return; }
    if (!z) return; z.x2 = e.clientX; z.y2 = e.clientY;
    box.style.left = Math.min(z.x, z.x2) + "px"; box.style.top = Math.min(z.y, z.y2) + "px"; box.style.width = Math.abs(z.x2 - z.x) + "px"; box.style.height = Math.abs(z.y2 - z.y) + "px";
  });
  ["pointerup", "pointercancel"].forEach(t => c.addEventListener(t, () => {
    if (mv){ const fini = mv.snap; mv = null; if (fini) redrawInk(); return; }
    if (!z) return; const r = c.getBoundingClientRect(); box.remove(); box = null;
    let x = Math.min(z.x, z.x2), y = Math.min(z.y, z.y2), w = Math.abs(z.x2 - z.x), h = Math.abs(z.y2 - z.y); z = null;
    if (!RD.wb && w < 40 && h < 30 && cocherDansLivre(x + w / 2, y + h / 2)) return;   /* case ou choix : coché / encerclé au bon endroit */
    if (!RD.wb && w < 40 && h < 30){ const T = celluleDuLivre(x + w / 2, y + h / 2); if (T){ ouvrirTexte(T.x, T.y, [(T.x - r.left) / r.width, (T.y - r.top) / r.height], T.w, T.hL, null, T); return; } }
    if (!RD.wb && w < 40 && h < 30){ const L = ligneDuLivre(x + w / 2, y + h / 2);   /* livre : toucher une ligne de réponse = la case s'aligne dessus */
      if (L){ ouvrirTexte(L.x, L.y - L.hL, [(L.x - r.left) / r.width, (L.y - L.hL - r.top) / r.height], L.w, L.hL, null, L); return; } }
    if (w < 40) w = 260; if (h < 30) h = 90;                                /* simple clic : zone par défaut */
    let q = [(x - r.left) / r.width, (y - r.top) / r.height];
    if (/^iso/.test(wbBg()) && RD.wb){ const k = r.width / (c.offsetWidth || r.width), a = (34 * RD.z) * 1.2 * k, d = a * .8660254, sx = Math.round((x - r.left) / d), sy = Math.round((y - r.top) / a - (sx & 1 ? .5 : 0)) + (sx & 1 ? .5 : 0); q = [sx * d / r.width, sy * a / r.height]; x = r.left + sx * d; y = r.top + sy * a; }
    ouvrirTexte(x, y, q, w, h);
  }));
})();
(function(){
  const c = $("#inkCanvas"); let cur = null;
  let rc0 = null; const rectToile = () => rc0 || (requestAnimationFrame(() => { rc0 = null; }), rc0 = c.getBoundingClientRect());
  const pt = e => {
    const r = rectToile(); let x = e.clientX - r.left, y = e.clientY - r.top;
    if (RD.wb && !RD.eraser && /^iso/.test(wbBg())){                      /* plan isométrique : le crayon s'accroche aux croisements de la grille */
      const k = r.width / (c.offsetWidth || r.width), a = (34 * RD.z) * 1.2 * k, d = a * .8660254, i0 = Math.round(x / d);
      let best = null;
      for (let i = i0 - 1; i <= i0 + 1; i++){ const yy = (Math.round(y / a - (i & 1 ? .5 : 0)) + (i & 1 ? .5 : 0)) * a, dd = Math.hypot(x - i * d, y - yy); if (!best || dd < best[0]) best = [dd, i * d, yy]; }
      x = best[1]; y = best[2];
    } else if (RD.wb && !RD.eraser && RD.shape && wbBg() === "quad"){       /* quadrillé : lignes et formes s'accrochent aux carreaux */
      const u = 34 * RD.z * (r.width / (c.offsetWidth || r.width)); x = Math.round(x / u) * u; y = Math.round(y / u) * u;
    }
    return [x / r.width, y / r.height];
  };
  c.addEventListener("pointerdown", e => {
    if (!(RD.pen || RD.wb) || RD.sim) return;
    try { c.setPointerCapture(e.pointerId); } catch(er){}
    if (RD.eraser){ cur = "erase"; eraseAt(pt(e)); return; }
    if (RD.crayonOff && !RD.text && !RD.obj){ e.preventDefault();                          /* aucun outil : rien ne se dessine, mais toucher une forme ou un objet le choisit */
      const r0 = c.getBoundingClientRect(), brut = [(e.clientX - r0.left) / r0.width, (e.clientY - r0.top) / r0.height], hit = (RD.wb ? objetSous(brut) : null) || formeSous(brut);
      if (!hit){ const tx = texteSous(brut); if (tx){ RD.text = true; RD.obj = false; refreshTools(); SEL.s = tx; majBarTxt(); majSelTxt(); redrawInk(); aviser("Texte choisi : glisse-le pour le déplacer, double-clic pour le modifier, Suppr pour l'effacer.", 3500); } return; }
      RD.obj = true; RD.objTab = null; RD.formeK = null; RD.objKi = null; RD.objKe = null; refreshTools();
      if (hit.t === "objet"){ if (choisirAutre(hit)) tapElement(hit, e); return; }
      choisirAutre(hit); cur = { bouge:hit, q0:pt(e), p0:hit.p.map(v => v.slice()), snap:false, x0:e.clientX, y0:e.clientY }; return; }
    if (RD.text || (RD.obj && RD.objTab !== "formes" && RD.objTab !== "plomb")){ e.preventDefault(); return; }
    const q = pt(e);
    if (RD.obj){ const brut = (r => [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height])(c.getBoundingClientRect()), ip = poigneeSous(SELO.s, brut);
      if (ip >= 0 && !(RD.formeK && /^tuy/.test(RD.formeK))){ cur = { poignee:ip, s:SELO.s, snap:false, x0:e.clientX, y0:e.clientY }; return; }   /* outil tuyau : on part du bout pour un nouveau tuyau */               /* agrandir / rapetisser par une poignée */
      const hit = formeSous(brut);
      if (hit && hit === SELO.s && !(RD.formeK && /^tuy/.test(RD.formeK) && /^tuy/.test(hit.t))){ cur = { bouge:hit, q0:q, p0:hit.p.map(v => v.slice()), snap:false, x0:e.clientX, y0:e.clientY }; return; }   /* forme déjà choisie : on la glisse */
      const obj = !hit && RD.wb ? objetSous(brut) : null;
      if (!RD.formeK){           /* aucun outil : toucher = choisir (et glisser = déplacer); toucher à côté = rien de choisi */
        if (hit){ SELO.s = hit; { const og = ongletPour(hit); if (og !== RD.objTab && /^(formes|plomb)$/.test(og)) RD.objTab = og; } redrawInk(); majObjUI(); cur = { bouge:hit, q0:q, p0:hit.p.map(v => v.slice()), snap:false, x0:e.clientX, y0:e.clientY }; return; }
        if (obj){ if (choisirAutre(obj)) tapElement(obj, e); return; }
        { const tx = texteSous(brut); if (tx){ RD.text = true; RD.obj = false; refreshTools(); SEL.s = tx; majBarTxt(); majSelTxt(); redrawInk(); e.preventDefault(); return; } }   /* un texte : on passe à l'outil Texte, il est choisi */
        if (SELO.s){ SELO.s = null; redrawInk(); majObjUI(); } e.preventDefault(); return; }
      var choisir = hit || obj;     /* forme pas encore choisie : un simple clic la choisit, mais glisser trace une nouvelle forme (ex. une cote qui part du coin d'un rectangle) */
      var raz = !!SELO.s; if (SELO.s){ SELO.s = null; majObjUI(); } }
    cur = { c:/^hl/.test(RD.color) ? "#000" : RD.color, hl:/^hl/.test(RD.color), hc:/^hl:/.test(RD.color) ? RD.color.slice(3) : null, w:RD.wPx || WIDTHS[RD.wIdx], p:[q] }; if (RD.wb && /^iso/.test(wbBg())) cur.iso = 1;   /* plan iso : le trait suit la grille, coins nets (pas de lissage) */
    const forme = RD.obj && RD.formeK ? RD.formeK : RD.shape;
    if (forme){ cur.t = forme; cur.p = [q, q]; if (forme === "maison" || /^pl/.test(forme)) cur.c = "#3b4148";   /* maison et appareils : trait gris foncé */ if (/^tuy/.test(forme)){ const q0 = aimanterTuyau(q, null, null); cur.p = [q0, q0.slice()]; } if (RD.obj && RD.formeK && choisir) cur.choisir = choisir; if (RD.obj && RD.formeK && raz && !choisir) cur.raz = true; if (forme === "bulle") cur.n = strokes().filter(x => x.t === "bulle").length + 1; }
    /* Trait en cours, rapide : on garde une image de tout le reste et, à chaque image, on redessine seulement le trait en cours par-dessus */
    snapInk(); redrawInk();
    if (cur.t || cur.hl || cur.iso){       /* forme, surligneur ou trait iso : on garde une copie de tout le reste */
      fond = fond || document.createElement("canvas"); fond.width = c.width; fond.height = c.height;
      const gf = fond.getContext("2d"); gf.clearRect(0, 0, fond.width, fond.height); gf.drawImage(c, 0, 0);
    } else fond = null;
    deja = 0; strokes().push(cur); RD.enTrait = true; RD.aRecolorer = null; if (!RD.obj && SELO.s){ SELO.s = null; } dessinerEnCours();
  });
  let fond = null, rafTrait = 0, deja = 0;
  const dessinerEnCours = () => { rafTrait = 0; if (!cur || cur === "erase") return;
    const g = c.getContext("2d"), k = DPRI() * RD.z, W = c.width, H = c.height;
    if (!fond){             /* trait libre opaque : on ajoute seulement les nouveaux bouts (aucun effacement de l'écran) */
      const P = cur.p; if (!P.length) return;
      g.save(); g.lineCap = "round"; g.lineJoin = "round"; g.lineWidth = cur.w * k;
      g.strokeStyle = (cur.c === "#24282c" && wbSombre()) ? "#f4f1ea" : cur.c;
      g.beginPath(); const M = i => [(P[i][0] + P[i + 1][0]) / 2 * W, (P[i][1] + P[i + 1][1]) / 2 * H];   /* même lissage que le dessin final */
      if (P.length < 3 || cur.iso) { g.moveTo(P[0][0] * W, P[0][1] * H); for (let i = 1; i < P.length; i++) g.lineTo(P[i][0] * W, P[i][1] * H); }
      else { const i0 = Math.max(1, deja - 1); g.moveTo(...(i0 === 1 ? [P[0][0] * W, P[0][1] * H] : M(i0 - 1))); for (let i = i0; i < P.length - 1; i++){ const m = M(i); g.quadraticCurveTo(P[i][0] * W, P[i][1] * H, m[0], m[1]); } }
      if (P.length === 1) g.lineTo(P[0][0] * W + .01, P[0][1] * H);
      g.stroke(); g.restore(); deja = P.length; return;
    }
    if (fond.width !== W || fond.height !== H){ redrawInk(); return; }
    g.clearRect(0, 0, W, H); g.drawImage(fond, 0, 0); drawStroke(g, cur, W, H, k); };
  /* crayon sur plan iso : le trait avance le long d'un axe de la grille et ne tourne (coin net) que lorsque la main quitte cette ligne */
  const suivreIso = e => { const r = rectToile(), k = r.width / (c.offsetWidth || r.width), a = 34 * RD.z * 1.2 * k, d = a * .8660254, X0 = [e.clientX - r.left, e.clientY - r.top];
    const X = cur.fin ? X0 : (cur.lisse = cur.lisse ? [cur.lisse[0] * .35 + X0[0] * .65, cur.lisse[1] * .35 + X0[1] * .65] : X0);   /* (3 nov.) lissage plus léger : moins de retard */ /* main lissée : un tremblement ne fait pas tourner la ligne */
    const AXES = [[d, a / 2], [-d, -a / 2], [-d, a / 2], [d, -a / 2], [0, a], [0, -a]];
    if (!cur.coins) cur.coins = [[cur.p[0][0] * r.width, cur.p[0][1] * r.height]];
    if (!cur.hist) cur.hist = []; cur.hist.push(X); if (cur.hist.length > 60) cur.hist.shift();
    const elan = () => { for (let i = cur.hist.length - 2; i >= 0; i--){ const H0 = cur.hist[i]; if (Math.hypot(X[0] - H0[0], X[1] - H0[1]) >= .7 * a) return [X[0] - H0[0], X[1] - H0[1]]; } return null; };   /* direction réelle de la main sur le dernier pas */
    const choisirAxe = C => { const Q = cur.fin ? C : (cur.quitte || C), v = [X[0] - Q[0], X[1] - Q[1]]; if (Math.hypot(v[0], v[1]) < (cur.fin ? .5 : cur.quitte ? .3 : .4) * a) return null;   /* la nouvelle direction = le chemin de la main depuis l'endroit où elle a quitté la ligne */   /* nouvelle direction : choisie seulement quand la main s'est assez éloignée du coin */ let b = null; AXES.forEach(D => { if (cur.quitte && cur.axeAvant && Math.abs(D[0] - cur.axeAvant[0]) < 1e-6 && Math.abs(D[1] - cur.axeAvant[1]) < 1e-6) return;   /* un virage ne reprend pas l'ancienne direction */ const t = (v[0] * D[0] + v[1] * D[1]) / (a * a); if (!b || t > b[0]) b = [t, D]; }); return b[1]; };
    let bout = null, vif = null;   /* vif = bout affiché pendant le trait (suit le doigt sur l'axe); bout = accroché à la grille, gardé au relâchement */
    const versAxe = (C, D, tr) => [C[0] + Math.max(0, tr) * D[0], C[1] + Math.max(0, tr) * D[1]];
    for (let tour = 0; tour < 12; tour++){
      const C = cur.coins[cur.coins.length - 1];
      if (cur.coins.length >= 2){ const Pv = cur.coins[cur.coins.length - 2], S = [C[0] - Pv[0], C[1] - Pv[1]], L = Math.hypot(S[0], S[1]);   /* la main revient sur le bout précédent (sans lâcher) : on efface le coin et on recule sur ce bout */
        if (L > .5){ const u = [S[0] / L, S[1] / L], v = [X[0] - Pv[0], X[1] - Pv[1]], pr = v[0] * u[0] + v[1] * u[1], pp = Math.abs(v[0] * u[1] - v[1] * u[0]);
          if (pp <= .6 * a && pr < L - .5 * a){ cur.coins.pop(); cur.axe = [u[0] * a, u[1] * a]; cur.trOn = cur.trMax = undefined; cur.quitte = null; continue; } } }
      if (!cur.axe){ const D2 = choisirAxe(C);
        if (D2 && cur.quitte && cur.coins.length >= 2){ const Pv = cur.coins[cur.coins.length - 2], S = [C[0] - Pv[0], C[1] - Pv[1]], L = Math.hypot(S[0], S[1]), u = [S[0] / L * a, S[1] / L * a], den = u[0] * D2[1] - u[1] * D2[0];
          if (L > .5 && Math.abs(den) > 1e-6){ const sI = ((X0[0] - Pv[0]) * D2[1] - (X0[1] - Pv[1]) * D2[0]) / den, n = Math.round(sI);   /* coin = croisement de l'ancienne ligne et du chemin de la main (pas trop loin quand on tourne en avançant) */
            if (n >= 1 && Math.abs(n - L / a) <= 1.05) cur.coins[cur.coins.length - 1] = [Pv[0] + n * u[0], Pv[1] + n * u[1]]; } }
        cur.axe = D2; if (!D2){ bout = C; const Q = cur.quitte || C, w = [X0[0] - Q[0], X0[1] - Q[1]]; if (!cur.quitte && Math.hypot(w[0], w[1]) > .2 * a){ let b = null; AXES.forEach(D => { const t = (w[0] * D[0] + w[1] * D[1]) / (a * a); if (!b || t > b[0]) b = [t, D]; }); vif = versAxe(C, b[1], b[0]); } break; } cur.quitte = null; continue; }
      const D = cur.axe; if (!D){ bout = C; break; }
      const v = [X[0] - C[0], X[1] - C[1]], tr = (v[0] * D[0] + v[1] * D[1]) / (a * a), perp = Math.abs(v[0] * D[1] - v[1] * D[0]) / a, t = Math.max(0, Math.round(tr));
      if (perp <= .42 * a && tr > -.5){ cur.trOn = tr; cur.trMax = cur.trMax === undefined || tr < cur.trMax - .9 ? tr : Math.max(cur.trMax, tr);   /* bout atteint (remis à jour si on recule vraiment d'un pas) */ bout = [C[0] + t * D[0], C[1] + t * D[1]]; vif = versAxe(C, D, (v[0] * D[0] + v[1] * D[1]) / (a * a) + ((X0[0] - X[0]) * D[0] + (X0[1] - X[1]) * D[1]) / (a * a)); break; }
      if (tr > -.5){ const M = elan(); if (!M || Math.abs(M[0] * D[1] - M[1] * D[0]) / Math.hypot(M[0], M[1]) / a < .42 && M[0] * D[0] + M[1] * D[1] > 0){ bout = [C[0] + t * D[0], C[1] + t * D[1]]; vif = versAxe(C, D, tr); break; } }   /* la main dérive mais va encore dans le même sens : pas de coin (on garde la ligne voulue) */
      const tc = Math.max(0, Math.round(cur.trMax !== undefined ? cur.trMax : tr));          /* coin au bout atteint sur la ligne (la main recule un peu en tournant) */
      if (tc >= 1) cur.coins.push([C[0] + tc * D[0], C[1] + tc * D[1]]);                    /* la main a quitté la ligne : coin net, puis nouvel axe */
      cur.axeAvant = cur.axe; cur.axe = null; cur.trOn = cur.trMax = undefined; cur.quitte = X.slice(); }
    if (!bout) bout = cur.coins[cur.coins.length - 1];
    const P = cur.coins.concat([bout]).filter((q, i, v) => !i || Math.hypot(q[0] - v[i - 1][0], q[1] - v[i - 1][1]) > .5);
    /* (29 oct., demande de Jeremy) plus de « crochet » redressé : on garde exactement le chemin tracé */
    cur.pFin = P.map(q => [q[0] / r.width, q[1] / r.height]);
    const PV = vif ? cur.coins.concat([vif]).filter((q, i, v) => !i || Math.hypot(q[0] - v[i - 1][0], q[1] - v[i - 1][1]) > .5) : P;
    cur.p = PV.map(q => [q[0] / r.width, q[1] / r.height]); };
  c.addEventListener("pointermove", e => {
    if (!cur) return;
    if (cur === "erase"){ eraseAt(pt(e)); return; }
    if (cur.poignee !== undefined && !cur.snap && Math.hypot(e.clientX - cur.x0, e.clientY - cur.y0) < 5) return;
    if (cur.poignee === 2){ if (!cur.snap){ snapInk(); cur.snap = true; } const o = cur.s, W = c.width, H = c.height, r = c.getBoundingClientRect(), q = [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
      const a = o.p[0], b = o.p[1], an = Math.atan2((b[1] - a[1]) * H, (b[0] - a[0]) * W), d = (-(q[0] - (a[0] + b[0]) / 2) * W * Math.sin(an) + (q[1] - (a[1] + b[1]) / 2) * H * Math.cos(an));
      const kD = dirCote(o, an)[2] || 1; if (o.txt) o.dt = 1; o.d = (o.txt ? d : Math.abs(d) < 6 ? 0 : d) / kD / H;   /* texte de côté : la poignée est le centre du texte, il peut toucher la forme */ if (!rafTrait) rafTrait = requestAnimationFrame(() => { rafTrait = 0; redrawInk(); }); return; }
    if (cur.poignee !== undefined){ if (!cur.snap){ snapInk(); cur.snap = true; cur.cotes = liensCotes(cur.s); } cur.s.p[cur.poignee] = /^tuy/.test(cur.s.t) ? aimanterTuyau(pt(e), cur.s.p[1 - cur.poignee], cur.s) : pt(e); if (cur.cotes) suivreCotes(cur.cotes, cur.s); if (!rafTrait) rafTrait = requestAnimationFrame(() => { rafTrait = 0; redrawInk(); }); return; }
    if (cur.bouge){ const q = pt(e), dx = q[0] - cur.q0[0], dy = q[1] - cur.q0[1];
      if (!cur.snap){ if (Math.hypot(e.clientX - cur.x0, e.clientY - cur.y0) < 5) return; snapInk(); cur.snap = true; cur.cotes = liensCotes(cur.bouge);   /* ses cotes et textes suivent */
        if (PORTS_PL[cur.bouge.t]){ const W = c.width, H = c.height, P = portsPlomb(cur.bouge, W, H); cur.liens = [];       /* tuyaux branchés : ils suivent l'appareil */
          strokes().forEach(o => { if (!/^tuy/.test(o.t || "")) return; o.p.forEach((e, i) => { if (P.some(pt => Math.hypot(pt.x - e[0] * W, pt.y - e[1] * H) < 3)) cur.liens.push([o, i, e.slice()]); }); }); } }
      if (cur.liens) cur.liens.forEach(([o, i, e]) => { o.p[i] = [e[0] + dx, e[1] + dy]; });
      cur.bouge.p = cur.p0.map(v => [v[0] + dx, v[1] + dy]); if (cur.cotes) suivreCotes(cur.cotes, cur.bouge); if (!rafTrait) rafTrait = requestAnimationFrame(() => { rafTrait = 0; redrawInk(); }); return; }
    if (cur.t){ cur.p[1] = pt(e); if (/^tuy/.test(cur.t)) cur.p[1] = aimanterTuyau(cur.p[1], cur.p[0], cur); }
    else if (cur.iso && !cur.hl) suivreIso(e);
    else { const evs = (e.getCoalescedEvents && e.getCoalescedEvents()) || [], r = rectToile(), mn = 1.2 / Math.max(r.width, 1);
      (evs.length ? evs : [e]).forEach(ev => { const q = pt(ev), d = cur.p[cur.p.length - 1]; if (!d || Math.abs(q[0] - d[0]) > mn || Math.abs(q[1] - d[1]) * r.height / r.width > mn) cur.p.push(q); }); }   /* points à moins de 1 px : ignorés */   /* tous les points du crayon, même entre deux images */
    if (!fond){ if (rafTrait){ cancelAnimationFrame(rafTrait); rafTrait = 0; } dessinerEnCours(); }   /* trait libre : dessiné tout de suite (ajout léger), pas à l'image suivante = moins de retard */
    else if (!rafTrait) rafTrait = requestAnimationFrame(dessinerEnCours);
  });
  ["pointerup", "pointercancel"].forEach(t => c.addEventListener(t, ev => {
    if (rafTrait){ cancelAnimationFrame(rafTrait); rafTrait = 0; }
    const tap = ev.type === "pointerup" ? ev : null;
    if (cur && cur.iso && !cur.hl && !cur.t && tap){ cur.fin = true; try { suivreIso(tap); } catch (_) {} delete cur.fin; }   /* dernier calcul avec la vraie position de la main */
    if (cur && cur.iso && cur.pFin){ cur.p = cur.pFin; delete cur.pFin; }   /* plan iso : au relâchement, le bout s'accroche à la grille */
    if (cur && (cur.bouge || cur.poignee !== undefined) && !cur.snap){ const o = cur.bouge || cur.s; cur = null; redrawInk(); tapElement(o, tap); return; }
    if (cur && (cur.bouge || cur.poignee !== undefined)){ cur = null; redrawInk(); return; }
    if (cur && cur.choisir){ const a = cur.p[0], b = cur.p[1]; if (Math.hypot(a[0] - b[0], a[1] - b[1]) < .004){       /* simple clic sur une forme : on la choisit */
      const arr = strokes(), i = arr.indexOf(cur); if (i >= 0){ arr.splice(i, 1); (UNDO[inkKey()] || []).pop(); } const ch = cur.choisir; cur = null; fond = null; if (ch.t === "objet"){ redrawInk(); choisirAutre(ch); tapElement(ch, tap); return; } SELO.s = ch; redrawInk(); majObjUI(); tapElement(ch, tap); return; }
      delete cur.choisir; }
    if (cur && cur.raz){ const a = cur.p[0], b = cur.p[1]; if (Math.hypot(a[0] - b[0], a[1] - b[1]) < .004){        /* clic à côté d'une forme choisie : retour à aucun outil */
      const arr = strokes(), i = arr.indexOf(cur); if (i >= 0){ arr.splice(i, 1); (UNDO[inkKey()] || []).pop(); } cur = null; fond = null; RD.formeK = null; redrawInk(); majObjUI(); return; }
      delete cur.raz; }
    if (cur && cur !== "erase" && !cur.t && !cur.hl && !cur.iso && !RD.wb && tap){ const r0 = c.getBoundingClientRect(), xs = cur.p.map(v => v[0] * r0.width), ys = cur.p.map(v => v[1] * r0.height);
      if (Math.max(...xs) - Math.min(...xs) < 9 && Math.max(...ys) - Math.min(...ys) < 9 && caseDuLivre(tap.clientX, tap.clientY)){   /* crayon : simple toucher sur une case = crochet, sur un choix = rond */
        const arr = strokes(), i = arr.indexOf(cur); if (i >= 0){ arr.splice(i, 1); (UNDO[inkKey()] || []).pop(); } cur = null; fond = null; RD.enTrait = false; cocherDansLivre(tap.clientX, tap.clientY); return; } }
    const finTrait = cur && cur !== "erase"; RD.enTrait = false;
    RD.erSnap = false;
    if (cur && cur !== "erase" && cur.t && FORMES_TAILLE[cur.t]){ const a = cur.p[0], b = cur.p[1]; if (Math.hypot(a[0] - b[0], a[1] - b[1]) < .004){ const r = c.getBoundingClientRect(), [tw, th] = FORMES_TAILLE[cur.t], dx = tw * RD.z / r.width / 2, dy = th * RD.z / r.height / 2; cur.p = [[a[0] - dx, a[1] - dy], [a[0] + dx, a[1] + dy]];
      const mz = DIM_PL[cur.t] && strokes().find(o => o.t === "maison" && o !== cur && a[0] >= Math.min(o.p[0][0], o.p[1][0]) && a[0] <= Math.max(o.p[0][0], o.p[1][0]) && a[1] >= Math.min(o.p[0][1], o.p[1][1]) && a[1] <= Math.max(o.p[0][1], o.p[1][1]));
      if (mz){ const W = c.width, H = c.height, ya = Math.min(mz.p[0][1], mz.p[1][1]), hN = Math.abs(mz.p[1][1] - mz.p[0][1]), ppm = hN * H * .28 / 2.7, [dw, dh] = DIM_PL[cur.t], wN = dw * ppm / W, hh = dh * ppm / H;   /* à l'échelle de la maison */
        if (SOL_PL.test(cur.t)){ const sols = [ya + hN * .36, ya + hN * .64, ya + hN * (1 - .035)], sol = sols.find(f => f >= a[1] - hh * .25) || sols[2], bas = cur.t === "plAvaloir" ? sol + hh * .65 : sol;   /* posé sur le plancher en dessous */
          cur.p = [[a[0] - wN / 2, bas - hh], [a[0] + wN / 2, bas]]; }
        else cur.p = [[a[0] - wN / 2, a[1] - hh / 2], [a[0] + wN / 2, a[1] + hh / 2]]; } } }
    if (cur && cur !== "erase" && cur.t && FORMES_CLIC[cur.t]){ const a = cur.p[0], b = cur.p[1]; if (Math.hypot(a[0] - b[0], a[1] - b[1]) < .004){ const d = FORMES_CLIC[cur.t]; cur.p[1] = cur.t === "bulle" || cur.t === "cercle" ? [a[0] + d, a[1]] : [a[0] + d, a[1] + d * 1.6]; } }
    if (cur && cur !== "erase" && cur.t){ const a = cur.p[0], b = cur.p[1]; if (Math.hypot(a[0] - b[0], a[1] - b[1]) < .004){ const arr = strokes(), i = arr.indexOf(cur); if (i >= 0){ arr.splice(i, 1); (UNDO[inkKey()] || []).pop(); } redrawInk(); } }
    if (cur && cur !== "erase" && cur.t && /^tuy/.test(cur.t) && strokes().includes(cur)){ const [a, b] = cur.p, dx = (b[0] - a[0]) * c.width, dy = (b[1] - a[1]) * c.height, an = Math.abs(Math.atan2(dy, dx) * 180 / Math.PI) % 45;
      if (Math.abs(dx) > 2 && Math.abs(dy) > 2 && Math.min(an, 45 - an) > .5){ const k2 = Math.abs(dx) >= Math.abs(dy) ? [b[0], a[1]] : [a[0], b[1]]; cur.p = [a, k2]; strokes().push(Object.assign({}, cur, { p:[k2.slice(), b.slice()] })); } }   /* branché en biais sur un raccord : un coude à 90° */
    if (cur && cur !== "erase" && RD.wb && /^iso/.test(wbBg())){ const seg = decouperIso(cur), arr = strokes(), k = arr.indexOf(cur); if (seg && k >= 0){ arr.splice(k, 1, ...seg); redrawInk(); } }
    if (cur && cur !== "erase" && cur.t && RD.obj && RD.formeK && strokes().includes(cur)){ SELO.s = cur; majObjUI(); }
    cur = null; fond = null;
    if (finTrait) redrawInk();          /* dessin complet une fois le trait terminé (et sauvegarde) */
  }));
})();
/* tuyau : on s'aimante au bout (ou sur le trajet) d'un autre tuyau; depuis un point de départ, le tuyau reste droit ou à 45° */
function aimanterTuyau(q, a, sauf){
  const c = $("#inkCanvas"), W = c.width, H = c.height, dpr = DPRI(), lim = 14 * dpr; let best = null;
  { const ty = ((sauf && sauf.t) || RD.formeK || "").replace(/^tuy/, ""); let bp = null;          /* raccord d'un appareil ou de la maison : le tuyau s'y branche */
    strokes().forEach(o => { if (!PORTS_PL[o.t]) return; portsPlomb(o, W, H).forEach(pt => { if (!portCompat(pt.ty, ty)) return; const d = Math.hypot(pt.x - q[0] * W, pt.y - q[1] * H); if (d < lim * 1.8 && (!bp || d < bp[1])) bp = [[pt.x / W, pt.y / H], d]; }); });
    if (bp) return bp[0]; }
  if (a){ const dx = (q[0] - a[0]) * W, dy = (q[1] - a[1]) * H, L = Math.hypot(dx, dy), an = Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) * Math.PI / 4; q = [a[0] + Math.cos(an) * L / W, a[1] + Math.sin(an) * L / H]; }
  strokes().forEach(o => { if (o === sauf || !o.t || !/^tuy/.test(o.t)) return; o.p.forEach(e => { const d = Math.hypot((e[0] - q[0]) * W, (e[1] - q[1]) * H); if (d < lim && (!best || d < best[1])) best = [e.slice(), d]; }); });
  if (best) return best[0];
  if (!a) strokes().forEach(o => { if (o === sauf || !o.t || !/^tuy/.test(o.t)) return; const [A, B] = o.p, ax = A[0] * W, ay = A[1] * H, bx = B[0] * W, by = B[1] * H, L2 = (bx - ax) ** 2 + (by - ay) ** 2; if (!L2) return;
    const u = Math.max(0, Math.min(1, ((q[0] * W - ax) * (bx - ax) + (q[1] * H - ay) * (by - ay)) / L2)), px = ax + u * (bx - ax), py = ay + u * (by - ay), d = Math.hypot(px - q[0] * W, py - q[1] * H);
    if (d < lim && (!best || d < best[1])) best = [[px / W, py / H], d]; });
  return best ? best[0] : q; }
/* Sélection multiple : Ctrl (ou Maj) + clic ajoute ou retire un élément; glisser dans le vide trace un cadre; glisser un élément du groupe déplace tout le groupe */
(function(){
  const c = $("#inkCanvas"); let mm = null, raf = 0, cadre = null, tapG = null;
  /* cote sur plusieurs lignes choisies : des deux bouts les plus éloignés */
  const coteGroupe = (L, cx, cy) => { const W = c.width, H = c.height, lignes = L.filter(o => o.p && /^(ligne|fleche|fleche2|tuy[A-Z]+)$/.test(o.t || "")); if (lignes.length < 1) return false;
    const P = []; lignes.forEach(o => o.p.slice(0, 2).forEach(q => P.push(q))); let A = null, B = null, dm = -1;
    P.forEach(u => P.forEach(v => { const d = Math.hypot((u[0] - v[0]) * W, (u[1] - v[1]) * H); if (d > dm){ dm = d; A = u; B = v; } })); if (dm < 6) return false;
    if (A[0] > B[0]){ const t = A; A = B; B = t; }
    const an = Math.atan2((B[1] - A[1]) * H, (B[0] - A[0]) * W), sg = Math.cos(an) > 0 ? -1 : 1, ec = 30 * RD.z * DPRI(), f = lignes[0];
    const poser = txt => { snapInk(); const n = { t:"cote", c:f.c && !/^tuy/.test(f.t) ? f.c : "#24282c", hl:false, hc:null, w:2.5, p:[A.slice(), B.slice()], d:sg * (txt ? ec * .3 : ec) / H }; if (/^iso/.test(wbBg())) n.iso = 1; if (txt){ n.txt = 1; n.lb = "a"; }
      strokes().push(n); SELM = []; SELO.s = n; redrawInk(); try { majObjUI(); } catch(er){} modifierForme(n, cx, cy); };
    /* rien d'automatique : une petite case offre la couleur, un texte ou une cote sur ce tronçon */
    const old = document.getElementById("formeVal"); if (old) old.remove();
    const box = document.createElement("div"); box.id = "formeVal"; box.style.cssText = "position:fixed;z-index:90;left:0;top:0;width:280px;padding:10px;border-radius:12px;background:#0e0e0f;border:1px solid #6aa9ff;color:#e4e4e7;font:600 .8rem system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.4)";
    const st = "flex:1;min-height:40px;border-radius:9px;border:1px solid #6aa9ff;border-bottom-width:4px;color:#fff;font:800 .85rem system-ui;cursor:pointer;padding:0 6px";
    box.innerHTML = '<div style="line-height:1.3">' + L.length + ' éléments choisis</div>';
    const C = [["#24282c", "Noir"], ["#e2483d", "Rouge"], ["#2a7bcf", "Bleu"], ["#2f9e4f", "Vert"], ["#f08c00", "Orange"], ["#8a8f98", "Gris"]], row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;gap:6px;margin-top:10px;flex-wrap:wrap"; row.innerHTML = '<span style="flex:1 0 100%;font-size:.85rem">Couleur</span>' + C.map(([c2, nm]) => '<button type="button" data-gcol="' + c2 + '" title="' + nm + '" style="width:32px;height:32px;flex:0 0 32px;border-radius:50%;border:3px solid #3a3a40;background:' + (c2 === "#24282c" && wbSombre() ? "#f4f1ea" : c2) + ';cursor:pointer"></button>').join("");
    let snapC = false; row.querySelectorAll("[data-gcol]").forEach(bc => bc.onclick = () => { if (!snapC){ snapInk(); snapC = true; } L.forEach(o => { if (!/^tuy/.test(o.t || "")) o.c = bc.dataset.gcol; }); redrawInk(); }); box.appendChild(row);
    const rang = document.createElement("div"); rang.style.cssText = "display:flex;gap:6px;margin-top:10px";
    rang.innerHTML = '<button type="button" data-g="txt" style="' + st + ';background:#1f6fc2">+ Texte sur ce tronçon</button><button type="button" data-g="cote" style="' + st + ';background:#2a2a30">+ Cote</button>'; box.appendChild(rang);
    const fermer = () => { box.remove(); document.removeEventListener("pointerdown", dehors, true); }, dehors = ev => { if (!box.contains(ev.target)) fermer(); };
    rang.querySelectorAll("[data-g]").forEach(bg => bg.onclick = () => { fermer(); poser(bg.dataset.g === "txt"); });
    glisserCase(box); $("#reader").appendChild(box); placerCase(box, { t:"ligne", p:[A, B] }, cx, cy); setTimeout(() => document.addEventListener("pointerdown", dehors, true), 0);
    return true; };
  const actif = () => RD.wb && !RD.eraser && !RD.sim && !RD.text && (RD.obj ? !RD.formeK && !RD.objK : RD.crayonOff);   /* aucun outil : glisser dans le vide trace un cadre de sélection */
  const brut = e => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
  const sous = q => objetSous(q) || formeSous(q);
  const stop = e => { e.stopImmediatePropagation(); e.preventDefault(); try { c.setPointerCapture(e.pointerId); } catch(er){} };
  c.addEventListener("pointerdown", e => {
    if (e.button > 0) return;
    const mod = e.ctrlKey || e.metaKey || e.shiftKey;
    if (mod && RD.wb && !RD.eraser && !RD.sim && !RD.text){ stop(e); mm = { cadre:true, q0:brut(e), x0:e.clientX, y0:e.clientY, mod:true, hit:sous(brut(e)) }; return; }   /* Ctrl : cadre à la Windows (ou Ctrl+clic sur un élément) */
    if (SELM.length && RD.wb && !RD.eraser && !RD.sim && !RD.text){ const h0 = sous(brut(e));
      if (SELM.length > 1 && h0 && SELM.includes(h0)){ stop(e); mm = { groupe:SELM.slice(), q0:brut(e), p0:SELM.map(o => o.p.map(v => v.slice())), snap:false, x0:e.clientX, y0:e.clientY }; return; }   /* le groupe se déplace, même avec un outil */
      if (!actif()){ SELM = []; redrawInk(); } }                                                        /* tout autre clic : la sélection multiple s'efface */
    if (!actif()) return;
    const q = brut(e), hit = sous(q);
    if (mod && hit){ stop(e); if (!SELM.length && SELO.s && strokes().includes(SELO.s) && SELO.s !== hit) SELM = [SELO.s];
      SELM = SELM.includes(hit) ? SELM.filter(x => x !== hit) : SELM.concat([hit]); SELO.s = null; redrawInk(); try { majObjUI(); } catch(er){} return; }
    if (!mod && hit && SELM.length > 1 && SELM.includes(hit)){ stop(e); mm = { groupe:SELM.slice(), q0:q, p0:SELM.map(o => o.p.map(v => v.slice())), snap:false, x0:e.clientX, y0:e.clientY }; return; }
    if (hit){ if (SELM.length){ SELM = []; redrawInk(); } return; }                                   /* clic sur un élément : sélection simple (comme avant) */
    if (modeElec() && window.borneProche && window.borneProche(q)) return;                              /* une borne : on trace un fil */
    if (texteSous(q)) return;                                                                            /* un texte : il se choisit (outil Texte) */
    stop(e); mm = { cadre:true, q0:q, x0:e.clientX, y0:e.clientY, mod };
  }, true);
  c.addEventListener("pointermove", e => {
    if (!mm) return; e.stopImmediatePropagation();
    if (Math.hypot(e.clientX - mm.x0, e.clientY - mm.y0) < (mm.mod ? 3 : 5) && !mm.snap && !cadre) return;
    if (mm.groupe){ const q = brut(e), dx = q[0] - mm.q0[0], dy = q[1] - mm.q0[1]; if (!mm.snap){ snapInk(); mm.snap = true; }
      mm.groupe.forEach((o, i) => { o.p = mm.p0[i].map(v => [v[0] + dx, v[1] + dy]); }); if (!raf) raf = requestAnimationFrame(() => { raf = 0; redrawInk(); }); return; }
    if (!cadre){ cadre = document.createElement("div"); cadre.style.cssText = "position:fixed;z-index:100000;border:1px solid #0078d7;background:rgba(0,120,215,.22);pointer-events:none";   /* cadre de sélection comme dans Windows */ document.body.appendChild(cadre); }
    const x = Math.min(e.clientX, mm.x0), y = Math.min(e.clientY, mm.y0); Object.assign(cadre.style, { left:x + "px", top:y + "px", width:Math.abs(e.clientX - mm.x0) + "px", height:Math.abs(e.clientY - mm.y0) + "px" }); mm.x1 = e.clientX; mm.y1 = e.clientY;
  }, true);
  ["pointerup", "pointercancel"].forEach(t => c.addEventListener(t, e => {
    if (!mm) return; e.stopImmediatePropagation(); const m = mm; mm = null;
    if (m.groupe && !m.snap){ const now = Date.now(), dbl = tapG && now - tapG.t < 550 && Math.hypot(e.clientX - tapG.x, e.clientY - tapG.y) < 24; tapG = dbl ? null : { t:now, x:e.clientX, y:e.clientY };
      if (dbl && coteGroupe(m.groupe, e.clientX, e.clientY)) return; }                                    /* double-clic sur un groupe de lignes : une cote d'un bout à l'autre */
    if (m.groupe){ if (raf){ cancelAnimationFrame(raf); raf = 0; } try { if (m.groupe.some(o => o.t === "objet" && ELEC[o.k]) && window.nettoyerJonctions) nettoyerJonctions(); } catch(er){} redrawInk(); return; }
    if (cadre){ cadre.remove(); cadre = null; }
    if (m.x1 === undefined || t === "pointercancel"){                                                   /* simple clic dans le vide : plus rien de choisi */
      if (m.mod && m.hit && t !== "pointercancel"){ const hit = m.hit; if (!SELM.length && SELO.s && strokes().includes(SELO.s) && SELO.s !== hit) SELM = [SELO.s];   /* Ctrl+clic : ajoute ou retire l'élément */
        SELM = SELM.includes(hit) ? SELM.filter(x => x !== hit) : SELM.concat([hit]); SELO.s = null; redrawInk(); try { majObjUI(); } catch(er){} return; }
      if (!m.mod && (SELM.length || SELO.s)){ SELM = []; SELO.s = null; redrawInk(); try { majObjUI(); } catch(er){} } return; }
    const r = c.getBoundingClientRect(), sx = c.width / r.width, sy = c.height / r.height;
    const bx = [(Math.min(m.x0, m.x1) - r.left) * sx, (Math.min(m.y0, m.y1) - r.top) * sy, (Math.max(m.x0, m.x1) - r.left) * sx, (Math.max(m.y0, m.y1) - r.top) * sy];
    const dedans = strokes().filter(o => { if (o === "erase" || o.k === "rails") return false; const b = boiteDe(o, c.width, c.height); return b && b[0] >= bx[0] && b[1] >= bx[1] && b[2] <= bx[2] && b[3] <= bx[3]; });
    SELO.s = null; SELM = m.mod ? [...new Set(SELM.concat(dedans))] : dedans;
    if (SELM.length === 1){ const o = SELM[0]; SELM = []; if (typeof choisirAutre === "function" && (o.t === "objet" || FORMES[o.t])) choisirAutre(o); else SELO.s = o; }
    else if (SELM.length) aviser(SELM.length + " éléments choisis : glisse-les ensemble, choisis une couleur, Suppr pour effacer, Ctrl+C / Ctrl+V pour copier.", 4000);
    redrawInk(); try { majObjUI(); } catch(er){}
  }, true));
})();
/* Enregistrer le tableau en image : fond + traits */
async function wbEnregistrer(){
  const c = $("#inkCanvas"), W = c.width, H = c.height, out = document.createElement("canvas"); out.width = W; out.height = H;
  const g = out.getContext("2d"), f = wbBg(), u = 34 * RD.z * DPRI();
  if (f === "noir" || f === "vert"){ const gr = g.createRadialGradient(W / 2, H * .4, 10, W / 2, H * .4, Math.max(W, H) * .75); gr.addColorStop(0, f === "noir" ? "#2b3133" : "#2e6b52"); gr.addColorStop(1, f === "noir" ? "#1a1f21" : "#1d4a38"); g.fillStyle = gr; }
  else g.fillStyle = f === "lignes" ? "#fffef9" : "#ffffff";
  g.fillRect(0, 0, W, H); g.lineWidth = 1;
  if (f === "iso" || f === "isopts"){
    const a = u * 1.2, tw = a * 1.7320508, th = a;
    for (let x = 0; x < W + tw; x += tw) for (let y = 0; y < H + th; y += th){
      if (f === "iso"){ g.strokeStyle = "#b4c6e0"; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + th); g.moveTo(x + tw / 2, y); g.lineTo(x + tw / 2, y + th); g.moveTo(x, y + th); g.lineTo(x + tw, y); g.moveTo(x, y); g.lineTo(x + tw, y + th); g.stroke(); }
      else { g.fillStyle = "#7f97bd"; [[0,0],[tw/2,th/2],[tw,0],[0,th],[tw,th]].forEach(([dx,dy]) => { g.beginPath(); g.arc(x + dx, y + dy, Math.max(1.6, u * .06), 0, 7); g.fill(); }); }
    }
  }
  if (f === "lignes"){ g.strokeStyle = "#e8a0a0"; g.lineWidth = 2; g.beginPath(); g.moveTo(u * 2.4, 0); g.lineTo(u * 2.4, H); g.stroke(); }
  g.drawImage(c, 0, 0);
  const blob = await new Promise(res => out.toBlob(res, "image/png"));
  const nom = "tableau-" + wbEtat().n + "-" + new Date().toISOString().slice(0, 10) + ".png";
  try {
    const dl = window.claude && claude.use ? await claude.use("downloads") : null;
    if (dl){ await dl.save({ filename:nom, data:blob }); aviser("Tableau enregistré."); return; }
  } catch(e){ if (e && e.code === "declined") return; }
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = nom;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  aviser("Tableau enregistré.");
}
