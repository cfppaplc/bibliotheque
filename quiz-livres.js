/* Quiz des livres de la bibliothèque (7 nov.) — un quiz par livre, questions et images tirées du livre.
   Fabriqué par Claude à partir des livres (scratchpad ql/data.py); lecture seule dans le quiz : « Copier et modifier » pour l'adapter. */
window.QUIZ_LIVRES = [
{
"id": "livre-communiquer",
"exemple": true,
"livre": true,
"titre": "Communiquer en milieu de travail",
"sujet": "Quiz du livre · 10 questions",
"couv": "img/labo/quiz/livres/communiquer-couv.jpg",
"coul": "#185FA5",
"qs": [
{
"q": "Les employeurs engagent souvent un préposé d'abord pour…",
"s": 20,
"ch": [
"Sa rapidité",
"Sa fiabilité et son attitude",
"Ses outils",
"Ses diplômes"
],
"bon": 1,
"expl": "C'est le savoir-être : la façon de te comporter avec les autres. Le reste, on peut te le montrer.",
"img": "img/labo/quiz/livres/communiquer-01.jpg"
},
{
"q": "Reformuler, c'est…",
"s": 25,
"ch": [
"Redire dans tes mots ce que la personne a dit, pour vérifier que tu as compris",
"Répéter mot pour mot ce qu'elle a dit",
"Corriger la façon de parler du locataire",
"Résumer la plainte au gestionnaire par écrit"
],
"bon": 0,
"expl": "La reformulation évite la majorité des erreurs de communication.",
"img": "img/labo/quiz/livres/communiquer-02.jpg"
},
{
"q": "Pour annoncer une coupure d'eau à une personne âgée, tu…",
"s": 25,
"ch": [
"Passes le message par un voisin",
"Parles plus fort, de loin",
"Parles lentement, face à elle, et laisses une trace écrite",
"Glisses seulement un avis sous la porte"
],
"bon": 2,
"expl": "Même respect, avec un peu plus de patience et d'attention.",
"img": "img/labo/quiz/livres/communiquer-03.jpg"
},
{
"q": "À la radio, comment dit-on la lettre D ?",
"s": 20,
"ch": [
"Denis",
"Delta",
"Dakota",
"David"
],
"bon": 1,
"expl": "On utilise l'alphabet phonétique international : B, D, P et T se ressemblent à la radio."
},
{
"q": "À la radio, le modèle « BK-40T » se dit…",
"s": 20,
"ch": [
"Bravo, Kilo, 40, Thomas",
"Bé, Ka, quarante, Té",
"Bêta, Kappa, 40, Tau",
"Bravo, Kilo, tiret, 4, 0, Tango"
],
"bon": 3,
"expl": "Chaque lettre devient un mot de l'alphabet phonétique."
},
{
"q": "Complète : « Le robinet ___ changé. »",
"s": 20,
"ch": [
"est",
"et"
],
"bon": 0,
"expl": "« est » se remplace par « était » : le robinet était changé."
},
{
"q": "Devant un locataire fâché, ton objectif est d'agir…",
"s": 25,
"ch": [
"Seulement quand il se met à crier",
"Au niveau 3 : la colère",
"Après avoir appelé ton gestionnaire",
"Au niveau 1 ou 2 : agacement ou frustration"
],
"bon": 3,
"expl": "Plus tu reconnais tôt les signes, plus il est facile de faire baisser la tension."
},
{
"q": "Voix plus forte, répétitions, reproches : c'est quel niveau ?",
"s": 20,
"ch": [
"La colère",
"Le calme",
"La frustration",
"L'agacement"
],
"bon": 2,
"expl": "Ta réaction : reformule, reste calme, propose une solution."
},
{
"q": "Un locataire t'offre de l'argent pour passer avant les autres. Tu…",
"s": 20,
"ch": [
"Refuses : c'est un conflit d'intérêts",
"Acceptes si c'est un petit montant",
"Acceptes, puisque tu restes honnête",
"Acceptes et partages avec ton collègue"
],
"bon": 0,
"expl": "Même l'apparence de favoritisme nuit à ta réputation et à celle de l'employeur."
},
{
"q": "Pourquoi écrire une consigne au changement de quart ?",
"s": 25,
"ch": [
"Parce que les collègues ne lisent pas leurs textos",
"Parce qu'un message se déforme de bouche à oreille",
"Parce que c'est une règle de la CNESST",
"Parce que c'est plus rapide que de parler"
],
"bon": 1,
"expl": "« Fuite au 304 » devient « une fuite au 3e, je pense » après trois personnes.",
"img": "img/labo/quiz/livres/communiquer-10.jpg"
}
]
},
{
"id": "livre-dispositifs-electriques-c9",
"exemple": true,
"livre": true,
"titre": "Dispositifs électriques et électroniques",
"sujet": "Quiz du livre · 10 questions",
"couv": "img/labo/quiz/livres/dispositifs-electriques-c9-couv.jpg",
"coul": "#E0892B",
"qs": [
{
"q": "Un voltmètre mesure toujours…",
"s": 20,
"ch": [
"Une différence entre deux points",
"Le courant dans le fil",
"La tension d'un seul point",
"La résistance du circuit"
],
"bon": 0,
"expl": "Comme l'altitude : on mesure toujours par rapport à un autre point."
},
{
"q": "Tu lis 0 V aux bornes d'un contact fermé. Ça veut dire…",
"s": 25,
"ch": [
"Pas forcément sans danger : les deux bornes peuvent être à 120 V",
"Que le circuit est hors tension",
"Que le contact est brûlé",
"Que le voltmètre est défectueux"
],
"bon": 0,
"expl": "120 V − 120 V = 0 V : les deux bornes sont sous tension !"
},
{
"q": "Quand la bobine du relais est alimentée, le contact NO…",
"s": 20,
"ch": [
"Devient un contact NF",
"S'ouvre et coupe la charge",
"Se ferme et alimente la charge",
"Ne change pas"
],
"bon": 2,
"expl": "La bobine commande; le contact normalement ouvert se ferme."
},
{
"q": "Sur un relais de zone Taco SR501, les bornes T T reçoivent…",
"s": 20,
"ch": [
"La valve de zone",
"Le thermostat (24 V)",
"Le circulateur",
"L'alimentation 120 V"
],
"bon": 1,
"expl": "T T = thermostat : la demande de chaleur.",
"img": "img/labo/quiz/livres/dispositifs-electriques-c9-04.jpg"
},
{
"q": "Deux moteurs de valve de 7,7 VA sur un transfo de 40 VA : ça passe ?",
"s": 20,
"ch": [
"Oui, mais seulement en 120 V",
"Oui : 15,4 VA, c'est sous 40 VA",
"Non : ça dépasse 40 VA",
"Non : il faut un transfo par valve"
],
"bon": 1,
"expl": "7,7 + 7,7 = 15,4 VA."
},
{
"q": "Le L4064 (« fan-limit ») d'une fournaise…",
"s": 25,
"ch": [
"Allume la veilleuse",
"Fait partir le ventilateur et coupe le brûleur si le plénum surchauffe",
"Règle la vitesse du ventilateur",
"Mesure le CO dans le plénum"
],
"bon": 1,
"expl": "Une seule commande sur le plénum fait deux travaux : ventilateur et limite.",
"img": "img/labo/quiz/livres/dispositifs-electriques-c9-06.jpg"
},
{
"q": "Sur le L4064 illustré, la limite coupe le brûleur à…",
"s": 20,
"ch": [
"200 °F",
"100 °F",
"250 °F",
"125 °F"
],
"bon": 0,
"expl": "Réglages illustrés : arrêt ventilateur 100 °F, départ 125 °F, limite 200 °F."
},
{
"q": "Un filtre bouché sur une fournaise fait surtout…",
"s": 25,
"ch": [
"Surchauffer le plénum : la limite coupe le brûleur",
"Démarrer le ventilateur plus tôt",
"Baisser la température du plénum",
"Ouvrir le disjoncteur"
],
"bon": 0,
"expl": "Moins d'air passe sur l'échangeur : la chaleur monte jusqu'à la limite."
},
{
"q": "Le protectorelais R8184G voit la flamme grâce à…",
"s": 20,
"ch": [
"Une thermopile",
"Une tige d'ionisation",
"Une cellule au CdS (C554A)",
"Un thermocouple"
],
"bon": 2,
"expl": "La cellule au sulfure de cadmium réagit à la lumière de la flamme."
},
{
"q": "Avec un module d'allumage intermittent, la valve principale s'ouvre…",
"s": 25,
"ch": [
"Quand la limite haute s'ouvre",
"Avant l'étincelle",
"Après que la veilleuse est allumée et prouvée",
"Dès que le thermostat demande"
],
"bon": 2,
"expl": "Le module allume la veilleuse, la prouve, puis ouvre la valve principale."
}
]
},
{
"id": "livre-ventilation-climatisation-m11",
"exemple": true,
"livre": true,
"titre": "Ventilation et climatisation",
"sujet": "Quiz du livre · 10 questions",
"couv": "img/labo/quiz/livres/ventilation-climatisation-m11-couv.jpg",
"coul": "#14A3A3",
"qs": [
{
"q": "Débit d'un diffuseur = vitesse moyenne de l'air ×…",
"s": 20,
"ch": [
"L'aire libre de la grille",
"Le nombre de diffuseurs",
"La température de l'air",
"La pression statique"
],
"bon": 0,
"expl": "On mesure plusieurs points à l'anémomètre, on fait la moyenne, puis × l'aire libre.",
"img": "img/labo/quiz/livres/ventilation-climatisation-m11-01.jpg"
},
{
"q": "Une pièce reçoit moins d'air que prévu au devis. On ajuste…",
"s": 20,
"ch": [
"Le registre de la branche",
"Le compresseur",
"Le thermostat",
"Le filtre"
],
"bon": 0,
"expl": "On mesure à chaque diffuseur et on équilibre avec les registres."
},
{
"q": "Les volets à lames opposées sont bons pour…",
"s": 20,
"ch": [
"Seulement tout ouvrir ou tout fermer",
"Régler finement un débit",
"Filtrer l'air",
"Humidifier l'air"
],
"bon": 1,
"expl": "Lames parallèles : tout ouvrir ou fermer. Lames opposées : régler finement.",
"img": "img/labo/quiz/livres/ventilation-climatisation-m11-03.jpg"
},
{
"q": "L'humidificateur sert à…",
"s": 20,
"ch": [
"Refroidir l'air",
"Enlever l'humidité l'été",
"Ajouter de l'eau à l'air l'hiver",
"Filtrer la poussière"
],
"bon": 2,
"expl": "Négligé, il cause beaucoup de plaintes."
},
{
"q": "Première étape de l'entretien d'un échangeur d'air (VRC/VRE)",
"s": 20,
"ch": [
"Laver le noyau",
"Changer les filtres",
"Vider le drain",
"Arrêter et débrancher (ou cadenasser)"
],
"bon": 3,
"expl": "On attend aussi l'arrêt des ventilateurs."
},
{
"q": "En climatisation, le préposé n'ouvre jamais…",
"s": 20,
"ch": [
"La grille de retour",
"L'accès au filtre",
"Le bac de condensat",
"Le circuit de réfrigérant"
],
"bon": 3,
"expl": "Mais beaucoup de pannes viennent de l'air et de l'eau : ça, c'est ton travail."
},
{
"q": "Autour de l'unité extérieure, il faut…",
"s": 25,
"ch": [
"Planter une haie pour la cacher",
"Coller l'unité au mur",
"Garder un dégagement : pas de haie, de bac ni de neige",
"Mettre une bâche l'été"
],
"bon": 2,
"expl": "Le serpentin doit rester propre et l'air doit circuler."
},
{
"q": "Le point d'équilibre d'une thermopompe, c'est…",
"s": 25,
"ch": [
"La température de l'eau du réservoir",
"La consigne du thermostat",
"La température extérieure où elle fournit juste assez de chaleur",
"La température où elle dégivre"
],
"bon": 2,
"expl": "Plus il fait froid, plus la maison a besoin de chaleur… et moins la thermopompe en fournit.",
"img": "img/labo/quiz/livres/ventilation-climatisation-m11-08.jpg"
},
{
"q": "Plus froid que le point d'équilibre, il faut…",
"s": 20,
"ch": [
"Un chauffage d'appoint",
"Baisser le thermostat",
"Plus de ventilation",
"Arrêter la thermopompe"
],
"bon": 0,
"expl": "Les deux courbes se croisent au point d'équilibre."
},
{
"q": "Un thermostat programmable…",
"s": 25,
"ch": [
"Remplace la plinthe électrique",
"Doit toujours être branché au Wi-Fi",
"Change la consigne selon un horaire (nuit, absence)",
"Mesure le CO₂"
],
"bon": 2,
"expl": "Les occupants y touchent beaucoup : c'est souvent là que commencent les plaintes."
}
]
},
{
"id": "livre-notions-energie-c13",
"exemple": true,
"livre": true,
"titre": "Notions d'énergie",
"sujet": "Quiz du livre · 10 questions",
"couv": "img/labo/quiz/livres/notions-energie-c13-couv.jpg",
"coul": "#0F6E56",
"qs": [
{
"q": "La géothermie capte la chaleur…",
"s": 20,
"ch": [
"Du réseau d'aqueduc",
"De l'air extérieur",
"Du sol (environ 8 °C, stable)",
"Du soleil, directement"
],
"bon": 2,
"expl": "L'aérothermie capte l'air; le solaire chauffe l'eau directement.",
"img": "img/labo/quiz/livres/notions-energie-c13-01.jpg"
},
{
"q": "Le COP d'un système géothermique est d'environ…",
"s": 20,
"ch": [
"3 à 4",
"0,8",
"1",
"10 à 12"
],
"bon": 0,
"expl": "Il fournit 3 à 4 fois plus de chaleur qu'il ne consomme d'électricité, toute l'année."
},
{
"q": "L'enveloppe du bâtiment doit…",
"s": 25,
"ch": [
"Seulement être étanche",
"Isoler, être étanche à l'air et contrôler l'humidité",
"Laisser fuir l'air pour respirer",
"Seulement isoler"
],
"bon": 1,
"expl": "Toit, murs, fenêtres, portes, fondation et plancher.",
"img": "img/labo/quiz/livres/notions-energie-c13-03.jpg"
},
{
"q": "La chaleur qui passe à travers les murs et les vitres, c'est…",
"s": 20,
"ch": [
"La conduction",
"Les fuites d'air",
"Le rayonnement solaire",
"La ventilation"
],
"bon": 0,
"expl": "Les fuites d'air passent par les fissures, la porte et le grenier."
},
{
"q": "Formule de base en hydronique : Q (BTU/h) =",
"s": 20,
"ch": [
"débit (GPM) ÷ ΔT",
"500 × débit (GPM) × ΔT (°F)",
"70 × débit (GPM) × ΔT (°F)",
"8,33 × débit (GPM)"
],
"bon": 1,
"expl": "En métrique : Q (W) ≈ 70 × débit (L/min) × ΔT (°C).",
"img": "img/labo/quiz/livres/notions-energie-c13-05.jpg"
},
{
"q": "D'où vient le 500 de la formule ?",
"s": 20,
"ch": [
"8,33 lb par gallon × 60 minutes",
"Une constante de pression",
"Le nombre de pieds dans un mille",
"Les BTU d'une livre de vapeur"
],
"bon": 0,
"expl": "8,33 × 60 ≈ 500."
},
{
"q": "Dans une fournaise, l'air de la maison et les gaz brûlés…",
"s": 25,
"ch": [
"Se mélangent au démarrage seulement",
"Sortent ensemble par l'évent",
"Ne se mélangent jamais : l'échangeur les sépare",
"Se mélangent dans le plénum"
],
"bon": 2,
"expl": "Les gaz passent dans l'échangeur et sortent par l'évent.",
"img": "img/labo/quiz/livres/notions-energie-c13-07.jpg"
},
{
"q": "Dans un réseau mal équilibré, les émetteurs près de la chaudière…",
"s": 20,
"ch": [
"Ne reçoivent pas assez de débit",
"Reçoivent trop de débit",
"Ne changent rien",
"Restent toujours froids"
],
"bon": 1,
"expl": "L'eau prend toujours le chemin le plus facile; le retour inversé aide à équilibrer.",
"img": "img/labo/quiz/livres/notions-energie-c13-08.jpg"
},
{
"q": "La pompe à mazout d'un brûleur à pulvérisation pousse le mazout à…",
"s": 20,
"ch": [
"500 lb/po²",
"100 à 150 lb/po²",
"5 à 10 lb/po²",
"1 lb/po²"
],
"bon": 1,
"expl": "Le moteur fait tourner le ventilateur et la pompe sur le même arbre.",
"img": "img/labo/quiz/livres/notions-energie-c13-09.jpg"
},
{
"q": "Pour économiser l'énergie, on commence par…",
"s": 25,
"ch": [
"Réduire les besoins : isolation, étanchéité, fenêtres",
"Installer des panneaux solaires",
"Récupérer la chaleur avec un VRC",
"Acheter l'appareil le plus efficace"
],
"bon": 0,
"expl": "Un appareil très efficace dans une maison qui fuit gaspille quand même.",
"img": "img/labo/quiz/livres/notions-energie-c13-10.jpg"
}
]
},
{
"id": "livre-materiel-electrique-c13",
"exemple": true,
"livre": true,
"titre": "Entretien de matériel électrique",
"sujet": "Quiz du livre · 10 questions",
"couv": "img/labo/quiz/livres/materiel-electrique-c13-couv.jpg",
"coul": "#8B6CE0",
"qs": [
{
"q": "Un grand immeuble reçoit généralement…",
"s": 20,
"ch": [
"Du 120/240 V monophasé",
"Du 25 kV jusqu'aux logements",
"Du 12 V",
"Du triphasé 347/600 V"
],
"bon": 3,
"expl": "La tension est ensuite baissée à l'intérieur pour les prises et l'éclairage.",
"img": "img/labo/quiz/livres/materiel-electrique-c13-01.jpg"
},
{
"q": "Dans la chambre électrique, le transfo sec baisse la tension à…",
"s": 20,
"ch": [
"347 V",
"25 kV",
"600 V",
"120/208 V"
],
"bon": 3,
"expl": "Pour les prises et l'éclairage des logements."
},
{
"q": "Qui peut exécuter des travaux d'installation électrique dans un immeuble ?",
"s": 20,
"ch": [
"Le locataire",
"Un entrepreneur électricien",
"Le propriétaire",
"Le préposé"
],
"bon": 1,
"expl": "Le préposé fait l'entretien dans son champ de compétence."
},
{
"q": "Quel organisme s'occupe de la santé et de la sécurité du travail ?",
"s": 20,
"ch": [
"Hydro-Québec",
"La RBQ",
"La CNESST",
"La CMEQ"
],
"bon": 2
},
{
"q": "Pour mesurer une tension, on branche les pointes…",
"s": 25,
"ch": [
"En série dans le circuit",
"En parallèle, de chaque côté de ce qu'on mesure",
"Seulement sur un circuit hors tension",
"Seulement sur la mise à la terre"
],
"bon": 1,
"expl": "Se tromper de branchement peut endommager l'appareil… ou te blesser."
},
{
"q": "En position AUTO, la génératrice…",
"s": 20,
"ch": [
"Démarre seulement à la main",
"Ne démarre jamais seule",
"Est cadenassée",
"Peut démarrer seule à tout moment"
],
"bon": 3,
"expl": "Panne ou essai programmé : on ne met jamais les mains près des courroies."
},
{
"q": "Pourquoi le local de la génératrice doit-il être ventilé ?",
"s": 25,
"ch": [
"Pour refroidir les batteries",
"Pour l'odeur du diesel seulement",
"L'échappement contient du monoxyde de carbone",
"Ce n'est pas nécessaire"
],
"bon": 2,
"expl": "Le CO est invisible et sans odeur."
},
{
"q": "Une ampoule halogène peut dépasser…",
"s": 20,
"ch": [
"1000 °C",
"50 °C",
"80 °C",
"200 °C"
],
"bon": 3,
"expl": "On laisse refroidir avant de la changer."
},
{
"q": "Un cordon abîmé sur sa longueur : on…",
"s": 20,
"ch": [
"Remplace le cordon au complet",
"Met du ruban",
"Fait une épissure au milieu",
"Le raccourcit"
],
"bon": 0,
"expl": "Même type, même calibre, même nombre de conducteurs.",
"img": "img/labo/quiz/livres/materiel-electrique-c13-09.jpg"
},
{
"q": "Au panneau électrique, le préposé ouvre seulement…",
"s": 20,
"ch": [
"Le boîtier du disjoncteur principal",
"Le couvercle",
"La porte, jamais le couvercle",
"L'accès aux barres"
],
"bon": 2,
"expl": "Derrière la porte : les disjoncteurs et le répertoire.",
"img": "img/labo/quiz/livres/materiel-electrique-c13-10.jpg"
}
]
},
{
"id": "livre-micro-ordinateur",
"exemple": true,
"livre": true,
"titre": "Utiliser un micro-ordinateur",
"sujet": "Quiz du livre · 10 questions",
"couv": "img/labo/quiz/livres/micro-ordinateur-couv.jpg",
"coul": "#185FA5",
"qs": [
{
"q": "Quel nom de fichier respecte la règle du livre ?",
"s": 25,
"ch": [
"scan0004.pdf",
"2026-10-15_salle-meca_chauffe-eau-3_vidange.pdf",
"Document final (2).pdf",
"chauffe eau.pdf"
],
"bon": 1,
"expl": "La date d'abord, puis le lieu, puis le sujet."
},
{
"q": "Pourquoi mettre la date AAAA-MM-JJ au début du nom ?",
"s": 25,
"ch": [
"Pour l'envoyer plus vite",
"Les fichiers se placent tout seuls en ordre chronologique",
"Windows l'exige",
"Pour cacher le fichier"
],
"bon": 1
},
{
"q": "Quel fichier téléchargé est le plus risqué ?",
"s": 20,
"ch": [
".docx",
".pdf",
".jpg",
".exe"
],
"bon": 3,
"expl": "Un programme peut contenir un virus; un PDF est à faible risque.",
"img": "img/labo/quiz/livres/micro-ordinateur-03.jpg"
},
{
"q": "Par défaut, un fichier téléchargé va dans le dossier…",
"s": 20,
"ch": [
"Documents",
"Corbeille",
"Téléchargements",
"Bureau"
],
"bon": 2,
"expl": "Ensuite, déplace-le dans le bon dossier avec un bon nom."
},
{
"q": "Dans une équipe d'entretien, Teams remplace surtout…",
"s": 20,
"ch": [
"Le téléphone d'urgence",
"Le courriel du gestionnaire",
"Le registre d'entretien",
"Les textos éparpillés"
],
"bon": 3,
"expl": "Tout le monde voit la même information, au même endroit.",
"img": "img/labo/quiz/livres/micro-ordinateur-05.jpg"
},
{
"q": "Un rapport d'intervention raconte…",
"s": 25,
"ch": [
"Les faits, dans l'ordre, avec les preuves (photos)",
"Les excuses de l'équipe",
"Ton opinion sur le locataire",
"Seulement le coût des pièces"
],
"bon": 0,
"expl": "En-tête : date, lieu, équipement, ton nom.",
"img": "img/labo/quiz/livres/micro-ordinateur-06.jpg"
},
{
"q": "Le registre d'entretien dans Excel, c'est…",
"s": 25,
"ch": [
"Des notes libres, sans colonnes",
"Une ligne par intervention, toujours les mêmes colonnes",
"Une feuille par jour",
"Un fichier par intervention"
],
"bon": 1,
"expl": "C'est la mémoire de l'immeuble.",
"img": "img/labo/quiz/livres/micro-ordinateur-07.jpg"
},
{
"q": "Pour résumer 100 bons de travail par équipement, on utilise…",
"s": 20,
"ch": [
"Word",
"Un graphique en secteurs seulement",
"Un tableau croisé dynamique",
"La fonction SOMME sur chaque ligne"
],
"bon": 2,
"expl": "Combien de bons, combien d'heures, par équipement ou par mois."
},
{
"q": "Coller les coordonnées d'un locataire dans une IA publique…",
"s": 20,
"ch": [
"N'a aucune importance",
"Peut être un incident selon la Loi 25",
"Est toujours permis",
"Est permis si c'est pour un courriel"
],
"bon": 1,
"expl": "Les renseignements personnels doivent être protégés."
},
{
"q": "Quelle demande à une IA est une bonne pratique au travail ?",
"s": 25,
"ch": [
"« Écris le rapport, je ne le relirai pas »",
"« Invente les heures travaillées de la semaine »",
"« Trouve le mot de passe du locataire »",
"« Corrige les fautes de ce rapport sans changer les faits »"
],
"bon": 3,
"expl": "Tu restes responsable de ce que tu envoies : relis toujours.",
"img": "img/labo/quiz/livres/micro-ordinateur-10.jpg"
}
]
},
{
"id": "livre-plomberie-chauffage",
"exemple": true,
"livre": true,
"titre": "Plomberie et chauffage",
"sujet": "Quiz du livre · 10 questions",
"couv": "img/labo/quiz/livres/plomberie-chauffage-couv.jpg",
"coul": "#B3261E",
"qs": [
{
"q": "Sur un ruban à mesurer, chaque pouce est divisé en…",
"s": 20,
"ch": [
"16 parties égales",
"8 parties",
"12 parties",
"10 parties"
],
"bon": 0,
"expl": "Plus la ligne est longue, plus la fraction est « grosse »."
},
{
"q": "La soudure capillaire fonctionne grâce à…",
"s": 25,
"ch": [
"La capillarité : la soudure est aspirée dans le jeu mince",
"La pression de l'eau",
"Le flux qui colle",
"Le serrage du raccord"
],
"bon": 0,
"expl": "Comme le café qui monte dans un morceau de sucre.",
"img": "img/labo/quiz/livres/plomberie-chauffage-02.jpg"
},
{
"q": "Le jeu entre le tuyau et le raccord est d'environ…",
"s": 20,
"ch": [
"1/4 de pouce",
"5 mm",
"Aucun jeu",
"L'épaisseur d'une feuille de papier"
],
"bon": 3
},
{
"q": "« Soudure à l'étain » se dit en anglais…",
"s": 20,
"ch": [
"Soldering / Sweating",
"Crimping",
"Welding",
"Brazing"
],
"bon": 0,
"expl": "Sertissage = Press / Crimp."
},
{
"q": "Pour le traitement de l'eau, le préposé…",
"s": 25,
"ch": [
"Change les cartouches, ajoute le sel et surveille les signes de problème",
"Ne touche jamais à rien",
"Règle la dureté de l'aqueduc",
"Choisit l'équipement"
],
"bon": 0,
"img": "img/labo/quiz/livres/plomberie-chauffage-05.jpg"
},
{
"q": "L'appareil qui génère le plus de bons de travail dans un immeuble ?",
"s": 20,
"ch": [
"Le chauffe-eau",
"La toilette",
"Le lave-vaisselle",
"Le drain de plancher"
],
"bon": 1,
"expl": "Une toilette qui coule peut gaspiller plusieurs centaines de litres par jour."
},
{
"q": "La toilette coule sans arrêt : l'eau entre dans le trop-plein. On…",
"s": 20,
"ch": [
"Ajoute un clapet",
"Baisse le flotteur",
"Remplace le robinet d'arrêt",
"Change la cuvette"
],
"bon": 1,
"expl": "Le niveau est trop haut."
},
{
"q": "« Anode sacrificielle » se dit en anglais…",
"s": 20,
"ch": [
"Sacrificial anode rod",
"Baffle",
"Drain valve",
"Dip tube"
],
"bon": 0,
"expl": "Dip tube = tube plongeur."
},
{
"q": "Un brûleur à l'huile qui manque d'air produit…",
"s": 20,
"ch": [
"Une flamme plus propre",
"De la suie et du monoxyde de carbone",
"De la chaleur perdue dans la cheminée",
"Un meilleur rendement"
],
"bon": 1,
"expl": "Trop d'air : la chaleur part dans la cheminée."
},
{
"q": "L'entretien préventif se fait…",
"s": 25,
"ch": [
"Seulement après une panne",
"Quand un locataire se plaint",
"Une fois tous les 10 ans",
"Selon un calendrier, avant que le problème arrive"
],
"bon": 3,
"expl": "Plus le préventif est bien fait, moins il y a d'appels la nuit."
}
]
},
{
"id": "livre-lecture-plans-devis-c6",
"exemple": true,
"livre": true,
"titre": "Lecture de plans et devis",
"sujet": "Quiz du livre · 10 questions",
"couv": "img/labo/quiz/livres/lecture-plans-devis-c6-couv.jpg",
"coul": "#854F0B",
"qs": [
{
"q": "On construit seulement avec les plans…",
"s": 25,
"ch": [
"Émis pour construction, à la dernière révision",
"D'une version précédente",
"Pour soumission",
"Préliminaires"
],
"bon": 0
},
{
"q": "Une révision est montrée sur le plan par…",
"s": 20,
"ch": [
"Une étoile",
"Un trait rouge",
"Un astérisque",
"Un nuage et un triangle"
],
"bon": 3
},
{
"q": "Le plombier voit une erreur dans un plan. Il…",
"s": 20,
"ch": [
"Change le plan lui-même",
"L'ignore",
"Pose ses questions par écrit",
"Appelle le client"
],
"bon": 2,
"expl": "Le plombier ne change pas un plan."
},
{
"q": "Un détail est dessiné à…",
"s": 20,
"ch": [
"1:100",
"Petite échelle (1:500)",
"Toujours sans échelle",
"Grande échelle (1:5, 1:10, 1:20)"
],
"bon": 3,
"expl": "C'est un zoom sur une petite partie du bâtiment.",
"img": "img/labo/quiz/livres/lecture-plans-devis-c6-04.jpg"
},
{
"q": "À 1/4\" = 1'-0\", tu lis 7 pieds et 6 pouces. Ça s'écrit…",
"s": 20,
"ch": [
"7\"-6'",
"7,6'",
"7'-6\"",
"76\""
],
"bon": 2
},
{
"q": "Sur un plan de plomberie, « CC » veut dire…",
"s": 20,
"ch": [
"Chauffe-eau commercial",
"Colonne de chauffage",
"Colonne de chute",
"Cuivre coudé"
],
"bon": 2,
"expl": "En anglais : SS (soil stack)."
},
{
"q": "« RN » veut dire…",
"s": 20,
"ch": [
"Réseau neuf",
"Regard de nettoyage",
"Retour nord",
"Robinet normal"
],
"bon": 1,
"expl": "En anglais : CO (cleanout)."
},
{
"q": "Espacement maximal des supports de l'ABS/PVC horizontal",
"s": 20,
"ch": [
"1,2 m",
"2,5 m",
"3,0 m",
"0,8 m"
],
"bon": 0,
"expl": "Le Code de plomberie fixe l'espacement selon le matériau et le diamètre."
},
{
"q": "Espacement maximal des supports du PEX horizontal",
"s": 20,
"ch": [
"3,0 m",
"2,5 m",
"0,8 m",
"1,2 m"
],
"bon": 2
},
{
"q": "Ø 75, 75 mm et 3″ sur un plan désignent…",
"s": 20,
"ch": [
"Le même diamètre nominal",
"L'épaisseur de la paroi",
"Le diamètre mesuré au ruban",
"Trois tuyaux différents"
],
"bon": 0,
"expl": "C'est un nom commercial, pas une mesure au ruban."
}
]
},
{
"id": "livre-lecture-plans-batiments-egi",
"exemple": true,
"livre": true,
"titre": "Lecture de plans de bâtiments",
"sujet": "Quiz du livre · 10 questions",
"couv": "img/labo/quiz/livres/lecture-plans-batiments-egi-couv.jpg",
"coul": "#534AB7",
"qs": [
{
"q": "Quand on plie un plan en accordéon, le cartouche…",
"s": 20,
"ch": [
"Va à l'intérieur",
"Est plié en deux",
"Reste toujours sur le dessus",
"Est découpé"
],
"bon": 2,
"img": "img/labo/quiz/livres/lecture-plans-batiments-egi-01.jpg"
},
{
"q": "Une coupe montre le bâtiment…",
"s": 20,
"ch": [
"Vu d'en haut",
"En 3D seulement",
"Comme s'il était scié de haut en bas",
"Vu de l'extérieur"
],
"bon": 2,
"expl": "On voit l'intérieur des murs, des planchers et des fondations.",
"img": "img/labo/quiz/livres/lecture-plans-batiments-egi-02.jpg"
},
{
"q": "Les axes d'un plan passent généralement par…",
"s": 25,
"ch": [
"Les murs porteurs ou le centre des colonnes",
"Les fenêtres",
"Les meubles",
"Les portes"
],
"bon": 0,
"expl": "Lettres dans un sens, chiffres dans l'autre.",
"img": "img/labo/quiz/livres/lecture-plans-batiments-egi-03.jpg"
},
{
"q": "« L'extincteur est dans la travée E-F / 2-3 » : les axes servent…",
"s": 20,
"ch": [
"De numéro de révision",
"D'échelle",
"D'adresse sur le plan",
"De nom de local"
],
"bon": 2
},
{
"q": "La méthode du croquis d'une pièce :",
"s": 20,
"ch": [
"On prend seulement des photos",
"On copie le plan de l'architecte",
"On mesure d'abord, on dessine ensuite",
"On dessine d'abord, on mesure ensuite"
],
"bon": 3,
"expl": "Ça évite de revenir avec une mesure manquante.",
"img": "img/labo/quiz/livres/lecture-plans-batiments-egi-05.jpg"
},
{
"q": "Un plan d'étage est une coupe horizontale à environ…",
"s": 20,
"ch": [
"Au niveau du plafond",
"1,2 m du plancher",
"2,4 m du plancher",
"Au niveau du sol"
],
"bon": 1,
"expl": "On voit les murs coupés, les portes, les fenêtres.",
"img": "img/labo/quiz/livres/lecture-plans-batiments-egi-06.jpg"
},
{
"q": "Avant de percer un mur, quel plan regardes-tu en premier ?",
"s": 25,
"ch": [
"P (plomberie)",
"E (électricité)",
"Aucun : on perce",
"A (architecture) : mur porteur, coupe-feu ou mitoyen ?"
],
"bon": 3,
"expl": "Ensuite le plan E (les fils), puis le plan P (les tuyaux).",
"img": "img/labo/quiz/livres/lecture-plans-batiments-egi-07.jpg"
},
{
"q": "Tu dois travailler près d'un fil dans le mur. Tu…",
"s": 20,
"ch": [
"Perces plus lentement",
"Mets des gants seulement",
"Coupes, cadenasses et vérifies",
"Demandes au locataire"
],
"bon": 2
},
{
"q": "Un plan d'évacuation doit être orienté…",
"s": 20,
"ch": [
"Vers la sortie principale",
"Au choix",
"Comme le lieu où il est affiché",
"Le nord toujours en haut"
],
"bon": 2,
"img": "img/labo/quiz/livres/lecture-plans-batiments-egi-09.jpg"
},
{
"q": "Que trouve-t-on sur un plan d'évacuation ?",
"s": 25,
"ch": [
"Les tuyaux et les fils",
"Seulement les sorties",
"Les cotes des murs",
"« Vous êtes ici », sorties, équipements de sécurité, point de rassemblement"
],
"bon": 3
}
]
},
{
"id": "livre-travaux-mineurs-egi",
"exemple": true,
"livre": true,
"titre": "Travaux mineurs d'entretien général",
"sujet": "Quiz du livre · 10 questions",
"couv": "img/labo/quiz/livres/travaux-mineurs-egi-couv.jpg",
"coul": "#D9488A",
"qs": [
{
"q": "Passage libre minimal pour un fauteuil roulant autour d'une zone de travail",
"s": 20,
"ch": [
"1,1 m",
"2 m",
"0,6 m",
"0,8 m"
],
"bon": 0,
"expl": "Ton balisage protège les occupants et ton travail."
},
{
"q": "Pendant un travail, les issues et les portes…",
"s": 20,
"ch": [
"Peuvent être bloquées une heure",
"Restent toujours libres",
"Sont couvertes de polythène",
"Sont fermées à clé"
],
"bon": 1
},
{
"q": "L'eau des descentes pluviales doit être éloignée de la fondation de…",
"s": 20,
"ch": [
"1,5 à 2 m",
"Ça n'a pas d'importance",
"5 m",
"30 cm"
],
"bon": 0
},
{
"q": "Les chantepleures, on…",
"s": 20,
"ch": [
"Les peint",
"Les remplit de mortier",
"Ne les bouche jamais",
"Les calfeutre avant l'hiver"
],
"bon": 2,
"expl": "Elles laissent sortir l'eau derrière le parement."
},
{
"q": "Le composé à prise (en poudre) durcit…",
"s": 20,
"ch": [
"En séchant à l'air, en 24 h",
"Jamais complètement",
"Par réaction chimique, en 5 à 90 minutes",
"Au soleil"
],
"bon": 2,
"expl": "Le prémélangé, lui, sèche à l'air (12 à 24 h par couche)."
},
{
"q": "Le bac de composé à prise devient tiède. Ça veut dire…",
"s": 20,
"ch": [
"Il faut ajouter de l'eau",
"Il commence à durcir",
"Il a gelé",
"Il est trop mouillé"
],
"bon": 1,
"expl": "La prise dégage de la chaleur."
},
{
"q": "Une porcelaine absorbe moins de ___ de son poids en eau.",
"s": 20,
"ch": [
"50 %",
"0,5 %",
"5 %",
"20 %"
],
"bon": 1,
"expl": "Plus la cuisson est chaude, moins la tuile boit l'eau."
},
{
"q": "Une peinture au latex posée trop froide…",
"s": 25,
"ch": [
"Devient poudreuse : les billes ne fusionnent pas",
"Sèche plus vite",
"Ne change rien",
"Devient plus brillante"
],
"bon": 0,
"expl": "Respecte la température minimale de l'étiquette."
},
{
"q": "Une tablette chargée de livres se fixe…",
"s": 20,
"ch": [
"Avec de la colle de construction",
"Dans les montants",
"Dans le gypse seul",
"Avec du ruban double face"
],
"bon": 1,
"expl": "Aile longue de l'équerre contre le mur.",
"img": "img/labo/quiz/livres/travaux-mineurs-egi-09.jpg"
},
{
"q": "Une porte avec ferme-porte doit se refermer seule en…",
"s": 20,
"ch": [
"Moins d'une seconde",
"Une minute",
"3 à 5 secondes",
"15 à 20 secondes"
],
"bon": 2
}
]
},
{
"id": "livre-entretien-menager-egi",
"exemple": true,
"livre": true,
"titre": "Entretien ménager d'un bâtiment",
"sujet": "Quiz du livre · 10 questions",
"couv": "img/labo/quiz/livres/entretien-menager-egi-couv.jpg",
"coul": "#2E8B57",
"qs": [
{
"q": "Dans des toilettes publiques, la première surface à nettoyer est…",
"s": 20,
"ch": [
"Le miroir",
"Le plancher",
"La toilette",
"L'urinoir"
],
"bon": 0,
"expl": "On va du plus propre au plus sale; le plancher en dernier."
},
{
"q": "La toilette se nettoie…",
"s": 25,
"ch": [
"La cuvette en premier",
"De l'extérieur vers l'intérieur, la cuvette en dernier",
"Avec le chiffon du lavabo",
"Avant le miroir"
],
"bon": 1
},
{
"q": "Une microfibre bien pliée donne…",
"s": 20,
"ch": [
"8 faces",
"4 faces",
"2 faces",
"16 faces"
],
"bon": 0,
"expl": "Une face propre par surface."
},
{
"q": "Pas d'eau chaude au chalet de l'aréna. Tu compenses en…",
"s": 25,
"ch": [
"Laissant agir plus longtemps et en frottant plus",
"Sautant le nettoyage",
"Mettant le produit pur",
"Mélangeant deux produits"
],
"bon": 0,
"expl": "Température, temps, action mécanique et produit se compensent."
},
{
"q": "Un tube fluorescent usé va…",
"s": 20,
"ch": [
"Aux déchets",
"Au recyclage",
"Aux RDD (résidus dangereux)",
"Au compost"
],
"bon": 2,
"expl": "Il contient du mercure."
},
{
"q": "Avant de laver un plancher, on…",
"s": 20,
"ch": [
"Ouvre les fenêtres",
"Enlève la poussière et les débris",
"Applique le fini",
"Mouille tout le plancher"
],
"bon": 1,
"expl": "Sinon, on fait de la boue.",
"img": "img/labo/quiz/livres/entretien-menager-egi-06.jpg"
},
{
"q": "Le lavage d'un plancher commence…",
"s": 25,
"ch": [
"Près de la porte",
"N'importe où",
"Au centre",
"Au fond, dans le coin le plus loin de la porte"
],
"bon": 3,
"expl": "Bordures d'abord, puis le centre en reculant."
},
{
"q": "On change l'eau de lavage…",
"s": 25,
"ch": [
"Seulement si elle sent mauvais",
"Une fois par jour",
"Jamais pendant le quart",
"Dès qu'elle est grise ou entre deux types de locaux"
],
"bon": 3
},
{
"q": "La méthode en S pour les vitres, c'est…",
"s": 20,
"ch": [
"On n'utilise pas de raclette",
"La raclette ne quitte jamais la vitre",
"On essuie en cercles",
"On commence en bas"
],
"bon": 1,
"expl": "Ça évite les traces entre les passes.",
"img": "img/labo/quiz/livres/entretien-menager-egi-09.jpg"
},
{
"q": "Dans une piscine, un filtre encrassé…",
"s": 20,
"ch": [
"Se lave à contre-courant",
"Se vide dans le bassin",
"Se change chaque jour",
"Se nettoie au chlore pur"
],
"bon": 0,
"expl": "L'eau tourne en boucle : écumoires, pompe, filtre, chauffage, chlorateur.",
"img": "img/labo/quiz/livres/entretien-menager-egi-10.jpg"
}
]
}
];
