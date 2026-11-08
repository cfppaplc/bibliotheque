/* © 2026 Jérémy Raymond. Tous droits réservés.
   Navigateur trop ancien (ex. télé Samsung Tizen 3, Chrome 47) : au lieu d'une page cassée, un message clair.
   Écrit en JavaScript de 2009 (ES5) exprès : il doit fonctionner dans les vieux navigateurs. Chargé en premier dans le <head>. */
(function(){
  var vieux = false;
  try { new Function("var a={};async function f(){await 1};return a?.b ?? 1"); } catch (e) { vieux = true; }
  if (!vieux) return;
  var h = document.documentElement;
  h.className += " vieux-nav";
  var st = document.createElement("style");
  st.textContent = "html.vieux-nav body>*:not(#vieuxMsg){display:none!important}"
    + "html.vieux-nav,html.vieux-nav body{visibility:visible!important;background:#141414!important;margin:0;height:100%}"
    + "#vieuxMsg{font-family:Arial,sans-serif;color:#eee;max-width:900px;margin:0 auto;padding:9vh 40px;line-height:1.45}"
    + "#vieuxMsg img{height:46px;display:block;margin-bottom:34px}"
    + "#vieuxMsg h1{font-size:42px;margin:0 0 18px;color:#fff}"
    + "#vieuxMsg p{font-size:24px;margin:0 0 16px;color:#c9c9cf}"
    + "#vieuxMsg ul{font-size:24px;margin:10px 0 26px;padding-left:30px;color:#c9c9cf}#vieuxMsg li{margin-bottom:10px}"
    + "#vieuxMsg b{color:#fff}#vieuxMsg small{display:block;font-size:16px;color:#7d7d85;margin-top:30px}";
  (document.head || h).appendChild(st);
  function montrer(){
    if (document.getElementById("vieuxMsg") || !document.body) return;
    var m = navigator.userAgent.match(/Chrome\/(\d+)/);
    var d = document.createElement("div");
    d.id = "vieuxMsg";
    d.innerHTML = '<img src="img/metier-plus-blanc.svg" alt="Métier+">'
      + '<h1>Ce navigateur est trop ancien pour Métier+</h1>'
      + '<p>Métier+ a besoin d\'un navigateur récent pour afficher les livres, les plans et les outils de classe.</p>'
      + '<p>Pour l\'utiliser :</p>'
      + '<ul><li>Branche un <b>ordinateur</b> sur cet écran (câble HDMI), ou</li>'
      + '<li>ouvre Métier+ dans <b>Chrome</b>, <b>Edge</b>, <b>Firefox</b> ou <b>Safari</b> à jour, ou</li>'
      + '<li>utilise une clé TV récente (par exemple Chromecast avec Google TV).</li></ul>'
      + '<p>Adresse : <b>metierplus.app</b></p>'
      + '<small>Navigateur détecté : ' + (m ? "Chrome " + m[1] : "inconnu") + '. Les téléviseurs et tableaux interactifs de plus de 5 ans ont souvent un navigateur intégré qui ne se met plus à jour.</small>';
    document.body.appendChild(d);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montrer); else montrer();
  setTimeout(montrer, 1500);
})();
