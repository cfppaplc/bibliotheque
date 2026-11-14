"""Refait le livre « Administration d'un bâtiment » en vraies pages HTML au format commun Métier+,
à partir du PDF du cahier (texte réel) et du livre animé v4 (réponses du corrigé, couleur des chapitres).
Usage : convertir_adm.py <cahier.pdf> <livre_anime_v4.html> <couverture_et_fin.html> <sortie.html>
Les éléments que le texte seul ne rend pas bien (schémas, formulaires, bail, rapports) deviennent des
images découpées dans le PDF, avec les réponses posées par-dessus."""
import re, sys, io, base64, html as H
import pdfplumber, pypdfium2
from PIL import Image

PDF, ANIM, COUV, OUT = sys.argv[1:5]
PROG = "#1B7A55"
S = 4 / 3                     # point PDF -> pixel de page (816 x 1056)
TOP, BAS = 50, 745            # en-tête et pied de page du PDF
# pages rendues en entier comme image (formulaires officiels, rapports, schémas pleine page)
PLEINE = {32, 33, 34, 35, 40, 41, 123, 146}

esc = lambda s: H.escape(s, quote=False)
fnt = lambda c: c["fontname"].split("+")[-1]

def col(c):
    v = c.get("non_stroking_color")
    if isinstance(v, (list, tuple)) and len(v) >= 3: return tuple(round(x, 2) for x in v[:3])
    if isinstance(v, (list, tuple)) and len(v) == 1: return (round(v[0], 2),) * 3
    return None

# ---------- réponses du livre animé ----------
anim = open(ANIM, encoding="utf-8").read()
SECT = {}
for m in re.finditer(r'<section class="page" data-n="(\d+)" style="--hot:(#[0-9A-Fa-f]+)"', anim):
    SECT[int(m.group(1))] = m.group(2)
REP = {}
P0 = [(m.start(), int(m.group(1))) for m in re.finditer(r'<section class="page" data-n="(\d+)"', anim)] + [(len(anim), 0)]
for (a, n), (b, _) in zip(P0, P0[1:]):
    L = []
    for m in re.finditer(r'<div class="ans reponse ([^"]*)" style="([^"]*)">([^<]*)</div>', anim[a:b]):
        cl, st, tx = m.group(1).split(), m.group(2), H.unescape(m.group(3))
        g = lambda k: float((re.search(k + r':(-?[\d.]+)px', st) or [0, 0])[1])
        L.append(dict(k=cl, x=g("left") / S, y=g("top") / S, w=g("width") / S, h=g("height") / S, t=tx, fs=g("font-size") / S))
    REP[n] = L

# ---------- rendu des images découpées ----------
PDFR = pypdfium2.PdfDocument(PDF)
def image(n, x0, y0, x1, y1, reps=(), cl=""):
    pg = PDFR[n - 1]; k = 2.6
    im = pg.render(scale=k).to_pil().convert("RGB")
    im = im.crop((int(x0 * k), int(y0 * k), int(x1 * k), int(y1 * k)))
    b = io.BytesIO(); im.save(b, "WEBP", quality=80)
    src = "data:image/webp;base64," + base64.b64encode(b.getvalue()).decode()
    w, h = x1 - x0, y1 - y0
    ov = ""
    for r in reps:
        if "hw" not in r["k"] or not r["t"].strip(): continue
        ov += ('<span class="ans reponse mp-sur%s" style="left:%.2f%%;top:%.2f%%;font-size:%.2fcqw">%s</span>'
               % (" fond" if "bg" in r["k"] else "", (r["x"] - x0) / w * 100, (r["y"] - y0) / h * 100, max(r["fs"], 7) / w * 100 * .82, esc(r["t"])))
    return '<div class="mp-fig%s" style="aspect-ratio:%.1f/%.1f"><img src="%s" alt="">%s</div>' % (cl, w, h, src, ov)

