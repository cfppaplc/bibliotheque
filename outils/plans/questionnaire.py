# -*- coding: utf-8 -*-
"""Questionnaires à types variés (réponse courte, choix multiple, vrai ou faux, texte à compléter, association,
calcul, trouve l'erreur, classement) : constructeurs de questions + mise en page PDF (feuille d'élève et corrigé)."""
import random
from reportlab.pdfgen import canvas as rl_canvas
from reportlab.lib.colors import HexColor, black
from dessin import wrap, FONT, FONT_B, LOGO, LOGO_R, MM

PW, PH = 215.9, 279.4
VERT, GRIS, ROUGE = HexColor("#1a7f37"), HexColor("#666666"), HexColor("#b00020")
LETTRES = "ABCDEFGH"

PARTIES = [
    ("mesure", "Partie {} — Mesures avec l'échelimètre", "Mesure sur le papier avec ton échelimètre, puis écris la dimension réelle en millimètres."),
    ("rep", "Partie {} — Réponse courte", "Écris la réponse, avec l'unité. Indique la feuille où tu l'as trouvée."),
    ("qcm", "Partie {} — Choix multiple", "Coche une seule réponse."),
    ("vf", "Partie {} — Vrai ou faux", "Coche Vrai ou Faux. Si c'est faux, corrige l'énoncé."),
    ("trou", "Partie {} — Texte à compléter", "Écris le mot ou le nombre qui manque."),
    ("assoc", "Partie {} — Association", "Écris la lettre qui correspond à chaque numéro."),
    ("calc", "Partie {} — Calculs", "Montre ton calcul, puis écris la réponse avec l'unité."),
    ("erreur", "Partie {} — Trouve l'erreur", "Chaque énoncé contient une erreur : trouve-la et corrige-la."),
    ("ordre", "Partie {} — Classement", "Écris les lettres dans l'ordre demandé."),
]


# ---------------------------------------------------------------- constructeurs
def rep(q, r, ou): return dict(t="rep", q=q, r=r, ou=ou)
def qcm(q, options, bonne, ou):
    """options : liste de textes; bonne : texte de la bonne réponse (doit figurer dans options)."""
    return dict(t="qcm", q=q, options=list(options), bonne=options.index(bonne), ou=ou)
def vf(enonce, vrai, ou, correction=""): return dict(t="vf", q=enonce, vrai=vrai, corr=correction, ou=ou)
def trou(texte, reponses, ou): return dict(t="trou", q=texte, r=list(reponses), ou=ou)
def assoc(consigne, paires, ou, rng):
    droite = [d for _, d in paires]; ordre = list(range(len(paires))); rng.shuffle(ordre)
    return dict(t="assoc", q=consigne, gauche=[g for g, _ in paires], droite=[droite[i] for i in ordre], sol=[ordre.index(i) for i in range(len(paires))], ou=ou)
def calc(q, etapes, r, ou): return dict(t="calc", q=q, etapes=list(etapes), r=r, ou=ou)
def mesure(q, reel, N, variante='normal'): return dict(t='mesure', q=q, reel=reel, N=N, v=variante, ou='')
def erreur(enonce, r, ou): return dict(t="erreur", q=enonce, r=r, ou=ou)
def ordre(q, items, sol_texte_ordre, ou, rng):
    """items : textes dans le bon ordre; ils sont mélangés puis lettrés."""
    idx = list(range(len(items))); rng.shuffle(idx)
    lettres = {i: LETTRES[k] for k, i in enumerate(idx)}
    return dict(t="ordre", q=q, items=[items[i] for i in idx], sol="  >  ".join(lettres[i] for i in range(len(items))), ou=ou, sens=sol_texte_ordre)


def options_numeriques(vrai, rng, pas, n=4, unite="", fmt=str, mini=1):
    """Choix multiple numérique : la bonne valeur + (n-1) voisines distinctes, mélangées."""
    vals = {vrai}
    essais = 0
    while len(vals) < n and essais < 60:
        essais += 1
        v = vrai + rng.choice([-3, -2, -1, 1, 2, 3]) * pas
        if v >= mini: vals.add(v)
    vals = sorted(vals); rng.shuffle(vals)
    return [fmt(v) + unite for v in vals], fmt(vrai) + unite


# ---------------------------------------------------------------- mise en page
def _entete(c, titre, sous):
    c.setFillColor(black); c.setFont(FONT_B, 17); c.drawString(20 * MM, (PH - 24) * MM, titre)
    c.setFont(FONT, 10.5); c.drawString(20 * MM, (PH - 31) * MM, sous)
    c.drawImage(LOGO, (PW - 20 - 16 * LOGO_R) * MM, (PH - 30) * MM, 16 * LOGO_R * MM, 16 * MM)
    c.setLineWidth(.8); c.line(20 * MM, (PH - 35) * MM, (PW - 20) * MM, (PH - 35) * MM)


