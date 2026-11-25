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
"titre": "Administration d'un bâtiment · Défi+ 1 de 6",
"sujet": "Chapitres 1 et 2 : le préposé, les lois et le TAL",
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
"J'attends qu'il envoie un courriel",
"J'écris une demande de service avec la date et l'heure",
"Je lui dis d'appeler lui-même le propriétaire",
"Je répare tout de suite, sans perdre de temps à noter"
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
"la municipalité",
"la CNESST seulement",
"la RBQ",
"la SAAQ"
],
"bon": 2,
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
"le Code de construction",
"le Code civil du Québec",
"la Loi sur la RBQ",
"le Code criminel"
],
"bon": 1,
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
"« Idéal pour couple sans enfant »",
"« 4 ½ rénové, près du métro »",
"« Libre le 1er juillet »",
"« Stationnement inclus »"
],
"bon": 0,
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
"q": "Associe l'organisme à son rôle.",
"t": "paires",
"g": [
"TAL",
"CNESST",
"Régie du bâtiment",
"Municipalité"
],
"ch": [
"Règle les litiges entre locateur et locataire",
"Santé et sécurité au travail",
"Normes de construction et de sécurité des bâtiments",
"Règlements de salubrité et permis"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Le bail d'un logement au Québec se fait sur…",
"ch": [
"aucun papier : la parole suffit",
"une feuille écrite à la main",
"le formulaire obligatoire du TAL",
"un contrat fait par le locateur"
],
"bon": 2,
"s": 20
},
{
"q": "Le préposé peut entrer dans un logement sans avis pour une urgence.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15,
"expl": "En cas d'urgence (fuite, feu), l'accès est permis sans avis."
},
{
"q": "Pour une visite non urgente, le locataire doit recevoir un avis d'au moins…",
"ch": [
"24 heures",
"1 mois",
"1 semaine",
"1 heure"
],
"bon": 0,
"s": 20
},
{
"q": "Que garde-t-on au dossier d'un logement?",
"ch": [
"Le bail",
"Les avis remis",
"Les bons de travail",
"Les opinions sur le locataire"
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
"id": "defi-administration-batiment-2",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Administration d'un bâtiment · Défi+ 2 de 6",
"sujet": "Chapitres 2 à 4 : louer un logement, le crédit",
"couv": "img/couvertures/administration-batiment.jpg",
"coul": "#2E8B57",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
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
"q": "Une clé est identifiée par…",
"ch": [
"le numéro du logement écrit dessus",
"un code, jamais par le numéro du logement",
"le nom du locataire",
"sa couleur"
],
"bon": 1,
"s": 20
},
{
"q": "Au TAL, qui doit prouver ce qu'il avance?",
"ch": [
"Celui qui fait la demande",
"Personne",
"Le Tribunal, qui fait sa propre enquête",
"Celui qui est poursuivi doit prouver qu'il a raison"
],
"bon": 0,
"s": 20
},
{
"q": "Dès qu'un logement se libère, le préposé fait d'abord…",
"ch": [
"une fête",
"une inspection de sortie",
"un changement de loyer",
"rien"
],
"bon": 1,
"s": 20
},
{
"q": "La loi oblige à faire un état des lieux à l'entrée du locataire.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Elle ne l'oblige pas, mais c'est la meilleure protection."
},
{
"q": "Pour une enquête de crédit, qu'est-ce que le locateur n'a PAS besoin de demander?",
"ch": [
"La date de naissance",
"Le nom",
"Le NAS",
"L'adresse"
],
"bon": 2,
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
"Faire une demande au TAL",
"Couper le chauffage",
"Garder ses meubles",
"Changer la serrure"
],
"bon": 0,
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
},
{
"q": "Mélanie habite avec deux colocataires mais n'a pas signé le bail. Envers le locateur, elle est…",
"ch": [
"colocataire, avec les mêmes obligations que les autres",
"occupante, sans engagement envers lui",
"caution",
"sous-locataire, responsable envers le locateur"
],
"bon": 1,
"s": 20
},
{
"q": "Remets dans l'ordre la location d'un logement.",
"ch": [
"Annonce et visite",
"Demande de location et vérifications",
"Signature du bail",
"Inspection d'entrée et remise des clés"
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
"q": "Au Québec, un dépôt de sécurité exigé au locataire est…",
"ch": [
"permis s'il est remboursé au départ",
"interdit, sauf le premier mois de loyer",
"obligatoire et égal à deux mois",
"laissé au choix du locateur"
],
"bon": 1,
"s": 20
},
{
"q": "Une cote de crédit élevée veut dire que la personne…",
"ch": [
"a payé ses dettes à temps",
"n'a jamais emprunté",
"gagne un gros salaire",
"a beaucoup de cartes de crédit"
],
"bon": 0,
"s": 20
},
{
"q": "On peut refuser un locataire parce qu'il a des enfants.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "C'est de la discrimination interdite par la Charte."
},
{
"q": "Une personne gagne 3 000 $ par mois. Le loyer conseillé est d'environ 30 % : combien de $?",
"t": "estim",
"ch": [],
"bon": 900,
"tol": 10,
"u": "$",
"s": 30,
"expl": "30 % de 3 000 $ = 900 $."
}
]
},
{
"id": "defi-administration-batiment-3",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Administration d'un bâtiment · Défi+ 3 de 6",
"sujet": "Chapitres 5 à 8 : loyer, colocation, nuisances, chauffage, entretien",
"couv": "img/couvertures/administration-batiment.jpg",
"coul": "#2E8B57",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Cession ou sous-location : dans laquelle le locataire reste-t-il responsable du bail?",
"ch": [
"La sous-location",
"La cession",
"Aucune",
"Les deux"
],
"bon": 0,
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
"On ne peut pas le refuser",
"On exige un dépôt",
"On refuse",
"On augmente le loyer"
],
"bon": 0,
"s": 20
},
{
"q": "Température de référence pratique dans un logement en hiver :",
"ch": [
"18 °C",
"16 °C",
"25 °C",
"21 °C"
],
"bon": 3,
"s": 20
},
{
"q": "La cote de crédit va de 300 à combien?",
"t": "nombre",
"ch": [],
"bon": 900,
"s": 40,
"u": ""
},
{
"q": "Le loyer se paie…",
"ch": [
"en argent seulement",
"en versements égaux, au début de chaque période",
"quand le locataire le veut, s'il paie le total de l'année",
"en un seul versement, à la fin de chaque année"
],
"bon": 1,
"s": 20
},
{
"q": "Un retard de paiement : le gestionnaire réagit…",
"ch": [
"en coupant l'eau",
"de façon graduelle et documentée",
"en changeant la serrure",
"en criant"
],
"bon": 1,
"s": 20
},
{
"q": "Une clause du bail qui interdit les animaux est…",
"ch": [
"toujours illégale, même si le locataire a signé",
"généralement valide (sauf chien d'assistance)",
"interdite par la Charte",
"valide seulement pour les chiens de grande taille"
],
"bon": 1,
"s": 20
},
{
"q": "Associe la situation au bon document.",
"t": "paires",
"g": [
"Hausse de loyer",
"Sous-location",
"Travaux majeurs",
"Retard de loyer"
],
"ch": [
"Avis de modification du bail",
"Avis au locateur du locataire",
"Avis de travaux au locataire",
"Rappel écrit, puis TAL au besoin"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Le locataire qui reçoit un avis de hausse a combien de temps pour la refuser?",
"ch": [
"aucun : il doit accepter",
"1 semaine après l'avis",
"jusqu'à la fin du bail",
"1 mois après l'avis"
],
"bon": 3,
"s": 20
},
{
"q": "Une plainte de bruit entre voisins : le préposé…",
"ch": [
"ignore : ce n'est pas son travail",
"coupe l'électricité du logement",
"note les faits et transmet au gestionnaire",
"va crier chez le voisin"
],
"bon": 2,
"s": 20
},
{
"q": "Le locateur doit garder le logement en bon état d'habitabilité.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Loyer de 950 $, hausse de 4,5 %. Nouveau loyer en $ (arrondi à l'unité)?",
"t": "nombre",
"ch": [],
"bon": 993,
"s": 45,
"u": "$"
}
]
},
{
"id": "defi-administration-batiment-4",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Administration d'un bâtiment · Défi+ 4 de 6",
"sujet": "Chapitres 9 et 10 : fin du bail et budget",
"couv": "img/couvertures/administration-batiment.jpg",
"coul": "#2E8B57",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
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
"Menues = propriétaire; nécessaires = locataire",
"Menues = locataire; nécessaires = propriétaire",
"Tout au locataire"
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
"entre 3 et 6 mois avant la fin",
"entre 1 et 2 mois avant la fin",
"après la fin du bail",
"n'importe quand"
],
"bon": 0,
"s": 20
},
{
"q": "Le locataire ne répond pas à l'avis de hausse dans le délai d'un mois.",
"ch": [
"Le bail prend fin",
"Il accepte la hausse",
"Le TAL décide",
"Il refuse la hausse"
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
"le test de l'alcool",
"le test de la feuille",
"le test de la bille",
"le test de résistance"
],
"bon": 3,
"s": 20
},
{
"q": "Un cash-flow négatif veut dire…",
"ch": [
"l'hypothèque est payée",
"tu paies de ta poche chaque mois pour garder l'immeuble",
"les loyers sont trop bas pour être acceptés au TAL",
"l'immeuble rapporte plus que prévu chaque mois"
],
"bon": 1,
"s": 20
},
{
"q": "Le ratio de couverture de la dette (RCD), c'est…",
"ch": [
"taxes ÷ loyers",
"mise de fonds ÷ prix d'achat de l'immeuble",
"prix d'achat ÷ total des loyers annuels",
"revenu net ÷ paiements hypothécaires"
],
"bon": 3,
"s": 20
},
{
"q": "Associe le poste du budget de l'immeuble.",
"t": "paires",
"g": [
"Taxes municipales",
"Assurances",
"Entretien préventif",
"Réserve"
],
"ch": [
"Payées à la ville",
"Protègent contre les sinistres",
"Évite les grosses réparations",
"Prévue pour l'imprévu"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Un bail de 12 mois se renouvelle…",
"ch": [
"automatiquement, sauf avis contraire",
"seulement si on signe un nouveau bail",
"si le locateur le décide seul",
"jamais : il faut tout recommencer"
],
"bon": 0,
"s": 20
},
{
"q": "L'inspection de sortie se fait…",
"ch": [
"par téléphone avec le locataire",
"seulement si le logement est sale",
"après que le nouveau locataire est entré",
"avec le locataire, si possible, en notant tout"
],
"bon": 3,
"s": 20
},
{
"q": "Le revenu net, c'est ce qui reste après les dépenses.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Un immeuble de 12 logements à 1 000 $ par mois rapporte environ combien de $ par année?",
"t": "estim",
"ch": [],
"bon": 144000,
"tol": 5,
"u": "$",
"s": 30,
"expl": "12 × 1 000 × 12 = 144 000 $."
}
]
},
{
"id": "defi-administration-batiment-5",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Administration d'un bâtiment · Défi+ 5 de 6",
"sujet": "Chapitres 10 et 11 : hypothèque, épargne, copropriété",
"couv": "img/couvertures/administration-batiment.jpg",
"coul": "#2E8B57",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Acheter un plex à deux : on signe devant notaire, avant l'achat…",
"ch": [
"un bail commun signé par les deux acheteurs",
"une convention d'indivision",
"une mise en demeure",
"une soumission conjointe faite au vendeur"
],
"bon": 1,
"s": 20
},
{
"q": "Une personne habite le logement sans avoir signé le bail. Elle peut…",
"ch": [
"être expulsée sans avis",
"dans certains cas devenir locataire",
"rester, mais en payant le double du loyer",
"jamais rester une fois que le locataire est parti"
],
"bon": 1,
"s": 20
},
{
"q": "Le budget d'exploitation compare…",
"ch": [
"ce que l'immeuble rapporte en un an avec ce qu'il coûte",
"deux immeubles du même quartier, côte à côte",
"les loyers de l'immeuble avec ceux de la ville",
"les salaires"
],
"bon": 0,
"s": 20
},
{
"q": "La prime d'assurance prêt est un pourcentage…",
"ch": [
"de ton salaire",
"du montant emprunté",
"des taxes",
"du loyer"
],
"bon": 1,
"s": 20
},
{
"q": "Au Québec, le vendeur d'un immeuble doit une garantie…",
"ch": [
"de prix : il rembourse si l'immeuble vaut moins",
"de loyer : il garantit les revenus pendant un an",
"aucune",
"de qualité contre les vices cachés"
],
"bon": 3,
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
"choisir quel locataire quitte en premier",
"écrire d'avance quoi faire et qui fait quoi",
"calculer combien coûte un sinistre au loyer",
"remplacer l'assurance"
],
"bon": 1,
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
"q": "Associe le mot à sa définition.",
"t": "paires",
"g": [
"Mise de fonds",
"Amortissement",
"Taux d'intérêt",
"Fonds de prévoyance"
],
"ch": [
"Argent versé à l'achat",
"Durée pour rembourser le prêt",
"Prix payé pour emprunter",
"Épargne pour les grosses réparations d'une copropriété"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "En copropriété, les parties communes sont gérées par…",
"ch": [
"la municipalité",
"le syndicat de copropriété",
"le premier acheteur",
"chaque propriétaire seul"
],
"bon": 1,
"s": 20
},
{
"q": "Un REER sert surtout à…",
"ch": [
"épargner pour la retraite avec une déduction d'impôt",
"payer son loyer chaque mois",
"rembourser ses cartes de crédit",
"acheter une voiture neuve"
],
"bon": 0,
"s": 20
},
{
"q": "Plus l'amortissement est long, plus on paie d'intérêts au total.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Une maison de 400 000 $ avec une mise de fonds de 10 % : la mise de fonds est de combien de $?",
"t": "estim",
"ch": [],
"bon": 40000,
"tol": 5,
"u": "$",
"s": 25,
"expl": "10 % de 400 000 $ = 40 000 $."
}
]
},
{
"id": "defi-administration-batiment-6",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Administration d'un bâtiment · Défi+ 6 de 6",
"sujet": "Chapitres 12 et 13 : plan d'urgence et interventions",
"couv": "img/couvertures/administration-batiment.jpg",
"coul": "#2E8B57",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Inspection visuelle d'un extincteur portatif :",
"ch": [
"chaque année seulement",
"chaque semaine",
"chaque mois",
"tous les 5 ans"
],
"bon": 2,
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
"On souffle dessus",
"On couvre avec un couvercle et on ferme le rond",
"On jette un peu d'eau pour refroidir l'huile",
"On transporte la casserole dehors rapidement"
],
"bon": 1,
"s": 20
},
{
"q": "Odeur de gaz dans le corridor :",
"ch": [
"Je cherche la fuite avec un briquet",
"Je sors et j'appelle de l'extérieur",
"J'allume pour mieux voir",
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
},
{
"q": "Le gaz naturel n'a pas d'odeur : on lui ajoute…",
"ch": [
"une odeur d'œufs pourris",
"rien",
"une couleur bleue pour qu'on la voie",
"un sifflement pour qu'on l'entende"
],
"bon": 0,
"s": 20
},
{
"q": "Le plan d'évacuation est affiché…",
"ch": [
"seulement au sous-sol, près de la chambre mécanique",
"à chaque étage, près des escaliers et des ascenseurs",
"sur le toit",
"dans chaque logement, sur la porte d'entrée"
],
"bon": 1,
"s": 20
},
{
"q": "Un occupant fait un malaise :",
"ch": [
"appeler le 9-1-1 et suivre les consignes du répartiteur",
"le laisser se reposer seul dans un endroit calme",
"attendre la fin de ton quart",
"lui donner un médicament de la trousse de premiers soins"
],
"bon": 0,
"s": 20
},
{
"q": "Remets dans l'ordre une intervention lors d'un dégât d'eau.",
"ch": [
"Couper l'eau",
"Couper l'électricité de la zone si nécessaire",
"Aviser le gestionnaire",
"Prendre des photos et noter"
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
"q": "Le plan d'urgence de l'immeuble indique…",
"ch": [
"les règlements du stationnement",
"les horaires de ménage",
"le prix des loyers",
"qui fait quoi et qui appeler"
],
"bon": 3,
"s": 20
},
{
"q": "Associe l'urgence au premier appel.",
"t": "paires",
"g": [
"Feu",
"Fuite de gaz",
"Panne électrique générale",
"Refoulement d'égout"
],
"ch": [
"911",
"Fournisseur de gaz (ou 911)",
"Hydro-Québec",
"Plombier ou municipalité"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Après une urgence, on écrit un rapport d'incident.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Que contient une trousse d'urgence de l'immeuble?",
"ch": [
"Lampe de poche",
"Liste des numéros",
"Clés maîtresses",
"Les baux originaux"
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
"titre": "Travaux mineurs d'entretien général · Défi+ 1 de 6",
"sujet": "Modules 1 et 2 : sécurité et inspection",
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
"3",
"4",
"1",
"2"
],
"bon": 0,
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
"aucune étiquette",
"le nom de l'élève",
"une étiquette du lieu de travail",
"un pictogramme dessiné à la main"
],
"bon": 2,
"s": 20
},
{
"q": "Associe chaque protection au danger.",
"t": "paires",
"g": [
"Lunettes de sécurité",
"Masque N95",
"Bouchons d'oreilles",
"Gants de nitrile"
],
"ch": [
"Éclats et poussières aux yeux",
"Poussière de gypse respirée",
"Bruit de la scie",
"Produits chimiques sur la peau"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Avant de percer un mur d'un vieil immeuble, tu penses d'abord…",
"ch": [
"à la couleur de la peinture du mur",
"au nombre de vis dans la boîte",
"à l'amiante possible dans les matériaux",
"à l'heure de la pause du dîner"
],
"bon": 2,
"s": 20
},
{
"q": "L'escabeau : la marche du haut sert…",
"ch": [
"à déposer un seau de peinture plein",
"à rien : on ne monte jamais dessus",
"à poser les pieds pour les petits travaux",
"à s'asseoir pendant les travaux en hauteur"
],
"bon": 1,
"s": 20
},
{
"q": "Une inspection de logement se fait…",
"ch": [
"au hasard, là où on voit un problème",
"pièce par pièce, avec une grille",
"de l'extérieur, par les fenêtres",
"seulement dans la cuisine et la salle de bain"
],
"bon": 1,
"s": 20
},
{
"q": "Un outil électrique au fil abîmé peut servir si on met du ruban dessus.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "On le retire du service et on le fait réparer."
},
{
"q": "Que note-t-on dans un rapport d'inspection?",
"ch": [
"Le lieu précis du problème",
"Une photo",
"La gravité",
"Ce que pense le voisin"
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
"q": "Hauteur d'une échelle appuyée : pour 4 m de hauteur, le pied s'éloigne du mur d'environ combien de mètres?",
"t": "estim",
"ch": [],
"bon": 1,
"tol": 15,
"u": "m",
"s": 30,
"expl": "Règle du 4 pour 1 : 1 m de recul pour 4 m de hauteur."
},
{
"q": "Le cadenas de consignation, c'est…",
"ch": [
"ton cadenas à toi, avec ta clé",
"un cadenas partagé par l'équipe",
"un cadenas qu'on laisse ouvert",
"le cadenas du concierge de l'école"
],
"bon": 0,
"s": 20
}
]
},
{
"id": "defi-travaux-mineurs-egi-2",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Travaux mineurs d'entretien général · Défi+ 2 de 6",
"sujet": "Modules 3 et 4 : cloisons, fissures et trous",
"couv": "img/couvertures/travaux-mineurs-egi.jpg",
"coul": "#D9488A",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Chiffons imbibés d'huile de lin à la fin de la journée :",
"ch": [
"sur le calorifère, pour qu'ils sèchent avant de les jeter",
"roulés dans un coin",
"dans un contenant métallique rempli d'eau",
"dans la poubelle de la salle des déchets"
],
"bon": 2,
"s": 20,
"expl": "La réaction avec l'oxygène dégage de la chaleur : risque d'inflammation."
},
{
"q": "Bâtiment d'avant 1990 : avant de poncer un vieux plâtre…",
"ch": [
"on ne fait rien de spécial",
"on vérifie le registre ou on fait tester (amiante)",
"on mouille le mur pour éviter la poussière",
"on porte des gants et des lunettes de sécurité"
],
"bon": 1,
"s": 20
},
{
"q": "Une fissure marquée au crayon avec la date a grandi depuis l'inspection précédente.",
"ch": [
"C'est normal",
"Je la remplis de composé avant qu'elle grandisse",
"C'est normal : un bâtiment travaille avec le temps",
"C'est un mouvement actif : je signale"
],
"bon": 3,
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
"à prise",
"prémélangé",
"acrylique",
"de finition"
],
"bon": 0,
"s": 20
},
{
"q": "Associe le trou à la bonne réparation.",
"t": "paires",
"g": [
"Trou de clou",
"Trou de poignée (10 cm)",
"Grand trou (30 cm)",
"Fissure au joint"
],
"ch": [
"Un peu de pâte, puis sabler",
"Pièce autocollante en treillis",
"Morceau de gypse vissé sur des fourrures",
"Ruban à joints et 3 couches de pâte"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "La pâte à joints se pose en…",
"ch": [
"deux couches de même largeur, sans sabler",
"plusieurs couches minces, de plus en plus larges",
"une seule couche très épaisse pour aller vite",
"couches épaisses, puis on sable beaucoup"
],
"bon": 1,
"s": 20
},
{
"q": "Une vis de gypse bien posée est…",
"ch": [
"enfoncée loin pour bien tenir le panneau",
"juste sous la surface, sans déchirer le papier",
"posée en biais pour mieux mordre le montant",
"à égalité, la tête qui dépasse un peu"
],
"bon": 1,
"s": 20
},
{
"q": "On peut peindre la pâte à joints sans apprêt.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "L'apprêt évite les taches mates (« flashing »)."
},
{
"q": "Remets dans l'ordre la réparation d'un trou moyen.",
"ch": [
"Couper un carré net autour du trou",
"Poser des fourrures derrière",
"Visser la pièce de gypse",
"Tirer les joints et sabler"
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
"q": "Une feuille de gypse 4 × 8 de 1/2 po pèse environ combien de livres?",
"t": "estim",
"ch": [],
"bon": 50,
"tol": 20,
"u": "lb",
"s": 30,
"expl": "Environ 50 à 55 lb : on la porte à deux."
},
{
"q": "Pour trouver un montant derrière le gypse, on utilise…",
"ch": [
"un détecteur de montants",
"un cordeau à craie bleue",
"un niveau de 4 pieds",
"une équerre de charpentier"
],
"bon": 0,
"s": 20
}
]
},
{
"id": "defi-travaux-mineurs-egi-3",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Travaux mineurs d'entretien général · Défi+ 3 de 6",
"sujet": "Modules 4 et 5 : béton et céramique",
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
"De quelle couleur est-elle? Est-elle propre?",
"Est-ce que ça bouge? Est-ce que l'eau passe?",
"Qui l'a vue en premier?",
"Quel âge a l'immeuble? Qui l'a construit?"
],
"bon": 1,
"s": 20,
"expl": "Stable et sec : je répare. Actif ou mouillé : j'arrête l'eau et je signale."
},
{
"q": "Pour arrêter une infiltration d'eau active dans le béton, on utilise…",
"ch": [
"du ciment hydraulique",
"du composé à joints",
"de l'apprêt",
"du silicone"
],
"bon": 0,
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
"q": "Associe le problème du béton à sa cause.",
"t": "paires",
"g": [
"Fissure fine en surface",
"Écaillage l'hiver",
"Efflorescence blanche",
"Fissure qui s'ouvre"
],
"ch": [
"Retrait au séchage",
"Gel et sel de déglaçage",
"Sels sortis avec l'eau",
"Mouvement de structure à signaler"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Avant de colmater une fissure de béton, on…",
"ch": [
"nettoie et enlève les morceaux qui bougent",
"mouille et pose le produit sur la poussière",
"peint la fissure pour voir sa longueur",
"attend le printemps, peu importe la saison"
],
"bon": 0,
"s": 20
},
{
"q": "Le coulis de céramique sert à…",
"ch": [
"rendre les carreaux plus brillants",
"remplir les joints entre les carreaux",
"coller les carreaux sur le plancher",
"niveler le plancher avant la pose"
],
"bon": 1,
"s": 20
},
{
"q": "Un carreau qui sonne creux quand on le frappe est mal collé.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15,
"expl": "L'adhésif ne touche pas tout le dessous."
},
{
"q": "Remets dans l'ordre le remplacement d'un carreau brisé.",
"ch": [
"Gratter le coulis autour",
"Casser et retirer le carreau",
"Coller le nouveau carreau",
"Refaire le coulis"
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
"q": "Le scellant à coulis, on l'applique…",
"ch": [
"seulement sur les murs",
"quand le coulis a bien séché",
"dans le coulis encore mouillé",
"avant de poser le coulis"
],
"bon": 1,
"s": 20
},
{
"q": "Un sac de 30 kg de béton prémélangé donne environ combien de litres de béton?",
"t": "estim",
"ch": [],
"bon": 14,
"tol": 25,
"u": "L",
"s": 30,
"expl": "Environ 14 litres : il en faut beaucoup pour une petite dalle."
},
{
"q": "Dans une douche, le joint entre le bain et la céramique se fait avec…",
"ch": [
"de la pâte à joints de gypse",
"du ciment-colle, très dur",
"du silicone, qui reste souple",
"du coulis, comme les autres joints"
],
"bon": 2,
"s": 20
}
]
},
{
"id": "defi-travaux-mineurs-egi-4",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Travaux mineurs d'entretien général · Défi+ 4 de 6",
"sujet": "Modules 6 et 7 : peinture et planchers",
"couv": "img/couvertures/travaux-mineurs-egi.jpg",
"coul": "#D9488A",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Avant de refaire le joint de silicone d'une baignoire, on…",
"ch": [
"la vide complètement",
"la remplit d'eau",
"la peint",
"la chauffe"
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
"le test du manche",
"le test de l'alcool",
"le test de la feuille",
"le test de la bille"
],
"bon": 1,
"s": 20
},
{
"q": "Fini lavable et discret pour les murs d'un corridor :",
"ch": [
"velours (ou perle)",
"lustré",
"mat (plat)",
"sans fini"
],
"bon": 0,
"s": 20
},
{
"q": "Poncer très légèrement entre deux couches de vernis, c'est…",
"ch": [
"décaper",
"sabler à fond",
"égrener",
"apprêter"
],
"bon": 2,
"s": 20
},
{
"q": "Un plancher flottant ne doit jamais être…",
"ch": [
"posé sur une membrane",
"coincé (espace de dilatation)",
"posé dans un corridor",
"nettoyé"
],
"bon": 1,
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
"On les chauffe",
"On les arrache au grattoir",
"On les ponce",
"On signale (amiante possible)"
],
"bon": 3,
"s": 20
},
{
"q": "Associe l'outil de peinture à son usage.",
"t": "paires",
"g": [
"Pinceau à angle",
"Rouleau 3/8 po",
"Rouleau 3/4 po",
"Ruban de peintre"
],
"ch": [
"Découper les coins",
"Mur lisse",
"Surface rugueuse",
"Protéger les bordures"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Le fini « coquille d'œuf » convient à…",
"ch": [
"un plafond qu'on veut cacher",
"un plancher de béton extérieur",
"un salon ou une chambre",
"un garage qui reçoit de l'huile"
],
"bon": 2,
"s": 20
},
{
"q": "Une peinture qui pèle sur un vieux mur à l'huile : la cause probable…",
"ch": [
"latex posé sans apprêt adhérent",
"un rouleau trop neuf et trop épais",
"une pièce trop chaude pendant la pose",
"deux couches de latex au lieu d'une"
],
"bon": 0,
"s": 20
},
{
"q": "On peint le plafond avant les murs.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15,
"expl": "Les gouttes tombent sur les murs pas encore faits."
},
{
"q": "Remets dans l'ordre la pose d'un plancher flottant.",
"ch": [
"Pose de la sous-couche",
"Première rangée avec cales",
"Rangées suivantes décalées",
"Moulures pour cacher le jeu"
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
"q": "Un gallon de peinture (3,78 L) couvre environ combien de pi² en une couche?",
"t": "estim",
"ch": [],
"bon": 400,
"tol": 20,
"u": "pi²",
"s": 30,
"expl": "Environ 350 à 400 pi² selon la surface."
},
{
"q": "On laisse un espace au bord d'un plancher flottant pour…",
"ch": [
"cacher les fils sous la moulure",
"ventiler la sous-couche l'été",
"laisser le bois gonfler et rétrécir",
"faciliter le ménage du plancher"
],
"bon": 2,
"s": 20
}
]
},
{
"id": "defi-travaux-mineurs-egi-5",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Travaux mineurs d'entretien général · Défi+ 5 de 6",
"sujet": "Modules 8 et 9 : armoires et fixations",
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
"le quartz",
"le contreplaqué marin",
"l'acier",
"le panneau de particules"
],
"bon": 3,
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
"la feuillure",
"le pêne",
"le dégagement",
"l'entraxe"
],
"bon": 3,
"s": 20
},
{
"q": "Colle qu'on laisse sécher au toucher avant d'assembler les deux surfaces :",
"ch": [
"le silicone",
"la colle blanche",
"la colle contact",
"l'époxy"
],
"bon": 2,
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
"q": "Associe la fixation au matériau.",
"t": "paires",
"g": [
"Ancrage à expansion",
"Boulon à ailettes",
"Vis à bois",
"Ancrage à béton (Tapcon)"
],
"ch": [
"Gypse, charge légère",
"Gypse, charge plus lourde",
"Montant de bois",
"Béton ou bloc"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Une porte d'armoire qui ne ferme pas droit : on ajuste…",
"ch": [
"le comptoir au-dessus",
"la tablette à l'intérieur",
"les vis de la charnière européenne",
"la poignée de la porte de travers"
],
"bon": 2,
"s": 20
},
{
"q": "Une tablette lourde sur un mur de gypse se fixe…",
"ch": [
"avec des clous de finition dans le gypse",
"dans les montants quand c'est possible",
"avec de la colle à construction seulement",
"avec du ruban double face très fort"
],
"bon": 1,
"s": 20
},
{
"q": "Un tiroir qui frotte peut venir d'une glissière mal vissée.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Avant de percer, qu'est-ce qui peut se cacher dans le mur?",
"ch": [
"Des fils électriques",
"Des tuyaux",
"Des montants",
"Le plan du bâtiment"
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
"q": "Une mèche à béton se reconnaît à…",
"ch": [
"sa couleur dorée sur toute la mèche",
"sa pointe très fine en spirale",
"sa forme plate avec une pointe",
"sa pointe au carbure plus large"
],
"bon": 3,
"s": 20
},
{
"q": "Une main courante d'escalier se pose à environ combien de mm du nez des marches?",
"t": "estim",
"ch": [],
"bon": 900,
"tol": 10,
"u": "mm",
"s": 30,
"expl": "Environ 865 à 965 mm selon le code."
},
{
"q": "Avant de visser une charnière dans du bois dur, on…",
"ch": [
"graisse la charnière",
"frappe la vis au marteau",
"mouille le bois",
"perce un avant-trou"
],
"bon": 3,
"s": 20
}
]
},
{
"id": "defi-travaux-mineurs-egi-6",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Travaux mineurs d'entretien général · Défi+ 6 de 6",
"sujet": "Modules 10 et 11 : portes, vitres et moustiquaires",
"couv": "img/couvertures/travaux-mineurs-egi.jpg",
"coul": "#D9488A",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Dans le gypse creux, l'ancrage le plus fort est…",
"ch": [
"le clou",
"l'ancrage à bascule",
"l'ancrage en plastique",
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
"Une vis de 12 mm",
"Une vis de 75 mm",
"De la colle",
"Un clou"
],
"bon": 1,
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
"qu'elle est collée au silicone tout autour du cadre",
"qu'elle est tendue sans avoir plié le cadre",
"qu'elle touche la vitre sur toute la surface",
"qu'elle est peinte"
],
"bon": 1,
"s": 20
},
{
"q": "Associe le problème de porte à la solution.",
"t": "paires",
"g": [
"Porte qui frotte en haut",
"Pêne qui n'entre pas",
"Porte qui claque",
"Courant d'air au bas"
],
"ch": [
"Serrer les vis de la charnière du haut",
"Ajuster la gâche",
"Régler le ferme-porte",
"Changer le coupe-froid du bas"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Une moustiquaire déchirée se répare en…",
"ch": [
"changeant la toile et la baguette (cordon)",
"agrafant un morceau sur le cadre",
"collant du ruban adhésif sur le trou",
"peignant la toile pour la boucher"
],
"bon": 0,
"s": 20
},
{
"q": "Une vitre thermos embuée entre les deux verres veut dire…",
"ch": [
"il faut nettoyer les deux faces",
"le scellant est brisé : on change l'unité",
"la vitre est trop froide",
"la pièce est trop humide"
],
"bon": 1,
"s": 20
},
{
"q": "Une porte coupe-feu peut rester ouverte avec une cale de bois.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Elle doit se fermer seule et s'enclencher."
},
{
"q": "Remets dans l'ordre le changement d'un cylindre de serrure.",
"ch": [
"Ouvrir la porte et la bloquer",
"Dévisser la plaque intérieure",
"Sortir l'ancien cylindre",
"Poser le nouveau et tester les clés"
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
"q": "Le calfeutrant extérieur autour d'une fenêtre sert à…",
"ch": [
"isoler du bruit seulement",
"coller la fenêtre au mur",
"décorer le cadrage",
"bloquer l'eau et l'air"
],
"bon": 3,
"s": 20
},
{
"q": "Une porte intérieure standard fait environ combien de mm de haut?",
"t": "estim",
"ch": [],
"bon": 2032,
"tol": 5,
"u": "mm",
"s": 25,
"expl": "80 po (6 pi 8 po), soit environ 2032 mm."
}
]
},
{
"id": "defi-montages-electriques-c5-1",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Ateliers de montages électriques (C5) · Défi+ 1 de 6",
"sujet": "Ateliers 0 à 2 : fiche mâle et montages filaires",
"couv": "img/couvertures/montages-electriques-c5.jpg",
"coul": "#E0892B",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Sur une fiche mâle 120 V, le fil blanc (neutre) va à la lame…",
"ch": [
"la plus large",
"n'importe laquelle",
"la plus étroite",
"ronde"
],
"bon": 0,
"s": 20
},
{
"q": "Le fil vert ou dénudé, c'est…",
"ch": [
"le neutre",
"le retour d'interrupteur",
"le chaud",
"la mise à la terre"
],
"bon": 3,
"s": 20
},
{
"q": "Un interrupteur se branche sur…",
"ch": [
"le neutre (blanc)",
"la terre",
"n'importe quel fil",
"le fil chaud (noir)"
],
"bon": 3,
"s": 20
},
{
"q": "Montage « source à la lampe » : le fil blanc qui va vers l'interrupteur…",
"ch": [
"est coupé",
"reste un neutre et ne change pas de couleur",
"va à la borne de terre de l'interrupteur",
"est réidentifié en noir parce qu'il devient un chaud"
],
"bon": 3,
"s": 20
},
{
"q": "Deux lampes en série : si une lampe brûle…",
"ch": [
"rien ne change",
"le disjoncteur saute",
"l'autre s'éteint aussi",
"l'autre brille plus fort"
],
"bon": 2,
"s": 20
},
{
"q": "Deux lampes en série reçoivent chacune…",
"ch": [
"la pleine tension : elles éclairent normalement",
"le double de la tension : elles éclairent plus fort",
"aucune tension",
"une partie de la tension : elles éclairent moins"
],
"bon": 3,
"s": 20
},
{
"q": "Deux luminaires en parallèle : chacun reçoit…",
"ch": [
"aucune tension",
"la moitié de la tension",
"24 V",
"la pleine tension (120 V)"
],
"bon": 3,
"s": 20
},
{
"q": "Associe la couleur du fil à son rôle (120 V).",
"t": "paires",
"g": [
"Noir",
"Blanc",
"Vert ou nu",
"Rouge"
],
"ch": [
"Phase (sous tension)",
"Neutre",
"Mise à la terre",
"Deuxième phase ou retour d'interrupteur"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Sur une fiche mâle, la lame la plus large est…",
"ch": [
"la phase",
"le neutre",
"la terre",
"sans importance"
],
"bon": 1,
"s": 20
},
{
"q": "La broche ronde d'une fiche sert à…",
"ch": [
"tenir la fiche",
"la mise à la terre",
"le neutre",
"la phase"
],
"bon": 1,
"s": 20
},
{
"q": "On dénude le fil juste assez pour qu'il entre sous la vis.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15,
"expl": "Pas de cuivre qui dépasse."
},
{
"q": "Remets dans l'ordre le raccord d'un fil sous une vis.",
"ch": [
"Dénuder environ 2 cm",
"Faire une boucle",
"Placer la boucle dans le sens du serrage",
"Serrer la vis"
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
"q": "La boucle du fil s'enroule autour de la vis…",
"ch": [
"dans le sens antihoraire",
"on ne fait pas de boucle",
"dans le sens horaire",
"dans n'importe quel sens"
],
"bon": 2,
"s": 20
},
{
"q": "Un fil de calibre 14 protège un circuit de combien d'ampères (disjoncteur)?",
"t": "nombre",
"ch": [],
"bon": 15,
"s": 40,
"u": "A"
},
{
"q": "Avant de travailler sur un montage, on vérifie l'absence de tension avec…",
"ch": [
"le disjoncteur seulement",
"les doigts mouillés",
"un vérificateur de tension testé avant et après",
"une ampoule au hasard"
],
"bon": 2,
"s": 20
}
]
},
{
"id": "defi-montages-electriques-c5-2",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Ateliers de montages électriques (C5) · Défi+ 2 de 6",
"sujet": "Ateliers 3 à 5 : série et parallèle",
"couv": "img/couvertures/montages-electriques-c5.jpg",
"coul": "#E0892B",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Dans un circuit en parallèle, si une lampe brûle, les autres restent allumées.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Un circuit mixte, c'est…",
"ch": [
"un circuit 24 V commandé par un circuit 120 V",
"deux circuits sans lien dans la même boîte",
"une partie en série et une partie en parallèle",
"un circuit sans charge"
],
"bon": 2,
"s": 20
},
{
"q": "Avant de toucher au montage : dans l'ordre.",
"ch": [
"Couper la source",
"Vérifier l'absence de tension",
"Faire le montage",
"Faire vérifier avant de remettre sous tension"
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
"q": "Le capuchon de connexion (marrette) se visse…",
"ch": [
"dans le sens antihoraire, fils bien torsadés",
"dans le sens horaire, fils bien torsadés",
"sur un seul fil, l'autre glissé à côté",
"sans tourner"
],
"bon": 1,
"s": 20
},
{
"q": "Ce que tu mesures avec le multimètre dans ces ateliers :",
"ch": [
"La tension",
"La continuité",
"La résistance",
"La pression d'eau"
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
"q": "Pour vérifier la continuité, le circuit doit être…",
"ch": [
"mouillé",
"à moitié branché",
"hors tension",
"sous tension"
],
"bon": 2,
"s": 20
},
{
"q": "La couleur du fil chaud en 120 V résidentiel :",
"ch": [
"vert (ou nu)",
"gris",
"blanc (ou gris)",
"noir (ou rouge)"
],
"bon": 3,
"s": 20
},
{
"q": "On peut couper le neutre avec l'interrupteur au lieu du chaud.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "La lampe resterait sous tension même éteinte."
},
{
"q": "Associe le montage à son comportement.",
"t": "paires",
"g": [
"Série",
"Parallèle",
"Une lampe brûle en série",
"Une lampe brûle en parallèle"
],
"ch": [
"Le courant passe par un seul chemin",
"Chaque lampe a sa tension complète",
"Tout s'éteint",
"Les autres restent allumées"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "En série, la résistance totale…",
"ch": [
"est toujours zéro",
"est égale à la plus grande",
"est plus petite que la plus petite",
"est la somme des résistances"
],
"bon": 3,
"s": 20
},
{
"q": "Les prises d'une maison sont branchées…",
"ch": [
"en une seule boucle fermée",
"en parallèle",
"chacune sur son disjoncteur",
"en série"
],
"bon": 1,
"s": 20
},
{
"q": "En parallèle, la tension est la même aux bornes de chaque lampe.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Deux résistances de 60 Ω en série : résistance totale en Ω?",
"t": "nombre",
"ch": [],
"bon": 120,
"s": 40,
"u": "Ω"
},
{
"q": "Deux résistances de 60 Ω en parallèle : résistance totale en Ω?",
"t": "nombre",
"ch": [],
"bon": 30,
"s": 45,
"u": "Ω"
},
{
"q": "Une ampoule de 60 W sur 120 V tire environ combien d'ampères?",
"t": "estim",
"ch": [],
"bon": 0.5,
"tol": 10,
"u": "A",
"s": 30,
"expl": "60 ÷ 120 = 0,5 A."
}
]
},
{
"id": "defi-montages-electriques-c5-3",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Ateliers de montages électriques (C5) · Défi+ 3 de 6",
"sujet": "Ateliers 6 à 9 : prise, lampe, 3 voies et 4 voies",
"couv": "img/couvertures/montages-electriques-c5.jpg",
"coul": "#E0892B",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Une prise toujours alimentée sur le même circuit qu'une lampe commandée : la prise se branche…",
"ch": [
"après l'interrupteur (sur le fil commandé)",
"sur la borne de terre de la lampe",
"sur la lampe",
"avant l'interrupteur (sur le chaud permanent)"
],
"bon": 3,
"s": 20
},
{
"q": "Commander une lampe de deux endroits demande…",
"ch": [
"deux interrupteurs simples",
"un 4 voies seul",
"deux interrupteurs 3 voies",
"un gradateur"
],
"bon": 2,
"s": 20
},
{
"q": "Commander une lampe de trois endroits demande…",
"ch": [
"trois 3 voies",
"trois interrupteurs simples",
"deux 3 voies et un 4 voies",
"un 3 voies et deux simples"
],
"bon": 2,
"s": 20
},
{
"q": "Les deux fils qui relient les interrupteurs 3 voies s'appellent…",
"ch": [
"les navettes (voyageurs)",
"les terres",
"les neutres (fils de retour)",
"les communs (fils de départ)"
],
"bon": 0,
"s": 20
},
{
"q": "Sur un 3 voies, la borne foncée est…",
"ch": [
"la terre",
"le neutre",
"une navette",
"le commun"
],
"bon": 3,
"s": 20
},
{
"q": "Le schéma filaire montre…",
"ch": [
"la pression d'eau",
"seulement la logique",
"les tuyaux",
"où passent les fils"
],
"bon": 3,
"s": 20
},
{
"q": "Le schéma à échelle montre surtout…",
"ch": [
"la position réelle des boîtes dans le bâtiment",
"la logique de fonctionnement, échelon par échelon",
"la tuyauterie",
"le trajet des fils dans les murs, à l'échelle"
],
"bon": 1,
"s": 20
},
{
"q": "Associe l'interrupteur à son usage.",
"t": "paires",
"g": [
"Unipolaire",
"3 voies",
"4 voies",
"Gradateur"
],
"ch": [
"Une lumière, un endroit",
"Une lumière, deux endroits",
"Ajouté entre deux 3 voies",
"Varier l'intensité"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Un interrupteur 3 voies a…",
"ch": [
"une borne commune et deux bornes de liaison",
"une borne de neutre",
"deux bornes seulement",
"quatre bornes pareilles"
],
"bon": 0,
"s": 20
},
{
"q": "L'interrupteur coupe toujours…",
"ch": [
"les deux fils",
"la phase",
"la terre",
"le neutre"
],
"bon": 1,
"s": 20
},
{
"q": "Pour commander une lumière de trois endroits, il faut deux 3 voies et un 4 voies.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Remets dans l'ordre un circuit à 3 voies.",
"ch": [
"Phase au commun du 1er 3 voies",
"Deux liaisons entre les interrupteurs",
"Commun du 2e 3 voies vers la lampe",
"Neutre directement à la lampe"
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
"q": "Une prise commandée par un interrupteur sert souvent à…",
"ch": [
"allumer une lampe sur pied à l'entrée",
"alimenter le chauffe-eau",
"protéger contre la foudre",
"brancher le réfrigérateur"
],
"bon": 0,
"s": 20
},
{
"q": "Que faut-il pour un montage de prise sécuritaire?",
"ch": [
"Mise à la terre raccordée",
"Boîte bien fixée",
"Plaque installée",
"Fils dénudés hors de la boîte"
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
"q": "Le fil nu dans la boîte se raccorde…",
"ch": [
"à la vis laiton de la phase",
"à la vis argent du neutre",
"nulle part : on le coupe",
"à la vis verte et à la boîte métallique"
],
"bon": 3,
"s": 20
}
]
},
{
"id": "defi-montages-electriques-c5-4",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Ateliers de montages électriques (C5) · Défi+ 4 de 6",
"sujet": "Ateliers 10 à 12 : schéma à échelle et dispositifs de contrôle",
"couv": "img/couvertures/montages-electriques-c5.jpg",
"coul": "#E0892B",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Un thermostat à bilame…",
"ch": [
"change la tension de 120 V à 24 V",
"courbe avec la chaleur et ouvre ou ferme un contact",
"compte les heures",
"mesure la pression et ouvre une soupape"
],
"bon": 1,
"s": 20
},
{
"q": "Un pressostat de pompe à eau : l'enclenchement, c'est…",
"ch": [
"la température",
"la pression haute où elle arrête",
"le débit",
"la pression basse où la pompe part"
],
"bon": 3,
"s": 20
},
{
"q": "L'écart entre l'enclenchement et le déclenchement d'un pressostat s'appelle…",
"ch": [
"la tension",
"le différentiel",
"la charge",
"la consigne"
],
"bon": 1,
"s": 20
},
{
"q": "L'interrupteur à flotteur d'une pompe de relevage…",
"ch": [
"arrête la pompe quand l'eau monte trop",
"coupe le gaz",
"démarre la pompe quand l'eau monte",
"règle la pression dans la colonne de sortie"
],
"bon": 2,
"s": 20
},
{
"q": "L'alarme de niveau haut avertit…",
"ch": [
"qu'il pleut",
"que la pompe n'arrive plus et que l'eau monte trop",
"que l'eau de la fosse est trop froide",
"que la pompe neuve doit être purgée"
],
"bon": 1,
"s": 20
},
{
"q": "Une commande basse tension utilise…",
"ch": [
"une prise de 240 V et un disjoncteur double",
"un fusible seulement, sans transformateur",
"une pile",
"un transformateur (120 V → 24 V) et un relais"
],
"bon": 3,
"s": 20
},
{
"q": "Le relais permet au petit circuit 24 V…",
"ch": [
"de commander une charge 120 V ou 240 V",
"d'augmenter la pression",
"de remplacer le disjoncteur du circuit",
"de chauffer l'eau sans passer par le panneau"
],
"bon": 0,
"s": 20
},
{
"q": "La bobine du relais est dans le circuit de commande; ses contacts sont dans le circuit de puissance.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Associe le symbole du schéma à échelle.",
"t": "paires",
"g": [
"Deux traits parallèles",
"Deux traits avec une barre",
"Cercle",
"Rectangle ou cercle avec lettres (M)"
],
"ch": [
"Contact normalement ouvert",
"Contact normalement fermé",
"Bobine de relais",
"Moteur"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Dans un schéma à échelle, chaque barreau est…",
"ch": [
"un étage du bâtiment",
"un circuit entre L1 et L2",
"un disjoncteur différent",
"un fil de mise à la terre"
],
"bon": 1,
"s": 20
},
{
"q": "Le contact de maintien (auto-alimentation) sert à…",
"ch": [
"inverser le sens du moteur",
"arrêter le moteur en cas de surcharge",
"baisser la tension de commande",
"garder le relais alimenté après avoir relâché « marche »"
],
"bon": 3,
"s": 20
},
{
"q": "Le bouton « arrêt » est un contact normalement fermé.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Remets dans l'ordre : marche-arrêt avec maintien.",
"ch": [
"On appuie sur « marche »",
"La bobine est alimentée",
"Le contact de maintien se ferme",
"Le moteur reste en marche"
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
"q": "Un pressostat est un dispositif qui réagit à…",
"ch": [
"la pression",
"la lumière",
"le niveau d'eau",
"la température"
],
"bon": 0,
"s": 20
},
{
"q": "La tension de commande d'un circuit de relais est souvent de combien de volts?",
"t": "estim",
"ch": [],
"bon": 24,
"tol": 10,
"u": "V",
"s": 25,
"expl": "Souvent 24 V (parfois 120 V)."
}
]
},
{
"id": "defi-montages-electriques-c5-5",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Ateliers de montages électriques (C5) · Défi+ 5 de 6",
"sujet": "Ateliers 13 à 15 : chauffe-eau électriques",
"couv": "img/couvertures/montages-electriques-c5.jpg",
"coul": "#E0892B",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Vérifier un élément chauffant hors tension : à l'ohmmètre, un élément brûlé donne…",
"ch": [
"environ 10 à 15 ohms, comme un élément neuf",
"zéro ohm exactement, comme un fil",
"une résistance infinie (circuit ouvert)",
"la tension du réseau"
],
"bon": 2,
"s": 20
},
{
"q": "L'ECO d'un chauffe-eau, c'est…",
"ch": [
"l'anode qui protège la cuve contre la rouille",
"la soupape",
"la limite haute de sécurité (coupe si l'eau devient trop chaude)",
"le mode économie qui baisse la température la nuit"
],
"bon": 2,
"s": 20
},
{
"q": "Un chauffe-eau à deux éléments « non simultané » :",
"ch": [
"il fonctionne au gaz",
"il n'a qu'un thermostat",
"les deux chauffent toujours ensemble",
"un seul élément chauffe à la fois"
],
"bon": 3,
"s": 20
},
{
"q": "Dans un chauffe-eau à deux éléments, lequel chauffe en premier quand le réservoir est froid?",
"ch": [
"Aucun",
"Les deux",
"L'élément du bas",
"L'élément du haut"
],
"bon": 3,
"s": 20
},
{
"q": "Un chauffe-eau électrique résidentiel fonctionne généralement en…",
"ch": [
"600 V",
"12 V",
"240 V",
"24 V"
],
"bon": 2,
"s": 20
},
{
"q": "On peut faire fonctionner un élément chauffant à sec (réservoir vide) pour le tester.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Il brûle en quelques secondes."
},
{
"q": "Une pompe de puits de surface (jet) est souvent alimentée en…",
"ch": [
"240 V",
"12 V",
"5 V",
"24 V"
],
"bon": 0,
"s": 20
},
{
"q": "Associe la pièce du chauffe-eau électrique.",
"t": "paires",
"g": [
"Élément du haut",
"Élément du bas",
"Thermostat du haut",
"ECO (limite haute)"
],
"ch": [
"Chauffe l'eau en premier, en haut",
"Chauffe la plus grande partie de l'eau",
"Choisit quel élément chauffe",
"Coupe tout si l'eau devient trop chaude"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Dans un chauffe-eau à deux éléments, les éléments chauffent…",
"ch": [
"un à la fois (non simultané)",
"seulement la nuit",
"toujours en même temps",
"selon la pression d'eau"
],
"bon": 0,
"s": 20
},
{
"q": "Avant de mesurer un élément à l'ohmmètre, on…",
"ch": [
"coupe le courant et débranche un fil",
"remplit le réservoir d'eau chaude",
"vide la moitié du réservoir",
"laisse le disjoncteur ouvert"
],
"bon": 0,
"s": 20
},
{
"q": "On peut alimenter un élément quand le réservoir est vide.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "L'élément brûle en quelques secondes."
},
{
"q": "Élément de 3 800 W à 240 V : résistance en Ω (arrondi à l'unité)?",
"t": "nombre",
"ch": [],
"bon": 15,
"s": 45,
"u": "Ω"
},
{
"q": "Remets dans l'ordre le remplacement d'un élément.",
"ch": [
"Couper le courant et vérifier",
"Vider le réservoir sous l'élément",
"Changer l'élément et son joint",
"Remplir, purger l'air, puis remettre le courant"
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
"q": "Un chauffe-eau de 60 gallons (US) contient environ combien de litres?",
"t": "estim",
"ch": [],
"bon": 227,
"tol": 10,
"u": "L",
"s": 30,
"expl": "60 × 3,785 ≈ 227 L."
},
{
"q": "L'ECO déclenche souvent. Cause probable :",
"ch": [
"une soupape trop neuve",
"un réservoir trop grand",
"une eau trop froide à l'entrée",
"un thermostat collé qui ne coupe plus"
],
"bon": 3,
"s": 20
}
]
},
{
"id": "defi-montages-electriques-c5-6",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Ateliers de montages électriques (C5) · Défi+ 6 de 6",
"sujet": "Ateliers 16 à 18 : pompes",
"couv": "img/couvertures/montages-electriques-c5.jpg",
"coul": "#E0892B",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Une pompe de puits artésien submersible « 3 fils » a…",
"ch": [
"seulement un neutre",
"un moteur au gaz installé au fond du puits",
"un boîtier de commande au-dessus du sol",
"aucun câblage : elle part avec la pression"
],
"bon": 2,
"s": 20
},
{
"q": "Le pressostat d'un système de puits commande…",
"ch": [
"la lumière",
"la température de l'eau qui sort du réservoir",
"le débit maximal de la douche et des robinets",
"le départ et l'arrêt de la pompe selon la pression"
],
"bon": 3,
"s": 20
},
{
"q": "La pompe de relevage (puisard) se trouve…",
"ch": [
"dans une fosse au sous-sol",
"dans le panneau",
"sur le toit",
"dans le chauffe-eau"
],
"bon": 0,
"s": 20
},
{
"q": "Remplacer un élément chauffant : dans l'ordre.",
"ch": [
"Couper et cadenasser",
"Vérifier l'absence de tension",
"Vidanger sous le niveau de l'élément",
"Remplacer, remplir, purger l'air",
"Remettre sous tension"
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
"q": "Avant de remettre un chauffe-eau électrique sous tension après l'avoir vidé :",
"ch": [
"fermer l'eau froide pour garder le réservoir vide",
"rien : on remet le disjoncteur tout de suite",
"enlever l'ECO",
"le remplir complètement et purger l'air par un robinet d'eau chaude"
],
"bon": 3,
"s": 20
},
{
"q": "Un fil de mise à la terre sur une pompe sert à…",
"ch": [
"rien",
"faire tourner le moteur plus vite au démarrage",
"protéger contre les chocs si un fil touche la carcasse",
"augmenter la pression dans le réservoir"
],
"bon": 2,
"s": 20
},
{
"q": "Ce qu'on mesure sur un moteur de pompe, hors tension :",
"ch": [
"La résistance des enroulements",
"La continuité vers la carcasse (ne doit pas y en avoir)",
"La pression du puits",
"La couleur du fil"
],
"bon": [
0,
1
],
"s": 30,
"t": "multi"
},
{
"q": "Le formatif de la compétence 5 vérifie…",
"ch": [
"la théorie, le montage réussi et des mesures justes",
"la propreté du local",
"seulement la vitesse à laquelle tu montes le circuit",
"le nombre de fils utilisés pour chaque montage"
],
"bon": 0,
"s": 20
},
{
"q": "Associe la pièce de la pompe à son rôle.",
"t": "paires",
"g": [
"Pressostat",
"Réservoir sous pression",
"Clapet de pied",
"Flotteur"
],
"ch": [
"Part et arrête selon la pression",
"Évite que la pompe parte trop souvent",
"Garde la conduite pleine d'eau",
"Part la pompe de puisard"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Le pressostat d'une pompe de puits réglé 40/60 veut dire…",
"ch": [
"pression maximale de 100 psi",
"départ à 60 psi, arrêt à 40 psi",
"40 secondes de marche sur 60",
"départ à 40 psi, arrêt à 60 psi"
],
"bon": 3,
"s": 20
},
{
"q": "Une pompe qui part et arrête très souvent (cycle court) : on vérifie…",
"ch": [
"la pression d'air du réservoir",
"le disjoncteur de la cuisine",
"le diamètre du drain",
"la couleur de l'eau"
],
"bon": 0,
"s": 20
},
{
"q": "On vérifie la pression d'air d'un réservoir quand la pompe est arrêtée et le réservoir vide d'eau.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Remets dans l'ordre le fonctionnement d'une pompe de puisard.",
"ch": [
"L'eau monte dans la fosse",
"Le flotteur se soulève",
"La pompe part",
"L'eau sort et le flotteur redescend"
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
"q": "Que vérifie-t-on sur une pompe de puisard au printemps?",
"ch": [
"Le flotteur",
"Le clapet antiretour",
"La sortie extérieure",
"Le thermostat"
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
"q": "La pression d'air d'un réservoir pour un pressostat 40/60 se règle à environ combien de psi?",
"t": "estim",
"ch": [],
"bon": 38,
"tol": 10,
"u": "psi",
"s": 30,
"expl": "Environ 2 psi sous le départ : 38 psi."
}
]
},
{
"id": "defi-notions-energie-c13-1",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Notions d'énergie (C13) · Défi+ 1 de 6",
"sujet": "Module 1 : les sources d'énergie",
"couv": "img/couvertures/notions-energie-c13.jpg",
"coul": "#0F6E56",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "L'énergie et la puissance : laquelle est une vitesse?",
"ch": [
"Aucune",
"L'énergie",
"Les deux",
"La puissance"
],
"bon": 3,
"s": 20
},
{
"q": "1 kW équivaut à combien de BTU/h (environ)?",
"t": "nombre",
"ch": [],
"bon": 3412,
"s": 45,
"u": "BTU/h"
},
{
"q": "1 tonne de climatisation équivaut à combien de BTU/h?",
"t": "nombre",
"ch": [],
"bon": 12000,
"s": 45,
"u": "BTU/h"
},
{
"q": "Le mazout utilisé pour le chauffage résidentiel :",
"ch": [
"le propane",
"l'essence",
"le mazout léger n° 2",
"le diesel marin"
],
"bon": 2,
"s": 20
},
{
"q": "Lesquelles captent une chaleur gratuite et renouvelable?",
"ch": [
"Géothermie",
"Aérothermie",
"Solaire",
"Mazout"
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
"q": "Le vrai coût de l'énergie tient compte…",
"ch": [
"de la couleur de l'appareil",
"du prix et du rendement de l'appareil",
"du prix seulement",
"de la marque"
],
"bon": 1,
"s": 20
},
{
"q": "Un appareil au mazout transforme l'énergie : dans l'ordre.",
"ch": [
"Énergie chimique du mazout",
"Combustion dans le brûleur",
"Chaleur transmise à l'eau de la chaudière",
"Chaleur dans la pièce"
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
"q": "Associe la source d'énergie.",
"t": "paires",
"g": [
"Électricité au Québec",
"Mazout",
"Gaz naturel",
"Géothermie"
],
"ch": [
"Surtout hydroélectrique",
"Livré par camion et gardé dans un réservoir",
"Arrive par une conduite de distribution",
"Chaleur prise dans le sol"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Une énergie renouvelable…",
"ch": [
"coûte toujours moins cher",
"se refait naturellement (eau, vent, soleil)",
"vient du pétrole",
"ne pollue jamais du tout"
],
"bon": 1,
"s": 20
},
{
"q": "Le BTU mesure…",
"ch": [
"une quantité de chaleur",
"une pression",
"une tension électrique",
"un débit d'eau"
],
"bon": 0,
"s": 20
},
{
"q": "1 kW équivaut à environ 3 412 BTU/h.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Une plinthe de 2 kW donne combien de BTU/h (arrondi)? (1 kW = 3 412 BTU/h)",
"t": "nombre",
"ch": [],
"bon": 6824,
"s": 45,
"u": "BTU/h"
},
{
"q": "Remets ces énergies de la plus chère à la moins chère au Québec (en général, pour chauffer).",
"ch": [
"Mazout",
"Électricité (plinthes)",
"Thermopompe",
"Géothermie"
],
"bon": [
0,
1,
2,
3
],
"s": 50,
"t": "ordre"
},
{
"q": "Un litre de mazout contient environ combien de kWh d'énergie?",
"t": "estim",
"ch": [],
"bon": 10.7,
"tol": 15,
"u": "kWh",
"s": 30,
"expl": "Environ 10,7 kWh par litre."
},
{
"q": "La biénergie, c'est…",
"ch": [
"deux thermostats dans une pièce",
"un appareil qui produit de l'électricité",
"deux chaudières électriques",
"deux sources : électricité et un combustible d'appoint"
],
"bon": 3,
"s": 20
}
]
},
{
"id": "defi-notions-energie-c13-2",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Notions d'énergie (C13) · Défi+ 2 de 6",
"sujet": "Module 2 : les pertes de chaleur",
"couv": "img/couvertures/notions-energie-c13.jpg",
"coul": "#0F6E56",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Les trois modes de transfert de chaleur :",
"ch": [
"Conduction",
"Convection",
"Rayonnement",
"Évaporation"
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
"q": "Dans une vieille maison, la plus grosse perte de chaleur vient souvent…",
"ch": [
"des fuites d'air",
"des lumières",
"du plancher du sous-sol",
"du chauffe-eau"
],
"bon": 0,
"s": 20
},
{
"q": "L'effet de cheminée :",
"ch": [
"l'air chaud monte et sort par le haut, aspirant l'air froid par le bas",
"l'air froid monte et sort par le haut de la maison",
"la cheminée réchauffe toute la maison par rayonnement",
"l'air ne bouge pas"
],
"bon": 0,
"s": 20
},
{
"q": "Un pont thermique, c'est…",
"ch": [
"une fenêtre ouverte",
"un isolant de très bonne qualité posé entre deux murs",
"un endroit où la chaleur passe plus facilement à travers l'enveloppe",
"un pont chauffé pour éviter la glace l'hiver"
],
"bon": 2,
"s": 20
},
{
"q": "La valeur R sur l'emballage d'un isolant, c'est la résistance…",
"ch": [
"électrique",
"en BTU par heure et par pied carré",
"effective, garantie une fois l'isolant posé",
"nominale (la réelle, une fois posé, peut être plus basse)"
],
"bon": 3,
"s": 20
},
{
"q": "La caméra thermique sert à…",
"ch": [
"mesurer la pression",
"lire les plans",
"trouver les fils",
"voir les pertes de chaleur"
],
"bon": 3,
"s": 20
},
{
"q": "Plus il y a de degrés-jours dans une région…",
"ch": [
"rien ne change",
"moins il faut chauffer",
"plus il fait chaud",
"plus il faut chauffer"
],
"bon": 3,
"s": 20
},
{
"q": "Perte de 8 460 W pour un ΔT de 47 °C : quel coefficient, en W/°C?",
"t": "nombre",
"ch": [],
"bon": 180,
"s": 50,
"u": "W/°C"
},
{
"q": "Associe la perte de chaleur à sa cause.",
"t": "paires",
"g": [
"Conduction",
"Convection (fuites d'air)",
"Rayonnement",
"Ponts thermiques"
],
"ch": [
"La chaleur traverse le mur",
"L'air chaud s'échappe par les fissures",
"Chaleur émise par les vitres",
"Montants et dalles qui transmettent le froid"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "La valeur R d'un isolant indique…",
"ch": [
"son poids par panneau",
"son prix par mètre carré",
"sa résistance au feu",
"sa résistance au passage de la chaleur"
],
"bon": 3,
"s": 20
},
{
"q": "Plus l'écart de température dehors-dedans est grand…",
"ch": [
"moins les pertes sont grandes",
"les pertes restent pareilles",
"plus les pertes sont grandes",
"plus l'air est sec"
],
"bon": 2,
"s": 20
},
{
"q": "Une fenêtre perd plus de chaleur qu'un mur isolé de même surface.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Où l'air s'échappe-t-il souvent dans une maison?",
"ch": [
"Autour des fenêtres",
"Prises sur les murs extérieurs",
"Trappe du grenier",
"Au milieu d'un plancher de béton"
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
"q": "Le « degré-jour » sert à…",
"ch": [
"régler le thermostat",
"mesurer la vitesse du vent",
"calculer le débit d'eau",
"comparer les besoins de chauffage d'une année à l'autre"
],
"bon": 3,
"s": 20
},
{
"q": "Un mur de 2 × 6 rempli de laine minérale a une valeur R d'environ…",
"t": "estim",
"ch": [],
"bon": 20,
"tol": 15,
"u": "R",
"s": 25,
"expl": "Environ R-19 à R-22."
}
]
},
{
"id": "defi-notions-energie-c13-3",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Notions d'énergie (C13) · Défi+ 3 de 6",
"sujet": "Module 3 : émetteurs et débit",
"couv": "img/couvertures/notions-energie-c13.jpg",
"coul": "#0F6E56",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Une plinthe électrique de 1 000 W donne combien de BTU/h (environ)?",
"t": "nombre",
"ch": [],
"bon": 3412,
"s": 45,
"u": "BTU/h"
},
{
"q": "Une plinthe à eau chaude : plus l'eau est chaude…",
"ch": [
"moins elle chauffe",
"rien ne change",
"plus chaque pied de plinthe donne de chaleur",
"plus elle consomme d'électricité"
],
"bon": 2,
"s": 20
},
{
"q": "Le plancher radiant hydronique utilise surtout…",
"ch": [
"des tubes de PEX dans la dalle ou sous le plancher",
"de l'air chaud pulsé sous le plancher",
"des fils électriques noyés dans la dalle",
"de la vapeur"
],
"bon": 0,
"s": 20
},
{
"q": "L'eau d'un réseau de chauffage, c'est comme…",
"ch": [
"un camion de livraison de chaleur",
"un isolant qui garde la chaleur dans les murs",
"un filtre",
"un combustible qui brûle dans la chaudière"
],
"bon": 0,
"s": 20
},
{
"q": "Dans un réseau fermé, le circulateur…",
"ch": [
"chauffe l'eau en la faisant tourner vite",
"vainc les pertes de charge, il ne « monte » pas l'eau",
"remplit le réseau",
"monte l'eau jusqu'au 2e étage comme une pompe de puits"
],
"bon": 1,
"s": 20
},
{
"q": "La perte de charge, c'est…",
"ch": [
"la pression de la ville",
"le frottement de l'eau sur les parois du tuyau",
"la chaleur perdue par les tuyaux dans le sous-sol",
"une fuite d'eau dans le réseau de chauffage"
],
"bon": 1,
"s": 20
},
{
"q": "Tout système de chauffage…",
"ch": [
"filtre l'eau",
"produit la chaleur, sans avoir besoin de la distribuer",
"produit, distribue et émet la chaleur",
"refroidit l'air l'été et le chauffe l'hiver"
],
"bon": 2,
"s": 20
},
{
"q": "Associe l'émetteur à sa façon de chauffer.",
"t": "paires",
"g": [
"Plinthe à eau chaude",
"Radiateur en fonte",
"Plancher radiant",
"Aérotherme"
],
"ch": [
"Convection entre les ailettes",
"Chauffe lentement et garde la chaleur",
"Rayonnement du plancher",
"Ventilateur qui souffle sur un serpentin"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Le débit d'eau se mesure souvent en…",
"ch": [
"livres par pouce carré",
"BTU par litre",
"gallons US par minute (GPM)",
"kilowatts-heures"
],
"bon": 2,
"s": 20
},
{
"q": "Avec un écart de 20 °F, un GPM transporte environ…",
"ch": [
"1 000 BTU/h",
"500 BTU/h",
"10 000 BTU/h",
"100 000 BTU/h"
],
"bon": 2,
"s": 20
},
{
"q": "Un plancher radiant fonctionne avec de l'eau moins chaude que des plinthes.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Une maison a besoin de 40 000 BTU/h avec un écart de 20 °F. Combien de GPM? (BTU/h ÷ 10 000)",
"t": "nombre",
"ch": [],
"bon": 4,
"s": 45,
"u": "GPM"
},
{
"q": "Remets dans l'ordre le chemin de l'eau dans une boucle de chauffage.",
"ch": [
"Chaudière",
"Circulateur",
"Émetteurs",
"Retour à la chaudière"
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
"q": "Qu'est-ce qui réduit le débit dans une boucle?",
"ch": [
"De l'air dans le réseau",
"Une valve à moitié fermée",
"Un tuyau trop petit",
"Un thermomètre neuf"
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
"q": "Un émetteur qui chauffe en bas mais pas en haut a souvent…",
"ch": [
"trop de débit",
"une soupape ouverte",
"une eau trop chaude",
"de l'air à purger"
],
"bon": 3,
"s": 20
}
]
},
{
"id": "defi-notions-energie-c13-4",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Notions d'énergie (C13) · Défi+ 4 de 6",
"sujet": "Module 4 : circulateur et fonctionnement des systèmes",
"couv": "img/couvertures/notions-energie-c13.jpg",
"coul": "#0F6E56",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Une fournaise à air pulsé chauffe…",
"ch": [
"l'air, à travers un échangeur de chaleur",
"le sol",
"le sol, avec des tubes de PEX dans la dalle",
"l'eau des plinthes, à travers un serpentin"
],
"bon": 0,
"s": 20
},
{
"q": "Une fournaise à condensation mal installée (évacuation, air de combustion, drain)…",
"ch": [
"ne donne pas son rendement et peut être dangereuse",
"fonctionne mieux, parce que le drain est facultatif",
"n'a aucun problème",
"consomme moins, même sans air de combustion"
],
"bon": 0,
"s": 20
},
{
"q": "La soupape de sûreté d'une chaudière…",
"ch": [
"s'ouvre si la pression dépasse son réglage",
"remplit la chaudière quand la pression baisse",
"purge l'air",
"règle la température de l'eau de chauffage"
],
"bon": 0,
"s": 20
},
{
"q": "Une thermopompe utilise un frigorigène qui…",
"ch": [
"bout à très basse température",
"gèle à 0 °C",
"ne change jamais d'état",
"brûle"
],
"bon": 0,
"s": 20
},
{
"q": "On ajoute du glycol dans une boucle quand…",
"ch": [
"l'eau est trop dure et laisse du calcaire",
"on veut plus de pression dans la boucle",
"elle risque de geler (garage, chalet, géothermie)",
"jamais"
],
"bon": 2,
"s": 20
},
{
"q": "Un système combiné utilise la même chaudière pour…",
"ch": [
"le chauffage et la climatisation",
"l'eau et le gaz",
"deux maisons",
"le chauffage et l'eau chaude domestique"
],
"bon": 3,
"s": 20
},
{
"q": "Le rendement de combustion, c'est…",
"ch": [
"la part de l'énergie du combustible transmise à l'eau ou à l'air",
"la quantité de mazout brûlée en une heure",
"la température extérieure",
"la vitesse du ventilateur du brûleur au démarrage"
],
"bon": 0,
"s": 20
},
{
"q": "Débit d'eau : pour la même puissance, un ΔT plus grand demande…",
"ch": [
"moins de débit",
"le même débit",
"aucun débit",
"plus de débit"
],
"bon": 0,
"s": 20
},
{
"q": "Associe la pièce au fonctionnement du système.",
"t": "paires",
"g": [
"Circulateur",
"Vase d'expansion",
"Purgeur",
"Soupape de sûreté"
],
"ch": [
"Pousse l'eau",
"Absorbe la dilatation",
"Sort l'air",
"Évacue la surpression"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Le circulateur se place souvent « en pompant en s'éloignant » du vase d'expansion pour…",
"ch": [
"éviter de faire baisser la pression à l'aspiration",
"chauffer l'eau plus vite",
"faire plus de bruit",
"remplir la chaudière"
],
"bon": 0,
"s": 20
},
{
"q": "Un circulateur qui tourne mais ne fait pas circuler peut avoir…",
"ch": [
"un tuyau neuf",
"un accouplement brisé ou de l'air",
"un thermostat trop bas",
"trop de pression d'eau"
],
"bon": 1,
"s": 20
},
{
"q": "Le vase d'expansion à membrane a une précharge d'air réglée avant le remplissage.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Remets dans l'ordre le fonctionnement d'un système à eau chaude.",
"ch": [
"Le thermostat demande de la chaleur",
"Le brûleur et le circulateur partent",
"L'eau chaude circule dans les émetteurs",
"Le thermostat est satisfait et tout s'arrête"
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
"q": "Pression d'une chaudière résidentielle à eau chaude, à chaud : environ combien de psi?",
"t": "estim",
"ch": [],
"bon": 20,
"tol": 25,
"u": "psi",
"s": 30,
"expl": "Environ 15 à 25 psi à chaud, sous la soupape de 30 psi."
},
{
"q": "Le mot « zone » dans un système de chauffage veut dire…",
"ch": [
"une partie du bâtiment avec son propre thermostat",
"un étage sans chauffage",
"une chaudière de secours",
"un tuyau de retour"
],
"bon": 0,
"s": 20
}
]
},
{
"id": "defi-notions-energie-c13-5",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Notions d'énergie (C13) · Défi+ 5 de 6",
"sujet": "Module 5 : les brûleurs à l'huile",
"couv": "img/couvertures/notions-energie-c13.jpg",
"coul": "#0F6E56",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Le mazout en flaque est difficile à allumer, parce que…",
"ch": [
"seule sa vapeur brûle : il faut le pulvériser",
"il est trop épais pour couler dans la buse",
"il est trop froid et doit être réchauffé",
"il contient de l'eau"
],
"bon": 0,
"s": 20
},
{
"q": "Le brûleur à pulvérisation (« à canon »)…",
"ch": [
"pulvérise le mazout, le mélange à l'air et l'allume",
"mesure la flamme",
"pompe l'eau de la chaudière vers les radiateurs",
"chauffe le réservoir de mazout avant l'allumage"
],
"bon": 0,
"s": 20
},
{
"q": "Le gicleur est en laiton avec…",
"ch": [
"un orifice usiné et une chambre de tourbillonnement",
"un filtre à air et une petite hélice",
"un aimant",
"une résistance qui chauffe le mazout"
],
"bon": 0,
"s": 20
},
{
"q": "La cellule au CdS a une résistance…",
"ch": [
"nulle",
"toujours la même, flamme ou pas",
"très élevée dans le noir, faible quand elle voit la flamme",
"faible dans le noir, très élevée avec la flamme"
],
"bon": 2,
"s": 20
},
{
"q": "Avec le mazout, la combustion se vérifie avec…",
"ch": [
"un analyseur de combustion et le tirage",
"un thermomètre de cuisine dans la cheminée",
"un ruban à mesurer",
"une caméra thermique pointée sur la flamme"
],
"bon": 0,
"s": 20
},
{
"q": "Un bon diagnostic part…",
"ch": [
"du changement des pièces les plus souvent brisées",
"du symptôme du client, puis des causes les plus probables",
"de la marque et de l'âge de l'appareil",
"du prix"
],
"bon": 1,
"s": 20
},
{
"q": "Pour économiser l'énergie, on commence par…",
"ch": [
"la base : un appareil bien entretenu et l'enveloppe",
"rien",
"le gadget le plus cher et le plus récent",
"remplacer tout l'appareil, même s'il fonctionne"
],
"bon": 0,
"s": 20
},
{
"q": "Associe la pièce du brûleur à l'huile.",
"t": "paires",
"g": [
"Pompe à mazout",
"Gicleur",
"Électrodes",
"Volet d'air"
],
"ch": [
"Pousse le mazout sous pression",
"Pulvérise en fin brouillard",
"Font l'étincelle d'allumage",
"Règle l'air de combustion"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Une flamme de brûleur bien réglée est…",
"ch": [
"jaune avec de la fumée noire",
"bleue et très petite",
"rouge foncé avec de la suie",
"orange vif, sans fumée"
],
"bon": 3,
"s": 20
},
{
"q": "Trop peu d'air de combustion cause…",
"ch": [
"une flamme plus économique",
"rien de particulier",
"une meilleure efficacité",
"de la suie et du monoxyde de carbone"
],
"bon": 3,
"s": 20
},
{
"q": "Le gicleur se change à chaque entretien annuel.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "L'entretien annuel d'un brûleur comprend…",
"ch": [
"Changer le gicleur et le filtre",
"Vérifier les électrodes",
"Analyser la combustion",
"Repeindre la chaudière"
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
"q": "Remets dans l'ordre le démarrage d'un brûleur à l'huile.",
"ch": [
"Appel de chaleur",
"Moteur et allumage partent",
"Le mazout est pulvérisé et s'allume",
"La cellule voit la flamme"
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
"q": "La pression de pompe d'un brûleur résidentiel est souvent d'environ combien de psi?",
"t": "estim",
"ch": [],
"bon": 100,
"tol": 20,
"u": "psi",
"s": 30,
"expl": "Souvent 100 psi (parfois plus, selon le fabricant)."
},
{
"q": "Un gicleur de 0,75 USGPH brûle environ…",
"ch": [
"0,75 kW",
"0,75 litre par jour",
"75 gallons par semaine",
"0,75 gallon US de mazout par heure"
],
"bon": 3,
"s": 20
}
]
},
{
"id": "defi-notions-energie-c13-6",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Notions d'énergie (C13) · Défi+ 6 de 6",
"sujet": "Modules 6 et 7 : économiser l'énergie et conseiller le client",
"couv": "img/couvertures/notions-energie-c13.jpg",
"coul": "#0F6E56",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Le VRC (ventilateur récupérateur de chaleur)…",
"ch": [
"chauffe l'eau avec la chaleur de l'air sortant",
"filtre l'eau",
"ventile une maison étanche en récupérant la chaleur de l'air sortant",
"climatise la maison en récupérant l'humidité"
],
"bon": 2,
"s": 20
},
{
"q": "Le récupérateur de chaleur des eaux de drainage…",
"ch": [
"préchauffe l'eau froide avec l'eau tiède de la douche",
"chauffe l'égout pour éviter qu'il gèle",
"remplace le chauffe-eau dans les petits logements",
"fait du bruit"
],
"bon": 0,
"s": 20
},
{
"q": "Le différentiel d'un thermostat sert à…",
"ch": [
"économiser le mazout, mais seulement la nuit",
"rien",
"augmenter la température quand il fait très froid",
"éviter que le chauffage parte et arrête sans arrêt"
],
"bon": 3,
"s": 20
},
{
"q": "« La chaleur la moins chère est celle qu'on ne produit pas » : outil?",
"ch": [
"Enlever l'isolant",
"Ouvrir les fenêtres pour aérer chaque jour",
"Augmenter la consigne pour chauffer plus vite",
"Thermostats programmables et zonage"
],
"bon": 3,
"s": 20
},
{
"q": "Expliquer « AFUE de 96 % » à un client :",
"ch": [
"« Il consomme 96 % de plus qu'un vieil appareil »",
"« L'appareil devrait durer environ 96 ans »",
"« Sur toute la saison, 96 % du gaz devient de la chaleur pour la maison »",
"« C'est 96 °C »"
],
"bon": 2,
"s": 20
},
{
"q": "Avant de conseiller un client, on écoute ses besoins :",
"ch": [
"Qu'est-ce qui vous dérange (froid, facture, bruit)?",
"Quelles pièces sont inconfortables?",
"Quel est votre budget?",
"Quel est votre signe astrologique?"
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
"q": "Structurer une recommandation : dans l'ordre.",
"ch": [
"Situation",
"Options",
"Recommandation"
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
"q": "La documentation des fabricants est souvent…",
"ch": [
"inexistante : on apprend tout sur le terrain",
"dessinée seulement, sans aucun texte",
"en latin",
"en anglais : il faut connaître les termes"
],
"bon": 3,
"s": 20
},
{
"q": "Associe le conseil d'économie au gain.",
"t": "paires",
"g": [
"Thermostat programmable",
"Coupe-froid neuf",
"Isolation des tuyaux",
"Entretien du brûleur"
],
"ch": [
"Baisse la nuit et le jour quand on est absent",
"Moins de fuites d'air",
"Moins de chaleur perdue en route",
"Meilleure combustion"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Baisser le thermostat de 3 °C la nuit permet d'économiser…",
"ch": [
"quelques pour cent sur le chauffage",
"la moitié de la facture",
"seulement en été",
"rien du tout"
],
"bon": 0,
"s": 20
},
{
"q": "Pour conseiller un client, on commence par…",
"ch": [
"parler du prix du mazout",
"critiquer son vieux système",
"lui vendre l'appareil le plus cher",
"écouter ses besoins et regarder ses factures"
],
"bon": 3,
"s": 20
},
{
"q": "Un appareil plus efficace coûte parfois plus cher à l'achat, mais moins à utiliser.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Une facture de chauffage de 2 000 $ par an baisse de 15 %. Économie en $ par année?",
"t": "nombre",
"ch": [],
"bon": 300,
"s": 45,
"u": "$"
},
{
"q": "Remets dans l'ordre une visite-conseil chez un client.",
"ch": [
"Écouter et poser des questions",
"Inspecter le système",
"Expliquer les choix, simplement",
"Laisser un résumé écrit"
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
"q": "Une thermopompe a un COP d'environ 3 : pour 1 kWh d'électricité, combien de kWh de chaleur?",
"t": "estim",
"ch": [],
"bon": 3,
"tol": 10,
"u": "kWh",
"s": 25,
"expl": "Le COP de 3 donne 3 kWh de chaleur pour 1 kWh."
}
]
},
{
"id": "defi-dispositifs-electriques-c9-1",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Dispositifs électriques et électroniques (C9) · Défi+ 1 de 6",
"sujet": "Modules 1 et 2 : le courant et les composants",
"couv": "img/couvertures/dispositifs-electriques-c9.jpg",
"coul": "#E0892B",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Lesquels sont des conducteurs?",
"ch": [
"Cuivre",
"Eau du robinet",
"Corps humain",
"Caoutchouc"
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
"q": "Au Québec, l'électricité vient surtout…",
"ch": [
"de centrales au charbon et au gaz naturel",
"de centrales nucléaires comme Gentilly-2",
"du mazout",
"de centrales hydroélectriques"
],
"bon": 3,
"s": 20
},
{
"q": "À partir de combien de mA une prise ou un disjoncteur DDFT déclenche-t-il (environ)?",
"t": "nombre",
"ch": [],
"bon": 5,
"s": 40,
"u": "mA"
},
{
"q": "Feu d'origine électrique :",
"ch": [
"on jette de l'eau pour refroidir rapidement",
"on souffle dessus",
"on ouvre le panneau pour voir d'où ça vient",
"jamais d'eau; extincteur de classe C (CO₂ ou poudre)"
],
"bon": 3,
"s": 20
},
{
"q": "Vérifier l'absence de tension : la méthode en 3 temps.",
"ch": [
"Vérifier le multimètre sur une source connue",
"Mesurer le circuit coupé",
"Revérifier le multimètre sur la source connue"
],
"bon": [
0,
1,
2
],
"s": 45,
"t": "ordre"
},
{
"q": "Le filage d'alimentation 120/240 V, du panneau jusqu'à l'appareil, c'est le travail…",
"ch": [
"du client",
"du tuyauteur",
"de l'électricien",
"du préposé"
],
"bon": 2,
"s": 20
},
{
"q": "Un fil de thermostat 24 V typique :",
"ch": [
"2 AWG",
"12 AWG",
"6 AWG",
"18 AWG"
],
"bon": 3,
"s": 20
},
{
"q": "Associe la grandeur électrique à son unité.",
"t": "paires",
"g": [
"Tension",
"Courant",
"Résistance",
"Puissance"
],
"ch": [
"Volt (V)",
"Ampère (A)",
"Ohm (Ω)",
"Watt (W)"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "La loi d'Ohm s'écrit…",
"ch": [
"R = U × I",
"U = R ÷ I",
"I = R × U",
"U = R × I"
],
"bon": 3,
"s": 20
},
{
"q": "Pour mesurer un courant, le multimètre se branche…",
"ch": [
"entre deux circuits différents",
"en série, ou avec une pince ampèremétrique",
"en parallèle sur l'appareil",
"sur la mise à la terre seulement"
],
"bon": 1,
"s": 20
},
{
"q": "On mesure une résistance hors tension.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Quels composants sont des charges?",
"ch": [
"Un moteur",
"Un élément chauffant",
"Une bobine de relais",
"Un interrupteur"
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
"q": "Un fusible sert à…",
"ch": [
"augmenter la tension au moteur",
"garder la chaleur dans l'appareil",
"couper le circuit si le courant est trop fort",
"allumer la flamme du brûleur"
],
"bon": 2,
"s": 20
},
{
"q": "Un élément de 240 V tire 12,5 A. Quelle puissance en W?",
"t": "nombre",
"ch": [],
"bon": 3000,
"s": 45,
"u": "W"
},
{
"q": "Une plinthe de 1500 W sur 240 V tire environ combien d'ampères?",
"t": "estim",
"ch": [],
"bon": 6.25,
"tol": 10,
"u": "A",
"s": 30,
"expl": "1500 ÷ 240 = 6,25 A."
}
]
},
{
"id": "defi-dispositifs-electriques-c9-2",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Dispositifs électriques et électroniques (C9) · Défi+ 2 de 6",
"sujet": "Modules 2 et 3 : composants et lecture de schémas",
"couv": "img/couvertures/dispositifs-electriques-c9.jpg",
"coul": "#E0892B",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "La loi d'Ohm :",
"ch": [
"I = E × R",
"P = R + I",
"E = R ÷ I",
"E = R × I"
],
"bon": 3,
"s": 20
},
{
"q": "Un contact ouvert n'a jamais de tension à ses bornes.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Ouvert ≠ sans tension : il a la pleine tension à ses bornes."
},
{
"q": "Un transformateur fonctionne par…",
"ch": [
"induction",
"combustion",
"pression",
"friction"
],
"bon": 0,
"s": 20
},
{
"q": "Choisir un transformateur : après avoir additionné les VA des charges, on ajoute une marge d'environ…",
"ch": [
"5 %",
"aucune",
"20 %",
"100 %"
],
"bon": 2,
"s": 20
},
{
"q": "Relais ou contacteur : lequel a les plus gros contacts (20, 30, 40 A)?",
"ch": [
"Le contacteur",
"Les deux pareils",
"Aucun",
"Le relais"
],
"bon": 0,
"s": 20
},
{
"q": "Un bilame…",
"ch": [
"un moteur",
"un fil de cuivre double qui chauffe et coupe le courant comme un fusible",
"un fusible à deux lames qui fond si l'appareil surchauffe",
"deux métaux qui courbent avec la chaleur et ouvrent ou ferment un contact"
],
"bon": 3,
"s": 20
},
{
"q": "Sur un thermostat, la borne R est…",
"ch": [
"le 24 V du transformateur",
"la terre",
"le ventilateur intérieur, qui part en même temps que le chauffage",
"le retour du compresseur (fil rouge vers l'unité extérieure)"
],
"bon": 0,
"s": 20
},
{
"q": "Sur un schéma, un relais est toujours dessiné…",
"ch": [
"en marche (bobine alimentée, contacts fermés)",
"en couleur",
"au repos (bobine non alimentée)",
"dans la position du dernier essai fait par le technicien"
],
"bon": 2,
"s": 20
},
{
"q": "Associe le composant à son rôle.",
"t": "paires",
"g": [
"Relais",
"Transformateur",
"Thermostat",
"Contacteur"
],
"ch": [
"Un petit courant commande un autre circuit",
"Baisse la tension (ex. 120 V à 24 V)",
"Ouvre ou ferme selon la température",
"Commande une grosse charge, comme un compresseur"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Un contact « NO » est…",
"ch": [
"fermé au repos",
"sans bobine",
"toujours fermé",
"ouvert au repos"
],
"bon": 3,
"s": 20
},
{
"q": "Dans un schéma, les composants sont dessinés…",
"ch": [
"au repos, sans courant",
"en marche, sous tension",
"comme ils étaient au dernier essai",
"selon la saison"
],
"bon": 0,
"s": 20
},
{
"q": "Le transformateur de commande d'une chaudière donne souvent 24 V.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Remets dans l'ordre la lecture d'un schéma en échelle.",
"ch": [
"Trouver l'alimentation (L1, L2)",
"Suivre chaque ligne de gauche à droite",
"Repérer les contacts et leur bobine",
"Trouver la charge au bout de la ligne"
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
"q": "Les lettres « R » et « W » sur un thermostat 24 V, c'est…",
"ch": [
"relais et ventilateur",
"retour et eau chaude",
"l'alimentation et l'appel de chaleur",
"rouge et blanc, sans importance"
],
"bon": 2,
"s": 20
},
{
"q": "Un transformateur de 40 VA à 24 V peut fournir environ combien d'ampères?",
"t": "estim",
"ch": [],
"bon": 1.67,
"tol": 10,
"u": "A",
"s": 30,
"expl": "40 ÷ 24 ≈ 1,67 A."
}
]
},
{
"id": "defi-dispositifs-electriques-c9-3",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Dispositifs électriques et électroniques (C9) · Défi+ 3 de 6",
"sujet": "Modules 3 et 4 : schémas, valves et aquastats",
"couv": "img/couvertures/dispositifs-electriques-c9.jpg",
"coul": "#E0892B",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Sur un schéma, « 1R1 » et « 2R1 » désignent…",
"ch": [
"les contacts 1 et 2 du même relais R1",
"deux fusibles",
"deux lampes témoins branchées sur le relais R1",
"deux relais différents, montés dans le même panneau"
],
"bon": 0,
"s": 20
},
{
"q": "Valve de zone 2 fils : la séquence.",
"ch": [
"Le thermostat ferme : le moteur 24 V est alimenté",
"La valve s'ouvre lentement",
"En fin de course, l'interrupteur se ferme",
"La pompe ou le brûleur part"
],
"bon": [
0,
1,
2,
3
],
"s": 50,
"t": "ordre"
},
{
"q": "L'interrupteur de fin de course d'une valve de zone prouve…",
"ch": [
"que le brûleur est éteint",
"que l'eau est froide",
"que le thermostat est brisé",
"que la valve est ouverte"
],
"bon": 3,
"s": 20
},
{
"q": "Un interrupteur de débit (Johnson F61) : la flèche du boîtier pointe…",
"ch": [
"vers le haut",
"contre le débit",
"vers le panneau",
"dans le sens du débit"
],
"bon": 3,
"s": 20
},
{
"q": "La réinitialisation extérieure (courbe de chauffe) :",
"ch": [
"l'eau de chauffage reste toujours à la même température, peu importe la météo",
"plus il fait froid dehors, plus l'eau domestique est chaude",
"plus il fait froid dehors, plus l'eau de chauffage est chaude",
"elle règle l'eau domestique"
],
"bon": 2,
"s": 20
},
{
"q": "La température extérieure de conception, c'est…",
"ch": [
"0 °C",
"la température moyenne de l'été",
"la journée la plus froide prévue de l'année",
"la température de la chaufferie"
],
"bon": 2,
"s": 20
},
{
"q": "Un circulateur à moteur ECM…",
"ch": [
"fonctionne à la vapeur",
"tourne toujours à pleine vitesse pour garder la pression stable",
"n'a aucune électronique : il démarre seulement avec un relais",
"ajuste sa vitesse au besoin et consomme moins"
],
"bon": 3,
"s": 20
},
{
"q": "Associe la commande à son action.",
"t": "paires",
"g": [
"Aquastat haut (limite)",
"Aquastat bas",
"Valve de zone",
"Interrupteur de fin de course"
],
"ch": [
"Coupe le brûleur si l'eau est trop chaude",
"Garde l'eau chaude pour l'eau domestique",
"Ouvre l'eau d'une zone",
"Dit à la chaudière que la valve est ouverte"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "La valve de zone à moteur s'ouvre quand…",
"ch": [
"la pression de l'eau baisse",
"la chaudière atteint sa limite haute",
"le thermostat de sa zone demande de la chaleur",
"le circulateur s'arrête"
],
"bon": 2,
"s": 20
},
{
"q": "Le différentiel d'un aquastat, c'est…",
"ch": [
"la pression de la chaudière",
"le temps avant l'allumage",
"la température maximale de sécurité",
"l'écart entre l'arrêt et le redémarrage"
],
"bon": 3,
"s": 20
},
{
"q": "Un bouton de réarmement manuel doit être réarmé sans chercher la cause.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "On cherche toujours pourquoi il a coupé."
},
{
"q": "Une chaudière ne part pas. Tu vérifies…",
"ch": [
"L'alimentation électrique",
"L'appel du thermostat",
"Les limites de sécurité",
"La couleur du tuyau"
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
"q": "Le circulateur démarre souvent par…",
"ch": [
"un relais commandé par l'aquastat ou le thermostat",
"une minuterie fixe de 24 heures",
"un interrupteur manuel seulement",
"la pression de l'eau dans le réseau"
],
"bon": 0,
"s": 20
},
{
"q": "Aquastat réglé à 82 °C, différentiel 10 °C. À quelle température le brûleur repart-il?",
"t": "nombre",
"ch": [],
"bon": 72,
"s": 45,
"u": "°C"
},
{
"q": "Le coupe-bas niveau d'eau protège…",
"ch": [
"la chaudière contre le manque d'eau",
"le circulateur contre l'air",
"le brûleur contre le vent",
"le thermostat contre le gel"
],
"bon": 0,
"s": 20
}
]
},
{
"id": "defi-dispositifs-electriques-c9-4",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Dispositifs électriques et électroniques (C9) · Défi+ 4 de 6",
"sujet": "Modules 5 et 6 : brûleurs et dépannage",
"couv": "img/couvertures/dispositifs-electriques-c9.jpg",
"coul": "#E0892B",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Brûleur à l'huile : la cellule ne voit pas de flamme au démarrage. Le protectorelais…",
"ch": [
"allume la cellule",
"se met en sécurité (verrouille) après sa temporisation",
"continue d'envoyer du mazout jusqu'à ce que la flamme apparaisse",
"augmente la pression de mazout pour forcer l'allumage"
],
"bon": 1,
"s": 20
},
{
"q": "Avant de vérifier la cellule CdS :",
"ch": [
"mouiller la cellule",
"laisser le brûleur en marche sans protection",
"rien de spécial",
"couper et cadenasser"
],
"bon": 3,
"s": 20
},
{
"q": "La cellule CdS a une résistance…",
"ch": [
"faible dans le noir, très élevée à la lumière",
"toujours la même, flamme ou pas",
"très élevée dans le noir, faible à la lumière",
"nulle"
],
"bon": 2,
"s": 20
},
{
"q": "Le délai d'arrêt du ventilateur d'une fournaise (micro-interrupteurs DIP) est souvent de…",
"ch": [
"10 min",
"5 s",
"90 s",
"1 h"
],
"bon": 2,
"s": 20
},
{
"q": "Sur le thermostat d'une thermopompe, la borne O/B commande…",
"ch": [
"l'alimentation",
"le compresseur, qui part seulement en climatisation",
"la vanne d'inversion (chauffage ou climatisation)",
"le ventilateur intérieur (marche continue ou automatique)"
],
"bon": 2,
"s": 20
},
{
"q": "Dépannage : par quoi commencer?",
"ch": [
"le thermostat neuf",
"remplacer le moteur, puis vérifier si ça repart",
"l'alimentation (source et protection)",
"changer la carte électronique, la pièce qui brise le plus"
],
"bon": 2,
"s": 20
},
{
"q": "Un relais claque sans arrêt : cause possible…",
"ch": [
"trop de lumière sur la bobine qui dérègle le contact",
"le thermostat est neuf et n'est pas encore calibré",
"le fil est trop long",
"tension trop basse ou instable à la bobine"
],
"bon": 3,
"s": 20
},
{
"q": "Lire un schéma en quatre passes : dans l'ordre.",
"ch": [
"La légende",
"L'alimentation",
"La charge et la commande",
"Les sécurités"
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
"q": "Associe la pièce du brûleur à l'huile à son rôle.",
"t": "paires",
"g": [
"Gicleur",
"Transformateur d'allumage",
"Cellule CdS",
"Contrôle primaire"
],
"ch": [
"Pulvérise le mazout",
"Fait l'étincelle",
"Voit la flamme",
"Gère le démarrage et la sécurité"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "La cellule CdS « voit » la flamme parce que sa résistance…",
"ch": [
"reste toujours la même",
"baisse à la lumière",
"monte à la lumière",
"dépend de la pression"
],
"bon": 1,
"s": 20
},
{
"q": "Le contrôle primaire coupe le brûleur si…",
"ch": [
"la pompe à mazout est neuve",
"le thermostat demande de la chaleur",
"la pièce est trop froide",
"la flamme n'est pas vue après quelques secondes"
],
"bon": 3,
"s": 20
},
{
"q": "On peut réarmer un brûleur à l'huile plusieurs fois de suite sans danger.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Le mazout s'accumule : risque d'explosion."
},
{
"q": "Remets dans l'ordre un dépannage méthodique.",
"ch": [
"Écouter le client",
"Vérifier l'alimentation",
"Suivre le schéma, mesure par mesure",
"Réparer et faire un essai complet"
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
"q": "Une mesure de 0 V aux bornes d'un contact fermé veut dire…",
"ch": [
"il n'y a pas de courant ailleurs",
"le contact est brûlé",
"le multimètre est brisé",
"le contact est bon"
],
"bon": 3,
"s": 20
},
{
"q": "La tension d'allumage d'un transformateur de brûleur à l'huile est environ combien de volts?",
"t": "estim",
"ch": [],
"bon": 10000,
"tol": 25,
"u": "V",
"s": 30,
"expl": "Environ 10 000 V (10 kV)."
}
]
},
{
"id": "defi-dispositifs-electriques-c9-5",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Dispositifs électriques et électroniques (C9) · Défi+ 5 de 6",
"sujet": "Module 7 : appareils au gaz",
"couv": "img/couvertures/dispositifs-electriques-c9.jpg",
"coul": "#E0892B",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Le courant de flamme d'un appareil au gaz se mesure en…",
"ch": [
"kilowatts (kW), comme la puissance du brûleur",
"ohms",
"volts CA (V~), entre la tige et la masse",
"microampères (µA)"
],
"bon": 3,
"s": 20
},
{
"q": "Une tige de flamme oxydée se nettoie…",
"ch": [
"doucement avec un tampon abrasif fin",
"avec un marteau",
"avec de l'eau savonneuse, puis on la laisse sécher",
"avec du papier sablé grossier jusqu'au métal brillant"
],
"bon": 0,
"s": 20
},
{
"q": "Pendant l'essai d'allumage, pas de 120 V au connecteur de l'allumeur HSI :",
"ch": [
"l'allumeur est trop chaud",
"c'est normal",
"la carte ne l'alimente pas",
"le gaz est fermé"
],
"bon": 2,
"s": 20
},
{
"q": "Les sécurités d'un appareil au gaz sont branchées…",
"ch": [
"en série : une seule ouverte coupe la valve",
"en parallèle : il faut qu'elles s'ouvrent toutes pour couper",
"sur le thermostat seulement, qui coupe la valve",
"au hasard"
],
"bon": 0,
"s": 20
},
{
"q": "Un pressuretrol, sur une chaudière à vapeur…",
"ch": [
"purge l'air",
"mesure la température extérieure pour régler la chaudière",
"remplit la chaudière d'eau quand la pression baisse",
"arrête et repart le brûleur selon la pression de vapeur"
],
"bon": 3,
"s": 20
},
{
"q": "Le coupe-circuit de bas niveau d'eau…",
"ch": [
"arrête le brûleur si l'eau manque dans la chaudière",
"remplit automatiquement la chaudière quand l'eau baisse",
"allume la veilleuse quand le niveau d'eau est bon",
"chauffe l'eau"
],
"bon": 0,
"s": 20
},
{
"q": "Un automate (API) lit ses entrées et commande ses sorties selon…",
"ch": [
"le courant de flamme",
"un cycle de scrutation",
"la météo seulement",
"le hasard"
],
"bon": 1,
"s": 20
},
{
"q": "Associe la pièce d'un appareil au gaz.",
"t": "paires",
"g": [
"Thermocouple",
"Allumeur à surface chaude",
"Pressostat",
"Valve de gaz"
],
"ch": [
"Prouve la veilleuse (millivolts)",
"Allume le gaz sans flamme",
"Prouve le tirage du ventilateur",
"Ouvre le gaz sur commande"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "La séquence d'un appareil moderne commence par…",
"ch": [
"l'étincelle",
"l'ouverture du gaz",
"l'arrêt du circulateur",
"la pré-purge du ventilateur"
],
"bon": 3,
"s": 20
},
{
"q": "La détection de flamme par ionisation mesure…",
"ch": [
"un petit courant à travers la flamme",
"la couleur de la flamme",
"la chaleur de la flamme",
"la pression du gaz"
],
"bon": 0,
"s": 20
},
{
"q": "Une odeur de gaz : on actionne l'interrupteur pour mieux voir.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Une étincelle peut allumer le gaz."
},
{
"q": "Le pressostat d'air ne ferme pas. Causes possibles?",
"ch": [
"Tuyau du pressostat bouché",
"Évent obstrué",
"Ventilateur faible",
"Thermostat trop haut"
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
"q": "Un thermocouple en bon état donne environ…",
"ch": [
"24 volts",
"20 à 30 millivolts",
"120 volts",
"1 ampère"
],
"bon": 1,
"s": 20
},
{
"q": "Le courant de flamme par ionisation est de l'ordre de combien de microampères?",
"t": "estim",
"ch": [],
"bon": 3,
"tol": 50,
"u": "µA",
"s": 30,
"expl": "Quelques microampères (souvent 1 à 6 µA)."
},
{
"q": "Après une réparation sur un appareil au gaz, on…",
"ch": [
"augmente la pression du gaz",
"laisse l'appareil fermé une journée",
"vérifie l'étanchéité des raccords",
"débranche le pressostat"
],
"bon": 2,
"s": 20
}
]
},
{
"id": "defi-dispositifs-electriques-c9-6",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Dispositifs électriques et électroniques (C9) · Défi+ 6 de 6",
"sujet": "Modules 8 et 9 : vapeur, automates et GTB",
"couv": "img/couvertures/dispositifs-electriques-c9.jpg",
"coul": "#E0892B",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Lesquels sont des ENTRÉES d'un automate?",
"ch": [
"Thermostat",
"Interrupteur de débit",
"Limite de température",
"Brûleur"
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
"q": "Une temporisation TON de 10 min sert, par exemple, à…",
"ch": [
"couper le courant",
"allumer la lumière du local pendant 10 minutes",
"faire attendre la 2e chaudière avant de partir",
"arrêter la pompe tout de suite quand le thermostat est satisfait"
],
"bon": 2,
"s": 20
},
{
"q": "Sur un diagramme temporel, le circulateur qui continue après l'arrêt du thermostat, c'est…",
"ch": [
"la postcirculation",
"une erreur de dessin",
"un court-circuit",
"une panne"
],
"bon": 0,
"s": 20
},
{
"q": "Avec la GTB, avant de se déplacer, le technicien…",
"ch": [
"change la sonde",
"coupe le courant du bâtiment",
"redémarre tout",
"lit l'alarme et la tendance"
],
"bon": 3,
"s": 20
},
{
"q": "Sur place, la valeur affichée par la GTB se compare…",
"ch": [
"avec un autre bâtiment",
"avec la météo",
"avec une mesure réelle",
"avec rien"
],
"bon": 2,
"s": 20
},
{
"q": "Field wiring veut dire câblage d'usine.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Field wiring = câblage sur place; factory wiring = câblage d'usine."
},
{
"q": "Le Code qui encadre l'électricité au Québec :",
"ch": [
"Code civil du Québec, livre sur les biens",
"Code du logement, partie sur les installations",
"Code de construction, chapitre V – Électricité",
"Code de la route"
],
"bon": 2,
"s": 20
},
{
"q": "Une veilleuse permanente, un allumage intermittent et un allumeur à surface chaude (HSI) sont…",
"ch": [
"trois pompes",
"trois fusibles",
"les trois familles d'allumage au gaz",
"trois types de thermostats"
],
"bon": 2,
"s": 20
},
{
"q": "Associe l'élément de GTB ou d'automate.",
"t": "paires",
"g": [
"Capteur",
"Actionneur",
"Automate (contrôleur)",
"Poste de supervision"
],
"ch": [
"Mesure (température, pression)",
"Agit (valve, volet, moteur)",
"Décide selon le programme",
"Écran pour voir et régler"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Dans une chaudière à vapeur, le niveau d'eau se lit…",
"ch": [
"dans le verre de niveau",
"sur le thermostat",
"sur le manomètre de gaz",
"au toit, sur l'évent"
],
"bon": 0,
"s": 20
},
{
"q": "Une entrée « TOR » d'automate, c'est…",
"ch": [
"une pression variable",
"tout ou rien : ouvert ou fermé",
"un signal de 0 à 10 V",
"une température en degrés"
],
"bon": 1,
"s": 20
},
{
"q": "Sur une GTB, on note tout changement de consigne.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Remets dans l'ordre une alarme reçue sur la GTB.",
"ch": [
"Lire l'alarme au complet",
"Aller voir l'équipement",
"Corriger ou aviser",
"Acquitter et noter"
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
"q": "Un signal 4-20 mA à 4 mA veut souvent dire…",
"ch": [
"le bas de l'échelle (0 %)",
"un fil coupé, toujours",
"le maximum (100 %)",
"la moitié de l'échelle"
],
"bon": 0,
"s": 20
},
{
"q": "Un signal 4-20 mA lit 12 mA. Environ quel % de l'échelle?",
"t": "estim",
"ch": [],
"bon": 50,
"tol": 10,
"u": "%",
"s": 30,
"expl": "(12 − 4) ÷ 16 = 50 %."
}
]
},
{
"id": "defi-entretien-menager-egi-1",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Entretien ménager d'un bâtiment · Défi+ 1 de 6",
"sujet": "Modules 1 à 3 : sécurité, microbes et chimie",
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
"partir chez toi sans rien dire",
"faire le travail plus vite",
"demander une prime",
"exercer ton droit de refus"
],
"bon": 3,
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
"Je la laisse là",
"Avec une pince, pointe vers le bas, dans un contenant rigide",
"Je remets le capuchon"
],
"bon": 2,
"s": 20
},
{
"q": "Pousser ou tirer un chariot lourd?",
"ch": [
"C'est pareil",
"Tirer",
"Le porter",
"Pousser"
],
"bon": 3,
"s": 20,
"expl": "Tu vois devant toi et ton dos est mieux placé."
},
{
"q": "Associe le pictogramme SIMDUT au danger.",
"t": "paires",
"g": [
"Flamme",
"Tête de mort",
"Corrosion",
"Point d'exclamation"
],
"ch": [
"Inflammable",
"Toxicité aiguë",
"Brûle la peau et le métal",
"Irritant ou nocif"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Nettoyer et désinfecter, la différence :",
"ch": [
"c'est la même chose avec deux produits",
"nettoyer enlève la saleté, désinfecter tue les microbes",
"nettoyer se fait seulement à l'eau chaude",
"désinfecter enlève la saleté, nettoyer tue les microbes"
],
"bon": 1,
"s": 20
},
{
"q": "Le temps de contact d'un désinfectant, c'est…",
"ch": [
"le temps où la surface doit rester mouillée",
"le temps pour que le produit sèche à l'air",
"le temps maximal pour l'ouvrir et l'utiliser",
"le temps de pause du préposé après"
],
"bon": 0,
"s": 20
},
{
"q": "Mélanger de l'eau de Javel et de l'ammoniaque est dangereux.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15,
"expl": "Ça dégage un gaz toxique."
},
{
"q": "Où trouves-tu les dangers d'un produit?",
"ch": [
"L'étiquette",
"La fiche de données de sécurité",
"Le pictogramme",
"Le prix sur la facture"
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
"q": "Un pH de 13, c'est un produit…",
"ch": [
"très alcalin, comme un dégraissant fort",
"sans danger pour la peau",
"très acide, comme un détartrant",
"neutre, comme l'eau du robinet"
],
"bon": 0,
"s": 20
},
{
"q": "Lavage des mains : combien de secondes au minimum avec du savon?",
"t": "estim",
"ch": [],
"bon": 20,
"tol": 25,
"u": "s",
"s": 25,
"expl": "Au moins 20 secondes."
},
{
"q": "On travaille du plus propre au plus sale pour…",
"ch": [
"finir plus vite la tournée",
"ne pas étendre les microbes",
"user moins le chiffon",
"économiser le produit"
],
"bon": 1,
"s": 20
}
]
},
{
"id": "defi-entretien-menager-egi-2",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Entretien ménager d'un bâtiment · Défi+ 2 de 6",
"sujet": "Modules 4 à 6 : produits verts, surfaces, machines et quotidien",
"couv": "img/couvertures/entretien-menager-egi.jpg",
"coul": "#2E8B57",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Un chiffon qui passe de la toilette au comptoir, c'est…",
"ch": [
"de la contamination croisée",
"un gain de temps accepté si le chiffon est propre",
"une désinfection en deux étapes",
"une bonne pratique"
],
"bon": 0,
"s": 20
},
{
"q": "Dans le code de couleurs le plus utilisé, le chiffon ROUGE sert…",
"ch": [
"aux toilettes et urinoirs",
"aux vitres",
"à la cuisine et aux comptoirs",
"aux bureaux et aux surfaces de travail"
],
"bon": 0,
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
"le diluer avec de l'eau, même si l'étiquette le permet",
"l'utiliser sur une surface déjà propre, sans la laver avant",
"le ranger fermé",
"essuyer tout de suite sans respecter le temps de contact"
],
"bon": 3,
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
"dégagent un gaz toxique : jamais",
"sentent meilleur",
"sont plus écologiques",
"nettoient deux fois mieux"
],
"bon": 0,
"s": 20
},
{
"q": "Avant de brancher une machine dans un endroit mouillé, ton garde du corps est…",
"ch": [
"la rallonge",
"le cône jaune",
"le fusible",
"le DDFT"
],
"bon": 3,
"s": 20
},
{
"q": "Associe la couleur du chiffon à l'endroit (code courant).",
"t": "paires",
"g": [
"Rouge",
"Jaune",
"Bleu",
"Vert"
],
"ch": [
"Toilettes et urinoirs",
"Lavabos et salle de bain",
"Surfaces générales, bureaux",
"Cuisine et aires de repas"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Un produit « écologique » certifié a…",
"ch": [
"le mot « naturel » sur l'étiquette",
"une odeur de citron très forte",
"un logo de certification reconnu",
"une bouteille verte et un dessin de feuille"
],
"bon": 2,
"s": 20
},
{
"q": "La microfibre nettoie bien parce qu'elle…",
"ch": [
"se lave à l'eau froide seulement",
"contient déjà un désinfectant dans le tissu",
"est plus épaisse qu'un chiffon de coton",
"capte la poussière dans ses fibres très fines"
],
"bon": 3,
"s": 20
},
{
"q": "On peut utiliser le même chiffon pour la toilette et le comptoir.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15
},
{
"q": "Remets dans l'ordre l'entretien quotidien d'une salle de bain.",
"ch": [
"Vider les poubelles",
"Nettoyer lavabo et miroir",
"Nettoyer la toilette",
"Laver le plancher en reculant"
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
"q": "L'autorécureuse, en fin de journée, on…",
"ch": [
"remplit le réservoir sale d'eau propre",
"vide et rince les deux réservoirs",
"laisse l'eau sale pour le lendemain",
"met la batterie à vide pour la protéger"
],
"bon": 1,
"s": 20
},
{
"q": "Une dilution de 1:64, c'est combien de mL de produit pour 4 litres d'eau?",
"t": "estim",
"ch": [],
"bon": 62,
"tol": 15,
"u": "mL",
"s": 35,
"expl": "4000 ÷ 64 = 62,5 mL."
}
]
},
{
"id": "defi-entretien-menager-egi-3",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Entretien ménager d'un bâtiment · Défi+ 3 de 6",
"sujet": "Modules 7 à 11 : planchers, hôtel, aréna, vitres et extérieur",
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
"avec la vadrouille du lavage",
"en plusieurs couches minces et égales",
"en une couche épaisse",
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
"à plat, sans bloquer une porte, endos antidérapant",
"roulé le jour",
"bords pliés vers le dessous pour qu'il soit plus épais",
"posé sur le seuil, pour qu'il dépasse sous la porte"
],
"bon": 0,
"s": 20
},
{
"q": "Pourquoi suivre une séquence fixe pour faire une chambre d'hôtel en 30 minutes?",
"ch": [
"Parce que le client l'exige",
"Pour ne rien oublier et aller vite",
"C'est la loi",
"Pour ranger le chariot"
],
"bon": 1,
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
"disparaît dans le sol en 24 heures, sans effet",
"s'écoule vers le sol et les cours d'eau",
"s'évapore au soleil sans laisser de trace",
"nourrit la pelouse"
],
"bon": 1,
"s": 20
},
{
"q": "Associe le plancher au bon soin.",
"t": "paires",
"g": [
"Vinyle (VCT)",
"Bois verni",
"Céramique",
"Tapis"
],
"ch": [
"Cire et polissage",
"Linge humide, peu d'eau",
"Lavage et brossage des joints",
"Aspirateur et extraction"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Un tapis d'entrée bien entretenu retient…",
"ch": [
"seulement l'eau de la neige l'hiver",
"une grande partie de la saleté qui entre",
"rien : il sert à décorer",
"les microbes des souliers"
],
"bon": 1,
"s": 20
},
{
"q": "Dans une chambre d'hôtel, on commence par…",
"ch": [
"passer l'aspirateur sous le lit",
"laver le plancher de la salle de bain",
"aérer, enlever la literie et les déchets",
"remplir le minibar et les savons"
],
"bon": 2,
"s": 20
},
{
"q": "On lave les vitres en plein soleil pour qu'elles sèchent vite.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Elles sèchent trop vite et laissent des traces."
},
{
"q": "Avant de laver le plancher d'un corridor, il faut…",
"ch": [
"Poser les affiches « plancher mouillé »",
"Balayer ou passer la vadrouille sèche",
"Prévoir un passage",
"Ouvrir toutes les portes"
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
"q": "Le raclette à vitre se passe…",
"ch": [
"en « S » ou de haut en bas, en essuyant la lame",
"en cercles, sans essuyer la lame",
"de bas en haut, d'un seul coup",
"seulement à l'horizontale"
],
"bon": 0,
"s": 20
},
{
"q": "L'eau d'une surfaceuse de glace est chauffée à environ combien de °C?",
"t": "estim",
"ch": [],
"bon": 60,
"tol": 25,
"u": "°C",
"s": 30,
"expl": "Souvent entre 50 et 70 °C : l'eau chaude fait une glace plus lisse."
},
{
"q": "Le sel de déglaçage abîme surtout…",
"ch": [
"le gazon de l'été suivant seulement",
"le béton et les tapis de l'entrée",
"rien s'il est bien étendu",
"les vitres de la porte"
],
"bon": 1,
"s": 20
}
]
},
{
"id": "defi-entretien-menager-egi-4",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Entretien ménager d'un bâtiment · Défi+ 4 de 6",
"sujet": "Modules 12 à 17 : piscine, urgences, sanitaires et eau chaude",
"couv": "img/couvertures/entretien-menager-egi.jpg",
"coul": "#2E8B57",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Pourquoi tondre le gazon haut?",
"ch": [
"Pour que les mauvaises herbes paraissent moins",
"Parce que la lame s'use",
"Pour économiser l'essence et le temps de tonte",
"Il fait plus de feuilles, donc plus de nourriture et de racines"
],
"bon": 3,
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
"on l'emballe sur place avant de le déplacer",
"on le laisse tel quel",
"on le sort dans le corridor pour l'aérer",
"on le lave à l'eau froide"
],
"bon": 0,
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
"la cuvette fissurée",
"le siège mal vissé",
"le drain bouché",
"le clapet qui fuit"
],
"bon": 3,
"s": 20,
"expl": "Test du colorant."
},
{
"q": "À quoi sert la soupape de sûreté (T et P) d'un chauffe-eau?",
"ch": [
"À ajouter de l'eau",
"À empêcher une explosion si la pression ou la température monte trop",
"À régler la température de l'eau envoyée aux logements",
"À vider le réservoir quand on fait l'entretien annuel"
],
"bon": 1,
"s": 20
},
{
"q": "Pourquoi vidanger un chauffe-eau?",
"ch": [
"Pour changer l'eau qui a pris une couleur rouille",
"Pour sortir les sédiments (calcaire, sable)",
"Pour vérifier le thermostat et l'élément du bas",
"Ce n'est jamais nécessaire"
],
"bon": 1,
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
},
{
"q": "Associe la mesure d'eau de piscine à son rôle.",
"t": "paires",
"g": [
"Chlore libre",
"pH",
"Alcalinité",
"Clarté"
],
"ch": [
"Désinfecte l'eau",
"Confort et efficacité du chlore",
"Stabilise le pH",
"Voir le fond (sécurité)"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Le pH idéal d'une piscine est environ…",
"ch": [
"8,5 à 9,0",
"5,0 à 5,5",
"7,2 à 7,8",
"6,0 à 6,4"
],
"bon": 2,
"s": 20
},
{
"q": "Une toilette qui déborde : premier geste…",
"ch": [
"appeler la ville tout de suite",
"fermer le robinet d'arrêt derrière",
"verser un produit débouchant",
"tirer la chasse encore une fois"
],
"bon": 1,
"s": 20
},
{
"q": "Un chauffe-eau réglé trop bas (sous 60 °C) favorise la légionellose.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Remets dans l'ordre : déversement de vomi dans un corridor.",
"ch": [
"Isoler la zone",
"Mettre gants et protections",
"Absorber et ramasser",
"Nettoyer puis désinfecter"
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
"q": "La soupape de sûreté du chauffe-eau (T et P) protège contre…",
"ch": [
"le manque d'eau dans le réservoir",
"une pression ou une chaleur trop fortes",
"l'eau trop froide le matin",
"la rouille au fond du réservoir"
],
"bon": 1,
"s": 20
},
{
"q": "L'eau chaude au robinet ne devrait pas dépasser environ combien de °C (brûlures)?",
"t": "estim",
"ch": [],
"bon": 49,
"tol": 10,
"u": "°C",
"s": 30,
"expl": "Au robinet, environ 49 °C pour éviter les brûlures."
}
]
},
{
"id": "defi-entretien-menager-egi-5",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Entretien ménager d'un bâtiment · Défi+ 5 de 6",
"sujet": "Modules 17 à 22 : registres, pompes, ventilation et toits",
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
"À rien",
"À décorer la salle mécanique",
"À prouver que l'entretien a été fait",
"À calculer le loyer"
],
"bon": 2,
"s": 20
},
{
"q": "Le drain français autour des fondations…",
"ch": [
"évacue les eaux des toilettes vers l'égout municipal",
"amène l'eau potable de la rue jusqu'au sous-sol",
"chauffe le sous-sol",
"ramasse l'eau du sol pour qu'elle ne pousse pas sur les murs"
],
"bon": 3,
"s": 20
},
{
"q": "La pompe de puisard ne part pas et l'eau monte :",
"ch": [
"j'ouvre le robinet",
"c'est normal : la pompe attend que la fosse soit pleine",
"urgence : flotte coincée, disjoncteur ou pompe brûlée",
"j'attends le lendemain et je remplis une demande"
],
"bon": 2,
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
"économisent l'énergie",
"risque d'incendie de graisse",
"durent plus longtemps",
"font moins de bruit"
],
"bon": 1,
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
"du vent qui pousse la neige contre le bord du toit",
"du sel",
"des gouttières neuves qui gardent l'eau trop longtemps",
"de la chaleur du bâtiment qui fait fondre la neige par en dessous"
],
"bon": 3,
"s": 20
},
{
"q": "Associe l'appareil à ce qu'on vérifie.",
"t": "paires",
"g": [
"Pompe de puisard",
"Échangeur d'air",
"Drain de toit",
"Extincteur"
],
"ch": [
"Le flotteur et la sortie",
"Les filtres",
"Les débris et la crépine",
"L'aiguille dans le vert"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Un registre d'entretien sert surtout à…",
"ch": [
"remplacer le bon de travail",
"prouver ce qui a été fait, et quand",
"noter les absences du personnel",
"décorer le local mécanique"
],
"bon": 1,
"s": 20
},
{
"q": "Une pompe de puisard qui tourne sans arrêt : on vérifie d'abord…",
"ch": [
"le flotteur, qui peut être coincé",
"le disjoncteur de la cuisine",
"le thermostat du sous-sol",
"la couleur de l'eau du puisard"
],
"bon": 0,
"s": 20
},
{
"q": "Un filtre de ventilation bouché fait travailler le moteur plus fort.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Sur un toit plat, au printemps, on vérifie…",
"ch": [
"Les drains",
"Les solins",
"L'accumulation d'eau",
"La couleur des voitures"
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
"q": "Pour monter sur un toit, il faut d'abord…",
"ch": [
"attendre la pluie",
"une protection contre les chutes",
"un balai et une pelle",
"l'accord d'un locataire"
],
"bon": 1,
"s": 20
},
{
"q": "Un filtre de fournaise de 1 po se change environ aux combien de mois?",
"t": "estim",
"ch": [],
"bon": 3,
"tol": 34,
"u": "mois",
"s": 25,
"expl": "Environ aux 3 mois (1 à 3 selon l'usage)."
},
{
"q": "Une odeur d'égout au sous-sol vient souvent…",
"ch": [
"d'un siphon de drain de plancher asséché",
"d'un filtre de fournaise sale",
"d'une fenêtre restée ouverte",
"du chauffe-eau qui est trop chaud"
],
"bon": 0,
"s": 20
}
]
},
{
"id": "defi-entretien-menager-egi-6",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Entretien ménager d'un bâtiment · Défi+ 6 de 6",
"sujet": "Modules 23 à 28 : écoles, déversements, portes, électricité et matières",
"couv": "img/couvertures/entretien-menager-egi.jpg",
"coul": "#2E8B57",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Dans la cuisine d'une école, qui inspecte l'hygiène?",
"ch": [
"La SAAQ",
"La RBQ",
"Le MAPAQ",
"Le TAL"
],
"bon": 2,
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
"Pour l'assurance seulement, qui l'exige dans les 24 h",
"Pour que la peinture du graffiti n'ait pas le temps de sécher",
"Ce n'est pas important"
],
"bon": 0,
"s": 20
},
{
"q": "Un réfrigérateur…",
"ch": [
"déplace la chaleur",
"refroidit avec de la glace",
"fabrique du froid",
"fonctionne sans moteur"
],
"bon": 0,
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
"je jette les morceaux à la poubelle ordinaire",
"je balaie tout de suite",
"je fais sortir les gens et j'aère avant de ramasser"
],
"bon": 3,
"s": 20,
"expl": "Il contient du mercure : pas d'aspirateur ni de balai."
},
{
"q": "Associe la matière au bon bac.",
"t": "paires",
"g": [
"Canette d'aluminium",
"Pelure de pomme",
"Pile usagée",
"Pot de peinture"
],
"ch": [
"Recyclage",
"Compost",
"Point de dépôt (dangereux)",
"Écocentre"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Un déversement d'huile sur le plancher : on utilise…",
"ch": [
"du sable de la cour",
"un séchoir pour l'évaporer",
"de l'eau chaude et une vadrouille",
"un absorbant de la trousse de déversement"
],
"bon": 3,
"s": 20
},
{
"q": "Une prise électrique chaude au toucher, c'est…",
"ch": [
"un problème seulement l'hiver",
"normal quand un appareil fonctionne",
"réglé en la couvrant de ruban",
"un signe de danger : on avise"
],
"bon": 3,
"s": 20
},
{
"q": "Le préposé peut changer lui-même un disjoncteur dans le panneau.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "C'est un travail d'électricien."
},
{
"q": "Remets dans l'ordre la fermeture d'une école le soir.",
"ch": [
"Faire la tournée des locaux",
"Fermer les fenêtres",
"Éteindre les lumières",
"Armer le système d'alarme"
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
"q": "Une porte qui ne se verrouille plus le soir : tu…",
"ch": [
"la bloques avec une chaise",
"attends que quelqu'un se plaigne",
"sécurises et avises tout de suite",
"la laisses et notes pour la semaine"
],
"bon": 2,
"s": 20
},
{
"q": "Un néon T8 de 4 pieds consomme environ combien de watts?",
"t": "estim",
"ch": [],
"bon": 32,
"tol": 20,
"u": "W",
"s": 25,
"expl": "Environ 32 W (et 15 à 18 W en DEL)."
}
]
},
{
"id": "defi-protection-incendie-1",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Protection incendie d'un bâtiment · Défi+ 1 de 6",
"sujet": "Modules 1 et 2 : la combustion et les classes de feu",
"couv": "img/couvertures/protection-incendie.jpg",
"coul": "#C62828",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Les éléments du tétraèdre du feu :",
"ch": [
"Combustible",
"Oxygène (comburant)",
"Chaleur",
"Réaction en chaîne"
],
"bon": [
0,
1,
2,
3
],
"s": 35,
"t": "multi"
},
{
"q": "Pour arrêter une combustion, il suffit de…",
"ch": [
"attendre",
"retirer un seul élément du tétraèdre",
"ajouter de l'oxygène pour que le feu brûle plus vite",
"retirer les quatre éléments en même temps"
],
"bon": 1,
"s": 20
},
{
"q": "Pourquoi une grosse poutre de bois massif résiste longtemps au feu?",
"ch": [
"Le bois massif ne brûle pas, seulement sa peinture",
"La couche carbonisée isole le bois intact",
"Elle est peinte",
"Elle est traitée et garde toujours son humidité"
],
"bon": 1,
"s": 20
},
{
"q": "Un gaz combustible plus lourd que l'air qui fuit…",
"ch": [
"reste sur place, près de l'appareil qui fuit",
"disparaît",
"coule vers le bas : on cherche au sol",
"monte au plafond : on cherche près des luminaires"
],
"bon": 2,
"s": 20
},
{
"q": "La seule phase du feu où le préposé peut intervenir avec un extincteur :",
"ch": [
"le développement complet",
"l'éclosion",
"l'embrasement généralisé",
"le déclin"
],
"bon": 1,
"s": 20
},
{
"q": "Le monoxyde de carbone (CO) dans la fumée…",
"ch": [
"sent fort et fait tousser, ce qui nous avertit",
"est inodore et prend la place de l'oxygène dans le sang",
"est visible : c'est la fumée noire qui sort du feu",
"est visible"
],
"bon": 1,
"s": 20
},
{
"q": "Un feu qui manque d'air est un feu éteint.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Risque d'explosion de fumée (backdraft) si on ouvre."
},
{
"q": "Un feu de friteuse de restaurant est un feu de classe…",
"ch": [
"C",
"A",
"B",
"K"
],
"bon": 3,
"s": 20
},
{
"q": "Un feu d'équipement électrique sous tension est de classe…",
"ch": [
"A",
"C",
"B",
"D"
],
"bon": 1,
"s": 20
},
{
"q": "Un feu de bois, papier, tissu est de classe…",
"ch": [
"A",
"K",
"C",
"B"
],
"bon": 0,
"s": 20
},
{
"q": "Associe la classe de feu au combustible.",
"t": "paires",
"g": [
"A",
"B",
"C",
"K"
],
"ch": [
"Bois, papier, tissu",
"Liquides inflammables",
"Appareils électriques sous tension",
"Huiles de cuisson"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Remets dans l'ordre l'évolution d'un incendie.",
"ch": [
"Éclosion",
"Croissance",
"Embrasement généralisé",
"Déclin"
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
"q": "Le monoxyde de carbone est invisible et sans odeur.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Le triangle du feu : chaleur, combustible et…",
"ch": [
"eau",
"oxygène",
"fumée",
"azote"
],
"bon": 1,
"s": 20
},
{
"q": "L'air contient environ combien de % d'oxygène?",
"t": "estim",
"ch": [],
"bon": 21,
"tol": 10,
"u": "%",
"s": 25,
"expl": "Environ 21 %."
}
]
},
{
"id": "defi-protection-incendie-2",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Protection incendie d'un bâtiment · Défi+ 2 de 6",
"sujet": "Modules 2 et 3 : les extincteurs",
"couv": "img/couvertures/protection-incendie.jpg",
"coul": "#C62828",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Un extincteur « 2-A:10-B:C » contient le plus souvent…",
"ch": [
"du CO₂ seulement",
"de l'eau",
"de la poudre ABC",
"du sable"
],
"bon": 2,
"s": 20
},
{
"q": "Une cigarette dans un divan peut couver pendant…",
"ch": [
"jamais",
"une seconde",
"une minute au plus",
"des heures"
],
"bon": 3,
"s": 20
},
{
"q": "L'embrasement généralisé survient vers combien de °C sous le plafond (bas de la plage)?",
"t": "nombre",
"ch": [],
"bon": 500,
"s": 45,
"u": "°C"
},
{
"q": "Le CO se fixe sur l'hémoglobine environ combien de fois plus facilement que l'oxygène?",
"ch": [
"2 fois",
"20 fois",
"2 000 fois",
"200 fois"
],
"bon": 3,
"s": 20
},
{
"q": "Un extincteur « à pression permanente » contient…",
"ch": [
"de l'air comprimé seulement, sans agent extincteur",
"de l'eau chaude sous pression qui ne gèle pas",
"un moteur",
"l'agent et un gaz propulseur (azote)"
],
"bon": 3,
"s": 20
},
{
"q": "La méthode PASS : dans l'ordre.",
"ch": [
"Tirer la goupille",
"Viser la base du feu",
"Serrer la poignée",
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
"q": "Extincteur de 18 kg ou moins : le haut à au plus combien de mètres du plancher?",
"t": "nombre",
"ch": [],
"bon": 1.53,
"s": 45,
"u": "m"
},
{
"q": "L'étiquette perforée au col d'un extincteur indique…",
"ch": [
"le prix",
"le mois et l'année du dernier entretien annuel",
"la date d'achat et le magasin où il a été acheté",
"le nom du fabricant et le numéro du modèle"
],
"bon": 1,
"s": 20
},
{
"q": "À l'inspection mensuelle d'un extincteur :",
"ch": [
"À sa place et visible",
"Aiguille dans le vert",
"Goupille et scellé en place",
"Peint d'une couleur nouvelle"
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
"q": "Le détecteur de fumée à ionisation réagit surtout…",
"ch": [
"aux feux qui couvent, avec beaucoup de grosse fumée",
"au CO",
"à la chaleur seulement, quand la pièce dépasse 57 °C",
"aux feux vifs à petites particules"
],
"bon": 3,
"s": 20
},
{
"q": "Associe l'agent à l'extincteur.",
"t": "paires",
"g": [
"Poudre ABC",
"CO₂",
"Eau sous pression",
"Acétate de potassium"
],
"ch": [
"Feux A, B et C",
"Feux B et C, sans résidu",
"Feux A seulement",
"Feux de friteuse (K)"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "L'inspection mensuelle d'un extincteur vérifie…",
"ch": [
"l'aiguille, la goupille et l'accès",
"le poids exact de la poudre",
"l'intérieur de la bonbonne",
"la date d'achat seulement"
],
"bon": 0,
"s": 20
},
{
"q": "Qu'est-ce qui rend un extincteur hors d'usage?",
"ch": [
"Aiguille dans le rouge",
"Goupille absente",
"Boyau fissuré",
"Étiquette un peu décolorée"
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
"q": "On peut utiliser un extincteur à eau sur un feu électrique.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Risque d'électrocution."
},
{
"q": "Un extincteur portatif de 5 lb se vide en environ combien de secondes?",
"t": "estim",
"ch": [],
"bon": 13,
"tol": 40,
"u": "s",
"s": 30,
"expl": "Environ 8 à 15 secondes : il faut viser juste."
}
]
},
{
"id": "defi-protection-incendie-3",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Protection incendie d'un bâtiment · Défi+ 3 de 6",
"sujet": "Modules 3 à 5 : utiliser un extincteur, détection, réseau avertisseur",
"couv": "img/couvertures/protection-incendie.jpg",
"coul": "#C62828",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Le déclencheur manuel se place…",
"ch": [
"dans chaque logement, près de la porte d'entrée",
"près des portes d'issue et des escaliers",
"sur le toit",
"au sous-sol seulement, près du panneau d'alarme"
],
"bon": 1,
"s": 20
},
{
"q": "Un détecteur de fumée se place…",
"ch": [
"dans la douche",
"loin des bouches de ventilation",
"derrière une porte",
"devant une bouche de ventilation"
],
"bon": 1,
"s": 20
},
{
"q": "En alarme, le panneau peut…",
"ch": [
"libérer les portes coupe-feu retenues",
"arrêter les ventilateurs",
"appeler la centrale",
"ouvrir les fenêtres"
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
"q": "La différence d'un panneau adressable :",
"ch": [
"il sait quel appareil précis est en alarme",
"il n'a pas de zones",
"il n'a pas besoin de batterie, même en panne de courant",
"il sonne plus fort et plus longtemps dans tout l'immeuble"
],
"bon": 0,
"s": 20
},
{
"q": "Le bouton « Accuser réception » du panneau…",
"ch": [
"réarme le système",
"arrête seulement le bip du panneau",
"arrête l'alarme dans tout l'immeuble",
"appelle les pompiers"
],
"bon": 1,
"s": 20
},
{
"q": "Une alarme sonne : la séquence du préposé, dans l'ordre.",
"ch": [
"Lire le panneau : quel appareil, quel étage",
"Accuser réception",
"Aller vérifier en sécurité",
"Réarmer seulement quand la cause est connue"
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
"q": "Avant d'utiliser un extincteur, tu t'assures d'avoir…",
"ch": [
"personne autour pour t'aider",
"une sortie dans ton dos",
"les fenêtres fermées",
"le dos au mur"
],
"bon": 1,
"s": 20
},
{
"q": "Le détecteur photoélectrique réagit surtout…",
"ch": [
"à la chaleur",
"au monoxyde de carbone (CO) qui s'accumule",
"aux feux vifs seulement, avec de petites particules",
"aux feux qui couvent (grosses particules de fumée)"
],
"bon": 3,
"s": 20
},
{
"q": "Le bouton « Silence signal » du panneau…",
"ch": [
"teste les batteries",
"appelle automatiquement les pompiers de la ville",
"réarme tout le système et remet les zones en service",
"arrête les avertisseurs, sans réarmer"
],
"bon": 3,
"s": 20
},
{
"q": "Un réseau avertisseur se lit comme une chaîne :",
"ch": [
"sorties → panneau → entrées, dans le sens du courant",
"entrées → panneau → sorties",
"aucun ordre",
"le panneau seulement : il décide de tout sans entrées"
],
"bon": 1,
"s": 20
},
{
"q": "Remets dans l'ordre la méthode pour utiliser un extincteur.",
"ch": [
"Tirer la goupille",
"Viser la base du feu",
"Presser la poignée",
"Balayer de gauche à droite"
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
"q": "Associe l'appareil au réseau avertisseur.",
"t": "paires",
"g": [
"Déclencheur manuel",
"Détecteur de fumée",
"Détecteur thermique",
"Avertisseur sonore"
],
"ch": [
"On le tire à la main",
"Réagit aux particules de fumée",
"Réagit à la chaleur",
"Fait évacuer les occupants"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Le détecteur thermique se place plutôt…",
"ch": [
"dans un corridor de logements",
"dans une cuisine ou un garage",
"dans une chambre à coucher",
"à côté d'une sortie"
],
"bon": 1,
"s": 20
},
{
"q": "Le panneau d'alarme affiche la zone qui a déclenché.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Après une alarme, avant de réarmer, on…",
"ch": [
"Trouve la cause",
"Attend l'accord des pompiers",
"Note l'événement",
"Coupe l'électricité de l'immeuble"
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
"id": "defi-protection-incendie-4",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Protection incendie d'un bâtiment · Défi+ 4 de 6",
"sujet": "Modules 6 et 7 : hors service et alimentation de secours",
"couv": "img/couvertures/protection-incendie.jpg",
"coul": "#C62828",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Pendant une mise hors service des gicleurs, il faut…",
"ch": [
"couper l'électricité",
"rien de spécial si le panneau d'alarme fonctionne",
"une personne de garde qui fait des rondes",
"fermer l'immeuble jusqu'à ce que les gicleurs reviennent"
],
"bon": 2,
"s": 20
},
{
"q": "Avant des travaux de soudure dans l'immeuble :",
"ch": [
"une simple autorisation verbale",
"couper l'eau",
"rien",
"un permis de travail à chaud signé"
],
"bon": 3,
"s": 20
},
{
"q": "Plusieurs municipalités facturent les fausses alarmes au propriétaire.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Les batteries du panneau d'alarme : on vérifie…",
"ch": [
"la date, le gonflement, la corrosion et le trouble « LOW BATT »",
"leur prix",
"rien : elles se rechargent toutes seules pour toujours",
"seulement leur couleur et l'autocollant du fabricant"
],
"bon": 0,
"s": 20
},
{
"q": "L'éclairage de secours se teste…",
"ch": [
"aux 10 ans, lors de l'inspection complète du bâtiment",
"seulement à l'achat",
"jamais : il s'allume seul en cas de panne",
"chaque mois avec le bouton d'essai"
],
"bon": 3,
"s": 20
},
{
"q": "Le sélecteur de la génératrice doit être en position…",
"ch": [
"ARRÊT",
"MANUEL",
"AUTO",
"TEST"
],
"bon": 2,
"s": 20
},
{
"q": "Le panneau consomme peu en veille et beaucoup…",
"ch": [
"la nuit",
"l'été",
"en alarme",
"jamais"
],
"bon": 2,
"s": 20
},
{
"q": "L'étiquette « hors service » indique…",
"ch": [
"le prix de la réparation et le nom de l'entrepreneur",
"le système, la vanne, la zone, depuis quand et la raison",
"rien",
"le nom du locataire qui a signalé le problème"
],
"bon": 1,
"s": 20
},
{
"q": "Ampoule de gicleur rouge : température nominale…",
"ch": [
"93 °C",
"141 °C",
"57 °C",
"68 °C"
],
"bon": 3,
"s": 20
},
{
"q": "Le type de réseau de gicleurs dépend surtout de…",
"ch": [
"le nombre de logements",
"la tuyauterie peut-elle geler?",
"la couleur des murs",
"la marque"
],
"bon": 1,
"s": 20
},
{
"q": "Associe l'équipement de secours.",
"t": "paires",
"g": [
"Éclairage de secours",
"Enseigne de sortie",
"Génératrice",
"Batteries du panneau"
],
"ch": [
"Éclaire les sorties en panne",
"Montre le chemin vers la sortie",
"Alimente les systèmes essentiels",
"Gardent l'alarme en marche"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Quand un système de protection est hors service, on…",
"ch": [
"avise, surveille et note jusqu'au retour",
"attend le prochain entretien",
"n'en parle pas aux occupants",
"ferme l'immeuble à clé"
],
"bon": 0,
"s": 20
},
{
"q": "Remets dans l'ordre la mise hors service des gicleurs.",
"ch": [
"Aviser le service incendie et l'assureur",
"Afficher l'avis",
"Fermer la vanne et noter",
"Faire des rondes de surveillance"
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
"q": "L'éclairage de secours se teste en coupant l'alimentation normale.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "L'éclairage de secours doit durer au moins combien de minutes (bâtiment courant)?",
"t": "estim",
"ch": [],
"bon": 30,
"tol": 20,
"u": "min",
"s": 30,
"expl": "Au moins 30 minutes dans la plupart des bâtiments."
}
]
},
{
"id": "defi-protection-incendie-5",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Protection incendie d'un bâtiment · Défi+ 5 de 6",
"sujet": "Modules 8 et 9 : gicleurs et codes",
"couv": "img/couvertures/protection-incendie.jpg",
"coul": "#C62828",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Un stationnement non chauffé est souvent protégé par un réseau…",
"ch": [
"sous air (sec)",
"sans eau",
"à mousse, comme dans un garage de camions",
"sous eau, avec des têtes chauffées l'hiver"
],
"bon": 0,
"s": 20
},
{
"q": "Le réarmement du panneau se fait…",
"ch": [
"par un locataire",
"une fois la cause connue",
"jamais",
"dès que l'alarme sonne"
],
"bon": 1,
"s": 20
},
{
"q": "Quand le courant manque, la génératrice…",
"ch": [
"sonne l'alarme incendie pour faire évacuer",
"s'arrête pour ne pas surcharger le réseau d'Hydro",
"démarre et le commutateur de transfert bascule la charge",
"sonne l'alarme"
],
"bon": 2,
"s": 20
},
{
"q": "Un gicleur s'ouvre…",
"ch": [
"tous en même temps dans l'immeuble",
"avec un bouton",
"à la fumée seulement",
"seul, quand son ampoule éclate à la chaleur"
],
"bon": 3,
"s": 20
},
{
"q": "Les deux grands codes de la sécurité incendie au Québec :",
"ch": [
"le Code de la route et le Code du travail",
"le Code de construction et le Code de sécurité",
"aucun",
"le Code civil et le Code criminel"
],
"bon": 1,
"s": 20
},
{
"q": "Le poste de contrôle des gicleurs se trouve souvent…",
"ch": [
"au rez-de-chaussée ou au sous-sol",
"sur le toit, près de la réserve d'eau",
"dans un logement, au dernier étage",
"dehors"
],
"bon": 0,
"s": 20
},
{
"q": "Le raccord pompier sert à…",
"ch": [
"permettre aux pompiers de vider le réseau après un feu",
"remplir la piscine de l'immeuble au printemps",
"permettre aux pompiers d'alimenter le réseau",
"laver les camions"
],
"bon": 2,
"s": 20
},
{
"q": "La colonne montante a un robinet d'incendie…",
"ch": [
"dans chaque logement, près de la porte d'entrée",
"au sous-sol seulement",
"à chaque étage, dans l'escalier d'issue",
"seulement au toit, pour arroser les immeubles voisins"
],
"bon": 2,
"s": 20
},
{
"q": "Une hotte de restaurant est protégée par un système fixe qui…",
"ch": [
"arrose d'eau toute la cuisine, y compris les friteuses",
"sonne seulement",
"coupe le gaz ou l'électricité et projette un agent",
"ventile plus fort pour sortir la fumée de la cuisine"
],
"bon": 2,
"s": 20
},
{
"q": "On peut peindre l'étiquette d'homologation d'une porte coupe-feu.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15
},
{
"q": "Associe le type de réseau de gicleurs.",
"t": "paires",
"g": [
"Sous eau",
"Sous air",
"Préaction",
"Déluge"
],
"ch": [
"Tuyaux pleins d'eau, local chauffé",
"Pour les zones qui gèlent",
"Détection avant de remplir les tuyaux",
"Toutes les têtes ouvertes"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Une tête de gicleur s'ouvre…",
"ch": [
"toutes en même temps dans l'immeuble",
"quand on tire le déclencheur manuel",
"seule, quand elle est chauffée",
"quand le détecteur de fumée sonne"
],
"bon": 2,
"s": 20
},
{
"q": "Les codes de sécurité incendie au Québec viennent surtout…",
"ch": [
"du règlement de l'immeuble",
"du Code de construction et du Code de sécurité",
"des recommandations de l'assureur",
"du Code civil seulement"
],
"bon": 1,
"s": 20
},
{
"q": "On peut suspendre un objet à un tuyau de gicleur.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15
},
{
"q": "Une ampoule de gicleur rouge éclate vers combien de °C?",
"t": "estim",
"ch": [],
"bon": 68,
"tol": 10,
"u": "°C",
"s": 30,
"expl": "L'ampoule rouge : environ 68 °C."
}
]
},
{
"id": "defi-protection-incendie-6",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Protection incendie d'un bâtiment · Défi+ 6 de 6",
"sujet": "Modules 9 et 10 : coupe-feu, plan de sécurité, évacuation",
"couv": "img/couvertures/protection-incendie.jpg",
"coul": "#C62828",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Une porte coupe-feu doit…",
"ch": [
"être verrouillée à clé",
"être enlevée l'été",
"se refermer et s'enclencher seule",
"rester ouverte avec une cale"
],
"bon": 2,
"s": 20
},
{
"q": "Le responsable légal de l'entretien et des registres incendie :",
"ch": [
"le locataire",
"le pompier",
"le propriétaire",
"le voisin"
],
"bon": 2,
"s": 20
},
{
"q": "Un bon registre contient :",
"ch": [
"La date et l'heure",
"L'équipement",
"Le résultat",
"L'humeur du préposé"
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
"q": "Le PSI (plan de sécurité incendie), c'est…",
"ch": [
"un plan de stationnement",
"un plan de rénovation pour mettre l'immeuble aux normes",
"un plan exigé par le Code de sécurité dans plusieurs bâtiments",
"une police d'assurance contre l'incendie exigée par la banque"
],
"bon": 2,
"s": 20
},
{
"q": "Une personne en fauteuil roulant, en évacuation :",
"ch": [
"le PSI prévoit un lieu sûr et de l'aide désignée",
"on la laisse",
"elle prend l'ascenseur seule en tout temps",
"on attend la fin"
],
"bon": 0,
"s": 20
},
{
"q": "L'exercice d'évacuation vérifie…",
"ch": [
"la vitesse des occupants seulement",
"que le plan fonctionne dans la vraie vie",
"le chauffage",
"la couleur des enseignes"
],
"bon": 1,
"s": 20
},
{
"q": "Le rôle du personnel en évacuation résidentielle :",
"ch": [
"fermer les fenêtres",
"éteindre le feu avant que les pompiers arrivent",
"guider et aider, la plupart des occupants évacuent seuls",
"porter chaque occupant jusqu'à la sortie, un à la fois"
],
"bon": 2,
"s": 20
},
{
"q": "Une porte coupe-feu tenue ouverte par une cale :",
"ch": [
"priorité : on enlève la cale",
"on la verrouille ouverte pour la journée",
"c'est normal",
"c'est permis l'été, pour aérer les corridors"
],
"bon": 0,
"s": 20
},
{
"q": "Où se rassemblent les occupants après l'évacuation?",
"ch": [
"au sous-sol",
"dans leur auto au garage",
"au point de rassemblement prévu",
"dans le hall"
],
"bon": 2,
"s": 20
},
{
"q": "Le rapport d'exercice d'évacuation note…",
"ch": [
"le menu",
"la météo, le nom du préposé et l'heure du dîner",
"date, durée, personnes évacuées et ce qui a fonctionné ou non",
"seulement la date, pour l'afficher dans le hall"
],
"bon": 2,
"s": 20
},
{
"q": "Associe l'élément au rôle dans l'évacuation.",
"t": "paires",
"g": [
"Porte coupe-feu",
"Escalier d'issue",
"Point de rassemblement",
"Responsable d'étage"
],
"ch": [
"Ralentit le feu et la fumée",
"Chemin protégé vers l'extérieur",
"Lieu pour compter les gens",
"Vérifie que l'étage est vide"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Une ouverture dans un mur coupe-feu doit être…",
"ch": [
"bouchée avec de la laine",
"laissée ouverte pour l'air",
"scellée avec un produit coupe-feu homologué",
"fermée avec du gypse ordinaire"
],
"bon": 2,
"s": 20
},
{
"q": "Remets dans l'ordre l'évacuation d'un étage.",
"ch": [
"Donner l'alerte",
"Faire sortir par l'issue la plus proche",
"Fermer les portes derrière soi",
"Se rendre au point de rassemblement"
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
"q": "On utilise l'ascenseur pour évacuer pendant un incendie.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15
},
{
"q": "Un plan de sécurité incendie contient…",
"ch": [
"Les rôles du personnel",
"Les plans des étages",
"Les personnes qui ont besoin d'aide",
"Les loyers des logements"
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
"id": "defi-ventilation-climatisation-m11-1",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Ventilation et climatisation · Défi+ 1 de 6",
"sujet": "Modules 1 et 2 : sécurité, l'air et le confort",
"couv": "img/couvertures/ventilation-climatisation-m11.jpg",
"coul": "#14A3A3",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Un problème de réfrigérant ou de compresseur se signale…",
"ch": [
"au préposé, qui recharge lui-même le réfrigérant",
"au plombier, parce qu'il y a des tuyaux de cuivre",
"au mécanicien en réfrigération (frigoriste)",
"au peintre"
],
"bon": 2,
"s": 20
},
{
"q": "Pourquoi l'entretien préventif est payant?",
"ch": [
"Il ne sert à rien",
"Il coûte plus cher, mais l'assurance le rembourse",
"Moins de pannes imprévues et de réparations d'urgence",
"Il remplace le frigoriste pour les petites réparations"
],
"bon": 2,
"s": 20
},
{
"q": "Une roue de ventilateur qui tourne encore après l'arrêt, c'est…",
"ch": [
"un bris de moteur qui doit être signalé tout de suite",
"normal : on l'arrête avec la main protégée d'un gant",
"de l'énergie résiduelle à contrôler",
"un gain d'énergie"
],
"bon": 2,
"s": 20
},
{
"q": "Ton collègue t'aide à changer la courroie. Doit-il poser son propre cadenas?",
"ch": [
"Jamais",
"Seulement s'il est apprenti",
"Non, le tien suffit",
"Oui, chaque personne pose son cadenas"
],
"bon": 3,
"s": 20
},
{
"q": "On ventile d'abord…",
"ch": [
"pour les personnes (qualité de l'air)",
"pour la décoration",
"pour chauffer, avec l'air chaud qui entre",
"pour le bruit, qui couvre les sons des logements"
],
"bon": 0,
"s": 20
},
{
"q": "Convertis 20 °C en °F.",
"t": "nombre",
"ch": [],
"bon": 68,
"s": 50,
"u": "°F",
"expl": "(20 × 1,8) + 32 = 68."
},
{
"q": "Humidité relative visée dans un bâtiment :",
"ch": [
"100 %",
"environ 5 à 10 %, pour éviter toute moisissure",
"environ 70 à 90 %, pour protéger le bois",
"environ 30 à 50 %"
],
"bon": 3,
"s": 20
},
{
"q": "En hiver au Québec, on garde l'humidité plutôt dans le bas de la plage pour éviter…",
"ch": [
"les maux de dos et les douleurs articulaires",
"le bruit de l'humidificateur la nuit",
"la neige",
"la condensation sur les fenêtres"
],
"bon": 3,
"s": 20
},
{
"q": "Signes de mauvaise qualité de l'air à rapporter :",
"ch": [
"Maux de tête, fatigue",
"Air « lourd », odeurs persistantes",
"Condensation",
"Ciel bleu"
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
"q": "Un moniteur de CO₂ élevé dans une classe indique surtout…",
"ch": [
"un début de feu dans un appareil électrique",
"une fuite de gaz naturel dans le local",
"trop de chauffage",
"une ventilation insuffisante"
],
"bon": 3,
"s": 20
},
{
"q": "Associe la mesure de confort.",
"t": "paires",
"g": [
"Température",
"Humidité relative",
"CO₂",
"Vitesse de l'air"
],
"ch": [
"Chaud ou froid",
"Eau dans l'air",
"Air vicié par les occupants",
"Courant d'air"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "L'humidité relative confortable l'hiver est environ…",
"ch": [
"30 à 40 %",
"70 à 80 %",
"5 à 10 %",
"90 à 100 %"
],
"bon": 0,
"s": 20
},
{
"q": "Un taux de CO₂ élevé dans une classe indique une ventilation insuffisante.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Convertis 77 °F en °C.",
"t": "nombre",
"ch": [],
"bon": 25,
"s": 45,
"u": "°C"
},
{
"q": "Dehors, l'air contient environ combien de ppm de CO₂?",
"t": "estim",
"ch": [],
"bon": 420,
"tol": 15,
"u": "ppm",
"s": 30,
"expl": "Environ 420 ppm."
}
]
},
{
"id": "defi-ventilation-climatisation-m11-2",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Ventilation et climatisation · Défi+ 2 de 6",
"sujet": "Modules 3 et 4 : les systèmes et les composants",
"couv": "img/couvertures/ventilation-climatisation-m11.jpg",
"coul": "#14A3A3",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Plainte de froid : avant de monter la consigne, on cherche…",
"ch": [
"le locataire voisin qui baisse son chauffage",
"un nouveau thermostat plus précis à installer",
"la vitre froide, le courant d'air, la bouche bloquée",
"rien"
],
"bon": 2,
"s": 20
},
{
"q": "Cadenassage : le début, dans l'ordre.",
"ch": [
"Aviser les personnes touchées",
"Arrêter l'équipement",
"Couper à la source",
"Poser ton cadenas et ton étiquette"
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
"q": "Les fiches de cadenassage des équipements se trouvent…",
"ch": [
"dans ta voiture",
"nulle part",
"chez le locataire",
"à la station de cadenas"
],
"bon": 3,
"s": 20
},
{
"q": "°C = ?",
"ch": [
"(°F + 32) × 1,8",
"(°F − 32) ÷ 1,8",
"°F × 1,8 + 32",
"°F ÷ 2"
],
"bon": 1,
"s": 20
},
{
"q": "Les quatre rôles d'un système CVCA :",
"ch": [
"chauffer, refroidir, ventiler, contrôler l'humidité",
"aucun",
"chauffer, refroidir, éclairer, contrôler le bruit",
"chauffer, filtrer l'eau, ventiler, contrôler la pression"
],
"bon": 0,
"s": 20
},
{
"q": "Un ventilo-convecteur, c'est…",
"ch": [
"un filtre à air électronique installé dans le conduit",
"une grosse chaudière avec un ventilateur intégré",
"un petit ventilateur et un serpentin à eau",
"un humidificateur"
],
"bon": 2,
"s": 20
},
{
"q": "Une pièce en pression négative…",
"ch": [
"est fermée",
"aspire l'air des pièces voisines",
"pousse l'air vers les voisins",
"n'a pas d'air"
],
"bon": 1,
"s": 20
},
{
"q": "Air repris 22 °C, air frais 0 °C, air mélangé 16,5 °C : % d'air frais?",
"t": "nombre",
"ch": [],
"bon": 25,
"s": 60,
"u": "%",
"expl": "(16,5 − 22) ÷ (0 − 22) × 100 = 25 %."
},
{
"q": "Le critère de performance demande de respecter les normes de qualité de l'air du Code national du bâtiment.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Un grincement aigu au démarrage d'un ventilateur à courroie :",
"ch": [
"normal",
"moteur neuf qui s'use encore, c'est temporaire",
"courroie qui glisse : trop lâche ou usée",
"filtre propre qui laisse passer trop d'air"
],
"bon": 2,
"s": 20
},
{
"q": "Associe le composant à son rôle.",
"t": "paires",
"g": [
"Volet",
"Filtre",
"Serpentin",
"Diffuseur"
],
"ch": [
"Règle l'air qui passe",
"Retient les poussières",
"Chauffe ou refroidit l'air",
"Répand l'air dans la pièce"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Un filtre MERV 13 retient…",
"ch": [
"seulement les grosses poussières",
"moins de particules qu'un MERV 8",
"plus de fines particules qu'un MERV 8",
"les odeurs et les gaz"
],
"bon": 2,
"s": 20
},
{
"q": "Remets dans l'ordre l'air dans une unité de toit.",
"ch": [
"Prise d'air extérieur",
"Filtres",
"Serpentin",
"Ventilateur vers les conduits"
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
"q": "Une courroie trop lâche fait patiner la poulie.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Une courroie bien tendue fléchit d'environ combien de cm au centre (pour 1 m de portée)?",
"t": "estim",
"ch": [],
"bon": 1.6,
"tol": 30,
"u": "cm",
"s": 30,
"expl": "Environ 1/64 de la portée : 1,6 cm pour 1 m."
}
]
},
{
"id": "defi-ventilation-climatisation-m11-3",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Ventilation et climatisation · Défi+ 3 de 6",
"sujet": "Modules 5 et 6 : VRC, VRE et cycle frigorifique",
"couv": "img/couvertures/ventilation-climatisation-m11.jpg",
"coul": "#14A3A3",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "On mesure le courant d'un moteur avec…",
"ch": [
"un manomètre",
"une pince ampèremétrique, unité en marche",
"un manomètre branché sur la sortie du ventilateur",
"un multimètre sur ohms, unité arrêtée"
],
"bon": 1,
"s": 20
},
{
"q": "Une courroie « B48 » : le code donne…",
"ch": [
"la vitesse maximale en tours par minute",
"la section et la longueur",
"la couleur",
"le prix et le fournisseur"
],
"bon": 1,
"s": 20
},
{
"q": "Déflexion visée d'une courroie pour une portée de 16 po :",
"t": "nombre",
"ch": [],
"bon": 0.25,
"s": 50,
"u": "po",
"expl": "1/4 po."
},
{
"q": "Le manomètre différentiel sur un filtre compare…",
"ch": [
"la pression avant et après le filtre",
"le courant",
"l'humidité de l'air qui entre et qui sort",
"la température de l'air avant et après le filtre"
],
"bon": 0,
"s": 20
},
{
"q": "Nettoyer un serpentin : on commence par…",
"ch": [
"démarrer le ventilateur pour sécher pendant le lavage",
"arroser tout de suite à haute pression pour gagner du temps",
"cadenasser et protéger les composants électriques de l'eau",
"enlever le moteur"
],
"bon": 2,
"s": 20
},
{
"q": "Ventilateur centrifuge ou axial : lequel ressemble à une hélice?",
"ch": [
"Les deux",
"L'axial",
"Aucun",
"Le centrifuge"
],
"bon": 1,
"s": 20
},
{
"q": "Entraînement direct ou par courroie : lequel a une poulie?",
"ch": [
"Par courroie",
"Les deux, une de chaque côté",
"Direct, sur l'arbre du moteur",
"Aucun"
],
"bon": 0,
"s": 20
},
{
"q": "Un courant moteur plus élevé que la plaque signalétique indique…",
"ch": [
"rien",
"une surcharge ou un problème",
"un moteur en santé qui travaille fort",
"un filtre propre qui laisse passer plus d'air"
],
"bon": 1,
"s": 20
},
{
"q": "Le noyau d'un VRC se nettoie environ…",
"ch": [
"chaque jour, à la fin du quart de travail",
"aux 10 ans, quand on change le moteur",
"jamais",
"une fois par année"
],
"bon": 3,
"s": 20
},
{
"q": "Le compresseur d'un climatiseur…",
"ch": [
"filtre l'air et enlève l'humidité de la pièce",
"comprime le réfrigérant et le fait circuler",
"chauffe l'eau",
"souffle l'air froid dans la pièce avec son ventilateur"
],
"bon": 1,
"s": 20
},
{
"q": "Associe l'étape du cycle frigorifique.",
"t": "paires",
"g": [
"Compresseur",
"Condenseur",
"Détendeur",
"Évaporateur"
],
"ch": [
"Comprime le gaz",
"Rejette la chaleur dehors",
"Fait baisser la pression",
"Prend la chaleur de la pièce"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Un VRE, contrairement à un VRC, échange aussi…",
"ch": [
"du réfrigérant",
"de l'humidité",
"de l'eau chaude",
"de l'électricité"
],
"bon": 1,
"s": 20
},
{
"q": "Remets dans l'ordre le trajet du réfrigérant.",
"ch": [
"Compresseur",
"Condenseur",
"Détendeur",
"Évaporateur"
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
"q": "Le réfrigérant se manipule seulement par une personne qualifiée.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Un VRC récupère environ combien de % de la chaleur de l'air évacué?",
"t": "estim",
"ch": [],
"bon": 70,
"tol": 20,
"u": "%",
"s": 30,
"expl": "Souvent 60 à 80 %."
}
]
},
{
"id": "defi-ventilation-climatisation-m11-4",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Ventilation et climatisation · Défi+ 4 de 6",
"sujet": "Module 7 : les thermopompes",
"couv": "img/couvertures/ventilation-climatisation-m11.jpg",
"coul": "#14A3A3",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Pourquoi un bâtiment étanche a-t-il besoin d'un échangeur d'air?",
"ch": [
"Il n'en a pas besoin : l'air passe par les murs",
"Pour chauffer l'air froid qui entre par les fenêtres",
"Pour faire du bruit",
"Pour évacuer l'humidité et les polluants en récupérant la chaleur"
],
"bon": 3,
"s": 20
},
{
"q": "VRC ou VRE : lequel récupère aussi de l'humidité?",
"ch": [
"Les deux pareils",
"Aucun",
"Le VRC",
"Le VRE"
],
"bon": 3,
"s": 20
},
{
"q": "Les filtres d'un VRC se changent ou se nettoient environ…",
"ch": [
"aux 2 ou 3 mois",
"chaque jour",
"jamais",
"une fois aux 10 ans"
],
"bon": 0,
"s": 20
},
{
"q": "Le dégivrage d'un VRC : ton travail…",
"ch": [
"le faire à la main chaque nuit avec un séchoir",
"l'arrêter complètement pendant tout l'hiver",
"rien",
"vérifier que le volet bouge et que le drain coule"
],
"bon": 3,
"s": 20
},
{
"q": "Le réfrigérant d'un climatiseur…",
"ch": [
"se recharge chaque année",
"circule en circuit fermé : s'il en manque, il y a une fuite",
"s'use comme de l'essence et se remplit chaque année",
"est de l'eau glacée qui circule dans les tuyaux"
],
"bon": 1,
"s": 20
},
{
"q": "L'écart de température d'un climatiseur se mesure…",
"ch": [
"entre l'air repris et l'air soufflé, après 15 minutes de marche",
"sur le toit, entre l'air extérieur et l'air soufflé",
"dans l'eau",
"au démarrage, sur le tuyau de cuivre extérieur"
],
"bon": 0,
"s": 20
},
{
"q": "Les quatre composants principaux du cycle frigorifique :",
"ch": [
"Compresseur",
"Condenseur",
"Détendeur",
"Évaporateur"
],
"bon": [
0,
1,
2,
3
],
"s": 35,
"t": "multi"
},
{
"q": "Une unité extérieure bien installée est…",
"ch": [
"dans le garage",
"sous un balcon fermé pour la cacher du soleil",
"surélevée, au-dessus du niveau de neige, bien dégagée",
"au sol, collée au mur, protégée par la neige"
],
"bon": 2,
"s": 20
},
{
"q": "Le COP d'une thermopompe, c'est…",
"ch": [
"prix d'achat ÷ puissance en kilowatts",
"chaleur fournie ÷ température extérieure",
"chaleur fournie ÷ électricité consommée",
"la température extérieure"
],
"bon": 2,
"s": 20
},
{
"q": "Un COP de 3 veut dire…",
"ch": [
"3 fois moins d'électricité que de chaleur la nuit seulement",
"3 °C",
"3 fois plus de chaleur que d'électricité consommée",
"3 kW de puissance de chauffage"
],
"bon": 2,
"s": 20
},
{
"q": "Associe le mode de la thermopompe.",
"t": "paires",
"g": [
"Chauffage",
"Climatisation",
"Dégivrage",
"Appoint"
],
"ch": [
"Prend la chaleur dehors, la donne dedans",
"Prend la chaleur dedans, la rejette dehors",
"Inverse un moment pour enlever la glace",
"Plinthes ou éléments quand il fait très froid"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "La vanne d'inversion d'une thermopompe sert à…",
"ch": [
"vider l'eau de condensation",
"couper le courant du compresseur",
"passer du chauffage à la climatisation",
"régler la vitesse du ventilateur"
],
"bon": 2,
"s": 20
},
{
"q": "L'unité extérieure doit être…",
"ch": [
"dégagée, surélevée de la neige",
"couverte d'une bâche l'hiver",
"entourée d'une haie dense",
"collée au mur sous une gouttière"
],
"bon": 0,
"s": 20
},
{
"q": "En dégivrage, de la vapeur qui sort de l'unité extérieure est normale.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Une thermopompe moderne chauffe encore jusqu'à environ combien de °C dehors?",
"t": "estim",
"ch": [],
"bon": -25,
"tol": 20,
"u": "°C",
"s": 30,
"expl": "Les modèles grand froid chauffent jusque vers −25 °C ou moins."
}
]
},
{
"id": "defi-ventilation-climatisation-m11-5",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Ventilation et climatisation · Défi+ 5 de 6",
"sujet": "Module 8 : la régulation",
"couv": "img/couvertures/ventilation-climatisation-m11.jpg",
"coul": "#14A3A3",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Une thermopompe affiche un code d'erreur. Tu…",
"ch": [
"ignores le code",
"notes le code exact, le modèle, la date et l'heure pour le frigoriste",
"ouvres le circuit de réfrigérant pour vérifier la pression",
"débranches et rebranches pour effacer le code, sans noter"
],
"bon": 1,
"s": 20
},
{
"q": "Une thermopompe géothermique capte la chaleur…",
"ch": [
"du sol",
"du gaz",
"du soleil directement",
"de l'air seulement"
],
"bon": 0,
"s": 20
},
{
"q": "Le mode « Climatisation » d'une thermopompe murale…",
"ch": [
"chauffe seulement",
"humidifie",
"ventile sans refroidir",
"refroidit et assèche l'air"
],
"bon": 3,
"s": 20
},
{
"q": "Régulation modulante :",
"ch": [
"sans capteur : la vanne suit une minuterie",
"manuelle seulement",
"tout ou rien : la vanne est ouverte ou fermée",
"l'élément final varie (ex. vanne ouverte à 40 %)"
],
"bon": 3,
"s": 20
},
{
"q": "Un local trop chaud : on cherche où la boucle est brisée…",
"ch": [
"capteur, contrôleur ou élément final",
"chez le voisin, qui a peut-être monté sa consigne",
"nulle part",
"au toit seulement, dans l'unité de toiture"
],
"bon": 0,
"s": 20
},
{
"q": "La vanne d'inversion d'une thermopompe…",
"ch": [
"choisit chauffage ou climatisation",
"purge l'air",
"coupe le courant du compresseur en cas de surchauffe",
"règle l'humidité de l'air soufflé dans la maison"
],
"bon": 0,
"s": 20
},
{
"q": "Régulation tout ou rien : un différentiel sert à…",
"ch": [
"mesurer le CO₂ et partir la ventilation",
"chauffer plus quand il fait très froid dehors",
"changer la consigne",
"éviter les départs et arrêts trop fréquents"
],
"bon": 3,
"s": 20
},
{
"q": "Une boucle de régulation : dans l'ordre.",
"ch": [
"Capteur",
"Contrôleur",
"Élément final"
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
"q": "Un thermostat bien placé :",
"ch": [
"mur intérieur, environ 1,5 m du sol",
"au-dessus d'une plinthe",
"dans un placard",
"près d'une fenêtre ensoleillée"
],
"bon": 0,
"s": 20
},
{
"q": "L'écran de la GTB montre une température anormale. Avant de conclure…",
"ch": [
"ignore : l'écran se trompe souvent",
"change le thermostat du local tout de suite",
"appelle les pompiers",
"va vérifier sur place : un capteur peut être brisé"
],
"bon": 3,
"s": 20
},
{
"q": "Associe le mot de régulation.",
"t": "paires",
"g": [
"Consigne",
"Capteur",
"Actionneur",
"Différentiel"
],
"ch": [
"Valeur voulue",
"Mesure la valeur réelle",
"Agit sur l'équipement",
"Écart entre arrêt et départ"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Une régulation « modulante » ouvre la vanne…",
"ch": [
"selon une minuterie fixe",
"un peu, beaucoup, selon le besoin",
"toujours à fond ou fermée",
"seulement la nuit"
],
"bon": 1,
"s": 20
},
{
"q": "Remets dans l'ordre une boucle de régulation.",
"ch": [
"Le capteur mesure",
"Le contrôleur compare à la consigne",
"Il envoie un signal",
"L'actionneur bouge la vanne"
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
"q": "Un capteur mal placé (au soleil) donne une fausse lecture.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "La consigne de chauffage d'un bureau occupé est souvent d'environ combien de °C?",
"t": "estim",
"ch": [],
"bon": 21,
"tol": 8,
"u": "°C",
"s": 25,
"expl": "Environ 20 à 22 °C."
}
]
},
{
"id": "defi-ventilation-climatisation-m11-6",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Ventilation et climatisation · Défi+ 6 de 6",
"sujet": "Modules 9 à 11 : climatisation centrale et intervention",
"couv": "img/couvertures/ventilation-climatisation-m11.jpg",
"coul": "#14A3A3",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Une régulation pneumatique utilise…",
"ch": [
"de la vapeur",
"de l'eau glacée comme signal entre les appareils",
"de l'air comprimé comme signal",
"des piles dans chaque capteur et chaque vanne"
],
"bon": 2,
"s": 20
},
{
"q": "Variables incontrôlables d'un bâtiment :",
"ch": [
"le débit du ventilateur et la position du volet",
"la position du volet",
"ensoleillement, température extérieure, occupants",
"la consigne et l'horaire du thermostat"
],
"bon": 2,
"s": 20
},
{
"q": "À l'évaluation, ce qui compte le plus :",
"ch": [
"la vitesse : finir avant les autres compte le plus",
"le nombre de pages du rapport",
"un oubli de sécurité compte plus qu'une erreur de calcul",
"la propreté du rapport et la belle écriture"
],
"bon": 2,
"s": 20
},
{
"q": "La trousse de base CVCA contient :",
"ch": [
"Cadenas personnel et étiquettes",
"Détecteur de tension sans contact",
"Pince ampèremétrique",
"Chalumeau au propane"
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
"q": "Un bon rapport d'intervention contient :",
"ch": [
"L'identification (équipement, date, ton nom)",
"Les travaux effectués",
"Les mesures et observations",
"Des opinions sur le client"
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
"q": "Exemple de rapport : « ΔP filtre 0,9 → 0,3 po CE » veut dire…",
"ch": [
"le ventilateur est brisé et tourne moins vite",
"la courroie a été changée",
"le filtre est plus sale après le changement",
"la perte de pression a baissé après le changement des filtres"
],
"bon": 3,
"s": 20
},
{
"q": "Cadenassage, EPI et propreté ne sont jamais facultatifs.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Le système réagit aux variables incontrôlables en ajustant…",
"ch": [
"le soleil",
"le nombre d'occupants permis dans chaque local",
"la météo, avec les prévisions du lendemain",
"les variables contrôlables (débits, températures, volets)"
],
"bon": 3,
"s": 20
},
{
"q": "Un problème de circuit de réfrigérant :",
"ch": [
"plombier, parce que le circuit est en cuivre",
"mécanicien en réfrigération",
"électricien",
"préposé seul, avec une bonbonne de recharge"
],
"bon": 1,
"s": 20
},
{
"q": "Avant de retirer ton cadenas après l'entretien, tu vérifies…",
"ch": [
"le prix des filtres",
"que tout est remonté, outils retirés, personne dans l'unité",
"que le gestionnaire a signé le bon avant de rouvrir",
"que le voyant de l'unité est éteint, sans ouvrir les panneaux"
],
"bon": 1,
"s": 20
},
{
"q": "Associe le symptôme de climatisation à la cause probable.",
"t": "paires",
"g": [
"Serpentin gelé",
"Unité extérieure arrêtée, intérieure en marche",
"Eau sous l'unité intérieure",
"Air peu froid, filtre noir"
],
"ch": [
"Débit d'air trop faible",
"Compresseur ou contacteur à vérifier",
"Drain de condensat bouché",
"Filtre à changer"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "En climatisation, la conduite d'aspiration (la plus grosse) est…",
"ch": [
"sans réfrigérant",
"chaude au toucher",
"froide et isolée",
"pleine d'eau"
],
"bon": 2,
"s": 20
},
{
"q": "Remets dans l'ordre une intervention sur un climatiseur.",
"ch": [
"Écouter la plainte",
"Vérifier thermostat et filtre",
"Observer les unités",
"Noter et aviser le frigoriste au besoin"
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
"q": "Le préposé peut vérifier le filtre et le drain de condensat.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "L'air soufflé par un climatiseur est environ combien de °C plus froid que l'air de retour?",
"t": "estim",
"ch": [],
"bon": 10,
"tol": 30,
"u": "°C",
"s": 30,
"expl": "Environ 8 à 12 °C plus froid."
}
]
},
{
"id": "defi-micro-ordinateur-1",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Utiliser un micro-ordinateur · Défi+ 1 de 6",
"sujet": "Modules 1 et 2 : le portable et Windows 11",
"couv": "img/couvertures/micro-ordinateur.jpg",
"coul": "#185FA5",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Tu t'éloignes de ton portable quelques minutes. Raccourci pour verrouiller :",
"ch": [
"Ctrl + C",
"Alt + F4",
"⊞ + L",
"⊞ + E"
],
"bon": 2,
"s": 20
},
{
"q": "Le port qui sert à brancher un écran ou un projecteur :",
"ch": [
"Lecteur de carte",
"Prise audio",
"HDMI",
"Prise réseau"
],
"bon": 2,
"s": 20
},
{
"q": "Pourquoi faire les mises à jour de Windows?",
"ch": [
"Ce n'est pas utile",
"Pour libérer de l'espace sur le disque dur",
"Elles corrigent des failles de sécurité",
"Pour changer les couleurs et le fond d'écran"
],
"bon": 2,
"s": 20
},
{
"q": "La batterie au lithium-ion s'use surtout quand elle reste longtemps…",
"ch": [
"éteinte",
"vide ou pleine à 100 %",
"au frais, dans un local sous 20 °C",
"à moitié chargée, entre 40 et 60 %"
],
"bon": 1,
"s": 20
},
{
"q": "Passer d'une fenêtre ouverte à l'autre :",
"ch": [
"⊞ + L",
"Ctrl + Z",
"F2",
"Alt + Tab"
],
"bon": 3,
"s": 20
},
{
"q": "Copier :",
"ch": [
"Ctrl + V",
"Ctrl + X",
"Ctrl + Z",
"Ctrl + C"
],
"bon": 3,
"s": 20
},
{
"q": "Faire une capture d'une partie de l'écran :",
"ch": [
"⊞ + Maj + S",
"Ctrl + P",
"Alt + F4",
"⊞ + D"
],
"bon": 0,
"s": 20
},
{
"q": "Un message d'erreur, c'est…",
"ch": [
"un indice : on le lit en entier",
"une fenêtre à fermer rapidement sans la lire",
"un virus",
"un signe que l'ordinateur est brisé pour de bon"
],
"bon": 0,
"s": 20
},
{
"q": "Ouvrir l'Explorateur de fichiers :",
"ch": [
"⊞ + E",
"Alt + Tab",
"⊞ + L",
"Ctrl + F"
],
"bon": 0,
"s": 20
},
{
"q": "Renommer un fichier sélectionné :",
"ch": [
"Échap",
"F5",
"F2",
"Suppr"
],
"bon": 2,
"s": 20
},
{
"q": "Associe le raccourci à l'action.",
"t": "paires",
"g": [
"Ctrl + C",
"Ctrl + V",
"Ctrl + Z",
"Windows + L"
],
"ch": [
"Copier",
"Coller",
"Annuler",
"Verrouiller l'ordinateur"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Pour fermer un programme qui ne répond plus, on ouvre…",
"ch": [
"le Panneau de configuration",
"l'Explorateur de fichiers",
"le Gestionnaire des tâches (Ctrl + Maj + Échap)",
"le Microsoft Store"
],
"bon": 2,
"s": 20
},
{
"q": "Verrouiller l'écran quand on s'éloigne protège ses données.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Remets dans l'ordre l'arrêt propre du portable.",
"ch": [
"Enregistrer ses fichiers",
"Fermer les programmes",
"Menu Démarrer, Arrêter",
"Fermer l'écran une fois éteint"
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
"q": "Une batterie de portable dure environ combien de cycles de charge complets?",
"t": "estim",
"ch": [],
"bon": 500,
"tol": 40,
"u": "cycles",
"s": 30,
"expl": "Souvent 300 à 1 000 cycles."
}
]
},
{
"id": "defi-micro-ordinateur-2",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Utiliser un micro-ordinateur · Défi+ 2 de 6",
"sujet": "Modules 2 et 3 : les fichiers et OneDrive",
"couv": "img/couvertures/micro-ordinateur.jpg",
"coul": "#185FA5",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Le chemin d'un fichier, c'est…",
"ch": [
"son adresse complète, dossier par dossier",
"sa taille et la date de sa dernière modification",
"son icône",
"le nom du programme qui sert à l'ouvrir"
],
"bon": 0,
"s": 20
},
{
"q": "Le poste de travail du portable :",
"ch": [
"par terre",
"sur un lit ou un sofa, pour être à l'aise",
"sur l'établi, à côté du poste de soudure",
"une surface dure, propre et sèche, loin de l'eau"
],
"bon": 3,
"s": 20
},
{
"q": "Coller :",
"ch": [
"Ctrl + X",
"Ctrl + C",
"Ctrl + V",
"Ctrl + Z"
],
"bon": 2,
"s": 20
},
{
"q": "Annuler la dernière action :",
"ch": [
"Ctrl + Y",
"Ctrl + P",
"Ctrl + Z",
"Alt + F4"
],
"bon": 2,
"s": 20
},
{
"q": "Épingler une application à la barre des tâches sert à…",
"ch": [
"la cacher",
"la mettre à jour",
"la supprimer",
"l'ouvrir plus vite"
],
"bon": 3,
"s": 20
},
{
"q": "On peut changer l'extension d'un fichier (.pdf, .docx) sans conséquence.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "L'extension dit quel programme l'ouvre."
},
{
"q": "Partager un fichier OneDrive : plutôt qu'une pièce jointe, on envoie…",
"ch": [
"un lien",
"une clé USB",
"une photo de l'écran",
"un fax"
],
"bon": 0,
"s": 20
},
{
"q": "Clé USB perdue ou brisée :",
"ch": [
"OneDrive la récupère automatiquement en tout temps",
"tout est perdu, aucune sauvegarde",
"Windows la répare quand on la rebranche",
"rien n'est perdu"
],
"bon": 1,
"s": 20
},
{
"q": "Un fichier « en ligne seulement » sur OneDrive…",
"ch": [
"est supprimé du portable et de la corbeille",
"est dans le nuage, pas sur le portable",
"est un virus",
"est privé et ne peut pas être partagé"
],
"bon": 1,
"s": 20
},
{
"q": "Dans https://www.hydroquebec.com/residentiel, le domaine est…",
"ch": [
"https",
"residentiel",
"hydroquebec.com",
"www"
],
"bon": 2,
"s": 20
},
{
"q": "Associe l'extension au type de fichier.",
"t": "paires",
"g": [
".docx",
".xlsx",
".pdf",
".jpg"
],
"ch": [
"Document Word",
"Classeur Excel",
"Document à lire ou imprimer",
"Photo"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Un fichier « en ligne seulement » dans OneDrive…",
"ch": [
"s'ouvre seulement avec Internet",
"est visible par tout le monde",
"est supprimé du compte",
"ne peut pas être renommé"
],
"bon": 0,
"s": 20
},
{
"q": "Remets dans l'ordre le classement d'un document.",
"ch": [
"Choisir le bon dossier",
"Donner un nom clair",
"Enregistrer",
"Vérifier qu'il est synchronisé"
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
"q": "Un bon nom de fichier comprend la date et le sujet.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Une photo de cellulaire pèse environ combien de Mo?",
"t": "estim",
"ch": [],
"bon": 3,
"tol": 50,
"u": "Mo",
"s": 30,
"expl": "Souvent 2 à 5 Mo."
}
]
},
{
"id": "defi-micro-ordinateur-3",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Utiliser un micro-ordinateur · Défi+ 3 de 6",
"sujet": "Modules 4 et 5 : Internet, Outlook et Teams",
"couv": "img/couvertures/micro-ordinateur.jpg",
"coul": "#185FA5",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Pour juger une source Web, on se demande :",
"ch": [
"Qui publie?",
"Quand est-ce publié?",
"Est-ce appuyé par des preuves?",
"Le site a-t-il de belles couleurs?"
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
"q": "L'hameçonnage, c'est…",
"ch": [
"une technique de pêche sportive en eau douce",
"un faux message qui imite une entreprise pour voler tes informations",
"une mise à jour de sécurité envoyée par courriel",
"un antivirus"
],
"bon": 1,
"s": 20
},
{
"q": "Tu as cliqué sur un lien douteux :",
"ch": [
"tu cliques encore",
"tu éteins l'ordinateur et tu ne l'utilises plus",
"tu avises tout de suite, sans cacher",
"tu ne dis rien et tu effaces le message"
],
"bon": 2,
"s": 20
},
{
"q": "La double authentification demande…",
"ch": [
"deux courriels",
"deux preuves sur trois (ce que tu sais, ce que tu as, ce que tu es)",
"deux mots de passe identiques, tapés deux fois",
"deux ordinateurs branchés sur le même compte"
],
"bon": 1,
"s": 20
},
{
"q": "Cc ou Cci : lequel cache les destinataires aux autres?",
"ch": [
"Cci",
"Cc",
"Aucun",
"Les deux"
],
"bon": 0,
"s": 20
},
{
"q": "Un bon courriel professionnel se comprend en…",
"ch": [
"une journée",
"jamais",
"une heure",
"30 secondes"
],
"bon": 3,
"s": 20
},
{
"q": "Le cadenas dans la barre d'adresse (HTTPS) veut dire…",
"ch": [
"rien",
"le site est forcément honnête",
"la connexion est chiffrée",
"le site est gratuit"
],
"bon": 2,
"s": 20
},
{
"q": "Un rançongiciel…",
"ch": [
"accélère l'ordinateur en effaçant les vieux fichiers",
"un antivirus gratuit installé avec Windows",
"est une mise à jour",
"bloque tes fichiers et demande une rançon"
],
"bon": 3,
"s": 20
},
{
"q": "Ajouter une page aux favoris :",
"ch": [
"Ctrl + S",
"Ctrl + D",
"Ctrl + F",
"Ctrl + T"
],
"bon": 1,
"s": 20
},
{
"q": "Envoyer un courriel rapidement :",
"ch": [
"F2",
"Ctrl + Entrée",
"Ctrl + E (envoyer)",
"Alt + Tab (changer de fenêtre)"
],
"bon": 1,
"s": 20
},
{
"q": "Associe l'outil à son usage.",
"t": "paires",
"g": [
"Outlook",
"Teams",
"Navigateur",
"OneDrive"
],
"ch": [
"Courriels et calendrier",
"Clavardage et réunions",
"Naviguer sur Internet",
"Ranger et partager des fichiers"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "« Cc » dans un courriel, c'est pour…",
"ch": [
"demander un accusé de lecture",
"envoyer plus tard",
"cacher un destinataire",
"informer une personne en copie"
],
"bon": 3,
"s": 20
},
{
"q": "Signes d'un courriel d'hameçonnage :",
"ch": [
"Urgence inhabituelle",
"Lien vers une adresse bizarre",
"Fautes et logo flou",
"Ton nom écrit correctement"
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
"q": "On peut partager un fichier OneDrive dans Teams sans l'envoyer en pièce jointe.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Remets dans l'ordre un bon courriel de travail.",
"ch": [
"Objet clair",
"Salutation",
"Message court avec la demande",
"Signature"
],
"bon": [
0,
1,
2,
3
],
"s": 40,
"t": "ordre"
}
]
},
{
"id": "defi-micro-ordinateur-4",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Utiliser un micro-ordinateur · Défi+ 4 de 6",
"sujet": "Modules 6 et 7 : Word",
"couv": "img/couvertures/micro-ordinateur.jpg",
"coul": "#185FA5",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Dégât d'eau en cours : quel moyen de communication?",
"ch": [
"Un courriel",
"Une lettre",
"Le téléphone, puis Teams",
"Un texto la semaine prochaine"
],
"bon": 2,
"s": 20
},
{
"q": "Mettre en gras dans Word :",
"ch": [
"Ctrl + G",
"Ctrl + B",
"Ctrl + I",
"Ctrl + U"
],
"bon": 0,
"s": 20
},
{
"q": "Souligné rouge dans Word :",
"ch": [
"lien",
"grammaire",
"orthographe",
"commentaire"
],
"bon": 2,
"s": 20
},
{
"q": "Un avis affiché aux locataires doit…",
"ch": [
"être long et détaillé pour couvrir tous les cas",
"être en petits caractères pour tenir sur une page",
"se comprendre en quelques secondes, parfois de loin",
"être écrit à la main"
],
"bon": 2,
"s": 20
},
{
"q": "Avant de prendre ses outils, on lit tout le bon de travail, surtout…",
"ch": [
"les directives",
"le logo",
"la police",
"la date d'impression"
],
"bon": 0,
"s": 20
},
{
"q": "L'habillage d'une image dans Word décide…",
"ch": [
"la taille de la page autour de l'image",
"le titre",
"la couleur et la luminosité de l'image",
"comment le texte se place autour de l'image"
],
"bon": 3,
"s": 20
},
{
"q": "Créer un modèle de bon de travail dans Word :",
"ch": [
"Imprimer",
"Fichier → Enregistrer sous → Modèle",
"Envoyer par courriel",
"Copier-coller chaque fois"
],
"bon": 1,
"s": 20
},
{
"q": "La signature de courriel s'ajoute…",
"ch": [
"seulement dans Teams",
"automatiquement à chaque message une fois configurée",
"à la main chaque fois, en bas du message",
"seulement dans Teams, pas dans Outlook"
],
"bon": 1,
"s": 20
},
{
"q": "Pourquoi écrire « 45 » et non « 45 piasses » dans Excel?",
"ch": [
"C'est plus joli et plus facile à lire",
"Ça ne change rien : Excel enlève le mot tout seul",
"Pour économiser l'encre",
"Excel calcule seulement ce qu'il reconnaît comme nombre"
],
"bon": 3,
"s": 20
},
{
"q": "Raccourci pour une somme automatique :",
"ch": [
"Ctrl + S",
"F2",
"⊞ + L",
"Alt + ="
],
"bon": 3,
"s": 20
},
{
"q": "Associe l'outil Word à son usage.",
"t": "paires",
"g": [
"Styles de titre",
"Table des matières",
"Tableau",
"Saut de page"
],
"ch": [
"Donner une structure au document",
"Liste des sections, faite toute seule",
"Aligner des informations en colonnes",
"Commencer une nouvelle page proprement"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Pour qu'une table des matières se fasse toute seule, il faut…",
"ch": [
"numéroter les pages à la main",
"appliquer les styles Titre 1, Titre 2",
"écrire les titres en gras",
"souligner chaque titre"
],
"bon": 1,
"s": 20
},
{
"q": "Remets dans l'ordre la création d'un avis aux locataires.",
"ch": [
"Titre clair",
"Date et heure des travaux",
"Ce que le locataire doit faire",
"Coordonnées pour joindre le préposé"
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
"q": "On peut enregistrer un document Word en PDF.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Un avis affiché se lit bien à 2 mètres avec un titre d'environ combien de points?",
"t": "estim",
"ch": [],
"bon": 48,
"tol": 40,
"u": "pt",
"s": 30,
"expl": "Souvent 36 à 72 points pour un titre d'affiche."
}
]
},
{
"id": "defi-micro-ordinateur-5",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Utiliser un micro-ordinateur · Défi+ 5 de 6",
"sujet": "Modules 7 et 8 : Excel et gestion de l'entretien",
"couv": "img/couvertures/micro-ordinateur.jpg",
"coul": "#185FA5",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Recopier une formule sur 30 lignes : on tire…",
"ch": [
"la fenêtre",
"la poignée de recopie",
"la barre des tâches",
"le titre"
],
"bon": 1,
"s": 20
},
{
"q": "Chercher et remplacer un mot dans Word :",
"ch": [
"Ctrl + U",
"Ctrl + H",
"Ctrl + I",
"Ctrl + G"
],
"bon": 1,
"s": 20
},
{
"q": "Une date écrite « 3 sept. » dans Excel…",
"ch": [
"est parfaite : Excel comprend toutes les dates",
"devient un graphique",
"fait une somme avec les autres dates de la colonne",
"peut ne pas être reconnue comme une date"
],
"bon": 3,
"s": 20
},
{
"q": "Transformer une plage en tableau Excel :",
"ch": [
"Ctrl + B",
"F5",
"Ctrl + T",
"Alt + ="
],
"bon": 2,
"s": 20
},
{
"q": "Le cycle de la gestion de l'entretien va…",
"ch": [
"de la paie au congé",
"du préventif au rien",
"du plan au bail",
"du correctif au préventif"
],
"bon": 3,
"s": 20
},
{
"q": "$A$1 dans une formule, c'est une référence…",
"ch": [
"fausse",
"relative (elle change quand on recopie)",
"absolue (elle ne bouge pas quand on recopie)",
"fausse : Excel l'affiche en rouge"
],
"bon": 2,
"s": 20
},
{
"q": "La fonction SI dans un inventaire sert à…",
"ch": [
"imprimer",
"trier la liste en ordre alphabétique",
"afficher une réponse selon le cas (ex. « Commander » si le stock est bas)",
"faire la somme de tous les articles du stock"
],
"bon": 2,
"s": 20
},
{
"q": "Un registre d'entretien, c'est…",
"ch": [
"une photo de chaque appareil avec sa date",
"un dessin du bâtiment avec les pannes marquées",
"un courriel",
"une ligne par intervention, toujours les mêmes colonnes"
],
"bon": 3,
"s": 20
},
{
"q": "Un graphique sert à…",
"ch": [
"voir en une seconde une tendance ou un mois anormal",
"cacher les chiffres qui sont mauvais",
"remplacer le registre d'entretien au complet",
"décorer"
],
"bon": 0,
"s": 20
},
{
"q": "GMAO veut dire…",
"ch": [
"grille de mesures",
"garantie maximale offerte par le fabricant",
"gestion de la maintenance assistée par ordinateur",
"grand magasin d'outils et d'achats en ligne"
],
"bon": 2,
"s": 20
},
{
"q": "Associe la fonction Excel.",
"t": "paires",
"g": [
"=SOMME()",
"=MOYENNE()",
"=SI()",
"=AUJOURDHUI()"
],
"ch": [
"Additionne une plage",
"Calcule la moyenne",
"Affiche selon une condition",
"Donne la date du jour"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Pour figer la ligne des titres en haut, on utilise…",
"ch": [
"Insertion, Tableau croisé",
"Accueil, Fusionner",
"Affichage, Figer les volets",
"Données, Trier"
],
"bon": 2,
"s": 20
},
{
"q": "Dans Excel, =SOMME(4;6;10) donne combien?",
"t": "nombre",
"ch": [],
"bon": 20,
"s": 40,
"u": ""
},
{
"q": "Un filtre cache les lignes sans les supprimer.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Remets dans l'ordre la création d'un registre d'entretien.",
"ch": [
"Écrire les titres de colonnes",
"Mettre sous forme de tableau",
"Entrer une ligne par intervention",
"Filtrer ou trier au besoin"
],
"bon": [
0,
1,
2,
3
],
"s": 40,
"t": "ordre"
}
]
},
{
"id": "defi-micro-ordinateur-6",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Utiliser un micro-ordinateur · Défi+ 6 de 6",
"sujet": "Modules 8 à 10 : GMAO, intelligence artificielle, bilan",
"couv": "img/couvertures/micro-ordinateur.jpg",
"coul": "#185FA5",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Entretien préventif ou correctif : lequel se fait avant la panne?",
"ch": [
"Aucun",
"Préventif",
"Correctif",
"Les deux"
],
"bon": 1,
"s": 20
},
{
"q": "Un code QR collé sur un équipement peut ouvrir…",
"ch": [
"la machine à distance, pour la démarrer",
"un jeu",
"la porte du local mécanique, sans clé",
"sa fiche ou son manuel"
],
"bon": 3,
"s": 20
},
{
"q": "Microsoft Forms permet de…",
"ch": [
"jouer de la musique",
"remplir un bon de travail sur le cellulaire",
"dessiner un plan du bâtiment à l'échelle",
"écrire une lettre officielle avec un en-tête"
],
"bon": 1,
"s": 20
},
{
"q": "Une bonne demande à l'IA contient :",
"ch": [
"Un rôle",
"Le contexte",
"La tâche",
"Le format voulu"
],
"bon": [
0,
1,
2,
3
],
"s": 35,
"t": "multi"
},
{
"q": "Après une réponse de l'IA, tu vérifies…",
"ch": [
"rien : elle a toujours raison sur les faits",
"les faits : dates, chiffres, modèles, prix",
"seulement l'orthographe et la ponctuation",
"la couleur"
],
"bon": 1,
"s": 20
},
{
"q": "Avec une IA, on n'écrit jamais…",
"ch": [
"des renseignements personnels des locataires",
"un plan de travail",
"une question sur un manuel d'appareil",
"une demande de courriel poli au gestionnaire"
],
"bon": 0,
"s": 20,
"expl": "Loi 25 : protection des renseignements personnels."
},
{
"q": "Un agent IA, à la différence d'un assistant…",
"ch": [
"répond seulement aux questions, une à la fois",
"agit : il fait lui-même plusieurs étapes",
"n'existe pas",
"est un humain qui travaille à distance"
],
"bon": 1,
"s": 20
},
{
"q": "La fonction =AUJOURDHUI() dans un plan préventif sert à…",
"ch": [
"calculer si une tâche est due ou en retard",
"afficher la météo du jour dans la feuille",
"trier les noms des préposés par ordre",
"faire un graphique"
],
"bon": 0,
"s": 20
},
{
"q": "Interfaces des systèmes du bâtiment : règle d'or…",
"ch": [
"redémarrer tout",
"changer les consignes sans noter, puis revenir",
"tout essayer au hasard pour trouver plus vite",
"lire tout l'écran avant de toucher et noter chaque changement"
],
"bon": 3,
"s": 20
},
{
"q": "Pour un courriel de travail avec l'IA, le bon choix :",
"ch": [
"aucun",
"Copilot avec le compte de l'école ou de l'employeur",
"le compte personnel d'un ami qui paie l'abonnement",
"un site inconnu gratuit trouvé sur Internet"
],
"bon": 1,
"s": 20
},
{
"q": "Associe le mot de GMAO.",
"t": "paires",
"g": [
"Bon de travail",
"Préventif",
"Correctif",
"Historique"
],
"ch": [
"Demande d'intervention à faire",
"Planifié à l'avance",
"Réparation après un bris",
"Tout ce qui a été fait sur un équipement"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Une bonne demande à une IA (« prompt ») est…",
"ch": [
"copiée d'un autre site",
"écrite en majuscules",
"précise, avec le contexte et le format voulu",
"un seul mot pour aller vite"
],
"bon": 2,
"s": 20
},
{
"q": "Que vérifie-t-on dans une réponse d'IA?",
"ch": [
"Les chiffres",
"Les noms de modèles",
"Les dates",
"La police de caractères"
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
"q": "On peut coller le nom et l'adresse d'un locataire dans une IA publique.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15
},
{
"q": "Remets dans l'ordre le traitement d'un bon de travail.",
"ch": [
"Recevoir la demande",
"Planifier et faire le travail",
"Noter ce qui a été fait",
"Fermer le bon"
],
"bon": [
0,
1,
2,
3
],
"s": 40,
"t": "ordre"
}
]
},
{
"id": "defi-communiquer-1",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Communiquer en milieu de travail · Défi+ 1 de 6",
"sujet": "Modules 1 et 2 : le préposé au cœur de l'immeuble, les bases",
"couv": "img/couvertures/communiquer.jpg",
"coul": "#185FA5",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Communiquer, c'est s'assurer que le message est…",
"ch": [
"écrit en majuscules",
"dit une fois",
"envoyé vite",
"reçu et compris"
],
"bon": 3,
"s": 20
},
{
"q": "Urgence ou preuve? « Urgence → parle; preuve → … »",
"ch": [
"écris (courriel, registre, bon de travail)",
"parle plus fort pour qu'on s'en souvienne",
"texte un ami",
"attends que quelqu'un te le demande"
],
"bon": 0,
"s": 20
},
{
"q": "Le non-verbal, c'est…",
"ch": [
"le téléphone",
"tout sauf les mots : visage, regard, posture",
"l'écriture des courriels et des avis",
"les mots qu'on choisit pour parler poliment"
],
"bon": 1,
"s": 20
},
{
"q": "Avec un locataire ou le gestionnaire, le niveau de langue :",
"ch": [
"anglais seulement",
"familier, avec des sacres pour avoir l'air proche",
"très soutenu, avec des mots compliqués",
"correct et poli, pas comme entre amis au chalet"
],
"bon": 3,
"s": 20
},
{
"q": "À la radio, la rétroaction, c'est répondre…",
"ch": [
"« reçu »",
"rien",
"plus tard",
"« oui oui »"
],
"bon": 0,
"s": 20
},
{
"q": "En service à la clientèle, on écoute…",
"ch": [
"moins qu'on parle, pour bien expliquer",
"au moins deux fois plus qu'on parle",
"jamais",
"seulement au début, puis on propose la solution"
],
"bon": 1,
"s": 20
},
{
"q": "Reformuler, c'est…",
"ch": [
"redire dans tes mots pour vérifier que tu as compris",
"corriger la personne quand elle se trompe",
"changer de sujet",
"répéter mot à mot ce que la personne a dit"
],
"bon": 0,
"s": 20
},
{
"q": "La technique de l'entonnoir pour une fuite :",
"ch": [
"aucune question",
"des questions ouvertes, puis de plus en plus précises",
"seulement des questions fermées, oui ou non",
"deviner la cause et aller réparer"
],
"bon": 1,
"s": 20
},
{
"q": "Les 4 temps de l'accueil : dans l'ordre (début).",
"ch": [
"Saluer",
"Se présenter",
"Écouter la demande",
"Conclure"
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
"q": "Le locataire n'est pas là pendant ton intervention. Tu laisses…",
"ch": [
"rien",
"une carte de passage",
"la porte ouverte",
"un mot sur Facebook"
],
"bon": 1,
"s": 20
},
{
"q": "Associe l'élément de communication.",
"t": "paires",
"g": [
"Émetteur",
"Message",
"Récepteur",
"Rétroaction"
],
"ch": [
"Celui qui parle",
"Ce qu'on veut dire",
"Celui qui reçoit",
"La réponse qui confirme"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Le bruit, en communication, c'est…",
"ch": [
"le téléphone qui sonne",
"un mot mal écrit",
"tout ce qui brouille le message",
"seulement le son trop fort"
],
"bon": 2,
"s": 20
},
{
"q": "Le ton de la voix change le sens d'un message.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Remets dans l'ordre l'accueil d'une demande d'un locataire.",
"ch": [
"Saluer et écouter",
"Poser des questions",
"Reformuler",
"Dire ce qui va se passer"
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
"q": "Qu'est-ce qui fait partie du non-verbal?",
"ch": [
"Le regard",
"La posture",
"Les gestes",
"Les mots choisis"
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
"id": "defi-communiquer-2",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Communiquer en milieu de travail · Défi+ 2 de 6",
"sujet": "Module 3 : les occupants",
"couv": "img/couvertures/communiquer.jpg",
"coul": "#185FA5",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Locataire fâché : la méthode en 4 temps.",
"ch": [
"Écouter",
"Reformuler",
"Expliquer",
"Proposer une solution"
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
"q": "Les Habitations du Parc comptent…",
"ch": [
"1 logement",
"6 logements sur 2 étages",
"48 logements sur 4 étages",
"200 logements sur 12 étages"
],
"bon": 2,
"s": 20
},
{
"q": "Une demande mal transmise peut devenir…",
"ch": [
"un congé",
"rien",
"un dégât d'eau",
"une bonne nouvelle"
],
"bon": 2,
"s": 20
},
{
"q": "Ta tenue, ta posture et ton regard…",
"ch": [
"parlent avant toi",
"n'ont aucune importance",
"changent le loyer",
"sont privés"
],
"bon": 0,
"s": 20
},
{
"q": "Une question ouverte commence souvent par…",
"ch": [
"« Est-ce que oui ou non… »",
"« Vous êtes sûr? »",
"« Pouvez-vous me décrire… »",
"« Non? »"
],
"bon": 2,
"s": 20
},
{
"q": "Dire non à une demande qui ne relève pas de toi :",
"ch": [
"expliquer et proposer à qui s'adresser",
"ignorer la personne pour ne pas perdre de temps",
"dire oui quand même, puis ne rien faire",
"raccrocher"
],
"bon": 0,
"s": 20
},
{
"q": "Le logement, même si l'immeuble appartient au propriétaire, c'est…",
"ch": [
"le bureau du préposé",
"le chez-soi du locataire",
"un entrepôt",
"un espace commun"
],
"bon": 1,
"s": 20
},
{
"q": "Une personne qui crie après son frigo est fâchée contre toi personnellement.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "C'est la situation, pas toi : ne le prends pas personnel."
},
{
"q": "La « bulle » d'une personne :",
"ch": [
"son espace personnel sur son téléphone",
"la distance à respecter pour ne pas l'envahir",
"son logement",
"la pièce où elle se sent bien chez elle"
],
"bon": 1,
"s": 20
},
{
"q": "Une consigne pas claire :",
"ch": [
"je devine ce que le gestionnaire veut dire",
"je demande à un locataire ce qu'il en pense",
"je pose des questions et je reformule",
"je ne fais rien"
],
"bon": 2,
"s": 20
},
{
"q": "Associe l'occupant au bon ajustement.",
"t": "paires",
"g": [
"Personne âgée",
"Personne qui parle peu français",
"Personne pressée",
"Personne inquiète"
],
"ch": [
"Parler lentement, face à elle",
"Mots simples, gestes, écrit",
"Aller droit au but",
"Rassurer avec des faits"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Une question fermée sert à…",
"ch": [
"changer de sujet",
"terminer la conversation",
"confirmer un détail (oui ou non)",
"laisser la personne tout raconter"
],
"bon": 2,
"s": 20
},
{
"q": "Remets dans l'ordre l'entrée dans un logement.",
"ch": [
"Frapper et attendre",
"Se présenter",
"Expliquer la raison",
"Demander la permission d'entrer"
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
"q": "On parle de la vie d'un locataire à un autre locataire.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15
},
{
"q": "Dans une bonne écoute, on écoute environ combien de % du temps?",
"t": "estim",
"ch": [],
"bon": 70,
"tol": 20,
"u": "%",
"s": 30,
"expl": "Écouter au moins deux fois plus qu'on parle."
}
]
},
{
"id": "defi-communiquer-3",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Communiquer en milieu de travail · Défi+ 3 de 6",
"sujet": "Modules 4 et 5 : l'équipe et l'écrit",
"couv": "img/couvertures/communiquer.jpg",
"coul": "#185FA5",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Rendre compte, c'est informer ton supérieur de…",
"ch": [
"la météo et l'état des stationnements",
"tes vacances et tes congés de la semaine",
"ce que tu as fait, trouvé et ce qui reste",
"rien"
],
"bon": 2,
"s": 20
},
{
"q": "La passation de quart sert à…",
"ch": [
"changer d'uniforme entre deux quarts",
"rien",
"fermer l'immeuble pendant la nuit",
"transmettre l'information entre préposés qui se relaient"
],
"bon": 3,
"s": 20
},
{
"q": "Le message radio type : dans l'ordre.",
"ch": [
"L'appel (qui appelle qui)",
"La réponse « j'écoute »",
"Le message",
"La confirmation « reçu »"
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
"q": "Le message « je » sert à…",
"ch": [
"accuser l'autre de façon claire et directe",
"régler un irritant sans attaquer",
"se vanter",
"commander sans avoir à expliquer"
],
"bon": 1,
"s": 20
},
{
"q": "Le bon de travail se remplit…",
"ch": [
"pendant ou juste après l'intervention",
"jamais",
"à la fin de la semaine, tous en même temps",
"par le locataire, qui le signe à la fin"
],
"bon": 0,
"s": 20
},
{
"q": "Fait ou opinion? « La locataire était saoule. »",
"ch": [
"Opinion : on écrit ce qu'on a observé",
"Une preuve",
"Les deux : un fait et une opinion à la fois",
"Fait : c'est ce que tout le monde a vu"
],
"bon": 0,
"s": 20
},
{
"q": "Avant d'entrer chez quelqu'un :",
"ch": [
"attendre dans le corridor sans rien dire",
"entrer avec ta clé sans frapper",
"frapper, se présenter et expliquer la raison",
"appeler la police"
],
"bon": 2,
"s": 20
},
{
"q": "Une personne âgée qui entend mal :",
"ch": [
"parler face à elle, lentement et clairement",
"parler vite pour ne pas la retenir",
"ignorer",
"crier fort pour être sûr qu'elle entende"
],
"bon": 0,
"s": 20
},
{
"q": "Admettre une erreur à ton supérieur :",
"ch": [
"en accusant un collègue",
"jamais",
"à la fin de l'année",
"tout de suite, avec les faits"
],
"bon": 3,
"s": 20
},
{
"q": "Le rapport d'incident contient…",
"ch": [
"des rumeurs entendues dans le corridor",
"rien",
"des opinions sur ce qui s'est passé",
"des faits, en ordre chronologique"
],
"bon": 3,
"s": 20
},
{
"q": "Associe l'écrit à son usage.",
"t": "paires",
"g": [
"Bon de travail",
"Avis aux locataires",
"Rapport d'incident",
"Courriel au gestionnaire"
],
"ch": [
"Ce qui a été fait",
"Informer avant des travaux",
"Les faits d'un événement",
"Demande ou suivi rapide"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Une passation de quart réussie contient…",
"ch": [
"la météo du lendemain",
"les potins de la journée",
"ce qui est fait, ce qui reste et les urgences",
"seulement l'heure de départ"
],
"bon": 2,
"s": 20
},
{
"q": "Trouve l'erreur dans cette phrase.",
"t": "erreur",
"ch": [
"Le rapport décrit",
"les faits observés",
"et l'opinion du préposé sur la locataire",
"en ordre chronologique."
],
"bon": 2,
"s": 30,
"expl": "Un rapport garde seulement les faits."
},
{
"q": "Un message « je » commence par ce que je ressens ou observe.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Un bon avis aux locataires est…",
"ch": [
"Court",
"Daté",
"Clair dès le titre",
"Écrit en petits caractères"
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
"id": "defi-communiquer-4",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Communiquer en milieu de travail · Défi+ 4 de 6",
"sujet": "Module 6 : le téléphone",
"couv": "img/couvertures/communiquer.jpg",
"coul": "#185FA5",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Une bonne photo-preuve :",
"ch": [
"une photo de nuit, sans flash, de loin",
"un selfie",
"une vue d'ensemble pour situer, puis un gros plan",
"seulement un gros plan, même un peu flou"
],
"bon": 2,
"s": 20
},
{
"q": "Trouve l'erreur dans cette phrase.",
"t": "erreur",
"ch": [
"Il à réparé",
"le robinet",
"à 10 h."
],
"bon": 0,
"s": 30,
"expl": "« Il a réparé » (verbe avoir)."
},
{
"q": "Abréviation acceptée pour l'heure :",
"ch": [
"10 heurs 15",
"10:15hres",
"10hr15",
"10 h 15"
],
"bon": 3,
"s": 20
},
{
"q": "Mettre quelqu'un en attente au téléphone :",
"ch": [
"parler à quelqu'un d'autre",
"raccrocher et rappeler quand tu as le temps",
"« Puis-je vous mettre en attente une minute? » et attendre le oui",
"appuyer sur le bouton d'attente sans rien dire"
],
"bon": 2,
"s": 20
},
{
"q": "Quand quelqu'un demande d'être rappelé :",
"ch": [
"ne pas promettre d'heure : « Je lui transmets votre message dès maintenant »",
"donner le numéro de cellulaire du gestionnaire",
"ignorer",
"promettre un rappel dans 5 minutes pour la rassurer"
],
"bon": 0,
"s": 20
},
{
"q": "Avant d'appeler pour une pièce, on note…",
"ch": [
"la couleur et la marque peintes sur l'appareil",
"le nom du locataire qui a fait la demande",
"rien",
"les informations de la plaque signalétique"
],
"bon": 3,
"s": 20
},
{
"q": "Près de chaque téléphone de l'immeuble, on affiche…",
"ch": [
"l'adresse exacte, le code postal et les entrées",
"rien",
"des blagues et des messages pour le personnel",
"le menu du restaurant le plus proche"
],
"bon": 0,
"s": 20,
"expl": "Sous le stress d'une urgence, on oublie."
},
{
"q": "Ta boîte vocale professionnelle :",
"ch": [
"vide",
"une blague pour mettre les gens de bonne humeur",
"sans musique ni blague, avec ton nom",
"une chanson populaire avec ton prénom à la fin"
],
"bon": 2,
"s": 20
},
{
"q": "L'iceberg de la colère : le frigo brisé n'est que…",
"ch": [
"tout le problème : on le répare et c'est réglé",
"un détail",
"la pointe : dessous, la fatigue, l'inquiétude, d'autres soucis",
"une excuse pour se plaindre du loyer"
],
"bon": 2,
"s": 20
},
{
"q": "Plus tu reconnais tôt les signes d'escalade…",
"ch": [
"rien ne change",
"plus il faut parler fort pour reprendre le contrôle",
"plus c'est dangereux d'intervenir",
"plus il est facile de calmer la situation"
],
"bon": 3,
"s": 20
},
{
"q": "Associe le moment de l'appel à la bonne phrase.",
"t": "paires",
"g": [
"Répondre",
"Mettre en attente",
"Transférer",
"Terminer"
],
"ch": [
"Saluer et dire son nom",
"Demander la permission",
"Expliquer à qui on transfère",
"Résumer et remercier"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Un message laissé dans une boîte vocale contient…",
"ch": [
"ton nom, ton numéro et la raison",
"une longue explication",
"seulement « rappelle-moi »",
"ton adresse personnelle"
],
"bon": 0,
"s": 20
},
{
"q": "Remets dans l'ordre la prise d'un message.",
"ch": [
"Nom de la personne",
"Numéro pour la rappeler",
"Raison de l'appel",
"Date et heure"
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
"q": "On peut répondre au téléphone en mangeant si on est discret.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15
},
{
"q": "Au téléphone, on se fait une idée de quelqu'un en environ combien de secondes?",
"t": "estim",
"ch": [],
"bon": 7,
"tol": 50,
"u": "s",
"s": 25,
"expl": "Quelques secondes à peine."
}
]
},
{
"id": "defi-communiquer-5",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Communiquer en milieu de travail · Défi+ 5 de 6",
"sujet": "Modules 7 et 8 : situations difficiles et éthique",
"couv": "img/couvertures/communiquer.jpg",
"coul": "#185FA5",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Quand quelqu'un crie contre toi, ton corps réagit. Pour garder ton calme :",
"ch": [
"partir en courant sans rien dire",
"te fâcher",
"respirer lentement et baisser le ton",
"crier plus fort"
],
"bon": 2,
"s": 20
},
{
"q": "Ta voix au téléphone :",
"ch": [
"très rapide, pour montrer que tu es efficace",
"sans importance : seuls les mots comptent",
"souriante et claire : on se fait une idée en quelques secondes",
"fâchée"
],
"bon": 2,
"s": 20
},
{
"q": "Signe d'escalade de la colère :",
"ch": [
"la voix monte et les gestes deviennent brusques",
"la personne dit merci",
"la personne s'assoit et croise les bras",
"la personne sourit et baisse le ton"
],
"bon": 0,
"s": 20
},
{
"q": "Ton journal des faits est…",
"ch": [
"remis aux locataires",
"publié en ligne",
"personnel et confidentiel",
"affiché dans le hall"
],
"bon": 2,
"s": 20
},
{
"q": "Une demande que tu ne peux pas accepter (ex. un cadeau) :",
"ch": [
"refuser poliment en expliquant la règle",
"te fâcher et lui dire qu'elle n'a pas le droit",
"accepter en cachette pour ne pas la vexer",
"ignorer"
],
"bon": 0,
"s": 20
},
{
"q": "Le journal des faits sert à noter…",
"ch": [
"la date, l'heure, le lieu et les faits, sans opinion",
"tes émotions et ce que tu as ressenti",
"les loyers",
"les rumeurs entendues sur les locataires"
],
"bon": 0,
"s": 20
},
{
"q": "Se retirer d'une situation dangereuse, c'est…",
"ch": [
"un geste professionnel qui protège",
"interdit : le préposé doit toujours régler la situation",
"abandonner son travail et ses collègues",
"perdre la face"
],
"bon": 0,
"s": 20
},
{
"q": "Conflit entre deux locataires :",
"ch": [
"tu changes la serrure",
"tu choisis le camp de celui qui a raison",
"tu restes neutre et tu transmets au gestionnaire",
"tu règles avec une amende sur le loyer"
],
"bon": 2,
"s": 20
},
{
"q": "Tu peux expliquer une règle de l'immeuble, mais…",
"ch": [
"tu peux couper l'eau",
"tu peux expulser un locataire qui la brise",
"tu ne peux pas l'appliquer par la force ou une sanction",
"tu peux donner des amendes si on ne la respecte pas"
],
"bon": 2,
"s": 20
},
{
"q": "Les clés des logements :",
"ch": [
"dans ta poche à la maison",
"sous clé, et chaque sortie est notée",
"prêtées aux voisins",
"sur un crochet dans le hall"
],
"bon": 1,
"s": 20
},
{
"q": "Associe la situation à la bonne réaction.",
"t": "paires",
"g": [
"Locataire en colère",
"Menace",
"Cadeau offert",
"Demande hors de ton rôle"
],
"ch": [
"Écouter et garder son calme",
"Se retirer et aviser",
"Refuser poliment",
"Diriger vers la bonne personne"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Remets dans l'ordre la désescalade.",
"ch": [
"Garder une distance sécuritaire",
"Parler calmement",
"Reconnaître l'émotion",
"Proposer une solution ou un suivi"
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
"q": "La confidentialité veut dire que…",
"ch": [
"tu peux en parler à tes amis",
"ce que tu vois chez les locataires reste privé",
"tu dois tout écrire dans Teams",
"seul le gestionnaire peut parler"
],
"bon": 1,
"s": 20
},
{
"q": "Se retirer d'une situation dangereuse, c'est professionnel.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Qu'est-ce qui fait partie de l'éthique du préposé?",
"ch": [
"Honnêteté",
"Respect",
"Confidentialité",
"Favoritisme"
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
"id": "defi-communiquer-6",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Communiquer en milieu de travail · Défi+ 6 de 6",
"sujet": "Module 8 et bilan : image professionnelle, révision",
"couv": "img/couvertures/communiquer.jpg",
"coul": "#185FA5",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Un locataire t'offre un cadeau pour une réparation :",
"ch": [
"refuser poliment, sans froisser",
"accepter tout de suite pour ne pas le vexer",
"le vendre",
"demander plus pour les prochaines réparations"
],
"bon": 0,
"s": 20
},
{
"q": "Être fiable, c'est…",
"ch": [
"que les autres comptent sur toi sans devoir vérifier",
"promettre beaucoup pour faire plaisir à tout le monde",
"faire seulement ce qui te plaît",
"arriver quand tu veux si le travail est fait"
],
"bon": 0,
"s": 20
},
{
"q": "Un code d'éthique regroupe…",
"ch": [
"les outils",
"les prix à demander pour chaque service",
"les valeurs et les règles de conduite d'un métier",
"les horaires de travail de l'équipe"
],
"bon": 2,
"s": 20
},
{
"q": "Ce qui fait ton image professionnelle :",
"ch": [
"Ta tenue",
"Ta ponctualité",
"Ta façon de parler",
"La marque de ton cellulaire"
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
"q": "On peut ne pas aimer un collègue et bien travailler avec lui.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Un renseignement personnel d'un locataire (santé, revenu) :",
"ch": [
"reste confidentiel",
"se partage avec les voisins",
"s'affiche dans le hall",
"se publie sur les réseaux"
],
"bon": 0,
"s": 20
},
{
"q": "« Communiquer, ça s'apprend comme… »",
"ch": [
"rien",
"souder ou déboucher un drain",
"un talent : on naît bon communicateur ou non",
"la chance : ça dépend des gens qu'on rencontre"
],
"bon": 1,
"s": 20
},
{
"q": "La ponctualité, c'est…",
"ch": [
"arriver quand tu peux, si tu finis tes tâches",
"arriver à l'heure et prévenir si tu es en retard",
"rien d'important",
"partir tôt quand le travail est terminé"
],
"bon": 1,
"s": 20
},
{
"q": "Les loups-garous et Naufragés! sont des ateliers pour pratiquer…",
"ch": [
"le ménage et l'organisation du local",
"la soudure et le travail en équipe sur un montage",
"les mathématiques",
"la communication et le consensus"
],
"bon": 3,
"s": 20
},
{
"q": "Après une activité en atelier, le retour sert à…",
"ch": [
"transformer l'activité en apprentissage",
"noter les gagnants et donner les points",
"ranger le matériel et remettre le local en ordre",
"rien"
],
"bon": 0,
"s": 20
},
{
"q": "Associe la qualité à un geste concret.",
"t": "paires",
"g": [
"Ponctualité",
"Fiabilité",
"Courtoisie",
"Propreté"
],
"ch": [
"Arriver à l'heure",
"Faire ce qu'on a promis",
"Saluer et remercier",
"Laisser l'endroit propre"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Une tenue professionnelle, c'est…",
"ch": [
"propre, sécuritaire et adaptée au travail",
"un complet-cravate",
"la même qu'au chalet",
"la plus chère possible"
],
"bon": 0,
"s": 20
},
{
"q": "Remets dans l'ordre la fin d'une intervention chez un locataire.",
"ch": [
"Ranger et nettoyer",
"Expliquer ce qui a été fait",
"Vérifier qu'il n'a plus de question",
"Remplir le bon de travail"
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
"q": "Admettre une erreur rapidement aide la confiance.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Une première impression se forme en environ combien de secondes?",
"t": "estim",
"ch": [],
"bon": 7,
"tol": 50,
"u": "s",
"s": 25,
"expl": "En quelques secondes."
}
]
},
{
"id": "defi-lecture-plans-batiments-egi-1",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Lecture de plans de bâtiments · Défi+ 1 de 6",
"sujet": "Modules 1 et 2 : le jeu de plans et les vues",
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
"Électricité, plan d'étage, feuille 2",
"Architecture, coupe, feuille 2",
"Structure, détail 102",
"Page 102 du devis"
],
"bon": 0,
"s": 20
},
{
"q": "Le cartouche se trouve…",
"ch": [
"en bas à droite de chaque feuille",
"en haut à gauche de la première feuille",
"dans le devis seulement",
"au verso de la dernière feuille"
],
"bon": 0,
"s": 20
},
{
"q": "Les plans « tel que construit » montrent…",
"ch": [
"ce qui était prévu au départ par l'architecte",
"le prix final des travaux, poste par poste",
"les plans de la ville",
"les changements faits sur le chantier"
],
"bon": 3,
"s": 20
},
{
"q": "Le plan de structure montre…",
"ch": [
"les prises de courant et les luminaires",
"le mobilier",
"ce qui porte le bâtiment : on ne le perce pas sans autorisation",
"les couleurs de peinture et les finis des murs"
],
"bon": 2,
"s": 20
},
{
"q": "Le devis, c'est…",
"ch": [
"les textes qui décrivent la qualité des matériaux et la façon d'exécuter",
"le reçu du fournisseur avec la liste des matériaux",
"le dessin du toit et des pentes",
"la liste des employés"
],
"bon": 0,
"s": 20
},
{
"q": "Plier un plan en accordéon : où doit se retrouver le cartouche?",
"ch": [
"Peu importe",
"À l'intérieur, pour le protéger",
"Visible, sur le dessus",
"Coupé, pour gagner de la place"
],
"bon": 2,
"s": 20
},
{
"q": "Dans les trois vues d'un objet, la vue de dessus se place…",
"ch": [
"à gauche de la vue de face",
"au-dessus de la vue de face",
"n'importe où",
"sous la vue de côté"
],
"bon": 1,
"s": 20
},
{
"q": "Associe la lettre de la feuille à la discipline.",
"t": "paires",
"g": [
"A",
"S",
"M",
"E"
],
"ch": [
"Architecture",
"Structure",
"Mécanique (plomberie, chauffage, ventilation)",
"Électricité"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "La vue en plan, c'est…",
"ch": [
"le bâtiment coupé à environ 1,2 m et vu d'en haut",
"le bâtiment coupé de haut en bas",
"le toit vu d'un avion, sans les murs",
"le bâtiment vu de face, du trottoir"
],
"bon": 0,
"s": 20
},
{
"q": "Une élévation montre…",
"ch": [
"le terrain et les arbres",
"l'intérieur d'un mur coupé",
"une façade vue de face",
"le plancher vu d'en haut"
],
"bon": 2,
"s": 20
},
{
"q": "Le numéro de feuille se trouve dans le cartouche.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Que trouve-t-on dans un cartouche?",
"ch": [
"Le titre du projet",
"L'échelle",
"La date et les révisions",
"Le prix des matériaux"
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
"q": "La flèche du nord sert à…",
"ch": [
"orienter le plan par rapport au terrain",
"montrer la pente du toit",
"montrer d'où vient le vent dominant",
"indiquer l'entrée principale"
],
"bon": 0,
"s": 20
},
{
"q": "Une feuille de plan grand format (ARCH D) mesure environ combien de pouces de large?",
"t": "estim",
"ch": [],
"bon": 36,
"tol": 10,
"u": "po",
"s": 25,
"expl": "24 × 36 po."
},
{
"q": "Une ligne pointillée sur un plan montre souvent…",
"ch": [
"la limite du terrain",
"un mur à démolir pour sûr",
"ce qui est caché ou au-dessus",
"une erreur du dessinateur"
],
"bon": 2,
"s": 20
}
]
},
{
"id": "defi-lecture-plans-batiments-egi-2",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Lecture de plans de bâtiments · Défi+ 2 de 6",
"sujet": "Modules 2 et 3 : les vues et les échelles",
"couv": "img/couvertures/lecture-plans-batiments-egi.jpg",
"coul": "#534AB7",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Les hauteurs se mesurent à partir…",
"ch": [
"du plancher fini",
"de la dalle de béton",
"du plafond",
"du sous-plancher"
],
"bon": 0,
"s": 20
},
{
"q": "Sur une coupe, les flèches au bout du trait de coupe indiquent…",
"ch": [
"l'entrée",
"la direction du nord géographique",
"le sens du regard",
"la pente du terrain sous le bâtiment"
],
"bon": 2,
"s": 20
},
{
"q": "Un cercle de détail sur une coupe sert à…",
"ch": [
"indiquer une colonne de structure à cet endroit",
"marquer une sortie de secours dans le mur",
"décorer le plan",
"renvoyer à un zoom d'une petite partie"
],
"bon": 3,
"s": 20
},
{
"q": "Sur le papier isométrique, les longueurs et les profondeurs sont tracées à…",
"ch": [
"60°",
"30°",
"90°",
"45°"
],
"bon": 1,
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
"le tableau électrique",
"le bâtiment sur son terrain",
"le détail d'un raccord",
"l'intérieur des murs"
],
"bon": 1,
"s": 20
},
{
"q": "Associe l'échelle à son usage courant.",
"t": "paires",
"g": [
"1:500",
"1:100",
"1:50",
"1:5"
],
"ch": [
"Plan d'implantation du terrain",
"Plan d'étage d'un grand bâtiment",
"Plan d'un logement",
"Détail de construction"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "À l'échelle 1:50, 1 cm sur le plan égale…",
"ch": [
"50 cm en réalité",
"5 m en réalité",
"50 m en réalité",
"5 cm en réalité"
],
"bon": 0,
"s": 20
},
{
"q": "Le règle d'architecte (scalimètre) sert à…",
"ch": [
"tracer des cercles parfaits",
"mesurer les angles d'un toit",
"trouver le nord du plan",
"lire les mesures selon l'échelle"
],
"bon": 3,
"s": 20
},
{
"q": "Un plan photocopié et agrandi garde la bonne échelle.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "On se fie aux cotes écrites."
},
{
"q": "Remets dans l'ordre pour mesurer une pièce sur un plan.",
"ch": [
"Lire l'échelle dans le cartouche",
"Choisir la bonne face du scalimètre",
"Mesurer d'un mur à l'autre",
"Vérifier avec une cote écrite"
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
"q": "Sur un plan au 1:100, un mur mesure 45 mm. Combien de mètres en réalité?",
"t": "nombre",
"ch": [],
"bon": 4.5,
"s": 45,
"u": "m"
},
{
"q": "Une feuille au 1:50 montre un logement de 8 m de long. Il prend environ combien de cm sur le papier?",
"t": "estim",
"ch": [],
"bon": 16,
"tol": 10,
"u": "cm",
"s": 30,
"expl": "800 cm ÷ 50 = 16 cm."
}
]
},
{
"id": "defi-lecture-plans-batiments-egi-3",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Lecture de plans de bâtiments · Défi+ 3 de 6",
"sujet": "Modules 3 et 4 : échelles, cotes et symboles",
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
"1 1/2 × 3 1/2 po",
"2 × 4 po",
"1 × 3 po",
"2 1/2 × 4 1/2 po"
],
"bon": 0,
"s": 20,
"expl": "Taille nominale avant séchage et rabotage."
},
{
"q": "Sur une règle d'architecte, à 1/4 po = 1 pi, chaque grand intervalle vaut…",
"ch": [
"1 pied réel",
"1 pouce",
"1 mètre",
"1/4 de pied"
],
"bon": 0,
"s": 20
},
{
"q": "Les dessins d'un exercice « pas à l'échelle » : pour trouver une cote manquante, on…",
"ch": [
"devine la cote à partir de la photo",
"calcule à partir des autres cotes",
"mesure le dessin avec la règle",
"prend la cote voisine"
],
"bon": 1,
"s": 20
},
{
"q": "Les cotes d'un plan métrique sont écrites en…",
"ch": [
"mètres, avec deux décimales",
"millimètres, sans le symbole",
"pouces",
"centimètres, avec le symbole cm"
],
"bon": 1,
"s": 20
},
{
"q": "Associe le symbole à ce qu'il représente.",
"t": "paires",
"g": [
"Arc de cercle sur une ouverture",
"Deux traits fins dans un mur",
"Hachures en diagonale",
"Cercle avec un numéro"
],
"ch": [
"Sens d'ouverture de la porte",
"Fenêtre",
"Mur coupé (matériau)",
"Renvoi à un détail"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Une cote se lit de…",
"ch": [
"le bord de la feuille au mur",
"la ligne de rappel à l'autre ligne de rappel",
"n'importe quel point du mur",
"l'extrémité de la flèche au texte"
],
"bon": 1,
"s": 20
},
{
"q": "La légende d'un plan sert à…",
"ch": [
"montrer l'échelle de chaque vue",
"donner le prix de chaque pièce",
"expliquer les symboles utilisés",
"remplacer le devis du projet"
],
"bon": 2,
"s": 20
},
{
"q": "Les cotes écrites ont priorité sur une mesure prise à la règle.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Que trouve-t-on dans un tableau de portes?",
"ch": [
"Le repère (P1, P2…)",
"Les dimensions",
"Le type de quincaillerie",
"Le nom du locataire"
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
"q": "« CC » à côté d'une cote veut dire…",
"ch": [
"cote corrigée",
"centre à centre",
"coin à coin",
"calcul complet"
],
"bon": 1,
"s": 20
},
{
"q": "Trois pièces de suite : 3200 mm, 2850 mm et 4100 mm. Longueur totale en mm?",
"t": "nombre",
"ch": [],
"bon": 10150,
"s": 45,
"u": "mm"
},
{
"q": "Une cote en mm sur un plan métrique s'écrit…",
"ch": [
"en centimètres, avec « cm »",
"toujours avec « mm »",
"en mètres, avec trois décimales",
"sans le symbole « mm »"
],
"bon": 3,
"s": 20
}
]
},
{
"id": "defi-lecture-plans-batiments-egi-4",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Lecture de plans de bâtiments · Défi+ 4 de 6",
"sujet": "Modules 5 et 6 : croquis et architecture",
"couv": "img/couvertures/lecture-plans-batiments-egi.jpg",
"coul": "#534AB7",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Un tableau de spécifications (portes, fenêtres, appareils) se lit grâce…",
"ch": [
"au repère placé sur le plan (P1, F3…)",
"à la couleur de chaque élément sur le plan",
"à l'échelle indiquée sous le dessin",
"au cartouche seulement"
],
"bon": 0,
"s": 20
},
{
"q": "Un bon croquis à main levée, c'est…",
"ch": [
"une photo",
"des traits droits, des angles carrés, des proportions justes",
"un dessin artistique avec des ombres",
"un dessin sans mesures, pour aller vite"
],
"bon": 1,
"s": 20
},
{
"q": "L'erreur classique quand on fait le croquis d'une pièce :",
"ch": [
"dessiner la porte du mauvais côté du mur",
"revenir avec une mesure manquante",
"mesurer deux fois",
"utiliser un crayon au lieu d'un stylo"
],
"bon": 1,
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
"une pente de toit",
"le nord",
"le sens des solives",
"la sortie"
],
"bon": 2,
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
"la couleur de la peinture et le fini du mur",
"ce qu'il y a derrière : montants, fils, tuyaux",
"l'âge du bâtiment et le nom de l'architecte",
"rien d'utile"
],
"bon": 1,
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
},
{
"q": "Associe la partie du croquis à la règle.",
"t": "paires",
"g": [
"Les murs",
"Les mesures",
"Le nord ou un repère",
"Le titre"
],
"ch": [
"Traits doubles, épaisseur constante",
"Prises deux fois, sur place",
"Pour s'orienter plus tard",
"Lieu, date, ton nom"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Dans un croquis de pièce, on mesure d'abord…",
"ch": [
"les prises de courant",
"le tour complet de la pièce",
"le plafond",
"la hauteur des fenêtres"
],
"bon": 1,
"s": 20
},
{
"q": "Une coupe de mur montre…",
"ch": [
"le terrain autour",
"la façade avec les fenêtres",
"les couches du mur, de l'intérieur à l'extérieur",
"le plan d'étage au complet"
],
"bon": 2,
"s": 20
},
{
"q": "Un croquis à main levée doit être à l'échelle exacte.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Il doit être proportionné, avec les cotes écrites."
},
{
"q": "Remets dans l'ordre les couches d'un mur extérieur, de l'intérieur vers l'extérieur.",
"ch": [
"Gypse",
"Pare-vapeur",
"Isolant entre les montants",
"Revêtement extérieur"
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
"q": "Le pare-vapeur se place…",
"ch": [
"du côté froid, sous le revêtement",
"au milieu de l'isolant",
"seulement au plafond",
"du côté chaud du mur (l'intérieur)"
],
"bon": 3,
"s": 20
},
{
"q": "Un montant de 2 × 6 mesure réellement environ combien de pouces de profondeur?",
"t": "estim",
"ch": [],
"bon": 5.5,
"tol": 5,
"u": "po",
"s": 25,
"expl": "Un 2 × 6 fait 1 1/2 × 5 1/2 po."
}
]
},
{
"id": "defi-lecture-plans-batiments-egi-5",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Lecture de plans de bâtiments · Défi+ 5 de 6",
"sujet": "Module 7 : électricité",
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
"il n'apparaît pas",
"en rouge, par-dessus les dispositifs",
"en pointillé bleu, seulement pour les murs",
"en gris pâle sous les dispositifs"
],
"bon": 3,
"s": 20
},
{
"q": "Le tableau du panneau sert à trouver…",
"ch": [
"quel disjoncteur alimente un appareil",
"le prix des luminaires installés",
"la hauteur des prises dans chaque pièce",
"le nombre de portes"
],
"bon": 0,
"s": 20
},
{
"q": "Avant de remplacer un luminaire qui grésille :",
"ch": [
"je coupe le principal du bâtiment sans avertir",
"je mets du ruban",
"je coupe le bon disjoncteur et je vérifie l'absence de tension",
"je le change sous tension"
],
"bon": 2,
"s": 20
},
{
"q": "Sur un plan de plomberie, l'eau froide est souvent en…",
"ch": [
"rouge",
"vert",
"jaune",
"bleu"
],
"bon": 3,
"s": 20
},
{
"q": "Fuite sur une branche d'eau froide : quel robinet fermer d'abord?",
"ch": [
"Celui de l'eau chaude, au chauffe-eau",
"Aucun",
"Le robinet le plus proche avant la fuite",
"Le robinet principal du bâtiment, à l'entrée d'eau"
],
"bon": 2,
"s": 20
},
{
"q": "Un regard de nettoyage (en anglais : cleanout) sert à…",
"ch": [
"fermer l'eau",
"déboucher le drain",
"purger l'air du chauffage",
"mesurer la pression"
],
"bon": 1,
"s": 20
},
{
"q": "Sur une boucle de chauffage à eau chaude, le purgeur sert à…",
"ch": [
"fermer la plinthe",
"ajouter de l'eau chaude",
"évacuer l'air",
"mesurer la température"
],
"bon": 2,
"s": 20
},
{
"q": "Associe le symbole électrique à l'appareil (légende courante).",
"t": "paires",
"g": [
"Cercle avec deux traits",
"S",
"S3",
"Cercle avec X"
],
"ch": [
"Prise de courant double",
"Interrupteur simple",
"Interrupteur trois voies",
"Sortie de luminaire"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Une ligne courbe entre un interrupteur et un luminaire montre…",
"ch": [
"le trajet exact du fil dans le mur",
"la distance entre les deux",
"une prise à installer plus tard",
"quel interrupteur commande la lumière"
],
"bon": 3,
"s": 20
},
{
"q": "Le tableau de panneau indique…",
"ch": [
"quel disjoncteur alimente chaque circuit",
"le prix de l'électricité",
"la marque des luminaires",
"la couleur des fils"
],
"bon": 0,
"s": 20
},
{
"q": "Le « S3 » est un interrupteur trois voies.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15,
"expl": "Deux interrupteurs commandent la même lumière."
},
{
"q": "Avant de toucher un circuit trouvé sur le plan, tu…",
"ch": [
"Coupes le disjoncteur",
"Vérifies l'absence de tension",
"Cadenasses si possible",
"Te fies seulement au plan"
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
"q": "« GFCI » (DDFT) sur le plan, c'est une prise qui…",
"ch": [
"donne plus de puissance",
"s'allume la nuit",
"coupe en cas de fuite vers la terre",
"se commande à distance"
],
"bon": 2,
"s": 20
},
{
"q": "Une prise de courant ordinaire est posée à environ combien de mm du plancher?",
"t": "estim",
"ch": [],
"bon": 300,
"tol": 25,
"u": "mm",
"s": 30,
"expl": "Souvent environ 300 à 400 mm."
},
{
"q": "Le plan E montre le gris pâle de l'architecture pour…",
"ch": [
"montrer les murs coupe-feu",
"indiquer les murs à démolir",
"décorer la feuille",
"situer les appareils dans les pièces"
],
"bon": 3,
"s": 20
}
]
},
{
"id": "defi-lecture-plans-batiments-egi-6",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Lecture de plans de bâtiments · Défi+ 6 de 6",
"sujet": "Modules 8 et 9 : plomberie, chauffage et sécurité",
"couv": "img/couvertures/lecture-plans-batiments-egi.jpg",
"coul": "#534AB7",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
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
"peut être percée librement si on rebouche au plâtre",
"se reconnaît par un trait spécial et ne doit pas être percée sans la refaire conforme",
"n'existe que sur le papier",
"est seulement décorative, pour séparer les pièces"
],
"bon": 1,
"s": 20
},
{
"q": "Qui tient à jour les plans « tel que construit » d'un bâtiment existant?",
"ch": [
"Le locataire de chaque logement",
"Le préposé, au fil des réparations",
"Personne : les plans ne changent plus après la construction",
"La ville"
],
"bon": 1,
"s": 20
},
{
"q": "Un échangeur ou un conduit de ventilation au plan M se trouve souvent…",
"ch": [
"au-dessus du plafond suspendu",
"dans le plancher",
"dans les murs extérieurs",
"sous la dalle"
],
"bon": 0,
"s": 20
},
{
"q": "Un plan de chauffage montre « 3 plinthes » sur une boucle : elles sont…",
"ch": [
"reliées l'une après l'autre",
"électriques, branchées sur un thermostat",
"indépendantes, chacune avec sa propre boucle",
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
"Montrer le trajet des tuyaux de chauffage",
"Montrer la distribution électrique du panneau principal aux panneaux",
"Montrer le mobilier",
"Montrer les pentes de la toiture"
],
"bon": 1,
"s": 20
},
{
"q": "Associe l'abréviation de plomberie.",
"t": "paires",
"g": [
"EF",
"EC",
"D",
"V"
],
"ch": [
"Eau froide",
"Eau chaude",
"Drain (évacuation)",
"Ventilation (évent)"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Sur un plan de plomberie, la flèche sur un drain montre…",
"ch": [
"le robinet à fermer",
"la position du compteur",
"l'entrée d'eau de la ville",
"le sens de l'écoulement"
],
"bon": 3,
"s": 20
},
{
"q": "Le plan d'évacuation d'incendie affiché montre…",
"ch": [
"le prix des extincteurs",
"les plans de la tuyauterie",
"« Vous êtes ici » et les sorties",
"l'horaire du concierge"
],
"bon": 2,
"s": 20
},
{
"q": "Un clapet coupe-feu se trouve dans un conduit qui traverse un mur coupe-feu.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Remets dans l'ordre pour trouver un robinet d'arrêt sur les plans.",
"ch": [
"Trouver la pièce sur le plan d'étage",
"Ouvrir le plan de plomberie",
"Suivre la conduite vers l'amont",
"Repérer le symbole de robinet"
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
"q": "Sur un plan de chauffage, « R » à côté d'une conduite veut dire…",
"ch": [
"réservoir d'eau chaude",
"radiateur électrique",
"robinet à fermer",
"retour vers la chaudière"
],
"bon": 3,
"s": 20
},
{
"q": "La pente d'un drain horizontal de 3 po : environ combien de % (1/4 po par pied)?",
"t": "estim",
"ch": [],
"bon": 2,
"tol": 15,
"u": "%",
"s": 30,
"expl": "1/4 po par pied, c'est environ 2 %."
}
]
},
{
"id": "defi-lecture-plans-devis-c6-1",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Lecture de plans et devis (C6) · Défi+ 1 de 6",
"sujet": "Modules 1 et 2 : le monde des plans et les vues",
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
"Page 102 du devis",
"Architecture, coupe, feuille 2",
"Plomberie, plan d'étage, feuille 2",
"Structure, détail 102"
],
"bon": 2,
"s": 20
},
{
"q": "Le cartouche se trouve…",
"ch": [
"en bas à droite de chaque feuille",
"en haut à gauche de la première feuille",
"dans le devis seulement",
"au verso de la dernière feuille"
],
"bon": 0,
"s": 20
},
{
"q": "Les plans « tel que construit » montrent…",
"ch": [
"ce qui était prévu au départ par l'architecte",
"le prix final des travaux, poste par poste",
"les plans de la ville",
"les changements faits sur le chantier"
],
"bon": 3,
"s": 20
},
{
"q": "Le plan de structure montre…",
"ch": [
"les prises de courant et les luminaires",
"le mobilier",
"ce qui porte le bâtiment : on ne le perce pas sans autorisation",
"les couleurs de peinture et les finis des murs"
],
"bon": 2,
"s": 20
},
{
"q": "Le devis, c'est…",
"ch": [
"les textes qui décrivent la qualité des matériaux et la façon d'exécuter",
"le reçu du fournisseur avec la liste des matériaux",
"le dessin du toit et des pentes",
"la liste des employés"
],
"bon": 0,
"s": 20
},
{
"q": "Plier un plan en accordéon : où doit se retrouver le cartouche?",
"ch": [
"Peu importe",
"À l'intérieur, pour le protéger",
"Visible, sur le dessus",
"Coupé, pour gagner de la place"
],
"bon": 2,
"s": 20
},
{
"q": "Dans les trois vues d'un objet, la vue de dessus se place…",
"ch": [
"à gauche de la vue de face",
"au-dessus de la vue de face",
"n'importe où",
"sous la vue de côté"
],
"bon": 1,
"s": 20
},
{
"q": "Associe le document au contenu.",
"t": "paires",
"g": [
"Plans",
"Devis",
"Addenda",
"Plans tel que construit"
],
"ch": [
"Le dessin de l'ouvrage",
"La qualité des matériaux et l'exécution",
"Les changements avant la soumission",
"Ce qui a été vraiment installé"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Le plombier consulte surtout les feuilles…",
"ch": [
"E (électricité) d'abord",
"A (architecture) seulement",
"S (structure) seulement",
"P (plomberie) et M (mécanique)"
],
"bon": 3,
"s": 20
},
{
"q": "La vue isométrique montre la tuyauterie…",
"ch": [
"coupée en deux",
"de face, sans profondeur",
"vue d'en haut, à plat",
"en 3 dimensions, à 30°"
],
"bon": 3,
"s": 20
},
{
"q": "En cas de conflit, le devis a souvent priorité sur le plan.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15,
"expl": "Les documents précisent l'ordre de priorité."
},
{
"q": "Avant de couper, le plombier vérifie sur les plans…",
"ch": [
"Les cotes",
"Les diamètres",
"Les pentes",
"La couleur des murs"
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
"q": "Le schéma de colonne montre…",
"ch": [
"le plan d'étage au 1:50",
"la façade du bâtiment",
"le terrain et les égouts de la ville",
"chaque étage sur une ligne, sans échelle"
],
"bon": 3,
"s": 20
},
{
"q": "Un projet de 4 étages : combien de feuilles P environ, si chaque étage a sa feuille plus 2 feuilles de détails?",
"t": "estim",
"ch": [],
"bon": 6,
"tol": 20,
"u": "feuilles",
"s": 25,
"expl": "4 + 2 = 6."
},
{
"q": "Le numéro de révision dans le cartouche sert à…",
"ch": [
"savoir si on a la dernière version",
"connaître l'échelle du dessin",
"compter les pages du devis",
"classer par ordre alphabétique"
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
"titre": "Lecture de plans et devis (C6) · Défi+ 2 de 6",
"sujet": "Modules 2 et 3 : les vues et les échelles",
"couv": "img/couvertures/lecture-plans-devis-c6.jpg",
"coul": "#854F0B",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Les hauteurs se mesurent à partir…",
"ch": [
"du plancher fini",
"de la dalle de béton",
"du plafond",
"du sous-plancher"
],
"bon": 0,
"s": 20
},
{
"q": "Sur une coupe, les flèches au bout du trait de coupe indiquent…",
"ch": [
"l'entrée",
"la direction du nord géographique",
"le sens du regard",
"la pente du terrain sous le bâtiment"
],
"bon": 2,
"s": 20
},
{
"q": "Un cercle de détail sur une coupe sert à…",
"ch": [
"indiquer une colonne de structure à cet endroit",
"marquer une sortie de secours dans le mur",
"décorer le plan",
"renvoyer à un zoom d'une petite partie"
],
"bon": 3,
"s": 20
},
{
"q": "Sur le papier isométrique, les longueurs et les profondeurs sont tracées à…",
"ch": [
"60°",
"30°",
"90°",
"45°"
],
"bon": 1,
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
"le tableau électrique",
"le bâtiment sur son terrain",
"le détail d'un raccord",
"l'intérieur des murs"
],
"bon": 1,
"s": 20
},
{
"q": "Associe la vue à ce qu'elle montre.",
"t": "paires",
"g": [
"Plan",
"Élévation",
"Coupe",
"Isométrie"
],
"ch": [
"Vu d'en haut",
"Vu de face",
"Vu de l'intérieur, tranché",
"En 3D, à 30°"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "À l'échelle 1/4 po = 1 pi, 2 po sur le plan égalent…",
"ch": [
"8 pieds",
"16 pieds",
"4 pieds",
"2 pieds"
],
"bon": 0,
"s": 20
},
{
"q": "Une échelle impériale courante en plomberie est…",
"ch": [
"1/16 po = 1 pi",
"1/4 po = 1 pi",
"1 po = 100 pi",
"1 po = 1 pi"
],
"bon": 1,
"s": 20
},
{
"q": "L'isométrie respecte toujours l'échelle des longueurs.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "On s'y fie pour le trajet, pas pour mesurer."
},
{
"q": "Remets dans l'ordre pour faire l'isométrie d'une salle de bain.",
"ch": [
"Tracer le drain principal",
"Ajouter les branchements d'appareils",
"Ajouter les évents",
"Écrire diamètres et pentes"
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
"q": "Au 1/4 po = 1 pi, une conduite mesure 3 1/2 po sur le plan. Combien de pieds?",
"t": "nombre",
"ch": [],
"bon": 14,
"s": 45,
"u": "pi"
},
{
"q": "Au 1:50, une salle de bain de 2,4 m prend environ combien de mm sur le plan?",
"t": "estim",
"ch": [],
"bon": 48,
"tol": 10,
"u": "mm",
"s": 30,
"expl": "2400 ÷ 50 = 48 mm."
}
]
},
{
"id": "defi-lecture-plans-devis-c6-3",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Lecture de plans et devis (C6) · Défi+ 3 de 6",
"sujet": "Modules 3 et 4 : échelles, cotes et symboles",
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
"1 1/2 × 3 1/2 po",
"2 × 4 po",
"1 × 3 po",
"2 1/2 × 4 1/2 po"
],
"bon": 0,
"s": 20,
"expl": "Taille nominale avant séchage et rabotage."
},
{
"q": "Sur une règle d'architecte, à 1/4 po = 1 pi, chaque grand intervalle vaut…",
"ch": [
"1 pied réel",
"1 pouce",
"1 mètre",
"1/4 de pied"
],
"bon": 0,
"s": 20
},
{
"q": "Les dessins d'un exercice « pas à l'échelle » : pour trouver une cote manquante, on…",
"ch": [
"devine la cote à partir de la photo",
"calcule à partir des autres cotes",
"mesure le dessin avec la règle",
"prend la cote voisine"
],
"bon": 1,
"s": 20
},
{
"q": "Les cotes d'un plan métrique sont écrites en…",
"ch": [
"mètres, avec deux décimales",
"millimètres, sans le symbole",
"pouces",
"centimètres, avec le symbole cm"
],
"bon": 1,
"s": 20
},
{
"q": "Associe l'abréviation au plan de plomberie.",
"t": "paires",
"g": [
"RN (CO)",
"DP",
"WC",
"LAV"
],
"ch": [
"Regard de nettoyage",
"Drain de plancher",
"Toilette",
"Lavabo"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "La cote d'élévation d'un drain indique…",
"ch": [
"sa hauteur par rapport à un repère",
"son diamètre",
"sa longueur totale",
"sa pente en %"
],
"bon": 0,
"s": 20
},
{
"q": "Le repère « P-3 » sur le plan renvoie…",
"ch": [
"à la page 3 du devis",
"au 3e étage",
"au tableau des appareils",
"à une pente de 3 %"
],
"bon": 2,
"s": 20
},
{
"q": "Une ligne pleine épaisse en plomberie montre souvent le drain.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15,
"expl": "Toujours vérifier la légende du projet."
},
{
"q": "Le tableau des appareils donne pour chaque appareil…",
"ch": [
"Le modèle",
"Les diamètres EF et EC",
"Le diamètre d'évacuation",
"Le nom de l'installateur"
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
"q": "Le « DN » d'un tuyau, c'est…",
"ch": [
"son épaisseur de paroi",
"son diamètre nominal (un nom, pas une mesure)",
"son diamètre extérieur exact",
"sa longueur standard"
],
"bon": 1,
"s": 20
},
{
"q": "Longueur de coupe : 1200 mm centre à centre, deux prises de 20 mm. Combien de mm?",
"t": "nombre",
"ch": [],
"bon": 1160,
"s": 45,
"u": "mm"
},
{
"q": "Une cote « ± » sur un plan veut dire…",
"ch": [
"une erreur à corriger",
"à vérifier sur le chantier",
"une pièce optionnelle",
"une cote exacte au mm"
],
"bon": 1,
"s": 20
}
]
},
{
"id": "defi-lecture-plans-devis-c6-4",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Lecture de plans et devis (C6) · Défi+ 4 de 6",
"sujet": "Modules 5 et 6 : croquis et plans de plomberie",
"couv": "img/couvertures/lecture-plans-devis-c6.jpg",
"coul": "#854F0B",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Un tableau de spécifications (portes, fenêtres, appareils) se lit grâce…",
"ch": [
"au repère placé sur le plan (P1, F3…)",
"à la couleur de chaque élément sur le plan",
"à l'échelle indiquée sous le dessin",
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
"montre le mobilier et les appareils de chaque étage",
"est toujours dessiné à 1:50, comme le plan d'étage",
"remplace le devis",
"ne respecte pas l'échelle : chaque étage est une ligne"
],
"bon": 3,
"s": 20
},
{
"q": "Un tuyau mal supporté…",
"ch": [
"s'affaisse, fait des points bas et du bruit",
"n'a aucun problème",
"dure plus longtemps parce qu'il bouge librement",
"se dilate moins, car il n'est pas retenu"
],
"bon": 0,
"s": 20
},
{
"q": "Contourner un obstacle de 150 mm avec deux coudes de 45° : le tuyau entre les deux est…",
"ch": [
"horizontal",
"vertical",
"inutile",
"une diagonale"
],
"bon": 3,
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
"l'évent",
"le clapet antiretour",
"le robinet d'arrêt",
"le siphon"
],
"bon": 1,
"s": 20
},
{
"q": "Le tableau des appareils (P-601) donne pour chaque repère…",
"ch": [
"la couleur et le fini de chaque appareil",
"le prix et le fournisseur de chaque appareil",
"les diamètres EF, EC et évacuation",
"le fournisseur seulement"
],
"bon": 2,
"s": 20
},
{
"q": "Associe l'élément de croquis de plomberie.",
"t": "paires",
"g": [
"Drain",
"Évent",
"Eau froide",
"Eau chaude"
],
"ch": [
"Trait plein épais",
"Trait pointillé",
"Trait plein fin avec « EF »",
"Trait plein fin avec « EC »"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Un bon croquis de tuyauterie sur le chantier indique…",
"ch": [
"les diamètres, les pentes et les cotes",
"la couleur des tuyaux",
"seulement le trajet, sans mesures",
"le nom des locataires"
],
"bon": 0,
"s": 20
},
{
"q": "Un siphon doit apparaître sur le plan pour…",
"ch": [
"le compteur d'eau seulement",
"chaque colonne d'eau chaude",
"chaque appareil sanitaire",
"chaque robinet d'eau froide"
],
"bon": 2,
"s": 20
},
{
"q": "Le diamètre d'un drain peut diminuer en descendant.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "Dans le sens de l'écoulement, il ne diminue jamais."
},
{
"q": "Remets dans l'ordre l'eau d'un lavabo vers l'égout.",
"ch": [
"Lavabo",
"Siphon",
"Branchement d'évacuation",
"Colonne de chute"
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
"q": "Le collecteur principal se trouve…",
"ch": [
"au plus bas, vers la sortie du bâtiment",
"à côté du chauffe-eau",
"dans chaque logement",
"au toit, près des évents"
],
"bon": 0,
"s": 20
},
{
"q": "Un lavabo a un siphon de combien de pouces (diamètre courant)?",
"t": "estim",
"ch": [],
"bon": 1.25,
"tol": 10,
"u": "po",
"s": 25,
"expl": "1 1/4 po."
}
]
},
{
"id": "defi-lecture-plans-devis-c6-5",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Lecture de plans et devis (C6) · Défi+ 5 de 6",
"sujet": "Modules 6 et 7 : plomberie et chauffage",
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
"La recirculation",
"L'évacuation"
],
"bon": 3,
"s": 20
},
{
"q": "Où l'eau entre-t-elle et où converge toute l'évacuation d'un bâtiment?",
"ch": [
"Au 2e étage",
"Au sous-sol",
"Au toit",
"Dans la cuisine"
],
"bon": 1,
"s": 20
},
{
"q": "Un toit plat se vide par…",
"ch": [
"les murs",
"l'évent",
"des gouttières seulement",
"des drains de toit (DT)"
],
"bon": 3,
"s": 20
},
{
"q": "Dans un chauffage à eau chaude, l'eau chauffée sort par le haut : c'est…",
"ch": [
"l'évent",
"le drain",
"l'alimentation (AL)",
"le retour (RET)"
],
"bon": 2,
"s": 20
},
{
"q": "Le circulateur…",
"ch": [
"pousse l'eau dans la boucle",
"purge l'air du réseau par le haut",
"chauffe l'eau en la faisant tourner dans la boucle",
"mesure la pression"
],
"bon": 0,
"s": 20
},
{
"q": "Dans un chauffage à vapeur, la vapeur monte au radiateur…",
"ch": [
"toute seule, sans pompe",
"avec un ventilateur",
"avec un circulateur",
"par gravité vers le bas"
],
"bon": 0,
"s": 20
},
{
"q": "Un tuyau de cuivre qui chauffe…",
"ch": [
"rapetisse",
"devient plus mince",
"ne change pas",
"s'allonge (dilatation)"
],
"bon": 3,
"s": 20
},
{
"q": "Associe l'élément de chauffage au plan.",
"t": "paires",
"g": [
"Chaudière",
"Circulateur",
"Vase d'expansion",
"Purgeur d'air"
],
"ch": [
"Chauffe l'eau",
"Fait circuler l'eau",
"Absorbe la dilatation",
"Enlève l'air au point haut"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Un réseau de chauffage « bitube » a…",
"ch": [
"deux chaudières en parallèle",
"un seul tuyau en boucle",
"deux circulateurs obligatoires",
"un tuyau d'aller et un tuyau de retour"
],
"bon": 3,
"s": 20
},
{
"q": "Le purgeur d'air automatique se place…",
"ch": [
"à la sortie du chauffe-eau",
"aux points hauts du réseau",
"sur l'entrée d'eau de la ville",
"aux points bas, près du drain"
],
"bon": 1,
"s": 20
},
{
"q": "Sur un plan de chauffage, les plinthes sont souvent numérotées par zone.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Que trouve-t-on dans le tableau M de chauffage?",
"ch": [
"Le modèle de chaudière",
"Le débit",
"La puissance",
"Le salaire du plombier"
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
"q": "Une soupape de sûreté de chaudière résidentielle est souvent réglée à…",
"ch": [
"5 psi",
"30 psi",
"75 psi",
"150 psi"
],
"bon": 1,
"s": 20
},
{
"q": "Pression d'une chaudière à eau chaude résidentielle à froid : environ combien de psi?",
"t": "estim",
"ch": [],
"bon": 12,
"tol": 25,
"u": "psi",
"s": 30,
"expl": "Environ 12 à 15 psi."
},
{
"q": "Un clapet antiretour sur le réseau de chauffage sert à…",
"ch": [
"remplir la chaudière",
"purger l'air",
"empêcher l'eau de circuler à l'envers",
"augmenter la pression"
],
"bon": 2,
"s": 20
}
]
},
{
"id": "defi-lecture-plans-devis-c6-6",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Lecture de plans et devis (C6) · Défi+ 6 de 6",
"sujet": "Module 8 : devis et estimation",
"couv": "img/couvertures/lecture-plans-devis-c6.jpg",
"coul": "#854F0B",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Les divisions du devis : la plomberie est la division…",
"ch": [
"01",
"26",
"09",
"22"
],
"bon": 3,
"s": 20
},
{
"q": "Les changements demandés par le client et l'architecte pendant le projet se trouvent dans…",
"ch": [
"la légende",
"le cartouche de la première feuille",
"les addenda et avis de changement",
"le schéma de colonne de chaque étage"
],
"bon": 2,
"s": 20
},
{
"q": "Les tuyaux se vendent…",
"ch": [
"en longueurs entières",
"au poids",
"à l'unité de raccord",
"au centimètre exact"
],
"bon": 0,
"s": 20
},
{
"q": "Le fournisseur donne une liste de prix, souvent avec…",
"ch": [
"aucun prix",
"une taxe double",
"un rabais au client seulement",
"un escompte pour l'entrepreneur"
],
"bon": 3,
"s": 20
},
{
"q": "Sur un plan de chauffage, AL et RET voyagent…",
"ch": [
"dans le même tuyau",
"séparément sur des étages différents",
"dans l'évent",
"ensemble, deux tuyaux d'un étage à l'autre"
],
"bon": 3,
"s": 20
},
{
"q": "Le tableau M-601 donne, pour chaque repère de chauffage…",
"ch": [
"le nombre de portes à franchir pour y accéder",
"le modèle et les caractéristiques de l'équipement",
"le salaire du plombier qui fait l'installation",
"les heures d'ouverture"
],
"bon": 1,
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
},
{
"q": "Associe la section du devis.",
"t": "paires",
"g": [
"Division 22",
"Division 23",
"Division 26",
"Division 21"
],
"ch": [
"Plomberie",
"Chauffage, ventilation, climatisation",
"Électricité",
"Protection incendie (gicleurs)"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Le relevé des quantités (« take-off »), c'est…",
"ch": [
"écrire le devis à la place de l'ingénieur",
"lire seulement le cartouche",
"visiter le chantier fini",
"compter tous les tuyaux et raccords sur les plans"
],
"bon": 3,
"s": 20
},
{
"q": "Dans une estimation, on ajoute un pourcentage de pertes pour…",
"ch": [
"payer les vacances de l'équipe",
"le profit de l'entrepreneur seulement",
"les coupes, les erreurs et les retailles",
"les taxes du gouvernement"
],
"bon": 2,
"s": 20
},
{
"q": "Le devis peut exiger une marque précise « ou l'équivalent approuvé ».",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Remets dans l'ordre une estimation.",
"ch": [
"Lire plans et devis",
"Faire le relevé des quantités",
"Mettre les prix et la main-d'œuvre",
"Ajouter pertes, frais et profit"
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
"q": "120 pieds de cuivre + 10 % de pertes. Combien de pieds commander?",
"t": "nombre",
"ch": [],
"bon": 132,
"s": 45,
"u": "pi"
},
{
"q": "Un plombier compagnon gagne environ combien de $ l'heure au Québec (taux de la CCQ)?",
"t": "estim",
"ch": [],
"bon": 45,
"tol": 20,
"u": "$",
"s": 30,
"expl": "Environ 45 à 50 $ l'heure selon le secteur et l'année."
}
]
},
{
"id": "defi-plomberie-chauffage-1",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Plomberie et chauffage (EGI) · Défi+ 1 de 6",
"sujet": "Modules 1 et 2 : rôle du préposé et maths de la tuyauterie",
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
"j'attends la semaine prochaine pour voir si ça empire",
"je le règle seul, sans déranger personne",
"je l'ignore",
"le superviseur fait appel au spécialiste (plombier, mécanicien)"
],
"bon": 3,
"s": 20
},
{
"q": "Un joint étanche commence par…",
"ch": [
"beaucoup de soudure pour boucher les trous",
"un tuyau sale",
"une coupe d'équerre et un tuyau propre et ébavuré",
"une coupe en biais pour que le tuyau entre mieux"
],
"bon": 2,
"s": 20
},
{
"q": "La pince à sertir PEX se vérifie avec…",
"ch": [
"un niveau",
"un multimètre",
"le calibre « go / no-go »",
"un ruban à mesurer"
],
"bon": 2,
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
"5/8",
"7/8",
"3/4",
"1/2"
],
"bon": 2,
"s": 20
},
{
"q": "Les tuyaux de drainage horizontaux…",
"ch": [
"montent légèrement vers l'égout de la rue",
"sont verticaux",
"descendent légèrement pour que l'eau coule par gravité",
"sont toujours à niveau, pour ne pas forcer la pompe"
],
"bon": 2,
"s": 20
},
{
"q": "Plus une colonne d'eau est haute…",
"ch": [
"plus l'eau est chaude",
"rien ne change",
"moins il y a de pression",
"plus la pression au bas est forte"
],
"bon": 3,
"s": 20
},
{
"q": "Un tuyau « de 3/4 » : ce 3/4, c'est…",
"ch": [
"son diamètre nominal (un nom, pas une mesure exacte)",
"son épaisseur",
"son diamètre extérieur exact, en pouces",
"sa longueur standard, en pieds"
],
"bon": 0,
"s": 20
},
{
"q": "Un problème « jaune » dans la grille du préposé :",
"ch": [
"j'appelle les pompiers pour qu'ils vérifient",
"je vérifie, je sécurise et j'avise mon superviseur",
"je le règle sans le dire",
"je l'ignore : il n'y a pas d'urgence"
],
"bon": 1,
"s": 20
},
{
"q": "1/2 + 1/4 de pouce =",
"ch": [
"2/6 po",
"1/6 po",
"1 po",
"3/4 po"
],
"bon": 3,
"s": 20
},
{
"q": "La bavure laissée à l'intérieur du tuyau…",
"ch": [
"n'a aucun effet",
"freine l'eau et use le tuyau",
"augmente la pression",
"aide le joint"
],
"bon": 1,
"s": 20
},
{
"q": "Associe la couleur de la grille du préposé.",
"t": "paires",
"g": [
"Vert",
"Jaune",
"Rouge",
"Noir (urgence)"
],
"ch": [
"Je le fais seul",
"Je vérifie, je sécurise et j'avise",
"Le spécialiste intervient",
"J'appelle les secours"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "3/8 po + 5/8 po = combien de pouces?",
"t": "nombre",
"ch": [],
"bon": 1,
"s": 40,
"u": "po"
},
{
"q": "Un pied mesure environ combien de mm?",
"t": "estim",
"ch": [],
"bon": 305,
"tol": 5,
"u": "mm",
"s": 25,
"expl": "1 pi = 304,8 mm."
}
]
},
{
"id": "defi-plomberie-chauffage-2",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Plomberie et chauffage (EGI) · Défi+ 2 de 6",
"sujet": "Modules 3 et 4 : matériaux et soudure",
"couv": "img/couvertures/plomberie-chauffage.jpg",
"coul": "#B3261E",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Le PEX se raccorde avec…",
"ch": [
"une pince à sertir ou un expandeur",
"de la colle ABS appliquée sur le tuyau",
"de la soudure à l'étain, comme le cuivre",
"du filetage"
],
"bon": 0,
"s": 20
},
{
"q": "Pourquoi les tuyaux de drainage ne sont jamais à niveau?",
"ch": [
"Pour l'esthétique : ça suit la pente du plafond",
"Pour économiser du tuyau sur les longues distances",
"C'est une erreur",
"Pour que l'eau et les solides coulent par gravité"
],
"bon": 3,
"s": 20
},
{
"q": "Dans un immeuble, la pression est plus forte…",
"ch": [
"pareille partout",
"au toit",
"aux étages du bas",
"au dernier étage"
],
"bon": 2,
"s": 20
},
{
"q": "Raccorder de l'acier galvanisé directement à du cuivre :",
"ch": [
"augmente la pression",
"rend l'eau plus douce pour les appareils",
"crée une pile : corrosion galvanique",
"aucun problème si les filets sont bien serrés"
],
"bon": 2,
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
"souder plus vite pour que le bois chauffe moins",
"protéger avec un écran ignifuge",
"mouiller le bois avec un vaporisateur",
"rien de spécial"
],
"bon": 1,
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
"les écoles",
"la santé et la sécurité dans les écoles",
"l'industrie de la construction",
"les loyers et les baux résidentiels"
],
"bon": 2,
"s": 20
},
{
"q": "À 45°, si le déplacement vertical est de 6 po, le déplacement horizontal est…",
"ch": [
"8,5 po",
"12 po",
"3 po",
"6 po"
],
"bon": 3,
"s": 20
},
{
"q": "Sur un plan, les longueurs sont données…",
"ch": [
"bout à bout, d'une extrémité à l'autre",
"au hasard",
"centre à centre (CC)",
"en mètres, arrondis au plus près"
],
"bon": 2,
"s": 20
},
{
"q": "Longueur de coupe d'un tuyau :",
"ch": [
"CC ÷ 2",
"CC + prises des raccords",
"CC × 2, pour les deux raccords",
"CC − prises des raccords"
],
"bon": 3,
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
"q": "Brasage tendre : le flux sert à…",
"ch": [
"nettoyer et protéger le cuivre pour que la soudure coule",
"colorer le cuivre pour voir où on a soudé",
"remplacer la soudure",
"refroidir le joint plus vite après le brasage"
],
"bon": 0,
"s": 20
},
{
"q": "Associe le matériau au raccord.",
"t": "paires",
"g": [
"Cuivre",
"PEX",
"ABS",
"Acier"
],
"ch": [
"Brasage",
"Sertissage ou expansion",
"Colle à solvant",
"Filetage"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Remets dans l'ordre un brasage tendre.",
"ch": [
"Couper et ébavurer",
"Nettoyer et poser le flux",
"Chauffer le raccord",
"Faire couler la soudure"
],
"bon": [
0,
1,
2,
3
],
"s": 40,
"t": "ordre"
}
]
},
{
"id": "defi-plomberie-chauffage-3",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Plomberie et chauffage (EGI) · Défi+ 3 de 6",
"sujet": "Module 4 : raccords et coupes",
"couv": "img/couvertures/plomberie-chauffage.jpg",
"coul": "#B3261E",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Après une soudure, on laisse refroidir le joint…",
"ch": [
"sans le bouger",
"en le tordant",
"en le frappant",
"dans la glace tout de suite"
],
"bon": 0,
"s": 20
},
{
"q": "Le té sanitaire sert à…",
"ch": [
"fermer l'eau d'une branche sans robinet",
"mesurer la pression dans la colonne",
"chauffer l'eau",
"raccorder un renvoi dans un drain en guidant l'eau vers le bas"
],
"bon": 3,
"s": 20
},
{
"q": "Un raccord fileté se scelle avec…",
"ch": [
"rien",
"de la colle ABS sur les filets",
"de la soudure tendre, comme le cuivre",
"du ruban ou de la pâte à filets"
],
"bon": 3,
"s": 20
},
{
"q": "La prise d'un raccord, c'est…",
"ch": [
"la longueur où le tuyau entre dans le raccord",
"le diamètre intérieur du raccord",
"la couleur",
"le prix du raccord selon sa grosseur"
],
"bon": 0,
"s": 20
},
{
"q": "Ton montage dans une ossature de bois : avant de souder près du bois…",
"ch": [
"mouiller les murs et le plancher autour",
"fermer la lumière",
"rien : la flamme est trop petite pour enflammer le bois",
"protection ignifuge et extincteur à portée"
],
"bon": 3,
"s": 20
},
{
"q": "Pour le préposé, le plus important avec les robinets :",
"ch": [
"savoir lequel fermer et où il est",
"les peindre",
"connaître leur prix",
"les changer chaque année"
],
"bon": 0,
"s": 20
},
{
"q": "Si un clapet empêche l'eau de retourner vers la rue, la dilatation de l'eau chaude…",
"ch": [
"refroidit l'eau dans le réservoir",
"n'a aucun effet, l'eau ne se dilate presque pas",
"fait monter la pression : on installe un réservoir d'expansion",
"vide le chauffe-eau"
],
"bon": 2,
"s": 20
},
{
"q": "Le siphon sert à…",
"ch": [
"chauffer l'eau",
"accélérer l'eau dans le renvoi",
"filtrer l'eau avant qu'elle aille à l'égout",
"garder une garde d'eau qui bloque les gaz d'égout"
],
"bon": 3,
"s": 20
},
{
"q": "La ventilation (évent) du réseau de drainage sert à…",
"ch": [
"évacuer la chaleur des eaux chaudes",
"faire du bruit",
"laisser entrer l'air pour que les siphons ne se vident pas",
"augmenter la pression d'eau aux robinets"
],
"bon": 2,
"s": 20
},
{
"q": "Un regard de nettoyage donne accès…",
"ch": [
"au chauffe-eau",
"à l'intérieur du drain pour un furet ou une caméra",
"à l'eau chaude du bâtiment pour la purger",
"au compteur d'eau pour le lire"
],
"bon": 1,
"s": 20
},
{
"q": "Un seul appareil se vide mal; les autres vont bien :",
"ch": [
"l'égout de la ville est bouché devant l'immeuble",
"le toit fuit et remplit le drain",
"le chauffe-eau est brisé",
"le problème est dans son renvoi ou son siphon"
],
"bon": 3,
"s": 20
},
{
"q": "L'appareil qui génère le plus de bons de travail dans un immeuble :",
"ch": [
"la toilette",
"le chauffe-eau",
"le lavabo",
"la douche"
],
"bon": 0,
"s": 20
},
{
"q": "Associe le raccord à son usage.",
"t": "paires",
"g": [
"Coude 90°",
"Té",
"Union",
"Réduit"
],
"ch": [
"Changer de direction",
"Faire une branche",
"Démonter facilement",
"Changer de diamètre"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Longueur de coupe : 36 po centre à centre, deux prises de 1/2 po. Combien de pouces?",
"t": "nombre",
"ch": [],
"bon": 35,
"s": 45,
"u": "po"
},
{
"q": "Une coupe en biais fait un joint plus étanche.",
"ch": [
"Vrai",
"Faux"
],
"bon": 1,
"s": 15,
"expl": "La coupe doit être d'équerre."
}
]
},
{
"id": "defi-plomberie-chauffage-4",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Plomberie et chauffage (EGI) · Défi+ 4 de 6",
"sujet": "Modules 5 à 7 : alimentation, drainage et appareils",
"couv": "img/couvertures/plomberie-chauffage.jpg",
"coul": "#B3261E",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Robinet à cartouche : l'eau chaude est…",
"ch": [
"à droite",
"au centre",
"à gauche",
"en haut"
],
"bon": 2,
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
"q": "Un coup de bélier, c'est…",
"ch": [
"une fuite lente qui fait un bruit de goutte",
"une eau trop chaude qui fait vibrer les tuyaux",
"un drain bouché",
"un claquement quand l'eau s'arrête net"
],
"bon": 3,
"s": 20
},
{
"q": "Un siphon qui perd sa garde d'eau laisse passer…",
"ch": [
"l'eau chaude",
"rien",
"la pression",
"les gaz d'égout"
],
"bon": 3,
"s": 20
},
{
"q": "Une toilette coule sans arrêt : test simple…",
"ch": [
"ajouter du sel dans le réservoir",
"fermer l'évent de la toilette",
"le colorant dans le réservoir",
"changer le siège"
],
"bon": 2,
"s": 20
},
{
"q": "Plusieurs appareils d'un étage se vident mal en même temps :",
"ch": [
"c'est normal quand plusieurs appareils coulent",
"c'est chaque siphon, un à la fois",
"le problème est plus loin, dans la colonne ou le collecteur",
"c'est l'eau chaude"
],
"bon": 2,
"s": 20
},
{
"q": "Robinet qui coule : on coupe d'abord…",
"ch": [
"rien",
"le chauffage de la pièce",
"l'électricité du logement au panneau",
"l'eau et on purge la pression"
],
"bon": 3,
"s": 20
},
{
"q": "Le chauffe-eau au gaz évacue ses gaz…",
"ch": [
"par l'eau chaude",
"dans la pièce, par une grille au bas du réservoir",
"par l'égout, avec l'eau de condensation",
"par un tube central avec une chicane, vers la cheminée"
],
"bon": 3,
"s": 20
},
{
"q": "Tester une soupape T&P :",
"ch": [
"la dévisser pour voir si elle est rouillée",
"lever le levier quelques secondes, un seau sous la sortie",
"la peindre",
"boucher la sortie et monter la température"
],
"bon": 1,
"s": 20
},
{
"q": "L'anode d'un chauffe-eau…",
"ch": [
"règle la température maximale de l'eau",
"chauffe l'eau au fond du réservoir",
"se sacrifie pour protéger le réservoir de la corrosion",
"mesure la pression"
],
"bon": 2,
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
},
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
"purge l'air du réseau automatiquement",
"absorbe le surplus de volume de l'eau chaude",
"chauffe l'eau avant qu'elle entre dans la chaudière",
"alimente le brûleur"
],
"bon": 1,
"s": 20
},
{
"q": "Associe l'appareil à son siphon (diamètre courant).",
"t": "paires",
"g": [
"Lavabo",
"Baignoire",
"Toilette",
"Douche"
],
"ch": [
"Siphon de 1 1/4 po",
"Siphon de 1 1/2 po",
"Siphon intégré à la cuvette",
"Siphon de 2 po"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Une toilette récente utilise environ combien de litres par chasse?",
"t": "estim",
"ch": [],
"bon": 4.8,
"tol": 25,
"u": "L",
"s": 30,
"expl": "Environ 4,8 L (6 L pour les modèles un peu plus vieux)."
}
]
},
{
"id": "defi-plomberie-chauffage-5",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Plomberie et chauffage (EGI) · Défi+ 5 de 6",
"sujet": "Modules 8 à 10 : chauffe-eau, chaudière et brûleur",
"couv": "img/couvertures/plomberie-chauffage.jpg",
"coul": "#B3261E",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Les radiateurs en fonte…",
"ch": [
"fonctionnent seulement à la vapeur basse pression",
"chauffent lentement et gardent la chaleur longtemps",
"ne gardent pas la chaleur",
"chauffent instantanément et refroidissent aussi vite"
],
"bon": 1,
"s": 20
},
{
"q": "Le gicleur d'un brûleur à l'huile…",
"ch": [
"mesure la flamme et coupe si elle s'éteint",
"transforme le mazout en fin brouillard",
"pompe l'eau",
"allume l'étincelle qui enflamme le mazout"
],
"bon": 1,
"s": 20
},
{
"q": "La cellule CdS du brûleur…",
"ch": [
"chauffe le mazout",
"règle la température de l'eau de la chaudière",
"voit la flamme : sa résistance baisse à la lumière",
"mesure la pression du mazout à la pompe"
],
"bon": 2,
"s": 20
},
{
"q": "L'entretien annuel du brûleur se fait…",
"ch": [
"avant la saison de chauffage, par un mécanicien certifié",
"jamais",
"en plein hiver, par le préposé, quand ça brise",
"chaque semaine, en changeant le gicleur"
],
"bon": 0,
"s": 20
},
{
"q": "Chauffe-eau électrique qui ne chauffe plus : on vérifie…",
"ch": [
"le disjoncteur, l'ECO et les éléments (hors tension)",
"la couleur de l'eau et le bruit du réservoir",
"le siphon du drain sous la soupape",
"le drain"
],
"bon": 0,
"s": 20
},
{
"q": "Purger l'air d'un radiateur se fait…",
"ch": [
"par le robinet du bas",
"par le purgeur en haut",
"jamais",
"par la chaudière"
],
"bon": 1,
"s": 20
},
{
"q": "Une plinthe à eau chaude chauffe surtout par…",
"ch": [
"conduction : la chaleur passe dans le plancher",
"ventilateur",
"rayonnement seulement, comme un poêle",
"convection : l'air chaud monte entre les ailettes"
],
"bon": 3,
"s": 20
},
{
"q": "La pompe à mazout du brûleur…",
"ch": [
"vide la chaudière",
"allume la flamme avec une étincelle",
"aspire le mazout et le pousse sous pression vers le gicleur",
"chauffe le mazout avant qu'il arrive au gicleur"
],
"bon": 2,
"s": 20
},
{
"q": "Une fournaise à air pulsé chauffe…",
"ch": [
"de l'air",
"le sol",
"de la vapeur",
"de l'eau"
],
"bon": 0,
"s": 20
},
{
"q": "Une thermopompe consomme moins qu'une plinthe électrique parce qu'elle…",
"ch": [
"brûle du gaz naturel plus efficacement",
"fonctionne la nuit seulement",
"chauffe moins, mais plus longtemps",
"déplace la chaleur au lieu de la produire"
],
"bon": 3,
"s": 20
},
{
"q": "Une thermopompe air-air…",
"ch": [
"chauffe l'hiver et climatise l'été en déplaçant la chaleur",
"fonctionne à la vapeur",
"brûle du mazout l'hiver et climatise l'été",
"chauffe seulement l'eau domestique"
],
"bon": 0,
"s": 20
},
{
"q": "Amorcer une pompe centrifuge, c'est…",
"ch": [
"remplir d'eau son corps et l'aspiration en chassant l'air",
"la vider",
"la démarrer à sec quelques secondes pour l'essai",
"changer son moteur avant la saison"
],
"bon": 0,
"s": 20
},
{
"q": "Associe la pièce du chauffe-eau.",
"t": "paires",
"g": [
"Anode",
"Soupape T et P",
"Tube plongeur",
"Robinet de vidange"
],
"ch": [
"Se sacrifie contre la corrosion",
"Évacue la surpression ou la surchauffe",
"Amène l'eau froide au fond",
"Sert à vider le réservoir"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Remets dans l'ordre la vidange partielle d'un chauffe-eau.",
"ch": [
"Couper l'alimentation (courant ou gaz)",
"Brancher un boyau au robinet de vidange",
"Ouvrir et laisser couler jusqu'à l'eau claire",
"Refermer et remettre en marche"
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
"q": "Un chauffe-eau électrique résidentiel dure en moyenne environ combien d'années?",
"t": "estim",
"ch": [],
"bon": 12,
"tol": 30,
"u": "ans",
"s": 25,
"expl": "Souvent 10 à 15 ans."
}
]
},
{
"id": "defi-plomberie-chauffage-6",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Plomberie et chauffage (EGI) · Défi+ 6 de 6",
"sujet": "Modules 11 à 13 : autres systèmes, pompes et entretien préventif",
"couv": "img/couvertures/plomberie-chauffage.jpg",
"coul": "#B3261E",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Une pompe qui perd sa charge sans cesse : on cherche surtout…",
"ch": [
"dans le toit",
"du côté refoulement",
"du côté aspiration (fuite d'air)",
"dans le panneau électrique"
],
"bon": 2,
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
"décorer le local et accueillir les visiteurs",
"afficher les prix",
"afficher les prix des réparations de l'année"
],
"bon": 0,
"s": 20
},
{
"q": "Lors d'une inspection, les priorités se justifient…",
"ch": [
"par l'ordre alphabétique",
"au hasard",
"par le coût le plus bas",
"par la sécurité d'abord"
],
"bon": 3,
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
"environ 1 psi",
"environ 150 psi",
"environ 12 à 15 psi",
"60 psi"
],
"bon": 2,
"s": 20
},
{
"q": "Une pompe centrifuge transforme…",
"ch": [
"la vitesse donnée à l'eau en pression",
"l'eau en vapeur dans la volute",
"rien",
"le courant électrique en chaleur"
],
"bon": 0,
"s": 20
},
{
"q": "Une pompe ne doit jamais tourner…",
"ch": [
"avec de l'eau",
"le jour",
"en hiver",
"à sec"
],
"bon": 3,
"s": 20
},
{
"q": "Prévenir le gel des tuyaux :",
"ch": [
"fermer le chauffage des locaux inutilisés",
"ouvrir les fenêtres pour faire circuler l'air",
"rien",
"garder les zones froides chauffées et isoler les tuyaux exposés"
],
"bon": 3,
"s": 20
},
{
"q": "Une inspection méthodique se fait…",
"ch": [
"toujours dans le même ordre, avec une fiche",
"seulement quand quelque chose brise",
"sans noter",
"au hasard, là où on passe dans la journée"
],
"bon": 0,
"s": 20
},
{
"q": "Avant de couper l'eau d'un étage, on…",
"ch": [
"avise les occupants",
"appelle les pompiers",
"ne dit rien",
"attend la nuit"
],
"bon": 0,
"s": 20
},
{
"q": "L'entretien préventif réduit les pannes et les urgences.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Associe la tâche préventive à sa fréquence courante.",
"t": "paires",
"g": [
"Regarder le manomètre de la chaudière",
"Tester la soupape T et P",
"Entretien du brûleur",
"Nettoyer la crépine de la pompe"
],
"ch": [
"Chaque ronde",
"Une fois par année",
"Avant la saison de chauffage",
"Selon le registre (souvent aux mois)"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Signes qu'une pompe centrifuge a un problème :",
"ch": [
"Bruit de gravier (cavitation)",
"Fuite au joint",
"Moteur très chaud",
"Plaque signalétique propre"
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
"id": "defi-recherche-emploi-plc-1",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Recherche d'emploi (Plomberie et chauffage) · Défi+ 1 de 6",
"sujet": "Module 1 : mon bilan",
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
"un diplôme encadré qui le prouve",
"une photo professionnelle sur le CV",
"un ton de voix fort",
"une preuve : un fait précis"
],
"bon": 3,
"s": 20
},
{
"q": "Tu as « juste été caissier ». Que dis-tu à l'employeur?",
"ch": [
"Rien : ça ne compte pas pour un emploi en construction",
"Que tu as été caissier, sans plus",
"Que tu as été caissier, sans parler du reste",
"Ce que l'emploi t'a appris, relié à l'emploi visé"
],
"bon": 3,
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
"ajoutes 5 ans de plus",
"le gardes, ça paraît bien",
"corriges : il faut que ce soit vrai",
"l'envoies tel quel"
],
"bon": 2,
"s": 20
},
{
"q": "Pour devenir compagnon tuyauteur, combien d'heures faut-il accumuler dans le carnet d'apprentissage?",
"ch": [
"8 000",
"12 000",
"2 000",
"4 000"
],
"bon": 0,
"s": 20,
"expl": "Quatre périodes de 2 000 heures, puis l'examen de qualification."
},
{
"q": "Les chantiers régis par la CCQ, c'est…",
"ch": [
"le monde de la construction",
"le commerce de pièces",
"la vente au détail",
"l'entretien d'immeubles"
],
"bon": 0,
"s": 20
},
{
"q": "Le « marché caché », c'est…",
"ch": [
"les emplois jamais affichés, comblés par recommandation",
"les sites d'emplois payants pour les candidats",
"les emplois à l'étranger",
"les emplois au noir, payés comptant"
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
"q": "Associe la qualité à une preuve concrète.",
"t": "paires",
"g": [
"Fiable",
"Débrouillard",
"Travail d'équipe",
"Minutieux"
],
"ch": [
"Jamais absent en stage",
"A réparé seul la fuite de la cabine",
"Coéquipier de hockey depuis 5 ans",
"Joints soudés sans fuite au test"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Un bilan personnel sert d'abord à…",
"ch": [
"être envoyé à l'employeur",
"savoir ce que tu as à offrir",
"calculer ton salaire",
"remplacer le CV"
],
"bon": 1,
"s": 20
},
{
"q": "Une expérience hors du domaine peut montrer des qualités utiles en plomberie.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Remets dans l'ordre la préparation de ton bilan.",
"ch": [
"Lister tes expériences",
"Trouver ce que chacune t'a appris",
"Choisir des preuves",
"Relier à l'emploi visé"
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
"q": "Combien d'heures compte une période d'apprentissage en plomberie (carnet CCQ)?",
"t": "estim",
"ch": [],
"bon": 2000,
"tol": 5,
"u": "h",
"s": 30,
"expl": "2 000 heures par période."
}
]
},
{
"id": "defi-recherche-emploi-plc-2",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Recherche d'emploi (Plomberie et chauffage) · Défi+ 2 de 6",
"sujet": "Modules 2 et 3 : construction ou hors construction, le CV",
"couv": "img/couvertures/recherche-emploi-plc.jpg",
"coul": "#1F6FB2",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Construction ou hors construction : laquelle est régie par la CCQ?",
"ch": [
"Hors construction",
"Les deux",
"Construction",
"Aucune"
],
"bon": 2,
"s": 20
},
{
"q": "Le carnet d'apprentissage compte combien de périodes de 2 000 heures?",
"ch": [
"4",
"2",
"6",
"8"
],
"bon": 0,
"s": 20
},
{
"q": "La CCQ, c'est…",
"ch": [
"un syndicat de locataires",
"la Chambre de commerce du Québec",
"la Caisse centrale du Québec",
"la Commission de la construction du Québec"
],
"bon": 3,
"s": 20
},
{
"q": "Une partie des emplois n'est jamais affichée.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Un emploi de livreur montre surtout que tu es…",
"ch": [
"rien d'utile",
"expert en plomberie",
"bon en soudure",
"fiable avec un horaire"
],
"bon": 3,
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
"aucun message",
"ton nom, clair et poli",
"une blague"
],
"bon": 2,
"s": 20
},
{
"q": "Ton bilan personnel complet, l'employeur…",
"ch": [
"le signe pour confirmer ton embauche",
"le reçoit avec ton CV et ta lettre",
"le garde au dossier",
"ne le voit jamais tel quel : c'est un document de travail"
],
"bon": 3,
"s": 20
},
{
"q": "Pour améliorer un profil vague comme « Je suis motivé et j'aime travailler avec mes mains » :",
"ch": [
"le raccourcir à un mot",
"ajouter un fait précis et chiffré",
"ajouter des points d'exclamation",
"l'écrire en majuscules"
],
"bon": 1,
"s": 20
},
{
"q": "Les références, on…",
"ch": [
"les prépare sur une liste séparée",
"les met en bas du CV",
"écrit « Références sur demande »",
"ne les donne jamais"
],
"bon": 0,
"s": 20
},
{
"q": "Associe la section du CV.",
"t": "paires",
"g": [
"Coordonnées",
"Profil",
"Expérience",
"Formation"
],
"ch": [
"Comment te joindre",
"Qui tu es en 2 ou 3 lignes",
"Ce que tu as fait, avec des verbes d'action",
"Ton DEP et tes cartes"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Pour travailler sur un chantier de la construction, il faut…",
"ch": [
"seulement un permis de conduire",
"un diplôme universitaire",
"une lettre de ton enseignant",
"un certificat de compétence de la CCQ"
],
"bon": 3,
"s": 20
},
{
"q": "Trouve l'erreur dans cette phrase.",
"t": "erreur",
"ch": [
"Mon CV fait deux pages,",
"avec des puces claires,",
"ma photo et mon numéro d'assurance sociale,",
"et mes cartes de sécurité."
],
"bon": 2,
"s": 30,
"expl": "On ne met jamais son NAS dans un CV."
},
{
"q": "Un CV doit être adapté à chaque offre.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Un employeur regarde un CV en moyenne environ combien de secondes au premier tri?",
"t": "estim",
"ch": [],
"bon": 10,
"tol": 50,
"u": "s",
"s": 25,
"expl": "Quelques secondes : le haut du CV compte beaucoup."
}
]
},
{
"id": "defi-recherche-emploi-plc-3",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Recherche d'emploi (Plomberie et chauffage) · Défi+ 3 de 6",
"sujet": "Modules 3 et 4 : chercher et postuler en ligne",
"couv": "img/couvertures/recherche-emploi-plc.jpg",
"coul": "#1F6FB2",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Une bonne puce de CV commence par…",
"ch": [
"« J'aidais à… » ou « J'étais responsable de… »",
"un verbe d'action : installé, réparé, inspecté",
"la date de début et de fin de l'emploi",
"le nom de l'employeur"
],
"bon": 1,
"s": 20
},
{
"q": "Une adresse courriel pour postuler :",
"ch": [
"aucune adresse",
"celle de ton ami",
"bigboss_69@…",
"prenom.nom@…"
],
"bon": 3,
"s": 20
},
{
"q": "Un logiciel de tri de CV cherche surtout…",
"ch": [
"la photo",
"les couleurs du CV",
"les mots-clés de l'offre",
"le nombre de pages"
],
"bon": 2,
"s": 20
},
{
"q": "Karine revient après six ans à la maison. Quel type de CV met ses forces en avant?",
"ch": [
"Le CV chronologique",
"Une lettre seulement",
"Le CV par compétences",
"Aucun CV"
],
"bon": 2,
"s": 20
},
{
"q": "Une offre te demande de l'argent pour « réserver » le poste.",
"ch": [
"C'est probablement une fausse offre",
"Je paie vite pour ne pas perdre le poste",
"C'est normal en plomberie",
"Je donne mon NAS"
],
"bon": 0,
"s": 20
},
{
"q": "Pour tes réseaux personnels, la visibilité des publications devrait être…",
"ch": [
"Public",
"Sans importance",
"Tout le monde",
"Amis"
],
"bon": 3,
"s": 20
},
{
"q": "Dans la section Formation du CV, on commence par…",
"ch": [
"le diplôme le plus récent",
"les loisirs",
"le diplôme le plus ancien",
"l'école primaire"
],
"bon": 0,
"s": 20
},
{
"q": "Un trou de deux ans dans ton parcours :",
"ch": [
"laisser l'employeur deviner",
"le cacher en inventant un emploi",
"changer les dates pour qu'il ne paraisse pas",
"le nommer simplement (ex. proche aidant)"
],
"bon": 3,
"s": 20
},
{
"q": "L'IA peut t'aider à…",
"ch": [
"écrire des diplômes que tu auras bientôt",
"trouver des verbes et raccourcir une phrase, mais tout doit être vrai",
"rien",
"inventer de l'expérience pour remplir le CV"
],
"bon": 1,
"s": 20
},
{
"q": "Le CV combiné convient à…",
"ch": [
"un finissant avec beaucoup d'expérience hors du domaine",
"un élève sans aucune expérience de travail",
"un compagnon de 30 ans d'expérience seulement",
"un enfant"
],
"bon": 0,
"s": 20
},
{
"q": "Associe le site ou le lieu de recherche.",
"t": "paires",
"g": [
"Québec emploi",
"Site de l'entreprise",
"Carrefour jeunesse-emploi",
"Syndicat ou CCQ"
],
"ch": [
"Offres publiques du gouvernement",
"Postes souvent affichés là seulement",
"Aide pour le CV et l'entrevue",
"Bassin de main-d'œuvre de la construction"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Postuler en ligne : le fichier du CV s'envoie de préférence en…",
"ch": [
"photo prise au cellulaire",
"fichier .zip compressé",
"texte copié dans le courriel",
"PDF, avec ton nom dans le titre"
],
"bon": 3,
"s": 20
},
{
"q": "Remets dans l'ordre une candidature en ligne.",
"ch": [
"Lire l'offre au complet",
"Adapter le CV",
"Écrire un court message",
"Noter la date dans ton suivi"
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
"q": "Une offre qui demande de l'argent pour réserver un poste est suspecte.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Que noter dans ton tableau de suivi?",
"ch": [
"L'entreprise",
"La date d'envoi",
"La date de relance",
"La couleur du logo"
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
"id": "defi-recherche-emploi-plc-4",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Recherche d'emploi (Plomberie et chauffage) · Défi+ 4 de 6",
"sujet": "Modules 5 et 6 : plan de recherche et réseau",
"couv": "img/couvertures/recherche-emploi-plc.jpg",
"coul": "#1F6FB2",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Après le DEP, une recherche d'emploi active demande environ…",
"ch": [
"1 heure par mois, quand une offre arrive",
"40 heures par semaine, sans arrêt",
"10 à 15 heures par semaine",
"aucun horaire"
],
"bon": 2,
"s": 20
},
{
"q": "Quand tu appelles une entreprise, tu notes surtout…",
"ch": [
"le nom du responsable, pour ta relance",
"le prix des pièces",
"le prix des pièces qu'ils vendent",
"la couleur des camions et le logo de l'entreprise"
],
"bon": 0,
"s": 20
},
{
"q": "Nomme un piège à éviter dans une lettre :",
"ch": [
"Relire avant d'envoyer",
"Commencer toutes les phrases par « Je »",
"Donner une preuve de tes qualités",
"Adresser la lettre à la bonne personne"
],
"bon": 1,
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
"Les sites de vente usagée",
"Les réseaux de jeux",
"Aucun"
],
"bon": 0,
"s": 20
},
{
"q": "Une recherche d'emploi efficace se traite comme…",
"ch": [
"un emploi à temps partiel : heures fixes et objectifs",
"une corvée à faire une seule fois, en une journée",
"un passe-temps, quand tu as le temps",
"un loisir du dimanche"
],
"bon": 0,
"s": 20
},
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
"q": "Associe le moyen de recherche.",
"t": "paires",
"g": [
"Candidature spontanée",
"Réseau",
"Salon de l'emploi",
"Stage"
],
"ch": [
"Envoyer son CV sans offre affichée",
"Parler aux gens qui te connaissent",
"Rencontrer plusieurs employeurs en une journée",
"Se faire connaître en travaillant"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Une recherche d'emploi efficace se planifie…",
"ch": [
"une seule journée par mois",
"avec des heures fixes et des objectifs",
"quand on a le temps",
"seulement le dimanche"
],
"bon": 1,
"s": 20
},
{
"q": "Remets dans l'ordre un appel à un employeur.",
"ch": [
"Se présenter",
"Dire le poste visé",
"Demander le nom du responsable",
"Remercier et noter"
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
"q": "Le marché caché comprend les emplois comblés par recommandation.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Selon le livre, une recherche active demande environ combien d'heures par semaine?",
"t": "estim",
"ch": [],
"bon": 12,
"tol": 30,
"u": "h",
"s": 25,
"expl": "Environ 10 à 15 heures par semaine."
}
]
},
{
"id": "defi-recherche-emploi-plc-5",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Recherche d'emploi (Plomberie et chauffage) · Défi+ 5 de 6",
"sujet": "Modules 6 et 7 : la lettre et l'entrevue",
"couv": "img/couvertures/recherche-emploi-plc.jpg",
"coul": "#1F6FB2",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Une lettre de candidature spontanée s'appuie sur…",
"ch": [
"ton horaire de la semaine",
"ce que tu sais de l'employeur",
"une lettre type envoyée à tous",
"les exigences de l'offre"
],
"bon": 1,
"s": 20,
"expl": "Sans offre, tu n'as pas d'exigences à reprendre."
},
{
"q": "Ton réseau, ce sont…",
"ch": [
"les journaux",
"les personnes qui te connaissent et peuvent parler de toi",
"les employeurs inconnus de ta région",
"tes abonnés sur les réseaux sociaux seulement"
],
"bon": 1,
"s": 20
},
{
"q": "Sans suivi de ta recherche, tu oublies…",
"ch": [
"à qui tu as écrit et quand relancer",
"rien",
"le nom de ton métier dans les courriels",
"rien : tout reste dans ta tête"
],
"bon": 0,
"s": 20
},
{
"q": "La conclusion d'une lettre fait une seule chose :",
"ch": [
"raconter ton parcours depuis le secondaire",
"demander la rencontre, avec assurance",
"parler du salaire et des avantages voulus",
"répéter le CV"
],
"bon": 1,
"s": 20
},
{
"q": "Une lettre de présentation tient en…",
"ch": [
"dix pages",
"une page",
"une ligne",
"trois pages"
],
"bon": 1,
"s": 20
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
"pourquoi tu es ici pour ce poste",
"ton signe astrologique",
"tes loisirs du week-end",
"toute ta vie"
],
"bon": 0,
"s": 20
},
{
"q": "Quand parler du salaire?",
"ch": [
"Dans la lettre de présentation, avant l'entrevue",
"Dès la première minute de l'entrevue",
"Jamais",
"Quand l'employeur aborde le sujet ou au moment de l'offre"
],
"bon": 3,
"s": 20
},
{
"q": "Ton message de remerciement après l'entrevue s'envoie…",
"ch": [
"un mois plus tard",
"le jour même ou le lendemain",
"seulement si on t'engage",
"jamais"
],
"bon": 1,
"s": 20
},
{
"q": "Un refus veut dire…",
"ch": [
"que l'employeur te déteste",
"que tu n'es pas bon dans ton métier",
"qu'un autre candidat correspondait mieux cette fois",
"que tu dois arrêter de chercher dans ce domaine"
],
"bon": 2,
"s": 20
},
{
"q": "Associe le paragraphe de la lettre.",
"t": "paires",
"g": [
"Premier",
"Deuxième",
"Troisième",
"Conclusion"
],
"ch": [
"Qui tu es et le poste visé",
"Ce que tu apportes, avec des preuves",
"Pourquoi cette entreprise",
"Demander une rencontre"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "En entrevue, la méthode STAR sert à…",
"ch": [
"choisir sa tenue",
"raconter un exemple : situation, tâche, action, résultat",
"poser des questions à l'employeur",
"parler du salaire au bon moment"
],
"bon": 1,
"s": 20
},
{
"q": "Remets dans l'ordre le jour de l'entrevue.",
"ch": [
"Arriver 10 minutes d'avance",
"Saluer et se présenter",
"Répondre avec des exemples",
"Remercier et demander la suite"
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
"q": "Poser une question à la fin de l'entrevue montre de l'intérêt.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Que faut-il apporter à une entrevue?",
"ch": [
"Copies du CV",
"Cartes de compétence",
"Un crayon et des notes",
"Son lunch"
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
"id": "defi-recherche-emploi-plc-6",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Recherche d'emploi (Plomberie et chauffage) · Défi+ 6 de 6",
"sujet": "Module 8 : relance et premier emploi",
"couv": "img/couvertures/recherche-emploi-plc.jpg",
"coul": "#1F6FB2",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "La loi qui fixe les conditions minimales de travail au Québec :",
"ch": [
"le Code de la route",
"la Loi sur la RBQ",
"la Loi sur les normes du travail",
"le Code de construction"
],
"bon": 2,
"s": 20
},
{
"q": "Premier jour : on te demande d'utiliser un produit que tu ne connais pas.",
"ch": [
"Je lis l'étiquette et la FDS",
"Je le mélange avec de l'eau de Javel",
"Je refuse de travailler",
"Je l'utilise sans rien lire"
],
"bon": 0,
"s": 20
},
{
"q": "L'appel de présélection, c'est…",
"ch": [
"une formalité sans importance",
"un test de vitesse",
"un message publicitaire",
"déjà une entrevue"
],
"bon": 3,
"s": 20
},
{
"q": "Entrevue vidéo : le cadrage idéal…",
"ch": [
"les yeux au tiers du haut, visage éclairé",
"caméra éteinte",
"la caméra pointée vers le plafond",
"à contre-jour, devant une grande fenêtre"
],
"bon": 0,
"s": 20
},
{
"q": "En entrevue, une mise en situation du métier vérifie surtout…",
"ch": [
"ta vitesse de frappe au clavier",
"si tu penses d'abord à la sécurité et au client",
"ton auto",
"ta taille et ta force physique"
],
"bon": 1,
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
"un contrat de 5 ans avec le même employeur",
"un examen écrit",
"une prime de départ payée par l'école",
"150 heures chez un employeur"
],
"bon": 3,
"s": 20
},
{
"q": "Au téléphone, l'employeur n'a que…",
"ch": [
"ton CV imprimé",
"ta photo",
"ta tenue",
"ta voix et tes mots"
],
"bon": 3,
"s": 20
},
{
"q": "Juste après l'entrevue, prends cinq minutes pour…",
"ch": [
"oublier",
"appeler l'employeur",
"publier sur les réseaux",
"noter ce qui s'est passé"
],
"bon": 3,
"s": 20
},
{
"q": "Les conditions minimales de travail sont surveillées par…",
"ch": [
"le TAL",
"la CNESST",
"la RBQ",
"la SAAQ"
],
"bon": 1,
"s": 20
},
{
"q": "Associe la situation à la bonne action.",
"t": "paires",
"g": [
"Aucune nouvelle après une semaine",
"Refus",
"Offre reçue",
"Premier jour"
],
"ch": [
"Relancer poliment",
"Remercier et demander des conseils",
"Demander une confirmation écrite",
"Arriver tôt, écouter, poser des questions"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Pendant la probation, l'employeur regarde surtout…",
"ch": [
"tes réseaux sociaux",
"ton nombre d'amis au travail",
"ta voiture",
"ta fiabilité et ta sécurité"
],
"bon": 3,
"s": 20
},
{
"q": "Remets dans l'ordre une relance par téléphone.",
"ch": [
"Se présenter",
"Rappeler le poste et la date d'envoi",
"Demander où en est le processus",
"Remercier"
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
"q": "Une relance se fait environ une semaine après l'envoi ou l'entrevue.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "La période de probation dure souvent environ combien de mois?",
"t": "estim",
"ch": [],
"bon": 3,
"tol": 34,
"u": "mois",
"s": 25,
"expl": "Souvent 3 mois (parfois 6)."
}
]
},
{
"id": "defi-recherche-emploi-egi-1",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Moyens de recherche d'emploi (EGI) · Défi+ 1 de 6",
"sujet": "Modules 1 et 2 : mon bilan et les emplois en entretien",
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
"un diplôme encadré qui le prouve",
"une photo professionnelle sur le CV",
"un ton de voix fort",
"une preuve : un fait précis"
],
"bon": 3,
"s": 20
},
{
"q": "Tu as « juste été caissier ». Que dis-tu à l'employeur?",
"ch": [
"Rien : ça ne compte pas pour un emploi en construction",
"Que tu as été caissier, sans plus",
"Que tu as été caissier, sans parler du reste",
"Ce que l'emploi t'a appris, relié à l'emploi visé"
],
"bon": 3,
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
"ajoutes 5 ans de plus",
"le gardes, ça paraît bien",
"corriges : il faut que ce soit vrai",
"l'envoies tel quel"
],
"bon": 2,
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
"aucune",
"quelle couleur, quel camion, quel outil",
"qui, quand, pourquoi"
],
"bon": 0,
"s": 20
},
{
"q": "En entretien, les titres changent d'un employeur à l'autre. Pour chercher, tu…",
"ch": [
"cherches seulement « concierge »",
"attends qu'on t'appelle",
"utilises plusieurs mots-clés",
"abandonnes"
],
"bon": 2,
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
"la couleur du papier",
"les critères du programme d'études",
"la police la plus originale",
"ton nombre d'amis"
],
"bon": 1,
"s": 20
},
{
"q": "Associe le titre d'emploi au milieu de travail.",
"t": "paires",
"g": [
"Concierge résident",
"Ouvrier d'entretien",
"Préposé à l'entretien",
"Technicien en bâtiment"
],
"ch": [
"Vit dans l'immeuble locatif",
"Municipalité ou école",
"Hôpital, hôtel, CHSLD",
"Grand immeuble de bureaux"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Ton bilan personnel complet est…",
"ch": [
"un document de travail pour toi",
"signé par l'employeur",
"affiché à l'école",
"envoyé avec ton CV"
],
"bon": 0,
"s": 20
},
{
"q": "Les mêmes tâches peuvent porter des titres différents selon l'employeur.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Remets dans l'ordre la préparation de ta recherche.",
"ch": [
"Faire ton bilan",
"Choisir les emplois visés",
"Faire ton CV",
"Trouver les employeurs"
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
"q": "Un immeuble de 48 logements sur 4 étages : combien de logements par étage?",
"t": "nombre",
"ch": [],
"bon": 12,
"s": 40,
"u": "logements"
}
]
},
{
"id": "defi-recherche-emploi-egi-2",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Moyens de recherche d'emploi (EGI) · Défi+ 2 de 6",
"sujet": "Module 3 : le CV",
"couv": "img/couvertures/recherche-emploi-egi.jpg",
"coul": "#2E8B57",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "« Ouvrier d'entretien classe II », « concierge », « préposé » : ce sont…",
"ch": [
"des métiers sans aucun lien entre eux",
"des emplois de la construction, cartes CCQ exigées",
"des titres différents pour des emplois proches",
"des stages"
],
"bon": 2,
"s": 20
},
{
"q": "Un emploi de livreur montre surtout que tu es…",
"ch": [
"rien d'utile",
"expert en ménage",
"bon en plomberie",
"fiable avec un horaire"
],
"bon": 3,
"s": 20
},
{
"q": "Une banque de verbes d'action sert à…",
"ch": [
"rien",
"écrire une lettre d'amour",
"écrire des puces de CV fortes",
"remplir un bon de travail"
],
"bon": 2,
"s": 20
},
{
"q": "Les titres d'emploi en entretien changent d'un employeur à l'autre.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Une liste d'employeurs de la région sert de…",
"ch": [
"point de départ pour ta recherche",
"liste finale : tu n'en contactes pas d'autres",
"décoration",
"liste noire des employeurs à éviter"
],
"bon": 0,
"s": 20
},
{
"q": "Ton bilan personnel complet, l'employeur…",
"ch": [
"le signe pour confirmer ton embauche",
"le reçoit avec ton CV et ta lettre",
"le garde au dossier",
"ne le voit jamais tel quel : c'est un document de travail"
],
"bon": 3,
"s": 20
},
{
"q": "Ton message de boîte vocale idéal :",
"ch": [
"de la musique forte",
"aucun message",
"ton nom, clair et poli",
"une blague"
],
"bon": 2,
"s": 20
},
{
"q": "Pour améliorer un profil vague comme « Je suis motivé et j'aime travailler avec mes mains » :",
"ch": [
"le raccourcir à un mot",
"ajouter un fait précis et chiffré",
"ajouter des points d'exclamation",
"l'écrire en majuscules"
],
"bon": 1,
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
},
{
"q": "Les références, on…",
"ch": [
"les prépare sur une liste séparée",
"les met en bas du CV",
"écrit « Références sur demande »",
"ne les donne jamais"
],
"bon": 0,
"s": 20
},
{
"q": "Associe le verbe d'action à la tâche.",
"t": "paires",
"g": [
"Réparé",
"Inspecté",
"Entretenu",
"Accueilli"
],
"ch": [
"Une porte qui ne fermait plus",
"Les extincteurs chaque mois",
"Les planchers d'une école",
"Les nouveaux locataires"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Une puce de CV forte commence par…",
"ch": [
"la date de l'emploi",
"« J'étais responsable de… »",
"un verbe d'action au passé",
"le nom de l'entreprise"
],
"bon": 2,
"s": 20
},
{
"q": "Trouve l'erreur dans cette phrase.",
"t": "erreur",
"ch": [
"Mon CV présente",
"mes expériences récentes en premier,",
"mes cartes et attestations,",
"et ma date de naissance en haut."
],
"bon": 3,
"s": 30,
"expl": "On ne met pas sa date de naissance."
},
{
"q": "La section Formation commence par le diplôme le plus récent.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Quelles attestations sont utiles en entretien?",
"ch": [
"SIMDUT",
"Secourisme",
"Travail en hauteur",
"Permis de bateau"
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
"id": "defi-recherche-emploi-egi-3",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Moyens de recherche d'emploi (EGI) · Défi+ 3 de 6",
"sujet": "Modules 3 et 4 : chercher et postuler en ligne",
"couv": "img/couvertures/recherche-emploi-egi.jpg",
"coul": "#2E8B57",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Une bonne puce de CV commence par…",
"ch": [
"« J'aidais à… » ou « J'étais responsable de… »",
"un verbe d'action : installé, réparé, inspecté",
"la date de début et de fin de l'emploi",
"le nom de l'employeur"
],
"bon": 1,
"s": 20
},
{
"q": "Une adresse courriel pour postuler :",
"ch": [
"aucune adresse",
"celle de ton ami",
"bigboss_69@…",
"prenom.nom@…"
],
"bon": 3,
"s": 20
},
{
"q": "Un logiciel de tri de CV cherche surtout…",
"ch": [
"la photo",
"les couleurs du CV",
"les mots-clés de l'offre",
"le nombre de pages"
],
"bon": 2,
"s": 20
},
{
"q": "Karine revient après six ans à la maison. Quel type de CV met ses forces en avant?",
"ch": [
"Le CV chronologique",
"Une lettre seulement",
"Le CV par compétences",
"Aucun CV"
],
"bon": 2,
"s": 20
},
{
"q": "Les postes du secteur public (écoles, municipalités) sont souvent affichés…",
"ch": [
"seulement sur le site de l'employeur",
"jamais",
"sur les poteaux et les babillards de la ville",
"dans les journaux imprimés seulement"
],
"bon": 0,
"s": 20,
"expl": "Vérifie-les chaque semaine."
},
{
"q": "Combien de moyens de recherche un bon plan combine-t-il?",
"ch": [
"Un seul, le plus efficace",
"Aucun",
"Trois ou quatre",
"Dix ou plus, tous en même temps"
],
"bon": 2,
"s": 20
},
{
"q": "Un trou de deux ans dans ton parcours :",
"ch": [
"laisser deviner",
"inventer un emploi pour combler le trou",
"changer les dates pour qu'il ne paraisse pas",
"le nommer simplement (ex. proche aidant)"
],
"bon": 3,
"s": 20
},
{
"q": "L'IA peut t'aider à…",
"ch": [
"écrire des diplômes que tu auras bientôt",
"trouver des verbes et raccourcir une phrase, mais tout doit être vrai",
"rien",
"inventer de l'expérience pour remplir le CV"
],
"bon": 1,
"s": 20
},
{
"q": "La section « Autres activités » du CV : le mot important est…",
"ch": [
"drôles",
"nombreuses",
"pertinentes",
"anciennes"
],
"bon": 2,
"s": 20
},
{
"q": "Le CV combiné convient à…",
"ch": [
"un finissant avec beaucoup d'expérience hors du domaine",
"un expert seulement",
"un compagnon de 30 ans d'expérience seulement",
"un enfant"
],
"bon": 0,
"s": 20
},
{
"q": "Associe le type d'employeur à l'endroit où il affiche.",
"t": "paires",
"g": [
"Centre de services scolaire",
"Municipalité",
"Gestionnaire immobilier",
"Hôpital (CISSS)"
],
"ch": [
"Son site, section carrières",
"Son site et le journal local",
"Sites d'emploi et réseaux",
"Site du CISSS, concours"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Un concours de la fonction publique demande souvent…",
"ch": [
"une lettre écrite à la main",
"seulement un appel au directeur",
"de se présenter sans CV",
"de répondre à des questions de sélection en ligne"
],
"bon": 3,
"s": 20
},
{
"q": "Remets dans l'ordre une candidature à une municipalité.",
"ch": [
"Trouver l'affichage",
"Vérifier les exigences",
"Remplir le formulaire en ligne",
"Noter la date limite et le suivi"
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
"q": "Il faut respecter la date limite de l'affichage.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Un affichage de poste dans le secteur public reste ouvert environ combien de jours?",
"t": "estim",
"ch": [],
"bon": 14,
"tol": 50,
"u": "jours",
"s": 25,
"expl": "Souvent 1 à 3 semaines."
}
]
},
{
"id": "defi-recherche-emploi-egi-4",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Moyens de recherche d'emploi (EGI) · Défi+ 4 de 6",
"sujet": "Modules 4 et 5 : mises en situation et lettre",
"couv": "img/couvertures/recherche-emploi-egi.jpg",
"coul": "#2E8B57",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "En région, se présenter en personne pour une candidature spontanée…",
"ch": [
"se fait seulement la nuit",
"ne sert à rien",
"fonctionne encore très bien",
"est interdit"
],
"bon": 2,
"s": 20
},
{
"q": "Une offre te demande de l'argent pour « réserver » le poste.",
"ch": [
"C'est probablement une fausse offre",
"Je paie vite pour ne pas perdre le poste",
"C'est normal pour les emplois très demandés",
"Je donne mon NAS"
],
"bon": 0,
"s": 20
},
{
"q": "Le brouillon de ta lettre de présentation, c'est…",
"ch": [
"un modèle de lettre copié sur Internet",
"un texto",
"ton tableau exigences de l'offre / ton bilan",
"ton CV recopié"
],
"bon": 2,
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
"Sans importance",
"Tout le monde",
"Amis"
],
"bon": 3,
"s": 20
},
{
"q": "Sites gouvernementaux pour chercher un emploi :",
"ch": [
"Québec emploi et le Guichet-Emplois",
"Les sites de vente usagée",
"Les réseaux de jeux",
"Aucun"
],
"bon": 0,
"s": 20
},
{
"q": "Une recherche d'emploi efficace se traite comme…",
"ch": [
"un emploi à temps partiel : heures fixes et objectifs",
"une corvée à faire une seule fois, en une journée",
"un passe-temps, quand tu as le temps",
"un loisir du dimanche"
],
"bon": 0,
"s": 20
},
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
"q": "Associe la mise en situation à la priorité.",
"t": "paires",
"g": [
"Fuite d'eau au plafond",
"Locataire fâché",
"Alarme incendie",
"Bris non urgent"
],
"ch": [
"Couper l'eau et protéger",
"Écouter et rester calme",
"Évacuer et suivre le plan",
"Bon de travail et planifier"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Dans une mise en situation d'entrevue, on parle d'abord…",
"ch": [
"de l'heure du dîner",
"de la sécurité",
"du prix des réparations",
"de ses vacances"
],
"bon": 1,
"s": 20
},
{
"q": "Remets dans l'ordre la lettre de présentation.",
"ch": [
"Le poste visé",
"Ce que tu apportes",
"Pourquoi cet employeur",
"La demande de rencontre"
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
"q": "Une lettre de présentation tient sur une page.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Une bonne lettre est…",
"ch": [
"Adaptée à l'offre",
"Sans fautes",
"Signée",
"Copiée d'Internet"
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
"id": "defi-recherche-emploi-egi-5",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Moyens de recherche d'emploi (EGI) · Défi+ 5 de 6",
"sujet": "Modules 6 et 7 : l'entrevue",
"couv": "img/couvertures/recherche-emploi-egi.jpg",
"coul": "#2E8B57",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "Une lettre de candidature spontanée s'appuie sur…",
"ch": [
"ton horaire de la semaine",
"ce que tu sais de l'employeur",
"une lettre type envoyée à tous",
"les exigences de l'offre"
],
"bon": 1,
"s": 20,
"expl": "Sans offre, tu n'as pas d'exigences à reprendre."
},
{
"q": "La lettre de présentation fait le pont entre…",
"ch": [
"toi et ta famille",
"le CV et la photo",
"l'offre et ton bilan",
"deux employeurs"
],
"bon": 2,
"s": 20
},
{
"q": "Le premier paragraphe de la lettre dit…",
"ch": [
"tes défauts",
"tes loisirs et tes passe-temps",
"ton salaire voulu et tes disponibilités",
"qui tu es, quel poste tu vises et comment tu l'as connu"
],
"bon": 3,
"s": 20
},
{
"q": "Le courriel de candidature doit être…",
"ch": [
"en majuscules",
"sans objet",
"court, poli et complet",
"long et détaillé"
],
"bon": 2,
"s": 20
},
{
"q": "Une question délicate en entrevue : la règle…",
"ch": [
"se fâcher",
"mentir pour donner la meilleure image",
"honnête, bref, puis revenir au positif",
"refuser poliment de répondre"
],
"bon": 2,
"s": 20
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
"pourquoi tu es ici pour ce poste",
"ton signe astrologique",
"tes loisirs du week-end",
"toute ta vie"
],
"bon": 0,
"s": 20
},
{
"q": "Quand parler du salaire?",
"ch": [
"Dans la lettre de présentation, avant l'entrevue",
"Dès la première minute de l'entrevue",
"Jamais",
"Quand l'employeur aborde le sujet ou au moment de l'offre"
],
"bon": 3,
"s": 20
},
{
"q": "Ton message de remerciement après l'entrevue s'envoie…",
"ch": [
"un mois plus tard",
"le jour même ou le lendemain",
"seulement si on t'engage",
"jamais"
],
"bon": 1,
"s": 20
},
{
"q": "Un refus veut dire…",
"ch": [
"que l'employeur te déteste",
"que tu n'es pas bon dans ton métier",
"qu'un autre candidat correspondait mieux cette fois",
"que tu dois arrêter de chercher dans ce domaine"
],
"bon": 2,
"s": 20
},
{
"q": "Associe la question d'entrevue au bon réflexe.",
"t": "paires",
"g": [
"Parle-moi de toi",
"Ton plus grand défaut?",
"Pourquoi nous?",
"As-tu des questions?"
],
"ch": [
"Résumé lié au poste",
"Vrai défaut et ce que tu fais pour t'améliorer",
"Ce que tu sais de l'entreprise",
"Poser une question préparée"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "La tenue pour une entrevue en entretien est…",
"ch": [
"le survêtement de sport",
"un cran plus habillée que la tenue de travail",
"un complet-cravate obligatoire",
"les vêtements de travail sales"
],
"bon": 1,
"s": 20
},
{
"q": "Remets dans l'ordre la préparation d'une entrevue.",
"ch": [
"Relire l'offre",
"Préparer 3 exemples",
"Préparer tes questions",
"Planifier le trajet"
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
"q": "En entrevue vidéo, on regarde la caméra pour donner l'impression de regarder la personne.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Une entrevue d'embauche dure souvent environ combien de minutes?",
"t": "estim",
"ch": [],
"bon": 40,
"tol": 40,
"u": "min",
"s": 25,
"expl": "Souvent 30 à 60 minutes."
}
]
},
{
"id": "defi-recherche-emploi-egi-6",
"exemple": true,
"livre": true,
"defi": true,
"titre": "Moyens de recherche d'emploi (EGI) · Défi+ 6 de 6",
"sujet": "Modules 7 et 8 : relance et premier emploi",
"couv": "img/couvertures/recherche-emploi-egi.jpg",
"coul": "#2E8B57",
"reg": {
"nb": "tout",
"melange": "tout"
},
"qs": [
{
"q": "La loi qui fixe les conditions minimales de travail au Québec :",
"ch": [
"le Code de la route",
"la Loi sur la RBQ",
"la Loi sur les normes du travail",
"le Code de construction"
],
"bon": 2,
"s": 20
},
{
"q": "Premier jour : on te demande d'utiliser un produit que tu ne connais pas.",
"ch": [
"Je lis l'étiquette et la FDS",
"Je le mélange avec de l'eau de Javel",
"Je refuse de travailler",
"Je l'utilise sans rien lire"
],
"bon": 0,
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
"complet-cravate, obligatoire partout",
"un cran plus habillé que la tenue de travail, propre",
"survêtement de sport, pour être à l'aise",
"vêtements de travail sales"
],
"bon": 1,
"s": 20
},
{
"q": "Une fois l'offre acceptée, tu demandes…",
"ch": [
"une confirmation écrite : salaire, horaire, statut, date de début",
"un congé",
"rien du tout : une poignée de main suffit",
"une augmentation avant même de commencer"
],
"bon": 0,
"s": 20
},
{
"q": "La période de probation, c'est…",
"ch": [
"une période d'essai où l'employeur observe ta fiabilité",
"des vacances payées avant de commencer",
"un examen écrit",
"une amende si tu arrives en retard"
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
},
{
"q": "Au téléphone, l'employeur n'a que…",
"ch": [
"ton CV imprimé",
"ta photo",
"ta tenue",
"ta voix et tes mots"
],
"bon": 3,
"s": 20
},
{
"q": "Juste après l'entrevue, prends cinq minutes pour…",
"ch": [
"oublier",
"rappeler l'employeur",
"publier sur les réseaux",
"noter ce qui s'est passé"
],
"bon": 3,
"s": 20
},
{
"q": "Après le cours, ton dossier est prêt : il faut maintenant…",
"ch": [
"attendre qu'on t'appelle avec ce que tu as envoyé",
"le ranger jusqu'à la prochaine fois",
"l'utiliser et continuer ta recherche",
"le jeter"
],
"bon": 2,
"s": 20
},
{
"q": "Associe l'étape à son but.",
"t": "paires",
"g": [
"Relance",
"Remerciement",
"Confirmation écrite",
"Probation"
],
"ch": [
"Montrer ton intérêt",
"Laisser une bonne impression",
"Éviter les malentendus sur les conditions",
"Prouver ta fiabilité"
],
"bon": [
0,
1,
2,
3
],
"s": 45
},
{
"q": "Après un refus, la bonne attitude est…",
"ch": [
"arrêter de chercher",
"rappeler tous les jours",
"écrire une plainte",
"remercier et continuer ta recherche"
],
"bon": 3,
"s": 20
},
{
"q": "Remets dans l'ordre le premier jour de travail.",
"ch": [
"Arriver en avance",
"Rencontrer l'équipe",
"Visite et consignes de sécurité",
"Poser des questions et noter"
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
"q": "Garder ton dossier de recherche à jour aide pour le prochain emploi.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15
},
{
"q": "Que demande-t-on dans la confirmation écrite de l'offre?",
"ch": [
"Le salaire",
"L'horaire",
"La date de début",
"Le nom des collègues"
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
}
];
