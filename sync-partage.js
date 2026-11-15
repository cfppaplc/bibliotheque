/* © 2026 Jérémy Raymond. Tous droits réservés.
   Synchronisation entre collègues qui partagent un registre (15 nov., « ça doit être pareil »).
   Chaque paire de comptes a un secret : créé par le premier qui en a besoin, envoyé chiffré à l'autre,
   et son empreinte publiée dans une rangée que seul son créateur peut écrire. Chaque envoi est signé (HMAC)
   avec ce secret : un dépôt fabriqué par quelqu'un d'autre (un élève) est refusé. */
window.SYNC = function(prefixe){
  const API = "https://kjlotlhqrgekzohshmbn.supabase.co/rest/v1/rpc/", CLEAPI = "sb_publishable_1C-o-75sf7havBRmUWA8aQ_gcEW4sRY";
  const te = new TextEncoder(), hexa = b => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
  const sha = async s => hexa(await crypto.subtle.digest("SHA-256", te.encode(s)));
  const rpc = async (f, a) => { const r = await fetch(API + f, { method:"POST", headers:{ apikey:CLEAPI, "Content-Type":"application/json" }, body:JSON.stringify(a) }); if (!r.ok) throw new Error("coffre " + r.status); return r.json(); };
  const CLE = "syncSec:" + prefixe, lire = () => { try { return JSON.parse(localStorage.getItem(CLE) || "{}"); } catch(e){ return {}; } };
  const garder = (ami, s) => { const S = lire(); S[ami] = s; localStorage.setItem(CLE, JSON.stringify(S)); };
  const rangee = (a, b) => sha("metier+|sync|" + prefixe + "|" + [a, b].sort().join("|"));
  async function lireRangee(a, b){ try { const r = await rpc("coffre_lire", { p_id:await rangee(a, b) }), row = r && r[0]; return row && row.data ? JSON.parse(row.data) : null; } catch(e){ return null; } }
  const hmac = async (s, p) => { const k = await crypto.subtle.importKey("raw", te.encode(s), { name:"HMAC", hash:"SHA-256" }, false, ["sign"]); return hexa(await crypto.subtle.sign("HMAC", k, te.encode(p))); };
  async function deposer(ami, pub, obj){
    for (let n = 0; n < 400; n++){ try { await COFFRE.deposer(prefixe + "|" + ami + "|" + n, obj, pub); return true; } catch(e){ if (!/refus/.test(e.message)) throw e; } } return false; }
  const envoyeCle = {};
  /* secret de la paire (moi, ami) : le créer au besoin; null si l'ami l'a créé et ne me l'a pas encore envoyé */
  async function secret(moi, ami, pub){
    const s = lire()[ami]; const R = await lireRangee(moi, ami);
    if (s){ if (R && R.c === moi && !envoyeCle[ami]){ envoyeCle[ami] = 1; try { await deposer(ami, pub, { k:"cle", de:moi, s, t:Date.now() }); } catch(e) {} } return s; }
    if (R) return null;
    const n = hexa(crypto.getRandomValues(new Uint8Array(32))), j = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
    if (await rpc("coffre_ecrire", { p_id:await rangee(moi, ami), p_jeton:j, p_env:"public", p_data:JSON.stringify({ h:await sha(n), c:moi }) }) !== true) return null;
    garder(ami, n); envoyeCle[ami] = 1; await deposer(ami, pub, { k:"cle", de:moi, s:n, t:Date.now() }); return n;
  }
  return {
    secret,
    /* envoyer un morceau de registre à un collègue (signé) */
    async envoyer(moi, ami, pub, obj){ const s = await secret(moi, ami, pub); if (!s) return false; const p = JSON.stringify(obj);
      return deposer(ami, pub, { k:"sync", de:moi, p, h:await hmac(s, p), uid:Date.now().toString(36) + Math.random().toString(36).slice(2, 7), t:Date.now() }); },
    /* dépôt reçu : { ok:objet } si c'est un envoi valide, { garder:true } s'il faut attendre le secret, sinon {} */
    async recevoir(moi, x){
      if (!x || !x.de || x.de === moi) return {};
      if (x.k === "cle"){ const R = await lireRangee(moi, x.de); if (R && R.c === x.de && R.h === await sha(String(x.s))) garder(x.de, String(x.s)); return {}; }
      if (x.k !== "sync") return {};
      const s = lire()[x.de]; if (!s) return { garder:true };
      if (await hmac(s, x.p) !== x.h) return {};
      try { return { ok:JSON.parse(x.p) }; } catch(e){ return {}; }
    },
    cle:CLE
  };
};
