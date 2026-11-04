#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Générateur de dossiers de plans : produit les PDF, copie dans plans/, refait l'image de secours (feuille du plan principal),
met à jour le nombre de feuilles des cartes de l'accueil des plans et refait le contrôle de qualité.
Usage : python3 generer.py [1 2 3 4 5] [--publier]    (sans numéro : tous les dossiers; --publier copie dans plans/ et met à jour index.html)"""
import os, re, subprocess, sys, shutil, glob, importlib, io, contextlib

ICI = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.abspath(os.path.join(ICI, "..", ".."))
os.chdir(ICI)
os.makedirs("sortie", exist_ok=True)

DOSSIERS = {
    1: ("d1_maison", "maison", "Dossier-1.pdf", "PLAN DU REZ-DE-CHAUSSÉE"),
    2: ("d2_duplex", "duplex", "Dossier-2-Duplex-jumele.pdf", "PLAN DU REZ-DE-CHAUSSÉE"),
    3: ("d3_commercial", "commerce", "Dossier-3-Batiment-commercial.pdf", "PLAN DU REZ-DE-CHAUSSÉE"),
    4: ("d4_centre", "centre", "Dossier-4-Centre-commercial.pdf", "PLAN DU REZ-DE-CHAUSSÉE"),
    5: ("ferme", None, "Dossier-5-Ferme-laitiere.pdf", "PLAN DE L'ÉTABLE"),
}


DOSSIERS_NOMS = {1: "Maison unifamiliale", 2: "Duplex jumelé", 3: "Bâtiment commercial", 4: "Centre commercial", 5: "Ferme laitière"}


def pages(pdf):
    out = subprocess.run(["pdfinfo", pdf], capture_output=True, text=True).stdout
    return int(re.search(r"Pages:\s+(\d+)", out).group(1))


def trouver_page(pdf, titre):
    for p in range(1, pages(pdf) + 1):
        t = subprocess.run(["pdftotext", "-f", str(p), "-l", str(p), pdf, "-"], capture_output=True, text=True).stdout
        if titre in t and "LISTE DES FEUILLES" not in t and "Page de garde" not in t: return p
    return None


def activites(n):
    """Copie les questionnaires dans activites/ (onglet Activités du site) avec une couverture qui montre bien de quel plan il s'agit."""
    for kind, titre in (("lecture", "LECTURE + MESURE"),):
        src = f"dossier-{n}-exercices.pdf" if kind == "lecture" else f"dossier-{n}-echelle.pdf"
        cor = f"dossier-{n}-corrige.pdf" if kind == "lecture" else f"dossier-{n}-echelle-corrige.pdf"
        if not os.path.exists(os.path.join(SITE, "plans", src)): continue
        shutil.copy(os.path.join(SITE, "plans", src), os.path.join(SITE, "activites", f"plans-d{n}-{kind}.pdf"))
        shutil.copy(os.path.join(SITE, "plans", cor), os.path.join(SITE, "activites", f"plans-d{n}-{kind}-corrige.pdf"))
        # couverture = la page de garde du questionnaire (même image partout)
        base = os.path.join(SITE, "activites", f"plans-d{n}-{kind}")
        subprocess.run(["pdftoppm", "-r", "60", "-f", "1", "-l", "1", "-scale-to-x", "420", "-scale-to-y", "-1", "-jpeg", "-jpegopt", "quality=88", "-singlefile", base + ".pdf", base], check=True)


def produire(n, publier):
    mod, _, pdf, titre = DOSSIERS[n]
    chemin = os.path.join("sortie", pdf)
    sys.argv = [mod, chemin]
    if os.path.exists(chemin): os.remove(chemin)
    m = importlib.import_module(mod)
    importlib.reload(m)
    obj = None
    if mod == "ferme":
        m.Ferme().produire(chemin)
    else:
        obj = getattr(m, DOSSIERS[n][1]); obj.produire(chemin)
    nb = pages(chemin)
    print(f"dossier {n} : {nb} feuilles -> {chemin}")
    if not publier: return nb
    shutil.copy(chemin, os.path.join(SITE, "plans", f"dossier-{n}.pdf"))
    if obj is not None:  # exercices + corrigé calculés sur les données du dossier
        import exercices
        exercices.generer(obj, nb, os.path.join(SITE, "plans", f"dossier-{n}-exercices.pdf"), os.path.join(SITE, "plans", f"dossier-{n}-corrige.pdf"), n, chemin, SITE)
        import exercices6
        exercices6.montage(SITE, n, getattr(obj, "details_meca", []))
    if obj is None:   # ferme : questionnaire écrit à la main
        import exercices
        exercices.generer_ferme(nb, os.path.join(SITE, "plans", f"dossier-{n}-exercices.pdf"), os.path.join(SITE, "plans", f"dossier-{n}-corrige.pdf"), chemin, SITE)
    activites(n)
    p = trouver_page(chemin, titre)
    if p:
        subprocess.run(["pdftoppm", "-r", "100", "-f", str(p), "-l", str(p), "-png", chemin, f"/tmp/sec{n}"], check=True)
        from PIL import Image
        Image.open(glob.glob(f"/tmp/sec{n}-*.png")[0]).convert("RGB").resize((1700, 1100)).save(os.path.join(SITE, "plans", f"dossier-{n}.png"))
        for f in glob.glob(f"/tmp/sec{n}-*.png"): os.remove(f)
    # nombre de feuilles sur la carte
    idx = os.path.join(SITE, "index.html")
    s = open(idx, encoding="utf-8").read()
    s2 = re.sub(rf'(data-ex="{n}" type="button"><span class="pn-img"><img src="plans/dossier-{n}-elevation.jpg" alt="" loading="lazy"><i>)\d+ feuilles', rf"\g<1>{nb} feuilles", s)
    if s2 != s: open(idx, "w", encoding="utf-8").write(s2)
    return nb


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    publier = "--publier" in sys.argv
    nums = [int(a) for a in args] or sorted(DOSSIERS)
    for n in nums:
        with contextlib.redirect_stdout(sys.stdout):
            produire(n, publier)
