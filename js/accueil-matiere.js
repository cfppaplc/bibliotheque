/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — accueil-matiere.js (sorti de la page le 15 nov.) */
/* Matière en cours + petit rappel (4 nov., « un petit rappel à la matière en cours »).
   - la pastille « En cours » montre la compétence de la période (nom court);
   - toutes les ~9 minutes pendant le cours, une petite carte « Rappel » apparaît 15 s avec une idée en lien avec la matière.
   RAPPELS : à corriger / compléter librement (2 idées par compétence); RAPPELS_GEN sert quand la matière n'a pas d'entrée. */
const RAPPELS = {"254-991": ["Chaque métier du chantier a son rôle : sache qui fait quoi avant d'intervenir.", "Lis les consignes du chantier avant de commencer."], "254-992": ["Avant d'agir, regarde autour de toi et repère les dangers.", "Un ÉPI mal porté ne protège pas : ajuste-le avant de travailler."], "307-402": ["Dis les choses clairement : une consigne mal comprise coûte du temps.", "Écoute d'abord, reformule ensuite pour valider."], "307-414": ["Plie les genoux, garde le dos droit, rapproche la charge de ton corps.", "Une charge lourde ? Demande de l'aide ou prends le chariot."], "307-428": ["Mesure deux fois, coupe une fois.", "Ébarbe et nettoie chaque coupe avant de raccorder."], "307-435": ["Coupe le courant et vérifie l'absence de tension avant de toucher.", "Cadenasse et étiquette avant d'intervenir."], "307-443": ["Lis la légende et l'échelle avant de lire un plan.", "Vérifie la révision du plan que tu utilises."], "307-458": ["Sans pente, pas d'écoulement : vérifie toujours la pente.", "Un siphon garde son sceau d'eau : c'est lui qui bloque les odeurs."], "307-468": ["Sans ventilation, l'évacuation siphonne : l'évent doit rester dégagé.", "Vérifie que chaque évent est bien raccordé."], "307-478": ["Lis le schéma avant de toucher aux fils.", "Teste avec le multimètre : ne présume pas, vérifie."], "307-485": ["Nettoie le métal avant de braser ou de souder.", "Protège tes yeux et ton visage, et garde un extincteur à portée de main."], "307-498": ["Ferme l'entrée d'eau avant d'ouvrir un raccord.", "Fais un essai sous pression : cherche les fuites avant de fermer le mur."], "307-505": ["Trouve la cause de la fuite avant de remplacer une pièce.", "Laisse les lieux propres : le client le remarque."], "307-513": ["L'énergie ne disparaît pas : elle se transforme.", "Convertis tes unités avant de calculer."], "307-528": ["Ne travaille jamais sur un brûleur sans couper l'alimentation.", "Un mazout propre fait durer le brûleur : vérifie le filtre."], "307-538": ["Purge l'air du circuit : l'air empêche l'eau de circuler.", "Vérifie la pression du système avant de conclure à une panne."], "307-544": ["Un système bien équilibré chauffe toutes les pièces de façon égale.", "Purge chaque circuit avant de régler le débit."], "307-558": ["Gaz : pas de flamme, pas d'étincelle; ventile et coupe l'alimentation.", "Vérifie un raccord avec la solution savonneuse, jamais avec une flamme."], "307-565": ["Fais l'essai de pression avant de couvrir : on ne bétonne pas une fuite.", "Respecte l'espacement des boucles prévu au plan."], "307-578": ["La vapeur brûle : isole, dépressurise et laisse refroidir avant d'ouvrir.", "Surveille le niveau d'eau : jamais de chaudière à sec."], "307-581": ["Un bon CV tient sur une page et dit ce que tu sais faire.", "Prépare ta présentation de 30 secondes."], "436-201": ["Un employeur attend de toi de la ponctualité et de l'initiative.", "Connais ton métier : à quoi ressemble une journée type ?"], "436-212": ["Repère les issues de secours et la trousse de premiers soins.", "Produit inconnu ? Lis l'étiquette et la fiche SIMDUT avant de l'utiliser."], "436-222": ["Un outil à sa place, c'est du temps gagné.", "Inspecte tes outils avant de t'en servir : un outil abîmé est dangereux."], "436-238": ["Lis l'étiquette du produit et ne mélange jamais deux produits.", "Mets un panneau « plancher mouillé » quand tu laves."], "436-244": ["Pour un petit travail, fais la liste du matériel avant de partir.", "Laisse l'endroit plus propre qu'à ton arrivée."], "436-255": ["Marque, vérifie, puis coupe : un trait de crayon se corrige, pas une coupe.", "Serre bien la pièce avant de scier ou de percer."], "436-266": ["Observe, écoute, puis touche : le diagnostic commence par les sens.", "Change une chose à la fois pour savoir ce qui règle le problème."], "436-274": ["Coupe le courant et vérifie l'absence de tension avant de toucher.", "Respecte la capacité du fil et du circuit."], "436-282": ["Un bon rapport répond à : qui, quoi, quand, où.", "Écris pour être compris, pas pour faire long."], "436-295": ["Ferme l'entrée d'eau avant d'ouvrir un raccord.", "Un appareil installé de niveau fonctionne mieux et dure plus longtemps."], "436-304": ["Un filtre propre améliore la circulation d'air et réduit la consommation.", "Coupe l'alimentation avant d'ouvrir un appareil."], "436-312": ["Sache où sont les extincteurs et les sorties avant qu'il y ait urgence.", "Extincteur : tire la goupille, vise la base, presse, balaie."], "436-323": ["Lis la légende et l'échelle avant de lire un plan.", "Fie-toi aux cotes écrites plutôt qu'à ce que tu mesures au crayon."], "436-333": ["Sauvegarde ton travail souvent.", "Un mot de passe solide est long, et tu ne le partages pas."], "436-343": ["Un plan d'urgence ne sert que si tout le monde le connaît.", "Connais ton point de rassemblement."], "436-352": ["Un bon CV tient sur une page et dit ce que tu sais faire.", "Prépare ta présentation de 30 secondes."], "436-364": ["En stage, on remarque ceux qui arrivent à l'heure, prêts, et qui posent des questions.", "Demande une rétroaction : ça te fait grandir plus vite."]};
const RAPPELS_GEN = ["Un ÉPI mal porté ne protège pas : ajuste-le avant de travailler.", "Prends ton temps : une tâche bien faite vaut mieux que deux refaites.", "Range ta place avant de partir : le prochain en dépend.", "Une question maintenant évite une erreur plus tard."];
function majMatiere() {
  const el = $("v-matiere"); if (!el) return;
  const nom = titreComp(cfg.comp) || "", code = cfg.comp || "";
  if (!nom && !cfg.module) { el.hidden = true; return; }
  $("v-mcode").textContent = code; $("v-mnom").textContent = nom || cfg.module; el.hidden = false;
  el.title = moduleOfficiel(cfg.comp, cfg.module) || "";
}
let rpPos = {}, rpOn = false, rpFin = 0;
function periodeEnCours() {
  const d = new Date(), m = d.getHours() * 60 + d.getMinutes(), cur = periods().find(p => m >= p.start && m < p.end);
  if (!cur) return false;
  const r = timeline(cur.start, cfg.steps).find(x => m >= x.start && m < x.end);
  return !(r && r.pause);
}
function cacherRappel() {
  const el = $("v-rappel"); if (!el || !rpOn) return; rpOn = false; clearTimeout(rpFin);
  el.classList.remove("on"); setTimeout(() => { if (!rpOn) el.hidden = true; }, 700);
}
function montrerRappel(force) {
  const el = $("v-rappel"); if (!el || rpOn || document.hidden || document.body.classList.contains("editing")) return;
  if (!force && !periodeEnCours()) return;
  const liste = RAPPELS[cfg.comp] || RAPPELS_GEN, k = cfg.comp || "gen";
  if (rpPos[k] == null) rpPos[k] = Math.floor(Math.random() * liste.length);
  rpPos[k] = (rpPos[k] + 1) % liste.length;
  $("v-rptxt").textContent = liste[rpPos[k]];
  el.hidden = false;
  if (typeof overflows === "function" && overflows()) { el.hidden = true; return; }   /* pas de place : on n'abîme pas la mise en page */
  rpOn = true; requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("on")));
  rpFin = setTimeout(cacherRappel, 15000);
}
$("v-rappel").addEventListener("click", cacherRappel);
setTimeout(() => montrerRappel(false), 40000);
setInterval(() => montrerRappel(false), 9 * 60 * 1000);
majMatiere();
