# -*- coding: utf-8 -*-
"""Feuilles civiles pour le dossier 4 (centre commercial) :
C-101 Plan de nivellement et de drainage pluvial · C-102 Profils de terrain et réseau pluvial.
Le terrain est un modèle numérique : terrain existant zE(x, y) et terrain projeté zP (grille de 500 mm),
dessinés en courbes de niveau (marching squares)."""
import math
from collections import deque
from dessin import *

# ------------------------------------------------------------------ données du site (mm, origine = coin sud-ouest du lot)
LOT = (90000, 72000)
BAT = (25000, 32000, 65000, 50000)          # bâtiment
FFE = 103.90                                # plancher fini
PARK = (4000, 2500, 68000, 29000)           # stationnement
TROT = (23000, 29000, 67000, 32000)         # trottoir devant les commerces
VOIE = (16000, 29000, 23000, 50000)         # voie de service (côté ouest)
COUR = (16000, 50000, 65000, 62000)         # cour de service
QUAI = (25000, 50000, 31000, 61000)         # quai de réception (en contrebas)
BASSIN = (71000, 2500, 88000, 26000)        # bassin de rétention (dessus de talus)
FOND = 100.40                               # fond du bassin (talus 3H:1V depuis la crête 102,30)
INSET = (102.30 - FOND) * 3000
ENTREES = [(5500, 0, 12500, 2500), (58500, 0, 65500, 2500)]
CB = {  # puisards : position, dépression locale
    "P-1": (20000, 6500), "P-2": (40000, 6500), "P-3": (60000, 6500), "P-4": (40000, 20000),
    "P-5": (45000, 55500), "P-6": (28000, 51200), "P-8": (19500, 53500), "P-7": (19500, 31000)}
ETIQ_CB = {"P-1": (800, 1300, "g"), "P-2": (800, 1300, "g"), "P-3": (800, 2300, "g"), "P-4": (800, 1300, "g"), "P-5": (800, 1300, "g"),
           "P-6": (1200, 2400, "g"), "P-7": (-800, 1300, "d"), "P-8": (-800, 1300, "d"), "RD-1": (-800, -1900, "d")}
RESEAU = [("P-5", "P-6", 300), ("P-6", "P-8", 300), ("P-8", "P-7", 300), ("P-7", "P-1", 375), ("P-1", "P-2", 375), ("P-4", "P-2", 300),
          ("P-2", "P-3", 450), ("P-3", "RD-1", 450)]
RD1 = (70500, 6500)          # regard d'entrée du bassin
RC1 = (86500, 4500)          # ouvrage de régulation (sortie du bassin)
EGOUT = (86500, -6000)       # égout pluvial municipal


def zE(x, y):
    """Terrain existant : pente générale vers le sud-est, petite ondulation."""
    return 101.90 + 3.70 * (max(y, 0) / 72000) ** 1.1 - 0.0045 * (x / 1000) + 0.16 * math.sin(x / 14000) * math.sin(y / 17000)


def dans(r, x, y):
    return r[0] <= x <= r[2] and r[1] <= y <= r[3]


def z_pave(x, y):
    """Surface projetée des zones aménagées (None = gazon, raccordé au terrain existant)."""
    if dans(BAT, x, y): return FFE - 0.15
    if dans(QUAI, x, y): return 102.75 + 0.10 * (y - 50000) / 1000
    if dans(TROT, x, y): return 103.82 - 0.02 * (32000 - y) / 1000 - 0.0012 * abs(x - 45000) / 1000
    z = None
    if dans(PARK, x, y) or any(dans(e, x, y) for e in ENTREES):
        z = 102.20 + 0.040 * (max(y, 2500) - 2500) / 1000 + 0.0065 * (68000 - min(x, 68000)) / 1000
        if y < 2500: z -= 0.02 * (2500 - y) / 1000
    elif dans(VOIE, x, y): z = 103.45 + 0.35 * (y - 29000) / 21000
    elif dans(COUR, x, y): z = 103.80 + 0.015 * (y - 50000) / 1000 + 0.003 * abs(x - 45000) / 1000
    if z is not None:
        for k, (cx, cy) in CB.items():
            d = math.hypot(x - cx, y - cy)
            if d < 5000: z -= 0.09 * (1 - d / 5000) ** 1.4         # cuvette autour du puisard
    return z


def z_bassin(x, y):
    x0, y0, x1, y1 = BASSIN
    if not dans(BASSIN, x, y): return None
    d = min(x - x0, x1 - x, y - y0, y1 - y)          # distance au bord du talus
    return max(FOND, 102.30 - d / 3000)               # talus 3H:1V jusqu'au fond


