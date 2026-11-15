"""PDF d'un livre pour imprimer (15 nov.), administrateur seulement.
Usage : python3 outils/pdf_livres.py <livre.pdf> <fichier>
  - pdf/<fichier>.chiffre = iv(12) + AES-GCM(pdf)
  - pdf/cles.json : { fichier: { compte admin: clé enveloppée } }
Fabriquer le PDF : voir CLAUDE.md (« PDF des livres pour imprimer »)."""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
from chiffrer import envelopper, SITE
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
src, f = sys.argv[1], sys.argv[2]
C = json.load(open(f"{SITE}/comptes.json", encoding="utf-8"))
ids = [i for i, c in C["comptes"].items() if c.get("admin")]
cle = AESGCM.generate_key(256); iv = os.urandom(12)
os.makedirs(f"{SITE}/pdf", exist_ok=True)
open(f"{SITE}/pdf/{f}.chiffre", "wb").write(iv + AESGCM(cle).encrypt(iv, open(src, "rb").read(), None))
p = f"{SITE}/pdf/cles.json"; K = json.load(open(p)) if os.path.exists(p) else {}
K[f] = {i: envelopper(cle, C["comptes"][i]["pub"]) for i in ids}
json.dump(K, open(p, "w"), indent=1)
print(f, ": PDF chiffré pour", ", ".join(ids))
