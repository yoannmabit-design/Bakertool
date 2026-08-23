# Mode d'emploi — Yoann's French Bakery

Ce document explique comment utiliser les trois outils au quotidien. Il ne couvre pas le fonctionnement interne (voir *documentation-technique.md* pour ça) — seulement ce qu'il faut faire, cliquer, et pourquoi.

---

## Les trois outils, en un coup d'œil

- **La boutique** (`yoannthebaker`) : ce que les clients voient. Vous n'y touchez jamais directement, sauf pour vérifier que tout s'affiche bien.
- **L'admin** (`Bakertool`) : votre outil de gestion quotidienne — commandes, clients, crédit, catalogue.
- **L'ERP** (`Bakerytools`) : recettes, ingrédients, coûts, production.

---

## Se connecter

Sur toutes les pages admin et sur l'ERP : bouton **"Connexion admin"** ou **"Se connecter avec Google"**, en haut de la page. Utilisez le même compte Google partout — c'est lui qui vous identifie comme administrateur. Une fois connecté sur un appareil, vous le restez (pas besoin de vous reconnecter à chaque ouverture, sauf déconnexion volontaire ou changement de navigateur).

Si un message dit que votre compte n'a pas accès : ce n'est pas un bug, c'est la sécurité qui fonctionne — vérifiez que vous utilisez le bon compte Google.

---

## L'ERP au quotidien

### Onglet Ingrédients

- **Consultation** (par défaut) : liste des ingrédients, prix, stock, seuil bas — tout est déjà modifiable sans passer en édition (le prix ne l'est pas, mais le stock, le seuil et l'alerte le sont).
- **Recherche** : tapez un nom en haut pour filtrer la liste — utile passé une vingtaine d'ingrédients.
- **Seuil bas** : indiquez une quantité (dans l'unité de l'ingrédient, kg ou pièces). Dès qu'un seuil est renseigné, la case "Alerte" devient automatique : elle se coche toute seule quand le stock tombe en dessous, et n'est plus cliquable. Laissez le champ vide pour revenir à un signalement manuel.
- **Mode édition** : bouton en haut ("🔒 Consultation" devient "✏️ Édition"). Permet d'ajouter, supprimer, modifier en profondeur. N'oubliez pas de cliquer **"☁️ Enregistrer sur Firebase"** — rien n'est sauvegardé automatiquement en édition.

### Onglet Coûts

- Une fiche par produit, groupées par catégorie (Pains, Viennoiseries, Autres, Recette de Base).
- **Recherche** : par nom **ou par code produit** (BUT-CRO, PAI-BAG…) — tapez le code si c'est ce que vous retenez.
- **Une fiche "Recette de Base"** (catégorie au choix, case "Vendable" décochée) sert à factoriser une pâte partagée entre plusieurs produits (ex. une même pâte pour une baguette et une version plus petite vendue séparément). Dans les fiches qui l'utilisent, ajoutez une ligne d'ingrédient de type **"Composite"** et choisissez la base dans la liste — tapez pour filtrer, pas besoin de faire défiler.
- **Choix d'un ingrédient dans une ligne** : tapez dans le champ, une liste filtrée apparaît en dessous (fonctionne comme un moteur de recherche, pas une liste déroulante classique).
- Bouton 📋 sur une fiche : la duplique — pratique pour créer une variante proche d'un produit existant.
- N'oubliez pas **"☁️ Enregistrer les fiches"** après une modification.

### Onglet Commandes

C'est ici que se passe le travail quotidien de suivi de production.

- **Recherche** en haut : filtre les cartes affichées par nom ou code — ne touche jamais aux totaux financiers, qui restent toujours calculés sur la journée entière.
- Chaque carte : quantité "Boutique" (commandes en ligne), compteur "Ajouts" (+/-) pour ce que vous ajoutez à la main.
- **Pour un produit "limité"** (croissants, viennoiseries — pas le pain) : une ligne de stock apparaît, avec deux boutons :
  - **➕ Fabrication** : quand une fournée sort du four, indiquez la quantité produite. Le stock visible par les clients augmente aussitôt.
  - **🛒 Sortie marché** : la veille du marché, indiquez ce que vous emportez vendre sur place. Le stock diminue d'autant.
  - Ces deux actions nécessitent d'être connecté en admin (voir plus haut).
- **"✅ Confirmer la production du jour"** : à faire une fois par jour. Déduit les ingrédients bruts nécessaires du stock de matières premières, enregistre l'historique (CA, marge). **Ne touche pas** au stock des produits finis — c'est le rôle des deux boutons ci-dessus, à cliquer séparément, au moment où la fournée est réellement sortie.

### Onglet Recettes (façonnage et pesées)

