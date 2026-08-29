/* Service worker de l'administration.

   Deux régimes, volontairement différents :

   1. Les fichiers du site (pages, scripts, images) : réseau d'abord.
      La version en ligne l'emporte toujours, le cache ne sert qu'en cas de
      coupure. C'est ce qui permet de modifier une page sur GitHub et de la
      revoir aussitôt, sans vider quoi que ce soit.

   2. Les modules Firebase servis par gstatic.com : cache d'abord.
      Leur adresse porte le numéro de version (10.12.0), leur contenu ne
      change donc jamais. Les redemander au réseau à chaque ouverture de
      page coûtait plusieurs secondes, sur les six écrans d'administration,
      à chaque bascule d'onglet. Une fois en cache, ils sont instantanés —
      y compris au fournil sans réseau.

   Attention : ne jamais faire passer les pages HTML en cache d'abord.
   Le régime 1 est un choix délibéré. */
const VERSION = 'yfb-admin-v15';

const ESSENTIELS = [
  './', './index.html',
  './admin.html', './commandes-admin.html', './boutique-admin.html',
  './clients-admin.html', './credits-admin.html', './abonnements-admin.html',
  './produits-identifiants.html', './etiquettes.html', './affiche.html',
  './admin-nav.js', './promo.js', './qr.js', './manifest.json', './logo.png'
];

/* Ces trois modules sont chargés par toutes les pages d'administration, et
   une seconde fois par admin-nav.js pour les pastilles. Ils sont précachés
   à l'installation pour que la toute première bascule d'onglet en profite
   déjà, sans attendre une visite de chauffe.

   Si le numéro de version du SDK change dans les pages, il doit changer ici
   aussi : sans quoi la nouvelle version sera simplement téléchargée au
   réseau comme avant, sans casse mais sans gain. */
const SDK = 'https://www.gstatic.com/firebasejs/10.12.0/';
const MODULES = [
  SDK + 'firebase-app.js',
  SDK + 'firebase-auth.js',
  SDK + 'firebase-firestore.js',
  SDK + 'firebase-functions.js'
];

function estModule(url) {
  return url.startsWith(SDK);
}

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(VERSION).then(c => Promise.all([
      c.addAll(ESSENTIELS).catch(() => {}),
      // Requêtes cross-origin : en mode 'cors' pour obtenir une réponse
      // lisible et réutilisable, et non une réponse opaque.
      Promise.all(MODULES.map(u =>
        fetch(u, { mode: 'cors' })
          .then(r => (r.ok ? c.put(u, r) : null))
          .catch(() => {})
      ))
    ])).catch(() => {})
  );
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

  const url = req.url;

  /* ---- Régime 2 : modules Firebase, cache d'abord ---- */
  if (estModule(url)) {
    e.respondWith(
      caches.match(req).then(cache => {
        if (cache) return cache;
        // Absent du cache (première visite, ou précache échoué) : on va le
        // chercher et on le garde pour les fois suivantes.
        return fetch(req).then(rep => {
          if (rep.ok) {
            const copie = rep.clone();
            caches.open(VERSION).then(c => c.put(req, copie)).catch(() => {});
          }
          return rep;
        });
      })
    );
    return;
  }

  /* ---- Régime 1 : le reste du site, réseau d'abord ---- */
  if (new URL(url).origin !== self.location.origin) return;

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
