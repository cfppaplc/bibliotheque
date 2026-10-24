# -*- coding: utf-8 -*-
"""Maisons à étages (sous-sol, rez-de-chaussée, étage), style contemporain à toit plat.
Chaque niveau est un Batiment ordinaire (plan, plomberie, électricité, CVCA de ce niveau);
MaisonEtages dessine ce qui traverse les niveaux : élévations, coupes, fondations, isométrique, page de garde."""
import math
from batiment import *
from moderne import BatimentModerne, ANTHRACITE, JOINT, BOIS, LAME, VERRE, MENEAU
import coupes as _cp

BLANC_FC, JOINT_C = HexColor("#f1f1ee"), HexColor("#c9c9c4")
BOIS_C, ISO_C = _cp.BOIS_C, _cp.ISO_C


def niveau(commun, **kw):
    d = dict(commun); d.update(kw)
    return Batiment(**d)


def etiquettes_d(f, items, x_lab, z_min, z_max, size=5.2, larg=30):
    """Comme coupes.etiquettes, mais la colonne de texte est à GAUCHE du dessin (texte aligné à droite)."""
    lh = size * 1.15 * 25.4 / 72 * f.N
    rows = sorted([[z, wrap(t, larg), x, z] for (t, (x, z)) in items], key=lambda r: r[0])
    gap = .9 * f.N; prev = None
    for r in rows:
        h = len(r[1]) * lh
        if prev is not None: r[0] = max(r[0], prev + gap + h / 2)
        r[0] = max(r[0], z_min + h / 2); prev = r[0] + h / 2
    over = (rows[-1][0] + len(rows[-1][1]) * lh / 2) - z_max if rows else 0
    if over > 0:
        for i in range(len(rows) - 1, -1, -1):
            r = rows[i]; h = len(r[1]) * lh
            lim = z_max if i == len(rows) - 1 else rows[i + 1][0] - len(rows[i + 1][1]) * lh / 2 - gap
            r[0] = min(r[0], lim - h / 2)
    for (zl, lignes, x, z) in rows:
        f.cercle(x, z, .45 * f.N, .3, fill=black)
        f.poly([(x, z), (x_lab + 1.5 * f.N, zl), (x_lab + .5 * f.N, zl)], .3)
        f.texte(x_lab, zl, "\n".join(lignes), size, False, "d")


