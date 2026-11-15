/* © 2026 Jérémy Raymond. Tous droits réservés. */
/* Barre de navigation commune (8 nov., « la barre de navigation présente dans toutes les pages ») : passer d'un outil à l'autre sans revenir à l'accueil.
   Ailleurs que dans la bibliothèque, les liens ouvrent index.html?ouvrir=… (la bibliothèque ouvre l'outil dès que la session est prête). */
window.MP_NAV = [
  ["biblio", "Bibliothèque", '<path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>'],
  ["plans", "Plans", '<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>'],
  ["activites", "Formatifs", '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h4"/>'],
  ["outils", "Gestion d'atelier", '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>'],
  ["labo", "Labo", '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/>'],
  ["accueil", "Accueil de classe", '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'],
  ["tableau", "Tableau blanc", '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>']];
window.mpNavHTML = ici => '<nav class="mp-nav" aria-label="Outils">' + MP_NAV.map(([k, t, d]) => `<a href="${k === "labo" ? "labo.html" : k === "outils" ? "outils-atelier.html" : k === "biblio" ? "./" : "./?ouvrir=" + k}" data-nav="${k}"${k === ici ? ' class="ici" aria-current="page"' : ""}><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>${t}</a>`).join("") + "</nav>";


/* Pied de page commun (8 nov., piste A choisie par Jeremy) : logo + phrase, colonnes Outils et Aide, bande ©, « Né au Pavillon de l'Avenir ».
   Dans la bibliothèque, les liens ouvrent l'outil sans recharger (index.html les intercepte); ailleurs : index.html?ouvrir=… */