# ---------- texte d'une ligne avec gras / italique ----------
def runs(chars):
    out, cur, buf, prev = [], None, "", None
    for c in chars:
        t = c["text"]
        if t == "(cid:127)" or "cid:" in t: continue
        f = fnt(c)
        sty = "b" if ("Bold" in f or "Black" in f or "SemiBold" in f) and "Carlito" in f else ("i" if "Italic" in f else "")
        if prev is not None and c["x0"] - prev["x1"] > prev["size"] * .18: t = " " + t
        if sty != cur:
            if buf: out.append((cur, buf))
            cur, buf = sty, ""
        buf += t; prev = c
    if buf: out.append((cur, buf))
    s = ""
    for st, t in out:
        e = esc(t)
        if st == "b": s += "<b>%s</b>" % e
        elif st == "i": s += "<i>%s</i>" % e
        else: s += e
    return s.replace("</b><b>", "").replace("</i><i>", "").strip()

def lignes(p):
    L = []
    for l in p.extract_text_lines(return_chars=True, strip=True):
        if l["top"] < TOP or l["top"] > BAS: continue
        c = l["chars"][0]
        L.append(dict(top=l["top"], bot=l["bottom"], x0=l["x0"], x1=l["x1"], f=fnt(c), s=round(c["size"], 1),
                      c=col(c), t=l["text"], ch=l["chars"], used=False))
    return L

def dans(l, b, m=1.5):
    cy = (l["top"] + l["bot"]) / 2
    return b[0] - m <= l["x0"] and l["x1"] <= b[2] + m and b[1] - m <= cy <= b[3] + m

LABELS = [("TERRAIN", "mp-sit"), ("EXEMPLE", "mp-sit"), ("LE CAS", "mp-sit"), ("ATTENTION", "mp-sec"), ("DANGER", "mp-sec"),
          ("RETENIR", "mp-ret"), ("OBJECTIFS", "mp-ret"), ("LOI", "mp-loi"), ("SAVAIS", "mp-sav")]

# ---------- flux de texte : paragraphes, listes, titres ----------
def flux(L):
    h, i = "", 0
    sec = None
    while i < len(L):
        l = L[i]; f, s, t = l["f"], l["s"], l["t"]
        txt = runs(l["ch"])
        bullet = t.startswith(("(cid:127)", "•")) or l["ch"][0]["text"] in ("(cid:127)", "•") or "Symbol" in fnt(l["ch"][0])
        check = t.startswith("☐")
        if f.startswith("Poppins-Medium") and re.match(r"SECTION\s", t):
            sec = t.split(None, 1)[1]; i += 1; continue
        if f.startswith("Poppins-Bold") and s >= 17:
            h += '<h2 class="mp-h2">%s%s</h2>' % ("<i>%s</i>" % esc(sec) if sec else "", esc(t)); sec = None; i += 1; continue
        if f.startswith("Poppins-Bold") and re.match(r"(Tableau|Figure)\s", t):
            h += '<p class="mp-tabt">%s</p>' % esc(t); i += 1; continue
        if (f.startswith("Carlito-Bold") and s >= 10.8) or (f.startswith("Poppins") and s >= 11 and s < 17) or f.startswith("DejaVuSans-Bold"):
            h += '<h3 class="mp-h3">%s</h3>' % esc(t); i += 1; continue
        if bullet or check:
            items = []
            while i < len(L):
                l = L[i]; t2 = l["t"]
                b2 = t2.startswith(("(cid:127)", "•")) or l["ch"][0]["text"] in ("(cid:127)", "•") or "Symbol" in fnt(l["ch"][0])
                c2 = t2.startswith("☐")
                if b2 or c2:
                    x = runs(l["ch"])
                    if "Symbol" in fnt(l["ch"][0]): x = runs([c for c in l["ch"] if "Symbol" not in fnt(c)])
                    if c2: x = x.lstrip("☐").strip()
                    x = re.sub(r"^(•\s*)+", "", x)
                    items.append([x, l]); i += 1
                elif items and not l["f"].startswith(("Poppins", "DejaVu")) and ((l["x0"] > items[-1][1]["x0"] + 3 and l["top"] - items[-1][1]["bot"] < l["s"] * 1.2) or (l["x0"] >= items[-1][1]["x0"] - 1 and l["top"] - items[-1][1]["bot"] < l["s"] * .45)):
                    items[-1][0] += " " + runs(l["ch"]); items[-1][1] = dict(items[-1][1], bot=l["bot"]); i += 1
                else: break
            cls = "mp-coche" if check else ""
            h += '<ul class="%s">%s</ul>' % (cls, "".join("<li>%s</li>" % x for x, _ in items)); continue
        # paragraphe
        par = [txt]; last = l; i += 1
        while i < len(L):
            n = L[i]
            if n["f"].split("-")[0] != last["f"].split("-")[0] and not n["f"].startswith("Carlito"): break
            if n["t"].startswith(("(cid:127)", "☐", "•")) or n["f"].startswith(("Poppins", "DejaVu")): break
            if abs(n["s"] - last["s"]) > .6 or n["top"] - last["bot"] > last["s"] * .9 or abs(n["x0"] - l["x0"]) > 4: break
            par.append(runs(n["ch"])); last = n; i += 1
        cl = ' class="mp-petit"' if l["s"] < 9 else ""
        h += "<p%s>%s</p>" % (cl, " ".join(par))
    return h

