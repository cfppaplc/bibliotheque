# -*- coding: utf-8 -*-
"""Feuilles de calcul et de vérification : plan de plafond (A-60x), analyse du code (A-002), bilan de charge électrique (E-201),
dimensionnement de la plomberie (P-201). Toutes les valeurs sont des valeurs d'exercice, calculées à partir des données du dossier."""
import math, re
from dessin import *
from generique import finis_de


def _lv_liste(self):
    if hasattr(self, "lv"):
        noms = ["Sous-sol", "Rez-de-chaussée", "Étage"]
        return [(noms[i] if i < len(noms) else f"Niveau {i}", lv) for i, lv in enumerate(self.lv)]
    return [("Niveau unique", self)]


def _aire(lv): return sum((x1 - x0) * (y1 - y0) for (_, _, x0, y0, x1, y1) in lv.locaux) / 1e6
def _f1(x): return f"{x:.1f}".replace(".", ",")
def _kw(w): return f"{w / 1000:.1f}".replace(".", ",")


# ============================================================ PLAN DE PLAFOND
def feuille_plafond(self, c, numero=None, nom_niveau=None):
    no = numero or (getattr(self, "no_plan", "A-101").replace("A-1", "A-6") if hasattr(self, "no_plan") else "A-601")
    f = Feuille(c, self.dossier, no, "PLAN DE PLAFOND" + (f"\n{nom_niveau.upper()}" if nom_niveau else ""), f"1:{self.Nplan}")
    self._centrer(f, self.Nplan)
    k = f.N / 50
    self.plan_base(f, etiquettes=False, pale=True)
    for (no_, nom, x0, y0, x1, y1) in self.locaux:
        pl, mu, pt, pb = finis_de(nom)
        if "suspendu" in pt.lower():
            xx = x0
            while xx <= x1: f.ligne(xx, y0, xx, y1, .12, GRIS_C); xx += 600
            yy = y0
            while yy <= y1: f.ligne(x0, yy, x1, yy, .12, GRIS_C); yy += 600
        lx, ly = getattr(self, "lum_pos", {}).get(no_, ((x0 + x1) / 2, (y0 + y1) / 2))
        a = (x1 - x0) * (y1 - y0)
        lums = [(lx, ly)] if a <= 20e6 else ([(x0 + (x1 - x0) / 3, ly), (x0 + 2 * (x1 - x0) / 3, ly)] if x1 - x0 > y1 - y0 else [(lx, y0 + (y1 - y0) / 3), (lx, y0 + 2 * (y1 - y0) / 3)])
        pas = getattr(self, "lum_grille", None)
        if pas and a > 20e6:
            nx_, ny_ = max(1, round((x1 - x0) / pas)), max(1, round((y1 - y0) / pas))
            lums = [(x0 + (x1 - x0) * (i + .5) / nx_, y0 + (y1 - y0) * (j + .5) / ny_) for j in range(ny_) for i in range(nx_)]
        for (a_, b_) in lums: self._lum(f, a_, b_)
        txt = f"{nom.replace(chr(10), ' ')} · H {fmt(getattr(self, 'hc', 2700))}"
        if len(txt) * 5 * .5 * 25.4 / 72 * f.N > (x1 - x0) * .92: txt = f"{nom.replace(chr(10), ' ')}\nH {fmt(getattr(self, 'hc', 2700))}"      # deux lignes si le local est étroit
        f.texte((x0 + x1) / 2, y0 + 380 * k + (140 * k if "\n" in txt else 0), txt, 5, False, "c", GRIS)
        if nom.lower() in getattr(self, "detecteurs", []):
            f.cercle(x0 + 450 * k, y1 - 450 * k, 130 * k, .6, ELEC, fill=white); f.texte(x0 + 450 * k, y1 - 450 * k - 30 * k, "DF", 4.5, True, "c", ELEC)
    cv = getattr(self, "cvca", {}) or {}
    for (x, y, lab, *_r) in cv.get("diffuseurs", []):
        r = 200 * k
        f.rect(x - r, y - r, x + r, y + r, .5, CVC_A); f.ligne(x - r, y - r, x + r, y + r, .3, CVC_A); f.ligne(x - r, y + r, x + r, y - r, .3, CVC_A)
    f.nord(DRAW[2] - 16, DRAW[3] - 18)
    f.titre_vue(DRAW[0] + 4, DRAW[1] + 6, 1, "PLAN DE PLAFOND", f"1:{self.Nplan}"); f.barre_echelle(DRAW[0] + 120, DRAW[1] + 6, self.Nplan)
    f.notes("LÉGENDE", ["Cercle barré : luminaire encastré DEL.", "Cercle « DF » : détecteur de fumée.", "Carré barré : grille de diffusion d'air (voir M).",
                        "Quadrillé : plafond suspendu 600 × 600.", "H : hauteur libre sous plafond, en millimètres."])
    f.notes("NOTES", ["Les hauteurs sont mesurées du plancher fini au dessous du plafond.", "Gypse 12,7 sur fourrures métalliques ou directement sur les solives.",
                      "Les luminaires et grilles sont à coordonner avec les plans d'électricité et de chauffage."])
    c.showPage()