def _case(c, x, y, coche=False):
    c.setLineWidth(.6); c.rect(x * MM, (y - 0.6) * MM, 3.6 * MM, 3.6 * MM)
    if coche:
        c.setStrokeColor(VERT); c.setLineWidth(1.4); c.line((x + .6) * MM, (y + 1.2) * MM, (x + 1.5) * MM, (y + .1) * MM); c.line((x + 1.5) * MM, (y + .1) * MM, (x + 3.3) * MM, (y + 2.8) * MM); c.setStrokeColor(black)


def _hauteur(q, corr):
    n = len(wrap(q["q"], 92)); t = q["t"]
    if t == "mesure": return n * 5 + (11 if corr else 14)
    if t == "rep": return n * 5 + (12 if corr else 14)
    if t == "qcm": return n * 5 + len(q["options"]) * 5.2 + 6
    if t == "vf": return n * 5 + (11 if corr else 16)
    if t == "trou": return n * 6 + 8
    if t == "assoc": return n * 5 + len(q["gauche"]) * 5.2 + 8
    if t == "calc": return n * 5 + (14 if corr else 30)
    if t == "erreur": return n * 5 + (14 if corr else 22)
    if t == "ordre": return n * 5 + len(q["items"]) * 5.2 + 12
    return 30


def generer_pdf(chemin, titre_doc, sous, Q, corr, consigne_gen, auteur="Pavillon de l'Avenir"):
    c = rl_canvas.Canvas(chemin, pagesize=(PW * MM, PH * MM)); c.setTitle(titre_doc + (" — corrigé" if corr else "")); c.setAuthor(auteur)
    t1 = ("CORRIGÉ · " if corr else "EXERCICES · ") + titre_doc
    _entete(c, t1, sous + ("   (réservé à l'enseignant)" if corr else "")); y = PH - 46
    if not corr:
        c.setFont(FONT, 10); c.drawString(20 * MM, y * MM, "Nom : ______________________________   Groupe : ____________   Date : ______________"); y -= 8
        for l in wrap(consigne_gen, 105): c.drawString(20 * MM, y * MM, l); y -= 5
        y -= 3
    def nouvelle():
        nonlocal y
        c.showPage(); _entete(c, t1 + " (suite)", sous); y = PH - 46
    num = 0
    lettre_partie = 0
    for (code, titre_p, consigne_p) in PARTIES:
        sel = [q for q in Q if q["t"] == code]
        if not sel: continue
        lettre_partie += 1
        if y < 50: nouvelle()
        c.setFillColor(ROUGE); c.setFont(FONT_B, 11.5); c.drawString(20 * MM, y * MM, titre_p.format(LETTRES[lettre_partie - 1]).upper()); y -= 5
        c.setFillColor(GRIS); c.setFont(FONT, 9); c.drawString(20 * MM, y * MM, consigne_p); c.setFillColor(black); y -= 7
        for q in sel:
            num += 1
            if y - _hauteur(q, corr) < 16: nouvelle()
            c.setFont(FONT_B, 10.3)
            for k, l in enumerate(wrap(q["q"], 92)):
                c.drawString((20 if k == 0 else 27) * MM, y * MM, (f"{num}.  " if k == 0 else "") + l); y -= 5
            t = q["t"]; x0 = 27
            if t == "mesure":
                if corr:
                    if q["v"] == "papier": r_ = f"→ {q['reel'] / 10:.1f} mm sur le papier".replace(".", ",")
                    elif q["v"] == "reel": r_ = f"→ {q['reel']:,} mm".replace(",", " ")
                    else: r_ = f"→ {q['reel']:,} mm réels   (≈ {q['reel'] / q['N']:.1f} mm sur le papier, tolérance ± {q['N']} mm réels)".replace(",", " ").replace(".", ",")
                    _bonne(c, x0, y, r_); y -= 7
                else:
                    c.setFont(FONT, 9.5)
                    txt = {"papier": "Longueur sur le papier : ______________ mm", "reel": "Dimension réelle : ______________ mm"}.get(q["v"], "Mesure sur le papier : ________ mm        Dimension réelle : ______________ mm")
                    c.drawString(x0 * MM, (y - 3) * MM, txt); y -= 10
            elif t == "rep":
                if corr: _bonne(c, x0, y, "→ " + q["r"]); y -= 5; _ou(c, x0, y, q["ou"]); y -= 7
                else: c.setLineWidth(.4); c.line(x0 * MM, (y - 4) * MM, (PW - 20) * MM, (y - 4) * MM); y -= 12
            elif t == "qcm":
                for i, o in enumerate(q["options"]):
                    _case(c, x0, y - .8, corr and i == q["bonne"]); c.setFont(FONT_B if corr and i == q["bonne"] else FONT, 10)
                    if corr and i == q["bonne"]: c.setFillColor(VERT)
                    c.drawString((x0 + 6) * MM, y * MM, f"{LETTRES[i]})  {o}"); c.setFillColor(black); y -= 5.2
                if corr: y -= 1; _ou(c, x0, y, q["ou"]); y -= 5
                else: y -= 3
            elif t == "vf":
                _case(c, x0, y - .8, corr and q["vrai"]); c.setFont(FONT, 10); c.drawString((x0 + 6) * MM, y * MM, "Vrai")
                _case(c, x0 + 28, y - .8, corr and not q["vrai"]); c.drawString((x0 + 34) * MM, y * MM, "Faux"); y -= 5.5
                if corr:
                    _bonne(c, x0, y, ("→ Vrai" if q["vrai"] else "→ Faux : " + q["corr"])); y -= 5; _ou(c, x0, y, q["ou"]); y -= 5
                else:
                    c.setFont(FONT, 9.5); c.drawString(x0 * MM, y * MM, "Si faux, correction : "); c.setLineWidth(.4); c.line((x0 + 36) * MM, (y - .8) * MM, (PW - 20) * MM, (y - .8) * MM); y -= 9
            elif t == "trou":
                if corr: _bonne(c, x0, y, "→ " + "  ;  ".join(q["r"])); y -= 5; _ou(c, x0, y, q["ou"]); y -= 7
                else: y -= 3
            elif t == "assoc":
                c.setFont(FONT, 10)
                for i, g in enumerate(q["gauche"]):
                    c.drawString(x0 * MM, y * MM, f"{i + 1}.  {g}")
                    c.drawString((x0 + 62) * MM, y * MM, f"{LETTRES[i]})  {q['droite'][i]}")
                    if corr: c.setFillColor(VERT); c.drawString((x0 + 55) * MM, y * MM, f"{LETTRES[q['sol'][i]]}"); c.setFillColor(black)
                    else: c.drawString((x0 + 50) * MM, y * MM, "___")
                    y -= 5.2
                if corr: _ou(c, x0, y, q["ou"]); y -= 5
                y -= 3
            elif t == "calc":
                if corr:
                    for e in q["etapes"]: c.setFont(FONT, 9.5); c.setFillColor(GRIS); c.drawString(x0 * MM, y * MM, e); c.setFillColor(black); y -= 4.6
                    _bonne(c, x0, y, "→ " + q["r"]); y -= 5; _ou(c, x0, y, q["ou"]); y -= 6
                else:
                    c.setFont(FONT, 9.5); c.drawString(x0 * MM, (y - 1) * MM, "Calcul :"); c.setLineWidth(.4)
                    for k in range(2): c.line((x0 + 17) * MM, (y - 1 - 7 * k) * MM, (PW - 20) * MM, (y - 1 - 7 * k) * MM)
                    c.drawString(x0 * MM, (y - 19) * MM, "Réponse :"); c.line((x0 + 20) * MM, (y - 19.8) * MM, (x0 + 80) * MM, (y - 19.8) * MM); y -= 27
            elif t == "erreur":
                if corr: _bonne(c, x0, y, "→ " + q["r"]); y -= 5; _ou(c, x0, y, q["ou"]); y -= 7
                else:
                    c.setFont(FONT, 9.5); c.drawString(x0 * MM, (y - 1) * MM, "Erreur et correction :"); c.setLineWidth(.4)
                    c.line((x0 + 38) * MM, (y - 1.8) * MM, (PW - 20) * MM, (y - 1.8) * MM); c.line(x0 * MM, (y - 8) * MM, (PW - 20) * MM, (y - 8) * MM); y -= 17
            elif t == "ordre":
                c.setFont(FONT, 10)
                for i, it in enumerate(q["items"]): c.drawString(x0 * MM, y * MM, f"{LETTRES[i]})  {it}"); y -= 5.2
                if corr: _bonne(c, x0, y, f"→ {q['sol']}   ({q['sens']})"); y -= 5; _ou(c, x0, y, q["ou"]); y -= 7
                else:
                    c.setFont(FONT, 9.5); c.drawString(x0 * MM, (y - 1) * MM, f"Ordre ({q['sens']}) :  ____  >  ____  >  ____" + ("  >  ____" if len(q["items"]) > 3 else "")); y -= 9
            if t == "trou" and not corr:
                pass
    c.save()


def _bonne(c, x, y, txt):
    c.setFillColor(VERT); c.setFont(FONT_B, 10)
    for k, l in enumerate(wrap(txt, 90)): c.drawString(x * MM, (y - 4.6 * k) * MM, l)
    c.setFillColor(black)


def _ou(c, x, y, ou):
    c.setFont(FONT, 8.5); c.setFillColor(GRIS); c.drawString(x * MM, y * MM, "Où la trouver : " + ou); c.setFillColor(black)
