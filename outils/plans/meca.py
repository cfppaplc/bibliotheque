# -*- coding: utf-8 -*-
"""Bibliothèque de symboles de plomberie et de chauffage en élévation (gros plans).
Tout se dessine en mm réels (modèle) sur une Feuille de dessin.py; chaque symbole a un repère local (u le long de la tuyauterie, v perpendiculaire)."""
import math
from dessin import *

ROUGE = HexColor("#9b1c2e")
CHAUD, FROID, DRAIN, GAZ_C, VENT = HexColor("#c0392b"), HexColor("#1f6fb2"), HexColor("#2e7d32"), HexColor("#b8860b"), HexColor("#7b1fa2")
EAU_G = HexColor("#dbe9f4")      # remplissage clair des appareils
GRIS_P = HexColor("#eceff1")


class Sym:
    """Repère local : origine (x, y) du modèle, rot en degrés (0 = u vers +x, 90 = u vers +y), flip = miroir sur v."""
    def __init__(s, f, x, y, rot=0, flip=False):
        s.f, s.x, s.y, s.fl = f, x, y, -1 if flip else 1
        a = math.radians(rot); s.co, s.si = math.cos(a), math.sin(a)

    def p(s, u, v):
        v *= s.fl
        return (s.x + u * s.co - v * s.si, s.y + u * s.si + v * s.co)

    def poly(s, pts, w=.6, fill=white, close=True, col=black, dash=None):
        s.f.poly([s.p(*q) for q in pts], w, col, dash, close, fill)

    def rect(s, u0, v0, u1, v1, w=.6, fill=white, col=black, dash=None):
        s.poly([(u0, v0), (u1, v0), (u1, v1), (u0, v1)], w, fill, True, col, dash)

    def ln(s, u0, v0, u1, v1, w=.5, col=black, dash=None):
        s.f.ligne(*s.p(u0, v0), *s.p(u1, v1), w, col, dash)

    def circ(s, u, v, r, w=.6, fill=white, col=black):
        s.f.cercle(*s.p(u, v), r, w, col, fill)

    def arc(s, u, v, a, b, a0, a1, n=24):
        return [(u + a * math.cos(math.radians(a0 + (a1 - a0) * i / n)), v + b * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]

    def ell(s, u, v, a, b, w=.6, fill=white, a0=0, a1=360, close=True):
        s.poly(s.arc(u, v, a, b, a0, a1), w, fill, close)


# ------------------------------------------------------------------ tuyauterie
def tuyau(f, pts, d, col=black, w=.6, R=None, bouts=(False, False), fill=white):
    """Tuyau à double trait le long d'une ligne brisée orthogonale (axe = pts), diamètre extérieur d, coudes arrondis (rayon R)."""
    R = d * 1.1 if R is None else R
    P = [tuple(map(float, q)) for q in pts]
    Q = [P[0]]
    for i in range(1, len(P) - 1):
        a, b, c = P[i - 1], P[i], P[i + 1]
        d1 = (b[0] - a[0], b[1] - a[1]); d2 = (c[0] - b[0], c[1] - b[1])
        l1, l2 = math.hypot(*d1), math.hypot(*d2)
        if l1 == 0 or l2 == 0: continue
        d1 = (d1[0] / l1, d1[1] / l1); d2 = (d2[0] / l2, d2[1] / l2)
        r = min(R, l1 * .49, l2 * .49)
        p1 = (b[0] - d1[0] * r, b[1] - d1[1] * r); p2 = (b[0] + d2[0] * r, b[1] + d2[1] * r)
        cx, cy = p1[0] + d2[0] * r, p1[1] + d2[1] * r
        a0 = math.atan2(p1[1] - cy, p1[0] - cx); a1 = math.atan2(p2[1] - cy, p2[0] - cx)
        da = (a1 - a0 + math.pi) % (2 * math.pi) - math.pi
        for k in range(0, 9): t = a0 + da * k / 8; Q.append((cx + r * math.cos(t), cy + r * math.sin(t)))
    Q.append(P[-1])
    L, Rr = [], []
    n = len(Q); h = d / 2
    for i in range(n):
        if i == 0: nx, ny = (-(Q[1][1] - Q[0][1]), Q[1][0] - Q[0][0]); l = math.hypot(nx, ny); nx, ny = nx / l, ny / l; ox_, oy_ = nx * h, ny * h
        elif i == n - 1: nx, ny = (-(Q[i][1] - Q[i - 1][1]), Q[i][0] - Q[i - 1][0]); l = math.hypot(nx, ny); nx, ny = nx / l, ny / l; ox_, oy_ = nx * h, ny * h
        else:
            a1_ = (-(Q[i][1] - Q[i - 1][1]), Q[i][0] - Q[i - 1][0]); a2_ = (-(Q[i + 1][1] - Q[i][1]), Q[i + 1][0] - Q[i][0])
            l1_, l2_ = math.hypot(*a1_), math.hypot(*a2_)
            if l1_ == 0 or l2_ == 0: continue
            n1 = (a1_[0] / l1_, a1_[1] / l1_); n2 = (a2_[0] / l2_, a2_[1] / l2_)
            k = 1 + n1[0] * n2[0] + n1[1] * n2[1]
            ox_, oy_ = h * (n1[0] + n2[0]) / k, h * (n1[1] + n2[1]) / k
        L.append((Q[i][0] + ox_, Q[i][1] + oy_)); Rr.append((Q[i][0] - ox_, Q[i][1] - oy_))
    f.poly(L + Rr[::-1], 0, fill, None, True, fill)
    f.poly(L, w, col); f.poly(Rr, w, col)
    for (b, i) in ((bouts[0], 0), (bouts[1], -1)):
        if b: f.ligne(L[i][0], L[i][1], Rr[i][0], Rr[i][1], w, col)


def coupure(f, x, y, d, orient="h"):
    """Trait de coupure (la tuyauterie continue ailleurs)."""
    if orient == "h": f.poly([(x - d * .2, y - d * .7), (x + d * .2, y - d * .2), (x - d * .2, y + d * .2), (x + d * .2, y + d * .7)], .5)
    else: f.poly([(x - d * .7, y - d * .2), (x - d * .2, y + d * .2), (x + d * .2, y - d * .2), (x + d * .7, y + d * .2)], .5)


# ------------------------------------------------------------------ raccords et robinetterie (axe u, centre à u)
def bride(s, u, d, v=None):
    h = d * .95
    s.rect(u - d * .09, -h, u + d * .09, h, .6, GRIS_P)
    for k in (-.7, .7): s.ln(u - d * .09, d * k, u + d * .09, d * k, .3)


def union(s, u, d):
    s.rect(u - d * .35, -d * .62, u + d * .35, d * .62, .6, GRIS_P); s.ln(u, -d * .62, u, d * .62, .3)


def manchon(s, u, d):
    s.rect(u - d * .3, -d * .6, u + d * .3, d * .6, .6, GRIS_P)


def robinet_vanne(s, u, d, bride_=True, volant=True):
    """Robinet à vanne (gate) : corps, chapeau, tige montante, volant."""
    a = d * 1.05
    s.poly([(u - a, -d * .55), (u - a * .7, -d * .95), (u + a * .7, -d * .95), (u + a, -d * .55), (u + a, d * .55), (u + a * .7, d * .85), (u - a * .7, d * .85), (u - a, d * .55)], .7, GRIS_P)
    s.rect(u - d * .45, d * .85, u + d * .45, d * 1.75, .6, GRIS_P); s.rect(u - d * .6, d * 1.75, u + d * .6, d * 1.95, .6, GRIS_P)
    s.rect(u - d * .09, d * 1.95, u + d * .09, d * 3.0, .5, white)
    if volant:
        s.rect(u - d * 1.0, d * 3.0, u + d * 1.0, d * 3.16, .6, GRIS_P); s.rect(u - d * .2, d * 2.85, u + d * .2, d * 3.4, .5, GRIS_P)
    if bride_:
        for sg in (-1, 1): bride(s, u + sg * a, d)
    return d * 3.4


def robinet_sphere(s, u, d, levier=35):
    """Robinet à tournant sphérique avec poignée."""
    s.poly([(u - d * .75, -d * .35), (u - d * .45, -d * .8), (u + d * .45, -d * .8), (u + d * .75, -d * .35), (u + d * .75, d * .35), (u + d * .45, d * .8), (u - d * .45, d * .8), (u - d * .75, d * .35)], .7, GRIS_P)
    s.rect(u - d * .2, d * .8, u + d * .2, d * 1.15, .6, GRIS_P)
    a = math.radians(levier); L = d * 2.1
    pts = [(u, d * 1.15), (u + L * math.cos(a), d * 1.15 + L * math.sin(a))]
    s.ln(*pts[0], *pts[1], 2.2, black)
    s.circ(*pts[1], d * .17, .5, GRIS_P)


def clapet(s, u, d):
    """Clapet antiretour à battant."""
    a = d * 1.05
    s.poly([(u - a, -d * .55), (u - a * .7, -d * .95), (u + a * .7, -d * .95), (u + a, -d * .55), (u + a, d * .55), (u + a * .6, d * .8), (u - a * .6, d * .8), (u - a, d * .55)], .7, GRIS_P)
    s.ell(u, d * .8, d * .75, d * .75, .7, GRIS_P, 0, 180)
    s.ln(u - d * .55, d * .45, u + d * .4, -d * .2, 1.1); s.circ(u - d * .55, d * .45, d * .08, .4, black)
    for sg in (-1, 1): bride(s, u + sg * a, d)


def soupape_surete(s, u, d):
    """Soupape de sûreté (axe : pas de tuyau, elle monte sur le raccord; v croissant vers le haut). Retourne le point de décharge (u, v)."""
    s.rect(u - d * .9, 0, u + d * .9, d * 1.0, .7, GRIS_P)                      # raccord et corps
    s.poly([(u - d * .9, d * 1.0), (u - d * .6, d * 1.5), (u + d * .6, d * 1.5), (u + d * .9, d * 1.0)], .7, GRIS_P)
    s.rect(u - d * .55, d * 1.5, u + d * .55, d * 3.0, .7, GRIS_P)               # chapeau à ressort
    for k in range(5): s.ln(u - d * .55, d * (1.8 + .22 * k), u + d * .55, d * (1.8 + .22 * k), .3)
    s.rect(u - d * .35, d * 3.0, u + d * .35, d * 3.2, .6, GRIS_P)
    s.poly([(u + d * .35, d * 2.85), (u + d * 1.9, d * 3.4), (u + d * 1.9, d * 3.6), (u + d * .35, d * 3.05)], .6, GRIS_P)  # levier d'essai
    s.rect(u + d * .9, d * .25, u + d * 1.9, d * .85, .6, GRIS_P)                # sortie latérale
    return (u + d * 1.55, d * .55)


def circulateur(s, u, d):
    """Circulateur à rotor noyé (bride aux deux bouts)."""
    s.rect(u - d * 1.5, -d * .75, u + d * 1.5, d * .75, .7, GRIS_P)
    s.ell(u, 0, d * 1.05, d * 1.05, .7, GRIS_P)
    s.rect(u - d * .85, d * .9, u + d * .85, d * 2.7, .7, GRIS_P)
    for k in range(1, 6): s.ln(u - d * .85, d * (.9 + .3 * k), u + d * .85, d * (.9 + .3 * k), .3)
    s.rect(u - d * .6, d * 2.7, u + d * .6, d * 3.1, .6, GRIS_P)               # boîte de bornes
    s.ln(u - d * .35, d * 2.9, u + d * .35, d * 2.9, .4)
    s.poly([(u - d * .4, -d * .2), (u + d * .4, -d * .2), (u + d * .4, -d * .4), (u + d * .9, 0), (u + d * .4, d * .4), (u + d * .4, d * .2), (u - d * .4, d * .2)], .4, white)   # sens
    for sg in (-1, 1): bride(s, u + sg * d * 1.5, d)
    return d * 3.1


def vanne3(s, u, d):
    """Vanne de contrôle à trois voies avec servomoteur à membrane."""
    s.rect(u - d * 1.2, -d * .55, u + d * 1.2, d * .55, .7, GRIS_P)
    s.rect(u - d * .55, -d * 1.9, u + d * .55, -d * .55, .7, GRIS_P)                         # 3e voie vers le bas
    s.rect(u - d * .6, d * .55, u + d * .6, d * 1.6, .7, GRIS_P)
    s.rect(u - d * .12, d * 1.6, u + d * .12, d * 2.5, .5, white)
    s.poly(s.arc(u, d * 2.5, d * 1.55, d * 1.2, 0, 180), .7, GRIS_P)
    s.rect(u - d * 1.55, d * 2.35, u + d * 1.55, d * 2.5, .7, GRIS_P)
    s.rect(u - d * .25, d * 3.65, u + d * .25, d * 3.95, .6, GRIS_P)
    for sg in (-1, 1): bride(s, u + sg * d * 1.2, d)
    bride(s, u, d * .9) if False else None
    s.rect(u - d * .8, -d * 1.9, u + d * .8, -d * 1.75, .6, GRIS_P)
    return d * 3.95


def manometre(s, u, hauteur=70, r=34):
    """Manomètre à cadran sur sa tige (robinet d'arrêt de 1/4 po)."""
    s.rect(u - 6, 0, u + 6, hauteur, .5, GRIS_P)
    s.rect(u - 11, hauteur * .35, u + 11, hauteur * .6, .5, GRIS_P)
    cy = hauteur + r
    s.circ(u, cy, r, .8, white); s.circ(u, cy, r * .82, .3, white)
    for k in range(9):
        a = math.radians(225 - 270 * k / 8)
        s.ln(u + r * .82 * math.cos(a), cy + r * .82 * math.sin(a), u + r * .68 * math.cos(a), cy + r * .68 * math.sin(a), .3)
    a = math.radians(70); s.ln(u, cy, u + r * .7 * math.cos(a), cy + r * .7 * math.sin(a), .6)
    s.circ(u, cy, 3, .3, black)
    return hauteur + 2 * r


def thermometre(s, u, hauteur=60, long=190, ang=40):
    """Thermomètre industriel à tube (puits thermométrique)."""
    s.rect(u - 8, -35, u + 8, hauteur * .7, .5, GRIS_P)
    s.rect(u - 14, hauteur * .7, u + 14, hauteur, .6, GRIS_P)
    a = math.radians(90 - ang)
    p0 = (u, hauteur); p1 = (u + long * math.cos(a), hauteur + long * math.sin(a))
    nx, ny = -math.sin(a) * 17, math.cos(a) * 17
    s.poly([(p0[0] + nx, p0[1] + ny), (p1[0] + nx, p1[1] + ny), (p1[0] - nx, p1[1] - ny), (p0[0] - nx, p0[1] - ny)], .7, white)
    for k in range(1, 8): q = (p0[0] + (p1[0] - p0[0]) * k / 8, p0[1] + (p1[1] - p0[1]) * k / 8); s.ln(q[0] - nx * .5, q[1] - ny * .5, q[0] + nx * .5, q[1] + ny * .5, .3)
    return p1


def purgeur(s, u):
    """Purgeur d'air automatique."""
    s.rect(u - 14, 0, u + 14, 25, .5, GRIS_P)
    s.rect(u - 32, 25, u + 32, 105, .7, GRIS_P); s.ln(u - 32, 65, u + 32, 65, .3)
    s.ell(u, 105, 32, 14, .6, GRIS_P, 0, 180)
    s.rect(u - 10, 118, u + 10, 135, .5, GRIS_P)


def drain(s, u, d=22):
    """Robinet de vidange avec embout fileté pour boyau."""
    s.rect(u - d * .4, 0, u + d * .4, d * .9, .6, GRIS_P)
    s.rect(u - d * .7, d * .9, u + d * .7, d * 1.6, .6, GRIS_P); s.ln(u - d * .7, d * 1.25, u + d * .7, d * 1.25, .3)
    s.rect(u - d * .25, d * 1.6, u + d * .25, d * 2.2, .5, GRIS_P)
    s.rect(u - d * .8, d * 2.2, u + d * .8, d * 2.4, .5, GRIS_P)
    s.rect(u + d * .7, d * .8, u + d * 1.9, d * 1.1, .6, GRIS_P)
    s.rect(u + d * 1.9, d * .6, u + d * 2.3, d * 1.3, .5, GRIS_P)


def reducteur(s, u, d):
    """Réducteur de pression (cloche à ressort)."""
    a = d * 1.0
    s.poly([(u - a, -d * .55), (u - a * .7, -d * .85), (u + a * .7, -d * .85), (u + a, -d * .55), (u + a, d * .55), (u + a * .7, d * .85), (u - a * .7, d * .85), (u - a, d * .55)], .7, GRIS_P)
    s.rect(u - d * .5, d * .85, u + d * .5, d * 1.2, .6, GRIS_P)
    s.poly(s.arc(u, d * 1.2, d * 1.0, d * 1.2, 0, 180), .7, GRIS_P)
    s.rect(u - d * .12, d * 2.4, u + d * .12, d * 2.8, .5, GRIS_P); s.rect(u - d * .4, d * 2.8, u + d * .4, d * 3.0, .6, GRIS_P)
    for sg in (-1, 1): union(s, u + sg * (a + d * .35), d)


def compteur(s, u, d):
    """Compteur d'eau à cadran."""
    s.rect(u - d * 1.4, -d * .75, u + d * 1.4, d * .75, .7, GRIS_P)
    s.ln(u - d * .6, -d * .75, u - d * .6, d * .75, .3); s.ln(u + d * .6, -d * .75, u + d * .6, d * .75, .3)
    s.rect(u - d * .8, d * .75, u + d * .8, d * 1.05, .6, GRIS_P)
    s.circ(u, d * 1.75, d * .75, .8, white); s.circ(u, d * 1.75, d * .6, .3, white)
    s.rect(u - d * .45, d * 1.75, u + d * .45, d * 2.0, .4, white)
    s.ln(u, d * 1.75, u + d * .35, d * 2.25, .5)
    for sg in (-1, 1): union(s, u + sg * (d * 1.4 + d * .3), d)


def filtre_y(s, u, d):
    s.poly([(u - d * 1.0, -d * .55), (u - d * .7, -d * .85), (u + d * .8, -d * .85), (u + d * 1.0, -d * .55), (u + d * 1.0, d * .55), (u + d * .7, d * .85), (u - d * .7, d * .85), (u - d * 1.0, d * .55)], .7, GRIS_P)
    s.poly([(u - d * .2, -d * .8), (u + d * .6, -d * 1.9), (u + d * 1.0, -d * 1.6), (u + d * .3, -d * .8)], .7, GRIS_P)
    s.rect(u + d * .45, -d * 2.15, u + d * 1.15, -d * 1.55, .6, GRIS_P)
    for sg in (-1, 1): bride(s, u + sg * d * 1.0, d)


def vase_expansion(s, u, r=130, h=420):
    """Vase d'expansion vertical sur son raccord (v vers le haut)."""
    s.rect(u - 14, 0, u + 14, 60, .5, GRIS_P)
    s.poly([(u - r, 60 + r * .45), (u - r, 60 + h - r * .45)] if False else [(u - r, 60 + r * .4)], 0)
    pts = s.arc(u, 60 + r * .4, r, r * .4, 180, 360, 16)
    pts += [(u + r, 60 + h - r * .4)] + s.arc(u, 60 + h - r * .4, r, r * .4, 0, 180, 16)
    s.poly(pts, .8, EAU_G)
    s.ln(u - r, 60 + h * .5, u + r, 60 + h * .5, .4, dash=[3, 2]); s.ln(u - r, 60 + h * .5 + r * .5, u + r, 60 + h * .5 + r * .5, .3)
    s.rect(u - 22, 60 + h + r * .05 - r * .4 + r * .4, u + 22, 60 + h + r * .4, .5, GRIS_P)
    return 60 + h + r * .4


def reservoir_h(s, L, D, nom_plaque=True):
    """Réservoir cylindrique horizontal à fonds bombés : u de 0 à L (bout à bout), centre à v = 0."""
    r = D / 2; e = D * .22
    haut = s.arc(0, 0, 0, 0, 0, 0, 1)
    pts = [(e, r)] + s.arc(e, 0, e, r, 90, 180, 14)[1:] + s.arc(e, 0, e, r, 180, 270, 14)[1:] + [(L - e, -r)] + s.arc(L - e, 0, e, r, 270, 360, 14)[1:] + s.arc(L - e, 0, e, r, 0, 90, 14)[1:]
    s.poly(pts, 1.0, EAU_G)
    s.ln(e, r, e, -r, .35); s.ln(L - e, r, L - e, -r, .35)       # joints soudés
    s.ln(e * .55, r * .78, L - e * .55, r * .78, .2, GRIS_C) if False else None


def support_beton(s, u0, u1, h, haut_courbe=None):
    s.rect(u0, 0, u1, h, .9, GRIS_TC)
    s.f.hachures(*[min(s.p(u0, 0)[0], s.p(u1, h)[0]), min(s.p(u0, 0)[1], s.p(u1, h)[1]), max(s.p(u0, 0)[0], s.p(u1, h)[0]), max(s.p(u0, 0)[1], s.p(u1, h)[1])], 55, 45, GRIS_C, .25)


def suspension(s, u, d, y_plafond):
    """Support à étrier (tige filetée + anneau) : s repère à l'axe du tuyau, plafond y_plafond (distance au-dessus)."""
    s.rect(u - 8, d * .6, u + 8, y_plafond, .5, GRIS_P)
    s.rect(u - d * .65, d * .5, u + d * .65, d * .62, .6, GRIS_P)
    s.ln(u - d * .62, -d * .5, u - d * .62, d * .55, 1.2); s.ln(u + d * .62, -d * .5, u + d * .62, d * .55, 1.2)
    s.ln(u - d * .62, -d * .5, u + d * .62, -d * .5, 1.2)


def bouton_mur(f, x0, y0, x1, y1, haut=True):
    f.rect(x0, y0, x1, y1, .9, GRIS_TC); f.hachures(x0, y0, x1, y1, 70, 45, GRIS_C, .25)


def plancher(f, x0, x1, y=0, label="Plancher fini"):
    f.ligne(x0, y, x1, y, 1.4); f.hachures(x0, y - 120, x1, y, 90, 45, GRIS_C, .25)


# ------------------------------------------------------------------ étiquettes (flèches rouges)
def etiq(f, txt, tx, ty, px, py, size=7.5, cote="auto", col=ROUGE):
    """Texte centré en (tx, ty), flèche rouge pointant le point (px, py)."""
    lignes = txt.split("\n")
    larg = max(len(l) for l in lignes) * size * .178 * f.N * .5 * 1.05      # demi-largeur (modèle)
    haut = len(lignes) * size * 1.15 * .3528 * f.N * .5
    dx, dy = px - tx, py - ty
    if cote == "auto": cote = "h" if abs(dx) > abs(dy) * 1.6 + larg * .6 else "v"
    gap = 1.2 * f.N
    if cote == "h": sx, sy = tx + (larg + gap) * (1 if dx > 0 else -1), ty
    else: sx, sy = tx, ty + (haut + gap) * (1 if dy > 0 else -1)
    f.texte(tx, ty, txt, size, False, "c")
    f.ligne(sx, sy, px, py, .6, col)
    L = math.hypot(px - sx, py - sy)
    if L > 0:
        ux, uy = (px - sx) / L, (py - sy) / L; h = 2.6 * f.N; w = .9 * f.N
        f.poly([(px, py), (px - ux * h - uy * w, py - uy * h + ux * w), (px - ux * h + uy * w, py - uy * h - ux * w)], .4, col, None, True, col)


def cote_ver(f, x, y0, y1, texte, decal=0, size=7):
    f.cote(y0, y1, x + decal, texte, "v", size)


def robinet_soupape(s, u, d):
    """Robinet à soupape (globe) : corps sphérique, tige, volant."""
    s.ell(u, 0, d * .95, d * .85, .7, GRIS_P)
    s.rect(u - d * .5, -d * .05, u + d * .5, d * .75, .0, GRIS_P, GRIS_P)
    s.rect(u - d * .4, d * .75, u + d * .4, d * 1.6, .6, GRIS_P); s.rect(u - d * .55, d * 1.6, u + d * .55, d * 1.78, .6, GRIS_P)
    s.rect(u - d * .09, d * 1.78, u + d * .09, d * 2.7, .5, white)
    s.rect(u - d * .95, d * 2.7, u + d * .95, d * 2.86, .6, GRIS_P); s.rect(u - d * .2, d * 2.56, u + d * .2, d * 3.1, .5, GRIS_P)
    for sg in (-1, 1): union(s, u + sg * (d * .95 + d * .3), d)
    return d * 3.1


def melangeur(s, u, d):
    """Mélangeur thermostatique : corps en T, cadran de réglage face à nous, raccord d'eau froide par le haut."""
    s.rect(u - d * 1.3, -d * .7, u + d * 1.3, d * .7, .7, GRIS_P)
    s.rect(u - d * .45, d * .7, u + d * .45, d * 1.5, .7, GRIS_P)
    s.circ(u, 0, d * .55, .8, white); s.circ(u, 0, d * .42, .3, white)
    for k in range(7):
        a = math.radians(200 - 220 * k / 6); s.ln(u + d * .42 * math.cos(a), d * .42 * math.sin(a), u + d * .33 * math.cos(a), d * .33 * math.sin(a), .3)
    s.ln(u, 0, u + d * .3, d * .22, .7)
    for sg in (-1, 1): union(s, u + sg * (d * 1.3 + d * .3), d)
    union_v = None
    return d * 1.5
