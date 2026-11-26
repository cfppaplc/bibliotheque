/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — session du DEP d'un groupe (26 nov.)
   Le code du groupe commence par l'année et le mois du début (2608PLCA1 = août 2026).
   Jeremy : août à janvier = DEP 1, février à juin = DEP 2, puis DEP 3 et DEP 4 l'année suivante. */
window.sessionDEP = function(g, d){ const m = String(g || "").match(/^(\d{2})(\d{2})/); if (!m || +m[2] < 1 || +m[2] > 12) return 0; d = d || new Date();
  const ecart = (d.getFullYear() - (2000 + +m[1])) * 12 + (d.getMonth() + 1 - +m[2]); return ecart < 0 ? 1 : Math.floor(ecart / 6) + 1; };
/* code d'essai 69696 (Jeremy, 26 nov. : « avec un code genre 69696 je devrais avoir accès à tout pour les tests ») */
window.CARTE_ESSAI = { c:"MP-69696-ESSAI0", g:"ESSAI", p:"Essai" };
window.factureOuverte = async function(g){ if (g === "ESSAI") return true; const n = sessionDEP(g); if (!n) return false; try { const r = await (await fetch("reglages.json", { cache:"no-cache" })).json(); return (r.facture || [2]).includes(n); } catch(e){ return false; } };
