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
  function svg(actives, faites, points){
    actives = actives || new Set(); faites = faites || new Set(); points = points || []; const faces = {};
    const W = F.chain.reduce((s, c) => s + c[1], 0), dh = W - F.top, R = Math.sqrt(F.diag ** 2 - dh ** 2), H = F.left + R, X2 = W + F.ext;
    const room = [[0, R], [dh, 0], [W, 0], [W, F.rightDrop], [X2, F.rightDrop], [X2, H], [0, H]];
    const etat = l => faites.has(l) ? "fait" : actives.has(l) ? "actif" : "";
    const sign = (x, y, l) => `<g class="pm-s ${etat(l)}"><rect x="${x - 11}" y="${y - 11}" width="22" height="22" rx="4"/><text x="${x}" y="${y + 1}">${l}</text></g>`;
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
      @media (prefers-reduced-motion:reduce){.pm-p{animation:none}}
      .pm-l{font:600 11px system-ui,sans-serif;fill:#5b6678;text-anchor:middle}</style>`;
    o += `<polygon points="${room.join(" ")}" fill="#fff"/>`;
    const yK = R * (1 - F.K / dh);
    o += `<polygon class="pm-r" points="0,${R} ${F.K},${yK} ${F.K},${H} 0,${H}"/>`;
    const c = [[W, F.rightDrop], [X2, F.rightDrop], [X2, H], [X2 - V.c2, H], [X2 - V.c2, F.rightDrop + V.c1], [W, F.rightDrop + V.c1]];
    o += `<polygon class="pm-c" points="${c.join(" ")}"/><text class="pm-l" x="${(W + X2 - V.c2) / 2}" y="${F.rightDrop + V.c1 / 2 + 4}">Comptoir</text>`;
    let x = 0; const racks = []; for (const [t, w] of F.chain){ if (t === "r") racks.push([x, w]); x += w; }
    const L = [["J", "I"], ["H", "G"], ["F", "E"]];
    racks.forEach(([rx, rw], i) => { for (const [y0, len] of [[V.upY, V.upL], [V.loY, V.loL]]){
      o += `<rect class="pm-r" x="${rx}" y="${y0}" width="${rw}" height="${len}"/>` + face(rx - 7, y0, len, L[i][0]) + face(rx + rw + 1, y0, len, L[i][1]);
      /* affiches au bout de l'étagère (comme une affiche d'allée), une par côté, collées sur l'étagère */
      o += sign(rx + rw / 2 - 12, y0 - 14, L[i][0]) + sign(rx + rw / 2 + 12, y0 - 14, L[i][1]); } });
    const r3 = racks[2], r4x = r3[0] + r3[1] + V.r4x;
    o += `<rect class="pm-r" x="${r4x}" y="${V.loY}" width="${V.r4w}" height="${V.loL}"/>` + face(r4x + V.r4w + 1, V.loY, V.loL, "D") + sign(r4x + V.r4w / 2, V.loY - 14, "D");
    o += `<polygon class="pm-mur" points="${room.join(" ")}"/>`;
    o += face(F.K + 1, yK + 6, H - yK - 12, "K") + sign(F.K + 16, yK + 60, "K");
    const wa = dh + V.winA, wb = wa + V.winW;
    o += `<line x1="${wa}" y1="0" x2="${wb}" y2="0" stroke="#EB6A22" stroke-width="4"/><text class="pm-l" x="${(wa + wb) / 2}" y="16">Fenêtre de service</text>`;
    o += `<text class="pm-l" x="${dh / 2 + 14}" y="${R / 2 + 26}">Porte</text>`;
    /* points : un par raccord, à sa case */
    points.forEach((pt, i) => { const m = String(pt.r || "").trim().toUpperCase().match(/^([A-Z])\s*-?\s*(\d+)/); if (!m || !faces[m[1]]) return;
      const F2 = faces[m[1]], tot = F2.reduce((a, f) => a + f[2], 0), n = Math.max(1, Math.min(V.sec, +m[2])); let d = (n - .5) / V.sec * tot;
      for (const [x, y, h] of F2){ if (d <= h){ o += `<circle class="pm-p${pt.fait ? " fait" : ""}" cx="${x}" cy="${y + d}" r="8"/><text class="pm-pt" x="${x}" y="${y + d + .5}">${i + 1}</text>`; break; } d -= h; } });
    return `<svg viewBox="-30 -20 ${X2 + 60} ${H + 40}" role="img" aria-label="Plan du magasin">${o}</svg>`;
  }
  const lettre = r => (String(r || "").trim().match(/^[A-Za-z]/) || [""])[0].toUpperCase();
  return { svg, lettre };
})();
