/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — accueil-menage.js (sorti de la page le 15 nov.) */
/* Ménage de l'atelier (9 nov., demande de Jeremy) : cfg.menage = {taches:[{t, d}], mot, min}; cases cochées par occurrence dans localStorage.menageFait */
(() => {
  const DEF = {mot: "atelier", min: 10, equipes: 10, depart: "2026-11-09", taches: [
    {"t": "Balai – Zones principales (ZP)", "d": "Objectif : Assurer la propreté des zones de circulation. · Balayer les allées principales, corridors et zones de passage. · Balayer l’entrée de l’atelier et le seuil des portes. · Retirer les débris visibles (copeaux, poussière, morceaux de tuyaux). · Ramasser la poussière avec la pelle et la jeter aux déchets. · S’assurer que les voies sont dégagées pour la sécurité."},
    {"t": "Moppe – Zones principales (ZP)", "d": "Objectif : Assurer une surface propre et non glissante. · Passer la moppe dans les allées principales. · Essuyer les zones où il y a eu de l’eau, du flux ou des liquides. · Rincer et essorer la moppe, vider et nettoyer le seau. · Laisser les surfaces propres et sécuritaires."},
    {"t": "Balai – Zones secondaires (ZS)", "d": "Objectif : Nettoyer les zones autour des postes de travail. · Balayer autour des établis, comptoirs, machines et postes individuels. · Balayer sous et derrière les établis et les machines. · Retirer les petits débris laissés par les activités pratiques. · S’assurer que le sol autour des postes est propre."},
    {"t": "Moppe – Zones secondaires (ZS)", "d": "Objectif : Compléter le nettoyage des zones secondaires. · Passer la moppe autour des postes, comptoirs et machines. · Nettoyer les petites zones où il y a eu des éclaboussures ou des liquides. · Enlever les taches tenaces au sol (graisse, flux séché). · Laisser les surfaces propres et sécuritaires."},
    {"t": "Surfaces / Comptoirs", "d": "Objectif : Remettre les surfaces de travail en état. · Essuyer établis, tables, comptoirs et machines fixes. · Essuyer les poignées, les interrupteurs et l’extérieur des machines. · Retirer les traces de flux, marqueurs, poussières, copeaux. · Vérifier que les surfaces sont prêtes pour la prochaine période."},
    {"t": "Matériel et outils", "d": "Objectif : Organiser le matériel utilisé pendant la période. · Ranger collets, coudes, joints, vis, adaptateurs, etc. · Faire l’entretien des filières. · Remettre le matériel et les outils dans les bacs ou étagères désignées. · Vérifier qu’aucun outil ne manque."},
    {"t": "Déchets / Recyclage", "d": "Objectif : Vider et organiser les déchets. · Vider les bacs de déchets et de recyclage. · Ramasser les déchets au sol (papier, plastique, métal). · Remplacer les sacs et nettoyer l’extérieur des bacs. · Apporter les sacs pleins à l’endroit prévu. · Remettre les bacs à leur emplacement."},
    {"t": "Nettoyage de la pièce d’entretien", "d": "Objectif : Remettre la pièce d’entretien propre et fonctionnelle. · Ranger les outils, accessoires et produits d’entretien (savon, brosses, nettoyants). · Nettoyer les surfaces (comptoirs, évier, étagères) et essuyer les traces de flux, graisse, eau ou résidus. · Jeter les déchets et résidus dans les bacs appropriés. · Balayer et passer la moppe si nécessaire. · S’assurer que la pièce est dégagée et prête pour le prochain usage."},
    {"t": "Rangement de l’entrepôt", "d": "Objectif : Maintenir l’entrepôt organisé et sécuritaire. · Ranger les boîtes, bacs et contenants déplacés durant la période. · Trier les matériaux laissés sur les tables, au sol ou dans les bacs. · Remettre les matériaux aux étagères désignées. · Jeter les résidus inutilisables (petits morceaux, emballages). · Réorganiser les sections désordonnées (PVC, cuivre, acier, etc.). · Vérifier que les allées sont dégagées et que les items lourds sont rangés de façon sécuritaire."}]};
  let APERCU = null;   /* tâches de l'éditeur montrées en aperçu, pas encore enregistrées */
  /* Ménage par local (12 nov., Jeremy : « assigné par local », seul l'administrateur modifie) :
     locaux.json (publié sur GitHub) = {maj, locaux:[{id, nom, menage}]}; le local de l'appareil = localStorage.accueilLocal (pas synchronisé). */
  let LOC = {maj: 0, locaux: []};
  try { const c = JSON.parse(localStorage.locauxCache || "null"); if (c && c.locaux) LOC = c; } catch(e) {}
  const ADMIN = () => { try { return !!localStorage.ghJeton; } catch(e) { return false; } };
  const monLocal = () => { let id = ""; try { id = localStorage.accueilLocal || ""; } catch(e) {}
    const c = cfg.local && LOC.locaux.find(l => l.id === cfg.local); if (c) return c;   /* 12 nov. : le local choisi dans Préparer le cours passe avant celui de l'appareil */
    return LOC.locaux.find(l => l.id === id) || (LOC.locaux.length === 1 ? LOC.locaux[0] : null); };   /* 12 nov. : un seul local publié → c'est lui (sinon le TNI gardait l'ancienne liste perso à 10 min) */
  window.locauxListe = () => LOC.locaux;
  async function chargerLocaux(){
    try { const r = await fetch("locaux.json?t=" + Date.now(), {cache: "no-store"}); if (!r.ok) return;
      const j = await r.json(); if (j && j.locaux && (j.maj || 0) >= (LOC.maj || 0)) { LOC = j; localStorage.locauxCache = JSON.stringify(j); rendu = ""; try { if (!$("prep").hidden) localChoix(LOCAL_F); } catch(x) {} } } catch(e) {}
  }
  chargerLocaux(); setInterval(chargerLocaux, 10 * 60 * 1000);
  const M = () => { const L = monLocal(); return Object.assign({}, DEF, L ? L.menage : (cfg.menage || {}), APERCU || {}); };
  window.menageReglages = M;
  const norm = x => String(x || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  /* « atelier » reconnu malgré majuscules, accents, s, lettres doublées ou une petite faute (attelier, atlier, ateleir…) */
  const serre = x => norm(x).replace(/[^a-z0-9]+/g, " ").replace(/(.)\1+/g, "$1").trim();
  const ecart = (a, b) => { const d = Array.from({length: b.length + 1}, (_, j) => j);
    for (let i = 1; i <= a.length; i++) { let p = d[0]; d[0] = i;
      for (let j = 1; j <= b.length; j++) { const t = d[j]; d[j] = Math.min(d[j] + 1, d[j - 1] + 1, p + (a[i - 1] === b[j - 1] ? 0 : 1),
        i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1] ? p : 99); p = t; } } return d[b.length]; };
  function contientMot(label, mot){
    const L = serre(label), M0 = serre(mot); if (!M0) return false; if (L.includes(M0)) return true;
    const tol = M0.length >= 5 ? 1 : 0; if (!tol || M0.includes(" ")) return false;
    return L.split(" ").some(w => { w = w.replace(/[sx]$/, ""); return Math.abs(w.length - M0.length) <= 1 && ecart(w, M0) <= tol; });
  }
  window.menageMot = contientMot;
  const el = document.getElementById("menage"), ul = document.getElementById("mnListe");
  const lireFait = () => { try { return JSON.parse(localStorage.menageFait || "{}"); } catch(e) { return {}; } };
  let cle = null, force = false, mini = false, rendu = "";
  /* Rotation des équipes (9 nov., « 10 équipes, rotation 1 fois par semaine, 1 tâche par équipe ») :
     chaque lundi, chaque équipe passe à la tâche suivante; s'il y a plus d'équipes que de tâches, les équipes en trop sont « Renfort ». */
  const lundi = d => { const x = new Date(d); x.setHours(12, 0, 0, 0); x.setDate(x.getDate() - (x.getDay() + 6) % 7); return x; };
  const isoJour = d => { const x = new Date(d); return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); };
  function rotation(m){
    const eq = Math.max(0, +m.equipes || 0), n = m.taches.length, slots = Math.max(eq, n);
    if (!eq) return {eq, slots, equipe: () => null};
    const w = Math.round((lundi(new Date()) - lundi(new Date((m.depart || DEF.depart) + "T12:00"))) / 6048e5);
    return {eq, slots, equipe: s => { const k = ((s - w) % slots + slots) % slots; return k < eq ? k + 1 : null; }};
  }
  function dessiner(){
    const m = M(), F = lireFait()[cle] || [], n = m.taches.length, f = F.filter(i => i < n).length;
    const R = rotation(m);
    const k = JSON.stringify([m.taches, F, cle, m.equipes, m.depart, isoJour(lundi(new Date()))]); if (k === rendu) return; rendu = k;
    const badge = s => { const e = R.equipe(s); return e ? `<span class="mn-eq">Équipe ${e}</span>` : ""; };
    const ouverts = [...ul.querySelectorAll("li.ouvert")].map(li => +li.dataset.i);
    ul.innerHTML = m.taches.map((x, i) => `<li data-i="${i}" class="${F.includes(i) ? "fait" : ""} ${ouverts.includes(i) ? "ouvert" : ""}"><div class="mn-l"><button type="button" class="mn-c" aria-label="Fait">${F.includes(i) ? "✓" : ""}</button><div class="mn-tt">${badge(i)}<button type="button" class="mn-t"></button><span class="mn-aide">Fait ! Va aider les autres</span></div>${x.d ? '<span class="mn-i">détails ▾</span>' : ""}</div><div class="mn-d"></div></li>`).join("")
      + Array.from({length: R.slots - n}, (_, j) => R.equipe(n + j) ? `<li class="renfort"><div class="mn-l"><span class="mn-rf">+</span><div class="mn-tt">${badge(n + j)}<span class="mn-t">Renfort : aide les autres équipes</span></div></div></li>` : "").join("");
    ul.querySelectorAll("li[data-i]").forEach((li, i) => { li.querySelector(".mn-t").textContent = m.taches[i].t; li.querySelector(".mn-d").textContent = String(m.taches[i].d || "").split(/ · /).map((p, j) => j ? "• " + p : p).join("\n"); });
    document.getElementById("mnCompte").textContent = n ? `· ${f}/${n}` : "";
    document.getElementById("mnBarre").style.width = n ? (100 * f / n) + "%" : "0";
    el.classList.toggle("fini", n > 0 && f === n); if (f < n) el.classList.remove("revoir");
    document.getElementById("mnBon").textContent = new Date().getHours() < 14 ? "Bon dîner !" : "Bonne soirée !";
  }
  ul.addEventListener("click", e => {
    const li = e.target.closest("li"); if (!li) return; const i = +li.dataset.i;
    if (e.target.closest(".mn-c")) { const T = lireFait(), F = T[cle] || []; T[cle] = F.includes(i) ? F.filter(x => x !== i) : F.concat(i);
      for (const k in T) if (k.slice(0, 10) < new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10)) delete T[k];
      try { localStorage.menageFait = JSON.stringify(T); } catch(x) {} rendu = ""; dessiner();
      const n = M().taches.length, f = (T[cle] || []).filter(x => x < n).length;
      if (T[cle].includes(i) && n > 0 && f === n) sonMenage(true);
      if (T[cle].includes(i) && f < n) { const t = document.getElementById("mnAideT"); t.classList.remove("on"); void t.offsetWidth; t.classList.add("on"); } }
    else if (e.target.closest(".mn-t, .mn-i")) li.classList.toggle("ouvert");
  });
  /* 13 nov. (« un son motivant à la fin du ménage ») : marimba quand tout est coché */
  let AC = null;
  function sonMenage(fin){ try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === "suspended") AC.resume();
    const t0 = AC.currentTime + .02, out = AC.createGain(); out.gain.value = .5; out.connect(AC.destination);
    const note = (f, t, d, v, type) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = type || "triangle"; o.frequency.value = f;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .015); g.gain.exponentialRampToValueAtTime(.001, t + d);
      o.connect(g); g.connect(out); o.start(t); o.stop(t + d + .05); };
    const dl = AC.createDelay(), fb = AC.createGain(), w = AC.createGain(); dl.delayTime.value = .23; fb.gain.value = .32; w.gain.value = .35;   /* léger écho */
    out.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(w); w.connect(AC.destination);
    [[523.3, 0], [659.3, .13], [784, .26], [1046.5, .42]].forEach(([f, d]) => { note(f, t0 + d, .6, .45, "sine"); note(f * 4, t0 + d, .08, .12, "sine"); });   /* marimba (choix 3 de Jeremy) */
  } catch(x) {} }
  let actifVu = false;
  document.getElementById("mnMini").onclick = e => { e.stopPropagation(); if (force && !actifVu) { force = false; montrer(false); if (APERCU) { APERCU = null; rendu = ""; ed.hidden = false; } return; } mini = true; el.classList.add("mini"); };
  el.addEventListener("click", () => { if (mini) { mini = false; el.classList.remove("mini"); } });
  function montrer(on){
    document.documentElement.classList.toggle("mn-plein", !!on);
    if (on && el.hidden) { el.style.transition = "none"; el.hidden = false; el.classList.add("on"); void el.offsetHeight; el.style.transition = ""; }   /* ouverture nette, sans fondu (le fondu montrait l'accueil à travers, sur le tableau) */
    else if (!on && !el.hidden) { el.style.transition = "none"; el.classList.remove("on"); el.hidden = true; void el.offsetHeight; el.style.transition = ""; }   /* fermeture nette : le fondu laissait un fantôme du ménage sur le tableau (vidéo du 10 nov.) */
  }
  function verifier(){
    const m = M(), now = new Date(), nowMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    let actif = null;
    try { const ps = periods(), cur = ps.find(p => nowMin >= p.start && nowMin < p.end);
      if (cur) { const rows = timeline(cur.start, cfg.steps), z = zoneMenage(rows).find(z => nowMin >= z.start && nowMin < z.end);
        if (z) actif = rows[z.i]; } } catch(e) {}   /* 12 nov. : zones partagées avec la frise (local « Atelier » = fin du cours) */
    const jour = now.toISOString().slice(0, 10);
    /* 16 nov. : l'heure du ménage arrive pendant qu'un livre, le tableau blanc ou un autre outil est ouvert dans la bibliothèque → on le dit à la bibliothèque, qui ramène l'accueil de classe par-dessus */
    if (actif && !actifVu && window.parent !== window && !document.documentElement.classList.contains("apercu-mode") && sessionStorage.menageFerme !== jour + "|" + Math.round(actif.start)) { try { window.parent.postMessage({ type:"accueil-menage" }, "*"); } catch(e){} }
    actifVu = !!actif; document.getElementById("mnMini").textContent = force && !actif ? "✕" : "–"; el.classList.toggle("apercu", !!(force && !actif));
    if (actif) { cle = jour + "|" + Math.round(actif.start); force = false;
      if (sessionStorage.menageFerme === cle) { montrer(false); return; } }
    else if (force) cle = cle || jour + "|manuel";
    if (actif || force) {
      const reste = actif ? actif.end - nowMin : (window.menageReste ?? m.min / 2);
      const u = Math.max(0, Math.min(1, 1 - reste / m.min));
      el.style.setProperty("--u", u.toFixed(3)); el.style.setProperty("--vit", (2.6 - 2.2 * u).toFixed(2) + "s");
      el.classList.toggle("presse", reste <= Math.min(3, m.min / 2));
      const mn = Math.max(0, Math.ceil(reste));
      FIN_MN = Date.now() + reste * 60000; majReste();   /* 12 nov. : minutes et secondes qui descendent (mises à jour chaque seconde) */
      dessiner(); montrer(true); } else montrer(false);
  }
  let FIN_MN = 0;
  function majReste(){ const e = document.getElementById("mnReste"); if (!e || el.hidden || !FIN_MN) return;
    const t = Math.max(0, Math.ceil((FIN_MN - Date.now()) / 1000)); e.textContent = Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0"); }
  setInterval(majReste, 250);
  setInterval(verifier, 2000); setTimeout(verifier, 1500);
  // Modifier la liste (Plus → Ménage de l'atelier)
  const ed = document.getElementById("menageEd");
  document.getElementById("b-menage").onclick = () => { closeMenu(); chargerLocaux().then(() => { if (!ed.hidden) { remplirLoc(); } }); remplirLoc(); remplirTout(); ed.hidden = false; };
  function remplirTout(){ const m = M();
    remplirEd(m.taches);
    { const sel = document.getElementById("mnMin"); if (![...sel.options].some(o => +o.value === +m.min)) sel.add(new Option(m.min + " minutes", m.min)); sel.value = String(m.min); } document.getElementById("mnMot").value = m.mot;
    document.getElementById("mnEq").value = String(m.equipes || 0); DEPART = m.depart || DEF.depart; majRotTxt(); majLecture(); }
  const SEL = document.getElementById("mnLoc"), TXT = document.getElementById("mnLocTxt");
  function remplirLoc(){
    const id = (monLocal() || {}).id || "";
    SEL.innerHTML = '<option value="">Aucun local (liste personnelle)</option>' + LOC.locaux.map(l => '<option></option>').join("");
    LOC.locaux.forEach((l, i) => { const o = SEL.options[i + 1]; o.value = l.id; o.textContent = l.nom; });
    SEL.value = id; document.querySelector("#menageEd .mt-loc").classList.toggle("sansadmin", !ADMIN());
    document.getElementById("mnLocR").hidden = !id;
  }
  function majLecture(){
    const L = monLocal(), lect = !!L && !ADMIN();
    ed.classList.toggle("lecture", lect);
    ed.querySelectorAll("#mnListeEd input, #mnListeEd textarea, #mnMin, #mnMot, #mnEq").forEach(x => x.disabled = lect);
    TXT.textContent = L ? (ADMIN() ? "Tous les tableaux de ce local ont cette liste. « Enregistrer » la publie pour tout le monde." : "Les tâches de ce local sont gérées par l'administrateur. Tous les enseignants de ce local ont la même liste.")
      : (LOC.locaux.length ? "Choisis le local où se trouve ce tableau : tous ses enseignants auront la même liste." : (ADMIN() ? "Crée un local : la liste ci-dessous lui sera donnée." : "Aucun local n'a encore été créé par l'administrateur."));
  }
  SEL.onchange = () => { try { if (SEL.value) localStorage.accueilLocal = SEL.value; else localStorage.removeItem("accueilLocal"); } catch(e) {}
    rendu = ""; remplirLoc(); remplirTout(); verifier(); };
  const idDe = nom => (nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "local") + "-" + Math.random().toString(36).slice(2, 6);
  document.getElementById("mnLocN").onclick = () => { if (!ADMIN()) return;
    const nom = (prompt("Nom du local (ex. : Atelier de plomberie, local 105)") || "").trim(); if (!nom) return;
    const L = {id: idDe(nom), nom, menage: lireMenage()}; LOC.locaux.push(L);
    try { localStorage.accueilLocal = L.id; } catch(e) {} remplirLoc(); majLecture();
    TXT.textContent = "Local « " + nom + " » créé avec la liste ci-dessous. Touche « Enregistrer » pour le publier."; };
  document.getElementById("mnLocR").onclick = () => { const L = monLocal(); if (!L || !ADMIN()) return;
    const nom = (prompt("Nouveau nom du local", L.nom) || "").trim(); if (!nom) return; L.nom = nom; remplirLoc();
    TXT.textContent = "Touche « Enregistrer » pour publier le nouveau nom."; };
  const DEPOT = "cfppaplc/bibliotheque";
  async function publierLocaux(){
    const jeton = localStorage.ghJeton; LOC.maj = Date.now();
    const texte = JSON.stringify(LOC, null, 1) + "\n"; localStorage.locauxCache = JSON.stringify(LOC);
    const url = "https://api.github.com/repos/" + DEPOT + "/contents/locaux.json", h = {Authorization: "Bearer " + jeton, Accept: "application/vnd.github+json"};
    let sha; const g = await fetch(url, {headers: h, cache: "no-store"}); if (g.ok) sha = (await g.json()).sha; else if (g.status !== 404) throw new Error("GitHub " + g.status);
    const b64 = btoa(unescape(encodeURIComponent(texte)));
    const p = await fetch(url, {method: "PUT", headers: Object.assign({"Content-Type": "application/json"}, h), body: JSON.stringify({message: "Ménage : locaux et tâches", content: b64, sha})});
    if (!p.ok) throw new Error("GitHub " + p.status);
  }
  let DEPART = DEF.depart;
  function majRotTxt(){ const R = rotation({taches: lireEd(), equipes: +document.getElementById("mnEq").value, depart: DEPART});
    document.getElementById("mnRotTxt").textContent = R.eq ? "Cette semaine : l'équipe 1 fait « " + ((lireEd()[[...Array(R.slots).keys()].find(s => R.equipe(s) === 1)] || {}).t || "Renfort") + " »." : ""; }
  document.getElementById("mnEq").onchange = majRotTxt;
  document.getElementById("mnRot").onclick = () => { DEPART = isoJour(lundi(new Date())); majRotTxt(); };
  const fermerEd = () => { ed.hidden = true; };
  const LE = document.getElementById("mnListeEd");
  function remplirEd(taches){
    LE.innerHTML = "";
    taches.forEach(x => ajouterEd(x));
  }
  function ajouterEd(x){
    const r = document.createElement("div"); r.className = "mt-r";
    r.className = "mt-r field";
    r.innerHTML = '<span class="mt-n"></span><input class="mt-t" placeholder="Nom de la tâche"><div class="mt-b"><button type="button" class="btn" data-m="h" title="Monter">▲</button><button type="button" class="btn" data-m="b" title="Descendre">▼</button><button type="button" class="btn" data-m="x" title="Retirer">✕</button></div><textarea placeholder="Une étape par ligne (facultatif)"></textarea>';
    r.querySelector(".mt-t").value = x.t || "";
    r.querySelector("textarea").value = String(x.d || "").split(/ · /).join("\n");
    LE.appendChild(r); numeroter(); return r;
  }
  const numeroter = () => LE.querySelectorAll(".mt-n").forEach((n, i) => n.textContent = i + 1);
  LE.addEventListener("click", e => { const b = e.target.closest("[data-m]"); if (!b) return; const r = b.closest(".mt-r");
    if (b.dataset.m === "x") r.remove(); else if (b.dataset.m === "h" && r.previousElementSibling) LE.insertBefore(r, r.previousElementSibling);
    else if (b.dataset.m === "b" && r.nextElementSibling) LE.insertBefore(r.nextElementSibling, r); numeroter(); });
  document.getElementById("mnAjout").onclick = () => { const r = ajouterEd({}); r.scrollIntoView({block: "nearest"}); r.querySelector(".mt-t").focus(); };
  document.getElementById("mnDef").onclick = () => remplirEd(DEF.taches);
  document.getElementById("mnAnn").onclick = fermerEd;
  document.getElementById("mnOk").onclick = () => {
    APERCU = null; const L = monLocal();
    if (L) { if (!ADMIN()) return; L.menage = lireMenage(); const b = document.getElementById("mnOk"); b.disabled = true; TXT.textContent = "Publication…";
      publierLocaux().then(() => { rendu = ""; fermerEd(); verifier(); }).catch(e => { TXT.textContent = "La publication n'a pas fonctionné (" + e.message + "). Réessaie dans un moment."; }).finally(() => { b.disabled = false; }); return; }
    cfg.menage = lireMenage();
    save(); rendu = ""; fermerEd(); verifier(); };
  function lireMenage(){ return {taches: lireEd(), equipes: +document.getElementById("mnEq").value, depart: DEPART, mot: document.getElementById("mnMot").value.trim() || "atelier", min: Math.max(1, Math.min(60, +document.getElementById("mnMin").value || 10))}; }
  const lireEd = () => [...document.querySelectorAll("#mnListeEd .mt-r")].map(r => ({t: r.querySelector(".mt-t").value.trim(),
      d: r.querySelector("textarea").value.split("\n").map(l => l.replace(/^[•\-*]\s*/, "").trim()).filter(Boolean).join(" · ")})).filter(x => x.t);
  document.getElementById("mnVoir").onclick = () => { APERCU = {taches: lireEd(), equipes: +document.getElementById("mnEq").value, depart: DEPART}; rendu = ""; if (window.menageReste == null) window.menageReste = 2.5; fermerEd(); force = true; cle = new Date().toISOString().slice(0, 10) + "|manuel"; mini = false; el.classList.remove("mini"); verifier(); };
  if (/[?&]menage=1/.test(location.search)) setTimeout(() => document.getElementById("b-menage").click(), 800);
  document.getElementById("b-menageReg").onclick = () => { document.getElementById("b-cancel").click(); document.getElementById("b-menage").click(); };
  /* Fermeture secrète (9 nov., Jeremy) : garder le doigt 3 s sur le titre « Ménage de l'atelier » → fermé pour cette fois (onglet en cours) */
  { const h = el.querySelector(".mn-tete h2"); let tm = null;
    const fin = () => { clearTimeout(tm); tm = null; };
    h.addEventListener("pointerdown", () => { fin(); tm = setTimeout(() => { tm = null;
      if (actifVu) sessionStorage.menageFerme = cle; force = false;
      if (APERCU) { APERCU = null; rendu = ""; ed.hidden = false; } montrer(false); }, 3000); });
    ["pointerup", "pointerleave", "pointercancel"].forEach(t => h.addEventListener(t, fin));
    h.addEventListener("contextmenu", e => e.preventDefault()); h.style.userSelect = "none"; h.style.webkitUserSelect = "none"; }
  document.getElementById("mnRevoir").onclick = () => el.classList.add("revoir");
  window.menageTest = verifier;
})();
