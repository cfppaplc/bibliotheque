# -*- coding: utf-8 -*-
"""Exercices de mesure à l'échelle (échelimètre métrique) : questions calculées sur les vraies dimensions de chaque dossier.
Chaque question : feuille, échelle, texte, dimension réelle (mm). Le corrigé donne aussi la mesure attendue sur le papier."""
import random, re
from reportlab.pdfgen import canvas as rl_canvas
from reportlab.lib.colors import HexColor, black
from dessin import wrap, fmt, FONT, FONT_B, AUTEUR, LOGO, LOGO_R, MM

PW, PH = 215.9, 279.4
VERT, GRIS = HexColor("#1a7f37"), HexColor("#666666")
NOMS_ECH = {20: "1:20", 25: "1:25", 50: "1:50", 75: "1:75", 100: "1:100", 125: "1:125", 200: "1:200", 250: "1:250", 500: "1:500", 1000: "1:1000", 10: "1:10"}


def Q(f, N, texte, reel, section):
    return dict(f=f, N=N, texte=texte, reel=int(round(reel)), section=section)


def parse(val):
    d = re.sub(r"[^0-9]", "", val); return int(d) if d else None


DETAIL_Q = {   # code : [(feuille, N, texte, réel mm)]
    "M-301": [("M-301", 10, "le diamètre du réservoir tampon (cylindre couché)", 700), ("M-301", 10, "la distance entre le plancher et le fond du réservoir", 450), ("M-301", 10, "la longueur du réservoir, d'un bout à l'autre", 1650)],
    "M-302": [("M-302", 10, "la largeur du cabinet de la chaudière", 400), ("M-302", 10, "la hauteur du cabinet de la chaudière", 700), ("M-302", 10, "la hauteur entre le plancher et le bas de la chaudière", 700)],
    "M-303": [("M-303", 10, "la distance entre les axes des deux barillets (alimentation et retour)", 400), ("M-303", 10, "l'écart entre deux boucles voisines (d'axe à axe)", 120)],
    "P-301": [("P-301", 10, "le diamètre du chauffe-eau", 480), ("P-301", 10, "la hauteur du plancher au dessus du chauffe-eau (dôme compris)", 1230), ("P-301", 10, "la longueur du bac de récupération", 720)],
    "P-302": [("P-302", 20, "l'épaisseur du mur de fondation", 250), ("P-302", 20, "la profondeur de la ligne de gel sous le niveau du sol", 1800), ("P-302", 20, "la hauteur de la tuyauterie intérieure (axe) au-dessus de la dalle", 1100)],
    "P-303": [("P-303", 20, "la hauteur du bord du lavabo au-dessus du plancher", 850), ("P-303", 20, "la hauteur libre entre le plancher et le plafond", 2440), ("P-303", 20, "la longueur de la baignoire", 1500)],
    "P-304": [("P-304", 10, "le diamètre extérieur de la fosse du puisard", 600), ("P-304", 10, "la profondeur de la fosse sous le dessus de la dalle", 930), ("P-304", 10, "l'épaisseur de la dalle de béton", 100)],
    "P-305": [("P-305", 10, "la largeur de la sécheuse", 750), ("P-305", 10, "la hauteur de la sécheuse", 1000), ("P-305", 10, "la hauteur de la conduite de gaz horizontale haute au-dessus du plancher", 1450)],
}


