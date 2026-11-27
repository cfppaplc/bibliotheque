/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — plan du magasin (25 nov.)
   Tiré de l'artefact « Plan du magasin » de Jeremy (cotes en pouces, d'après son croquis). Les affiches de rangée (D à K)
   des raccords à préparer clignotent; une rangée dont tout est coché devient verte et arrête de clignoter. */
window.PlanMagasin = (function(){
  const F = { left:450, diag:118, top:198, rightDrop:240, ext:149, K:20, chain:[["K",20],["a",49],["r",28],["a",49],["r",32],["a",36.5],["r",38],["a",47]] };
  const V = { upY:78, upL:192, loY:318, loL:180, r4x:34, r4w:30, c1:48, c2:36, winA:48, winW:82, sec:12 };   /* sec : cases par côté d'étagère (haut + bas), à ajuster après le recensement */
  try { Object.assign(V, JSON.parse(localStorage.getItem("planMag2") || "{}")); } catch(e){}   /* mêmes réglages que l'artefact */
  /* svg(actives, faites) : chaîne SVG; actives et faites = ensembles de lettres de rangée */
  /* 25 nov. (Jeremy : « un point pour chaque raccord, à la Amazon ») : rangée « H-4 » (ou « H-4-B ») = côté H, case 4.
     Les cases d'un côté se comptent de la fenêtre vers le fond : l'étagère du haut, puis celle du bas. */
  /* 26 nov. (Jeremy) : chaque côté d'étagère est coupé en 4 parties numérotées (1 à 56, à partir de la fenêtre de service);
     Administration → Magasin dit quelles cases sont dans chaque partie (plan.parties du catalogue), modifiable si les cases changent.
     Texte d'une partie : « 2-5, 12-15 » (lettre du plan) ou « A 1-30, B 1-7 » (autre lettre). */
  const ORDRE = ["J", "I", "H", "G", "F", "E", "D", "K"], NPART = 4;
  let CASES = {}, TAILLES = {};   /* TAILLES : longueur relative de chaque partie (1 par défaut; 0 = pas de partie), ex. grande étagère = 4, petite = 1 */
  /* un étage = un groupe entre virgules; « 139-142 + 154-165 » = un même étage fait de deux suites (la place de la case suit l'ordre écrit) */
  function lireCases(t, lettreDefaut){ const L = []; let l = lettreDefaut;
    String(t || "").toUpperCase().split(/[,;]/).forEach(g => { const S = [];
      g.split("+").forEach(x => { const m = x.trim().match(/^([A-Z])?\s*-?\s*(\d+)\s*(?:-\s*(\d+))?$/); if (!m) return; if (m[1]) l = m[1];
        const a = +m[2], b = m[3] ? +m[3] : a; S.push([l, Math.min(a, b), Math.max(a, b)]); });
      const tot = S.reduce((s, x) => s + x[2] - x[1] + 1, 0); let off = 0; S.forEach(x => { L.push([x[0], x[1], x[2], off, tot]); off += x[2] - x[1] + 1; }); }); return L; }
  function partieDe(r, parts){ const m = String(r || "").trim().toUpperCase().match(/^([A-Z])\s*-?\s*(\d+)/); if (!m) return null; const n = +m[2];
    for (const p of parts) for (const [l, a, b, off, tot] of lireCases(CASES[p.n], p.l)) if (l === m[1] && n >= a && n <= b) return { P:p, f:(off + n - a + .5) / tot };   /* f : place de la case dans son étage, de l'allée vers le fond */
    return null; }
  const taille = n => { const t = parseFloat(TAILLES[n]); return isFinite(t) && t >= 0 ? t : 1; };
  function svg(actives, faites, points, opts){ opts = opts || {};
    actives = actives || new Set(); faites = faites || new Set(); points = points || []; const faces = {};
    const W = F.chain.reduce((s, c) => s + c[1], 0), dh = W - F.top, R = Math.sqrt(F.diag ** 2 - dh ** 2), H = F.left + R, X2 = W + F.ext;
    const room = [[0, R], [dh, 0], [W, 0], [W, F.rightDrop], [X2, F.rightDrop], [X2, H], [0, H]];
    const etat = l => faites.has(l) ? "fait" : actives.has(l) ? "actif" : "";
    const sign = (x, y, l, sg) => `<g class="pm-s ${etat(l)}" data-l="${l}" data-s="${sg || 0}" style="cursor:pointer"><rect x="${x - 11}" y="${y - 11}" width="22" height="22" rx="4"/><text x="${x}" y="${y + 1}">${l}</text></g>`;
    /* face d'étagère : bande le long du côté de la rangée, allumée en même temps que l'affiche */
    const face = (x, y, h, l) => { (faces[l] = faces[l] || []).push([x + 3, y, h]); return `<rect class="pm-f ${etat(l)}" x="${x}" y="${y}" width="6" height="${h}" rx="2"/>`; };
    let o = `<style>.pm-mur{fill:none;stroke:#14213d;stroke-width:4}.pm-r{fill:#c9d0da;stroke:#14213d;stroke-width:.8}.pm-c{fill:#eef1f5;stroke:#14213d;stroke-width:.8;stroke-dasharray:3 2}
      .pm-s rect{fill:#fff;stroke:#111;stroke-width:1.2}.pm-s text{font:800 13px system-ui,sans-serif;text-anchor:middle;dominant-baseline:middle;fill:#111}
      .pm-s.actif rect{fill:#EB6A22;stroke:#EB6A22;animation:pmFl .8s ease-in-out infinite alternate}.pm-s.actif text{fill:#fff}
      .pm-s.fait rect{fill:#1E8A55;stroke:#1E8A55}.pm-s.fait text{fill:#fff}
      @keyframes pmFl{from{opacity:1}to{opacity:.35}}@media (prefers-reduced-motion:reduce){.pm-s.actif rect{animation:none}}
      .pm-f{fill:transparent}.pm-f.actif{fill:#EB6A22;animation:pmFl .8s ease-in-out infinite alternate}.pm-f.fait{fill:#1E8A55}
      @media (prefers-reduced-motion:reduce){.pm-f.actif{animation:none}}
      .pm-p{fill:#EB6A22;stroke:#fff;stroke-width:2;animation:pmFl .6s ease-in-out infinite alternate}.pm-p.fait{fill:#1E8A55;animation:none}
      .pm-pt{font:800 9px system-ui,sans-serif;fill:#fff;text-anchor:middle;dominant-baseline:middle;pointer-events:none}
      .pm-l{font:600 11px system-ui,sans-serif;fill:#5b6678;text-anchor:middle}</style>`;
    o += `<polygon points="${room.join(" ")}" fill="#fff"/>`;
    const yK = R * (1 - F.K / dh);
    o += `<polygon class="pm-r" points="0,${R} ${F.K},${yK} ${F.K},${H} 0,${H}"/>`;
    const c = [[W, F.rightDrop], [X2, F.rightDrop], [X2, H], [X2 - V.c2, H], [X2 - V.c2, F.rightDrop + V.c1], [W, F.rightDrop + V.c1]];
    o += `<polygon class="pm-c" points="${c.join(" ")}"/><text class="pm-l" x="${(W + X2 - V.c2) / 2}" y="${F.rightDrop + V.c1 / 2 + 4}">Comptoir</text>`;
    let x = 0; const racks = []; for (const [t, w] of F.chain){ if (t === "r") racks.push([x, w]); x += w; }
    const L = [["J", "I"], ["H", "G"], ["F", "E"]];
    racks.forEach(([rx, rw], i) => { for (const [y0, len, sg] of [[V.upY, V.upL, 0], [V.loY, V.loL, 1]]){
      o += `<rect class="pm-r" x="${rx}" y="${y0}" width="${rw}" height="${len}"/>` + face(rx - 7, y0, len, L[i][0]) + face(rx + rw + 1, y0, len, L[i][1]);
      /* affiches au bout de l'étagère (comme une affiche d'allée), une par côté, collées sur l'étagère */
      o += sign(rx + rw / 2 - 12, y0 - 14, L[i][0], sg) + sign(rx + rw / 2 + 12, y0 - 14, L[i][1], sg); } });
    const r3 = racks[2], r4x = r3[0] + r3[1] + V.r4x;
    o += `<rect class="pm-r" x="${r4x}" y="${V.loY}" width="${V.r4w}" height="${V.loL}"/>` + face(r4x + V.r4w + 1, V.loY, V.loL, "D") + sign(r4x + V.r4w / 2, V.loY - 14, "D");
    o += `<polygon class="pm-mur" points="${room.join(" ")}"/>`;
    o += face(F.K + 1, yK + 6, H - yK - 12, "K") + sign(F.K + 16, yK + 60, "K");
    const wa = dh + V.winA, wb = wa + V.winW;
    o += `<line x1="${wa}" y1="0" x2="${wb}" y2="0" stroke="#EB6A22" stroke-width="4"/><text class="pm-l" x="${(wa + wb) / 2}" y="16">Fenêtre de service</text>`;
    o += `<text class="pm-l" x="${dh / 2 + 14}" y="${R / 2 + 26}">Porte</text>`;
    /* parties numérotées (même ordre que l'image envoyée à Jeremy) */
    const parts = []; let k = 0;
    ORDRE.forEach(l => (faces[l] || []).forEach(([x, y, h]) => { const ns = Array.from({ length:NPART }, (_, i) => k + 1 + i), tot = ns.reduce((s, n) => s + taille(n), 0) || 1; let yy = y; k += NPART;
      ns.forEach(n => { const hh = h * taille(n) / tot; if (hh > 0) parts.push({ n, l, x, y0:yy, h:hh }); yy += hh; }); }));
    if (opts.numeros){ const DX = { K:-13, J:-10, I:10, H:-10, G:-15, F:15, E:10, D:10 };
      parts.forEach(p => { const on = opts.numeros === true || opts.numeros === p.n, cy = p.y0 + p.h / 2;
        o += `<rect x="${p.x - 4}" y="${p.y0 + 1}" width="8" height="${p.h - 2}" rx="2" fill="${on ? (p.n % 2 ? "#EB6A22" : "#1F5F8B") : "#d5dbe3"}"/><rect x="${p.x + DX[p.l] - 9}" y="${cy - 8}" width="18" height="16" rx="8" fill="#fff" stroke="#14213d"/><text class="pm-pt" style="fill:#14213d;font-size:8.5px" x="${p.x + DX[p.l]}" y="${cy + .5}">${p.n}</text>`; }); }
    /* points : un par raccord, dans sa partie si Administration l'a placée, sinon à sa case (ancienne règle) */
    const dejaP = {};
    points.forEach((pt, i) => { const Q = Object.keys(CASES).length ? partieDe(pt.r, parts) : null, P = Q && Q.P;
      if (P){ const cy = P.y0 + Math.max(8, Math.min(P.h - 8, Q.f * P.h));
        o += pt.fait ? `<circle class="pm-p fait" cx="${P.x}" cy="${cy}" r="8"/>` : `<circle cx="${P.x}" cy="${cy}" r="8" fill="none" stroke="#EB6A22" stroke-width="3"><animate attributeName="r" values="8;20" dur="1s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1s" repeatCount="indefinite"/></circle><circle class="pm-p" cx="${P.x}" cy="${cy}" r="8"><animate attributeName="fill" values="#EB6A22;#FFD25A;#EB6A22" dur=".8s" repeatCount="indefinite"/></circle>`;
        o += `<text class="pm-pt" x="${P.x}" y="${cy + .5}">${i + 1}</text>`; return; }
      if (Object.keys(CASES).length) return;   /* case placée nulle part : pas de point plutôt qu'un point au mauvais endroit */ const m = String(pt.r || "").trim().toUpperCase().match(/^([A-Z])\s*-?\s*(\d+)/); if (!m || !faces[m[1]]) return;
      const F2 = faces[m[1]], tot = F2.reduce((a, f) => a + f[2], 0), n = Math.max(1, Math.min(V.sec, +m[2])); let d = (n - .5) / V.sec * tot;
      for (const [x, y, h] of F2){ if (d <= h){ o += pt.fait ? `<circle class="pm-p fait" cx="${x}" cy="${y + d}" r="8"/>` : `<circle cx="${x}" cy="${y + d}" r="8" fill="none" stroke="#EB6A22" stroke-width="3"><animate attributeName="r" values="8;20" dur="1s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1s" repeatCount="indefinite"/></circle><circle class="pm-p" cx="${x}" cy="${y + d}" r="8"><animate attributeName="fill" values="#EB6A22;#FFD25A;#EB6A22" dur=".8s" repeatCount="indefinite"/></circle>`;
          o += `<text class="pm-pt" x="${x}" y="${y + d + .5}">${i + 1}</text>`; break; } d -= h; } });
    return `<svg viewBox="-30 -20 ${X2 + 60} ${H + 40}" role="img" aria-label="Plan du magasin">${o}</svg>`;
  }
  const lettre = r => (String(r || "").trim().match(/^[A-Za-z]/) || [""])[0].toUpperCase();
  const parties = () => { const L = []; let k = 0; [["J", 2], ["I", 2], ["H", 2], ["G", 2], ["F", 2], ["E", 2], ["D", 1], ["K", 1]].forEach(([l, s]) => { for (let i = 0; i < s * NPART; i++) L.push({ n:++k, l }); }); return L; };
  /* 26 nov. (Jeremy) : vue de face d'une rangée (clic sur sa lettre dans Administration). Un groupe = un étage, du haut vers le bas; largeur de chaque partie = sa longueur */
  /* 26 nov. (Jeremy) : on ne montre que l'étagère touchée (seg : 0 = haut, 1 = bas); une étagère sans cases entrées = « Vue de face à venir » */
  function vueFace(l, aTrouver, seg){ const T = new Set([...(aTrouver || [])].map(Number)); const P = parties().filter(p => p.l === l); let segs = []; for (let i = 0; i < P.length; i += NPART) segs.push(P.slice(i, i + NPART));
    const noms0 = segs.length > 1 ? ["Étagère du haut (fenêtre de service à gauche)", "Étagère du bas (allée du centre à gauche)"] : ["Fenêtre de service à gauche"];
    let NOMS = noms0; if (seg != null && segs[+seg]) { segs = [segs[+seg]]; NOMS = [noms0[+seg]]; }
    if (!segs.length || segs.every(S => S.every(p => !String(CASES[p.n] || "").trim()))) return `<div class="pm-face"><h4 style="margin:0 0 8px">Rangée ${l}${segs.length && NOMS[0] && noms0.length > 1 ? " · " + NOMS[0].split(" (")[0].toLowerCase() : ""}</h4><div style="padding:22px;border:2px dashed #c9d0da;border-radius:10px;text-align:center;font:700 1rem system-ui;color:#5b6678">Vue de face à venir</div></div>`;
    const COUL = ["#EB6A22", "#1F5F8B", "#2E8B57", "#7A4FA0"], nums = (a, b) => Array.from({ length:Math.min(b - a + 1, 60) }, (_, i) => a + i);
    const NOM = NOMS;
    return `<div class="pm-face"><style>@keyframes pmCl{from{background:#EB6A22;transform:scale(1)}to{background:#FFD25A;transform:scale(1.12)}}.pm-cl{animation:pmCl .7s ease-in-out infinite alternate;outline:3px solid #14213d;z-index:1;position:relative;color:#14213d!important}</style><h4 style="margin:0 0 8px">Rangée ${l}, vue de face</h4>` + segs.map((S, si) => `<div style="font:600 .8rem system-ui;color:#5b6678;margin:10px 0 4px">${NOM[si] || ""}</div><div style="display:flex;gap:8px;align-items:flex-start">`
      + (() => { const grp = p => String(CASES[p.n] || "").split(/[,;]/).map(g => g.trim()).filter(Boolean), maxR = Math.max(1, ...S.map(p => grp(p).length));
      /* 26 nov. (Jeremy : « l'étagère mauve flotte ») : une partie qui a moins d'étages (gros casiers) prend toute la hauteur de l'étagère */
      return S.filter(p => taille(p.n) > 0).map((p, k) => { const G = grp(p), c = COUL[k % 4], hR = G.length ? ((maxR * 24 - 2) - (G.length - 1) * 2) / G.length : 22;
        return `<div style="flex:${taille(p.n)};min-width:0"><div style="font:700 .75rem system-ui;color:${c};margin-bottom:3px">Partie ${p.n}</div>`
          + (G.length ? G.map(g => `<div style="display:flex;gap:2px;margin-bottom:2px;height:${hR}px">` + g.split("+").flatMap(x => { const m = x.trim().toUpperCase().match(/^([A-Z])?\s*-?\s*(\d+)\s*(?:-\s*(\d+))?$/); return m ? nums(+m[2], m[3] ? +m[3] : +m[2]) : []; })
              .map(n => `<span${T.has(n) ? ' class="pm-cl"' : ""} style="flex:1;min-width:0;height:100%;display:flex;align-items:center;justify-content:center;background:${c};color:#fff;font:700 9px system-ui;border-radius:3px;overflow:hidden">${n}</span>`).join("") + `</div>`).join("")
            : `<div style="height:22px;border:2px dashed #c9d0da;border-radius:4px;display:flex;align-items:center;justify-content:center;font:700 .75rem system-ui;color:#8a94a6">à remplir</div>`) + `</div>`; }).join(""); })() + `</div>`).join("") + `</div>`; }
  const place = r => Object.keys(CASES).length > 0 && !!partieDe(r, parties().filter(p => taille(p.n) > 0));   /* la case est-elle placée sur le plan ? */
  return { svg, lettre, parties, vueFace, place, lireCases, set cases(c){ CASES = c || {}; }, get cases(){ return CASES; }, set tailles(t){ TAILLES = t || {}; } };
})();