def boite(L, b):
    lab = next((l for l in L if l["f"].startswith("DejaVuSans-Bold")), None)
    v = ""
    if lab:
        u = lab["t"].upper()
        for k, c in LABELS:
            if k in u: v = c; break
        L = [l for l in L if l is not lab]
        t = re.sub(r"^\W+\s*", "", lab["t"])
        return '<div class="mp-enc %s"><b class="t">%s</b>%s</div>' % (v, esc(t), flux(L))
    return '<div class="mp-enc">%s</div>' % flux(L)

def tableau(L, rows):
    hd = rows[0]; corps = rows[1:]
    hl = [l for l in L if hd["top"] - 1 <= (l["top"] + l["bot"]) / 2 <= hd["bottom"] + 1]
    # colonnes = débuts des mots de l'en-tête (écart > 14 pt)
    xs = []
    for l in hl:
        prev = None
        for c in l["ch"]:
            if prev is None or c["x0"] - prev["x1"] > 9: xs.append(c["x0"])
            prev = c
    xs = sorted(set(round(x) for x in xs))
    def coln(x):
        k = 0
        for j, c in enumerate(xs):
            if x >= c - 3: k = j
        return k
    def cells(lines, n):
        C = [""] * n
        for l in sorted(lines, key=lambda l: (l["top"], l["x0"])):
            seg, prev, cur = [], None, []
            for c in l["ch"]:
                if prev is not None and c["x0"] - prev["x1"] > 9 and coln(c["x0"]) != coln(prev["x0"]):
                    seg.append(cur); cur = []
                cur.append(c); prev = c
            if cur: seg.append(cur)
            for sg in seg:
                j = coln(sg[0]["x0"]); C[j] += (" " if C[j] else "") + runs(sg)
        return C
    n = len(xs) or 1
    th = cells(hl, n)
    tr = ""
    for r in corps:
        rl = [l for l in L if r["top"] - 1 <= (l["top"] + l["bot"]) / 2 <= r["bottom"] + 1]
        tr += "<tr>%s</tr>" % "".join("<td>%s</td>" % c for c in cells(rl, n))
    return '<table class="mp-tab"><thead><tr>%s</tr></thead><tbody>%s</tbody></table>' % ("".join("<th>%s</th>" % c for c in th), tr)

