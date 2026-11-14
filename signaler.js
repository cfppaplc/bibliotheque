/* © 2026 Jérémy Raymond. Tous droits réservés.
   Signaler un problème (8 nov.) : fenêtre « Signaler un problème » (window.mpSignaler) + erreurs captées automatiquement.
   Tout part sur le sujet ntfy.sh SUJET : Jeremy s'y abonne dans l'appli ntfy (avis sur son cellulaire).
   Rien de personnel n'est envoyé à part le nom du compte (déjà connu de l'admin); jamais de mot de passe ni de contenu de livre. */
(function(){
  "use strict";
  var SUJET = "https://ntfy.sh/metierplus-signal-f3ce60fd2f6c0f46";

  function contexte(){
    var c = [];
    try { var n = localStorage.getItem("etaitConnecte") || localStorage.getItem("dernierNom"); c.push("Compte : " + (n || "visiteur")); } catch(e){}
    c.push("Page : " + ((location.pathname.replace(/^\//, "") + location.search) || "accueil"));
    try {
      var RD = window.RD;
      var t = document.getElementById("readerTitle");
      if (RD && document.querySelector("#reader.open")) {
        var p = ""; try { p = RD.drv && RD.drv.state ? RD.drv.state().label : ""; } catch(e){}
        c.push((RD.wb ? "Tableau blanc" : "Livre : " + ((t && t.textContent) || RD.book)) + (p && !RD.wb ? " · page " + p : ""));
      }
    } catch(e){}
    var ua = navigator.userAgent, nav = (ua.match(/(Edg|Chrome|Firefox|Version)\/(\d+)/) || [])[0] || "";
    var os = /iPad|Macintosh.*Mobile/.test(ua) ? "iPad" : /iPhone/.test(ua) ? "iPhone" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac/.test(ua) ? "Mac" : /CrOS/.test(ua) ? "Chromebook" : /Linux/.test(ua) ? "Linux" : "?";
    c.push("Appareil : " + os + " · " + nav.replace("Version", "Safari").replace("Edg", "Edge") + " · écran " + screen.width + "×" + screen.height + (matchMedia("(pointer:coarse)").matches ? " tactile" : ""));
    return c.join("\n");
  }

  function envoyer(titre, texte, prio, tags){
    return fetch(SUJET, { method: "POST", body: texte, headers: { "Title": titre, "Priority": prio || "default", "Tags": tags || "" } })
      .then(function(r){ if (!r.ok) throw new Error(r.status); });
  }
  // ntfy n'accepte que l'ASCII dans les en-têtes : on retire les accents du titre
  function ascii(s){ return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\x20-\x7e]/g, "").slice(0, 120); }

  /* ---- Erreurs automatiques ---- */
  var vues = {}, nb = 0;
  var BRUIT = /ResizeObserver loop|Script error\.?$|AbortError|NotAllowedError|play\(\) request|fullscreen|Load failed|Failed to fetch|NetworkError|cancelled|annulé|chrome-extension|moz-extension|safari-extension|Transition was aborted|invalid state|View ?transition|ethereum|web3|solana/i;
  function erreur(msg, ou){
    msg = String(msg || "").slice(0, 300);
    if (!msg || BRUIT.test(msg) || BRUIT.test(ou || "")) return;
    if (/localhost|127\.0\.0\.1/.test(location.hostname)) return;   // pas pendant les essais
    var cle = msg + "|" + (ou || "");
    if (vues[cle] || nb >= 3) return;   // au plus 3 erreurs différentes par visite
    vues[cle] = 1; nb++;
    envoyer("Erreur : " + ascii(msg).slice(0, 80), msg + (ou ? "\nÀ : " + ou : "") + "\n\n" + contexte(), "low", "warning").catch(function(){});
  }
  window.addEventListener("error", function(e){
    if (e.target && e.target !== window) return;   // image ou fichier manquant : pas une erreur de code
    erreur(e.message, (e.filename || "").replace(location.origin + "/", "") + (e.lineno ? ":" + e.lineno : ""));
  });
  window.addEventListener("unhandledrejection", function(e){
    var r = e.reason; erreur(r && (r.message || r.name) || String(r), r && r.stack ? String(r.stack).split("\n")[1] : "");
  });
  window.mpErreurLivre = erreur;   // pour les erreurs venant d'un livre (cadre)

  /* ---- Fenêtre « Signaler un problème » ---- */
  var CSS = ".sg-ov{position:fixed;inset:0;z-index:2147483000;background:#0009;display:flex;align-items:center;justify-content:center;padding:16px;animation:sgF .2s}"
    + "@keyframes sgF{from{opacity:0}}"
    + ".sg-b{width:min(480px,100%);background:#17181d;color:#eee;border:1px solid #2c2d33;border-radius:16px;box-shadow:0 20px 60px #0008;font:15px/1.5 system-ui,-apple-system,Segoe UI,sans-serif;overflow:hidden}"
    + ".sg-h{display:flex;align-items:center;gap:10px;padding:16px 18px;border-bottom:1px solid #2c2d33}.sg-h b{font-size:17px;flex:1}"
    + ".sg-x{background:none;border:0;color:#aaa;font-size:22px;cursor:pointer;width:40px;height:40px;border-radius:8px}.sg-x:hover{background:#ffffff12;color:#fff}"
    + ".sg-c{padding:16px 18px}.sg-c p{margin:0 0 10px;color:#b8b9c0;font-size:14px}"
    + ".sg-t{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}.sg-t button{border:1px solid #3a3b42;background:#ffffff08;color:#ddd;border-radius:999px;padding:8px 13px;font:inherit;font-size:13.5px;cursor:pointer;min-height:38px}.sg-t button.on{background:#EB6A22;border-color:#EB6A22;color:#fff}"
    + ".sg-c textarea{width:100%;box-sizing:border-box;min-height:110px;border-radius:10px;border:1px solid #3a3b42;background:#0e0f12;color:#eee;padding:10px 12px;font:inherit;resize:vertical}"
    + ".sg-c textarea:focus{outline:2px solid #EB6A22;outline-offset:1px;border-color:transparent}"
    + ".sg-i{font-size:12.5px;color:#8a8b92;margin:8px 0 0}"
    + ".sg-p{display:flex;justify-content:flex-end;gap:8px;padding:0 18px 18px}"
    + ".sg-p button{border:0;border-radius:10px;padding:11px 18px;font:inherit;font-weight:650;cursor:pointer;min-height:44px}"
    + ".sg-a{background:#ffffff10;color:#ddd}.sg-e{background:#EB6A22;color:#fff}.sg-e:disabled{opacity:.5;cursor:default}"
    + ".sg-ok{text-align:center;padding:30px 20px}.sg-ok i{display:inline-flex;width:54px;height:54px;border-radius:50%;background:#1f9d55;align-items:center;justify-content:center;margin-bottom:10px}"
    + "body.clair .sg-b,html.clair .sg-b{background:#fff;color:#1b1c20;border-color:#e4e1dc}body.clair .sg-h,html.clair .sg-h{border-color:#ece9e4}"
    + "body.clair .sg-c p,html.clair .sg-c p{color:#55565d}body.clair .sg-t button,html.clair .sg-t button{background:#f6f4f1;border-color:#e0ddd7;color:#2a2b30}"
    + "body.clair .sg-c textarea,html.clair .sg-c textarea{background:#fbfaf8;border-color:#dcd8d1;color:#1b1c20}body.clair .sg-a,html.clair .sg-a{background:#efece7;color:#2a2b30}"
    + "body.clair .sg-x:hover,html.clair .sg-x:hover{background:#0000000d;color:#000}";

  window.mpSignaler = function(){
    if (document.querySelector(".sg-ov")) return;
    if (!document.getElementById("sgCss")) { var st = document.createElement("style"); st.id = "sgCss"; st.textContent = CSS; document.head.appendChild(st); }
    var ctx = contexte();   // pris tout de suite : le livre et la page où le prof était
    var ov = document.createElement("div"); ov.className = "sg-ov";
    ov.innerHTML = '<div class="sg-b" role="dialog" aria-label="Signaler un problème"><div class="sg-h"><b>Signaler un problème</b><button class="sg-x" aria-label="Fermer">×</button></div>'
      + '<div class="sg-c"><p>Décris ce qui ne marche pas. L\'administrateur reçoit ton message tout de suite.</p>'
      + '<div class="sg-t"><button data-t="Bogue">Quelque chose brise</button><button data-t="Lent">C\'est lent</button><button data-t="Livre">Erreur dans un livre</button><button data-t="Idee">Une idée</button></div>'
      + '<textarea placeholder="Ex. : Page 42, la réponse ne s\'affiche pas quand je clique."></textarea>'
      + '<p class="sg-i">Le livre, la page et le type d\'appareil sont ajoutés automatiquement.</p></div>'
      + '<div class="sg-p"><button class="sg-a">Annuler</button><button class="sg-e" disabled>Envoyer</button></div></div>';
    document.body.appendChild(ov);
    var ta = ov.querySelector("textarea"), go = ov.querySelector(".sg-e"), type = "";
    function fermer(){ ov.remove(); document.removeEventListener("keydown", esc, true); }
    function esc(e){ if (e.key === "Escape") { e.stopPropagation(); fermer(); } }
    document.addEventListener("keydown", esc, true);
    ov.addEventListener("click", function(e){ if (e.target === ov) fermer(); });
    ov.querySelector(".sg-x").onclick = fermer; ov.querySelector(".sg-a").onclick = fermer;
    ov.querySelector(".sg-t").onclick = function(e){
      var b = e.target.closest("button"); if (!b) return;
      ov.querySelectorAll(".sg-t button").forEach(function(x){ x.classList.toggle("on", x === b); }); type = b.dataset.t;
    };
    ta.oninput = function(){ go.disabled = ta.value.trim().length < 3; };
    if (!matchMedia("(pointer:coarse)").matches) setTimeout(function(){ ta.focus(); }, 50);
    go.onclick = function(){
      go.disabled = true; go.textContent = "Envoi…";
      var nom = ""; try { nom = localStorage.getItem("etaitConnecte") || localStorage.getItem("dernierNom") || ""; } catch(e){}
      var tag = { Bogue: "bug", Lent: "turtle", Livre: "books", Idee: "bulb" }[type] || "speech_balloon";
      envoyer(ascii((type === "Idee" ? "Idee" : "Probleme") + (nom ? " de " + nom : "")), ta.value.trim() + "\n\n" + ctx, type === "Idee" ? "default" : "high", tag)
        .then(function(){
          ov.querySelector(".sg-b").innerHTML = '<div class="sg-ok"><i><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg></i><div style="font-weight:700;font-size:17px">Merci, c\'est envoyé !</div><p style="color:#8a8b92;margin:6px 0 0">On s\'en occupe.</p></div>';
          setTimeout(fermer, 1800);
        })
        .catch(function(){ go.disabled = false; go.textContent = "Réessayer"; ov.querySelector(".sg-i").textContent = "L'envoi n'a pas marché. Vérifie ta connexion Internet et réessaie."; });
    };
  };
})();
