# -*- coding: utf-8 -*-
from batiment import *
from moderne import BatimentModerne

W, D, t = 30000, 14000, 300
S, N, O, E = t / 2, D - t / 2, t / 2, W - t / 2
zm = 5200
I0, IX, IY = 300, W - 300, D - 300     # faces intérieures

XR, YR = 23000, 9300        # retrait (cour) au coin nord-est : bâtiment en L
IE = XR - t                 # face intérieure de l'aile arrière (22 700)
murs = [(I0, 7400, IX, 7400, 125), (I0, 9000, IE, 9000, 125),
        (23000, I0, 23000, 7400, 125), (26400, I0, 26400, 7400, 125)]
for x in (10000, 12400, 14000, 17000, 20000):
    murs.append((x, 9000, x, IY, 125))

portes = [
    dict(no="101", axe="h", at=S, s=5000, w=1830, genre="double", sens=-1, h=2135, mat="Aluminium et verre trempé", quinc="Barre panique + serrure à cylindre"),
    dict(no="102", axe="h", at=N, s=2000, w=1830, genre="double", sens=1, h=2135, mat="Acier isolé", quinc="Barre panique (livraison)"),
    dict(no="103", axe="v", at=E, s=7750, w=915, sens=1, pivot="a", h=2135, mat="Acier isolé", quinc="Barre panique (issue)"),
    dict(no="104", axe="h", at=7400, s=9500, w=1830, genre="double", sens=1, quinc="Poussée-tirée"),
    dict(no="105", axe="h", at=7400, s=24000, w=915, sens=-1, pivot="a", quinc="Bec-de-cane, serrure"),
    dict(no="106", axe="h", at=7400, s=27300, w=915, sens=-1, pivot="a", quinc="Bec-de-cane"),
    dict(no="107", axe="h", at=9000, s=3500, w=1830, genre="double", sens=1, mat="Acier", quinc="Serrure + arrêts"),
    dict(no="108", axe="h", at=9000, s=10800, w=915, sens=1, pivot="a", mat="Acier", quinc="Serrure (accès restreint)"),
    dict(no="109", axe="h", at=9000, s=12800, w=760, sens=1, pivot="a", mat="Acier", quinc="Serrure"),
    dict(no="110", axe="h", at=9000, s=14500, w=915, sens=1, pivot="b", quinc="Poussée-tirée + ferme-porte"),
    dict(no="111", axe="h", at=9000, s=17300, w=915, sens=1, pivot="a", quinc="Poussée-tirée + ferme-porte"),
    dict(no="112", axe="h", at=9000, s=20800, w=915, sens=1, pivot="a", quinc="Bec-de-cane"),
]
fenetres = [
    dict(type="A", axe="h", at=S, s=700, w=3000), dict(type="A", axe="h", at=S, s=8100, w=13900),
    dict(type="B", axe="h", at=S, s=23900, w=1800), dict(type="B", axe="h", at=S, s=27200, w=1800),
    dict(type="B", axe="v", at=E, s=2800, w=1800), dict(type="B", axe="v", at=E, s=5500, w=1800), dict(type="B", axe="v", at=XR - t / 2, s=11000, w=1800),
    dict(type="B", axe="v", at=O, s=1800, w=1800), dict(type="B", axe="v", at=O, s=4800, w=1800),
    dict(type="C", axe="v", at=O, s=10800, w=1200),
    dict(type="C", axe="h", at=N, s=15000, w=1200), dict(type="C", axe="h", at=N, s=18000, w=1200), dict(type="B", axe="h", at=N, s=20700, w=1800),
]
locaux = [("101", "Aire de vente", I0, I0, 22937, 7337), ("102", "Bureau", 23062, I0, 26337, 7337),
          ("103", "Salle de\nréunion", 26462, I0, IX, 7337), ("104", "Corridor", I0, 7462, IX, 8837),
          ("105", "Entrepôt", I0, 9062, 9937, IY), ("106", "Salle\nmécanique", 10062, 9062, 12337, IY),
          ("107", "Entretien", 12462, 9062, 13937, IY), ("108", "Toilettes\nhommes", 14062, 9062, 16937, IY),
          ("109", "Toilettes\nfemmes", 17062, 9062, 19937, IY), ("110", "Salle des\nemployés", 20062, 9062, IE, IY)]
