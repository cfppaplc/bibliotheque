/* Tests des fonctions importantes (25 nov.) : relancés par GitHub à chaque publication (.github/workflows/test-pages.yml).
   Ajouter un test ici à chaque bogue corrigé, pour qu'il ne revienne pas. Serveur local : port 8791. */
const { chromium } = require("playwright");
const BASE = "http://localhost:8791/";
const tests = [];
const test = (nom, f) => tests.push([nom, f]);
const attendre = ms => new Promise(r => setTimeout(r, ms));
async function page(b, opt = {}, prep) {
  const ctx = await b.newContext(Object.assign({ viewport: { width: 1440, height: 900 } }, opt));
  await ctx.addInitScript(p => { localStorage.bienvenueVu = "1"; if (p) localStorage.dernierId = p; }, prep || "");
  const p = await ctx.newPage(); p.errs = []; p.on("pageerror", e => p.errs.push(e.message));
  p.envois = { supabase: 0, ntfy: 0 };
  await p.route(/supabase\.co\/rest\/v1\/rpc\/(journal_ecrire|stats_plus)/, r => { p.envois.supabase++; r.fulfill({ status: p.sbStatut || 204, body: "", headers: { "access-control-allow-origin": "*", "access-control-allow-headers": "*" } }); });
  await p.route(/ntfy\.sh/, r => { p.envois.ntfy++; r.fulfill({ body: "{}", headers: { "access-control-allow-origin": "*" } }); });
  return p;
}
const vrai = (c, m) => { if (!c) throw new Error(m); };

test("Tableau blanc : dessiner, annuler, garder après rechargement", async b => {
  const p = await page(b);
  const ouvrir = async () => { await p.waitForFunction(() => typeof ouvrirTableauBlanc === "function", null, { timeout: 15000 }); await attendre(500); await p.evaluate(() => ouvrirTableauBlanc()); };
  await p.goto(BASE + "index.html"); await ouvrir(); await p.waitForFunction(() => document.getElementById("reader")?.classList.contains("wbon"), null, { timeout: 15000 });
  await attendre(800);
  const n = () => p.evaluate(() => (INKS[inkKey()] || []).length);
  const n0 = await n(), c = await p.locator("#inkCanvas").boundingBox();
  for (let i = 0; i < 2; i++) { const y = c.y + c.height * (0.3 + i * 0.2);
    await p.mouse.move(c.x + c.width * 0.3, y); await p.mouse.down(); for (let k = 1; k <= 10; k++) await p.mouse.move(c.x + c.width * (0.3 + k * 0.03), y + k * 3); await p.mouse.up(); await attendre(150); }
  vrai(await n() === n0 + 2, "2 traits attendus, " + (await n() - n0) + " dessinés");
  await p.keyboard.press("Control+z"); await attendre(200);
  vrai(await n() === n0 + 1, "Annuler n'a pas retiré le dernier trait");
  await attendre(2500);   // enregistrement 1,8 s après le dernier trait
  await p.reload(); await ouvrir(); await p.waitForFunction(() => document.getElementById("reader")?.classList.contains("wbon"), null, { timeout: 15000 }); await attendre(1000);
  vrai(await n() === n0 + 1, "Le dessin n'est pas revenu après le rechargement (" + (await n()) + ")");
  vrai(!p.errs.length, p.errs.join(" | "));
});

test("Barre de navigation : liens de trop dans « … », repliée et dépliée au redimensionnement", async b => {
  const p = await page(b, { viewport: { width: 1000, height: 720 } });
  await p.goto(BASE + "labo.html"); await attendre(2000);
  const etat = () => p.evaluate(() => { const n = document.querySelector(".mp-nav"); return { plus: !!n.querySelector(".mp-plus"), deborde: n.getBoundingClientRect().right > innerWidth + 1, vis: [...n.querySelectorAll(":scope>a")].filter(a => a.style.display !== "none").length, tot: n.querySelectorAll(":scope>a").length }; });
  let e = await etat(); vrai(!e.deborde, "La barre dépasse à 1000 px"); vrai(e.plus && e.vis < e.tot, "Pas de menu « … » à 1000 px");
  await p.setViewportSize({ width: 1440, height: 900 }); await attendre(500);
  e = await etat(); vrai(!e.plus && e.vis === e.tot, "Les liens ne reviennent pas à 1440 px");
  vrai(!p.errs.length, p.errs.join(" | "));
});

