# -*- coding: utf-8 -*-
"""Contrôle automatique d'un niveau : ouvertures hors du mur, ouvertures qui se chevauchent, cloisons qui tombent dans une ouverture,
battants de portes qui se croisent, locaux qui se chevauchent. Retourne une liste de messages (vide = tout va bien)."""


def _ouv_dans(b):
    res = []
    for o in b.portes + b.fenetres:
        res.append(o)
    return res


def controler(b, nom="niveau"):
    msgs = []
    W, D, t = b.W, b.D, b.t
    ouv = b.portes + b.fenetres
    em = getattr(b, "emprise", None)
    e0, e1 = em if em else (0, W)
    # 1. ouverture hors du mur
    for o in ouv:
        ax, at, s, w = o["axe"], o["at"], o["s"], o["w"]
        a0, a1 = (e0, e1) if ax == "h" else (0, D)
        if s < a0 + t - 1 or s + w > a1 - t + 1:
            msgs.append(f"{nom} : l'ouverture {o.get('no', o.get('type'))} (mur {ax}, at={at}, s={s}, w={w}) dépasse les extrémités du mur ({a0 + t} à {a1 - t})")
    # 2. chevauchement d'ouvertures sur un même mur
    for i, a in enumerate(ouv):
        for c in ouv[i + 1:]:
            if a["axe"] == c["axe"] and abs(a["at"] - c["at"]) < 1 and not (a["s"] + a["w"] <= c["s"] + 1 or c["s"] + c["w"] <= a["s"] + 1):
                msgs.append(f"{nom} : deux ouvertures se chevauchent sur le même mur (at={a['at']}) : {a.get('no', a.get('type'))} et {c.get('no', c.get('type'))}")
    # 3. cloison qui aboutit dans une ouverture
    for (x1, y1, x2, y2, e) in b.murs_int:
        for o in ouv:
            if o["axe"] == "h" and (x1 == x2):
                for yy in (y1, y2):
                    if abs(yy - o["at"]) <= (b.t / 2 + 5) and o["s"] - 1 <= x1 <= o["s"] + o["w"] + 1:
                        msgs.append(f"{nom} : une cloison (x={x1}) aboutit dans l'ouverture {o.get('no', o.get('type'))} du mur y={o['at']}")
            if o["axe"] == "v" and (y1 == y2):
                for xx in (x1, x2):
                    if abs(xx - o["at"]) <= (b.t / 2 + 5) and o["s"] - 1 <= y1 <= o["s"] + o["w"] + 1:
                        msgs.append(f"{nom} : une cloison (y={y1}) aboutit dans l'ouverture {o.get('no', o.get('type'))} du mur x={o['at']}")
    # 4. battants de portes qui se croisent
    import ameublement
    zones = ameublement._zones_portes(b)
    for i in range(len(zones)):
        for j in range(i + 1, len(zones)):
            za, zb = zones[i], zones[j]
            if not (za[2] <= zb[0] + 150 or zb[2] <= za[0] + 150 or za[3] <= zb[1] + 150 or zb[3] <= za[1] + 150):
                msgs.append(f"{nom} : le battant de la porte {b.portes[i].get('no')} croise celui de la porte {b.portes[j].get('no')}")
    # 5. locaux qui se chevauchent
    L = b.locaux
    for i in range(len(L)):
        for j in range(i + 1, len(L)):
            a, c = L[i], L[j]
            if not (a[4] <= c[2] + 5 or c[4] <= a[2] + 5 or a[5] <= c[3] + 5 or c[5] <= a[3] + 5):
                msgs.append(f"{nom} : les locaux {a[0]} ({a[1]}) et {c[0]} ({c[1]}) se chevauchent")
    # 6. numéros de portes en double
    nos = [o.get("no") for o in b.portes]
    for n in set(nos):
        if n and nos.count(n) > 1: msgs.append(f"{nom} : numéro de porte en double : {n}")
    return msgs
