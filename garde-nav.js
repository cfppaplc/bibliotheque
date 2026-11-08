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


/* Pied de page commun (8 nov., piste A choisie par Jeremy) : logo + phrase, colonnes Outils et Aide, bande ©, « Né au Pavillon de l'Avenir ».
   Dans la bibliothèque, les liens ouvrent l'outil sans recharger (index.html les intercepte); ailleurs : index.html?ouvrir=… */
window.mpPiedHTML = () => {
  const outils = MP_NAV.map(([k, t]) => `<li><a href="${k === "labo" ? "labo.html" : k === "biblio" ? "./" : "./?ouvrir=" + k}" data-pied="${k}">${t}</a></li>`).join("");
  return '<div class="mp-pied-haut"><div class="mp-pied-marque"><img class="lg-b" src="img/metier-plus-blanc.svg" alt="Métier+"><img class="lg-c" src="img/metier-plus.svg" alt="Métier+">'
    + '<p>La plateforme pédagogique des enseignants en formation professionnelle. Livres animés, plans, formatifs, quiz et simulations.</p></div>'
    + '<div><h4>Outils</h4><ul>' + outils + '</ul></div>'
    + '<div><h4>Aide</h4><ul><li><a href="./?ouvrir=neuf" data-pied="neuf">Quoi de neuf</a></li><li><a href="./?ouvrir=aide" data-pied="aide">Aide</a></li><li><a href="presentation.html">Présentation de Métier+</a></li><li class="mp-pied-acces"><a href="./?ouvrir=compte" data-pied="compte">Demander un accès</a></li></ul></div></div>'
    + '<div class="mp-pied-bas"><span>© 2026 Jérémy Raymond · Tous droits réservés · Réservé aux enseignants du Pavillon de l\'Avenir</span><span class="mp-pied-pav">Né au Pavillon de l\'Avenir <img src="img/pavillon-avenir.png" alt="Pavillon de l\'Avenir"></span></div>';
};
(function(){
  if (!document.getElementById("mpPiedCss")){ const st = document.createElement("style"); st.id = "mpPiedCss"; st.textContent =
    '.mp-pied{text-align:left!important;padding:0!important;margin-top:40px;border-top:1px solid rgba(128,128,128,.22);background:rgba(128,128,128,.06);font-size:14px;line-height:1.5;color:inherit;opacity:1!important}'
    + '.mp-pied-haut{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:40px;padding:40px 4vw 30px}'
    + '.mp-pied-marque img{height:30px;width:auto;display:block}.mp-pied .lg-c{display:none}body.clair .mp-pied .lg-b,html.clair .mp-pied .lg-b{display:none}body.clair .mp-pied .lg-c,html.clair .mp-pied .lg-c{display:block}'
    + '.mp-pied-marque p{margin:12px 0 0;max-width:340px;opacity:.68}'
    + '.mp-pied h4{margin:0 0 12px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.6}'
    + '.mp-pied ul{list-style:none;margin:0;padding:0;display:grid;gap:9px}.mp-pied ul a{color:inherit;text-decoration:none;opacity:.85}.mp-pied ul a:hover{opacity:1;color:#EB6A22}'
    + '.mp-pied-bas{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:16px 4vw 22px;border-top:1px solid rgba(128,128,128,.22);font-size:12.5px;opacity:.75}'
    + '.mp-pied-pav{display:flex;align-items:center;gap:10px}.mp-pied-pav img{height:24px;width:auto;background:#fff;border-radius:5px;padding:2px 6px}'
    + 'body.connecte .mp-pied-acces{display:none}'
    + '@media (max-width:760px){.mp-pied-haut{grid-template-columns:1fr 1fr;gap:28px 20px;padding:30px 18px 22px}.mp-pied-marque{grid-column:1/-1}.mp-pied-bas{padding:14px 18px 22px;flex-direction:column;align-items:flex-start}}';
    document.head.append(st); }
  const poser = () => document.querySelectorAll(".droits").forEach(d => { if (d.dataset.pied) return; d.dataset.pied = "1"; d.removeAttribute("style"); d.classList.add("mp-pied"); d.innerHTML = mpPiedHTML(); });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", poser); else poser();
})();