test("Accueil de classe : l'horloge avance et la page ne se réécrit pas sans cesse", async b => {
  const p = await page(b, { hasTouch: true, viewport: { width: 1280, height: 720 } });
  await p.goto(BASE + "accueil.html"); await attendre(2500);
  /* 25 nov. : la date, la salutation et le nom de la période ne doivent pas être réécrits chaque seconde (accrochages au TNI) */
  const r = await p.evaluate(() => new Promise(res => { let n = 0; const mo = new MutationObserver(l => n += l.length);
    ["v-date", "v-greet", "v-pname", "v-phours"].forEach(id => { const e = document.getElementById(id); if (e) mo.observe(e, { subtree: true, childList: true, characterData: true }); });
    const s0 = document.getElementById("v-s").textContent; setTimeout(() => { mo.disconnect(); res({ n, s0, s1: document.getElementById("v-s").textContent }); }, 4000); }));
  vrai(r.s0 !== r.s1, "L'horloge n'avance pas");
  vrai(r.n === 0, "Date, salutation ou période réécrites " + r.n + " fois en 4 s");
  vrai(!p.errs.length, p.errs.join(" | "));
});

test("Script manquant : la bibliothèque se recharge une seule fois", async b => {
  const p = await page(b); let nav = 0;
  await p.route(/lecteur-souris\.js/, r => r.abort()); p.on("framenavigated", f => { if (f === p.mainFrame()) nav++; });
  await p.goto(BASE + "index.html"); await attendre(4000);
  vrai(nav === 2, nav + " chargements (attendu : 2)");
});

test("Journal de fluidité : rien pour un visiteur; Supabase d'abord, ntfy en secours", async b => {
  const v = await page(b); await v.goto(BASE + "index.html"); await attendre(1200);
  vrai(!(await v.evaluate(() => !!window.journalPerf)), "Le journal tourne pour un visiteur");
  for (const [statut, sb, nt] of [[204, 1, 0], [404, 1, 1]]) {
    const p = await page(b, {}, "prof.essai"); p.sbStatut = statut;
    await p.goto(BASE + "index.html"); await attendre(1200);
    await p.evaluate(() => { for (let i = 0; i < 6; i++) { const t = performance.now(); while (performance.now() - t < 120) {} } });
    await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))); await attendre(300);
    await p.evaluate(() => { const t = performance.now(); while (performance.now() - t < 400) {} }); await attendre(300);
    await p.evaluate(() => { Object.defineProperty(document, "hidden", { value: true, configurable: true }); document.dispatchEvent(new Event("visibilitychange")); }); await attendre(800);
    vrai(p.envois.supabase === sb && p.envois.ntfy === nt, "Supabase " + statut + " : envois " + JSON.stringify(p.envois));
  }
});

test("Quiz « Animer » : la télécommande du tiroir n'a pas son propre journal", async b => {
  const p = await page(b, { hasTouch: true, viewport: { width: 1280, height: 720 } }, "jeremy.raymond");
  await p.goto(BASE + "quiz.html?animer=1"); await attendre(3000);
  const r = await p.evaluate(() => [...document.querySelectorAll("iframe")].map(f => { try { return !!f.contentWindow.__journalPerf; } catch (e) { return false; } }));
  vrai(!r.some(Boolean), "Un cadre a son propre journal");
  vrai(!p.errs.length, p.errs.join(" | "));
});

