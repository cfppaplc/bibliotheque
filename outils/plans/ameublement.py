# -*- coding: utf-8 -*-
"""Ameublement automatique des plans d'architecture : lits, canapés, tables, bureaux, gondoles, etc.
Placement par règles selon le nom du local, en évitant les portes (zone de battement), les murs, les comptoirs, l'escalier et les appareils."""
import math
from dessin import *

MEUB = HexColor("#7a7a7a")
FIN = .3


def _inter(a, b, m=0):
    m = m or 3
    return not (a[2] <= b[0] + m or b[2] <= a[0] + m or a[3] <= b[1] + m or b[3] <= a[1] + m)


def _zones_portes(b):
    z = []
    for o in b.portes:
        s, w, at = o["s"], o["w"], o["at"]; sens = o.get("sens", 1)
        if o.get("genre") == "coulissante":
            r = (s - 100, at - 600, s + w + 100, at + 600) if o["axe"] == "h" else (at - 600, s - 100, at + 600, s + w + 100)
        elif o["axe"] == "h":
            y1, y2 = (at, at + sens * (w + 100)) if sens > 0 else (at + sens * (w + 100), at)
            r = (s - 100, min(y1, y2) - 50, s + w + 100, max(y1, y2) + 50)
        else:
            x1, x2 = (at, at + sens * (w + 100)) if sens > 0 else (at + sens * (w + 100), at)
            r = (min(x1, x2) - 50, s - 100, max(x1, x2) + 50, s + w + 100)
        z.append(r)
    return z


def _obstacles(b):
    occ = []
    for (x1, y1, x2, y2, e) in b.murs_int:
        occ.append((min(x1, x2) - e / 2, min(y1, y2) - e / 2, max(x1, x2) + e / 2, max(y1, y2) + e / 2))
    for (x0, y0, x1, y1, lab) in getattr(b, "comptoirs", []): occ.append((x0 - 30, y0 - 30, x1 + 30, y1 + 30))
    for (x0, y0, x1, y1, *_r) in getattr(b, "escaliers", []): occ.append((x0 - 100, y0 - 100, x1 + 100, y1 + 600))
    for (x0, y0, x1, y1) in getattr(b, "tremies", []): occ.append((x0 - 100, y0 - 100, x1 + 100, y1 + 300))
    for (code, x, y, rot) in getattr(b, "app", []):
        occ.append((x - 800, y - 800, x + 800, y + 800))
    return occ


def _mur_fenetres(b, r, mur):
    """Largeur de fenêtres basses (allège < 700) le long du mur 'S','N','O','E' du local r."""
    x0, y0, x1, y1 = r; tot = 0
    for o in b.fenetres:
        if b.types_fen[o["type"]]["allege"] > 700: continue
        if mur in "SN" and o["axe"] == "h" and (abs(o["at"] - (y0 if mur == "S" else y1)) < b.t + 200) and x0 - 200 <= o["s"] + o["w"] / 2 <= x1 + 200: tot += o["w"]
        if mur in "OE" and o["axe"] == "v" and (abs(o["at"] - (x0 if mur == "O" else x1)) < b.t + 200) and y0 - 200 <= o["s"] + o["w"] / 2 <= y1 + 200: tot += o["w"]
    return tot


def _mur_portes(b, r, mur):
    x0, y0, x1, y1 = r; tot = 0
    for o in b.portes:
        if mur in "SN" and o["axe"] == "h" and (abs(o["at"] - (y0 if mur == "S" else y1)) < b.t + 200) and x0 - 200 <= o["s"] + o["w"] / 2 <= x1 + 200: tot += o["w"]
        if mur in "OE" and o["axe"] == "v" and (abs(o["at"] - (x0 if mur == "O" else x1)) < b.t + 200) and y0 - 200 <= o["s"] + o["w"] / 2 <= y1 + 200: tot += o["w"]
    return tot


