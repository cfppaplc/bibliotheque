# Notes pour Claude — Bibliothèque du Pavillon de l'Avenir

> Ce fichier est écrit pour un assistant (Claude) qui reprend le projet. Lis-le en entier avant de toucher au code.
> Le `README.md` décrit le format de `nouveautes.json`; ce fichier-ci décrit tout le reste.

## Le projet en bref
- Site : https://cfppaplc.github.io/bibliotheque/ (GitHub Pages, branche `main`, dossier racine, `.nojekyll`).
  Le dépôt *est* le site : aucun build, aucun framework. Fichiers HTML autonomes, CSS et JS intégrés.
- Auteur : **Jeremy (Jérémy Raymond), enseignant au Pavillon de l'Avenir** (formation professionnelle, Québec).
  Programmes : **DEP 5211 Entretien général d'immeubles (EGI)** et **DEP 5333 Plomberie et chauffage**.
- Usage réel : projeté en classe sur un tableau interactif (TNI), aussi sur ordinateur et téléphone. Public enseignant.
  Le site est public; Jeremy le partage seulement avec ses collègues.
- **Tout est en français (Québec)**, y compris les commentaires, les messages d'interface et les commits.
  Tutoiement dans l'interface (« Choisis… », « Ouvre… »). Signature : « Conçu par Jeremy, enseignant ».

## Ce que Jeremy demande à chaque fois (règles permanentes)
1. **Vraiment intuitif** pour un enseignant débutant : peu de boutons visibles, gros boutons pour le TNI, aides « ? » courtes.
2. **Chaque mise à jour → « Quoi de neuf »** (`nouveautes.json`) : une entrée par *sujet* (pas par version), mettre à jour
   `date`, `texte`, la mini-formation `formation` et ajouter une ligne en tête de `versions`.
   **Avec de petites captures d'écran** dans `nouveautes/` (JPEG ≤ 960 px) : `{ "t": "…", "img": "nouveautes/x.jpg" }`.
3. **Tester avant de publier** (Playwright + Chromium) et regarder les captures. Ne jamais publier du JS non vérifié :
   `outils/publier.sh` lance `verifier_scripts.py`, qui bloque la publication si un `<script>` a une erreur de syntaxe
   (une apostrophe non échappée dans une chaîne a déjà cassé le tableau de bord en ligne).
4. Réponses à Jeremy : courtes, en français, sans jargon technique; dire ce qui a été testé et ce qui ne l'a pas été.

## Fichiers
| Fichier | Rôle |
|---|---|
| `index.html` | La bibliothèque (accueil style « Netflix », lecteur de livres, tableau blanc, plans, accueil de classe intégré). ~5 000 lignes. |
| `accueil.html` | « Accueil de classe » / tableau de bord projeté (horloge, période, timeline, contenus à ouvrir). Ouvert dans un `<iframe>` par `index.html`, ou seul. |
| `livres/*.html` | Un livre animé par fichier, autonome (images en base64). Nom du fichier = champ `fichier` dans `LIVRES`. |
| `plans/` | Dossiers de plans techniques (PDF + image de secours), ouverts par la visionneuse de plans. |
| `nouveautes.json`, `nouveautes/` | « Quoi de neuf » et ses mini-formations (voir README). |
| `recherche.json` | Texte de chaque page de chaque livre (recherche plein texte). **Généré** par `outils/index_recherche.py`. |
| `sw.js` | Service worker hors ligne : pages du site en réseau d'abord; livres et plans en copie d'abord (mise à jour en arrière-plan). |
| `img/` | Logo Pavillon, icônes, image d'aperçu des liens (`apercu.jpg`). |
| `outils/` | Scripts de travail (pas utilisés par le site). Voir plus bas. |

