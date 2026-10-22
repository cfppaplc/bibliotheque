const { chromium } = require('playwright');
const OUT = (process.env.SORTIE || '/tmp/captures') + '/'; require('fs').mkdirSync(OUT, { recursive:true });
// Usage : SORTIE=/tmp/captures node captures_nouveautes.js  (site local sur le port 8791)
// Puis réduire en JPEG 640 px dans site/nouveautes/ et les lier dans nouveautes.json (champ img d'une étape).
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport:{width:1400,height:860}, deviceScaleFactor:1 }); const p = await ctx.newPage(); await p.addInitScript(() => { try { localStorage.setItem('bienvenueVu', '1'); } catch(e){} });
  const err = []; p.on('pageerror', e => err.push(e.message));
  const ring = (sels, pad = 6) => p.evaluate(([sels, pad]) => { document.querySelectorAll('.capring').forEach(e => e.remove());
    sels.forEach(sel => { const el = typeof sel === 'string' ? document.querySelector(sel) : null; const r = el ? el.getBoundingClientRect() : { left:sel[0], top:sel[1], width:sel[2], height:sel[3] };
      const d = document.createElement('div'); d.className = 'capring'; d.style.cssText = `position:fixed;z-index:99999;pointer-events:none;left:${r.left - pad}px;top:${r.top - pad}px;width:${r.width + pad * 2}px;height:${r.height + pad * 2}px;border:3px solid #ff2d55;border-radius:10px;box-shadow:0 0 0 3px rgba(255,45,85,.25)`; document.body.appendChild(d); }); }, [sels, pad]);
  const unring = () => p.evaluate(() => document.querySelectorAll('.capring').forEach(e => e.remove()));
  const box = async sel => p.locator(sel).first().boundingBox();
  const shot = async (nom, clip) => { clip = { x:Math.max(0, Math.round(clip.x)), y:Math.max(0, Math.round(clip.y)), width:Math.round(clip.width), height:Math.round(clip.height) }; await p.screenshot({ path: OUT + nom + '.png', clip }); console.log('✓', nom); };
  const autour = (bb, m = 20) => ({ x:bb.x - m, y:bb.y - m, width:bb.width + 2 * m, height:bb.height + 2 * m });
  const union = (...bs) => { const x = Math.min(...bs.map(b => b.x)), y = Math.min(...bs.map(b => b.y)); return { x, y, width:Math.max(...bs.map(b => b.x + b.width)) - x, height:Math.max(...bs.map(b => b.y + b.height)) - y }; };
  const essai = async (nom, f) => { try { await f(); } catch(e){ console.log('✗', nom, e.message.split('\n')[0]); } await unring(); };
  const ouvrirLivre = async f => { await p.goto('http://localhost:8791/?t=' + Date.now()); await p.waitForTimeout(900);
    await p.evaluate(() => { try { localStorage.clear(); } catch(e){} });
    await p.locator(`.book[data-f="${f}"]`).first().click(); await p.waitForTimeout(300); await p.click('#mRead');
    await p.waitForFunction(() => typeof RD !== 'undefined' && RD.drv && RD.drv.state().tot > 0, null, { timeout: 40000 }); await p.waitForTimeout(4200); };

  // ---------- Bibliothèque : recherche, filtre
  await p.goto('http://localhost:8791/?t=' + Date.now()); await p.waitForTimeout(1200);
  await essai('filtre', async () => { const f = await box('#filtres'); await ring(['#filtres']); await shot('filtre', autour(f, 24)); });
  await essai('recherche', async () => { const inp = p.locator('input[placeholder*="Titre"]').first(); await inp.fill('pompe'); await p.waitForTimeout(2000);
    const ib = await inp.boundingBox(); await ring([[ib.x, ib.y, ib.width, ib.height]]); await shot('recherche-case', { x:ib.x - 420, y:0, width:ib.width + 440, height:ib.y + ib.height + 18 }); await unring();
    await p.evaluate(() => { const h = document.getElementById('hits'); window.scrollTo(0, h.getBoundingClientRect().top + scrollY - 70); }); await p.waitForTimeout(400);
    const hb = await box('#hits'); await shot('recherche', { x:hb.x - 10, y:hb.y - 10, width:Math.min(1100, hb.width + 20), height:Math.min(360, hb.height + 20) });
    await p.evaluate(() => window.scrollTo(0, 0)); await inp.fill(''); await p.waitForTimeout(300); });
  await essai('plans', async () => { await ring(['#planBtn']); const pb = await box('#planBtn'); await shot('plans-bouton', { x:pb.x - 300, y:0, width:560, height:pb.y + pb.height + 24 }); await unring();
    await p.click('#planBtn'); await p.waitForTimeout(1500); await shot('plans', { x:250, y:190, width:900, height:480 }); await p.keyboard.press('Escape'); await p.waitForTimeout(300); });
  await essai('accueil', async () => { await p.goto('http://localhost:8791/?t=' + Date.now()); await p.waitForTimeout(900); await p.click('#accueilBtn'); await p.waitForTimeout(3000); await shot('accueil', { x:0, y:0, width:1400, height:860 }); });

  // ---------- Livre
  await ouvrirLivre('plomberie-chauffage');
  await essai('livre-barre', async () => { await p.mouse.move(700, 835); await p.waitForTimeout(900); const a = await box('#tbPrev'), z = await box('#tb'); await ring(['#tbMenu', '#tbAns', '#tbQr'], 4); await shot('livre-barre', { x:a.x - 14, y:a.y - 14, width:Math.min(760, z.x + z.width - a.x + 28), height:a.height + 28 }); });
  await essai('livre-tdm', async () => { await p.keyboard.press('m'); await p.waitForTimeout(800); await shot('livre-tdm', { x:0, y:0, width:1400, height:860 }); await p.evaluate(() => closeMenu()); await p.waitForTimeout(400); });
  await essai('livre-reponses', async () => {
    const pg = await p.evaluate(() => { const d = document.getElementById('readerFrame').contentDocument; return [...d.querySelectorAll('.page')].findIndex(x => x.querySelector('.reponse,.answer,.solution,.correction,[data-reponse],.ans')) + 1; });
    if (pg > 0){ await p.fill('#tbPg', String(pg)); await p.press('#tbPg', 'Enter'); await p.waitForTimeout(1500); }
    for (let i = 0; i < 3; i++){ await p.evaluate(() => document.getElementById('tbAns').click()); await p.waitForTimeout(600); } console.log('ans', await p.evaluate(() => [document.getElementById('tbAns').hidden, document.getElementById('tbAns').disabled, RD.label]));
    await ring(['#tbAns'], 4); await shot('livre-reponses', { x:0, y:0, width:1400, height:860 }); });
  await essai('livre-qr', async () => { await p.keyboard.press('q'); await p.waitForTimeout(1000); await shot('livre-qr', { x:0, y:0, width:1400, height:860 }); await p.evaluate(() => { $('#qrOv').hidden = true; }); await p.waitForTimeout(300); });

  // ---------- Tableau blanc : barre
  await essai('barre', async () => { await p.evaluate(() => { toggleWb(); }); await p.waitForTimeout(500);
    const bb = await box('#penBar'); await shot('barre', autour(bb, 14));
    await p.click('#penCol'); await p.waitForTimeout(300); const pc = await box('#popCol'); await ring(['#penCol'], 3); await shot('barre-couleur', autour(union(pc, bb), 14)); await unring(); await p.click('#penCol');
    await p.click('#penPlus'); await p.waitForTimeout(300); const pp = await box('#popPlus'); await ring(['#penPlus'], 3); await shot('barre-plus', autour(union(pp, bb), 14)); await unring(); await p.click('#penPlus');
    await ring(['#wbF'], 3); await shot('elec-fond', autour(bb, 14)); });

  // ---------- Schéma électrique
  await essai('elec', async () => {
    await p.evaluate(() => { wbEtat().bg[wbEtat().n] = "quad"; majFond(); redrawInk(); refreshTools(); }); await p.waitForTimeout(300);
    await p.click('#penO'); await p.waitForTimeout(400); await p.evaluate(() => { const t = $('#toast'); if (t) t.hidden = true; });
    const pal = await box('#objBar'); await ring(['#objBar .tete'], 2); await shot('elec-palette', { x:pal.x - 8, y:pal.y - 8, width:pal.width + 16, height:Math.min(470, pal.height + 16) }); await unring();
    // schéma placé par programme, à droite de la palette
    const G = await p.evaluate(() => {
      const c = $("#inkCanvas"), r = c.getBoundingClientRect(), W = c.width, H = c.height, u = elecU(), f = r.width / W;
      const ox = Math.round((330 - r.left) / f / u), oy = Math.round((170 - r.top) / f / u);
      const P = (x, y) => [(ox + x) * u / W, (oy + y) * u / H];
      const obj = (k, x, y, ex) => { const o = Object.assign({ t:"objet", k, o:0, c:"#24282c", p:[P(x, y)], w:4, lb:(ELEC[k].lb || ""), nf:0 }, ex || {}); strokes().push(o); return o; };
      const fil = (a, b) => strokes().push({ c:"#24282c", hl:false, hc:null, w:2.5, t:"ligne", fil:true, p:[P(...a), P(...b)] });
      const rails = obj("rails", 0, 0, { sz:[16, 6] });
      obj("bp", 1, 1, { lb:"PB1", nf:1 }); obj("bp", 4, 1, { lb:"PB2" }); obj("surcharge", 9, 1); obj("bobine", 13, 1, { lb:"M" }); obj("contact", 4, 3, { lb:"M" });
      obj("contact", 3, 5, { lb:"M" }); obj("lampe", 13, 5, { lb:"G" });
      [[[0,1],[1,1]], [[3,1],[4,1]], [[6,1],[9,1]], [[11,1],[13,1]], [[15,1],[16,1]], [[3,1],[3,3]], [[3,3],[4,3]], [[6,3],[6,1]], [[0,5],[3,5]], [[5,5],[13,5]], [[15,5],[16,5]]].forEach(([a, b]) => fil(a, b));
      strokes().push({ t:"objet", k:"jonction", o:0, c:"#24282c", p:[P(3, 1)], w:4 }, { t:"objet", k:"jonction", o:0, c:"#24282c", p:[P(6, 1)], w:4 });
      redrawInk(); window.__rails = rails; window.__P = (x, y) => [r.left + (ox + x) * u * f, r.top + (oy + y) * u * f];
      return { u:u * f, x0:r.left + ox * u * f, y0:r.top + oy * u * f }; });
    const zone = { x:G.x0 - 60, y:G.y0 - 50, width:G.u * 16 + 110, height:G.u * 6 + 80 };
    // échelle sélectionnée + poignée
    await p.evaluate(() => { SELO.s = __rails; redrawInk(); majObjUI(); });
    await ring([[G.x0 + 16 * G.u - 12, G.y0 + 6 * G.u - 12, 24, 24]], 4); await shot('elec-echelle', zone); await unring();
    // symbole sélectionné : réglages
    await p.evaluate(() => { const o = strokes().find(s => s.k === "bp" && s.lb === "PB2"); SELO.s = o; redrawInk(); majObjUI(); });
    await p.evaluate(() => { const b = $('#objBar'); b.scrollTop = b.scrollHeight; }); await p.waitForTimeout(200);
    const nfb = await box('#objNF'), lb = await box('#objL');
    await ring(['#objNF', '#objL'], 3); await shot('elec-reglages', { x:pal.x - 8, y:nfb.y - 70, width:pal.width + 16, height:lb.y + lb.height - nfb.y + 100 }); await unring();
    const bpb = await p.evaluate(() => __P(4, 1)); await shot('elec-symbole', { x:bpb[0] - 30, y:bpb[1] - 60, width:G.u * 2 + 60, height:100 });
    await p.evaluate(() => { const b = $('#objBar'); b.scrollTop = 0; });
    await p.evaluate(() => { SELO.s = null; RD.objKe = "fil"; redrawInk(); majObjUI(); });
    // relier : glisser d'un point bleu à l'autre (capture pendant le geste)
    await p.evaluate(() => { const arr = strokes(); const i = arr.findIndex(s => s.fil && Math.abs(s.p[0][0] - s.p[1][0]) > .01 && s.p[0][1] === s.p[1][1]); });
    const a = await p.evaluate(() => __P(11, 1)), z = await p.evaluate(() => __P(13, 1));
    // retirer ce fil pour le retracer
    await p.evaluate(([a, z]) => { const c = $("#inkCanvas"), r = c.getBoundingClientRect(); const arr = strokes(); const nx = x => (x - r.left) / r.width, ny = y => (y - r.top) / r.height;
      const i = arr.findIndex(s => s.fil && Math.abs(s.p[0][0] - nx(a[0])) < .002 && Math.abs(s.p[0][1] - ny(a[1])) < .002); if (i >= 0) arr.splice(i, 1); redrawInk(); }, [a, z]);
    await p.mouse.move(a[0] + 3, a[1] - 4); await p.mouse.down(); await p.mouse.move(a[0] + G.u, a[1], { steps:4 }); await p.mouse.move(z[0] - 2, z[1] + 3, { steps:4 }); await p.mouse.up(); await p.waitForTimeout(200);
    await p.evaluate(() => redrawInk());
    console.log('fils', await p.evaluate(() => { const c = $('#inkCanvas'), u = elecU(), g = q => [Math.round(q[0]*c.width/u), Math.round(q[1]*c.height/u)].join(','); return strokes().filter(s => s.fil).map(f => g(f.p[0]) + '>' + g(f.p[1])).join(' '); }));
    await ring([[a[0] - 9, a[1] - 9, 18, 18], [z[0] - 9, z[1] - 9, 18, 18]], 2);
    await p.evaluate(([a, z]) => { const d = document.createElement('div'); d.className = 'capring'; d.textContent = '→'; d.style.cssText = `position:fixed;z-index:99999;left:${(a[0] + z[0]) / 2 - 10}px;top:${a[1] - 34}px;font:800 24px system-ui;color:#ff2d55`; document.body.appendChild(d); }, [a, z]);

    await shot('elec-relier', { x:G.x0 + 7 * G.u, y:G.y0 - 10, width:G.u * 9 + 40, height:G.u * 3 }); await unring();
    // animation
    await p.click('#objSim'); await p.waitForTimeout(300);
    const mb = await p.evaluate(() => __P(5, 1)); await p.mouse.move(mb[0], mb[1]); await p.mouse.down(); await p.waitForTimeout(150); await p.mouse.up(); await p.waitForTimeout(900);
    await shot('elec-animer', zone);
    const sb = await box('#objSim'); await ring(['#objSim'], 3); await shot('elec-animer-bouton', { x:pal.x - 8, y:sb.y - 40, width:pal.width + 16, height:260 });
  });
  console.log(err); await b.close();
})();
