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
  /* 26 nov. (Jeremy : « à la fin d'un Défi+, difficile de quitter ») : gros bouton « Terminer » visible à la fin */
  await p.evaluate(() => window.__finDefi(true)); await attendre(200);
  vrai(await p.$eval("#finDefi", b => !b.hidden && /Terminer/.test(b.textContent) && getComputedStyle(b).position === "fixed"), "Fin du Défi+ : pas de bouton « Terminer »");
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
    vrai(!vide, "Onglet vide : " + k);
    if (await p.$(".ap-plein")) { await p.click("#apRet"); await attendre(300); vrai(!(await p.$(".ap-plein")), "Plein écran : « Retour » ne ferme pas"); } }   /* 25 nov. : outils d'administration en plein écran */
  await p.click('.acces-onglets [data-ong="nouv"]'); await attendre(800);
  await p.click('.ap-nv[data-i="0"]'); await p.fill("#nvT", "Essai titre"); await attendre(200);
  vrai(/attendent/.test(await p.textContent(".ap-pub .acces-etat")), "La modification n'est pas signalée");
  await p.click("#nvAnn"); await attendre(500);
  vrai(/Tout est publié/.test(await p.textContent(".ap-pub .acces-etat")), "Annuler n'a pas remis la liste");
  { const ongS = tabs.find(k => /site/.test(k)); if (ongS) { await p.click('.acces-onglets [data-ong="' + ongS + '"]'); await attendre(800);   /* 26 nov. : heures du magasin */
    vrai((await p.$$(".as-hm .as-hpl")).length === 6, "Heures du magasin : les 6 périodes ne sont pas affichées");
    await p.click("#hFa"); await attendre(300); vrai(/Rouvrir/.test(await p.textContent("#hFa")), "Heures du magasin : « Fermer aujourd'hui » ne fonctionne pas");
    if (process.env.CAPTURES) await (await p.$(".as-hm")).screenshot({ path: process.env.CAPTURES + "/heures-admin.png" });
    await p.click("#hFa"); await attendre(300); } }
  /* 26 nov. (Jeremy) : Administration → Magasin : même plan que le magasinier; une lettre → l'étagère de face; une case → ce qu'elle contient */
  const ongMg = tabs.find(k => /mag/.test(k));
  if (ongMg) { await p.click('.acces-onglets [data-ong="' + ongMg + '"]'); await attendre(1500);
    vrai(!(await p.$("[data-pc]")), "Plan : les anciens champs de cases sont encore là");
    await p.click('#mgPlan [data-l="J"][data-s="0"]'); await attendre(300);
    vrai(!!(await p.$("#mgPlan .ap-face .pm-face")) && !/du bas/.test(await p.textContent("#mgPlan .ap-face")), "Plan : la lettre J n'ouvre pas son étagère de face");
    await p.click('#mgPlan [data-c="J-28"]'); await attendre(300);
    vrai(/J-28/.test(await p.textContent("#mgPlan .ap-case")), "Plan : toucher une case ne montre pas son contenu");
    vrai(await p.$$eval("#mgPlan .ap-ci img, #mgPlan .ap-ci .ap-ci-v", L => L.length) > 0, "Plan : pas de photo dans le contenu de la case");
    await p.click('#mgPlan [data-c="J-5"]'); await attendre(300);
    vrai(/Clapet antiretour/.test(await p.textContent("#mgPlan .ap-case")), "Case J-5 : le raccord écrit « J-05 » n'est pas trouvé");
    await p.click('#mgPlan [data-c="J-28"]'); await attendre(300);
    /* 26 nov. : administrer la case : retirer puis rajouter un raccord, Publier devient actif */
    const nb0 = await p.$$eval("#mgPlan .ap-ci", L => L.length), nom0 = await p.textContent("#mgPlan .ap-ci b");
    await p.click("#mgPlan [data-ret]"); await attendre(200);
    vrai(await p.$$eval("#mgPlan .ap-ci", L => L.length) === nb0 - 1 && await p.$eval("#mgPub", b => !b.disabled), "Case : « Retirer » ne retire pas le raccord ou Publier reste grisé");
    await p.fill("#mgPlan .ap-aj", nom0.split(" ").slice(0, 3).join(" ")); await attendre(200); await p.click("#mgPlan [data-aj]"); await attendre(200);
    vrai(await p.$$eval("#mgPlan .ap-ci", L => L.length) === nb0, "Case : « Ajouter » ne remet pas le raccord dans la case");
    await p.click("#mgAnn"); await attendre(400);
    /* 26 nov. : catalogue simplifié; « Situer » ouvre l'étagère de face avec la case du raccord */
    vrai(await p.$$eval(".ap-mg-r", L => L.length) === 5, "Catalogue : 5 raccords attendus sans recherche");
    await p.fill("#mgQ", "clapet antiretour 1 po F laiton"); await attendre(500);
    vrai(!(await p.$(".ap-mg-l input")), "Catalogue : les champs doivent être fermés (bouton Modifier)");
    await p.evaluate(() => [...document.querySelectorAll(".ap-mg-r")].find(r => r.querySelector("b").textContent.trim() === "Clapet antiretour 1 po F laiton").querySelector("[data-sit]").click()); await attendre(400);
    vrai(/J-5|J-05/.test(await p.textContent("#mgPlan .ap-case")) && !!(await p.$("#mgPlan .ap-face .pm-cl")), "Catalogue : « Situer » ne montre pas la case sur le plan");
    await p.click(".ap-mg-r [data-mod]"); await attendre(300); vrai(!!(await p.$('.ap-mg-ed [data-k="nom"]')), "Catalogue : « Modifier » n'ouvre pas les champs");
    await p.fill("#mgQ", ""); await attendre(300); }
  const cy = await p.evaluate(() => { PlanMagasin.cases = { "2": "6-9, 27-30", "53": "A 1-30" }; const d = document.createElement("div");
    d.innerHTML = PlanMagasin.svg(new Set(["J"]), new Set(), [{ r: "J-28" }, { r: "A-12" }, { r: "J-200" }]); return [...d.querySelectorAll("circle.pm-p")].map(c => +c.getAttribute("cy")); });
  vrai(cy.length === 2 && cy[0] > 126 && cy[0] < 174, "Plan : J-28 hors de la partie 2 (" + cy.join(",") + ")");
  const cy2 = await p.evaluate(() => { PlanMagasin.cases = { "5": "139-165", "6": "215-221", "7": "222-228" }; PlanMagasin.tailles = { "5": 4, "6": 1, "7": 1, "8": 0 }; const d = document.createElement("div");
    d.innerHTML = PlanMagasin.svg(new Set(["J"]), new Set(), [{ r: "J-140" }, { r: "J-164" }, { r: "J-218" }, { r: "J-225" }]); PlanMagasin.tailles = {}; return [...d.querySelectorAll("circle.pm-p")].map(c => +c.getAttribute("cy")); });
  vrai(cy2.length === 4 && cy2[0] < cy2[1] && cy2[1] < cy2[2] && cy2[2] < cy2[3], "Plan : grande étagère puis petites, dans l'ordre (" + cy2.join(",") + ")");
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
  vrai(await p.evaluate(() => ACCES.session.voir === true && LIVRES.some(l => ACCES.verrouille(l.fichier))), "« Voir comme » ne change pas la session ou les cadenas");
  await p.click("#mpVoir button"); await attendre(400);
  vrai(await p.evaluate(() => LIVRES.filter(l => ACCES.verrouille(l.fichier)).length) === av, "Retour au compte incomplet");
  vrai(await p.evaluate(() => !ACCES.session.voir && ACCES.session.admin && !document.body.classList.contains("eleve")), "Retour : session ou mode élève pas remis");
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