class Terrain:
    def __init__(self, pas=500):
        self.pas = pas
        self.nx, self.ny = LOT[0] // pas + 1, LOT[1] // pas + 1
        self.E = [[zE(i * pas, j * pas) for i in range(self.nx)] for j in range(self.ny)]
        P = [[None] * self.nx for _ in range(self.ny)]
        src = deque(); dist = [[None] * self.nx for _ in range(self.ny)]; val = [[None] * self.nx for _ in range(self.ny)]
        for j in range(self.ny):
            for i in range(self.nx):
                x, y = i * pas, j * pas
                z = z_pave(x, y)
                if z is None: z = z_bassin(x, y)
                if z is not None:
                    P[j][i] = z; dist[j][i] = 0; val[j][i] = z; src.append((i, j))
        while src:                      # distance au bord aménagé le plus proche (raccord au terrain existant)
            i, j = src.popleft()
            for di, dj in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                a, b = i + di, j + dj
                if 0 <= a < self.nx and 0 <= b < self.ny and dist[b][a] is None:
                    dist[b][a] = dist[j][i] + 1; val[b][a] = val[j][i]; src.append((a, b))
        R = 6000 / pas
        for j in range(self.ny):
            for i in range(self.nx):
                if P[j][i] is None:
                    w = min(1, dist[j][i] / R); w = w * w * (3 - 2 * w)
                    P[j][i] = val[j][i] + (self.E[j][i] - val[j][i]) * w
        self.P = P

    def z(self, grille, x, y):
        i = min(max(x / self.pas, 0), self.nx - 1.001); j = min(max(y / self.pas, 0), self.ny - 1.001)
        i0, j0 = int(i), int(j); fx, fy = i - i0, j - j0
        g = grille
        return (g[j0][i0] * (1 - fx) * (1 - fy) + g[j0][i0 + 1] * fx * (1 - fy) + g[j0 + 1][i0] * (1 - fx) * fy + g[j0 + 1][i0 + 1] * fx * fy)

    def courbes(self, grille, niveau, masque=None):
        """Segments de la courbe de niveau (marching squares)."""
        segs, p = [], self.pas
        for j in range(self.ny - 1):
            for i in range(self.nx - 1):
                x, y = i * p, j * p
                if masque and masque(x + p / 2, y + p / 2): continue
                v = [grille[j][i], grille[j][i + 1], grille[j + 1][i + 1], grille[j + 1][i]]
                pts = [(x, y), (x + p, y), (x + p, y + p), (x, y + p)]
                cr = []
                for k in range(4):
                    a, b = v[k], v[(k + 1) % 4]
                    if (a - niveau) * (b - niveau) < 0:
                        t = (niveau - a) / (b - a); (xa, ya), (xb, yb) = pts[k], pts[(k + 1) % 4]
                        cr.append((xa + (xb - xa) * t, ya + (yb - ya) * t))
                if len(cr) == 2: segs.append(cr)
                elif len(cr) == 4: segs += [cr[:2], cr[2:]]
        return segs


def v2(z):
    return f"{z:.2f}".replace(".", ",")


def radiers():
    """Radiers du réseau pluvial (pente minimale, recouvrement ≥ 1,2 m)."""
    T = TERRAIN
    pos = dict(CB); pos["RD-1"] = RD1
    cr = {k: T.z(T.P, *xy) for k, xy in pos.items()}
    inv = {"P-5": cr["P-5"] - 1.45, "P-4": cr["P-4"] - 1.40}
    tron = []
    for a, b, d in RESEAU:
        L = math.hypot(pos[a][0] - pos[b][0], pos[a][1] - pos[b][1]) / 1000
        pente = 0.005 if d >= 375 else 0.008
        ia = inv[a]
        ib = ia - L * pente
        if b in inv: ib = min(ib, inv[b])
        ib = min(ib, cr[b] - 1.20 - d / 1000)          # recouvrement minimal 1,2 m
        inv[b] = ib
        tron.append((a, b, d, L, (ia - ib) / L * 100, ia, ib))
    return pos, cr, inv, tron


TERRAIN = Terrain()