app = [("wc", 14600, IY, 180), ("wc", 15500, IY, 180), ("uri", 16937, 11000, 90), ("uri", 16937, 11800, 90),
       ("lav", 14062, 10600, 270), ("lav", 14062, 11400, 270),
       ("wc", 17700, IY, 180), ("wc", 18600, IY, 180), ("wc", 19400, IY, 180), ("lav", 19937, 10300, 90), ("lav", 19937, 11100, 90),
       ("vid", 13200, IY, 180), ("ce", 11300, IY, 180), ("dp", 11000, 10600, 0), ("evs", 21300, IY, 180), ("fon", 16200, 8837, 180)]

commerce = BatimentModerne(
    dossier=dict(projet="BÂTIMENT COMMERCIAL\nDOSSIER 3", adresse="900, boulevard de l'Industrie\nVille fictive (Québec)", date="Octobre 2026", code="D3"),
    nom_court="Commerce et bureaux",
    description="Bâtiment commercial d'un étage en L (aile arrière et cour au nord-est) aux volumes étagés : grande aire de vente avec vitrines et tôle nervurée, tour d'entrée en brique rouge avec fente vitrée et marquise, bureau, salle de réunion, vaste entrepôt plus haut en blocs de béton avec porte de livraison, toilettes publiques, local d'entretien et salle des employés. Structure d'acier (poteaux et poutrelles ajourées) sur grille d'axes, murs de blocs de béton, toit plat avec parapets de hauteurs différentes. Chauffage et climatisation par une unité de toit.",
    W=W, D=D, t=t, retrait=(XR, YR), murs_int=murs, portes=portes, fenetres=fenetres,
    types_fen={"A": dict(h=3900, allege=0, ouv="Fixe — mur-rideau", verre="Triple, faible émissivité, verre trempé"),
               "B": dict(h=1500, allege=900, ouv="Battant, à manivelle"),
               "C": dict(h=600, allege=1800, ouv="Auvent", verre="Double, givré")},
    locaux=locaux, app=app,
    decal_etiq={"104": (4000, 0), "108": (400, 300), "106": (0, 300), "107": (0, 300), "110": (0, 300)},
    decal_coin={"104": (5500, 1300), "106": (0, -400), "107": (0, 600), "108": (0, -300)}, iso_court=True,
    comptoirs=[(20062, 13100, 22000, IY, None), (7000, 1800, 9400, 2600, "caisse")],
    cotes_interieures=[(I0, 23000, 5900, "h"), (23000, 26400, 5900, "h"), (I0, 7400, 1300, "v"), (7400, 9000, 1300, "v"), (9000, IY, 1300, "v")],
    coupes=[(2500, -3800, "A", "e"), (2500, D + 3800, "A", "e")],
    grille_xy=([0, 5000, 10000, 15000, 20000, 25000, 30000], [0, 7000, 14000]), grille_ext=2200, grille_ext_fond=1800, fond_gauche=46,
    coupe_long=dict(y=4000, N=150, lettre="B"),
    couches_mur=[("Brique d'argile 90", 90, "brique"), ("Vide d'air 25", 25, "vide"), ("Isolant rigide 75", 75, "isolant_rigide"),
                 ("Bloc de béton 190, armé aux 800", 190, "bloc"), ("Fourrures d'acier 19", 19, "vide"), ("Gypse 12,7", 13, "gypse")],
    Nplan=150, Nelev=150, Ncoupe=75, Nfond=150, fond_haut=40, lum_grille=3500,
    notes_plan=["Toutes les cotes sont en millimètres.", "Axes de grille : lettres d'ouest en est, chiffres du sud au nord.",
                "Carré plein : poteau d'acier HSS 152 × 152 (voir S-101).", "Plafond suspendu à 3 600 mm (sauf entrepôt et salle mécanique : structure apparente).",
                "Toilettes : cloisons de cabinets en stratifié (non illustrées), un cabinet accessible dans chaque local."],
    z_sol=0, z_plancher=150, z_murs=zm, z_plafond=3750, z_semelle=-1600, ep_plancher=150, t_fond=250,
    toit="plat", parapet=1500, unite_toit=True, debord=0, revetement="brique",
    niveaux=[("Sol", "± 0", 0), ("Dalle", "+ 150", 150), ("Plafond", "+ 3 750", 3750), ("Toit", "+ 5 800", zm + 600), ("Parapet", "+ 6 700", "faite"), ("Tour d'entrée", "+ 9 000", 9000)],
    notes_elev=["Tour d'entrée : brique d'argile rouge, fente vitrée pleine hauteur au-dessus de la porte; marquise d'acier en porte-à-faux.", "Façade de l'aire de vente : vitrines (type A) et tôle d'acier nervurée gris-vert.",
                "Entrepôt (nord-ouest) : volume plus haut en blocs de béton architecturaux; façades est : brique et tôle nervurée.",
                "Toit plat : membrane élastomère, pente vers les drains de toit.", "Unité de toit en retrait du parapet (peu visible du sol).",
                "Hexagones : types de fenêtres, voir A-301."],
    etiq_elev={}, elev_dx=6,
    volumes={"S": [(0, 3800, "brique", zm + 1500), (3800, 5000, "brique", 9000), (5000, 6830, "verre", 9000), (6830, 8000, "brique", 9000), (8000, 23000, "tole", zm + 1500),
                    (23000, 30000, "brique", zm + 1500)],
             "N": [(0, 7000, "brique", zm + 1500), (7000, 20000, "tole", zm + 1500), (20000, 30000, "bloc", 7800)],   # vue du nord : l'ouest est à droite; 0-7 000 = mur de la cour (en retrait)
             "O": [(0, 5000, "bloc", 7800), (5000, 10000, "brique", zm + 1500), (10000, 14000, "brique", 9000)],   # vue de l'ouest : le sud est à droite
             "E": [(0, 9300, "brique", zm + 1500), (9300, 14000, "tole", 7800)]},   # 9 300-14 000 = mur de l'aile arrière, en retrait
    marquises={"S": [(3500, 8300)]},
    enseignes={"S": [(9500, 18500, "COMMERCE ET BUREAUX")]},
    type_plancher="dalle", murs_coupe=[(7400, 125), (9000, 125), (7000, 200, zm)],
    etiq_coupe=[("T1 (toit)", 2500, zm + 520, -4400, 0), ("Poutrelles ajourées", 1500, zm + 225, -3400, 0), ("Plafond suspendu", 2500, 3750, -4400, 0),
                ("M1 (mur ext.)", 150, 1800, -1700, 0), ("D1 (dalle)", 2500, 100, -4400, 0), ("F1 (fondation)", 125, -800, -1700, 0),
                ("Poteau HSS 152", 7000, 2000, -3800, 600)],
    coupe_y=150, coupe_titre_x=236,
    compositions=["T1 — Toit : membrane élastomère 2 plis, panneau de support, isolant rigide R-30 en pente, pare-vapeur, platelage d'acier 38, poutrelles ajourées à 1 800 c/c.",
                  "M1 — Mur extérieur : brique 90 (ou tôle d'acier nervurée sur fourrures), vide d'air 25, isolant rigide 75, bloc de béton 190 (armé aux 800), fourrures et gypse 12,7.",
                  "M2 — Cloison : gypse 15,9 type X deux faces, montants d'acier 92 à 400 c/c, laine insonorisante.",
                  "D1 — Dalle : béton 150, 32 MPa, treillis, polyéthylène, isolant rigide 50 en périphérie, pierre concassée 200.",
                  "F1 — Fondation : mur antigel 250, 25 MPa, semelle 650 × 250, drain français."],
    poteaux=[(5000, 7000, 1800, "Poteau HSS 152 × 152 sur semelle isolée 1 800 × 1 800 × 450"), (10000, 7000, 1800, ""), (15000, 7000, 1800, ""), (20000, 7000, 1800, ""), (25000, 7000, 1800, "")],
    etiq_fond=[("DALLE SUR SOL 150 — voir D1", 15000, 3200)],
    notes_struct=["Béton : semelles et murs 25 MPa, dalle 32 MPa, air entraîné 5 à 8 %.", "Semelles à 1 600 mm minimum sous le sol fini (gel).",
                  "Capacité portante présumée : 150 kPa. Faire valider par un ingénieur.", "Ancrages des poteaux : 4 tiges Ø 19, plaque d'assise 300 × 300 × 19.",
                  "Joints de sciage de la dalle : quadrillage d'environ 4,5 m, alignés sur les axes."],
    plomb=dict(coll=[(10600, 12600), (22000, 12600)], sortie=[(10600, 12600), (10600, -1100)], chutes=[(15000, 12600), (18600, 12600)],
               ef=[(12100, -1100), (12100, 12200), (22000, 12200)], ec=[(11500, 13050), (11500, 12350), (22000, 12350)],
               ef_extra=[[(12100, 12200), (12100, 12950), (11100, 12950)]], compteur=(12100, 10000), lab_sens=1, h_plafond=3750, h_toit=6700,
               etiq=[('Collecteur Ø 4" sous dalle · pente 1 %', 10450, 12550, DR, "d"), ('EF Ø 1"', 21500, 12000, EF, "c"),
                     ("Vers l'égout municipal Ø 6\"", 10450, -1550, DR, "d"), ("Entrée d'eau Ø 1 1/2\"", 12250, -900, EF, "g")]),
    titre_iso="SCHÉMA ISOMÉTRIQUE — DRAINAGE ET VENTILATION",
    notes_plomb=["Drainage sous la dalle : PVC ou ABS, pente 1 % minimum pour Ø 4\".", "Eau : cuivre type L ou PEX, robinet d'arrêt sur chaque appareil.",
                 "Chauffe-eau électrique 270 L, mélangeur thermostatique pour les lavabos publics.", "Dispositif antirefoulement à l'entrée d'eau (bâtiment commercial).",
                 "Clapet antiretour sur le collecteur principal."],
    sans_elec=[], detecteurs=["entrepôt", "corridor", "bureau"], dense_prises={"toilettes\nhommes": False, "toilettes\nfemmes": False, "entretien": False, "corridor": False},
    panneaux=[(10062, 11700, 270, "Panneau 400 A\n120/208 V 3 ph", (11200, 10350))],
    prises_speciales=[("UT-1 (toit)", (16450, 8250), "70 A 208 V 3 ph", -330), ("Chauffe-eau", (10800, 12800), "30 A 208 V", -380),
                      ("Sèche-mains", (16300, 10200), "20 A 120 V", -380), ("Sèche-mains", (18700, 9750), "20 A 120 V"),
                      ("Caisse", (8200, 1300), "20 A 120 V", -380), ("Aérotherme", (1500, 12600), "30 A 208 V", -380)],
    notes_elec=["Entrée 400 A, 120/208 V, triphasée, 4 fils.", "Éclairage : luminaires DEL encastrés 600 × 1 200, éclairage de secours sur batterie.",
                "Alarme incendie : voir devis (détecteurs illustrés à titre indicatif).", "Prises des toilettes et extérieures : protection DDFT."],
    cvca=dict(type="toit",
              gaines=[([(1200, 8200), (29000, 8200)], 600, "Conduit principal 600 × 400", (22000, 8130)), ([(6500, 8200), (6500, 1800)], 400, None), ([(16500, 8200), (16500, 1800)], 400, None)],
              diffuseurs=[(3500, 2000, "120 L/s", True), (3500, 4800, "120 L/s", True), (9500, 2000, "120 L/s", True), (9500, 4800, "120 L/s", True),
                          (14500, 2000, "120 L/s", True), (14500, 4800, "120 L/s", True), (19500, 2000, "120 L/s", True), (19500, 4800, "120 L/s", True),
                          (24700, 3800, "60 L/s", True), (28000, 3800, "90 L/s", True), (3000, 11600, "60 L/s", True), (7000, 11600, "60 L/s", True), (21300, 11900, "45 L/s", True)],
              retours=[(11500, 4000, "Retour R-1"), (21500, 4000, "Retour R-2"), (28000, 6400, "Retour R-3")],
              equipements=[(13800, 7650, 16200, 8750, "UT-1 (AU TOIT)"), (16700, 10200, 17300, 10700, "VE-1"), (800, 12900, 2200, 13500, "AÉROTHERME")],
              vrc=[([(16700, 10450), (15600, 10450)], "Extraction 50 L/s"), ([(17300, 10450), (18400, 10450)], "Extraction 50 L/s")]),
    notes_cvca=["UT-1 : unité de toit 10 tonnes, climatisation et chauffage électrique 40 kW, apport d'air frais 350 L/s.",
                "Conduits en acier galvanisé au-dessus du plafond suspendu, isolés en entretoit.",
                "VE-1 : ventilateur d'extraction des toilettes au toit, 100 L/s.", "Aérotherme électrique 10 kW dans l'entrepôt."],
    site=dict(N=250, echelle_txt="1:250", lot=(46000, 44000), pos=(8000, 21000), rue=1500, nom_rue="Boulevard de l'Industrie", lot_no="6 345 678",
              pavages=[(2500, 1000, 43500, 19100, ""), (36500, 0, 42500, 1000, ""), (12500, 19100, 15500, 21000, "")],
              cases=[(3500, 1500, 2600, 15), (3500, 13600, 2600, 15)],
              services_x=[10600], cote_rel=0.3, elec=(8000 + 19000, 21000), pluvial=True,
              arbres=[(2500, 30000, 2200), (43500, 32000, 2500), (23000, 39000, 2000), (1300, 12000, 1000)],
              niveaux=[(300, 300, "102,10"), (45700, 300, "101,90"), (300, 43700, "102,70"), (45700, 43700, "102,60"), (23000, 21000 + 14000 + 900, "102,45")],
              notes=["Implantation à confirmer par un arpenteur-géomètre.", "Marge avant minimale : 12 m (stationnement en façade). Allée de circulation : 6 600.",
                     "30 cases dont 2 réservées aux personnes handicapées, près de l'entrée.", "Eaux pluviales du toit et du stationnement vers l'égout pluvial.",
                     "Niveaux du terrain en mètres (altitude géodésique)."]),
    donnees=[["Usage", "Commerce de détail et bureaux"], ["Étages", "1"], ["Superficie brute", f"{str(round((W * D - (W - XR) * (D - YR)) / 1e6, 1)).replace('.', ',')} m²"],
             ["Structure", "Acier, grille 5 000 × 7 000"], ["Murs", "Blocs de béton, brique et tôle nervurée"], ["Toiture", "Plate, membrane élastomère"],
             ["CVCA", "Unité de toit 10 tonnes"], ["Lot", "46 000 × 44 000"]],
)

if __name__ == "__main__":
    commerce.produire("sortie/Dossier-3-Batiment-commercial.pdf")
    print("ok")
