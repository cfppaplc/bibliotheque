/* Journal du stylet (16 nov., stylet à pointe fine qui ne fait que des points au TNI).
   Seulement pour le compte de Jeremy : quand un trait au stylet sur la toile bouge de plus de 30 px mais n'a laissé qu'un point,
   on envoie le détail des événements (types, tailles, boutons, qui les a arrêtés) au sujet des signalements. Aucun contenu, aucun nom. À retirer une fois réglé. */
(function(){
  try { if (localStorage.getItem("dernierId") !== "jeremy.raymond") return; } catch(e){ return; }
  const SUJET = "https://ntfy.sh/metierplus-signal-f3ce60fd2f6c0f46";
  let J = null, envoyes = 0;
  const c = () => document.getElementById("inkCanvas");
  const ligne = (e, ou) => [ou, e.type.replace("pointer", ""), e.pointerType, e.pointerId, Math.round(e.width) + "x" + Math.round(e.height), "p" + (e.pressure || 0).toFixed(2), "b" + e.buttons, "bt" + e.button, e.isPrimary ? "P" : "s", Math.round(e.clientX) + "," + Math.round(e.clientY), (e.target && (e.target.id || e.target.tagName)) || "?"].join(" ");
  const nbTraits = () => { try { return (INKS[inkKey()] || []).length; } catch(x){ return -1; } };
  const dernier = () => { try { const L = INKS[inkKey()] || []; const s = L[L.length - 1]; return s ? (s.t || "trait") + ":" + (s.p ? s.p.length : 0) : "-"; } catch(x){ return "?"; } };
  ["pointerdown", "pointermove", "pointerup", "pointercancel", "lostpointercapture"].forEach(t => {
    window.addEventListener(t, e => {
      if (e.pointerType !== "pen") return;
      if (t === "pointerdown"){ if (!c() || e.target !== c()) { J = null; return; } J = { L: [], n0: nbTraits(), x: e.clientX, y: e.clientY, d: 0, vus: 0, id: e.pointerId,
        etat: "wb" + (RD.wb ? 1 : 0) + " pen" + (RD.pen ? 1 : 0) + " off" + (RD.crayonOff ? 1 : 0) + " er" + (RD.eraser ? 1 : 0) + " tx" + (RD.text ? 1 : 0) + " ob" + (RD.obj ? 1 : 0) + " z" + (RD.z || 0).toFixed(2) + " PZ" + (typeof PZ !== "undefined" ? PZ.pts.size + (PZ.actif ? "a" : "") : "?") }; }
      if (!J) return;
      if (t === "pointermove"){ J.d = Math.max(J.d, Math.hypot(e.clientX - J.x, e.clientY - J.y)); if (J.L.length > 40) return; }
      J.L.push(ligne(e, "W"));
      if (t === "pointerup" || t === "pointercancel"){
        const j = J; J = null;
        setTimeout(() => {
          const pts = dernier(), n1 = nbTraits();
          if (j.d < 30 || envoyes >= 4) return;
          if (!(n1 <= j.n0 || /:1$/.test(pts) || /:0$/.test(pts))) return;   /* le trait est bien là : rien à signaler */
          envoyes++;
          const txt = "[v2] PZ fin " + (typeof PZ !== "undefined" ? PZ.pts.size + (PZ.actif ? "a" : "") + " " + [...PZ.pts.keys()].join(",") : "?") + "\nStylet : trait de " + Math.round(j.d) + " px mais " + (n1 - j.n0) + " trait(s), dernier = " + pts + "\n" + j.etat + "\n" + j.L.join("\n");
          fetch(SUJET, { method: "POST", body: txt, headers: { Title: "Journal stylet", Tags: "pencil" } }).catch(() => {});
        }, 400);
      }
    }, true);
  });
  const brancherToile = () => { const t = c(); if (!t || t.__journal) return; t.__journal = 1;
    ["pointermove", "pointerdown", "pointerup"].forEach(ty => t.addEventListener(ty, e => { if (J && e.pointerType === "pen" && J.L.length <= 41) J.L.push(ligne(e, "C")); })); };
  brancherToile(); setTimeout(brancherToile, 2000);
})();
