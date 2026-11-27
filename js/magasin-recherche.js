/* © 2026 Jérémy Raymond. Métier+ — recherche du magasin de raccords (26 nov.)
   Jeremy : « plus de synonymes, plus intelligente, plus facile; ça doit comprendre ce que l'élève veut ».
   - comprend les anglicismes et les mots de chantier (elbow, ty, nipple, sweat, MIP…) et les synonymes dans les deux sens;
   - comprend les mesures écrites de toutes les façons : 3/4, ¾, 0.75, 1-1/2, 1.5, 3x2, 2", 2 po, 90°;
   - pardonne les fautes de frappe (cuode → coude, adaptatuer → adaptateur);
   - ignore les petits mots (« je cherche un coude de 3/4 pour du cuivre »);
   - classe les meilleurs résultats en premier; si aucun raccord n'a tous les mots, montre les plus proches. */
window.RechercheMag = (() => {
  const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const VIDES = new Set("je j tu il on veux voudrais besoin cherche cherch trouve trouver svp stp merci un une des de du d l la le les au aux a pour avec en et ou sur dans mon ma mes ton ta un pis genre type sorte ca c est quoi".split(" "));
  /* groupes de mots équivalents (dans les deux sens) */
  const GROUPES = [
    "coude elbow ell elb coudes", "te tee ty t tees", "y wye", "croix cross", "bague manchon coupling coupleur coupler sleeve sleave union",
    "reducteur reduit reduction bushing reducer reducing", "adaptateur adapter adapteur adaptor", "bouchon cap capuchon plug", "mamelon nipple nipples nip",
    "bride flange", "robinet valve vanne valves", "clapet check antiretour anti-retour", "soupape relief surete", "siphon trap ptrap",
    "regard cleanout nettoyage", "renvoi drain avaloir", "support hanger strap clamp attache collier crochet", "tuyau tube pipe tuyaux tubes",
    "joint garniture seal gasket", "boyau hose flexible", "purgeur aerateur event vent", "manometre jauge gauge", "thermometre thermometer",
    "toilette toilet bol wc", "evier lavabo sink", "ecrou nut", "rondelle washer rondelles", "vis screw screws", "boulon bolt boulons bolts",
    "ruban tape", "teflon teflon", "pate dope scellant", "gicleur buse nozzle", "fondant flux", "brasure solder", "chalumeau torche torch",
    "pompe circulateur circulatrice pump", "filtre crepine strainer", "electrode baguette baguettes rod", "meule disque",
    "cuivre copper cu", "acier noir black steel", "laiton brass bronze", "galvanise galv galvanisee galvanized", "inox stainless inoxydable",
    "fonte cast", "plastique plastic", "pex-a pex uponor propex expansion", "souder sweat ss soude soudure", "filete thread threaded npt filet fileté",
    "evase flare", "compression comp", "insertion barb cannele", "f femelle female fip fpt fnpt", "m male mip mpt mnpt",
    "regulateur reducteur-pression prv", "chauffe-eau reservoir", "reservoir tank", "mj no-hub nohub sans-emboitement", "bille ball",
    "robinet-vanne gate", "soupape globe", "arret stop", "angle equerre", "alimentation supply"
  ].map(g => g.split(" "));
  const SYN = {}; GROUPES.forEach(L => L.forEach(k => { SYN[k] = (SYN[k] || []).concat(L.filter(x => x !== k)); }));
  /* expressions de plusieurs mots, remplacées avant de couper la recherche en mots */
  const EXPR = [[/\bball valves?\b/g, "robinet bille"], [/\bcheck valves?\b/g, "clapet"], [/\bgate valves?\b/g, "robinet-vanne"], [/\bglobe valves?\b/g, "soupape"],
    [/\brelief valves?\b|\bt ?& ?p\b|\bt-p\b/g, "soupape surete"], [/\bzone valves?\b|\bvanne de zone\b/g, "robinet moteur"], [/\bp[- ]?trap\b/g, "siphon"],
    [/\bclean ?out\b/g, "regard"], [/\bno[- ]?hub\b|\bsans emboitement\b/g, "mj"], [/\bcast iron\b/g, "fonte"], [/\bpex[- ]a\b/g, "pex-a"],
    [/\ba souder\b|\bsoude\b/g, "souder"], [/\bexpansion tank\b|\breservoir d'?expansion\b/g, "reservoir expansion"], [/\bstreet\b/g, ""],
    [/\bchauffe[- ]eau\b|\bhot water tank\b/g, "chauffe-eau"], [/\bteflon tape\b/g, "ruban teflon"], [/\bpipe dope\b/g, "pate"]];
  const FRAC = { "0.125":"1/8", ".125":"1/8", "0.25":"1/4", ".25":"1/4", "0.375":"3/8", ".375":"3/8", "0.5":"1/2", ".5":"1/2", "0.75":"3/4", ".75":"3/4",
    "1.25":"1-1/4", "1.5":"1-1/2", "2.5":"2-1/2", "3.5":"3-1/2" };
  const ANGLES = new Set(["90", "45", "22", "22-1/2", "11", "60"]);
  /* mesures : « 1 1/2 », « 1-1/2 », « 1.5 », « 1½ » → « 1-1/2 » (un seul mot) */
  const mesures = s => s.replace(/¼/g, " 1/4").replace(/½/g, " 1/2").replace(/¾/g, " 3/4").replace(/⅛/g, " 1/8").replace(/⅜/g, " 3/8")
    .replace(/(^|[^\d.])(\d*\.\d+)(?![\d/])/g, (m, a, n) => a + (FRAC[n] || n))
    .replace(/(\d)\s*[x×*]\s*(?=\d)/g, "$1 ")
    .replace(/(\d)\s*(?:"|''|po\b|pouces?\b|inch(?:es)?\b|in\b)/g, "$1 ").replace(/(\d)\s*(?:°|deg(?:re|res|rees)?\b)/g, "$1 ")
    .replace(/(\d+)\s*-?\s+(\d+\/\d+)/g, "$1-$2").replace(/(\d+)-(\d+\/\d+)/g, "$1-$2");
  const lev = (a, b, max) => { if (Math.abs(a.length - b.length) > max) return max + 1; let p = Array.from({ length:b.length + 1 }, (_, i) => i), pp = null;
    for (let i = 1; i <= a.length; i++){ const c = [i]; let mn = i; for (let j = 1; j <= b.length; j++){ c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1] && pp) c[j] = Math.min(c[j], pp[j - 2] + 1);   /* lettres inversées = 1 faute */ mn = Math.min(mn, c[j]); } if (mn > max) return max + 1; pp = p; p = c; } return p[b.length]; };
  let CAT = [], VOC = [], VOCS = new Set();
  function preparer(L){ CAT = L || []; const V = new Map();
    CAT.forEach(a => { const t = mesures(norm([a.nom, a.type, a.mat, a.n].join(" "))); a._rt = t; a._rw = t.split(/[\s,()'"#&]+/).filter(Boolean);
      a._rd = String(a.d || "").trim().replace(/\s+/g, "-"); a._rt0 = norm(String(a.nom || "").split(" ")[0]);
      a._rw.forEach(w => { if (/^[a-z]/.test(w)) V.set(w, (V.get(w) || 0) + 1); }); });
    VOC = [...V.keys()]; VOCS = new Set(VOC); }
  /* mot inconnu → mot du catalogue le plus proche (fautes de frappe) */
  const corriger = w => { if (w.length < 4 || /\d/.test(w) || VOC.some(v => v.startsWith(w)) || SYN[w]) return null;
    const max = w.length <= 5 ? 1 : 2; let best = null, bd = max + 1;
    for (const v of VOC) { if (Math.abs(v.length - w.length) > max) continue; const d = lev(w, v, max); if (d < bd || (d === bd && best && v.length < best.length)) { bd = d; best = v; } }
    return bd <= max ? best : null; };
  const variantes = w => { const sg = w.length > 3 && /[sx]$/.test(w) ? w.slice(0, -1) : w; return [...new Set([w, sg, ...(SYN[w] || []), ...(SYN[sg] || [])])]; };
  const motDans = (a, x) => x.length <= 2 ? a._rw.includes(x) : (a._rw.some(w => w.startsWith(x)) || (x.length > 4 && a._rt.includes(x)));   /* « F », « M », « té » : mot exact */
  /* recherche : { L : raccords classés, proche : vrai si aucun n'a tous les mots, corr : [[mot tapé, mot compris]] } */
  function chercher(q, filtre){
    let s = mesures(norm(q)); EXPR.forEach(([r, x]) => { s = s.replace(r, x); });
    const corr = [], mots = s.split(/[\s,;+]+/).map(w => w.replace(/^[-.]+|[-.]+$/g, "")).filter(w => w && !VIDES.has(w)).map(w => { const c = corriger(w); if (c) { corr.push([w, c]); return c; } return w; });
    const base = CAT.filter(a => !filtre || filtre(a));
    if (!mots.length) return { L:base, proche:false, corr };
    const R = base.map(a => { let n = 0, sc = 0;
      for (const w of mots){
        if (/^\d+([-/]\d+)*(\/\d+)?$/.test(w) && !ANGLES.has(w)) { if (a._rd === w) { n++; sc += 4; } else if (a._rw.includes(w)) { n++; sc += 2; } continue; }   /* un nombre = un diamètre */
        if (ANGLES.has(w)) { if (a._rw.includes(w) || a._rw.some(x => x.startsWith(w + "-"))) { n++; sc += 2; } else if (a._rd === w) { n++; sc += 3; } continue; }
        const V = variantes(w); let ok = 0; for (let k = 0; k < V.length; k++) { const x = V[k]; if (motDans(a, x)) { ok = x === w ? 3 : 2.5 - k * .1; if (a._rt0.startsWith(x)) ok += 2; break; } }   /* le synonyme le plus proche compte plus */
        if (ok) { n++; sc += ok; } }
      return [a, n, sc]; });
    const tous = R.filter(r => r[1] === mots.length);
    const tri = (x, y) => y[2] - x[2] || String(x[0].nom).length - String(y[0].nom).length || String(x[0].nom).localeCompare(String(y[0].nom), "fr", { numeric:true });
    if (tous.length) return { L:tous.sort(tri).map(r => r[0]), proche:false, corr };
    const mx = Math.max(0, ...R.map(r => r[1])); if (!mx) return { L:[], proche:false, corr };
    return { L:R.filter(r => r[1] === mx).sort(tri).map(r => r[0]), proche:true, corr };
  }
  return { preparer, chercher, norm, mesures };
})();