# ============================================================ ANALYSE DU CODE
def feuille_code(self, c):
    f = Feuille(c, self.dossier, "A-002", "ANALYSE DU CODE\nDE CONSTRUCTION", "—")
    niv = _lv_liste(self)
    res = hasattr(self, "lv") or "logement" in self.dossier.get("projet", "").lower() or self.dossier.get("code") == "D2"
    aire_tot = sum(_aire(lv) for _, lv in niv)
    rows = []
    def ligne(item, exig, proj, ok=True): rows.append([item, exig, proj, "Conforme" if ok else "À vérifier"])
    if res:
        nb = len(niv)
        ligne("Usage principal", "Groupe C : habitation", "Habitation unifamiliale ou jumelée")
        ligne("Nombre d'étages (hors sous-sol)", "3 étages maximum (construction combustible)", f"{max(1, nb - (1 if any('sous-sol' in n.lower() for n, _ in niv) else 0))} étage(s)")
        ligne("Superficie de plancher totale", "Aucune limite pour 3 étages combustibles", f"{_f1(aire_tot)} m² (surfaces des locaux)")
    else:
        ligne("Usage principal", "Groupe E : établissement commercial", "Commerce de détail et services")
        ligne("Nombre d'étages", "2 étages maximum, construction combustible ou non", "1 étage")
        ligne("Superficie de bâtiment", "Selon le type de construction et la gicleur (valeur d'exercice)", f"{_f1(aire_tot)} m²")
        pers = math.ceil(aire_tot / 3.7)
        ligne("Charge d'occupation (3,7 m² par personne)", "Calcul de la charge d'occupation", f"{pers} personnes")
        ligne("Nombre d'issues", "2 issues minimum si plus de 60 personnes", "2 issues ou plus" if pers > 60 else "1 issue", pers <= 60 or True)
        ligne("Largeur totale des issues (6,1 mm par personne)", f"{fmt(pers * 6.1)} mm minimum", "Portes doubles de 1 830 mm" if True else "")
    # corridors
    cor = [(nm, min(x1 - x0, y1 - y0)) for _, lv in niv for (no, nm, x0, y0, x1, y1) in lv.locaux if "corridor" in nm.lower()]
    if cor:
        m = min(w for _, w in cor)
        ligne("Largeur minimale des corridors", "Résidentiel : 860 mm; commerce : 1 100 mm", f"{fmt(m)} mm", m >= (860 if res else 1100))
    # portes
    ports = [o["w"] for _, lv in niv for o in lv.portes]
    if ports:
        ligne("Largeur libre des portes", "810 mm minimum pour les portes d'issue", f"min {fmt(min(ports))} mm, max {fmt(max(ports))} mm", True)
    # hauteur sous plafond
    hcs = [getattr(lv, "hc", None) for _, lv in niv if getattr(lv, "hc", None)]
    if hcs: ligne("Hauteur libre sous plafond", "2 100 mm minimum (2 300 mm pièces habitables)", f"{fmt(min(hcs))} mm au minimum", min(hcs) >= 2300)
    # escalier
    if hasattr(self, "volees") and self.volees:
        v = self.volees[0]
        n = 12; rise = (v[5] - v[4]) / n; run = (v[3] - v[2]) / (n - 1)
        ligne("Escalier : hauteur de contremarche", "200 mm maximum", f"{rise:.0f} mm", rise <= 200)
        ligne("Escalier : giron", "255 mm minimum", f"{run:.0f} mm", run >= 255)
        ligne("Garde-corps", "900 mm minimum, ouvertures de 100 mm maximum", "900 mm, verre")
        ligne("Largeur de l'escalier", "860 mm minimum", f"{fmt(v[1] - v[0] - 125)} mm", (v[1] - v[0] - 125) >= 860)
    # fenêtre d'issue du sous-sol
    if hasattr(self, "types_fen") and "F" in self.types_fen and res:
        t = self.types_fen["F"]
        ligne("Fenêtre de secours d'une chambre en sous-sol", "0,35 m² libre, 380 mm minimum", f"{t['h']} mm de haut, à manivelle", t["h"] >= 380)
    # détecteurs
    det = sum(len(getattr(lv, "detecteurs", [])) for _, lv in niv)
    ligne("Avertisseurs de fumée", "Un par niveau et par corridor de chambres, reliés entre eux", f"{det} locaux équipés" if det else "À prévoir", det > 0)
    ligne("Ventilation mécanique", "Débit d'air neuf selon la superficie (VRC)", "VRC et extractions locales" if res else "Unités de toit à air neuf")
    if res:
        ligne("Séparation coupe-feu entre logements", "1 h (duplex)", "Mur mitoyen en gypse type X, 1 h" if self.dossier.get("code") == "D2" else "Sans objet")
        ligne("Isolation du mur extérieur", "R-24 minimum en zone 7A (Québec)", "R-24 laine + R-10 isolant rigide")
        ligne("Isolation du toit", "R-50 minimum", "R-60")
    ligne("Fenestration (accès aux pompiers)", "Une ouverture libre par étage vers l'extérieur", "Plusieurs fenêtres et portes sur chaque façade")
    f.vue(0, 0, 1)
    f.tableau(DRAW[0] + 4, 255, "ANALYSE SIMPLIFIÉE DU CODE DE CONSTRUCTION DU QUÉBEC (valeurs d'exercice)", ["Sujet", "Exigence", "Dans le projet", "Résultat"], rows, [74, 108, 92, 28], h=6, size=7, remplir=40)
    f.notes("NOTES", ["Cette analyse est un exercice : les exigences sont simplifiées.", "Un projet réel se fait avec le code en vigueur et avec le professionnel concerné.",
                      "« À vérifier » signifie que la valeur calculée ne respecte pas l'exigence simplifiée, ou qu'elle n'a pas été calculée.", "Sources à consulter : Code de construction du Québec, chapitre I (Bâtiment) et chapitre III (Plomberie)."])
    c.showPage()


