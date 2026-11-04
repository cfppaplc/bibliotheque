# -*- coding: utf-8 -*-
"""Questionnaires de lecture de plans : questions calculées sur les données de chaque dossier (aucune réponse écrite à la main
sauf pour la ferme), types variés, banque de questions plus grande que le questionnaire : chaque dossier en pioche une partie
différente (rotation), a sa propre construction (par type, par discipline, par niveau, par défis) et ses images tirées des plans."""
import os, re, random, subprocess, math
from dessin import fmt
import questionnaire as qs
from batiment import APP

THEMES = {
    1: dict(couleur="#1c5f8f", mode="type", indices="tous", kicker="Lecture de plans · Parcours guidé", prefixe="Partie ", lettres=True,
            intro=["Parcours guidé : ouvre le dossier de plans (PDF ou papier 11 × 17 po) et réponds aux questions. Chaque partie a un type de question différent : lis bien la consigne.",
                   "Une étiquette bleue te dit sur quelle feuille chercher."]),
    2: dict(couleur="#2e7d4f", mode="discipline", indices="aucun", kicker="Lecture de plans · Visite de chantier", prefixe="Chantier ", lettres=False,
            intro=["Visite de chantier : tu es technicien(ne) et le client t'envoie le dossier de ce duplex. Vérifie-le discipline par discipline (architecture, plomberie, électricité…).",
                   "Cette fois, personne ne te dit sur quelle feuille chercher : c'est à toi de trouver."]),
    3: dict(couleur="#c26a12", mode="niveau", indices="niv1", kicker="Lecture de plans · Trois niveaux", prefixe="Étape ", lettres=False,
            intro=["Trois niveaux de difficulté : échauffement, mise en application, puis défi d'expert. Commence par le niveau 1 et monte à ton rythme.",
                   "Au niveau 1, une étiquette bleue indique la feuille; ensuite, tu cherches seul(e)."]),
    4: dict(couleur="#6a3fa0", mode="defis", indices="aucun", kicker="Lecture de plans · Défis", prefixe="Défi ", lettres=False,
            intro=["Trois défis à relever : éclair (réponses rapides), observation (images tirées des plans) et réflexion (calculs et pièges).",
                   "Chaque point compte : vise le meilleur pointage. Aucune étiquette ne t'aide."]),
    5: dict(couleur="#3b7d2a", mode="discipline", indices="tous", kicker="Lecture de plans · Étude de cas", prefixe="Volet ", lettres=False,
            intro=["Étude de cas : une ferme laitière moderne (étable à stabulation libre, robots de traite, silos). Explore le dossier volet par volet.",
                   "Une étiquette bleue indique la feuille à consulter."]),
}


def _virg(x, n=1): return f"{x:.{n}f}".replace(".", ",")


# ------------------------------------------------------------------ images tirées des plans
_PAGES = {}


def _pages(pdf):
    if pdf in _PAGES: return _PAGES[pdf]
    n = int(re.search(r"Pages:\s+(\d+)", subprocess.run(["pdfinfo", pdf], capture_output=True, text=True).stdout).group(1))
    m = {}
    for p in range(2, n + 1):
        t = subprocess.run(["pdftotext", "-f", str(p), "-l", str(p), pdf, "-"], capture_output=True, text=True).stdout
        if "TITRE DE LA FEUILLE" not in t: continue
        for code in re.findall(r"^([A-Z]-\d{3})$", t, re.M): m.setdefault(code, p)
    _PAGES[pdf] = m
    return m


def _vignette(pdf, code, sortie, larg=760):
    p = _pages(pdf).get(code)
    if not p: return None
    base = sortie[:-4]
    subprocess.run(["pdftoppm", "-r", "60", "-f", str(p), "-l", str(p), "-scale-to-x", str(larg), "-scale-to-y", "-1", "-png", "-singlefile", pdf, base], check=True)
    return sortie if os.path.exists(sortie) else None


def _cartouche(pdf, code, sortie):
    p = _pages(pdf).get(code)
    if not p: return None
    base = sortie[:-4]
    subprocess.run(["pdftoppm", "-r", "130", "-f", str(p), "-l", str(p), "-x", str(int(348 * 130 / 25.4)), "-y", str(int(236 * 130 / 25.4)), "-W", str(int(76 * 130 / 25.4)), "-H", str(int(35.5 * 130 / 25.4)), "-png", "-singlefile", pdf, base], check=True)
    return sortie if os.path.exists(sortie) else None


# ------------------------------------------------------------------ contexte
class Ctx:
    pass


def _lv(b):
    if hasattr(b, "lv"): return list(zip(("le sous-sol", "le rez-de-chaussée", "l'étage"), b.lv))
    return [("le rez-de-chaussée", b)]


def _contexte(b, nb, n, pdf, tmp):
    from collections import Counter
    C = Ctx(); C.b, C.n, C.nb, C.pdf = b, n, nb, pdf
    C.rng = random.Random(f"{b.dossier['code']}-q")
    C.lv = _lv(b); C.rdc = C.lv[1][1] if hasattr(b, "lv") else b
    C.plan_no = getattr(C.rdc, "no_plan", "A-101"); C.Np = C.rdc.Nplan
    C.nom = lambda x: x.replace("\n", " ")
    C.loc = [(nv, x) for nv, l in C.lv for x in l.locaux]
    C.aire = lambda x: (x[4] - x[2]) * (x[5] - x[3]) / 1e6
    C.portes = [(l, o) for _, l in C.lv for o in l.portes if o.get("no")]
    C.nwc = sum(1 for _, l in C.lv for (code, *_r) in getattr(l, "app", []) if code == "wc")
    C.B = b.calcul_bilan(); C.tot = sum(C.aire(x) for _, x in C.loc)
    C.gl = max(C.loc, key=lambda t: C.aire(t[1])); C.pl = min(C.loc, key=lambda t: C.aire(t[1]))
    C.OU = f"Plan du rez-de-chaussée ({C.plan_no})"
    C.cnt = Counter(o["type"] for _, l in C.lv for o in l.fenetres)
    C.hc = getattr(C.rdc, "hc", None)
    C.no_pl = getattr(C.rdc, "no_plomb", "P-101"); C.no_el = getattr(C.rdc, "no_elec", "E-101"); C.no_cv = getattr(C.rdc, "no_cvca", "M-101")
    C.ce_loc = None
    for _, l in C.lv:
        for (code, x, y, _r) in getattr(l, "app", []):
            if code == "ce":
                C.ce_loc = next((C.nom(r[1]) + f" ({r[0]})" for r in l.locaux if r[2] <= x <= r[4] and r[3] <= y <= r[5]), None)
    C.tmp = tmp
    return C


# ------------------------------------------------------------------ questions avec image (variées : titres, cartouches, tableaux, légendes, disciplines)
DISC = {"A": "Architecture", "S": "Structure", "P": "Plomberie", "E": "Électricité", "M": "Chauffage et ventilation (mécanique)", "C": "Génie civil"}
_INFO = {}


def _texte_zone(pdf, page, x, y, w, h):
    pt = 72 / 25.4
    out = subprocess.run(["pdftotext", "-f", str(page), "-l", str(page), "-x", str(int(x * pt)), "-y", str(int(y * pt)), "-W", str(int(w * pt)), "-H", str(int(h * pt)), "-layout", pdf, "-"], capture_output=True, text=True).stdout
    return [l.strip() for l in out.splitlines() if l.strip()]


