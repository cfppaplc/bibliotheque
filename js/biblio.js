/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — biblio.js (sorti d'index.html le 15 nov.) */
const PALETTES = [
  ["#e50914","#7a0410"],["#1e88e5","#0b2f6b"],["#43a047","#12461a"],["#8e24aa","#3c0f52"],
  ["#fb8c00","#7a3d00"],["#00acc1","#05474f"],["#d81b60","#5c0a2a"],["#5e35b1","#22125a"]
];

/* ---- Favoris (mémorisés dans le navigateur) ---- */
/* Les données personnelles (ma liste, « Continuer », signets) sont gardées à deux endroits : dans le navigateur (localStorage)
   et en double dans IndexedDB (voir restaurerMiroir). Si l'un des deux est vidé, l'autre les remet. */
const lireLS = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || "null") || d; } catch(e){ return d; } };
const ecrireLS = (k, v) => {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){}
  try { if (MIROIR.includes(k)) DB.setKv("m_" + k, JSON.parse(JSON.stringify(v))).catch(() => {}); } catch(e){}
};
const MIROIR = ["favs", "pos", "marks"];
let favs = lireLS("favs", []);
function saveFavs(){ ecrireLS("favs", favs); }
const isFav = l => favs.includes(l.fichier);

/* ---- Utilitaires ---- */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function palette(titre){
  let h = 0; for (const c of titre) h = (h*31 + c.charCodeAt(0)) >>> 0;
  return PALETTES[h % PALETTES.length];
}
function couv(l){ return l.couverture || (window.COUVERTURES && (COUVERTURES[l.fichier] || (l.couvDe && COUVERTURES[l.couvDe]))) || ""; }
function fond(l){ const [a,b] = l.couleurs || palette(l.titre); return `linear-gradient(160deg,${a},${b})`; }
function coverStyle(l){
  if (couv(l)) return `background-image:url('${esc(couv(l))}')`;
  const [a,b] = l.couleurs || palette(l.titre);
  return `background:linear-gradient(160deg,${a},${b})`;
}

let view = "all", query = "";
const ADM = { tab:"add", pend:[], editing:null, confirmDel:null, extraCats:[], ovr:{}, uid:0, ord:[], feat:[], lastBackup:0, lighten:true };
const POS = lireLS("pos", {});
/* Réglages des livres publiés depuis le panneau d'administration (reglages.json, 7 nov.) : cachés, « En construction », « Nouveau », vedette */
let REGLAGES = { caches:[], construction:{}, nouveau:{}, vedette:[] };
const LIVRES_CACHES = [];
function appliquerReglages(R){
  REGLAGES = Object.assign({ caches:[], construction:{}, nouveau:{}, vedette:[] }, R || {});
  const tous = [...LIVRES, ...LIVRES_CACHES]; tous.forEach((l, i) => { if (l._i === undefined) l._i = l.user ? 1e6 + i : i; if (l._c0 === undefined) l._c0 = !!l.enConstruction;
    const c = REGLAGES.construction[l.fichier]; l.enConstruction = c === undefined ? l._c0 : !!c; });
  tous.sort((a, b) => a._i - b._i);
  LIVRES.splice(0, LIVRES.length, ...tous.filter(l => !REGLAGES.caches.includes(l.fichier)));
  LIVRES_CACHES.splice(0, LIVRES_CACHES.length, ...tous.filter(l => REGLAGES.caches.includes(l.fichier)));
}
fetch("reglages.json", { cache:"no-cache" }).then(r => r.ok ? r.json() : null).then(R => { if (!R) return; appliquerReglages(R); try { render(); renderHero(); } catch(e){} }).catch(() => {});

function progression(l){
  const sp = POS[l.fichier];
  if (!sp || !(sp.n > 1) || !sp.tot) return "";
  const pct = Math.max(2, Math.min(100, Math.round(sp.n / sp.tot * 100)));
  return `<div class="prog" title="Page ${esc(sp.label || sp.n)} sur ${sp.tot}"><i style="width:${pct}%"></i></div>`;
}
/* ---- Quoi de neuf (nouveautes.json : mis à jour à chaque publication) ---- */
let NOUV = [];
const dateFr = d => { try { return new Date(d + "T12:00:00").toLocaleDateString("fr-CA", { day:"numeric", month:"long", year:"numeric" }); } catch(e){ return d; } };
function majRecente(l){ const e = NOUV.find(n => n.livre === l.fichier && (n.type === "maj" || n.type === "ajout")); if (!e) return null;
  return (Date.now() - new Date(e.date + "T12:00:00")) < 30 * 864e5 ? e : null; }
/* « Nouveau » pendant 30 jours : date de l'ajout dans Quoi de neuf, ou date d'ajout par l'administration */
function estNouveau(l, RG){ const fo = (RG || REGLAGES).nouveau[l.fichier]; if (fo === false) return false;
  const e = NOUV.find(n => n.livre === l.fichier && n.type === "ajout"), t = fo ? new Date(fo + "T12:00:00").getTime() : e ? new Date(e.date + "T12:00:00").getTime() : (l.user ? (l.added || 0) : 0);
  return !!t && (Date.now() - t) < 30 * 864e5; }
/* Livres déjà ouverts sur cet ordinateur : le badge « Nouveau » ou « Mis à jour » disparaît une fois le livre ouvert (ou après 30 jours) */
const vuLe = l => { try { return (JSON.parse(localStorage.getItem("livresVus") || "{}"))[l.fichier || l.id] || 0; } catch(e){ return 0; } };
function marquerVu(l){ if (!l || l.fichier === "tableau-blanc") return; try { const v = JSON.parse(localStorage.getItem("livresVus") || "{}"); v[l.fichier || l.id] = Date.now(); localStorage.setItem("livresVus", JSON.stringify(v)); } catch(e){} }
/* Livre encore en préparation (enConstruction:true dans LIVRES) : badge jaune avec un cône, prioritaire sur les autres */
const ICO_CONSTR = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3h4l5 16H5z"/><path d="M8.2 9.5h7.6M6.9 14h10.2M3 21h18"/></svg>';
function badgeLivre(l){
  if (l.enConstruction) return "construction";
  if (estNouveau(l) && !vuLe(l)) return "nouveau";
  const m = majRecente(l); if (m && vuLe(l) < new Date(m.date + "T00:00:00").getTime()) return "maj";
  return "";
}
function bookCard(l){
  const gen = !couv(l);
  return `<div class="item">
  <div class="book" data-f="${esc(l.fichier)}">
    ${l.essai ? '<span class="badge badge-essai">Essai gratuit</span>' : badgeLivre(l) === "construction" ? '<span class="badge badge-constr" title="Livre en construction : pas encore la version finale">' + ICO_CONSTR + 'En construction</span>' : badgeLivre(l) === "nouveau" ? '<span class="badge">Nouveau</span>' : badgeLivre(l) === "maj" ? '<span class="badge badge-maj">Mis à jour</span>' : ''}
    ${isFav(l) ? '<span class="fav-mark">★</span>' : ''}
    ${window.ACCES && ACCES.verrouille(l.fichier) ? '<span class="cadenas" title="Livre protégé : connecte-toi pour l\'ouvrir">' + window.ICO_CADENAS + '</span>' : ''}
    ${l.user || l.perso || l.ens ? '<span class="mp-coll autre" title="Livre ajouté par un enseignant (hors collection Métier+)"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/></svg></span>' : '<span class="mp-coll" title="Collection Métier+"><img src="img/metier-plus-icone.svg" alt="Métier+"></span>'}
    <div class="cover ${gen?'generated':''}" style="${coverStyle(l)}">
      ${gen ? `<div class="t">${esc(l.titre)}</div><div class="a">${esc(l.auteur)}</div>` : ''}
    </div>
    ${gen ? '' : `<div class="hov">${l.pages ? `<b>${l.pages} pages</b>` : ''}<small>Clique pour ouvrir</small></div>`}
    ${progression(l)}
  </div>
  <div class="ttl" title="${esc(l.titre)}">${esc(l.titre)}</div>
  ${l.competence || l.niveau ? `<div class="comp">${esc(((l.niveau || "").replace(/^DEP\s*\d+\s*·\s*/, "")) || ("Compétence " + l.competence))}</div>` : ''}
  </div>`;
}

/* Rangées « Continuer » et « Nouveautés » : on peut les réduire (mémorisé dans le navigateur) */
const RANGS_REDUCTIBLES = ["Continuer", "Nouveautés"];
let rangsReduits = lireLS("rangsReduits", []);
function rowHTML(titre, livres){
  if (!livres.length) return "";
  if (RANGS_REDUCTIBLES.includes(titre)){
    const red = rangsReduits.includes(titre);
    return `<section class="row reductible${red ? " reduit" : ""}" data-rang="${esc(titre)}">
    <h2 style="--cc:${palette(titre)[0]}"><button class="row-tog" type="button" aria-expanded="${!red}" title="${red ? "Afficher" : "Réduire"} cette rangée">
      <svg class="chev" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
      <span>${esc(titre)}</span><small class="row-nb">${livres.length} livre${livres.length > 1 ? "s" : ""}</small></button></h2>
    <div class="row-wrap">
      <button class="arrow left" aria-label="Précédent">‹</button>
      <div class="scroller">${livres.map(bookCard).join("")}</div>
      <button class="arrow right" aria-label="Suivant">›</button>
    </div>
  </section>`;
  }
  return `<section class="row">
    <h2 style="--cc:${palette(titre)[0]}">${esc(titre)}</h2>
    <div class="row-wrap">
      <button class="arrow left" aria-label="Précédent">‹</button>
      <div class="scroller">${livres.map(bookCard).join("")}</div>
      <button class="arrow right" aria-label="Suivant">›</button>
    </div>
  </section>`;
}

