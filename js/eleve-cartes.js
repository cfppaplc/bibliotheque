/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — carte perdue (25 nov., Jeremy : « je dois être capable de gérer les comptes s'il y a des pertes »)
   L'administrateur donne une nouvelle clé de carte à l'élève : ses réponses chiffrées avec l'ancienne clé sont lues, chiffrées avec la nouvelle,
   puis l'ancienne copie est effacée (l'ancienne carte ne donne plus accès à rien). Même format que js/eleve-reponses.js. */
window.ELEVE_CARTES = (function(){
  const API = "https://kjlotlhqrgekzohshmbn.supabase.co/rest/v1/rpc/", CLE = "sb_publishable_1C-o-75sf7havBRmUWA8aQ_gcEW4sRY", te = new TextEncoder(), td = new TextDecoder();
  const hex = async s => [...new Uint8Array(await crypto.subtle.digest("SHA-256", te.encode(s)))].map(b => b.toString(16).padStart(2, "0")).join("");
  const b64 = u => { let s = ""; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s); };
  const rpc = async (f, a) => { const r = await fetch(API + f, { method:"POST", headers:{ apikey:CLE, "Content-Type":"application/json" }, body:JSON.stringify(a), cache:"no-store" }); if (!r.ok) throw new Error("Supabase " + r.status); return r.json(); };
  const cle = (c, k) => crypto.subtle.digest("SHA-256", te.encode("metier+|rep|" + c + "|" + k)).then(h => crypto.subtle.importKey("raw", h, "AES-GCM", false, ["encrypt", "decrypt"]));
  const jeton = (c, k) => hex("metier+|rep-jeton|" + c + "|" + k);
  async function lire(id, K){ const r = await rpc("coffre_lire", { p_id:id }), row = r && r[0]; if (!row || !row.data) return null;
    const b = Uint8Array.from(atob(JSON.parse(row.data).d), c => c.charCodeAt(0)); return JSON.parse(td.decode(await crypto.subtle.decrypt({ name:"AES-GCM", iv:b.slice(0, 12) }, K, b.slice(12)))); }
  async function ecrire(id, K, j, o){ const iv = crypto.getRandomValues(new Uint8Array(12)), ct = new Uint8Array(await crypto.subtle.encrypt({ name:"AES-GCM", iv }, K, te.encode(JSON.stringify(o)))), u = new Uint8Array(12 + ct.length); u.set(iv); u.set(ct, 12);
    if (await rpc("coffre_ecrire", { p_id:id, p_jeton:j, p_env:"public", p_data:JSON.stringify({ v:1, d:b64(u) }) }) !== true) throw new Error("écriture refusée"); }
  /* transfère les réponses de l'ancienne clé vers la nouvelle; retourne le nombre de livres transférés */
  async function transferer(c, k0, k1){
    const K0 = await cle(c, k0), K1 = await cle(c, k1), j0 = await jeton(c, k0), j1 = await jeton(c, k1);
    const i0 = await hex("metier+|reponses-index|" + c + "|" + k0), idx = (await lire(i0, K0).catch(() => null)) || []; let n = 0;
    for (const livre of idx){ const a = await hex("metier+|reponses|" + c + "|" + k0 + "|" + livre), D = await lire(a, K0).catch(() => null); if (!D) continue;
      const inks = {}; for (const k in D.inks || {}) inks[k] = D.inks[k];   /* les clés internes (e<code>|livre|page) ne dépendent pas de la clé de carte */
      await ecrire(await hex("metier+|reponses|" + c + "|" + k1 + "|" + livre), K1, j1, { t:Date.now(), inks }); n++;
      try { await rpc("coffre_effacer", { p_id:a, p_jeton:j0 }); } catch(e){} }
    if (idx.length) { await ecrire(await hex("metier+|reponses-index|" + c + "|" + k1), K1, j1, idx); try { await rpc("coffre_effacer", { p_id:i0, p_jeton:j0 }); } catch(e){} }
    /* la copie de la clé du groupe (connexion par la carte) passe aussi sur la nouvelle carte; l'ancienne carte n'ouvre plus rien */
    try { const kc = c2 => crypto.subtle.digest("SHA-256", te.encode("metier+|carte-livres-cle|" + c + "|" + c2)).then(h => crypto.subtle.importKey("raw", h, "AES-GCM", false, ["encrypt", "decrypt"]));
      const a0 = await hex("metier+|carte-livres|" + c + "|" + k0), o = await lire(a0, await kc(k0));
      if (o) { await ecrire(await hex("metier+|carte-livres|" + c + "|" + k1), await kc(k1), await hex("metier+|carte-livres-jeton|" + c + "|" + k1), o);
        await rpc("coffre_effacer", { p_id:a0, p_jeton:await hex("metier+|carte-livres-jeton|" + c + "|" + k0) }); } } catch(e){}
    return n; }
  /* livres où l'élève a répondu (pour « Voir ses réponses ») */
  async function livres(c, k){ try { return (await lire(await hex("metier+|reponses-index|" + c + "|" + k), await cle(c, k))) || []; } catch(e){ return []; } }
  return { transferer, livres };
})();
