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
- Tailwind utilise ces tokens via `@theme inline`. Utiliser `bg-bg-primary`, `text-text-primary`, `bg-accent-strong`, `border-border`, etc. Variante `dark:` disponible (basée sur `[data-theme="dark"]`).

**L'accent est dédoublé (important).** Le crimson profond ne peut pas passer AA en petit texte sur du near-black : c'est de la physique, pas un choix. D'où deux tokens :
- `--color-accent` → **texte/icônes/liens**. Crimson exact `#710014` en clair ; bois-de-rose atténué `hsl(352 58% 70%)` en sombre (AA sur toutes les surfaces).
- `--color-accent-strong` → **aplats** (boutons, bande CTA, badges), toujours avec `--color-accent-foreground` (pearl) par-dessus. Crimson exact en clair ; crimson joaillier profond `hsl(349 88% 38%)` en sombre.

Règle : `bg-accent-strong` pour tout aplat, `text-accent` pour tout texte. Ne jamais remettre `bg-accent` sur un bouton (l'ancien accent sombre virait au rose bonbon, hors marque).
En sombre, les surfaces sont teintées espresso (`hsl(24 6% 14%)`), pas ardoise : une carte surélevée doit évoquer le cuir. Ombres via `--shadow-tint` (jamais du noir pur sur Pearl).

### Typographie (direction luxe, alignée sur le vrai logo)
- Titres/wordmark FR/EN : **Cormorant** (serif éditorial haut contraste, Google Fonts) — choisi pour matcher le logo DESORA réel (serif Didone élégant). Remplace Clash Display.
- Corps FR/EN : **General Sans** (Fontshare).
- Arabe : titres en **Amiri** (naskh serif élégant), corps en **Cairo**. `--font-arabic-display` = Amiri.
- **Le vrai wordmark est en place** : `public/brand/wordmark.png` (artwork fourni par le client, ratio 3.871). Rendu par `Wordmark.astro` via `mask-image`, donc un seul fichier se teinte par thème (crimson en clair, pearl en sombre). Le recréé en Cormorant ne sert plus que de secours si le fichier disparaît.
- Pour remplacer : déposer le nouveau fichier au même chemin (`brand-assets.ts` le détecte au build). Si l'artwork devient multicolore, ajouter `wordmark-dark.*` : le composant bascule alors sur deux `<img>` au lieu du masque.
- Note : le brief initial déconseillait un serif crème générique. Cette direction serif est justifiée : elle matche le **vrai logo** fourni (serif éditorial distinctif, pas un défaut générique).

### Accents luxe
- **Or antique** (`--color-gold`, ~4.9:1 sur Pearl en clair / champagne en sombre) : réservé aux hairlines, overlines (petites capitales tracking large, classe `.overline`), numéros. Jamais pour du texte courant.
- **Hairlines** (`--color-hairline`, `.hairline`) : filets très fins pour séparateurs éditoriaux.
- **Numéros serif** (`.numeral`, tabular) : stats, étapes de process, numérotation des cartes.
- **Pattern de marque** (`BrandPattern.astro`) : **le vrai artwork est en place** (`public/brand/pattern.png`), extrait de `brand identity/pattern 1.png`. Opacité 0.035-0.06 en fond de hero / CTA / footer / préchargement.
  - C'est un **masque alpha** (blanc + alpha), donc il se teinte au thème comme le wordmark. Le fond crème de l'artwork d'origine a été retiré : il ne touche jamais la surface de la page, et aucun blend mode n'est nécessaire. `tone="contrast"` (pearl sur crimson) fonctionne enfin, ce qui était impossible avec `mix-blend-multiply`.
  - `fit="cover"` par **défaut, et c'est voulu** : l'artwork n'est pas une tuile sans couture (ses bords ne correspondent pas, écart mesuré 172/213), donc le répéter afficherait une grille de coutures. Un seul grand lavis se lit aussi plus « direction artistique » que du papier peint. `fit="tile"` n'est valable que pour le fallback SVG, lui seul étant sans couture.
- **Logomark `ds`** : le vrai monogramme est en place, extrait de `brand identity/prf.png` (dont le fond échantillonne exactement `#710014`, ce qui confirme la source).
  - `public/brand/favicon.png` : pixels d'origine (glyphe pearl sur tuile crimson), recadré serré. Sert de favicon **et** d'apple-touch-icon.
  - `public/brand/icon.png` : masque alpha du glyphe seul, teintable, disponible si on veut le monogramme dans l'UI.

### ⚠️ Ajouter un asset dans `public/brand/` ? Redémarrer `npm run dev`
`brand-assets.ts` détecte les fichiers via `fs.existsSync` **à l'évaluation du module**. Vite met ce module en cache : déposer un fichier pendant que le serveur tourne ne change rien, et le HMR ne suffit pas (le site continue d'afficher le fallback). Le build de production, lui, part d'un process neuf et détecte tout correctement. Symptôme typique : `dist/` a le bon asset mais le dev sert encore le fallback.

