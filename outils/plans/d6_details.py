# -*- coding: utf-8 -*-
"""Dossier 6 : détails de plomberie et de chauffage en gros plan (salle mécanique, chaudière, chauffe-eau, entrée d'eau, etc.).
Dessins originaux à l'échelle, avec repères et nomenclature. Produire : python3 d6_details.py"""
import os
from reportlab.pdfgen import canvas as rl_canvas
from dessin import *
from meca import *

DOSSIER = dict(projet="DÉTAILS MÉCANIQUES\nDOSSIER 6", adresse="Gros plans d'équipements\nSalle mécanique type", date="Novembre 2026", code="D6")
Y_TAB = DRAW[1] + 40          # haut de la nomenclature (papier, mm)


def nomenclature(f, titre, lignes, larg=(12, 80, 130), h=4.4):
    f.vue(0, 0, 1)
    return f.tableau(DRAW[0] + 4, Y_TAB, titre, ["Rep.", "Élément", "Description et caractéristiques"], lignes, list(larg), h=h, size=6.4)


def origine(f, N, mx, base_y=Y_TAB + 6):
    """Plancher (y modèle 0) à base_y mm du papier; x modèle mx à gauche du dessin."""
    f.vue(DRAW[0] + 6 - mx / N, base_y, N)


def tuyaux_legende(f, x0, y0):
    pass


# ============================================================ M-301 : réservoir tampon, circulateur et vanne à trois voies
def nomen(f, titre, lignes):
    f.vue(0, 0, 1)
    if len(lignes) <= 6:
        return f.tableau(DRAW[0] + 4, Y_TAB, titre, ["Élément", "Rôle et caractéristiques"], lignes, [58, 194], h=4.3, size=6.4)
    m = (len(lignes) + 1) // 2
    f.tableau(DRAW[0] + 4, Y_TAB, titre, ["Élément", "Rôle et caractéristiques"], lignes[:m], [44, 114], h=4.3, size=6.2)
    f.tableau(DRAW[0] + 170, Y_TAB, titre + " (suite)", ["Élément", "Rôle et caractéristiques"], lignes[m:], [44, 114], h=4.3, size=6.2)


def base(f, N, mx, bas=0):
    """Origine : plancher (y = 0) à Y_TAB + 16 mm + bas (papier); mx = x modèle au bord gauche."""
    f.vue(DRAW[0] + 6 - mx / N, Y_TAB + 16 + bas, N)


def m301(c):
    N = 10
    f = Feuille(c, DOSSIER, "M-301", "RÉSERVOIR TAMPON ET\nVANNE À TROIS VOIES", "1:10")
    base(f, N, -650)
    d = 60
    plancher(f, -650, 2520)
    support_beton(Sym(f, 0, 0), -30, 230, 450); support_beton(Sym(f, 0, 0), 820, 1080, 450)
    reservoir_h(Sym(f, -300, 800), 1650, 700)
    mh = Sym(f, 560, 800); mh.circ(0, 0, 105, .8, GRIS_P); mh.circ(0, 0, 80, .4, white)
    for k in range(8):
        a_ = math.radians(45 * k); mh.circ(92 * math.cos(a_), 92 * math.sin(a_), 7, .3, black)
    f.texte(80, 830, "RÉSERVOIR TAMPON\n500 L", 8, True, "c", GRIS)
    so = Sym(f, 0, 1150); r = soupape_surete(so, 0, 27); dx, dy = so.p(*r)
    tuyau(f, [(dx, dy), (-440, dy), (-440, 150)], 27, bouts=(False, True))
    f.cote(0, 150, -540, "150 mini", "v", 6.5)
    yl = 1420; xd = 800
    tuyau(f, [(xd, 1150), (xd, yl), (2480, yl)], d); coupure(f, 2480, yl, d)
    manometre(Sym(f, 1000, yl + 30), 0, 70); thermometre(Sym(f, 1180, yl + 30), 0)
    robinet_vanne(Sym(f, 1420, yl), 0, d); vanne3(Sym(f, 1850, yl), 0, d); clapet(Sym(f, 2260, yl), 0, d)
    tuyau(f, [(1850, yl - 105), (1850, 1000)], 48); coupure(f, 1850, 1000, 48, "v")
    purgeur(Sym(f, 640, 1150), 0)
    tuyau(f, [(1350, 800), (1600, 800), (1600, 300), (2480, 300)], d); coupure(f, 2480, 300, d)
    robinet_vanne(Sym(f, 1860, 300), 0, d); circulateur(Sym(f, 2230, 300), 0, d)
    tuyau(f, [(500, 450), (500, 330)], 34)
    drain(Sym(f, 500, 330, rot=180), 0, 34)
    etiq(f, "Soupape de sûreté\n(200 kPa)", -250, 1620, 5, 1290)
    etiq(f, "Purgeur d'air\nautomatique", 330, 1620, 640, 1300)
    etiq(f, "Manomètre", 850, 1800, 1000, 1620)
    etiq(f, "Thermomètre", 1260, 1860, 1260, 1660)
    etiq(f, "Robinet à vanne", 1700, 1860, 1450, 1650)
    etiq(f, "Vanne de contrôle\nà trois voies", 2130, 1860, 1900, 1650)
    etiq(f, "Clapet\nantiretour", 2380, 1260, 2270, 1500)
    etiq(f, "Vers le système\n(3e voie)", 2200, 1040, 1880, 1010)
    etiq(f, "Support\nen béton", 1330, 250, 1085, 250)
    etiq(f, "Drain", 690, 200, 560, 295)
    etiq(f, "Robinet à vanne", 1760, 640, 1860, 440)
    etiq(f, "Circulateur", 2300, 760, 2250, 520)
    etiq(f, "Trou d'homme", 560, 1040, 560, 905) if False else None
    nomen(f, "NOMENCLATURE", [
        ["Réservoir tampon", "500 L, Ø 700 × 1 650, 300 kPa : accumule l'énergie et stabilise les cycles"], ["Supports en béton", "Deux socles de 260 × 450; le fond du réservoir est à 450 du plancher"],
        ["Soupape de sûreté", "200 kPa; décharge Ø 3/4 po à 150 mm du plancher, sans robinet ni réduction"], ["Purgeur d'air", "Automatique, au point haut; robinet d'isolement de 1/4 po dessous"],
        ["Manomètre", "0 à 400 kPa, sur robinet d'isolement de 1/4 po"], ["Thermomètre", "0 à 120 °C, avec puits thermométrique immergé"],
        ["Robinets à vanne", "DN 50 à brides; sectionnent le départ et le retour pour l'entretien"], ["Vanne à trois voies", "Motorisée 0-10 V : mélange ou dérive; la 3e voie va vers le système"],
        ["Clapet antiretour", "À battant, bride DN 50, monté à l'horizontale"], ["Circulateur", "Rotor noyé, entre deux robinets; l'axe du moteur reste horizontal"], ["Drain", "Robinet de vidange 3/4 po, embout fileté pour boyau et bouchon"]])
    f.notes("NOTES", ["Tuyauterie DN 50 en acier ou en cuivre (60 mm de diamètre extérieur), dessinée à l'échelle.", "Dans cette vue de face, le tuyau de départ (haut) et le retour (bas) sont reliés au réservoir par des raccords à brides.",
                      "La soupape de sûreté est le dernier organe de protection : aucun robinet entre elle et le réservoir.", "Le circulateur se place sur le retour, côté aspiration du réservoir, pour pousser dans le système."])
    c.showPage()