test("Élève : toucher un choix (format commun .mp-ch / .mp-vf) l'encercle, retoucher l'enlève", async b => {
  const p = await page(b, { viewport: { width: 1280, height: 800 }, hasTouch: true, serviceWorkers: "block" }, "2608egi1");
  const fs = require("fs"); let h = fs.readFileSync("livres/essai-micro-ordinateur.html", "utf8");
  h = h.replace(/<section class="page cover"/, '<section class="page mp"><div class="mp-q"><p class="mp-qq">Question ?</p><div class="mp-ch" id="tch"><span>Choix un</span><span class="reponse-choix">Choix deux</span><span>Choix trois</span></div><p>Vrai ou faux <span class="mp-vf" id="tvf"><span>Vrai</span><span>Faux</span></span></p></div></section><section class="page cover"');
  await p.route(/livres\/essai-micro-ordinateur\.html/, r => r.fulfill({ body: h, contentType: "text/html" }));
  /* 25 nov. : réponses de l'élève chiffrées dans Supabase (coffre) avec la clé de sa carte */
  const SAV = {}; const coffre = async pg => pg.route(/supabase\.co\/rest\/v1\/rpc\/coffre_(lire|ecrire|effacer)/, r => { const f = r.request().url().match(/coffre_(\w+)/)[1], a = JSON.parse(r.request().postData() || "{}");
    let o = true; if (f === "lire") o = SAV[a.p_id] ? [{ data: SAV[a.p_id] }] : []; else if (f === "effacer") delete SAV[a.p_id]; else SAV[a.p_id] = a.p_data; r.fulfill({ body: JSON.stringify(o), contentType: "application/json", headers: { "access-control-allow-origin": "*" } }); });
  await coffre(p);
  await p.goto(BASE + "index.html"); await attendre(400);
  await p.evaluate(() => new Promise(ok => { const r = indexedDB.open("acces", 1); r.onupgradeneeded = () => r.result.createObjectStore("s"); r.onsuccess = () => { const t = r.result.transaction("s", "readwrite"); t.objectStore("s").put({ id: "2608egi1", priv: null }, "session"); t.oncomplete = ok; }; }));
  await p.reload(); await p.waitForFunction(() => window.ACCES && ACCES.eleve, null, { timeout: 15000 }); await attendre(1500);
  await p.evaluate(() => lire(LIVRES.find(l => l.fichier === "essai-micro-ordinateur"))); await attendre(600);
  vrai(!!(await p.$("#elQui")), "Élève : « Qui es-tu ? » ne paraît pas avant le livre");
  await p.fill("#elC", "MP-12345-K7Q9X2"); await p.press("#elC", "Enter");
  await p.waitForFunction(() => { const f = document.getElementById("readerFrame"); return f && f.contentDocument && f.contentDocument.getElementById("tch"); }, null, { timeout: 15000 }); await attendre(1500);
  const centre = sel => p.evaluate(sel => { const f = document.getElementById("readerFrame"), fr = f.getBoundingClientRect(), d = f.contentDocument, e = d.querySelector(sel); e.scrollIntoView({ block: "center" });
    const r = e.getBoundingClientRect(), k = fr.width / (f.contentWindow.innerWidth || fr.width); return [fr.left + (r.left + r.width / 2) * k, fr.top + (r.top + r.height / 2) * k]; }, sel);
  const n = () => p.evaluate(() => (INKS[inkKey()] || []).filter(o => o.coche).length);
  let [x, y] = await centre("#tch>span:nth-child(3)"); await attendre(400); [x, y] = await centre("#tch>span:nth-child(3)");
  await p.evaluate(([x, y]) => ecrireIci(x, y), [x, y]); await attendre(400);
  vrai(await n() === 1, "Le choix n'est pas encerclé (" + await n() + ")");
  [x, y] = await centre("#tvf>span:nth-child(2)"); await p.evaluate(([x, y]) => ecrireIci(x, y), [x, y]); await attendre(400);
  vrai(await n() === 2, "Le V/F n'est pas encerclé (" + await n() + ")");
  await p.evaluate(([x, y]) => ecrireIci(x, y), [x, y]); await attendre(400);
  vrai(await n() === 1, "Retoucher n'enlève pas le rond");
  vrai(!(await p.evaluate(() => document.getElementById("readerFrame").contentDocument.body.classList.contains("answers"))), "Les réponses sont visibles pour l'élève");
  /* sa réponse est chiffrée dans son coffre; sur un autre appareil (à la maison), avec sa carte, il la retrouve */
  await attendre(3500); const ids = Object.keys(SAV); vrai(ids.length === 2 && ids.every(i => !/Choix|coche|essai/.test(SAV[i])), "Réponses pas envoyées, ou envoyées en clair : " + JSON.stringify(SAV).slice(0, 120));
  vrai(await p.evaluate(() => Object.keys(INKS).some(k => k.startsWith("e12345|"))), "Les réponses ne sont pas rangées au nom de l'élève");
  await p.evaluate(() => document.getElementById("readerEleve").click()); await attendre(800);
  vrai(await p.evaluate(() => !Object.keys(INKS).some(k => k.startsWith("e12345|") && INKS[k].length)), "« Changer d'élève » laisse ses réponses sur l'appareil");
  const p2 = await page(b, { viewport: { width: 1280, height: 800 }, hasTouch: true, serviceWorkers: "block" }, "2608egi1");
  await p2.route(/livres\/essai-micro-ordinateur\.html/, r => r.fulfill({ body: h, contentType: "text/html" })); await coffre(p2);
  await p2.goto(BASE + "index.html"); await attendre(400);
  await p2.evaluate(() => new Promise(ok => { const r = indexedDB.open("acces", 1); r.onupgradeneeded = () => r.result.createObjectStore("s"); r.onsuccess = () => { const t = r.result.transaction("s", "readwrite"); t.objectStore("s").put({ id: "2608egi1", priv: null }, "session"); t.oncomplete = ok; }; }));
  await p2.reload(); await p2.waitForFunction(() => window.ACCES && ACCES.eleve, null, { timeout: 15000 }); await attendre(1200);
  await p2.evaluate(() => lire(LIVRES.find(l => l.fichier === "essai-micro-ordinateur"))); await attendre(600); await p2.fill("#elC", "MP-12345-K7Q9X2"); await p2.press("#elC", "Enter");
  await p2.waitForFunction(() => { const f = document.getElementById("readerFrame"); return f && f.contentDocument && f.contentDocument.getElementById("tch"); }, null, { timeout: 15000 }); await attendre(1500);
  vrai(await p2.evaluate(() => (INKS[inkKey()] || []).filter(o => o.coche).length) === 1, "Autre appareil : l'élève ne retrouve pas sa réponse");
  /* carte perdue (25 nov.) : l'administrateur donne une nouvelle clé; les réponses suivent, l'ancienne clé ne donne plus rien */
  await attendre(3000); await p2.addScriptTag({ url: BASE + "js/eleve-cartes.js" });
  const tr = await p2.evaluate(async () => { const n = await ELEVE_CARTES.transferer("12345", "K7Q9X2", "NOUV23"); return { n, nouv: await ELEVE_CARTES.livres("12345", "NOUV23"), vieux: await ELEVE_CARTES.livres("12345", "K7Q9X2") }; });
  vrai(tr.n === 1 && tr.nouv.includes("essai-micro-ordinateur") && !tr.vieux.length, "Nouvelle carte : transfert raté " + JSON.stringify(tr));
  vrai(!p2.errs.length, p2.errs.join(" | ")); await p2.context().close();
  vrai(!p.errs.length, p.errs.join(" | "));
});

