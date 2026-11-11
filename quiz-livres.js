/* Quiz des livres de la bibliothèque (7 nov.) — un quiz par livre, questions et images tirées du livre.
   Types : choix, vrai ou faux, plusieurs bonnes (multi), remettre en ordre (ordre), calcul (nombre), trouve l'erreur (erreur), zoom mystère (zoom).
   Chaque partie tire 12 questions au hasard (réglage « Questions », modifiable avant de jouer).
   Fabriqué par Claude à partir des livres (scratchpad ql/data.py); lecture seule : « Copier et modifier » pour l'adapter. */
window.QUIZ_LIVRES = [
{
"id": "decouvre-metier-plus",
"exemple": true,
"titre": "Découvre Métier+",
"sujet": "Présentation",
"couv": "img/labo/quiz/demo/01.jpg",
"coul": "#EB6A22",
"reg": {
"nb": "tout",
"melange": "non"
},
"qs": [
{
"t": "diapo",
"img": "img/labo/quiz/demo/01.jpg",
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
"t": "nuage",
"q": "En un mot : qu'est-ce qui te prend le plus de temps à préparer ?",
"ch": [],
"bon": null,
"s": 45
},
{
"t": "diapo",
"img": "img/labo/quiz/demo/02.jpg",
"q": "",
"s": 0,
"mv": "focus"
},
{
"t": "diapo",
"img": "img/labo/quiz/demo/03.jpg",
"q": "",
"s": 0,
"mv": "focus"
},
{
"t": "diapo",
"img": "img/labo/quiz/demo/04.jpg",
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
"img": "img/labo/quiz/demo/05.jpg",
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
"img": "img/labo/quiz/demo/06.jpg",
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
"img": "img/labo/quiz/demo/07.jpg",
"q": "",
"s": 0
},
{
"q": "Le ménage de l'atelier apparaît tout seul à la fin du cours.",
"ch": [
"Vrai",
"Faux"
],
"bon": 0,
"s": 15,
"expl": "La liste prend tout l'écran et les élèves cochent eux-mêmes. Toi, tu supervises."
},
{
"t": "diapo",
"img": "img/labo/quiz/demo/08.jpg",
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
"img": "img/labo/quiz/demo/09.jpg",
"q": "",
"s": 0
},
{
"t": "diapo",
"img": "img/labo/quiz/demo/10.jpg",
"q": "",
"s": 0,
"mv": "focus"
},
{
"t": "diapo",
"img": "img/labo/quiz/demo/11.jpg",
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
"img": "img/labo/quiz/demo/12.jpg",
"q": "",
"s": 0,
"lg": [
35.16,
32.27,
29.69,
13.89
]
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
"id": "livre-communiquer",
"exemple": true,
"livre": true,
"titre": "Communiquer en milieu de travail",
"sujet": "Quiz du livre",
"couv": "img/labo/quiz/livres/communiquer-couv.jpg",
"coul": "#185FA5",
"reg": {
"nb": "12",
"melange": "tout"
},
"qs": [
{
"q": "Les employeurs engagent souvent un préposé d'abord pour…",
"ch": [
"Sa rapidité",
"Sa fiabilité et son attitude",
"Ses outils",
"Ses diplômes"
],
"bon": 1,
"s": 20,
"expl": "C'est le savoir-être : la façon de te comporter avec les autres. Le reste, on peut te le montrer.",
"img": "img/labo/quiz/livres/communiquer-01.jpg"
},
{
"q": "Reformuler, c'est…",
"ch": [
"Redire dans tes mots ce que la personne a dit, pour vérifier que tu as compris",
"Répéter mot pour mot ce qu'elle a dit",
"Corriger la façon de parler du locataire",
"Résumer la plainte au gestionnaire par écrit"
],
"bon": 0,
"s": 25,
"expl": "La reformulation évite la majorité des erreurs de communication.",
"img": "img/labo/quiz/livres/communiquer-02.jpg"
},
{
"q": "Pour annoncer une coupure d'eau à une personne âgée, tu…",
"ch": [
"Passes le message par un voisin",
"Parles plus fort, de loin",
"Parles lentement, face à elle, et laisses une trace écrite",
"Glisses seulement un avis sous la porte"
],
"bon": 2,
"s": 25,
"expl": "Même respect, avec un peu plus de patience et d'attention.",
"img": "img/labo/quiz/livres/communiquer-03.jpg"
},
{
"q": "À la radio, comment dit-on la lettre D ?",
"ch": [
"Denis",
"Delta",
"Dakota",
"David"
],
"bon": 1,
"s": 20,
"expl": "On utilise l'alphabet phonétique international : B, D, P et T se ressemblent à la radio."
},
{
"q": "À la radio, le modèle « BK-40T » se dit…",
"ch": [
"Bravo, Kilo, 40, Thomas",
"Bé, Ka, quarante, Té",
"Bêta, Kappa, 40, Tau",
"Bravo, Kilo, tiret, 4, 0, Tango"
],
"bon": 3,
"s": 20,
"expl": "Chaque lettre devient un mot de l'alphabet phonétique."
},
{
"q": "Complète : « Le robinet ___ changé. »",
"ch": [
"est",
"et"
],
"bon": 0,
"s": 20,
"expl": "« est » se remplace par « était » : le robinet était changé."
},
{
"q": "Devant un locataire fâché, ton objectif est d'agir…",
"ch": [
"Seulement quand il se met à crier",
"Au niveau 3 : la colère",
"Après avoir appelé ton gestionnaire",
"Au niveau 1 ou 2 : agacement ou frustration"
],
"bon": 3,
"s": 25,
"expl": "Plus tu reconnais tôt les signes, plus il est facile de faire baisser la tension."
},
{
"q": "Voix plus forte, répétitions, reproches : c'est quel niveau ?",
"ch": [
"La colère",
"Le calme",
"La frustration",
"L'agacement"
],
"bon": 2,
"s": 20,
"expl": "Ta réaction : reformule, reste calme, propose une solution."
},
{
"q": "Un locataire t'offre de l'argent pour passer avant les autres. Tu…",
"ch": [
"Refuses : c'est un conflit d'intérêts",
"Acceptes si c'est un petit montant",
"Acceptes, puisque tu restes honnête",
"Acceptes et partages avec ton collègue"
],
"bon": 0,
"s": 20,
"expl": "Même l'apparence de favoritisme nuit à ta réputation et à celle de l'employeur."
},
{
"q": "Pourquoi écrire une consigne au changement de quart ?",
"ch": [
"Parce que les collègues ne lisent pas leurs textos",
"Parce qu'un message se déforme de bouche à oreille",
"Parce que c'est une règle de la CNESST",
"Parce que c'est plus rapide que de parler"
],
"bon": 1,
"s": 25,
"expl": "« Fuite au 304 » devient « une fuite au 3e, je pense » après trois personnes.",
"img": "img/labo/quiz/livres/communiquer-10.jpg"
},
{
"q": "Dans une équipe d'entretien, ton supérieur immédiat est habituellement…",
"ch": [
"Le syndicat de copropriété",
"Le préposé de soir",
"Le gestionnaire",
"Le propriétaire"
],
"bon": 2,
"s": 20,
"expl": "Tu dois savoir qui décide, à qui tu rends compte et avec qui tu partages l'information."
},
{
"q": "Dans un rapport d'incident, la « description des faits » contient…",
"ch": [
"Ce que le témoin aurait dû faire",
"Ce que tu penses de la personne blessée",
"Ce qui s'est passé, avec les heures, sans opinion",
"Qui est responsable de l'accident"
],
"bon": 2,
"s": 25,
"expl": "On écrit des faits vérifiables : heure, lieu, gestes, témoins."
},
{
"q": "Dans un rapport d'incident, on note le témoin avec…",
"ch": [
"Son prénom seulement",
"Sa signature seulement",
"Sa version écrite à la main",
"Son nom, son logement et son numéro de téléphone"
],
"bon": 3,
"s": 25,
"expl": "Il faut pouvoir le joindre plus tard."
},
{
"q": "Pour un locataire, l'image du préposé, c'est…",
"ch": [
"L'image de l'immeuble",
"L'affaire du gestionnaire seulement",
"Moins importante que la vitesse du travail",
"Une affaire personnelle"
],
"bon": 0,
"s": 25,
"expl": "Un préposé soigné inspire confiance : on le laisse entrer plus facilement.",
"img": "img/labo/quiz/livres/communiquer-14.jpg"
},
{
"q": "Cris, gestes brusques, doigt pointé : c'est le niveau…",
"ch": [
"De la frustration",
"Du calme",
"De la colère",
"De l'agacement"
],
"bon": 2,
"s": 20,
"expl": "À ce niveau, pense à ta sécurité : garde ta distance et sache quand te retirer."
},
{
"q": "Complète : « ___ outils-là sont à moi. »",
"ch": [
"Ses",
"C'est",
"S'est",
"Ces"
],
"bon": 3,
"s": 20,
"expl": "Ces = ceux-là. Ses = les siens. C'est = cela est."
},
{
"q": "Complète : « Les locataires ___ reçu l'avis. »",
"ch": [
"ont",
"on"
],
"bon": 0,
"s": 20,
"expl": "« ont » se remplace par « avaient »."
},
{
"q": "Au début de son quart, le préposé…",
"ch": [
"Lit le registre du collègue de nuit et confirme qu'il est en poste",
"Attend les appels des locataires",
"Vide les poubelles avant tout",
"Commence par ses courriels personnels"
],
"bon": 0,
"s": 25,
"expl": "Presque chaque heure du quart comporte un échange."
},
{
"q": "Lesquels font partie du savoir-être ?",
"t": "multi",
"ch": [
"La politesse",
"La ponctualité",
"Savoir souder",
"La fiabilité"
],
"bon": [
0,
1,
3
],
"s": 25,
"expl": "Le savoir-être, c'est la façon de te comporter avec les autres."
},
{
"q": "Place les niveaux de l'escalade de la colère, du plus faible au plus fort.",
"t": "ordre",
"ch": [
"Agacement",
"Frustration",
"Colère"
],
"bon": [
0,
1,
2
],
"s": 40,
"expl": "Ton objectif : agir au niveau 1 ou 2."
},
{
"q": "Trouve l'erreur dans cette phrase.",
"t": "erreur",
"ch": [
"À la radio, la lettre B",
"se dit « Bravo »",
"et la lettre D",
"se dit « David »."
],
"bon": 3,
"s": 30,
"expl": "D se dit « Delta »."
},
{
"q": "Zoom mystère : que fait le préposé ?",
"ch": [
"Le préposé lit un manuel",
"Le préposé remet une facture",
"Le préposé prend une photo",
"Le préposé laisse une trace écrite"
],
"bon": 3,
"s": 20,
"expl": "Avec une personne âgée : parler lentement, face à elle, et laisser une trace écrite.",
"img": "img/labo/quiz/livres/communiquer-22.jpg",
"zoom": {
"x": 78,
"y": 45
}
}
]
},
{
"id": "livre-dispositifs-electriques-c9",
"exemple": true,
"livre": true,
"titre": "Dispositifs électriques et électroniques",
"sujet": "Quiz du livre",
"couv": "img/labo/quiz/livres/dispositifs-electriques-c9-couv.jpg",
"coul": "#E0892B",
"reg": {
"nb": "12",
"melange": "tout"
},
"qs": [
{
"q": "Un voltmètre mesure toujours…",
"ch": [
"Une différence entre deux points",
"Le courant dans le fil",
"La tension d'un seul point",
"La résistance du circuit"
],
"bon": 0,
"s": 20,
"expl": "Comme l'altitude : on mesure toujours par rapport à un autre point."
},
{
"q": "Tu lis 0 V aux bornes d'un contact fermé. Ça veut dire…",
"ch": [
"Pas forcément sans danger : les deux bornes peuvent être à 120 V",
"Que le circuit est hors tension",
"Que le contact est brûlé",
"Que le voltmètre est défectueux"
],
"bon": 0,
"s": 25,
"expl": "120 V − 120 V = 0 V : les deux bornes sont sous tension !"
},
{
"q": "Quand la bobine du relais est alimentée, le contact NO…",
"ch": [
"Devient un contact NF",
"S'ouvre et coupe la charge",
"Se ferme et alimente la charge",
"Ne change pas"
],
"bon": 2,
"s": 20,
"expl": "La bobine commande; le contact normalement ouvert se ferme."
},
{
"q": "Sur un relais de zone Taco SR501, les bornes T T reçoivent…",
"ch": [
"La valve de zone",
"Le thermostat (24 V)",
"Le circulateur",
"L'alimentation 120 V"
],
"bon": 1,
"s": 20,
"expl": "T T = thermostat : la demande de chaleur.",
"img": "img/labo/quiz/livres/dispositifs-electriques-c9-04.jpg"
},
{
"q": "Deux moteurs de valve de 7,7 VA sur un transfo de 40 VA : ça passe ?",
"ch": [
"Oui, mais seulement en 120 V",
"Oui : 15,4 VA, c'est sous 40 VA",
"Non : ça dépasse 40 VA",
"Non : il faut un transfo par valve"
],
"bon": 1,
"s": 20,
"expl": "7,7 + 7,7 = 15,4 VA."
},
{
"q": "Le L4064 (« fan-limit ») d'une fournaise…",
"ch": [
"Allume la veilleuse",
"Fait partir le ventilateur et coupe le brûleur si le plénum surchauffe",
"Règle la vitesse du ventilateur",
"Mesure le CO dans le plénum"
],
"bon": 1,
"s": 25,
"expl": "Une seule commande sur le plénum fait deux travaux : ventilateur et limite.",
"img": "img/labo/quiz/livres/dispositifs-electriques-c9-06.jpg"
},
{
"q": "Sur le L4064 illustré, la limite coupe le brûleur à…",
"ch": [
"200 °F",
"100 °F",
"250 °F",
"125 °F"
],
"bon": 0,
"s": 20,
"expl": "Réglages illustrés : arrêt ventilateur 100 °F, départ 125 °F, limite 200 °F."
},
{
"q": "Un filtre bouché sur une fournaise fait surtout…",
"ch": [
"Surchauffer le plénum : la limite coupe le brûleur",
"Démarrer le ventilateur plus tôt",
"Baisser la température du plénum",
"Ouvrir le disjoncteur"
],
"bon": 0,
"s": 25,
"expl": "Moins d'air passe sur l'échangeur : la chaleur monte jusqu'à la limite."
},
{
"q": "Le protectorelais R8184G voit la flamme grâce à…",
"ch": [
"Une thermopile",
"Une tige d'ionisation",
"Une cellule au CdS (C554A)",
"Un thermocouple"
],
"bon": 2,
"s": 20,
"expl": "La cellule au sulfure de cadmium réagit à la lumière de la flamme."
},
{
"q": "Avec un module d'allumage intermittent, la valve principale s'ouvre…",
"ch": [
"Quand la limite haute s'ouvre",
"Avant l'étincelle",
"Après que la veilleuse est allumée et prouvée",
"Dès que le thermostat demande"
],
"bon": 2,
"s": 25,
"expl": "Le module allume la veilleuse, la prouve, puis ouvre la valve principale."
},
{
"q": "Plus le numéro de calibre AWG est petit…",
"ch": [
"Plus le fil est gros et transporte de courant",
"Plus la gaine est épaisse",
"Plus le fil est mince",
"Plus le fil est long"
],
"bon": 0,
"s": 25,
"expl": "Un fil trop petit chauffe et peut causer un incendie."
},
{
"q": "Un fil de calibre 14 (NMD90) accepte au maximum…",
"ch": [
"30 A",
"10 A",
"15 A",
"20 A"
],
"bon": 2,
"s": 20,
"expl": "Calibre 12 : 20 A; calibre 14 : 15 A."
},
{
"q": "Au repos (bobine non alimentée), le contact fermé d'un relais est…",
"ch": [
"COM-NF",
"COM-NO",
"NO-NF",
"Aucun"
],
"bon": 0,
"s": 20,
"expl": "Le ressort tient la lame contre NF."
},
{
"q": "Un relais de commutation, c'est…",
"ch": [
"Un contacteur de moteur triphasé",
"Un relais à deux bobines",
"Un thermostat avec relais",
"Un relais et son transformateur dans le même boîtier"
],
"bon": 3,
"s": 25,
"expl": "Le RA89A reçoit le 120 V et fournit le 24 V au thermostat par T-T.",
"img": "img/labo/quiz/livres/dispositifs-electriques-c9-14.jpg"
},
{
"q": "Sur le RA89A, le thermostat se branche sur…",
"ch": [
"T-T",
"1-2",
"H-N",
"3-4"
],
"bon": 0,
"s": 20,
"expl": "T-T = 24 V vers le thermostat."
},
{
"q": "Fournaise haut rendement : quand le thermostat demande, il ferme…",
"ch": [
"R-W",
"C-W",
"R-G",
"R-Y"
],
"bon": 0,
"s": 20,
"expl": "La carte reçoit 24 V sur W."
},
{
"q": "Avant d'ouvrir le gaz, la fournaise haut rendement prouve…",
"ch": [
"Seulement le pressostat",
"La flamme, puis le tirage",
"Le tirage, puis l'allumage, puis la flamme",
"Seulement la flamme"
],
"bon": 2,
"s": 25,
"expl": "C'est ta carte routière pour dépanner."
},
{
"q": "Avec un automate programmable, les sécurités (limite haute, bas niveau d'eau)…",
"ch": [
"Ne sont plus nécessaires",
"Sont dans l'automate seulement",
"Sont remplacées par le programme",
"Restent câblées en série sur la chaudière"
],
"bon": 3,
"s": 25,
"expl": "L'automate commande, mais ne protège pas."
},
{
"q": "Deux moteurs de valve de zone de 7,7 VA chacun : combien de VA en tout ?",
"t": "nombre",
"ch": [],
"bon": 15.4,
"s": 45,
"tol": 0.05,
"u": "VA",
"expl": "7,7 + 7,7 = 15,4 VA, sous les 40 VA du transformateur."
},
{
"q": "Lesquels se branchent avec du fil de commande calibre 18 ?",
"t": "multi",
"ch": [
"Les thermostats",
"Les valves de zone",
"Les prises de la cuisine",
"Les relais 24 V"
],
"bon": [
0,
1,
3
],
"s": 25,
"expl": "Les prises demandent du calibre 14 ou 12."
},
{
"q": "Fournaise haut rendement : place les premières étapes dans l'ordre.",
"t": "ordre",
"ch": [
"Le thermostat ferme R-W (demande)",
"Vérifications : limites et pressostat",
"Le tirage est prouvé",
"L'allumage est prêt"
],
"bon": [
0,
1,
2,
3
],
"s": 40,
"expl": "La fournaise prouve tout avant d'ouvrir le gaz."
},
{
"q": "Trouve l'erreur dans cette phrase.",
"t": "erreur",
"ch": [
"Au repos, le ressort",
"tient la lame",
"contre le contact NO,",
"donc COM-NF est fermé."
],
"bon": 2,
"s": 30,
"expl": "Au repos, la lame est contre NF."
},
{
"q": "Zoom mystère : qu'est-ce que c'est ?",
"ch": [
"Un aquastat",
"Un transformateur 40 VA",
"Un relais de zone Taco SR501",
"Un protectorelais R8184G"
],
"bon": 2,
"s": 20,
"expl": "Ses bornes T T reçoivent le thermostat.",
"img": "img/labo/quiz/livres/dispositifs-electriques-c9-23.jpg",
"zoom": {
"x": 50,
"y": 60
}
}
]
},
{
"id": "livre-ventilation-climatisation-m11",
"exemple": true,
"livre": true,
"titre": "Ventilation et climatisation",
"sujet": "Quiz du livre",
"couv": "img/labo/quiz/livres/ventilation-climatisation-m11-couv.jpg",
"coul": "#14A3A3",
"reg": {
"nb": "12",
"melange": "tout"
},
"qs": [
{
"q": "Débit d'un diffuseur = vitesse moyenne de l'air ×…",
"ch": [
"L'aire libre de la grille",
"Le nombre de diffuseurs",
"La température de l'air",
"La pression statique"
],
"bon": 0,
"s": 20,
"expl": "On mesure plusieurs points à l'anémomètre, on fait la moyenne, puis × l'aire libre.",
"img": "img/labo/quiz/livres/ventilation-climatisation-m11-01.jpg"
},
{
"q": "Une pièce reçoit moins d'air que prévu au devis. On ajuste…",
"ch": [
"Le registre de la branche",
"Le compresseur",
"Le thermostat",
"Le filtre"
],
"bon": 0,
"s": 20,
"expl": "On mesure à chaque diffuseur et on équilibre avec les registres."
},
{
"q": "Les volets à lames opposées sont bons pour…",
"ch": [
"Seulement tout ouvrir ou tout fermer",
"Régler finement un débit",
"Filtrer l'air",
"Humidifier l'air"
],
"bon": 1,
"s": 20,
"expl": "Lames parallèles : tout ouvrir ou fermer. Lames opposées : régler finement.",
"img": "img/labo/quiz/livres/ventilation-climatisation-m11-03.jpg"
},
{
"q": "L'humidificateur sert à…",
"ch": [
"Refroidir l'air",
"Enlever l'humidité l'été",
"Ajouter de l'eau à l'air l'hiver",
"Filtrer la poussière"
],
"bon": 2,
"s": 20,
"expl": "Négligé, il cause beaucoup de plaintes."
},
{
"q": "Première étape de l'entretien d'un échangeur d'air (VRC/VRE)",
"ch": [
"Laver le noyau",
"Changer les filtres",
"Vider le drain",
"Arrêter et débrancher (ou cadenasser)"
],
"bon": 3,
"s": 20,
"expl": "On attend aussi l'arrêt des ventilateurs."
},
{
"q": "En climatisation, le préposé n'ouvre jamais…",
"ch": [
"La grille de retour",
"L'accès au filtre",
"Le bac de condensat",
"Le circuit de réfrigérant"
],
"bon": 3,
"s": 20,
"expl": "Mais beaucoup de pannes viennent de l'air et de l'eau : ça, c'est ton travail."
},
{
"q": "Autour de l'unité extérieure, il faut…",
"ch": [
"Planter une haie pour la cacher",
"Coller l'unité au mur",
"Garder un dégagement : pas de haie, de bac ni de neige",
"Mettre une bâche l'été"
],
"bon": 2,
"s": 25,
"expl": "Le serpentin doit rester propre et l'air doit circuler."
},
{
"q": "Le point d'équilibre d'une thermopompe, c'est…",
"ch": [
"La température de l'eau du réservoir",
"La consigne du thermostat",
"La température extérieure où elle fournit juste assez de chaleur",
"La température où elle dégivre"
],
"bon": 2,
"s": 25,
"expl": "Plus il fait froid, plus la maison a besoin de chaleur… et moins la thermopompe en fournit.",
"img": "img/labo/quiz/livres/ventilation-climatisation-m11-08.jpg"
},
{
"q": "Plus froid que le point d'équilibre, il faut…",
"ch": [
"Un chauffage d'appoint",
"Baisser le thermostat",
"Plus de ventilation",
"Arrêter la thermopompe"
],
"bon": 0,
"s": 20,
"expl": "Les deux courbes se croisent au point d'équilibre."
},
{
"q": "Un thermostat programmable…",
"ch": [
"Remplace la plinthe électrique",
"Doit toujours être branché au Wi-Fi",
"Change la consigne selon un horaire (nuit, absence)",
"Mesure le CO₂"
],
"bon": 2,
"s": 25,
"expl": "Les occupants y touchent beaucoup : c'est souvent là que commencent les plaintes."
},
{
"q": "Un ventilateur sort l'air vicié et l'air frais entre par les fuites. Le bâtiment est…",
"ch": [
"En pression négative",
"En pression positive",
"En pression neutre",
"Sans pression"
],
"bon": 0,
"s": 20,
"expl": "C'est la ventilation par extraction."
},
{
"q": "La ventilation naturelle est…",
"ch": [
"Contrôlée par un ventilateur",
"Interdite dans les écoles",
"Gratuite, mais impossible à contrôler",
"Toujours en pression positive"
],
"bon": 2,
"s": 20,
"expl": "Elle passe par les fenêtres, les fissures et le tirage."
},
{
"q": "Déflexion d'une courroie : environ…",
"ch": [
"1/4 po par pouce de portée",
"1 po au total",
"1/64 po par pouce de portée",
"1/16 po par pouce de portée"
],
"bon": 2,
"s": 20,
"expl": "Trop tendue, elle détruit les roulements; trop lâche, elle glisse.",
"img": "img/labo/quiz/livres/ventilation-climatisation-m11-13.jpg"
},
{
"q": "Un échangeur d'air sort plus d'air qu'il n'en fait entrer. La maison est…",
"ch": [
"En pression positive",
"En pression négative",
"En surpression",
"Équilibrée"
],
"bon": 1,
"s": 20,
"expl": "Risque : refoulement d'un foyer ou d'un appareil à combustion."
},
{
"q": "Plus d'air frais que d'évacuation, c'est…",
"ch": [
"Un débit équilibré",
"Une ventilation naturelle",
"Une pression négative : courants d'air",
"Une pression positive : l'air humide est poussé dans les murs"
],
"bon": 3,
"s": 25
},
{
"q": "Une chambre froide commerciale est habituellement entre…",
"ch": [
"2 et 4 °C",
"0 et −2 °C",
"8 et 10 °C",
"−18 et −20 °C"
],
"bon": 0,
"s": 20,
"expl": "L'alarme est réglée plus haut (ex. 7 °C)."
},
{
"q": "Régulation pneumatique : le thermostat envoie un signal de…",
"ch": [
"Environ 20 psi",
"3 à 15 psi",
"0 à 10 V",
"60 à 90 psi"
],
"bon": 1,
"s": 20,
"expl": "Réservoir 60 à 90 psi, principale ≈ 20 psi, signal 3 à 15 psi."
},
{
"q": "Station de cadenassage : la règle de base…",
"ch": [
"Un cadenas par équipe",
"Une clé pour tout le monde",
"Le contremaître garde toutes les clés",
"Un travailleur, un cadenas, une clé"
],
"bon": 3,
"s": 20,
"expl": "Chacun protège sa propre vie."
},
{
"q": "L'air passe à 500 pi/min dans une grille d'aire libre de 0,3 pi². Débit ?",
"t": "nombre",
"ch": [],
"bon": 150,
"s": 45,
"tol": 1,
"u": "pcm",
"expl": "Débit = vitesse × aire libre = 500 × 0,3 = 150 pcm."
},
{
"q": "Quels modes de ventilation utilisent un ventilateur ?",
"t": "multi",
"ch": [
"Par alimentation",
"Équilibrée",
"Naturelle",
"Par extraction"
],
"bon": [
0,
1,
3
],
"s": 25,
"expl": "La ventilation naturelle passe par les fenêtres, les fissures et le tirage."
},
{
"q": "Entretien d'un échangeur d'air : dans l'ordre.",
"t": "ordre",
"ch": [
"Arrêter et débrancher",
"Nettoyer les filtres",
"Nettoyer le noyau"
],
"bon": [
0,
1,
2
],
"s": 40
},
{
"q": "Trouve l'erreur dans cette phrase.",
"t": "erreur",
"ch": [
"Plus d'évacuation que d'air frais",
"met la maison",
"en pression positive."
],
"bon": 2,
"s": 30,
"expl": "Plus d'évacuation que d'air frais = pression négative."
}
]
},
{
"id": "livre-notions-energie-c13",
"exemple": true,
"livre": true,
"titre": "Notions d'énergie",
"sujet": "Quiz du livre",
"couv": "img/labo/quiz/livres/notions-energie-c13-couv.jpg",
"coul": "#0F6E56",
"reg": {
"nb": "12",
"melange": "tout"
},
"qs": [
{
"q": "La géothermie capte la chaleur…",
"ch": [
"Du réseau d'aqueduc",
"De l'air extérieur",
"Du sol (environ 8 °C, stable)",
"Du soleil, directement"
],
"bon": 2,
"s": 20,
"expl": "L'aérothermie capte l'air; le solaire chauffe l'eau directement.",
"img": "img/labo/quiz/livres/notions-energie-c13-01.jpg"
},
{
"q": "Le COP d'un système géothermique est d'environ…",
"ch": [
"3 à 4",
"0,8",
"1",
"10 à 12"
],
"bon": 0,
"s": 20,
"expl": "Il fournit 3 à 4 fois plus de chaleur qu'il ne consomme d'électricité, toute l'année."
},
{
"q": "L'enveloppe du bâtiment doit…",
"ch": [
"Seulement être étanche",
"Isoler, être étanche à l'air et contrôler l'humidité",
"Laisser fuir l'air pour respirer",
"Seulement isoler"
],
"bon": 1,
"s": 25,
"expl": "Toit, murs, fenêtres, portes, fondation et plancher.",
"img": "img/labo/quiz/livres/notions-energie-c13-03.jpg"
},
{
"q": "La chaleur qui passe à travers les murs et les vitres, c'est…",
"ch": [
"La conduction",
"Les fuites d'air",
"Le rayonnement solaire",
"La ventilation"
],
"bon": 0,
"s": 20,
"expl": "Les fuites d'air passent par les fissures, la porte et le grenier."
},
{
"q": "Formule de base en hydronique : Q (BTU/h) =",
"ch": [
"débit (GPM) ÷ ΔT",
"500 × débit (GPM) × ΔT (°F)",
"70 × débit (GPM) × ΔT (°F)",
"8,33 × débit (GPM)"
],
"bon": 1,
"s": 20,
"expl": "En métrique : Q (W) ≈ 70 × débit (L/min) × ΔT (°C).",
"img": "img/labo/quiz/livres/notions-energie-c13-05.jpg"
},
{
"q": "D'où vient le 500 de la formule ?",
"ch": [
"8,33 lb par gallon × 60 minutes",
"Une constante de pression",
"Le nombre de pieds dans un mille",
"Les BTU d'une livre de vapeur"
],
"bon": 0,
"s": 20,
"expl": "8,33 × 60 ≈ 500."
},
{
"q": "Dans une fournaise, l'air de la maison et les gaz brûlés…",
"ch": [
"Se mélangent au démarrage seulement",
"Sortent ensemble par l'évent",
"Ne se mélangent jamais : l'échangeur les sépare",
"Se mélangent dans le plénum"
],
"bon": 2,
"s": 25,
"expl": "Les gaz passent dans l'échangeur et sortent par l'évent.",
"img": "img/labo/quiz/livres/notions-energie-c13-07.jpg"
},
{
"q": "Dans un réseau mal équilibré, les émetteurs près de la chaudière…",
"ch": [
"Ne reçoivent pas assez de débit",
"Reçoivent trop de débit",
"Ne changent rien",
"Restent toujours froids"
],
"bon": 1,
"s": 20,
"expl": "L'eau prend toujours le chemin le plus facile; le retour inversé aide à équilibrer.",
"img": "img/labo/quiz/livres/notions-energie-c13-08.jpg"
},
{
"q": "La pompe à mazout d'un brûleur à pulvérisation pousse le mazout à…",
"ch": [
"500 lb/po²",
"100 à 150 lb/po²",
"5 à 10 lb/po²",
"1 lb/po²"
],
"bon": 1,
"s": 20,
"expl": "Le moteur fait tourner le ventilateur et la pompe sur le même arbre.",
"img": "img/labo/quiz/livres/notions-energie-c13-09.jpg"
},
{
"q": "Pour économiser l'énergie, on commence par…",
"ch": [
"Réduire les besoins : isolation, étanchéité, fenêtres",
"Installer des panneaux solaires",
"Récupérer la chaleur avec un VRC",
"Acheter l'appareil le plus efficace"
],
"bon": 0,
"s": 25,
"expl": "Un appareil très efficace dans une maison qui fuit gaspille quand même.",
"img": "img/labo/quiz/livres/notions-energie-c13-10.jpg"
},
{
"q": "Conversion : R =",
"ch": [
"RSI × 3,412",
"RSI ÷ 5,678",
"RSI × 5,678",
"1 ÷ RSI"
],
"bon": 2,
"s": 20,
"expl": "R en unités impériales, RSI en métrique."
},
{
"q": "La valeur U, c'est…",
"ch": [
"1 ÷ RSI : la chaleur qui passe",
"RSI × 5,678",
"La résistance d'un matériau",
"La même chose que R"
],
"bon": 0,
"s": 20,
"expl": "Plus U est petit, mieux ça isole."
},
{
"q": "Plus la valeur R est élevée…",
"ch": [
"Moins le mur est étanche",
"Plus le matériau isole",
"Plus U est élevé",
"Plus la chaleur passe"
],
"bon": 1,
"s": 20
},
{
"q": "Le thermostat d'une plinthe se place…",
"ch": [
"Au plafond",
"Sur un mur intérieur, à environ 1,5 m du plancher",
"Sur un mur extérieur, près de la fenêtre",
"Au-dessus de la plinthe"
],
"bon": 1,
"s": 25,
"expl": "Loin de la fenêtre et de la plinthe.",
"img": "img/labo/quiz/livres/notions-energie-c13-14.jpg"
},
{
"q": "Une pièce perd 1 300 W. Quelle plinthe ?",
"ch": [
"1 500 W",
"1 000 W",
"750 W",
"1 250 W"
],
"bon": 0,
"s": 20,
"expl": "La puissance doit être au moins égale à la perte : on prend la grandeur tout juste supérieure."
},
{
"q": "L'entretien annuel du brûleur se termine toujours par…",
"ch": [
"La purge du réservoir",
"Le changement du gicleur",
"Le nettoyage de la cheminée",
"Une analyse de combustion"
],
"bon": 3,
"s": 20,
"expl": "On remplace aussi le gicleur : son cône se déforme et fait de la suie."
},
{
"q": "Q = 40 000 BTU/h, ΔT = 20 °F. Débit ?",
"ch": [
"2 GPM",
"8 GPM",
"40 GPM",
"4 GPM"
],
"bon": 3,
"s": 20,
"expl": "40 000 ÷ (500 × 20) = 4."
},
{
"q": "Avantage du mazout cité dans le livre…",
"ch": [
"Réservoir sur place : autonomie",
"Aucune émission",
"Prix stable",
"Aucun entretien"
],
"bon": 0,
"s": 20,
"expl": "Inconvénient : prix variable et élevé, émissions."
},
{
"q": "Chaudière de 60 000 BTU/h, ΔT de 20 °F : quel débit ?",
"t": "nombre",
"ch": [],
"bon": 6,
"s": 45,
"tol": 0.1,
"u": "GPM",
"expl": "60 000 ÷ (500 × 20) = 6 GPM."
},
{
"q": "Un isolant a un RSI de 3,5. Quelle est sa valeur R ?",
"t": "nombre",
"ch": [],
"bon": 19.9,
"s": 45,
"tol": 0.2,
"expl": "R = RSI × 5,678 = 19,9."
},
{
"q": "Pour économiser l'énergie, place les étapes dans l'ordre.",
"t": "ordre",
"ch": [
"Réduire les besoins",
"Appareils efficaces",
"Récupérer la chaleur",
"Bien régler",
"Énergies renouvelables"
],
"bon": [
0,
1,
2,
3,
4
],
"s": 40,
"expl": "On commence toujours par la base : réduire les besoins."
},
{
"q": "Trouve l'erreur dans cette phrase.",
"t": "erreur",
"ch": [
"La géothermie capte",
"la chaleur de l'air extérieur",
"avec un COP de 3 à 4."
],
"bon": 1,
"s": 30,
"expl": "La géothermie capte la chaleur du sol; l'aérothermie, celle de l'air."
},
{
"q": "Zoom mystère : qu'est-ce que c'est ?",
"ch": [
"Un circulateur",
"Une fournaise électrique",
"Un chauffe-eau au gaz",
"Un brûleur à l'huile à pulvérisation"
],
"bon": 3,
"s": 20,
"expl": "Moteur, ventilateur, pompe à mazout et allumeur.",
"img": "img/labo/quiz/livres/notions-energie-c13-23.jpg",
"zoom": {
"x": 40,
"y": 50
}
}
]
},
{
"id": "livre-materiel-electrique-c13",
"exemple": true,
"livre": true,
"titre": "Entretien de matériel électrique",
"sujet": "Quiz du livre",
"couv": "img/labo/quiz/livres/materiel-electrique-c13-couv.jpg",
"coul": "#8B6CE0",
"reg": {
"nb": "12",
"melange": "tout"
},
"qs": [
{
"q": "Un grand immeuble reçoit généralement…",
"ch": [
"Du 120/240 V monophasé",
"Du 25 kV jusqu'aux logements",
"Du 12 V",
"Du triphasé 347/600 V"
],
"bon": 3,
"s": 20,
"expl": "La tension est ensuite baissée à l'intérieur pour les prises et l'éclairage.",
"img": "img/labo/quiz/livres/materiel-electrique-c13-01.jpg"
},
{
"q": "Dans la chambre électrique, le transfo sec baisse la tension à…",
"ch": [
"347 V",
"25 kV",
"600 V",
"120/208 V"
],
"bon": 3,
"s": 20,
"expl": "Pour les prises et l'éclairage des logements."
},
{
"q": "Qui peut exécuter des travaux d'installation électrique dans un immeuble ?",
"ch": [
"Le locataire",
"Un entrepreneur électricien",
"Le propriétaire",
"Le préposé"
],
"bon": 1,
"s": 20,
"expl": "Le préposé fait l'entretien dans son champ de compétence."
},
{
"q": "Quel organisme s'occupe de la santé et de la sécurité du travail ?",
"ch": [
"Hydro-Québec",
"La RBQ",
"La CNESST",
"La CMEQ"
],
"bon": 2,
"s": 20
},
{
"q": "Pour mesurer une tension, on branche les pointes…",
"ch": [
"En série dans le circuit",
"En parallèle, de chaque côté de ce qu'on mesure",
"Seulement sur un circuit hors tension",
"Seulement sur la mise à la terre"
],
"bon": 1,
"s": 25,
"expl": "Se tromper de branchement peut endommager l'appareil… ou te blesser."
},
{
"q": "En position AUTO, la génératrice…",
"ch": [
"Démarre seulement à la main",
"Ne démarre jamais seule",
"Est cadenassée",
"Peut démarrer seule à tout moment"
],
"bon": 3,
"s": 20,
"expl": "Panne ou essai programmé : on ne met jamais les mains près des courroies."
},
{
"q": "Pourquoi le local de la génératrice doit-il être ventilé ?",
"ch": [
"Pour refroidir les batteries",
"Pour l'odeur du diesel seulement",
"L'échappement contient du monoxyde de carbone",
"Ce n'est pas nécessaire"
],
"bon": 2,
"s": 25,
"expl": "Le CO est invisible et sans odeur."
},
{
"q": "Une ampoule halogène peut dépasser…",
"ch": [
"1000 °C",
"50 °C",
"80 °C",
"200 °C"
],
"bon": 3,
"s": 20,
"expl": "On laisse refroidir avant de la changer."
},
{
"q": "Un cordon abîmé sur sa longueur : on…",
"ch": [
"Remplace le cordon au complet",
"Met du ruban",
"Fait une épissure au milieu",
"Le raccourcit"
],
"bon": 0,
"s": 20,
"expl": "Même type, même calibre, même nombre de conducteurs.",
"img": "img/labo/quiz/livres/materiel-electrique-c13-09.jpg"
},
{
"q": "Au panneau électrique, le préposé ouvre seulement…",
"ch": [
"Le boîtier du disjoncteur principal",
"Le couvercle",
"La porte, jamais le couvercle",
"L'accès aux barres"
],
"bon": 2,
"s": 20,
"expl": "Derrière la porte : les disjoncteurs et le répertoire.",
"img": "img/labo/quiz/livres/materiel-electrique-c13-10.jpg"
},
{
"q": "Une personne est électrisée. Ton premier geste ?",
"ch": [
"Couper le courant sans toucher la victime",
"La tirer par le bras",
"Appeler avant de faire quoi que ce soit",
"Lui jeter de l'eau"
],
"bon": 0,
"s": 25,
"expl": "Si tu la touches, tu deviens la deuxième victime."
},
{
"q": "Les mesures de résistance et de continuité se font…",
"ch": [
"Sous tension",
"Hors tension, sur un composant isolé",
"Seulement sur le neutre",
"En série dans le circuit"
],
"bon": 1,
"s": 20,
"expl": "Le multimètre envoie lui-même un petit courant."
},
{
"q": "Disjoncteur 15 A en 120 V : puissance maximale ?",
"ch": [
"1 440 W",
"2 400 W",
"1 500 W",
"1 800 W"
],
"bon": 3,
"s": 20,
"expl": "P = U × I = 120 × 15."
},
{
"q": "Même disjoncteur 15 A, charge continue (3 h et plus) : maximum ?",
"ch": [
"1 500 W",
"1 440 W",
"1 800 W",
"1 200 W"
],
"bon": 1,
"s": 20,
"expl": "On limite à 80 % du calibre."
},
{
"q": "Test d'un appareil réparé : de la lame de la fiche au boîtier, on doit lire…",
"ch": [
"Un bip (continuité)",
"120 V",
"OL (circuit ouvert)",
"0 Ω"
],
"bon": 2,
"s": 20,
"expl": "Sinon, le boîtier pourrait être sous tension."
},
{
"q": "Les avertisseurs de fumée récents sont…",
"ch": [
"Raccordés au 240 V",
"À pile seulement",
"Raccordés au 120 V, avec pile de secours, interconnectés",
"Reliés au téléphone"
],
"bon": 2,
"s": 25,
"expl": "Quand l'un sonne, tous sonnent."
},
{
"q": "Un avertisseur de CO est exigé quand…",
"ch": [
"Il y a un appareil à combustion ou un garage attenant",
"Il y a un échangeur d'air",
"Il y a une plinthe électrique",
"Le logement a plus de 3 pièces"
],
"bon": 0,
"s": 25
},
{
"q": "Les essais de la génératrice sont notés…",
"ch": [
"Sur un post-it sur la porte",
"Nulle part si tout va bien",
"Seulement par le technicien, de mémoire",
"Dans le journal d'essai"
],
"bon": 3,
"s": 20,
"expl": "C'est la preuve qu'elle fonctionne le jour où on en a besoin."
},
{
"q": "Disjoncteur 20 A en 120 V : puissance maximale (100 %) ?",
"t": "nombre",
"ch": [],
"bon": 2400,
"s": 45,
"u": "W",
"expl": "P = U × I = 120 × 20 = 2 400 W."
},
{
"q": "Même disjoncteur 20 A, charge continue (80 %) : maximum ?",
"t": "nombre",
"ch": [],
"bon": 1920,
"s": 45,
"u": "W",
"expl": "2 400 × 0,8 = 1 920 W."
},
{
"q": "Avant de changer une ampoule, que fais-tu ?",
"t": "multi",
"ch": [
"Laisser refroidir",
"Visser sans forcer",
"Toucher le culot pour vérifier",
"Couper l'interrupteur"
],
"bon": [
0,
1,
3
],
"s": 25,
"expl": "On se blesse souvent en changeant une ampoule : chute, coupure, brûlure, choc."
},
{
"q": "Trouve l'erreur dans cette phrase.",
"t": "erreur",
"ch": [
"La continuité se mesure",
"sous tension,",
"sur un composant isolé."
],
"bon": 1,
"s": 30,
"expl": "Résistance et continuité se mesurent hors tension."
},
{
"q": "Zoom mystère : qu'est-ce que c'est ?",
"ch": [
"Un transformateur",
"Un groupe électrogène",
"Un compteur d'électricité",
"Un panneau de disjoncteurs"
],
"bon": 3,
"s": 20,
"expl": "Le préposé ouvre seulement la porte, jamais le couvercle.",
"img": "img/labo/quiz/livres/materiel-electrique-c13-23.jpg",
"zoom": {
"x": 50,
"y": 35
}
}
]
},
{
"id": "livre-micro-ordinateur",
"exemple": true,
"livre": true,
"titre": "Utiliser un micro-ordinateur",
"sujet": "Quiz du livre",
"couv": "img/labo/quiz/livres/micro-ordinateur-couv.jpg",
"coul": "#185FA5",
"reg": {
"nb": "12",
"melange": "tout"
},
"qs": [
{
"q": "Quel nom de fichier respecte la règle du livre ?",
"ch": [
"scan0004.pdf",
"2026-10-15_salle-meca_chauffe-eau-3_vidange.pdf",
"Document final (2).pdf",
"chauffe eau.pdf"
],
"bon": 1,
"s": 25,
"expl": "La date d'abord, puis le lieu, puis le sujet."
},
{
"q": "Pourquoi mettre la date AAAA-MM-JJ au début du nom ?",
"ch": [
"Pour l'envoyer plus vite",
"Les fichiers se placent tout seuls en ordre chronologique",
"Windows l'exige",
"Pour cacher le fichier"
],
"bon": 1,
"s": 25
},
{
"q": "Quel fichier téléchargé est le plus risqué ?",
"ch": [
".docx",
".pdf",
".jpg",
".exe"
],
"bon": 3,
"s": 20,
"expl": "Un programme peut contenir un virus; un PDF est à faible risque.",
"img": "img/labo/quiz/livres/micro-ordinateur-03.jpg"
},
{
"q": "Par défaut, un fichier téléchargé va dans le dossier…",
"ch": [
"Documents",
"Corbeille",
"Téléchargements",
"Bureau"
],
"bon": 2,
"s": 20,
"expl": "Ensuite, déplace-le dans le bon dossier avec un bon nom."
},
{
"q": "Dans une équipe d'entretien, Teams remplace surtout…",
"ch": [
"Le téléphone d'urgence",
"Le courriel du gestionnaire",
"Le registre d'entretien",
"Les textos éparpillés"
],
"bon": 3,
"s": 20,
"expl": "Tout le monde voit la même information, au même endroit.",
"img": "img/labo/quiz/livres/micro-ordinateur-05.jpg"
},
{
"q": "Un rapport d'intervention raconte…",
"ch": [
"Les faits, dans l'ordre, avec les preuves (photos)",
"Les excuses de l'équipe",
"Ton opinion sur le locataire",
"Seulement le coût des pièces"
],
"bon": 0,
"s": 25,
"expl": "En-tête : date, lieu, équipement, ton nom.",
"img": "img/labo/quiz/livres/micro-ordinateur-06.jpg"
},
{
"q": "Le registre d'entretien dans Excel, c'est…",
"ch": [
"Des notes libres, sans colonnes",
"Une ligne par intervention, toujours les mêmes colonnes",
"Une feuille par jour",
"Un fichier par intervention"
],
"bon": 1,
"s": 25,
"expl": "C'est la mémoire de l'immeuble.",
"img": "img/labo/quiz/livres/micro-ordinateur-07.jpg"
},
{
"q": "Pour résumer 100 bons de travail par équipement, on utilise…",
"ch": [
"Word",
"Un graphique en secteurs seulement",
"Un tableau croisé dynamique",
"La fonction SOMME sur chaque ligne"
],
"bon": 2,
"s": 20,
"expl": "Combien de bons, combien d'heures, par équipement ou par mois."
},
{
"q": "Coller les coordonnées d'un locataire dans une IA publique…",
"ch": [
"N'a aucune importance",
"Peut être un incident selon la Loi 25",
"Est toujours permis",
"Est permis si c'est pour un courriel"
],
"bon": 1,
"s": 20,
"expl": "Les renseignements personnels doivent être protégés."
},
{
"q": "Quelle demande à une IA est une bonne pratique au travail ?",
"ch": [
"« Écris le rapport, je ne le relirai pas »",
"« Invente les heures travaillées de la semaine »",
"« Trouve le mot de passe du locataire »",
"« Corrige les fautes de ce rapport sans changer les faits »"
],
"bon": 3,
"s": 25,
"expl": "Tu restes responsable de ce que tu envoies : relis toujours.",
"img": "img/labo/quiz/livres/micro-ordinateur-10.jpg"
},
{
"q": "Le haut de l'écran doit être…",
"ch": [
"À la hauteur du menton",
"À la hauteur des yeux",
"Plus haut que la tête",
"Au niveau de la table"
],
"bon": 1,
"s": 20,
"expl": "Écran à une longueur de bras (50 à 70 cm)."
},
{
"q": "Distance conseillée entre tes yeux et l'écran",
"ch": [
"50 à 70 cm",
"Le plus proche possible",
"20 à 30 cm",
"1 à 1,5 m"
],
"bon": 0,
"s": 20
},
{
"q": "Si le portable est volé, les fichiers dans OneDrive…",
"ch": [
"Sont encore sur les serveurs de Microsoft",
"Sont perdus",
"Sont dans la corbeille",
"Sont sur la clé USB"
],
"bon": 0,
"s": 25,
"expl": "OneDrive garde une copie et synchronise tes appareils.",
"img": "img/labo/quiz/livres/micro-ordinateur-13.jpg"
},
{
"q": "Pour agrandir une photo dans Word sans la déformer, on tire…",
"ch": [
"Le bord de la page",
"Une poignée de côté",
"Une poignée de coin",
"La règle"
],
"bon": 2,
"s": 20,
"expl": "Une poignée de côté l'écrase ou l'étire.",
"img": "img/labo/quiz/livres/micro-ordinateur-14.jpg"
},
{
"q": "Pour enlever le pied du locataire sur une photo dans Word…",
"ch": [
"Format de l'image → Rogner",
"Habillage",
"Insérer une légende",
"Supprimer"
],
"bon": 0,
"s": 20
},
{
"q": "« Salut, c'est Marc. Paie la facture urgente, nouveau compte. » Tu…",
"ch": [
"Transfères à un collègue",
"Paies vite, c'est urgent",
"Réponds avec le code de la porte",
"Vérifies en rappelant au numéro que tu connais"
],
"bon": 3,
"s": 25,
"expl": "L'IA peut imiter une voix avec quelques secondes d'enregistrement."
},
{
"q": "Quelle date respecte le format du livre ?",
"ch": [
"15-10-2026",
"2026-10-15",
"15 oct 26",
"10/15/2026"
],
"bon": 1,
"s": 20,
"expl": "AAAA-MM-JJ : les fichiers se classent en ordre."
},
{
"q": "Outlook dans le navigateur (outlook.office.com) et l'application…",
"ch": [
"Ont des boîtes différentes",
"Montrent les mêmes messages",
"Sont pour deux comptes différents",
"Ne se synchronisent jamais"
],
"bon": 1,
"s": 20,
"img": "img/labo/quiz/livres/micro-ordinateur-18.jpg"
},
{
"q": "Un bon nom de fichier : dans quel ordre ?",
"t": "ordre",
"ch": [
"La date (AAAA-MM-JJ)",
"Le lieu",
"Le sujet"
],
"bon": [
0,
1,
2
],
"s": 40,
"expl": "Ex. : 2026-10-15_salle-meca_chauffe-eau-3_vidange.pdf"
},
{
"q": "Quels fichiers téléchargés sont à risque élevé ?",
"t": "multi",
"ch": [
".bat",
".exe",
".pdf",
".msi"
],
"bon": [
0,
1,
3
],
"s": 25,
"expl": "Un programme peut contenir un virus; un PDF est à faible risque."
},
{
"q": "Trouve l'erreur dans cette phrase.",
"t": "erreur",
"ch": [
"Si le portable est volé,",
"les fichiers dans OneDrive",
"sont perdus pour toujours."
],
"bon": 2,
"s": 30,
"expl": "OneDrive garde une copie sur les serveurs de Microsoft."
},
{
"q": "Zoom mystère : qu'est-ce que c'est ?",
"ch": [
"Une mise à jour de Windows",
"Un courriel du gestionnaire",
"Une fausse alerte de sécurité (arnaque)",
"Un antivirus légitime"
],
"bon": 2,
"s": 20,
"expl": "Ne clique sur rien et n'appelle pas le numéro.",
"img": "img/labo/quiz/livres/micro-ordinateur-22.jpg",
"zoom": {
"x": 50,
"y": 30
}
}
]
},
{
"id": "livre-plomberie-chauffage",
"exemple": true,
"livre": true,
"titre": "Plomberie et chauffage",
"sujet": "Quiz du livre",
"couv": "img/labo/quiz/livres/plomberie-chauffage-couv.jpg",
"coul": "#B3261E",
"reg": {
"nb": "12",
"melange": "tout"
},
"qs": [
{
"q": "Sur un ruban à mesurer, chaque pouce est divisé en…",
"ch": [
"16 parties égales",
"8 parties",
"12 parties",
"10 parties"
],
"bon": 0,
"s": 20,
"expl": "Plus la ligne est longue, plus la fraction est « grosse »."
},
{
"q": "La soudure capillaire fonctionne grâce à…",
"ch": [
"La capillarité : la soudure est aspirée dans le jeu mince",
"La pression de l'eau",
"Le flux qui colle",
"Le serrage du raccord"
],
"bon": 0,
"s": 25,
"expl": "Comme le café qui monte dans un morceau de sucre.",
"img": "img/labo/quiz/livres/plomberie-chauffage-02.jpg"
},
{
"q": "Le jeu entre le tuyau et le raccord est d'environ…",
"ch": [
"1/4 de pouce",
"5 mm",
"Aucun jeu",
"L'épaisseur d'une feuille de papier"
],
"bon": 3,
"s": 20
},
{
"q": "« Soudure à l'étain » se dit en anglais…",
"ch": [
"Soldering / Sweating",
"Crimping",
"Welding",
"Brazing"
],
"bon": 0,
"s": 20,
"expl": "Sertissage = Press / Crimp."
},
{
"q": "Pour le traitement de l'eau, le préposé…",
"ch": [
"Change les cartouches, ajoute le sel et surveille les signes de problème",
"Ne touche jamais à rien",
"Règle la dureté de l'aqueduc",
"Choisit l'équipement"
],
"bon": 0,
"s": 25,
"img": "img/labo/quiz/livres/plomberie-chauffage-05.jpg"
},
{
"q": "L'appareil qui génère le plus de bons de travail dans un immeuble ?",
"ch": [
"Le chauffe-eau",
"La toilette",
"Le lave-vaisselle",
"Le drain de plancher"
],
"bon": 1,
"s": 20,
"expl": "Une toilette qui coule peut gaspiller plusieurs centaines de litres par jour."
},
{
"q": "La toilette coule sans arrêt : l'eau entre dans le trop-plein. On…",
"ch": [
"Ajoute un clapet",
"Baisse le flotteur",
"Remplace le robinet d'arrêt",
"Change la cuvette"
],
"bon": 1,
"s": 20,
"expl": "Le niveau est trop haut."
},
{
"q": "« Anode sacrificielle » se dit en anglais…",
"ch": [
"Sacrificial anode rod",
"Baffle",
"Drain valve",
"Dip tube"
],
"bon": 0,
"s": 20,
"expl": "Dip tube = tube plongeur."
},
{
"q": "Un brûleur à l'huile qui manque d'air produit…",
"ch": [
"Une flamme plus propre",
"De la suie et du monoxyde de carbone",
"De la chaleur perdue dans la cheminée",
"Un meilleur rendement"
],
"bon": 1,
"s": 20,
"expl": "Trop d'air : la chaleur part dans la cheminée."
},
{
"q": "L'entretien préventif se fait…",
"ch": [
"Seulement après une panne",
"Quand un locataire se plaint",
"Une fois tous les 10 ans",
"Selon un calendrier, avant que le problème arrive"
],
"bon": 3,
"s": 25,
"expl": "Plus le préventif est bien fait, moins il y a d'appels la nuit."
},
{
"q": "Avec un coupe-tube, on serre…",
"ch": [
"Un quart de tour à chaque tour",
"Seulement à la fin",
"Un tour complet à chaque tour",
"Le plus fort possible dès le départ"
],
"bon": 0,
"s": 20,
"expl": "Coupe d'équerre, puis on ébavure."
},
{
"q": "La bavure laissée à l'intérieur d'un tuyau…",
"ch": [
"Freine l'eau, fait du bruit et use le tuyau",
"N'a aucun effet",
"Améliore l'étanchéité",
"Aide la soudure à entrer"
],
"bon": 0,
"s": 25
},
{
"q": "Longueur de tuyau à couper =",
"ch": [
"Centre à centre − les deux prises",
"Centre à centre − une prise",
"Centre à centre + les deux prises",
"Centre à centre seulement"
],
"bon": 0,
"s": 20,
"expl": "La prise (take-off) va du centre du raccord au fond de l'emboîture."
},
{
"q": "L'eau de pluie va…",
"ch": [
"Au puisard du voisin",
"Dans la colonne de chute",
"Au réseau d'évacuation sanitaire",
"Au terrain, aux gouttières et au drain français"
],
"bon": 3,
"s": 25,
"expl": "Rallonges : 1,5 à 2 m du mur.",
"img": "img/labo/quiz/livres/plomberie-chauffage-14.jpg"
},
{
"q": "Une chaudière en fonte en sections…",
"ch": [
"Ne dure pas longtemps",
"Est très légère",
"Craint les chocs thermiques",
"Craint le mazout"
],
"bon": 2,
"s": 20,
"expl": "Très durable, mais lourde."
},
{
"q": "Brûleur à l'huile : trop d'air donne…",
"ch": [
"De la suie",
"De la chaleur perdue dans la cheminée",
"Du monoxyde de carbone",
"Une flamme jaune"
],
"bon": 1,
"s": 20,
"expl": "Pas assez d'air : suie et CO."
},
{
"q": "Sur un ruban, la plus petite marque entre deux pouces vaut…",
"ch": [
"1/4 po",
"1/16 po",
"1/8 po",
"1/32 po"
],
"bon": 1,
"s": 20
},
{
"q": "Le registre d'entretien sert à…",
"ch": [
"Remplacer le bon de travail",
"Calculer la paie",
"Garder la mémoire de chaque système",
"Noter les plaintes des voisins"
],
"bon": 2,
"s": 20,
"expl": "Ensemble, bon et registre montrent les problèmes qui reviennent."
},
{
"q": "Combien de seizièmes dans 3/4 de pouce ?",
"t": "nombre",
"ch": [],
"bon": 12,
"s": 45,
"u": "/16",
"expl": "3/4 = 12/16."
},
{
"q": "Centre à centre de 24 po, prise de 1/2 po à chaque bout : longueur à couper ?",
"t": "nombre",
"ch": [],
"bon": 23,
"s": 45,
"u": "po",
"expl": "24 − 1/2 − 1/2 = 23 po."
},
{
"q": "Préparer un joint de cuivre : dans l'ordre.",
"t": "ordre",
"ch": [
"Couper d'équerre",
"Ébavurer",
"Nettoyer le tuyau et le raccord",
"Appliquer le flux",
"Chauffer et souder"
],
"bon": [
0,
1,
2,
3,
4
],
"s": 40,
"expl": "Un joint étanche commence par une coupe d'équerre et un tuyau propre et ébavuré."
},
{
"q": "Pour un traitement d'eau, que fait le préposé ?",
"t": "multi",
"ch": [
"Ajouter le sel",
"Surveiller les signes de problème",
"Choisir l'équipement",
"Changer les cartouches"
],
"bon": [
0,
1,
3
],
"s": 25,
"expl": "Il entretient l'équipement; il ne le choisit pas."
},
{
"q": "Trouve l'erreur dans cette phrase.",
"t": "erreur",
"ch": [
"Pas assez d'air",
"dans le brûleur, c'est",
"de la chaleur perdue",
"dans la cheminée."
],
"bon": 0,
"s": 30,
"expl": "C'est trop d'air qui envoie la chaleur dans la cheminée. Pas assez d'air : suie et CO."
},
{
"q": "Zoom mystère : qu'est-ce que c'est ?",
"ch": [
"Une pompe de puisard",
"Un réservoir tampon",
"Un chauffe-eau",
"Un adoucisseur d'eau et ses filtres"
],
"bon": 3,
"s": 20,
"img": "img/labo/quiz/livres/plomberie-chauffage-24.jpg",
"zoom": {
"x": 62,
"y": 55
}
}
]
},
{
"id": "livre-lecture-plans-devis-c6",
"exemple": true,
"livre": true,
"titre": "Lecture de plans et devis",
"sujet": "Quiz du livre",
"couv": "img/labo/quiz/livres/lecture-plans-devis-c6-couv.jpg",
"coul": "#854F0B",
"reg": {
"nb": "12",
"melange": "tout"
},
"qs": [
{
"q": "On construit seulement avec les plans…",
"ch": [
"Émis pour construction, à la dernière révision",
"D'une version précédente",
"Pour soumission",
"Préliminaires"
],
"bon": 0,
"s": 25
},
{
"q": "Une révision est montrée sur le plan par…",
"ch": [
"Une étoile",
"Un trait rouge",
"Un astérisque",
"Un nuage et un triangle"
],
"bon": 3,
"s": 20
},
{
"q": "Le plombier voit une erreur dans un plan. Il…",
"ch": [
"Change le plan lui-même",
"L'ignore",
"Pose ses questions par écrit",
"Appelle le client"
],
"bon": 2,
"s": 20,
"expl": "Le plombier ne change pas un plan."
},
{
"q": "Un détail est dessiné à…",
"ch": [
"1:100",
"Petite échelle (1:500)",
"Toujours sans échelle",
"Grande échelle (1:5, 1:10, 1:20)"
],
"bon": 3,
"s": 20,
"expl": "C'est un zoom sur une petite partie du bâtiment.",
"img": "img/labo/quiz/livres/lecture-plans-devis-c6-04.jpg"
},
{
"q": "À 1/4\" = 1'-0\", tu lis 7 pieds et 6 pouces. Ça s'écrit…",
"ch": [
"7\"-6'",
"7,6'",
"7'-6\"",
"76\""
],
"bon": 2,
"s": 20
},
{
"q": "Sur un plan de plomberie, « CC » veut dire…",
"ch": [
"Chauffe-eau commercial",
"Colonne de chauffage",
"Colonne de chute",
"Cuivre coudé"
],
"bon": 2,
"s": 20,
"expl": "En anglais : SS (soil stack)."
},
{
"q": "« RN » veut dire…",
"ch": [
"Réseau neuf",
"Regard de nettoyage",
"Retour nord",
"Robinet normal"
],
"bon": 1,
"s": 20,
"expl": "En anglais : CO (cleanout)."
},
{
"q": "Espacement maximal des supports de l'ABS/PVC horizontal",
"ch": [
"1,2 m",
"2,5 m",
"3,0 m",
"0,8 m"
],
"bon": 0,
"s": 20,
"expl": "Le Code de plomberie fixe l'espacement selon le matériau et le diamètre."
},
{
"q": "Espacement maximal des supports du PEX horizontal",
"ch": [
"3,0 m",
"2,5 m",
"0,8 m",
"1,2 m"
],
"bon": 2,
"s": 20
},
{
"q": "Ø 75, 75 mm et 3″ sur un plan désignent…",
"ch": [
"Le même diamètre nominal",
"L'épaisseur de la paroi",
"Le diamètre mesuré au ruban",
"Trois tuyaux différents"
],
"bon": 0,
"s": 20,
"expl": "C'est un nom commercial, pas une mesure au ruban."
},
{
"q": "Sur un renvoi, le chiffre du haut est…",
"ch": [
"Le numéro de la vue",
"L'échelle",
"Le numéro de la feuille",
"La révision"
],
"bon": 0,
"s": 20,
"expl": "Le bas indique la feuille où se trouve la vue.",
"img": "img/labo/quiz/livres/lecture-plans-devis-c6-11.jpg"
},
{
"q": "Symbole « cercle avec un point » sur un plan de tuyauterie",
"ch": [
"Un regard",
"Le tuyau descend",
"Le tuyau monte (vient vers toi)",
"Un robinet"
],
"bon": 2,
"s": 20,
"expl": "Comme la pointe d'une flèche qui vient vers toi.",
"img": "img/labo/quiz/livres/lecture-plans-devis-c6-12.jpg"
},
{
"q": "Le radier d'un tuyau, c'est…",
"ch": [
"Le dessus du tuyau",
"Le centre du tuyau",
"L'extérieur du tuyau",
"Le fond intérieur du tuyau"
],
"bon": 3,
"s": 20,
"expl": "En anglais : invert."
},
{
"q": "Sur un croquis d'évacuation en élévation, on exagère…",
"ch": [
"La longueur",
"Le diamètre",
"La pente, pour qu'elle se voie",
"Les raccords"
],
"bon": 2,
"s": 20,
"expl": "On écrit quand même les valeurs exactes.",
"img": "img/labo/quiz/livres/lecture-plans-devis-c6-14.jpg"
},
{
"q": "Plan de rénovation : il montre trois catégories…",
"ch": [
"Plomberie, électricité, chauffage",
"Eau froide, eau chaude, évacuation",
"Existant à conserver, à démolir, nouveau",
"Avant, pendant, après"
],
"bon": 2,
"s": 20,
"expl": "Chaque catégorie a son trait.",
"img": "img/labo/quiz/livres/lecture-plans-devis-c6-15.jpg"
},
{
"q": "Réseau à vapeur : le purgeur (T)…",
"ch": [
"Laisse passer la vapeur, retient l'eau",
"Évacue l'air seulement",
"Laisse passer l'eau, retient la vapeur",
"Règle la pression"
],
"bon": 2,
"s": 20,
"expl": "Le condensat (CD) revient à la chaudière par gravité.",
"img": "img/labo/quiz/livres/lecture-plans-devis-c6-16.jpg"
},
{
"q": "« EC » sur un plan de plomberie",
"ch": [
"Évacuation commerciale",
"Eau chaude",
"Entrée de compteur",
"Eau de chauffage"
],
"bon": 1,
"s": 20,
"expl": "En anglais : HW."
},
{
"q": "Un extra (changement demandé par le client), c'est…",
"ch": [
"Un rabais",
"Une erreur du plombier",
"Du travail ajouté au contrat, facturé en plus",
"Une pénalité de retard"
],
"bon": 2,
"s": 25,
"expl": "On calcule matériel + main-d'œuvre + frais."
},
{
"q": "Quelles abréviations concernent l'évacuation ?",
"t": "multi",
"ch": [
"CC (colonne de chute)",
"EC (eau chaude)",
"DP (drain de plancher)",
"EF (eau froide)"
],
"bon": [
0,
2
],
"s": 25,
"expl": "EF et EC concernent l'alimentation."
},
{
"q": "Lire la règle d'architecte : dans l'ordre.",
"t": "ordre",
"ch": [
"Lire l'échelle sous la vue",
"Repérer le titre au bout de l'arête",
"Placer la marque des pieds",
"Lire les pouces à partir du zéro"
],
"bon": [
0,
1,
2,
3
],
"s": 40,
"expl": "Puis on additionne : 7 pieds + 6 pouces = 7'-6\"."
},
{
"q": "Matériel d'un extra : 62,00 $ plus 5 %. Total ?",
"t": "nombre",
"ch": [],
"bon": 65.1,
"s": 45,
"tol": 0.01,
"u": "$",
"expl": "62 × 1,05 = 65,10 $."
},
{
"q": "Trouve l'erreur dans cette phrase.",
"t": "erreur",
"ch": [
"On construit avec",
"les plans préliminaires,",
"à la dernière révision."
],
"bon": 1,
"s": 30,
"expl": "On construit seulement avec les plans émis pour construction."
},
{
"q": "Zoom mystère : qu'est-ce que c'est ?",
"ch": [
"Une traversée de fondation de l'entrée d'eau",
"Un drain de plancher",
"Une colonne de ventilation",
"Un regard de nettoyage"
],
"bon": 0,
"s": 25,
"expl": "Détail à grande échelle (1:5).",
"img": "img/labo/quiz/livres/lecture-plans-devis-c6-23.jpg",
"zoom": {
"x": 50,
"y": 50
}
}
]
},
{
"id": "livre-lecture-plans-batiments-egi",
"exemple": true,
"livre": true,
"titre": "Lecture de plans de bâtiments",
"sujet": "Quiz du livre",
"couv": "img/labo/quiz/livres/lecture-plans-batiments-egi-couv.jpg",
"coul": "#534AB7",
"reg": {
"nb": "12",
"melange": "tout"
},
"qs": [
{
"q": "Quand on plie un plan en accordéon, le cartouche…",
"ch": [
"Va à l'intérieur",
"Est plié en deux",
"Reste toujours sur le dessus",
"Est découpé"
],
"bon": 2,
"s": 20,
"img": "img/labo/quiz/livres/lecture-plans-batiments-egi-01.jpg"
},
{
"q": "Une coupe montre le bâtiment…",
"ch": [
"Vu d'en haut",
"En 3D seulement",
"Comme s'il était scié de haut en bas",
"Vu de l'extérieur"
],
"bon": 2,
"s": 20,
"expl": "On voit l'intérieur des murs, des planchers et des fondations.",
"img": "img/labo/quiz/livres/lecture-plans-batiments-egi-02.jpg"
},
{
"q": "Les axes d'un plan passent généralement par…",
"ch": [
"Les murs porteurs ou le centre des colonnes",
"Les fenêtres",
"Les meubles",
"Les portes"
],
"bon": 0,
"s": 25,
"expl": "Lettres dans un sens, chiffres dans l'autre.",
"img": "img/labo/quiz/livres/lecture-plans-batiments-egi-03.jpg"
},
{
"q": "« L'extincteur est dans la travée E-F / 2-3 » : les axes servent…",
"ch": [
"De numéro de révision",
"D'échelle",
"D'adresse sur le plan",
"De nom de local"
],
"bon": 2,
"s": 20
},
{
"q": "La méthode du croquis d'une pièce :",
"ch": [
"On prend seulement des photos",
"On copie le plan de l'architecte",
"On mesure d'abord, on dessine ensuite",
"On dessine d'abord, on mesure ensuite"
],
"bon": 3,
"s": 20,
"expl": "Ça évite de revenir avec une mesure manquante.",
"img": "img/labo/quiz/livres/lecture-plans-batiments-egi-05.jpg"
},
{
"q": "Un plan d'étage est une coupe horizontale à environ…",
"ch": [
"Au niveau du plafond",
"1,2 m du plancher",
"2,4 m du plancher",
"Au niveau du sol"
],
"bon": 1,
"s": 20,
"expl": "On voit les murs coupés, les portes, les fenêtres.",
"img": "img/labo/quiz/livres/lecture-plans-batiments-egi-06.jpg"
},
{
"q": "Avant de percer un mur, quel plan regardes-tu en premier ?",
"ch": [
"P (plomberie)",
"E (électricité)",
"Aucun : on perce",
"A (architecture) : mur porteur, coupe-feu ou mitoyen ?"
],
"bon": 3,
"s": 25,
"expl": "Ensuite le plan E (les fils), puis le plan P (les tuyaux).",
"img": "img/labo/quiz/livres/lecture-plans-batiments-egi-07.jpg"
},
{
"q": "Tu dois travailler près d'un fil dans le mur. Tu…",
"ch": [
"Perces plus lentement",
"Mets des gants seulement",
"Coupes, cadenasses et vérifies",
"Demandes au locataire"
],
"bon": 2,
"s": 20
},
{
"q": "Un plan d'évacuation doit être orienté…",
"ch": [
"Vers la sortie principale",
"Au choix",
"Comme le lieu où il est affiché",
"Le nord toujours en haut"
],
"bon": 2,
"s": 20,
"img": "img/labo/quiz/livres/lecture-plans-batiments-egi-09.jpg"
},
{
"q": "Que trouve-t-on sur un plan d'évacuation ?",
"ch": [
"Les tuyaux et les fils",
"Seulement les sorties",
"Les cotes des murs",
"« Vous êtes ici », sorties, équipements de sécurité, point de rassemblement"
],
"bon": 3,
"s": 25
},
{
"q": "Dans un cartouche, que vérifies-tu d'abord ?",
"ch": [
"Le dessinateur",
"La révision",
"Le projet : est-ce la feuille de ton chantier ?",
"L'échelle"
],
"bon": 2,
"s": 25,
"expl": "Puis le titre, l'échelle, la révision, le numéro de feuille.",
"img": "img/labo/quiz/livres/lecture-plans-batiments-egi-11.jpg"
},
{
"q": "Le plénum, c'est…",
"ch": [
"Le dessous du plancher",
"La salle mécanique",
"L'espace au-dessus du plafond où passent conduits et fils",
"Le toit"
],
"bon": 2,
"s": 25
},
{
"q": "Un « 2x4 » mesure réellement…",
"ch": [
"1 3/4 × 3 3/4 po",
"2 × 3 1/2 po",
"2 × 4 po",
"1 1/2 × 3 1/2 po (38 × 89 mm)"
],
"bon": 3,
"s": 20,
"expl": "Dimension nominale = un nom, pas une mesure."
},
{
"q": "Dans un mur extérieur, le pare-vapeur est…",
"ch": [
"Au milieu de l'isolant",
"Dans le comble",
"Côté chaud, juste derrière le gypse",
"Côté froid, sous le revêtement"
],
"bon": 2,
"s": 20,
"expl": "Il bloque l'humidité du bâtiment.",
"img": "img/labo/quiz/livres/lecture-plans-batiments-egi-14.jpg"
},
{
"q": "Les montants d'un mur sont souvent espacés de…",
"ch": [
"600 mm c/c",
"300 mm c/c",
"1 200 mm c/c",
"400 mm c/c"
],
"bon": 3,
"s": 20
},
{
"q": "Une prise ne fonctionne plus. Sur le schéma unifilaire, on part…",
"ch": [
"D'Hydro-Québec",
"Du transfo",
"Du disjoncteur principal",
"De la charge et on remonte le trait"
],
"bon": 3,
"s": 20,
"expl": "On trouve le panneau qui l'alimente : on le vérifie d'abord.",
"img": "img/labo/quiz/livres/lecture-plans-batiments-egi-16.jpg"
},
{
"q": "On passe un tuyau dans un mur coupe-feu. Le trou…",
"ch": [
"Se bouche au gypse",
"Se remplit de mousse isolante ordinaire",
"Se laisse ouvert pour la ventilation",
"Se scelle avec un produit coupe-feu homologué"
],
"bon": 3,
"s": 25,
"expl": "Et on garde une trace : photo et registre.",
"img": "img/labo/quiz/livres/lecture-plans-batiments-egi-17.jpg"
},
{
"q": "Sur un plan, une coupe est repérée par…",
"ch": [
"Un nuage",
"Un cercle pointillé",
"Un triangle",
"Une ligne de coupe avec des flèches"
],
"bon": 3,
"s": 20,
"expl": "Les flèches indiquent le sens du regard."
},
{
"q": "Avant de percer un mur : dans quel ordre ?",
"t": "ordre",
"ch": [
"Plan A : le mur est-il porteur ?",
"Plan E : y a-t-il un fil ?",
"Plan P : y a-t-il des tuyaux ?",
"Percer dans la zone sûre"
],
"bon": [
0,
1,
2,
3
],
"s": 40
},
{
"q": "Un mur extérieur, de l'intérieur vers l'extérieur.",
"t": "ordre",
"ch": [
"Gypse",
"Pare-vapeur",
"Montants et isolant",
"Revêtement (OSB)",
"Pare-air"
],
"bon": [
0,
1,
2,
3,
4
],
"s": 40
},
{
"q": "Que trouve-t-on dans le cartouche d'une feuille ?",
"t": "multi",
"ch": [
"L'échelle",
"La révision",
"Le titre de la feuille",
"La liste des locataires"
],
"bon": [
0,
1,
2
],
"s": 25
},
{
"q": "Un 2x6 mesure réellement 1 1/2 po × combien de pouces ?",
"t": "nombre",
"ch": [],
"bon": 5.5,
"s": 45,
"u": "po",
"expl": "Un 2x6 réel : 1 1/2 × 5 1/2 po."
},
{
"q": "Trouve l'erreur dans cette phrase.",
"t": "erreur",
"ch": [
"Le plénum est l'espace",
"sous le plancher",
"où passent conduits et fils."
],
"bon": 1,
"s": 30,
"expl": "Le plénum est au-dessus du plafond."
},
{
"q": "Zoom mystère : qu'est-ce que c'est ?",
"ch": [
"Un plan de plomberie",
"Un plan d'évacuation",
"Un plan d'électricité",
"Un plan de toiture"
],
"bon": 1,
"s": 20,
"expl": "Il montre « Vous êtes ici », les sorties et le point de rassemblement.",
"img": "img/labo/quiz/livres/lecture-plans-batiments-egi-24.jpg",
"zoom": {
"x": 50,
"y": 60
}
}
]
},
{
"id": "livre-travaux-mineurs-egi",
"exemple": true,
"livre": true,
"titre": "Travaux mineurs d'entretien général",
"sujet": "Quiz du livre",
"couv": "img/labo/quiz/livres/travaux-mineurs-egi-couv.jpg",
"coul": "#D9488A",
"reg": {
"nb": "12",
"melange": "tout"
},
"qs": [
{
"q": "Passage libre minimal pour un fauteuil roulant autour d'une zone de travail",
"ch": [
"1,1 m",
"2 m",
"0,6 m",
"0,8 m"
],
"bon": 0,
"s": 20,
"expl": "Ton balisage protège les occupants et ton travail."
},
{
"q": "Pendant un travail, les issues et les portes…",
"ch": [
"Peuvent être bloquées une heure",
"Restent toujours libres",
"Sont couvertes de polythène",
"Sont fermées à clé"
],
"bon": 1,
"s": 20
},
{
"q": "L'eau des descentes pluviales doit être éloignée de la fondation de…",
"ch": [
"1,5 à 2 m",
"Ça n'a pas d'importance",
"5 m",
"30 cm"
],
"bon": 0,
"s": 20
},
{
"q": "Les chantepleures, on…",
"ch": [
"Les peint",
"Les remplit de mortier",
"Ne les bouche jamais",
"Les calfeutre avant l'hiver"
],
"bon": 2,
"s": 20,
"expl": "Elles laissent sortir l'eau derrière le parement."
},
{
"q": "Le composé à prise (en poudre) durcit…",
"ch": [
"En séchant à l'air, en 24 h",
"Jamais complètement",
"Par réaction chimique, en 5 à 90 minutes",
"Au soleil"
],
"bon": 2,
"s": 20,
"expl": "Le prémélangé, lui, sèche à l'air (12 à 24 h par couche)."
},
{
"q": "Le bac de composé à prise devient tiède. Ça veut dire…",
"ch": [
"Il faut ajouter de l'eau",
"Il commence à durcir",
"Il a gelé",
"Il est trop mouillé"
],
"bon": 1,
"s": 20,
"expl": "La prise dégage de la chaleur."
},
{
"q": "Une porcelaine absorbe moins de ___ de son poids en eau.",
"ch": [
"50 %",
"0,5 %",
"5 %",
"20 %"
],
"bon": 1,
"s": 20,
"expl": "Plus la cuisson est chaude, moins la tuile boit l'eau."
},
{
"q": "Une peinture au latex posée trop froide…",
"ch": [
"Devient poudreuse : les billes ne fusionnent pas",
"Sèche plus vite",
"Ne change rien",
"Devient plus brillante"
],
"bon": 0,
"s": 25,
"expl": "Respecte la température minimale de l'étiquette."
},
{
"q": "Une tablette chargée de livres se fixe…",
"ch": [
"Avec de la colle de construction",
"Dans les montants",
"Dans le gypse seul",
"Avec du ruban double face"
],
"bon": 1,
"s": 20,
"expl": "Aile longue de l'équerre contre le mur.",
"img": "img/labo/quiz/livres/travaux-mineurs-egi-09.jpg"
},
{
"q": "Une porte avec ferme-porte doit se refermer seule en…",
"ch": [
"Moins d'une seconde",
"Une minute",
"3 à 5 secondes",
"15 à 20 secondes"
],
"bon": 2,
"s": 20
},
{
"q": "SIMDUT veut dire…",
"ch": [
"Service d'information sur les métiers du travail",
"Système international de mesure",
"Système d'information sur les matières dangereuses utilisées au travail",
"Système d'inspection des matériaux du travail"
],
"bon": 2,
"s": 25
},
{
"q": "Le clapet antiretour sur l'égout…",
"ch": [
"Empêche l'égout de refouler dans le sous-sol",
"Empêche le gel",
"Règle le débit des gouttières",
"Empêche l'eau de pluie d'entrer dans le puisard"
],
"bon": 0,
"s": 25,
"expl": "Si un seul élément de la chaîne bloque, l'eau entre au sous-sol.",
"img": "img/labo/quiz/livres/travaux-mineurs-egi-12.jpg"
},
{
"q": "Pour réparer une fissure de joint dans le gypse, on…",
"ch": [
"Peinture par-dessus",
"Ouvre la fissure en V et pose un ruban",
"Met du silicone",
"Remplit seulement de composé"
],
"bon": 1,
"s": 20,
"expl": "Le ruban relie les deux côtés."
},
{
"q": "Céramique au plancher : couverture de mortier minimale",
"ch": [
"75 %",
"95 %",
"100 % exigé au mur seulement",
"50 %"
],
"bon": 1,
"s": 20,
"expl": "Aucun vide sous les coins : c'est là que la tuile casse."
},
{
"q": "Creux du support au-delà duquel on corrige au mortier",
"ch": [
"3 mm",
"10 mm",
"6 mm",
"1 mm"
],
"bon": 0,
"s": 20
},
{
"q": "La double coupe du vinyle, c'est…",
"ch": [
"Couper la pièce neuve et le vieux vinyle en même temps",
"Coller deux couches",
"Couper deux fois la pièce neuve",
"Couper d'abord le vieux, puis le neuf"
],
"bon": 0,
"s": 25,
"expl": "Ça donne un joint parfait."
},
{
"q": "On mesure la hauteur d'une installation à partir…",
"ch": [
"D'un meuble",
"De l'objet voisin",
"Du plafond suspendu",
"D'un repère fixe : plancher fini, coin, cadre de porte"
],
"bon": 3,
"s": 25
},
{
"q": "Coupe-froid des portes de patio coulissantes",
"ch": [
"Bande de mousse autocollante",
"Bourrelet à rainure",
"Brosse (velours)",
"Silicone"
],
"bon": 2,
"s": 20
},
{
"q": "Réparer une fissure de joint : dans l'ordre.",
"t": "ordre",
"ch": [
"Ouvrir la fissure en V",
"Dépoussiérer et remplir",
"Poser le ruban dans le composé"
],
"bon": [
0,
1,
2
],
"s": 40,
"expl": "Le ruban relie les deux côtés."
},
{
"q": "La double coupe du vinyle : dans l'ordre.",
"t": "ordre",
"ch": [
"Trouver une retaille du même vinyle",
"Poser la retaille par-dessus, motifs alignés",
"Couper les deux épaisseurs en même temps"
],
"bon": [
0,
1,
2
],
"s": 40
},
{
"q": "Quels pictogrammes du SIMDUT verras-tu souvent dans ce cours ?",
"t": "multi",
"ch": [
"Fragile",
"Inflammable",
"Irritant",
"Recyclable"
],
"bon": [
1,
2
],
"s": 25
},
{
"q": "Une rallonge de descente pluviale éloigne l'eau d'au moins combien de mètres ?",
"t": "nombre",
"ch": [],
"bon": 1.5,
"s": 45,
"u": "m",
"expl": "1,5 à 2 m de la fondation."
},
{
"q": "Trouve l'erreur dans cette phrase.",
"t": "erreur",
"ch": [
"La porcelaine est cuite",
"entre 1 200 et 1 400 °C",
"et absorbe plus de 5 % d'eau."
],
"bon": 2,
"s": 30,
"expl": "Une porcelaine absorbe moins de 0,5 % de son poids en eau."
}
]
},
{
"id": "livre-entretien-menager-egi",
"exemple": true,
"livre": true,
"titre": "Entretien ménager d'un bâtiment",
"sujet": "Quiz du livre",
"couv": "img/labo/quiz/livres/entretien-menager-egi-couv.jpg",
"coul": "#2E8B57",
"reg": {
"nb": "12",
"melange": "tout"
},
"qs": [
{
"q": "Dans des toilettes publiques, la première surface à nettoyer est…",
"ch": [
"Le miroir",
"Le plancher",
"La toilette",
"L'urinoir"
],
"bon": 0,
"s": 20,
"expl": "On va du plus propre au plus sale; le plancher en dernier."
},
{
"q": "La toilette se nettoie…",
"ch": [
"La cuvette en premier",
"De l'extérieur vers l'intérieur, la cuvette en dernier",
"Avec le chiffon du lavabo",
"Avant le miroir"
],
"bon": 1,
"s": 25
},
{
"q": "Une microfibre bien pliée donne…",
"ch": [
"8 faces",
"4 faces",
"2 faces",
"16 faces"
],
"bon": 0,
"s": 20,
"expl": "Une face propre par surface."
},
{
"q": "Pas d'eau chaude au chalet de l'aréna. Tu compenses en…",
"ch": [
"Laissant agir plus longtemps et en frottant plus",
"Sautant le nettoyage",
"Mettant le produit pur",
"Mélangeant deux produits"
],
"bon": 0,
"s": 25,
"expl": "Température, temps, action mécanique et produit se compensent."
},
{
"q": "Un tube fluorescent usé va…",
"ch": [
"Aux déchets",
"Au recyclage",
"Aux RDD (résidus dangereux)",
"Au compost"
],
"bon": 2,
"s": 20,
"expl": "Il contient du mercure."
},
{
"q": "Avant de laver un plancher, on…",
"ch": [
"Ouvre les fenêtres",
"Enlève la poussière et les débris",
"Applique le fini",
"Mouille tout le plancher"
],
"bon": 1,
"s": 20,
"expl": "Sinon, on fait de la boue.",
"img": "img/labo/quiz/livres/entretien-menager-egi-06.jpg"
},
{
"q": "Le lavage d'un plancher commence…",
"ch": [
"Près de la porte",
"N'importe où",
"Au centre",
"Au fond, dans le coin le plus loin de la porte"
],
"bon": 3,
"s": 25,
"expl": "Bordures d'abord, puis le centre en reculant."
},
{
"q": "On change l'eau de lavage…",
"ch": [
"Seulement si elle sent mauvais",
"Une fois par jour",
"Jamais pendant le quart",
"Dès qu'elle est grise ou entre deux types de locaux"
],
"bon": 3,
"s": 25
},
{
"q": "La méthode en S pour les vitres, c'est…",
"ch": [
"On n'utilise pas de raclette",
"La raclette ne quitte jamais la vitre",
"On essuie en cercles",
"On commence en bas"
],
"bon": 1,
"s": 20,
"expl": "Ça évite les traces entre les passes.",
"img": "img/labo/quiz/livres/entretien-menager-egi-09.jpg"
},
{
"q": "Dans une piscine, un filtre encrassé…",
"ch": [
"Se lave à contre-courant",
"Se vide dans le bassin",
"Se change chaque jour",
"Se nettoie au chlore pur"
],
"bon": 0,
"s": 20,
"expl": "L'eau tourne en boucle : écumoires, pompe, filtre, chauffage, chlorateur.",
"img": "img/labo/quiz/livres/entretien-menager-egi-10.jpg"
},
{
"q": "L'étiquette du fournisseur d'un produit dangereux doit être…",
"ch": [
"Lisible, en français et en anglais",
"En français seulement",
"Facultative si on connaît le produit",
"En anglais seulement"
],
"bon": 0,
"s": 20,
"expl": "SIMDUT 2015."
},
{
"q": "Le biofilm…",
"ch": [
"Disparaît avec de l'eau froide",
"Protège les microbes : le désinfectant ne le traverse pas",
"Est une couche de cire",
"Se forme seulement sur le métal"
],
"bon": 1,
"s": 25,
"expl": "Il faut d'abord le détruire mécaniquement (frotter).",
"img": "img/labo/quiz/livres/entretien-menager-egi-12.jpg"
},
{
"q": "Une protéase découpe…",
"ch": [
"Les gras",
"Les amidons",
"Les protéines (sang, œuf)",
"Le calcaire"
],
"bon": 2,
"s": 20,
"expl": "Lipase : gras; amylase : amidon.",
"img": "img/labo/quiz/livres/entretien-menager-egi-13.jpg"
},
{
"q": "Pour épousseter, on…",
"ch": [
"Utilise un plumeau sec ordinaire",
"Souffle la poussière",
"Capture la poussière avec une microfibre légèrement humide",
"Commence par le bas"
],
"bon": 2,
"s": 25,
"expl": "Du haut vers le bas, en faisant le tour dans le même sens.",
"img": "img/labo/quiz/livres/entretien-menager-egi-14.jpg"
},
{
"q": "Un objet de valeur oublié dans une chambre…",
"ch": [
"Va au registre des objets trouvés",
"Se garde en attendant",
"Se donne au client suivant",
"Reste où il est"
],
"bon": 0,
"s": 20,
"expl": "On ne touche qu'à ce qu'on doit nettoyer."
},
{
"q": "Pourquoi le registre d'hiver est-il si important ?",
"ch": [
"Il sert seulement au gestionnaire",
"Il compte le sel acheté",
"Il prouve que l'entretien a été fait",
"Il remplace l'assurance"
],
"bon": 2,
"s": 20,
"expl": "Sans registre, impossible de prouver que la rampe était entretenue."
},
{
"q": "Un bon de travail, c'est…",
"ch": [
"La facture du client",
"Le registre des heures",
"La liste des tâches de chaque jour",
"La demande d'une tâche ponctuelle"
],
"bon": 3,
"s": 20,
"expl": "Souvent dans une GMAO avec code QR."
},
{
"q": "Laver un plancher : dans l'ordre.",
"t": "ordre",
"ch": [
"Enlever la poussière et les débris",
"Commencer au fond de la pièce",
"Faire les bordures",
"Laver le centre en 8, en reculant"
],
"bon": [
0,
1,
2,
3
],
"s": 40
},
{
"q": "Laver une vitre (méthode en S) : dans l'ordre.",
"t": "ordre",
"ch": [
"Mouiller toute la vitre",
"Essuyer une bande sèche en haut",
"Placer la raclette dans le coin",
"Descendre en S sans quitter la vitre"
],
"bon": [
0,
1,
2,
3
],
"s": 40
},
{
"q": "Quels objets vont aux RDD (résidus dangereux) ?",
"t": "multi",
"ch": [
"Boîte de carton",
"Pile",
"Tube fluorescent",
"Aérosol à moitié plein"
],
"bon": [
1,
2,
3
],
"s": 25
},
{
"q": "Trouve l'erreur dans cette phrase.",
"t": "erreur",
"ch": [
"Le biofilm",
"protège les microbes :",
"le désinfectant le traverse facilement."
],
"bon": 2,
"s": 30,
"expl": "Le désinfectant n'arrive pas à traverser le biofilm : il faut frotter."
},
{
"q": "Zoom mystère : qu'est-ce que c'est ?",
"ch": [
"Un chauffe-eau",
"Le circuit d'eau d'une piscine",
"Un système de gicleurs",
"Un échangeur d'air"
],
"bon": 1,
"s": 20,
"expl": "L'eau tourne en boucle : écumoires, pompe, filtre, chauffage, chlorateur.",
"img": "img/labo/quiz/livres/entretien-menager-egi-22.jpg",
"zoom": {
"x": 55,
"y": 55
}
}
]
}
];
