# Photographies du site

## Pourquoi ce dossier est vide

Les photographies actuellement publiées sur `www.yaminanardin.fr` **n'ont pas pu
être récupérées** : la politique réseau de l'environnement dans lequel ce site a
été construit bloque l'accès au domaine (réponse `403` du proxy sortant sur
`www.yaminanardin.fr` comme sur `www.psychanalyse-active-integrative.fr`).

Aucune photographie n'a donc été inventée : ni portrait, ni cabinet, ni image de
banque destinée à en tenir lieu. Les emplacements sont **préparés, cadrés et
documentés** ; il suffit de déposer les fichiers ci-dessous pour que le site
s'affiche complet.

Tant qu'un fichier est absent, le site affiche à sa place un panneau de matière
assorti à la palette, correctement proportionné : rien ne casse, rien n'apparaît
« cassé ».

## Fichiers attendus

Respectez **exactement** ces noms de fichiers.

| Fichier | Sujet | Où il apparaît |
|---|---|---|
| `portrait.jpg` | Portrait de Yamina Nardin | Accueil (ouverture, pleine hauteur) et page « À propos » |
| `cabinet.jpg` | Le cabinet, 21 rue Titon | Accueil (section « Le cabinet ») et page « Le cadre » (pleine largeur) |
| `detail.jpg` | Détail : lumière, matière, architecture, livres, fenêtre | Accueil, section « Qui suis-je » |
| `og-image.jpg` | Image de partage sur les réseaux sociaux | Aperçu Facebook / LinkedIn / X |

## Cadrages et définitions

| Fichier | Ratio de cadrage | Largeur conseillée | Poids visé |
|---|---|---|---|
| `portrait.jpg` | 4:5 vertical (recadré en pleine hauteur sur grand écran) | 1000–1400 px | < 250 Ko |
| `cabinet.jpg` | 4:3 et 16:9 selon la page — **prévoir de la marge en haut et en bas** | 1600–2000 px | < 300 Ko |
| `detail.jpg` | 4:5 vertical | 800–1200 px | < 200 Ko |
| `og-image.jpg` | 1200 × 630 px exactement | 1200 px | < 200 Ko |

`cabinet.jpg` est utilisée à deux ratios différents (4:3 sur l'accueil, 16:9 sur
« Le cadre ») : choisissez une prise de vue dont le sujet reste juste dans les
deux cadrages.

## Réglage du cadrage

Le recadrage se fait en CSS, sans retoucher les fichiers. Par défaut, le sujet
est calé au tiers haut :

```css
.photo img { object-position: center 38%; }
```

Pour ajuster une image précise, ajoutez une règle dans `css/style.css` :

```css
.ouverture__photo img { object-position: center 30%; } /* portrait plus haut */
.cabinet__photo img   { object-position: center 55%; } /* cabinet plus bas   */
```

## Recommandations

- JPEG qualité ~80 : au-delà, le poids augmente sans gain visible.
- **Ne jamais agrandir** une photographie au-delà de sa définition d'origine :
  mieux vaut un cadrage plus serré qu'une image molle.
- Lumière naturelle, matières, architecture, détails. Éviter les
  photographies de banque d'images reconnaissables.
- Le texte alternatif de chaque image est déjà rédigé dans le HTML. Si le sujet
  d'une photographie change, pensez à ajuster l'attribut `alt` correspondant.

## Format moderne (facultatif)

Pour alléger encore le site, vous pouvez servir du WebP en remplaçant la balise
`<img>` par un `<picture>` :

```html
<picture>
  <source srcset="images/portrait.webp" type="image/webp">
  <img src="images/portrait.jpg" alt="…" width="900" height="1200">
</picture>
```
