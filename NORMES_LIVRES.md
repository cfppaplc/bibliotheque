# Normes pour les livres de la Bibliothèque du Pavillon

> À donner à Claude (ou à vérifier soi-même) **chaque fois qu'on fabrique ou met à jour un livre**.
> But : que le livre s'ouvre vite, tourne bien sur le tableau interactif (TNI), l'ordinateur et le cellulaire,
> et que tous les outils de la bibliothèque marchent dessus (pages, table des matières, ✓ réponses, crayon, zoom, recherche).
> Mis à jour le 8 novembre 2026.

## 1. Le fichier
- **Un seul fichier `.html` autonome** : images, polices, CSS et JS **dedans** (images en base64, WebP qualité ~80).
  Aucun lien vers Internet (CDN, Google Fonts, YouTube…) : à l'école, le livre doit marcher hors ligne.
- **Poids visé : moins de 15 Mo.** Au-delà, l'ouverture devient lente sur le TNI et le cellulaire.
  Images à la taille utile (pas une photo 4000 px pour un dessin de 400 px).
- **Vrai texte, pas des images de texte** : la recherche de la bibliothèque, l'écriture sur les lignes
  et le zoom net en ont besoin. Une page en image seulement = pas de recherche ni de réponses.
- Polices intégrées (woff2, sous-ensemble des caractères utilisés).

## 2. Les pages (format recommandé)
- **Chaque page = un `<section class="page">`**, toutes **de la même taille** (ex. 816 × 1056, format lettre).
- **Pas de barre de navigation, de boutons de page, de menu ni de zoom propres au livre.**
  Avec au moins 3 `.page` et aucun moteur à lui, la bibliothèque affiche les pages une à une, les ajuste à l'écran,
  et fournit la même barre pour tous les livres (‹ ›, page, table des matières, crayon, zoom, plein écran).
  Un zoom interne (double-clic, deux doigts, touches) **entre en conflit** avec celui de la bibliothèque : n'en mettre aucun.
- **Page 1 = couverture** (`<section class="page cover">`). Sa capture sert de vignette dans la bibliothèque.
- Rien en `position:fixed` dans le livre (ça ne suit pas la page quand on zoome).
- **Logo Métier+ (8 nov.)** : **version PDF à imprimer** = logo Métier+ (`img/metier-plus.svg`) sur la couverture,
  en haut à droite de préférence (sinon un autre coin), ~25 à 35 mm de large, sur une **zone libre réservée en concevant
  la couverture** : jamais par-dessus du texte, d'un titre ou d'un dessin important. Les élèves peuvent ainsi parler
  du « livre Métier+ compétence N ». **Version web : pas de logo dans le livre** (la bibliothèque affiche déjà la petite
  icône Métier+ sur chaque couverture).

## 3. Table des matières
- Au début de chaque module, un titre **`<h2 class="mod">Module 3 — Titre du module</h2>`**
  (peut être caché avec `hidden`). La bibliothèque construit la table des matières toute seule à partir de
  « Module N — … » (aussi « Chapitre », « Partie », « Compétence »).

## 4. Réponses (bouton ✓)
- Marquer chaque réponse avec **`class="reponse"`** (ou `answer`, `solution`, `correction`, `data-reponse`).
  La bibliothèque les cache au départ, puis ✓ les montre **une à la fois** (pas à pas) ou **toutes**.
- La réponse doit **garder sa place** dans la page (elle est cachée, pas retirée) : rien ne bouge quand on l'affiche.
- Exemples résolus toujours visibles : ne pas leur mettre `reponse`.
- Lignes d'écriture : une vraie bordure du bas (`border-bottom`) ou des lignes en fond ; cases à cocher : ☐ ou un petit
  carré vide ; choix multiples : un groupe `.choix` / `.opts` / `.vf`. Le crayon et l'outil Texte s'y accrochent seuls.

## 5. Animations (le plus important pour la fluidité)
- **Une animation démarre quand sa page devient visible** : la bibliothèque ajoute la classe **`live`** à la page affichée
  (`.page.live .monAnim { animation: … }`). Pas d'animation qui tourne sur les pages cachées.
- **Préférer les animations qui jouent puis s'arrêtent** (`forwards`) plutôt que des boucles infinies.
  Une boucle infinie (lueur, pulsation, reflet) oblige l'appareil à redessiner la page agrandie sans arrêt :
  c'est ce qui faisait ramer le tableau interactif. Si une boucle est vraiment utile : petite, et une seule par page.
- **N'animer que `transform` et `opacity`.** Éviter d'animer `filter`, `blur`, `box-shadow`, `width/height`,
  `top/left`, les dégradés ou `backdrop-filter` : très lourd.
- **Pas de grande toile (`<canvas>`) animée par-dessus les pages** (comme l'ancien feu de Protection incendie).
- **Démos pas à pas** (expliquer une étape à la fois) : nommer les étapes `xxx-st1`, `xxx-st2`… (ou `sq-s1`…) dans une
  même animation ; la bibliothèque affiche alors les boutons ◂ ▸ pour avancer étape par étape, et Pause.
- SVG animé (SMIL) accepté, mais court et seulement sur la page affichée.
- Garder une animation **compréhensible même figée** (une image finale claire) : en mode léger ou si l'ordinateur
  a « Effets d'animation » désactivés, certaines peuvent être raccourcies.

## 6. À ne pas faire
- Pas d'impression/PDF intégré, pas de `alert()`, pas de son automatique.
- Pas de stockage du livre lui-même (`localStorage`) : la bibliothèque garde déjà la page et les traits.
- Pas de scripts qui changent la taille des pages à l'ouverture ou au redimensionnement de la fenêtre.

## 7. Ce que Claude fait ensuite (dans le projet de la bibliothèque)
1. Vérifier le fichier avec ces normes (poids, pages, `.page`, `h2.mod`, `.reponse`, `live`, animations en boucle).
2. Ajouter / mettre à jour l'entrée du livre (titre, programme, compétence, nombre de pages, version) et sa couverture.
3. Tester dans la bibliothèque (Chromium) : ouverture, ‹ ›, table des matières, ✓, crayon, zoom, cellulaire.
4. Refaire la recherche, **protéger (chiffrer) le livre** pour les comptes du programme, ajouter « Quoi de neuf ».
5. Publier **seulement quand Jeremy dit « publie »**.

## Liste rapide (à cocher)
- [ ] Un seul `.html`, rien d'externe, < 15 Mo
- [ ] Vrai texte, polices intégrées
- [ ] `section.page` de même taille, page 1 = couverture
- [ ] PDF imprimé : logo Métier+ dans un coin libre de la couverture (pas sur le texte); version web sans logo
- [ ] Aucune navigation / aucun zoom propres au livre, rien en `position:fixed`
- [ ] `h2.mod` « Module N — … » au début de chaque module
- [ ] Réponses en `class="reponse"`, qui gardent leur place
- [ ] Animations déclenchées par `.page.live`, surtout `transform`/`opacity`, peu ou pas de boucles infinies
- [ ] Démos pas à pas nommées `…-st1`, `…-st2`…
