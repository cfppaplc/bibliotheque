# -*- coding: utf-8 -*-
"""Dossier 1 — Grande maison contemporaine (24 × 10,8 m) : volume central à 2 étages entre deux ailes basses, toits monopentes
inversés à grands débords, pierre / zinc / cèdre brûlé, sous-sol sous le volume central (2026)."""
from etages import *

EP = 300                                   # planchers : solives en I 302 + contreplaqué
ZSS, ZP1, ZP2 = -2100, 600, 3640           # dessus des planchers : sous-sol (dalle), rez-de-chaussée, étage
ZT, EPT, ZPAR = 6700, 350, 8200            # toit du volume central : dessus de la structure à l'égout, épaisseur, hauteur max.
dossier = dict(projet="MAISON UNIFAMILIALE\nDOSSIER 1", adresse="125, rue des Érables\nVille fictive (Québec)", date="Octobre 2026", code="D1")

types_fen = {
    "A": dict(h=2100, allege=300, ouv="Fixe et battant (pleine hauteur)", verre="Triple, faible émissivité, argon"),
    "B": dict(h=1500, allege=900, ouv="Battant, à manivelle", verre="Triple, faible émissivité, argon"),
    "C": dict(h=600, allege=1600, ouv="Auvent", verre="Triple, givré"),
    "D": dict(h=1100, allege=1100, ouv="Battant, à manivelle", verre="Triple, faible émissivité"),
    "E": dict(h=600, allege=1650, ouv="Coulissante (sous-sol)", verre="Double, faible émissivité"),
    "F": dict(h=1100, allege=1050, ouv="Battant — issue (margelle)", verre="Double, faible émissivité"),
}
EF_, EC_ = EF, EC

# ============================================================ SOUS-SOL
# Le sous-sol reprend l'ancien plan de 11 × 8,5 m (coordonnées de base ci-dessous). Il est ensuite déplacé de 3 400 vers l'est et
# étiré en profondeur (agrandir_ss) pour se placer sous le volume central, entre les deux ailes basses.
W, D, t = 11000, 8500, 300
S, N, O, E = t / 2, D - t / 2, t / 2, W - t / 2
XE0, XE1 = 2450, 3650                      # cage d'escalier (axes des murs), coordonnées de base
commun = dict(dossier=dossier, W=W, D=D, t=t, types_fen=types_fen, Nplan=50, comptoirs=[], decal_etiq={}, cotes_interieures=[],
              coupes=[], coupe_long=dict(y=6900, N=75, lettre="B"),
              sans_elec=[], dense_prises={}, lum_pos={}, prises_speciales=[], panneaux=[])