class Piece:
    def __init__(self, b, f, loc, occ, zones, deja):
        self.b, self.f = b, f
        self.no, self.nom, *r = loc; self.r = tuple(r)
        x0, y0, x1, y1 = self.r; cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        self.occ, self.zones, self.deja = occ + [(cx - min(1300, (x1 - x0) * .32), cy - 300, cx + min(1300, (x1 - x0) * .32), cy + 300)], zones, deja       # on laisse la place à l'étiquette du local

    # ------------------------------------------------------------ géométrie
    def libre(self, rect, marge=40):
        x0, y0, x1, y1 = self.r
        if rect[0] < x0 - 5 or rect[1] < y0 - 5 or rect[2] > x1 + 5 or rect[3] > y1 + 5: return False
        for o in self.occ + self.zones + self.deja:
            if _inter(rect, o): return False
        return True

    def contre(self, mur, w, d, decal=0, pos=.5):
        """Rectangle de w (le long du mur) × d (profondeur), appuyé au mur 'S','N','O','E'. decal : déplacement le long du mur."""
        x0, y0, x1, y1 = self.r
        if mur == "S": cx = x0 + (x1 - x0) * pos + decal; return (cx - w / 2, y0, cx + w / 2, y0 + d)
        if mur == "N": cx = x0 + (x1 - x0) * pos + decal; return (cx - w / 2, y1 - d, cx + w / 2, y1)
        if mur == "O": cy = y0 + (y1 - y0) * pos + decal; return (x0, cy - w / 2, x0 + d, cy + w / 2)
        cy = y0 + (y1 - y0) * pos + decal; return (x1 - d, cy - w / 2, x1, cy + w / 2)

    def murs_tries(self, evite_fenetres=True):
        sc = []
        for m in "SNOE":
            longueur = (self.r[2] - self.r[0]) if m in "SN" else (self.r[3] - self.r[1])
            s = _mur_portes(self.b, self.r, m) * 6 + (_mur_fenetres(self.b, self.r, m) * (3 if evite_fenetres else 0.5)) - longueur * .002
            sc.append((s, m))
        return [m for (_, m) in sorted(sc)]

    def essayer(self, kind, mur, w, d, pos_list=(.5, .3, .7, .15, .85), **kw):
        for p in pos_list:
            r = self.contre(mur, w, d, pos=p)
            if self.libre(r):
                self.poser(kind, r, mur, **kw); return r
        return None

    def poser(self, kind, r, mur, **kw):
        draw(self.f, kind, r, mur, **kw); self.deja.append(r)

    def dessus(self, kind, r, mur="S", **kw):
        if self.libre(r): self.poser(kind, r, mur, **kw); return True
        return False


# =============================================================== symboles
def _R(f, r, w=FIN, fill=None, col=MEUB): f.rect(*r, w, col, fill=fill)


