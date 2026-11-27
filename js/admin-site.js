/* heures du magasin par défaut (Jeremy, 26 nov.) : 8 h – 11 h 50 et 13 h – 16 h 20, fermé aux pauses */
const HEURES_MAG_DEF = { jours:[1, 2, 3, 4, 5], plages:[["08:30", "09:30"], ["09:35", "10:35"], ["10:50", "11:50"], ["13:00", "14:00"], ["14:05", "15:05"], ["15:20", "16:20"]], fermes:[], coupures:[{ j:[1, 3], de:"09:30", a:"10:15" }, { j:[2, 5], de:"09:30", a:"11:30" }] };
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
      + '<div class="as-reg"><span>Facture des élèves (sessions du DEP)</span><div class="as-seg">' + [1, 2, 3, 4].map(n => '<button class="abtn' + ((REGL.facture || [2]).includes(n) ? ' prim' : '') + '" data-fac="' + n + '">DEP ' + n + '</button>').join("") + '</div></div>'
      /* 26 nov. (Jeremy : « l'horaire pourrait rendre notre système dynamique ») : heures du magasin; hors des heures, les paniers ne partent pas */
      + (() => { const H = REGL.magasinHeures || HEURES_MAG_DEF, auj = new Date(), cle = auj.getFullYear() + "-" + String(auj.getMonth() + 1).padStart(2, "0") + "-" + String(auj.getDate()).padStart(2, "0"), fa = (H.fermes || []).includes(cle);
          return '<div class="as-hm"><div class="as-reg"><span>Heures du magasin</span><div class="as-seg">' + ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((j, k) => '<button class="abtn' + (H.jours.includes(k) ? ' prim' : '') + '" data-hj="' + k + '">' + j + '</button>').join("") + '</div></div>'
            + '<div class="as-hp">' + H.plages.map((p, i) => '<span class="as-hpl"><input type="time" value="' + p[0] + '" data-hp="' + i + '|0" aria-label="Ouverture"> à <input type="time" value="' + p[1] + '" data-hp="' + i + '|1" aria-label="Fermeture"><button class="abtn" data-hx="' + i + '" aria-label="Retirer cette période">×</button></span>').join("") + '<button class="abtn" id="hpPlus">+ Période</button></div>'
            /* 27 nov. : fermetures fixes chaque semaine (photo de l'horaire du magasin) */
            + '<div class="as-reg"><span>Fermetures chaque semaine</span></div><div class="as-hp">' + (H.coupures || []).map((c, i) => '<span class="as-hpl" style="flex-wrap:wrap"><span class="as-seg">' + ["Lun", "Mar", "Mer", "Jeu", "Ven"].map((j, k) => '<button class="abtn' + ((c.j || []).includes(k + 1) ? ' prim' : '') + '" data-cj="' + i + '|' + (k + 1) + '">' + j + '</button>').join("") + '</span><input type="time" value="' + c.de + '" data-cp="' + i + '|de" aria-label="Fermé de"> à <input type="time" value="' + c.a + '" data-cp="' + i + '|a" aria-label="Fermé jusqu\'à"><button class="abtn" data-cx="' + i + '" aria-label="Retirer cette fermeture">×</button></span>').join("") + '<button class="abtn" id="cpPlus">+ Fermeture</button></div>'
            + '<div class="as-reg"><span>' + (fa ? 'Fermé aujourd\'hui (pédago, congé)' : 'Ouvert aujourd\'hui selon l\'horaire') + '</span><button class="abtn' + (fa ? ' prim' : '') + '" id="hFa">' + (fa ? 'Rouvrir aujourd\'hui' : 'Fermer aujourd\'hui') + '</button></div></div>'; })()
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
    /* 26 nov. (Jeremy : « les factures pour le moment seulement en DEP 2 ») : session calculée du code du groupe (2608 = août 2026) */
    { const H = () => (REGL.magasinHeures = REGL.magasinHeures || JSON.parse(JSON.stringify(HEURES_MAG_DEF)));
      z.querySelectorAll("[data-hj]").forEach(b => b.onclick = () => { const h = H(), k = +b.dataset.hj; h.jours = h.jours.includes(k) ? h.jours.filter(x => x !== k) : h.jours.concat(k).sort(); redessiner(); });
      z.querySelectorAll("[data-hp]").forEach(i => i.onchange = () => { const h = H(), [n, k] = i.dataset.hp.split("|"); if (i.value) h.plages[+n][+k] = i.value; h.plages.sort((a, b) => a[0].localeCompare(b[0])); redessiner(); });
      z.querySelectorAll("[data-hx]").forEach(b => b.onclick = () => { H().plages.splice(+b.dataset.hx, 1); redessiner(); });
      z.querySelectorAll("[data-cj]").forEach(b => b.onclick = () => { const h = H(), [n, k] = b.dataset.cj.split("|").map(Number), c = h.coupures[n]; c.j = c.j.includes(k) ? c.j.filter(x => x !== k) : c.j.concat(k).sort(); redessiner(); });
      z.querySelectorAll("[data-cp]").forEach(i => i.onchange = () => { const [n, k] = i.dataset.cp.split("|"); if (i.value) H().coupures[+n][k] = i.value; redessiner(); });
      z.querySelectorAll("[data-cx]").forEach(b => b.onclick = () => { H().coupures.splice(+b.dataset.cx, 1); redessiner(); });
      if (z.querySelector("#cpPlus")) z.querySelector("#cpPlus").onclick = () => { const h = H(); (h.coupures = h.coupures || []).push({ j:[1], de:"09:30", a:"10:15" }); redessiner(); };
      if (z.querySelector("#hpPlus")) z.querySelector("#hpPlus").onclick = () => { const h = H(), d = h.plages[h.plages.length - 1]; h.plages.push([d ? d[1] : "08:00", "16:20"]); redessiner(); };
      if (z.querySelector("#hFa")) z.querySelector("#hFa").onclick = () => { const h = H(), a = new Date(), c = a.getFullYear() + "-" + String(a.getMonth() + 1).padStart(2, "0") + "-" + String(a.getDate()).padStart(2, "0");
        h.fermes = (h.fermes || []).filter(x => x >= c.slice(0, 8) + "01"); h.fermes = h.fermes.includes(c) ? h.fermes.filter(x => x !== c) : h.fermes.concat(c); redessiner(); }; }
    z.querySelectorAll("[data-fac]").forEach(b => b.onclick = () => { const n = +b.dataset.fac, L = REGL.facture || [2]; REGL.facture = L.includes(n) ? L.filter(x => x !== n) : L.concat(n).sort(); redessiner(); });
    const go = z.querySelector("[data-ong-go]"); if (go) go.onclick = () => { const b = document.querySelector('[data-ong="livres"]'); if (b) b.click(); };
  }
  return { dessiner, recolter, verifs, lire, genre };
})();
