# -*- coding: utf-8 -*-
"""Feuilles génériques ajoutées à tous les dossiers : légende et abréviations (A-001), tableau des locaux et finis (A-401),
plan de toiture (A-102 / A-104) et détails types (A-501)."""
import math
from dessin import *
import coupes as _cp

FINIS = [  # (mots-clés, plancher, murs, plafond, plinthe)
    (("salle de bain", "salle d'eau", "douche", "toilette", "wc", "sanitaire", "vestiaire"),
     "Céramique antidérapante 300 × 300", "Céramique murale (zone humide), peinture époxy", "Gypse hydrofuge 12,7, peinture", "Céramique 100"),
    (("cuisine",), "Céramique 300 × 600", "Peinture lavable; dosseret de céramique", "Gypse 12,7, peinture satinée", "Bois peint 100"),
    (("mécanique", "rangement", "entrepôt", "garage", "cave", "buanderie", "atelier", "service", "garde-robe", "entretien"),
     "Béton scellé ou époxy", "Gypse 12,7 peint (ou bloc peint)", "Gypse 12,7 peint ou solives peintes", "—"),
    (("vestibule", "entrée", "corridor", "hall", "mail", "réception", "dégagement"),
     "Céramique 300 × 600", "Peinture latex satinée", "Gypse 12,7, peinture mate", "Céramique 100"),
    (("vente", "local", "commerce", "boutique", "magasin", "épicerie", "pharmacie", "restaurant", "réception"), "Béton poli scellé", "Gypse 12,7, peinture latex", "Plafond suspendu 600 × 600", "Vinyle 100"),
]
FINI_DEFAUT = ("Bois d'ingénierie 19 sur sous-couche acoustique", "Gypse 12,7, peinture latex mate", "Gypse 12,7, peinture mate", "MDF peint 140")


def finis_de(nom):
    n = nom.replace("\n", " ").lower()
    for (mots, *f_) in FINIS:
        if any(m in n for m in mots): return tuple(f_)
    return FINI_DEFAUT


def _fleche(f, x1, y1, x2, y2, w=.6, col=black, tete=260):
    f.ligne(x1, y1, x2, y2, w, col)
    a = math.atan2(y2 - y1, x2 - x1); t = tete * f.N / 50
    for s in (-1, 1):
        f.ligne(x2, y2, x2 - t * math.cos(a + s * .45), y2 - t * math.sin(a + s * .45), w, col)


def _niveaux_finis(self):
    if hasattr(self, "lv"):
        noms = ["Sous-sol", "Rez-de-chaussée", "Étage"]
        return [(noms[i] if i < len(noms) else f"Niveau {i}", lv.locaux, getattr(lv, "hc", 2700)) for i, lv in enumerate(self.lv)]
    hc = getattr(self, "hc", None) or max(2400, (getattr(self, "z_murs", 2800) - getattr(self, "z_plancher", 0)) - 150)
    return [("Niveau unique", self.locaux, hc)]