# ---------- quiz : questions, choix, réponses ----------
def quiz(L, reps, lig):
    out, qs, i = "", [], 0
    while i < len(L):
        l = L[i]
        if l["f"].startswith("Poppins-Bold") and re.fullmatch(r"\d+", l["t"]) and l["s"] <= 11:
            qs.append([l, []]); i += 1; continue
        if qs: qs[-1][1].append(l)
        else: out += flux([l])
        i += 1
    # rattacher le texte de la question qui commence juste au-dessus du numéro
    for k in range(len(qs) - 1, 0, -1):
        num = qs[k][0]
        avant = [l for l in qs[k - 1][1] if l["f"].startswith("Carlito-Bold") and l["s"] > 10 and num["top"] - 10 <= l["top"] <= num["top"] + 2]
        for l in avant:
            qs[k - 1][1].remove(l); qs[k][1].insert(0, l)
    if qs:
        num = qs[0][0]
        avant = [l for l in L if l not in qs[0][1] and l["f"].startswith("Carlito-Bold") and l["s"] > 10 and num["top"] - 10 <= l["top"] <= num["top"] + 2]
        for l in avant:
            qs[0][1].insert(0, l); out = out.replace("<p>%s</p>" % runs(l["ch"]), "")
    for k, (num, ls) in enumerate(qs):
        y0 = num["top"] - 10; y1 = qs[k + 1][0]["top"] - 10 if k + 1 < len(qs) else BAS
        rq = [r for r in reps if y0 <= r["y"] + r["h"] / 2 < y1]
        q, ch, mat, autre = "", [], [], []
        for l in ls:
            if l["t"].startswith("○") or " ○ " in l["t"]: ch.append(l)
            elif l["t"].startswith("____"): mat.append(l)
            elif l["f"].startswith("Carlito-Bold") and l["s"] > 10 and not ch and not mat: q += (" " if q else "") + runs(l["ch"])
            else: autre.append(l)
        h = '<div class="mp-q"><p class="mp-qq"><i class="mp-no">%s</i>%s</p>' % (num["t"], q)
        if ch:
            rings = [r for r in rq if "ring" in r["k"]]
            h += '<div class="mp-ch">'
            for l in ch:
                parts, cur = [], []
                for c in l["ch"]:
                    if c["text"] == "○":
                        if cur: parts.append(cur)
                        cur = [c]
                    else: cur.append(c)
                if cur: parts.append(cur)
                for pt in parts:
                    x0, x1 = pt[0]["x0"], pt[-1]["x1"]
                    bon = any(x0 - 6 <= r["x"] + r["w"] / 2 <= x1 + 6 and l["top"] - 6 <= r["y"] + r["h"] / 2 <= l["bot"] + 6 for r in rings)
                    t = runs([c for c in pt if c["text"] != "○"])
                    h += '<span%s>%s</span>' % (' class="reponse-choix ok"' if bon else "", t)
            h += "</div>"
        if mat:
            h += '<div class="mp-assoc">'
            for l in mat:
                r = next((r for r in rq if "hw" in r["k"] and abs(r["y"] + r["fs"] * .6 - (l["top"] + l["bot"]) / 2) < 9), None)
                t = runs(l["ch"]).replace("____", "", 1).strip()
                h += '<p><span class="blank">%s</span>%s</p>' % ('<span class="ans reponse">%s</span>' % esc(r["t"]) if r else "", t)
            h += "</div>"
        if autre: h += flux(autre)
        hw = [r for r in rq if "hw" in r["k"] and r["t"].strip() and not (mat and any(abs(r["y"] + r["fs"] * .6 - (l["top"] + l["bot"]) / 2) < 9 for l in mat))]
        nl = sum(1 for g in lig if y0 <= g <= y1)
        if hw or nl or (not ch and not mat):
            hw_txt = " ".join(esc(r["t"]) for r in hw if "ring" not in r["k"])
            hw_ok = [r for r in hw if not (ch and len(r["t"]) < 3)]
            nl = max(nl, 2 if not ch and not mat else 1)
            h += '<div class="mp-lig" style="height:%dpx">%s</div>' % (nl * 30, '<span class="ans reponse">%s</span>' % " ".join(esc(r["t"]) for r in hw_ok) if hw_ok else "")
        h += "</div>"
        out += h
    return out