## Règles non négociables
- **Aucun tiret cadratin (—) nulle part.** Virgules, points, deux-points.
- **Expressions interdites** (saturées chez la concurrence) : "agence 360°", "votre partenaire de croissance", "propulser votre présence en ligne", "solutions sur-mesure" sans précision.
- Titres orientés bénéfice, jamais fonctionnalité seule. CTA variés (jamais "Contactez-nous" répété).
- `prefers-reduced-motion` respecté, focus clavier visible, contraste AA (4.5:1), zones tactiles ≥ 44×44px, aucun scroll horizontal mobile.
- WhatsApp = CTA de première classe partout (canal de conversion préféré au Maroc), pas juste une icône de footer.

## Politique de contenu de confiance (IMPORTANT)
Logos clients, témoignages, études de cas chiffrées, statistiques d'impact : **jamais inventés.** Structure visuelle réelle mais contenu marqué `{{PLACEHOLDER_...}}` jusqu'à fourniture de vrai contenu.

**État actuel :** le client a fourni `reviews and case studies.docx` (9 clients réels) et a confirmé explicitement que les noms, les chiffres et les citations sont réels et approuvés par chaque personne citée. Ce contenu est donc publié :
- Barre de confiance accueil : "Ils nous font confiance" + les 9 noms clients (texte, pas de logos, aucun logo n'ayant été fourni).
- Accueil : 3 études de cas en vedette (MoteurZone, Desora Beauty, Riad Dar Souiri), 3 témoignages nominatifs, bande de chiffres attribuée client par client.
- 6 des 7 pages services ont une `caseStudy` réelle (client, blocage, action, tableau de métriques avant/après sur 12 mois, citation).

**Toujours en attente (ne pas inventer) :**
- `identite-de-marque` : aucune étude de cas identité fournie dans le document, placeholder conservé.
- Résultats business pour Wolcons et Centre Dentaire Messnana : les études de cas ne montrent
  que du périmètre livré. Dès que le client fournit des chiffres mesurés, les ajouter dans
  `src/lib/case-studies.ts`.
- Logos manquants : Clinique Le Jasmin, Maison du TEC, FesDistri. Absents du mur tant qu'aucun
  fichier vérifiable n'est fourni.
- Mentions légales : ICE, RC, forme juridique, adresse du siège.
- Logos clients réels, numéro WhatsApp, domaine de production, réseaux sociaux (voir `src/lib/site-config.ts`).

## Architecture

- **i18n :** routage natif Astro (`/fr/`, `/en/`, `/ar/`, `/` → `/fr/`). Chaînes UI dans `src/i18n/ui.ts`. `dir="rtl"` posé sur `<html>` pour l'arabe via `BaseLayout`.
- **Contenu :** content collections dans `src/content/` (`services`, `blog`, `home`, `about`), un fichier markdown par langue (`fr/`, `en/`, `ar/`). Helpers dans `src/lib/content.ts`. Note : le glob loader retire `/index` des ids → `home/fr/index.md` a l'id `fr`.
- **Packs services :** 3 niveaux cohérents = **Essentiel / Croissance / Signature**, sans prix. Colonne du milieu badge "Recommandé". Chaque niveau supérieur : "Tout ce qui est inclus dans [précédent], plus :".
- **Préchargement :** premier chargement de session uniquement (`sessionStorage`), compteur 0→100 (`src/components/Preloader.astro`). Le hero attend `window.__desoraPreloaderDone` (flag synchrone) OU l'event `desora:preloader-done`.
- **Animations :** init partagée dans `src/scripts/motion.ts` (GSAP + ScrollTrigger + SplitText + Lenis sur le ticker GSAP).
  - **Une seule courbe partout : `cubic-bezier(0.16, 1, 0.3, 1)`** (départ franc, arrivée qui se pose). Jamais de rebond : le rebond fait joueur, pas cher.
  - Attributs génériques : `data-reveal` (montée douce), `data-reveal="lines"` (cascade ligne par ligne via SplitText), `data-reveal-group` (stagger des enfants), `data-hairline-draw` (filet qui se trace, RTL-aware), `data-countup` (chiffres qui défilent, parse `+217,6%` / `180 000 درهم` et garde préfixe/suffixe/séparateur).
  - Classes utilitaires : `.cta-shine` (reflet lent sur aplat au survol), `.press` (enfoncement 1px), `.link-underline` (+ variante `--gold`).
  - Tout est derrière `prefers-reduced-motion` ; en reduced-motion les compteurs gardent la valeur finale écrite dans le contenu (jamais 0).
  - Pas de `window.addEventListener('scroll')` : l'état scrollé du header passe par ScrollTrigger pour rester sur le rAF de Lenis.
  - `ScrollTrigger.refresh()` est rappelé sur `document.fonts.ready` (les webfonts changent les métriques donc les points de déclenchement).
- **Config à finaliser :** valeurs placeholder dans `src/lib/site-config.ts` (numéro WhatsApp, domaine, réseaux sociaux, ICE/RC légaux). Chercher `PLACEHOLDER` dans le repo.

## Preuve client : logos, rail de réalisations, études de cas

**Roster client (`src/lib/clients.ts`).** 12 clients réels. Chaque logo a été récupéré sur le site,
le profil Instagram ou la page LinkedIn du client lui-même. **Ne jamais ajouter une entrée sans
source vérifiable pour la marque.** Chaque marque existe en deux fichiers dans
`public/brand/clients/` :
- `<slug>.png|svg` : silhouette alpha, peinte via `mask-image`, donc elle prend l'encre de la page
  et suit le thème. C'est ce qui permet à 12 logos dessinés par 12 studios différents de se lire
  comme un seul ensemble.
- `<slug>-color.png|svg` : le vrai logo, révélé au survol.

Les silhouettes sont normalisées **par surface d'encre**, pas par boîte englobante : un logotype
large et un monogramme compact pèsent alors visuellement pareil sur le mur. Si vous régénérez un
asset, gardez cette règle, sinon le mur redevient bancal.

`findClient(name)` résout un logo depuis le nom écrit dans la copie (avec `aliases` pour les
anciennes orthographes publiées). Un logo introuvable n'est **pas** une erreur : le panneau retombe
sur du texte. Un trou est honnête, une fausse marque ne l'est pas.

**Rail de réalisations (`WorkShowcase.astro`).** Sur desktop la section se fige et les panneaux
défilent horizontalement (`initHorizontalScroll` dans `motion.ts`). Sous 1024px de large **ou** sous
640px de haut, le même markup retombe sur un swipe natif avec points d'accroche : détourner le
scroll sur un téléphone est un combat, pas un effet. Le panneau se dimensionne sur la hauteur
disponible et c'est l'image qui absorbe le jeu, jamais le chiffre ni le CTA.

**Études de cas (`src/lib/case-studies.ts`, pages `/{lang}/realisations/{slug}`).** Trois projets
livrés directement, en FR/EN/AR. Données structurées plutôt que content collection : ces entrées
n'ont aucun corps de texte, seulement des champs.

⚠️ **Chiffres.** Fastway est le seul cas avec un résultat business mesuré (21 000 → 37 000 abonnés
en 4 mois, fourni et approuvé par le client) ; les autres valeurs de ce cas en dérivent
arithmétiquement. Wolcons et Centre Dentaire Messnana n'affichent **que du périmètre livré,
comptable sur leur propre site** (sections, réalisations publiées, langues). Aucun chiffre de
trafic, de leads ou de chiffre d'affaires n'est revendiqué pour eux tant que le client ne l'a pas
fourni.

## Langue servie à la racine

`functions/index.js` est une Pages Function qui possède **uniquement** `/`. Elle lit la requête et
oriente : `?lang=xx` > cookie `desora-lang` > `Accept-Language` (valeurs q respectées) > `fr`.
Le `LanguageSwitcher` pose le cookie au clic, donc un choix manuel tient d'une visite à l'autre.
Ne pas remettre de règle `/ → /fr` dans `public/_redirects` : elle masquerait la fonction.

## Kinetics (suite de `motion.ts`)

Primitives ajoutées, toutes en transform/opacity/clip et toutes derrière `prefers-reduced-motion` :
`data-hscroll` (rail figé), `data-depth-layer` (parallaxe multi-profondeur), `data-mask-reveal`
(lignes qui montent depuis leur propre boîte clippée, via `SplitText({ mask: 'lines' })`, ce qui
évite de raboter les accents français), `data-magnetic` (attraction du curseur), `data-tilt`
(inclinaison + reflet), `data-marquee` (bandeau piloté par GSAP, réactif à la vitesse de scroll et
RTL sans keyframe miroir), `data-logo-wall`, `data-ambient`.

⚠️ **Les contrôles ne dépendent jamais d'une animation.** Le cluster mobile porte `data-no-entrance`
et l'entrée du header a un chien de garde : une page ouverte dans un onglet d'arrière-plan ne reçoit
pas de frames rAF, et l'ancien code laissait alors les boutons langue/thème/menu à `opacity: 0`,
donc invisibles et non cliquables.

## Polices : chargées par langue

`BaseLayout` demande Cormorant + General Sans en FR/EN, et Amiri + Cairo en AR. Charger les huit
fichiers arabes sur chaque page française mettait des polices jamais rendues sur le chemin critique.
Si vous ajoutez une graisse, ajoutez-la du bon côté du test `isArabic`.

## Commandes
- `npm run dev` — serveur de dev (port 4321)
- `npm run build` — `astro check` + build de production (sortie `dist/`)
- `npm run preview` — prévisualiser le build
- Déploiement : `npx wrangler pages deploy dist` (nécessite un compte Cloudflare connecté par l'utilisateur)
