# Photos du site

Déposez les fichiers ici en respectant **exactement** ces noms.
Tant qu'un fichier est absent, le site affiche automatiquement un panneau
sobre assorti à la palette, clairement identifié comme un emplacement à
remplir — rien ne casse et rien n'apparaît « cassé ».

| Fichier | Contenu | Où il apparaît |
|---|---|---|
| `portrait.jpg` | Portrait de Yamina Nardin | Accueil (hero) et page « À propos » |
| `olivier.jpg` | Photographie d'ambiance (olivier, matière, lumière) | Accueil, section « Qui suis-je » |
| `cabinet.jpg` | Le cabinet, 21 rue Titon | Page « Le cabinet » |
| `og-image.jpg` | Image de partage sur les réseaux sociaux | Aperçu Facebook / LinkedIn / X |

## Formats attendus

| Fichier | Cadrage | Largeur conseillée |
|---|---|---|
| `portrait.jpg` | 4:5 (vertical) | 800–1200 px |
| `olivier.jpg` | 4:3 (horizontal) | 900–1400 px |
| `cabinet.jpg` | 4:3 (horizontal) | 900–1400 px |
| `og-image.jpg` | 1200 × 630 px exactement | 1200 px |

## Conseils

- JPEG qualité ~80 : au-delà, le poids augmente sans gain visible.
- Gardez chaque fichier **sous 250 Ko** pour préserver la vitesse du site.
- Le texte alternatif de chaque image est déjà rédigé dans le HTML ;
  si le sujet d'une photo change, pensez à l'ajuster dans `src/pages/`.
- Style recommandé : lumière naturelle, matières, architecture, détails.
  Éviter les photographies de banque d'images évidentes.

## Ajouter une photo supplémentaire

Les emplacements sont définis dans `src/pages/*.html`. Après toute
modification, régénérez les pages :

```sh
python3 build.py
```
