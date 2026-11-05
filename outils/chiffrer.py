# -*- coding: utf-8 -*-
"""Protéger (chiffrer) un livre pour la bibliothèque — même format que le bloc « Accès protégé » d'index.html.
Usage : python3 outils/chiffrer.py <livre.html clair> <fichier> [--comptes id1,id2]
  - livres/<fichier>.chiffre    = iv(12) + AES-GCM(gzip(html))
  - recherche/<fichier>.chiffre = iv(12) + AES-GCM(gzip(JSON des pages, sans les réponses))
  - comptes.json : livres[fichier].cles[id] = clé du livre enveloppée pour chaque compte
    (admins + comptes dont le programme = catégorie du livre dans index.html + --comptes)
Le .html clair n'est jamais copié dans le site. Garder l'original hors du dépôt."""
import sys, os, re, json, gzip, base64, hashlib
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.asymmetric import ec, rsa, padding
from cryptography.hazmat.primitives import hashes, serialization

SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
b64 = lambda b: base64.b64encode(b).decode()
def b64u_dec(s): return base64.urlsafe_b64decode(s + "=" * (-len(s) % 4))
def chiffre(cle, data):
    iv = os.urandom(12); return iv + AESGCM(cle).encrypt(iv, gzip.compress(data, 9), None)
def envelopper(brut, pub):
    if pub.get("kty") == "EC":
        x, y = int.from_bytes(b64u_dec(pub["x"]), "big"), int.from_bytes(b64u_dec(pub["y"]), "big")
        cible = ec.EllipticCurvePublicNumbers(x, y, ec.SECP256R1()).public_key()
        eph = ec.generate_private_key(ec.SECP256R1())
        k = hashlib.sha256(eph.exchange(ec.ECDH(), cible)).digest()
        iv = os.urandom(12); c = AESGCM(k).encrypt(iv, brut, None)
        e = eph.public_key().public_bytes(serialization.Encoding.X962, serialization.PublicFormat.UncompressedPoint)
        return "E" + b64(e + iv + c)
    n, e = int.from_bytes(b64u_dec(pub["n"]), "big"), int.from_bytes(b64u_dec(pub["e"]), "big")
    pk = rsa.RSAPublicNumbers(e, n).public_key()
    while True:
        s = b64(pk.encrypt(brut, padding.OAEP(mgf=padding.MGF1(hashes.SHA256()), algorithm=hashes.SHA256(), label=None)))
        if s[0] != "E": return s
def pages_texte(html):
    from bs4 import BeautifulSoup
    html = re.sub(r'data:[a-z/+.-]+;base64,[A-Za-z0-9+/=]+', '', html)
    soup = BeautifulSoup(html, "lxml")
    for t in soup(["script", "style", "noscript"]): t.decompose()
    out = []
    for p in [p for p in soup.select(".page") if not p.find_parent(class_="page")]:
        for a in p.select(".ans,.reponse,.answer,.solution,.correction,[data-reponse]"): a.decompose()
        out.append(re.sub(r"\s+", " ", p.get_text(" ")).strip()[:4000])
    return out

if __name__ == "__main__":
    src, f = sys.argv[1], sys.argv[2]
    extra = sys.argv[sys.argv.index("--comptes") + 1].split(",") if "--comptes" in sys.argv else []
    html = open(src, encoding="utf-8").read()
    idx = open(f"{SITE}/index.html", encoding="utf-8").read()
    m = re.search(r'categorie:"([^"]+)"[^}]*fichier:"' + re.escape(f) + '"', idx)
    cat = m.group(1) if m else None
    C = json.load(open(f"{SITE}/comptes.json", encoding="utf-8"))
    ids = [i for i, c in C["comptes"].items() if c.get("admin") or (cat and cat in (c.get("prog") or []))] + [i for i in extra if i in C["comptes"]]
    ids = list(dict.fromkeys(ids))
    cle = AESGCM.generate_key(256)
    open(f"{SITE}/livres/{f}.chiffre", "wb").write(chiffre(cle, html.encode("utf-8")))
    os.makedirs(f"{SITE}/recherche", exist_ok=True)
    open(f"{SITE}/recherche/{f}.chiffre", "wb").write(chiffre(cle, json.dumps(pages_texte(html), ensure_ascii=False, separators=(",", ":")).encode("utf-8")))
    C["livres"][f] = {"cles": {i: envelopper(cle, C["comptes"][i]["pub"]) for i in ids}}
    json.dump(C, open(f"{SITE}/comptes.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    if os.path.exists(f"{SITE}/livres/{f}.html"): os.remove(f"{SITE}/livres/{f}.html")
    print(f"{f} : protégé (catégorie « {cat} ») pour", ", ".join(ids))
