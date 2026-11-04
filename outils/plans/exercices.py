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
    """Retourne [(question, réponse, où la trouver)] — toujours calculées sur les données du dossier."""
    Q = []
    lv = _lv(b)
    nom_dossier = b.dossier["projet"].split("\n")[0].lower()
    plan_no = lv[1][1].no_plan if hasattr(b, "lv") else "A-101"
    Q.append(("Quelle est l'échelle du plan du rez-de-chaussée ?", f"1:{(lv[1][1] if hasattr(b, 'lv') else b).Nplan}", f"Cartouche de la feuille {plan_no}, case « Échelle »"))
    Q.append(("Combien de feuilles contient ce dossier de plans ?", str(nb_feuilles), "Page de garde : liste des feuilles"))
    Q.append(("Sur quelle feuille trouve-t-on la coupe de mur type ?", "A-302", "Page de garde : liste des feuilles"))
    # largeur hors tout
    Q.append(("Quelle est la largeur hors tout du bâtiment, en millimètres ?", f"{fmt(b.W)} mm", f"Cote extérieure du plan du rez-de-chaussée ({plan_no})"))
    Q.append(("Quelle est la profondeur hors tout du bâtiment, en millimètres ?", f"{fmt(b.D)} mm", f"Cote extérieure du plan du rez-de-chaussée ({plan_no})"))
    # fenêtres de type A
    nA = sum(1 for _, l in lv for o in l.fenetres if o["type"] == "A")
    Q.append(("Combien de fenêtres de type A (hexagone « A ») compte le bâtiment au total ?", str(nA), "Tableau des fenêtres, feuille A-301 (colonne « Qté »)"))
    # porte
    portes = [(l, o) for _, l in lv for o in l.portes]
    p = next(((l, o) for (l, o) in portes if o.get("no") == "101"), portes[0])
    Q.append((f"Quelle est la largeur de la porte {p[1]['no']} ? (en millimètres)", f"{fmt(p[1]['w'])} mm", "Tableau des portes, feuille A-301"))
    gros = max(portes, key=lambda t: t[1]["w"])
    Q.append(("Quelle est la porte la plus large du bâtiment ? Donne son numéro et sa largeur.", f"Porte {gros[1]['no']}, {fmt(gros[1]['w'])} mm", "Tableau des portes, feuille A-301"))
    # locaux
    loc = [(l, x) for _, l in lv for x in l.locaux]
    gl = max(loc, key=lambda t: (t[1][4] - t[1][2]) * (t[1][5] - t[1][3]))
    a = (gl[1][4] - gl[1][2]) * (gl[1][5] - gl[1][3]) / 1e6
    Q.append(("Quel est le plus grand local du bâtiment, et quelle est sa superficie ?", f"{gl[1][1].replace(chr(10), ' ')} ({gl[1][0]}), {_virg(a)} m²", "Plans d'architecture (nom du local et superficie sous le nom) ou tableau des locaux A-401"))
    pl = min(loc, key=lambda t: (t[1][4] - t[1][2]) * (t[1][5] - t[1][3]))
    a2 = (pl[1][4] - pl[1][2]) * (pl[1][5] - pl[1][3]) / 1e6
    Q.append(("Quel est le plus petit local du bâtiment ?", f"{pl[1][1].replace(chr(10), ' ')} ({pl[1][0]}), {_virg(a2)} m²", "Tableau des locaux et des finis, feuille A-401"))
    tot = sum((x[4] - x[2]) * (x[5] - x[3]) for _, x in loc) / 1e6
    Q.append(("Quelle est la superficie totale des locaux du bâtiment ?", f"{_virg(tot)} m²", "Tableau des locaux et des finis, feuille A-401 (total sous le tableau)"))
    # hauteur
    hc = getattr(lv[-1][1], "hc", None) or getattr(b, "hc", None)
    if hc: Q.append(("Quelle est la hauteur libre sous plafond du rez-de-chaussée (en mm) ?", f"{fmt(getattr(lv[1][1] if hasattr(b, 'lv') else b, 'hc', hc))} mm", "Notes générales du plan du rez-de-chaussée"))
    # appareils
    from batiment import APP
    nwc = sum(1 for _, l in lv for (code, *_r) in getattr(l, "app", []) if code == "wc")
    Q.append(("Combien de toilettes (wc) y a-t-il dans le bâtiment ?", str(nwc), "Plans de plomberie ou tableau des appareils, feuille P-102 / P-201"))
    ut = sum(APP[code][8] for _, l in lv for (code, *_r) in getattr(l, "app", []) if code in APP)
    Q.append(("Quel est le nombre total d'unités d'évacuation (UT) du bâtiment ?", f"{ut:g} UT".replace(".", ","), "Tableau « Dimensionnement de la plomberie », feuille P-201"))
    # électricité
    B = b.calcul_bilan()
    Q.append(("Quelle est la grosseur de l'entrée de service électrique retenue ?", f"{B['service']} A ({B['tension']})", "Bilan de charge, feuille E-201"))
    # escalier / matériaux
    if hasattr(b, "volees") and b.volees:
        v = b.volees[0]
        Q.append(("Combien de contremarches compte la volée de l'escalier principal, et quelle est la hauteur d'une contremarche ?", f"12 contremarches de {(v[5] - v[4]) / 12:.0f} mm", "Analyse du code, feuille A-002, et coupe A (A-301)"))
    else:
        rev = getattr(b, "revetement", None)
        if rev: Q.append(("Quel est le matériau de revêtement extérieur principal ?", str(rev).capitalize(), "Élévations, feuille A-201 (notes)"))
    Q.append(("Que veut dire l'abréviation « AFCI » ?", "Disjoncteur anti-arcs (protège les circuits des chambres)", "Légende et abréviations, feuille A-001"))
    Q.append(("Dans les élévations, que représente un hexagone contenant une lettre ?", "Le type de fenêtre (voir le tableau des fenêtres)", "Légende et abréviations, feuille A-001"))
    return Q