/* ---- Programmes : nom affiché des rangées et filtre en haut de la page ---- */
const PROGRAMMES = { "Entretien général d'immeubles":"DEP 5211 · Entretien général d'immeubles", "Plomberie et chauffage":"DEP 5333 · Plomberie et chauffage" };
const nomProgramme = c => PROGRAMMES[c] || c;
let filtreProg = lireLS("filtreProg", "");
function dessinerFiltres(){
  let bar = $("#filtres");
  if (!bar){ bar = document.createElement("div"); bar.id = "filtres"; bar.setAttribute("role", "toolbar"); bar.setAttribute("aria-label", "Filtrer par programme"); $("#rows").before(bar); }
  const cats = [...new Set(LIVRES.map(l => l.categorie))].sort((a, b) => nomProgramme(a).localeCompare(nomProgramme(b), "fr"));
  if (cats.length < 2 || query || view !== "all"){ bar.hidden = true; return; }
  bar.hidden = false;
  const chip = (val, txt) => `<button type="button" class="fchip${filtreProg === val ? " on" : ""}" data-prog="${esc(val)}" aria-pressed="${filtreProg === val}">${esc(txt)}</button>`;
  bar.innerHTML = chip("", "Tous les programmes") + cats.map(c => chip(c, nomProgramme(c))).join("");
  bar.querySelectorAll(".fchip").forEach(b => b.onclick = () => { filtreProg = b.dataset.prog; ecrireLS("filtreProg", filtreProg); render(); });
}
/* visiteur = personne pas connectée sur cet appareil (ni session, ni enseignant déjà venu) */
/* dernière page du livre d'essai : fermer le livre puis ouvrir la connexion ou la demande d'accès (appelé depuis le livre) */
window.essaiFin = k => { try { closeReader(); } catch(e){} setTimeout(() => { if (!window.ACCES) return; if (k === "dem") ACCES.dlgDemande(false); else ACCES.dlgConnexion(); }, 250); };
function estVisiteur(){ const b = document.body; const v = !(window.ACCES && ACCES.session) && !b.classList.contains("connecte") && !b.classList.contains("pre-co") && !b.classList.contains("classe");
  b.classList.toggle("visiteur", v); return v; }
const VIS_OUTILS = [["Plans techniques", "Des dossiers de plans complets, à mettre à l'échelle et à mesurer directement au tableau.", '<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>'],
  ["Formatifs", "Cahiers d'activités et questionnaires à projeter, imprimer ou télécharger.", '<path d="M8 3h8l3 3v15H5V3z"/><path d="M9 11l2 2 4-4M9 17h6"/>'],
  ["Labo", "Quiz et simulations joués avec les iPad de la classe, sans compte élève.", '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/>']];
function render(){
  let list = LIVRES.filter(l => !l.essai);   /* l'essai gratuit est pour les visiteurs seulement */
  if (estVisiteur() && !query){
    const tous = LIVRES.filter(l => l.fichier && !l.perso && l.fichier !== "tableau-blanc").sort((a, b) => (b.essai ? 1 : 0) - (a.essai ? 1 : 0));
    $("#rows").innerHTML = rowHTML("Les livres de Métier+", tous)
      + `<section class="vis-outils"><h2>Et aussi, une fois connecté</h2><div class="vis-cartes">${VIS_OUTILS.map(([t, d, i]) => `<div class="vis-carte"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${i}</svg><b>${t}</b><p>${d}</p></div>`).join("")}</div>
        <p class="vis-note">Commence par l'<b>essai gratuit</b> : il s'ouvre sans connexion. Pour les autres livres, on te demandera de te connecter.</p></section>`;
    return; }
  const lienFav = document.querySelector('nav a[data-view="fav"]'); if (lienFav) lienFav.hidden = !favs.length;
  if (view === "fav" && !favs.length){ view = "all"; document.querySelectorAll("nav a[data-view]").forEach(a => a.classList.toggle("active", a.dataset.view === "all")); }
  if (view === "fav") list = list.filter(isFav);
  if (filtreProg && LIVRES.some(l => l.categorie === filtreProg)) list = list.filter(l => l.categorie === filtreProg);
  if (query){
    const q = query.toLowerCase();
    list = list.filter(l => [l.titre,l.auteur,l.categorie,l.niveau,l.competence ? "compétence " + l.competence : ""].join(" ").toLowerCase().includes(q));
  }

  const rows = $("#rows");
  if (!list.length && query.length >= 3 && view === "all"){ rows.innerHTML = ""; dessinerFiltres(); chercherDansLivres(query); return; }
  if (!list.length){
    rows.innerHTML = `<div class="empty"><h2>Aucun livre trouvé</h2><p>${view==="fav" ? "Ajoute des livres à « Ma liste » pour les retrouver ici." : "Essaie un autre mot-clé."}</p></div>`;
    return;
  }

  let html = "";
  if (!query && view === "all"){
    /* « Continuer » : tout en bas (6 nov., peu utilisée au quotidien), après les programmes */
    /* « Nouveautés » retirée : les livres récents gardent leur étiquette et sont listés dans « Quoi de neuf » */
    if (favs.length) html += rowHTML("Ma liste", list.filter(isFav));
  }
  html += rowHTML("Mes livres", list.filter(l => l.perso));
  list = list.filter(l => !l.perso);
  const cats = [...new Set(list.map(l => l.categorie))].sort((a, b) => nomProgramme(a).localeCompare(nomProgramme(b), "fr"));
  const parComp = (a, b) => (parseFloat(a.competence) || 999) - (parseFloat(b.competence) || 999) || a.titre.localeCompare(b.titre, "fr");
  cats.forEach(c => html += rowHTML(nomProgramme(c), list.filter(l => l.categorie === c).sort(parComp)));
  /* rangée « Continuer » retirée le 14 nov. (pas utilisée, demande de Jeremy) */
  rows.innerHTML = html;
  dessinerFiltres();
  if (query.length >= 3) chercherDansLivres(query);
}
/* ---- Recherche dans le texte des livres (recherche.json, créé à chaque publication) ---- */
let INDEX_TEXTE = null, rechJeton = 0;
const sansAccent = t => [...t].map(c => (c.normalize("NFD")[0] || c).toLowerCase()).join("");
function chargerIndex(){
  if (!INDEX_TEXTE) INDEX_TEXTE = Promise.all([fetch("recherche.json").then(r => r.ok ? r.json() : {}).catch(() => ({})), window.ACCES ? ACCES.pret.then(() => ACCES.recherche()).catch(() => ({})) : {}]).then(([a, b]) => Object.assign({}, a, b)).then(d => {
    const out = {}; for (const k in d) out[k] = d[k].map(t => ({ t, n: sansAccent(t) })); return out; }).catch(() => ({}));
  return INDEX_TEXTE;
}
async function chercherDansLivres(q){
  const jeton = ++rechJeton, idx = await chargerIndex();
  if (jeton !== rechJeton || !$("#rows")) return;
  const nq = sansAccent(q.trim()), hits = [];
  for (const l of LIVRES){
    if (l.essai && !estVisiteur()) continue;
    const pages = idx[l.fichier]; if (!pages) continue;
    if (filtreProg && l.categorie !== filtreProg && false) continue;
    pages.forEach((pg, i) => { const k = pg.n.indexOf(nq); if (k >= 0) hits.push({ l, page:i + 1, k, t:pg.t }); });
  }
  let sec = $("#hits"); if (sec) sec.remove();
  sec = document.createElement("section"); sec.id = "hits"; sec.className = "hits";
  if (!hits.length){ sec.innerHTML = `<h2>Dans les livres</h2><p class="hits-vide">Aucune page ne contient « ${esc(q)} ».</p>`; }
  else {
    const max = 40, extrait = h => { const a = Math.max(0, h.k - 70), b = Math.min(h.t.length, h.k + nq.length + 90);
      return (a > 0 ? "…" : "") + esc(h.t.slice(a, h.k)) + "<mark>" + esc(h.t.slice(h.k, h.k + nq.length)) + "</mark>" + esc(h.t.slice(h.k + nq.length, b)) + (b < h.t.length ? "…" : ""); };
    sec.innerHTML = `<h2>Dans les livres <small>${hits.length} page${hits.length > 1 ? "s" : ""}${hits.length > max ? ` · ${max} premières` : ""}</small></h2>
      <div class="hits-list">${hits.slice(0, max).map((h, j) => `<button type="button" class="hit" data-j="${j}"><span class="hit-t">${esc(h.l.titre)} <b>· page ${h.page}</b></span><span class="hit-x">${extrait(h)}</span></button>`).join("")}</div>`;
    sec.querySelectorAll(".hit").forEach(b => b.onclick = () => { const h = hits[+b.dataset.j]; RD.allerA = h.page; lire(h.l); });
  }
  $("#rows").prepend(sec);
}

