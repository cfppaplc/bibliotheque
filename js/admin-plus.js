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
      + '<div class="as-carte"><h3>Les plus utilisés ce mois-ci</h3><div id="apUtil"><p class="sous">Chargement…</p></div><button class="abtn" data-go="stats">Toutes les statistiques</button></div>'
      + '<div class="as-carte"><h3>Raccourcis</h3><div class="ap-rac">'
      + [["nouv", "Ajouter une nouveauté", "Quoi de neuf"], ["livres", "Cacher, mettre en vedette, « Nouveau »", "Livres"], ["profs", "Donner des livres, inviter un enseignant", "Comptes et accès"], ["classe", "Ménage, formations, coffres, horaires", "Classe et atelier"]]
          .map(r => '<button class="as-lien" data-go="' + r[0] + '">' + esc(r[1]) + '<small>' + esc(r[2]) + '</small></button>').join("")
      + '</div></div></div>';
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

  /* ---------- Classe et atelier ---------- */
  function classe(z){
    const L = (h, t, s) => '<a class="as-lien" href="' + h + '" target="_blank" rel="noopener">' + esc(t) + '<small>' + esc(s) + '</small></a>';
    z.innerHTML = '<div class="ap-tete"><h3>Classe et atelier</h3><p class="sous">Les réglages de chaque outil s\'ouvrent dans un nouvel onglet.</p></div><div class="as-grille ap-g3">'
      + '<div class="as-carte"><h3>Atelier</h3>' + L("outils-atelier.html", "Gestion d'atelier", "Groupes, élèves, équipes, locaux") + L("passeport.html?formations=1", "Formations du registre", "Outils et machines à signer") + L("coffres.html", "Inventaire des coffres", "Coffres, codes QR, listes") + '</div>'
      + '<div class="as-carte"><h3>Classe</h3>' + L("accueil.html?menage=1", "Locaux et tâches du ménage", "Accueil de classe") + L("accueil.html", "Accueil de classe", "Horaire, citations, ménage") + L("horaire.html", "Horaires des groupes", "Planification") + '</div>'
      + '<div class="as-carte"><h3>Labo</h3>' + L("labo.html", "Labo interactif", "Simulateurs et Défi+") + L("quiz.html", "Mes Défi+", "Créer et lancer un Défi+") + L("simulateur.html", "Simulateur de panneau", "") + '</div>'
      + '<div class="as-carte"><h3>Outils de vérification</h3>' + L("tests.html", "Pages d'essai", "Navigateur, vitesse, toucher, son, écran") + L("presentation.html", "Présentation de Métier+", "Pour l'école et les collègues") + L("confidentialite.html", "Confidentialité (Loi 25)", "Ce que le site recueille") + '</div>'
      + '</div>';
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

  function dessiner(k, z){
    if (!z) return;
    try { ({ accueil, auto, journaux:fluidite, classe, nouv })[k](z); } catch(e){ z.innerHTML = '<p class="acces-err">' + esc(e.message) + '</p>'; }
  }
  return { dessiner };
})();