def _entete(c, titre, sous):
    c.setFont(FONT_B, 17); c.drawString(20 * MM, (PH - 24) * MM, titre)
    c.setFont(FONT, 10.5); c.drawString(20 * MM, (PH - 31) * MM, sous)
    c.drawImage(LOGO, (PW - 20 - 16 * LOGO_R) * MM, (PH - 30) * MM, 16 * LOGO_R * MM, 16 * MM)
    c.setLineWidth(.8); c.line(20 * MM, (PH - 35) * MM, (PW - 20) * MM, (PH - 35) * MM)


def generer(b, nb_feuilles, chemin_ex, chemin_corr):
    Q = questions(b, nb_feuilles)
    nom = b.dossier["projet"].replace("\n", " — ")
    for (chemin, corr) in ((chemin_ex, False), (chemin_corr, True)):
        c = rl_canvas.Canvas(chemin, pagesize=(PW * MM, PH * MM))
        c.setTitle(f"{nom} — {'corrigé' if corr else 'exercices'}"); c.setAuthor("Pavillon de l'Avenir")
        _entete(c, f"{'CORRIGÉ' if corr else 'EXERCICES'} · {b.dossier['projet'].split(chr(10))[0].title()}", b.dossier["projet"].split("\n")[1] + " — Lecture de plans" + ("   (réservé à l'enseignant)" if corr else ""))
        y = PH - 46
        if not corr:
            c.setFont(FONT, 10); c.drawString(20 * MM, y * MM, "Nom : ______________________________   Groupe : ____________   Date : ______________"); y -= 8
            for l in wrap("Consigne : ouvre le dossier de plans et réponds aux questions. Écris l'unité (mm, m², A…) et, si tu peux, la feuille où tu as trouvé la réponse.", 105):
                c.drawString(20 * MM, y * MM, l); y -= 5
            y -= 4
        for i, (q, r, ou) in enumerate(Q, 1):
            lignes = wrap(q, 92)
            need = len(lignes) * 5 + (16 if not corr else 12)
            if y - need < 18:
                c.showPage(); _entete(c, f"{'CORRIGÉ' if corr else 'EXERCICES'} (suite)", b.dossier["projet"].replace("\n", " — ")); y = PH - 46
            c.setFont(FONT_B, 10.5)
            for k, l in enumerate(lignes):
                c.drawString((20 if k == 0 else 26) * MM, y * MM, (f"{i}.  " if k == 0 else "") + l); y -= 5
            if corr:
                c.setFillColor(HexColor("#1a7f37")); c.setFont(FONT_B, 10.5); c.drawString(26 * MM, y * MM, "→ " + r); y -= 5
                c.setFillColor(black); c.setFont(FONT, 8.5); c.setFillColor(HexColor("#666666")); c.drawString(26 * MM, y * MM, "Où la trouver : " + ou); c.setFillColor(black); y -= 8
            else:
                c.setLineWidth(.4); c.line(26 * MM, (y - 4) * MM, (PW - 20) * MM, (y - 4) * MM); y -= 12
        c.save()
    return Q
