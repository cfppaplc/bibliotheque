/* © 2026 Jérémy Raymond. Tous droits réservés.
   Petit carré « plein écran » en haut à droite, le même sur toutes les pages (9 nov., demande de Jeremy).
   Pas dans un cadre (accueil de classe intégré, télécommande du tiroir) ni sur cellulaire. */
(function(){
  /* 27 nov. (Jeremy : « je veux que ça reste en plein écran sur tout le site ») : la page ouverte dans la « coquille » (cadre mpCoquille)
     garde son bouton; il agit sur la page du dessus, qui porte le plein écran. */
  var COQ = window.name === "mpCoquille" && window.parent !== window;
  if ((window.top !== window && !COQ) || /[?&]inclus=1/.test(location.search)) return;
  var d = COQ ? window.parent.document : document;
  if (!(d.fullscreenEnabled || d.webkitFullscreenEnabled)) return;

  /* Garder le plein écran d'une page à l'autre (12 nov., « quand on clique sur Labo, ça revient en écran normal ») :
     le navigateur quitte toujours le plein écran en changeant de page et ne permet de le redemander qu'après un geste.
     Page quittée en plein écran → drapeau; sur la page suivante, le 1er toucher ou la 1re touche le rétablit. */
  function enFs(){ return d.fullscreenElement || d.webkitFullscreenElement; }
  window.addEventListener("pagehide", function(){ try { if (enFs()) sessionStorage.mpPleinEcran = String(Date.now()); } catch(x){} });
  var t0 = 0; try { t0 = +sessionStorage.mpPleinEcran || 0; sessionStorage.removeItem("mpPleinEcran"); } catch(x){}
  if (!COQ) coquille();
  if (!COQ && t0 && Date.now() - t0 < 120000) {
    var bulle = null;
    var retablir = function(){
      d.removeEventListener("pointerup", retablir, true); d.removeEventListener("keydown", retablir, true); d.removeEventListener("touchend", retablir, true);
      if (bulle) bulle.remove();
      if (enFs()) return;
      try { var r = d.documentElement; var p = (r.requestFullscreen || r.webkitRequestFullscreen).call(r); if (p && p.catch) p.catch(function(){}); } catch(x){}
    };
    d.addEventListener("pointerup", retablir, true); d.addEventListener("keydown", retablir, true); d.addEventListener("touchend", retablir, true);
    var montrer = function(){
      if (enFs() || !d.body || innerWidth <= 640) return;
      bulle = d.createElement("div"); bulle.id = "fsRetour";
      bulle.textContent = "Touche l'écran pour revenir en plein écran";
      bulle.style.cssText = "position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:2147483000;background:rgba(14,19,32,.9);color:#fff;font:600 14px/1.2 'Segoe UI',Roboto,sans-serif;padding:9px 16px;border-radius:999px;box-shadow:0 4px 18px rgba(0,0,0,.3);pointer-events:none;transition:opacity .4s";
      d.body.appendChild(bulle);
      setTimeout(function(){ if (bulle) bulle.style.opacity = "0"; }, 5000);
      setTimeout(function(){ if (bulle) { bulle.remove(); bulle = null; } }, 5500);
    };
    if (d.body) montrer(); else d.addEventListener("DOMContentLoaded", montrer);
  }
  /* La coquille : en plein écran, changer de page ferait quitter le plein écran (règle des navigateurs).
     On ouvre plutôt la page suivante dans un cadre qui couvre tout l'écran; la page du dessus garde le plein écran.
     Retour (flèche du navigateur) : le cadre recule; revenu au début, il disparaît. Quitter le plein écran : on va vraiment à la page affichée. */
  function coquille(){
    var cadre = null;
    var memeSite = function(u){ try { var x = new URL(u, location.href); return x.origin === location.origin && /^https?:$/.test(x.protocol) && !/\.(pdf|zip|jpe?g|png|mp4|docx?|xlsx?|pptx?)$/i.test(x.pathname) ? x : null; } catch(e){ return null; } };
    var ouvrir = function(u){
      if (!cadre) {
        cadre = d.createElement("iframe"); cadre.name = "mpCoquille"; cadre.id = "mpCoquille"; cadre.title = "Métier+";
        cadre.setAttribute("allow", "fullscreen; autoplay; clipboard-read; clipboard-write; camera; microphone; web-share; screen-wake-lock");
        cadre.style.cssText = "position:fixed;inset:0;width:100%;height:100%;border:0;z-index:2147483600;background:#fff";
        cadre.addEventListener("load", function(){ try { var w = cadre.contentWindow; if (w.location.href !== "about:blank") { d.title = w.document.title || d.title; history.replaceState({ mpCoq:1 }, "", w.location.href); } } catch(e){} });
        d.body.appendChild(cadre);
        history.pushState({ mpCoq:1 }, "", u);
      }
      cadre.src = u;
    };
    var fermer = function(){ if (cadre) { cadre.remove(); cadre = null; } };
    window.addEventListener("popstate", function(e){ if (cadre && !(e.state && e.state.mpCoq)) { fermer(); try { history.replaceState(null, "", location.pathname + location.search + location.hash); } catch(x){} } });
    var surFs = function(){ if (!enFs() && cadre) { var u = ""; try { u = cadre.contentWindow.location.href; } catch(e){} if (u && u !== "about:blank") location.replace(u); } };
    d.addEventListener("fullscreenchange", surFs); d.addEventListener("webkitfullscreenchange", surFs);
    window.addEventListener("message", function(e){ if (cadre && e.source === cadre.contentWindow && e.data && e.data.type === "accueil-plein-ecran") { try { if (enFs()) (d.exitFullscreen || d.webkitExitFullscreen).call(d); else { var r = d.documentElement, q = (r.requestFullscreen || r.webkitRequestFullscreen).call(r); if (q && q.catch) q.catch(function(){}); } } catch(x){} } });
    if (window.navigation && navigation.addEventListener) {
      navigation.addEventListener("navigate", function(e){
        if (!enFs() || !e.cancelable || e.hashChange || e.downloadRequest || e.formData || e.navigationType === "reload" || e.navigationType === "traverse" || (e.destination && e.destination.sameDocument)) return;
        var x = memeSite(e.destination.url); if (!x) return;
        e.preventDefault(); ouvrir(x.href);
      });
    } else {
      d.addEventListener("click", function(e){
        if (!enFs() || e.defaultPrevented || e.button || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
        var a = e.target.closest && e.target.closest("a[href]"); if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
        var x = memeSite(a.href); if (!x || (x.pathname === location.pathname && x.search === location.search)) return;
        e.preventDefault(); ouvrir(x.href);
      }, false);
    }
  }
  function poser(){
    if (document.getElementById("fsBtn")) return; var D = d; d = document;
    var st = d.createElement("style");
    st.textContent = "#fsBtn{position:fixed;top:3px;right:3px;z-index:2147483000;width:26px;height:26px;padding:0;border:0;border-radius:7px;background:rgba(20,20,22,.35);color:#fff;display:flex;align-items:center;justify-content:center;opacity:.3;cursor:pointer;transition:opacity .2s}"
      + "#fsBtn:hover,#fsBtn:active{opacity:.95}#fsBtn svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}"
      + "@media (pointer:coarse){#fsBtn{width:34px;height:34px;opacity:.4}}@media (max-width:640px){#fsBtn{display:none}}"
      + "body.clair:not(:has(.reader.open)) #fsBtn,html.clair #fsBtn{background:rgba(255,255,255,.55);color:#222}@media print{#fsBtn{display:none}}";
    d.head.appendChild(st);
    var b = d.createElement("button"); b.id = "fsBtn"; b.type = "button";
    var ENTRER = '<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>', QUITTER = '<svg viewBox="0 0 24 24"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>';
    function fs(){ return D.fullscreenElement || D.webkitFullscreenElement; }
    function maj(){ var on = !!fs(); b.innerHTML = on ? QUITTER : ENTRER; b.title = on ? "Quitter le plein écran" : "Plein écran (Échap pour quitter)"; b.setAttribute("aria-label", b.title); }
    b.addEventListener("click", function(e){ e.stopPropagation(); try {
      if (fs()) (D.exitFullscreen || D.webkitExitFullscreen).call(D);
      else { var r = D.documentElement; var p = (r.requestFullscreen || r.webkitRequestFullscreen).call(r); if (p && p.catch) p.catch(function(){}); }
    } catch(x){} });
    D.addEventListener("fullscreenchange", maj); D.addEventListener("webkitfullscreenchange", maj); maj();
    d.body.appendChild(b);
  }
  if (document.body) poser(); else document.addEventListener("DOMContentLoaded", poser);
})();

/* 13 nov. (Jeremy : « vérifier que ma version concorde avec celle du site ») : petite version en bas à gauche.
   version.json est écrit par outils/publier.sh à chaque publication. La version lue au chargement de la page
   est comparée aux 5 min avec celle en ligne : si elle a changé, « recharge » s'affiche. */
(function(){
  if (window.top !== window || /[?&]inclus=1/.test(location.search)) return;
  /* 13 nov. : seulement pour le compte de Jeremy (connecté sur cet appareil), invisible pour les autres */
  try { const co = localStorage.getItem("etaitConnecte") || ""; if (!co || (localStorage.getItem("dernierId") !== "jeremy.raymond" && !/j[ée]r[ée]my/i.test(co))) return; } catch(e){ return; }
  const lire = () => fetch("version.json?t=" + Date.now(), { cache: "no-store" }).then(r => r.json()).then(j => j.v).catch(() => "");
  const fmt = v => { const m = /^(\d{4})-(\d\d)-(\d\d) (\d\d):(\d\d)$/.exec(v || ""); return m ? "v " + (+m[3]) + " " + ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."][m[2] - 1] + " " + m[4] + " h " + m[5] : ""; };
  lire().then(v0 => { if (!v0) return;
    const e = document.createElement("div"); e.id = "mpVersion"; e.textContent = fmt(v0); e.title = "Version de cette page : " + v0;
    e.style.cssText = "position:fixed;left:6px;bottom:4px;z-index:2147483000;font:11px/1 system-ui,sans-serif;color:rgba(128,128,128,.55);pointer-events:none;user-select:none";
    (document.body || document.documentElement).appendChild(e);
    setInterval(() => lire().then(v => { if (v && v !== v0){ e.textContent = fmt(v0) + " · nouvelle version " + fmt(v).slice(2) + " : recharge la page"; e.style.color = "#EB6A22"; } }), 300000);
  });
})();
