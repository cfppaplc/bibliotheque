# -*- coding: utf-8 -*-
from batiment import *

W, D, t = 16000, 9000, 250
S, N, O, E = t / 2, D - t / 2, t / 2, W - t / 2
P = 0.5            # pente 6/12
zm = 2700
faite = zm + D / 2 * P
M = lambda x: W - x          # miroir autour du mur mitoyen


def miroir_portes(lst, plus=100):
    out = []
    for d in lst:
        e = dict(d)
        if e.get("no") and e["no"][0].isdigit(): e["no"] = str(int(e["no"]) + plus)
        if e["axe"] == "h":
            e["s"] = W - d["s"] - d["w"]; e["pivot"] = "b" if d.get("pivot", "a") == "a" else "a"
        else:
            e["at"] = M(d["at"]); e["sens"] = -d.get("sens", 1)
        out.append(e)
    return out


def miroir_fen(lst):
    out = []
    for d in lst:
        e = dict(d)
        if e["axe"] == "h": e["s"] = W - d["s"] - d["w"]
        else: e["at"] = M(d["at"])
        out.append(e)
    return out


murs_A = [(5400, 250, 5400, 4500, 125), (250, 4500, 7875, 4500, 125), (5400, 2500, 7875, 2500, 125), (3800, 4500, 3800, 8750, 125)]
murs_B = []
for (x1, y1, x2, y2, e) in murs_A:
    murs_B.append((M(x2), y1, M(x1), y2, e) if y1 == y2 else (M(x1), y1, M(x2), y2, e))

portes_A = [
    dict(no="101", axe="h", at=S, s=3700, w=915, sens=1, pivot="b", mat="Acier isolé, vitrage 1/2", quinc="Serrure + pêne dormant"),
    dict(no="102", axe="v", at=O, s=900, w=915, sens=1, pivot="a", mat="Acier isolé", quinc="Serrure + pêne dormant"),
    dict(no="103", axe="v", at=5400, s=3300, w=760, sens=1, pivot="a", quinc="Intimité (verrou)", tag_dedans=False),
    dict(no="104", axe="v", at=5400, s=1200, w=815, sens=1, pivot="a", quinc="Passage", tag_dedans=False),
    dict(no="105", axe="h", at=4500, s=2700, w=760, sens=1, pivot="b", quinc="Passage"),
    dict(no="106", axe="h", at=4500, s=4100, w=760, sens=1, pivot="a", quinc="Passage"),
]
fen_A = [dict(type="B", axe="h", at=S, s=1000, w=1800), dict(type="C", axe="h", at=S, s=6300, w=600),
         dict(type="D", axe="v", at=O, s=3000, w=1200), dict(type="A", axe="v", at=O, s=6200, w=1200),
         dict(type="A", axe="h", at=N, s=1200, w=1200), dict(type="A", axe="h", at=N, s=5200, w=1200)]
locaux_A = [("101", "Séjour et cuisine", 250, 250, 5337, 4437), ("102", "Salle\nde bain", 5462, 2562, 7875, 4437),
            ("103", "Mécanique\net lavage", 5462, 250, 7875, 2437), ("104", "Chambre 1", 250, 4562, 3737, 8750),
            ("105", "Chambre 2", 3862, 4562, 7875, 8750)]
app_A = [("bain", 7812, 3500, 90), ("wc", 6600, 4437, 180), ("lav", 6150, 2562, 0),
         ("evd", 312, 3600, 270), ("lv", 312, 2950, 270), ("ce", 7812, 900, 90), ("lave", 6000, 312, 0), ("dp", 6900, 1400, 0)]
reseau_A = dict(coll=[(450, 2200), (7450, 2200)], sortie=[(3000, 2200), (3000, -1100)], chutes=[(6600, 2200)],
                ef=[(7000, -1100), (7000, 2050), (450, 2050)], ec=[(7300, 1200), (7300, 1900), (450, 1900)],
                ef_extra=[[(7000, 1000), (7212, 1000)]], compteur=(7000, 1650), lab_sens=-1)


