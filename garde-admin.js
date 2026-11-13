/* © 2026 Jérémy Raymond. Tous droits réservés.
   Garde des pages d'essai (13 nov.) : seulement un compte administrateur connecté sur cet appareil (session de la bibliothèque, comptes.json : admin).
   Écrit en ES5 exprès. Exception : compat.html laisse passer un navigateur trop vieux pour Métier+ (on ne peut pas s'y connecter, et c'est justement ce qu'on veut diagnostiquer).
   Barrière d'usage seulement (le code reste lisible). */
(function(){
  var html = document.documentElement;
  if (/compat\.html/.test(location.pathname)) { try { new Function("async()=>{let a=null;return a?.b??1}"); } catch(e) { return; } }
  html.className += " ga-attente";
  var st = document.createElement("style");
  st.textContent = "html.ga-attente body{visibility:hidden}#gaOv{position:fixed;inset:0;z-index:99999;background:#0e1320;color:#fff;display:flex;align-items:center;justify-content:center;padding:20px;font-family:'Segoe UI',Roboto,sans-serif;visibility:visible}#gaOv .bx{max-width:440px;background:#161d2c;border:1px solid #232c40;border-radius:18px;padding:26px;text-align:center}#gaOv img{height:30px}#gaOv h1{font-size:1.4rem;margin:16px 0 8px}#gaOv p{color:#aab3c5;line-height:1.45}#gaOv a{display:inline-block;margin-top:10px;background:#EB6A22;color:#fff;text-decoration:none;font-weight:700;border-radius:12px;padding:13px 22px}";
  document.head.appendChild(st);
  var fini = false;
  function fin(ok){
    if (fini) return; fini = true;
    html.className = html.className.replace(" ga-attente", "");
    if (ok) return;
    var g = function(){ document.body.innerHTML = '<div id="gaOv"><div class="bx"><img src="img/metier-plus-blanc.svg" alt="Métier+"><h1>Réservé à l’administrateur</h1><p>Les pages d’essai sont offertes seulement au compte administrateur connecté sur cet appareil.</p><a href="./">Ouvrir Métier+</a></div></div>'; };
    document.body ? g() : addEventListener("DOMContentLoaded", g);
  }
  setTimeout(function(){ fin(false); }, 5000);
  try {
    var r = indexedDB.open("acces", 1);
    r.onupgradeneeded = function(){ r.result.createObjectStore("s"); };
    r.onerror = function(){ fin(false); };
    r.onsuccess = function(){ try {
      var t = r.result.transaction("s").objectStore("s").get("session");
      t.onerror = function(){ fin(false); };
      t.onsuccess = function(){ var s = t.result; if (!s || !s.id) return fin(false);
        fetch("comptes.json", {cache: "no-store"}).then(function(x){ return x.json(); }).then(function(d){ var c = d && d.comptes && d.comptes[s.id]; fin(!!(c && c.admin)); })["catch"](function(){ fin(false); }); };
    } catch(e) { fin(false); } };
  } catch(e) { fin(false); }
})();
