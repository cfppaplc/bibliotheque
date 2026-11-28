/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — session du DEP d'un groupe (26 nov.)
   Le code du groupe commence par l'année et le mois du début (2608PLCA1 = août 2026).
   Jeremy : août à janvier = DEP 1, février à juin = DEP 2, puis DEP 3 et DEP 4 l'année suivante. */
window.sessionDEP = function(g, d){ const m = String(g || "").match(/^(\d{2})(\d{2})/); if (!m || +m[2] < 1 || +m[2] > 12) return 0; d = d || new Date();
  const ecart = (d.getFullYear() - (2000 + +m[1])) * 12 + (d.getMonth() + 1 - +m[2]); return ecart < 0 ? 1 : Math.floor(ecart / 6) + 1; };
/* code d'essai (Jeremy, 26 nov. : « un code pour avoir accès à tout pour les tests », « le code devrait être caché pour lui ») :
   le code n'est pas écrit en clair (empreinte seulement) */
window.codeEssai = async function(c){ if (!/^\d{5}$/.test(String(c))) return null;
  const h = [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode("metier+|essai|" + c)))].map(b => b.toString(16).padStart(2, "0")).join("");
  if (h !== "8f2f917e3d5ac0a9e8f455e8448e41577d02c10718efa3099c8e396e5bf0ca5a") return null;
  /* 26 nov. : sans compte connecté (un raccourci d'écran d'accueil iPhone a sa propre mémoire); le code reste caché (empreinte seulement).
     Les commandes d'essai vont à l'administrateur (premier compte admin) */
  try { const id = localStorage.getItem("dernierId") || "", C = (await (await fetch("comptes.json", { cache:"no-cache" })).json()).comptes || {};
    const adm = C[id] && C[id].admin ? id : Object.keys(C).find(x => C[x].admin); if (!adm) return null;
    return { c:"MP-" + c + "-ESSAI0", g:"ESSAI", p:"Kaleb", ens:adm }; } catch(e){ return null; } };
window.factureOuverte = async function(g){ if (g === "ESSAI") return true; const n = sessionDEP(g); if (!n) return false; try { const r = await (await fetch("reglages.json", { cache:"no-cache" })).json(); return (r.facture || [2]).includes(n); } catch(e){ return false; } };
