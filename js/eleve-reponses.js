/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — réponses de l'élève dans ses livres (25 nov.)
   Jeremy : « chaque élève voit seulement ses réponses (iPad partagé) » et « il doit pouvoir étudier chez lui ».
   - L'élève (compte de groupe) dit qui il est avec sa carte : MP-<code>-<clé> (collant, ou « Ma carte » sur son cellulaire).
   - Ses traits et réponses sont rangés à part (préfixe « e<code>| » dans INKS) : le suivant sur l'iPad ne les voit pas.
   - Ils sont chiffrés sur l'appareil avec la clé de sa carte, puis gardés dans Supabase (table coffre) :
     le site ne peut pas les lire; avec sa carte, il les retrouve sur n'importe quel appareil (à la maison aussi). */
window.ELEVE_REP = (function(){
  const API = "https://nhxhfiaznuifcbobjuuv.supabase.co/rest/v1/rpc/", CLE = "sb_publishable_GwzHRE-rG-rVafG7QcTOxg_S68OQHXh";
  const te = new TextEncoder(), td = new TextDecoder();
  const hex = async s => [...new Uint8Array(await crypto.subtle.digest("SHA-256", te.encode(s)))].map(b => b.toString(16).padStart(2, "0")).join("");
  const b64 = u => { let s = ""; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s); };
  const rpc = async (f, a) => { const r = await fetch(API + f, { method:"POST", headers:{ apikey:CLE, "Content-Type":"application/json" }, body:JSON.stringify(a), cache:"no-store" }); if (!r.ok) throw new Error("Supabase " + r.status); return r.json(); };
  const lireCarte = v => { const m = String(v || "").toUpperCase().replace(/\s+/g, "").match(/MP-?(\d{5})-?([A-Z0-9]{6})/); return m ? { c:m[1], k:m[2] } : null; };
  let MOI = null; try { MOI = JSON.parse(sessionStorage.getItem("eleveMoi") || "null"); } catch(e){}
  const pfx = () => MOI ? "e" + MOI.c + "|" : "";
  const charges = new Set();
  async function cleAes(){ return crypto.subtle.importKey("raw", await crypto.subtle.digest("SHA-256", te.encode("metier+|rep|" + MOI.c + "|" + MOI.k)), "AES-GCM", false, ["encrypt", "decrypt"]); }
  const idLivre = livre => hex("metier+|reponses|" + MOI.c + "|" + MOI.k + "|" + livre);
  const jeton = () => hex("metier+|rep-jeton|" + MOI.c + "|" + MOI.k);
  /* ---- qui es-tu ? ---- */
  function demander(suite){
    let d = document.getElementById("elQui"); if (d) d.remove();
    const K = (() => { try { return JSON.parse(localStorage.getItem("mpCarte") || "null"); } catch(e){ return null; } })(), kc = K && lireCarte(K.c);
    d = document.createElement("div"); d.id = "elQui";
    d.innerHTML = `<div class="bx"><img src="img/metier-plus-blanc.svg" alt="Métier+"><h2>Qui es-tu ?</h2>
      <p>Tes réponses sont à toi : tu les retrouves sur n'importe quel appareil, même à la maison.</p>
      ${kc ? `<button class="go" id="elMoi">Je suis ${String(K.p || "").replace(/[<>&"]/g, "") || "moi"} (${kc.c})</button><p class="ou">ou une autre carte :</p>` : ""}
      <input id="elC" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="MP-12345-ABC123" aria-label="Ta carte">
      <p class="pt">Scanne ta carte, ou tape ce qui est écrit sous le code-barres.</p><p class="er" id="elEr"></p>
      <div class="bt"><button id="elAnn">Annuler</button><button class="go" id="elOk">Entrer</button></div></div>`;
    document.body.appendChild(d);
    const fin = c => { MOI = c; IDX = null; try { sessionStorage.setItem("eleveMoi", JSON.stringify(c)); } catch(e){} d.remove(); majBarre(); suite && suite(); };
    const ok = () => { const c = lireCarte(d.querySelector("#elC").value); if (!c) { d.querySelector("#elEr").textContent = "Ça ressemble à MP-12345-ABC123 (sous le code-barres de ta carte)."; return; } fin(c); };
    d.querySelector("#elOk").onclick = ok; d.querySelector("#elC").onkeydown = e => { if (e.key === "Enter") ok(); };
    d.querySelector("#elAnn").onclick = () => d.remove();
    const m = d.querySelector("#elMoi"); if (m) m.onclick = () => fin(kc);
    setTimeout(() => { const i = d.querySelector("#elC"); if (i && !kc) i.focus(); }, 50);
  }
  /* ---- charger / sauver (chiffré) ---- */
  async function charger(livre){
    if (!MOI || charges.has(livre)) return; charges.add(livre);
    try { const r = await rpc("coffre_lire", { p_id:await idLivre(livre) }), row = r && r[0]; if (!row || !row.data) return;
      const o = JSON.parse(row.data), b = Uint8Array.from(atob(o.d), c => c.charCodeAt(0));
      const D = JSON.parse(td.decode(await crypto.subtle.decrypt({ name:"AES-GCM", iv:b.slice(0, 12) }, await cleAes(), b.slice(12))));
      const loc = +(localStorage.getItem("eleveT|" + MOI.c + "|" + livre) || 0);
      if ((D.t || 0) >= loc) { const p = pfx() + livre + "|"; for (const k in INKS) if (k.startsWith(p)) delete INKS[k]; Object.assign(INKS, D.inks || {}); try { redrawInk(); } catch(e){} }
    } catch(e){ charges.delete(livre); }
  }
  let T = 0;
  function planifier(){ if (!MOI || typeof RD === "undefined" || !RD.book) return; const livre = RD.book;
    try { localStorage.setItem("eleveT|" + MOI.c + "|" + livre, String(Date.now())); } catch(e){}
    clearTimeout(T); T = setTimeout(() => sauver(livre), 2500); }
  async function sauver(livre){ if (!MOI) return;
    const p = pfx() + livre + "|", inks = {}; for (const k in INKS) if (k.startsWith(p) && INKS[k] && INKS[k].length) inks[k] = INKS[k];
    const iv = crypto.getRandomValues(new Uint8Array(12)), ct = new Uint8Array(await crypto.subtle.encrypt({ name:"AES-GCM", iv }, await cleAes(), te.encode(JSON.stringify({ t:Date.now(), inks }))));
    const u = new Uint8Array(12 + ct.length); u.set(iv); u.set(ct, 12);
    try { await rpc("coffre_ecrire", { p_id:await idLivre(livre), p_jeton:await jeton(), p_env:"public", p_data:JSON.stringify({ v:1, d:b64(u) }) }); await indexer(livre); } catch(e){}
  }
  /* index (chiffré) des livres où l'élève a répondu : sert à l'enseignant pour transférer ses réponses sur une nouvelle carte (carte perdue) */
  let IDX = null;
  async function indexer(livre){ const id = await hex("metier+|reponses-index|" + MOI.c + "|" + MOI.k);
    if (!IDX) { IDX = []; try { const r = await rpc("coffre_lire", { p_id:id }), row = r && r[0]; if (row && row.data) { const b = Uint8Array.from(atob(JSON.parse(row.data).d), c => c.charCodeAt(0)); IDX = JSON.parse(td.decode(await crypto.subtle.decrypt({ name:"AES-GCM", iv:b.slice(0, 12) }, await cleAes(), b.slice(12)))); } } catch(e){} }
    if (IDX.includes(livre)) return; IDX.push(livre);
    const iv = crypto.getRandomValues(new Uint8Array(12)), ct = new Uint8Array(await crypto.subtle.encrypt({ name:"AES-GCM", iv }, await cleAes(), te.encode(JSON.stringify(IDX)))), u = new Uint8Array(12 + ct.length); u.set(iv); u.set(ct, 12);
    await rpc("coffre_ecrire", { p_id:id, p_jeton:await jeton(), p_env:"public", p_data:JSON.stringify({ v:1, d:b64(u) }) }); }
  /* « Changer d'élève » : ses réponses quittent l'appareil (elles restent dans son coffre chiffré) */
  async function changer(){
    if (MOI && typeof RD !== "undefined" && RD.book) { clearTimeout(T); await sauver(RD.book); }
    const p = pfx(); if (p) for (const k in INKS) if (k.startsWith(p)) delete INKS[k];
    try { if (typeof sauverTableaux === "function") sauverTableaux(); } catch(e){}
    MOI = null; IDX = null; charges.clear(); try { sessionStorage.removeItem("eleveMoi"); } catch(e){}
    majBarre(); if (!changer.retour) { changer.retour = true; try { document.getElementById("readerBack").click(); } catch(e){} changer.retour = false; }
  }
  function majBarre(){ const b = document.getElementById("readerEleve"); if (!b) return;
    const el = !!(window.ACCES && ACCES.eleve); b.hidden = !el && !(MOI && MOI.voir);
    b.textContent = MOI && MOI.voir ? "Fermer les réponses de l'élève " + MOI.c : MOI ? "Changer d'élève (" + MOI.c + ")" : "Qui es-tu ?"; }
  /* l'élève ouvre un livre : il dit d'abord qui il est, puis ses réponses arrivent */
  function avantLire(l, suite){
    if (!(window.ACCES && ACCES.eleve)) return false;
    if (!MOI) { demander(() => suite()); return true; }
    const livre = l && (l.fichier || l.id); if (livre && !charges.has(livre)) { charger(livre).finally(() => suite()); charges.add(livre); return true; }
    return false; }
  const st = document.createElement("style");
  st.textContent = `#elQui{position:fixed;inset:0;z-index:100050;background:rgba(10,14,24,.72);display:flex;align-items:center;justify-content:center;padding:16px;font-family:inherit}
    #elQui .bx{background:#1E2A44;color:#fff;border-radius:18px;padding:26px 24px;width:min(440px,100%);box-shadow:0 20px 60px rgba(0,0,0,.5)}#elQui img{height:30px}#elQui h2{margin:14px 0 6px;font-size:26px}
    #elQui p{margin:6px 0;color:#D6DCE8;font-size:15px}#elQui .ou{margin-top:14px}#elQui .pt{font-size:13px}#elQui .er{color:#ffb4a8;min-height:18px}
    #elQui input{width:100%;font:700 22px/1.2 ui-monospace,monospace;letter-spacing:.06em;text-align:center;padding:14px;border-radius:12px;border:2px solid #EB6A22;margin-top:8px;text-transform:uppercase}
    #elQui button{min-height:50px;padding:0 20px;border-radius:12px;border:1px solid rgba(255,255,255,.3);background:transparent;color:#fff;font:600 17px inherit;cursor:pointer}
    #elQui .go{background:#EB6A22;border-color:#EB6A22;width:100%;margin-top:10px}#elQui .bt{display:flex;gap:10px;margin-top:10px}#elQui .bt .go{margin:0;flex:1}`;
  document.head.appendChild(st);
  addEventListener("pagehide", () => { if (MOI && typeof RD !== "undefined" && RD.book) sauver(RD.book); });
  document.addEventListener("DOMContentLoaded", () => { const b = document.getElementById("readerEleve"); if (b) b.onclick = () => MOI ? changer() : demander(); majBarre();
    const r = document.getElementById("readerBack"); if (r) r.addEventListener("click", () => { if (MOI && MOI.voir && !changer.retour) changer(); }, true);   /* l'enseignant quitte le livre : ses propres traits reviennent */
    if (window.ACCES && ACCES.pret) ACCES.pret.then(majBarre).catch(() => {}); });
  /* l'enseignant (administrateur) ouvre le livre avec les réponses d'un élève; ce qu'il y écrit (corrections) va dans le livre de l'élève */
  async function voir(c, k, livre){ if (typeof LIVRES === "undefined") return false; const l = LIVRES.find(x => x.fichier === livre); if (!l) return false;
    MOI = { c, k, voir:true }; IDX = null; charges.delete(livre); try { sessionStorage.setItem("eleveMoi", JSON.stringify(MOI)); } catch(e){}
    await charger(livre); majBarre(); lire(l); return true; }
  /* connexion par la carte (acces.js) : l'élève est déjà identifié */
  function definir(c, k){ MOI = { c, k }; IDX = null; charges.clear(); try { sessionStorage.setItem("eleveMoi", JSON.stringify(MOI)); } catch(e){} majBarre(); }
  return { pfx, avantLire, planifier, changer, demander, voir, definir, get moi(){ return MOI; } };
})();
