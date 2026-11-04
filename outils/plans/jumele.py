# -*- coding: utf-8 -*-
"""Duplex jumelé résidentiel : toit à quatre versants (croupe) en bardeaux foncés, parement de pierre et de fibre de bois,
fenêtres à cadre noir, auvents d'entrée. Remplace les façades génériques de Batiment (élévations et plan de toiture)."""
import math
from batiment import *
from generique import _fleche

BARD, BARD_L = HexColor("#4b4f55"), HexColor("#6a6f76")
PIERRE, J_PIERRE = HexColor("#d3d0c8"), HexColor("#9c988e")
BOIS_B, BOIS_L = HexColor("#8b5a3a"), HexColor("#6a4128")
NOIR, VERRE_J = HexColor("#25282b"), HexColor("#cfe3ee")


class BatimentJumele(Batiment):
    """pans = {cote: [(x0, x1, "bois"|"pierre")]} dans l'ordre de dessin (le dernier recouvre)."""

    def _pierre(self, f, x0, x1, z0, z1):
        f.rect(x0, z0, x1, z1, .5, fill=PIERRE)
        z, r = z0, 0
        while z < z1:
            zt = min(z + 300, z1); f.ligne(x0, zt, x1, zt, .15, J_PIERRE)
            x = x0 + (0 if r % 2 == 0 else 450)
            while x < x1:
                for w in (900, 600, 750):
                    x += w
                    if x < x1: f.ligne(x, z, x, zt, .12, J_PIERRE)
                    if x >= x1: break
            z = zt; r += 1

    def _bois(self, f, x0, x1, z0, z1):
        f.rect(x0, z0, x1, z1, .5, fill=BOIS_B)
        z = z0 + 160
        while z < z1: f.ligne(x0, z, x1, z, .12, BOIS_L); z += 160

    def _elevation(self, f, cote, L):
        z0, zp, zm, ov, P = self.z_sol, self.z_plancher, self.z_murs, self.debord, self.pente
        zb = zm - ov * P                               # dessous du toit au bord (arête d'égout)
        zf = zm + self.D / 2 * P
        f.ligne(-1200, z0, L + 300, z0, 1.4)
        f.hachures(-1200, z0 - 350, L + 300, z0, 120, 45, GRIS_C)
        f.rect(0, z0, L, zp, .5, fill=HexColor("#cfcfcf"))
        zt = zb - 200                                  # haut du parement (sous le bandeau)
        for (x0, x1, mat) in self.pans.get(cote, [(0, L, "bois")]):
            (self._pierre if mat == "pierre" else self._bois)(f, x0, x1, zp, zt)
        # bandeau et toit
        f.rect(-ov, zt, L + ov, zb, .8, fill=NOIR)
        if cote in "SN":
            pts = [(-ov, zb), (L + ov, zb), (L - self.D / 2, zf), (self.D / 2, zf)]
            xl = lambda z: -ov + (z - zb) / P
        else:
            pts = [(-ov, zb), (L + ov, zb), (L / 2, zf)]
            xl = lambda z: -ov + (z - zb) / (P * (L / 2 + ov) / (L / 2 + ov)) if False else -ov + (z - zb) / P
        f.poly(pts, .9, close=True, fill=BARD)
        z = zb + 150
        while z < zf - 10:
            f.ligne(xl(z), z, L - xl(z), z, .12, BARD_L); z += 150
        if cote in "SN":
            f.ligne(-ov, zb, self.D / 2, zf, .5, BARD_L); f.ligne(L + ov, zb, L - self.D / 2, zf, .5, BARD_L)
        f.ligne(-ov, zb, L + ov, zb, 1.1)
        self.z_faite = zf
        # ouvertures : cadres noirs
        dern = {}
        for (a, o) in sorted(self.facade(cote), key=lambda t: t[0]):
            if o in self.portes:
                h = o.get("h", 2030)
                f.rect(a, zp, a + o["w"], zp + h, .9, fill=NOIR)
                f.rect(a + 110, zp + 320, a + o["w"] - 110, zp + h - 130, .4, fill=VERRE_J)
                f.ligne(a + o["w"] - 170, zp + 1000, a + o["w"] - 170, zp + 1300, .9, white)
                # auvent d'entrée : dalle noire et poteau
                ax0, ax1 = a - 1000, a + o["w"] + 250
                f.rect(ax0, zp + 2250, ax1, zp + 2450, .8, fill=NOIR)
                f.rect(ax0, zp, ax0 + 130, zp + 2250, .6, fill=NOIR)
                f.rect(a - 450, z0, a + o["w"] + 450, zp, .5, fill=HexColor("#e6e6e6"))     # perron
            else:
                ft = self.types_fen[o["type"]]
                al, h = ft["allege"], ft["h"]
                f.rect(a, zp + al, a + o["w"], zp + al + h, 1.0, fill=NOIR)
                f.rect(a + 70, zp + al + 70, a + o["w"] - 70, zp + al + h - 70, .3, fill=VERRE_J)
                if o["w"] >= 1500 or ft["ouv"].startswith("Coulissante"): f.ligne(a + o["w"] / 2, zp + al + 70, a + o["w"] / 2, zp + al + h - 70, .9, NOIR)
                if ft["ouv"].startswith("Battant"): f.ligne(a + o["w"] - 70, zp + al + 70, a + 70, zp + al + h / 2, .2, NOIR); f.ligne(a + 70, zp + al + h / 2, a + o["w"] - 70, zp + al + h - 70, .2, NOIR)
                if a - dern.get(o["type"], -1e9) > 2500:
                    self._hexa(f, a + o["w"] / 2, zp + al - 420 * f.N / 100, o["type"])
                dern[o["type"]] = a + o["w"]
        k = f.N / 100; dernier = -1e9
        for (nom, val, z) in sorted(self.niveaux, key=lambda n: n[2] if n[2] != "faite" else 1e9):
            zz = z if z != "faite" else self.z_faite
            f.ligne(L + 350, zz, L + 1000 * k, zz, .3, dash=[4, 2])
            zt_ = max(zz, dernier + 2.8 * f.N); dernier = zt_
            f.texte(L + 1100 * k, zt_, f"{nom} {val}", 5.5, False, "g")
        for (txt, x_rel, z, dx, dz) in self.etiq_elev.get(cote, []):
            x = L * x_rel
            f.ligne(x, z, x + dx, z + dz, .3); f.cercle(x, z, 40, .3, fill=black)
            f.texte(x + dx + (100 if dx >= 0 else -100), z + dz, txt, 5.5, False, "g" if dx >= 0 else "d")


