# -*- coding: utf-8 -*-
"""Feuille A-302 : coupe longitudinale, coupe de mur type et légende des matériaux."""
import math
from dessin import *

# ------------------------------------------------------------------ motifs de matériaux
BOIS_C = HexColor("#f3e6c8")
ISO_C = HexColor("#fff3b0")


def motif(f, style, x0, y0, x1, y1, w=.5):
    """Remplit un rectangle (coordonnées modèle) avec le motif normalisé du matériau."""
    if x1 < x0: x0, x1 = x1, x0
    if y1 < y0: y0, y1 = y1, y0
    if x1 - x0 <= 0 or y1 - y0 <= 0: return
    k = f.N                     # 1 mm papier = k mm modèle
    if style == "beton":
        f.rect(x0, y0, x1, y1, w, fill=HexColor("#d4d4d4")); f.hachures(x0, y0, x1, y1, 1.8 * k, 45, GRIS, .3)
        import random
        rnd = random.Random(int(x0 * 7 + y0 * 3))
        for _ in range(int((x1 - x0) * (y1 - y0) / (2.2 * k) ** 2)):
            f.cercle(rnd.uniform(x0, x1), rnd.uniform(y0, y1), .18 * k, .2, GRIS, fill=GRIS)
    elif style == "terre":
        f.hachures(x0, y0, x1, y1, 1.4 * k, 135, GRIS_C, .3)
    elif style == "brique":
        f.rect(x0, y0, x1, y1, w, fill=HexColor("#f0d9cc")); f.hachures(x0, y0, x1, y1, .9 * k, 45, HexColor("#9c5a3c"), .3)
    elif style == "bloc":
        f.rect(x0, y0, x1, y1, w, fill=HexColor("#e2e2e2")); f.hachures(x0, y0, x1, y1, 1.6 * k, 45, GRIS, .3); f.hachures(x0, y0, x1, y1, 1.6 * k, 135, GRIS, .3)
        f.rect(x0, y0, x1, y1, w)
    elif style == "isolant_rigide":
        f.rect(x0, y0, x1, y1, w, fill=HexColor("#eef6ff")); f.hachures(x0, y0, x1, y1, .7 * k, 45, HexColor("#5b8fd6"), .2); f.hachures(x0, y0, x1, y1, .7 * k, 135, HexColor("#5b8fd6"), .2)
        f.rect(x0, y0, x1, y1, w)
    elif style == "laine":
        f.rect(x0, y0, x1, y1, w, fill=ISO_C)
        vert = (y1 - y0) >= (x1 - x0)
        ep = (x1 - x0) if vert else (y1 - y0); lg = (y1 - y0) if vert else (x1 - x0)
        pas = max(ep * .55, 1.2 * k); n = max(2, int(lg / pas))
        pts = []
        for i in range(n + 1):
            a = (y0 if vert else x0) + lg * i / n
            b = (x0 + ep * .1) if i % 2 == 0 else (x0 + ep * .9)
            if not vert: b = (y0 + ep * .1) if i % 2 == 0 else (y0 + ep * .9)
            pts.append((b, a) if vert else (a, b))
        f.poly(pts, .35, HexColor("#b08a00"))
    elif style == "bois":
        f.rect(x0, y0, x1, y1, w, fill=BOIS_C); f.ligne(x0, y0, x1, y1, .3); f.ligne(x0, y1, x1, y0, .3)
    elif style == "panneau":
        f.rect(x0, y0, x1, y1, w, fill=HexColor("#e6cf9a"))
    elif style == "gypse":
        f.rect(x0, y0, x1, y1, w, fill=HexColor("#f4f4f4"))
        if (x1 - x0) > 3 * k and (y1 - y0) > 3 * k:
            for i in range(int((x1 - x0) / (1.6 * k))):
                for j in range(int((y1 - y0) / (1.6 * k))):
                    f.cercle(x0 + (i + .5) * 1.6 * k, y0 + (j + .5) * 1.6 * k, .12 * k, .2, GRIS_C, fill=GRIS_C)
    elif style == "pierre":
        f.rect(x0, y0, x1, y1, w, fill=white)
        r = .45 * k; i = 0; yy = y0 + r * 1.2
        while yy < y1 - r * .8:
            xx = x0 + r * (1.2 + (i % 2));
            while xx < x1 - r * .8:
                f.cercle(xx, yy, r * .8, .25, GRIS); xx += r * 2.3
            yy += r * 2; i += 1
    elif style == "acier":
        f.rect(x0, y0, x1, y1, w, fill=HexColor("#3a3a3a"))
    elif style == "vinyle":
        f.rect(x0, y0, x1, y1, w, fill=white)
        vert = (y1 - y0) >= (x1 - x0)
        if vert:
            z = y0
            while z < y1: f.ligne(x0, z, x1, z + 1.2 * k * .3, .25); z += 1.2 * k
    elif style == "vide":
        f.rect(x0, y0, x1, y1, .2, GRIS_C, fill=white)
    else:
        f.rect(x0, y0, x1, y1, w, fill=white)


