/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — livres-ajoutes.js (sorti d'index.html le 15 nov.) */
/* ======================= Administration : livres ajoutés par l'enseignant ======================= */
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

const REC_KEYS = ["id", "titre", "auteur", "categorie", "competence", "niveau", "description", "pages", "cover", "couleurs", "added", "annee"];
const OVR_KEYS = ["titre", "auteur", "competence", "niveau", "description", "categorie"];
const toRec = l => { const r = {}; REC_KEYS.forEach(k => { r[k] = l[k]; }); return r; };
const userEntry = rec => Object.assign({}, rec, { fichier:"u_" + rec.id, user:true, couverture:rec.cover || "", couleurs:rec.couleurs || palette(rec.titre), nouveau:(Date.now() - (rec.added || 0)) < 14 * 864e5 });
const allCats = () => [...new Set([...LIVRES.map(l => l.categorie), ...ADM.extraCats])].filter(Boolean);

async function syncUser(){
  const recs = (await DB.all()).sort((a, b) => a.added - b.added);
  for (let i = LIVRES.length - 1; i >= 0; i--) if (LIVRES[i].user) LIVRES.splice(i, 1);
  recs.forEach(r => LIVRES.push(userEntry(r)));
  ADM.extraCats = await DB.getKv("cats", []);
  ADM.ovr = await DB.getKv("ovr", {});
  ADM.ord = await DB.getKv("ord", []); ADM.feat = await DB.getKv("feat", []); ADM.lastBackup = await DB.getKv("lastBackup", 0);
  Object.keys(ADM.ovr).forEach(k => { if (typeof ADM.ovr[k] === "string") ADM.ovr[k] = { categorie:ADM.ovr[k] }; });
  LIVRES.forEach(l => {
    if (l.user) return;
    if (!l.orig){ l.orig = {}; [...OVR_KEYS, "couverture"].forEach(k => { l.orig[k] = l[k] || ""; }); }
    const o = ADM.ovr[l.fichier] || {};
    OVR_KEYS.forEach(k => { l[k] = o[k] !== undefined ? o[k] : l.orig[k]; });
    l.couverture = o.cover !== undefined ? o.cover : l.orig.couverture;
  });
  LIVRES.forEach(l => { if (l.user) l.nouveau = (Date.now() - (l.added || 0)) < 14 * 864e5; });
  appliquerOrdre();
  /* Anciens favoris enregistrés par titre : convertis en identifiant de livre */
  const avant = favs.join("|");
  favs = [...new Set(favs.map(f => (LIVRES.find(l => l.fichier === f) || LIVRES.find(l => l.titre === f) || {}).fichier || f))];
  if (favs.join("|") !== avant) saveFavs();
}
function appliquerOrdre(){
  const idx = new Map(ADM.ord.map((f, i) => [f, i]));
  const k = (l, i) => idx.has(l.fichier) ? idx.get(l.fichier) : 1e6 + i;
  const t = LIVRES.map((l, i) => [l, k(l, i)]).sort((a, b) => a[1] - b[1]).map(a => a[0]);
  LIVRES.splice(0, LIVRES.length, ...t);
}

/* ---- Lecture automatique des informations du livre ---- */
function analyser(html, nom){
  const d = new DOMParser().parseFromString(html, "text/html");
  const clean = s => (s || "").replace(/\s+/g, " ").trim();
  let titre = clean((d.querySelector("title") || {}).textContent);
  const court = titre.replace(/^livre\s+anim[ée]\s*/i, "").trim();
  if (court.length >= 4) titre = court;
  if (!titre) titre = clean((d.querySelector("h1") || {}).textContent) || nom.replace(/\.html?$/i, "").replace(/[_-]+/g, " ");
  const nbPages = d.querySelectorAll(".page").length;
  d.querySelectorAll("script,style,svg").forEach(e => e.remove());
  const texte = clean((d.body || d.documentElement).textContent);
  const comp = /Comp[ée]tence\s*(\d{1,2})\b/i.exec(texte);
  const prog = /\b(DEP\s*\d{4})\b/i.exec(texte);
  const aut = /(?:Conçu\s+par|Par|Auteur\s*:?)\s+([A-ZÉÈ][\p{L}'’-]+(?:\s+[A-ZÉÈ][\p{L}'’-]+){1,2})/u.exec(texte.slice(0, 30000));
  return { titre, competence:comp ? comp[1] : "", niveau:prog ? prog[1].replace(/\s+/, " ") : "", auteur:aut ? aut[1] : "", pages:nbPages };
}

