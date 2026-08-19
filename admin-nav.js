/* ============================================================
   Barre de navigation commune aux pages d'administration.
   À inclure dans chaque page : <script src="admin-nav.js" defer></script>
   Aucune iframe : chaque page reste autonome, seule la barre est partagée.

   La barre porte aussi le garde-fou de nom de fichier : chaque page
   affiche sous quel nom elle doit être enregistrée, et prévient si son
   contenu ne correspond pas à ce nom. Une page enregistrée par erreur
   sur un autre fichier se signale ainsi dès son ouverture, au lieu de
   passer inaperçue jusqu'à ce qu'un menu mène à la mauvaise page.
   ============================================================ */
(function () {
  /* titre : libellé dans le menu.
     attendu : titre propre de la page, c'est-à-dire le premier segment de
     la balise <title>, avant le tiret ou la barre verticale. C'est lui qui
     sert de contrôle : il doit correspondre au fichier ouvert. */
  const PAGES = [
    { fichier: "admin.html",                 titre: "Accueil",     attendu: "Administration" },
    { fichier: "commandes-admin.html",       titre: "Commandes",   attendu: "Commandes" },
    { fichier: "abonnements-admin.html",     titre: "Abonnements", attendu: "Abonnements" },
    { fichier: "credits-admin.html",         titre: "Crédit",      attendu: "Crédit clients" },
    { fichier: "clients-admin.html",         titre: "Clients",     attendu: "Clients" },
    { fichier: "boutique-admin.html",        titre: "Boutique",    attendu: "Boutique" },
    { fichier: "produits-identifiants.html", titre: "Produits",    attendu: "Identifiants produits" }
  ];

  const ici = location.pathname.split("/").pop() || "admin.html";

  const style = document.createElement("style");
  style.textContent = `
    .nav-admin{
      background:#12100d;padding:0 14px;display:flex;gap:2px;
      overflow-x:auto;-webkit-overflow-scrolling:touch;
    }
    .nav-admin a{
      color:#c9c0b4;text-decoration:none;font-size:14px;
      padding:12px 15px;white-space:nowrap;border-bottom:2px solid transparent;
      font-family:ui-sans-serif,-apple-system,"Segoe UI",Roboto,sans-serif;
    }
    .nav-admin a:hover{color:#fdf6ec}
    .nav-admin a[aria-current="page"]{
      color:#fdf6ec;font-weight:600;border-bottom-color:#fdf6ec;
    }
    /* Pastille d'attente : le chiffre porte l'information, la couleur ne
       fait que la rendre visible de loin. Un daltonien lit le compte. */
    .nav-admin .pastille{
      display:inline-flex;align-items:center;justify-content:center;
      min-width:18px;height:18px;padding:0 5px;margin-left:7px;
      border-radius:9px;background:#ffc400;color:#12100d;
      font-size:11.5px;font-weight:700;line-height:1;
      position:relative;top:-1px;
    }
    .nom-fichier{
      font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
      font-size:11.5px;font-weight:400;letter-spacing:0;
      opacity:.55;margin-left:9px;white-space:nowrap;
    }
    .alerte-fichier{
      background:#8c2f22;color:#fff;padding:12px 16px;font-size:14px;
      line-height:1.45;
      font-family:ui-sans-serif,-apple-system,"Segoe UI",Roboto,sans-serif;
    }
    .alerte-fichier b{display:block;margin-bottom:3px}
    .alerte-fichier code{
      font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
      background:rgba(0,0,0,.25);padding:1px 5px;border-radius:3px;
    }
    @media print{
      .nav-admin,.alerte-fichier,.nom-fichier,.pastille{display:none !important}
    }
  `;
  document.head.appendChild(style);

  const barre = document.createElement("nav");
  barre.className = "nav-admin";
  barre.setAttribute("aria-label", "Administration");
  const liens = {};
  PAGES.forEach(p => {
    const a = document.createElement("a");
    a.href = p.fichier;
    a.textContent = p.titre;
    if (p.fichier === ici) a.setAttribute("aria-current", "page");
    liens[p.fichier] = a;
    barre.appendChild(a);
  });

  document.body.insertBefore(barre, document.body.firstChild);

  /* ---------- Garde-fou de nom de fichier ---------- */

  // Le titre propre de la page : ce qui précède le premier tiret cadratin
  // ou la première barre verticale.
  function titrePropre() {
    return (document.title || "").split(/[—|]/)[0].trim();
  }

  // Comparaison indulgente sur la casse, les accents et les espaces.
  function pareil(a, b) {
    const net = (s) => (s || "").toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ").trim();
    return net(a) === net(b);
  }

  // Le nom du fichier, affiché à côté du titre de la page.
  const cible = document.querySelector("header h1") || document.querySelector("h1");
  if (cible) {
    const marque = document.createElement("span");
    marque.className = "nom-fichier";
    marque.textContent = ici;
    marque.title = "Nom du fichier — enregistrez la page sous ce nom.";
    cible.appendChild(marque);
  }

  // Une page inconnue du menu n'est pas contrôlée : rien à comparer.
  const fiche = PAGES.find(p => p.fichier === ici);
  if (fiche && !pareil(titrePropre(), fiche.attendu)) {
    const vu = titrePropre() || "sans titre";
    const alerte = document.createElement("div");
    alerte.className = "alerte-fichier";
    alerte.innerHTML =
      "<b>Ce fichier ne contient pas la page attendue.</b>" +
      "Le fichier <code>" + ici + "</code> devrait contenir la page " +
      "<b>" + fiche.attendu + "</b>, mais il contient <b>" + vu + "</b>. " +
      "C'est le signe d'un enregistrement sous le mauvais nom : ne réenregistrez " +
      "pas cette page ici avant d'avoir vérifié, l'historique GitHub du fichier " +
      "permet de récupérer la bonne version.";
    document.body.insertBefore(alerte, barre.nextSibling);
  }

  /* ---------- Pastilles d'attente ----------
     Ce qui est arrivé et attend une décision : commandes reçues non
     confirmées, abonnements à valider. Visible depuis toutes les pages,
     et non depuis le seul accueil : le travail se fait surtout dans
     Commandes, c'est là qu'il faut être prévenu.

     Les commandes issues d'un abonnement validé naissent confirmées et
     ne comptent donc pas : la pastille ne signale que ce qui demande
     réellement une décision.

     Le menu ne doit jamais casser une page : tout échec est silencieux,
     et l'absence de pastille est un état normal. */
  const ATTENTES = [
    { fichier: "commandes-admin.html",   collection: "commandes",
      champ: "statut", valeur: "nouvelle",
      un: "commande à confirmer", plusieurs: "commandes à confirmer" },
    { fichier: "abonnements-admin.html", collection: "abonnements",
      champ: "statut", valeur: "nouveau",
      un: "abonnement à valider", plusieurs: "abonnements à valider" }
  ];

  function poserPastille(fichier, nombre, mot) {
    const a = liens[fichier];
    if (!a) return;
    let el = a.querySelector(".pastille");

    if (!nombre) {
      if (el) el.remove();
      a.removeAttribute("aria-label");
      a.removeAttribute("title");
      return;
    }

    if (!el) {
      el = document.createElement("span");
      el.className = "pastille";
      el.setAttribute("aria-hidden", "true");   // le libellé du lien le dit déjà
      a.appendChild(el);
    }
    el.textContent = nombre > 99 ? "99+" : String(nombre);

    const dit = (a.firstChild ? a.firstChild.textContent : "") +
                " — " + nombre + " " + mot;
    a.setAttribute("aria-label", dit);
    a.title = dit;
  }

  /* Ce script s'exécute avant le module de la page : au premier regard,
     Firebase n'est pas encore initialisé. On attend son apparition au
     lieu d'abandonner, sans quoi aucune pastille ne s'afficherait au
     chargement. */
  async function attendreApp(fb, msMax) {
    const fin = Date.now() + (msMax || 12000);
    while (Date.now() < fin) {
      if (fb.getApps().length) return fb.getApp();
      await new Promise(r => setTimeout(r, 150));
    }
    return null;
  }

  async function compterSur(q, fs) {
    // L'agrégation évite de rapatrier les documents ; si elle est
    // refusée ou indisponible, on compte à l'ancienne.
    try {
      return (await fs.getCountFromServer(q)).data().count;
    } catch {
      return (await fs.getDocs(q)).size;
    }
  }

  let occupe = false;
  async function compter() {
    if (occupe) return;
    occupe = true;
    try {
      const [fb, fs] = await Promise.all([
        import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js")
      ]);

      const app = await attendreApp(fb);
      if (!app) return;               // page sans Firebase : rien à compter
      const db = fs.getFirestore(app);

      for (const t of ATTENTES) {
        try {
          const q = fs.query(fs.collection(db, t.collection),
                             fs.where(t.champ, "==", t.valeur));
          const n = await compterSur(q, fs);
          poserPastille(t.fichier, n, n > 1 ? t.plusieurs : t.un);
        } catch (e) {
          // Règles Firestore ou connexion : on laisse le menu tel quel
          // plutôt que d'afficher un zéro qui serait un mensonge.
          console.warn("Pastille " + t.collection + " :", e && e.code);
        }
      }
    } catch {
      // hors ligne : le menu reste utilisable
    } finally {
      occupe = false;
    }
  }

  /* L'administration s'authentifie après le chargement : on attend
     l'état de connexion, sans quoi les lectures partiraient trop tôt et
     seraient refusées. */
  (async function () {
    try {
      const [auth, fb] = await Promise.all([
        import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"),
        import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js")
      ]);
      const app = await attendreApp(fb);
      if (!app) return;
      auth.onAuthStateChanged(auth.getAuth(app), (u) => { if (u) compter(); });
    } catch {
      compter();   // page sans authentification : on tente quand même
    }
  })();

  // Un abonnement peut arriver pendant que la page est ouverte : on
  // rafraîchit au retour sur l'onglet plutôt qu'en boucle.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") compter();
  });

  // Installation possible sur mobile, et consultation hors ligne au fournil.
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw-admin.js").catch(() => {});
  }
})();
