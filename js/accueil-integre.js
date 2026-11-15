/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — accueil-integre.js (sorti d'index.html le 15 nov.) */
(() => {
  // Tableau d'accueil de l'atelier, intégré dans ce fichier (aucun fichier externe nécessaire)
  const ov = document.getElementById("accueilOv"), fr = document.getElementById("accueilFrame");
  let loaded = false;
  function ouvrir() {
    if (!loaded) {
      fr.src = "accueil.html";   /* le tableau d'accueil est un fichier du site (une seule version à entretenir) */
      fr.addEventListener("load", () => { try { fr.contentWindow.postMessage({ type: "accueil-biblio" }, "*"); } catch (e) {} signalerLivre(); });
      loaded = true;
    }
    ov.classList.remove("attente"); ov.hidden = false;
    signalerLivre();
    setTimeout(() => { try { fr.focus(); } catch (e) {} }, 50);
  }
  /* livre resté ouvert sous le tableau de bord → bouton « Revenir au livre » */
  const livreOuvert = () => $("#reader").classList.contains("open");
  function signalerLivre(){
    let livre = null;
    if (livreOuvert()){ const st = (() => { try { return RD.drv ? RD.drv.state() : null; } catch(e){ return null; } })();
      livre = { titre: RD.wb ? "Tableau blanc" : $("#readerTitle").textContent, page: st && st.label ? String(st.label) : "", wb: !!RD.wb || RD.book === "tableau-blanc" }; }
    try { fr.contentWindow.postMessage({ type: "accueil-livre", livre }, "*"); } catch (e) {}
  }
  /* on garde le plein écran tant qu'on reste en classe (tableau de bord ↔ livre) */
  function fermer(versLivre) {
    if (!versLivre && document.fullscreenElement && window.FS_PAR === "accueil" && !document.body.classList.contains("classe")) document.exitFullscreen().catch(() => {});
    ov.hidden = true;
    if (versLivre) setTimeout(() => { try { $("#readerFrame").focus(); } catch (e) {} }, 60);
  }
  /* ouvrir un contenu : le tableau de bord reste affiché jusqu'à ce que le livre soit prêt, puis fondu */
  function ouvrirDepuisTdb(c){
    const memeLivre = (c.type === "livre" && livreOuvert() && RD.book === c.f && RD.drv) || (c.type === "tableau" && !c.fond && livreOuvert() && RD.book === "tableau-blanc" && RD.drv);
    if (memeLivre){ marquerTdb(true); if (c.page > 1){ try { RD.drv.goto(c.page); } catch(e){} } fermer(true); return; }
    if (livreOuvert() && c.type !== "plan") fermerLivreVraiment();
    if (c.type === "plan"){ ouvrirContenu(c); setTimeout(() => fermer(true), 450); return; }
    ov.classList.add("attente");
    ouvrirContenu(c);
    const t0 = Date.now();
    const t = setInterval(() => { let pret = false; try { pret = !!(RD.drv && RD.drv.state().tot > 0); } catch(e){}
      if ((pret && Date.now() - t0 > 250) || Date.now() - t0 > 12000 || !livreOuvert() && Date.now() - t0 > 3000){ clearInterval(t);
        setTimeout(() => { ov.classList.remove("attente"); fermer(true); }, pret ? 200 : 0); } }, 100);
  }
  // Le bouton « Plein écran » du tableau demande à la bibliothèque de passer l'accueil en plein écran
  const peEl = () => document.fullscreenElement || document.webkitFullscreenElement;
  const peSignal = ok => { try { fr.contentWindow.postMessage({ type: "accueil-plein-ecran-etat", on: !!peEl(), ok }, "*"); } catch (e) {} };
  window.ouvrirAccueil = ouvrir;
  window.revenirDuTdb = () => { if (livreOuvert()) fermer(true); };   /* télécommande : « Revenir au livre » */
  const catalogue = () => ({ type:"accueil-catalogue",
    livres:LIVRES.filter(l => l.fichier).map(l => ({ f:l.fichier, titre:l.titre, niveau:l.niveau || "", pages:l.pages || 0 })),
    modeles:MODELES.map(m => ({ id:m.id, nom:m.nom })), schemas:lireSch().map(x => ({ id:String(x.id), nom:x.nom })),
    dossiers:[[1, "Maison unifamiliale"], [2, "Duplex jumelé"], [3, "Bâtiment commercial"], [4, "Centre commercial"], [5, "Ferme laitière"]] });
  window.addEventListener("message", e => {
    if (e.source === fr.contentWindow && e.data && e.data.type === "accueil-fermer") { marquerTdb(false); if (livreOuvert()) closeReader(); fermer(); return; }
    if (e.source === fr.contentWindow && e.data && e.data.type === "accueil-revenir") { if (livreOuvert()) fermer(true); return; }
    if (e.source === fr.contentWindow && e.data && e.data.type === "accueil-catalogue?") { try { fr.contentWindow.postMessage(catalogue(), "*"); } catch(er){} return; }
    if (e.source === fr.contentWindow && e.data && e.data.type === "accueil-ouvrir") { ouvrirDepuisTdb(e.data.contenu || {}); return; }
    if (e.source !== fr.contentWindow || !e.data || e.data.type !== "accueil-plein-ecran") return;
    if (peEl()) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
    const pe = document.documentElement, req = pe.requestFullscreen || pe.webkitRequestFullscreen;
    if (!req || !(document.fullscreenEnabled || document.webkitFullscreenEnabled)) { peSignal(false); return; }
    window.FS_PAR = "accueil"; try { const p = req.call(pe); if (p && p.catch) p.catch(() => peSignal(false)); } catch (err) { peSignal(false); }
  });
  document.addEventListener("fullscreenchange", () => peSignal(true)); document.addEventListener("webkitfullscreenchange", () => peSignal(true));
  document.getElementById("accueilBtn").addEventListener("click", ouvrir);
  document.getElementById("accueilClose").addEventListener("click", () => fermer());
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !ov.hidden) fermer(livreOuvert()); });
})();
