# -*- coding: utf-8 -*-
"""Dossier 5 : détails des abreuvoirs à niveau constant (P-102) et schéma d'alimentation en eau (P-103)."""
import math
from dessin import *
from meca import *

Y_TAB = DRAW[1] + 36
ORANGE = HexColor("#e08a1e")
ISOL = HexColor("#f5ecc6")
BETON = GRIS_TC


def _tab(f, titre, lignes):
    f.vue(0, 0, 1)
    m = (len(lignes) + 1) // 2
    f.tableau(DRAW[0] + 4, Y_TAB, titre, ["Élément", "Caractéristiques"], lignes[:m], [44, 114], h=4.3, size=6.2)
    if lignes[m:]: f.tableau(DRAW[0] + 170, Y_TAB, titre + " (suite)", ["Élément", "Caractéristiques"], lignes[m:], [44, 114], h=4.3, size=6.2)


def p102(c, DOSSIER):
    f = Feuille(c, DOSSIER, "P-102", "ABREUVOIR À NIVEAU\nCONSTANT : DÉTAILS", "1:20")
    # ================= 1. coupe longitudinale (1:14)
    N = 20
    f.vue(DRAW[0] + 44, 185, N)
    L, H, base = 2200, 800, 150
    xs, ym = 2350, 700
    # dalle et socle
    f.rect(-500, -150, 2700, 0, .8, fill=BETON); f.hachures(-500, -150, 2700, 0, 70, 45, GRIS_C, .22)
    f.ligne(-500, 0, 2700, 0, 1.4)
    f.rect(150, 0, 2050, base, .8, fill=BETON); f.hachures(150, 0, 2050, base, 55, 45, GRIS_C, .22)
    # bac : coque, isolant, cavité, eau
    f.rect(0, base, L, H, 1.0, fill=HexColor("#d9dde0"))
    f.rect(0, base, 50, H, .3, fill=ISOL); f.rect(L - 50, base, L, H, .3, fill=ISOL); f.rect(0, base, L, base + 50, .3, fill=ISOL)
    f.hachures(0, base, 50, H, 22, 45, GRIS, .2); f.hachures(L - 50, base, L, H, 22, 45, GRIS, .2); f.hachures(0, base, L, base + 50, 22, 45, GRIS, .2)
    f.rect(50, base + 50, L - 50, H, .4, fill=white)
    ne = 580
    f.rect(50, base + 50, L - 50, ne, .0, fill=EAU_G, col=white); f.ligne(50, ne, L - 50, ne, .7, FROID, dash=[6, 3])
    f.rect(0, H - 20, 70, H + 10, .6, fill=GRIS_P); f.rect(L - 70, H - 20, L, H + 10, .6, fill=GRIS_P)     # bords roulés
    # cloison du coffret du flotteur et couvercle
    f.rect(1730, base + 130, 1760, H, .7, fill=white); f.rect(1730, base + 50, 1760, base + 130, .0, fill=EAU_G, col=white)
    f.rect(1730, H, L - 30, H + 40, .8, fill=GRIS_P)
    # élément chauffant
    f.rect(350, base + 62, 1500, base + 90, .6, fill=ORANGE)
    # trop-plein et vidange (colonne montante au bout gauche)
    f.rect(240, base + 50, 300, ne + 20, .7, fill=white)
    tuyau(f, [(270, base + 50), (270, -450), (-350, -450)], 50, DRAIN, .8, bouts=(False, False)); coupure(f, -350, -450, 50)
    robinet_sphere(Sym(f, 270, -70, rot=-90), 0, 50, 20)
    # alimentation : sous la dalle, montée, appareils, passage dans la paroi, robinet à flotteur
    tuyau(f, [(xs, -450), (xs, ym), (1950, ym)], 22, FROID, .8, R=50, bouts=(False, False)); coupure(f, xs, -450, 22, "v")
    robinet_sphere(Sym(f, xs, 120, rot=90), 0, 22, 25); union(Sym(f, xs, 290, rot=90), 0, 22); clapet(Sym(f, xs, 470, rot=90), 0, 22)
    f.rect(2100, ym - 30, 2210, ym + 30, .4, fill=white)
    # robinet à flotteur : corps, bras, flotteur
    f.rect(1930, ym - 40, 2000, ym + 90, .7, fill=GRIS_P)
    f.ligne(1930, ym - 30, 1830, ne + 10, 1.4); f.cercle(1810, ne - 30, 55, .8, fill=white)
    # protège-tuyau (poteau d'acier)
    f.rect(2420, 0, 2490, 1050, .8, fill=ORANGE if False else GRIS_P); f.rect(2410, 1050, 2500, 1090, .6, fill=GRIS_P)
    # boîte de jonction, conduit, terre
    f.rect(-330, 640, -150, 780, .7, fill=white); f.texte(-240, 710, "DDFT", 4.8, True)
    f.poly([(-150, 710), (-60, 710), (-60, base + 75), (350, base + 75)], .5, GRIS, [4, 2], False)
    f.poly([(-330, 700), (-330, -90)], .5, DRAIN, [3, 2], False); f.ligne(-330, -90, -330 + 90, -90, .5, DRAIN)
    # étiquettes
    etiq(f, "Couvercle du coffret\ndu flotteur", 1800, 1250, 1950, 840)
    etiq(f, "Robinet à flotteur", 2350, 1180, 1985, 760) if False else etiq(f, "Robinet à flotteur\n(coupe l'arrivée)", 2750, 1100, 2002, 735)
    etiq(f, "Flotteur", 1500, 1000, 1815, 590) if False else etiq(f, "Flotteur", 1300, 1050, 1815, 600)
    etiq(f, "Cloison : protège le\nflotteur des vaches", 800, 1250, 1745, 760) if False else None
    etiq(f, "Niveau d'eau constant", 950, 1050, 800, ne)
    etiq(f, "Isolant en\npolyuréthane 40 mm", 400, 1250, 25, 600)
    etiq(f, "Élément chauffant\n300 W + thermostat", 900, 300, 900, base + 95) if False else etiq(f, "Élément chauffant 300 W\n(thermostat réglé à 4 °C)", 1000, -420, 1000, base + 70) if False else etiq(f, "Élément chauffant\n300 W, thermostat 4 °C", 950, 380, 950, 235)
    etiq(f, "Trop-plein et vidange\nØ 2 po", 450, 1000, 275, 540) if False else etiq(f, "Trop-plein et vidange Ø 2 po", -380, 330, 270, 420) if False else etiq(f, "Trop-plein", 600, 1000, 285, 560)
    etiq(f, "Robinet de vidange", -420, -330, 250, -70) if False else etiq(f, "Robinet de vidange", 800, -320, 330, -75)
    etiq(f, "Socle de béton", 1100, -330, 1100, 70) if False else None
    etiq(f, "Dalle de béton", 1800, -330, 1800, -80)
    etiq(f, "Robinet d'arrêt", 3050, 330, 2380, 130) if False else etiq(f, "Robinet d'arrêt", 3000, 130, 2375, 120)
    etiq(f, "Union", 3000, 330, 2375, 290)
    etiq(f, "Clapet antiretour", 3000, 540, 2375, 470) if False else etiq(f, "Clapet antiretour", 3050, 520, 2380, 470)
    etiq(f, "Poteau de protection", 2950, 930, 2495, 880)
    etiq(f, "Boîte de jonction\nDDFT étanche", -380, 1050, -240, 790) if False else etiq(f, "Boîte de jonction\nDDFT", -450, 1000, -250, 790)
    etiq(f, "Mise à la terre\n(équipotentialité)", -520, 280, -330, 80)
    f.cote(0, H, -700, "800 (bord)", "v", 6.5) if False else f.cote(0, H, 2680, None, "v", 6.5) if False else None
    f.vue(0, 0, 1); f.titre_vue(DRAW[0] + 6, 150, 1, "COUPE LONGITUDINALE DE L'ABREUVOIR", "1:20")
    # ================= 2. coupe transversale (1:18)
    N2 = 20
    f.vue(DRAW[0] + 215, 115, N2)
    f.rect(-200, -100, 900, 0, .8, fill=BETON); f.ligne(-200, 0, 900, 0, 1.2)
    f.rect(100, 0, 600, 150, .8, fill=BETON); f.hachures(100, 0, 600, 150, 55, 45, GRIS_C, .22)
    f.rect(0, 150, 700, 800, 1.0, fill=HexColor("#d9dde0"))
    f.rect(0, 150, 50, 800, .3, fill=ISOL); f.rect(650, 150, 700, 800, .3, fill=ISOL); f.rect(0, 150, 700, 200, .3, fill=ISOL)
    for (a, b, c_, d_) in ((0, 150, 50, 800), (650, 150, 700, 800), (0, 150, 700, 200)): f.hachures(a, b, c_, d_, 22, 45, GRIS, .2)
    f.rect(50, 200, 650, 800, .4, fill=white); f.rect(50, 200, 650, 580, .0, fill=EAU_G, col=white); f.ligne(50, 580, 650, 580, .6, FROID, dash=[6, 3])
    f.rect(150, 212, 550, 238, .6, fill=ORANGE)
    f.cote(0, 700, 920, None, "h", 6.5) if False else f.cote(0, 700, -170, None, "h", 6.5)
    f.cote(0, 800, 800, "800", "v", 6.5) if False else f.cote(0, 800, -300, "800", "v", 6.5)
    f.cote(200, 580, 780, "380", "v", 6.5) if False else None
    f.vue(0, 0, 1); f.titre_vue(DRAW[0] + 204, 98, 2, "COUPE TRANSVERSALE", "1:20")
    # ================= 3. plan (1:20)
    N3 = 20
    f.vue(DRAW[0] + 30, 100, N3)
    f.rect(0, 0, L, 700, 1.0, fill=HexColor("#d9dde0")); f.rect(50, 50, L - 50, 650, .5, fill=EAU_G)
    f.rect(1730, 50, 1760, 650, .6, fill=white); f.rect(1760, 50, L - 50, 650, .0, fill=white, col=white) if False else None
    f.rect(1760, 50, L - 50, 650, .5, fill=white)
    f.cercle(1950, 350, 55, .6, fill=GRIS_P); f.ligne(1950, 350, 1800, 450, 1.2); f.cercle(1790, 460, 55, .6, fill=white)
    f.rect(350, 330, 1500, 380, .6, fill=ORANGE)
    f.cercle(270, 350, 90, .8, fill=white); f.cercle(270, 350, 25, .5, fill=black)
    f.ligne(2350, 350, 2150, 350, 1.2, FROID); f.cercle(2350, 350, 60, .8, fill=white)
    f.rect(2420, 300, 2500, 400, .6, fill=GRIS_P)
    f.cote(0, L, -300, None, "h", 6.5); f.cote(0, 700, -300, None, "v", 6.5) if False else f.cote(0, 700, 2650, None, "v", 6.5)
    f.texte(270, 520, "Vidange et\ntrop-plein", 5, False, "c"); f.texte(950, 480, "Élément chauffant", 5, False, "c"); f.texte(1950, 540, "Coffret du flotteur", 5, False, "c")
    f.vue(0, 0, 1); f.titre_vue(DRAW[0] + 6, 70, 3, "PLAN DE L'ABREUVOIR", "1:20")
    _tab(f, "NOMENCLATURE", [
        ["Bac", "Acier inoxydable 2 200 × 700 × 800, environ 160 L; bords roulés"], ["Isolant", "Polyuréthane de 40 mm sur les parois et le fond (contre le gel)"],
        ["Socle", "Béton 150 mm, bac de niveau; dalle de l'étable dessous"], ["Robinet à flotteur", "Débit 20 L/min, dans un coffret fermé et protégé des vaches"],
        ["Élément chauffant", "300 W, 120 V, thermostat à 4 °C, protégé par un DDFT"], ["Trop-plein et vidange", "Ø 2 po, robinet à tournant sphérique, évacuation vers le caniveau"],
        ["Alimentation", "Ø 3/4 po : robinet d'arrêt, union, clapet antiretour"], ["Poteau de protection", "Acier, ancré dans la dalle, protège le tuyau d'alimentation"],
        ["Mise à la terre", "Bac relié à l'armature de la dalle (évite la tension parasite)"], ["Niveau d'eau", "580 mm; profondeur utile 380 mm"]])
    f.notes("NOTES", ["Une vache boit 80 à 120 L par jour; le robinet doit fournir 20 L/min pour que le bac se remplisse vite.", "L'élément chauffant empêche le gel : sans lui, le bac gèle en quelques heures par grand froid.",
                      "Tension parasite : un bac mal relié à la terre donne des chocs aux vaches, qui boivent moins. Relier bac, tuyaux et armature.", "Nettoyer le bac chaque semaine : vider, brosser, rincer.", "Valeurs d'exercice."])
    c.showPage()