# ---------- une page ----------
def page(p, n):
    L = lignes(p)
    reps = REP.get(n, [])
    hot = SECT.get(n, "#1971C2")
    # en-tête courant (chapitre et rubrique)
    head = [l for l in p.extract_text_lines() if l["top"] < 40]
    ht = head[0]["text"] if head else ""
    m = re.search(r"·\s*(\d+)\.\s*(.+?)\s+(THÉORIE|QUIZ|ACTIVITÉ|BAIL — EXERCICE)$", ht)
    chap, ctitre, rub = (int(m.group(1)), m.group(2).title(), m.group(3)) if m else (None, "", re.sub(r"^ADMINISTRATION D'UN BÂTIMENT\s*", "", ht))
    rects = [r for r in p.rects if r["width"] < 600 and TOP - 6 < r["top"] < BAS and r["bottom"] < BAS + 2]
    # tableaux : rangées de 504 pt empilées, la 1re (en-tête) foncée ou bleue
    pleins = sorted({(round(r["top"]), round(r["bottom"])): r for r in rects if abs(r["x0"] - 54) < 3 and abs(r["width"] - 504) < 4}.values(), key=lambda r: r["top"])
    tabs, boxes, i = [], [], 0
    while i < len(pleins):
        r = pleins[i]; c = col(r) or (1, 1, 1)
        fonce = sum(c) < 1.6 and 15 <= r["height"] <= 24
        if fonce:
            grp = [r]; j = i + 1
            while j < len(pleins) and pleins[j]["top"] - grp[-1]["bottom"] < 2.5:
                cj = col(pleins[j]) or (1, 1, 1)
                if sum(cj) < 1.6: break
                grp.append(pleins[j]); j += 1
            if len(grp) >= 2: tabs.append(grp); i = j; continue
        if r["height"] > 24 and sum(c) > 2.4 and c != (1.0, 1.0, 1.0): boxes.append(r)
        i += 1
    for r in rects:
        c = col(r) or (1, 1, 1)
        if r in pleins or r["width"] < 150 or r["height"] < 40 or sum(c) < 2.4 or c == (1.0, 1.0, 1.0): continue
        lab = [l for l in L if dans(l, (r["x0"], r["top"], r["x1"], r["bottom"])) and l["f"].startswith("DejaVuSans-Bold")]
        if lab and abs(lab[0]["top"] - r["top"]) < 25 and not any(abs(b["top"] - r["top"]) < 2 and abs(b["x0"] - r["x0"]) < 2 for b in boxes): boxes.append(r)
    zones = []        # (top, bottom, html, consommé)
    for g in tabs:
        b = (54, g[0]["top"], 558, g[-1]["bottom"])
        T = [l for l in L if dans(l, b)]
        for l in T: l["used"] = True
        # réponses écrites dans un tableau : image du tableau avec réponses
        rin = [r for r in reps if "hw" in r["k"] and b[1] - 4 <= r["y"] <= b[3]]
        corps_l = len({round(l["top"]) for l in T}) - 1
        img = rin or (len(g) == 2 and corps_l > 3)
        zones.append((b[1], b[3], image(n, 50, b[1] - 2, 562, b[3] + 2, rin) if img else tableau(T, g), 54, 558))
    for r in boxes:
        b = (r["x0"], r["top"], r["x1"], r["bottom"])
        T = [l for l in L if not l["used"] and dans(l, b)]
        if not T: continue
        for l in T: l["used"] = True
        zones.append((b[1], b[3], boite(T, b), b[0], b[2]))
    # en-tête de chapitre (CHAPITRE N) et de quiz / activité
    cl = next((dict(l, t=re.search(r"CHAPITRE \d+", l["t"]).group(0)) for l in L if l["top"] < 160 and re.search(r"CHAPITRE \d+", l["t"])), None)
    if cl:
        T = [l for l in L if not l["used"] and l["top"] < 250]
        tit = [l for l in T if l["f"].startswith(("Poppins-Bold", "InterDisplay")) and l["top"] < 200]
        titre = " ".join(re.sub(r"^\d+\s*", "", re.sub(r"CHAPITRE \d+", "", l["t"])).strip() for l in tit).strip()
        sous = next((l["t"] for l in T if l["f"].startswith("Carlito") and l["top"] < 240), "")
        for l in T: l["used"] = True
        ob = next((l for l in L if "OBJECTIFS" in l["t"]), None)
        zones.append((90, (ob["top"] - 4) if ob else 240, '<div class="mp-chap"><div class="mp-chapn">%s</div><div><div class="mp-chapl">%s</div><h1>%s</h1><p>%s</p></div></div>'
                      % (cl["t"].split()[1], esc(cl["t"]), esc(titre), esc(sous)), 54, 558))
    qh = next((l for l in L if re.match(r"(QUIZ ·|ACTIVITÉ PRATIQUE|FORMATIF)", l["t"]) and l["top"] < 130), None)
    if qh:
        T = [l for l in L if not l["used"] and l["top"] < 232]
        tit = next((l["t"] for l in T if l["f"].startswith("Poppins-Bold") and l["s"] >= 20), "")
        sous = next((runs(l["ch"]) for l in T if l["f"].startswith("Carlito") and l["top"] < 200), "")
        for l in T: l["used"] = True
        zones.append((qh["top"], 232, '<div class="mp-qhead"><div><div class="mp-chapl">%s</div><h1>%s</h1><p>%s</p></div><div class="mp-score">RÉSULTAT<b>____ /</b></div></div><div class="mp-nom"><span>Nom :</span><span>Groupe :</span><span>Date :</span></div>'
                      % (esc(qh["t"]), esc(tit), sous), 54, 558))
    # schémas : graphismes restants regroupés
    occ = [(z[0], z[1], z[3], z[4]) for z in zones]
    def libre(y0, y1, x0=0, x1=612): return not any(a - 2 <= y0 and y1 <= b + 2 and c - 4 <= x0 and x1 <= d + 4 for a, b, c, d in occ)
    gr = []
    for o in list(p.curves) + list(p.lines) + rects:
        x0, y0, x1, y1 = o["x0"], o["top"], o["x1"], o["bottom"]
        if y0 < TOP or y1 > BAS + 2 or not libre(y0, y1, x0, x1): continue
        if (x1 - x0) < 3 and (y1 - y0) < 3: continue
        if o.get("object_type") == "line" and (y1 - y0) < 1.5 and (x1 - x0) > 120: continue   # lignes d'écriture
        if (x1 - x0) > 500 and (y1 - y0) < 7: continue                                        # filets
        gr.append([x0, y0, x1, y1])
    # petites pastilles (SECTION, numéros de question) : ignorées
    def pastille(b):
        return (b[3] - b[1]) < 24 and any(dans(l, (b[0] - 2, b[1] - 2, b[2] + 2, b[3] + 2), 3) and (l["f"].startswith("Poppins") or l["s"] < 9) for l in L)
    gr = [g for g in gr if not pastille(g)]
    amas = []
    for g in sorted(gr, key=lambda g: g[1]):
        for a in amas:
            if g[0] < a[2] + 14 and g[2] > a[0] - 14 and g[1] < a[3] + 14 and g[3] > a[1] - 14:
                a[0], a[1], a[2], a[3] = min(a[0], g[0]), min(a[1], g[1]), max(a[2], g[2]), max(a[3], g[3]); a[4] += 1; break
        else: amas.append(g + [1])
    for _ in range(3):
        fus = []
        for a in amas:
            for f in fus:
                if a[0] < f[2] + 14 and a[2] > f[0] - 14 and a[1] < f[3] + 14 and a[3] > f[1] - 14:
                    f[0], f[1], f[2], f[3], f[4] = min(f[0], a[0]), min(f[1], a[1]), max(f[2], a[2]), max(f[3], a[3]), f[4] + a[4]; break
            else: fus.append(list(a))
        amas = fus
    for a in amas:
        if (a[2] - a[0]) < 50 or (a[3] - a[1]) < 30 or a[4] < 3: continue
        b = [a[0], a[1], a[2], a[3]]
        T = [l for l in L if not l["used"] and dans(l, b, 3)]
        for l in T:
            b[0], b[1], b[2], b[3] = min(b[0], l["x0"]), min(b[1], l["top"]), max(b[2], l["x1"]), max(b[3], l["bot"])
        T = [l for l in L if not l["used"] and dans(l, b, 3)]
        for l in T: l["used"] = True
        rin = [r for r in reps if b[0] - 6 <= r["x"] <= b[2] and b[1] - 6 <= r["y"] <= b[3]]
        for r in rin: r["pris"] = True
        zones.append((b[1], b[3], image(n, max(50, b[0] - 6), b[1] - 6, min(574, b[2] + 6), b[3] + 6, rin), b[0], b[2]))
    # lignes d'écriture (pour les quiz)
    lig = sorted({round(o["top"]) for o in p.lines if (o["bottom"] - o["top"]) < 1.5 and (o["x1"] - o["x0"]) > 120 and TOP < o["top"] < BAS})
    # flux du reste, en tranches entre les zones
    rest = [l for l in L if not l["used"]]
    estq = (bool(qh) or rub.startswith(("QUIZ", "FORMATIF"))) and any(l["f"].startswith("Poppins-Bold") and re.fullmatch(r"\d+", l["t"]) for l in rest)
    autres = [r for r in reps if not r.get("pris") and not any(z[0] - 4 <= r["y"] <= z[1] for z in zones)]
    zones.sort(key=lambda z: z[0])
    duo = []
    for z in zones:
        if duo and min(z[1], duo[-1][1]) - max(z[0], duo[-1][0]) > .5 * min(z[1] - z[0], duo[-1][1] - duo[-1][0]) and (z[3] >= duo[-1][4] - 10 or z[4] <= duo[-1][3] + 10):
            a = duo[-1]; g, d = (a, z) if a[3] <= z[3] else (z, a)
            fr = "%.0ffr %.0ffr" % (g[4] - g[3], d[4] - d[3])
            duo[-1] = (min(a[0], z[0]), max(a[1], z[1]), '<div class="mp-duo" style="grid-template-columns:%s">%s%s</div>' % (fr, g[2], d[2]), min(a[3], z[3]), max(a[4], z[4]))
        else: duo.append(z)
    zones = duo
    corps, k = "", 0
    bornes = [(z[0], z[1], z[2]) for z in zones] + [(9999, 9999, "")]
    y = 0
    for a, b, hz in bornes:
        seg = [l for l in rest if y <= l["top"] < a]
        if seg:
            corps += quiz(seg, [r for r in autres if y - 10 <= r["y"] < a], lig) if estq else flux(seg)
            # réponses écrites hors quiz (activités) : posées après le texte de leur tranche
            if not estq:
                hw = [r for r in autres if "hw" in r["k"] and r["t"].strip() and y <= r["y"] < a]
                if hw: corps += '<div class="mp-lig">%s</div>' % "".join('<span class="ans reponse">%s</span> ' % esc(r["t"]) for r in hw)
        corps += hz; y = b
    return chap, ctitre, rub, hot, corps

