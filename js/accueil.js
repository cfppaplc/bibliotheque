/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — accueil.js (sorti de la page le 15 nov.) */
const PPE = {
  lunettes: { name: "Lunettes de sécurité", svg: '<svg viewBox="0 0 64 40" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"><path d="M4 12h56"/><rect x="6" y="12" width="22" height="18" rx="7"/><rect x="36" y="12" width="22" height="18" rx="7"/><path d="M28 18q4-4 8 0"/></svg>' },
  bottes: { name: "Bottes de sécurité", svg: '<svg viewBox="0 0 64 56" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"><path d="M16 4h18v26l18 6q8 3 8 10v4H8V4z"/><path d="M8 44h52"/><path d="M38 34v10"/></svg>' },
  gants: { name: "Gants de travail", svg: '<svg viewBox="0 0 56 64" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"><path d="M14 60V34L6 24q-3-4 1-7t7 2l4 6V8q0-4 4-4t4 4v18V6q0-4 4-4t4 4v20V8q0-4 4-4t4 4v24q0 6-2 12l-4 16z"/><path d="M14 52h28"/></svg>' },
  oreilles: { name: "Protection auditive", svg: '<svg viewBox="0 0 64 56" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"><path d="M12 30V24a20 20 0 0 1 40 0v6"/><rect x="4" y="28" width="14" height="22" rx="5"/><rect x="46" y="28" width="14" height="22" rx="5"/></svg>' },
  vetements: { name: "Vêtements de travail", svg: '<svg viewBox="0 0 64 56" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"><path d="M22 4l10 8 10-8 18 10-6 14-8-4v30H18V24l-8 4-6-14z"/><path d="M32 12v42"/></svg>' },
  cheveux: { name: "Cheveux attachés", svg: '<svg viewBox="0 0 64 56" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"><circle cx="28" cy="28" r="16"/><path d="M14 22q14-14 28 0"/><circle cx="50" cy="16" r="6"/><path d="M44 18l-4 2"/></svg>' }
};

const LOGO_EGI = "data:image/jpeg;base64,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";
const PROGS = { "5333": "DEP 5333 · Plomberie et chauffage", "5211": "DEP 5211 · Entretien général d'immeubles" };
const COMPS = [["254-991", "Se situer au regard des organismes de l'industrie de la construction", "chantier", "5333"], ["254-992", "Prévenir les atteintes à la santé, à la sécurité et à l'intégrité physique sur les chantiers de construction", "securite", "5333"], ["307-402", "Se situer au regard du métier, de la démarche de formation et communiquer en milieu de travail", "chantier", "5333"], ["307-414", "Manutentionner des équipements, des matériaux et des produits", "atelier", "5333"], ["307-428", "Assembler des systèmes de mécanique de tuyauterie", "tuyaux", "5333"], ["307-435", "Installer des composants électriques", "elec", "5333"], ["307-443", "Interpréter des plans et devis", "plan", "5333"], ["307-458", "Installer des réseaux d'évacuation", "evacuation", "5333"], ["307-468", "Installer des réseaux de ventilation", "ventil", "5333"], ["307-478", "Intervenir sur des dispositifs de commande électriques et électroniques", "elec", "5333"], ["307-485", "Effectuer des travaux de soudage et de brasage", "soudure", "5333"], ["307-498", "Installer des systèmes de distribution d'eau chaude et d'eau froide, des équipements sanitaires et des accessoires", "tuyaux", "5333"], ["307-505", "Entretenir et réparer de la tuyauterie, des équipements sanitaires et des accessoires", "sanitaire", "5333"], ["307-513", "Présenter de l'information relative aux notions d'énergie et de chauffage", "flammes", "5333"], ["307-528", "Installer, entretenir et réparer des appareils alimentés au mazout", "flammes", "5333"], ["307-538", "Installer et réparer des systèmes de chauffage directs et renversés", "flammes", "5333"], ["307-544", "Installer et réparer des systèmes de chauffage périmétriques", "tuyaux", "5333"], ["307-558", "Installer des systèmes alimentés au gaz (naturel et propane)", "gaz", "5333"], ["307-565", "Installer et réparer des systèmes de chauffage par rayonnement", "radiant", "5333"], ["307-578", "Installer et réparer des systèmes à vapeur à basse pression", "tuyaux", "5333"], ["307-581", "Effectuer des recherches d'emploi", "communication", "5333"], ["436-201", "Se situer au regard du métier et de la démarche de formation", "chantier", "5211"], ["436-212", "Appliquer les règles de santé et de sécurité au travail", "securite", "5211"], ["436-222", "Entretenir des outils et des appareils, gérer un petit entrepôt", "atelier", "5211"], ["436-238", "Effectuer l'entretien ménager d'un bâtiment", "menage", "5211"], ["436-244", "Effectuer des travaux mineurs d'entretien général d'un bâtiment", "atelier", "5211"], ["436-255", "Effectuer des travaux simples d'entretien et de réparation en menuiserie", "bois", "5211"], ["436-266", "Diagnostiquer des problèmes simples sur les systèmes de la mécanique du bâtiment", "tuyaux", "5211"], ["436-274", "Effectuer des vérifications et des réparations mineures sur du matériel électrique", "elec", "5211"], ["436-282", "Communiquer en milieu de travail", "communication", "5211"], ["436-295", "Effectuer des travaux d'entretien sur un système de plomberie et chauffage", "sanitaire", "5211"], ["436-304", "Effectuer des travaux d'entretien sur un système de climatisation et de ventilation", "ventil", "5211"], ["436-312", "Effectuer des travaux d'entretien sur un système de protection incendie", "incendie", "5211"], ["436-323", "Interpréter des plans de bâtiments", "plan", "5211"], ["436-333", "Utiliser un micro-ordinateur", "informatique", "5211"], ["436-343", "Effectuer des tâches liées à l'administration d'un bâtiment et à l'application d'un plan d'urgence", "administration", "5211"], ["436-352", "Utiliser des moyens de recherche d'emploi", "communication", "5211"], ["436-364", "S'intégrer au marché du travail", "chantier", "5211"]];
const compInfo = code => COMPS.find(c => c[0] === code);
/* Noms courts (30 oct., « simplifier le nom des matières ») : affichés partout; le titre officiel reste en bulle d'aide et pour l'aide de Claude. */
const COURT = {"254-991": "Industrie de la construction", "254-992": "Santé et sécurité sur les chantiers", "307-402": "Le métier et la communication", "307-414": "Manutention", "307-428": "Mécanique de tuyauterie", "307-435": "Composants électriques", "307-443": "Plans et devis", "307-458": "Réseaux d'évacuation", "307-468": "Réseaux de ventilation", "307-478": "Commandes électriques et électroniques", "307-485": "Soudage et brasage", "307-498": "Eau chaude, eau froide et sanitaires", "307-505": "Entretien et réparation sanitaire", "307-513": "Notions d'énergie", "307-528": "Appareils au mazout", "307-538": "Chauffage direct et renversé", "307-544": "Chauffage périmétrique", "307-558": "Systèmes au gaz", "307-565": "Chauffage par rayonnement", "307-578": "Vapeur à basse pression", "307-581": "Recherche d'emploi", "436-201": "Le métier et la formation", "436-212": "Santé et sécurité", "436-222": "Outils et petit entrepôt", "436-238": "Entretien ménager", "436-244": "Entretien général mineur", "436-255": "Menuiserie", "436-266": "Diagnostic en mécanique du bâtiment", "436-274": "Matériel électrique", "436-282": "Communiquer en milieu de travail", "436-295": "Plomberie et chauffage", "436-304": "Climatisation et ventilation", "436-312": "Protection incendie", "436-323": "Plans de bâtiments", "436-333": "Micro-ordinateur", "436-343": "Administration et plan d'urgence", "436-352": "Recherche d'emploi", "436-364": "Intégration au marché du travail"};
const titreComp = code => COURT[code] || (compInfo(code) || [])[1] || "";
function moduleText(code = cfg.comp, other = cfg.module) { const c = compInfo(code); return c ? c[0] + " · " + titreComp(code) : (other || ""); }
function moduleOfficiel(code, other) { const c = compInfo(code); return c ? c[0] + " · " + c[1] : (other || ""); }
function bgKind() { if (cfg.bg && cfg.bg !== "auto") return cfg.bg; const c = compInfo(cfg.comp); return c ? c[2] : "tuyaux"; }

const DEFAULTS = {
  title: "Pavillon de l'Avenir",
  group: "",
  prog: "5333",
  msg: "",
  amStart: "08:30",
  pmStart: "13:00",
  comp: "307-505",
  module: "",
  steps: "Théorie : diagnostiquer une fuite\nDémonstration : remplacer une cartouche\nTravail pratique à l'atelier\nRangement et nettoyage\nBilan de la période",
  goals: "Repérer les causes d'une fuite sur un robinet\nRemplacer une cartouche et un joint torique\nVérifier l'étanchéité avant de rendre l'appareil",
  ppe: ["lunettes", "bottes", "gants", "vetements"],
  word: "Clapet antiretour",
  def: "Dispositif qui laisse passer l'eau dans un seul sens et empêche le retour d'écoulement dans le réseau d'alimentation.",
  q: "Pourquoi ferme-t-on l'eau en amont avant de démonter un robinet?",
  a: "Pour couper la pression dans la section de tuyauterie et éviter l'inondation pendant le démontage.",
  theme: "auto",
  couleurs: "jour",
  anim: "auto",
  style: "pro",
  scale: "auto",
  clock: "num",
  bg: "auto",
  hidden: ["objectifs", "epi", "mot", "question", "deroulement"]
};

let cfg = { ...DEFAULTS };
const OLD_MSG = "On commence à l'heure : pose ton sac et sors ton cahier de notes.";
try { const s = localStorage.getItem("accueil-atelier-v4"); if (s) cfg = { ...DEFAULTS, ...JSON.parse(s) }; if (cfg.msg === OLD_MSG) cfg.msg = ""; if (!cfg.themeV2) { cfg.theme = "dark"; cfg.themeV2 = 1; } if (!cfg.themeV3) { cfg.theme = "auto"; cfg.themeV3 = 1; } if (!cfg.compV) { cfg.comp = "307-505"; cfg.module = ""; cfg.bg = "auto"; cfg.compV = 1; } if (!cfg.simpleV) { cfg.hidden = [...new Set([...(cfg.hidden || []), "objectifs", "epi", "mot", "question"])]; cfg.simpleV = 1; } if (!cfg.simpleV2) { cfg.hidden = [...new Set([...(cfg.hidden || []), "deroulement"])]; cfg.simpleV2 = 1; } if (!cfg.simpleV3) { cfg.hidden = ["objectifs", "epi", "mot", "question", "deroulement"]; cfg.clock = "num"; cfg.couleurs = "fixe"; cfg.simpleV3 = 1; } } catch (e) {}
function save() { try { localStorage.setItem("accueil-atelier-v4", JSON.stringify(cfg)); } catch (e) {} }

const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, "0");
const toMin = t => { const [h, m] = t.trim().split(/[:h]/).map(Number); return h * 60 + (m || 0); };
const fmt = min => { min = Math.round(min); return Math.floor(min / 60) + " h " + pad(min % 60); };
function dur(sec) {
  sec = Math.max(0, Math.round(sec));
  const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60;
  if (h) return h + " h " + pad(m) + " min";
  if (m >= 10) return m + " min";
  if (m) return m + " min " + pad(s) + " s";
  return s + " s";
}

// Structure fixe d'une période : les pauses ne peuvent pas être retirées
const BLOCKS = [["cours", 60], ["pause", 5], ["cours", 60], ["pause", 15], ["cours", 60]];
const CLASS_MIN = 180, SPAN = 200;
/* Examen : case à cocher dans « Préparer le cours ». Aucune pause dans l'horaire; valable pour la période préparée seulement. */
const jourAuj = () => new Date().toDateString();
const isoJour = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const dateIso = s => { const [a, m, j] = s.split("-").map(Number); return new Date(a, m - 1, j); };
const nomJour = (s, court) => { const t = dateIso(s).toLocaleDateString("fr-CA", court ? { weekday: "short", day: "numeric", month: "short" } : { weekday: "long", day: "numeric", month: "long" }); return t.charAt(0).toUpperCase() + t.slice(1); };
/* Durée d'un cours (30 oct., « des fois j'ai des cours de seulement une heure ») : chaque période (jour + matin/après-midi) peut avoir sa durée et son heure de début.
   cfg.slot = "AAAA-MM-JJ|am" (période du contenu affiché), cfg.duree (minutes, 200 = période complète), cfg.debut ("HH:MM" ou "" = heure habituelle). */
const DUREES = [[200, "Période complète · 3 h 20"], [60, "1 heure"], [90, "1 h 30"], [120, "2 heures"], [150, "2 h 30"]];
function blocsPour(D, exam) {
  if (exam) return [["cours", D]];
  if (D === SPAN) return BLOCKS;
  if (D <= 75) return [["cours", D]];                                   /* 1 heure : pas de pause */
  if (D <= 145) { const a = Math.round((D - 5) / 2 / 5) * 5; return [["cours", a], ["pause", 5], ["cours", D - 5 - a]]; }
  return [["cours", 60], ["pause", 5], ["cours", 60], ["pause", 15], ["cours", D - 140]];
}
function prepOuvert() { const p = document.getElementById("prep"); return !!p && !p.hidden; }
const ctxForm = () => ({ D: +(document.getElementById("f-duree") || {}).value || SPAN, exam: document.getElementById("f-exam").checked });
function ctxDe(start) { const p = periods().find(x => x.start === start); return { D: p ? p.end - p.start : SPAN, exam: !!(p && p.actif) && cfg.examen === jourAuj() }; }
const blocs = ctx => blocsPour(ctx.D, ctx.exam);
const classMin = ctx => blocs(ctx).reduce((t, [ty, d]) => t + (ty === "cours" ? d : 0), 0);
const dureeTexte = m => m >= 60 ? Math.floor(m / 60) + " h" + (m % 60 ? " " + String(m % 60).padStart(2, "0") : "") : m + " min";

function periods() {
  const auj = isoJour(new Date());
  return [["Matin", "am", cfg.amStart], ["Après-midi", "pm", cfg.pmStart]].filter(p => /\d/.test(p[2] || ""))
    .map(([name, key, t]) => { const actif = cfg.slot === auj + "|" + key, st = toMin(actif && cfg.debut ? cfg.debut : t), D = actif ? (+cfg.duree || SPAN) : SPAN;
      return { name, key, actif, start: st, end: st + D }; }).sort((a, b) => a.start - b.start);
}
// Durées typiques selon les mots du point (en minutes). "flex" = activité qui absorbe le temps restant.
const RULES = [
  [/accueil|présence|presence|prise des présences/i, 5],
  [/rangement|nettoyage|ranger/i, 15],
  [/bilan|conclusion|synthèse|retour sur la|récapitul/i, 10],
  [/retour sur|rappel|révision rapide/i, 15],
  [/quiz|questionnaire|kahoot|jeu/i, 15],
  [/vidéo|video|film/i, 20],
  [/démonstration|démo|demo/i, 30],
  [/consigne|explication du travail|présentation du projet/i, 15],
  [/évaluation|examen|test|épreuve/i, 60, true],
  [/théorie|exposé|notion|cours magistral|lecture/i, 40],
  [/exercice|cahier|problème|calcul/i, 30],
  [/atelier|pratique|montage|laboratoire|projet|chantier|soudure|brasage/i, 60, true]
];
function estimate(label) {
  for (const [re, d, flex] of RULES) if (re.test(label)) return { d, flex: !!flex };
  return { d: 30, flex: false };
}
function points(text, ctx) {
  ctx = ctx || (prepOuvert() ? ctxForm() : { D: SPAN, exam: false });
  const CLASS_MIN = classMin(ctx), exam = ctx.exam;
  const PAUSES = []; { let c = 0; blocs(ctx).forEach(([ty, d]) => { if (ty === "cours") c += d; else PAUSES.push(c); }); }
  const items = text.split("\n").map(l => l.trim()).filter(Boolean).map(l => {
    const m = l.match(/^(\d+)\s*(?:min)?\s*\|\s*(.+)$/);
    return m ? { d: +m[1], label: m[2].trim(), fixed: true } : { label: l.replace(/^\|\s*/, ""), fixed: false };
  }).filter(it => !/^pause\b/i.test(it.label) && !/^accueil\b|présences?\b/i.test(it.label));
  // L'accueil et la prise des présences ouvrent toujours la période (fixe, comme les pauses)
  items.unshift({ d: 5, label: "Accueil et présences", fixed: true, locked: true });
  const fixedSum = items.reduce((t, it) => t + (it.fixed ? it.d : 0), 0);
  const free = items.filter(it => !it.fixed);
  free.forEach(it => Object.assign(it, estimate(it.label)));
  let room = Math.max(0, CLASS_MIN - fixedSum);
  const est = free.reduce((t, it) => t + it.d, 0);
  if (free.length) {
    if (est > room) {
      // Trop long : on réduit les estimations proportionnellement
      free.forEach(it => it.d = Math.max(5, Math.round(it.d * room / est / 5) * 5));
    } else {
      // Du temps reste : il va aux activités pratiques, sinon à toutes au prorata
      const flex = free.filter(it => it.flex), big = free.filter(it => it.d >= 30), pool = flex.length ? flex : big.length ? big : free;
      const w = pool.reduce((t, it) => t + it.d, 0); let extra = room - est;
      pool.forEach(it => { const add = Math.round(extra * it.d / w / 5) * 5; it.d += add; });
    }
    // Ajustement final pour tomber pile sur 180 min
    const diff = room - free.reduce((t, it) => t + it.d, 0);
    const tgt = [...free].sort((a, b) => b.d - a.d)[0]; tgt.d = Math.max(5, tgt.d + diff);
  }
  // Bornes en minutes de cours
  let c = 0; const list = []; let cut = false;
  items.forEach(it => { if (c >= CLASS_MIN || it.d <= 0) { cut = true; return; } list.push({ label: it.label, a: c, b: Math.min(CLASS_MIN, c + it.d), fixed: it.fixed }); c += it.d; });
  if (list.length && list[list.length - 1].b < CLASS_MIN) list[list.length - 1].b = CLASS_MIN;
  // Aligner une transition sur la pause quand elle tombe à 10 min ou moins (évite les petits bouts « suite »)
  for (let k = 0; k < list.length - 1; k++) {
    const L = list[k], R = list[k + 1];
    if (L.fixed || R.fixed || exam) continue;
    for (const P of PAUSES) {
      if (L.b !== P && Math.abs(L.b - P) <= 10 && P - L.a >= 5 && R.b - P >= 5) { L.b = P; R.a = P; break; }
    }
  }
  return { list, over: fixedSum > CLASS_MIN, cut };
}
// Points de coupure (traits d'union conditionnels) dans les longs mots, pour garder un gros texte lisible dans la timeline
function cesure(txt) {
  const V = "aeiouyàâäéèêëîïôöùûüœæ", insep = ["ch", "ph", "th", "gn", "qu", "gu"];
  const isV = c => V.includes(c.toLowerCase());
  const lettre = c => /[a-zà-öø-ÿœæ]/i.test(c);
  return txt.split(" ").map(m => {
    if (m.length < 8) return m;
    let out = m[0];
    for (let i = 1; i < m.length; i++) {
      const a = m[i - 1], b = m[i], c = m[i + 1] || "";
      let coupe = false;
      if (i >= 2 && m.length - i >= 3 && lettre(a) && lettre(b)) {
        if (!isV(a) && !isV(b) && !insep.includes((a + b).toLowerCase()) && !/[lr]/i.test(b) && (isV(c) || /[lr]/i.test(c))) coupe = true;
        else if (isV(a) && !isV(b) && isV(c)) coupe = true;
      }
      out += (coupe ? "­" : "") + b;
    }
    return out;
  }).join(" ");
}
function timeline(start, text, ctx) {
  ctx = ctx || ctxDe(start);
  const pts = points(text, ctx).list; const rows = []; let real = start, cls = 0;
  blocs(ctx).forEach(([type, d]) => {
    if (type === "pause") { rows.push({ label: "Pause de " + d + " min", pause: true, start: real, end: real + d }); }
    else if (!pts.length) { rows.push({ label: "Cours", start: real, end: real + d }); }
    else pts.forEach(p => {
      const a = Math.max(p.a, cls), b = Math.min(p.b, cls + d);
      if (b > a) rows.push({ label: p.label + (p.a < cls ? " (suite)" : ""), auto: !p.fixed, start: real + (a - cls), end: real + (b - cls) });
    });
    if (type === "cours") cls += d;
    real += d;
  });
  return rows;
}