# =========================================================== A-001 LÉGENDE
def feuille_legende(self, c):
    f = Feuille(c, self.dossier, "A-001", "LÉGENDE, SYMBOLES\nET ABRÉVIATIONS", "—")
    f.vue(0, 0, 1)
    x0, x1_, x2_ = DRAW[0] + 4, DRAW[0] + 112, DRAW[0] + 222
    y = 256
    f.texte(x0, y, "TYPES DE LIGNES", 9, True, "g"); y -= 8
    for (nom, w, dash) in [("Contour d'un élément coupé (mur, plancher)", 1.4, None), ("Objet visible, contour d'ouverture", .6, None), ("Détail, joint, texture", .25, None),
                           ("Élément caché ou situé au-dessus du plan", .5, [3, 2]), ("Axe, ligne de coupe", .5, [8, 3, 2, 3]), ("Limite de terrain", 1.0, [10, 3, 2, 3])]:
        f.ligne(x0, y, x0 + 26, y, w, black, dash); f.texte(x0 + 30, y - 1, nom, 6.8, False, "g"); y -= 6.5
    f.ligne(x0, y, x0 + 26, y, .4)
    for xx in (x0, x0 + 26): f.ligne(xx - 1, y - 1, xx + 1, y + 1, .7)
    f.texte(x0 + 13, y + 1.6, "3 000", 5.5); f.texte(x0 + 30, y - 1, "Ligne de cote (trait oblique à chaque bout)", 6.8, False, "g"); y -= 11
    f.texte(x0, y, "SYMBOLES D'ARCHITECTURE", 9, True, "g"); y -= 10
    # murs
    f.rect(x0, y - 3, x0 + 26, y + 3, 1.0, fill=GRIS); f.texte(x0 + 30, y - 1, "Mur extérieur (poché foncé)", 6.8, False, "g"); y -= 9
    f.rect(x0, y - 2, x0 + 26, y + 2, .6, fill=GRIS_TC); f.texte(x0 + 30, y - 1, "Mur intérieur (poché pâle)", 6.8, False, "g"); y -= 10
    # porte battante
    f.rect(x0, y - 2, x0 + 6, y + 2, .5, fill=GRIS_TC); f.rect(x0 + 18, y - 2, x0 + 26, y + 2, .5, fill=GRIS_TC)
    f.ligne(x0 + 6, y - 2, x0 + 6, y + 7, .7)
    pts = [(x0 + 6 + 12 * math.sin(math.radians(a)), y - 2 + 12 * math.cos(math.radians(a))) for a in range(0, 91, 10)]
    f.poly(pts, .3, GRIS)
    f.texte(x0 + 30, y, "Porte battante (le tracé indique le sens d'ouverture)", 6.8, False, "g"); y -= 14
    # porte coulissante
    f.rect(x0, y - 2, x0 + 6, y + 2, .5, fill=GRIS_TC); f.rect(x0 + 20, y - 2, x0 + 26, y + 2, .5, fill=GRIS_TC)
    f.ligne(x0 + 6, y - .6, x0 + 16, y - .6, 1.0); f.ligne(x0 + 10, y + .6, x0 + 20, y + .6, 1.0)
    f.texte(x0 + 30, y - 1, "Porte coulissante", 6.8, False, "g"); y -= 9
    # fenêtre
    f.rect(x0, y - 2, x0 + 6, y + 2, .5, fill=GRIS_TC); f.rect(x0 + 20, y - 2, x0 + 26, y + 2, .5, fill=GRIS_TC)
    for k in (-1.8, -.4, .4, 1.8): f.ligne(x0 + 6, y + k, x0 + 20, y + k, .4 if abs(k) < 1 else .7)
    f.texte(x0 + 30, y - 1, "Fenêtre (vitrage et cadre dans l'épaisseur du mur)", 6.8, False, "g"); y -= 10
    # escalier
    f.rect(x0, y - 4, x0 + 22, y + 4, .6)
    for i in range(1, 8): f.ligne(x0 + 22 * i / 8, y - 4, x0 + 22 * i / 8, y + 4, .3)
    _fleche(f, x0 + 2, y, x0 + 20, y, .5, black, 70); f.texte(x0 + 30, y - 1, "Escalier (la flèche indique la montée)", 6.8, False, "g"); y -= 11
    # repères
    pts = [(x0 + 5 + 3.4 * math.cos(math.radians(a)), y + 3.4 * math.sin(math.radians(a))) for a in range(0, 360, 60)]
    f.poly(pts, .5, close=True, fill=white); f.texte(x0 + 5, y - 1, "A", 7, True); f.texte(x0 + 12, y - 1, "Type de fenêtre (voir le tableau)", 6.8, False, "g"); y -= 9
    f.rect(x0 + 1, y - 2.5, x0 + 9, y + 2.5, .5, fill=white); f.texte(x0 + 5, y - 1, "101", 6.5, True); f.texte(x0 + 12, y - 1, "Numéro de porte (voir le tableau)", 6.8, False, "g"); y -= 9
    f.cercle(x0 + 5, y, 3.2, .6, fill=white); f.poly([(x0 + 8.2, y - 1.8), (x0 + 12.5, y), (x0 + 8.2, y + 1.8)], .4, close=True, fill=black)
    f.texte(x0 + 5, y - 1, "A", 6.5, True); f.texte(x0 + 16, y - 1, "Repère de coupe (la pointe indique le sens du regard)", 6.8, False, "g"); y -= 9
    f.cercle(x0 + 5, y, 3.2, .6, fill=white); f.texte(x0 + 5, y - 1, "1", 6.5, True); f.texte(x0 + 12, y - 1, "Numéro de vue", 6.8, False, "g")
    # colonne 2 : matériaux en coupe
    y = 256
    f.texte(x1_, y, "MATÉRIAUX EN COUPE", 9, True, "g"); y -= 12
    for i, (st, nom) in enumerate(_cp.LEGENDE):
        cy = y - i * 13
        _cp.motif(f, st, x1_, cy - 8, x1_ + 18, cy); f.texte(x1_ + 22, cy - 4.5, nom, 6.8, False, "g")
    y -= 13 * len(_cp.LEGENDE) + 4
    f.texte(x1_, y, "COULEURS DES RÉSEAUX", 9, True, "g"); y -= 8
    for (nom, col) in [("Eau froide (EF)", EF), ("Eau chaude (EC)", EC), ("Drainage sanitaire", DR), ("Ventilation (évent)", VE), ("Électricité", ELEC), ("Ventilation et chauffage (CVCA)", CVC_A)]:
        f.ligne(x1_, y, x1_ + 20, y, 1.6, col); f.texte(x1_ + 24, y - 1, nom, 6.8, False, "g"); y -= 6.5
    # colonne 3 : abréviations
    y = 256
    f.texte(x2_, y, "ABRÉVIATIONS", 9, True, "g"); y -= 8
    ABR = [("AFCI", "Disjoncteur anti-arcs"), ("c/c", "Centre à centre (espacement)"), ("CE", "Chauffe-eau"), ("CVCA", "Chauffage, ventilation, climatisation"),
           ("DDFT", "Protection contre les défauts à la terre"), ("DEL", "Diode électroluminescente (éclairage)"), ("EC / EF", "Eau chaude / eau froide"),
           ("évd", "Évier de cuisine double"), ("g.-r.", "Garde-robe"), ("lv", "Lave-vaisselle"), ("OSB", "Panneau de copeaux orientés"),
           ("PEX", "Tuyau en polyéthylène réticulé"), ("PP", "Panneau principal"), ("R-24", "Résistance thermique (système impérial)"),
           ("RTU", "Unité de toit (climatisation)"), ("SdB", "Salle de bain"), ("T et P", "Soupape de température et de pression"),
           ("VRC", "Ventilateur récupérateur de chaleur"), ("wc", "Toilette"), ("Ø", "Diamètre"), ("± 0", "Niveau du sol fini (référence)")]
    for (a, b) in ABR:
        f.texte(x2_, y, a, 6.8, True, "g"); f.texte(x2_ + 18, y, b, 6.5, False, "g"); y -= 5.8
    f.notes("COMMENT LIRE UN PLAN", ["Repérer d'abord le cartouche : projet, titre de la feuille, échelle, numéro.",
                                     "Toutes les dimensions sont en millimètres, sauf indication contraire.",
                                     "L'échelle 1:50 veut dire que 1 mm sur le papier représente 50 mm dans la réalité.",
                                     "Une même pièce se retrouve sur plusieurs feuilles : plan, plomberie, électricité, chauffage.",
                                     "Les bulles de coupe renvoient à la feuille où la coupe est dessinée.",
                                     "En cas de contradiction, la cote écrite prime sur la mesure au papier."])
    c.showPage()