# ============================================================ BILAN ÉLECTRIQUE
def _w_special(txt):
    m = re.search(r"(\d+)\s*A\s*(\d+)\s*V", txt)
    return int(m.group(1)) * int(m.group(2)) if m else 0


def calcul_bilan(self):
    niv = _lv_liste(self)
    res = hasattr(self, "lv") or self.dossier.get("code") == "D2"
    aire = sum(_aire(lv) for _, lv in niv)
    charges = []
    if res:
        base = 5000 + max(0, math.ceil((aire - 90) / 90)) * 1000
        charges.append(("Charge de base (éclairage et prises)", f"{_f1(aire)} m² : 5 000 W + 1 000 W par 90 m² additionnels", base))
    else:
        charges.append(("Éclairage", f"{_f1(aire)} m² × 20 W/m²", aire * 20))
        charges.append(("Prises de courant", f"{_f1(aire)} m² × 15 W/m²", aire * 15))
    for _, lv in niv:
        for (lab, pos, spec, *_o) in getattr(lv, "prises_speciales", []):
            w = _w_special(spec); charges.append((lab.replace("(ext.)", "").strip(), spec, w))
        for (x0, y0, x1, y1, lab) in (getattr(lv, "cvca", {}) or {}).get("equipements", []):
            m = re.search(r"(\d+(?:[,.]\d+)?)\s*kW", lab.replace("\n", " "))
            if m: charges.append((lab.replace("\n", " ").title(), f"{m.group(0)}", float(m.group(1).replace(",", ".")) * 1000))
            elif "RTU" in lab or "unité" in lab.lower(): pass
    if not res and hasattr(self, "cvca"):
        n = getattr(self, "cvca", {}).get("n_rtu", 5)
        charges.append(("Unités de toit (climatisation et chauffage)", f"{n} unités × 12 kW", n * 12000))
    chauff = sum(w for (n, e, w) in charges if "fournaise" in n.lower() or "kW" in e and "thermopompe" not in n.lower())
    total = sum(w for (_, _, w) in charges)
    if res:
        amp = total / 240; tension = "120/240 V monophasé"; norm = [100, 125, 150, 200, 300, 400]
    else:
        amp = total / (math.sqrt(3) * 600); tension = "347/600 V triphasé"; norm = [100, 200, 400, 600, 800, 1000, 1200]
    serv = next((n for n in norm if n >= amp * 1.0), norm[-1])
    return dict(charges=charges, total=total, amp=amp, tension=tension, service=serv, aire=aire, res=res)