LEGENDE = [("beton", "Béton coulé"), ("terre", "Sol naturel (terre)"), ("pierre", "Pierre concassée, pierre nette"),
           ("brique", "Brique d'argile"), ("bloc", "Bloc de béton"), ("isolant_rigide", "Isolant rigide (panneau)"),
           ("laine", "Isolant en natte (laine)"), ("bois", "Bois de charpente coupé"), ("panneau", "Contreplaqué ou OSB"),
           ("gypse", "Plaque de plâtre (gypse)"), ("acier", "Acier"), ("vide", "Lame d'air, vide")]


# ------------------------------------------------------------------ étiquettes avec rappels
def etiquettes(f, items, x_lab, z_min, z_max, size=5.4, larg=36):
    """items = [(texte, (x, z))]. Place les étiquettes en colonne à x_lab, sans chevauchement."""
    lh = size * 1.15 * 25.4 / 72 * f.N        # hauteur d'une ligne en modèle
    rows = []
    for (t, (x, z)) in items:
        lignes = wrap(t, larg)
        rows.append([z, lignes, x, z])
    rows.sort(key=lambda r: r[0])
    gap = .9 * f.N
    prev = None
    for r in rows:
        h = len(r[1]) * lh
        if prev is not None: r[0] = max(r[0], prev + gap + h / 2)
        r[0] = max(r[0], z_min + h / 2)
        prev = r[0] + h / 2
    over = (rows[-1][0] + len(rows[-1][1]) * lh / 2) - z_max if rows else 0
    if over > 0:
        for i in range(len(rows) - 1, -1, -1):
            r = rows[i]; h = len(r[1]) * lh
            lim = z_max if i == len(rows) - 1 else rows[i + 1][0] - len(rows[i + 1][1]) * lh / 2 - gap
            r[0] = min(r[0], lim - h / 2)
    for (zl, lignes, x, z) in rows:
        f.cercle(x, z, .45 * f.N, .3, fill=black)
        f.poly([(x, z), (x_lab - 1.5 * f.N, zl), (x_lab - .5 * f.N, zl)], .3)
        f.texte(x_lab, zl, "\n".join(lignes), size, False, "g")


# ------------------------------------------------------------------ feuille
def feuille_coupes(self, c):
    cl = self.coupe_long
    f = Feuille(c, self.dossier, "A-302", "COUPE LONGITUDINALE,\nCOUPE DE MUR ET MATÉRIAUX", f"1:{cl['N']} et 1:{self._N_mur()}")
    droite = self._coupe_longitudinale(f)
    self._coupe_mur(f, max(206, droite + 8))
    self._legende_materiaux(f)
    f.notes("À OBSERVER", ["La coupe B est prise sur la ligne B du plan A-101, en regardant dans le sens des flèches.",
                           "Ce qui est coupé est dessiné en trait fort et hachuré ; ce qui est vu au-delà est en trait fin.",
                           "La coupe de mur montre l'ordre des couches, de l'extérieur vers l'intérieur.",
                           "Comparer les niveaux avec ceux des élévations (A-201) et de la coupe A (A-301)."])
    f.notes("COMPOSITIONS", self.compositions)
    c.showPage()


def _N_mur(self):
    H = self._z_haut_mur() - (self.z_semelle - 300)
    for N in (20, 25, 30, 40, 50):
        if H / N <= 205: return N
    return 50


