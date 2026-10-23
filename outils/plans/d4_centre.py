# -*- coding: utf-8 -*-
"""Dossier 4 — Centre commercial (mail linéaire de 5 locaux) sur un terrain en pente.
Feuilles du moteur (A, S, P, E, M) + feuilles civiles C-101 (nivellement et drainage) et C-102 (profils de terrain)."""
from batiment import *
from moderne import BatimentModerne, vitrines

W, D, t = 40000, 18000, 300
S, N, O, E = t / 2, D - t / 2, t / 2, W - t / 2
zm = 5200
I0, IX, IY = 300, W - 300, D - 300
YC1, YC2 = 11000, 13000                 # corridor de service entre les locaux et les pièces arrière
XS = [14000, 22000, 30000, 35000]       # murs mitoyens entre les locaux
XR = [5000, 10000, 14000, 18000, 22000, 26000, 32000]   # murs des pièces arrière

murs = [(I0, YC1, IX, YC1, 190), (I0, YC2, IX, YC2, 125)]
for x in XS:
    murs.append((x, I0, x, YC1, 190))
for x in XR:
    murs.append((x, YC2, x, IY, 125))

portes = [
    dict(no="101", axe="h", at=S, s=5000, w=1830, genre="double", sens=-1, h=2440, mat="Aluminium et verre trempé", quinc="Barre panique + serrure à cylindre"),
    dict(no="102", axe="h", at=S, s=16600, w=1830, genre="double", sens=-1, h=2440, mat="Aluminium et verre trempé", quinc="Barre panique + serrure"),
    dict(no="103", axe="h", at=S, s=24600, w=1830, genre="double", sens=-1, h=2440, mat="Aluminium et verre trempé", quinc="Barre panique + serrure"),
    dict(no="104", axe="h", at=S, s=31600, w=915, sens=-1, pivot="a", h=2440, mat="Aluminium et verre trempé", quinc="Poussée-tirée + serrure"),
    dict(no="105", axe="h", at=S, s=36600, w=915, sens=-1, pivot="a", h=2440, mat="Aluminium et verre trempé", quinc="Poussée-tirée + serrure"),
    dict(no="106", axe="h", at=YC1, s=9000, w=1830, genre="double", sens=1, mat="Acier isolé", quinc="Serrure + barre panique"),
    dict(no="107", axe="h", at=YC1, s=19500, w=915, sens=1, pivot="a", mat="Acier", quinc="Barre panique"),
    dict(no="108", axe="h", at=YC1, s=27500, w=915, sens=1, pivot="a", mat="Acier", quinc="Barre panique"),
    dict(no="109", axe="h", at=YC1, s=33500, w=915, sens=1, pivot="a", mat="Acier", quinc="Barre panique"),
    dict(no="110", axe="h", at=YC1, s=38000, w=915, sens=1, pivot="a", mat="Acier", quinc="Barre panique"),
    dict(no="111", axe="v", at=O, s=12000, w=915, sens=1, pivot="a", h=2135, mat="Acier isolé", quinc="Barre panique (issue)"),
    dict(no="112", axe="v", at=E, s=12000, w=915, sens=1, pivot="a", h=2135, mat="Acier isolé", quinc="Barre panique (issue)"),
    dict(no="113", axe="h", at=N, s=2600, w=3050, genre="double", sens=1, h=3050, mat="Porte de garage sectionnelle isolée", quinc="Opérateur électrique (quai)"),
    dict(no="114", axe="h", at=YC2, s=7500, w=915, sens=1, pivot="a", mat="Acier", quinc="Serrure (accès restreint)"),
    dict(no="115", axe="h", at=YC2, s=12000, w=915, sens=1, pivot="a", mat="Acier", quinc="Serrure (accès restreint)"),
    dict(no="116", axe="h", at=YC2, s=16000, w=915, sens=1, pivot="a", quinc="Poussée-tirée + ferme-porte"),
    dict(no="117", axe="h", at=YC2, s=20000, w=915, sens=1, pivot="b", quinc="Poussée-tirée + ferme-porte"),
    dict(no="118", axe="h", at=YC2, s=24000, w=915, sens=1, pivot="a", quinc="Serrure"),
    dict(no="119", axe="h", at=YC2, s=29000, w=1830, genre="double", sens=1, mat="Acier", quinc="Serrure + arrêts"),
    dict(no="120", axe="h", at=YC2, s=36000, w=1830, genre="double", sens=1, mat="Acier", quinc="Serrure + arrêts"),
    dict(no="121", axe="h", at=N, s=29000, w=915, sens=1, pivot="a", h=2135, mat="Acier isolé", quinc="Barre panique (issue)"),
]
fenetres = vitrines(S, [(500, 13850), (14150, 21850), (22150, 29850), (30150, 34850), (35150, 39500)],
                    [p for p in portes if p["axe"] == "h" and abs(p["at"] - S) < 1]) + [
    dict(type="D", axe="v", at=O, s=5200, w=600), dict(type="D", axe="v", at=O, s=7100, w=600), dict(type="D", axe="v", at=O, s=9000, w=600),
    dict(type="D", axe="v", at=E, s=5200, w=600), dict(type="D", axe="v", at=E, s=7100, w=600), dict(type="D", axe="v", at=E, s=9000, w=600),
    dict(type="C", axe="h", at=N, s=14500, w=7000), dict(type="C", axe="h", at=N, s=33000, w=6000),
]
locaux = [("101", "Épicerie", I0, I0, 13905, 10905), ("102", "Pharmacie", 14095, I0, 21905, 10905),
          ("103", "Restaurant", 22095, I0, 29905, 10905), ("104", "Boutique A", 30095, I0, 34905, 10905),
          ("105", "Boutique B", 35095, I0, IX, 10905), ("106", "Corridor de service", I0, 11095, IX, 12937),
          ("107", "Réception\nmarchandises", I0, 13062, 4937, IY), ("108", "Salle\nmécanique", 5062, 13062, 9937, IY),
          ("109", "Salle\nélectrique", 10062, 13062, 13937, IY), ("110", "Toilettes\nhommes", 14062, 13062, 17937, IY),
          ("111", "Toilettes\nfemmes", 18062, 13062, 21937, IY), ("112", "Entretien", 22062, 13062, 25937, IY),
          ("113", "Déchets et\nrecyclage", 26062, 13062, 31937, IY), ("114", "Entrepôt\ncommun", 32062, 13062, IX, IY)]