test("Administration : chaque onglet s'ouvre; Quoi de neuf se modifie et s'annule", async b => {
  const p = await page(b, {}, "jeremy.raymond");
  await p.goto(BASE + "index.html"); await attendre(500);
  await p.evaluate(() => new Promise(ok => { const r = indexedDB.open("acces", 1); r.onupgradeneeded = () => r.result.createObjectStore("s"); r.onsuccess = () => { const t = r.result.transaction("s", "readwrite"); t.objectStore("s").put({ id: "jeremy.raymond", priv: null }, "session"); t.oncomplete = ok; }; }));
  await p.reload(); await p.waitForFunction(() => window.ACCES && ACCES.session && ACCES.session.admin, null, { timeout: 15000 }); await attendre(2000);
  await p.evaluate(() => ACCES.menu());
  await attendre(300); await p.evaluate(() => { const m = document.querySelector("button[data-a=gerer]"); if (m) m.click(); }); await attendre(2500);
  const tabs = await p.evaluate(() => [...document.querySelectorAll(".acces-onglets [data-ong]")].map(b => b.dataset.ong));
  vrai(tabs.length >= 11 && tabs[0] === "accueil", "Onglets : " + tabs.join(","));
  for (const k of tabs) { await p.click('.acces-onglets [data-ong="' + k + '"]'); await attendre(700);
    const vide = await p.evaluate(k => { const z = document.querySelector('.acces-pane[data-pane="' + k + '"]'); return !z || z.hidden || !z.innerText.trim(); }, k);
    vrai(!vide, "Onglet vide : " + k); }
  await p.click('.acces-onglets [data-ong="nouv"]'); await attendre(800);
  await p.click('.ap-nv[data-i="0"]'); await p.fill("#nvT", "Essai titre"); await attendre(200);
  vrai(/attendent/.test(await p.textContent(".ap-pub .acces-etat")), "La modification n'est pas signalée");
  await p.click("#nvAnn"); await attendre(500);
  vrai(/Tout est publié/.test(await p.textContent(".ap-pub .acces-etat")), "Annuler n'a pas remis la liste");
  vrai(!p.errs.length, p.errs.join(" | "));
});

async function pageAdmin(b) {
  const p = await page(b, {}, "jeremy.raymond");
  await p.goto(BASE + "index.html"); await attendre(400);
  await p.evaluate(() => new Promise(ok => { const r = indexedDB.open("acces", 1); r.onupgradeneeded = () => r.result.createObjectStore("s"); r.onsuccess = () => { const t = r.result.transaction("s", "readwrite"); t.objectStore("s").put({ id: "jeremy.raymond", priv: null }, "session"); t.oncomplete = ok; }; }));
  await p.reload(); await p.waitForFunction(() => window.ACCES && ACCES.session && ACCES.session.admin, null, { timeout: 15000 }); await attendre(2000);
  await p.evaluate(() => ACCES.menu()); await attendre(300); await p.evaluate(() => document.querySelector("button[data-a=gerer]").click()); await attendre(2000);
  p.onglet = async k => { await p.click('.acces-onglets [data-ong="' + k + '"]'); await attendre(800); };
  return p;
}

