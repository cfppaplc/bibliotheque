/* © 2026 Jérémy Raymond. Tous droits réservés. Copie, modification ou revente interdites sans autorisation écrite (voir LICENCE.md). */
/* Coffre : les données d'un enseignant suivent son compte, sur n'importe quel appareil.
   - Les données restent dans localStorage (comme avant); une copie chiffrée va dans Supabase (table « coffre », voir outils/coffre.sql).
   - Chiffrement : clé AES aléatoire par « sorte », enveloppée pour la clé publique du compte (RSA ou EC, comme les livres).
     Supabase ne voit que du chiffré; écrire exige le jeton secret (dans l'enveloppe).
   - Une « sorte » = un paquet de clés localStorage (ex. quiz : quizMaison + quizReglages). Le plus récent gagne (heure du paquet).
   - Un autre compte se connecte sur cet appareil : les données du précédent sont retirées de l'appareil (gardées dans le coffre).
   Utilisation : COFFRE.demarrer("quiz", { cles:["quizMaison","quizReglages"], vides:{…}, apres(raison){…}, intervalle:ms }) */
window.COFFRE = (function(){
  const API = "https://kjlotlhqrgekzohshmbn.supabase.co/rest/v1/rpc/", CLE_API = "sb_publishable_1C-o-75sf7havBRmUWA8aQ_gcEW4sRY";
  const sub = crypto.subtle, enc = new TextEncoder(), dec = new TextDecoder();
  const b64 = buf => { const u = new Uint8Array(buf); let s = ""; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s); };
  const unb64 = s => { const b = atob(s), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; };
  const EC = { name:"ECDH", namedCurve:"P-256" };
  const S0 = Storage.prototype.setItem, R0 = Storage.prototype.removeItem;
  const lsGet = k => { try { return localStorage.getItem(k); } catch(e){ return null; } };
  const lsSet = (k, v) => { try { S0.call(localStorage, k, v); } catch(e){} };
  const lsDel = k => { try { R0.call(localStorage, k); } catch(e){} };
  const meta = (so, k) => "coffre:" + so + ":" + k;

  /* ---- session de la bibliothèque (IndexedDB « acces ») + clé publique (comptes.json) ---- */
  let SESS = null;
  function session(){
    if (!SESS) SESS = new Promise(ok => { try {
      const r = indexedDB.open("acces", 1);
      r.onupgradeneeded = () => r.result.createObjectStore("s");
      r.onerror = () => ok(null);
      r.onsuccess = () => { try { const t = r.result.transaction("s").objectStore("s").get("session");
        t.onerror = () => ok(null);
        t.onsuccess = () => { const s = t.result; if (!s || !s.id || !s.priv) return ok(null);
          fetch("comptes.json", { cache:"no-store" }).then(x => x.json()).then(d => { const c = d && d.comptes && d.comptes[s.id];
            ok(c ? { id:s.id, priv:s.priv, pub:c.pub, eleve:!!c.eleve } : null); }).catch(() => ok(null)); };
      } catch(e){ ok(null); } };
    } catch(e){ ok(null); } });
    return SESS;
  }

  /* ---- enveloppes (même format que les clés des livres) ---- */
  async function cleEC(prive, pubBrute){ const bits = await sub.deriveBits({ name:"ECDH", public:await sub.importKey("raw", pubBrute, EC, false, []) }, prive, 256);
    return sub.importKey("raw", await sub.digest("SHA-256", bits), "AES-GCM", false, ["encrypt", "decrypt"]); }
  async function envelopper(brut, pub){
    if (pub.kty === "EC"){ const eph = await sub.generateKey(EC, true, ["deriveBits"]), pubC = await sub.importKey("jwk", { kty:"EC", crv:"P-256", x:pub.x, y:pub.y, ext:true }, EC, true, []);
      const raw = new Uint8Array(await sub.exportKey("raw", pubC)), k = await cleEC(eph.privateKey, raw), iv = crypto.getRandomValues(new Uint8Array(12));
      const c = new Uint8Array(await sub.encrypt({ name:"AES-GCM", iv }, k, brut)), e = new Uint8Array(await sub.exportKey("raw", eph.publicKey));
      const out = new Uint8Array(77 + c.length); out.set(e); out.set(iv, 65); out.set(c, 77); return "E" + b64(out); }
    const pk = await sub.importKey("jwk", Object.assign({}, pub, { alg:"RSA-OAEP-256", ext:true }), { name:"RSA-OAEP", hash:"SHA-256" }, false, ["encrypt"]);
    for (;;){ const s = b64(await sub.encrypt({ name:"RSA-OAEP" }, pk, brut)); if (s[0] !== "E") return s; } }
  async function ouvrir(env, priv){
    if (env[0] === "E"){ const u = unb64(env.slice(1)), k = await cleEC(priv, u.subarray(0, 65)); return sub.decrypt({ name:"AES-GCM", iv:u.subarray(65, 77) }, k, u.subarray(77)); }
    return sub.decrypt({ name:"RSA-OAEP" }, priv, unb64(env)); }

  const hex = async t => [...new Uint8Array(await sub.digest("SHA-256", enc.encode(t)))].map(b => b.toString(16).padStart(2, "0")).join("");
  const gz = async (u, comp) => new Uint8Array(await new Response(new Blob([u]).stream().pipeThrough(comp ? new CompressionStream("gzip") : new DecompressionStream("gzip"))).arrayBuffer());
  async function rpc(f, a){ const r = await fetch(API + f, { method:"POST", headers:{ apikey:CLE_API, "Content-Type":"application/json" }, body:JSON.stringify(a) });
    if (!r.ok) throw new Error("coffre " + r.status); return r.json(); }

  /* ---- rangée du compte pour une sorte (id = empreinte : personne ne peut deviner ni lister) ---- */
  const RANG = {};
  async function rangee(s, so){
    const cle = s.id + "|" + so; if (RANG[cle]) return RANG[cle];
    for (let n = 0; n < 4; n++){
      const id = await hex("metier+|" + s.id + "|" + so + "|" + n), r = await rpc("coffre_lire", { p_id:id }), row = r && r[0];
      if (!row){ const brut = crypto.getRandomValues(new Uint8Array(64)); return RANG[cle] = { id, brut, env:await envelopper(brut, s.pub), data:null }; }
      try { return RANG[cle] = { id, brut:new Uint8Array(await ouvrir(row.env, s.priv)), env:row.env, data:row.data }; } catch(e){}   /* pas à nous : place suivante */
    }
    throw new Error("coffre : aucune place");
  }
  const aes = async R => R.k || (R.k = await sub.importKey("raw", R.brut.subarray(0, 32), "AES-GCM", false, ["encrypt", "decrypt"]));
  async function lire(s, so){
    const R = await rangee(s, so); let data;
    if (R.data !== undefined){ data = R.data; delete R.data; } else { const r = await rpc("coffre_lire", { p_id:R.id }); data = r && r[0] ? r[0].data : null; }
    if (!data) return null;
    const u = unb64(data), clair = await sub.decrypt({ name:"AES-GCM", iv:u.subarray(0, 12) }, await aes(R), u.subarray(12));
    return JSON.parse(dec.decode(await gz(new Uint8Array(clair), false)));
  }
  async function ecrire(s, so, obj){
    const R = await rangee(s, so); delete R.data;
    const iv = crypto.getRandomValues(new Uint8Array(12)), c = new Uint8Array(await sub.encrypt({ name:"AES-GCM", iv }, await aes(R), await gz(enc.encode(JSON.stringify(obj)), true)));
    const out = new Uint8Array(12 + c.length); out.set(iv); out.set(c, 12);
    const ok = await rpc("coffre_ecrire", { p_id:R.id, p_jeton:b64(R.brut.subarray(32, 64)), p_env:R.env, p_data:b64(out) });
    if (ok !== true){ delete RANG[s.id + "|" + so]; throw new Error("coffre : écriture refusée"); }
  }

  /* ---- synchronisation ---- */
  const SORTES = {};
  let applique = false;
  const liste = (c, id) => c.cles.map(k => k.split("{id}").join(id || ""));
  const paquet = (c, id) => { const v = {}; liste(c, id).forEach(k => { const x = lsGet(k); if (x != null) v[k] = x; }); return v; };
  function poser(c, id, v){ applique = true;
    try { liste(c, id).forEach(k => { const x = v && v[k]; if (x != null) lsSet(k, x); else if (c.vides && c.vides[k] != null) lsSet(k, c.vides[k]); else lsDel(k); }); }
    finally { applique = false; } }
  let ETAT = "";
  const etat = e => { if (e === ETAT) return; ETAT = e; try { dispatchEvent(new CustomEvent("coffre", { detail:e })); } catch(x){} };

  function touche(k){
    if (applique || String(k).startsWith("coffre:")) return;
    for (const so in SORTES){ const c = SORTES[so]; if (!liste(c, c.id).includes(k)) continue;
      lsSet(meta(so, "t"), String(Date.now())); lsSet(meta(so, "sale"), "1"); if (c.id) planifier(so); }
  }
  Storage.prototype.setItem = function(k, v){ const r = S0.call(this, k, v); if (this === window.localStorage) touche(k); return r; };
  Storage.prototype.removeItem = function(k){ const r = R0.call(this, k); if (this === window.localStorage) touche(k); return r; };

  function planifier(so, ms){ const c = SORTES[so]; clearTimeout(c.min); c.min = setTimeout(() => pousser(so), ms || 2500); }
  async function pousser(so){
    const c = SORTES[so]; if (!c || !c.id || !c.s) return false;
    if (c.occupe){ planifier(so, 3000); return false; }
    c.occupe = true; clearTimeout(c.min);
    try { const t = +lsGet(meta(so, "t")) || Date.now();
      await ecrire(c.s, so, { t, v:paquet(c, c.id) });
      if ((+lsGet(meta(so, "t")) || t) === t) lsDel(meta(so, "sale"));
      lsDel(meta(so, "reste:" + c.id)); etat("ok"); return true; }
    catch(e){ etat("hors"); planifier(so, 30000); return false; }
    finally { c.occupe = false; }
  }

  /* fusion : le paquet le plus récent gagne, clé par clé; une clé absente du plus récent est gardée */
  async function tirer(so, raison){
    const c = SORTES[so], s = c.s; let nuage;
    try { nuage = await lire(s, so); etat("ok"); } catch(e){ etat("hors"); return false; }
    const tl = +lsGet(meta(so, "t")) || 0, local = paquet(c, s.id);
    if (nuage && nuage.t > tl){
      const v = Object.assign({}, local, nuage.v), avant = JSON.stringify(local);
      poser(c, s.id, v); lsSet(meta(so, "t"), String(nuage.t));
      if (Object.keys(local).some(k => !(k in nuage.v))) { lsSet(meta(so, "sale"), "1"); planifier(so, 500); } else lsDel(meta(so, "sale"));
      return JSON.stringify(paquet(c, s.id)) !== avant;
    }
    if (lsGet(meta(so, "sale")) || (!nuage && Object.keys(local).length)) planifier(so, 500);
    return false;
  }

  async function demarrer(so, cfg){
    const c = SORTES[so] = Object.assign(SORTES[so] || {}, cfg);
    const s = await session(); c.s = s;
    if (!s || s.eleve){ c.id = null; return false; }   /* invité ou compte de groupe d'élèves : rien ne part */
    let change = false;
    const proprio = lsGet(meta(so, "compte"));
    if (proprio && proprio !== s.id){                  /* les données de cet appareil sont à un autre compte */
      if (lsGet(meta(so, "sale"))) lsSet(meta(so, "reste:" + proprio), JSON.stringify({ t:+lsGet(meta(so, "t")) || Date.now(), v:paquet(c, proprio) }));
      poser(c, proprio, {}); poser(c, s.id, {}); lsDel(meta(so, "t")); lsDel(meta(so, "sale")); change = true;
    } else if (!proprio && Object.keys(paquet(c, s.id)).length){ lsSet(meta(so, "sale"), "1"); }   /* données d'avant le coffre : on les garde */
    lsSet(meta(so, "compte"), s.id); c.id = s.id;
    try { const r = JSON.parse(lsGet(meta(so, "reste:" + s.id)) || "null");   /* changements jamais envoyés, laissés par ce compte */
      if (r && r.t > (+lsGet(meta(so, "t")) || 0)){ poser(c, s.id, Object.assign(paquet(c, s.id), r.v)); lsSet(meta(so, "t"), String(r.t)); lsSet(meta(so, "sale"), "1"); change = true; } } catch(e){}
    if (await tirer(so, "debut")) change = true;
    if (!c.ecoute){ c.ecoute = true;
      const verif = () => { if (document.visibilityState === "visible" && c.id && !lsGet(meta(so, "sale")) && !c.occupe)
        tirer(so, "maj").then(ch => { if (ch && c.apres) c.apres("maj"); }); };
      document.addEventListener("visibilitychange", verif);
      if (c.intervalle) setInterval(verif, c.intervalle); }
    if (change && c.apres) c.apres("debut");
    return change;
  }

  /* déconnexion : envoyer, puis retirer les données du compte de cet appareil (gardées de côté si l'envoi échoue) */
  async function quitter(){
    for (const so in SORTES){ const c = SORTES[so]; if (!c.id) continue;
      if (lsGet(meta(so, "sale"))) await pousser(so);
      if (lsGet(meta(so, "sale"))) lsSet(meta(so, "reste:" + c.id), JSON.stringify({ t:+lsGet(meta(so, "t")) || Date.now(), v:paquet(c, c.id) }));
      poser(c, c.id, {}); lsDel(meta(so, "t")); lsDel(meta(so, "sale")); lsDel(meta(so, "compte")); c.id = null; c.s = null; }
    SESS = null;
  }
  function oublier(){ SESS = null; }
  return { demarrer, quitter, oublier, pousser, etat:() => ETAT, session };
})();
