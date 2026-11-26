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
    vrai(!vide, "Onglet vide : " + k);
    if (await p.$(".ap-plein")) { await p.click("#apRet"); await attendre(300); vrai(!(await p.$(".ap-plein")), "Plein écran : « Retour » ne ferme pas"); } }   /* 25 nov. : outils d'administration en plein écran */
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
  await p.goto(BASE + "index.html"); await attendre(400);
  await p.evaluate(() => new Promise(ok => { const r = indexedDB.open("acces", 1); r.onupgradeneeded = () => r.result.createObjectStore("s"); r.onsuccess = () => { const t = r.result.transaction("s", "readwrite"); t.objectStore("s").put({ id: "2608egi1", priv: null }, "session"); t.oncomplete = ok; }; }));
  await p.reload(); await p.waitForFunction(() => window.ACCES && ACCES.eleve, null, { timeout: 15000 }); await attendre(1500);
  await p.evaluate(() => lire(LIVRES.find(l => l.fichier === "essai-micro-ordinateur")));
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
  vrai(!p.errs.length, p.errs.join(" | "));
});

test("Magasin : l'élève (carte scannée) envoie son panier, l'enseignant approuve, le magasinier filtre par code et remet", async b => {
  const P = [], A = [];
  /* 25 nov. : prénom publié chiffré avec la clé de la carte (comme passeport.html nomsPub) */
  const te = new TextEncoder(), cle = await crypto.subtle.importKey("raw", await crypto.subtle.digest("SHA-256", te.encode("metier+|carte|12345|K7Q9X2")), "AES-GCM", false, ["encrypt"]);
  const iv = crypto.getRandomValues(new Uint8Array(12)), ENC = Buffer.from([...iv, ...new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, cle, te.encode("Essai")))]).toString("base64");
  const mock = async ctx => ctx.route(/supabase\.co\/rest\/v1\/rpc\/(\w+)/, async r => { const f = r.request().url().match(/rpc\/(\w+)/)[1], a = JSON.parse(r.request().postData() || "{}"); let o = null;
    if (f === "coffre_lire") o = [{ data: JSON.stringify({ grp: ["2608 EGI"], codes: { "2608 EGI": ["12345", "45678"] }, noms: { "12345": ENC } }) }];
    else if (f === "panier_envoyer") { P.push({ id: "id" + P.length, etat: "attente", t: new Date().toISOString(), ens: a.p_ens, groupe: a.p_groupe, code: a.p_code, prenom: a.p_prenom, items: a.p_items, note: a.p_note }); o = { ok: true, id: "id" + (P.length - 1) }; }
    else if (f === "panier_etat") { const x = P.find(p => p.id === a.p_id) || {}; o = { etat: x.etat, motif: x.motif }; }
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
  await p.fill("#fQ", "coude 90 abs 2"); await attendre(300);
  const res = await p.$$eval(".art .tx b", L => L.map(x => x.textContent));
  vrai(res.length === 1 && /ABS 2 po/.test(res[0]), "Recherche : " + res.join(" | "));
  await p.fill("#fQ", "té cuivre 3/4"); await attendre(300);
  const r2 = await p.$$eval(".art .tx b", L => L.map(x => x.textContent)); vrai(r2.length === 1, "« té » trouve aussi : " + r2.join(" | "));
  await p.click(".art .aj"); await p.click(".art [data-m='1']"); await attendre(200);
  await p.click("#bVoir"); await attendre(300); await p.click("#pEnv"); await attendre(1200);
  vrai(P.length === 1 && P[0].code === "12345" && P[0].items[0].q === 2, "Panier mal envoyé : " + JSON.stringify(P));
  const c2 = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, serviceWorkers: "block" }); await mock(c2);
  await c2.addInitScript(() => { localStorage.dernierId = "jeremy.raymond"; });
  const q = await c2.newPage(); q.on("pageerror", e => errs.push(e.message));
  await q.goto(BASE + "magasin.html?mode=prof"); await attendre(800); await q.click("#aOk"); await attendre(1200); await q.click("[data-ok]"); await attendre(1000);
  vrai(P[0].etat === "approuve", "Approbation : " + P[0].etat);
  const c3 = await b.newContext({ viewport: { width: 1366, height: 768 }, serviceWorkers: "block" }); await mock(c3);
  const m = await c3.newPage(); m.on("pageerror", e => errs.push(e.message));
  await m.goto(BASE + "magasin.html?mode=magasin"); await attendre(1500);
  await m.keyboard.type("MP-45678-AAAAAA"); await m.keyboard.press("Enter"); await attendre(300);
  vrai(!(await m.$("[data-rem]")), "Code 45678 : la commande de 12345 s'affiche");
  await m.keyboard.type("MP-12345-K7Q9X2"); await m.keyboard.press("Enter"); await attendre(300);
  vrai(!!(await m.$("[data-rem]")), "Code 12345 : commande absente");
  vrai(/^[A-Z]-\d+$/.test((await m.textContent("td.rg")).trim()), "Rangée absente au comptoir");
  vrai(/Essai/.test(await m.textContent(".cmd .pr")), "Prénom absent au comptoir");
  if (process.env.CAPTURES) await m.screenshot({ path: process.env.CAPTURES + "/comptoir.png" });
  await m.click("[data-sig$='|2']"); await attendre(400);
  vrai(A.length === 0 && !!(await m.$("[data-sig$='|2'].att")), "Règlement : doit attendre la confirmation « Remis » : " + JSON.stringify(A));
  await m.click("[data-prep]"); await attendre(400);
  if (process.env.CAPTURES) await m.screenshot({ path: process.env.CAPTURES + "/plan.png" });
  vrai(await m.$$eval(".pm-s.actif", L => L.length) > 0, "Plan : aucune rangée ne clignote");
  for (const c of await m.$$("[data-k]")) { await c.click(); await attendre(150); }
  vrai(await m.$$eval(".pm-s.actif", L => L.length) === 0, "Plan : une rangée clignote encore après tout coché");
  await m.click("#prOk"); await attendre(400); vrai(P[0].etat === "remis", "Remis : " + P[0].etat);
  vrai(A.length === 1 && A[0].regle === 2, "Règlement pas envoyé à la confirmation « Remis » : " + JSON.stringify(A));
  vrai(!!(await m.$(".cmd.fin.repli")), "Commande remise : pas repliée au comptoir");
  await m.click(".cmd.fin .fl"); await attendre(200); vrai(!(await m.$(".cmd.fin.repli")), "Flèche : ne rouvre pas la commande");
  /* refus avec commentaire (25 nov.) : deuxième panier, refusé avec motif, l'élève voit le commentaire */
  await p.click(".art .aj"); await attendre(200); await p.click("#bVoir"); await attendre(300); await p.click("#pEnv"); await attendre(1200);
  await q.reload(); await attendre(1500);
  vrai(/Sans carte étudiante/.test(await q.textContent(".avisMag")), "L'enseignant ne voit pas l'avis du magasinier");
  await q.click("[data-vu]"); await attendre(900); vrai(!(await q.$(".avisMag")) && A.length === 1, "« Vu » : l'avis reste affiché ou est effacé");
  await q.click("[data-non]"); await attendre(200);
  await q.click("[data-env]"); await attendre(300); vrai(P[1].etat === "attente", "Refus envoyé sans commentaire");
  await q.click(".refus .vite .btn"); if (process.env.CAPTURES) await q.screenshot({ path: process.env.CAPTURES + "/prof-refus.png" }); await q.click("[data-env]"); await attendre(1000);
  vrai(P[1].etat === "refuse" && /diamètre/.test(P[1].motif || ""), "Refus : " + P[1].etat + " " + P[1].motif);
  await p.reload(); await attendre(1500); const sv = await p.evaluate(() => document.body.innerText);
  if (process.env.CAPTURES) await p.screenshot({ path: process.env.CAPTURES + "/eleve-suivi.png" });
  vrai(/Refusé par ton enseignant/.test(sv) && /Mauvais diamètre/.test(sv), "L'élève ne voit pas le refus et le commentaire");
  /* poste de commande partagé (iPad) : après l'envoi, l'écran se vide pour l'élève suivant */
  const c4 = await b.newContext({ viewport: { width: 820, height: 1180 }, hasTouch: true, serviceWorkers: "block" }); await mock(c4);
  const po = await c4.newPage(); po.on("pageerror", e => errs.push(e.message)); await po.goto(BASE + "magasin.html?poste=1&e=jeremy.raymond"); await attendre(800);
  await po.fill("#cCode", "MP-12345-K7Q9X2"); await po.keyboard.press("Enter"); await attendre(1200);
  await po.click(".art .aj"); await po.click("#bVoir", { force: true }); await attendre(300); await po.click("#pEnv"); await attendre(5200);
  vrai(!(await po.$("#cCode")) && /12345/.test(await po.textContent("#tQui")), "iPad du coffre : l'élève doit rester connecté après l'envoi (vidé seulement après 2 min sans toucher)");
  vrai(!errs.length, errs.join(" | "));
  await c1.close(); await c2.close(); await c3.close(); await c4.close();
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
