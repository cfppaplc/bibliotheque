/* Défi+ des livres (21 nov.) : quand on a lu un tiers, deux tiers ou tout le livre, une petite carte propose le Défi+ de ce tiers.
   Données : js/defi-livre-data.js (window.DEFI_LIVRES). Une seule fois par tiers et par session. */
(() => {
  let carte = null, cacheT = 0;
  const vu = k => { try { return sessionStorage.getItem("defiVu:" + k) === "1"; } catch(e){ return false; } };
  const noter = k => { try { sessionStorage.setItem("defiVu:" + k, "1"); } catch(e){} };
  const NOMS = ["", "le premier tiers", "les deux tiers", "tout le livre"];
  function cacher(){ if (carte){ carte.remove(); carte = null; } clearTimeout(cacheT); }
  function montrer(livre, n, id){
    cacher(); const k = livre + ":" + n; noter(k);
    const r = document.getElementById("reader"); if (!r) return;
    carte = document.createElement("div"); carte.className = "defi-carte";
    carte.innerHTML = `<button type="button" class="defi-x" aria-label="Fermer">×</button><small>Tu as couvert ${NOMS[n]}.</small><b>Défi+ ${n} de 3</b><button type="button" class="btn primary defi-go">Faire le Défi+</button>`;
    carte.querySelector(".defi-x").onclick = cacher;
    carte.querySelector(".defi-go").onclick = () => { window.open("quiz.html?animer=1&quiz=" + encodeURIComponent(id), "_blank"); cacher(); };
    r.appendChild(carte); cacheT = setTimeout(cacher, 30000);
  }
  const st = document.createElement("style");
  st.textContent = ".defi-carte{position:absolute;right:18px;bottom:84px;z-index:60;background:var(--surface,#fff);color:var(--ink,#222);border:1px solid var(--line,#ddd);border-left:5px solid var(--copper,#C8642B);border-radius:12px;padding:14px 16px 14px;box-shadow:0 6px 22px rgba(0,0,0,.18);display:flex;flex-direction:column;gap:6px;min-width:230px;font:15px var(--body,system-ui)}"
    + ".defi-carte b{font-size:20px}.defi-carte small{opacity:.75}.defi-carte .defi-go{font-size:17px;padding:12px 18px;margin-top:4px}"
    + ".defi-x{position:absolute;top:4px;right:6px;border:0;background:none;font-size:24px;line-height:1;cursor:pointer;color:inherit;opacity:.6;padding:6px}";
  document.head.appendChild(st);
  setInterval(() => {
    try {
      const D = window.DEFI_LIVRES || {}, livre = typeof RD !== "undefined" && RD.drv && RD.book, ids = livre && D[livre];
      if (!ids){ cacher(); return; }
      if (carte) return;
      const t = totPages(), p = curPage(); if (!t) return;
      const f = p / t, n = f >= 0.97 ? 3 : f >= 2 / 3 ? 2 : f >= 1 / 3 ? 1 : 0;
      if (n && ids[n - 1] && !vu(livre + ":" + n)) montrer(livre, n, ids[n - 1]);
    } catch(e){}
  }, 1500);
})();
