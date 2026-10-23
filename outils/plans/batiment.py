# -*- coding: utf-8 -*-
"""Bâtiment paramétrique et feuilles de plans (A, S, P, E, M)."""
import math
from dessin import *
import coupes as _coupes

# ------------------------------------------------------------------ symboles d'appareils
APP = {
    # code: (nom, largeur, profondeur, sortie drain (x, y) locale, EF, EC, drain Ø, évent Ø, unités)
    "wc":   ("Toilette (réservoir 6 L)", 520, 720, (0, 300), '1/2"', "—", '3"', '2"', 4),
    "lav":  ("Lavabo", 550, 450, (0, 150), '1/2"', '1/2"', '1 1/4"', '1 1/4"', 1),
    "bain": ("Baignoire", 1520, 760, (-620, 380), '1/2"', '1/2"', '1 1/2"', '1 1/4"', 1.5),
    "dou":  ("Douche", 900, 900, (0, 450), '1/2"', '1/2"', '2"', '1 1/2"', 1.5),
    "evd":  ("Évier de cuisine double", 800, 500, (0, 200), '1/2"', '1/2"', '1 1/2"', '1 1/4"', 1.5),
    "lv":   ("Lave-vaisselle", 600, 600, (200, 50), "—", '1/2"', "(évier)", "—", 1),
    "lave": ("Laveuse (tuyau de rejet)", 700, 700, (0, 50), '1/2"', '1/2"', '2"', '1 1/2"', 1.5),
    "ce":   ("Chauffe-eau électrique 270 L", 600, 600, None, '3/4"', '3/4"', "—", "—", 0),
    "dp":   ("Drain de plancher", 200, 200, (0, 0), "—", "—", '3"', "—", 2),
    "uri":  ("Urinoir", 450, 380, (0, 150), '3/4"', "—", '2"', '1 1/2"', 2),
    "vid":  ("Évier de service (vidoir)", 600, 600, (0, 300), '1/2"', '1/2"', '3"', '1 1/2"', 3),
    "fon":  ("Fontaine à boire", 400, 350, (0, 120), '1/2"', "—", '1 1/4"', '1 1/4"', 0.5),
    "evs":  ("Évier simple (salle des employés)", 600, 500, (0, 200), '1/2"', '1/2"', '1 1/2"', '1 1/4"', 1.5),
}


def rotp(x, y, rot):
    a = math.radians(rot)
    return x * math.cos(a) - y * math.sin(a), x * math.sin(a) + y * math.cos(a)