/* ---- Couverture : capture de la première page, avec repli sur une couverture colorée ---- */
const H2C = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
let capQueue = Promise.resolve();
function capturer(html){
  return new Promise(resolve => {
    const f = document.createElement("iframe");
    f.setAttribute("aria-hidden", "true"); f.tabIndex = -1;
    f.style.cssText = "position:fixed;left:-4000px;top:0;width:1100px;height:1000px;border:0;opacity:0;pointer-events:none";
    let done = false, to = null;
    const fin = v => { if (done) return; done = true; clearTimeout(to); try { f.remove(); } catch(e){} resolve(v); };
    if (navigator.onLine === false){ fin(null); return; }   /* hors ligne : pas de capture, couverture colorée */
    to = setTimeout(() => fin(null), 25000);
    f.onload = () => setTimeout(async () => {
      try {
        const w = f.contentWindow, d = f.contentDocument;
        await new Promise((res, rej) => { const s = d.createElement("script"); s.src = H2C; s.onload = res; s.onerror = () => rej(new Error("html2canvas")); (d.head || d.documentElement).appendChild(s); });
        const el = [...d.querySelectorAll(".page")].find(e => { const r = e.getBoundingClientRect(), c = w.getComputedStyle(e);
          return r.width > 200 && r.height > 200 && c.visibility !== "hidden" && c.display !== "none" && c.opacity !== "0"; }) || d.body;
        const r = el.getBoundingClientRect();
        const cv = await w.html2canvas(el, { scale:Math.min(1, 420 / r.width), backgroundColor:"#ffffff", logging:false, useCORS:true });
        const out = document.createElement("canvas"); out.width = 420; out.height = Math.max(1, Math.round(420 * cv.height / cv.width));
        out.getContext("2d").drawImage(cv, 0, 0, out.width, out.height);
        fin(out.toDataURL("image/jpeg", .85));
      } catch(e){ fin(null); }
    }, 2000);
    document.body.appendChild(f);
    f.srcdoc = html;
  });
}
function lireImage(file){
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => { const im = new Image();
      im.onload = () => { const c = document.createElement("canvas"); c.width = 420; c.height = Math.round(420 * im.height / im.width);
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); res(c.toDataURL("image/jpeg", .85)); };
      im.onerror = () => rej(new Error("image illisible")); im.src = fr.result; };
    fr.onerror = () => rej(fr.error); fr.readAsDataURL(file);
  });
}

