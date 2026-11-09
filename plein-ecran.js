/* © 2026 Jérémy Raymond. Tous droits réservés.
   Petit carré « plein écran » en haut à droite, le même sur toutes les pages (9 nov., demande de Jeremy).
   Pas dans un cadre (accueil de classe intégré, télécommande du tiroir) ni sur cellulaire. */
(function(){
  if (window.top !== window || /[?&]inclus=1/.test(location.search)) return;
  var d = document;
  if (!(d.fullscreenEnabled || d.webkitFullscreenEnabled)) return;
  function poser(){
    if (d.getElementById("fsBtn")) return;
    var st = d.createElement("style");
    st.textContent = "#fsBtn{position:fixed;top:3px;right:3px;z-index:2147483000;width:26px;height:26px;padding:0;border:0;border-radius:7px;background:rgba(20,20,22,.35);color:#fff;display:flex;align-items:center;justify-content:center;opacity:.3;cursor:pointer;transition:opacity .2s}"
      + "#fsBtn:hover,#fsBtn:active{opacity:.95}#fsBtn svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}"
      + "@media (pointer:coarse){#fsBtn{width:34px;height:34px;opacity:.4}}@media (max-width:640px){#fsBtn{display:none}}"
      + "body.clair:not(:has(.reader.open)) #fsBtn,html.clair #fsBtn{background:rgba(255,255,255,.55);color:#222}@media print{#fsBtn{display:none}}";
    d.head.appendChild(st);
    var b = d.createElement("button"); b.id = "fsBtn"; b.type = "button";
    var ENTRER = '<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>', QUITTER = '<svg viewBox="0 0 24 24"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>';
    function fs(){ return d.fullscreenElement || d.webkitFullscreenElement; }
    function maj(){ var on = !!fs(); b.innerHTML = on ? QUITTER : ENTRER; b.title = on ? "Quitter le plein écran" : "Plein écran (Échap pour quitter)"; b.setAttribute("aria-label", b.title); }
    b.addEventListener("click", function(e){ e.stopPropagation(); try {
      if (fs()) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
      else { var r = d.documentElement; var p = (r.requestFullscreen || r.webkitRequestFullscreen).call(r); if (p && p.catch) p.catch(function(){}); }
    } catch(x){} });
    d.addEventListener("fullscreenchange", maj); d.addEventListener("webkitfullscreenchange", maj); maj();
    d.body.appendChild(b);
  }
  if (d.body) poser(); else d.addEventListener("DOMContentLoaded", poser);
})();
