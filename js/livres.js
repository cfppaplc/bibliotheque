/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — livres.js (sorti d'index.html le 15 nov.) */
/* =====================================================================
   ✏️  MODIFIE TES LIVRES ICI
   ---------------------------------------------------------------------
   Pour ajouter un livre, copie un bloc { ... } et change les valeurs.
   - couverture : adresse d'une image (ex: "images/mon-livre.jpg").
                  Laisse "" pour une couverture colorée automatique.
   - lien       : adresse web ou fichier du livre. Laisse "" s'il n'y en a pas.
   - fichier    : nom du livre intégré dans ce fichier (voir LIVRES_DATA en bas).
   - couleurs   : (facultatif) deux couleurs ["#haut","#bas"] pour la couverture générée.
   - nouveau    : true pour l'afficher dans la rangée « Nouveautés ».
   ===================================================================== */
/* Liste des livres. Ajouter un livre : voir CLAUDE.md (« Ajouter un livre ») — fichier dans livres/, entrée ici, couverture dans window.COUVERTURES, entrée « ajout » dans nouveautes.json. */
const LIVRES = [
  { titre:"Entretien ménager d'un bâtiment", auteur:"Jérémy Raymond", categorie:"Entretien général d'immeubles", niveau:"DEP 5211 · Compétence 4 · 436-238", competence:"4",
    pages:474, annee:2026, nouveau:true, couverture:"", couleurs:["#f2c230","#14191e"], lien:"", fichier:"entretien-menager-egi", version:"8", enConstruction:true,
    description:"Cahier d'apprentissage de 120 heures (436-238) : 15 modules et un formatif. Microbes et désinfection, chimie des produits, produits verts et cycle de l'azote, surfaces et machines, planchers et tapis, hôtel, aréna, vitres et hauteur, hiver, piscines, terrain, urgences et sinistres, gestion. Études de cas, ateliers pratiques, cartes « Urgence du jour » et réponses pas à pas." },
  { titre:"Puits mécaniques, coupe-feu et zone de mousse", auteur:"Jérémy Raymond", categorie:"Plomberie et chauffage", niveau:"Formation en entreprise · SAE Kamouraska–Rivière-du-Loup",
    pages:29, annee:2026, nouveau:true, couverture:"", couleurs:["#d71920","#1a688f"], lien:"", fichier:"puits-coupe-feu-sae", version:"1",
    description:"Cahier du candidat (compagnon plombier, formation SAE) : matériaux et estampilles, le puits mécanique selon le Code de construction du Québec, les traversées coupe-feu (dispositifs cotés F, CAN/ULC-S115), la zone de mousse de détergent, puis une étude de cas et une fiche mémo. Exercices à faire en atelier papier." },
  { titre:"Recherche d'emploi", auteur:"Jérémy Raymond", categorie:"Plomberie et chauffage", niveau:"DEP 5333 · Compétence 21 · 307-581", competence:"21",
    pages:167, annee:2026, nouveau:true, couverture:"", couleurs:["#c4622d","#2b4a66"], lien:"", fichier:"recherche-emploi-plc", version:"3", enConstruction:true,
    description:"Cahier d'apprentissage de 15 heures (compétence 21, 307-581) : 8 modules et une synthèse. Construction ou hors construction : la CCQ, le certificat d'apprenti, la garantie d'emploi de 150 heures et le carnet de 8 000 heures, les emplois dans les hôpitaux, les écoles et les usines. Bilan personnel, CV, recherche en ligne, plan et réseau, lettre, entrevue (STAR, test pratique), relance, puis bilan de la démarche présenté au groupe. Compétence traduite en situation : participation, pas d'examen." },
  { titre:"Moyens de recherche d'emploi", auteur:"Jérémy Raymond", categorie:"Entretien général d'immeubles", niveau:"DEP 5211 · Compétence 8 · 436-352", competence:"8",
    pages:170, annee:2026, nouveau:true, couverture:"", couleurs:["#d63a2f","#24282c"], lien:"", fichier:"recherche-emploi-egi", version:"6", enConstruction:true,
    description:"Cahier d'apprentissage de 30 heures (module 8, 436-352) : 8 modules et une entrevue finale. Bilan personnel, marché de l'entretien d'immeubles et employeurs de la région, CV qui passe les logiciels de tri, chercher et postuler en ligne (sites, plateformes, tests, fausses offres, IA), plan de recherche et réseau, lettre et courriel de candidature, entrevue (méthode STAR, vidéo, test pratique), relance et premiers jours. 43 ateliers, rencontres et simulations; examen final : entrevue avec un employeur de la région." },
  { titre:"Travaux mineurs d'entretien général", auteur:"Jérémy Raymond", categorie:"Entretien général d'immeubles", niveau:"DEP 5211 · Compétence 5",
    pages:275, annee:2026, nouveau:true, couverture:"", couleurs:["#e0702a","#24282c"], lien:"", fichier:"travaux-mineurs-egi", version:"7", competence:"5", enConstruction:true,
    description:"Cahier d'apprentissage de 60 heures (436-244), 50 % en atelier dans les maisons d'essai : sécurité, inspection préventive, cloisons, fissures et trous, céramique, peinture et vernissage, revêtements de plancher, comptoirs et quincaillerie, fixations, portes, vitres et moustiquaires. 38 ateliers avec montage dessiné, une page « Avant l'atelier » pour chacun, pages « Dans le labo » et 12 animations pas à pas." },
  { titre:"Lecture de plans de bâtiments", auteur:"Jérémy Raymond", categorie:"Entretien général d'immeubles", niveau:"DEP 5211 · Compétence 14",
    pages:293, annee:2026, nouveau:true, couverture:"", couleurs:["#f28c28","#16222c"], lien:"", fichier:"lecture-plans-batiments-egi", version:"6", competence:"14",
    description:"Cahier d'apprentissage de 45 heures (436-323) en 9 modules : le jeu de plans, vues et schémas 3D, échelles, cotes et symboles, croquis, architecture et charpente, électricité, plomberie-chauffage-ventilation pour l'entretien, entretien et sécurité. Vues éclatées 3D, 47 animations pas à pas et un formatif final. Tout le livre suit le même bâtiment : le Centre communautaire des Rapides." },
  { titre:"Lecture de plans et devis", auteur:"Jérémy Raymond", categorie:"Plomberie et chauffage", niveau:"DEP 5333 · Compétence 6",
    pages:325, annee:2026, nouveau:true, couverture:"", couleurs:["#2f6aa3","#1d2a36"], lien:"", fichier:"lecture-plans-devis-c6", version:"5", competence:"6",
    description:"Cahier d'apprentissage de 45 heures (307-443) en 8 modules : plans et devis, vues, échelles, cotes et symboles, croquis, plans de plomberie, plans de chauffage, devis et estimation. Comptage des raccords, tuyau sur plusieurs étages, 47 animations pas à pas et un formatif final." },
  { titre:"Réseaux d'évacuation", auteur:"Jérémy Raymond", categorie:"Plomberie et chauffage", niveau:"DEP 5333 · Compétence 7",
    pages:160, annee:2026, nouveau:true, couverture:"", couleurs:["#7D8F2F","#1d2a36"], lien:"", fichier:"reseaux-evacuation-c7", version:"1", competence:"7", enConstruction:true,
    description:"Cahier d'apprentissage de 120 heures (307-458) : réglementation et recherche dans le code, planification et dimensionnement, parcours et désaxés, réseau souterrain, réseau hors terre et essais, bassin de captage et pompes, démontage. Pratique dans les cabines de l'atelier." },
  { titre:"Réseaux de ventilation", auteur:"Jérémy Raymond", categorie:"Plomberie et chauffage", niveau:"DEP 5333 · Compétence 8",
    pages:85, annee:2026, nouveau:true, couverture:"", couleurs:["#00897B","#1d2a36"], lien:"", fichier:"reseaux-ventilation-c8", version:"1", competence:"8", enConstruction:true,
    description:"Cahier d'apprentissage de 120 heures (307-468) : les types de ventilation, fiches Bonnes pratiques, dimensionnement, parcours et sortie au toit, installation et essais du réseau DWV, ventilation d'un bassin. Pratique dans les cabines de l'atelier." },
  { titre:"Eau chaude et eau froide", auteur:"Jérémy Raymond", categorie:"Plomberie et chauffage", niveau:"DEP 5333 · Compétence 11",
    pages:108, annee:2026, nouveau:true, couverture:"", couleurs:["#1E9BD7","#1d2a36"], lien:"", fichier:"eau-chaude-froide-c11", version:"1", competence:"11", enConstruction:true,
    description:"Cahier d'apprentissage de 120 heures (307-498) : eau potable et code, protection contre le refoulement, calculs de charge avec schémas, réseau souterrain et hors terre, robinets et accessoires, pompes de puits, chauffe-eau, appareils sanitaires. Pratique dans les cabines de l'atelier." },
  { titre:"Plomberie et chauffage", auteur:"Jérémy Raymond", categorie:"Entretien général d'immeubles", niveau:"DEP 5211 · Compétence 10",
    pages:192, annee:2026, nouveau:false, couverture:"", couleurs:["#1e88e5","#0b2f6b"], lien:"", fichier:"plomberie-chauffage", version:"3", competence:"10",
    description:"Entretien des systèmes de plomberie et de chauffage (75 h) : tuyauterie, raccords, drainage, chauffe-eau, brûleur et pompes. Théorie, activités, quiz et ateliers." },

  { titre:"Dispositifs électriques et électroniques", auteur:"Jérémy Raymond", categorie:"Plomberie et chauffage", niveau:"DEP 5333 · Compétence 9",
    pages:324, annee:2026, nouveau:false, couverture:"", couleurs:["#F2A900","#6b4a00"], lien:"", fichier:"dispositifs-electriques-c9", version:"6", competence:"9",
    description:"Installer, faire fonctionner et dépanner les commandes des systèmes de chauffage à air chaud, hydroniques et à la vapeur. 9 modules, de la sécurité à l'automate programmable." },

  { titre:"Ateliers de montages électriques", auteur:"Jérémy Raymond", categorie:"Plomberie et chauffage", niveau:"DEP 5333 · Compétence 5 · 307435",
    pages:23, annee:2026, nouveau:true, couverture:"", couleurs:["#123150","#c0392b"], lien:"", fichier:"montages-electriques-c5", version:"1", competence:"5",
    description:"Cahier d'ateliers de la compétence Installation de composants électriques : brancher une fiche mâle, 8 montages filaires (de l'interrupteur simple au 3 voies + 4 voies), lire un schéma à échelle, puis 10 montages à échelle (thermostat, pressostat, flotteur, relais, chauffe-eau, pompes). Préalable théorique validé avant chaque montage et grille de suivi des acquis." },

  { titre:"Notions d'énergie", auteur:"Jérémy Raymond", categorie:"Plomberie et chauffage", niveau:"DEP 5333 · Compétence 13 · PLC13",
    pages:121, annee:2026, nouveau:true, couverture:"", couleurs:["#E2531F","#3a1d6e"], lien:"", fichier:"notions-energie-c13", version:"103", competence:"13",
    description:"Cahier d'apprentissage de 45 heures (307-513) en 7 modules : les sources d'énergie, pertes et gains, compenser les pertes, le fonctionnement des systèmes de chauffage, les brûleurs à l'huile et accessoires, économiser l'énergie et présenter l'information à un client. De la source d'énergie jusqu'au confort du client." },

  { titre:"Protection incendie d'un bâtiment", auteur:"Jérémy Raymond", categorie:"Entretien général d'immeubles", niveau:"DEP 5211 · Compétence 12 · 436-312",
    pages:145, annee:2026, nouveau:false, couverture:"", couleurs:["#E8590C","#5a1c00"], lien:"", fichier:"protection-incendie", version:"6", competence:"12",
    description:"Livre d'apprentissage de 30 heures, refait au niveau professionnel : science du feu, agents et extincteurs, détection, panneau d'alarme, mises hors service et interventions, alimentation de secours, gicleurs et canalisations, réglementation et registres, plan de sécurité incendie et évacuation (étude de cas L'Isle-Verte). Un immeuble fil rouge, les Habitations du Quai, des dossiers à remplir, six laboratoires et un lexique français-anglais." },
  { titre:"Ventilation et climatisation", auteur:"Jérémy Raymond", categorie:"Entretien général d'immeubles", niveau:"DEP 5211 · Compétence 11", pages:145, annee:2026, nouveau:true, couverture:"", couleurs:["#00acc1","#05474f"], lien:"", fichier:"ventilation-climatisation-m11", competence:"11", version:"4", description:"Livre d'apprentissage de 60 heures : sécurité et entretien, air et confort, systèmes de ventilation, composants, échangeurs d'air VRC/VRE, cycle frigorifique, thermopompes, régulation, climatisation centrale et entretien préventif. Activités, réponses pas à pas et animations." },
  { titre:"Administration d'un bâtiment et plan d'urgence", auteur:"Jérémy Raymond", categorie:"Entretien général d'immeubles", niveau:"DEP 5211 · Compétence 16",
    pages:147, annee:2026, nouveau:true, couverture:"", couleurs:["#1565c0","#0d1b2a"], lien:"", fichier:"administration-batiment", version:"9", competence:"16",
    description:"Cahier d'apprentissage en 13 chapitres : rôle administratif du préposé, le bail et le TAL, le loyer, l'entretien et les travaux, la copropriété, le budget et le plan d'urgence. Théorie, quiz et activités." },
  { titre:"Utiliser un micro-ordinateur", auteur:"Jérémy Raymond", categorie:"Entretien général d'immeubles", niveau:"DEP 5211 · Compétence 15",
    pages:173, annee:2026, nouveau:true, couverture:"", couleurs:["#E8592C","#26303b"], lien:"", fichier:"micro-ordinateur", competence:"15", version:"10",
    description:"Cahier d'apprentissage de 45 heures en 9 modules : le portable et le poste de travail, Windows 11, fichiers et OneDrive, Internet et cybersécurité, Outlook et Teams, Word, Excel, la gestion de l'entretien (GMAO) et l'intelligence artificielle. Fil conducteur : une semaine à l'immeuble Les Érables." },
  { titre:"Utiliser un micro-ordinateur — essai gratuit", auteur:"Jérémy Raymond", categorie:"Entretien général d'immeubles", niveau:"Essai gratuit · Module 1",
    pages:17, annee:2026, couverture:"", couleurs:["#E8592C","#26303b"], lien:"", fichier:"essai-micro-ordinateur", essai:true, couvDe:"micro-ordinateur",
    description:"Essai gratuit, sans connexion : la couverture, la table des matières et le module 1 (le portable et le poste de travail) du livre « Utiliser un micro-ordinateur », avec ses guides animés. Le livre complet compte 9 modules et 173 pages." },
  { titre:"Communiquer en milieu de travail", auteur:"Jérémy Raymond", categorie:"Entretien général d'immeubles", niveau:"DEP 5211 · Compétence 7",
    pages:176, annee:2026, nouveau:true, couverture:"", couleurs:["#8B6CFF","#211f33"], lien:"", fichier:"communiquer", version:"18", competence:"7",
    description:"Cahier d'apprentissage de 30 heures (436-282) en 9 modules : le rôle du préposé, les bases de la communication, les occupants, le travail d'équipe, l'écrit professionnel, le téléphone et la radio, les situations difficiles, l'éthique et l'image professionnelle, et une évaluation formative. Mises en situation, documents de travail, 10 ateliers de communication (un par période de 3 h) et situations tirées du terrain." },
  { titre:"Entretien de matériel électrique", auteur:"Jérémy Raymond", categorie:"Entretien général d'immeubles", niveau:"DEP 5211 · Compétence 13",
    pages:166, annee:2026, nouveau:true, enConstruction:true, couverture:"", couleurs:["#C6F432","#18191c"], lien:"", fichier:"materiel-electrique-c13", version:"6", competence:"13",
    description:"Cahier d'apprentissage de 60 heures (436-274) en 10 modules : l'électricité du barrage à la maison, le rôle du préposé, se protéger, le multimètre, l'entretien préventif, l'éclairage, cordons et électroménagers, disjoncteurs, prises et interrupteurs, le rapport, et l'immeuble d'aujourd'hui. Version en construction." },
];
/* ===================================================================== */
