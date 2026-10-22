# Bibliothèque des livres animés — Pavillon de l'Avenir

Conçu par Jeremy, enseignant. Site : https://cfppaplc.github.io/bibliotheque/

- `index.html` : la bibliothèque (seule version à entretenir)
- `livres/` : un fichier HTML par livre, téléchargé quand on l'ouvre puis gardé sur l'ordinateur (hors ligne)
- `plans/` : les dossiers de plans d'exercice (PDF + image de secours)
- `accueil.html` : le tableau d'accueil de classe (ouvert seul ou depuis la bibliothèque)

Pour ajouter un livre : déposer le fichier dans `livres/` et ajouter son bloc dans la liste `LIVRES` de `index.html`
(le champ `fichier` = nom du fichier sans `.html`).

## Quoi de neuf (`nouveautes.json`)

Une entrée par **sujet** (pas une par mise à jour). Champs :
- `date` : date de la dernière mise à jour du sujet (AAAA-MM-JJ) — c'est elle qui allume le point rouge.
- `type` : `ajout` (nouveau livre), `maj` (livre mis à jour) ou `outil` (bibliothèque).
- `livre` : nom du fichier du livre, sans `.html` (facultatif).
- `titre`, `texte` : le sujet et un résumé à jour.
- `formation` : liste des étapes de la mini-formation (bouton « + »).
- `versions` : historique `{ date, texte }`, du plus récent au plus ancien.

Pour une nouvelle version d'un sujet existant : mettre à jour `date`, `texte` et `formation`, et ajouter une ligne en tête de `versions`.
