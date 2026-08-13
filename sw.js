const CACHE_NAME = 'yoanns-bakery-v3';
const FILES_TO_CACHE = [
  './index.html',
  './manifest.json',
  './logo.jpg'
];

self.addEventListener('install', (e) => {
  // Force le nouveau service worker à s'activer immédiatement,
  // sans attendre que tous les onglets ouverts soient fermés.
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    Promise.all([
      // Supprime tous les anciens caches (v1, v2, ...) pour ne jamais servir de vieux fichiers.
      caches.keys().then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      ),
      // Prend le contrôle immédiat des pages déjà ouvertes.
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Ne jamais intercepter les requêtes vers Firebase / Firestore / le SDK gstatic :
  // elles doivent toujours passer par le réseau, jamais par le cache du service worker.
  if (url.origin !== self.location.origin) {
    return;
  }

  // Pour la page HTML elle-même : réseau en priorité, cache en secours si hors-ligne.
  // Ça évite de rester bloqué sur une vieille version après une mise à jour.
  if (e.request.mode === 'navigate' || e.request.destination === 'document') {
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          const copie = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copie));
          return response;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Pour le reste (manifest, logo...) : cache en priorité, réseau en secours.
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
