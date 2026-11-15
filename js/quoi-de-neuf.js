/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — quoi-de-neuf.js (sorti d'index.html le 15 nov.) */
(function(){
  /* 8 nov. : « Quoi de neuf » en style magazine (option A choisie par Jeremy) : à la une, filtres, cartes, fiche détaillée */
  const lab = { ajout:"Nouveau livre", maj:"Mis à jour", outil:"Outil" };
  const CATS = [["tout", "Tout"], ["livres", "Livres"], ["outils", "Outils"], ["labo", "Labo"], ["accueil", "Accueil de classe"]];
  const ICO = { livres:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 19V5.5M8 7h8"/>',
    outils:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
    labo:'<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/>',
    accueil:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M7 9h4M7 12h7"/>' };
  const FOND = { livres:"img/presentation/livre.jpg", outils:"img/presentation/biblio.jpg", labo:"img/presentation/simu.jpg", accueil:"img/presentation/accueil.jpg" };
  const OUTIL = [[/tableau blanc/i, "tableau"], [/plans? techniques|plans?\b/i, "plans"], [/formatif/i, "activites"], [/labo|quiz|simulat/i, "labo"], [/accueil de classe/i, "accueil"]];
  let filtre = "tout", vuAvant = "";
  const cat = n => n.livre || n.type === "ajout" || n.type === "maj" ? "livres" : /labo|quiz|simulat/i.test(n.titre || "") ? "labo" : /accueil de classe/i.test(n.titre || "") ? "accueil" : "outils";
  const livreDe = n => n.livre && LIVRES.find(x => x.fichier === n.livre);
  const imageDe = n => { const f = (n.formation || []).find(x => x && typeof x === "object" && x.img); if (f) return f.img;
    const l = livreDe(n); if (l && window.COUVERTURES && COUVERTURES[l.couvDe || l.fichier]) return COUVERTURES[l.couvDe || l.fichier]; return FOND[cat(n)]; };
  const outilDe = n => { if (cat(n) === "livres") return null; for (const [re, k] of OUTIL) if (re.test(n.titre || "")) return k; return null; };
  const nouveau = n => vuAvant && n.date > vuAvant;
  const svg = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICO[k]}</svg>`;
  function actions(n){ const l = livreDe(n), o = outilDe(n);
    return (l ? `<button type="button" class="qn2-go" data-ouvrir="${esc(l.fichier)}">Ouvrir le livre</button>` : "") + (o ? `<button type="button" class="qn2-go" data-outil="${o}">Essayer</button>` : ""); }
  function liste(){
    const L = NOUV.map((n, i) => ({ n, i })), une = L[0], reste = L.slice(1).filter(x => filtre === "tout" || cat(x.n) === filtre);
    const c = (x, grand) => { const n = x.n, k = cat(n);
      return `<button type="button" class="qn2-carte${grand ? " une" : ""}" data-i="${x.i}"><span class="qn2-img" style="background-image:url('${esc(imageDe(n))}')"></span><span class="qn2-txt">`
        + `<span class="qn2-meta"><span class="qn2-ico ${k}">${svg(k)}</span><span class="qn-tag ${esc(n.type || "outil")}">${lab[n.type] || "Outil"}</span>${nouveau(n) ? '<span class="qn2-nv">Nouveau pour toi</span>' : ""}<span class="qn2-d">${esc(dateFr(n.date))}</span></span>`
        + `<span class="qn2-t">${esc(n.titre || "")}</span><span class="qn2-p">${esc(n.texte || "")}</span>${grand ? '<span class="qn2-voir">Voir la mini-formation ›</span>' : ""}</span></button>`; };
    $("#qnListe").innerHTML = (une && filtre === "tout" ? `<div class="qn2-h">À la une</div>${c(une, true)}` : "")
      + `<div class="qn2-puces">${CATS.map(([k, t]) => `<button type="button" data-f="${k}" class="${k === filtre ? "on" : ""}">${t}</button>`).join("")}</div>`
      + `<div class="qn2-grille">${(filtre === "tout" ? reste : L.filter(x => cat(x.n) === filtre)).map(x => c(x)).join("") || '<p class="qn-sous">Rien dans cette catégorie pour l\'instant.</p>'}</div>`;
  }
  function fiche(i){
    const n = NOUV[i]; if (!n) return liste();
    const form = Array.isArray(n.formation) ? n.formation : [], hist = Array.isArray(n.versions) ? n.versions : [], k = cat(n);
    $("#qnListe").innerHTML = `<button type="button" class="qn2-ret" data-ret="1">‹ Toutes les nouveautés</button>`
      + `<div class="qn2-fiche"><div class="qn2-meta"><span class="qn2-ico ${k}">${svg(k)}</span><span class="qn-tag ${esc(n.type || "outil")}">${lab[n.type] || "Outil"}</span><span class="qn2-d">${esc(dateFr(n.date))}</span></div>`
      + `<h3 class="qn2-ft">${esc(n.titre || "")}</h3><p class="qn2-fp">${esc(n.texte || "")}</p><div class="qn2-acts">${actions(n)}</div>`
      + (form.length ? `<div class="qn2-h">Mini-formation</div><ol class="qn2-etapes">${form.map((f, j) => { const t = typeof f === "string" ? f : f.t, im = typeof f === "object" && f.img;
          return `<li><span class="qn2-n">${j + 1}</span><div><p>${esc(t)}</p>${im ? `<img class="qn-img" src="${esc(im)}" alt="" loading="lazy">` : ""}</div></li>`; }).join("")}</ol>` : "")
      + (hist.length ? `<div class="qn2-h">Historique</div><ul class="qn-hist">${hist.map(v => `<li><span class="d">${esc(dateFr(v.date))}</span><span>${esc(v.texte)}</span></li>`).join("")}</ul>` : "") + `</div>`;
    $("#qnOv").scrollTop = 0;
  }
  function dessiner(){ liste(); }
  $("#qnListe").addEventListener("click", e => {
    const f = e.target.closest("[data-f]"); if (f){ filtre = f.dataset.f; liste(); return; }
    if (e.target.closest("[data-ret]")){ liste(); $("#qnOv").scrollTop = 0; return; }
    const lv = e.target.closest("[data-ouvrir]"); if (lv){ const l = LIVRES.find(x => x.fichier === lv.dataset.ouvrir); $("#qnOv").hidden = true; if (l) openModal(l); return; }
    const o = e.target.closest("[data-outil]"); if (o){ $("#qnOv").hidden = true; if (window.mpAller) window.mpAller(o.dataset.outil); return; }
    const c = e.target.closest(".qn2-carte"); if (c) fiche(+c.dataset.i);
  });
  window.ouvrirQn = titre => { ouvrir(); const i = NOUV.findIndex(n => (n.titre || "").startsWith(titre)); if (i >= 0) fiche(i); };
  function ouvrir(e){ if (e) e.preventDefault(); vuAvant = lireLS("nouvVu", ""); filtre = "tout"; dessiner(); $("#qnOv").hidden = false; $("#qnOv").scrollTop = 0;
    if (NOUV[0]){ ecrireLS("nouvVu", NOUV[0].date); $("#qnPoint").hidden = true; } }
  $("#qnX").onclick = () => { $("#qnOv").hidden = true; };
  $("#quoiNeuf").addEventListener("click", ouvrir);
  $("#qnFermer").onclick = () => { $("#qnOv").hidden = true; };
  $("#qnOv").addEventListener("click", e => { if (e.target.id === "qnOv") $("#qnOv").hidden = true; });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#qnOv").hidden) $("#qnOv").hidden = true; });
  fetch("nouveautes.json", { cache:"no-cache" }).then(r => r.ok ? r.json() : []).then(d => {
    NOUV = (Array.isArray(d) ? d : []).filter(n => !n.cache).sort((a, b) => b.date.localeCompare(a.date));   /* cache:true = sujet pas encore annoncé (ex. version élève) */
    const vu = lireLS("nouvVu", ""); $("#qnPoint").hidden = !(NOUV[0] && NOUV[0].date > vu);
    try { render(); } catch(e){}
  }).catch(() => {});
})();