/* Couleurs du jour : une ambiance différente chaque jour de la semaine (les élèves remarquent le changement),
   toujours sombre et contrastée pour le projecteur. Lundi = ardoise, mardi = forêt, mercredi = prune, jeudi = pétrole, vendredi = cuivre. */
const AMBIANCES = [
  { nom:"Graphite", bg:"#2A2B30", surface:"#36383F", line:"#50535C", steel:"#6B6F79", rivet:"#80848E", copper:"#EF5A60", water:"#7AA8FF", lc:"#D0303A", lw:"#2563C9" },
  { nom:"Ardoise",  bg:"#262D36", surface:"#323B46", line:"#4A5562", steel:"#66727F", rivet:"#7A8692", copper:"#EF5A60", water:"#5EB0F0", lc:"#C52430", lw:"#1F6FC2" },
  { nom:"Forêt",    bg:"#21302A", surface:"#2C3E37", line:"#44594F", steel:"#5E7569", rivet:"#74897E", copper:"#F2B33D", water:"#5FD3A0", lc:"#B7791F", lw:"#1E8A5A" },
  { nom:"Prune",    bg:"#2C2637", surface:"#3A3247", line:"#544A68", steel:"#6E6384", rivet:"#837899", copper:"#FF8A5C", water:"#B49CFF", lc:"#D1542A", lw:"#6A4FD1" },
  { nom:"Pétrole",  bg:"#1E2F35", surface:"#293E45", line:"#405A62", steel:"#5A747C", rivet:"#708990", copper:"#FFB454", water:"#4FD1E0", lc:"#B9741A", lw:"#0E8A99" },
  { nom:"Cuivre",   bg:"#322920", surface:"#41352A", line:"#5E4C3B", steel:"#7A6655", rivet:"#8E7A69", copper:"#F07A3A", water:"#F2C14E", lc:"#C0561E", lw:"#A8790F" },
  { nom:"Graphite", bg:"#2A2B30", surface:"#36383F", line:"#50535C", steel:"#6B6F79", rivet:"#80848E", copper:"#EF5A60", water:"#7AA8FF", lc:"#D0303A", lw:"#2563C9" }
];
const VARS_AMB = ["--bg", "--surface", "--line", "--steel", "--rivet", "--copper", "--water"];
let jourCouleurs = "";
function ambianceDuJour() { return AMBIANCES[new Date().getDay()]; }
function couleursDuJour() {
  const r = document.documentElement; jourCouleurs = jourAuj();
  VARS_AMB.forEach(v => r.style.removeProperty(v));
  return;   /* Style Métier+ (9 nov.) : plus d'ambiance du jour, couleurs fixes */
  const a = ambianceDuJour();
  const sombre = cfg.theme === "dark" || (cfg.theme !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
  if (sombre) { r.style.setProperty("--bg", a.bg); r.style.setProperty("--surface", a.surface); r.style.setProperty("--line", a.line); r.style.setProperty("--steel", a.steel); r.style.setProperty("--rivet", a.rivet); r.style.setProperty("--copper", a.copper); r.style.setProperty("--water", a.water); }
  else { r.style.setProperty("--copper", a.lc); r.style.setProperty("--water", a.lw); }
}
function applyTheme() {
  const r = document.documentElement;
  setTimeout(couleursDuJour, 0);
  let t = cfg.theme;
  if (t !== "light" && t !== "dark") { const s = localStorage.getItem("accueilClair"); t = s === "1" ? "light" : s === "0" ? "dark" : ""; }
  r.classList.toggle("force-light", t === "light");
  r.classList.toggle("force-dark", t === "dark");
}
addEventListener("storage", e => { if (e.key === "accueilClair") applyTheme(); });

// ---------- Horloges ----------
const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
const SEGP = { a: "8,0 52,0 44,8 16,8", b: "54,2 54,46 46,40 46,10", c: "54,54 54,98 46,90 46,60", d: "8,100 52,100 44,92 16,92", e: "6,54 14,60 14,90 6,98", f: "6,2 14,10 14,40 6,46", g: "8,50 16,45 44,45 52,50 44,55 16,55" };
function ledDigit(x, id) { return `<g transform="translate(${x} 0)" id="${id}">` + Object.entries(SEGP).map(([k, pts]) => `<polygon data-s="${k}" points="${pts}" class="led-off"/>`).join("") + "</g>"; }
let clockKind = "";
function buildClock() {
  const box = $("v-clockalt"), wc = document.querySelector(".w-clock"), k = cfg.clock || "num";
  clockKind = k; box.className = "clock-alt " + k; box.innerHTML = "";
  wc.classList.toggle("alt", ["analog", "mano", "led"].includes(k)); wc.classList.toggle("mini", k === "mini");
  if (k === "analog") {
    let g = `<circle r="96" fill="var(--surface)" stroke="var(--steel)" stroke-width="7"/>`;
    for (let i = 0; i < 60; i++) g += `<line y1="-88" y2="${i % 5 ? -82 : -72}" stroke="${i % 5 ? "var(--muted)" : "var(--ink)"}" stroke-width="${i % 5 ? 1.5 : 4}" transform="rotate(${i * 6})"/>`;
    [[12, 0, -54], [3, 56, 0], [6, 0, 58], [9, -56, 0]].forEach(([n, x, y]) => g += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="22" font-weight="700" fill="var(--ink)" font-family="var(--display)">${n}</text>`);
    g += `<line id="ch" y1="10" y2="-46" stroke="var(--ink)" stroke-width="8" stroke-linecap="round"/><line id="cm" y1="12" y2="-70" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/><line id="cs" y1="16" y2="-78" stroke="var(--copper)" stroke-width="2.5" stroke-linecap="round"/><circle r="6" fill="var(--copper)"/>`;
    box.innerHTML = `<svg viewBox="-100 -100 200 200">${g}</svg><div class="ca-txt" id="ca-txt"></div>`;
  } else if (k === "mano") {
    const ang = v => -135 + v / 12 * 270, pt = (v, r) => { const a = (ang(v) - 90) * Math.PI / 180; return [Math.cos(a) * r, Math.sin(a) * r]; };
    const arc = (v1, v2, r) => { const [x1, y1] = pt(v1, r), [x2, y2] = pt(v2, r); return `M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 ${v2 - v1 > 6 ? 1 : 0} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`; };
    let g = `<circle r="97" fill="var(--steel)"/><circle r="88" fill="var(--surface)" stroke="var(--rivet)" stroke-width="3"/>`;
    g += `<path d="${arc(0, 9, 74)}" stroke="var(--water)" stroke-width="7" fill="none"/><path d="${arc(9, 12, 74)}" stroke="var(--copper)" stroke-width="7" fill="none"/>`;
    for (let v = 0; v <= 12; v += .5) { const [x1, y1] = pt(v, 68), [x2, y2] = pt(v, v % 1 ? 62 : 56); g += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(--ink)" stroke-width="${v % 1 ? 1.5 : 3}"/>`; }
    for (let v = 0; v <= 12; v += 3) { const [x, y] = pt(v, 44); g += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-size="16" font-weight="700" fill="var(--ink)" font-family="var(--display)">${v}</text>`; }
    g += `<rect x="-30" y="34" width="60" height="24" rx="4" fill="var(--bg)" stroke="var(--rivet)"/><text id="mano-lcd" x="0" y="47" text-anchor="middle" dominant-baseline="central" font-size="16" font-weight="700" fill="var(--water)" font-family="var(--display)"></text><text x="0" y="72" text-anchor="middle" font-size="9" letter-spacing="2" fill="var(--muted)" font-family="var(--display)">HEURE</text>`;
    g += `<g id="mn"><path d="M-4 6 L0 -76 L4 6 Z" fill="var(--copper)"/></g><circle r="9" fill="var(--rivet)" stroke="var(--steel)" stroke-width="3"/>`;
    box.innerHTML = `<svg viewBox="-100 -100 200 200">${g}</svg><div class="ca-txt" id="ca-txt"></div>`;
  } else if (k === "led") {
    const g = `<rect x="-14" y="-14" width="398" height="128" rx="10" fill="var(--bg)" stroke="var(--steel)" stroke-width="4"/>` + ledDigit(0, "d0") + ledDigit(66, "d1") + `<circle cx="146" cy="30" r="6" class="led-on" id="dc1"/><circle cx="146" cy="70" r="6" class="led-on" id="dc2"/>` + ledDigit(170, "d2") + ledDigit(236, "d3") + `<g transform="translate(306 46) scale(.54)">` + ledDigit(0, "d4") + ledDigit(66, "d5") + `</g>`;
    box.innerHTML = `<svg viewBox="-18 -18 406 136">${g}</svg>`;
  }
}
function updateClock(now) {
  if (clockKind !== (cfg.clock || "num")) buildClock();
  const h = now.getHours(), m = now.getMinutes(), sec = now.getSeconds();
  if (clockKind === "analog") {
    $("ch").setAttribute("transform", `rotate(${(h % 12) * 30 + m / 2})`); $("cm").setAttribute("transform", `rotate(${m * 6 + sec / 10})`); $("cs").setAttribute("transform", `rotate(${sec * 6})`);
    $("ca-txt").innerHTML = `${pad(h)} h ${pad(m)}`;
  } else if (clockKind === "mano") {
    const v = (h % 12) + m / 60; $("mn").setAttribute("transform", `rotate(${-135 + v / 12 * 270})`);
    $("mano-lcd").textContent = `${pad(h)}:${pad(m)}`; $("ca-txt").innerHTML = `${pad(h)} h ${pad(m)}`;
  } else if (clockKind === "led") {
    const ds = pad(h) + pad(m) + pad(sec);
    [...ds].forEach((c, i) => { const g = $("d" + i); if (!g) return; const on = SEG[c]; g.querySelectorAll("polygon").forEach(pg => pg.setAttribute("class", on.includes(pg.dataset.s) ? "led-on" : "led-off")); });
    ["dc1", "dc2"].forEach(id => $(id).setAttribute("class", sec % 2 ? "led-off" : "led-on"));
  }
}

function renderStatic() {
  if (typeof buildClock === "function") buildClock();
  applyTheme();
  if (typeof applyBg === "function") applyBg();
  $("v-title").textContent = cfg.title;
  const progNow = (compInfo(cfg.comp) || [])[3] || cfg.prog || "5333"; const lg = $("v-logo"); if (!lg.dataset.p5333) lg.dataset.p5333 = lg.getAttribute("src"); lg.src = progNow === "5211" ? LOGO_EGI : lg.dataset.p5333; lg.alt = progNow === "5211" ? "Logo Entretien général d'immeubles" : "Logo Plomberie et chauffage, Pavillon de l'Avenir";
  $("v-group").textContent = (cfg.group && !Object.values(PROGS).includes(cfg.group)) ? cfg.group : (PROGS[(compInfo(cfg.comp) || [])[3] || cfg.prog] || PROGS["5333"]);
  $("v-msg").textContent = cfg.msg; $("v-msg").hidden = !cfg.msg.trim();
  $("v-module").innerHTML = "";
  const mt = moduleText(); if (mt.trim()) { const b = document.createElement("b"); b.textContent = "Au programme : "; $("v-module").append(b, mt); $("v-module").title = moduleOfficiel(cfg.comp, cfg.module); }
  if (typeof majMatiere === "function") majMatiere();
  $("v-goals").innerHTML = "";
  cfg.goals.split("\n").filter(g => g.trim()).forEach(g => { const li = document.createElement("li"); li.textContent = g; $("v-goals").append(li); });
  $("v-ppe").innerHTML = cfg.ppe.filter(k => PPE[k]).map(k => `<figure>${PPE[k].svg}<figcaption>${PPE[k].name}</figcaption></figure>`).join("");
  $("v-word").textContent = cfg.word; $("v-def").textContent = cfg.def;
  $("v-q").textContent = cfg.q; $("v-a").textContent = cfg.a;
  $("v-a").hidden = true; $("b-reveal").textContent = "Révéler la réponse";
  lastStepsKey = "";
  if (typeof applyWidgets === "function") applyWidgets();
}

let lastStepsKey = "";
function tick() {
  if (jourCouleurs && jourCouleurs !== jourAuj()) couleursDuJour();
  const now = new Date();
  const h = now.getHours();
  $("v-h").textContent = pad(h); $("v-m").textContent = pad(now.getMinutes()); $("v-s").textContent = pad(now.getSeconds());
  updateClock(now);
  $("v-greet").textContent = h < 12 ? "Bonjour à tous!" : h < 18 ? "Bon après-midi!" : "Bonsoir!";
  const d = now.toLocaleDateString("fr-CA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  $("v-date").textContent = d.charAt(0).toUpperCase() + d.slice(1);

  updateQuote(now);
  const nowMin = h * 60 + now.getMinutes() + now.getSeconds() / 60;
  const ps = periods();
  const cur = ps.find(p => nowMin >= p.start && nowMin < p.end);
  const next = ps.find(p => p.start > nowMin);
  const ref = cur || next || ps[ps.length - 1];

  if (!ref) {
    $("v-pname").textContent = "Aucune période"; $("v-phours").textContent = "";
    $("v-status").textContent = "Ajoute ton horaire dans les réglages."; $("v-water").style.width = "0%";
  } else {
    $("v-pname").textContent = ref.name; $("v-exam").hidden = !ctxDe(ref.start).exam;
    $("v-phours").textContent = fmt(ref.start) + " à " + fmt(ref.end);
    if (cur) {
      const pct = (nowMin - cur.start) / (cur.end - cur.start) * 100;
      $("v-water").style.width = pct.toFixed(2) + "%";
      $("v-status").textContent = (ctxDe(cur.start).exam ? "Examen en cours · fin dans " : (cur.end - cur.start < SPAN ? "Fin du cours dans " : "Fin de la période dans ")) + dur((cur.end - nowMin) * 60);
    } else if (next) {
      $("v-water").style.width = "0%";
      $("v-status").textContent = "Le cours commence dans " + dur((next.start - nowMin) * 60);
    } else {
      $("v-water").style.width = "100%";
      $("v-status").textContent = "Les périodes sont terminées. Bonne fin de journée!";
    }
  }

  // Déroulement
  const list = $("v-steps");
  const rows = ref ? timeline(ref.start, cfg.steps) : [];
  let nowIdx = -1;
  rows.forEach((r, i) => { if (cur && nowMin >= r.start && nowMin < r.end) nowIdx = i; });
  const allDone = ref && !cur && !next;
  const key = rows.map(r => r.start + r.label).join() + "|" + JSON.stringify(cfg.local || "") + JSON.stringify(window.menageReglages ? (m => [m.mot, m.min])(window.menageReglages()) : 0) + "|" + nowIdx + "|" + allDone + "|" + (cur ? 1 : 0);
  const ZM = zoneMenage(rows), zmK = ZM.map(z => z.i + ":" + z.start).join();
  const struct = rows.map(r => r.start + r.label).join() + "|" + (cur ? 1 : 0) + "|" + zmK, tlE = $("v-tl");
  if (lastStepsKey && key !== lastStepsKey && struct === window.__tlStruct && tlE.children.length === rows.length && list.children.length === rows.length) {
    /* 10 nov. (« léger reloading » au changement de bloc) : même déroulement, seul le bloc en cours change → classes mises à jour sur place, sans tout redessiner */
    lastStepsKey = key;
    rows.forEach((r, i) => { const done = !!(allDone || (cur && nowMin >= r.end)), sg = tlE.children[i], li = list.children[i];
      sg.classList.toggle("done", done); sg.classList.toggle("now", i === nowIdx);
      li.classList.toggle("done", done); li.classList.toggle("now", i === nowIdx); li.dataset.done = done ? 1 : 0; });
    let sp = $("v-left"); if (!sp) { sp = document.createElement("span"); sp.className = "left"; sp.id = "v-left"; }
    const liN = list.children[nowIdx]; if (liN) liN.querySelector(".txt").append(sp); else sp.remove();
  }
  if (key !== lastStepsKey) {
    lastStepsKey = key; window.__tlStruct = struct;
    list.innerHTML = "";
    const tl = $("v-tl"); tl.innerHTML = "";
    rows.forEach((r, i) => {
      const d = document.createElement("div"), len = r.end - r.start, done = allDone || (cur && nowMin >= r.end);
      d.className = "seg" + (r.pause ? " p" : "") + (done ? " done" : "") + (i === nowIdx ? " now" : "");
      d.style.flex = len + " 1 0px";
      d.innerHTML = '<span class="seg-l"></span><span class="seg-t"></span>';
      d.firstChild.textContent = r.pause ? "" : cesure(r.label.replace(/ \(suite\)$/, "").split(/\s[:—–-]\s/)[0]);
      d.lastChild.textContent = r.pause ? "" : fmt(r.start);
      d.title = fmt(r.start) + " · " + r.label;
      const lks2 = r.pause ? [] : liensDe(r.label);
      if (lks2.length){ const ic = document.createElement("span"); ic.className = "seg-lk"; ic.innerHTML = lks2.map(c => ico(c.type)).join(""); d.append(ic); d.classList.add("a-lien"); d.title += " · clique pour ouvrir : " + lks2.map(nomLien).join(" ou "); d.onclick = e => clicSimple(() => ouvrirLiens(lks2, e)); }
      if (!r.pause){ d.title += " · double-clic : lier une action"; d.ondblclick = e => { e.preventDefault(); lierActivite(r.label); }; }
      const zm = ZM.find(z => z.i === i);
      if (zm){ const b = document.createElement("span"); b.className = "seg-mn"; b.style.left = (100 * (zm.start - r.start) / len).toFixed(1) + "%"; b.textContent = "Ménage"; d.append(b); d.title += " · ménage à " + fmt(zm.start); }
      tl.append(d);
    });
    rows.forEach((r, i) => {
      const li = document.createElement("li"); li.className = "step";
      const done = allDone || (cur && nowMin >= r.end);
      li.dataset.i = i; li.dataset.done = done ? 1 : 0;
      if (done) li.classList.add("done");
      if (i === nowIdx) li.classList.add("now");
      if (r.pause) li.classList.add("pause");
      li.innerHTML = `<time>${fmt(r.start)}</time><span class="dot"></span><span class="txt"></span>`;
      li.querySelector(".txt").textContent = r.label;
      const lks = r.pause ? [] : liensDe(r.label);
      if (lks.length){ lks.forEach(c => { const ic = document.createElement("span"); ic.className = "lk-i"; ic.innerHTML = ico(c.type); ic.title = "Ouvrir : " + nomLien(c);
          ic.onclick = e => { e.stopPropagation(); ouvrirLien(c); }; li.querySelector(".txt").append(ic); });
        li.classList.add("a-lien"); li.title = "Clique pour ouvrir : " + lks.map(nomLien).join(" ou "); li.onclick = e => clicSimple(() => ouvrirLiens(lks, e)); }
      if (!r.pause){ li.title = (li.title ? li.title + " · " : "") + "Double-clic : lier une action"; li.ondblclick = e => { e.preventDefault(); lierActivite(r.label); }; }
      if (i === nowIdx) { const sp = document.createElement("span"); sp.className = "left"; sp.id = "v-left"; li.querySelector(".txt").append(sp); }
      list.append(li);
    });
    if (typeof fit === "function") fitSoon();
  }
  if (cur) {
    const inStep = rows[nowIdx];
    if (inStep && inStep.pause) {
      $("v-status").textContent = "C'est la pause! Retour en classe dans " + dur((inStep.end - nowMin) * 60);
    } else {
      const np = rows.find(r => r.start > nowMin && r.pause);
      $("v-status").textContent = np ? "Prochaine pause dans " + dur((np.start - nowMin) * 60) : (cur.end - cur.start < SPAN ? "Fin du cours dans " : "Fin de la période dans ") + dur((cur.end - nowMin) * 60);
    }
  }
  {
    let nowT = "", nowSub = "", nextT = "", nextSub = "";
    if (cur && rows[nowIdx]) {
      const a = rows[nowIdx], b = rows[nowIdx + 1];
      nowT = a.pause ? "Pause" : a.label.replace(/ \(suite\)$/, "");
      nowSub = "jusqu'à " + fmt(a.end);
      if (b) { nextT = b.pause ? "Pause" : b.label.replace(/ \(suite\)$/, ""); nextSub = "à " + fmt(b.start); }
      else { nextT = cur.end - cur.start < SPAN ? "Fin du cours" : "Fin de la période"; nextSub = "à " + fmt(cur.end); }
    } else if (next && rows.length) {
      nowT = "Le cours commence bientôt"; nowSub = "à " + fmt(next.start) + " · dans " + dur((next.start - nowMin) * 60);
      const firstReal = rows.find(r => !/^Accueil/.test(r.label) && !r.pause) || rows[0];
      nextT = firstReal.label; nextSub = "à " + fmt(firstReal.start);
    } else { nowT = "Bonne fin de journée!";
      /* 9 nov. : après les cours, « Ensuite » montre le prochain cours préparé (ou invite à le préparer) */
      try { const d = new Date(), j = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
        const ici = j + "|" + (d.getHours() < 12 ? "am" : "pm"), k = Object.keys(cfg.plans || {}).filter(x => /\|/.test(x) && x > ici).sort()[0];
        if (k && typeof titreCours === "function") { const [jj, per] = k.split("|"), dd = new Date(jj + "T12:00:00"), ecart = Math.round((dd - new Date(j + "T12:00:00")) / 864e5);
          nextT = titreCours(cfg.plans[k]) || "Cours préparé";
          nextSub = (ecart === 0 ? "cet" : ecart === 1 ? "demain" : dd.toLocaleDateString("fr-CA", {weekday: "long"})) + (per === "am" ? (ecart === 0 ? " avant-midi" : " matin") : " après-midi");
          if (ecart === 0) nextSub = "cet après-midi"; }
        else { nextT = "Prochain cours pas encore préparé"; nextSub = "Touche « Préparer le cours » en haut"; } } catch(x) {} }
    if ($("v-now").textContent !== nowT || $("v-next").textContent !== nextT) {
      $("v-now").textContent = nowT; $("v-next").textContent = nextT; $("v-nextblk").hidden = !nextT;
      if (typeof fitSoon === "function") fitSoon();
    }
    $("v-nowt").textContent = nowSub; $("v-nextt").textContent = nextSub;
    /* bouton « Ouvrir » : contenu lié à l'activité en cours (et à la suivante) */
    const rA = cur && rows[nowIdx] && !rows[nowIdx].pause ? rows[nowIdx] : null;
    const rB = cur ? rows[nowIdx + 1] : (next && rows.length ? (rows.find(r => !/^Accueil/.test(r.label) && !r.pause) || rows[0]) : null);
    majGo($("v-go"), rA ? liensDe(rA.label) : []); majGo($("v-go2"), rB && !rB.pause ? liensDe(rB.label) : []);
  }
  {
    const mk = $("v-tlmark");
    if (ref) {
      // Les cases n'ont pas une largeur strictement proportionnelle au temps (largeur minimale, espaces entre les cases) :
      // on place donc le curseur dans la case de l'étape en cours, à la fraction de temps écoulée.
      const seg = cur && nowIdx >= 0 ? $("v-tl").children[nowIdx] : null;
      if (seg && seg.offsetWidth) {
        const r = rows[nowIdx], f = Math.min(1, Math.max(0, (nowMin - r.start) / (r.end - r.start)));
        mk.style.left = (seg.offsetLeft + f * seg.offsetWidth).toFixed(1) + "px";
        seg.style.setProperty("--pg", (f * 100).toFixed(1) + "%"); mk.dataset.h = fmt(nowMin);
      } else {
        const p = cur ? (nowMin - ref.start) / (ref.end - ref.start) : (next ? 0 : 1); mk.style.left = (p * 100).toFixed(3) + "%";
      }
      mk.hidden = !cur;
    }
  }
  {
    let L = $("lueur");
    if (!L) { L = document.createElement("div"); L.id = "lueur"; L.innerHTML = '<i class="lb"></i><i class="lc"></i>'; document.body.append(L); }
    const p = cur && ref ? Math.min(1, Math.max(0, (nowMin - ref.start) / (ref.end - ref.start))) : 0;
    L.style.height = (14 + p * 38).toFixed(1) + "%";
    const r = cur && nowIdx >= 0 ? rows[nowIdx] : null;
    L.classList.toggle("fin", !!r && (r.pause || r.end - nowMin <= 5));
  }
  if (nowIdx >= 0 && $("v-left")) $("v-left").textContent = "encore " + dur((rows[nowIdx].end - nowMin) * 60);
}

// Citations : une nouvelle à chaque cours de 3 heures (matin, après-midi)
const QUOTES = [["C'est en forgeant qu'on devient forgeron.", "Proverbe"], ["Ce qu'il faut avoir appris pour le faire, c'est en le faisant que nous l'apprenons.", "Aristote"], ["Vingt fois sur le métier remettez votre ouvrage.", "Nicolas Boileau"], ["Chaque expert a d'abord été un débutant.", "Proverbe"], ["Petit à petit, l'oiseau fait son nid.", "Proverbe"], ["Un voyage de mille lieues commence toujours par un premier pas.", "Lao Tseu"], ["Patience et longueur de temps font plus que force ni que rage.", "Jean de La Fontaine"], ["Il n'est jamais trop tard pour apprendre un métier.", "Formation professionnelle"], ["Tu n'es pas ici par hasard : tu es ici pour bâtir ton avenir.", "Formation professionnelle"], ["Un métier dans les mains, c'est une liberté pour la vie.", "Formation professionnelle"], ["Chaque heure à l'atelier te rapproche de ton diplôme.", "Formation professionnelle"], ["Tes mains apprennent ce que ta tête comprend. Donne-leur de la pratique.", "Formation professionnelle"], ["Le métier entre par les mains, mais il commence par la volonté.", "Formation professionnelle"], ["Aujourd'hui, tu apprends un geste. Demain, il fera partie de toi.", "Formation professionnelle"], ["Ce n'est pas grave de se tromper : l'atelier est fait pour ça.", "Formation professionnelle"], ["L'erreur d'aujourd'hui, c'est le savoir-faire de demain.", "Formation professionnelle"], ["Tu es meilleur qu'hier. C'est exactement ce qu'on te demande.", "Formation professionnelle"], ["Un petit progrès chaque jour finit par faire un grand professionnel.", "Formation professionnelle"], ["Ton diplôme se construit un cours à la fois. Celui d'aujourd'hui compte.", "Formation professionnelle"], ["Le Québec a besoin de gens de métier. Il a besoin de toi.", "Formation professionnelle"], ["Choisir un métier, c'est choisir de se rendre utile tous les jours.", "Formation professionnelle"], ["Les bâtisseurs de demain sont assis dans cette classe.", "Formation professionnelle"], ["Être fier de son travail, ça s'apprend ici.", "Formation professionnelle"], ["On ne naît pas habile, on le devient en pratiquant.", "Formation professionnelle"], ["La confiance vient en faisant. Lance-toi.", "Formation professionnelle"], ["Ce que tu apprends ici, personne ne pourra te l'enlever.", "Formation professionnelle"], ["Ton avenir se fabrique avec tes mains et ta persévérance.", "Formation professionnelle"], ["Les meilleurs ouvriers ont commencé exactement là où tu es.", "Formation professionnelle"], ["Pose tes questions : c'est le signe de quelqu'un qui veut réussir.", "Formation professionnelle"], ["Le talent, c'est bien. La persévérance, c'est mieux.", "Formation professionnelle"], ["Tu n'as pas besoin d'être parfait pour commencer, mais tu dois commencer pour devenir bon.", "Formation professionnelle"], ["Chaque compétence réussie est une marche de plus vers ton métier.", "Formation professionnelle"], ["Ici, on apprend en faisant, et on fait pour de vrai.", "Formation professionnelle"], ["Retourner aux études demande du courage. Tu l'as déjà prouvé.", "Formation professionnelle"], ["Le plus difficile, c'était de commencer. C'est fait!", "Formation professionnelle"], ["Ta place sur le chantier, tu la prépares aujourd'hui.", "Formation professionnelle"], ["Un bon professionnel n'a jamais fini d'apprendre.", "Formation professionnelle"], ["La rigueur que tu développes ici, c'est ce que les employeurs cherchent.", "Formation professionnelle"], ["Reste curieux : chaque question ouvre une porte.", "Formation professionnelle"], ["Tu es en train de devenir quelqu'un sur qui on peut compter.", "Formation professionnelle"], ["Un métier, c'est une fierté qu'on porte toute sa vie.", "Formation professionnelle"], ["Les employeurs t'attendent. Prépare-toi à leur montrer ce que tu vaux.", "Formation professionnelle"], ["La réussite, c'est l'effort de chaque jour qui finit par se voir.", "Formation professionnelle"], ["Chaque fois que tu recommences un geste, tu deviens plus solide.", "Formation professionnelle"], ["Ce qui te semble difficile aujourd'hui te paraîtra facile dans un mois.", "Formation professionnelle"], ["Tu as le droit d'avoir de la difficulté. Tu n'as pas le droit d'abandonner.", "Formation professionnelle"], ["Le travail bien fait est la plus belle des signatures.", "Formation professionnelle"], ["Ici, chacun avance à son rythme, mais tout le monde avance.", "Formation professionnelle"], ["Aide ton voisin d'atelier : on apprend deux fois en expliquant.", "Formation professionnelle"], ["Une équipe qui s'entraide finit toujours plus fort.", "Formation professionnelle"], ["Ton expérience de vie est une force dans ton apprentissage.", "Formation professionnelle"], ["La pratique transforme le doute en confiance.", "Formation professionnelle"], ["Garde en tête pourquoi tu as commencé.", "Formation professionnelle"], ["Le diplôme se gagne avec de la patience, des efforts et un peu de fierté.", "Formation professionnelle"], ["Tu bâtis plus qu'un réseau ou un bâtiment : tu bâtis ta carrière.", "Formation professionnelle"], ["Les gens de métier font fonctionner le monde. Bienvenue dans le club.", "Formation professionnelle"], ["Chaque matin à l'atelier est une occasion de devenir meilleur.", "Formation professionnelle"], ["Tu n'apprends pas seulement un métier, tu apprends à te faire confiance.", "Formation professionnelle"], ["Le savoir-faire s'apprend, le savoir-être se cultive. Les deux te mèneront loin.", "Formation professionnelle"], ["Un geste sûr, ça se gagne une répétition à la fois.", "Formation professionnelle"], ["Rien ne remplace l'expérience. Tu es en train de l'acquérir.", "Formation professionnelle"], ["Ton futur employeur cherche quelqu'un de fiable. Commence aujourd'hui à l'être.", "Formation professionnelle"], ["Avoir un métier, c'est avoir des options.", "Formation professionnelle"], ["La fierté du travail bien fait, c'est le meilleur salaire du jour.", "Formation professionnelle"], ["Chaque petite victoire compte. Célèbre-la.", "Formation professionnelle"], ["Tu progresses même quand tu ne le vois pas encore.", "Formation professionnelle"], ["Être présent, c'est déjà la moitié de la réussite.", "Formation professionnelle"], ["On ne te demande pas de tout savoir. On te demande de vouloir apprendre.", "Formation professionnelle"], ["Tes efforts d'aujourd'hui sont tes compétences de demain.", "Formation professionnelle"], ["La meilleure façon d'apprendre un métier, c'est de s'y mettre pour vrai.", "Formation professionnelle"], ["Un apprenti motivé vaut mieux qu'un expert découragé.", "Formation professionnelle"], ["Tu as choisi un métier d'avenir. Fais-en ton métier de cœur.", "Formation professionnelle"], ["Plus tu pratiques, plus tu as de la chance.", "Formation professionnelle"], ["Le courage, c'est de revenir demain même si aujourd'hui était difficile.", "Formation professionnelle"], ["Ce que tu fais avec soin servira des gens pendant des années.", "Formation professionnelle"], ["Chaque jour d'atelier ajoute une ligne à ton CV.", "Formation professionnelle"], ["Les grandes carrières commencent souvent dans un atelier comme celui-ci.", "Formation professionnelle"], ["La patience est un outil. Garde-la toujours dans ton coffre.", "Formation professionnelle"], ["Ne compare pas ton début avec la fin de quelqu'un d'autre.", "Formation professionnelle"], ["Ton enseignant croit en toi. Crois en toi aussi.", "Formation professionnelle"], ["Ici, les erreurs sont permises. Les abandons, beaucoup moins.", "Formation professionnelle"], ["La sécurité et la qualité, c'est ça, un vrai professionnel.", "Formation professionnelle"], ["Fais-le bien, et refais-le jusqu'à ce que ce soit facile.", "Formation professionnelle"], ["Chaque compétence apprise est un outil de plus dans ta vie.", "Formation professionnelle"], ["Le marché du travail cherche des gens comme toi : prêts à apprendre et à travailler.", "Formation professionnelle"], ["Personne ne réussit seul. Demande de l'aide, offre de l'aide.", "Formation professionnelle"], ["Ce que tu construis aujourd'hui, c'est la personne que tu seras demain.", "Formation professionnelle"], ["Tu es exactement à la bonne place pour devenir excellent.", "Formation professionnelle"], ["Ton métier va te permettre de gagner ta vie en étant fier de ce que tu fais.", "Formation professionnelle"], ["Garde la tête haute : apprendre un métier, c'est un choix intelligent.", "Formation professionnelle"], ["Une journée réussie, c'est une journée où tu as appris au moins une chose.", "Formation professionnelle"], ["Les bonnes habitudes prises ici te suivront toute ta carrière.", "Formation professionnelle"], ["Tu ne fais pas que suivre un cours, tu prépares ton avenir.", "Formation professionnelle"], ["Le plus beau compliment d'un métier : « C'est du beau travail. »", "Formation professionnelle"], ["Avance, même lentement : tu laisses derrière toi ceux qui ne commencent pas.", "Formation professionnelle"], ["La différence entre un bon et un excellent ouvrier, c'est le souci du détail.", "Formation professionnelle"], ["Ton diplôme d'études professionnelles ouvre de vraies portes. Continue!", "Formation professionnelle"], ["Aujourd'hui est une belle journée pour apprendre quelque chose de nouveau.", "Formation professionnelle"]];
// Ordre mélangé une fois pour toutes (toujours le même), pour alterner auteurs et dictons
let lastQuoteSlot = -1;
function updateQuote(now) {
  const day = Math.floor((new Date(now.getFullYear(), now.getMonth(), now.getDate()) - new Date(2026, 0, 1)) / 864e5);
  const slot = day * 2 + (now.getHours() * 60 + now.getMinutes() >= toMin(cfg.amStart) + SPAN ? 1 : 0);
  if (slot === lastQuoteSlot) return;
  lastQuoteSlot = slot;
  newQuote();
}
// Citation au hasard à chaque ouverture et à chaque nouvelle période, sans répéter les 40 dernières
function newQuote() {
  let recent = [];
  try { recent = JSON.parse(localStorage.getItem("accueil-citations-vues") || "[]"); } catch (e) {}
  const choix = QUOTES.map((_, i) => i).filter(i => !recent.includes(i));
  const pool = choix.length ? choix : QUOTES.map((_, i) => i);
  const i = pool[Math.floor(Math.random() * pool.length)];
  recent = [...recent.filter(x => x !== i), i].slice(-40);
  try { localStorage.setItem("accueil-citations-vues", JSON.stringify(recent)); } catch (e) {}
  const [text, author] = QUOTES[i];
  $("v-quote").textContent = text; $("v-author").textContent = author;
  if (typeof fitSoon === "function") fitSoon();
}
// Un clic sur la citation en affiche une autre
document.querySelector(".quote").addEventListener("click", newQuote);

// Arrière-plans
let bgAnim = 0;
let reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;   /* mis à jour par le fond vivant selon cfg.anim */

/* Anciens fonds d'écran animés (scènes SVG, canevas béton, bois, soudure, flammes) retirés le 8 nov. : ils étaient cachés depuis le 4 nov.
   (style « Sobre ») mais tournaient encore en arrière-plan et ralentissaient le TNI. Historique git si besoin. */
function applyBg() { cancelAnimationFrame(bgAnim); bgAnim = 0; document.documentElement.dataset.bg = bgKind(); $("bgfx").innerHTML = ""; }
function closeCompPick() { $("comppick").hidden = true; $("b-comp").setAttribute("aria-expanded", "false"); }
$("b-comp").onclick = e => { e.stopPropagation(); openPrep(); };
document.addEventListener("click", e => { if (!$("comppick").hidden && !e.target.closest("#comppick, #b-comp")) closeCompPick(); });

// Carte tournante : ÉPI, mot technique et question, un à la fois
let rotIdx = 0;
const rotCards = () => [...document.querySelectorAll(".rot > [data-w]")].filter(el => !el.classList.contains("w-off"));
function showRot(i) {
  const v = rotCards(), dots = $("rot-dots"); dots.innerHTML = "";
  if (!v.length) return;
  rotIdx = ((i % v.length) + v.length) % v.length;
  document.querySelectorAll(".rot > [data-w]").forEach(el => el.classList.toggle("rot-on", el === v[rotIdx]));
  if (v.length > 1) v.forEach((el, k) => { const d = document.createElement("button"); d.type = "button"; d.className = k === rotIdx ? "on" : ""; d.onclick = () => showRot(k); dots.append(d); });
}
setInterval(() => {
  if (document.body.classList.contains("editing")) return;
  const cur = rotCards()[rotIdx];
  if (cur && cur.dataset.w === "question" && !$("v-a").hidden) return; // réponse affichée : on attend
  showRot(rotIdx + 1);
}, 20000);

// Widgets à afficher ou masquer
const WIDGETS = { horloge: "Horloge et date", maintenant: "Maintenant et ensuite", citation: "Citation inspirante", message: "Message du jour", periode: "Période en cours", deroulement: "Déroulement", objectifs: "Objectifs", epi: "ÉPI", mot: "Mot technique", question: "Question de démarrage" };
const app = document.querySelector(".app");
document.querySelectorAll("[data-w]").forEach(el => {
  const b = document.createElement("button"); b.type = "button"; b.className = "w-del"; b.textContent = "−";
  b.setAttribute("aria-label", "Masquer " + WIDGETS[el.dataset.w]);
  b.onclick = () => { cfg.hidden = [...new Set([...cfg.hidden, el.dataset.w])]; save(); applyWidgets(); };
  el.append(b);
});
function applyWidgets() {
  const off = new Set(cfg.hidden || []);
  document.querySelectorAll("[data-w]").forEach(el => el.classList.toggle("w-off", off.has(el.dataset.w)));
  const any = ws => ws.some(w => !off.has(w) && !(w === "message" && !cfg.msg.trim()));
  app.classList.toggle("no-hero", !any(["horloge", "citation", "message"]));
  app.classList.toggle("no-course", !any(["periode"]));
  app.classList.toggle("no-side", !any(["maintenant", "deroulement", "epi", "mot", "question"]));
  app.classList.add("no-cards");
  showRot(rotIdx);
  const list = $("dock-list"); list.innerHTML = "";
  Object.keys(WIDGETS).filter(w => off.has(w)).forEach(w => {
    const c = document.createElement("button"); c.type = "button"; c.className = "chip"; c.textContent = WIDGETS[w];
    c.onclick = () => { cfg.hidden = cfg.hidden.filter(x => x !== w); save(); applyWidgets(); };
    list.append(c);
  });
  if (!list.children.length) list.innerHTML = '<span class="dock-empty">Tous les widgets sont affichés.</span>';
  fit();
}
function setEditing(on) { document.body.classList.toggle("editing", on); $("dock").hidden = !on; $("b-wid").textContent = on ? "Terminer le choix des blocs" : "Choisir les blocs affichés"; }
$("b-wid").onclick = () => setEditing(!document.body.classList.contains("editing"));
$("b-done").onclick = () => setEditing(false);

// Ajuste la taille de tout le tableau pour remplir l'écran sans défilement
// Montre moins d'étapes passées ou lointaines quand la place manque (niveau 0 = tout)
function compactSteps(level) {
  const lis = [...document.querySelectorAll("#v-steps .step")];
  document.querySelectorAll("#v-steps .more").forEach(m => m.remove());
  lis.forEach(li => li.classList.remove("far"));
  if (!level || !lis.length) return;
  let first = lis.findIndex(li => li.dataset.done !== "1"); if (first < 0) first = lis.length - 1;
  const keepBefore = level >= 2 ? 0 : 1, keepAfter = [99, 99, 4, 2][Math.min(level, 3)];
  let hidAfter = 0;
  lis.forEach((li, k) => {
    if (k < first - keepBefore) li.classList.add("far");
    if (k > first + keepAfter) { li.classList.add("far"); hidAfter++; }
  });
  if (hidAfter) { const m = document.createElement("li"); m.className = "more"; m.textContent = "+ " + hidAfter + " autre" + (hidAfter > 1 ? "s" : "") + " étape" + (hidAfter > 1 ? "s" : ""); $("v-steps").append(m); }
}
function fitSegLabels() {
  let pire = 1;
  document.querySelectorAll("#v-tl .seg-l").forEach(el => {
    el.style.removeProperty("--shrink");
    for (let k = 1; k <= 8 && (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 4); k++) el.style.setProperty("--shrink", (1 - k * 0.05).toFixed(2));
    pire = Math.min(pire, parseFloat(el.style.getPropertyValue("--shrink")) || 1);
  });
  /* même taille de texte pour toutes les cases (plus lisible de loin) */
  if (pire < 1 && !document.querySelector("#v-tl .seg.p")?.closest(".tl")?.dataset.libre) document.querySelectorAll("#v-tl .seg-l").forEach(el => el.style.setProperty("--shrink", pire.toFixed(2)));
}
// Remplit l'écran : agrandit au maximum sans qu'aucune zone déborde
function overflows() {
  const els = [app, ...app.querySelectorAll(".hero, .side, .side > .panel, .rot > .panel, .course, header, .tl-wrap")];   /* .tl-wrap : la frise défile (30 oct.), sa largeur doit quand même compter */
  return els.some(el => el.offsetParent !== null && (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1));
}
function fit() {
  const r = document.documentElement;
  if (innerWidth <= 900 || app.clientHeight < 200) { r.style.setProperty("--fit", 1); compactSteps(0); return; }
  const manual = +cfg.scale > 0;
  const fits = f => { r.style.setProperty("--fit", f); return !overflows(); };
  const best = (lo, hi) => { if (!fits(lo)) return null; for (let i = 0; i < 9; i++) { const m = (lo + hi) / 2; if (fits(m)) lo = m; else hi = m; } return lo; };
  let level = 0, f;
  if (manual) {
    f = +cfg.scale;
    for (level = 0; level <= 3; level++) { compactSteps(level); if (fits(f)) break; }
    level = Math.min(level, 3);
  } else {
    const FLOOR = 0.85, res = [];
    for (let l = 0; l <= 3; l++) { compactSteps(l); res.push(best(0.6, 1.8) || 0); }
    // Si rien ne semble entrer (mesure impossible), on garde une taille lisible plutôt que minuscule
    if (Math.max(...res) === 0) { compactSteps(3); r.style.setProperty("--fit", FLOOR); return; }
    const target = Math.min(FLOOR, Math.max(...res) - 0.01);
    level = res.findIndex(x => x >= target); f = res[level] * 0.985;
  }
  compactSteps(level); r.style.setProperty("--fit", f.toFixed(4)); fitSegLabels();
  // Réafficher les étapes cachées une à une tant qu'il reste de la place (les plus proches d'abord)
  if (level > 0) {
    const lis = [...document.querySelectorAll("#v-steps .step")];
    let cur = lis.findIndex(li => li.dataset.done !== "1"); if (cur < 0) cur = lis.length - 1;
    const order = lis.map((li, k) => [li, k]).filter(([li]) => li.classList.contains("far"))
      .sort((x, y) => Math.abs(x[1] - cur) + (x[1] < cur ? 0.5 : 0) - Math.abs(y[1] - cur) - (y[1] < cur ? 0.5 : 0));
    const more = document.querySelector("#v-steps .more"); if (more) more.hidden = true;
    for (const [li] of order) { li.classList.remove("far"); if (overflows()) { li.classList.add("far"); break; } }
    const left = lis.filter((li, k) => k > cur && li.classList.contains("far")).length;
    if (more) { more.hidden = !left; more.textContent = "+ " + left + " autre" + (left > 1 ? "s" : "") + " étape" + (left > 1 ? "s" : ""); }
  }
}
let fitTimer;
function fitSoon() { clearTimeout(fitTimer); fitTimer = setTimeout(fit, 120); }
addEventListener("resize", fitSoon);
document.addEventListener("fullscreenchange", fitSoon);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
addEventListener("load", fitSoon);
if (window.ResizeObserver) { let lastW = 0, lastH = 0; new ResizeObserver(() => { if (app.clientWidth !== lastW || app.clientHeight !== lastH) { lastW = app.clientWidth; lastH = app.clientHeight; fitSoon(); } }).observe(app); }
setTimeout(fit, 1500);

// Réglages
function openSettings() {
  ["title", "group", "msg", "amStart", "pmStart", "goals", "word", "def", "q", "a", "theme", "couleurs", "scale", "clock", "anim"].forEach(k => $("f-" + k).value = cfg[k]);
  $("f-ppe").innerHTML = Object.entries(PPE).map(([k, v]) => `<label><input type="checkbox" id="f-ppe-${k}" value="${k}" ${cfg.ppe.includes(k) ? "checked" : ""}> ${v.name}</label>`).join("");
  $("sheet").hidden = false; $("f-title").focus(); $("ai-why").hidden = true; $("ai-note").textContent = ""; preview();
}
function preview() {
  const text = $("f-steps").value, ctx = ctxForm(), start = toMin($("f-debut").value || (PER_PREP === "pm" ? cfg.pmStart : cfg.amStart) || "08:30");
  const info = points(text, ctx);
  const html = timeline(start, text, ctx).map(r => `<li class="${r.pause ? "p" : ""}"><span>${fmt(r.start)}–${fmt(r.end)}</span><span></span></li>`).join("");
  $("f-preview").innerHTML = html;
  const rows = timeline(start, text, ctx);
  [...$("f-preview").children].forEach((li, k) => { li.lastChild.textContent = rows[k].label; });
  renderDurs();
  if (info.over || info.cut) { const w = document.createElement("li"); w.innerHTML = '<span class="warn">Les durées dépassent ' + dureeTexte(classMin(ctx)) + ' de cours : les derniers points ne tiennent pas.</span>'; w.style.display = "block"; $("f-preview").append(w); }
}
["f-steps", "f-amStart"].forEach(id => $(id).addEventListener("input", preview));
$("f-exam").addEventListener("change", () => { preview(); $("prep-more").open = true; });
$("f-steps").addEventListener("input", () => { clearTimeout(window.__lkT); window.__lkT = setTimeout(renderLiens, 400); });

// Flèches pour ajuster la durée de chaque activité (par bonds de 5 min)
function renderDurs() {
  if ($("f-deroul")) return renderDeroul();
  const ta = $("f-steps"), lines = ta.value.split("\n");
  const acts = [];
  lines.forEach((l, idx) => { const t = l.trim(); if (!t) return; const m = t.match(/^(\d+)\s*(?:min)?\s*\|\s*(.+)$/); const label = m ? m[2].trim() : t.replace(/^\|\s*/, "");
    if (/^pause\b/i.test(label) || /^accueil\b|présences?\b/i.test(label)) return; acts.push({ idx, label, fixed: !!m }); });
  const list = points(ta.value, ctxForm()).list; // [0] = accueil
  const box = $("f-durs"); box.innerHTML = "";
  const row = (label, mins, opts = {}) => {
    const d = document.createElement("div"); d.className = "dur" + (opts.locked ? " locked" : "") + (opts.fixed ? " fixed" : "");
    d.innerHTML = '<span class="dl"></span><button type="button" class="mn" aria-label="Moins 5 minutes">−</button><span class="dv"></span><button type="button" class="pl" aria-label="Plus 5 minutes">+</button><button type="button" class="rz" title="Revenir à la durée automatique" aria-label="Durée automatique">↺</button>';
    d.querySelector(".dl").textContent = label;
    d.querySelector(".dv").innerHTML = (mins == null ? "—" : mins + " min") + "<small>" + (opts.locked ? "fixe" : opts.fixed ? "choisie" : "automatique") + "</small>";
    if (opts.locked) d.querySelectorAll("button").forEach(b => b.hidden = true);
    if (!opts.fixed) d.querySelector(".rz").style.visibility = "hidden";
    box.append(d); return d;
  };
  row("Accueil et présences", 5, { locked: true });
  acts.forEach((a, k) => {
    const it = list[k + 1], mins = it ? it.b - it.a : 0;
    const d = row(a.label, mins, { fixed: a.fixed });
    const set = v => { lines[a.idx] = v == null ? a.label : `${v} | ${a.label}`; ta.value = lines.join("\n"); preview(); };
    d.querySelector(".mn").disabled = mins <= 5;
    d.querySelector(".mn").onclick = () => set(Math.max(5, mins - 5));
    d.querySelector(".pl").onclick = () => set(mins + 5);
    d.querySelector(".rz").onclick = () => set(null);
  });
  const used = acts.filter(a => a.fixed).length;
  $("f-durs-note").textContent = acts.length ? (used ? "Les activités en « automatique » se partagent le temps qui reste." : "Clique sur + ou − pour choisir une durée; les autres s'ajustent toutes seules.") : "";
}

// Suggestion des durées par Claude
let sampler = null;
(async () => {
  try { sampler = window.claude && await window.claude.use("sample"); } catch (e) { sampler = null; }
  if (sampler) $("ai-box").hidden = false;
})();
$("b-ai").addEventListener("click", async () => {
  const lines = $("f-steps").value.split("\n").map(l => l.trim()).filter(l => l && !/^pause\b/i.test(l))
    .map(l => l.replace(/^\d+\s*(?:min)?\s*\|\s*/, ""));
  if (!lines.length) { $("ai-note").textContent = "Écris d'abord tes points, un par ligne."; return; }
  const btn = $("b-ai"); btn.disabled = true; $("ai-note").textContent = "Claude réfléchit…";
  const ctxIA = ctxForm(), minIA = classMin(ctxIA), pausesIA = []; { let c = 0; blocs(ctxIA).forEach(([ty, d]) => { if (ty === "cours") c += d; else pausesIA.push(c); }); }
  const prompt = `Tu aides un enseignant du ${PROGS[$("f-prog").value] || "DEP 5333 · Plomberie et chauffage"} (formation professionnelle au Québec, élèves adultes et jeunes adultes) à planifier une période.
La période contient ${minIA} minutes de cours.${pausesIA.length ? " Il y a une pause après " + pausesIA.join(" et après ") + " minutes de cours." : " Il n'y a pas de pause."}
Compétence : ${moduleOfficiel($("f-comp").value, $("f-module").value) || "non précisée"}.
Points de la période, dans l'ordre (garde cet ordre et ce libellé exact) :
${lines.map((l, k) => (k + 1) + ". " + l).join("\n")}

Donne une durée réaliste à chaque point. Règles :
- Le total doit faire exactement ${minIA} minutes; chaque durée est un multiple de 5 et au moins 5.
- Les activités pratiques à l'atelier prennent normalement le plus de temps; l'accueil et le bilan restent courts; prévois du temps de rangement réaliste si un point le mentionne.
${pausesIA.length ? "- Quand c'est raisonnable, fais tomber les changements d'activité sur les pauses (à " + pausesIA.join(" et à ") + " minutes de cours)." : ""}
- Pour chaque point, une raison très courte (10 mots maximum) en français.
Réponds seulement en JSON : {"points":[{"label":"...","minutes":0,"raison":"..."}]}`;
  try {
    const res = await sampler.json(prompt, { modelTier: "default" });
    const pts = (res && res.points) || [];
    if (!pts.length) throw { code: "invalid_json" };
    $("f-steps").value = pts.map(p => `${Math.max(5, Math.round(+p.minutes / 5) * 5)} | ${p.label}`).join("\n");
    const why = $("ai-why"); why.innerHTML = "";
    pts.forEach(p => { const li = document.createElement("li"); li.textContent = `${p.label} : ${p.raison || ""}`; why.append(li); });
    why.hidden = false;
    $("ai-note").textContent = "Durées proposées. Ajuste-les au besoin, puis enregistre.";
    preview();
  } catch (e) {
    const code = e && e.code;
    $("ai-note").textContent = code === "not_granted" ? "Accès à Claude refusé pour cette page." :
      code === "rate_limited" ? "Trop de demandes pour l'instant. Réessaie dans quelques minutes." :
      "La suggestion n'a pas fonctionné. Réessaie ou garde l'estimation automatique.";
    if (code === "not_granted") $("ai-box").hidden = true;
  } finally { btn.disabled = false; }
});
function closeMenu() { $("menu").hidden = true; $("b-more").setAttribute("aria-expanded", "false"); }
$("b-more").onclick = e => { e.stopPropagation(); const open = $("menu").hidden; $("menu").hidden = !open; $("b-more").setAttribute("aria-expanded", open); };
document.addEventListener("click", e => { if (!$("menu").hidden && !e.target.closest("#menu, #b-more")) closeMenu(); });
$("b-set").addEventListener("click", closeMenu); $("b-wid").addEventListener("click", closeMenu);
$("b-keys").onclick = () => { closeMenu(); $("keys").hidden = false; };
$("b-keys-close").onclick = () => $("keys").hidden = true;
/* fermer en touchant le fond — seulement si le clic a AUSSI commencé sur le fond (glisser pour sélectionner du texte et relâcher dehors ne ferme plus) */
function fermerSurFond(id){ const el = $(id); let dedans = false; el.addEventListener("pointerdown", e => { dedans = e.target === el; }); el.addEventListener("click", e => { if (e.target === el && dedans) el.hidden = true; dedans = false; }); }
fermerSurFond("keys");
$("b-set").onclick = openSettings;
function fillComps(prog) {
  const sel = $("f-comp"); sel.innerHTML = "";
  COMPS.filter(c => c[3] === prog).forEach(([code, title]) => { const o = document.createElement("option"); o.value = code; o.textContent = code + " · " + titreComp(code); o.title = title; sel.append(o); });
  const o = document.createElement("option"); o.value = "autre"; o.textContent = "Autre (écrire ci-dessous)"; sel.append(o);
}
$("f-prog").addEventListener("change", () => { fillComps($("f-prog").value); $("f-module").hidden = true; });
/* Préparer le cours, version simplifiée (8 nov.) : programme + compétence en une seule liste (le programme se déduit), et un seul
   « Déroulement » : chaque activité = une rangée avec sa durée et ses contenus. Le texte de #f-steps (caché) reste la source : « 45 | Théorie… ». */
function remplirCompt(){
  const s = $("f-compt"); if (!s) return; s.innerHTML = "";
  Object.entries(PROGS).forEach(([prog, nom]) => { const g = document.createElement("optgroup"); g.label = nom;
    COMPS.filter(c => c[3] === prog).forEach(([code, title]) => { const o = document.createElement("option"); o.value = prog + "|" + code; o.textContent = code + " · " + titreComp(code); o.title = title; g.append(o); });
    const o = document.createElement("option"); o.value = prog + "|autre"; o.textContent = "Autre module (" + nom.replace(/ ·.*/, "") + ")"; g.append(o); s.append(g); });
  s.value = $("f-prog").value + "|" + $("f-comp").value; }
if ($("f-compt")) $("f-compt").addEventListener("change", () => { const [prog, code] = $("f-compt").value.split("|");
  if ($("f-prog").value !== prog){ $("f-prog").value = prog; fillComps(prog); } $("f-comp").value = code; $("f-module").hidden = code !== "autre"; if (code === "autre") $("f-module").focus(); });
const lignesSteps = () => $("f-steps").value.split("\n");
function ecrireSteps(lines){ $("f-steps").value = lines.filter(l => l.trim()).join("\n"); preview(); }
function lireLigne(l){ const t = l.trim(), m = t.match(/^(\d+)\s*(?:min)?\s*\|\s*(.+)$/); return { label: m ? m[2].trim() : t.replace(/^\|\s*/, ""), d: m ? +m[1] : null }; }
const ligne = (label, d) => d ? d + " | " + label : label;
function renderDeroul(){
  const box = $("f-deroul"); if (!box) return;
  const lines = lignesSteps(), acts = [];
  lines.forEach((l, idx) => { if (!l.trim()) return; const x = lireLigne(l); if (/^pause\b/i.test(x.label) || /^accueil\b|présences?\b/i.test(x.label)) return; acts.push(Object.assign(x, { idx })); });
  const list = points($("f-steps").value, ctxForm()).list;
  box.innerHTML = '<div class="dr-row dr-fixe"><span class="dr-poi"></span><span class="dr-nomf">Accueil et présences</span><span class="dr-dur"><b>5 min<small>fixe</small></b></span></div>';
  if (!acts.length) box.insertAdjacentHTML("beforeend", '<p class="dr-vide">Ajoute ta première activité ci-dessous : théorie, démonstration, atelier, rangement…</p>');
  acts.forEach((a, k) => {
    const it = list[k + 1], mins = it ? it.b - it.a : 0, r = document.createElement("div"); r.className = "dr-row lk-row"; r.dataset.i = a.idx;
    r.innerHTML = '<span class="dr-poi" title="Glisser pour changer l\'ordre" aria-hidden="true">⋮⋮</span><input class="dr-nom" aria-label="Activité">'
      + '<span class="dr-dur"><button type="button" class="mn" aria-label="Moins 5 minutes">−</button><b></b><button type="button" class="pl" aria-label="Plus 5 minutes">+</button><button type="button" class="rz" title="Revenir en automatique">↺</button></span>'
      + '<span class="dr-ord"><button type="button" class="dr-h" aria-label="Monter">▲</button><button type="button" class="dr-b" aria-label="Descendre">▼</button></span>'
      + '<button type="button" class="dr-x" aria-label="Retirer cette activité" title="Retirer">✕</button>'
      + '<div class="lk-top"><span class="lk-nom" hidden></span><span class="lk-chips"></span></div>';
    const inp = r.querySelector(".dr-nom"); inp.value = a.label; r.querySelector(".lk-nom").textContent = a.label;
    r.querySelector(".dr-dur b").innerHTML = mins + " min<small>" + (a.d ? "choisie" : "auto") + "</small>";
    /* à la minute près (8 nov.) : toucher la durée pour l'écrire */
    const bv = r.querySelector(".dr-dur b"); bv.tabIndex = 0; bv.title = "Toucher pour écrire la durée exacte"; bv.classList.add("dr-ecrire");
    bv.onclick = () => { if (bv.querySelector("input")) return; bv.innerHTML = '<input type="number" min="1" max="240" inputmode="numeric" aria-label="Minutes">'; const ip = bv.firstChild; ip.value = mins; ip.focus(); ip.select();
      const ok = () => { const v = Math.round(+ip.value); const l = L(); if (v >= 1 && v <= 240 && v !== mins){ l[a.idx] = ligne(a.label, v); ecrireSteps(l); } else renderDeroul(); };
      ip.addEventListener("keydown", e => { if (e.key === "Enter"){ e.preventDefault(); ip.blur(); } if (e.key === "Escape"){ ip.onblur = null; renderDeroul(); } }); ip.onblur = ok; };
    if (!a.d) r.querySelector(".rz").style.visibility = "hidden"; r.querySelector(".mn").disabled = mins <= 1;
    const L = () => lignesSteps();
    r.querySelector(".mn").onclick = () => { const l = L(); l[a.idx] = ligne(a.label, Math.max(1, mins - 5)); ecrireSteps(l); };
    r.querySelector(".pl").onclick = () => { const l = L(); l[a.idx] = ligne(a.label, mins + 5); ecrireSteps(l); };
    r.querySelector(".rz").onclick = () => { const l = L(); l[a.idx] = a.label; ecrireSteps(l); };
    { const bouge = d => { const l = L(), i = a.idx; let j = i + d; while (j >= 0 && j < l.length && !l[j].trim()) j += d; if (j < 0 || j >= l.length) return; const x = l[i]; l[i] = l[j]; l[j] = x; ecrireSteps(l); };
      const bh = r.querySelector(".dr-h"), bb = r.querySelector(".dr-b"); bh.disabled = k === 0; bb.disabled = k === acts.length - 1; bh.onclick = () => bouge(-1); bb.onclick = () => bouge(1); }
    r.querySelector(".dr-x").onclick = () => { const l = L(); l.splice(a.idx, 1); delete LIENS_T[cleLien(a.label)]; ecrireSteps(l); };
    const renommer = () => { const n = inp.value.trim(); if (!n){ inp.value = a.label; return; } if (n === a.label) return;
      const k0 = cleLien(a.label), k1 = cleLien(n); if (LIENS_T[k0] && !LIENS_T[k1]){ LIENS_T[k1] = LIENS_T[k0]; delete LIENS_T[k0]; }
      const l = L(); l[a.idx] = ligne(n, a.d); ecrireSteps(l); };
    inp.addEventListener("change", renommer); inp.addEventListener("keydown", e => { if (e.key === "Enter"){ e.preventDefault(); inp.blur(); } });
    /* contenus de l'activité (mêmes pastilles et même choix qu'avant) */
    const kk = cleLien(a.label), lks = liste(LIENS_T[kk]), top = r.querySelector(".lk-chips");
    lks.forEach((c, i) => { const ch = document.createElement("span"); ch.className = "lk-chip"; ch.innerHTML = '<span></span><button type="button" aria-label="Retirer">✕</button>';
      ch.firstChild.textContent = nomLien(c); ch.insertAdjacentHTML("afterbegin", ico(c.type)); ch.title = nomLien(c);
      ch.lastChild.onclick = () => { const n = liste(LIENS_T[kk]).filter((_, j) => j !== i); if (n.length) LIENS_T[kk] = n; else delete LIENS_T[kk]; renderDeroul(); }; top.append(ch); });
    if (lks.length < MAX_LIENS){ const b = document.createElement("button"); b.type = "button"; b.className = "lk-add"; b.textContent = lks.length ? "＋ Un autre" : "＋ Livre, quiz, fichier…"; b.onclick = () => choix(r, a.label); top.append(b); }
    r.querySelector(".dr-poi").addEventListener("pointerdown", e => glisserActivite(e, r));
    box.append(r);
  });
}
/* changer l'ordre : glisser la poignée ⋮⋮ */
function glisserActivite(e, row){
  e.preventDefault(); const box = $("f-deroul"); let vise = null, apres = false; row.classList.add("dr-tient");
  const mv = ev => { const el = document.elementFromPoint(ev.clientX, ev.clientY), r = el && el.closest(".dr-row.lk-row");
    box.querySelectorAll(".dr-avant,.dr-apres").forEach(x => x.classList.remove("dr-avant", "dr-apres"));
    if (r && r !== row){ const b = r.getBoundingClientRect(); apres = ev.clientY > b.top + b.height / 2; r.classList.add(apres ? "dr-apres" : "dr-avant"); vise = r; } else vise = null; };
  const up = () => { removeEventListener("pointermove", mv); removeEventListener("pointerup", up); removeEventListener("pointercancel", up); row.classList.remove("dr-tient");
    box.querySelectorAll(".dr-avant,.dr-apres").forEach(x => x.classList.remove("dr-avant", "dr-apres"));
    if (!vise) return; const l = lignesSteps(), a = +row.dataset.i, v = +vise.dataset.i, x = l.splice(a, 1)[0]; let pos = v > a ? v - 1 : v; if (apres) pos++; l.splice(pos, 0, x); ecrireSteps(l); };
  addEventListener("pointermove", mv); addEventListener("pointerup", up); addEventListener("pointercancel", up);
}
function ajouterActivite(){ const i = $("f-nouv"), v = i.value.trim(); if (!v) return; const l = lignesSteps().filter(x => x.trim()); l.push(v); i.value = ""; ecrireSteps(l); i.focus(); }
if ($("b-nouv")){ $("b-nouv").onclick = ajouterActivite; $("f-nouv").addEventListener("keydown", e => { if (e.key === "Enter"){ e.preventDefault(); ajouterActivite(); } }); }

// ---------- Contenus liés aux activités : page de livre, schéma, plan, tableau blanc, minuterie ----------
/* Icônes au trait, même style que la barre d'outils des livres */
const ICO_P = {
  quiz: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.6a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.6M12 17.2v.1"/>',
  simulateur: '<rect x="4" y="3.5" width="16" height="17" rx="2"/><path d="M7.5 7.5h9v4h-9zM8 15h.01M12 15h.01M16 15h.01M8 18h8"/>',
  livre: '<path d="M12 6.5C10 5 7 4.6 4 5v13c3-.4 6 0 8 1.5 2-1.5 5-1.9 8-1.5V5c-3-.4-6 0-8 1.5zM12 6.5v13"/>',
  schema: '<path d="M13.5 3L5.5 13.5h6L10.5 21l8-10.5h-6z"/>',
  plan: '<rect x="4" y="4" width="16" height="16" rx="1.5"/><path d="M4 10h6V4M14 20v-6h6M10 14h4"/>',
  tableau: '<rect x="3.5" y="4.5" width="17" height="12" rx="1.5"/><path d="M9 21l3-4.5 3 4.5"/>',
  minuterie: '<circle cx="12" cy="13" r="7.5"/><path d="M12 9v4.5l3 1.5M9.5 3h5"/>',
  web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9s1.3-6.4 3.9-9z"/>',
  fichier: '<path d="M14 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V7.5z"/><path d="M14 3v4.5h4.5M9 12.5h6M9 16h4"/>',
  video: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor"/>',
  ouvrir: '<path d="M8 5l11 7-11 7z" fill="currentColor"/>'
};
const ico = t => '<svg class="ico" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICO_P[t] || ICO_P.ouvrir) + '</svg>';
const ICO_LIEN = new Proxy({}, { get: (o, t) => ico(t) });
/* Vidéo YouTube : on accepte toutes les formes de lien (youtu.be, watch?v=, shorts, embed, live) et le moment de départ (t=90, t=1m30s) */
function ytInfo(url){
  const u = String(url || "").trim(); let m = u.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/))([\w-]{11})/i);
  if (!m && /^[\w-]{11}$/.test(u)) m = [u, u]; if (!m) return null;
  let start = 0; const t = u.match(/[?&#](?:t|start)=([\dhms]+)/i);
  if (t){ const v = t[1]; if (/^\d+$/.test(v)) start = +v; else { const h = v.match(/(\d+)h/), mi = v.match(/(\d+)m/), se = v.match(/(\d+)s/); start = (h ? +h[1] * 3600 : 0) + (mi ? +mi[1] * 60 : 0) + (se ? +se[1] : 0); } }
  return { id: m[1], start };
}
const ytImg = id => "https://i.ytimg.com/vi/" + id + "/mqdefault.jpg";
function ytTitre(id){ return fetch("https://www.youtube.com/oembed?format=json&url=" + encodeURIComponent("https://www.youtube.com/watch?v=" + id)).then(r => r.ok ? r.json() : null).then(j => j && j.title || "").catch(() => ""); }
const dureeTxt = s => s >= 60 ? Math.floor(s / 60) + " min " + String(s % 60).padStart(2, "0") : s + " s";
// Lecteur vidéo plein écran, par-dessus le tableau de bord
function lecteurVideo(c){
  let ov = $("vid");
  if (!ov){ ov = document.createElement("div"); ov.id = "vid"; ov.className = "vid"; ov.hidden = true;
    ov.innerHTML = '<div class="vid-top"><span class="vid-t"></span><button type="button" class="vid-x">✕ Fermer <small>Échap</small></button></div><div class="vid-cadre"></div>';
    document.body.append(ov); ov.querySelector(".vid-x").onclick = fermerVideo; }
  ov.querySelector(".vid-t").textContent = c.nom || "Vidéo";
  if (c.yt) ov.querySelector(".vid-cadre").innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + c.yt + '?autoplay=1&rel=0&modestbranding=1&playsinline=1' + (c.start ? "&start=" + c.start : "") + '" title="Vidéo" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
  else ov.querySelector(".vid-cadre").innerHTML = '<video src="' + String(c.url).replace(/"/g, "&quot;") + '" controls autoplay playsinline></video>';
  ov.hidden = false; setTimeout(() => ov.querySelector(".vid-x").focus(), 50);
}
function fermerVideo(){ const ov = $("vid"); if (!ov || ov.hidden) return false; ov.hidden = true; ov.querySelector(".vid-cadre").innerHTML = ""; ov.classList.remove("doc");
  if (window.__urlFichier){ URL.revokeObjectURL(window.__urlFichier); window.__urlFichier = ""; } return true; }
/* ---- Fichiers de l'enseignant (PDF, image, vidéo, PowerPoint…) gardés sur cet ordinateur (IndexedDB) ---- */
const FDB = () => new Promise((ok, ko) => { const r = indexedDB.open("accueil-fichiers", 1); r.onupgradeneeded = () => r.result.createObjectStore("f"); r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error); });
const fOp = (mode, fn) => FDB().then(db => new Promise((ok, ko) => { const t = db.transaction("f", mode), st = t.objectStore("f"); const r = fn(st); t.oncomplete = () => ok(r && r.result); t.onerror = () => ko(t.error); }));
const fMettre = (id, v) => fOp("readwrite", st => st.put(v, id));
const fLire = id => fOp("readonly", st => st.get(id));
const fCles = () => fOp("readonly", st => st.getAllKeys());
const fEnlever = id => fOp("readwrite", st => st.delete(id));
const tailleTxt = n => n > 1048576 ? (n / 1048576).toFixed(1).replace(".", ",") + " Mo" : Math.max(1, Math.round(n / 1024)) + " Ko";
function sorteFichier(nom, mime){
  const x = (String(nom).split(".").pop() || "").toLowerCase();
  if (mime === "application/pdf" || x === "pdf") return "pdf";
  if (/^image\//.test(mime) || /^(png|jpe?g|gif|webp|svg|bmp)$/.test(x)) return "image";
  if (/^video\//.test(mime) || /^(mp4|webm|mov|m4v|ogv)$/.test(x)) return "video";
  if (/^audio\//.test(mime) || /^(mp3|wav|m4a|ogg)$/.test(x)) return "audio";
  if (/^text\/plain/.test(mime) || x === "txt") return "texte";
  return "autre";
}
/* Ménage : retire les fichiers qui ne sont plus liés à aucune activité */
function idsFichiers(){ const L = [cfg.liens || {}].concat(Object.values(cfg.plans || {}).map(p => (p && p.liens) || {}));   /* aussi les cours préparés d'avance */
  return new Set(L.flatMap(o => Object.values(o).flatMap(liste)).filter(c => c && c.type === "fichier").map(c => c.id)); }
function menageFichiers(){ const garder = idsFichiers();
  fCles().then(ks => (ks || []).forEach(k => { if (!garder.has(k)) fEnlever(k); })).catch(() => {}); }
/* ---- Les fichiers suivent l'enseignant (8 nov.) : copie chiffrée dans son coffre, en morceaux de 5 Mo (rangées « fichier:<id> » + « fichier:<id>:<n> ») ---- */
/* Supabase gratuit = 500 Mo pour tout le monde : seuls les petits fichiers voyagent (20 Mo), et le serveur refuse les gros envois passé 400 Mo (coffre.sql). */
const MORCEAU = 5 * 1048576, MAX_FICHIER = 20 * 1048576;
const b64De = u8 => { let s = ""; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s); };
const u8De = b => { const s = atob(b), u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; };
const aEnvoyer = () => { try { return JSON.parse(localStorage.getItem("fichiersAEnvoyer") || "[]"); } catch(e){ return []; } };
const marquerEnvoi = (id, oui) => { const L = aEnvoyer().filter(x => x !== id); if (oui) L.push(id); try { localStorage.setItem("fichiersAEnvoyer", JSON.stringify(L)); } catch(e){} };
/* photo (JPEG/PNG) de plus de 300 Ko : la copie qui voyage est en WebP, 1920 px max (souvent 5 à 10 fois plus légère); l'original reste sur cet appareil.
   Les PDF, vidéos et PowerPoint sont déjà compressés : ils voyagent tels quels (le coffre les passe quand même au gzip). */
async function allegerImage(f){
  if (!/^image\/(jpeg|png)$/.test(f.blob.type || "") || f.blob.size < 300000) return f;
  const bm = await createImageBitmap(f.blob), k = Math.min(1, 1920 / Math.max(bm.width, bm.height)), c = document.createElement("canvas");
  c.width = Math.round(bm.width * k); c.height = Math.round(bm.height * k); c.getContext("2d").drawImage(bm, 0, 0, c.width, c.height);
  const b = await new Promise(ok => c.toBlob(ok, "image/webp", .8));
  return b && b.type === "image/webp" && b.size < f.blob.size ? Object.assign({}, f, { blob: b }) : f; }
async function envoyerFichier(id){
  if (!window.COFFRE) return false; let f = await fLire(id); if (!f || !f.blob) { marquerEnvoi(id, false); return false; }
  try { f = await allegerImage(f); } catch(e){}
  if (f.blob.size > MAX_FICHIER) { marquerEnvoi(id, false); return false; }   /* trop gros pour voyager : reste sur cet ordinateur */
  try { const u = new Uint8Array(await f.blob.arrayBuffer()), n = Math.max(1, Math.ceil(u.length / MORCEAU));
    for (let i = 0; i < n; i++) await COFFRE.envoyer("fichier:" + id + ":" + i, { b: b64De(u.subarray(i * MORCEAU, (i + 1) * MORCEAU)) });
    await COFFRE.envoyer("fichier:" + id, { nom: f.nom, type: f.blob.type || "", taille: u.length, n, date: f.date || Date.now() });
    const r = registre(); r[id] = { d: aujourdhui(), n }; ecrireRegistre(r);
    marquerEnvoi(id, false); return true; }
  catch(e){ marquerEnvoi(id, true); return false; } }
async function recevoirFichier(id){
  if (!window.COFFRE) return null;
  try { const m = await COFFRE.recevoir("fichier:" + id); if (!m || !m.n) return null; const parts = [];
    for (let i = 0; i < m.n; i++){ const p = await COFFRE.recevoir("fichier:" + id + ":" + i); if (!p || !p.b) return null; parts.push(u8De(p.b)); }
    const v = { nom: m.nom, blob: new Blob(parts, { type: m.type || "" }), date: m.date || Date.now() }; await fMettre(id, v); return v; }
  catch(e){ return null; } }
/* Registre des fichiers du coffre (synchronisé avec l'accueil : clé « fichiersCoffre ») : { id: { d: dernier jour d'usage, n: morceaux } }.
   Un fichier qui n'est plus dans aucune activité (cours actuel ni cours préparé d'avance) est effacé du coffre un jour après son dernier cours. */
const aujourdhui = () => new Date().toLocaleDateString("en-CA");
const registre = () => { try { return JSON.parse(localStorage.getItem("fichiersCoffre") || "{}"); } catch(e){ return {}; } };
const ecrireRegistre = r => { try { localStorage.setItem("fichiersCoffre", JSON.stringify(r)); } catch(e){} };
async function menageCoffre(){
  const r = registre(), utiles = idsFichiers(), auj = aujourdhui(), hier = new Date(Date.now() - 864e5).toLocaleDateString("en-CA");
  const datesPlans = {}; Object.entries(cfg.plans || {}).forEach(([k, p]) => Object.values((p && p.liens) || {}).flatMap(liste).forEach(c => { if (c && c.type === "fichier") datesPlans[c.id] = k.slice(0, 10) > (datesPlans[c.id] || "") ? k.slice(0, 10) : datesPlans[c.id]; }));
  let change = false;
  for (const id of utiles) if (r[id]){ const d = datesPlans[id] && datesPlans[id] > auj ? datesPlans[id] : auj; if (r[id].d !== d && d > r[id].d){ r[id].d = d; change = true; } }
  for (const id of Object.keys(r)) if (!utiles.has(id) && r[id].d < hier){
    try { for (let i = 0; i < (r[id].n || 1); i++) await COFFRE.effacer("fichier:" + id + ":" + i); await COFFRE.effacer("fichier:" + id); delete r[id]; change = true; } catch(e){ break; } }
  if (change) ecrireRegistre(r); }
/* en arrière-plan : renvoyer ce qui n'a pas pu partir, puis aller chercher les fichiers des activités qui manquent sur cet appareil (prêts même sans Internet en classe) */
async function synchroFichiers(){
  if (!window.COFFRE || /[?&]apercu=/.test(location.search)) return; const s = await COFFRE.session().catch(() => null); if (!s || s.eleve) return;
  for (const id of aEnvoyer()) await envoyerFichier(id);
  const ici = new Set((await fCles().catch(() => [])) || []);
  for (const id of idsFichiers()) if (!ici.has(id)) await recevoirFichier(id);
  await menageCoffre().catch(() => {}); }
/* demander au navigateur de ne jamais effacer de lui-même les fichiers gardés sur cet appareil (TNI : toujours prêts en classe) */
try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch(e){}
setTimeout(synchroFichiers, 4000); setInterval(synchroFichiers, 10 * 60000);
function ouvrirFichier(c){
  fLire(c.id).then(async f => {
    if (!f || !f.blob){ if (window.__toast) window.__toast("Téléchargement du fichier…"); f = await recevoirFichier(c.id); }
    if (!f || !f.blob){ alert("Ce fichier n'est pas encore arrivé sur cet appareil. Vérifie la connexion Internet, ou ajoute-le de nouveau dans « Préparer le cours »."); return; }
    const sorte = sorteFichier(f.nom, f.blob.type), url = URL.createObjectURL(f.blob);
    let ov = $("vid"); if (!ov){ lecteurVideo({ url:"", nom:"" }); fermerVideo(); ov = $("vid"); }
    window.__urlFichier = url; ov.classList.add("doc");
    ov.querySelector(".vid-t").textContent = f.nom;
    const cadre = ov.querySelector(".vid-cadre"), dl = '<a class="vid-dl" href="' + url + '" download="' + f.nom.replace(/"/g, "") + '">Télécharger et ouvrir</a>';
    if (sorte === "pdf" || sorte === "texte") cadre.innerHTML = '<iframe class="vid-pdf" src="' + url + '#view=FitH" title="' + f.nom.replace(/"/g, "") + '"></iframe>';
    else if (sorte === "image") cadre.innerHTML = '<img class="vid-img" src="' + url + '" alt="">';
    else if (sorte === "video") cadre.innerHTML = '<video src="' + url + '" controls autoplay playsinline></video>';
    else if (sorte === "audio") cadre.innerHTML = '<div class="vid-autre">' + ico("fichier") + '<b></b><audio src="' + url + '" controls autoplay></audio></div>';
    else {
      /* PowerPoint, Word, Excel… : le navigateur ne sait pas les afficher. On lance tout de suite l'ouverture avec le programme de l'ordinateur. */
      const prog = /^pptx?$|^pps/i.test(f.nom.split(".").pop()) ? "PowerPoint" : /^docx?$/i.test(f.nom.split(".").pop()) ? "Word" : /^xlsx?$/i.test(f.nom.split(".").pop()) ? "Excel" : "son programme";
      cadre.innerHTML = '<div class="vid-autre">' + ico("fichier") + '<b></b><p>Ouverture dans ' + prog + '…</p>'
        + '<p class="vid-astuce"><strong>Pour que ça s\'ouvre tout seul les prochaines fois :</strong> dans Chrome ou Edge, clique sur le fichier dans les téléchargements (en haut à droite) avec le bouton droit, puis « Toujours ouvrir les fichiers de ce type ».</p>'
        + dl.replace("Télécharger et ouvrir", "Ouvrir de nouveau") + '</div>';
      const a = cadre.querySelector(".vid-dl"); setTimeout(() => { try { a.click(); } catch (e) {} }, 60);
    }
    const bb = cadre.querySelector(".vid-autre b"); if (bb) bb.textContent = f.nom;
    ov.hidden = false; setTimeout(() => ov.querySelector(".vid-x").focus(), 50);
  }).catch(() => alert("Impossible de lire ce fichier sur cet ordinateur."));
}
let LIENS_T = {}, CATAL = null;
const cleLien = l => String(l || "").replace(/ \(suite\)$/, "").replace(/^\d+\s*(?:min)?\s*\|\s*/, "").trim().toLowerCase();
/* Une activité peut avoir plusieurs contenus (ex. une vidéo et une page du livre) : on garde une liste */
const liste = v => !v ? [] : Array.isArray(v) ? v.filter(Boolean) : [v];
const MAX_LIENS = 4;
const liensDe = label => liste((cfg.liens || {})[cleLien(label)]);
/* petit menu pour choisir quand une activité a plusieurs contenus */
function menuLiens(lks, x, y){
  let m = $("lk-menu"); if (!m){ m = document.createElement("div"); m.id = "lk-menu"; m.className = "lk-menu"; document.body.append(m);
    document.addEventListener("pointerdown", e => { if (!m.hidden && !m.contains(e.target)) m.hidden = true; }, true);
    document.addEventListener("keydown", e => { if (e.key === "Escape") m.hidden = true; }, true); }
  m.innerHTML = '<div class="lk-menu-t">Ouvrir</div>';
  lks.forEach((c, i) => { const b = document.createElement("button"); b.type = "button"; b.innerHTML = ico(c.type) + "<span></span><kbd>" + (i + 1) + "</kbd>"; b.querySelector("span").textContent = nomLien(c);
    b.onclick = () => { m.hidden = true; ouvrirLien(c); }; m.append(b); });
  m.hidden = false; const r = m.getBoundingClientRect();
  m.style.left = Math.max(8, Math.min(innerWidth - r.width - 8, x - r.width / 2)) + "px"; m.style.top = Math.max(8, Math.min(innerHeight - r.height - 8, y - r.height - 12)) + "px";
  setTimeout(() => { const f = m.querySelector("button"); if (f) f.focus(); }, 20);
}
function ouvrirLiens(lks, e){ if (!lks.length) return; if (lks.length === 1) { ouvrirLien(lks[0]); return; } menuLiens(lks, e ? e.clientX : innerWidth / 2, e ? e.clientY : innerHeight / 2); }
function nomLien(c){
  if (!c) return "";
  if (c.type === "livre") return (c.titre || "Livre") + (c.page > 1 ? " · page " + c.page : "");
  if (c.type === "schema") return c.nom || "Schéma";
  if (c.type === "plan") return "Plans · " + (c.nom || "Dossier " + c.n);
  if (c.type === "tableau") return "Tableau blanc" + (c.fond === "quad" ? " quadrillé" : c.fond === "iso" ? " isométrique" : "");
  if (c.type === "minuterie") return "Minuterie " + c.min + " min";
  if (c.type === "fichier") return c.nom || "Fichier";
  if (c.type === "quiz") return "Quiz · " + (c.titre || "");
  if (c.type === "simulateur") return c.defi ? "Défi panneau" : "Simulateur de panneau";
  if (c.type === "web") return c.nom || hoteWeb(c.url);
  if (c.type === "video") return "Vidéo" + (c.nom ? " · " + c.nom : "") + (c.start ? " (à " + dureeTxt(c.start) + ")" : "");
  return "";
}
/* Boutons « Ouvrir » de la carte : un bouton par contenu (touche O pour le premier, 2 pour le deuxième…) */
/* nom court pour les boutons côte à côte (l'icône dit déjà la sorte de contenu) */
/* Lien web : on garde l'adresse telle quelle (https:// ajouté au besoin) et on l'ouvre dans un nouvel onglet */
const hoteWeb = u => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return "Lien web"; } };
function urlWeb(u){ u = String(u || "").trim(); if (!u) return ""; if (!/^[a-z][a-z0-9+.-]*:/i.test(u)) u = "https://" + u;
  try { const x = new URL(u); return /^https?:$/.test(x.protocol) && x.hostname.includes(".") ? x.href : ""; } catch (e) { return ""; } }
function nomCourt(c){
  if (c.type === "livre") return "Livre" + (c.page > 1 ? " · p. " + c.page : "");
  if (c.type === "video") return c.nom && c.nom.length < 28 ? c.nom : "Vidéo";
  if (c.type === "tableau") return "Tableau blanc";
  if (c.type === "plan") return "Plan";
  return nomLien(c);
}
function majGo(b, lks){ if (!b) return; lks = liste(lks);
  if (!b.parentNode.classList.contains("now-gos")){ const w = document.createElement("div"); w.className = "now-gos"; b.parentNode.insertBefore(w, b); w.append(b); }
  const w = b.parentNode, cle = JSON.stringify(lks);
  if (w.dataset.k === cle) return; w.dataset.k = cle;
  w.querySelectorAll(".now-go.plus").forEach(x => x.remove());
  if (!lks.length){ b.hidden = true; b.onclick = null; w.hidden = true; return; }
  w.hidden = false;
  const remplir = (btn, c, i) => { const t = lks.length > 1 ? nomCourt(c) : "Ouvrir : " + nomLien(c); btn.innerHTML = ico(c.type) + "<span></span>"; btn.lastChild.textContent = t; btn.title = "Ouvrir : " + nomLien(c) + (b.id === "v-go" ? " (touche " + (i ? i + 1 : "O") + ")" : ""); btn.hidden = false; btn.onclick = () => ouvrirLien(c); };
  remplir(b, lks[0], 0);
  lks.slice(1).forEach((c, i) => { const nb = document.createElement("button"); nb.type = "button"; nb.className = b.className + " plus"; remplir(nb, c, i + 1); w.append(nb); });
}
function ouvrirLien(c){
  if (!c) return;
  if (c.type === "minuterie"){ minuterie(c.min, c.nom); return; }
  if (c.type === "fichier"){ ouvrirFichier(c); return; }
  /* Labo (8 nov.) : le quiz ou le simulateur s'ouvre en mode « Animer au tableau », dans un nouvel onglet (le tableau de bord reste ouvert dessous) */
  if (c.type === "quiz" || c.type === "simulateur"){ const u = c.type === "quiz" ? "quiz.html?animer=1&quiz=" + encodeURIComponent(c.id) : "simulateur.html?animer=1" + (c.defi ? "&defi=1" : "");
    const w = window.open(u, "_blank"); if (!w) location.assign(u); return; }
  if (c.type === "web"){ const w = window.open(c.url, "_blank", "noopener"); if (!w) location.assign(c.url); return; }
  if (c.type === "video"){ if (c.yt || /\.(mp4|webm|ogg)(\?|$)/i.test(c.url || "")) lecteurVideo(c); else window.open(c.url, "_blank", "noopener"); return; }
  if (window.parent !== window && CATAL){ try { window.parent.postMessage({ type:"accueil-ouvrir", contenu:c }, "*"); return; } catch(e){} }
  /* tableau de bord ouvert seul : on passe par la bibliothèque */
  if (c.type === "livre"){ location.href = "index.html?livre=" + encodeURIComponent(c.f) + (c.page > 1 ? "&page=" + c.page : ""); return; }
  alert("Ouvre le tableau de bord depuis la bibliothèque (bouton « Accueil de classe ») pour ouvrir ce contenu.");
}
function demanderCatalogue(){ if (window.parent !== window){ try { window.parent.postMessage({ type:"accueil-catalogue?" }, "*"); } catch(e){} } }
window.addEventListener("message", e => { if (e.source === window.parent && e.data && e.data.type === "accueil-catalogue"){ CATAL = e.data; if (!$("prep").hidden) renderLiens(); } });
demanderCatalogue();
function activitesPrep(){
  const out = [];
  $("f-steps").value.split("\n").forEach(l => { const t = l.trim(); if (!t) return; const m = t.match(/^(\d+)\s*(?:min)?\s*\|\s*(.+)$/), label = m ? m[2].trim() : t.replace(/^\|\s*/, "");
    if (/^pause\b/i.test(label) || /^accueil\b|présences?\b/i.test(label)) return; if (!out.some(o => cleLien(o) === cleLien(label))) out.push(label); });
  return out;
}
function renderLiens(){
  if ($("f-deroul")) return renderDeroul();
  const box = $("f-liens"); if (!box) return; box.innerHTML = "";
  const acts = activitesPrep();
  if (!acts.length){ box.innerHTML = '<span class="lk-note">Écris d\'abord tes activités à l\'étape 4.</span>'; return; }
  acts.forEach(label => {
    const k = cleLien(label), lks = liste(LIENS_T[k]), row = document.createElement("div"); row.className = "lk-row";
    row.innerHTML = '<div class="lk-top"><span class="lk-nom"></span><span class="lk-chips"></span></div>'; row.querySelector(".lk-nom").textContent = label;
    const top = row.querySelector(".lk-chips");
    lks.forEach((c, i) => { const ch = document.createElement("span"); ch.className = "lk-chip"; ch.innerHTML = '<span></span><button type="button" aria-label="Retirer">✕</button>';
      ch.firstChild.textContent = nomLien(c); ch.insertAdjacentHTML("afterbegin", ico(c.type)); ch.title = nomLien(c);
      ch.lastChild.onclick = () => { const n = liste(LIENS_T[k]).filter((_, j) => j !== i); if (n.length) LIENS_T[k] = n; else delete LIENS_T[k]; renderLiens(); }; top.append(ch); });
    if (lks.length < MAX_LIENS){ const b = document.createElement("button"); b.type = "button"; b.className = "lk-add"; b.textContent = lks.length ? "＋ Un autre" : "＋ Ajouter"; b.onclick = () => choix(row, label); top.append(b); }
    box.append(row);
  });
}
function choix(row, label){
  document.querySelectorAll(".lk-choix").forEach(x => x.remove());
  const k = cleLien(label), z = document.createElement("div"); z.className = "lk-choix";
  const enBiblio = !!CATAL;
  z.innerHTML = '<div class="lk-tuiles">'
    + '<button type="button" class="lk-tuile" data-t="livre"' + (enBiblio ? "" : " disabled") + '><b>' + ico("livre") + '</b>Page d\'un livre</button>'
    + '<button type="button" class="lk-tuile" data-t="schema"' + (enBiblio ? "" : " disabled") + '><b>' + ico("schema") + '</b>Schéma électrique</button>'
    + '<button type="button" class="lk-tuile" data-t="plan"' + (enBiblio ? "" : " disabled") + '><b>' + ico("plan") + '</b>Plan technique</button>'
    + '<button type="button" class="lk-tuile" data-t="tableau"' + (enBiblio ? "" : " disabled") + '><b>' + ico("tableau") + '</b>Tableau blanc</button>'
    + '<button type="button" class="lk-tuile" data-t="minuterie"><b>' + ico("minuterie") + '</b>Minuterie</button>'
    + '<button type="button" class="lk-tuile" data-t="fichier"><b>' + ico("fichier") + '</b>Fichier (PDF, image…)</button>'
    + '<button type="button" class="lk-tuile" data-t="quiz"><b>' + ico("quiz") + '</b>Quiz</button>'
    + '<button type="button" class="lk-tuile" data-t="simulateur"><b>' + ico("simulateur") + '</b>Simulateur</button>'
    + '<button type="button" class="lk-tuile" data-t="web"><b>' + ico("web") + '</b>Lien web</button>'
    + '<button type="button" class="lk-tuile" data-t="video"><b>' + ico("video") + '</b>Vidéo YouTube</button></div>'
    + (enBiblio ? "" : '<p class="lk-note">Pour les livres, schémas et plans, ouvre ce tableau de bord depuis la bibliothèque.</p>')
    + '<div class="lk-form" hidden></div>';
  row.append(z);
  const f = z.querySelector(".lk-form"), fini = c => { LIENS_T[k] = [...liste(LIENS_T[k]), c]; renderLiens(); };
  const annuler = '<button type="button" data-x>Annuler</button>';
  z.querySelectorAll(".lk-tuile").forEach(t => t.onclick = () => {
    z.querySelectorAll(".lk-tuile").forEach(x => x.style.borderColor = x === t ? "var(--water)" : ""); f.hidden = false; const ty = t.dataset.t;
    if (ty === "livre"){
      f.innerHTML = '<select data-l>' + CATAL.livres.map(l => `<option value="${l.f}">${l.titre.replace(/</g, "&lt;")}${l.niveau ? " — " + l.niveau.replace(/</g, "&lt;") : ""}</option>`).join("") + '</select>'
        + '<label class="lk-pg">Page <input type="number" min="1" value="1" data-p></label><div class="lk-ok"><button type="button" class="prim" data-v>Choisir</button>' + annuler + '</div>';
      const sl = f.querySelector("[data-l]"), pi = f.querySelector("[data-p]"), maj = () => { const l = CATAL.livres.find(x => x.f === sl.value); pi.max = l && l.pages ? l.pages : ""; };
      sl.onchange = maj; maj(); setTimeout(() => pi.select(), 30);
      f.querySelector("[data-v]").onclick = () => { const l = CATAL.livres.find(x => x.f === sl.value); fini({ type:"livre", f:l.f, titre:l.titre, page:Math.max(1, parseInt(pi.value, 10) || 1) }); };
    }
    if (ty === "schema"){
      f.innerHTML = '<select data-s><optgroup label="Modèles prêts à utiliser">' + CATAL.modeles.map(m => `<option value="m:${m.id}">${m.nom}</option>`).join("") + '</optgroup>'
        + (CATAL.schemas.length ? '<optgroup label="Mes schémas">' + CATAL.schemas.map(m => `<option value="s:${m.id}">${m.nom.replace(/</g, "&lt;")}</option>`).join("") + '</optgroup>' : "")
        + '<option value="v:">Un schéma vierge (quadrillé)</option></select><div class="lk-ok"><button type="button" class="prim" data-v>Choisir</button>' + annuler + '</div>';
      f.querySelector("[data-v]").onclick = () => { const v = f.querySelector("[data-s]"), [t2, id] = v.value.split(":"), nom = v.options[v.selectedIndex].textContent;
        fini(t2 === "m" ? { type:"schema", modele:id, nom } : t2 === "s" ? { type:"schema", sch:id, nom } : { type:"schema", nom:"Schéma vierge" }); };
    }
    if (ty === "plan"){
      f.innerHTML = '<div class="lk-ok">' + CATAL.dossiers.map(([n, nom]) => `<button type="button" class="prim" data-n="${n}">${nom}</button>`).join("") + annuler + '</div>';
      f.querySelectorAll("[data-n]").forEach(b => b.onclick = () => fini({ type:"plan", n:+b.dataset.n, nom:b.textContent }));
    }
    if (ty === "tableau"){
      f.innerHTML = '<div class="lk-ok"><button type="button" class="prim" data-f="blanc">Blanc</button><button type="button" class="prim" data-f="quad">Quadrillé</button><button type="button" class="prim" data-f="iso">Isométrique</button><button type="button" class="prim" data-f="lignes">Lignes</button>' + annuler + '</div>';
      f.querySelectorAll("[data-f]").forEach(b => b.onclick = () => fini({ type:"tableau", fond:b.dataset.f }));
    }
    if (ty === "quiz"){
      const opt = q => `<option value="${String(q.id).replace(/"/g, "")}">${String(q.titre || "Quiz").replace(/</g, "&lt;")}</option>`;
      const dessiner = () => { let miens = []; try { miens = JSON.parse(localStorage.getItem("quizMaison") || "[]"); } catch(e){}
        const prets = [{ id:"exemple-incendie", titre:"Protection incendie : révision des modules 1 à 5" }].concat(window.QUIZ_LIVRES || []);
        f.innerHTML = '<select data-q>' + (miens.length ? '<optgroup label="Mes quiz">' + miens.map(opt).join("") + '</optgroup>' : "")
          + '<optgroup label="Quiz prêts à jouer">' + prets.map(opt).join("") + '</optgroup></select>'
          + '<small class="lk-aide">Le quiz s\'ouvrira en mode « Animer au tableau » : les élèves scannent le code QR avec leur iPad.</small>'
          + '<div class="lk-ok"><button type="button" class="prim" data-v>Choisir</button>' + annuler + '</div>';
        f.querySelector("[data-v]").onclick = () => { const s = f.querySelector("[data-q]"); fini({ type:"quiz", id:s.value, titre:s.options[s.selectedIndex].textContent }); };
        const x = f.querySelector("[data-x]"); if (x) x.onclick = () => z.remove(); };
      dessiner();
      if (!window.QUIZ_LIVRES){ const sc = document.createElement("script"); sc.src = "quiz-livres.js?v=1794414378"; sc.onload = () => { if (!f.hidden && f.querySelector("[data-q]")) dessiner(); }; document.head.append(sc); }
    }
    if (ty === "simulateur"){
      f.innerHTML = '<div class="lk-ok"><button type="button" class="prim" data-s="0">Panneau d\'alarme (mode libre)</button><button type="button" class="prim" data-s="1">Défi panneau (8 missions)</button>' + annuler + '</div>'
        + '<small class="lk-aide">S\'ouvre en mode « Animer au tableau » : chaque équipe scanne le code QR avec son iPad.</small>';
      f.querySelectorAll("[data-s]").forEach(b => b.onclick = () => fini({ type:"simulateur", defi:b.dataset.s === "1" }));
    }
    if (ty === "minuterie"){
      f.innerHTML = '<div class="lk-ok">' + [5, 10, 15, 20, 30, 45].map(m => `<button type="button" class="prim" data-m="${m}">${m} min</button>`).join("") + annuler + '</div>';
      f.querySelectorAll("[data-m]").forEach(b => b.onclick = () => fini({ type:"minuterie", min:+b.dataset.m, nom:label }));
    }
    if (ty === "video"){
      f.innerHTML = '<input type="url" data-u placeholder="Colle le lien de la vidéo (YouTube ou fichier .mp4)" autocomplete="off">'
        + '<div class="lk-vid" hidden><img alt="" onerror="this.style.visibility=\'hidden\'"><span><b data-n>Vidéo</b><small data-s></small></span></div>'
        + '<small class="lk-aide" data-e>Sur YouTube : bouton « Partager », puis « Copier ». Pour commencer à un moment précis, coche « Commencer à » avant de copier.</small>'
        + '<div class="lk-ok"><button type="button" class="prim" data-v disabled>Choisir</button>' + annuler + '</div>';
      const inp = f.querySelector("[data-u]"), ok = f.querySelector("[data-v]"), apv = f.querySelector(".lk-vid"), msg = f.querySelector("[data-e]");
      let choisi = null, n = 0;
      const lire = () => { const u = inp.value.trim(), y = ytInfo(u), k = ++n; choisi = null; ok.disabled = true; apv.hidden = true;
        if (y){ choisi = { type:"video", yt:y.id, start:y.start, url:"https://youtu.be/" + y.id, nom:"" }; ok.disabled = false; apv.hidden = false;
          apv.querySelector("img").src = ytImg(y.id); apv.querySelector("[data-n]").textContent = "Vidéo YouTube"; apv.querySelector("[data-s]").textContent = y.start ? "Commence à " + dureeTxt(y.start) : "Du début";
          ytTitre(y.id).then(t => { if (k === n && t && choisi){ choisi.nom = t; apv.querySelector("[data-n]").textContent = t; } }); msg.textContent = "Vidéo trouvée ✓"; }
        else if (/^https?:\/\/\S+$/i.test(u)){ choisi = { type:"video", url:u, nom:/\.(mp4|webm|ogg)(\?|$)/i.test(u) ? "Fichier vidéo" : "Lien web" }; ok.disabled = false; msg.textContent = /\.(mp4|webm|ogg)(\?|$)/i.test(u) ? "Fichier vidéo ✓" : "Ce n'est pas YouTube : le lien s'ouvrira dans un nouvel onglet."; }
        else if (u) msg.textContent = "Ce lien ne ressemble pas à une vidéo. Copie-le depuis la barre d'adresse ou le bouton « Partager » de YouTube."; };
      inp.addEventListener("input", lire); inp.addEventListener("paste", () => setTimeout(lire, 0));
      inp.addEventListener("keydown", e => { if (e.key === "Enter"){ e.preventDefault(); if (!ok.disabled) ok.click(); } });
      ok.onclick = () => { if (choisi){ if (!choisi.nom) choisi.nom = label; fini(choisi); } };
      setTimeout(() => inp.focus(), 30);
    }
    if (ty === "web"){
      f.innerHTML = '<input type="url" data-wu placeholder="Colle l\'adresse du site (ex. www.rbq.gouv.qc.ca)" autocomplete="off">'
        + '<input type="text" data-wn placeholder="Nom à afficher (facultatif)" autocomplete="off" maxlength="60">'
        + '<small class="lk-aide" data-e>Le site s\'ouvrira dans un nouvel onglet. Copie l\'adresse dans la barre du navigateur.</small>'
        + '<div class="lk-ok"><button type="button" class="prim" data-v disabled>Choisir</button>' + annuler + '</div>';
      const iu = f.querySelector("[data-wu]"), inn = f.querySelector("[data-wn]"), ok = f.querySelector("[data-v]"), msg = f.querySelector("[data-e]");
      const maj = () => { const u = urlWeb(iu.value); ok.disabled = !u;
        msg.textContent = !iu.value.trim() ? "Le site s'ouvrira dans un nouvel onglet. Copie l'adresse dans la barre du navigateur." : u ? "Site trouvé : " + hoteWeb(u) + " ✓" : "Cette adresse ne ressemble pas à un site web (ex. www.exemple.com)."; };
      iu.addEventListener("input", maj); iu.addEventListener("paste", () => setTimeout(maj, 0));
      [iu, inn].forEach(x => x.addEventListener("keydown", e => { if (e.key === "Enter"){ e.preventDefault(); if (!ok.disabled) ok.click(); } }));
      ok.onclick = () => { const u = urlWeb(iu.value); if (u) fini({ type:"web", url:u, nom: inn.value.trim() || hoteWeb(u) }); };
      setTimeout(() => iu.focus(), 30);
    }
    if (ty === "fichier"){
      f.innerHTML = '<label class="lk-fich"><input type="file" data-fi hidden><span class="lk-fich-z">' + ico("fichier") + '<b>Choisir un fichier…</b><small>ou glisse-le ici · PDF, image, vidéo, PowerPoint, Word…</small></span></label>'
        + '<small class="lk-aide" data-e>Le fichier est gardé sur cet ordinateur. Les PDF, images et vidéos s\'affichent en grand sur le tableau de bord.</small>'
        + '<div class="lk-ok"><button type="button" class="prim" data-v disabled>Choisir</button>' + annuler + '</div>';
      const fi = f.querySelector("[data-fi]"), zone = f.querySelector(".lk-fich"), ok = f.querySelector("[data-v]"), msg = f.querySelector("[data-e]"); let fich = null;
      const prendre = file => { if (!file) return; fich = file; zone.querySelector("b").textContent = file.name; zone.querySelector("small").textContent = tailleTxt(file.size) + " · clique pour en choisir un autre"; zone.classList.add("ok");
        const sorte = sorteFichier(file.name, file.type);
        const ext = (file.name.split(".").pop() || "").toLowerCase();
        msg.textContent = /^pptx?$|^pps/.test(ext) ? "Astuce : pour l'afficher en grand directement ici, enregistre-le en PDF dans PowerPoint (Fichier → Exporter → PDF). Sinon, il s'ouvrira dans PowerPoint."
          : sorte === "autre" ? "Ce fichier s'ouvrira avec son programme (Word, Excel…). Astuce : un PDF s'affiche directement en grand ici." : file.size > 300 * 1048576 ? "Gros fichier : il peut prendre de la place sur cet ordinateur." : "Prêt ✓";
        ok.disabled = false; };
      fi.onchange = () => prendre(fi.files[0]);
      zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("sur"); });
      zone.addEventListener("dragleave", () => zone.classList.remove("sur"));
      zone.addEventListener("drop", e => { e.preventDefault(); zone.classList.remove("sur"); prendre(e.dataTransfer.files[0]); });
      ok.onclick = () => { if (!fich) return; ok.disabled = true; ok.textContent = "Enregistrement…";
        const id = "f" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        fMettre(id, { nom: fich.name, blob: fich, date: Date.now() })
          .then(() => { fini({ type:"fichier", id, nom: fich.name, taille: fich.size }); marquerEnvoi(id, true); envoyerFichier(id); })
          .catch(() => { ok.disabled = false; ok.textContent = "Choisir"; msg.textContent = "Impossible d'enregistrer ce fichier (espace plein ou navigation privée)."; }); };
      setTimeout(() => fi.click(), 30);
    }
    const x = f.querySelector("[data-x]"); if (x) x.onclick = () => z.remove();
  });
}
// Minuterie plein écran (pour une activité chronométrée)
let minuT = 0;
function minuterie(min, nom){
  let ov = $("minu");
  if (!ov){ ov = document.createElement("div"); ov.id = "minu"; ov.className = "minu"; ov.hidden = true;
    ov.innerHTML = '<div class="minu-c"><div class="minu-l"></div><div class="minu-t">00:00</div><div class="minu-b"><button type="button" data-a="p">Pause</button><button type="button" data-a="+">+ 1 min</button><button type="button" class="prim" data-a="x">Fermer</button></div></div>';
    document.body.append(ov); }
  let reste = min * 60, pause = false; clearInterval(minuT); ov.classList.remove("fin"); ov.querySelector(".minu-l").textContent = nom || "Minuterie";
  const aff = () => { const m = Math.floor(reste / 60), s = reste % 60; ov.querySelector(".minu-t").textContent = String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0"); };
  aff(); ov.hidden = false;
  minuT = setInterval(() => { if (pause) return; if (reste > 0){ reste--; aff(); if (!reste){ ov.classList.add("fin"); try { const a = new AudioContext(), o = a.createOscillator(), g = a.createGain(); o.frequency.value = 880; o.connect(g); g.connect(a.destination); g.gain.setValueAtTime(.2, a.currentTime); o.start(); o.stop(a.currentTime + .6); } catch(e){} } } }, 1000);
  ov.querySelector('[data-a="p"]').onclick = e => { pause = !pause; e.target.textContent = pause ? "Reprendre" : "Pause"; };
  ov.querySelector('[data-a="+"]').onclick = () => { reste += 60; ov.classList.remove("fin"); aff(); };
  ov.querySelector('[data-a="x"]').onclick = () => { clearInterval(minuT); ov.hidden = true; };
}
/* timeline : un clic ouvre le contenu lié, un double-clic ouvre « Préparer le cours » directement sur le choix d'action de cette activité */
let clicT = 0;
function clicSimple(f){ clearTimeout(clicT); clicT = setTimeout(f, 280); }
function lierActivite(label){
  clearTimeout(clicT); openPrep();
  setTimeout(() => {
    const k = cleLien(label), row = [...document.querySelectorAll("#f-deroul .lk-row, #f-liens .lk-row")].find(x => cleLien(x.querySelector(".lk-nom").textContent) === k);
    if (!row) return;
    row.scrollIntoView({ block:"center", behavior:"smooth" }); row.classList.add("lk-vise"); setTimeout(() => row.classList.remove("lk-vise"), 2200);
    if (liste(LIENS_T[k]).length < MAX_LIENS) choix(row, row.querySelector(".lk-nom").textContent);
  }, 120);
}
/* ===== Préparer un autre jour ou une autre période (30 oct. : « préparer mon cours de lundi », « choisir am ou pm », « cours d'une heure ») =====
   Une période = "AAAA-MM-JJ|am" ou "|pm". Le contenu affiché appartient à cfg.slot. Les autres périodes préparées attendent dans
   cfg.plans[clé] = { prog, comp, module, steps, liens, examen, duree, debut } et s'appliquent toutes seules quand leur période arrive (appliquerPlans). */
function prochainJourClasse(){ const d = new Date(); do { d.setDate(d.getDate() + 1); } while (d.getDay() === 0 || d.getDay() === 6); return isoJour(d); }
const NOM_PER = { am: "matin", pm: "après-midi" };
const cleSlot = (jour, per) => (jour || isoJour(new Date())) + "|" + per;
function slotActif(){ const d = new Date(), m = d.getHours() * 60 + d.getMinutes(), ps = periods();
  const p = ps.find(x => m >= x.start && m < x.end) || ps.find(x => x.start > m); return p ? isoJour(d) + "|" + p.key : null; }
function perPassee(per){ const d = new Date(), m = d.getHours() * 60 + d.getMinutes(), p = periods().find(x => x.key === per); return !p || m >= p.end; }
function contenuActuel(){ return { prog: cfg.prog, comp: cfg.comp, module: cfg.module, steps: cfg.steps, liens: cfg.liens || {}, examen: cfg.examen === jourAuj(), duree: +cfg.duree || SPAN, debut: cfg.debut || "", local: cfg.local || "" }; }
function contenuDe(k){ if (k === cfg.slot) return contenuActuel(); return (cfg.plans || {})[k] || null; }
let JOUR_PREP = "", PER_PREP = "am";
function remplirPrep(jour, per){
  JOUR_PREP = jour; PER_PREP = per;
  const k = cleSlot(jour, per), P0 = contenuDe(k), neuf = !P0, P = P0 || Object.assign(contenuActuel(), { examen: false, duree: SPAN, debut: "" });
  const prog = (compInfo(P.comp) || [])[3] || P.prog || "5333";
  $("f-prog").value = prog; fillComps(prog);
  $("f-comp").value = P.comp; $("f-module").value = P.module || ""; $("f-steps").value = P.steps || "";
  $("f-amStart").value = cfg.amStart; $("f-pmStart").value = cfg.pmStart;
  $("f-module").hidden = $("f-comp").value !== "autre";
  $("f-exam").checked = !!P.examen; localChoix(P.local || "");
  $("f-duree").value = String(DUREES.some(d => d[0] === +P.duree) ? +P.duree : SPAN);
  heuresDebut(P.debut || (per === "pm" ? cfg.pmStart : cfg.amStart));
  LIENS_T = JSON.parse(JSON.stringify(P.liens || {}));
  const actif = k === (slotActif() || cfg.slot), quand = jour ? nomJour(jour).toLowerCase() + (per === "am" ? " au matin" : " en après-midi") : (per === "am" ? "ce matin" : "cet après-midi");
  const note = $("f-jour-note");
  if (!actif){ note.hidden = false; note.textContent = "S'affichera tout seul " + quand + ". Le tableau ne change pas d'ici là." + (neuf ? " (On part du cours affiché : modifie-le.)" : ""); }
  else note.hidden = true;
  $("prepForm").querySelector('button[type="submit"]').textContent = actif ? "Afficher au tableau" : "Enregistrer pour " + (jour ? nomJour(jour, true).toLowerCase().replace(/ \d.*/, "") : (per === "pm" ? "cet" : "ce")) + " " + (per === "am" ? "matin" : "après-midi");
  $("f-q3").textContent = "Qu'est-ce qu'on fait " + (jour ? nomJour(jour).toLowerCase().replace(/ \d.*/, "") + " " : "") + (per === "am" ? (jour ? "matin" : "ce matin") : (jour ? "après-midi" : "cet après-midi")) + "?";
  const ex = $("f-exam").closest(".exam-opt").querySelector("b"); if (ex) ex.textContent = "Examen pendant ce cours";
  boutonsJours(); remplirCompt(); preview(); renderLiens();
}
/* Vue de la semaine (8 nov., « simplifier la préparation de cours », vue choisie par Jeremy) : 5 jours × matin / après-midi.
   Toucher une case = préparer cette période (même formulaire). Glisser un cours vers une case vide = le copier là. */
let SEM0 = "";
function lundiDe(d){ const x = new Date(d); x.setHours(12, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; }
function titreCours(P){ if (!P) return ""; const e = String(P.steps || "").split("\n").map(s => s.trim()).filter(Boolean);
  return P.module || titreComp(P.comp) || e[0] || "Cours"; }
function semaine(){
  const box = $("f-semaine"); if (!box) return;
  const auj = isoJour(new Date()), esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));
  if (!SEM0){ const d = new Date((JOUR_PREP || auj) + "T12:00"); if (d.getDay() === 6) d.setDate(d.getDate() + 2); if (d.getDay() === 0) d.setDate(d.getDate() + 1); SEM0 = isoJour(lundiDe(d)); }
  /* 8 nov. (Jeremy) : on prépare seulement la semaine actuelle et la suivante (fin de semaine : la semaine qui vient et la suivante) */
  const b0 = new Date(); b0.setHours(12, 0, 0, 0); if (b0.getDay() === 6) b0.setDate(b0.getDate() + 2); if (b0.getDay() === 0) b0.setDate(b0.getDate() + 1);
  const semMin = isoJour(lundiDe(b0)), semMax = (() => { const d = lundiDe(b0); d.setDate(d.getDate() + 7); return isoJour(d); })();
  if (SEM0 < semMin) SEM0 = semMin; if (SEM0 > semMax) SEM0 = semMax;
  const l0 = new Date(SEM0 + "T12:00"), jours = [...Array(5)].map((_, i) => { const d = new Date(l0); d.setDate(d.getDate() + i); return isoJour(d); });
  const choisi = (JOUR_PREP || auj) + "|" + PER_PREP, actif = slotActif() || cfg.slot;
  const fin = new Date(l0); fin.setDate(fin.getDate() + 4);
  let h = `<div class="sem-tete"><button type="button" class="sem-fl" data-sem="-7" aria-label="Semaine précédente"${SEM0 <= semMin ? " disabled" : ""}>‹</button><b>${SEM0 === semMin ? "Cette semaine" : "Semaine prochaine"} <small class="sem-du">· du ${l0.toLocaleDateString("fr-CA", { day:"numeric", month:"long" })}</small></b><button type="button" class="sem-fl" data-sem="7" aria-label="Semaine suivante"${SEM0 >= semMax ? " disabled" : ""}>›</button></div><div class="sem-grille"><span></span>`;
  jours.forEach(j => { h += `<span class="sem-j${j === auj ? " auj" : ""}">${new Date(j + "T12:00").toLocaleDateString("fr-CA", { weekday:"short" }).replace(".", "")}<small>${+j.slice(8)}</small></span>`; });
  ["am", "pm"].forEach(per => { h += `<span class="sem-p">${per === "am" ? "Matin" : "Après-midi"}</span>`;
    jours.forEach(j => { const k = j + "|" + per, passe = j < auj || (j === auj && perPassee(per)), P = contenuDe(k), t = titreCours(P);
      h += `<button type="button" class="sem-c${P ? " plein" : ""}${k === choisi ? " on" : ""}${k === actif ? " tab" : ""}" data-k="${k}"${passe ? " disabled" : ""} title="${t ? t.replace(/"/g, "&quot;") : "Période libre"}">${k === actif ? '<i class="sem-tag">Au tableau</i>' : ""}<span>${t ? esc(t) : passe ? "" : "+"}</span></button>`; }); });
  { const P = contenuDe(choisi), libre = choisi !== actif && cfg.plans && cfg.plans[choisi];
    if (COPIE) h += `<div class="sem-act"><span>Touche une case libre (+) pour y copier le cours.</span><button type="button" class="btn" data-sa="annuler">Annuler</button></div>`;
    else if (P) h += `<div class="sem-act"><button type="button" class="btn" data-sa="copier">Copier ce cours vers…</button>${libre ? '<button type="button" class="btn" data-sa="effacer">Effacer ce cours</button>' : ""}</div>`; }
  box.innerHTML = h + "</div>";
  if (COPIE) box.classList.add("copie"); else box.classList.remove("copie");
  box.querySelectorAll("[data-sa]").forEach(b => b.onclick = () => { const v = b.dataset.sa;
    if (v === "copier"){ COPIE = choisi; semaine(); }
    else if (v === "annuler"){ COPIE = null; semaine(); }
    else if (v === "effacer"){ if (!b.classList.contains("sur")){ b.classList.add("sur"); b.textContent = "Sûr ? Touche encore"; setTimeout(() => { if (b.isConnected){ b.classList.remove("sur"); b.textContent = "Effacer ce cours"; } }, 3000); return; }
      effacerPlan(choisi); save(); peMsg("Cours effacé."); const [j, per] = choisi.split("|"); remplirPrep(j === auj ? "" : j, per); repeindrePrep(); } });
  box.querySelectorAll("[data-sem]").forEach(b => b.onclick = () => { const d = new Date(SEM0 + "T12:00"); d.setDate(d.getDate() + +b.dataset.sem); SEM0 = isoJour(d); semaine(); });
  box.querySelectorAll(".sem-c").forEach(b => { b.onclick = () => { if (b._glisse) { b._glisse = false; return; }
      if (COPIE){ if (b.classList.contains("plein") || b.disabled){ peMsg("Choisis une case libre (+)."); return; } const src = COPIE; COPIE = null; copierCours(src, b.dataset.k); return; } const [j, per] = b.dataset.k.split("|"); remplirPrep(j === auj ? "" : j, per); };
    if (b.classList.contains("plein")) b.addEventListener("pointerdown", e => glisserCours(e, b)); });
}
/* glisser un cours vers une période libre = copie (rien n'est jamais écrasé) */
/* Tableau interactif : après un glissé, la fenêtre pouvait rester blanche (affichage pas rafraîchi) : on force un nouveau dessin */
function repeindrePrep(){ const f = document.querySelector("#prep .sheet-in"); if (!f) return;
  requestAnimationFrame(() => { f.style.display = "none"; void f.offsetHeight; f.style.display = ""; const y = f.scrollTop; f.scrollTop = y + 1; f.scrollTop = y; }); }
