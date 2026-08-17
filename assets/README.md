# Photographies

Trois fichiers, aux noms exacts ci-dessous. Tant qu’un fichier est absent,
sa plaque reste un aplat ivoire : la mise en page ne bouge pas et rien ne
se casse.

| Fichier | Sujet | Emplacement | Cadrage |
|---|---|---|---|
| `olivier.jpg` | L’olivier dans la roche | Couverture, à droite, à fond perdu | Vertical (le cadrage est plein écran) |
| `portrait.jpg` | Portrait de Yamina Nardin | I — À propos | 4:5, vertical |
| `cabinet.jpg` | Le cabinet | IV — Cabinet, à fond perdu à gauche | 5:4, horizontal |

## Le cliché du cabinet

La photographie d’origine est un fisheye : un cercle cerné de noir. La page
entre dans le cercle pour que les angles noirs ne paraissent jamais —
`--room-zoom`, réglé à `1.32` (le minimum géométrique est 1.28).

Si vous remplacez un jour cette photographie par une image rectangulaire
ordinaire, ramenez la valeur à `1` dans la règle `.room-plate img` :

```css
.room-plate img{ transform:scale(var(--room-zoom, 1)); }
```

## Direction photographique

Ce qui convient : le cabinet, la lumière naturelle, l’architecture, les
matières, un détail, Paris, un portrait authentique. Le noir et blanc est
le bienvenu. Une seule très bonne photographie vaut mieux que trois
moyennes — une plaque laissée vide vaut mieux qu’une image de banque
d’images.

Ce qui est à proscrire : divan, cerveau, poignée de main, personne
pensive au bord d’une fenêtre, sourire devant un ordinateur. Ces images
signent immédiatement un site générique.

## Technique

JPEG qualité 80, 1400–1800 px sur le grand côté. Les images sont légèrement
désaturées à l’affichage (`grayscale(.12)`) pour s’accorder entre elles :
inutile de les retoucher en amont.