window.mpPiedHTML = () => {
  const outils = MP_NAV.map(([k, t]) => `<li><a href="${k === "labo" ? "labo.html" : k === "outils" ? "outils-atelier.html" : k === "biblio" ? "./" : "./?ouvrir=" + k}" data-pied="${k}">${t}</a></li>`).join("");
  return '<div class="mp-pied-haut"><div class="mp-pied-marque"><img class="lg-b" src="img/metier-plus-blanc.svg" alt="Métier+"><img class="lg-c" src="img/metier-plus.svg" alt="Métier+">'
    + '<p>La plateforme pédagogique des enseignants en formation professionnelle. Livres animés, plans, formatifs, quiz et simulations.</p></div>'
    + '<div><h4>Outils</h4><ul>' + outils + '</ul></div>'
    + '<div><h4>Aide</h4><ul><li><a href="./?ouvrir=neuf" data-pied="neuf">Quoi de neuf</a></li><li><a href="./?ouvrir=aide" data-pied="aide">Aide</a></li><li><a href="presentation.html">Présentation de Métier+</a></li><li><a href="./?ouvrir=signal" data-pied="signal">Signaler un problème</a></li><li><a href="confidentialite.html">Confidentialité</a></li><li class="mp-pied-acces"><a href="./?ouvrir=compte" data-pied="compte">Demander un accès</a></li></ul></div></div>'
    + '<div class="mp-pied-bas"><span>© 2026 Jérémy Raymond · Tous droits réservés · Réservé aux enseignants du Pavillon de l\'Avenir</span><span class="mp-pied-pav">Né au Pavillon de l\'Avenir <img src="img/pavillon-avenir.png" alt="Pavillon de l\'Avenir"></span></div>';
};
(function(){
  if (!document.getElementById("mpPiedCss")){ const st = document.createElement("style"); st.id = "mpPiedCss"; st.textContent =
    '.mp-pied{text-align:left!important;padding:0!important;margin-top:40px;border-top:1px solid rgba(128,128,128,.22);background:rgba(128,128,128,.06);font-size:14px;line-height:1.5;color:inherit;opacity:1!important}'
    + '.mp-pied-haut{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:40px;padding:40px 4vw 30px}'
    + '.mp-pied-marque img{height:30px;width:auto;display:block}.mp-pied .lg-c{display:none}body.clair .mp-pied .lg-b,html.clair .mp-pied .lg-b{display:none}body.clair .mp-pied .lg-c,html.clair .mp-pied .lg-c{display:block}'
    + '.mp-pied-marque p{margin:12px 0 0;max-width:340px;opacity:.68}'
    + '.mp-pied h4{margin:0 0 12px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.6}'
    + '.mp-pied ul{list-style:none;margin:0;padding:0;display:grid;gap:9px}.mp-pied ul a{color:inherit;text-decoration:none;opacity:.85}.mp-pied ul a:hover{opacity:1;color:#EB6A22}'
    + '.mp-pied-bas{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:16px 4vw 22px;border-top:1px solid rgba(128,128,128,.22);font-size:12.5px;opacity:.75}'
    + '.mp-pied-pav{display:flex;align-items:center;gap:10px}.mp-pied-pav img{height:24px;width:auto;background:#fff;border-radius:5px;padding:2px 6px}'
    + 'body.connecte .mp-pied-acces{display:none}'
    + '@media (max-width:760px){.mp-pied-haut{grid-template-columns:1fr 1fr;gap:28px 20px;padding:30px 18px 22px}.mp-pied-marque{grid-column:1/-1}.mp-pied-bas{padding:14px 18px 22px;flex-direction:column;align-items:flex-start}}';
    document.head.append(st); }
  const poser = () => document.querySelectorAll(".droits").forEach(d => { if (d.dataset.pied) return; d.dataset.pied = "1"; d.removeAttribute("style"); d.classList.add("mp-pied"); d.innerHTML = mpPiedHTML(); });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", poser); else poser();
})();
/* Mention « ALPHA » collée au coin du logo Métier+ (8 nov., option A choisie par Jeremy). Pour la retirer : ALPHA = false. */
(function(){
  const ALPHA = true; if (!ALPHA) return;
  const st = document.createElement("style");
  st.textContent = ".logo-pav{position:relative}"
    + ".logo-pav::after,.mp-alpha i{content:'ALPHA';position:absolute;top:-9px;font:800 9px/1 system-ui,sans-serif;font-style:normal;letter-spacing:.08em;color:#fff;background:#EB6A22;padding:3px 5px 2px;border-radius:5px;pointer-events:none;white-space:nowrap}"
    + ".logo-pav::after{right:-10px}"
    + ".mp-alpha{flex:none;width:0;align-self:center;height:22px;position:relative;overflow:visible!important;min-width:0!important;padding:0!important;border:0!important;background:none!important}.mp-alpha i{right:-6px;top:-10px}"
    + ".reader.wbon .reader-bar>.mp-alpha{order:-2}.reader:not(.wbon) .reader-bar>.mp-alpha{display:none}"
    + "@media (max-width:640px){.logo-pav::after,.mp-alpha i{font-size:8px;padding:2px 4px 1px;top:-8px}}";
  document.head.append(st);
  const poser = () => document.querySelectorAll(".mp-tete, .pl-top, .act-top, .reader-bar").forEach(bar => {
    if (bar.querySelector(":scope>.mp-alpha")) return;
    const imgs = [...bar.children].filter(e => e.tagName === "IMG" && /metier-plus/.test(e.getAttribute("src") || ""));
    if (!imgs.length) return;
    const g = parseFloat(getComputedStyle(bar).columnGap) || 0;   // l'espace ajouté par la pastille est repris : rien ne bouge
    const s = document.createElement("span"); s.className = "mp-alpha"; s.style.marginLeft = (-g) + "px"; s.innerHTML = "<i>ALPHA</i>"; s.setAttribute("aria-hidden", "true");
    const o = getComputedStyle(imgs[imgs.length - 1]).order; if (!bar.classList.contains("reader-bar") && o !== "0") s.style.order = o;   // logo placé en tête par « order »
    imgs[imgs.length - 1].after(s);
  });
  let f = 0; const plus_tard = () => { if (!f) f = requestAnimationFrame(() => { f = 0; poser(); }); };
  const go = () => { poser(); new MutationObserver(plus_tard).observe(document.body, { childList:true, subtree:true }); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();

/* Lien « Signaler un problème » du pied de page : ouvre la fenêtre sur place (signaler.js) au lieu de changer de page */
document.addEventListener("click", function(e){ var a = e.target.closest && e.target.closest('a[data-pied="signal"]'); if (!a || !window.mpSignaler) return; e.preventDefault(); e.stopPropagation(); window.mpSignaler(); }, true);

/* Barre trop pleine (15 nov., « un … serait envisageable ») : les derniers liens qui ne tiennent pas passent dans un menu « … » */
(function(){
  const css = document.createElement("style");
  css.textContent = `.mp-nav .mp-plus{display:inline-flex;align-items:center;justify-content:center;min-width:36px;min-height:32px;border:0;border-radius:9px;background:transparent;color:inherit;font:inherit;font-size:18px;font-weight:700;letter-spacing:1px;cursor:pointer;opacity:.78;padding:0 8px}
.mp-nav .mp-plus:hover,.mp-nav .mp-plus.on{opacity:1;background:rgba(128,128,128,.14)}.mp-nav .mp-plus.ici{opacity:1;color:#EB6A22;background:rgba(235,106,34,.16)}
.mp-plusM{position:fixed;z-index:100001;min-width:200px;padding:6px;border-radius:12px;background:#161d2c;color:#eef1f6;box-shadow:0 12px 32px rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.1)}
html.clair .mp-plusM,body.clair .mp-plusM{background:#fff;color:#1E2A44;border-color:#E5DAC6}
.mp-plusM a{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:8px;color:inherit;text-decoration:none;font-size:14px;font-weight:600}
.mp-plusM a:hover{background:rgba(128,128,128,.14)}.mp-plusM a.ici{color:#EB6A22}`;
  document.head.appendChild(css);
  let menu = null; const fermer = () => { if (menu){ menu.remove(); menu = null; document.querySelectorAll(".mp-plus.on").forEach(b => b.classList.remove("on")); } };
  function plier(nav){
    nav.querySelectorAll(":scope > a").forEach(a => a.style.removeProperty("display")); const b0 = nav.querySelector(".mp-plus"); if (b0) b0.remove();
    if (!nav.offsetParent) return;
    const n0 = nav.getBoundingClientRect(), pr = nav.parentElement.getBoundingClientRect();
    let lim = pr.right - (parseFloat(getComputedStyle(nav.parentElement).paddingRight) || 0);
    let lim0 = lim; [...nav.parentElement.children].forEach(s => { if (s === nav || s.classList.contains("mp-esp") || !s.offsetParent) return; const r = s.getBoundingClientRect(), w = Math.max(r.width, s.scrollWidth); if (w && r.left > n0.left + 20){ lim0 -= w + 10; lim = Math.min(lim, r.left - 10); } }); lim = Math.min(lim, lim0);
    if (nav.getBoundingClientRect().right <= lim) return;
    const btn = document.createElement("button"); btn.type = "button"; btn.className = "mp-plus"; btn.textContent = "…"; btn.title = "Plus d'outils"; btn.setAttribute("aria-label", "Plus d'outils"); nav.appendChild(btn);
    const liens = [...nav.querySelectorAll(":scope > a")].reverse(), caches = [];
    for (const a of liens){ if (nav.getBoundingClientRect().right <= lim) break; a.style.setProperty("display", "none", "important"); caches.unshift(a); }
    if (caches.some(a => a.classList.contains("ici"))) btn.classList.add("ici");
    btn.onclick = e => { e.preventDefault(); e.stopPropagation(); if (menu){ fermer(); return; }
      menu = document.createElement("div"); menu.className = "mp-plusM";
      caches.forEach(a => { const c = a.cloneNode(true); c.style.removeProperty("display"); c.onclick = ev => { ev.preventDefault(); fermer(); a.click(); }; menu.appendChild(c); });
      document.body.appendChild(menu); const r = btn.getBoundingClientRect();
      menu.style.top = (r.bottom + 6) + "px"; menu.style.left = Math.max(8, Math.min(innerWidth - menu.offsetWidth - 8, r.right - menu.offsetWidth)) + "px"; btn.classList.add("on"); };
  }
  const tout = () => { if (menu) return; document.querySelectorAll(".mp-nav").forEach(plier); };
  let p = 0; const bientot = () => { cancelAnimationFrame(p); p = requestAnimationFrame(tout); };
  addEventListener("resize", () => { fermer(); bientot(); }); document.addEventListener("click", e => { if (menu && !menu.contains(e.target)) fermer(); else if (!menu) setTimeout(bientot, 350); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") fermer(); });
  const go = () => { bientot(); setTimeout(bientot, 600); setTimeout(bientot, 2000);
    const mo = new MutationObserver(() => bientot()); mo.observe(document.body, { attributes:true, attributeFilter:["class"] }); mo.observe(document.documentElement, { attributes:true, attributeFilter:["class"] }); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
  window.mpNavPlier = bientot;
})();

/* 15 nov. (Jeremy : « Gestion d'atelier devrait seulement être affiché si tu as un groupe partagé avec toi ») :
   le lien est montré à l'administrateur et aux enseignants à qui un groupe est partagé (rangée publique du registre).
   Résultat gardé dans localStorage.gaVisible ("1"/"0"), revérifié au plus aux 10 min. Inconnu = caché. */
(() => {
  const H = document.documentElement, ici = /outils-atelier|passeport|coffres/.test(location.pathname);
  if (!document.getElementById("gaCss")) { const st = document.createElement("style"); st.id = "gaCss";
    st.textContent = 'html.sansGA [data-nav="outils"],html.sansGA [data-pied="outils"]{display:none!important}'; document.head.appendChild(st); }
  const vis = v => { H.classList.toggle("sansGA", !v && !ici); if (window.mpNavPlier) try { window.mpNavPlier(); } catch(e) {} };
  /* 15 nov. (« mon compte admin ne voit plus Gestion d'atelier ») : le compte est lu dans la session de la bibliothèque
     (IndexedDB « acces »), pas seulement dans dernierId (absent si la connexion date d'avant le 8 nov.) */
  let c = null; try { c = JSON.parse(localStorage.getItem("gaVisible") || "null"); } catch(e) {}
  vis(!!(c && c.v));
  const session = () => new Promise(ok => { try { const r = indexedDB.open("acces", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("s"); r.onerror = () => ok("");
    r.onsuccess = () => { try { const t = r.result.transaction("s").objectStore("s").get("session"); t.onsuccess = () => ok((t.result && t.result.id) || ""); t.onerror = () => ok(""); } catch(e) { ok(""); } };
  } catch(e) { ok(""); } });
  (async () => { let moi = await session(); if (!moi) try { if (localStorage.getItem("etaitConnecte")) moi = localStorage.getItem("dernierId") || ""; } catch(e) {}
  if (!moi) { vis(false); return; }
  vis(!!(c && c.id === moi && c.v));
  if (c && c.id === moi && Date.now() - c.t < 600000) return;
  const API = "https://kjlotlhqrgekzohshmbn.supabase.co/rest/v1/rpc/coffre_lire", CLE = "sb_publishable_1C-o-75sf7havBRmUWA8aQ_gcEW4sRY";
  const hache = async s => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))].map(b => b.toString(16).padStart(2, "0")).join("");
  (async () => { try {
    const C = (await (await fetch("comptes.json", {cache: "no-store"})).json()).comptes || {};
    let v = !!(C[moi] && C[moi].admin);
    if (!v) await Promise.all(Object.keys(C).filter(id => id !== moi && !C[id].eleve).map(async id => {
      const r = await fetch(API, {method: "POST", headers: {apikey: CLE, "Content-Type": "application/json"}, body: JSON.stringify({p_id: await hache("metier+|partage-passeport|" + id)})});
      if (!r.ok) return; const row = (await r.json() || [])[0], d = row && row.data ? JSON.parse(row.data) : {};
      for (const g in (d.part || {})) if ((d.part[g] || []).includes(moi)) v = true; }));
    localStorage.setItem("gaVisible", JSON.stringify({id: moi, v, t: Date.now()})); vis(v);
  } catch(e) {} })(); })();
})();