let COPIE = null;   /* copie au toucher (10 nov., le glisser ne marchait pas au tableau interactif) */
function copierCours(srcK, k){ const P = contenuDe(srcK); if (!P) return;
  cfg.plans = cfg.plans || {}; cfg.plans[k] = JSON.parse(JSON.stringify(Object.assign({}, P, { examen: false, t: Date.now() }))); if (cfg.plansSup) delete cfg.plansSup[k];
  save(); const [j, per] = k.split("|"); peMsg("Cours copié : " + nomJour(j).toLowerCase() + " " + (per === "am" ? "matin" : "après-midi") + ".");
  remplirPrep(j === isoJour(new Date()) ? "" : j, per); repeindrePrep(); }
function glisserCours(e, src){
  const x0 = e.clientX, y0 = e.clientY; let fant = null, cible = null, poub = null, surPoub = false;
  const mv = ev => { if (!fant && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 8) return;
    if (!fant){ fant = src.cloneNode(true); fant.className = "sem-c plein sem-fantome"; fant.style.width = src.offsetWidth + "px"; document.body.append(fant); src.classList.add("sem-src");
      if (cfg.plans && cfg.plans[src.dataset.k]){ poub = document.createElement("div"); poub.className = "sem-poub"; poub.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Glisse ici pour effacer ce cours'; document.body.append(poub); } }
    if (poub){ const r = poub.getBoundingClientRect(), d = ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom; poub.classList.toggle("vise", d); surPoub = d; }
    fant.style.left = ev.clientX - src.offsetWidth / 2 + "px"; fant.style.top = ev.clientY - 20 + "px";
    const el = document.elementFromPoint(ev.clientX, ev.clientY), c = el && el.closest(".sem-c");
    if (cible && cible !== c) cible.classList.remove("sem-vise"); cible = c && c !== src && !c.disabled && !c.classList.contains("plein") ? c : null; if (cible) cible.classList.add("sem-vise"); };
  const up = () => { removeEventListener("pointermove", mv); removeEventListener("pointerup", up); removeEventListener("pointercancel", up);
    if (!fant) return; fant.remove(); src.classList.remove("sem-src"); src._glisse = true; setTimeout(() => src._glisse = false, 50);
    if (poub){ poub.remove(); if (surPoub){ if (cible) cible.classList.remove("sem-vise"); const k = src.dataset.k; effacerPlan(k); save(); peMsg("Cours effacé.");
      const [j, per] = k.split("|"); remplirPrep(j === isoJour(new Date()) ? "" : j, per); repeindrePrep(); return; } }
    if (!cible){ peMsg("Glisse le cours sur une case libre (+) pour le copier."); return; }
    cible.classList.remove("sem-vise"); copierCours(src.dataset.k, cible.dataset.k); };
  addEventListener("pointermove", mv); addEventListener("pointerup", up); addEventListener("pointercancel", up);
}
function boutonsJours(){
  semaine();
  const d = +$("f-duree").value || SPAN, res = $("f-opts-res"); if (res) res.textContent = (d === SPAN ? "période complète" : (DUREES.find(x => x[0] === d) || [0, d + " min"])[1]) + ($("f-exam").checked ? " · examen" : "");
}
/* Local du cours (12 nov., Jeremy) : « atelier » = ménage à la fin du cours; « classe » = pas de ménage; vide = ancienne règle (nom d'activité) */
let LOCAL_F = "";
/* Choix : « Classe » (pas de ménage) + les locaux de locaux.json (ex. Atelier DEP1 : sa liste de ménage, à la fin du cours); aucun locaux.json → « Atelier » */
function localChoix(v){ LOCAL_F = v || ""; const box = $("f-local"); if (!box) return;
  const L = (window.locauxListe ? window.locauxListe() : []) || [], opts = [["classe", "Classe"]].concat(L.length ? L.map(l => [l.id, l.nom]) : [["atelier", "Atelier"]]);
  if (LOCAL_F && !opts.some(o => o[0] === LOCAL_F)) opts.push([LOCAL_F, LOCAL_F === "atelier" ? "Atelier" : "Local retiré"]);
  box.innerHTML = '<span>Local</span>'; opts.forEach(([id, nom]) => { const b = document.createElement("button"); b.type = "button"; b.dataset.l = id; b.textContent = nom;
    b.classList.toggle("on", id === LOCAL_F); b.onclick = () => localChoix(LOCAL_F === id ? "" : id); box.append(b); });
  const r = document.createElement("small"); r.textContent = !LOCAL_F ? "" : LOCAL_F === "classe" ? "Pas de ménage" : "Ménage à la fin du cours"; box.append(r); }
/* Zones de ménage d'un déroulement (frise + plein écran du ménage) : [{i, start, end}] */
function zoneMenage(rows){
  const m = Object.assign({ mot:"atelier", min:10 }, window.menageReglages ? window.menageReglages() : (cfg.menage || {})), Z = [];
  if (cfg.local){ if (cfg.local === "classe") return Z;
    for (let i = rows.length - 1; i >= 0; i--) if (!rows[i].pause){ const r = rows[i]; Z.push({ i, start: Math.max(r.start, r.end - m.min), end: r.end }); break; }
    return Z; }
  const ok = (l, w) => window.menageMot ? window.menageMot(l, w) : String(l).toLowerCase().includes(String(w).toLowerCase());
  /* 12 nov. : une activité coupée par une pause (« … (suite) ») n'a du ménage qu'à sa vraie fin, pas avant chaque pause */
  const base = l => String(l).replace(/ \(suite\)$/, "");
  rows.forEach((r, i) => { if (r.pause || !m.mot || !ok(r.label, m.mot)) return;
    const nx = rows.slice(i + 1).find(x => !x.pause); if (nx && base(nx.label) === base(r.label)) return;
    Z.push({ i, start: Math.max(r.start, r.end - m.min), end: r.end }); });
  return Z;
}
window.zoneMenage = zoneMenage;
/* Cours effacé : on note quand (cfg.plansSup), sinon la copie du coffre le ramenait (10 nov.) */
function effacerPlan(k){ if (!cfg.plans) return; delete cfg.plans[k]; cfg.plansSup = cfg.plansSup || {}; cfg.plansSup[k] = Date.now(); }
function appliquerPlans(){
  const plans = cfg.plans || {}, auj = isoJour(new Date()); let change = false;
  Object.keys(plans).forEach(k => { if (!k.includes("|")){ plans[k + "|am"] = plans[k]; delete plans[k]; change = true; } });   /* plans d'un jour entier (version du 30 oct., 17 h 50) → le matin */
  const s = slotActif(), borne = s || auj + "|zz";
  const arrives = Object.keys(plans).filter(k => k <= borne).sort();
  if (arrives.length){ const k = arrives[arrives.length - 1], P = plans[k], ici = k === s;
    ["prog", "comp", "module", "steps"].forEach(x => { if (P[x] !== undefined) cfg[x] = P[x]; });
    cfg.liens = P.liens || {}; cfg.examen = ici && P.examen ? jourAuj() : ""; cfg.duree = ici ? (+P.duree || SPAN) : SPAN; cfg.debut = ici ? (P.debut || "") : ""; cfg.local = P.local || "";
    cfg.slot = s || cfg.slot; arrives.forEach(x => delete plans[x]); change = true; }
  else if (s && cfg.slot !== s){         /* nouvelle période sans contenu préparé : même contenu, horaire habituel */
    const vieux = cfg.slot; cfg.slot = s; if (vieux){ cfg.duree = SPAN; cfg.debut = ""; if (vieux.split("|")[0] !== auj) cfg.examen = ""; } change = true; }
  if (change){ cfg.plans = plans; lastStepsKey = ""; save(); if (typeof renderStatic === "function"){ renderStatic(); tick(); } }
}
let jourPlans = "";
function openPrep() {
  appliquerPlans(); SEM0 = "";
  $("prep").hidden = false; $("ai-why").hidden = true; $("ai-note").textContent = "";
  const s = slotActif();
  const fds = [0, 6].includes(new Date().getDay());   /* fin de semaine : on prépare le prochain jour de classe */
  if (s && !fds) remplirPrep("", s.split("|")[1]); else remplirPrep(prochainJourClasse(), "am");   /* journée terminée : on prépare le prochain jour de classe */
  document.querySelector("#prep .sheet-in").scrollTop = 0;
  if (!matchMedia("(pointer: coarse)").matches && $("f-compt")) $("f-compt").focus({ preventScroll: true });   /* au toucher : pas de focus (le formulaire sautait au milieu et la liste s'ouvrait) */
  demanderCatalogue();
}
$("b-prep-cancel").onclick = () => $("prep").hidden = true;
["f-duree", "f-exam"].forEach(id => $(id).addEventListener("change", () => { const d = +$("f-duree").value || SPAN, res = $("f-opts-res"); if (res) res.textContent = (d === SPAN ? "période complète" : (DUREES.find(x => x[0] === d) || [0, d + " min"])[1]) + ($("f-exam").checked ? " · examen" : ""); }));
fermerSurFond("prep");
$("f-comp").addEventListener("change", () => { $("f-module").hidden = $("f-comp").value !== "autre"; });
$("prepForm").addEventListener("submit", e => {
  e.preventDefault();
  const k = cleSlot(JOUR_PREP, PER_PREP), duree = +$("f-duree").value || SPAN, defaut = PER_PREP === "pm" ? cfg.pmStart : cfg.amStart, debut = $("f-debut").value && $("f-debut").value !== defaut ? $("f-debut").value : "";
  if (k !== (slotActif() || cfg.slot)){   /* une autre période : on la garde, le tableau ne change pas */
    cfg.plans = cfg.plans || {};
    cfg.plans[k] = { local: LOCAL_F, prog: $("f-prog").value, comp: $("f-comp").value, module: $("f-module").value, steps: $("f-steps").value, liens: JSON.parse(JSON.stringify(LIENS_T)), examen: $("f-exam").checked, duree, debut, t: Date.now() }; if (cfg.plansSup) delete cfg.plansSup[k];
    save(); $("prep").hidden = true; peMsg("Cours " + (JOUR_PREP ? "de " + nomJour(JOUR_PREP).toLowerCase() : "d'aujourd'hui") + " " + (PER_PREP === "am" ? "matin" : "après-midi") + " enregistré : il s'affichera tout seul."); return;
  }
  cfg.slot = k; cfg.duree = duree; cfg.debut = debut; cfg.local = LOCAL_F;
  ["comp", "module", "steps", "prog"].forEach(k => cfg[k] = $("f-" + k).value);
  cfg.liens = JSON.parse(JSON.stringify(LIENS_T)); lastStepsKey = ""; setTimeout(menageFichiers, 500);
  cfg.examen = $("f-exam").checked ? jourAuj() : "";
  save(); renderStatic(); tick(); $("prep").hidden = true;
});
$("b-cancel").onclick = () => $("sheet").hidden = true;
$("b-reset").onclick = () => { cfg = { ...DEFAULTS }; openSettings(); };
$("form").addEventListener("submit", e => {
  e.preventDefault();
  ["title", "group", "msg", "amStart", "pmStart", "goals", "word", "def", "q", "a", "theme", "couleurs", "scale", "clock", "anim"].forEach(k => cfg[k] = $("f-" + k).value);
  cfg.ppe = [...$("f-ppe").querySelectorAll("input:checked")].map(i => i.value);
  save(); renderStatic(); tick(); fitSoon(); $("sheet").hidden = true;
});
fermerSurFond("sheet");
/* Aperçu du cours : le tableau dans un cadre, au jour et à l'heure du cours, avec le contenu du formulaire (pas encore enregistré) */
const MOMENTS = [["avant", "Avant le cours"], ["debut", "Début"], ["milieu", "Milieu"], ["fin", "Fin"]];
let momentApercu = "debut";
function ouvrirApercu(moment){
  momentApercu = moment || momentApercu;
  const jour = JOUR_PREP || isoJour(new Date()), d = dateIso(jour), debut = toMin($("f-debut").value || (PER_PREP === "pm" ? cfg.pmStart : cfg.amStart)), D = +$("f-duree").value || SPAN;
  const m = { avant: debut - 3, debut: debut + 12, milieu: debut + Math.round(D / 2), fin: debut + D - 4 }[momentApercu];
  const t = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, m, 0).getTime();
  const defaut = PER_PREP === "pm" ? cfg.pmStart : cfg.amStart, f = $("f-debut").value;
  const c = Object.assign({}, cfg, { prog: $("f-prog").value, comp: $("f-comp").value, module: $("f-module").value, steps: $("f-steps").value, liens: JSON.parse(JSON.stringify(LIENS_T)),
    examen: $("f-exam").checked ? d.toDateString() : "", duree: D, debut: f && f !== defaut ? f : "", slot: jour + "|" + PER_PREP, plans: {} });
  try { sessionStorage.setItem("apercu-cfg", JSON.stringify(c)); } catch(e){}
  let ov = $("apercuOv");
  if (!ov){
    ov = document.createElement("div"); ov.id = "apercuOv"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-label", "Aperçu du cours");
    ov.innerHTML = '<div class="ap-barre"><b class="ap-titre"></b><div class="ap-moments"></div><button type="button" class="btn primary ap-fermer">Fermer l\'aperçu</button></div><iframe title="Aperçu du cours"></iframe>';
    document.body.append(ov);
    ov.querySelector(".ap-fermer").onclick = () => { ov.hidden = true; ov.querySelector("iframe").src = "about:blank"; };
    MOMENTS.forEach(([k, n]) => { const b = document.createElement("button"); b.type = "button"; b.dataset.m = k; b.textContent = n; b.onclick = () => ouvrirApercu(k); ov.querySelector(".ap-moments").append(b); });
  }
  ov.querySelector(".ap-titre").textContent = "Aperçu · " + (JOUR_PREP ? nomJour(jour) : "Aujourd'hui") + ", " + NOM_PER[PER_PREP] + " · " + fmt(m);
  ov.querySelectorAll(".ap-moments button").forEach(b => b.classList.toggle("on", b.dataset.m === momentApercu));
  ov.querySelector("iframe").src = location.pathname + "?apercu=1&t=" + t;
  ov.hidden = false;
}
$("b-apercuCours").onclick = () => ouvrirApercu("debut");
["f-duree", "f-debut"].forEach(id => $(id).addEventListener("change", preview));   /* la compétence choisie dans le formulaire, même pas encore affichée */

// Révéler la réponse
function toggleAnswer() { const a = $("v-a"); a.hidden = !a.hidden; if (!a.hidden) { const q = rotCards().findIndex(el => el.dataset.w === "question"); if (q >= 0) showRot(q); } $("b-reveal").textContent = a.hidden ? "Révéler la réponse" : "Cacher la réponse"; }
$("b-reveal").onclick = toggleAnswer;

// Plein écran (fonctionne seul, dans la bibliothèque ou dans une page qui intègre le tableau)
let peParent = false;     // vrai quand c'est la page parente qui a mis le tableau en plein écran
function peMsg(t) {
  let el = document.getElementById("pe-msg");
  if (!el) { el = document.createElement("div"); el.id = "pe-msg"; el.setAttribute("role", "status");
    el.style.cssText = "position:fixed;left:50%;top:18px;translate:-50% 0;z-index:99;background:#1c2330;color:#fff;font:600 16px 'Segoe UI',Arial,sans-serif;padding:12px 18px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.3);max-width:90vw;text-align:center";
    document.body.append(el); }
  el.textContent = t; el.hidden = false; clearTimeout(peMsg.t); peMsg.t = setTimeout(() => el.hidden = true, 5000);
}
function peEtat() {
  const on = !!(document.fullscreenElement || document.webkitFullscreenElement) || peParent;
  const b = $("b-full"); b.lastChild.textContent = on ? "Quitter le plein écran" : "Plein écran";
}
function peDemanderParent() {
  if (window.parent === window) { peMsg("Plein écran indisponible ici. Appuie sur F11 (ou fn + F11)."); return; }
  try { window.parent.postMessage({ type: "accueil-plein-ecran" }, "*"); } catch (e) {}
  clearTimeout(peDemanderParent.t);
  peDemanderParent.t = setTimeout(() => peMsg("Plein écran indisponible ici. Appuie sur F11 (ou fn + F11)."), 1200);
}
function full() {
  const el = document.documentElement;
  if (document.fullscreenElement || document.webkitFullscreenElement) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
  /* dans la bibliothèque, c'est la page entière qui passe en plein écran : on le garde en ouvrant un livre */
  if (peParent || window.EN_BIBLIO) { try { window.parent.postMessage({ type: "accueil-plein-ecran" }, "*"); } catch (e) {} return; }
  const req = el.requestFullscreen || el.webkitRequestFullscreen;
  const ok = (document.fullscreenEnabled || document.webkitFullscreenEnabled) && req;
  if (!ok) { peDemanderParent(); return; }
  try { const p = req.call(el); if (p && p.catch) p.catch(peDemanderParent); } catch (e) { peDemanderParent(); }
}
window.addEventListener("message", e => {
  const d = e.data || {};
  if (d.type === "accueil-plein-ecran-etat") { clearTimeout(peDemanderParent.t); peParent = !!d.on; peEtat(); fitSoon(); if (d.ok === false) peMsg("Plein écran indisponible ici. Appuie sur F11 (ou fn + F11)."); }
});
document.addEventListener("fullscreenchange", peEtat); document.addEventListener("webkitfullscreenchange", peEtat);
$("b-full").onclick = full;
// Ouvert depuis la bibliothèque : bouton « Bibliothèque » dans la barre du haut (au lieu d'un bouton flottant)
// (la bibliothèque se signale avec un message « accueil-biblio » ; ailleurs, le bouton reste caché)
window.addEventListener("message", e => {
  if (e.source !== window.parent || !e.data || e.data.type !== "accueil-biblio") return;
  window.EN_BIBLIO = true; const bb = $("b-biblio"); bb.hidden = false; $("b-wb").hidden = false;
  bb.onclick = () => { try { window.parent.postMessage({ type: "accueil-fermer" }, "*"); } catch (er) {} };
});

// Livre resté ouvert dans la bibliothèque : un clic pour y revenir (même page)
function revenirLivre(){ try { window.parent.postMessage({ type: "accueil-revenir" }, "*"); } catch (e) {} }
$("b-livre").onclick = revenirLivre;
/* tableau blanc : s'ouvre dans la bibliothèque; son bouton « Tableau de bord » ramène ici, et « Revenir au tableau blanc » y retourne */
function ouvrirTableauBlanc(){ if (!window.EN_BIBLIO) return; try { window.parent.postMessage({ type: "accueil-ouvrir", contenu: { type: "tableau" } }, "*"); } catch (e) {} }
$("b-wb").onclick = ouvrirTableauBlanc;
document.addEventListener("keydown", e => { if ((e.key === "b" || e.key === "B") && !e.ctrlKey && !e.metaKey && !e.altKey && !/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName || "") && !e.target.isContentEditable && !$("b-wb").hidden) ouvrirTableauBlanc(); });
window.addEventListener("message", e => {
  if (e.source !== window.parent || !e.data || e.data.type !== "accueil-livre") return;
  const l = e.data.livre, b = $("b-livre");
  b.hidden = !l; if (window.EN_BIBLIO) $("b-wb").hidden = !!(l && l.wb);   /* « Revenir au tableau blanc » remplace alors le bouton Tableau blanc */
  if (l) { const t = $("b-livre-t"); t.textContent = l.wb ? "Revenir au tableau blanc" : "Revenir au livre";
    if (!l.wb && l.page) { const sm = document.createElement("small"); sm.textContent = "· p. " + l.page; t.append(" ", sm); }
    b.title = (l.wb ? "Revenir au tableau blanc" : "Revenir à « " + l.titre + " »" + (l.page ? ", page " + l.page : "")) + " (L)"; }
  fitSoon && fitSoon();
});

