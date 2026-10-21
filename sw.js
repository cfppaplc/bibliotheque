/* Bibliothèque des livres animés — mode hors ligne.
   - Les pages du site (bibliothèque, accueil, index de recherche) : réseau d'abord, copie gardée si Internet manque.
   - Les livres et les plans : copie gardée sur l'ordinateur, ouverte tout de suite; on vérifie en arrière-plan
     s'il existe une nouvelle version (sans retélécharger le livre s'il n'a pas changé). */
const CACHE = "biblio-v1";
const BASE = ["./", "index.html", "accueil.html", "recherche.json", "nouveautes.json"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE).catch(() => {})).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const estFichierLourd = u => /\/(livres|plans)\//.test(u.pathname);
const estExterne = u => /(^|\.)(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(u.hostname);

function avecDelai(p, ms) { return Promise.race([p, new Promise((_, r) => setTimeout(() => r(new Error("délai")), ms))]); }

/* Réseau d'abord (4 s), sinon la copie */
async function reseauDabord(req) {
  const c = await caches.open(CACHE);
  try {
    const r = await avecDelai(fetch(req, { cache: "no-cache" }), 4000);
    if (r && r.ok) c.put(req, r.clone());
    return r;
  } catch (e) {
    const m = await c.match(req, { ignoreSearch: true });
    if (m) return m;
    if (req.mode === "navigate") { const i = await c.match("index.html"); if (i) return i; }
    throw e;
  }
}

/* Copie d'abord; mise à jour discrète si le fichier a changé sur le site */
async function copieDabord(req, evt) {
  const c = await caches.open(CACHE);
  const url = req.url.split("?")[0];
  const m = await c.match(url);
  const verifier = async () => {
    try {
      const h = {};
      if (m && m.headers.get("etag")) h["If-None-Match"] = m.headers.get("etag");
      else if (m && m.headers.get("last-modified")) h["If-Modified-Since"] = m.headers.get("last-modified");
      const r = await fetch(url, { headers: h, cache: "no-store" });
      if (r.status === 200) { await c.put(url, r.clone()); return r; }
    } catch (e) {}
    return null;
  };
  if (m) { evt.waitUntil(verifier()); return m; }
  const r = await verifier();
  if (r) return r;
  return fetch(req);
}

/* Bibliothèques externes (lecteur de PDF, polices) : copie gardée */
async function externe(req) {
  const c = await caches.open(CACHE);
  const m = await c.match(req);
  if (m) return m;
  const r = await fetch(req);
  if (r && (r.ok || r.type === "opaque")) c.put(req, r.clone());
  return r;
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const u = new URL(req.url);
  if (u.origin === self.location.origin) {
    if (estFichierLourd(u)) e.respondWith(copieDabord(req, e));
    else e.respondWith(reseauDabord(req));
  } else if (estExterne(u)) {
    e.respondWith(externe(req));
  }
});