# ======================================================================== SOUS-SOL
ss = niveau(commun, no_plan="A-101", titre_plan="PLAN DU SOUS-SOL", no_plomb="P-101", titre_plomb="PLOMBERIE\nSOUS-SOL",
    no_elec="E-101", titre_elec="ÉLECTRICITÉ\nSOUS-SOL", no_cvca="M-101", titre_cvca="CHAUFFAGE ET VENTILATION\nSOUS-SOL", zf=ZSS, hc=2380,
    murs_int=[(XE0, 300, XE0, 4350, 125), (300, 4350, XE1, 4350, 125), (XE1, 1300, XE1, 8200, 125), (XE1, 5450, 10700, 5450, 125), (6550, 5450, 6550, 8200, 125)],
    portes=[dict(no="001", axe="v", at=XE0, s=400, w=860, sens=-1, pivot="a", quinc="Passage"),
            dict(no="002", axe="v", at=XE1, s=4500, w=815, sens=-1, pivot="a", quinc="Passage"),
            dict(no="003", axe="h", at=5450, s=4200, w=760, sens=1, pivot="a", quinc="Intimité (verrou)"),
            dict(no="004", axe="h", at=5450, s=7000, w=815, sens=1, pivot="b", quinc="Passage")],
    fenetres=[dict(type="E", axe="h", at=S, s=5000, w=1200), dict(type="E", axe="h", at=S, s=8100, w=1200),
              dict(type="F", axe="v", at=E, s=6300, w=1000), dict(type="E", axe="h", at=N, s=4800, w=900), dict(type="E", axe="v", at=O, s=6000, w=900)],
    locaux=[("001", "Salle mécanique", 300, 300, 2387, 4287), ("002", "Salle familiale", 3712, 300, 10700, 5387),
            ("003", "Salle de bain", 3712, 5512, 6487, 8200), ("004", "Chambre 4", 6612, 5512, 10700, 8200), ("005", "Rangement", 300, 4412, 3587, 8200)],
    decal_etiq={"001": (0, 900), "005": (0, 600)},
    app=[("ce", 900, 3700, 0), ("dp", 1500, 2700, 0), ("dou", 4200, 8200, 180), ("wc", 6487, 7300, 90), ("lav", 5400, 8200, 180)],
    escaliers=[(2512, 1300, 3588, 4300, 12, "n", "MONTE AU RDC", None, False)],
    cotes_interieures=[(300, XE0, 6000, "h"), (300, 4350, 1200, "v"), (5450, 8200, 10200, "v")],
    notes_plan=["Toutes les cotes sont en millimètres.", "Hauteur libre sous les solives : 2 380 mm.", "Mur de fondation : béton 250 isolé à l'extérieur (voir A-302).",
                "Fenêtre F : issue de secours de la chambre, margelle de 1 000 de profondeur.", "Poutre d'acier et poteaux : voir S-101."],
    # structure (S-101)
    t_fond=250, poutres=[(XE1, 4350, 10700, 4350, "Poutre d'acier W200 × 36 (sous le RDC)")],
    poteaux=[(6000, 4350, 700, "Poteau d'acier Ø 89 sur semelle 700 × 700 × 300"), (8350, 4350, 700, "")],
    cotes_fond=[(0, 4350, 12300, "v")], Nfond=75, axes_fond=[XE1, 10700],
    etiq_fond=[("DALLE SUR SOL 100 — voir D1", 7000, 2400)], fond_int=[],
    notes_struct=["Béton : 25 MPa à 28 jours, air entraîné 5 à 8 %.", "Semelles à 1 600 mm minimum sous le sol fini (gel); ici le dessous est à 2 600.",
                  "Murs de fondation 250 armés, isolant rigide 50 à l'extérieur, membrane d'étanchéité, drain français.",
                  "Capacité portante présumée : 75 kPa. Faire valider par un ingénieur.", "Solives du RDC appuyées sur la poutre d'acier."],
    # plomberie
    plomb=dict(reseaux=[dict(coll=[(7950, 7900), (2450, 7900), (2450, 4300), (2000, 4300)], sortie=[(2000, 4300), (2000, -1200)], chutes=[(2450, 4300), (7950, 7900)],
                             ef=[(1200, -1200), (1200, 3300), (2250, 3300), (2250, 7700), (6300, 7700)], ec=[(1150, 3550), (2150, 3550), (2150, 7600), (6300, 7600)],
                             compteur=(1200, 900), lab_sens=1)],
               etiq=[('Collecteur Ø 4" sous la dalle · pente 2 %', 5200, 7700, DR, "c"), ("Vers l'égout municipal", 1850, -1000, DR, "d"),
                     ("Entrée d'eau municipale", 1350, -900, EF_, "g"), ("Chutes Ø 3\" (voir P-104)", 8100, 7600, DR, "g")]),
    notes_plomb=["Collecteur principal sous la dalle : ABS cédule 40, pente 2 %.", "Clapet antiretour sur le collecteur, accessible (regard).",
                 "Chauffe-eau électrique 270 L : soupape T et P raccordée à 150 mm du sol.", "Drain de plancher de la salle mécanique avec amorceur de siphon.",
                 "Les colonnes de chute montent jusqu'au toit (voir P-104)."],
    # électricité
    detecteurs=["salle familiale", "salle mécanique", "chambre 4", "rangement"], dense_prises={"salle de bain": False, "salle mécanique": False, "rangement": False},
    panneaux=[(2387, 2200, 90, "Panneau 200 A\n120/240 V\n40 circuits", (1350, 2900))],
    prises_speciales=[("Chauffe-eau", (1000, 3100), "30 A 240 V", -380), ("Fournaise", (1700, 1500), "100 A 240 V", -380), ("Thermopompe (ext.)", (10350, 900), "30 A 240 V", 380)],
    notes_elec=["Installation selon le Code de construction du Québec, chapitre V — Électricité.", "Entrée électrique souterraine jusqu'au panneau de la salle mécanique.",
                "Avertisseurs de fumée et de CO reliés entre eux à chaque niveau.", "Prises de la salle de bain : protection DDFT."],
    # CVCA
    cvca=dict(type="air", gaines=[([(2500, 4500), (10400, 4500)], 300, "Conduit principal 300 × 200 (plafond du sous-sol)")],
              diffuseurs=[(5000, 900, "20 L/s", True), (8600, 900, "20 L/s", True), (5000, 7600, "15 L/s", True), (9800, 7600, "20 L/s", True)],
              retours=[(7000, 3600, "Retour 300 × 150"), (1400, 3900, "Retour")],
              equipements=[(700, 800, 1600, 1700, "FOURNAISE\n20 kW"), (1700, 2900, 2300, 3500, "VRC"), (11300, 1000, 12300, 2000, "THERMOPOMPE\n(extérieur)")],
              lignes=[([(11300, 1500), (2387, 1500)], CVC_R, "  Frigorigène")],
              vrc=[([(2000, 3200), (2000, 6200), (4600, 6200)], "Extraction SdB 25 L/s")]),
    notes_cvca=["Fournaise électrique 20 kW et thermopompe centrale de 2 tonnes.", "Conduits d'acier galvanisé dans le plafond du sous-sol, colonnes vers les étages (voir M-102, M-103).",
                "VRC : extraction des salles de bain et de la cuisine, air neuf au retour de la fournaise.", "Débits en litres par seconde (L/s)."],
)



