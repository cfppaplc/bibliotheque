/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — quiz.js (sorti de la page le 15 nov.) */
/* Loi 25 : un nom tapé par l'élève = un seul mot (prénom ou surnom), jamais de nom de famille */
function surnom(v){ return String(v || "").trim().split(/\s+/)[0].replace(/[^\p{L}\p{N}'_-]/gu, "").slice(0, 14); }

/* Quiz maison — Labo (Pavillon de l'Avenir). Même relais que le simulateur : Supabase Realtime (broadcast), ntfy.sh en secours.
   Télécommande = autorité (ordre, points, rangs). Messages :
   télécommande → tous : bienvenue, q (question), img (image pour l'écran), rev (réponse + résultat de chacun), fin, attente, vue (écran)
   joueur → télécommande : ici, rep ; écran → télécommande : ecran? */
const RELAIS = "https://ntfy.sh/", PREFIXE = "pda-quiz-";
const SB_URL = "https://kjlotlhqrgekzohshmbn.supabase.co", SB_CLE = "sb_publishable_1C-o-75sf7havBRmUWA8aQ_gcEW4sRY";
const $ = id => document.getElementById(id);
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"})[c]);
const SYMB = ["A", "B", "C", "D", "E", "F"];
/* ---- Types de questions (7 nov., « pour les caler ») : choix (défaut, aussi vrai ou faux), multi (plusieurs bonnes),
   ordre (remettre en ordre), nombre (calcul tapé), erreur (trouve le morceau faux d'une phrase); une question à choix avec image
   peut montrer son image en « zoom mystère » (Q.zoom = {x, y} en %, agrandie ×3; l'image entière apparaît à la réponse). ---- */
const TYPES = {choix: "Choix", vf: "Vrai ou faux", multi: "Plusieurs bonnes réponses", ordre: "Remettre en ordre", nombre: "Calcul", erreur: "Trouve l'erreur", paires: "Associer", estim: "Estimation", nuage: "Nuage de mots", sondage: "Sondage", echelle: "Échelle de confiance"};
const LOGO_ANIM = '<svg viewBox="0 -4 273.5 72"><defs><linearGradient id="lgG" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><clipPath id="lgC"><path d="M2.5 51.2H15.25V33.2C15.25 30.200000000000003 15.0 24.231250000000003 14.84375 18.481250000000003C16.34375 24.168750000000003 17.90625 30.043750000000003 18.875 33.2L24.375 51.2H34.875L40.28125 33.2C41.25 29.918750000000003 42.875 23.762500000000003 44.34375 17.918750000000003C44.21875 23.825000000000003 43.9375 30.075000000000003 43.9375 33.2V51.2H56.6875V4.637500000000003H37.21875L33.09375 19.200000000000003C32.1875 22.356250000000003 30.8125 27.762500000000003 29.625 32.54375C28.4375 27.762500000000003 27.03125 22.356250000000003 26.125 19.200000000000003L21.9375 4.637500000000003H2.5Z M76.23625 51.95C84.92375 51.95 91.92375 47.16875 93.1425 40.41875H82.08C81.3925 42.2 79.3925 43.2625 76.73625 43.2625C73.11125 43.2625 70.92375 41.2 70.83 37.7H93.2675V34.35625C93.2675 24.450000000000003 86.11125 17.450000000000003 75.98625 17.450000000000003C65.86125 17.450000000000003 58.705 24.606250000000003 58.705 34.7C58.705 44.79375 65.955 51.95 76.23625 51.95ZM71.17375 14.293750000000003H79.42375L88.98625 4.106250000000003H77.48625ZM70.92375 30.700000000000003C71.36125 27.981250000000003 73.29875 26.387500000000003 76.33 26.387500000000003C79.36125 26.387500000000003 81.29875 27.981250000000003 81.73625 30.700000000000003Z M118.16 18.200000000000003H111.3475V9.200000000000003H98.8475V18.200000000000003H93.285V27.700000000000003H98.8475V41.325C98.8475 48.2 102.62875 51.2 111.285 51.2H118.16V41.7H114.2225C111.94125 41.7 111.3475 41.10625 111.3475 39.1375V27.700000000000003H118.16Z M120.1775 51.2H132.6775V18.200000000000003H120.1775ZM126.39625 16.012500000000003C130.3025 16.012500000000003 133.0525 13.512500000000003 133.0525 9.981250000000003C133.0525 6.481250000000003 130.3025 4.012500000000003 126.39625 4.012500000000003C122.49 4.012500000000003 119.74 6.481250000000003 119.74 9.981250000000003C119.74 13.512500000000003 122.49 16.012500000000003 126.39625 16.012500000000003Z M152.41375 51.95C161.10125 51.95 168.10125 47.16875 169.32 40.41875H158.2575C157.57 42.2 155.57 43.2625 152.91375 43.2625C149.28875 43.2625 147.10125 41.2 147.0075 37.7H169.445V34.35625C169.445 24.450000000000003 162.28875 17.450000000000003 152.16375 17.450000000000003C142.03875 17.450000000000003 134.8825 24.606250000000003 134.8825 34.7C134.8825 44.79375 142.1325 51.95 152.41375 51.95ZM147.10125 30.700000000000003C147.53875 27.981250000000003 149.47625 26.387500000000003 152.5075 26.387500000000003C155.53875 26.387500000000003 157.47625 27.981250000000003 157.91375 30.700000000000003Z M171.52499999999998 51.2H184.02499999999998V35.3875C184.02499999999998 30.981250000000003 186.49374999999998 28.200000000000003 190.39999999999998 28.200000000000003H194.96249999999998V18.200000000000003H191.83749999999998C187.30624999999998 18.200000000000003 184.89999999999998 19.762500000000003 183.71249999999998 24.200000000000003H183.64999999999998V18.200000000000003H171.52499999999998Z" fill="#FFFFFF"/></clipPath></defs><g class="lt"><path d="M2.5 51.2H15.25V33.2C15.25 30.200000000000003 15.0 24.231250000000003 14.84375 18.481250000000003C16.34375 24.168750000000003 17.90625 30.043750000000003 18.875 33.2L24.375 51.2H34.875L40.28125 33.2C41.25 29.918750000000003 42.875 23.762500000000003 44.34375 17.918750000000003C44.21875 23.825000000000003 43.9375 30.075000000000003 43.9375 33.2V51.2H56.6875V4.637500000000003H37.21875L33.09375 19.200000000000003C32.1875 22.356250000000003 30.8125 27.762500000000003 29.625 32.54375C28.4375 27.762500000000003 27.03125 22.356250000000003 26.125 19.200000000000003L21.9375 4.637500000000003H2.5Z M76.23625 51.95C84.92375 51.95 91.92375 47.16875 93.1425 40.41875H82.08C81.3925 42.2 79.3925 43.2625 76.73625 43.2625C73.11125 43.2625 70.92375 41.2 70.83 37.7H93.2675V34.35625C93.2675 24.450000000000003 86.11125 17.450000000000003 75.98625 17.450000000000003C65.86125 17.450000000000003 58.705 24.606250000000003 58.705 34.7C58.705 44.79375 65.955 51.95 76.23625 51.95ZM71.17375 14.293750000000003H79.42375L88.98625 4.106250000000003H77.48625ZM70.92375 30.700000000000003C71.36125 27.981250000000003 73.29875 26.387500000000003 76.33 26.387500000000003C79.36125 26.387500000000003 81.29875 27.981250000000003 81.73625 30.700000000000003Z M118.16 18.200000000000003H111.3475V9.200000000000003H98.8475V18.200000000000003H93.285V27.700000000000003H98.8475V41.325C98.8475 48.2 102.62875 51.2 111.285 51.2H118.16V41.7H114.2225C111.94125 41.7 111.3475 41.10625 111.3475 39.1375V27.700000000000003H118.16Z M120.1775 51.2H132.6775V18.200000000000003H120.1775ZM126.39625 16.012500000000003C130.3025 16.012500000000003 133.0525 13.512500000000003 133.0525 9.981250000000003C133.0525 6.481250000000003 130.3025 4.012500000000003 126.39625 4.012500000000003C122.49 4.012500000000003 119.74 6.481250000000003 119.74 9.981250000000003C119.74 13.512500000000003 122.49 16.012500000000003 126.39625 16.012500000000003Z M152.41375 51.95C161.10125 51.95 168.10125 47.16875 169.32 40.41875H158.2575C157.57 42.2 155.57 43.2625 152.91375 43.2625C149.28875 43.2625 147.10125 41.2 147.0075 37.7H169.445V34.35625C169.445 24.450000000000003 162.28875 17.450000000000003 152.16375 17.450000000000003C142.03875 17.450000000000003 134.8825 24.606250000000003 134.8825 34.7C134.8825 44.79375 142.1325 51.95 152.41375 51.95ZM147.10125 30.700000000000003C147.53875 27.981250000000003 149.47625 26.387500000000003 152.5075 26.387500000000003C155.53875 26.387500000000003 157.47625 27.981250000000003 157.91375 30.700000000000003Z M171.52499999999998 51.2H184.02499999999998V35.3875C184.02499999999998 30.981250000000003 186.49374999999998 28.200000000000003 190.39999999999998 28.200000000000003H194.96249999999998V18.200000000000003H191.83749999999998C187.30624999999998 18.200000000000003 184.89999999999998 19.762500000000003 183.71249999999998 24.200000000000003H183.64999999999998V18.200000000000003H171.52499999999998Z" fill="#FFFFFF"/><rect class="ls" x="0" y="-4" width="40" height="72" fill="url(#lgG)" clip-path="url(#lgC)"/></g><g transform="translate(209.5 0)"><g class="lp"><rect width="64" height="64" rx="15" fill="#F2762E"/><path class="lx" d="M32 16v32M16 32h32" stroke="#fff" stroke-width="9" stroke-linecap="round"/></g></g></svg>';
const SANS_PTS = ["diapo", "nuage", "sondage", "echelle", "connexion"];
const sansPoints = jeu => !!(jeu && jeu.length) && !jeu.some(x => !SANS_PTS.includes(typeDe(x)));   /* 15 nov. : présentation de formation, pas de podium */
const HORS_Q = x => ["diapo", "connexion"].includes(typeDe(x));   /* pas comptés comme questions */   /* 10 nov. : ni bonne réponse ni points */
const typeDe = Q => Q.t || "choix";
const estPres = q => !!(q && (q.qs || []).some(x => (x.t || "") === "diapo"));   /* un « quiz » avec des diapos = une présentation (Jeremy : « appelle pas ça des quiz ») */
const num = s => parseFloat(String(s == null ? "" : s).replace(/\s/g, "").replace(",", "."));
const fmtN = x => String(Math.round(x * 1000) / 1000).replace(".", ",");
/* Diapos en haute qualité (10 nov., « la qualité du PDF est bof ») : l'image pleine grandeur va dans IndexedDB « quizDiapos » (et dans le coffre du compte,
   pour la retrouver sur un autre appareil); le quiz ne garde qu'une petite vignette (Q.img) et la clé Q.ref. */
const DIA = (() => { let db = null;
  const ouvrir = () => db || (db = new Promise((ok, ko) => { const o = indexedDB.open("quizDiapos", 1); o.onupgradeneeded = () => o.result.createObjectStore("d"); o.onsuccess = () => ok(o.result); o.onerror = () => ko(o.error); }));
  const get = async k => { try { const d = await ouvrir(); return await new Promise(ok => { const r = d.transaction("d").objectStore("d").get(k); r.onsuccess = () => ok(r.result || null); r.onerror = () => ok(null); }); } catch(e) { return null; } };
  const put = async (k, v) => { try { const d = await ouvrir(); await new Promise(ok => { const t = d.transaction("d", "readwrite"); t.objectStore("d").put(v, k); t.oncomplete = ok; t.onerror = ok; }); } catch(e) {} };
  const obtenir = async k => { let v = await get(k); if (v) return v;
    try { if (window.COFFRE && COFFRE.recevoir) { const o = await COFFRE.recevoir("diapo:" + k); if (o && o.d) { await put(k, o.d); return o.d; } } } catch(e) {} return null; };
  const envoyer = async k => { try { const v = await get(k); if (v && window.COFFRE && COFFRE.envoyer) await COFFRE.envoyer("diapo:" + k, {d: v}); } catch(e) {} };
  /* version légère pour le relais (2e appareil) : 1280 px */
  const leger = d => new Promise(ok => { const im = new Image(); im.onload = () => { const k = Math.min(1, 1280 / Math.max(im.width, im.height)), c = document.createElement("canvas");
    c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); const w = c.toDataURL("image/webp", .7); ok(w.startsWith("data:image/webp") ? w : c.toDataURL("image/jpeg", .75)); }; im.onerror = () => ok(d); im.src = d; });
  return {get, put, obtenir, envoyer, leger}; })();
/* Nuage de mots (10 nov.) : regroupe les mots sans accents ni majuscules, garde la 1re forme écrite */
const cleMot = w => String(w || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9' -]/g, "").replace(/\s+/g, " ");
function compterMots(reps, masques){ const M = {}; Object.values(reps || {}).forEach(x => { const t = String(x && x.c || "").trim().slice(0, 30), k = cleMot(t); if (!k || (masques && masques[k])) return; (M[k] = M[k] || {t, n: 0}).n++; }); return Object.entries(M).map(([k, v]) => ({k, t: v.t, n: v.n})).sort((a, b) => b.n - a.n).slice(0, 40); }
function juste(Q, c){
  const t = typeDe(Q);
  if (c == null || c === -1) return false;
  if (t === "multi") return Array.isArray(c) && c.length === Q.bon.length && c.every(x => Q.bon.includes(x));
  if (t === "ordre" || t === "paires") return Array.isArray(c) && c.join() === Q.bon.join();
  if (t === "estim") { const x = lireNb(c); return !isNaN(x) && Math.abs(x - Q.bon) <= Math.abs(Q.bon) * (+Q.tol || 10) / 100 + 1e-9; }
  if (t === "nombre") {   /* (13 nov.) point ou virgule acceptés partout; « 1.250 » / « 1,250 » / « 1 250,5 » : on essaie aussi la lecture en milliers */
    const s = String(c).replace(/\s/g, ""), essais = [num(s), parseFloat(s.replace(/[.,](?=\d{3}(\D|$))/g, "").replace(",", ".")), parseFloat(s.replace(/[.,](?=.*[.,])/g, "").replace(",", "."))];
    return essais.some(x => !isNaN(x) && Math.abs(x - Q.bon) <= (+Q.tol || 0) + 1e-9); }
  return c === Q.bon;
}
/* 25 nov. : lecture d'un nombre tapé (virgule, point, espaces) pour l'estimation */
function lireNb(c){ const s = String(c).replace(/\s/g, ""); return [num(s), parseFloat(s.replace(/[.,](?=\d{3}(\D|$))/g, "").replace(",", "."))].find(x => !isNaN(x)) ?? NaN; }
function texteBon(Q){ const t = typeDe(Q);
  if (t === "nuage") return "(nuage de mots)";
  if (t === "sondage") return "(sondage)";
  if (t === "echelle") return "(échelle de confiance)";
  if (t === "multi") return Q.bon.map(k => SYMB[k] + ". " + Q.ch[k]).join("  ·  ");
  if (t === "ordre") return Q.bon.map((k, j) => (j + 1) + ". " + Q.ch[k]).join("   ");
  if (t === "paires") return Q.bon.map((k, j) => (Q.g || [])[j] + " → " + Q.ch[k]).join("  ·  ");
  if (t === "estim") return fmtN(Q.bon) + (Q.u ? " " + Q.u : "") + " (± " + (+Q.tol || 10) + " %)";
  if (t === "nombre") return fmtN(Q.bon) + (Q.u ? " " + Q.u : "") + (+Q.tol ? " (± " + fmtN(+Q.tol) + ")" : "");
  return Q.ch[Q.bon]; }
function texteRep(Q, c){ const t = typeDe(Q);
  if (c == null || c === -1) return "—";
  if (t === "nuage") return String(c);
  if (t === "echelle") return String(c + 1) + " sur 5";
  if (t === "multi") return (c || []).map(k => SYMB[k]).join(", ") || "rien";
  if (t === "ordre") return (c || []).map(k => SYMB[k]).join(" → ");
  if (t === "paires") return (c || []).map((k, j) => (j + 1) + SYMB[k]).join(" ");
  if (t === "nombre" || t === "estim") return String(c) + (Q.u ? " " + Q.u : "");
  return SYMB[c] + ". " + (Q.ch[c] || ""); }
const FLAMME = '<svg class="flamme" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c.6 3.2-1.4 4.9-2.9 6.6C7.6 10.8 6.5 12.6 6.5 15a5.5 5.5 0 0 0 11 0c0-2.3-1-4.1-2.2-5.6-.3 1.2-.9 2.1-1.9 2.6.4-3.4-.4-6.8-1.4-9.5z" fill="currentColor"/><path d="M12 13.2c-1.3 1.3-2 2.3-2 3.6a2 2 0 0 0 4 0c0-1.2-.7-2.3-2-3.6z" fill="#FFE7A3"/></svg>';
const COULEURS = ["#534AB7", "#B3261E", "#185FA5", "#0F6E56", "#854F0B", "#3A3936"];
const REG_DEF = {mode: "ind", points: "vitesse", classement: "oui", melange: "non", son: "oui", musique: "oui", bonus: "oui", tricheur: "non", nb: "tout", temps: "normal", penalite: "non", cache: "non", lettres: "non", double: "non", indice: "non", coul: "#534AB7"};
const sombre = h => { const n = parseInt(h.slice(1), 16), f = .38; return `rgb(${Math.round((n >> 16) * f + 18)},${Math.round((n >> 8 & 255) * f + 18)},${Math.round((n & 255) * f + 24)})`; };
function plusRapide(G){ let m = null, t = 1e12; for (const id in (G.reps || {})) { const x = G.reps[id]; if (x && x.ok && x.ms < t) { t = x.ms; m = id; } } return m; }
const ord = r => r + (r === 1 ? "er" : "e");
window.__indice = ret => { (ret || []).forEach(k => { const x = document.querySelector('#jBx [data-c="' + k + '"]'); if (x) { x.disabled = true; x.style.opacity = ".2"; x.style.textDecoration = "line-through"; } });
  const b = document.getElementById("jInd"); if (b) { b.disabled = true; b.textContent = "Indice utilisé : " + (ret || []).length + " choix enlevé" + ((ret || []).length > 1 ? "s" : "") + " (−500)"; } };

let canal = null, pret = false, attente = [];
function envoyer(topic, obj){
  if (window.SANS_RELAIS) return;
  if (window.supabase) { if (!pret) { attente.push(obj); return; } canal.send({type: "broadcast", event: "m", payload: obj}).catch(() => {}); return; }
  fetch(RELAIS + topic, {method: "POST", body: JSON.stringify(obj)}).catch(() => {});
}
function ecouter(topic, quand, etat){
  if (window.supabase) {
    /* (9 nov., « décrochés en cours de partie ») : si le lien tombe (iPad en veille, Wi-Fi qui saute), on se réabonne tout seul;
       au retour, le joueur se réannonce (ici) et la télécommande lui renvoie la question en cours */
    const sb = window.supabase.createClient(SB_URL, SB_CLE, {realtime: {params: {eventsPerSecond: 20}}});
    let gen = 0, ok = false, reT = null, cache = 0;
    const abonner = () => {
      const g = ++gen; clearTimeout(reT); reT = null;
      if (canal) { const vieux = canal; try { sb.removeChannel(vieux); } catch(x) {} }
      pret = false;
      canal = sb.channel(topic, {config: {broadcast: {self: false}}});
      canal.on("broadcast", {event: "m"}, ({payload}) => { try { quand(payload); } catch(x) {} });
      canal.subscribe(st => {
        if (g !== gen) return;   /* ancien canal qu'on vient de fermer nous-mêmes */
        ok = st === "SUBSCRIBED";
        if (ok) { pret = true; const a = attente; attente = []; a.forEach(o => envoyer(topic, o)); }
        else { pret = false; if (!reT) reT = setTimeout(abonner, 2000); }
        etat(ok);
      });
    };
    window.relaisRebrancher = abonner;
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { cache = Date.now(); return; }
      if (!ok || (cache && Date.now() - cache > 15000)) abonner();   /* revenu de veille : le lien est souvent mort sans le dire */
    });
    addEventListener("online", () => abonner());
    abonner();
    return;
  }
  const es = new EventSource(RELAIS + topic + "/sse");
  es.onopen = () => etat(true); es.onerror = () => etat(false);
  es.onmessage = e => { try { const d = JSON.parse(e.data); if (d.event === "message") quand(JSON.parse(d.message)); } catch(x) {} };
}
const stock = {get(k, d){ try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch(e) { return d; } }, set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch(e) { return false; } }};
function compter(el, de, a, ms){ // chiffres qui montent doucement
  if (!el) return; const t0 = performance.now();
  const pas = t => { const k = Math.min(1, (t - t0) / ms); el.textContent = Math.round(de + (a - de) * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(pas); };
  requestAnimationFrame(pas);
}

/* Quiz d'exemple (protection incendie, modules 1 à 5) */
const EXEMPLE = {id: "exemple-incendie", exemple: true, titre: "Protection incendie : révision des modules 1 à 5", couv: "img/labo/incendie-immeuble.jpg", sujet: "Protection incendie · modules 1 à 5", reg: Object.assign({}, REG_DEF, {coul: "#B3261E"}), qs: [
  {q: "Quel élément manque au triangle du feu pour faire le tétraèdre ?", ch: ["L'oxygène", "La réaction en chaîne", "La chaleur", "Le combustible"], bon: 1, s: 20, expl: "La réaction en chaîne entretient le feu; la poudre ABC agit surtout sur elle.", img: "img/labo/quiz/incendie-01.jpg"},
  {q: "Un feu d'huile de cuisson dans une friteuse est de classe…", ch: ["A", "B", "C", "K"], bon: 3, s: 20, expl: "Classe K : huiles et graisses de cuisson. On utilise l'agent humide de la hotte ou un extincteur K.", img: "img/labo/quiz/incendie-02.jpg"},
  {q: "Le propane qui fuit s'accumule…", ch: ["Au plafond", "Au sol et dans le sous-sol", "Il se mélange partout", "Dans les conduits"], bon: 1, s: 20, expl: "Densité ≈ 1,5 : plus lourd que l'air, il coule vers le bas.", img: "img/labo/quiz/incendie-03.jpg"},
  {q: "Un extincteur à poudre ABC éteint surtout en…", ch: ["Refroidissant", "Brisant la réaction en chaîne", "Ajoutant de l'eau", "Retirant le combustible"], bon: 1, s: 20, img: "img/labo/quiz/incendie-04.jpg"},
  {q: "Hauteur maximale du dessus d'un extincteur de moins de 18 kg ?", ch: ["1,00 m", "1,53 m", "1,80 m", "2,00 m"], bon: 1, s: 20, expl: "NFPA 10 : 1,53 m (5 pi) au maximum, et au moins 10 cm du plancher.", img: "img/labo/quiz/incendie-05.jpg"},
  {q: "Le détecteur le mieux adapté au stationnement souterrain :", ch: ["À ionisation", "Photoélectrique", "Thermique", "De CO"], bon: 2, s: 20, expl: "Gaz d'échappement et poussière : un détecteur de fumée y ferait trop de fausses alarmes.", img: "img/labo/quiz/incendie-06.jpg"},
  {q: "Un avertisseur de fumée se remplace au plus tard…", ch: ["Après 5 ans", "Après 10 ans", "Après 15 ans", "Quand il ne sonne plus"], bon: 1, s: 20, img: "img/labo/quiz/incendie-07.jpg"},
  {q: "Une vanne de gicleurs fermée donne un signal de…", ch: ["Alarme", "Supervision", "Trouble", "Aucun signal"], bon: 1, s: 15, expl: "Supervision : un système de protection n'est plus prêt à fonctionner.", img: "img/labo/quiz/incendie-08.jpg"},
  {q: "En classe B, un fil coupé ne change rien à la protection.", ch: ["Vrai", "Faux"], bon: 1, s: 15, expl: "Faux : les appareils au-delà de la coupure ne protègent plus. Le panneau affiche un trouble.", img: "img/labo/quiz/incendie-09.jpg"},
  {q: "Qui autorise le réarmement après une alarme ?", ch: ["Le préposé", "Le gestionnaire", "Le service incendie", "La télésurveillance"], bon: 2, s: 15, img: "img/labo/quiz/incendie-10.jpg"}
]};
/* Personnages de chantier (noms fictifs). Chacun ne peut être choisi qu'une fois par partie. Photos : img/labo/perso/NN.jpg */
const PERSOS = [
  ["Marc-Antoine", "Plombier"], ["Julie", "Vendeuse-conseil"], ["Wilson", "Électricien"], ["Daniela", "Serveuse"],
  ["Kevin", "Soudeur-monteur"], ["Mélanie", "Productrice laitière"], ["Karim", "Frigoriste"], ["Linh", "Assistante technique en pharmacie"],
  ["Alexandre", "Électromécanicien"], ["Audrey", "Préposée à l'entretien"], ["Mathieu", "Charpentier-menuisier"], ["Sophie", "Débosseleuse-peintre"],
  /* 9 nov. : 30 personnages (classes de 20 et plus); tous ont une photo (13 à 30 : métiers de toute la FP) */
  ["Olivier", "Cuisinier"], ["Aminata", "Infirmière auxiliaire"], ["Carlos", "Mécanicien automobile"], ["Valérie", "Comptable"],
  ["Vincent", "Opérateur de machinerie lourde"], ["Nadège", "Préposée aux bénéficiaires"], ["Patrick", "Boucher"], ["Marie-Ève", "Coiffeuse"],
  ["Mamadou", "Camionneur"], ["Geneviève", "Adjointe administrative"], ["Arjun", "Technicien en soutien informatique"], ["Annie", "Pâtissière"],
  ["Simon", "Horticulteur-paysagiste"], ["Yasmine", "Assistante dentaire"], ["David", "Ébéniste"], ["Noémie", "Esthéticienne"],
  ["Gabriel", "Machiniste"], ["Laurence", "Fleuriste"]];
const persoImg = k => "img/labo/perso/" + String(k + 1).padStart(2, "0") + ".jpg?v=3";
function visage(k, cls){
  const p = PERSOS[k]; if (!p) return "";
  const ini = p[0].split(/[\s-]+/).map(x => x[0]).slice(0, 2).join("");
  return `<span class="vis ${cls || ""}" style="--vc:${["#534AB7", "#B3261E", "#185FA5", "#0F6E56", "#854F0B", "#3A3936"][k % 6]}"><b>${ini}</b><img src="${persoImg(k)}" alt="" onerror="this.remove()"></span>`;
}
function grillePersos(pris, choisi){
  return `<div class="persos">${PERSOS.map((p, k) => `<button class="perso ${pris.includes(k) && k !== choisi ? "pris" : ""} ${k === choisi ? "choisi" : ""}" data-av="${k}">${visage(k, "v-l")}<b>${esc(p[0])}</b><small>${esc(p[1])}</small><em>Déjà pris</em></button>`).join("")}</div>`;
}
function mesQuiz(){ return stock.get("quizMaison", []); }
/* quiz des livres (quiz-livres.js) : lecture seule, comme l'exemple */
const LIVRES_Q = (window.QUIZ_LIVRES || []).map(q => Object.assign({}, q, {reg: Object.assign({}, REG_DEF, q.reg, {coul: q.coul || REG_DEF.coul})}));
/* Réglages choisis par l'enseignant avant de jouer (fenêtre « Comment afficher »), gardés par quiz sur cet appareil */
function reglagesDe(id){ return (stock.get("quizReglages", {}) || {})[id] || {}; }
function fixerReglage(id, k, v){ const t = stock.get("quizReglages", {}) || {}; t[id] = Object.assign({}, t[id], {[k]: v}); stock.set("quizReglages", t); }
function tousQuiz(){ return [EXEMPLE].concat(LIVRES_Q, mesQuiz()); }

/* Aperçu d'une question dans l'éditeur : ce que la classe voit au tableau + ce que l'élève voit sur son appareil */
function apercuQ(Q){
  let d = document.getElementById("apQ");
  if (!d) { d = document.createElement("dialog"); d.id = "apQ";
    d.innerHTML = `<div class="apT"><b>Aperçu de la question</b><span>Rien n'est envoyé aux élèves.</span><button class="btn2" id="apX">Fermer</button></div>
      <div class="apG"><figure><figcaption>Au tableau</figcaption><div class="apE"><iframe id="apE" title="Tableau"></iframe></div></figure>
      <figure class="apJ"><figcaption>Sur l'appareil de l'élève</figcaption><div class="apP"><iframe id="apJ" title="Appareil de l'élève"></iframe></div></figure></div>`;
    document.body.appendChild(d); d.querySelector("#apX").onclick = () => d.close();
    d.addEventListener("close", () => { d.querySelector("#apE").src = "about:blank"; d.querySelector("#apJ").src = "about:blank"; }); }
  const t = typeDe(Q), coul = (typeof ed !== "undefined" && ed && ed.reg && ed.reg.coul) || REG_DEF.coul, now = Date.now(), s = +Q.s || 20;
  const ch = (Q.ch || []).filter(x => x !== "" && x != null), base = location.href.split(/[?#]/)[0];
  const vue = {m: "vue", sp: false, code: "000000", etat: "question", titre: "Aperçu", i: 0, n: 1, qn: 1, nq: 1, t0: now, now,
    reg: {coul, son: "non", musique: "non", classement: "oui", points: "vitesse", mode: "ind", lettres: "non"}, couv: "", sujet: "",
    q: {q: Q.q || "(ta question)", ch, s, t, u: Q.u || "", zoom: Q.zoom || null, img: !!Q.img, expl: "", bonTxt: ""},
    pres: false, mots: t === "nuage" ? [] : null, dref: "", mains: 0, conn: false, dmv: "", dlg: null, bon: null, cpt: [0, 0, 0, 0, 0, 0], nrep: 0, mises: 0, joueurs: []};
  const qm = {m: "q", now, pour: null, i: 0, n: 1, qn: 1, nq: 1, q: vue.q.q, ch, g: Q.g || null, t, u: Q.u || "", nb: t === "multi" ? (Q.bon || []).length : 0, t0: now, lec: 0, s, coul, dbl: false, ind: false, ret: null};
  const charger = (id, url, msgs) => { const f = d.querySelector("#" + id); f.onload = () => { let n = 0; const go = () => { const w = f.contentWindow; if (w && w.__recoit) msgs.forEach(m => w.__recoit(m)); else if (n++ < 40) setTimeout(go, 100); }; go(); }; f.src = url; };
  charger("apE", base + "?ecran=000000&apercu=1", (Q.img ? [{m: "img", i: 0, data: Q.img}] : []).concat([vue]));
  charger("apJ", base + "?j=000000&apercu=1", [qm]);
  d.showModal();
  const fit = () => { const e = d.querySelector(".apE"); if (e.clientWidth) e.style.setProperty("--k", e.clientWidth / 1920); };
  fit(); requestAnimationFrame(fit); if (!apercuQ.r) { apercuQ.r = 1; addEventListener("resize", fit); }
}
const params = new URLSearchParams(location.search);
/* 15 nov. (« un petit preview lorsqu'on crée les questions ») : ?apercu=1 = page montrée dans l'aperçu de l'éditeur;
   rien ne passe par le relais, l'éditeur donne les messages directement (window.__recoit) */
if (params.get("apercu")) { envoyer = () => {}; ecouter = (t, cb) => { window.__recoit = cb; }; document.documentElement.classList.add("apercuQ"); }
if (params.get("animer")) animer([["bGo"], ["bSuite"], ["bPause"]]);
else if (params.get("manette")) manette(params.get("manette").replace(/\D/g, "").slice(0, 6), params.get("k") || "");
else if (params.get("j")) joueur(params.get("j").replace(/\D/g, "").slice(0, 6));
else if (params.get("ecran")) ecran(params.get("ecran").replace(/\D/g, "").slice(0, 6));
else if (params.get("tele")) telecommande();
else if (!params.get("role")) telecommande(true);
else {
  $("role").classList.remove("cache");
  $("rTele").onclick = () => { $("role").classList.add("cache"); telecommande(); };
  $("rAnim").onclick = () => { location.search = "?animer=1"; };
  $("rEcr").onclick = () => { $("rCode").classList.remove("cache"); $("rIn").focus(); };
  if (location.hash === "#ecran") $("rEcr").click();
  $("rGo").onclick = () => { const c = $("rIn").value.replace(/\D/g, ""); if (c.length === 6) location.search = "?ecran=" + c; };
  $("rIn").addEventListener("keydown", e => { if (e.key === "Enter") $("rGo").click(); });
}

/* ================================ TÉLÉCOMMANDE ================================ */
/* 25 nov. : le tricheur voit la bonne réponse (bandeau discret + petit point sur le bon choix) */
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest(".infoB"); if (!b) return; e.preventDefault(); e.stopPropagation();
  const l = b.closest("label"), bu = l && l.nextElementSibling; if (bu && bu.classList.contains("bulleI")) bu.hidden = !bu.hidden; }, true);   /* 25 nov. : bulle d'information des options */
function trichAppliquer(i){ const t = window.__trich, b = document.getElementById("jBx"); if (!t || t.i !== i || !b || b.querySelector(".trichB") || !b.querySelector("[data-c], #jNb")) return;   /* 25 nov. : aussi Calcul et Estimation (champ #jNb) */   /* seulement pendant la question */
  if (t.apres && Date.now() < t.apres){ clearTimeout(window.__trichT); window.__trichT = setTimeout(() => trichAppliquer(i), t.apres - Date.now() + 30); return; }
  b.insertAdjacentHTML("afterbegin", `<div class="trichB">Tu es le tricheur (la réponse arrive après 3 s). Bonne réponse : <b>${String(t.txt || "").replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"})[c])}</b>. Ne te fais pas remarquer!</div>`);
  if (!b.querySelector(".ch4.ordre")) [].concat(t.bon == null ? [] : t.bon).forEach(k => { const x = b.querySelector(`[data-c="${k}"]`); if (x) x.classList.add("trichOk"); }); }
function telecommande(bord){
  $("tele").classList.remove("cache");
  if (bord) { window.SANS_RELAIS = true; document.body.classList.add("bord"); $("tTitre").textContent = "Mes Défi+"; $("lienEcran").classList.remove("cache"); const rr = document.querySelector("#tele .mp-retour"); if (rr) { rr.textContent = "‹ Labo"; rr.href = "labo.html"; } }
  let code = "";
  const s = stock.get("quizSession", null); if (s && Date.now() - s.t < 6 * 3600e3) code = s.code;
  if (!code) code = String(Math.floor(100000 + Math.random() * 900000));
  const MK = (s && s.code === code && s.mk) || Math.random().toString(36).slice(2, 10);   /* clé de la manette du cellulaire (9 nov.) */
  stock.set("quizSession", {code, t: Date.now(), mk: MK});
  const topic = PREFIXE + code, url = location.href.split(/[?#]/)[0] + "?j=" + code;
  $("code").textContent = code.slice(0, 3) + " " + code.slice(3);
  // dans « Animer au tableau », la télécommande est dans un tiroir : elle donne son code à la page
  if (params.get("inclus")) { document.body.classList.add("inclus"); try { parent.postMessage({labo: "code", code, mk: MK}, "*"); } catch(e) {} }
  $("bEcran").onclick = () => window.open(location.href.split(/[?#]/)[0] + "?ecran=" + code, "ecranClasse", "popup,width=1280,height=760");
  try { new QRCode($("qr"), {text: url, width: 180, height: 180, correctLevel: QRCode.CorrectLevel.H}); if (window.qrLogo) qrLogo($("qr")); } catch(e) { $("qr").innerHTML = '<div class="sous" style="word-break:break-all">' + esc(url) + "</div>"; }

  const P = {};   // pid → {nom, pts, bons, av, vu, parti}
  const ids = () => Object.keys(P).filter(id => !P[id].parti);
  const MAX_J = 40;   // joueurs au plus dans une partie (Supabase gratuit : 200 connexions, on garde de la marge)
  /* Retirer un joueur qui bogue : il voit un message et peut revenir en choisissant de nouveau */
  document.addEventListener("click", e => { const b = e.target.closest("[data-kick]"); if (!b || bord) return; const id = b.dataset.kick; if (!P[id]) return;
    P[id].parti = true; P[id].exclu = true; envoyer(topic, {m: "kick", pour: id}); envoyerPersos(); maj();
    if (G.etat === "question" && ids().length && ids().every(x => G.reps[x])) setTimeout(reveler, 300); });
  const G = {quiz: null, jeu: [], i: -1, etat: "choix", t0: 0, reps: {}};   // etat : choix | lobby | question | rev | fin
  const R = () => Object.assign({}, REG_DEF, G.quiz && G.quiz.reg, G.quiz && !G.quiz.fixe && reglagesDe(G.quiz.id));   /* fixe = présentation jouée telle quelle */
  const rangs = () => { const l = Object.entries(P).filter(([id]) => !P[id].parti).sort((a, b) => b[1].pts - a[1].pts || (b[1].bons || 0) - (a[1].bons || 0) || a[1].nom.localeCompare(b[1].nom)); const r = {}; l.forEach(([id], k) => r[id] = k + 1); return r; };
  const melanger = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function preparer(){ // ordre et choix selon les réglages
    const r = R(); let qs = G.quiz.qs.map(q => JSON.parse(JSON.stringify(q)));
    if (qs.some(q => HORS_Q(q))) { G.jeu = qs; return; }   /* présentation : diapos et questions dans l'ordre, toutes */
    if (r.melange !== "non") qs = melanger(qs);
    /* nombre de questions : tirage au hasard (dans l'ordre du quiz si « Tel quel ») */
    const nb = parseInt(r.nb, 10);
    if (nb > 0 && qs.length > nb){
      /* tirage varié : d'abord une question de chaque type spécial (plusieurs bonnes, ordre, calcul, erreur, zoom), puis le reste au hasard */
      const sorte = Q => Q.zoom ? "zoom" : typeDe(Q), garde = new Set(), idx = melanger(qs.map((_, k) => k));
      ["multi", "ordre", "nombre", "erreur", "zoom", "paires", "estim"].forEach(s => { const k = idx.find(j => sorte(qs[j]) === s); if (k != null && garde.size < Math.ceil(nb / 2)) garde.add(k); });
      idx.forEach(k => { if (garde.size < nb) garde.add(k); });
      qs = qs.filter((_, k) => garde.has(k)); if (r.melange !== "non") qs = melanger(qs); }
    if (r.temps === "plus") qs.forEach(Q => Q.s = Math.round((Q.s || 20) * 1.5));
    if (r.temps === "moins") qs.forEach(Q => Q.s = Math.max(10, Math.round((Q.s || 20) * .7)));
    qs.forEach(Q => {
      const t = typeDe(Q);
      if (t === "ordre" || t === "paires") {   /* les étapes (ou les réponses à associer) sont toujours mêlées (jamais dans le bon ordre au départ) */
        const L = Q.ch, idx = L.map((_, k) => k); let p = melanger(idx); for (let e = 0; e < 8 && p.join() === idx.join(); e++) p = melanger(idx);
        Q.ch = p.map(k => L[k]); Q.bon = idx.map(j => p.indexOf(j)); return; }
      if (r.melange !== "tout" || t === "nombre" || t === "estim" || t === "erreur" || (Q.ch.length === 2 && /^vrai$/i.test(Q.ch[0]))) return;
      const p = melanger(Q.ch.map((_, k) => k)); Q.ch = p.map(k => Q.ch[k]);
      Q.bon = t === "multi" ? Q.bon.map(b => p.indexOf(b)).sort((a, b) => a - b) : p.indexOf(Q.bon); });
    G.jeu = qs;
  }
  const appliquerCouleur = () => document.documentElement.style.setProperty("--acc", R().coul);

  function listeLob(){
    const L = ids();
    $("nbP").textContent = L.length ? "(" + L.length + ")" : "";
    $("listeLob").innerHTML = L.length ? L.map(id => `<div class="pj"><span>${visage(P[id].av, "v-s")}${esc(P[id].nom)}${P[id].prenom ? ` <small class="sous">(${esc(P[id].prenom)})</small>` : ""}</span><button class="kick" data-kick="${id}" title="Retirer de la partie (il pourra revenir)">✕</button></div>`).join("") : "Personne pour l'instant.";
  }
  function table(){
    const r = rangs(), Q = G.jeu[G.i];
    $("tRep").innerHTML = ids().sort((a, b) => r[a] - r[b]).map(id => {
      const x = G.reps[id]; let c = '<span class="att">—</span>';
      if (G.etat === "question") c = x ? '<span class="ok">✓ a répondu</span>' : '<span class="att">en attente…</span>';
      else if (G.etat === "mise") c = P[id].mise ? '<span class="ok">mise tout</span>' : '<span class="att">garde ses points</span>';
      else if (G.etat === "rev" && Q && ["sondage", "echelle", "nuage"].includes(typeDe(Q))) c = x && x.c != null ? esc(texteRep(Q, x.c)) : '<span class="att">Pas répondu</span>';
      else if (G.etat === "rev" && Q) c = x && x.c != null ? `${esc(texteRep(Q, x.c))} · <span class="${x.ok ? "ok" : "ko"}">${x.ok ? (x.g ? "+" + x.g : "bonne") : x.g < 0 ? x.g : "mauvaise"}</span>${x.dbl ? ` · <b>${x.dbl > 0 ? "double +" + x.dbl : "mise perdue"}</b>` : ""}` : '<span class="ko">Pas répondu</span>' + (x && x.dbl ? " · <b>mise perdue</b>" : "");
      return `<tr><td><b>${visage(P[id].av, "v-s")}${esc(P[id].nom)}</b>${P[id].prenom ? ` <span class="sous">(${esc(P[id].prenom)})</span>` : ""}</td><td>${c}</td><td>${P[id].pts}</td><td>${G.etat === "lobby" ? "—" : r[id]}</td><td style="text-align:right"><button class="kick" data-kick="${id}" title="Retirer de la partie (il pourra revenir)">✕</button></td></tr>`;
    }).join("") || '<tr><td colspan="5" class="sous">Personne pour l\'instant.</td></tr>';
    /* 9 nov. : qui n'a pas encore répondu (seulement sur la télécommande, jamais au tableau) */
    const att = G.etat === "question" ? ids().filter(id => !G.reps[id]) : [];
    $("qAtt").classList.toggle("cache", !att.length);
    $("qAtt").innerHTML = att.length ? `<b>En attente de ${att.length} :</b> ${att.map(id => `<span>${visage(P[id].av, "v-s")}${esc(P[id].nom)}</span>`).join("")}` : "";
  }
  let vT = 0, vD = null;
  function vue(){ if (vD) return; vD = setTimeout(() => { vD = null; vT = Date.now(); envoyer(topic, vueObj()); }, Math.max(0, 450 - (Date.now() - vT))); }
  function vueObj(){
    const Q = G.jeu[G.i], r = rangs(), reg = R(), t = Q ? typeDe(Q) : "choix";
    let cpt = [0, 0, 0, 0, 0, 0];
    if (Q && ["ordre", "nombre", "paires", "estim"].includes(t)) cpt = [Object.values(G.reps).filter(x => juste(Q, x.c)).length, Object.keys(G.reps).length];
    else Object.values(G.reps).forEach(x => [].concat(x.c).forEach(k => { if (k >= 0) cpt[k]++; }));
    const nq = G.jeu.filter(x => !HORS_Q(x)).length, qn = G.jeu.slice(0, G.i + 1).filter(x => !HORS_Q(x)).length;
    return {m: "vue", sp: sansPoints(G.jeu), code, etat: G.etat === "choix" ? "lobby" : G.etat, titre: G.quiz ? G.quiz.titre : "Défi+", i: G.i, n: G.jeu.length, qn, nq, t0: G.t0, now: Date.now(),
      reg: {coul: reg.coul, son: reg.son, musique: reg.musique || "oui", classement: reg.classement, points: reg.points, mode: reg.mode, lettres: reg.lettres || "non"},
      couv: G.quiz && G.quiz.couv && !/^data:/.test(G.quiz.couv) ? G.quiz.couv : (G.quiz && G.quiz.couv ? "img" : ""), sujet: G.quiz ? G.quiz.sujet || "" : "",
      q: Q && ["question", "rev"].includes(G.etat) ? {q: Q.q, ch: Q.ch, g: Q.g || null, tol: +Q.tol || 0, s: Q.s, t, u: Q.u || "", zoom: Q.zoom || null, img: !!Q.img, expl: G.etat === "rev" ? Q.expl || "" : "", bonTxt: G.etat === "rev" ? texteBon(Q) : ""} : null,
      pres: estPres(G.quiz), mots: Q && typeDe(Q) === "nuage" ? compterMots(G.reps, G.masques) : null, vals: G.etat === "rev" && Q && typeDe(Q) === "estim" ? Object.values(G.reps).map(x => lireNb(x.c)).filter(x => !isNaN(x)) : null, dref: G.etat === "diapo" && Q ? Q.ref || "" : "", mains: G.mains ? G.mains.size : 0, conn: !!(G.quiz && G.quiz.qs.some(x => x.t === "connexion")), dmv: G.etat === "diapo" && Q ? Q.mv || "" : "", dlg: G.etat === "diapo" && Q && Q.lg ? Q.lg : null,
      bon: G.etat === "rev" ? Q.bon : null, cpt, nrep: Object.keys(G.reps).length, mises: G.etat === "mise" ? ids().filter(id => P[id].mise).length : 0, vtrN: G.etat === "vtr" ? Object.keys(G.vtr || {}).length : 0, vtrRes: G.etat === "vtrRes" ? G.vtrRes : null, inter: G.etat === "inter" ? G.inter : null, interT: G.interT || 0,
      stats: G.etat === "fin" && G.stats ? (G.bilan || []).map((b, i) => b && b.n ? {i, q: b.q, p: Math.round(100 * b.ok / b.n), bon: b.bon} : null).filter(Boolean) : null,
      joueurs: ids().map(id => ({n: P[id].nom, av: P[id].av, pts: P[id].pts, r: r[id], g: G.etat === "rev" && G.reps[id] ? G.reps[id].g || 0 : 0, s: P[id].serie || 0, bo: G.etat === "rev" && G.reps[id] ? G.reps[id].bonus || 0 : 0, ra: G.etat === "rev" && G.reps[id] && G.reps[id].ok && id === plusRapide(G) ? 1 : 0})).sort((a, b) => a.r - b.r)};
  }
  function dessinerBilan(){
    const el = $("bilan"); if (!el) return; const B = (G.bilan || []).map((b, i) => b && Object.assign({i}, b)).filter(Boolean);
    if (G.etat !== "fin" || !B.length) { el.classList.add("cache"); return; }
    const pc = b => b.n ? Math.round(100 * b.ok / b.n) : 0, moy = Math.round(B.reduce((a, b) => a + pc(b), 0) / B.length), rev = B.filter(b => pc(b) < 60);
    el.classList.remove("cache");
    el.innerHTML = `<h2>Bilan de la classe · pour toi seulement</h2>
      <div class="bil-moy"><b>${moy} %</b><span>de bonnes réponses en moyenne · ${rev.length ? `<b style="font-size:inherit;color:#D9483B">${rev.length} question${rev.length > 1 ? "s" : ""} à revoir</b>` : "rien à revoir, bravo !"}</span></div>
      ${B.map(b => `<div class="bil-r${pc(b) < 60 ? " revoir" : ""}"><span>${b.i + 1}</span><div class="q">${esc(b.q)}${pc(b) < 60 ? '<span class="bil-tag">À revoir</span>' : ""}<small>Bonne réponse : ${esc(b.bon)}${b.n - b.rep > 0 ? ` · ${b.n - b.rep} sans réponse` : ""}</small></div><div class="bil-b"><i style="width:${pc(b)}%"></i></div><span class="pc">${pc(b)} %</span></div>`).join("")}
      <div class="sous" style="margin-top:10px">Rien n'est gardé sur les élèves : ce bilan disparaît quand tu quittes la partie.</div>`;
  }
  function maj(){
    dessinerBilan();
    if (!G.quiz) { listeLob(); vue(); return; }
    const Q = G.jeu[G.i];
    $("jTitre").textContent = G.quiz.titre; if ($("tTitre")) $("tTitre").textContent = (estPres(G.quiz) ? "Présentation" : "Défi+") + " · télécommande";
    $("qCour").textContent = G.etat === "lobby" ? (G.quiz && G.quiz.qs.some(x => x.t === "connexion") ? "Prêt : touche « Commencer » pour lancer la présentation (les élèves se connecteront plus loin)." : "En attente des participants…") : G.etat === "connexion" ? "Connexion des participants : le code est au tableau." : G.etat === "fin" ? "Partie terminée : le classement final est sur chaque cellulaire." : G.etat === "diapo" ? "Diapo " + (G.jeu.slice(0, G.i + 1).filter(x => typeDe(x) === "diapo").length) : (G.i + 1) + ". " + Q.q;
    $("qInfo").textContent = G.etat === "question" ? Object.keys(G.reps).length + " réponse(s) sur " + ids().length + " · " + Q.s + " s" :
      G.etat === "rev" ? "Bonne réponse : " + texteBon(Q) + (R().classement === "oui" ? " · le rang de chacun est envoyé sur son cellulaire." : "") :
      G.etat === "inter" ? "Interrogatoire : pose les questions au tableau, puis passe au vote." : G.etat === "vtr" ? "Vote du tricheur : " + Object.keys(G.vtr || {}).length + " vote(s) sur " + ids().length + "." : G.etat === "vtrRes" ? "Le tricheur était " + (G.vtrRes ? G.vtrRes.nom : "") + "." :
      G.etat === "mise" ? "Double ou rien : " + ids().filter(id => P[id].mise).length + " joueur(s) misent. Touche « Question suivante » pour commencer." : G.etat === "diapo" ? "Diapo au tableau · les cellulaires affichent « Regarde le tableau »." : G.quiz.qs.length + " éléments";
    $("bGo").disabled = G.etat !== "lobby";
    { const bp = $("bPause"), au = !!(G.quiz && G.quiz.auto); bp.hidden = !au; bp.disabled = !(au && G.etat === "diapo"); bp.textContent = G.pause ? "▶ Reprendre" : "❚❚ Pause"; }
    $("bSuite").disabled = !["question", "rev", "mise", "diapo", "connexion", "vtr", "vtrRes", "inter"].includes(G.etat) && !(G.etat === "fin" && !(G.bilan || []).some(Boolean));
    if (G.etat === "fin" && (G.bilan || []).some(Boolean)) $("bSuite").disabled = false;
    { let av = $("animVote"); if (!av) { av = document.createElement("div"); av.id = "animVote"; $("qInfo").insertAdjacentElement("afterend", av); }
      if (G.etat === "inter" && G.inter) { av.innerHTML = `<div class="sous">Questions à poser (toi seul les vois) :</div><ol class="avQ">${G.inter.Q.map(q => `<li>${esc(q)}</li>`).join("")}</ol>`; }
      else if (G.etat === "vtr") { av.innerHTML = `<div class="sous">Ton vote d'animateur (tu ne sais pas qui c'est) : si tu te trompes, le tricheur gagne 1000 points.</div><div class="avL">${ids().map(id => `<button data-av="${esc(id)}" class="${G.vtrAnim === id ? "choisi" : ""}">${esc(P[id].nom)}</button>`).join("")}<button data-av="passe" class="${!G.vtrAnim ? "choisi" : ""}">Je ne vote pas</button></div>`;
        av.querySelectorAll("[data-av]").forEach(b => b.onclick = () => { G.vtrAnim = b.dataset.av === "passe" ? null : b.dataset.av; maj(); }); }
      else if (G.quiz && !estPres(G.quiz) && ["lobby", "question", "rev"].includes(G.etat) && G.i + 1 < G.jeu.length) {   /* 25 nov. : double ou rien à la demande, aussi au tableau de bord */
        av.innerHTML = `<button class="avDbl ${G.dblProch ? "on" : ""}" id="avDbl">×2 ${G.dblProch ? "Double ou rien à la prochaine question (touche pour annuler)" : "Double ou rien à la prochaine question"}</button>`;
        $("avDbl").onclick = () => { G.dblProch = !G.dblProch; maj(); }; }
      else av.innerHTML = ""; }
    $("bSuite").textContent = G.etat === "fin" ? (G.stats ? "Revoir le podium" : "Statistiques de la classe") : G.etat === "inter" ? "Passer au vote" : G.etat === "vtr" ? "Démasquer le tricheur" : G.etat === "vtrRes" ? "Voir le podium" : G.etat === "question" ? "Montrer la réponse" : G.etat === "mise" ? "Lancer la question" : G.i + 1 >= G.jeu.length ? (G.quiz && G.quiz.auto ? "Recommencer" : sansPoints(G.jeu) ? "Terminer" : "Voir le podium") : typeDe(G.jeu[G.i + 1]) === "diapo" ? "Diapo suivante" : "Question suivante";
    if (Q && typeDe(Q) === "nuage" && ["question", "rev"].includes(G.etat)) {
      const L = compterMots(G.reps, G.masques);
      $("qInfo").innerHTML = (G.etat === "question" ? Object.keys(G.reps).length + " réponse(s) sur " + ids().length + " · " : "") + (L.length ? "Touche un mot pour le cacher du tableau : " + L.map(w => `<button class="btn2 petit" data-masq="${esc(w.k)}">${esc(w.t)} (${w.n}) ✕</button>`).join(" ") : "Aucun mot pour l'instant.");
      $("qInfo").querySelectorAll("[data-masq]").forEach(b => b.onclick = () => { (G.masques = G.masques || {})[b.dataset.masq] = 1; maj(); }); }
    if (G.mains && G.mains.size && G.etat !== "fin") { $("qInfo").insertAdjacentHTML("beforeend", `<div class="mainsT">✋ ${G.mains.size} élève${G.mains.size > 1 ? "s ont" : " a"} une question <button class="btn2 petit" id="bMainsRaz">C'est répondu</button></div>`); $("bMainsRaz").onclick = () => { G.mains = new Set(); maj(); }; }
    table(); listeLob(); vue(); sauverPartie();
  }
  function envoyerCouv(){ if (G.quiz && G.quiz.couv && /^data:/.test(G.quiz.couv)) envoyer(topic, {m: "img", i: -1, data: G.quiz.couv}); }
  // un élève qui ne donne plus signe de vie depuis 40 s est retiré (son personnage redevient libre)
  setInterval(() => { if (ids().length) envoyer(topic, {m: "pouls"}); }, 8000);   /* (13 nov.) signe de vie pour les iPad : sans nouvelles, ils se rebranchent */
  setInterval(() => { let ch = false; Object.values(P).forEach(p => { if (!p.parti && Date.now() - (p.vu || 0) > 40000) { p.parti = true; ch = true; } }); if (ch) { envoyerPersos(); maj(); if (G.etat === "question" && ids().length && ids().every(id => G.reps[id])) setTimeout(reveler, 300); } }, 5000);
  function envoyerPersos(){ envoyer(topic, {m: "persos", pris: ids().map(id => P[id].av).filter(v => v != null)}); }
  let minut = null;
  function qMsg(pour){ const Q = G.jeu[G.i]; return {m: "q", now: Date.now(), pour, i: G.i, n: G.jeu.length, qn: G.jeu.slice(0, G.i + 1).filter(x => !HORS_Q(x)).length, nq: G.jeu.filter(x => !HORS_Q(x)).length, q: Q.q, ch: Q.ch, g: Q.g || null, t: typeDe(Q), u: Q.u || "", nb: typeDe(Q) === "multi" ? Q.bon.length : 0,
    t0: G.t0, lec: Math.max(0, G.t0 - Date.now()), s: Q.s, coul: R().coul, dbl: !!(G.dbl && pour && P[pour] && P[pour].mise), ind: R().indice === "oui" && typeDe(Q) === "choix" && (Q.ch || []).length >= 3, ret: pour && P[pour] && P[pour].ind === G.i ? P[pour].indR : null,
    tr: pour && pour === G.tricheur && !SANS_PTS.includes(typeDe(Q)) && G.trichQ && G.trichQ[G.i] ? {bon: Q.bon, txt: texteBon(Q)} : null}; }
  /* vote du tricheur : après la dernière question, avant le podium */
  const voteAFaire = () => !!(G.tricheur && P[G.tricheur] && !G.vtrFait);
  /* 25 nov. (Jeremy : « l'animateur pose des questions pour créer des soupçons ») : interrogatoire avant le vote.
     Le tableau montre des suspects (les meilleurs taux de bonnes réponses) et des questions à poser; 2 minutes. */
  function interrogatoire(){ clearTimeout(minut); G.etat = "inter"; G.interT = Date.now();
    const B = (G.bilan || []).map((b, i) => b && Object.assign({i}, b)).filter(b => b && b.n), dure = B.slice().sort((a, b) => a.ok / a.n - b.ok / b.n)[0];
    const st = id => ({id, n: P[id].nom, bons: P[id].bons || 0, max: P[id].max || 0, moy: P[id].nr ? P[id].tt / P[id].nr / 1000 : 0});
    const S = ids().map(st).sort((a, b) => b.bons - a.bons || b.max - a.max).slice(0, 4), tot = G.jeu.filter(x => !SANS_PTS.includes(typeDe(x))).length;
    const lent = ids().map(st).filter(x => x.moy).sort((a, b) => b.moy - a.moy)[0], parfait = S.filter(x => x.bons === tot);
    const Q = [];
    if (dure && S[0]) Q.push(`${S[0].n}, à la question ${dure.i + 1}, seulement ${Math.round(100 * dure.ok / dure.n)} % de la classe a trouvé. Comment as-tu fait, toi?`);
    if (parfait.length) Q.push(`${parfait.map(x => x.n).join(" et ")} : aucune erreur. Qui d'autre trouve ça louche?`);
    if (lent) Q.push(`${lent.n}, tu prends ton temps avant de répondre (${lent.moy.toFixed(1).replace(".", ",")} s en moyenne). Tu attends quoi?`);
    if (S[1]) Q.push(`${S[1].n}, qui soupçonnes-tu, et pourquoi? Donne un fait.`);
    Q.push("Le tricheur se trompe peut-être exprès. Qui a raté une question facile?");
    G.inter = {S: S.map(x => ({n: x.n, bons: x.bons, tot, max: x.max, moy: x.moy ? +x.moy.toFixed(1) : null})), Q};
    envoyer(topic, {m: "inter"}); maj(); envoyer(topic, vueObj()); }
  function voteTricheur(){ clearTimeout(minut); G.etat = "vtr"; G.vtr = {}; G.vtrAnim = null; envoyer(topic, {m: "vtr", opts: ids().map(id => ({id, n: P[id].nom}))}); maj(); envoyer(topic, vueObj()); }
  /* 25 nov. (Jeremy) : trouver le tricheur = se partager ses points; se tromper = lui donner le quart des siens; on peut passer */
  function resultatTricheur(){ const t = G.tricheur, v = G.vtr || {}, d = {}, et = {};   /* et[id] = points à chaque étape : avant, mauvais votes, bons votes, animateur */
    ids().forEach(id => { et[id] = [P[id].pts]; });
    const bons = ids().filter(id => id !== t && v[id] === t), faux = ids().filter(id => id !== t && v[id] && v[id] !== "passe" && v[id] !== t);
    faux.forEach(id => { const x = Math.round(P[id].pts * .2); P[id].pts -= x; P[t].pts += x; d[id] = -x; });   /* équilibre : 20 % pour un mauvais vote */
    ids().forEach(id => et[id].push(P[id].pts));
    const recu = faux.reduce((a, id) => a - d[id], 0); let total = 0, part = 0;
    if (bons.length) { total = Math.round(P[t].pts / 2); part = Math.floor(total / bons.length); bons.forEach(id => { P[id].pts += part; d[id] = part; }); P[t].pts -= part * bons.length; d[t] = recu - part * bons.length; }   /* démasqué : il remet la moitié de ses points */
    else d[t] = recu;
    ids().forEach(id => et[id].push(P[id].pts));
    /* 25 nov. (Jeremy) : l'animateur vote aussi, sans savoir qui c'est : s'il se trompe, le tricheur gagne 1000 points */
    const animRate = !!(G.vtrAnim && G.vtrAnim !== t); if (animRate) { P[t].pts += 1000; d[t] = (d[t] || 0) + 1000; }
    ids().forEach(id => et[id].push(P[id].pts));
    G.vtrFait = true; G.etat = "vtrRes"; G.vtrRes = {nom: P[t].nom, nb: bons.length, nf: faux.length, total, part, trouve: bons.length > 0, anim: G.vtrAnim ? (animRate ? "rate" : "bon") : "",
      L: ids().map(id => ({n: P[id].nom, av: P[id].av, e: et[id], tr: id === t, k: id === t ? "tr" : bons.includes(id) ? "bon" : faux.includes(id) ? "faux" : "passe"}))};
    envoyer(topic, Object.assign({m: "vtrRes", tr: t, bons, faux, d}, G.vtrRes)); maj(); envoyer(topic, vueObj()); }
  function planAuto(){ clearTimeout(minut); const D = G.jeu && G.jeu[G.i];   /* 11 nov. : présentation qui défile seule, en boucle; Pause l'arrête */
    if (G.quiz && G.quiz.auto && !G.pause && G.etat === "diapo" && D) minut = setTimeout(() => { if (G.etat !== "diapo" || G.pause) return; G.i = G.i + 1 >= G.jeu.length ? 0 : G.i + 1; suivante(); }, (D.d || G.quiz.auto) * 1000); }
  function question(){
    clearTimeout(minut);
    if (typeDe(G.jeu[G.i]) === "connexion") { G.etat = "connexion"; G.reps = {}; envoyer(topic, {m: "bienvenue", titre: G.quiz.titre, coul: R().coul, mode: R().mode}); maj(); return; }   /* page de connexion au milieu d'une présentation */
    if (typeDe(G.jeu[G.i]) === "diapo") { const D = G.jeu[G.i]; G.etat = "diapo"; G.reps = {};
      if (!D.ref && D.img) envoyer(topic, {m: "img", i: G.i, data: D.img});   /* anciennes diapos (image dans le quiz) */
      envoyer(topic, {m: "diapo", i: G.i}); maj();
      planAuto();
      return; }
    G.etat = "question"; G.reps = {};
    const Q = G.jeu[G.i], lec = R().cache === "oui" ? 5000 : 0;   /* « choix cachés » : 5 s pour lire la question avant de voir les choix */
    G.t0 = Date.now() + 600 + lec;
    if (Q.img) envoyer(topic, {m: "img", i: G.i, data: Q.img});
    envoyer(topic, qMsg());
    ids().forEach(id => { if (G.dbl && P[id].mise) envoyer(topic, {m: "dblrap", pour: id}); });
    /* 25 nov. (« un tricheur avec un vote à la fin ») : un élève secret reçoit la bonne réponse */
    if (R().tricheur === "oui" && G.tricheur === undefined && ids().length >= 3 && !estPres(G.quiz)) { const L = ids(); G.tricheur = L[Math.floor(Math.random() * L.length)]; }
    /* équilibre (25 nov.) : la réponse à chaque question, mais 3 s après l'arrivée des choix (il ne gagne pas tous les points de vitesse) */
    if (G.tricheur && P[G.tricheur] && !SANS_PTS.includes(typeDe(Q))) { G.trichQ = G.trichQ || {}; if (G.trichQ[G.i] === undefined) G.trichQ[G.i] = true;   /* 25 nov. (Jeremy) : à chaque question, pour que les autres puissent repérer un modèle */
      if (G.trichQ[G.i]) envoyer(topic, {m: "trich", pour: G.tricheur, i: G.i, bon: Q.bon, txt: texteBon(Q), t0: G.t0, now: Date.now()}); }
    minut = setTimeout(reveler, lec + Q.s * 1000 + 2500); maj();
  }
  /* « Double ou rien » : chacun peut miser tous ses points. 13 nov. (Jeremy) : vers 40 % du quiz plutôt qu'à la dernière question,
     pour laisser aux joueurs le temps de se reprendre. iDbl() = index de la question visée (questions avec points seulement). */
  function iDbl(){ const S = []; (G.jeu || []).forEach((x, i) => { if (!SANS_PTS.includes(typeDe(x))) S.push(i); });
    if (S.length < 2) return []; const a = S[Math.min(S.length - 1, Math.max(1, Math.round(S.length * .4)))], b = S[S.length - 1];
    return a === b ? [a] : [a, b]; }   /* 13 nov. (Jeremy) : aussi à la dernière question */
  const dblFaits = () => Array.isArray(G.dblFait) ? G.dblFait : [];
  function mise(){
    clearTimeout(minut); G.etat = "mise"; G.dbl = true; ids().forEach(id => P[id].mise = false);
    envoyer(topic, {m: "mise", pts: Object.fromEntries(ids().map(id => [id, P[id].pts]))});
    minut = setTimeout(question, 15000); maj();
  }
  function suivante(){   /* passe à la question G.i (déjà avancée) */
    /* 25 nov. : « Double ou rien » demandé à la télécommande pour la prochaine question (avec points) */
    if (G.dblProch && G.jeu[G.i] && !SANS_PTS.includes(typeDe(G.jeu[G.i])) && G.etat !== "mise") { G.dblProch = false; mise(); return; }
    if (R().double === "oui" && iDbl().includes(G.i) && !dblFaits().includes(G.i) && G.etat !== "mise") { mise(); return; }
    question();
  }
  function reveler(){
    if (G.etat !== "question") return; clearTimeout(minut); G.etat = "rev";
    if (typeDe(G.jeu[G.i]) === "nuage") { envoyer(topic, {m: "rev", i: G.i, nuage: true}); maj(); return; }
    if (["sondage", "echelle"].includes(typeDe(G.jeu[G.i]))) { envoyer(topic, {m: "rev", i: G.i, sp: true}); maj(); return; }   /* sondage, échelle : rien de noté */   /* nuage de mots : ni points ni série touchés */
    const Q = G.jeu[G.i], reg = R(), avant = rangs(), der = G.dbl && iDbl().includes(G.i);
    Object.entries(G.reps).forEach(([id, x]) => {
      const bon = x.ok = juste(Q, x.c);
      x.g = !bon || reg.points === "aucun" ? 0 : reg.points === "fixe" ? 1000 : Math.round(1000 - 500 * Math.min(1, Math.max(0, x.ms) / (Q.s * 1000)));
      if (P[id]) { P[id].serie = bon ? (P[id].serie || 0) + 1 : 0; P[id].max = Math.max(P[id].max || 0, P[id].serie);   /* série de bonnes réponses */
        x.bonus = bon && reg.bonus !== "non" && reg.points !== "aucun" && P[id].serie >= 3 ? 100 * Math.min(3, P[id].serie - 2) : 0; x.g += x.bonus;
        if (!bon && reg.penalite === "oui" && reg.points !== "aucun") x.g = -Math.min(250, P[id].pts);   /* pénalité : jamais sous 0 */
        P[id].pts += x.g; P[id].bons = (P[id].bons || 0) + (bon ? 1 : 0); if (x.ms != null) { P[id].tt = (P[id].tt || 0) + Math.max(0, x.ms); P[id].nr = (P[id].nr || 0) + 1; } }
    });
    ids().forEach(id => { if (!G.reps[id]) P[id].serie = 0; });   /* pas répondu = série brisée */
    if (der) ids().forEach(id => { if (!P[id].mise) return; const x = G.reps[id] || (G.reps[id] = {c: null, ms: 0, g: 0, ok: false});
      const avantMise = P[id].pts - (x.g || 0); x.dbl = x.ok ? avantMise : -P[id].pts; P[id].pts += x.dbl; });
    const r = rangs(), n = ids().length, res = {};
    ids().forEach(id => { const x = G.reps[id]; res[id] = {rep: x ? x.c : null, ok: !!(x && x.ok), g: x ? x.g : 0, bonus: x ? x.bonus || 0 : 0, dbl: x ? x.dbl || 0 : 0, mise: !!(der && P[id].mise), serie: P[id].serie || 0, pts: P[id].pts, rang: r[id], avant: avant[id], bons: P[id].bons || 0}; });
    if (der){ G.dbl = false; G.dblFait = dblFaits().concat(G.i); }   /* la mise ne vaut que pour cette question */
    (G.bilan = G.bilan || [])[G.i] = {q: Q.q, n, rep: ids().filter(id => G.reps[id] && G.reps[id].c != null && G.reps[id].c !== -1).length, ok: ids().filter(id => G.reps[id] && G.reps[id].ok).length, bon: texteBon(Q)};   /* bilan de la classe, pour l'enseignant */
    envoyer(topic, {m: "rev", i: G.i, bon: Q.bon, bonTxt: texteBon(Q), expl: Q.expl || "", res, n, classement: reg.classement, points: reg.points}); maj();
  }
  function finir(){
    clearTimeout(minut); G.etat = "fin";
    const r = rangs(), n = ids().length, res = {};
    ids().forEach(id => res[id] = {pts: P[id].pts, rang: r[id], bons: P[id].bons || 0, max: P[id].max || 0});
    envoyer(topic, {m: "fin", sp: sansPoints(G.jeu), res, n, total: G.jeu.filter(x => !SANS_PTS.includes(typeDe(x))).length, points: R().points}); maj(); envoyer(topic, vueObj());
  }
  $("bGo").onclick = () => { if (!G.quiz) return; G.pause = false; G.tricheur = undefined; G.trichQ = {}; G.vtrFait = false; G.vtr = {}; G.vtrRes = null; G.dblProch = false; G.stats = false; Object.values(P).forEach(p => { p.tt = 0; p.nr = 0; }); try { localStorage.setItem("dernierQuiz", JSON.stringify({ id: G.quiz.id, titre: G.quiz.titre || "Quiz", t: Date.now() })); } catch(e){} try { window.COFFRE && COFFRE.stat("quiz:" + (G.quiz.exemple ? G.quiz.id : "perso")); } catch(e){} Object.values(P).forEach(p => { p.pts = 0; p.bons = 0; p.serie = 0; p.max = 0; p.mise = false; }); G.dbl = false; G.masques = {}; G.mains = new Set(); preparer(); (G.jeu || []).forEach(x => { if (x.ref) DIA.obtenir(x.ref); }); G.i = 0; suivante(); };
  $("bPause").onclick = () => { G.pause = !G.pause; planAuto(); maj(); };
  $("bSuite").onclick = () => { if (G.etat === "question") { reveler(); return; } if (G.etat === "mise") { question(); return; }
    if (G.etat === "vtr") { resultatTricheur(); return; } if (G.etat === "vtrRes") { finir(); return; } if (G.etat === "inter") { voteTricheur(); return; }
    if (G.etat === "fin") { G.stats = !G.stats; maj(); envoyer(topic, vueObj()); return; }   /* 25 nov. : statistiques de la classe au tableau, quand l'enseignant le décide */
    if (G.i + 1 >= G.jeu.length && !(G.quiz && G.quiz.auto) && voteAFaire()) { interrogatoire(); return; } if (G.i + 1 >= G.jeu.length) { if (G.quiz && G.quiz.auto) { G.i = 0; suivante(); return; } finir(); return; } G.i++; suivante(); };
  $("bFin").onclick = () => { oublierPartie(); clearTimeout(minut); envoyer(topic, {m: "attente"}); G.quiz = null; G.etat = "choix"; G.i = -1; G.jeu = []; document.documentElement.style.removeProperty("--acc"); montrer("vChoix"); listeQuiz(); vue(); };

  /* Manette du cellulaire (9 nov., « contrôler avec mon cell, ça doit être facile ») : le cell envoie {m:"cmd", k, b},
     la télécommande touche le bouton à sa place et renvoie son état. Sans la bonne clé (dans le QR de l'enseignant), rien ne se passe. */
  let manVu = 0, manDer = "";
  function etatManette(){
    const b = id => { const e = $(id); return {t: e.textContent, d: !!e.disabled}; };
    const att = G.etat === "question" ? ids().filter(id => !G.reps[id]).map(id => P[id].nom) : [];
    const r = rangs(), Q = G.jeu[G.i], rev = G.etat === "rev" && Q;
    const j = ids().sort((x, y) => r[x] - r[y]).map(id => { const x = G.reps[id];
      return {id, n: P[id].nom, pts: P[id].pts, r: r[id], a: G.etat === "question" ? !!x : null, txt: rev && x && x.c != null ? texteRep(Q, x.c) : "", ok: rev ? !!(x && x.ok) : null}; });
    return {m: "mstat", go: b("bGo"), suite: b("bSuite"), cour: $("qCour").textContent, att, n: ids().length, etat: G.etat, titre: G.quiz ? G.quiz.titre || "Défi+" : "",
      j, fin: G.etat === "question" && Q ? G.t0 + Q.s * 1000 : 0, lec: G.etat === "question" ? G.t0 : 0, dblP: !!G.dblProch,
      interQ: G.etat === "inter" && G.inter ? G.inter.Q : null,
      vanim: G.etat === "vtr" ? {opts: ids().map(id => ({id, n: P[id].nom})), choix: G.vtrAnim || ""} : null};
  }
  function pousserMan(force){ if (Date.now() - manVu > 90000) return; const o = etatManette(), j = JSON.stringify(o); if (force || j !== manDer) { manDer = j; o.now = Date.now(); envoyer(topic, o); } }
  if (!bord) setInterval(pousserMan, 700);
  function manetteCmd(m){ manVu = Date.now();
    if ((m.b === "bGo" || m.b === "bSuite") && !$(m.b).disabled) $(m.b).click();
    else if (m.b === "plus10" && G.etat === "question" && G.jeu[G.i]) {   /* +10 s à la question en cours (écran, iPad qui n'ont pas répondu, minuterie) */
      const Q = G.jeu[G.i]; Q.s += 10; clearTimeout(minut); minut = setTimeout(reveler, Math.max(500, G.t0 + Q.s * 1000 + 2500 - Date.now()));
      ids().filter(id => !G.reps[id]).forEach(id => envoyer(topic, qMsg(id))); maj(); }
    else if (m.b === "vanim" && G.etat === "vtr" && (P[m.id] || m.id === "passe")) { G.vtrAnim = m.id === "passe" ? null : m.id; maj(); }
    else if (m.b === "dbl" && G.etat !== "choix" && G.etat !== "fin") { G.dblProch = !G.dblProch; maj(); }
    else if (m.b === "kick" && m.id && P[m.id]) { const k = document.querySelector(`[data-kick="${m.id}"]`); if (k) k.click(); }
    else if (m.b === "fin" && G.etat !== "choix") $("bFin").click();
    setTimeout(() => pousserMan(true), 250); }
  if (!bord) ecouter(topic, m => {
    if (m.m === "cmd") { if (m.k === MK) manetteCmd(m); return; }
    if (m.m === "ecran?") { envoyer(topic, vueObj()); envoyerCouv(); const Q = G.jeu[G.i]; if (G.etat === "question" && Q && Q.img) envoyer(topic, {m: "img", i: G.i, data: Q.img}); return; }
    if (m.m === "persos?") { envoyerPersos(); return; }
    if (m.pid && P[m.pid]) { const etait = P[m.pid].parti; P[m.pid].vu = Date.now(); if (m.m === "bye") { P[m.pid].parti = true; envoyerPersos(); maj(); return; } if (etait && m.m === "vie" && !P[m.pid].exclu) { P[m.pid].parti = false; envoyerPersos(); maj(); } }
    if (m.m === "vie" && m.pid && !P[m.pid]) { envoyer(topic, {m: "qui", pour: m.pid}); return; }
    if (m.m === "vie" || m.m === "bye") return;
    if (m.m === "ici") {
      /* 9 nov. : même prénom = même joueur qui revient (iPad planté, QR rescanné : nouvel identifiant) → il reprend ses points.
         Même prénom qu'un autre joueur encore présent avec un autre personnage → refusé (deux fois le même prénom interdit). */
      const nrm = x => String(x || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
      const dbl = Object.entries(P).find(([id, p]) => id !== m.pid && !p.exclu && nrm(p.nom) === nrm(m.nom));
      if (dbl) { const [oid, op] = dbl, absent = op.parti || Date.now() - (op.vu || 0) > 25000;
        if (op.av === m.av || absent) { P[m.pid] = op; delete P[oid]; if (G.reps[oid]) { G.reps[m.pid] = G.reps[oid]; delete G.reps[oid]; } envoyer(topic, {m: "remplace", pour: oid}); }
        else { envoyer(topic, {m: "refus", pour: m.pid, raison: "nom"}); return; } }
      if (m.av != null && Object.entries(P).some(([id, p]) => !p.parti && p.av === m.av && id !== m.pid)) { envoyer(topic, {m: "refus", pour: m.pid}); return; }
      if ((!P[m.pid] || P[m.pid].parti) && ids().length >= MAX_J) { envoyer(topic, {m: "refus", pour: m.pid, raison: "plein", max: MAX_J}); return; }
      if (P[m.pid]) P[m.pid].exclu = false;
      if (!P[m.pid]) P[m.pid] = {nom: m.nom, pts: 0, bons: 0}; else P[m.pid].nom = m.nom;
      P[m.pid].av = m.av; P[m.pid].prenom = m.prenom || ""; P[m.pid].parti = false; P[m.pid].vu = Date.now(); envoyerPersos();
      if (G.etat === "question") envoyer(topic, qMsg(m.pid));
      else if (G.etat === "mise") envoyer(topic, {m: "mise", pts: {[m.pid]: P[m.pid].pts}});
      else envoyer(topic, {m: "bienvenue", pour: m.pid, titre: G.quiz ? G.quiz.titre : "", coul: R().coul, mode: R().mode});
      maj();
    } else if (m.m === "main" && P[m.pid]) { (G.mains = G.mains || new Set()).add(m.pid); maj();   /* main levée anonyme : on compte, on ne nomme jamais */
    } else if (m.m === "mainsRaz") { G.mains = new Set(); maj();
    } else if (m.m === "indice" && G.etat === "question" && m.i === G.i && P[m.pid] && !G.reps[m.pid] && R().indice === "oui") {
      /* 13 nov. (Jeremy) : indice à 500 points = 2 mauvais choix enlevés (1 s'il n'y a que 3 choix) */
      const J = P[m.pid], Q = G.jeu[G.i];
      if (J.ind !== G.i) {
        if ((J.pts || 0) < 500) { envoyer(topic, {m: "indiceR", pour: m.pid, i: G.i, non: true}); return; }
        const faux = Q.ch.map((_, k) => k).filter(k => k !== Q.bon).sort(() => Math.random() - .5);
        J.pts -= 500; J.ind = G.i; J.indR = faux.slice(0, Q.ch.length >= 4 ? 2 : 1); maj();
      }
      envoyer(topic, {m: "indiceR", pour: m.pid, i: G.i, ret: J.indR});
    } else if (m.m === "vtrv" && G.etat === "vtr" && P[m.pid] && (P[m.id] || m.id === "passe")) { G.vtr[m.pid] = m.id; maj(); envoyer(topic, vueObj());
    } else if (m.m === "miser" && G.etat === "mise" && P[m.pid]) { P[m.pid].mise = !!m.oui; maj();
    } else if (m.m === "diapoQ" && G.jeu[m.i] && G.jeu[m.i].ref) {   /* l'écran (2e appareil) n'a pas la diapo : on lui envoie une version légère */
      DIA.obtenir(G.jeu[m.i].ref).then(d => d ? DIA.leger(d) : G.jeu[m.i].img).then(d => { if (d) envoyer(topic, {m: "img", i: m.i, data: d}); });
    } else if (m.m === "rep" && m.i === G.i && P[m.pid] && G.reps[m.pid]) {
      envoyer(topic, {m: "recu", pour: m.pid, i: m.i});   /* réponse renvoyée (réseau lent) : déjà notée, on confirme encore */
    } else if (m.m === "rep" && G.etat === "question" && m.i === G.i && P[m.pid] && !G.reps[m.pid]) {
      G.reps[m.pid] = {c: m.c, ms: Date.now() - G.t0}; envoyer(topic, {m: "recu", pour: m.pid, i: m.i}); maj();
      if (Object.keys(G.reps).length >= ids().length) setTimeout(reveler, 700);
    }
  }, ok => { $("etatT").textContent = ok ? "● Relais connecté" + (window.supabase ? " (Supabase)" : " (ntfy)") : "○ Relais injoignable, nouvel essai…"; $("etatT").style.color = ok ? "var(--vert)" : "var(--rouge)"; });

  /* ----- liste des quiz ----- */
  function montrer(v){ ["vChoix", "vEdit", "vJeu", "vColler"].forEach(x => $(x).classList.toggle("cache", x !== v)); }
  function avis(t){ $("quizListe").insertAdjacentHTML("afterbegin", `<div class="ko" style="margin-bottom:8px">${esc(t)}</div>`); }
  function sauverListe(L){
    /* chaque quiz garde l'heure de sa dernière modification (maj) et chaque suppression est notée (quizSupprimes) : le coffre fusionne quiz par quiz entre deux appareils */
    const avant = {}, now = Date.now(); mesQuiz().forEach(q => avant[q.id] = q);
    L.forEach(q => { const a = avant[q.id]; if (!a) { q.maj = q.maj || now; return; } const x = Object.assign({}, a), y = Object.assign({}, q); delete x.maj; delete y.maj; if (JSON.stringify(x) !== JSON.stringify(y)) q.maj = now; else q.maj = a.maj || q.maj || 0; });
    const sup = stock.get("quizSupprimes", {}), ids = new Set(L.map(q => q.id)); let s2 = false;
    Object.keys(avant).forEach(id => { if (!ids.has(id)) { sup[id] = now; s2 = true; } });
    L.forEach(q => { if (sup[q.id] && sup[q.id] < (q.maj || 0)) { delete sup[q.id]; s2 = true; } });
    if (s2) stock.set("quizSupprimes", sup);
    if (!stock.set("quizMaison", L)) { avis("Mémoire de l'appareil pleine : enlève des images ou des quiz."); return false; } return true; }
  window.__listeQuiz = () => { if (!$("vChoix").classList.contains("cache")) listeQuiz(); };
  function listeQuiz(){
    const carte = q => { const c = (q.reg || {}).coul || REG_DEF.coul, pr = estPres(q), d1 = pr && (q.qs.find(x => x.t === "diapo") || {}).img, cv = q.couv || d1;
      const nd = q.qs.filter(x => x.t === "diapo").length, nq = q.qs.filter(x => !HORS_Q(x)).length;
      return `<div class="cq"><div class="im${q.livre && q.couv ? " livre" : ""}" style="--c:${esc(c)};${cv ? (q.livre ? `--u:url('${esc(cv)}')` : `background-image:url('${esc(cv)}')`) : ""}"><span>${pr ? `Présentation · ${nd} diapos · ${nq} question${nq > 1 ? "s" : ""}` : q.qs.length + " questions"}</span></div>
      <div class="co"><b>${esc(q.titre)}</b><span class="sous">${esc(q.sujet || (q.exemple ? "Défi+ d'exemple" : ""))}</span>
      <button class="jouer" data-jouer="${q.id}" style="background:${bord ? "#EB6A22" : esc(c)}">Jouer</button>
      <div class="pt">${q.fixe ? "" : q.exemple ? `<button class="btn2" data-copier="${q.id}">Copier et modifier</button>` : `<button class="btn2" data-modif="${q.id}">Modifier</button><button class="btn2" data-dupl="${q.id}">Dupliquer</button><button class="btn2" data-export="${q.id}">Exporter</button><button class="btn2" data-suppr="${q.id}">Supprimer</button>`}</div></div></div>`; };
    const miens = tousQuiz().filter(q => !q.exemple), prets = tousQuiz().filter(q => q.exemple);
    $("quizMiens").innerHTML = miens.map(carte).join("") || '<div class="sous" style="grid-column:1/-1;padding:6px 2px">Tu n\'as pas encore de quiz. Crée-en un, colle une liste de questions, ou pars d\'un quiz prêt à jouer avec « Copier et modifier ».</div>';
    $("quizListe").innerHTML = prets.map(carte).join(""); if ($("pretsN")) $("pretsN").textContent = "(" + prets.length + ")";
    const trouve = id => JSON.parse(JSON.stringify(tousQuiz().find(q => q.id === id)));
    document.querySelectorAll("[data-jouer]").forEach(b => b.onclick = () => {
      if (bord) { modes(b.dataset.jouer); return; }
      G.quiz = trouve(b.dataset.jouer); G.etat = "lobby"; G.i = -1; G.jeu = []; G.bilan = []; G.dbl = false; G.dblFait = []; appliquerCouleur(); montrer("vJeu");
      envoyer(topic, {m: "bienvenue", titre: G.quiz.titre, coul: R().coul, mode: R().mode}); envoyerCouv(); maj();
    });
    document.querySelectorAll("[data-modif]").forEach(b => b.onclick = () => editer(trouve(b.dataset.modif)));
    document.querySelectorAll("[data-copier],[data-dupl]").forEach(b => b.onclick = () => { const q = trouve(b.dataset.copier || b.dataset.dupl); delete q.exemple; q.id = "q" + Date.now(); q.titre += " (copie)"; editer(q); });
    document.querySelectorAll("[data-export]").forEach(b => b.onclick = () => {
      const q = trouve(b.dataset.export), a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify({type: "quiz-pavillon", quiz: q})], {type: "application/json"}));
      a.download = q.titre.replace(/[^\w\-àâçéèêëîïôûùüÿ ]/gi, "").slice(0, 50) + ".quiz.json"; a.click();
    });
    document.querySelectorAll("[data-suppr]").forEach(b => b.onclick = () => {
      if (b.dataset.sur !== "1") { b.dataset.sur = "1"; b.textContent = "Sûr ? Touche encore"; setTimeout(() => { b.dataset.sur = ""; b.textContent = "Supprimer"; }, 3000); return; }
      sauverListe(mesQuiz().filter(q => q.id !== b.dataset.suppr)); listeQuiz();
    });
  }
  $("bImport").onclick = () => $("fImport").click();
  $("bSauveTout").onclick = () => { const L = mesQuiz(); if (!L.length) { avis("Tu n'as pas encore de quiz à sauvegarder."); return; }
    const a = document.createElement("a"), d = new Date().toLocaleDateString("en-CA");
    a.href = URL.createObjectURL(new Blob([JSON.stringify({type: "quiz-pavillon-lot", date: new Date().toISOString(), quiz: L, reglages: stock.get("quizReglages", {})})], {type: "application/json"}));
    a.download = "mes-quiz-" + d + ".quiz.json"; a.click(); };
  $("fImport").onchange = async () => {
    const f = $("fImport").files[0]; if (!f) return;
    try { const d = JSON.parse(await f.text());
      if (d.type === "quiz-pavillon-lot" && Array.isArray(d.quiz)) {   /* restaurer une sauvegarde : mêmes quiz (mêmes identifiants), le plus récent gagne, rien en double */
        const L = mesQuiz(), parId = {}; L.forEach((q, i) => parId[q.id] = i); let n = 0;
        d.quiz.forEach(q => { if (!q || !q.titre || !Array.isArray(q.qs)) return; if (parId[q.id] == null) { L.push(q); n++; } else if ((q.maj || 0) > (L[parId[q.id]].maj || 0)) { L[parId[q.id]] = q; n++; } });
        if (d.reglages) stock.set("quizReglages", Object.assign({}, d.reglages, stock.get("quizReglages", {})));
        sauverListe(L); listeQuiz(); avis(n ? n + " quiz récupéré(s) de la sauvegarde." : "Tous les quiz de cette sauvegarde sont déjà là."); $("fImport").value = ""; return; }
      const q = d.quiz || d; if (!q.titre || !Array.isArray(q.qs)) throw 0;
      q.id = "q" + Date.now(); delete q.exemple; sauverListe(mesQuiz().concat([q])); listeQuiz(); }
    catch(e) { avis("Ce fichier n'est pas un quiz."); }
    $("fImport").value = "";
  };
  /* ----- coller du texte ----- */
  $("bColler").onclick = () => { $("tColler").value = ""; $("cMsg").textContent = ""; montrer("vColler"); };
  $("cAnnule").onclick = () => montrer("vChoix");
  $("cOk").onclick = () => {
    const blocs = $("tColler").value.split(/\n\s*\n/).map(b => b.split("\n").map(l => l.trim()).filter(Boolean)).filter(b => b.length);
    const qs = [], err = [];
    blocs.forEach((b, k) => {
      const Q = {q: "", ch: [], bon: -1, s: 20, expl: ""}, bons = [], etapes = [];
      b.forEach(l => {
        let mm;
        if ((mm = /^=\s*([-\d.,]+)\s*(?:±\s*([\d.,]+))?\s*(.*)$/.exec(l))) { Q.t = "nombre"; Q.bon = num(mm[1]); if (mm[2]) Q.tol = num(mm[2]); if (mm[3]) Q.u = mm[3].trim(); Q.s = 45; }
        else if ((mm = /^\d+[.)]\s+(.+)$/.exec(l)) && Q.q) etapes.push(mm[1]);
        else if (/^\*/.test(l)) { bons.push(Q.ch.length); Q.bon = Q.ch.length; Q.ch.push(l.replace(/^\*\s*/, "")); }
        else if (/^-/.test(l)) Q.ch.push(l.replace(/^-\s*/, ""));
        else if (/^\?/.test(l)) Q.expl = l.replace(/^\?\s*/, "");
        else Q.q = Q.q ? Q.q + " " + l : l;
      });
      if (bons.length > 1) { Q.t = "multi"; Q.bon = bons; Q.s = 25; }
      if (etapes.length >= 3) { Q.t = "ordre"; Q.ch = etapes.slice(0, 6); Q.bon = Q.ch.map((_, j) => j); Q.s = 40; }
      if (Q.t === "nombre") { if (!Q.q || isNaN(Q.bon)) err.push(k + 1); else { Q.ch = []; qs.push(Q); } }
      else if (Q.t === "ordre") { if (!Q.q) err.push(k + 1); else qs.push(Q); }
      else if (!Q.q || Q.ch.length < 2 || Q.ch.length > 4 || Q.bon < 0) err.push(k + 1); else qs.push(Q);
    });
    if (!qs.length) { $("cMsg").textContent = "Aucune question reconnue. Vérifie les * et les -."; return; }
    editer({id: "q" + Date.now(), titre: "", reg: Object.assign({}, REG_DEF), qs});
    if (err.length) $("eQs").insertAdjacentHTML("beforebegin", `<div class="ko" id="eErr" style="margin-bottom:8px">Bloc(s) ignoré(s) : ${err.join(", ")} (il faut une question, 2 à 4 choix et une *).</div>`);
  };
  /* ----- éditeur ----- */
  let ed = null;
  /* Question proposée (10 nov., « des questions de base s'ajoutent par rapport aux diapos ») : à partir du texte des diapos depuis la dernière question,
     un mot clé est caché dans une phrase (« Complète ») et 3 autres mots des diapos servent de mauvais choix. Toujours à vérifier par l'enseignant. */
  const VIDES = new Set("alors aussi autre autres avant avec avoir cette celle celui ceux comme dans depuis donc elle elles entre est etre être faire fait leur leurs mais même nous notre nos pour plus quand quel quelle quels quelles sans selon sont sous tous tout toute toutes très vous votre vos cela ceci ainsi chez dont lors être était sera peut peuvent doit doivent permet entre chaque autres plusieurs page diapo exemple".split(" "));
  const sansAcc = w => w.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const motsDe = t => (String(t || "").match(/[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'-]{4,}/g) || []).map(w => w.replace(/^[ldjmnst]'/i, "")).filter(w => w.length >= 5 && !VIDES.has(sansAcc(w)));
  function proposer(k){
    let a = k; while (a > 0 && typeDe(ed.qs[a - 1]) === "diapo") a--;
    const D = ed.qs.slice(a, k + 1).filter(x => typeDe(x) === "diapo" && x.txt); if (!D.length) return null;
    const tous = [...new Set(ed.qs.filter(x => x.txt).flatMap(x => motsDe(x.txt)))];
    const phrases = D.flatMap(x => x.txt.split(/\n|(?<=[.!?:;])\s+/)).map(p => p.replace(/^[\s•●▪◦‣·*–-]+/, "").trim()).filter(p => p.split(/\s+/).length >= 4 && p.length <= 140 && motsDe(p).length);
    for (const p of phrases.sort(() => Math.random() - .5)) {
      const cand = motsDe(p).sort((x, y) => y.length - x.length).slice(0, 3); const m = cand[Math.floor(Math.random() * cand.length)];
      const autres = tous.filter(w => sansAcc(w) !== sansAcc(m) && Math.abs(w.length - m.length) <= 4 && !p.toLowerCase().includes(w.toLowerCase())).sort(() => Math.random() - .5).slice(0, 3);
      if (autres.length < 3) continue;
      const ch = [m, ...autres].sort(() => Math.random() - .5);
      return {q: "Complète : « " + p.replace(m, "_____") + " »", ch, bon: ch.indexOf(m), s: 25, expl: "", auto: 1};
    }
    return null; }
  function qVide(t){
    if (t === true || t === "vf") return {q: "", ch: ["Vrai", "Faux"], bon: 0, s: 15, expl: ""};
    if (t === "multi") return {t, q: "", ch: ["", "", "", ""], bon: [], s: 25, expl: ""};
    if (t === "ordre") return {t, q: "Place ces étapes dans le bon ordre.", ch: ["", "", "", ""], bon: [0, 1, 2, 3], s: 40, expl: ""};
    if (t === "nombre") return {t, q: "", ch: [], bon: "", tol: 0, u: "", s: 45, expl: ""};
    if (t === "estim") return {t, q: "", ch: [], bon: "", tol: 10, u: "", s: 30, expl: ""};
    if (t === "paires") return {t, q: "Associe chaque élément à ce qui va avec.", g: ["", "", "", ""], ch: ["", "", "", ""], bon: [0, 1, 2, 3], s: 45, expl: ""};
    if (t === "erreur") return {t, q: "Trouve l'erreur dans cette phrase.", ch: ["", "", "", ""], bon: 0, s: 30, expl: ""};
    if (t === "nuage") return {t, q: "", ch: [], bon: null, s: 45, expl: ""};
    if (t === "connexion") return {t, q: "", s: 0};
    if (t === "sondage") return {t, q: "", ch: ["", "", "", ""], bon: null, s: 30, expl: ""};
    if (t === "echelle") return {t, q: "Je suis à l'aise avec cette notion.", ch: ["1", "2", "3", "4", "5"], bon: null, s: 20, expl: ""};
    return {q: "", ch: ["", "", "", ""], bon: 0, s: 20, expl: ""};
  }
  function editer(q){
    const e = $("eErr"); if (e) e.remove();
    ed = JSON.parse(JSON.stringify(q || {id: "q" + Date.now(), titre: "", qs: [qVide()]}));
    ed.reg = Object.assign({}, REG_DEF, ed.reg);
    $("eTitre").value = ed.titre; $("eSujet").value = ed.sujet || ""; dessinerCouv(); dessinerReg(); dessinerEd(); montrer("vEdit");
  }
  /* images des quiz en WebP (≈ 3 fois plus léger que le JPEG, aussi net au tableau); JPEG si le navigateur ne sait pas faire de WebP */
  function versWebp(c){ const w = c.toDataURL("image/webp", .72); return w.startsWith("data:image/webp") ? w : c.toDataURL("image/jpeg", .78); }
  /* une fois : recompresser les images des quiz déjà faits (JPEG lourds → WebP) */
  async function recompresserQuiz(){
    let L; try { L = JSON.parse(localStorage.getItem("quizMaison") || "[]"); } catch(e){ return; } if (!Array.isArray(L)) return;
    const reduire = (d, max) => new Promise(ok => { if (typeof d !== "string" || !d.startsWith("data:image/") || d.startsWith("data:image/webp") || d.length < 80000) return ok(d);
      const im = new Image(); im.onload = () => { const k = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement("canvas");
        c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        const n = versWebp(c); ok(n.length < d.length ? n : d); }; im.onerror = () => ok(d); im.src = d; });
    let change = false;
    for (const q of L){ if (q.couv){ const n = await reduire(q.couv, 1200); if (n !== q.couv){ q.couv = n; change = true; } }
      for (const x of (q.qs || [])) if (x.img){ const n = await reduire(x.img, 800); if (n !== x.img){ x.img = n; change = true; } } }
    if (change) try { localStorage.setItem("quizMaison", JSON.stringify(L)); } catch(e){} }
  setTimeout(() => recompresserQuiz().catch(() => {}), 3000);
  function choisirImage(max, fait){
    const f = document.createElement("input"); f.type = "file"; f.accept = "image/*";
    f.onchange = () => { const fi = f.files[0]; if (!fi) return; const im = new Image();
      im.onload = () => { const k = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement("canvas");
        c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        fait(versWebp(c)); URL.revokeObjectURL(im.src); };
      im.src = URL.createObjectURL(fi); };
    f.click();
  }
  function dessinerCouv(){
    $("eCouv").innerHTML = ed.couv ? `<img src="${esc(ed.couv)}" alt="" style="height:70px;border-radius:8px"><button class="btn2" id="eCouvX">Retirer l'image du tableau</button>` : `<button class="btn2" id="eCouvB">+ Image du module (affichée au tableau pendant l'accueil)</button>`;
    if ($("eCouvB")) $("eCouvB").onclick = () => choisirImage(1200, d => { ed.couv = d; dessinerCouv(); });
    if ($("eCouvX")) $("eCouvX").onclick = () => { delete ed.couv; dessinerCouv(); };
  }
  function dessinerReg(){
    document.querySelectorAll(".seg[data-r]").forEach(s => s.querySelectorAll("button").forEach(b => {
      b.classList.toggle("on", ed.reg[s.dataset.r] === b.dataset.v);
      b.onclick = () => { ed.reg[s.dataset.r] = b.dataset.v; dessinerReg(); };
    }));
    $("eCoul").innerHTML = COULEURS.map(c => `<button style="background:${c}" class="${ed.reg.coul === c ? "on" : ""}" data-c="${c}" aria-label="Couleur"></button>`).join("");
    $("eCoul").querySelectorAll("button").forEach(b => b.onclick = () => { ed.reg.coul = b.dataset.c; dessinerReg(); });
    document.documentElement.style.setProperty("--acc", ed.reg.coul);
  }
  function lireEd(){
    ed.titre = $("eTitre").value.trim(); ed.sujet = $("eSujet").value.trim();
    document.querySelectorAll(".qe").forEach((d, k) => {
      const Q = ed.qs[k], t = typeDe(Q);
      if (t === "connexion") return;
      if (t === "diapo") { const sm = d.querySelector(".dmv"); if (sm) { if (sm.value) Q.mv = sm.value; else delete Q.mv; } return; }
      Q.q = d.querySelector(".tq").value.trim();
      Q.s = +d.querySelector("select.ts").value;
      Q.expl = d.querySelector(".ex").value.trim();
      if (t === "nuage") { Q.ch = []; Q.bon = null; return; }
      if (t === "echelle") { Q.ch = ["1", "2", "3", "4", "5"]; Q.bon = null; return; }
      if (t === "sondage") { Q.ch = [...d.querySelectorAll(".tc")].map(x => x.value.trim()); Q.bon = null; return; }
      if (t === "paires") Q.g = [...d.querySelectorAll(".tg")].map(x => x.value.trim());
      if (t === "nombre" || t === "estim") { Q.bon = num(d.querySelector(".nbR").value); Q.tol = num(d.querySelector(".nbT").value) || (t === "estim" ? 10 : 0); Q.u = d.querySelector(".nbU").value.trim(); Q.ch = []; return; }
      Q.ch = [...d.querySelectorAll(".tc")].map(x => x.value.trim());
      if (t === "multi") Q.bon = [...d.querySelectorAll("input[type=checkbox]:checked")].map(x => +x.value);
      else if (t === "ordre" || t === "paires") Q.bon = Q.ch.map((_, j) => j);
      else Q.bon = +((d.querySelector("input[type=radio]:checked") || {}).value || 0);
      const z = d.querySelector(".zsel"); if (z) { if (z.value === "zoom") Q.zoom = Q.zoom || {x: 50, y: 50}; else delete Q.zoom; }
    });
  }
  function dessinerEd(){
    let nQ = 0, nD = 0; const pr = estPres(ed) || !!$("ePres");
    $("eH2").textContent = pr ? "Créer ou modifier une présentation" : "Créer ou modifier un quiz"; $("eTitreL").textContent = pr ? "Titre de la présentation" : "Titre du quiz";
    $("eTitre").placeholder = pr ? "Ex. : Les raccords en cuivre" : "Ex. : Les robinets d'arrêt";
    $("eQs").innerHTML = ed.qs.map((Q, k) => {
      if (typeDe(Q) === "connexion") return `<div class="qe diapo" data-t="connexion"><div class="tete"><strong>Page de connexion des élèves</strong>
        <button class="btn2" data-mv="${k},-1" ${k ? "" : "disabled"} aria-label="Monter">↑</button><button class="btn2" data-mv="${k},1" ${k < ed.qs.length - 1 ? "" : "disabled"} aria-label="Descendre">↓</button>
        <button class="btn2" data-del="${k}" ${ed.qs.length < 2 ? "disabled" : ""}>Retirer</button></div><div class="sous">Le code QR et les étapes pour se connecter s'affichent ici. Les diapos d'avant se présentent sans les élèves.</div></div>`;
      if (typeDe(Q) === "diapo") { nD++; return `<div class="qe diapo" data-t="diapo"><div class="tete"><strong>Diapo ${nD}</strong>
        <button class="btn2" data-mv="${k},-1" ${k ? "" : "disabled"} aria-label="Monter">↑</button><button class="btn2" data-mv="${k},1" ${k < ed.qs.length - 1 ? "" : "disabled"} aria-label="Descendre">↓</button>
        <button class="btn2" data-del="${k}" ${ed.qs.length < 2 ? "disabled" : ""}>Retirer</button>
        <select class="dmv" aria-label="Mouvement" title="Comment la diapo arrive au tableau"><option value="">Fondu</option><option value="kb" ${Q.mv === "kb" ? "selected" : ""}>Zoom lent (photo)</option><option value="focus" ${Q.mv === "focus" ? "selected" : ""}>Mise au point</option></select></div>
        <div class="diaE"><img src="${Q.img}" alt="Diapo ${nD}"><button class="btn2 apres" data-apres="${k}">+ Question ici</button></div></div>`; }
      nQ++;
      const t = typeDe(Q), vf = t === "choix" && Q.ch.length === 2 && /^vrai$/i.test(Q.ch[0]) && /^faux$/i.test(Q.ch[1]);
      const nom = vf ? "vrai ou faux" : t === "choix" ? (Q.zoom ? "zoom mystère" : "") : TYPES[t].toLowerCase();
      const tps = `<select class="ts" aria-label="Temps">${[...new Set([10, 15, 20, 25, 30, 40, 45, 60, 90, +Q.s || 20])].sort((x, y) => x - y).map(s => `<option value="${s}" ${(+Q.s || 20) === s ? "selected" : ""}>${s} s</option>`).join("")}</select>`;
      let corps = "", aide = "Coche le rond de la bonne réponse.";
      if (t === "echelle") { corps = '<div class="echE"><span>1 · pas du tout</span><span>2</span><span>3</span><span>4</span><span>5 · tout à fait</span></div>'; aide = "Pas de points : chaque élève dit de 1 à 5 s'il se sent à l'aise. Le tableau montre la moyenne, sans les noms."; }
      else if (t === "sondage") { corps = Array.from({length: 4}, (_, c) => `<div class="ln"><b class="num">${SYMB[c]}</b><input class="tc" placeholder="Choix ${c + 1}${c >= 2 ? " (facultatif)" : ""}" value="${esc(Q.ch[c] || "")}" maxlength="80"></div>`).join(""); aide = "Pas de bonne réponse ni de points : la classe vote et le tableau montre les résultats en barres."; }
      else if (t === "nuage") { corps = ""; aide = "Pas de bonne réponse ni de points : chaque élève écrit un mot ou deux, et les mots apparaissent au tableau. Plus un mot revient, plus il est gros."; }
      else if (t === "nombre") { corps = `<div class="nbE"><label>Bonne réponse<input class="nbR" inputmode="decimal" value="${Q.bon === "" || Q.bon == null || isNaN(Q.bon) ? "" : esc(fmtN(Q.bon))}" placeholder="ex. 15,4"></label><label>Marge acceptée (±)<input class="nbT" inputmode="decimal" value="${+Q.tol ? esc(fmtN(+Q.tol)) : ""}" placeholder="0"></label><label>Unité<input class="nbU" value="${esc(Q.u || "")}" placeholder="ex. VA, GPM, m" maxlength="12"></label></div>`; aide = "L'élève tape un nombre; la virgule ou le point sont acceptés."; }
      else if (t === "paires") { corps = Array.from({length: 4}, (_, c) => `<div class="ln"><b class="num">${c + 1}</b><input class="tg" placeholder="Élément ${c + 1}${c >= 3 ? " (facultatif)" : ""}" value="${esc((Q.g || [])[c] || "")}" maxlength="60"><input class="tc" placeholder="Ce qui va avec" value="${esc(Q.ch[c] || "")}" maxlength="60"></div>`).join(""); aide = "Écris chaque paire sur la même ligne. Les réponses de droite seront mêlées au tableau."; }
      else if (t === "estim") { corps = `<div class="nbE"><label>Bonne réponse<input class="nbR" inputmode="decimal" value="${Q.bon === "" || Q.bon == null || isNaN(Q.bon) ? "" : esc(fmtN(Q.bon))}" placeholder="ex. 1200"></label><label>Marge acceptée (%)<input class="nbT" inputmode="decimal" value="${esc(fmtN(+Q.tol || 10))}" placeholder="10"></label><label>Unité<input class="nbU" value="${esc(Q.u || "")}" placeholder="ex. $, kg, L" maxlength="12"></label></div>`; aide = "L'élève estime sans calculer. Bonne réponse s'il est dans la marge (ex. 10 % de 1200 = entre 1080 et 1320). Au tableau, on voit toutes les estimations sur une ligne."; }
      else if (t === "ordre") { const n = Math.max(3, Math.min(6, Q.ch.length)); corps = Array.from({length: n}, (_, c) => `<div class="ln"><b class="num">${c + 1}</b><input class="tc" placeholder="Étape ${c + 1}${c >= 3 ? " (facultatif)" : ""}" value="${esc(Q.ch[c] || "")}" maxlength="80"></div>`).join("") + (n < 6 ? `<button class="btn2 petit" data-plus="${k}">+ Une étape</button>` : ""); aide = "Écris les étapes dans le bon ordre : elles seront mêlées pendant la partie."; }
      else if (t === "multi") { corps = Array.from({length: 4}, (_, c) => `<div class="ln"><input type="checkbox" value="${c}" ${(Q.bon || []).includes(c) ? "checked" : ""} title="Bonne réponse"><input class="tc" placeholder="Choix ${c + 1}${c >= 2 ? " (facultatif)" : ""}" value="${esc(Q.ch[c] || "")}" maxlength="80"></div>`).join(""); aide = "Coche toutes les bonnes réponses (au moins une). L'élève doit les trouver toutes."; }
      else if (t === "erreur") { corps = Array.from({length: 4}, (_, c) => `<div class="ln"><input type="radio" name="b${k}" value="${c}" ${Q.bon === c ? "checked" : ""} title="Le morceau faux"><input class="tc" placeholder="Morceau ${c + 1} de la phrase${c >= 2 ? " (facultatif)" : ""}" value="${esc(Q.ch[c] || "")}" maxlength="90"></div>`).join(""); aide = "Coupe la phrase en morceaux, dans l'ordre. Coche le morceau qui contient l'erreur."; }
      else corps = Array.from({length: vf ? 2 : 4}, (_, c) => `<div class="ln"><input type="radio" name="b${k}" value="${c}" ${Q.bon === c ? "checked" : ""} title="Bonne réponse"><input class="tc" placeholder="${c < 2 ? "Choix " + (c + 1) : "Choix " + (c + 1) + " (facultatif)"}" value="${esc(Q.ch[c] || "")}" maxlength="80" ${vf ? "readonly" : ""} style="border-left:8px solid #B9B3A9"></div>`).join("");
      const zoomOk = Q.img && ["choix", "multi"].includes(t);
      const imgBloc = Q.img ? `<div class="imgE"><div class="vignette ${Q.zoom ? "z" : ""}" data-zimg="${k}"><img src="${Q.img}" alt="">${Q.zoom ? `<i style="left:${Q.zoom.x}%;top:${Q.zoom.y}%"></i>` : ""}</div>
          <div>${zoomOk ? `<select class="zsel" data-zk="${k}"><option value="">Image entière</option><option value="zoom" ${Q.zoom ? "selected" : ""}>Zoom mystère (un morceau agrandi)</option></select>${Q.zoom ? '<div class="sous">Touche l\'image pour choisir le morceau à montrer.</div>' : ""}` : ""}
          <button class="btn2" data-noimg="${k}">Retirer l'image</button></div></div>` : `<button class="btn2" data-img="${k}">+ Image (affichée au tableau)</button>`;
      if (Q.auto) aide = "Question proposée à partir des diapos : vérifie-la et change-la au besoin. " + aide;
      return `<div class="qe" data-t="${t}"><div class="tete"><b>Question ${nQ}${nom ? " · " + nom : ""}</b>${tps}
      <button class="btn2" data-mv="${k},-1" ${k ? "" : "disabled"} aria-label="Monter">↑</button><button class="btn2" data-mv="${k},1" ${k < ed.qs.length - 1 ? "" : "disabled"} aria-label="Descendre">↓</button>
      <button class="btn2" data-del="${k}" ${ed.qs.length < 2 ? "disabled" : ""}>Retirer</button><button class="btn2" data-voir="${k}">Aperçu</button></div>
      <input class="tq" placeholder="${t === "sondage" ? "La question (ex. : Quel sujet veux-tu revoir ?)" : t === "echelle" ? "L'énoncé (ex. : Je suis capable de souder un raccord en cuivre.)" : t === "nuage" ? "La question (ex. : Un mot qui te vient en tête quand tu penses à la sécurité ?)" : t === "nombre" ? "La question (ex. : 2 moteurs de 7,7 VA : combien de VA en tout ?)" : "La question"}" value="${esc(Q.q)}" maxlength="180" style="margin-top:8px">
      ${corps}
      <textarea class="ex" placeholder="Explication affichée après la réponse (facultatif)" maxlength="240">${esc(Q.expl || "")}</textarea>
      <div class="img">${imgBloc}<span class="sous">${aide}</span></div></div>`;
    }).join("");
    document.querySelectorAll("[data-del]").forEach(b => b.onclick = () => { lireEd(); ed.qs.splice(+b.dataset.del, 1); dessinerEd(); });
    document.querySelectorAll("[data-apres]").forEach(b => b.onclick = () => { lireEd(); const k = +b.dataset.apres + 1; ed.qs.splice(k, 0, proposer(k - 1) || qVide()); dessinerEd();
      setTimeout(() => { const q = document.querySelectorAll(".qe")[k]; if (q) { q.scrollIntoView({block: "center", behavior: "smooth"}); const f = q.querySelector(".tq"); if (f) f.focus(); } }, 50); });
    document.querySelectorAll("[data-voir]").forEach(b => b.onclick = () => { lireEd(); apercuQ(ed.qs[+b.dataset.voir]); });
    document.querySelectorAll("[data-mv]").forEach(b => b.onclick = () => { lireEd(); const [k, d] = b.dataset.mv.split(",").map(Number); const t = ed.qs[k]; ed.qs[k] = ed.qs[k + d]; ed.qs[k + d] = t; dessinerEd(); });
    document.querySelectorAll("[data-plus]").forEach(b => b.onclick = () => { lireEd(); ed.qs[+b.dataset.plus].ch.push(""); dessinerEd(); });
    document.querySelectorAll("[data-noimg]").forEach(b => b.onclick = () => { lireEd(); delete ed.qs[+b.dataset.noimg].img; delete ed.qs[+b.dataset.noimg].zoom; dessinerEd(); });
    document.querySelectorAll(".zsel").forEach(s => s.onchange = () => { lireEd(); dessinerEd(); });
    document.querySelectorAll("[data-zimg]").forEach(v => v.onclick = e => { const Q = ed.qs[+v.dataset.zimg]; if (!Q.zoom) return; const r = v.getBoundingClientRect();
      lireEd(); Q.zoom = {x: Math.round(100 * (e.clientX - r.left) / r.width), y: Math.round(100 * (e.clientY - r.top) / r.height)}; dessinerEd(); });
    document.querySelectorAll("[data-img]").forEach(b => b.onclick = () => choisirImage(800, d => { lireEd(); ed.qs[+b.dataset.img].img = d; dessinerEd(); }));
  }
  $("bNouveau").onclick = () => editer(null);
  /* Présentation avec questions (10 nov., idée de Jeremy) : les pages d'un PowerPoint enregistré en PDF deviennent des diapos (t:"diapo", img);
     l'enseignant ajoute des questions entre les diapos (« + Question ici »). En partie : diapo au tableau, cellulaires « Regarde le tableau », rien à répondre. */
  async function pdfjsPret(){ if (window.pdfjsLib && window.pdfjsLib.getDocument) return;
    const base = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";
    await new Promise((ok, ko) => { const sc = document.createElement("script"); sc.src = base + "pdf.min.js"; sc.onload = ok; sc.onerror = ko; document.head.append(sc); });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = base + "pdf.worker.min.js"; }
  async function importerPdf(fi){
    const b = $("ePdf"), t0 = b.textContent; b.disabled = true;
    try { b.textContent = "Ouverture du PDF…"; await pdfjsPret();
      const pdf = await window.pdfjsLib.getDocument({data: await fi.arrayBuffer()}).promise, n = Math.min(pdf.numPages, 60), L = [];
      for (let i = 1; i <= n; i++){ b.textContent = "Diapo " + i + " sur " + n + "…";
        const pg = await pdf.getPage(i), v0 = pg.getViewport({scale: 1}), v = pg.getViewport({scale: 2400 / Math.max(v0.width, v0.height)}), c = document.createElement("canvas");
        c.width = Math.round(v.width); c.height = Math.round(v.height); const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height);
        await pg.render({canvasContext: x, viewport: v}).promise;
        let grand = c.toDataURL("image/webp", .9); if (!grand.startsWith("data:image/webp")) grand = c.toDataURL("image/jpeg", .92);
        const ref = "d" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); await DIA.put(ref, grand);
        const v2 = document.createElement("canvas"), kk = 480 / Math.max(c.width, c.height); v2.width = Math.round(c.width * kk); v2.height = Math.round(c.height * kk); v2.getContext("2d").drawImage(c, 0, 0, v2.width, v2.height);
        let txt = ""; try { const tc = await pg.getTextContent(); let y = null; tc.items.forEach(it => { const yy = Math.round(it.transform[5]); txt += (y !== null && Math.abs(yy - y) > 4 ? "\n" : (txt && !txt.endsWith(" ") ? " " : "")) + it.str; y = yy; }); } catch(e) {}
        L.push({t: "diapo", ref, img: v2.toDataURL("image/webp", .7), q: "", s: 0, txt: txt.replace(/[ \t]+/g, " ").trim().slice(0, 1500)}); }
      lireEd(); const vide = ed.qs.length === 1 && !ed.qs[0].q && typeDe(ed.qs[0]) !== "diapo";
      ed.qs = vide ? L : ed.qs.concat(L);
      if (!ed.titre) { ed.titre = fi.name.replace(/\.pdf$/i, "").replace(/[_-]+/g, " ").trim(); $("eTitre").value = ed.titre; }
      const pd = $("ePres"); if (pd) pd.remove();
      dessinerEd(); b.textContent = n + " diapos ajoutées" + (pdf.numPages > n ? " (60 au plus)" : "");
    } catch(e) { b.textContent = "Impossible de lire ce PDF"; }
    setTimeout(() => { b.textContent = t0; b.disabled = false; }, 3500); }
  function choisirPdf(){ const f = document.createElement("input"); f.type = "file"; f.accept = "application/pdf,.pdf"; f.onchange = () => f.files[0] && importerPdf(f.files[0]); f.click(); }
  window.__importerPdf = importerPdf;
  /* Glisser-déposer (10 nov., « drag and drop devrait fonctionner ») : un PDF déposé n'importe où dans l'éditeur ajoute ses pages comme diapos */
  (function(){ const V = $("vEdit"); if (!V) return; let n = 0;
    const pdfDe = e => [...(e.dataTransfer && e.dataTransfer.items || [])].some(i => i.kind === "file");
    const voile = on => { let v = $("eVoile"); if (!v) { v = document.createElement("div"); v.id = "eVoile"; v.innerHTML = "<b>Dépose ton PDF ici</b><span>Chaque page devient une diapo</span>"; document.body.append(v); } v.classList.toggle("on", on); };
    document.addEventListener("dragenter", e => { if (V.classList.contains("cache") || !pdfDe(e)) return; n++; voile(true); });
    document.addEventListener("dragleave", () => { if (--n <= 0) { n = 0; voile(false); } });
    document.addEventListener("dragover", e => { if (!V.classList.contains("cache") && pdfDe(e)) e.preventDefault(); });
    document.addEventListener("drop", e => { if (V.classList.contains("cache")) return; e.preventDefault(); n = 0; voile(false);
      const f = [...e.dataTransfer.files].find(x => /pdf$/i.test(x.type) || /\.pdf$/i.test(x.name));
      if (f) importerPdf(f); else { const b = $("ePdf"); b.textContent = "Dépose un fichier PDF (PowerPoint › Enregistrer sous › PDF)"; setTimeout(() => b.textContent = "+ Diapos d'un PowerPoint (PDF)", 3500); } }); })();
  $("ePdf").onclick = choisirPdf;
  if (/[?&]pres=1/.test(location.search) && bord) setTimeout(() => { editer(null);
    $("eQs").insertAdjacentHTML("beforebegin", `<div id="ePres" class="pres-deb"><b>Présentation avec questions</b><span>1. Dans PowerPoint : Fichier › Enregistrer sous › PDF.<br>2. Glisse ce PDF ici (ou touche le bouton) : chaque page devient une diapo.<br>3. Touche « + Question ici » sous une diapo pour ajouter une question.</span><button class="btn" id="ePresB">Choisir le PDF</button></div>`);
    $("ePresB").onclick = choisirPdf; }, 300);
  document.querySelectorAll("[data-aj]").forEach(b => b.onclick = () => { lireEd(); ed.qs.push(qVide(b.dataset.aj)); dessinerEd(); setTimeout(() => { const L = document.querySelectorAll(".qe"); L[L.length - 1].scrollIntoView({block: "center", behavior: "smooth"}); const q = L[L.length - 1].querySelector(".tq"); if (q) q.focus(); }, 50); });
  $("eAnnule").onclick = () => { document.documentElement.style.removeProperty("--acc"); montrer("vChoix"); listeQuiz(); };
  $("eSauve").onclick = () => {
    lireEd();
    let err = !ed.titre ? "Donne un titre au quiz." : "";
    const qs = ed.qs.map((Q, k) => {
      const t = typeDe(Q); if (t === "connexion") return {t, q: "", s: 0};
      if (t === "diapo") { if (Q.ref) DIA.envoyer(Q.ref); const o = {t, img: Q.img, q: "", s: 0}; if (Q.ref) o.ref = Q.ref; if (Q.txt) o.txt = Q.txt; if (Q.mv) o.mv = Q.mv; return o; }
      const o = {q: Q.q, s: Q.s}; if (t !== "choix") o.t = t;
      if (!Q.q && !err) err = "La question " + (k + 1) + " n'a pas de texte.";
      if (t === "nuage") { o.ch = []; o.bon = null; }
      else if (t === "echelle") { o.ch = ["1", "2", "3", "4", "5"]; o.bon = null; }
      else if (t === "sondage") { o.ch = Q.ch.filter(Boolean); o.bon = null; if (o.ch.length < 2 && !err) err = "Question " + (k + 1) + " : il faut au moins 2 choix."; }
      else if (t === "nombre") { o.ch = []; o.bon = Q.bon; if (+Q.tol) o.tol = +Q.tol; if (Q.u) o.u = Q.u; if ((isNaN(Q.bon) || Q.bon === "") && !err) err = "Question " + (k + 1) + " : écris la bonne réponse (un nombre)."; }
      else if (t === "estim") { o.ch = []; o.bon = Q.bon; o.tol = +Q.tol || 10; if (Q.u) o.u = Q.u; if ((isNaN(Q.bon) || Q.bon === "") && !err) err = "Question " + (k + 1) + " : écris la bonne réponse (un nombre)."; }
      else if (t === "paires") { const L = (Q.g || []).map((x, j) => [x, Q.ch[j]]).filter(([a, b]) => a && b); o.g = L.map(x => x[0]); o.ch = L.map(x => x[1]); o.bon = o.ch.map((_, j) => j); if (o.ch.length < 3 && !err) err = "Question " + (k + 1) + " : il faut au moins 3 paires complètes."; }
      else if (t === "ordre") { o.ch = Q.ch.filter(Boolean); o.bon = o.ch.map((_, j) => j); if (o.ch.length < 3 && !err) err = "Question " + (k + 1) + " : il faut au moins 3 étapes."; }
      else { const garde = Q.ch.map((x, c) => [x, c]).filter(([x]) => x); o.ch = garde.map(g => g[0]);
        if (t === "multi") { o.bon = garde.map((g, j) => Q.bon.includes(g[1]) ? j : -1).filter(j => j >= 0); if (!o.bon.length && !err) err = "Question " + (k + 1) + " : coche au moins une bonne réponse."; }
        else { o.bon = garde.findIndex(g => g[1] === Q.bon); if (o.bon < 0 && !err) err = "Question " + (k + 1) + " : la bonne réponse cochée doit être remplie."; }
        if (o.ch.length < 2 && !err) err = "Question " + (k + 1) + " : il faut au moins 2 choix."; }
      if (Q.expl) o.expl = Q.expl; if (Q.img) o.img = Q.img; if (Q.zoom && Q.img) o.zoom = Q.zoom; return o; });
    if (err) { $("eSauve").textContent = err; setTimeout(() => $("eSauve").textContent = "Enregistrer", 3200); return; }
    const q = {id: ed.id, titre: ed.titre, sujet: ed.sujet || "", reg: ed.reg, qs}; if (ed.couv) q.couv = ed.couv;
    const L = mesQuiz().filter(x => x.id !== q.id); L.push(q);
    if (!sauverListe(L)) return;
    document.documentElement.style.removeProperty("--acc");
    montrer("vChoix"); listeQuiz();
  };
  // tableau de bord : choisir comment afficher la partie
  function modes(id){
    const q = tousQuiz().find(x => x.id === id), r0 = Object.assign({}, REG_DEF, q.reg, reglagesDe(id)), n = q.qs.length;
    const seg = (k, opts) => `<div class="seg" data-o="${k}">${opts.map(([v, t]) => `<button data-v="${v}" class="${String(r0[k]) === v ? "on" : ""}">${t}</button>`).join("")}</div>`;
    const nbOpts = [["tout", "Toutes (" + n + ")"]].concat([10, 12, 15, 20].filter(x => x < n).map(x => [String(x), String(x)]));
    if (!nbOpts.some(([v]) => v === String(r0.nb))) r0.nb = "tout";
    document.body.insertAdjacentHTML("beforeend", `<div id="modes"><div class="bx"><h2>${esc(q.titre)}</h2>
      <div class="regRap r2${q.fixe ? " cache" : ""}">
        <h3>La partie</h3>
        <label><span>Qui joue</span>${seg("mode", [["ind", "Chaque élève"], ["eq", "En équipes"]])}</label>
        <label><span>Questions<small>un nombre = tirées au hasard</small></span>${seg("nb", nbOpts)}</label>
        <label><span>Ordre</span>${seg("melange", [["non", "Tel quel"], ["tout", "Mêlé"]])}</label>
        <label><span>Temps pour répondre</span>${seg("temps", [["moins", "Court"], ["normal", "Normal"], ["plus", "Long"]])}</label>
        <label><span>Musique</span>${seg("musique", [["oui", "Oui"], ["non", "Non"]])}</label>
        <h3>Pour les corser <button id="mExpert" class="btn2" title="Temps court + pénalité + choix cachés">Mode expert</button></h3>
        <label><span>Pénalité</span>${seg("penalite", [["non", "Non"], ["oui", "−250 si faux"]])}</label>
        <label><span>Choix cachés</span>${seg("cache", [["non", "Non"], ["oui", "5 s pour lire"]])}</label>
        <label><span>Texte des choix</span>${seg("lettres", [["non", "Au tableau"], ["oui", "Cellulaire seulement"]])}</label>
        <label><span>Indice<small>l'élève paie 500 points pour enlever des mauvais choix</small></span>${seg("indice", [["non", "Non"], ["oui", "Oui (−500)"]])}</label>
        <label><span>Double ou rien</span>${seg("double", [["non", "Non"], ["oui", "Vers 40 % et à la fin"]])}</label>
        <label><span>Tricheur <i class="infoB" role="button" tabindex="0" aria-label="Comment marche le tricheur">i</i><small>un élève secret voit les bonnes réponses; à la fin, tout le monde vote</small></span>${seg("tricheur", [["non", "Non"], ["oui", "Oui"]])}</label>
        <div class="bulleI" hidden><b>Le tricheur, c'est quoi?</b>
          <p>Un seul élève, tiré au hasard, est le tricheur. Personne ne sait qui c'est, même pas toi.</p>
          <p><b>Pendant la partie :</b> son cellulaire lui montre la bonne réponse. Il doit gagner sans que les autres s'en aperçoivent.</p>
          <p><b>À la fin :</b> 2 minutes pour discuter et accuser. Ensuite, chacun vote pour celui qu'il croit être le tricheur.</p>
          <p><b>Les points :</b></p>
          <ul><li>Tu trouves le tricheur : tu lui prends des points.</li>
          <li>Tu te trompes : tu lui donnes des points.</li>
          <li>Tu passes : rien ne change.</li>
          <li>L'animateur vote aussi : s'il se trompe, le tricheur gagne 1000 points.</li></ul></div>
      </div>
      <div class="sous">Comment veux-tu afficher la partie ?</div>
      <div class="duo"><button id="mAnim">Animer au tableau<small>Un seul ordinateur : l'écran de classe avec ses commandes en bas.</small></button>
      <button id="mTele" style="background:#3A3936">Télécommande<small>Deux écrans : la télécommande ici, l'écran de classe sur le projecteur.</small></button></div>
      <button class="btn2" id="mX" style="width:100%">Annuler</button></div></div>`);
    document.querySelectorAll("#modes .seg[data-o]").forEach(s => s.querySelectorAll("button").forEach(b => b.onclick = () => {
      s.querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b)); fixerReglage(id, s.dataset.o, b.dataset.v); }));
    if (String(r0.nb) !== String(Object.assign({}, REG_DEF, q.reg, reglagesDe(id)).nb)) fixerReglage(id, "nb", r0.nb);
    $("mExpert").onclick = () => [["temps", "moins"], ["penalite", "oui"], ["cache", "oui"]].forEach(([k, v]) => { const b = document.querySelector(`#modes .seg[data-o="${k}"] [data-v="${v}"]`); if (b) b.click(); });
    $("mAnim").onclick = () => { location.href = "?animer=1&quiz=" + encodeURIComponent(id); };
    $("mTele").onclick = () => { location.href = "?tele=1&quiz=" + encodeURIComponent(id); };
    $("mX").onclick = () => $("modes").remove();
    $("modes").onclick = e => { if (e.target.id === "modes") $("modes").remove(); };
  }
  /* 8 nov. (« quand l'enseignant change de page par erreur pendant un quiz, pas moyen de reconnecter ») :
     la partie en cours est gardée sur l'appareil (même code, mêmes joueurs, mêmes points) et reprend au retour, 3 h au plus.
     Les images des questions ne sont pas gardées (trop lourdes) : elles sont reprises du quiz d'origine. */
  function sauverPartie(){
    if (bord || !G.quiz || G.etat === "choix") return;
    try { localStorage.setItem("quizPartie", JSON.stringify({code, t: Date.now(), quiz: G.quiz.id, i: G.i, etat: G.etat, t0: G.t0, reps: G.reps, dbl: !!G.dbl, dblFait: dblFaits(), bilan: G.bilan || [],
      jeu: G.jeu.map(Q => Object.assign({}, Q, {img: Q.img ? (/^data:/.test(Q.img) ? 1 : Q.img) : 0})), P})); } catch(e) {}
  }
  function oublierPartie(){ try { localStorage.removeItem("quizPartie"); } catch(e) {} }
  // Quitter la page par le Labo ou la barre = fin de la partie (les iPad sont avisés)
  window.quitterPartie = () => { if (!G.quiz) return false; oublierPartie(); clearTimeout(minut); envoyer(topic, {m: "ferme"}); return true; };
  document.addEventListener("click", e => { const l = e.target.closest && e.target.closest("a[href]"); if (!l || /^#/.test(l.getAttribute("href")) || l.target === "_blank") return;
    if (window.quitterPartie()) { e.preventDefault(); const u = l.href; (window.top || window).setTimeout(() => { (window.top || window).location.href = u; }, 400); } }, true);
  function reprendre(){
    let S = null; try { S = JSON.parse(localStorage.getItem("quizPartie") || "null"); } catch(e) {}
    if (!S || S.code !== code || Date.now() - S.t > 3 * 3600e3) return false;
    { const qp = params.get("quiz"); if (qp && qp !== S.quiz) { try { localStorage.removeItem("quizPartie"); } catch(e) {} return false; } }   /* 11 nov. : un autre quiz choisi = nouvelle partie, pas la reprise de l'ancienne */
    const q = tousQuiz().find(x => x.id === S.quiz); if (!q) return false;
    G.quiz = JSON.parse(JSON.stringify(q)); G.i = S.i; G.etat = S.etat; G.t0 = S.t0; G.reps = S.reps || {}; G.dbl = S.dbl; G.dblFait = Array.isArray(S.dblFait) ? S.dblFait : []; G.bilan = S.bilan || [];
    let nD = 0; const DQ = G.quiz.qs.filter(x => x.t === "diapo");
    G.jeu = (S.jeu || []).map(Q => { if (Q.t === "diapo") { const o = DQ[nD++]; if (Q.img === 1 && o) Q.img = o.img; return Q; } if (Q.img === 1) { const o = G.quiz.qs.find(x => x.q === Q.q); Q.img = o && o.img || ""; } return Q; });
    Object.keys(S.P || {}).forEach(id => { P[id] = S.P[id]; if (!P[id].exclu) P[id].parti = true; });   /* absents tant qu'ils ne répondent pas à « qui » : un iPad parti ne bloque plus la fin des questions */
    envoyer(topic, {m: "qui", pour: "tous"});
    appliquerCouleur(); montrer("vJeu");
    envoyer(topic, {m: "bienvenue", titre: G.quiz.titre, coul: R().coul, mode: R().mode}); envoyerCouv(); envoyerPersos();
    const Q = G.jeu[G.i];
    if (G.etat === "question" && Q) {
      const reste = G.t0 + Q.s * 1000 + 2500 - Date.now();
      if (reste <= 0) reveler(); else { if (Q.img) envoyer(topic, {m: "img", i: G.i, data: Q.img}); ids().filter(id => !G.reps[id]).forEach(id => envoyer(topic, qMsg(id))); minut = setTimeout(reveler, reste); }
    } else if (G.etat === "mise") minut = setTimeout(question, 15000);
    else if (G.etat === "diapo") planAuto();   /* 11 nov. : une présentation reprise continue de défiler */
    maj(); envoyer(topic, vueObj());
    const t = document.createElement("div"); t.className = "repris"; t.textContent = "Partie reprise : les joueurs et les points sont conservés.";
    document.body.appendChild(t); setTimeout(() => t.remove(), 4500);
    return true;
  }
  listeQuiz(); maj();
  const repris = !bord && reprendre();
  /* tableau de bord : une partie interrompue depuis moins de 3 h → bouton pour la reprendre */
  if (bord) { let S = null; try { S = JSON.parse(localStorage.getItem("quizPartie") || "null"); } catch(e) {}
    const q = S && Date.now() - S.t < 3 * 3600e3 && tousQuiz().find(x => x.id === S.quiz);
    if (q) { const hd = $("tele").querySelector(".mp-tete"); (hd || $("tele")).insertAdjacentHTML(hd ? "afterend" : "afterbegin", `<div class="reprendreP"><div><b>Une partie est en cours</b><span>${esc(q.titre)} · ${Object.keys(S.P || {}).length} joueur(s) · question ${Math.max(1, S.i + 1)} sur ${(S.jeu || []).length || q.qs.length}</span></div><button id="bReprendre">Reprendre la partie</button><button class="btn2" id="bOublier">Terminer</button></div>`);
      $("bReprendre").onclick = () => { location.href = "?animer=1"; };
      $("bOublier").onclick = () => { oublierPartie(); document.querySelector(".reprendreP").remove(); }; } }
  // ouvert depuis le tableau de bord : le quiz choisi est prêt à jouer
  const qp = params.get("quiz");
  if (!bord && qp && !repris) { const b = document.querySelector(`[data-jouer="${CSS.escape(qp)}"]`); if (b) b.click(); }
  /* 15 nov. (Jeremy) : un quiz touché dans le Labo ouvre d'abord ses options, avant la salle d'attente */
  { const c = params.get("choisir"); if (bord && c && tousQuiz().some(x => x.id === c)) modes(c); }
}

/* ================================ JOUEUR (cellulaire de l'élève) ================================ */
function joueur(code){
  const topic = PREFIXE + code;
  $("joueur").classList.remove("cache");
  let pid = null; try { pid = sessionStorage.getItem("quizPid"); } catch(e) {}
  if (!pid) { pid = Math.random().toString(36).slice(2, 9); try { sessionStorage.setItem("quizPid", pid); } catch(e) {} }
  let nom = "", repI = -1, chrono = null, pts = 0;
  const bx = h => { $("jBx").innerHTML = h; };
  const teinte = c => { if (c) $("joueur").style.setProperty("--fondJ", sombre(c)); };
  const COCHE = '<svg class="coche" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45"/><path d="M30 52l13 13 27-29"/></svg>';
  const CROIX = '<svg class="coche croix" viewBox="0 0 100 100"><path d="M32 32l36 36"/><path d="M68 32L32 68"/></svg>';
  const pour = m => !m.pour || m.pour === pid;
  let av = -1, entre = false, pris = [], prenom = "", nomChoisi = "", nomEdite = false;
  function ecranChoix(msg){
    ecranChoix.msg = msg;
    bx(`<h2>Choisis ton personnage</h2>${msg ? `<div class="ko2">${esc(msg)}</div>` : ""}${grillePersos(pris, av)}
      <div style="margin-top:6px;opacity:.8">Ton nom dans la partie : garde celui du personnage, ou un prénom ou surnom (pas de nom de famille)</div>
      <input id="jPre" maxlength="24" placeholder="Choisis d'abord un personnage" value="${esc(nomChoisi)}">
      <button id="jGo" style="width:100%;font-size:20px;padding:16px;background:#fff;color:#24211E" ${av < 0 ? "disabled" : ""}>Entrer</button>`);
    document.querySelectorAll("#jBx .perso").forEach(b => b.onclick = () => { av = +b.dataset.av; if (!nomEdite) nomChoisi = PERSOS[av][0]; ecranChoix(); });
    $("jPre").oninput = () => { nomChoisi = $("jPre").value; nomEdite = !!nomChoisi.trim(); };
    $("jGo").onclick = entrer;
  }
  function entrer(){
    if (av < 0) return;   /* personnage déjà pris : la télécommande décide (même prénom = c'est lui qui revient) */
    nom = (nomEdite ? surnom($("jPre").value) : "") || PERSOS[av][0]; entre = true;
    $("nomJ").innerHTML = visage(av, "v-m") + " " + esc(nom);
    bx(`${visage(av, "v-l")}<div class="gros monte">Bienvenue, ${esc(nom)}.</div><div>Regarde le tableau : ça commence bientôt.</div>`);
    envoyer(topic, {m: "ici", pid, nom, av, prenom});
    try { const J = JSON.stringify({code, av, nom, nomEdite, t: Date.now()}); sessionStorage.setItem("quizJoueur", J); localStorage.setItem("quizDernier", J); } catch(e) {}
    if (!entrer.vie) { entrer.vie = setInterval(() => { if (entre) envoyer(topic, {m: "vie", pid}); }, 12000);
      addEventListener("pagehide", () => { if (entre) envoyer(topic, {m: "bye", pid}); });
      /* l'iPad ne se met pas en veille pendant la partie (Safari 16.4 et plus); redemandé au retour sur la page */
      const eveil = () => { try { if (navigator.wakeLock && !document.hidden) navigator.wakeLock.request("screen").catch(() => {}); } catch(e) {} };
      eveil(); document.addEventListener("visibilitychange", eveil);
      /* (13 nov., « certains élèves décrochent ») : le lien peut mourir sans le dire (Wi-Fi qui change, iPad en veille).
         Sans message de la télécommande depuis 25 s (elle envoie « pouls » aux 8 s), on se rebranche et on se réannonce. */
      window.__dernierMsg = Date.now();
      const reco = () => { let r = $("jReco"); if (!r) { r = document.createElement("div"); r.id = "jReco"; r.textContent = "Reconnexion…"; r.style.cssText = "position:fixed;top:10px;left:50%;transform:translateX(-50%);background:#EB6A22;color:#fff;font:600 15px system-ui;padding:8px 16px;border-radius:99px;z-index:99"; document.body.appendChild(r); } r.hidden = false; };
      setInterval(() => { if (!entre || document.hidden) return; if (Date.now() - window.__dernierMsg > 25000) { reco(); window.__dernierMsg = Date.now() - 10000; if (window.relaisRebrancher) window.relaisRebrancher(); } }, 5000);
      document.addEventListener("visibilitychange", () => { if (!document.hidden && entre) { envoyer(topic, {m: "vie", pid}); envoyer(topic, {m: "ici", pid, nom, av, prenom}); } }); }
  }
  ecranChoix();
  if (params.get("apercu")) { av = 0; nomChoisi = "Alex"; entrer(); try { sessionStorage.removeItem("quizJoueur"); localStorage.removeItem("quizDernier"); } catch(e) {} }
  else
  /* Déjà dans la partie (page rechargée, iPad planté, QR rescanné, nouvel onglet) : on revient tout seul, sans rechoisir;
     la télécommande lui redonne sa fiche et ses points (même prénom) */
  try { const J = JSON.parse(sessionStorage.getItem("quizJoueur") || "null") || JSON.parse(localStorage.getItem("quizDernier") || "null");
    if (J && J.code === code && Date.now() - J.t < 4 * 3600e3 && J.av >= 0) { av = J.av; nomEdite = !!J.nomEdite; nomChoisi = J.nom; ecranChoix(); entrer();
      bx(`${visage(av, "v-l")}<div class="gros monte">Te revoilà, ${esc(nom)}.</div><div>Tu es toujours dans la partie, avec tes points. Regarde le tableau.</div><button id="jPasMoi" style="margin-top:22px;background:transparent;border:1px solid rgba(255,255,255,.35);color:inherit;font-size:15px;padding:10px 16px;border-radius:10px">Ce n'est pas moi</button>`);
      const pm = $("jPasMoi"); if (pm) pm.onclick = () => { try { envoyer(topic, {m: "bye", pid}); sessionStorage.removeItem("quizJoueur"); localStorage.removeItem("quizDernier"); } catch(e) {} entre = false; av = -1; nomEdite = false; nomChoisi = ""; ecranChoix(); }; } } catch(e) {}
    let reT = 0; const reannoncer = () => { if (entre && Date.now() - reT > 3000) { reT = Date.now(); envoyer(topic, {m: "ici", pid, nom, av, prenom}); } };
    ecouter(topic, m => {
      window.__dernierMsg = Date.now(); const rc = $("jReco"); if (rc) rc.hidden = true;
      if (m.m === "pouls") return;
      // La télécommande ne me connaît pas (rechargée, partie neuve) : je me réannonce tout seul
      if (m.m === "persos") { pris = m.pris || []; if (!entre) ecranChoix(ecranChoix.msg); else if (!pris.includes(av)) reannoncer(); return; }
      if (m.m === "bienvenue" && !m.pour) reannoncer();
      if (m.m === "recu" && m.pour === pid) { window.__repRecu = m.i; return; }
      if (m.m === "indiceR" && m.pour === pid) { if (m.i !== window.__qI) return; const b = $("jInd");
        if (m.non) { if (b) { b.textContent = "Il faut au moins 500 points pour un indice"; b.disabled = true; } return; }
        window.__indice(m.ret || []); return; }
      if (m.m === "remplace" && m.pour === pid) { entre = false; clearInterval(chrono); bx('<div class="gros">Tu es revenu sur un autre écran.</div><div>Ta partie continue là-bas, avec tes points.</div>'); return; }
      if (m.m === "refus" && m.pour === pid && m.raison === "nom") { entre = false; try { sessionStorage.removeItem("quizJoueur"); } catch(e) {} nomEdite = true; nomChoisi = ""; ecranChoix("Ce prénom est déjà utilisé dans la partie. Écris un autre prénom ou surnom."); return; }
      if (m.m === "refus" && m.pour === pid) { entre = false; try { sessionStorage.removeItem("quizJoueur"); } catch(e) {} av = -1; if (!nomEdite) nomChoisi = ""; ecranChoix(m.raison === "plein" ? `La partie est pleine (${m.max} joueurs au plus). Demande à l'enseignant.` : "Ce personnage vient d'être pris. Choisis-en un autre."); return; }
      if (m.m === "qui" && (m.pour === pid || m.pour === "tous")) { if (entre) envoyer(topic, {m: "ici", pid, nom, av, prenom}); return; }
      if (m.m === "ferme" && entre) { entre = false; try { sessionStorage.removeItem("quizJoueur"); } catch(e) {} clearInterval(chrono);
        bx(`<div class="gros monte">Partie terminée</div><div>L'enseignant a fermé le quiz. Merci d'avoir joué !</div><button id="jRe" style="margin-top:18px;font-size:18px;padding:14px 20px;background:#fff;color:#24211E">Rejoindre une nouvelle partie</button>`);
        $("jRe").onclick = () => { av = -1; ecranChoix(); }; return; }
      if (m.m === "kick" && m.pour === pid) { entre = false; try { sessionStorage.removeItem("quizJoueur"); } catch(e) {} av = -1; ecranChoix("L'enseignant t'a retiré de la partie. Choisis un personnage pour revenir."); return; }
      if (!entre || !pour(m)) return;
      if (m.coul) teinte(m.coul);
      if (m.m === "bienvenue") bx(`<div class="gros monte">Tu es dans la partie.</div><div>${esc(m.titre || "")}</div><div style="opacity:.7;margin-top:8px">Regarde le tableau : ça commence bientôt.</div>`);
      else if (m.m === "diapo") { clearInterval(chrono); bx('<div class="gros monte">Regarde le tableau</div><div style="opacity:.75">Garde ton cellulaire près de toi.</div><button id="jMain" class="jMain">✋ J\'ai une question</button><div class="sous" style="opacity:.6;margin-top:8px">Anonyme : l\'enseignant voit seulement le nombre de mains levées.</div>');
        $("jMain").onclick = () => { const b = $("jMain"); envoyer(topic, {m: "main", pid}); b.disabled = true; b.textContent = "✋ Main levée"; setTimeout(() => { if (b.isConnected) { b.disabled = false; b.textContent = "✋ J'ai une question"; } }, 30000); }; }
      else if (m.m === "attente") bx('<div class="gros">Pause</div><div>L\'enseignant prépare la suite.</div>');
      else if (m.m === "mise") {
        if (m.pts[pid] == null) return; clearInterval(chrono);
        const choisir = oui => { envoyer(topic, {m: "miser", pid, oui}); document.querySelectorAll("#jBx [data-mise]").forEach(b => b.classList.toggle("choisi", (b.dataset.mise === "1") === oui)); $("miseTxt").textContent = oui ? "Tu mises tout : bonne réponse = points doublés, sinon 0." : "Tu gardes tes points."; };
        bx(`<div style="opacity:.75">Question spéciale</div><h2>Double ou rien ?</h2><div class="rang">Tu as <b>${m.pts[pid]}</b> points.</div>
          <div class="ch4 mise"><button data-mise="1" class="k1"><i>×2</i>Je mise tout</button><button data-mise="0" class="k0"><i>=</i>Je garde mes points</button></div><div id="miseTxt" style="margin-top:12px;opacity:.85">Choisis avant que la question arrive.</div>`);
        document.querySelectorAll("#jBx [data-mise]").forEach(b => b.onclick = () => choisir(b.dataset.mise === "1"));
      } else if (m.m === "trich" && m.pour === pid) { m.apres = Date.now() + Math.max(0, m.t0 + 3000 - m.now); window.__trich = m; trichAppliquer(m.i);
      } else if (m.m === "inter") { clearInterval(chrono); bx(`<div style="opacity:.75">Avant le vote</div><h2>L'interrogatoire</h2><div class="rang">L'animateur pose des questions. Défends-toi, accuse avec des faits… et observe le non-verbal.</div><div style="margin-top:10px;opacity:.85">Le vote du tricheur arrive bientôt.</div>`);
      } else if (m.m === "vtr") { clearInterval(chrono); const L = (m.opts || []).filter(o => o.id !== pid); let choix = null;   /* le tricheur vote aussi, pour ne pas se trahir */
        bx(`<div style="opacity:.75">Fin de la partie</div><h2>Qui est le tricheur?</h2><div style="opacity:.85;margin-bottom:10px">Un élève voyait les bonnes réponses. Le trouver : tu te partages la moitié de ses points. Te tromper : tu lui donnes 20 % des tiens. Tu peux passer.</div><div class="vtrL">${L.map(o => `<button data-v="${esc(o.id)}">${esc(o.n)}</button>`).join("")}<button data-v="passe" class="passe">Je passe</button></div><div id="vtrT" style="margin-top:10px;opacity:.8"></div>`);
        document.querySelectorAll("#jBx [data-v]").forEach(b => b.onclick = () => { choix = b.dataset.v; envoyer(topic, {m: "vtrv", pid, id: choix}); document.querySelectorAll("#jBx [data-v]").forEach(x => x.classList.toggle("choisi", x === b)); $("vtrT").textContent = "Vote envoyé. Tu peux changer d'idée jusqu'à la révélation."; });
      } else if (m.m === "vtrRes") { const moiT = m.tr === pid, x = (m.d || {})[pid] || 0;
        const txt = moiT ? (m.trouve ? `Démasqué : tu remets la moitié de tes points${x < 0 ? " (" + (-x) + ")" : ""}.` : x > 0 ? `Personne ne t'a trouvé, et tu récoltes ${x} points des élèves qui se sont trompés!` : "Personne ne t'a trouvé : tu gardes tes points.")
          : (m.bons || []).includes(pid) ? `Bien vu : tu récoltes ${x} points!` : (m.faux || []).includes(pid) ? `Raté : tu donnes ${-x} points au tricheur.` : "Tu as passé : tes points ne bougent pas.";
        bx(`<div style="opacity:.75">Le tricheur était</div><h2>${esc(m.nom)}</h2><div class="rang">${txt}</div>`);
      } else if (m.m === "dblrap") { const d = $("dblTag"); if (d) d.classList.remove("cache");
      } else if (m.m === "q") {
        repI = -1; const t = m.t || "choix", fin = m.t0 + m.s * 1000 - (m.now ? m.now - Date.now() : 0);   /* (13 nov.) horloge de l'iPad décalée : on compte avec celle de la télécommande */
        const envoi = c => { if (repI !== -1) return; repI = c; document.querySelectorAll("#jBx button").forEach(x => x.disabled = true);
          $("jBx").insertAdjacentHTML("beforeend", '<div class="monte" style="margin-top:14px;opacity:.8">Réponse envoyée.</div>'); window.__repQ = m.i; const R = {m: "rep", pid, i: m.i, c}; envoyer(topic, R);
          /* 10 nov. (« ma réponse est pas partie ») : renvoyée aux 2 s tant que la télécommande ne l'a pas confirmée (message perdu sur un réseau lent) */
          clearInterval(window.__repRenv); window.__repRecu = -1; let n = 0;
          window.__repRenv = setInterval(() => { if (window.__repRecu === m.i || ++n > 12 || Date.now() > fin + 3000) { clearInterval(window.__repRenv); return; } envoyer(topic, R); }, 2000); };
        const btns = (cl) => `<div class="ch4 ${cl || ""}">${m.ch.map((c, k) => `<button class="k${k}" data-c="${k}"><i>${SYMB[k]}</i><span>${esc(c)}</span></button>`).join("")}</div>`;
        let corps = "";
        if (t === "multi") corps = `<div class="aideT">Plusieurs bonnes réponses : touche toutes celles qui sont bonnes, puis Valider.</div>${btns("multi")}<button id="jOk" class="valider" disabled>Valider</button>`;
        else if (t === "ordre") corps = `<div class="aideT">Touche les étapes dans le bon ordre (1, 2, 3…), puis Valider.</div>${btns("ordre")}<div class="duoB"><button id="jRaz" class="btn2">Recommencer</button><button id="jOk" class="valider" disabled>Valider</button></div>`;
        else if (t === "paires") corps = `<div class="aideT">Pour chaque numéro, touche la réponse qui va avec (1, puis 2, puis 3…), puis Valider.</div><ol class="pgL">${(m.g || []).map(x => `<li><span>${esc(x)}</span><b>?</b></li>`).join("")}</ol>${btns("ordre")}<div class="duoB"><button id="jRaz" class="btn2">Recommencer</button><button id="jOk" class="valider" disabled>Valider</button></div>`;
        else if (t === "estim") corps = `<div class="aideT">Estime sans calculer : vise le plus proche possible${m.u ? " (en " + esc(m.u) + ")" : ""}.</div><div class="nbx"><input id="jNb" inputmode="decimal" autocomplete="off" placeholder="Ton estimation">${m.u ? `<span>${esc(m.u)}</span>` : ""}</div><button id="jOk" class="valider" disabled>Valider</button>`;
        else if (t === "sondage") corps = '<div class="aideT">Vote : pas de bonne ou de mauvaise réponse.</div>' + btns();
        else if (t === "echelle") corps = `<div class="aideT">De 1 (pas du tout) à 5 (tout à fait). Personne ne voit ta réponse.</div><div class="ech5">${[1, 2, 3, 4, 5].map((n, k) => `<button data-c="${k}"><b>${n}</b><small>${["Pas du tout", "Un peu", "Moyen", "Assez", "Tout à fait"][k]}</small></button>`).join("")}</div>`;
        else if (t === "nuage") corps = `<div class="aideT">Écris un mot ou deux. Pas de bonne ou de mauvaise réponse.</div><div class="nbx"><input id="jNb" maxlength="30" autocomplete="off" autocapitalize="off" placeholder="Ton mot"></div><button id="jOk" class="valider" disabled>Envoyer</button>`;
        else if (t === "nombre") corps = `<div class="aideT">Calcule et tape ta réponse${m.u ? " (en " + esc(m.u) + ")" : ""}.</div><div class="nbx"><input id="jNb" inputmode="decimal" autocomplete="off" placeholder="Ta réponse">${m.u ? `<span>${esc(m.u)}</span>` : ""}</div><button id="jOk" class="valider" disabled>Valider</button>`;
        else corps = (t === "erreur" ? '<div class="aideT">Quel morceau de la phrase contient l\'erreur ?</div>' : "") + btns();
        bx(`<div style="opacity:.75">Question ${m.qn || m.i + 1} sur ${m.nq || m.n}${m.dbl ? ' · <b style="color:#FFB15C">double ou rien</b>' : '<b id="dblTag" class="cache" style="color:#FFB15C"> · double ou rien</b>'}</div><h2>${esc(m.q)}</h2><div class="chrono"><i id="jBar"></i></div>
          <div id="jCorps" class="${m.lec > 300 ? "cache" : ""}">${corps}</div>${m.lec > 300 ? `<div id="jLec" class="aideT lec">Lis bien la question… les choix arrivent dans <b id="jLecN">${Math.ceil(m.lec / 1000)}</b> s.</div>` : ""}`);
        if (m.lec > 300) { const t1 = Date.now() + m.lec; const iv = setInterval(() => { const r = t1 - Date.now(), n = $("jLecN"); if (n) n.textContent = Math.max(0, Math.ceil(r / 1000)); if (r <= 0) { clearInterval(iv); const c = $("jCorps"), l = $("jLec"); if (c) c.classList.remove("cache"); if (l) l.remove(); } }, 200); }
        if (m.tr) window.__trich = {i: m.i, bon: m.tr.bon, txt: m.tr.txt, apres: Date.now() + Math.max(0, m.t0 + 3000 - (m.now || Date.now()))}; trichAppliquer(m.i);
        clearInterval(chrono);
        /* 9 nov. (« les élèves pourraient sentir leur cell vibrer s'ils ne répondent pas ») : 5 s avant la fin, si l'élève n'a pas répondu :
           vibration (Android; Apple ne permet pas aux sites de faire vibrer l'iPad ni l'iPhone) + bord de l'écran qui pulse en rouge (partout) */
        let rappel = false; window.__autoEnv = 0; document.body.classList.remove("presseJ");
        chrono = setInterval(() => { const r = Math.max(0, fin - Date.now()), b = $("jBar"); if (b) b.style.width = Math.min(100, 100 * r / (m.s * 1000)) + "%";
          const attend = !!$("jCorps") && window.__repQ !== m.i;
          if (!rappel && attend && r > 0 && r <= 5000) { rappel = true; document.body.classList.add("presseJ"); try { if (navigator.vibrate) navigator.vibrate([250, 120, 250, 120, 400]); } catch(x) {} }
          if (rappel && (!attend || !r)) document.body.classList.remove("presseJ");
          /* (13 nov., « des réponses écrites sur la tablette ne sont pas comptées ») : réponse tapée ou choisie sans Valider → envoyée toute seule à la fin */
          if (attend && r <= 700 && !window.__autoEnv) { const ok = $("jOk"); if (ok && !ok.disabled) { window.__autoEnv = 1; ok.click(); } }
          if (!r) clearInterval(chrono); }, 150);
        const B = [...document.querySelectorAll("#jBx [data-c]")];
        window.__qI = m.i;
        if (m.ind && t === "choix") {
          $("jCorps").insertAdjacentHTML("beforeend", '<button id="jInd" class="btn2" style="margin-top:14px;width:100%;min-height:48px">Indice : enlever des mauvais choix (−500 points)</button>');
          $("jInd").onclick = () => { if (repI !== -1) return; $("jInd").disabled = true; $("jInd").textContent = "Indice demandé…"; envoyer(topic, {m: "indice", pid, i: m.i}); };
          if (m.ret) window.__indice(m.ret);
        }
        if (t === "multi") { const sel = new Set();
          B.forEach(b => b.onclick = () => { if (repI !== -1) return; const k = +b.dataset.c; sel.has(k) ? sel.delete(k) : sel.add(k); b.classList.toggle("choisi", sel.has(k)); b.querySelector("i").textContent = sel.has(k) ? "✓" : SYMB[k]; $("jOk").disabled = !sel.size; });
          $("jOk").onclick = () => envoi([...sel].sort((a, b) => a - b));
        } else if (t === "ordre" || t === "paires") { let L = [];
          const peindre = () => { B.forEach(b => { const p = L.indexOf(+b.dataset.c); b.classList.toggle("choisi", p >= 0); b.querySelector("i").textContent = p >= 0 ? p + 1 : SYMB[+b.dataset.c]; }); $("jOk").disabled = L.length !== B.length;
            document.querySelectorAll(".pgL li").forEach((li, j) => { li.classList.toggle("ok", L[j] != null); li.querySelector("b").textContent = L[j] != null ? SYMB[L[j]] : "?"; }); };
          B.forEach(b => b.onclick = () => { if (repI !== -1) return; const k = +b.dataset.c; if (L.includes(k)) L = L.slice(0, L.indexOf(k)); else L.push(k); peindre(); });
          $("jRaz").onclick = () => { if (repI !== -1) return; L = []; peindre(); };
          $("jOk").onclick = () => envoi(L.slice());
        } else if (t === "nuage") { const inp = $("jNb");
          inp.oninput = () => { $("jOk").disabled = !inp.value.trim(); };
          inp.onkeydown = e => { if (e.key === "Enter" && !$("jOk").disabled) $("jOk").click(); };
          $("jOk").onclick = () => { inp.blur(); envoi(inp.value.trim().slice(0, 30)); };
        } else if (t === "nombre" || t === "estim") { const inp = $("jNb");
          inp.oninput = () => { inp.value = inp.value.replace(/[^0-9,.\- ]/g, ""); $("jOk").disabled = isNaN(num(inp.value)); };
          inp.onkeydown = e => { if (e.key === "Enter" && !$("jOk").disabled) $("jOk").click(); };
          $("jOk").onclick = () => { inp.blur(); envoi(inp.value.trim()); };
        } else B.forEach(b => b.onclick = () => {
          if (repI !== -1) return;
          B.forEach(x => { x.classList.toggle("pas", x !== b); x.classList.toggle("choisi", x === b); });
          envoi(+b.dataset.c);
        });
      } else if (m.m === "rev") {
        clearInterval(chrono); document.body.classList.remove("presseJ");
        if (m.nuage) { bx('<div class="gros monte">Merci !</div><div style="opacity:.8">Regarde le nuage de mots au tableau.</div>'); return; }
        if (m.sp) { bx('<div class="gros monte">Merci !</div><div style="opacity:.8">Regarde les résultats au tableau.</div>'); return; }
        const r = m.res[pid]; if (!r) return;
        const bon = r.ok, rien = r.rep == null; pts = r.pts;
        const fl = m.i === 0 ? "" : r.avant && r.rang < r.avant ? `<span class="fl mo">▲ ${r.avant - r.rang}</span>` : r.avant && r.rang > r.avant ? `<span class="fl de">▼ ${r.rang - r.avant}</span>` : "";
        bx(`${rien ? "" : bon ? COCHE : CROIX}
          <div class="gros monte">${rien ? "Pas de réponse" : bon ? "Bonne réponse" : "Pas cette fois"}</div>
          ${bon && m.points !== "aucun" ? `<div class="monte" style="font-size:26px;font-weight:800">+<span id="jGain">0</span></div>` : ""}
          ${!bon && r.g < 0 ? `<div class="monte" style="font-size:22px;font-weight:800;color:#FFB4A8">${r.g} (pénalité)</div>` : ""}
          ${r.mise ? `<div class="serieJ monte fort"><span>${r.dbl > 0 ? "Double ou rien : tes points doublent (+" + r.dbl + ") !" : "Double ou rien : mise perdue."}</span></div>` : ""}
          ${bon ? "" : `<div class="monte">La bonne réponse : <b>${esc(m.bonTxt)}</b></div>`}
          ${m.expl ? `<div class="expl monte">${esc(m.expl)}</div>` : ""}
          ${r.serie >= 3 ? `<div class="serieJ monte${r.serie >= 5 ? " fort" : ""}">${FLAMME}<span>${r.serie} bonnes de suite${r.bonus ? ` · bonus +${r.bonus}` : ""}</span></div>` : ""}
          ${m.classement === "oui" && m.i > 0 && r.avant && r.rang < r.avant ? `<div class="monte" style="font-weight:800;color:#7CF0A8">Tu remontes au ${ord(r.rang)} rang !</div>` : ""}
          ${m.classement === "oui" ? `<div class="rang monte">Tu es <b>${ord(r.rang)}</b> sur ${m.n}${m.points !== "aucun" ? " · " + pts + " points" : ""}${fl}</div>` : ""}`);
        if (!bon && !rien) { $("jBx").classList.add("secoue"); setTimeout(() => $("jBx").classList.remove("secoue"), 500); }
        if (bon && $("jGain")) compter($("jGain"), 0, r.g, 900);
        if (m.points !== "aucun") $("ptsJ").textContent = pts + " pts";
      } else if (m.m === "fin" && m.sp) {
        bx(`<div class="finJ">${visage(av, "v-l")}</div><div class="gros monte">Merci !</div><div style="margin-top:8px;opacity:.75">Fin de la présentation. Merci, ${esc(nom)}.</div>`);
      } else if (m.m === "fin") {
        const r = m.res[pid]; if (!r) return;
        const med = r.rang <= 3 ? `<div class="medaille m${r.rang} monte"><svg viewBox="0 0 64 80" aria-hidden="true"><path d="M20 2h10l6 22h-10zM44 2H34l-6 22h10z" fill="#5A6B8C"/><circle cx="32" cy="50" r="24" fill="var(--mc)"/><circle cx="32" cy="50" r="18" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="2"/><text x="32" y="59" text-anchor="middle" font-size="26" font-weight="900" fill="#fff" font-family="system-ui">${r.rang}</text></svg></div>` : "";
        bx(`<div class="finJ">${visage(av, "v-l")}${med}</div>
          <div style="opacity:.75;margin-top:6px">Classement final</div><div class="gros monte">${ord(r.rang)} sur ${m.n}</div>
          <div class="rang monte">${r.bons} bonne${r.bons > 1 ? "s" : ""} réponse${r.bons > 1 ? "s" : ""} sur ${m.total}${m.points !== "aucun" ? " · " + r.pts + " points" : ""}</div>
          ${r.max >= 2 ? `<div class="serieJ monte${r.max >= 5 ? " fort" : ""}">${FLAMME}<span>Meilleure série : ${r.max} de suite</span></div>` : ""}
          <div style="margin-top:14px;opacity:.75">Merci, ${esc(nom)}.</div>`);
      }
    }, ok => { if (ok) { envoyer(topic, {m: "persos?"}); if (entre) envoyer(topic, {m: "ici", pid, nom, av, prenom}); } });
}

/* ===== Manette du cellulaire de l'enseignant (9 nov.) : un gros bouton = la prochaine étape de la partie ===== */
function manette(code, k){
  const topic = PREFIXE + code;
  const IC = {plus:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>', son:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4zM17 9a4 4 0 0 1 0 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>', mus:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V6l11-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'};
  document.body.insertAdjacentHTML("beforeend", `<div id="man" class="m3"><div class="mh"><img src="img/metier-plus-blanc.svg" alt="Métier+"><span id="mEtat"><i></i>Connexion…</span></div>
    <section class="mcarte"><div class="mt" id="mTitre">Défi+</div><div class="mc" id="mCour">En attente de la partie…</div>
      <div class="mchrono" id="mChr"><span id="mT" class="mtmp"></span><div class="mbar"><i id="mBar"></i></div></div>
      <div class="ma" id="mAtt"></div></section>
    <div class="mgrille"><button class="m2 mtuile" id="mPlus" disabled>${IC.plus}<span>+10 s</span></button><button class="m2 mtuile" id="mDbl"><b class="mx2">×2</b><span>Double ou rien</span></button><button class="m2 mtuile" id="mSon">${IC.son}<span>Son</span></button><button class="m2 mtuile" id="mMus">${IC.mus}<span>Musique</span></button></div>
    <div class="mvolr"><button class="m2" id="mVm" aria-label="Baisser le son">−</button><div class="mvolc"><span class="mvol" id="mVol">Volume</span><div class="mbar"><i id="mVolB"></i></div></div><button class="m2" id="mVp" aria-label="Monter le son">+</button></div>
    <details class="mlist" id="mDet"><summary id="mSum">Participants</summary><div id="mJ"></div></details>
    <button class="m2 mfin" id="mFin">Quitter la partie</button>
    <div class="mbas"><button class="m2 cache" id="mAutre"></button><button class="mbig" id="mGo" disabled>…</button></div></div>`);
  let S = null, recu = 0, dec = 0, sur = {};
  const cmd = (b, id) => envoyer(topic, {m: "cmd", k, b, id});
  const dessiner = () => { if (!S) return;
    $("mTitre").textContent = S.titre || "Défi+"; $("mCour").textContent = S.cour || "";
    const A = S.att || []; $("mAtt").innerHTML = A.length ? `<b>En attente de ${A.length}</b>` + (A.length <= 16 ? `<div class="mpuces">${A.map(n => `<span>${esc(n)}</span>`).join("")}</div>` : "") : "";
    const go = S.go && !S.go.d, prim = go ? S.go : S.suite, id = go ? "bGo" : "bSuite";
    $("mGo").textContent = prim ? prim.t : "…"; $("mGo").disabled = !prim || prim.d; $("mGo").dataset.b = id;
    if (S.etat === "choix") { $("mGo").textContent = "Partie terminée"; $("mGo").disabled = true; $("mCour").textContent = "Choisis un autre quiz au tableau."; $("mAutre").classList.add("cache"); }
    const autre = go && S.suite && !S.suite.d; $("mAutre").classList.toggle("cache", !autre); if (autre) { $("mAutre").textContent = S.suite.t; $("mAutre").dataset.b = "bSuite"; }
    $("mPlus").disabled = S.etat !== "question"; $("mDbl").disabled = !S.etat || ["choix", "fin", "vtr", "vtrRes"].includes(S.etat); $("mDbl").classList.toggle("on", !!S.dblP); $("mDbl").querySelector("span").textContent = S.dblP ? "Prochaine : ×2" : "Double ou rien"; $("mFin").classList.toggle("cache", !S.etat || S.etat === "choix");
    const L = S.j || []; $("mSum").textContent = (S.etat === "lobby" || S.etat === "choix" ? "Participants" : "Classement et réponses") + " (" + L.length + ")";
    { let mv = $("mVote"); if (!mv) { mv = document.createElement("div"); mv.id = "mVote"; $("mAtt").insertAdjacentElement("afterend", mv); }
      if (S.vanim) { mv.innerHTML = `<div class="mvt">Ton vote : si tu te trompes, le tricheur gagne 1000 points.</div><div class="avL">${S.vanim.opts.map(o => `<button data-mv="${esc(o.id)}" class="${S.vanim.choix === o.id ? "choisi" : ""}">${esc(o.n)}</button>`).join("")}<button data-mv="passe" class="${!S.vanim.choix ? "choisi" : ""}">Je ne vote pas</button></div>`;
        mv.querySelectorAll("[data-mv]").forEach(b => b.onclick = () => cmd("vanim", b.dataset.mv)); }
      else if (S.interQ) mv.innerHTML = `<div class="mvt">Questions à poser :</div><ol class="avQ">${S.interQ.map(q => `<li>${esc(q)}</li>`).join("")}</ol>`;
      else mv.innerHTML = ""; }
    $("mJ").innerHTML = L.map(x => `<div class="mj"><b>${x.r || "–"}</b><span class="mn">${esc(x.n)}${x.txt ? `<small class="${x.ok ? "ok" : "ko"}">${esc(x.txt)}</small>` : x.ok === false && S.etat === "rev" ? '<small class="ko">pas répondu</small>' : ""}</span>${x.a === true ? '<i class="ok">✓</i>' : x.a === false ? '<i>…</i>' : ""}<em>${x.pts}</em><button data-k="${esc(x.id)}" class="${sur[x.id] ? "sur" : ""}">${sur[x.id] ? "Retirer ?" : "✕"}</button></div>`).join("") || '<div class="mt">Personne pour l\'instant.</div>'; };
  let finVu = 0, tot = 0;
  const minuterie = () => { const ch = $("mChr"); if (!S || !S.fin || S.etat !== "question") { ch.classList.remove("on"); return; } const n = Date.now() + dec;
    if (S.fin !== finVu) { finVu = S.fin; tot = Math.max(1, S.fin - Math.max(n, S.lec || 0)); }
    ch.classList.add("on"); const r = Math.max(0, S.fin - n);
    $("mT").textContent = n < S.lec ? "Lecture…" : Math.ceil(r / 1000) + " s";
    $("mBar").style.width = (n < S.lec ? 100 : Math.min(100, r / tot * 100)) + "%"; ch.classList.toggle("presse", n >= (S.lec || 0) && r < 5000); };
  setInterval(minuterie, 250);
  $("mPlus").onclick = () => cmd("plus10");
  $("mDbl").onclick = () => cmd("dbl");
  $("mSon").onclick = () => cmd("son");
  $("mVm").onclick = () => cmd("vol-"); $("mVp").onclick = () => cmd("vol+"); $("mMus").onclick = () => cmd("mus");
  $("mJ").onclick = e => { const b = e.target.closest("button[data-k]"); if (!b) return; const id = b.dataset.k;
    if (sur[id]) { delete sur[id]; envoyer(topic, {m: "cmd", k, b: "kick", id}); } else { sur = {[id]: 1}; setTimeout(() => { delete sur[id]; dessiner(); }, 3000); } dessiner(); };
  let finSur = 0; $("mFin").onclick = () => { if (Date.now() - finSur < 3000) { cmd("fin"); finSur = 0; $("mFin").textContent = "Quitter la partie"; } else { finSur = Date.now(); $("mFin").textContent = "Sûr ? Touche encore"; setTimeout(() => { $("mFin").textContent = "Quitter la partie"; }, 3000); } };
  $("mGo").onclick = e => { if (navigator.vibrate) navigator.vibrate(30); cmd(e.currentTarget.dataset.b); };
  $("mAutre").onclick = e => cmd(e.currentTarget.dataset.b);
  ecouter(topic, m => { if (m.m === "mstat") { S = m; recu = Date.now(); if (m.now) dec = m.now - Date.now(); dessiner(); } else if (m.m === "mmus") { $("mMus").querySelector("span").textContent = m.nom; $("mVol").textContent = "Volume " + Math.round(m.vol * 100) + " %"; $("mVolB").style.width = Math.min(100, m.vol / 2 * 100) + "%"; } else if (m.m === "mson") { $("mSon").querySelector("span").textContent = m.on ? "Son activé" : "Son coupé"; $("mSon").classList.toggle("on", m.on); } }, ok => { $("mEtat").innerHTML = "<i></i>" + (ok ? "Branché" : "Connexion…"); $("mEtat").classList.toggle("ok", ok); if (ok) cmd("etat"); });
  setInterval(() => { cmd("etat"); if (recu && Date.now() - recu > 15000) { $("mEtat").innerHTML = "<i></i>Le tableau ne répond pas"; $("mEtat").classList.remove("ok"); } }, 8000);
  const eveil = () => { try { if (navigator.wakeLock && !document.hidden) navigator.wakeLock.request("screen").catch(() => {}); } catch(e) {} };
  eveil(); document.addEventListener("visibilitychange", eveil);
}

/* ===== Animer au tableau : un seul ordinateur (écran de classe + barre + tiroir de télécommande) ===== */
function animer(boutons){
  document.body.insertAdjacentHTML("beforeend", `<div id="tiroir"><button class="fermer" id="tirX" aria-label="Fermer la télécommande">›</button><iframe id="tirF" src="?tele=1&inclus=1${params.get("quiz") ? "&quiz=" + encodeURIComponent(params.get("quiz")) : ""}" title="Télécommande"></iframe></div>
    <div id="animBar"><button id="retLabo" title="Retour à mes Défi+">‹ Mes Défi+</button>${boutons.map(([id], k) => `<button data-b="${id}" class="${k ? "" : "prim"}" disabled>…</button>`).join("")}<button id="celB" title="Mener la partie avec ton cellulaire">Mon cell</button><button id="tirB">Télécommande</button><button id="musB" title="Changer la musique">♪</button><button id="volM" title="Baisser le son">−</button><button id="volP" title="Monter le son">+</button></div><div id="celOv" class="cache"><div class="bx"><div class="prof">Enseignant seulement</div><h2>Mène la partie avec ton cellulaire</h2><div id="celQr"></div><p>Scanne avec ton cellulaire. Il doit être connecté à ton compte Métier+ (une seule fois). Le code des élèves apparaît dès que ton cell est branché.</p><button id="celX">Continuer sans cellulaire</button></div></div>`);
  const T = $("tiroir"), F = $("tirF");
  $("tirB").onclick = () => T.classList.toggle("ouvert");
  const quitter = u => { let q = false; try { q = F.contentWindow.quitterPartie && F.contentWindow.quitterPartie(); } catch(x) {} setTimeout(() => { location.href = u; }, q ? 400 : 0); };
  $("retLabo").onclick = () => quitter("quiz.html");
  try { const qid = params.get("quiz"), qq = qid && tousQuiz().find(x => x.id === qid);   /* 11 nov. : une présentation revient à « Mes présentations » du Labo */
    if (qq && estPres(qq)) { $("retLabo").textContent = "‹ Mes présentations"; $("retLabo").title = "Retour à mes présentations";
      $("retLabo").onclick = () => { try { localStorage.setItem("laboOnglet", "pres"); } catch(e){} quitter("labo.html"); }; } } catch(e) {}
  document.addEventListener("click", e => { const l = e.target.closest && e.target.closest("a[href]"); if (!l || /^#/.test(l.getAttribute("href")) || l.target === "_blank") return; e.preventDefault(); quitter(l.href); }, true);
  $("tirX").onclick = () => T.classList.remove("ouvert");
  $("celB").onclick = () => { if (!animer.code || !animer.mk) return; const u = location.href.split(/[?#]/)[0] + "?manette=" + animer.code + "&k=" + animer.mk;
    $("celQr").innerHTML = ""; try { new QRCode($("celQr"), {text: u, width: 260, height: 260, correctLevel: QRCode.CorrectLevel.H}); if (window.qrLogo) qrLogo($("celQr")); } catch(x) { $("celQr").textContent = u; }
    $("celOv").classList.remove("cache"); };
  $("celX").onclick = () => $("celOv").classList.add("cache");
  /* 9 nov. (« le QR de l'enseignant d'abord, puis celui des élèves ») : à l'ouverture, le QR de l'enseignant couvre l'écran;
     dès que son cellulaire envoie une commande avec la bonne clé, il disparaît et l'écran des élèves (code QR des élèves) apparaît. */
  { const mb = $("musB"), maj = () => { if (mb && window.quizMusiqueNom) mb.textContent = "♪ " + quizMusiqueNom(); };
    if (mb){ setTimeout(maj, 300); mb.onclick = () => { quizMusique(); maj(); }; $("volM").onclick = () => { const v = quizVolume(-.2); mb.title = "Volume " + Math.round(v * 100) + " %"; }; $("volP").onclick = () => { const v = quizVolume(.2); mb.title = "Volume " + Math.round(v * 100) + " %"; }; } }
  window.manetteVue = m => { if (!m.k || m.k !== animer.mk) return; animer.cell = true; animer.celVu = Date.now(); document.body.classList.add("celCo"); $("celOv").classList.add("cache"); $("celB").textContent = "Cell branché";
    const env = () => { const b = $("bSon"); envoyer(PREFIXE + animer.code, {m: "mson", on: !!(b && b.classList.contains("actif"))}); };
    const envM = () => envoyer(PREFIXE + animer.code, {m: "mmus", nom: window.quizMusiqueNom ? quizMusiqueNom() : "", vol: +(localStorage.quizVolume || 1)});
    if (m.b === "son") { const b = $("bSon"); if (b) b.click(); setTimeout(env, 150); }
    else if (m.b === "mus" && window.quizMusique) { quizMusique(); envM(); }
    else if ((m.b === "vol+" || m.b === "vol-") && window.quizVolume) { quizVolume(m.b === "vol+" ? .2 : -.2); envM(); }
    else if (m.b === "etat") { env(); envM(); } };
  /* 10 nov. : barre du bas cachée tant que le cellulaire est branché (il envoie « etat » aux 8 s); revient après 30 s sans nouvelles */
  setInterval(() => { if (animer.celVu && Date.now() - animer.celVu > 30000) document.body.classList.remove("celCo"); }, 5000);
  const auto = setInterval(() => { if (!animer.code || !animer.mk) return; clearInterval(auto);
    let deja = false; try { deja = sessionStorage.getItem("celPropose") === animer.code; sessionStorage.setItem("celPropose", animer.code); } catch(x) {}
    if (!deja && !animer.cell) $("celB").click(); }, 300);
  addEventListener("message", e => { if (e.data && e.data.labo === "code" && e.data.mk) animer.mk = e.data.mk; if (e.data && e.data.labo === "code" && !animer.code) { animer.code = e.data.code; ecran(e.data.code); } });
  /* 26 nov. (Jeremy : « à la fin d'un Défi+, j'ai de la difficulté à quitter ») : à la fin, un gros bouton « Terminer » toujours visible
     (même quand la barre du bas est cachée par le cellulaire). Ouvert depuis un livre : ferme l'onglet et revient au livre. */
  const finDefi = fini => { let b = $("finDefi");
    if (!fini) { if (b) b.hidden = true; return; }
    if (!b) { const livre = !!(window.opener && !window.opener.closed);
      document.body.insertAdjacentHTML("beforeend", `<button id="finDefi" type="button">${livre ? "Terminer et revenir au livre" : "Terminer"}</button>`); b = $("finDefi");
      b.onclick = () => { let q = false; try { q = F.contentWindow.quitterPartie && F.contentWindow.quitterPartie(); } catch(x) {}
        setTimeout(() => { if (window.opener && !window.opener.closed) window.close(); location.href = "quiz.html"; }, q ? 400 : 0); }; }
    b.hidden = false; };
  let finForce = false; window.__finDefi = () => { finForce = true; finDefi(true); };   /* pour les tests */
  // les boutons de la barre reprennent l'état des vrais boutons de la télécommande
  setInterval(() => {
    let d = null; try { d = F.contentDocument; } catch(x) {}
    { const sv = d && d.getElementById("bSuite"); finDefi(finForce || !!(sv && /podium|Statistiques de la classe/i.test(sv.textContent))); }
    /* 26 nov. (Jeremy) : « Quitter la partie » sur la télécommande ou le cellulaire (la télécommande revient au choix des Défi+)
       ramène aussi l'écran au livre quand le Défi+ a été ouvert depuis un livre */
    { const vj = d && d.getElementById("vJeu"), enJeu = !!(vj && !vj.classList.contains("cache"));
      if (enJeu) animer.jeu = true; else if (animer.jeu && d && d.getElementById("vChoix") && !d.getElementById("vChoix").classList.contains("cache")) { animer.jeu = false;
        if (window.opener && !window.opener.closed) { const b = $("finDefi"); if (b) b.textContent = "Retour au livre…"; setTimeout(() => window.close(), 300); } } }
    document.querySelectorAll("#animBar [data-b]").forEach(b => {
      const v = d && d.getElementById(b.dataset.b);
      if (!v) { b.disabled = true; return; }
      b.textContent = v.textContent; b.disabled = v.disabled || v.closest(".cache") != null;
      /* 9 nov. : « Commencer » disparaît une fois la partie lancée; le bouton qu'on peut toucher est en couleur */
      b.style.display = v.hidden || (b.disabled && (b.dataset.cacher || b.dataset.b === "bGo" || b.dataset.b === "bPause")) ? "none" : "";
      b.classList.toggle("prim", !b.disabled);
    });
  }, 400);
  document.querySelectorAll("#animBar [data-b]").forEach(b => b.onclick = () => { const v = F.contentDocument.getElementById(b.dataset.b); if (v && !v.disabled) v.click(); });
}

/* ================================ ÉCRAN DE CLASSE ================================ */
function ecran(code){
  const topic = PREFIXE + code, E = $("ecr"); E.classList.remove("cache");
  const url = location.href.split(/[?#]/)[0] + "?j=" + code;
  let V = {etat: "lobby", joueurs: [], titre: "Défi+", reg: {}, i: -1}, decal = 0, img = {}, sonOK = false, ac = null, dernier = "", tic = 0;
  /* nuage de mots : les mots gardent leur place (on ne refait que ce qui change); taille selon le nombre */
  const COUL_N = ["#F28A3C", "#14A3A3", "#8B6CE0", "#E0892B", "#D9488A", "#5BA4E6", "#2EB872", "#F2C94C"];
  function nuage(el, mots){ if (!el) return; mots = mots || [];
    if (!mots.length) { if (!el.querySelector(".vide")) el.innerHTML = '<span class="vide">Les mots vont apparaître ici…</span>'; return; }
    const v = el.querySelector(".vide"); if (v) v.remove();
    const max = mots[0].n, vus = new Set();
    mots.forEach((w, i) => { vus.add(w.k); let e = el.querySelector(`[data-k="${CSS.escape(w.k)}"]`);
      if (!e) { e = document.createElement("span"); e.dataset.k = w.k; e.className = "mot neuf"; e.textContent = w.t; e.style.color = COUL_N[(el.children.length) % COUL_N.length];
        const L = [...el.children]; el.insertBefore(e, L.length ? L[Math.floor(Math.random() * (L.length + 1))] || null : null); if (sonOK) ton(660 + (i % 5) * 60, .08, .04); }
      e.style.fontSize = (1.6 + 4.4 * Math.sqrt(w.n / max)) + "vw"; e.title = w.n; });
    [...el.querySelectorAll(".mot")].forEach(e => { if (!vus.has(e.dataset.k)) e.remove(); }); }
  /* diapo : image pleine qualité de cet appareil (IndexedDB), sinon on la demande à la télécommande */
  const demandees = {};
  function diapoImg(v){ if (img[v.i] || !v.dref || demandees[v.i]) return; demandees[v.i] = 1;
    DIA.get(v.dref).then(d => { if (d) { img[v.i] = d; if (V.i === v.i) rendre(true); } else envoyer(topic, {m: "diapoQ", i: v.i}); }); }
  /* 8 nov. (« le son des quiz est vraiment bas ») : tout le son passe par un compresseur + gain ×3,2 (fort sans saturer) */
  let MAITRE = null;
  /* Volume et style de musique choisis par l'enseignant (10 nov., manette du cellulaire et barre du tableau) */
  let MAITRE_G = null;
  const VOL = () => { const v = +localStorage.quizVolume; return v >= 0 && v <= 2 ? v : 1; };
  window.quizVolume = d => { const v = Math.round(Math.max(0, Math.min(2, VOL() + d)) * 10) / 10; localStorage.quizVolume = v; try { if (MAITRE_G) MAITRE_G.gain.setTargetAtTime(3.2 * v, ac.currentTime, .05); } catch(e) {} return v; };
  function maitre(){ if (MAITRE && MAITRE.context === ac) return MAITRE; const c = ac.createDynamicsCompressor(); c.threshold.value = -18; c.knee.value = 12; c.ratio.value = 4; c.attack.value = .003; c.release.value = .2; const g = ac.createGain(); g.gain.value = 3.2 * VOL(); c.connect(g); g.connect(ac.destination); MAITRE_G = g; return MAITRE = c; }
  function ton(f, d, v, type){ if (!sonOK || V.reg.son === "non") return; try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const o = ac.createOscillator(), g = ac.createGain(); o.type = type || "sine"; o.frequency.value = f; o.connect(g); g.connect(maitre()); g.gain.setValueAtTime(v, ac.currentTime); g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + d); o.start(); o.stop(ac.currentTime + d); } catch(e) {} }
  const accord = () => { ton(523, .5, .12); setTimeout(() => ton(659, .5, .1), 120); setTimeout(() => ton(784, .7, .1), 240); };
  const tete = t => `<div class="liseret"></div><div class="haut"><b><img class="logoE" src="img/metier-plus-blanc.svg" alt="Métier+">${esc(t)}</b><span>${V.pres ? "Présentation" : "Défi+"} · code ${code.slice(0, 3)} ${code.slice(3)}</span></div>`;
  const bSon = () => `<button class="son${sonOK ? " actif" : ""}" id="bSon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/>${sonOK ? '<path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' : '<path d="M16 9.5l5 5M21 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'}</svg>${sonOK ? "Son activé" : "Activer le son"}</button>`;
  /* le navigateur exige un clic avant de jouer un son : le premier clic sur l'écran de classe (ex. « Commencer » en mode Animer) active le son,
     sauf si l'enseignant l'a coupé lui-même */
  let sonManuel = false;
  document.addEventListener("pointerdown", e => { if (sonOK || sonManuel || e.target.closest("#bSon")) return;
    sonOK = true; try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); ac.resume(); } catch(x) {}
    const b = $("bSon"); if (b){ b.classList.add("actif"); b.innerHTML = bSon().replace(/^<button[^>]*>|<\/button>$/g, ""); } }, true);
  function lignes(n, anim){
    return `<div class="lgs">${V.joueurs.slice(0, n).map(j => `<div class="lg" data-n="${esc(j.n)}"><span class="r">${j.r}</span><span>${visage(j.av, "v-e")}${esc(j.n)}</span><span>${anim && j.g ? `<small>+${j.g}</small>` : ""}${V.reg.points === "aucun" ? "" : `<b data-de="${j.pts - (anim ? j.g : 0)}" data-a="${j.pts}">${j.pts - (anim ? j.g : 0)}</b>`}</span></div>`).join("")}</div>`;
  }
  /* 8 nov. (« ça doit donner le goût ») : joueur le plus rapide à bonne réponse de la question */
  function confettis(el){ if (!el) return; const b = el.getBoundingClientRect(), C = ["#EB6A22", "#7CF0A8", "#FFD166", "#8B6CE0", "#14A3A3"];
    for (let i = 0; i < 36; i++){ const c = document.createElement("i"); c.className = "conf"; c.style.left = (b.left + b.width * Math.random()) + "px"; c.style.top = (b.top + b.height / 2) + "px"; c.style.background = C[i % C.length];
      c.style.setProperty("--dx", (Math.random() * 2 - 1) * 22 + "vw"); c.style.setProperty("--dy", -(8 + Math.random() * 22) + "vh"); c.style.setProperty("--r", (Math.random() * 720 - 360) + "deg");
      document.body.appendChild(c); setTimeout(() => c.remove(), 1700); } }
  const COURONNE = '<svg class="cour" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" fill="currentColor"/></svg>';
  const ECLAIR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="currentColor"/></svg>';
  const palier = s => s >= 8 ? "Légendaire" : s >= 5 ? "Inarrêtable" : s >= 3 ? "En feu" : s === 2 ? "Ça chauffe" : "";
  function classement(v){
    const av = v.joueurs.map((j, i) => Object.assign({}, j, {k: "j" + i, avant: j.pts - (j.g || 0)}));
    const ancien = av.slice().sort((a, b) => b.avant - a.avant || a.n.localeCompare(b.n)), N = Math.min(10, av.length);
    const rAvant = {}; ancien.forEach((j, k) => rAvant[j.k] = k + 1);
    const garde = av.filter(j => j.r <= N || rAvant[j.k] <= N);
    const ligne = j => { const d = rAvant[j.k] - j.r;
      return `<div class="lg" data-n="${j.k}" data-r="${j.r}"><span class="r">${rAvant[j.k]}</span><span>${visage(j.av, "v-e")}${esc(j.n)}${v.i === 0 ? "" : d > 0 ? ` <small class="mo">▲ ${d}</small>` : d < 0 ? ` <small class="de">▼ ${-d}</small>` : ""}${j.s >= 2 ? ` <span class="feu${j.s >= 5 ? " fort" : ""}${j.s === 2 ? " tiede" : ""}">${j.s >= 3 ? FLAMME : ""}<em>${palier(j.s)} · ${j.s} de suite</em></span>` : ""}${j.ra ? ` <span class="eclair">${ECLAIR}<em>Plus rapide</em></span>` : ""}</span><span>${j.g - (j.bo || 0) ? `<small>+${j.g - (j.bo || 0)}</small>` : ""}${j.bo ? `<small class="bo">+${j.bo} série</small>` : ""}${v.reg.points === "aucun" ? "" : `<b data-de="${j.avant}" data-a="${j.pts}">${j.avant}</b>`}</span></div>`; };
    E.innerHTML = tete("Classement après la question " + (v.qn || v.i + 1) + " sur " + (v.nq || v.n)) + `<div class="lgs" id="eLgs">${garde.sort((a, b) => rAvant[a.k] - rAvant[b.k]).map(ligne).join("")}</div>` + bSon();
    const rows = [...E.querySelectorAll("#eLgs .lg")];
    if (rows.length < 1) return;
    let pas;
    /* 9 nov. : seulement les 10 premiers; ceux qui sortent du top glissent hors du cadre, ceux qui y entrent arrivent du bas */
    { /* 9 nov. : les 10 premiers tiennent dans l'écran, au-dessus des boutons du bas */
      const L = $("eLgs"), m = rows[Math.min(N, rows.length) - 1].getBoundingClientRect().bottom - rows[0].getBoundingClientRect().top, dispo = innerHeight - rows[0].getBoundingClientRect().top - ($("animBar") ? 90 : 30);
      if (m > dispo) L.style.setProperty("--k", Math.max(.55, dispo / m * .97).toFixed(3)); }
    /* 16 nov. : toutes les rangées de la même hauteur (une pastille de série la rendait plus haute, et les rangées
       glissaient de travers : noms, rangs et points décalés au tableau) */
    { const H = Math.max(...rows.map(el => el.offsetHeight)); rows.forEach(el => el.style.minHeight = H + "px"); }
    pas = rows.length > 1 ? rows[1].offsetTop - rows[0].offsetTop : 0;
    if (rows.length > N){ const L = $("eLgs"); L.style.height = (rows[N - 1].getBoundingClientRect().bottom - rows[0].getBoundingClientRect().top) + "px"; L.style.overflow = "hidden"; }
    rows.forEach(el => { el.style.opacity = 0; el.style.transform = "translateY(12px)"; });
    rows.forEach((el, k) => setTimeout(() => { el.style.transition = "opacity .4s, transform .4s"; el.style.opacity = 1; el.style.transform = ""; }, 80 * k));
    setTimeout(() => {
      // les points montent, puis chaque rangée glisse à son nouveau rang
      rows.forEach(el => { const b = el.querySelector("b[data-a]"); if (b && b.dataset.de !== b.dataset.a) compter(b, +b.dataset.de, +b.dataset.a, 900); });
      setTimeout(() => {
        const nouv = garde.slice().sort((a, b) => a.r - b.r).map(j => j.k);
        /* 16 nov. (TNI) : positions mesurées au moment du glissement (hauteurs réelles), puis vraies places dans la page */
        const L = $("eLgs"), ordre = nouv.map(k => rows.find(el => el.dataset.n === k)).filter(Boolean);
        const ecart = rows.length > 1 ? rows[1].offsetTop - rows[0].offsetTop - rows[0].offsetHeight : 0, cibleY = new Map();
        { let y = rows[0].offsetTop; ordre.forEach(el => { cibleY.set(el, y); y += el.offsetHeight + ecart; }); }
        rows.forEach(el => { el.style.transition = "transform .9s cubic-bezier(.2,.8,.2,1)"; el.style.transform = `translateY(${(cibleY.has(el) ? cibleY.get(el) : el.offsetTop) - el.offsetTop}px)`; });
        setTimeout(() => { if (!L.isConnected) return; ordre.forEach(el => { el.style.transition = "none"; el.style.transform = ""; L.appendChild(el); });
          if (ordre.length > N) L.style.height = (ordre[N - 1].offsetTop + ordre[N - 1].offsetHeight - ordre[0].offsetTop) + "px"; }, 950);
        setTimeout(() => rows.forEach(el => el.querySelector(".r").textContent = el.dataset.r), 500);
        /* grosse remontée (3 places et plus) : la rangée brille un instant */
        const gain = el => rows.indexOf(el) - nouv.indexOf(el.dataset.n);
        if (v.i > 0) rows.forEach(el => { const d = gain(el); if (d >= 3) setTimeout(() => { el.classList.add("remonte"); el.insertAdjacentHTML("beforeend", `<span class="remTxt">+${d} places</span>`); }, 900); else if (d >= 1) setTimeout(() => el.classList.add("monteP"), 900); });
        const tete1 = rows.find(el => el.dataset.n === nouv[0]);
        if (tete1) setTimeout(() => { const r = tete1.querySelector(".r"); r.insertAdjacentHTML("afterbegin", COURONNE); tete1.classList.add("premier"); }, 950);
        if (v.i > 0 && ancien[0] && ancien[0].k !== nouv[0]) setTimeout(() => {
          E.insertAdjacentHTML("beforeend", `<div class="annonce"><small>Nouveau premier</small>${esc((av.find(j => j.k === nouv[0]) || {}).n || "")}</div>`);
          const z = E.querySelector(".annonce"); setTimeout(() => z && z.classList.add("part"), 2600); setTimeout(() => z && z.remove(), 3200);
          confettis(tete1);
          accord();
        }, 1000);
        else if (rows.some(el => gain(el) >= 1)) { ton(523, .12, .08); setTimeout(() => ton(659, .12, .08), 90); setTimeout(() => ton(784, .18, .09), 180); }
        else ton(660, .2, .07);
      }, 1000);
    }, 80 * rows.length + 400);
    const b = $("bSon"); if (b) b.onclick = () => { sonOK = !sonOK; sonManuel = !sonOK; if (sonOK) { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); ac.resume(); } b.classList.toggle("actif", sonOK); b.innerHTML = bSon().replace(/^<button[^>]*>|<\/button>$/g, ""); };
  }

  /* Musique de fond pendant une question (composée ici, synthétisée : aucun fichier, aucun droit d'auteur).
     La-mineur, 104 bpm : basse douce, arpège léger, petit charleston; plus pressée dans les 5 dernières secondes. */
  const MUS = {on: false, h: null, t: 0, pas: 0, fin: 0, gain: null};
  const ACC = [[45, 57, 60, 64], [41, 57, 60, 65], [48, 55, 60, 64], [43, 55, 59, 62]];   // Am, F, C, G (notes MIDI)
  const hz = n => 440 * Math.pow(2, (n - 69) / 12);
  function note(f, t, d, v, type){ const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.value = f; o.connect(g); g.connect(MUS.gain);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .015); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.start(t); o.stop(t + d + .05); }
  let bruit = null;
  function charleston(t, v){ if (!bruit){ bruit = ac.createBuffer(1, ac.sampleRate * .05, ac.sampleRate); const d = bruit.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length); }
    const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); s.buffer = bruit; f.type = "highpass"; f.frequency.value = 7000; g.gain.value = v; s.connect(f); f.connect(g); g.connect(MUS.gain); s.start(t); }
  /* 15 nov. (« les élèves trouvent la musique stressante ») : style Doux par défaut, plus d'accélération dans les 5 dernières secondes,
     musique moins forte; doux:true = pas de charleston */
  const STYLES = [
    {nom: "Doux", bpm: 72, acc: [[48, 60, 64, 67], [45, 57, 60, 64], [41, 57, 60, 65], [43, 55, 59, 62]], basse: "sine", arp: "sine", doux: true},
    {nom: "Atelier", bpm: 104, acc: ACC, basse: "triangle", arp: "sine"},
    {nom: "Énergie", bpm: 128, acc: [[48, 60, 64, 67], [43, 59, 62, 67], [45, 57, 60, 64], [41, 57, 60, 65]], basse: "square", arp: "triangle"},
    {nom: "Calme", bpm: 84, acc: [[50, 62, 65, 69], [43, 59, 62, 65], [48, 60, 64, 67], [45, 57, 60, 64]], basse: "sine", arp: "sine"},
    {nom: "Suspense", bpm: 96, acc: [[40, 52, 55, 59], [40, 52, 55, 58], [36, 52, 55, 60], [38, 50, 54, 57]], basse: "sawtooth", arp: "sine"}];
  const STY = () => STYLES[(+localStorage.quizMusiqueStyle || 0) % STYLES.length];
  window.quizMusique = () => { localStorage.quizMusiqueStyle = ((+localStorage.quizMusiqueStyle || 0) + 1) % STYLES.length; MUS.pas = 0; return STY().nom; };
  window.quizMusiqueNom = () => STY().nom;
  function musiqueTour(){
    const st = STY(), croche = 60 / st.bpm / 2;
    while (MUS.t < ac.currentTime + .25){
      const presse = false, sub = presse ? 2 : 1;
      for (let s = 0; s < sub; s++){
        const t = MUS.t + s * croche / sub, k = MUS.pas, a = st.acc[Math.floor(k / 16) % 4];
        if (s === 0 && k % 2 === 0) note(hz(a[0]), t, croche * 1.8, st.basse === "triangle" || st.basse === "sine" ? .16 : .06, st.basse);
        const arp = [1, 2, 3, 2, 1, 3, 2, 3][k % 8]; note(hz(a[arp] + 12), t, croche * (presse ? .5 : .9), presse ? .045 : .035, st.arp);
        if (s === 0 && k % 2 === 1 && !st.doux) charleston(t, presse ? .05 : .03);
      }
      MUS.t += croche; MUS.pas++;
    }
  }
  function musique(v, n){
    const veut = v.etat === "question" && sonOK && v.reg.son !== "non" && v.reg.musique !== "non" && v.q && (v.t0 + v.q.s * 1000 > n);
    if (veut && !MUS.on){
      try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); MUS.gain = ac.createGain(); MUS.gain.gain.value = .55; MUS.gain.connect(maitre());
        MUS.on = true; MUS.t = ac.currentTime + .08; MUS.pas = 0; musiqueTour(); MUS.h = setInterval(musiqueTour, 60); } catch(e){}
    } else if (!veut && MUS.on){
      MUS.on = false; clearInterval(MUS.h); const g = MUS.gain; try { g.gain.setTargetAtTime(.0001, ac.currentTime, .12); setTimeout(() => g.disconnect(), 800); } catch(e){}
    }
    if (veut) MUS.fin = v.t0 + v.q.s * 1000;
  }
  if (/[?&]essaiClassement=1/.test(location.search)) { window.__cl = classement; window.__vue = m => { V = m; decal = 0; rendre(true); }; }   // essais seulement
  function rendre(force){
    const v = V, n = Date.now() + decal, lecture = v.etat === "question" && v.q && n < v.t0 - 150, cle = v.etat + v.i + (lecture ? "L" : "") + (v.stats ? "S" : "");
    musique(v, n);
    document.documentElement.style.setProperty("--acc", (v.reg && v.reg.coul) || "#534AB7");
    document.body.classList.toggle("eLobby", v.etat === "lobby" || v.etat === "connexion");
    document.body.classList.toggle("eDiapo", v.etat === "diapo");
    if (v.etat === "lobby" && v.conn) {   /* présentation avec page de connexion plus loin : écran titre seulement */
      const cv = v.couv === "img" ? img[-1] : v.couv;
      if (cle !== dernier || force) E.innerHTML = tete(v.titre) + (cv ? `<div class="banniere grande"><i class="bfond" style="--u:url('${esc(cv)}')"></i><img src="${esc(cv)}" alt=""><span>${v.sujet ? `<small>${esc(v.sujet)}</small>` : ""}${esc(v.titre)}</span></div>` : `<div class="eq">${esc(v.titre)}</div>`) + bSon();
    } else if (v.etat === "lobby" || v.etat === "connexion") {
      const nj = v.joueurs.length;   /* 10 nov. : petit son quand un participant arrive */
      if (rendre.nj != null && nj > rendre.nj && sonOK) { ton(784, .12, .07); setTimeout(() => ton(1175, .22, .07), 110); }
      rendre.nj = nj;
      const cv = v.couv === "img" ? img[-1] : v.couv;
      /* 13 nov. (vidéo du TNI : la salle d'attente clignotait) : la page n'est refaite que si le titre, l'image ou la taille change;
         sinon on change seulement le nombre et les noms (avant : tout refait à chaque message, l'image et le code QR disparaissaient) */
      const lobK = cle + "|" + (cv || "") + "|" + v.titre + "|" + innerWidth + "|" + sonOK, nbT = `${nj} participant${nj > 1 ? "s" : ""}`, nomsH = v.joueurs.map(j => `<span>${visage(j.av, "v-e")}${esc(j.n)}</span>`).join("");
      if (rendre.lobK === lobK && $("eNoms")) { if ($("eNb").textContent !== nbT) $("eNb").textContent = nbT; if (rendre.nomsH !== nomsH) { $("eNoms").innerHTML = nomsH; rendre.nomsH = nomsH; } }
      else { rendre.lobK = lobK; rendre.nomsH = nomsH;
      E.innerHTML = tete(v.titre) + (cv ? `<div class="banniere" style="--u:url('${esc(cv)}')"><i class="bfond"></i><img src="${esc(cv)}" alt="" onload="if(this.naturalHeight>this.naturalWidth*1.1)this.parentNode.classList.add('port')"><span>${v.sujet ? `<small>${esc(v.sujet)}</small>` : ""}${esc(v.titre)}</span></div>` : "") + `<div class="lob"><div class="qrc"><div class="qr" id="eQr"></div><div class="codeL">Code de la partie</div><div class="code">${code.slice(0, 3)} ${code.slice(3)}</div></div><div>${V.pres ? "" : `<div class="defiLogo">Défi<span>+</span></div>`}<ol class="etapesL"><li><b>1</b>Prends ton cellulaire</li><li><b>2</b>Scanne le code QR<small>avec l'appareil photo</small></li><li><b>3</b>Pas de caméra ?<small>va sur <u>${esc(location.host)}/quiz</u> et tape le code</small></li><li><b>4</b>Choisis ton personnage<small>et écris ton prénom</small></li></ol><div id="eNb" style="font-size:1.6vw;color:#B5AFA6">${nbT}</div>
        <div class="noms" id="eNoms">${nomsH}</div></div></div>` + bSon();
      try { const tq = cv ? .16 : .22; new QRCode($("eQr"), {text: url, width: Math.round(innerWidth * tq), height: Math.round(innerWidth * tq), correctLevel: QRCode.CorrectLevel.H}); if (window.qrLogo) qrLogo($("eQr")); } catch(e) { $("eQr").textContent = url; } }
    } else if (v.etat === "diapo") {
      diapoImg(v);
      if (cle !== dernier || force) E.innerHTML = img[v.i] ? `<div class="ediapo ${v.dmv === "kb" || v.dmv === "focus" ? v.dmv : ""} k${v.i % 2}"><div class="dwrap"><img src="${img[v.i]}" alt="">${v.dlg ? `<div class="dLogo" style="left:${+v.dlg[0]}%;top:${+v.dlg[1]}%;width:${+v.dlg[2]}%;height:${+v.dlg[3]}%">${LOGO_ANIM}</div>` : ""}</div></div>` + bSon() : tete(v.titre) + bSon();
    } else if (v.etat === "inter" && v.inter) {
      if (cle !== dernier || force) { const I = v.inter; E.innerHTML = tete("L'interrogatoire") + `<div class="inter monte"><div class="interS"><h3>Les suspects</h3>${I.S.map(x => `<div class="sus"><b>${esc(x.n)}</b><span>${x.bons} / ${x.tot} bonnes réponses</span><span>série de ${x.max}${x.moy ? " · répond en " + String(x.moy).replace(".", ",") + " s" : ""}</span></div>`).join("")}</div>
        <div class="interQ"><h3>Le débat</h3><div class="interM">L'animateur pose ses questions. Défends-toi. Accuse avec des faits. Observe le non-verbal.</div><div class="interC" id="eInterC"></div></div></div>` + bSon(); if (cle !== dernier) accord(); }
      { const r = Math.max(0, 120 - Math.floor((Date.now() - v.interT) / 1000)), c = $("eInterC"); if (c) { c.textContent = Math.floor(r / 60) + ":" + String(r % 60).padStart(2, "0"); c.classList.toggle("fini", !r); } }
    } else if (v.etat === "fin" && v.stats) {
      if (cle !== dernier || force) { const S = v.stats, moy = Math.round(S.reduce((a, x) => a + x.p, 0) / Math.max(1, S.length)), dures = S.filter(x => x.p < 60);
        E.innerHTML = tete("Statistiques de la classe") + `<div class="stats monte"><div class="statsM"><b>${moy} %</b><span>de bonnes réponses en moyenne</span>${dures.length ? `<em>${dures.length} question${dures.length > 1 ? "s" : ""} à revoir (moins de 60 %)</em>` : "<em>Aucune question sous 60 % : bravo!</em>"}</div>
        <div class="statsL">${S.map(x => `<div class="stq ${x.p < 60 ? "dur" : ""}"><span class="stn">${x.i + 1}</span><span class="stt">${esc(x.q)}${x.p < 60 && S.filter(y => y.p < x.p || (y.p === x.p && y.i < x.i)).length < 5 ? `<small>Réponse : ${esc(x.bon)}</small>` : ""}</span><span class="stb"><i style="width:${x.p}%"></i></span><b>${x.p} %</b></div>`).join("")}</div></div>` + bSon(); }
    } else if (v.etat === "vtr") {
      if (cle !== dernier || force) { E.innerHTML = tete("Le tricheur") + `<div class="dblE monte"><b>Qui est le tricheur?</b><span>Un élève voyait les bonnes réponses.<br>Vote sur ton cellulaire, ou passe. Ceux qui le trouvent se partagent la moitié de ses points.<br>Ceux qui se trompent lui donnent 20 % des leurs.</span><em id="eVtr"></em></div>` + bSon(); if (cle !== dernier) accord(); }
      $("eVtr").textContent = v.vtrN + " vote" + (v.vtrN > 1 ? "s" : "") + " sur " + v.joueurs.length;
    } else if (v.etat === "vtrRes" && v.vtrRes) {   /* 25 nov. (Jeremy : « on veut voir le pointage de l'accusé monter et descendre ») */
      if (cle !== dernier || force) { const x = v.vtrRes, T = (x.L || []).find(o => o.tr), A = (x.L || []).filter(o => !o.tr);
        const carte = (o, gros) => `<div class="vr ${gros ? "vrT" : "vr-" + o.k}" data-e="${esc(JSON.stringify(o.e))}">${o.av != null && o.av >= 0 ? `<img src="${persoImg(o.av)}" alt="" onerror="this.remove()">` : ""}<b>${esc(o.n)}</b><span class="vrP">${o.e[0]}</span><em class="vrD"></em></div>`;
        E.innerHTML = tete("Le tricheur") + `<div class="vrW monte">${T ? carte(T, true) : ""}<div class="vrC" id="vrC">C'était ${esc(x.nom)}!</div><div class="vrL">${A.map(o => carte(o)).join("")}</div></div>` + bSon();
        if (cle !== dernier) { accord(); const cap = ["Les mauvais votes lui donnent des points…", "Ceux qui l'ont trouvé se partagent la moitié des siens…", x.anim === "rate" ? "L'animateur s'est trompé : +1000 pour le tricheur!" : ""];
          [1, 2, 3].forEach(k => setTimeout(() => { if (!document.querySelector(".vrW")) return; let bouge = false;
            document.querySelectorAll(".vr[data-e]").forEach(c => { const e = JSON.parse(c.dataset.e), a = e[k - 1], b = e[k]; if (a === b) return; bouge = true; const P0 = c.querySelector(".vrP"), D = c.querySelector(".vrD");
              D.textContent = (b > a ? "+" : "−") + Math.abs(b - a); c.classList.remove("monteP", "baisseP"); void c.offsetWidth; c.classList.add(b > a ? "monteP" : "baisseP");
              const t0 = performance.now(), f = now => { const r = Math.min(1, (now - t0) / 1100); P0.textContent = Math.round(a + (b - a) * (1 - Math.pow(1 - r, 3))); if (r < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); });
            if (bouge && cap[k - 1]) $("vrC").textContent = cap[k - 1]; }, 900 + (k - 1) * 2200)); } }
    } else if (v.etat === "mise") {
      if (cle !== dernier || force) {
        E.innerHTML = tete("Question spéciale") + `<div class="dblE monte"><b>Double ou rien</b><span>Sur ton cellulaire : mise tous tes points.<br>Bonne réponse = points doublés. Mauvaise réponse = 0.</span><em id="eMises"></em></div>` + bSon();
        if (cle !== dernier) accord();
      }
      $("eMises").textContent = v.mises + " joueur" + (v.mises > 1 ? "s misent" : " mise") + " tout";
    } else if (v.etat === "question" && v.q) {
      const t = v.q.t || "choix", r = Math.max(0, Math.ceil((v.t0 + v.q.s * 1000 - n) / 1000));
      if (cle !== dernier || force) {
        const im = v.q.img && img[v.i] ? (v.q.zoom ? `<div class="ezoom monte" style="background-image:url('${img[v.i]}');background-position:${+v.q.zoom.x}% ${+v.q.zoom.y}%"><span>Zoom mystère</span></div>` : `<img class="eimg monte" src="${img[v.i]}" alt="">`) : "";
        const lettresSeul = v.reg.lettres === "oui" && ["choix", "multi"].includes(t);
        let corps = "";
        if (lecture) corps = `<div class="elec monte">Les choix arrivent dans <b id="eLec"></b> s</div>`;
        else if (t === "erreur") corps = `<div class="ephr monte">${v.q.ch.map((c, k) => `<span class="k${k}"><i class="let">${SYMB[k]}</i>${esc(c)}</span>`).join(" ")}</div>`;
        else if (t === "ordre") corps = `<div class="eord">${v.q.ch.map((c, k) => `<div class="k${k} monte" style="animation-delay:${.1 + k * .06}s"><span><i class="let">${SYMB[k]}</i>${esc(c)}</span></div>`).join("")}</div>`;
        else if (t === "nuage") corps = `<div class="enuage" id="eNuage"></div>`;
        else if (t === "echelle") corps = `<div class="eech monte">${["Pas du tout", "Un peu", "Moyen", "Assez", "Tout à fait"].map((l, k) => `<div><b>${k + 1}</b><span>${l}</span></div>`).join("")}</div>`;
        else if (t === "paires") corps = `<div class="epair"><div>${(v.q.g || []).map((x, j) => `<div class="monte" style="animation-delay:${.1 + j * .06}s"><span><i class="let">${j + 1}</i>${esc(x)}</span></div>`).join("")}</div><div>${v.q.ch.map((c, k) => `<div class="k${k} monte" style="animation-delay:${.3 + k * .06}s"><span><i class="let">${SYMB[k]}</i>${esc(c)}</span></div>`).join("")}</div></div>`;
        else if (t === "estim") corps = `<div class="enb monte">Estime et tape ta réponse sur ton cellulaire${v.q.u ? ` <small>(en ${esc(v.q.u)})</small>` : ""}</div>`;
        else if (t === "nombre") corps = `<div class="enb monte">Calcule et tape ta réponse sur ton cellulaire${v.q.u ? ` <small>(en ${esc(v.q.u)})</small>` : ""}</div>`;
        else corps = `<div class="ech${lettresSeul ? " lettres" : ""}">${v.q.ch.map((c, k) => `<div class="k${k} monte" style="animation-delay:${.1 + k * .08}s"><span><i class="let">${SYMB[k]}</i>${lettresSeul ? "" : esc(c)}</span></div>`).join("")}</div>${lettresSeul ? '<div class="enb" style="font-size:1.6vw">Lis les choix sur ton cellulaire</div>' : ""}`;
        const sous = {sondage: "Sondage · vote sur ton cellulaire", echelle: "Échelle de confiance · réponds de 1 à 5, c'est anonyme", nuage: "Nuage de mots · écris un mot sur ton cellulaire", multi: "Plusieurs bonnes réponses", ordre: "Remets dans le bon ordre", nombre: "Calcul", paires: "Associe les paires", estim: "Estimation · le plus proche gagne", erreur: "Trouve l'erreur"}[t];
        E.innerHTML = tete((v.sp ? "Activité " : "Question ") + (v.qn || v.i + 1) + " sur " + (v.nq || v.n)) + (sous ? `<div class="etype">${sous}</div>` : "") + `<div class="eq monte">${esc(v.q.q)}</div>${im}${corps}
          <div class="cpt"><span id="eRep"></span><b id="eT"></b></div>` + bSon();
        if (cle !== dernier && !cle.endsWith("L")) ton(440, .25, .08);
      }
      $("eRep").textContent = v.nrep + " réponse" + (v.nrep > 1 ? "s" : "") + " sur " + v.joueurs.length;
      if (v.q.t === "nuage") nuage($("eNuage"), v.mots);
      if (lecture) { $("eLec").textContent = Math.max(1, Math.ceil((v.t0 - n) / 1000)); $("eT").textContent = ""; }
      else { $("eT").textContent = r; if (r <= 5 && r > 0 && tic !== r) { tic = r; ton(523, .06, .025, "sine"); } }
    } else if (v.etat === "rev" && v.q && ["sondage", "echelle"].includes(v.q.t)) {
      if (cle !== dernier || force) {
        const ec = v.q.t === "echelle", n5 = ec ? 5 : v.q.ch.length, tot = Math.max(1, v.cpt.slice(0, n5).reduce((a, b) => a + b, 0));
        const moy = ec ? v.cpt.slice(0, 5).reduce((a, b, k) => a + b * (k + 1), 0) / tot : 0, max = Math.max(...v.cpt.slice(0, n5));
        const lignes = Array.from({length: n5}, (_, k) => `<div class="k${k % 4}${max && v.cpt[k] === max ? " top" : ""}"><span><i class="let">${ec ? k + 1 : SYMB[k]}</i>${esc(ec ? ["Pas du tout", "Un peu", "Moyen", "Assez", "Tout à fait"][k] : v.q.ch[k])}</span><em>${Math.round(100 * v.cpt[k] / tot)} %</em><i class="bar" data-w="${100 * v.cpt[k] / tot}"></i></div>`).join("");
        E.innerHTML = tete(ec ? "Échelle de confiance" : "Sondage") + `<div class="eq">${esc(v.q.q)}</div>` + (ec && v.nrep ? `<div class="emoy monte">Moyenne de la classe : <b>${moy.toFixed(1).replace(".", ",")}</b> sur 5</div>` : "") + `<div class="ech esond">${lignes}</div><div class="enb">${v.nrep} réponse${v.nrep > 1 ? "s" : ""} · anonyme</div>` + bSon();
        requestAnimationFrame(() => E.querySelectorAll(".bar").forEach(b => b.style.width = b.dataset.w + "%"));
        if (cle !== dernier) accord();
      }
    } else if (v.etat === "rev" && v.q && v.q.t === "nuage") {
      if (cle !== dernier || force) { E.innerHTML = tete("Nuage de mots") + `<div class="eq">${esc(v.q.q)}</div><div class="enuage fin" id="eNuage"></div>` + bSon(); if (cle !== dernier) accord(); }
      nuage($("eNuage"), v.mots);
    } else if (v.etat === "rev" && v.q) {
      if (cle !== dernier || force) {
        const t = v.q.t || "choix", tot = Math.max(1, v.nrep), estBon = k => t === "multi" && Array.isArray(v.bon) ? v.bon.includes(k) : k === v.bon;
        let corps;
        if (t === "ordre") corps = `<div class="eord rev">${v.bon.map((k, j) => `<div class="bon monte" style="animation-delay:${j * .08}s"><span><i class="let">${j + 1}</i>${esc(v.q.ch[k])}</span></div>`).join("")}</div><div class="enb">${v.cpt[0]} sur ${v.cpt[1]} ont le bon ordre</div>`;
        else if (t === "paires") corps = `<div class="eord rev">${v.bon.map((k, j) => `<div class="bon monte" style="animation-delay:${j * .08}s"><span><i class="let">${j + 1}</i>${esc((v.q.g || [])[j])} <b class="pfl">→</b> ${esc(v.q.ch[k])}</span></div>`).join("")}</div><div class="enb">${v.cpt[0]} sur ${v.cpt[1]} ont tout associé</div>`;
        else if (t === "estim") { const V = (v.vals || []).slice(0, 60), b = +v.bon, mg = Math.abs(b) * (v.q.tol || 10) / 100, mn = Math.min(b - mg, ...V), mx = Math.max(b + mg, ...V), w = (mx - mn) || 1, X = x => (4 + 92 * (x - mn) / w).toFixed(1);
          corps = `<div class="enbR monte">${esc(v.q.bonTxt)}</div><div class="eligne monte"><i class="axe"></i>${V.map((x, k) => `<i class="pt" style="left:${X(x)}%;animation-delay:${.2 + k * .03}s"></i>`).join("")}<i class="zone" style="left:${X(b - mg)}%;width:${(X(b + mg) - X(b - mg)).toFixed(1)}%"></i><b class="cible" style="left:${X(b)}%"></b><span class="g">${esc(fmtN(mn))}</span><span class="d">${esc(fmtN(mx))}</span></div><div class="enb">${v.cpt[0]} sur ${v.cpt[1]} dans la marge</div>`; }
        else if (t === "nombre") corps = `<div class="enbR monte">${esc(v.q.bonTxt)}</div><div class="enb">${v.cpt[0]} sur ${v.cpt[1]} ont trouvé</div>`;
        else if (t === "erreur") corps = `<div class="ephr rev">${v.q.ch.map((c, k) => `<span class="k${k} ${k === v.bon ? "faux" : "pas"}"><i class="let">${SYMB[k]}</i>${esc(c)}<em>${v.cpt[k]}</em></span>`).join(" ")}</div>`;
        else corps = `<div class="ech">${v.q.ch.map((c, k) => `<div class="k${k} ${estBon(k) ? "bon" : "pas"}"><span><i class="let">${estBon(k) ? "✓" : SYMB[k]}</i>${esc(c)}</span><em>${v.cpt[k]}</em><i class="bar" data-w="${100 * v.cpt[k] / tot}"></i></div>`).join("")}</div>`;
        const im = v.q.img && img[v.i] && v.q.zoom ? `<img class="eimg petit monte" src="${img[v.i]}" alt="">` : "";
        E.innerHTML = tete((v.sp ? "Activité " : "Question ") + (v.qn || v.i + 1) + " sur " + (v.nq || v.n)) + `<div class="eq">${esc(v.q.q)}</div>${im}${corps}
          ${v.q.expl ? `<div class="eexpl monte">${esc(v.q.expl)}</div>` : ""}
          ${v.reg.classement === "oui" ? `<div class="cpt"><span>Classement dans quelques secondes…</span></div>` : ""}` + bSon();
        requestAnimationFrame(() => E.querySelectorAll(".bar").forEach(b => b.style.width = b.dataset.w + "%"));
        if (cle !== dernier) { accord(); clearTimeout(rendre.tc); if (v.reg.classement === "oui") rendre.tc = setTimeout(() => { if (dernier === cle) classement(v); }, 5500); }
      }
    } else if (v.etat === "fin" && v.sp) {   /* présentation de formation : un merci, pas de classement */
      if (cle !== dernier || force) { E.innerHTML = tete(v.titre) + `<div class="eMerci monte"><div class="gros">Merci !</div><div>Fin de la présentation</div></div>` + bSon(); if (cle !== dernier) accord(); }
    } else if (v.etat === "fin") {
      if (cle !== dernier || force) {
        const c = v.joueurs, p = (q, k) => q ? `<div class="col c${k}">${k === 1 ? '<span class="titre1">Meilleur score</span>' : ""}<span class="pv">${k === 1 ? COURONNE : ""}${visage(q.av, "v-p")}</span><div class="p${k}"><b>${k}</b>${esc(q.n)}${v.reg.points === "aucun" ? "" : `<br><span class="pp" data-v="${q.pts}">0</span>`}</div></div>` : "";
        /* sous le podium : les suivants (4e et plus) en deux colonnes compactes, pour que tout le monde soit visible */
        const reste = c.slice(3, 23).map(j => `<div class="lg"><span class="r">${j.r}</span><span>${visage(j.av, "v-e")}${esc(j.n)}</span><span>${v.reg.points === "aucun" ? "" : `<b>${j.pts}</b>`}</span></div>`).join("");
        E.innerHTML = tete("Podium · " + v.titre) + `<div class="podium">${p(c[1], 2)}${p(c[0], 1)}${p(c[2], 3)}</div>` + (reste ? `<div class="lgs fin">${reste}</div>` : "") + bSon();
        if (cle !== dernier) {   /* spectacle : 3e, 2e, roulement de tambour, puis le 1er */
          const pts = (k, d) => setTimeout(() => { const e = E.querySelector(`.c${k} .pp`); if (e) compter(e, 0, +e.dataset.v, 1200); }, d);
          pts(3, 900); pts(2, 2300); pts(1, 4300);
          setTimeout(() => ton(392, .35, .1), 700); setTimeout(() => ton(494, .35, .1), 2100);
          for (let i = 0; i < 18; i++) setTimeout(() => ton(110 + i * 4, .06, .05 + i * .004, "triangle"), 2900 + i * 75);   /* roulement */
          setTimeout(() => { accord(); setTimeout(() => ton(1047, .9, .1), 380); }, 4400);
          [4500, 5300, 6200].forEach(d => setTimeout(() => confettis(E.querySelector(".c1 .p1")), d));
        }
      }
    }
    dernier = cle;
    let mn = $("eMains"); if (!mn) { mn = document.createElement("button"); mn.id = "eMains"; mn.title = "Toucher quand c'est répondu"; document.body.appendChild(mn); mn.onclick = () => envoyer(topic, {m: "mainsRaz"}); }
    mn.classList.toggle("cache", !v.mains || v.etat === "fin"); if (v.mains) mn.innerHTML = `<span>✋</span>${v.mains} question${v.mains > 1 ? "s" : ""}`;
    const b = $("bSon"); if (b) b.onclick = () => { sonOK = !sonOK; sonManuel = !sonOK; if (sonOK) { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); ac.resume(); ton(660, .2, .08); } b.classList.toggle("actif", sonOK); b.innerHTML = bSon().replace(/^<button[^>]*>|<\/button>$/g, ""); };
  }
  ecouter(topic, m => {
    if (m.m === "cmd") { if (window.manetteVue) window.manetteVue(m); return; }
    if (m.m === "img") { img[m.i] = m.data; if (((V.etat === "question" || V.etat === "diapo") && V.i === m.i) || (m.i === -1 && V.etat === "lobby")) rendre(true); }
    else if (m.m === "vue") { V = m; decal = m.now - Date.now(); rendre(m.etat === "lobby" || m.etat === "connexion"); }
  }, ok => { if (ok) envoyer(topic, {m: "ecran?"}); });
  rendre(true); setInterval(() => { if (V.etat === "question" || V.etat === "mise" || V.etat === "inter") rendre(); }, 400);
}
