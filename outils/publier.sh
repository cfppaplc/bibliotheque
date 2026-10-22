#!/bin/bash
# Publier la bibliothèque depuis la racine du dépôt (le dépôt EST le site GitHub Pages).
# Usage : bash outils/publier.sh "message du commit" [livre1 livre2 ...]
#   - vérifie la syntaxe des <script> de index.html et accueil.html (arrête tout si erreur)
#   - refait recherche.json (texte des livres pour la recherche)
#   - vérifie les livres nommés (sans .html) dans un vrai navigateur (Playwright)
#   - commit + push sur main → GitHub Pages publie en 1-2 min
set -e
cd "$(dirname "$0")/.."
MSG="$1"; shift || true
python3 outils/verifier_scripts.py .
python3 outils/index_recherche.py .
if [ $# -gt 0 ]; then
  python3 -m http.server 8790 >/dev/null 2>&1 & SRV=$!; sleep 1
  NODE_PATH=$(npm root -g) node outils/verifier_livre.js http://localhost:8790/ "$@" || true
  kill $SRV 2>/dev/null || true
fi
git add -A && git commit -q -m "$MSG" && git push origin main 2>&1 | tail -1