def miroir_pts(pts): return [(M(x), y) for (x, y) in pts]


reseau_B = dict(coll=miroir_pts(reseau_A["coll"]), sortie=miroir_pts(reseau_A["sortie"]), chutes=miroir_pts(reseau_A["chutes"]),
                ef=miroir_pts(reseau_A["ef"]), ec=miroir_pts(reseau_A["ec"]), ef_extra=[miroir_pts(p) for p in reseau_A["ef_extra"]],
                compteur=(M(7000), 1650), lab_sens=1)

duplex = Batiment(
    dossier=dict(projet="DUPLEX JUMELÉ\nDOSSIER 2", adresse="48-50, avenue du Parc\nVille fictive (Québec)", date="Octobre 2026", code="D2"),
    nom_court="Duplex jumelé (logements A et B)",
    description="Bâtiment de deux logements jumelés, séparés par un mur mitoyen coupe-feu. Construction à ossature de bois sur dalle de béton avec murs de fondation antigel. Chauffage par plinthes électriques, ventilation par un VRC dans chaque logement. Le logement B est symétrique du logement A.",
    W=W, D=D, t=t,
    murs_int=murs_A + murs_B + [(8000, 250, 8000, 8750, 250)],
    portes=portes_A + miroir_portes(portes_A),
    fenetres=fen_A + miroir_fen(fen_A),
    types_fen={
        "A": dict(h=1200, allege=900, ouv="Battant, à manivelle"), "B": dict(h=1200, allege=900, ouv="Coulissante"),
        "C": dict(h=600, allege=1500, ouv="Auvent", verre="Double, givré"), "D": dict(h=1100, allege=1050, ouv="Battant, à manivelle"),
    },
    locaux=locaux_A + [(str(int(no) + 100), nom, M(x1), y0, M(x0), y1) for (no, nom, x0, y0, x1, y1) in locaux_A],
    coin_court=["103", "203", "102", "202"], decal_coin={"103": (-650, 1525), "203": (650, 1525), "102": (-700, 460), "202": (700, 460)}, decal_etiq={"101": (0, 700), "201": (0, 700), "102": (-700, -150), "202": (700, -150), "103": (-150, 250), "203": (150, 250)},
    app=app_A + [(c, M(x), y, (360 - r) % 360) for (c, x, y, r) in app_A],
    comptoirs=[(250, 2100, 850, 4437, None), (M(850), 2100, M(250), 4437, None)],
    cotes_interieures=[(250, 5400, 4000, "h"), (5400, 8000, 4000, "h"), (250, 4500, 1500, "v"), (4500, 8750, 1500, "v")],
    coupes=[(2000, -1000, "A", "e"), (2000, D + 1000, "A", "e")],
    coupe_long=dict(y=1500, N=100, lettre="B"),
    couches_mur=[("Brique d'argile 90", 90, "brique"), ("Vide d'air 25", 25, "vide"), ("Panneau isolant rigide 25", 25, "isolant_rigide"),
                 ("Panneau OSB 11", 11, "panneau"), ("Montants 38 × 140 à 400 c/c et laine R-24", 140, "laine"), ("Pare-vapeur (polyéthylène 0,15)", 0, "membrane"), ("Gypse 12,7", 13, "gypse")],
    Nplan=75, Nelev=150, Ncoupe=50, Nfond=100, axes_fond=[8000],
    notes_plan=["Toutes les cotes sont en millimètres.", "Logement B symétrique du logement A (numéros 2xx).",
                "Mur mitoyen : séparation coupe-feu 1 h, double ossature et deux épaisseurs de gypse type X de chaque côté.",
                "Hauteur libre sous plafond : 2 440 mm.", "Dalle sur sol : voir S-101."],
    z_sol=0, z_plancher=200, z_murs=zm, z_plafond=2640, z_semelle=-1600, ep_plancher=100, t_fond=200,
    toit="pignon", pente=P, debord=450, revetement="brique",
    niveaux=[("Sol", "± 0", 0), ("Dalle", "+ 200", 200), ("Plafond", "+ 2 640", 2640), ("Faîte", f"+ {fmt(round(faite, -1))}", "faite")],
    notes_elev=["Revêtement : brique d'argile, joints de 10 mm.", "Toiture : bardeaux d'asphalte, pente 6 : 12.",
                "Débord de toit : 450 mm.", "Hexagones : types de fenêtres, voir A-301."],
    etiq_elev={"S": [("Brique d'argile", 0.03, 1500, -900, 0), ("Bardeaux d'asphalte", 0.08, zm + 1200, -1100, 300)]},
    type_plancher="dalle", murs_coupe=[(4500, 125)],
    etiq_coupe=[("T1 (toit)", 1800, zm + 1800 * P + 120, -3300, 0), ("Isolant R-41", 3000, zm + 200, -4400, 0),
                ("M1 (mur ext.)", 125, 1500, -1300, 0), ("D1 (dalle)", 1500, 150, -2900, 0), ("F1 (fondation)", 100, -800, -1300, 0)],
    coupe_y=150, coupe_titre_x=236,
    compositions=["T1 — Toit : bardeaux d'asphalte, membrane, contreplaqué 12,7, fermes 600 c/c, isolant soufflé R-41, pare-vapeur, gypse 12,7.",
                  "M1 — Mur extérieur : brique 90, vide d'air 25, panneau isolant 25, OSB 11, montants 38 × 140 à 400 c/c, laine R-24, pare-vapeur, gypse 12,7.",
                  "M3 — Mur mitoyen : 2 × gypse type X, montants 38 × 89, vide d'air 25, montants 38 × 89, 2 × gypse type X. Indice 1 h.",
                  "D1 — Dalle : béton 100, 25 MPa, treillis, polyéthylène, isolant rigide 50, pierre concassée 150.",
                  "F1 — Fondation : mur antigel 200, 25 MPa, semelle 600 × 250, drain français."],
    fond_int=[(8000, 250, 8000, 8750)],
    etiq_fond=[("DALLE SUR SOL — LOGEMENT A", 4000, 4500), ("DALLE SUR SOL — LOGEMENT B", 12000, 4500), ("Mur mitoyen sur semelle", 8000, 9500)],
    notes_struct=["Béton : 25 MPa à 28 jours, air entraîné 5 à 8 %.", "Murs antigel : semelle à 1 600 mm sous le sol fini.",
                  "Dalle : béton 100 sur isolant rigide 50 et pierre concassée 150 compactée.", "Joint de contrôle de la dalle : à tous les 4,5 m maximum.",
                  "Sous le mur mitoyen : semelle continue, même profondeur que les murs extérieurs."],
    plomb=dict(reseaux=[reseau_A, reseau_B], h_plafond=2440, h_toit=5000,
               etiq=[('EF', 1500, 1700, EF, "c"), ('EC', 1500, 1450, EC, "c"), ('Collecteur Ø 3" sous dalle', 2000, 2550, DR, "c"),
                     ("Vers l'égout", 3100, -900, DR, "g"), ("Vers l'égout", M(3100), -900, DR, "d")]),
    titre_iso="SCHÉMA ISOMÉTRIQUE — LOGEMENT A (B SYMÉTRIQUE)",
    notes_plomb=["Chaque logement a son entrée d'eau, son compteur et son raccordement à l'égout.", "Drainage sous la dalle : ABS cédule 40, pente 2 %.",
                 "Eau : PEX avec robinets d'arrêt sur chaque appareil.", "Chauffe-eau électrique 180 L dans chaque logement."],
    sans_elec=[], detecteurs=["chambre 1", "chambre 2", "séjour et cuisine"], dense_prises={"salle\nde bain": False, "mécanique\net lavage": False},
    panneaux=[(6900, 2437, 180, "Panneau\n200 A", (7450, 2050)), (M(6900), 2437, 180, "Panneau\n200 A", (M(7450), 2050))], lum_pos={"103": (6150, 1550), "203": (M(6150), 1550)},
    prises_speciales=[("Cuisinière", (650, 2350), "40 A 240 V", -380), ("Sécheuse", (6900, 600), "30 A 240 V"), ("Chauffe-eau", (7450, 1450), "30 A 240 V", None),
                      ("Cuisinière", (M(650), 2350), "40 A 240 V", -380), ("Sécheuse", (M(6900), 600), "30 A 240 V"), ("Chauffe-eau", (M(7450), 1450), "30 A 240 V", None)],
    notes_elec=["Une entrée électrique et un compteur par logement.", "Plinthes électriques : voir M-101 (circuits 240 V).",
                "Prises de la cuisine : circuits de 20 A avec prises T.", "Avertisseurs de fumée reliés dans chaque logement."],
    sans_chauffage=["mécanique\net lavage", "salle\nde bain"],
    cvca=dict(type="plinthes",
              plinthes_extra=[(5560, 2700, 5660, 3200, 500), (M(5660), 2700, M(5560), 3200, 500)],
              thermostats=[(5000, 1600, ""), (2600, 4300, ""), (5500, 4300, ""), (M(5000), 1600, ""), (M(2600), 4300, ""), (M(5500), 4300, "")],
              equipements=[(6400, 1650, 7100, 2300, "VRC"), (M(7100), 1650, M(6400), 2300, "VRC")],
              vrc=[([(6750, 2300), (6750, 3200)], "Extraction SdB 25 L/s"), ([(6550, 2300), (6550, 2450), (1300, 2450), (1300, 3900)], "Extraction cuisine 25 L/s"),
                   ([(M(6750), 2300), (M(6750), 3200)], "Extraction SdB 25 L/s"), ([(M(6550), 2300), (M(6550), 2450), (M(1300), 2450), (M(1300), 3900)], "Extraction cuisine 25 L/s")]),
    notes_cvca=["Plinthes électriques sous les fenêtres, puissance environ 100 W/m² de plancher.", "Thermostat électronique dans chaque pièce chauffée.",
                "VRC dans chaque logement : extraction de la salle de bain et de la cuisine.", "Hotte de cuisinière évacuée directement à l'extérieur."],
    site=dict(N=200, echelle_txt="1:200", lot=(22000, 32000), pos=(3000, 7500), rue=1500, nom_rue="Avenue du Parc", lot_no="5 234 567",
              pavages=[(400, 0, 2700, 11000, "ALLÉE A"), (19300, 0, 21600, 11000, "ALLÉE B")],
              services_x=[3000, M(4500)], elec=(3000 + 8000, 7500), pluvial=False,
              arbres=[(5000, 26000, 2000), (17000, 27000, 2200), (11000, 29500, 1500)],
              niveaux=[(300, 300, "98,20"), (21700, 300, "98,10"), (300, 31700, "98,90"), (21700, 31700, "98,75"), (11000, 7500 + 9000 + 900, "98,55")],
              notes=["Implantation à confirmer par un arpenteur-géomètre.", "Marge avant minimale : 6,0 m. Marges latérales : 2,5 m.",
                     "Deux entrées de services (logements A et B).", "Niveaux du terrain en mètres (altitude géodésique)."]),
    donnees=[["Usage", "Habitation, 2 logements jumelés"], ["Étages", "1 (plain-pied)"], ["Superficie brute", f"{str(round(W * D / 1e6, 1)).replace('.', ',')} m²"],
             ["Structure", "Ossature de bois, dalle sur sol"], ["Séparation", "Mur mitoyen coupe-feu 1 h"], ["Chauffage", "Plinthes électriques + VRC"],
             ["Eau et égout", "Réseaux municipaux, 2 entrées"], ["Lot", "22 000 × 32 000"]],
)

if __name__ == "__main__":
    duplex.produire("sortie/Dossier-2-Duplex-jumele.pdf")
    print("ok")