def questions_batiment(b, code):
    rng = random.Random(code)
    Qs = []
    lv = list(getattr(b, "lv", []) or [])
    rdc = lv[1] if lv else b
    Np = getattr(rdc, "Nplan", getattr(b, "Nplan", 100))
    no_plan = getattr(rdc, "no_plan", "A-101")
    # ---- 1. plan du rez-de-chaussée
    sec = "Plan du rez-de-chaussée"
    pieces = [(no, nom.replace("\n", " "), x0, y0, x1, y1) for (no, nom, x0, y0, x1, y1) in rdc.locaux if (x1 - x0) / Np >= 10 and (y1 - y0) / Np >= 10]
    rng.shuffle(pieces)
    types = ["larg", "prof", "deux", "larg", "prof"]
    for (no, nom, x0, y0, x1, y1), t in zip(pieces[:5], types):
        if t == "larg": Qs.append(Q(no_plan, Np, f"la largeur (de gauche à droite) du local {no} « {nom} », entre les faces intérieures des murs", x1 - x0, sec))
        elif t == "prof": Qs.append(Q(no_plan, Np, f"la profondeur (de haut en bas) du local {no} « {nom} », entre les faces intérieures des murs", y1 - y0, sec))
        else:
            Qs.append(Q(no_plan, Np, f"la largeur du local {no} « {nom} »", x1 - x0, sec)); Qs.append(Q(no_plan, Np, f"la profondeur du local {no} « {nom} »", y1 - y0, sec))
    portes = [p for p in rdc.portes if p.get("no") and p["w"] / Np >= 8]
    vus = set(); choix = []
    for p in portes:
        if p["w"] not in vus: vus.add(p["w"]); choix.append(p)
    rng.shuffle(choix)
    for p in choix[:2]: Qs.append(Q(no_plan, Np, f"la largeur de l'ouverture de la porte {p['no']}", p["w"], sec))
    Qs.append(Q(no_plan, Np, "la longueur hors tout du bâtiment (face extérieure à face extérieure, dans le sens horizontal)", b.W, sec))
    Qs.append(Q(no_plan, Np, "la profondeur hors tout du bâtiment (dans le sens vertical)", b.D, sec))
    # ---- 2. élévations
    Ne = getattr(b, "Nelev", 100)
    sec = "Élévations (A-201)"
    nivs = [(n, parse(v)) for (n, v, z) in b.niveaux if parse(v) is not None and "–" not in v]
    nivs = [(n, h) for (n, h) in nivs if h / Ne >= 10]
    haut = max(nivs, key=lambda t: t[1])
    Qs.append(Q("A-201", Ne, f"la hauteur entre « Sol ± 0 » et le niveau « {haut[0]} » sur l'élévation sud", haut[1], sec))
    autres = [t for t in nivs if t != haut and t[0] not in ("Sol", "Dalle")]
    rng.shuffle(autres)
    for (n, h) in autres[:1]: Qs.append(Q("A-201", Ne, f"la hauteur entre « Sol ± 0 » et le niveau « {n} » sur l'élévation sud", h, sec))
    # ---- 3. coupe
    sec = "Coupe transversale (A-301)"
    Nc = getattr(b, "Ncoupe", 50)
    if lv:
        Qs.append(Q("A-301", Nc, "la hauteur d'étage : du plancher du rez-de-chaussée (« RDC + 600 ») au plancher de l'étage (« Étage + 3 640 »)", 3640 - 600, sec))
        Qs.append(Q("A-301", Nc, "la profondeur du sous-sol : du plancher du sous-sol (« – 2 100 ») au plancher du rez-de-chaussée (« + 600 »)", 600 + 2100, sec))
    else:
        Qs.append(Q("A-301", Nc, "la hauteur libre sous plafond, du dessus de la dalle au plafond fini", b.z_plafond - b.z_plancher, sec))
        Qs.append(Q("A-301", Nc, "la largeur hors tout du bâtiment sur la coupe A (face extérieure à face extérieure)", b.D, sec))
    # ---- 4. implantation
    s = b.site; Ns = s["N"]; LW, LD = s["lot"]; bx, by = s["pos"]
    sec = "Plan d'implantation (A-100)"
    marges = [("la marge avant (de la ligne de lot du côté de la rue à la façade)", by), ("la marge latérale gauche (de la ligne de lot gauche au bâtiment)", bx), ("la marge latérale droite (du bâtiment à la ligne de lot droite)", LW - bx - b.W),
              ("la marge arrière (du bâtiment à la ligne de lot du fond)", LD - by - b.D)]
    marges = [m for m in marges if m[1] / Ns >= 10]
    rng.shuffle(marges)
    for (t, v) in marges[:3]: Qs.append(Q("A-100", Ns, t, v, sec))
    Qs.append(Q("A-100", Ns, "la largeur du lot (de la ligne de lot gauche à la ligne de lot droite)", LW, sec))
    # ---- 5. détails mécaniques
    sec = "Gros plans de plomberie et de chauffage"
    for k in getattr(b, "details_meca", []):
        lst = list(DETAIL_Q.get(k, [])); rng.shuffle(lst)
        for (f_, N, t, r) in lst[:2]: Qs.append(Q(f_, N, "mesure " + t, r, sec))
    # ---- 6. unités de toit
    if getattr(b, "unites_toit", None):
        import unites_toit as _u
        sec = "Unités de toit (M-102)"
        rep, t, *_x = [u for u in b.unites_toit if u[1] == 10][0] if any(u[1] == 10 for u in b.unites_toit) else b.unites_toit[0]
        sp = _u.spec(t)
        Qs.append(Q("M-102", 25, f"la longueur du caisson de l'unité de {t} tonnes (élévation)", sp["L"], sec))
        Qs.append(Q("M-102", 25, "la hauteur du socle (curb) sous l'unité", _u.SOCLE, sec))
        Qs.append(Q("M-102", 25, f"la largeur de l'unité de {t} tonnes (plan)", sp["l"], sec))
    # ---- 7. conversions (sans mesurer)
    sec = "Conversions d'échelle (sans règle)"
    p = pieces[0] if pieces else ("", "", 0, 0, 4800, 3600)
    lon = p[4] - p[2]
    lon = max(Np * 10, int(round(lon / (Np * 5.0))) * Np * 5)
    Qs.append(dict(f=no_plan, N=Np, texte=f"Un mur réel mesure {fmt(lon)} mm. Quelle longueur aura-t-il sur un plan à l'échelle 1:{Np}?", reel=lon // Np * 10, section=sec, conv="papier"))
    papier = 64 if Np in (50, 100, 200) else 84
    Qs.append(dict(f=no_plan, N=Np, texte=f"Sur un plan à l'échelle 1:{Np}, une pièce mesure {papier} mm. Quelle est sa dimension réelle (en mm)?", reel=papier * Np, section=sec, conv="reel"))
    return Qs


def questions_ferme():
    import ferme as F
    Q_ = []
    sec = "Plan d'implantation (A-100)"
    Q_ += [Q("A-100", 1000, "la largeur du lot (de gauche à droite)", 240000, sec), Q("A-100", 1000, "la longueur de l'étable (hors tout, dans le sens horizontal)", F.W, sec)]
    sec = "Plan de l'étable (A-101)"
    Q_ += [Q("A-101", 250, "la longueur hors tout de l'étable", F.W, sec), Q("A-101", 250, "la largeur hors tout de l'étable (dans le sens vertical)", F.D, sec),
           Q("A-101", 250, "la largeur de l'allée centrale (entre les deux rangées de logettes du centre)", F.AL_C[1] - F.AL_C[0], sec),
           Q("A-101", 250, "la largeur d'un couloir d'alimentation (côté sud)", F.TA_S[1] - F.TA_S[0], sec), Q("A-101", 250, "la longueur du bloc de service (côté ouest)", F.XS, sec),
           Q("A-101", 250, "la longueur occupée par dix logettes côte à côte (une logette = 1 250 mm)", 10 * F.LOG_W, sec)]
    sec = "Élévations (A-201)"
    Q_ += [Q("A-201", 250, "la hauteur du sol au faîte du toit", F.ZF, sec), Q("A-201", 250, "la hauteur du sol à la corniche (bas du toit)", F.ZC, sec)]
    sec = "Coupe transversale (A-301)"
    Q_ += [Q("A-301", 100, "la largeur de l'étable sur la coupe, face extérieure à face extérieure", F.D, sec), Q("A-301", 100, "la hauteur du sol à la corniche", F.ZC, sec),
           Q("A-301", 100, "la hauteur du sol au faîte", F.ZF, sec), Q("A-301", 100, "la hauteur d'un muret de béton", 1200, sec)]
    sec = "Gros plans des abreuvoirs (P-102)"
    Q_ += [Q("P-102", 20, "mesure la longueur du bac de l'abreuvoir (coupe longitudinale)", 2200, sec), Q("P-102", 20, "mesure la hauteur du bord du bac au-dessus du plancher", 800, sec),
           Q("P-102", 20, "mesure la profondeur de l'eau dans le bac (du fond intérieur au niveau d'eau)", 380, sec)]
    sec = "Conversions d'échelle (sans règle)"
    Q_ += [dict(f="A-101", N=250, texte="Une rangée de logettes mesure 50 000 mm. Quelle longueur aura-t-elle sur un plan à l'échelle 1:250?", reel=200, section=sec, conv="papier", unite="mm"),
           dict(f="A-301", N=100, texte="Sur la coupe à l'échelle 1:100, la hauteur du sol au faîte mesure 70,6 mm. Quelle est la hauteur réelle (en mm)?", reel=7060, section=sec, conv="reel")]
    return Q_


def entete(c, titre, sous):
    c.setFillColor(black); c.setFont(FONT_B, 17); c.drawString(20 * MM, (PH - 24) * MM, titre)
    c.setFont(FONT, 10.5); c.drawString(20 * MM, (PH - 31) * MM, sous)
    c.drawImage(LOGO, (PW - 20 - 16 * LOGO_R) * MM, (PH - 30) * MM, 16 * LOGO_R * MM, 16 * MM)
    c.setLineWidth(.8); c.line(20 * MM, (PH - 35) * MM, (PW - 20) * MM, (PH - 35) * MM)


def typer(Qs, seed):
    """Transforme les questions de mesure en questions typées et ajoute des questions de compréhension de l'échelle (types variés)."""
    import questionnaire as qs
    rng = random.Random(seed)
    T = []
    for q in Qs:
        if "conv" in q: T.append(qs.mesure(q["texte"], q["reel"], q["N"], "papier" if q["conv"] == "papier" else "reel"))
        else:
            sec = re.sub(r"\s*\([A-Z]-\d{3}\)", "", q["section"])
            txt = f"{sec} — " + (f"Mesure {q['texte']}." if not q["texte"].startswith("mesure") else q["texte"][0].upper() + q["texte"][1:] + ".")
            txt = re.sub(r"\s*\(?\b[A-Z]-\d{3}\b\)?", "", txt)      # jamais le numéro de feuille : l'élève la trouve et lit l'échelle au cartouche
            T.append(qs.mesure(txt, q["reel"], q["N"], ou=f"Feuille {q['f']}, échelle {NOMS_ECH.get(q['N'], '1:' + str(q['N']))}", sans_tag=True))
    ech = [20, 25, 50, 75, 100, 125, 200, 250, 500]
    ou = "Cartouche de la feuille (case « Échelle ») et échelimètre"
    # choix multiple
    N1 = rng.choice([50, 100, 200]); mm = rng.choice([30, 40, 60, 80])
    ops = sorted({mm * N1 // 1000 * 1000 // 1 or mm * N1, mm * N1, mm * N1 * 2, mm * N1 // 2, mm * N1 + 500}); ops = ops[:4]
    if mm * N1 not in ops: ops[0] = mm * N1
    ops = sorted(set(ops)); rng.shuffle(ops)
    T.append(qs.qcm(f"Un mur mesure {mm} mm sur un plan à l'échelle 1:{N1}. Quelle est sa longueur réelle ?", [f"{o:,} mm".replace(",", " ") for o in ops], f"{mm * N1:,} mm".replace(",", " "), "Longueur papier × dénominateur de l'échelle"))
    T.append(qs.qcm("Laquelle de ces échelles donne le plus GRAND dessin d'un même objet ?", ["1:500", "1:200", "1:50", "1:100"], "1:50", "Plus le dénominateur est petit, plus le dessin est grand"))
    T.append(qs.qcm("À l'échelle 1:100, que représente 1 mm mesuré sur le papier ?", ["1 mm", "10 mm", "100 mm", "1 000 mm"], "100 mm", "Définition de l'échelle"))
    # vrai ou faux
    for k in range(3):
        N2 = rng.choice([50, 100, 125, 200]); papier = rng.choice([12, 20, 24, 40]); vrai = rng.random() < .5
        reel = papier * N2; aff = reel if vrai else reel + rng.choice([-1, 1]) * N2 * rng.choice([2, 5])
        T.append(qs.vf(f"Sur un plan à l'échelle 1:{N2}, une ligne de {papier} mm représente {aff:,} mm dans la réalité.".replace(",", " "), vrai, ou, f"Elle représente {reel:,} mm ({papier} × {N2}).".replace(",", " ")))
    T.append(qs.vf("L'échelimètre métrique sert à lire directement les dimensions réelles sans faire de calcul.", True, "Mode d'emploi de l'échelimètre"))
    T.append(qs.vf("Si on imprime un plan en « Ajuster à la page », l'échelle écrite dans le cartouche reste exacte.", False, "Consigne d'impression", "L'impression doit se faire à 100 % : sinon l'échelle n'est plus exacte."))
    # texte à compléter
    T.append(qs.trou("Une échelle 1:50 veut dire que 1 mm sur le papier représente ______ mm dans la réalité; 1 m réel mesure donc ______ mm sur le papier.", ["50", "20"], "Définition de l'échelle"))
    T.append(qs.trou("Le trait de contrôle en bas de chaque feuille doit mesurer exactement ______ mm à la règle.", ["100"], "Bas de chaque feuille"))
    # association
    T.append(qs.assoc("Associe chaque échelle à ce que 10 mm sur le papier représentent dans la réalité.", [("1:20", "200 mm"), ("1:50", "500 mm"), ("1:100", "1 000 mm"), ("1:200", "2 000 mm")], "Papier × dénominateur", rng))
    # calculs
    for k in range(3):
        N3 = rng.choice([50, 75, 100, 125, 200]); reel = rng.choice([2400, 3600, 4800, 7500, 9000, 12000]); papier = reel / N3
        if k == 0: T.append(qs.calc(f"Une pièce mesure {reel:,} mm de long. Quelle longueur aura-t-elle sur un plan à l'échelle 1:{N3} ?".replace(",", " "), [f"{reel} ÷ {N3} = {papier:.1f} mm".replace(".", ",")], f"{papier:.1f} mm".replace(".", ","), "Dimension réelle ÷ dénominateur"))
        elif k == 1: T.append(qs.calc(f"Sur un plan à l'échelle 1:{N3}, un mur mesure {papier:.1f} mm. Calcule sa longueur réelle en mètres.".replace(".", ","), [f"{papier:.1f} × {N3} = {reel} mm".replace(".", ","), f"{reel} mm ÷ 1 000 = {reel / 1000:.1f} m".replace(".", ",")], f"{reel / 1000:.1f} m".replace(".", ","), "Longueur papier × dénominateur"))
        else:
            N4 = rng.choice([x for x in (50, 100, 200) if x != N3]); p2 = reel / N4
            T.append(qs.calc(f"Un même mur de {reel:,} mm est dessiné sur deux plans : à 1:{N3} et à 1:{N4}. Quelle est la différence de longueur (en mm) entre les deux dessins ?".replace(",", " "), [f"1:{N3} → {papier:.1f} mm;   1:{N4} → {p2:.1f} mm".replace(".", ","), f"{abs(papier - p2):.1f} mm".replace(".", ",")], f"{abs(papier - p2):.1f} mm".replace(".", ","), "Dimension réelle ÷ dénominateur, pour chaque plan"))
    # trouve l'erreur
    T.append(qs.erreur("« Sur un plan 1:200, un mur de 25 mm sur le papier mesure 2 500 mm dans la réalité. »", "25 × 200 = 5 000 mm (et non 2 500 mm).", "Papier × dénominateur"))
    T.append(qs.erreur("« Le plan A est à 1:50 et le plan B à 1:100 : la même pièce paraît donc plus petite sur le plan A. »", "C'est l'inverse : à 1:50, le dessin est plus grand qu'à 1:100.", "Plus le dénominateur est petit, plus le dessin est grand"))
    # classement
    sel = rng.sample([20, 50, 100, 200, 500], 4); sel.sort()
    T.append(qs.ordre("Classe ces échelles de celle qui donne le plus GRAND dessin à celle qui donne le plus petit.", [f"1:{x}" for x in sel], "du plus grand dessin au plus petit", "Plus le dénominateur est petit, plus le dessin est grand", rng))
    return T


def pdf(chemin, Qs, nom_dossier, corrige, seed="x", n=1, site=None):
    import questionnaire as qs, exercices
    T = exercices._theme(n, site); T.update(kicker="Mesure à l'échelle · Échelimètre", nom=f"Dossier {n} — Mesures à l'échelle", indices="aucun", prefixe="Partie ", lettres=True,
                                          intro=["Imprime le dossier à 100 % (papier 11 × 17 po, jamais « Ajuster ») et vérifie le trait de contrôle de 100 mm en bas de chaque feuille.",
                                                 "Utilise la bonne face de ton échelimètre métrique. Tolérance : ± 1 mm sur le papier."])
    T2 = typer(Qs, seed)
    qs.generer_pdf(chemin, "Mesures à l'échelle", nom_dossier, T2, corrige, "", T, "type")


def generer(site, n, b, nom_dossier):
    import os
    Qs = questions_ferme() if b is None else questions_batiment(b, f"D{n}")
    pdf(os.path.join(site, "plans", f"dossier-{n}-echelle.pdf"), Qs, nom_dossier, False, f"D{n}", n, site)
    pdf(os.path.join(site, "plans", f"dossier-{n}-echelle-corrige.pdf"), Qs, nom_dossier, True, f"D{n}", n, site)
    return Qs