# ============================================================ DIMENSIONS FINALES
KY, YB, DX = 1.6, 4400, 3400
def Yf(y): return y if y <= YB else YB + (y - YB) * KY
W, D, t = 24000, round(Yf(8200)) + 300, 300          # 24 000 × 10 780
S, N, O, E = t / 2, D - t / 2, t / 2, W - t / 2
XL, XRG = 5600, 14100                      # volume central (2 étages) : de x = 5 600 à 14 100; ailes basses de chaque côté
OE, EE = XL + t // 2, XRG - t // 2         # axes des murs ouest et est de l'étage
XE0, XE1 = 5850, 7050                      # cage d'escalier (axes des murs)

# ---- sous-sol : déplacement et étirement des coordonnées de base
def agrandir_ss(lv):
    X = lambda x: round(x + DX)
    Y = lambda y: round(Yf(y))
    PX = lambda p: (X(p[0]), Y(p[1]))
    PL = lambda l: [PX(p) for p in l]
    BS, BN, BO, BE = 150, 8350, 150, 10850          # axes des murs extérieurs de base
    nS, nN, nO, nE = 150, D - 150, DX + 150, DX + 11000 - 150
    sym = {BS: nS, BN: nN, BO: nO, BE: nE}
    lv.murs_int = [(X(a), Y(b), X(c), Y(e), w) for (a, b, c, e, w) in lv.murs_int]
    for o in lv.portes + lv.fenetres:
        if o["at"] in sym:
            o["s"] = X(o["s"]) if o["axe"] == "h" else Y(o["s"]); o["at"] = sym[o["at"]]
        elif o["axe"] == "h": o["at"], o["s"] = Y(o["at"]), X(o["s"])
        else: o["at"], o["s"] = X(o["at"]), Y(o["s"])
    lv.locaux = [(no, nm, X(a), Y(b), X(c), Y(e)) for (no, nm, a, b, c, e) in lv.locaux]
    lv.app = [(k, X(x), Y(y), r) for (k, x, y, r) in lv.app]
    lv.cotes_interieures = [((X(a), X(b), Y(p), o) if o == "h" else (Y(a), Y(b), X(p), o)) for (a, b, p, o) in lv.cotes_interieures]
    lv.escaliers = [(X(a), Y(b), X(c), Y(e), n, sn, tx, pal, vd) for (a, b, c, e, n, sn, tx, pal, vd) in lv.escaliers]
    lv.prises_speciales = [(lab, PX(p), sp, off) for (lab, p, sp, off) in lv.prises_speciales]
    lv.panneaux = [(*PX((x, y)), r, lab, PX(lp)) for (x, y, r, lab, lp) in lv.panneaux]
    cv = lv.cvca
    cv["gaines"] = [(PL(p), w_, lab) for (p, w_, lab) in cv["gaines"]]
    cv["diffuseurs"] = [(*PX((x, y)), lab, fl) for (x, y, lab, fl) in cv["diffuseurs"]]
    cv["retours"] = [(*PX((x, y)), lab) for (x, y, lab) in cv["retours"]]
    cv["equipements"] = [(*PX((a, b)), *PX((c, e)), lab) for (a, b, c, e, lab) in cv["equipements"]]
    cv["lignes"] = [(PL(p), col, lab) for (p, col, lab) in cv["lignes"]]
    cv["vrc"] = [(PL(p), lab) for (p, lab) in cv["vrc"]]
    lv.poutres = [(*PX((a, b)), *PX((c, e)), lab) for (a, b, c, e, lab) in lv.poutres]
    lv.poteaux = [(*PX((x, y)), s_, lab) for (x, y, s_, lab) in lv.poteaux]
    lv.cotes_fond = [((X(a), X(b), Y(p), o) if o == "h" else (Y(a), Y(b), X(p), o)) for (a, b, p, o) in lv.cotes_fond]
    lv.axes_fond = [X(a) for a in lv.axes_fond]
    lv.etiq_fond = [(lab, *PX((x, y))) for (lab, x, y) in lv.etiq_fond]
    # plomberie du sous-sol : collecteur sous la dalle jusqu'aux deux chutes (7 700 / 13 200, 10 400)
    lv.plomb = dict(reseaux=[dict(coll=[(13200, 10400), (7700, 10400), (7700, 4300), (5300, 4300)], sortie=[(5300, 4300), (5300, -1200)], chutes=[(7700, 10400), (13200, 10400)],
                                  ef=[(4500, -1200), (4500, 3300), (5650, 3300), (5650, 10250), (7600, 10250)], ec=[(4450, 3550), (5550, 3550), (5550, 10150), (7600, 10150)],
                                  compteur=(4500, 900), lab_sens=1)],
                    etiq=[('Collecteur Ø 4" sous la dalle · pente 2 %', 10200, 10250, DR, "c"), ("Vers l'égout municipal", 5150, -1000, DR, "d"),
                          ("Entrée d'eau municipale", 4650, -900, EF_, "g"), ("Chutes Ø 3\" (voir P-104)", 7900, 9500, DR, "g")])
    lv.W, lv.D = W, D
    lv.emprise = (DX, DX + 11000); lv.S, lv.N_, lv.O, lv.E = nS, nN, nO, nE
    lv.Nplan, lv.Nfond = 100, 120
    lv.coupes = [(6450, -1250, "A", "e"), (6450, D + 1250, "A", "e")]; lv.coupe_long = dict(y=8800, N=150, lettre="B")
