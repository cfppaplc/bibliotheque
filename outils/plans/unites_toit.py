# -*- coding: utf-8 -*-
"""Unités de toit (RTU) réalistes : élévation, plan, détail du socle et feuille M-102 (installée sur Batiment).
Dimensions typiques d'exercice : 5, 10 et 15 tonnes de climatisation (1 tonne = 3,5 kW de refroidissement)."""
import math
from dessin import *
from meca import etiq, ROUGE, EAU_G, GRIS_P

CVC_A_ = HexColor("#0e7c86")
CAISSON, CAISSON_S = HexColor("#e4e7ea"), HexColor("#b9bfc4")
SPECS = {   # L (long), l (large), h (haut du caisson), kg, débit d'air en L/s, ventilateurs de condenseur, puissance chauffage (kW)
    5: dict(L=1900, l=1100, h=1000, kg=340, debit=940, vent=1, kw=18),
    10: dict(L=2600, l=1300, h=1150, kg=650, debit=1890, vent=2, kw=40),
    15: dict(L=3100, l=1700, h=1300, kg=950, debit=2830, vent=2, kw=54),
}
SOCLE = 400          # hauteur du socle (curb)
Z_TOIT = 620         # dessus du toit fini au-dessus du haut des murs (voir coupe de mur)


def spec(t): return SPECS.get(t, SPECS[10])


def rtu_elev(f, x0, zr, L, h, vent=2, rep="", crochets=True, coupe_toit=False):
    """Élévation avant d'une unité de toit; (x0, zr) = coin gauche, dessus du toit fini."""
    zc = zr + SOCLE
    if coupe_toit:
        f.rect(x0 - 1100, zr - 220, x0 + L + 1100, zr, .6, fill=HexColor("#f3efe3")); f.hachures(x0 - 1100, zr - 220, x0 + L + 1100, zr, 70, 45, GRIS_C, .2)
    f.rect(x0 - 70, zr, x0 + L + 70, zc, .8, fill=GRIS_TC)                        # socle
    f.ligne(x0 - 70, zr + 80, x0 + L + 70, zr + 80, .3, GRIS)
    f.rect(x0, zc, x0 + L, zc + h, 1.0, fill=CAISSON); f.rect(x0, zc, x0 + L, zc + 70, .6, fill=CAISSON_S)
    # économiseur (volet d'air frais) à gauche
    ha = h * .62
    f.poly([(x0 - 360, zc + h * .18), (x0, zc + h * .18), (x0, zc + h * .18 + ha), (x0 - 360, zc + h * .18 + ha * .72)], .8, close=True, fill=GRIS_P)
    for k in range(1, 6): f.ligne(x0 - 360, zc + h * .18 + ha * .72 * k / 6 - 0, x0, zc + h * .18 + ha * k / 6, .2, GRIS_C)
    # panneaux d'accès
    t3 = [x0 + L * i / 3 for i in range(4)]
    for x in t3[1:3]: f.ligne(x, zc + 70, x, zc + h, .5)
    for (a, b) in zip(t3, t3[1:]):
        f.rect(a + 45, zc + 120, b - 45, zc + h - 60, .3)
        f.rect((a + b) / 2 - 60, zc + h * .5, (a + b) / 2 + 60, zc + h * .5 + 150, .5, fill=white)      # poignée
    # grille de serpentin (louvres) sur le premier panneau
    for k in range(6): f.ligne(t3[0] + 90, zc + 200 + k * h * .12, t3[1] - 90, zc + 200 + k * h * .12, .25, GRIS)
    # plaque signalétique
    f.rect(t3[2] + 120, zc + h * .62, t3[2] + 520, zc + h * .62 + 140, .4, fill=white); f.texte(t3[2] + 320, zc + h * .62 + 70, rep or "UT", 5, True)
    # ventilateurs du condenseur (dessus)
    zt = zc + h
    for i in range(vent):
        cx = x0 + L * ((i + .5) / vent) * .96 + L * .02 + (L * .1 if vent == 2 else 0) * (0 if i == 0 else -1) * 0
        s = min(L / (vent * 2.6), 420)
        f.rect(cx - s, zt, cx + s, zt + 230, .8, fill=white)
        f.poly([(cx - s, zt + 230), (cx - s * .9, zt + 300), (cx + s * .9, zt + 300), (cx + s, zt + 230)], .8, close=True, fill=white)
        for j in range(-3, 4): f.ligne(cx + j * s / 3.6, zt + 230, cx + j * s / 3.6, zt + 300, .25, GRIS)
        f.ligne(cx - s * .9, zt + 300, cx + s * .9, zt + 300, .8)
    # sectionneur à droite
    f.rect(x0 + L, zc + h * .38, x0 + L + 140, zc + h * .38 + 240, .7, fill=white); f.ligne(x0 + L + 70, zc + h * .38 + 50, x0 + L + 70, zc + h * .38 + 190, .6)
    # oreilles de levage
    if crochets:
        for x in (x0 + 160, x0 + L - 160):
            f.poly([(x - 70, zt), (x + 70, zt), (x, zt + 190)], .6, close=True, fill=GRIS_P); f.cercle(x, zt + 95, 28, .5, fill=white)
    return dict(socle=(x0 + L * .5, zr + 200), caisson=(x0 + L * .5, zc + h * .3), fan=(x0 + L * .25, zt + 150), eco=(x0 - 180, zc + h * .45), sect=(x0 + L + 70, zc + h * .5),
                lug=(x0 + L - 160, zt + 100), nom=(t3[2] + 320, zc + h * .62 + 70), top=zt + 300, panneau=((t3[1] + t3[2]) / 2, zc + h * .5), louvre=(x0 + L / 6, zc + h * .3))