/* ---- Bannière ---- */
/* Aperçu de l'accueil : les 3 derniers livres ajoutés (avec une vraie couverture), complétés par les autres.
   Le plus récent est au centre, devant. */
function vedettes(){
  const avec = LIVRES.filter(l => couv(l));
  const feat = (REGLAGES.vedette.length ? REGLAGES.vedette : ADM.feat).map(f => avec.find(l => l.fichier === f)).filter(Boolean);
  const recents = avec.filter(l => l.user).sort((x, y) => (y.added || 0) - (x.added || 0));
  if (!feat.length && !recents.length) return avec.slice(0, 3);   /* aucun ajout : l'aperçu d'origine */
  const t = [...new Set([...feat, ...recents, ...avec.filter(l => !l.user)])].slice(0, 3);
  return t.length === 3 ? [t[1], t[0], t[2]] : t;
}
/* Accueil dynamique (8 nov., A + B + C choisis par Jeremy) : enseignant connecté = « Bonjour Prénom ! », carte du prochain cours préparé,
   et 4 tuiles qui suivent ses dernières actions (livre en cours, dernier quiz, tableau blanc, Labo, accueil de classe). Visiteur : texte de présentation. */
function accueilPerso(){
  let S = window.ACCES && ACCES.session; const pre = document.body.classList.contains("pre-co");
  if (!S && pre){ let n = ""; try { n = localStorage.getItem("etaitConnecte") || ""; } catch(e){} S = { nom: n === "1" ? "" : n }; }
  if (!S || S.eleve || !(document.body.classList.contains("connecte") || pre)) return "";
  const J = k => { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch(e){ return null; } }, maintenant = Date.now(), H = new Date().getHours();
  const jour = d => d.toLocaleDateString("en-CA"), auj = jour(new Date()), dem = jour(new Date(maintenant + 864e5));
  /* prochain cours préparé (accueil de classe) */
  let carte = "", cours = null; const cfg = J("accueil-atelier-v4") || {};
  const fini = k => k.slice(0, 10) === auj && (k.endsWith("|am") ? H >= 12 : H >= 17);
  const plans = Object.keys(cfg.plans || {}).filter(k => k.slice(0, 10) >= auj && !fini(k)).sort();
  if (cfg.slot && cfg.slot.slice(0, 10) === auj && !fini(cfg.slot) && (cfg.module || cfg.steps)) cours = { k: cfg.slot, p: cfg };
  else if (plans.length) cours = { k: plans[0], p: cfg.plans[plans[0]] };
  if (cours){ const d = cours.k.slice(0, 10), am = !cours.k.endsWith("|pm");
    const quand = d === auj ? (am ? "ce matin" : "cet après-midi") : d === dem ? (am ? "demain matin" : "demain après-midi") : new Date(d + "T12:00").toLocaleDateString("fr-CA", { weekday:"long", day:"numeric", month:"long" }) + (am ? ", matin" : ", après-midi");
    const etapes = String(cours.p.steps || "").split("\n").map(s => s.trim()).filter(Boolean), nl = Object.values(cours.p.liens || {}).flat().filter(Boolean).length;
    const titre = cours.p.module || etapes[0] || "Cours préparé";
    carte = `<div class="hp-cours"><div class="hp-c-t"><div class="q">Ton cours ${esc(quand)}</div><b>${esc(titre)}</b><span>${etapes.length} étape${etapes.length > 1 ? "s" : ""}${nl ? " · " + nl + " contenu" + (nl > 1 ? "s" : "") + " lié" + (nl > 1 ? "s" : "") : ""}</span></div><button type="button" data-hp="accueil">Ouvrir l'accueil de classe</button></div>`; }
  /* tuiles, de la plus utile à la moins utile */
  const T = [], ic = (c, d) => `<span class="ic ${c}"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg></span>`;
  if (!cours && (H >= 14 || new Date().getDay() % 6 === 0)) T.push(`<button class="hp-t" data-hp="preparer">${ic("o", '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h4"/>')}<span>Préparer demain<small>Accueil de classe</small></span></button>`);
  const dernier = Object.entries(POS).filter(([f, p]) => p && p.n > 1 && LIVRES.some(l => l.fichier === f)).sort((a, b) => b[1].t - a[1].t)[0];
  if (dernier){ const l = LIVRES.find(x => x.fichier === dernier[0]), c = couv(l);
    T.push(`<button class="hp-t" data-hp="livre" data-f="${esc(l.fichier)}">${c ? `<img src="${esc(c)}" alt="">` : ic("o", '<path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z"/>')}<span>Reprendre<small>${esc(l.titre)} · p. ${esc(dernier[1].label || dernier[1].n)}</small></span></button>`); }
  const q = J("dernierQuiz");
  if (q && q.id && maintenant - q.t < 21 * 864e5) T.push(`<button class="hp-t" data-hp="quiz" data-q="${esc(q.id)}">${ic("r", '<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5.5 3.5-5.5 3.5z"/>')}<span>Rejouer<small>${esc(q.titre)}</small></span></button>`);
  const tb = +(localStorage.getItem("dernierTableau") || 0);
  if (tb && maintenant - tb < 7 * 864e5) T.push(`<button class="hp-t" data-hp="tableau">${ic("b", '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>')}<span>Continuer ton tableau<small>Tableau blanc</small></span></button>`);
  /* seulement ce qui est personnel (les outils fixes sont dans la barre du haut) */
  const prenom = (S.nom || "").split(/\s+/)[0];
  return `<h1>${esc(window.titreAccueil && window.titreAccueil() || (prenom ? "Bonjour " + prenom + " !" : "Bonjour !"))}</h1><p class="hp-sous">Que veux-tu enseigner aujourd'hui ?</p>${carte}${T.length ? `<div class="hp-tuiles">${T.slice(0, 4).join("")}</div>` : ""}`;
}
function brancherAccueilPerso(h){
  const clic = id => { const b = document.getElementById(id); if (b) b.click(); };
  h.querySelectorAll("[data-hp]").forEach(b => b.onclick = () => { const k = b.dataset.hp;
    if (k === "accueil" || k === "preparer") clic("accueilBtn");
    else if (k === "tableau") clic("wbBtn");
    else if (k === "labo") clic("simBtn");
    else if (k === "quiz") window.open("quiz.html?animer=1&quiz=" + encodeURIComponent(b.dataset.q), "_blank");
    else if (k === "livre"){ const l = LIVRES.find(x => x.fichier === b.dataset.f); if (l){ RD.allerA = (POS[l.fichier] || {}).n || 1; lire(l); } } }); }
function renderHero(){
  const h = $("#hero"), perso = accueilPerso();
  if (perso){ h.style.cssText = "background:linear-gradient(120deg,#1b2540 0%,#141414 68%)"; h.classList.add("hp");
    h.innerHTML = `<div class="hero-content">${perso}</div>`;
    brancherAccueilPerso(h); return; }
  h.classList.remove("hp");
  h.style.cssText = "background:linear-gradient(120deg,#1b2540 0%,#141414 68%)";
  if (estVisiteur()){   /* visiteur (pas connecté) : accueil simplifié, 8 nov. */
    h.innerHTML = `<div class="hero-content"><h1>Enseigner un métier, simplement.</h1>
      <p>Métier+ réunit les livres de cours animés, les plans techniques, les formatifs, les quiz et les simulations des enseignants en formation professionnelle. <span class="hero-tag">Réservé aux élèves et enseignants du Pavillon de l'Avenir</span></p>
      <div class="vis-btns"><button class="vis-co" id="visCo" type="button">Se connecter</button><button class="vis-dem" id="visDem" type="button">Demander un accès</button><a class="vis-dec" href="presentation.html">Découvrir Métier+ ›</a></div></div>
      <div class="hero-stack">${vedettes().map(l => `<img src="${esc(couv(l))}" alt="">`).join("")}</div>`;
    $("#visCo").onclick = () => window.ACCES && ACCES.dlgConnexion();
    $("#visDem").onclick = () => window.ACCES && ACCES.dlgDemande(false);
    return; }
  h.innerHTML = `<div class="hero-content">
    <h1>${(window.titreAccueil && window.titreAccueil()) || "La plateforme des enseignants en formation professionnelle"}</h1>
    <p>Livres de cours animés, plans techniques, formatifs et simulateurs, réunis pour enseigner un métier en classe comme à l'atelier. <span class="hero-tag">Réservé aux élèves et enseignants du Pavillon de l'Avenir</span></p>
    <button class="hero-aide" id="heroAide" type="button">❔ Aide</button>
  </div>
  <div class="hero-stack">${vedettes().map(l => `<img src="${esc(couv(l))}" alt="">`).join("")}</div>`;
  $("#heroAide").onclick = () => ouvrirBienvenue();
}