agrandir_ss(ss)

commun = dict(dossier=dossier, W=W, D=D, t=t, types_fen=types_fen, Nplan=100, comptoirs=[], decal_etiq={}, cotes_interieures=[],
              coupes=[(6450, -1250, "A", "e"), (6450, D + 1250, "A", "e")], coupe_long=dict(y=8800, N=120, lettre="B"),
              sans_elec=[], dense_prises={}, lum_pos={}, prises_speciales=[], panneaux=[])

# ============================================================ REZ-DE-CHAUSSÉE (toute l'emprise : aile d'entrée, volume central, aile familiale)
rdc = niveau(commun, no_plan="A-102", titre_plan="PLAN DU REZ-DE-CHAUSSÉE", no_plomb="P-102", titre_plomb="PLOMBERIE\nREZ-DE-CHAUSSÉE",
    no_elec="E-102", titre_elec="ÉLECTRICITÉ\nREZ-DE-CHAUSSÉE", no_cvca="M-102", titre_cvca="CHAUFFAGE ET VENTILATION\nREZ-DE-CHAUSSÉE", zf=ZP1, hc=2740,
    tremies=[(XE0, 300, XE1, 4350)],
    murs_int=[(XE0, 300, XE0, 4350, 125), (300, 4350, XE0, 4350, 125), (2900, 300, 2900, 4350, 125), (300, 3050, 2900, 3050, 125),
              (5850, 8650, 7825, 8650, 125), (5850, 8650, 5850, 10480, 125), (7825, 8650, 7825, 10480, 125),
              (14100, 300, 14100, 1500, 125), (14100, 4500, 14100, 7200, 125), (14100, 9400, 14100, 10480, 125),
              (14100, 5862, 17700, 5862, 125), (19500, 5862, 23700, 5862, 125)],
    portes=[dict(no="101", axe="h", at=S, s=1000, w=1000, sens=1, pivot="a", h=2400, mat="Acier isolé, vitrage pleine hauteur", quinc="Serrure + pêne dormant"),
            dict(no="102", axe="h", at=N, s=8100, w=1800, genre="coulissante", h=2400, mat="PVC, vitrage triple", quinc="Loquet + barre de sécurité"),
            dict(no="103", axe="v", at=2900, s=400, w=860, sens=1, pivot="a", quinc="Passage"),
            dict(no="104", axe="h", at=3050, s=900, w=760, sens=-1, pivot="b", quinc="Passage"),
            dict(no="105", axe="h", at=4350, s=3300, w=900, sens=1, pivot="a", quinc="Passage"),
            dict(no="106", axe="v", at=7825, s=9000, w=760, sens=-1, pivot="a", quinc="Intimité (verrou)"),
            dict(no="107", axe="v", at=E, s=7200, w=2400, genre="coulissante", h=2400, mat="PVC, vitrage triple", quinc="Loquet + barre de sécurité")],
    fenetres=[dict(type="A", axe="h", at=S, s=3100, w=2400), dict(type="A", axe="h", at=S, s=7500, w=2600), dict(type="A", axe="h", at=S, s=10600, w=3000),
              dict(type="A", axe="h", at=S, s=14500, w=3000), dict(type="A", axe="h", at=S, s=18000, w=3000), dict(type="A", axe="h", at=S, s=21500, w=2000),
              dict(type="A", axe="h", at=N, s=900, w=2600), dict(type="A", axe="h", at=N, s=3900, w=1500), dict(type="C", axe="h", at=N, s=6300, w=600),
              dict(type="D", axe="h", at=N, s=12200, w=1800), dict(type="A", axe="h", at=N, s=15000, w=3000), dict(type="A", axe="h", at=N, s=19000, w=3000),
              dict(type="D", axe="h", at=N, s=22300, w=1200),
              dict(type="A", axe="v", at=O, s=600, w=1700), dict(type="C", axe="v", at=O, s=3300, w=600), dict(type="A", axe="v", at=O, s=5500, w=2600), dict(type="A", axe="v", at=O, s=8600, w=1800),
              dict(type="A", axe="v", at=E, s=800, w=2400), dict(type="A", axe="v", at=E, s=3400, w=2000)],
    locaux=[("101", "Vestibule", 300, 300, 2837, 2987), ("102", "Garde-robe", 300, 3112, 2837, 4287), ("103", "Bibliothèque", 2962, 300, 5787, 4287),
            ("104", "Salon", 300, 4412, 5787, 10480), ("105", "Séjour", 7112, 300, 14037, 4287), ("106", "Salle d'eau", 5912, 8712, 7762, 10480),
            ("107", "Salle à manger", 5912, 4412, 10000, 8587), ("108", "Cuisine", 10100, 4412, 14037, 10480),
            ("109", "Salle familiale", 14162, 300, 23700, 5800), ("110", "Salle de jeux", 14162, 5925, 23700, 10480)],
    decal_etiq={"105": (1200, 0), "108": (0, -1500)},
    app=[("wc", 5912, 9400, 270), ("lav", 6900, 10480, 180), ("evd", 13100, 10480, 180), ("lv", 12300, 10480, 180)],
    comptoirs=[(10200, 9880, 14037, 10480, None), (13437, 7800, 14037, 9880, None), (10600, 6800, 12800, 7700, "îlot")],
    escaliers=[(5912, 1300, 6988, 4300, 12, "n", "MONTE À L'ÉTAGE", (5912, 300, 6988, 1300), False)],
    cotes_interieures=[(300, 2900, 1900, "h"), (300, 3050, 500, "v"), (3050, 4350, 500, "v")],
    notes_plan=["Toutes les cotes sont en millimètres.", "Cotes extérieures prises à la face extérieure du panneau OSB.", "Hauteur libre sous plafond : 2 740 mm.",
                "Escalier : volée de 12 contremarches, palier au sud. L'escalier du sous-sol est juste en dessous (même sens).",
                "Aile ouest (entrée) et aile est (salle familiale) : un seul niveau; l'étage n'occupe que le volume central.",
                "Garde-corps de verre de 900 le long de la cage, côté séjour.", "Comptoirs : profondeur 600, hauteur 915; îlot de 900."],
    plomb=dict(reseaux=[dict(coll=[(7700, 10350), (6000, 10350)], chutes=[(7700, 10400)], ef=[(7600, 10250), (6000, 10250)], ec=[(7600, 10150), (6900, 10150)]),
                        dict(coll=[(13200, 10350), (11800, 10350)], chutes=[(13200, 10400)], ef=[(13100, 10250), (11800, 10250)], ec=[(13100, 10150), (11800, 10150)])],
               etiq=[("Chute C-1 Ø 3\"", 7500, 9500, DR, "d"), ("Chute C-2 Ø 3\"", 13000, 9500, DR, "d"), ("Branchements dans le plancher (solives en I)", 10000, 8900, DR, "c")]),
    notes_plomb=["Branchements dans l'épaisseur du plancher, vers les chutes C-1 et C-2.", "Lave-vaisselle raccordé au siphon de l'évier (boucle anti-retour).",
                 "Eau : PEX, robinet d'arrêt sur chaque alimentation d'appareil."],
    detecteurs=["séjour", "vestibule", "salle familiale", "salon"], dense_prises={"salle d'eau": False, "vestibule": False, "garde-robe": False},
    prises_speciales=[("Cuisinière 240 V", (11500, 10350), "40 A 240 V", 380), ("Lave-vaisselle", (12300, 10350), "15 A 120 V", -380), ("Hotte", (11500, 9500), "15 A 120 V", 380)],
    notes_elec=["Prises du comptoir : circuits de 20 A avec prises T, protection DDFT près de l'évier.", "Éclairage encastré DEL au séjour et à la cuisine.",
                "Aucun point le long d'un mur à plus de 1,8 m d'une prise."],
    cvca=dict(type="air", gaines=[([(XE1 + 100, 4500), (13500, 4500)], 300, "Conduit principal sous le plancher (voir M-101)")],
              diffuseurs=[(1500, 700, "10 L/s", True), (4000, 700, "20 L/s", True), (8500, 700, "30 L/s", True), (12000, 700, "30 L/s", True), (16000, 700, "30 L/s", True),
                          (20500, 700, "30 L/s", True), (2500, 7500, "25 L/s", True), (8200, 5200, "25 L/s", True), (11800, 5300, "25 L/s", True),
                          (15500, 8000, "25 L/s", True), (20500, 8000, "25 L/s", True)],
              retours=[(8000, 3400, "Retour 300 × 150"), (15000, 3500, "Retour")],
              vrc=[([(6900, 9800), (6900, 9200)], "Extraction 25 L/s"), ([(13000, 9600), (12300, 9600)], "Hotte 50 L/s (évacuation directe)")]),
    notes_cvca=["Diffuseurs au plancher, sous les grandes fenêtres.", "Retours au mur intérieur, ramenés au sous-sol.", "Hotte de cuisinière évacuée directement à l'extérieur."],
)

