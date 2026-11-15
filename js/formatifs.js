/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — formatifs.js (sorti d'index.html le 15 nov.) */
/* Activités : PDF de Jeremy (suivis d'atelier, cahiers, exercices), séparés des livres. Pour en ajouter : déposer le PDF dans activites/ avec une image .jpg du même nom, puis une ligne ici. */
(function(){
  const ACTIVITES = [
    { f:"montages-circuit-ferme", titre:"Montages en circuit fermé", type:"Cahier d'activités", prog:"Plomberie et chauffage",
      comp:"307-428 · Mécanique de tuyauterie", pages:66,
      desc:"27 activités de montage : fonte, PEX, cuivre, acier, acier rainuré, montages combinés, montants et supports, défis finaux. Calculs, tableaux et cases à cocher." },
    { f:"montages-electriques-c5", titre:"Ateliers de montages électriques", type:"Cahier d'activités", prog:"Plomberie et chauffage",
      comp:"307435 · Installation de composants électriques", pages:23, corrige:"montages-electriques-c5-corrige",
      desc:"18 ateliers de montage : fiche mâle, 8 montages filaires (interrupteur simple jusqu'au 3 voies + 4 voies), lecture de schéma à échelle, puis thermostat, pressostat, flotteur, relais, chauffe-eau et pompes. Préalable théorique avant chaque montage, mesures et grille de suivi." },
    { f:"plans-d1-lecture", titre:"Lecture et mesure — Maison unifamiliale", type:"Questionnaires de plans", prog:"Plomberie et chauffage", progs:["Plomberie et chauffage","Entretien général d\'immeubles"], comp:"Plan : Dossier 1 · Maison unifamiliale", pages:12, dossier:1, corrige:"plans-d1-lecture-corrige",
      desc:"Un seul questionnaire pour le dossier de plans 1 : lecture du dossier et mesures à l\'échelimètre. Choix multiple, vrai ou faux, calculs, association, trouve l\'erreur, images tirées des plans. Les questions sont propres à ce plan." },
    { f:"plans-d2-lecture", titre:"Lecture et mesure — Duplex jumelé", type:"Questionnaires de plans", prog:"Plomberie et chauffage", progs:["Plomberie et chauffage","Entretien général d\'immeubles"], comp:"Plan : Dossier 2 · Duplex jumelé", pages:12, dossier:2, corrige:"plans-d2-lecture-corrige",
      desc:"Un seul questionnaire pour le dossier de plans 2 : lecture du dossier et mesures à l\'échelimètre. Choix multiple, vrai ou faux, calculs, association, trouve l\'erreur, images tirées des plans. Les questions sont propres à ce plan." },
    { f:"plans-d3-lecture", titre:"Lecture et mesure — Bâtiment commercial", type:"Questionnaires de plans", prog:"Plomberie et chauffage", progs:["Plomberie et chauffage","Entretien général d\'immeubles"], comp:"Plan : Dossier 3 · Bâtiment commercial", pages:11, dossier:3, corrige:"plans-d3-lecture-corrige",
      desc:"Un seul questionnaire pour le dossier de plans 3 : lecture du dossier et mesures à l\'échelimètre. Choix multiple, vrai ou faux, calculs, association, trouve l\'erreur, images tirées des plans. Les questions sont propres à ce plan." },
    { f:"plans-d4-lecture", titre:"Lecture et mesure — Centre commercial", type:"Questionnaires de plans", prog:"Plomberie et chauffage", progs:["Plomberie et chauffage","Entretien général d\'immeubles"], comp:"Plan : Dossier 4 · Centre commercial", pages:11, dossier:4, corrige:"plans-d4-lecture-corrige",
      desc:"Un seul questionnaire pour le dossier de plans 4 : lecture du dossier et mesures à l\'échelimètre. Choix multiple, vrai ou faux, calculs, association, trouve l\'erreur, images tirées des plans. Les questions sont propres à ce plan." },
    { f:"plans-d5-lecture", titre:"Lecture et mesure — Ferme laitière", type:"Questionnaires de plans", prog:"Plomberie et chauffage", progs:["Plomberie et chauffage","Entretien général d\'immeubles"], comp:"Plan : Dossier 5 · Ferme laitière", pages:10, dossier:5, corrige:"plans-d5-lecture-corrige",
      desc:"Un seul questionnaire pour le dossier de plans 5 : lecture du dossier et mesures à l\'échelimètre. Choix multiple, vrai ou faux, calculs, association, trouve l\'erreur, images tirées des plans. Les questions sont propres à ce plan." }
  ];
  const COUL = { "Plomberie et chauffage":"#2f8fd8", "Entretien général d'immeubles":"#e0892b" };
  const COUL_DOS = { 1:"#1c5f8f", 2:"#2e7d4f", 3:"#c26a12", 4:"#6a3fa0", 5:"#3b7d2a" };
  const $ = id => document.getElementById(id), ov = $("actOv");
  const F = { q:"", p:"" }, OUVERTS = new Set();
  const progsDe = a => a.progs || [a.prog];
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));
  const IC_OUV = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/></svg>';
  const IC_IMP = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/></svg>';
  const IC_DL = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></svg>';
  function tuile(a){
    const ac = a.dossier ? COUL_DOS[a.dossier] : (COUL[a.prog] || "#EB6A22");
    return '<button type="button" class="act-tuile" style="--ac:' + ac + '" data-fiche="' + a.f + '" title="' + esc(a.titre) + '"><span class="act-vig"><img src="' + (a.img || 'activites/' + a.f + '.jpg') + '" alt="" loading="lazy"></span>' +
      '<span class="act-nom">' + esc(a.titre) + '</span><span class="act-sous">' + (a.pages ? a.pages + ' pages' : 'PDF') + (a.corrige ? ' · corrigé' : '') + '</span></button>';
  }
  function dessiner(){
    const q = F.q.trim().toLowerCase();
    const l = ACTIVITES.filter(a => (!F.p || progsDe(a).includes(F.p)) && (!q || (a.titre + " " + a.comp + " " + a.desc + " " + a.type).toLowerCase().includes(q)));
    const sp = $("actProg"); if (sp && sp.options.length < 2){ [...new Set(ACTIVITES.flatMap(progsDe))].forEach(p => sp.add(new Option(p, p))); sp.parentNode.hidden = false; }
    if (!l.length){ $("actListe").innerHTML = '<div class="act-vide">Aucun formatif trouvé.</div>'; return; }
    const groupes = [...new Set(ACTIVITES.map(a => a.type))].sort((x, y) => (y === "Mes formatifs") - (x === "Mes formatifs"));
    $("actListe").innerHTML = groupes.map(g => {
      const m = l.filter(a => a.type === g).sort((x, y) => (x.dossier || 0) - (y.dossier || 0) || x.titre.localeCompare(y.titre, "fr")); if (!m.length) return "";
      const ouvert = q || OUVERTS.has(g);
      return '<section class="act-rang' + (ouvert ? ' ouvert' : '') + '"><div class="act-rh"><h3>' + esc(g) + '<b>' + m.length + '</b></h3>' + (m.length > 5 ? '<button type="button" class="act-tout" data-g="' + esc(g) + '">' + (ouvert ? 'Réduire' : 'Tout voir (' + m.length + ')') + '</button>' : '') + '</div><div class="act-ligne">' + m.map(tuile).join("") + '</div></section>';
    }).join("");
  }
  function fiche(a){   /* même fiche que celle d'un livre (#modal / #panel de la bibliothèque) */
    const c = a.dossier ? COUL_DOS[a.dossier] : (COUL[a.prog] || "#EB6A22");
    $("panel").innerHTML =
      '<div class="panel-top with-cover" style="background:linear-gradient(160deg,' + c + ',#14141a)"><button class="close" aria-label="Fermer">✕</button><img class="panel-cover" src="' + (a.img || 'activites/' + a.f + '.jpg') + '" alt=""><h2>' + esc(a.titre) + '</h2></div>' +
      '<div class="panel-body"><div class="meta"><span>' + esc(a.type) + '</span><span>' + (a.pages ? a.pages + ' pages' : 'PDF') + '</span><span>' + esc(a.comp) + '</span><span>' + esc(progsDe(a).join(' · ')) + '</span></div>' +
      '<p>' + esc(a.desc) + '</p>' +
      '<button class="btn btn-play" id="mRead" type="button" data-a="ouvrir" data-f="' + a.f + '">▶ Projeter</button>' +
      '<button class="btn btn-fav" id="mImp" type="button" data-a="imprimer" data-f="' + a.f + '">Imprimer</button>' +
      (a.perso ? '<button class="btn btn-fav" type="button" data-a="pdf" data-f="' + a.f + '">PDF</button>' : '<a class="btn btn-fav" id="mPdf" href="activites/' + a.f + '.pdf" download="' + esc(a.titre) + '.pdf">PDF</a>') +
      (a.corrige ? '<button class="btn btn-fav" id="mCorr" type="button" data-a="corrige" data-f="' + a.f + '">Corrigé</button>' : '') + (a.perso && window.MESDOCS ? MESDOCS.boutonsFiche(a.id) : '') + '</div>';
    $("modal").classList.add("open", "sur-act");
    $("panel").querySelector(".close").onclick = closeModal;
  }
  async function pdfDe(a){ if (a.perso) return MESDOCS.blob(a.id); const r = await fetch("activites/" + a.f + ".pdf"); if (!r.ok) throw new Error("introuvable"); return r.blob(); }
  /* PDF -> petit livre « pages empilées » (une image par page) que le lecteur de livres sait ouvrir */
  /* PDF -> livre. Rapide (8 nov., « il prend 3 min à ouvrir ») : le livre s'ouvre tout de suite avec des pages vides, et chaque page est dessinée
     au moment où on l'affiche (page en cours + 2 suivantes + 1 précédente), par la bibliothèque (window.__pdfPage). complet = toutes les pages en images
     dans le fichier (livre autonome, pour la publication). */
  async function pdfjsPret(){
    if (window.pdfjsLib && window.pdfjsLib.getDocument) return;
    const base = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";
    const load = src => new Promise((ok, ko) => { const sc = document.createElement("script"); sc.src = src; sc.onload = ok; sc.onerror = ko; document.head.append(sc); });
    await load(base + "pdf.min.js"); window.pdfjsLib.GlobalWorkerOptions.workerSrc = base + "pdf.worker.min.js";
  }
  window.__PDFS = window.__PDFS || {};
  window.__pdfPage = (id, n) => { const d = window.__PDFS[id]; if (!d) return Promise.reject(new Error("fermé"));
    if (d.c[n]) return d.c[n];
    return d.c[n] = new Promise((ok, ko) => { d.pile.push({ n, ok, ko }); setTimeout(() => tourner(d), 0); }); };
  /* la dernière page demandée passe en premier (on saute loin dans le livre : pas d'attente derrière les pages d'avant) */
  async function tourner(d){
    if (d.occupe) return; d.occupe = true;
    while (d.pile.length){ const { n, ok, ko } = d.pile.pop();
      try { const pg = await d.doc.getPage(n), v1 = pg.getViewport({ scale:1 }), vp = pg.getViewport({ scale:1300 / v1.width });
        const cv = document.createElement("canvas"); cv.width = Math.round(vp.width); cv.height = Math.round(vp.height); const x = cv.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, cv.width, cv.height);
        await pg.render({ canvasContext:x, viewport:vp }).promise; ok(cv.toDataURL("image/jpeg", .82)); }
      catch(e){ delete d.c[n]; ko(e); } }
    d.occupe = false; }
  const STYLE_PDF = '<style>html,body{margin:0;background:#fff}.page{width:816px;position:relative;background:#fff;overflow:hidden}.page img{display:block;width:100%;height:100%;object-fit:contain}.page i.att{position:absolute;inset:0;display:grid;place-items:center;font:600 18px Arial,sans-serif;color:#9a9aa2;font-style:normal}</style>';
  async function livreDePdf(blob, titre, complet){
    await pdfjsPret();
    const pdf = await window.pdfjsLib.getDocument({ data: await blob.arrayBuffer() }).promise;
    if (pdf.numPages < 3) throw new Error("trop court");
    const p1 = (await pdf.getPage(1)).getViewport({ scale:1 }), h = Math.round(816 * p1.height / p1.width);
    let out = "";
    if (complet){
      for (let i = 1; i <= pdf.numPages; i++){
        const pg = await pdf.getPage(i), v1 = pg.getViewport({ scale:1 }), vp = pg.getViewport({ scale:1300 / v1.width });
        const cv = document.createElement("canvas"); cv.width = Math.round(vp.width); cv.height = Math.round(vp.height);
        await pg.render({ canvasContext:cv.getContext("2d"), viewport:vp }).promise;
        out += '<section class="page" style="height:' + Math.round(816 * v1.height / v1.width) + 'px"><img alt="" src="' + cv.toDataURL("image/jpeg", .82) + '"></section>';
      }
      return '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>' + esc(titre) + '</title>' + STYLE_PDF + '</head><body><div id="activite">' + out + '</div></body></html>';
    }
    const id = "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    for (const k in window.__PDFS) if (Date.now() - window.__PDFS[k].t > 6 * 3600e3) delete window.__PDFS[k];
    window.__PDFS[id] = { doc:pdf, c:{}, pile:[], t:Date.now() };
    for (let i = 1; i <= pdf.numPages; i++) out += '<section class="page" data-n="' + i + '" style="height:' + h + 'px"><i class="att">Page ' + i + '…</i><img alt=""></section>';
    const js = '(function(){var P=parent,ID="' + id + '";function m(s){var n=+s.dataset.n;if(s.dataset.ok)return;s.dataset.ok="1";P.__pdfPage(ID,n).then(function(u){var im=s.querySelector("img");im.src=u;var a=s.querySelector(".att");if(a)a.remove();}).catch(function(){s.dataset.ok="";});}'
      + 'function t(){var pg=document.querySelectorAll(".page"),c=-1;for(var i=0;i<pg.length;i++){var s=pg[i];if(s.classList.contains("hcur")||s.classList.contains("live")){c=i;break;}}if(c<0)c=0;[c+2,c-1,c+1,c].forEach(function(k){if(pg[k])m(pg[k]);});}'
      + 't();setInterval(t,250);})();';
    return '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>' + esc(titre) + '</title>' + STYLE_PDF + '</head><body><div id="activite">' + out + '</div><script>' + js + '<\/script></body></html>';
  }
  ov.addEventListener("click", async e => {
    const t = e.target.closest(".act-tuile"); if (t){ const a = ACTIVITES.find(x => x.f === t.dataset.fiche); if (a) fiche(a); return; }
    const g = e.target.closest(".act-tout"); if (g){ const k = g.dataset.g; OUVERTS.has(k) ? OUVERTS.delete(k) : OUVERTS.add(k); dessiner(); return; }
  });
  $("modal").addEventListener("click", async e => {
    const b = e.target.closest("[data-a]"); if (!b) return;
    const a = ACTIVITES.find(x => x.f === b.dataset.f); if (!a) return;
    if (b.dataset.a === "corrige"){ window.open("activites/" + a.corrige + ".pdf", "_blank"); return; }
    if (a.perso && (b.dataset.a === "imprimer" || b.dataset.a === "pdf")){ MESDOCS.ouvrirFichier(a.id, b.dataset.a === "pdf"); return; }
    if (a.perso && b.dataset.a !== "ouvrir") return;
    if (b.dataset.a === "imprimer"){ window.open("activites/" + a.f + ".pdf", "_blank"); return; }
    /* Projeter : l'activité s'ouvre dans le lecteur de livres (même barre d'outils que les livres de compétence) */
    let blob; try { blob = await pdfDe(a); } catch (er) { if (a.perso){ aviser("Ce fichier n'est pas disponible sur cet ordinateur."); return; } window.open("activites/" + a.f + ".pdf", "_blank"); return; }
    closeModal();
    const l = { titre:a.titre, fichier:"activite-" + a.f, categorie:a.prog, couverture:a.img || "activites/" + a.f + ".jpg" };
    chargement(l, true);
    try {
      const html = await livreDePdf(blob, a.titre);
      chargement(l); ov.hidden = true; window.RETOUR_ACTIVITES_LIVRE = true; ouvrirLivre(l, html);
    } catch (er) {
      chargement(null);
      if (a.perso) MESDOCS.ouvrirFichier(a.id); else window.open("activites/" + a.f + ".pdf", "_blank");   /* si les pages ne se préparent pas : le PDF dans un onglet */
    }
  });
  ov.addEventListener("input", e => { if (e.target.id === "actQ"){ F.q = e.target.value; dessiner(); } });
  ov.addEventListener("change", e => { if (e.target.id === "actProg"){ F.p = e.target.value; dessiner(); } });
  $("actBack").onclick = () => { ov.hidden = true; };
  document.addEventListener("keydown", e => { if (!ov.hidden && e.key === "Escape" && !$("modal").classList.contains("open")) ov.hidden = true; }, true);   /* en capture : la fiche ouverte se ferme seule, la liste reste */
  $("actBtn").addEventListener("click", () => { dessiner(); ov.hidden = false; ov.scrollTop = 0; });
  window.__activites = ACTIVITES; window.livreDePdf = livreDePdf; window.__dessinerAct = () => { try { dessiner(); } catch(e){} };
})();
