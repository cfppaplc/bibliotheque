/* Quiz des livres de la bibliothèque (7 nov.) — un quiz par livre, questions et images tirées du livre.
   Types : choix, vrai ou faux, plusieurs bonnes (multi), remettre en ordre (ordre), calcul (nombre), trouve l'erreur (erreur), zoom mystère (zoom).
   Chaque partie tire 12 questions au hasard (réglage « Questions », modifiable avant de jouer).
   Fabriqué par Claude à partir des livres (scratchpad ql/data.py); lecture seule : « Copier et modifier » pour l'adapter. */
window.QUIZ_LIVRES = [
{
"id": "dep-plomberie-chauffage",
"exemple": true,
"fixe": true,
"auto": 8,
"titre": "DEP Plomberie et chauffage",
"sujet": "Présentation du programme",
"couv": "img/labo/quiz/plomberie/couv.jpg",
"coul": "#EB6A22",
"reg": {
"nb": "tout",
"melange": "non",
"mode": "ind"
},
"qs": [
{
"t": "diapo",
"img": "img/labo/quiz/plomberie/01.jpg",
"q": "",
"s": 0
},
{
"t": "diapo",
"img": "img/labo/quiz/plomberie/02.jpg",
"q": "",
"s": 0
},
{
"t": "diapo",
"img": "img/labo/quiz/plomberie/03.jpg",
"q": "",
"s": 0
},
{
"t": "diapo",
"img": "img/labo/quiz/plomberie/04.jpg",
"q": "",
"s": 0
},
{
"t": "diapo",
"img": "img/labo/quiz/plomberie/05.jpg",
"q": "",
"s": 0
},
{
"t": "diapo",
"img": "img/labo/quiz/plomberie/06.jpg",
"q": "",
"s": 0
},
{
"t": "diapo",
"img": "img/labo/quiz/plomberie/07.jpg?v=2",
"q": "",
"s": 0
},
{
"t": "diapo",
"img": "img/labo/quiz/plomberie/08.jpg",
"q": "",
"s": 0
},
{
"t": "diapo",
"img": "img/labo/quiz/plomberie/09.jpg",
"q": "",
"s": 0
},
{
"t": "diapo",
"img": "img/labo/quiz/plomberie/10.jpg",
"q": "",
"s": 0
},
{
"t": "diapo",
"img": "img/labo/quiz/plomberie/11.jpg",
"q": "",
"s": 0
}
]
},
{
"id": "decouvre-metier-plus",
"exemple": true,
"titre": "Découvre Métier+",
"sujet": "Présentation",
"couv": "img/labo/quiz/demo/couv.jpg",
"coul": "#EB6A22",
"reg": {
"nb": "tout",
"melange": "non",
"mode": "ind",
"temps": "normal",
"penalite": "non",
"cache": "non",
"lettres": "non",
"double": "non"
},
"qs": [
{
"t": "diapo",
"img": "img/labo/quiz/demo/01.jpg?v=2",
"q": "",
"s": 0,
"lg": [
35.16,
36.67,
29.69,
13.89
]
},
{
"t": "diapo",
"img": "img/labo/quiz/demo/02.jpg?v=2",
"q": "",
"s": 0,
"mv": "focus"
},
{
"t": "diapo",
"img": "img/labo/quiz/demo/03.jpg?v=2",
"q": "",
"s": 0,
"mv": "focus"
},
{
"t": "diapo",
"img": "img/labo/quiz/demo/13.jpg?v=2",
"q": "",
"s": 0,
"mv": "focus"
},
{
"t": "connexion",
"q": "",
"s": 0
},
{
"t": "nuage",
"q": "En un mot : qu'est-ce qui te prend le plus de temps à préparer ?",
"ch": [],
"bon": null,
"s": 45
},
{
"t": "diapo",
"img": "img/labo/quiz/demo/04.jpg?v=2",
"q": "",
"s": 0
},
{
"q": "Combien de feuilles de plans techniques sont prêtes dans Métier+ ?",
"ch": [
"12",
"45",
"123",
"300"
],
"bon": 2,
"s": 20,
"expl": "123 feuilles prêtes à projeter, avec questionnaires et corrigés. Fini les plans jaunis photocopiés en 1998."
},
{
"t": "diapo",
"img": "img/labo/quiz/demo/05.jpg?v=2",
"q": "",
"s": 0
},
{
"t": "multi",
"q": "Avec ton cellulaire comme télécommande, tu peux…",
"ch": [
"Tourner les pages du livre",
"Pointer au laser sur le tableau",
"Mener un quiz debout dans la classe",
"Corriger les examens tout seul"
],
"bon": [
0,
1,
2
],
"s": 25,
"expl": "Pages, laser, zoom et quiz : tu enseignes debout, au milieu de ta classe. La correction ? Ça, c'est encore ton travail."
},
{
"t": "diapo",
"img": "img/labo/quiz/demo/06.jpg?v=2",
"q": "",
"s": 0
},
{
"t": "ordre",
"q": "Remets dans l'ordre : ton cours dans Métier+.",
"ch": [
"Je prépare le déroulement de la période",
"J'ouvre l'accueil de classe au tableau",
"J'ouvre le livre au bon moment",
"Les élèves font le ménage de fin de cours"
],
"bon": [
0,
1,
2,
3
],
"s": 35,
"expl": "Tu prépares ta semaine d'avance. Le jour même, tu ouvres et tout est là."
},
{
"t": "diapo",
"img": "img/labo/quiz/demo/07.jpg?v=2",
"q": "",
"s": 0
},
{
"q": "10 plombiers compagnons perdent chacun 10 minutes par jour. Combien ça coûte en un an ?",
"ch": [
"1 800 $",
"7 500 $",
"18 000 $",
"45 000 $"
],
"bon": 2,
"s": 25,
"expl": "100 minutes par jour à 45,36 $ de l'heure (compagnon tuyauteur, résidentiel léger, janvier 2026) : environ 76 $ par jour, donc 18 000 $ par année. Voilà pourquoi on insiste : pas de niaisage pendant le ménage. La solution ? Métier+ affiche le ménage tout seul à la fin du cours : chaque équipe sait quoi faire, et on part quand tout est coché."
},
{
"t": "diapo",
"img": "img/labo/quiz/demo/08.jpg?v=2",
"q": "",
"s": 0
},
{
"q": "Pour jouer à un quiz, chaque élève doit se créer un compte.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Zéro compte, zéro mot de passe oublié. Un code QR et ils jouent en 10 secondes."
},
{
"t": "sondage",
"q": "Qu'est-ce qui t'aiderait le plus en classe ?",
"ch": [
"Les livres animés",
"Les quiz et présentations",
"Les plans techniques",
"L'accueil de classe"
],
"bon": null,
"s": 30
},
{
"t": "diapo",
"img": "img/labo/quiz/demo/09.jpg?v=2",
"q": "",
"s": 0
},
{
"t": "diapo",
"img": "img/labo/quiz/demo/10.jpg?v=2",
"q": "",
"s": 0,
"mv": "focus"
},
{
"t": "diapo",
"img": "img/labo/quiz/demo/11.jpg?v=2",
"q": "",
"s": 0,
"mv": "focus"
},
{
"q": "Depuis combien d'années PowerPoint existe-t-il ?",
"ch": [
"15 ans",
"25 ans",
"39 ans",
"50 ans"
],
"bon": 2,
"s": 20,
"expl": "Lancé en 1987. Il serait peut-être temps de mettre un peu d'action dans vos présentations."
},
{
"q": "Pour transformer ton PowerPoint en présentation Métier+, tu l'enregistres en…",
"ch": [
"Word",
"PDF",
"Image",
"Excel"
],
"bon": 1,
"s": 20,
"expl": "Fichier › Enregistrer sous › PDF, puis tu le glisses dans Métier+. Ton vieux PowerPoint reprend vie."
},
{
"t": "echelle",
"q": "Je me vois utiliser Métier+ dans ma classe.",
"ch": [
"1",
"2",
"3",
"4",
"5"
],
"bon": null,
"s": 20
},
{
"t": "diapo",
"img": "img/labo/quiz/demo/12.jpg?v=2",
"q": "",
"s": 0,
"lg": [
35.16,
32.27,
29.69,
13.89
]
}
],
"fixe": true
},
{
"id": "gestion-atelier",
"exemple": true,
"titre": "Gestion d’atelier : formation des enseignants",
"sujet": "Présentation",
"couv": "img/labo/quiz/gestion/ga-01.jpg?v=1",
"coul": "#EB6A22",
"fixe": true,
"reg": {
"nb": "tout",
"melange": "non",
"mode": "ind",
"temps": "normal",
"penalite": "non",
"cache": "non",
"lettres": "non",
"double": "non"
},
"qs": [
{
"t": "diapo",
"img": "img/labo/quiz/gestion/ga-01.jpg?v=1",
"q": "",
"s": 0
},
{
"t": "echelle",
"q": "Le suivi des outils et des coffres me prend beaucoup de temps. (1 = pas du tout · 5 = énormément)",
"ch": [
"1",
"2",
"3",
"4",
"5"
],
"bon": null,
"s": 20
},
{
"t": "nuage",
"q": "En un mot : ton plus gros casse-tête d’atelier ?",
"ch": [],
"bon": null,
"s": 45
},
{
"t": "diapo",
"img": "img/labo/quiz/gestion/ga-02.jpg?v=1",
"q": "",
"s": 0
},
{
"t": "diapo",
"img": "img/labo/quiz/gestion/ga-03.jpg?v=1",
"q": "",
"s": 0
},
{
"t": "diapo",
"img": "img/labo/quiz/gestion/ga-04.jpg?v=1",
"q": "",
"s": 0
},
{
"t": "diapo",
"img": "img/labo/quiz/gestion/ga-05.jpg?v=1",
"q": "",
"s": 0
},
{
"t": "diapo",
"img": "img/labo/quiz/gestion/ga-06.jpg?v=1",
"q": "",
"s": 0
},
{
"t": "diapo",
"img": "img/labo/quiz/gestion/ga-07.jpg?v=1",
"q": "",
"s": 0
},
{
"t": "diapo",
"img": "img/labo/quiz/gestion/ga-08.jpg?v=1",
"q": "",
"s": 0
},
{
"t": "diapo",
"img": "img/labo/quiz/gestion/ga-09.jpg?v=1",
"q": "",
"s": 0
},
{
"t": "sondage",
"q": "Prêt à l’essayer avec un de tes groupes ?",
"ch": [
"Oui, dès cette semaine",
"Oui, avec un petit groupe d’abord",
"J’ai encore des questions"
],
"bon": null,
"s": 30
},
{
"t": "diapo",
"img": "img/labo/quiz/gestion/ga-10.jpg?v=1",
"q": "",
"s": 0
}
]
},
{
"id": "culture-generale",
"exemple": true,
"titre": "Culture générale",
"sujet": "Géo, politique, arts, sciences et sports",
"couv": "img/labo/quiz/culture-couv.svg",
"coul": "#534AB7",
"reg": {
"nb": "15",
"melange": "tout"
},
"qs": [
{
"q": "Quelle est la capitale du Canada ?",
"ch": [
"Toronto",
"Montréal",
"Ottawa",
"Québec"
],
"bon": 2,
"s": 15,
"expl": "Ottawa, en Ontario, sur la rivière des Outaouais, juste en face de Gatineau."
},
{
"q": "Quel est le plus grand pays du monde en superficie ?",
"ch": [
"Canada",
"Russie",
"Chine",
"États-Unis"
],
"bon": 1,
"s": 20,
"expl": "La Russie. Le Canada arrive 2e, juste devant la Chine et les États-Unis."
},
{
"q": "Place ces provinces de la plus petite à la plus grande.",
"t": "ordre",
"ch": [
"Île-du-Prince-Édouard",
"Nouveau-Brunswick",
"Ontario",
"Québec"
],
"bon": [
0,
1,
2,
3
],
"s": 40,
"expl": "Le Québec est la plus grande province : environ 1,5 million de km², trois fois la France."
},
{
"q": "Lesquelles sont des capitales de province ?",
"t": "multi",
"ch": [
"Halifax",
"Vancouver",
"Regina",
"Calgary"
],
"bon": [
0,
2
],
"s": 30,
"expl": "Halifax (N.-É.) et Regina (Sask.). Les capitales de la C.-B. et de l'Alberta sont Victoria et Edmonton."
},
{
"q": "Combien y a-t-il de provinces au Canada ?",
"t": "nombre",
"ch": [],
"bon": 10,
"tol": 0,
"u": "provinces",
"s": 25,
"expl": "10 provinces et 3 territoires (Yukon, Territoires du Nord-Ouest, Nunavut)."
},
{
"q": "Le mont Everest est la plus haute montagne du monde.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15,
"expl": "Vrai : environ 8 849 m au-dessus du niveau de la mer, entre le Népal et la Chine."
},
{
"q": "Quel fleuve passe à Montréal et à Québec ?",
"ch": [
"Le fleuve Saint-Laurent",
"La rivière Richelieu",
"Le fleuve Mississippi",
"La rivière Saguenay"
],
"bon": 0,
"s": 15,
"expl": "Le Saint-Laurent relie les Grands Lacs à l'océan Atlantique."
},
{
"q": "Combien de députés siègent à l'Assemblée nationale du Québec ?",
"t": "nombre",
"ch": [],
"bon": 125,
"tol": 0,
"u": "députés",
"s": 30,
"expl": "125 circonscriptions, donc 125 députés."
},
{
"q": "Au Canada, qui est le chef de l'État ?",
"ch": [
"Le premier ministre",
"Le monarque (le roi)",
"Le gouverneur général",
"Le président du Sénat"
],
"bon": 1,
"s": 20,
"expl": "Le Canada est une monarchie constitutionnelle : le roi est chef de l'État, le premier ministre dirige le gouvernement."
},
{
"q": "Trouve l'erreur dans cette phrase.",
"t": "erreur",
"ch": [
"Au Québec, les élections générales",
"ont lieu à date fixe,",
"tous les cinq ans,",
"au mois d'octobre."
],
"bon": 2,
"s": 30,
"expl": "C'est tous les quatre ans : le premier lundi d'octobre."
},
{
"q": "À quel âge peut-on voter aux élections au Québec ?",
"ch": [
"16 ans",
"18 ans",
"19 ans",
"21 ans"
],
"bon": 1,
"s": 15,
"expl": "18 ans, et il faut être citoyen canadien."
},
{
"q": "Qui était le premier ministre du Canada à la Confédération, en 1867 ?",
"ch": [
"Wilfrid Laurier",
"John A. Macdonald",
"George-Étienne Cartier",
"Pierre Elliott Trudeau"
],
"bon": 1,
"s": 20,
"expl": "John A. Macdonald. George-Étienne Cartier était un des Pères de la Confédération."
},
{
"q": "Le Parlement du Canada compte combien de chambres ?",
"ch": [
"Une",
"Deux",
"Trois",
"Quatre"
],
"bon": 1,
"s": 20,
"expl": "Deux : la Chambre des communes (élue) et le Sénat (nommé)."
},
{
"q": "Qui a peint La Joconde ?",
"ch": [
"Michel-Ange",
"Léonard de Vinci",
"Pablo Picasso",
"Vincent van Gogh"
],
"bon": 1,
"s": 15,
"expl": "Léonard de Vinci, au début des années 1500. Elle est au Louvre, à Paris."
},
{
"q": "Dans quelle ville du Québec est née Céline Dion ?",
"ch": [
"Laval",
"Charlemagne",
"Trois-Rivières",
"Sherbrooke"
],
"bon": 1,
"s": 20,
"expl": "Charlemagne, dans Lanaudière, en 1968. Elle était la cadette de 14 enfants !"
},
{
"q": "Le Cirque du Soleil a été fondé en…",
"ch": [
"France",
"Belgique",
"États-Unis",
"Québec"
],
"bon": 3,
"s": 15,
"expl": "À Baie-Saint-Paul, dans Charlevoix, en 1984."
},
{
"q": "Place ces constructions de la plus ancienne à la plus récente.",
"t": "ordre",
"ch": [
"Pyramides de Gizeh",
"Colisée de Rome",
"Tour Eiffel",
"Stade olympique de Montréal"
],
"bon": [
0,
1,
2,
3
],
"s": 40,
"expl": "Environ 2500 av. J.-C., 80 apr. J.-C., 1889, puis 1976 pour les Jeux de Montréal."
},
{
"q": "Lesquels sont des instruments à vent ?",
"t": "multi",
"ch": [
"Trompette",
"Violon",
"Flûte",
"Saxophone"
],
"bon": [
0,
2,
3
],
"s": 30,
"expl": "Le violon est un instrument à cordes. Le saxophone est en métal, mais c'est quand même un bois : il a une anche !"
},
{
"q": "Qui a écrit Les Misérables ?",
"ch": [
"Victor Hugo",
"Molière",
"Jules Verne",
"Émile Zola"
],
"bon": 0,
"s": 20,
"expl": "Victor Hugo, en 1862. Jean Valjean, Cosette, Javert…"
},
{
"q": "Qui a composé la musique de l'Ô Canada ?",
"ch": [
"Félix Leclerc",
"Calixa Lavallée",
"Gilles Vigneault",
"Oscar Peterson"
],
"bon": 1,
"s": 25,
"expl": "Calixa Lavallée, en 1880, pour la Saint-Jean-Baptiste. Les paroles françaises sont d'Adolphe-Basile Routhier."
},
{
"q": "Quelle planète est la plus proche du Soleil ?",
"ch": [
"Vénus",
"Mars",
"Mercure",
"La Terre"
],
"bon": 2,
"s": 15,
"expl": "Mercure. Vénus est pourtant la plus chaude, à cause de son atmosphère épaisse."
},
{
"q": "Trouve l'erreur dans cette phrase.",
"t": "erreur",
"ch": [
"La Terre fait le tour",
"du Soleil",
"en environ 24 heures."
],
"bon": 2,
"s": 25,
"expl": "Le tour du Soleil prend environ 365 jours. En 24 heures, la Terre tourne sur elle-même."
},
{
"q": "Combien d'os compte le squelette d'un adulte ?",
"t": "nombre",
"ch": [],
"bon": 206,
"tol": 0,
"u": "os",
"s": 30,
"expl": "206. Un bébé en a environ 300 : plusieurs se soudent en grandissant."
},
{
"q": "Quel est le symbole chimique de l'or ?",
"ch": [
"Or",
"Au",
"Ag",
"Go"
],
"bon": 1,
"s": 20,
"expl": "Au, du latin aurum. Ag, c'est l'argent."
},
{
"q": "Au niveau de la mer, l'eau bout à 100 °C.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15,
"expl": "Vrai. En montagne, elle bout plus bas : la pression de l'air est plus faible."
},
{
"q": "Qui est reconnu comme l'inventeur du téléphone ?",
"ch": [
"Thomas Edison",
"Alexander Graham Bell",
"Nikola Tesla",
"Guglielmo Marconi"
],
"bon": 1,
"s": 20,
"expl": "Alexander Graham Bell, en 1876. Il a fait plusieurs essais à Brantford, en Ontario."
},
{
"q": "Combien de coupes Stanley les Canadiens de Montréal ont-ils gagnées ?",
"t": "nombre",
"ch": [],
"bon": 24,
"tol": 0,
"u": "coupes",
"s": 30,
"expl": "24, un record. La dernière date de 1993."
},
{
"q": "Au hockey, combien de joueurs par équipe sont sur la glace (gardien compris) ?",
"ch": [
"5",
"6",
"7",
"11"
],
"bon": 1,
"s": 15,
"expl": "6 : un gardien, deux défenseurs et trois attaquants."
},
{
"q": "Montréal a accueilli les Jeux olympiques d'été en…",
"ch": [
"1967",
"1976",
"1980",
"1988"
],
"bon": 1,
"s": 20,
"expl": "1976. En 1967, c'était l'Expo 67. Calgary a eu les Jeux d'hiver en 1988."
},
{
"q": "La tour Eiffel se trouve à Londres.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 10,
"expl": "Faux ! Elle est à Paris. À Londres, on a Big Ben et le London Eye."
}
]
},
{
"id": "transformateurs",
"exemple": true,
"titre": "Les transformateurs",
"sujet": "Primaire, secondaire, 24 V et sécurité",
"couv": "img/labo/quiz/transfo-couv.svg",
"coul": "#E0892B",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "À quoi sert un transformateur ?",
"ch": [
"Changer la tension (monter ou baisser les volts)",
"Changer le courant alternatif en continu",
"Emmagasiner l'électricité",
"Couper le courant en cas de court-circuit"
],
"bon": 0,
"s": 20,
"expl": "Il monte ou baisse la tension. Il ne fait pas de courant continu et n'emmagasine rien."
},
{
"q": "Un transformateur fonctionne seulement en courant alternatif (AC).",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15,
"expl": "Vrai. Il a besoin d'un courant qui change sans arrêt. Sur une pile (courant continu), il ne fait rien et peut chauffer."
},
{
"q": "Le côté où ARRIVE l'alimentation s'appelle…",
"ch": [
"Le primaire",
"Le secondaire",
"Le neutre",
"La mise à la terre"
],
"bon": 0,
"s": 20,
"expl": "Primaire = entrée. Secondaire = sortie, vers la charge."
},
{
"q": "Le côté qui ALIMENTE la charge (thermostat, sonnette…) s'appelle…",
"ch": [
"Le secondaire",
"Le primaire",
"Le noyau",
"Le fusible"
],
"bon": 0,
"s": 20,
"expl": "Secondaire = sortie."
},
{
"q": "Un transformateur abaisseur…",
"ch": [
"Donne moins de volts au secondaire qu'au primaire",
"Donne plus de volts au secondaire",
"Donne la même tension",
"Transforme les volts en watts"
],
"bon": 0,
"s": 20,
"expl": "Abaisseur = il baisse la tension, par exemple 120 V vers 24 V."
},
{
"q": "Un transformateur élévateur…",
"ch": [
"Donne plus de volts au secondaire qu'au primaire",
"Donne moins de volts au secondaire",
"Fonctionne seulement sur les piles",
"Sert seulement dans les sonnettes"
],
"bon": 0,
"s": 20,
"expl": "Élévateur = il monte la tension."
},
{
"q": "Le noyau d'un transformateur est fait de…",
"ch": [
"Minces tôles d'acier collées ensemble",
"Plastique",
"Cuivre plein",
"Bois traité"
],
"bon": 0,
"s": 20,
"expl": "Des tôles d'acier minces (feuilletées) : elles guident le magnétisme et chauffent moins qu'un bloc plein."
},
{
"q": "Les enroulements (bobines) sont faits de…",
"ch": [
"Fil de cuivre isolé (vernis)",
"Fil d'acier nu",
"Tuyau de cuivre",
"Fil de nylon"
],
"bon": 0,
"s": 20,
"expl": "Du fil de cuivre (parfois d'aluminium) recouvert d'un vernis isolant."
},
{
"q": "Le primaire et le secondaire sont branchés ensemble par un fil.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Faux. Il n'y a aucun fil entre les deux : l'énergie passe par le magnétisme dans le noyau. C'est pour ça qu'on dit qu'ils sont isolés."
},
{
"q": "Quelle tension trouve-t-on souvent au secondaire du transformateur d'un thermostat de chauffage ou de climatisation ?",
"ch": [
"24 V",
"120 V",
"240 V",
"600 V"
],
"bon": 0,
"s": 20,
"expl": "24 V : la basse tension de commande des thermostats, chaudières et fournaises."
},
{
"q": "Sur la plaque d'un transformateur, les bornes H1 et H2 sont du côté…",
"ch": [
"Haute tension (primaire)",
"Basse tension (secondaire)",
"Mise à la terre",
"Fusible"
],
"bon": 0,
"s": 20,
"expl": "H = haute tension. X1 et X2 = basse tension."
},
{
"q": "Les bornes X1 et X2 sont du côté…",
"ch": [
"Basse tension (secondaire)",
"Haute tension (primaire)",
"Neutre seulement",
"Noyau"
],
"bon": 0,
"s": 20,
"expl": "X = basse tension, donc le côté de la charge pour un abaisseur."
},
{
"q": "La grosseur (capacité) d'un transformateur est indiquée en…",
"ch": [
"VA (volts-ampères)",
"Ohms",
"Litres",
"Degrés"
],
"bon": 0,
"s": 20,
"expl": "En VA, par exemple 40 VA pour un transformateur de commande. Plus il y a de VA, plus il peut alimenter de choses."
},
{
"q": "Si on branche trop de charges au secondaire, le transformateur peut chauffer et brûler.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15,
"expl": "Vrai. Il ne faut pas dépasser ses VA. Un fusible ou un disjoncteur au secondaire le protège souvent."
},
{
"q": "Le petit bourdonnement d'un transformateur vient…",
"ch": [
"Des vibrations du noyau à 60 Hz",
"D'une fuite d'eau",
"D'un fil débranché, toujours",
"De l'air dans les tuyaux"
],
"bon": 0,
"s": 20,
"expl": "Normal : le noyau vibre un peu avec le courant alternatif à 60 Hz. Un bruit fort ou une odeur de brûlé, par contre, n'est pas normal."
},
{
"q": "Le gros transformateur sur le poteau, devant la maison, sert à…",
"ch": [
"Baisser la haute tension du réseau à 120/240 V pour la maison",
"Monter la tension pour la maison",
"Mesurer la consommation",
"Changer l'alternatif en continu"
],
"bon": 0,
"s": 20,
"expl": "Il baisse la haute tension d'Hydro à 120/240 V pour le panneau de la maison."
},
{
"q": "Pour vérifier la sortie d'un transformateur de 24 V avec un multimètre, tu choisis…",
"ch": [
"V~ (tension alternative)",
"V⎓ (tension continue)",
"Ω (ohms)",
"A (ampères)"
],
"bon": 0,
"s": 20,
"expl": "La sortie d'un transformateur est en alternatif, donc V~."
},
{
"t": "multi",
"q": "Avant de remplacer un transformateur, tu dois…",
"ch": [
"Couper le disjoncteur et cadenasser",
"Vérifier l'absence de tension",
"Noter où va chaque fil (photo)",
"Le tester en touchant les bornes avec les doigts"
],
"bon": [
0,
1,
2
],
"s": 25,
"expl": "Couper, cadenasser, vérifier l'absence de tension et noter le branchement. Jamais toucher les bornes."
},
{
"q": "Un transformateur crée de l'énergie : il donne plus de puissance qu'il en reçoit.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Faux. Il change la tension, mais la puissance qui sort est un peu plus petite que celle qui entre (un peu de perte en chaleur)."
},
{
"q": "Une sonnette de porte est souvent alimentée par…",
"ch": [
"Un petit transformateur abaisseur (environ 16 V)",
"Directement en 240 V",
"Une batterie d'auto",
"Un transformateur élévateur"
],
"bon": 0,
"s": 20,
"expl": "Un petit transformateur abaisse le 120 V à une basse tension, souvent autour de 16 V, plus sécuritaire."
}
]
},
{
"id": "electricite-base",
"exemple": true,
"titre": "L'électricité de base",
"sujet": "Volts, ampères, ohms, circuits et sécurité",
"couv": "img/labo/quiz/electricite-couv.jpg",
"coul": "#2F7DE1",
"reg": {
"nb": "15",
"melange": "tout"
},
"qs": [
{
"q": "Un multimètre sert à mesurer…",
"ch": [
"Volts, ampères et ohms (et plus)",
"Seulement les volts",
"Seulement la température",
"La pression d'eau"
],
"bon": 0,
"s": 15,
"expl": "Multi = plusieurs : tension (V), courant (A), résistance (Ω), continuité, et parfois d'autres fonctions."
},
{
"q": "Sur un multimètre, la sonde NOIRE se branche dans la borne…",
"ch": [
"COM",
"V Ω",
"10 A",
"mA"
],
"bon": 0,
"s": 15,
"expl": "Noir = COM (commun), toujours. Le rouge change de borne selon ce qu'on mesure."
},
{
"q": "Pour mesurer une tension, la sonde ROUGE va dans la borne…",
"ch": [
"V Ω (volts / ohms)",
"10 A",
"COM",
"Aucune, on utilise seulement le noir"
],
"bon": 0,
"s": 20,
"expl": "Rouge dans V Ω pour les volts, les ohms et la continuité. La borne A sert seulement aux ampères."
},
{
"q": "Le symbole V~ (avec une vague) sur le sélecteur veut dire…",
"ch": [
"Tension alternative (AC)",
"Tension continue (DC)",
"Résistance",
"Continuité"
],
"bon": 0,
"s": 15,
"expl": "La vague ~ = alternatif (prises, 120/240 V). La ligne droite ⎓ = continu (piles, batteries)."
},
{
"q": "Le symbole V⎓ (lignes droites) sert à mesurer…",
"ch": [
"Une pile ou une batterie",
"Une prise de 120 V",
"Un élément chauffant hors tension",
"Le courant d'un fil"
],
"bon": 0,
"s": 15,
"expl": "V⎓ = tension continue (DC) : piles, batteries d'auto, alimentations électroniques."
},
{
"q": "Pour mesurer une tension, on place les sondes…",
"ch": [
"En parallèle (de chaque côté de l'appareil ou de la source)",
"En série (on coupe le fil)",
"Sur le même fil",
"Seulement sur la mise à la terre"
],
"bon": 0,
"s": 20,
"expl": "Les volts se mesurent entre deux points : une sonde de chaque côté, sans couper le circuit."
},
{
"q": "Pour mesurer des ampères avec les sondes (pas une pince), le multimètre doit être…",
"ch": [
"En série dans le circuit (le courant passe dans l'appareil)",
"En parallèle sur la charge",
"Sur la borne V Ω",
"Hors tension"
],
"bon": 0,
"s": 25,
"expl": "Les ampères se mesurent en série : il faut ouvrir le circuit. C'est pourquoi la pince ampèremétrique est plus simple et plus sécuritaire."
},
{
"q": "Sur l'écran du multimètre, « OL » veut dire…",
"ch": [
"Hors plage / circuit ouvert (trop grand pour être mesuré)",
"Tout est correct",
"La pile est faible",
"Courant alternatif"
],
"bon": 0,
"s": 20,
"expl": "OL = Over Limit. En ohms, ça veut dire circuit ouvert (fil coupé, fusible brûlé)."
},
{
"q": "L'icône avec des ondes sonores (♪ ou •)))) sur le sélecteur, c'est…",
"ch": [
"Le mode continuité : il bipe si le circuit est fermé",
"Le volume du multimètre",
"Le mode Bluetooth",
"Le test de pile"
],
"bon": 0,
"s": 20,
"expl": "Mode continuité : le multimètre bipe quand il y a un chemin complet. Toujours sur un circuit hors tension."
},
{
"q": "Le bouton HOLD sert à…",
"ch": [
"Figer la valeur affichée à l'écran",
"Allumer l'écran",
"Changer de mode AC/DC",
"Remettre à zéro"
],
"bon": 0,
"s": 15,
"expl": "HOLD garde la lecture à l'écran : pratique quand on mesure dans un endroit où on ne voit pas l'afficheur."
},
{
"q": "On peut mesurer des ohms sur un circuit sous tension si on fait attention.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Faux ! Toujours couper le courant avant de mesurer des ohms : lecture fausse et risque d'endommager l'appareil."
},
{
"q": "Avant de mesurer, il faut d'abord…",
"ch": [
"Choisir la bonne fonction au sélecteur",
"Toucher les deux sondes ensemble pendant la mesure",
"Débrancher la sonde noire",
"Mettre le sélecteur sur OFF"
],
"bon": 0,
"s": 15,
"expl": "Bonne fonction (V~, V⎓, Ω…), bonnes bornes, puis on mesure. Une mauvaise position peut faire sauter le fusible interne."
},
{
"q": "La tension électrique se mesure en…",
"ch": [
"Volts (V)",
"Ampères (A)",
"Ohms (Ω)",
"Watts (W)"
],
"bon": 0,
"s": 15,
"expl": "Tension = volts. Courant = ampères. Résistance = ohms. Puissance = watts."
},
{
"q": "Le courant électrique se mesure en…",
"ch": [
"Ampères (A)",
"Volts (V)",
"Ohms (Ω)",
"Hertz (Hz)"
],
"bon": 0,
"s": 15,
"expl": "Le courant, c'est la quantité d'électricité qui circule : en ampères."
},
{
"q": "La résistance se mesure en…",
"ch": [
"Ohms (Ω)",
"Watts (W)",
"Volts (V)",
"Ampères (A)"
],
"bon": 0,
"s": 15,
"expl": "La résistance freine le courant. Elle se mesure en ohms (Ω)."
},
{
"q": "Si on compare l'électricité à l'eau dans un tuyau, la tension (volts) ressemble à…",
"ch": [
"La pression",
"Le débit",
"La longueur du tuyau",
"La couleur de l'eau"
],
"bon": 0,
"s": 20,
"expl": "Tension = pression qui pousse. Courant = débit. Résistance = un tuyau étroit qui freine."
},
{
"q": "Et le courant (ampères) ressemble à…",
"ch": [
"Le débit d'eau",
"La pression",
"Le diamètre du robinet",
"La température"
],
"bon": 0,
"s": 20,
"expl": "Le courant, c'est combien d'électricité passe chaque seconde, comme un débit en litres par minute."
},
{
"q": "Le courant d'une prise de maison est…",
"ch": [
"Alternatif (AC)",
"Continu (DC)",
"Statique",
"Ça dépend de la pièce"
],
"bon": 0,
"s": 15,
"expl": "Les prises donnent du courant alternatif à 60 Hz. Les piles et batteries donnent du continu."
},
{
"q": "Une pile de 9 V donne du courant…",
"ch": [
"Continu (DC)",
"Alternatif (AC)",
"Triphasé",
"À 60 Hz"
],
"bon": 0,
"s": 15,
"expl": "Piles et batteries = courant continu : il circule toujours dans le même sens."
},
{
"q": "Le cuivre est un bon conducteur.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 10,
"expl": "Vrai : le cuivre laisse passer facilement le courant. C'est pourquoi les fils sont en cuivre."
},
{
"q": "Lequel de ces matériaux est un isolant ?",
"ch": [
"Le caoutchouc",
"Le cuivre",
"L'aluminium",
"L'eau du robinet"
],
"bon": 0,
"s": 15,
"expl": "Le caoutchouc, le plastique, le verre et le bois sec sont des isolants. L'eau du robinet conduit le courant."
},
{
"q": "L'eau pure du robinet ne conduit pas l'électricité, donc on peut toucher un appareil branché les mains mouillées.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Faux ! L'eau du robinet contient des minéraux et conduit le courant. Mains mouillées = danger."
},
{
"q": "Pour qu'une ampoule s'allume, le circuit doit être…",
"ch": [
"Fermé",
"Ouvert",
"Coupé au milieu",
"Sans source"
],
"bon": 0,
"s": 15,
"expl": "Le courant doit pouvoir faire un tour complet : de la source, à travers l'ampoule, et retour."
},
{
"q": "Un interrupteur ouvert…",
"ch": [
"Coupe le courant",
"Laisse passer le courant",
"Augmente la tension",
"Protège contre la foudre"
],
"bon": 0,
"s": 15,
"expl": "Ouvert = le chemin est coupé, la lumière est éteinte. Fermé = le courant passe."
},
{
"t": "ordre",
"q": "Remets dans l'ordre le chemin du courant dans un circuit simple d'une lampe.",
"ch": [
"Le disjoncteur du panneau",
"L'interrupteur",
"La lampe",
"Le retour par le neutre"
],
"s": 40,
"expl": "Le courant part du panneau (disjoncteur), passe par l'interrupteur, allume la lampe et revient par le neutre."
},
{
"q": "Dans un montage en série de 3 lumières, si une ampoule brûle…",
"ch": [
"Toutes s'éteignent",
"Seulement celle-là s'éteint",
"Les autres éclairent plus fort",
"Rien ne change"
],
"bon": 0,
"s": 20,
"expl": "En série, il n'y a qu'un chemin : une ampoule coupée ouvre tout le circuit."
},
{
"q": "Les prises d'une maison sont branchées…",
"ch": [
"En parallèle",
"En série",
"En étoile",
"Une seule par circuit"
],
"bon": 0,
"s": 20,
"expl": "En parallèle, chaque prise reçoit 120 V et fonctionne même si une autre est vide."
},
{
"q": "Un court-circuit, c'est…",
"ch": [
"Le courant qui passe par un chemin sans résistance (ex. : phase touche le neutre)",
"Un fil trop long",
"Une ampoule brûlée",
"Un interrupteur ouvert"
],
"bon": 0,
"s": 20,
"expl": "Sans résistance, le courant devient énorme : le disjoncteur doit couper tout de suite."
},
{
"q": "Une prise ordinaire au Québec donne environ…",
"ch": [
"120 V",
"240 V",
"12 V",
"600 V"
],
"bon": 0,
"s": 15,
"expl": "Prise ordinaire = 120 V. Sécheuse, cuisinière, chauffe-eau = 240 V."
},
{
"q": "Un chauffe-eau électrique résidentiel fonctionne habituellement à…",
"ch": [
"240 V",
"120 V",
"24 V",
"12 V"
],
"bon": 0,
"s": 15,
"expl": "Le chauffe-eau est branché entre les deux phases : 240 V."
},
{
"q": "Un thermostat de chaudière (bas voltage) fonctionne souvent à…",
"ch": [
"24 V AC",
"120 V AC",
"240 V AC",
"9 V DC"
],
"bon": 0,
"s": 20,
"expl": "Les commandes de chauffage utilisent souvent 24 V AC, donné par un petit transformateur."
},
{
"q": "Le fil de mise à la terre est…",
"ch": [
"Vert ou nu",
"Blanc",
"Noir",
"Rouge"
],
"bon": 0,
"s": 15,
"expl": "Terre = vert ou cuivre nu. Neutre = blanc. Phases = noir et rouge."
},
{
"q": "À quoi sert la mise à la terre ?",
"ch": [
"Donner un chemin sûr au courant en cas de défaut",
"Faire fonctionner l'appareil",
"Augmenter la tension",
"Économiser de l'électricité"
],
"bon": 0,
"s": 20,
"expl": "Si une phase touche le boîtier, le courant part à la terre et le disjoncteur coupe, au lieu de passer par toi."
},
{
"q": "Une prise DDFT (avec boutons TEST et RESET) sert surtout à…",
"ch": [
"Protéger les personnes contre les chocs près de l'eau",
"Protéger le fil contre la surchauffe",
"Économiser l'énergie",
"Augmenter la puissance"
],
"bon": 0,
"s": 20,
"expl": "Le DDFT coupe dès qu'une petite fuite de courant est détectée (ex. : dans l'eau). On le trouve dans la salle de bain, la cuisine, dehors."
},
{
"q": "Le disjoncteur saute toujours sur le même circuit quand on branche la bouilloire et le four micro-ondes. La cause probable ?",
"ch": [
"Le circuit est surchargé",
"Le disjoncteur est trop gros",
"Il manque une ampoule",
"La tension est trop basse"
],
"bon": 0,
"s": 25,
"expl": "Deux gros appareils sur le même circuit demandent trop d'ampères : le disjoncteur protège le fil."
},
{
"q": "Remplacer un disjoncteur de 15 A par un de 30 A règle le problème sans danger.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 20,
"expl": "Faux ! Le fil d'un circuit de 15 A n'est pas fait pour 30 A : il chaufferait et pourrait causer un incendie."
},
{
"q": "La loi d'Ohm s'écrit…",
"ch": [
"V = R × I",
"V = R ÷ I",
"I = V × R",
"R = V × I"
],
"bon": 0,
"s": 20,
"expl": "Tension = résistance × courant. Donc I = V ÷ R et R = V ÷ I."
},
{
"t": "nombre",
"q": "Un élément de 24 Ω est branché sur 240 V. Quel courant circule ?",
"ch": [],
"bon": 10,
"tol": 0,
"u": "A",
"s": 30,
"expl": "I = V ÷ R = 240 ÷ 24 = 10 A."
},
{
"t": "nombre",
"q": "Une ampoule de 60 W à 120 V. Quel courant consomme-t-elle ? (au dixième)",
"ch": [],
"bon": 0.5,
"tol": 0,
"u": "A",
"s": 30,
"expl": "I = P ÷ V = 60 ÷ 120 = 0,5 A."
},
{
"t": "nombre",
"q": "Un chauffe-eau de 3000 W à 240 V. Quel courant ? (au dixième)",
"ch": [],
"bon": 12.5,
"tol": 0,
"u": "A",
"s": 30,
"expl": "I = P ÷ V = 3000 ÷ 240 = 12,5 A."
},
{
"q": "Une plinthe consomme 5 A à 240 V. Quelle est sa puissance ?",
"ch": [
"1200 W",
"48 W",
"245 W",
"2400 W"
],
"bon": 0,
"s": 25,
"expl": "P = V × I = 240 × 5 = 1200 W."
},
{
"t": "nombre",
"q": "Trois résistances de 10 Ω en série. Résistance totale ?",
"ch": [],
"bon": 30,
"tol": 0,
"u": "Ω",
"s": 20,
"expl": "En série, on additionne : 10 + 10 + 10 = 30 Ω."
},
{
"q": "Si la résistance augmente et que la tension reste pareille, le courant…",
"ch": [
"Diminue",
"Augmente",
"Reste pareil",
"Devient alternatif"
],
"bon": 0,
"s": 20,
"expl": "I = V ÷ R : plus la résistance est grande, moins le courant passe."
},
{
"q": "1 kW, c'est…",
"ch": [
"1000 W",
"100 W",
"10 W",
"1 000 000 W"
],
"bon": 0,
"s": 10,
"expl": "Kilo = mille. Un chauffe-eau de 4,5 kW = 4500 W."
},
{
"t": "erreur",
"q": "Trouve l'erreur.",
"ch": [
"La puissance se mesure en watts,",
"elle se calcule P = V × I,",
"et un appareil de 1200 W à 120 V",
"consomme 100 A."
],
"bon": 3,
"s": 30,
"expl": "I = P ÷ V = 1200 ÷ 120 = 10 A, pas 100 A."
},
{
"t": "multi",
"q": "Avant de travailler sur un circuit, il faut…",
"ch": [
"Couper le disjoncteur",
"Vérifier l'absence de tension avec un appareil",
"Mettre un cadenas ou une étiquette si possible",
"Toucher le fil pour voir s'il est mort"
],
"bon": [
0,
1,
2
],
"s": 35,
"expl": "Couper, cadenasser, vérifier avec un appareil. On ne touche jamais un fil pour « tester »."
},
{
"q": "Le corps humain peut être blessé gravement par un courant aussi faible que…",
"ch": [
"Environ 0,05 A (50 mA)",
"100 A",
"1000 A",
"Seulement à haute tension"
],
"bon": 0,
"s": 25,
"expl": "Quelques dizaines de milliampères à travers le cœur peuvent être mortels. C'est pourquoi le DDFT coupe à environ 5 mA."
},
{
"q": "Un fil dont la gaine est fondue ou noircie indique probablement…",
"ch": [
"Une surchauffe (mauvaise connexion ou surcharge)",
"Un fil neuf",
"Un bon fonctionnement",
"De l'humidité normale"
],
"bon": 0,
"s": 20,
"expl": "La chaleur vient souvent d'une connexion lâche ou d'un circuit trop chargé. À réparer avant de remettre en marche."
}
]
},
{
"id": "multimetre-fluke-302",
"exemple": true,
"titre": "Le multimètre (Fluke 302+)",
"sujet": "Ampères, volts AC/DC, ohms et continuité",
"couv": "img/labo/quiz/multimetre-couv.jpg",
"coul": "#E8B400",
"reg": {
"nb": "15",
"melange": "tout"
},
"qs": [
{
"q": "La pince Fluke 302+ mesure le courant (ampères) de quelle façon ?",
"ch": [
"Avec les mâchoires refermées autour d'un fil",
"Avec les sondes branchées en série",
"Avec les sondes branchées en parallèle",
"Dans la borne COM et la borne A"
],
"bon": 0,
"s": 20,
"expl": "La 302+ mesure le courant alternatif seulement avec ses mâchoires, jusqu'à 400 A. Pas besoin d'ouvrir le circuit."
},
{
"q": "La Fluke 302+ peut mesurer le courant continu (A DC) avec ses mâchoires.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Faux : la 302+ mesure seulement le courant alternatif (A~), jusqu'à 400 A. Pour le DC en ampères, il faut un autre modèle."
},
{
"q": "Quel est le courant maximal que la Fluke 302+ peut mesurer ?",
"ch": [
"40 A",
"400 A",
"600 A",
"1000 A"
],
"bon": 1,
"s": 15,
"expl": "400,0 A en courant alternatif. Les modèles 303 et 305 montent plus haut."
},
{
"q": "Quelle tension maximale la Fluke 302+ peut-elle mesurer (AC ou DC) ?",
"ch": [
"120 V",
"240 V",
"600 V",
"1000 V"
],
"bon": 2,
"s": 15,
"expl": "600 V en AC comme en DC. Elle est classée CAT III 600 V / CAT IV 300 V."
},
{
"q": "Ta lecture d'ohms affiche « OL ». Ça veut dire…",
"ch": [
"Le circuit est ouvert ou la résistance dépasse la plage (4000 Ω sur la 302+)",
"La pile est faible",
"Il y a un court-circuit",
"Il reste de la tension dans le circuit"
],
"bon": 0,
"s": 20,
"expl": "OL = « overload » : résistance trop grande pour la plage, ou circuit ouvert (fil coupé, fusible brûlé)."
},
{
"t": "nombre",
"q": "Le mode continuité de la Fluke 302+ émet un bip quand la résistance est égale ou inférieure à combien d'ohms ?",
"ch": [],
"bon": 70,
"tol": 0,
"u": "Ω",
"s": 25,
"expl": "Bip à 70 Ω ou moins. Sous ce seuil, le chemin est considéré comme continu."
},
{
"q": "Tu veux lire une valeur et la garder à l'écran après avoir retiré la pince d'un endroit difficile. Quel bouton ?",
"ch": [
"HOLD (gel de la lecture)",
"Le rétroéclairage",
"Le sélecteur à OFF",
"Il faut prendre une photo"
],
"bon": 0,
"s": 15,
"expl": "Le bouton HOLD fige la dernière lecture à l'écran."
},
{
"q": "Mise en situation : tu refermes la pince autour du cordon complet d'un aspirateur en marche (les deux fils dans la mâchoire). La lecture…",
"ch": [
"Est près de 0 A",
"Est le double du vrai courant",
"Est exacte",
"Affiche OL"
],
"bon": 0,
"img": "img/labo/quiz/multimetre/cordon.jpg",
"s": 25,
"expl": "Le courant aller et le courant retour s'annulent. Il faut entourer un seul conducteur (ou utiliser un séparateur de cordon)."
},
{
"q": "Mise en situation : une plinthe électrique de 2000 W sur 240 V. Quel courant devrais-tu lire avec la pince ?",
"ch": [
"Environ 4,2 A",
"Environ 8,3 A",
"Environ 16,7 A",
"Environ 24 A"
],
"bon": 1,
"s": 30,
"expl": "I = P ÷ V = 2000 ÷ 240 ≈ 8,3 A."
},
{
"t": "nombre",
"q": "Un élément de chauffe-eau de 4500 W fonctionne à 240 V. Quel courant la pince devrait-elle indiquer ? (au dixième)",
"ch": [],
"bon": 18.8,
"tol": 0.2,
"u": "A",
"s": 35,
"expl": "I = 4500 ÷ 240 = 18,75 A, donc environ 18,8 A."
},
{
"q": "Mise en situation : le disjoncteur d'un circuit de 15 A saute souvent. Avec la pince sur le fil de phase, tu lis 17 A. Conclusion ?",
"ch": [
"Le circuit est surchargé",
"Le disjoncteur est trop gros",
"Le neutre est coupé",
"La pince est déréglée"
],
"bon": 0,
"s": 25,
"expl": "17 A dépasse 15 A : trop d'appareils sur ce circuit. Le disjoncteur fait son travail."
},
{
"q": "Tu vérifies une prise de courant ordinaire. Sur quelle position mets-tu le sélecteur ?",
"ch": [
"V~ (tension alternative)",
"V⎓ (tension continue)",
"Ω",
"A~"
],
"bon": 0,
"s": 15,
"expl": "Le réseau d'Hydro-Québec est en courant alternatif : V~."
},
{
"q": "Œil de lynx : un collègue veut mesurer la tension de cette batterie de 12 V. Qu'est-ce qui cloche ?",
"ch": [
"Les deux sondes touchent la même borne (+) : il lira 0 V",
"Les sondes sont inversées",
"Il faut mesurer en ampères",
"Il faut enlever la batterie du véhicule"
],
"bon": 0,
"s": 30,
"img": "img/labo/quiz/multimetre/batterie.jpg",
"expl": "Pour lire une tension, une sonde va sur chaque borne : rouge sur le +, noire sur le −. Sur la même borne, la différence de potentiel est 0 V."
},
{
"q": "Tu mesures une batterie de 12 V. Sur quelle position mets-tu le sélecteur ?",
"ch": [
"V~",
"V⎓ (tension continue)",
"A~",
"Ω avec bip"
],
"bon": 1,
"s": 15,
"expl": "Une batterie donne du courant continu : V⎓ (ligne droite et pointillé)."
},
{
"q": "Mise en situation : le transformateur d'un thermostat donne 24 V au secondaire. Quel mode utilises-tu ?",
"ch": [
"V~",
"V⎓",
"Ω",
"A~"
],
"bon": 0,
"s": 20,
"expl": "Un transformateur ne fonctionne qu'en alternatif : son secondaire de 24 V est en AC."
},
{
"q": "Mise en situation : tu mesures une batterie de 12 V, mais le sélecteur est resté sur V~. Que risques-tu de lire ?",
"ch": [
"Une valeur fausse, souvent près de 0",
"Exactement 12 V",
"24 V",
"OL"
],
"bon": 0,
"s": 25,
"expl": "En mode AC, l'appareil cherche une tension qui varie. Une tension continue stable donne une lecture fausse. Toujours vérifier AC ou DC avant de lire."
},
{
"q": "La tension se mesure…",
"ch": [
"En parallèle, sondes de chaque côté de la charge",
"En série, en ouvrant le circuit",
"Avec la pince autour d'un fil",
"Circuit hors tension seulement"
],
"bon": 0,
"s": 20,
"expl": "Le voltmètre se branche en parallèle : une sonde de chaque côté de ce qu'on mesure."
},
{
"q": "Mise en situation : panneau résidentiel 120/240 V. Entre les deux phases (L1 et L2), tu devrais lire…",
"ch": [
"120 V",
"208 V",
"240 V",
"0 V"
],
"bon": 2,
"s": 20,
"expl": "120 V entre une phase et le neutre, 240 V entre les deux phases."
},
{
"t": "ordre",
"q": "Remets dans l'ordre : vérifier l'absence de tension avant de travailler.",
"ch": [
"Vérifier le multimètre sur une source sous tension connue",
"Mesurer le circuit sur lequel tu vas travailler",
"Revérifier le multimètre sur la source connue",
"Travailler seulement si les deux vérifications confirment 0 V"
],
"bon": [
0,
1,
2,
3
],
"s": 40,
"expl": "On vérifie l'appareil avant et après : un multimètre brisé qui affiche 0 V peut tuer."
},
{
"q": "Mise en situation : un thermocouple de chauffe-eau au gaz donne environ 25 mV DC. La Fluke 302+ peut-elle bien le mesurer ?",
"ch": [
"Non : elle n'a pas de plage de millivolts",
"Oui, en V~",
"Oui, avec la pince",
"Oui, en mode Ω"
],
"bon": 0,
"s": 30,
"expl": "Sa plage DC va jusqu'à 600,0 V avec une résolution de 0,1 V : 25 mV afficherait 0,0. Il faut un multimètre avec une plage mV."
},
{
"q": "Avant de mesurer une résistance en ohms, il faut…",
"ch": [
"Couper l'alimentation du circuit",
"Mettre le sélecteur sur A~",
"Laisser le circuit sous tension",
"Refermer la pince sur le fil"
],
"bon": 0,
"s": 15,
"expl": "Jamais d'ohms sous tension : la lecture est fausse et l'appareil peut être endommagé."
},
{
"q": "Mise en situation : tu testes un fusible retiré du circuit en mode continuité. L'appareil bipe. Le fusible est…",
"ch": [
"Bon",
"Brûlé",
"En court-circuit avec la terre",
"Impossible à dire"
],
"bon": 0,
"s": 20,
"expl": "Bip = chemin continu (≤ 70 Ω) : le fusible n'est pas ouvert, il est bon."
},
{
"q": "Mise en situation : même test sur un autre fusible, pas de bip et l'écran affiche OL. Le fusible est…",
"ch": [
"Bon",
"Brûlé (ouvert)",
"Trop gros",
"Mal installé"
],
"bon": 1,
"s": 20,
"expl": "Circuit ouvert = OL et pas de bip : le fusible est brûlé."
},
{
"t": "nombre",
"q": "Un élément de chauffe-eau de 4500 W à 240 V. Quelle résistance devrais-tu lire à froid, environ ? (au dixième)",
"ch": [],
"bon": 12.8,
"tol": 0.3,
"u": "Ω",
"s": 40,
"expl": "R = V² ÷ P = 240 × 240 ÷ 4500 = 12,8 Ω. OL = élément coupé; près de 0 Ω = court-circuit."
},
{
"q": "Mise en situation : tu mesures l'élément d'une plinthe et tu lis OL. Le problème probable ?",
"ch": [
"L'élément est coupé (ouvert)",
"L'élément est parfait",
"Le thermostat est trop chaud",
"Il manque du courant"
],
"bon": 0,
"s": 25,
"expl": "Une résistance de chauffage doit donner quelques dizaines d'ohms. OL = filament coupé."
},
{
"t": "multi",
"q": "Le mode continuité (bip) sert à…",
"ch": [
"Suivre un fil d'un bout à l'autre",
"Vérifier un interrupteur (fermé = bip)",
"Tester un fusible hors circuit",
"Mesurer la tension d'une prise"
],
"bon": [
0,
1,
2
],
"s": 30,
"expl": "Le bip vérifie un chemin électrique, toujours circuit hors tension. Pour une prise, c'est le mode V~."
},
{
"q": "Pourquoi utiliser le bip plutôt que lire les ohms pour suivre un fil ?",
"ch": [
"On garde les yeux sur le travail, l'oreille suffit",
"Le bip est plus précis",
"Le bip mesure aussi la tension",
"Les ohms ne marchent pas sur le cuivre"
],
"bon": 0,
"s": 20,
"expl": "Le son permet de travailler sans regarder l'écran, par exemple dans un plafond ou derrière un appareil."
},
{
"t": "erreur",
"q": "Trouve l'erreur.",
"ch": [
"La loi d'Ohm s'écrit",
"V = R × I,",
"donc le courant",
"se calcule I = V × R."
],
"bon": 3,
"s": 30,
"expl": "I = V ÷ R. Si la tension monte, le courant monte; si la résistance monte, le courant baisse."
},
{
"q": "Quelle est la fréquence du réseau électrique au Québec ?",
"ch": [
"50 Hz",
"60 Hz",
"100 Hz",
"120 Hz"
],
"bon": 1,
"s": 15,
"expl": "60 Hz en Amérique du Nord (50 Hz en Europe)."
},
{
"q": "Le fil neutre d'un circuit résidentiel est habituellement de quelle couleur ?",
"ch": [
"Blanc",
"Noir",
"Rouge",
"Vert"
],
"bon": 0,
"s": 15,
"expl": "Neutre = blanc; phases = noir et rouge; mise à la terre = vert ou nu."
},
{
"t": "nombre",
"q": "Deux résistances de 20 Ω et 30 Ω sont branchées en série. Résistance totale ?",
"ch": [],
"bon": 50,
"tol": 0,
"u": "Ω",
"s": 25,
"expl": "En série, les résistances s'additionnent : 20 + 30 = 50 Ω."
},
{
"t": "nombre",
"q": "Deux résistances de 20 Ω branchées en parallèle. Résistance totale ?",
"ch": [],
"bon": 10,
"tol": 0,
"u": "Ω",
"s": 30,
"expl": "Deux résistances égales en parallèle = la moitié : 10 Ω."
},
{
"q": "Une bobine de valve de 24 V consomme 0,5 A. Quelle est sa puissance ?",
"ch": [
"12 W",
"24,5 W",
"48 W",
"2 W"
],
"bon": 0,
"s": 25,
"expl": "P = V × I = 24 × 0,5 = 12 W."
},
{
"q": "Le disjoncteur protège surtout…",
"ch": [
"Le fil contre la surchauffe",
"L'appareil contre l'usure",
"La personne contre toute décharge",
"Le compteur d'Hydro"
],
"bon": 0,
"s": 20,
"expl": "Le disjoncteur protège le conducteur. Pour les personnes près de l'eau, c'est le DDFT (disjoncteur différentiel)."
},
{
"q": "La Fluke 302+ est classée CAT III 600 V. Ça veut dire qu'elle est conçue pour…",
"ch": [
"Les circuits de distribution du bâtiment (panneaux, prises)",
"Seulement les piles",
"Les lignes d'Hydro-Québec à haute tension",
"Seulement l'électronique"
],
"bon": 0,
"s": 25,
"expl": "CAT III = installation fixe du bâtiment. CAT IV 300 V = source de l'installation (entrée électrique) jusqu'à 300 V."
}
]
},
{
"id": "defi-eclair",
"exemple": true,
"titre": "Défi éclair",
"sujet": "Sports, géo, histoire et culture générale",
"couv": "img/labo/quiz/punch-couv.svg",
"coul": "#B3261E",
"reg": {
"nb": "15",
"melange": "tout"
},
"qs": [
{
"q": "À quel pays appartient ce drapeau ?",
"ch": [
"Jamaïque",
"Brésil",
"Afrique du Sud",
"Tanzanie"
],
"bon": 0,
"s": 15,
"img": "img/labo/quiz/punch/01.jpg",
"expl": "La Jamaïque : une croix jaune en X avec du vert et du noir. C'est le seul drapeau national sans rouge, blanc ni bleu."
},
{
"q": "À quel pays appartient ce drapeau ?",
"ch": [
"Norvège",
"Suède",
"Finlande",
"Danemark"
],
"bon": 1,
"s": 15,
"img": "img/labo/quiz/punch/02.jpg",
"expl": "La Suède : croix jaune sur fond bleu. La Finlande a une croix bleue sur fond blanc."
},
{
"q": "Lequel est le drapeau de l'Irlande ?",
"ch": [
"A",
"B",
"C",
"D"
],
"bon": 2,
"s": 20,
"img": "img/labo/quiz/punch/03.jpg",
"expl": "C : vert, blanc, orange (le vert du côté du mât). A est la Côte d'Ivoire (à l'envers de l'Irlande), B l'Italie, D l'Inde."
},
{
"q": "Au hockey, combien de joueurs d'une même équipe sont sur la glace en même temps, gardien compris ?",
"t": "nombre",
"ch": [],
"bon": 6,
"tol": 0,
"u": "joueurs",
"s": 20,
"img": "img/labo/quiz/punch/04.jpg",
"expl": "6 : un gardien, deux défenseurs et trois attaquants (sans punition)."
},
{
"q": "Au soccer, à combien de mètres du but est le point de penalty ?",
"t": "nombre",
"ch": [],
"bon": 11,
"tol": 0,
"u": "m",
"s": 25,
"img": "img/labo/quiz/punch/05.jpg",
"expl": "11 mètres (12 verges). C'est pour ça qu'on dit un « tir de 11 mètres »."
},
{
"q": "À quelle hauteur du sol est l'anneau d'un panier de basketball ?",
"ch": [
"2,75 m",
"3,05 m",
"3,35 m",
"3,65 m"
],
"bon": 1,
"s": 20,
"img": "img/labo/quiz/punch/06.jpg",
"expl": "3,05 m, soit exactement 10 pieds, partout dans le monde, de la NBA au gymnase de l'école."
},
{
"q": "Au football canadien, combien de joueurs par équipe sont sur le terrain ?",
"ch": [
"10",
"11",
"12",
"13"
],
"bon": 2,
"s": 20,
"img": "img/labo/quiz/punch/07.jpg",
"expl": "12 au football canadien, contre 11 au football américain. Le terrain canadien est aussi plus grand."
},
{
"q": "Au tennis, c'est 40-40 (égalité). Le joueur qui gagne le point suivant a…",
"ch": [
"Le jeu",
"L'avantage",
"Le set",
"50 points"
],
"bon": 1,
"s": 15,
"img": "img/labo/quiz/punch/08.jpg",
"expl": "L'avantage. Il doit gagner un 2e point de suite pour remporter le jeu, sinon on revient à égalité."
},
{
"q": "Combien de trous compte un parcours de golf complet ?",
"t": "nombre",
"ch": [],
"bon": 18,
"tol": 0,
"u": "trous",
"s": 20,
"img": "img/labo/quiz/punch/09.jpg",
"expl": "18 trous. Plusieurs petits terrains n'en ont que 9 : on fait alors le tour deux fois."
},
{
"q": "Combien de cases y a-t-il sur un échiquier ?",
"t": "nombre",
"ch": [],
"bon": 64,
"tol": 0,
"u": "cases",
"s": 25,
"img": "img/labo/quiz/punch/10.jpg",
"expl": "8 × 8 = 64 cases, 32 pâles et 32 foncées."
},
{
"q": "Aux fléchettes, combien vaut le petit centre rouge de la cible ?",
"ch": [
"25",
"50",
"60",
"100"
],
"bon": 1,
"s": 20,
"img": "img/labo/quiz/punch/11.jpg",
"expl": "50 points. L'anneau vert autour vaut 25. Le plus payant reste le triple 20 : 60 points."
},
{
"q": "Au bowling à 10 quilles, quel est le score parfait (12 abats de suite) ?",
"t": "nombre",
"ch": [],
"bon": 300,
"tol": 0,
"u": "points",
"s": 30,
"img": "img/labo/quiz/punch/12.jpg",
"expl": "300 points : 12 abats (strikes) de suite."
},
{
"q": "En course automobile, ce drapeau veut dire…",
"ch": [
"Ralentir",
"Fin de la course",
"Accident sur la piste",
"Dernier tour"
],
"bon": 1,
"s": 15,
"img": "img/labo/quiz/punch/13.jpg",
"expl": "Le drapeau à damier : la course est finie. Le jaune = danger, ralentir; le blanc = dernier tour (en IndyCar et NASCAR)."
},
{
"q": "Au billard 8 boules, quelle boule doit être empochée en dernier ?",
"ch": [
"La blanche",
"La noire (8)",
"La jaune (1)",
"La rayée 15"
],
"bon": 1,
"s": 15,
"img": "img/labo/quiz/punch/14.jpg",
"expl": "La 8 noire. L'empocher trop tôt fait perdre la partie sur-le-champ."
},
{
"q": "Zoom mystère : quelle balle se cache ici ?",
"ch": [
"Balle de tennis",
"Balle de baseball",
"Balle de golf",
"Ballon de volleyball"
],
"bon": 1,
"s": 20,
"img": "img/labo/quiz/punch/15.jpg",
"zoom": {
"x": 30,
"y": 45
},
"expl": "Une balle de baseball : 108 doubles coutures rouges, faites à la main."
},
{
"q": "Il est 15 h à Montréal. Quelle heure est-il à Vancouver ?",
"ch": [
"12 h",
"13 h",
"14 h",
"18 h"
],
"bon": 0,
"s": 20,
"img": "img/labo/quiz/punch/16.jpg",
"expl": "12 h : Vancouver a 3 heures de retard sur Montréal (heure du Pacifique)."
},
{
"q": "Quelle équipe a remporté le plus de coupes Stanley ?",
"ch": [
"Maple Leafs de Toronto",
"Red Wings de Détroit",
"Canadiens de Montréal",
"Bruins de Boston"
],
"bon": 2,
"s": 15,
"expl": "Les Canadiens de Montréal : 24 coupes Stanley, la dernière en 1993."
},
{
"q": "Quel numéro a été retiré dans toute la LNH en l'honneur de Wayne Gretzky ?",
"ch": [
"66",
"87",
"99",
"9"
],
"bon": 2,
"s": 15,
"expl": "Le 99. Aucun joueur de la LNH ne peut plus le porter depuis 2000."
},
{
"q": "Quel pays a gagné la Coupe du monde de soccer en 2022 ?",
"ch": [
"France",
"Brésil",
"Argentine",
"Croatie"
],
"bon": 2,
"s": 15,
"expl": "L'Argentine de Lionel Messi, en finale contre la France aux tirs au but."
},
{
"q": "Quel est le sport national d'été du Canada ?",
"ch": [
"Le soccer",
"La crosse",
"Le baseball",
"Le football canadien"
],
"bon": 1,
"s": 20,
"expl": "La crosse (loi de 1994). Le hockey est le sport national d'hiver."
},
{
"q": "Laurent Duvernay-Tardif, Québécois devenu médecin, a gagné le Super Bowl dans quel sport ?",
"ch": [
"Hockey",
"Football",
"Basketball",
"Baseball"
],
"bon": 1,
"s": 15,
"expl": "Au football, avec les Chiefs de Kansas City en 2020."
},
{
"q": "Au soccer, le gardien peut toucher le ballon avec les mains partout sur le terrain.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 12,
"expl": "Faux : seulement dans sa surface de réparation."
},
{
"q": "Un match de hockey de la LNH dure trois périodes de 20 minutes.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 12,
"expl": "Vrai : 60 minutes de jeu effectif, sans compter les arrêts."
},
{
"q": "Quelle est la distance d'un marathon ?",
"t": "nombre",
"ch": [],
"bon": 42.195,
"tol": 0.2,
"u": "km",
"s": 30,
"expl": "42,195 km. Une réponse entre 42 et 42,4 est acceptée."
},
{
"q": "Lesquels sont des sports des Jeux olympiques d'été ?",
"t": "multi",
"ch": [
"L'escalade",
"Le breaking (danse)",
"Le curling",
"Le biathlon"
],
"bon": [
0,
1
],
"s": 30,
"expl": "L'escalade (depuis 2020) et le breaking (à Paris en 2024). Le curling et le biathlon sont aux Jeux d'hiver."
},
{
"q": "Place ces événements tenus au Canada du plus ancien au plus récent.",
"t": "ordre",
"ch": [
"Expo 67 à Montréal",
"Jeux olympiques de Montréal",
"Jeux olympiques de Calgary",
"Jeux olympiques de Vancouver"
],
"bon": [
0,
1,
2,
3
],
"s": 40,
"expl": "1967, 1976 (été), 1988 (hiver) et 2010 (hiver)."
},
{
"q": "Place ces animaux du plus léger au plus lourd.",
"t": "ordre",
"ch": [
"Chat",
"Cerf de Virginie",
"Orignal",
"Éléphant d'Afrique"
],
"bon": [
0,
1,
2,
3
],
"s": 35,
"expl": "Environ 4 kg, 100 kg, 500 kg et 6 000 kg."
},
{
"q": "Trouve l'erreur dans cette phrase.",
"t": "erreur",
"ch": [
"Le Super Bowl",
"se joue chaque année en février",
"et oppose les deux meilleures équipes",
"de la LNH."
],
"bon": 3,
"s": 30,
"expl": "C'est la NFL (football). La LNH, c'est le hockey."
},
{
"q": "Trouve l'erreur dans cette phrase.",
"t": "erreur",
"ch": [
"Le Tour de France",
"est une course cycliste de trois semaines",
"qui se termine traditionnellement",
"à Marseille."
],
"bon": 3,
"s": 30,
"expl": "Elle se termine traditionnellement à Paris, sur les Champs-Élysées."
},
{
"q": "Quel est l'animal terrestre le plus rapide ?",
"ch": [
"Le lion",
"Le guépard",
"Le cheval",
"L'antilope"
],
"bon": 1,
"s": 15,
"expl": "Le guépard : plus de 100 km/h en pointe, mais seulement sur quelques centaines de mètres."
},
{
"q": "Combien d'os compte le squelette d'un adulte ?",
"t": "nombre",
"ch": [],
"bon": 206,
"tol": 0,
"u": "os",
"s": 30,
"expl": "206 os. Un bébé en a environ 300 : plusieurs se soudent en grandissant."
},
{
"q": "Quel est le record du monde d'Usain Bolt au 100 m ?",
"ch": [
"9,58 s",
"9,69 s",
"9,81 s",
"10,02 s"
],
"bon": 0,
"s": 20,
"expl": "9,58 s, à Berlin en 2009. Ça fait une moyenne de près de 38 km/h."
},
{
"q": "Dans quel pays se trouvent ces célèbres pyramides de Gizeh ?",
"ch": [
"Mexique",
"Égypte",
"Pérou",
"Soudan"
],
"bon": 1,
"s": 15,
"img": "img/labo/quiz/punch/17.jpg",
"expl": "En Égypte, près du Caire. La grande pyramide a environ 4 500 ans."
},
{
"q": "Quel point cardinal indique la pointe orange de l'aiguille ?",
"ch": [
"Nord",
"Est",
"Sud",
"Ouest"
],
"bon": 3,
"s": 15,
"img": "img/labo/quiz/punch/18.jpg",
"expl": "L'ouest : à gauche quand le nord est en haut. En anglais, c'est W (west)."
},
{
"q": "Quelle est la capitale de l'Australie ?",
"ch": [
"Sydney",
"Melbourne",
"Canberra",
"Perth"
],
"bon": 2,
"s": 15,
"expl": "Canberra, une ville construite exprès pour être la capitale, entre Sydney et Melbourne."
},
{
"q": "Quel est le plus grand océan du monde ?",
"ch": [
"Atlantique",
"Indien",
"Arctique",
"Pacifique"
],
"bon": 3,
"s": 15,
"expl": "Le Pacifique : à lui seul, il est plus grand que toutes les terres émergées réunies."
},
{
"q": "Quel pays compte le plus d'habitants ?",
"ch": [
"Chine",
"Inde",
"États-Unis",
"Indonésie"
],
"bon": 1,
"s": 20,
"expl": "L'Inde a dépassé la Chine en 2023, avec plus de 1,4 milliard d'habitants."
},
{
"q": "Lesquels de ces pays sont traversés par l'équateur ?",
"t": "multi",
"ch": [
"Brésil",
"Kenya",
"Mexique",
"Égypte"
],
"bon": [
0,
1
],
"s": 30,
"expl": "Le Brésil et le Kenya. Le Mexique et l'Égypte sont entièrement au nord de l'équateur."
},
{
"q": "Combien de fuseaux horaires y a-t-il au Canada ?",
"t": "nombre",
"ch": [],
"bon": 6,
"tol": 0,
"u": "fuseaux",
"s": 30,
"expl": "6 : Pacifique, Rocheuses, Centre, Est, Atlantique et Terre-Neuve (avec sa demi-heure de décalage)."
},
{
"q": "Place ces montagnes de la plus basse à la plus haute.",
"t": "ordre",
"ch": [
"Mont Royal",
"Mont Tremblant",
"Mont Blanc",
"Mont Everest"
],
"bon": [
0,
1,
2,
3
],
"s": 35,
"expl": "Environ 233 m, 875 m, 4 805 m et 8 849 m."
},
{
"q": "En quelle année Samuel de Champlain a-t-il fondé Québec ?",
"ch": [
"1534",
"1608",
"1759",
"1867"
],
"bon": 1,
"s": 20,
"expl": "1608. En 1534, c'est Jacques Cartier qui arrive à Gaspé; 1759, la bataille des plaines d'Abraham; 1867, la Confédération."
},
{
"q": "Place ces événements du plus ancien au plus récent.",
"t": "ordre",
"ch": [
"Fondation de Québec",
"Bataille des plaines d'Abraham",
"Confédération canadienne",
"Premiers pas sur la Lune"
],
"bon": [
0,
1,
2,
3
],
"s": 40,
"expl": "1608, 1759, 1867 et 1969."
},
{
"q": "Trouve l'erreur dans cette phrase.",
"t": "erreur",
"ch": [
"En 1534, Jacques Cartier",
"plante une croix à Gaspé",
"et prend possession du territoire",
"au nom du roi d'Angleterre."
],
"bon": 3,
"s": 30,
"expl": "Au nom du roi de France, François Ier."
},
{
"q": "Qui a été le premier humain à marcher sur la Lune ?",
"ch": [
"Youri Gagarine",
"Buzz Aldrin",
"Neil Armstrong",
"Marc Garneau"
],
"bon": 2,
"s": 15,
"expl": "Neil Armstrong, le 21 juillet 1969. Gagarine a été le premier humain dans l'espace (1961); Marc Garneau, le premier Canadien (1984)."
},
{
"q": "En quelle année le mur de Berlin est-il tombé ?",
"t": "nombre",
"ch": [],
"bon": 1989,
"tol": 0,
"u": "",
"s": 30,
"expl": "En 1989. L'Allemagne a été réunifiée l'année suivante, en 1990."
},
{
"q": "La Révolution tranquille a transformé le Québec dans les années 1960.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 12,
"expl": "Vrai : réforme de l'éducation, création du ministère de l'Éducation, nationalisation de l'électricité avec Hydro-Québec."
},
{
"q": "En quelle année a pris fin la Deuxième Guerre mondiale ?",
"ch": [
"1918",
"1939",
"1945",
"1950"
],
"bon": 2,
"s": 15,
"expl": "1945. Elle avait commencé en 1939; 1918 est la fin de la Première Guerre mondiale."
}
]
},
{
"id": "defi-administration-batiment-1",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Administration d'un bâtiment · Défi+ 1 de 3",
"sujet": "Chapitres 1 à 4 : rôle du préposé, lois, location, loyer",
"couv": "img/couvertures/administration-batiment.jpg",
"coul": "#2E8B57",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "M. Gagnon t'arrête dans le corridor : son robinet coule depuis une semaine. Que fais-tu d'abord?",
"ch": [
"Je lui dis d'appeler le propriétaire",
"J'écris une demande de service avec la date et l'heure",
"Je répare sans rien noter",
"J'attends qu'il envoie un courriel"
],
"bon": 1,
"s": 20,
"expl": "Écrite tout de suite, la demande ne peut plus se perdre."
},
{
"q": "Qu'est-ce qui va dans une bonne entrée de registre?",
"ch": [
"La date et l'heure",
"Les faits observés",
"Ton opinion sur le locataire",
"Ce qui a été fait et par qui"
],
"bon": [
0,
1,
3
],
"s": 30,
"expl": "Des faits, sans opinion.",
"t": "multi"
},
{
"q": "Avant d'engager un sous-traitant, on vérifie sa licence auprès de…",
"ch": [
"la RBQ",
"la SAAQ",
"la CNESST seulement",
"la municipalité"
],
"bon": 0,
"s": 20,
"expl": "Registre des détenteurs de licence de la RBQ."
},
{
"q": "Les renseignements personnels des locataires peuvent être montrés aux autres locataires s'ils le demandent.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Ils sont confidentiels."
},
{
"q": "Le bail de logement est encadré principalement par…",
"ch": [
"le Code civil du Québec",
"le Code criminel",
"le Code de construction",
"la Loi sur la RBQ"
],
"bon": 0,
"s": 20
},
{
"q": "Quelles sont des fonctions du TAL?",
"ch": [
"Informer",
"Concilier",
"Décider",
"Construire des logements"
],
"bon": [
0,
1,
2
],
"s": 30,
"expl": "Il informe, concilie, décide et fixe les loyers.",
"t": "multi"
},
{
"q": "Avant d'aller au TAL : dans l'ordre.",
"ch": [
"Discuter avec l'autre partie",
"Écrire",
"Envoyer une mise en demeure"
],
"bon": [
0,
1,
2
],
"s": 40,
"t": "ordre"
},
{
"q": "Au TAL, qu'est-ce qui fait gagner une cause?",
"ch": [
"Parler fort",
"La preuve : photos, registres, écrits",
"L'ancienneté du propriétaire",
"Le nombre de plaintes reçues"
],
"bon": 1,
"s": 20
},
{
"q": "Laquelle de ces annonces est discriminatoire?",
"ch": [
"« 4 ½ rénové, près du métro »",
"« Idéal pour couple sans enfant »",
"« Stationnement inclus »",
"« Libre le 1er juillet »"
],
"bon": 1,
"s": 20,
"expl": "L'état familial est un motif protégé par la Charte."
},
{
"q": "Le locateur doit remettre une copie du bail au locataire dans combien de jours suivant la signature?",
"t": "nombre",
"ch": [],
"bon": 10,
"s": 40,
"u": "jours"
},
{
"q": "Au Québec, le locateur peut exiger un dépôt de garantie pour les dommages.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Seul le premier mois de loyer peut être demandé d'avance."
},
{
"q": "Pour une enquête de crédit, qu'est-ce que le locateur n'a PAS besoin de demander?",
"ch": [
"Le nom",
"L'adresse",
"La date de naissance",
"Le NAS"
],
"bon": 3,
"s": 20,
"expl": "Selon la CAI, le nom, l'adresse et la date de naissance suffisent."
},
{
"q": "Après un retard de paiement de plus de combien de semaines le locateur peut-il demander la résiliation au TAL?",
"t": "nombre",
"ch": [],
"bon": 3,
"s": 40,
"u": "semaines"
},
{
"q": "Un locataire ne paie pas. Que peut faire le locateur?",
"ch": [
"Couper le chauffage",
"Changer la serrure",
"Faire une demande au TAL",
"Garder ses meubles"
],
"bon": 2,
"s": 20,
"expl": "Tout le reste est de la « justice personnelle », interdite."
},
{
"q": "Trouve l'erreur dans cette phrase.",
"t": "erreur",
"ch": [
"Mme Tremblay n'a plus d'eau chaude.",
"Elle peut retenir son loyer d'elle-même",
"jusqu'à la réparation."
],
"bon": 1,
"s": 30,
"expl": "Elle ne peut pas retenir son loyer : son recours, c'est le TAL."
}
]
},
{
"id": "defi-administration-batiment-2",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Administration d'un bâtiment · Défi+ 2 de 3",
"sujet": "Chapitres 5 à 10 : colocation, nuisances, chauffage, travaux, fin du bail, valeur",
"couv": "img/couvertures/administration-batiment.jpg",
"coul": "#2E8B57",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Mélanie habite avec deux colocataires mais n'a pas signé le bail. Envers le locateur, elle est…",
"ch": [
"colocataire",
"occupante, sans engagement envers lui",
"sous-locataire",
"caution"
],
"bon": 1,
"s": 20
},
{
"q": "Cession ou sous-location : dans laquelle le locataire reste-t-il responsable du bail?",
"ch": [
"La cession",
"La sous-location",
"Les deux",
"Aucune"
],
"bon": 1,
"s": 20,
"expl": "Cession = départ définitif; sous-location = il reste responsable."
},
{
"q": "Le locateur a combien de jours pour répondre à une demande de cession ou de sous-location?",
"t": "nombre",
"ch": [],
"bon": 15,
"s": 40,
"u": "jours",
"expl": "Sans réponse, il est réputé avoir accepté."
},
{
"q": "Quelles preuves sont utiles au TAL pour un trouble de voisinage?",
"ch": [
"Un journal de bruit daté",
"Des témoins",
"Des enregistrements datés",
"Une rumeur entendue au dépanneur"
],
"bon": [
0,
1,
2
],
"s": 30,
"t": "multi"
},
{
"q": "Les corridors et les escaliers peuvent servir à ranger les vélos s'il n'y a plus de place.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Les issues doivent rester libres."
},
{
"q": "Un locataire demande d'avoir son chien d'assistance. Le règlement interdit les animaux.",
"ch": [
"On refuse",
"On ne peut pas le refuser",
"On exige un dépôt",
"On augmente le loyer"
],
"bon": 1,
"s": 20
},
{
"q": "Température de référence pratique dans un logement en hiver :",
"ch": [
"16 °C",
"18 °C",
"21 °C",
"25 °C"
],
"bon": 2,
"s": 20
},
{
"q": "Pour un relevé de température fiable…",
"ch": [
"Mesurer plusieurs jours à heures fixes",
"Mesurer au centre de la pièce, à 1 m du sol",
"Noter la température extérieure",
"Mesurer collé à la fenêtre"
],
"bon": [
0,
1,
2
],
"s": 30,
"t": "multi"
},
{
"q": "Une chaufferette au propane peut chauffer un logement pendant une panne si on laisse une fenêtre entrouverte.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Monoxyde de carbone : jamais d'appareil à combustion à l'intérieur."
},
{
"q": "Menues réparations et réparations nécessaires : qui fait quoi?",
"ch": [
"Tout au propriétaire",
"Tout au locataire",
"Menues = locataire; nécessaires = propriétaire",
"Menues = propriétaire; nécessaires = locataire"
],
"bon": 2,
"s": 20
},
{
"q": "Préavis minimal pour visiter ou vérifier un logement (hors urgence) :",
"t": "nombre",
"ch": [],
"bon": 24,
"s": 40,
"u": "h",
"expl": "Visite entre 9 h et 21 h."
},
{
"q": "Bail de 12 mois : l'avis de hausse de loyer s'envoie…",
"ch": [
"entre 1 et 2 mois avant la fin",
"entre 3 et 6 mois avant la fin",
"n'importe quand",
"après la fin du bail"
],
"bon": 1,
"s": 20
},
{
"q": "Le locataire ne répond pas à l'avis de hausse dans le délai d'un mois.",
"ch": [
"Le bail prend fin",
"Il accepte la hausse",
"Il refuse la hausse",
"Le TAL décide"
],
"bon": 1,
"s": 20,
"expl": "Le silence vaut acceptation."
},
{
"q": "Valeur d'un immeuble : dans l'ordre du calcul.",
"ch": [
"Revenu brut potentiel",
"Moins l'inoccupation = revenu brut effectif",
"Moins les dépenses = revenu net d'exploitation"
],
"bon": [
0,
1,
2
],
"s": 40,
"t": "ordre"
},
{
"q": "Pour se qualifier à une hypothèque, la banque applique…",
"ch": [
"le test de résistance",
"le test de la bille",
"le test de l'alcool",
"le test de la feuille"
],
"bon": 0,
"s": 20
}
]
},
{
"id": "defi-administration-batiment-3",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Administration d'un bâtiment · Défi+ 3 de 3",
"sujet": "Chapitres 10 à 13 : achat, copropriété, plan d'urgence, interventions",
"couv": "img/couvertures/administration-batiment.jpg",
"coul": "#2E8B57",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Un cash-flow négatif veut dire…",
"ch": [
"l'immeuble rapporte plus que prévu",
"tu paies de ta poche chaque mois pour garder l'immeuble",
"l'hypothèque est payée",
"les loyers sont trop bas pour le TAL"
],
"bon": 1,
"s": 20
},
{
"q": "Le ratio de couverture de la dette (RCD), c'est…",
"ch": [
"revenu net ÷ paiements hypothécaires",
"prix ÷ loyers",
"mise de fonds ÷ prix",
"taxes ÷ loyers"
],
"bon": 0,
"s": 20
},
{
"q": "Acheter un plex à deux : on signe devant notaire, avant l'achat…",
"ch": [
"une convention d'indivision",
"un bail",
"une mise en demeure",
"une soumission"
],
"bon": 0,
"s": 20
},
{
"q": "Dans une copropriété, le fonds de prévoyance paie…",
"ch": [
"les réparations majeures des parties communes",
"le remplacement de la toiture",
"la cuisine d'un copropriétaire",
"les meubles d'un locataire"
],
"bon": [
0,
1
],
"s": 30,
"t": "multi"
},
{
"q": "Un copropriétaire qui loue son condo doit remettre le règlement de l'immeuble à son locataire.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Le carnet d'entretien d'une copropriété fait des prévisions sur combien d'années?",
"t": "nombre",
"ch": [],
"bon": 25,
"s": 40,
"u": "ans"
},
{
"q": "Un plan d'urgence sert à…",
"ch": [
"écrire d'avance quoi faire et qui fait quoi",
"calculer le loyer",
"choisir un locataire",
"remplacer l'assurance"
],
"bon": 0,
"s": 20
},
{
"q": "Que doit-on savoir localiser dans l'immeuble?",
"ch": [
"Le robinet d'arrêt d'eau principal",
"L'entrée électrique principale",
"La valve d'entrée de gaz",
"La boîte à lunch du concierge"
],
"bon": [
0,
1,
2
],
"s": 30,
"expl": "Identifiés, étiquetés et accessibles.",
"t": "multi"
},
{
"q": "Inspection visuelle d'un extincteur portatif :",
"ch": [
"chaque semaine",
"chaque mois",
"chaque année seulement",
"tous les 5 ans"
],
"bon": 1,
"s": 20,
"expl": "Mensuelle; entretien annuel."
},
{
"q": "La séquence d'intervention en urgence : dans l'ordre.",
"ch": [
"Ta sécurité d'abord",
"Alerter",
"Protéger les personnes",
"Limiter les dommages",
"Documenter"
],
"bon": [
0,
1,
2,
3,
4
],
"s": 45,
"t": "ordre"
},
{
"q": "Utiliser un extincteur (TVAB) : dans l'ordre.",
"ch": [
"Tirer la goupille",
"Viser la base du feu",
"Appuyer sur la poignée",
"Balayer"
],
"bon": [
0,
1,
2,
3
],
"s": 40,
"t": "ordre"
},
{
"q": "Un feu d'huile dans une casserole :",
"ch": [
"On jette de l'eau",
"On couvre avec un couvercle et on ferme le rond",
"On transporte la casserole dehors",
"On souffle dessus"
],
"bon": 1,
"s": 20
},
{
"q": "Odeur de gaz dans le corridor :",
"ch": [
"J'allume pour mieux voir",
"Je sors et j'appelle de l'extérieur",
"Je cherche la fuite avec un briquet",
"J'actionne l'alarme électrique"
],
"bon": 1,
"s": 20,
"expl": "On ne touche à rien d'électrique."
},
{
"q": "Dégât d'eau près du panneau électrique : on marche dans l'eau pour couper le courant au plus vite.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "On coupe seulement si on atteint le panneau au sec; sinon on appelle."
},
{
"q": "Que contient un rapport d'incident?",
"ch": [
"Date, heures et lieu précis",
"Les faits en ordre chronologique",
"Les services d'urgence appelés",
"Ton opinion sur les coupables"
],
"bon": [
0,
1,
2
],
"s": 30,
"t": "multi"
}
]
},
{
"id": "defi-travaux-mineurs-egi-1",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Travaux mineurs d'entretien général · Défi+ 1 de 3",
"sujet": "Modules 1 à 4 : sécurité, inspection, cloisons, fissures et trous",
"couv": "img/couvertures/travaux-mineurs-egi.jpg",
"coul": "#D9488A",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Les 6 étapes de toute intervention : dans l'ordre.",
"ch": [
"Prendre connaissance du travail",
"Évaluer sur place",
"Organiser",
"Préparer les lieux",
"Exécuter",
"Compléter"
],
"bon": [
0,
1,
2,
3,
4,
5
],
"s": 50,
"t": "ordre"
},
{
"q": "Échelle à coulisse appuyée à 4 m de hauteur : à combien de mètres du mur va le pied?",
"t": "nombre",
"ch": [],
"bon": 1,
"s": 40,
"u": "m",
"expl": "Règle du 4 pour 1."
},
{
"q": "De combien de mètres l'échelle doit-elle dépasser l'appui?",
"t": "nombre",
"ch": [],
"bon": 0.9,
"s": 40,
"u": "m"
},
{
"q": "On peut monter sur le dessus d'un escabeau s'il est bien ouvert.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Jamais le dessus ni la marche juste en dessous."
},
{
"q": "Combien de points d'appui en tout temps dans une échelle?",
"ch": [
"1",
"2",
"3",
"4"
],
"bon": 2,
"s": 20
},
{
"q": "Quels sont les trois éléments du SIMDUT?",
"ch": [
"L'étiquette",
"La fiche de données de sécurité",
"La formation",
"Le permis de conduire"
],
"bon": [
0,
1,
2
],
"s": 30,
"t": "multi"
},
{
"q": "Un diluant transvidé dans un petit contenant doit porter…",
"ch": [
"une étiquette du lieu de travail",
"aucune étiquette",
"le nom de l'élève",
"un pictogramme dessiné à la main"
],
"bon": 0,
"s": 20
},
{
"q": "Chiffons imbibés d'huile de lin à la fin de la journée :",
"ch": [
"dans la poubelle",
"roulés dans un coin",
"dans un contenant métallique rempli d'eau",
"sur le calorifère pour sécher"
],
"bon": 2,
"s": 20,
"expl": "La réaction avec l'oxygène dégage de la chaleur : risque d'inflammation."
},
{
"q": "Bâtiment d'avant 1990 : avant de poncer un vieux plâtre…",
"ch": [
"on porte des gants",
"on vérifie le registre ou on fait tester (amiante)",
"on mouille le mur",
"on ne fait rien de spécial"
],
"bon": 1,
"s": 20
},
{
"q": "Une fissure marquée au crayon avec la date a grandi depuis l'inspection précédente.",
"ch": [
"C'est un mouvement actif : je signale",
"Je la remplis de composé",
"C'est normal",
"Je la peins"
],
"bon": 0,
"s": 20
},
{
"q": "À signaler sans attendre :",
"ch": [
"Fissure en escalier dans la brique",
"Garde-corps qui bouge",
"Pompe de puisard en panne avant un orage",
"Petit trou de punaise"
],
"bon": [
0,
1,
2
],
"s": 30,
"t": "multi"
},
{
"q": "À partir d'un coin, on trouve souvent un montant aux combien de millimètres?",
"t": "nombre",
"ch": [],
"bon": 406,
"s": 40,
"u": "mm",
"expl": "16 po."
},
{
"q": "On peut réparer un mur coupe-feu avec du gypse ordinaire si on met deux couches.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Même type de panneau : type X pour un coupe-feu."
},
{
"q": "Réparer le gypse : dans l'ordre.",
"ch": [
"Régler la cause",
"Bords propres et ruban si ça bouge",
"Trois couches minces de plus en plus larges",
"Ponçage léger et lampe rasante",
"Apprêt"
],
"bon": [
0,
1,
2,
3,
4
],
"s": 50,
"t": "ordre"
},
{
"q": "Un composé qui durcit par réaction chimique en 45 minutes est un composé…",
"ch": [
"prémélangé",
"à prise",
"acrylique",
"de finition"
],
"bon": 1,
"s": 20
}
]
},
{
"id": "defi-travaux-mineurs-egi-2",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Travaux mineurs d'entretien général · Défi+ 2 de 3",
"sujet": "Modules 4 à 7 : béton, céramique, peinture, planchers",
"couv": "img/couvertures/travaux-mineurs-egi.jpg",
"coul": "#D9488A",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Béton : la question clé avant de réparer une fissure :",
"ch": [
"De quelle couleur est-elle?",
"Est-ce que ça bouge? Est-ce que l'eau passe?",
"Quel âge a l'immeuble?",
"Qui l'a vue en premier?"
],
"bon": 1,
"s": 20,
"expl": "Stable et sec : je répare. Actif ou mouillé : j'arrête l'eau et je signale."
},
{
"q": "Pour arrêter une infiltration d'eau active dans le béton, on utilise…",
"ch": [
"du composé à joints",
"du ciment hydraulique",
"du silicone",
"de l'apprêt"
],
"bon": 1,
"s": 20
},
{
"q": "Une zone mate sur une peinture lustrée, causée par l'absence d'apprêt, s'appelle…",
"ch": [
"un embu",
"une coulure",
"une cloque",
"un faïençage"
],
"bon": 0,
"s": 20
},
{
"q": "Les 5 règles de la céramique incluent…",
"ch": [
"Même tuile (réserve étiquetée)",
"Support propre, plat, sain",
"Coulis dans le coin entre deux murs",
"Respecter la cure de 24 h"
],
"bon": [
0,
1,
3
],
"s": 30,
"expl": "Jamais de coulis au changement de plan.",
"t": "multi"
},
{
"q": "Couverture de mortier minimale sous une tuile au mouillé (douche) :",
"t": "nombre",
"ch": [],
"bon": 95,
"s": 40,
"u": "%",
"expl": "80 % au sec, 95 % au mouillé."
},
{
"q": "Une tuile qui sonne creux a un vide de mortier dessous.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Le coulis sans sable sert aux joints de plus de 3 mm.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15
},
{
"q": "Avant de refaire le joint de silicone d'une baignoire, on…",
"ch": [
"la vide complètement",
"la remplit d'eau",
"la chauffe",
"la peint"
],
"bon": 1,
"s": 20,
"expl": "Remplie, elle descend : le joint ne se fissurera pas à l'usage."
},
{
"q": "La peinture en 6 mots : dans l'ordre.",
"ch": [
"Choisir",
"Calculer",
"Préparer",
"Découper",
"Rouler (bord humide)",
"Vérifier"
],
"bon": [
0,
1,
2,
3,
4,
5
],
"s": 50,
"t": "ordre"
},
{
"q": "Pour savoir si une vieille peinture est un latex ou une alkyde :",
"ch": [
"le test de l'alcool",
"le test de la bille",
"le test du manche",
"le test de la feuille"
],
"bon": 0,
"s": 20
},
{
"q": "Fini lavable et discret pour les murs d'un corridor :",
"ch": [
"mat",
"velours (ou perle)",
"lustré",
"sans fini"
],
"bon": 1,
"s": 20
},
{
"q": "Poncer très légèrement entre deux couches de vernis, c'est…",
"ch": [
"égrener",
"décaper",
"sabler à fond",
"apprêter"
],
"bon": 0,
"s": 20
},
{
"q": "Un plancher flottant ne doit jamais être…",
"ch": [
"coincé (espace de dilatation)",
"nettoyé",
"posé sur une membrane",
"posé dans un corridor"
],
"bon": 0,
"s": 20
},
{
"q": "On cloue la moulure quart-de-rond dans le plancher flottant pour le tenir.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "On la fixe à la plinthe ou au mur, jamais au plancher."
},
{
"q": "De vieux carreaux de 9 × 9 po à enlever :",
"ch": [
"On les arrache au grattoir",
"On signale (amiante possible)",
"On les ponce",
"On les chauffe"
],
"bon": 1,
"s": 20
}
]
},
{
"id": "defi-travaux-mineurs-egi-3",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Travaux mineurs d'entretien général · Défi+ 3 de 3",
"sujet": "Modules 8 à 11 : armoires, fixations, portes, vitres et moustiquaires",
"couv": "img/couvertures/travaux-mineurs-egi.jpg",
"coul": "#D9488A",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Sous un comptoir de stratifié, le panneau qui gonfle à l'eau est…",
"ch": [
"le panneau de particules",
"le contreplaqué marin",
"le quartz",
"l'acier"
],
"bon": 0,
"s": 20
},
{
"q": "Régler une charnière invisible : dans l'ordre.",
"ch": [
"Haut-bas",
"Gauche-droite",
"Profondeur"
],
"bon": [
0,
1,
2
],
"s": 40,
"t": "ordre"
},
{
"q": "La distance entre les centres des deux vis d'une poignée s'appelle…",
"ch": [
"l'entraxe",
"le dégagement",
"la feuillure",
"le pêne"
],
"bon": 0,
"s": 20
},
{
"q": "Colle qu'on laisse sécher au toucher avant d'assembler les deux surfaces :",
"ch": [
"la colle contact",
"la colle blanche",
"l'époxy",
"le silicone"
],
"bon": 0,
"s": 20
},
{
"q": "Fixer solidement : dans l'ordre.",
"ch": [
"Trouver le support",
"Charge × 4",
"Choisir la fixation",
"Niveau et mesures",
"Tester"
],
"bon": [
0,
1,
2,
3,
4
],
"s": 50,
"t": "ordre"
},
{
"q": "Une barre d'appui peut être fixée avec des ancrages en plastique dans le gypse.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Toujours dans la structure ou un renfort."
},
{
"q": "On perce la céramique avec la percussion pour aller plus vite.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15
},
{
"q": "Dans le gypse creux, l'ancrage le plus fort est…",
"ch": [
"l'ancrage en plastique",
"l'ancrage à bascule",
"le clou",
"la vis à bois seule"
],
"bon": 1,
"s": 20
},
{
"q": "À l'extérieur, on met le scellant au-dessus d'un objet fixé au mur, pas en dessous.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15,
"expl": "L'eau qui entre par le bas doit pouvoir sortir."
},
{
"q": "Un ferme-porte bien réglé referme la porte en combien de secondes au maximum?",
"t": "nombre",
"ch": [],
"bon": 5,
"s": 40,
"u": "s",
"expl": "Entre 3 et 5 s."
},
{
"q": "Priorité 1 pour les portes :",
"ch": [
"Porte d'issue qui ne s'ouvre pas",
"Porte coupe-feu tenue ouverte",
"Porte coupe-feu qui ne s'enclenche pas",
"Porte d'armoire qui grince"
],
"bon": [
0,
1,
2
],
"s": 30,
"t": "multi"
},
{
"q": "On lubrifie un cylindre de serrure avec de l'huile à moteur.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15
},
{
"q": "Une porte qui pend : quelle vis aide dans la penture du haut?",
"ch": [
"Une vis de 75 mm",
"Une vis de 12 mm",
"Un clou",
"De la colle"
],
"bon": 0,
"s": 20,
"expl": "Elle va chercher le montant derrière le cadre."
},
{
"q": "Remplacer une vitre simple :",
"ch": [
"Mesurer au fond de la feuillure",
"Laisser environ 3 mm de jeu",
"Utiliser des cales d'assise",
"Couper le verre trempé sur place"
],
"bon": [
0,
1,
2
],
"s": 30,
"expl": "Le verre trempé ne se coupe jamais.",
"t": "multi"
},
{
"q": "Après avoir posé une toile de moustiquaire, on vérifie…",
"ch": [
"qu'elle est tendue sans avoir plié le cadre",
"qu'elle touche la vitre",
"qu'elle est collée au silicone",
"qu'elle est peinte"
],
"bon": 0,
"s": 20
}
]
}
];