def _mots(pdf, page):
    from xml.etree import ElementTree as ET
    x = subprocess.run(["pdftotext", "-bbox", "-f", str(page), "-l", str(page), pdf, "-"], capture_output=True, text=True).stdout
    x = re.sub(r"<!DOCTYPE[^>]*>", "", x).replace('xmlns="http://www.w3.org/1999/xhtml"', "")
    k = 25.4 / 72
    return [(float(w.get("xMin")) * k, float(w.get("yMin")) * k, float(w.get("xMax")) * k, float(w.get("yMax")) * k, w.text or "") for w in ET.fromstring(x).iter("word")]


def _info(pdf, code):
    """Titre et échelle d'une feuille, lus dans son cartouche (texte réel du PDF)."""
    cle = (pdf, code)
    if cle in _INFO: return _INFO[cle]
    p = _pages(pdf).get(code)
    if not p: return None
    t = [l for l in _texte_zone(pdf, p, 348, 207, 76, 19) if not l.startswith("TITRE DE LA") and not l.startswith("CONÇU")]
    e = _texte_zone(pdf, p, 348, 242, 38, 11)
    ech = e[1] if len(e) > 1 else ""
    _INFO[cle] = dict(page=p, titre=" ".join(t), ech=ech); return _INFO[cle]


def _zone_png(pdf, page, x, y, w, h, sortie, dpi=120):
    k = dpi / 25.4
    base = sortie[:-4]
    subprocess.run(["pdftoppm", "-r", str(dpi), "-f", str(page), "-l", str(page), "-x", str(int(x * k)), "-y", str(int(y * k)), "-W", str(int(w * k)), "-H", str(int(h * k)), "-png", "-singlefile", pdf, base], check=True)
    return sortie


def _avec_image(q, f, w, legende):
    from PIL import Image
    iw, ih = Image.open(f).size
    q.update(img=f, img_w=w, img_h=w * ih / iw, legende=legende); return q


def images(C):
    """Banque de questions avec image : 7 sortes × 4 feuilles différentes. Le dossier n prend les siennes (voir _choisir)."""
    rng = C.rng
    def codes():
        c = [k for k in _pages(C.pdf) if k[0] in DISC]
        return sorted(c)
    def feuille(s, exclure=()):
        l = [c for c in codes() if c not in exclure and _info(C.pdf, c)]
        return l[(s * 5 + C.n * 3) % len(l)]
    def cat_de(code): return {"P": "plomb", "E": "elec", "M": "cvca"}.get(code[0], "arch")
    def titre_options(code):
        t = _info(C.pdf, code)["titre"]; autres = list({_info(C.pdf, c)["titre"] for c in codes() if c != code and _info(C.pdf, c)} - {t}); rng.shuffle(autres)
        o = [t] + autres[:3]; rng.shuffle(o); return o, t

    def thumb_titre(s):
        if not C.pdf: return None
        code = feuille(s); f = _vignette(C.pdf, code, os.path.join(C.tmp, f"vt-{s}.png"))
        if not f: return None
        o, t = titre_options(code)
        return _avec_image(qs.qcm("Observe cette feuille (réduite) : quel est son titre ?", o, t, f"Feuille {code} — titre au cartouche (ou page de garde)", cat=cat_de(code), niv=2), f, 72, "Miniature d'une feuille du dossier")
    def cart_echelle(s):
        if not C.pdf: return None
        for k in range(len(codes())):
            code = feuille(s + k); info = _info(C.pdf, code)
            if re.match(r"^1:\d+$", info["ech"]): break
        else: return None
        f = _cartouche(C.pdf, code, os.path.join(C.tmp, f"ce-{s}.png"))
        if not f: return None
        v = int(info["ech"][2:]); ech = [20, 25, 50, 75, 100, 125, 200, 250, 500]; aut = [e for e in ech if e != v]; rng.shuffle(aut); o = sorted([v] + aut[:3])
        return _avec_image(qs.qcm("Quelle est l'échelle de la feuille dont voici le cartouche ?", [f"1:{x}" for x in o], info["ech"], f"Cartouche de la feuille {code}, case « Échelle »", cat="lecture", niv=1), f, 60, "Cartouche (coin inférieur droit d'une feuille)")
    def cart_titre(s):
        if not C.pdf: return None
        code = feuille(s); info = _info(C.pdf, code); f = _cartouche(C.pdf, code, os.path.join(C.tmp, f"ct-{s}.png"))
        if not f: return None
        return _avec_image(qs.rep("Lis ce cartouche : quel est le numéro de la feuille et quel est son titre ?", f"{code} — {info['titre'].capitalize()}", f"Cartouche de la feuille {code}", cat=cat_de(code), niv=1), f, 60, "Cartouche (coin inférieur droit d'une feuille)")
    def thumb_disc(s):
        if not C.pdf: return None
        code = feuille(s); f = _vignette(C.pdf, code, os.path.join(C.tmp, f"vd-{s}.png"))
        if not f: return None
        bonne = DISC[code[0]]; aut = [v for k, v in DISC.items() if v != bonne]; rng.shuffle(aut); o = [bonne] + aut[:3]; rng.shuffle(o)
        return _avec_image(qs.qcm("Observe cette feuille (réduite) : à quelle discipline appartient-elle ?", o, bonne, f"Lettre du numéro de la feuille ({code[0]} = {bonne.lower()})", cat=cat_de(code), niv=2), f, 72, "Miniature d'une feuille du dossier")
    def donnees(s):
        d = getattr(C.b, "donnees", None)
        if not C.pdf or not d: return None
        mot = next((m for m in _mots(C.pdf, 1) if m[4].startswith("DONN")), None)
        if not mot: return None
        f = _zone_png(C.pdf, 1, mot[0] - 3, mot[1] - 3, 120, 8 + 6.7 * len(d), os.path.join(C.tmp, f"dn-{s}.png"))
        ligne = d[(s + C.n) % len(d)]
        return _avec_image(qs.rep(f"Selon ce tableau de la page de garde, quelle est la valeur de « {ligne[0]} » ?", ligne[1], "Page de garde : « Données du bâtiment »", cat="lecture", niv=1), f, 100, "Extrait de la page de garde")
    def legende(s):
        if not C.pdf: return None
        cand = [c for c in codes() if c[0] == "P" and "PLOMBERIE" in _info(C.pdf, c)["titre"].upper() and "SCHÉMA" not in _info(C.pdf, c)["titre"].upper()]
        if not cand: return None
        code = cand[0]; p = _info(C.pdf, code)["page"]
        mot = next((m for m in _mots(C.pdf, p) if m[4] == "LÉGENDE"), None)
        if not mot: return None
        f = _zone_png(C.pdf, p, 346, mot[1] - 3, 78, 30, os.path.join(C.tmp, f"lg-{s}.png"))
        items = [("l'eau froide (EF)", "bleu"), ("l'eau chaude (EC)", "rouge"), ("le drainage sanitaire", "vert"), ("la ventilation (évent)", "mauve")]
        it = items[(s + C.n) % 4]
        o = ["bleu", "rouge", "vert", "mauve"]
        return _avec_image(qs.qcm(f"D'après cette légende d'un plan de plomberie, quelle couleur représente {it[0]} ?", o, it[1], f"Légende de la feuille {code}", cat="plomb", niv=1), f, 70, "Légende d'un plan de plomberie")
    def finis(s):
        if not C.pdf or not hasattr(C.b, "locaux") and not hasattr(C.b, "lv"): return None
        p = _pages(C.pdf).get("A-401")
        if not p: return None
        mot = next((m for m in _mots(C.pdf, p) if m[4] == "TABLEAU"), None)
        if not mot: return None
        import generique
        rows = []
        for (nivnom, locaux, hc) in generique._niveaux_finis(C.b):
            for (no, nom, *_r) in locaux:
                pl, mu, pt, pb = generique.finis_de(nom)
                if "sous-sol" in nivnom.lower() and pl.startswith("Bois"): pl = "Plancher flottant stratifié sur sous-couche"
                rows.append((no, C.nom(nom), pl))
        vis = rows[:3]; no, nom, pl = vis[(s + C.n) % len(vis)]
        f = _zone_png(C.pdf, p, mot[0] - 3, mot[1] - 4, 200, 58, os.path.join(C.tmp, f"fi-{s}.png"))
        autres = list({r[2] for r in rows} - {pl}); rng.shuffle(autres)
        if len(autres) < 3: return None
        o = [pl] + autres[:3]; rng.shuffle(o)
        return _avec_image(qs.qcm(f"Selon ce tableau, quel fini de plancher est prévu pour le local {no} « {nom} » ?", o, pl, "Tableau des locaux et des finis, feuille A-401", cat="arch", niv=2), f, 150, "Tableau des finis")

    genres = [thumb_titre, cart_echelle, cart_titre, thumb_disc, donnees, legende, finis]
    pool = []
    for j in range(5):        # indice 4j + p : le dossier p+1 reçoit une sorte différente à chaque rang
        for p in range(4):
            g = genres[(j + p) % len(genres)]
            pool.append((lambda g=g, s=j * 4 + p: g(s)))
    return pool