# =========================================================== A-401 LOCAUX ET FINIS
def feuille_finis(self, c):
    f = Feuille(c, self.dossier, "A-401", "TABLEAU DES LOCAUX\nET DES FINIS", "—")
    rows = []
    for (nivnom, locaux, hc) in _niveaux_finis(self):
        for (no, nom, x0, y0, x1, y1) in locaux:
            pl, mu, pt, pb = finis_de(nom)
            if "sous-sol" in nivnom.lower() and pl.startswith("Bois"): pl = "Plancher flottant stratifié sur sous-couche"
            a = (x1 - x0) * (y1 - y0) / 1e6
            rows.append([nivnom.replace("Rez-de-chaussée", "RDC").replace("Niveau unique", "—"), no, nom.replace("\n", " "), f"{a:.1f}".replace(".", ","), pl, mu, pt, pb, fmt(hc)])
    entetes = ["Niveau", "No", "Local", "m²", "Plancher", "Murs", "Plafond", "Plinthe", "H. libre"]
    larg = [16, 10, 42, 12, 62, 70, 56, 26, 14]
    h, size = 6.0, 7.4
    par_col = 36
    parts = [rows[i:i + par_col] for i in range(0, len(rows), par_col)] or [[]]
    y = 258
    for p in parts:
        y = f.tableau(DRAW[0] + 4, y, "TABLEAU DES LOCAUX ET DES FINIS" if p is parts[0] else "SUITE", entetes, p, larg, h=h, size=size) - 10
    tot = sum(float(r[3].replace(",", ".")) for r in rows)
    f.vue(0, 0, 1)
    f.texte(DRAW[0] + 4, max(y + 6, 22), "Superficie totale des locaux : " + f"{tot:.1f}".replace(".", ",") + " m² (surfaces entre les faces intérieures des murs)", 7.5, True, "g")
    f.notes("FINIS", ["Les finis sont proposés à titre d'exemple pour l'exercice; le choix final revient au client et au concepteur.",
                      "Hauteur libre : distance entre le dessus du plancher fini et le dessous du plafond.",
                      "Zones humides : gypse hydrofuge et membrane d'étanchéité sous la céramique.",
                      "Plinthes : prévoir un joint souple de 6 mm entre le plancher et la plinthe.",
                      "Peinture : une couche d'apprêt, deux couches de finition. Teintes à choisir.",
                      "Planchers de céramique : joints de 3 mm, coulis époxy dans les zones humides."])
    c.showPage()