def m302(c):
    N = 8
    f = Feuille(c, DOSSIER, "M-302", "CHAUDIÈRE MURALE\nÀ CONDENSATION", "1:8")
    base(f, N, -350)
    plancher(f, -350, 2380)
    # chaudière (cabinet 400 × 700, bas à 700 du plancher)
    f.rect(800, 700, 1200, 1400, 1.1, fill=GRIS_P); f.rect(820, 720, 1180, 1380, .4)
    f.rect(1070, 1270, 1170, 1350, .6, fill=HexColor("#1b2a36")); f.texte(1120, 1310, "58 °C", 5.5, True, "c", white)
    for k in range(3): f.circ(940 + k * 45, 1310, 16, .5, fill=white) if False else f.cercle(840 + k * 45, 1310, 14, .5, fill=white)
    f.texte(1000, 1060, "CHAUDIÈRE MURALE\nÀ CONDENSATION\n24 kW", 7.5, True, "c", GRIS)
    f.rect(900, 700, 1100, 725, .5, fill=GRIS_TC)
    # évacuation concentrique
    tuyau(f, [(1000, 1400), (1000, 1550)], 100, w=.9); f.ligne(970, 1400, 970, 1550, .4, dash=[4, 2]); f.ligne(1030, 1400, 1030, 1550, .4, dash=[4, 2]); coupure(f, 1000, 1550, 100, "v")
    # départ chauffage (rouge) vers la gauche
    tuyau(f, [(840, 700), (840, 540), (110, 540)], 35, CHAUD, .9); coupure(f, 110, 540, 35)
    purgeur(Sym(f, 700, 557), 0)
    manometre(Sym(f, 590, 557), 0, 60, 30)
    so = Sym(f, 460, 523, rot=180); r = soupape_surete(so, 0, 22); dx, dy = so.p(*r)
    tuyau(f, [(dx, dy), (dx, 140)], 22, bouts=(False, True))
    robinet_sphere(Sym(f, 330, 540), 0, 35)
    circulateur(Sym(f, 190, 540), 0, 35)
    # gaz (jaune), vers le bas
    tuyau(f, [(940, 700), (940, 230)], 22, GAZ_C, .9); coupure(f, 940, 230, 22, "v")
    robinet_sphere(Sym(f, 940, 560, rot=-90), 0, 22, 25)
    union(Sym(f, 940, 430, rot=-90), 0, 22)
    # condensat (vert) avec neutralisateur
    tuyau(f, [(1040, 700), (1040, 620)], 20, DRAIN, .8)
    f.rect(995, 360, 1085, 620, .8, fill=EAU_G); f.ligne(995, 560, 1085, 560, .3); f.ligne(995, 420, 1085, 420, .3)
    f.texte(1040, 490, "NEUTRA-\nLISANT", 4.6, False, "c", GRIS)
    tuyau(f, [(1040, 360), (1040, 230)], 20, DRAIN, .8); coupure(f, 1040, 230, 20, "v")
    # retour (bleu) vers la droite
    tuyau(f, [(1160, 700), (1160, 420), (1900, 420)], 35, FROID, .9); coupure(f, 1900, 420, 35)
    robinet_sphere(Sym(f, 1310, 420), 0, 35); filtre_y(Sym(f, 1480, 420), 0, 35)
    tuyau(f, [(1700, 420), (1700, 560)], 22, FROID, .8)
    vase_expansion(Sym(f, 1700, 560), 0, 130, 400)
    robinet_sphere(Sym(f, 1700, 470, rot=90), 0, 22)
    drain(Sym(f, 1800, 440), 0, 22) if False else None
    # cotes
    # étiquettes
    etiq(f, "Évacuation et prise d'air\nconcentriques PP 60/100", 1580, 1500, 1060, 1480)
    etiq(f, "Départ chauffage", 560, 900, 700, 560)
    etiq(f, "Purgeur\nd'air", 640, 800, 700, 665) if False else None
    etiq(f, "Manomètre", 560, 790, 590, 680)
    etiq(f, "Soupape de sûreté\n(210 kPa)", 700, 300, 470, 470)
    etiq(f, "Robinet à tournant\nsphérique", 280, 900, 330, 640)
    etiq(f, "Circulateur", 150, 800, 190, 640)
    etiq(f, "Robinet à gaz\n(poignée parallèle = ouvert)", 1290, 250, 960, 560)
    etiq(f, "Neutralisant\nde condensat", 1330, 570, 1090, 520)
    etiq(f, "Retour", 1360, 560, 1250, 440) if False else None
    etiq(f, "Filtre en Y", 1480, 700, 1480, 500)
    etiq(f, "Vase d'expansion\n(précharge 100 kPa)", 2040, 900, 1830, 800)
    etiq(f, "Robinet\nd'isolement", 2060, 330, 1740, 450) if False else None
    nomen(f, "NOMENCLATURE", [
        ["Chaudière murale", "24 kW à condensation, fixée au mur, 700 mm au-dessus du plancher"], ["Évacuation / prise d'air", "Tuyau concentrique en polypropylène 60/100, pente 2 % vers la chaudière"],
        ["Départ chauffage", "Cuivre 1 1/4 po avec purgeur, manomètre, soupape et circulateur"], ["Soupape de sûreté", "210 kPa; décharge Ø 3/4 po à 150 mm du plancher"],
        ["Circulateur", "À rotor noyé sur le départ, entre robinets d'isolement"], ["Gaz naturel", "Tuyau noir 3/4 po, robinet à tournant sphérique à portée de main"],
        ["Condensat", "Tuyau en PVC Ø 3/4 po avec neutralisant, vers un drain; pente continue"], ["Retour", "Robinet d'isolement, filtre en Y, vase d'expansion (≈ 12 L)"]])
    f.notes("NOTES", ["Le condensat de la chaudière est acide (pH 3 à 4) : on le neutralise avant le drain.", "Les raccords de la chaudière sont repérés par couleur : rouge = départ, bleu = retour, jaune = gaz, vert = condensat.",
                      "Respecter les dégagements du fabricant : tuyaux, évacuation et service à l'avant de l'appareil.", "Valeurs d'exercice, à valider avec la fiche technique de l'appareil et les codes en vigueur."])
    c.showPage()