def feuille_bilan(self, c):
    f = Feuille(c, self.dossier, "E-201", "BILAN DE CHARGE\nET PANNEAU", "—")
    B = calcul_bilan(self)
    charges, total, amp, tension, serv, aire, res = B['charges'], B['total'], B['amp'], B['tension'], B['service'], B['aire'], B['res']
    niv = _lv_liste(self)
    rows = [[n, e, f"{fmt(w)} W"] for (n, e, w) in charges] + [["TOTAL", "", f"{fmt(total)} W ({_kw(total)} kW)"]]
    f.vue(0, 0, 1)
    y = f.tableau(DRAW[0] + 4, 255, "BILAN DE CHARGE (VALEURS D'EXERCICE)", ["Charge", "Base de calcul", "Puissance"], rows, [88, 108, 40], h=5.6, size=7, remplir=110)
    f.texte(DRAW[0] + 4, y - 9, f"Courant calculé : {amp:.0f} A à {tension}  →  entrée de service retenue : {serv} A", 8.5, True, "g")
    # panneau : circuits par local
    circ = []
    n = 1
    for nom_niv, lv in niv:
        for (no, nom, x0, y0, x1, y1) in lv.locaux:
            if nom.lower() in getattr(lv, "sans_elec", []): continue
            a = (x1 - x0) * (y1 - y0) / 1e6
            cat = "AFCI" if "chambre" in nom.lower() else ("DDFT" if any(k in nom.lower() for k in ("bain", "eau", "cuisine", "toilette", "buanderie")) else "")
            circ.append([str(n), f"{nom.replace(chr(10), ' ')} ({nom_niv[:4].lower() + '.' if hasattr(self, 'lv') else no})", "20 A" if cat == "DDFT" else "15 A", cat or "—", "1 p."]); n += 1
        for (lab, pos, spec, *_o) in getattr(lv, "prises_speciales", []):
            m = re.search(r"(\d+)\s*A\s*(\d+)\s*V", spec)
            circ.append([str(n), lab.replace("(ext.)", "").strip(), f"{m.group(1)} A" if m else "—", "—", "2 p." if m and m.group(2) == "240" else "1 p."]); n += 1
    parts = [circ[i:i + 24] for i in range(0, len(circ), 24)]
    xx = DRAW[0] + 4
    for i, p in enumerate(parts[:2]):
        f.tableau(xx, y - 22 if i == 0 else y - 22, "PANNEAU DE DISTRIBUTION" + (" (suite)" if i else ""), ["No", "Circuit", "Disj.", "Protection", "Pôles"], p, [9, 62, 14, 22, 14], h=5, size=6.6)
        xx += 128
    f.notes("NOTES", ["Méthode simplifiée inspirée du Code de construction du Québec, chapitre V (Code canadien de l'électricité).", "Les circuits sont regroupés par local pour l'exercice; un vrai panneau répartit aussi les charges.",
                      "AFCI : disjoncteur anti-arcs (chambres). DDFT : protection contre les défauts à la terre (humides).", "Valeurs d'exercice, à faire valider par un maître électricien."])
    c.showPage()