# =========================================================== PLAN DE TOITURE (bâtiments d'un niveau)
def feuille_toiture(self, c):
    N = self.Nplan
    f = Feuille(c, self.dossier, "A-102", "PLAN DE TOITURE", f"1:{N}")
    self._centrer(f, N)
    W, D, t, k = self.W, self.D, self.t, N / 50
    pignon = getattr(self, "toit", "plat") == "pignon"
    if pignon:
        ov = self.debord; pente = self.pente
        f.rect(-ov, -ov, W + ov, D + ov, 1.0, fill=HexColor("#e9e9e9")); f.rect(0, 0, W, D, .6, dash=[4, 2])
        f.ligne(-ov, D / 2, W + ov, D / 2, 1.6, black); f.texte(W / 2, D / 2 + 220 * k, "FAÎTE", 6.5, True)
        for yy in range(-ov, D + ov, 300): f.ligne(-ov, yy, W + ov, yy, .12, GRIS_C) if (yy < D / 2 - 100 or yy > D / 2 + 100) else None
        pct = round(pente * 100)
        for xx in (W * .2, W * .5, W * .8):
            _fleche(f, xx, D / 2 - 250 * k, xx, D * .18, .7); _fleche(f, xx, D / 2 + 250 * k, xx, D * .82, .7)
        f.texte(W * .2 + 500 * k, D * .3, f"pente {pct} %", 6, False, "g"); f.texte(W * .2 + 500 * k, D * .7, f"pente {pct} %", 6, False, "g")
        f.ligne(-ov, -ov, W + ov, -ov, 2.2, DR); f.ligne(-ov, D + ov, W + ov, D + ov, 2.2, DR)
        f.texte(W / 2, -ov - 520 * k, "Gouttière en aluminium 125 mm", 6.5, True, "c", DR); f.texte(W / 2, D + ov + 300 * k, "Gouttière en aluminium 125 mm", 6.5, True, "c", DR)
        for (xx, yy) in ((-ov + 60, -ov + 60), (W + ov - 60, -ov + 60), (-ov + 60, D + ov - 60), (W + ov - 60, D + ov - 60)):
            f.cercle(xx, yy, 110 * k, .8, DR, fill=white)
        f.texte(W / 2, D * .1, "Descentes pluviales aux quatre coins, rejet à 1,5 m de la fondation", 6, False, "c", DR)
        f.rect(W * .35, D / 2 - 150 * k, W * .45, D / 2 + 150 * k, .6, fill=white); f.texte(W * .4, D / 2 - 600 * k, "Évents de toit", 5.5, False, "c", GRIS)
        f.cote(-ov, W + ov, -2200 * k); f.cote(-ov, D + ov, -2200 * k, orient="v")
        notes = [f"Toit à deux versants : pente de {pct} % (environ {round(math.degrees(math.atan(pente)))}°); débord de {fmt(ov)}.",
                 "Revêtement : bardeaux d'asphalte sur membrane autocollante aux égouts et aux noues.", "Isolant soufflé R-60 dans l'entretoit, ventilation par soffites et évents.",
                 "Gouttières et descentes : drainage vers le terrain ou le puisard, jamais vers le réseau sanitaire."]
    else:
        pb = getattr(self, "parapet", 600)
        f.poly(self.contour(0), 1.4, close=True, fill=HexColor("#f2f2f2")); f.poly(self.contour(-t), .6, close=True, dash=[4, 2])
        aire = self.aire_emprise() / 1e6; nb = max(2, math.ceil(aire / 220))
        em = getattr(self, "retrait", None); xmax = em[0] if em else W
        for i in range(nb):
            xx = xmax * (i + .5) / nb; yy = D * .5
            f.cercle(xx, yy, 190 * k, .8, DR, fill=white); f.ligne(xx - 190 * k, yy, xx + 190 * k, yy, .5, DR); f.ligne(xx, yy - 190 * k, xx, yy + 190 * k, .5, DR)
            _fleche(f, xx, D * .22, xx, yy - 330 * k, .6); _fleche(f, xx, D * .78, xx, yy + 330 * k, .6)
            if i == 0: f.texte(xx + 500 * k, D * .3, "pente 2 %", 6, False, "g")
            if i < nb - 1: _fleche(f, xx + (xmax / nb) * .15, yy, xx + (xmax / nb) * .35, yy, .6, GRIS)
        f.texte(xmax / nb / 2, yy + 700 * k, "DRAIN DE TOIT Ø 100", 6, True, "c", DR)
        for xx in (xmax * .08, xmax * .92):
            f.rect(xx - 150 * k, 20, xx + 150 * k, t - 20, .6, DR, fill=white)
        f.texte(xmax * .08, -450 * k, "Trop-plein 150 × 100", 5.5, False, "c", DR)
        f.rect(xmax * .22 - 400, D * .5 + 1500 * k, xmax * .22 + 400, D * .5 + 1500 * k + 800, .6, fill=white); f.texte(xmax * .22, D * .5 + 1500 * k + 1050, "Écoutille de toit 800 × 800", 5.5, False, "c")
        if getattr(self, "unites_toit", None):
            import unites_toit as _u
            _u.feuille_toiture_unites(self, f, N)
        elif getattr(self, "unite_toit", None):
            ux = xmax * .6; f.rect(ux, D * .5 - 3300 * k - 300, ux + 2400, D * .5 - 3300 * k + 1100, .8, fill=white)
            f.texte(ux + 1200, D * .5 - 3300 * k + 200, "RTU", 6.5, True, "c", CVC_A); f.texte(ux + 1200, D * .5 - 3300 * k - 750 * k, "Unité de toit sur socle", 5.5, False, "c", GRIS)
        f.cote(0, W, -1500 * k); f.cote(0, D, -1500 * k, orient="v")
        notes = [f"Toit plat avec parapet de {fmt(pb)} : membrane élastomère 2 plis, isolant rigide en pente (2 %).", f"{nb} drains de toit Ø 100 au centre du bâtiment; trop-pleins de sécurité dans le parapet.",
                 "Relevés de membrane de 200 mm minimum au-dessus du toit fini, solin métallique au sommet du parapet.", "Écoutille de toit avec échelle fixe; passerelle de protection autour des unités de toit."]
    f.nord(DRAW[2] - 16, DRAW[3] - 18)
    f.titre_vue(DRAW[0] + 4, DRAW[1] + 6, 1, "PLAN DE TOITURE", f"1:{N}"); f.barre_echelle(DRAW[0] + 120, DRAW[1] + 6, N)
    f.notes("NOTES DE TOITURE", notes + ["Les flèches indiquent le sens d'écoulement de l'eau.", "Charge de neige de calcul au sol : 2,9 kPa (valeur d'exercice, à valider selon la municipalité)."])
    c.showPage()