/* ---- Fenêtre d'administration ---- */
const MDP = "12345";
function demanderMotDePasse(){
  $("#pwErr").hidden = true; $("#pwIn").value = ""; $("#pw").hidden = false;
  setTimeout(() => $("#pwIn").focus(), 30);
}
function validerMotDePasse(){
  if ($("#pwIn").value === MDP){ $("#pw").hidden = true; $("#pwIn").value = ""; openAdmin(); }
  else { $("#pwErr").hidden = false; $("#pwIn").select(); }
}
function openAdmin(){ $("#admin").hidden = false; document.body.style.overflow = "hidden"; renderAdmin(); }
function closeAdmin(){ $("#admin").hidden = true; if (!$("#reader").classList.contains("open")) document.body.style.overflow = ""; }
function renderAdmin(){
  document.querySelectorAll(".admin-tabs button").forEach(b => b.classList.toggle("on", b.dataset.tab === ADM.tab));
  const body = $("#adminBody");
  const vieux = LIVRES.some(l => l.user) && (!ADM.lastBackup || Date.now() - ADM.lastBackup > 30 * 864e5);
  const rappel = vieux ? `<div class="adm-warn">Pense à enregistrer une copie de sécurité (onglet « Copie de sécurité ») : ${ADM.lastBackup ? "la dernière date de plus d'un mois." : "tu n'en as encore jamais fait."}</div>` : "";
  const warn = rappel + (DB.ok ? "" : `<div class="adm-warn">Le stockage de ce navigateur est indisponible. Les livres ajoutés seront perdus quand tu fermeras la page. Utilise la copie de sécurité pour les garder.</div>`);
  if (ADM.tab === "add") body.innerHTML = warn + addHTML();
  else if (ADM.tab === "mine") body.innerHTML = warn + mineHTML();
  else if (ADM.tab === "cats") body.innerHTML = catsHTML();
  else body.innerHTML = backupHTML();
}
function catOptions(sel, withNew){
  return allCats().map(c => `<option${c === sel ? " selected" : ""}>${esc(c)}</option>`).join("") + (withNew ? `<option value="__new"${sel === "__new" ? " selected" : ""}>➕ Nouvelle catégorie…</option>` : "");
}
function coverHTML(p){
  return p.cover ? `<img src="${esc(p.cover)}" alt="Couverture">`
    : `<div class="pc-gen" style="background:${fond({ titre:p.titre || "Livre" })}">${p.capturing ? "Création de la couverture…" : esc(p.titre || "Sans titre")}</div>`;
}
function pendHTML(p){
  return `<div class="pend" data-u="${p.uid}">
    <div class="pend-cover"><div class="pc">${coverHTML(p)}</div>
      <label class="sbtn">Choisir une image<input type="file" accept="image/*" data-cover hidden></label>
      <button class="sbtn" data-act="recap">Refaire la capture</button></div>
    <div class="pend-form">
      <label>Titre<input data-f="titre" value="${esc(p.titre)}"></label>
      <label>Auteur<input data-f="auteur" value="${esc(p.auteur)}"></label>
      <label>Numéro de compétence<input data-f="competence" inputmode="numeric" value="${esc(p.competence)}"></label>
      <label>Catégorie<select data-f="categorie">${catOptions(p.categorie, true)}</select></label>
      <label class="newcat"${p.categorie === "__new" ? "" : " hidden"}>Nom de la nouvelle catégorie<input data-f="newcat" value="${esc(p.newcat)}"></label>
      <label>Programme ou niveau<input data-f="niveau" value="${esc(p.niveau)}" placeholder="Ex. DEP 5211"></label>
      <label class="wide">Description (facultatif)<textarea data-f="description" rows="2">${esc(p.description)}</textarea></label>
      <div class="pend-actions wide"><span>${p.pages ? p.pages + " pages détectées · " : ""}${esc(p.nom)}</span>
        <button class="sbtn" data-act="drop">Retirer</button><button class="primary" data-act="add">Ajouter à la bibliothèque</button></div>
    </div></div>`;
}
function addHTML(){
  return `<p class="adm-note">Choisis un ou plusieurs livres au format HTML. Le titre, la compétence et la couverture sont proposés automatiquement : vérifie-les, choisis la catégorie, puis ajoute. Les livres sont enregistrés dans ce navigateur, sur cet ordinateur.</p>
    <label class="drop" id="drop"><input type="file" id="fileIn" accept=".html,.htm,text/html" multiple hidden><span>Glisse tes livres ici ou <u>choisis des fichiers</u></span></label>
    <label class="chk"><input type="checkbox" id="lighten"${ADM.lighten ? " checked" : ""}> Alléger les images trop lourdes à l'ajout (livres plus rapides sur iPhone)</label>
    <div id="pendList">${ADM.pend.map(pendHTML).join("")}</div>`;
}
function mineHTML(){
  const cats = allCats();
  const opts = c0 => cats.map(c => `<option${c === c0 ? " selected" : ""}>${esc(c)}</option>`).join("");
  const thumb = l => couv(l) ? `<img src="${esc(couv(l))}" alt="">` : `<div class="thumb" style="background:${fond(l)}"></div>`;
  const row = l => {
    const k = esc(l.fichier);
    if (ADM.editing === l.fichier) return `<div class="mrow" data-k="${k}">${thumb(l)}<div class="t"><b>${esc(l.titre)}</b><small>${l.user ? "Livre ajouté" : "Livre intégré"}</small></div><div></div><div></div>
      <div class="edit-form">
        <label>Titre<input data-e="titre" value="${esc(l.titre)}"></label><label>Auteur<input data-e="auteur" value="${esc(l.auteur || "")}"></label>
        <label>Numéro de compétence<input data-e="competence" inputmode="numeric" value="${esc(l.competence || "")}"></label><label>Programme ou niveau<input data-e="niveau" value="${esc(l.niveau || "")}"></label>
        <label>Catégorie<select data-e="categorie">${opts(l.categorie)}</select></label>
        <div class="fld">Couverture<span class="covbtns"><label class="sbtn">Changer l'image<input type="file" accept="image/*" data-ecover hidden></label>${!l.user && (l.couverture || "") !== (l.orig.couverture || "") ? `<button class="sbtn" data-act="resetcover">Image d'origine</button>` : ""}</span></div>
        <label class="wide">Description<textarea data-e="description" rows="2">${esc(l.description || "")}</textarea></label>
        <div class="acts wide" style="display:flex;gap:8px;justify-content:flex-end"><button class="sbtn" data-act="cancel">Annuler</button><button class="primary" data-act="save">Enregistrer</button></div>
      </div></div>`;
    return `<div class="mrow" data-k="${k}">${thumb(l)}<div class="t"><b>${esc(l.titre)}</b><small>${l.user ? "" : "Livre intégré · "}${l.competence ? "Compétence " + esc(l.competence) : "Sans numéro de compétence"}</small></div>
      <select data-cat="${k}" aria-label="Catégorie de ${esc(l.titre)}">${opts(l.categorie)}</select>
      <div class="acts"><button class="sbtn" data-act="up" aria-label="Monter" title="Monter dans la catégorie">▲</button><button class="sbtn" data-act="down" aria-label="Descendre" title="Descendre dans la catégorie">▼</button><button class="sbtn${ADM.feat.includes(l.fichier) ? " on" : ""}" data-act="star" aria-pressed="${ADM.feat.includes(l.fichier)}" title="À l'affiche sur l'accueil (3 au maximum)">★</button><button class="sbtn" data-act="edit">Modifier</button>${l.user ? `<button class="sbtn" data-act="del">Supprimer</button>` : ""}</div>
      ${ADM.confirmDel === l.fichier ? `<div class="confirm"><span>Supprimer ce livre de la bibliothèque ?</span><button class="sbtn" data-act="cancel">Annuler</button><button class="danger" data-act="delyes">Oui, supprimer</button></div>` : ""}</div>`;
  };
  const users = LIVRES.filter(l => l.user), built = LIVRES.filter(l => !l.user);
  return `<h3 class="adm-h" style="margin-top:0">Livres que tu as ajoutés (${users.length})</h3>
    ${users.length ? users.map(row).join("") : `<p class="adm-note">Aucun livre ajouté pour l'instant. Utilise l'onglet « Ajouter des livres ».</p>`}
    <h3 class="adm-h">Livres intégrés (${built.length})</h3>
    <p class="adm-note">Tu peux modifier toutes les informations d'un livre intégré, mais pas le supprimer.</p>${built.map(row).join("")}`;
}
function catsHTML(){
  const cats = allCats();
  return `<p class="adm-note">Renomme une catégorie pour changer son titre sur l'étagère. Une catégorie vide peut être supprimée.</p>
    ${cats.map(c => { const n = LIVRES.filter(l => l.categorie === c).length;
      return `<div class="crow" data-c="${esc(c)}"><input data-cname value="${esc(c)}" aria-label="Nom de la catégorie"><span>${n} livre${n > 1 ? "s" : ""}</span>
        <div class="acts"><button class="sbtn" data-act="rename">Renommer</button>${n === 0 ? `<button class="sbtn" data-act="delcat">Supprimer</button>` : ""}</div></div>`; }).join("")}
    <h3 class="adm-h">Nouvelle catégorie</h3>
    <div class="newcrow"><input id="newCat" placeholder="Nom de la catégorie" aria-label="Nom de la nouvelle catégorie"><button class="primary" data-act="addcat">Ajouter la catégorie</button></div>`;
}
function backupHTML(){
  const n = LIVRES.filter(l => l.user).length;
  return `<p class="adm-note">Les livres que tu ajoutes sont gardés dans ce navigateur. Pour les mettre à l'abri ou les copier sur un autre ordinateur, enregistre une copie, puis importe-la là où tu en as besoin.</p>
    <p class="adm-note"><b>${n}</b> livre${n > 1 ? "s" : ""} ajouté${n > 1 ? "s" : ""} sur cet ordinateur. ${ADM.lastBackup ? "Dernière copie : " + new Date(ADM.lastBackup).toLocaleDateString("fr-CA", { day:"numeric", month:"long", year:"numeric" }) + "." : "Aucune copie enregistrée pour l'instant."}</p>
    <div class="newcrow"><button class="primary" data-act="export">Enregistrer une copie</button>
      <label class="sbtn">Importer une copie<input type="file" id="importIn" accept=".json,application/json" hidden></label></div>`;
}

/* ---- Actions ---- */
function newPending(nom, html){
  const m = analyser(html, nom);
  const p = Object.assign({ uid:++ADM.uid, nom, html, auteur:"", competence:"", niveau:"", pages:0, description:"", newcat:"",
    categorie:allCats()[0] || "__new", cover:"", capturing:true }, m);
  ADM.pend.push(p);
  capQueue = capQueue.then(() => capturer(html)).then(img => { p.capturing = false; p.cover = img || ""; refreshCover(p); });
  return p;
}
function refreshCover(p){ const el = document.querySelector(`.pend[data-u="${p.uid}"] .pc`); if (el) el.innerHTML = coverHTML(p); }
async function ajouterFichiers(files){
  for (const f of files){
    if (!/\.html?$/i.test(f.name)){ aviser(`« ${f.name} » n'est pas un fichier HTML.`); continue; }
    try { newPending(f.name, await f.text()); } catch(e){ aviser(`Impossible de lire « ${f.name} ».`); }
  }
  renderAdmin();
}
async function alleger(html){
  const re = /data:image\/(?:png|jpe?g|webp);base64,[A-Za-z0-9+\/=]{200000,}/g;
  const trouvees = [...new Set(html.match(re) || [])];
  let out = html, gain = 0;
  for (const src of trouvees){
    try {
      const img = await new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = ko; i.src = src; });
      const k = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement("canvas"); c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      const png = /image\/png/.test(src);
      let n = png ? c.toDataURL("image/webp", .85) : c.toDataURL("image/jpeg", .82);
      if (png && !/^data:image\/webp/.test(n)) n = c.toDataURL("image/png");
      if (n.length < src.length * .9){ out = out.split(src).join(n); gain += src.length - n.length; }
    } catch(e){}
  }
  return { html:out, gain:Math.round(gain * .75) };
}
async function confirmerAjout(p){
  const cat = p.categorie === "__new" ? p.newcat.trim() : p.categorie;
  if (!p.titre.trim()){ aviser("Écris un titre pour ce livre."); return; }
  if (!cat){ aviser("Choisis une catégorie ou écris le nom d'une nouvelle."); return; }
  const rec = { id:"b_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), titre:p.titre.trim(), auteur:p.auteur.trim(),
    categorie:cat, competence:p.competence.replace(/\D/g, ""), niveau:p.niveau.trim(), description:p.description.trim(), pages:p.pages || 0,
    cover:p.cover || "", couleurs:palette(p.titre), added:Date.now(), annee:new Date().getFullYear() };
  let gain = 0;
  if (ADM.lighten){ try { const r = await alleger(p.html); p.html = r.html; gain = r.gain; } catch(e){} }
  try {
    await DB.put(rec, p.html);
    if (p.categorie === "__new" && !allCats().includes(cat)){ ADM.extraCats.push(cat); await DB.setKv("cats", ADM.extraCats); }
  } catch(e){ aviser("Impossible d'enregistrer ce livre : espace insuffisant dans le navigateur."); return; }
  LIVRES.push(userEntry(rec));
  ADM.pend = ADM.pend.filter(x => x !== p);
  render(); renderHero(); renderAdmin();
  aviser(`« ${rec.titre} » est dans la catégorie ${cat}.` + (gain > 150000 ? ` Images allégées : ${(gain / 1e6).toFixed(1)} Mo gagnés.` : ""));
}
async function deplacer(l, d){
  const memes = LIVRES.filter(x => x.categorie === l.categorie), i = memes.indexOf(l), o = memes[i + d];
  if (!o) return;
  const a = LIVRES.indexOf(l), b = LIVRES.indexOf(o);
  [LIVRES[a], LIVRES[b]] = [LIVRES[b], LIVRES[a]];
  ADM.ord = LIVRES.map(x => x.fichier); await DB.setKv("ord", ADM.ord);
  render(); renderAdmin();
}
async function basculerAffiche(l){
  const i = ADM.feat.indexOf(l.fichier);
  if (i >= 0) ADM.feat.splice(i, 1);
  else { if (!couv(l)){ aviser("Ce livre n'a pas de vraie couverture : il ne peut pas être à l'affiche."); return; } ADM.feat.unshift(l.fichier); ADM.feat = ADM.feat.slice(0, 3); }
  await DB.setKv("feat", ADM.feat); renderHero(); renderAdmin();
  aviser(i >= 0 ? "Retiré de l'affiche." : "« " + l.titre + " » est à l'affiche (au centre de l'accueil).");
}
async function sauverLivre(l){ await DB.put(toRec(l)); render(); renderHero(); }
async function sauverBuiltin(l){
  const o = {};
  OVR_KEYS.forEach(k => { if ((l[k] || "") !== (l.orig[k] || "")) o[k] = l[k] || ""; });
  if ((l.couverture || "") !== (l.orig.couverture || "")) o.cover = l.couverture || "";
  if (Object.keys(o).length) ADM.ovr[l.fichier] = o; else delete ADM.ovr[l.fichier];
  await DB.setKv("ovr", ADM.ovr);
}
async function changerCategorie(l, c){
  l.categorie = c;
  if (l.user) await sauverLivre(l);
  else { await sauverBuiltin(l); render(); renderHero(); }
}
async function renommerCategorie(ancien, nouveau){
  nouveau = nouveau.trim();
  if (!nouveau || nouveau === ancien) return;
  for (const l of LIVRES.filter(x => x.categorie === ancien)){
    l.categorie = nouveau;
    if (l.user) await DB.put(toRec(l)); else await sauverBuiltin(l);
  }
  ADM.extraCats = [...new Set(ADM.extraCats.map(c => c === ancien ? nouveau : c))];
  await DB.setKv("ovr", ADM.ovr); await DB.setKv("cats", ADM.extraCats);
  render(); renderAdmin(); aviser(`Catégorie renommée : ${nouveau}.`);
}
async function exporter(){
  const recs = await DB.all();
  const out = { version:1, date:new Date().toISOString(), books:[], ovr:ADM.ovr, cats:ADM.extraCats, ord:ADM.ord, feat:ADM.feat };
  for (const r of recs) out.books.push(Object.assign({}, r, { html:await DB.getHtml(r.id) }));
  const blob = new Blob([JSON.stringify(out)], { type:"application/json" });
  const nom = "copie-bibliotheque-" + new Date().toISOString().slice(0, 10) + ".json";
  try {
    const dl = window.claude && claude.use ? await claude.use("downloads") : null;
    if (dl){ await dl.save({ filename:nom, data:blob }); await marquerCopie(); return; }
  } catch(e){ if (e && e.code === "declined") return; }
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = nom;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  await marquerCopie();
}
async function marquerCopie(){ ADM.lastBackup = Date.now(); await DB.setKv("lastBackup", ADM.lastBackup); renderAdmin(); aviser("Copie enregistrée."); }
async function importer(file){
  try {
    const d = JSON.parse(await file.text());
    if (!d || !Array.isArray(d.books)) throw new Error("fichier invalide");
    for (const b of d.books){ const { html, ...rec } = b; if (rec.id && rec.titre && html) await DB.put(rec, html); }
    ADM.ovr = Object.assign({}, ADM.ovr, d.ovr || {}); ADM.extraCats = [...new Set([...ADM.extraCats, ...(d.cats || [])])];
    if (Array.isArray(d.ord)){ ADM.ord = d.ord; await DB.setKv("ord", ADM.ord); }
    if (Array.isArray(d.feat)){ ADM.feat = d.feat; await DB.setKv("feat", ADM.feat); }
    await DB.setKv("ovr", ADM.ovr); await DB.setKv("cats", ADM.extraCats);
    await syncUser(); render(); renderHero(); renderAdmin();
    aviser(`${d.books.length} livre${d.books.length > 1 ? "s" : ""} importé${d.books.length > 1 ? "s" : ""}.`);
  } catch(e){ aviser("Cette copie n'a pas pu être lue : " + e.message); }
}

