# -*- coding: utf-8 -*-
"""Questionnaires à types variés (réponse courte, choix multiple, vrai ou faux, texte à compléter, association,
calcul, trouve l'erreur, classement, mesure) : constructeurs + mise en page PDF soignée (feuille d'élève et corrigé).
La construction du document change d'un dossier à l'autre (mode : par type, par discipline, par niveau, par défis)."""
import re
from reportlab.pdfgen import canvas as rl_canvas
from reportlab.lib.colors import HexColor, black, white
from reportlab.lib.utils import ImageReader
from dessin import wrap, FONT, FONT_B, LOGO, LOGO_R, MM

PW, PH = 215.9, 279.4
VERT, GRIS, ROUGE = HexColor("#1a7f37"), HexColor("#666666"), HexColor("#b00020")
GRIS_L, GRIS_T = HexColor("#d9dde2"), HexColor("#f3f5f7")
LETTRES = "ABCDEFGH"
MX = 18          # marge gauche/droite (mm)

PTS = dict(rep=2, qcm=1, vf=1, trou=2, assoc=4, calc=3, erreur=3, ordre=2, mesure=2)
NIV = dict(rep=1, qcm=1, vf=1, trou=2, assoc=2, ordre=2, mesure=2, calc=3, erreur=3)

PARTIES = {   # mode « type »
    "mesure": ("Mesures avec l'échelimètre", "Mesure sur le papier avec ton échelimètre, puis écris la dimension réelle en millimètres."),
    "rep": ("Réponse courte", "Écris la réponse avec son unité."),
    "qcm": ("Choix multiple", "Coche une seule réponse."),
    "vf": ("Vrai ou faux", "Coche Vrai ou Faux. Si c'est faux, corrige l'énoncé."),
    "trou": ("Texte à compléter", "Écris le mot ou le nombre qui manque."),
    "assoc": ("Association", "Écris la lettre qui correspond à chaque numéro."),
    "calc": ("Calculs", "Montre ton calcul, puis écris la réponse avec l'unité."),
    "erreur": ("Trouve l'erreur", "Chaque énoncé contient une erreur : trouve-la et corrige-la."),
    "ordre": ("Classement", "Écris les lettres dans l'ordre demandé."),
}
ORDRE_TYPES = ["mesure", "rep", "qcm", "vf", "trou", "assoc", "calc", "erreur", "ordre"]
DISCIPLINES = [("lecture", "Lire le dossier", "Cartouche, page de garde, légende : savoir où chercher."),
               ("arch", "Architecture", "Locaux, portes, fenêtres et dimensions du bâtiment."),
               ("plomb", "Plomberie", "Appareils, tuyaux, unités d'évacuation."),
               ("elec", "Électricité", "Entrée de service, circuits et symboles."),
               ("cvca", "Chauffage et ventilation", "Équipements et conduits."),
               ("calc", "Calculs de chantier", "Superficies, volumes, conversions."),
               ("mesure", "Mesures à l'échelle", "Utilise ton échelimètre.")]
NIVEAUX = {1: ("Niveau 1 · Échauffement", "Questions rapides : tu as les réponses sous les yeux."),
           2: ("Niveau 2 · Mise en application", "Il faut chercher, comparer et compléter."),
           3: ("Niveau 3 · Défi d'expert", "Calculs et pièges : lis bien avant de répondre.")}
DEFIS = {"eclair": ("Défi éclair", "Réponds vite : une seule bonne réponse par question."),
         "obs": ("Défi observation", "Regarde les images et les feuilles du dossier de près."),
         "reflexion": ("Défi réflexion", "Calcule, compare, repère les pièges.")}


# ---------------------------------------------------------------- constructeurs
def _q(d, kw):
    d.setdefault("pts", PTS.get(d["t"], 1)); d.setdefault("niv", NIV.get(d["t"], 1)); d.setdefault("cat", "lecture"); d.update(kw); return d