def _z_haut_mur(self):
    if self.toit == "pignon": return self.z_murs + 89 + 1300 * self.pente + 400
    return self.z_murs + self.parapet + 250


# ------------------------------------------------------------------ coupe longitudinale
def _coupe_longitudinale(self, f):
    cl = self.coupe_long; N = cl["N"]; yc = cl["y"]
    W, D, t = self.W, self.D, self.t
    z0, zp, zm, zf = self.z_sol, self.z_plancher, self.z_murs, self.z_semelle
    ox = DRAW[0] + 4 + 1000 / N
    oy = 150 - (zf - 300) / N
    f.vue(ox, oy, N)
    k = N / 100
    # terrain
    f.ligne(-1000, z0, 0, z0, 1.2); f.ligne(W, z0, W + 1000, z0, 1.2)
    f.hachures(-1000, zf - 300, 0, z0, 1.4 * N, 135, GRIS_C); f.hachures(W, zf - 300, W + 1000, z0, 1.4 * N, 135, GRIS_C)
    # fondations
    tf = self.t_fond
    for x in (0, W - tf):
        f.rect(x - 200, zf, x + tf + 200, zf + 250, .7, fill=HexColor("#cfcfcf"))
        f.rect(x, zf + 250, x + tf, zp - self.ep_plancher, .8, fill=HexColor("#cfcfcf"))
        f.hachures(x, zf + 250, x + tf, zp - self.ep_plancher, 1.2 * N, 45, GRIS, .3)
    if self.toit == "plat" or self.type_plancher == "dalle":
        f.rect(tf, zp - self.ep_plancher, W - tf, zp, .6, fill=HexColor("#cfcfcf"))
        f.rect(tf, zp - self.ep_plancher - 200, W - tf, zp - self.ep_plancher, .3, fill=white); f.hachures(tf, zp - self.ep_plancher - 200, W - tf, zp - self.ep_plancher, 1.0 * N, 30, GRIS_C)
    else:
        f.rect(tf, zp - self.ep_plancher, W - tf, zp, .5, fill=white)
        x = tf + 200
        while x < W - tf - 100:
            f.rect(x, zp - self.ep_plancher, x + 38, zp - 16, .3, fill=BOIS_C); x += 400
        f.rect(tf, zp - 16, W - tf, zp, .3, fill=HexColor("#e6cf9a"))
        f.rect(tf, zf + 250, W - tf, zf + 330, .3, fill=HexColor("#e6e6e6"))
        f.texte(W * .5, (zf + 330 + zp - self.ep_plancher) / 2, "VIDE SANITAIRE", 5.5, True, col=GRIS)
    # hauteur du toit à la coupe
    if self.toit == "pignon":
        p = self.pente; ztop = zm + 89 + min(yc, D - yc) * p; zfaite = zm + D / 2 * p
    else:
        ztop = zm + 623; zfaite = zm + self.parapet
    # murs extérieurs coupés (avec ouvertures)
    ouv = {}
    for o in self.portes + self.fenetres:
        if o["axe"] == "v" and o["s"] <= yc <= o["s"] + o["w"]:
            ouv.setdefault(round(o["at"]), []).append(o)
    def mur_coupe(xa, xb, ztop_mur, fill, ouvs):
        trous = []
        for o in ouvs:
            if o in self.portes: trous.append((zp, zp + o.get("h", 2030)))
            else:
                ft = self.types_fen[o["type"]]; trous.append((zp + ft["allege"], zp + ft["allege"] + ft["h"]))
        zz = zp; segs = []
        for (a, b) in sorted(trous):
            if a > zz: segs.append((zz, a))
            zz = max(zz, b)
        segs.append((zz, ztop_mur))
        for (a, b) in segs:
            if b > a: f.rect(xa, a, xb, b, .8, fill=fill)
        for (a, b) in trous:
            f.ligne(xa, a, xa, b, .3); f.ligne(xb, a, xb, b, .3)
            if a > zp + 10: f.ligne((xa + xb) / 2, a, (xa + xb) / 2, b, .5)
    mur_coupe(0, t, ztop if self.toit == "pignon" else zm + self.parapet, GRIS, ouv.get(round(self.O), []))
    mur_coupe(W - t, W, ztop if self.toit == "pignon" else zm + self.parapet, GRIS, ouv.get(round(self.E), []))
    # murs intérieurs coupés
    coupes_x = [0, W]
    for (x1, y1, x2, y2, e) in self.murs_int:
        if x1 == x2 and min(y1, y2) <= yc <= max(y1, y2):
            haut = ztop if (e >= 200 and self.toit == "pignon") else (self.z_plafond + (150 if self.toit == "plat" else 0))
            if self.toit == "pignon" and e < 200: haut = zm
            mur_coupe(x1 - e / 2, x1 + e / 2, haut, GRIS if e >= 200 else GRIS_TC, ouv.get(round(x1), []))
            coupes_x.append(x1)
    # ce qu'on voit au-delà (ouvertures du premier mur horizontal au nord de la coupe)
    murs_h = [(0, W, self.N_)] + [(min(x1, x2), max(x1, x2), y1) for (x1, y1, x2, y2, e) in self.murs_int if y1 == y2 and y1 > yc]
    for o in self.portes + self.fenetres:
        if o["axe"] != "h" or o["at"] <= yc: continue
        xm = o["s"] + o["w"] / 2
        devant = [m for m in murs_h if m[0] <= xm <= m[1] and yc < m[2] < o["at"] - 1]
        if devant: continue
        if o in self.portes:
            h = o.get("h", 2030); f.rect(o["s"], zp, o["s"] + o["w"], zp + h, .35)
            if o.get("genre") == "double": f.ligne(xm, zp, xm, zp + h, .25)
        else:
            ft = self.types_fen[o["type"]]; f.rect(o["s"], zp + ft["allege"], o["s"] + o["w"], zp + ft["allege"] + ft["h"], .35)
            f.rect(o["s"] + 60, zp + ft["allege"] + 60, o["s"] + o["w"] - 60, zp + ft["allege"] + ft["h"] - 60, .2)
    # poteaux et poutre vus au-delà
    for (x, y, sz, lab) in getattr(self, "poteaux", []):
        if y > yc and getattr(self, "grille_xy", None):
            f.rect(x - 76, zp, x + 76, zm - 360, .35, fill=HexColor("#efefef"))
    if getattr(self, "grille_xy", None):
        f.rect(t, zm - 360, W - t, zm, .35, fill=HexColor("#efefef")); f.texte(W * .27, zm - 180, "Poutre d'acier W360 (vue au-delà)", 5, col=GRIS)
    # plafond et toit
    if self.toit == "pignon":
        f.rect(t, zm, W - t, zm + 13, .4, fill=HexColor("#f4f4f4"))
        x = 600
        while x < W - 300:
            f.rect(x - 19, zm, x + 19, zm + 89, .3, fill=BOIS_C)
            f.rect(x - 19, ztop, x + 19, ztop + 140, .3, fill=BOIS_C); x += 600
        f.rect(t, zm + 89, W - t, zm + 89 + 350, .2, ISO_C, fill=ISO_C)
        f.ligne(0, ztop + 140, W, ztop + 140, .6); f.ligne(-self.debord * .3, ztop + 153, W + self.debord * .3, ztop + 153, 1.0)
        f.ligne(0, zfaite, W, zfaite, .5); f.ligne(0, ztop + 153, 0, zfaite, .3); f.ligne(W, ztop + 153, W, zfaite, .3)
        f.texte(W * .5, (ztop + zfaite) / 2 + 100, "Versant du toit vu au-delà — faîte", 5, col=GRIS)
        f.texte(W * .5, zm + 89 + 175, "Isolant soufflé entre les fermes", 5, col=HexColor("#8a6d00"))
    else:
        f.ligne(t, self.z_plafond, W - t, self.z_plafond, .6)
        x = 900
        while x < W - 300:
            f.rect(x - 40, zm + 400, x + 40, zm + 450, .3, fill=HexColor("#3a3a3a")); f.rect(x - 40, zm, x + 40, zm + 50, .3, fill=HexColor("#3a3a3a"))
            f.ligne(x, zm + 50, x, zm + 400, .2, GRIS, dash=[2, 2]); x += 1800
        f.rect(t, zm + 450, W - t, zm + 488, .4, fill=HexColor("#9a9a9a"))
        f.rect(t, zm + 488, W - t, zm + 613, .3, fill=HexColor("#eef6ff")); f.hachures(t, zm + 488, W - t, zm + 613, .7 * N, 45, HexColor("#5b8fd6"), .2)
        f.rect(t, zm + 613, W - t, zm + 623, .4, fill=black)
        for x in (0, W - t): f.rect(x - 40, zm + self.parapet, x + t + 40, zm + self.parapet + 60, .5, fill=HexColor("#777"))
        if getattr(self, "unite_toit", None):
            f.rect(8800, zm + 623, 11200, zm + 623 + 1300, .4, dash=[3, 2]); f.texte(10000, zm + 623 + 650, "UT-1 (vue au-delà)", 5)
        f.texte(W * .5, zm + 225, "Poutrelles ajourées coupées, 1 800 c/c", 5, col=GRIS)
    # locaux
    for (no, nom, x0, y0, x1, y1) in self.locaux:
        if y0 <= yc <= y1:
            zpl = zm if self.toit == "pignon" else self.z_plafond
            hp = max([o.get("h", 2030) for o in self.portes] + [2030])
            f.texte((x0 + x1) / 2, (zp + hp + zpl) / 2, nom.replace("\n", " ").upper() + f" {no}", 4.8, True, col=GRIS)
    # grille d'axes
    if getattr(self, "grille_xy", None):
        for i, x in enumerate(self.grille_xy[0]):
            f.ligne(x, zf - 700, x, zfaite + 300, .3, GRIS_C, dash=[6, 2, 1, 2]); f.bulle_grille(x, zf - 700 - 3.4 * N, "ABCDEFGH"[i], 2.8)
    # cotes et niveaux
    f.chaine(sorted(set(coupes_x)), zf - 350, "h", total=False)
    niv = sorted(self.niveaux, key=lambda n: n[2] if n[2] != "faite" else 1e9); dernier = -1e9
    for (nom, val, z) in niv:
        zz = z if z != "faite" else zfaite
        zt = max(zz, dernier + 2.6 * N); dernier = zt
        f.ligne(W + 2 * N, zz, W + 9 * N, zz, .3, dash=[3, 1.5]); f.texte(W + 10 * N, zt, f"{nom} {val}", 5.4, True, "g")
    f.titre_vue(DRAW[0] + 4, 136, cl.get("lettre", "B"), "COUPE B — LONGITUDINALE", f"1:{N}")
    return ox + (W + 10 * N) / N + 22