def fleche_pente(f, x, y, ang, txt, L=5000, col=black):
    a = math.radians(ang); dx, dy = math.cos(a) * L / 2, math.sin(a) * L / 2
    f.ligne(x - dx, y - dy, x + dx, y + dy, .7, col)
    hx, hy = x + dx, y + dy; b = math.radians(ang + 155); c_ = math.radians(ang - 155)
    f.poly([(hx, hy), (hx + math.cos(b) * 900, hy + math.sin(b) * 900), (hx + math.cos(c_) * 900, hy + math.sin(c_) * 900)], .4, col, close=True, fill=col)
    f.texte(x - math.sin(a) * 700, y + math.cos(a) * 700, txt, 5.6, True, "c", col, rot=ang if -90 <= ang <= 90 else ang - 180)


def point_cote(f, x, y, zp, ze=None, align="g", col=black):
    f.ligne(x - 300, y - 300, x + 300, y + 300, .5, col); f.ligne(x - 300, y + 300, x + 300, y - 300, .5, col)
    dx = 450 if align == "g" else -450
    f.texte(x + dx, y + 260, v2(zp), 5.6, True, align, col)
    if ze is not None: f.texte(x + dx, y - 650, f"({v2(ze)})", 4.8, False, align, GRIS)


def feuille_nivellement(self, c):
    T = TERRAIN; N = 400
    f = Feuille(c, self.dossier, "C-101", "PLAN DE NIVELLEMENT\nET DE DRAINAGE PLUVIAL", f"1:{N}")
    LW, LD = LOT
    x0 = DRAW[0] + ((DRAW[2] - DRAW[0]) - LW / N) / 2 + 6; y0 = DRAW[1] + 10500 / N + 20
    f.vue(x0, y0, N)
    VERT, BRUN = HexColor("#3a7d44"), HexColor("#8a5a2b")
    # rue
    f.rect(-3000, -10500, LW + 3000, -1500, 0, fill=HexColor("#e6e6e6"))
    f.ligne(-3000, -6000, LW + 3000, -6000, .4, GRIS, dash=[6, 4])
    f.texte(LW * 0.33, -8300, "CHEMIN DE LA CÔTE", 8, True, col=GRIS)
    f.rect(-3000, -1500, LW + 3000, 0, .3, fill=HexColor("#f0f0f0"))
    # zones aménagées
    PAV = HexColor("#efefef")
    for r in (PARK, TROT, VOIE, COUR, *ENTREES):
        f.rect(*r, .0, fill=PAV)
    f.rect(*QUAI, 0, fill=HexColor("#e2e2e2"))
    f.rect(*BASSIN, .5, VERT, fill=HexColor("#eef6ee"))
    bx0, by0, bx1, by1 = BASSIN
    f.rect(bx0 + INSET, by0 + INSET, bx1 - INSET, by1 - INSET, .5, VERT, fill=HexColor("#dcecdc"), dash=[3, 2])
    # bordures de béton
    for r in (PARK, TROT, VOIE, COUR):
        f.rect(*r, .9)
    f.rect(*QUAI, .9)
    # îlots plantés du stationnement
    for xi in (24500, 44500):
        for (ya, yb) in ((4000, 9500), (15000, 26500)):
            f.rect(xi - 1200, ya, xi + 1200, yb, .6, fill=HexColor("#e3f0e3")); f.cercle(xi, (ya + yb) / 2, 1100, .4, VERT)
    # cases
    for (ya, sens) in ((4000, 1), (15000, 1), (21000, 1)):
        for k in range(22):
            xa = 6000 + k * 2700
            if 23300 < xa + 1350 < 25700 or 43300 < xa + 1350 < 45700: continue
            f.rect(xa, ya, xa + 2700, ya + 5500, .25, GRIS)
    for xa in (30200, 32900, 48500, 51200):
        f.texte(xa + 1350, 23700, "PMR", 4.6, True, col=HexColor("#1f6fc2"))
    # bornes de recharge pour véhicules électriques (au bout des cases, rangée du haut)
    VEc = HexColor("#0a8f5a")
    for k in (2, 3, 4, 5, 13, 14):
        xa = 6000 + k * 2700
        f.rect(xa + 1000, 26250, xa + 1700, 26750, .5, VEc, fill=HexColor("#d4f1e3")); f.texte(xa + 1350, 25300, "VE", 4.4, True, col=VEc)
    f.texte(13500, 27700, "Bornes de recharge VE (6)", 4.8, True, col=VEc)
    f.texte(24500, 10300, "Îlots-noues\n(biorétention)", 4.6, True, col=VERT)
    # supports à vélos et place publique devant les commerces
    for k in range(6):
        f.ligne(23600 + k * 450, 30200, 23600 + k * 450, 31200, .6, GRIS)
    f.texte(26800, 30700, "Vélos (12)", 4.6, True, "g", GRIS)
    for (bx, by) in ((41000, 30500), (49000, 30500)):
        f.rect(bx - 900, by - 250, bx + 900, by + 250, .4, fill=HexColor("#c8925a"))
    f.texte(45000, 30650, "Bancs", 4.4, False, col=GRIS)
    # existant : courbes pointillées grises
    niv_e = [101.25 + 0.25 * k for k in range(19)]
    for zn in niv_e:
        maj = abs(zn - round(zn)) < 1e-6
        for (a, b) in T.courbes(T.E, zn):
            f.ligne(a[0], a[1], b[0], b[1], .45 if maj else .25, HexColor("#8c8c8c"), dash=[2, 1.6])
        if maj:
            for xl in (1800, 88200):
                yl = next((yy for yy in range(0, LD, 100) if zE(xl, yy) >= zn), None)
                if yl: f.rect(xl - 1500, yl - 450, xl + 1500, yl + 450, 0, white, fill=white); f.texte(xl, yl, v2(zn), 5, False, col=HexColor("#6f6f6f"))
    # projeté : courbes continues (pas dans le bâtiment)
    masque = lambda x, y: dans(BAT, x, y)
    niv_p = [101.25 + 0.25 * k for k in range(19)]
    for zn in niv_p:
        maj = abs(zn * 2 - round(zn * 2)) < 1e-6
        segs = T.courbes(T.P, zn, masque)
        for (a, b) in segs:
            f.ligne(a[0], a[1], b[0], b[1], .75 if maj else .4, BRUN)
        if maj and segs:
            # étiquette sur le segment le plus près d'un point de lecture choisi
            for (qx, qy) in ((14000, 0), (55000, 0), (79500, 0)):
                cand = [s for s in segs if abs((s[0][0] + s[1][0]) / 2 - qx) < 2500]
                if not cand: continue
                s = min(cand, key=lambda s: abs((s[0][0] + s[1][0]) / 2 - qx))
                mx, my = (s[0][0] + s[1][0]) / 2, (s[0][1] + s[1][1]) / 2
                if dans(BAT, mx, my): continue
                f.rect(mx - 1400, my - 420, mx + 1400, my + 420, 0, white, fill=white); f.texte(mx, my, v2(zn), 5.2, True, col=BRUN)
    # bâtiment
    f.rect(*BAT, 1.4, fill=HexColor("#d9d9d9"))
    f.hachures(*BAT, 1500, 45, GRIS_C)
    f.rect(*BAT, 1.4)
    f.texte(45000, 42500, "CENTRE COMMERCIAL", 8, True)
    f.texte(45000, 40200, f"PLANCHER FINI (PF) {v2(FFE)}", 7, True)
    f.texte(45000, 38300, "Sol fini au pied des murs : 103,75 minimum", 5.6)
    f.texte(45000, 36500, "Toit blanc et panneaux solaires 120 kW", 5.2, False, col=GRIS)
    for (x, s) in ((30000, "Épicerie"), (38000, "Pharmacie"), (46000, "Restaurant"), (52500, "Boutique A"), (57500, "Boutique B")):
        f.texte(x + 1500, 33300, s, 5, col=GRIS)
    # murs de soutènement du quai
    for xm in (QUAI[0], QUAI[2]):
        f.rect(xm - 150, 50000, xm + 150, 58500, .6, fill=black)
    f.texte(QUAI[0] - 400, 57300, "Mur de soutènement\nHM 104,05 · BM 102,85", 5, True, "d")
    f.texte((QUAI[0] + QUAI[2]) / 2, 59300, "QUAI DE RÉCEPTION\n(en contrebas, pente 10 %)", 5.2, True)
    # talus au nord de la cour
    for xt in range(17000, 64500, 1500):
        f.ligne(xt, 62000, xt, 62900 if (xt // 1500) % 2 else 63700, .35, BRUN)
    f.texte(40000, 64700, "TALUS 3H:1V — raccord au terrain existant", 5.2, True, col=BRUN)
    # bassin de rétention
    f.texte((bx0 + bx1) / 2, by1 + 4200, "BASSIN DE RÉTENTION (sec, gazonné)", 6, True, col=VERT)
    f.texte((bx0 + bx1) / 2, by1 + 2000, "Fond 100,40 · Crête 102,30 · Talus 3H:1V\nVolume utile ≈ 380 m³", 5.2, False, col=VERT)
    f.rect(bx0 + 6000, by0 - 300, bx0 + 11000, by0 + 300, .8, VERT, fill=HexColor("#cfe5cf"))
    f.texte(bx0 + 8500, by0 - 1300, "Déversoir d'urgence 102,10 (enrochement)", 5, True, col=VERT)
    # réseau pluvial
    pos, cr, inv, tron = radiers()
    PL = HexColor("#1b5fa8")
    for (a, b, d, L, p, ia, ib) in tron:
        (xa, ya), (xb, yb) = pos[a], pos[b]
        f.ligne(xa, ya, xb, yb, 1.3, PL)
        mx, my = (xa + xb) / 2, (ya + yb) / 2; ang = math.degrees(math.atan2(yb - ya, xb - xa))
        rot = ang if -90 <= ang <= 90 else ang - 180
        f.texte(mx - math.sin(math.radians(ang)) * 800, my + math.cos(math.radians(ang)) * 800, f"Ø {d} PEHD · {L:.0f} m · {p:.2f} %".replace(".", ","), 4.8, True, "c", PL, rot=rot)
    f.ligne(*RD1, BASSIN[0] + INSET, RD1[1], 1.3, PL)
    f.ligne(BASSIN[2] - INSET, RC1[1], *RC1, 1.3, PL)
    f.ligne(*RC1, *EGOUT, 1.3, PL, dash=[5, 2])
    for k, (x, y) in pos.items():
        f.rect(x - 500, y - 500, x + 500, y + 500, .8, PL, fill=white)
        f.ligne(x - 500, y - 500, x + 500, y + 500, .4, PL)
        ex, ey, al = ETIQ_CB.get(k, (800, 1300, "g"))
        f.rect(x + ex - (0 if al == "g" else (8000 if k == "RD-1" else 5200)), y + ey - 1100, x + ex + (5200 if al == "g" else 0) + (0 if k != "RD-1" else 0), y + ey + 1000, 0, white, fill=white)
        f.texte(x + ex, y + ey, f"{k}{' regard d’entrée' if k == 'RD-1' else ''}  CR {v2(cr[k])}\nR {v2(inv[k])}", 4.9, True, al, PL)
    f.cercle(*RC1, 700, .9, PL, fill=white); f.rect(RC1[0] - 9800, RC1[1] + 1000, RC1[0] - 900, RC1[1] + 3000, 0, white, fill=white); f.texte(RC1[0] - 1000, RC1[1] + 2000, "RC-1 Régulateur de débit\n(orifice Ø 100)", 4.9, True, "d", PL)
    f.cercle(*EGOUT, 700, .9, PL, fill=white); f.texte(EGOUT[0] - 1000, EGOUT[1] + 200, "Égout pluvial municipal Ø 600\nRaccord : radier 99,95", 4.9, True, "d", PL)
    # drain français du bâtiment
    f.poly([(BAT[0] - 600, BAT[1] - 600), (BAT[2] + 600, BAT[1] - 600), (BAT[2] + 600, BAT[3] + 600), (BAT[0] - 600, BAT[3] + 600)], .4, PL, dash=[1.5, 1.5], close=True)
    f.texte(BAT[2] + 900, 41000, "Drain français\nautour du bâtiment\nvers P-7", 4.8, False, "g", PL)
    # pentes
    fleche_pente(f, 33000, 12500, -90, "4,0 %", 5500, BRUN); fleche_pente(f, 54000, 12500, -90, "4,0 %", 5500, BRUN)
    fleche_pente(f, 12000, 18000, 0, "0,65 %", 5500, BRUN)
    fleche_pente(f, 36000, 30500, -90, "2,0 %", 2400, BRUN)
    fleche_pente(f, 19500, 41000, -90, "1,7 %", 5000, BRUN)
    fleche_pente(f, 28000, 58500, -90, "10 %", 4000, BRUN)
    fleche_pente(f, 55000, 59000, -90, "1,5 %", 3500, BRUN)
    # points cotés (projeté + existant entre parenthèses)
    for (x, y, al) in ((4500, 3000, "g"), (67500, 3000, "d"), (4500, 28500, "g"), (67500, 28500, "d"), (23500, 31500, "g"), (66500, 31500, "d"),
                       (16500, 49500, "g"), (16500, 61500, "g"), (64500, 61500, "d"), (30500, 50400, "d"), (9000, 1200, "g"), (62000, 1200, "g")):
        point_cote(f, x, y, T.z(T.P, x, y), zE(x, y), al)
    for (x, y) in ((79500, 14300),):
        point_cote(f, x, y, FOND, None, "g", VERT)
    # équipements
    for (x, y) in ((14000, 12000), (34000, 12000), (54000, 12000), (14000, 27500), (34000, 27500), (54000, 27500)):
        f.cercle(x, y, 450, .5); f.ligne(x - 650, y, x + 650, y, .4); f.ligne(x, y - 650, x, y + 650, .4)
    f.texte(14700, 10800, "Lampadaire DEL 9 m (6)", 4.8, False, "g")
    f.rect(66200, 44000, 68800, 46500, .8, ELEC, fill=HexColor("#fde8d6")); f.texte(69200, 45200, "Transformateur\nsur socle (Hydro)", 4.8, True, "g", ELEC)
    f.cercle(35000, -900, 500, .8, HexColor("#c0392b"), fill=HexColor("#f5b7b1")); f.texte(35800, -700, "Borne d'incendie", 4.8, True, "g", HexColor("#c0392b"))
    # repère de nivellement
    f.poly([(1200, -500), (1900, 700), (500, 700)], .7, close=True, fill=HexColor("#ffd54f"))
    f.texte(2300, -300, "RN-1 : clou dans le poteau\nd'Hydro, 102,384 (géodésique)", 4.8, True, "g")
    # arbres existants conservés
    for (ax, ay, r) in ((2500, 40000, 2500), (2500, 55000, 2500), (2500, 68000, 2500), (88000, 40000, 2500), (88000, 55000, 2500), (88000, 68000, 2500),
                        (40000, 69500, 2000), (55000, 69500, 2000), (70000, 69500, 2000)):
        f.cercle(ax, ay, r, .5, VERT); f.cercle(ax, ay, r * .15, .5, VERT)
    # lignes de coupe pour C-102
    def ligne_coupe(xa, ya, xb, yb, lettre):
        f.ligne(xa, ya, xb, yb, .9, HexColor("#c0392b"), dash=[8, 2, 2, 2])
        for (x, y, s) in ((xa, ya, lettre), (xb, yb, lettre + "'")):
            f.cercle(x, y, 900, .9, HexColor("#c0392b"), fill=white); f.texte(x, y, s, 6.5, True, col=HexColor("#c0392b"))
    ligne_coupe(45000, -4500, 45000, 70500, "A")
    ligne_coupe(-1500, 14000, 89500, 14000, "B")
    # lot
    f.poly([(0, 0), (LW, 0), (LW, LD), (0, LD)], 1.0, close=True, dash=[10, 3, 2, 3])
    f.texte(LW / 2, LD + 1800, "LIMITE DU LOT 6 512 340", 6.5, True)
    f.nord(DRAW[2] - 16, DRAW[3] - 18)
    f.titre_vue(DRAW[0] + 4, DRAW[1] + 6, 1, "PLAN DE NIVELLEMENT ET DE DRAINAGE", f"1:{N}")
    f.barre_echelle(DRAW[0] + 4, DRAW[1] + 26, N, 20)
    f.notes("NOTES DE NIVELLEMENT", [
        "Altitudes en mètres (géodésique). Point de référence : RN-1.",
        "Plancher fini 103,90; sol fini 150 mm plus bas au pied des murs, pente de 2 % à l'écart sur 1,5 m minimum.",
        "Stationnement : enrobé, pentes entre 1 % et 5 %. Cuvettes de 90 mm autour des puisards.",
        "Quai de réception en contrebas (1,0 m) : drain de tranchée P-6 et murs de soutènement.",
        "Talus de gazon 3H:1V maximum. Terre végétale 150 mm.",
        "Bassin sec : débit de sortie limité à 20 L/s (règlement municipal fictif); récurrence 1 / 100 ans.",
        "Réseau pluvial : PEHD intérieur lisse, recouvrement ≥ 1,2 m (gel).",
        "Coupes A-A' et B-B' : voir C-102."], size=6.6)
    f.notes("LÉGENDE", [
        "— — —  Courbe existante (gris, aux 0,25 m)",
        "———  Courbe projetée (brun, aux 0,25 m; gras aux 0,50 m)",
        "×  102,45  Point coté projeté; (102,61) existant",
        "Flèche + %  Sens et pente de l'écoulement",
        "Carré bleu : puisard (CR couvercle, R radier)",
        "Trait bleu : conduite pluviale, Ø · longueur · pente",
        "Triangle jaune : repère de nivellement",
        "Cercle à croix : lampadaire · PMR : case réservée"], size=6.4)
    c.showPage()


def feuille_profils(self, c):
    T = TERRAIN
    f = Feuille(c, self.dossier, "C-102", "PROFILS DE TERRAIN\nET RÉSEAU PLUVIAL", "H 1:400 · V 1:100")
    NH, NV = 400, 100
    ROUGE, VERTC = HexColor("#f6c7c0"), HexColor("#cfe8cf")
    BRUN = HexColor("#8a5a2b")

    def profil(ox, oy, L, z_bas, z_haut, fn_xy, titre, num, reperes, stations=10000):
        """Profil : abscisse 0..L (mm), altitude z. ox, oy en mm papier (coin bas-gauche de la grille)."""
        X = lambda s: (ox + s / NH) * MM
        Y = lambda z: (oy + (z - z_bas) * 1000 / NV) * MM
        cv = f.c
        # grille
        cv.setLineWidth(.2); cv.setStrokeColor(HexColor("#cfcfcf"))
        zz = z_bas
        while zz <= z_haut + 1e-6:
            cv.line(X(0), Y(zz), X(L), Y(zz))
            cv.setFillColor(GRIS); cv.setFont(FONT, 5.2); cv.drawRightString(X(0) - 1.2 * MM, Y(zz) - 1.8, v2(zz)); cv.setFillColor(black)
            zz += 0.5
        s = 0
        while s <= L + 1:
            cv.line(X(s), Y(z_bas), X(s), Y(z_haut)); s += stations
        cv.setStrokeColor(black)
        # déblais et remblais
        pas = 250
        for k in range(int(L / pas)):
            s0, s1 = k * pas, (k + 1) * pas
            e0, p0 = fn_xy(s0); e1, p1 = fn_xy(s1)
            if p0 is None or p1 is None: continue
            col = ROUGE if (p0 + p1) < (e0 + e1) else VERTC
            pth = cv.beginPath(); pth.moveTo(X(s0), Y(e0)); pth.lineTo(X(s1), Y(e1)); pth.lineTo(X(s1), Y(p1)); pth.lineTo(X(s0), Y(p0)); pth.close()
            cv.setFillColor(col); cv.drawPath(pth, stroke=0, fill=1)
        cv.setFillColor(black)
        # existant (pointillé) et projeté (trait fort)
        for qui, w, col, dash in ((0, .7, HexColor("#777777"), [3, 2]), (1, 1.3, BRUN, None)):
            cv.setLineWidth(w); cv.setStrokeColor(col); cv.setDash(dash) if dash else cv.setDash()
            pth = cv.beginPath(); premier = True
            for k in range(int(L / pas) + 1):
                v = fn_xy(k * pas)[qui]
                if v is None: premier = True; continue
                if premier: pth.moveTo(X(k * pas), Y(v)); premier = False
                else: pth.lineTo(X(k * pas), Y(v))
            cv.drawPath(pth, stroke=1, fill=0)
        cv.setDash(); cv.setStrokeColor(black)
        # repères (bâtiment, bordures, etc.)
        for (s, z, txt, haut) in reperes:
            cv.setLineWidth(.4); cv.line(X(s), Y(z), X(s), Y(z) + haut * MM)
            cv.setFont(FONT_B, 5.2); cv.drawCentredString(X(s), Y(z) + (haut + 1.2) * MM, txt)
        # tableau des stations
        rows = [("Chaînage", lambda s: f"0+{int(s / 1000):03d}"), ("Terrain existant", lambda s: v2(fn_xy(s)[0])),
                ("Terrain projeté", lambda s: v2(fn_xy(s)[1]) if fn_xy(s)[1] is not None else "—"),
                ("Déblai (–) / remblai (+)", lambda s: (f"{fn_xy(s)[1] - fn_xy(s)[0]:+.2f}".replace(".", ",")) if fn_xy(s)[1] is not None else "—")]
        yb = oy - 4
        for r, (nom, fn) in enumerate(rows):
            yy = yb - r * 4.2
            cv.setFont(FONT_B, 5.4); cv.drawRightString(X(0) - 6 * MM, (yy - 1) * MM, nom)
            cv.setLineWidth(.2); cv.line(X(0), (yy - 2.4) * MM, X(L), (yy - 2.4) * MM)
            s = 0; cv.setFont(FONT, 5.2)
            while s <= L + 1:
                cv.drawCentredString(X(s), (yy - 1) * MM, fn(s)); s += stations
        cv.setLineWidth(.6); cv.rect(X(0), Y(z_bas), (L / NH) * MM, (z_haut - z_bas) * 1000 / NV * MM)
        f.titre_vue(ox - 2, yb - 4 * 4.2 - 9, num, titre, "H 1:400 · V 1:100 (exagération × 4)")

    # Profil A-A' : nord-sud à x = 45 000, du centre de la rue (y = -6 000) au fond du lot
    def fa(s):
        y = s - 6000; x = 45000
        if y < 0:
            z = 101.80 if y > -1500 else 101.62          # trottoir, puis chaussée
            return (z, z)
        if dans(BAT, x, y): return (zE(x, y), FFE)
        return (zE(x, y), T.z(T.P, x, y))
    profil(DRAW[0] + 30, DRAW[1] + 190, 78000, 101.0, 106.0, fa, "PROFIL A-A' (NORD-SUD, AXE DU BÂTIMENT)", "A",
           [(6000, 101.62, "Rue", 6), (8500, T.z(T.P, 45000, 2500), "Bordure", 9), (21000, T.z(T.P, 45000, 15000), "Stationnement 4,0 %", 12),
            (35000, 103.80, "Trottoir 2 %", 9), (47000, FFE, "Bâtiment · PF 103,90", 8), (61500, T.z(T.P, 45000, 55500), "P-5 · cour de service", 8),
            (69500, zE(45000, 63500), "Talus 3H:1V", 7)])
    # Profil B-B' : est-ouest à y = 14 000 (stationnement et bassin)
    def fb(s):
        x = s; y = 14000
        return (zE(x, y), T.z(T.P, x, y))
    profil(DRAW[0] + 30, DRAW[1] + 112, 90000, 100.0, 104.0, fb, "PROFIL B-B' (EST-OUEST, STATIONNEMENT ET BASSIN)", "B",
           [(4000, T.z(T.P, 4000, 14000), "Bordure", 7), (24500, T.z(T.P, 24500, 14000), "Îlot", 6), (50000, T.z(T.P, 50000, 14000), "Stationnement 0,65 %", 9),
            (79500, FOND, "Fond du bassin 100,40", 5)])
    # tableaux du réseau pluvial
    pos, cr, inv, tron = radiers()
    lignes = [[k, v2(cr[k]), v2(inv[k]), f"{cr[k] - inv[k]:.2f}".replace(".", ","), "Puisard Ø 600 + grille" if k != "RD-1" else "Regard Ø 1 200 + décantation"]
              for k in sorted(cr, key=lambda k: (k[0], int(k.split("-")[1])))]
    y = f.tableau(DRAW[0] + 4, DRAW[1] + 62, "PUISARDS ET REGARDS", ["No", "Couvercle", "Radier", "Prof.", "Type"], lignes, [12, 16, 14, 11, 40], h=4.2, size=5.8)
    lignes = [[f"{a} → {b}", f"Ø {d}", f"{L:.1f}".replace(".", ","), f"{p:.2f} %".replace(".", ","), v2(ia), v2(ib)] for (a, b, d, L, p, ia, ib) in tron]
    f.tableau(DRAW[0] + 112, DRAW[1] + 62, "CONDUITES PLUVIALES (PEHD)", ["Tronçon", "Ø (mm)", "Long. (m)", "Pente", "Radier amont", "Radier aval"], lignes, [22, 13, 14, 13, 16, 15], h=4.2, size=5.8)
    f.notes("COMMENT LIRE UN PROFIL", [
        "Le profil est une coupe du terrain le long d'une ligne du plan C-101 (A-A' ou B-B').",
        "L'échelle verticale (1:100) est 4 fois plus grande que l'horizontale (1:400) : les pentes paraissent plus fortes.",
        "Trait pointillé gris : terrain existant. Trait brun : terrain projeté (après les travaux).",
        "Rouge : déblai (on enlève de la terre). Vert : remblai (on en ajoute).",
        "Chaînage 0+045 = 45 m depuis le début de la ligne.",
        "Déblai/remblai = projeté – existant, en mètres."], size=6.6)
    f.notes("À OBSERVER", [
        "Le bâtiment est « encastré » dans la pente : déblai au nord, remblai au sud.",
        "Le stationnement draine vers le sud et l'est, jusqu'au bassin de rétention.",
        "Chaque puisard : profondeur = couvercle – radier.",
        "Le débit qui sort du bassin est limité par l'orifice du régulateur RC-1."], size=6.6)
    c.showPage()