/* ---- Ouverture d'un livre : une carte au centre de l'écran (plus de message par-dessus la barre d'outils) ---- */
let chargeT = 0;
function chargement(l, attente){   /* attente : on prépare encore le livre (PDF, téléchargement) : ne pas fermer l'écran de chargement au bout de 4 s */
  let c = document.getElementById("chargeLivre"); clearInterval(chargeT);
  if (!l){ if (c) c.hidden = true; return; }
  if (!c){ c = document.createElement("div"); c.id = "chargeLivre"; c.className = "charge"; document.body.appendChild(c); }
  c.innerHTML = `<div class="charge-c">` + (couv(l) ? `<img src="${esc(couv(l))}" alt="">` : "") + `<div><div class="charge-r" aria-hidden="true"></div><b>${esc(l.titre)}</b><span>Ouverture du livre…</span><i class="charge-b"><i></i></i></div></div>`;
  c.hidden = false; const t0 = Date.now();
  /* (7 nov., demande de Jeremy) on laisse au livre le temps de bien s'ouvrir : une fois prêt, encore 1,5 s (images décodées, animations lancées),
     au moins 3 s en tout, et on attend que les images de la page soient chargées (au plus 6 s de plus) */
  let tPret = 0;
  const imagesPretes = () => { try { const d = $("#readerFrame").contentDocument; return [...d.images].every(i => i.complete); } catch(e){ return true; } };
  chargeT = setInterval(() => { let pret = false; try { pret = !!(RD.drv && RD.drv.state().tot > 0); } catch(e){}
    const n = Date.now();
    if (pret && !tPret){ tPret = n; const sp = c.querySelector(".charge-c span"); if (sp) sp.textContent = "Préparation des pages et des animations…"; }
    const fini = tPret && n - tPret > 500 && (imagesPretes() || n - tPret > 4000);   /* 12 nov. : plus de minimum de 3 s (on attendait pour rien) */
    if (!tPret && n - t0 > 6000 && !c._lent){ c._lent = 1; const sp = c.querySelector(".charge-c span"); if (sp) sp.textContent = "Téléchargement et déverrouillage du livre… (plus long la première fois)"; }
    if (fini || !attente && n - t0 > 45000 || !attente && !$("#reader").classList.contains("open") && n - t0 > 4000 || attente && n - t0 > 180000){ clearInterval(chargeT); if (fini && window.prepMenu) setTimeout(prepMenu, 1200); const bb = c.querySelector(".charge-b"); if (bb && fini){ bb.classList.add("fin"); setTimeout(() => { c.hidden = true; }, 300); } else c.hidden = true; } }, 150);
}
/* ---- Fenêtre de détails ---- */
let toastT;
function aviser(msg, ms){
  const t = $("#toast"); t.textContent = msg; t.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, ms || 3500);
}
/* ---- Lecteur : barre d'outils propre à la bibliothèque (identique pour tous les livres) ---- */
const INKS = {};                         // traits du crayon, par livre et par page
const WIDTHS = [2, 4, 8];
const ZOOMS = [1, 1.25, 1.5, 2, 2.5, 3];
/* (14 nov.) Format commun Métier+ : une seule feuille (format/livre-mp.css) ajoutée à la fin de tout livre converti (.page.mp),
   donc un changement de style = ce fichier seulement (la copie dans le livre ne sert que de secours). */
let MPCSS = ""; fetch("format/livre-mp.css", { cache:"no-cache" }).then(r => r.ok ? r.text() : "").then(t => { MPCSS = t; }).catch(() => {});
function avecFormatMp(html){
  if (!MPCSS || !/<(section|div) class="page[^"]*\bmpc?\b/.test(html)) return html;
  const tag = '<style id="mp-commun">' + MPCSS + "</style>", i = html.toLowerCase().lastIndexOf("</body>");
  return i < 0 ? html + tag : html.slice(0, i) + tag + html.slice(i);
}
const HOSTCSS = "#ui{display:none!important}nav#bar{display:none!important}div#anim{display:none!important}"
  /* Protection incendie : la page qui tourne en 3D est remplacée par un fondu rapide et doux */
  /* Transition de page commune à tous les livres (comme Plomberie et chauffage) : la nouvelle page apparaît en fondu en montant légèrement.
     On anime « translate » (et non « transform ») pour ne jamais gêner la mise à l'échelle propre à chaque livre. */
  + "html{touch-action:pan-x pan-y!important}"   /* pas de zoom du navigateur au pincement : c'est la bibliothèque qui zoome (sinon le navigateur prend le geste et le pincement échoue 1 fois sur 3) */
  + ".page.vis,.page.hcur{animation:biblioPage .45s cubic-bezier(.2,.7,.2,1) both!important}"
  /* Protection incendie : les 100 pages cachées restaient dessinées à chaque zoom (1 à 3 s); on saute leur rendu, sans ombre */
  + "#book>.page:not(.cur):not(.out){content-visibility:hidden;box-shadow:none!important}"
  /* cellulaire : le navigateur grossissait le texte de certains livres (« font boosting ») et les lignes se chevauchaient; sans effet sur ordinateur */
  + "html{-webkit-text-size-adjust:100%!important;text-size-adjust:100%!important}"
  + "#book>.page.out.fwd,#book>.page.out.back{animation:biblioPageOut .3s ease forwards!important;z-index:3!important}#book>.page.cur.fwd,#book>.page.cur.back{animation:biblioPage .45s cubic-bezier(.2,.7,.2,1) backwards!important;z-index:2!important}"
  + "@keyframes biblioPage{from{opacity:0;translate:0 8px}to{opacity:1;translate:none}}@keyframes biblioPageOut{from{opacity:1}to{opacity:0}}"
  + "@keyframes biblioFondu{from{opacity:0}to{opacity:1}}@media (prefers-reduced-motion:reduce){.page.vis,.page.hcur,#book>.page.cur,#book>.page.cur.fwd,#book>.page.cur.back{animation:biblioFondu .2s ease backwards!important}#book>.page.out,#book>.page.out.fwd,#book>.page.out.back{animation:biblioPageOut .18s ease forwards!important}}";
const LEGERCSS = "*{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;will-change:auto!important}.page.vis,.page.hcur,#book>.page.cur,#book>.page.out{animation-duration:.01s!important}";   /* mode léger : livres sans flou ni transition de page */   // masque la barre d'outils intégrée aux livres
const ICO_CHECK = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>';
const ICO_PAUSE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5v14M15 5v14"/></svg>', ICO_PLAY = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg>';
const RD = { book:"", drv:null, attached:false, z:1, pen:false, wb:false, spot:false, cache:false,
             color:"#e2483d", wIdx:1, eraser:false, label:"", tot:0, r:150, poll:null };

/* Un « pilote » traduit les gestes de la barre en actions sur le livre.
   Ordre : moteurs connus (A, B), livres avec leur propre barre (détection automatique),
   pages empilées (.page) que la bibliothèque affiche elle-même, puis simple défilement. */
const NEXT_RE = /(page suivante|suivante?|next)/, NEXT_SHORT = /^(→|▶|►|›|»|>)$/;
const PREV_RE = /(page précédente|page precedente|précédente?|precedente?|prev)/, PREV_SHORT = /^(←|◀|◄|‹|«|<)$/;
const commonAncestor = (a, b) => { let n = a; while (n && !n.contains(b)) n = n.parentElement; return n; };
function findButton(doc, re, shortRe){
  const c = [...doc.querySelectorAll("button,[role=button]")];
  return c.find(b => re.test(((b.getAttribute("aria-label") || "") + " " + (b.title || "")).toLowerCase()))
      || c.find(b => shortRe.test((b.textContent || "").trim())) || null;
}
function hideOwnBar(doc, a, b){
  let bar = commonAncestor(a, b);
  if (!bar || bar === doc.body || bar === doc.documentElement) return;
  while (bar.parentElement && bar.parentElement !== doc.body && bar.parentElement !== doc.documentElement
         && !bar.parentElement.querySelector(".page,main,article") && doc.defaultView.getComputedStyle(bar).position !== "fixed") bar = bar.parentElement;
  bar.setAttribute("data-host-hide", "1");
  const st = doc.createElement("style"); st.textContent = "[data-host-hide]{display:none!important}"; doc.documentElement.appendChild(st);
}
function findCounter(doc){
  const re = /^\s*(\d+)\s*(?:\/|sur|of)\s*(\d+)\s*$/i;
  const el = [...doc.querySelectorAll("span,div,output,b,strong,label,p")].find(e => !e.children.length && re.test(e.textContent || ""));
  if (el) return { read:() => { const m = re.exec(el.textContent); return m ? { label:m[1], tot:+m[2] } : { label:"", tot:0 }; } };
  const inp = doc.querySelector('input[aria-label*="page" i],input[inputmode="numeric"]');
  if (inp) return { input:inp, read:() => ({ label:inp.value, tot:+(inp.max || 0) || doc.querySelectorAll(".page").length }) };
  return null;
}
function findModules(doc, win){
  const sel = [...doc.querySelectorAll("select")].find(s => s.options.length >= 3);
  if (sel) return () => [...sel.options].map(o => { const m = /^(?:Module|Chapitre)\s+(\d+)\s*[—:.-]\s*(.*)$/i.exec(o.textContent.trim());
    return { tag:m ? m[1] : "•", text:m ? m[2] : o.textContent.trim(), color:"", run:() => { sel.value = o.value; sel.dispatchEvent(new win.Event("change", { bubbles:true })); } }; });
  const box = [...doc.querySelectorAll('[role=dialog],[id*=menu i],[id*=toc i],[class*=menu i],[class*=toc i]')].find(c => c.querySelectorAll("button,[data-go]").length >= 3);
  if (box) return () => [...box.querySelectorAll("button,[data-go]")].map((b, i) => ({
    tag:((b.querySelector("b,strong") || {}).textContent || String(i + 1)).trim(), text:((b.querySelector("span") || b).textContent || "").replace(/\s+/g, " ").trim(),
    color:b.style.getPropertyValue("--a"), run:() => b.click() }));
  return () => [];
}
function pauseDriverPart(doc){
  let still = null;
  return { animOn:() => !still, toggleAnim:() => { if (still){ still.remove(); still = null; } else { still = doc.createElement("style");
    still.textContent = "*,*::before,*::after{animation:none!important;transition:none!important}"; doc.documentElement.appendChild(still); } } };
}
/* Réponses « natives » pour tout livre : il suffit de marquer une réponse (class="reponse", "answer", "solution" ou "correction",
   ou l'attribut data-reponse). Le bouton ✓ de la bibliothèque les cache ou les montre toutes (le texte garde sa place, rien ne bouge). */
