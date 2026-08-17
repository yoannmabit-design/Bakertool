/* ============================================================
   Barre de navigation commune aux pages d'administration.
   À inclure dans chaque page : <script src="admin-nav.js" defer></script>
   Aucune iframe : chaque page reste autonome, seule la barre est partagée.
   ============================================================ */
(function () {
  const PAGES = [
    { fichier: "admin.html",                 titre: "Accueil"     },
    { fichier: "commandes-admin.html",       titre: "Commandes"   },
    { fichier: "boutique-admin.html",        titre: "Boutique"    },
    { fichier: "clients-admin.html",         titre: "Clients"     },
    { fichier: "credits-admin.html",         titre: "Crédit"      },
    { fichier: "abonnements-admin.html",     titre: "Abonnements" },
    { fichier: "produits-identifiants.html", titre: "Produits"    }
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
    @media print{ .nav-admin{display:none !important} }
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

  // Installation possible sur mobile, et consultation hors ligne au fournil.
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw-admin.js").catch(() => {});
  }
})();
