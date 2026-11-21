/* © 2026 Jérémy Raymond. Tous droits réservés.
   Garde des outils du Labo (7 nov.) : le Labo, les quiz et les simulateurs sont réservés aux enseignants connectés à la bibliothèque.
   Les élèves (?j= quiz, ?panneau= simulateur) et l'écran de classe (?ecran=) passent sans compte.
   La session est celle de la bibliothèque (IndexedDB « acces », clé « session »); un compte de groupe d'élèves (comptes.json : eleve) est refusé.
   C'est une barrière d'usage, pas une protection forte : le code des pages reste lisible. */
(function(){
  const q = new URLSearchParams(location.search);
  if (q.get("j") || q.get("panneau") || q.get("ecran") || (q.get("o") && /passeport/.test(location.pathname)) || (q.get("c") && /coffres/.test(location.pathname))) return;   /* passeport.html?o= = élève qui suit la formation d'un outil (14 nov.) */
  const html = document.documentElement; html.classList.add("garde-attente");
  const st = document.createElement("style");
  st.textContent = "html.garde-attente body{visibility:hidden}#gardeOv{position:fixed;inset:0;z-index:99999;background:#141414;color:#F2EFEA;display:flex;align-items:center;justify-content:center;padding:20px;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;visibility:visible}#gardeOv .bx{max-width:460px;background:#1F1F1F;border:1px solid #333;border-radius:18px;padding:26px;text-align:center}#gardeOv img{height:34px;margin-bottom:14px}#gardeOv h1{font-size:21px;margin:0 0 8px}#gardeOv p{color:#A8A29A;line-height:1.5;margin:0 0 18px}#gardeOv a,#gardeOv button{display:block;width:100%;box-sizing:border-box;border:0;border-radius:12px;padding:14px;font:700 16px system-ui,sans-serif;margin-top:10px;cursor:pointer;text-decoration:none}#gardeOv a{background:#EB6A22;color:#fff}#gardeOv button{background:#2A2A2A;color:#F2EFEA}#gardeOv small{display:block;margin-top:16px;color:#777;font-size:12px}";
  document.head.appendChild(st);
  const ouvrir = ok => {
    html.classList.remove("garde-attente");
    if (ok) return;
    /* 10 nov. : metierplus.app/quiz (ou /simulateur) sans compte = l'élève entre le code de la partie (si le code QR ne marche pas) */
    const jeu = /quiz/.test(location.pathname) ? "j" : /simulateur/.test(location.pathname) ? "panneau" : "";
    const f0 = () => { document.body.insertAdjacentHTML("beforeend", `<div id="gardeOv"><div class="bx">${jeu === "j" ? `<div style="font:800 52px/1 system-ui,sans-serif;display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:6px">Défi<span style="display:inline-grid;place-items:center;width:50px;height:50px;border-radius:12px;background:#E8641C;color:#fff;font-size:44px">+</span></div>` : `<img src="img/metier-plus-blanc.svg" alt="Métier+">`}<h1>Entre le code de la partie</h1>
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
(function(){ const ici = /passeport|coffres|outils-atelier/.test(location.pathname) ? "outils" : "labo";
  const poser = () => window.mpNavHTML && document.querySelectorAll(".mp-tete").forEach(h => { if (h.querySelector(".mp-nav")) return; const e = h.querySelector(".mp-esp"); if (e) e.insertAdjacentHTML("beforebegin", mpNavHTML(ici)); });
  const s = document.createElement("script"); s.src = "garde-nav.js"; s.onload = () => { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", poser); else poser(); };
  (document.head || document.documentElement).appendChild(s); })();

/* Code QR avec le logo Métier+ au centre (14 nov.) : appeler après new QRCode(el, {…, correctLevel: QRCode.CorrectLevel.H}).
   La correction H tolère ~30 % de pertes; le logo couvre ~5 % du code. */
window.qrLogo = function(el){
  if (!el || el.querySelector(".qrLogo")) return;
  /* le code est mis dans une petite boîte de sa taille : le logo s'y centre même si la page est cachée (impression) */
  var w = document.createElement("span"); w.className = "qrBoite"; w.style.cssText = "position:relative;display:inline-block;line-height:0;vertical-align:top";
  [].slice.call(el.childNodes).forEach(function(c){ w.appendChild(c); });
  el.appendChild(w);
  var i = document.createElement("img"); i.className = "qrLogo"; i.alt = ""; i.src = "img/metier-plus-icone.svg";
  i.style.cssText = "position:absolute;left:50%;top:50%;width:20%;height:20%;padding:3%;transform:translate(-50%,-50%);background:#fff;border-radius:12%;box-sizing:content-box;pointer-events:none";
  w.appendChild(i);
};

/* Imprimer un historique (15 nov., « des traces si jamais on enquête ») : tableau simple dans un cadre caché, puis impression */
window.mpImprimer = function(titre, sous, entetes, rangees){
  const e = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const now = new Date().toLocaleString("fr-CA", { dateStyle:"long", timeStyle:"short" });
  const html = `<!doctype html><html lang="fr"><meta charset="utf-8"><title>${e(titre)}</title><style>
    @page{margin:14mm}body{font:12px/1.4 "Segoe UI",Roboto,Arial,sans-serif;color:#1E2A44;margin:0}
    .t{display:flex;align-items:center;gap:12px;border-bottom:2px solid #EB6A22;padding-bottom:8px;margin-bottom:10px}.t img{height:26px}
    h1{font-size:19px;margin:0}p{margin:2px 0;color:#555}table{width:100%;border-collapse:collapse;margin-top:10px}
    th{background:#1E2A44;color:#fff;text-align:left;padding:5px 7px;font-size:11px}td{border-bottom:1px solid #ddd;padding:5px 7px;vertical-align:top}
    tr{break-inside:avoid}.pied{margin-top:14px;font-size:10px;color:#777}</style>
    <div class="t"><img src="${location.origin}${location.pathname.replace(/[^/]*$/, "")}img/metier-plus.svg" alt=""><div><h1>${e(titre)}</h1>${sous ? `<p>${e(sous)}</p>` : ""}</div></div>
    <p>Imprimé le ${e(now)} · ${rangees.length} entrée${rangees.length > 1 ? "s" : ""}</p>
    <table><thead><tr>${entetes.map(h => `<th>${e(h)}</th>`).join("")}</tr></thead><tbody>${rangees.map(r => `<tr>${r.map(c => `<td>${e(c)}</td>`).join("")}</tr>`).join("") || `<tr><td colspan="${entetes.length}">Aucune entrée</td></tr>`}</tbody></table>
    <p class="pied">Document confidentiel : renseignements sur des élèves (Loi 25). À conserver en lieu sûr.</p></html>`;
  const f = document.createElement("iframe"); f.style.cssText = "position:fixed;width:0;height:0;border:0;right:0;bottom:0"; document.body.appendChild(f);
  f.contentDocument.open(); f.contentDocument.write(html); f.contentDocument.close();
  let fait = false; const go = () => { if (fait) return; fait = true; try { f.contentWindow.focus(); f.contentWindow.print(); } catch (x) {} setTimeout(() => f.remove(), 60000); };
  const im = f.contentDocument.querySelector("img"); if (im && !im.complete){ im.onload = im.onerror = go; setTimeout(go, 1500); } else go();
};
window.mpDateHeure = t => new Date(t).toLocaleString("fr-CA", { year:"numeric", month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" }).replace(/(\d+):(\d+)/, "$1 h $2");

/* Impression des codes QR et étiquettes (15 nov., « le chargement avant impression plante ») :
   dans Gestion d'atelier, la page est dans un cadre; imprimer depuis le cadre faisait planter l'aperçu.
   On imprime plutôt #qrs dans une petite fenêtre à part, avec les mêmes styles. */
window.mpImprimerQrs = function(nom){
  /* 15 nov. (« on devrait télécharger les codes QR en PDF ») : les feuilles sont dessinées page par page
     (à partir de la mise en page d'impression de #qrs) puis enregistrées dans un vrai PDF, format lettre.
     On l'ouvre et on imprime à 100 %. Rien n'est envoyé ailleurs : tout se fait dans le navigateur. */
  const Z = document.getElementById("qrs"); if (!Z) return print();
  const toast = window.toast || (t => alert(t));
  try { toast("Préparation du PDF…"); } catch(e) {}
  const css = [...document.querySelectorAll("style")].map(s => s.textContent).join("\n").replace(/@media\s+print/g, "@media all");
  const pg = !!Z.querySelector(".pg"), IN = 96, W = 8.5 * IN, H = 11 * IN, MG = pg ? 0 : 10 / 25.4 * IN;
  const f = document.createElement("iframe");
  f.style.cssText = `position:fixed;left:-20000px;top:0;width:${W}px;height:${H}px;border:0;visibility:hidden`;
  document.body.appendChild(f);
  const d = f.contentDocument;
  /* un canevas ne garde pas son dessin dans une copie : on le remplace par son image */
  const cl = Z.cloneNode(true), ori = Z.querySelectorAll("canvas");
  cl.querySelectorAll("canvas").forEach((c, i) => { const o = ori[i]; if (!o || getComputedStyle(o).display === "none") { c.remove(); return; }
    try { const im = document.createElement("img"); im.src = o.toDataURL("image/png"); im.className = c.className; im.setAttribute("style", c.getAttribute("style") || ""); c.replaceWith(im); } catch(e) {} });
  d.open(); d.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><base href="${location.href}"><style>${css}
    html,body{margin:0;background:#fff}body{padding:${MG}px;width:${W}px;box-sizing:border-box}#qrs{display:block!important}</style></head><body>${cl.outerHTML}</body></html>`); d.close();
  const fin = () => setTimeout(() => f.remove(), 500);
  const attendre = () => Promise.all([...d.images].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; })));
  setTimeout(() => attendre().then(() => new Promise(r => setTimeout(r, 150))).then(async () => {
    const Q = d.getElementById("qrs"), K = 200 / IN; /* 200 points par pouce */
    /* pages : .pg = une page chacune; sinon les cartes coulent et on coupe entre les cartes */
    const pages = []; /* [haut de la page, cartes de la page] */
    if (pg) Q.querySelectorAll(".pg").forEach(p => pages.push([p.getBoundingClientRect().top, [p]]));
    else { const hUtile = H - 2 * MG; let cur = null;
      [...Q.children].forEach(c => { const r = c.getBoundingClientRect();
        if (!cur || r.bottom - (cur[0] + MG) > hUtile) { cur = [r.top - MG, []]; pages.push(cur); }
        cur[1].push(c); }); }
    const W2 = Math.round(W * K), H2 = Math.round(H * K), jpegs = [];
    for (const [y0, cartes] of pages) {
      const cv = document.createElement("canvas"); cv.width = W2; cv.height = H2; const x = cv.getContext("2d");
      x.fillStyle = "#fff"; x.fillRect(0, 0, W2, H2); x.scale(K, K); x.translate(0, -y0);
      const tous = cartes.flatMap(c => [c, ...c.querySelectorAll("*")]);
      for (const el of tous) {
        const r = el.getBoundingClientRect(); if (!r.width) continue;
        const cs = d.defaultView.getComputedStyle(el); if (cs.display === "none" || cs.visibility === "hidden") continue;
        const rad = parseFloat(cs.borderTopLeftRadius) || 0;
        const boite = () => { x.beginPath(); x.roundRect ? x.roundRect(r.left, r.top, r.width, r.height, rad) : x.rect(r.left, r.top, r.width, r.height); };
        if (cs.backgroundColor && !/rgba\(.*,\s*0\)|transparent/.test(cs.backgroundColor)) { x.fillStyle = cs.backgroundColor; boite(); x.fill(); }
        const bw = parseFloat(cs.borderTopWidth) || 0;
        if (bw && cs.borderTopStyle !== "none") { x.save(); x.strokeStyle = cs.borderTopColor; x.lineWidth = bw; x.setLineDash(cs.borderTopStyle === "dashed" ? [4, 3] : cs.borderTopStyle === "dotted" ? [1, 2] : []);
          x.beginPath(); x.roundRect ? x.roundRect(r.left + bw / 2, r.top + bw / 2, r.width - bw, r.height - bw, Math.max(0, rad - bw / 2)) : x.rect(r.left, r.top, r.width, r.height); x.stroke(); x.restore(); }
        if (el.tagName === "IMG" && el.naturalWidth) { try { x.drawImage(el, r.left, r.top, r.width, r.height); } catch(e) {} }
        if (el.tagName === "CANVAS") { try { x.drawImage(el, r.left, r.top, r.width, r.height); } catch(e) {} }
        for (const n of el.childNodes) { if (n.nodeType !== 3 || !n.nodeValue.trim()) continue;
          x.fillStyle = cs.color; x.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`; x.textBaseline = "alphabetic";
          try { x.letterSpacing = cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing; } catch(e) {}
          const up = cs.textTransform === "uppercase", txt = n.nodeValue, rg = d.createRange(), re = /\S+/g; let m;
          while ((m = re.exec(txt))) { rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length); const b = rg.getBoundingClientRect(); if (!b.width) continue;
            const mt = x.measureText("Hg"), asc = mt.fontBoundingBoxAscent || parseFloat(cs.fontSize) * .8, des = mt.fontBoundingBoxDescent || parseFloat(cs.fontSize) * .2;
            x.fillText(up ? m[0].toUpperCase() : m[0], b.left, b.top + (b.height - asc - des) / 2 + asc); } }
      }
      const u = cv.toDataURL("image/jpeg", .92); jpegs.push(Uint8Array.from(atob(u.split(",")[1]), c => c.charCodeAt(0)));
    }
    /* PDF fait à la main : une image JPEG par page, format lettre (612 x 792 pt) */
    const enc = new TextEncoder(), parts = [], offs = []; let pos = 0;
    const add = b => { const u = typeof b === "string" ? enc.encode(b) : b; parts.push(u); pos += u.length; };
    const obj = (n, f2) => { offs[n] = pos; add(n + " 0 obj\n"); f2(); add("\nendobj\n"); };
    add("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
    const np = jpegs.length, kids = []; for (let i = 0; i < np; i++) kids.push((3 + i * 3) + " 0 R");
    obj(1, () => add("<< /Type /Catalog /Pages 2 0 R >>"));
    obj(2, () => add(`<< /Type /Pages /Count ${np} /Kids [${kids.join(" ")}] >>`));
    jpegs.forEach((jp, i) => { const pn = 3 + i * 3, cn = pn + 1, im = pn + 2, cs2 = "q 612 0 0 792 0 0 cm /Im0 Do Q";
      obj(pn, () => add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /XObject << /Im0 ${im} 0 R >> >> /Contents ${cn} 0 R >>`));
      obj(cn, () => add(`<< /Length ${cs2.length} >>\nstream\n${cs2}\nendstream`));
      obj(im, () => { add(`<< /Type /XObject /Subtype /Image /Width ${W2} /Height ${H2} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jp.length} >>\nstream\n`); add(jp); add("\nendstream"); }); });
    const nObj = 3 + np * 3, xref = pos;
    add(`xref\n0 ${nObj}\n0000000000 65535 f \n` + offs.slice(1, nObj).map(o => String(o).padStart(10, "0") + " 00000 n \n").join(""));
    add(`trailer\n<< /Size ${nObj} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
    const dt = new Date(), date = dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0") + "-" + String(dt.getDate()).padStart(2, "0");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(parts, { type:"application/pdf" })); a.download = (nom || "metierplus-codes") + "-" + date + ".pdf";
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
    try { toast(`PDF téléchargé (${np} page${np > 1 ? "s" : ""}) : ouvre-le et imprime à 100 %.`); } catch(e) {}
    fin();
  }).catch(e => { fin(); try { toast("Le PDF n'a pas pu être fait."); } catch(e2) {} }), 300);
};
