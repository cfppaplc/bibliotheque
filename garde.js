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
  st.textContent = "html.garde-attente body{visibility:hidden}#gardeOv{position:fixed;inset:0;z-index:99999;background:#141414;color:#F2EFEA;display:flex;align-items:center;justify-content:center;padding:20px;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;visibility:visible}#gardeOv .bx{max-width:460px;background:#1F1F1F;border:1px solid #333;border-radius:18px;padding:26px;text-align:center}#gardeOv img{height:34px;margin-bottom:14px}#gardeOv h1{font-size:21px;margin:0 0 8px}#gardeOv p{color:#A8A29A;line-height:1.5;margin:0 0 18px}#gardeOv a,#gardeOv button{display:block;width:100%;box-sizing:border-box;border:0;border-radius:12px;padding:14px;font:700 16px system-ui,sans-serif;margin-top:10px;cursor:pointer;text-decoration:none}#gardeOv a{background:#E50914;color:#fff}#gardeOv button{background:#2A2A2A;color:#F2EFEA}#gardeOv small{display:block;margin-top:16px;color:#777;font-size:12px}";
  document.head.appendChild(st);
  const ouvrir = ok => {
    html.classList.remove("garde-attente");
    if (ok) return;
    const f = () => { document.body.insertAdjacentHTML("beforeend", `<div id="gardeOv"><div class="bx"><img src="img/metier-plus-blanc.svg" alt="Métier+"><h1>Réservé aux enseignants</h1>
      <p>Le Labo interactif, les quiz et les simulateurs sont offerts aux enseignants qui ont un accès à la bibliothèque. Connecte-toi dans la bibliothèque, puis reviens ici.</p>
      <a href="./">Ouvrir la bibliothèque</a><button id="gardeRe">Je suis connecté : réessayer</button><small>© 2026 Jérémy Raymond · Tous droits réservés</small></div></div>`);
      document.getElementById("gardeRe").onclick = () => location.reload(); };
    document.body ? f() : addEventListener("DOMContentLoaded", f);
  };
  let fini = false; const fin = ok => { if (!fini) { fini = true; ouvrir(ok); } };
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
  const poser = img => { let s = img.dataset.m0 || img.getAttribute("src") || ""; if (!/metier-plus/.test(s)) return; img.dataset.m0 = s;
    if (img.dataset.blancAuto === "1" || img.closest(".tbar, .bordHaut")){ img.dataset.blancAuto = "1"; if (document.documentElement.classList.contains("sombre")) s = s.replace("metier-plus.svg", "metier-plus-blanc.svg"); }
    if (perso) svg(s).then(u => { if (u) img.src = u; }); else if (img.getAttribute("src") !== s) img.src = s; };
  const tout = () => document.querySelectorAll('img[src*="metier-plus"], img[data-m0]').forEach(poser);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tout); else tout();
})();