test("Élève : écrire sur une ligne, dans une case de tableau, dans une zone de développement, cocher une liste (.mp-coche)", async b => {
  const p = await page(b, { viewport: { width: 1280, height: 800 }, hasTouch: true, serviceWorkers: "block" }, "2608egi1");
  await p.context().addInitScript(() => sessionStorage.setItem("eleveMoi", JSON.stringify({ c: "12345", k: "K7Q9X2" })));
  await p.route(/supabase\.co/, r => r.fulfill({ body: "[]", contentType: "application/json", headers: { "access-control-allow-origin": "*" } }));
  let h = require("fs").readFileSync("livres/essai-micro-ordinateur.html", "utf8");
  h = h.replace(/<section class="page cover"/, '<style>.mp-coche{list-style:none;padding-left:4px}.mp-coche li::before{content:"";display:inline-block;width:11px;height:11px;border:1.5px solid #8a96a0;border-radius:3px;margin-right:8px}</style><section class="page mp"><div class="mp-lig" id="tlig" style="height:93px"></div><table class="mp-tab"><tr><th>A</th><th>B</th></tr><tr><td>Tuyau</td><td id="tcell"></td></tr></table><ul class="mp-coche"><li id="tco">Item</li></ul><div id="tzone" style="height:140px;border:1px solid #999"></div></section><section class="page cover"');
  await p.route(/livres\/essai-micro-ordinateur\.html/, r => r.fulfill({ body: h, contentType: "text/html" }));
  await p.goto(BASE + "index.html"); await attendre(400);
  await p.evaluate(() => new Promise(ok => { const r = indexedDB.open("acces", 1); r.onupgradeneeded = () => r.result.createObjectStore("s"); r.onsuccess = () => { const t = r.result.transaction("s", "readwrite"); t.objectStore("s").put({ id: "2608egi1", priv: null }, "session"); t.oncomplete = ok; }; }));
  await p.reload(); await p.waitForFunction(() => window.ACCES && ACCES.eleve, null, { timeout: 15000 }); await attendre(1200);
  await p.evaluate(() => lire(LIVRES.find(l => l.fichier === "essai-micro-ordinateur")));
  await p.waitForFunction(() => { const f = document.getElementById("readerFrame"); return f && f.contentDocument && f.contentDocument.getElementById("tlig"); }, null, { timeout: 15000 }); await attendre(1500);
  const centre = sel => p.evaluate(sel => { const f = document.getElementById("readerFrame"), fr = f.getBoundingClientRect(), e = f.contentDocument.querySelector(sel); e.scrollIntoView({ block: "center" });
    const r = e.getBoundingClientRect(), k = fr.width / (f.contentWindow.innerWidth || fr.width); return [fr.left + (r.left + Math.min(r.width / 2, 60)) * k, fr.top + (r.top + Math.min(r.height / 2, 14)) * k]; }, sel);
  const n = () => p.evaluate(() => (INKS[inkKey()] || []).length);
  for (const sel of ["#tlig", "#tcell", "#tco", "#tzone"]) { let [x, y] = await centre(sel); await attendre(300); [x, y] = await centre(sel); const a = await n();
    await p.evaluate(([x, y]) => ecrireIci(x, y), [x, y]); await attendre(300);
    if (sel !== "#tco") { await p.keyboard.type("Rep", { delay: 10 }); await attendre(150); await p.mouse.click(1250, 60); await attendre(500); }
    vrai(await n() === a + 1, "Élève : rien d'enregistré pour " + sel); }
  vrai(!p.errs.length, p.errs.join(" | "));
});

test("Élève : entrer avec sa carte (sans mot de passe) une fois les cartes du groupe activées par l'administrateur", async b => {
  const sub = crypto.subtle, enc = new TextEncoder();
  const kp = await sub.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]), jwk = await sub.exportKey("jwk", kp.privateKey);
  const sel = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const cm = await sub.deriveKey({ name: "PBKDF2", salt: sel, iterations: 250000, hash: "SHA-256" }, await sub.importKey("raw", enc.encode("motdepasse1"), "PBKDF2", false, ["deriveKey"]), { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
  const d = Buffer.from(jwk.d, "base64url"), ct = new Uint8Array(await sub.encrypt({ name: "AES-GCM", iv }, cm, d)), B = x => Buffer.from(x).toString("base64");
  const C = JSON.parse(require("fs").readFileSync("comptes.json", "utf8"));
  C.comptes["essai.groupe"] = { nom: "Essai groupe", eleve: true, pub: { kty: "EC", crv: "P-256", x: jwk.x, y: jwk.y }, priv: { s: B(sel), i: B(iv), c: B(ct) }, prog: [] };
  const SAV = {}, prep = async pg => { await pg.route(/comptes\.json/, r => r.fulfill({ body: JSON.stringify(C), contentType: "application/json" }));
    await pg.route(/supabase\.co\/rest\/v1\/rpc\/coffre_(lire|ecrire|effacer)/, r => { const f = r.request().url().match(/coffre_(\w+)/)[1], a = JSON.parse(r.request().postData() || "{}");
      let o = true; if (f === "lire") o = SAV[a.p_id] ? [{ data: SAV[a.p_id] }] : []; else if (f === "effacer") delete SAV[a.p_id]; else SAV[a.p_id] = a.p_data; r.fulfill({ body: JSON.stringify(o), contentType: "application/json", headers: { "access-control-allow-origin": "*" } }); }); };
  const p = await page(b, { serviceWorkers: "block" }, "jeremy.raymond"); await prep(p);
  await p.goto(BASE + "index.html"); await attendre(400);
  await p.evaluate(() => new Promise(ok => { const r = indexedDB.open("acces", 1); r.onupgradeneeded = () => r.result.createObjectStore("s"); r.onsuccess = () => { const t = r.result.transaction("s", "readwrite"); t.objectStore("s").put({ id: "jeremy.raymond", priv: null }, "session"); t.oncomplete = ok; }; }));
  await p.reload(); await p.waitForFunction(() => window.ACCES && ACCES.session, null, { timeout: 15000 }); await attendre(800);
  let n = await p.evaluate(async () => { try { return await ACCES.activerCartes("essai.groupe", "mauvais", [{ c: "12345", k: "K7Q9X2" }]); } catch(e){ return e.message; } });
  vrai(/incorrect/.test(n), "Mauvais mot de passe accepté : " + n);
  n = await p.evaluate(() => ACCES.activerCartes("essai.groupe", "motdepasse1", [{ c: "12345", k: "K7Q9X2" }]));
  vrai(n === 1 && Object.keys(SAV).length === 1 && !/essai\.groupe/.test(Object.values(SAV)[0]), "Activation : " + n + " " + JSON.stringify(SAV).slice(0, 100));
  const q = await page(b, { serviceWorkers: "block" }); await prep(q);
  await q.goto(BASE + "index.html"); await q.waitForFunction(() => window.ACCES && ACCES.estPret, null, { timeout: 15000 }); await attendre(600);
  await q.evaluate(() => ACCES.dlgConnexion()); await attendre(400);
  await q.fill("#acCarte", "MP-12345-K7Q9X2"); await q.waitForFunction(() => window.ACCES && ACCES.session && ACCES.session.id === "essai.groupe", null, { timeout: 15000 });
  vrai(await q.evaluate(() => ACCES.eleve && ELEVE_REP.moi && ELEVE_REP.moi.c === "12345"), "Carte : session ou identité de l'élève manquante");
  q.ctx = q.context(); await q.evaluate(() => {}); const r2 = await q.evaluate(async () => { try { await ACCES.connexionCarte("MP-12345-ZZZZZZ"); return "ok"; } catch(e){ return e.message; } });
  vrai(r2 !== "ok", "Une mauvaise carte ouvre le compte");
  vrai(!p.errs.length && !q.errs.length, p.errs.concat(q.errs).join(" | ")); await p.context().close(); await q.context().close();
});

