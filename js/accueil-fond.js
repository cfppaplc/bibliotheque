/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — accueil-fond.js (sorti de la page le 15 nov.) */
/* Fond vivant.
   1. Suit la période : vitesse du fond (pause = calme, 5 dernières minutes = plus vif), vague à chaque nouveau bloc, lueur en fin de bloc.
   2. Détails propres à chaque scène : gouttes, bulles, courant, air, chaleur, crayon du plan, alarme, gyrophare, données…
   3. Profondeur : halos flous au loin, poussières devant, fond qui « respire » (caméra lente).
   4. Surprises toutes les 2 à 3 min : chariot élévateur, avion en papier, clé qui tombe, étincelles, grosse bulle, notification.
   5. Carte « Bienvenue » pendant les 5 minutes avant le cours.
   6. Lumière du jour : teinte froide le matin, chaude en fin d'après-midi.
   Réglage cfg.anim : "auto" (comme l'ordinateur) | "oui" | "non". Figé → une seule image, sans mouvement. */
(function(){
  const MQ = matchMedia("(prefers-reduced-motion: reduce)");
  const animPermise = () => { const a = cfg.anim || "auto"; return a === "oui" ? true : a === "non" ? false : !MQ.matches && !document.documentElement.classList.contains("leger"); };
  let actif = animPermise();
  const html = document.documentElement, bgfx = document.getElementById("bgfx");
  const cv = document.createElement("canvas"); cv.id = "ambfx"; cv.setAttribute("aria-hidden", "true");
  const lum = document.createElement("div"); lum.id = "ambLum"; lum.setAttribute("aria-hidden", "true");
  bgfx.after(cv, lum);
  const g = cv.getContext("2d");
  let W = 0, H = 0;
  const ECH = .75;        /* toile à 75 % : effets doux, moins de travail pour l'ordinateur du TNI */
  const taille = () => { W = innerWidth; H = innerHeight; cv.width = Math.round(W * ECH); cv.height = Math.round(H * ECH); g.setTransform(ECH, 0, 0, ECH, 0, 0); };
  taille(); addEventListener("resize", () => { taille(); if (!actif) dessinerFige(); });

  /* ---------- couleurs du thème (changent avec l'ambiance du jour) ---------- */
  const tmp = document.createElement("canvas").getContext("2d");
  const rgb = v => { tmp.fillStyle = "#000"; tmp.fillStyle = (v || "").trim() || "#888"; const s = tmp.fillStyle;
    if (s[0] === "#") return [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
    const m = s.match(/[\d.]+/g); return m ? m.slice(0, 3).map(Number) : [136, 136, 136]; };
  let C = {};
  const lireCouleurs = () => { const cs = getComputedStyle(html);
    C = { water: rgb(cs.getPropertyValue("--water")), copper: rgb(cs.getPropertyValue("--copper")), muted: rgb(cs.getPropertyValue("--muted")), bg: rgb(cs.getPropertyValue("--bg")), ink: rgb(cs.getPropertyValue("--ink")) };
    C.sombre = (C.bg[0] * .3 + C.bg[1] * .59 + C.bg[2] * .11) < 128; sprites = {}; };
  const A = (c, a) => "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")";
  let sprites = {};
  const halo = c => { const k = c.join(); if (sprites[k]) return sprites[k];
    const s = document.createElement("canvas"); s.width = s.height = 128; const x = s.getContext("2d"), gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, A(c, 1)); gr.addColorStop(.45, A(c, .45)); gr.addColorStop(1, A(c, 0)); x.fillStyle = gr; x.fillRect(0, 0, 128, 128); return sprites[k] = s; };
  const lueur = (x, y, r, c, a) => { if (a <= 0 || r <= 0) return; g.globalAlpha = Math.min(1, a); g.drawImage(halo(c), x - r, y - r, r * 2, r * 2); g.globalAlpha = 1; };

  /* ---------- 1. la période ---------- */
  const VITESSE = { avant: 1.3, debut: 1.15, cours: 1, fin: 1.7, pause: .45, hors: .8 };
  let E = { ph: "hors" }, cleBloc = "", vit = 1, vitCible = 1;
  function etat(){
    const d = new Date(), m = d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60, ps = periods();
    const cur = ps.find(p => m >= p.start && m < p.end), next = ps.find(p => p.start > m);
    if (!cur) return next && next.start - m <= 5 ? { ph: "avant", reste: next.start - m } : { ph: "hors" };
    const rows = timeline(cur.start, cfg.steps), i = rows.findIndex(r => m >= r.start && m < r.end), r = rows[i];
    const cle = cur.start + "|" + i;
    if (r && r.pause) return { ph: "pause", cle };
    const nr = rows[i + 1], finBloc = (r ? r.end : cur.end) - m;
    if ((!nr || nr.pause) && finBloc <= 5) return { ph: "fin", cle, reste: finBloc };
    if (m - cur.start < 3) return { ph: "debut", cle };
    return { ph: "cours", cle };
  }
  function suivrePeriode(){
    const avant = E.ph; E = etat(); vitCible = VITESSE[E.ph] || 1;
    if (E.cle && cleBloc && E.cle !== cleBloc && actif) vague();       /* nouveau bloc : une vague part de la frise */
    if (E.cle) cleBloc = E.cle;
    carteAccueil(avant);
  }
  const vagues = [];
  const vague = () => vagues.push({ t: 0 });
  function vitesseFond(){         /* les animations du fond (eau, ventilateur, aiguille…) suivent la période */
    if (!document.getAnimations) return;
    document.getAnimations().forEach(a => { const el = a.effect && a.effect.target; if (!el || !el.closest || !el.closest("#bgfx")) return;
      if (Math.abs((a.playbackRate || 1) - vit) > .02) { try { a.updatePlaybackRate ? a.updatePlaybackRate(vit) : (a.playbackRate = vit); } catch(e){} } });
  }

  /* ---------- 5. carte « Bienvenue » avant le cours ---------- */
  const carte = document.createElement("div"); carte.id = "accAccueil"; carte.hidden = true; carte.setAttribute("role", "status");
  carte.innerHTML = '<div class="aa-hey">Bienvenue<span>!</span></div><div class="aa-code"></div><div class="aa-comp"></div><div class="aa-dans"><i></i><span></span></div><div class="aa-x">Touche pour fermer</div>';
  document.body.append(carte);
  let carteFermee = "", apercu = false;
  carte.onclick = () => { if (apercu){ apercu = false; partir(); return; } carteFermee = jourCle(); partir(); };
  /* Aperçu (bouton « Voir la carte Bienvenue » de Préparer le cours) : la carte de la prochaine période, à n'importe quelle heure; toucher = fermer */
  function remplirCarte(texteDans, code){
    const c = compInfo(code || cfg.comp);
    carte.querySelector(".aa-code").textContent = c ? c[0] + (cfg.group ? " · " + cfg.group : "") : (cfg.group || "");
    carte.querySelector(".aa-comp").textContent = c ? titreComp(c[0]) : (cfg.module || cfg.title || "");
    carte.querySelector(".aa-dans span").textContent = texteDans;
  }
  function montrerCarte(){ if (carte.hidden){ carte.hidden = false; carte.classList.remove("part"); requestAnimationFrame(() => requestAnimationFrame(() => carte.classList.add("vu"))); } }
  window.ambApercuBienvenue = (code, jour, debut) => {
    const ps = periods(), d = new Date(), m = d.getHours() * 60 + d.getMinutes(), p = ps.find(x => x.start > m) || ps[0];
    apercu = true; carte.classList.add("apercu");
    remplirCarte(jour && debut != null ? jour + " : le cours commence à " + fmt(debut) : p ? (p.name === "Matin" && p.start <= m ? "Demain : " : "") + "Le cours commence à " + fmt(p.start) : "Le cours commence bientôt", code);
    carte.querySelector(".aa-x").textContent = "Aperçu · touche pour fermer";
    montrerCarte();
  };
  const jourCle = () => new Date().toDateString() + "|" + (periods().find(p => p.start > new Date().getHours() * 60 + new Date().getMinutes()) || {}).start;
  const partir = () => { if (carte.hidden) return; carte.classList.remove("vu"); carte.classList.add("part"); setTimeout(() => { carte.hidden = true; carte.classList.remove("part", "apercu"); carte.querySelector(".aa-x").textContent = "Touche pour fermer"; }, 850); };
  function carteAccueil(avant){
    if (apercu) return;
    if (E.ph === "avant" && carteFermee !== jourCle()){
      const sec = Math.max(0, Math.round(E.reste * 60));
      remplirCarte(sec > 0 ? "Le cours commence dans " + dur(sec) : "On commence !");
      montrerCarte();
    } else if (!carte.hidden) partir();
  }

  /* ---------- 6. lumière du jour ---------- */
  const JOUR = [   /* heure, couleur, force, position de la lumière (% de la largeur) */
    [6, [110, 150, 255], .20, 5], [9, [150, 190, 255], .15, 20], [12, [255, 248, 230], .10, 50],
    [15, [255, 205, 140], .15, 75], [17, [255, 155, 80], .22, 92], [19, [215, 105, 145], .20, 100], [22, [80, 95, 190], .18, 100] ];
  function lumiere(){
    const d = new Date(), h = Math.min(22, Math.max(6, d.getHours() + d.getMinutes() / 60));
    let k = 0; while (k < JOUR.length - 2 && JOUR[k + 1][0] <= h) k++;
    const [h0, c0, a0, x0] = JOUR[k], [h1, c1, a1, x1] = JOUR[k + 1], f = Math.min(1, Math.max(0, (h - h0) / (h1 - h0)));
    const c = c0.map((v, i) => Math.round(v + (c1[i] - v) * f)), a = a0 + (a1 - a0) * f, x = x0 + (x1 - x0) * f;
    const fa = C.sombre ? a * .55 : a * .45;      /* mélange normal : un mode « screen » plein écran ralentissait tout */
    lum.style.background = "radial-gradient(ellipse 85% 75% at " + x.toFixed(1) + "% -12%, " + A(c, fa.toFixed(3)) + ", " + A(c, 0) + " 72%), linear-gradient(to bottom, " + A(c, (fa * .35).toFixed(3)) + ", " + A(c, 0) + " 60%)";
  }

  /* ---------- 3. profondeur ---------- */
  const r = (a, b) => a + Math.random() * (b - a);
  let loin = [], pres = [];
  function peupler(){
    const cs = () => [C.water, C.copper, C.muted][Math.random() * 3 | 0];
    loin = Array.from({ length: 9 }, () => ({ x: Math.random(), y: Math.random(), R: r(70, 170), a: r(.05, .1), vx: r(-5, 5), vy: r(-4, 4), c: cs(), p: r(0, 6) }));
    pres = Array.from({ length: 22 }, (_, i) => ({ x: Math.random(), y: Math.random(), R: r(1.4, 3.4), a: r(.2, .42), vy: r(-16, -6), vx: r(-3, 3), p: r(0, 6), on: i < 14, c: Math.random() < .7 ? C.muted : C.water }));
  }
  let cam = { x: 0, y: 0, s: 1 };

  /* ---------- 2. détails de la scène ---------- */
  const FAM = { tuyaux: "eau", sanitaire: "eau", evacuation: "bulle", radiant: "chaleur", elec: "courant", ventil: "air", plan: "crayon",
    soudure: "braise", flammes: "braise", gaz: "braiseBleue", bois: "sciure", beton: "poussiere", tole: "poussiere", uni: "poussiere",
    incendie: "alarme", securite: "gyro", chantier: "grue", atelier: "rayon", menage: "eclat", informatique: "donnees", communication: "ping", administration: "feuilles" };
  let sorte = "", rails = [], voyageurs = [], extras = [], cibles = {};
  function scene(){
    sorte = bgKind(); rails = []; voyageurs = []; extras = []; cibles = {};
    const svg = bgfx.querySelector("svg"), fam = FAM[sorte] || "poussiere";
    if (svg){
      let ps = [...svg.querySelectorAll(".flow, .pflow")];
      if (fam === "crayon") ps = [...svg.querySelectorAll("path")].filter(p => /water/.test(p.getAttribute("stroke") || p.closest("[stroke]")?.getAttribute("stroke") || ""));
      ps.forEach(p => { try { const L = p.getTotalLength(); if (L > 80) rails.push({ p, L }); } catch(e){} });
      rails = rails.slice(0, 18);
      ["goutte", "sonne", "jet", "balance", "dot", "tw"].forEach(k => cibles[k] = [...svg.querySelectorAll("." + k)]);
    }
    const vitR = { eau: 70, bulle: 45, chaleur: 30, courant: 260, air: 120, crayon: 90 }[fam];
    if (vitR) rails.forEach((q, i) => { const n = fam === "crayon" ? (i < 2 ? 1 : 0) : fam === "courant" ? 2 : 1;
      for (let k = 0; k < n; k++) voyageurs.push({ q, s: Math.random() * q.L, v: vitR * r(.8, 1.2), fam, trace: [] }); });
    if (fam === "crayon") voyageurs.forEach(v => v.trace = []);
  }
  const ecran = (el, x, y) => { const m = el.getScreenCTM(); if (!m) return null; return { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f, k: Math.hypot(m.a, m.b) }; };
  const boite = el => { const b = el.getBoundingClientRect(); return b.width || b.height ? b : null; };

  function dessinerVoyageurs(dt){
    voyageurs.forEach(v => {
      v.s += v.v * dt * vit;
      if (v.fam === "crayon" && v.s > v.q.L){ v.s = 0; v.trace = []; v.q = rails[Math.random() * rails.length | 0] || v.q; }
      const L = v.q.L, s = ((v.s % L) + L) % L, pt = v.q.p.getPointAtLength(s), P = ecran(v.q.p, pt.x, pt.y); if (!P) return;
      if (P.x < -40 || P.y < -40 || P.x > W + 40 || P.y > H + 40) return;
      if (v.fam === "eau"){ for (let k = 4; k >= 1; k--){ const q = v.q.p.getPointAtLength(Math.max(0, s - k * 9)), Q = ecran(v.q.p, q.x, q.y); if (Q) lueur(Q.x, Q.y, 5 * P.k + 2, C.water, .10 * (5 - k)); }
        lueur(P.x, P.y, 14 * P.k + 4, C.water, .55); g.fillStyle = A([255, 255, 255], .75); g.beginPath(); g.arc(P.x, P.y, 2.2 * P.k + .8, 0, 7); g.fill(); }
      else if (v.fam === "bulle"){ const w = Math.sin(v.s / 9) * 3 * P.k; g.strokeStyle = A(C.water, .7); g.lineWidth = 1.6; g.beginPath(); g.arc(P.x + w, P.y - 2, (4 + Math.sin(v.s / 30) * 1.2) * P.k + 1.5, 0, 7); g.stroke(); }
      else if (v.fam === "courant"){ for (let k = 6; k >= 1; k--){ const q = v.q.p.getPointAtLength(Math.max(0, s - k * 7)), Q = ecran(v.q.p, q.x, q.y); if (Q) lueur(Q.x, Q.y, 6 * P.k + 3, [255, 236, 150], .07 * (7 - k)); }
        lueur(P.x, P.y, 18 * P.k + 6, [255, 230, 120], .7); g.fillStyle = "#fffbe6"; g.beginPath(); g.arc(P.x, P.y, 2.4 * P.k + .8, 0, 7); g.fill(); }
      else if (v.fam === "air"){ g.strokeStyle = A(C.ink, .22); g.lineWidth = 2; g.lineCap = "round";
        for (let k = 0; k < 3; k++){ const a = v.q.p.getPointAtLength(((s - k * 40) % L + L) % L), b = v.q.p.getPointAtLength(((s - k * 40 - 18) % L + L) % L), Pa = ecran(v.q.p, a.x, a.y), Pb = ecran(v.q.p, b.x, b.y);
          if (Pa && Pb && Math.hypot(Pa.x - Pb.x, Pa.y - Pb.y) < 60){ g.globalAlpha = 1 - k * .3; g.beginPath(); g.moveTo(Pa.x, Pa.y + (k - 1) * 5); g.lineTo(Pb.x, Pb.y + (k - 1) * 5); g.stroke(); } } g.globalAlpha = 1; }
      else if (v.fam === "chaleur"){ lueur(P.x, P.y - Math.sin(v.s / 20) * 4, 16 * P.k + 6, [255, 150, 70], .45); }
      else if (v.fam === "crayon"){ v.trace.push([P.x, P.y]); if (v.trace.length > 70) v.trace.shift();
        g.lineCap = "round"; g.lineJoin = "round";
        for (let k = 1; k < v.trace.length; k++){ g.strokeStyle = A(C.water, (k / v.trace.length) * .8); g.lineWidth = 3; g.beginPath(); g.moveTo(v.trace[k - 1][0], v.trace[k - 1][1]); g.lineTo(v.trace[k][0], v.trace[k][1]); g.stroke(); }
        lueur(P.x, P.y, 16, C.water, .7); g.fillStyle = "#fff"; g.beginPath(); g.arc(P.x, P.y, 2.6, 0, 7); g.fill(); }
    });
  }
  let horl = 0;
  function dessinerExtras(dt, t){
    const fam = FAM[sorte] || "poussiere";
    horl += dt * vit;
    if (fam === "eau" && cibles.goutte && cibles.goutte.length){      /* rond dans l'eau là où tombe la goutte */
      if (horl > 2.4){ horl = 0; cibles.goutte.forEach(el => { const b = boite(el); if (b) extras.push({ k: "onde", x: b.left + b.width / 2, y: b.bottom + 64 * (b.width / 10), t: 0 }); }); } }
    else if (fam === "eau" && horl > 5){ horl = 0; const q = rails[Math.random() * rails.length | 0]; if (q){ const pt = q.p.getPointAtLength(Math.random() * q.L), P = ecran(q.p, pt.x, pt.y); if (P) extras.push({ k: "vapeur", x: P.x, y: P.y, t: 0 }); } }
    if (fam === "alarme"){ (cibles.sonne || []).forEach(el => { const b = boite(el); if (b) lueur(b.left + b.width / 2, b.top + b.height / 2, b.width * 2.2, [255, 60, 50], .16 + .14 * Math.max(0, Math.sin(t * 4))); });
      if (horl > .5){ horl = 0; (cibles.jet || []).forEach(el => { const b = boite(el); if (b) for (let i = 0; i < 2; i++) extras.push({ k: "goutteJet", x: b.left + Math.random() * b.width, y: b.top + b.height * .6, vy: r(60, 120), t: 0 }); }); } }
    if (fam === "gyro"){ const x = W * .5, y = -10, ang = t * 2.2 * vit; g.save(); g.translate(x, y); g.rotate(Math.sin(ang) * 1.1);
      const gr = g.createLinearGradient(0, 0, 0, H * .9); gr.addColorStop(0, "rgba(255,190,40,.22)"); gr.addColorStop(1, "rgba(255,190,40,0)"); g.fillStyle = gr;
      g.beginPath(); g.moveTo(-8, 0); g.lineTo(-H * .35, H * .9); g.lineTo(H * .35, H * .9); g.lineTo(8, 0); g.fill(); g.restore(); lueur(x, 0, 60, [255, 190, 40], .5 + .3 * Math.sin(ang * 2)); }
    if (fam === "grue"){ (cibles.balance || []).forEach(el => { const b = boite(el); if (b) lueur(b.left + b.width / 2, b.top, 16, [255, 60, 50], Math.sin(t * 3) > .3 ? .9 : .05); }); }
    if (fam === "rayon"){ g.save(); const gr = g.createLinearGradient(0, 0, W * .5, H); gr.addColorStop(0, A([255, 240, 210], C.sombre ? .07 : .12)); gr.addColorStop(1, A([255, 240, 210], 0));
      g.fillStyle = gr; g.beginPath(); g.moveTo(W * .08, 0); g.lineTo(W * .26, 0); g.lineTo(W * .62, H); g.lineTo(W * .30, H); g.fill(); g.restore(); }
    if (fam === "ping" && horl > 2.6){ horl = 0; const ds = cibles.dot || []; const el = ds[Math.random() * ds.length | 0]; const b = el && boite(el); if (b) extras.push({ k: "ping", x: b.left + b.width / 2, y: b.top + b.height / 2, t: 0 }); }
    if (fam === "eclat" && horl > .7){ horl = 0; extras.push({ k: "eclat", x: r(.03, .97) * W, y: r(.05, .95) * H, t: 0 }); }
    if (fam === "donnees"){ if (horl > .12){ horl = 0; const gauche = Math.random() < .5; extras.push({ k: "bit", x: gauche ? r(.005, .05) * W : r(.95, .995) * W, y: H + 10, vy: r(50, 110), t: 0, w: Math.random() < .5 ? 6 : 14 }); } }
    if (fam === "feuilles" && horl > 3.2){ horl = 0; extras.push({ k: "feuille", x: r(.05, .95) * W, y: -30, vy: r(22, 38), rot: r(0, 6), vr: r(-.6, .6), t: 0 }); }
    if ((fam === "braise" || fam === "braiseBleue") && horl > .09){ horl = 0; extras.push({ k: "braise", x: r(0, 1) * W, y: H + 8, vy: r(-70, -35), vx: r(-12, 12), t: 0, bleu: fam === "braiseBleue" }); }
    if (fam === "sciure" && horl > .25){ horl = 0; extras.push({ k: "sciure", x: r(-.05, .8) * W, y: -10, vy: r(18, 34), vx: r(8, 22), t: 0 }); }
    if (fam === "courant" && horl > .9){ horl = 0; const q = rails[Math.random() * rails.length | 0]; if (q){ const pt = q.p.getPointAtLength(Math.random() < .5 ? 2 : q.L - 2), P = ecran(q.p, pt.x, pt.y); if (P) extras.push({ k: "voyant", x: P.x, y: P.y, t: 0, c: Math.random() < .6 ? [80, 230, 120] : [255, 80, 70] }); } }
    for (let i = extras.length - 1; i >= 0; i--){ const e = extras[i]; e.t += dt * vit; let fini = false;
      if (e.k === "onde"){ const f = e.t / 1.4; fini = f > 1; g.strokeStyle = A(C.water, .6 * (1 - f)); g.lineWidth = 2; g.beginPath(); g.ellipse(e.x, e.y, 6 + f * 34, 2 + f * 8, 0, 0, 7); g.stroke(); }
      else if (e.k === "vapeur"){ const f = e.t / 2.6; fini = f > 1; lueur(e.x + f * 10, e.y - f * 60, 14 + f * 30, [235, 240, 245], .22 * (1 - f)); }
      else if (e.k === "goutteJet"){ e.y += e.vy * dt * vit; fini = e.t > 1.4; g.fillStyle = A(C.water, .7 * (1 - e.t / 1.4)); g.beginPath(); g.arc(e.x, e.y, 2, 0, 7); g.fill(); }
      else if (e.k === "ping"){ const f = e.t / 1.6; fini = f > 1; g.strokeStyle = A(C.water, .7 * (1 - f)); g.lineWidth = 2.5; g.beginPath(); g.arc(e.x, e.y, 8 + f * 46, 0, 7); g.stroke(); }
      else if (e.k === "eclat"){ const f = e.t / 1.3; fini = f > 1; const s = Math.sin(f * Math.PI) * 9; g.strokeStyle = A([255, 255, 255], .8 * Math.sin(f * Math.PI)); g.lineWidth = 1.6;
        g.beginPath(); g.moveTo(e.x - s, e.y); g.lineTo(e.x + s, e.y); g.moveTo(e.x, e.y - s); g.lineTo(e.x, e.y + s); g.stroke(); lueur(e.x, e.y, s * 2, C.water, .35 * Math.sin(f * Math.PI)); }
      else if (e.k === "bit"){ e.y -= e.vy * dt * vit; fini = e.y < -20; g.fillStyle = A(C.water, .35); g.fillRect(e.x, e.y, e.w, 4); }
      else if (e.k === "feuille"){ e.y += e.vy * dt * vit; e.rot += e.vr * dt; fini = e.y > H + 40; g.save(); g.translate(e.x + Math.sin(e.t) * 20, e.y); g.rotate(e.rot);
        g.strokeStyle = A(C.muted, .5); g.fillStyle = A(C.bg, .4); g.lineWidth = 1.5; g.beginPath(); g.rect(-12, -16, 24, 32); g.fill(); g.stroke();
        g.beginPath(); for (let k = 0; k < 4; k++){ g.moveTo(-7, -9 + k * 6); g.lineTo(k === 3 ? 2 : 7, -9 + k * 6); } g.stroke(); g.restore(); }
      else if (e.k === "braise"){ e.y += e.vy * dt * vit; e.x += (e.vx + Math.sin(e.t * 3) * 10) * dt; fini = e.t > 5 || e.y < -10; lueur(e.x, e.y, 6, e.bleu ? [110, 170, 255] : [255, 150, 60], .7 * Math.max(0, 1 - e.t / 5)); }
      else if (e.k === "sciure"){ e.y += e.vy * dt * vit; e.x += e.vx * dt * vit; fini = e.y > H + 10; g.fillStyle = "rgba(214,180,120,.45)"; g.fillRect(e.x, e.y, 2.2, 2.2); }
      else if (e.k === "voyant"){ fini = e.t > 1.2; lueur(e.x, e.y, 14, e.c, Math.sin(e.t / 1.2 * Math.PI) * .9); }
      if (fini) extras.splice(i, 1); }
    if (extras.length > 160) extras.splice(0, extras.length - 160);
  }

  /* ---------- 4. surprises ---------- */
  const SURPRISES = { eau: ["cle", "bulleG"], bulle: ["bulleG", "cle"], chaleur: ["cle"], courant: ["etincelles"], air: ["avion", "cle"], crayon: ["avion"],
    braise: ["etincelles"], braiseBleue: ["etincelles"], sciure: ["chariot"], poussiere: ["chariot", "avion"], alarme: ["etincelles"], gyro: ["chariot"],
    grue: ["chariot"], rayon: ["chariot", "cle"], eclat: ["bulleG"], donnees: ["notif", "avion"], ping: ["avion", "notif"], feuilles: ["avion"] };
  let prochaine = performance.now() + 60000, surprise = null;
  /* les panneaux du tableau cachent le fond : on cherche les espaces libres pour que la surprise se voie */
  const couvre = el => { for (; el && el !== document.body && el.id !== "bgfx"; el = el.parentElement){ const cs = getComputedStyle(el), m = cs.backgroundColor.match(/[\d.]+/g);
      if (m && (m.length < 4 || +m[3] > .3)) return el; } return null; };
  const libre = (x, y) => !couvre(document.elementFromPoint(x, y));
  function plancher(){        /* dessus du panneau du bas (la frise) : la surprise roule dessus */
    for (let y = H - 6; y > H * .4; y -= 12){ const el = couvre(document.elementFromPoint(W / 2, y)); if (el){ const t = el.getBoundingClientRect().top; if (t > H * .35) return t; break; } }
    return H - 10; }
  function xLibre(y){ for (let k = 0; k < 30; k++){ const x = r(.04, .96) * W; if (libre(x, y) && libre(x - 30, y) && libre(x + 30, y)) return x; } return r(.05, .3) * W; }
  function lancerSurprise(type){
    const liste = SURPRISES[FAM[sorte] || "poussiere"] || ["avion"]; type = type || liste[Math.random() * liste.length | 0];
    const sol = plancher(), x = xLibre(sol - 60);
    surprise = { type, t: 0, x, y: Math.max(80, sol - r(80, 200)), sol, dir: Math.random() < .5 ? 1 : -1 };
  }
  window.ambSurprise = lancerSurprise;      /* pour essayer : ambSurprise("chariot") */
  window.ambVague = () => vagues.push({ t: 0 });
  function dessinerSurprise(dt){
    const s = surprise; if (!s) return; s.t += dt; const ln = A(C.muted, .75), fond = A(C.bg, .55);
    g.lineWidth = 2.5; g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = ln;
    if (s.type === "chariot"){ const D = 11, f = s.t / D; if (f > 1){ surprise = null; return; }
      const x = s.dir > 0 ? -160 + f * (W + 320) : W + 160 - f * (W + 320), y = s.sol - 12, b = Math.abs(Math.sin(s.t * 9)) * 1.5;
      g.save(); g.translate(x, y - b); g.scale(s.dir, 1); g.fillStyle = fond;
      g.beginPath(); g.rect(-50, -38, 64, 34); g.fill(); g.stroke();                       /* caisse */
      g.beginPath(); g.moveTo(-30, -38); g.lineTo(-30, -70); g.lineTo(6, -70); g.lineTo(14, -38); g.stroke();   /* cabine */
      g.beginPath(); g.moveTo(22, -86); g.lineTo(22, -4); g.moveTo(14, -86); g.lineTo(30, -86); g.stroke();      /* mât */
      g.beginPath(); g.moveTo(22, -24); g.lineTo(58, -24); g.stroke();                                            /* fourches */
      g.fillStyle = A(C.copper, .35); g.beginPath(); g.rect(30, -48, 30, 24); g.fill(); g.stroke();             /* palette */
      g.fillStyle = A(C.bg, .9); [-36, 2].forEach(cx => { g.beginPath(); g.arc(cx, 0, 10, 0, 7); g.fill(); g.stroke(); });
      lueur(-34, -76, 10, [255, 180, 40], Math.sin(s.t * 8) > 0 ? .9 : .1); g.restore(); }
    else if (s.type === "avion"){ const D = 13, f = s.t / D; if (f > 1){ surprise = null; return; }
      const x = s.dir > 0 ? -60 + f * (W + 120) : W + 60 - f * (W + 120), y = H * .22 + Math.sin(f * 7) * 40 + f * 80, a = Math.cos(f * 7) * .25;
      g.save(); g.translate(x, y); g.scale(s.dir, 1); g.rotate(a); g.fillStyle = A([255, 255, 255], .14);
      g.beginPath(); g.moveTo(26, 0); g.lineTo(-22, -12); g.lineTo(-12, 0); g.lineTo(-22, 12); g.closePath(); g.fill(); g.stroke();
      g.beginPath(); g.moveTo(26, 0); g.lineTo(-12, 0); g.lineTo(-16, 6); g.stroke(); g.restore();
      g.setLineDash([3, 9]); g.strokeStyle = A(C.muted, .3); g.beginPath();
      for (let k = 1; k < 30; k++){ const ff = f - k * .006; if (ff < 0) break; const xx = s.dir > 0 ? -60 + ff * (W + 120) : W + 60 - ff * (W + 120), yy = H * .22 + Math.sin(ff * 7) * 40 + ff * 80; k === 1 ? g.moveTo(xx, yy) : g.lineTo(xx, yy); }
      g.stroke(); g.setLineDash([]); }
    else if (s.type === "cle"){ const sol = s.sol - 14; if (!s.vy){ s.vy = 0; s.yy = -40; s.rot = 0; s.reb = 0; }
      s.vy += 900 * dt; s.yy += s.vy * dt; s.rot += 5 * dt * (s.reb < 3 ? 1 : 0);
      if (s.yy > sol){ s.yy = sol; s.vy = -s.vy * .38; s.reb++; extras.push({ k: "eclat", x: s.x, y: sol + 8, t: .3 }); }
      if (s.t > 5.5){ surprise = null; return; }
      g.save(); g.globalAlpha = Math.min(1, (5.5 - s.t) / .8); g.translate(s.x, s.yy); g.rotate(s.reb >= 3 ? Math.PI / 2 : s.rot);
      g.beginPath(); g.moveTo(-34, 0); g.lineTo(22, 0); g.stroke(); g.lineWidth = 7; g.strokeStyle = A(C.muted, .55); g.beginPath(); g.moveTo(-30, 0); g.lineTo(18, 0); g.stroke();
      g.lineWidth = 2.5; g.strokeStyle = ln; g.beginPath(); g.arc(30, 0, 11, .8, 5.5); g.stroke(); g.restore(); }
    else if (s.type === "etincelles"){ if (!s.pts){ s.pts = Array.from({ length: 34 }, () => { const a = r(0, 6.28), v = r(80, 320); return { x: s.x, y: s.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 80 }; }); }
      if (s.t > 1.6){ surprise = null; return; } lueur(s.x, s.y, 80, [255, 220, 140], Math.max(0, .8 - s.t * 2));
      s.pts.forEach(p => { p.vy += 400 * dt; p.x += p.vx * dt; p.y += p.vy * dt; g.strokeStyle = "rgba(255,214,120," + Math.max(0, 1 - s.t / 1.6) + ")"; g.lineWidth = 2;
        g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x - p.vx * .03, p.y - p.vy * .03); g.stroke(); }); }
    else if (s.type === "bulleG"){ const D = 7; if (!s.y0){ s.y0 = s.sol - 30; } const f = s.t / D; const y = s.y0 - f * (s.y0 * .8), x = s.x + Math.sin(s.t * 1.6) * 30, R = 34 + Math.sin(s.t * 3) * 2;
      if (f > 1){ for (let i = 0; i < 14; i++) extras.push({ k: "eclat", x: x + r(-40, 40), y: y + r(-40, 40), t: r(0, .4) }); surprise = null; return; }
      g.strokeStyle = A(C.water, .55); g.lineWidth = 2; g.fillStyle = A(C.water, .06); g.beginPath(); g.arc(x, y, R, 0, 7); g.fill(); g.stroke();
      g.strokeStyle = A([255, 255, 255], .5); g.beginPath(); g.arc(x - 10, y - 12, 12, 3.6, 4.6); g.stroke(); }
    else if (s.type === "notif"){ const D = 5.5; if (s.t > D){ surprise = null; return; }
      const e = Math.min(1, s.t / .5), sortie = Math.max(0, (s.t - (D - .6)) / .6), x = -270 + 294 * e - 300 * sortie, y = s.sol - 78;
      g.save(); g.globalAlpha = 1 - sortie; g.fillStyle = A(C.bg, .8); g.strokeStyle = A(C.water, .7); g.lineWidth = 2;
      g.beginPath(); g.roundRect ? g.roundRect(x, y, 260, 58, 14) : g.rect(x, y, 260, 58); g.fill(); g.stroke();
      lueur(x + 30, y + 29, 22, C.water, .6); g.fillStyle = A(C.ink, .6); g.fillRect(x + 56, y + 18, 150, 7); g.fillStyle = A(C.ink, .3); g.fillRect(x + 56, y + 33, 110, 6); g.restore(); }
  }

  /* ---------- boucle ---------- */
  let dernier = performance.now(), t = 0, raf = 0, prochainEtat = 0, prochaineLum = 0, prochaineCoul = 0, prochaineVit = 0;
  function image(now){
    raf = requestAnimationFrame(image);
    const dtr = (now - dernier) / 1000; if (dtr < 1 / 32) return; dernier = now;
    if (document.hidden) return;
    const dt = Math.min(.1, dtr); t += dt;
    if (now > prochainEtat){ prochainEtat = now + 1000; suivrePeriode(); }
    if (now > prochaineCoul){ prochaineCoul = now + 10000; const av = JSON.stringify(C); lireCouleurs(); if (JSON.stringify(C) !== av) { loin.forEach(o => o.c = [C.water, C.copper, C.muted][Math.random() * 3 | 0]); } }
    if (now > prochaineLum){ prochaineLum = now + 30000; lumiere(); }
    vit += (vitCible - vit) * Math.min(1, dt * .8);
    if (now > prochaineVit){ prochaineVit = now + 1500; vitesseFond(); }
    /* caméra lente : le fond respire, les couches bougent à des vitesses différentes */
    cam = { x: Math.sin(t / 23) * 14, y: Math.cos(t / 31) * 9, s: 1.035 + Math.sin(t / 41) * .01 };
    const fonds = bgfx.children; for (let i = 0; i < fonds.length; i++) fonds[i].style.transform = "translate(" + cam.x.toFixed(2) + "px," + cam.y.toFixed(2) + "px) scale(" + cam.s.toFixed(4) + ")";
    g.clearRect(0, 0, W, H);
    const intensite = E.ph === "avant" ? 1.5 : E.ph === "pause" ? .7 : 1;
    loin.forEach(o => { o.x += o.vx * dt * vit / W; o.y += o.vy * dt * vit / H; if (o.x < -.2) o.x = 1.2; if (o.x > 1.2) o.x = -.2; if (o.y < -.2) o.y = 1.2; if (o.y > 1.2) o.y = -.2;
      lueur(o.x * W - cam.x * .35, o.y * H - cam.y * .35, o.R * (1 + .06 * Math.sin(t / 3 + o.p)), o.c, o.a * intensite); });
    dessinerVoyageurs(dt);
    dessinerExtras(dt, t);
    pres.forEach((o, i) => { if (!o.on && !(E.ph === "avant" && i < 22)) return; o.y += o.vy * dt * vit / H; o.x += (o.vx + Math.sin(t + o.p) * 4) * dt / W; if (o.y < -.05){ o.y = 1.05; o.x = Math.random(); }
      g.fillStyle = A(o.c, o.a * (.6 + .4 * Math.sin(t * 1.3 + o.p))); g.beginPath(); g.arc(o.x * W + cam.x * 1.7, o.y * H + cam.y * 1.7, o.R, 0, 7); g.fill(); });
    /* 1. fin de bloc : lueur qui respire en bas; nouveau bloc : vague */
    if (E.ph === "fin"){ const a = .10 + .08 * Math.sin(t * 2.4); const gr = g.createLinearGradient(0, H, 0, H * .55); gr.addColorStop(0, A(C.copper, a)); gr.addColorStop(1, A(C.copper, 0)); g.fillStyle = gr; g.fillRect(0, H * .55, W, H * .45); }
    for (let i = vagues.length - 1; i >= 0; i--){ const v = vagues[i]; v.t += dt; const f = v.t / 2.4; if (f > 1){ vagues.splice(i, 1); continue; }
      const R = f * Math.hypot(W, H); g.strokeStyle = A(C.copper, .45 * (1 - f)); g.lineWidth = 6 * (1 - f) + 1; g.beginPath(); g.arc(W / 2, H * .82, R, 0, 7); g.stroke();
      g.strokeStyle = A(C.water, .3 * (1 - f)); g.lineWidth = 2; g.beginPath(); g.arc(W / 2, H * .82, R * .8, 0, 7); g.stroke(); }
    /* 4. surprise toutes les 2 à 3 minutes (pas pendant une vague) */
    if (!surprise && now > prochaine && E.ph !== "avant"){ prochaine = now + r(120000, 180000); lancerSurprise(); }
    dessinerSurprise(dt);
  }
  function dessinerFige(){       /* sans mouvement : une seule image calme */
    g.clearRect(0, 0, W, H);
    loin.forEach(o => lueur(o.x * W, o.y * H, o.R, o.c, o.a));
    pres.forEach(o => { if (!o.on) return; g.fillStyle = A(o.c, o.a * .7); g.beginPath(); g.arc(o.x * W, o.y * H, o.R, 0, 7); g.fill(); });
    for (let i = 0; i < bgfx.children.length; i++) bgfx.children[i].style.transform = "";
  }
  let figeT = 0;
  function demarrer(){   /* 8 nov. : le fond animé (toiles #ambfx/#ambLum) est caché par le style Sobre : on ne le dessine plus, on suit seulement la période */
    cancelAnimationFrame(raf); clearInterval(figeT); actif = animPermise();
    html.classList.toggle("anim-off", !actif); reduceMotion = !actif;
    suivrePeriode(); figeT = setInterval(suivrePeriode, 1000);
  }
  /* le fond est refait à chaque changement de compétence ou de réglage : on suit */
  const applyBg0 = applyBg;
  applyBg = function(){ html.classList.add("style-pro"); cfg.bg = "auto"; actif = animPermise(); html.classList.toggle("anim-off", !actif); reduceMotion = !actif; applyBg0(); demarrer(); };
  MQ.addEventListener ? MQ.addEventListener("change", () => applyBg()) : MQ.addListener(() => applyBg());
  lireCouleurs(); peupler();
  applyBg();
  /* mode léger posé (ou retiré) après coup : le fond suit */
  let etaitLeger = html.classList.contains("leger");
  new MutationObserver(() => { const l = html.classList.contains("leger"); if (l !== etaitLeger){ etaitLeger = l; applyBg(); } }).observe(html, { attributes:true, attributeFilter:["class"] });
})();
