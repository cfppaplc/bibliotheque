# Vérifie la syntaxe de chaque <script> intégré (index.html, accueil.html) avant de publier.
import re, subprocess, sys, tempfile, os
site = sys.argv[1]; err = 0
for f in ["index.html", "accueil.html"]:
    s = open(os.path.join(site, f), encoding="utf-8").read()
    for i, sc in enumerate(re.findall(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', s, re.S)):
        if not sc.strip(): continue
        with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as t: t.write(sc)
        r = subprocess.run(["node", "--check", t.name], capture_output=True, text=True); os.unlink(t.name)
        if r.returncode: err += 1; print(f"ERREUR de syntaxe dans {f}, script {i}:\n" + r.stderr[:600])
if err: sys.exit(1)
print("scripts : syntaxe OK")
