/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — demande de soumission en PDF à remplir (26 nov.)
   Jeremy : « le PDF est modifiable et tout s'additionne pour le fournisseur ? »
   Le fournisseur tape ses prix unitaires (et ses coordonnées); les totaux de ligne, le sous-total, la TPS, la TVQ et le total
   se calculent dans le PDF (Adobe Reader, Acrobat, Edge). Bibliothèque : pdf-lib 1.17.1 (licence MIT), js/vendor/pdf-lib.min.js,
   chargée seulement au clic. */
window.SoumissionPDF = (function(){
  let charge = null;
  const lib = () => charge || (charge = new Promise((ok, non) => { if (window.PDFLib) return ok(window.PDFLib);
    const s = document.createElement("script"); s.src = "js/vendor/pdf-lib.min.js"; s.onload = () => ok(window.PDFLib); s.onerror = () => non(new Error("bibliothèque PDF introuvable")); document.head.appendChild(s); }));
  const octets = async u => { try { const r = await fetch(u); return r.ok ? new Uint8Array(await r.arrayBuffer()) : null; } catch(e){ return null; } };

  /* A : [{ nom, q }], o : { no, date, signature:[lignes], photo:url|null, logo:url } → Blob PDF */
  async function creer(A, o){
    const { PDFDocument, StandardFonts, rgb, PDFName, PDFString } = await lib();
    const doc = await PDFDocument.create(), f = await doc.embedFont(StandardFonts.Helvetica), fb = await doc.embedFont(StandardFonts.HelveticaBold), fi = await doc.embedFont(StandardFonts.HelveticaOblique);
    doc.setTitle("Demande de soumission " + o.no); doc.setAuthor("Pavillon de l'Avenir"); doc.setLanguage("fr-CA");
    const form = doc.getForm(), bleu = rgb(0.122, 0.373, 0.545), encre = rgb(0.118, 0.165, 0.267), gris = rgb(0.42, 0.45, 0.5), ligne = rgb(0.87, 0.89, 0.92), pale = rgb(0.957, 0.969, 0.98);
    const W = 612, H = 792, M = 46, cD = M + 26, cQ = 372, cP = 412, cT = 492, fin = W - M, hL = 22;
    const logo = o.logo && await octets(o.logo), photo = o.photo && await octets(o.photo);
    const logoImg = logo ? await doc.embedPng(logo) : null, photoImg = photo ? await doc.embedJpg(photo).catch(() => null) : null;
    /* calculs : la clé /C (calculer), /F (format) et /K (frappe) d'un champ */
    const actions = (champ, a) => { const d = {}; for (const k in a) d[k] = doc.context.obj({ Type:"Action", S:"JavaScript", JS:PDFString.of(a[k]) }); champ.acroField.dict.set(PDFName.of("AA"), doc.context.obj(d)); };
    const argent = { K:'AFNumber_Keystroke(2, 3, 0, 0, " $", false);', F:'AFNumber_Format(2, 3, 0, 0, " $", false);' };
    const ordre = [], texte = (p, t, x, y, z, font, c) => p.drawText(t, { x, y, size:z || 10, font:font || f, color:c || encre });
    const champ = (p, nom, x, y, w, h, opt) => { const c = form.createTextField(nom); if (opt && opt.lecture) c.enableReadOnly(); c.addToPage(p, { x, y, width:w, height:h, font:f, textColor:encre, backgroundColor:opt && opt.fond || rgb(1, 1, 1), borderWidth:0 }); c.setFontSize(10); if (opt && opt.droite) c.setAlignment(2); return c; };
    let p = doc.addPage([W, H]), y;
    const entete = (suite) => { y = H - M;
      if (logoImg) { const s = 46 / logoImg.height; p.drawImage(logoImg, { x:M, y:y - 46, width:logoImg.width * s, height:46 }); }
      const t = "Demande de soumission" + (suite ? " (suite)" : ""); texte(p, t, fin - fb.widthOfTextAtSize(t, 18), y - 20, 18, fb, bleu);
      const s2 = o.no + " · " + o.date; texte(p, s2, fin - f.widthOfTextAtSize(s2, 10), y - 36, 10, f, gris);
      y -= 58; p.drawRectangle({ x:M, y, width:fin - M, height:3, color:bleu }); y -= 18; };
    const titres = () => { p.drawRectangle({ x:M, y:y - hL, width:fin - M, height:hL, color:bleu });
      [["#", M + 6], ["Description", cD + 4]].forEach(([t, x]) => texte(p, t, x, y - 15, 10, fb, rgb(1, 1, 1)));
      [["Qté", cP - 6], ["Prix unitaire", cT - 6], ["Total", fin - 6]].forEach(([t, x]) => texte(p, t, x - fb.widthOfTextAtSize(t, 10), y - 15, 10, fb, rgb(1, 1, 1))); y -= hL; };
    entete(false);
    texte(p, "Bonjour,", M, y, 11); y -= 15;
    texte(p, "Pourriez-vous nous faire parvenir vos prix et votre délai de livraison pour les pièces suivantes ? Merci !", M, y, 11); y -= 15;
    texte(p, "Vous pouvez inscrire vos prix directement dans ce PDF : les totaux se calculent seuls.", M, y, 9, fi, gris); y -= 24;
    /* coordonnées à remplir par le fournisseur */
    [["Fournisseur", "fournisseur", "N° de soumission", "no_soumission"], ["Représentant", "representant", "Délai de livraison", "delai"]].forEach(r => {
      [[r[0], r[1], M], [r[2], r[3], M + (fin - M) / 2 + 8]].forEach(([l, n, x]) => { const w = (fin - M) / 2 - 8; texte(p, l, x, y, 8, f, gris);
        champ(p, n, x, y - 20, w, 16); p.drawLine({ start:{ x, y:y - 21 }, end:{ x:x + w, y:y - 21 }, thickness:0.7, color:gris }); });
      y -= 34; });
    y -= 6; titres();
    A.forEach((a, i) => { if (y < M + 140) { p = doc.addPage([W, H]); entete(true); titres(); }
      const k = i + 1; if (i % 2) p.drawRectangle({ x:M, y:y - hL, width:fin - M, height:hL, color:pale });
      texte(p, String(k), M + 6, y - 15, 10, f, gris);
      let nom = String(a.nom); while (f.widthOfTextAtSize(nom, 10) > cQ - cD - 10 && nom.length > 4) nom = nom.slice(0, -2); if (nom !== String(a.nom)) nom = nom.trim() + "…";
      texte(p, nom, cD + 4, y - 15, 10); const q = String(+a.q || 1); texte(p, q, cP - 6 - fb.widthOfTextAtSize(q, 10), y - 15, 10, fb);
      const cp = champ(p, "p" + k, cP + 3, y - hL + 3, cT - cP - 6, hL - 6, { droite:true, fond:rgb(1, 0.98, 0.9) }); actions(cp, argent);
      const ct = champ(p, "t" + k, cT + 3, y - hL + 3, fin - cT - 6, hL - 6, { droite:true, lecture:true, fond:i % 2 ? pale : rgb(1, 1, 1) });
      actions(ct, { C:'var v = this.getField("p' + k + '").value; event.value = (v === "" ? "" : ' + (+a.q || 1) + ' * Number(v));', F:argent.F }); ordre.push(ct);
      p.drawLine({ start:{ x:M, y:y - hL }, end:{ x:fin, y:y - hL }, thickness:0.5, color:ligne }); y -= hL; });
    /* totaux */
    const n = A.length, somme = 'var s = 0; for (var i = 1; i <= ' + n + '; i++) { var v = this.getField("t" + i).value; if (v !== "") s += Number(v); } event.value = s;';
    [["Sous-total", "st", somme, false], ["TPS (5 %)", "tps", 'event.value = Number(this.getField("st").value) * 0.05;', false],
     ["TVQ (9,975 %)", "tvq", 'event.value = Number(this.getField("st").value) * 0.09975;', false],
     ["Total", "tot", 'event.value = Number(this.getField("st").value) + Number(this.getField("tps").value) + Number(this.getField("tvq").value);', true]].forEach(([l, nom, js, gras]) => {
      if (gras) p.drawRectangle({ x:M, y:y - hL, width:fin - M, height:hL, color:pale });
      const fo = gras ? fb : f; texte(p, l, cT - 6 - fo.widthOfTextAtSize(l, 10), y - 15, 10, fo);
      const c = champ(p, nom, cT + 3, y - hL + 3, fin - cT - 6, hL - 6, { droite:true, lecture:true, fond:gras ? pale : rgb(1, 1, 1) }); actions(c, { C:js, F:argent.F }); ordre.push(c);
      p.drawLine({ start:{ x:M, y:y - hL }, end:{ x:fin, y:y - hL }, thickness:0.5, color:ligne }); y -= hL; });
    y -= 14; texte(p, n + " article" + (n > 1 ? "s" : "") + " · " + A.reduce((s, a) => s + (+a.q || 0), 0) + " pièces au total", M, y, 9, f, gris);
    /* signature (photo ronde à gauche, barre bleue) */
    const L = (o.signature || []).filter(x => String(x).trim());
    if (L.length) { const hS = 14 * L.length + 4; if (y - hS - 30 < M) { p = doc.addPage([W, H]); entete(true); } y -= 30;
      let x = M; if (photoImg) { const r = 30, cx = M + r, cy = y - hS / 2; p.drawImage(photoImg, { x:cx - r, y:cy - r, width:r * 2, height:r * 2 }); /* rond : un anneau blanc masque les coins */
        p.drawCircle({ x:cx, y:cy, size:r + 9, borderColor:rgb(1, 1, 1), borderWidth:18 }); x = M + 2 * r + 16; }
      p.drawRectangle({ x, y:y - hS, width:3, height:hS, color:bleu });
      L.forEach((t, i) => texte(p, String(t).replace(/[^\u0000-ÿ–—…«»’“”•€]/g, ""), x + 10, y - 12 - 14 * i, i ? 10 : 12, i ? (/^«/.test(t.trim()) ? fi : f) : fb, i ? (/^«/.test(t.trim()) ? gris : encre) : bleu)); }
    /* ordre des calculs + apparence des champs */
    const af = doc.catalog.lookup(PDFName.of("AcroForm")); af.set(PDFName.of("CO"), doc.context.obj(ordre.map(c => c.ref))); af.set(PDFName.of("NeedAppearances"), doc.context.obj(true));
    return new Blob([await doc.save()], { type:"application/pdf" });
  }
  return { creer };
})();