def m303(c):
    N = 6
    f = Feuille(c, DOSSIER, "M-303", "COLLECTEUR DE\nPLANCHER CHAUFFANT", "1:6")
    base(f, N, -350, -14)
    xs = [440 + 120 * k for k in range(6)]
    ya, yr = 900, 500
    # boîte murale
    f.rect(-90, 100, 1620, 1220, .8, fill=HexColor("#f4f4f4")); f.texte(760, 1160, "BOÎTE DE COLLECTEUR ENCASTRÉE", 6.5, True, "c", GRIS)
    # barillets
    for (y, col) in ((ya, CHAUD), (yr, FROID)):
        f.rect(350, y - 24, 1090, y + 24, .9, fill=GRIS_P)
        for x in (350, 1090): f.rect(x - 14 if x == 350 else x, y - 32, x if x == 350 else x + 14, y + 32, .7, fill=GRIS_P)
        for x in xs: f.ligne(x, y - 24, x, y + 24, .3)
    # boucles
    for k, x in enumerate(xs):
        xa, xr = x - 26, x + 26
        # débitmètre sur l'alimentation (au-dessous du barillet chaud)
        f.rect(xa - 12, ya - 90, xa + 12, ya - 24, .6, fill=GRIS_P)
        f.rect(xa - 10, ya - 200, xa + 10, ya - 90, .6, fill=EAU_G); f.circ(xa, ya - 150 + 0, 0, 0) if False else f.cercle(xa, ya - 150, 6, .4, fill=black) if False else None
        f.cercle(xa, ya - 140, 6, .4, GRIS, GRIS)
        for j in range(1, 5): f.ligne(xa - 10, ya - 90 - j * 22, xa - 4, ya - 90 - j * 22, .25)
        f.rect(xa - 12, ya - 214, xa + 12, ya - 200, .6, fill=GRIS_P)
        tuyau(f, [(xa, ya - 214), (xa, 170)], 16, CHAUD, .7); coupure(f, xa, 170, 16, "v")
        # servomoteur thermique sur le retour (au-dessus du barillet froid)
        f.rect(xr - 12, yr + 24, xr + 12, yr + 70, .6, fill=GRIS_P)
        f.rect(xr - 13, yr + 70, xr + 13, yr + 170, .7, fill=HexColor("#e8e8e8")); f.ligne(xr - 13, yr + 150, xr + 13, yr + 150, .3)
        f.rect(xr - 5, yr + 170, xr + 5, yr + 186, .4, fill=black)
        tuyau(f, [(xr, yr - 24), (xr, 170)], 16, FROID, .7); coupure(f, xr, 170, 16, "v")
        f.texte(x, 130, str(k + 1), 7, True)
    # alimentation et retour (gauche)
    tuyau(f, [(-200, ya), (350, ya)], 35, CHAUD, .9); coupure(f, -200, ya, 35)
    tuyau(f, [(-200, yr), (350, yr)], 35, FROID, .9); coupure(f, -200, yr, 35)
    robinet_sphere(Sym(f, -40, ya), 0, 35); robinet_sphere(Sym(f, -40, yr), 0, 35)
    union(Sym(f, 150, ya), 0, 35); union(Sym(f, 150, yr), 0, 35)
    thermometre(Sym(f, 230, ya + 17), 0, 50, 140); thermometre(Sym(f, 230, yr + 17), 0, 50, 140)
    # extrémités : purgeur et remplissage/vidange
    purgeur(Sym(f, 1090 - 40, ya + 24), 0)
    drain(Sym(f, 1090, ya, rot=0), 0, 20) if False else None
    f.rect(1104, ya - 14, 1160, ya + 14, .6, fill=GRIS_P); f.rect(1160, ya - 20, 1190, ya + 20, .6, fill=GRIS_P)
    f.rect(1104, yr - 14, 1160, yr + 14, .6, fill=GRIS_P); f.rect(1160, yr - 20, 1190, yr + 20, .6, fill=GRIS_P)
    # supports
    for y in (ya, yr):
        for x in (310, 1060):
            f.rect(x - 9, y - 44, x + 9, y + 44, .6, fill=GRIS_TC)
    # étiquettes
    etiq(f, "Barillet d'alimentation\n(chaud)", 520, 1060, 560, 930)
    etiq(f, "Barillet de retour\n(froid)", 1400, 330, 1090, 480)
    etiq(f, "Débitmètre\n(L/min)", 1380, 780, 1030, 800)
    etiq(f, "Servomoteur\nthermique", 1380, 640, 1090, 610)
    etiq(f, "Boucles 1 à 6\nPEX-AL 16 mm", 1230, 470, 1000, 230) if False else None
    etiq(f, "Boucles 1 à 6 :\nPEX-AL 16 mm", 160, 330, 400, 240)
    etiq(f, "Purgeur d'air", 1350, 1050, 1070, 1050)
    etiq(f, "Robinet de purge\net remplissage", 1330, 800, 1150, 890) if False else None
    etiq(f, "Robinet de vidange\net de remplissage", 1420, 500, 1190, 500)
    etiq(f, "Thermomètre", 330, 1060, 235, 975) if False else None
    etiq(f, "Robinet d'arrêt", -60, 760, -40, 920) if False else None
    etiq(f, "Thermomètre", 210, 1100, 240, 980)
    etiq(f, "Robinet d'arrêt", -60, 1030, -40, 940)
    nomen(f, "NOMENCLATURE", [
        ["Barillet d'alimentation", "Laiton 1 po, six sorties 3/4 po Eurocône à 120 mm c/c; eau à 40 °C"], ["Barillet de retour", "Laiton 1 po; vannes de réglage avec tête de servomoteur thermique"],
        ["Débitmètres", "Tube gradué 0 à 4 L/min par boucle : équilibrage du débit"], ["Servomoteurs thermiques", "230 V, normalement fermés, pilotés par le thermostat de zone"],
        ["Boucles", "Tuyau PEX-AL 16 mm, longueur maximale 100 m par boucle"], ["Purgeur et vidange", "Purgeur automatique et robinets de remplissage et de vidange aux extrémités"],
        ["Robinets d'arrêt", "À tournant sphérique 1 po sur l'aller et le retour"], ["Thermomètres", "0 à 80 °C sur l'aller et le retour"]])
    f.notes("NOTES", ["Le collecteur se place au centre de la zone chauffée, dans une boîte murale accessible.", "Les boucles de plancher partent par paires : l'aller (rouge) au débitmètre, le retour (bleu) au servomoteur.",
                      "Rincer et purger chaque boucle l'une après l'autre avant de mettre en route.", "Valeurs d'exercice."])
    c.showPage()


def jacket(f, x0, x1, y0, y1, dome):
    """Enveloppe d'un réservoir vertical à dessus bombé."""
    cx = (x0 + x1) / 2; a = (x1 - x0) / 2
    pts = [(x0, y0), (x1, y0), (x1, y1)] + [(cx + a * math.cos(math.radians(t)), y1 + dome * math.sin(math.radians(t))) for t in range(0, 181, 10)] + [(x0, y1)]
    f.poly(pts, 1.1, close=True, fill=EAU_G)