class Batiment:
    def __init__(self, **d):
        self.__dict__.update(d)
        t = self.t
        self.S, self.N_, self.O, self.E = t / 2, self.D - t / 2, t / 2, self.W - t / 2

    # =============================================================== PLAN D'ARCHITECTURE
    def murs(self, f, poche=GRIS):
        W, D, t = self.W, self.D, self.t
        f.rect(0, 0, W, D, w=1.0, fill=poche)
        f.rect(t, t, W - t, D - t, w=0.7, fill=white)
        for (x1, y1, x2, y2, e) in self.murs_int:
            if y1 == y2: f.rect(min(x1, x2) - e / 2 * 0, y1 - e / 2, max(x1, x2), y1 + e / 2, w=.6, fill=GRIS_TC)
            else: f.rect(x1 - e / 2, min(y1, y2), x1 + e / 2, max(y1, y2), w=.6, fill=GRIS_TC)

    def _epaisseur(self, axe, at):
        t = self.t
        if axe == "h" and (abs(at - self.S) < 1 or abs(at - self.N_) < 1): return t
        if axe == "v" and (abs(at - self.O) < 1 or abs(at - self.E) < 1): return t
        for (x1, y1, x2, y2, e) in self.murs_int:
            if axe == "h" and y1 == y2 and abs(y1 - at) < 1: return e
            if axe == "v" and x1 == x2 and abs(x1 - at) < 1: return e
        return 125

    def ouvertures(self, f, etiquettes=True, sym=True):
        for o in self.fenetres + self.portes:
            ax, at, s, w = o["axe"], o["at"], o["s"], o["w"]
            e = self._epaisseur(ax, at) + 4
            if ax == "h": f.rect(s, at - e / 2, s + w, at + e / 2, w=0, col=white, fill=white)
            else: f.rect(at - e / 2, s, at + e / 2, s + w, w=0, col=white, fill=white)
            # jambages
            if ax == "h":
                f.ligne(s, at - e / 2, s, at + e / 2, .6); f.ligne(s + w, at - e / 2, s + w, at + e / 2, .6)
            else:
                f.ligne(at - e / 2, s, at + e / 2, s, .6); f.ligne(at - e / 2, s + w, at + e / 2, s + w, .6)
        if not sym: return
        for o in self.fenetres:
            ax, at, s, w = o["axe"], o["at"], o["s"], o["w"]; e = self._epaisseur(ax, at)
            for k in (-0.5, -0.08, 0.08, 0.5):
                if ax == "h": f.ligne(s, at + k * e, s + w, at + k * e, .35 if abs(k) < .4 else .6)
                else: f.ligne(at + k * e, s, at + k * e, s + w, .35 if abs(k) < .4 else .6)
            if etiquettes:
                cx = s + w / 2; ext = self._cote_ext(ax, at)
                k = f.N / 50
                if ax == "h": self._hexa(f, cx, at + ext * (e / 2 + 380 * k), o["type"])
                else: self._hexa(f, at + ext * (e / 2 + 380 * k), cx, o["type"])
        for o in self.portes:
            self._porte(f, o, etiquettes)

    def _cote_ext(self, ax, at):
        if ax == "h": return -1 if abs(at - self.S) < 1 else 1
        return -1 if abs(at - self.O) < 1 else 1

    def _hexa(self, f, x, y, t):
        r = 230 * f.N / 50
        pts = [(x + r * math.cos(math.radians(a)), y + r * math.sin(math.radians(a))) for a in range(0, 360, 60)]
        f.poly(pts, .45, close=True, fill=white); f.texte(x, y, t, 6, True)

    def _porte(self, f, o, etiquette=True):
        ax, at, s, w = o["axe"], o["at"], o["s"], o["w"]
        e = self._epaisseur(ax, at); sw = o.get("sens", 1); ch = o.get("pivot", "a"); typ = o.get("genre", "battante")
        c = f.c
        if typ == "baie": return
        if typ == "coulissante":
            for k, (a, b) in ((-0.15, (s, s + w * .55)), (0.15, (s + w * .45, s + w))):
                if ax == "h": f.ligne(a, at + k * e, b, at + k * e, 1.0)
                else: f.ligne(at + k * e, a, at + k * e, b, 1.0)
        else:
            feuilles = [(s, w, "a")] if typ != "double" else [(s, w / 2, "a"), (s + w / 2, w / 2, "b")]
            for (s0, w0, piv) in feuilles:
                if typ != "double": piv = ch
                face = at + sw * e / 2
                if ax == "h":
                    hx = s0 if piv == "a" else s0 + w0; hy = face
                    ferme = 0 if piv == "a" else 180; ouvre = 90 if sw > 0 else 270
                    tip = (hx, hy + sw * w0)
                else:
                    hy = s0 if piv == "a" else s0 + w0; hx = face
                    ferme = 90 if piv == "a" else 270; ouvre = 0 if sw > 0 else 180
                    tip = (hx + sw * w0, hy)
                f.ligne(hx, hy, *tip, .8)
                ext = ((ouvre - ferme + 540) % 360) - 180
                px, py = f.P(hx, hy); R = f.L(w0)
                c.setLineWidth(.35); c.setStrokeColor(black)
                c.arc(px - R, py - R, px + R, py + R, ferme, ext)
        if etiquette and o.get("no"):
            k = f.N / 50; d = (e / 2 + 330 * k) * (sw if o.get("tag_dedans", True) and typ != "coulissante" else -sw)
            if typ != "coulissante" and o.get("tag_dedans", True): d = (e / 2 + 330 * k) * sw
            if not o.get("tag_dedans", True): d = -(e / 2 + 330 * k) * sw
            cx = s + w / 2 + (w * 0.28 if o.get("pivot", "a") == "a" else -w * 0.28) * (1 if typ != "coulissante" else 0)
            x, y = (cx, at + d) if ax == "h" else (at + d, cx)
            r = 190 * k
            f.rect(x - r * 1.5, y - r, x + r * 1.5, y + r, .45, fill=white); f.texte(x, y, o["no"], 5.6, True)

    def pieces(self, f, aire=True, size=7, coin=False):
        for (no, nom, x0, y0, x1, y1) in self.locaux:
            if coin:
                k = f.N / 50
                dx_, dy_ = getattr(self, "decal_coin", {}).get(no, (0, 0))
                txt = nom.replace("\n", " ").upper() + f"  {no}"
                larg = lambda t_: max(len(l) for l in t_.split("\n")) * size * .62 * 25.4 / 72 * f.N
                if larg(txt) > (x1 - x0) * .8 and "\n" in nom: txt = nom.upper() + f" {no}"
                if larg(txt) > (x1 - x0) * .8: txt = no
                if no in getattr(self, "coin_court", []): txt = no
                off = min(650 * k, (y1 - y0) / 2 - 250 * k)
                f.texte((x0 + x1) / 2 + dx_, (y0 + y1) / 2 - off + dy_, txt, size, True, "c", GRIS)
                continue
            cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
            dx, dy = self.decal_etiq.get(no, (0, 0)) if hasattr(self, "decal_etiq") else (0, 0)
            cx += dx; cy += dy
            nl = nom.count("\n"); lh = size * 1.15 * 25.4 / 72 * f.N
            f.texte(cx, cy + 160 * f.N / 50 + nl * lh / 2, nom.upper(), size, True)
            if aire:
                a = (x1 - x0) * (y1 - y0) / 1e6
                f.texte(cx, cy - 160 * f.N / 50 - nl * lh / 2, f"{no} · {str(round(a, 1)).replace('.', ',')} m²", size - 1)

    def appareils(self, f, couleur=black, etiquettes=False):
        for (code, x, y, rot) in self.app:
            self._sym(f, code, x, y, rot, couleur)

    def _sym(self, f, code, x, y, rot, col=black):
        T = lambda a, b: tuple(v + o for v, o in zip(rotp(a, b, rot), (x, y)))
        def R(x0, y0, x1, y1, fill=white):
            f.poly([T(x0, y0), T(x1, y0), T(x1, y1), T(x0, y1)], .5, col, close=True, fill=fill)
        def E(cx, cy, rx, ry, n=28):
            f.poly([T(cx + rx * math.cos(2 * math.pi * i / n), cy + ry * math.sin(2 * math.pi * i / n)) for i in range(n)], .5, col, close=True, fill=white)
        if code == "wc": R(-260, 0, 260, 220); E(0, 470, 190, 250); E(0, 470, 120, 170)
        elif code == "lav": R(-275, 0, 275, 450); E(0, 220, 200, 150)
        elif code == "bain": R(-760, 0, 760, 760); R(-700, 60, 700, 700); E(-620, 380, 40, 40)
        elif code == "dou":
            R(-450, 0, 450, 900); f.ligne(*T(-450, 0), *T(450, 900), .3, col); f.ligne(*T(450, 0), *T(-450, 900), .3, col); E(0, 450, 50, 50)
        elif code == "evd": R(-400, 0, 400, 500); R(-370, 70, -20, 460); R(20, 70, 370, 460)
        elif code == "evs": R(-300, 0, 300, 500); R(-240, 70, 240, 440)
        elif code == "lv": R(-300, 0, 300, 600); f.texte(*T(0, 300), "LV", 5.5, col=col)
        elif code == "lave": R(-350, 0, 350, 700); E(0, 350, 250, 250); f.texte(*T(0, 350), "LAV", 5, col=col)
        elif code == "ce": E(0, 300, 280, 280); f.texte(*T(0, 300), "C-E", 5.5, True, col=col)
        elif code == "dp": E(0, 0, 100, 100); f.ligne(*T(-100, 0), *T(100, 0), .4, col); f.ligne(*T(0, -100), *T(0, 100), .4, col)
        elif code == "uri": R(-225, 0, 225, 120); E(0, 220, 200, 160)
        elif code == "vid": R(-300, 0, 300, 600); R(-240, 60, 240, 540)
        elif code == "fon": R(-200, 0, 200, 350); E(0, 175, 110, 90)

    def sortie(self, code, x, y, rot):
        o = APP[code][3]
        if o is None: return None
        dx, dy = rotp(*o, rot); return x + dx, y + dy

    def cotes_ext(self, f):
        W, D = self.W, self.D; k = f.N / 50
        # Sud : ouvertures sur le mur sud
        for (axe, at, cote_y, orient) in (("h", self.S, -800 * k, "h"), ("h", self.N_, D + 800 * k, "h")):
            pts = {0, W}
            for o in self.fenetres + self.portes:
                if o["axe"] == "h" and abs(o["at"] - at) < 1: pts |= {o["s"] + o["w"] / 2}
            f.chaine(sorted(pts), cote_y, "h", total=False)
        for (at, cote_x) in ((self.O, -800 * k), (self.E, W + 800 * k)):
            pts = {0, D}
            for o in self.fenetres + self.portes:
                if o["axe"] == "v" and abs(o["at"] - at) < 1: pts |= {o["s"] + o["w"] / 2}
            f.chaine(sorted(pts), cote_x, "v", total=False)
        # cotes hors tout
        f.cote(0, W, -1500 * k); f.cote(0, W, D + 1500 * k)
        f.cote(0, D, -1500 * k, orient="v"); f.cote(0, D, W + 1500 * k, orient="v")

    def cotes_int(self, f):
        for (x1, x2, y, ori) in getattr(self, "cotes_interieures", []):
            f.cote(x1, x2, y, orient=ori, size=6)

    def plan_base(self, f, etiquettes=True, pale=False):
        self.murs(f, poche=GRIS_C if pale else GRIS)
        self.ouvertures(f, etiquettes=etiquettes)

    # =============================================================== FEUILLES
    def feuille_site(self, c):
        f = Feuille(c, self.dossier, "A-100", "PLAN D'IMPLANTATION\nET DE SITE", self.site["echelle_txt"])
        s = self.site; N = s["N"]
        LW, LD = s["lot"]; bx, by = s["pos"]
        x0 = DRAW[0] + ((DRAW[2] - DRAW[0]) - LW / N) / 2; y0 = DRAW[1] + (s["rue"] + 9000) / N + 6
        f.vue(x0, y0, N)
        # rue
        f.rect(-4000, -s["rue"] - 9000, LW + 4000, -s["rue"], 0, fill=HexColor("#e8e8e8"))
        f.ligne(-4000, -s["rue"] - 4500, LW + 4000, -s["rue"] - 4500, .5, GRIS, dash=[6, 4])
        f.texte(LW / 2, -s["rue"] - 6800, s["nom_rue"].upper(), 9, True, col=GRIS)
        f.rect(-4000, -s["rue"], LW + 4000, -s["rue"] + 1500, .3, fill=HexColor("#f2f2f2"))
        f.texte(LW * 0.12, -s["rue"] + 750, "TROTTOIR", 6, col=GRIS)
        # lot
        f.poly([(0, 0), (LW, 0), (LW, LD), (0, LD)], 1.0, close=True, dash=[10, 3, 2, 3])
        f.cote(0, LW, LD + 2500); f.cote(0, LD, LW + 2500, orient="v")
        f.texte(LW / 2, LD + 4300, f"LOT {s['lot_no']} · SUPERFICIE {str(round(LW * LD / 1e6, 1)).replace('.', ',')} m²", 8, True)
        # stationnement / entrée
        for (a, b, cc, d, label) in s.get("pavages", []):
            f.rect(a, b, cc, d, .5, fill=HexColor("#ececec")); f.texte((a + cc) / 2, (b + d) / 2, label, 6.5, col=GRIS)
        for (a, b, w_, n) in s.get("cases", []):
            for i in range(n):
                f.rect(a + i * w_, b, a + (i + 1) * w_, b + 5500, .4)
            f.texte(a + w_ * n / 2, b + 6200, f"{n} CASES DE STATIONNEMENT 2 600 × 5 500", 6.5, col=GRIS)
        # bâtiment
        f.rect(bx, by, bx + self.W, by + self.D, 1.2, fill=GRIS_TC)
        f.hachures(bx, by, bx + self.W, by + self.D, 900, 45, GRIS_C)
        f.rect(bx, by, bx + self.W, by + self.D, 1.2)
        f.texte(bx + self.W / 2, by + self.D / 2 + 600, self.nom_court.upper(), 8, True)
        f.texte(bx + self.W / 2, by + self.D / 2 - 600, f"Emprise au sol {str(round(self.W * self.D / 1e6, 1)).replace('.', ',')} m²", 6.5)
        # marges de recul
        cx_ = bx + self.W * s.get("cote_rel", 0.25)
        f.cote(0, by, cx_, orient="v", txt=f"{fmt(by)} (marge avant)")
        f.cote(by + self.D, LD, cx_, orient="v", txt=f"{fmt(LD - by - self.D)} (arrière)")
        f.cote(0, bx, by + self.D * 0.5, txt=f"{fmt(bx)}"); f.cote(bx + self.W, LW, by + self.D * 0.5, txt=f"{fmt(LW - bx - self.W)}")
        # services
        for sx_rel in (s["services_x"] if isinstance(s["services_x"], list) else [s["services_x"]]):
          sx = bx + sx_rel
          f.poly([(sx, by), (sx, -s["rue"] - 3000)], 1.4, DR, dash=[6, 3]); f.texte(sx + 300, -s["rue"] - 2500, "Égout sanitaire Ø 150 (6 po)\nvers réseau municipal, pente 2 %", 6, True, "g", DR)
          f.poly([(sx + 1500, by), (sx + 1500, -s["rue"] - 5500)], 1.2, EF); f.texte(sx + 1800, -s["rue"] - 5200, "Aqueduc Ø 25 (1 po) cuivre type K\nprofondeur min. 1 800 (gel)", 6, True, "g", EF)
        if s.get("pluvial"):
            sx = bx + (s["services_x"][0] if isinstance(s["services_x"], list) else s["services_x"])
            f.poly([(sx - 1500, by), (sx - 1500, -s["rue"] - 1500)], 1.2, HexColor("#555"), dash=[2, 2]); f.texte(sx - 1800, -s["rue"] - 1200, "Égout pluvial Ø 150", 6, True, "d", HexColor("#555"))
        ex, ey = s["elec"]
        f.ligne(ex, ey, ex, -s["rue"] + 1500, 1.0, ELEC, dash=[1, 2]); f.texte(ex + 250, (ey - s["rue"]) / 2, "Entrée électrique\nsouterraine", 6, True, "g", ELEC)
        # arbres et niveaux
        for (ax_, ay, r) in s.get("arbres", []):
            f.cercle(ax_, ay, r, .5, HexColor("#3a7d44")); f.cercle(ax_, ay, r * 0.15, .5, HexColor("#3a7d44"))
        for (nx, ny, val) in s["niveaux"]:
            f.ligne(nx - 250, ny - 250, nx + 250, ny + 250, .5); f.ligne(nx - 250, ny + 250, nx + 250, ny - 250, .5)
            f.texte(nx + 350, ny + 200, val, 6, True, "g")
        f.nord(DRAW[2] - 18, DRAW[3] - 20)
        f.titre_vue(DRAW[0] + 4, DRAW[1] + 6, 1, "PLAN D'IMPLANTATION", s["echelle_txt"])
        f.barre_echelle(DRAW[0] + 4, DRAW[1] + 28, N, 10)
        f.notes("NOTES D'IMPLANTATION", s["notes"])
        f.notes("LÉGENDE", ["— · — Limite de lot", "Hachures : emprise du bâtiment", "Croix : niveau du terrain (m, géodésique)",
                            "Bleu : aqueduc · Vert pointillé : égout sanitaire", "Orange pointillé : entrée électrique"])
        c.showPage()

    def feuille_plan(self, c):
        f = Feuille(c, self.dossier, "A-101", "PLAN DU REZ-DE-CHAUSSÉE", f"1:{self.Nplan}")
        self._centrer(f, self.Nplan)
        if getattr(self, "grille_xy", None): f.grille(*self.grille_xy, 0, self.W, 0, self.D, ext=getattr(self, "grille_ext", 1600))
        self.plan_base(f)
        for (x, y, sz, lab) in getattr(self, "poteaux", []) if getattr(self, "grille_xy", None) else []:
            f.rect(x - 100, y - 100, x + 100, y + 100, .6, fill=black)
        self.appareils(f)
        self.pieces(f)
        self.cotes_ext(f); self.cotes_int(f)
        cps = list(getattr(self, "coupes", []))
        if getattr(self, "coupe_long", None):
            cl = self.coupe_long; xa, xb = cl.get("x_rep", (-2300 * self.Nplan / 50, self.W + 2300 * self.Nplan / 50))
            cps += [(xa, cl["y"], cl.get("lettre", "B"), "n", "A-302"), (xb, cl["y"], cl.get("lettre", "B"), "n", "A-302")]
        par = {}
        for cp in cps: par.setdefault(cp[2], []).append(cp)
        for lst in par.values():
            if len(lst) >= 2: f.ligne(lst[0][0], lst[0][1], lst[1][0], lst[1][1], .5, black, dash=[8, 3, 2, 3])
        for cp in cps:
            self._repere_coupe(f, *cp)
        self._meubles(f)
        f.nord(DRAW[2] - 16, DRAW[3] - 18)
        f.titre_vue(DRAW[0] + 4, DRAW[1] + 6, 1, "PLAN DU REZ-DE-CHAUSSÉE", f"1:{self.Nplan}")
        f.barre_echelle(DRAW[0] + 120, DRAW[1] + 6, self.Nplan)
        f.notes("NOTES GÉNÉRALES", self.notes_plan)
        f.notes("LÉGENDE", ["Mur extérieur (poché foncé) : voir composition M1, feuille A-301",
                            "Mur intérieur (poché pâle) : voir composition M2",
                            "Hexagone : type de fenêtre (voir nomenclature, A-301)", "Rectangle : numéro de porte (voir nomenclature, A-301)",
                            "Cotes en millimètres, aux faces extérieures du revêtement intermédiaire et aux axes des ouvertures"])
        c.showPage()

    def _meubles(self, f):
        for (x0, y0, x1, y1, lab) in getattr(self, "comptoirs", []):
            f.rect(x0, y0, x1, y1, .45, dash=None)
            if lab: f.texte((x0 + x1) / 2, (y0 + y1) / 2, lab, 5.5, col=GRIS)

    def _repere_coupe(self, f, x, y, lettre, sens, feuille="A-301"):
        k = f.N / 50
        # sens : direction de visée ('n','s','e','o')
        r = 330 * k
        f.cercle(x, y, r, .6, fill=white); f.texte(x, y + 90 * k, lettre, 6.5, True); f.texte(x, y - 130 * k, feuille, 4.5)
        d = {"n": (0, 1), "s": (0, -1), "e": (1, 0), "o": (-1, 0)}[sens]
        tx, ty = x + d[0] * (r + 260 * k), y + d[1] * (r + 260 * k)
        px, py = -d[1], d[0]
        f.poly([(x + d[0] * r + px * r * .8, y + d[1] * r + py * r * .8), (tx, ty), (x + d[0] * r - px * r * .8, y + d[1] * r - py * r * .8)], .6, close=True, fill=black)

    def _centrer(self, f, N, dx=0, dy=0):
        w, h = self.W / N, self.D / N
        x0 = DRAW[0] + ((DRAW[2] - DRAW[0]) - w) / 2 + dx; y0 = DRAW[1] + ((DRAW[3] - DRAW[1]) - h) / 2 + 5 + dy
        f.vue(x0, y0, N)

    # ---------------------------------------------------------- élévations
    def facade(self, cote):
        """Liste des ouvertures vues de l'extérieur, coordonnée horizontale de gauche à droite."""
        W, D = self.W, self.D
        res = []
        for o in self.fenetres + self.portes:
            ax, at = o["axe"], o["at"]
            if cote == "S" and ax == "h" and abs(at - self.S) < 1: a = o["s"]
            elif cote == "N" and ax == "h" and abs(at - self.N_) < 1: a = W - o["s"] - o["w"]
            elif cote == "E" and ax == "v" and abs(at - self.E) < 1: a = o["s"]
            elif cote == "O" and ax == "v" and abs(at - self.O) < 1: a = D - o["s"] - o["w"]
            else: continue
            res.append((a, o))
        return res

    def feuille_elevations(self, c):
        Ne = self.Nelev
        f = Feuille(c, self.dossier, "A-201", "ÉLÉVATIONS", f"1:{Ne}")
        cells = [("S", "ÉLÉVATION SUD (PRINCIPALE)", 1), ("N", "ÉLÉVATION NORD", 2), ("E", "ÉLÉVATION EST", 3), ("O", "ÉLÉVATION OUEST", 4)]
        cw, ch = (DRAW[2] - DRAW[0]) / 2, (DRAW[3] - DRAW[1]) / 2
        long_ = self.W / Ne > cw - 40          # bâtiment très long : sud et nord sur toute la largeur, est et ouest côte à côte en bas
        if long_: ch = (DRAW[3] - DRAW[1]) / 3
        for i, (cote, nom, n) in enumerate(cells):
            if long_:
                cx0 = DRAW[0] + (0 if i < 2 else (i - 2) * cw); cy0 = DRAW[3] - (min(i, 2) + 1) * ch
            else:
                cx0 = DRAW[0] + (i % 2) * cw; cy0 = DRAW[3] - (i // 2 + 1) * ch
            L = self.W if cote in "SN" else self.D
            f.vue(cx0 + getattr(self, "elev_dx", 14), cy0 + 26, Ne)
            self._elevation(f, cote, L)
            f.titre_vue(cx0 + 6, cy0 + 8, n, nom, f"1:{Ne}")
        f.notes("NOTES D'ÉLÉVATION", self.notes_elev)
        f.notes("NIVEAUX", [f"{nom} : {val}" for (nom, val, _) in self.niveaux])
        c.showPage()

    def _elevation(self, f, cote, L):
        z0, zp, zm = self.z_sol, self.z_plancher, self.z_murs
        f.ligne(-1200, z0, L + 300, z0, 1.4)
        f.hachures(-1200, z0 - 350, L + 300, z0, 120, 45, GRIS_C)
        # fondation apparente
        f.rect(0, z0, L, zp, .5, fill=HexColor("#e0e0e0"))
        # mur
        f.rect(0, zp, L, zm, .8, fill=white)
        if self.revetement == "horizontal":
            y = zp + 150
            while y < zm: f.ligne(0, y, L, y, .15, GRIS_C); y += 150
        elif self.revetement == "brique":
            y = zp + 75; r = 0
            while y < zm:
                f.ligne(0, y, L, y, .12, GRIS_C)
                x = (r % 2) * 115
                while x < L: f.ligne(x, y - 75, x, y, .1, GRIS_C); x += 230
                y += 75; r += 1
        # toit
        ov = self.debord
        if self.toit == "pignon":
            pente = self.pente
            if cote in "SN":   # long pan
                zf = zm + self.D / 2 * pente; rk = 300
                f.poly([(-rk, zm - ov * pente), (L + rk, zm - ov * pente), (L + rk, zf), (-rk, zf)], .9, close=True, fill=HexColor("#cfcfcf"))
                for k in range(1, 12):
                    zz = zm - ov * pente + (zf - zm + ov * pente) * k / 12; f.ligne(-rk, zz, L + rk, zz, .15, GRIS)
                f.ligne(-ov, zm - ov * pente, L + ov, zm - ov * pente, 1.0)
            else:              # pignon
                zf = zm + L / 2 * pente
                f.poly([(-ov, zm - ov * pente), (L / 2, zf + 120), (L + ov, zm - ov * pente)], .9)
                f.poly([(0, zm), (L / 2, zm + L / 2 * pente), (L, zm)], .5, close=True, fill=white)
                if self.revetement == "horizontal":
                    y = zm + 150
                    while y < zm + L / 2 * pente:
                        hw = (zm + L / 2 * pente - y) / pente; f.ligne(L / 2 - hw, y, L / 2 + hw, y, .15, GRIS_C); y += 150
                f.rect(L / 2 - 250, zm + L / 4 * pente - 200, L / 2 + 250, zm + L / 4 * pente + 200, .5, fill=white)
                f.texte(L / 2, zm + L / 4 * pente - 450, "évent", 5, col=GRIS)
            self.z_faite = zf
        else:                  # toit plat avec parapet
            zpar = zm + self.parapet
            f.rect(0, zm, L, zpar, .8, fill=HexColor("#d8d8d8")); f.ligne(-60, zpar, L + 60, zpar, 1.2)
            self.z_faite = zpar
            if getattr(self, "unite_toit", None) and cote in "SN":
                ux = L * 0.55; f.rect(ux, zpar - 0, ux + 2200, zpar + 1300, .6, fill=white, dash=[3, 2]); f.texte(ux + 1100, zpar + 650, "UNITÉ DE TOIT\n(en retrait)", 5)
        # ouvertures
        for (a, o) in self.facade(cote):
            typ = o.get("type") or o.get("tp")
            if o in self.portes:
                h = o.get("h", 2030); g = o.get("genre", "battante")
                f.rect(a, zp, a + o["w"], zp + h, .7, fill=white)
                if g == "double": f.ligne(a + o["w"] / 2, zp, a + o["w"] / 2, zp + h, .5)
                elif g == "coulissante": f.ligne(a + o["w"] / 2, zp, a + o["w"] / 2, zp + h, .5); f.rect(a + 80, zp + 80, a + o["w"] - 80, zp + h - 80, .3)
                elif g == "garage":
                    for k in range(1, 4): f.ligne(a, zp + h * k / 4, a + o["w"], zp + h * k / 4, .3)
                else:
                    f.rect(a + 120, zp + h * .55, a + o["w"] - 120, zp + h - 150, .3); f.cercle(a + o["w"] - 120, zp + 1000, 40, .4)
                if zp - z0 > 200 and o.get("ext", True):
                    n = max(1, round((zp - z0) / 180))
                    for k in range(n):
                        zz = z0 + k * (zp - z0) / n
                        f.rect(a - 300, zz, a + o["w"] + 300, zz + (zp - z0) / n, .4, fill=white)
            else:
                ft = self.types_fen[o["type"]]
                al, h = ft["allege"], ft["h"]
                f.rect(a, zp + al, a + o["w"], zp + al + h, .7, fill=white)
                f.rect(a + 60, zp + al + 60, a + o["w"] - 60, zp + al + h - 60, .3)
                if ft["ouv"].startswith("Coulissante"): f.ligne(a + o["w"] / 2, zp + al + 60, a + o["w"] / 2, zp + al + h - 60, .3)
                elif ft["ouv"].startswith("Battant") or ft["ouv"].startswith("Auvent"):
                    if ft["ouv"].startswith("Auvent"): f.poly([(a + 60, zp + al + 60), (a + o["w"] / 2, zp + al + h - 60), (a + o["w"] - 60, zp + al + 60)], .25, dash=[3, 2])
                    else: f.poly([(a + o["w"] - 60, zp + al + 60), (a + 60, zp + al + h / 2), (a + o["w"] - 60, zp + al + h - 60)], .25, dash=[3, 2])
                self._hexa(f, a + o["w"] / 2, zp + al - 420 * f.N / 100, o["type"])
        # cotes de niveaux à droite
        k = f.N / 100; dernier = -1e9
        for (nom, val, z) in sorted(self.niveaux, key=lambda n: n[2] if n[2] != "faite" else 1e9):
            zz = z if z != "faite" else self.z_faite
            f.ligne(L + 350, zz, L + 1000 * k, zz, .3, dash=[4, 2])
            zt = max(zz, dernier + 2.8 * f.N); dernier = zt
            f.texte(L + 1100 * k, zt, f"{nom} {val}", 5.5, True, "g")
        # matériaux
        for (txt, x_rel, z, dx, dz) in self.etiq_elev.get(cote, []):
            x = L * x_rel
            f.ligne(x, z, x + dx, z + dz, .3); f.texte(x + dx + (100 if dx >= 0 else -100), z + dz, txt, 5.5, False, "g" if dx >= 0 else "d")

    # ---------------------------------------------------------- coupe + nomenclatures
    def feuille_coupe(self, c):
        f = Feuille(c, self.dossier, "A-301", "COUPE TRANSVERSALE\nET NOMENCLATURES", f"1:{self.Ncoupe}")
        Nc = self.Ncoupe
        f.vue(DRAW[0] + 48, DRAW[1] + self.coupe_y, Nc)
        self._coupe(f)
        f.titre_vue(DRAW[0] + self.coupe_titre_x, DRAW[1] + 100, "A", "COUPE A — TRANSVERSALE", f"1:{Nc}")
        # nomenclatures
        yb = DRAW[1] + 92
        lignes = []
        for o in self.portes:
            lignes.append([o["no"], f"{fmt(o['w'])} × {fmt(o.get('h', 2030))}", o.get("genre", "battante").capitalize(), o.get("mat", "Âme creuse, MDF peint"), o.get("quinc", "Passage")])
        hp = min(4.6, (yb - DRAW[1] - 6) / (len(lignes) + 2))      # beaucoup de portes : rangées plus serrées pour rester dans le cadre
        y = f.tableau(DRAW[0] + 4, yb, "NOMENCLATURE DES PORTES", ["No", "Dimensions (mm)", "Type", "Matériau", "Quincaillerie"], lignes, [12, 32, 26, 62, 46], h=hp, size=min(6.6, hp * 1.4))
        lignes = []
        for k, ft in self.types_fen.items():
            nb = sum(1 for o in self.fenetres if o["type"] == k)
            larg = sorted({o["w"] for o in self.fenetres if o["type"] == k})
            lignes.append([k, nb, (" / ".join(fmt(w) for w in larg) if len(larg) <= 3 else "Variable (voir A-201)") + f" × {fmt(ft['h'])}", fmt(ft["allege"]), ft["ouv"], ft.get("verre", "Double, faible émissivité, argon")])
        f.tableau(DRAW[0] + 186, yb, "NOMENCLATURE DES FENÊTRES", ["Type", "Qté", "Larg. × haut. (mm)", "Allège", "Ouverture", "Vitrage"], lignes, [12, 10, 36, 14, 30, 44])
        f.notes("COMPOSITIONS", self.compositions)
        c.showPage()

    def _coupe(self, f):
        D = self.D; t = self.t
        z0, zp, zm = self.z_sol, self.z_plancher, self.z_murs
        zfond = self.z_semelle
        # terrain
        f.ligne(-1600, z0, 0, z0, 1.2); f.ligne(D, z0, D + 1600, z0, 1.2)
        f.hachures(-1600, zfond - 600, 0, z0, 150, 45, GRIS_C); f.hachures(D, zfond - 600, D + 1600, z0, 150, 45, GRIS_C)
        # semelles et murs de fondation
        for x in (0, D - self.t_fond):
            f.rect(x - 200, zfond, x + self.t_fond + 200, zfond + 250, .8, fill=HexColor("#bdbdbd"))
            f.rect(x, zfond + 250, x + self.t_fond, zp - self.ep_plancher, .8, fill=HexColor("#bdbdbd"))
            f.hachures(x, zfond + 250, x + self.t_fond, zp - self.ep_plancher, 120, 45, GRIS)
            # drain français
            dx = x - 350 if x == 0 else x + self.t_fond + 350
            f.cercle(dx, zfond + 200, 60, .6)
        f.texte(-1200, zfond + 200, "Drain\nØ 100", 5.5, False, "d")
        # plancher / dalle
        if self.type_plancher == "solives":
            f.rect(self.t_fond, zp - self.ep_plancher, D - self.t_fond, zp, .6, fill=white)
            n = int(D / 400)
            for i in range(1, n):
                x = i * D / n; f.ligne(x, zp - self.ep_plancher, x, zp, .2, GRIS_C)
            f.texte(D * 0.27, (zp - self.ep_plancher + zfond + 250) / 2, "VIDE SANITAIRE", 6, True, col=GRIS)
            f.rect(0, zp - self.ep_plancher, self.t_fond, zp, .6, fill=HexColor("#d0d0d0")); f.rect(D - self.t_fond, zp - self.ep_plancher, D, zp, .6, fill=HexColor("#d0d0d0"))
            f.rect(self.t_fond, zfond + 250, D - self.t_fond, zfond + 330, .4, fill=HexColor("#e6e6e6"))
            if getattr(self, "poutre_coupe", None):
                x = self.poutre_coupe
                f.rect(x - 90, zp - self.ep_plancher - 240, x + 90, zp - self.ep_plancher, .6, fill=HexColor("#9a9a9a"))
                f.rect(x - 45, zfond + 250, x + 45, zp - self.ep_plancher - 240, .6, fill=white)
                f.rect(x - 300, zfond, x + 300, zfond + 250, .6, fill=HexColor("#bdbdbd"))
        else:
            f.rect(self.t_fond, zp - 100, D - self.t_fond, zp, .6, fill=HexColor("#cfcfcf"))
            f.rect(self.t_fond, zp - 300, D - self.t_fond, zp - 100, .3, fill=HexColor("#f0f0f0"))
            f.hachures(self.t_fond, zp - 300, D - self.t_fond, zp - 100, 80, 30, GRIS_C)
        # murs
        for x in (0, D - t):
            f.rect(x, zp, x + t, zm, .8, fill=GRIS)
        for (x, e, *zt) in getattr(self, "murs_coupe", []):
            f.rect(x - e / 2, zp, x + e / 2, zt[0] if zt else self.z_plafond, .6, fill=GRIS_TC)
        # plafond
        f.ligne(t, self.z_plafond, D - t, self.z_plafond, .8)
        # toit
        ov = self.debord
        if self.toit == "pignon":
            p = self.pente; zf = zm + D / 2 * p
            f.poly([(-ov, zm - ov * p), (D / 2, zf + 250), (D + ov, zm - ov * p)], 1.2)
            f.poly([(0, zm), (D / 2, zf), (D, zm)], .6, close=True)
            f.ligne(D / 2, zm, D / 2, zf, .35)
            for xq in (D / 4, 3 * D / 4):
                f.ligne(xq, zm, xq, zm + D / 4 * p, .35); f.ligne(D / 2, zm, xq, zm + D / 4 * p, .35)
            # isolant
            xs = t; up = True
            while xs < D - t - 200:
                f.ligne(xs, zm + (20 if up else 380), xs + 200, zm + (380 if up else 20), .25, GRIS); xs += 200; up = not up
            f.texte(D / 2, zm + 1100, "COMBLES VENTILÉS", 6, True, col=GRIS)
        else:
            f.rect(0, zm, D, zm + 450, .6, fill=white)
            n = int(D / 600)
            for i in range(1, n): f.ligne(i * D / n, zm, i * D / n, zm + 450, .2, GRIS_C)
            f.rect(-80, zm + 450, D + 80, zm + 600, .6, fill=HexColor("#cfcfcf"))
            f.rect(0, zm + 600, t, zm + self.parapet, .6, fill=GRIS); f.rect(D - t, zm + 600, D, zm + self.parapet, .6, fill=GRIS)
        # étiquettes de composition
        for (txt, x, z, dx, dz) in self.etiq_coupe:
            f.ligne(x, z, x + dx, z + dz, .3); f.cercle(x, z, 45, .3, fill=black)
            f.texte(x + dx + (80 if dx >= 0 else -80), z + dz, txt, 5.6, False, "g" if dx >= 0 else "d")
        # niveaux
        dernier = -1e9
        for (nom, val, z) in sorted(self.niveaux, key=lambda n: n[2] if n[2] != "faite" else 1e9):
            zz = z if z != "faite" else (zm + D / 2 * self.pente if self.toit == "pignon" else zm + self.parapet)
            zt = max(zz, dernier + 2.8 * f.N); dernier = zt
            f.ligne(D + 700, zz, D + 2600, zz, .3, dash=[4, 2]); f.texte(D + 2700, zt + 100, f"{nom} {val}", 5.6, False, "g")
        f.cote(0, D, zfond - 450)

    # =============================================================== STRUCTURE
    def feuille_fondations(self, c):
        Nf = getattr(self, "Nfond", 75)
        f = Feuille(c, self.dossier, "S-101", "PLAN DES FONDATIONS\nET DÉTAIL TYPE", f"1:{Nf} et 1:20")
        W, D, tf = self.W, self.D, self.t_fond
        f.vue(DRAW[0] + getattr(self, "fond_gauche", 38), DRAW[3] - getattr(self, "fond_haut", 32) - D / Nf, Nf)
        if getattr(self, "grille_xy", None): f.grille(*self.grille_xy, 0, W, 0, D, ext=getattr(self, "grille_ext_fond", 1600))
        # murs de fondation
        f.rect(0, 0, W, D, 1.0, fill=HexColor("#bdbdbd")); f.rect(tf, tf, W - tf, D - tf, .8, fill=white)
        # semelle continue (cachée)
        f.rect(-200, -200, W + 200, D + 200, .5, dash=[4, 2]); f.rect(tf + 200, tf + 200, W - tf - 200, D - tf - 200, .5, dash=[4, 2])
        f.hachures(0, 0, W, tf, 160, 45, GRIS); f.hachures(0, D - tf, W, D, 160, 45, GRIS); f.hachures(0, 0, tf, D, 160, 45, GRIS); f.hachures(W - tf, 0, W, D, 160, 45, GRIS)
        for (x1, y1, x2, y2) in getattr(self, "fond_int", []):   # murs ou semelles intérieurs
            if y1 == y2:
                f.rect(x1, y1 - tf / 2, x2, y1 + tf / 2, .8, fill=HexColor("#bdbdbd")); f.rect(x1, y1 - tf / 2 - 200, x2, y1 + tf / 2 + 200, .4, dash=[4, 2])
            else:
                f.rect(x1 - tf / 2, y1, x1 + tf / 2, y2, .8, fill=HexColor("#bdbdbd")); f.rect(x1 - tf / 2 - 200, y1, x1 + tf / 2 + 200, y2, .4, dash=[4, 2])
        # poutre et poteaux
        for (x1, y1, x2, y2, lab) in getattr(self, "poutres", []):
            f.ligne(x1, y1, x2, y2, 1.6, black, dash=[10, 3, 2, 3]); f.texte((x1 + x2) / 2, y1 + 350 * f.N / 50, lab, 6, True)
        for (x, y, sz, lab) in getattr(self, "poteaux", []):
            f.rect(x - sz / 2, y - sz / 2, x + sz / 2, y + sz / 2, .4, dash=[3, 2])
            f.rect(x - 60, y - 60, x + 60, y + 60, .6, fill=black)
        if getattr(self, "poteaux", None):
            x, y, sz, lab = self.poteaux[0]; f.ligne(x + 80, y + 80, x + 1300, y + 1300 * f.N / 50, .3); f.texte(x + 1400, y + 1300 * f.N / 50, lab, 5.8, False, "g")
        # cotes
        f.cote(0, W, -1400 * f.N / 50); f.cote(0, D, -1400 * f.N / 50, orient="v")
        xs = sorted({0, W} | {p[0] for p in getattr(self, "poteaux", [])} | set(getattr(self, "axes_fond", [])))
        if len(xs) > 2: f.chaine(xs, D + 1200 * f.N / 50, "h", total=False)
        for (a_, b_, dec, ori) in getattr(self, "cotes_fond", []): f.cote(a_, b_, dec, orient=ori)
        for (txt, x, y) in getattr(self, "etiq_fond", []): f.texte(x, y, txt, 6, True)
        f.titre_vue(DRAW[0] + 4, DRAW[1] + 6, 1, "PLAN DES FONDATIONS", f"1:{Nf}")
        # détail type (petite coupe de semelle)
        f.vue(DRAW[0] + 252, DRAW[1] + 34, 20)
        self._detail_semelle(f)
        f.titre_vue(DRAW[0] + 196, DRAW[1] + 6, 2, "DÉTAIL TYPE — SEMELLE ET MUR", "1:20")
        f.notes("NOTES DE STRUCTURE", self.notes_struct)
        f.notes("LÉGENDE", ["Poché hachuré : mur de fondation en béton coulé", "Tirets : semelle (sous le niveau du plancher)",
                            "Carré plein : poteau · carré en tirets : semelle isolée", "— · — Poutre porteuse"])
        c.showPage()

    def _detail_semelle(self, f):
        tf = self.t_fond
        f.rect(-200, 0, tf + 200, 250, .8, fill=HexColor("#bdbdbd")); f.hachures(-200, 0, tf + 200, 250, 60, 45, GRIS)
        f.rect(0, 250, tf, 1650, .8, fill=HexColor("#bdbdbd")); f.hachures(0, 250, tf, 1650, 60, 45, GRIS)
        f.ligne(-900, 1350, 0, 1350, 1.0); f.hachures(-900, 0, -200, 1350, 80, -45, GRIS_C)
        f.cercle(-380, 330, 55, .7)
        f.rect(-600, 0, -200, 600, .3, dash=[2, 2])
        f.rect(tf, 1500, tf + 900, 1650, .6, fill=HexColor("#e3e3e3"))
        for (txt, x, y, dx, dy) in [("Mur de béton " + fmt(tf) + ", 25 MPa", tf / 2, 1100, 500, 0), ("Semelle " + fmt(tf + 400) + " × 250", tf + 100, 120, 450, -150),
                                    ("Drain français Ø 100 et pierre nette", -380, 330, -150, -400), ("Niveau du sol fini", -700, 1350, 0, 250),
                                    ("Dalle ou plancher", tf + 450, 1580, 300, 300)]:
            f.ligne(x, y, x + dx, y + dy, .3); f.texte(x + dx + (60 if dx >= 0 else -60), y + dy, txt, 5.5, False, "g" if dx >= 0 else "d")
        f.cote(-200, tf + 200, -250)

    # =============================================================== PLOMBERIE
    def reseaux(self):
        return self.plomb["reseaux"] if "reseaux" in self.plomb else [self.plomb]

    def _reseau_de(self, pt):
        best = None
        for pl in self.reseaux():
            q, _ = self._projeter(pt, pl["coll"]); d = abs(q[0] - pt[0]) + abs(q[1] - pt[1])
            if best is None or d < best[0]: best = (d, pl)
        return best[1]

    def _projeter(self, pt, poly):
        best = None
        for (a, b) in zip(poly, poly[1:]):
            if a[1] == b[1]:
                x = min(max(pt[0], min(a[0], b[0])), max(a[0], b[0])); q = (x, a[1])
            else:
                y = min(max(pt[1], min(a[1], b[1])), max(a[1], b[1])); q = (a[0], y)
            d = abs(q[0] - pt[0]) + abs(q[1] - pt[1])
            if best is None or d < best[0]: best = (d, q, (a, b))
        return best[1], best[2]

    def _chemin(self, p, q, seg):
        """Chemin orthogonal du point p au point q (sur seg)."""
        a, b = seg
        if a[1] == b[1]: return [p, (p[0], q[1])] if abs(p[0] - q[0]) < 1 else [p, (p[0], p[1]), (q[0], p[1]), q] if False else [p, (q[0], p[1]), q]
        return [p, (p[0], q[1]), q]

    def feuille_plomberie(self, c):
        f = Feuille(c, self.dossier, "P-101", "PLAN DE PLOMBERIE\nREZ-DE-CHAUSSÉE", f"1:{self.Nplan}")
        self._centrer(f, self.Nplan)
        self.plan_base(f, etiquettes=False, pale=True)
        self.pieces(f, aire=False, size=5.5, coin=True)
        nets = self.reseaux()
        for pl in nets:
            f.poly(pl["coll"], 2.6, DR, dash=[7, 3])
            for (x, y) in pl["chutes"]: f.cercle(x, y, 110, .8, fill=DR)
            f.poly(pl["sortie"], 2.6, DR, dash=[7, 3])
        self.appareils(f)
        for (code, x, y, rot) in self.app:
            o = self.sortie(code, x, y, rot)
            if o and code not in ("lv",):
                pl = self._reseau_de(o)
                q, seg = self._projeter(o, pl["coll"]); f.poly(self._chemin(o, q, seg), 1.6, DR, dash=[5, 2])
        for pl in nets:
            f.poly(pl["ef"], 1.5, EF); f.poly(pl["ec"], 1.5, EC)
            for pts in pl.get("ef_extra", []): f.poly(pts, 1.2, EF)
            for pts in pl.get("ec_extra", []): f.poly(pts, 1.2, EC)
        for (code, x, y, rot) in self.app:
            a = APP[code]; pl = self._reseau_de((x, y))
            sx, sy = rotp(-90, 60, rot); px, py = x + sx, y + sy
            if a[4] not in ("—",) and code != "ce":
                q, seg = self._projeter((px, py), pl["ef"]); f.poly(self._chemin((px, py), q, seg), 1.0, EF)
            sx, sy = rotp(90, 60, rot); px, py = x + sx, y + sy
            if a[5] not in ("—",) and code != "ce":
                q, seg = self._projeter((px, py), pl["ec"]); f.poly(self._chemin((px, py), q, seg), 1.0, EC)
        for pl in nets:
            mx, my = pl["compteur"]
            f.rect(mx - 180, my - 120, mx + 180, my + 120, .6, EF, fill=EF); f.texte(mx + 300 * pl.get("lab_sens", 1), my, "Entrée d'eau, robinet d'arrêt\net compteur", 5.6, True, "g" if pl.get("lab_sens", 1) > 0 else "d", EF)
        pl = self.plomb
        for (txt, x, y, col, al) in self.plomb.get("etiq", []):
            f.texte(x, y, txt, 5.8, True, al, col)
        f.nord(DRAW[2] - 16, DRAW[3] - 18)
        f.titre_vue(DRAW[0] + 4, DRAW[1] + 6, 1, "PLAN DE PLOMBERIE", f"1:{self.Nplan}")
        f.barre_echelle(DRAW[0] + 120, DRAW[1] + 6, self.Nplan)
        f.notes("NOTES DE PLOMBERIE", self.notes_plomb)
        y = f.zone_notes_haut
        c_ = f.c; x0 = 352
        c_.setFont(FONT_B, 8); c_.drawString(x0 * MM, y * MM, "LÉGENDE"); y -= 5
        for col, dash, w, txt in [(EF, None, 1.5, "Eau froide (EF)"), (EC, None, 1.5, "Eau chaude (EC)"), (DR, [5, 2], 2.2, "Drainage sanitaire"), (VE, [2, 2], 1.4, "Ventilation (évent)")]:
            c_.setStrokeColor(col); c_.setLineWidth(w); c_.setDash(dash) if dash else c_.setDash()
            c_.line(x0 * MM, (y + 1) * MM, (x0 + 12) * MM, (y + 1) * MM); c_.setDash(); c_.setStrokeColor(black)
            c_.setFont(FONT, 7); c_.drawString((x0 + 15) * MM, y * MM, txt); y -= 4.4
        c_.setFillColor(DR); c_.circle((x0 + 6) * MM, (y + 1) * MM, 1.4 * MM, fill=1); c_.setFillColor(black); c_.drawString((x0 + 15) * MM, y * MM, "Colonne de chute"); y -= 4.4
        f.zone_notes_haut = y
        c.showPage()

    def feuille_iso(self, c):
        f = Feuille(c, self.dossier, "P-102", "SCHÉMA ISOMÉTRIQUE ET\nNOMENCLATURE DES APPAREILS", "Sans échelle")
        pl = self.reseaux()[0]; ZF = 1.0; HT = self.plomb["h_plafond"] + 1000; hpl = self.plomb["h_plafond"]
        cs, sn = math.cos(math.radians(30)), math.sin(math.radians(30))
        iso = lambda x, y, z: ((x - y) * cs, (x + y) * sn + z * ZF)
        lignes, textes, marques = [], [], []
        def L_(pts, w, col, dash=None): lignes.append(([iso(*p) for p in pts], w, col, dash))
        def T_(x, y, z, t, col=black, al="c", dz=220): textes.append((iso(x, y, z + dz), t, col, al))
        coll = pl["coll"]
        L_([(x, y, 0) for (x, y) in coll], 3.2, DR)
        so = list(pl["sortie"]); n = len(so)
        if n >= 2:
            (ax_, ay_), (bx_, by_) = so[-2], so[-1]; lg = math.hypot(bx_ - ax_, by_ - ay_)
            if lg > 4000: so[-1] = (ax_ + (bx_ - ax_) * 4000 / lg, ay_ + (by_ - ay_) * 4000 / lg)
        L_([(x, y, -400 * i / max(1, n - 1)) for i, (x, y) in enumerate(so)], 3.6, DR)
        T_(*so[-1], -400, "Vers l'égout municipal (Ø 4\")", DR, "g", 0)
        mx, my = (so[0][0] + so[-1][0]) / 2, (so[0][1] + so[-1][1]) / 2
        marques.append(("losange", iso(mx, my, -200), "Clapet antiretour"))
        marques.append(("carre", iso(*coll[0], 0), "Regard de nettoyage"))
        for (x, y) in pl["chutes"]:
            L_([(x, y, 0), (x, y, hpl)], 3.2, DR)
            L_([(x, y, hpl), (x, y, HT)], 2.2, VE, [3, 2])
            T_(x, y, HT, "Évent de colonne Ø 3\" — sort au toit", VE)
            T_(x, y, hpl * 0.32, "   Colonne de chute Ø 3\"", DR, "g", 0)
        for k_, (code, x, y, rot) in enumerate(self.app):
            o = self.sortie(code, x, y, rot)
            if not o or code == "lv" or self._reseau_de(o) is not pl: continue
            q, seg = self._projeter(o, coll)
            ht = {"lav": 450, "evd": 450, "evs": 450, "lave": 800, "vid": 200, "uri": 500, "fon": 600}.get(code, 0)
            path = self._chemin(o, q, seg)
            L_([(p[0], p[1], 80) for p in path[::-1]], 2.0, DR)
            L_([(o[0], o[1], 80), (o[0], o[1], 80 + ht + 200)], 2.0, DR)
            if code not in ("wc", "dp"):
                L_([(o[0], o[1], 80 + ht + 200), (o[0], o[1], hpl * 0.8)], 1.2, VE, [2, 2])
            a = APP[code]
            marques.append(("siphon", iso(o[0], o[1], 80 + ht), ""))
            nom_ = code.upper() if getattr(self, "iso_court", False) else a[0].split(' (')[0]
            T_(o[0], o[1], 80 + ht + 200, f"{nom_} · {a[6]}", black, "c", 260 + (k_ % (3 if getattr(self, "iso_court", False) else 2)) * 380)
        pts = [p for (ps, *_r) in lignes for p in ps] + [t[0] for t in textes]
        x0_, x1_ = min(p[0] for p in pts), max(p[0] for p in pts); y0_, y1_ = min(p[1] for p in pts), max(p[1] for p in pts)
        aw, ah = (DRAW[2] - DRAW[0]) - 50, 145
        N = max((x1_ - x0_) / aw, (y1_ - y0_) / ah)
        f.vue(DRAW[0] + 30 + (aw - (x1_ - x0_) / N) / 2 - x0_ / N, DRAW[1] + 110 - y0_ / N, N)
        for (ps, w, col, dash) in lignes: f.poly(ps, w, col, dash)
        for (kind, (x, y), lab) in marques:
            r = 2.2 * N
            if kind == "losange": f.poly([(x, y + r), (x + r, y), (x, y - r), (x - r, y)], .8, DR, close=True, fill=white); f.texte(x + 1.5 * r, y - 1.6 * r, lab, 5.8, True, "g", DR)
            elif kind == "carre": f.rect(x - r, y - r, x + r, y + r, .8, DR, fill=white); f.texte(x - 1.6 * r, y + .2 * r, lab, 5.8, True, "d", DR)
            else: f.cercle(x, y, r * .7, .8, DR, fill=white)
        for ((x, y), t, col, al) in textes: f.texte(x, y, t, 5.8, True, al, col)
        f.titre_vue(DRAW[0] + 4, DRAW[1] + 96, 1, getattr(self, "titre_iso", "SCHÉMA ISOMÉTRIQUE — DRAINAGE ET VENTILATION"), "sans échelle")
        # nomenclature
        compte = {}
        for (code, *_r) in self.app: compte[code] = compte.get(code, 0) + 1
        lignes = []; tot = 0
        for code, q in compte.items():
            a = APP[code]; tot += a[8] * q
            lignes.append([code.upper(), a[0], q, a[4], a[5], a[6], a[7], str(a[8] * q).replace(".", ",")])
        lignes.append(["", "TOTAL DES UNITÉS (charge hydraulique)", "", "", "", "", "", str(tot).replace(".", ",")])
        f.tableau(DRAW[0] + 4, DRAW[1] + 84, "NOMENCLATURE DES APPAREILS SANITAIRES", ["Code", "Appareil", "Qté", "EF", "EC", "Drain", "Évent", "Unités"],
                  lignes, [16, 82, 12, 16, 16, 20, 18, 18])
        f.notes("À OBSERVER", ["Chaque appareil est protégé par un siphon, puis ventilé.", "Les branchements ont une pente d'au moins 1 : 50 (2 %).",
                               "Le diamètre du drain augmente à mesure qu'on approche de l'égout.", "La colonne se prolonge en évent jusqu'au-dessus du toit.",
                               "Les unités de charge sont indicatives : vérifier les valeurs du Code de plomberie en vigueur."])
        c.showPage()

    # =============================================================== ÉLECTRICITÉ
    def feuille_electricite(self, c):
        f = Feuille(c, self.dossier, "E-101", "PLAN D'ÉLECTRICITÉ", f"1:{self.Nplan}")
        self._centrer(f, self.Nplan)
        self.plan_base(f, etiquettes=False, pale=True)
        self.appareils(f, GRIS_C)
        self.pieces(f, aire=False, size=5.5, coin=True)
        circuits = []
        k = f.N / 50
        no_circ = 1
        for (no, nom, x0, y0, x1, y1) in self.locaux:
            if nom.lower() in self.sans_elec: continue
            # prises le long des murs, max 3 600 entre deux prises
            prises = []
            for (ax, a0, a1, fixe, nrm) in (("h", x0, x1, y0, 1), ("h", x0, x1, y1, -1), ("v", y0, y1, x0, 1), ("v", y0, y1, x1, -1)):
                L = a1 - a0
                if L < 900: continue
                n = max(1, math.ceil((L - 600) / 3000))
                for i in range(n):
                    a = a0 + 600 + i * (L - 1200) / max(1, n - 1) if n > 1 else a0 + L / 2
                    if self._sur_porte(ax, fixe, a): a += 700
                    if self._sur_porte(ax, fixe, a) or not self._mur_sur(ax, fixe, a): continue
                    prises.append((ax, fixe, a, nrm))
            if self.dense_prises.get(nom.lower()) is False: prises = prises[:2]
            for (ax, fixe, a, nrm) in prises:
                if ax == "h": self._prise(f, a, fixe, 0 if nrm > 0 else 180, ELEC)
                else: self._prise(f, fixe, a, 90 if nrm < 0 else 270, ELEC)
            # luminaire(s)
            lx, ly = getattr(self, "lum_pos", {}).get(no, ((x0 + x1) / 2, (y0 + y1) / 2))
            nb = 2 if (x1 - x0) * (y1 - y0) > 20e6 else 1
            lums = [(lx, ly)] if nb == 1 else ([(x0 + (x1 - x0) / 3, ly), (x0 + 2 * (x1 - x0) / 3, ly)] if x1 - x0 > y1 - y0 else [(lx, y0 + (y1 - y0) / 3), (lx, y0 + 2 * (y1 - y0) / 3)])
            pas = getattr(self, "lum_grille", None)
            if pas and (x1 - x0) * (y1 - y0) > 20e6:
                nx_, ny_ = max(1, round((x1 - x0) / pas)), max(1, round((y1 - y0) / pas))
                lums = [(x0 + (x1 - x0) * (i + .5) / nx_, y0 + (y1 - y0) * (j + .5) / ny_) for j in range(ny_) for i in range(nx_)]
            for (a, b) in lums:
                self._lum(f, a, b)
            # interrupteur près de la porte
            sw = self._inter_pos(x0, y0, x1, y1)
            if sw:
                f.texte(sw[0], sw[1], "S", 6.5, True, col=ELEC)
                f.c.setStrokeColor(ELEC); f.c.setLineWidth(.4); f.c.setDash(2, 2)
                p1 = f.P(sw[0], sw[1] + 120 * k); p2 = f.P(*lums[0])
                p = f.c.beginPath(); p.moveTo(*p1); p.curveTo(p1[0], (p1[1] + p2[1]) / 2, (p1[0] + p2[0]) / 2, p2[1], *p2); f.c.drawPath(p); f.c.setDash(); f.c.setStrokeColor(black)
            if nom.lower() in self.detecteurs:
                ddx, ddy = min(900 * k, (x1 - x0) * .3), min(700 * k, (y1 - y0) * .3)
                f.cercle(lx + ddx, ly - ddy, 170 * k, .6, ELEC, fill=white); f.texte(lx + ddx, ly - ddy, "DF", 4.8, True, col=ELEC)
            circuits.append((no_circ, f"Prises et éclairage — {nom}".replace("\n", " "), "15 A", "1 × 15 A")); no_circ += 1
        # panneau
        pans = getattr(self, "panneaux", None) or [(*self.panneau, self.panneau_txt, getattr(self, "panneau_lab", None))]
        for (px, py, prot, ptxt, plab) in pans:
            T = lambda a, b: tuple(v + o for v, o in zip(rotp(a, b, prot), (px, py)))
            f.poly([T(-450, 0), T(450, 0), T(450, 180), T(-450, 180)], .8, ELEC, close=True, fill=ELEC)
            f.texte(*(plab or T(0, 650)), ptxt, 5.6, True, col=ELEC)
        for sp in self.prises_speciales:
            txt, pt, puiss = sp[:3]; dy = sp[3] if len(sp) > 3 else 330
            x, y = pt
            f.cercle(x, y, 170 * k, .8, ELEC, fill=white); f.ligne(x - 170 * k, y, x + 170 * k, y, .6, ELEC); (f.texte(x, y + dy * k, txt, 5.2, True, col=ELEC) if dy is not None else None)
            circuits.append((no_circ, txt, puiss, (("3 × " if "3 ph" in puiss else "2 × ") + puiss.split()[0] + " A") if any(v in puiss for v in ("240", "208", "600")) else "1 × " + puiss.split()[0] + " A")); no_circ += 1
        f.nord(DRAW[2] - 16, DRAW[3] - 18)
        f.titre_vue(DRAW[0] + 4, DRAW[1] + 6, 1, "PLAN D'ÉLECTRICITÉ", f"1:{self.Nplan}")
        f.notes("NOTES D'ÉLECTRICITÉ", self.notes_elec)
        y = f.zone_notes_haut; c_ = f.c; x0 = 352
        c_.setFont(FONT_B, 8); c_.drawString(x0 * MM, y * MM, "LÉGENDE"); y -= 5
        for sym, txt in [("prise", "Prise de courant double 15 A"), ("lum", "Luminaire au plafond"), ("S", "Interrupteur unipolaire"),
                         ("DF", "Avertisseur de fumée relié"), ("spec", "Prise 240 V ou appareil dédié"), ("pan", "Panneau de distribution")]:
            X, Y = (x0 + 5) * MM, (y + 1) * MM; c_.setStrokeColor(ELEC); c_.setFillColor(ELEC); c_.setLineWidth(.7)
            if sym == "prise": c_.circle(X, Y, 1.4 * MM); c_.line(X - 2.2 * MM, Y - .5 * MM, X - 2.2 * MM, Y + .5 * MM)
            elif sym == "lum": c_.circle(X, Y, 1.8 * MM); c_.line(X - 1.3 * MM, Y - 1.3 * MM, X + 1.3 * MM, Y + 1.3 * MM); c_.line(X - 1.3 * MM, Y + 1.3 * MM, X + 1.3 * MM, Y - 1.3 * MM)
            elif sym == "S": c_.setFont(FONT_B, 8); c_.drawCentredString(X, Y - 1 * MM, "S")
            elif sym == "DF": c_.circle(X, Y, 1.8 * MM); c_.setFont(FONT_B, 5); c_.drawCentredString(X, Y - .7 * MM, "DF")
            elif sym == "spec": c_.circle(X, Y, 1.8 * MM); c_.line(X - 1.8 * MM, Y, X + 1.8 * MM, Y)
            elif sym == "pan": c_.rect(X - 3 * MM, Y - .8 * MM, 6 * MM, 1.6 * MM, fill=1)
            c_.setFillColor(black); c_.setStrokeColor(black); c_.setFont(FONT, 7); c_.drawString((x0 + 12) * MM, y * MM, txt); y -= 4.6
        f.zone_notes_haut = y - 2
        # tableau des circuits (abrégé)
        rows = [[str(n_), t_[:34], a_, b_] for (n_, t_, a_, b_) in circuits[:18]]
        f.c.showPage() if False else None
        self._circuits = rows
        f.tableau(352, f.zone_notes_haut - 2, "CIRCUITS (EXTRAIT)", ["No", "Usage", "Charge", "Disj."], rows[:min(len(rows), int((f.zone_notes_haut - 80) / 4.0))], [6, 37, 15, 13], h=4.0, size=5.5)
        c.showPage()

    def _mur_sur(self, ax, fixe, a):
        t = self.t
        if ax == "h" and (abs(fixe - t) < 90 or abs(fixe - (self.D - t)) < 90): return True
        if ax == "v" and (abs(fixe - t) < 90 or abs(fixe - (self.W - t)) < 90): return True
        for (x1, y1, x2, y2, e) in self.murs_int:
            if ax == "h" and y1 == y2 and abs(y1 - fixe) <= e / 2 + 90 and min(x1, x2) - 50 <= a <= max(x1, x2) + 50: return True
            if ax == "v" and x1 == x2 and abs(x1 - fixe) <= e / 2 + 90 and min(y1, y2) - 50 <= a <= max(y1, y2) + 50: return True
        return False

    def _sur_porte(self, ax, fixe, a):
        for o in self.portes:
            e = self._epaisseur(o["axe"], o["at"])
            if o["axe"] == ax and abs(o["at"] - fixe) < e / 2 + 120 and o["s"] - 300 < a < o["s"] + o["w"] + 300: return True
        return False

    def _prise(self, f, x, y, rot, col):
        k = f.N / 50
        T = lambda a, b: tuple(v + o for v, o in zip(rotp(a, b, rot), (x, y)))
        f.cercle(*T(0, 170 * k), 110 * k, .6, col, fill=white)
        f.ligne(*T(-60 * k, 40 * k), *T(-60 * k, 300 * k), .5, col); f.ligne(*T(60 * k, 40 * k), *T(60 * k, 300 * k), .5, col)

    def _lum(self, f, x, y):
        k = f.N / 50; r = 220 * k
        f.cercle(x, y, r, .7, ELEC, fill=white); f.ligne(x - r * .7, y - r * .7, x + r * .7, y + r * .7, .5, ELEC); f.ligne(x - r * .7, y + r * .7, x + r * .7, y - r * .7, .5, ELEC)

    def _inter_pos(self, x0, y0, x1, y1):
        for o in self.portes:
            ax, at, s, w = o["axe"], o["at"], o["s"], o["w"]
            e = self._epaisseur(ax, at)
            if ax == "h" and (abs(at - y0) < e or abs(at - y1) < e) and x0 - 50 <= s <= x1:
                inside = 1 if abs(at - y0) < e else -1
                xl = s + w + 250 if o.get("pivot", "a") == "a" else s - 250
                if not (x0 + 100 < xl < x1 - 100): xl = s - 250 if xl > s else s + w + 250
                return (xl, at + inside * (e / 2 + 250))
            if ax == "v" and (abs(at - x0) < e or abs(at - x1) < e) and y0 - 50 <= s <= y1:
                inside = 1 if abs(at - x0) < e else -1
                yl = s + w + 250 if o.get("pivot", "a") == "a" else s - 250
                if not (y0 + 100 < yl < y1 - 100): yl = s - 250 if yl > s else s + w + 250
                return (at + inside * (e / 2 + 250), yl)
        return None

    # =============================================================== CVCA
    def feuille_cvca(self, c):
        f = Feuille(c, self.dossier, "M-101", "PLAN DE CHAUFFAGE,\nVENTILATION ET CLIMATISATION", f"1:{self.Nplan}")
        self._centrer(f, self.Nplan)
        self.plan_base(f, etiquettes=False, pale=True)
        self.appareils(f, GRIS_C)
        self.pieces(f, aire=False, size=5.5, coin=True)
        k = f.N / 50
        m = self.cvca
        if m["type"] in ("air", "toit"):
            for (pts, larg, lab, *pos) in m["gaines"]:
                for (a, b) in zip(pts, pts[1:]):
                    if a[1] == b[1]: f.rect(min(a[0], b[0]) - larg / 2 * (1 if a is pts[0] else 1) * 0, a[1] - larg / 2, max(a[0], b[0]), a[1] + larg / 2, .8, CVC_A, fill=HexColor("#e3f4f6"))
                    else: f.rect(a[0] - larg / 2, min(a[1], b[1]), a[0] + larg / 2, max(a[1], b[1]), .8, CVC_A, fill=HexColor("#e3f4f6"))
                if lab: f.texte(*(pos[0] if pos else (pts[0][0] + 250, pts[0][1] + larg / 2 + 260 * k)), lab, 5.6, True, "g", CVC_A)
            for (x, y, lab, src) in m["diffuseurs"]:
                if src:
                    q, seg = self._projeter((x, y), m["gaines"][0][0] if len(m["gaines"]) == 1 else [p for g in m["gaines"] for p in g[0]][:2])
                    best = None
                    for (pts, larg, *_r) in m["gaines"]:
                        qq, sg = self._projeter((x, y), pts); d = abs(qq[0] - x) + abs(qq[1] - y)
                        if best is None or d < best[0]: best = (d, qq, sg)
                    path = self._chemin((x, y), best[1], best[2])
                    f.poly(path, 1.3, CVC_A)
                s_ = 260 * k
                f.rect(x - s_, y - s_, x + s_, y + s_, .7, CVC_A, fill=white); f.ligne(x - s_, y - s_, x + s_, y + s_, .4, CVC_A); f.ligne(x - s_, y + s_, x + s_, y - s_, .4, CVC_A)
                f.texte(x, y + (s_ + 210 * k) * (1 if y < self.D / 2 else -1), lab, 5.2, True, col=CVC_A)
            for (x, y, lab) in m["retours"]:
                s_ = 300 * k
                f.rect(x - s_, y - s_ * .6, x + s_, y + s_ * .6, .8, CVC_R, fill=white)
                for i in (-1, 0, 1): f.ligne(x - s_ * .8, y + i * s_ * .3, x + s_ * .8, y + i * s_ * .3, .4, CVC_R)
                f.texte(x, y - s_ - 160 * k, lab, 5.2, True, col=CVC_R)
        if m["type"] == "plinthes":
            for (x0, y0, x1, y1, watts) in self._plinthes():
                f.rect(x0, y0, x1, y1, .7, ELEC, fill=HexColor("#fde9d8"))
                cx_, cy_ = (x0 + x1) / 2, (y0 + y1) / 2
                if y1 - y0 < 300: cy_ += 300 * k * (1 if cy_ < self.D / 2 else -1)
                else: cx_ += 650 * k * (1 if cx_ < self.W / 2 else -1)
                f.texte(cx_, cy_, f"{watts} W", 5.2, True, col=ELEC)
            for (x, y, lab) in m.get("thermostats", []):
                f.texte(x, y, "T", 6.5, True, col=ELEC)
        for (x0, y0, x1, y1, lab) in m.get("equipements", []):
            f.rect(x0, y0, x1, y1, 1.0, CVC_A, fill=white); f.texte((x0 + x1) / 2, (y0 + y1) / 2, lab, 5.4, True, col=CVC_A)
        for (pts, lab) in m.get("vrc", []):
            f.poly(pts, 1.0, VE, dash=[4, 2]); f.cercle(*pts[-1], 130 * k, .7, VE, fill=white)
            f.texte(pts[-1][0], pts[-1][1] + (300 * k if pts[-1][1] < self.D - 900 else -330 * k), lab, 5.2, True, "c", VE)
        for (pts, col, lab) in m.get("lignes", []):
            f.poly(pts, 1.0, col, dash=[1.5, 1.5]); f.texte(*pts[len(pts) // 2], lab, 5.2, True, "g", col)
        f.nord(DRAW[2] - 16, DRAW[3] - 18)
        f.titre_vue(DRAW[0] + 4, DRAW[1] + 6, 1, "PLAN DE CHAUFFAGE ET VENTILATION", f"1:{self.Nplan}")
        f.notes("NOTES CVCA", self.notes_cvca)
        y = f.zone_notes_haut; c_ = f.c; x0 = 352
        c_.setFont(FONT_B, 8); c_.drawString(x0 * MM, y * MM, "LÉGENDE"); y -= 5
        items = [(CVC_A, "Conduit d'alimentation"), (CVC_A, "Carré avec X : diffuseur d'alimentation (L/s)"), (CVC_R, "Rectangle ligné : grille de retour"), (VE, "Conduit d'évacuation (VRC)")]
        if m["type"] == "plinthes": items = [(ELEC, "Plinthe électrique (puissance en W)"), (ELEC, "T  Thermostat électronique"), (VE, "Conduit de ventilation (VRC)")]
        for col, txt in items:
            c_.setFillColor(col); c_.setFont(FONT, 7); c_.drawString(x0 * MM, y * MM, txt); y -= 4.4
        c_.setFillColor(black)
        f.zone_notes_haut = y
        c.showPage()

    def _plinthes(self):
        res = []
        for (no, nom, x0, y0, x1, y1) in self.locaux:
            if nom.lower() in self.sans_chauffage: continue
            aire = (x1 - x0) * (y1 - y0) / 1e6
            watts = max(500, int(round(aire * 100 / 250.0)) * 250)
            # sous une fenêtre de la pièce si possible
            best = None
            for o in self.fenetres:
                ax, at, s, w = o["axe"], o["at"], o["s"], o["w"]
                if ax == "h" and x0 <= s + w / 2 <= x1 and (abs(at - y0) < self.t or abs(at - y1) < self.t):
                    yy = y0 + 60 if abs(at - y0) < self.t else y1 - 160
                    best = (s + w / 2 - min(w, 1500) / 2, yy, s + w / 2 + min(w, 1500) / 2, yy + 100, watts); break
                if ax == "v" and y0 <= s + w / 2 <= y1 and (abs(at - x0) < self.t or abs(at - x1) < self.t):
                    xx = x0 + 60 if abs(at - x0) < self.t else x1 - 160
                    best = (xx, s + w / 2 - min(w, 1500) / 2, xx + 100, s + w / 2 + min(w, 1500) / 2, watts); break
            if best: res.append(best)
        return res + list(self.cvca.get("plinthes_extra", []))

    # =============================================================== DOSSIER COMPLET
    def produire(self, chemin):
        c = rl_canvas.Canvas(chemin, pagesize=(PAGE_W * MM, PAGE_H * MM), pageCompression=1)
        c.setTitle(f"{self.dossier['projet'].replace(chr(10), ' ')} — dossier de plans d'exercice")
        c.setAuthor("Pavillon de l'Avenir · plan pédagogique")
        self.feuille_garde(c)
        extra = [fn for (_, _, fn) in getattr(self, "feuilles_extra", [])]   # feuilles civiles (C-101…), après le plan de site
        for fn in (self.feuille_site, *extra, self.feuille_plan, self.feuille_elevations, self.feuille_coupe, self.feuille_coupes, self.feuille_fondations,
                   self.feuille_plomberie, self.feuille_iso, self.feuille_electricite, self.feuille_cvca):
            fn(c)
        c.save()

    def feuille_garde(self, c):
        f = Feuille(c, self.dossier, "000", "PAGE DE GARDE\nET LISTE DES FEUILLES", "—")
        c_ = f.c
        c_.setFont(FONT_B, 30); c_.drawString(24 * MM, 232 * MM, self.dossier["projet"].split("\n")[0])
        c_.drawImage(LOGO, (336 - 24 * LOGO_R) * MM, 228 * MM, 24 * LOGO_R * MM, 24 * MM)
        c_.setFont(FONT, 14)
        yy = 222
        for l in self.dossier["projet"].split("\n")[1:] + self.dossier["adresse"].split("\n"):
            c_.drawString(24 * MM, yy * MM, l); yy -= 7
        c_.setFont(FONT_B, 11); c_.drawString(24 * MM, (yy - 2) * MM, "Conçu par " + AUTEUR); yy -= 7
        c_.setFont(FONT, 10.5)
        yy -= 4
        for l in wrap(self.description, 95):
            c_.drawString(24 * MM, yy * MM, l); yy -= 5.2
        lignes = [["000", "Page de garde et liste des feuilles"], ["A-100", "Plan d'implantation et de site"], *[[n, t] for (n, t, _) in getattr(self, "feuilles_extra", [])], ["A-101", "Plan du rez-de-chaussée"],
                  ["A-201", "Élévations"], ["A-301", "Coupe transversale et nomenclatures"], ["A-302", "Coupe longitudinale, coupe de mur et matériaux"], ["S-101", "Plan des fondations et détail type"],
                  ["P-101", "Plan de plomberie"], ["P-102", "Schéma isométrique et nomenclature des appareils"],
                  ["E-101", "Plan d'électricité"], ["M-101", "Plan de chauffage, ventilation et climatisation"]]
        f.tableau(24, yy - 10, "LISTE DES FEUILLES", ["Feuille", "Titre"], lignes, [22, 110], h=6, size=8.5)
        f.tableau(178, yy - 10, "DONNÉES DU BÂTIMENT", ["Élément", "Valeur"], self.donnees, [58, 92], h=6, size=8.5)
        f.notes("UTILISATION EN CLASSE", ["Ce dossier sert à apprendre à lire des plans : repérer les feuilles, les échelles, les symboles, les cotes et les liens entre les disciplines.",
                                         "Les renvois (bulles de coupe, types de fenêtres, numéros de portes) relient les feuilles entre elles.",
                                         "Bâtiment fictif. Les valeurs sont plausibles mais non vérifiées pour la construction."])
        c.showPage()


def f_inverse(*a):
    return a


for _n in ("feuille_coupes", "_N_mur", "_z_haut_mur", "_coupe_longitudinale", "_coupe_mur", "_legende_materiaux"):
    setattr(Batiment, _n, getattr(_coupes, _n))