# =========================================================== A-501 DÉTAILS TYPES
def _etiq(f, x, y, dx, dy, t, size=5.6):
    f.ligne(x, y, x + dx, y + dy, .3); f.texte(x + dx + (40 if dx >= 0 else -40), y + dy - 25, t, size, False, "g" if dx >= 0 else "d")


def _mur(f, x0, z0, z1, avec_gypse=True):
    """Couches d'un mur type (extérieur à gauche) entre z0 et z1; retourne l'abscisse de la face intérieure."""
    x = x0
    for (st, e) in (("vinyle", 20), ("vide", 19), ("isolant_rigide", 50), ("panneau", 11), ("laine", 140), ("gypse", 13)):
        _cp.motif(f, st, x, z0, x + e, z1); x += e
    return x


def feuille_details(self, c):
    f = Feuille(c, self.dossier, "A-501", "DÉTAILS TYPES\nDE CONSTRUCTION", "1:6 à 1:8")
    N = 6
    cw, ch = 162, 121
    top = DRAW[3] - 8
    cases = [(DRAW[0] + 4, top), (DRAW[0] + 4 + cw, top), (DRAW[0] + 4, top - ch), (DRAW[0] + 4 + cw, top - ch)]
    pignon = getattr(self, "toit", "plat") == "pignon" or hasattr(self, "toit_plans")
    LAB = dict(size=5.4, larg=36)

    def origine(i, ymin, xmin=0, marge_x=12, n=6):
        x, y = cases[i]
        f.vue(x + marge_x - xmin / n, y - 100 - ymin / n, n)

    # 1 appui de fenêtre -------------------------------------------------
    origine(0, 300, xmin=-80, n=6)
    _mur(f, 0, 300, 400)
    _cp.motif(f, "bois", 60, 400, 150, 450)
    f.rect(70, 450, 140, 780, .6, fill=white); f.rect(78, 500, 90, 780, .5, fill=HexColor("#cfe3ee"))
    f.poly([(-80, 360), (50, 400), (50, 418), (-80, 380)], .7, close=True, fill=HexColor("#b8c4cc"))
    f.ligne(-80, 360, -80, 340, .8)
    f.ligne(40, 400, 40, 540, .5, EF); f.ligne(40, 540, 66, 540, .5, EF)
    _cp.motif(f, "laine", 110, 400, 150, 450)
    items = [("Tablette d'appui en aluminium, goutte d'eau, pente 15°", (-60, 372)), ("Solin autocollant remonté sous le cadre", (40, 520)),
             ("Mousse isolante et scellant autour du cadre", (130, 425)), ("Fenêtre à triple vitrage, cadre isolé", (110, 650)), ("Mur type M1 (voir A-302)", (230, 340)),
             ("Gypse 12,7 retourné au cadre", (250, 395))]
    _cp.etiquettes(f, items, 330, 300, 800, **LAB)
    f.titre_vue(cases[0][0], cases[0][1] - 114, 1, "APPUI DE FENÊTRE", "1:6")
    # 2 seuil de porte ----------------------------------------------------
    origine(1, -200, xmin=-340, n=8)
    _cp.motif(f, "beton", -20, -200, 250, 0)
    _cp.motif(f, "bois", 20, 0, 250, 38); _cp.motif(f, "panneau", 20, 38, 480, 57)
    _cp.motif(f, "bois", 0, 0, 38, 300); _cp.motif(f, "panneau", -20, 38, 20, 300)
    f.rect(480, 57, 520, 90, .5, fill=HexColor("#e6cf9a"))
    f.rect(-60, 150, 110, 190, .6, fill=HexColor("#b8c4cc"))
    f.rect(60, 190, 100, 400, .6, fill=white)
    _cp.motif(f, "beton", -330, 20, -60, 120)
    items = [("Marche de béton, pente 2 % vers l'extérieur", (-200, 120)), ("Seuil d'aluminium à rupture thermique", (25, 190)), ("Porte isolée avec coupe-bise", (80, 330)),
             ("Plancher fini 19 sur contreplaqué 19", (400, 70)), ("Solive de rive isolée", (120, 20)), ("Fondation en béton 250", (100, -150))]
    _cp.etiquettes(f, items, 560, -200, 420, **LAB)
    f.titre_vue(cases[1][0], cases[1][1] - 114, 2, "SEUIL DE PORTE", "1:8")
    # 3 raccord de toit ----------------------------------------------------
    origine(2, 250, xmin=-430, n=7)
    if pignon:
        _mur(f, 0, 250, 300)
        _cp.motif(f, "bois", -10, 300, 253, 360)
        f.poly([(-380, 440), (253, 520), (253, 360), (-380, 400)], .6, close=True, fill=HexColor("#e6cf9a"))
        f.poly([(-380, 440), (253, 520), (253, 534), (-380, 454)], .7, close=True, fill=HexColor("#555555"))
        _cp.motif(f, "laine", 20, 360, 240, 440)
        f.rect(-380, 330, -330, 460, .6, fill=HexColor("#b8c4cc"))
        f.rect(-330, 380, -20, 396, .5, fill=white)
        f.poly([(-382, 332), (-420, 332), (-420, 400), (-380, 400)], .8, DR)
        items = [("Bardeaux d'asphalte sur membrane autocollante", (-200, 490)), ("Gouttière 125 mm", (-400, 360)), ("Soffite ventilé (grille)", (-200, 388)),
                 ("Isolant soufflé R-60 et déflecteur de ventilation", (120, 400)), ("Lisse de chaînage 38 × 140", (130, 330))]
        titre = "ÉGOUT DE TOIT (TOIT EN PENTE)"
    else:
        _mur(f, 0, 250, 480)
        _cp.motif(f, "beton", 130, 270, 253, 340)
        f.rect(130, 340, 253, 470, .6, fill=HexColor("#e6cf9a"))
        _cp.motif(f, "isolant_rigide", 130, 470, 253, 520)
        f.poly([(130, 520), (253, 520), (253, 530), (130, 530)], .6, close=True, fill=HexColor("#2f3439"))
        f.poly([(105, 520), (105, 740), (125, 740), (125, 540), (253, 540), (253, 520)], .5, close=True, fill=HexColor("#2f3439"))
        f.rect(80, 735, 160, 755, .6, fill=HexColor("#b8c4cc"))
        items = [("Membrane élastomère 2 plis, remontée de 200 mm", (200, 535)), ("Solin métallique au sommet du parapet", (120, 745)), ("Isolant rigide en pente", (190, 495)),
                 ("Pont d'acier (tôle nervurée)", (190, 400)), ("Mur type : voir la coupe de mur", (60, 350))]
        titre = "RACCORD DE TOIT PLAT ET PARAPET"
    _cp.etiquettes(f, items, 330, 250, 770, **LAB)
    f.titre_vue(cases[2][0], cases[2][1] - 114, 3, titre, "1:7")
    # 4 dalle sur sol : joint de retrait --------------------------------------
    origine(3, -330, xmin=-100, n=6)
    _cp.motif(f, "terre", -100, -330, 450, -300); _cp.motif(f, "pierre", -100, -300, 450, -100)
    f.ligne(-100, -100, 450, -100, .5, VE)
    _cp.motif(f, "isolant_rigide", -100, -100, 450, -50)
    _cp.motif(f, "beton", -100, -50, 450, 50)
    f.poly([(178, 50), (192, 50), (192, -5), (178, -5)], .4, close=True, fill=white)
    f.poly([(168, 50), (202, 50), (192, 28), (178, 28)], .5, close=True, fill=HexColor("#2f3439"))
    items = [("Scellant souple dans le trait de scie", (185, 45)), ("Joint de retrait scié (1/4 de l'épaisseur)", (185, 0)), ("Dalle de béton 100, 25 MPa", (60, 20)),
             ("Isolant rigide 50", (300, -75)), ("Polyéthylène 0,15 (pare-vapeur)", (300, -100)), ("Pierre nette 200, compactée", (300, -200)), ("Sol naturel", (300, -315))]
    _cp.etiquettes(f, items, 500, -330, 140, **LAB)
    f.titre_vue(cases[3][0], cases[3][1] - 114, 4, "DALLE SUR SOL : JOINT DE RETRAIT", "1:6")
    f.vue(0, 0, 1)
    f.notes("NOTES", ["Détails types : ils ne remplacent pas les plans d'atelier du fabricant.", "Respecter les chevauchements de membranes (100 mm minimum) et la continuité de l'isolant et du pare-vapeur.",
                      "Chaque détail est à lire avec la coupe de mur de la feuille de coupes.", "Les cotes sont en millimètres; échelles indiquées sous chaque détail."])
    c.showPage()


def installer(classe):
    for n in ("feuille_legende", "feuille_finis", "feuille_toiture", "feuille_details"):
        setattr(classe, n, globals()[n])
    classe._niveaux_finis = _niveaux_finis