def rtu_plan(f, cx, cy, L, l, rep="", fans=2, degagement=True, cotes=False):
    """Plan d'une unité de toit; l'accès (panneaux) est au sud (y petit)."""
    x0, y0 = cx - L / 2, cy - l / 2
    f.rect(x0 - 70, y0 - 70, x0 + L + 70, y0 + l + 70, .5, dash=[3, 2])
    f.rect(x0, y0, x0 + L, y0 + l, 1.0, fill=CAISSON)
    f.rect(x0 - 360, y0 + l * .2, x0, y0 + l * .8, .7, fill=GRIS_P)
    f.ligne(x0 + L * .34, y0, x0 + L * .34, y0 + l, .4); f.ligne(x0 + L * .66, y0, x0 + L * .66, y0 + l, .4)
    for i in range(fans):
        x = x0 + L * (.2 + .6 * i / max(1, fans - 1)) if fans > 1 else x0 + L * .3
        r = min(l * .34, L / (fans * 2.8)); y = y0 + l * .55
        f.cercle(x, y, r, .8, fill=white); f.cercle(x, y, r * .15, .5, fill=GRIS_C)
        for a in range(0, 360, 60): f.ligne(x, y, x + r * .92 * math.cos(math.radians(a)), y + r * .92 * math.sin(math.radians(a)), .35, GRIS)
    f.rect(x0 + L + 40, y0 + l * .2, x0 + L + 190, y0 + l * .2 + 210, .6, fill=white)
    f.texte(x0 + L * .5, y0 + l * .13, rep, 6.2, True, "c", CVC_A_)
    if degagement:
        f.rect(x0 - 600, y0 - 1000, x0 + L + 600, y0, .4, GRIS_C, dash=[3, 2])
    if cotes:
        f.cote(x0, x0 + L, y0 + l + 380); f.cote(y0, y0 + l, x0 - 620, orient="v")
    return (x0, y0, x0 + L, y0 + l)


def sur_toit_elev(self, f, cote, L, zpar):
    """Unités de toit vues de côté, partiellement cachées par le parapet : on ne dessine que ce qui le dépasse."""
    unites = getattr(self, "unites_toit", None)
    if not unites: return False
    zr = self.z_murs + Z_TOIT
    c = f.c; c.saveState()
    p = c.beginPath(); xa, ya = f.P(-5000, zpar); xb, yb = f.P(L + 5000, zpar + 20000); p.rect(xa, ya, xb - xa, yb - ya); c.clipPath(p, stroke=0, fill=0)
    for (rep, t, cx, cy) in unites:
        s = spec(t)
        if cote == "S": x0, w = cx - s["L"] / 2, s["L"]
        elif cote == "N": x0, w = L - cx - s["L"] / 2, s["L"]
        elif cote == "E": x0, w = cy - s["l"] / 2, s["l"]
        else: x0, w = L - cy - s["l"] / 2, s["l"]
        rtu_elev(f, x0, zr, w, s["h"], s["vent"] if cote in "SN" else 1, rep, True)
    c.restoreState()
    return True