def rep(q, r, ou, **kw): return _q(dict(t="rep", q=q, r=r, ou=ou), kw)
def qcm(q, options, bonne, ou, **kw): return _q(dict(t="qcm", q=q, options=list(options), bonne=options.index(bonne), ou=ou), kw)
def vf(enonce, vrai, ou, correction="", **kw): return _q(dict(t="vf", q=enonce, vrai=vrai, corr=correction, ou=ou), kw)
def trou(texte, reponses, ou, **kw): return _q(dict(t="trou", q=texte, r=list(reponses), ou=ou), kw)
def assoc(consigne, paires, ou, rng, **kw):
    droite = [d for _, d in paires]; ordre = list(range(len(paires))); rng.shuffle(ordre)
    return _q(dict(t="assoc", q=consigne, gauche=[g for g, _ in paires], droite=[droite[i] for i in ordre], sol=[ordre.index(i) for i in range(len(paires))], ou=ou, pts=len(paires)), kw)
def calc(q, etapes, r, ou, **kw): return _q(dict(t="calc", q=q, etapes=list(etapes), r=r, ou=ou), kw)
def mesure(q, reel, N, variante="normal", **kw): return _q(dict(t="mesure", q=q, reel=reel, N=N, v=variante, ou="", cat="mesure"), kw)
def erreur(enonce, r, ou, **kw): return _q(dict(t="erreur", q=enonce, r=r, ou=ou), kw)
def ordre(q, items, sens, ou, rng, **kw):
    idx = list(range(len(items))); rng.shuffle(idx)
    lettres = {i: LETTRES[k] for k, i in enumerate(idx)}
    return _q(dict(t="ordre", q=q, items=[items[i] for i in idx], sol="  >  ".join(lettres[i] for i in range(len(items))), ou=ou, sens=sens), kw)


def options_numeriques(vrai, rng, pas, n=4, unite="", fmt=str, mini=1):
    vals = {vrai}; essais = 0
    while len(vals) < n and essais < 60:
        essais += 1
        v = vrai + rng.choice([-3, -2, -1, 1, 2, 3]) * pas
        if v >= mini: vals.add(v)
    vals = sorted(vals); rng.shuffle(vals)
    return [fmt(v) + unite for v in vals], fmt(vrai) + unite


# ---------------------------------------------------------------- mesures
def _lignes(q, larg=88): return wrap(q["q"], larg)


def _h_img(q):
    return (q["img_h"] + 5) if q.get("img") else 0


def _hauteur(q, corr):
    n = len(_lignes(q)); t = q["t"]; h = _h_img(q)
    base = {"mesure": n * 5 + (11 if corr else 15), "rep": n * 5 + (11 if corr else 14), "qcm": n * 5 + len(q.get("options", [])) * 5.4 + 5,
            "vf": n * 5 + (12 if corr else 17), "trou": n * 6 + (12 if corr else 7), "assoc": n * 5 + len(q.get("gauche", [])) * 5.4 + 9,
            "calc": n * 5 + (len(q.get("etapes", [])) * 4.6 + 12 if corr else 30), "erreur": n * 5 + (13 if corr else 24),
            "ordre": n * 5 + len(q.get("items", [])) * 5.4 + (13 if corr else 12)}.get(t, 30)
    return base + h + 4


# ---------------------------------------------------------------- dessin
def _rr(c, x, y, w, h, r=2.2, fill=None, stroke=None, lw=.5):
    c.saveState()
    if fill is not None: c.setFillColor(fill)
    if stroke is not None: c.setStrokeColor(stroke); c.setLineWidth(lw)
    c.roundRect(x * MM, y * MM, w * MM, h * MM, r * MM, stroke=1 if stroke is not None else 0, fill=1 if fill is not None else 0); c.restoreState()


