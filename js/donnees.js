/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — donnees.js : copie des données de la bibliothèque dans IndexedDB.
   15 nov. : l'ancien panneau d'administration ⚙ (livres ajoutés sur un ordinateur, mot de passe dans le code) est retiré; il restait caché depuis le 8 nov. */
const rq = r => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
const DB = {
  db:null, ok:false, mem:{ books:new Map(), html:new Map(), kv:new Map() },
  async init(){
    try {
      this.db = await new Promise((res, rej) => {
        const r = indexedDB.open("bibliotheque-ecole", 1);
        r.onupgradeneeded = () => { ["books", "html", "kv"].forEach(n => r.result.createObjectStore(n, { keyPath:n === "kv" ? "key" : "id" })); };
        r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); r.onblocked = () => rej(new Error("bloqué"));
      });
      this.ok = true;
      try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch(e){}
    } catch(e){ this.db = null; this.ok = false; }
  },
  st(n, m){ return this.db.transaction(n, m || "readonly").objectStore(n); },
  async all(){ return this.db ? rq(this.st("books").getAll()) : [...this.mem.books.values()]; },
  async put(rec, html){
    if (!this.db){ this.mem.books.set(rec.id, rec); if (html != null) this.mem.html.set(rec.id, html); return; }
    if (html != null) await rq(this.st("html", "readwrite").put({ id:rec.id, html }));
    await rq(this.st("books", "readwrite").put(rec));
  },
  async getHtml(id){ if (!this.db) return this.mem.html.get(id) || null; const r = await rq(this.st("html").get(id)); return r ? r.html : null; },
  async del(id){
    if (!this.db){ this.mem.books.delete(id); this.mem.html.delete(id); return; }
    await rq(this.st("books", "readwrite").delete(id)); await rq(this.st("html", "readwrite").delete(id));
  },
  async getKv(k, d){ if (!this.db) return this.mem.kv.has(k) ? this.mem.kv.get(k) : d; const r = await rq(this.st("kv").get(k)); return r ? r.val : d; },
  async setKv(k, v){ if (!this.db){ this.mem.kv.set(k, v); return; } await rq(this.st("kv", "readwrite").put({ key:k, val:v })); }
};
/* Remet ma liste, « Continuer » et les signets depuis IndexedDB si le navigateur les a perdus (ou les copie si la copie manque) */
async function restaurerMiroir(){
  let change = false;
  for (const k of MIROIR){
    let ls = null; try { ls = localStorage.getItem(k); } catch(e){}
    let idb = null; try { idb = await DB.getKv("m_" + k, null); } catch(e){}
    if (ls === null && idb != null){
      const cible = k === "favs" ? favs : k === "pos" ? POS : MARKS;
      if (Array.isArray(cible)) cible.splice(0, cible.length, ...idb);
      else { Object.keys(cible).forEach(x => delete cible[x]); Object.assign(cible, idb); }
      try { localStorage.setItem(k, JSON.stringify(idb)); } catch(e){}
      change = true;
    } else if (ls !== null && idb == null){ try { await DB.setKv("m_" + k, JSON.parse(ls)); } catch(e){} }
  }
  if (change){ try { render(); renderHero(); } catch(e){} }
  /* Aucun des deux ne marche (navigation privée, données effacées à la fermeture…) : on prévient une fois */
  let lsOk = false; try { localStorage.setItem("_t", "1"); lsOk = localStorage.getItem("_t") === "1"; localStorage.removeItem("_t"); } catch(e){}
  if (!lsOk && !DB.ok) setTimeout(() => aviser("Ce navigateur n'enregistre rien : « Continuer », ma liste et les signets seront perdus à la fermeture."), 1500);
}
/* ---- Cache web : on demande au navigateur de ne pas effacer les données de la bibliothèque ---- */
async function demanderPersistance(){
  try { if (navigator.storage && navigator.storage.persist && !(await navigator.storage.persisted())) await navigator.storage.persist(); } catch(e){}
  /* Nettoyage des anciennes données de l'option « Progression » retirée */
  try { localStorage.removeItem("visites"); } catch(e){}
  try { await DB.setKv("fichierProg", null); await DB.setKv("visites", null); } catch(e){}
}
async function initDonnees(){ await DB.init(); await restaurerMiroir(); render(); renderHero(); demanderPersistance(); }
