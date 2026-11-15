/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — logo.js (sorti d'index.html le 15 nov.) */
/* Logo du Pavillon : le « A » rouge prend la couleur choisie dans « Mes préférences » (partout : accueil, fenêtres, accueil de classe).
   Sans couleur choisie (ou rouge d'origine) : logo inchangé. La couleur est gardée dans localStorage.logoCouleur pour que l'accueil de classe la voie aussi. */
(function(){
  const CLE = "logoCouleur", cache = {}; let couleur = "";
  try { couleur = localStorage.getItem(CLE) || ""; } catch(e){}
  const hex = c => { const m = /^#?([0-9a-f]{6})$/i.exec(c || ""); return m ? [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16)] : null; };
  const teinte = (src, rgb) => new Promise(res => { const k = src + "|" + rgb.join(); if (cache[k]) return res(cache[k]);
    const im = new Image(); im.onload = () => { try { const c = document.createElement("canvas"); c.width = im.naturalWidth; c.height = im.naturalHeight;
      const g = c.getContext("2d"); g.drawImage(im, 0, 0); const d = g.getImageData(0, 0, c.width, c.height), p = d.data;
      for (let i = 0; i < p.length; i += 4){ const t = Math.max(0, Math.min(1, (p[i] - Math.max(p[i + 1], p[i + 2]) - 25) / 90));   /* « rougeur » du pixel : 0 = lettre, 1 = le A */
        if (t > 0){ p[i] += (rgb[0] - p[i]) * t; p[i + 1] += (rgb[1] - p[i + 1]) * t; p[i + 2] += (rgb[2] - p[i + 2]) * t; } }
      g.putImageData(d, 0, 0); cache[k] = c.toDataURL("image/png"); res(cache[k]); } catch(e){ res(null); } };
    im.onerror = () => res(null); im.src = src; });
  /* Logo Métier+ (8 nov.) : le petit carré « + » prend aussi la couleur choisie (on remplace l'orange dans le SVG) */
  const svgCache = {};
  const teinteSvg = (src, c) => { const k = src + "|" + c; if (svgCache[k]) return Promise.resolve(svgCache[k]);
    return fetch(src).then(r => r.text()).then(t => svgCache[k] = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(t.replace(/#F2762E/gi, c))).catch(() => null); };
  const DEFAUT = c => !c || /^#(eb6a22|f2762e|e50914)$/i.test(c);
  const poser = async img => { const s0 = img.dataset.logo0 || img.getAttribute("src") || ""; if (!/pavillon-avenir|metier-plus/.test(s0)) return; img.dataset.logo0 = s0;
    const rgb = hex(couleur), voulu = couleur;
    if (!rgb || DEFAUT(voulu)){ if (img.getAttribute("src") !== s0) img.src = s0; return; }
    const u = /metier-plus/.test(s0) ? await teinteSvg(s0, voulu) : await teinte(s0, rgb); if (u && voulu === couleur) img.src = u; };
  const tous = () => document.querySelectorAll('img[src*="pavillon-avenir"], img[src*="metier-plus"], img[data-logo0]');
  window.teinterLogo = c => { couleur = c || ""; try { couleur ? localStorage.setItem(CLE, couleur) : localStorage.removeItem(CLE); } catch(e){} tous().forEach(poser); };
  new MutationObserver(ms => { if (!couleur) return; ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType !== 1) return;   /* fenêtres créées plus tard (connexion, bienvenue…) */
    if (n.matches && n.matches('img[src*="pavillon-avenir"], img[src*="metier-plus"]')) poser(n); if (n.querySelectorAll) n.querySelectorAll('img[src*="pavillon-avenir"], img[src*="metier-plus"]').forEach(poser); })); }).observe(document.documentElement, { childList:true, subtree:true });
  addEventListener("storage", e => { if (e.key === CLE){ couleur = e.newValue || ""; tous().forEach(poser); } });   /* l'accueil de classe (cadre) suit la bibliothèque */
  if (couleur){ if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => tous().forEach(poser)); else tous().forEach(poser); }
})();
