# -*- coding: utf-8 -*-
"""Dossier 5 : ferme laitière moderne — étable à stabulation libre, robots de traite, racleurs et repousse-fourrage automatiques.
Feuilles : 000, A-100 (implantation de la ferme), A-101 (plan de l'étable), A-201 (élévations), A-301 (coupe transversale),
S-101 (fondations), P-101 (eau et drainage), E-101 (électricité, ventilation et automatisation).
Unités : millimètres. S'appuie sur le moteur de dessin (dessin.py)."""
import math
from dessin import *

W, D, T = 66000, 29000, 250          # étable : longueur, largeur, épaisseur des murs
XS = 9000                              # fin du bloc de service (ouest)
XV = 60000                             # début de l'aile des veaux (est)
ZC, ZF = 4500, 7056                    # corniche et faîte (toit à deux versants, pente 10°)
DOSSIER = dict(projet="FERME LAITIÈRE\nDOSSIER 5", adresse="1 280, rang des Prairies\nVille fictive (Québec)", date="Octobre 2026", code="D5")

# bandes de l'étable (y)
TA_S, AL_S, ST1, ST2, AL_C, ST3, ST4, AL_N, TA_N = (250, 3750), (3750, 7350), (7350, 9950), (9950, 12550), (12550, 16150), (16150, 18750), (18750, 21350), (21350, 24950), (24950, 28750)
TRAVERSES = [(29000, 32000), (45000, 48000)]
LOG_W = 1250

BOIS, LAME = HexColor("#d3a26a"), HexColor("#a9773f")
TOLE, NERV = HexColor("#c9d1d6"), HexColor("#9aa6ad")
BETON = HexColor("#cfcfcb")
RIDEAU = HexColor("#dbe9f2")
SOLAIRE, SOLAIRE_L = HexColor("#27466b"), HexColor("#6f8fb5")
ROBOT, RACLEUR, REPOUSSE = HexColor("#e8892b"), HexColor("#d8b400"), HexColor("#b25a1e")
EAU_C = HexColor("#9cc3f0")
VERT_P = HexColor("#cfe3c4")


def ellipse(cx, cy, rx, ry, n=28):
    return [(cx + rx * math.cos(2 * math.pi * k / n), cy + ry * math.sin(2 * math.pi * k / n)) for k in range(n)]


def logettes():
    """Positions x des logettes (largeur 1 250) sans les traverses ni la zone des robots."""
    xs, x = [], 12700
    while x + LOG_W <= 59500:
        if not any(a - LOG_W < x < b for (a, b) in TRAVERSES): xs.append(x)
        x += LOG_W
    return xs


XS_LOG = logettes()
N_LOG = len(XS_LOG) * 4


