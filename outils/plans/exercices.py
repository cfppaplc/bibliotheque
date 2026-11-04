# -*- coding: utf-8 -*-
"""Génère une feuille d'exercices et un corrigé pour un dossier, à partir de ses données (aucune réponse écrite à la main)."""
import math, re
from reportlab.pdfgen import canvas as rl_canvas
from reportlab.lib.colors import HexColor, black, white
from dessin import wrap, fmt, FONT, FONT_B, AUTEUR, LOGO, LOGO_R, MM
import calculs

PW, PH = 215.9, 279.4


def _lv(b):
    if hasattr(b, "lv"): return list(zip(("le sous-sol", "le rez-de-chaussée", "l'étage"), b.lv))
    return [("le rez-de-chaussée", b)]


def _virg(x, n=1): return f"{x:.{n}f}".replace(".", ",")


def questions(b, nb_feuilles):
    """Retourne la liste de questions typées (voir questionnaire.py) — toutes calculées sur les données du dossier."""
    import random
    from collections import Counter
    from batiment import APP
    import questionnaire as qs
    rng = random.Random(b.dossier["code"] + "q")
    lv = _lv(b)
    rdc = lv[1][1] if hasattr(b, "lv") else b
    plan_no = getattr(rdc, "no_plan", "A-101")
    Np = rdc.Nplan
    Q = []
    nom_p = lambda n: n.replace("\n", " ")
    loc = [(nv, x) for nv, l in lv for x in l.locaux]
    aire = lambda x: (x[4] - x[2]) * (x[5] - x[3]) / 1e6
    portes = [(l, o) for _, l in lv for o in l.portes if o.get("no")]
    larg_portes = sorted({o["w"] for _, o in portes})
    nwc = sum(1 for _, l in lv for (code, *_r) in getattr(l, "app", []) if code == "wc")
    B = b.calcul_bilan()
    tot = sum(aire(x) for _, x in loc)
    gl = max(loc, key=lambda t: aire(t[1])); pl = min(loc, key=lambda t: aire(t[1]))
    OU_PLAN = f"Plan du rez-de-chaussée ({plan_no})"

    # ---------------- A. réponse courte
    Q.append(qs.rep("Quelle est l'échelle du plan du rez-de-chaussée ?", f"1:{Np}", f"Cartouche de la feuille {plan_no}, case « Échelle »"))
    Q.append(qs.rep("Combien de feuilles contient ce dossier de plans ?", str(nb_feuilles), "Page de garde : liste des feuilles"))
    Q.append(qs.rep("Quelle est la largeur hors tout du bâtiment, en millimètres ?", f"{fmt(b.W)} mm", "Cote extérieure, " + OU_PLAN))
    gros = max(portes, key=lambda t: t[1]["w"])
    Q.append(qs.rep("Quelle est la porte la plus large du bâtiment ? Donne son numéro et sa largeur.", f"Porte {gros[1]['no']}, {fmt(gros[1]['w'])} mm", "Tableau des portes, feuille A-301"))
    Q.append(qs.rep("Quel est le plus grand local du bâtiment, et quelle est sa superficie ?", f"{nom_p(gl[1][1])} ({gl[1][0]}), {_virg(aire(gl[1]))} m²", "Plans d'architecture / tableau des locaux, feuille A-401"))
    Q.append(qs.rep("Quelle est la superficie totale des locaux du bâtiment ?", f"{_virg(tot)} m²", "Tableau des locaux et des finis, feuille A-401 (total sous le tableau)"))

    # ---------------- B. choix multiple
    ops, bon = qs.options_numeriques(b.D, rng, 500, fmt=fmt, unite=" mm")
    Q.append(qs.qcm("Quelle est la profondeur hors tout du bâtiment ?", ops, bon, "Cote extérieure, " + OU_PLAN))
    Q.append(qs.qcm("Sur quelle feuille trouve-t-on le tableau des locaux et des finis ?", ["A-401", "A-501", "S-101", "E-201"], "A-401", "Page de garde : liste des feuilles"))
    Q.append(qs.qcm("Quelle feuille contient le bilan de charge électrique ?", ["P-201", "E-201", "M-001", "A-002"], "E-201", "Page de garde : liste des feuilles"))
    Q.append(qs.qcm("Dans les élévations, que représente un hexagone contenant une lettre ?",
                    ["Le type de fenêtre", "Le numéro d'une porte", "Une prise électrique", "Un point de vue de coupe"], "Le type de fenêtre", "Légende et abréviations, feuille A-001"))
    cnt = Counter(o["type"] for _, l in lv for o in l.fenetres)
    if len(cnt) >= 3:
        types = [t for t, _ in cnt.most_common()][:4]
        Q.append(qs.qcm("Quel type de fenêtre est le plus fréquent dans le bâtiment ?", [f"Type {t}" for t in sorted(types)], f"Type {types[0]}", "Tableau des fenêtres, feuille A-301 (colonne « Qté »)"))
    autres = [x for _, x in loc if x is not pl[1] and abs(aire(x) - aire(pl[1])) > 1.0]; rng.shuffle(autres)
    opts = [f"{nom_p(x[1])} ({x[0]})" for x in autres[:3]] + [f"{nom_p(pl[1][1])} ({pl[1][0]})"]; rng.shuffle(opts)
    Q.append(qs.qcm("Lequel de ces locaux est le plus petit de tout le bâtiment ?", opts, f"{nom_p(pl[1][1])} ({pl[1][0]})", "Tableau des locaux et des finis, feuille A-401"))
    std = [100, 125, 150, 200, 225, 300, 400, 600]
    base = B["service"]; autres_a = [v for v in std if v != base]; rng.shuffle(autres_a)
    ops = sorted([base] + autres_a[:3]); Q.append(qs.qcm("Quelle grosseur d'entrée de service électrique le bilan de charge retient-il ?", [f"{v} A" for v in ops], f"{base} A", "Bilan de charge, feuille E-201"))

    # ---------------- C. vrai ou faux
    v1 = rng.random() < .5; n_aff = nwc if v1 else nwc + rng.choice([-1, 1, 2]) if nwc > 1 else nwc + 1
    Q.append(qs.vf(f"Le bâtiment compte {n_aff} toilette(s).", v1, "Plans de plomberie (symboles de toilette) ou tableau des appareils", f"Il y a {nwc} toilette(s)."))
    p0 = portes[len(portes) // 2][1]; v2 = rng.random() < .5; w_aff = p0["w"] if v2 else p0["w"] + rng.choice([-100, 100])
    Q.append(qs.vf(f"La porte {p0['no']} mesure {fmt(w_aff)} mm de large.", v2, "Tableau des portes, feuille A-301", f"Elle mesure {fmt(p0['w'])} mm."))
    ech = [50, 75, 100, 125, 200]; v3 = rng.random() < .5; e_aff = Np if v3 else rng.choice([e for e in ech if e != Np])
    Q.append(qs.vf(f"Le plan du rez-de-chaussée est dessiné à l'échelle 1:{e_aff}.", v3, f"Cartouche de la feuille {plan_no}", f"L'échelle est 1:{Np}."))
    v4 = rng.random() < .5; seuil = int(b.W // 1000 * 1000) + (-2000 if v4 else 2000)
    Q.append(qs.vf(f"La largeur hors tout du bâtiment est {'supérieure' if v4 else 'inférieure'} à {fmt(seuil)} mm.", v4, "Cote extérieure, " + OU_PLAN, f"Elle est de {fmt(b.W)} mm : l'énoncé est faux."))
    ce = next(((l, (x, y)) for _, l in lv for (code, x, y, _r) in getattr(l, "app", []) if code == "ce"), None)
    if ce:
        loc_ce = next((nom_p(r[1]) for r in ce[0].locaux if r[2] <= ce[1][0] <= r[4] and r[3] <= ce[1][1] <= r[5]), None)
        if loc_ce:
            v5 = rng.random() < .5; aut = [nom_p(r[1]) for _, r in loc if nom_p(r[1]) != loc_ce]; rng.shuffle(aut)
            Q.append(qs.vf(f"Le chauffe-eau (symbole C-E) est installé dans le local « {loc_ce if v5 else aut[0]} ».", v5, "Plan de plomberie (symbole C-E)", f"Il est dans « {loc_ce} »."))
    v6 = rng.random() < .5
    Q.append(qs.vf(f"Le bilan de charge retient une entrée de service de {base if v6 else base * 2} A.", v6, "Bilan de charge, feuille E-201", f"Il retient {base} A."))

    # ---------------- D. texte à compléter
    Q.append(qs.trou("Sur les plans de plomberie, le trait ______ représente l'eau froide (EF) et le trait ______ l'eau chaude (EC).", ["bleu", "rouge"], "Légende du plan de plomberie"))
    Q.append(qs.trou(f"Ce bâtiment compte ______ niveau(x) et la superficie totale de ses locaux est de ______ m².", [str(len(lv)), _virg(tot)], "Plans d'architecture et feuille A-401"))
    Q.append(qs.trou("Dans le tableau de dimensionnement de la plomberie, l'abréviation UT veut dire « unité d'______ ».", ["évacuation"], "Feuille P-201 (en-tête du tableau)"))

    # ---------------- E. association
    Q.append(qs.assoc("Associe chaque feuille à son contenu.", [("A-201", "Élévations (vues extérieures)"), ("A-401", "Tableau des locaux et des finis"), ("P-201", "Dimensionnement de la plomberie"), ("E-201", "Bilan de charge et panneau")], "Page de garde : liste des feuilles", rng))
    Q.append(qs.assoc("Associe chaque abréviation à sa signification.", [("EF", "Eau froide"), ("EC", "Eau chaude"), ("VRC", "Ventilateur récupérateur de chaleur"), ("AFCI", "Disjoncteur anti-arcs")], "Légende et abréviations, feuille A-001", rng))

    # ---------------- F. calculs
    c3 = rng.choice([x for _, x in loc if 6 <= aire(x) <= 60])
    larg, prof = c3[4] - c3[2], c3[5] - c3[3]
    Q.append(qs.calc(f"Le local {c3[0]} « {nom_p(c3[1])} » mesure {fmt(larg)} mm sur {fmt(prof)} mm (entre les faces intérieures). Calcule sa superficie en m².",
                     [f"{fmt(larg)} mm = {_virg(larg / 1000, 2)} m;   {fmt(prof)} mm = {_virg(prof / 1000, 2)} m", f"{_virg(larg / 1000, 2)} × {_virg(prof / 1000, 2)} = {_virg(larg * prof / 1e6, 2)} m²"],
                     f"{_virg(larg * prof / 1e6, 1)} m²", "Dimensions des locaux, " + OU_PLAN + " et feuille A-401"))
    hc = getattr(rdc, "hc", None)
    if hc:
        Q.append(qs.calc(f"Calcule le volume d'air du local {c3[0]} « {nom_p(c3[1])} » (en m³), sachant que la hauteur libre sous plafond est de {fmt(hc)} mm.",
                         [f"Superficie = {_virg(larg * prof / 1e6, 2)} m²;   hauteur = {_virg(hc / 1000, 2)} m", f"{_virg(larg * prof / 1e6, 2)} × {_virg(hc / 1000, 2)} = {_virg(larg * prof * hc / 1e9, 1)} m³"],
                         f"{_virg(larg * prof * hc / 1e9, 1)} m³", "Superficie (A-401) × hauteur libre (notes générales)"))
    codes = [c_ for c_ in ("bain", "wc", "lav", "evd", "dou") if any(c_ == cc for _, l in lv for (cc, *_r) in getattr(l, "app", []))][:3]
    if len(codes) >= 3:
        nomc = {k: APP[k][0].split(" (")[0].lower() for k in codes}
        tt = sum(APP[k][8] for k in codes)
        Q.append(qs.calc(f"Additionne les unités d'évacuation (UT) d'une {nomc[codes[0]]}, d'une {nomc[codes[1]]} et d'un(e) {nomc[codes[2]]}.",
                         [" + ".join(f"{APP[k][8]:g}" for k in codes).replace(".", ",") + f" = {tt:g}".replace(".", ",") + " UT"], f"{tt:g} UT".replace(".", ","), "Tableau de dimensionnement de la plomberie, feuille P-201"))
    per = 2 * (b.W + b.D)
    Q.append(qs.calc(f"Calcule le périmètre extérieur du bâtiment (en mètres), à partir de sa largeur et de sa profondeur hors tout.",
                     [f"2 × ({fmt(b.W)} + {fmt(b.D)}) mm = {fmt(per)} mm", f"{fmt(per)} mm ÷ 1 000 = {_virg(per / 1000, 1)} m"], f"{_virg(per / 1000, 1)} m", "Cotes extérieures, " + OU_PLAN))

    # ---------------- G. trouve l'erreur
    Q.append(qs.erreur("« Sur les plans de plomberie, les conduites d'eau chaude sont en bleu et celles d'eau froide sont en rouge. »",
                       "Les couleurs sont inversées : l'eau froide (EF) est bleue et l'eau chaude (EC) est rouge.", "Légende du plan de plomberie"))
    Q.append(qs.erreur(f"« Le plan du rez-de-chaussée est à l'échelle 1:{Np} : 1 mm sur le papier représente {Np // 10} mm dans la réalité. »",
                       f"1 mm sur le papier représente {Np} mm réels (et non {Np // 10}).", f"Cartouche de la feuille {plan_no}"))
    Q.append(qs.erreur(f"« La largeur hors tout est de {fmt(b.W + 500)} mm et la profondeur hors tout est de {fmt(b.D)} mm. »",
                       f"La largeur hors tout est de {fmt(b.W)} mm (et non {fmt(b.W + 500)} mm).", "Cotes extérieures, " + OU_PLAN))
    Q.append(qs.erreur(f"« Ce dossier compte {nb_feuilles} feuilles; le bilan de charge électrique se trouve sur la feuille A-401. »",
                       "Le bilan de charge est sur la feuille E-201 (A-401 = tableau des locaux et des finis).", "Page de garde : liste des feuilles"))

    # ---------------- H. classement
    cand = sorted({round(aire(x), 1): x for _, x in loc}.items())
    if len(cand) >= 4:
        pas = max(1, len(cand) // 4); ch = [cand[i * pas][1] for i in range(4)]; ch = ch[:4]
        Q.append(qs.ordre("Classe ces locaux du plus petit au plus grand.", [f"{nom_p(x[1])} ({x[0]})" for x in ch], "du plus petit au plus grand", "Tableau des locaux et des finis, feuille A-401", rng))
    if len(larg_portes) >= 3:
        ps = []
        for w in larg_portes[:4]:
            o = next(o for _, o in portes if o["w"] == w); ps.append(o)
        Q.append(qs.ordre("Classe ces portes de la plus étroite à la plus large.", [f"Porte {o['no']}" for o in ps], "de la plus étroite à la plus large", "Tableau des portes, feuille A-301", rng))

    import exercices6
    det = [(f_, q, r) for (f_, q, r) in exercices6.QUESTIONS if f_ in getattr(b, "details_meca", [])]
    rng.shuffle(det)
    for (f_, q, r) in det[:6]: Q.append(qs.rep(q, r, f"Feuille {f_} (détail)"))
    return Q


def generer(b, nb_feuilles, chemin_ex, chemin_corr):
    import questionnaire as qs
    Q = questions(b, nb_feuilles)
    nom = b.dossier["projet"].replace("\n", " — ")
    titre = b.dossier["projet"].split("\n")[0].title()
    sous = b.dossier["projet"].split("\n")[1] + " — Lecture de plans"
    cons = "Consigne : ouvre le dossier de plans et réponds aux questions. Les parties ont des types de questions différents : lis bien la consigne de chaque partie."
    qs.generer_pdf(chemin_ex, titre, sous, Q, False, cons)
    qs.generer_pdf(chemin_corr, titre, sous, Q, True, cons)
    return Q