test("Magasin : l'élève (carte scannée) envoie son panier, l'enseignant approuve, le magasinier filtre par code et remet", async b => {
  const P = [], A = [];
  /* 25 nov. : prénom publié chiffré avec la clé de la carte (comme passeport.html nomsPub) */
  const te = new TextEncoder(), cle = await crypto.subtle.importKey("raw", await crypto.subtle.digest("SHA-256", te.encode("metier+|carte|12345|K7Q9X2")), "AES-GCM", false, ["encrypt"]);
  const iv = crypto.getRandomValues(new Uint8Array(12)), ENC = Buffer.from([...iv, ...new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, cle, te.encode("Essai")))]).toString("base64");
  const AC = [];
  const mock = async ctx => ctx.route(/supabase\.co\/rest\/v1\/rpc\/(\w+)/, async r => { const f = r.request().url().match(/rpc\/(\w+)/)[1].replace(/_c$/, ""), a = JSON.parse(r.request().postData() || "{}"); let o = f === "magasin_cle_verifier" ? true : null;
    if (f === "coffre_lire") o = [{ data: JSON.stringify({ grp: ["2608 EGI"], codes: { "2608 EGI": ["12345", "45678"] }, noms: { "12345": ENC } }) }];
    else if (f === "panier_envoyer") { P.push({ id: "id" + P.length, etat: "attente", t: new Date().toISOString(), ens: a.p_ens, groupe: a.p_groupe, code: a.p_code, prenom: a.p_prenom, items: a.p_items, note: a.p_note }); o = { ok: true, id: "id" + (P.length - 1) }; }
    else if (f === "panier_etat") { const x = P.find(p => p.id === a.p_id) || {}; o = { etat: x.etat, motif: x.motif, items: x.etat === "attente" ? x.items : null, note: x.etat === "attente" ? x.note : null }; }
    else if (f === "magasin_acommander_ajouter") { AC.push({ id: AC.length + 1, n: a.p_n, nom: a.p_nom, q: a.p_q, note: a.p_note, fait: false, t: new Date().toISOString() }); o = true; }
    else if (f === "magasin_acommander_liste") o = AC;
    else if (f === "magasin_acommander_maj") { const k = AC.findIndex(x => x.id === a.p_id); if (a.p_retirer) AC.splice(k, 1); else AC[k].fait = a.p_fait; o = true; }
    else if (f === "panier_modifier") { const x = P.find(p => p.id === a.p_id && p.code === a.p_code && p.etat === "attente"); if (x) { x.items = a.p_items; x.note = a.p_note; } o = x ? { ok: true } : { ok: false, err: "déjà traité" }; }
    else if (f === "panier_annuler") { const k = P.findIndex(p => p.id === a.p_id && p.code === a.p_code && p.etat === "attente"); if (k >= 0) P.splice(k, 1); o = k >= 0; }
    else if (f === "panier_prof_regler") o = true;
    else if (f === "panier_prof_lire") o = P;
    else if (f === "panier_signaler") { const x = P.find(p => p.id === a.p_id); A.push({ id: "a" + A.length, t: new Date().toISOString(), panier: a.p_id, regle: a.p_regle, code: x.code, groupe: x.groupe, prenom: x.prenom }); o = { ok: true }; }
    else if (f === "panier_signalements") o = A.filter(x => a.p_ids.includes(x.panier));
    else if (f === "panier_prof_avis") o = A.filter(x => !x.vu);
    else if (f === "panier_avis_vu") { const x = A.find(y => y.id === a.p_id); if (x) x.vu = 1; o = true; }
    else if (f === "panier_decider") { const p = P.find(x => x.id === a.p_id); p.etat = a.p_ok ? "approuve" : "refuse"; p.motif = a.p_motif; p.t_app = new Date().toISOString(); o = true; }
    else if (f === "panier_magasin") o = P.filter(p => p.etat === "approuve" || p.etat === "remis");
    else if (f === "panier_remettre") { const p = P.find(x => x.id === a.p_id); p.etat = a.p_remis ? "remis" : "approuve"; p.t_remis = new Date().toISOString(); o = true; }
    r.fulfill({ body: JSON.stringify(o), contentType: "application/json", headers: { "access-control-allow-origin": "*" } }); });
  const errs = [];
  const c1 = await b.newContext({ viewport: { width: 820, height: 1180 }, hasTouch: true, serviceWorkers: "block" }); await mock(c1);
  const p = await c1.newPage(); p.on("pageerror", e => errs.push(e.message));
  await p.goto(BASE + "magasin.html?e=jeremy.raymond"); await attendre(800);
  await p.fill("#cCode", "MP-12345-K7Q9X2"); await p.keyboard.press("Enter"); await attendre(1200);
  vrai(/12345/.test(await p.textContent("#tQui")), "Carte scannée : élève pas reconnu");
  vrai(/Bonjour Essai/.test(await p.textContent("#tQui")), "Carte scannée : le prénom ne vient pas de la carte (" + await p.textContent("#tQui") + ")");
  await attendre(500); vrai(/Activer les notifications/.test(await p.textContent("#notifE")) && !!(await p.$("#notifE .cloche")), "Élève : la cloche « Activer les notifications » est absente");
  await p.fill("#fQ", "coude 90 abs 2"); await attendre(300);
  const res = await p.$$eval(".art .tx b", L => L.map(x => x.textContent));
  vrai(res.length >= 1 && /^Coude 90° ABS 2 po/.test(res[0]), "Recherche : " + res.join(" | "));
  /* 26 nov. : recherche flexible (anglicismes, synonymes, pluriels) */
  for (const [q, re] of [["cuode 3/4 cuivre", /^coude.*cuivre 3\/4/i], ["je cherche un té de 3/4 en cuivre", /^té cuivre 3\/4/i], ["coude ¾ cuivre", /coude.*3\/4/i], ["copper elbow", /coude/i], ["ball valve", /robinet/i], ["nipple noir", /mamelon/i], ["coudes ABS", /coude.*abs/i], ["uponor", /PEX-A/], ["valve 1/2", /robinet|clapet|soupape|vanne/i], ["check valve", /clapet/i]]) {
    await p.fill("#fQ", q); await attendre(250); const r1 = await p.$$eval("#liste .art b", L => L.map(x => x.textContent));
    vrai(r1.length > 0 && re.test(r1[0]), "Recherche « " + q + " » : " + (r1[0] || "rien")); }
  await p.fill("#fQ", "raccord purge"); await attendre(300);
  vrai(await p.$("#liste .art .ph.vide img[src*=metier-plus]"), "Article sans photo : le logo Métier+ ne s'affiche pas");
  await p.fill("#fQ", ""); await attendre(200);
  await p.fill("#fQ", "té cuivre 3/4"); await attendre(300);
  const r2 = await p.$$eval(".art .tx b", L => L.map(x => x.textContent)); vrai(r2.length >= 1 && r2.every(x => /^Té /.test(x)), "« té » trouve aussi : " + r2.join(" | "));
  await p.click(".art .aj"); await p.click(".art [data-m='1']"); await attendre(200);
  await p.click("#bVoir"); await attendre(300); await p.click("#pEnv"); await attendre(1200);
  vrai(P.length === 1 && P[0].code === "12345" && P[0].items[0].q === 2, "Panier mal envoyé : " + JSON.stringify(P));
  /* 25 nov. (Jeremy) : l'élève modifie son panier tant qu'il est en attente, ou l'annule */
  p.on("dialog", d => d.accept());
  await p.waitForSelector("details.mesP", { timeout: 4000 }); await p.$eval("details.mesP", d => d.open = true);
  await p.waitForSelector("[data-mod]", { timeout: 4000 }); await p.click("[data-mod]"); await attendre(400);
  vrai(/Enregistrer les changements/.test(await p.textContent("#pEnv")), "Modifier : le panier ne s'ouvre pas en modification");
  await p.fill("#pNote", "Cabine 4"); await p.click("#pEnv"); await attendre(1000);
  vrai(P.length === 1 && P[0].note === "Cabine 4" && P[0].items[0].q === 2, "Modification non enregistrée : " + JSON.stringify(P));
  await p.click(".art .aj"); await p.click("#bVoir"); await attendre(300); await p.click("#pEnv"); await attendre(1200);
  vrai(P.length === 2, "Deuxième panier non envoyé"); await p.evaluate(() => suivi()); await attendre(800);
  await p.click(`[data-ann="${P[1].id}"]`); await attendre(1000);
  vrai(P.length === 1 && !(await p.$(`[data-ann="id1"]`)), "Annulation : le panier reste");
  const c2 = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, serviceWorkers: "block" }); await mock(c2);
  await c2.addInitScript(() => { localStorage.dernierId = "jeremy.raymond"; });
  const q = await c2.newPage(); q.on("pageerror", e => errs.push(e.message));
  await q.goto(BASE + "magasin.html?mode=prof"); await attendre(800); await q.click("#aOk"); await attendre(1200); await q.click("[data-ok]"); await attendre(1000);
  { const e2 = await q.context().newPage(); await e2.goto(BASE + "magasin.html?mode=prof"); await attendre(1200); await e2.click(".edB"); await attendre(2000);   /* 26 nov. : écran « Magasin en direct » ouvert par l'enseignant, sans NIP */
    vrai(!!(await e2.$(".ed-k")) && !(await e2.$("#nip, .nip")), "Magasin en direct : l'écran ne s'ouvre pas depuis la page enseignant");
    vrai(/Essai/.test(await e2.textContent(".ed")), "Magasin en direct : la commande approuvée n'apparaît pas");
    if (process.env.CAPTURES) await e2.screenshot({ path: process.env.CAPTURES + "/ecran-direct.png" }); await e2.close(); }
  vrai(P[0].etat === "approuve", "Approbation : " + P[0].etat);
  const c3 = await b.newContext({ viewport: { width: 1366, height: 768 }, serviceWorkers: "block" }); await mock(c3);
  const m = await c3.newPage(); m.on("pageerror", e => errs.push(e.message));
  { const n = await m.context().newPage(); await n.goto(BASE + "magasin.html?mode=magasin"); await attendre(900);   /* sans NIP : le comptoir le demande */
    vrai(!!(await n.$("#nip")) && !(await n.$("#mC")), "Comptoir ouvert sans NIP"); await n.fill("#nip", "123456"); await attendre(900); vrai(!!(await n.$("#mC")), "Bon NIP : le comptoir ne s'ouvre pas"); await n.close(); }
  await m.addInitScript(() => { localStorage.magCle = JSON.stringify("e".repeat(64)); });   /* NIP du comptoir déjà entré sur cet appareil */
  await m.goto(BASE + "magasin.html?mode=magasin"); await attendre(1500);
  /* 25 nov. (Jeremy) : le magasinier déclare une pièce à commander (catalogue), elle s'additionne dans la liste */
  await m.click("#mAc"); await attendre(400); await m.fill("#acQ", "coude 90 abs 2"); await attendre(300); await m.click("[data-ac]"); await m.click('[data-nq="25"]'); await m.click("#acAj"); await attendre(800);
  vrai(AC.length === 1 && AC[0].q === 25 && /ABS/.test(AC[0].nom) && AC[0].n, "Pièce à commander mal enregistrée : " + JSON.stringify(AC));
  vrai(/25/.test(await m.textContent("#acL")), "La liste du comptoir n'affiche pas la pièce");
  vrai(!!(await m.$("#acL .ac-l .ph")), "Pièces à commander : pas de photo dans la liste");
  await m.click("#acF"); await attendre(300);
  await m.keyboard.type("MP-45678-AAAAAA"); await m.keyboard.press("Enter"); await attendre(300);
  vrai(!(await m.$("[data-rem]")), "Code 45678 : la commande de 12345 s'affiche");
  await m.keyboard.type("MP-12345-K7Q9X2"); await m.keyboard.press("Enter"); await attendre(300);
  vrai(!!(await m.$("[data-rem]")), "Code 12345 : commande absente");
  vrai(/^[A-Z]-\d+/.test((await m.textContent("td.rg")).trim()), "Rangée absente au comptoir");
  vrai(!!(await m.$(".cmd td.vg .ph")), "Comptoir : la photo du raccord ne s'affiche pas");
  vrai(!!(await m.$(".cmd .etapes .et.cours")), "Comptoir : la barre d'étapes est absente");
  vrai(!!(await m.$("#app .avis-l .cloche svg")) && !/Activer sur cet appareil/.test(await m.textContent("#app")), "Comptoir : la cloche des avis remplace le bouton");
  vrai(/Essai/.test(await m.textContent(".cmd .pr")), "Prénom absent au comptoir");
  /* 26 nov. : un article rangé dans plusieurs cases montre toutes ses cases (ex. coude 90° acier 3/4 : F-90, F-91, F-104) */
  const mc = await m.evaluate(() => { const a = CAT.find(x => (x.r2 || []).length); return a ? [rangee({ id: a.id }), autresCases({ id: a.id }).length, aussi({ id: a.id })] : null; });
  vrai(mc && mc[0] && mc[1] >= 1 && /aussi/.test(mc[2]), "Cases multiples non affichées : " + JSON.stringify(mc));
  vrai(await m.evaluate(() => caseTxt("G-00") === "G (tablette du haut)" && caseTxt("F-91") === "F-91"), "Case -00 : « tablette du haut » absent");
  /* 25 nov. : les commandes approuvées d'un même élève se rassemblent en une seule carte (quantités additionnées) */
  const rg = await m.evaluate(() => { const L = regrouper([{ id: "a", code: "11111", items: [{ id: "x", n: "X", q: 2 }] }, { id: "b", code: "11111", items: [{ id: "x", n: "X", q: 1 }, { id: "y", n: "Y", q: 1 }] }, { id: "c", code: "22222", items: [] }]);
    return L.map(p => (p.ids || [p.id]).join("+") + ":" + (p.items || []).map(i => i.n + i.q).join(",")); });
  vrai(rg.join(" ") === "a+b:X3,Y1 c:", "Commandes non rassemblées : " + rg.join(" "));
  if (process.env.CAPTURES) await m.screenshot({ path: process.env.CAPTURES + "/comptoir.png" });
  await m.$$eval("details.regl", L => L.forEach(d => d.open = true));
  await m.click("[data-sig$='|2']"); await attendre(400);
  vrai(A.length === 0 && !!(await m.$("[data-sig$='|2'].att")), "Règlement : doit attendre la confirmation « Remis » : " + JSON.stringify(A));
  await m.click("[data-prep]"); await attendre(400);
  if (process.env.CAPTURES) await m.screenshot({ path: process.env.CAPTURES + "/plan.png" });
  vrai(await m.$$eval(".pm-s.actif", L => L.length) > 0, "Plan : aucune rangée ne clignote");
  vrai(await m.$$eval(".prep-i .ph", L => L.length) > 0, "Préparation : pas de photo à côté des raccords");
  /* 26 nov. : trajet « GPS » depuis la fenêtre : ordre de cueillette, départ dessiné */
  const tr = await m.evaluate(() => { const rs = ["J-145", "J-28", "J-216"], o = PlanMagasin.ordre(rs), svg = PlanMagasin.svg(new Set(["J"]), new Set(), o.map((i, k) => ({ r: rs[i], n: k + 1, proch: !k })), { trajet: true }); return [o.length, /Départ/.test(svg), /pm-trajet/.test(svg)]; });
  vrai(tr[0] === 3 && tr[1] && tr[2], "Trajet : ordre ou chemin absent (" + tr.join(",") + ")");
  /* 26 nov. : une 2e commande approuvée du même élève s'ajoute à la préparation ouverte */
  const avant = await m.$$eval(".prep-i", L => L.length);
  await m.evaluate(() => { const a = MAG.find(x => x.etat === "approuve" && x.code === "12345"), c = CAT.find(x => !a.items.some(i => i.id === x.id));
    MAG.push(Object.assign({}, a, { id: "essai-2e", items: [{ id: c.id, n: c.n, nom: c.nom, q: 1, r: c.r }], t_app: new Date().toISOString() })); PREP_MAJ(); });
  await attendre(200);
  vrai(await m.$$eval(".prep-i", L => L.length) === avant + 1, "2e commande du même élève : pas ajoutée à la préparation ouverte");
  await m.evaluate(() => { MAG = MAG.filter(x => x.id !== "essai-2e"); PREP_MAJ(); }); await attendre(200);
  vrai(await m.$$eval(".prep-i.proch", L => L.length) === 1 && await m.$$eval(".prep-plan circle.pm-p:not(.fait)", L => L.length) <= 1, "Plan : seul le prochain raccord doit être montré");
  await m.click(".prep-plan svg [data-l]"); await attendre(300); vrai(!!(await m.$(".prep-face .pm-face")), "Plan : la lettre n'ouvre pas la vue de face");
  await m.click("#prFace"); await attendre(200); vrai(!(await m.$(".prep-face")), "Vue de face : « Fermer » ne ferme pas");
  /* 26 nov. : vue de face = seulement l'étagère touchée; rangée pas encore entrée = « Vue de face à venir » */
  const vf = await m.evaluate(() => [PlanMagasin.vueFace("J", [], 0), PlanMagasin.vueFace("J", [], 1), PlanMagasin.vueFace("H", [], 0)]);
  vrai(/haut/.test(vf[0]) && !/du bas/.test(vf[0]) && /du bas/.test(vf[1]) && !/du haut/.test(vf[1]), "Vue de face : les deux étagères J s'affichent au lieu d'une");
  vrai(/à venir/.test(vf[2]), "Vue de face : une rangée sans cases devrait dire « à venir »");
  vrai(await m.evaluate(() => /#F2C230/.test(PlanMagasin.vueFace("J", [], 1)) && PlanMagasin.place("J-145")), "Vue de face : les cases jaunes 143-152 (partie 5) ne sont pas jaunes ou plus placées");
  for (const c of await m.$$("[data-k]")) { await c.click(); await attendre(150); }
  vrai(await m.$$eval(".pm-s.actif", L => L.length) === 0, "Plan : une rangée clignote encore après tout coché");
  await m.click("#prOk"); await attendre(400); vrai(P[0].etat === "remis", "Remis : " + P[0].etat);
  vrai(A.length === 1 && A[0].regle === 2, "Règlement pas envoyé à la confirmation « Remis » : " + JSON.stringify(A));
  vrai(!!(await m.$(".cmd.fin.repli")), "Commande remise : pas repliée au comptoir");
  await m.click(".cmd.fin .fl"); await attendre(200); vrai(!(await m.$(".cmd.fin.repli")), "Flèche : ne rouvre pas la commande");
  /* refus avec commentaire (25 nov.) : deuxième panier, refusé avec motif, l'élève voit le commentaire */
  await p.evaluate(() => { const i = document.querySelector(".art img"); if (i) i.dataset.garde = "1"; });   /* 26 nov. : la photo ne doit pas être recréée (flash) */
  await p.click(".art .aj"); await attendre(200); vrai(await p.evaluate(() => !document.querySelector(".art img") || !!document.querySelector(".art img[data-garde]")), "Ajouter au panier : la photo est recréée (flash)"); await p.click("#bVoir"); await attendre(300);   /* 26 nov. : vider le panier en deux touches */
  await p.click("#pVid"); vrai(/encore/.test(await p.textContent("#pVid")), "Vider le panier : pas de confirmation"); await p.click("#pVid"); await attendre(400);
  vrai(await p.$eval("#barre", b => b.hidden) && await p.$eval("#ov", o => o.hidden), "Vider le panier : le panier n'est pas vidé");
  { const h = await p.context().newPage(); await h.goto(BASE + "magasin.html"); await h.evaluate(() => localStorage.magHeuresTest = "true");   /* 26 nov. : heures du magasin — fermé = pas d'envoi */
    await h.route(/reglages\.json/, r => r.fulfill({ body: JSON.stringify({ magasinHeures: { jours: [], plages: [["08:00", "09:00"]], fermes: [] } }), contentType: "application/json" }));
    await h.goto(BASE + "magasin.html"); await attendre(1500); vrai(/Magasin fermé/.test(await h.textContent(".mgEtat")), "Heures : l'état « fermé » n'est pas affiché");
    await h.click(".mgEtat"); await attendre(300); vrai((await h.$$(".hOv .hL.o")).length === 1, "Heures : toucher le bandeau n'ouvre pas l'horaire"); await h.click(".hOv [data-hf]"); await attendre(200);
    await h.click(".art .aj"); await attendre(200); await h.click("#bVoir"); await attendre(300);
    vrai(await h.$eval("#pEnv", b => b.disabled && /fermé/.test(b.textContent)) && !!(await h.$(".fermeN")), "Heures : le panier part même quand le magasin est fermé");
    if (process.env.CAPTURES) await h.screenshot({ path: process.env.CAPTURES + "/ferme.png" }); { const e = await h.evaluate(() => { HEURES = HEURES_DEF; return [etatMag(new Date(2026, 10, 26, 11, 45)), etatMag(new Date(2026, 10, 26, 9, 32)), etatMag(new Date(2026, 10, 26, 12, 10)), etatMag(new Date(2026, 10, 27, 17, 0)), etatMag(new Date(2026, 10, 26, 9, 25))].map(etatTxt); });
      vrai(/ferme bientôt.*11 h 50.*5 min/.test(e[0]) && /^Magasin ouvert · ferme à 9 h 30/.test(e[4]) && /fermé · rouvre à 9 h 35/.test(e[1]) && /rouvre à 13 h 00/.test(e[2]) && /rouvre lundi à 8 h 30/.test(e[3]), "Heures : états faux : " + e.join(" | ")); }
    await h.evaluate(() => localStorage.removeItem("magHeuresTest")); await h.close(); }
  await p.click(".art .aj"); await attendre(200); await p.click("#bVoir"); await attendre(300); await p.click("#pEnv"); await attendre(1200);
  await q.reload(); await attendre(1500);
  vrai(/Sans carte étudiante/.test(await q.textContent(".avisMag")), "L'enseignant ne voit pas l'avis du magasinier");
  vrai(!!(await q.$(".mgEtat")), "Enseignant : pas de bandeau ouvert / fermé du magasin");   /* 26 nov. */
  vrai(await q.$eval(".avisMag .avm", e => e.getBoundingClientRect().width > 250 && getComputedStyle(e).borderRadius === "0px"), "Avis du magasinier : la ligne est écrasée (style d'avatar)");   /* 26 nov., capture de Jeremy */
  if (process.env.CAPTURES) await q.screenshot({ path: process.env.CAPTURES + "/prof-avis.png" });
  vrai(!!(await q.$(".cmd td.vg img, .cmd td.vg svg, .cmd td.vg .vig")), "Enseignant : pas de photo dans la commande à approuver");   /* 26 nov. */
  await q.click("[data-vu]"); await attendre(900); vrai(!(await q.$(".avisMag")) && A.length === 1, "« Vu » : l'avis reste affiché ou est effacé");
  await q.click("[data-non]"); await attendre(200);
  await q.click("[data-env]"); await attendre(300); vrai(P[1].etat === "attente", "Refus envoyé sans commentaire");
  await q.click(".refus .vite .btn"); if (process.env.CAPTURES) await q.screenshot({ path: process.env.CAPTURES + "/prof-refus.png" }); await q.click("[data-env]"); await attendre(1000);
  vrai(P[1].etat === "refuse" && /diamètre/.test(P[1].motif || ""), "Refus : " + P[1].etat + " " + P[1].motif);
  await p.reload(); await attendre(1500); const sv = await p.evaluate(() => document.body.innerText);
  if (process.env.CAPTURES) await p.screenshot({ path: process.env.CAPTURES + "/eleve-suivi.png" });
  vrai(/Refusé/.test(sv) && /Mauvais diamètre/.test(sv), "L'élève ne voit pas le refus et le commentaire");
  await p.$eval("details.mesP", d => d.open = true); await p.click("[data-cor]"); await attendre(400);   /* 26 nov. : corriger un panier refusé */
  vrai(/Mauvais diamètre/.test(await p.textContent(".corrige")) && (await p.$$("#pL .art")).length > 0, "Corriger : le panier refusé ne revient pas avec le commentaire"); await p.click("#pF"); await attendre(200);
  /* poste de commande partagé (iPad) : après l'envoi, l'écran se vide pour l'élève suivant */
  const c4 = await b.newContext({ viewport: { width: 820, height: 1180 }, hasTouch: true, serviceWorkers: "block" }); await mock(c4);
  const po = await c4.newPage(); po.on("pageerror", e => errs.push(e.message)); await po.goto(BASE + "magasin.html?poste=1&e=jeremy.raymond"); await attendre(800);
  await po.fill("#cCode", "MP-12345-K7Q9X2"); await po.keyboard.press("Enter"); await attendre(1200);
  await po.click(".art .aj"); await po.click("#bVoir", { force: true }); await attendre(300); await po.click("#pEnv"); await attendre(5200);
  vrai(!(await po.$("#cCode")) && /12345/.test(await po.textContent("#tQui")), "iPad du coffre : l'élève doit rester connecté après l'envoi (vidé seulement après 2 min sans toucher)");
  vrai(!errs.length, errs.join(" | "));
  await c1.close(); await c2.close(); await c3.close(); await c4.close();
});