def p103(c, DOSSIER):
    f = Feuille(c, DOSSIER, "P-103", "ALIMENTATION EN EAU\nDES ABREUVOIRS (SCHÉMA)", "Sans échelle")
    N = 11
    f.vue(DRAW[0] + 18, 70, N)
    d = 60
    yh, yb = 1500, 900
    tuyau(f, [(-200, yh), (3100, yh), (3100, yb), (300, yb)], d, FROID, .9, R=120, bouts=(False, False)); coupure(f, -200, yh, d)
    robinet_sphere(Sym(f, 150, yh), 0, d); filtre_y(Sym(f, 600, yh), 0, d); compteur(Sym(f, 1150, yh), 0, d); reducteur(Sym(f, 1700, yh), 0, d)
    manometre(Sym(f, 1900, yh + 30), 0, 70); clapet(Sym(f, 2300, yh), 0, d); robinet_sphere(Sym(f, 2750, yh), 0, d)
    etiq(f, "Entrée d'eau Ø 2 po", -50, 1900, -100, 1540)
    etiq(f, "Robinet d'arrêt", 330, 2050, 150, 1700); etiq(f, "Filtre en Y", 800, 1900, 640, 1640); etiq(f, "Compteur d'eau", 1250, 2050, 1150, 1760)
    etiq(f, "Réducteur de\npression", 1700, 2050, 1700, 1800); etiq(f, "Manomètre", 2200, 2050, 1910, 1830); etiq(f, "Clapet antiretour", 2350, 1850, 2300, 1640); etiq(f, "Robinet de\nsectionnement", 2950, 2050, 2780, 1700)
    xs = [2800, 1700, 600]
    noms = ["COULOIR SUD\nAB-1, AB-2", "COULOIR CENTRAL\nAB-3, AB-4", "COULOIR NORD\nAB-5, AB-6"]
    for k, x in enumerate(xs):
        tuyau(f, [(x, yb), (x, 520)], 40, FROID, .8, bouts=(False, False))
        robinet_sphere(Sym(f, x, 760, rot=-90), 0, 40, 25); union(Sym(f, x, 640, rot=-90), 0, 40)
        tuyau(f, [(x - 300, 520), (x + 300, 520)], 28, FROID, .8, bouts=(False, False))
        for sg in (-1, 1):
            xx = x + sg * 300
            tuyau(f, [(xx, 520), (xx, 330)], 22, FROID, .8, bouts=(False, False))
            robinet_sphere(Sym(f, xx, 440, rot=-90), 0, 22, 25)
            f.rect(xx - 160, 120, xx + 160, 330, .8, fill=HexColor("#d9dde0")); f.rect(xx - 130, 150, xx + 130, 270, .3, fill=EAU_G)
            f.texte(xx, 215, "AB", 5, True, "c", GRIS)
        f.texte(x, 40, noms[k], 6, True)
    etiq(f, "Robinet d'arrêt de la dérivation", 1000, 1150, 640 if False else 1700, 770) if False else etiq(f, "Robinet d'arrêt\nde la dérivation", 2150, 700, 1715, 770)
    etiq(f, "Robinet d'arrêt de\nl'abreuvoir", 2250, 380, 2830 if False else 2830 - 380, 440) if False else None
    etiq(f, "Dérivation Ø 1 1/4 po", 1000, 700, 1000, 905) if False else etiq(f, "Collecteur Ø 2 po", 1150, 1010, 1150, 880) if False else None
    f.ligne(-200, yh - 55, 3045, yh - 55, .6, ROUGE, dash=[2, 2]); f.texte(1300, yh - 330, "Traçage chauffant et isolant sur toute la conduite", 5, False, "c", ROUGE)
    f.vue(0, 0, 1); f.titre_vue(DRAW[0] + 6, 62, 1, "SCHÉMA DE DISTRIBUTION DE L'EAU DES ABREUVOIRS", "Sans échelle")
    _tab(f, "NOMENCLATURE", [
        ["Conduite principale", "Ø 2 po en polyéthylène haute densité, enfouie sous la ligne de gel"], ["Filtre en Y", "Retient le sable du puits : protège les robinets à flotteur"],
        ["Compteur d'eau", "Suivi de la consommation : environ 150 L par vache par jour"], ["Réducteur de pression", "Règle à 350 kPa : les flotteurs durent plus longtemps"],
        ["Clapet antiretour", "Protège le puits et le réseau contre le refoulement"], ["Dérivations", "Ø 1 1/4 po, une par couloir, avec robinet d'arrêt et union"],
        ["Branches d'abreuvoir", "Ø 3/4 po, robinet d'arrêt à chaque abreuvoir"], ["Traçage chauffant", "Câble autorégulant sous l'isolant, thermostat de gel"]])
    f.notes("NOTES", ["Débit de pointe : 6 abreuvoirs × 20 L/min = 120 L/min; la conduite de 2 po et le réservoir tampon de 1 000 L suffisent.", "Les trois dérivations permettent d'isoler un couloir sans priver le reste du troupeau d'eau.",
                      "Chaque abreuvoir a son robinet d'arrêt : on peut le vidanger et le nettoyer sans couper l'eau des autres.", "Le schéma n'est pas à l'échelle : les positions réelles sont sur le plan P-101.", "Valeurs d'exercice."])
    c.showPage()
