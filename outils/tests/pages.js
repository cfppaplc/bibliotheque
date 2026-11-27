/* Test automatique après chaque publication (25 nov.) : chaque page principale doit s'ouvrir sans erreur JavaScript.
   Lancé par .github/workflows/test-pages.yml (serveur local sur le port 8791). Les erreurs de sites externes (réseau) sont ignorées. */
const { chromium } = require("playwright");
const PAGES = ["index.html", "accueil.html", "labo.html", "quiz.html", "quiz.html?animer=1", "simulateur.html", "telecommande.html",
  "outils-atelier.html", "passeport.html", "coffres.html", "presentation.html", "confidentialite.html", "magasin.html", "magasin.html?mode=prof", "magasin.html?mode=magasin", "magasin.html?poste=1", "recuperer.html", "facture.html", "carte.html", "carte.html#c=MP-12345-K7Q9X2&g=Essai&p=Marc"];
(async () => {
  const b = await chromium.launch(); let echecs = 0;
  for (const [nom, opt] of [["ordinateur", { viewport: { width: 1440, height: 900 } }], ["cellulaire", { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }]]) {
    for (const pg of PAGES) {
      const ctx = await b.newContext(opt); await ctx.addInitScript(() => { localStorage.bienvenueVu = "1"; });
      const p = await ctx.newPage(), errs = [];
      p.on("pageerror", e => errs.push(e.message));
      await p.route(/ntfy\.sh|supabase\.co\/rest\/v1\/rpc\/(journal_ecrire|stats_plus)/, r => r.fulfill({ status: 204, body: "" }));   // pas de faux rapports
      try { const r = await p.goto("http://localhost:8791/" + pg, { waitUntil: "load", timeout: 30000 }); if (!r || r.status() >= 400) errs.push("HTTP " + (r && r.status())); }
      catch (e) { errs.push("ne s'ouvre pas : " + e.message.split("\n")[0]); }
      await p.waitForTimeout(2500);
      if (errs.length) { echecs++; console.log("ÉCHEC", nom, pg, "\n  - " + errs.join("\n  - ")); } else console.log("ok", nom, pg);
      await ctx.close();
    }
  }
  await b.close();
  if (echecs) { console.log("\n" + echecs + " page(s) avec erreur."); process.exit(1); }
  console.log("\nToutes les pages s'ouvrent sans erreur.");
})();
