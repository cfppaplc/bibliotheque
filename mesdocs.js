/* © 2026 Jérémy Raymond. Tous droits réservés. Copie, modification ou revente interdites sans autorisation écrite (voir LICENCE.md). */
/* Mes documents (8 nov.) : un enseignant permis (comptes.json : « ajout »: true, bouton « Ajouts » du panneau) glisse un PDF, une image ou un livre HTML,
   choisit Livre, Activité ou Plan, et le retrouve dans l'outil correspondant (lecteur des livres, Activités, visionneuse de plans).
   - Liste : localStorage « mesDocs » {docs:[…], sup:{id:date}} (suit le compte par le coffre, sorte biblio, fusion document par document).
   - Fichiers : IndexedDB « mesdocs » sur l'appareil + copie chiffrée dans le coffre (≤ 20 Mo par fichier, ≤ 100 Mo par prof).
   - « Proposer à tous » : le fichier est déposé chiffré pour l'administrateur + avis ntfy « PROPOSITION-… »; l'administrateur le voit dans
     Administration → Propositions et le publie (GitHub : activites/, plans/, livres/<f>.chiffre protégé; liste dans reglages.json « ajouts »). */
window.MESDOCS = (function(){
  const MAX = 20 * 1048576, QUOTA = 100 * 1048576, MORCEAU = 5 * 1048576;
  const NOMS = { livre:"Livre", act:"Formatif", plan:"Plan" };
  const PROGS = [["Plomberie et chauffage", "Plomberie et chauffage"], ["Entretien général d'immeubles", "Entretien général d'immeubles"]];
  const e = t => String(t == null ? "" : t).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
  const q = s => document.querySelector(s);
  const b64 = u => { let s = ""; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s); };
  const unb64 = s => { const b = atob(s), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; };
  const b64u = u => b64(u).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const unb64u = t => unb64(t.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((t.length + 3) % 4));
  const mo = n => n >= 1048576 ? (n / 1048576).toFixed(1).replace(".", ",") + " Mo" : Math.max(1, Math.round(n / 1024)) + " Ko";
  const avis = (m, ms) => { try { aviser(m, ms); } catch(x){ console.log(m); } };
  const lj = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || "null") || d; } catch(x){ return d; } };
  const ej = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch(x){ return false; } };

  /* ---- liste ---- */
  const liste = () => { const d = lj("mesDocs", null); return d && Array.isArray(d.docs) ? d : { docs:[], sup:{} }; };
  const sauver = d => { if (!ej("mesDocs", d)) avis("Plus de place sur cet ordinateur pour la liste de tes documents."); };
  const doc = id => liste().docs.find(x => x.id === id);
  function maj(id, ch){ const d = liste(), x = d.docs.find(y => y.id === id); if (!x) return; Object.assign(x, ch, { maj:Date.now() }); sauver(d); }
  window.fusionMesDocs = (a, b) => {
    const A = JSON.parse(a), B = JSON.parse(b), sup = Object.assign({}, A.sup, B.sup), m = {};
    [...(A.docs || []), ...(B.docs || [])].forEach(x => { if (sup[x.id]) return; if (!m[x.id] || (x.maj || 0) > (m[x.id].maj || 0)) m[x.id] = x; });
    const t = Date.now() - 120 * 864e5; for (const k in sup) if (sup[k] < t) delete sup[k];
    return JSON.stringify({ docs:Object.values(m).sort((x, y) => (x.added || 0) - (y.added || 0)), sup }); };

  /* ---- fichiers sur l'appareil (IndexedDB) ---- */
  let dbP = null;
  const db = () => dbP || (dbP = new Promise((ok, ko) => { const r = indexedDB.open("mesdocs", 1); r.onupgradeneeded = () => r.result.createObjectStore("f"); r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error); }));
  const st = async (m, fn) => { const d = await db(); return new Promise((ok, ko) => { const t = d.transaction("f", m), r = fn(t.objectStore("f")); t.oncomplete = () => ok(r && r.result); t.onerror = () => ko(t.error); t.onabort = () => ko(t.error); }); };
  const fGet = k => st("readonly", s => s.get(k)).catch(() => null);
  const fPut = (k, v) => st("readwrite", s => s.put(v, k));
  const fDel = k => st("readwrite", s => s.delete(k)).catch(() => {});

  /* ---- coffre (copie chiffrée qui suit le compte) ---- */
  const nuageTotal = () => liste().docs.filter(x => x.nuage).reduce((t, x) => t + (x.taille || 0), 0);
  async function envoyerNuage(id){
    const x = doc(id); if (!x || x.nuage || !window.COFFRE || x.taille > MAX || nuageTotal() + x.taille > QUOTA) return false;
    const bl = await fGet(id); if (!bl) return false;
    try { const u = new Uint8Array(await bl.arrayBuffer()), n = Math.max(1, Math.ceil(u.length / MORCEAU));
      for (let i = 0; i < n; i++) await COFFRE.envoyer("doc:" + id + ":" + i, { b:b64(u.subarray(i * MORCEAU, (i + 1) * MORCEAU)) });
      await COFFRE.envoyer("doc:" + id, { n, type:bl.type || "", taille:u.length });
      maj(id, { nuage:1, n }); return true; } catch(x){ return false; } }
  async function recevoirNuage(id){
    try { const m = await COFFRE.recevoir("doc:" + id); if (!m || !m.n) return null; const parts = [];
      for (let i = 0; i < m.n; i++){ const p = await COFFRE.recevoir("doc:" + id + ":" + i); if (!p || !p.b) return null; parts.push(unb64(p.b)); }
      const bl = new Blob(parts, { type:m.type || "" }); await fPut(id, bl); return bl; } catch(x){ return null; } }
  async function blob(id){
    const b = await fGet(id); if (b) return b;
    const x = doc(id); if (x && x.nuage){ const r = await recevoirNuage(id); if (r) return r; }
    throw new Error("introuvable"); }
  async function synchro(){
    if (!window.COFFRE || !permisLecture()) return;
    for (const x of liste().docs){ const ici = await fGet(x.id);
      if (ici && !x.nuage) await envoyerNuage(x.id);
      else if (!ici && x.nuage) await recevoirNuage(x.id); }
    relancerPropositions(); }

  /* ---- qui peut quoi ---- */
  const sess = () => window.ACCES && ACCES.session;
  const permisLecture = () => { const S = sess(); return !!(S && !S.eleve); };
  const permis = () => { const S = sess(); if (!S || S.eleve) return false; const c = ACCES.data && ACCES.data.comptes && ACCES.data.comptes[S.id]; return !!(c && (c.admin || c.ajout)); };

  /* ---- aperçu (couverture + nombre de pages) ---- */
  async function pdfjs(){
    if (window.pdfjsLib && window.pdfjsLib.getDocument) return;
    const base = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";
    await new Promise((ok, ko) => { const s = document.createElement("script"); s.src = base + "pdf.min.js"; s.onload = ok; s.onerror = ko; document.head.append(s); });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = base + "pdf.worker.min.js"; }
  async function apercu(bl, ext){
    const cv = document.createElement("canvas");
    try {
      if (ext === "pdf"){ await pdfjs(); const pdf = await pdfjsLib.getDocument({ data:await bl.arrayBuffer() }).promise, pg = await pdf.getPage(1), v = pg.getViewport({ scale:1 }), vp = pg.getViewport({ scale:420 / v.width });
        cv.width = Math.round(vp.width); cv.height = Math.round(vp.height); const c = cv.getContext("2d"); c.fillStyle = "#fff"; c.fillRect(0, 0, cv.width, cv.height);
        await pg.render({ canvasContext:c, viewport:vp }).promise; return { couv:cv.toDataURL("image/jpeg", .78), pages:pdf.numPages }; }
      if (ext === "img"){ const im = await createImageBitmap(bl), k = 420 / im.width; cv.width = 420; cv.height = Math.round(im.height * k);
        const c = cv.getContext("2d"); c.fillStyle = "#fff"; c.fillRect(0, 0, cv.width, cv.height); c.drawImage(im, 0, 0, cv.width, cv.height); return { couv:cv.toDataURL("image/jpeg", .78), pages:1 }; }
    } catch(x){}
    return { couv:"", pages:0 }; }
  const extDe = f => /pdf$/i.test(f.type) || /\.pdf$/i.test(f.name) ? "pdf" : /^image\//.test(f.type) ? "img" : /html?$/i.test(f.type) || /\.html?$/i.test(f.name) ? "html" : "";

  /* ---- intégration dans la bibliothèque, Activités et Plans ---- */
  function integrer(){
    const S = sess(), d = permisLecture() ? liste().docs : [];
    try {
      for (let i = LIVRES.length - 1; i >= 0; i--) if (LIVRES[i].perso) LIVRES.splice(i, 1);
      d.filter(x => x.k === "livre").forEach(x => LIVRES.push({ fichier:"p_" + x.id, perso:true, id:x.id, titre:x.titre, auteur:S ? S.nom : "", categorie:x.prog, niveau:x.comp || "",
        pages:x.pages || "", description:x.desc || "Ton livre. Visible seulement pour toi.", couverture:x.couv || "", couleurs:palette(x.titre), annee:new Date(x.added).getFullYear(), added:x.added }));
      render(); renderHero();
    } catch(x){}
    const A = window.__activites; if (A){
      for (let i = A.length - 1; i >= 0; i--) if (A[i].perso) A.splice(i, 1);
      d.filter(x => x.k === "act").forEach(x => A.push({ f:"p_" + x.id, perso:true, id:x.id, titre:x.titre, type:"Mes formatifs", prog:x.prog, progs:[x.prog], comp:x.comp || "Mon formatif", pages:x.pages || 0, desc:x.desc || "Ton formatif. Visible seulement pour toi.", img:x.couv || "img/metier-plus-icone.svg" }));
      if (window.__dessinerAct && !q("#actOv").hidden) __dessinerAct(); }
    dessinerPlans();
  }
  /* documents publiés pour tous (reglages.json « ajouts ») */
  function appliquerAjouts(){
    const aj = (window.REGLAGES_AJOUTS = (typeof REGLAGES !== "undefined" && REGLAGES.ajouts) || []);
    try {
      for (let i = LIVRES.length - 1; i >= 0; i--) if (LIVRES[i].ens) LIVRES.splice(i, 1);
      aj.filter(a => a.k === "livre").forEach(a => LIVRES.push({ fichier:a.f, ens:true, titre:a.titre, auteur:a.de, categorie:a.prog, niveau:a.comp || "", pages:a.pages || "",
        description:a.desc || "Proposé par " + a.de + ".", couverture:a.couv ? "img/couv/" + a.f + ".jpg" : "", couleurs:palette(a.titre), annee:(a.date || "").slice(0, 4) }));
    } catch(x){}
    const A = window.__activites; if (A){
      for (let i = A.length - 1; i >= 0; i--) if (A[i].ens) A.splice(i, 1);
      aj.filter(a => a.k === "act").forEach(a => A.push({ f:a.f, ens:true, titre:a.titre, type:"Formatifs des enseignants", prog:a.prog, progs:[a.prog], comp:a.comp || "Proposé par " + a.de, pages:a.pages || 0, desc:a.desc || "Proposé par " + a.de + "." })); }
    dessinerPlans();
  }
  function dessinerPlans(){
    const vide = q("#plEmpty"); if (!vide) return;
    let sec = q("#mdPlans"); if (!sec){ sec = document.createElement("section"); sec.className = "pn-row"; sec.id = "mdPlans"; const r = q("#plRecRow"); r ? r.before(sec) : vide.append(sec); }
    const miens = permisLecture() ? liste().docs.filter(x => x.k === "plan") : [], ens = (window.REGLAGES_AJOUTS || []).filter(a => a.k === "plan");
    const carte = (k, id, titre, img, sous) => '<button class="pn-card" type="button" data-mdplan="' + k + '" data-id="' + e(id) + '"><span class="pn-img"><img src="' + e(img) + '" alt="" loading="lazy"></span><b>' + e(titre) + '</b><small>' + e(sous) + '</small></button>';
    sec.hidden = !miens.length && !ens.length && !permis();
    sec.innerHTML = '<h3 class="pn-t">' + (ens.length ? (miens.length || permis() ? 'Mes plans et plans des enseignants' : 'Plans des enseignants') : 'Mes plans') + '</h3><div class="pn-cards">'
      + miens.map(x => carte("p", x.id, x.titre, x.couv || "img/metier-plus-icone.svg", (x.pages > 1 ? x.pages + " feuilles · " : "") + "à toi")).join("")
      + ens.map(a => carte("e", a.f, a.titre, "plans/ens-" + a.f + ".jpg", "Proposé par " + a.de)).join("")
      + (permis() ? '<button class="pn-card md-plus" type="button" data-mdajout="plan"><span class="pn-img"><i class="md-plus-i">+</i></span><b>Ajouter un plan</b><small>PDF ou image</small></button>' : '')
      + '</div>';
  }

  /* ---- ouvrir ---- */
  function pleinEcran(){ try { if (!document.fullscreenElement && !document.body.classList.contains("classe") && !(window.PREF && PREF().plein === false)){ window.FS_PAR = "livre"; document.documentElement.requestFullscreen().catch(() => { window.FS_PAR = ""; }); } } catch(x){} }
  async function versLivre(bl, ext, titre, complet){   /* PDF : pages dessinées à mesure (rapide); complet = toutes les pages dans le fichier (publication) */
    if (ext === "html") return bl.text();
    return livreDePdf(bl, titre, !!complet); }
  async function ouvrirLivrePerso(l){
    const x = doc(l.id); if (!x) return; pleinEcran(); chargement(l, true);
    try { const bl = await blob(x.id), h = await versLivre(bl, x.ext, x.titre); chargement(l); ouvrirLivre(l, h); }
    catch(er){ chargement(null); if (/court/.test(er.message)) ouvrirFichier(x.id); else avis(er.message === "introuvable" ? "Ce fichier n'est pas sur cet ordinateur (il dépasse 20 Mo ou n'est pas encore arrivé)." : "Impossible d'ouvrir ce document : " + er.message); } }
  async function ouvrirFichier(id, telecharger){
    const x = doc(id); try { const bl = await blob(id), u = URL.createObjectURL(bl);
      if (telecharger){ const a = document.createElement("a"); a.href = u; a.download = (x ? x.titre : "document") + (x && x.ext === "pdf" ? ".pdf" : ""); document.body.append(a); a.click(); a.remove(); }
      else window.open(u, "_blank");
      setTimeout(() => URL.revokeObjectURL(u), 60000); } catch(er){ avis("Ce fichier n'est pas sur cet ordinateur."); } }
  async function ouvrirPlan(k, id){
    try { let bl, titre, type;
      if (k === "p"){ const x = doc(id); bl = await blob(id); titre = x.titre; type = x.ext === "pdf" ? "pdf" : "img"; }
      else { const a = (window.REGLAGES_AJOUTS || []).find(y => y.f === id); const r = await fetch("plans/ens-" + id + "." + (a.fx || "pdf")); if (!r.ok) throw new Error(); bl = await r.blob(); titre = a.titre; type = (a.fx || "pdf") === "pdf" ? "pdf" : "img"; }
      window.__plans.charger({ id:"md_" + id, name:titre, type, blob:bl, used:Date.now() });
    } catch(er){ avis("Impossible d'ouvrir ce plan."); } }

  /* ---- fenêtre « Ajouter » (même fiche que les livres : #modal / #panel) ---- */
  let FICHIER = null, TYPE = "";
  function dlgAjout(k, f){
    if (!permis()){ avis(sess() ? "L'ajout de documents n'est pas activé pour ton compte. Demande-le à l'administrateur." : "Connecte-toi pour ajouter tes documents."); return; }
    FICHIER = null; TYPE = k || "";
    const S = sess(), c = ACCES.data.comptes[S.id] || {}, pd = (c.prog && c.prog[0]) || (window.filtreProg) || PROGS[0][0];
    q("#panel").innerHTML = '<div class="panel-top md-top"><button class="close" aria-label="Fermer">✕</button><h2>Ajouter un document</h2><p>Ton PDF devient un livre, un formatif ou un plan, avec tous les outils de Métier+.</p></div>'
      + '<div class="panel-body md-corps">'
      + '<label class="md-zone" id="mdZone"><input type="file" id="mdFich" accept=".pdf,application/pdf,image/*,.html,.htm" hidden>'
      + '<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V4M7 9l5-5 5 5M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/></svg>'
      + '<b id="mdZt">Glisse ton fichier ici</b><small id="mdZs">ou touche pour le choisir · PDF, image ou livre HTML · 20 Mo et moins pour qu\'il te suive partout</small></label>'
      + '<div class="md-q">C\'est quoi ?</div><div class="md-types">'
      + ["livre", "act", "plan"].map(t => '<button type="button" data-mdt="' + t + '"' + (t === TYPE ? ' class="on"' : '') + '>' + ICO[t] + '<b>' + NOMS[t] + '</b><small>' + SOUS[t] + '</small></button>').join("") + '</div>'
      + '<div class="md-champs"><label><span>Titre</span><input id="mdTitre" maxlength="90" placeholder="Ex. : Soudure au cuivre — module 4"></label>'
      + '<label><span>Programme</span><select id="mdProg">' + PROGS.map(p => '<option' + (p[0] === pd ? ' selected' : '') + '>' + e(p[0]) + '</option>').join("") + '</select></label>'
      + '<label><span>Compétence ou module <i>(facultatif)</i></span><input id="mdComp" maxlength="80" placeholder="Ex. : Compétence 5"></label>'
      + '<label class="md-large"><span>Description <i>(facultatif)</i></span><input id="mdDesc" maxlength="240"></label></div>'
      + '<label class="md-prop"><input type="checkbox" id="mdProp"><span><b>Proposer aux autres enseignants</b><small>L\'administrateur le regarde, puis le publie pour tout le monde. Sinon, il reste visible pour toi seulement.</small></span></label>'
      + '<p class="md-err" id="mdErr" hidden></p>'
      + '<button class="btn btn-play" id="mdOk" type="button">Ajouter</button><button class="btn btn-fav" id="mdNon" type="button">Annuler</button></div>';
    q("#modal").classList.add("open", "sur-act");
    q("#panel .close").onclick = closeModal; q("#mdNon").onclick = closeModal;
    const z = q("#mdZone");
    q("#mdFich").onchange = ev => choisirFichier(ev.target.files[0]);
    z.addEventListener("dragover", ev => { ev.preventDefault(); z.classList.add("sur"); });
    z.addEventListener("dragleave", () => z.classList.remove("sur"));
    z.addEventListener("drop", ev => { ev.preventDefault(); ev.stopPropagation(); z.classList.remove("sur"); choisirFichier(ev.dataTransfer.files[0]); });
    q("#panel .md-types").onclick = ev => { const b = ev.target.closest("[data-mdt]"); if (!b || b.disabled) return; TYPE = b.dataset.mdt; majTypes(); };
    q("#mdOk").onclick = valider;
    if (f) choisirFichier(f); else majTypes();
  }
  const SOUS = { livre:"Dans « Mes livres »", act:"Dans Formatifs", plan:"Échelle et mesure" };
  const ICO = {
    livre:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/></svg>',
    act:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h8l3 3v15H5V3z"/><path d="M9 11l2 2 4-4M9 17h6"/></svg>',
    plan:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/></svg>' };
  function majTypes(){
    const ext = FICHIER ? extDe(FICHIER) : "";
    document.querySelectorAll("#panel [data-mdt]").forEach(b => { const t = b.dataset.mdt, ok = !ext || (ext === "pdf") || (ext === "img" && t === "plan") || (ext === "html" && t === "livre");
      b.disabled = !ok; if (!ok && TYPE === t) TYPE = ""; b.classList.toggle("on", t === TYPE); });
    if (ext && !TYPE){ TYPE = ext === "img" ? "plan" : ext === "html" ? "livre" : ""; if (TYPE) majTypes(); } }
  function choisirFichier(f){
    if (!f) return; const ext = extDe(f), err = q("#mdErr");
    if (!ext){ err.hidden = false; err.textContent = "Ce fichier n'est pas un PDF, une image ou un livre HTML."; return; }
    err.hidden = true; FICHIER = f;
    q("#mdZone").classList.add("plein"); q("#mdZt").textContent = f.name; q("#mdZs").textContent = mo(f.size) + (f.size > MAX ? " · plus de 20 Mo : il restera seulement sur cet ordinateur" : "") + " · touche pour en choisir un autre";
    const t = q("#mdTitre"); if (!t.value) t.value = f.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 90);
    majTypes(); }
  async function valider(){
    const err = q("#mdErr"), dire = m => { err.hidden = false; err.textContent = m; };
    if (!FICHIER) return dire("Choisis d'abord un fichier.");
    if (!TYPE) return dire("Choisis si c'est un livre, un formatif ou un plan.");
    const titre = q("#mdTitre").value.trim(); if (!titre) return dire("Donne-lui un titre.");
    const b = q("#mdOk"); b.disabled = true; b.textContent = "Préparation…";
    try {
      const f = FICHIER, ext = extDe(f), id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      await fPut(id, f);
      const ap = await apercu(f, ext), d = liste();
      d.docs.push({ id, k:TYPE, titre, prog:q("#mdProg").value, comp:q("#mdComp").value.trim(), desc:q("#mdDesc").value.trim(), ext, nom:f.name, taille:f.size, couv:ap.couv, pages:ap.pages, added:Date.now(), maj:Date.now(), nuage:0 });
      sauver(d); const prop = q("#mdProp").checked, k = TYPE;
      closeModal(); integrer();
      avis(NOMS[k] + " ajouté" + (k === "livre" ? " dans « Mes livres »" : k === "act" ? " dans Formatifs" : " dans Plans") + ".", 3500);
      envoyerNuage(id).then(ok => { if (!ok && f.size > MAX) avis("Ce fichier dépasse 20 Mo : il reste seulement sur cet ordinateur.", 5000); else if (!ok && nuageTotal() + f.size > QUOTA) avis("Ton espace (100 Mo) est plein : ce fichier reste seulement sur cet ordinateur.", 5000); });
      if (prop) proposer(id);
    } catch(er){ b.disabled = false; b.textContent = "Ajouter"; dire("Impossible d'ajouter ce fichier : " + er.message); } }

  /* ---- fiche : supprimer, proposer ---- */
  function boutonsFiche(id){
    const x = doc(id); if (!x) return "";
    const pub = (window.REGLAGES_AJOUTS || []).some(a => a.pid && a.pid === x.pid);
    const etat = pub ? "Publié pour tous les enseignants." : x.prop === "envoye" ? "Proposé à l'administrateur : en attente." : x.nuage ? "Visible pour toi seulement, sur tous tes ordinateurs." : "Visible pour toi seulement, sur cet ordinateur.";
    return '<p class="md-etat">' + e(etat) + '</p>' + (pub || x.prop === "envoye" ? "" : '<button class="btn btn-fav" type="button" data-md="proposer" data-id="' + e(id) + '">Proposer à tous</button>')
      + '<button class="btn btn-fav md-suppr" type="button" data-md="suppr" data-id="' + e(id) + '">Supprimer</button>'; }
  async function supprimer(id){
    const d = liste(), x = d.docs.find(y => y.id === id); if (!x) return;
    d.docs = d.docs.filter(y => y.id !== id); d.sup = d.sup || {}; d.sup[id] = Date.now(); sauver(d);
    fDel(id); integrer(); closeModal(); avis("« " + x.titre + " » est supprimé.");
    if (x.nuage && window.COFFRE) try { for (let i = 0; i < (x.n || 1); i++) await COFFRE.effacer("doc:" + id + ":" + i); await COFFRE.effacer("doc:" + id); } catch(er){} }
  document.addEventListener("click", ev => {
    const b = ev.target.closest("[data-md]"); if (b){
      if (b.dataset.md === "proposer"){ b.disabled = true; proposer(b.dataset.id).then(() => { const p = b.closest(".panel-body"); if (p){ b.remove(); const et = p.querySelector(".md-etat"); if (et) et.textContent = "Proposé à l'administrateur : en attente."; } }); }
      if (b.dataset.md === "suppr"){ if (!b.classList.contains("sur")){ b.classList.add("sur"); b.textContent = "Sûr ? Touche encore"; setTimeout(() => { b.classList.remove("sur"); b.textContent = "Supprimer"; }, 3000); return; } supprimer(b.dataset.id); }
      return; }
    const a = ev.target.closest("[data-mdajout]"); if (a){ ev.preventDefault(); dlgAjout(a.dataset.mdajout); return; }
    const p = ev.target.closest("[data-mdplan]"); if (p) ouvrirPlan(p.dataset.mdplan, p.dataset.id);
  });

  /* ---- proposer à l'administrateur ---- */
  function adminPub(){ const C = ACCES.data && ACCES.data.comptes; if (!C) return null; const ids = Object.keys(C).filter(i => C[i].admin);
    const id = ids.includes("jeremy.raymond") ? "jeremy.raymond" : ids[0]; return id ? C[id].pub : null; }
  async function proposer(id){
    const x = doc(id), S = sess(); if (!x || !S) return;
    if (x.taille > MAX){ avis("Ce fichier dépasse 20 Mo : il ne peut pas être proposé. Réduis-le d'abord (PDF compressé)."); return; }
    const pub = adminPub(); if (!pub || !window.COFFRE){ avis("Impossible d'envoyer la proposition pour l'instant."); return; }
    try {
      avis("Envoi de la proposition…", 2500);
      const bl = await blob(id), u = new Uint8Array(await bl.arrayBuffer()), n = Math.max(1, Math.ceil(u.length / MORCEAU)), pid = b64u(crypto.getRandomValues(new Uint8Array(12)));
      for (let i = 0; i < n; i++) await COFFRE.deposer("prop:" + pid + ":" + i, { b:b64(u.subarray(i * MORCEAU, (i + 1) * MORCEAU)) }, pub);
      const meta = { pid, k:x.k, titre:x.titre, prog:x.prog, comp:x.comp, desc:x.desc, ext:x.ext, type:bl.type || "", taille:u.length, n, pages:x.pages, de:S.nom, compte:S.id, t:Date.now() };
      const code = "PROPOSITION-" + b64u(new TextEncoder().encode(JSON.stringify(meta)));
      await envoyerAvis(code, x.titre);
      const att = lj("propsEnAttente", {}); att[pid] = { code, envoi:Date.now(), t0:Date.now(), id }; ej("propsEnAttente", att);
      maj(id, { prop:"envoye", pid }); avis("Proposition envoyée à l'administrateur.", 3500);
    } catch(er){ avis("La proposition n'a pas pu partir : " + er.message); } }
  async function envoyerAvis(code, titre){
    const r = await fetch(ACCES.outils.BOITE, { method:"POST", body:code, headers:{ Title:"Proposition : " + ACCES.outils.sansAcc(titre).replace(/[^\x20-\x7e]/g, ""), Tags:"inbox_tray" } });
    if (!r.ok) throw new Error("réponse " + r.status); }
  async function relancerPropositions(){   /* ntfy ne garde les avis que 12 h : renvoyer aux 6 h tant que ce n'est pas publié (14 jours au plus) */
    const att = lj("propsEnAttente", {}), aj = window.REGLAGES_AJOUTS || []; let ch = false;
    for (const pid in att){ const a = att[pid];
      if (aj.some(x => x.pid === pid) || Date.now() - a.t0 > 14 * 864e5){ delete att[pid]; ch = true; continue; }
      if (Date.now() - a.envoi > 6 * 3600e3) try { await envoyerAvis(a.code, "renvoi"); a.envoi = Date.now(); ch = true; } catch(er){} }
    if (ch) ej("propsEnAttente", att); }

  /* ---- Administration → Propositions ---- */
  const FAITES = () => lj("propsFaites", []);
  const CACHE = {};
  async function prendreFichier(p){
    if (CACHE[p.pid]) return CACHE[p.pid]; const parts = [];
    for (let i = 0; i < p.n; i++){ const o = await COFFRE.prendre("prop:" + p.pid + ":" + i); if (!o || !o.b) throw new Error("fichier pas encore arrivé ou déjà retiré"); parts.push(unb64(o.b)); }
    return CACHE[p.pid] = new Blob(parts, { type:p.type || (p.ext === "pdf" ? "application/pdf" : "") }); }
  async function lirePropositions(){
    const vues = lj("propsVues", {});
    try { const r = await fetch(ACCES.outils.BOITE + "/json?poll=1&since=12h", { cache:"no-store" });
      if (r.ok) (await r.text()).split("\n").filter(Boolean).forEach(l => { try { const m = JSON.parse(l); if (m.event !== "message" || !/^PROPOSITION-/.test(m.message || "")) return;
        const p = JSON.parse(new TextDecoder().decode(unb64u(m.message.trim().slice(12)))); if (p && p.pid && !vues[p.pid]) vues[p.pid] = p; } catch(x){} }); } catch(x){}
    ej("propsVues", vues); const f = FAITES();
    return Object.values(vues).filter(p => !f.includes(p.pid)).sort((a, b) => b.t - a.t); }
  async function panneau(el){
    if (!el) return; el.innerHTML = '<p class="sous">Chargement…</p>';
    const L = await lirePropositions(), aj = (typeof REGLAGES !== "undefined" && REGLAGES.ajouts) || [];
    el.innerHTML = '<p class="sous">Les enseignants qui ont la permission « Ajouts » (bouton sur leur fiche, onglet Enseignants) peuvent te proposer un livre, un formatif ou un plan. « Publier » le met en ligne pour tous : un livre est protégé (seuls les enseignants de son programme l\'ouvrent), un formatif ou un plan est public, comme les tiens.</p>'
      + (L.length ? '<div class="acces-fiches">' + L.map(p => '<div class="acces-fiche f2 md-pr" data-pid="' + e(p.pid) + '"><div class="fh"><div class="qui"><b>' + e(p.titre) + '</b><small>' + NOMS[p.k] + ' · ' + e(p.prog) + (p.comp ? ' · ' + e(p.comp) : '') + ' · ' + mo(p.taille) + (p.pages ? ' · ' + p.pages + ' pages' : '') + '<br>Proposé par ' + e(p.de) + ' le ' + new Date(p.t).toLocaleDateString("fr-CA") + '</small></div>'
          + '<div class="progs"><button class="pg" data-prv="voir">Aperçu</button><button class="pg on" data-prv="pub">Publier</button><button class="pg" data-prv="non">Refuser</button></div></div><p class="sous md-msg" hidden></p></div>').join("") + '</div>'
        : '<p class="sous"><b>Aucune proposition en attente.</b></p>')
      + (aj.length ? '<div class="acces-sec"><h3>Déjà publiés</h3><p class="sous">' + aj.map(a => e(a.titre) + ' <i>(' + NOMS[a.k] + ', ' + e(a.de) + ')</i>').join(" · ") + '</p></div>' : '');
    el.querySelectorAll("[data-prv]").forEach(b => b.onclick = async () => {
      const c = b.closest("[data-pid]"), p = L.find(x => x.pid === c.dataset.pid), msg = c.querySelector(".md-msg"), dire = (t, err) => { msg.hidden = false; msg.textContent = t; msg.style.color = err ? "#e2483d" : ""; };
      try {
        if (b.dataset.prv === "voir"){ dire("Téléchargement…"); const bl = await prendreFichier(p); dire(""); msg.hidden = true; await apercuAdmin(p, bl); return; }
        if (b.dataset.prv === "non"){ if (!b.classList.contains("sur")){ b.classList.add("sur"); b.textContent = "Sûr ?"; return; } dire("Retrait…"); await jeter(p); ej("propsFaites", [...FAITES(), p.pid].slice(-300)); c.remove(); return; }
        c.querySelectorAll("button").forEach(x => x.disabled = true); dire("Publication… (ça peut prendre une minute pour un gros livre)");
        await publier(p); ej("propsFaites", [...FAITES(), p.pid].slice(-300)); dire("Publié pour tous les enseignants. En ligne dans 1 à 2 minutes.");
      } catch(er){ c.querySelectorAll("button").forEach(x => x.disabled = false); dire("Erreur : " + er.message, true); } }); }
  async function jeter(p){ for (let i = 0; i < p.n; i++) try { await COFFRE.jeter("prop:" + p.pid + ":" + i); } catch(x){} delete CACHE[p.pid]; }
  async function apercuAdmin(p, bl){
    const ov = q("#accesOv"); if (ov) ov.hidden = true;
    if (p.k === "plan"){ q("#planBtn").click(); setTimeout(() => window.__plans.charger({ id:"prop_" + p.pid, name:"Aperçu : " + p.titre, type:p.ext === "pdf" ? "pdf" : "img", blob:bl, used:Date.now() }), 300); return; }
    const l = { titre:"Aperçu : " + p.titre, fichier:"prop-" + p.pid, categorie:p.prog };
    chargement(l, true); try { const h = await versLivre(bl, p.ext, p.titre); chargement(l); ouvrirLivre(l, h); } catch(er){ chargement(null); const u = URL.createObjectURL(bl); window.open(u, "_blank"); } }
  async function jpgDe(bl, ext){ const ap = await apercu(bl, ext); return ap.couv ? unb64(ap.couv.split(",")[1]) : null; }
  async function publier(p){
    const jt = localStorage.getItem("ghJeton"); if (!jt) throw new Error("la publication n'est pas activée sur cet ordinateur");
    const bl = await prendreFichier(p), u = new Uint8Array(await bl.arrayBuffer());
    const base = ACCES.outils.sansAcc(p.titre).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "doc";
    const f = "ens-" + base + "-" + p.pid.slice(0, 5).toLowerCase().replace(/[^a-z0-9]/g, "x"), files = {};
    const ent = { k:p.k, f, titre:p.titre, prog:p.prog, comp:p.comp || "", desc:p.desc || "", de:p.de, pages:p.pages || 0, date:new Date().toLocaleDateString("en-CA"), pid:p.pid };
    const jpg = await jpgDe(bl, p.ext);
    let livre = null;
    if (p.k === "act"){ files["activites/" + f + ".pdf"] = u; if (jpg) files["activites/" + f + ".jpg"] = jpg; }
    else if (p.k === "plan"){ const fx = p.ext === "pdf" ? "pdf" : (/png/.test(p.type) ? "png" : /webp/.test(p.type) ? "webp" : "jpg"); ent.fx = fx; files["plans/ens-" + f + "." + fx] = u; if (jpg) files["plans/ens-" + f + ".jpg"] = jpg; }
    else {   /* livre : chiffré comme les autres, clé pour les admins et les enseignants de son programme */
      const h = await versLivre(bl, p.ext, p.titre, true), gz = new Uint8Array(await new Response(new Blob([h]).stream().pipeThrough(new CompressionStream("gzip"))).arrayBuffer());
      const brut = crypto.getRandomValues(new Uint8Array(32)), k = await crypto.subtle.importKey("raw", brut, "AES-GCM", false, ["encrypt"]), iv = crypto.getRandomValues(new Uint8Array(12));
      const c = new Uint8Array(await crypto.subtle.encrypt({ name:"AES-GCM", iv }, k, gz)), out = new Uint8Array(12 + c.length); out.set(iv); out.set(c, 12);
      files["livres/" + f + ".chiffre"] = out;
      const C = JSON.parse(JSON.stringify(ACCES.data)); livre = { cles:{} };
      for (const id in C.comptes){ const x = C.comptes[id]; if (x.admin || (x.prog || []).includes(p.prog)) livre.cles[id] = await ACCES.outils.envelopperPour(brut, x.pub); }
      C.livres[f] = livre; files["comptes.json"] = JSON.stringify(C, null, 1);
      if (jpg){ files["img/couv/" + f + ".jpg"] = jpg; ent.couv = 1; } }
    const R = JSON.parse(JSON.stringify(REGLAGES)); R.ajouts = (R.ajouts || []).filter(a => a.pid !== p.pid).concat(ent);
    files["reglages.json"] = JSON.stringify(R, null, 1);
    await ACCES.outils.commitGitHub(jt, files, "Publication : " + p.titre + " (proposé par " + p.de + ")");
    ACCES.outils.integrer(livre ? f : null, livre, R.ajouts);
    appliquerReglages(R); try { render(); renderHero(); } catch(x){}
    jeter(p);
  }

  /* ---- glisser-déposer n'importe où (bibliothèque, Activités) ---- */
  let voile = null, prof = 0;
  const peutDeposer = ev => permis() && ev.dataTransfer && [...(ev.dataTransfer.types || [])].includes("Files") && !q("#reader.open") && (!q("#planOv") || q("#planOv").hidden) && !q("#modal.open");
  document.addEventListener("dragenter", ev => { if (!peutDeposer(ev)) return; prof++; if (!voile){ voile = document.createElement("div"); voile.className = "md-voile"; voile.innerHTML = '<div><svg viewBox="0 0 24 24" width="54" height="54" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V4M7 9l5-5 5 5M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/></svg><b>Dépose ton fichier</b><small>Tu choisiras ensuite : livre, formatif ou plan</small></div>'; document.body.append(voile); } });
  document.addEventListener("dragover", ev => { if (voile) ev.preventDefault(); });
  document.addEventListener("dragleave", () => { if (voile && --prof <= 0){ voile.remove(); voile = null; prof = 0; } });
  document.addEventListener("drop", ev => { if (!voile) return; ev.preventDefault(); voile.remove(); voile = null; prof = 0;
    const f = ev.dataTransfer.files[0]; if (f) dlgAjout(q("#actOv") && !q("#actOv").hidden ? "act" : "", f); });

  /* ---- boutons « + Ajouter » ---- */
  function boutons(){
    const ok = permis();
    const act = q("#actOv .act-outils"); if (act && !q("#mdAjAct")) act.insertAdjacentHTML("beforeend", '<button type="button" class="md-btn" id="mdAjAct" data-mdajout="act">+ Ajouter un formatif</button>');
    const pl = q("#plEmpty .pn-btns"); if (pl && !q("#mdAjPl")) pl.insertAdjacentHTML("beforeend", '<button type="button" class="md-btn" id="mdAjPl" data-mdajout="plan">+ Ajouter à mes plans</button>');
    document.querySelectorAll("#mdAjAct, #mdAjPl").forEach(b => b.hidden = !ok);
    document.body.classList.toggle("md-permis", ok); }

  /* ---- branchements ---- */
  const lire0 = window.lire; window.lire = function(l){ if (l && l.perso) return ouvrirLivrePerso(l); return lire0.apply(this, arguments); };
  const om0 = window.openModal; window.openModal = function(l){ om0.apply(this, arguments); if (l && l.perso){ const pb = q("#panel .panel-body"); if (pb){ pb.insertAdjacentHTML("beforeend", boutonsFiche(l.id)); const m = pb.querySelector("#mFav"); if (m) m.remove(); } } };
  const ar0 = window.appliquerReglages; window.appliquerReglages = function(R){ ar0.apply(this, arguments); appliquerAjouts(); };
  const depart = () => { boutons(); appliquerAjouts(); integrer(); };
  (window.ACCES ? ACCES.pret : Promise.resolve()).then(() => { depart(); setTimeout(synchro, 8000); setInterval(synchro, 10 * 60000); }).catch(() => {});
  new MutationObserver(() => { boutons(); }).observe(document.body, { attributes:true, attributeFilter:["class"] });
  return { dlgAjout, blob, ouvrirFichier, boutonsFiche, panneau, integrer, liste:() => liste().docs };
})();
