# Site de Yamina Nardin — psychanalyste, Paris 11ᵉ

Site statique : **HTML5 + CSS3 + JavaScript léger**. Aucun framework, aucune
compilation, aucune base de données, aucun cookie, aucun traceur.

## Mise en ligne

Copiez le contenu de ce dossier à la racine de l'hébergement par FTP/SFTP.
Rien à installer, rien à exécuter.

```
index.html          Accueil
approche.html       L'approche
a-propos.html       À propos
le-cadre.html       Le cadre (cabinet, séance, venir)
entreprises.html    Entreprises & institutions
rendez-vous.html    Prendre rendez-vous
mentions-legales.html
confidentialite.html

css/style.css       Feuille de style unique
js/main.js          Menu mobile, apparitions, validation du formulaire
fonts/              Fraunces + Archivo (servies depuis le site)
images/             Photographies — voir images/README.md
favicon.ico  favicon.svg  apple-touch-icon.png
sitemap.xml  robots.txt
```

L'en-tête et le pied de page sont écrits dans chaque fichier : pour les
modifier partout, répercutez le changement dans les huit pages.

## À faire avant la mise en ligne

1. **Déposer les photographies** dans `images/` — noms et cadrages dans
   `images/README.md`. Tant qu'elles manquent, un panneau de matière assortie
   tient la composition sans rien casser.
2. **Relier le formulaire** : renseigner l'attribut `action` du `<form>` dans
   `rendez-vous.html` (script d'envoi PHP, ou service de relais type Formspree).
   Tant qu'il est vide, le formulaire renvoie poliment vers le téléphone.
3. **Lever les mentions `À confirmer`** (encadrés pointillés visibles sur le
   site) :
   - `le-cadre.html` — accès (métro, étage) et confirmation des séances à distance ;
   - `rendez-vous.html` — horaires ;
   - `mentions-legales.html` — statut juridique, SIRET, e-mail, hébergeur ;
   - `confidentialite.html` — durée de conservation, prestataire du formulaire.
4. **Vérifier le domaine** dans `sitemap.xml`, `robots.txt` et les balises
   `canonical` / `og:url` si l'adresse diffère de `https://www.yaminanardin.fr`.
5. **Ajouter `images/og-image.jpg`** (1200 × 630 px) pour l'aperçu de partage.

## Contenu

Tout le contenu factuel provient du site existant et de sources publiques
vérifiées (adresse, téléphone, formations, cadre des séances). Rien n'a été
inventé : ce qui n'a pas pu être vérifié porte la mention `À confirmer`.

## Accessibilité et performance

- WCAG 2.2 AA : contrastes vérifiés, navigation clavier, focus visible,
  `prefers-reduced-motion` respecté, HTML sémantique.
- Aucune requête vers un tiers, à l'exception du plan OpenStreetMap de la page
  « Le cadre », chargé en différé.
- CSS 41 Ko, JS 8 Ko, polices ~180 Ko réellement téléchargées.