app = [("wc", 14700, IY, 180), ("wc", 15600, IY, 180), ("uri", 17937, 15600, 90), ("uri", 17937, 16400, 90),
       ("lav", 14062, 14200, 270), ("lav", 14062, 15000, 270),
       ("wc", 18700, IY, 180), ("wc", 19600, IY, 180), ("wc", 20500, IY, 180), ("lav", 21937, 14200, 90), ("lav", 21937, 15000, 90),
       ("vid", 23000, IY, 180), ("ce", 9200, IY, 180), ("dp", 7500, 15200, 0), ("dp", 2600, 15600, 0),
       ("evd", 27800, 10905, 0), ("evs", 20000, 10905, 0), ("fon", 21000, 12937, 180)]

centre = BatimentModerne(
    dossier=dict(projet="CENTRE COMMERCIAL\nDOSSIER 4", adresse="2 450, chemin de la Côte\nVille fictive (Québec)", date="Octobre 2026", code="D4"),
    nom_court="Centre commercial (5 locaux)",
    description="Centre commercial contemporain d'un étage : cinq locaux (épicerie, pharmacie, restaurant et deux boutiques) derrière une façade de murs-rideaux pleine hauteur, panneaux composites d'aluminium gris anthracite, volumes-signaux revêtus de lames façon bois, marquises d'acier en porte-à-faux et bandeau d'enseignes à DEL. Toit blanc avec panneaux solaires, bornes de recharge pour véhicules électriques, îlots-noues végétalisés et bassin de rétention. Terrain en pente de près de 4 m : le dossier comprend le nivellement, le drainage pluvial et des profils de terrain.",
    W=W, D=D, t=t, murs_int=murs, portes=portes, fenetres=fenetres,
    types_fen={"A": dict(h=3900, allege=0, ouv="Fixe — mur-rideau", verre="Triple, faible émissivité, verre trempé"),
               "C": dict(h=900, allege=2700, ouv="Fixe — bandeau", verre="Double, givré"),
               "D": dict(h=4200, allege=300, ouv="Fixe — verticale", verre="Triple, faible émissivité")},
    locaux=locaux, app=app,
    decal_etiq={"106": (-12000, 0), "110": (0, 500), "111": (0, 500), "108": (0, 500), "109": (0, 500), "112": (0, 500), "113": (0, 500)},
    decal_coin={"106": (-15000, 900)}, iso_court=True,
    comptoirs=[(14800, 2000, 19500, 2800, "comptoir"), (23500, 8200, 29400, 9000, "comptoir"), (1500, 1500, 5500, 2300, "caisses")],
    cotes_interieures=[(I0, 14000, 9500, "h"), (14000, 22000, 9500, "h"), (22000, 30000, 9500, "h"), (30000, 35000, 9500, "h"), (35000, IX, 9500, "h"),
                       (I0, YC1, 2500, "v"), (YC1, YC2, 2500, "v"), (YC2, IY, 2500, "v")],
    coupes=[(8000, -5200, "A", "e"), (8000, D + 5200, "A", "e")],
    grille_xy=([0, 8000, 16000, 24000, 32000, 40000], [0, 9000, 18000]), grille_ext=2600, grille_ext_fond=2200, fond_gauche=40,
    coupe_long=dict(y=6000, N=250, lettre="B"),
    couches_mur=[("Panneau composite d'aluminium 4", 4, "vide"), ("Rails et vide d'air 40", 40, "vide"), ("Isolant semi-rigide 100", 100, "isolant_rigide"),
                 ("Bloc de béton 190, armé aux 800", 190, "bloc"), ("Fourrures d'acier 19", 19, "vide"), ("Gypse 15,9", 16, "gypse")],
    Nplan=175, Nelev=200, Ncoupe=100, Nfond=200, fond_haut=40, lum_grille=4000,
    notes_plan=["Toutes les cotes sont en millimètres.", "Axes de grille : lettres d'ouest en est, chiffres du sud au nord.",
                "Carré plein : poteau d'acier HSS 203 × 203 (voir S-101).", "Murs mitoyens entre locaux : blocs 190, coupe-feu 1 h, jusqu'au platelage.",
                "Plafonds : suspendus à 3 600 dans les locaux, structure apparente à l'arrière.", "Le plancher fini est à l'altitude 103,90 (voir C-101)."],
    z_sol=0, z_plancher=150, z_murs=zm, z_plafond=3750, z_semelle=-1600, ep_plancher=150, t_fond=300,
    toit="plat", parapet=1500, unite_toit=True, debord=0, revetement="panneaux",
    niveaux=[("Sol", "± 0", 0), ("Dalle 103,90", "+ 150", 150), ("Plafond", "+ 3 750", 3750), ("Toit", "+ 5 800", zm + 600), ("Parapet", "+ 6 700", "faite"), ("Volume-signal", "+ 8 800", 8800)],
    notes_elev=["Murs-rideaux type A : aluminium à bris thermique, verre triple, pleine hauteur devant chaque local.",
                "Panneaux composites d'aluminium gris anthracite, joints de 15 mm (grille 1 500 × 1 000).",
                "Volumes-signaux de l'épicerie et du restaurant : lames d'aluminium fini bois, verticales.",
                "Marquises d'acier en porte-à-faux de 2 400 au-dessus des entrées, soffite en bois.",
                "Bandeau d'enseignes à DEL (enseignes des locataires hors contrat).",
                "Toit blanc à indice de réflectance élevé; panneaux solaires de 120 kW en retrait du parapet."],
    etiq_elev={"S": [("Mur-rideau (type A)", 0.04, 2500, 300, 5300), ("Volume-signal, lames façon bois", 0.16, 8300, 300, 1300), ("Marquise d'acier en porte-à-faux", 0.81, 4300, 300, 3300)]}, elev_dx=6,
    volumes={"S": [(0, 3500, "panneau", 6700), (3500, 9500, "bois", 8800), (9500, 22000, "panneau", 6700), (22000, 30000, "bois", 7600), (30000, 40000, "panneau", 6700)],
             "N": [(0, 40000, "panneau", 6700)],
             "E": [(0, 4200, "verre", 6700), (4200, 18000, "panneau", 6700)],
             "O": [(0, 13800, "panneau", 6700), (13800, 18000, "verre", 6700)]},
    marquises={"S": [(3500, 8500), (15500, 19500), (23500, 27500), (30800, 33300), (35800, 38300)]},
    enseignes={"S": [(1500, 3300, ""), (9700, 12500, "ÉPICERIE"), (15000, 21000, "PHARMACIE"), (23000, 29000, "RESTAURANT"), (30500, 34500, "BOUTIQUE A"), (35500, 39500, "BOUTIQUE B")]},
    type_plancher="dalle", murs_coupe=[(YC1, 190), (YC2, 125), (9000, 200, zm)],
    etiq_coupe=[("T1 (toit)", 4000, zm + 520, -5400, 0), ("Poutrelles ajourées", 2500, zm + 225, -4400, 0), ("Plafond suspendu", 4000, 3750, -5400, 0),
                ("M1 (mur ext.)", 150, 1800, -2200, 0), ("D1 (dalle)", 4000, 100, -5400, 0), ("F1 (fondation)", 150, -800, -2200, 0),
                ("Poteau HSS 203", 9000, 2400, -4400, 600)],
    coupe_y=150, coupe_titre_x=236,
    compositions=["T1 — Toit : membrane blanche réfléchissante, panneau de support, isolant rigide R-30 en pente, pare-vapeur, platelage d'acier 38, poutrelles ajourées à 1 800 c/c. Panneaux solaires lestés.",
                  "M1 — Mur extérieur : panneau composite d'aluminium 4 sur rails, vide d'air 40, isolant semi-rigide 100, pare-air, bloc de béton 190 armé, fourrures et gypse 15,9.",
                  "M2 — Mur mitoyen : bloc de béton 190, coupe-feu 1 h, jusqu'au platelage du toit.",
                  "M3 — Cloison : gypse 15,9 type X deux faces, montants d'acier 92 à 400 c/c.",
                  "D1 — Dalle : béton 150, 32 MPa, treillis, polyéthylène, isolant rigide 50 en périphérie, pierre concassée 200.",
                  "F1 — Fondation : mur 300, 25 MPa, semelle 750 × 300, drain français vers le puisard P-3."],
    poteaux=[(8000, 9000, 2100, "Poteau HSS 203 × 203 sur semelle isolée 2 100 × 2 100 × 500"), (16000, 9000, 2100, ""), (24000, 9000, 2100, ""), (32000, 9000, 2100, "")],
    etiq_fond=[("DALLE SUR SOL 150 — voir D1", 20000, 4200)],
    notes_struct=["Béton : semelles et murs 25 MPa, dalle 32 MPa, air entraîné 5 à 8 %.", "Semelles à 1 600 mm minimum sous le sol fini (gel).",
                  "Côté nord, le mur de fondation retient environ 1 m de terre (voir C-102).", "Capacité portante présumée : 150 kPa. Faire valider par un ingénieur.",
                  "Ancrages des poteaux : 4 tiges Ø 19, plaque d'assise 350 × 350 × 25."],
    plomb=dict(coll=[(7500, 16800), (23000, 16800)], sortie=[(7500, 16800), (7500, -1600)], chutes=[(15100, 16800), (19600, 16800)],
               ef=[(11200, -1600), (11200, 16200), (23000, 16200)], ec=[(9200, 17200), (9200, 16500), (23000, 16500)],
               ef_extra=[[(11200, 16200), (11200, 17100), (9800, 17100)]], compteur=(11200, 14000), lab_sens=1, h_plafond=3750, h_toit=6700,
               etiq=[('Collecteur Ø 4" sous dalle · pente 1 %', 7350, 16750, DR, "d"), ('EF Ø 1 1/2"', 22500, 16000, EF, "c"),
                     ("Vers l'égout municipal Ø 6\"", 7350, -2050, DR, "d"), ("Entrée d'eau Ø 2\" + gicleurs", 11350, -1400, EF, "g")]),
    titre_iso="SCHÉMA ISOMÉTRIQUE — DRAINAGE ET VENTILATION",
    notes_plomb=["Drainage sous la dalle : PVC, pente 1 % minimum pour Ø 4\".", "Eau : cuivre type L, robinet d'arrêt sur chaque appareil.",
                 "Restaurant : intercepteur de graisse sous l'évier (voir devis).", "Dispositif antirefoulement à l'entrée d'eau (bâtiment commercial).",
                 "Gicleurs : entrée séparée Ø 6\" dans la salle mécanique (non illustrée)."],
    sans_elec=[], detecteurs=["corridor", "entrepôt", "déchets"], dense_prises={"toilettes\nhommes": False, "toilettes\nfemmes": False, "entretien": False, "corridor de service": False},
    panneaux=[(10062, 15500, 270, "Panneau principal 800 A\n347/600 V 3 ph", (11300, 14300))],
    prises_speciales=[("UT-1 à UT-5 (toit)", (20000, 12000), "Alimentations 600 V", -330), ("Chauffe-eau", (9400, 17300), "30 A 208 V", -380),
                      ("Chambre froide", (2500, 9000), "40 A 208 V 3 ph", -380), ("Hotte (restaurant)", (26000, 9800), "30 A 208 V", -380),
                      ("Porte de quai", (2600, 17400), "20 A 120 V", -380), ("Compacteur", (29000, 17300), "30 A 600 V", -380)],
    notes_elec=["Entrée 800 A, 347/600 V, triphasée; transformateur sur socle au nord-est (voir C-101).", "Un compteur et un panneau par local (non illustrés).",
                "Éclairage DEL, éclairage de secours sur batterie, enseignes de sortie.", "Éclairage du stationnement : lampadaires DEL de 9 m (voir C-101)."],
    cvca=dict(type="toit",
              gaines=[([(1500, 9800), (38500, 9800)], 600, "Conduits des locaux (un par UT)", (30000, 9730))],
              diffuseurs=[(3500, 3000, "200 L/s", True), (10000, 3000, "200 L/s", True), (3500, 7500, "200 L/s", True), (10000, 7500, "200 L/s", True),
                          (18000, 4500, "180 L/s", True), (26000, 4500, "180 L/s", True), (32500, 5000, "120 L/s", True), (37300, 5000, "120 L/s", True)],
              retours=[(7000, 5300, "R-1"), (18000, 8000, "R-2"), (26000, 2000, "R-3"), (32500, 2000, "R-4"), (37300, 2000, "R-5")],
              equipements=[(5500, 4800, 8500, 6000, "UT-1"), (16500, 5800, 19500, 7000, "UT-2"), (24500, 5800, 27500, 7000, "UT-3"),
                           (31300, 6600, 33700, 7600, "UT-4"), (36200, 6600, 38600, 7600, "UT-5")],
              vrc=[([(16000, 15500), (14800, 15500)], "Extraction 60 L/s"), ([(20000, 15500), (21300, 15500)], "Extraction 60 L/s")]),
    notes_cvca=["UT-1 à UT-5 : une unité de toit par local (UT-1 épicerie 15 tonnes, UT-2 et UT-3 10 tonnes, UT-4 et UT-5 5 tonnes).",
                "Restaurant : hotte de cuisine et air d'appoint (devis du locataire).", "VE-1 : extraction des toilettes au toit, 120 L/s.",
                "Aérothermes électriques dans la réception et l'entrepôt."],
    site=dict(N=450, echelle_txt="1:450", lot=(90000, 72000), pos=(25000, 32000), rue=1500, nom_rue="Chemin de la Côte", lot_no="6 512 340",
              pavages=[(4000, 2500, 68000, 29000, ""), (16000, 29000, 23000, 50000, ""), (16000, 50000, 65000, 62000, "COUR DE SERVICE"), (23000, 29000, 67000, 32000, ""),
                       (5500, 0, 12500, 2500, ""), (58500, 0, 65500, 2500, ""), (71000, 2500, 88000, 26000, "BASSIN DE RÉTENTION")],
              cases=[(6000, 4000, 2700, 22), (6000, 15000, 2700, 22), (6000, 21000, 2700, 22)],
              services_x=[7500], cote_rel=0.6, elec=(25000 + 36000, 32000 + 18000), pluvial=True,
              arbres=[(2500, 40000, 2500), (2500, 55000, 2500), (2500, 68000, 2500), (87500, 40000, 2500), (87500, 55000, 2500), (87500, 68000, 2500),
                      (40000, 69000, 2200), (55000, 69000, 2200), (70000, 69000, 2200)],
              niveaux=[(500, 500, "102,10"), (89500, 500, "101,75"), (500, 71500, "105,60"), (89500, 71500, "105,20"), (45000, 50800, "104,95")],
              notes=["Implantation à confirmer par un arpenteur-géomètre.", "Marge avant : 32 m (stationnement en façade). Allées de 7 000.",
                     "Environ 60 cases dont 4 réservées aux personnes handicapées (PMR), près des entrées.", "Nivellement et drainage : voir C-101. Profils : voir C-102.",
                     "Niveaux du terrain en mètres (altitude géodésique)."]),
    donnees=[["Usage", "Commerce (groupe E), 5 locaux"], ["Étages", "1"], ["Superficie brute", f"{str(round(W * D / 1e6, 1)).replace('.', ',')} m²"],
             ["Structure", "Acier, grille 8 000 × 9 000"], ["Façades", "Murs-rideaux, panneaux d'aluminium, lames bois"], ["Toiture", "Plate, blanche, panneaux solaires 120 kW"],
             ["CVCA", "5 unités de toit"], ["Lot", "90 000 × 72 000 (6 480 m²)"], ["Dénivelé du terrain", "3,85 m (nord → sud)"],
             ["Plancher fini", "103,90"], ["Stationnement", "≈ 60 cases (4 PMR)"]],
)

import civil
centre.feuilles_extra = [("C-101", "Plan de nivellement et de drainage pluvial", lambda c: civil.feuille_nivellement(centre, c)),
                         ("C-102", "Profils de terrain et réseau pluvial", lambda c: civil.feuille_profils(centre, c))]
# niveaux du plan de site tirés du même modèle de terrain
centre.site["niveaux"] = [(x, y, civil.v2(civil.zE(x, y))) for (x, y) in ((500, 500), (89500, 500), (500, 71500), (89500, 71500))] + [(45000, 50800, "103,75")]

if __name__ == "__main__":
    centre.produire("sortie/Dossier-4-Centre-commercial.pdf")
    print("ok")
