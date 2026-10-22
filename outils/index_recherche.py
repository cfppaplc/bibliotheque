# -*- coding: utf-8 -*-
"""Crée recherche.json : le texte de chaque page de chaque livre (pour la recherche dans les livres)."""
import json, os, re, sys
from bs4 import BeautifulSoup
SITE = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
out = {}
for f in sorted(os.listdir(SITE + "/livres")):
    if not f.endswith(".html"): continue
    html = open(f"{SITE}/livres/{f}", encoding="utf-8", errors="replace").read()
    html = re.sub(r'data:[a-z/+.-]+;base64,[A-Za-z0-9+/=]+', '', html)
    soup = BeautifulSoup(html, "lxml")
    for t in soup(["script", "style", "noscript"]): t.decompose()
    pages = [p for p in soup.select(".page") if not p.find_parent(class_="page")]
    txt = []
    for p in pages:
        for a in p.select(".ans,.reponse,.answer,.solution,.correction,[data-reponse]"): a.decompose()   # pas les réponses
        t = re.sub(r"\s+", " ", p.get_text(" ")).strip()
        txt.append(t[:4000])
    out[f[:-5]] = txt
json.dump(out, open(SITE + "/recherche.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print(f"recherche.json : {os.path.getsize(SITE + '/recherche.json')/1e6:.2f} Mo", {k: len(v) for k, v in out.items()})