const REP_SEL = ".reponse,.answer,.solution,.correction,[data-reponse],[data-answer]";
/* (7 nov.) bonne réponse d'un choix multiple / vrai-faux : toujours visible (c'est un des choix), seulement surlignée par le livre;
   elle compte dans le pas à pas (classe h-vu quand c'est son tour) mais n'est jamais cachée */
const REP_CHOIX = ".reponse-choix";
function repDriverPart(doc){
  if (!doc.querySelector(REP_SEL + "," + REP_CHOIX)) return {};
  const st = doc.createElement("style");
  /* cachées au départ, puis forcées visibles avec ✓ (même si le livre les cache lui-même en attendant la bibliothèque) */
  st.textContent = "body:not(.h-rep) :is(" + REP_SEL + "){visibility:hidden!important}body.h-rep :is(" + REP_SEL + "){visibility:visible!important}"
    + "body.h-pas :is(" + REP_SEL + ").h-vu{visibility:visible!important}";
  doc.documentElement.appendChild(st);
  return { ansSimple:true, ansSel:REP_SEL + "," + REP_CHOIX, clsTout:["h-rep"], clsPas:["h-pas"], clsVu:"h-vu", answers:() => doc.body.classList.toggle("h-rep"),
    ansInfo:() => ({ dis:!doc.querySelector(REP_SEL + "," + REP_CHOIX), mode:doc.body.classList.contains("h-rep") ? 2 : 0, s:0, t:0 }) };
}
/* Chapitres d'un livre sans sommaire : les titres (h1, h2) placés dans une page, une diapo ou une section */
function titresModules(doc, goto){
  const box = [...doc.querySelectorAll(".page,.slide,.diapo,section,[data-page]")].filter(e => !e.parentElement || !e.parentElement.closest(".page,.slide,.diapo,section,[data-page]"));
  const seen = new Set(), out = [];
  box.forEach((b, i) => { const h = b.querySelector("h1,h2"), t = h ? h.textContent.replace(/\s+/g, " ").trim() : "";
    if (!t || seen.has(t)) return; seen.add(t);
    const m = /^(?:module|chapitre|chapter|partie|compétence)\s*([\d.]+)\s*[—:.-]?\s*(.*)$/i.exec(t);
    out.push({ tag:m ? m[1] : String(i + 1), text:(m && m[2]) || t, color:"", page:i + 1, run:() => goto(i + 1) }); });
  return out.length > 1 ? out : [];
}

/* ---- Réponses « pas à pas » pour tous les livres (comme les livres de compétence) ----
   0 = cachées · 1 = pas à pas (→ montre la réponse suivante de la page affichée, ← la retire) · 2 = toutes */