document.addEventListener("keydown", e => { if (e.key === "Escape" && fermerVideo()) e.stopImmediatePropagation(); }, true);
document.addEventListener("keydown", e => {
  if (!$("sheet").hidden || !$("prep").hidden || !$("keys").hidden || e.target.matches("input, textarea, select")) { if (e.key === "Escape") { $("sheet").hidden = true; $("prep").hidden = true; $("keys").hidden = true; } return; }
  if (e.key === "?") { $("keys").hidden = false; return; }
  if (e.key === "Escape") closeMenu();
  if (e.key === "Escape") setEditing(false);
  if (e.key === "f" || e.key === "F") full();
  if (e.key === "+" || e.key === "=" || e.key === "-" || e.key === "0") {
    const cur = +cfg.scale > 0 ? +cfg.scale : +getComputedStyle(document.documentElement).getPropertyValue("--fit") || 1;
    cfg.scale = e.key === "0" ? "auto" : Math.min(2, Math.max(0.5, Math.round((cur + (e.key === "-" ? -0.05 : 0.05)) * 100) / 100)).toString();
    save(); fit();
  }
  if (e.key === "r" || e.key === "R") toggleAnswer();
  if ((e.key === "l" || e.key === "L") && !$("b-livre").hidden) revenirLivre();
  if ((e.key === "o" || e.key === "O") && !$("v-go").hidden) $("v-go").click();
  if (/^[2-4]$/.test(e.key)) { const bs = [...$("v-go").parentNode.querySelectorAll(".now-go:not([hidden])")]; if (bs[+e.key - 1]) bs[+e.key - 1].click(); }   /* O = ouvrir le contenu de l'activité en cours */
});

