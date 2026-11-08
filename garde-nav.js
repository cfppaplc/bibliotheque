/* © 2026 Jérémy Raymond. Tous droits réservés. */
/* Barre de navigation commune (8 nov., « la barre de navigation présente dans toutes les pages ») : passer d'un outil à l'autre sans revenir à l'accueil.
   Ailleurs que dans la bibliothèque, les liens ouvrent index.html?ouvrir=… (la bibliothèque ouvre l'outil dès que la session est prête). */
window.MP_NAV = [
  ["biblio", "Bibliothèque", '<path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>'],
  ["plans", "Plans", '<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>'],
  ["activites", "Formatifs", '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h4"/>'],
  ["labo", "Labo", '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/>'],
  ["accueil", "Accueil de classe", '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'],
  ["tableau", "Tableau blanc", '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>']];
window.mpNavHTML = ici => '<nav class="mp-nav" aria-label="Outils">' + MP_NAV.map(([k, t, d]) => `<a href="${k === "labo" ? "labo.html" : k === "biblio" ? "./" : "./?ouvrir=" + k}" data-nav="${k}"${k === ici ? ' class="ici" aria-current="page"' : ""}><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>${t}</a>`).join("") + "</nav>";