function ajouterPas(drv, win, doc){
  if (!drv || !drv.ansSimple || !drv.ansSel) return drv;
  const body = () => doc.body, sel = drv.ansSel;
  const marque = drv.clsPas[drv.clsPas.length - 1];
  const mode = () => body().classList.contains(marque) ? 1 : drv.clsTout.every(c => body().classList.contains(c)) ? 2 : 0;
  const visibles = () => { const H = win.innerHeight, W = win.innerWidth;
    return [...doc.querySelectorAll(sel)].filter(e => { const r = e.getBoundingClientRect(); if (!(r.width || r.height) || r.bottom <= 0 || r.top >= H || r.right <= 0 || r.left >= W) return false;
      const pg = e.closest(".page,.slide,.diapo,[data-page]"); if (!pg) return true; const cs = win.getComputedStyle(pg); return cs.visibility !== "hidden" && cs.display !== "none" && +cs.opacity > 0; }); };
  const poser = m => { const cl = body().classList; [...drv.clsTout, ...drv.clsPas].forEach(c => cl.remove(c));
    if (m === 1){ doc.querySelectorAll("." + drv.clsVu).forEach(e => e.classList.remove(drv.clsVu)); drv.clsPas.forEach(c => cl.add(c)); }
    if (m === 2) drv.clsTout.forEach(c => cl.add(c)); };
  const next0 = drv.next, prev0 = drv.prev;
  return Object.assign(drv, {
    ansSimple:false,
    answers:() => poser((mode() + 1) % 3),
    ansInfo:() => { const m = mode(), v = m === 1 ? visibles() : [];
      return { dis:false, mode:m, s:v.filter(e => e.classList.contains(drv.clsVu)).length, t:v.length }; },
    next:() => { if (mode() === 1){ const e = visibles().find(x => !x.classList.contains(drv.clsVu)); if (e){ e.classList.add(drv.clsVu); return; } } next0(); },
    prev:() => { if (mode() === 1){ const v = visibles().filter(x => x.classList.contains(drv.clsVu)); if (v.length){ v[v.length - 1].classList.remove(drv.clsVu); return; } } prev0(); }
  });
}
function buildDriver(win, doc){ return ajouterPas(buildDriver0(win, doc), win, doc); }
function buildDriver0(win, doc){
  const el = id => doc.getElementById(id);
  const click = id => { const b = el(id); if (b) b.click(); };

  /* Moteur A : livres animés de compétence (barre #ui) */
  if (el("ui") && el("bp") && el("pg")){
    const gotoP = n => { const i = el("pg"); i.value = n; i.dispatchEvent(new win.KeyboardEvent("keydown", { key:"Enter", bubbles:true })); };
    const nav = dir => {
      const b = el("br");
      if (!b || !b.disabled){ click(dir > 0 ? "bn" : "bp"); return; }
      const m = String(el("pg").value).match(/\d+/g) || ["1"], a = +m[0], z = +m[m.length - 1], t = doc.querySelectorAll(".page").length;
      const to = dir > 0 ? Math.min(t, z + 1) : Math.max(1, a - 1);
      if (to === (dir > 0 ? z : a)) return;
      gotoP(to);
    };
    /* livres récents (Utiliser un micro-ordinateur) : en pas à pas, un clic sur la page montre la réponse suivante, comme dans les autres livres */
    if (typeof win.ansState === "function" && typeof win.next === "function" && !win.__clicRep){ win.__clicRep = 1;
      doc.addEventListener("click", e => { if (!doc.body.classList.contains("stepans")) return;
        if (e.target.closest && e.target.closest("button,a,input,select,textarea,label,[onclick],#ui,#menu")) return;
        if (win.next()) e.preventDefault(); }); }
    return {
      /* Sur une page sans réponses, le livre (en mode « pas à pas ») garde en mémoire les réponses de la page d'avant et
         avale des appuis sans tourner la page : on passe alors par « aller à la page » pour tourner. */
      /* ces livres gardent une marge en bas pour leur barre (masquée ici) : on la récupère */
      pad:{ t:-6, h:54, w:40 },
      prev:() => nav(-1), next:() => nav(1),
      state:() => ({ label:el("pg").value, tot:doc.querySelectorAll(".page").length }),
      goto:n => gotoP(n),
      modules:() => [...doc.querySelectorAll("#menu .mods button")].map(b => ({
        tag:(b.querySelector("b") || {}).textContent || "", text:(b.querySelector("span") || {}).textContent || "",
        color:b.style.getPropertyValue("--a"), page:b.dataset.go !== undefined && b.dataset.go !== "" ? +b.dataset.go : undefined, run:() => b.click() })),
      animOn:() => !doc.body.classList.contains("still") && !doc.body.classList.contains("still0"),
      toggleAnim:() => click("ba"), answers:() => click("br"),
      /* État des réponses : 0 = cachées, 1 = pas à pas (compteur « 15/46 »), 2 = toutes affichées */
      ansInfo:() => { const b = el("br"), bc = doc.body.classList, x = /(\d+)\s*\/\s*(\d+)/.exec(((b && b.textContent) || "").trim());   /* « 15/46 » ou « Réponses 15/46 » */
        return { dis:!b || b.disabled || b.classList.contains("dis"), mode:!bc.contains("answers") ? 0 : bc.contains("stepans") ? 1 : 2, s:x ? +x[1] : 0, t:x ? +x[2] : 0 }; }
    };
  }
  /* Moteur B : livre de protection incendie (barre nav#bar) */
  if (el("prev") && el("count") && el("jump")){
    /* le menu des modules du livre ne s'ouvre plus par-dessus : celui de la bibliothèque le remplace */
    if (el("menu")){ const st = doc.createElement("style"); st.textContent = "#menu{display:none!important}"; doc.documentElement.appendChild(st); }
    return {
      prev:() => click("prev"), next:() => click("next"),
      state:() => { const m = /(\d+)\s*\/\s*(\d+)/.exec(el("count").textContent); return { label:m ? m[1] : "", tot:m ? +m[2] : 0 }; },
      goto:n => { if (win.__incendie && win.__incendie.go) win.__incendie.go(n - 1); },
      modules:() => [...el("jump").options].map(o => { const m = /^Module\s+(\d+)\s*[—-]\s*(.*)$/.exec(o.textContent);
        return { tag:m ? m[1] : "•", text:m ? m[2] : o.textContent, color:"", page:+o.value, run:() => { if (win.__incendie) win.__incendie.go(+o.value); } }; }),
      animOn:() => el("anim").getAttribute("aria-pressed") !== "false",
      toggleAnim:() => click("anim"),
      /* Corrigé intégré (.ans, affiché par body.answers) dans les versions récentes de ce livre */
      ...(doc.querySelector(".ans") ? { ansSimple:true, ansSel:".ans", clsTout:["answers"], clsPas:["answers", "stepans"], clsVu:"shown",
        answers:() => { doc.body.classList.remove("stepans"); doc.body.classList.toggle("answers"); },
        ansInfo:() => ({ dis:false, mode:doc.body.classList.contains("answers") ? 2 : 0, s:0, t:0 }) } : { answers:null })
    };
  }
  /* Livre inconnu avec sa propre barre : on retrouve ses boutons, on la masque et on la pilote */
  const nextB = findButton(doc, NEXT_RE, NEXT_SHORT), prevB = findButton(doc, PREV_RE, PREV_SHORT);
  if (nextB && prevB){
    hideOwnBar(doc, prevB, nextB);
    const counter = findCounter(doc), mods0 = findModules(doc, win), pz = Object.assign(pauseDriverPart(doc), repDriverPart(doc));
    const read = () => counter ? counter.read() : { label:"", tot:0 };
    const drv = Object.assign({
      prev:() => prevB.click(), next:() => nextB.click(), state:read,
      goto:n => {
        if (counter && counter.input){ counter.input.value = n; counter.input.dispatchEvent(new win.KeyboardEvent("keydown", { key:"Enter", bubbles:true })); return; }
        const cur = parseInt(read().label, 10); if (!cur || !n) return;
        let d = n - cur; const b = d > 0 ? nextB : prevB; d = Math.abs(d);
        const t = setInterval(() => { if (d-- <= 0){ clearInterval(t); return; } b.click(); }, 70);
      },
      modules:() => { const m = mods0(); return m.length ? m : titresModules(doc, n => drv.goto(n)); }
    }, pz);
    return drv;
  }
  const pz = pauseDriverPart(doc);
  /* Pages empilées (.page) sans moteur : la bibliothèque les affiche une à une, ajustées à l'écran */
  const pages = [...doc.querySelectorAll(".page")];
  if (pages.length >= 3){
    let cur = 0;
    const st = doc.createElement("style");
    st.textContent = "html,body{margin:0!important;height:100%!important;overflow:hidden!important;background:#111!important}.page{display:none!important}.page.hcur{display:block!important;position:fixed!important;left:0;top:0;margin:0!important;transform-origin:0 0}";
    doc.documentElement.appendChild(st);
    const fit = () => { const p = pages[cur]; p.style.transform = ""; const w = p.offsetWidth, h = p.offsetHeight; if (!w || !h) return;
      const s = Math.min(win.innerWidth / w, win.innerHeight / h);
      p.style.transform = `translate(${(win.innerWidth - w * s) / 2}px,${(win.innerHeight - h * s) / 2}px) scale(${s})`; };
    /* « live » : classe que certains livres ajoutent eux-mêmes (un peu plus tard) pour lancer les animations de la page visible.
       On la pose en même temps que la page s'affiche : sinon la page apparaît complète, disparaît, puis se rejoue (effet de page en double). */
    /* Après le tour de page animé (double page), les pages arrivent déjà jouées dans les copies : on les montre sans rejouer leurs animations */
    let calme = null;
    const show = i => {
      if (RD.calme && !calme){ calme = doc.createElement("style"); calme.textContent = "*,*::before,*::after{animation:none!important;transition:none!important}"; doc.documentElement.appendChild(calme); }
      else if (!RD.calme && calme){ calme.remove(); calme = null; }
      cur = Math.max(0, Math.min(pages.length - 1, i)); pages.forEach((p, k) => { if (k !== cur) p.classList.remove("hcur", "live"); }); pages[cur].classList.add("hcur", "live"); fit(); };
    win.addEventListener("resize", fit); show(0);
    const modules = () => { const out = [{ tag:"⌂", text:"Couverture", color:"", page:1, run:() => show(0) }];
      pages.forEach((p, i) => { const h = p.querySelector("h1,h2"), t = h ? h.textContent.replace(/\s+/g, " ").trim() : "";
        const m = /^(module|chapitre|chapter|partie|compétence)\s*([\d.]+|[A-Z](?=\s*[—:.-]))\s*[—:.-]?\s*(.*)$/i.exec(t);   /* (7 nov.) aussi une lettre : Module F, Partie A */
        if (m) out.push({ tag:m[2], text:m[3] || t, color:"", page:i + 1, run:() => show(i) }); });
      return out.length > 1 ? out : []; };
    return Object.assign({ keys:true, prev:() => show(cur - 1), next:() => show(cur + 1),
      state:() => ({ label:String(cur + 1), tot:pages.length }), goto:n => show(n - 1), modules }, pz, repDriverPart(doc));
  }
  /* Document simple : défilement par écran */
  const root = doc.scrollingElement || doc.documentElement;
  let sc = root;
  if (!(root.scrollHeight > win.innerHeight + 40) || win.getComputedStyle(doc.body).overflowY === "hidden"){
    const c = [...doc.querySelectorAll("body *")].filter(e => { const o = win.getComputedStyle(e).overflowY;
      return (o === "auto" || o === "scroll") && e.scrollHeight > e.clientHeight + 40 && e.clientHeight > win.innerHeight * .5; })
      .sort((a, b) => b.scrollHeight - a.scrollHeight)[0];
    if (c) sc = c;
  }
  const vh = () => sc === root ? win.innerHeight : sc.clientHeight;
  return Object.assign({
    prev:() => sc.scrollBy({ top:-vh() * .9, behavior:"smooth" }), next:() => sc.scrollBy({ top:vh() * .9, behavior:"smooth" }),
    state:() => ({ label:String(Math.round(sc.scrollTop / vh()) + 1), tot:Math.max(1, Math.ceil(sc.scrollHeight / vh())) }),
    goto:n => sc.scrollTo({ top:(n - 1) * vh(), behavior:"smooth" }),
    modules:() => [...doc.querySelectorAll("h1,h2")].filter(h => h.textContent.trim()).slice(0, 80).map((h, i) => ({
      tag:h.tagName === "H1" ? "■" : "•", text:h.textContent.replace(/\s+/g, " ").trim().slice(0, 90), color:"",
      run:() => h.scrollIntoView({ behavior:"smooth", block:"start" }) })),
    noDbl:true,      /* un document qui défile n'a pas de pages à mettre côte à côte */
    defile:true      /* … et la roulette sert à le faire défiler */
  }, pz, repDriverPart(doc));
}

function injectHead(html, css){
  const tag = "<style>" + css + "</style>";
  if (/<head[^>]*>/i.test(html)) return html.replace(/<head[^>]*>/i, m => m + tag);
  return tag + html;
}

function attach(){
  if (RD.attached || !$("#reader").classList.contains("open")) return;
  const f = $("#readerFrame");
  RD.attached = true;
  let win, doc;
  try { win = f.contentWindow; doc = f.contentDocument; if (!doc || !doc.body) return; } catch(e){ return; }
  RD.drv = buildDriver(win, doc);
  window.RD = RD;   // pour signaler.js (livre et page dans un signalement)
  try { if (!win.__sgBranche){ win.__sgBranche = 1; win.addEventListener("error", e => { if (window.mpErreurLivre && (!e.target || e.target === win)) mpErreurLivre(e.message, "livre " + RD.book + (e.lineno ? ":" + e.lineno : "")); }); } } catch(e){}
  setTimeout(() => { try { appliquerPad(); sizeInner(); } catch(e){} }, 0);
  /* Le bouton ✓ est toujours là (barre identique partout) ; grisé si le livre n'a pas de réponses */
  $("#tbAns").hidden = false; $("#tbAns").dataset.k = "";
  if (!RD.drv.ansInfo){ const bt = $("#tbAns"); bt.disabled = true; bt.classList.remove("on"); bt.innerHTML = ICO_CHECK; bt.title = "Ce livre n'a pas de réponses à afficher"; bt.setAttribute("aria-label", bt.title); }
  hookKeys(win); try { verrouEleve(win, doc); } catch(e){}
  try { installAnim(win, doc); } catch(e){}
  try { win.dispatchEvent(new Event("resize")); const ae = document.activeElement; if (!(ae && (/^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName) || ae.isContentEditable))) win.focus(); } catch(e){}   /* ne pas voler le focus d'une case où l'on écrit */
  poll();
  if (RD.dbl) setupSecond();
}
function resetAnimPos(){ ["#readerFrame", "#readerFrame2"].forEach(i => { try { const d = $(i).contentDocument; if (d && d.__hReset) d.__hReset(); } catch(e){} }); }
function enSaisie(t){
  if (!t || !t.tagName) return false;
  if (t.isContentEditable) return true;
  if (t.tagName === "TEXTAREA" || t.tagName === "SELECT") return true;
  if (t.tagName !== "INPUT") return false;
  if (t.id === "pg" && t.closest && t.closest("#ui,[data-host-hide]")) return false;   /* champ de page de la barre interne masquée */
  return !/^(checkbox|radio|button|submit|reset|range|color|file)$/i.test(t.type || "");
}
/* ---- Contrôle des animations : natif à la bibliothèque, identique pour tous les livres ----
   Détecte les animations qui tournent en boucle sur la page affichée et place Pause / étapes juste au-dessus. */