def _case(c, x, y, coche=False, col=black):
    c.setStrokeColor(col); c.setLineWidth(.6); c.roundRect(x * MM, (y - .6) * MM, 3.6 * MM, 3.6 * MM, .6 * MM)
    if coche:
        c.setStrokeColor(VERT); c.setLineWidth(1.5); c.line((x + .6) * MM, (y + 1.2) * MM, (x + 1.5) * MM, (y + .1) * MM); c.line((x + 1.5) * MM, (y + .1) * MM, (x + 3.3) * MM, (y + 2.8) * MM)
    c.setStrokeColor(black)


def _bandeau(c, T, titre, sous, corr, premiere):
    col = T["couleur"]
    if premiere:
        _rr(c, 0, PH - 38, PW, 38, 0, fill=col)
        c.setFillColor(HexColor("#ffffff22")) if False else None
        _rr(c, MX - 2, PH - 31, 36, 21, 2, fill=white)
        c.drawImage(LOGO, (MX - .5) * MM, (PH - 30.2) * MM + (17 - 33 / LOGO_R) / 2 * MM, 33 * MM, 33 / LOGO_R * MM, mask="auto")
        c.setFillColor(white); c.setFont(FONT_B, 8.5); c.drawString((MX + 38) * MM, (PH - 12) * MM, (T["kicker"]).upper())
        c.setFont(FONT_B, 19); c.drawString((MX + 38) * MM, (PH - 21.5) * MM, titre)
        c.setFont(FONT, 10); c.drawString((MX + 38) * MM, (PH - 28) * MM, sous)
        if T.get("thumb"):
            try:
                _rr(c, PW - MX - 38, PH - 33, 40, 27, 2, fill=white)
                c.drawImage(T["thumb"], (PW - MX - 36.5) * MM, (PH - 31.5) * MM, 37 * MM, 24 * MM, preserveAspectRatio=True, anchor="c")
            except Exception: pass
        if corr:
            c.saveState(); c.translate((PW - MX - 60) * MM, (PH - 22) * MM); c.rotate(8); _rr(c, -2, -3, 30, 9, 1.5, fill=white, stroke=ROUGE, lw=1.4)
            c.setFillColor(ROUGE); c.setFont(FONT_B, 11); c.drawString(0, 0, "CORRIGÉ"); c.restoreState()
    else:
        _rr(c, 0, PH - 14, PW, 14, 0, fill=col)
        c.setFillColor(white); c.setFont(FONT_B, 10.5); c.drawString(MX * MM, (PH - 9) * MM, titre + " (suite)" + (" — corrigé" if corr else ""))
        c.setFont(FONT, 8.5); c.drawRightString((PW - MX) * MM, (PH - 9) * MM, sous)
    c.setFillColor(black)


def _pied(c, T, n):
    c.setFont(FONT, 7.5); c.setFillColor(GRIS)
    c.drawString(MX * MM, 9 * MM, f"{T['nom']} · Conçu par Jeremy, enseignant · Pavillon de l'Avenir"); c.drawRightString((PW - MX) * MM, 9 * MM, f"page {n}")
    c.setStrokeColor(GRIS_L); c.setLineWidth(.4); c.line(MX * MM, 12.5 * MM, (PW - MX) * MM, 12.5 * MM); c.setFillColor(black); c.setStrokeColor(black)