class Ferme:
    nom = "Ferme laitière"

    # ------------------------------------------------------------------ outils
    def _centrer_plan(self, f, N, bas=100):
        w = W / N
        f.vue(DRAW[0] + ((DRAW[2] - DRAW[0]) - w) / 2, bas, N)

    def _contour(self, f, pale=False):
        f.rect(0, 0, W, D, 1.0, fill=GRIS_C if pale else GRIS)
        f.rect(T, T, W - T, D - T, .7, fill=white)

    def _cloisons(self, f):
        # bloc de service (ouest)
        f.rect(XS - 125, T, XS + 125, D - T, .6, fill=GRIS_TC)
        for y in (6000, 11500, 17700, 22500):
            f.rect(T, y - 62, XS, y + 62, .6, fill=GRIS_TC)
        # aile des veaux (est)
        f.rect(XV - 125, T, XV + 125, D - T, .6, fill=GRIS_TC)
        for y in (9500, 19000):
            f.rect(XV, y - 62, W - T, y + 62, .6, fill=GRIS_TC)
        # ouvertures : portillons vers les enclos (sud), porte des veaux (est), accès au bloc de service
        for (x0, x1) in ((20000, 23000), (40000, 43000)):
            f.rect(x0, -60, x1, T + 60, 0, col=white, fill=white); f.ligne(x0, 0, x1, 0, .35, dash=[3, 2])
        f.rect(W - T - 60, 12500, W + 60, 16500, 0, col=white, fill=white)
        for (y0, y1) in ((1000, 2000), (13500, 14700)):
            f.rect(-60, y0, T + 60, y1, 0, col=white, fill=white)
        for (xa, xb, y) in ((XS, XS, 8800), (XS, XS, 14500), (XS, XS, 20000)):
            f.rect(xa - 160, y - 600, xa + 160, y + 600, 0, col=white, fill=white)
        # rideaux latéraux (nord et sud) et faîtière ouverte
        for y in (0, D): f.ligne(XS, y, XV, y, 1.6, black, dash=[6, 3])

    def _etable(self, f, equip=True):
        """Dessin de l'intérieur : tables d'alimentation, logettes, allées, robots de traite."""
        # tables d'alimentation (sol surélevé) et cornadis
        for (a, b) in (TA_S, TA_N):
            f.rect(XS + T, a, XV - T, b, .3, fill=VERT_P)
        for y in (TA_S[1], TA_N[0]):
            f.ligne(XS + T, y, XV - T, y, 1.0)
            x = XS + 700
            while x < XV - 700: f.ligne(x, y - 150, x, y + 150, .25); x += 700
        # logettes
        for (a, b) in (ST1, ST2, ST3, ST4):
            for x in XS_LOG: f.rect(x, a, x + LOG_W, b, .15, fill=white)
        for (a, b) in ((ST1[0], ST2[1]), (ST3[0], ST4[1])):
            f.ligne(12700, (a + b) / 2, 59500, (a + b) / 2, .5, GRIS)          # séparation tête-à-tête
        # traverses
        for (a, b) in TRAVERSES:
            f.ligne(a, ST1[0], a, ST2[1], .4); f.ligne(b, ST1[0], b, ST2[1], .4)
            f.ligne(a, ST3[0], a, ST4[1], .4); f.ligne(b, ST3[0], b, ST4[1], .4)

    def _robots(self, f, etiq=True):
        # salle de lait : deux robots de traite adossés au mur de la laiterie (accès par l'arrière), aire d'attente côté troupeau
        for k, y in enumerate((12650, 14450)):
            f.rect(XS + 250, y, XS + 3450, y + 1550, .8, fill=ROBOT)
            f.ligne(XS + 600, y + 775, XS + 3100, y + 775, .4, white)
            f.cercle(XS + 3000, y + 775, 160, .5, white)
            if etiq: f.texte(XS + 1850, y + 480, f"ROBOT R-{k + 1}", 5.2, True, col=white)
        f.ligne(XS + 3700, AL_C[0], XS + 3700, AL_C[1], 1.1, black, dash=[5, 2, 1, 2])
        if etiq: f.texte(XS + 3900, AL_C[0] + 400, "Porte de tri", 4.6, False, "g")

    def _equip_mobiles(self, f, etiq=True):
        """Racleurs de fumier, repousse-fourrage, abreuvoirs, brosses."""
        for k, (a, b) in enumerate((AL_S, AL_C, AL_N)):
            ym = (a + b) / 2
            f.ligne(12700, ym, 59500, ym, .5, RACLEUR, dash=[8, 3])
            f.rect(20000 + k * 7000, ym - 350, 21100 + k * 7000, ym + 350, .6, fill=RACLEUR)
            if etiq: f.texte(21600 + k * 7000, ym - 150, f"Racleur R-{k + 1}", 4.4, False, "g")
        for k, (a, b) in enumerate((TA_S, TA_N)):
            ym = (a + b) / 2
            f.ligne(XS + T + 600, ym, XV - T - 600, ym, .5, REPOUSSE, dash=[8, 3])
            f.rect(30000 + k * 12000, ym - 450, 31400 + k * 12000, ym + 450, .6, fill=REPOUSSE)
            if etiq: f.texte(31900 + k * 12000, ym - 150, f"Repousse-fourrage {k + 1}", 4.4, False, "g")
        for (x, y) in ((25000, AL_S[1] - 700), (52000, AL_S[1] - 700), (22000, AL_C[0]), (40000, AL_C[0]), (25000, AL_N[0]), (52000, AL_N[0])):
            f.rect(x, y, x + 2200, y + 700, .5, fill=EAU_C); f.cercle(x + 1100, y + 350, 220, .4)
        for (x, y) in ((58200, 13300), (58200, 15400)):
            f.cercle(x, y, 320, .6, GRIS, fill=white); f.cercle(x, y, 120, .4)

    def _service_et_veaux(self, f, etiq=True):
        noms = [("Salle des machines\net chauffe-eau", 3100), ("Bureau et\nsalle de contrôle", 8750), ("Laiterie\n(salle de lait)", 14600), ("Pharmacie\nvétérinaire", 20100), ("Vestiaire\net toilette", 25600)]
        if etiq:
            for (t, y) in noms: f.texte(XS / 2, y if "Laiterie" not in t else 16700, t, 5.2, True)
        # laiterie : réservoir à lait 8 000 L et refroidisseur
        f.polyfill = None
        f.poly(ellipse(6200, 13900, 1900, 1050), .8, close=True, fill=white)
        if etiq: f.texte(6200, 13800, "Réservoir 8 000 L", 4.2)
        f.rect(1500, 12000, 3300, 13200, .6, fill=GRIS_TC)
        if etiq: f.texte(2400, 12450, "Refroid.", 4.2)
        # veaux : cases individuelles et parc des génisses
        if etiq:
            f.texte((XV + W) / 2, 5200, "Maternité\n(4 cases de vêlage)", 5.2, True)
            f.texte((XV + W) / 2, 14500, "Veaux\n(12 cases)", 5.2, True)
            f.texte((XV + W) / 2, 24200, "Génisses\n(parc)", 5.2, True)
        for k in range(4): f.rect(XV + 300 + k * 1400, 500, XV + 300 + (k + 1) * 1400 - 100, 2700, .4, fill=white)
        for k in range(4):
            for r in (0, 1): f.rect(XV + 300 + k * 1400, 10000 + r * 4700, XV + 300 + (k + 1) * 1400 - 100, 11800 + r * 4700, .4, fill=white)

    # ------------------------------------------------------------------ feuilles
    def garde(self, c):
        f = Feuille(c, DOSSIER, "000", "PAGE DE GARDE\nET LISTE DES FEUILLES", "—")
        c_ = f.c
        c_.setFont(FONT_B, 30); c_.drawString(24 * MM, 232 * MM, "FERME LAITIÈRE")
        c_.drawImage(LOGO, (336 - 24 * LOGO_R) * MM, 228 * MM, 24 * LOGO_R * MM, 24 * MM)
        c_.setFont(FONT, 14); yy = 222
        for l in ["DOSSIER 5", "1 280, rang des Prairies", "Ville fictive (Québec)"]: c_.drawString(24 * MM, yy * MM, l); yy -= 7
        c_.setFont(FONT_B, 11); c_.drawString(24 * MM, (yy - 2) * MM, "Conçu par " + AUTEUR); yy -= 11
        c_.setFont(FONT, 10.5)
        for l in wrap("Ferme laitière moderne de 120 vaches en lactation : étable à stabulation libre de 66 m × 29 m, 120 logettes, deux robots de traite, racleurs de fumier et repousse-fourrage automatiques, "
                      "abreuvoirs, ventilateurs de grand diamètre, rideaux latéraux et faîtière ouverte. Bloc de service (laiterie, bureau, machines) et aile des veaux. "
                      "Enclos libres au sud, fosse à lisier, silos-couloirs et hangar à machinerie. Structure d'acier, murets de béton, toit à deux versants avec panneaux solaires.", 95):
            c_.drawString(24 * MM, yy * MM, l); yy -= 5.2
        lignes = [["000", "Page de garde et liste des feuilles"], ["A-100", "Plan d'implantation de la ferme"], ["A-101", "Plan de l'étable"], ["A-201", "Élévations"],
                  ["A-301", "Coupe transversale de l'étable"], ["S-101", "Plan des fondations"], ["P-101", "Plan d'eau, de drainage et de laiterie"],
                  ["E-101", "Électricité, ventilation et automatisation"]]
        f.tableau(24, yy - 10, "LISTE DES FEUILLES", ["Feuille", "Titre"], lignes, [22, 110], h=6, size=8.5)
        donnees = [["Usage", "Élevage laitier, 120 vaches en lactation"], ["Étable", "66 000 × 29 000 mm, 1 914 m²"], ["Logettes", f"{N_LOG} (4 rangées)"],
                   ["Traite", "2 robots (60 vaches par robot)"], ["Structure", "Acier, portiques aux 6 000 mm"], ["Murs", "Muret de béton 1 200 + rideaux"],
                   ["Toiture", "2 versants 10°, faîtière ouverte"], ["Lot", "240 000 × 150 000 (3,6 ha)"]]
        f.tableau(178, yy - 10, "DONNÉES DE LA FERME", ["Élément", "Valeur"], donnees, [58, 92], h=6, size=8.5)
        f.notes("UTILISATION EN CLASSE", ["Ce dossier sert à lire des plans agricoles : repérer les feuilles, les échelles, les équipements automatisés et leurs liens (eau, électricité, ventilation).",
                                         "Ferme fictive. Les valeurs sont plausibles mais non vérifiées pour la construction."])
        c.showPage()

    def site(self, c):
        N = 1000; LW, LD = 240000, 150000
        f = Feuille(c, DOSSIER, "A-100", "PLAN D'IMPLANTATION\nDE LA FERME", "1:1000")
        x0 = DRAW[0] + ((DRAW[2] - DRAW[0]) - LW / N) / 2; y0 = DRAW[1] + 36
        f.vue(x0, y0, N)
        f.rect(-4000, -16000, LW + 4000, -4000, 0, fill=HexColor("#e8e8e8")); f.ligne(-4000, -10000, LW + 4000, -10000, .5, GRIS, dash=[6, 4])
        f.texte(LW / 2, -11200, "RANG DES PRAIRIES", 9, True, col=GRIS)
        f.poly([(0, 0), (LW, 0), (LW, LD), (0, LD)], 1.0, close=True, dash=[10, 3, 2, 3])
        f.cote(0, LW, LD + 4000); f.cote(0, LD, LW + 4000, orient="v")
        f.texte(LW / 2, LD + 9000, "LOT 5 123 456 · SUPERFICIE 3,6 ha", 8, True)
        # chemin d'accès et cour
        f.rect(36000, 0, 44000, 36000, .4, fill=HexColor("#ececec")); f.rect(36000, 30000, 138000, 40000, .4, fill=HexColor("#ececec"))
        f.texte(40000, 15000, "Chemin d'accès", 5.5, col=GRIS, rot=90)
        # résidence et hangar
        f.rect(14000, 14000, 28000, 23000, .8, fill=GRIS_TC); f.texte(21000, 18000, "Résidence", 6, True)
        f.rect(14000, 44000, 44000, 62000, .8, fill=GRIS_TC); f.hachures(14000, 44000, 44000, 62000, 1200, 45, GRIS_C); f.texte(29000, 53000, "HANGAR À MACHINERIE", 6, True)
        # étable
        bx, by = 60000, 78000
        f.rect(bx, by, bx + W, by + D, 1.2, fill=GRIS_TC); f.hachures(bx, by, bx + W, by + D, 1100, 45, GRIS_C); f.rect(bx, by, bx + W, by + D, 1.2)
        f.texte(bx + W / 2, by + D / 2 + 1200, "ÉTABLE À STABULATION LIBRE", 9, True); f.texte(bx + W / 2, by + D / 2 - 1500, f"66 × 29 m · {N_LOG} logettes · 2 robots de traite", 6.5)
        # enclos libres
        for k in range(3):
            ex0 = bx + k * 22000
            f.rect(ex0, 42000, ex0 + 22000, 78000, .7, fill=HexColor("#e3efd9"), dash=[5, 2])
            f.texte(ex0 + 11000, 60000, f"ENCLOS LIBRE {k + 1}\n(aire d'exercice)", 6, True)
        f.rect(bx, 78000 - 3000, bx + W, 78000, 0, fill=HexColor("#ececec")); f.texte(bx + W / 2, 78000 - 1700, "Allée d'accès aux enclos (portillons de 3 m)", 5, col=GRIS)
        # fosse, silos
        f.cercle(170000, 100000, 15000, 1.0, black, fill=HexColor("#dfe3d6")); f.cercle(170000, 100000, 13500, .5, black)
        f.texte(170000, 101500, "FOSSE À LISIER", 6, True); f.texte(170000, 97500, "Ø 30 m · 4 000 m³", 5.5)
        f.rect(60000, 118000, 120000, 138000, .8, fill=HexColor("#e6d9a6")); f.ligne(90000, 118000, 90000, 138000, .5)
        f.texte(75000, 128000, "SILO-COULOIR 1", 6, True); f.texte(105000, 128000, "SILO-COULOIR 2", 6, True)
        f.cercle(140000, 125000, 3500, 1.0, black, fill=white); f.texte(140000, 119500, "Silo à grain Ø 7 m", 5, col=GRIS)
        f.cercle(48000, 28000, 600, .8, EF, fill=EF); f.texte(51000, 27000, "Puits", 5, col=EF)
        f.ligne(44000, 28000, 44000, 36000, 1.0, EF, dash=[4, 3])
        f.ligne(bx + W, by + 14500, 170000, 100000 - 15000, 1.0, HexColor("#555"), dash=[5, 3]); f.texte(bx + W + 12000, by + 6000, "Conduite de lisier", 5, col=GRIS)
        f.texte(bx + W / 2, by + D + 2800, "Panneaux solaires sur le versant sud de la toiture : 120 kW", 5.5, col=GRIS)
        f.nord(DRAW[2] - 18, DRAW[3] - 20)
        f.titre_vue(DRAW[0] + 4, DRAW[1] + 6, 1, "PLAN D'IMPLANTATION", "1:1000"); f.barre_echelle(DRAW[0] + 120, DRAW[1] + 6, N, 50)
        f.notes("NOTES D'IMPLANTATION", ["Implantation à confirmer par un arpenteur-géomètre.", "Distances séparatrices (odeurs) et marges de recul à valider avec la municipalité.",
                                         "Eaux de laiterie et lisier dirigés vers la fosse à lisier étanche (jamais vers un cours d'eau).", "Enclos libres sur sol stabilisé, clôtures électrifiées.",
                                         "Entrée d'eau : puits privé, réservoir tampon dans la salle des machines."])
        f.notes("LÉGENDE", ["Hachures : emprise de l'étable", "Vert pâle : enclos libres", "Bleu : conduite d'eau", "Tirets gris : conduite de lisier"])
        c.showPage()

    def plan(self, c):
        N = 250
        f = Feuille(c, DOSSIER, "A-101", "PLAN DE L'ÉTABLE", "1:250")
        self._centrer_plan(f, N, bas=96)
        self._contour(f); self._etable(f); self._cloisons(f); self._service_et_veaux(f); self._robots(f); self._equip_mobiles(f)
        # étiquettes des zones
        for (rg, t) in ((TA_S, "TABLE D'ALIMENTATION"), (TA_N, "TABLE D'ALIMENTATION")): f.texte(43000, (rg[0] + rg[1]) / 2 + 700, t, 5.2, True, col=GRIS)
        for (rg, t) in ((AL_S, "ALLÉE D'ALIMENTATION"), (AL_N, "ALLÉE D'ALIMENTATION"), (AL_C, "ALLÉE CENTRALE")):
            f.texte(50000, (rg[0] + rg[1]) / 2 + 650, t, 5, True, col=GRIS)
        for rg, t in (((ST1[0], ST2[1]), "rangées 1 et 2"), ((ST3[0], ST4[1]), "rangées 3 et 4")):
            ym = (rg[0] + rg[1]) / 2
            f.rect(34200, ym - 650, 40800, ym + 650, 0, col=white, fill=white); f.texte(37500, ym - 100, f"LOGETTES · {len(XS_LOG) * 2} ({t})", 5.2, True)
        f.texte(30500, (ST1[0] + ST2[1]) / 2 - 1300, "Traverse", 4.4, col=GRIS); f.texte(46500, (ST1[0] + ST2[1]) / 2 - 1300, "Traverse", 4.4, col=GRIS)
        f.texte(21500, -900 * 250 / 250 - 300, "Portillon enclos", 4.6, col=GRIS); f.texte(41500, -1200, "Portillon enclos", 4.6, col=GRIS)
        # cotes
        f.cote(0, W, -3200); f.cote(0, D, -3000, orient="v")
        f.chaine([0, XS, 12700, 29000, 32000, 45000, 48000, 59500, XV, W], D + 2400, "h", total=False)
        f.chaine([0, TA_S[1], AL_S[1], ST2[1], AL_C[1], ST4[1], AL_N[1], D], W + 2600, "v", total=False)
        f.nord(DRAW[2] - 16, DRAW[3] - 18)
        f.titre_vue(DRAW[0] + 4, 246, 1, "PLAN DE L'ÉTABLE", "1:250"); f.barre_echelle(DRAW[0] + 120, 246, N, 20)
        rows = [["R-1, R-2", "Robot de traite (1 box chacun)", "2"], ["RC-1 à 3", "Racleur de fumier automatique", "3"], ["RF-1, 2", "Robot repousse-fourrage", "2"], ["AB", "Abreuvoir à niveau constant (2,2 m)", "6"],
                ["BR", "Brosse rotative", "2"], ["LOG", "Logette (1 250 × 2 600) sur matelas", str(N_LOG)], ["RES", "Réservoir à lait 8 000 L", "1"], ["PT", "Porte de tri (sélection)", "1"]]
        f.tableau(DRAW[0] + 4, 66, "ÉQUIPEMENTS AUTOMATISÉS ET MOBILIER", ["Repère", "Désignation", "Qté"], rows, [30, 120, 18], h=5.2, size=7)
        f.notes("NOTES GÉNÉRALES", ["Toutes les cotes sont en millimètres.", "Murets de béton de 1 200 sur le pourtour, rideaux enroulables au-dessus (tirets).",
                                    "Les vaches circulent librement entre la table d'alimentation, les logettes, les robots et les enclos.", "Chaque robot traite environ 60 vaches, 3 traites par jour en moyenne.",
                                    "Allées : béton rainuré antidérapant, pente 1 % vers le caniveau de raclage.", "Aire d'attente devant les robots, porte de tri avec retour au troupeau."])
        f.notes("LÉGENDE", ["Orange : robots de traite", "Jaune : racleurs automatiques (trajet en tirets)", "Brun : robots repousse-fourrage", "Bleu pâle : abreuvoirs", "Vert pâle : tables d'alimentation"])
        c.showPage()

    # ------------------------------------------------------------- élévations
    def _vache_cote(self, f, x, z, s=1.0, tete_a_droite=True):
        d = 1 if tete_a_droite else -1
        f.poly(ellipse(x, z + 900 * s, 1000 * s, 500 * s, 22), .5, close=True, fill=white)
        f.poly([(x + d * 850 * s, z + 1150 * s), (x + d * 1450 * s, z + 1050 * s), (x + d * 1500 * s, z + 780 * s), (x + d * 1100 * s, z + 760 * s)], .5, close=True, fill=white)
        for dx in (-650, -350, 450, 700): f.ligne(x + dx * s, z + 480 * s, x + dx * s, z, .5)
        f.cercle(x + d * 1280 * s, z + 980 * s, 40 * s, .3, black, fill=black)

    def _elev_long(self, f, face):
        zc, zf = ZC, ZF
        f.ligne(-1500, 0, W + 1500, 0, 1.4); f.hachures(-1500, -350, W + 1500, 0, 130, 45, GRIS_C)
        # bloc de service
        f.rect(0, 0, XS, 4200, .8, fill=BOIS)
        x = 200
        while x < XS: f.ligne(x, 0, x, 4200, .15, LAME); x += 200
        f.rect(XS - 60, 4200 - 120, XS + 60, 4200 + 100, .6, fill=GRIS_TC)
        for (a, b) in ((900, 2300), (3100, 4500), (5300, 6700)): f.rect(a, 1400, b, 2800, .6, fill=RIDEAU)
        f.rect(7300, 0, 8500, 2300, .7, fill=white)
        # étable
        f.rect(XS, 0, W, 1200, .7, fill=BETON)
        f.rect(XS, 1200, W, zc, .6, fill=RIDEAU)
        for k in range(1, 8): f.ligne(XS, 1200 + (zc - 1200) * k / 8, W, 1200 + (zc - 1200) * k / 8, .2, HexColor("#a9c4d6"))
        x = XS
        while x <= W + 1: f.rect(x - 90, 0, x + 90, zc, .4, fill=GRIS); x += 6000
        if face == "S":
            for (a, b) in ((20000, 23000), (40000, 43000)):
                f.rect(a, 0, b, 3000, .8, fill=white); f.ligne((a + b) / 2, 0, (a + b) / 2, 3000, .4)
        else:
            for (a, b) in ((16000, 20000),): f.rect(a, 0, b, 3000, .8, fill=white); f.ligne((a + b) / 2, 0, (a + b) / 2, 3000, .4)
        # toiture : versant visible
        f.rect(XS, zc, W, zf, .8, fill=TOLE)
        x = XS + 200
        while x < W: f.ligne(x, zc, x, zf, .12, NERV); x += 400
        if face == "S":
            for i in range(8):
                for j in range(2):
                    xa = 12500 + i * 5700; za = 4800 + j * 1050
                    f.rect(xa, za, xa + 5500, za + 950, .5, fill=SOLAIRE); f.ligne(xa, za + 475, xa + 5500, za + 475, .15, SOLAIRE_L)
                    for k in range(1, 6): f.ligne(xa + k * 917, za, xa + k * 917, za + 950, .15, SOLAIRE_L)
        f.rect(XS, zf, W, zf + 320, .6, fill=GRIS_TC); f.ligne(XS, zf + 320, W, zf + 320, 1.0)   # faîtière ouverte (couvre-faîte)
        f.texte(W / 2, zf + 700, "Faîtière ouverte (ventilation naturelle)", 5, col=GRIS)
        for (txt, z) in (("Faîte + 7 056", zf), ("Corniche + 4 500", zc), ("Muret + 1 200", 1200), ("Sol ± 0", 0)):
            f.ligne(W + 300, z, W + 1500, z, .3, dash=[4, 2]); f.texte(W + 1600, z - 80, txt, 5.5, True, "g")

    def _elev_pignon(self, f, bout):
        L = D
        f.ligne(-1500, 0, L + 1500, 0, 1.4); f.hachures(-1500, -350, L + 1500, 0, 130, 45, GRIS_C)
        if bout == "O":
            # bloc de service devant (bas), pignon de l'étable derrière
            f.poly([(0, ZC), (L / 2, ZF), (L, ZC)], .5, close=True, fill=HexColor("#eeeeee"))
            f.rect(0, 0, L, ZC, .5, fill=HexColor("#eeeeee"))
            f.rect(0, 0, L, 4200, .8, fill=BOIS)
            x = 200
            while x < L: f.ligne(x, 0, x, 4200, .15, LAME); x += 200
            f.rect(1000, 0, 2200, 2300, .7, fill=white); f.rect(13300, 0, 15700, 2300, .8, fill=white); f.ligne(14500, 0, 14500, 2300, .4)
            for (a, b) in ((4000, 6200), (7500, 9700), (17500, 19700), (21000, 23200)): f.rect(a, 1400, b, 2800, .6, fill=RIDEAU)
        else:
            f.rect(0, 0, L, 1200, .7, fill=BETON)
            f.rect(0, 1200, L, ZC, .8, fill=TOLE)
            f.poly([(0, ZC), (L / 2, ZF), (L, ZC)], .9, close=True, fill=TOLE)
            x = 200
            while x < L: f.ligne(x, 1200, x, ZC if abs(x - L / 2) > (L / 2) - 1 else ZF - abs(x - L / 2) * (ZF - ZC) / (L / 2), .12, NERV); x += 400
            f.rect(L / 2 - 2500, 0, L / 2 + 2500, 4000, .9, fill=white); f.ligne(L / 2, 0, L / 2, 4000, .5)
            f.texte(L / 2, 2000, "Porte coulissante 5 000 × 4 000", 5.4, col=GRIS)
        f.rect(L / 2 - 800, ZF - 400, L / 2 + 800, ZF + 150, .6, fill=GRIS_TC)
        for (txt, z) in (("Faîte + 7 056", ZF), ("Corniche + 4 500", ZC), ("Sol ± 0", 0)):
            f.ligne(L + 300, z, L + 1500, z, .3, dash=[4, 2]); f.texte(L + 1600, z - 80, txt, 5.5, True, "g")

    def elevations(self, c):
        N = 250
        f = Feuille(c, DOSSIER, "A-201", "ÉLÉVATIONS", "1:250")
        ox = DRAW[0] + 8
        f.vue(ox, 196, N); self._elev_long(f, "S"); f.titre_vue(ox - 2, 183, 1, "ÉLÉVATION SUD (PRINCIPALE)", "1:250")
        f.vue(ox, 122, N); self._elev_long(f, "N"); f.titre_vue(ox - 2, 109, 2, "ÉLÉVATION NORD", "1:250")
        f.vue(ox, 50, N); self._elev_pignon(f, "E"); f.titre_vue(ox - 2, 34, 3, "ÉLÉVATION EST (AILE DES VEAUX)", "1:250")
        f.vue(ox + 160, 50, N); self._elev_pignon(f, "O"); f.titre_vue(ox + 158, 34, 4, "ÉLÉVATION OUEST (BLOC DE SERVICE)", "1:250")
        f.notes("NOTES D'ÉLÉVATION", ["Muret de béton de 1 200 sur le pourtour; rideaux enroulables à commande automatique au-dessus.", "Toiture : tôle d'acier nervurée, pente 10°, faîtière ouverte de 600.",
                                      "Versant sud : panneaux solaires (120 kW) sur toute la longueur.", "Bloc de service : revêtement de lames de bois, toit plat.",
                                      "Portillons de 3 000 au sud : sorties vers les enclos libres.", "Porte coulissante de 5 000 × 4 000 à l'est (entrée des génisses et de la machinerie)."])
        f.notes("NIVEAUX", ["Sol : ± 0", "Muret : + 1 200", "Corniche : + 4 500", "Faîte : + 7 056"])
        c.showPage()

    # ------------------------------------------------------------------ coupe
    def coupe(self, c):
        N = 100
        f = Feuille(c, DOSSIER, "A-301", "COUPE TRANSVERSALE\nDE L'ÉTABLE", "1:100")
        f.vue(DRAW[0] + 18, 150, N)
        # dalle et sol
        f.rect(-1500, -300, D + 1500, 0, .6, fill=BETON); f.hachures(-1500, -900, D + 1500, -300, 120, 45, GRIS_C)
        # murets
        for (a, b) in ((0, T), (D - T, D)): f.rect(a, 0, b, 1200, .8, fill=BETON)
        # tables et logettes (surélévations)
        for (a, b) in (TA_S, TA_N): f.rect(a, 0, b, 200, .5, fill=VERT_P)
        for (a, b) in (ST1, ST2, ST3, ST4): f.rect(a, 0, b, 150, .4, fill=white)
        for y in (ST2[1], ST3[0]): f.rect(y - 150, 0, y + 150, 150, .3, fill=GRIS_TC)
        # caniveaux de raclage
        for (a, b) in (AL_S, AL_C, AL_N): f.ligne((a + b) / 2, 0, (a + b) / 2, -90, 1.0, RACLEUR)
        # colonnes d'acier et rideaux
        for y in (0, D): f.rect(y - 100, 0, y + 100, ZC, .6, fill=GRIS)
        f.rect(-150, 1200, 150, ZC, .3, fill=RIDEAU); f.rect(D - 150, 1200, D + 150, ZC, .3, fill=RIDEAU)
        f.ligne(-300, 1200, -300, ZC, 1.0, HexColor("#6fa0c0"), dash=[4, 2]); f.ligne(D + 300, 1200, D + 300, ZC, 1.0, HexColor("#6fa0c0"), dash=[4, 2])
        # ferme (treillis) : membrures et diagonales
        h = ZF - ZC
        f.ligne(-300, ZC, D / 2, ZF, 1.4); f.ligne(D + 300, ZC, D / 2, ZF, 1.4)
        f.ligne(-300, ZC - 150, D / 2, ZF - 150, 1.0); f.ligne(D + 300, ZC - 150, D / 2, ZF - 150, 1.0)
        f.ligne(0, ZC - 600, D, ZC - 600, 1.2)
        n = 14
        for k in range(n):
            y0 = D * k / n; y1 = D * (k + 1) / n
            za = ZC - 600; zb0 = ZC + (ZF - ZC) * min(y0, D - y0) / (D / 2) - 150 * 0; zb1 = ZC + (ZF - ZC) * min(y1, D - y1) / (D / 2)
            f.ligne(y0, za, y1, zb1 if k % 2 == 0 else za, .3)
            f.ligne(y0, zb0, y0, za, .3)
        f.rect(D / 2 - 500, ZF - 60, D / 2 + 500, ZF + 330, .8, fill=GRIS_TC)      # couvre-faîte
        # panneaux solaires sur le versant sud (côté gauche)
        f.poly([(-300, ZC + 200), (D / 2 - 600, ZF - 60)], 2.4, SOLAIRE)
        # ventilateurs HVLS
        for yv in (ST1[1] + 100, ST4[0] - 100):
            f.ligne(yv, ZC - 600, yv, ZC - 1400, .6); f.poly(ellipse(yv, ZC - 1500, 3650, 110, 18), .5, close=True, fill=white)
        # vaches : debout aux tables, couchées dans les logettes
        for (a, b) in (TA_S, TA_N):
            self._vache_cote(f, (a + b) / 2, 200, 1.0, a < D / 2)
        for k, (a, b) in enumerate((ST1, ST2, ST3, ST4)):
            self._vache_cote(f, (a + b) / 2 + (200 if k % 2 == 0 else -200), 150 - 120, .62, k % 2 == 1)
        # abreuvoir et robot racleur
        f.rect(AL_C[0] + 150, 0, AL_C[0] + 900, 850, .6, fill=EAU_C)
        f.rect(AL_S[0] + 1200, 0, AL_S[0] + 2300, 380, .6, fill=RACLEUR)
        # étiquettes
        L_ = [("Faîtière ouverte", D / 2, ZF + 400, -3800, 900), ("Ferme en treillis d'acier", 6500, ZC + 1400, -4300, 1600), ("Panneaux solaires", 5500, ZC + 1260, -5600, 2200),
              ("Rideau latéral enroulable", D, 3200, 1500, 600), ("Muret de béton 1 200", D, 700, 1500, 0), ("Ventilateur HVLS Ø 7,3 m", ST1[1] + 3600, ZC - 1500, 2500, 800),
              ("Table d'alimentation", (TA_N[0] + TA_N[1]) / 2, 150, 0, 2500), ("Logettes sur matelas", (ST3[0] + ST4[0]) / 2, 120, -2200, 2700),
              ("Racleur automatique", AL_S[0] + 1750, 380, 800, 1300), ("Abreuvoir", AL_C[0] + 520, 850, 1800, 800), ("Caniveau de raclage", (AL_C[0] + AL_C[1]) / 2 + 600, -90, 2000, -700)]
        for (t, x, z, dx, dz) in L_:
            f.ligne(x, z, x + dx, z + dz, .3); f.texte(x + dx + (200 if dx >= 0 else -200), z + dz, t, 5.2, False, "g" if dx >= 0 else "d")
        f.chaine([0, TA_S[1], AL_S[1], ST2[1], AL_C[1], ST4[1], AL_N[1], D], -2300, "h", total=False)
        f.cote(0, D, -3800); f.cote(0, ZF, D + 2800, orient="v"); f.cote(0, ZC, D + 2000, orient="v")
        f.titre_vue(DRAW[0] + 4, 236, "A", "COUPE A — TRANSVERSALE", "1:100")
        rows = [["Faîte", "+ 7 056"], ["Corniche", "+ 4 500"], ["Rideau (course)", "1 200 à 4 300"], ["Muret de béton", "1 200"], ["Table d'alimentation", "+ 200"], ["Logette", "+ 150"], ["Dalle", "± 0"]]
        f.tableau(DRAW[0] + 4, 62, "NIVEAUX", ["Élément", "Niveau"], rows, [50, 36], h=5.2, size=7)
        rows2 = [["Largeur utile", "28 500"], ["Logette", "1 250 × 2 600"], ["Allée de service", "3 600"], ["Table d'alimentation", "3 500 à 3 800"], ["Pente du toit", "10° (17,6 %)"], ["Poutre", "Treillis, portée 29 000"]]
        f.tableau(DRAW[0] + 100, 62, "DIMENSIONS TYPES", ["Élément", "Valeur"], rows2, [50, 50], h=5.2, size=7)
        f.notes("NOTES", ["Les allées sont rainurées et légèrement inclinées vers un caniveau où passe le racleur automatique.", "Les rideaux s'ouvrent ou se ferment selon la température et le vent (capteurs).",
                          "Les ventilateurs de grand diamètre (HVLS) brassent l'air lentement au-dessus des logettes.", "Panneaux solaires sur le versant sud."])
        c.showPage()

    # ----------------------------------------------------------- fondations
    def fondations(self, c):
        N = 300
        f = Feuille(c, DOSSIER, "S-101", "PLAN DES FONDATIONS", "1:300 et 1:50")
        self._centrer_plan(f, N, bas=126)
        xs = list(range(0, W + 1, 6000)) + [W]
        lettres = "ABCDEFGHIJKL"
        for i, x in enumerate(sorted(set(xs))[:12]): f.bulle_grille(x, D + 2800, lettres[i], 3.0); f.ligne(x, -1500, x, D + 2000, .25, GRIS, dash=[10, 3, 2, 3])
        for k, y in enumerate((0, D / 2, D)): f.bulle_grille(-3000, y, str(k + 1), 3.0); f.ligne(-2200, y, W + 1500, y, .25, GRIS, dash=[10, 3, 2, 3])
        f.rect(0, 0, W, D, 1.0, fill=HexColor("#bdbdbd")); f.rect(T, T, W - T, D - T, .8, fill=white)
        f.rect(-200, -200, W + 200, D + 200, .5, dash=[4, 2]); f.rect(T + 200, T + 200, W - T - 200, D - T - 200, .5, dash=[4, 2])
        f.rect(XS - 125, T, XS + 125, D - T, .8, fill=HexColor("#bdbdbd")); f.rect(XV - 125, T, XV + 125, D - T, .8, fill=HexColor("#bdbdbd"))
        for x in range(6000, W, 6000):
            for y in (0, D):
                f.rect(x - 900, y - 900, x + 900, y + 900, .4, dash=[3, 2]); f.rect(x - 150, y - 150, x + 150, y + 150, .5, fill=black)
        for y in (0, D):
            for x in (0, W): f.rect(x - 150, y - 150, x + 150, y + 150, .5, fill=black)
        for (a, b) in (AL_S, AL_C, AL_N): f.ligne(12700, (a + b) / 2, 59500, (a + b) / 2, 1.0, RACLEUR, dash=[8, 3])
        f.rect(W - 3500, 12500, W + 2500, 16500, .8, fill=HexColor("#dfe3d6")); f.texte(W - 500, 14300, "Fosse de\nréception", 4.4, True)
        f.texte(XS / 2, D / 2, "Dalle de laiterie\n(drain central)", 5, True)
        f.ligne(W + 100, 14500, W + 14000, 14500, 1.2, HexColor("#555"), dash=[5, 3])
        f.cote(0, W, -3800); f.cote(0, D, -3400, orient="v"); f.chaine(sorted(set(xs)), D + 4800, "h", total=False)
        f.titre_vue(DRAW[0] + 4, 247, 1, "PLAN DES FONDATIONS", "1:300")
        # détail d'un portique
        f.vue(DRAW[0] + 215, 50, 50)
        f.rect(-3000, -300, 4500, 0, .6, fill=BETON); f.hachures(-3000, -1400, 4500, -300, 120, 45, GRIS_C)
        f.rect(-900, -1700, 900, -1100, .8, fill=BETON); f.rect(-300, -1100, 300, 0, .8, fill=BETON)
        f.rect(-120, 0, 120, 2600, .8, fill=GRIS)
        f.rect(-120, 0, -T - 120, 1200, .8, fill=BETON)
        f.texte(500, 700, "Muret de béton 1 200", 5, False, "g"); f.texte(1200, -1500, "Semelle isolée 1 800 × 1 800 × 600", 5, False, "g"); f.texte(500, 2000, "Colonne d'acier W 250", 5, False, "g")
        f.titre_vue(DRAW[0] + 195, 22, 2, "DÉTAIL TYPE — COLONNE ET MURET", "1:50")
        f.notes("NOTES DE STRUCTURE", ["Béton : semelles et murets 30 MPa, dalle 35 MPa, air entraîné.", "Semelles à 1 800 minimum sous le sol fini (gel).",
                                       "Capacité portante présumée : 150 kPa. À valider par un ingénieur.", "Portiques d'acier aux 6 000 mm, colonnes sur semelles isolées.",
                                       "Dalle des allées rainurée (profondeur 10 mm, entraxe 50) et en pente de 1 % vers les caniveaux.", "Caniveaux de raclage : largeur 400, profondeur 100.",
                                       "Fosse de réception du lisier étanche (membrane + béton)."])
        f.notes("LÉGENDE", ["Carré plein : colonne d'acier", "Carré en tirets : semelle isolée", "Tirets jaunes : caniveau de raclage", "— · — Axes de grille"])
        c.showPage()

    # ---------------------------------------------------------- plomberie
    def plomberie(self, c):
        N = 250
        f = Feuille(c, DOSSIER, "P-101", "PLAN D'EAU, DE DRAINAGE\nET DE LAITERIE", "1:250")
        self._centrer_plan(f, N, bas=112)
        self._contour(f, pale=True); self._service_et_veaux(f, etiq=False)
        f.rect(XS - 125, T, XS + 125, D - T, .5, fill=GRIS_TC)
        for (a, b) in ((ST1[0], ST2[1]), (ST3[0], ST4[1])): f.rect(12700, a, 59500, b, .2, col=GRIS_C)
        # entrée d'eau Ø 50 : réservoir tampon, chauffe-eau (salle des machines), distribution
        f.ligne(4500, -3500, 4500, 3100, 2.0, EF); f.texte(4800, -2800, "Entrée d'eau Ø 2\" (puits)", 5, True, "g", EF)
        f.rect(3500, 2400, 5500, 4000, .8, fill=white); f.texte(4500, 3000, "Réservoir\ntampon 1 000 L", 4.2)
        f.cercle(1500, 3100, 600, .8, EC, fill=white); f.texte(1500, 1400, "CE 450 L", 4.4, True, "c", EC)
        f.ligne(4500, 4000, 4500, 6300, 1.6, EF); f.ligne(4500, 6300, XS + 300, 6300, 1.6, EF); f.ligne(XS + 300, 6300, XS + 300, AL_S[1] - 1000, 1.6, EF)
        f.ligne(XS + 300, AL_S[1] - 1000, 56500, AL_S[1] - 1000, 1.6, EF)
        f.ligne(XS + 300, AL_C[0] + 100, 56500, AL_C[0] + 100, 1.6, EF); f.ligne(XS + 300, AL_N[0] + 100, 56500, AL_N[0] + 100, 1.6, EF)
        f.ligne(XS + 300, AL_S[1] - 1000, XS + 300, AL_N[0] + 100, 1.6, EF)
        ab = [(25000, AL_S[1] - 700), (52000, AL_S[1] - 700), (22000, AL_C[0]), (40000, AL_C[0]), (25000, AL_N[0]), (52000, AL_N[0])]
        for (x, y) in ab:
            f.rect(x, y, x + 2200, y + 700, .5, fill=EAU_C); f.cercle(x + 1100, y + 350, 220, .4)
            f.ligne(x + 1100, y + (350 if y == AL_S[1] - 700 else 350), x + 1100, (AL_S[1] - 1000) if y == AL_S[1] - 700 else (AL_C[0] + 100 if y == AL_C[0] else AL_N[0] + 100), .9, EF)
        # eau chaude vers la laiterie (lavage des robots et du réservoir)
        f.ligne(1500, 3700, 1500, 14000, 1.6, EC); f.ligne(1500, 14000, XS + 300, 14000, 1.6, EC)
        f.texte(2100, 8500, "Eau chaude 85 °C\nlavage robots et réservoir", 4.4, False, "g", EC)
        for (x, y) in ((XS + 1800, 12400), (XS + 1800, 16300)): f.cercle(x, y, 300, .6, EC, fill=white)
        f.texte(XS + 2000, 12000, "Lavage R-1", 4.2, col=EC); f.texte(XS + 2000, 16800, "Lavage R-2", 4.2, col=EC)
        # évier de laiterie, lavabo, toilette
        f.rect(7300, 11800, 8700, 12500, .6, fill=white); f.texte(8000, 12150, "ÉVIER", 4, True)
        f.rect(7000, 23200, 8000, 24000, .6, fill=white); f.texte(7500, 23600, "LAV", 4, True); f.cercle(3000, 27000, 400, .6, fill=white); f.texte(3000, 27800, "WC", 4, True)
        # drains : laiterie -> caniveau -> fosse de réception
        f.ligne(5000, 12300, 5000, 11300, 1.2, DR, dash=[6, 3]); f.ligne(5000, 11300, XS - 100, 11300, 1.2, DR, dash=[6, 3])
        f.ligne(XS, 11300, 12000, 11300, 1.2, DR, dash=[6, 3]); f.ligne(12000, 11300, 12000, 14350, 1.2, DR, dash=[6, 3])
        f.texte(12600, 11000, "Eaux de laiterie vers la fosse à lisier", 4.4, True, "g", DR)
        for (a, b) in (AL_S, AL_C, AL_N): f.ligne(12700, (a + b) / 2, 59500, (a + b) / 2, 1.2, DR, dash=[8, 3])
        f.ligne(59500, AL_C[0] + 1800, W + 1800, AL_C[0] + 1800, 1.4, DR, dash=[8, 3]); f.texte(W - 2000, AL_C[0] - 1200, "Vers la fosse\nde réception", 4.4, True, "d", DR)
        f.rect(W - 3500, 12500, W + 2500, 16500, .8, fill=HexColor("#dfe3d6"))
        f.cote(0, W, -3200); f.cote(0, D, -3000, orient="v")
        f.nord(DRAW[2] - 16, DRAW[3] - 18); f.titre_vue(DRAW[0] + 4, 236, 1, "PLAN D'EAU, DE DRAINAGE ET DE LAITERIE", "1:250"); f.barre_echelle(DRAW[0] + 150, 236, N, 20)
        rows = [["CE", "Chauffe-eau électrique 450 L (85 °C)", "1"], ["RT", "Réservoir tampon 1 000 L, pompe à pression", "1"], ["AB", "Abreuvoir à niveau constant (débit 20 L/min)", "6"], ["ÉV", "Évier de laiterie (inox, 2 bacs)", "1"],
                ["LAV, WC", "Lavabo et toilette du vestiaire", "2"], ["LV", "Lavage automatique des robots (eau chaude)", "2"], ["RC", "Caniveaux de raclage vers la fosse de réception", "3"]]
        f.tableau(DRAW[0] + 4, 82, "NOMENCLATURE DES APPAREILS ET ÉQUIPEMENTS", ["Repère", "Désignation", "Qté"], rows, [30, 120, 18], h=5.2, size=7)
        f.notes("NOTES", ["Consommation d'eau : environ 150 L par vache par jour (120 vaches = 18 000 L/jour).", "Clapets antiretour sur toutes les prises d'eau; réseau protégé du gel (traçage chauffant).",
                          "Eaux de laiterie : jamais vers un cours d'eau, vers la fosse à lisier.", "Eau chaude à 85 °C pour le rinçage des circuits de traite.", "Vannes d'isolement à chaque abreuvoir."])
        f.notes("LÉGENDE", ["Bleu : eau froide", "Rouge : eau chaude", "Vert pointillé : drainage et lisier"])
        c.showPage()

    # -------------------------------------------------------------- électricité
    def electricite(self, c):
        N = 250
        f = Feuille(c, DOSSIER, "E-101", "ÉLECTRICITÉ, VENTILATION\nET AUTOMATISATION", "1:250")
        self._centrer_plan(f, N, bas=112)
        self._contour(f, pale=True); self._service_et_veaux(f, etiq=False)
        for (a, b) in (TA_S, TA_N): f.rect(XS + T, a, XV - T, b, .2, col=GRIS_C)
        for (a, b) in (ST1, ST2, ST3, ST4): f.rect(12700, a, 59500, b, .15, col=GRIS_C)
        # rideaux et faîtière
        for y in (0, D): f.ligne(XS, y, XV, y, 2.2, HexColor("#6fa0c0"), dash=[6, 3])
        f.ligne(XS + 500, D / 2, XV - 500, D / 2, 1.0, GRIS, dash=[2, 3]); f.texte(XS + 12000, D / 2 + 500, "Faîtière ouverte", 4.4, col=GRIS)
        # ventilateurs HVLS : 2 rangées de 5
        for yv in (ST1[1], ST4[0]):
            for k in range(5):
                xv = 18000 + k * 9500
                f.cercle(xv, yv, 3650, .7, black); f.cercle(xv, yv, 300, .6, black, fill=black)
                for a in range(0, 360, 72): f.ligne(xv, yv, xv + 3400 * math.cos(math.radians(a + 15)), yv + 3400 * math.sin(math.radians(a + 15)), .3)
        # luminaires DEL
        for (a, b) in (TA_S, AL_S, AL_C, AL_N, TA_N):
            ym = (a + b) / 2
            x = 13500
            while x < 59500:
                if not any(p - 900 < x < q + 900 for (p, q) in TRAVERSES): f.cercle(x, ym, 160, .4, ELEC, fill=white)
                x += 4500
        for (x, y) in ((XS + 2500, 11200), (XS + 2500, 17000)): f.cercle(x, y, 160, .4, ELEC, fill=white)
        # panneau principal et distribution
        f.rect(500, 400, 2100, 1900, .9, fill=ELEC); f.texte(1300, 1000, "PP", 5, True, "c", white)
        f.texte(2500, 800, "Panneau principal 600 A, 347/600 V triphasé", 4.4, True, "g", ELEC)
        f.ligne(1300, 1900, 1300, 6300, 1.1, ELEC, dash=[4, 2]); f.ligne(1300, 6300, XS, 6300, 1.1, ELEC, dash=[4, 2]); f.ligne(XS - 200, 6300, XS - 200, 14000, 1.1, ELEC, dash=[4, 2])
        f.ligne(XS, 11000, XS + 4800, 11000, 1.1, ELEC, dash=[4, 2]); f.texte(XS + 5200, 10700, "Robots de traite : 2 × 30 A 208 V", 4.4, False, "g", ELEC)
        f.ligne(XS, 6000, 59500, 6000, .8, ELEC, dash=[4, 2]); f.ligne(XS, 22300, 59500, 22300, .8, ELEC, dash=[4, 2])
        f.ligne(XS + 500, 6000, XS + 500, 22300, .8, ELEC, dash=[4, 2])
        f.cote(0, W, -3200); f.cote(0, D, -3000, orient="v")
        f.nord(DRAW[2] - 16, DRAW[3] - 18); f.titre_vue(DRAW[0] + 4, 236, 1, "ÉLECTRICITÉ, VENTILATION ET AUTOMATISATION", "1:250"); f.barre_echelle(DRAW[0] + 160, 236, N, 20)
        rows = [["HVLS", "Ventilateur de grand diamètre Ø 7,3 m (1,1 kW)", "10"], ["Rideaux", "Rideaux latéraux motorisés (2 × 57 m)", "2"], ["Faîtière", "Ouverture continue de 600 en haut du toit", "1"], ["DEL", "Luminaires DEL étanches (100 W)", "60"],
                ["Robots", "Robots de traite, racleurs et repousse-fourrage", "7"], ["Capteurs", "Température, humidité et vent (commande des rideaux)", "3"], ["PP", "Panneau principal 600 A et génératrice de secours 125 kW", "1"], ["Solaire", "Panneaux solaires 120 kW sur le toit", "1"]]
        f.tableau(DRAW[0] + 4, 82, "ÉQUIPEMENTS ÉLECTRIQUES ET DE VENTILATION", ["Repère", "Désignation", "Qté"], rows, [30, 120, 18], h=5.2, size=7)
        f.notes("NOTES", ["Génératrice de secours : les robots et la ventilation ne peuvent pas s'arrêter longtemps.", "Ventilation naturelle : rideaux ouverts selon la température et le vent, faîtière toujours ouverte.",
                          "Ventilateurs HVLS : brassage lent de l'air au-dessus des logettes, surtout en été.", "Matériel étanche (IP65) dans l'étable : humidité et ammoniac.", "Éclairage : 16 h de lumière par jour pour la production de lait."])
        f.notes("LÉGENDE", ["Cercles noirs : ventilateurs HVLS", "Petits cercles orange : luminaires", "Tirets orange : circuits principaux", "Tirets bleus : rideaux latéraux"])
        c.showPage()

    def produire(self, chemin):
        c = rl_canvas.Canvas(chemin, pagesize=(PAGE_W * MM, PAGE_H * MM), pageCompression=1)
        c.setTitle("FERME LAITIÈRE DOSSIER 5 — dossier de plans d'exercice"); c.setAuthor("Pavillon de l'Avenir · plan pédagogique")
        for fn in (self.garde, self.site, self.plan, self.elevations, self.coupe, self.fondations, self.plomberie, self.electricite): fn(c)
        c.save()


if __name__ == "__main__":
    import os
    os.makedirs("sortie", exist_ok=True)
    Ferme().produire("sortie/Dossier-5-Ferme-laitiere.pdf")
    print("ok", N_LOG, "logettes")