def p301(c):
    N = 8
    f = Feuille(c, DOSSIER, "P-301", "CHAUFFE-EAU\nÉLECTRIQUE", "1:8")
    base(f, N, -300, -8)
    plancher(f, -300, 2300)
    d = 22
    # bac de récupération et réservoir
    f.rect(540, 0, 1260, 60, .8, fill=GRIS_TC); f.rect(570, 25, 1230, 60, .4, fill=white)
    jacket(f, 660, 1140, 60, 1130, 100)
    f.rect(660, 60, 1140, 120, .7, fill=GRIS_TC)
    f.rect(740, 280, 1060, 520, .7, fill=white); f.texte(900, 400, "PANNEAU D'ACCÈS\nÉLÉMENTS ET\nTHERMOSTATS", 4.8, False, "c", GRIS)
    f.cercle(755, 295, 5, .3, fill=white); f.cercle(1045, 295, 5, .3, fill=white); f.cercle(755, 505, 5, .3, fill=white); f.cercle(1045, 505, 5, .3, fill=white)
    f.rect(790, 700, 1010, 830, .6, fill=white); f.texte(900, 765, "180 L · 3 kW", 5.5, True, "c", GRIS)
    # raccords du dessus
    yl = 1330
    tuyau(f, [(780, 1217), (780, yl), (200, yl)], d, FROID, .8, R=70); coupure(f, 200, yl, d)
    tuyau(f, [(1020, 1217), (1020, yl), (2200, yl)], d, CHAUD, .8, R=70); coupure(f, 2200, yl, d)
    union(Sym(f, 780, 1262, rot=90), 0, d); union(Sym(f, 1020, 1262, rot=90), 0, d)
    robinet_sphere(Sym(f, 580, yl), 0, d); clapet(Sym(f, 420, yl), 0, d) if False else None
    # tuyau d'eau froide : clapet puis robinet, branche du vase
    clapet(Sym(f, 380, yl), 0, d)
    tuyau(f, [(250, yl), (250, 1180)], 18, FROID, .7)
    vase_expansion(Sym(f, 250, 1180, rot=180), 0, 90, 260)
    # dérivation d'eau froide vers le mélangeur (par le haut)
    tuyau(f, [(700, yl), (700, 1520), (1750, 1520), (1750, yl + 22)], 18, FROID, .7, R=60)
    union(Sym(f, 1250, yl), 0, d)
    melangeur(Sym(f, 1750, yl), 0, d)
    # soupape T&P sur le côté
    so = Sym(f, 1140, 930, rot=-90); r = soupape_surete(so, 0, 22); dx, dy = so.p(*r)
    tuyau(f, [(dx, dy), (dx, 150)], 22, bouts=(False, True))
    f.cote(0, 150, dx + 80, "150 mini", "v", 6)
    # vidange
    drain(Sym(f, 1140, 190, rot=-90), 0, 22)
    # évacuation du bac
    tuyau(f, [(1260, 30), (1500, 30), (1500, -40)], 25, DRAIN, .7, R=30); coupure(f, 1500, -40, 25, "v")
    # étiquettes
    etiq(f, "Panneau d'accès\n(éléments, thermostats)", 1640, 420, 1060, 420)
    etiq(f, "Raccords diélectriques", 900, 1480, 780, 1275) if False else None
    etiq(f, "Union\ndiélectrique", 510, 1130, 775, 1265)
    etiq(f, "Union\ndiélectrique", 1290, 1130, 1030, 1265)
    etiq(f, "Robinet d'arrêt", 610, 1450, 585, 1360) if False else None
    etiq(f, "Robinet d'arrêt", 560, 1000, 580, 1300) if False else None
    etiq(f, "Clapet\nantiretour", 150, 1030, 370, 1300) if False else None
    etiq(f, "Vase d'expansion\nsanitaire (8 L)", 180, 780, 250, 930)
    etiq(f, "Mélangeur thermostatique\n(49 °C)", 1850, 1130, 1760, 1350)
    etiq(f, "Soupape T&P\n(1 034 kPa, 99 °C)", 1760, 800, 1180, 940)
    etiq(f, "Tuyau de décharge", 1760, 560, 1210, 540) if False else None
    etiq(f, "Vidange", 1640, 190, 1250, 200)
    etiq(f, "Bac de récupération", 560, 330, 700, 40) if False else None
    etiq(f, "Bac de récupération", 400, 230, 560, 40)
    etiq(f, "Vers l'avaloir\nde plancher", 1780, 160, 1510, 20)
    etiq(f, "EF", 110, 1420, 160, 1342) if False else None
    f.texte(120, 1380, "EAU FROIDE", 6, True, "c", FROID); f.texte(2090, 1380, "EAU CHAUDE\nMITIGÉE", 6, True, "c", CHAUD)
    etiq(f, "Robinet d'arrêt\net clapet antiretour", 450, 1560, 450, 1390) if False else None
    nomen(f, "NOMENCLATURE", [
        ["Chauffe-eau électrique", "180 L, 3 kW, 240 V, avec anode et deux éléments"], ["Bac de récupération", "Sous le réservoir, avec évacuation vers un avaloir de plancher"],
        ["Raccords diélectriques", "Cuivre-acier : évitent la corrosion galvanique aux deux raccords du dessus"], ["Robinet d'arrêt", "À tournant sphérique 3/4 po sur l'arrivée d'eau froide"],
        ["Clapet antiretour", "Empêche l'eau chaude de remonter dans l'eau froide"], ["Vase d'expansion", "8 L, précharge 345 kPa : absorbe la dilatation de l'eau chauffée"],
        ["Soupape T&P", "1 034 kPa / 99 °C; décharge à 150 mm du plancher, sans robinet"], ["Mélangeur thermostatique", "Limite l'eau aux appareils à 49 °C; froide par dérivation"],
        ["Robinet de vidange", "3/4 po avec embout fileté, près du bas du réservoir"], ["Panneau d'accès", "Éléments et thermostats; couper le courant avant de l'ouvrir"]])
    f.notes("NOTES", ["L'eau chaude à 60 °C du réservoir empêche la légionelle; le mélangeur la ramène à 49 °C aux appareils pour éviter les brûlures.", "Le tuyau de décharge de la soupape T&P ne se visse jamais, ne se bouche jamais et descend jusqu'à 150 mm du plancher.",
                      "Remplir le réservoir avant de mettre sous tension (éléments à sec = brûlés).", "Valeurs d'exercice."])
    c.showPage()