def _entete_info(c, T, total, y, corr):
    if corr:
        _rr(c, MX, y - 12, PW - 2 * MX, 12, 2, fill=HexColor("#e8f5ec"), stroke=VERT)
        c.setFillColor(VERT); c.setFont(FONT_B, 9.5); c.drawString((MX + 4) * MM, (y - 5) * MM, f"Total : {total} points.   Les réponses sont en vert; « Où la trouver » indique la feuille à consulter.")
        c.setFillColor(black); return y - 17
    _rr(c, MX, y - 13, PW - 2 * MX, 13, 2, fill=GRIS_T, stroke=GRIS_L)
    c.setFont(FONT, 9); c.setFillColor(GRIS)
    c.drawString((MX + 3) * MM, (y - 4.2) * MM, "NOM"); c.drawString((MX + 78) * MM, (y - 4.2) * MM, "GROUPE"); c.drawString((MX + 110) * MM, (y - 4.2) * MM, "DATE")
    c.drawString((MX + 140) * MM, (y - 4.2) * MM, "NOTE")
    c.setFillColor(black); c.setStrokeColor(GRIS); c.setLineWidth(.4)
    for (a, b) in ((MX + 3, MX + 75), (MX + 78, MX + 107), (MX + 110, MX + 137)): c.line(a * MM, (y - 11) * MM, b * MM, (y - 11) * MM)
    c.setFont(FONT_B, 11); c.drawString((MX + 140) * MM, (y - 11) * MM, f"_____ / {total}")
    c.setStrokeColor(black)
    return y - 18


def _intro(c, T, y, corr):
    if corr or not T.get("intro"): return y
    lignes = []
    for p in T["intro"]: lignes += wrap(p, 112)
    h = len(lignes) * 4.6 + 7
    _rr(c, MX, y - h, PW - 2 * MX, h, 2, fill=HexColor("#fffbe6"), stroke=HexColor("#e7d98a"))
    c.setFont(FONT, 9.2); c.setFillColor(HexColor("#4a4320"))
    for i, l in enumerate(lignes): c.drawString((MX + 4) * MM, (y - 5.5 - 4.6 * i) * MM, l)
    c.setFillColor(black)
    return y - h - 5


def _titre_section(c, T, y, num, titre, consigne, pts):
    col = T["couleur"]
    _rr(c, MX, y - 8.5, PW - 2 * MX, 8.5, 1.8, fill=col)
    c.setFillColor(white); c.setFont(FONT_B, 11); c.drawString((MX + 4) * MM, (y - 5.9) * MM, f"{num}  ·  {titre}")
    c.setFont(FONT, 8.5); c.drawRightString((PW - MX - 4) * MM, (y - 5.8) * MM, f"{pts} pt{'s' if pts > 1 else ''}")
    c.setFillColor(GRIS); c.setFont(FONT, 8.8); c.drawString((MX + 1) * MM, (y - 13.2) * MM, consigne); c.setFillColor(black)
    return y - 18


def _tag_feuille(c, T, x, y, q):
    m = re.search(r"\b([A-Z]-\d{3})\b", q.get("ou", "") or "")
    if not m: return
    t = "Feuille " + m.group(1); w = c.stringWidth(t, FONT, 7.5) / MM + 4
    _rr(c, PW - MX - w, y - 1.2, w, 4.6, 1.2, fill=HexColor("#eef3fb"), stroke=HexColor("#b8c9e6"), lw=.4)
    c.setFillColor(HexColor("#2a4d8f")); c.setFont(FONT, 7.5); c.drawString((PW - MX - w + 2) * MM, (y + .3) * MM, t); c.setFillColor(black)


def _bonne(c, x, y, txt):
    c.setFillColor(VERT); c.setFont(FONT_B, 10)
    for k, l in enumerate(wrap(txt, 86)): c.drawString(x * MM, (y - 4.6 * k) * MM, l)
    c.setFillColor(black)
    return len(wrap(txt, 86)) * 4.6


def _ou(c, x, y, ou):
    c.setFont(FONT, 8.2); c.setFillColor(GRIS); c.drawString(x * MM, y * MM, "Où la trouver : " + ou); c.setFillColor(black)


