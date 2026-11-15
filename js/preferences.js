/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — preferences.js (sorti d'index.html le 15 nov.) */
/* ---- Mes préférences (une par compte, gardées sur cet ordinateur : localStorage "prefs:<identifiant>") ---- */
(function(){
  const cle = () => { const S = window.ACCES && ACCES.session; return "prefs:" + (S ? S.id : "invite"); };
  const lirePrefs = () => { try { return JSON.parse(localStorage.getItem(cle()) || "{}"); } catch(e){ return {}; } };
  window.PREF = lirePrefs;
  const COULEURS = [["#EB6A22","Métier+"],["#d6232a","Rouge"],["#2a7bcf","Bleu"],["#1f9d6b","Vert"],["#7c4dff","Violet"],["#d63384","Rose"],["#5b6470","Gris"]];
  const CRAYONS = [["#e2483d","Rouge"],["#2a7bcf","Bleu"],["#2f9e4f","Vert"],["#24282c","Noir"]];   /* 9 nov. : les mêmes que la bulle du crayon */
  const FONDS = [["blanc","Blanc"],["quad","Quadrillé"],["iso","Iso"],["noir","Noir"],["vert","Vert"]];
  const PROG = [["","Tous"],["Entretien général d'immeubles","EGI"],["Plomberie et chauffage","Plomberie"]];
  window.titreAccueil = () => { const S = window.ACCES && ACCES.session; if (!S || lirePrefs().bonjour === false) return "";
    return S.eleve ? "Bonjour, " + S.nom + " !" : "Bonjour " + S.nom.split(/\s+/)[0] + " !"; };
  let dejaProg = "";
  window.appliquerPrefs = () => {
    const P = lirePrefs(), r = document.documentElement;
    if (P.couleur){ r.style.setProperty("--moi", P.couleur); r.style.setProperty("--accent", P.couleur); } else { r.style.removeProperty("--moi"); r.style.removeProperty("--accent"); }
    try { if (window.teinterLogo) window.teinterLogo(P.couleur || ""); } catch(e){}   /* le A du logo suit ma couleur */
    if (P.theme === "auto"){ if (window.themeAuto && !window.themeEstAuto()) window.themeAuto(); }
    else if (P.theme === "clair" || P.theme === "fonce"){ const c = P.theme === "clair"; if (document.body.classList.contains("clair") !== c){ const b = document.getElementById("themeBtn"); if (b) b.click(); } }
    const S = window.ACCES && ACCES.session;
    if (S && P.prog !== undefined && dejaProg !== S.id + "|" + P.prog){ dejaProg = S.id + "|" + P.prog;   /* le programme au départ, une fois par connexion */
      try { filtreProg = P.prog; ecrireLS("filtreProg", P.prog); } catch(e){} }
    try { render(); renderHero(); } catch(e){}
  };
  const ecrire = (k, v) => { const P = lirePrefs(); if (v === null) delete P[k]; else P[k] = v; try { localStorage.setItem(cle(), JSON.stringify(P)); } catch(e){} dejaProg = ""; window.appliquerPrefs(); dessiner(); };
  const esc2 = t => String(t).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" })[c]);
  const seg = (k, opts, cur) => '<div class="seg">' + opts.map(([v, n]) => '<button type="button" data-k="' + k + '" data-v="' + esc2(v) + '"' + (cur === v ? ' class="on"' : '') + '>' + n + '</button>').join("") + '</div>';
  const ronds = (k, opts, cur) => '<div class="seg ronds">' + opts.map(([v, n]) => '<button type="button" class="rond' + (cur === v ? ' on' : '') + '" style="background:' + v + '" title="' + n + '" aria-label="' + n + '" data-k="' + k + '" data-v="' + v + '"></button>').join("") + '</div>';
  function dessiner(){
    const B = document.getElementById("accesBox"), ov = document.getElementById("accesOv"); if (ov.hidden || !B.querySelector(".prefs")) return; contenu(B);
  }
  function contenu(B){
    const P = lirePrefs(), S = ACCES.session || { nom:"Invité", id:"" }, ini = S.nom.split(/\s+/).map(m => m[0] || "").join("").slice(0, 2).toUpperCase();
    const theme = P.theme || (window.themeEstAuto && window.themeEstAuto() ? "auto" : document.body.classList.contains("clair") ? "clair" : "fonce");
    B.innerHTML = '<div class="prefs"><h2>Mes préférences</h2><div class="ap"><span class="ini">' + ini + '</span><div><b>' + esc2(S.nom) + '</b><br><small style="color:#8c8c92">Tes préférences suivent ton compte d\'un appareil à l\'autre.</small></div></div>'
      + '<h3>Apparence</h3>'
      + '<div class="lig"><span>Ma couleur</span>' + ronds("couleur", COULEURS, P.couleur || "#EB6A22") + '</div>'
      + '<div class="lig"><span>Accueil<small>Auto : comme ton ordinateur</small></span>' + seg("theme", [["auto","Auto"],["fonce","Foncé"],["clair","Clair"]], theme) + '</div>'
      + '<div class="lig"><span>« Bonjour ' + esc2(S.nom.split(/\s+/)[0]) + ' » en haut</span>' + seg("bonjour", [["oui","Oui"],["non","Non"]], P.bonjour === false ? "non" : "oui") + '</div>'
      + '<div class="lig"><span>Animations<small>Légères : pour un tableau lent</small></span>' + seg("leger", [["auto","Automatique"],["non","Complètes"],["oui","Légères"]], window.modeLegerChoix ? window.modeLegerChoix() : "auto") + '</div>'
      + '<h3>Bibliothèque</h3>'
      + '<div class="lig"><span>Livres affichés au départ</span>' + seg("prog", PROG, P.prog === undefined ? "" : P.prog) + '</div>'
      + '<div class="lig"><span>Livre en plein écran</span>' + seg("plein", [["oui","Oui"],["non","Non"]], P.plein === false ? "non" : "oui") + '</div>'
      + '<div class="lig"><span>Barres du livre</span>' + seg("barres", [["auto","Automatiques"],["fixes","Toujours là"]], localStorage.barresFixes === "1" ? "fixes" : "auto") + '</div>'
      + '<div class="lig"><span>Reprendre où j\'étais</span>' + seg("reprise", [["demander","Demander"],["toujours","Toujours"],["jamais","Jamais"]], P.reprise || "demander") + '</div>'
      + (ACCES.eleve ? '' : '<h3>Tableau blanc</h3>'
      + '<div class="lig"><span>Fond au départ</span>' + seg("fond", FONDS, P.fond || "blanc") + '</div>'
      + '<div class="lig"><span>Couleur du crayon</span>' + ronds("crayon", CRAYONS, P.crayon || "#e2483d") + '</div>')
      + '<div class="acces-btns" style="justify-content:space-between;align-items:center;margin-top:16px"><button type="button" class="raz" id="pRaz">Remettre comme au départ</button><button class="prim" id="pFin">Terminé</button></div></div>';
    B.querySelectorAll("[data-k]").forEach(b => b.onclick = () => { const k = b.dataset.k, v = b.dataset.v;
      if (k === "leger"){ if (window.modeLegerFixer) window.modeLegerFixer(v); contenu(B); return; }
      if (k === "barres"){ if ((localStorage.barresFixes === "1") !== (v === "fixes")) document.getElementById("tbPin").click(); contenu(B); return; }   /* l'ancien bouton « Barres automatiques » de Plus d'outils, maintenant caché */
      ecrire(k, k === "bonjour" || k === "plein" ? (v === "oui" ? null : false) : v); });
    B.querySelector("#pFin").onclick = () => { document.getElementById("accesOv").hidden = true; };
    B.querySelector("#pRaz").onclick = () => { try { localStorage.removeItem(cle()); } catch(e){} dejaProg = ""; window.appliquerPrefs(); dessiner(); };
  }
  window.dlgPrefs = () => { const ov = document.getElementById("accesOv"), B = document.getElementById("accesBox"); B.classList.remove("large", "gestion", "co2"); ov.hidden = false; contenu(B); };
  if (window.ACCES && ACCES.pret) ACCES.pret.then(() => window.appliquerPrefs()).catch(() => {});
  /* filet de sécurité : si un de ces boutons est touché sans être connecté, on ouvre la connexion, puis l'outil */
  document.addEventListener("click", e => { const b = e.target.closest && e.target.closest('#planBtn, #actBtn, #simBtn, #accueilBtn, #wbBtn'); if (!b || (window.ACCES && ACCES.session)) return;
    e.preventDefault(); e.stopImmediatePropagation(); if (window.ACCES) ACCES.dlgConnexion(() => b.click()); }, true);
})();