def p302(c):
    N = 12
    f = Feuille(c, DOSSIER, "P-302", "ENTRÉE D'EAU\nEN SOUS-SOL (COUPE)", "1:12")
    base(f, N, -1700, 8)
    d = 60
    grade = 2050
    # sol extérieur, mur de fondation, semelle, dalle
    f.rect(-1700, -300, 0, grade, .0, fill=HexColor("#efe9df"), col=white); f.hachures(-1700, -300, 0, grade, 110, 35, GRIS_C, .22)
    f.ligne(-1700, grade, 0, grade, 1.4); f.texte(-1000, grade + 140, "NIVEAU DU SOL FINI (EXTÉRIEUR)", 6.5, True, "c", GRIS)
    f.rect(0, -300, 250, 2200, .9, fill=GRIS_TC); f.hachures(0, -300, 250, 2200, 90, 45, GRIS_C, .25)
    f.texte(125, 2330, "MUR DE\nFONDATION", 5.5, False, "c", GRIS) if False else None
    f.rect(250, -100, 2200, 0, .8, fill=GRIS_TC); f.hachures(250, -100, 2200, 0, 80, 45, GRIS_C, .22)
    f.ligne(250, 0, 2200, 0, 1.4)
    f.ligne(-1700, 250, 0, 250, .6, GRIS, dash=[10, 5]); f.texte(-1400, 330, "Ligne de gel (1 800 mm sous le sol)", 6.5, False, "g", GRIS)
    f.cote(300 + 0, grade, -1760, "1 800", "v", 6.5) if False else f.cote(250, grade, -1640, "1 800", "v", 6.5)
    # conduite de service et manchon
    y0 = 200
    tuyau(f, [(-1700, y0), (-60, y0)], d, FROID, .9); coupure(f, -1700, y0, d)
    f.rect(-5, y0 - 70, 255, y0 + 70, .7, fill=white); f.hachures(-5, y0 - 70, 255, y0 + 70, 28, 45, GRIS, .25)
    tuyau(f, [(-5, y0), (520, y0), (520, 1100), (2150, 1100)], d, FROID, .9, R=110); coupure(f, 2150, 1100, d)
    # boîte de service (robinet d'arrêt de la ville)
    f.rect(-1560, 250, -1540, grade, .6, fill=GRIS_P); f.rect(-1600, grade - 120, -1500, grade, .6, fill=white)
    # appareils
    yl = 1100
    robinet_sphere(Sym(f, 720, yl), 0, d, 40)
    union(Sym(f, 880, yl), 0, d)
    compteur(Sym(f, 1130, yl), 0, d)
    reducteur(Sym(f, 1560, yl), 0, d)
    manometre(Sym(f, 1740, yl + 30), 0, 80, 40)
    clapet(Sym(f, 1960, yl), 0, d)
    # vidange en aval du robinet (tuyau 3/4 po)
    tuyau(f, [(880, yl), (880, 900)], 28, FROID, .7) if False else None
    tuyau(f, [(800, yl - 30), (800, 930)], 28, FROID, .7)
    drain(Sym(f, 800, 930, rot=180), 0, 28)
    # étiquettes
    etiq(f, "Conduite de service\n(cuivre type K, 2 po)", -900, 650, -900, 215)
    etiq(f, "Boîte de service\n(robinet d'arrêt de la ville)", -1250, 1500, -1540, 1500) if False else None
    etiq(f, "Robinet d'arrêt\nde la ville", -1200, 1500, -1530, 1950)
    etiq(f, "Manchon d'étanchéité\net scellant", 520, -280, 200, 130) if False else None
    etiq(f, "Manchon\nscellé", 360, 600, 140, 260)
    etiq(f, "Robinet d'arrêt\nprincipal", 700, 1620, 720, 1260)
    etiq(f, "Union", 880, 1500, 880, 1180)
    etiq(f, "Compteur d'eau", 1130, 1700, 1130, 1400) if False else etiq(f, "Compteur d'eau", 1160, 1640, 1140, 1290)
    etiq(f, "Réducteur de\npression", 1530, 1620, 1560, 1410)
    etiq(f, "Manomètre", 1860, 1850, 1745, 1680)
    etiq(f, "Clapet antiretour", 2000, 1560, 1960, 1260) if False else etiq(f, "Clapet\nantiretour", 2060, 1600, 1980, 1260)
    etiq(f, "Robinet de vidange", 1160, 700, 840, 840)
    f.texte(1400, -300, "PLANCHER FINI — SOUS-SOL", 6.5, True, "c", GRIS) if False else None
    nomen(f, "NOMENCLATURE", [
        ["Conduite de service", "Cuivre type K 2 po (ou PEX 50 mm) à 1 800 mm sous le sol, sous la ligne de gel"], ["Robinet d'arrêt de la ville", "Dans la boîte de service, hors du bâtiment, manoeuvré par la ville"],
        ["Manchon d'étanchéité", "Fourreau dans le mur de béton, scellant souple des deux côtés"], ["Robinet d'arrêt principal", "À tournant sphérique 2 po, à l'entrée, facile d'accès"],
        ["Compteur d'eau", "Avec unions de chaque côté pour le retirer sans couper de tuyau"], ["Réducteur de pression", "Règle la pression du bâtiment à 350 kPa (45 lb/po²)"],
        ["Manomètre", "0 à 700 kPa, en aval du réducteur"], ["Clapet antiretour", "Protège le réseau public contre le refoulement"], ["Robinet de vidange", "3/4 po en aval du robinet principal : vide la tuyauterie du bâtiment"]])
    f.notes("NOTES", ["La conduite d'eau entre dans le bâtiment à plus de 1,8 m sous le sol pour ne pas geler.", "Le robinet d'arrêt principal est le premier organe du bâtiment : tout le monde doit savoir où il se trouve.",
                      "Une pression trop haute (plus de 550 kPa) abîme les robinets et les appareils : d'où le réducteur.", "Valeurs d'exercice, à valider avec la municipalité."])
    c.showPage()


def wc(f, x):
    f.rect(x - 190, 410, x + 190, 800, .8, fill=white); f.rect(x - 210, 800, x + 210, 850, .8, fill=white)      # réservoir et couvercle
    f.circ(x + 150, 820, 18, .5, fill=white) if False else f.cercle(x + 140, 825, 16, .5, fill=white)
    f.poly([(x - 230, 410), (x + 230, 410), (x + 200, 330), (x + 170, 200), (x + 100, 80), (x + 90, 0), (x - 90, 0), (x - 100, 80), (x - 170, 200), (x - 200, 330)], .9, close=True, fill=white)
    f.rect(x - 105, 0, x + 105, 40, .7, fill=GRIS_TC)


def p303(c):
    N = 15
    f = Feuille(c, DOSSIER, "P-303", "MUR HUMIDE : DRAINAGE\nET VENTILATION", "1:15")
    base(f, N, -2300, 17)
    f.ligne(-2300, 0, 2550, 0, 1.4)
    # plancher à solives et plafond
    f.rect(-2300, -250, 2550, 0, .8, fill=white); f.hachures(-2300, -250, 2550, 0, 60, 45, GRIS_C, .2)
    for x in range(-2200, 2550, 400): f.rect(x - 20, -250, x + 20, 0, .4, fill=GRIS_TC)
    f.rect(-2300, 2440, 2550, 2510, .8, fill=GRIS_TC); f.texte(2200, 2560, "PLAFOND", 6, False, "c", GRIS)
    f.rect(-95, -250, 95, 0, 0, fill=white, col=white)
    d3, d15 = 89, 38
    # colonne de chute et d'évent
    tuyau(f, [(0, -320), (0, 2560)], d3, DRAIN, .9, bouts=(True, False)); coupure(f, 0, 2560, d3, "v")
    f.rect(-70, -360, 70, -320, .7, fill=GRIS_P)           # bouchon de nettoyage
    # WC (à droite) : coude sous plancher
    wc(f, 700)
    tuyau(f, [(700, 0), (700, -130), (0, -130)], d3, DRAIN, .9, R=90)
    # lavabo suspendu (à gauche de la colonne)
    f.poly([(-770, 850), (-130, 850), (-190, 700), (-710, 700)], .9, close=True, fill=white); f.rect(-760, 850, -140, 880, .7, fill=white)
    f.ligne(-450, 880, -450, 1000, 1.6); f.ligne(-450, 1000, -380, 1000, 1.6)
    tuyau(f, [(-450, 700), (-450, 520), (-330, 520), (-330, 640), (-50, 640)], d15, DRAIN, .8, R=50)
    tuyau(f, [(-50, 640), (0, 640)], d15, DRAIN, .8)
    # baignoire et siphon sous plancher
    f.poly([(-2150, 560), (-650, 560), (-690, 90), (-720, 40), (-2080, 40), (-2110, 90)], .9, close=True, fill=white)
    f.rect(-2110, 0, -690, 40, .6, fill=GRIS_TC)
    tuyau(f, [(-1000, 70), (-1000, -190), (-880, -190), (-880, -100), (-50, -100)], d15, DRAIN, .8, R=50); tuyau(f, [(-50, -100), (0, -100)], d15, DRAIN, .8)
    # arrivées d'eau (symboles)
    # étiquettes et cotes
    f.cote(-330, 0, 760, "330", "h", 6.5)
    f.cote(0, 850, -880 + 0, "850", "v", 6.5) if False else f.cote(0, 850, -830, "850", "v", 6.5) if False else None
    etiq(f, "Colonne de chute et d'évent\nØ 3 po (89 mm)", 600, 1700, 50, 1500)
    etiq(f, "Évent humide : la même colonne\nventile le lavabo et la baignoire", -1450, 1700, -60, 1300) if False else None
    etiq(f, "Prolongement jusqu'au toit,\n300 mm au-dessus de la toiture", 1000, 2230, 50, 2530)
    etiq(f, "Siphon du lavabo\nØ 1 1/4 po (38 mm)", -1150, 560, -420, 520)
    etiq(f, "Lavabo suspendu", -1200, 960, -770, 800) if False else etiq(f, "Lavabo", -1150, 880, -780, 800)
    etiq(f, "Cuvette à évacuation de 3 po\nsur bride de plancher", 1350, 400, 960, 300) if False else etiq(f, "Toilette (bride de plancher)", 1450, 300, 950, 150)
    etiq(f, "Siphon de la baignoire\n(sous le plancher)", -1900, -450, -980, -190) if False else etiq(f, "Siphon de la baignoire\n(sous le plancher)", -1700, -390, -1000, -190)
    etiq(f, "Bouchon de nettoyage", 700, -330, 80, -340)
    etiq(f, "Pente de 2 %\n(1/4 po par pied)", -450, -420, -420, -110)
    etiq(f, "Distance siphon-évent :\n1 500 mm maximum", -1350, 1250, -330, 600) if False else etiq(f, "Distance siphon-évent\n(1 500 mm maximum)", -1150, 1250, -270, 620)
    etiq(f, "Baignoire", -1400, 800, -1400, 570)
    etiq(f, "Plancher à solives", 1700, -400, 1600, -140)
    nomen(f, "NOMENCLATURE", [
        ["Colonne de chute et d'évent", "ABS Ø 3 po : reçoit les appareils et traverse le toit pour ventiler"], ["Toilette", "Évacuation Ø 3 po, bride de plancher vissée, siphon intégré"],
        ["Lavabo", "Siphon en P Ø 1 1/4 po; le bras raccorde la colonne (évent humide)"], ["Baignoire", "Siphon sous le plancher, Ø 1 1/2 po, pente de 2 %"],
        ["Bouchon de nettoyage", "Au pied de la colonne, accessible pour déboucher"], ["Prolongement au toit", "300 mm au-dessus de la toiture; solin étanche à la traversée"],
        ["Pente des drains", "2 % (1/4 po par pied) : ni trop lente, ni trop rapide"], ["Distance siphon-évent", "1 500 mm maximum pour 1 1/4 po (varie selon le code)"]])
    f.notes("NOTES", ["Chaque siphon garde une garde d'eau qui bloque les gaz d'égout; l'évent empêche l'aspiration de cette eau.", "Mur humide : tous les appareils partagent une colonne, ce qui économise tuyaux et temps.",
                      "Vue de face, le mur est « ouvert » : les tuyaux dans la cloison sont dessinés pour les voir.", "Valeurs d'exercice, à valider avec le code de plomberie."])
    c.showPage()