def _question(c, T, q, num, y, corr):
    """Dessine une question; retourne le nouveau y."""
    col = T["couleur"]; x0 = MX + 10
    # numéro dans une pastille
    c.setFillColor(col); c.circle((MX + 3.4) * MM, (y - 1.4) * MM, 3.4 * MM, stroke=0, fill=1)
    c.setFillColor(white); c.setFont(FONT_B, 9 if num < 100 else 7); c.drawCentredString((MX + 3.4) * MM, (y - 2.6) * MM, str(num)); c.setFillColor(black)
    if T.get("indices") == "tous" or (T.get("indices") == "niv1" and q.get("niv") == 1): _tag_feuille(c, T, x0, y - .5, q)
    c.setFont(FONT_B, 10.2)
    for l in _lignes(q): c.drawString(x0 * MM, (y - 2) * MM, l); y -= 5
    y -= 2.4
    t = q["t"]; xr = x0 + 2
    if q.get("img"):
        w = q["img_w"]; h = q["img_h"]
        _rr(c, xr, y - h - 2, w + 3, h + 3, 1.5, fill=white, stroke=GRIS_L)
        try: c.drawImage(q["img"], (xr + 1.5) * MM, (y - h - .5) * MM, w * MM, h * MM, preserveAspectRatio=True, anchor="c")
        except Exception: pass
        if q.get("legende"): c.setFont(FONT, 7.5); c.setFillColor(GRIS); c.drawString((xr + w + 6) * MM, (y - 3) * MM, q["legende"]); c.setFillColor(black)
        y -= h + 6
    if t == "mesure":
        if corr:
            if q["v"] == "papier": r_ = f"→ {q['reel'] / 10:.1f} mm sur le papier".replace(".", ",")
            elif q["v"] == "reel": r_ = f"→ {q['reel']:,} mm".replace(",", " ")
            else: r_ = f"→ {q['reel']:,} mm réels   (≈ {q['reel'] / q['N']:.1f} mm sur le papier, tolérance ± {q['N']} mm réels)".replace(",", " ").replace(".", ",")
            y -= _bonne(c, xr, y, r_) + 3
        else:
            c.setFont(FONT, 9.3); c.setFillColor(GRIS)
            txt = {"papier": "Longueur sur le papier", "reel": "Dimension réelle"}.get(q["v"])
            if txt: c.drawString(xr * MM, (y - 3) * MM, txt + " :"); _ligne(c, xr + 44, y - 3.8, 30); c.drawString((xr + 76) * MM, (y - 3) * MM, "mm")
            else:
                c.drawString(xr * MM, (y - 3) * MM, "Sur le papier :"); _ligne(c, xr + 26, y - 3.8, 20); c.drawString((xr + 48) * MM, (y - 3) * MM, "mm")
                c.drawString((xr + 66) * MM, (y - 3) * MM, "Dimension réelle :"); _ligne(c, xr + 100, y - 3.8, 28); c.drawString((xr + 130) * MM, (y - 3) * MM, "mm")
            c.setFillColor(black); y -= 10
    elif t == "rep":
        if corr: y -= _bonne(c, xr, y, "→ " + q["r"]); _ou(c, xr, y - 0.5, q["ou"]); y -= 7
        else: _ligne(c, xr, y - 4, PW - MX - xr, 'pointille'); y -= 11
    elif t == "qcm":
        for i, o in enumerate(q["options"]):
            bon = corr and i == q["bonne"]
            _case(c, xr, y - .8, bon); c.setFont(FONT_B if bon else FONT, 10)
            c.setFillColor(VERT if bon else black); c.drawString((xr + 6) * MM, y * MM, f"{LETTRES[i]})  {o}"); c.setFillColor(black); y -= 5.4
        if corr: _ou(c, xr, y - .5, q["ou"]); y -= 5
        else: y -= 2
    elif t == "vf":
        _case(c, xr, y - .8, corr and q["vrai"]); c.setFont(FONT, 10); c.drawString((xr + 6) * MM, y * MM, "Vrai")
        _case(c, xr + 28, y - .8, corr and not q["vrai"]); c.drawString((xr + 34) * MM, y * MM, "Faux"); y -= 5.8
        if corr: y -= _bonne(c, xr, y, "→ Vrai" if q["vrai"] else "→ Faux : " + q["corr"]); _ou(c, xr, y - .5, q["ou"]); y -= 6
        else: c.setFont(FONT, 9); c.setFillColor(GRIS); c.drawString(xr * MM, (y - .5) * MM, "Si faux, correction :"); c.setFillColor(black); _ligne(c, xr + 32, y - 1.3, PW - MX - xr - 32); y -= 10
    elif t == "trou":
        if corr: y -= _bonne(c, xr, y, "→ " + "  ;  ".join(q["r"])); _ou(c, xr, y - .5, q["ou"]); y -= 7
        else: y -= 3
    elif t == "assoc":
        c.setFont(FONT, 10)
        for i, g in enumerate(q["gauche"]):
            _rr(c, xr, y - 3.6, 58, 5.2, 1, fill=GRIS_T); c.setFillColor(black); c.setFont(FONT, 9.8); c.drawString((xr + 2) * MM, (y - 2.2) * MM, f"{i + 1}.  {g}")
            if corr: c.setFillColor(VERT); c.setFont(FONT_B, 11); c.drawString((xr + 64) * MM, (y - 2.4) * MM, LETTRES[q["sol"][i]])
            else: _ligne(c, xr + 62, y - 3, 8)
            c.setFillColor(black); c.setFont(FONT, 9.8); c.drawString((xr + 82) * MM, (y - 2.2) * MM, f"{LETTRES[i]})  {q['droite'][i]}"); y -= 6
        if corr: _ou(c, xr, y - 0.5, q["ou"]); y -= 5
        y -= 2
    elif t == "calc":
        if corr:
            for e in q["etapes"]: c.setFont(FONT, 9.4); c.setFillColor(GRIS); c.drawString(xr * MM, (y - 1) * MM, e); c.setFillColor(black); y -= 4.6
            y -= _bonne(c, xr, y - 1, "→ " + q["r"]); _ou(c, xr, y - 1, q["ou"]); y -= 7
        else:
            _rr(c, xr, y - 17, PW - MX - xr, 17, 1.8, fill=None, stroke=GRIS_L)
            c.setFont(FONT, 8); c.setFillColor(GRIS); c.drawString((xr + 2) * MM, (y - 3.5) * MM, "Calcul"); c.setFillColor(black)
            c.setFont(FONT, 9.3); c.drawString((PW - MX - 62) * MM, (y - 14) * MM, "Réponse :"); _ligne(c, PW - MX - 43, y - 14.8, 41); y -= 23
    elif t == "erreur":
        if corr: y -= _bonne(c, xr, y, "→ " + q["r"]); _ou(c, xr, y - .5, q["ou"]); y -= 7
        else:
            c.setFont(FONT, 9.2); c.setFillColor(GRIS); c.drawString(xr * MM, (y - 1) * MM, "L'erreur est :"); c.setFillColor(black); _ligne(c, xr + 22, y - 1.8, PW - MX - xr - 22)
            c.setFillColor(GRIS); c.drawString(xr * MM, (y - 7.5) * MM, "Correction :"); c.setFillColor(black); _ligne(c, xr + 22, y - 8.3, PW - MX - xr - 22); y -= 17
    elif t == "ordre":
        c.setFont(FONT, 10)
        for i, it in enumerate(q["items"]):
            _rr(c, xr, y - 3.6, 75, 5.2, 1, fill=GRIS_T); c.setFillColor(black); c.drawString((xr + 2) * MM, (y - 2.2) * MM, f"{LETTRES[i]})  {it}"); y -= 6
        if corr: y -= _bonne(c, xr, y - 1, f"→ {q['sol']}   ({q['sens']})"); _ou(c, xr, y - 1, q["ou"]); y -= 7
        else:
            c.setFont(FONT, 9.3); c.setFillColor(GRIS); n = len(q["items"])
            c.drawString(xr * MM, (y - 2) * MM, f"Ordre ({q['sens']}) :"); c.setFillColor(black)
            xx = xr + 62
            for k in range(n):
                _rr(c, xx, y - 4, 9, 6, 1, stroke=GRIS); xx += 9
                if k < n - 1: c.setFont(FONT_B, 10); c.drawString((xx + 1.6) * MM, (y - 2) * MM, ">"); xx += 6
            y -= 10
    # pastille de points
    c.setFont(FONT, 7.5); c.setFillColor(GRIS)
    c.drawRightString((PW - MX) * MM, (y + 2.3) * MM, f"{q['pts']} pt{'s' if q['pts'] > 1 else ''}"); c.setFillColor(black)
    return y - 4


