/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — plans.js (sorti d'index.html le 15 nov.) */
(() => {
  // ---------- Plans techniques : visionneuse pour tableau interactif ----------
  const $ = id => document.getElementById(id);
  const ov = $("planOv"), stage = $("plStage"), world = $("plWorld"), cv = $("plCanvas"), ink = $("plInk");
  const NS = "http://www.w3.org/2000/svg";
  let plan = null;           // { id, name, type, pages }
  let page = 1, W = 0, H = 0;
  let s = 1, tx = 0, ty = 0, rot = 0; // vue : échelle, translation, rotation (0, 90, 180, 270)
  let tool = "pan", color = "#e2183d";
  let notes = { items: [], cal: null }; // annotations de la page courante
  let hist = [];
  let pdfDoc = null, pxParMmPapier = 0;
  const UNIT = { mm: 1, m: 0.001, po: 1 / 25.4, pi: 1 / 304.8 };

  // ---------- Stockage (IndexedDB) ----------
  let dbp = null;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise(res => {
      try {
        const r = indexedDB.open("plans-atelier", 1);
        r.onupgradeneeded = () => { const d = r.result; d.createObjectStore("files", { keyPath: "id" }); d.createObjectStore("notes"); };
        r.onsuccess = () => res(r.result); r.onerror = () => res(null);
      } catch (e) { res(null); }
    });
    return dbp;
  }
  async function idb(store, mode, fn) {
    const d = await db(); if (!d) return null;
    return new Promise(res => { try { const t = d.transaction(store, mode), st = t.objectStore(store); const rq = fn(st); t.oncomplete = () => res(rq && rq.result); t.onerror = () => res(null); } catch (e) { res(null); } });
  }
  const getAll = () => idb("files", "readonly", st => st.getAll());
  const putFile = f => idb("files", "readwrite", st => st.put(f));
  const delFile = id => idb("files", "readwrite", st => st.delete(id));
  const getNotes = k => idb("notes", "readonly", st => st.get(k));
  const putNotes = (k, v) => idb("notes", "readwrite", st => st.put(v, k));
  const noteKey = () => plan ? plan.id + ":" + page : "";
  let saveT;
  function saveNotes() { clearTimeout(saveT); saveT = setTimeout(() => { if (plan) putNotes(noteKey(), JSON.parse(JSON.stringify(notes))); }, 300); }

  // ---------- Ouvrir / fermer ----------
  async function ouvrir() {
    ov.hidden = false;
    if (!plan) showEmpty();
  }
  function fermer() {
    if (document.fullscreenElement === ov) document.exitFullscreen().catch(() => {});   /* seulement le plein écran du plan lui-même */
    ov.hidden = true; $("plMenu").hidden = true;
  }
  async function showEmpty() {
    $("plEmpty").hidden = false; world.hidden = true; $("plBar").hidden = true; $("plPages").hidden = true; $("plSepP").hidden = true; $("plTitle").textContent = "";
    const box = $("plRecents"); box.innerHTML = "";
    const all = ((await getAll()) || []).sort((a, b) => b.used - a.used).slice(0, 12);
    $("plRecRow").hidden = !all.length;
    all.forEach(f => {
      const r = document.createElement("div"); r.className = "pl-rec";
      const b = document.createElement("button"); b.type = "button"; b.textContent = f.name;
      const sm = document.createElement("small"); sm.textContent = new Date(f.used).toLocaleDateString("fr-CA", { day: "numeric", month: "long" }); b.append(sm);
      b.onclick = () => charger(f);
      const x = document.createElement("button"); x.type = "button"; x.className = "x"; x.textContent = "✕"; x.setAttribute("aria-label", "Retirer " + f.name + " des plans récents");
      x.onclick = async () => { await delFile(f.id); showEmpty(); };
      r.append(b, x); box.append(r);
    });
  }

  // ---------- Fichiers ----------
  async function fichier(file) {
    if (!file) return;
    const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
    if (!isPdf && !file.type.startsWith("image/")) { hint("Ce fichier n'est pas un PDF ni une image."); return; }
    const f = { id: "p" + Date.now().toString(36), name: file.name.replace(/\.[^.]+$/, ""), type: isPdf ? "pdf" : "img", blob: file, used: Date.now() };
    await putFile(f);
    charger(f);
  }
  async function charger(f) {
    plan = f; f.used = Date.now(); putFile(f);
    $("plEmpty").hidden = true; $("plLoad").hidden = false; $("plMenu").hidden = true;
    pdfDoc = null; plan.pages = 1;
    try {
      if (f.type === "pdf") {
        await pdfjs();
        const buf = await f.blob.arrayBuffer();
        pdfDoc = await window.pdfjsLib.getDocument({ data: buf }).promise;
        plan.pages = pdfDoc.numPages;
      }
      await afficherPage(1);
    } catch (e) {
      $("plLoad").hidden = true; plan = null; showEmpty();
      hint(f.type === "pdf" ? "Impossible d'ouvrir ce PDF. Essaie de l'exporter en image (PNG ou JPG)." : "Impossible d'ouvrir cette image.");
    }
  }
  function pdfjs() {
    if (window.pdfjsLib && window.pdfjsWorker) return Promise.resolve();
    const load = src => new Promise((ok, ko) => { const sc = document.createElement("script"); sc.src = src; sc.onload = ok; sc.onerror = ko; document.head.append(sc); });
    const base = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";
    return load(base + "pdf.min.js").then(() => load(base + "pdf.worker.min.js")).then(() => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = base + "pdf.worker.min.js";
    });
  }
  async function afficherPage(n) {
    page = n; $("plLoad").hidden = false;
    const ctx = cv.getContext("2d");
    if (plan.type === "pdf") {
      const pg = await pdfDoc.getPage(n);
      const v1 = pg.getViewport({ scale: 1 });
      const sc = Math.min(4, 3200 / Math.max(v1.width, v1.height));
      const vp = pg.getViewport({ scale: sc });
      pxParMmPapier = sc * 72 / 25.4;
      cv.width = Math.round(vp.width); cv.height = Math.round(vp.height);
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height);
      await pg.render({ canvasContext: ctx, viewport: vp }).promise;
    } else {
      pxParMmPapier = plan.ppp ? plan.ppp / 25.4 : 0;
      const url = URL.createObjectURL(plan.blob);
      const img = await new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = ko; i.src = url; });
      const k = Math.min(1, 6000 / Math.max(img.naturalWidth, img.naturalHeight));
      cv.width = Math.round(img.naturalWidth * k); cv.height = Math.round(img.naturalHeight * k);
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.drawImage(img, 0, 0, cv.width, cv.height); URL.revokeObjectURL(url);
    }
    W = cv.width; H = cv.height;
    ink.setAttribute("width", W); ink.setAttribute("height", H); ink.setAttribute("viewBox", `0 0 ${W} ${H}`);
    notes = (await getNotes(noteKey())) || { items: [], cal: null };
    if (!notes.items) notes.items = [];
    rot = notes.rot || 0; hist = [];
    world.hidden = false; $("plBar").hidden = false; $("plLoad").hidden = true;
    $("plTitle").innerHTML = ""; $("plTitle").append(plan.name);
    titreEchelle();
    $("plPages").hidden = plan.pages < 2; $("plSepP").hidden = plan.pages < 2; $("plPageLbl").textContent = page; $("plPageTot").textContent = "/ " + plan.pages;
    $("plPrev").disabled = page <= 1; $("plNext").disabled = page >= plan.pages;
    dessiner(); ajuster();
  }

  // ---------- Vue (zoom, déplacement, rotation) ----------
  const R = () => { const a = rot * Math.PI / 180; return [Math.cos(a), Math.sin(a)]; };
  function appliquer() {
    world.style.transform = `translate(${tx}px,${ty}px) scale(${s}) rotate(${rot}deg)`;
    $("plFit").textContent = Math.round(s * 100) + " %";
    ink.querySelectorAll("text").forEach(t => t.setAttribute("font-size", (22 / s).toFixed(2)));
    ink.querySelectorAll("rect.lb").forEach(r => majEtiquette(r));
  }
  function versPlan(x, y) {
    const r = stage.getBoundingClientRect(), [c, sn] = R();
    const X = (x - r.left - tx) / s, Y = (y - r.top - ty) / s;
    return [c * X + sn * Y, -sn * X + c * Y];
  }
  function versEcran(px, py) { const [c, sn] = R(); return [tx + s * (c * px - sn * py), ty + s * (sn * px + c * py)]; }
  function ajuster() {
    const r = stage.getBoundingClientRect(), side = rot % 180 !== 0;
    const w = side ? H : W, h = side ? W : H;
    const top = 80, bottom = 110;
    s = Math.min((r.width - 40) / w, (r.height - top - bottom) / h);
    const [cxs, cys] = [r.width / 2, top + (r.height - top - bottom) / 2];
    const [c, sn] = R(); tx = cxs - s * (c * W / 2 - sn * H / 2); ty = cys - s * (sn * W / 2 + c * H / 2);
    appliquer();
  }
  function zoomAutour(f, x, y) {
    const r = stage.getBoundingClientRect(); const [px, py] = versPlan(x, y);
    s = Math.max(0.05, Math.min(20, s * f));
    const [ex, ey] = versEcran(px, py); tx += x - r.left - ex; ty += y - r.top - ey; appliquer();
  }

  // ---------- Annotations ----------
  const largeur = it => it.t === "hl" ? 22 : it.t === "pen" ? 4 : 3;
  function chemin(pts) { return pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" "); }
  function texteMesure(it) {
    const d = Math.hypot(it.p[1][0] - it.p[0][0], it.p[1][1] - it.p[0][1]);
    if (!notes.cal) return "?";
    const v = d * notes.cal.len / notes.cal.px, u = notes.cal.unit;
    return (u === "m" ? v.toFixed(2) : u === "mm" ? Math.round(v).toLocaleString("fr-CA") : v.toFixed(1)) + " " + u;
  }
  function majEtiquette(rect) {
    const t = rect.nextSibling; if (!t) return;
    try { const b = t.getBBox(); const pad = 6 / s; rect.setAttribute("x", b.x - pad); rect.setAttribute("y", b.y - pad); rect.setAttribute("width", b.width + 2 * pad); rect.setAttribute("height", b.height + 2 * pad); rect.setAttribute("rx", 6 / s); } catch (e) {}
  }
  function element(it, idx) {
    const g = document.createElementNS(NS, "g"); g.dataset.i = idx;
    if (it.t === "pen" || it.t === "hl") {
      const p = document.createElementNS(NS, "path"); p.setAttribute("d", chemin(it.p)); p.setAttribute("fill", "none");
      p.setAttribute("stroke", it.t === "hl" ? "#ffe14a" : it.c); p.setAttribute("stroke-width", largeur(it)); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round");
      p.setAttribute("vector-effect", "non-scaling-stroke"); if (it.t === "hl") p.setAttribute("stroke-opacity", ".45");
      p.setAttribute("class", "it"); g.append(p);
    } else if (it.t === "meas" || it.t === "cal") {
      const [[x1, y1], [x2, y2]] = it.p;
      const l = document.createElementNS(NS, "line"); [["x1", x1], ["y1", y1], ["x2", x2], ["y2", y2]].forEach(([k, v]) => l.setAttribute(k, v));
      l.setAttribute("stroke", it.t === "cal" ? "#ff9f1a" : it.c); l.setAttribute("stroke-width", 4); l.setAttribute("vector-effect", "non-scaling-stroke"); l.setAttribute("class", "it");
      if (it.t === "cal") l.setAttribute("stroke-dasharray", "10 6");
      g.append(l);
      [[x1, y1], [x2, y2]].forEach(([x, y]) => { const c = document.createElementNS(NS, "circle"); c.setAttribute("cx", x); c.setAttribute("cy", y); c.setAttribute("r", 7 / s); c.setAttribute("fill", it.t === "cal" ? "#ff9f1a" : it.c); c.setAttribute("class", "it"); g.append(c); });
      if (it.t === "meas") {
        const rc = document.createElementNS(NS, "rect"); rc.setAttribute("class", "lb"); rc.setAttribute("fill", "#111"); rc.setAttribute("fill-opacity", ".85");
        const tx_ = document.createElementNS(NS, "text"); tx_.setAttribute("x", (x1 + x2) / 2); tx_.setAttribute("y", (y1 + y2) / 2); tx_.setAttribute("text-anchor", "middle"); tx_.setAttribute("dominant-baseline", "central");
        tx_.setAttribute("fill", "#fff"); tx_.setAttribute("font-weight", "700"); tx_.setAttribute("font-family", "Segoe UI, Roboto, Arial, sans-serif"); tx_.setAttribute("font-size", (22 / s).toFixed(2));
        tx_.setAttribute("transform", `rotate(${-rot} ${(x1 + x2) / 2} ${(y1 + y2) / 2})`);
        tx_.textContent = texteMesure(it); g.append(rc, tx_);
      }
    }
    return g;
  }
  function dessiner() {
    ink.innerHTML = "";
    notes.items.forEach((it, i) => ink.append(element(it, i)));
    ink.querySelectorAll("rect.lb").forEach(r => majEtiquette(r));
  }
  function ajouter(it) { notes.items.push(it); hist.push({ op: "add" }); dessiner(); saveNotes(); }

  // ---------- Pointeurs : 1 doigt = outil, 2 doigts = zoom ----------
  const pts = new Map(); let geste = null, trait = null, ligne = null;
  stage.addEventListener("pointerdown", e => {
    if (world.hidden) return;
    stage.setPointerCapture(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]);
    $("plMenu").hidden = true;
    if (pts.size === 2) {
      trait = null; ligne = null; dessiner();
      const [a, b] = [...pts.values()];
      geste = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), m: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], s, tx, ty };
      return;
    }
    if (pts.size > 2) return;
    const [px, py] = versPlan(e.clientX, e.clientY);
    if (tool === "pen" || tool === "hl") { trait = { t: tool, c: color, p: [[px, py]] }; }
    else if (tool === "meas" || tool === "cal") { ligne = { t: tool, c: color, p: [[px, py], [px, py]] }; }
    else if (tool === "erase") { effacer(e); }
    else geste = { pan: true, x: e.clientX, y: e.clientY, tx, ty };
  });
  stage.addEventListener("pointermove", e => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, [e.clientX, e.clientY]);
    if (pts.size === 2 && geste && geste.d) {
      const [a, b] = [...pts.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]), m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const r = stage.getBoundingClientRect();
      // point du plan sous le milieu initial
      const s0 = geste.s, [c, sn] = R(); const X = (geste.m[0] - r.left - geste.tx) / s0, Y = (geste.m[1] - r.top - geste.ty) / s0; const px = c * X + sn * Y, py = -sn * X + c * Y;
      s = Math.max(0.05, Math.min(20, s0 * d / geste.d));
      tx = m[0] - r.left - s * (c * px - sn * py); ty = m[1] - r.top - s * (sn * px + c * py); appliquer();
      return;
    }
    if (geste && geste.pan) { tx = geste.tx + e.clientX - geste.x; ty = geste.ty + e.clientY - geste.y; appliquer(); return; }
    const [px, py] = versPlan(e.clientX, e.clientY);
    if (trait) { trait.p.push([px, py]); apercu(trait); }
    else if (ligne) { ligne.p[1] = [px, py]; apercu(ligne); }
    else if (tool === "erase" && e.buttons) effacer(e);
  });
  function fin(e) {
    pts.delete(e.pointerId);
    if (pts.size < 2 && geste && geste.d) geste = null;
    if (pts.size) return;
    geste = null;
    if (trait) { if (trait.p.length > 1) ajouter(trait); else dessiner(); trait = null; }
    if (ligne) {
      const l = ligne; ligne = null;
      const long = Math.hypot(l.p[1][0] - l.p[0][0], l.p[1][1] - l.p[0][1]) * s;
      if (long < 12) { dessiner(); return; }
      if (l.t === "cal") { calEnCours = l; dessiner(); ink.append(element(l, -1)); $("plDlg").hidden = false; $("plCalVal").value = ""; setTimeout(() => $("plCalVal").focus(), 50); }
      else { ajouter(l); if (!notes.cal) { hint("Choisis d'abord l'échelle du plan pour voir les vraies mesures."); ouvrirEchelle(); } }
    }
  }
  stage.addEventListener("pointerup", fin); stage.addEventListener("pointercancel", fin);
  let apercuEl = null;
  function apercu(it) { if (apercuEl) apercuEl.remove(); apercuEl = element(it, -1); ink.append(apercuEl); }
  function effacer(e) {
    const el = document.elementFromPoint(e.clientX, e.clientY); const g = el && el.closest && el.closest("#plInk g");
    if (!g || g.dataset.i < 0) return;
    const i = +g.dataset.i, it = notes.items[i]; if (!it) return;
    notes.items.splice(i, 1); hist.push({ op: "del", it, i }); dessiner(); saveNotes();
  }
  stage.addEventListener("wheel", e => { if (world.hidden) return; e.preventDefault(); zoomAutour(Math.exp(-e.deltaY * 0.0015), e.clientX, e.clientY); }, { passive: false });
  stage.addEventListener("dblclick", e => { if (tool === "pan" && !world.hidden) zoomAutour(2, e.clientX, e.clientY); });

  // ---------- Étalonnage ----------
  function titreEchelle() {
    $("plTitle").innerHTML = ""; $("plTitle").append(plan.name);
    if (notes.cal) { const sm = document.createElement("small"); sm.textContent = notes.cal.ratio ? "échelle " + (notes.cal.ratio === 48 ? "1/4 po = 1 pi" : notes.cal.ratio === 96 ? "1/8 po = 1 pi" : "1:" + notes.cal.ratio) : "échelle étalonnée"; $("plTitle").append(sm); }
  }
  function ouvrirEchelle() {
    if (!plan) return;
    const pdf = pxParMmPapier > 0;
    $("plRatio").parentNode.hidden = !pdf; $("plScaleOk").hidden = !pdf; $("plScaleTrace").classList.toggle("ok", !pdf);
    $("plScaleTxt").textContent = pdf ? "Choisis l'échelle inscrite dans le cartouche du plan. Les mesures s'afficheront ensuite en vraies grandeurs." : "Pour une image, l'échelle se trouve en traçant un trait sur une cote connue du plan.";
    if (notes.cal && notes.cal.ratio) $("plRatio").value = String(notes.cal.ratio);
    if (notes.cal) $("plRatioUnit").value = notes.cal.unit;
    $("plScaleDlg").hidden = false;
  }
  $("plScaleNo").onclick = () => $("plScaleDlg").hidden = true;
  $("plScaleTrace").onclick = () => { $("plScaleDlg").hidden = true; outil("cal"); hint("Trace un trait sur une cote connue du plan (par exemple un mur de 3 600 mm)."); };
  $("plScaleOk").onclick = () => {
    const r = +$("plRatio").value, u = $("plRatioUnit").value;
    // 1 mm sur le papier = r mm en réalité
    notes.cal = { px: pxParMmPapier, len: r * UNIT[u], unit: u, ratio: r };
    $("plScaleDlg").hidden = true; outil("meas"); dessiner(); saveNotes(); titreEchelle();
    hint("Échelle appliquée. Trace tes mesures avec l'outil Mesurer.");
  };
  let calEnCours = null;
  function calValider() {
    const v = parseFloat(($("plCalVal").value || "").replace(",", ".").replace(/\s/g, ""));
    if (!calEnCours || !(v > 0)) { $("plCalVal").focus(); return; }
    const [[x1, y1], [x2, y2]] = calEnCours.p;
    notes.cal = { px: Math.hypot(x2 - x1, y2 - y1), len: v, unit: $("plCalUnit").value };
    calEnCours = null; $("plDlg").hidden = true; outil("meas"); dessiner(); saveNotes();
    titreEchelle();
    hint("Échelle enregistrée. Trace maintenant tes mesures.");
  }
  $("plCalOk").onclick = calValider;
  $("plCalVal").addEventListener("keydown", e => { if (e.key === "Enter") calValider(); });
  $("plCalNo").onclick = () => { calEnCours = null; $("plDlg").hidden = true; dessiner(); outil("pan"); };

  // ---------- Barre d'outils ----------
  function outil(t) {
    tool = t; stage.className = "pl-stage tool-" + t;
    document.querySelectorAll("#plBar [data-tool]").forEach(b => b.classList.toggle("on", b.dataset.tool === t));
  }
  document.querySelectorAll("#plBar [data-tool]").forEach(b => b.onclick = () => outil(b.dataset.tool));
  document.querySelectorAll("#plBar .pl-sw").forEach(b => b.onclick = () => {
    color = b.dataset.c; document.querySelectorAll("#plBar .pl-sw").forEach(x => x.classList.toggle("on", x === b));
    if (tool === "pan" || tool === "erase") outil("pen");
  });
  $("plUndo").onclick = () => {
    const h = hist.pop(); if (!h) return;
    if (h.op === "add") notes.items.pop(); else notes.items.splice(h.i, 0, h.it);
    dessiner(); saveNotes();
  };
  const centre = () => { const r = stage.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  $("plZi").onclick = () => zoomAutour(1.4, ...centre());
  $("plZo").onclick = () => zoomAutour(1 / 1.4, ...centre());
  $("plFit").onclick = ajuster;
  $("plFull").onclick = () => { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); else if (ov.requestFullscreen) ov.requestFullscreen().catch(() => {}); };
  $("plPrev").onclick = () => { if (page > 1) afficherPage(page - 1); };
  $("plNext").onclick = () => { if (plan && page < plan.pages) afficherPage(page + 1); };

  // ---------- Menu Plus ----------
  $("plMoreBtn").onclick = e => { e.stopPropagation(); const m = $("plMenu"); m.hidden = !m.hidden; $("plMoreBtn").setAttribute("aria-expanded", !m.hidden); };
  $("plmAccueil").onclick = () => retourPlans();
  $("plmOpen").onclick = () => { $("plMenu").hidden = true; $("plFile").click(); };
  $("plmCal").onclick = () => { $("plMenu").hidden = true; ouvrirEchelle(); };
  $("plmRot").onclick = () => { $("plMenu").hidden = true; if (!plan) return; rot = (rot + 90) % 360; notes.rot = rot; saveNotes(); dessiner(); ajuster(); };
  $("plmClear").onclick = () => { $("plMenu").hidden = true; if (!plan || !notes.items.length) return; hist.push({ op: "clear", items: notes.items }); notes.items = []; dessiner(); saveNotes(); hint("Annotations effacées. « Annuler » les remet."); };
  // « Annuler » sait aussi remettre un effacement complet
  const undoBase = $("plUndo").onclick;
  $("plUndo").onclick = () => { const h = hist[hist.length - 1]; if (h && h.op === "clear") { hist.pop(); notes.items = h.items; dessiner(); saveNotes(); return; } undoBase(); };
  $("plmSave").onclick = async () => {
    $("plMenu").hidden = true; if (!plan) return;
    try {
      const out = document.createElement("canvas"); out.width = W; out.height = H; const c = out.getContext("2d"); c.drawImage(cv, 0, 0);
      const clone = ink.cloneNode(true); clone.querySelectorAll("[vector-effect]").forEach(n => { const k = Math.max(W, H) / 1600; n.removeAttribute("vector-effect"); n.setAttribute("stroke-width", (parseFloat(n.getAttribute("stroke-width")) || 3) * k); });
      clone.querySelectorAll("text").forEach(t => t.setAttribute("font-size", Math.max(W, H) / 60));
      const svgUrl = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" }));
      const im = await new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = ko; i.src = svgUrl; });
      c.drawImage(im, 0, 0, W, H); URL.revokeObjectURL(svgUrl);
      const blob = await new Promise(ok => out.toBlob(ok, "image/png"));
      const nom = plan.name + (plan.pages > 1 ? " - page " + page : "") + " - annoté.png";
      let fait = false;
      try { const dl = window.claude && await window.claude.use("downloads"); if (dl) { await dl.save({ filename: nom, data: blob }); fait = true; } } catch (e) { fait = false; }
      if (!fait) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = nom; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
      hint("Image enregistrée : " + nom);
    } catch (e) { hint("L'image n'a pas pu être enregistrée."); }
  };
  document.addEventListener("click", e => { if (!$("plMenu").hidden && !e.target.closest("#plMenu, #plMoreBtn")) $("plMenu").hidden = true; });

  // ---------- Divers ----------
  let hintT;
  function hint(t) { const h = $("plHint"); h.textContent = t; h.hidden = false; clearTimeout(hintT); hintT = setTimeout(() => h.hidden = true, 4500); }
  $("plOpenBig").onclick = () => $("plFile").click();
  // Dossiers de plans d'exercice intégrés (PDF de 10 feuilles)
  const DOSSIERS = { 1: "Maison unifamiliale", 2: "Duplex jumelé", 3: "Bâtiment commercial", 4: "Centre commercial", 5: "Ferme laitière" };
  const b64blob = (id, type) => { const bin = atob(document.getElementById(id).textContent.trim()); return new Blob([Uint8Array.from(bin, ch => ch.charCodeAt(0))], { type }); };
  const fichierDossier = async (n, ext, type) => {
    if (document.getElementById("plDossier" + n + (ext === "png" ? "Img" : ""))) return b64blob("plDossier" + n + (ext === "png" ? "Img" : ""), type);
    const r = await fetch(`plans/dossier-${n}.${ext}`); if (!r.ok) throw new Error("fichier introuvable"); return r.blob();
  };
  document.querySelectorAll(".pl-ex[data-ex]").forEach(b => b.onclick = async () => {
    const n = b.dataset.ex, nom = `Dossier ${n} · ${DOSSIERS[n]}`;
    let blob; try { blob = await fichierDossier(n, "pdf", "application/pdf"); } catch (e) { hint("Le dossier n'a pas pu être téléchargé. Vérifie la connexion Internet."); return; }
    const f = { id: "dossier" + n, name: nom, type: "pdf", blob, used: Date.now() };
    await putFile(f); await charger(f);
    // Si les PDF ne peuvent pas être lus sur cet ordinateur, on ouvre le plan du rez-de-chaussée en image
    if (!plan) {
      let ib; try { ib = await fichierDossier(n, "png", "image/png"); } catch (e) { return; }
      const im = { id: "dossier" + n, ppp: 100, name: nom + " (A-101)", type: "img", blob: ib, used: Date.now() };
      await putFile(im); await charger(im); $("plHint").hidden = true;
    }
  });
  $("plFile").onchange = e => { fichier(e.target.files[0]); e.target.value = ""; };
  ov.addEventListener("dragover", e => { e.preventDefault(); ov.classList.add("over"); });
  ov.addEventListener("dragleave", () => ov.classList.remove("over"));
  ov.addEventListener("drop", e => { e.preventDefault(); ov.classList.remove("over"); fichier(e.dataTransfer.files[0]); });
  /* Bouton de gauche : avec un plan ouvert, il ramène à l'écran d'accueil des plans; sur l'accueil des plans, à la bibliothèque */
  function retourPlans(){
    if (plan){ clearTimeout(saveT); try { putNotes(noteKey(), JSON.parse(JSON.stringify(notes))); } catch(e){} }
    plan = null; $("plMenu").hidden = true; showEmpty();
  }
  const majRetour = () => { const accueil = !$("plEmpty").hidden, b = $("plClose");
    b.querySelector(".pl-lbl").textContent = accueil ? "Bibliothèque" : window.RETOUR_ACTIVITES ? "Formatifs" : "Tous les plans";
    b.setAttribute("aria-label", accueil ? "Retour à la bibliothèque" : window.RETOUR_ACTIVITES ? "Retour aux formatifs" : "Retour à l'accueil des plans"); b.title = b.getAttribute("aria-label"); };
  new MutationObserver(majRetour).observe($("plEmpty"), { attributes:true, attributeFilter:["hidden"] }); majRetour();
  $("plClose").onclick = () => { if ($("plEmpty").hidden && plan && !window.RETOUR_ACTIVITES) retourPlans(); else fermer(); };
  document.addEventListener("keydown", e => {
    if (ov.hidden) return;
    if (!$("plDlg").hidden) { if (e.key === "Escape") $("plCalNo").click(); return; }
    if (!$("plScaleDlg").hidden) { if (e.key === "Escape") $("plScaleDlg").hidden = true; return; }
    if (e.key === "Escape") { if (!$("plMenu").hidden) $("plMenu").hidden = true; else if ($("plEmpty").hidden && plan) retourPlans(); else fermer(); }
    else if (e.key === "+" || e.key === "=") $("plZi").click();
    else if (e.key === "-") $("plZo").click();
    else if (e.key === "0") ajuster();
    else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") $("plUndo").click();
    else if (e.key === "ArrowRight" || e.key === "PageDown") $("plNext").click();
    else if (e.key === "ArrowLeft" || e.key === "PageUp") $("plPrev").click();
  });
  addEventListener("resize", () => { if (!ov.hidden && plan) ajuster(); });
  document.addEventListener("fullscreenchange", () => { if (!ov.hidden && plan) setTimeout(ajuster, 100); });
  const btn = $("planBtn"); if (btn) btn.addEventListener("click", ouvrir);
  window.__plans = { charger, fichier, outil, versPlan, state: () => ({ s, tx, ty, W, H, notes }) };
})();