const ANIM_CSS = '#h-anim{position:fixed;left:0;top:0;width:0;height:0;z-index:2147483000;pointer-events:none}'
  + '.h-actl{position:fixed;display:none;align-items:center;gap:3px;padding:3px;background:rgba(14,14,15,.94);border:1px solid #2f2f33;border-radius:8px;color:#e6e6e8;box-shadow:0 4px 14px rgba(0,0,0,.4);pointer-events:auto;white-space:nowrap;user-select:none;-webkit-user-select:none;opacity:.22;transition:opacity .2s;font:600 11px/1 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}'
  + '.h-actl.on{display:flex}'
  + '.h-actl{zoom:calc(1 / var(--zb, 1))}'   /* zoom « photo » : le livre est agrandi par la bibliothèque, ce petit bouton garde sa taille */
  + '.h-actl .hg{display:inline-flex;align-items:center;justify-content:center;width:14px;height:24px;cursor:grab;color:#76767c;touch-action:none}.h-actl .hg:hover{color:#d4d4d8}.h-actl.drag{opacity:1}.h-actl.drag .hg{cursor:grabbing}'
  + '.h-actl.paused{opacity:.5}.h-actl.near,.h-actl:hover,.h-actl.paused.near{opacity:1}'
  + '.h-actl button{all:unset;box-sizing:border-box;min-width:24px;height:24px;padding:0 7px;display:inline-flex;align-items:center;justify-content:center;gap:4px;border-radius:6px;cursor:pointer;color:#d4d4d8;background:#18181a;border:1px solid #2f2f33;font:600 11px/1 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}'
  + '.h-actl button:hover{background:#262629;color:#fff}'
  + '.h-actl svg{display:block}'
  + '.h-actl .hn{color:#8d8d94;font-weight:500;padding:0 4px 0 2px;font-variant-numeric:tabular-nums}'
  + '.h-actl .hn:empty{display:none}'
  + '@media (max-width:640px) and (pointer:coarse){.h-actl{display:none!important}}';   /* cellulaire : le petit bouton Pause cachait du texte */
const AI = b => '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + b + '</svg>';
const A_PAUSE = AI('<path d="M9 5v14M15 5v14"/>') + "Pause", A_PLAY = AI('<path d="M8 5l11 7-11 7z" fill="currentColor"/>') + "Lecture";
const A_PREV = AI('<path d="M15 5l-7 7 7 7"/>'), A_NEXT = AI('<path d="M9 5l7 7-7 7"/>');