# ============================================================ ÉTAGE (volume central seulement)
et = niveau(commun, no_plan="A-103", titre_plan="PLAN DE L'ÉTAGE", no_plomb="P-103", titre_plomb="PLOMBERIE\nÉTAGE",
    no_elec="E-103", titre_elec="ÉLECTRICITÉ\nÉTAGE", no_cvca="M-103", titre_cvca="CHAUFFAGE ET VENTILATION\nÉTAGE", zf=ZP2, hc=2610,
    tremies=[(XE0, 300, XE1, 4350)],
    murs_int=[(XE1, 300, XE1, 4350, 125), (10462, 300, 10462, 5200, 125), (XE1, 5200, EE, 5200, 125), (OE, 6700, EE, 6700, 125),
              (8262, 6700, 8262, 10480, 125), (9862, 6700, 9862, 10480, 125), (11962, 6700, 11962, 10480, 125)],
    portes=[dict(no="202", axe="h", at=5200, s=8000, w=815, sens=-1, pivot="a", quinc="Passage"),
            dict(no="203", axe="h", at=5200, s=11000, w=815, sens=-1, pivot="a", quinc="Passage"),
            dict(no="204", axe="h", at=6700, s=7000, w=760, sens=1, pivot="a", quinc="Intimité (verrou)"),
            dict(no="205", axe="h", at=6700, s=8800, w=760, sens=1, pivot="a", quinc="Passage"),
            dict(no="206", axe="h", at=6700, s=10300, w=815, sens=1, pivot="a", quinc="Passage"),
            dict(no="207", axe="h", at=6700, s=12400, w=760, sens=1, pivot="a", quinc="Intimité (verrou)")],
    fenetres=[dict(type="A", axe="h", at=S, s=7500, w=2600), dict(type="A", axe="h", at=S, s=10900, w=2700),
              dict(type="C", axe="h", at=10630, s=6500, w=600), dict(type="C", axe="h", at=10630, s=8600, w=600), dict(type="B", axe="h", at=10630, s=10200, w=1500), dict(type="C", axe="h", at=10630, s=12700, w=900),
              dict(type="B", axe="v", at=EE, s=1500, w=1500), dict(type="C", axe="v", at=EE, s=7500, w=600),
              dict(type="B", axe="v", at=OE, s=1800, w=900), dict(type="C", axe="v", at=OE, s=5600, w=600)],
    locaux=[("202", "Chambre 2", 7112, 300, 10400, 5137), ("203", "Chambre principale", 10525, 300, 13800, 5137), ("204", "Corridor", 5900, 5262, 13800, 6637),
            ("205", "Salle de bain", 5900, 6762, 8200, 10480), ("206", "Buanderie", 8325, 6762, 9800, 10480), ("207", "Bureau", 9925, 6762, 11900, 10480),
            ("208", "Salle de bain\nprincipale", 12025, 6762, 13800, 10480)],
    decal_etiq={},
    app=[("bain", 6600, 10480, 180), ("wc", 8200, 9300, 90), ("lav", 8200, 8100, 90), ("lave", 9000, 10480, 180),
         ("dou", 12800, 10480, 180), ("wc", 12025, 9300, 270), ("lav", 13800, 8000, 90)],
    comptoirs=[(10525, 300, 11125, 2300, "g.-r.")],
    escaliers=[(5912, 1300, 6988, 4300, 12, "s", "DESCEND (vide)", None, True)],
    cotes_interieures=[(OE, XE1, 800, "h"), (XE1, 10462, 800, "h"), (10462, EE, 800, "h"), (5200, 6700, 13300, "v")],
    notes_plan=["Toutes les cotes sont en millimètres.", "Hauteur libre sous plafond : 2 610 mm.", "Cage d'escalier ouverte : garde-corps de 900 au pourtour du vide.",
                "L'étage n'occupe que le volume central (de x = 5 600 à x = 14 100); le toit des ailes est plus bas.", "Buanderie : drain de plancher et bac de récupération sous la laveuse."],
    plomb=dict(reseaux=[dict(coll=[(7700, 10300), (6300, 10300)], chutes=[(7700, 10400)], ef=[(7600, 10200), (6300, 10200)], ec=[(7600, 10100), (6300, 10100)]),
                        dict(coll=[(13200, 10300), (12300, 10300)], chutes=[(13200, 10400)], ef=[(13100, 10200), (12300, 10200)], ec=[(13100, 10100), (12300, 10100)])],
               etiq=[("Chute C-1", 7500, 9800, DR, "d"), ("Chute C-2", 13000, 9700, DR, "d")]),
    notes_plomb=["Branchements dans le plancher de l'étage (solives en I percées selon le fabricant).", "Laveuse : boîte de raccordement encastrée et bac de récupération.",
                 "Douche : drain linéaire, membrane d'étanchéité sous la céramique."],
    detecteurs=["corridor", "chambre principale", "chambre 2", "bureau"], dense_prises={"salle de bain": False, "salle de bain\nprincipale": False, "buanderie": False, "corridor": False},
    prises_speciales=[("Sécheuse 240 V", (8900, 10350), "30 A 240 V", -380)],
    notes_elec=["Chambres : prises protégées par disjoncteur anti-arcs (AFCI).", "Avertisseurs de fumée et de CO dans le corridor et dans chaque chambre, reliés entre eux.",
                "Ventilateurs des salles de bain sur minuterie (reliés au VRC)."],
    cvca=dict(type="air", gaines=[([(XE1 + 100, 5950), (13500, 5950)], 250, "Conduit 250 × 150 dans le plancher du corridor")],
              diffuseurs=[(8800, 700, "20 L/s", True), (12000, 700, "25 L/s", True), (6300, 7500, "10 L/s", True), (9000, 8700, "15 L/s", True), (10900, 8700, "15 L/s", True), (13000, 8000, "10 L/s", True)],
              retours=[(9500, 5950, "Retour (corridor)")],
              vrc=[([(7000, 10350), (7000, 7000)], "Extraction 25 L/s"), ([(13000, 10300), (13000, 7000)], "Extraction 25 L/s"), ([(9000, 10300), (9000, 7000)], "Extraction 15 L/s")]),
    notes_cvca=["Colonne d'alimentation montant du sous-sol dans le mur de l'escalier.", "Un diffuseur sous chaque fenêtre de chambre.", "VRC : extraction des deux salles de bain et de la buanderie."],
)
et.emprise = (XL, XRG); et.O, et.E = OE, EE

