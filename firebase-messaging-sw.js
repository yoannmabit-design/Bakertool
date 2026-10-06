/* ============================================================
   Service worker des notifications — administration

   À déposer à la racine du dépôt de l'administration, à côté de
   sw-admin.js. Le nom est imposé par Firebase : c'est ce fichier précis
   que le SDK va chercher, et aucun autre.

   POURQUOI UN DEUXIÈME SERVICE WORKER
   sw-admin.js s'occupe du cache et du hors-ligne. Celui-ci ne s'occupe que
   des notifications reçues pendant que l'administration est fermée. Firebase
   l'enregistre sur une portée qui lui est propre, les deux ne se marchent
   pas dessus.

   CE QU'IL FAIT
   Quand une notification arrive et qu'aucun onglet de l'administration n'est
   ouvert, c'est lui qui l'affiche. Et quand on tape dessus, c'est lui qui
   ouvre la bonne page — la commande ou le message dont il s'agit, pas
   l'accueil.

   Il utilise le SDK « compat » parce qu'un service worker ne sait pas
   importer de modules : importScripts est la seule voie.
   ============================================================ */

importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDuq8KS8M_Z8U7BlSp6MvE-6Y9OYYaDujE",
  authDomain: "bakertools-ae124.firebaseapp.com",
  projectId: "bakertools-ae124",
  storageBucket: "bakertools-ae124.firebasestorage.app",
  messagingSenderId: "978584667113",
  appId: "1:978584667113:web:868cc89788aff27717c178"
});

const messaging = firebase.messaging();

/* Notification reçue application fermée.

   Le message envoyé par la fonction Cloud ne contient que des données, pas
   de bloc « notification » : sans quoi le téléphone en afficherait une tout
   seul, et nous en afficherions une seconde ici. Une commande, deux
   sonneries. */
messaging.onBackgroundMessage((payload) => {
  const d = payload.data || {};
  self.registration.showNotification(d.titre || "Yoann's French Bakery", {
    body: d.corps || "",
    icon: "logo.png",
    badge: "logo.png",
    // Même étiquette = la nouvelle remplace l'ancienne. Trois commandes
    // pendant la nuit font trois lignes dans le centre de notifications,
    // mais deux rappels de la même commande n'en font qu'un.
    tag: d.tag || undefined,
    data: { url: d.url || "commandes-admin.html" },
    // Le téléphone se tait la nuit si le système le demande ; on ne force
    // rien. Une commande n'est pas une urgence.
    requireInteraction: false
  });
});

/* Au clic : ouvrir la page concernée, ou revenir sur l'onglet déjà ouvert
   plutôt que d'en empiler un deuxième. */
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const cible = (e.notification.data && e.notification.data.url) || "commandes-admin.html";

  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((ouverts) => {
      for (const c of ouverts) {
        if (c.url.includes(cible) && "focus" in c) return c.focus();
      }
      for (const c of ouverts) {
        // Administration déjà ouverte ailleurs : on la réutilise.
        if ("navigate" in c && "focus" in c) return c.navigate(cible).then(x => x && x.focus());
      }
      return clients.openWindow(cible);
    })
  );
});