def _ligne(c, x, y, w, style=None):
    c.setStrokeColor(GRIS); c.setLineWidth(.4)
    if style == "pointille": c.setDash(1, 2)
    c.line(x * MM, y * MM, (x + w) * MM, y * MM); c.setDash(); c.setStrokeColor(black)


# ---------------------------------------------------------------- groupes
def _groupes(Q, mode):
    """Retourne [(titre, consigne, [questions])] selon le mode de construction du document."""
    g = []
    if mode == "discipline":
        for code, titre, cons in DISCIPLINES:
            l = [q for q in Q if q.get("cat") == code]
            if l: g.append((titre, cons, l))
    elif mode == "niveau":
        for n in (1, 2, 3):
            l = [q for q in Q if q.get("niv") == n]
            if l: g.append((NIVEAUX[n][0], NIVEAUX[n][1], l))
    elif mode == "defis":
        eclair = [q for q in Q if q["t"] in ("qcm", "vf", "rep", "mesure") and not q.get("img")]
        obs = [q for q in Q if q.get("img")]
        refl = [q for q in Q if q not in eclair and q not in obs]
        for k, l in (("eclair", eclair), ("obs", obs), ("reflexion", refl)):
            if l: g.append((DEFIS[k][0], DEFIS[k][1], l))
    else:
        for code in ORDRE_TYPES:
            l = [q for q in Q if q["t"] == code]
            if l: g.append((PARTIES[code][0], PARTIES[code][1], l))
    return g


