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
},
{
"id": "defi-entretien-menager-egi-1",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Entretien ménager d'un bâtiment · Défi+ 1 de 3",
"sujet": "Modules 1 à 6 : sécurité, microbes, chimie, vert, surfaces et machines, quotidien",
"couv": "img/couvertures/entretien-menager-egi.jpg",
"coul": "#2E8B57",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Devant un danger, la règle de prévention : dans l'ordre.",
"ch": [
"Éliminer le danger",
"Le remplacer par moins dangereux",
"Le contrôler",
"L'EPI en dernier"
],
"bon": [
0,
1,
2,
3
],
"s": 45,
"t": "ordre"
},
{
"q": "Tu as des motifs raisonnables de croire qu'un travail te met en danger. Tu peux…",
"ch": [
"exercer ton droit de refus",
"partir chez toi sans rien dire",
"demander une prime",
"faire le travail plus vite"
],
"bon": 0,
"s": 20
},
{
"q": "Le travailleur doit payer lui-même ses gants et ses lunettes de protection.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "L'employeur fournit gratuitement les EPI."
},
{
"q": "Combien de sections compte toujours une fiche de données de sécurité (FDS)?",
"t": "nombre",
"ch": [],
"bon": 16,
"s": 40,
"u": "sections"
},
{
"q": "Sur un contenant transvidé, l'étiquette du lieu de travail indique…",
"ch": [
"le nom du produit",
"les précautions à prendre",
"qu'une FDS est disponible",
"le prix du produit"
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
"q": "Tu trouves une seringue dans les toilettes.",
"ch": [
"Je la prends avec les doigts et je la jette",
"Je remets le capuchon",
"Avec une pince, pointe vers le bas, dans un contenant rigide",
"Je la laisse là"
],
"bon": 2,
"s": 20
},
{
"q": "Pousser ou tirer un chariot lourd?",
"ch": [
"Tirer",
"Pousser",
"C'est pareil",
"Le porter"
],
"bon": 1,
"s": 20,
"expl": "Tu vois devant toi et ton dos est mieux placé."
},
{
"q": "Un chiffon qui passe de la toilette au comptoir, c'est…",
"ch": [
"de la contamination croisée",
"une désinfection",
"un gain de temps",
"une bonne pratique"
],
"bon": 0,
"s": 20
},
{
"q": "Dans le code de couleurs le plus utilisé, le chiffon ROUGE sert…",
"ch": [
"aux bureaux",
"à la cuisine",
"aux toilettes et urinoirs",
"aux vitres"
],
"bon": 2,
"s": 20
},
{
"q": "Un chiffon plié en deux, puis encore en deux, donne combien de faces propres?",
"t": "nombre",
"ch": [],
"bon": 8,
"s": 40,
"u": "faces"
},
{
"q": "L'erreur la plus fréquente avec un désinfectant :",
"ch": [
"l'utiliser sur une surface propre",
"essuyer tout de suite sans respecter le temps de contact",
"le diluer avec de l'eau",
"le ranger fermé"
],
"bon": 1,
"s": 20
},
{
"q": "Nettoyer et désinfecter, c'est la même chose.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "On nettoie d'abord : la saleté empêche le désinfectant d'agir."
},
{
"q": "Dilution 1 : 64 dans 1 L (1 000 mL) d'eau : combien de mL de produit (arrondi)?",
"t": "nombre",
"ch": [],
"bon": 15,
"s": 50,
"u": "mL",
"expl": "1 000 ÷ 64 = 15,6 mL, arrondi à 15 mL."
},
{
"q": "Javellisant et nettoyant à l'ammoniaque mélangés :",
"ch": [
"nettoient deux fois mieux",
"dégagent un gaz toxique : jamais",
"sentent meilleur",
"sont plus écologiques"
],
"bon": 1,
"s": 20
},
{
"q": "Avant de brancher une machine dans un endroit mouillé, ton garde du corps est…",
"ch": [
"le DDFT",
"le fusible",
"la rallonge",
"le cône jaune"
],
"bon": 0,
"s": 20
}
]
},
{
"id": "defi-entretien-menager-egi-2",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Entretien ménager d'un bâtiment · Défi+ 2 de 3",
"sujet": "Modules 7 à 17 : planchers, hôtel, aréna, vitres, extérieur, piscine, urgences, sanitaires, eau chaude",
"couv": "img/couvertures/entretien-menager-egi.jpg",
"coul": "#2E8B57",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Un fini à plancher s'applique…",
"ch": [
"en une couche épaisse",
"en plusieurs couches minces et égales",
"avec la vadrouille du lavage",
"sans attendre le séchage"
],
"bon": 1,
"s": 20
},
{
"q": "Un plancher brillant est forcément glissant.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15
},
{
"q": "Un tapis d'entrée bien posé :",
"ch": [
"bords pliés pour l'épaisseur",
"à plat, sans bloquer une porte, endos antidérapant",
"sur le seuil de la porte",
"roulé le jour"
],
"bon": 1,
"s": 20
},
{
"q": "Pourquoi suivre une séquence fixe pour faire une chambre d'hôtel en 30 minutes?",
"ch": [
"Pour ne rien oublier et aller vite",
"Parce que le client l'exige",
"Pour ranger le chariot",
"C'est la loi"
],
"bon": 0,
"s": 20
},
{
"q": "Au-delà de combien de mètres de chute une protection est-elle obligatoire?",
"t": "nombre",
"ch": [],
"bon": 3,
"s": 40,
"u": "m"
},
{
"q": "On peut déplacer un échafaudage roulant avec une personne dessus si elle se tient bien.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Personne sur l'échafaudage quand on le déplace."
},
{
"q": "Le sel de déglaçage fondu…",
"ch": [
"s'évapore",
"s'écoule vers le sol et les cours d'eau",
"disparaît en 24 h",
"nourrit la pelouse"
],
"bon": 1,
"s": 20
},
{
"q": "Pourquoi tondre le gazon haut?",
"ch": [
"Il fait plus de feuilles, donc plus de nourriture et de racines",
"Pour économiser l'essence",
"Pour que ça paraisse moins",
"Parce que la lame s'use"
],
"bon": 0,
"s": 20
},
{
"q": "Dégât d'eau : les premières étapes, dans l'ordre.",
"ch": [
"Trouver la source et la couper",
"Couper l'électricité si c'est sécuritaire",
"Retirer l'eau",
"Documenter"
],
"bon": [
0,
1,
2,
3
],
"s": 45,
"t": "ordre"
},
{
"q": "Punaises de lit dans un logement : le matelas…",
"ch": [
"on le sort dans le corridor pour l'aérer",
"on l'emballe sur place avant de le déplacer",
"on le lave à l'eau froide",
"on le laisse tel quel"
],
"bon": 1,
"s": 20
},
{
"q": "Vadrouille humide : 250 m² à l'heure. Combien d'heures pour 400 m² (sans préparation)?",
"t": "nombre",
"ch": [],
"bon": 1.6,
"s": 50,
"u": "h",
"expl": "400 ÷ 250 = 1,6 h."
},
{
"q": "Une toilette se remplit seule toutes les 10 minutes. Cause probable :",
"ch": [
"le clapet qui fuit",
"la cuvette fissurée",
"le siège mal vissé",
"le drain bouché"
],
"bon": 0,
"s": 20,
"expl": "Test du colorant."
},
{
"q": "À quoi sert la soupape de sûreté (T et P) d'un chauffe-eau?",
"ch": [
"À vider le réservoir",
"À empêcher une explosion si la pression ou la température monte trop",
"À régler la température",
"À ajouter de l'eau"
],
"bon": 1,
"s": 20
},
{
"q": "Pourquoi vidanger un chauffe-eau?",
"ch": [
"Pour sortir les sédiments (calcaire, sable)",
"Pour changer l'eau de couleur",
"Pour vérifier le thermostat",
"Ce n'est jamais nécessaire"
],
"bon": 0,
"s": 20
},
{
"q": "Une piscine publique doit respecter un règlement sur la qualité de l'eau.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
}
]
},
{
"id": "defi-entretien-menager-egi-3",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Entretien ménager d'un bâtiment · Défi+ 3 de 3",
"sujet": "Modules 17 à 28 : registres, pompes, ventilation, toits, écoles, déversements, portes, électricité, matières",
"couv": "img/couvertures/entretien-menager-egi.jpg",
"coul": "#2E8B57",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "« Ce qui n'est pas écrit n'existe pas » : à quoi sert le registre de l'eau chaude?",
"ch": [
"À prouver que l'entretien a été fait",
"À décorer la salle mécanique",
"À calculer le loyer",
"À rien"
],
"bon": 0,
"s": 20
},
{
"q": "Le drain français autour des fondations…",
"ch": [
"amène l'eau potable",
"ramasse l'eau du sol pour qu'elle ne pousse pas sur les murs",
"évacue les toilettes",
"chauffe le sous-sol"
],
"bon": 1,
"s": 20
},
{
"q": "La pompe de puisard ne part pas et l'eau monte :",
"ch": [
"c'est normal",
"urgence : flotte coincée, disjoncteur ou pompe brûlée",
"j'attends le lendemain",
"j'ouvre le robinet"
],
"bon": 1,
"s": 20
},
{
"q": "Lors d'un gros orage, qu'est-ce qui empêche l'égout de la ville de refouler dans le bâtiment?",
"ch": [
"le clapet antiretour",
"le chauffe-eau",
"le drain de toit",
"la pompe à chaleur"
],
"bon": 0,
"s": 20
},
{
"q": "Les filtres à chicanes d'une hotte de cuisine non nettoyés :",
"ch": [
"risque d'incendie de graisse",
"économisent l'énergie",
"font moins de bruit",
"durent plus longtemps"
],
"bon": 0,
"s": 20
},
{
"q": "On peut monter seul sur un toit si on fait vite.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Jamais seul : un collègue sait que tu es sur le toit."
},
{
"q": "Les dangereux glaçons au bord du toit viennent souvent…",
"ch": [
"de la chaleur du bâtiment qui fait fondre la neige par en dessous",
"du vent",
"du sel",
"des gouttières neuves"
],
"bon": 0,
"s": 20
},
{
"q": "Dans la cuisine d'une école, qui inspecte l'hygiène?",
"ch": [
"Le MAPAQ",
"La SAAQ",
"La RBQ",
"Le TAL"
],
"bon": 0,
"s": 20
},
{
"q": "Nettoyer un liquide biologique : le début de la méthode.",
"ch": [
"Isoler la zone",
"Se protéger (gants, lunettes)",
"Absorber",
"Nettoyer puis désinfecter"
],
"bon": [
0,
1,
2,
3
],
"s": 45,
"t": "ordre"
},
{
"q": "Pourquoi enlever un graffiti rapidement?",
"ch": [
"Un graffiti qui reste en attire d'autres",
"Pour la peinture qui sèche",
"Pour l'assurance seulement",
"Ce n'est pas important"
],
"bon": 0,
"s": 20
},
{
"q": "Un réfrigérateur…",
"ch": [
"fabrique du froid",
"déplace la chaleur",
"refroidit avec de la glace",
"fonctionne sans moteur"
],
"bon": 1,
"s": 20,
"expl": "Le frigorigène transporte la chaleur vers le serpentin."
},
{
"q": "On peut régler soi-même le ressort de torsion d'une porte de garage commerciale.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Énergie cachée énorme : réservé au spécialiste."
},
{
"q": "Cadenassage : les premières étapes, dans l'ordre.",
"ch": [
"Aviser",
"Arrêter l'appareil",
"Couper à la source",
"Cadenasser"
],
"bon": [
0,
1,
2,
3
],
"s": 45,
"t": "ordre"
},
{
"q": "Mélange 50:1 : combien de mL d'huile pour 4 L (4 000 mL) d'essence?",
"t": "nombre",
"ch": [],
"bon": 80,
"s": 50,
"u": "mL",
"expl": "4 000 ÷ 50 = 80 mL."
},
{
"q": "Un tube fluorescent se brise dans une classe :",
"ch": [
"je passe l'aspirateur",
"je fais sortir les gens et j'aère avant de ramasser",
"je balaie tout de suite",
"je jette les morceaux à la poubelle ordinaire"
],
"bon": 1,
"s": 20,
"expl": "Il contient du mercure : pas d'aspirateur ni de balai."
}
]
},
{
"id": "defi-lecture-plans-batiments-egi-1",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Lecture de plans de bâtiments · Défi+ 1 de 3",
"sujet": "Modules 1 à 3 : le jeu de plans, les vues, les échelles",
"couv": "img/couvertures/lecture-plans-batiments-egi.jpg",
"coul": "#534AB7",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Que veut dire le numéro de feuille E-102?",
"ch": [
"Architecture, coupe, feuille 2",
"Électricité, plan d'étage, feuille 2",
"Structure, détail 102",
"Page 102 du devis"
],
"bon": 1,
"s": 20
},
{
"q": "Le cartouche se trouve…",
"ch": [
"en haut à gauche",
"en bas à droite de chaque feuille",
"au verso",
"dans le devis seulement"
],
"bon": 1,
"s": 20
},
{
"q": "Les plans « tel que construit » montrent…",
"ch": [
"ce qui était prévu",
"les changements faits sur le chantier",
"le prix des travaux",
"les plans de la ville"
],
"bon": 1,
"s": 20
},
{
"q": "Le plan de structure montre…",
"ch": [
"ce qui porte le bâtiment : on ne le perce pas sans autorisation",
"les couleurs de peinture",
"les prises de courant",
"le mobilier"
],
"bon": 0,
"s": 20
},
{
"q": "Le devis, c'est…",
"ch": [
"les textes qui décrivent la qualité des matériaux et la façon d'exécuter",
"le dessin du toit",
"le reçu du fournisseur",
"la liste des employés"
],
"bon": 0,
"s": 20
},
{
"q": "Plier un plan en accordéon : où doit se retrouver le cartouche?",
"ch": [
"À l'intérieur",
"Visible, sur le dessus",
"Coupé",
"Peu importe"
],
"bon": 1,
"s": 20
},
{
"q": "Dans les trois vues d'un objet, la vue de dessus se place…",
"ch": [
"au-dessus de la vue de face",
"à gauche de la vue de face",
"sous la vue de côté",
"n'importe où"
],
"bon": 0,
"s": 20
},
{
"q": "Les hauteurs se mesurent à partir…",
"ch": [
"du sous-plancher",
"de la dalle de béton",
"du plancher fini",
"du plafond"
],
"bon": 2,
"s": 20
},
{
"q": "Sur une coupe, les flèches au bout du trait de coupe indiquent…",
"ch": [
"le sens du regard",
"la pente",
"le nord",
"l'entrée"
],
"bon": 0,
"s": 20
},
{
"q": "Un cercle de détail sur une coupe sert à…",
"ch": [
"renvoyer à un zoom d'une petite partie",
"indiquer une colonne",
"marquer une sortie",
"décorer le plan"
],
"bon": 0,
"s": 20
},
{
"q": "Sur le papier isométrique, les longueurs et les profondeurs sont tracées à…",
"ch": [
"30°",
"45°",
"60°",
"90°"
],
"bon": 0,
"s": 20
},
{
"q": "Une poutre au-dessus du plan de coupe est dessinée en trait interrompu.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Qu'est-ce qu'on trouve sur une élévation?",
"ch": [
"Hauteurs des planchers et des toits",
"Portes et fenêtres",
"Matériaux de revêtement",
"Les prises de chaque pièce"
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
"q": "Une différence de combien de mm de hauteur peut empêcher un appareil d'entrer sous un comptoir (exemple du livre)?",
"t": "nombre",
"ch": [],
"bon": 20,
"s": 40,
"u": "mm"
},
{
"q": "Le plan d'implantation montre…",
"ch": [
"le bâtiment sur son terrain",
"l'intérieur des murs",
"le détail d'un raccord",
"le tableau électrique"
],
"bon": 0,
"s": 20
}
]
},
{
"id": "defi-lecture-plans-batiments-egi-2",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Lecture de plans de bâtiments · Défi+ 2 de 3",
"sujet": "Modules 3 à 6 : échelles, cotes et symboles, croquis, architecture",
"couv": "img/couvertures/lecture-plans-batiments-egi.jpg",
"coul": "#534AB7",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "À 1:50, une ligne mesure 72 mm sur le plan. Longueur réelle?",
"t": "nombre",
"ch": [],
"bon": 3600,
"s": 50,
"u": "mm",
"expl": "72 × 50 = 3 600 mm."
},
{
"q": "À 1:100, un mur réel de 7 500 mm mesure combien sur le plan?",
"t": "nombre",
"ch": [],
"bon": 75,
"s": 50,
"u": "mm",
"expl": "plan = réel ÷ échelle."
},
{
"q": "Lire un ruban en pouces : du plus long trait au plus court.",
"ch": [
"1/2 po",
"1/4 po",
"1/8 po",
"1/16 po"
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
"q": "Un « 2 × 4 » raboté mesure en vrai environ…",
"ch": [
"2 × 4 po",
"1 1/2 × 3 1/2 po",
"2 1/2 × 4 1/2 po",
"1 × 3 po"
],
"bon": 1,
"s": 20,
"expl": "Taille nominale avant séchage et rabotage."
},
{
"q": "Sur une règle d'architecte, à 1/4 po = 1 pi, chaque grand intervalle vaut…",
"ch": [
"1 pouce",
"1 pied réel",
"1 mètre",
"1/4 de pied"
],
"bon": 1,
"s": 20
},
{
"q": "Les dessins d'un exercice « pas à l'échelle » : pour trouver une cote manquante, on…",
"ch": [
"mesure avec la règle",
"calcule à partir des autres cotes",
"devine",
"prend la cote voisine"
],
"bon": 1,
"s": 20
},
{
"q": "Les cotes d'un plan métrique sont écrites en…",
"ch": [
"centimètres",
"millimètres, sans le symbole",
"mètres",
"pouces"
],
"bon": 1,
"s": 20
},
{
"q": "Un tableau de spécifications (portes, fenêtres, appareils) se lit grâce…",
"ch": [
"au repère placé sur le plan (P1, F3…)",
"à la couleur",
"à l'échelle",
"au cartouche seulement"
],
"bon": 0,
"s": 20
},
{
"q": "Un bon croquis à main levée, c'est…",
"ch": [
"des traits droits, des angles carrés, des proportions justes",
"un dessin artistique",
"un dessin sans mesures",
"une photo"
],
"bon": 0,
"s": 20
},
{
"q": "L'erreur classique quand on fait le croquis d'une pièce :",
"ch": [
"revenir avec une mesure manquante",
"utiliser un crayon",
"dessiner la porte",
"mesurer deux fois"
],
"bon": 0,
"s": 20
},
{
"q": "L'ouverture brute d'une porte est plus grande que la porte d'environ…",
"ch": [
"5 mm",
"50 mm",
"500 mm",
"aucune différence"
],
"bon": 1,
"s": 20
},
{
"q": "Sur le plan de structure, la flèche à deux pointes indique…",
"ch": [
"le sens des solives",
"la sortie",
"le nord",
"une pente de toit"
],
"bon": 0,
"s": 20
},
{
"q": "Les solives et les montants sont souvent espacés de combien de mm?",
"t": "nombre",
"ch": [],
"bon": 400,
"s": 40,
"u": "mm"
},
{
"q": "Avant de percer un mur, les plans te disent…",
"ch": [
"ce qu'il y a derrière : montants, fils, tuyaux",
"la couleur de la peinture",
"l'âge du bâtiment",
"rien d'utile"
],
"bon": 0,
"s": 20
},
{
"q": "Les hauteurs des prises et des interrupteurs se mesurent depuis la dalle de béton.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Depuis le plancher fini."
}
]
},
{
"id": "defi-lecture-plans-batiments-egi-3",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Lecture de plans de bâtiments · Défi+ 3 de 3",
"sujet": "Modules 7 à 9 : électricité, plomberie et chauffage, sécurité",
"couv": "img/couvertures/lecture-plans-batiments-egi.jpg",
"coul": "#534AB7",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Sur le plan E-101, le plan d'architecture apparaît…",
"ch": [
"en gris pâle sous les dispositifs",
"en rouge",
"il n'apparaît pas",
"en pointillé bleu"
],
"bon": 0,
"s": 20
},
{
"q": "Le tableau du panneau sert à trouver…",
"ch": [
"quel disjoncteur alimente un appareil",
"le prix des luminaires",
"la hauteur des prises",
"le nombre de portes"
],
"bon": 0,
"s": 20
},
{
"q": "Avant de remplacer un luminaire qui grésille :",
"ch": [
"je coupe le bon disjoncteur et je vérifie l'absence de tension",
"je le change sous tension",
"je coupe le principal du bâtiment sans avertir",
"je mets du ruban"
],
"bon": 0,
"s": 20
},
{
"q": "Sur un plan de plomberie, l'eau froide est souvent en…",
"ch": [
"bleu",
"rouge",
"vert",
"jaune"
],
"bon": 0,
"s": 20
},
{
"q": "Fuite sur une branche d'eau froide : quel robinet fermer d'abord?",
"ch": [
"Le principal du bâtiment",
"Le robinet le plus proche avant la fuite",
"Celui de l'eau chaude",
"Aucun"
],
"bon": 1,
"s": 20
},
{
"q": "Un regard de nettoyage (en anglais : cleanout) sert à…",
"ch": [
"déboucher le drain",
"fermer l'eau",
"purger l'air du chauffage",
"mesurer la pression"
],
"bon": 0,
"s": 20
},
{
"q": "Sur une boucle de chauffage à eau chaude, le purgeur sert à…",
"ch": [
"évacuer l'air",
"ajouter de l'eau chaude",
"fermer la plinthe",
"mesurer la température"
],
"bon": 0,
"s": 20
},
{
"q": "Lire un plan d'évacuation : dans l'ordre.",
"ch": [
"Trouver « Vous êtes ici »",
"Suivre le chemin principal",
"Repérer la sortie la plus proche",
"Repérer le point de rassemblement"
],
"bon": [
0,
1,
2,
3
],
"s": 45,
"t": "ordre"
},
{
"q": "Éléments d'un plan d'évacuation :",
"ch": [
"Vous êtes ici",
"Chemins d'évacuation",
"Sorties",
"Prix des extincteurs"
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
"q": "Une séparation coupe-feu sur le plan…",
"ch": [
"se reconnaît par un trait spécial et ne doit pas être percée sans la refaire conforme",
"peut être percée librement",
"est décorative",
"n'existe que sur le papier"
],
"bon": 0,
"s": 20
},
{
"q": "Qui tient à jour les plans « tel que construit » d'un bâtiment existant?",
"ch": [
"Le préposé, au fil des réparations",
"Personne",
"Le locataire",
"La ville"
],
"bon": 0,
"s": 20
},
{
"q": "Un échangeur ou un conduit de ventilation au plan M se trouve souvent…",
"ch": [
"au-dessus du plafond suspendu",
"dans le plancher",
"sous la dalle",
"dans les murs extérieurs"
],
"bon": 0,
"s": 20
},
{
"q": "Un plan de chauffage montre « 3 plinthes » sur une boucle : elles sont…",
"ch": [
"reliées l'une après l'autre",
"indépendantes",
"électriques",
"décoratives"
],
"bon": 0,
"s": 20
},
{
"q": "Un dispositif DDFT protège contre les chocs électriques près de l'eau.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Unifilaire : à quoi sert ce schéma?",
"ch": [
"Montrer la distribution électrique du panneau principal aux panneaux",
"Montrer les tuyaux",
"Montrer le mobilier",
"Montrer la toiture"
],
"bon": 0,
"s": 20
}
]
},
{
"id": "defi-lecture-plans-devis-c6-1",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Lecture de plans et devis (C6) · Défi+ 1 de 3",
"sujet": "Modules 1 à 3 : le monde des plans, les vues, les échelles",
"couv": "img/couvertures/lecture-plans-devis-c6.jpg",
"coul": "#854F0B",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Que veut dire le numéro de feuille P-102?",
"ch": [
"Architecture, coupe, feuille 2",
"Plomberie, plan d'étage, feuille 2",
"Structure, détail 102",
"Page 102 du devis"
],
"bon": 1,
"s": 20
},
{
"q": "Le cartouche se trouve…",
"ch": [
"en haut à gauche",
"en bas à droite de chaque feuille",
"au verso",
"dans le devis seulement"
],
"bon": 1,
"s": 20
},
{
"q": "Les plans « tel que construit » montrent…",
"ch": [
"ce qui était prévu",
"les changements faits sur le chantier",
"le prix des travaux",
"les plans de la ville"
],
"bon": 1,
"s": 20
},
{
"q": "Le plan de structure montre…",
"ch": [
"ce qui porte le bâtiment : on ne le perce pas sans autorisation",
"les couleurs de peinture",
"les prises de courant",
"le mobilier"
],
"bon": 0,
"s": 20
},
{
"q": "Le devis, c'est…",
"ch": [
"les textes qui décrivent la qualité des matériaux et la façon d'exécuter",
"le dessin du toit",
"le reçu du fournisseur",
"la liste des employés"
],
"bon": 0,
"s": 20
},
{
"q": "Plier un plan en accordéon : où doit se retrouver le cartouche?",
"ch": [
"À l'intérieur",
"Visible, sur le dessus",
"Coupé",
"Peu importe"
],
"bon": 1,
"s": 20
},
{
"q": "Dans les trois vues d'un objet, la vue de dessus se place…",
"ch": [
"au-dessus de la vue de face",
"à gauche de la vue de face",
"sous la vue de côté",
"n'importe où"
],
"bon": 0,
"s": 20
},
{
"q": "Les hauteurs se mesurent à partir…",
"ch": [
"du sous-plancher",
"de la dalle de béton",
"du plancher fini",
"du plafond"
],
"bon": 2,
"s": 20
},
{
"q": "Sur une coupe, les flèches au bout du trait de coupe indiquent…",
"ch": [
"le sens du regard",
"la pente",
"le nord",
"l'entrée"
],
"bon": 0,
"s": 20
},
{
"q": "Un cercle de détail sur une coupe sert à…",
"ch": [
"renvoyer à un zoom d'une petite partie",
"indiquer une colonne",
"marquer une sortie",
"décorer le plan"
],
"bon": 0,
"s": 20
},
{
"q": "Sur le papier isométrique, les longueurs et les profondeurs sont tracées à…",
"ch": [
"30°",
"45°",
"60°",
"90°"
],
"bon": 0,
"s": 20
},
{
"q": "Une poutre au-dessus du plan de coupe est dessinée en trait interrompu.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Qu'est-ce qu'on trouve sur une élévation?",
"ch": [
"Hauteurs des planchers et des toits",
"Portes et fenêtres",
"Matériaux de revêtement",
"Les prises de chaque pièce"
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
"q": "Une différence de combien de mm de hauteur peut empêcher un appareil d'entrer sous un comptoir (exemple du livre)?",
"t": "nombre",
"ch": [],
"bon": 20,
"s": 40,
"u": "mm"
},
{
"q": "Le plan d'implantation montre…",
"ch": [
"le bâtiment sur son terrain",
"l'intérieur des murs",
"le détail d'un raccord",
"le tableau électrique"
],
"bon": 0,
"s": 20
}
]
},
{
"id": "defi-lecture-plans-devis-c6-2",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Lecture de plans et devis (C6) · Défi+ 2 de 3",
"sujet": "Modules 3 à 6 : échelles, cotes et symboles, croquis, plans de plomberie",
"couv": "img/couvertures/lecture-plans-devis-c6.jpg",
"coul": "#854F0B",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "À 1:50, une ligne mesure 72 mm sur le plan. Longueur réelle?",
"t": "nombre",
"ch": [],
"bon": 3600,
"s": 50,
"u": "mm",
"expl": "72 × 50 = 3 600 mm."
},
{
"q": "À 1:100, un mur réel de 7 500 mm mesure combien sur le plan?",
"t": "nombre",
"ch": [],
"bon": 75,
"s": 50,
"u": "mm",
"expl": "plan = réel ÷ échelle."
},
{
"q": "Lire un ruban en pouces : du plus long trait au plus court.",
"ch": [
"1/2 po",
"1/4 po",
"1/8 po",
"1/16 po"
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
"q": "Un « 2 × 4 » raboté mesure en vrai environ…",
"ch": [
"2 × 4 po",
"1 1/2 × 3 1/2 po",
"2 1/2 × 4 1/2 po",
"1 × 3 po"
],
"bon": 1,
"s": 20,
"expl": "Taille nominale avant séchage et rabotage."
},
{
"q": "Sur une règle d'architecte, à 1/4 po = 1 pi, chaque grand intervalle vaut…",
"ch": [
"1 pouce",
"1 pied réel",
"1 mètre",
"1/4 de pied"
],
"bon": 1,
"s": 20
},
{
"q": "Les dessins d'un exercice « pas à l'échelle » : pour trouver une cote manquante, on…",
"ch": [
"mesure avec la règle",
"calcule à partir des autres cotes",
"devine",
"prend la cote voisine"
],
"bon": 1,
"s": 20
},
{
"q": "Les cotes d'un plan métrique sont écrites en…",
"ch": [
"centimètres",
"millimètres, sans le symbole",
"mètres",
"pouces"
],
"bon": 1,
"s": 20
},
{
"q": "Un tableau de spécifications (portes, fenêtres, appareils) se lit grâce…",
"ch": [
"au repère placé sur le plan (P1, F3…)",
"à la couleur",
"à l'échelle",
"au cartouche seulement"
],
"bon": 0,
"s": 20
},
{
"q": "Un drain de 7,5 m avec une pente de 2 % : quelle chute, en cm?",
"t": "nombre",
"ch": [],
"bon": 15,
"s": 50,
"u": "cm",
"expl": "7,5 × 0,02 = 0,15 m."
},
{
"q": "Le schéma de colonne :",
"ch": [
"ne respecte pas l'échelle : chaque étage est une ligne",
"est toujours à 1:50",
"montre le mobilier",
"remplace le devis"
],
"bon": 0,
"s": 20
},
{
"q": "Un tuyau mal supporté…",
"ch": [
"s'affaisse, fait des points bas et du bruit",
"dure plus longtemps",
"se dilate moins",
"n'a aucun problème"
],
"bon": 0,
"s": 20
},
{
"q": "Contourner un obstacle de 150 mm avec deux coudes de 45° : le tuyau entre les deux est…",
"ch": [
"une diagonale",
"vertical",
"horizontal",
"inutile"
],
"bon": 0,
"s": 20
},
{
"q": "Liste de matériel : 3 000 mm de tuyau + 10 % de pertes = combien de mm?",
"t": "nombre",
"ch": [],
"bon": 3300,
"s": 45,
"u": "mm"
},
{
"q": "Pendant un gros orage, qu'est-ce qui empêche l'égout de refouler par le drain de plancher?",
"ch": [
"le clapet antiretour",
"le siphon",
"l'évent",
"le robinet d'arrêt"
],
"bon": 0,
"s": 20
},
{
"q": "Le tableau des appareils (P-601) donne pour chaque repère…",
"ch": [
"les diamètres EF, EC et évacuation",
"le prix",
"la couleur",
"le fournisseur seulement"
],
"bon": 0,
"s": 20
}
]
},
{
"id": "defi-lecture-plans-devis-c6-3",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Lecture de plans et devis (C6) · Défi+ 3 de 3",
"sujet": "Modules 6 à 8 : plomberie, chauffage, devis et estimation",
"couv": "img/couvertures/lecture-plans-devis-c6.jpg",
"coul": "#854F0B",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Réseaux sous pression et par gravité : lequel est par gravité?",
"ch": [
"L'eau froide",
"L'eau chaude",
"L'évacuation",
"La recirculation"
],
"bon": 2,
"s": 20
},
{
"q": "Où l'eau entre-t-elle et où converge toute l'évacuation d'un bâtiment?",
"ch": [
"Au sous-sol",
"Au toit",
"Au 2e étage",
"Dans la cuisine"
],
"bon": 0,
"s": 20
},
{
"q": "Un toit plat se vide par…",
"ch": [
"des drains de toit (DT)",
"des gouttières seulement",
"l'évent",
"les murs"
],
"bon": 0,
"s": 20
},
{
"q": "Dans un chauffage à eau chaude, l'eau chauffée sort par le haut : c'est…",
"ch": [
"l'alimentation (AL)",
"le retour (RET)",
"l'évent",
"le drain"
],
"bon": 0,
"s": 20
},
{
"q": "Le circulateur…",
"ch": [
"pousse l'eau dans la boucle",
"chauffe l'eau",
"purge l'air",
"mesure la pression"
],
"bon": 0,
"s": 20
},
{
"q": "Dans un chauffage à vapeur, la vapeur monte au radiateur…",
"ch": [
"toute seule, sans pompe",
"avec un circulateur",
"avec un ventilateur",
"par gravité vers le bas"
],
"bon": 0,
"s": 20
},
{
"q": "Un tuyau de cuivre qui chauffe…",
"ch": [
"s'allonge (dilatation)",
"rapetisse",
"ne change pas",
"devient plus mince"
],
"bon": 0,
"s": 20
},
{
"q": "Les divisions du devis : la plomberie est la division…",
"ch": [
"01",
"22",
"26",
"09"
],
"bon": 1,
"s": 20
},
{
"q": "Les changements demandés par le client et l'architecte pendant le projet se trouvent dans…",
"ch": [
"les addenda et avis de changement",
"le cartouche",
"la légende",
"le schéma de colonne"
],
"bon": 0,
"s": 20
},
{
"q": "Les tuyaux se vendent…",
"ch": [
"en longueurs entières",
"au centimètre exact",
"au poids",
"à l'unité de raccord"
],
"bon": 0,
"s": 20
},
{
"q": "Le fournisseur donne une liste de prix, souvent avec…",
"ch": [
"un escompte pour l'entrepreneur",
"une taxe double",
"un rabais au client seulement",
"aucun prix"
],
"bon": 0,
"s": 20
},
{
"q": "Sur un plan de chauffage, AL et RET voyagent…",
"ch": [
"ensemble, deux tuyaux d'un étage à l'autre",
"séparément sur des étages différents",
"dans le même tuyau",
"dans l'évent"
],
"bon": 0,
"s": 20
},
{
"q": "Le tableau M-601 donne, pour chaque repère de chauffage…",
"ch": [
"le modèle et les caractéristiques de l'équipement",
"le salaire du plombier",
"le nombre de portes",
"les heures d'ouverture"
],
"bon": 0,
"s": 20
},
{
"q": "Une estimation de matériel prévoit des pertes (environ 10 %).",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "La chute d'un drain se calcule : longueur × pente.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
}
]
},
{
"id": "defi-plomberie-chauffage-1",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Plomberie et chauffage (EGI) · Défi+ 1 de 3",
"sujet": "Modules 1 à 3 : le rôle du préposé, les maths de la tuyauterie, les matériaux",
"couv": "img/couvertures/plomberie-chauffage.jpg",
"coul": "#B3261E",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Un problème « rouge » dans la grille du préposé :",
"ch": [
"je le règle seul",
"le superviseur fait appel au spécialiste (plombier, mécanicien)",
"j'attends la semaine prochaine",
"je l'ignore"
],
"bon": 1,
"s": 20
},
{
"q": "Un joint étanche commence par…",
"ch": [
"une coupe d'équerre et un tuyau propre et ébavuré",
"beaucoup de soudure",
"un tuyau sale",
"une coupe en biais"
],
"bon": 0,
"s": 20
},
{
"q": "La pince à sertir PEX se vérifie avec…",
"ch": [
"le calibre « go / no-go »",
"un ruban à mesurer",
"un niveau",
"un multimètre"
],
"bon": 0,
"s": 20
},
{
"q": "Les premières étapes du brasage tendre : dans l'ordre.",
"ch": [
"Couper",
"Aléser",
"Nettoyer",
"Appliquer le flux"
],
"bon": [
0,
1,
2,
3
],
"s": 45,
"t": "ordre"
},
{
"q": "Combien de petites divisions dans un pouce si on lit au 1/16?",
"t": "nombre",
"ch": [],
"bon": 16,
"s": 40,
"u": ""
},
{
"q": "Convertir 0,75 po en fraction :",
"ch": [
"1/2",
"3/4",
"5/8",
"7/8"
],
"bon": 1,
"s": 20
},
{
"q": "Les tuyaux de drainage horizontaux…",
"ch": [
"sont toujours à niveau",
"descendent légèrement pour que l'eau coule par gravité",
"montent vers l'égout",
"sont verticaux"
],
"bon": 1,
"s": 20
},
{
"q": "Plus une colonne d'eau est haute…",
"ch": [
"plus la pression au bas est forte",
"moins il y a de pression",
"plus l'eau est chaude",
"rien ne change"
],
"bon": 0,
"s": 20
},
{
"q": "Un tuyau « de 3/4 » : ce 3/4, c'est…",
"ch": [
"son diamètre nominal (un nom, pas une mesure exacte)",
"son diamètre extérieur exact",
"sa longueur",
"son épaisseur"
],
"bon": 0,
"s": 20
},
{
"q": "Raccorder de l'acier galvanisé directement à du cuivre :",
"ch": [
"aucun problème",
"crée une pile : corrosion galvanique",
"rend l'eau plus douce",
"augmente la pression"
],
"bon": 1,
"s": 20,
"expl": "On met un raccord diélectrique."
},
{
"q": "Sur le collage de l'ABS, on emboîte complètement et on donne un quart de tour.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Avant de souder près du bois :",
"ch": [
"protéger avec un écran ignifuge",
"mouiller le bois",
"souder plus vite",
"rien de spécial"
],
"bon": 0,
"s": 20
},
{
"q": "Quels équipements de protection pour le préposé en salle mécanique?",
"ch": [
"Casque",
"Lunettes",
"Gants",
"Sandales"
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
"q": "La loi R-20 encadre…",
"ch": [
"l'industrie de la construction",
"les loyers",
"la santé publique",
"les écoles"
],
"bon": 0,
"s": 20
},
{
"q": "À 45°, si le déplacement vertical est de 6 po, le déplacement horizontal est…",
"ch": [
"3 po",
"6 po",
"12 po",
"8,5 po"
],
"bon": 1,
"s": 20
}
]
},
{
"id": "defi-plomberie-chauffage-2",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Plomberie et chauffage (EGI) · Défi+ 2 de 3",
"sujet": "Modules 4 à 8 : raccords, alimentation, drainage, appareils, chauffe-eau",
"couv": "img/couvertures/plomberie-chauffage.jpg",
"coul": "#B3261E",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Sur un plan, les longueurs sont données…",
"ch": [
"centre à centre (CC)",
"bout à bout",
"en mètres",
"au hasard"
],
"bon": 0,
"s": 20
},
{
"q": "Longueur de coupe d'un tuyau :",
"ch": [
"CC + prises",
"CC − prises des raccords",
"CC × 2",
"CC ÷ 2"
],
"bon": 1,
"s": 20
},
{
"q": "Un raccord sert à…",
"ch": [
"changer de direction",
"dériver",
"changer de grosseur",
"chauffer l'eau"
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
"q": "Pour le préposé, le plus important avec les robinets :",
"ch": [
"savoir lequel fermer et où il est",
"connaître leur prix",
"les peindre",
"les changer chaque année"
],
"bon": 0,
"s": 20
},
{
"q": "Si un clapet empêche l'eau de retourner vers la rue, la dilatation de l'eau chaude…",
"ch": [
"fait monter la pression : on installe un réservoir d'expansion",
"n'a aucun effet",
"refroidit l'eau",
"vide le chauffe-eau"
],
"bon": 0,
"s": 20
},
{
"q": "Le siphon sert à…",
"ch": [
"garder une garde d'eau qui bloque les gaz d'égout",
"accélérer l'eau",
"filtrer l'eau",
"chauffer l'eau"
],
"bon": 0,
"s": 20
},
{
"q": "La ventilation (évent) du réseau de drainage sert à…",
"ch": [
"laisser entrer l'air pour que les siphons ne se vident pas",
"évacuer la chaleur",
"faire du bruit",
"augmenter la pression d'eau"
],
"bon": 0,
"s": 20
},
{
"q": "Un regard de nettoyage donne accès…",
"ch": [
"à l'intérieur du drain pour un furet ou une caméra",
"à l'eau chaude",
"au compteur",
"au chauffe-eau"
],
"bon": 0,
"s": 20
},
{
"q": "Un seul appareil se vide mal; les autres vont bien :",
"ch": [
"le problème est dans son renvoi ou son siphon",
"l'égout de la ville est bouché",
"le toit fuit",
"le chauffe-eau est brisé"
],
"bon": 0,
"s": 20
},
{
"q": "L'appareil qui génère le plus de bons de travail dans un immeuble :",
"ch": [
"la toilette",
"le lavabo",
"la douche",
"le chauffe-eau"
],
"bon": 0,
"s": 20
},
{
"q": "Robinet à cartouche : l'eau chaude est…",
"ch": [
"à gauche",
"à droite",
"au centre",
"en haut"
],
"bon": 0,
"s": 20
},
{
"q": "Une soupape T&P s'ouvre au-dessus d'environ combien de psi?",
"t": "nombre",
"ch": [],
"bon": 150,
"s": 40,
"u": "psi"
},
{
"q": "Tester une soupape T&P :",
"ch": [
"lever le levier quelques secondes, un seau sous la sortie",
"la dévisser",
"boucher la sortie",
"la peindre"
],
"bon": 0,
"s": 20
},
{
"q": "L'anode d'un chauffe-eau…",
"ch": [
"se sacrifie pour protéger le réservoir de la corrosion",
"chauffe l'eau",
"règle la température",
"mesure la pression"
],
"bon": 0,
"s": 20
},
{
"q": "Avant de travailler sur un chauffe-eau électrique, on cadenasse le disjoncteur et on vérifie l'absence de tension.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
}
]
},
{
"id": "defi-plomberie-chauffage-3",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Plomberie et chauffage (EGI) · Défi+ 3 de 3",
"sujet": "Modules 9 à 13 : chaudière, brûleur à l'huile, autres systèmes, pompes, entretien préventif",
"couv": "img/couvertures/plomberie-chauffage.jpg",
"coul": "#B3261E",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Chauffée de 10 °C à 82 °C, l'eau prend environ combien de % de volume?",
"t": "nombre",
"ch": [],
"bon": 3,
"s": 40,
"u": "%"
},
{
"q": "Le vase d'expansion d'une chaudière…",
"ch": [
"absorbe le surplus de volume de l'eau chaude",
"chauffe l'eau",
"purge l'air",
"alimente le brûleur"
],
"bon": 0,
"s": 20
},
{
"q": "Les radiateurs en fonte…",
"ch": [
"chauffent lentement et gardent la chaleur longtemps",
"chauffent instantanément",
"ne gardent pas la chaleur",
"fonctionnent à la vapeur seulement"
],
"bon": 0,
"s": 20
},
{
"q": "Le gicleur d'un brûleur à l'huile…",
"ch": [
"transforme le mazout en fin brouillard",
"allume l'étincelle",
"pompe l'eau",
"mesure la flamme"
],
"bon": 0,
"s": 20
},
{
"q": "La cellule CdS du brûleur…",
"ch": [
"voit la flamme : sa résistance baisse à la lumière",
"mesure la pression",
"chauffe le mazout",
"règle la température"
],
"bon": 0,
"s": 20
},
{
"q": "L'entretien annuel du brûleur se fait…",
"ch": [
"avant la saison de chauffage, par un mécanicien certifié",
"en plein hiver par le préposé",
"jamais",
"chaque semaine"
],
"bon": 0,
"s": 20
},
{
"q": "Une thermopompe air-air…",
"ch": [
"chauffe l'hiver et climatise l'été en déplaçant la chaleur",
"brûle du mazout",
"fonctionne à la vapeur",
"chauffe seulement l'eau"
],
"bon": 0,
"s": 20
},
{
"q": "Amorcer une pompe centrifuge, c'est…",
"ch": [
"remplir d'eau son corps et l'aspiration en chassant l'air",
"l'allumer à sec",
"changer son moteur",
"la vider"
],
"bon": 0,
"s": 20
},
{
"q": "Une pompe qui perd sa charge sans cesse : on cherche surtout…",
"ch": [
"du côté aspiration (fuite d'air)",
"du côté refoulement",
"dans le panneau électrique",
"dans le toit"
],
"bon": 0,
"s": 20
},
{
"q": "Test saisonnier de la pompe de puisard : dans l'ordre.",
"ch": [
"Retirer le couvercle",
"Verser lentement un seau d'eau",
"Le flotteur monte et la pompe part",
"Vérifier qu'elle s'arrête"
],
"bon": [
0,
1,
2,
3
],
"s": 45,
"t": "ordre"
},
{
"q": "En gelant, l'eau prend environ combien de % de volume?",
"t": "nombre",
"ch": [],
"bon": 9,
"s": 40,
"u": "%"
},
{
"q": "Le registre de la salle mécanique sert à…",
"ch": [
"noter date, appareil, lecture ou travail, initiales",
"décorer",
"afficher les prix",
"rien"
],
"bon": 0,
"s": 20
},
{
"q": "Lors d'une inspection, les priorités se justifient…",
"ch": [
"par la sécurité d'abord",
"par le coût le plus bas",
"par l'ordre alphabétique",
"au hasard"
],
"bon": 0,
"s": 20
},
{
"q": "Un tuyau qui gèle peut fendre ou faire sauter ses raccords.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Pression normale d'une chaudière à eau chaude, à froid (exemple de registre) :",
"ch": [
"environ 12 à 15 psi",
"150 psi",
"1 psi",
"60 psi"
],
"bon": 0,
"s": 20
}
]
},
{
"id": "defi-recherche-emploi-plc-1",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Recherche d'emploi (Plomberie et chauffage) · Défi+ 1 de 3",
"sujet": "Modules 1 à 3 : mon bilan, le marché, le CV",
"couv": "img/couvertures/recherche-emploi-plc.jpg",
"coul": "#1F6FB2",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Savoir, savoir-faire, savoir-être : lesquels sont du savoir-être?",
"ch": [
"La ponctualité",
"Le travail d'équipe",
"Souder un raccord",
"La politesse avec les clients"
],
"bon": [
0,
1,
3
],
"s": 30,
"t": "multi"
},
{
"q": "« Travaillant, ponctuel et fiable » ne vaut rien sans…",
"ch": [
"une preuve : un fait précis",
"un diplôme",
"une photo",
"un ton de voix fort"
],
"bon": 0,
"s": 20
},
{
"q": "Tu as « juste été caissier ». Que dis-tu à l'employeur?",
"ch": [
"Rien, ça ne compte pas",
"Ce que l'emploi t'a appris, relié à l'emploi visé",
"Que tu détestais cet emploi",
"Que tu as été caissier, sans plus"
],
"bon": 1,
"s": 20
},
{
"q": "Un défi (point à améliorer) se présente avec un moyen concret que tu prends pour t'améliorer.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "L'IA a écrit « Expert en plomberie depuis 10 ans » dans ton bilan. Tu…",
"ch": [
"le gardes, ça paraît bien",
"corriges : il faut que ce soit vrai",
"ajoutes 5 ans de plus",
"l'envoies tel quel"
],
"bon": 1,
"s": 20
},
{
"q": "Pour devenir compagnon tuyauteur, combien d'heures faut-il accumuler dans le carnet d'apprentissage?",
"ch": [
"2 000",
"4 000",
"8 000",
"12 000"
],
"bon": 2,
"s": 20,
"expl": "Quatre périodes de 2 000 heures, puis l'examen de qualification."
},
{
"q": "Les chantiers régis par la CCQ, c'est…",
"ch": [
"le monde de la construction",
"l'entretien d'immeubles",
"la vente au détail",
"le commerce de pièces"
],
"bon": 0,
"s": 20
},
{
"q": "Le « marché caché », c'est…",
"ch": [
"les emplois jamais affichés, comblés par recommandation",
"les emplois au noir",
"les sites payants",
"les emplois à l'étranger"
],
"bon": 0,
"s": 20
},
{
"q": "Quels sont des secteurs de la construction?",
"ch": [
"Résidentiel",
"Institutionnel et commercial",
"Industriel",
"Restauration"
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
"q": "Trouve l'erreur dans cette phrase.",
"t": "erreur",
"ch": [
"Responsable de l'entretient",
"des chauffe-eau",
"de l'immeuble."
],
"bon": 0,
"s": 30,
"expl": "On écrit « entretien », sans t."
},
{
"q": "Construction ou hors construction : laquelle est régie par la CCQ?",
"ch": [
"Construction",
"Hors construction",
"Les deux",
"Aucune"
],
"bon": 0,
"s": 20
},
{
"q": "Un chemin (construction ou hors construction) est toujours meilleur que l'autre.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Tout dépend de ce qui compte pour toi."
},
{
"q": "Ton message de boîte vocale idéal :",
"ch": [
"de la musique forte",
"ton nom, clair et poli",
"aucun message",
"une blague"
],
"bon": 1,
"s": 20
},
{
"q": "Ton bilan personnel complet, l'employeur…",
"ch": [
"ne le voit jamais tel quel : c'est un document de travail",
"le reçoit avec le CV",
"le signe",
"le garde au dossier"
],
"bon": 0,
"s": 20
},
{
"q": "Pour améliorer un profil vague comme « Je suis motivé et j'aime travailler avec mes mains » :",
"ch": [
"ajouter un fait précis et chiffré",
"ajouter des points d'exclamation",
"l'écrire en majuscules",
"le raccourcir à un mot"
],
"bon": 0,
"s": 20
}
]
},
{
"id": "defi-recherche-emploi-plc-2",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Recherche d'emploi (Plomberie et chauffage) · Défi+ 2 de 3",
"sujet": "Modules 3 à 6 : CV, recherche en ligne, plan de recherche, lettre",
"couv": "img/couvertures/recherche-emploi-plc.jpg",
"coul": "#1F6FB2",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Les références, on…",
"ch": [
"les met en bas du CV",
"écrit « Références sur demande »",
"les prépare sur une liste séparée",
"ne les donne jamais"
],
"bon": 2,
"s": 20
},
{
"q": "Une bonne puce de CV commence par…",
"ch": [
"« J'aidais… »",
"un verbe d'action : installé, réparé, inspecté",
"une date",
"le nom de l'employeur"
],
"bon": 1,
"s": 20
},
{
"q": "Une adresse courriel pour postuler :",
"ch": [
"bigboss_69@…",
"prenom.nom@…",
"celle de ton ami",
"aucune adresse"
],
"bon": 1,
"s": 20
},
{
"q": "Un logiciel de tri de CV cherche surtout…",
"ch": [
"les mots-clés de l'offre",
"les couleurs du CV",
"la photo",
"le nombre de pages"
],
"bon": 0,
"s": 20
},
{
"q": "Karine revient après six ans à la maison. Quel type de CV met ses forces en avant?",
"ch": [
"Le CV par compétences",
"Le CV chronologique",
"Aucun CV",
"Une lettre seulement"
],
"bon": 0,
"s": 20
},
{
"q": "Une offre te demande de l'argent pour « réserver » le poste.",
"ch": [
"Je paie vite",
"C'est probablement une fausse offre",
"C'est normal en plomberie",
"Je donne mon NAS"
],
"bon": 1,
"s": 20
},
{
"q": "Pour tes réseaux personnels, la visibilité des publications devrait être…",
"ch": [
"Public",
"Amis",
"Tout le monde",
"Sans importance"
],
"bon": 1,
"s": 20
},
{
"q": "Après le DEP, une recherche d'emploi active demande environ…",
"ch": [
"1 heure par mois",
"10 à 15 heures par semaine",
"40 heures par jour",
"aucun horaire"
],
"bon": 1,
"s": 20
},
{
"q": "Quand tu appelles une entreprise, tu notes surtout…",
"ch": [
"le nom du responsable, pour ta relance",
"la couleur des camions",
"l'adresse du site",
"le prix des pièces"
],
"bon": 0,
"s": 20
},
{
"q": "Nomme un piège à éviter dans une lettre :",
"ch": [
"Commencer toutes les phrases par « Je »",
"Adresser la lettre à la bonne personne",
"Donner une preuve de tes qualités",
"Relire avant d'envoyer"
],
"bon": 0,
"s": 20
},
{
"q": "On peut envoyer la même lettre générique à tous les employeurs.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15
},
{
"q": "Avant de cliquer sur Envoyer :",
"ch": [
"Adresse courriel professionnelle",
"Pièces jointes vraiment jointes",
"Nom du destinataire bien écrit",
"Émojis dans l'objet"
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
"q": "Créer une alerte d'emploi : dans l'ordre.",
"ch": [
"Créer un compte",
"Faire une recherche avec des mots-clés",
"Enregistrer l'alerte"
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
"q": "Sites gouvernementaux pour chercher un emploi :",
"ch": [
"Québec emploi et le Guichet-Emplois",
"Les réseaux de jeux",
"Les sites de vente usagée",
"Aucun"
],
"bon": 0,
"s": 20
},
{
"q": "Une recherche d'emploi efficace se traite comme…",
"ch": [
"un emploi à temps partiel : heures fixes et objectifs",
"un passe-temps",
"une corvée à faire une fois",
"un loisir du dimanche"
],
"bon": 0,
"s": 20
}
]
},
{
"id": "defi-recherche-emploi-plc-3",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Recherche d'emploi (Plomberie et chauffage) · Défi+ 3 de 3",
"sujet": "Modules 6 à 8 : entrevue, relance et premier emploi",
"couv": "img/couvertures/recherche-emploi-plc.jpg",
"coul": "#1F6FB2",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Les quatre parties d'une lettre de présentation : dans l'ordre.",
"ch": [
"En-tête",
"Présentation",
"Proposition",
"Conclusion"
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
"q": "On peut terminer une lettre officielle par « Merci et bonne journée! ».",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "La conclusion demande une rencontre et se termine par une formule de politesse."
},
{
"q": "Une lettre de candidature spontanée s'appuie sur…",
"ch": [
"les exigences de l'offre",
"ce que tu sais de l'employeur",
"ton horaire de la semaine",
"une lettre type envoyée à tous"
],
"bon": 1,
"s": 20,
"expl": "Sans offre, tu n'as pas d'exigences à reprendre."
},
{
"q": "La méthode STAR : dans l'ordre.",
"ch": [
"Situation",
"Tâche",
"Action",
"Résultat"
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
"q": "« Parlez-moi de vous » : l'employeur veut surtout savoir…",
"ch": [
"toute ta vie",
"pourquoi tu es ici pour ce poste",
"ton signe astrologique",
"tes loisirs du week-end"
],
"bon": 1,
"s": 20
},
{
"q": "Quand parler du salaire?",
"ch": [
"Dès la première minute",
"Quand l'employeur aborde le sujet ou au moment de l'offre",
"Jamais",
"Dans la lettre"
],
"bon": 1,
"s": 20
},
{
"q": "Ton message de remerciement après l'entrevue s'envoie…",
"ch": [
"le jour même ou le lendemain",
"un mois plus tard",
"seulement si on t'engage",
"jamais"
],
"bon": 0,
"s": 20
},
{
"q": "Un refus veut dire…",
"ch": [
"que tu n'es pas bon",
"qu'un autre candidat correspondait mieux cette fois",
"que tu dois arrêter de chercher",
"que l'employeur te déteste"
],
"bon": 1,
"s": 20
},
{
"q": "La loi qui fixe les conditions minimales de travail au Québec :",
"ch": [
"la Loi sur les normes du travail",
"le Code de construction",
"la Loi sur la RBQ",
"le Code de la route"
],
"bon": 0,
"s": 20
},
{
"q": "Premier jour : on te demande d'utiliser un produit que tu ne connais pas.",
"ch": [
"Je l'utilise sans rien lire",
"Je lis l'étiquette et la FDS",
"Je le mélange avec de l'eau de Javel",
"Je refuse de travailler"
],
"bon": 1,
"s": 20
},
{
"q": "L'appel de présélection, c'est…",
"ch": [
"déjà une entrevue",
"une formalité sans importance",
"un message publicitaire",
"un test de vitesse"
],
"bon": 0,
"s": 20
},
{
"q": "Entrevue vidéo : le cadrage idéal…",
"ch": [
"les yeux au tiers du haut, visage éclairé",
"le plafond",
"contre-jour devant la fenêtre",
"caméra éteinte"
],
"bon": 0,
"s": 20
},
{
"q": "En entrevue, une mise en situation du métier vérifie surtout…",
"ch": [
"si tu penses d'abord à la sécurité et au client",
"ta vitesse de frappe",
"ta taille",
"ton auto"
],
"bon": 0,
"s": 20
},
{
"q": "Ta liste du jour J :",
"ch": [
"CV et lettre imprimés",
"Liste de références",
"Copies de tes cartes",
"Téléphone allumé avec sonnerie"
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
"q": "La garantie d'emploi de stage en plomberie, c'est…",
"ch": [
"150 heures chez un employeur",
"un contrat de 5 ans",
"une prime de départ",
"un examen écrit"
],
"bon": 0,
"s": 20
}
]
},
{
"id": "defi-recherche-emploi-egi-1",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Moyens de recherche d'emploi (EGI) · Défi+ 1 de 3",
"sujet": "Modules 1 à 3 : mon bilan, les emplois en entretien, le CV",
"couv": "img/couvertures/recherche-emploi-egi.jpg",
"coul": "#2E8B57",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Savoir, savoir-faire, savoir-être : lesquels sont du savoir-être?",
"ch": [
"La ponctualité",
"Le travail d'équipe",
"Souder un raccord",
"La politesse avec les clients"
],
"bon": [
0,
1,
3
],
"s": 30,
"t": "multi"
},
{
"q": "« Travaillant, ponctuel et fiable » ne vaut rien sans…",
"ch": [
"une preuve : un fait précis",
"un diplôme",
"une photo",
"un ton de voix fort"
],
"bon": 0,
"s": 20
},
{
"q": "Tu as « juste été caissier ». Que dis-tu à l'employeur?",
"ch": [
"Rien, ça ne compte pas",
"Ce que l'emploi t'a appris, relié à l'emploi visé",
"Que tu détestais cet emploi",
"Que tu as été caissier, sans plus"
],
"bon": 1,
"s": 20
},
{
"q": "Un défi (point à améliorer) se présente avec un moyen concret que tu prends pour t'améliorer.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "L'IA a écrit « Expert en plomberie depuis 10 ans » dans ton bilan. Tu…",
"ch": [
"le gardes, ça paraît bien",
"corriges : il faut que ce soit vrai",
"ajoutes 5 ans de plus",
"l'envoies tel quel"
],
"bon": 1,
"s": 20
},
{
"q": "Titres d'emploi accessibles avec un DEP en entretien général d'immeubles :",
"ch": [
"Concierge",
"Ouvrier d'entretien",
"Préposé à l'entretien",
"Pharmacien"
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
"q": "L'information sur le marché du travail (IMT) répond à trois questions :",
"ch": [
"combien ça paie, y a-t-il des emplois, que faut-il",
"quelle couleur, quel camion, quel outil",
"qui, quand, pourquoi",
"aucune"
],
"bon": 0,
"s": 20
},
{
"q": "En entretien, les titres changent d'un employeur à l'autre. Pour chercher, tu…",
"ch": [
"utilises plusieurs mots-clés",
"cherches seulement « concierge »",
"attends qu'on t'appelle",
"abandonnes"
],
"bon": 0,
"s": 20
},
{
"q": "Trouve l'erreur dans cette phrase.",
"t": "erreur",
"ch": [
"Je suis une personne",
"ponctuel",
"et minutieuse."
],
"bon": 1,
"s": 30,
"expl": "Accord au féminin : ponctuelle."
},
{
"q": "Ton CV est évalué selon…",
"ch": [
"les critères du programme d'études",
"la couleur du papier",
"ton nombre d'amis",
"la police la plus originale"
],
"bon": 0,
"s": 20
},
{
"q": "« Ouvrier d'entretien classe II », « concierge », « préposé » : ce sont…",
"ch": [
"des titres différents pour des emplois proches",
"des métiers sans lien",
"des emplois de construction",
"des stages"
],
"bon": 0,
"s": 20
},
{
"q": "Ton bilan personnel complet, l'employeur…",
"ch": [
"ne le voit jamais tel quel : c'est un document de travail",
"le reçoit avec le CV",
"le signe",
"le garde au dossier"
],
"bon": 0,
"s": 20
},
{
"q": "Ton message de boîte vocale idéal :",
"ch": [
"de la musique forte",
"ton nom, clair et poli",
"aucun message",
"une blague"
],
"bon": 1,
"s": 20
},
{
"q": "Pour améliorer un profil vague comme « Je suis motivé et j'aime travailler avec mes mains » :",
"ch": [
"ajouter un fait précis et chiffré",
"ajouter des points d'exclamation",
"l'écrire en majuscules",
"le raccourcir à un mot"
],
"bon": 0,
"s": 20
},
{
"q": "Une liste des employeurs de la région est un bon point de départ pour ta recherche.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
}
]
},
{
"id": "defi-recherche-emploi-egi-2",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Moyens de recherche d'emploi (EGI) · Défi+ 2 de 3",
"sujet": "Modules 3 à 6 : CV, recherche en ligne, moyens de recherche, lettre",
"couv": "img/couvertures/recherche-emploi-egi.jpg",
"coul": "#2E8B57",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Les références, on…",
"ch": [
"les met en bas du CV",
"écrit « Références sur demande »",
"les prépare sur une liste séparée",
"ne les donne jamais"
],
"bon": 2,
"s": 20
},
{
"q": "Une bonne puce de CV commence par…",
"ch": [
"« J'aidais… »",
"un verbe d'action : installé, réparé, inspecté",
"une date",
"le nom de l'employeur"
],
"bon": 1,
"s": 20
},
{
"q": "Une adresse courriel pour postuler :",
"ch": [
"bigboss_69@…",
"prenom.nom@…",
"celle de ton ami",
"aucune adresse"
],
"bon": 1,
"s": 20
},
{
"q": "Un logiciel de tri de CV cherche surtout…",
"ch": [
"les mots-clés de l'offre",
"les couleurs du CV",
"la photo",
"le nombre de pages"
],
"bon": 0,
"s": 20
},
{
"q": "Karine revient après six ans à la maison. Quel type de CV met ses forces en avant?",
"ch": [
"Le CV par compétences",
"Le CV chronologique",
"Aucun CV",
"Une lettre seulement"
],
"bon": 0,
"s": 20
},
{
"q": "Les postes du secteur public (écoles, municipalités) sont souvent affichés…",
"ch": [
"seulement sur le site de l'employeur",
"dans les journaux de 1990",
"sur les poteaux",
"jamais"
],
"bon": 0,
"s": 20,
"expl": "Vérifie-les chaque semaine."
},
{
"q": "Combien de moyens de recherche un bon plan combine-t-il?",
"ch": [
"Un seul",
"Trois ou quatre",
"Dix",
"Aucun"
],
"bon": 1,
"s": 20
},
{
"q": "En région, se présenter en personne pour une candidature spontanée…",
"ch": [
"fonctionne encore très bien",
"est interdit",
"ne sert à rien",
"se fait seulement la nuit"
],
"bon": 0,
"s": 20
},
{
"q": "Une offre te demande de l'argent pour « réserver » le poste.",
"ch": [
"Je paie vite",
"C'est probablement une fausse offre",
"C'est normal",
"Je donne mon NAS"
],
"bon": 1,
"s": 20
},
{
"q": "Le brouillon de ta lettre de présentation, c'est…",
"ch": [
"ton tableau exigences de l'offre / ton bilan",
"un modèle copié sur Internet",
"ton CV recopié",
"un texto"
],
"bon": 0,
"s": 20
},
{
"q": "On peut envoyer la même lettre générique à tous les employeurs.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15
},
{
"q": "Avant d'envoyer une candidature :",
"ch": [
"Adresse courriel professionnelle",
"Pièces jointes vraiment jointes",
"Nom du destinataire bien écrit",
"Émojis dans l'objet"
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
"q": "Pour tes réseaux personnels, la visibilité des publications devrait être…",
"ch": [
"Public",
"Amis",
"Tout le monde",
"Sans importance"
],
"bon": 1,
"s": 20
},
{
"q": "Sites gouvernementaux pour chercher un emploi :",
"ch": [
"Québec emploi et le Guichet-Emplois",
"Les réseaux de jeux",
"Les sites de vente usagée",
"Aucun"
],
"bon": 0,
"s": 20
},
{
"q": "Une recherche d'emploi efficace se traite comme…",
"ch": [
"un emploi à temps partiel : heures fixes et objectifs",
"un passe-temps",
"une corvée à faire une fois",
"un loisir du dimanche"
],
"bon": 0,
"s": 20
}
]
},
{
"id": "defi-recherche-emploi-egi-3",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Moyens de recherche d'emploi (EGI) · Défi+ 3 de 3",
"sujet": "Modules 7 et 8 : entrevue, relance et premier emploi",
"couv": "img/couvertures/recherche-emploi-egi.jpg",
"coul": "#2E8B57",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Les quatre parties d'une lettre de présentation : dans l'ordre.",
"ch": [
"En-tête",
"Présentation",
"Proposition",
"Conclusion"
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
"q": "On peut terminer une lettre officielle par « Merci et bonne journée! ».",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "La conclusion demande une rencontre et se termine par une formule de politesse."
},
{
"q": "Une lettre de candidature spontanée s'appuie sur…",
"ch": [
"les exigences de l'offre",
"ce que tu sais de l'employeur",
"ton horaire de la semaine",
"une lettre type envoyée à tous"
],
"bon": 1,
"s": 20,
"expl": "Sans offre, tu n'as pas d'exigences à reprendre."
},
{
"q": "La méthode STAR : dans l'ordre.",
"ch": [
"Situation",
"Tâche",
"Action",
"Résultat"
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
"q": "« Parlez-moi de vous » : l'employeur veut surtout savoir…",
"ch": [
"toute ta vie",
"pourquoi tu es ici pour ce poste",
"ton signe astrologique",
"tes loisirs du week-end"
],
"bon": 1,
"s": 20
},
{
"q": "Quand parler du salaire?",
"ch": [
"Dès la première minute",
"Quand l'employeur aborde le sujet ou au moment de l'offre",
"Jamais",
"Dans la lettre"
],
"bon": 1,
"s": 20
},
{
"q": "Ton message de remerciement après l'entrevue s'envoie…",
"ch": [
"le jour même ou le lendemain",
"un mois plus tard",
"seulement si on t'engage",
"jamais"
],
"bon": 0,
"s": 20
},
{
"q": "Un refus veut dire…",
"ch": [
"que tu n'es pas bon",
"qu'un autre candidat correspondait mieux cette fois",
"que tu dois arrêter de chercher",
"que l'employeur te déteste"
],
"bon": 1,
"s": 20
},
{
"q": "La loi qui fixe les conditions minimales de travail au Québec :",
"ch": [
"la Loi sur les normes du travail",
"le Code de construction",
"la Loi sur la RBQ",
"le Code de la route"
],
"bon": 0,
"s": 20
},
{
"q": "Premier jour : on te demande d'utiliser un produit que tu ne connais pas.",
"ch": [
"Je l'utilise sans rien lire",
"Je lis l'étiquette et la FDS",
"Je le mélange avec de l'eau de Javel",
"Je refuse de travailler"
],
"bon": 1,
"s": 20
},
{
"q": "Les étapes d'une embauche : dans l'ordre.",
"ch": [
"Présélection",
"Entrevue",
"Test pratique",
"Vérification des références",
"Offre"
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
"q": "La tenue pour une entrevue en entretien :",
"ch": [
"complet-cravate obligatoire",
"un cran plus habillé que la tenue de travail, propre",
"survêtement de sport",
"vêtements de travail sales"
],
"bon": 1,
"s": 20
},
{
"q": "Une fois l'offre acceptée, tu demandes…",
"ch": [
"une confirmation écrite : salaire, horaire, statut, date de début",
"rien du tout",
"une augmentation",
"un congé"
],
"bon": 0,
"s": 20
},
{
"q": "La période de probation, c'est…",
"ch": [
"une période d'essai où l'employeur observe ta fiabilité",
"des vacances payées",
"une amende",
"un examen écrit"
],
"bon": 0,
"s": 20
},
{
"q": "Une entrevue est une conversation : tu peux demander de répéter une question.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
}
]
}
];
