# DESORA — Direction artistique de l'imagerie

« Warm shadow, single light. » Direction photo du site DESORA. Toute image passe par le composant `src/components/Figure.astro` (traitement défini dans `src/styles/global.css`, bloc « Photography treatment »).

## Le principe

Chaque image est éclairée, ou étalonnée comme si elle l'était, par **une seule source chaude** (lumière d'après-midi marocaine) : ombre obsidienne profonde, hautes lumières sable/pearl, jamais d'éclairage plat et uniforme. Un **grain film** commun est posé sur toutes les images : c'est lui qui fait lire des sources disparates (stock, atelier, produit) comme un seul jeu étalonné.

## Contrat couleur (non négociable)

Les images restent dans le registre **obsidian / sable**. Le **crimson reste le seul rouge saturé de la page**, porté par la typo. Une photo n'introduit jamais un rouge concurrent. Si un visuel contient du rouge vif, il est recadré ou re-étalonné, ou écarté.

## Deux flux

1. **Éditorial / humain** (`tone="editorial"`, ratio `4/5`) : fondateur, mains au travail, plan par-dessus l'épaule, ambiance atelier. Candid, pas de portrait corporate, pas de « équipe qui tope ».
2. **Matière / artisanat** (`tone="atmos"`, ratio `16/9`) : monde matériel marocain abstrait, zellige, tadelakt, laiton, cuir, ombre architecturale rasante. Jamais de cliché touristique de riad.

Étude de cas : produit/marque dans son contexte, ratio `3/2`.

## Signature

- **Crimson raking light** : un lavis dégradé chaud→crimson sur le côté ombre de chaque image (écho des blobs du hero). Posé par `.figure::before`, RTL-aware (miroir en arabe).
- **Filet or** optionnel (`frame`) : hairline qui encadre les images clés (écho des hairlines de marque).
- **Révélation atmos** : une image `atmos` est froide/désaturée au repos et se réchauffe à l'étalonnage complet à l'entrée dans le viewport. Filtre uniquement, respecte `prefers-reduced-motion` (reste chaude d'emblée).

## Ratios

| Usage | `ratio` | `tone` |
|---|---|---|
| Portrait éditorial / fondateur | `4/5` | `editorial` |
| Bande atmosphérique (hero, séparateur) | `16/9` | `atmos` |
| Étude de cas | `3/2` | `editorial` |
| Vignette blog | `3/2` | `editorial` |

## Utilisation

```astro
---
import Figure from '../components/Figure.astro';
---
<Figure
  src={post.data.heroImage}
  alt="Atelier DESORA, retouche d'une identité de marque"
  ratio="16/9"
  tone="atmos"
  frame
  caption="Studio · Casablanca"
/>
```

Sans `src`, `Figure` affiche un placeholder qui **montre déjà le traitement** (motif de marque + grade + grain + label « Photography »), donc un emplacement vide prévisualise la direction au lieu de casser la mise en page.

## Déposer de vraies photos

Comme pour `public/brand/`, déposer les fichiers et référencer le chemin dans le contenu (`heroImage`, futurs champs `image`). Exporter en **WebP/AVIF**, largeur ≥ 1600px pour les bandes, ~1000px pour l'éditorial. Fournir déjà des visuels **peu saturés** ou tolérer que le grade fasse le travail : ne pas livrer d'images déjà « instagram » (le traitement se superpose).

Rappel build : `Figure` lit le chemin passé en prop (contenu), pas de détection `fs`, donc pas besoin de redémarrer le dev comme pour `brand-assets.ts`.

## État actuel

- Système en place (composant + traitement + doc). **Aucune vraie photo fournie** : tous les emplacements affichent le placeholder art-dirigé.
- Emplacement câblé : hero d'article de blog (`heroImage`, déjà dans le schéma de contenu).
- En attente de vrais visuels (ne rien inventer comme preuve client) : fondateur, atelier, études de cas. Voir la politique de contenu de confiance dans `CLAUDE.md`.
