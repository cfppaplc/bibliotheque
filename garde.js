/* © 2026 Jérémy Raymond. Tous droits réservés.
   Garde des outils du Labo (7 nov.) : le Labo, les quiz et les simulateurs sont réservés aux enseignants connectés à la bibliothèque.
   Les élèves (?j= quiz, ?panneau= simulateur) et l'écran de classe (?ecran=) passent sans compte.
   La session est celle de la bibliothèque (IndexedDB « acces », clé « session »); un compte de groupe d'élèves (comptes.json : eleve) est refusé.
   C'est une barrière d'usage, pas une protection forte : le code des pages reste lisible. */
(function(){
  const q = new URLSearchParams(location.search);
  if (q.get("j") || q.get("panneau") || q.get("ecran")) return;
  const html = document.documentElement; html.classList.add("garde-attente");
  const st = document.createElement("style");
  st.textContent = "html.garde-attente body{visibility:hidden}#gardeOv{position:fixed;inset:0;z-index:99999;background:#141414;color:#F2EFEA;display:flex;align-items:center;justify-content:center;padding:20px;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;visibility:visible}#gardeOv .bx{max-width:460px;background:#1F1F1F;border:1px solid #333;border-radius:18px;padding:26px;text-align:center}#gardeOv img{height:34px;margin-bottom:14px}#gardeOv h1{font-size:21px;margin:0 0 8px}#gardeOv p{color:#A8A29A;line-height:1.5;margin:0 0 18px}#gardeOv a,#gardeOv button{display:block;width:100%;box-sizing:border-box;border:0;border-radius:12px;padding:14px;font:700 16px system-ui,sans-serif;margin-top:10px;cursor:pointer;text-decoration:none}#gardeOv a{background:#EB6A22;color:#fff}#gardeOv button{background:#2A2A2A;color:#F2EFEA}#gardeOv small{display:block;margin-top:16px;color:#777;font-size:12px}";
  document.head.appendChild(st);
  const ouvrir = ok => {
    html.classList.remove("garde-attente");
    if (ok) return;
    /* 10 nov. : metierplus.app/quiz (ou /simulateur) sans compte = l'élève entre le code de la partie (si le code QR ne marche pas) */
    const jeu = /quiz/.test(location.pathname) ? "j" : /simulateur/.test(location.pathname) ? "panneau" : "";
    const f0 = () => { document.body.insertAdjacentHTML("beforeend", `<div id="gardeOv"><div class="bx"><img src="img/metier-plus-blanc.svg" alt="Métier+"><h1>Entre le code de la partie</h1>
      <p>Le code est affiché au tableau.</p><input id="gardeCode" inputmode="numeric" autocomplete="off" maxlength="9" placeholder="000 000" style="width:100%;box-sizing:border-box;font:800 40px system-ui,sans-serif;letter-spacing:.15em;text-align:center;padding:14px;border-radius:12px;border:2px solid #444;background:#141414;color:#fff">
      <a href="#" id="gardeGo" style="opacity:.4">Entrer</a><button id="gardeProf">Je suis enseignant</button><small>© 2026 Jérémy Raymond · Tous droits réservés</small></div></div>`);
      const i = document.getElementById("gardeCode"), go = document.getElementById("gardeGo"), val = () => i.value.replace(/\D/g, "");
      i.oninput = () => { go.style.opacity = val().length === 6 ? 1 : .4; }; i.focus();
      const entrer = e => { if (e) e.preventDefault(); if (val().length === 6) location.href = location.pathname.replace(/[^/]*$/, "") + (jeu === "j" ? "quiz.html" : "simulateur.html") + "?" + jeu + "=" + val(); };
      go.onclick = entrer; i.onkeydown = e => { if (e.key === "Enter") entrer(e); };
      document.getElementById("gardeProf").onclick = () => { document.getElementById("gardeOv").remove(); f(); }; };
    const f = () => { document.body.insertAdjacentHTML("beforeend", `<div id="gardeOv"><div class="bx"><img src="img/metier-plus-blanc.svg" alt="Métier+"><h1>Réservé aux enseignants</h1>
      <p>Le Labo, les quiz et les simulateurs sont offerts aux enseignants qui ont un accès à la bibliothèque. Connecte-toi dans la bibliothèque, puis reviens ici.</p>
      <a href="./">Ouvrir la bibliothèque</a><button id="gardeRe">Je suis connecté : réessayer</button><small>© 2026 Jérémy Raymond · Tous droits réservés</small></div></div>`);
      document.getElementById("gardeRe").onclick = () => location.reload(); };
    const g = jeu ? f0 : f; document.body ? g() : addEventListener("DOMContentLoaded", g);
  };
  let okRes; window.gardeOk = new Promise(r => okRes = r);
  let fini = false; const fin = ok => { if (!fini) { fini = true; okRes(ok); ouvrir(ok); } };
  setTimeout(() => fin(false), 4000);
  try {
    const r = indexedDB.open("acces", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("s");
    r.onerror = () => fin(false);
    r.onsuccess = () => { try {
      const t = r.result.transaction("s").objectStore("s").get("session");
      t.onerror = () => fin(false);
      t.onsuccess = () => { const s = t.result; if (!s || !s.id) return fin(false);
        fetch("comptes.json", {cache: "no-store"}).then(x => x.json()).then(d => { const c = d && d.comptes && d.comptes[s.id]; fin(!!c && !c.eleve); }).catch(() => fin(true)); };
    } catch(e) { fin(false); } };
  } catch(e) { fin(false); }
})();

/* Logo Métier+ des pages du Labo (8 nov.) : version blanche en thème foncé, et le carré « + » à la couleur choisie dans « Mes préférences » (localStorage.logoCouleur) */
(function(){
  let c = ""; try { c = localStorage.getItem("logoCouleur") || ""; } catch(e){}
  const perso = /^#[0-9a-f]{6}$/i.test(c) && !/^#(eb6a22|f2762e|e50914)$/i.test(c), cache = {};
  const svg = src => cache[src] || (cache[src] = fetch(src).then(r => r.text()).then(t => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(t.replace(/#F2762E/gi, c))).catch(() => null));
  /* fond réel derrière le logo (la télécommande reste claire même quand l'ordinateur est en thème foncé) */
  const fonce = el => { for (let e = el; e && e.nodeType === 1; e = e.parentElement){ const m = getComputedStyle(e).backgroundColor.match(/[\d.]+/g);
      if (m && (m.length < 4 || +m[3] > .5)) return (0.299 * m[0] + 0.587 * m[1] + 0.114 * m[2]) < 128; }
    return document.documentElement.classList.contains("sombre"); };
  const poser = img => { let s = img.dataset.m0 || img.getAttribute("src") || ""; if (!/metier-plus/.test(s)) return; img.dataset.m0 = s;
    if (img.dataset.blancAuto === "1" || img.closest(".tbar, .bordHaut, .mp-tete")){ img.dataset.blancAuto = "1"; if (fonce(img)) s = s.replace("metier-plus.svg", "metier-plus-blanc.svg"); }
    if (perso) svg(s).then(u => { if (u) img.src = u; }); else if (img.getAttribute("src") !== s) img.src = s; };
  const tout = () => document.querySelectorAll('img[src*="metier-plus"], img[data-m0]').forEach(poser);
  const go = () => { tout(); new MutationObserver(() => setTimeout(tout, 50)).observe(document.body, { attributes:true, attributeFilter:["class"] }); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();

/* En-tête commun Métier+ (8 nov., « le logo doit être placé pareil partout ») : même place, même taille que l'en-tête de la bibliothèque. */
(function(){ const st = document.createElement("style"); st.textContent = `
html{overflow-x:clip}
.mp-tete{display:flex!important;flex-wrap:nowrap!important;align-items:center;gap:14px;box-sizing:border-box;width:100vw;max-width:none;margin:calc(-1 * var(--mp-haut, 0px)) 0 18px calc(50% - 50vw)!important;padding:0 4vw!important;height:63px;border-bottom:1px solid rgba(128,128,128,.22);background:transparent}
.mp-tete>*{order:0!important;flex-basis:auto!important}
.mp-tete>img{height:27px!important;width:auto;flex:none;margin:0!important}
.mp-tete>img.lg-c{display:none}html.clair .mp-tete>img.lg-c{display:block}html.clair .mp-tete>img.lg-b{display:none}
.mp-tete .mp-nom{margin:0!important;font-size:15px!important;font-weight:600;color:#8b8f97!important;border-left:1px solid rgba(128,128,128,.35);padding-left:12px;white-space:nowrap;flex:none!important;line-height:1.2}
.mp-tete .mp-sous{font-size:13.5px;color:#8b8f97;opacity:.85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.mp-tete .mp-esp{flex:1 1 0!important;min-width:0}
.mp-tete a,.mp-tete button{flex:none;white-space:nowrap;margin:0!important}
.mp-tete a{display:inline-flex!important;align-items:center;min-height:40px;padding:8px 14px!important;border:1px solid rgba(128,128,128,.35)!important;border-radius:10px;font-size:14px!important;font-weight:600!important;color:inherit!important;text-decoration:none;background:transparent!important}
.mp-tete a.cache{display:none!important}
.mp-tete .mp-retour{order:99!important}

.mp-nav{display:flex;align-items:center;gap:4px;flex:none;margin-left:6px}
.mp-nav a{display:inline-flex!important;align-items:center;gap:6px;min-height:36px!important;padding:6px 10px!important;border:0!important;border-radius:9px;font-size:13.5px!important;font-weight:600!important;color:inherit!important;opacity:.78;text-decoration:none;white-space:nowrap;background:transparent!important}
.mp-nav a:hover{opacity:1;background:rgba(128,128,128,.14)!important}
.mp-nav a.ici{opacity:1;background:rgba(235,106,34,.16)!important;color:#EB6A22!important}
body.inclus .mp-nav{display:none!important}
@media (max-width:1250px){.mp-tete .mp-sous{display:none!important}}
.mp-tete .mp-sous{display:none!important}
.mp-tete{border-bottom:0!important}
.mp-tete .mp-nom{min-width:140px;box-sizing:border-box;padding-left:11px!important}
.mp-tete{gap:9px!important}.mp-tete .mp-nav{margin-left:13px}.mp-tete>a,.mp-tete>button{margin-left:5px!important}
.mp-tete .mp-nav a{min-height:32px!important;padding:5px 9px!important;font-size:12.2px!important;gap:5px}
.mp-tete .mp-nav svg{width:14px;height:14px}
.mp-tete>a,.mp-tete .mp-retour{min-height:31px!important;height:31px;padding:0 12px!important;border:1px solid rgba(128,128,128,.32)!important;border-radius:6px!important;background:rgba(128,128,128,.1)!important;font-size:12.7px!important;font-weight:500!important}
@media (max-width:980px){.mp-nav{display:none!important}}
@media (max-width:640px){.mp-tete{padding:0 14px!important;height:70px;gap:10px}.mp-tete>img{height:22px!important}.mp-tete .mp-sous,.mp-tete #lienEcran{display:none!important}.mp-tete .mp-nom{font-size:14px!important;padding-left:10px;overflow:hidden;text-overflow:ellipsis;flex:0 1 auto!important;min-width:0}.mp-tete a{min-height:38px;padding:6px 11px!important;font-size:13px!important}}
`; (document.head || document.documentElement).appendChild(st); })();

/* barre de navigation commune : définie dans garde-nav.js (aussi chargé par la bibliothèque) */
(function(){ const ici = "labo";
  const poser = () => window.mpNavHTML && document.querySelectorAll(".mp-tete").forEach(h => { if (h.querySelector(".mp-nav")) return; const e = h.querySelector(".mp-esp"); if (e) e.insertAdjacentHTML("beforebegin", mpNavHTML(ici)); });
  const s = document.createElement("script"); s.src = "garde-nav.js"; s.onload = () => { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", poser); else poser(); };
  (document.head || document.documentElement).appendChild(s); })();