def partie(p, n):
    L = lignes(p)
    lettre = next((l["t"] for l in L if l["s"] > 100), "")
    tit = [l["t"] for l in L if l["f"].startswith("Poppins-Bold") and l["s"] > 30]
    sous = next((l["t"] for l in L if l["f"].startswith("Carlito") and l["s"] >= 11), "")
    ch = [re.sub(r"^(\d+)\s+", r"<b>\1</b> ", esc(l["t"])) for l in L if l["f"].startswith("Poppins-Bold") and l["s"] < 12 and re.match(r"\d+\s", l["t"])]
    return lettre, tit, sous, ch

pdf = pdfplumber.open(PDF)
NB = len(pdf.pages)
couv = open(COUV, encoding="utf-8").read()
Pc = [m.start() for m in re.finditer(r'<section class="page', couv)]
premiere = couv[Pc[0]:Pc[1]]
fin_i = Pc[-1]; fin = couv[fin_i:couv.find("</section>", fin_i) + 10]
LG = base64.b64encode(open("/home/claude/bibliotheque/img/metier-plus.svg", "rb").read()).decode()
pied = lambda nn: '<div class="mp-pied"><span>Administration d\'un bâtiment · DEP 5211 · 436-343</span><span class="n">%s</span><img src="data:image/svg+xml;base64,%s"></div>' % (nn, LG)
NCH = 13
pages = [premiere]
vu = set()
for n in range(2, NB + 1):
    p = pdf.pages[n - 1]
    txt = p.extract_text() or ""
    if "PARTIE" in txt[:80] and any(c["size"] > 150 for c in p.chars):
        lettre, tit, sous, ch = partie(p, n)
        hot = SECT.get(n, "#1971C2")
        pages.append('<section class="page mp adm mp-ouv" style="--mp-c:%s;--mp-p:%s"><h2 class="mod">Partie %s — %s</h2><i class="mpband"></i>'
                     '<div class="mp-bande"><span class="mp-avenir">IMAGE DE LA PARTIE À VENIR</span></div><div class="mp-mod">PARTIE %s</div><div class="mp-num">%s</div><div class="mp-dur"></div>'
                     '<div class="mp-bas"><h1>%s</h1><div class="mp-intro">%s</div><div class="mp-h3">Dans cette partie</div><ul class="mp-obj">%s</ul></div>%s</section>'
                     % (hot, PROG, lettre, esc(" ".join(tit)), lettre, lettre, "<br>".join(esc(t) for t in tit), esc(sous), "".join("<li>%s</li>" % c for c in ch), pied(n)))
        continue
    if n in PLEINE:
        head = [l for l in p.extract_text_lines() if l["top"] < 40]
        ht = head[0]["text"] if head else ""
        m = re.search(r"·\s*(\d+)\.\s*(.+?)\s+(THÉORIE|QUIZ|ACTIVITÉ|BAIL — EXERCICE)$", ht)
        chap, ctitre, rub = (int(m.group(1)), m.group(2).title(), m.group(3)) if m else (None, "", re.sub(r"^ADMINISTRATION D'UN BÂTIMENT\s*", "", ht))
        corps = image(n, 50, 52, 562, 744, REP.get(n, []), " plein")
        hot = SECT.get(n, "#1971C2")
    else:
        chap, ctitre, rub, hot, corps = page(p, n)
    mod = ""
    cle = chap if chap else rub.split()[0] if rub else ""
    if cle and cle not in vu:
        vu.add(cle)
        if chap: mod = '<h2 class="mod">Chapitre %d — %s</h2>' % (chap, esc(ctitre.capitalize()))
        elif rub in ("TABLE DES MATIÈRES",): mod = ""
        elif rub: mod = '<h2 class="mod">%s</h2>' % esc(rub.capitalize())
    seg = "".join('<i class="%s"></i>' % ("cur" if chap == k else "on" if (chap or 99) > k else "") for k in range(1, NCH + 1))
    gauche = "<b>Chapitre %d</b> · %s" % (chap, esc(ctitre)) if chap else "<b>%s</b>" % esc(rub.capitalize())
    pages.append('<section class="page mp adm" style="--mp-c:%s;--mp-p:%s">%s<i class="mpband"></i><div class="mp-etapes">%s</div><div class="mp-tete"><span>%s</span><span>%s</span></div><div class="body">%s</div>%s</section>'
                 % (hot, PROG, mod, seg, gauche, esc(rub.title() if chap else ""), corps, pied(n)))
    print(n, end=" ", flush=True)
pages.append(fin)
F = lambda nm: base64.b64encode(open("/tmp/cvr/%s.woff" % nm, "rb").read()).decode()
fonts = "".join("@font-face{font-family:%s;src:url(data:font/woff;base64,%s) format('woff')}" % (nm, F(nm)) for nm in ["MPI5", "MPI6", "MPI8", "MPD9"])
css = open("/home/claude/bibliotheque/format/livre-mp.css").read()
base = ("@page{size:8.5in 11in;margin:0}*{box-sizing:border-box}html,body{margin:0;padding:0}"
        "body{font-family:MPI5,Inter,sans-serif;color:#1e2a33}.page{width:8.5in;height:11in;position:relative;overflow:hidden;page-break-after:always;background:#fff}h2.mod{display:none}")
doc = ('<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
       '<title>Administration d\'un bâtiment</title><style>%s</style><style id="mp-format">%s%s</style></head><body class="web">%s</body></html>'
       % (base, fonts, css, "\n".join(pages)))
open(OUT, "w", encoding="utf-8").write(doc)
print("\nok", len(pages), "pages")