def p304(c):
    N = 10
    f = Feuille(c, DOSSIER, "P-304", "PUISARD ET POMPE\nDE DRAINAGE (COUPE)", "1:10")
    base(f, N, -900, 90)
    # dalle, fondation, mur
    f.rect(-900, -100, 2360, 0, .9, fill=GRIS_TC); f.hachures(-900, -100, 2360, 0, 80, 45, GRIS_C, .22)
    f.rect(-900, -100, -900, 0, 0) if False else None
    f.rect(1500, -300, 1760, 1000, .9, fill=GRIS_TC); f.hachures(1500, -300, 1760, 1000, 80, 45, GRIS_C, .22)
    f.ligne(-900, 0, 1500, 0, 1.4)
    # fosse : trou dans la dalle, gravier, parois
    f.rect(-80, -1000, 680, -900, .0, fill=HexColor("#efe9df"), col=white); f.hachures(-80, -1000, 680, -900, 40, 30, GRIS_C, .25)
    f.rect(-60, -900, 660, -100, .0, fill=white, col=white) if False else None
    f.rect(30, -900, 570, 0, .9, fill=white)
    f.rect(0, -900, 30, 0, .9, fill=GRIS_TC); f.rect(570, -900, 600, 0, .9, fill=GRIS_TC); f.rect(0, -930, 600, -900, .9, fill=GRIS_TC)
    # niveaux d'eau
    f.ligne(30, -500, 570, -500, .5, FROID, dash=[8, 4]); f.ligne(30, -330, 570, -330, .5, FROID, dash=[8, 4])
    f.rect(35, -900, 565, -500, 0, fill=HexColor("#e9f3fa"), col=white) if False else None
    # drain français (perforé) à gauche
    tuyau(f, [(-900, -380), (30, -380)], 100, DRAIN, .8, bouts=(False, False)); coupure(f, -900, -380, 100)
    for x in range(-860, 20, 70): f.cercle(x, -380 + 50, 8, .3, fill=white) if False else f.ligne(x, -380 - 50, x, -380 + 50, .2, GRIS_C)
    # pompe submersible
    f.rect(200, -890, 400, -480, .9, fill=GRIS_P); f.rect(215, -890, 385, -840, .5, fill=white)
    for k in range(5): f.ligne(205, -520 - k * 60, 395, -520 - k * 60, .3)
    f.rect(270, -480, 330, -430, .6, fill=GRIS_P)
    f.cercle(300, -445, 0, .1) if False else None
    # flotteur à tige
    f.poly([(210, -700), (110, -690), (60, -560)], .8, GRIS, None, False)
    f.poly([(40, -560), (70, -520), (100, -560), (70, -600)], .8, close=True, fill=white)
    # refoulement, clapet, robinet, sortie par le mur
    tuyau(f, [(300, -430), (300, 640), (1500, 640)], 48, FROID, .9, R=90)
    f.ligne(268, -190, 332, -190, 1.6, ROUGE)    # trou de 6 mm (symbole)
    robinet_sphere(Sym(f, 300, 420, rot=90), 0, 48, 20) if False else None
    clapet(Sym(f, 300, 180, rot=90), 0, 48)
    union(Sym(f, 300, 60, rot=90), 0, 48)
    robinet_sphere(Sym(f, 300, 420, rot=90), 0, 48, 20)
    tuyau(f, [(1500, 640), (2250, 640)], 48, FROID, .9); coupure(f, 2250, 640, 48)
    f.rect(1500, 590, 1760, 690, .6, fill=white); f.hachures(1500, 590, 1760, 690, 28, 45, GRIS, .22)
    # couvercle et évent
    f.rect(-30, 0, 630, 40, .9, fill=GRIS_P)
    tuyau(f, [(480, 40), (480, 1000)], 38, VENT, .8); coupure(f, 480, 1000, 38, "v")
    # prise DDFT et câble
    f.rect(780, 800, 900, 960, .8, fill=white); f.cercle(840, 880, 24, .5, fill=white)
    f.poly([(380, -480), (380, -300), (420, 10), (480 + 120, 80), (700, 560), (780, 880)], .5, GRIS, [4, 3], False) if False else f.poly([(360, -480), (360, 40), (700, 120), (840, 800)], .5, GRIS, [4, 3], False)
    # étiquettes
    etiq(f, "Dalle de béton", 1000, -230, 1000, -60)
    etiq(f, "Couvercle étanche", 260, 330, 120, 20) if False else etiq(f, "Couvercle\nétanche", -300, 300, 0, 20)
    etiq(f, "Évent Ø 38 mm\nvers l'extérieur", 800, 1060, 500, 1000) if False else etiq(f, "Évent Ø 1 1/2 po\nvers la ventilation", 800, 1050, 500, 960)
    etiq(f, "Union", 700, 80, 330, 62) if False else etiq(f, "Union", 640, 300, 330, 64)
    etiq(f, "Clapet antiretour\n(horizontal ou vertical)", 700, 560, 350, 200) if False else etiq(f, "Clapet antiretour", 760, 160, 335, 185) if False else etiq(f, "Clapet antiretour", 740, 200, 340, 185)
    etiq(f, "Robinet d'arrêt", 700, 420, 335, 420) if False else etiq(f, "Robinet d'arrêt", 740, 420, 340, 420)
    etiq(f, "Trou de 6 mm\n(évite le blocage d'air)", 780, -150, 335, -190)
    etiq(f, "Refoulement Ø 1 1/2 po", 1000, 780, 1000, 670) if False else etiq(f, "Refoulement Ø 1 1/2 po", 1050, 860, 1000, 665)
    etiq(f, "Pompe submersible", -400, -700, 210, -680) if False else etiq(f, "Pompe\nsubmersible", -350, -650, 205, -680)
    etiq(f, "Flotteur à tige\n(arrêt et départ)", -450, -940 + 0, 70, -580) if False else etiq(f, "Flotteur", -300, -450, 40, -540)
    etiq(f, "Drain français\nperforé Ø 100 mm", -420, -250, -420, -330) if False else etiq(f, "Drain français\nperforé Ø 100 mm", -500, -150, -480, -330)
    etiq(f, "Gravier 20 mm", 900, -950, 650, -950)
    etiq(f, "Niveau haut\n(départ de la pompe)", 1100, -500, 570, -340) if False else etiq(f, "Niveau haut (départ)", 1080, -400, 575, -335)
    etiq(f, "Niveau bas (arrêt)", 1080, -560, 575, -500)
    etiq(f, "Prise DDFT\ndédiée", 1060, 1010, 905, 940)
    etiq(f, "Manchon d'étanchéité", 1700, 1000, 1620, 700) if False else etiq(f, "Manchon\nscellé", 1330, 880, 1560, 690)
    etiq(f, "Vers l'extérieur,\nà 1,5 m du mur", 2100, 880, 2000, 665)
    nomen(f, "NOMENCLATURE", [
        ["Puisard", "Fosse Ø 450 à 500 mm × 800 mm, couvercle étanche vissé"], ["Pompe submersible", "1/3 hp, 230 V ou 120 V, avec flotteur à tige"],
        ["Drain français", "Tuyau perforé Ø 100 mm entouré de gravier, pente vers le puisard"], ["Refoulement", "Ø 1 1/2 po : trou de 6 mm, clapet, robinet d'arrêt, union"],
        ["Clapet antiretour", "Garde l'eau dans le tuyau quand la pompe s'arrête"], ["Évent", "Ø 1 1/2 po; évacue l'air et évite les odeurs"],
        ["Alimentation", "Prise DDFT dédiée, câble sorti par le couvercle"], ["Évacuation", "Hors du bâtiment, loin des fondations et du drain"]])
    f.notes("NOTES", ["Une fosse trop petite fait démarrer la pompe sans arrêt; un niveau de flotteur mal réglé la fait tourner à sec.", "L'eau du puisard ne se raccorde jamais à l'égout sanitaire.",
                      "L'union au-dessus du clapet permet de sortir la pompe pour l'entretien.", "Valeurs d'exercice."])
    c.showPage()