class MaisonEtages(Batiment):
    """lv = [sous-sol, rez-de-chaussée, étage] (objets Batiment, chacun avec zf = dessus du plancher, hc = hauteur libre).
    zt = dessus de la structure du toit, ep_toit, zpar = dessus du parapet, ep = épaisseur des planchers de bois."""

    # ------------------------------------------------------------------ utilitaires
    def z_haut(self, i):
        """Dessous de la structure au-dessus du niveau i."""
        return self.lv[i + 1].zf - self.ep if i + 1 < len(self.lv) else self.zt - self.ep_toit

    def _pan(self, f, x0, x1, z0, z1, mat):
        if mat == "anthracite": BatimentModerne._panneaux(self, f, x0, x1, z0, z1, pas_x=1200, pas_z=1000)
        elif mat == "bois": BatimentModerne._bois(self, f, x0, x1, z0, z1)
        else:
            f.rect(x0, z0, x1, z1, .6, fill=BLANC_FC)
            x = x0 + 1200
            while x < x1 - 1: f.ligne(x, z0, x, z1, .22, JOINT_C); x += 1200
            z = z0 + 1500
            while z < z1 - 1: f.ligne(x0, z, x1, z, .22, JOINT_C); z += 1500

    # ------------------------------------------------------------------ élévations
    def _elevation(self, f, cote, L):
        z0 = self.z_sol; zp = self.lv[1].zf; zpar = self.zpar
        f.ligne(-1500, z0, L + 600, z0, 1.4)
        f.hachures(-1500, z0 - 400, L + 600, z0, 120, 45, GRIS_C)
        f.rect(0, z0, L, zp - 150, .5, fill=HexColor("#d9d9d6"))            # béton apparent (isolé, crépi)
        for (x0, x1, mat) in self.volumes.get(cote, [(0, L, "blanc")]):
            self._pan(f, x0, x1, zp - 150, zpar, mat)
        f.rect(-40, zpar - 90, L + 40, zpar, .8, fill=HexColor("#2f3439"))   # solin du parapet
        f.ligne(0, self.lv[2].zf - self.ep / 2, L, self.lv[2].zf - self.ep / 2, .35, GRIS)   # joint creux entre les étages
        self.z_faite = zpar
        dern = {}
        for i, lv in enumerate(self.lv):
            zf = lv.zf
            for (a, o) in sorted(lv.facade(cote), key=lambda t: t[0]):
                if o in lv.portes:
                    h = o.get("h", 2030); g = o.get("genre", "battante")
                    f.rect(a - 60, zf, a + o["w"] + 60, zf + h + 60, .5, fill=HexColor("#2f3439"))
                    f.rect(a, zf, a + o["w"], zf + h, .6, MENEAU, fill=VERRE if g == "coulissante" or "verre" in o.get("mat", "").lower() or "vitrage" in o.get("mat", "").lower() else HexColor("#3c3f44"))
                    if g == "coulissante": f.ligne(a + o["w"] / 2, zf, a + o["w"] / 2, zf + h, .6, MENEAU)
                    else: f.ligne(a + o["w"] - 140, zf + 900, a + o["w"] - 140, zf + 1300, 1.2, HexColor("#c9c9c9"))
                    if zf - z0 > 200 and o.get("ext", True):                       # marches de béton
                        n = max(1, round((zf - z0) / 180))
                        for k in range(n):
                            zz = z0 + k * (zf - z0) / n
                            f.rect(a - 300 - (n - k) * 120, zz, a + o["w"] + 300 + (n - k) * 120, zz + (zf - z0) / n, .4, fill=HexColor("#e6e6e6"))
                    continue
                ft = lv.types_fen[o["type"]]; al, h = ft["allege"], ft["h"]
                zb, zh = zf + al, zf + al + h
                if zb < z0:                                                       # fenêtre de sous-sol : margelle sous le sol
                    f.poly([(a - 250, z0), (a - 250, zb - 250), (a + o["w"] + 250, zb - 250), (a + o["w"] + 250, z0)], .5, GRIS, dash=[3, 2])
                    f.rect(a, zb, a + o["w"], z0, .4, GRIS, dash=[3, 2])
                    zb_v = z0
                else: zb_v = zb
                f.rect(a - 50, zb_v - (50 if zb >= z0 else 0), a + o["w"] + 50, zh + 50, .5, fill=HexColor("#2f3439"))
                f.rect(a, zb_v, a + o["w"], zh, .5, MENEAU, fill=VERRE)
                n = max(1, round(o["w"] / 1300))
                for k in range(1, n): f.ligne(a + o["w"] * k / n, zb_v, a + o["w"] * k / n, zh, .8, HexColor("#2f3439"))
                if ft["ouv"].startswith("Fixe et") and h > 1600: f.ligne(a, zb + 600, a + o["w"], zb + 600, .8, HexColor("#2f3439"))
                if ft["ouv"].startswith("Battant") or ft["ouv"].startswith("Auvent"):
                    if ft["ouv"].startswith("Auvent"): f.poly([(a + 60, zb_v + 60), (a + o["w"] / 2, zh - 60), (a + o["w"] - 60, zb_v + 60)], .25, GRIS, dash=[3, 2])
                    else: f.poly([(a + o["w"] / n - 60, zb_v + 60), (a + 60, (zb_v + zh) / 2), (a + o["w"] / n - 60, zh - 60)], .25, GRIS, dash=[3, 2])
                for k in range(n): f.ligne(a + o["w"] * k / n + 250, zb_v + 400, a + o["w"] * k / n + 700, zb_v + 1000 if zh - zb_v > 1100 else zh - 100, .25, white)   # reflet
                if a - dern.get((i, o["type"]), -1e9) > 1800:
                    self._hexa(f, a + o["w"] / 2, (zb_v - 380 * f.N / 100) if zb >= z0 else zb - 250 - 380 * f.N / 100, o["type"])
                dern[(i, o["type"])] = a + o["w"]
        for (x0, x1, z) in self.marquises.get(cote, []):                       # marquise d'acier au-dessus de l'entrée
            f.rect(x0, z, x1, z + 200, .8, fill=HexColor("#2f3439")); f.rect(x0 + 80, z - 80, x1 - 80, z, 0, fill=HexColor("#b8c4cc"))
        k = f.N / 100; dernier = -1e9
        for (nom, val, z) in sorted([n for n in self.niveaux if n[2] >= 0], key=lambda n: n[2]):
            f.ligne(L + 350, z, L + 1000 * k, z, .3, dash=[4, 2])
            zt = max(z, dernier + 2.8 * f.N); dernier = zt
            f.texte(L + 1100 * k, zt, f"{nom} {val}", 5.5, True, "g")
        for (txt, x_rel, z, dx, dz) in self.etiq_elev.get(cote, []):
            x = L * x_rel
            f.ligne(x, z, x + dx, z + dz, .3); f.texte(x + dx + (100 if dx >= 0 else -100), z + dz, txt, 5.5, False, "g" if dx >= 0 else "d")

    def facade(self, cote):
        return []

    # ------------------------------------------------------------------ coupes (A transversale, B longitudinale)
    def _coupe_niv(self, f, axe, pos, x_lab=None):
        W, D, t, tf, ep = self.W, self.D, self.t, self.t_fond, self.ep
        L = D if axe == "A" else W
        z0, zs, zss = self.z_sol, self.z_semelle, self.lv[0].zf
        zp1, zt, zpar = self.lv[1].zf, self.zt, self.zpar
        items = []
        # terrain et fondations
        for (a, b) in ((-1800, 0), (L, L + 600)):
            f.ligne(a, z0, b, z0, 1.2); f.hachures(a, zs - 500, b, z0, 1.5 * f.N, 135, GRIS_C)
        for (x, sg) in ((0, 1), (L - tf, -1)):
            f.rect(x - 200, zs, x + tf + 200, zs + 250, .8, fill=HexColor("#cfcfcf")); f.hachures(x - 200, zs, x + tf + 200, zs + 250, 1.2 * f.N, 45, GRIS, .3)
            f.rect(x, zs + 250, x + tf, zp1 - ep, .8, fill=HexColor("#cfcfcf")); f.hachures(x, zs + 250, x + tf, zp1 - ep, 1.2 * f.N, 45, GRIS, .3)
            xe = x - 50 if sg > 0 else x + tf
            f.rect(xe, zs + 250, xe + 50, z0 + 300, .3, fill=HexColor("#eef6ff"))            # isolant rigide extérieur
            dx = x - 400 if sg > 0 else x + tf + 400
            f.cercle(dx, zs + 150, 60, .6, fill=white)
        items.append(("F1 — mur de fondation 250, isolant rigide extérieur, drain français", (125, zs + 900)))
        # dalle du sous-sol
        f.rect(tf, zss - 100, L - tf, zss, .6, fill=HexColor("#cfcfcf")); f.rect(tf, zss - 150, L - tf, zss - 100, .3, fill=HexColor("#eef6ff"))
        f.hachures(tf, zs + 250, L - tf, zss - 150, 1.0 * f.N, 30, GRIS_C)
        items.append(("D1 — dalle 100 sur isolant 50 et pierre", (L * .62, zss - 50)))
        # planchers (avec trémies d'escalier)
        def vides(i):
            res = []
            for (x0, y0, x1, y1) in getattr(self.lv[i], "tremies", []):
                if axe == "A" and x0 <= pos <= x1: res.append((y0, y1))
                if axe == "B" and y0 <= pos <= y1: res.append((x0, x1))
            return res
        def segs(a, b, trous):
            out = [(a, b)]
            for (u0, u1) in trous:
                nx = []
                for (p, q) in out:
                    if u1 <= p or u0 >= q: nx.append((p, q)); continue
                    if u0 > p: nx.append((p, u0))
                    if u1 < q: nx.append((u1, q))
                out = nx
            return out
        for i in range(1, len(self.lv)):
            zf = self.lv[i].zf
            for (a, b) in segs(t if i > 1 else tf, L - (t if i > 1 else tf), vides(i)):
                f.rect(a, zf - ep, b, zf, .6, fill=white)
                x = a + 200
                while x < b - 100: f.ligne(x, zf - ep + 30, x, zf - 30, .15, GRIS_C); x += 400
                f.rect(a, zf - 19, b, zf, .3, fill=HexColor("#e6cf9a"))
        items.append(("P1 — plancher : solives de bois en I 302, contreplaqué 19", (L * .35, self.lv[1].zf - ep / 2)))
        # murs extérieurs (bois, de part et d'autre) avec ouvertures coupées
        def ouv_mur(lv, cote_mur):
            res = []
            for o in lv.portes + lv.fenetres:
                if axe == "A" and o["axe"] == "h" and abs(o["at"] - (lv.S if cote_mur == 0 else lv.N_)) < 1 and o["s"] <= pos <= o["s"] + o["w"]: res.append(o)
                if axe == "B" and o["axe"] == "v" and abs(o["at"] - (lv.O if cote_mur == 0 else lv.E)) < 1 and o["s"] <= pos <= o["s"] + o["w"]: res.append(o)
            return res
        for cote_mur, (xa, xb) in ((0, (0, t)), (1, (L - t, L))):
            for i, lv in enumerate(self.lv):
                zb = lv.zf if i else zp1 - ep          # sous-sol : le mur de bois commence sur la fondation
                zh = self.lv[i + 1].zf - ep if i + 1 < len(self.lv) else zpar
                if i == 0:
                    trous = [(lv.zf + lv.types_fen[o["type"]]["allege"], lv.zf + lv.types_fen[o["type"]]["allege"] + lv.types_fen[o["type"]]["h"]) for o in ouv_mur(lv, cote_mur) if o in lv.fenetres]
                    xf0, xf1 = (0, tf) if cote_mur == 0 else (L - tf, L)
                    for (a, b) in trous:
                        f.rect(xf0 - 2, a, xf1 + 2, min(b, zp1 - ep), .3, fill=white); f.ligne((xf0 + xf1) / 2, a, (xf0 + xf1) / 2, min(b, zp1 - ep), .6)
                    continue
                trous = []
                for o in ouv_mur(lv, cote_mur):
                    if o in lv.portes: trous.append((lv.zf, lv.zf + o.get("h", 2030)))
                    else: ft = lv.types_fen[o["type"]]; trous.append((lv.zf + ft["allege"], lv.zf + ft["allege"] + ft["h"]))
                zz = zb - (ep if i else 0)
                for (a, b) in sorted(trous) + [(zh, zh)]:
                    if a > zz: f.rect(xa, zz, xb, a, .8, fill=GRIS)
                    zz = max(zz, b)
                for (a, b) in trous:
                    f.ligne(xa, a, xa, b, .3); f.ligne(xb, a, xb, b, .3); f.ligne((xa + xb) / 2, a, (xa + xb) / 2, b, .6)
        f.rect(-40, zpar - 60, t + 40, zpar, .5, fill=HexColor("#555")); f.rect(L - t - 40, zpar - 60, L + 40, zpar, .5, fill=HexColor("#555"))
        items.append(("M1 — mur extérieur (voir coupe de mur, A-302)", (t / 2, self.lv[1].zf + 1300)))
        # toit plat
        f.rect(t, zt - self.ep_toit, L - t, zt, .6, fill=white)
        x = t + 300
        while x < L - t - 100: f.ligne(x, zt - self.ep_toit + 30, x, zt - 30, .15, GRIS_C); x += 600
        f.rect(t, zt - self.ep_toit + 40, L - t, zt - 60, .2, ISO_C, fill=ISO_C)
        f.poly([(t, zt), (L / 2, zt + 120), (L - t, zt)], .9)                   # pente vers le drain de toit
        f.ligne(t, zt + 130, L - t, zt + 130, .3, GRIS, dash=[3, 2])
        items.append(("T1 — toit plat : membrane, isolant en pente, solives en I 356 et laine R-60", (L * .45, zt - self.ep_toit / 2)))
        # plafonds, murs intérieurs coupés, locaux
        for i, lv in enumerate(self.lv):
            zc = lv.zf + lv.hc
            for (a, b) in segs(t if i else tf, L - (t if i else tf), vides(i + 1) if i + 1 < len(self.lv) else []):
                f.rect(a, zc, b, zc + 13, .3, fill=HexColor("#f4f4f4"))
            for (x1, y1, x2, y2, e) in lv.murs_int:
                if axe == "A" and y1 == y2 and min(x1, x2) <= pos <= max(x1, x2): u = y1
                elif axe == "B" and x1 == x2 and min(y1, y2) <= pos <= max(y1, y2): u = x1
                else: continue
                f.rect(u - e / 2, lv.zf, u + e / 2, zc, .6, fill=GRIS_TC)
            for (no, nom, x0, y0, x1, y1) in lv.locaux:
                if (axe == "A" and x0 <= pos <= x1) or (axe == "B" and y0 <= pos <= y1):
                    a, b = (y0, y1) if axe == "A" else (x0, x1)
                    if b - a > 900: f.texte((a + b) / 2, lv.zf + lv.hc * .62, nom.replace("\n", " ").upper() + f" {no}", 4.8, True, col=GRIS)
        # escaliers (profil des marches) quand la coupe passe dans la cage
        for (x0, x1, y0, y1, za, zb) in getattr(self, "volees", []):
            if axe != "A" or not (x0 <= pos <= x1): continue
            n = max(2, round((zb - za) / 190)); g = (y1 - y0) / (n - 1)
            pts = [(y0, za)]
            for k in range(n):
                y = y0 + k * g; zz = za + (k + 1) * (zb - za) / n
                pts += [(y, zz), (min(y + g, y1), zz)]
            f.poly(pts[:-1], .7)
            ang = math.atan2(zb - za, y1 - y0); dz = 250 / math.cos(ang)
            f.ligne(y0, za - dz + (zb - za) / n, y1, zb - dz, .6)
        if any(axe == "A" and x0 <= pos <= x1 for (x0, x1, *_r) in getattr(self, "volees", [])):
            items.append(("Escalier : marches 190 × 270 environ, garde-corps 900 au palier", (2300, self.lv[1].zf + 1500)))
        # niveaux et cotes
        dernier = -1e9
        for (nom, val, z) in sorted(self.niveaux, key=lambda n: n[2]):
            zt_ = max(z, dernier + 2.6 * f.N); dernier = zt_
            f.ligne(L + 2 * f.N, z, L + 9 * f.N, z, .3, dash=[3, 1.5]); f.texte(L + 10 * f.N, zt_, f"{nom} {val}", 5.4, True, "g")
        f.cote(0, L, zs - 450)
        if x_lab is not None: etiquettes_d(f, items, x_lab, zs, zpar + 300)
        return L

    def feuille_coupe(self, c):
        N = self.Ncoupe
        f = Feuille(c, self.dossier, "A-301", "COUPE TRANSVERSALE\nET NOMENCLATURES", f"1:{N}")
        f.vue(DRAW[0] + 92, DRAW[1] + 102 - (self.z_semelle - 500) / N, N)
        self._coupe_niv(f, "A", self.coupe_A_x, x_lab=-2200)
        f.titre_vue(DRAW[0] + 4, DRAW[1] + 96, "A", "COUPE A — TRANSVERSALE (vers l'est)", f"1:{N}")
        yb = DRAW[1] + 84; lignes = []
        for lv in self.lv:
            for o in lv.portes:
                lignes.append([o["no"], f"{fmt(o['w'])} × {fmt(o.get('h', 2030))}", o.get("genre", "battante").capitalize(), o.get("mat", "Âme pleine, MDF peint"), o.get("quinc", "Passage")])
        hp = min(4.6, (yb - DRAW[1] - 6) / (len(lignes) + 2))
        f.tableau(DRAW[0] + 4, yb, "NOMENCLATURE DES PORTES", ["No", "Dimensions (mm)", "Type", "Matériau", "Quincaillerie"], lignes, [12, 30, 24, 56, 42], h=hp, size=min(6.4, hp * 1.4))
        lignes = []
        tf = self.lv[1].types_fen
        for k_, ft in tf.items():
            fen = [o for lv in self.lv for o in lv.fenetres if o["type"] == k_]
            larg = sorted({o["w"] for o in fen})
            lignes.append([k_, len(fen), (" / ".join(fmt(w) for w in larg) if len(larg) <= 3 else "Variable (A-201)") + f" × {fmt(ft['h'])}", fmt(ft["allege"]), ft["ouv"], ft.get("verre", "Triple, faible émissivité")])
        f.tableau(DRAW[0] + 176, yb, "NOMENCLATURE DES FENÊTRES", ["Type", "Qté", "Larg. × haut. (mm)", "Allège", "Ouverture", "Vitrage"], lignes, [11, 9, 36, 13, 41, 38], h=4.4, size=6.2)
        f.notes("COMPOSITIONS", self.compositions)
        f.notes("À OBSERVER", ["L'allège se mesure à partir du plancher du niveau où se trouve la fenêtre.", "Fenêtres E et F : sous-sol (voir les margelles sur A-201)."])
        c.showPage()

    def feuille_coupes(self, c):
        Nb = getattr(self, "Ncoupe_B", 100)
        f = Feuille(c, self.dossier, "A-302", "COUPE LONGITUDINALE,\nCOUPE DE MUR ET MATÉRIAUX", f"1:{Nb} et 1:{self.Nmur}")
        f.vue(DRAW[0] + 10 + 1800 / Nb, DRAW[1] + 136 - (self.z_semelle - 500) / Nb, Nb)
        self._coupe_niv(f, "B", self.coupe_B_y)
        f.titre_vue(DRAW[0] + 4, DRAW[1] + 118, "B", "COUPE B — LONGITUDINALE (vers le nord)", f"1:{Nb}")
        self._coupe_mur_etages(f)
        f.vue(0, 0, 1)
        x0, ytop = DRAW[0] + 4, DRAW[1] + 100
        f.texte(x0, ytop, "LÉGENDE DES MATÉRIAUX EN COUPE", 8, True, "g")
        for i, (st, nom) in enumerate(_cp.LEGENDE):
            cx = x0 + (i % 3) * 62; cy = ytop - 8 - (i // 3) * 14
            _cp.motif(f, st, cx, cy - 9, cx + 16, cy); f.texte(cx + 19, cy - 4.5, nom, 6.5, False, "g")
        f.notes("À OBSERVER", ["La coupe B est prise sur la ligne B des plans A-101 à A-103, en regardant vers le nord.",
                               "Repérer les trois niveaux : sous-sol, rez-de-chaussée, étage. Comparer avec A-201 et A-301.",
                               "Coupe de mur : de la semelle jusqu'au parapet, de l'extérieur vers l'intérieur."])
        f.notes("COMPOSITIONS", self.compositions)
        c.showPage()

    def _coupe_mur_etages(self, f):
        N = self.Nmur; ep, tf = self.ep, self.t_fond
        zs, z0, zss = self.z_semelle, self.z_sol, self.lv[0].zf
        zp1, zp2, zt, zpar = self.lv[1].zf, self.lv[2].zf, self.zt, self.zpar
        couches = self.couches_mur; T = sum(e for (_, e, _) in couches)
        ext = sum(e for (_, e, st) in couches[:3])          # revêtement, fourrures, isolant rigide : devant le panneau OSB
        xmax = 650
        f.vue(DRAW[0] + 258 + 700 / N, DRAW[1] + 6 - (zs - 300) / N, N)
        pts = []
        _cp.motif(f, "terre", -700, zs - 300, -50, z0); f.ligne(-700, z0, 0, z0, 1.0)
        _cp.motif(f, "pierre", -520, zs, -200, zs + 420); f.cercle(-360, zs + 160, 55, .6, fill=white)
        pts.append(("Drain français Ø 100 dans la pierre nette", (-360, zs + 160)))
        _cp.motif(f, "beton", -200, zs, tf + 200, zs + 250); _cp.motif(f, "beton", 0, zs + 250, tf, zp1 - ep)
        _cp.motif(f, "isolant_rigide", -50, zs + 250, 0, zp1 - ep)
        pts += [("Semelle 650 × 250", (tf + 120, zs + 125)), ("Mur de fondation 250, 25 MPa", (tf / 2, zss + 600)),
                ("Isolant rigide extérieur 50, protégé hors sol", (-25, z0 + 200))]
        _cp.motif(f, "laine", tf, zss, tf + 89, zp1 - ep)
        pts.append(("Sous-sol : montants 38 × 89 et laine R-14", (tf + 45, zss + 1400)))
        _cp.motif(f, "beton", tf, zss - 100, xmax, zss); _cp.motif(f, "isolant_rigide", tf, zss - 150, xmax, zss - 100); _cp.motif(f, "pierre", tf, zss - 350, xmax, zss - 150)
        pts.append(("Dalle 100, isolant 50, pierre 200", (xmax * .7, zss - 50)))
        # planchers RDC et étage : solive de rive dans l'alignement du mur
        x_osb = -(ext) + ext            # face extérieure du panneau OSB = 0
        for zf in (zp1, zp2):
            _cp.motif(f, "bois", 0, zf - ep, 38, zf - 19); f.rect(38, zf - ep, xmax, zf - 19, .4, fill=BOIS_C); _cp.motif(f, "panneau", 0, zf - 19, xmax, zf)
            _cp.motif(f, "laine", 38, zf - ep + 20, 190, zf - 40)
        pts += [("Solive de rive, isolée par l'intérieur", (19, zp1 - ep / 2)), ("Solives en I 302 à 400 c/c, contreplaqué 19", (xmax * .7, zp2 - ep / 2))]
        # mur de bois (RDC + étage + parapet)
        x = -ext; zb = zp1 - ep; zh = zpar - 90
        for (nom, e, st) in couches:
            if e <= 0:
                f.ligne(x, zp1, x, zt - self.ep_toit, .9, dash=[3, 1.5]); pts.append((nom, (x, zp2 + 1600))); continue
            if st in ("vinyle", "vide", "isolant_rigide", "panneau"): _cp.motif(f, st, x, zb, x + e, zh)
            else:
                for (a, b) in ((zp1, zp2 - ep), (zp2, zt - self.ep_toit)): _cp.motif(f, st, x, a, x + e, b)
            pts.append((nom, (x + e / 2, zp1 + 900 + len(pts) % 4 * 350)))
            x += e
        # toit plat
        zr = zt - self.ep_toit
        f.rect(T - ext, zr, xmax, zt, .4, fill=BOIS_C); _cp.motif(f, "laine", T - ext, zr + 30, xmax, zt - 40)
        f.poly([(T - ext, zt), (xmax, zt + 40)], .6); f.poly([(T - ext, zt + 40), (xmax, zt + 80)], .4); _cp.motif(f, "isolant_rigide", T - ext + 20, zt, xmax, zt + 60)
        f.rect(T - ext - 13, zr - 13, xmax, zr, .4, fill=HexColor("#f4f4f4"))
        _cp.motif(f, "bois", 0, zt, T - ext, zh)                                 # muret du parapet
        f.poly([(-ext - 60, zh - 150), (-ext - 60, zpar), (T - ext + 40, zpar), (T - ext + 40, zh - 100)], 1.0, HexColor("#444"))
        f.poly([(T - ext, zt + 80), (T - ext, zh - 60)], 1.2, black)
        pts += [("Membrane élastomère 2 plis, remontée sur le parapet", (xmax * .6, zt + 70)), ("Isolant rigide en pente (drainage)", (xmax * .8, zt + 30)),
                ("Solives en I 356 et laine soufflée R-60", (xmax * .55, zr + self.ep_toit / 2)), ("Solin métallique du parapet", (T / 2 - ext, zpar)),
                ("Plafond : pare-vapeur et gypse 12,7", (xmax * .4, zr - 6))]
        # rupture
        zz = zs - 300; pp = []
        while zz < zpar + 200: pp += [(xmax, zz), (xmax + 40, zz + 120), (xmax - 40, zz + 240)]; zz += 360
        f.poly(pp, .4, GRIS)
        _cp.etiquettes(f, pts, xmax + 3.0 * N, zs - 250, zpar + 300, size=4.8, larg=30)
        f.titre_vue(DRAW[0] + 214, DRAW[1] + 118, 2, "COUPE DE MUR TYPE", f"1:{N}")

    # ------------------------------------------------------------------ fondations : celles du sous-sol
    def feuille_fondations(self, c):
        self.lv[0].feuille_fondations(c)

    # ------------------------------------------------------------------ plomberie : schéma isométrique sur trois niveaux
    def feuille_iso(self, c):
        f = Feuille(c, self.dossier, self.no_iso, "SCHÉMA ISOMÉTRIQUE ET\nNOMENCLATURE DES APPAREILS", "Sans échelle")
        ZF = .55; cs, sn = math.cos(math.radians(30)), math.sin(math.radians(30))
        iso = lambda x, y, z: ((x - y) * cs, (x + y) * sn + z * ZF)
        lignes, textes, marques = [], [], []
        def L_(pts, w, col, dash=None): lignes.append(([iso(*p) for p in pts], w, col, dash))
        def T_(x, y, z, t, col=black, al="c", dz=220): textes.append((iso(x, y, z + dz), t, col, al))
        zss = self.lv[0].zf; zc0 = zss - 350
        ztop = self.lv[-1].zf + self.lv[-1].hc
        for i, lv in enumerate(self.lv):
            zc = zc0 if i == 0 else lv.zf - self.ep * .6
            for pl in lv.reseaux():
                L_([(x, y, zc) for (x, y) in pl["coll"]], 3.0 if i == 0 else 2.4, DR)
                if i == 0 and len(pl.get("sortie", [])) > 1:
                    so = pl["sortie"]; L_([(x, y, zc - 300 * j / (len(so) - 1)) for j, (x, y) in enumerate(so)], 3.4, DR)
                    T_(*so[-1], zc - 300, "Vers l'égout municipal Ø 4\"", DR, "g", 0)
                    mx, my = (so[0][0] + so[-1][0]) / 2, (so[0][1] + so[-1][1]) / 2; marques.append(("losange", iso(mx, my, zc - 150), "Clapet antiretour"))
                    marques.append(("carre", iso(*pl["coll"][0], zc), "Regard de nettoyage"))
            for k_, (code, x, y, rot) in enumerate(lv.app):
                o = lv.sortie(code, x, y, rot)
                if not o or code == "lv": continue
                pl = lv._reseau_de(o); q, seg = lv._projeter(o, pl["coll"])
                zb = zc0 if i == 0 else lv.zf - self.ep * .6
                ht = {"lav": 450, "evd": 450, "evs": 450, "lave": 800}.get(code, 0)
                L_([(p[0], p[1], zb) for p in lv._chemin(o, q, seg)[::-1]], 1.8, DR)
                L_([(o[0], o[1], zb), (o[0], o[1], lv.zf + ht + 100)], 1.8, DR)
                if code not in ("wc", "dp"): L_([(o[0], o[1], lv.zf + ht + 100), (o[0], o[1], lv.zf + lv.hc * .8)], 1.0, VE, [2, 2])
                marques.append(("siphon", iso(o[0], o[1], lv.zf + ht), ""))
                T_(o[0], o[1], lv.zf + ht + 100, f"{code.upper()} {['SS', 'RDC', 'ÉT.'][i]}", black, "c", 250 + (k_ % 3) * 420)
        for (x, y) in self.chutes:
            L_([(x, y, zc0), (x, y, ztop)], 3.0, DR); L_([(x, y, ztop), (x, y, self.zpar + 400)], 2.0, VE, [3, 2])
            T_(x, y, self.zpar + 400, "Évent Ø 3\" au toit", VE)
            T_(x, y, (self.lv[1].zf + self.lv[2].zf) / 2, "  Chute Ø 3\"", DR, "g", 0)
        for i, lv in enumerate(self.lv):
            T_(-2600, -1500, lv.zf, ["SOUS-SOL", "REZ-DE-CHAUSSÉE", "ÉTAGE"][i] + "  ", GRIS, "d", 0)
            L_([(-2400, -1500, lv.zf), (-300, -1500, lv.zf)], .4, GRIS_C, [2, 2])
        pts = [p for (ps, *_r) in lignes for p in ps] + [t[0] for t in textes]
        x0_, x1_ = min(p[0] for p in pts), max(p[0] for p in pts); y0_, y1_ = min(p[1] for p in pts), max(p[1] for p in pts)
        aw, ah = (DRAW[2] - DRAW[0]) - 60, 150
        N = max((x1_ - x0_) / aw, (y1_ - y0_) / ah)
        f.vue(DRAW[0] + 40 + (aw - (x1_ - x0_) / N) / 2 - x0_ / N, DRAW[1] + 104 - y0_ / N, N)
        for (ps, w, col, dash) in lignes: f.poly(ps, w, col, dash)
        for (kind, (x, y), lab) in marques:
            r = 2.0 * N
            if kind == "losange": f.poly([(x, y + r), (x + r, y), (x, y - r), (x - r, y)], .8, DR, close=True, fill=white); f.texte(x + 1.5 * r, y - 1.6 * r, lab, 5.6, True, "g", DR)
            elif kind == "carre": f.rect(x - r, y - r, x + r, y + r, .8, DR, fill=white); f.texte(x - 1.6 * r, y + .2 * r, lab, 5.6, True, "d", DR)
            else: f.cercle(x, y, r * .7, .8, DR, fill=white)
        for ((x, y), t, col, al) in textes: f.texte(x, y, t, 5.4, True, al, col)
        f.titre_vue(DRAW[0] + 4, DRAW[1] + 96, 1, "SCHÉMA ISOMÉTRIQUE — DRAINAGE ET VENTILATION (3 NIVEAUX)", "sans échelle")
        compte = {}
        for lv in self.lv:
            for (code, *_r) in lv.app: compte[code] = compte.get(code, 0) + 1
        rows = []; tot = 0
        for code, q in compte.items():
            a = APP[code]; tot += a[8] * q
            rows.append([code.upper(), a[0], q, a[4], a[5], a[6], a[7], str(a[8] * q).replace(".", ",")])
        rows.append(["", "TOTAL DES UNITÉS (charge hydraulique)", "", "", "", "", "", str(tot).replace(".", ",")])
        f.tableau(DRAW[0] + 4, DRAW[1] + 84, "NOMENCLATURE DES APPAREILS SANITAIRES", ["Code", "Appareil", "Qté", "EF", "EC", "Drain", "Évent", "Unités"], rows, [16, 82, 12, 16, 16, 20, 18, 18])
        f.notes("À OBSERVER", ["Les deux colonnes de chute traversent les trois niveaux et se prolongent en évent au-dessus du toit.",
                               "Aux étages, les branchements passent dans l'épaisseur du plancher (solives en I).",
                               "Au sous-sol, le collecteur est sous la dalle; il sort vers la rue sous la semelle.",
                               "Chaque appareil a son siphon et son évent. Pente minimale 1 : 50 (2 %)."])
        c.showPage()

    # ------------------------------------------------------------------ dossier complet
    def produire(self, chemin):
        c = rl_canvas.Canvas(chemin, pagesize=(PAGE_W * MM, PAGE_H * MM), pageCompression=1)
        c.setTitle(f"{self.dossier['projet'].replace(chr(10), ' ')} — dossier de plans d'exercice"); c.setAuthor("Pavillon de l'Avenir · plan pédagogique")
        self.feuille_garde(c)
        self.feuille_site(c)
        for lv in reversed(self.lv): pass
        for lv in self.lv: lv.feuille_plan(c)
        self.feuille_elevations(c); self.feuille_coupe(c); self.feuille_coupes(c); self.feuille_fondations(c)
        for lv in self.lv: lv.feuille_plomberie(c)
        self.feuille_iso(c)
        for lv in self.lv: lv.feuille_electricite(c)
        for lv in self.lv: lv.feuille_cvca(c)
        c.save()

    def liste_feuilles(self):
        L = [["000", "Page de garde et liste des feuilles"], ["A-100", "Plan d'implantation et de site"]]
        L += [[lv.no_plan, lv.titre_plan.replace("\n", " ").capitalize()] for lv in self.lv]
        L += [["A-201", "Élévations"], ["A-301", "Coupe transversale et nomenclatures"], ["A-302", "Coupe longitudinale, coupe de mur et matériaux"],
              ["S-101", "Plan des fondations et détail type"]]
        L += [[lv.no_plomb, lv.titre_plomb.replace("\n", " ").capitalize()] for lv in self.lv] + [[self.no_iso, "Schéma isométrique et nomenclature des appareils"]]
        L += [[lv.no_elec, lv.titre_elec.replace("\n", " ").capitalize()] for lv in self.lv]
        L += [[lv.no_cvca, lv.titre_cvca.replace("\n", " ").capitalize()] for lv in self.lv]
        return L

    def feuille_garde(self, c):
        f = Feuille(c, self.dossier, "000", "PAGE DE GARDE\nET LISTE DES FEUILLES", "—")
        c_ = f.c
        c_.setFont(FONT_B, 30); c_.drawString(24 * MM, 232 * MM, self.dossier["projet"].split("\n")[0])
        c_.drawImage(LOGO, (336 - 24 * LOGO_R) * MM, 228 * MM, 24 * LOGO_R * MM, 24 * MM)
        c_.setFont(FONT, 14); yy = 222
        for l in self.dossier["projet"].split("\n")[1:] + self.dossier["adresse"].split("\n"):
            c_.drawString(24 * MM, yy * MM, l); yy -= 7
        c_.setFont(FONT_B, 11); c_.drawString(24 * MM, (yy - 2) * MM, "Conçu par " + AUTEUR); yy -= 7
        c_.setFont(FONT, 10.5); yy -= 4
        for l in wrap(self.description, 95):
            c_.drawString(24 * MM, yy * MM, l); yy -= 5.2
        lignes = self.liste_feuilles()
        h = min(6, (yy - 10 - 20) / (len(lignes) + 1))
        f.tableau(24, yy - 10, "LISTE DES FEUILLES", ["Feuille", "Titre"], lignes, [22, 118], h=h, size=min(8.5, h * 1.4))
        f.tableau(186, yy - 10, "DONNÉES DU BÂTIMENT", ["Élément", "Valeur"], self.donnees, [52, 92], h=6, size=8.2)
        f.notes("UTILISATION EN CLASSE", ["Ce dossier sert à apprendre à lire des plans : repérer les feuilles, les échelles, les symboles, les cotes et les liens entre les disciplines.",
                                         "Une maison à trois niveaux : chaque niveau a son plan (A), sa plomberie (P), son électricité (E) et son chauffage (M).",
                                         "Les renvois (bulles de coupe, types de fenêtres, numéros de portes) relient les feuilles entre elles.",
                                         "Bâtiment fictif. Les valeurs sont plausibles mais non vérifiées pour la construction."])
        c.showPage()
