/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — aide.js (sorti d'index.html le 15 nov.) */
(function(){
  /* 8 nov. : outils regroupés, avec l'icône du vrai bouton de la barre (#tb), au lieu de l'image numérotée */
  const GR = [
    ["Se déplacer", [["tbNext","Pages","Flèches ou numéro de page.","← →"],["tbMenu","Sommaire","La table des matières : va à un module, cherche un mot.","M"]]],
    ["Présenter", [["tbZi","Zoom","Pince ou tourne la roulette. « 100 % » revient à la page entière.",""],["tbDbl","Double page","Deux pages côte à côte.","D"],["tbFs","Plein écran","Seulement le livre à l'écran.","F"],["tbAnim","Animations","Pause ou relance.","A"]]],
    ["Écrire et corriger", [["tbPen","Crayon","Écris sur la page. « Terminé » ramène les outils du livre.","P"],["tbWb","Tableau blanc","Page vierge, quadrillée ou isométrique.","B"],["tbAns","Réponses","Une à la fois, pour corriger avec le groupe.","R"]]]
  ];
  const ico = id => { const b = document.getElementById(id), v = b && b.querySelector("svg"); return v ? v.outerHTML : ""; };
  document.getElementById("bvLeg").innerHTML = GR.map(([g, L]) => `<section><h4>${g}</h4><ul>${L.map(([id, t, d, k]) => `<li><span class="bv-i">${ico(id)}</span><div><b>${t}</b>${k ? ` <kbd>${k}</kbd>` : ""}<p>${d}</p></div></li>`).join("")}</ul></section>`).join("");
  /* 8 nov. : Aide en onglets (un par outil) + recherche + questions fréquentes. q = question, r = réponse (HTML), qn = sujet de « Quoi de neuf » (mini-formation) */
  const AIDE = [
    { k:"livres", t:"Livres", qn:"Lecture des livres", items:[
      ["Ouvrir un livre et le projeter", "Touche une couverture, puis « Lire ». Le livre s'ouvre en plein écran. Les flèches ← → tournent les pages; tu peux aussi taper un numéro de page."],
      ["Montrer les réponses une à la fois", "Touche « Réponses » (touche R). Chaque appui sur → montre la réponse suivante de la page, pour corriger avec le groupe."],
      ["Aller à un module ou chercher un mot", "« Sommaire » (touche M) ouvre la table des matières à droite : modules, recherche dans tout le livre, liste des animations et des exercices."],
      ["Écrire ou dessiner sur une page", "Touche « Crayon » (P) : ses outils prennent la place de ceux du livre (couleurs, texte, objets, gomme, annuler) et les flèches de page restent. Tes traits restent sur la page, même après avoir fermé le livre. « Terminé » ramène les outils du livre."],
      ["Agrandir pour le fond de la classe", "Pince avec deux doigts ou tourne la roulette de la souris. Glisse pour te déplacer; « 100 % » revient à la page entière. Les boutons + et − sont dans « Plus »."],
      ["Reprendre où j'étais", "En rouvrant un livre, la pastille « Reprendre à la page N ? » te ramène à ta dernière page. Tu peux régler ça dans Mes préférences."]]},
    { k:"tele", t:"Télécommande", qn:"Télécommande", items:[
      ["Contrôler le livre avec mon cellulaire", "Dans un livre, touche « Télécommande » dans la barre, puis scanne le code QR avec ton cellulaire. Tu tournes les pages, montres les réponses et pointes avec le laser sans retourner à l'ordinateur."],
      ["Le cellulaire ne répond plus", "Garde la page de la télécommande ouverte à l'écran du cellulaire. Si la bibliothèque a été rechargée, scanne de nouveau le code QR : il change à chaque chargement."]]},
    { k:"tableau", t:"Tableau blanc", qn:"Tableau blanc : les outils", items:[
      ["Ouvrir un tableau blanc", "Touche « Tableau blanc » dans la barre du haut, ou la touche B dans un livre. Le bouton « Fond » change le fond (blanc, quadrillé, isométrique…) et ton dessin suit. Les tableaux ‹ 1 / 2 › + sont sur la barre."],
      ["Changer la couleur ou la grosseur du crayon", "Touche « Crayon » : une bulle s'ouvre avec les couleurs, les surligneurs et trois grosseurs. La pastille sur le bouton montre la couleur en cours."],
      ["Mesurer, tracer droit et calculer", "« Règle » : une règle en cm (1 cm = 1 carreau) à déplacer et à tourner; avec le crayon, glisse le long de son bord pour un trait droit. « Angles » ajoute un rapporteur. « Calcul » ouvre une calculatrice; « Sci » ajoute sin, cos, tan (en degrés)."],
      ["Ajouter une forme, une cote ou un texte", "Ouvre la palette avec le bouton « Objets ». Choisis une forme et glisse sur le tableau. Double-touche une forme pour la nommer, changer sa couleur ou ajouter une cote.", "Tableau blanc : formes, cotes et textes"],
      ["Dessiner un plan isométrique", "Onglet « Iso » de la palette : dessine les tuyaux au crayon, puis glisse les raccords et appareils dessus. Ils se branchent tout seuls.", "Tableau blanc : plan isométrique"],
      ["Faire un schéma électrique en échelle", "Onglet « Électricité » : pose les symboles, trace les fils, puis touche le bouton vert « Animer » de la barre pour voir le courant passer.", "Tableau blanc : schéma électrique en échelle"],
      ["Choisir et déplacer plusieurs éléments", "Sans outil, glisse dans le vide pour encadrer plusieurs éléments, ou Ctrl + clic. Suppr efface, Ctrl+C / Ctrl+V copie."],
      ["Garder un schéma pour une autre fois", "Dans « Mes modèles », touche « Enregistrer ce tableau ». Il te suit sur tous tes ordinateurs."]]},
    { k:"plans", t:"Plans", qn:"Plans techniques", items:[
      ["Projeter un dossier de plans", "Ouvre Plans, choisis un dossier, puis navigue d'une feuille à l'autre avec la barre du bas. Le crayon fonctionne comme dans les livres."],
      ["Imprimer pour mesurer à l'échelle", "Imprime à 100 % (taille réelle) sur du papier 11 × 17. Le trait de contrôle de 100 mm au bas de chaque feuille te permet de vérifier."],
      ["Trouver les exercices des élèves", "Les questionnaires de lecture de plans, avec leur corrigé, sont dans Formatifs."]]},
    { k:"formatifs", t:"Formatifs", qn:"Formatifs", items:[
      ["Projeter, imprimer ou télécharger un formatif", "Ouvre Formatifs et touche une tuile : la fiche offre Projeter, Imprimer, PDF et, s'il y en a un, le Corrigé."],
      ["Ajouter mes propres documents", "Glisse un PDF n'importe où dans la bibliothèque, ou utilise « Ajouter un document » dans le menu de ton compte. Choisis ensuite Livre, Formatif ou Plan. L'administrateur doit d'abord t'en donner la permission.", "Ajoute tes propres livres, formatifs et plans"],
      ["Partager un document avec tous les enseignants", "Dans la fiche de ton document, touche « Proposer à tous ». L'administrateur le vérifie avant de le publier."]]},
    { k:"labo", t:"Labo", qn:"Labo interactif", items:[
      ["Lancer un quiz avec les iPad", "Ouvre Labo, puis Quiz. Choisis un quiz et « Animer au tableau ». Les élèves scannent le code QR et choisissent un personnage; aucun compte élève n'est nécessaire."],
      ["Créer mon propre quiz", "Dans Quiz, touche « Nouveau quiz ». Tu peux aussi coller des questions toutes prêtes. Sauvegarde-les de temps en temps avec « Sauvegarder tous mes quiz »."],
      ["Utiliser le simulateur de panneau d'alarme", "Ouvre Labo, puis Simulateurs. Chaque équipe a un panneau sur son iPad; tu déclenches les événements depuis la télécommande."]]},
    { k:"accueil", t:"Accueil de classe", qn:"Accueil de classe", items:[
      ["Projeter l'horaire de la période", "Ouvre « Accueil de classe » : l'horloge, la ligne du temps et l'activité en cours s'affichent pour la classe."],
      ["Préparer un cours d'avance", "Touche « Préparer le cours », choisis le jour et la période dans la semaine, la compétence, puis les activités et leurs durées."],
      ["Lier un livre, un quiz ou un fichier à une activité", "Dans le déroulement, touche « + Livre, quiz, fichier… » sous l'activité. Pendant le cours, un toucher sur l'activité l'ouvre."]]},
    { k:"compte", t:"Mon compte", items:[
      ["Quelque chose ne marche pas", "Ouvre le menu de ton compte (tes initiales en haut à droite) et touche « Signaler un problème ». Écris une phrase : l'administrateur la reçoit tout de suite, avec le livre et la page où tu étais."],
      ["Me connecter", "Touche « Se connecter » et entre ton identifiant (prenom.nom) et ton mot de passe. Sur ton ordinateur, l'identifiant est retenu."],
      ["Demander un accès", "Dans la fenêtre de connexion, touche « Demander un accès ». Choisis ton programme et un mot de passe; l'administrateur reçoit ta demande."],
      ["J'ai oublié mon mot de passe", "Dans la fenêtre de connexion, touche « Mot de passe oublié ? » et choisis-en un nouveau. L'administrateur l'active pour toi."],
      ["Mes données sont-elles sur tous mes ordinateurs?", "Oui : tes traits, tableaux, quiz, préférences et cours préparés te suivent quand tu te connectes ailleurs. Ils sont chiffrés avec ton mot de passe.", "Tes données te suivent sur tous les ordinateurs"],
      ["Changer la couleur ou le thème", "Menu de ton compte → Mes préférences : couleur, thème clair ou foncé, plein écran, reprise de lecture, animations."],
      ["C'est lent sur le tableau interactif", "Dans Mes préférences, mets « Animations » à « Légères ». Le site le fait souvent tout seul quand l'appareil est lent."]]}
  ];
  const OUTIL = { plans:"plans", formatifs:"activites", labo:"labo", accueil:"accueil", tableau:"tableau" };
  const ong = document.getElementById("ahOnglets"), qIn = document.getElementById("ahQ"), res = document.getElementById("ahRes"), autres = document.getElementById("ahAutres"), livres = document.getElementById("ahLivres");
  const sansAcc = t => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const carte = (it, g) => `<details class="ah-q"><summary>${it[0]}${g ? `<span class="ah-tag">${g.t}</span>` : ""}</summary><p>${it[1]}</p>${(it[2] || g && g.qn) ? `<button type="button" class="ah-mf" data-qn="${(it[2] || g.qn).replace(/"/g, "&quot;")}">Voir la mini-formation</button>` : ""}</details>`;
  const pied = g => `<div class="ah-liens">${OUTIL[g.k] ? `<button type="button" class="ah-go" data-out="${OUTIL[g.k]}">Ouvrir ${g.t} ›</button>` : ""}${g.qn ? `<button type="button" class="ah-mf" data-qn="${g.qn}">Mini-formation : ${g.t}</button>` : ""}</div>`;
  let onglet = "livres";
  function montrer(k, garder){ onglet = k; if (!garder) qIn.value = ""; res.hidden = true;
    ong.querySelectorAll("button").forEach(b => b.classList.toggle("on", b.dataset.k === k));
    livres.hidden = k !== "livres"; const g = AIDE.find(x => x.k === k);
    if (k === "livres"){ autres.hidden = true; document.getElementById("ahLivresPlus").innerHTML = `<h3 class="ah-h">Questions fréquentes</h3>` + g.items.map(it => carte(it)).join("") + pied(g); return; }
    autres.hidden = false; autres.innerHTML = `<h3 class="ah-h">${g.t}</h3>` + g.items.map(it => carte(it)).join("") + pied(g); }
  ong.innerHTML = AIDE.map(g => `<button type="button" role="tab" data-k="${g.k}">${g.t}</button>`).join("");
  ong.onclick = e => { const b = e.target.closest("button[data-k]"); if (b) montrer(b.dataset.k); };
  qIn.oninput = () => { const q = sansAcc(qIn.value.trim()); if (q.length < 2){ montrer(onglet, true); return; }
    const VIDES = ["de","du","des","la","le","les","un","une","mon","ma","mes","ton","ta","tes","et","ou","a","au","aux","en","comment","faire","je","on","pour","sur","dans","est"];
    let mots = q.split(/[\s'’?!.,]+/).filter(m => m.length > 1 && !VIDES.includes(m)); if (!mots.length) mots = [q];
    const tr = [];
    AIDE.forEach(g => g.items.forEach(it => { const ti = sansAcc(it[0]), t = sansAcc(it[0] + " " + it[1] + " " + g.t); const n = mots.filter(m => t.includes(m)).length;
      if (n === mots.length || (mots.length > 2 && n >= mots.length - 1)) tr.push([n + mots.filter(m => ti.includes(m)).length * 2, it, g]); }));
    tr.sort((a, b) => b[0] - a[0]);
    livres.hidden = true; autres.hidden = true; res.hidden = false; ong.querySelectorAll("button").forEach(b => b.classList.remove("on"));
    res.innerHTML = tr.length ? `<h3 class="ah-h">${tr.length} résultat${tr.length > 1 ? "s" : ""}</h3>` + tr.slice(0, 12).map(([, it, g]) => carte(it, g)).join("").replace("<details", "<details open") : `<p class="ah-vide">Rien trouvé. Essaie un autre mot, ou regarde dans <button type="button" class="bv-lien" data-qn="">Quoi de neuf</button>.</p>`; };
  document.getElementById("bvOv").addEventListener("click", e => {
    const m = e.target.closest("[data-qn]"); if (m){ document.getElementById("bvOv").hidden = true; if (m.dataset.qn && window.ouvrirQn) window.ouvrirQn(m.dataset.qn); else document.getElementById("quoiNeuf").click(); return; }
    const o = e.target.closest("[data-out]"); if (o){ document.getElementById("bvOv").hidden = true; if (window.mpAller) window.mpAller(o.dataset.out); } });
  document.getElementById("ahX").onclick = () => { document.getElementById("bvOv").hidden = true; };
  window.aideOnglet = montrer;
  montrer("livres");

  const ov = document.getElementById("bvOv");
  const fermer = () => { ov.hidden = true; };
  window.ouvrirBienvenue = k => { ov.hidden = false; ov.scrollTop = 0; try { window.aideOnglet(typeof k === "string" ? k : "livres"); } catch(e){} };
  document.getElementById("bvOk").onclick = fermer;
  document.getElementById("bvQn").onclick = () => { fermer(); document.getElementById("quoiNeuf").click(); };
  ov.addEventListener("click", e => { if (e.target === ov) fermer(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !ov.hidden) fermer(); });
  document.getElementById("lienAide").addEventListener("click", e => { e.preventDefault(); ouvrirBienvenue(); });
  /* première visite : une page de bienvenue toute simple */
  const bi = document.getElementById("bienOv"), finBi = () => { bi.hidden = true; try { localStorage.setItem("bienvenueVu", "1"); } catch(e){} };
  document.getElementById("bienOk").onclick = finBi;
  document.getElementById("bienCo").onclick = () => { finBi(); try { if (window.ACCES && ACCES.session) return; ACCES.dlgConnexion(); } catch(e){} };
  try { if (window.ACCES && ACCES.pret) ACCES.pret.then(() => { if (ACCES.session){ const b = document.getElementById("bienCo"); b.textContent = "C'est parti"; } }); } catch(e){}
  document.getElementById("bienAide").onclick = () => { finBi(); ouvrirBienvenue(); };
  bi.addEventListener("click", e => { if (e.target === bi) finBi(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !bi.hidden) finBi(); });
  let vu = ""; try { vu = localStorage.getItem("bienvenueVu") || localStorage.getItem("presentationVue") || ""; } catch(e){}   /* 9 nov. : pas de fenêtre de bienvenue après la présentation (ça faisait deux explications de suite) */
  if (!vu && !/[?&]livre=/.test(location.search)) setTimeout(() => { if (!document.querySelector(".reader.open")) bi.hidden = false; }, 700);
})();
