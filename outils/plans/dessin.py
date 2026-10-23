# -*- coding: utf-8 -*-
"""Moteur de dessin de plans d'exercice (lecture de plans, FP Québec).
Unités du modèle : millimètres. Feuille : 11 x 17 po (tabloïd) en paysage."""
import math
from reportlab.pdfgen import canvas as rl_canvas
from reportlab.lib.colors import HexColor, black, white, Color

MM = 72 / 25.4
PAGE_W, PAGE_H = 431.8, 279.4            # mm
DRAW = (14, 14, 340, 265)                 # zone de dessin (x0, y0, x1, y1) en mm papier
GRIS = HexColor("#555555")
GRIS_C = HexColor("#9a9a9a")
GRIS_TC = HexColor("#d9d9d9")
EF, EC, DR, VE = HexColor("#1f6fe0"), HexColor("#d7263d"), HexColor("#178a3a"), HexColor("#7a4fd0")
ELEC, CVC_A, CVC_R = HexColor("#c45a00"), HexColor("#0a7f8c"), HexColor("#8a5a00")
FONT, FONT_B = "Helvetica", "Helvetica-Bold"


def fmt(n):
    """Nombre en format québécois : 12 000"""
    s = f"{int(round(n)):,}".replace(",", " ")
    return s


import os as _os
LOGO = _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "logo-pda.png")
LOGO_R = 358 / 141
AUTEUR = "Jeremy, enseignant"


