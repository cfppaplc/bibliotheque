/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — acces.js (sorti d'index.html le 15 nov.) */
/* =====================================================================
   Accès protégé — comptes enseignants et livres chiffrés (29 oct. 2026)
   - comptes.json (public) : { v, comptes:{ id:{ nom, pub(JWK RSA-OAEP), priv:{s,i,c}, admin } }, livres:{ fichier:{ cles:{ id: clé AES enveloppée } } } }
   - livres/<fichier>.chiffre = iv(12 octets) + AES-GCM(gzip(html));  recherche/<fichier>.chiffre = idem (JSON des pages)
   - Le mot de passe ne quitte jamais l'ordinateur : il déverrouille la clé privée, qui ouvre la clé de chaque livre permis.
   - Session : la clé privée (non exportable) est gardée dans IndexedDB « acces » de cet ordinateur.
   ===================================================================== */
window.ACCES = (function(){
  const sub = crypto.subtle, enc = new TextEncoder(), dec = new TextDecoder();
  const b64 = buf => { const u = new Uint8Array(buf); let s = ""; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s); };
  const unb64 = s => { const b = atob(s), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; };
  const ITER = 250000;
  const b64u = u => b64(u).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const unb64u = t => unb64(t.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((t.length + 3) % 4));
  const EC = { name:"ECDH", namedCurve:"P-256" };
  /* clé d'un livre pour un compte « EC » (comptes créés depuis le 29 oct. au soir, code de demande court) : ECDH éphémère + AES-GCM */
  async function cleEC(prive, pubBrute){ const bits = await sub.deriveBits({ name:"ECDH", public:await sub.importKey("raw", pubBrute, EC, false, []) }, prive, 256);
    return sub.importKey("raw", await sub.digest("SHA-256", bits), "AES-GCM", false, ["encrypt", "decrypt"]); }
  async function envelopperPour(brut, pubJwk){
    if (pubJwk.kty === "EC"){ const eph = await sub.generateKey(EC, true, ["deriveBits"]), pubC = await sub.importKey("jwk", { kty:"EC", crv:"P-256", x:pubJwk.x, y:pubJwk.y, ext:true }, EC, true, []);
      const raw = new Uint8Array(await sub.exportKey("raw", pubC)), k = await cleEC(eph.privateKey, raw), iv = crypto.getRandomValues(new Uint8Array(12));
      const c = new Uint8Array(await sub.encrypt({ name:"AES-GCM", iv }, k, brut)), e = new Uint8Array(await sub.exportKey("raw", eph.publicKey));
      const out = new Uint8Array(65 + 12 + c.length); out.set(e); out.set(iv, 65); out.set(c, 77); return "E" + b64(out); }
    const pk = await sub.importKey("jwk", Object.assign({}, pubJwk, { alg:"RSA-OAEP-256", ext:true }), { name:"RSA-OAEP", hash:"SHA-256" }, false, ["encrypt"]);
    for (;;){ const s = b64(await sub.encrypt({ name:"RSA-OAEP" }, pk, brut)); if (s[0] !== "E") return s; } }   /* une enveloppe RSA ne doit jamais commencer par « E » (marque des enveloppes EC) */
  async function ouvrirEnveloppe(env){          /* clé brute d'un livre, avec la clé privée de la session (RSA ou EC) */
    if (env[0] === "E"){ const u = unb64(env.slice(1)), k = await cleEC(SESSION.priv, u.subarray(0, 65)); return sub.decrypt({ name:"AES-GCM", iv:u.subarray(65, 77) }, k, u.subarray(77)); }
    return sub.decrypt({ name:"RSA-OAEP" }, SESSION.priv, unb64(env)); }
  let DATA = null, SESSION = null;            /* SESSION = { id, nom, admin, priv:CryptoKey } */
  const CLES = {};                            /* fichier -> CryptoKey AES (déverrouillées) */

  /* ---- petite base IndexedDB pour garder la session ---- */
  const idb = () => new Promise((ok, ko) => { const r = indexedDB.open("acces", 1); r.onupgradeneeded = () => r.result.createObjectStore("s"); r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error); });
  const idbGet = async k => { const d = await idb(); return new Promise(ok => { const t = d.transaction("s").objectStore("s").get(k); t.onsuccess = () => ok(t.result); t.onerror = () => ok(null); }); };
  const idbSet = async (k, v) => { const d = await idb(); return new Promise(ok => { const t = d.transaction("s", "readwrite"); v === undefined ? t.objectStore("s").delete(k) : t.objectStore("s").put(v, k); t.oncomplete = () => ok(); t.onerror = () => ok(); }); };

  const cleMdp = async (mdp, sel) => sub.deriveKey({ name:"PBKDF2", salt:sel, iterations:ITER, hash:"SHA-256" },
    await sub.importKey("raw", enc.encode(mdp), "PBKDF2", false, ["deriveKey"]), { name:"AES-GCM", length:256 }, false, ["encrypt", "decrypt"]);
  const gunzip = async u => new Uint8Array(await new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer());

  let estPret = false, finPret; const pret = new Promise(r => finPret = r);
  async function charger(){
    try { const r = await fetch("comptes.json?t=" + Date.now(), { cache:"no-store" }); DATA = r.ok ? await r.json() : null; } catch(e){ DATA = null; }
    if (!DATA) try { DATA = JSON.parse(localStorage.getItem("accesCopie") || "null"); } catch(e){}          /* hors ligne : dernière copie */
    else try { localStorage.setItem("accesCopie", JSON.stringify(DATA)); } catch(e){}
    try { const s = await idbGet("session"); if (s && DATA && DATA.comptes[s.id]) SESSION = Object.assign(s, { nom:DATA.comptes[s.id].nom, admin:!!DATA.comptes[s.id].admin, eleve:!!DATA.comptes[s.id].eleve }); } catch(e){}
    estPret = true; finPret(); majBouton(); try { render(); } catch(e){}
    /* 26 nov. (Jeremy : « sur la carte, un bouton Mes livres pourrait donner accès à ses livres ») : index.html?macarte → entrée avec Ma carte */
    if (/[?&]macarte\b/.test(location.search)) { try { history.replaceState(null, "", location.pathname); } catch(e){}
      if (!SESSION) setTimeout(() => { dlgConnexion(); setTimeout(() => { const mc = document.getElementById("acMaCarte"); if (mc) mc.click(); }, 120); }, 300); }
    relancerDemande(); compterDemandes();
  }
  let NB_DEM = 0;
  async function compterDemandes(){ if (!SESSION || !SESSION.admin) return; const v = await lireBoite(); NB_DEM = Object.keys(v || {}).filter(id => !DATA.comptes[id]).length;
    majBouton(); }
  const protege = f => !!(DATA && DATA.livres && DATA.livres[f]);
  let VOIR = null;   /* 25 nov. : « Voir comme » (admin) : la bibliothèque montre les accès de ce compte */
  const permis = f => !!(SESSION && protege(f) && DATA.livres[f].cles[VOIR || SESSION.id]);
  const verrouille = f => protege(f) && !permis(f);

  async function cleLivre(f){
    if (CLES[f]) return CLES[f];
    if (!SESSION) throw new Error("connexion requise");
    const env = DATA.livres[f] && DATA.livres[f].cles[SESSION.id]; if (!env) throw new Error("ce livre ne t'est pas permis");
    const brut = await ouvrirEnveloppe(env);
    return CLES[f] = await sub.importKey("raw", brut, "AES-GCM", false, ["decrypt"]);
  }
  async function dechiffrer(url, f, frais){
    const r = await fetch(frais ? url + "?frais=" + Date.now() : url, { cache:"no-cache" }); if (!r.ok) throw new Error("fichier introuvable (" + r.status + ")");
    const u = new Uint8Array(await r.arrayBuffer()), k = await cleLivre(f);
    let clair;
    try { clair = await sub.decrypt({ name:"AES-GCM", iv:u.subarray(0, 12) }, k, u.subarray(12)); }
    catch(e){ if (!frais) return dechiffrer(url, f, true); throw e; }   /* copie gardée d'une ancienne version du livre : on reprend celle du site */
    return dec.decode(await gunzip(new Uint8Array(clair)));
  }
  /* 12 nov. : les 2 derniers livres ouverts restent déchiffrés en mémoire (pas sur le disque) : les rouvrir ne refait ni le téléchargement ni le déchiffrement */
  const MEMO = new Map();
  /* PDF des livres pour imprimer (15 nov.) : administrateur seulement; pdf/<f>.chiffre = iv(12) + AES-GCM(pdf), clé enveloppée pour les admins dans pdf/cles.json */
  let PDFCLES = null;
  const pdfCles = async () => PDFCLES || (PDFCLES = fetch("pdf/cles.json?t=" + Date.now(), { cache:"no-store" }).then(r => r.ok ? r.json() : {}).catch(() => ({})));
  const pdfDispo = async f => { if (!SESSION || !SESSION.admin) return false; const C = await pdfCles(); return !!(C[f] && C[f][SESSION.id]); };
  const pdfTelecharger = async (f, titre) => {
    const C = await pdfCles(), env = C[f] && C[f][SESSION.id]; if (!env) throw new Error("pas de PDF");
    const k = await sub.importKey("raw", await ouvrirEnveloppe(env), "AES-GCM", false, ["decrypt"]);
    const r = await fetch("pdf/" + encodeURIComponent(f) + ".chiffre", { cache:"no-cache" }); if (!r.ok) throw new Error("introuvable");
    const u = new Uint8Array(await r.arrayBuffer()), pdf = await sub.decrypt({ name:"AES-GCM", iv:u.subarray(0, 12) }, k, u.subarray(12));
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([pdf], { type:"application/pdf" }));
    a.download = (titre || f).replace(/[\\/:*?"<>|]+/g, "") + ".pdf"; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000); };
  const ouvrir = async l => { const f = l.fichier; if (MEMO.has(f)){ const h = MEMO.get(f); MEMO.delete(f); MEMO.set(f, h); return h; }
    const h = await dechiffrer("livres/" + encodeURIComponent(f) + ".chiffre", f); MEMO.set(f, h); while (MEMO.size > 2) MEMO.delete(MEMO.keys().next().value); return h; };
  async function recherche(){            /* pages des livres permis, pour la recherche plein texte */
    const out = {}; if (!SESSION || !DATA) return out;
    await Promise.all(Object.keys(DATA.livres).filter(permis).map(async f => { try { out[f] = JSON.parse(await dechiffrer("recherche/" + encodeURIComponent(f) + ".chiffre", f)); } catch(e){} }));
    return out;
  }

  async function connexion(id, mdp){
    id = (id || "").trim().toLowerCase();
    try { const r = await fetch("comptes.json?t=" + Date.now(), { cache:"no-store" }); if (r.ok){ DATA = await r.json(); try { localStorage.setItem("accesCopie", JSON.stringify(DATA)); } catch(e){} } } catch(e){}   /* compte accepté ou mot de passe changé depuis l'ouverture de la page : pas besoin de la recharger */
    const c = DATA && DATA.comptes[id];
    if (!c) throw new Error("Identifiant inconnu. Si tu viens de faire ta demande, attends que Jeremy l'accepte.");
    let pk8;
    try { pk8 = await sub.decrypt({ name:"AES-GCM", iv:unb64(c.priv.i) }, await cleMdp(mdp, unb64(c.priv.s)), unb64(c.priv.c)); }
    catch(e){ throw new Error("Mot de passe incorrect."); }
    const priv = c.pub.kty === "EC" ? await sub.importKey("jwk", { kty:"EC", crv:"P-256", x:c.pub.x, y:c.pub.y, d:b64u(new Uint8Array(pk8)), ext:false }, EC, false, ["deriveBits"])
      : await sub.importKey("pkcs8", pk8, { name:"RSA-OAEP", hash:"SHA-256" }, false, ["decrypt", "unwrapKey"]);
    await ouvrirSession(id, priv);
    try { const M = (await idbGet("memo")) || {}; M[id] = { priv, emp:empreinte(c) }; await idbSet("memo", M); memoIds(Object.keys(M)); } catch(e){}
  }
  /* 25 nov. (Jeremy : « comme sur Facebook, les comptes déjà connectés sur cet appareil, sans redemander le mot de passe ») :
     la clé déverrouillée de chaque compte reste sur l'appareil (IndexedDB « memo »; le mot de passe, lui, n'est jamais gardé).
     Un mot de passe changé par l'admin change la clé publique : l'empreinte ne correspond plus et le mot de passe est redemandé une fois. */
  const empreinte = c => JSON.stringify(c.pub).slice(-32);
  const memoIds = L => { try { localStorage.setItem("comptesMemo", JSON.stringify(L)); } catch(e){} };
  const memoListe = () => { try { return JSON.parse(localStorage.getItem("comptesMemo") || "[]") || []; } catch(e){ return []; } };
  async function ouvrirSession(id, priv){
    const c = DATA.comptes[id];
    SESSION = { id, nom:c.nom, admin:!!c.admin, eleve:!!c.eleve, priv };
    await idbSet("session", { id, priv });
    for (const k in CLES) delete CLES[k];
    try { INDEX_TEXTE = null; } catch(e){}
    try { localStorage.setItem("dernierId", id); localStorage.setItem("dernierNom", c.nom || "");
      const R = (JSON.parse(localStorage.getItem("comptesRecents") || "[]") || []).filter(x => x && x.id !== id); R.unshift({ id, nom:c.nom || "" }); localStorage.setItem("comptesRecents", JSON.stringify(R.slice(0, 8))); } catch(e){}
    majBouton(); try { render(); } catch(e){} compterDemandes();
  }
  /* ---- 25 nov. (Jeremy : « l'élève entre avec sa carte ») : la carte MP-<code>-<clé> ouvre le compte de son groupe ----
     L'administrateur remet à chaque carte une copie de la clé du compte de groupe, chiffrée avec la clé de la carte (table coffre).
     Seul celui qui a la carte peut l'ouvrir; une nouvelle carte efface l'ancienne copie. */
  const hexC = async t => [...new Uint8Array(await sub.digest("SHA-256", enc.encode(t)))].map(b => b.toString(16).padStart(2, "0")).join("");
  const cleCarteL = (c, k) => sub.digest("SHA-256", enc.encode("metier+|carte-livres-cle|" + c + "|" + k)).then(h => sub.importKey("raw", h, "AES-GCM", false, ["encrypt", "decrypt"]));
  const RPC = "https://nhxhfiaznuifcbobjuuv.supabase.co/rest/v1/rpc/", RPCK = "sb_publishable_GwzHRE-rG-rVafG7QcTOxg_S68OQHXh";
  const rpcC = async (f, a) => { const r = await fetch(RPC + f, { method:"POST", signal:(self.AbortSignal && AbortSignal.timeout) ? AbortSignal.timeout(15000) : undefined, headers:{ apikey:RPCK, "Content-Type":"application/json" }, body:JSON.stringify(a), cache:"no-store" }); if (!r.ok) throw new Error("Internet ne répond pas"); return r.json(); };
  const lireCarteTxt = v => { const m = String(v || "").toUpperCase().replace(/\s+/g, "").match(/MP-?(\d{5})-?([A-Z0-9]{6})/); return m ? { c:m[1], k:m[2] } : null; };
  async function connexionCarte(txt){
    const ca = typeof txt === "string" ? lireCarteTxt(txt) : txt; if (!ca) throw new Error("Ça ressemble à MP-12345-ABC123 (sous le code-barres de ta carte).");
    const r = await rpcC("coffre_lire", { p_id:await hexC("metier+|carte-livres|" + ca.c + "|" + ca.k) }), row = r && r[0];
    if (!row || !row.data) throw new Error("Cette carte n'ouvre pas encore les livres. Demande à ton enseignant.");
    let o; try { const b = unb64(JSON.parse(row.data).d); o = JSON.parse(new TextDecoder().decode(await sub.decrypt({ name:"AES-GCM", iv:b.subarray(0, 12) }, await cleCarteL(ca.c, ca.k), b.subarray(12)))); }
    catch(e){ throw new Error("Carte non reconnue."); }
    try { const rr = await fetch("comptes.json?t=" + Date.now(), { cache:"no-store" }); if (rr.ok) DATA = await rr.json(); } catch(e){}
    const c = DATA && DATA.comptes[o.id]; if (!c || !c.eleve) throw new Error("Le compte de ton groupe a changé. Demande à ton enseignant de réactiver les cartes.");
    let priv; try { priv = await sub.importKey("jwk", { kty:"EC", crv:"P-256", x:c.pub.x, y:c.pub.y, d:o.d, ext:false }, EC, false, ["deriveBits"]); } catch(e){ throw new Error("Le mot de passe du groupe a changé. Demande à ton enseignant de réactiver les cartes."); }
    try { sessionStorage.setItem("eleveMoi", JSON.stringify({ c:ca.c, k:ca.k })); if (window.ELEVE_REP) ELEVE_REP.definir(ca.c, ca.k); } catch(e){}
    await ouvrirSession(o.id, priv); return o.id; }
  /* administrateur : avec le mot de passe du compte de groupe, chaque carte reçoit sa copie (cartes = [{ c, k }]) */
  async function activerCartes(id, mdp, cartes){
    if (!SESSION || !SESSION.admin) throw new Error("Réservé à l'administrateur.");
    const c = DATA.comptes[id]; if (!c || !c.eleve) throw new Error("Choisis un compte de groupe d'élèves."); if (c.pub.kty !== "EC") throw new Error("Ce compte est trop ancien : refais-le dans Comptes et accès.");
    let pk8; try { pk8 = await sub.decrypt({ name:"AES-GCM", iv:unb64(c.priv.i) }, await cleMdp(mdp, unb64(c.priv.s)), unb64(c.priv.c)); } catch(e){ throw new Error("Mot de passe du groupe incorrect."); }
    const d = b64u(new Uint8Array(pk8)); let n = 0;
    for (const ca of cartes){ if (!ca || !/^\d{5}$/.test(ca.c) || !ca.k) continue;
      const iv = crypto.getRandomValues(new Uint8Array(12)), ct = new Uint8Array(await sub.encrypt({ name:"AES-GCM", iv }, await cleCarteL(ca.c, ca.k), enc.encode(JSON.stringify({ id, d })))), u = new Uint8Array(12 + ct.length); u.set(iv); u.set(ct, 12);
      if (await rpcC("coffre_ecrire", { p_id:await hexC("metier+|carte-livres|" + ca.c + "|" + ca.k), p_jeton:await hexC("metier+|carte-livres-jeton|" + ca.c + "|" + ca.k), p_env:"public", p_data:JSON.stringify({ v:1, d:b64(u) }) }) === true) n++; }
    return n; }
  async function basculer(id){          /* compte déjà ouvert sur cet appareil : vrai si l'ouverture s'est faite sans mot de passe */
    try { const M = (await idbGet("memo")) || {}, m = M[id], c = DATA && DATA.comptes[id];
      if (!m || !c || m.emp !== empreinte(c)){ if (m){ delete M[id]; await idbSet("memo", M); memoIds(Object.keys(M)); } return false; }
      await ouvrirSession(id, m.priv); return true; } catch(e){ return false; }
  }
  async function oublierCompte(id){
    try { const M = (await idbGet("memo")) || {}; delete M[id]; await idbSet("memo", M); memoIds(Object.keys(M));
      localStorage.setItem("comptesRecents", JSON.stringify((JSON.parse(localStorage.getItem("comptesRecents") || "[]") || []).filter(x => x && x.id !== id)));
      if (localStorage.getItem("dernierId") === id){ localStorage.removeItem("dernierId"); localStorage.removeItem("dernierNom"); } } catch(e){}
  }
  function dlgComptes(){              /* « Changer de compte » : les comptes déjà ouverts sur cet appareil, un toucher */
    let R = []; try { R = (JSON.parse(localStorage.getItem("comptesRecents") || "[]") || []).filter(x => x && DATA && DATA.comptes[x.id]); } catch(e){}
    const mem = memoListe(), ini = x => esc(((x.nom || x.id).split(/[\s.]+/).map(w => w[0] || "").join("").slice(0, 2)).toUpperCase());
    box().classList.remove("co2");
    box().innerHTML = marque("Changer de compte", R.length ? "Touche un compte déjà utilisé sur cet appareil." : "Aucun autre compte sur cet appareil pour l'instant.")
      + '<div class="cpt-liste">' + R.map(x => '<div class="cpt' + (SESSION && x.id === SESSION.id ? ' on' : '') + '"><button type="button" class="cpt-go" data-id="' + esc(x.id) + '"><i>' + ini(x) + '</i><span><b>' + esc(x.nom || x.id) + '</b><small>' + (SESSION && x.id === SESSION.id ? 'Connecté en ce moment' : mem.includes(x.id) ? 'Sans mot de passe' : 'Mot de passe demandé') + '</small></span></button><button type="button" class="cpt-x" data-x="' + esc(x.id) + '" title="Retirer de cet appareil" aria-label="Retirer ' + esc(x.nom || x.id) + ' de cet appareil">×</button></div>').join("")
      + '<button type="button" class="cpt cpt-autre" id="cptAutre"><i>+</i><span><b>Autre compte</b></span></button></div>'
      + '<div class="acces-btns"><button id="cptNon">Fermer</button></div>';
    ov().hidden = false;
    box().querySelectorAll(".cpt-go").forEach(b => b.onclick = async () => { const id = b.dataset.id;
      if (SESSION && id === SESSION.id){ fermer(); return; }
      if (await basculer(id)){ bienvenue(); return; }
      try { localStorage.setItem("dernierId", id); localStorage.setItem("dernierNom", (DATA.comptes[id] || {}).nom || ""); } catch(e){} dlgConnexion(); });
    box().querySelectorAll(".cpt-x").forEach(b => b.onclick = async () => { const id = b.dataset.x;
      if (!b.classList.contains("sur")){ b.classList.add("sur"); b.textContent = "Retirer"; b.title = "Toucher encore pour retirer ce compte de cet appareil"; return; }   /* 2e toucher pour confirmer */
      await oublierCompte(id); if (SESSION && SESSION.id === id){ await deconnexion(); } dlgComptes(); });
    document.getElementById("cptAutre").onclick = () => { try { localStorage.removeItem("dernierId"); localStorage.removeItem("dernierNom"); } catch(e){} dlgConnexion(); };
    document.getElementById("cptNon").onclick = fermer;
  }
  async function deconnexion(){ SESSION = null; for (const k in CLES) delete CLES[k]; await idbSet("session", undefined); try { INDEX_TEXTE = null; } catch(e){} majBouton(); try { render(); } catch(e){} }

  /* ---- demande d'inscription : la paire de clés est créée ici; seule la clé publique et la clé privée cadenassée partent ---- */
  const idDe = nom => sansAcc(nom).toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "");
  const sansAcc = t => t.normalize("NFD").replace(/[̀-ͯ]/g, "");
  /* boîte des demandes : sujet ntfy.sh (gratuit, sans compte). La demande va directement dans le panneau de l'admin.
     ntfy.sh garde les messages 12 h : la demande est donc renvoyée toute seule (au plus toutes les 6 h) tant qu'elle n'est pas acceptée,
     et le panneau garde sur l'ordinateur de l'admin les demandes déjà vues. Jeremy peut aussi s'abonner à ce sujet dans l'appli ntfy (avis sur son cellulaire). */
  const BOITE = "https://ntfy.sh/biblio-pavillon-5edf93926a704efe";
  async function envoyerDemande(code, nom){
    const r = await fetch(BOITE, { method:"POST", body:code, headers:{ Title:"Demande d'acces", Tags:"books" }   /* 27 nov. (Loi 25) : plus de nom dans le titre public */ });
    if (!r.ok) throw new Error("réponse " + r.status);
    try { localStorage.setItem("demandeEnAttente", JSON.stringify({ code, id:idDe(nom), nom, x:lireDemande(code).pub.x, envoi:Date.now() })); } catch(e){}
  }
  async function relancerDemande(){      /* au chargement : la demande de cet ordinateur est-elle encore en attente ? */
    let d = null; try { d = JSON.parse(localStorage.getItem("demandeEnAttente") || "null"); } catch(e){} if (!d) return;
    const cpt = DATA && DATA.comptes[d.id]; if (cpt && (!d.x || cpt.pub.x === d.x)){ try { localStorage.removeItem("demandeEnAttente"); } catch(e){} return; }
    if (Date.now() - (d.envoi || 0) > 6 * 3600e3) try { await envoyerDemande(d.code, d.nom); } catch(e){}
  }
  async function lireBoite(){            /* demandes reçues (12 dernières heures) + celles déjà vues sur cet ordinateur */
    let vues = {}; try { vues = JSON.parse(localStorage.getItem("demandesVues") || "{}"); } catch(e){}
    try { const r = await fetch(BOITE + "/json?poll=1&since=12h", { cache:"no-store" });
      if (r.ok) (await r.text()).split("\n").filter(Boolean).forEach(l => { try { const m = JSON.parse(l); if (m.event !== "message" || !/^DEMANDE-/.test(m.message || "")) return;
        if (IGN().includes(m.message.trim())) return;   /* demande déjà ignorée sur cet ordinateur (même code renvoyé) */
        const d = lireDemande(m.message); if (!vues[d.id] || vues[d.id].t < m.time) vues[d.id] = { code:m.message, t:m.time }; } catch(e){} }); } catch(e){}
    try { localStorage.setItem("demandesVues", JSON.stringify(vues)); } catch(e){}
    return vues;
  }
  const IGN = () => { try { return JSON.parse(localStorage.getItem("demandesIgnorees") || "[]"); } catch(e){ return []; } };
  const oublierDemande = (id, ignorer) => { try { const v = JSON.parse(localStorage.getItem("demandesVues") || "{}");
    if (ignorer && v[id]) localStorage.setItem("demandesIgnorees", JSON.stringify([...IGN(), v[id].code.trim()].slice(-200)));   /* « Ignorer » : ne plus jamais la montrer (une nouvelle demande de cette personne, elle, apparaîtra) */
    delete v[id]; localStorage.setItem("demandesVues", JSON.stringify(v)); } catch(e){} };
  const PROGS = () => [...new Set(LIVRES.filter(l => l.fichier && l.categorie && !l.user).map(l => l.categorie))].sort();
  const progNom = c => { try { return nomProgramme(c); } catch(e){ return c; } };
  /* code de demande COURT : clé EC P-256; binaire = version(1) | programmes(1, bits) | clé publique(65) | sel(16) | iv(12) | clé privée chiffrée(48) | nom (UTF-8) */
  const PROG_BITS = ["Entretien général d'immeubles", "Plomberie et chauffage"];
  async function demande(nom, mdp, prog){
    const kp = await sub.generateKey(EC, true, ["deriveBits"]), jwk = await sub.exportKey("jwk", kp.privateKey), pub = new Uint8Array(await sub.exportKey("raw", kp.publicKey));
    const s = crypto.getRandomValues(new Uint8Array(16)), i = crypto.getRandomValues(new Uint8Array(12));
    const c = new Uint8Array(await sub.encrypt({ name:"AES-GCM", iv:i }, await cleMdp(mdp, s), unb64u(jwk.d)));
    const n = enc.encode(nom.trim()), bits = PROG_BITS.reduce((m, p, k) => (prog || []).includes(p) ? m | (1 << k) : m, 0);
    const u = new Uint8Array(2 + 65 + 16 + 12 + c.length + n.length); let o = 0; u[o++] = 2; u[o++] = bits;
    [pub, s, i, c, n].forEach(x => { u.set(x, o); o += x.length; });
    return "DEMANDE-" + b64u(u);
  }
  function lireDemande(code){
    const t = (code || "").trim().replace(/^DEMANDE-/, "").replace(/\s+/g, "");
    if (t.startsWith("eyJ")){ const d = JSON.parse(decodeURIComponent(escape(atob(t)))); if (d.t !== "demande-acces" || !d.pub || !d.priv) throw new Error("code invalide"); return d; }   /* ancien format (RSA) */
    const u = unb64u(t); if (u[0] !== 2 || u.length < 2 + 65 + 16 + 12 + 48 + 2) throw new Error("code invalide");
    let o = 2; const pub = u.subarray(o, o += 65), s = u.subarray(o, o += 16), i = u.subarray(o, o += 12), c = u.subarray(o, o += 48), nom = dec.decode(u.subarray(o));
    return { id:idDe(nom), nom, prog:PROG_BITS.filter((p, k) => u[1] & (1 << k)), pub:{ kty:"EC", crv:"P-256", x:b64u(pub.subarray(1, 33)), y:b64u(pub.subarray(33, 65)) }, priv:{ s:b64(s), i:b64(i), c:b64(c) } };
  }

  /* ---- administration : donner / retirer un livre (la clé du livre est ouverte avec la clé de l'admin, puis enveloppée pour l'enseignant) ---- */
  async function envelopper(f, pubJwk){
    const env = DATA.livres[f].cles[SESSION.id]; if (!env) throw new Error("tu n'as pas la clé de « " + f + " »");
    return envelopperPour(new Uint8Array(await ouvrirEnveloppe(env)), pubJwk);
  }

  /* ---------------- interface ---------------- */
  const ov = () => document.getElementById("accesOv"), box = () => document.getElementById("accesBox");
  const fermer = () => { ov().hidden = true; box().classList.remove("large", "gestion", "co2"); box().onclick = null; };
  const ICO_PERS = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>';
  window.ICO_CADENAS = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  function majBouton(){
    const b = document.getElementById("compteBtn"); if (!b) return;
    if (SESSION){ const ini = SESSION.nom.split(/\s+/).map(m => m[0] || "").join("").slice(0, 2).toUpperCase(); b.innerHTML = '<span class="ini">' + ini + '</span>'; b.title = "Connecté : " + SESSION.nom;
      let nd = 0; try { nd = SESSION.admin ? NB_DEM : 0; } catch(e){}
      if (nd){ b.innerHTML += '<span class="cloche" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5a1.4 1.4 0 0 1 1.4 1.4v.6a6 6 0 0 1 4.6 5.8v3.6l1.6 2.6a.8.8 0 0 1-.7 1.2H5.1a.8.8 0 0 1-.7-1.2L6 13.9v-3.6a6 6 0 0 1 4.6-5.8v-.6A1.4 1.4 0 0 1 12 2.5z"/><path d="M9.8 19.2h4.4a2.2 2.2 0 0 1-4.4 0z"/></svg><b>' + nd + '</b></span>'; b.title = nd + " demande" + (nd > 1 ? "s" : "") + " d'accès en attente"; } }
    else { b.innerHTML = ICO_PERS + '<span class="lbl"> Se connecter</span>'; b.title = "Se connecter (livres protégés)"; }
    b.setAttribute("aria-label", b.title);
    const t = document.getElementById("plusCompte"); if (t) t.textContent = SESSION ? "Mon compte (" + SESSION.nom + ")" : "Se connecter";
    document.body.classList.toggle("connecte", !!SESSION);
    try { if (SESSION && !SESSION.eleve) localStorage.setItem("etaitConnecte", SESSION.nom || "1"); else if (estPret) localStorage.removeItem("etaitConnecte"); } catch(e){}
    if (SESSION || estPret) document.body.classList.remove("pre-co");
    document.body.classList.toggle("eleve", !!(SESSION && SESSION.eleve));   /* compte de groupe d'élèves : lecture, crayon et texte seulement */   /* Plans, Accueil de classe, Tableau blanc : seulement une fois connecté */
    try { window.appliquerPrefs && window.appliquerPrefs(); } catch(e){}
  }
  function menu(){
    const m = document.getElementById("accesMenu"), b = document.getElementById("compteBtn");
    if (!SESSION){ dlgConnexion(); return; }
    if (!m.hidden){ m.hidden = true; return; }
    m.innerHTML = '<div class="qui"><b>' + esc(SESSION.nom) + '</b>' + esc(SESSION.id) + (SESSION.admin ? ' <span class="acces-tag">admin</span>' : '') + '</div>'
      + (SESSION.admin ? '<button data-a="gerer">Administration' + (NB_DEM ? ' (' + NB_DEM + ' demande' + (NB_DEM > 1 ? 's' : '') + ')' : '') + '</button>' : '')
      + (window.MESDOCS && document.body.classList.contains("md-permis") ? '<button data-a="ajout">Ajouter un document</button>' : '') + '<button data-a="prefs">Mes préférences</button><button data-a="neuf">Quoi de neuf' + (document.getElementById("qnPoint") && !document.getElementById("qnPoint").hidden ? ' <span class="qn-point"></span>' : '') + '</button><button data-a="aide">Aide</button><button data-a="signal">Signaler un problème</button><button data-a="changer">Changer de compte</button><button data-a="sortir">Se déconnecter</button>';
    const r = b.getBoundingClientRect(); m.style.top = (r.bottom + 8 + scrollY) + "px"; m.style.left = Math.max(8, Math.min(innerWidth - 240, r.right - 230)) + "px"; m.hidden = false;
    m.onclick = e => { const a = e.target.closest("[data-a]"); if (!a) return; m.hidden = true; if (a.dataset.a === "neuf" || a.dataset.a === "aide"){ document.getElementById(a.dataset.a === "neuf" ? "quoiNeuf" : "lienAide").click(); return; } if (a.dataset.a === "ajout"){ window.MESDOCS.dlgAjout(); return; } if (a.dataset.a === "signal"){ window.mpSignaler(); return; } if (a.dataset.a === "changer"){ dlgComptes(); return; } if (a.dataset.a === "sortir") (async () => {   /* 27 nov. (Loi 25) : se déconnecter vide l'appareil : clé du compte, registre, jeton du magasin (seulement ce qui est déjà envoyé) */
        const id = SESSION && SESSION.id; try { if (window.COFFRE && COFFRE.quitter) await COFFRE.quitter(); } catch(e){}
        if (id) { try { await oublierCompte(id); localStorage.removeItem("magJeton|" + id); } catch(e){} }
        await deconnexion(); })().then(() => aviser("Tu es déconnecté sur cet ordinateur.")); else if (a.dataset.a === "prefs") window.dlgPrefs(); else dlgGerer(); };
  }
  document.addEventListener("pointerdown", e => { const m = document.getElementById("accesMenu"); if (m && !m.hidden && !m.contains(e.target) && !e.target.closest("#compteBtn")) m.hidden = true; });

  const marque = (titre, sous) => '<div class="acces-marque"><img class="lg-blc" src="img/metier-plus-blanc.svg" alt="Métier+"><img class="lg-clr" src="img/metier-plus.svg" alt=""><h2>' + titre + '</h2><p class="sous">' + sous + '</p></div>';
  const LOGO_PROG = { "Entretien général d'immeubles":"img/prog-egi.jpg", "Plomberie et chauffage":"img/prog-plomberie.jpg" };
  const ICO_PROG = { "Entretien général d'immeubles":'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V8l7-5 7 5v13"/><path d="M9 21v-6h6v6M9 10h.01M15 10h.01"/></svg>',
    "Plomberie et chauffage":'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h6v4h6a4 4 0 0 1 4 4v2h-4v-2H10v2H4z"/><path d="M18 18.5c0 1-.8 1.8-1.8 1.8s-1.7-.8-1.7-1.8c0-1.2 1.7-3 1.7-3s1.8 1.8 1.8 3z"/></svg>' };
  function succes(titre, html){   /* écran « c'est envoyé » : crochet vert animé + confettis */
    const C = ["#22c55e","#EB6A22","#facc15","#3b82f6","#a855f7","#f97316"];
    const conf = Array.from({ length:18 }, (_, i) => { const a = i / 18 * Math.PI * 2 + Math.random() * .3, d = 60 + Math.random() * 50;
      return '<i class="conf" style="background:' + C[i % C.length] + ';--x:' + Math.round(Math.cos(a) * d) + 'px;--y:' + Math.round(Math.sin(a) * d) + 'px;--r:' + Math.round(Math.random() * 540 - 270) + 'deg;animation-delay:' + (0.78 + Math.random() * .12).toFixed(2) + 's"></i>'; }).join("");
    return '<div class="acces-succes"><div class="crochet"><span class="halo"></span>' + conf + '<svg viewBox="0 0 100 100"><circle class="fond" cx="50" cy="50" r="45"/><circle class="cercle" cx="50" cy="50" r="45"/><path class="coche" d="M30 52l13 13 27-29"/></svg></div>'
      + '<h2>' + titre + '</h2>' + html + '<br><img class="mini lg-blc" src="img/metier-plus-blanc.svg" alt=""><img class="mini lg-clr" src="img/metier-plus.svg" alt=""></div>';
  }
  function bienvenue(apres){   /* connexion réussie : pastille des initiales qui apparaît, cadenas qui s'ouvre, « Bonjour Prénom ! », puis fermeture toute seule */
    const ini = SESSION.nom.split(/\s+/).map(m => m[0] || "").join("").slice(0, 2).toUpperCase(), n = protegesPermis();
    box().innerHTML = '<div class="acces-succes acces-bienv"><div class="avatar"><span class="halo"></span><span class="ini">' + ini + '</span><span class="cad"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path class="anse" d="M8 11V8a4 4 0 0 1 8 0v3"/></svg></span></div>'
      + '<h2>Bonjour' + (SESSION.eleve ? ', ' + esc(SESSION.nom) : ' ' + esc(SESSION.nom.split(/\s+/)[0])) + ' !</h2><p class="sous">' + (n ? n + ' livre' + (n > 1 ? 's' : '') + ' déverrouillé' + (n > 1 ? 's' : '') + ' pour toi.' : 'Tu es connecté.') + '</p></div>';
    ov().hidden = false;
    let fini = false; const fin = () => { if (fini) return; fini = true; fermer(); if (apres) apres(); };
    setTimeout(fin, 1900); box().onclick = fin;
  }
  const protegesPermis = () => { try { return Object.keys(DATA.livres).filter(f => DATA.livres[f].cles[SESSION.id]).length; } catch(e){ return 0; } };
  /* Écran de connexion (8 nov., idées 1 à 5 choisies par Jeremy) : deux parties (visuel Métier+ à gauche), identifiant retenu sur l'appareil
     (« Bonjour Marc » + « Ce n'est pas toi ? »), œil pour voir le mot de passe, avertissement Majuscules, erreur qui tremble,
     message pendant le déverrouillage, gros champs au TNI. */
  const OEIL = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  const OEIL_X = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18M10.6 5.1A10.6 10.6 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.1M6.6 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
  function coVisuel(){
    const C = window.COUVERTURES || {}, ls = Object.keys(C).slice(0, 10).map(f => C[f]);
    const col = (a, d) => '<div class="co-col" style="--d:' + d + 's">' + [...a, ...a].map(u => '<img src="' + u + '" alt="">').join("") + '</div>';
    return '<div class="co-vis" aria-hidden="true"><div class="co-murs">' + (ls.length ? col(ls.filter((x, k) => k % 2 === 0), 0) + col(ls.filter((x, k) => k % 2 === 1), -14) : '') + '</div>'
      + '<div class="co-txt"><img src="img/metier-plus-blanc.svg" alt=""><b>Enseigner un métier, simplement.</b><span>Tes livres, tes plans, tes formatifs, tes quiz et tes simulations, au même endroit.</span></div></div>';
  }
  function dlgConnexion(apres){
    let id0 = "", nom0 = ""; try { id0 = localStorage.getItem("dernierId") || ""; nom0 = localStorage.getItem("dernierNom") || ""; } catch(e){}
    if (id0 && !(DATA && DATA.comptes[id0])) id0 = "";
    box().classList.add("co2");
    box().innerHTML = coVisuel() + '<div class="co-form">' + marque(id0 ? 'Bonjour ' + esc((nom0 || id0).split(/[\s.]+/)[0].replace(/^./, c => c.toUpperCase())) + ' !' : 'Se connecter', id0 ? 'Entre ton mot de passe pour ouvrir tes livres.' : 'Accès réservé aux enseignants du Pavillon de l\'Avenir. Ton mot de passe reste sur cet appareil : il n\'est jamais envoyé.')
      + (() => { let R = []; try { R = (JSON.parse(localStorage.getItem("comptesRecents") || "[]") || []).filter(x => x && DATA && DATA.comptes[x.id]); } catch(e){}
          if (R.length < 2) return "";
          return '<div class="co-recents"><span>Qui se connecte ?</span>' + R.map(x => '<button type="button" class="co-rc' + (x.id === id0 ? ' on' : '') + '" data-rid="' + esc(x.id) + '" data-rnom="' + esc(x.nom || "") + '"><i>' + esc(((x.nom || x.id).split(/[\s.]+/).map(w => w[0] || "").join("").slice(0, 2)).toUpperCase()) + '</i>' + esc((x.nom || x.id).split(/\s+/)[0]) + '</button>').join("") + '<button type="button" class="co-rc" data-rid=""><i>+</i>Autre</button></div>'; })()
      + '<div id="acIdBloc"' + (id0 ? ' hidden' : '') + '><label for="acId">Identifiant</label><input type="text" id="acId" autocomplete="username" placeholder="prenom.nom" value="' + esc(id0) + '" autocapitalize="off" spellcheck="false"><p class="sous" style="font-size:.8rem;margin:6px 0 0">Élève : ton enseignant te donne l\'identifiant de ton groupe.</p></div>'
      + (id0 ? '<p class="co-qui">Connexion de <b>' + esc(id0) + '</b> · <button class="acces-lien" id="acPasMoi" type="button">Ce n\'est pas toi ?</button></p>' : '')
      + '<label for="acMdp">Mot de passe</label><div class="co-mdp"><input type="password" id="acMdp" autocomplete="current-password"><button type="button" id="acOeil" class="co-oeil" aria-label="Voir le mot de passe" title="Voir le mot de passe">' + OEIL + '</button></div>'
      + '<div class="co-maj" id="acMaj" hidden>Majuscules activées</div>'
      + '<div class="acces-err" id="acErr" hidden></div>'
      + '<div class="co-prog" id="acProg" hidden><i></i><span>Déverrouillage de tes livres…</span></div>'
      + '<div class="acces-btns"><button id="acNon">Annuler</button><button class="prim" id="acOui">Se connecter</button></div>'
      + '<div class="co-carte"><span>Élève ?</span><input type="text" id="acCarte" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="Scanne ta carte : MP-12345-ABC123" aria-label="Ta carte d\'élève">'
      + (() => { try { const K = JSON.parse(localStorage.getItem("mpCarte") || "null"); return K && K.c ? '<button type="button" class="prim" id="acMaCarte" data-c="' + esc(K.c) + '">Entrer avec Ma carte' + (K.p ? ' (' + esc(String(K.p).split(/\s+/)[0]) + ')' : '') + '</button>' : ''; } catch(e){ return ""; } })() + '</div>'
      + '<button class="acces-lien" id="acDem">Pas encore de compte ? Demander un accès</button><br><button class="acces-lien" id="acOubli" style="margin-top:8px">Mot de passe oublié ?</button></div>';
    ov().hidden = false; setTimeout(() => document.getElementById(id0 ? "acMdp" : "acId")?.focus(), 50);
    const mdp = document.getElementById("acMdp"), maj = document.getElementById("acMaj");
    document.getElementById("acOeil").onclick = () => { const v = mdp.type === "password"; mdp.type = v ? "text" : "password"; const b = document.getElementById("acOeil"); b.innerHTML = v ? OEIL_X : OEIL; b.setAttribute("aria-label", v ? "Cacher le mot de passe" : "Voir le mot de passe"); mdp.focus(); };
    const verifMaj = e => { try { maj.hidden = !(e.getModifierState && e.getModifierState("CapsLock")); } catch(x){} };
    mdp.addEventListener("keydown", verifMaj); mdp.addEventListener("keyup", verifMaj);
    box().querySelectorAll("[data-rid]").forEach(b => b.onclick = async () => { if (b.dataset.rid && await basculer(b.dataset.rid)){ box().classList.remove("co2"); bienvenue(apres); return; } try { if (b.dataset.rid){ localStorage.setItem("dernierId", b.dataset.rid); localStorage.setItem("dernierNom", b.dataset.rnom || ""); } else { localStorage.removeItem("dernierId"); localStorage.removeItem("dernierNom"); } } catch(e){} dlgConnexion(apres); });
    const pm = document.getElementById("acPasMoi"); if (pm) pm.onclick = () => { try { localStorage.removeItem("dernierId"); localStorage.removeItem("dernierNom"); } catch(e){} dlgConnexion(apres); };
    const go = async () => { const bt = document.getElementById("acOui"), er = document.getElementById("acErr"), pr = document.getElementById("acProg"); bt.disabled = true; bt.textContent = "Vérification…"; er.hidden = true; pr.hidden = false;
      try { const id = document.getElementById("acId").value; await connexion(id, mdp.value);
        /* comptes récents : enregistrés dans ouvrirSession */
        box().classList.remove("co2"); bienvenue(apres); compterDemandes().catch(() => {}); }
      catch(e){ pr.hidden = true; er.textContent = e.message; er.hidden = false; bt.disabled = false; bt.textContent = "Se connecter";
        const f = box().querySelector(".co-form"); f.classList.remove("tremble"); void f.offsetWidth; f.classList.add("tremble"); mdp.select(); } };
    document.getElementById("acOui").onclick = go; mdp.onkeydown = e => { if (e.key === "Enter") go(); };
    { const carte = async v => { const er = document.getElementById("acErr"), pr = document.getElementById("acProg"); er.hidden = true; pr.hidden = false;
        try { await connexionCarte(v); box().classList.remove("co2"); bienvenue(apres); } catch(e){ pr.hidden = true; er.textContent = e.message; er.hidden = false; } };
      const ic = document.getElementById("acCarte"); ic.onkeydown = e => { if (e.key === "Enter") carte(ic.value); }; ic.oninput = () => { if (/MP-?\d{5}-?[A-Z0-9]{6}$/i.test(ic.value.trim())) carte(ic.value); };
      const mc = document.getElementById("acMaCarte"); if (mc) mc.onclick = () => carte(mc.dataset.c); }
    document.getElementById("acId").onkeydown = e => { if (e.key === "Enter") mdp.focus(); };
    document.getElementById("acNon").onclick = fermer; document.getElementById("acDem").onclick = () => { box().classList.remove("co2"); dlgDemande(false); }; document.getElementById("acOubli").onclick = () => { box().classList.remove("co2"); dlgDemande(true); };
  }
  function dlgDemande(oubli){
    box().innerHTML = (oubli ? marque('Mot de passe oublié', 'Écris ton nom et choisis un nouveau mot de passe (au moins 10 caractères). La demande est transmise à l\'administrateur; dès qu\'elle est acceptée, ton nouveau mot de passe fonctionne. Tes livres et tes données sont conservés.')
      : marque('Demander un accès', 'Choisis un mot de passe d\'au moins 10 caractères. Ta demande est transmise automatiquement à l\'administrateur; tu pourras te connecter dès qu\'elle sera acceptée.'))
      + '<label for="dNom">Prénom et nom</label><input type="text" id="dNom" autocomplete="name">'
      + '<label for="dMdp">Mot de passe</label><div class="co-mdp"><input type="password" id="dMdp" autocomplete="new-password"><button type="button" class="co-oeil dOeil" data-champ="dMdp" aria-label="Voir le mot de passe" title="Voir le mot de passe">' + OEIL + '</button></div>'
      + '<label for="dMdp2">Mot de passe (encore)</label><div class="co-mdp"><input type="password" id="dMdp2" autocomplete="new-password"><button type="button" class="co-oeil dOeil" data-champ="dMdp2" aria-label="Voir le mot de passe" title="Voir le mot de passe">' + OEIL + '</button></div>'
      + (oubli ? '' : '<label>Programme(s) que tu enseignes</label><div class="acces-progs">' + PROGS().map(c => '<label class="acces-prog"><input type="checkbox" class="dProg" value="' + esc(c) + '">' + (LOGO_PROG[c] ? '<img class="plogo" src="' + LOGO_PROG[c] + '" alt="">' : (ICO_PROG[c] || '')) + esc(progNom(c)) + '</label>').join("") + '</div>')
      + '<div class="acces-err" id="dErr" hidden></div>'
      + '<div class="acces-btns"><button id="dNon">Annuler</button><button class="prim" id="dOui">' + (oubli ? 'Envoyer ma demande' : 'Créer ma demande') + '</button></div>';
    ov().hidden = false; setTimeout(() => document.getElementById("dNom")?.focus(), 50);
    document.querySelectorAll(".dOeil").forEach(b => b.onclick = () => { const c = document.getElementById(b.dataset.champ), v = c.type === "password"; c.type = v ? "text" : "password"; b.innerHTML = v ? OEIL_X : OEIL; b.setAttribute("aria-label", v ? "Cacher le mot de passe" : "Voir le mot de passe"); b.title = b.getAttribute("aria-label"); });
    document.getElementById("dNon").onclick = fermer;
    document.getElementById("dOui").onclick = async () => {
      const nom = document.getElementById("dNom").value.trim(), m1 = document.getElementById("dMdp").value, m2 = document.getElementById("dMdp2").value, er = document.getElementById("dErr");
      const err = t => { er.textContent = t; er.hidden = false; };
      if (nom.split(/\s+/).length < 2) return err("Écris ton prénom et ton nom.");
      if (m1.length < 10) return err("Le mot de passe doit avoir au moins 10 caractères.");
      if (m1 !== m2) return err("Les deux mots de passe ne sont pas pareils.");
      let CPT = DATA && DATA.comptes;   /* la liste gardée peut être vieille (compte retiré il y a peu) : on relit celle en ligne */
      try { const r = await fetch("comptes.json?t=" + Date.now(), { cache:"no-store" }); if (r.ok) CPT = (await r.json()).comptes || CPT; } catch(e){}
      if (!oubli && CPT && CPT[idDe(nom)]) return err("Ce nom a déjà un compte. Connecte-toi plutôt (ou « Mot de passe oublié ? »).");
      if (oubli && !(CPT && CPT[idDe(nom)])) return err("Aucun compte à ce nom. Écris ton nom comme lors de ta première demande.");
      const prog = [...document.querySelectorAll(".dProg:checked")].map(x => x.value); if (!oubli && !prog.length) return err("Coche au moins un programme.");
      const bt = document.getElementById("dOui"); bt.disabled = true; bt.textContent = "Création…";
      try { const code = await demande(nom, m1, prog);
        let envoye = false; try { bt.textContent = "Envoi à Jeremy…"; await envoyerDemande(code, nom); envoye = true; } catch(e){}
        if (envoye){ box().innerHTML = succes(oubli ? 'Demande envoyée à Jeremy !' : 'Bienvenue, ' + esc(nom.split(/\s+/)[0]) + ' !',
              '<p class="sous">' + (oubli ? 'Dès qu\'il l\'accepte, ton nouveau mot de passe fonctionne.' : 'Ta demande est partie à Jeremy. Dès qu\'il l\'accepte, touche « Se connecter » avec :') + '</p>'
            + '<div class="ident">Identifiant <b>' + esc(idDe(nom)) + '</b></div><p class="sous" style="font-size:.8rem">et ton mot de passe. Garde-le bien : personne ne peut le retrouver.</p>'
            + '<div class="acces-btns" style="justify-content:center"><button class="prim" id="dFin">Compris</button></div>');
          document.getElementById("dFin").onclick = fermer; return; }
        box().innerHTML = '<h2>Demande prête</h2><p class="sous">L\'envoi automatique n\'a pas marché. Touche « Envoyer par Teams » (ou copie le code et envoie-le à Jeremy). Ton identifiant sera <b>' + esc(idDe(nom)) + '</b>. Garde bien ton mot de passe : personne ne peut le retrouver.</p>'
          + '<textarea id="dCode" readonly>' + code + '</textarea><div class="acces-ok" id="dOk" hidden>Code copié.</div>'
          + '<div class="acces-btns"><button id="dFin">Fermer</button><button id="dCopie">Copier le code</button><button class="prim" id="dTeams">Envoyer par Teams</button></div>';
        document.getElementById("dTeams").onclick = () => window.open("https://teams.microsoft.com/l/chat/0/0?users=raymjere@csskamloup.gouv.qc.ca&message=" + encodeURIComponent("Bonjour Jeremy, voici ma demande d'accès à la bibliothèque : " + location.origin + location.pathname + "#accepter=" + code.replace(/^DEMANDE-/, "")), "_blank");
        document.getElementById("dFin").onclick = fermer;
        document.getElementById("dCopie").onclick = () => { const t = document.getElementById("dCode"); t.select(); try { navigator.clipboard.writeText(code); } catch(e){ document.execCommand("copy"); } document.getElementById("dOk").hidden = false; };
      } catch(e){ err("Impossible de créer la demande : " + e.message); bt.disabled = false; bt.textContent = "Créer ma demande"; }
    };
  }

  /* ---- gestion des accès (admin) : demandes, cases à cocher par livre, publication ---- */
  let BROUILLON = null;
  const titreDe = f => { const l = LIVRES.find(x => x.fichier === f); return l ? l.titre : f; };
  async function enLigne(){   /* la liste des comptes telle qu'elle est vraiment sur GitHub (pas une copie en cache) */
    let jt = ""; try { jt = localStorage.getItem("ghJeton") || ""; } catch(e){}
    if (jt) try { const h = { Authorization:"Bearer " + jt }, api = "https://api.github.com/repos/" + DEPOT;   /* par le numéro du dernier commit : jamais une vieille copie */
      const rf = await fetch(api + "/git/ref/heads/main?t=" + Date.now(), { headers:h, cache:"no-store" }); const sha = rf.ok ? (await rf.json()).object.sha : "main";
      const r = await fetch(api + "/contents/comptes.json?ref=" + sha, { headers:Object.assign({ Accept:"application/vnd.github.raw+json" }, h), cache:"no-store" }); if (r.ok) return await r.json(); } catch(e){}
    try { const r = await fetch("comptes.json?t=" + Date.now(), { cache:"no-store" }); if (r.ok) return await r.json(); } catch(e){}
    return null; }
  async function dlgGerer(){
    if (!SESSION || !SESSION.admin) return;
    const frais = await enLigne(); if (frais){ DATA = frais; try { localStorage.setItem("accesCopie", JSON.stringify(DATA)); } catch(e){} }
    BROUILLON = JSON.parse(JSON.stringify(DATA)); REGL = clone(REGLAGES); FORCER_RECH.clear(); box().classList.add("large", "gestion"); ov().hidden = false; dessinerGerer();
  }
  const OUVERTS = new Set();
  let ONGLET = "accueil", REGL = null; const FORCER_RECH = new Set(), VU = {}, EXTRA = {}, EXTRA_LIV = new Set();   /* EXTRA : fichiers à joindre à la publication (livre ajouté ou remplacé) */
  const clone = o => JSON.parse(JSON.stringify(o));
  const ICO = {
    groupes:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h4M7 13h10M7 17h7"/></svg>',
    profs:'<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/><circle cx="17.5" cy="9" r="2.6"/><path d="M16.5 14.6c2.6.2 4.4 1.9 5 5.4"/></svg>',
    livres:'<svg viewBox="0 0 24 24"><path d="M4 4.5h6a2 2 0 0 1 2 2V20a2 2 0 0 0-2-2H4z"/><path d="M20 4.5h-6a2 2 0 0 0-2 2V20a2 2 0 0 1 2-2h6z"/></svg>',
    stats:'<svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
    props:'<svg viewBox="0 0 24 24"><path d="M12 15V4M7 9l5-5 5 5M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/></svg>',
    site:'<svg viewBox="0 0 24 24"><path d="M3 12h4l3-7 4 14 3-7h4"/></svg>',
    hist:'<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 2.6-6.4L3 8"/><path d="M3 3v5h5M12 7v5l3.5 2"/></svg>',
    oeil:'<svg viewBox="0 0 24 24"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    etoile:'<svg viewBox="0 0 24 24"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
    neuf:'<svg viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l2.8 2.8M16.2 16.2 19 19M5 19l2.8-2.8M16.2 7.8 19 5"/></svg>',
    cle:'<svg viewBox="0 0 24 24"><circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3M14 9l2 2"/></svg>',
    lien:'<svg viewBox="0 0 24 24"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
    accueil:'<svg viewBox="0 0 24 24"><path d="M3 11 12 4l9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>',
    nouv:'<svg viewBox="0 0 24 24"><path d="M4 5h16v11H8l-4 4z"/><path d="M8 9h8M8 12h5"/></svg>',
    journaux:'<svg viewBox="0 0 24 24"><path d="M3 12h3l2-5 4 10 2-5h7"/></svg>',
    auto:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>',
    classe:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/></svg>',
    diff:'<svg viewBox="0 0 24 24"><path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12"/></svg>',
    voir:'<svg viewBox="0 0 24 24"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    defi:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01"/></svg>',
    magasin:'<svg viewBox="0 0 24 24"><path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20 8H6.2"/><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/></svg>',
    ajliv:'<svg viewBox="0 0 24 24"><path d="M4 4.5h6a2 2 0 0 1 2 2V20a2 2 0 0 0-2-2H4z"/><path d="M17 8v6M14 11h6"/></svg>' };
  const constrDe = l => REGL.construction[l.fichier] !== undefined ? !!REGL.construction[l.fichier] : !!l._c0;
  const nouvDe = l => estNouveau(l, REGL);
  const fraicheur = d => !d ? "jamais" : Date.now() - d < 8 * 864e5 ? "recent" : Date.now() - d < 31 * 864e5 ? "moyen" : "vieux";
  const ilYa = d => { if (!d) return "jamais vu sur Métier+"; const j = Math.floor((Date.now() - d) / 864e5); return j <= 0 ? "vu aujourd'hui" : j === 1 ? "vu hier" : j < 45 ? "vu il y a " + j + " jours" : "vu il y a " + Math.round(j / 30) + " mois"; };
  const FILTRE = { q:"", type:"tous", tri:"nom" };   /* recherche et tri du panneau (7 nov.) : gardés entre deux redessins */
  function filtrerFiches(){ const B = box(), q = FILTRE.q.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); let vus = 0;
    B.querySelectorAll(".acces-fiche[data-cherche]").forEach(f => { const ok = (!q || f.dataset.cherche.includes(q))
        && (FILTRE.type === "tous" || (FILTRE.type === "eleve" ? f.dataset.eleve === "1" : f.dataset.eleve !== "1" && (FILTRE.type === "prof" || (f.dataset.progs || "").includes(FILTRE.type))));
      f.hidden = !ok; if (ok) vus++; });
    B.querySelectorAll(".acces-ent").forEach(h => { let n = 0, e = h.nextElementSibling; while (e && e.classList.contains("acces-fiche")){ if (!e.hidden) n++; e = e.nextElementSibling; } h.hidden = !n; h.querySelector("span").textContent = n; });
    const r = document.getElementById("gRien"); if (r) r.hidden = vus > 0; }
  function dessinerGerer(msg){
    const D = BROUILLON, livres = Object.keys(D.livres), nbDe = id => livres.filter(f => D.livres[f].cles[id]).length;
    const famille = n => { const m = String(n || "").trim().split(/\s+/); return m.length > 1 ? m[m.length - 1] + " " + m.slice(0, -1).join(" ") : m[0] || ""; };
    const ids = Object.keys(D.comptes).sort((a, b) => FILTRE.tri === "peu" ? (nbDe(a) - nbDe(b)) || D.comptes[a].nom.localeCompare(D.comptes[b].nom)
      : FILTRE.tri === "prog" ? ((D.comptes[a].prog || []).join() || "~").localeCompare((D.comptes[b].prog || []).join() || "~") || D.comptes[a].nom.localeCompare(D.comptes[b].nom)
      : famille(D.comptes[a].nom).localeCompare(famille(D.comptes[b].nom), "fr", { sensitivity:"base" }));
    const progs = PROGS(), court = c => /plomberie/i.test(c) ? "Plomberie" : /entretien/i.test(c) ? "EGI" : c;
    const total = livres.length, parProg = {};
    livres.forEach(f => { const l = LIVRES.find(x => x.fichier === f), c = (l && l.categorie) || "Autres"; (parProg[c] = parProg[c] || []).push(f); });
    const grps = Object.keys(parProg).sort();
    const majus = s => String(s || "").replace(/(^|[\s'-])(\p{L})/gu, (m, a, b) => a + b.toUpperCase());
    const initiales = s => majus(s).split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase();
    const SVGK = '<svg viewBox="0 0 24 24"><circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3M14 9l2 2"/></svg>', SVGP = '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>', SVGC = '<svg viewBox="0 0 24 24"><path d="m5 12 5 5 9-10"/></svg>';
    const avatar = c => { const pr = c.prog || [], e = pr.some(x => /entretien/i.test(x)), pl = pr.some(x => /plomberie/i.test(x));
      const [c1, c2] = c.admin ? ["#EB6A22", "#b4481a"] : c.eleve ? ["#22a35a", "#15803d"] : e && pl ? ["#14A3A3", "#3b6fd6"] : e ? ["#14A3A3", "#0d7373"] : pl ? ["#3b8be0", "#22549e"] : ["#5b6470", "#3a3f47"];
      return '<div class="av" style="--c1:' + c1 + ';--c2:' + c2 + '">' + esc(initiales(c.nom) || "?") + '</div>'; };
    const vuSpan = id => '<span class="vu' + (id in VU ? ' ' + fraicheur(VU[id]) : '') + '" data-vu="' + esc(id) + '"><i></i>' + (id in VU ? ilYa(VU[id]) : "…") + '</span>';
    const fiche = id => { const c = D.comptes[id], n = livres.filter(f => D.livres[f].cles[id]).length;
      const att = ' data-cherche="' + esc((c.nom + " " + id).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")) + '" data-eleve="' + (c.eleve ? 1 : 0) + '" data-progs="' + esc((c.admin ? progs : (c.prog || [])).join("|")) + '"';
      if (c.admin) return '<div class="acces-fiche f2"' + att + '><div class="fh">' + avatar(c) + '<div class="qui"><b>' + esc(majus(c.nom)) + '</b><span class="acces-tag">admin</span><small>' + esc(id) + ' · ' + vuSpan(id) + '</small></div><span class="tous">Tous les livres</span></div></div>';
      return '<div class="acces-fiche f2"' + att + '><div class="fh">' + avatar(c) + '<div class="qui"><b>' + esc(majus(c.nom)) + '</b>' + (c.eleve ? '<span class="acces-tag" style="background:#15803d">groupe</span>' : '') + '<small>' + esc(id) + ' · ' + vuSpan(id) + '</small></div>'
        + '<div class="progs">' + progs.map(pg => { const on = (c.prog || []).includes(pg); return '<button class="pg' + (on ? ' on' : '') + '" data-prog="' + esc(pg) + '" data-pid="' + esc(id) + '" title="' + (on ? 'Retirer' : 'Donner') + ' tous les livres : ' + esc(progNom(pg)) + '">' + (on ? SVGC : '') + esc(court(pg)) + '</button>'; }).join("") + '</div>'
        + (c.eleve ? '' : '<button class="pg' + (c.ajout ? ' on' : '') + '" data-ajout="' + esc(id) + '" title="' + (c.ajout ? 'Retirer la permission' : 'Permettre') + ' d\'ajouter ses propres livres, formatifs et plans">' + (c.ajout ? SVGC : '') + 'Ajouts</button>')
        + (c.eleve ? '' : '<button class="pg' + (c.chef ? ' on' : '') + '" data-chef="' + esc(id) + '" title="' + (c.chef ? 'Retirer' : 'Donner') + ' les droits de chef de groupe : créer et gérer groupes, élèves, équipes, locaux et coffres dans la Gestion d\'atelier">' + (c.chef ? SVGC : '') + 'Chef de groupe</button>')
        + '<div class="act"><button class="ico" data-mdp="' + esc(id) + '" title="Nouveau mot de passe">' + SVGK + '</button><button class="ico rouge" data-retirer="' + esc(id) + '" title="Retirer ce compte">' + SVGP + '</button></div></div>'
        + '<details' + (OUVERTS.has(id) ? ' open' : '') + ' data-fiche="' + esc(id) + '"><summary><span class="jauge"><i style="width:' + (total ? n / total * 100 : 0) + '%"></i></span><b>' + n + '</b>&nbsp;livre' + (n > 1 ? 's' : '') + ' sur ' + total + '<span class="voir">Choisir les livres</span></summary>'
        + grps.map(g => '<div class="acces-grp"><div class="t">' + esc(court(g)) + '</div><div class="acces-chips">' + parProg[g].map(f => '<label class="acces-chip" title="' + esc(titreDe(f)) + '"><input type="checkbox" data-id="' + esc(id) + '" data-f="' + esc(f) + '"' + (D.livres[f].cles[id] ? " checked" : "") + '><span>' + esc(titreDe(f)) + '</span></label>').join("") + '</div></div>').join("")
        + '</details></div>'; };
    const idsP = ids.filter(id => !D.comptes[id].eleve), idsG = ids.filter(id => D.comptes[id].eleve);
    const lignes = '<div class="acces-ent" data-ent="p">Enseignants <span>' + idsP.length + '</span></div>' + idsP.map(fiche).join("")
      + (idsG.length ? '<div class="acces-ent" data-ent="g">Groupes d\'élèves <span>' + idsG.length + '</span></div>' + idsG.map(fiche).join("") : '');
    let jeton = ""; try { jeton = localStorage.getItem("ghJeton") || ""; } catch(e){}
    const nProf = ids.filter(id => !D.comptes[id].eleve).length, nGr = ids.length - nProf;
    const retires = Object.keys(D.livres).filter(f => DATA.livres[f] && Object.keys(DATA.livres[f].cles).some(id => !D.livres[f].cles[id]));
    const aRech = [...new Set([...retires, ...FORCER_RECH])].filter(f => D.livres[f]);
    const aPublier = JSON.stringify(D) !== JSON.stringify(DATA) || JSON.stringify(REGL) !== JSON.stringify(REGLAGES) || FORCER_RECH.size > 0 || Object.keys(EXTRA).length > 0;
    const vol = k => ' data-pane="' + k + '"' + (ONGLET === k ? '' : ' hidden');
    const grpT = t => '<div class="og-t">' + t + '</div>';
    const ong = (k, lab) => '<button class="' + (ONGLET === k ? 'on' : '') + '" data-ong="' + k + '">' + ICO[k] + '<span>' + lab + '</span></button>';
    const pool = [...LIVRES.filter(l => l.fichier && !l.user && l.fichier !== "tableau-blanc"), ...LIVRES_CACHES];
    const tg = (k, f, on, lab, ic) => '<button class="tg' + (on ? ' on' : '') + '" data-rl="' + k + '" data-f="' + esc(f) + '">' + ic + lab + '</button>';
    const volLivres = '<details class="acces-info"><summary>Comment ça marche</summary><p class="sous">Ce que tu changes ici s\'applique pour tous les enseignants quand tu touches « Publier ». « Nouveau » dure 30 jours; « En vedette » = les livres du haut de l\'accueil (3 au plus). Le menu « ⋯ » d\'un livre protégé permet de couper les anciens accès.</p></details><div class="acces-livs">'
      + pool.map(l => { const f = l.fichier, cache = REGL.caches.includes(f), prot = !!D.livres[f], nAcc = prot ? Object.keys(D.livres[f].cles).length : 0, cv = couv(l);
        return '<div class="acces-liv' + (cache ? ' masque' : '') + '"><div class="cv" style="' + (cv ? "background-image:url('" + cv + "')" : "background:" + fond(l)) + '"></div><div class="tx"><b>' + esc(l.titre) + '</b>'
          + '<small>' + esc(court(l.categorie || "")) + ' · ' + (prot ? nAcc + ' accès' : 'public') + (FORCER_RECH.has(f) ? ' · <em>sera rechiffré</em>' : '') + '</small><div class="tgs">'
          + tg("vis", f, !cache, cache ? "Caché" : "Visible", ICO.oeil) + tg("constr", f, constrDe(l), "En construction", ICO_CONSTR) + tg("nouv", f, nouvDe(l), "Nouveau", ICO.neuf) + tg("ved", f, REGL.vedette.includes(f), "En vedette", ICO.etoile)
          + (prot ? '<details class="acces-plusL"' + (FORCER_RECH.has(f) ? ' open' : '') + '><summary title="Plus d\'options" aria-label="Plus d\'options">⋯</summary><button class="tg rech' + (FORCER_RECH.has(f) ? ' on' : '') + '" data-rech="' + esc(f) + '" title="Nouvelle clé : seuls ceux qui ont encore l\'accès pourront l\'ouvrir, même avec une vieille copie">' + ICO.cle + 'Couper les anciens accès</button></details>' : '')
          + '</div></div></div>'; }).join("") + '</div>';
    const volStats = '<div class="acces-per"><button class="abtn' + (FILTRE.per === "12" ? '' : ' prim') + '" data-per="mois">Ce mois-ci</button><button class="abtn' + (FILTRE.per === "12" ? ' prim' : '') + '" data-per="12">12 derniers mois</button></div><div id="gStats"><p class="sous">Chargement des statistiques…</p></div>'
      + '<p class="sous" style="font-size:.78rem;margin-top:12px">Anonyme : on compte seulement combien de fois chaque livre, quiz ou outil est ouvert, jamais par qui.</p>';
    const volHist = '<div class="acces-sec" style="margin-top:0;border-top:0;padding-top:0"><h3>Sauvegarde</h3><p class="sous">Une copie complète des comptes, des accès et des réglages des livres. Garde-la dans ton OneDrive.</p>'
      + '<div class="acces-btns" style="justify-content:flex-start"><button class="abtn prim" id="gSauve">Télécharger une sauvegarde</button><label class="abtn" for="gRest" style="cursor:pointer">Restaurer une sauvegarde</label><input type="file" id="gRest" accept=".json,application/json" hidden></div></div>'
      + '<div class="acces-sec"><h3>Historique des accès</h3><p class="sous">Chaque publication, avec ce qui a changé. « Revenir » remet les comptes et les accès de ce moment-là (vérifie, puis « Publier »).</p><div id="gHist"><p class="sous">Chargement…</p></div></div>';
    const volInvite = '<div class="acces-sec"><h3>Inviter un enseignant</h3><p class="sous">Envoie-lui ce lien (Teams, courriel) : sa demande arrive avec les bons programmes déjà cochés.</p>'
      + '<div class="acces-chips">' + progs.map(pg => '<label class="acces-chip"><input type="checkbox" class="invProg" value="' + esc(court(pg).toLowerCase()) + '" checked><span>' + esc(progNom(pg)) + '</span></label>').join("") + '</div>'
      + '<div class="acces-btns" style="justify-content:flex-start"><button class="abtn prim" id="gInv">' + ICO.lien + ' Copier le lien d\'invitation</button><span class="acces-ok" id="gInvOk" hidden style="margin:0">Lien copié !</span></div></div>';
    const puce = (v, l) => '<button class="abtn' + (FILTRE.type === v ? ' prim' : '') + '" data-ftype="' + esc(v) + '">' + esc(l) + '</button>';
    const st0 = box().scrollTop;
    box().innerHTML = '<div class="acces-tete"><img class="ad-logo lg-blc" src="img/metier-plus-blanc.svg" alt="Métier+"><img class="ad-logo lg-clr" src="img/metier-plus.svg" alt=""><div><h2>Administration</h2><p class="sous" style="margin:0">Comptes, livres et suivi</p></div></div>'
      + '<div class="acces-stats"><div><b>' + nProf + '</b><span>enseignant' + (nProf > 1 ? 's' : '') + '</span></div><div><b>' + nGr + '</b><span>groupe' + (nGr > 1 ? 's' : '') + ' d\'élèves</span></div>'
      + '<div><b>' + livres.length + '</b><span>livres protégés</span></div><div class="dem"><b id="gStatDem">…</b><span>demandes</span></div>'
      + '<div class="' + (aPublier ? 'pub' : 'ok') + '"><b>' + (aPublier ? '!' : '✓') + '</b><span>' + (aPublier ? 'à publier' : 'tout est publié') + '</span></div></div>'
      + '<nav class="acces-onglets">' + grpT("Vue d'ensemble") + ong("accueil", "Tableau de bord")
        + grpT("Personnes") + ong("profs", "Comptes et accès") + ong("groupes", "Groupes et élèves") + ong("voir", "Voir comme un collègue") + ong("diff", "Message et mise à jour")
        + grpT("Contenu") + ong("livres", "Livres") + ong("ajliv", "Ajouter un livre") + ong("defi", "Défi+ des livres") + ong("nouv", "Quoi de neuf") + ong("props", "Propositions") + ong("magasin", "Magasin") + ong("classe", "Classe et atelier")
        + grpT("Suivi") + ong("stats", "Statistiques") + ong("journaux", "Fluidité") + ong("site", "Signalements et état") + ong("hist", "Historique et copies")
        + grpT("Site") + ong("auto", "Automatisations") + '</nav>'
      + '<div class="acces-pane"' + vol("profs") + '><details class="acces-info"><summary>Comment ça marche</summary><p class="sous">Touche « Choisir les livres » pour cocher les livres d\'un enseignant, ou ses programmes (EGI, Plomberie) pour tout lui donner d\'un coup. Pastille verte : venu dans les 7 derniers jours. Les changements partent en ligne quand tu touches « Publier ».</p></details>'
      + '<div class="acces-outils"><input type="text" id="gQ" enterkeyhint="search" placeholder="Chercher un nom…" value="' + esc(FILTRE.q) + '" autocomplete="off">'
      + '<select id="gTri" title="Trier"><option value="nom"' + (FILTRE.tri === "nom" ? " selected" : "") + '>Trier : nom de famille</option><option value="prog"' + (FILTRE.tri === "prog" ? " selected" : "") + '>Trier : programme</option><option value="peu"' + (FILTRE.tri === "peu" ? " selected" : "") + '>Trier : moins de livres</option></select>'
      + '<div class="acces-puces">' + puce("tous", "Tous") + puce("prof", "Enseignants") + progs.map(pg => puce(pg, court(pg))).join("") + puce("eleve", "Groupes") + '</div></div>'
      + (livres.length ? '<div class="acces-fiches">' + lignes + '<p class="sous" id="gRien" hidden>Personne ne correspond à ta recherche.</p></div>' : '<p class="sous">Aucun livre protégé pour l\'instant.</p>')
      + '<div class="acces-sec"><h3>Groupes d\'élèves</h3><p class="sous">Un compte partagé par un groupe (ex. sur les cellulaires des élèves) : les livres cochés en lecture, crayon et texte, <b>sans les réponses</b> ni les outils du prof.</p>'
      + '<details id="gGrp"' + (OUVERTS.has("#grp") ? ' open' : '') + ' style="margin-top:6px"><summary style="cursor:pointer;color:#a9a9ae;font-size:.88rem">+ Créer un groupe</summary>'
      + '<label for="grNom">Nom du groupe</label><input type="text" id="grNom" placeholder="ex. EGI Groupe A">'
      + '<label for="grMdp">Mot de passe à donner aux élèves (au moins 6 caractères)</label><input type="text" id="grMdp" autocomplete="off" placeholder="ex. pavillon2026">'
      + '<label>Livres du programme</label><div class="acces-chips">' + progs.map(pg => '<label class="acces-chip"><input type="checkbox" class="grProg" value="' + esc(pg) + '"><span>' + esc(progNom(pg)) + '</span></label>').join("") + '</div>'
      + '<div class="acces-btns" style="justify-content:flex-start"><button class="abtn prim" id="grOui">Créer le groupe</button></div></details></div>'
      + '<div class="acces-sec"><h3>Demandes reçues</h3><div id="gBoite"><p class="sous">Recherche des demandes…</p></div>'
      + '<details style="margin-top:8px"><summary style="cursor:pointer;color:#a9a9ae;font-size:.88rem">Coller un code reçu autrement (Teams, courriel)</summary><textarea id="gDem" placeholder="Colle ici le code DEMANDE-… reçu de l\'enseignant"></textarea><div class="acces-btns" style="justify-content:flex-start"><button class="abtn" id="gAjout">Ajouter cet enseignant</button></div></details></div>'
      + volInvite + '</div>'
      + '<div class="acces-pane"' + vol("livres") + '>' + volLivres + '</div>'
      + '<div class="acces-pane"' + vol("props") + '><div id="gProps"><p class="sous">Chargement…</p></div></div>'
      + '<div class="acces-pane"' + vol("stats") + '>' + volStats + '</div>'
      + '<div class="acces-pane"' + vol("hist") + '>' + volHist + '</div>'
      + '<div class="acces-pane"' + vol("site") + '><div id="gSite"></div></div>'
      + ["accueil", "nouv", "classe", "groupes", "journaux", "auto", "diff", "voir", "defi", "ajliv", "magasin"].map(k => '<div class="acces-pane"' + vol(k) + '><div id="gPlus_' + k + '"><p class="sous">Chargement…</p></div></div>').join("")
      + (aRech.length ? '<label class="acces-rech"><input type="checkbox" id="gRech" checked><span><b>Couper vraiment l\'accès</b> : nouvelle clé pour ' + aRech.map(f => '« ' + esc(titreDe(f)) + ' »').join(", ") + '. Une vieille copie gardée par quelqu\'un qui n\'a plus l\'accès ne s\'ouvrira plus (un peu plus long à publier).</span></label>' : '')
      + (jeton   /* clé déjà enregistrée : invisible et impossible à changer dans le panneau (demande de Jeremy, 8 nov.); redemandée seulement si GitHub la refuse */
        ? '<input type="hidden" id="gJeton" value="">'
        : '<p class="sous acces-nocle">Cet appareil n\'a pas encore la clé GitHub : tu peux regarder sans rien publier. <a href="#" id="gAct" style="color:#a9a9ae">Activer la publication ici</a> (une seule fois : la clé ne pourra plus être changée ni affichée).</p>'
          + '<div id="gActZone" hidden><input type="password" id="gJeton" placeholder="Clé GitHub (github_pat_…)" value="" autocomplete="off"><div class="acces-btns" style="justify-content:flex-start"><button class="abtn prim" id="gActOk">Enregistrer la clé</button></div></div>')
      + '<div class="acces-pied"><div class="acces-err" id="gErr"' + (msg && msg.err ? "" : " hidden") + '>' + (msg && msg.err ? esc(msg.err) : "") + '</div><div class="acces-ok" id="gOk"' + (msg && msg.ok ? "" : " hidden") + '>' + (msg && msg.ok ? esc(msg.ok) : "") + '</div>'
      + '<div class="acces-btns"><span class="acces-etat' + (aPublier ? ' pub' : '') + '">' + (aPublier ? 'Des changements attendent d\'être publiés' : 'Tout est publié') + '</span><button id="gNon">Fermer</button>' + (jeton ? '<button class="prim" id="gPub">Publier</button>' : '') + '</div></div>';
    const B = box(); B.scrollTop = st0;
    B.querySelectorAll("[data-ong]").forEach(b => b.onclick = () => { ONGLET = b.dataset.ong; B.querySelectorAll("[data-ong]").forEach(x => x.classList.toggle("on", x === b));
      B.querySelectorAll(".acces-pane").forEach(p => { p.hidden = p.dataset.pane !== ONGLET; p.classList.toggle("anim", !p.hidden); }); voletCharge(); });
    const sdem = B.querySelector(".acces-stats .dem"); if (sdem) sdem.onclick = () => B.querySelector('[data-ong="profs"]').click();
    B.querySelectorAll("[data-rl]").forEach(b => b.onclick = () => { const f = b.dataset.f, l = [...LIVRES, ...LIVRES_CACHES].find(x => x.fichier === f), k = b.dataset.rl;
      if (k === "vis") REGL.caches = REGL.caches.includes(f) ? REGL.caches.filter(x => x !== f) : REGL.caches.concat(f);
      if (k === "constr") REGL.construction[f] = !constrDe(l);
      if (k === "nouv") REGL.nouveau[f] = nouvDe(l) ? false : new Date().toLocaleDateString("en-CA");
      if (k === "ved"){ REGL.vedette = REGL.vedette.includes(f) ? REGL.vedette.filter(x => x !== f) : [f].concat(REGL.vedette).slice(0, 3); }
      dessinerGerer(); });
    B.querySelectorAll("[data-rech]").forEach(b => b.onclick = () => { const f = b.dataset.rech; FORCER_RECH.has(f) ? FORCER_RECH.delete(f) : FORCER_RECH.add(f); dessinerGerer(); });
    B.querySelectorAll("[data-per]").forEach(b => b.onclick = () => { FILTRE.per = b.dataset.per; B.querySelectorAll("[data-per]").forEach(x => x.classList.toggle("prim", x === b)); dessinerStats(); });
    const gInv = document.getElementById("gInv"); if (gInv) gInv.onclick = () => { const pr = [...B.querySelectorAll(".invProg:checked")].map(x => x.value).join(",");
      const lien = location.origin + location.pathname + "#inviter=" + encodeURIComponent(pr || "tous"); try { navigator.clipboard.writeText(lien); } catch(e){} document.getElementById("gInvOk").hidden = false; prompt("Lien d'invitation (déjà copié) :", lien); };
    document.getElementById("gSauve").onclick = () => { const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify({ type:"metier-plus-sauvegarde", date:new Date().toISOString(), comptes:BROUILLON, reglages:REGL }, null, 1)], { type:"application/json" }));
      a.download = "metier-plus-sauvegarde-" + new Date().toLocaleDateString("en-CA") + ".json"; a.click(); };
    document.getElementById("gRest").onchange = async e => { const fi = e.target.files[0]; if (!fi) return;
      try { const j = JSON.parse(await fi.text()), c = j.type === "metier-plus-sauvegarde" ? j.comptes : j; if (!c || !c.comptes || !c.livres) throw new Error("ce fichier n'est pas une sauvegarde");
        await restaurer(c); if (j.reglages) REGL = Object.assign({ caches:[], construction:{}, nouveau:{}, vedette:[] }, j.reglages); ONGLET = "profs";
        dessinerGerer({ ok:"Sauvegarde du " + (j.date ? new Date(j.date).toLocaleDateString("fr-CA") : "fichier") + " chargée. Vérifie, puis touche « Publier »." }); }
      catch(x){ dessinerGerer({ err:"Restauration impossible : " + x.message }); } };
    voletCharge();
    if (window.COFFRE && COFFRE.vu) ids.filter(id => !(id in VU)).forEach(id => COFFRE.vu(id).then(d => { VU[id] = d; const s = B.querySelector('[data-vu="' + CSS.escape(id) + '"]'); if (s){ s.className = "vu " + fraicheur(d); s.innerHTML = "<i></i>" + ilYa(d); } }).catch(() => { VU[id] = 0; }));
    else ids.forEach(id => { const s = B.querySelector('[data-vu="' + CSS.escape(id) + '"]'); if (s && s.textContent === "…") s.textContent = ""; });
    const gQ = document.getElementById("gQ"); if (gQ){ gQ.oninput = () => { FILTRE.q = gQ.value; filtrerFiches(); };
      document.getElementById("gTri").onchange = e => { FILTRE.tri = e.target.value; dessinerGerer(); };
      B.querySelectorAll("[data-ftype]").forEach(b => b.onclick = () => { FILTRE.type = b.dataset.ftype; B.querySelectorAll("[data-ftype]").forEach(x => x.classList.toggle("prim", x === b)); filtrerFiches(); });
      filtrerFiches(); }
    const gG = document.getElementById("gGrp"); if (gG) gG.ontoggle = () => { gG.open ? OUVERTS.add("#grp") : OUVERTS.delete("#grp"); };
    const grO = document.getElementById("grOui"); if (grO) grO.onclick = async () => {
      const nom = document.getElementById("grNom").value.trim(), m = document.getElementById("grMdp").value.trim(), pr = [...B.querySelectorAll(".grProg:checked")].map(x => x.value);
      if (nom.length < 3) return dessinerGerer({ err:"Donne un nom au groupe (ex. EGI Groupe A)." });
      if (m.length < 6) return dessinerGerer({ err:"Le mot de passe du groupe doit avoir au moins 6 caractères." });
      if (BROUILLON.comptes[idDe(nom)]) return dessinerGerer({ err:"Ce nom est déjà pris. Choisis-en un autre." });
      grO.disabled = true; grO.textContent = "Création…";
      try { const d = lireDemande(await demande(nom, m, pr)); d.eleve = true; await remplacerCompte(d); OUVERTS.delete("#grp");
        dessinerGerer({ ok:"Groupe « " + nom + " » créé. Les élèves se connectent avec l'identifiant " + d.id + " et le mot de passe " + m + ". Touche « Publier »." }); }
      catch(e){ dessinerGerer({ err:e.message }); } };
    B.querySelectorAll("details[data-fiche]").forEach(d => d.ontoggle = () => { d.open ? OUVERTS.add(d.dataset.fiche) : OUVERTS.delete(d.dataset.fiche); });
    B.querySelectorAll("input[type=checkbox][data-f]").forEach(cb => cb.onchange = async () => {
      const f = cb.dataset.f, id = cb.dataset.id; cb.disabled = true;
      try { if (cb.checked) BROUILLON.livres[f].cles[id] = await envelopper(f, BROUILLON.comptes[id].pub); else delete BROUILLON.livres[f].cles[id]; }
      catch(e){ cb.checked = !cb.checked; dessinerGerer({ err:e.message }); return; }
      dessinerGerer(); });
    B.querySelectorAll("[data-chef]").forEach(b => b.onclick = () => { const c = BROUILLON.comptes[b.dataset.chef]; c.chef = !c.chef; if (!c.chef) delete c.chef; dessinerGerer(); });
    B.querySelectorAll("[data-ajout]").forEach(b => b.onclick = () => { const c = BROUILLON.comptes[b.dataset.ajout]; c.ajout = !c.ajout; if (!c.ajout) delete c.ajout;
      dessinerGerer({ ok:c.nom + (c.ajout ? " pourra ajouter ses propres documents" : " ne pourra plus ajouter de documents") + " (après « Publier »)." }); });
    B.querySelectorAll("[data-prog]").forEach(b => b.onclick = async () => { const id = b.dataset.pid, pg = b.dataset.prog, c = BROUILLON.comptes[id];
      c.prog = c.prog || []; const ajoute = !c.prog.includes(pg); c.prog = ajoute ? c.prog.concat(pg) : c.prog.filter(x => x !== pg);
      try { await appliquerProgs(id, ajoute ? [pg] : [], ajoute ? [] : [pg]); dessinerGerer({ ok:c.nom + (ajoute ? " a maintenant tous les livres « " : " n'a plus les livres « ") + court(pg) + " »." }); }
      catch(e){ dessinerGerer({ err:e.message }); } });
    B.querySelectorAll("[data-mdp]").forEach(b => b.onclick = async () => { const id = b.dataset.mdp, c = BROUILLON.comptes[id];
      if (!c) return dessinerGerer({ err:"Ce compte n'est plus dans la liste. Ferme puis rouvre le panneau." });
      const m = prompt("Nouveau mot de passe pour " + c.nom + " (au moins 10 caractères).\nDonne-le-lui ensuite; il pourra se connecter dès que tu auras publié.", ""); if (m === null) return;
      if (m.length < 10) return dessinerGerer({ err:"Le mot de passe doit avoir au moins 10 caractères." });
      try { const d = lireDemande(await demande(c.nom, m, c.prog || [])); d.id = id; await remplacerCompte(d); dessinerGerer({ ok:"Nouveau mot de passe de " + c.nom + " prêt. Touche « Publier », puis donne-lui son mot de passe." }); }
      catch(e){ dessinerGerer({ err:e.message }); } });
    B.querySelectorAll("[data-retirer]").forEach(b => b.onclick = () => { const id = b.dataset.retirer;
      if (!confirm("Retirer le compte de " + BROUILLON.comptes[id].nom + " ?")) return;
      delete BROUILLON.comptes[id]; for (const f in BROUILLON.livres) delete BROUILLON.livres[f].cles[id]; dessinerGerer(); });
    document.getElementById("gAjout").onclick = () => { try { const d = lireDemande(document.getElementById("gDem").value);
        remplacerCompte(d).then(anc => dessinerGerer({ ok:anc ? "Nouveau mot de passe de " + d.nom + " prêt (ses livres sont gardés). Touche « Publier »."
            : d.nom + " est ajouté" + ((d.prog || []).length ? " avec les livres de : " + d.prog.map(court).join(", ") : "") + ". Vérifie les cases, puis touche « Publier »." }))
          .catch(e => dessinerGerer({ err:e.message })); }
      catch(e){ dessinerGerer({ err:"Ce code n'est pas une demande valide." }); } };
    lireBoite().then(vues => { const zone = document.getElementById("gBoite"); if (!zone) return;
      const att = Object.keys(vues || {}).map(id => { try { return Object.assign(lireDemande(vues[id].code), { t:vues[id].t, code:vues[id].code }); } catch(e){ return null; } })
        .filter(d => d && (!BROUILLON.comptes[d.id] || BROUILLON.comptes[d.id].pub.x !== d.pub.x)).sort((a, b) => b.t - a.t);
      const sd = document.getElementById("gStatDem"); if (sd){ sd.textContent = att.length; sd.parentNode.classList.toggle("on", att.length > 0); }
      zone.innerHTML = att.length ? att.map(d => '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #2a2a2f"><div style="flex:1"><b>' + esc(d.nom) + '</b> <small style="color:#8c8c92">' + esc(d.id) + '</small><br><small style="color:#a9a9ae">' + (BROUILLON.comptes[d.id] ? '<b style="color:#ffb020">Nouveau mot de passe</b>' : (d.prog || []).map(court).join(", ")) + ' · ' + new Date(d.t * 1000).toLocaleString("fr-CA", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" }) + '</small></div>'
        + '<button class="abtn prim" data-acc="' + esc(d.id) + '">Accepter</button><button class="abtn" data-ign="' + esc(d.id) + '">Ignorer</button></div>').join("") : '<p class="sous" style="margin:0">Aucune demande en attente.</p>';
      zone.querySelectorAll("[data-acc]").forEach(bt => bt.onclick = () => { const d = att.find(x => x.id === bt.dataset.acc); document.getElementById("gDem").value = d.code; document.getElementById("gAjout").click(); });
      zone.querySelectorAll("[data-ign]").forEach(bt => bt.onclick = () => { oublierDemande(bt.dataset.ign, true); compterDemandes && compterDemandes().catch(()=>{}); dessinerGerer({ ok:"Demande ignorée." }); }); });
    document.getElementById("gNon").onclick = fermer;
    const gT = document.getElementById("gTel"); if (gT) gT.onclick = () => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(BROUILLON, null, 1)], { type:"application/json" })); a.download = "comptes.json"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 3000); };
    const chg = document.getElementById("gChg"); if (chg) chg.onclick = e => { e.preventDefault(); const z = document.getElementById("gJetZone"); z.hidden = false; const i = document.getElementById("gJeton"); i.value = ""; i.focus(); chg.parentNode.hidden = true; };
    const gAct = document.getElementById("gAct"); if (gAct){ gAct.onclick = e => { e.preventDefault(); document.getElementById("gActZone").hidden = false; document.getElementById("gJeton").focus(); };
      document.getElementById("gActOk").onclick = () => { const v = document.getElementById("gJeton").value.trim(); if (!/^(github_pat_|ghp_)/.test(v)) return dessinerGerer({ err:"Ce n'est pas une clé GitHub (elle commence par github_pat_)." });
        try { localStorage.setItem("ghJeton", v); } catch(x){} dessinerGerer({ ok:"Clé enregistrée sur cet appareil. Tu peux maintenant publier d'ici." }); }; }
    if (document.getElementById("gPub")) document.getElementById("gPub").onclick = async () => {
      let jt = document.getElementById("gJeton").value.trim(); if (!jt) jt = jeton; if (!jt) return dessinerGerer({ err:"Colle d'abord ta clé GitHub (ou utilise « Télécharger comptes.json »)." });
      try { localStorage.setItem("ghJeton", jt); } catch(e){}
      const bt = document.getElementById("gPub"); bt.disabled = true; bt.textContent = "Publication…";
      try { const frais = await enLigne();   /* quelqu'un (ou un autre appareil) a publié depuis l'ouverture du panneau : ne pas écraser son travail */
        if (frais && JSON.stringify(frais) !== JSON.stringify(DATA)){   /* fusion : mes changements (DATA → BROUILLON) posés sur la version en ligne, celle des autres est gardée */
          const J = x => JSON.stringify(x === undefined ? null : x), M = clone(frais); M.comptes = M.comptes || {}; M.livres = M.livres || {};
          const ids = new Set([...Object.keys(DATA.comptes || {}), ...Object.keys(BROUILLON.comptes || {})]);
          ids.forEach(id => { const a = (DATA.comptes || {})[id], b = (BROUILLON.comptes || {})[id]; if (J(a) === J(b)) return; if (b) M.comptes[id] = clone(b); else delete M.comptes[id]; });
          const fs = new Set([...Object.keys(DATA.livres || {}), ...Object.keys(BROUILLON.livres || {})]);
          fs.forEach(f => { const a = (DATA.livres || {})[f], b = (BROUILLON.livres || {})[f], m = M.livres[f];
            if (J(a) === J(b)) return;
            if (!b){ delete M.livres[f]; return; }
            if (!m || !a){ M.livres[f] = clone(b); return; }
            if (J((m.cles || {})[SESSION.id]) !== J((a.cles || {})[SESSION.id])) return;   /* livre rechiffré en ligne entre-temps : on garde la version en ligne */
            const ks = new Set([...Object.keys(a.cles || {}), ...Object.keys(b.cles || {})]); m.cles = m.cles || {};
            ks.forEach(id => { const x = (a.cles || {})[id], y = (b.cles || {})[id]; if (x === y) return; if (y) m.cles[id] = y; else delete m.cles[id]; }); });
          for (const f in M.livres) for (const id in (M.livres[f].cles || {})) if (!M.comptes[id]) delete M.livres[f].cles[id];   /* pas de clé pour un compte retiré */
          DATA = frais; BROUILLON = M; try { localStorage.setItem("accesCopie", JSON.stringify(DATA)); } catch(e){} }
        const D2 = clone(BROUILLON), fichiers = {}, rch = document.getElementById("gRech") && document.getElementById("gRech").checked ? aRech : [];
        for (const f of rch){ bt.textContent = "Nouvelle clé : « " + titreDe(f) + " »…"; Object.assign(fichiers, await rechiffrer(f, D2)); }
        if (JSON.stringify(D2) !== JSON.stringify(DATA)) fichiers["comptes.json"] = JSON.stringify(D2, null, 1);
        if (JSON.stringify(REGL) !== JSON.stringify(REGLAGES)) fichiers["reglages.json"] = JSON.stringify(REGL, null, 1);
        Object.assign(fichiers, EXTRA);
        if (!Object.keys(fichiers).length) return dessinerGerer({ ok:"Rien à publier : tout est déjà en ligne." });
        bt.textContent = "Envoi…";
        await commitGitHub(jt, fichiers, "Administration : " + [fichiers["comptes.json"] && "accès", fichiers["reglages.json"] && "réglages", rch.length && rch.length + " livre(s) rechiffré(s)", EXTRA_LIV.size && [...EXTRA_LIV].join(", ") + " (livre ajouté ou remplacé)"].filter(Boolean).join(", "));
        BROUILLON = D2; DATA = clone(D2); rch.forEach(f => delete CLES[f]); EXTRA_LIV.forEach(f => delete CLES[f]); FORCER_RECH.clear(); for (const k in EXTRA) delete EXTRA[k]; EXTRA_LIV.clear(); if (fichiers["reglages.json"]){ appliquerReglages(clone(REGL)); }
        try { localStorage.setItem("accesCopie", JSON.stringify(DATA)); } catch(e){}
        box().classList.remove("large", "gestion"); box().innerHTML = succes('Publié !', '<p class="sous">Les changements seront en ligne d\'ici une minute ou deux.</p><div class="acces-btns" style="justify-content:center"><button id="gRet">Retour aux accès</button><button class="prim" id="gFin2">Fermer</button></div>');
        document.getElementById("gRet").onclick = () => { box().classList.add("large", "gestion"); dessinerGerer(); }; document.getElementById("gFin2").onclick = fermer;
        try { render(); } catch(e){} compterDemandes().catch(() => {}); }
      catch(e){ const refusee = /401|403|Bad credentials|refusée/i.test(e.message);   /* la clé reste enregistrée : personne ne peut la changer d'ici */
        dessinerGerer({ err:refusee ? "GitHub a refusé la clé enregistrée (elle a peut-être expiré). Demande à Claude de la remplacer." : "Publication impossible : " + e.message}); } };
  }
  let STATS = null, HIST = null;
  function voletCharge(){ if (ONGLET === "props" && window.MESDOCS) MESDOCS.panneau(document.getElementById("gProps")); if (ONGLET === "stats") chargerStats(); if (ONGLET === "hist") chargerHist(); if (ONGLET === "site" && window.ADMIN_SITE) ADMIN_SITE.dessiner(document.getElementById("gSite"), REGL, () => dessinerGerer());
    if (window.ADMIN_PLUS && document.getElementById("gPlus_" + ONGLET)) ADMIN_PLUS.dessiner(ONGLET, document.getElementById("gPlus_" + ONGLET)); }
  async function chargerStats(){ if (STATS) return dessinerStats();
    try { STATS = await COFFRE.statsLire(); } catch(e){ const z = document.getElementById("gStats"); if (z) z.innerHTML = '<div class="acces-vide">' + ICO.stats + '<p>Les statistiques commencent dès que la table <b>stats</b> existe dans Supabase (commande SQL envoyée par Claude). Elles se remplissent ensuite toutes seules.</p></div>'; return; }
    dessinerStats(); }
  function dessinerStats(){ const z = document.getElementById("gStats"); if (!z || !STATS) return;
    const mois = new Date().toLocaleDateString("en-CA").slice(0, 7), somme = {};
    STATS.filter(r => !/^test:/.test(r.cle) && (FILTRE.per === "12" || r.mois === mois)).forEach(r => somme[r.cle] = (somme[r.cle] || 0) + r.n);
    const nomQuiz = id => id.startsWith("livre-") ? titreDe(id.slice(6)) : id === "perso" ? "Défi+ faits par les enseignants" : id === "exemple-incendie" ? "Quiz d'exemple (protection incendie)" : id;
    const OUT = { tableau:"Tableau blanc", plans:"Plans techniques", activites:"Formatifs", labo:"Labo", accueil:"Accueil de classe", telecommande:"Télécommande des livres" };
    const bloc = (titre, pref, nom, coul) => { const L = Object.keys(somme).filter(k => k.startsWith(pref)).map(k => [nom(k.slice(pref.length)), somme[k]]).sort((a, b) => b[1] - a[1]).slice(0, 10);
      const max = Math.max(1, ...L.map(x => x[1]));
      return '<div class="acces-graph"><h3>' + titre + '</h3>' + (L.length ? L.map(([n, v]) => '<div class="br"><span class="n" title="' + esc(n) + '">' + esc(n) + '</span><span class="b"><i style="width:' + Math.max(3, v / max * 100) + '%;background:' + coul + '"></i></span><b>' + v + '</b></div>').join("") : '<p class="sous" style="margin:0">Rien encore pour cette période.</p>') + '</div>'; };
    const tot = Object.values(somme).reduce((a, b) => a + b, 0);
    z.innerHTML = '<div class="acces-total"><b>' + tot + '</b> ouvertures ' + (FILTRE.per === "12" ? "dans les 12 derniers mois" : "ce mois-ci") + '</div>'
      + bloc("Livres les plus ouverts", "livre:", titreDe, "var(--accent)") + bloc("Défi+ les plus joués", "quiz:", nomQuiz, "#8B6CE0") + bloc("Outils", "outil:", k => OUT[k] || k, "#14A3A3") + bloc("Simulateurs", "simu:", k => k === "defi" ? "Défi panneau" : "Panneau d'alarme (libre)", "#E0892B"); }
  async function chargerHist(){ const z = document.getElementById("gHist"); if (!z) return; if (HIST) return dessinerHist();
    try { let jeton = ""; try { jeton = localStorage.getItem("ghJeton") || ""; } catch(e){}
      const r = await fetch("https://api.github.com/repos/" + DEPOT + "/commits?path=comptes.json&per_page=15", { headers:jeton ? { Authorization:"Bearer " + jeton } : {}, cache:"no-store" });
      if (!r.ok) throw new Error("GitHub " + r.status); const L = await r.json();
      const vers = await Promise.all(L.map(c => fetch("https://raw.githubusercontent.com/" + DEPOT + "/" + c.sha + "/comptes.json").then(x => x.ok ? x.json() : null).catch(() => null)));
      HIST = L.map((c, i) => ({ date:c.commit.author.date, d:vers[i], avant:vers[i + 1] })).filter(h => h.d); dessinerHist(); }
    catch(e){ z.innerHTML = '<p class="sous">Historique indisponible pour l\'instant (' + esc(/fetch|network|load/i.test(e.message || "") ? "pas de connexion à GitHub : vérifie Internet et réessaie" : e.message) + ').</p>'; } }
  function changements(a, b){ const out = [], nom = id => (b.comptes[id] || (a && a.comptes[id]) || {}).nom || id, court = f => titreDe(f).replace(/\s*[:(].*$/, "");
    if (!a) return [["neutre", "Première version"]];
    for (const id in b.comptes) if (!a.comptes[id]) out.push(["plus", "Nouveau compte : " + nom(id)]); else if (a.comptes[id].pub.x !== b.comptes[id].pub.x || a.comptes[id].pub.n !== b.comptes[id].pub.n) out.push(["neutre", "Nouveau mot de passe : " + nom(id)]);
    for (const id in a.comptes) if (!b.comptes[id]) out.push(["moins", "Compte retiré : " + nom(id)]);
    const gain = {}, perte = {};
    for (const f of new Set([...Object.keys(a.livres), ...Object.keys(b.livres)])){ const ca = (a.livres[f] || {}).cles || {}, cb = (b.livres[f] || {}).cles || {};
      for (const id in cb) if (!ca[id] && a.comptes[id]) (gain[id] = gain[id] || []).push(court(f));
      for (const id in ca) if (!cb[id] && b.comptes[id]) (perte[id] = perte[id] || []).push(court(f)); }
    for (const id in gain) out.push(["plus", nom(id) + " : + " + gain[id].join(", ")]);
    for (const id in perte) out.push(["moins", nom(id) + " : − " + perte[id].join(", ")]);
    return out.length ? out : [["neutre", "Nouvelles clés de livres (mise à jour d'un livre)"]]; }
  function dessinerHist(){ const z = document.getElementById("gHist"); if (!z) return;
    z.innerHTML = '<div class="acces-hist">' + HIST.map((h, i) => '<div class="h"><div class="d"><b>' + new Date(h.date).toLocaleDateString("fr-CA", { day:"numeric", month:"short" }) + '</b><span>' + new Date(h.date).toLocaleTimeString("fr-CA", { hour:"2-digit", minute:"2-digit" }) + '</span></div>'
      + '<div class="c">' + changements(h.avant, h.d).map(([s, t]) => '<span class="' + s + '">' + esc(t) + '</span>').join("") + '</div>'
      + (i ? '<button class="abtn" data-hv="' + i + '">Revenir</button>' : '<span class="act">Version en ligne</span>') + '</div>').join("") + '</div>';
    z.querySelectorAll("[data-hv]").forEach(b => b.onclick = async () => { const h = HIST[+b.dataset.hv];
      if (!confirm("Remettre les comptes et les accès du " + new Date(h.date).toLocaleString("fr-CA") + " ? Rien ne part tant que tu ne touches pas « Publier ».")) return;
      try { await restaurer(h.d); ONGLET = "profs"; dessinerGerer({ ok:"Accès du " + new Date(h.date).toLocaleDateString("fr-CA") + " remis. Vérifie, puis touche « Publier »." }); } catch(e){ dessinerGerer({ err:e.message }); } }); }
  /* remet les comptes et les accès d'une ancienne version, avec les clés ACTUELLES des livres (une vieille enveloppe ne marcherait plus après un rechiffrement) */
  async function restaurer(V){ const D = BROUILLON;
    for (const id in V.comptes) if (!D.comptes[id]) D.comptes[id] = clone(V.comptes[id]); else D.comptes[id].prog = clone(V.comptes[id].prog || []);
    for (const id of Object.keys(D.comptes)) if (!V.comptes[id] && !D.comptes[id].admin){ delete D.comptes[id]; for (const f in D.livres) delete D.livres[f].cles[id]; }
    for (const f in D.livres) for (const id in D.comptes){ if (D.comptes[id].admin) continue; const veut = !!(V.livres[f] && V.livres[f].cles[id]), a = !!D.livres[f].cles[id];
      if (veut && !a) D.livres[f].cles[id] = await envelopper(f, D.comptes[id].pub); if (!veut && a) delete D.livres[f].cles[id]; } }
  /* lien d'invitation : #inviter=egi,plomberie → demande d'accès avec ces programmes déjà cochés */
  async function invitationDepuisLien(){ const m = location.hash.match(/^#inviter=(.*)$/); if (!m) return; await pret; history.replaceState(null, "", location.pathname + location.search);
    if (SESSION) return; const v = decodeURIComponent(m[1]).split(","); dlgDemande(false); ov().hidden = false;
    document.querySelectorAll(".dProg").forEach(c => { const k = /plomberie/i.test(c.value) ? "plomberie" : /entretien/i.test(c.value) ? "egi" : c.value.toLowerCase(); c.checked = v.includes("tous") || v.includes(k); }); }
  async function remplacerCompte(d){          /* nouveau compte, ou nouveau mot de passe d'un compte existant (ses livres sont gardés) */
    const anc = BROUILLON.comptes[d.id], avait = anc ? Object.keys(BROUILLON.livres).filter(f => BROUILLON.livres[f].cles[d.id]) : [];
    BROUILLON.comptes[d.id] = { nom:anc ? anc.nom : d.nom, pub:d.pub, priv:d.priv, admin:anc ? !!anc.admin : false, prog:anc ? (anc.prog || []) : (d.prog || []) };
    if (anc ? anc.eleve : d.eleve) BROUILLON.comptes[d.id].eleve = true;
    for (const f in BROUILLON.livres) delete BROUILLON.livres[f].cles[d.id];
    for (const f of avait) BROUILLON.livres[f].cles[d.id] = await envelopper(f, d.pub);
    if (!anc) await appliquerProgs(d.id, d.prog || [], []);
    return !!anc;
  }
  async function appliquerProgs(id, ajouter, retirer){       /* donne / retire tous les livres protégés d'un programme */
    for (const f in BROUILLON.livres){ const l = LIVRES.find(x => x.fichier === f); if (!l) continue;
      if (ajouter.includes(l.categorie) && !BROUILLON.livres[f].cles[id]) BROUILLON.livres[f].cles[id] = await envelopper(f, BROUILLON.comptes[id].pub);
      if (retirer.includes(l.categorie)) delete BROUILLON.livres[f].cles[id]; } }
  const DEPOT = "cfppaplc/bibliotheque";
  /* 25 nov. (panneau d'administration complet) : ce dont js/admin-plus.js a besoin */
  window.ACCES_ADMIN = {
    jeton: () => { try { return localStorage.getItem("ghJeton") || ""; } catch(e){ return ""; } },
    publier: (fichiers, message) => { let j = ""; try { j = localStorage.getItem("ghJeton") || ""; } catch(e){} if (!j) return Promise.reject(new Error("Cet appareil n'a pas la clé GitHub (Administration → bas de la page).")); return commitGitHub(j, fichiers, message); },
    aller: k => { const b = document.querySelector('.acces-onglets [data-ong="' + k + '"]'); if (b) b.click(); },
    demandes: () => NB_DEM,
    aPublier: () => { const e = document.querySelector(".acces-etat"); return !!(e && e.classList.contains("pub")); },
    stats: () => STATS,
    regl: () => REGL,
    redessiner: m => dessinerGerer(m),
    comptes: () => Object.entries(DATA.comptes).map(([id, c]) => ({ id, nom:c.nom, admin:!!c.admin, eleve:!!c.eleve, prog:c.prog || [] })),
    progs: () => PROGS(),
    livresProteges: () => Object.keys((BROUILLON || DATA).livres),
    extra: () => Object.keys(EXTRA),
    voirComme: id => { VOIR = id && DATA.comptes[id] ? id : null; const b0 = document.getElementById("mpVoir"); if (b0) b0.remove();
      const c = VOIR ? DATA.comptes[VOIR] : null;
      document.body.classList.toggle("eleve", c ? !!c.eleve : !!(SESSION && SESSION.eleve));   /* groupe d'élèves : mode élève comme sur son cellulaire */
      document.body.classList.toggle("voir-comme", !!c);
      if (c){ const prot = Object.keys(DATA.livres), ouv = prot.filter(f => DATA.livres[f].cles[VOIR]).length;
        const d = document.createElement("div"); d.id = "mpVoir";
        d.innerHTML = '<span>Aperçu comme <b></b>' + (c.eleve ? ' (groupe d\'élèves)' : '') + ' : ' + ouv + ' livre' + (ouv > 1 ? 's' : '') + ' protégé' + (ouv > 1 ? 's' : '') + ' ouvert' + (ouv > 1 ? 's' : '') + ' sur ' + prot.length + '. Les autres ont un cadenas.</span><button type="button">Revenir à mon compte</button>';
        d.querySelector("b").textContent = c.nom || VOIR; d.querySelector("button").onclick = () => ACCES_ADMIN.voirComme(null); document.body.appendChild(d); fermer(); scrollTo(0, 0); }
      try { render(); renderHero(); } catch(e){ console.error(e); } },
    /* Ajouter ou remplacer un livre (même format que outils/chiffrer.py) : livre et recherche chiffrés (gzip + AES-GCM), clés pour les comptes */
    preparerLivre: async o => {
      const f = o.f, D = BROUILLON, existe = !!D.livres[f];
      const gz = async u8 => new Uint8Array(await new Response(new Blob([u8]).stream().pipeThrough(new CompressionStream("gzip"))).arrayBuffer());
      const brut = crypto.getRandomValues(new Uint8Array(32)), cle = await sub.importKey("raw", brut, "AES-GCM", false, ["encrypt"]);
      const chiffrer = async u8 => { const iv = crypto.getRandomValues(new Uint8Array(12)), c = new Uint8Array(await sub.encrypt({ name:"AES-GCM", iv }, cle, await gz(u8))), out = new Uint8Array(12 + c.length); out.set(iv); out.set(c, 12); return out; };
      const doc = new DOMParser().parseFromString(o.html.replace(/data:[a-z/+.-]+;base64,[A-Za-z0-9+/=]+/g, ""), "text/html");
      doc.querySelectorAll("script,style,noscript").forEach(e => e.remove());
      const pages = [...doc.querySelectorAll(".page")].filter(p => !p.parentElement.closest(".page"));
      const textes = pages.map(p => { p.querySelectorAll(".ans,.reponse,.answer,.solution,.correction,[data-reponse]").forEach(a => a.remove()); return p.textContent.replace(/\s+/g, " ").trim().slice(0, 4000); });
      EXTRA["livres/" + f + ".chiffre"] = await chiffrer(enc.encode(o.html));
      EXTRA["recherche/" + f + ".chiffre"] = await chiffrer(enc.encode(JSON.stringify(textes)));
      const ids = existe ? Object.keys(D.livres[f].cles) : Object.keys(D.comptes).filter(id => D.comptes[id].admin || (o.categorie && (D.comptes[id].prog || []).includes(o.categorie)));
      if (!ids.includes(SESSION.id)) ids.push(SESSION.id);
      const cles = {}; for (const id of ids) if (D.comptes[id]) cles[id] = await envelopperPour(brut, D.comptes[id].pub);
      D.livres[f] = { cles }; EXTRA_LIV.add(f);
      Object.assign(EXTRA, o.autres || {});
      return { pages:pages.length, comptes:Object.keys(cles).length, existe };
    }
  };
  async function commitGitHub(jeton, fichiers, message, essai){   /* plusieurs fichiers en un seul commit (API Git Data) : comptes.json, reglages.json, livres rechiffrés */
    const api = "https://api.github.com/repos/" + DEPOT + "/git/", h = { Authorization:"Bearer " + jeton, Accept:"application/vnd.github+json", "Content-Type":"application/json" };
    const j = async (u, o) => { const r = await fetch(api + u, Object.assign({ headers:h, cache:"no-store" }, o)); if (r.status === 401) throw new Error("clé GitHub refusée"); if (!r.ok) throw new Error("GitHub a répondu " + r.status); return r.json(); };
    const ref = await j("ref/heads/main"), base = await j("commits/" + ref.object.sha), tree = [];
    for (const chemin in fichiers){ const v = fichiers[chemin], bl = await j("blobs", { method:"POST", body:JSON.stringify({ content:b64(typeof v === "string" ? enc.encode(v) : v), encoding:"base64" }) });
      tree.push({ path:chemin, mode:"100644", type:"blob", sha:bl.sha }); }
    const tr = await j("trees", { method:"POST", body:JSON.stringify({ base_tree:base.tree.sha, tree }) });
    const c = await j("commits", { method:"POST", body:JSON.stringify({ message, tree:tr.sha, parents:[ref.object.sha] }) });
    try { await j("refs/heads/main", { method:"PATCH", body:JSON.stringify({ sha:c.sha }) }); }
    catch(e){ if (essai) throw e; return commitGitHub(jeton, fichiers, message, true); }   /* quelqu'un a publié entre-temps : on recommence sur la nouvelle version */
  }
  /* Couper vraiment un accès : nouvelle clé pour le livre (et sa recherche), donnée seulement à ceux qui l'ont encore */
  async function rechiffrer(f, D){
    const env = DATA.livres[f] && DATA.livres[f].cles[SESSION.id]; if (!env) throw new Error("tu n'as pas la clé de « " + titreDe(f) + " »");
    const vieille = await sub.importKey("raw", new Uint8Array(await ouvrirEnveloppe(env)), "AES-GCM", false, ["decrypt"]);
    const brut = crypto.getRandomValues(new Uint8Array(32)), neuve = await sub.importKey("raw", brut, "AES-GCM", false, ["encrypt"]), out = {};
    for (const [dos, oblig] of [["livres/", true], ["recherche/", false]]){
      const r = await fetch(dos + f + ".chiffre?frais=" + Date.now(), { cache:"no-store" }); if (!r.ok){ if (oblig) throw new Error("livre introuvable : " + f); continue; }
      const u = new Uint8Array(await r.arrayBuffer()), clair = new Uint8Array(await sub.decrypt({ name:"AES-GCM", iv:u.subarray(0, 12) }, vieille, u.subarray(12)));
      const iv = crypto.getRandomValues(new Uint8Array(12)), c = new Uint8Array(await sub.encrypt({ name:"AES-GCM", iv }, neuve, clair)), o = new Uint8Array(12 + c.length); o.set(iv); o.set(c, 12);
      out[dos + f + ".chiffre"] = o; }
    const cles = {}; for (const id in D.livres[f].cles) if (D.comptes[id]) cles[id] = await envelopperPour(brut, D.comptes[id].pub);
    if (D.comptes[SESSION.id]) cles[SESSION.id] = await envelopperPour(brut, D.comptes[SESSION.id].pub);
    D.livres[f].cles = cles; return out;
  }
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !document.getElementById("accesOv").hidden) fermer(); });
  /* lien « Pour accepter » reçu par courriel : #accepter=<code> → panneau admin avec la demande déjà ajoutée */
  async function accepterDepuisLien(){
    const m = location.hash.match(/^#accepter=(.+)$/); if (!m) return; await pret;
    const code = "DEMANDE-" + decodeURIComponent(m[1]); history.replaceState(null, "", location.pathname + location.search);
    const go = async () => { if (!SESSION || !SESSION.admin){ aviser("Ce lien est pour Jeremy (compte administrateur)."); return; } await dlgGerer(); const t = document.getElementById("gDem"); if (t){ t.value = code; document.getElementById("gAjout").click(); } };
    if (SESSION) go(); else dlgConnexion(go);
  }
  setTimeout(() => { const b = document.getElementById("compteBtn"); if (b) b.onclick = menu; charger(); accepterDepuisLien(); invitationDepuisLien(); }, 0);
  return { pret, get estPret(){ return estPret; }, protege, permis, verrouille, ouvrir, pdfDispo, pdfTelecharger, recherche, connexion, connexionCarte, activerCartes, deconnexion, demande, lireDemande, dlgConnexion, dlgDemande, menu, get session(){ return VOIR && SESSION && DATA.comptes[VOIR] ? Object.assign({}, SESSION, { id:VOIR, nom:DATA.comptes[VOIR].nom, admin:false, eleve:!!DATA.comptes[VOIR].eleve, voir:true }) : SESSION; }, get eleve(){ return VOIR && DATA.comptes[VOIR] ? !!DATA.comptes[VOIR].eleve : !!(SESSION && SESSION.eleve); }, get data(){ return DATA; }, charger, outils:{ enLigne:() => enLigne(), commitGitHub:(...a) => commitGitHub(...a), envelopperPour:(...a) => envelopperPour(...a), BOITE, sansAcc:t => sansAcc(t),
    integrer(f, livre, ajouts){ if (f && livre){ DATA.livres[f] = JSON.parse(JSON.stringify(livre)); if (BROUILLON) BROUILLON.livres[f] = JSON.parse(JSON.stringify(livre)); } if (REGL) REGL.ajouts = JSON.parse(JSON.stringify(ajouts || [])); } } };
})();
