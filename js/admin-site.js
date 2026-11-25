/* © 2026 Jérémy Raymond. Tous droits réservés.
   Administration → onglet « Site » (15 nov.) : état du site, signalements reçus, réglages du site.
   Signalements : le sujet ntfy ne garde les messages que 12 h; l'ordinateur de l'administrateur les recopie
   dans localStorage.signalements (synchronisé par le coffre, sorte biblio) dès qu'il ouvre la bibliothèque, puis à chaque heure. */
window.ADMIN_SITE = (function(){
  const SUJET = "https://ntfy.sh/metierplus-signal-f3ce60fd2f6c0f46";
  const SUPA = "https://kjlotlhqrgekzohshmbn.supabase.co", CLE = "sb_publishable_1C-o-75sf7havBRmUWA8aQ_gcEW4sRY";
  const DEPOT = "cfppaplc/bibliotheque";
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
  const lire = () => { try { const o = JSON.parse(localStorage.getItem("signalements") || "{}"); return Array.isArray(o.L) ? o : { L:[] }; } catch(e){ return { L:[] }; } };
  const ecrire = o => { o.L.sort((a, b) => b.t - a.t); o.L = o.L.slice(0, 300); try { localStorage.setItem("signalements", JSON.stringify(o)); } catch(e){} };
  const admin = () => !!(window.ACCES && ACCES.session && ACCES.session.admin);
  const quand = t => { const d = new Date(t * 1000); return d.toLocaleDateString("fr-CA", { day:"numeric", month:"short" }) + " " + d.getHours() + " h " + String(d.getMinutes()).padStart(2, "0"); };
  const genre = m => /erreur/i.test(m.ti) || /warning|bug|rotating_light/.test(m.tg || "") ? "err" : "sig";

  async function recolter(){
    if (!admin()) return 0; const o = lire(), ids = new Set(o.L.map(x => x.id));
    try {
      const r = await fetch(SUJET + "/json?poll=1&since=12h", { cache:"no-store" }); if (!r.ok) return 0;
      let n = 0;
      (await r.text()).split("\n").forEach(l => { if (!l.trim()) return; let m; try { m = JSON.parse(l); } catch(e){ return; }
        if (m.event !== "message" || ids.has(m.id)) return; ids.add(m.id); n++;
        o.L.push({ id:m.id, t:m.time, ti:m.title || "", m:(m.message || "").slice(0, 4000), tg:(m.tags || []).join(",") }); });
      if (n) ecrire(o); return n;
    } catch(e){ return 0; }
  }
  if (window.ACCES) ACCES.pret.then(() => { recolter(); setInterval(recolter, 3600e3); });

  /* ---- vérifications ---- */
  async function verifs(){
    const R = {};
    const t = (p, ms) => Promise.race([p, new Promise((_, n) => setTimeout(() => n(new Error("délai")), ms || 8000))]);
    await Promise.all([
      t(fetch("version.json", { cache:"no-store" }).then(r => r.json())).then(j => R.version = { ok:true, txt:j.v }).catch(() => R.version = { ok:false, txt:"introuvable" }),
      t(fetch(SUPA + "/auth/v1/health", { headers:{ apikey:CLE } })).then(r => R.supa = r.ok ? { ok:true, txt:"en marche" } : { ok:false, txt:"ne répond pas (pause ?)" }).catch(() => R.supa = { ok:false, txt:"ne répond pas (pause ?)" }),
      (async () => { let j = ""; try { j = localStorage.getItem("ghJeton") || ""; } catch(e){}
        if (!j) return R.gh = { ok:null, txt:"pas sur cet appareil" };
        try { const r = await t(fetch("https://api.github.com/repos/" + DEPOT, { headers:{ Authorization:"Bearer " + j }, cache:"no-store" }));
          R.gh = r.ok ? { ok:true, txt:"valide" } : r.status === 401 ? { ok:false, txt:"refusée : à remplacer" } : { ok:false, txt:"GitHub " + r.status }; }
        catch(e){ R.gh = { ok:false, txt:"GitHub ne répond pas" }; } })()
    ]);
    return R;
  }

  let VOIR_REGLES = false;
  function dessiner(z, REGL, redessiner){
    if (!z) return;
    const o = lire(), ouverts = o.L.filter(x => !x.ok), sem = Date.now() / 1000 - 7 * 86400;
    const nErr = o.L.filter(x => genre(x) === "err" && x.t > sem).length;
    const etq = REGL.etiquette === undefined ? "ALPHA" : REGL.etiquette;
    const seg = (v, l) => '<button class="abtn' + (etq === v ? ' prim' : '') + '" data-etq="' + v + '">' + l + '</button>';
    const liste = (VOIR_REGLES ? o.L : ouverts);
    z.innerHTML = '<div class="as-grille"><div class="as-carte" id="asEtat"><h3>État du site</h3>'
      + '<div class="as-l" id="asVer"><i></i><span>Version en ligne</span><b>…</b></div>'
      + '<div class="as-l" id="asSupa"><i></i><span>Supabase (quiz, coffre, statistiques)</span><b>…</b></div>'
      + '<div class="as-l" id="asGh"><i></i><span>Clé GitHub (publier)</span><b>…</b></div>'
      + '<div class="as-l ' + (nErr ? 'ko' : 'ok') + '"><i></i><span>Erreurs automatiques (7 jours)</span><b>' + nErr + '</b></div>'
      + '<button class="abtn" id="asRe">Vérifier encore</button></div>'
      + '<div class="as-carte"><h3>Réglages du site</h3>'
      + '<div class="as-reg"><span>Étiquette du logo</span><div class="as-seg">' + seg("ALPHA", "ALPHA") + seg("BÊTA", "BÊTA") + seg("", "Aucune") + '</div></div>'
      + '<p class="sous">Part en ligne avec « Publier ».</p>'
      + '<a class="as-lien" href="accueil.html?menage=1" target="_blank" rel="noopener">Locaux et tâches du ménage<small>Accueil de classe</small></a>'
      + '<a class="as-lien" href="passeport.html?formations=1" target="_blank" rel="noopener">Formations du registre<small>Gestion d\'atelier</small></a>'
      + '<a class="as-lien" href="tests.html" target="_blank" rel="noopener">Pages d\'essai<small>Navigateur, vitesse, toucher, son, connexion, écran</small></a>'
      + '<button class="as-lien" data-ong-go="livres">Réglages des livres<small>Onglet Livres</small></button></div></div>'
      + '<div class="as-carte"><div class="as-th"><h3>Signalements reçus <span class="as-nb">' + ouverts.length + ' à régler</span></h3>'
      + '<label class="as-cb"><input type="checkbox" id="asTous"' + (VOIR_REGLES ? ' checked' : '') + '> Voir aussi les réglés</label></div>'
      + (liste.length ? liste.slice(0, 80).map(x => '<div class="as-sig ' + genre(x) + (x.ok ? ' fait' : '') + '"><div class="as-st"><b>' + esc(x.ti || "Message") + '</b><span>' + quand(x.t) + '</span>'
          + '<button class="abtn" data-ok="' + esc(x.id) + '">' + (x.ok ? 'Rouvrir' : 'Réglé') + '</button></div><pre>' + esc(x.m) + '</pre></div>').join("")
        : '<p class="sous">Aucun signalement à régler.</p>')
      + '<p class="sous">Les messages sont recopiés ici chaque fois que tu ouvres Métier+ sur cet ordinateur (le service d\'avis les efface après 12 h).</p></div>';
    const pose = (id, r) => { const e = z.querySelector("#" + id); if (!e || !r) return; e.classList.remove("ok", "ko", "neutre"); e.classList.add(r.ok === true ? "ok" : r.ok === false ? "ko" : "neutre"); e.querySelector("b").textContent = r.txt; };
    const lancer = () => verifs().then(R => { pose("asVer", R.version); pose("asSupa", R.supa); pose("asGh", R.gh); });
    lancer(); recolter().then(n => { if (n) dessiner(z, REGL, redessiner); });
    z.querySelector("#asRe").onclick = lancer;
    z.querySelector("#asTous").onchange = e => { VOIR_REGLES = e.target.checked; dessiner(z, REGL, redessiner); };
    z.querySelectorAll("[data-ok]").forEach(b => b.onclick = () => { const o2 = lire(), x = o2.L.find(y => y.id === b.dataset.ok); if (x){ x.ok = !x.ok; ecrire(o2); } dessiner(z, REGL, redessiner); });
    z.querySelectorAll("[data-etq]").forEach(b => b.onclick = () => { REGL.etiquette = b.dataset.etq; redessiner(); });
    const go = z.querySelector("[data-ong-go]"); if (go) go.onclick = () => { const b = document.querySelector('[data-ong="livres"]'); if (b) b.click(); };
  }
  return { dessiner, recolter, verifs, lire, genre };
})();