test("Carte : l'élève affiche sa carte avec son code à 5 chiffres seulement; trop de codes inconnus = pause", async b => {
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: "block" }), R = {}, errs = []; let E = 0;
  await c.route(/rpc\/carte_code_(ecrire|lire)/, r => { const a = JSON.parse(r.request().postData()), u = r.request().url(); let out;
    if (/ecrire/.test(u)) { const x = R[a.p_code]; out = !x || x.jeton === a.p_jeton; if (out) R[a.p_code] = { jeton: a.p_nouveau || a.p_jeton, data: a.p_data }; }
    else if (E >= 30) out = { etat: "bloque" };
    else if (R[a.p_code]) out = { etat: "ok", data: R[a.p_code].data };
    else { E++; out = { etat: "non" }; }
    r.fulfill({ body: JSON.stringify(out), contentType: "application/json", headers: { "access-control-allow-origin": "*" } }); });
  const p = await c.newPage(); p.on("pageerror", e => errs.push(e.message)); await p.goto(BASE + "carte.html"); await attendre(600);
  await p.addScriptTag({ url: "js/eleve-cartes.js" });
  vrai(await p.evaluate(() => ELEVE_CARTES.publierCode({ c: "48213", k: "K7Q9X2", p: "Marc Tremblay", g: "5333" })), "Publication refusée");
  await p.fill("#cle", "48214"); await attendre(500); vrai(/inconnu/.test(await p.textContent("#err")), "Code inconnu accepté");
  await p.fill("#cle", "48213"); await attendre(900);   /* 5 chiffres : la carte s'ouvre seule */
  vrai(/MP-48213-K7Q9X2/.test(await p.evaluate(() => localStorage.getItem("mpCarte"))), "Le code seul n'ouvre pas la carte");
  vrai((await p.textContent("#vP")).trim() === "Marc", "Le prénom n'est pas sur la carte");
  /* carte perdue : la recherche suit la nouvelle clé; personne d'autre ne peut la remplacer */
  vrai(await p.evaluate(() => ELEVE_CARTES.publierCode({ c: "48213", k: "NEWK44", p: "Marc" }, "K7Q9X2")), "Nouvelle carte : recherche non mise à jour");
  vrai(!(await p.evaluate(() => ELEVE_CARTES.publierCode({ c: "48213", k: "PIRATE", p: "Marc" }))), "N'importe qui peut remplacer la carte");
  /* ancienne carte entrée avec la clé complète (sans prénom) : le prénom s'ajoute tout seul */
  await p.evaluate(() => localStorage.setItem("mpCarte", JSON.stringify({ c: "MP-48213-NEWK44", g: "", p: "", t: 1 }))); await p.reload(); await attendre(1200);
  vrai((await p.textContent("#vP")).trim() === "Marc", "Ancienne carte : le prénom ne s'ajoute pas");
  E = 30; await p.evaluate(() => localStorage.removeItem("mpCarte")); await p.reload(); await attendre(600);
  await p.fill("#cle", "48213"); await attendre(500); vrai(/Trop d'essais/.test(await p.textContent("#err")), "Pas de pause après trop de codes inconnus");
  vrai(!errs.length, errs.join(" | ")); await c.close();
});

