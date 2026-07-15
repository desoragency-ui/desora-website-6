# DESORA — Guide de cohérence du projet

Site web de l'agence DESORA (marketing digital premium, Maroc). Astro + TypeScript + Tailwind v4 + GSAP/Lenis, trilingue (FR défaut, EN, AR/RTL), déployé sur Cloudflare Pages.

## Système de marque (à respecter sur tout le site)

**Signature :** "Beyond Ordinary Brands". Boutique premium pilotée par son fondateur (assumé comme un avantage : accès direct, pas d'intermédiaires).

**Ton :** Direct, orienté résultats, zéro remplissage. Chaque phrase dit quelque chose de spécifique.

### Couleurs (tokens sémantiques uniquement, jamais de hex en dur dans un composant)
| Rôle | Couleur | Hex |
|---|---|---|
| Primaire (accent, CTA) | Crimson | `#710014` |
| Secondaire chaude | Sand | `#B38F6F` |
| Base sombre | Obsidian | `#161616` |
| Base claire | Pearl | `#F2F1ED` |

- Crimson = accent seulement (boutons, liens actifs, détails), jamais fond dominant.
- Tokens définis dans `src/styles/global.css` : `--color-bg-primary`, `--color-text-primary`, `--color-accent`, `--color-surface`, `--color-border`, etc. Ils basculent entre clair/sombre via `[data-theme]`.
- Tailwind utilise ces tokens via `@theme inline`. Utiliser `bg-bg-primary`, `text-text-primary`, `bg-accent`, `border-border`, etc. Variante `dark:` disponible (basée sur `[data-theme="dark"]`).

### Typographie (direction luxe, alignée sur le vrai logo)
- Titres/wordmark FR/EN : **Cormorant** (serif éditorial haut contraste, Google Fonts) — choisi pour matcher le logo DESORA réel (serif Didone élégant). Remplace Clash Display.
- Corps FR/EN : **General Sans** (Fontshare).
- Arabe : titres en **Amiri** (naskh serif élégant), corps en **Cairo**. `--font-arabic-display` = Amiri.
- Le wordmark est rendu en texte vivant (composant `Wordmark.astro`, Cormorant, majuscules, tracking 0.14em) — crisp, thémable. Pour l'artwork exact, déposer `logo-wordmark.svg` dans `/public` et l'échanger.
- Note : le brief initial déconseillait un serif crème générique. Cette direction serif est justifiée : elle matche le **vrai logo** fourni (serif éditorial distinctif, pas un défaut générique).

### Accents luxe
- **Or antique** (`--color-gold`, ~4.9:1 sur Pearl en clair / champagne en sombre) : réservé aux hairlines, overlines (petites capitales tracking large, classe `.overline`), numéros. Jamais pour du texte courant.
- **Hairlines** (`--color-hairline`, `.hairline`) : filets très fins pour séparateurs éditoriaux.
- **Numéros serif** (`.numeral`, tabular) : stats, étapes de process, numérotation des cartes.
- **Pattern de marque** (`BrandPattern.astro`) : lettres serif dispersées, opacité très basse (0.04-0.06), en fond de hero / CTA / préchargement. `tone="contrast"` pour surfaces crimson.
- **Favicon** : monogramme serif "D" crimson/pearl (`public/favicon.svg`). Déposer le vrai logomark `ds` pour l'exact.

## Règles non négociables
- **Aucun tiret cadratin (—) nulle part.** Virgules, points, deux-points.
- **Expressions interdites** (saturées chez la concurrence) : "agence 360°", "votre partenaire de croissance", "propulser votre présence en ligne", "solutions sur-mesure" sans précision.
- Titres orientés bénéfice, jamais fonctionnalité seule. CTA variés (jamais "Contactez-nous" répété).
- `prefers-reduced-motion` respecté, focus clavier visible, contraste AA (4.5:1), zones tactiles ≥ 44×44px, aucun scroll horizontal mobile.
- WhatsApp = CTA de première classe partout (canal de conversion préféré au Maroc), pas juste une icône de footer.

## Politique de contenu de confiance (IMPORTANT)
Logos clients, témoignages, études de cas chiffrées, statistiques d'impact : **jamais inventés.** Structure visuelle réelle mais contenu marqué `{{PLACEHOLDER_...}}` jusqu'à fourniture de vrai contenu. La barre de confiance de l'accueil utilise "Secteurs que nous accompagnons" (option honnête sans prétendre à des relations client).

## Architecture

- **i18n :** routage natif Astro (`/fr/`, `/en/`, `/ar/`, `/` → `/fr/`). Chaînes UI dans `src/i18n/ui.ts`. `dir="rtl"` posé sur `<html>` pour l'arabe via `BaseLayout`.
- **Contenu :** content collections dans `src/content/` (`services`, `blog`, `home`, `about`), un fichier markdown par langue (`fr/`, `en/`, `ar/`). Helpers dans `src/lib/content.ts`. Note : le glob loader retire `/index` des ids → `home/fr/index.md` a l'id `fr`.
- **Packs services :** 3 niveaux cohérents = **Essentiel / Croissance / Signature**, sans prix. Colonne du milieu badge "Recommandé". Chaque niveau supérieur : "Tout ce qui est inclus dans [précédent], plus :".
- **Préchargement :** premier chargement de session uniquement (`sessionStorage`), compteur 0→100 (`src/components/Preloader.astro`). Le hero attend `window.__desoraPreloaderDone` (flag synchrone) OU l'event `desora:preloader-done`.
- **Animations :** init partagée dans `src/scripts/motion.ts` (GSAP + ScrollTrigger + SplitText + Lenis sur le ticker GSAP). Reveals génériques via `data-reveal` / `data-reveal-group`.
- **Config à finaliser :** valeurs placeholder dans `src/lib/site-config.ts` (numéro WhatsApp, domaine, réseaux sociaux, ICE/RC légaux). Chercher `PLACEHOLDER` dans le repo.

## Commandes
- `npm run dev` — serveur de dev (port 4321)
- `npm run build` — `astro check` + build de production (sortie `dist/`)
- `npm run preview` — prévisualiser le build
- Déploiement : `npx wrangler pages deploy dist` (nécessite un compte Cloudflare connecté par l'utilisateur)