test("Administration : message, mise à jour forcée, voir comme, Défi+, ajouter un livre", async b => {
  const p = await pageAdmin(b);
  await p.onglet("diff"); await p.fill("#anT", "Essai"); await p.click("#anOk"); await attendre(400);
  vrai(await p.evaluate(() => ACCES_ADMIN.regl().annonce && ACCES_ADMIN.aPublier()), "Message pas prêt à publier");
  await p.onglet("diff"); await p.click("#fmOk"); await attendre(300); vrai(await p.evaluate(() => !!ACCES_ADMIN.regl().forcer), "Mise à jour forcée pas notée");
  await p.onglet("voir"); const av = await p.evaluate(() => LIVRES.filter(l => ACCES.verrouille(l.fichier)).length);
  await p.click("[data-voir]"); await attendre(600);
  vrai(await p.evaluate(() => !!document.getElementById("mpVoir")), "Pas de bandeau « Voir comme »");
  await p.click("#mpVoir button"); await attendre(400);
  vrai(await p.evaluate(() => LIVRES.filter(l => ACCES.verrouille(l.fichier)).length) === av, "Retour au compte incomplet");
  await p.evaluate(() => ACCES.menu()); await attendre(300); await p.evaluate(() => document.querySelector("button[data-a=gerer]").click()); await attendre(1500);
  await p.onglet("defi"); await p.click('[data-ql="5"]'); await attendre(300); await p.click('[data-q="0"]'); await attendre(300); await p.fill("#qQ", "Question modifiée"); await attendre(200);
  vrai(/attendent/.test(await p.textContent(".ap-pub .acces-etat")), "Défi+ : modification non signalée");
  await p.click("#qlAnn"); await attendre(800); vrai(/Tout est publié/.test(await p.textContent(".ap-pub .acces-etat")), "Défi+ : Annuler");
  await p.onglet("ajliv");
  require("fs").writeFileSync("/tmp/livre-essai.html", '<!DOCTYPE html><html><body><div class="page">Un</div><div class="page">Deux</div></body></html>');
  await p.setInputFiles("#lvF", "/tmp/livre-essai.html"); await p.fill("#lvT", "Livre essai test"); await p.click("#lvOk"); await attendre(2500);
  const ex = await p.evaluate(() => ACCES_ADMIN.extra());
  vrai(["livres/livre-essai-test.chiffre", "recherche/livre-essai-test.chiffre", "js/livres.js"].every(k => ex.includes(k)), "Livre pas préparé : " + ex.join(","));
  vrai(!p.errs.length, p.errs.join(" | "));
});

test("Message de l'administrateur et mise à jour forcée chez un enseignant", async b => {
  const ctx = await b.newContext({ serviceWorkers: "block" }); await ctx.addInitScript(() => { localStorage.bienvenueVu = "1"; localStorage.dernierId = "prof.essai"; });
  const q = await ctx.newPage(), R = JSON.parse(require("fs").readFileSync("reglages.json", "utf8"));
  let regl = Object.assign({}, R, { annonce: { id: "x1", texte: "Bonjour", jusqu: "2099-01-01" }, forcer: "2026-01-01T10:00:00Z" });
  await q.route(/reglages\.json/, r => r.fulfill({ body: JSON.stringify(regl), contentType: "application/json" })); await q.route(/supabase\.co|ntfy\.sh/, r => r.fulfill({ status: 204, body: "" }));
  let nav = 0; q.on("framenavigated", f => { if (f === q.mainFrame()) nav++; });
  await q.goto(BASE + "index.html"); await attendre(2500);
  vrai(nav === 1 && await q.evaluate(() => !!document.getElementById("mpAnn")), "Message absent ou rechargement en trop (" + nav + ")");
  await q.click("#mpAnn button"); await q.reload(); await attendre(2000);
  vrai(!(await q.evaluate(() => !!document.getElementById("mpAnn"))), "Le message revient après « Compris »");
  regl.forcer = "2026-01-02T10:00:00Z"; nav = 0; await q.reload(); await attendre(4000);
  vrai(nav === 2, "Mise à jour forcée : " + nav + " chargements (attendu 2)");
  await ctx.close();
});

(async () => {
  const b = await chromium.launch(); let echecs = 0;
  for (const [nom, f] of tests) {
    try { await f(b); console.log("ok   " + nom); }
    catch (e) { echecs++; console.log("ÉCHEC " + nom + "\n     → " + e.message.split("\n")[0]); }
  }
  await b.close();
  console.log(echecs ? "\n" + echecs + " test(s) en échec." : "\nTous les tests passent.");
  process.exit(echecs ? 1 : 0);
})();