class Feuille:
    def __init__(self, c, dossier, numero, titre, echelle_txt, total=None):
        self.c, self.dossier, self.numero, self.titre = c, dossier, numero, titre
        self.echelle_txt = echelle_txt
        self.vx, self.vy, self.N = 0, 0, 50
        self.cadre()

    # ---------- conversion modèle -> papier (points) ----------
    def vue(self, ox_mm, oy_mm, N):
        """Origine du modèle placée à (ox, oy) mm sur le papier, échelle 1:N."""
        self.vx, self.vy, self.N = ox_mm, oy_mm, N

    def P(self, x, y):
        return (self.vx + x / self.N) * MM, (self.vy + y / self.N) * MM

    def L(self, d):
        return d / self.N * MM

    # ---------- cadre et cartouche ----------
    def cadre(self):  # noqa
        c = self.c
        c.setStrokeColor(black); c.setLineWidth(1.4)
        c.rect(8 * MM, 8 * MM, (PAGE_W - 16) * MM, (PAGE_H - 16) * MM)
        x0 = 348
        c.setLineWidth(1); c.line(x0 * MM, 8 * MM, x0 * MM, (PAGE_H - 8) * MM)
        d = self.dossier
        # Bandeau du haut : nom du projet
        y = PAGE_H - 8
        c.drawImage(LOGO, (x0 + 3) * MM, (y - 16.5) * MM, 14 * LOGO_R * MM, 14 * MM)
        c.setFont(FONT_B, 8.2); c.drawString((x0 + 42) * MM, (y - 8) * MM, "PLAN D'EXERCICE")
        c.drawString((x0 + 42) * MM, (y - 11.6) * MM, "LECTURE DE PLANS")
        c.setLineWidth(.6); c.line(x0 * MM, (y - 18) * MM, (PAGE_W - 8) * MM, (y - 18) * MM)
        c.setFont(FONT, 6.5); c.drawString((x0 + 4) * MM, (y - 23) * MM, "PROJET")
        c.setFont(FONT_B, 11)
        yy = y - 29
        for ligne in d["projet"].split("\n"):
            c.drawString((x0 + 4) * MM, yy * MM, ligne); yy -= 5
        c.setFont(FONT, 7.5)
        for ligne in d["adresse"].split("\n"):
            c.drawString((x0 + 4) * MM, yy * MM, ligne); yy -= 4
        c.line(x0 * MM, (yy - 2) * MM, (PAGE_W - 8) * MM, (yy - 2) * MM)
        self.zone_notes_haut = yy - 6
        # Cartouche du bas
        cb = 74
        c.setLineWidth(.8); c.line(x0 * MM, cb * MM, (PAGE_W - 8) * MM, cb * MM)
        rows = [("TITRE DE LA FEUILLE", self.titre, 62, 11), ("ÉCHELLE", self.echelle_txt, 46, 9),
                ("DATE", d["date"], 38, 9), ("DESSINÉ PAR", "Dessin pédagogique", 30, 8)]
        c.setFont(FONT, 6.5); c.drawString((x0 + 4) * MM, (cb - 5) * MM, "TITRE DE LA FEUILLE")
        c.setFont(FONT_B, 10)
        yy = cb - 11
        for ligne in self.titre.split("\n"):
            c.drawString((x0 + 4) * MM, yy * MM, ligne); yy -= 4.6
        c.setLineWidth(.6)
        c.line(x0 * MM, 40 * MM, (PAGE_W - 8) * MM, 40 * MM)
        c.line((x0 + 38) * MM, 8 * MM, (x0 + 38) * MM, 40 * MM)
        c.line(x0 * MM, 24 * MM, (x0 + 38) * MM, 24 * MM)
        c.setFont(FONT, 6.5)
        c.drawString((x0 + 3) * MM, 36 * MM, "ÉCHELLE"); c.drawString((x0 + 3) * MM, 20 * MM, "DATE")
        c.drawString((x0 + 41) * MM, 36 * MM, "FEUILLE")
        c.setFont(FONT_B, 8.5); c.drawString((x0 + 3) * MM, 29 * MM, self.echelle_txt)
        c.setFont(FONT, 8); c.drawString((x0 + 3) * MM, 13 * MM, d["date"])
        c.setFont(FONT_B, 22); c.drawCentredString((x0 + 61) * MM, 21 * MM, self.numero)
        c.setFont(FONT, 6.5); c.drawCentredString((x0 + 61) * MM, 13 * MM, f"Dossier {d['code']}")
        # Concepteur
        c.setFont(FONT, 6.5); c.drawString((x0 + 4) * MM, 51.5 * MM, "CONÇU PAR")
        c.setFont(FONT_B, 8.5); c.drawString((x0 + 4) * MM, 47.6 * MM, AUTEUR)
        # Mention obligatoire
        c.setFont(FONT_B, 6.2); c.setFillColor(HexColor("#b00020"))
        c.drawString((x0 + 4) * MM, 44 * MM, "DESSIN À DES FINS D'ENSEIGNEMENT —")
        c.drawString((x0 + 4) * MM, 41.4 * MM, "NE PAS UTILISER POUR LA CONSTRUCTION")
        c.setFillColor(black)

    def notes(self, titre, lignes, y_top=None, size=7):
        """Bloc de notes dans la colonne de droite."""
        c = self.c; x0 = 348
        y = (y_top if y_top is not None else self.zone_notes_haut)
        c.setFont(FONT_B, 8); c.drawString((x0 + 4) * MM, y * MM, titre); y -= 4.5
        c.setFont(FONT, size)
        for l in lignes:
            for i, part in enumerate(wrap(l, 52 if size <= 7 else 46)):
                c.drawString((x0 + 4 + (3 if i else 0)) * MM, y * MM, part); y -= size * 0.5
            y -= 0.8
        self.zone_notes_haut = y - 3
        if y < 77: print(f"  ! notes trop longues sur {self.numero} ({self.dossier['code']}) : y = {y:.0f} mm")
        return y

    def titre_vue(self, x_mm, y_mm, numero, texte, echelle):
        c = self.c
        c.setFillColor(black); c.circle((x_mm + 4) * MM, (y_mm + 1.5) * MM, 4 * MM, fill=0)
        c.setFont(FONT_B, 9); c.drawCentredString((x_mm + 4) * MM, (y_mm + 0.3) * MM, str(numero))
        c.setFont(FONT_B, 10); c.drawString((x_mm + 10) * MM, (y_mm + 1.6) * MM, texte)
        c.setLineWidth(.8); c.line((x_mm + 10) * MM, (y_mm + 0.6) * MM, (x_mm + 10 + len(texte) * 2.1) * MM, (y_mm + 0.6) * MM)
        c.setFont(FONT, 7.5); c.drawString((x_mm + 10) * MM, (y_mm - 3.2) * MM, "Échelle " + echelle)

    def nord(self, x_mm, y_mm, r=7):
        c = self.c; cx, cy = x_mm * MM, y_mm * MM; R = r * MM
        c.setLineWidth(.8); c.circle(cx, cy, R)
        p = c.beginPath(); p.moveTo(cx, cy + R * .95); p.lineTo(cx - R * .35, cy - R * .5); p.lineTo(cx, cy - R * .2); p.close()
        c.setFillColor(black); c.drawPath(p, fill=1, stroke=1)
        p = c.beginPath(); p.moveTo(cx, cy + R * .95); p.lineTo(cx + R * .35, cy - R * .5); p.lineTo(cx, cy - R * .2); p.close()
        c.setFillColor(white); c.drawPath(p, fill=1, stroke=1); c.setFillColor(black)
        c.setFont(FONT_B, 9); c.drawCentredString(cx, cy + R + 2.5 * MM, "N")

    def barre_echelle(self, x_mm, y_mm, N, longueur_m=None):
        c = self.c
        if longueur_m is None:
            longueur_m = 5 if N <= 50 else 10 if N <= 100 else 20 if N <= 200 else 50
        seg = longueur_m / 5
        for i in range(5):
            w = seg * 1000 / N
            c.setFillColor(black if i % 2 == 0 else white)
            c.rect((x_mm + i * w) * MM, y_mm * MM, w * MM, 1.6 * MM, fill=1, stroke=1)
        c.setFillColor(black); c.setFont(FONT, 6.5)
        for i in range(6):
            c.drawCentredString((x_mm + i * seg * 1000 / N) * MM, (y_mm + 2.6) * MM, fmt(i * seg) if seg >= 1 else str(round(i * seg, 1)).replace(".", ","))
        c.drawString((x_mm + longueur_m * 1000 / N + 2) * MM, (y_mm + 0.2) * MM, "m")

    # ---------- primitives à l'échelle ----------
    def ligne(self, x1, y1, x2, y2, w=0.6, col=black, dash=None):
        c = self.c; c.setStrokeColor(col); c.setLineWidth(w)
        c.setDash(dash) if dash else c.setDash()
        c.line(*self.P(x1, y1), *self.P(x2, y2)); c.setDash(); c.setStrokeColor(black)

    def poly(self, pts, w=0.6, col=black, dash=None, close=False, fill=None):
        c = self.c; c.setStrokeColor(col); c.setLineWidth(w)
        c.setDash(dash) if dash else c.setDash()
        p = c.beginPath(); p.moveTo(*self.P(*pts[0]))
        for q in pts[1:]: p.lineTo(*self.P(*q))
        if close: p.close()
        if fill is not None: c.setFillColor(fill)
        c.drawPath(p, stroke=1, fill=1 if fill is not None else 0)
        c.setDash(); c.setStrokeColor(black); c.setFillColor(black)

    def rect(self, x0, y0, x1, y1, w=0.6, col=black, fill=None, dash=None):
        self.poly([(x0, y0), (x1, y0), (x1, y1), (x0, y1)], w, col, dash, True, fill)

    def cercle(self, x, y, r, w=0.6, col=black, fill=None):
        c = self.c; c.setStrokeColor(col); c.setLineWidth(w)
        if fill is not None: c.setFillColor(fill)
        c.circle(*self.P(x, y), self.L(r), stroke=1, fill=1 if fill is not None else 0)
        c.setStrokeColor(black); c.setFillColor(black)

    def texte(self, x, y, t, size=7, bold=False, align="c", col=black, rot=0):
        c = self.c; c.setFillColor(col); c.setFont(FONT_B if bold else FONT, size)
        px, py = self.P(x, y)
        c.saveState(); c.translate(px, py); c.rotate(rot)
        lignes = t.split("\n")
        for i, l in enumerate(lignes):
            yy = -i * size * 1.15 + (len(lignes) - 1) * size * 0.575 - size * 0.35
            if align == "c": c.drawCentredString(0, yy, l)
            elif align == "g": c.drawString(0, yy, l)
            else: c.drawRightString(0, yy, l)
        c.restoreState(); c.setFillColor(black)

    def hachures(self, x0, y0, x1, y1, pas=150, ang=45, col=GRIS_C, w=0.3):
        """Hachures dans un rectangle (pas en mm modèle)."""
        c = self.c; c.saveState()
        p = c.beginPath(); p.rect(*self.P(x0, y0), self.L(x1 - x0), self.L(y1 - y0)); c.clipPath(p, stroke=0, fill=0)
        c.setStrokeColor(col); c.setLineWidth(w)
        L_ = max(x1 - x0, y1 - y0) * 2
        t = math.tan(math.radians(ang))
        n = int((x1 - x0 + y1 - y0) / pas) + 4
        for i in range(-n, n):
            xs = x0 + i * pas
            c.line(*self.P(xs, y0), *self.P(xs + (y1 - y0) / t, y1))
        c.restoreState()

    # ---------- cotation ----------
    def cote(self, a, b, decal, txt=None, orient="h", size=6.5):
        """Cote entre deux points sur un axe. orient 'h' : a,b = x ; decal = y de la ligne de cote.
        orient 'v' : a,b = y ; decal = x de la ligne de cote."""
        c = self.c; c.setLineWidth(.35); c.setStrokeColor(black)
        t = fmt(abs(b - a)) if txt is None else txt
        tick = 1.2 * MM
        if orient == "h":
            p1, p2 = self.P(a, decal), self.P(b, decal)
            c.line(p1[0] - tick * .6, p1[1], p2[0] + tick * .6, p2[1])
            for p in (p1, p2):
                c.line(p[0] - tick * .7, p[1] - tick * .7, p[0] + tick * .7, p[1] + tick * .7)
                c.line(p[0], p[1] - tick * 1.2, p[0], p[1] + tick * 1.2)
            c.setFont(FONT, size); c.drawCentredString((p1[0] + p2[0]) / 2, p1[1] + .9 * MM, t)
        else:
            p1, p2 = self.P(decal, a), self.P(decal, b)
            c.line(p1[0], p1[1] - tick * .6, p2[0], p2[1] + tick * .6)
            for p in (p1, p2):
                c.line(p[0] - tick * .7, p[1] - tick * .7, p[0] + tick * .7, p[1] + tick * .7)
                c.line(p[0] - tick * 1.2, p[1], p[0] + tick * 1.2, p[1])
            c.saveState(); c.translate(p1[0] - .9 * MM, (p1[1] + p2[1]) / 2); c.rotate(90)
            c.setFont(FONT, size); c.drawCentredString(0, 0, t); c.restoreState()

    def chaine(self, pts, decal, orient="h", total=True, decal_total=None):
        pts = sorted(pts)
        for a, b in zip(pts, pts[1:]):
            if b - a > 1: self.cote(a, b, decal, orient=orient)
        if total and len(pts) > 2:
            self.cote(pts[0], pts[-1], decal_total if decal_total is not None else decal + (900 if decal > 0 else -900) * self.N / 50, orient=orient)

    def bulle_grille(self, x, y, lettre, r_mm=3.2):
        c = self.c; px, py = self.P(x, y)
        c.setLineWidth(.5); c.setFillColor(white); c.circle(px, py, r_mm * MM, fill=1); c.setFillColor(black)
        c.setFont(FONT_B, 7.5); c.drawCentredString(px, py - 2.6, lettre)

    def grille(self, xs, ys, x_min, x_max, y_min, y_max, ext=1600):
        """Axes de grille : xs (lettres) et ys (chiffres)."""
        lettres = "ABCDEFGHJKLM"
        k = self.N / 50
        for i, x in enumerate(xs):
            self.ligne(x, y_min - ext * k, x, y_max + ext * k, .3, GRIS_C, dash=[6, 2, 1, 2])
            self.bulle_grille(x, y_max + ext * k + 180 * k, lettres[i])
        for j, y in enumerate(ys):
            self.ligne(x_min - ext * k, y, x_max + ext * k, y, .3, GRIS_C, dash=[6, 2, 1, 2])
            self.bulle_grille(x_min - ext * k - 180 * k, y, str(j + 1))

    # ---------- tableaux (nomenclatures) ----------
    def tableau(self, x_mm, y_mm, titre, entetes, lignes, largeurs, h=4.6, size=6.6):
        c = self.c
        W = sum(largeurs)
        c.setFont(FONT_B, 8.5); c.drawString(x_mm * MM, (y_mm + 2) * MM, titre)
        y = y_mm
        c.setLineWidth(.6); c.setFillColor(GRIS_TC); c.rect(x_mm * MM, (y - h) * MM, W * MM, h * MM, fill=1); c.setFillColor(black)
        xx = x_mm
        c.setFont(FONT_B, size)
        for e, w in zip(entetes, largeurs):
            c.drawString((xx + 1.2) * MM, (y - h + 1.4) * MM, e); xx += w
        y -= h
        c.setFont(FONT, size)
        for row in lignes:
            xx = x_mm
            c.setLineWidth(.3); c.rect(x_mm * MM, (y - h) * MM, W * MM, h * MM)
            for v, w in zip(row, largeurs):
                c.drawString((xx + 1.2) * MM, (y - h + 1.4) * MM, str(v)); xx += w
            y -= h
        xx = x_mm
        for w in largeurs[:-1]:
            xx += w; c.setLineWidth(.3); c.line(xx * MM, y_mm * MM, xx * MM, y * MM)
        c.setLineWidth(.6); c.rect(x_mm * MM, y * MM, W * MM, (y_mm - y) * MM)
        return y


def wrap(t, n):
    mots, out, cur = t.split(), [], ""
    for m in mots:
        if len(cur) + len(m) + 1 > n and cur:
            out.append(cur); cur = m
        else:
            cur = (cur + " " + m).strip()
    if cur: out.append(cur)
    return out or [""]