def p305(c):
    N = 8
    f = Feuille(c, DOSSIER, "P-305", "RACCORD DE GAZ\nÀ UN APPAREIL", "1:8")
    base(f, N, -300, -6)
    plancher(f, -300, 2300)
    f.rect(-300, 0, 0, 1560, .0, fill=HexColor("#f1efe8"), col=white); f.ligne(0, 0, 0, 1560, .9); f.hachures(-300, 0, 0, 1560, 70, 45, GRIS_C, .2)
    d = 27
    # appareil (sécheuse à gaz)
    f.rect(1250, 0, 2000, 1000, 1.0, fill=GRIS_P); f.rect(1250, 800, 2000, 1000, .6, fill=white)
    f.cercle(1625, 400, 230, .9, fill=white); f.cercle(1625, 400, 170, .5, fill=EAU_G)
    f.rect(1250, 560, 1300, 740, .8, fill=GRIS_P)      # entrée de gaz
    f.texte(1625, 900, "SÉCHEUSE À GAZ", 6.5, True, "c", GRIS)
    # conduite : arrivée du plafond, descente, té, branche
    tuyau(f, [(0, 1450), (500, 1450), (500, 420)], d, GAZ_C, .9, R=60, bouts=(False, False))
    tuyau(f, [(500, 650), (1250, 650)], d, GAZ_C, .9, bouts=(False, False))
    f.rect(500 - 24, 396, 500 + 24, 430, .8, fill=GRIS_P)       # bouchon du piège à sédiments
    f.rect(500 - 17, 650 - 17, 500 + 17, 650 + 17, .0, fill=white, col=white) if False else None
    robinet_sphere(Sym(f, 700, 650), 0, d, 0)
    union(Sym(f, 900, 650), 0, d)
    # connecteur flexible annelé
    f.rect(950, 650 - 18, 1250, 650 + 18, .8, fill=GRIS_P)
    for x in range(960, 1250, 14): f.ligne(x, 650 - 18, x, 650 + 18, .3)
    union(Sym(f, 920, 1100), 0, d) if False else None
    f.rect(1240, 640 - 12, 1260, 660 + 12, .6, fill=GRIS_P) if False else None
    # bouchon de prise de pression sur le té
    f.rect(530, 650 + 16, 560, 650 + 40, .5, fill=GRIS_P) if False else None
    # étiquettes
    etiq(f, "Arrivée du gaz\n(du compteur)", 250, 1250, 40, 1440) if False else etiq(f, "Arrivée du gaz\n(du compteur)", 250, 1200, 60, 1440)
    etiq(f, "Tuyau noir 3/4 po\n(acier, filets coniques)", 1000, 1300, 600, 1450)
    etiq(f, "Piège à sédiments\n(75 mm minimum)", 210, 500, 480, 460)
    etiq(f, "Té", 740, 880, 520, 670)
    etiq(f, "Robinet à gaz\n(tournant sphérique)", 700, 1000, 700, 830)
    etiq(f, "Union", 900, 480, 900, 620)
    etiq(f, "Connecteur flexible\nhomologué gaz", 1100, 300, 1090, 620)
    etiq(f, "Entrée de gaz\nde l'appareil", 1500, 1250, 1280, 740)
    f.cote(0, 1800, 1100 + 0, "", "h", 6) if False else f.cote(700, 1250, 400, "550 (robinet à l'appareil : 1 800 maximum)", "h", 6.5) if False else f.cote(700, 1250, 250, "550 (maximum permis : 1 800)", "h", 6.5)
    f.cote(400, 650, 420 + 0, "", "v", 6) if False else None
    nomen(f, "NOMENCLATURE", [
        ["Tuyau de gaz", "Acier noir 3/4 po, filetage conique, pâte approuvée pour le gaz"], ["Piège à sédiments", "Tronçon de 75 mm avec bouchon au bas du té : retient la saleté"],
        ["Robinet à gaz", "À tournant sphérique, poignée parallèle au tuyau = ouvert"], ["Union", "Permet de retirer l'appareil sans couper le tuyau"],
        ["Connecteur flexible", "Annelé, homologué pour le gaz, jamais traversant un mur"], ["Appareil", "Sécheuse à gaz : régulateur et brûleur intégrés"]])
    f.notes("NOTES", ["Le robinet d'arrêt doit être visible et à moins de 1,8 m de l'appareil.", "Après le montage, on fait toujours un essai d'étanchéité à l'eau savonneuse : jamais à la flamme.",
                      "Le piège à sédiments évite que la saleté du tuyau bloque le brûleur.", "Travail réservé à un maître mécanicien en tuyauterie ou à un titulaire de licence gaz; dessin d'exercice."])
    c.showPage()


