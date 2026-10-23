# -*- coding: utf-8 -*-
"""Façades contemporaines pour le dossier 4 : murs-rideaux, panneaux composites d'aluminium (gris anthracite),
volumes-signaux revêtus de lames façon bois, bandeau d'enseignes, marquises en porte-à-faux, fenêtres verticales étroites."""
from batiment import *

ANTHRACITE, JOINT = HexColor("#5a6068"), HexColor("#7d848c")
BOIS, LAME = HexColor("#d3a26a"), HexColor("#a9773f")
VERRE, MENEAU = HexColor("#d6e8f5"), HexColor("#4f5a64")
BANDEAU = HexColor("#2f3439")


class BatimentModerne(Batiment):
    """volumes = {cote: [(x0, x1, matériau, z_parapet)]}, marquises = {cote: [(x0, x1)]}, enseignes = {cote: [(x0, x1, texte)]}"""

    def _panneaux(self, f, x0, x1, z0, z1, pas_x=1500, pas_z=1000):
        f.rect(x0, z0, x1, z1, .6, fill=ANTHRACITE)
        x = x0 + pas_x
        while x < x1 - 1: f.ligne(x, z0, x, z1, .22, JOINT); x += pas_x
        z = z0 + pas_z
        while z < z1 - 1: f.ligne(x0, z, x1, z, .22, JOINT); z += pas_z

    def _bois(self, f, x0, x1, z0, z1):
        f.rect(x0, z0, x1, z1, .6, fill=BOIS)
        x = x0 + 150
        while x < x1 - 1: f.ligne(x, z0, x, z1, .18, LAME); x += 150

    def _mur_rideau(self, f, x0, x1, z0, z1, traverse=3000):
        f.rect(x0, z0, x1, z1, .9, MENEAU, fill=VERRE)
        n = max(1, round((x1 - x0) / 1500))
        for k in range(1, n): xx = x0 + (x1 - x0) * k / n; f.ligne(xx, z0, xx, z1, .5, MENEAU)
        if z0 + traverse < z1: f.ligne(x0, z0 + traverse, x1, z0 + traverse, .5, MENEAU)
        for k in range(n):                      # reflets
            xa = x0 + (x1 - x0) * k / n
            f.ligne(xa + 250, z0 + 500, xa + 900, z0 + 1700, .25, white)

    def _elevation(self, f, cote, L):
        z0, zp, zm = self.z_sol, self.z_plancher, self.z_murs
        f.ligne(-1200, z0, L + 300, z0, 1.4)
        f.hachures(-1200, z0 - 350, L + 300, z0, 120, 45, GRIS_C)
        f.rect(0, z0, L, zp, .5, fill=HexColor("#cfd3d6"))
        vols = self.volumes.get(cote, [(0, L, "panneau", zm + self.parapet)])
        zpar = zm + self.parapet
        for (x0, x1, mat, zh) in vols:
            if mat == "bois": self._bois(f, x0, x1, zp, zh)
            elif mat == "verre": self._mur_rideau(f, x0, x1, zp, zh, traverse=4200)
            else: self._panneaux(f, x0, x1, zp, zh)
            f.ligne(x0 - 40, zh, x1 + 40, zh, 1.1)                  # solin
        self.z_faite = zpar
        # unités de toit en retrait (pointillé)
        if cote in "SN":
            for ux in (L * .2, L * .5, L * .78):
                f.rect(ux, zpar, ux + 2200, zpar + 900, .4, GRIS, dash=[3, 2])
            f.texte(L * .5 + 1100, zpar + 1500, "UNITÉS DE TOIT ET PANNEAUX SOLAIRES (en retrait, peu visibles)", 4.8, col=GRIS)
        # bandeau d'enseignes
        for (x0, x1, txt) in self.enseignes.get(cote, []):
            f.rect(x0, 4500, x1, 5300, .4, fill=BANDEAU); f.texte((x0 + x1) / 2, 4900, txt, 5.2, True, col=white)
        # ouvertures (une seule étiquette pour un groupe de fenêtres pareilles et rapprochées)
        dern = {}
        for (a, o) in sorted(self.facade(cote), key=lambda t: t[0]):
            if o in self.portes:
                h = o.get("h", 2030); g = o.get("genre", "battante")
                vitree = "verre" in o.get("mat", "").lower()
                f.rect(a, zp, a + o["w"], zp + h, .8, MENEAU if vitree else black, fill=VERRE if vitree else HexColor("#e8eaec"))
                if g == "double": f.ligne(a + o["w"] / 2, zp, a + o["w"] / 2, zp + h, .5)
                if "garage" in o.get("mat", "").lower() or o["w"] > 2500:
                    for k in range(1, 5): f.ligne(a, zp + h * k / 5, a + o["w"], zp + h * k / 5, .3)
                if vitree:
                    for xx in ((a + a + o["w"] / 2) / 2, (a + o["w"] / 2 + a + o["w"]) / 2) if g == "double" else ((a + o["w"] / 2),):
                        f.ligne(xx - 150, zp + 1000, xx + 150, zp + 1000, .8)   # poignées
            else:
                ft = self.types_fen[o["type"]]
                al, h = ft["allege"], ft["h"]
                if o["type"] == "A": self._mur_rideau(f, a, a + o["w"], zp + al, zp + al + h)
                else:
                    f.rect(a, zp + al, a + o["w"], zp + al + h, .7, MENEAU, fill=VERRE)
                    if o["w"] > 2000:
                        n = round(o["w"] / 1200)
                        for k in range(1, n): f.ligne(a + o["w"] * k / n, zp + al, a + o["w"] * k / n, zp + al + h, .4, MENEAU)
                if a - dern.get(o["type"], -1e9) > 2500:
                    self._hexa(f, a + o["w"] / 2, zp + al - 420 * f.N / 100 if al > 600 else z0 - 420 * f.N / 100, o["type"])
                dern[o["type"]] = a + o["w"]
        # marquises en porte-à-faux (vue de face : bande mince, ombre en dessous)
        for (x0, x1) in self.marquises.get(cote, []):
            f.rect(x0, 4150, x1, 4450, .8, fill=HexColor("#3a3f44"))
            f.rect(x0 + 100, 3950, x1 - 100, 4150, 0, fill=HexColor("#b8c4cc"))
        # niveaux à droite
        k = f.N / 100; dernier = -1e9
        for (nom, val, z) in sorted(self.niveaux, key=lambda n: n[2] if n[2] != "faite" else self.z_faite):
            zz = z if z != "faite" else self.z_faite
            f.ligne(L + 350, zz, L + 1000 * k, zz, .3, dash=[4, 2])
            zt = max(zz, dernier + 2.8 * f.N); dernier = zt
            f.texte(L + 1100 * k, zt, f"{nom} {val}", 5.5, True, "g")
        for (txt, x_rel, z, dx, dz) in self.etiq_elev.get(cote, []):
            x = L * x_rel
            f.ligne(x, z, x + dx, z + dz, .3); f.texte(x + dx + (100 if dx >= 0 else -100), z + dz, txt, 5.5, False, "g" if dx >= 0 else "d")


def vitrines(S, segments, portes_s, h_gap=150):
    """Murs-rideaux (type A) qui remplissent chaque façade de local, sauf les portes."""
    res = []
    for (a, b) in segments:
        trous = sorted((p["s"], p["s"] + p["w"]) for p in portes_s if a <= p["s"] < b)
        x = a
        for (p0, p1) in trous:
            if p0 - h_gap - x > 900: res.append(dict(type="A", axe="h", at=S, s=x, w=p0 - h_gap - x))
            x = p1 + h_gap
        if b - x > 900: res.append(dict(type="A", axe="h", at=S, s=x, w=b - x))
    return res