def feuille_toiture_unites(self, f, N):
    """Remplace le symbole générique du plan de toiture : unités à leur place, avec socles, dégagements et gaines."""
    for (rep, t, cx, cy) in self.unites_toit:
        s = spec(t)
        rtu_plan(f, cx, cy, s["L"], s["l"], "", s["vent"], True)
        f.texte(cx, cy - s["l"] / 2 - 1250 - 220 * N / 50, f"{rep} · {t} t", 5.6, True, "c", CVC_A_)


def feuille_unites(self, c):
    f = Feuille(c, self.dossier, "M-102", "UNITÉS DE TOIT :\nDÉTAILS ET SOCLE", "1:25, 1:30 et 1:18")
    unites = self.unites_toit
    ref = next(((r, t) for (r, t, *_x) in unites if t == 10), unites[0][:2])
    s = spec(ref[1]); L, h = s["L"], s["h"]
    # ---- 1. élévation (1:25)
    f.vue(DRAW[0] + 6, 172, 25)
    x0 = 600
    f.ligne(0, 0, x0 + L + 1100, 0, 1.2)
    g = rtu_elev(f, x0, 0, L, h, s["vent"], ref[0], True, True)
    f.rect(x0 + L * .5, -900, x0 + L * .78, -220, .6, CVC_A_, dash=[4, 2], fill=white); f.rect(x0 + L * .12, -900, x0 + L * .36, -220, .6, HexColor("#b05a1a"), dash=[4, 2], fill=white)
    f.texte(x0 + L * .64, -560, "SOUFFLAGE", 5, True, "c", CVC_A_); f.texte(x0 + L * .24, -560, "RETOUR", 5, True, "c", HexColor("#b05a1a"))
    etiq(f, "Économiseur", x0 - 150, 2150, *g["eco"])
    etiq(f, "Ventilateur du\ncondenseur", x0 + L * .3, 2250, *g["fan"])
    etiq(f, "Oreille de levage", x0 + L - 100, 2250, *g["lug"])
    etiq(f, "Sectionneur", x0 + L + 800, 1250, *g["sect"])
    etiq(f, "Socle (curb) isolé", x0 + L + 800, 300, x0 + L + 50, 220)
    etiq(f, "Plaque signalétique", x0 + L * .85, 2650, *g["nom"]) if False else None
    etiq(f, "Toit : tablier,\nisolant et membrane", x0 - 400, -450, x0 - 700, -110)
    f.vue(0, 0, 1); f.titre_vue(DRAW[0] + 6, 122, 1, f"ÉLÉVATION D'UNE UNITÉ DE {ref[1]} TONNES", "1:25")
    # ---- 2. plan (1:30)
    f.vue(DRAW[0] + 190, 140, 30)
    cx, cy = 1500, 1700
    rtu_plan(f, cx, cy, L, s["l"], ref[0], s["vent"], True, True)
    f.texte(cx, cy - s["l"] / 2 - 500, "DÉGAGEMENT D'ENTRETIEN : 1 000 MM", 5.5, True, "c", GRIS)
    etiq(f, "Économiseur", cx - L / 2 - 200, cy + s["l"] / 2 + 750, cx - L / 2 - 180, cy + 100)
    etiq(f, "Ventilateurs du\ncondenseur", cx + 300, cy + s["l"] / 2 + 950, cx + L * .2, cy + s["l"] * .1)
    etiq(f, "Sectionneur", cx + L / 2 + 800, cy + s["l"] / 2 + 700, cx + L / 2 + 120, cy - s["l"] / 2 + s["l"] * .3)
    etiq(f, "Contour du socle", cx - L / 2 - 800, cy - s["l"] / 2 - 700, cx - L / 2 - 60, cy - s["l"] / 2 - 60)
    f.vue(0, 0, 1); f.titre_vue(DRAW[0] + 190, 122, 2, f"PLAN D'UNE UNITÉ DE {ref[1]} TONNES", "1:30")
    # ---- 3. coupe du socle (1:18)
    N3 = 18
    f.vue(DRAW[0] + 14 + 300 / N3, 24 + 400 / N3, N3)
    dk = 38
    f.rect(-300, 0, 1300, dk, .7, fill=GRIS_TC)
    f.rect(-300, dk, 1300, dk + 150, .6, fill=HexColor("#f5ecc6")); f.hachures(-300, dk, 1300, dk + 150, 28, 45, GRIS, .2)
    f.rect(-300, dk + 150, 1300, dk + 162, .8, fill=black)
    zt = dk + 162
    f.rect(420, dk + 150, 560, dk + 340, .6, fill=HexColor("#e0c79a")); f.hachures(420, dk + 150, 560, dk + 340, 22, 45, GRIS, .25)
    f.rect(430, dk + 340, 480, dk + 340 + 480, .8, fill=white); f.rect(480, dk + 340, 500, dk + 340 + 480, .5, fill=HexColor("#f5ecc6"))
    f.ligne(-300, zt + 6, 300, zt + 6, 1.6); f.ligne(300, zt + 6, 428, dk + 340 + 340, 1.6)
    f.poly([(410, dk + 340 + 400), (410, dk + 340 + 200), (455, dk + 340 + 200)], .8, black, None, False)
    f.rect(430, dk + 340 + 480, 500, dk + 340 + 505, .5, fill=black)
    f.rect(380, dk + 340 + 505, 900, dk + 340 + 600, .8, fill=CAISSON_S)
    f.rect(380, dk + 340 + 600, 1300, dk + 340 + 720, .8, fill=CAISSON)
    f.rect(600, -400, 1250, dk, .8, fill=white); f.rect(620, -380, 1230, dk, .4, fill=HexColor("#fff3c4"))
    f.ligne(600, dk, 600, dk + 340 + 505, .6, dash=[4, 2]); f.ligne(1250, dk, 1250, dk + 340 + 505, .6, dash=[4, 2])
    etiq(f, "Tablier d'acier", -150, -330, -100, 15)
    etiq(f, "Isolant rigide", -150, 520, -100, 110)
    etiq(f, "Relevé de membrane\n(200 mm minimum)", -100, 780, 340, 640)
    etiq(f, "Bois de blocage", 1000, 340, 545, 280)
    etiq(f, "Solin de couronnement", -250, 1100, 410, 1000)
    etiq(f, "Paroi du socle isolée", 1100, 1000, 500, 800)
    etiq(f, "Joint d'étanchéité", 1050, 1180, 480, 1220)
    etiq(f, "Gaine isolée (soufflage ou retour)", 1300, -330, 1250, -260) if False else etiq(f, "Gaine isolée", 1550, -150, 1250, -100)
    f.vue(0, 0, 1); f.titre_vue(DRAW[0] + 6, 20, 3, "COUPE DU SOCLE ET RACCORD DE LA GAINE", "1:18")
    # ---- 4. tableau des unités
    rows = []
    for (rep, t, cx_, cy_) in unites:
        sp = spec(t)
        rows.append([rep, f"{t} t", f"{fmt(sp['L'])} × {fmt(sp['l'])} × {fmt(sp['h'] + SOCLE)}", f"{sp['kg']} kg", f"{sp['debit']} L/s", f"{sp['kw']} kW"])
    f.tableau(DRAW[0] + 150, 98, "NOMENCLATURE DES UNITÉS DE TOIT", ["Repère", "Capacité", "Dim. (L × l × h, mm)", "Poids", "Débit d'air", "Chauffage"], rows, [18, 18, 58, 20, 24, 22], h=5.0, size=6.6)
    f.notes("NOTES", ["Chaque unité repose sur un socle isolé de 400 mm, fixé à la structure; le relevé de membrane monte à 200 mm minimum.", "Un dégagement de 1 000 mm devant les panneaux d'accès est exigé pour l'entretien des filtres et des compresseurs.",
                      "Les gaines de soufflage et de retour traversent le tablier d'acier à l'intérieur du socle, avec bride et scellant.", "Sectionneur à portée de vue de l'unité; prises d'air frais à plus de 3 m des évents de plomberie.",
                      "Seul le dessus de l'unité dépasse le parapet : les élévations n'en montrent que la partie visible.", "Valeurs d'exercice : voir la fiche du fabricant."])
    c.showPage()


def installer(classe):
    classe.feuille_unites = feuille_unites
