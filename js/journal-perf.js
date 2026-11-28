/* Journal de fluidité (16 nov.; 25 nov. : tous les enseignants connectés, tous les appareils).
   Note les images qui prennent plus de 80 ms (l'écran « accroche ») et dans quoi on était
   (livre, page, tableau blanc, zoom, geste), puis envoie un résumé dans les signalements (ntfy).
   À retirer quand le TNI est assez fluide. */
(function(){
  try {
    /* 25 nov. (Jeremy : « tous les enseignants », aussi au cellulaire et à l'ordinateur) : tout compte enseignant connecté, sur tout appareil */
    if (!localStorage.dernierId) return;
    /* 25 nov. : une page dans un cadre de la même fenêtre (télécommande du quiz, accueil dans la bibliothèque) voit les mêmes images :
       un seul journal, celui de la page principale (avant : deux rapports identiques) */
    if (window.top !== window && window.top.__journalPerf) return;
    window.__journalPerf = 1;
  } catch(e){ return; }
  const SUJET = "https://ntfy.sh/metierplus-signal-f3ce60fd2f6c0f46";
  /* sorte d'appareil (dans le titre) et règles d'envoi : Jeremy = tout, aux 5 min; les autres = seulement les vrais problèmes, aux 15 min, 4 envois au plus
     (ntfy gratuit : environ 250 messages par jour pour toute l'école, aussi utilisés par les quiz) */
  const JER = localStorage.dernierId === "jeremy.raymond", tactile = matchMedia("(any-pointer:coarse)").matches, petit = Math.min(screen.width, screen.height);
  const APP = !tactile ? "ordinateur" : petit <= 600 ? "cellulaire" : (/Android/.test(navigator.userAgent) && !/Mobile/.test(navigator.userAgent) && Math.max(screen.width, screen.height) >= 1280 ? "TNI" : "tablette");
  const TITRE = "Journal fluidite " + APP, MAXE = JER ? 12 : 4, AUX = (JER ? 5 : 15) * 60000;
  let envois = 0, debut = Date.now(), images = 0, lentes = 0, perdu = 0;
  const parCtx = {}, pires = [], scripts = {};
  let doigts = 0, dernierGeste = 0;
  addEventListener("pointerdown", () => { doigts++; dernierGeste = performance.now(); }, true);
  addEventListener("pointerup", () => { doigts = Math.max(0, doigts - 1); dernierGeste = performance.now(); }, true);
  addEventListener("pointercancel", () => { doigts = Math.max(0, doigts - 1); }, true);
  addEventListener("pointermove", () => { dernierGeste = performance.now(); }, true);
  const vis = id => { const e = document.getElementById(id); return e && !e.hidden && getComputedStyle(e).display !== "none"; };
  function contexte(){
    const r = document.getElementById("reader");
    let c;
    if (r && r.classList.contains("open")) {
      const RD = window.RD || {};
      c = r.classList.contains("wbon") ? "tableau blanc" : "livre " + (RD.book || "?");
      if (RD.z && RD.z !== 1) c += " (zoom " + (+RD.z).toFixed(1) + ")";
    } else if (vis("accueilOv")) c = "accueil de classe";
    else if (vis("planOv")) c = "plans";
    else if (vis("actOv")) c = "formatifs";
    else { const pg = (location.pathname.split("/").pop() || "index.html").replace(/\.html$/, "");
      c = pg === "index" || pg === "" ? "bibliothèque" : ({ accueil: "accueil de classe (seul)", quiz: "quiz", simulateur: "simulateur", labo: "Labo", passeport: "registre de formation", coffres: "coffres", "outils-atelier": "gestion d'atelier", presentation: "présentation", telecommande: "télécommande" }[pg] || pg); if (pg === "quiz" && location.search) c += " " + (location.search.match(/animer|ecran|tele|manette|j=/) || [""])[0].replace("=", ""); }
    return c;
  }
  let ctxV = "", ctxT = -1e9; const ctxCache = () => { const n = performance.now(); if (n - ctxT > 1000){ ctxV = contexte(); ctxT = n; } return ctxV; };
  let avant = 0;
  function boucle(t){
    if (avant && !document.hidden) {
      const d = t - avant; images++;
      if (d > 80 && d < 5000) {
        lentes++; perdu += d;
        /* 25 nov. (journal : « journal-perf.js · boucle » 183 ms) : le contexte (getComputedStyle) est lu plus tard, hors de l'image, et gardé 1 s */
        const geste = performance.now() - dernierGeste < 300 ? (doigts >= 2 ? " · 2 doigts" : doigts ? " · doigt" : " · geste") : "", h = new Date().toLocaleTimeString("fr-CA");
        setTimeout(() => { const c = ctxCache() + geste, p = parCtx[c] || (parCtx[c] = { n: 0, ms: 0, max: 0 });
          p.n++; p.ms += d; p.max = Math.max(p.max, d);
          pires.push([Math.round(d), c, h]);
          pires.sort((a, b) => b[0] - a[0]); pires.length = Math.min(pires.length, 6); }, 0);
      }
    }
    avant = document.hidden ? 0 : t;
    if (performance.now() < actifJ) requestAnimationFrame(boucle); else { enCours = false; avant = 0; }
  }
  /* 27 nov. (audit de stabilité : « la mesure coûte elle-même ») : on mesure seulement pendant que quelqu'un utilise l'écran
     (4 s après chaque geste, touche, défilement); au repos, plus aucune boucle à chaque image. */
  let actifJ = 0, enCours = false;
  const reveil = () => { actifJ = performance.now() + 4000; if (!enCours) { enCours = true; avant = 0; requestAnimationFrame(boucle); } };
  ["pointerdown", "pointermove", "keydown", "wheel", "scroll", "touchstart"].forEach(ev => addEventListener(ev, reveil, { capture:true, passive:true }));
  reveil();
  try {
    new PerformanceObserver(l => l.getEntries().forEach(e => {
      if (e.duration < 150) return;
      (e.scripts || []).forEach(s => {
        const k = ((s.sourceURL || "").split("/").pop().split("?")[0] || "livre") + " · " + (s.sourceFunctionName || s.invoker || "?");
        scripts[k] = (scripts[k] || 0) + Math.round(s.duration);
      });
      if (!(e.scripts || []).length) scripts["dessin (pas de script)"] = (scripts["dessin (pas de script)"] || 0) + Math.round(e.duration);
    })).observe({ type: "long-animation-frame", buffered: false });
  } catch(e){}
  /* 17 nov. : traits perdus (geste au crayon qui bouge mais ne laisse aucun trait) et mémoire pleine */
  let perdus = 0, ex = [], G = null;
  addEventListener("pointerdown", e => { try { const RD = window.RD; if (!RD || !e.target || e.target.id !== "inkCanvas" || RD.crayonOff || RD.eraser || RD.text || RD.formeK || RD.objK) { G = null; return; }
    G = G ? null : { id: e.pointerId, x: e.clientX, y: e.clientY, d: 0, n: (INKS[inkKey()] || []).length, t: e.pointerType + " " + Math.round(e.width || 0) + "×" + Math.round(e.height || 0) }; } catch(x){ G = null; } }, true);
  addEventListener("pointermove", e => { if (G && e.pointerId === G.id) G.d = Math.max(G.d, Math.hypot(e.clientX - G.x, e.clientY - G.y)); }, true);
  addEventListener("pointerup", e => { const g = G; G = null; if (!g || e.pointerId !== g.id || g.d < 30) return;
    setTimeout(() => { try { if ((INKS[inkKey()] || []).length <= g.n && !(typeof PZ !== "undefined" && PZ.actif)) { perdus++; if (ex.length < 4) ex.push(g.t + ", " + Math.round(g.d) + " px, " + new Date().toLocaleTimeString("fr-CA")); } } catch(x){} }, 500); }, true);
  function rapport(){
    let plein = false; try { plein = typeof sauveAvis !== "undefined" && !!sauveAvis; } catch(x){}
    if ((!lentes && !perdus && !plein) || envois >= MAXE) return null;
    if (!JER && !perdus && !plein && lentes < 5 && !pires.some(p => p[0] >= 300)) return null;   /* autres comptes : on garde les petits accrochages pour le prochain envoi */
    const min = Math.round((Date.now() - debut) / 60000);
    const L = ["Sur " + min + " min : " + lentes + " accrochages sur " + images + " images (" + Math.round(perdu / 1000) + " s perdues)",
      "Compte : " + (JER ? "Jeremy" : "autre enseignant") + " · " + APP + " · page " + (location.pathname.split("/").pop() || "index.html"),
      "Écran " + screen.width + "×" + screen.height + " ×" + devicePixelRatio + " · " + ((navigator.userAgent.match(/Chrome\/[\d]+/) || [""])[0]) + (/Android/.test(navigator.userAgent) ? " Android" : ""), "", "Où :"];
    Object.entries(parCtx).sort((a, b) => b[1].ms - a[1].ms).slice(0, 10)
      .forEach(([c, p]) => L.push("- " + c + " : " + p.n + " fois, pire " + Math.round(p.max) + " ms"));
    L.push("", "Pires :"); pires.forEach(p => L.push("- " + p[0] + " ms, " + p[1] + ", " + p[2]));
    const S = Object.entries(scripts).sort((a, b) => b[1] - a[1]).slice(0, 8);
    if (S.length) { L.push("", "Code responsable :"); S.forEach(([k, ms]) => L.push("- " + k + " : " + ms + " ms")); }
    if (perdus) { L.push("", "Traits perdus (crayon qui bouge sans laisser de trait) : " + perdus); ex.forEach(x => L.push("- " + x)); }
    if (plein) L.push("", "Mémoire pleine : les tableaux ne s'enregistrent plus.");
    envois++; debut = Date.now(); images = lentes = perdu = 0; perdus = 0; ex = [];
    for (const k in parCtx) delete parCtx[k]; for (const k in scripts) delete scripts[k]; pires.length = 0;
    return L.join("\n");
  }
  /* 25 nov. (Jeremy : « pourquoi pas l'envoyer là ») : rapports gardés 30 jours dans Supabase (table journal, outils/journal.sql);
     si Supabase ne répond pas (table pas encore créée, réseau), le rapport part sur ntfy comme avant */
  const SB = "https://nhxhfiaznuifcbobjuuv.supabase.co/rest/v1/rpc/journal_ecrire", SBCLE = "sb_publishable_GwzHRE-rG-rVafG7QcTOxg_S68OQHXh";
  function parNtfy(m, final){
    const opts = { method: "POST", body: m, headers: { Title: TITRE, Tags: "chart_with_downwards_trend" } };
    /* sendBeacon ne peut pas mettre d'en-tête : le titre passe dans l'adresse (avant : rapports « sans titre ») */
    if (final && navigator.sendBeacon) { try { if (navigator.sendBeacon(SUJET + "?title=" + encodeURIComponent(TITRE) + "&tags=chart_with_downwards_trend", m)) return; } catch(e){} }
    fetch(SUJET, Object.assign(opts, { keepalive: !!final })).catch(() => {});
  }
  function envoyer(final){
    const m = rapport(); if (!m) return;
    fetch(SB, { method: "POST", keepalive: !!final, headers: { apikey: SBCLE, Authorization: "Bearer " + SBCLE, "Content-Type": "application/json" }, body: JSON.stringify({ p_titre: TITRE, p_texte: m }) })
      .then(r => { if (!r.ok) parNtfy(m, false); }).catch(() => parNtfy(m, false));
  }
  setInterval(() => envoyer(false), AUX);
  addEventListener("pagehide", () => envoyer(true));
  document.addEventListener("visibilitychange", () => { if (document.hidden) envoyer(true); });
  window.journalPerf = () => rapport();   // pour les essais
})();
