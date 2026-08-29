/* Service worker de l'administration — réseau d'abord.
   La version en ligne l'emporte toujours ; le cache ne sert qu'en cas de coupure. */
const VERSION = 'yfb-admin-v14';
const ESSENTIELS = [
  './', './index.html',
  './admin.html', './commandes-admin.html', './boutique-admin.html',
  './clients-admin.html', './credits-admin.html', './abonnements-admin.html',
  './produits-identifiants.html', './etiquettes.html', './affiche.html',
  './admin-nav.js', './promo.js', './qr.js', './manifest.json', './logo.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ESSENTIELS)).catch(() => {}));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(n => Promise.all(n.filter(x => x !== VERSION).map(x => caches.delete(x))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(
    fetch(req)
      .then(rep => {
        const copie = rep.clone();
        caches.open(VERSION).then(c => c.put(req, copie)).catch(() => {});
        return rep;
      })
      .catch(() => caches.match(req).then(r => r || caches.match('./admin.html')))
  );
});