test("Facture : l'élève (sa carte) fait une facture, importe ses raccords du magasin, le client signe, PDF", async b => {
  const c = await b.newContext({ viewport: { width: 820, height: 1180 }, hasTouch: true, serviceWorkers: "block", acceptDownloads: true }), S = {}, errs = [];
  /* groupe en DEP 2 aujourd'hui (début il y a 6 mois) : seule session où la facture est permise (reglages.json) */
  await c.addInitScript(() => { const d = new Date(); d.setMonth(d.getMonth() - 6); const g = String(d.getFullYear() % 100) + String(d.getMonth() + 1).padStart(2, "0") + "PLCA1";
    localStorage.mpCarte = JSON.stringify({ c: "MP-48213-K7Q9X2", g, p: "Marc", t: 1 }); });
  await c.route(/rpc\/(\w+)/, r => { const f = r.request().url().match(/rpc\/(\w+)/)[1], a = JSON.parse(r.request().postData() || "{}"); let o = null;
    if (f === "coffre_lire") o = S[a.p_id] ? [{ data: S[a.p_id] }] : []; else if (f === "coffre_ecrire") { S[a.p_id] = a.p_data; o = true; }
    else if (f === "panier_materiel_eleve") o = a.p_code === "48213" ? [{ panier: "a1", jour: "2026-11-25", n: "ABS-C90-2", nom: "Coude 90° ABS 2 po", q: 6 }, { panier: "a1", jour: "2026-11-25", n: "CU-T-34", nom: "Té cuivre 3/4 po", q: 2 }, { panier: "b2", jour: "2026-11-20", n: "PEX-12", nom: "Tuyau PEX 1/2 po", q: 3 }] : [];
    r.fulfill({ body: JSON.stringify(o), contentType: "application/json", headers: { "access-control-allow-origin": "*" } }); });
  const pub = require("crypto").createHash("sha256").update("metier+|coffres-pub|jeremy.raymond").digest("hex"), PUBC = t => JSON.stringify({ at:{}, cf:{ c1:{ nom:"Coffre 4", tour:t, eqc:["48213", "51234"] } } }); S[pub] = PUBC(2);
  const p = await c.newPage(); p.on("pageerror", e => errs.push(e.message)); await p.goto(BASE + "facture.html"); await attendre(1200);
  /* début : l'équipe crée son entreprise (coffre trouvé tout seul, équipier 51234) */
  vrai(/Notre entreprise/.test(await p.textContent("#app")) && /Coffre 4 · avec 51234/.test(await p.textContent("#app")), "Écran « Notre entreprise » / coffre non trouvé");
  await p.fill('[data-e="nom"]', "Plomberie Marc inc."); await p.click('[data-ic="flamme"]'); await p.click('[data-co="2"]'); await p.click("#eOk"); await attendre(600);
  await p.click("#nv"); await attendre(300);
  vrai(/@exemple\.com$/.test(await p.inputValue('[data-c="client.courriel"]')) && /418 555-/.test(await p.inputValue('[data-c="client.tel"]')), "Client fictif non tiré au hasard");
  await p.fill('[data-c="client.nom"]', "Mme Gagnon"); await p.press('[data-c="client.nom"]', "Tab");
  vrai(!!(await p.$(".fst.ok")), "Facture : l'étape Client n'est pas cochée");   /* 26 nov. : facture en 4 étapes */
  await p.click('.fnav [data-et="2"]'); await attendre(200);
  await p.fill('[data-l="mo.0.h"]', "3"); await p.press('[data-l="mo.0.h"]', "Tab"); await p.fill('[data-l="mo.0.taux"]', "95"); await p.press('[data-l="mo.0.taux"]', "Tab"); await attendre(200);
  await p.click('.fnav [data-et="3"]'); await attendre(200);
  await p.click("#imp"); await attendre(800); await p.check('[data-tout="0"]'); await p.click("#impOk"); await attendre(300);   /* coche la commande du 25 nov. seulement */
  vrai((await p.$$('[data-l^="mat."][data-l$=".d"]')).length === 2, "Raccords cochés non importés");
  vrai((await p.$$(".fm .fph")).length === 2 && !!(await p.$(".fm.sansprix")) && !!(await p.$(".avisP")), "Matériel : photos ou avis « prix manquant » absents");
  await p.click('[data-mq="1|1"]'); await attendre(200); vrai(await p.inputValue('[data-l="mat.1.q"]') === "3", "Matériel : le bouton + ne change pas la quantité"); await p.click('[data-mq="1|-1"]'); await attendre(200);
  await p.fill('[data-l="mat.0.prix"]', "4,50"); await p.press('[data-l="mat.0.prix"]', "Tab"); await attendre(200);
  const tot = await p.textContent("#barre"); vrai(/358,72/.test(tot.replace(/\s/g, "")), "Total faux : " + tot);   /* 3 h × 95 $ + 6 × 4,50 $ = 312 $ + TPS + TVQ */
  await p.click("#cat"); await attendre(500); await p.fill("#cQ", "té cuivre 1/2"); await attendre(200); await p.click("#cR [data-a]"); await p.click("#cX"); await attendre(300);
  vrai(/^\d+,\d\d$/.test(await p.inputValue('[data-l="mat.2.prix"]')), "Raccord de la liste du magasin : prix non prérempli");
  if (process.env.CAPTURES) await p.screenshot({ path: process.env.CAPTURES + "/facture-materiel.png" });
  await p.click('.fnav [data-et="4"]'); await attendre(300);
  await (await p.$("#sig")).scrollIntoViewIfNeeded(); const bx = await (await p.$("#sig")).boundingBox(); await p.mouse.move(bx.x + 20, bx.y + 40); await p.mouse.down(); await p.mouse.move(bx.x + 200, bx.y + 100, { steps: 8 }); await p.mouse.up();
  await p.click("#sigOk"); await attendre(300); vrai(/Signée par Mme Gagnon/.test(await p.textContent("#app")), "Signature non enregistrée");
  const [dl] = await Promise.all([p.waitForEvent("download", { timeout: 8000 }), p.click("#pdf")]);
  vrai(/Facture-F-\d{4}-001\.pdf/.test(dl.suggestedFilename()), "PDF : " + dl.suggestedFilename());
  if (process.env.CAPTURES) await p.screenshot({ path: process.env.CAPTURES + "/facture.png", fullPage: true });
  await attendre(1800); vrai(Object.keys(S).length === 3, "Copies chiffrées non enregistrées (" + Object.keys(S).length + ")");
  /* autre appareil (à la maison) : la facture revient avec la carte */
  const c2 = await b.newContext({ serviceWorkers: "block" }); await c2.addInitScript(() => { const d = new Date(); d.setMonth(d.getMonth() - 6); localStorage.mpCarte = JSON.stringify({ c: "MP-48213-K7Q9X2", g: String(d.getFullYear() % 100) + String(d.getMonth() + 1).padStart(2, "0") + "PLCA1", p: "Marc", t: 1 }); });
  await c2.route(/rpc\/(\w+)/, r => { const a = JSON.parse(r.request().postData() || "{}"); r.fulfill({ body: JSON.stringify(S[a.p_id] ? [{ data: S[a.p_id] }] : []), contentType: "application/json", headers: { "access-control-allow-origin": "*" } }); });
  const p2 = await c2.newPage(); await p2.goto(BASE + "facture.html"); await attendre(1200); vrai(/Mme Gagnon/.test(await p2.textContent("#app")), "Facture non retrouvée sur un autre appareil");
  /* l'équipier (51234) retrouve la même entreprise; au changement d'équipe (nouveau tour), elle recommence */
  const p3 = await c2.newPage(); await p3.addInitScript(() => { const d = new Date(); d.setMonth(d.getMonth() - 6); localStorage.mpCarte = JSON.stringify({ c: "MP-51234-ZZZZ99", g: String(d.getFullYear() % 100) + String(d.getMonth() + 1).padStart(2, "0") + "PLCA1", p: "Léa", t: 1 }); }); await p3.goto(BASE + "facture.html"); await attendre(1500);
  vrai(/Plomberie Marc inc\./.test(await p3.textContent("#app")), "L'équipier ne voit pas l'entreprise de l'équipe");
  S[pub] = PUBC(3); await p3.reload(); await attendre(1500); vrai(/Notre entreprise/.test(await p3.textContent("#app")), "Nouveau tour du coffre : l'entreprise ne recommence pas");
  /* DEP 1 (groupe commencé ce mois-ci) : facture fermée */
  const p4 = await c2.newPage(); await p4.addInitScript(() => { const d = new Date(); localStorage.mpCarte = JSON.stringify({ c: "MP-51234-ZZZZ99", g: String(d.getFullYear() % 100) + String(d.getMonth() + 1).padStart(2, "0") + "PLCA1", p: "Léa", t: 1 }); });
  await p4.goto(BASE + "facture.html"); await attendre(900); vrai(/s'ouvre plus tard dans ton DEP \(tu es en DEP 1\)/.test(await p4.textContent("#app")), "Facture ouverte en DEP 1");
  vrai(!errs.length, errs.join(" | ")); await c.close(); await c2.close();
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