- La grille "Commandes boutique" en haut montre, pour chaque pain, ce qu'il y a à façonner.
- **"⚖️ Pesées faites"** : figez la pesée une fois le pain pesé. Après ce clic, la grille bascule et n'affiche plus que le **tardif** (ce qui est arrivé après la pesée, en plus) — case rouge s'il y a du tardif à façonner, grise sinon.
- La case "Ajouts" reste utilisable pour ajouter manuellement une quantité, y compris après la pesée (verrouillée seulement quand pertinent).

---

## L'admin au quotidien

### Commandes

- Liste filtrable par statut (À traiter / Impayées / Toutes) et par recherche libre.
- **Modifier une commande** : ouvre un panneau avec le panier, permet d'ajouter/retirer des articles, changer la date — le prix se recalcule automatiquement (même règle que la boutique).
- **➕ Nouvelle commande** : pour un client au téléphone ou en personne.
  1. Tapez son téléphone — si un compte existe, son nom/adresse se pré-remplissent, sa remise de groupe s'applique, et un champ code promo apparaît.
  2. Sans compte trouvé : tarif plein, pas de code promo — comme une commande anonyme sur le site.
  3. Ajoutez les articles, choisissez la livraison et la date.
  4. "Créer la commande" l'enregistre directement en statut **Confirmée**.
  - Le crédit client n'est pas géré depuis cet écran — passez par la page Crédit si besoin.
- **Étiquettes** : impression groupée depuis la sélection multiple de commandes.

### Clients

- Fiche par client, indexée par téléphone.
- **"Reconstituer les téléphones manquants sur les comptes"** (bouton en haut) : à utiliser une fois pour rattraper les comptes clients qui n'ont jamais eu de téléphone enregistré (voir documentation technique, §9). Affiche un aperçu avant d'écrire quoi que ce soit — vérifiez la liste, puis confirmez.
- Le **groupe tarifaire** ne se règle plus depuis cette page (voir Crédit ci-dessous).

### Crédit

- Liste des comptes clients.
- **Groupe tarifaire** : menu déroulant (Reseller / Bulk order / Aucun) — directement modifiable ici, avec la remise associée. Cliquez "Appliquer" pour enregistrer les deux ensemble.
- **"Appliquer à tout le groupe"** : réapplique le même taux de remise à tous les comptes déjà dans ce groupe.

### Boutique

- Catalogue : prix, publication, **mode de stock**.
- **`mode_stock`** : "Illimité" pour le pain (pas de stock, capacité de production uniquement) ; "Limité" pour tout ce qui a un stock réel (croissants, viennoiseries). Le champ "Stock" n'apparaît que pour les produits en mode limité.
- Codes promo : création, portée par rayon, dates de validité, limite d'usage par client (automatique, pas besoin d'y penser).

### Abonnements

- Validation des nouvelles souscriptions, suivi des échéances et des reports.

---

## Foire aux questions

**J'ai cliqué "Fabrication" mais je ne vois pas les boutons.**
Ils n'apparaissent que pour un produit en `mode_stock: "limite"` (réglé dans Boutique). Le pain n'en a jamais.

**Le groupe tarifaire d'un client ne s'applique pas à sa commande.**
Vérifiez qu'il a bien un compte (pas juste une fiche client) — le tarif de groupe vit sur le compte, pas sur la fiche client. Si son téléphone n'était pas encore rattaché, utilisez le bouton de reconstitution dans Clients.

**Un produit affiche un stock qui ne correspond pas à ce que j'ai en réalité.**
Le stock est partagé entre trois écrans (Boutique, Commandes admin, ERP) — un seul chiffre, jamais désynchronisé entre eux. Si le chiffre est faux, corrigez-le directement dans Boutique-admin (saisie du chiffre exact), plutôt que de chercher à comprendre quel écran "a raison".

**Je ne trouve plus la fiche "Dejeunette" (ou un produit similaire) dans l'ERP.**
Si vous avez décoché "Vendable" ou supprimé la fiche, c'est normal qu'elle disparaisse des onglets Commandes et Recettes — elle reste toujours modifiable depuis l'onglet Coûts.

**Une commande a un statut bizarre après une modification.**
Le statut ne change jamais automatiquement lors d'une modification de panier ou de date — seul un geste explicite (bouton de statut) le change.

**Le menu de l'admin affiche une bannière rouge "ce fichier ne contient pas la page attendue".**
C'est le garde-fou intégré (`admin-nav.js`) qui vous prévient qu'une page a été enregistrée par erreur sous le mauvais nom. Ne réenregistrez rien tant que ce n'est pas éclairci — l'historique GitHub du fichier permet de retrouver la bonne version.