## index.html — repères
- **`LIVRES`** (liste d'objets) : `titre, auteur, categorie, niveau ("DEP 5211 · Compétence 15"), pages, annee, nouveau,
  couleurs, fichier, competence, description` et, au besoin, **`enConstruction:true`** (badge jaune « En construction » avec un cône,
  prioritaire sur « Nouveau »; l'enlever quand Jeremy dit que le livre est fini). **`window.COUVERTURES`** : `{ fichier: "data:image/jpeg;base64,…" }`
  (capture de la 1re page du livre, 420 px de large, JPEG ~80).
- **Ajouter un livre** : copier dans `livres/<nom>.html`, ajouter l'entrée `LIVRES` + la couverture, ajouter une entrée
  `type:"ajout", livre:"<nom>"` dans `nouveautes.json` (allume le badge « Nouveau » 30 jours), puis
  `bash outils/publier.sh "Nouveau livre : …" <nom>` (le vérificateur ouvre le livre, teste flèches, table des matières, réponses).
- **Lecteur** (`#reader`) : l'objet d'état est `RD`. Chaque livre est chargé en `srcdoc` d'un iframe; la bibliothèque
  masque la barre propre au livre (`HOSTCSS`) et fournit sa propre barre (`#tb`) identique pour tous.
  `buildDriver(win)` détecte le « moteur » du livre et retourne `{ state(), goto(n), modules(), … }` :
  moteur A (`#ui #bp #pg #br`, pages `.page.vis`), moteur B (`#prev #count`), pages empilées (`#book>.page`, protection incendie), pages affichées une à une par la bibliothèque (`.page.hcur`, livre C13),
  document qui défile (`defile:true`). Boutons ‹ › : `avanceRapide()` (tenu enfoncé = pages qui défilent de plus en plus vite). `turn(±1)`, `setZoom`, `ZL`, `zPleineLargeur()`, mode simple/double page (`RD.single/RD.dbl`).
- **`HOSTCSS`** : CSS injecté dans *tous* les livres. Contient la **transition de page commune** (`biblioPage`, sur `.page.vis` et `.page.hcur` : fondu + `translate`,
  pas `transform`, pour ne pas casser la mise à l'échelle des livres). Changer ici = changer tous les livres.
- Ouvrir à une page : `?livre=<fichier>&page=N` ou `RD.allerA = N` avant `lire(l)` (`offrirReprise` revérifie et
  s'arrête dès que l'enseignant tourne lui-même une page : `RD.bouge`).
- Badges « Nouveau » / « Mis à jour » : `estNouveau`, `majRecente`, `badgeLivre` — 30 jours, et disparaissent une fois le livre
  ouvert sur cet ordinateur (`localStorage.livresVus`).
- **Palette Objets** (`#objBar`, bouton cube `#penO`, visible partout) : trois onglets `RD.objTab` = `formes` | `iso` | `elec`.
  **Aucun outil par défaut** (`RD.formeK`, `RD.objKi`, `RD.objKe` = null à l'ouverture et au changement d'onglet; toucher l'outil actif l'éteint).
  Sans outil : clic = choisir (trait **ou intérieur** des formes fermées, la plus petite gagne), glisser = déplacer, double-clic = nommer, clic à côté = rien de choisi.
  Avec un outil : glisser trace (formes), clic pose (objets); l'élément créé reste choisi; un clic à côté quand quelque chose est choisi = retour à aucun outil (`cur.raz`, `mv.raz`).
  Formes : catalogue `FORMES` dessiné par `dessinerForme` (appelé depuis `drawStroke`), forme choisie dans `RD.formeK`, taille d'un simple clic `FORMES_CLIC`;
  déplacer : toucher une forme existante (`formeSous`, près du trait ou dans une petite forme) la sélectionne (`SELO.s`, cadre `cadreForme`) et la glisse; Suppr / `#objD` l'efface; poignées carrées aux points `s.p[0]`/`s.p[1]` (`poigneeSous`) pour redimensionner; cote : décalage `s.d` (fraction de la hauteur), poignée 2 au milieu (`milieuCote`, `poigneeCote`), lignes de rappel. Dans la case du double-clic d'une cote, `padCote` ajoute 5 touches (haut, bas, gauche, droite, centre) qui règlent le signe de `s.d` (grisées si parallèles à la cote). Le même pavé sert aux étiquettes des formes et des objets iso : position du texte `s.lp` (`posEtiquette`, `cadrePx`; défaut centre, haut pour les lignes, bas pour les objets; pour une ligne ou flèche, gauche/droite = au bout, dans son prolongement). Lignes : zone de toucher 1,6 fois plus large, poignées réduites sur une courte flèche. Taille du texte `s.tz` (`tailleTexte`, A−/A+ de 50 à 400 %; étiquettes, cote, angle, cercle). La case se déplace par sa barre à points (`glisserCase`). Une forme non choisie se choisit d'un clic (`cur.choisir`); glisser dessus trace une nouvelle forme. Toucher un élément d'une autre catégorie le choisit et change d'onglet (`ongletPour`, `choisirAutre`; refus poli si le fond ne correspond pas).
  double-clic = deux « touchers » sans bouger, au relâchement (`tapElement` : 550 ms, 24 px; un tremblement < 5 px n'est pas un déplacement) → `modifierForme` (valeurs `VALEURS_FORME` gardées dans `s.lb`; pour l'angle, un nombre fait pivoter le 2e bras);
  le même double-clic marche sur les objets iso (nom sous l'objet, `etiquette`) et électriques (repère `lb`), et sur toute forme (étiquette au centre). Les objets gardent `s.c` = couleur du crayon (`recolorerSel` quand on choisit une couleur avec un objet sélectionné).
  Attention : `attach()` ne doit pas faire `win.focus()` pendant qu'une case est en saisie (le tableau blanc vide se rebranchait et volait le focus).
  **Glisser-déposer** une vignette iso/électrique (pas fil, rails, jonction, serpentin) → `deposerObjet(k, x, y)` : essaie les points de grille autour (±3) et les deux sens, garde celui où le plus de bornes tombent sur un fil (`surFil`/`bout`) ou un tuyau (`surTuyau`), puis `couperFils` (électricité) ou `entreTuyaux` (enlève le tuyau entre les deux raccords). Un simple toucher sur la vignette choisit encore l'outil (`data-glisse` évite le clic après un glissement).
  offertes aussi sur les pages de livre. Iso (`OBJETS`) et Électricité (`ELEC`) : tableau blanc seulement; choisir l'onglet change le fond (iso / quadrillé).
- **Crayon** : le bouton crayon `#penCol` (icône crayon, pointe à la couleur `--pc`) active/désactive le crayon (`RD.crayonOff`; l'activer ouvre `#popCol`). Épaisseur = glissière 1–40 (`RD.wPx`, `localStorage.penLargeur`, `majLargeur`); l'ancien bouton `#penW` (3 grosseurs) est retiré. Le tracé (`RD.shape`) se choisit dans la rangée « Tracé » du menu (`.ptrace`); `#penS` est caché (gardé pour `refreshTools`).
- **Ouverture du tableau blanc** (`toggleWb`) : classe `#reader.wbon` qui cache la barre du livre `#tb` (on sort par ✕ `#penX` ou Retour); toujours aucun outil (`RD.crayonOff = true`, objets/gomme/texte éteints). Dans cet état, toucher une forme ou un objet ouvre la palette Objets et le choisit (`choisirAutre`, glisser = déplacer).
- **Tableau blanc / crayon** : traits normalisés dans `INKS[inkKey()]`, `REFS`, `recalerWb()`; pendant un trait, ne jamais appeler `redrawInk()` à chaque mouvement (trop lent) : trait libre dessiné par bouts (`dessinerEnCours`), formes et surligneur sur une copie `fond`, gomme via `redrawBientot()` (une fois par image); fonds blanc/quadrillé/iso/…;
  tableaux gardés (`tableauxSauves`), « Mes schémas » (`mesSchemas`, export `.schema.json` type `schema-pavillon`).
- **Schémas électriques en échelle** : catalogue `ELEC`/`ELEC_CAT`, `dessinerElec`, fils `{t:"ligne", fil:true}`,
  simulateur `SIM`/`simCalc` (courant animé L1→L2, relais temporisés, « Trouve la panne »), modèles `MODELES` (`poserModele`).
- **Accueil de classe intégré** : overlay `#accueilOv` + iframe `#accueilFrame` (`accueil.html`). Protocole `postMessage` :
  - tableau → bibliothèque : `accueil-fermer`, `accueil-plein-ecran`, `accueil-catalogue?`, `accueil-ouvrir {contenu}`, `accueil-revenir`
  - bibliothèque → tableau : `accueil-biblio`, `accueil-catalogue {livres, modeles, schemas, dossiers}`, `accueil-plein-ecran-etat`, `accueil-livre {titre, page}`
  - **Session tableau de bord** (`TDB_ACTIF`, `marquerTdb`, `allerTableauDeBord`) : le livre reste ouvert *sous* le tableau de bord;
    bouton « Tableau de bord » (touche E) dans tous les livres, « Revenir au livre » (touche L) sur le tableau.
    Le plein écran est demandé sur `document.documentElement` (jamais sur l'iframe) pour rester actif entre les deux.

- **Accès rapide au tableau blanc** : `#wbBtn` dans l'en-tête (a remplacé « A+ »; `#grosBtn` reste caché, utilisé par le menu Plus du cellulaire) → `ouvrirTableauBlanc()`.
  Sur `accueil.html` : `#b-wb` (touche B, visible seulement dans la bibliothèque) envoie `accueil-ouvrir {type:"tableau"}`; si le tableau blanc est déjà ouvert dessous, on y revient (`ouvrirDepuisTdb`), et `#b-wb` est caché au profit de « Revenir au tableau blanc ».

## Téléphone (≤ 640 px)
- CSS dans le bloc « Téléphone (≤ 640 px) » de `index.html` : `.hbtns` cachés, barre d'onglets `#tabbar` en bas
  (Accueil, Ma liste, Quoi de neuf, Plus → feuille `#plusOv` qui clique les boutons existants `#lienAide`, `#planBtn`, `#accueilBtn`, `#grosBtn`).
- Fiche du livre en feuille montante, gros bouton « Lire ». Quoi de neuf en pleine largeur.
- Lecteur : disposition de barre propre au téléphone (`DEF_TEL`, sauvée dans `tbLayoutTel`), gestes dans `brancherSouris` :
  balayer = `turn(±1)`, toucher au milieu = cacher/montrer les barres. La pastille « Tableau de bord » est cachée.
- `accueil.html` : boutons du haut en icônes seulement, nom du programme caché.
- Tester avec `devices['iPhone 13']` de Playwright (les gestes : `new w.Touch` + `TouchEvent` dans l'iframe du livre).

## accueil.html — repères
- Réglages dans `localStorage["accueil-atelier-v4"]` → objet `cfg` (fusionné avec `DEFAULTS`).
- `COMPS` : `[code, nom, fond, programme]` pour chaque compétence (ex. `"436-282"`). `SCENES` : arrière-plans SVG animés par compétence.
- Période : `BLOCKS` (60 min, pause 5, 60, pause 15, 60), `points()`, `timeline()`. Case **« Examen aujourd'hui »** (`cfg.examen` = date du jour) : aucune pause.
- **Contenus par activité** (« Préparer le cours », étape 4) : `cfg.liens[cléActivité]` = **liste** (ancien format : un seul objet; lire avec `liste()`/`liensDe()`).
  Types : `livre`, `schema`, `plan`, `tableau`, `minuterie`, `video` (YouTube, `ytInfo`), `fichier` (gardé dans IndexedDB `accueil-fichiers`). `web` (`urlWeb`, ouvert dans un nouvel onglet). Attention : `data-w` est déjà pris par les widgets, ne pas le réutiliser.
  Double-clic sur un segment de timeline / une étape : `lierActivite(label)` ouvre `openPrep()` et `choix()` sur la bonne rangée; le simple clic passe par `clicSimple` (délai 280 ms).
  Les PDF/images/vidéos s'affichent dans le tableau; PowerPoint/Word/Excel sont téléchargés pour s'ouvrir dans leur programme.
- **Ambiance du jour** : `AMBIANCES` (une palette par jour de semaine), `couleursDuJour()`; réglage `cfg.couleurs = "jour" | "fixe"`.
- Icônes : style au trait uniquement (`ico(type)`, `ICO_P`), **pas d'émojis** (demande de Jeremy).

## Outils (`outils/`)
- `publier.sh "message" [livres…]` : vérification syntaxe → `recherche.json` → vérification des livres → commit + push.
- `verifier_scripts.py` : `node --check` sur chaque `<script>` intégré de `index.html` et `accueil.html`.
- `verifier_livre.js <url> <livre…>` : ouvre chaque livre dans Chromium et fait une fiche (poids, pages, flèches, table des matières, réponses).
- `index_recherche.py` : refait `recherche.json` (nécessite `beautifulsoup4`).
- `captures_nouveautes.js` : refait des captures pour les mini-formations (serveur local sur le port 8791).
- Tests : `python3 -m http.server 8791` à la racine, puis Playwright (`NODE_PATH=$(npm root -g) node test.js`).
  Mettre `localStorage.bienvenueVu = "1"` (`addInitScript`) sinon la fenêtre de bienvenue cache tout.
  Faux positifs connus dans un bac à sable sans Internet : pdf.js (cdnjs) et polices Google bloqués, PDF blanc en Chromium sans tête, YouTube bloqué.

## Dossiers de plans d'exercice (`plans/dossier-N.pdf` + `.png`)
- Générés en Python (ReportLab) par les scripts de `outils/plans/` : `dessin.py` (feuille, cartouche, primitives), `batiment.py`
  (bâtiment paramétrique → feuilles A, S, P, E, M), `coupes.py`, `moderne.py` (façades contemporaines du dossier 4 : murs-rideaux, panneaux, volumes-signaux, marquises), `civil.py` (terrain numérique, courbes de niveau, réseau pluvial,
  feuilles C-101 et C-102), et un fichier par dossier (`d1_maison.py` … `d4_centre.py`).
- Produire : `cd outils/plans && python3 d4_centre.py` (adapter le chemin de sortie), puis copier le PDF dans `plans/dossier-4.pdf`
  et la feuille A-101 en PNG 1700 × 1100 (`pdftoppm -r 100 -f 5 -l 5`) dans `plans/dossier-4.png` (secours si le PDF ne s'ouvre pas).
- Feuilles supplémentaires : `batiment.feuilles_extra = [(numéro, titre, fonction)]`, insérées après A-100 et dans la liste de la page de garde.
- Liste des dossiers dans `index.html` : boutons `.pl-ex[data-ex]`, `DOSSIERS`, et `dossiers` du catalogue envoyé au tableau de bord.

## Points ouverts / à savoir
- « Communiquer en milieu de travail » (436-282) a été classé **Compétence 9** par déduction (Plomberie et chauffage = 10 = 436-295).
  À confirmer avec Jeremy : les numéros de compétence ne suivent pas l'ordre des codes (le livre C13 indique « Module 13 · 436-274 »),
  donc ce 9 est douteux.
- Le 22 octobre 2026, GitHub Pages a semblé arrêter de publier pendant un moment après des push réussis.
  Si le site en ligne ne change pas : onglet Actions → « pages build and deployment » → Re-run.
- Idées proposées à Jeremy mais pas commencées : repenser le panneau administrateur (sauvegarde complète, vérifier un livre
  avant l'envoi, préférences de projection), bouton « Tableau blanc » dans l'en-tête, afficheur PowerPoint intégré
  (déconseillé : fidélité incertaine; conseiller l'export PDF).
