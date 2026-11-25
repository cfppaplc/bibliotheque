/* © 2026 Jérémy Raymond. Tous droits réservés.
   Administration complète (25 nov., Jeremy : « un vrai panneau d'admin, complet et simple à utiliser ») :
   Tableau de bord · Quoi de neuf (éditeur) · Classe et atelier (raccourcis) · Fluidité (journaux Supabase) · Automatisations (GitHub).
   Branché dans js/acces.js (onglets gPlus_<clé>) et s'appuie sur window.ACCES_ADMIN, ADMIN_SITE et COFFRE. */
window.ADMIN_PLUS = (function(){
  const DEPOT = "cfppaplc/bibliotheque", GH = "https://api.github.com/repos/" + DEPOT;
  const SUPA = "https://kjlotlhqrgekzohshmbn.supabase.co", CLE = "sb_publishable_1C-o-75sf7havBRmUWA8aQ_gcEW4sRY";
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
  const A = () => window.ACCES_ADMIN || {};
  const ilYa = d => { const m = Math.round((Date.now() - new Date(d)) / 60000); return m < 1 ? "à l'instant" : m < 60 ? "il y a " + m + " min" : m < 1440 ? "il y a " + Math.round(m / 60) + " h" : "il y a " + Math.round(m / 1440) + " j"; };
  const dateH = d => { const x = new Date(d); return x.toLocaleDateString("fr-CA", { day:"numeric", month:"short" }) + " " + x.getHours() + " h " + String(x.getMinutes()).padStart(2, "0"); };
  const delai = (p, ms) => Promise.race([p, new Promise((_, n) => setTimeout(() => n(new Error("délai")), ms || 9000))]);
  const ligne = (etat, lab, val, id) => '<div class="as-l ' + (etat === true ? "ok" : etat === false ? "ko" : "neutre") + '"' + (id ? ' id="' + id + '"' : '') + '><i></i><span>' + lab + '</span><b>' + val + '</b></div>';

  /* ---------- GitHub (dépôt public : lecture sans clé) ---------- */
  const WF = [
    { f:"test-pages.yml", nom:"Test des pages et des fonctions", quand:"à chaque publication", txt:"Ouvre les pages principales (ordinateur et cellulaire) et vérifie les fonctions importantes." },
    { f:"surveillance.yml", nom:"Surveillance du site", quand:"toutes les 30 min", txt:"Vérifie que le site et Supabase répondent; avis « Panne Metier+ » dans les signalements." },
    { f:"sauvegarde-supabase.yml", nom:"Sauvegarde de Supabase", quand:"dimanche, 2 h 41", txt:"Copie chiffrée de toutes les données (coffres, statistiques, journaux), gardée 90 jours." },
    { f:"reveil-supabase.yml", nom:"Réveil de Supabase", quand:"aux 3 jours", txt:"Empêche Supabase (gratuit) de se mettre en pause." }
  ];
  let CACHE_WF = null, CACHE_T = 0;
  async function etatWorkflows(force){
    if (CACHE_WF && !force && Date.now() - CACHE_T < 120000) return CACHE_WF;
    const R = {};
    await Promise.all(WF.map(w => delai(fetch(GH + "/actions/workflows/" + w.f + "/runs?per_page=1", { cache:"no-store" }).then(r => r.ok ? r.json() : null))
      .then(j => { const r = j && j.workflow_runs && j.workflow_runs[0]; R[w.f] = r ? { st:r.status, ok:r.conclusion === "success", fini:r.status === "completed", t:r.updated_at || r.created_at, url:r.html_url, conc:r.conclusion } : null; })
      .catch(() => R[w.f] = null)));
    CACHE_WF = R; CACHE_T = Date.now(); return R;
  }
  const etatTxt = r => !r ? [null, "inconnu"] : !r.fini ? [null, "en cours"] : r.ok ? [true, "réussi · " + ilYa(r.t)] : [false, "échec · " + ilYa(r.t)];
  async function lancer(f){
    const j = A().jeton && A().jeton(); if (!j) throw new Error("Cet appareil n'a pas la clé GitHub.");
    const r = await fetch(GH + "/actions/workflows/" + f + "/dispatches", { method:"POST", headers:{ Authorization:"Bearer " + j, Accept:"application/vnd.github+json", "Content-Type":"application/json" }, body:JSON.stringify({ ref:"main" }) });
    if (r.status === 403 || r.status === 404) throw new Error("La clé GitHub de cet appareil n'a pas la permission « Actions » : utilise « Voir sur GitHub » puis « Run workflow ».");
    if (!r.ok) throw new Error("GitHub a répondu " + r.status);
  }

  /* ---------- Journaux de fluidité (Supabase, 30 jours) ---------- */
  async function journaux(h){
    const r = await delai(fetch(SUPA + "/rest/v1/rpc/journal_lire?p_heures=" + h, { headers:{ apikey:CLE }, cache:"no-store" }), 12000);
    if (!r.ok) throw new Error("Supabase a répondu " + r.status); return r.json();
  }
  const appareilDe = t => (String(t).match(/Journal fluidite (\S+)/) || [, "?"])[1];
  const pireDe = x => Math.max(0, ...[...String(x).matchAll(/pire (\d+) ms/g)].map(m => +m[1]));
  const accrDe = x => +((String(x).match(/: (\d+) accrochages/) || [, 0])[1]);

  /* ---------- Tableau de bord ---------- */
  async function accueil(z){
    const nDem = A().demandes ? A().demandes() : 0, aPub = A().aPublier && A().aPublier();
    let sig = 0; try { sig = ADMIN_SITE.lire().L.filter(x => !x.ok).length; } catch(e){}
    const faire = [];
    if (nDem) faire.push(['profs', nDem + " demande" + (nDem > 1 ? "s" : "") + " d'accès à traiter", "Comptes et accès"]);
    if (sig) faire.push(['site', sig + " signalement" + (sig > 1 ? "s" : "") + " à régler", "Signalements et état"]);
    if (aPub) faire.push(['', "Des changements attendent d'être publiés", "bouton « Publier » en bas"]);
    z.innerHTML = '<div class="ap-tete"><h3>Bonjour Jérémy</h3><p class="sous">Tout Métier+ en un coup d\'œil. Touche une ligne pour y aller.</p></div>'
      + '<div class="as-grille ap-g3">'
      + '<div class="as-carte"><h3>À faire</h3><div id="apFaire">' + (faire.length ? faire.map(f => '<button class="ap-faire" data-go="' + f[0] + '"><b>' + esc(f[1]) + '</b><small>' + esc(f[2]) + '</small></button>').join("") : '<p class="sous ap-rien">Rien à faire pour l\'instant.</p>') + '</div></div>'
      + '<div class="as-carte"><h3>Santé du site</h3><div id="apSante">' + ligne(null, "Version en ligne", "…", "apVer") + ligne(null, "Supabase", "…", "apSupa") + ligne(null, "Tests après publication", "…", "apTest") + ligne(null, "Surveillance", "…", "apSurv") + ligne(null, "Dernière sauvegarde", "…", "apSauv") + '</div>'
      + '<button class="abtn" data-go="auto">Automatisations</button></div>'
      + '<div class="as-carte"><h3>Fluidité (24 h)</h3><div id="apFlu"><p class="sous">Chargement…</p></div><button class="abtn" data-go="journaux">Voir les journaux</button></div>'
      + '</div><div class="as-grille">'
      + '<div class="as-carte"><h3>Les plus utilisés ce mois-ci</h3><div id="apUtil"><p class="sous">Chargement…</p></div><div class="ap-btns"><button class="abtn" data-go="stats">Toutes les statistiques</button><button class="abtn" id="apRap">Rapport à imprimer (direction)</button></div></div>'
      + '<div class="as-carte"><h3>Raccourcis</h3><div class="ap-rac">'
      + [["nouv", "Ajouter une nouveauté", "Quoi de neuf"], ["livres", "Cacher, mettre en vedette, « Nouveau »", "Livres"], ["profs", "Donner des livres, inviter un enseignant", "Comptes et accès"], ["classe", "Ménage, formations, coffres, horaires", "Classe et atelier"]]
          .map(r => '<button class="as-lien" data-go="' + r[0] + '">' + esc(r[1]) + '<small>' + esc(r[2]) + '</small></button>').join("")
      + '</div></div></div>';
    z.querySelector("#apRap").onclick = () => rapport().catch(e => alert("Rapport impossible : " + e.message));
    z.querySelectorAll("[data-go]").forEach(b => b.onclick = () => { if (b.dataset.go) A().aller(b.dataset.go); else { const p = document.getElementById("gPub"); if (p) p.scrollIntoView({ block:"center" }); } });
    const pose = (id, e, txt) => { const el = z.querySelector("#" + id); if (!el) return; el.className = "as-l " + (e === true ? "ok" : e === false ? "ko" : "neutre"); el.querySelector("b").textContent = txt; };
    try { const R = await ADMIN_SITE.verifs(); pose("apVer", R.version.ok, R.version.txt); pose("apSupa", R.supa.ok, R.supa.txt); } catch(e){}
    etatWorkflows().then(W => { const t = W["test-pages.yml"], s = W["surveillance.yml"], b = W["sauvegarde-supabase.yml"];
      pose("apTest", ...etatTxt(t)); pose("apSurv", ...etatTxt(s)); pose("apSauv", ...etatTxt(b));
      if (t && t.fini && !t.ok) { const f = z.querySelector("#apFaire"); const r = f.querySelector(".ap-rien"); if (r) r.remove();
        f.insertAdjacentHTML("afterbegin", '<button class="ap-faire ko" data-go2="auto"><b>Un test a échoué après la dernière publication</b><small>Automatisations</small></button>'); f.querySelector("[data-go2]").onclick = () => A().aller("auto"); } });
    journaux(24).then(L => { const el = z.querySelector("#apFlu"); if (!el) return; const v = L.filter(x => /fluidite/.test(x.titre) && !/essai/.test(x.titre));
      if (!v.length) { el.innerHTML = '<p class="sous">Aucun rapport : tout a été fluide, ou personne n\'a utilisé Métier+.</p>'; return; }
      const par = {}; v.forEach(x => { const a = appareilDe(x.titre); par[a] = par[a] || { n:0, acc:0, pire:0 }; par[a].n++; par[a].acc += accrDe(x.texte); par[a].pire = Math.max(par[a].pire, pireDe(x.texte)); });
      el.innerHTML = Object.entries(par).map(([a, p]) => ligne(p.pire < 300, esc(a.charAt(0).toUpperCase() + a.slice(1)), p.acc + " accrochage" + (p.acc > 1 ? "s" : "") + " · pire " + p.pire + " ms")).join(""); })
      .catch(() => { const el = z.querySelector("#apFlu"); if (el) el.innerHTML = '<p class="sous">Journaux non disponibles.</p>'; });
    (async () => { const el = z.querySelector("#apUtil"); try {
      const S = (A().stats && A().stats()) || await COFFRE.statsLire(), mois = new Date().toISOString().slice(0, 7);
      const top = (S || []).filter(r => r.mois === mois && !/^test:/.test(r.cle)).sort((a, b) => b.n - a.n).slice(0, 6);
      const nom = c => { const [k, v] = c.split(":"); const l = (window.LIVRES || (typeof LIVRES !== "undefined" ? LIVRES : [])).find(x => x.fichier === v); return (l ? l.titre : v.replace(/[-_]/g, " ")) + ({ livre:"", quiz:" (quiz)", outil:" (outil)" }[k] || ""); };
      el.innerHTML = top.length ? top.map(r => '<div class="as-l neutre"><i></i><span>' + esc(nom(r.cle)) + '</span><b>' + r.n + '</b></div>').join("") : '<p class="sous">Pas encore de données ce mois-ci.</p>';
    } catch(e){ el.innerHTML = '<p class="sous">Statistiques non disponibles.</p>'; } })();
  }

  /* ---------- Automatisations ---------- */
  async function auto(z){
    z.innerHTML = '<div class="ap-tete"><h3>Automatisations</h3><p class="sous">Ce qui tourne tout seul. Les tâches GitHub ne coûtent aucun crédit Claude.</p></div>'
      + '<div class="as-carte"><h3>Sur GitHub</h3><div id="apWf"><p class="sous">Chargement…</p></div><p class="acces-err" id="apWfErr" hidden></p></div>'
      + '<div class="as-carte"><h3>Avec Claude</h3>'
      + '<div class="ap-wf"><div><b>Correction de la fluidité</b><small>jours de semaine, 16 h 20</small><p class="sous">Lit les journaux et les erreurs du jour, corrige ce qui est clair, teste, publie et t\'envoie un résumé.</p></div></div>'
      + '<div class="ap-wf"><div><b>Ménage des notes</b><small>le 1er du mois, 18 h 37</small><p class="sous">Range l\'historique de travail dans une archive et en fait un résumé (moins de crédits par session).</p></div></div>'
      + '<p class="sous" style="margin-top:10px">Pour changer l\'heure ou arrêter une de ces tâches, demande-le à Claude.</p></div>'
      + '<div class="as-carte"><h3>Copies de sauvegarde</h3><div id="apSv"><p class="sous">Chargement…</p></div>'
      + '<p class="sous" style="margin-top:10px">Chiffrées avec ton mot de passe de sauvegarde. Pour récupérer des données, demande-le à Claude.</p></div>';
    const W = await etatWorkflows(true), zw = z.querySelector("#apWf");
    zw.innerHTML = WF.map(w => { const r = W[w.f], [e, t] = etatTxt(r);
      return '<div class="ap-wf"><div><b>' + esc(w.nom) + '</b><small>' + esc(w.quand) + '</small><p class="sous">' + esc(w.txt) + '</p></div><div class="ap-wf-d">' + ligne(e, "Dernière fois", esc(t))
        + '<div class="ap-btns"><a class="abtn" target="_blank" rel="noopener" href="https://github.com/' + DEPOT + '/actions/workflows/' + w.f + '">Voir sur GitHub</a>'
        + (w.f === "test-pages.yml" ? "" : '<button class="abtn" data-lance="' + w.f + '">Lancer maintenant</button>') + '</div></div></div>'; }).join("");
    zw.querySelectorAll("[data-lance]").forEach(b => b.onclick = async () => { const er = z.querySelector("#apWfErr"); er.hidden = true; b.disabled = true; b.textContent = "Lancé…";
      try { await lancer(b.dataset.lance); setTimeout(() => auto(z), 15000); } catch(e){ er.textContent = e.message; er.hidden = false; b.disabled = false; b.textContent = "Lancer maintenant"; } });
    try { const j = await delai(fetch(GH + "/actions/artifacts?per_page=20", { cache:"no-store" }).then(r => r.json()));
      const L = (j.artifacts || []).filter(a => /^sauvegarde-/.test(a.name)).slice(0, 8), zs = z.querySelector("#apSv");
      zs.innerHTML = L.length ? L.map(a => ligne(!a.expired, dateH(a.created_at), a.expired ? "expirée" : Math.round(a.size_in_bytes / 1024) + " Ko · " + "garde jusqu'au " + new Date(a.expires_at).toLocaleDateString("fr-CA", { day:"numeric", month:"short" }))).join("")
        : '<p class="sous">Aucune copie pour l\'instant.</p>';
    } catch(e){ z.querySelector("#apSv").innerHTML = '<p class="sous">GitHub ne répond pas.</p>'; }
  }

  /* ---------- Fluidité ---------- */
  let J_H = 24, J_APP = "tous";
  async function fluidite(z){
    z.innerHTML = '<div class="ap-tete"><h3>Fluidité</h3><p class="sous">Rapports des appareils des enseignants connectés (accrochages de plus de 80 ms), gardés 30 jours. Aucun nom.</p></div>'
      + '<div class="acces-per">' + [[24, "24 h"], [72, "3 jours"], [168, "7 jours"]].map(([h, l]) => '<button class="abtn' + (J_H === h ? ' prim' : '') + '" data-h="' + h + '">' + l + '</button>').join("") + '</div><div id="apJ"><p class="sous">Chargement…</p></div>';
    z.querySelectorAll("[data-h]").forEach(b => b.onclick = () => { J_H = +b.dataset.h; fluidite(z); });
    const zj = z.querySelector("#apJ");
    let L; try { L = (await journaux(J_H)).filter(x => !/essai/.test(x.titre)); } catch(e){ zj.innerHTML = '<p class="acces-err">' + esc(e.message) + '</p>'; return; }
    if (!L.length) { zj.innerHTML = '<p class="sous">Aucun rapport pour cette période.</p>'; return; }
    const apps = [...new Set(L.map(x => appareilDe(x.titre)))].sort();
    const V = J_APP === "tous" ? L : L.filter(x => appareilDe(x.titre) === J_APP);
    const pages = {}; V.forEach(x => String(x.texte).split("\n").forEach(l => { const m = l.match(/^- (.+?) : (\d+) fois, pire (\d+) ms/); if (!m) return; const k = m[1].replace(/ · (geste|doigt|2 doigts)$/, ""); pages[k] = pages[k] || { n:0, pire:0 }; pages[k].n += +m[2]; pages[k].pire = Math.max(pages[k].pire, +m[3]); }));
    zj.innerHTML = '<div class="acces-per">' + ["tous", ...apps].map(a => '<button class="abtn' + (J_APP === a ? ' prim' : '') + '" data-app="' + esc(a) + '">' + esc(a === "tous" ? "Tous les appareils" : a) + '</button>').join("") + '</div>'
      + '<div class="as-grille"><div class="as-carte"><h3>Où ça accroche</h3>' + (Object.keys(pages).length ? Object.entries(pages).sort((a, b) => b[1].n - a[1].n).slice(0, 12).map(([k, p]) => ligne(p.pire < 300, esc(k), p.n + " fois · pire " + p.pire + " ms")).join("") : '<p class="sous">Rien.</p>') + '</div>'
      + '<div class="as-carte"><h3>Résumé</h3>' + ligne(null, "Rapports", V.length) + ligne(null, "Accrochages", V.reduce((s, x) => s + accrDe(x.texte), 0)) + ligne(V.every(x => pireDe(x.texte) < 300), "Pire pause", Math.max(0, ...V.map(x => pireDe(x.texte))) + " ms")
      + '<p class="sous" style="margin-top:10px">La tâche de 16 h 20 lit ces rapports et corrige ce qui est clair.</p></div></div>'
      + '<div class="as-carte"><h3>Rapports</h3>' + V.slice(0, 60).map(x => '<details class="ap-rap"><summary><b>' + esc(appareilDe(x.titre)) + '</b><span>' + dateH(x.t) + '</span><em>' + accrDe(x.texte) + ' accrochages · pire ' + pireDe(x.texte) + ' ms</em></summary><pre>' + esc(x.texte) + '</pre></details>').join("") + '</div>';
    zj.querySelectorAll("[data-app]").forEach(b => b.onclick = () => { J_APP = b.dataset.app; fluidite(z); });
  }

  /* ---------- Groupes et élèves (25 nov.) : la gestion des groupes, élèves, codes et collants se fait seulement ici ---------- */
  function groupes(z){ ouvrirIci(z, "outils-atelier.html?gestion=1", "Groupes et élèves", z2 => classe(z2), "Classe et atelier"); }
  /* ---------- Classe et atelier ---------- */
  function classe(z){
    /* 25 nov. (Jeremy : « ça ne devrait pas s'ouvrir dans un nouveau lien ») : l'outil s'ouvre dans le panneau, dans un cadre à la hauteur de la page (pas de 2e défilement) */
    const L = (h, t, s) => '<button class="as-lien" data-ouvre="' + h + '" data-t="' + esc(t) + '">' + esc(t) + '<small>' + esc(s) + '</small></button>';
    z.innerHTML = '<div class="ap-tete"><h3>Classe et atelier</h3><p class="sous">Les réglages de chaque outil, ouverts ici même.</p></div><div class="as-grille ap-g3">'
      + '<div class="as-carte"><h3>Atelier</h3>' + L("outils-atelier.html?gestion=1", "Gestion d'atelier", "Groupes, élèves, équipes, locaux") + L("passeport.html?formations=1&gestion=1", "Formations du registre", "Outils et machines à signer") + L("coffres.html?gestion=1", "Inventaire des coffres", "Coffres, codes QR, listes") + '</div>'
      + '<div class="as-carte"><h3>Classe</h3>' + L("accueil.html?menage=1", "Locaux et tâches du ménage", "Accueil de classe") + L("horaire.html", "Horaires des groupes", "Planification") + '</div>'
      + '<div class="as-carte"><h3>Labo</h3>' + L("labo.html", "Labo interactif", "Simulateurs et Défi+") + L("quiz.html", "Mes Défi+", "Créer et lancer un Défi+") + '</div>'
      + '<div class="as-carte"><h3>Vérification</h3>' + L("magasin.html?mode=magasin", "Comptoir du magasin", "Écran du magasinier") + L("tests.html", "Pages d'essai", "Navigateur, vitesse, toucher, son, écran") + L("confidentialite.html", "Confidentialité (Loi 25)", "Ce que le site recueille") + '</div>'
      + '</div>';
    z.querySelectorAll("[data-ouvre]").forEach(b => b.onclick = () => ouvrirIci(z, b.dataset.ouvre, b.dataset.t));
  }
  function ouvrirIci(z, url, titre, retour, nomRetour){
    z.innerHTML = '<div class="ap-cadre-t"><button class="abtn" id="apRet">‹ ' + esc(nomRetour || "Classe et atelier") + '</button><b>' + esc(titre) + '</b></div><iframe class="ap-cadre" title="' + esc(titre) + '" src="' + esc(url) + '"></iframe>';
    z.querySelector("#apRet").onclick = () => (retour || classe)(z);
    const f = z.querySelector("iframe"), haut = () => Math.max(520, innerHeight - 190);
    f.style.height = haut() + "px";
    f.onload = () => { let d; try { d = f.contentDocument; } catch(e){ return; } if (!d) return;
      const st = d.createElement("style"); st.textContent = ".mp-tete,.mp-pied,footer.mp-pied{display:none!important}body{min-height:0!important}"; d.head.appendChild(st);
      const ajuste = () => { try { const h = Math.max(d.documentElement.scrollHeight, d.body ? d.body.scrollHeight : 0); const cur = f.getBoundingClientRect().height; if (h > cur + 8) f.style.height = (h + 4) + "px"; } catch(e){} };   /* une page à hauteur d'écran (accueil) ne grandit pas sans fin */
      ajuste(); try { new f.contentWindow.ResizeObserver(ajuste).observe(d.body); } catch(e){ setInterval(ajuste, 1000); } };
  }


  /* ---------- Magasin de raccords (25 nov.) ---------- */
  let MG = null, MG_TXT = "", MG_Q = "", MG_MSG = "";
  async function chargerMg(){ const t = await (await fetch("magasin-catalogue.json?t=" + Date.now(), { cache:"no-store" })).text(); MG = JSON.parse(t); MG_TXT = JSON.stringify(MG); }
  const mgChange = () => MG && JSON.stringify(MG) !== MG_TXT;
  async function magasin(z){
    if (!MG) { try { await chargerMg(); } catch(e){ z.innerHTML = '<p class="acces-err">Catalogue illisible.</p>'; return; } }
    const base = location.origin + location.pathname.replace(/[^/]*$/, ""), lienE = base + "magasin.html", lienM = base + "magasin.html?mode=magasin";
    const qr = u => { if (!window.QRLib) return ""; const M = QRLib.matrice(u), k = M.length; return '<svg viewBox="0 0 ' + (k + 8) + ' ' + (k + 8) + '" width="150" height="150"><rect width="' + (k + 8) + '" height="' + (k + 8) + '" fill="#fff"/>' + M.map((r, y) => r.map((v, x) => v ? '<rect x="' + (x + 4) + '" y="' + (y + 4) + '" width="1.02" height="1.02"/>' : "").join("")).join("") + '</svg>'; };
    const mots = MG_Q.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").split(/\s+/).filter(Boolean);
    const R = MG.raccords.map((a, i) => [a, i]).filter(([a]) => mots.every(m => (a.nom + " " + a.n + " " + a.mat + " " + a.type + " " + a.d).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").includes(m)));
    z.innerHTML = '<div class="ap-tete"><h3>Magasin de raccords</h3><p class="sous">L\'élève scanne sa carte, remplit son panier, son enseignant l\'approuve sur son cellulaire, le magasinier le prépare.</p></div>'
      + '<div class="as-grille ap-g3">'
      + '<div class="as-carte"><h3>Page des élèves</h3><p class="sous">À ouvrir sur le cellulaire des élèves, ou ce code QR affiché à l\'atelier.</p><div class="ap-qr">' + qr(lienE) + '</div><div class="ap-btns"><a class="abtn" href="magasin.html" target="_blank" rel="noopener">Ouvrir</a><button class="abtn" data-copie="' + esc(lienE) + '">Copier le lien</button></div></div>'
      + '<div class="as-carte"><h3>Comptoir du magasinier</h3><p class="sous">Sur l\'ordinateur du magasinier, laissé ouvert toute la journée. Le lecteur de codes-barres lit la carte de l\'élève.</p><div class="ap-btns"><a class="abtn prim" href="magasin.html?mode=magasin" target="_blank" rel="noopener">Ouvrir le comptoir</a><button class="abtn" data-copie="' + esc(lienM) + '">Copier le lien</button></div></div>'
      + '<div class="as-carte"><h3>Approbation et dossiers</h3><button class="as-lien" data-ici="magasin.html?mode=prof" data-t="Commandes à approuver">Commandes à approuver<small>Approuver, refuser, avis sur ton cellulaire</small></button><button class="as-lien" data-ici="outils-atelier.html" data-t="Dossiers des élèves">Dossiers des élèves<small>Touche un élève : formations, coffre, commandes</small></button><button class="as-lien" data-ici="passeport.html" data-t="Collants pour la carte étudiante">Collants pour la carte étudiante<small>Choisis le groupe, puis « Codes des élèves »</small></button></div>'
      + '</div>'
      + '<div class="as-carte"><div class="as-th"><h3>Catalogue des raccords · ' + MG.raccords.length + '</h3></div>'
      + (MG.essai ? '<p class="acces-err" style="margin:0 0 8px">Liste d\'essai : remplace-la par la vraie liste du magasin (fichier CSV, un raccord par ligne).</p>' : '')
      + '<div class="ap-pub"><span class="acces-etat' + (mgChange() ? ' pub' : '') + '">' + (mgChange() ? 'Des changements attendent d\'être publiés' : 'Tout est publié') + '</span>' + (MG_MSG ? '<span class="acces-ok">' + esc(MG_MSG) + '</span>' : '') + '<span class="acces-err" id="mgErr" hidden></span>'
      + '<label class="abtn" for="mgCsv" style="margin:0;cursor:pointer">Remplacer par un fichier CSV</label><input type="file" id="mgCsv" accept=".csv,text/csv,.txt" hidden><button class="abtn" id="mgAj">+ Raccord</button><button class="abtn" id="mgAnn"' + (mgChange() ? '' : ' disabled') + '>Annuler</button><button class="abtn prim" id="mgPub"' + (mgChange() ? '' : ' disabled') + '>Publier le catalogue</button></div>'
      + '<p class="sous" style="font-size:.8rem">CSV : colonnes <b>numéro; nom; matériau; type; diamètre; rangée</b> (première ligne = titres). Dans Excel : Fichier → Enregistrer sous → CSV.</p>'
      + '<input type="text" id="mgQ" placeholder="Chercher dans le catalogue…" value="' + esc(MG_Q) + '" style="margin:6px 0 10px">'
      + '<div class="ap-mg"><div class="ap-mg-l ap-mg-t"><span>N° d\'article</span><span>Nom affiché à l\'élève</span><span>Matériau</span><span>Type</span><span>Diamètre</span><span>Rangée</span><span></span></div>'
      + R.slice(0, 200).map(([a, i]) => '<div class="ap-mg-l" data-i="' + i + '">' + ["n", "nom", "mat", "type", "d", "r"].map(k => '<input type="text" data-k="' + k + '" value="' + esc(a[k]) + '">').join("") + '<button class="abtn rouge" data-sup title="Retirer">×</button></div>').join("")
      + (R.length > 200 ? '<p class="sous">' + (R.length - 200) + ' autres : précise ta recherche.</p>' : '') + '</div></div>';
    const re = () => magasin(z), etat = () => { const c = mgChange(), e = z.querySelector(".ap-pub .acces-etat"); e.classList.toggle("pub", c); e.textContent = c ? "Des changements attendent d'être publiés" : "Tout est publié"; z.querySelector("#mgPub").disabled = !c; z.querySelector("#mgAnn").disabled = !c; };
    z.querySelectorAll("[data-copie]").forEach(b => b.onclick = () => { try { navigator.clipboard.writeText(b.dataset.copie); b.textContent = "Lien copié"; } catch(e){} });
    z.querySelectorAll("[data-ici]").forEach(b => b.onclick = () => ouvrirIci(z, b.dataset.ici, b.dataset.t, magasin, "Magasin"));
    z.querySelector("#mgQ").oninput = e => { MG_Q = e.target.value; const p = e.target.selectionStart; re(); const n = z.querySelector("#mgQ"); n.focus(); n.setSelectionRange(p, p); };
    z.querySelectorAll(".ap-mg-l[data-i] input").forEach(inp => inp.oninput = () => { const a = MG.raccords[+inp.closest("[data-i]").dataset.i]; a[inp.dataset.k] = inp.value; if (inp.dataset.k !== "n" && !a.nom) a.nom = ""; etat(); });
    z.querySelectorAll("[data-sup]").forEach(b => b.onclick = () => { const i = +b.closest("[data-i]").dataset.i; if (!confirm("Retirer « " + MG.raccords[i].nom + " » du catalogue ?")) return; MG.raccords.splice(i, 1); re(); });
    z.querySelector("#mgAj").onclick = () => { const id = "r" + Date.now().toString(36); MG.raccords.unshift({ id, n:"", nom:"Nouveau raccord", mat:"", type:"", d:"", r:"" }); MG_Q = ""; re(); };
    z.querySelector("#mgAnn").onclick = async () => { await chargerMg(); MG_MSG = ""; re(); };
    z.querySelector("#mgCsv").onchange = async e => { const f = e.target.files[0]; if (!f) return; const t = (await f.text()).replace(/^﻿/, ""), sep = (t.split("\n")[0].match(/;/g) || []).length >= (t.split("\n")[0].match(/,/g) || []).length ? ";" : ",";
      const L = t.split(/\r?\n/).filter(l => l.trim()).map(l => l.split(sep).map(x => x.trim().replace(/^"|"$/g, "")));
      const corps = /num|nom|n°|no\b/i.test(L[0].join(" ")) ? L.slice(1) : L;
      const N = corps.filter(c => c[1]).map((c, k) => ({ id:"r" + (k + 1).toString(36) + Date.now().toString(36).slice(-3), n:c[0] || "", nom:c[1], mat:c[2] || "", type:c[3] || "", d:c[4] || "", r:c[5] || "" }));
      if (!N.length) { const er = z.querySelector("#mgErr"); er.textContent = "Aucun raccord trouvé dans ce fichier."; er.hidden = false; return; }
      if (!confirm("Remplacer les " + MG.raccords.length + " raccords du catalogue par les " + N.length + " de ce fichier ?")) return;
      MG.raccords = N; delete MG.essai; delete MG.note; MG.maj = new Date().toLocaleDateString("en-CA"); MG_MSG = ""; re(); };
    z.querySelector("#mgPub").onclick = async () => { const b = z.querySelector("#mgPub"), er = z.querySelector("#mgErr"); er.hidden = true;
      if (MG.raccords.some(a => !String(a.nom || "").trim())) { er.textContent = "Chaque raccord doit avoir un nom."; er.hidden = false; return; }
      b.disabled = true; b.textContent = "Publication…";
      try { MG.maj = new Date().toLocaleDateString("en-CA"); const t = JSON.stringify(MG, null, 1) + "\n"; await A().publier({ "magasin-catalogue.json":t }, "Magasin : catalogue des raccords (Administration)"); MG_TXT = JSON.stringify(MG); MG_MSG = "Publié : en ligne d'ici une ou deux minutes."; re(); }
      catch(e){ er.textContent = e.message; er.hidden = false; b.disabled = false; b.textContent = "Publier le catalogue"; } };
  }

  /* ---------- Quoi de neuf ---------- */
  let NV = null, NV_SHA = "", NV_IMG = {}, NV_SEL = -1, NV_MSG = "";
  const TYPES = [["ajout", "Nouveau"], ["maj", "Amélioré"], ["outil", "Outil"]];
  async function chargerNv(){ const r = await fetch("nouveautes.json?t=" + Date.now(), { cache:"no-store" }); const t = await r.text(); NV = JSON.parse(t); NV_SHA = t; NV_IMG = {}; }
  const nvChange = () => JSON.stringify(NV, null, 1) !== JSON.stringify(JSON.parse(NV_SHA), null, 1) || Object.keys(NV_IMG).length;
  const slug = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "nouveaute";
  async function reduire(file){
    const im = await createImageBitmap(file), k = Math.min(1, 960 / im.width), c = document.createElement("canvas");
    c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
    const b = await new Promise(r => c.toBlob(r, "image/jpeg", .82)); return new Uint8Array(await b.arrayBuffer());
  }
  async function nouv(z){
    if (!NV) { try { await chargerNv(); } catch(e){ z.innerHTML = '<p class="acces-err">Impossible de lire nouveautes.json.</p>'; return; } }
    const tp = t => (TYPES.find(x => x[0] === t) || [, "Nouveau"])[1];
    const liste = NV.map((n, i) => '<button class="ap-nv' + (i === NV_SEL ? ' on' : '') + (n.cache ? ' est-cache' : '') + '" data-i="' + i + '"><span class="ap-nv-t">' + esc(n.titre || "(sans titre)") + '</span><small>' + esc(n.date || "") + ' · ' + tp(n.type) + (n.cache ? ' · caché' : '') + '</small></button>').join("");
    let edit = '<p class="sous">Choisis une nouveauté à gauche pour la modifier, ou ajoutes-en une.</p>';
    if (NV_SEL >= 0 && NV[NV_SEL]) { const n = NV[NV_SEL], et = (n.formation || []).map(f => typeof f === "string" ? f : f.t).join("\n"), img = (n.formation || []).find(f => f && f.img);
      edit = '<label>Titre</label><input type="text" id="nvT" value="' + esc(n.titre) + '" maxlength="120">'
        + '<div class="ap-2"><div><label>Date</label><input type="date" id="nvD" value="' + esc(n.date) + '"></div><div><label>Sorte</label><select id="nvY">' + TYPES.map(t => '<option value="' + t[0] + '"' + ((n.type || "ajout") === t[0] ? " selected" : "") + '>' + t[1] + '</option>').join("") + '</select></div></div>'
        + '<label>Texte (court : ce qui change pour l\'enseignant)</label><textarea id="nvX" class="ap-txt" maxlength="900">' + esc(n.texte) + '</textarea>'
        + '<label>Mini-formation : une étape par ligne (facultatif)</label><textarea id="nvF" class="ap-txt">' + esc(et) + '</textarea>'
        + '<label>Capture (JPEG, réduite à 960 px)</label><div class="ap-img">' + (img ? '<img src="' + esc(img.img) + '" alt="">' : '<span class="sous">Aucune</span>') + '<label class="abtn" for="nvI" style="margin:0;cursor:pointer">' + (img ? "Remplacer" : "Ajouter") + ' la capture</label><input type="file" id="nvI" accept="image/*" hidden></div>'
        + '<label class="as-cb"><input type="checkbox" id="nvC"' + (n.cache ? " checked" : "") + '> Cachée (gardée, mais pas montrée aux enseignants)</label>'
        + '<div class="ap-btns"><button class="abtn" id="nvHaut"' + (NV_SEL === 0 ? " disabled" : "") + '>Monter</button><button class="abtn" id="nvBas"' + (NV_SEL === NV.length - 1 ? " disabled" : "") + '>Descendre</button><button class="abtn rouge" id="nvSup">Retirer</button></div>'; }
    z.innerHTML = '<div class="ap-tete"><h3>Quoi de neuf</h3><p class="sous">Ce que les enseignants voient dans « Quoi de neuf ». Règle : une nouveauté par sujet; quand un sujet change, réécris-la au lieu d\'en ajouter une.</p></div>'
      + '<div class="ap-pub"><span class="acces-etat' + (nvChange() ? ' pub' : '') + '">' + (nvChange() ? 'Des changements attendent d\'être publiés' : 'Tout est publié') + '</span>'
      + (NV_MSG ? '<span class="acces-ok">' + esc(NV_MSG) + '</span>' : '') + '<span class="acces-err" id="nvErr" hidden></span>'
      + '<button class="abtn" id="nvAnn"' + (nvChange() ? '' : ' disabled') + '>Annuler les changements</button><button class="abtn prim" id="nvPub"' + (nvChange() ? '' : ' disabled') + '>Publier les nouveautés</button></div>'
      + '<div class="ap-nvg"><div class="as-carte ap-nvl"><button class="abtn prim" id="nvAj">+ Nouvelle</button>' + liste + '</div><div class="as-carte">' + edit + '</div></div>';
    const n = NV[NV_SEL], maj = (k, v) => { if (!n) return; if (v === "" || v === false) delete n[k]; else n[k] = v; };
    const re = () => nouv(z);
    z.querySelectorAll("[data-i]").forEach(b => b.onclick = () => { NV_SEL = +b.dataset.i; NV_MSG = ""; re(); });
    z.querySelector("#nvAj").onclick = () => { NV.unshift({ date:new Date().toLocaleDateString("en-CA"), type:"ajout", titre:"Nouvelle fonction", texte:"" }); NV_SEL = 0; NV_MSG = ""; re(); };
    if (n) {
      const lie = (id, k, f) => { const e = z.querySelector(id); e.oninput = e.onchange = () => { maj(k, f ? f(e) : e.value); const t = z.querySelector(".ap-nv.on .ap-nv-t"); if (k === "titre" && t) t.textContent = e.value; majPub(); }; };
      lie("#nvT", "titre"); lie("#nvD", "date"); lie("#nvY", "type"); lie("#nvX", "texte"); lie("#nvC", "cache", e => e.checked);
      z.querySelector("#nvF").onchange = e => { const vieux = n.formation || [], img = vieux.find(f => f && f.img), L = e.target.value.split("\n").map(s => s.trim()).filter(Boolean);
        const F = L.map((t, i) => { const o = vieux.find(f => typeof f === "object" && f.t === t); return o ? o : t; }); if (img && F.length && !F.some(f => f && f.img)) F[0] = Object.assign({}, typeof F[0] === "string" ? { t:F[0] } : F[0], { img:img.img });
        if (F.length) n.formation = F; else delete n.formation; majPub(); };
      z.querySelector("#nvI").onchange = async e => { const f = e.target.files[0]; if (!f) return; try {
        const b = await reduire(f), chemin = "nouveautes/" + slug(n.titre) + "-" + Date.now().toString(36) + ".jpg"; NV_IMG[chemin] = b;
        const F = (n.formation || []).map(x => typeof x === "string" ? { t:x } : Object.assign({}, x)); F.forEach(x => delete x.img); if (!F.length) F.push({ t:n.titre }); F[0].img = chemin; n.formation = F;
        re(); const im = z.querySelector(".ap-img img"); if (im) im.src = URL.createObjectURL(new Blob([b], { type:"image/jpeg" })); } catch(x){ alert("Image illisible."); } };
      z.querySelector("#nvHaut").onclick = () => { [NV[NV_SEL - 1], NV[NV_SEL]] = [NV[NV_SEL], NV[NV_SEL - 1]]; NV_SEL--; re(); };
      z.querySelector("#nvBas").onclick = () => { [NV[NV_SEL + 1], NV[NV_SEL]] = [NV[NV_SEL], NV[NV_SEL + 1]]; NV_SEL++; re(); };
      z.querySelector("#nvSup").onclick = () => { if (!confirm("Retirer « " + (n.titre || "") + " » de Quoi de neuf ? (Pour la garder sans la montrer, coche plutôt « Cachée ».)")) return; NV.splice(NV_SEL, 1); NV_SEL = -1; re(); };
    }
    function majPub(){ const c = nvChange(), e = z.querySelector(".ap-pub .acces-etat"); e.classList.toggle("pub", !!c); e.textContent = c ? "Des changements attendent d'être publiés" : "Tout est publié"; z.querySelector("#nvPub").disabled = !c; z.querySelector("#nvAnn").disabled = !c; }
    z.querySelector("#nvAnn").onclick = async () => { await chargerNv(); NV_SEL = -1; NV_MSG = ""; re(); };
    z.querySelector("#nvPub").onclick = async () => { const b = z.querySelector("#nvPub"), er = z.querySelector("#nvErr"); er.hidden = true;
      if (NV.some(x => !String(x.titre || "").trim() || !String(x.texte || "").trim())) { er.textContent = "Chaque nouveauté doit avoir un titre et un texte."; er.hidden = false; return; }
      b.disabled = true; b.textContent = "Publication…";
      try { const F = Object.assign({ "nouveautes.json":JSON.stringify(NV, null, 1) + "\n" }, NV_IMG); await A().publier(F, "Quoi de neuf (Administration)"); NV_SHA = F["nouveautes.json"]; NV_IMG = {}; NV_MSG = "Publié : en ligne d'ici une ou deux minutes."; re(); }
      catch(e){ er.textContent = e.message; er.hidden = false; b.disabled = false; b.textContent = "Publier les nouveautés"; } };
  }


  /* ---------- Message à tous + forcer la mise à jour ---------- */
  function diff(z){
    const R = A().regl ? A().regl() : null; if (!R) { z.innerHTML = '<p class="acces-err">Réglages non chargés.</p>'; return; }
    const a = R.annonce || {}, actif = !!(a.texte && (!a.jusqu || a.jusqu >= new Date().toLocaleDateString("en-CA")));
    const dans7 = new Date(Date.now() + 7 * 864e5).toLocaleDateString("en-CA");
    z.innerHTML = '<div class="ap-tete"><h3>Message et mise à jour</h3><p class="sous">Les deux partent en ligne avec le bouton « Publier » en bas.</p></div><div class="as-grille">'
      + '<div class="as-carte"><h3>Message à tous les enseignants</h3><p class="sous">Affiché en bas de l\'écran à l\'ouverture de Métier+ (pas sur les écrans projetés aux élèves), jusqu\'à ce que l\'enseignant touche « Compris » ou jusqu\'à la date choisie.</p>'
      + ligne(actif, "En ce moment", actif ? "affiché" + (a.jusqu ? " jusqu'au " + esc(a.jusqu) : "") : "aucun message")
      + '<label>Message</label><textarea id="anT" class="ap-txt" maxlength="400" placeholder="Ex. : Le livre C7 Évacuation est maintenant disponible.">' + esc(a.texte || "") + '</textarea>'
      + '<label>Affiché jusqu\'au</label><input type="date" id="anD" value="' + esc(a.jusqu || dans7) + '">'
      + '<div class="ap-btns"><button class="abtn prim" id="anOk">Préparer le message</button>' + (a.texte ? '<button class="abtn rouge" id="anNon">Retirer le message</button>' : '') + '</div></div>'
      + '<div class="as-carte"><h3>Forcer la mise à jour</h3><p class="sous">Tous les appareils (TNI, portables, cellulaires) oublient leur copie hors ligne et rechargent la dernière version à leur prochaine ouverture de Métier+. À utiliser si un appareil garde une vieille version.</p>'
      + ligne(null, "Dernière fois", R.forcer ? dateH(R.forcer) : "jamais")
      + '<div class="ap-btns"><button class="abtn prim" id="fmOk">Forcer la mise à jour</button></div></div></div>';
    z.querySelector("#anOk").onclick = () => { const t = z.querySelector("#anT").value.trim(); if (!t) return;
      R.annonce = { id:Date.now().toString(36), texte:t, jusqu:z.querySelector("#anD").value || dans7 }; A().redessiner({ ok:"Message prêt : touche « Publier » pour l'envoyer." }); };
    const non = z.querySelector("#anNon"); if (non) non.onclick = () => { delete R.annonce; A().redessiner({ ok:"Message retiré : touche « Publier »." }); };
    z.querySelector("#fmOk").onclick = () => { R.forcer = new Date().toISOString(); A().redessiner({ ok:"Mise à jour forcée prête : touche « Publier »." }); };
  }

  /* ---------- Voir comme un collègue ---------- */
  function voir(z){
    const C = (A().comptes ? A().comptes() : []).filter(c => !c.admin).sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
    z.innerHTML = '<div class="ap-tete"><h3>Voir comme un collègue</h3><p class="sous">La bibliothèque montre les livres ouverts et fermés de ce compte, pour l\'aider ou vérifier ses accès. Rien n\'est changé; un bandeau en haut te ramène à ton compte.</p></div>'
      + '<div class="as-carte">' + (C.length ? C.map(c => '<div class="ap-wf"><div><b>' + esc(c.nom) + '</b><small>' + esc(c.id) + (c.eleve ? ' · groupe d\'élèves' : '') + (c.prog.length ? ' · ' + esc(c.prog.map(p => /plomberie/i.test(p) ? "Plomberie" : /entretien/i.test(p) ? "EGI" : p).join(", ")) : '') + '</small></div><div class="ap-btns" style="margin:0;align-items:center;justify-content:flex-end"><button class="abtn" data-voir="' + esc(c.id) + '">Voir comme</button></div></div>').join("") : '<p class="sous">Aucun autre compte.</p>') + '</div>';
    z.querySelectorAll("[data-voir]").forEach(b => b.onclick = () => A().voirComme(b.dataset.voir));
  }

  /* ---------- Rapport imprimable ---------- */
  async function rapport(){
    const S = (A().stats && A().stats()) || await COFFRE.statsLire(), C = A().comptes ? A().comptes() : [];
    const mois = new Date().toISOString().slice(0, 7), an = new Date(Date.now() - 365 * 864e5).toISOString().slice(0, 7);
    const L = window.LIVRES || (typeof LIVRES !== "undefined" ? LIVRES : []), nom = c => { const [k, v] = c.split(":"); const l = L.find(x => x.fichier === v); return (l ? l.titre : v.replace(/[-_]/g, " ")) + ({ livre:"", quiz:" (Défi+)", outil:" (outil)" }[k] || ""); };
    const tot = per => { const o = {}; (S || []).filter(r => per(r.mois) && !/^test:/.test(r.cle)).forEach(r => o[r.cle] = (o[r.cle] || 0) + r.n); return Object.entries(o).sort((a, b) => b[1] - a[1]); };
    const m = tot(x => x === mois), a = tot(x => x >= an), som = t => t.reduce((s, x) => s + x[1], 0);
    const tab = (t, titre) => '<h2>' + titre + '</h2><table><tr><th>Livre, Défi+ ou outil</th><th>Ouvertures</th></tr>' + (t.length ? t.slice(0, 25).map(r => '<tr><td>' + esc(nom(r[0])) + '</td><td>' + r[1] + '</td></tr>').join("") : '<tr><td colspan="2">Aucune donnée</td></tr>') + '</table>';
    const html = '<!DOCTYPE html><html lang="fr-CA"><head><meta charset="utf-8"><title>Rapport d\'utilisation Métier+</title><style>body{font:12pt/1.4 system-ui,sans-serif;color:#1E2A44;margin:18mm}h1{margin:0;font-size:20pt}h2{font-size:13pt;margin:18pt 0 6pt;color:#EB6A22}.s{color:#5f6068;margin:2pt 0 14pt}.k{display:flex;gap:10pt}.k div{flex:1;border:1px solid #E5DAC6;border-radius:8pt;padding:8pt;text-align:center}.k b{display:block;font-size:18pt}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:4pt 6pt;border-bottom:1px solid #e3e6ee}td:last-child,th:last-child{text-align:right}.p{margin-top:18pt;font-size:9pt;color:#5f6068}</style></head><body>'
      + '<h1>Métier+ · Rapport d\'utilisation</h1><p class="s">Pavillon de l\'Avenir · imprimé le ' + new Date().toLocaleDateString("fr-CA", { day:"numeric", month:"long", year:"numeric" }) + '</p>'
      + '<div class="k"><div><b>' + C.filter(c => !c.eleve).length + '</b>enseignants</div><div><b>' + C.filter(c => c.eleve).length + '</b>groupes d\'élèves</div><div><b>' + L.filter(l => l.fichier && !l.user).length + '</b>livres</div><div><b>' + som(m) + '</b>ouvertures ce mois-ci</div><div><b>' + som(a) + '</b>ouvertures en 12 mois</div></div>'
      + tab(m, "Ce mois-ci") + tab(a, "12 derniers mois")
      + '<p class="p">Statistiques anonymes : Métier+ compte seulement combien de fois chaque livre, Défi+ ou outil est ouvert, jamais par qui (Loi 25).</p></body></html>';
    const f = document.createElement("iframe"); f.style.cssText = "position:fixed;width:0;height:0;border:0;left:-10px"; document.body.appendChild(f);
    f.contentDocument.open(); f.contentDocument.write(html); f.contentDocument.close();
    setTimeout(() => { try { f.contentWindow.focus(); f.contentWindow.print(); } catch(e){} setTimeout(() => f.remove(), 60000); }, 300);
  }

  /* ---------- Défi+ des livres (quiz-livres.js) ---------- */
  let QL = null, QL_TXT = "", QL_SEL = -1, QL_Q = -1, QL_MSG = "";
  const TQ = { choix:"Choix de réponses", multi:"Plusieurs bonnes réponses", ordre:"Remettre en ordre", paires:"Associer", nombre:"Calcul", estim:"Estimation", diapo:"Diapo", erreur:"Trouve l'erreur", nuage:"Nuage de mots", sondage:"Sondage", echelle:"Échelle", connexion:"Connexion" };
  async function chargerQL(){ const t = await (await fetch("quiz-livres.js?t=" + Date.now(), { cache:"no-store" })).text(); const i = t.indexOf("window.QUIZ_LIVRES = ") + 21, j = t.lastIndexOf("];") + 1; QL = JSON.parse(t.slice(i, j)); QL_TXT = t; }
  const qlTexte = () => { const i = QL_TXT.indexOf("window.QUIZ_LIVRES = ") + 21, j = QL_TXT.lastIndexOf("];") + 1; return QL_TXT.slice(0, i) + JSON.stringify(QL, null, 1).replace(/\n +/g, "\n") + QL_TXT.slice(j); };
  const qlChange = () => QL && qlTexte() !== QL_TXT;
  async function defi(z){
    if (!QL) { try { await chargerQL(); } catch(e){ z.innerHTML = '<p class="acces-err">Impossible de lire les Défi+.</p>'; return; } }
    const L = window.LIVRES || (typeof LIVRES !== "undefined" ? LIVRES : []), tl = f => (L.find(x => x.fichier === f) || {}).titre || f || "Autres";
    const grp = {}; QL.forEach((x, i) => { const k = tl(x.livre); (grp[k] = grp[k] || []).push(i); });
    const liste = Object.keys(grp).sort((a, b) => a.localeCompare(b, "fr")).map(k => '<div class="ap-ql-g">' + esc(k) + '</div>' + grp[k].map(i => '<button class="ap-nv' + (i === QL_SEL ? ' on' : '') + '" data-ql="' + i + '"><span class="ap-nv-t">' + esc(QL[i].titre) + '</span><small>' + QL[i].qs.length + ' questions</small></button>').join("")).join("");
    let ed = '<p class="sous">Choisis un Défi+ à gauche.</p>';
    if (QL_SEL >= 0) { const X = QL[QL_SEL];
      ed = '<label>Titre du Défi+</label><input type="text" id="qlT" value="' + esc(X.titre) + '">'
        + '<div class="ap-qs">' + X.qs.map((q, i) => '<button class="ap-q' + (i === QL_Q ? ' on' : '') + '" data-q="' + i + '"><b>' + (i + 1) + '.</b> ' + esc((q.q || "(image)").slice(0, 90)) + '<small>' + esc(TQ[q.t || "choix"] || q.t) + '</small></button>').join("") + '</div>'
        + '<div class="ap-btns"><button class="abtn" id="qlAj">+ Question (choix de réponses)</button></div>';
      if (QL_Q >= 0 && X.qs[QL_Q]) { const q = X.qs[QL_Q], t = q.t || "choix", simple = t === "choix" || t === "multi", bons = Array.isArray(q.bon) ? q.bon : [q.bon];
        ed += '<div class="ap-qed"><h3>Question ' + (QL_Q + 1) + ' · ' + esc(TQ[t] || t) + '</h3><label>Question</label><textarea id="qQ" class="ap-txt">' + esc(q.q || "") + '</textarea>'
          + (simple ? '<label>Réponses (coche la ou les bonnes)</label>' + (q.ch || []).map((c, k) => '<div class="ap-ch"><input type="checkbox" data-bon="' + k + '"' + (bons.includes(k) ? " checked" : "") + '><input type="text" data-ch="' + k + '" value="' + esc(c) + '"><button class="abtn rouge" data-chx="' + k + '" title="Retirer cette réponse">×</button></div>').join("")
            + ((q.ch || []).length < 6 ? '<button class="abtn" id="qChAj">+ Réponse</button>' : '')
            : '<p class="sous">Pour ce type, seuls la question et le temps se modifient ici. Pour le reste, demande à Claude.</p>')
          + '<div class="ap-2"><div><label>Temps (secondes)</label><input type="text" id="qS" inputmode="numeric" value="' + esc(q.s == null ? "" : q.s) + '"></div><div></div></div>'
          + '<div class="ap-btns"><button class="abtn" id="qHaut"' + (QL_Q === 0 ? " disabled" : "") + '>Monter</button><button class="abtn" id="qBas"' + (QL_Q === X.qs.length - 1 ? " disabled" : "") + '>Descendre</button><button class="abtn" id="qDup">Dupliquer</button><button class="abtn rouge" id="qSup">Retirer</button></div></div>'; } }
    z.innerHTML = '<div class="ap-tete"><h3>Défi+ des livres</h3><p class="sous">Corrige une question, une réponse, ou ajoutes-en. Les changements sont en ligne quelques minutes après « Publier les Défi+ ».</p></div>'
      + '<div class="ap-pub"><span class="acces-etat' + (qlChange() ? ' pub' : '') + '">' + (qlChange() ? 'Des changements attendent d\'être publiés' : 'Tout est publié') + '</span>' + (QL_MSG ? '<span class="acces-ok">' + esc(QL_MSG) + '</span>' : '') + '<span class="acces-err" id="qlErr" hidden></span>'
      + '<button class="abtn" id="qlAnn"' + (qlChange() ? '' : ' disabled') + '>Annuler les changements</button><button class="abtn prim" id="qlPub"' + (qlChange() ? '' : ' disabled') + '>Publier les Défi+</button></div>'
      + '<div class="ap-nvg"><div class="as-carte ap-nvl">' + liste + '</div><div class="as-carte">' + ed + '</div></div>';
    const re = () => defi(z), etat = () => { const c = qlChange(), e = z.querySelector(".ap-pub .acces-etat"); e.classList.toggle("pub", c); e.textContent = c ? "Des changements attendent d'être publiés" : "Tout est publié"; z.querySelector("#qlPub").disabled = !c; z.querySelector("#qlAnn").disabled = !c; };
    z.querySelectorAll("[data-ql]").forEach(b => b.onclick = () => { QL_SEL = +b.dataset.ql; QL_Q = -1; QL_MSG = ""; re(); });
    if (QL_SEL >= 0) { const X = QL[QL_SEL];
      z.querySelector("#qlT").oninput = e => { X.titre = e.target.value; etat(); };
      z.querySelectorAll("[data-q]").forEach(b => b.onclick = () => { QL_Q = +b.dataset.q; re(); });
      z.querySelector("#qlAj").onclick = () => { X.qs.push({ q:"Nouvelle question", ch:["Réponse A", "Réponse B", "Réponse C", "Réponse D"], bon:0, s:20 }); QL_Q = X.qs.length - 1; re(); };
      const q = X.qs[QL_Q];
      if (q) {
        z.querySelector("#qQ").oninput = e => { q.q = e.target.value; etat(); };
        z.querySelector("#qS").oninput = e => { const v = parseInt(e.target.value, 10); if (v > 0) q.s = v; etat(); };
        z.querySelectorAll("[data-ch]").forEach(i => i.oninput = () => { q.ch[+i.dataset.ch] = i.value; etat(); });
        z.querySelectorAll("[data-bon]").forEach(c => c.onchange = () => { const B = [...z.querySelectorAll("[data-bon]")].filter(x => x.checked).map(x => +x.dataset.bon);
          if (!B.length) { c.checked = true; return; } if ((q.t || "choix") === "choix" && B.length > 1) { q.t = "multi"; } if (q.t === "multi" && B.length === 1) delete q.t; q.bon = B.length === 1 ? B[0] : B; re(); });
        z.querySelectorAll("[data-chx]").forEach(b => b.onclick = () => { const k = +b.dataset.chx; if (q.ch.length <= 2) return; q.ch.splice(k, 1); const B = (Array.isArray(q.bon) ? q.bon : [q.bon]).filter(x => x !== k).map(x => x > k ? x - 1 : x); q.bon = B.length > 1 ? B : (B[0] || 0); if (!Array.isArray(q.bon) && q.t === "multi") delete q.t; re(); });
        const aj = z.querySelector("#qChAj"); if (aj) aj.onclick = () => { q.ch.push("Nouvelle réponse"); re(); };
        z.querySelector("#qHaut").onclick = () => { [X.qs[QL_Q - 1], X.qs[QL_Q]] = [X.qs[QL_Q], X.qs[QL_Q - 1]]; QL_Q--; re(); };
        z.querySelector("#qBas").onclick = () => { [X.qs[QL_Q + 1], X.qs[QL_Q]] = [X.qs[QL_Q], X.qs[QL_Q + 1]]; QL_Q++; re(); };
        z.querySelector("#qDup").onclick = () => { X.qs.splice(QL_Q + 1, 0, JSON.parse(JSON.stringify(q))); QL_Q++; re(); };
        z.querySelector("#qSup").onclick = () => { if (!confirm("Retirer la question " + (QL_Q + 1) + " de ce Défi+ ?")) return; X.qs.splice(QL_Q, 1); QL_Q = -1; re(); };
      } }
    z.querySelector("#qlAnn").onclick = async () => { await chargerQL(); QL_Q = -1; QL_MSG = ""; re(); };
    z.querySelector("#qlPub").onclick = async () => { const b = z.querySelector("#qlPub"), er = z.querySelector("#qlErr"); er.hidden = true; b.disabled = true; b.textContent = "Publication…";
      try { const t = qlTexte(); await A().publier({ "quiz-livres.js":t }, "Défi+ des livres (Administration)"); QL_TXT = t; QL_MSG = "Publié : en ligne d'ici quelques minutes."; re(); }
      catch(e){ er.textContent = e.message; er.hidden = false; b.disabled = false; b.textContent = "Publier les Défi+"; } };
  }

  /* ---------- Ajouter ou remplacer un livre ---------- */
  async function ajliv(z){
    const L = window.LIVRES || (typeof LIVRES !== "undefined" ? LIVRES : []), prot = A().livresProteges ? A().livresProteges() : [], progs = A().progs ? A().progs() : [];
    const enAttente = (A().extra ? A().extra() : []).filter(k => /^livres\//.test(k)).map(k => k.slice(7).replace(/\.chiffre$/, ""));
    z.innerHTML = '<div class="ap-tete"><h3>Ajouter ou remplacer un livre</h3><p class="sous">Le livre est chiffré ici, sur ton appareil, comme avec les outils de Claude, puis part en ligne avec « Publier » en bas.</p></div>'
      + (enAttente.length ? '<p class="acces-ok">Prêt à publier : ' + enAttente.map(esc).join(", ") + '</p>' : '')
      + '<div class="as-carte"><label>Que veux-tu faire ?</label><select id="lvM"><option value="">Ajouter un nouveau livre</option>' + prot.map(f => '<option value="' + esc(f) + '">Remplacer : ' + esc((L.find(l => l.fichier === f) || {}).titre || f) + '</option>').join("") + '</select>'
      + '<label>Fichier du livre (HTML, aux normes des livres Métier+)</label><input type="file" id="lvF" accept=".html,text/html">'
      + '<div id="lvNeuf"><div class="ap-2"><div><label>Titre</label><input type="text" id="lvT"></div><div><label>Programme</label><select id="lvC">' + progs.map(p => '<option>' + esc(p) + '</option>').join("") + '</select></div></div>'
      + '<div class="ap-2"><div><label>Niveau (ex. DEP 5333 · Compétence 7 · 307-...)</label><input type="text" id="lvN"></div><div><label>Compétence (numéro)</label><input type="text" id="lvK" inputmode="numeric"></div></div>'
      + '<label>Description</label><textarea id="lvD" class="ap-txt" maxlength="600"></textarea>'
      + '<div class="ap-2"><div><label>Couleur principale</label><input type="color" id="lvC1" value="#c4622d"></div><div><label>Couleur foncée</label><input type="color" id="lvC2" value="#24282c"></div></div>'
      + '<label class="as-cb"><input type="checkbox" id="lvE" checked> En construction</label></div>'
      + '<label>Couverture (facultatif : image JPEG ou PNG, mise au format 1020 × 1320)</label><input type="file" id="lvV" accept="image/*">'
      + '<p class="sous" style="margin-top:12px">Accès : un nouveau livre est donné à l\'administrateur et aux enseignants du programme choisi; un livre remplacé garde les mêmes accès (nouvelle clé). Le PDF n\'est pas refait ici : demande-le à Claude.</p>'
      + '<div class="ap-btns"><button class="abtn prim" id="lvOk">Préparer le livre</button></div><p class="acces-err" id="lvErr" hidden></p></div>';
    const M = z.querySelector("#lvM"), neuf = z.querySelector("#lvNeuf"); M.onchange = () => neuf.hidden = !!M.value;
    z.querySelector("#lvOk").onclick = async () => { const er = z.querySelector("#lvErr"), b = z.querySelector("#lvOk"); er.hidden = true;
      const fic = z.querySelector("#lvF").files[0], rem = M.value; const err = m => { er.textContent = m; er.hidden = false; b.disabled = false; b.textContent = "Préparer le livre"; };
      if (!fic) return err("Choisis le fichier HTML du livre.");
      const titre = z.querySelector("#lvT").value.trim(); if (!rem && !titre) return err("Donne un titre au livre.");
      b.disabled = true; b.textContent = "Chiffrement…";
      try {
        const html = await fic.text(); if (!/<html|<body|class="page/i.test(html)) return err("Ce fichier ne ressemble pas à un livre HTML.");
        const f = rem || slug(titre).slice(0, 40), autres = {};
        const txt = async u => (await fetch(u + "?t=" + Date.now(), { cache:"no-store" })).text();
        let livres = await txt("js/livres.js"), couv = await txt("js/couvertures.js");
        if (!rem) { if (L.some(l => l.fichier === f)) return err("Un livre porte déjà ce nom de fichier (" + f + ").");
          const J = v => JSON.stringify(v), cat = z.querySelector("#lvC").value, k = z.querySelector("#lvK").value.trim();
          const ent = '  { titre:' + J(titre) + ', auteur:"Jérémy Raymond", categorie:' + J(cat) + ', niveau:' + J(z.querySelector("#lvN").value.trim()) + (k ? ', competence:' + J(k) : '')
            + ',\n    pages:PAGES, annee:' + new Date().getFullYear() + ', nouveau:true, couverture:"", couleurs:[' + J(z.querySelector("#lvC1").value) + ',' + J(z.querySelector("#lvC2").value) + '], lien:"", fichier:' + J(f) + ', version:"1"' + (z.querySelector("#lvE").checked ? ', enConstruction:true' : '')
            + ',\n    description:' + J(z.querySelector("#lvD").value.trim()) + ' },\n';
          const fin = livres.indexOf("\n];"); if (fin < 0) return err("js/livres.js : fin de liste introuvable.");
          livres = livres.slice(0, fin + 1) + ent + livres.slice(fin + 1);
        } else { const re = new RegExp('(fichier:"' + f.replace(/[-]/g, "\\-") + '", version:")(\\d+)(")'); if (!re.test(livres)) return err("Version du livre introuvable dans js/livres.js.");
          livres = livres.replace(re, (m, a, v, c) => a + (+v + 1) + c); }
        const cv = z.querySelector("#lvV").files[0];
        if (cv) { const im = await createImageBitmap(cv), c = document.createElement("canvas"); c.width = 1020; c.height = 1320; const g = c.getContext("2d"), k = Math.max(1020 / im.width, 1320 / im.height);
          g.drawImage(im, (1020 - im.width * k) / 2, (1320 - im.height * k) / 2, im.width * k, im.height * k);
          autres["img/couvertures/" + f + ".jpg"] = new Uint8Array(await (await new Promise(r => c.toBlob(r, "image/jpeg", .85))).arrayBuffer());
          const v = Date.now().toString(36), lig = '  "' + f + '": "img/couvertures/' + f + '.jpg?v=' + v + '",';
          const reC = new RegExp('^\\s*"' + f.replace(/[-]/g, "\\-") + '":.*$', "m"); couv = reC.test(couv) ? couv.replace(reC, lig) : couv.replace("window.COUVERTURES = {", "window.COUVERTURES = {\n" + lig);
          autres["js/couvertures.js"] = couv; }
        b.textContent = "Chiffrement du livre…";
        const nPages = [...new DOMParser().parseFromString(html.replace(/data:[^"')\s]+/g, ""), "text/html").querySelectorAll(".page")].filter(p => !p.parentElement.closest(".page")).length;
        if (!nPages && !confirm("Aucune page « .page » trouvée dans ce fichier : la recherche dans le livre ne marchera pas. Continuer quand même ?")) return err("Préparation annulée.");
        autres["js/livres.js"] = livres.replace("pages:PAGES", "pages:" + nPages);
        const r = await A().preparerLivre({ f, html, categorie:rem ? "" : z.querySelector("#lvC").value, autres });
        A().redessiner({ ok:"« " + (titre || f) + " » est prêt (" + r.pages + " pages, " + r.comptes + " accès). Touche « Publier » pour le mettre en ligne." });
      } catch(e){ err(e.message); } };
  }

  function dessiner(k, z){
    if (!z) return;
    try { ({ accueil, auto, journaux:fluidite, classe, groupes, nouv, diff, voir, defi, ajliv, magasin })[k](z); } catch(e){ z.innerHTML = '<p class="acces-err">' + esc(e.message) + '</p>'; }
  }
  return { dessiner, rapport };
})();
