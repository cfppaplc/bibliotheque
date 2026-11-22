/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — loup-garou.js (21 nov.)
   Le Loup-Garou de la communication (livre Communiquer, annexe D) joué avec les cellulaires.
   Le TNI (l'enseignant narrateur) est l'autorité : il garde la partie, distribue les rôles et envoie à chaque
   cellulaire SA vue (message {m:"v", pid, v}); rien de secret ne s'affiche au tableau.
   Cellulaire → TNI : ici (entrer), ch (choix d'une étape), vie. TNI → cellulaires : v, pouls.
   Loi 25 : un seul mot (prénom ou surnom), rien n'est gardé après la partie. */
(function(){
"use strict";
const SB_URL = "https://kjlotlhqrgekzohshmbn.supabase.co", SB_CLE = "sb_publishable_1C-o-75sf7havBRmUWA8aQ_gcEW4sRY", PREF = "pda-lg-";
const $ = id => document.getElementById(id);
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"})[c]);
const surnom = v => String(v || "").trim().split(/\s+/)[0].replace(/[^\p{L}\p{N}'_-]/gu, "").slice(0, 14);
const melanger = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const params = new URLSearchParams(location.search);

/* ---------- Relais : Supabase Realtime (broadcast); BroadcastChannel pour les essais sur localhost ---------- */
function relais(topic, quand, etat){
  const sortie = []; let envoi = () => {}, pompe = null;
  const send = o => { sortie.push(o); if (!pompe) pompe = setInterval(() => { const o2 = sortie.shift(); if (!o2) { clearInterval(pompe); pompe = null; return; } envoi(o2); }, 45); };
  if (window.supabase && window.supabase.createClient) {
    const sb = window.supabase.createClient(SB_URL, SB_CLE, {realtime: {params: {eventsPerSecond: 40}}});
    let ch = null, pret = false, gen = 0, attente = [], reT = null, cache = 0;
    envoi = o => { if (!pret) { attente.push(o); return; } ch.send({type: "broadcast", event: "m", payload: o}).catch(() => {}); };
    const abonner = () => { const g = ++gen; clearTimeout(reT); reT = null; if (ch) { try { sb.removeChannel(ch); } catch(e) {} } pret = false;
      ch = sb.channel(topic, {config: {broadcast: {self: false}}});
      ch.on("broadcast", {event: "m"}, ({payload}) => { try { quand(payload); } catch(e) { console.error(e); } });
      ch.subscribe(st => { if (g !== gen) return; pret = st === "SUBSCRIBED";
        if (pret) { const a = attente; attente = []; a.forEach(envoi); } else if (!reT) reT = setTimeout(abonner, 2000); etat(pret); }); };
    document.addEventListener("visibilitychange", () => { if (document.hidden) { cache = Date.now(); return; } if (!pret || (cache && Date.now() - cache > 15000)) abonner(); });
    addEventListener("online", abonner);
    abonner(); return {send, rebrancher: abonner};
  }
  if (window.BroadcastChannel && /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
    const bc = new BroadcastChannel(topic); bc.onmessage = e => { try { quand(e.data); } catch(x) { console.error(x); } };
    envoi = o => bc.postMessage(o); setTimeout(() => etat(true), 30); return {send, rebrancher(){}};
  }
  setTimeout(() => etat(false), 30); return {send, rebrancher(){}};
}

/* ---------- Rôles et script du narrateur (repris du livre) ---------- */
const ROLES = {
  loup: {n: "Loup-garou", art: "un loup-garou", camp: "loups", d: "La nuit, avec les autres loups, tu choisis une victime sur ton cellulaire. Le jour, tu fais semblant d'être un villageois."},
  villageois: {n: "Villageois", art: "un villageois", camp: "village", d: "Aucun pouvoir, sauf ta parole et ton vote. Démasque les loups pendant le débat."},
  voyante: {n: "Voyante", art: "la voyante", camp: "village", d: "Chaque nuit, tu choisis un joueur et tu vois sa carte. Aide le village… sans te faire repérer."},
  sorciere: {n: "Sorcière", art: "la sorcière", camp: "village", d: "Deux potions pour la partie : une pour sauver la victime de la nuit, une pour éliminer un joueur."},
  chasseur: {n: "Chasseur", art: "le chasseur", camp: "village", d: "Si tu es éliminé, tu désignes tout de suite un joueur qui est éliminé avec toi."},
  cupidon: {n: "Cupidon", art: "Cupidon", camp: "village", d: "La 1re nuit, tu désignes deux amoureux. Si l'un est éliminé, l'autre meurt de chagrin."},
  corbeau: {n: "Corbeau", art: "le corbeau", camp: "village", d: "Chaque nuit, tu désignes un joueur : il commence le vote du jour avec 2 voix contre lui."},
  renard: {n: "Renard", art: "le renard", camp: "village", d: "Chaque nuit, tu flaires 3 joueurs. S'il n'y a aucun loup parmi eux, tu perds ton flair."},
  petite: {n: "Petite fille", art: "la petite fille", camp: "village", d: "Pendant que les loups choisissent, tu peux entrouvrir les yeux une fois par nuit. Si tu te fais prendre, tu deviens leur victime."}
};
const SPECIAUX = ["voyante", "sorciere", "chasseur", "cupidon", "corbeau", "renard", "petite"];
const ROLE_PH = {cupidon: "cupidon", voyante: "voyante", renard: "renard", loups: "loup", sorciere: "sorciere", corbeau: "corbeau"};
const NUIT = ["cupidon", "voyante", "renard", "loups", "sorciere", "corbeau"];
const NOM_PH = {lobby: "Avant la partie", cartes: "Les cartes", nuit: "La nuit tombe", cupidon: "Cupidon", voyante: "La voyante", renard: "Le renard", loups: "Les loups-garous",
  sorciere: "La sorcière", corbeau: "Le corbeau", aube: "Le lever du jour", debat: "Le débat du village", vote: "Le vote", verdict: "Le verdict", chasseur: "Le chasseur", fin: "Fin de la partie"};
const TXT = {
  cartes: ["Il était une fois un village tranquille, au bord d'une forêt sombre : Val-des-Brumes. Ses habitants travaillaient le jour et dormaient la nuit… Mais depuis quelque temps, des choses étranges se passent. Des hurlements. Des traces dans la neige. Certains disent que des loups-garous se cachent parmi nous. Ce soir, le village doit découvrir la vérité.",
    "Chaque élève garde le doigt sur sa carte pour voir son rôle, sans la montrer."],
  nuit: ["Le soleil se couche sur Val-des-Brumes. Le village s'endort. Baissez la tête vers votre cellulaire…", "Tamise la lumière, lance la musique. Tout le monde garde les yeux sur son propre écran."],
  cupidon: ["Cupidon se réveille. Il désigne deux personnes qui tomberont éperdument amoureuses… Les amoureux découvriront leur secret sur leur écran.", "Attends le signal Prêt, puis passe à l'étape suivante."],
  voyante: ["La voyante se réveille. Désigne la personne dont tu veux connaître le secret…", "Son cellulaire lui montre la carte. Attends le signal Prêt."],
  renard: ["La voyante se rendort. Le renard se réveille. Il flaire trois voisins…", "Son cellulaire lui dit s'il y a un loup parmi les trois."],
  loups: ["Le renard se rendort. La forêt s'agite… Les loups-garous se réveillent. Ils se reconnaissent et choisissent en silence leur victime de la nuit.", "La petite fille peut tenter d'espionner sur son cellulaire. Si elle se fait prendre, elle devient la victime."],
  sorciere: ["Les loups-garous, repus, retournent dans l'ombre. La sorcière se réveille. Cette nuit, voici la victime des loups…", "Elle choisit sur son cellulaire : potion de vie, potion de mort, ou rien."],
  corbeau: ["La sorcière se rendort. Le corbeau se réveille. Il désigne celui qu'il soupçonne…", "Attends le signal Prêt, puis fais lever le jour."],
  debat: ["Habitants de Val-des-Brumes, les loups-garous sont parmi vous. Vous avez cinq minutes pour les démasquer. Et souvenez-vous des règles du conseil : on reformule avant d'accuser, on parle de faits, et on laisse l'accusé se défendre.",
    "Donne la parole. Si quelqu'un accuse sans reformuler : « Le conseil n'a pas compris. Reformule d'abord ce que l'autre a dit. » Si le ton monte : « Le village gronde… Respirez. Une personne à la fois. »"],
  vote: ["Le temps est écoulé. Votez maintenant sur votre cellulaire pour la personne que vous voulez chasser du village.", "Quand tout le monde a voté, passe à l'étape suivante pour révéler le verdict."],
  chasseur: ["Le chasseur, dans un dernier souffle, lève son arme… Qui emportes-tu avec toi?", "Le chasseur choisit sur son cellulaire."]
};
const REGLES = ["Reformule avant d'accuser", "Un fait, pas une impression", "Le message « je »", "Un à la fois : lève la main", "Accusé? 30 secondes, voix posée"];


/* ---------- Emblèmes (SVG simples, couleur du texte) et décor ciel / forêt / village ---------- */
const EMB = {
  loup: '<path d="M10 6l13 15h18L54 6l-2 26c0 13-9 24-20 24S12 45 12 32z" fill="currentColor"/><path d="M22 33l7 3-7 2zM42 33l-7 3 7 2z" fill="#0C1322"/><path d="M27 46h10l-5 6z" fill="#0C1322"/>',
  villageois: '<path d="M8 30L32 10l24 20v26H8z" fill="currentColor"/><path d="M27 56V40h10v16z" fill="#0C1322"/><path d="M14 36h8v7h-8zM42 36h8v7h-8z" fill="#0C1322" opacity=".6"/>',
  voyante: '<path d="M4 32C14 16 50 16 60 32 50 48 14 48 4 32z" fill="currentColor"/><circle cx="32" cy="32" r="10" fill="#0C1322"/><circle cx="35" cy="29" r="3" fill="currentColor"/>',
  sorciere: '<path d="M25 6h14v5h-2v12l13 22a8 8 0 0 1-7 12H21a8 8 0 0 1-7-12l13-22V11h-2z" fill="currentColor"/><path d="M19 44h26l3 6a3 3 0 0 1-3 4H19a3 3 0 0 1-3-4z" fill="#0C1322" opacity=".45"/>',
  chasseur: '<circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="32" cy="32" r="11" fill="none" stroke="currentColor" stroke-width="5"/><path d="M32 2v18M32 44v18M2 32h18M44 32h18" stroke="currentColor" stroke-width="5"/>',
  cupidon: '<path d="M32 56S8 42 8 24a12 12 0 0 1 24-4 12 12 0 0 1 24 4c0 18-24 32-24 32z" fill="currentColor"/><path d="M6 58L54 10M46 10h8v8" stroke="#0C1322" stroke-width="4" fill="none"/>',
  corbeau: '<path d="M50 6C24 10 12 30 14 54l8-8c0-8 4-14 10-18-4 6-6 12-6 18 14-4 24-22 24-40z" fill="currentColor"/><path d="M14 54L8 60" stroke="currentColor" stroke-width="4"/>',
  renard: '<path d="M6 8l16 13h20L58 8l-4 24-22 26L10 32z" fill="currentColor"/><path d="M32 58L22 40h20z" fill="#0C1322" opacity=".35"/><circle cx="24" cy="31" r="3" fill="#0C1322"/><circle cx="40" cy="31" r="3" fill="#0C1322"/>',
  petite: '<circle cx="32" cy="20" r="12" fill="currentColor"/><path d="M20 18c-6 4-8 12-4 18M44 18c6 4 8 12 4 18" stroke="currentColor" stroke-width="4" fill="none"/><path d="M32 34l16 26H16z" fill="currentColor"/>',
  nuit: '<path d="M40 6a26 26 0 1 0 18 40A22 22 0 0 1 40 6z" fill="currentColor"/>',
  jour: '<circle cx="32" cy="32" r="13" fill="currentColor"/><g stroke="currentColor" stroke-width="4" stroke-linecap="round"><path d="M32 4v8M32 52v8M4 32h8M52 32h8M12 12l6 6M46 46l6 6M12 52l6-6M46 18l6-6"/></g>',
  debat: '<path d="M6 10h34v22H20l-8 8v-8H6z" fill="currentColor"/><path d="M26 30h32v20h-6v8l-8-8H26z" fill="currentColor" opacity=".55"/>',
  vote: '<path d="M8 30h48v26H8z" fill="currentColor"/><path d="M22 34h20" stroke="#0C1322" stroke-width="4"/><path d="M20 8h24v20H20z" fill="currentColor" opacity=".6"/>'
};
const emb = (k, cls) => `<svg class="${cls || "emb"}" viewBox="0 0 64 64" aria-hidden="true">${EMB[k] || EMB.nuit}</svg>`;
const EMB_PH = {lobby: "nuit", cartes: "nuit", nuit: "nuit", cupidon: "cupidon", voyante: "voyante", renard: "renard", loups: "loup", sorciere: "sorciere", corbeau: "corbeau", aube: "jour", debat: "debat", vote: "vote", verdict: "vote", chasseur: "chasseur", fin: "jour"};
const FORET = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 160" preserveAspectRatio="none"><path fill="#05080F" d="M0 160V96l30-50 30 50 22-70 24 70 30-44 28 44 26-80 26 80 30-56 26 56 24-66 28 66 30-40 26 40 28-74 28 74 24-50 30 50 26-84 26 84 30-46 28 46 24-62 28 62 30-52 26 52 28-76 28 76 26-44 30 44 24-66 26 66 28-50 30 50 26-80 28 80 24-48 30 48 26-60 28 60 30-46 26 46 28-72 28 72 24-40 26 40V160z"/></svg>');
const VILLAGE = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 140" preserveAspectRatio="none"><path fill="#D9C7A8" d="M0 140V90l60-40 60 40v-20l50-36 50 36V90h40l70-54 70 54V70l40-30 40 30v30h60l60-46 60 46v-24l50-36 50 36v34h50l60-50 60 50v-16l40-28 40 28v86z"/><path fill="#E6D8BE" d="M0 140v-26h1200v26z"/></svg>');
function decor(){ if (document.querySelector(".ciel")) return;
  document.body.insertAdjacentHTML("afterbegin", `<div class="ciel ciel-n" aria-hidden="true"><i class="etoiles"></i><i class="lune"></i><i class="sol" style="background-image:url('${FORET}')"></i></div>
    <div class="ciel ciel-j" aria-hidden="true"><i class="soleil"></i><i class="sol" style="background-image:url('${VILLAGE}')"></i></div>`); }

/* =================================== TNI : l'enseignant narrateur =================================== */
function animateur(){
  document.body.className = "tni"; decor();
  let G = null; try { const s = JSON.parse(localStorage.getItem("lgPartie")); if (s && s.code && Date.now() - (s.maj || 0) < 4 * 3600e3) G = s; } catch(e) {}
  if (!G) G = nouvelle();
  function nouvelle(J){ return {code: String(Math.floor(100000 + Math.random() * 900000)), ph: "lobby", J: J || {}, nuit: 0, compo: null, enJeu: [], potVie: true, potMort: true, flair: true,
    amour: [], ch: {}, res: {}, vic: null, sauve: false, tueSorc: null, plume: null, petite: null, annonce: [], egal: false, chasseur: null, tire: false, apres: null, gagnant: null, t0: 0, faux: 0}; }
  const sauver = () => { G.maj = Date.now(); try { localStorage.setItem("lgPartie", JSON.stringify(G)); } catch(e) {} };
  const nomDe = p => G.J[p] ? G.J[p].nom : "?";
  const vivants = () => Object.keys(G.J).filter(p => G.J[p].vivant);
  let relOk = null; const relAff = () => { const e = $("lgRel"); if (e) { e.textContent = relOk ? "Relais connecté" : relOk === false ? "Relais injoignable…" : "Connexion…"; e.className = relOk ? "ok" : "ko"; } };
  const R = relais(PREF + G.code, recevoir, ok => { relOk = ok; relAff(); });

  /* --- composition : environ 1 loup sur 5, puis des rôles spéciaux (20 joueurs = 4 loups, 7 rôles, 9 villageois) --- */
  function compoAuto(n){ const l = Math.max(1, Math.round(n / 5)); return {loups: l, sp: SPECIAUX.slice(0, Math.max(0, Math.min(7, Math.floor((n - l) * .45)))), auto: true}; }
  function compo(){ const n = Object.keys(G.J).length; if (!G.compo || G.compo.auto) G.compo = compoAuto(n);
    const c = G.compo; c.loups = Math.max(1, Math.min(c.loups, Math.max(1, Math.floor((n - 1) / 2)))); while (c.loups + c.sp.length > n && c.sp.length) c.sp.pop(); return c; }
  function distribuer(){ const ps = melanger(Object.keys(G.J)), c = compo(), roles = [];
    for (let i = 0; i < c.loups; i++) roles.push("loup"); c.sp.forEach(r => roles.push(r)); while (roles.length < ps.length) roles.push("villageois");
    ps.forEach((p, i) => { G.J[p].role = roles[i]; G.J[p].vivant = true; }); G.enJeu = c.sp.slice(); }

  /* --- étapes --- */
  function acteurs(ph){ const r = ROLE_PH[ph];
    if (r) { let a = vivants().filter(p => G.J[p].role === r); if (ph === "renard" && !G.flair) a = []; if (ph === "sorciere" && !G.potVie && !G.potMort) a = []; return a; }
    if (ph === "vote") return vivants(); if (ph === "chasseur") return [G.chasseur]; return null; }
  function pret(){ const a = acteurs(G.ph); if (!a) return true; if (!a.length) return Date.now() >= G.faux;
    if (G.ph === "sorciere") return a.every(p => G.ch[p] === "fin"); return a.every(p => G.ch[p] != null); }
  function aller(ph){ G.ph = ph; G.ch = {}; G.t0 = Date.now(); G.faux = Date.now() + 5000 + Math.random() * 6000;   /* rôle mort : « Prêt » arrive quand même, pour ne rien trahir */
    sauver(); rendre(); pousser(); }
  function prochaineNuit(apres){ const i = apres === "nuit" ? 0 : NUIT.indexOf(apres) + 1;
    for (let k = i; k < NUIT.length; k++) { const ph = NUIT[k], r = ROLE_PH[ph]; if (ph === "cupidon" && G.nuit !== 1) continue; if (r === "loup" || G.enJeu.includes(r)) return ph; }
    return "aube"; }
  function tuer(liste){ const morts = []; const un = p => { if (!p || !G.J[p] || !G.J[p].vivant) return; G.J[p].vivant = false; morts.push(p);
      if (G.amour.includes(p)) un(G.amour.find(x => x !== p)); }; liste.forEach(un);
    if (!G.tire) { const c = morts.find(p => G.J[p].role === "chasseur"); if (c) G.chasseur = c; } return morts; }
  function gagnant(){ const v = vivants(), l = v.filter(p => G.J[p].role === "loup").length; if (!l) return "village"; if (l >= v.length - l) return "loups"; return null; }
  function apresMorts(suite){ if (G.chasseur && !G.tire) { G.apres = suite; return aller("chasseur"); } continuer(suite); }
  function continuer(suite){ const g = gagnant(); if (g) { G.gagnant = g; return aller("fin"); }
    if (suite === "nuit") { G.nuit++; G.petite = null; G.res = {}; } aller(suite); }
  function resoudre(ph){
    if (ph === "cupidon") { const c = acteurs("cupidon")[0]; if (c && G.ch[c] && G.ch[c].length === 2) G.amour = G.ch[c]; }
    if (ph === "loups") { const T = {}; acteurs("loups").forEach(p => { const t = G.ch[p]; if (t) T[t] = (T[t] || 0) + 1; });
      const max = Math.max(0, ...Object.values(T)), top = Object.keys(T).filter(t => T[t] === max); G.vic = top.length ? melanger(top)[0] : null;
      if (G.petite && G.petite.pris && G.J[G.petite.pid].vivant) G.vic = G.petite.pid; }
  }
  function suivante(){
    const ph = G.ph;
    if (ph === "lobby") { if (Object.keys(G.J).length < 5) return; distribuer(); return aller("cartes"); }
    if (ph === "cartes") { G.nuit = 1; G.res = {}; return aller("nuit"); }
    if (ph === "nuit") return aller(prochaineNuit("nuit"));
    if (NUIT.includes(ph)) { resoudre(ph); const n = prochaineNuit(ph); if (n === "aube") leverJour(); return aller(n); }
    if (ph === "aube") return apresMorts("debat");
    if (ph === "debat") return aller("vote");
    if (ph === "vote") { verdict(); return aller("verdict"); }
    if (ph === "verdict") return apresMorts("nuit");
    if (ph === "chasseur") { G.tire = true; const t = G.ch[G.chasseur]; const m = t ? tuer([t]) : []; G.annonce = G.annonce.concat(m); G.tirMorts = m; const s = G.apres; G.apres = null; return continuer(s); }
  }
  function leverJour(){ const l = []; if (G.vic && !G.sauve) l.push(G.vic); if (G.tueSorc) l.push(G.tueSorc);
    G.sauveCetteNuit = !!(G.vic && G.sauve); G.annonce = tuer(l); G.plumeJour = G.plume && G.J[G.plume] && G.J[G.plume].vivant ? G.plume : null;
    G.vic = null; G.sauve = false; G.tueSorc = null; G.plume = null; G.tirMorts = []; }
  function verdict(){ const T = {}; vivants().forEach(p => { const t = G.ch[p]; if (t) T[t] = (T[t] || 0) + 1; }); if (G.plumeJour) T[G.plumeJour] = (T[G.plumeJour] || 0) + 2;
    G.votes = T; const max = Math.max(0, ...Object.values(T)), top = Object.keys(T).filter(t => T[t] === max);
    G.egal = top.length !== 1; G.annonce = G.egal ? [] : tuer([top[0]]); G.tirMorts = []; G.plumeJour = null; }

  /* --- messages des cellulaires --- */
  function recevoir(m){
    if (!m || !m.pid) return;
    if (m.m === "ici") { const nom = surnom(m.nom) || "Joueur";
      if (!G.J[m.pid]) { const meme = Object.keys(G.J).find(p => G.J[p].nom.toLowerCase() === nom.toLowerCase());   /* même prénom = même joueur qui revient (cellulaire changé) */
        if (meme) { G.J[m.pid] = G.J[meme]; delete G.J[meme]; ["amour"].forEach(k => G[k] = G[k].map(x => x === meme ? m.pid : x)); ["chasseur", "vic", "plume", "plumeJour", "tueSorc"].forEach(k => { if (G[k] === meme) G[k] = m.pid; }); }
        else if (G.ph === "lobby") G.J[m.pid] = {nom, role: null, vivant: true};
        else { R.send({m: "v", pid: m.pid, v: {e: "attente", txt: "La partie est déjà commencée. Tu joueras à la prochaine."}}); return; } }
      G.J[m.pid].vu = Date.now(); delete DER[m.pid]; sauver(); rendre(); pousser(m.pid); return; }
    if (m.m === "pts" && G.J[m.pid] && m.ph === G.ph && m.nuit === G.nuit) { G.pts = G.pts || {}; G.ptsVu = G.ptsVu || {}; const k = m.pid + ":" + m.ph + ":" + m.nuit;
      if (!G.ptsVu[k]) { G.ptsVu[k] = 1; G.pts[m.pid] = (G.pts[m.pid] || 0) + Math.max(0, Math.min(300, +m.p || 0)); sauver(); } return; }
    if (m.m === "ch" && m.ph === G.ph) { choix(m); sauver(); rendre(); pousser(); }
  }
  function choix(m){ const p = G.J[m.pid], sel = (m.sel || []).filter(x => G.J[x]); if (!p) return; const r = p.role, vit = x => G.J[x] && G.J[x].vivant;
    switch (G.ph) {
      case "cupidon": if (r === "cupidon" && p.vivant && sel.length === 2 && sel[0] !== sel[1]) G.ch[m.pid] = sel; break;
      case "voyante": if (r === "voyante" && p.vivant && !G.ch[m.pid] && sel.length === 1 && vit(sel[0]) && sel[0] !== m.pid) {
        G.ch[m.pid] = sel[0]; G.res[m.pid] = {t: "Le secret de " + nomDe(sel[0]), x: nomDe(sel[0]) + " est " + ROLES[G.J[sel[0]].role].art + "."}; } break;
      case "renard": if (r === "renard" && p.vivant && G.flair && !G.ch[m.pid] && sel.length === 3 && sel.every(vit)) { G.ch[m.pid] = sel; const l = sel.some(x => G.J[x].role === "loup");
        if (!l) G.flair = false; G.res[m.pid] = l ? {t: "Ton flair parle", x: "Il y a au moins un loup-garou parmi " + sel.map(nomDe).join(", ") + "."} : {t: "Aucun loup", x: "Aucun loup-garou parmi " + sel.map(nomDe).join(", ") + ". Tu perds ton flair."}; } break;
      case "loups":
        if (r === "loup" && p.vivant && sel.length === 1 && vit(sel[0]) && G.J[sel[0]].role !== "loup") G.ch[m.pid] = sel[0];
        if (r === "petite" && p.vivant && m.a === "espion" && !G.petite) { const ls = vivants().filter(x => G.J[x].role === "loup"), w = melanger(ls)[0], pris = Math.random() < 1 / 3;
          G.petite = {pid: m.pid, pris}; G.res[m.pid] = pris ? {t: "Tu t'es fait prendre", x: (w ? nomDe(w) : "Un loup") + " t'a vue entrouvrir les yeux… Les loups t'ont repérée."} : {t: "Tu as vu…", x: (w ? nomDe(w) : "Personne") + " est un loup-garou. Garde ton secret."}; }
        break;
      case "sorciere": if (r === "sorciere" && p.vivant && G.ch[m.pid] !== "fin") {
        if (m.a === "vie" && G.potVie && G.vic) { G.sauve = true; G.potVie = false; }
        if (m.a === "mort" && G.potMort && sel.length === 1 && vit(sel[0])) { G.tueSorc = sel[0]; G.potMort = false; }
        if (m.a === "fin") G.ch[m.pid] = "fin"; } break;
      case "corbeau": if (r === "corbeau" && p.vivant && !G.ch[m.pid]) { G.ch[m.pid] = sel[0] && vit(sel[0]) ? sel[0] : "aucun"; G.plume = sel[0] && vit(sel[0]) ? sel[0] : null; } break;
      case "vote": if (p.vivant && sel.length === 1 && vit(sel[0]) && sel[0] !== m.pid) G.ch[m.pid] = sel[0]; break;
      case "chasseur": if (m.pid === G.chasseur && !G.ch[m.pid] && sel.length === 1 && vit(sel[0])) G.ch[m.pid] = sel[0]; break;
    }
  }

  /* --- vue de chaque cellulaire --- */
  function info(pid){ const p = G.J[pid], l = [];
    if (p.role === "loup") { const a = Object.keys(G.J).filter(x => x !== pid && G.J[x].role === "loup").map(nomDe); l.push(a.length ? "Les autres loups : " + a.join(", ") + "." : "Tu es le seul loup-garou."); }
    if (G.amour.includes(pid)) l.push("Tu es amoureux de " + nomDe(G.amour.find(x => x !== pid)) + ". Si l'un de vous meurt, l'autre meurt de chagrin.");
    if (p.role === "sorciere") l.push("Potion de vie : " + (G.potVie ? "oui" : "utilisée") + " · potion de mort : " + (G.potMort ? "oui" : "utilisée") + ".");
    if (p.role === "renard" && !G.flair) l.push("Tu as perdu ton flair.");
    return l; }
  const opts = (sauf, filtre) => vivants().filter(x => x !== sauf && (!filtre || filtre(x))).map(x => ({p: x, n: nomDe(x)}));
  function vue(pid){
    const p = G.J[pid]; if (!p) return {e: "attente", txt: "Regarde le tableau."};
    const b = {ph: G.ph, nuit: G.nuit, nom: p.nom, role: G.ph === "lobby" ? null : p.role, info: G.ph === "lobby" ? [] : info(pid), vivant: p.vivant};
    const V = o => Object.assign(b, o);
    if (G.ph === "lobby") return V({e: "attente", txt: "Tu es dans la partie. Regarde le tableau : les cartes arrivent bientôt."});
    if (G.ph === "fin") return V({e: "fin", g: G.gagnant, gagne: (ROLES[p.role].camp === "loups") === (G.gagnant === "loups")});
    if (G.ph === "chasseur" && pid === G.chasseur) return G.ch[pid] ? V({e: "res", t: "Tu as tiré", x: "Regarde le tableau."}) : V({e: "choix", t: "Ton dernier tir", x: "Qui emportes-tu avec toi?", o: opts(pid), n: 1});
    if (!p.vivant) return V({e: "mort"});
    if (G.ph === "cartes") return V({e: "carte"});
    if (NUIT.includes(G.ph) || G.ph === "nuit") {
      const r = p.role, ph = G.ph, res = G.res[pid];
      if (ph === "cupidon" && r === "cupidon") return G.ch[pid] ? V({e: "res", t: "Les amoureux", x: G.ch[pid].map(nomDe).join(" et ") + " sont maintenant amoureux."}) : V({e: "choix", t: "Choisis deux amoureux", x: "Tu peux te choisir toi-même.", o: opts(null), n: 2});
      if (ph === "voyante" && r === "voyante") return res ? V({e: "res", t: res.t, x: res.x}) : V({e: "choix", t: "Qui veux-tu voir?", x: "Son cellulaire ne saura pas que tu l'as regardé.", o: opts(pid), n: 1});
      if (ph === "renard" && r === "renard") return res ? V({e: "res", t: res.t, x: res.x}) : !G.flair ? V({e: "res", t: "Plus de flair", x: "Tu as perdu ton flair. Garde la tête baissée."}) : V({e: "choix", t: "Flaire trois joueurs", x: "Ton cellulaire te dira s'il y a un loup parmi eux.", o: opts(pid), n: 3});
      if (ph === "loups" && r === "loup") { const vs = acteurs("loups").map(x => ({n: nomDe(x), c: G.ch[x] ? nomDe(G.ch[x]) : "…"}));
        return V({e: "choix", t: "Choisissez votre victime", x: G.petite && G.petite.pris ? "La petite fille vous espionnait : vous l'avez surprise. Elle sera votre victime." : "Vous pouvez changer d'idée jusqu'à la fin de l'étape.", o: opts(null, x => G.J[x].role !== "loup"), n: 1, libre: 1, sel: G.ch[pid] ? [G.ch[pid]] : [], loups: vs}); }
      if (ph === "loups" && r === "petite") return res ? V({e: "res", t: res.t, x: res.x}) : V({e: "espion"});
      if (ph === "sorciere" && r === "sorciere") { if (G.ch[pid] === "fin") return V({e: "res", t: "La sorcière se rendort", x: "Garde la tête baissée."});
        if (!G.potVie && !G.potMort) return V({e: "res", t: "Plus de potions", x: "Tes deux potions sont utilisées."});
        return V({e: "sorc", vic: G.vic ? nomDe(G.vic) : null, vie: G.potVie && !!G.vic, mort: G.potMort, sauve: G.sauve, tue: G.tueSorc ? nomDe(G.tueSorc) : null, o: opts(pid)}); }
      if (ph === "corbeau" && r === "corbeau") return G.ch[pid] ? V({e: "res", t: "Ta plume est posée", x: G.plume ? nomDe(G.plume) + " commencera le vote avec 2 voix." : "Personne cette nuit."}) : V({e: "choix", t: "Qui soupçonnes-tu?", x: "Il commencera le vote avec 2 voix contre lui.", o: opts(pid), n: 1, passer: 1});
      return V({e: "nuit"});
    }
    if (G.ph === "vote") return V({e: "choix", t: "Ton vote", x: "Qui veux-tu chasser du village? Tu peux changer d'idée jusqu'au verdict.", o: opts(pid), n: 1, libre: 1, sel: G.ch[pid] ? [G.ch[pid]] : []});
    if (G.ph === "debat") return V({e: "jour", t: "Le débat", regles: REGLES});
    return V({e: "jour", t: NOM_PH[G.ph], x: "Regarde le tableau."});
  }
  const DER = {};
  function pousser(seul){ (seul ? [seul] : Object.keys(G.J)).forEach(p => { if (G.J[p] && G.J[p].bot) return; const v = vue(p), j = JSON.stringify(v); if (DER[p] !== j || seul) { DER[p] = j; R.send({m: "v", pid: p, v}); } }); }
  setInterval(() => R.send({m: "pouls"}), 8000);

  /* --- dessin du tableau (rien de secret) --- */
  const URLJ = location.href.replace(/[?#].*$/, "") + "?lg=" + G.code;
  let qrEl = null;
  function qr(){ if (qrEl) return qrEl; qrEl = document.createElement("div"); qrEl.className = "lg-qr";
    try { new QRCode(qrEl, {text: URLJ, width: 230, height: 230, correctLevel: QRCode.CorrectLevel.M}); } catch(e) { qrEl.textContent = URLJ; } return qrEl; }
  function carteMort(p, i){ const r = ROLES[G.J[p].role]; return `<div class="lg-mortc ${r.camp}" style="animation-delay:${(i || 0) * .25}s">${emb(G.J[p].role)}<b>${esc(nomDe(p))}</b><span>${esc(r.n)}</span></div>`; }
  function scene(){
    const ph = G.ph, c = compo(), n = Object.keys(G.J).length;
    if (ph === "lobby") {
      return `<div class="lg-lobby"><div class="lg-rej"><div class="lg-qrbox"></div><div class="lg-url">Scanne le code QR<br>ou va sur <b>${esc(location.host + location.pathname.replace(/[^/]*$/, ""))}loup-garou.html</b><br>code <b class="lg-code">${G.code.slice(0, 3)} ${G.code.slice(3)}</b></div></div>
        <div class="lg-compo"><h3>Les cartes (${n} joueur${n > 1 ? "s" : ""})</h3>
        <div class="lg-ligne"><span>Loups-garous</span><button class="lg-pm" data-l="-1" aria-label="Un loup de moins">−</button><b>${c.loups}</b><button class="lg-pm" data-l="1" aria-label="Un loup de plus">+</button></div>
        <div class="lg-roles">${SPECIAUX.map(r => `<button class="lg-chip${c.sp.includes(r) ? " on" : ""}" data-r="${r}">${ROLES[r].n}</button>`).join("")}</div>
        <div class="lg-ligne"><span>Villageois</span><b>${Math.max(0, n - c.loups - c.sp.length)}</b></div>
        <p class="lg-note">${n < 5 ? "Il faut au moins 5 joueurs." : "Touche un rôle pour l'ajouter ou l'enlever."}</p>
        <button class="lg-lien lg-bots" id="lgBots">Ajouter 4 joueurs fictifs (pour essayer seul)</button></div></div>`;
    }
    const t = TXT[ph], lire = [], plus = [];
    if (ph === "aube") { if (G.annonce.length) lire.push("Le coq chante sur Val-des-Brumes. Le village se réveille… sauf " + (G.annonce.length > 1 ? G.annonce.length + " personnes" : "une personne") + ". Cette nuit, " + G.annonce.map(nomDe).join(" et ") + (G.annonce.length > 1 ? " ont été retrouvés" : " a été retrouvé") + " au bord de la forêt.");
      else lire.push(G.sauveCetteNuit ? "Le coq chante sur Val-des-Brumes. Le village se réveille… et tout le monde est là! Une main mystérieuse a sauvé quelqu'un cette nuit." : "Le coq chante sur Val-des-Brumes. Le village se réveille… et tout le monde est là! La nuit a été calme.");
      if (G.plumeJour) lire.push("Une plume noire a été trouvée sur la porte de " + nomDe(G.plumeJour) + " : il commence le vote avec deux voix contre lui."); }
    if (ph === "verdict") lire.push(G.egal ? "Le village n'arrive pas à se décider. Personne n'est banni aujourd'hui." : "Le village a parlé. " + nomDe(G.annonce[0]) + ", tu es banni de Val-des-Brumes.");
    if (ph === "fin") lire.push(G.gagnant === "village" ? "Le dernier loup-garou est démasqué. Le soleil se lève sur un village enfin en paix. Bravo, habitants de Val-des-Brumes : votre écoute et vos faits ont sauvé le village!" : "Les loups-garous sont maintenant aussi nombreux que les villageois. Cette nuit, Val-des-Brumes tombe dans l'ombre… Les loups ont gagné. Ils ont menti avec leurs mots… et avec leur visage.");
    if (t) lire.push(t[0]);
    if ((ph === "aube" || ph === "verdict") && G.annonce.length) plus.push(`<div class="lg-morts">${G.annonce.map(carteMort).join("")}</div>`);
    if (ph === "aube" || ph === "verdict") { if (G.amour.length && G.annonce.length > 1 && G.annonce.some(p => G.amour.includes(p))) plus.push(`<p class="lg-faire">Un amoureux est mort de chagrin.</p>`); }
    if (ph === "fin" && G.pts && Object.keys(G.pts).length) { const top = Object.entries(G.pts).filter(([p]) => G.J[p]).sort((a, b) => b[1] - a[1]).slice(0, 5);
      plus.push(`<div class="lg-vifs"><h4>Le compte des étoiles : les yeux les plus vifs</h4>${top.map(([p, v], i) => `<span><b>${i + 1}</b> ${esc(nomDe(p))} <em>${v} pts</em></span>`).join("")}</div>`); }
    if (ph === "debat") plus.push(`<div class="lg-minut" id="lgMin"></div><ol class="lg-regles">${REGLES.map(r => `<li>${esc(r)}</li>`).join("")}</ol>`);
    if (ph === "vote") { const a = acteurs("vote"); plus.push(`<div class="lg-compte"><b>${a.filter(p => G.ch[p]).length}</b> vote${a.filter(p => G.ch[p]).length > 1 ? "s" : ""} sur ${a.length}</div>`); }
    if (ph === "verdict" && G.votes) plus.push(`<div class="lg-votes">${Object.entries(G.votes).sort((a, b) => b[1] - a[1]).map(([p, v]) => `<span>${esc(nomDe(p))} : ${v}</span>`).join("")}</div>`);
    if (ph === "chasseur" && G.ch[G.chasseur]) plus.push(`<div class="lg-morts">${carteMort(G.ch[G.chasseur])}</div>`);
    if (ph === "fin") plus.push(`<div class="lg-morts">${Object.keys(G.J).map(carteMort).join("")}</div><p class="lg-faire">Passe ensuite au retour sur l'atelier (livre Communiquer, annexe D) pendant que tout est frais.</p>`);
    return `<div class="lg-tit">${emb(EMB_PH[ph], "emb lg-emb")}<div class="lg-etape">${esc(NOM_PH[ph])}${G.nuit && ph !== "fin" ? ` <small>· nuit ${G.nuit}</small>` : ""}</div></div>
      ${lire.map(x => `<blockquote class="lg-lire">« ${esc(x)} »</blockquote>`).join("")}
      ${t && t[1] ? `<p class="lg-faire"><b>À faire</b> · ${esc(t[1])}</p>` : ""}${plus.join("")}`;
  }
  function village(){ const ps = Object.keys(G.J);
    return `<h3>Le village <small>${vivants().length} / ${ps.length}</small></h3><ul>${ps.map(p => { const j = G.J[p];
      return `<li class="${j.vivant ? "" : "mort"}"><span>${esc(j.nom)}${j.bot ? " <small>(fictif)</small>" : ""}</span>${!j.vivant && j.role ? `<em>${esc(ROLES[j.role].n)}</em>` : ""}${G.ph === "lobby" ? `<button class="lg-x" data-x="${esc(p)}" aria-label="Retirer">×</button>` : ""}</li>`; }).join("")}</ul>`; }
  function rendre(){
    const nuit = NUIT.includes(G.ph) || G.ph === "nuit";
    document.body.classList.toggle("nuit", nuit); document.body.classList.toggle("jour", !nuit);
    const bouton = {lobby: "Distribuer les cartes", cartes: "Commencer la nuit", aube: "Ouvrir le débat", debat: "Passer au vote", vote: "Révéler le verdict", verdict: "La nuit suivante", chasseur: "Continuer"}[G.ph] || (G.ph === "corbeau" ? "Lever le jour" : "Étape suivante");
    $("lgApp").innerHTML = `<header class="lg-tete"><img src="img/metier-plus.svg" alt="Métier+"><b>Le Loup-Garou de la communication</b><span id="lgRel" class="ko">…</span>
        <a href="labo.html" class="lg-lien">Labo</a><button id="lgNouv" class="lg-lien">Nouvelle partie</button></header>
      <main class="lg-corps"><section class="lg-scene">${scene()}</section><aside class="lg-village">${village()}</aside></main>
      <footer class="lg-bas">${G.ph === "lobby" ? "" : `<button id="lgSecret" class="lg-sec">Rôles (garder appuyé)</button>`}<span id="lgPret"></span>
        ${G.ph === "fin" ? `<button id="lgEnc" class="lg-go">Rejouer avec les mêmes joueurs</button>` : `<button id="lgSuiv" class="lg-go" ${G.ph === "lobby" && Object.keys(G.J).length < 5 ? "disabled" : ""}>${bouton}</button>`}</footer>
      <div id="lgSecOv" hidden></div>`;
    if (G.ph === "lobby") $("lgApp").querySelector(".lg-qrbox").appendChild(qr());
    $("lgSuiv") && ($("lgSuiv").onclick = suivante);
    $("lgEnc") && ($("lgEnc").onclick = () => { const J = {}; Object.keys(G.J).forEach(p => J[p] = {nom: G.J[p].nom, role: null, vivant: true}); const code = G.code, cp = G.compo; G = nouvelle(J); G.code = code; G.compo = cp; aller("lobby"); });
    $("lgNouv").onclick = () => { if (confirm("Commencer une nouvelle partie? La partie en cours sera perdue.")) { localStorage.removeItem("lgPartie"); location.reload(); } };
    document.querySelectorAll(".lg-x").forEach(b => b.onclick = () => { R.send({m: "v", pid: b.dataset.x, v: {e: "attente", txt: "Tu as été retiré de la partie."}}); delete G.J[b.dataset.x]; sauver(); rendre(); });
    $("lgBots") && ($("lgBots").onclick = () => { const N = ["Brume", "Hibou", "Fougère", "Givre", "Corneille", "Écorce", "Daim", "Lichen", "Sapin", "Grêle", "Ronce", "Mousse"];
      let k = 0; for (const nm of N) { if (k === 4) break; if (Object.values(G.J).some(j => j.nom === nm)) continue; G.J["bot-" + nm] = {nom: nm, role: null, vivant: true, bot: true}; k++; } sauver(); rendre(); });
    document.querySelectorAll(".lg-pm").forEach(b => b.onclick = () => { const c = compo(); c.auto = false; c.loups += +b.dataset.l; sauver(); rendre(); });
    document.querySelectorAll(".lg-chip").forEach(b => b.onclick = () => { const c = compo(); c.auto = false; const r = b.dataset.r; c.sp = c.sp.includes(r) ? c.sp.filter(x => x !== r) : SPECIAUX.filter(x => x === r || c.sp.includes(x)); sauver(); rendre(); });
    const s = $("lgSecret"); if (s) { const ov = $("lgSecOv");
      const voir = e => { e.preventDefault(); ov.innerHTML = `<div class="lg-secb"><h3>Rôles secrets</h3>${Object.keys(G.J).map(p => `<div><b>${esc(nomDe(p))}</b> ${esc(ROLES[G.J[p].role].n)}${G.amour.includes(p) ? " · amoureux" : ""}${G.J[p].vivant ? "" : " · éliminé"}</div>`).join("")}</div>`; ov.hidden = false; };
      const cacher = () => { ov.hidden = true; ov.innerHTML = ""; };
      s.addEventListener("pointerdown", voir); ["pointerup", "pointerleave", "pointercancel"].forEach(t => s.addEventListener(t, cacher)); }
    relAff(); tic();
  }
  /* Joueurs fictifs (21 nov., « jouer avec des bots ») : ils choisissent au hasard, 3 à 9 s après le début de l'étape */
  function bots(){ const a = acteurs(G.ph); if (!a) return; let fait = false;
    a.filter(p => G.J[p] && G.J[p].bot).forEach(p => { if (G.ch[p] != null) return;
      const attente = 3000 + (p.charCodeAt(4) * 977 % 6000); if (Date.now() - G.t0 < attente) return;
      const hasard = (n, filtre) => melanger(vivants().filter(x => x !== p && (!filtre || filtre(x)))).slice(0, n);
      const r = G.J[p].role, ph = G.ph, m = {pid: p, ph};
      if (ph === "cupidon") m.sel = melanger(vivants()).slice(0, 2);
      else if (ph === "loups") m.sel = hasard(1, x => G.J[x].role !== "loup");
      else if (ph === "renard") m.sel = hasard(3);
      else if (ph === "sorciere") { if (G.potVie && G.vic && Math.random() < .4) choix({pid: p, ph, a: "vie"}); m.a = "fin"; }
      else m.sel = hasard(1);
      if (ph === "renard" && m.sel.length < 3) { G.ch[p] = []; } else choix(m); fait = true; });
    if (fait) { sauver(); rendre(); pousser(); } }
  function tic(){ bots(); const e = $("lgPret"); if (e) { const a = acteurs(G.ph); e.textContent = a ? (pret() ? "Prêt" : "En attente…") : ""; e.className = pret() ? "ok" : ""; }
    const mi = $("lgMin"); if (mi) { const r = Math.max(0, 300 - Math.floor((Date.now() - G.t0) / 1000)); mi.textContent = Math.floor(r / 60) + ":" + String(r % 60).padStart(2, "0"); mi.classList.toggle("fini", !r); } }
  setInterval(tic, 1000);
  sauver(); rendre(); pousser();
}

/* =================================== Cellulaire de l'élève =================================== */
function joueur(code){
  document.body.className = "cel nuit"; decor();
  const cle = "lg:" + code; let moi = null; try { moi = JSON.parse(localStorage.getItem(cle)); } catch(e) {}
  let derV = null, sel = [], dernier = Date.now(), entre = false;
  const app = $("lgApp");
  const R = relais(PREF + code, m => { dernier = Date.now(); if (m.m === "v" && moi && m.pid === moi.pid) { if (!m.v || JSON.stringify(m.v) !== JSON.stringify(derV)) { sel = (m.v && m.v.sel) || []; } derV = m.v; dessiner(); } },
    ok => { const e = $("jRel"); if (e) e.hidden = ok; if (ok && entre) annoncer(); });
  const annoncer = () => R.send({m: "ici", pid: moi.pid, nom: moi.nom});
  function accueil(msg){
    app.innerHTML = `<div class="j-acc"><img src="img/metier-plus.svg" alt="Métier+" class="j-logo"><h1>Le Loup-Garou</h1><p>de la communication</p>
      ${msg ? `<p class="j-ko">${esc(msg)}</p>` : ""}<label for="jPre">Ton prénom ou surnom (pas de nom de famille)</label>
      <input id="jPre" maxlength="24" autocomplete="off" value="${esc(moi ? moi.nom : "")}"><button id="jGo" class="j-gros">Entrer dans le village</button></div>`;
    const go = () => { const n = surnom($("jPre").value); if (!n) return accueil("Écris ton prénom ou un surnom.");
      moi = {pid: moi && moi.pid || Math.random().toString(36).slice(2, 10), nom: n}; try { localStorage.setItem(cle, JSON.stringify(moi)); } catch(e) {}
      entre = true; derV = {e: "attente", txt: "Connexion au village…"}; dessiner(); annoncer(); veille(); };
    $("jGo").onclick = go; $("jPre").onkeydown = e => { if (e.key === "Enter") go(); };
  }
  function veille(){ const ev = () => { try { if (navigator.wakeLock && !document.hidden) navigator.wakeLock.request("screen").catch(() => {}); } catch(e) {} }; ev();
    document.addEventListener("visibilitychange", () => { ev(); if (!document.hidden) annoncer(); });
    setInterval(() => { if (!document.hidden && Date.now() - dernier > 25000) { dernier = Date.now() - 10000; R.rebrancher(); annoncer(); } }, 5000); }
  /* 21 nov. (« tu gagnes des points quand t'es le plus vite ») : la nuit, des étoiles apparaissent une à une; plus tu touches vite, plus tu gagnes.
     Tout le monde a donc les yeux sur son écran : celui qui joue un rôle ne se démarque pas, et personne ne manque son tour.
     Ceux qui ont un rôle ont leurs étoiles après leur choix. Le TNI garde le total (classement au lever du jour). */
  const JEU = {cle: "", i: 0, pts: 0, fini: false, t: 0};
  function nuitJeu(v){ const n = ["nuit", "cupidon", "voyante", "renard", "loups", "sorciere", "corbeau"].includes(v.ph);
    return n && (["nuit", "mort", "res"].includes(v.e) || (v.e === "choix" && v.loups && v.sel && v.sel.length)); }
  function etoiles(v){ const c = $("jCiel"); if (!c) return; const cle = v.ph + ":" + v.nuit;
    if (JEU.cle !== cle) Object.assign(JEU, {cle, i: 0, pts: 0, fini: false});
    const aff = () => { $("jPts").textContent = JEU.fini ? "Bien joué. Le compte des étoiles sera dévoilé à la fin de la partie." : "Touche les étoiles le plus vite possible. Le plus rapide gagne : résultat à la fin de la partie."; };
    const une = () => { aff(); if (JEU.fini) { c.innerHTML = ""; return; } c.innerHTML = `<button class="j-etoile" style="left:${5 + Math.random() * 70}%;top:${5 + Math.random() * 70}%" aria-label="Étoile"><svg viewBox="0 0 64 64"><path d="M32 4l8 19 20 2-15 13 5 20-18-11-18 11 5-20L4 25l20-2z" fill="currentColor"/></svg></button>`;
      JEU.t = performance.now(); const b = c.firstChild;
      b.onclick = () => { JEU.pts += Math.max(10, Math.round(100 - (performance.now() - JEU.t) / 40)); JEU.i++; b.classList.add("prise"); b.disabled = true;
        if (JEU.i >= 3) { JEU.fini = true; JEU.envoye = false; R.send({m: "pts", pid: moi.pid, ph: v.ph, nuit: v.nuit, p: JEU.pts}); }
        setTimeout(une, 350 + Math.random() * 500); }; };
    une(); }
  function carteHtml(v){ const r = ROLES[v.role]; return `<div class="j-carte ${r.camp}"><div class="j-carte-h">${emb(v.role, "emb j-emb")}</div><div class="j-carte-r">${esc(r.n)}</div><p>${esc(r.d)}</p>${(v.info || []).map(x => `<p class="j-info">${esc(x)}</p>`).join("")}</div>`; }
  function dessiner(){
    const v = derV || {}; const nuit = !(v.e === "jour" || v.e === "fin" || v.e === "attente");
    document.body.classList.toggle("nuit", nuit); document.body.classList.toggle("jour", !nuit);
    let h = "";
    switch (v.e) {
      case "carte": h = `<h2>Ta carte</h2><p>Garde le doigt sur la carte pour voir ton rôle. Ne la montre à personne.</p><div class="j-tenir" id="jTenir">${emb("nuit", "emb j-dos")}<span>Garder appuyé</span></div>`; break;
      case "nuit": h = `<div class="j-dort j-dort2">${emb("nuit", "emb j-lune")}<h2>Le village dort</h2><p>Garde la tête baissée et les yeux sur ton écran.</p></div>`; break;
      case "choix": h = `<h2>${esc(v.t)}</h2><p>${esc(v.x || "")}</p>${v.loups ? `<div class="j-loups">${v.loups.map(l => `<span>${esc(l.n)} → ${esc(l.c)}</span>`).join("")}</div>` : ""}
        <div class="j-opts">${(v.o || []).map(o => `<button class="j-opt${sel.includes(o.p) ? " on" : ""}" data-p="${esc(o.p)}">${esc(o.n)}</button>`).join("")}</div>
        <button id="jOk" class="j-gros" ${sel.length !== v.n ? "disabled" : ""}>${v.libre ? "Envoyer mon choix" : "Confirmer"}</button>${v.passer ? `<button id="jPas" class="j-lien">Personne cette nuit</button>` : ""}`; break;
      case "espion": h = `<h2>Les loups choisissent…</h2><p>Tu peux entrouvrir les yeux pour voir un loup-garou. Attention : une fois sur trois, tu te fais prendre et tu deviens leur victime.</p>
        <button id="jEsp" class="j-gros">Entrouvrir les yeux</button><p class="j-note">Ou garde la tête baissée.</p>`; break;
      case "sorc": h = `<h2>La sorcière</h2><p>${v.vic ? "La victime des loups cette nuit : <b>" + esc(v.vic) + "</b>." : "Les loups n'ont pas fait de victime cette nuit."}</p>
        ${v.sauve ? `<p class="j-info">Tu as sauvé ${esc(v.vic)}.</p>` : v.vie ? `<button class="j-gros" id="jVie">Potion de vie : sauver ${esc(v.vic)}</button>` : ""}
        ${v.tue ? `<p class="j-info">Potion de mort sur ${esc(v.tue)}.</p>` : v.mort ? `<details class="j-det"><summary>Potion de mort : éliminer quelqu'un</summary><div class="j-opts">${v.o.map(o => `<button class="j-opt" data-m="${esc(o.p)}">${esc(o.n)}</button>`).join("")}</div></details>` : ""}
        <button id="jFin" class="j-gros j-2">Terminer</button>`; break;
      case "res": h = `<h2>${esc(v.t)}</h2><div class="j-res">${esc(v.x)}</div><p class="j-note">Garde la tête baissée.</p>`; break;
      case "jour": h = `<h2>${esc(v.t || "Le jour")}</h2>${v.regles ? `<ol class="j-regles">${v.regles.map(r => `<li>${esc(r)}</li>`).join("")}</ol>` : `<p>${esc(v.x || "")}</p>`}`; break;
      case "mort": h = `<div class="j-dort">${emb(v.role || "nuit", "emb j-lune")}</div><h2>Tu es éliminé</h2><p>Reste dans le jeu en silence : tu ne peux plus parler ni voter. Observe le non-verbal des autres.</p>`; break;
      case "fin": h = `${emb(v.g === "village" ? "villageois" : "loup", "emb j-lune")}<h2>${v.g === "village" ? "Le village a gagné" : "Les loups ont gagné"}</h2><p class="j-res">${v.gagne ? "Ton camp a gagné." : "Ton camp a perdu."}</p>`; break;
      default: h = `<h2>${esc(v.t || "Bienvenue")}</h2><p>${esc(v.txt || "Regarde le tableau.")}</p>`;
    }
    app.innerHTML = `<header class="j-tete"><b>${esc(moi.nom)}</b>${v.role ? `<button id="jMa" class="j-ma">Ma carte</button>` : ""}<span id="jRel" class="j-rel" hidden>Reconnexion…</span></header>
      <main class="j-corps">${h}${nuitJeu(v) ? `<div class="j-jeu"><div class="j-pts" id="jPts"></div><div class="j-ciel" id="jCiel"></div></div>` : ""}</main><div id="jOv" class="j-ov" hidden>${v.role ? carteHtml(v) : ""}</div>`;
    const ov = $("jOv"); const tenir = el => { if (!el) return; el.addEventListener("pointerdown", e => { e.preventDefault(); ov.hidden = false; });
      ["pointerup", "pointercancel", "pointerleave"].forEach(t => el.addEventListener(t, () => { ov.hidden = true; })); el.oncontextmenu = e => e.preventDefault(); };
    tenir($("jMa")); tenir($("jTenir"));
    const envoyer = o => R.send(Object.assign({m: "ch", pid: moi.pid, ph: ph()}, o));
    document.querySelectorAll(".j-opt[data-p]").forEach(b => b.onclick = () => { const p = b.dataset.p;
      if (v.n === 1) sel = [p]; else sel = sel.includes(p) ? sel.filter(x => x !== p) : sel.length < v.n ? sel.concat(p) : sel; dessiner(); });
    $("jOk") && ($("jOk").onclick = () => { envoyer({sel}); $("jOk").disabled = true; $("jOk").textContent = "Envoyé"; });
    $("jPas") && ($("jPas").onclick = () => envoyer({sel: []}));
    $("jEsp") && ($("jEsp").onclick = () => envoyer({a: "espion"}));
    $("jVie") && ($("jVie").onclick = () => envoyer({a: "vie"}));
    document.querySelectorAll(".j-opt[data-m]").forEach(b => b.onclick = () => { if (confirm("Éliminer " + b.textContent + "?")) envoyer({a: "mort", sel: [b.dataset.m]}); });
    $("jFin") && ($("jFin").onclick = () => envoyer({a: "fin"}));
    etoiles(v);
  }
  const ph = () => (derV && derV.ph) || "";   /* le TNI refuse un choix d'une autre étape */
  if (moi && moi.nom) { entre = true; derV = {e: "attente", txt: "Retour dans le village…"}; dessiner(); annoncer(); veille(); } else accueil();
}

addEventListener("DOMContentLoaded", () => { const c = (params.get("lg") || "").replace(/\D/g, ""); if (c.length === 6) joueur(c); else animateur(); });
})();
