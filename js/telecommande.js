/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — telecommande.js (sorti d'index.html le 15 nov.) */
/* ---- Télécommande (7 nov.) : le cellulaire de l'enseignant contrôle le livre ouvert.
   Relais Supabase Realtime (même projet que le Labo), canal « pda-livre-<jeton> »; le jeton (aléatoire, 16 car.) est dans le code QR.
   Seuls des ordres et l'état (titre, page, modules) passent : jamais le contenu du livre. telecommande.html = la page du cellulaire. ---- */
(function(){
  const SB_URL = "https://nhxhfiaznuifcbobjuuv.supabase.co", SB_CLE = "sb_publishable_GwzHRE-rG-rVafG7QcTOxg_S68OQHXh";
  const LIB = "lib/supabase/supabase.min.js";
  const T = window.TELE = {jeton: "", canal: null, pret: false, branche: false, dernier: "", modsDe: "", mods: []};
  function jeton(){ const a = new Uint8Array(12); crypto.getRandomValues(a); return [...a].map(x => "abcdefghijkmnpqrstuvwxyz23456789"[x % 32]).join("").slice(0, 16); }
  function charger(){ return window.supabase ? Promise.resolve() : new Promise((ok, ko) => { const s = document.createElement("script"); s.src = LIB; s.integrity = "sha384-jP+y6mxch/vbLrNpx4basfv6ciZQuHwdRHgZGa6Mhja0Xm4p87ok2OQavTrRIGxH"; s.crossOrigin = "anonymous";   /* 27 nov. (Loi 25) : contrôle d intégrité */ s.onload = ok; s.onerror = ko; document.head.appendChild(s); }); }
  function envoyer(o){ if (T.canal && T.pret) T.canal.send({type: "broadcast", event: "m", payload: o}).catch(() => {}); }
  function mods(){
    if (!RD.drv) return [];
    if (T.modsDe === RD.book) return T.mods;
    let L = []; try { L = uniformiserModules(RD.drv.modules() || []); } catch(e){}
    T.modsDe = RD.book; T.mods = L; return L;
  }
  function etat(){
    const ouvert = !!(RD.drv && $("#reader") && $("#reader").classList.contains("open"));
    if (!ouvert) return {m: "etat", ouvert: false};
    const l = LIVRES.find(x => x.fichier === RD.book) || {};
    let lab = ""; try { lab = String(RD.drv.state().label || ""); } catch(e){}
    let ans = null; try { const i = RD.drv.ansInfo && RD.drv.ansInfo(); if (i && !i.dis) ans = i.mode; } catch(e){}
    return {m: "etat", ouvert: true, titre: l.titre || ($("#readerTitle") && $("#readerTitle").textContent) || (RD.wb ? "Tableau blanc" : "Livre"), label: lab, page: curPage(), tot: totPages(), ans,
      noir: !!document.querySelector("#noir:not([hidden])"), tdb: !!($("#accueilOv") && !$("#accueilOv").hidden), zoom: Math.round((RD.z || 1) * 100) / 100,
      mods: mods().map(x => ({t: x.text || "", tag: x.tag || "", p: typeof x.page === "number" ? x.page : null}))};
  }
  function pousser(force){ if (!T.branche) return; const e = etat(), s = JSON.stringify(e); if (force || s !== T.dernier){ T.dernier = s; envoyer(e); } }
  T.pousser = pousser;
  function aller(n){ if (!RD.drv) return; n = Math.max(1, Math.min(totPages() || n, n)); RD.bouge = true; try { RD.drv.goto(n); } catch(e){} setTimeout(() => { try { syncSecond(); poll(); } catch(e){} pousser(); }, 280); }
  T.ordre = o => ordre(o);   /* pour les essais */
  function ordre(o){
    if (o.m === "allo" || o.m === "vie"){ try { localStorage.setItem("teleJeton", JSON.stringify({k: T.jeton, t: Date.now(), vu: Date.now()})); } catch(e){} }   /* un cellulaire est branché : on se rebranchera seul après un rechargement */
    if (o.m === "allo"){ const neuf = Date.now() - (T.vu || 0) > 25000; T.branche = true; T.vu = Date.now(); majPill(); if (neuf) montrerBranche(); pousser(true); return; }
    if (o.m === "vie"){ T.vu = Date.now(); majPill(); return; }
    if (o.m === "bye"){ T.vu = 0; majPill(); return; }
    if (o.m !== "cmd" || !RD.drv) return;
    const c = o.c, clic = id => { const b = $("#" + id); if (b && !b.disabled) b.click(); };
    /* la télécommande change de page : on revient à 100 %, page centrée (pas quand « suivant » montre seulement la réponse suivante) */
    if (/^(next|prev|goto|mod)$/.test(c)){ const p0 = curPage(); setTimeout(() => { if (curPage() !== p0 && Math.abs(RD.z - 1) > .01) clic("tbZv"); }, 150); }
    if (c === "next") turn(1); else if (c === "prev") turn(-1);
    else if (c === "goto") aller(+o.n || 1);
    else if (c === "mod"){ const x = mods()[o.i]; if (x){ if (typeof x.page === "number") aller(x.page); else if (x.run){ try { x.run(); } catch(e){} setTimeout(pousser, 300); } } }
    else if (c === "tdb"){ if ($("#accueilOv") && !$("#accueilOv").hidden){ try { window.revenirDuTdb(); } catch(e){} } else { try { allerTableauDeBord(); } catch(e){} } setTimeout(() => pousser(true), 600); return; }
    else if (c === "rep") answers();
    else if (c === "anim") clic("tbAnim");
    else if (c === "noir") clic("tbNoir");
    else if (c === "pan"){ const sc = $("#rstage"); if (sc){ sc.scrollLeft += (+o.dx || 0) * 2.6; sc.scrollTop += (+o.dy || 0) * 2.6; } return; }
    else if (c === "laser"){ laserTele(+o.x, +o.y, !!o.on); return; }
    else if (c === "pz"){ const st = $("#rstage"), r = st.getBoundingClientRect(), f = Math.max(.5, Math.min(2, +o.f || 1));   /* pincement sur le pavé = même zoom que la roulette, centré */
      zoomSouris({clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, deltaY: -Math.log(f) / .0075, deltaMode: 0, ecran: 1}, null); setTimeout(pousser, 400); return; }
    else if (c === "zi") clic("tbZi"); else if (c === "zo") clic("tbZo"); else if (c === "zv") clic("tbZv");
    setTimeout(pousser, 250);
  }
  /* Pointeur laser de la télécommande : le pavé du cellulaire = l'écran (position absolue), point rouge lumineux qui s'efface au relâchement */
  let dot = null, cache = null;
  function laserTele(x, y, on){
    if (!dot){ dot = document.createElement("div"); dot.id = "laserTele";
      dot.style.cssText = "position:fixed;left:0;top:0;width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:50%;background:radial-gradient(circle,#fff 0 18%,#ff2a2a 34%,rgba(255,30,30,.55) 60%,rgba(255,0,0,0) 72%);box-shadow:0 0 22px 8px rgba(255,40,40,.55);z-index:2147483000;pointer-events:none;opacity:0;transition:opacity .25s,transform 70ms linear;will-change:transform";
      document.body.appendChild(dot); }
    clearTimeout(cache);
    dot.style.transform = `translate(${Math.round(x * innerWidth)}px, ${Math.round(y * innerHeight)}px)`;
    if (on){ dot.style.opacity = 1; cache = setTimeout(() => { dot.style.opacity = 0; }, 4000); }
    else cache = setTimeout(() => { dot.style.opacity = 0; }, 700);
  }
  /* pastille « Télécommande branchée » dans la barre du livre : le cellulaire donne signe de vie aux 10 s */
  function majPill(){ const p = $("#telePill"); if (p) p.hidden = !(T.vu && Date.now() - T.vu < 25000); }
  setInterval(majPill, 2000);
  function brancher(){
    if (T.canal) return Promise.resolve();
    /* même lien pendant 24 h sur cet ordinateur : recharger la page ne débranche plus le cellulaire */
    if (!T.jeton){ try { const g = JSON.parse(localStorage.getItem("teleJeton") || "null"); if (g && g.k && Date.now() - g.t < 864e5) T.jeton = g.k; } catch(e){} }
    T.jeton = T.jeton || jeton(); try { localStorage.setItem("teleJeton", JSON.stringify({k: T.jeton, t: Date.now()})); } catch(e){}
    return charger().then(() => {
      const sb = T.sb = window.supabase.createClient(SB_URL, SB_CLE, {realtime: {params: {eventsPerSecond: 60}}});
      const abonner = () => {
        T.canal = sb.channel("pda-livre-" + T.jeton, {config: {broadcast: {self: false}}});
        T.canal.on("broadcast", {event: "m"}, ({payload}) => { try { ordre(payload); } catch(e){} });
        T.canal.subscribe(st => { T.pret = st === "SUBSCRIBED"; majEtatOv(); if (T.pret) pousser(true);
          else if (/CLOSED|ERROR|TIMED_OUT/.test(st) && !T.reco){ T.reco = setTimeout(() => { T.reco = 0; try { sb.removeChannel(T.canal); } catch(e){} abonner(); }, 3000); } });   /* relais coupé : on se rebranche seul */
      };
      abonner();
      setInterval(() => pousser(false), 500);
    });
  }
  try { const g = JSON.parse(localStorage.getItem("teleJeton") || "null"); if (g && g.vu && Date.now() - g.vu < 4 * 3600e3) setTimeout(() => brancher().catch(() => {}), 2500); } catch(e){}
  function lien(){ const u = new URL("telecommande.html", location.href); u.search = ""; u.hash = "k=" + T.jeton; return u.toString(); }
  function majEtatOv(){ const p = $("#qrPage"); if (!p || $("#qrOv").hidden || !$("#qrOv").classList.contains("tele")) return;
    p.textContent = T.branche ? "Télécommande branchée ✓" : T.pret ? "Prêt : scanne avec ton cellulaire" : "Connexion au relais…"; }
  function montrerBranche(){ if ($("#qrOv").classList.contains("tele") && !$("#qrOv").hidden){ majEtatOv(); setTimeout(() => { if ($("#qrOv").classList.contains("tele")) $("#qrOv").hidden = true; }, 1200); } else if (window.aviser) aviser("Télécommande branchée"); }
  window.montrerTele = function(){
    const ov = $("#qrOv"), aide = ov.querySelector(".qr-aide"), deb = $("#qrDebut");
    ov.classList.add("tele"); deb.hidden = true;
    $("#qrTitre").textContent = "Télécommande";
    aide.textContent = "Scanne ce code avec l'appareil photo de ton cellulaire : tu pourras tourner les pages, montrer les réponses et changer de module de n'importe où dans la classe. Garde ce code pour toi.";
    $("#qrCode").innerHTML = ""; $("#qrUrl").textContent = ""; ov.hidden = false; majEtatOv();
    brancher().then(() => { dessinerQr(lien()); majEtatOv(); }).catch(() => { $("#qrPage").textContent = "Relais injoignable : vérifie Internet."; });
  };
  $("#tbTele").onclick = () => window.montrerTele();
  /* l'avis du code QR des élèves reprend son texte d'origine */
  const aide0 = $("#qrOv .qr-aide").textContent, qr0 = window.montrerQr;
  window.montrerQr = montrerQr = function(){ $("#qrOv").classList.remove("tele"); $("#qrOv .qr-aide").textContent = aide0; return qr0.apply(this, arguments); };
  $("#tbQr").onclick = () => montrerQr();
})();