# ------------------------------------------------------------------ banque de questions (chaque fonction retourne une question ou None)
def banque(C):
    b, rng, qs_ = C.b, C.rng, qs
    nom, aire = C.nom, C.aire
    portes_w = sorted({o["w"] for _, o in C.portes})
    std = [100, 125, 150, 200, 225, 300, 400, 600]; base = C.B["service"]
    def autres_locaux(excl, k):
        a = [x for _, x in C.loc if x is not excl and abs(aire(x) - aire(excl)) > .8]; rng.shuffle(a); return a[:k]
    P = {k: [] for k in ("rep", "qcm", "vf", "trou", "assoc", "calc", "erreur", "ordre", "img")}
    add = lambda t: (lambda f: P[t].append(f) or f)

    # ---------- réponse courte
    @add("rep")
    def _(): return qs_.rep("Quelle est l'échelle du plan du rez-de-chaussée ?", f"1:{C.Np}", f"Cartouche de la feuille {C.plan_no}, case « Échelle »", cat="lecture")
    @add("rep")
    def _(): return qs_.rep("Combien de feuilles contient ce dossier de plans ?", str(C.nb), "Page de garde : liste des feuilles", cat="lecture")
    @add("rep")
    def _(): return qs_.rep("Quelle est la largeur hors tout du bâtiment, en millimètres ?", f"{fmt(b.W)} mm", "Cote extérieure, " + C.OU, cat="arch")
    @add("rep")
    def _(): return qs_.rep("Quelle est la profondeur hors tout du bâtiment, en millimètres ?", f"{fmt(b.D)} mm", "Cote extérieure, " + C.OU, cat="arch")
    @add("rep")
    def _():
        g = max(C.portes, key=lambda t: t[1]["w"])[1]
        return qs_.rep("Quelle est la porte la plus large du bâtiment ? Donne son numéro et sa largeur.", f"Porte {g['no']}, {fmt(g['w'])} mm", "Tableau des portes, feuille A-301", cat="arch")
    @add("rep")
    def _(): return qs_.rep("Quel est le plus grand local du bâtiment, et quelle est sa superficie ?", f"{nom(C.gl[1][1])} ({C.gl[1][0]}), {_virg(aire(C.gl[1]))} m²", "Tableau des locaux et des finis, feuille A-401", cat="arch")
    @add("rep")
    def _(): return qs_.rep("Quelle est la superficie totale des locaux du bâtiment ?", f"{_virg(C.tot)} m²", "Tableau des locaux et des finis, feuille A-401 (total sous le tableau)", cat="arch")
    @add("rep")
    def _(): return qs_.rep("Quel est le plus petit local du bâtiment, et quelle est sa superficie ?", f"{nom(C.pl[1][1])} ({C.pl[1][0]}), {_virg(aire(C.pl[1]))} m²", "Tableau des locaux et des finis, feuille A-401", cat="arch")
    @add("rep")
    def _():
        t, k = C.cnt.most_common(1)[0]
        return qs_.rep(f"Combien de fenêtres de type {t} (hexagone « {t} ») compte le bâtiment au total ?", str(k), "Tableau des fenêtres, feuille A-301 (colonne « Qté »)", cat="arch")
    @add("rep")
    def _(): return qs_.rep("Combien de portes numérotées compte le bâtiment au total ?", str(len(C.portes)), "Tableau des portes, feuille A-301", cat="arch")
    @add("rep")
    def _(): return qs_.rep("Quelle grosseur d'entrée de service électrique le bilan de charge retient-il ?", f"{base} A ({C.B['tension']})", "Bilan de charge, feuille E-201", cat="elec")
    @add("rep")
    def _(): return qs_.rep("Combien de toilettes (wc) y a-t-il dans le bâtiment ?", str(C.nwc), f"Plans de plomberie ({C.no_pl}) ou tableau des appareils", cat="plomb")
    @add("rep")
    def _():
        ut = sum(APP[c][8] for _, l in C.lv for (c, *_r) in getattr(l, "app", []) if c in APP)
        return qs_.rep("Quel est le nombre total d'unités d'évacuation (UT) du bâtiment ?", f"{ut:g} UT".replace(".", ","), "Tableau de dimensionnement de la plomberie, feuille P-201", cat="plomb")
    @add("rep")
    def _():
        if not C.hc: return None
        return qs_.rep("Quelle est la hauteur libre sous plafond du rez-de-chaussée, en millimètres ?", f"{fmt(C.hc)} mm", "Notes générales du plan du rez-de-chaussée", cat="arch")
    @add("rep")
    def _(): return qs_.rep("Combien de niveaux (sous-sol compris) compte le bâtiment ?", str(len(C.lv)), "Plans d'architecture et page de garde", cat="arch")
    @add("rep")
    def _():
        if not C.ce_loc: return None
        return qs_.rep("Dans quel local est installé le chauffe-eau (symbole C-E) ?", C.ce_loc, f"Plan de plomberie ({C.no_pl})", cat="plomb")
    @add("rep")
    def _():
        r = rng.choice([x for _, x in C.loc])
        return qs_.rep(f"Quel est le numéro du local « {nom(r[1])} » ?", r[0], "Plans d'architecture / tableau des locaux, feuille A-401", cat="arch")
    @add("rep")
    def _(): return qs_.rep("Quel est le numéro de la feuille du plan de plomberie du rez-de-chaussée ?", C.no_pl, "Page de garde : liste des feuilles", cat="lecture")
    @add("rep")
    def _(): return qs_.rep("À quelle adresse se trouve le projet ?", b.dossier["adresse"].split("\n")[0], "Cartouche, case « Projet »", cat="lecture")
    @add("rep")
    def _(): return qs_.rep("Quelle date est inscrite au cartouche ?", b.dossier["date"], "Cartouche, case « Date »", cat="lecture")
    @add("rep")
    def _(): return qs_.rep("Combien de fenêtres (tous types) compte le bâtiment ?", str(sum(C.cnt.values())), "Tableau des fenêtres, feuille A-301", cat="arch")
    @add("rep")
    def _(): return qs_.rep("Sur quelle feuille trouve-t-on le plan d'électricité du rez-de-chaussée ?", C.no_el, "Page de garde : liste des feuilles", cat="lecture")

    # ---------- choix multiple
    @add("qcm")
    def _():
        o, bon = qs_.options_numeriques(b.D, rng, 500, fmt=fmt, unite=" mm"); return qs_.qcm("Quelle est la profondeur hors tout du bâtiment ?", o, bon, "Cote extérieure, " + C.OU, cat="arch")
    @add("qcm")
    def _(): return qs_.qcm("Dans les élévations, que représente un hexagone contenant une lettre ?", ["Le type de fenêtre", "Le numéro d'une porte", "Une prise électrique", "Un point de vue de coupe"], "Le type de fenêtre", "Légende et abréviations, feuille A-001", cat="lecture")
    @add("qcm")
    def _():
        if len(C.cnt) < 3: return None
        t = [x for x, _ in C.cnt.most_common()][:4]
        return qs_.qcm("Quel type de fenêtre est le plus fréquent dans le bâtiment ?", [f"Type {x}" for x in sorted(t)], f"Type {t[0]}", "Tableau des fenêtres, feuille A-301 (colonne « Qté »)", cat="arch")
    @add("qcm")
    def _():
        a = autres_locaux(C.pl[1], 3); o = [f"{nom(x[1])} ({x[0]})" for x in a] + [f"{nom(C.pl[1][1])} ({C.pl[1][0]})"]; rng.shuffle(o)
        return qs_.qcm("Lequel de ces locaux est le plus petit de tout le bâtiment ?", o, f"{nom(C.pl[1][1])} ({C.pl[1][0]})", "Tableau des locaux et des finis, feuille A-401", cat="arch")
    @add("qcm")
    def _():
        a = [v for v in std if v != base]; rng.shuffle(a); o = sorted([base] + a[:3])
        return qs_.qcm("Quelle entrée de service électrique le bilan de charge retient-il ?", [f"{v} A" for v in o], f"{base} A", "Bilan de charge, feuille E-201", cat="elec")
    @add("qcm")
    def _():
        if not C.ce_loc: return None
        a = [f"{nom(x[1])} ({x[0]})" for _, x in C.loc if f"{nom(x[1])} ({x[0]})" != C.ce_loc]; rng.shuffle(a)
        o = a[:3] + [C.ce_loc]; rng.shuffle(o)
        return qs_.qcm("Dans lequel de ces locaux le chauffe-eau est-il installé ?", o, C.ce_loc, f"Plan de plomberie ({C.no_pl})", cat="plomb")
    @add("qcm")
    def _():
        o, bon = qs_.options_numeriques(C.nwc, rng, 1, mini=0); return qs_.qcm("Combien de toilettes (wc) compte le bâtiment ?", o, bon, f"Plans de plomberie ({C.no_pl})", cat="plomb")
    @add("qcm")
    def _():
        o, bon = qs_.options_numeriques(len(C.lv), rng, 1); return qs_.qcm("Combien de niveaux (sous-sol compris) compte le bâtiment ?", o, bon, "Plans d'architecture", cat="arch")
    @add("qcm")
    def _():
        w = min(portes_w); o = [f"{fmt(w)} mm"] + [f"{fmt(w + d)} mm" for d in (-100, 100, 200)]; o = sorted(set(o), key=lambda s: int(re.sub(r"\D", "", s)))
        return qs_.qcm("Quelle est la largeur de la porte la plus étroite du bâtiment ?", o, f"{fmt(w)} mm", "Tableau des portes, feuille A-301", cat="arch")
    @add("qcm")
    def _():
        o, bon = qs_.options_numeriques(round(C.tot), rng, 10, fmt=str, unite=" m²"); return qs_.qcm("Quelle est (à peu près) la superficie totale des locaux ?", o, bon, "Tableau des locaux et des finis, feuille A-401", cat="arch")

    # ---------- vrai ou faux
    def tf(): return rng.random() < .5
    @add("vf")
    def _():
        v = tf(); n_ = C.nwc if v else C.nwc + rng.choice([1, 2]); return qs_.vf(f"Le bâtiment compte {n_} toilette(s).", v, "Plans de plomberie ou tableau des appareils", f"Il y a {C.nwc} toilette(s).", cat="plomb")
    @add("vf")
    def _():
        p0 = C.portes[len(C.portes) // 2][1]; v = tf(); w = p0["w"] if v else p0["w"] + rng.choice([-100, 100])
        return qs_.vf(f"La porte {p0['no']} mesure {fmt(w)} mm de large.", v, "Tableau des portes, feuille A-301", f"Elle mesure {fmt(p0['w'])} mm.", cat="arch")
    @add("vf")
    def _():
        v = tf(); e = C.Np if v else rng.choice([x for x in (50, 75, 100, 125, 200) if x != C.Np])
        return qs_.vf(f"Le plan du rez-de-chaussée est dessiné à l'échelle 1:{e}.", v, f"Cartouche de la feuille {C.plan_no}", f"L'échelle est 1:{C.Np}.", cat="lecture")
    @add("vf")
    def _():
        v = tf(); seuil = int(b.W // 1000 * 1000) + (-2000 if v else 2000)
        return qs_.vf(f"La largeur hors tout du bâtiment est {'supérieure' if v else 'inférieure'} à {fmt(seuil)} mm.", v, "Cote extérieure, " + C.OU, f"Elle est de {fmt(b.W)} mm : l'énoncé est faux.", cat="arch")
    @add("vf")
    def _():
        if not C.ce_loc: return None
        v = tf(); aut = [f"{nom(x[1])} ({x[0]})" for _, x in C.loc if f"{nom(x[1])} ({x[0]})" != C.ce_loc]; rng.shuffle(aut)
        return qs_.vf(f"Le chauffe-eau (symbole C-E) est installé dans le local « {C.ce_loc if v else aut[0]} ».", v, f"Plan de plomberie ({C.no_pl})", f"Il est dans « {C.ce_loc} ».", cat="plomb")
    @add("vf")
    def _():
        v = tf(); return qs_.vf(f"Le bilan de charge retient une entrée de service de {base if v else base * 2} A.", v, "Bilan de charge, feuille E-201", f"Il retient {base} A.", cat="elec")
    @add("vf")
    def _():
        v = tf(); s_ = C.nb - 3 if v else C.nb + 3; return qs_.vf(f"Ce dossier contient plus de {s_} feuilles.", v, "Page de garde : liste des feuilles", f"Il contient {C.nb} feuilles : l'énoncé est faux.", cat="lecture")
    @add("vf")
    def _():
        v = tf(); n_ = len(C.lv) if v else len(C.lv) + 1; return qs_.vf(f"Le bâtiment compte {n_} niveau(x), sous-sol compris.", v, "Plans d'architecture", f"Il compte {len(C.lv)} niveau(x).", cat="arch")
    @add("vf")
    def _():
        v = tf(); return qs_.vf(f"Sur les plans de plomberie, le trait {'bleu' if v else 'rouge'} représente l'eau froide.", v, "Légende du plan de plomberie", "Le rouge représente l'eau chaude; l'eau froide est en bleu.", cat="plomb")

    # ---------- texte à compléter
    @add("trou")
    def _(): return qs_.trou("Sur les plans de plomberie, le trait ______ représente l'eau froide (EF) et le trait ______ l'eau chaude (EC).", ["bleu", "rouge"], "Légende du plan de plomberie", cat="plomb")
    @add("trou")
    def _(): return qs_.trou("Ce bâtiment compte ______ niveau(x) et la superficie totale de ses locaux est de ______ m².", [str(len(C.lv)), _virg(C.tot)], "Plans d'architecture et feuille A-401", cat="arch")
    @add("trou")
    def _(): return qs_.trou("Dans le tableau de dimensionnement de la plomberie, UT veut dire « unité d'______ ».", ["évacuation"], "Feuille P-201 (en-tête du tableau)", cat="plomb")
    @add("trou")
    def _(): return qs_.trou(f"À l'échelle 1:{C.Np}, 1 mm sur le papier représente ______ mm dans la réalité.", [str(C.Np)], f"Cartouche de la feuille {C.plan_no}", cat="lecture")
    @add("trou")
    def _(): return qs_.trou("Hors tout, le bâtiment mesure ______ mm de large et ______ mm de profondeur.", [fmt(b.W), fmt(b.D)], "Cotes extérieures, " + C.OU, cat="arch")
    @add("trou")
    def _(): return qs_.trou("Le plan de plomberie du rez-de-chaussée est la feuille ______ et le plan d'électricité la feuille ______.", [C.no_pl, C.no_el], "Page de garde : liste des feuilles", cat="lecture")

    # ---------- association
    FEUILLES1 = [("A-201", "Élévations (vues extérieures)"), ("A-401", "Tableau des locaux et des finis"), ("P-201", "Dimensionnement de la plomberie"), ("E-201", "Bilan de charge et panneau")]
    FEUILLES2 = [("A-001", "Légende, symboles et abréviations"), ("A-002", "Analyse du code de construction"), ("A-100", "Plan d'implantation et de site"), ("S-101", "Plan des fondations")]
    ABREV1 = [("EF", "Eau froide"), ("EC", "Eau chaude"), ("VRC", "Ventilateur récupérateur de chaleur"), ("AFCI", "Disjoncteur anti-arcs")]
    ABREV2 = [("UT", "Unité d'évacuation"), ("C-E", "Chauffe-eau"), ("DF", "Avertisseur de fumée"), ("LV", "Lave-vaisselle")]
    @add("assoc")
    def _(): return qs_.assoc("Associe chaque feuille à son contenu.", FEUILLES1, "Page de garde : liste des feuilles", rng, cat="lecture")
    @add("assoc")
    def _(): return qs_.assoc("Associe chaque abréviation à sa signification.", ABREV1, "Légende et abréviations, feuille A-001", rng, cat="lecture")
    @add("assoc")
    def _(): return qs_.assoc("Associe chaque feuille à son contenu.", FEUILLES2, "Page de garde : liste des feuilles", rng, cat="lecture")
    @add("assoc")
    def _(): return qs_.assoc("Associe chaque symbole ou sigle à sa signification.", ABREV2, "Légendes des plans de plomberie et d'électricité", rng, cat="elec")
    @add("assoc")
    def _():
        l = [x for _, x in C.loc]; rng.shuffle(l); l = l[:4]
        return qs_.assoc("Associe chaque local à son numéro.", [(nom(x[1]), x[0]) for x in l], "Plans d'architecture / tableau des locaux, feuille A-401", rng, cat="arch")

    @add("assoc")
    def _():
        l = [x for _, x in C.loc]; rng.shuffle(l); l = l[4:8] if len(l) >= 8 else l[:4]
        return qs_.assoc("Associe chaque numéro de local à son nom.", [(x[0], nom(x[1])) for x in l], "Plans d'architecture / tableau des locaux, feuille A-401", rng, cat="arch")
    @add("assoc")
    def _():
        ps = [next(o for _, o in C.portes if o["w"] == w) for w in portes_w[:4]]
        if len(ps) < 3: return None
        return qs_.assoc("Associe chaque porte à sa largeur.", [(f"Porte {o['no']}", f"{fmt(o['w'])} mm") for o in ps], "Tableau des portes, feuille A-301", rng, cat="arch")
    @add("assoc")
    def _():
        codes = [c for c in ("wc", "lav", "bain", "dou", "evd") if any(c == cc for _, l in C.lv for (cc, *_r) in getattr(l, "app", []))][:4]
        if len(codes) < 3: return None
        return qs_.assoc("Associe chaque appareil à sa charge hydraulique (unités d'évacuation).", [(APP[c][0].split(" (")[0], f"{APP[c][8]:g} UT".replace(".", ",")) for c in codes], "Tableau de dimensionnement de la plomberie, feuille P-201", rng, cat="plomb")

    # ---------- calculs
    def local_calc():
        return rng.choice([x for _, x in C.loc if 6 <= aire(x) <= 60])
    @add("calc")
    def _():
        c3 = local_calc(); L, Pf = c3[4] - c3[2], c3[5] - c3[3]
        return qs_.calc(f"Le local {c3[0]} « {nom(c3[1])} » mesure {fmt(L)} mm sur {fmt(Pf)} mm (entre les faces intérieures). Calcule sa superficie en m².",
                        [f"{fmt(L)} mm = {_virg(L / 1000, 2)} m;   {fmt(Pf)} mm = {_virg(Pf / 1000, 2)} m", f"{_virg(L / 1000, 2)} × {_virg(Pf / 1000, 2)} = {_virg(L * Pf / 1e6, 2)} m²"], f"{_virg(L * Pf / 1e6, 1)} m²", "Dimensions des locaux, " + C.OU + " et feuille A-401", cat="calc")
    @add("calc")
    def _():
        if not C.hc: return None
        c3 = local_calc(); L, Pf = c3[4] - c3[2], c3[5] - c3[3]
        return qs_.calc(f"Calcule le volume d'air du local {c3[0]} « {nom(c3[1])} » (en m³), sachant que sa superficie est de {_virg(L * Pf / 1e6, 1)} m² et que la hauteur libre sous plafond est de {fmt(C.hc)} mm.",
                        [f"{_virg(L * Pf / 1e6, 1)} m² × {_virg(C.hc / 1000, 2)} m = {_virg(L * Pf / 1e6 * C.hc / 1000, 1)} m³"], f"{_virg(L * Pf / 1e6 * C.hc / 1000, 1)} m³", "Superficie (A-401) × hauteur libre (notes générales)", cat="calc")
    @add("calc")
    def _():
        codes = [c_ for c_ in ("bain", "wc", "lav", "evd", "dou") if any(c_ == cc for _, l in C.lv for (cc, *_r) in getattr(l, "app", []))][:3]
        if len(codes) < 3: return None
        nm = {k: APP[k][0].split(" (")[0].lower() for k in codes}; tt = sum(APP[k][8] for k in codes)
        return qs_.calc(f"Additionne les unités d'évacuation (UT) d'une {nm[codes[0]]}, d'une {nm[codes[1]]} et d'un(e) {nm[codes[2]]}.",
                        [" + ".join(f"{APP[k][8]:g}" for k in codes).replace(".", ",") + f" = {tt:g}".replace(".", ",") + " UT"], f"{tt:g} UT".replace(".", ","), "Tableau de dimensionnement de la plomberie, feuille P-201", cat="plomb")
    @add("calc")
    def _():
        per = 2 * (b.W + b.D)
        return qs_.calc("Calcule le périmètre extérieur du bâtiment (en mètres), à partir de sa largeur et de sa profondeur hors tout.",
                        [f"2 × ({fmt(b.W)} + {fmt(b.D)}) mm = {fmt(per)} mm", f"{fmt(per)} mm ÷ 1 000 = {_virg(per / 1000, 1)} m"], f"{_virg(per / 1000, 1)} m", "Cotes extérieures, " + C.OU, cat="calc")
    @add("calc")
    def _():
        p = b.W / C.Np
        return qs_.calc(f"À l'échelle 1:{C.Np}, quelle longueur (en mm) la largeur hors tout du bâtiment ({fmt(b.W)} mm) occupe-t-elle sur le papier ?",
                        [f"{fmt(b.W)} ÷ {C.Np} = {_virg(p, 1)} mm"], f"{_virg(p, 1)} mm", "Dimension réelle ÷ dénominateur de l'échelle", cat="calc")
    @add("calc")
    def _():
        a = autres_locaux(C.gl[1], 2)
        if len(a) < 1: return None
        x, y = C.gl[1], a[0]
        return qs_.calc(f"Le local « {nom(x[1])} » ({x[0]}) a une superficie de {_virg(aire(x))} m² et le local « {nom(y[1])} » ({y[0]}) de {_virg(aire(y))} m². Quelle est la superficie des deux locaux ensemble ?",
                        [f"{_virg(aire(x))} + {_virg(aire(y))} = {_virg(aire(x) + aire(y))} m²"], f"{_virg(aire(x) + aire(y))} m²", "Tableau des locaux et des finis, feuille A-401", cat="calc")
    @add("calc")
    def _():
        d = aire(C.gl[1]) - aire(C.pl[1])
        return qs_.calc(f"Quelle est la différence de superficie entre le plus grand local ({_virg(aire(C.gl[1]))} m²) et le plus petit ({_virg(aire(C.pl[1]))} m²) ?",
                        [f"{_virg(aire(C.gl[1]))} − {_virg(aire(C.pl[1]))} = {_virg(d)} m²"], f"{_virg(d)} m²", "Tableau des locaux et des finis, feuille A-401", cat="calc")
    @add("calc")
    def _():
        pc = aire(C.gl[1]) / C.tot * 100
        return qs_.calc(f"Le plus grand local fait {_virg(aire(C.gl[1]))} m² et la superficie totale des locaux est de {_virg(C.tot)} m². Quel pourcentage de la superficie totale représente-t-il (arrondi à l'unité) ?",
                        [f"{_virg(aire(C.gl[1]))} ÷ {_virg(C.tot)} × 100 = {pc:.1f} %".replace(".", ",")], f"{pc:.0f} %", "Tableau des locaux et des finis, feuille A-401", cat="calc")

    # ---------- trouve l'erreur
    @add("erreur")
    def _(): return qs_.erreur("« Sur les plans de plomberie, les conduites d'eau chaude sont en bleu et celles d'eau froide sont en rouge. »", "Les couleurs sont inversées : l'eau froide (EF) est bleue et l'eau chaude (EC) est rouge.", "Légende du plan de plomberie", cat="plomb")
    @add("erreur")
    def _(): return qs_.erreur(f"« Le plan du rez-de-chaussée est à l'échelle 1:{C.Np} : 1 mm sur le papier représente {max(1, C.Np // 10)} mm dans la réalité. »", f"1 mm sur le papier représente {C.Np} mm réels (et non {max(1, C.Np // 10)}).", f"Cartouche de la feuille {C.plan_no}", cat="lecture")
    @add("erreur")
    def _(): return qs_.erreur(f"« La largeur hors tout est de {fmt(b.W + 500)} mm et la profondeur hors tout est de {fmt(b.D)} mm. »", f"La largeur hors tout est de {fmt(b.W)} mm (et non {fmt(b.W + 500)} mm).", "Cotes extérieures, " + C.OU, cat="arch")
    @add("erreur")
    def _(): return qs_.erreur(f"« Ce dossier compte {C.nb} feuilles; le bilan de charge électrique se trouve sur la feuille A-401. »", "Le bilan de charge est sur la feuille E-201 (A-401 = tableau des locaux et des finis).", "Page de garde : liste des feuilles", cat="lecture")
    @add("erreur")
    def _(): return qs_.erreur(f"« Le bâtiment compte {C.nwc + 2} toilettes et {len(C.lv)} niveau(x). »", f"Il compte {C.nwc} toilette(s) (et non {C.nwc + 2}).", f"Plans de plomberie ({C.no_pl})", cat="plomb")
    @add("erreur")
    def _():
        a = autres_locaux(C.gl[1], 1)
        if not a: return None
        return qs_.erreur(f"« Le plus grand local du bâtiment est « {nom(a[0][1])} » ({a[0][0]}). »", f"Le plus grand local est « {nom(C.gl[1][1])} » ({C.gl[1][0]}), {_virg(aire(C.gl[1]))} m².", "Tableau des locaux et des finis, feuille A-401", cat="arch")

    # ---------- questions sur les feuilles : une par feuille, chaque dossier en pose d'autres
    SHEETS = [("A-001", "la légende des symboles et des abréviations"), ("A-002", "l'analyse du code de construction"), ("A-100", "le plan d'implantation et de site"),
              ("A-201", "les élévations (vues extérieures)"), ("A-401", "le tableau des locaux et des finis"), ("A-501", "les détails types de construction"),
              ("S-101", "le plan des fondations"), ("P-201", "le dimensionnement de la plomberie"), ("E-201", "le bilan de charge électrique")]
    for code, desc in SHEETS:
        def _q(code=code, desc=desc):
            autres = [c for c, _ in SHEETS if c != code]; rng.shuffle(autres); o = sorted([code] + autres[:3])
            return qs_.qcm(f"Sur quelle feuille trouve-t-on {desc} ?", o, code, "Page de garde : liste des feuilles", cat="lecture")
        P["qcm"].append(_q)
        def _v(code=code, desc=desc):
            v = tf(); autre = rng.choice([c for c, _ in SHEETS if c != code])
            return qs_.vf(f"La feuille {code if v else autre} contient {desc}.", v, "Page de garde : liste des feuilles", f"{desc.capitalize()} : feuille {code}.", cat="lecture")
        P["vf"].append(_v)
        def _e(code=code, desc=desc):
            autre, d2 = rng.choice([(c, d) for c, d in SHEETS if c != code])
            return qs_.erreur(f"« La feuille {code} contient {d2}. »", f"La feuille {code} contient {desc}; {d2} se trouve sur la feuille {autre}.", "Page de garde : liste des feuilles", cat="lecture")
        P["erreur"].append(_e)

    # ---------- classement
    @add("ordre")
    def _():
        c = sorted({round(aire(x), 1): x for _, x in C.loc}.items())
        if len(c) < 4: return None
        pas = max(1, len(c) // 4); ch = [c[i * pas][1] for i in range(4)]
        return qs_.ordre("Classe ces locaux du plus petit au plus grand.", [f"{nom(x[1])} ({x[0]})" for x in ch], "du plus petit au plus grand", "Tableau des locaux et des finis, feuille A-401", rng, cat="arch")
    @add("ordre")
    def _():
        c = sorted({round(aire(x), 1): x for _, x in C.loc}.items(), reverse=True)
        if len(c) < 4: return None
        ch = [c[i][1] for i in (0, 1, len(c) // 2, len(c) - 1)]
        return qs_.ordre("Classe ces locaux du plus grand au plus petit.", [f"{nom(x[1])} ({x[0]})" for x in ch], "du plus grand au plus petit", "Tableau des locaux et des finis, feuille A-401", rng, cat="arch")
    @add("ordre")
    def _():
        if len(portes_w) < 3: return None
        ps = [next(o for _, o in C.portes if o["w"] == w) for w in portes_w[:4]]
        return qs_.ordre("Classe ces portes de la plus étroite à la plus large.", [f"Porte {o['no']}" for o in ps], "de la plus étroite à la plus large", "Tableau des portes, feuille A-301", rng, cat="arch")

    P["img"] = images(C)
    return P


QUOTAS = dict(img=4, rep=4, qcm=6, vf=4, trou=3, assoc=2, calc=4, erreur=3, ordre=2)


def _choisir(pool, n, k, C):
    """k questions valides de la banque. Le dossier n prend d'abord ses générateurs « à lui » (index ≡ n−1 mod 4) :
    les 4 dossiers de bâtiments ne partagent ainsi presque aucune question; si sa part ne suffit pas, il pioche ensuite dans les autres."""
    L = len(pool)
    ordre = [i for i in range(L) if i % 4 == (n - 1) % 4] + [i for i in range(L) if i % 4 != (n - 1) % 4]
    out = []
    for i in ordre:
        if len(out) >= k: break
        try: q = pool[i]()
        except Exception: q = None
        if q is not None: out.append(q)
    return out


def _mesures(b, n, ferme=False):
    """Questions de mesure à l'échelle (échelimètre) à fusionner dans le questionnaire : ~8 mesures + quelques questions sur l'échelle."""
    import exercices_echelle as ee
    Qm = ee.questions_ferme() if ferme else ee.questions_batiment(b, f"D{n}")
    T = ee.typer(Qm, f"D{n}")
    mes = [q for q in T if q["t"] == "mesure"]; conc = [q for q in T if q["t"] != "mesure"]
    pas = max(1, len(mes) // 8); mes = mes[::pas][:8]
    rng = random.Random(f"mes-{n}"); rng.shuffle(conc)
    quotas = dict(qcm=1, vf=1, trou=1, assoc=1, calc=2, erreur=1, ordre=1); out = []
    for t, k in quotas.items(): out += [q for q in conc if q["t"] == t][:k]
    for q in mes + out: q["cat"] = "mesure"
    return mes + out


def _intro(n, mesure=True):
    T = list(THEMES[n]["intro"])
    if mesure: T.append("Pour les mesures, c'est à toi de trouver la bonne feuille et de lire son échelle dans le cartouche. Utilise ton échelimètre métrique, imprime le dossier à 100 % (papier 11 × 17 po) et vérifie le trait de 100 mm au bas de chaque feuille.".replace("échimètre", "échelimètre"))
    return T


def questions(b, nb_feuilles, n=1, pdf=None, tmp="/tmp/qimg"):
    os.makedirs(tmp, exist_ok=True)
    C = _contexte(b, nb_feuilles, n, pdf, tmp)
    P = banque(C)
    Q = []
    for t, k in QUOTAS.items(): Q += _choisir(P[t], n, k, C)
    import exercices6
    det = [(f_, q, r) for (f_, q, r) in exercices6.QUESTIONS if f_ in getattr(b, "details_meca", [])]
    random.Random(f"{n}-det").shuffle(det)
    for (f_, q, r) in det[:4]: Q.append(qs.rep(q, r, f"Feuille {f_} (détail)", cat="plomb" if f_.startswith("P") else "cvca", niv=3))
    Q += _mesures(b, n)
    return Q


def _theme(n, site):
    T = dict(THEMES[n]); T["couleur"] = qs.HexColor(T["couleur"])
    th = os.path.join(site, "plans", f"dossier-{n}-elevation.jpg") if site else None
    if th and os.path.exists(th): T["thumb"] = th
    return T


def generer(b, nb_feuilles, chemin_ex, chemin_corr, n=1, pdf=None, site=None):
    Q = questions(b, nb_feuilles, n, pdf)
    T = _theme(n, site); T["nom"] = f"Dossier {n} — {b.dossier['projet'].split(chr(10))[0].title()}"; T["intro"] = _intro(n)
    titre = b.dossier["projet"].split("\n")[0].title()
    sous = f"Dossier {n} · Lecture de plans et mesure à l'échelle"
    for (chemin, corr) in ((chemin_ex, False), (chemin_corr, True)):
        qs.generer_pdf(chemin, titre, sous, Q, corr, "", T, THEMES[n]["mode"])
    return Q


# ------------------------------------------------------------------ dossier 5 : ferme laitière
def questions_ferme(nb_feuilles, pdf=None, tmp="/tmp/qimg5"):
    import ferme
    os.makedirs(tmp, exist_ok=True)
    rng = random.Random("ferme-q"); Q = []
    W, D, N_LOG = ferme.W, ferme.D, ferme.N_LOG
    S = W * D / 1e6; per = 2 * (W + D)
    rep, qcm, vf, trou, assoc, calc, erreur, ordre = qs.rep, qs.qcm, qs.vf, qs.trou, qs.assoc, qs.calc, qs.erreur, qs.ordre
    # réponse courte
    Q += [rep("Quelle est la longueur de l'étable, en millimètres ?", f"{fmt(W)} mm", "Plan de l'étable, feuille A-101 (cotes)", cat="arch"),
          rep("Combien de logettes compte l'étable ?", str(N_LOG), "Page de garde (« Logettes ») et plan de l'étable, feuille A-101", cat="arch"),
          rep("Combien de robots de traite l'étable compte-t-elle ?", "2", "Page de garde (« Traite ») et plan de l'étable, feuille A-101", cat="arch"),
          rep("À quelle hauteur se trouve le faîte du toit par rapport au sol (± 0) ?", f"+ {fmt(ferme.ZF)}", "Élévations, feuille A-201 (niveaux)", cat="arch"),
          rep("Combien de silos-tours la ferme compte-t-elle, et quel est leur diamètre ?", "3 silos-tours, Ø 8 m", "Plan d'implantation (A-100) et élévation des silos (A-202)", cat="arch"),
          rep("Combien de feuilles contient ce dossier de plans ?", str(nb_feuilles), "Page de garde : liste des feuilles", cat="lecture")]
    # choix multiple
    qcm_ = [qcm("Quelle est la pente du toit de l'étable ?", ["5°", "10°", "15°", "30°"], "10°", "Page de garde (« Toiture ») et coupe, feuille A-301", cat="arch"),
            qcm("Quelle puissance de panneaux solaires la toiture porte-t-elle ?", ["60 kW", "90 kW", "120 kW", "240 kW"], "120 kW", "Page de garde et élévation sud, feuille A-201", cat="elec"),
            qcm("Quelle est la hauteur du muret de béton ?", ["800 mm", "1 000 mm", "1 200 mm", "1 500 mm"], "1 200 mm", "Élévations, feuille A-201 (niveau « Muret »)", cat="arch"),
            qcm("Sur quelle feuille trouve-t-on l'élévation des silos-tours ?", ["A-100", "A-202", "A-301", "S-101"], "A-202", "Page de garde : liste des feuilles", cat="lecture"),
            qcm("Combien de rangées de logettes l'étable compte-t-elle ?", ["2", "3", "4", "6"], "4", "Page de garde et plan de l'étable, feuille A-101", cat="arch"),
            qcm("Quelle est la largeur des grandes portes aux bouts des couloirs d'alimentation ?", ["2 500 mm", "3 000 mm", "3 500 mm", "4 500 mm"], "3 500 mm", "Notes d'élévation, feuille A-201", cat="arch"),
            qcm("Combien d'abreuvoirs l'étable compte-t-elle ?", ["4", "6", "8", "10"], "6", "Plan de plomberie P-101 et feuille P-103", cat="plomb")]
    rng.shuffle(qcm_); Q += qcm_[:5]
    # vrai ou faux
    Q += [vf("Le toit de l'étable est à deux versants.", True, "Élévations, feuille A-201", "", cat="arch"),
          vf("Les silos-tours mesurent 12 m de haut.", False, "Élévation des silos-tours, feuille A-202", "Ils mesurent 24 m de haut.", cat="arch"),
          vf("Le tracteur doit contourner l'étable pour alimenter les deux couloirs.", False, "Notes d'élévation, feuille A-201", "Les couloirs sont traversants : le tracteur passe d'un bout à l'autre.", cat="arch"),
          vf("L'étable compte 6 abreuvoirs à niveau constant.", True, "Plan de plomberie, feuille P-101", "", cat="plomb"),
          vf(f"Le lot de la ferme mesure 240 000 mm × 150 000 mm.", True, "Plan d'implantation, feuille A-100", "", cat="arch")]
    # texte à compléter
    Q += [trou("L'étable mesure ______ mm de long et ______ mm de large.", [fmt(W), fmt(D)], "Plan de l'étable, feuille A-101", cat="arch"),
          trou("Le toit est à deux versants avec une pente de ______ degrés.", ["10"], "Coupe transversale, feuille A-301", cat="arch")]
    # association
    Q += [assoc("Associe chaque feuille à son contenu.", [("A-100", "Plan d'implantation de la ferme"), ("A-201", "Élévations de l'étable"), ("A-202", "Élévation des silos-tours"), ("S-101", "Plan des fondations")], "Page de garde : liste des feuilles", rng, cat="lecture"),
          assoc("Associe chaque équipement à son rôle.", [("Robot de traite", "Trait les vaches automatiquement"), ("Racleur", "Nettoie les allées"), ("Repousse-fourrage", "Ramène le fourrage vers les vaches"), ("Ventilateur HVLS", "Brasse l'air lentement sur une grande surface")], "Légende et feuille E-101", rng, cat="elec")]
    # calculs
    Q += [calc(f"L'étable mesure {fmt(W)} mm sur {fmt(D)} mm. Calcule sa superficie en m².", [f"{W / 1000:.0f} m × {D / 1000:.0f} m = {S:.0f} m²".replace(".", ",")], f"{fmt(round(S))} m²", "Page de garde (« Étable ») et plan de l'étable, feuille A-101", cat="calc"),
          calc(f"L'étable abrite {N_LOG} vaches. Quelle superficie (en m²) revient à chaque vache ? (arrondis à 0,1)", [f"{S:.0f} m² ÷ {N_LOG} vaches = {S / N_LOG:.2f} m²".replace(".", ",")], f"{S / N_LOG:.1f} m²".replace(".", ","), "Superficie de l'étable ÷ nombre de logettes", cat="calc"),
          calc(f"Calcule le périmètre de l'étable (en mètres) : {fmt(W)} mm sur {fmt(D)} mm.", [f"2 × ({W / 1000:.0f} + {D / 1000:.0f}) = {per / 1000:.0f} m"], f"{per / 1000:.0f} m", "Plan de l'étable, feuille A-101", cat="calc"),
          calc(f"Sur un plan à l'échelle 1:250, quelle longueur (en mm) l'étable ({fmt(W)} mm) occupe-t-elle sur le papier ?", [f"{fmt(W)} ÷ 250 = {W / 250:.0f} mm"], f"{W / 250:.0f} mm", "Dimension réelle ÷ dénominateur de l'échelle", cat="calc")]
    # trouve l'erreur
    Q += [erreur("« L'étable compte 120 logettes réparties en 2 rangées. »", "Les logettes sont réparties en 4 rangées.", "Page de garde et plan de l'étable, feuille A-101", cat="arch"),
          erreur("« Les trois silos-tours de la ferme sont des silos-couloirs de 24 m de haut. »", "Ce sont des silos-tours (cylindres de 24 m); les silos-couloirs sont couchés au sol.", "Plan d'implantation, feuille A-100 et feuille A-202", cat="arch"),
          erreur("« Le toit a une pente de 30° et la faîtière est fermée. »", "La pente est de 10° et la faîtière est ouverte (ventilation naturelle).", "Page de garde et feuille A-301", cat="arch")]
    # classement
    Q += [ordre("Classe ces éléments du plus bas au plus haut.", ["Muret de béton (1 200 mm)", "Corniche (4 500 mm)", "Faîte de l'étable (7 056 mm)", "Silo-tour (24 000 mm)"], "du plus bas au plus haut", "Élévations (A-201) et élévation des silos (A-202)", rng, cat="arch"),
          ordre("Classe ces feuilles dans l'ordre de leur numéro (de la plus petite à la plus grande).", ["A-100", "A-201", "P-101", "E-101"], "ordre de la page de garde", "Page de garde : liste des feuilles", rng, cat="lecture")]
    # images tirées du PDF (sortes variées)
    if pdf:
        C = Ctx(); C.pdf, C.tmp, C.rng, C.n, C.b = pdf, tmp, rng, 5, None; C.nom = lambda x: x.replace("\n", " ")
        Q += [q for q in _choisir(images(C), 5, 4, C)]
    Q += _mesures(None, 5, True)
    return Q


def generer_ferme(nb_feuilles, chemin_ex, chemin_corr, pdf=None, site=None):
    Q = questions_ferme(nb_feuilles, pdf)
    T = _theme(5, site); T["nom"] = "Dossier 5 — Ferme laitière"; T["intro"] = _intro(5)
    for (chemin, corr) in ((chemin_ex, False), (chemin_corr, True)):
        qs.generer_pdf(chemin, "Ferme Laitière", "Dossier 5 · Lecture de plans et mesure à l'échelle", Q, corr, "", T, THEMES[5]["mode"])
    return Q
