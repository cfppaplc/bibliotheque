/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — navigation.js (sorti d'index.html le 15 nov.) */
/* Barre de navigation dans Plans et Activités + ouverture d'un outil demandé par une autre page (?ouvrir=plans|activites|accueil|tableau) */
(function(){
  const BTN = { plans:"planBtn", activites:"actBtn", accueil:"accueilBtn", tableau:"wbBtn" }, FERMER = ["plClose", "actBack"];
  /* 8 nov. (« entre Activités et Plans on voit l'accueil une seconde ») : on ouvre d'abord le nouvel outil, puis on ferme l'ancien dessous */
  let aller = k => { const ouverts = FERMER.map(id => document.getElementById(id)).filter(b => b && b.checkVisibility && b.checkVisibility());
    const fermer = () => ouverts.forEach(b => { try { b.click(); } catch(e){} });
    if (k === "biblio"){ fermer(); return; } if (k === "labo"){ location.href = "labo.html"; return; } if (k === "outils"){ location.href = "outils-atelier.html"; return; }
    if (ouverts.length && BTN[k]){ document.documentElement.classList.add("ouvre"); const b = document.getElementById(BTN[k]); if (b) b.click(); setTimeout(() => { fermer(); setTimeout(() => document.documentElement.classList.remove("ouvre"), 200); }, 260); return; }
    setTimeout(() => { const b = document.getElementById(BTN[k]); if (b) b.click(); }, 60); };
  /* 8 nov. (« harmonise les en-têtes ») : partout logo · nom de la page · petite description · barre de navigation · retour à droite */
  const TIT = { plans:["Plans techniques", "Dossiers de plans et exercices de lecture"], activites:["Formatifs", "Cahiers et questionnaires à projeter ou imprimer"], tableau:["Tableau blanc", "Dessine, schématise et explique"] };
  const titre = k => `<span class="mp-tit"><b class="mp-nom2">${TIT[k][0]}</b><span class="mp-sous2">${TIT[k][1]}</span></span>`;
  if (window.closeReader){ const a0 = aller; aller = k => { const r = document.getElementById("reader"); if (r && r.classList.contains("open") && r.classList.contains("wbon") && k !== "tableau"){ closeReader(); setTimeout(() => a0(k), 80); } else a0(k); }; }
  [[".pl-top", "plans"], [".act-top", "activites"], [".reader-bar", "tableau"]].forEach(([sel, ici]) => { const bar = document.querySelector(sel); if (!bar || bar.querySelector(".mp-nav")) return;
    const logo = bar.querySelector(".top-logo:last-of-type, .rb-logo") || bar.firstElementChild; logo.insertAdjacentHTML("afterend", titre(ici) + mpNavHTML(ici));
    bar.querySelectorAll(".mp-nav a").forEach(a => a.onclick = e => { e.preventDefault(); if (a.classList.contains("ici")) return; aller(a.dataset.nav); }); });
  /* même barre sur l'accueil (8 nov., « c'est la meilleure barre du site, elle devrait être partout ») */
  window.mpAller = aller;
  const tete = document.getElementById("topbar"), logo = tete && tete.querySelector(".logo");
  if (logo){ if (!tete.querySelector(".mp-nav")) logo.insertAdjacentHTML("afterend", mpNavHTML("biblio").replace('class="mp-nav"', 'class="mp-nav mp-nav-tete"'));
    tete.querySelectorAll(".mp-nav a").forEach(a => a.onclick = e => { e.preventDefault(); if (a.dataset.nav === "biblio"){ const b = document.querySelector('header nav a[data-view="all"]'); if (b) b.click(); scrollTo({ top: 0, behavior: "smooth" }); return; } aller(a.dataset.nav); }); }
  /* pied de page commun (garde-nav.js) : les liens ouvrent l'outil sans recharger la page */
  const pied = document.querySelector("body > footer");
  if (pied && window.mpPiedHTML && !pied.dataset.piedPose){ const adm = document.getElementById("adminBtn"); pied.dataset.piedPose = "1"; pied.classList.add("mp-pied"); pied.innerHTML = mpPiedHTML(); if (adm){ adm.hidden = true; pied.append(adm); }
    pied.addEventListener("click", e => { const a = e.target.closest("a[data-pied]"); if (!a) return; const k = a.dataset.pied; if (k === "labo") return;
      e.preventDefault(); actionPied(k); }); }
  function actionPied(k){
    if (k === "biblio"){ scrollTo({ top:0, behavior:"smooth" }); return; }
    if (k === "neuf" || k === "aide"){ const b = document.getElementById(k === "neuf" ? "quoiNeuf" : "lienAide"); if (b) b.click(); return; }
    if (k === "compte"){ if (window.ACCES) ACCES.dlgConnexion(); return; }
    if (k === "signal"){ if (window.mpSignaler) mpSignaler(); return; }
    aller(k); }
  const q = new URLSearchParams(location.search).get("ouvrir");
  if (q && /^(neuf|aide|compte|signal)$/.test(q)){ history.replaceState(null, "", location.pathname); document.documentElement.classList.remove("ouvre"); const go = () => actionPied(q); if (window.ACCES && ACCES.pret) ACCES.pret.then(() => setTimeout(go, 300)); else window.addEventListener("load", go); }
  if (q && BTN[q]){ history.replaceState(null, "", location.pathname); const go = () => { aller(q); setTimeout(() => document.documentElement.classList.remove("ouvre"), 350); };
    if (window.ACCES && ACCES.pret) ACCES.pret.then(go); else window.addEventListener("load", go); }
})();
