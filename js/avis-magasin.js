/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — avis des paniers du magasin sur l'appareil de l'enseignant (25 nov.)
   Jeremy : « mets dans les réglages des profs activer les notifications ». Utilisé par Mes préférences (preferences.js).
   La clé d'approbation (magJeton|<id>) est créée la première fois; l'appareil s'abonne aux avis Web Push (fonction Supabase panier-avis). */
window.AvisMag = (function(){
  const SUPA = "https://nhxhfiaznuifcbobjuuv.supabase.co", CLE = "sb_publishable_GwzHRE-rG-rVafG7QcTOxg_S68OQHXh";
  const lire = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch(e){ return d; } };
  const ecrire = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} };
  async function rpc(f, a){ const r = await fetch(SUPA + "/rest/v1/rpc/" + f, { method:"POST", headers:{ apikey:CLE, "Content-Type":"application/json" }, body:JSON.stringify(a || {}), cache:"no-store" });
    if (!r.ok) throw new Error("Supabase ne répond pas"); return r.json(); }
  const possible = () => "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;
  const iosSansAccueil = () => /iPhone|iPad|iPod/.test(navigator.userAgent) && !navigator.standalone && !matchMedia("(display-mode: standalone)").matches;
  /* état : "actif", "inactif", "ios" (ajouter d'abord à l'écran d'accueil) ou "impossible" (navigateur sans avis) */
  function etat(ens){ if (iosSansAccueil()) return "ios"; if (!possible()) return "impossible";
    return Notification.permission === "granted" && lire("magAbonne|" + ens, false) ? "actif" : "inactif"; }
  async function jeton(ens){ let j = lire("magJeton|" + ens, ""); if (j) return j;
    j = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(24)))).replace(/[+/=]/g, c => ({ "+":"-", "/":"_", "=":"" }[c]));
    if (await rpc("panier_prof_regler", { p_ens:ens, p_jeton:j, p_sujet:null }) !== true) {
      /* 25 nov. (Jeremy : « plus facile sur deux appareils ») : la clé suit le compte (coffre « biblio », clé magJeton|{id});
         elle arrive de l'autre appareil en quelques secondes */
      for (let i = 0; i < 20; i++) { await new Promise(r => setTimeout(r, 500)); const k = lire("magJeton|" + ens, ""); if (k) return k; }
      throw new Error("ta clé d'approbation n'est pas encore arrivée de ton autre appareil. Attends quelques secondes et réessaie");
    }
    ecrire("magJeton|" + ens, j); return j; }
  /* iPhone (25 nov.) : la permission doit être demandée tout de suite au toucher, avant toute attente réseau, sinon iOS l'ignore sans rien dire */
  async function regler(ens, oui){
    if (oui && Notification.permission !== "granted") { const r = await Notification.requestPermission(); if (r !== "granted") throw new Error(r === "denied" ? "les avis sont bloqués : Réglages de l'iPhone (ou du navigateur) → Notifications → Métier+" : "permission non accordée"); }
    const j = await jeton(ens), reg = await navigator.serviceWorker.register("sw.js"); await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (oui){
      if (!sub){ const { cle } = await (await fetch(SUPA + "/functions/v1/panier-avis", { headers:{ apikey:CLE } })).json();
        sub = await reg.pushManager.subscribe({ userVisibleOnly:true, applicationServerKey:Uint8Array.from(atob(cle.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0)) }); }
      if (await rpc("panier_prof_abonner", { p_ens:ens, p_jeton:j, p_abonnement:sub.toJSON(), p_oui:true }) !== true) throw new Error("refusé");
      ecrire("magAbonne|" + ens, true);
    } else {
      if (sub){ await rpc("panier_prof_abonner", { p_ens:ens, p_jeton:j, p_abonnement:sub.toJSON(), p_oui:false }); await sub.unsubscribe(); }
      ecrire("magAbonne|" + ens, false);
    }
  }
  return { etat, regler };
})();
