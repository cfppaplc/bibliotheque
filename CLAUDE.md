# Notes pour Claude — Métier+ (bibliothèque du Pavillon de l'Avenir)

> Version courte (17 nov.). **L'historique complet (toutes les décisions, tests, noms de fonctions) est dans `notes/historique-claude.md`** : y chercher avec `grep -n "mot" notes/historique-claude.md` avant de toucher à une partie du site. Ne pas le relire en entier. Ajouter les nouvelles notes **là-bas** (une ligne datée), et ici seulement si c'est une règle permanente.

## Le projet
- Site https://metierplus.app (GitHub Pages, branche `main`, racine, `.nojekyll`). Le dépôt *est* le site : pas de build. HTML + `js/` + `css/` (scripts classiques, variables globales partagées, chargés dans l'ordre de la page; monter `?v=N` après chaque changement).
- Auteur : Jeremy (Jérémy Raymond), enseignant au Pavillon de l'Avenir. DEP 5211 EGI et DEP 5333 Plomberie et chauffage. Public : enseignants (élèves plus tard, comptes de groupe).
- Usage : TNI SMART GX Plus V4 (Android, Chrome 157, 1280×720 ×3), ordinateur, cellulaire, iPad des élèves. Au TNI, fluide quand le portable est branché; le navigateur Android du TNI est lent.
- Tout en français du Québec (interface, commentaires, commits). Tutoiement. Ton professionnel, pas de familiarités.

## Règles permanentes de Jeremy
1. **Simple et intuitif** : peu de boutons, gros boutons au TNI, une nouvelle fonction va dans un menu/onglet existant. Toute nouvelle fenêtre réutilise les composants de la bibliothèque (panel, btn, meta) et a sa version claire.
2. **Quoi de neuf** (`nouveautes.json`, captures JPEG ≤ 960 px dans `nouveautes/`) : une entrée par sujet, court, réécrire l'étape au lieu d'en ajouter.
3. **Tester avant de publier** (Playwright + Chromium, serveur `python3 -m http.server 8791`, scripts de test hors du dossier du site, `localStorage.bienvenueVu="1"`). Publier : `GARDER_COMPTES=1 bash outils/publier.sh "message"` (vérifie la syntaxe, écrit `version.json`). Dire à Jeremy la version (heure de `version.json`).
4. Réponses courtes, en français, sans jargon; dire ce qui a été testé et ce qui ne l'a pas été.
5. **Ne rien supprimer sans le lui dire.** Économiser (Jeremy est sur crédits).
6. Loi 25 : jamais de nom complet, courriel ou note d'élève; toute nouvelle donnée recueillie → `confidentialite.html`.
7. Ne jamais écrire le mot de passe du compte `claude.assistant`.
8. Ne jamais mettre le mode léger / sobre d'une façon qui touche les livres (écrans noirs au TNI). Pas de zone qui défile dans une fenêtre qui défile (blanche au TNI).
9. Pas d'émojis dans l'interface; pas de style « Kahoot » (blocs de couleur + formes), ni le mot.
10. Commits : finir par `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` (et la ligne Claude-Session si fournie). Une autre session peut pousser : `git pull` avant.
11. **Tests automatiques** (25 nov.) : chaque bogue corrigé = un test ajouté dans `outils/tests/fonctions.js` (et toute nouvelle page dans `PAGES` de `outils/tests/pages.js`). GitHub les relance à chaque envoi (`test-pages.yml`); vérifier qu'ils passent après publication (`gh api repos/cfppaplc/bibliotheque/actions/runs?per_page=3`). Surveillance du site aux 30 min (`surveillance.yml`), sauvegarde Supabase le dimanche (`sauvegarde-supabase.yml`).

## Livres
- Normes : `NORMES_LIVRES.md` (à relire pour tout livre). Source de chaque livre = original clair `/home/claude/originaux/livres/<f>.html` (perdu si la session est recréée : garder une copie).
- Correction : modifier l'original → tester → `python3 outils/chiffrer.py <original> <f> --comptes <mêmes comptes>` (`git pull` avant; donner les comptes du programme à la main) → refaire le PDF (`node outils/pdf_fabriquer.js` → `pdf_compresser.py` → `pdf_livres.py`) → monter `version` dans `js/livres.js` → publier.
- Format commun : `format/livre-mp.css` = une seule source pour les livres convertis (changer = publier, sans rechiffrer). Pas convertis : EGI 10 Plomberie, EGI 11 Ventilation, Plomberie 13 Notions d'énergie, SAE Puits (tel quel), C9 (cadre seulement).
- Couvertures : modèle `outils/couvertures/` (`livres.py`), vignettes `img/couvertures/*.jpg` 1020×1320 listées dans `js/couvertures.js`.
- Lecteur : état `RD`, `buildDriver`, `HOSTCSS` (CSS injecté dans tous les livres), zoom « photo » (`#rscale`).

## Fichiers clés
- `index.html` + `js/` (`livres.js`, `biblio.js`, `lecteur*.js`, `tableau-blanc.js`, `acces.js`, `quoi-de-neuf.js`, `aide.js`…) + `css/`.
- `accueil.html` (accueil de classe, ménage `js/accueil-menage.js`), `labo.html`, `quiz.html` (`js/quiz.js`, `quiz-livres.js`), `simulateur.html`, `telecommande.html`, `outils-atelier.html` (Gestion d'atelier) + `passeport.html` (registre) + `coffres.html`, `presentation.html`, `confidentialite.html`, `tests.html` (pages d'essai, admin seulement).
- `garde.js` / `garde-nav.js` (en-tête, barre de navigation, pied de page, garde enseignant), `coffre.js` (données chiffrées dans Supabase), `signaler.js` (signalements ntfy `metierplus-signal-f3ce60fd2f6c0f46`), `plein-ecran.js` (bouton + numéro de version pour Jeremy), `vieux-navigateur.js`, `sw.js` (cache hors ligne : changer le numéro pour forcer).
- Données publiques : `comptes.json` (comptes, clés des livres), `reglages.json`, `locaux.json`, `protocoles.json`, `recherche.json` (généré).
- `outils/` : publication, chiffrement, PDF, plans (`outils/plans/generer.py`), conversions. Ne jamais commiter `outils/plans/sortie/`.

## En cours (17 nov.)
- Fluidité : `js/journal-perf.js` tourne pour **tous les enseignants connectés, sur tout appareil** (25 nov.; titre « Journal fluidite TNI / cellulaire / ordinateur / tablette »). Une tâche planifiée (jours de semaine, fin d'après-midi) lit les rapports avec WebFetch : Supabase `https://kjlotlhqrgekzohshmbn.supabase.co/rest/v1/rpc/journal_lire?p_heures=24&apikey=<clé publique de coffre.js>` (table `journal`, `outils/journal.sql`, 30 jours) et ntfy `https://ntfy.sh/metierplus-signal-f3ce60fd2f6c0f46/json?poll=1&since=12h` (erreurs, et journaux si Supabase ne répond pas), corrige ce qui est clair, teste, publie et note dans l'historique. Avant de corriger : chercher dans l'historique si c'est déjà fait.
- Version élève : **lancée le 25 nov.** (mentions « élèves et enseignants », aide à la connexion, nouveauté visible). Comptes de groupe (`eleve:true`). Comptes « chef de groupe » (`chef:true`, bouton sur la fiche) = droits d'administrateur dans la Gestion d'atelier seulement. Étiquette ALPHA réglable dans Administration → Site.