def m001(c):
    f = Feuille(c, DOSSIER, "M-001", "ROBINETTERIE ET\nACCESSOIRES", "1:6")
    f.vue(DRAW[0] + 6, DRAW[1] + 22, 6)
    d = 40
    items = [("Robinet à vanne", lambda s: robinet_vanne(s, 0, d)), ("Robinet à soupape", lambda s: robinet_soupape(s, 0, d)), ("Robinet à tournant\nsphérique", lambda s: robinet_sphere(s, 0, d)),
             ("Clapet antiretour\nà battant", lambda s: clapet(s, 0, d)), ("Filtre en Y", lambda s: filtre_y(s, 0, d)),
             ("Réducteur de pression", lambda s: reducteur(s, 0, d)), ("Compteur d'eau", lambda s: compteur(s, 0, d)), ("Circulateur", lambda s: circulateur(s, 0, d)),
             ("Vanne à trois voies\nmotorisée", lambda s: vanne3(s, 0, d)), ("Mélangeur\nthermostatique", lambda s: melangeur(s, 0, d)),
             ("Soupape de sûreté", lambda s: soupape_surete(s, 0, 24)), ("Manomètre", lambda s: manometre(s, 0, 60, 32)), ("Thermomètre", lambda s: thermometre(s, 0)),
             ("Purgeur d'air\nautomatique", lambda s: purgeur(s, 0)), ("Vase d'expansion", lambda s: vase_expansion(s, 0, 70, 150))]
    for i, (nom, fn) in enumerate(items):
        col, row = i % 5, i // 5
        x = 200 + col * 400; y = 1100 - row * 480
        tuyau(f, [(x - 180, y), (x + 180, y)], d, bouts=(False, False))
        fn(Sym(f, x, y + (22 if i >= 10 and i != 10 else 0)))
        f.texte(x, y - 130, nom, 8, True, "c")
    f.vue(0, 0, 1)
    f.notes("COMMENT LIRE", ["Chaque symbole est dessiné en élévation, monté sur un tuyau de 40 mm.", "Les brides, unions et poignées permettent de reconnaître le type de robinet à distance.",
                            "Ces symboles se retrouvent dans les gros plans M-301 à P-305.", "Le sens d'écoulement n'est donné que par les clapets et le circulateur (flèche)."])
    c.showPage()


def garde(c):
    f = Feuille(c, DOSSIER, "000", "PAGE DE GARDE\nET LISTE DES FEUILLES", "—")
    c_ = f.c
    c_.setFont(FONT_B, 28); c_.drawString(24 * MM, 232 * MM, "DÉTAILS MÉCANIQUES")
    c_.drawImage(LOGO, (336 - 24 * LOGO_R) * MM, 228 * MM, 24 * LOGO_R * MM, 24 * MM)
    c_.setFont(FONT, 14); yy = 222
    for l in ["DOSSIER 6", "Gros plans de plomberie et de chauffage", "Salle mécanique type"]: c_.drawString(24 * MM, yy * MM, l); yy -= 7
    c_.setFont(FONT_B, 11); c_.drawString(24 * MM, (yy - 2) * MM, "Conçu par " + AUTEUR); yy -= 11
    c_.setFont(FONT, 10.5)
    for l in wrap("Détails d'installation dessinés à l'échelle, en élévation, avec les raccords, la robinetterie et les accessoires de sécurité : réservoir tampon, chaudière murale à condensation, collecteur de plancher chauffant, "
                  "chauffe-eau électrique, entrée d'eau, mur humide, puisard et raccord de gaz. Chaque feuille nomme les pièces par des flèches et les décrit dans une nomenclature.", 95):
        c_.drawString(24 * MM, yy * MM, l); yy -= 5.2
    lignes = [["000", "Page de garde et liste des feuilles"], ["M-001", "Robinetterie et accessoires (légende)"], ["M-301", "Réservoir tampon, circulateur et vanne à trois voies"], ["M-302", "Chaudière murale à condensation"],
              ["M-303", "Collecteur de plancher chauffant"], ["P-301", "Chauffe-eau électrique"], ["P-302", "Entrée d'eau en sous-sol (coupe)"], ["P-303", "Mur humide : drainage et ventilation"],
              ["P-304", "Puisard et pompe de drainage (coupe)"], ["P-305", "Raccord de gaz à un appareil"]]
    f.tableau(24, yy - 10, "LISTE DES FEUILLES", ["Feuille", "Titre"], lignes, [22, 110], h=6, size=8.5)
    f.notes("UTILISATION EN CLASSE", ["Ces dessins servent à reconnaître les pièces, leur ordre de montage et leur rôle. Projeter la feuille, puis faire nommer chaque pièce avant d'ouvrir la nomenclature.",
                                     "Les valeurs sont plausibles mais non vérifiées pour la construction : consulter la fiche du fabricant et les codes en vigueur."])
    c.showPage()


DETAILS = {   # code de feuille : (fonction, titre dans la liste des feuilles)
    "M-001": (m001, "Robinetterie et accessoires (légende des détails)"), "M-301": (m301, "Détail : réservoir tampon, circulateur et vanne à trois voies"),
    "M-302": (m302, "Détail : chaudière murale à condensation"), "M-303": (m303, "Détail : collecteur de plancher chauffant"),
    "P-301": (p301, "Détail : chauffe-eau électrique"), "P-302": (p302, "Détail : entrée d'eau en sous-sol (coupe)"),
    "P-303": (p303, "Détail : mur humide, drainage et ventilation"), "P-304": (p304, "Détail : puisard et pompe de drainage (coupe)"),
    "P-305": (p305, "Détail : raccord de gaz à un appareil"),
}


def ajouter(c, dossier, codes):
    """Ajoute les feuilles de détail demandées dans le dossier d'un bâtiment (le cartouche prend le dossier hôte)."""
    global DOSSIER
    ancien = DOSSIER; DOSSIER = dossier
    try:
        for k in codes: DETAILS[k][0](c)
    finally: DOSSIER = ancien


def liste(codes): return [[k, DETAILS[k][1]] for k in codes]


def produire(chemin, codes=None):
    c = rl_canvas.Canvas(chemin, pagesize=(PAGE_W * MM, PAGE_H * MM), pageCompression=1)
    c.setTitle("DÉTAILS MÉCANIQUES — feuilles de détail"); c.setAuthor("Pavillon de l'Avenir · plan pédagogique")
    ajouter(c, DOSSIER, codes or list(DETAILS)); c.save()


if __name__ == "__main__":
    os.makedirs("sortie", exist_ok=True)
    produire("sortie/Details-mecaniques.pdf"); print("ok")