# ------------------------------------------------------------------ coupe de mur type
def _coupe_mur(self, f, x_papier):
    N = self._N_mur()
    z0, zp, zm, zf = self.z_sol, self.z_plancher, self.z_murs, self.z_semelle
    tf = self.t_fond
    couches = self.couches_mur
    T = sum(e for (_, e, _) in couches)
    ox = x_papier + 900 / N
    x_lab_papier = 297
    xmax = (x_lab_papier - 4 - ox) * N
    xmax = max(xmax, T + 500)
    oy = DRAW[1] + 26 - (zf - 300) / N
    f.vue(ox, oy, N)
    pts = []
    # sol extérieur, drain
    motif(f, "terre", -900, zf - 300, 0, z0)
    f.ligne(-900, z0, 0, z0, 1.0)
    motif(f, "pierre", -560, zf, -150, zf + 420)
    f.cercle(-355, zf + 160, 55, .6, fill=white)
    pts.append(("Drain français Ø 100 dans la pierre nette", (-355, zf + 160)))
    pts.append(("Niveau du sol fini", (-650, z0)))
    # semelle et mur de fondation
    motif(f, "beton", -200, zf, tf + 200, zf + 250)
    ztf = zp - self.ep_plancher if self.type_plancher == "solives" else zp
    motif(f, "beton", 0, zf + 250, tf, ztf)
    pts.append((f"Semelle de béton {fmt(tf + 400)} × 250", (tf + 120, zf + 125)))
    pts.append((f"Mur de fondation, béton {fmt(tf)}", (tf / 2, (zf + z0) / 2)))
    # plancher
    if self.type_plancher == "solives":
        motif(f, "bois", 0, ztf, 140, ztf + 38)
        motif(f, "bois", 0, ztf + 38, 38, zp - 16)
        f.rect(38, ztf + 38, xmax, zp - 16, .4, fill=BOIS_C)
        motif(f, "panneau", 0, zp - 16, xmax, zp)
        motif(f, "beton", tf, zf + 250, xmax, zf + 330)
        pts.append(("Lisse d'assise et solive de rive", (19, (ztf + zp) / 2)))
        pts.append(("Solives 38 × 235 à 400 c/c (vue de côté)", (xmax * .7, (ztf + zp) / 2)))
        pts.append(("Contreplaqué 15,9 collé-vissé", (xmax * .45, zp - 8)))
        pts.append(("Dalle de béton 75 sur polyéthylène (vide sanitaire)", (xmax * .6, zf + 290)))
    else:
        e = self.ep_plancher
        motif(f, "beton", tf, zp - e, xmax, zp)
        motif(f, "isolant_rigide", tf, zp - e - 50, xmax, zp - e)
        motif(f, "pierre", tf, zp - e - 250, xmax, zp - e - 50)
        pts.append((f"Dalle de béton {fmt(e)}", (xmax * .6, zp - e / 2)))
        pts.append(("Isolant rigide 50 et polyéthylène", (xmax * .45, zp - e - 25)))
        pts.append(("Pierre concassée compactée", (xmax * .75, zp - e - 150)))
    # couches du mur
    ztop_mur = zm if self.toit == "pignon" else zm + self.parapet
    x = 0; mur_pts = []
    zlo, zhi = zp + 300, (zm if self.toit == "pignon" else self.z_plafond) - 300
    for i, (nom, e, st) in enumerate(couches):
        if e <= 0:
            f.ligne(x, zp, x, zm, .9, dash=[3, 1.5]); mur_pts.append((nom, x))
            continue
        motif(f, st, x, zp, x + e, ztop_mur)
        mur_pts.append((nom, x + e / 2)); x += e
    if self.type_plancher == "solives":
        motif(f, "bois", T - 140 - 13, zp, T - 13, zp + 38)
    n = len(mur_pts)
    for i, (nom, xx) in enumerate(mur_pts):
        pts.append((nom, (xx, zhi - (zhi - zlo) * (i + .5) / n)))
    # toit
    if self.toit == "pignon":
        p = self.pente; ov = self.debord; Tt = T - 13
        motif(f, "bois", T - 153, zm - 76, T - 13, zm)       # sablières
        zc = lambda xx: zm + 89 + (xx - 0) * p                # dessous de la membrure supérieure
        f.rect(0, zm, xmax, zm + 89, .5, fill=BOIS_C)
        f.poly([(-ov, zc(-ov)), (xmax, zc(xmax)), (xmax, zc(xmax) + 140 / math.cos(math.atan(p))), (-ov, zc(-ov) + 140 / math.cos(math.atan(p)))], .5, close=True, fill=BOIS_C)
        dz = 140 / math.cos(math.atan(p))
        f.poly([(-ov, zc(-ov) + dz), (xmax, zc(xmax) + dz), (xmax, zc(xmax) + dz + 13), (-ov, zc(-ov) + dz + 13)], .4, close=True, fill=HexColor("#e6cf9a"))
        f.poly([(-ov - 20, zc(-ov) + dz + 13), (xmax, zc(xmax) + dz + 13), (xmax, zc(xmax) + dz + 33), (-ov - 20, zc(-ov) + dz + 33)], .4, close=True, fill=HexColor("#555"))
        f.rect(T, zm - 13, xmax, zm, .4, fill=HexColor("#f4f4f4"))
        xs = max(T + 150, (350 + 60) / p)
        iso = [(T, zm + 89), (xmax, zm + 89), (xmax, zm + 89 + 350), (min(xs, xmax), zm + 89 + 350), (T + 100, zc(T + 100) - 60)]
        f.poly(iso, .3, HexColor("#b08a00"), close=True, fill=ISO_C)
        f.ligne(-ov, zc(-ov) - 10, -ov, zm - ov * p * .2, .6)
        f.ligne(-ov, zm - ov * p * .2, 0, zm - ov * p * .2, .6)
        pts += [("Bardeaux d'asphalte, membrane de sous-couche", (xmax * .55, zc(xmax * .55) + dz + 23)),
                ("Contreplaqué 12,7", (xmax * .3, zc(xmax * .3) + dz + 6)),
                ("Ferme de toit à 600 c/c (membrure supérieure)", (xmax * .78, zc(xmax * .78) + dz / 2)),
                ("Isolant soufflé R-41", (xmax * .7, zm + 89 + 200)),
                ("Membrure inférieure de la ferme", (xmax * .88, zm + 45)),
                ("Double sablière 38 × 140", (T - 83, zm - 38)),
                ("Pare-vapeur et gypse 12,7 au plafond", (xmax * .5, zm - 6)),
                ("Soffite ventilé et fascia", (-ov * .5, zm - ov * p * .2))]
    else:
        zt = zm
        f.poly([(T, zt), (xmax, zt), (xmax, zt + 50), (T, zt + 50)], .4, close=True, fill=HexColor("#3a3a3a"))
        f.poly([(T, zt + 400), (xmax, zt + 400), (xmax, zt + 450), (T, zt + 450)], .4, close=True, fill=HexColor("#3a3a3a"))
        xx = T + 100; up = True
        while xx < xmax - 200:
            f.ligne(xx, zt + 50 if up else zt + 400, xx + 300, zt + 400 if up else zt + 50, .4); xx += 300; up = not up
        motif(f, "acier", T, zt + 450, xmax, zt + 488)
        motif(f, "isolant_rigide", T, zt + 488, xmax, zt + 613)
        f.rect(T, zt + 613, xmax, zt + 623, .4, fill=black)
        f.poly([(T, zt + 623), (T, zm + self.parapet - 100)], 1.0)
        f.poly([(-60, zm + self.parapet - 250), (-60, zm + self.parapet + 40), (T + 60, zm + self.parapet + 40), (T + 60, zm + self.parapet - 200)], 1.0, HexColor("#444"))
        zc_ = self.z_plafond
        f.rect(T + 100, zc_ - 16, xmax, zc_, .4, fill=HexColor("#f4f4f4"))
        for xh in (T + 500, T + 1300):
            if xh < xmax: f.ligne(xh, zc_, xh, zt, .25, GRIS, dash=[1.5, 1.5])
        pts += [("Membrane élastomère 2 plis, remontée sur le parapet", (xmax * .55, zt + 618)),
                ("Isolant rigide R-30 en pente", (xmax * .7, zt + 550)),
                ("Platelage d'acier 38", (xmax * .45, zt + 469)),
                ("Poutrelle ajourée (membrures et treillis d'acier)", (xmax * .85, zt + 425)),
                ("Solin métallique sur le parapet", (T / 2, zm + self.parapet + 40)),
                ("Plafond suspendu, tuiles 600 × 1 200", (xmax * .6, zc_ - 8))]
    # coupure (trait de rupture) côté intérieur
    zb, zh = zf - 300, self._z_haut_mur()
    zz = zb; pp = []
    while zz < zh:
        pp += [(xmax, zz), (xmax + 60, zz + 120), (xmax - 60, zz + 240)]; zz += 360
    f.poly(pp, .4, GRIS)
    # étiquettes
    etiquettes(f, pts, xmax + 3.5 * N, zf - 250, zh + 200, size=5.2, larg=int((340 - x_lab_papier) / 1.25))
    f.titre_vue(x_papier - 4, DRAW[1] + 6, 2, "COUPE DE MUR TYPE", f"1:{N}")


# ------------------------------------------------------------------ légende des matériaux
def _legende_materiaux(self, f):
    f.vue(0, 0, 1)
    x0, ytop = DRAW[0] + 4, 120
    f.texte(x0, ytop, "LÉGENDE DES MATÉRIAUX EN COUPE", 8, True, "g")
    cols, sw, sh = 3, 16, 9
    for i, (st, nom) in enumerate(LEGENDE):
        cx = x0 + (i % cols) * 62; cy = ytop - 8 - (i // cols) * 14
        motif(f, st, cx, cy - sh, cx + sw, cy)
        f.texte(cx + sw + 3, cy - sh / 2, nom, 6.5, False, "g")
