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
      .nav-admin,.alerte-fichier,.nom-fichier{display:none !important}
    }
  `;
  document.head.appendChild(style);

  const barre = document.createElement("nav");
  barre.className = "nav-admin";
  barre.setAttribute("aria-label", "Administration");
  PAGES.forEach(p => {
    const a = document.createElement("a");
    a.href = p.fichier;
    a.textContent = p.titre;
    if (p.fichier === ici) a.setAttribute("aria-current", "page");
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

  // Installation possible sur mobile, et consultation hors ligne au fournil.
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw-admin.js").catch(() => {});
  }
})();