// Boutons qui s'effacent quand la souris ne bouge pas
let idle;
function wake() { $("tools").classList.remove("idle"); clearTimeout(idle); idle = setTimeout(() => { if (!document.body.classList.contains("editing") && $("comppick").hidden && $("menu").hidden) $("tools").classList.add("idle"); }, 4000); }
["mousemove", "touchstart", "keydown"].forEach(ev => document.addEventListener(ev, wake, { passive: true }));
wake();

// Garder l'écran allumé
async function keepAwake() { try { if (navigator.wakeLock) await navigator.wakeLock.request("screen"); } catch (e) {} }
keepAwake();
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") keepAwake(); });

$("f-duree").innerHTML = DUREES.map(([v, n]) => '<option value="' + v + '">' + n + '</option>').join("");
function heuresDebut(v){ const L = []; for (let m = 7 * 60; m <= 21 * 60; m += 5) L.push(m); [cfg.amStart, cfg.pmStart, v].forEach(t => { if (t && /\d/.test(t)) { const m = toMin(t); if (!L.includes(m)) L.push(m); } }); L.sort((a, b) => a - b);
  $("f-debut").innerHTML = L.map(m => '<option value="' + String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0") + '">' + fmt(m) + '</option>').join(""); $("f-debut").value = v; }
appliquerPlans();
renderStatic(); tick(); setInterval(tick, 1000);
/* Téléphone : la frise défile toute seule jusqu'à l'activité en cours (si on ne vient pas de la faire défiler soi-même) */
(function(){ let dernier = null, touche = 0; const w = () => document.querySelector(".tl-wrap");
  document.addEventListener("scroll", e => { if (e.target && e.target.classList && e.target.classList.contains("tl-wrap")) touche = Date.now(); }, true);
  setInterval(() => { const wrap = w(); if (!wrap || wrap.scrollWidth <= wrap.clientWidth + 4 || Date.now() - touche < 15000) return; const now = wrap.querySelector(".seg.now");
    if (now && now !== dernier){ dernier = now; wrap.scrollTo({ left: Math.max(0, now.offsetLeft - 24), behavior: "smooth" }); } }, 2000);
})();
setInterval(() => { const s = slotActif() || isoJour(new Date()); if (s !== jourPlans){ jourPlans = s; appliquerPlans(); } }, 30000);