/* Étapes : on repère les temps forts de la plus longue animation (images clés), ou la série d'étapes nommées du livre */
function animLabelStops(S, D){
  const SER = [/^m1q\d+$/, /-st\d+$/, /^(sq|vz|vb|pr|vp)-s\d+$/, /^m1-f\d$/, /^aq-t\d$/];
  const isOn = k => { if (k.opacity !== undefined) return +k.opacity > 0.5; const b = k.backgroundColor || k.background;
    if (b !== undefined) return !/transparent|rgba\(0, 0, 0, 0\)/.test(b); if (k.boxShadow !== undefined) return k.boxShadow !== "none"; return false; };
  for (const re of SER){
    const LA = S.filter(a => a.effect.getTiming().duration === D && [...(a.effect.target.classList || [])].some(c => re.test(c)));
    if (LA.length < 2) continue;
    const out = [];
    LA.forEach(a => { const K = a.effect.getKeyframes(), dl = a.effect.getTiming().delay || 0;
      for (let i = 0; i + 1 < K.length; i++){ const t0 = K[i].computedOffset * D, t1 = K[i + 1].computedOffset * D;
        if (t1 >= D * 0.999 && isOn(K[0]) && i > 0) continue;
        if (t1 - t0 >= 0.03 * D && isOn(K[i]) && isOn(K[i + 1])) out.push((dl + (t0 + t1) / 2) % D); } });
    out.sort((a, b) => a - b); const u = []; out.forEach(x => { if (!u.length || x - u[u.length - 1] > 0.02 * D) u.push(x); }); return u;
  }
  return null;
}
function animInfo(anims){
  const S = anims.filter(a => a.effect.getTiming().duration >= 3000); if (!S.length) return null;
  const D = Math.max(...S.map(a => a.effect.getTiming().duration));
  const ts = new Set([0, D]);
  S.forEach(a => { if (a.effect.getTiming().duration !== D) return; a.effect.getKeyframes().forEach(k => ts.add(Math.round(k.computedOffset * D))); });
  const arr = [...ts].sort((a, b) => a - b); let stops = [];
  for (let i = 0; i + 1 < arr.length; i++){ const g = arr[i + 1] - arr[i]; if (g >= 0.05 * D) stops.push(arr[i] + g * 0.5); }
  const L = animLabelStops(S, D); if (L && L.length >= 2) stops = L;
  return { S, D, stops };
}
function installAnim(win, doc){
  if (!doc || !doc.body || doc.__hanim) return; doc.__hanim = true;
  const st = doc.createElement("style"); st.textContent = ANIM_CSS; doc.documentElement.appendChild(st);
  const box = doc.createElement("div"); box.id = "h-anim"; doc.body.appendChild(box);
  const REC = new Map();
  const seen = r => r && r.width > 2 && r.height > 2 && r.right > 0 && r.bottom > 0 && r.left < win.innerWidth && r.top < win.innerHeight;
  function scan(){
    const G = new Map(), first = doc.querySelector(".page"), add = (el, fn, long) => {
      const r = el.getBoundingClientRect(); if (!seen(r)) return;
      /* On écarte le décor : barres fines, petits points, bandeaux pleine largeur et la couverture */
      const pg = el.closest && el.closest(".page"), pw = pg ? pg.getBoundingClientRect().width : win.innerWidth;
      if ((!long && Math.min(r.width, r.height) < 20) || (r.width >= pw * .9 && r.height < 120) || (pg && pg === first)) return;
      const g = pg || doc.body;
      let o = G.get(g); if (!o){ o = { g, anims:[], svgs:[], big:0, x0:1e9, y0:1e9, x1:-1e9, y1:-1e9 }; G.set(g, o); }
      fn(o); o.big = Math.max(o.big, r.width * r.height); o.x0 = Math.min(o.x0, Math.max(0, r.left)); o.y0 = Math.min(o.y0, Math.max(0, r.top));
      o.x1 = Math.max(o.x1, Math.min(win.innerWidth, r.right)); o.y1 = Math.max(o.y1, Math.min(win.innerHeight, r.bottom));
    };
    let list = []; try { list = doc.getAnimations(); } catch(e){}
    list.forEach(a => { const t = a.effect && a.effect.getTiming && a.effect.getTiming(), el = a.effect && a.effect.target;
      if (!t || t.iterations !== Infinity || !el || !el.getBoundingClientRect || (el.closest && el.closest("#h-anim"))) return;
      if (el.checkVisibility && !el.checkVisibility({ visibilityProperty:true, opacityProperty:false })) return;   /* animation d'une page cachée (protection incendie) : pas de bouton Pause au milieu de la page */
      add(el, o => o.anims.push(a), t.duration >= 3000); });
    doc.querySelectorAll("svg").forEach(s => { if (s.querySelector("animate,animateTransform,animateMotion,set") && s.pauseAnimations && !(s.checkVisibility && !s.checkVisibility({ visibilityProperty:true }))) add(s, o => { if (!o.svgs.includes(s)) o.svgs.push(s); }); });
    return G;
  }
  const paused = o => o.anims.some(a => a.playState === "paused") || o.svgs.some(s => s.animationsPaused && s.animationsPaused());
  function significant(o){ const seq = o.anims.some(a => a.effect.getTiming().duration >= 3000); return o.big >= 6000 || (seq && (o.x1 - o.x0) * (o.y1 - o.y0) >= 6000); }
  function mk(){
    const d = doc.createElement("div"); d.className = "h-actl"; d.setAttribute("role", "toolbar"); d.setAttribute("aria-label", "Contrôle des animations");
    d.innerHTML = '<span class="hg" title="Déplacer (revient à sa place au changement de page)" aria-label="Déplacer">' + AI('<circle cx="9" cy="6" r="1.4" fill="currentColor"/><circle cx="15" cy="6" r="1.4" fill="currentColor"/><circle cx="9" cy="12" r="1.4" fill="currentColor"/><circle cx="15" cy="12" r="1.4" fill="currentColor"/><circle cx="9" cy="18" r="1.4" fill="currentColor"/><circle cx="15" cy="18" r="1.4" fill="currentColor"/>') + '</span><button data-a="prev" title="Étape précédente" aria-label="Étape précédente">' + A_PREV + '</button><button data-a="pp">' + A_PAUSE + '</button><button data-a="next" title="Étape suivante" aria-label="Étape suivante">' + A_NEXT + '</button><span class="hn"></span>';
    box.appendChild(d); const r = { d, cur:null, msg:"", prev:d.querySelector("[data-a=prev]"), next:d.querySelector("[data-a=next]"), pp:d.querySelector("[data-a=pp]"), n:d.querySelector(".hn"), pz:null, dx:0, dy:0, bx:0, by:0, held:false };
    d._r = r; return r;
  }
  function tick(){
    if (!doc.defaultView || !doc.body.isConnected){ clearInterval(RIDX); return; }
    if (!$("#reader").classList.contains("open") || document.hidden) return;
    const G = scan();
    REC.forEach((r, g) => { if (!G.has(g)){ r.d.classList.remove("on"); r.cur = null; r.dx = r.dy = 0; r.held = false; } });
    G.forEach((o, g) => {
      let r = REC.get(g); if (!significant(o)){ if (r){ r.d.classList.remove("on"); r.cur = null; r.dx = r.dy = 0; r.held = false; } return; }
      if (!r){ r = mk(); REC.set(g, r); }
      r.cur = o; enforce(r); const info = animInfo(o.anims), p = paused(o), seq = !!(info && info.stops.length >= 2);
      r.prev.hidden = r.next.hidden = !seq;
      if (!p) r.msg = ""; else if (!r.msg) r.msg = "En pause";
      if (r.pz !== p){ r.pz = p; r.pp.innerHTML = p ? A_PLAY : A_PAUSE; }
      if (r.n.textContent !== r.msg) r.n.textContent = r.msg;
      r.d.classList.add("on"); r.d.classList.toggle("paused", p);
      const w = r.d.offsetWidth, cx = (o.x0 + o.x1) / 2, h = r.d.offsetHeight || 32;   /* sous l'animation s'il y a de la place, sinon au-dessus */
      r.bx = cx - w / 2; r.by = o.y1 + 8 + h <= win.innerHeight - 4 ? o.y1 + 8 : o.y0 >= h + 8 ? o.y0 - h - 6 : Math.max(6, o.y0 + 6);
      place(r);
    });
  }
  function place(r){
    const w = r.d.offsetWidth, h = r.d.offsetHeight || 32;
    r.d.style.left = Math.max(4, Math.min(win.innerWidth - w - 4, r.bx + r.dx)) + "px";
    r.d.style.top = Math.max(4, Math.min(win.innerHeight - h - 4, r.by + r.dy)) + "px";
  }
  doc.__hReset = () => { REC.forEach(r => { r.dx = r.dy = 0; r.held = false; if (r.cur) place(r); }); };
  /* Pause maintenue : certains livres relancent leurs animations (ex. SVG) quand l'état de la page change ; on les remet en pause */
  function enforce(r){
    const o = r.cur; if (!r.held || !o) return;
    o.anims.forEach(a => { if (a.playState === "running"){ try { a.pause(); } catch(e){} } });
    o.svgs.forEach(s => { try { if (s.animationsPaused && !s.animationsPaused()) s.pauseAnimations(); } catch(e){} });
  }
  try { new win.MutationObserver(() => REC.forEach(enforce)).observe(doc.body, { attributes:true, attributeFilter:["class"] }); } catch(e){}
  function toggle(r){
    const o = r.cur; if (!o) return;
    if (paused(o)){ r.held = false; o.anims.forEach(a => { try { a.play(); } catch(e){} }); o.svgs.forEach(s => s.unpauseAnimations && s.unpauseAnimations()); r.msg = ""; }
    else { r.held = true; o.anims.forEach(a => { try { a.pause(); } catch(e){} }); o.svgs.forEach(s => s.pauseAnimations && s.pauseAnimations()); r.msg = "En pause"; }
  }
  function jump(r, dir){
    const o = r.cur, I = o && animInfo(o.anims); if (!I) return;
    r.held = false;
    const { S, D, stops } = I, ref = S.find(a => a.effect.getTiming().duration === D), p = (((ref.currentTime || 0) % D) + D) % D;
    let k = -1; for (let i = 0; i < stops.length; i++) if (Math.abs(stops[i] - p) < 25){ k = i; break; }
    if (k < 0){ k = dir > 0 ? stops.findIndex(x => x > p) : (stops.length - 1 - [...stops].reverse().findIndex(x => x < p)); if (k < 0 || k >= stops.length) k = dir > 0 ? 0 : stops.length - 1; }
    else k = (k + dir + stops.length) % stops.length;
    const M = Math.ceil((S.reduce((m, a) => Math.max(m, a.effect.getTiming().delay || 0), 0) + D) / D) * D;
    S.forEach(a => { a.pause(); a.currentTime = M + stops[k]; });
    o.anims.filter(a => !S.includes(a)).forEach(a => { try { a.play(); } catch(e){} });
    r.msg = (k + 1) + " / " + stops.length;
  }
  const inBox = e => e.target && e.target.closest && e.target.closest(".h-actl");
  ["pointerdown", "mousedown", "mouseup", "pointerup", "touchstart", "touchend", "dblclick", "contextmenu"].forEach(ev => win.addEventListener(ev, e => { if (inBox(e)) e.stopPropagation(); }, true));
  /* Presque transparent quand le curseur est loin (pour ne pas cacher le texte), opaque quand il s'approche */
  let drag = null;
  win.addEventListener("mousemove", e => { if (drag) return; REC.forEach(r => { if (!r.d.classList.contains("on")) return; const q = r.d.getBoundingClientRect();
    const dx = Math.max(q.left - e.clientX, 0, e.clientX - q.right), dy = Math.max(q.top - e.clientY, 0, e.clientY - q.bottom);
    r.d.classList.toggle("near", Math.hypot(dx, dy) < 110); }); }, true);
  win.addEventListener("pointerdown", e => {
    const d = inBox(e); if (!d) return; d.classList.add("near"); clearTimeout(d._t); d._t = setTimeout(() => d.classList.remove("near"), 3000);
    if (e.target.closest("button") || e.button > 0) return;                         /* glisser par la poignée, le fond ou le compteur */
    const r = d._r; drag = { r, sx:e.clientX, sy:e.clientY, dx:r.dx, dy:r.dy }; d.classList.add("drag");
    try { d.setPointerCapture(e.pointerId); } catch(_){} e.preventDefault();
  }, true);
  win.addEventListener("pointermove", e => { if (!drag) return; drag.r.dx = drag.dx + e.clientX - drag.sx; drag.r.dy = drag.dy + e.clientY - drag.sy; place(drag.r); }, true);
  ["pointerup", "pointercancel"].forEach(ev => win.addEventListener(ev, () => { if (!drag) return; drag.r.d.classList.remove("drag"); drag = null; }, true));
  win.addEventListener("click", e => {
    const b = e.target.closest && e.target.closest(".h-actl button"); if (!b) return;
    e.stopPropagation(); e.preventDefault();
    const r = b.closest(".h-actl")._r, a = b.dataset.a;
    if (a === "pp") toggle(r); else jump(r, a === "next" ? 1 : -1);
    try { b.blur(); } catch(_){}
    setTimeout(tick, 30);
  }, true);
  const RIDX = setInterval(() => { try { tick(); } catch(e){} }, 400);
}

function hookKeys(win){
  if (win.__hote) return; win.__hote = true;
  win.addEventListener("keydown", e => {
    if (enSaisie(e.target)) return;   /* l'élève ou l'enseignant écrit dans le livre : aucun raccourci */
    if (toucheTableau(e)){ e.preventDefault(); e.stopImmediatePropagation(); return; }
    if (verrou() && e.key !== "Escape" && !((e.ctrlKey || e.metaKey) && /^[zy]$/i.test(e.key || ""))){ e.preventDefault(); e.stopImmediatePropagation(); return; }
    if (RD.drv && !(e.ctrlKey || e.metaKey || e.altKey)){
      /* Les flèches passent toujours par la bibliothèque : même résultat que les boutons, en simple ou en double page */
      const tag = e.target && e.target.tagName;
      if (e.key === "ArrowRight" || e.key === "PageDown" || (e.key === " " && tag !== "BUTTON" && tag !== "A")){ e.preventDefault(); e.stopImmediatePropagation(); turn(1); return; }
      if (e.key === "ArrowLeft" || e.key === "PageUp"){ e.preventDefault(); e.stopImmediatePropagation(); turn(-1); return; }
    }
    if (e.key === "Escape" || hostKey(e)){ e.preventDefault(); e.stopImmediatePropagation(); if (e.key === "Escape") closeMenu(); }
  }, true);
  brancherSouris(win);
}