def feuille_toiture_croupe(self, c):
    N = self.Nplan
    f = Feuille(c, self.dossier, "A-102", "PLAN DE TOITURE", f"1:{N}")
    self._centrer(f, N)
    W, D, k, ov, P = self.W, self.D, N / 50, self.debord, self.pente
    X0, X1, Y0, Y1 = -ov, W + ov, -ov, D + ov
    f.rect(X0, Y0, X1, Y1, 1.0, fill=HexColor("#e4e4e6")); f.rect(0, 0, W, D, .6, dash=[4, 2])
    a, b = D / 2, W - D / 2
    for (x, y) in ((X0, Y0), (X1, Y0), (X0, Y1), (X1, Y1)):
        f.ligne(x, y, a if x < W / 2 else b, D / 2, 1.0)
    f.ligne(a, D / 2, b, D / 2, 1.8, black); f.texte(W * .3, D / 2 + 260 * k, "FAÎTE", 6.5, True)
    f.texte(W / 2 + 300 * k, D * .9, "Mur mitoyen coupe-feu", 5.5, False, "g", GRIS)
    f.ligne(W / 2, Y0, W / 2, Y1, .6, GRIS, dash=[6, 3])
    for (x1_, y1_, x2_, y2_) in ((W * .22, D * .5 - 700 * k, W * .22, D * .12), (W * .22, D * .5 + 700 * k, W * .22, D * .88),
                                 (W * .78, D * .5 - 700 * k, W * .78, D * .12), (W * .78, D * .5 + 700 * k, W * .78, D * .88),
                                 (a - 700 * k, D * .5, X0 + 600, D * .5), (b + 700 * k, D * .5, X1 - 600, D * .5)):
        _fleche(f, x1_, y1_, x2_, y2_, .7)
    f.texte(W * .22 + 450 * k, D * .24, f"pente {round(P * 100)} %", 6, False, "g")
    for (x, y, t) in ((X0, Y0, ""), (X1, Y0, ""), (X0, Y1, ""), (X1, Y1, "")):
        f.cercle(x + (60 if x < 0 else -60), y + (60 if y < 0 else -60), 110 * k, .8, DR, fill=white)
    f.ligne(X0, Y0, X1, Y0, 2.2, DR); f.ligne(X0, Y1, X1, Y1, 2.2, DR); f.ligne(X0, Y0, X0, Y1, 2.2, DR); f.ligne(X1, Y0, X1, Y1, 2.2, DR)
    f.texte(W / 2, Y0 - 520 * k, "Gouttière en aluminium 125 mm", 6.5, True, "c", DR)
    f.cote(X0, X1, -2200 * k); f.cote(Y0, Y1, -2200 * k, orient="v")
    f.nord(DRAW[2] - 16, DRAW[3] - 18)
    f.titre_vue(DRAW[0] + 4, DRAW[1] + 6, 1, "PLAN DE TOITURE", f"1:{N}"); f.barre_echelle(DRAW[0] + 120, DRAW[1] + 6, N)
    f.notes("NOTES DE TOITURE", [f"Toit à quatre versants (croupe) : pente de {round(P * 100)} % (environ {round(math.degrees(math.atan(P)))}°); débord de {fmt(ov)} sur les quatre côtés.",
                                "Revêtement : bardeaux d'asphalte gris anthracite sur membrane autocollante aux égouts et aux noues.",
                                "Isolant soufflé R-60 dans l'entretoit, ventilation par soffites continus et évents de faîte.",
                                "Gouttières sur les quatre côtés; une descente à chaque coin, rejet à 1,5 m de la fondation.",
                                "Les flèches indiquent le sens d'écoulement de l'eau.", "Charge de neige de calcul au sol : 2,9 kPa (valeur d'exercice)."])
    c.showPage()


BatimentJumele.feuille_toiture = feuille_toiture_croupe