def generer_pdf(chemin, titre_doc, sous, Q, corr, consigne_gen, theme=None, mode="type"):
    T = dict(couleur=HexColor("#1c5f8f"), kicker="Pavillon de l'Avenir", nom=titre_doc, indices="tous", intro=None, thumb=None); T.update(theme or {})
    total = sum(q["pts"] for q in Q)
    c = rl_canvas.Canvas(chemin, pagesize=(PW * MM, PH * MM)); c.setTitle(titre_doc + (" — corrigé" if corr else "")); c.setAuthor("Pavillon de l'Avenir")
    page = 1
    _bandeau(c, T, titre_doc, sous, corr, True); y = PH - 46
    y = _entete_info(c, T, total, y, corr)
    T2 = dict(T)
    if not corr: T2["intro"] = T.get("intro") or [consigne_gen]
    y = _intro(c, T2, y, corr)
    def nouvelle():
        nonlocal y, page
        _pied(c, T, page); c.showPage(); page += 1; _bandeau(c, T, titre_doc, sous, corr, False); y = PH - 22
    num = 0
    for gi, (titre_g, cons_g, qs) in enumerate(_groupes(Q, mode), 1):
        pts_g = sum(q["pts"] for q in qs)
        if y < 70: nouvelle()
        y = _titre_section(c, T, y, T.get("prefixe", "Partie ") + (chr(64 + gi) if T.get("lettres", True) else str(gi)), titre_g, cons_g, pts_g)
        for q in qs:
            num += 1
            if y - _hauteur(q, corr) < 18: nouvelle()
            y = _question(c, T, q, num, y, corr)
    _pied(c, T, page); c.save()
