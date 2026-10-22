// Vérification d'un livre dans la bibliothèque (Pavillon de l'Avenir).
// Usage : node verifier_livre.js <url du site local> <fichier1> [fichier2 ...]
// Écrit verification.json et affiche une fiche par livre.
const { chromium } = require('playwright');
const fs = require('fs');
const SITE = process.argv[2] || 'http://localhost:8768/';
const LIVRES = process.argv.slice(3);
const DOSSIER = process.env.SITE_DIR || require('path').resolve(__dirname, '..');

(async () => {
  const b = await chromium.launch();
  const rapports = [];
  for (const f of LIVRES) {
    const R = { fichier: f, ok: [], info: [], avert: [], erreurs: [] };
    const chemin = `${DOSSIER}/livres/${f}.html`;
    // --- 1. Le fichier lui-même
    let html = '';
    try { html = fs.readFileSync(chemin, 'utf8'); } catch (e) { R.erreurs.push('Fichier introuvable dans livres/'); rapports.push(R); continue; }
    R.poids_mo = +(fs.statSync(chemin).size / 1e6).toFixed(2);
    const texte = html.replace(/data:[a-z/+.-]+;base64,[A-Za-z0-9+/=]+/g, '');
    R.titre_html = (texte.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
    R.images_integrees = (html.match(/data:image\//g) || []).length;
    const ext = [...new Set([...texte.matchAll(/(?:src|href)="(https?:\/\/[^"/]+)/g)].map(m => m[1]))];
    R.ressources_externes = ext;
    if (R.poids_mo > 30) R.avert.push(`Fichier lourd (${R.poids_mo} Mo) : première ouverture lente sur le Wi-Fi de l'école`);
    else R.ok.push(`Poids : ${R.poids_mo} Mo`);
    if (!R.titre_html) R.avert.push('Pas de <title> dans le fichier');
    const boite = texte.match(/\b(alert|confirm|prompt)\(\s*['"`]([^'"`]{0,60})/);
    if (boite) R.info.push(`Contient une boîte ${boite[1]}() (« ${boite[2]}… ») : elle bloque l'écran si elle s'ouvre pendant la projection`);
    if (/window\.(parent|top)\b/.test(texte)) R.avert.push('Utilise window.parent ou window.top');
    const autres = ext.filter(u => !/fonts\.(googleapis|gstatic)\.com/.test(u));
    if (autres.length) R.avert.push('Dépend d\'Internet pour : ' + autres.join(', '));
    // ancres internes brisées
    const ids = new Set([...texte.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
    const ancres = [...new Set([...texte.matchAll(/href="#([^"]+)"/g)].map(m => m[1]))].filter(a => !ids.has(a));
    if (ancres.length) R.avert.push(`${ancres.length} lien(s) interne(s) vers une section absente : #${ancres.slice(0, 5).join(', #')}`);

    // --- 2. Dans le lecteur de la bibliothèque
    const ctx = await b.newContext({ viewport: { width: 1600, height: 900 } });
    const p = await ctx.newPage();
    await p.addInitScript(() => { try { localStorage.setItem('bienvenueVu', '1'); } catch(e){} });   // pas de page Bienvenue pendant le test
    const jsErr = []; p.on('pageerror', e => jsErr.push(e.message));
    try {
      await p.goto(SITE + '?verif=' + Date.now()); await p.waitForTimeout(800);
      if (!(await p.locator(`.book[data-f="${f}"]`).count())) { R.erreurs.push('Le livre n\'est pas dans la liste LIVRES de la bibliothèque'); await ctx.close(); rapports.push(R); continue; }
      await p.locator(`.book[data-f="${f}"]`).first().click(); await p.waitForTimeout(400);
      const t0 = Date.now(); await p.click('#mRead');
      await p.waitForFunction(() => typeof RD !== 'undefined' && RD.drv && (RD.drv.state().tot || 0) > 0, null, { timeout: 45000 }).catch(() => {});
      R.ouverture_s = +((Date.now() - t0) / 1000).toFixed(1);
      await p.waitForTimeout(2500);
      const info = await p.evaluate(() => {
        const fr = document.getElementById('readerFrame'), d = fr.contentDocument, w = fr.contentWindow;
        const moteur = d.getElementById('ui') && d.getElementById('bp') && d.getElementById('pg') ? 'Livre de compétence (barre intégrée)'
          : d.getElementById('prev') && d.getElementById('count') && d.getElementById('jump') ? 'Livre à barre « précédent/suivant »'
          : RD.drv && RD.drv.keys ? 'Pages empilées (affichées par la bibliothèque)' : 'Document qui défile';
        const imgs = [...d.images].filter(i => i.complete && i.naturalWidth === 0).length;
        return { moteur, tot: RD.drv.state().tot, label: RD.drv.state().label, pages: d.querySelectorAll('.page').length, imgsBrisees: imgs,
          reps: d.querySelectorAll('.reponse,.answer,.solution,.correction,[data-reponse],[data-answer],.ans').length, ansInfo: !!RD.drv.ansInfo };
      });
      Object.assign(R, { moteur: info.moteur, pages_lecteur: info.tot, pages_fichier: info.pages, reponses: info.reps });
      if (!info.tot) R.erreurs.push('Le lecteur ne trouve pas le nombre de pages');
      else R.ok.push(`S'ouvre en ${R.ouverture_s} s · ${info.tot} pages · ${info.moteur}`);
      if (info.pages && info.tot && Math.abs(info.pages - info.tot) > 1) R.avert.push(`Le compteur (${info.tot}) ne correspond pas au nombre de pages du fichier (${info.pages})`);
      if (info.imgsBrisees) R.erreurs.push(`${info.imgsBrisees} image(s) qui ne s'affichent pas`);
      // navigation
      const avant = await p.inputValue('#tbPg');
      await p.keyboard.press('ArrowRight'); await p.waitForTimeout(1300);
      const apres = await p.inputValue('#tbPg');
      if (avant === apres) R.erreurs.push('La flèche → ne tourne pas la page'); else R.ok.push(`Flèches : ${avant} → ${apres}`);
      // modules
      await p.keyboard.press('m'); await p.waitForTimeout(600);
      const mods = await p.evaluate(() => [...document.querySelectorAll('.mm[data-i]')].map(b => ({ k: b.className.replace('mm ', ''), t: b.querySelector('span').textContent })));
      R.modules = mods.length;
      if (!mods.length) R.avert.push('Aucun module dans la table des matières (titres « Module N — … » manquants ?)');
      else {
        const num = mods.filter(m => m.k === 'mm-module').length;
        R.ok.push(`Table des matières : ${mods.length} entrées dont ${num} modules ou chapitres`);
        const autre = mods.filter(m => m.k === 'mm-autre').map(m => m.t);
        if (autre.length) R.avert.push('Entrées sans type reconnu (icône point) : ' + autre.join(' · '));
        // le 2e module mène-t-il ailleurs ?
        const i = mods.findIndex(m => m.k === 'mm-module');
        if (i >= 0) { await p.locator('.mm[data-i]').nth(i).click(); await p.waitForTimeout(1500); R.ok.push(`Premier module → page ${await p.inputValue('#tbPg')}`); }
        else await p.keyboard.press('Escape');
      }
      // réponses
      if (!info.reps) R.avert.push('Aucune réponse marquée (class="reponse") : le bouton ✓ restera grisé');
      else {
        const pg = await p.evaluate(() => { const d = document.getElementById('readerFrame').contentDocument;
          return [...d.querySelectorAll('.page')].findIndex(x => x.querySelector('.reponse,.answer,.solution,.correction,[data-reponse],.ans')) + 1; });
        if (pg > 0) { await p.fill('#tbPg', String(pg)); await p.press('#tbPg', 'Enter'); await p.waitForTimeout(1500); }
        const vus = () => p.evaluate(() => { const fr = document.getElementById('readerFrame'), d = fr.contentDocument, w = fr.contentWindow;
          return [...d.querySelectorAll('.reponse,.answer,.solution,.correction,[data-reponse],.ans')].filter(e => { const r = e.getBoundingClientRect(), cs = w.getComputedStyle(e);
            const pgv = e.closest('.page'); return r.width && r.top < w.innerHeight && r.bottom > 0 && cs.visibility === 'visible' && cs.display !== 'none' && (!pgv || w.getComputedStyle(pgv).visibility !== 'hidden'); }).length; });
        const v0 = await vus();
        let v2 = v0;
        for (let k = 0; k < 3 && v2 <= v0; k++) { await p.keyboard.press('r'); await p.waitForTimeout(700); v2 = await vus(); }
        if (v0 > 0) R.avert.push(`Des réponses sont visibles avant d'appuyer sur ✓ (page ${pg})`);
        if (v2 > v0) R.ok.push(`Réponses : ${info.reps} marquées · ✓ en affiche ${v2} à la page ${pg}`);
        else R.erreurs.push(`Le bouton ✓ n'affiche pas les réponses (page ${pg})`);
      }
    } catch (e) { R.erreurs.push('Test interrompu : ' + e.message.split('\n')[0]); }
    if (jsErr.length) R.erreurs.push(`${jsErr.length} erreur(s) JavaScript : ` + [...new Set(jsErr)].slice(0, 3).join(' | '));
    R.verdict = R.erreurs.length ? 'À corriger' : R.avert.length ? 'Fonctionne, à surveiller' : 'Tout est bon';
    rapports.push(R);
    await ctx.close();
  }
  await b.close();
  fs.writeFileSync(process.env.SORTIE || '/tmp/verification.json', JSON.stringify(rapports, null, 2));
  for (const R of rapports) {
    console.log(`\n=== ${R.fichier} — ${R.verdict}`);
    R.ok.forEach(x => console.log('  ✓ ' + x)); R.info.forEach(x => console.log('  ℹ ' + x)); R.avert.forEach(x => console.log('  ⚠ ' + x)); R.erreurs.forEach(x => console.log('  ✗ ' + x));
  }
})();
