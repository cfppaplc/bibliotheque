/* 27 nov. (Jeremy : « ça doit être plus simple et se mettre à jour seul ») :
   la liste publique des codes des élèves (registre partagé, lue par le magasin et Ma carte) se republie toute seule
   dès qu'un enseignant connecté ouvre Métier+ (bibliothèque, accueil, page Commandes), au plus aux 10 minutes.
   Source = le registre de formation reçu du coffre (toujours la version la plus récente), jamais la copie de cet appareil.
   On ne change que les codes, les groupes et les prénoms chiffrés; le reste du registre public (partages, suivi, formes) est gardé.
   Rien n'est publié si le coffre ne répond pas ou si le registre reçu n'a aucun élève. */
(function(){
  const API = "https://kjlotlhqrgekzohshmbn.supabase.co/rest/v1/rpc/", CLE = "sb_publishable_1C-o-75sf7havBRmUWA8aQ_gcEW4sRY", te = new TextEncoder();
  const hex = async s => [...new Uint8Array(await crypto.subtle.digest("SHA-256", te.encode(s)))].map(b => b.toString(16).padStart(2, "0")).join("");
  const rpc = async (f, a) => { const r = await fetch(API + f, { method:"POST", signal:(self.AbortSignal && AbortSignal.timeout) ? AbortSignal.timeout(20000) : undefined, headers:{ apikey:CLE, "Content-Type":"application/json" }, body:JSON.stringify(a) }); if (!r.ok) throw new Error("registre " + r.status); const t = await r.text(); return t ? JSON.parse(t) : null; };
  const prenom = p => String(p || "").trim().split(/\s+/)[0].slice(0, 20);
  async function nomChiffre(e){ const k = await crypto.subtle.importKey("raw", await crypto.subtle.digest("SHA-256", te.encode("metier+|carte|" + e.c + "|" + e.k)), "AES-GCM", false, ["encrypt"]);
    const iv = crypto.getRandomValues(new Uint8Array(12)), ct = new Uint8Array(await crypto.subtle.encrypt({ name:"AES-GCM", iv }, k, te.encode(prenom(e.p))));
    return btoa(String.fromCharCode(...iv, ...ct)); }

  async function maj(force){
    if (!window.COFFRE || !COFFRE.recevoir) return "pas de coffre";
    try { if (!force && Date.now() - (+localStorage.getItem("registreAutoT") || 0) < 6e5) return "récent"; } catch(e){}
    let cloud; try { cloud = await COFFRE.recevoir("passeport"); } catch(e){ return "pas de session"; }
    const s = await COFFRE.session(); if (!s || s.eleve || !cloud || !cloud.v) return "rien";
    let D; try { D = JSON.parse(cloud.v.passeportOutils || "null"); } catch(e){} const j = cloud.v.passPartageJeton;
    if (!D || !D.el || !j) return "rien";
    const E = Object.values(D.el).filter(e => e && !e.x && e.c && e.g && e.g !== "À classer"); if (!E.length) return "vide";
    const id = await hex("metier+|partage-passeport|" + s.id), r = await rpc("coffre_lire", { p_id:id }), row = r && r[0];
    let pub = {}; try { pub = row && row.data ? JSON.parse(row.data) : {}; } catch(e){}
    const efface = g => D.grp && D.grp[g] && D.grp[g].x;
    const grp = [...new Set([...(pub.grp || []), ...E.map(e => e.g)])].filter(g => g !== "À classer" && !efface(g));
    const codes = {}; grp.forEach(g => codes[g] = []); E.forEach(e => { if (codes[e.g] && !codes[e.g].includes(e.c)) codes[e.g].push(e.c); });
    const noms = {}; for (const e of E) if (codes[e.g] && e.k && prenom(e.p)) { try { noms[e.c] = await nomChiffre(e); } catch(x){} }
    const sig = JSON.stringify([grp, codes, Object.keys(noms).sort()]), avant = JSON.stringify([pub.grp || [], pub.codes || {}, Object.keys(pub.noms || {}).sort()]);
    try { localStorage.setItem("registreAutoT", String(Date.now())); } catch(e){}
    if (sig === avant) return "à jour";
    const data = Object.assign({}, pub, { grp, codes, noms, t:Date.now() });
    if (await rpc("coffre_ecrire", { p_id:id, p_jeton:j, p_env:"public", p_data:JSON.stringify(data) }) !== true) return "refus";
    return "publié";
  }
  window.REGISTRE_AUTO = { maj };
  const go = () => setTimeout(() => maj().catch(() => {}), 4000);   /* après le premier affichage : rien ne ralentit la page */
  if (document.readyState === "complete") go(); else addEventListener("load", go);
})();
