/* © 2026 Jérémy Raymond. Tous droits réservés. Métier+ — code-barres Code 128 B (25 nov.) : carte étudiante (« MP-123-K7Q9X2 »), magasin.
   Lu par tous les lecteurs de codes-barres (le lecteur tape le texte puis Entrée). */
window.Code128 = (function(){
  const T = "212222 222122 222221 121223 121322 131222 122213 122312 132212 221213 221312 231212 112232 122132 122231 113222 123122 123221 223211 221132 221231 213212 223112 312131 311222 321122 321221 312212 322112 322211 212123 212321 232121 111323 131123 131321 112313 132113 132311 211313 231113 231311 112133 112331 132131 113123 113321 133121 313121 211331 231131 213113 213311 213131 311123 311321 331121 312113 312311 332111 314111 221411 431111 111224 111422 121124 121421 141122 141221 112214 112412 122114 122411 142112 142211 241211 221114 413111 241112 134111 111242 121142 121241 114212 124112 124211 411212 421112 421211 212141 214121 412121 111143 111341 131141 114113 114311 411113 411311 113141 114131 311141 411131 211412 211214 211232 2331112".split(" ");
  /* svg(texte, hauteur, avecTexte) : chaîne SVG (fond blanc, zone calme de 10 modules de chaque côté) */
  function svg(txt, h, avecTexte){
    h = h || 50; const v = [104, ...[...String(txt)].map(c => Math.max(0, Math.min(94, c.charCodeAt(0) - 32)))]; let s = 104; v.slice(1).forEach((x, i) => s += x * (i + 1)); v.push(s % 103, 106);
    let x = 10, r = ""; v.forEach(k => [...T[k]].forEach((w, i) => { if (i % 2 === 0) r += '<rect x="' + x + '" y="0" width="' + w + '" height="' + h + '"/>'; x += +w; }));
    const H = h + (avecTexte ? 14 : 0), W = x + 10, e = String(txt).replace(/[&<>]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;" }[c]));
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none"><rect width="' + W + '" height="' + H + '" fill="#fff"/><g fill="#000">' + r + '</g>'
      + (avecTexte ? '<text x="' + W / 2 + '" y="' + (h + 12) + '" font-size="10" text-anchor="middle" font-family="monospace" fill="#000">' + e + '</text>' : '') + '</svg>';
  }
  const url = (txt, h, avecTexte) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg(txt, h, avecTexte));
  return { svg, url };
})();
