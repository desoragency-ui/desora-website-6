# DESORA — Shot list & prompts de génération

Kit de production pour les vraies photos du site. Direction : voir [imagery.md](./imagery.md) (« Warm shadow, single light »). Toute image passe par `Figure.astro`, qui ajoute déjà le grade crimson, le sol obsidian et le grain. **Donc livrer des images propres, peu saturées, à une seule source de lumière chaude.** Ne pas livrer d'images déjà « instagram » : le traitement se superpose.

## Règles de livraison

- Format **WebP** (ou AVIF). sRGB.
- Largeurs : bandes atmos **≥ 1600px**, éditorial 4:5 **~1200px**, étude de cas 3:2 **~1400px**.
- **Saturation basse à moyenne.** Le crimson est ajouté par le CSS ; l'image ne doit contenir **aucun rouge saturé** (contrat couleur).
- Une seule source de lumière chaude, ombres profondes. Pas de flash plat, pas de HDR.
- Déposer dans `public/media/`. Référencer en `/media/<nom>.webp`.

## Contraintes communes (à mettre dans chaque prompt)

Positif : `single warm afternoon light, deep obsidian shadows, warm sand and pearl highlights, matte, editorial, medium-format film look, shallow depth of field, generous negative space, muted low-saturation palette`

Négatif : `no red, no saturated colors, no text, no logos, no watermark, no HDR, no flat lighting, no studio softbox look, no stocky smiling team, no clutter`

## Emplacements

| Slot | `ratio` | `tone` | Fichier suggéré | Sujet |
|---|---|---|---|---|
| Bande hero accueil (option) | 16/9 | atmos | `hero-atelier.webp` | architecture/atelier, lumière rasante |
| Portrait fondateur (À propos) | 4/5 | editorial | `founder-portrait.webp` | fondateur au travail, candid |
| Atelier / process (À propos) | 3/2 | editorial | `atelier-hands.webp` | mains au travail, gros plan |
| Études de cas accueil (×3) | 3/2 | editorial | `case-<client>.webp` | produit/marque en contexte |
| Hero services (×7) | 16/9 | atmos | `service-<slug>.webp` | matière liée au service |
| Vignette blog | 3/2 | editorial | `blog-<slug>.webp` | déjà câblé (`heroImage`) |

## Prompts (copier-coller, ajuster le modèle)

**1. Bande hero / atmos — `hero-atelier.webp` (16:9)**
> Editorial architectural photograph of a minimalist Moroccan modernist studio interior, a single warm afternoon light raking across a tadelakt plaster wall and a subtle zellige geometric detail, deep obsidian shadows, warm sand highlights, no people, matte, medium-format film look, shallow depth of field, generous negative space on the right, muted low-saturation palette. No red, no text, no logos, no HDR, no flat lighting.

**2. Portrait fondateur — `founder-portrait.webp` (4:5)**
> Candid editorial portrait of a focused founder working in a quiet minimalist atelier, three-quarter or over-the-shoulder framing, no eye contact, single warm window light from the side, deep shadow on the opposite side, warm neutral wardrobe, obsidian and sand tones, matte film look, medium format, shallow depth of field, expensive and calm mood. No red garments, no text, no logos.

**3. Atelier / mains — `atelier-hands.webp` (3:2)**
> Close-up editorial photograph of hands arranging brand material samples on a warm concrete table, single warm raking light, deep obsidian shadow, warm sand highlights, aged leather and matte paper, muted palette, medium-format film look, shallow depth of field. No red, no text, no logos.

**4. Étude de cas / produit — `case-<client>.webp` (3:2)**
> Editorial product-in-context still life for a premium brand, a single object on a tadelakt surface, single warm raking light, deep obsidian background, warm sand highlights, minimal, matte, medium format, shallow depth of field, negative space. No red, no text, no logos.

**5. Matière / hero service — `service-<slug>.webp` (16:9)**
> Abstract macro photograph of a luxury Moroccan material (brass / aged leather / silk / tadelakt — pick per service), single warm raking light, deep obsidian background, warm sand highlights, matte, editorial, low saturation, negative space. No red, no text, no logos.

## Modèles conseillés

Midjourney (`--ar 16:9 --style raw`), Adobe Firefly, Google Imagen, ou Flux. Générer 2-3 variantes par slot, garder la plus sobre. Recadrer au ratio exact avant export.

## Câblage (quand les fichiers existent)

- **Blog** : ajouter `heroImage: "/media/blog-<slug>.webp"` au frontmatter de chaque article. Rien d'autre à faire (déjà câblé).
- **Hero accueil / À propos / études de cas / services** : slots pas encore câblés. Dire « câble les slots » et je pose les `<Figure>` + les champs de contenu nécessaires.

Sans fichier, chaque slot affiche le placeholder art-dirigé (motif + grade + grain + label). Rien ne casse.
