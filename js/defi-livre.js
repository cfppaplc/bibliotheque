/* Défi+ des livres (21 nov.) : quand on a lu un tiers, deux tiers ou tout le livre, une petite carte propose le Défi+ de ce tiers.
   Données : js/defi-livre-data.js (window.DEFI_LIVRES). Une seule fois par tiers et par session. */
(() => {
  let carte = null, cacheT = 0, avant = "";
  const vu = k => { try { return sessionStorage.getItem("defiVu:" + k) === "1"; } catch(e){ return false; } };
  const noter = k => { try { sessionStorage.setItem("defiVu:" + k, "1"); } catch(e){} };
  
  function cacher(){ if (carte){ carte.remove(); carte = null; } clearTimeout(cacheT); }
  function montrer(livre, n, id, N){
    cacher(); const k = livre + ":" + n; noter(k);
    const r = document.getElementById("reader"); if (!r) return;
    carte = document.createElement("div"); carte.className = "defi-carte";
    carte.innerHTML = `<button type="button" class="defi-x" aria-label="Fermer">×</button><div class="defi-logo">Défi<span>+</span></div><div class="defi-n">${n} de ${N}</div><small>${n === N ? "Tu as terminé le livre." : "Tu as couvert " + Math.round(n * 100 / N) + " % du livre."}</small><button type="button" class="defi-go">Lancer le Défi+</button>`;
    carte.querySelector(".defi-x").onclick = cacher;
    carte.querySelector(".defi-go").onclick = () => { window.open("quiz.html?animer=1&quiz=" + encodeURIComponent(id), "_blank"); cacher(); };
    r.appendChild(carte); cacheT = setTimeout(cacher, 30000);
  }
  const st = document.createElement("style");
  st.textContent = ".defi-carte{position:absolute;right:24px;bottom:96px;z-index:60;width:340px;background:var(--surface,#fff);color:var(--ink,#222);border:3px solid #E8641C;border-radius:18px;padding:20px 22px 22px;box-shadow:0 14px 40px rgba(0,0,0,.35);display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;font:16px var(--body,system-ui);animation:defiIn .7s cubic-bezier(.2,1.4,.4,1) both}.defi-logo{font:800 64px/1 var(--display,var(--body,system-ui));letter-spacing:-1px;display:flex;align-items:center;gap:6px}.defi-logo span{display:inline-grid;place-items:center;width:58px;height:58px;border-radius:14px;background:#E8641C;color:#fff;font-size:52px;animation:defiTourne .8s ease-out .7s both}.defi-n{font:700 22px var(--body,system-ui);color:#E8641C}.defi-carte small{font-size:15px;opacity:.8}.defi-go{margin-top:10px;width:100%;font:700 22px var(--body,system-ui);color:#fff;background:#E8641C;border:0;border-radius:12px;padding:16px 18px;cursor:pointer;animation:defiPouls .9s ease-in-out 1.5s 3 both}.defi-go:hover{filter:brightness(1.08)}.defi-x{position:absolute;top:6px;right:8px;border:0;background:none;font-size:28px;line-height:1;cursor:pointer;color:inherit;opacity:.6;padding:6px}@keyframes defiIn{from{opacity:0;transform:translateY(60px) scale(.6)}to{opacity:1;transform:none}}@keyframes defiTourne{from{transform:rotate(-180deg) scale(.3)}to{transform:none}}@keyframes defiPouls{0%,100%{transform:none}50%{transform:scale(1.07)}}@media (max-width:600px){.defi-carte{right:12px;left:12px;width:auto}}";
  document.head.appendChild(st);
  setInterval(() => {
    try {
      const D = window.DEFI_LIVRES || {}, livre = typeof RD !== "undefined" && RD.drv && RD.book, ids = livre && D[livre];
      if (!ids){ cacher(); return; }
      if (carte) return;
      const t = totPages(), p = curPage(); if (t < 12) return;
      const cle = livre + "|" + t; if (cle !== avant){ avant = cle; return; }   /* attendre que le livre soit bien chargé (nombre de pages stable) */
      const N = ids.length, f = p / t; let n = f >= 0.97 ? N : Math.floor(f * N + 1e-9); if (n >= N) n = f >= 0.97 ? N : N - 1;
      if (n && ids[n - 1] && !vu(livre + ":" + n)) montrer(livre, n, ids[n - 1], N);
    } catch(e){}
  }, 1500);
})();