maison = MaisonEtages(
    dossier=dossier, nom_court="Maison unifamiliale", W=W, D=D, t=t, lv=[ss, rdc, et], types_fen=types_fen,
    description="Grande maison unifamiliale contemporaine (environ 24 × 10,8 m) : un volume central à deux étages entre une aile d'entrée et une aile familiale d'un seul niveau, "
                "trois toits monopentes à grands débords (900 mm), pierre naturelle, zinc prépatiné et cèdre brûlé, grandes fenêtres pleine hauteur. Sous-sol aménagé sous le volume central. "
                "Chauffage par air pulsé (fournaise électrique et thermopompe), ventilation par VRC.",
    ep=EP, zt=ZT, ep_toit=EPT, zpar=ZPAR, toit_plans=[(0, XL, 3750, 4000), (XL, XRG, 6700, 7700), (XRG, W, 4350, 3750)], mat_centre="bois_brule", debord=900, fascia=350,
    z_sol=0, z_semelle=-2600, t_fond=250,
    chutes=[(7700, 10400), (13200, 10400)], no_iso="P-104",
    niveaux=[("Sol", "± 0", 0), ("Sous-sol", "– 2 100", ZSS), ("RDC", "+ 600", ZP1), ("Étage", "+ 3 640", ZP2), ("Toit des ailes", "+ 4 350", 4350), ("Toit du volume haut", "+ 6 700", ZT), ("Haut du toit", "+ 7 700", 7700)],
    volumes={"S": [(0, XL, "zinc"), (XL, XRG, "bois_brule"), (XRG, W, "pierre")], "N": [(0, W - XRG, "pierre"), (W - XRG, W - XL, "bois_brule"), (W - XL, W, "zinc")],
             "E": [(0, D, "pierre")], "O": [(0, D, "zinc")]},
    marquises={"S": [(600, 2400, ZP1 + 2600)]},
    etiq_elev={"S": [("Zinc prépatiné (aile d'entrée)", 0.04, 5000, 200, 700), ("Cèdre brûlé (volume haut)", 0.5, 7600, 0, 300),
                     ("Marquise d'acier", 0.06, ZP1 + 2700, 1800, 700), ("Béton apparent, crépi", 0.6, 200, 300, -900)],
               "E": [("Pierre naturelle", 0.5, 2500, 300, 700)]},
    notes_elev=["Revêtements : pierre naturelle (aile familiale et mur est), zinc prépatiné à joints debout (aile d'entrée), cèdre brûlé (volume central).",
                "Marquise d'acier en porte-à-faux au-dessus de l'entrée.",
                "Trois toits monopentes (pente d'environ 4 à 10 %) : débords de 900, bandeau d'aluminium noir; le toit du volume haut monte vers l'est, celui de l'aile familiale descend vers l'est.",
                "Fenêtres à cadre noir, verre triple. Hexagones : types de fenêtres, voir A-301.", "Fenêtres du sous-sol : margelles galvanisées (en tirets)."],
    Ncoupe=75, Ncoupe_B=120, Nmur=50, Nelev=140, coupe_A_x=6450, coupe_B_y=8800,
    volees=[(XE0, XE1, 1300, 4300, ZSS, ZP1), (XE0, XE1, 1300, 4300, ZP1, ZP2)],
    couches_mur=[("Zinc à joints debout 1 sur membrane (fourrures 19)", 8, "vinyle"), ("Fourrures 19 × 64 (lame d'air)", 19, "vide"), ("Isolant rigide 50 (R-10)", 50, "isolant_rigide"),
                 ("Panneau OSB 11", 11, "panneau"), ("Montants 38 × 140 à 400 c/c et laine R-24", 140, "laine"), ("Pare-vapeur (polyéthylène 0,15)", 0, "membrane"), ("Gypse 12,7", 13, "gypse")],
    compositions=["T1 — Toit monopente (débord 900) : membrane élastomère 2 plis, isolant rigide en pente, contreplaqué 19, solives en I 356, laine soufflée R-60, pare-vapeur, gypse 12,7.",
                  "M1 — Mur extérieur : zinc à joints debout (ou pierre, ou cèdre brûlé), fourrures 19, isolant rigide 50, OSB 11, montants 38 × 140 à 400 c/c, laine R-24, pare-vapeur, gypse 12,7.",
                  "M2 — Cloison : gypse 12,7 deux faces, montants 38 × 89 à 400 c/c (laine insonorisante autour des salles de bain).",
                  "P1 — Plancher : contreplaqué 19 collé-vissé, solives en I 302 à 400 c/c.", "D1 — Dalle du sous-sol : béton 100, isolant rigide 50, pierre 200.",
                  "F1 — Fondation : mur de béton 250, isolant rigide 50 extérieur, semelle 650 × 250, drain français."],
    site=dict(N=250, echelle_txt="1:250", lot=(36000, 42000), pos=(4000, 9000), rue=1500, nom_rue="Rue des Érables", lot_no="4 123 456",
              pavages=[(W + 4500, 0, W + 7500, 16000, "ALLÉE\nASPHALTE"), (5000, 0, 6200, 9000, ""), (12000, 9000 + D, 21000, 9000 + D + 3300, "TERRASSE")],
              services_x=1500, elec=(4000 + 1500, 9000), pluvial=False,
              arbres=[(2200, 34000, 1900), (33000, 36000, 2300), (16000, 38500, 1600)],
              niveaux=[(300, 300, "124,80"), (35700, 300, "124,65"), (300, 41700, "125,40"), (35700, 41700, "125,25"), (4000 + W // 2, 9000 + D + 800, "125,10")],
              notes=["Implantation à confirmer par un arpenteur-géomètre.", "Marge avant minimale : 7,5 m. Marges latérales : 2,0 m.",
                     "Niveaux du terrain en mètres (altitude géodésique).", "Pente du terrain fini : 2 % minimum en s'éloignant du bâtiment."]),
    donnees=[["Usage", "Habitation unifamiliale"], ["Étages", "Volume central 2 + sous-sol; ailes de plain-pied"], ["Emprise au sol", f"{str(round(W * D / 1e6, 1)).replace('.', ',')} m²"],
             ["Superficie habitable", "environ 480 m² (3 niveaux)"],
             ["Structure", "Ossature de bois, solives en I, fondation de béton"], ["Toiture", "Trois monopentes, membrane élastomère, débords 900"], ["Chauffage", "Air pulsé + thermopompe, VRC"],
             ["Eau et égout", "Réseaux municipaux"], ["Lot", "36 000 × 42 000"]],
)

if __name__ == "__main__":
    import sys
    maison.produire(sys.argv[1] if len(sys.argv) > 1 else "/home/claude/plans-lecture/sortie/Dossier-1-Maison-unifamiliale.pdf")
    print("ok")