def draw(f, kind, r, mur="S", **kw):
    x0, y0, x1, y1 = r
    W, H = x1 - x0, y1 - y0
    k = f.N / 50
    if kind == "lit":
        _R(f, r, .45)
        # tête du côté du mur
        e = 90 * k
        if mur in "SN":
            ty = (y0 + 60) if mur == "S" else (y1 - 60 - 380)
            for (a, b_) in ((x0 + 70, x0 + W / 2 - 40), (x0 + W / 2 + 40, x1 - 70)): _R(f, (a, ty, b_, ty + 380), FIN)
            ly = y0 + H * .62 if mur == "S" else y1 - H * .62
            f.ligne(x0 + 40, ly, x1 - 40, ly, FIN, MEUB)
        else:
            tx = (x0 + 60) if mur == "O" else (x1 - 60 - 380)
            for (a, b_) in ((y0 + 70, y0 + H / 2 - 40), (y0 + H / 2 + 40, y1 - 70)): _R(f, (tx, a, tx + 380, b_), FIN)
            lx = x0 + W * .62 if mur == "O" else x1 - W * .62
            f.ligne(lx, y0 + 40, lx, y1 - 40, FIN, MEUB)
    elif kind == "chevet":
        _R(f, r, FIN); f.cercle((x0 + x1) / 2, (y0 + y1) / 2, min(W, H) * .22, FIN, MEUB)
    elif kind == "commode":
        _R(f, r, FIN)
        n = max(2, int(max(W, H) // 450))
        for i in range(1, n):
            if W >= H: f.ligne(x0 + W * i / n, y0, x0 + W * i / n, y1, .2, MEUB)
            else: f.ligne(x0, y0 + H * i / n, x1, y0 + H * i / n, .2, MEUB)
    elif kind == "sofa":
        _R(f, r, .45)
        d = min(W, H) * .28
        if mur in "SN":
            by = (y0, y0 + d) if mur == "S" else (y1 - d, y1)
            _R(f, (x0, by[0], x1, by[1]), FIN)
            _R(f, (x0, y0, x0 + d, y1), FIN); _R(f, (x1 - d, y0, x1, y1), FIN)
            n = 3; [f.ligne(x0 + d + (W - 2 * d) * i / n, (by[1] if mur == "S" else y0), x0 + d + (W - 2 * d) * i / n, (y1 if mur == "S" else by[0]), .2, MEUB) for i in range(1, n)]
        else:
            bx = (x0, x0 + d) if mur == "O" else (x1 - d, x1)
            _R(f, (bx[0], y0, bx[1], y1), FIN); _R(f, (x0, y0, x1, y0 + d), FIN); _R(f, (x0, y1 - d, x1, y1), FIN)
    elif kind == "fauteuil":
        _R(f, r, .45); d = min(W, H) * .25
        if mur in "SN": _R(f, (x0, y0, x1, y0 + d) if mur == "S" else (x0, y1 - d, x1, y1), FIN)
        else: _R(f, (x0, y0, x0 + d, y1) if mur == "O" else (x1 - d, y0, x1, y1), FIN)
    elif kind == "table_basse":
        _R(f, r, .4); _R(f, (x0 + 60, y0 + 60, x1 - 60, y1 - 60), .2)
    elif kind == "tv":
        _R(f, r, FIN, fill=HexColor("#f0f0f0"))
        if mur in "SN": f.ligne(x0 + W * .2, (y0 + y1) / 2, x1 - W * .2, (y0 + y1) / 2, .6, MEUB)
        else: f.ligne((x0 + x1) / 2, y0 + H * .2, (x0 + x1) / 2, y1 - H * .2, .6, MEUB)
    elif kind == "table_repas":
        _R(f, r, .45)
        n = kw.get("n", 3); ch = 450
        for i in range(n):
            cx = x0 + W * (i + .5) / n
            _R(f, (cx - ch / 2, y0 - ch - 40, cx + ch / 2, y0 - 40), FIN); _R(f, (cx - ch / 2, y1 + 40, cx + ch / 2, y1 + ch + 40), FIN)
        _R(f, (x0 - ch - 40, (y0 + y1) / 2 - ch / 2, x0 - 40, (y0 + y1) / 2 + ch / 2), FIN); _R(f, (x1 + 40, (y0 + y1) / 2 - ch / 2, x1 + ch + 40, (y0 + y1) / 2 + ch / 2), FIN)
    elif kind == "bureau":
        _R(f, r, .45)
        if mur in "SN":
            cy = y1 + 330 if mur == "S" else y0 - 330
            f.cercle((x0 + x1) / 2, cy, 230, FIN, MEUB)
            f.ligne(x0 + W * .3, (y0 + y1) / 2, x1 - W * .3, (y0 + y1) / 2, .7, MEUB)
        else:
            cx = x1 + 330 if mur == "O" else x0 - 330
            f.cercle(cx, (y0 + y1) / 2, 230, FIN, MEUB)
            f.ligne((x0 + x1) / 2, y0 + H * .3, (x0 + x1) / 2, y1 - H * .3, .7, MEUB)
    elif kind == "etagere":
        _R(f, r, FIN, fill=HexColor("#f3f3f3"))
        n = max(2, int(max(W, H) // 300))
        for i in range(1, n):
            if W >= H: f.ligne(x0 + W * i / n, y0, x0 + W * i / n, y1, .15, MEUB)
            else: f.ligne(x0, y0 + H * i / n, x1, y0 + H * i / n, .15, MEUB)
    elif kind == "banc":
        _R(f, r, FIN, fill=HexColor("#f3f3f3"))
    elif kind == "frigo":
        _R(f, r, .45); f.texte((x0 + x1) / 2, (y0 + y1) / 2 - 40, "FRIGO", 4.2, col=MEUB)
    elif kind == "cuisiniere":
        _R(f, r, .45)
        for (a, b_) in ((.3, .3), (.7, .3), (.3, .7), (.7, .7)): f.cercle(x0 + W * a, y0 + H * b_, min(W, H) * .13, .25, MEUB)
    elif kind == "gondole":
        _R(f, r, FIN, fill=HexColor("#f6f6f6"))
        if W >= H: f.ligne(x0 + 80, (y0 + y1) / 2, x1 - 80, (y0 + y1) / 2, .2, MEUB)
        else: f.ligne((x0 + x1) / 2, y0 + 80, (x0 + x1) / 2, y1 - 80, .2, MEUB)
    elif kind == "table_resto":
        f.cercle((x0 + x1) / 2, (y0 + y1) / 2, min(W, H) / 2, .4, MEUB)
        ch = 220
        for (dx, dy) in ((0, 1), (0, -1), (1, 0), (-1, 0)):
            f.cercle((x0 + x1) / 2 + dx * (min(W, H) / 2 + ch), (y0 + y1) / 2 + dy * (min(W, H) / 2 + ch), ch * .8, FIN, MEUB)
    elif kind == "table_conf":
        _R(f, r, .45)
        n = max(2, int(max(W, H) // 800))
        for i in range(n):
            if W >= H:
                cx = x0 + W * (i + .5) / n; f.cercle(cx, y0 - 260, 200, FIN, MEUB); f.cercle(cx, y1 + 260, 200, FIN, MEUB)
            else:
                cy = y0 + H * (i + .5) / n; f.cercle(x0 - 260, cy, 200, FIN, MEUB); f.cercle(x1 + 260, cy, 200, FIN, MEUB)
    elif kind == "rack":
        _R(f, r, FIN, fill=HexColor("#efefef"))
        f.ligne(x0, y0, x1, y1, .15, MEUB); f.ligne(x0, y1, x1, y0, .15, MEUB)
    elif kind == "comptoir_service":
        _R(f, r, .5, fill=HexColor("#ececec"))


# =============================================================== règles par local
def _n(nom): return nom.replace("\n", " ").lower()


def meubler_piece(p):
    nom = _n(p.nom); x0, y0, x1, y1 = p.r; W, H = x1 - x0, y1 - y0
    if "chambre" in nom:
        grand = "principale" in nom or W * H > 16e6
        lw, ld = (2000, 2100) if grand else (1600, 2100)
        murs = p.murs_tries()
        for m in murs:
            if m in "SN" and (H < ld + 900 or W < lw + 2 * 500 + 100): continue
            if m in "OE" and (W < ld + 900 or H < lw + 2 * 500 + 100): continue
            r = None
            for pos in (.5, .35, .65):
                rr = p.contre(m, lw, ld, pos=pos)
                if p.libre(rr, 50): r = rr; break
            if not r: continue
            p.poser("lit", r, m)
            for sgn in (-1, 1):
                if m in "SN": c = (r[0] - 450 - 40 if sgn < 0 else r[2] + 40, r[1] if m == "S" else r[3] - 450, r[0] - 40 if sgn < 0 else r[2] + 40 + 450, r[1] + 450 if m == "S" else r[3])
                else: c = (r[0] if m == "O" else r[2] - 450, r[1] - 450 - 40 if sgn < 0 else r[3] + 40, r[0] + 450 if m == "O" else r[2], r[1] - 40 if sgn < 0 else r[3] + 40 + 450)
                p.dessus("chevet", c, m)
            break
        for m in p.murs_tries(False):
            if p.essayer("commode", m, 1200, 500, (.5, .25, .75)): break
        return
    if any(k in nom for k in ("séjour", "salon", "salle familiale", "salle de jeux", "living")):
        if W < 2800 or H < 2800: 
            p.essayer("fauteuil", p.murs_tries()[0], 800, 800); return
        for m in p.murs_tries():
            long_ = W if m in "SN" else H
            if long_ < 2600: continue
            sw = min(2600, long_ - 1200)
            r = None
            for pos in (.5, .35, .65):
                rr = p.contre(m, sw, 950, pos=pos)
                if p.libre(rr): r = rr; break
            if not r: continue
            p.poser("sofa", r, m)
            opp = {"S": "N", "N": "S", "O": "E", "E": "O"}[m]
            if m in "SN":
                t = (r[0] + sw * .25, r[3] + 450 if m == "S" else r[1] - 450 - 600, r[2] - sw * .25, r[3] + 450 + 600 if m == "S" else r[1] - 450)
            else:
                t = (r[2] + 450 if m == "O" else r[0] - 450 - 600, r[1] + sw * .25, r[2] + 450 + 600 if m == "O" else r[0] - 450, r[3] - sw * .25)
            p.dessus("table_basse", t, m)
            p.essayer("tv", opp, min(1800, (W if opp in "SN" else H) * .4), 450, (.5, .3, .7))
            for m2 in p.murs_tries():
                if m2 not in (m, opp) and p.essayer("fauteuil", m2, 850, 850, (.3, .7, .5)): break
            return
        return
    if "salle à manger" in nom:
        n = 3 if min(W, H) > 3000 else 2
        tw, td = 600 * n + 300, 950
        if W >= H: r = (x0 + W / 2 - tw / 2, y0 + H / 2 - td / 2, x0 + W / 2 + tw / 2, y0 + H / 2 + td / 2)
        else: r = (x0 + W / 2 - td / 2, y0 + H / 2 - tw / 2, x0 + W / 2 + td / 2, y0 + H / 2 + tw / 2); n = 3
        if W >= H:
            for dy in (0, 500, -500, 1000, -1000):
                rr = (r[0], r[1] + dy, r[2], r[3] + dy)
                if p.libre((rr[0] - 500, rr[1] - 500, rr[2] + 500, rr[3] + 500)): p.poser("table_repas", rr, "S", n=n); break
        else:
            for dx in (0, 500, -500, 1000, -1000):
                rr = (r[0] + dx, r[1], r[2] + dx, r[3])
                if p.libre((rr[0] - 500, rr[1] - 500, rr[2] + 500, rr[3] + 500)):
                    # table verticale : on la dessine pivotée (chaises sur les côtés)
                    draw_vertical_table(p, rr); break
        return
    if "bureau" in nom and (W > 2200 and H > 2200):
        for m in p.murs_tries():
            if p.essayer("bureau", m, 1600, 750, (.5, .3, .7)):
                for m2 in p.murs_tries(False):
                    if m2 != m and p.essayer("etagere", m2, 1400, 350, (.5, .25, .75)): break
                return
        return
    if "bibliothèque" in nom:
        n = 0
        for m in p.murs_tries(False):
            if p.essayer("etagere", m, min(2400, (W if m in "SN" else H) * .6), 350, (.5, .3, .7)):
                n += 1
                if n == 2: break
        for m in p.murs_tries(False):
            if p.essayer("fauteuil", m, 850, 850, (.5, .3, .7)): break
        return
    if "vestibule" in nom:
        for m in p.murs_tries(): 
            if p.essayer("banc", m, 1000, 400, (.5, .3, .7)): break
        return
    if "salle de réunion" in nom or "réunion" in nom:
        tw, td = min(W - 1600, 3600), min(H - 1600, 1300)
        if tw > 1500 and td > 700: p.dessus("table_conf", (x0 + W / 2 - tw / 2, y0 + H / 2 - td / 2, x0 + W / 2 + tw / 2, y0 + H / 2 + td / 2), "S")
        return
    if "bureau" in nom or "réception" in nom:
        for m in p.murs_tries():
            if p.essayer("bureau", m, 1500, 750, (.5, .3, .7)): break
        return
    if any(k in nom for k in ("aire de vente", "épicerie", "pharmacie", "boutique", "magasin")):
        gl, gd = 3000, 450
        pas = 2700
        yy = y0 + 2500
        nrang = 0
        while yy + gd < y1 - 1800:
            xx = x0 + 1800
            while xx + gl < x1 - 1200:
                p.dessus("gondole", (xx, yy, xx + gl, yy + gd), "S")
                xx += gl + 900
            yy += pas; nrang += 1
        return
    if "restaurant" in nom:
        d_ = 1000; xx = x0 + 1800
        while xx + d_ < x1 - 1200:
            yy = y0 + 1800
            while yy + d_ < y1 - 1400:
                p.dessus("table_resto", (xx, yy, xx + d_, yy + d_), "S"); yy += 2300
            xx += 2300
        return
    if "entrepôt" in nom or "réserve" in nom:
        yy = y0 + 1200
        while yy + 1000 < y1 - 1400:
            xx = x0 + 1200
            while xx + 2800 < x1 - 1200:
                p.dessus("rack", (xx, yy, xx + 2800, yy + 1000), "S"); xx += 3400
            yy += 2600
        return
    if "salle des employés" in nom or "employés" in nom:
        if W > 3000 and H > 3000: p.dessus("table_repas", (x0 + W / 2 - 1000, y0 + H / 2 - 500, x0 + W / 2 + 1000, y0 + H / 2 + 500), "S", n=3)
        return
    if "cuisine" in nom:
        # réfrigérateur et cuisinière contre les comptoirs
        cs = getattr(p.b, "comptoirs", [])
        for (a, b_, c_, d_, lab) in cs:
            if lab: continue
            if not (x0 - 100 <= a and c_ <= x1 + 100 and y0 - 100 <= b_ and d_ <= y1 + 100): continue
            if (c_ - a) >= (d_ - b_) and (c_ - a) > 2400:
                p.dessus_hors_occ("cuisiniere", (a + (c_ - a) * .45, b_, a + (c_ - a) * .45 + 760, d_), "S")
            break


def draw_vertical_table(p, r):
    f = p.f; x0, y0, x1, y1 = r; W, H = x1 - x0, y1 - y0
    _R(f, r, .45)
    for i in range(3):
        cy = y0 + H * (i + .5) / 3
        _R(f, (x0 - 490, cy - 225, x0 - 40, cy + 225), FIN); _R(f, (x1 + 40, cy - 225, x1 + 490, cy + 225), FIN)
    _R(f, (x0 + W / 2 - 225, y0 - 490, x0 + W / 2 + 225, y0 - 40), FIN); _R(f, (x0 + W / 2 - 225, y1 + 40, x0 + W / 2 + 225, y1 + 490), FIN)
    p.deja.append((x0 - 500, y0 - 500, x1 + 500, y1 + 500))


def _dessus_hors_occ(self, kind, r, mur="S"):
    # variante tolérant les comptoirs : sert à placer la cuisinière dans un comptoir
    self.poser(kind, r, mur)
Piece.dessus_hors_occ = _dessus_hors_occ


def meubler(b, f):
    occ = _obstacles(b); zones = _zones_portes(b); deja = []
    for loc in b.locaux:
        try:
            meubler_piece(Piece(b, f, loc, occ, zones, deja))
        except Exception as e:  # un meuble raté ne doit jamais bloquer la production d'un dossier
            print(f"  ! ameublement {loc[1]!r} : {e}")