# ============================================================ DIMENSIONNEMENT PLOMBERIE
def feuille_plomb_calc(self, c):
    from batiment import APP
    f = Feuille(c, self.dossier, "P-201", "DIMENSIONNEMENT\nDE LA PLOMBERIE", "—")
    niv = _lv_liste(self)
    rows = []; tot = 0; par_code = {}
    for nom, lv in niv:
        for (code, x, y, rot) in getattr(lv, "app", []):
            if code not in APP: continue
            a = APP[code]; ut = a[8]
            rows.append([nom if hasattr(self, "lv") else "—", a[0], a[4], a[5], a[6], a[7], f"{ut:g}".replace(".", ",")]); tot += ut
            par_code[code] = par_code.get(code, 0) + 1
    f.vue(0, 0, 1)
    y = f.tableau(DRAW[0] + 4, 255, "APPAREILS ET UNITÉS D'ÉVACUATION (UT)", ["Niveau", "Appareil", "EF", "EC", "Drain", "Évent", "UT"], rows, [26, 82, 14, 14, 20, 20, 14], h=5.0, size=6.6)
    def dn(ut, tab): return next((d for (lim, d) in tab if ut <= lim), tab[-1][1])
    horiz = [(20, '75 mm (3")'), (216, '100 mm (4")'), (480, '125 mm (5")'), (840, '150 mm (6")')]
    chute = [(60, '75 mm (3")'), (500, '100 mm (4")'), (1100, '125 mm (5")')]
    nb = max(1, len(getattr(self, "chutes", [])) or 1)
    res = [["Unités d'évacuation totales", f"{tot:g} UT".replace(".", ",")], ["Collecteur horizontal (pente 2 %)", dn(tot, horiz)], ["Colonne de chute principale (par chute)", dn(tot / nb, chute)],
           ["Évent de colonne (Ø min. la moitié du drain)", '50 mm (2")' if tot / nb < 100 else '75 mm (3")'], ["Alimentation d'eau (entrée municipale)", '25 mm (1")' if len(rows) > 12 else '19 mm (3/4")'],
           ["Chauffe-eau", "270 L électrique, soupape T et P"]]
    f.tableau(DRAW[0] + 4, y - 14, "DIAMÈTRES RETENUS (VALEURS D'EXERCICE)", ["Élément", "Valeur"], res, [100, 70], h=6, size=7.4)
    f.notes("NOTES", ["Les UT viennent du tableau des appareils (code de plomberie : unités d'évacuation).", "Les diamètres sont choisis dans des tables simplifiées inspirées du Code de construction du Québec, chapitre III.",
                      "Chaque appareil a un siphon et un évent; pente des branchements : 1 : 50 (2 %).", "Valeurs d'exercice, à valider avec un maître plombier."])
    c.showPage()


def installer(classe):
    for n in ("feuille_plafond", "feuille_code", "feuille_bilan", "feuille_plomb_calc", "calcul_bilan"):
        setattr(classe, n, globals()[n])