/* ---- Événements ---- */
(function(){
  const body = $("#adminBody");
  const pend = el => { const c = el.closest(".pend"); return c ? ADM.pend.find(p => p.uid === +c.dataset.u) : null; };
  body.addEventListener("input", e => {
    const t = e.target, p = pend(t);
    if (p && t.dataset.f) p[t.dataset.f] = t.value;
  });
  body.addEventListener("change", async e => {
    const t = e.target, p = pend(t);
    if (t.id === "lighten"){ ADM.lighten = t.checked; return; }
    if (t.id === "fileIn"){ await ajouterFichiers([...t.files]); return; }
    if (t.id === "importIn"){ if (t.files[0]) await importer(t.files[0]); t.value = ""; return; }
    if (p && t.dataset.f === "categorie"){ p.categorie = t.value; t.closest(".pend").querySelector(".newcat").hidden = t.value !== "__new"; return; }
    if (p && t.hasAttribute("data-cover") && t.files[0]){
      try { p.cover = await lireImage(t.files[0]); p.capturing = false; refreshCover(p); } catch(err){ aviser("Cette image n'a pas pu être lue."); }
      return;
    }
    if (t.hasAttribute("data-ecover")){
      const row = t.closest("[data-k]"), l = row && LIVRES.find(x => x.fichier === row.dataset.k);
      if (l && t.files[0]){
        try {
          const img = await lireImage(t.files[0]); l.couverture = img;
          if (l.user){ l.cover = img; await sauverLivre(l); } else { await sauverBuiltin(l); render(); renderHero(); }
          const th = row.querySelector(".thumb, img"); if (th) th.outerHTML = `<img src="${esc(img)}" alt="">`;
        } catch(err){ aviser("Cette image n'a pas pu être lue."); }
      }
      t.value = ""; return;
    }
    if (t.dataset.cat){ const l = LIVRES.find(x => x.fichier === t.dataset.cat); if (l) await changerCategorie(l, t.value); renderAdmin(); }
  });
  body.addEventListener("click", async e => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const act = b.dataset.act, p = pend(b), row = b.closest("[data-k]");
    const l = row ? LIVRES.find(x => x.fichier === row.dataset.k) : null;
    if (act === "drop" && p){ ADM.pend = ADM.pend.filter(x => x !== p); renderAdmin(); }
    else if (act === "add" && p) await confirmerAjout(p);
    else if (act === "recap" && p){
      p.capturing = true; p.cover = ""; refreshCover(p);
      capQueue = capQueue.then(() => capturer(p.html)).then(img => { p.capturing = false; p.cover = img || ""; refreshCover(p); });
    }
    else if ((act === "up" || act === "down") && l) await deplacer(l, act === "up" ? -1 : 1);
    else if (act === "star" && l) await basculerAffiche(l);
    else if (act === "edit" && l){ ADM.editing = l.fichier; ADM.confirmDel = null; renderAdmin(); }
    else if (act === "cancel"){ ADM.editing = null; ADM.confirmDel = null; renderAdmin(); }
    else if (act === "save" && l){
      row.querySelectorAll("[data-e]").forEach(i => { l[i.dataset.e] = i.dataset.e === "competence" ? i.value.replace(/\D/g, "") : i.value.trim(); });
      if (!l.titre){ aviser("Le titre ne peut pas être vide."); return; }
      ADM.editing = null;
      if (l.user) await sauverLivre(l); else { await sauverBuiltin(l); render(); renderHero(); }
      renderAdmin(); aviser("Modifications enregistrées.");
    }
    else if (act === "resetcover" && l){ l.couverture = l.orig.couverture; await sauverBuiltin(l); render(); renderHero(); renderAdmin(); }
    else if (act === "del" && l){ ADM.confirmDel = l.fichier; ADM.editing = null; renderAdmin(); }
    else if (act === "delyes" && l){
      await DB.del(l.id); LIVRES.splice(LIVRES.indexOf(l), 1); ADM.confirmDel = null;
      const f = l.fichier;
      ADM.feat = ADM.feat.filter(x => x !== f); ADM.ord = ADM.ord.filter(x => x !== f);
      try { await DB.setKv("feat", ADM.feat); await DB.setKv("ord", ADM.ord); } catch(err){}
      favs = favs.filter(x => x !== f); saveFavs();
      delete POS[f]; ecrireLS("pos", POS); delete MARKS[f]; ecrireLS("marks", MARKS);
      Object.keys(INKS).filter(k => k.startsWith(f + "|")).forEach(k => delete INKS[k]);
      render(); renderHero(); renderAdmin(); aviser("Livre supprimé.");
    }
    else if (act === "rename"){ const c = b.closest(".crow"); await renommerCategorie(c.dataset.c, c.querySelector("[data-cname]").value); }
    else if (act === "delcat"){ const c = b.closest(".crow").dataset.c; ADM.extraCats = ADM.extraCats.filter(x => x !== c); await DB.setKv("cats", ADM.extraCats); renderAdmin(); }
    else if (act === "addcat"){
      const v = $("#newCat").value.trim();
      if (!v){ aviser("Écris le nom de la catégorie."); return; }
      if (!allCats().includes(v)){ ADM.extraCats.push(v); await DB.setKv("cats", ADM.extraCats); }
      renderAdmin(); aviser(`Catégorie « ${v} » créée. Elle apparaît sur l'étagère dès qu'elle contient un livre.`);
    }
    else if (act === "export") await exporter();
  });
  body.addEventListener("dragover", e => { const d = e.target.closest("#drop"); if (d){ e.preventDefault(); d.classList.add("over"); } });
  body.addEventListener("dragleave", e => { const d = e.target.closest("#drop"); if (d) d.classList.remove("over"); });
  body.addEventListener("drop", async e => { const d = e.target.closest("#drop"); if (d){ e.preventDefault(); d.classList.remove("over"); await ajouterFichiers([...e.dataTransfer.files]); } });
  document.querySelectorAll(".admin-tabs button").forEach(b => b.onclick = () => { ADM.tab = b.dataset.tab; ADM.editing = null; ADM.confirmDel = null; renderAdmin(); });
  $("#adminBtn").onclick = demanderMotDePasse;
  $("#pwOk").onclick = validerMotDePasse;
  $("#pwCancel").onclick = () => { $("#pw").hidden = true; };
  $("#pwIn").addEventListener("keydown", e => { if (e.key === "Enter") validerMotDePasse(); else if (e.key === "Escape"){ e.stopPropagation(); $("#pw").hidden = true; } });
  $("#pw").addEventListener("click", e => { if (e.target.id === "pw") $("#pw").hidden = true; });
  $("#adminClose").onclick = closeAdmin;
  $("#admin").addEventListener("click", e => { if (e.target.id === "admin") closeAdmin(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#admin").hidden && !$("#reader").classList.contains("open")){
    const t = e.target; if (!(t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA"))) closeAdmin(); } });
})();
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
async function initAdmin(){ await DB.init(); await syncUser(); await restaurerMiroir(); render(); renderHero(); demanderPersistance(); }
