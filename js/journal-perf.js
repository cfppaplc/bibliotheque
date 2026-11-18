/* Journal de fluidité (16 nov.) : seulement pour Jeremy, sur un grand écran tactile (TNI).
   Note les images qui prennent plus de 80 ms (l'écran « accroche ») et dans quoi on était
   (livre, page, tableau blanc, zoom, geste), puis envoie un résumé dans les signalements (ntfy).
   À retirer quand le TNI est assez fluide. */
(function(){
  try {
    if (localStorage.dernierId !== "jeremy.raymond") return;
    if (!matchMedia("(any-pointer:coarse)").matches) return;
    if (Math.min(screen.width, screen.height) <= 600) return;
  } catch(e){ return; }
  const SUJET = "https://ntfy.sh/metierplus-signal-f3ce60fd2f6c0f46";
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
    else c = "bibliothèque";
    if (performance.now() - dernierGeste < 300) c += doigts >= 2 ? " · 2 doigts" : doigts ? " · doigt" : " · geste";
    return c;
  }
  let avant = 0;
  function boucle(t){
    if (avant && !document.hidden) {
      const d = t - avant; images++;
      if (d > 80 && d < 5000) {
        lentes++; perdu += d;
        const c = contexte(), p = parCtx[c] || (parCtx[c] = { n: 0, ms: 0, max: 0 });
        p.n++; p.ms += d; p.max = Math.max(p.max, d);
        pires.push([Math.round(d), c, new Date().toLocaleTimeString("fr-CA")]);
        pires.sort((a, b) => b[0] - a[0]); pires.length = Math.min(pires.length, 6);
      }
    }
    avant = document.hidden ? 0 : t;
    requestAnimationFrame(boucle);
  }
  requestAnimationFrame(boucle);
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
  function rapport(){
    if (!lentes || envois >= 12) return null;
    const min = Math.round((Date.now() - debut) / 60000);
    const L = ["Sur " + min + " min : " + lentes + " accrochages sur " + images + " images (" + Math.round(perdu / 1000) + " s perdues)",
      "Écran " + screen.width + "×" + screen.height + " ×" + devicePixelRatio + " · " + ((navigator.userAgent.match(/Chrome\/[\d]+/) || [""])[0]) + (/Android/.test(navigator.userAgent) ? " Android" : ""), "", "Où :"];
    Object.entries(parCtx).sort((a, b) => b[1].ms - a[1].ms).slice(0, 10)
      .forEach(([c, p]) => L.push("- " + c + " : " + p.n + " fois, pire " + Math.round(p.max) + " ms"));
    L.push("", "Pires :"); pires.forEach(p => L.push("- " + p[0] + " ms, " + p[1] + ", " + p[2]));
    const S = Object.entries(scripts).sort((a, b) => b[1] - a[1]).slice(0, 8);
    if (S.length) { L.push("", "Code responsable :"); S.forEach(([k, ms]) => L.push("- " + k + " : " + ms + " ms")); }
    envois++; debut = Date.now(); images = lentes = perdu = 0;
    for (const k in parCtx) delete parCtx[k]; for (const k in scripts) delete scripts[k]; pires.length = 0;
    return L.join("\n");
  }
  function envoyer(final){
    const m = rapport(); if (!m) return;
    const opts = { method: "POST", body: m, headers: { Title: "Journal fluidite TNI", Tags: "chart_with_downwards_trend" } };
    if (final && navigator.sendBeacon) { try { navigator.sendBeacon(SUJET, m); return; } catch(e){} }
    fetch(SUJET, Object.assign(opts, { keepalive: !!final })).catch(() => {});
  }
  setInterval(() => envoyer(false), 5 * 60000);
  addEventListener("pagehide", () => envoyer(true));
  document.addEventListener("visibilitychange", () => { if (document.hidden) envoyer(true); });
  window.journalPerf = () => rapport();   // pour les essais
})();
