import type { Locale } from '../i18n/config';

/**
 * The real client roster.
 *
 * TRUST POLICY (see CLAUDE.md): every entry here is a real client, and every
 * logo in `public/brand/clients/` was taken from that client's own live site,
 * Instagram profile, or LinkedIn page. Nothing on this list is illustrative and
 * nothing may be added without a verifiable source for the mark.
 *
 * Each mark ships twice:
 *  - `<slug>.png|svg`        an alpha silhouette, painted through mask-image so
 *                            it takes the page's ink colour and adapts to theme
 *  - `<slug>-color.png|svg`  the client's real logo, cross-faded in on hover
 *
 * The silhouettes were normalised by INK AREA rather than bounding box, so a
 * wide wordmark and a compact monogram carry the same visual weight on the wall.
 *
 * `tile: true` marks logos whose plate is part of the mark itself (an avatar
 * tile), so the colour layer gets a corner radius instead of floating.
 */

export interface ClientEntry {
  slug: string;
  name: string;
  /** Their own site or profile. Opens in a new tab from the wall. */
  href?: string;
  /** Sector line, per locale. Kept factual, taken from the client's own copy. */
  sector: Record<Locale, string>;
  ink: string;
  color: string;
  tile?: boolean;
  /** Other spellings this client appears under in authored copy. The published
   *  case studies were written before we had the clients' own profiles, so the
   *  prose still uses some approximate names. Aliases let the logo resolve
   *  without rewriting attributed testimonial copy. */
  aliases?: string[];
  /** Set when DESORA built the thing being shown, so the wall can badge it. */
  builtByDesora?: boolean;
}

const asset = (slug: string, ext: 'png' | 'svg') => ({
  ink: `/brand/clients/${slug}.${ext}`,
  color: `/brand/clients/${slug}-color.${ext}`,
});

export const clients: ClientEntry[] = [
  {
    slug: 'royal-mansour',
    name: 'Royal Mansour Casablanca',
    href: 'https://www.royalmansour.com/en/casablanca/',
    sector: {
      fr: 'Hôtellerie de luxe, Casablanca',
      en: 'Luxury hospitality, Casablanca',
      ar: 'ضيافة فاخرة، الدار البيضاء',
    },
    ...asset('royal-mansour', 'svg'),
  },
  {
    slug: 'wolcons',
    name: 'Wolcons',
    href: 'https://wolcons.vercel.app/',
    sector: {
      fr: 'Construction et aménagement TCE, Casablanca',
      en: 'Construction and fit-out, Casablanca',
      ar: 'البناء والتجهيز، الدار البيضاء',
    },
    ...asset('wolcons', 'png'),
    builtByDesora: true,
  },
  {
    slug: 'centre-dentaire-messnana',
    name: 'Centre Dentaire Messnana',
    href: 'https://dr-nafie-fadoua.vercel.app/',
    sector: {
      fr: 'Cabinet dentaire, Tanger',
      en: 'Dental practice, Tangier',
      ar: 'عيادة أسنان، طنجة',
    },
    ...asset('centre-dentaire-messnana', 'svg'),
    builtByDesora: true,
  },
  {
    slug: 'gsi',
    name: 'GSI Groupe Slaoui Investments',
    href: 'https://www.linkedin.com/company/gsi-groupe-slaoui-investments',
    sector: {
      fr: 'Distribution et services, Casablanca',
      en: 'Distribution and market services, Casablanca',
      ar: 'التوزيع والخدمات، الدار البيضاء',
    },
    ...asset('gsi', 'png'),
    aliases: ['Slaoui Industry', 'Groupe Slaoui'],
  },
  {
    slug: 'ma-logistics',
    name: 'MA Logistics',
    href: 'https://www.malogistics.ma/',
    sector: {
      fr: 'Transport et logistique',
      en: 'Transport and logistics',
      ar: 'النقل واللوجستيك',
    },
    ...asset('ma-logistics', 'png'),
    // "FesDistri" and "Fes Logistics" appear in published copy but no source was
    // given for them, and they are not this company. Left unmapped on purpose:
    // an unresolved logo is honest, a wrong one is not.
    aliases: ['MarocLogistics', 'Maroc Logistics'],
  },
  {
    slug: 'cabestan',
    name: 'Le Cabestan',
    href: 'https://www.le-cabestan.com/',
    sector: {
      fr: 'Restaurant, Casablanca',
      en: 'Restaurant, Casablanca',
      ar: 'مطعم، الدار البيضاء',
    },
    ...asset('cabestan', 'png'),
  },
  {
    slug: 'loctave',
    name: "L'Octave",
    href: 'https://www.loctavecasa.com/',
    sector: {
      fr: 'Restaurant et music hall, Casablanca',
      en: 'Restaurant and music hall, Casablanca',
      ar: 'مطعم وقاعة موسيقى، الدار البيضاء',
    },
    ...asset('loctave', 'png'),
  },
  {
    slug: 'fastway',
    name: 'Fastway',
    href: 'https://www.instagram.com/fastway.ma/',
    sector: {
      fr: "Conseil en études à l'étranger, Rabat",
      en: 'Study-abroad consultancy, Rabat',
      ar: 'الاستشارة في الدراسة بالخارج، الرباط',
    },
    ...asset('fastway', 'png'),
    tile: true,
    builtByDesora: true,
  },
  {
    slug: 'desora-beauty',
    name: 'Desora Beauty',
    href: 'https://desorabeauty.com/',
    sector: {
      fr: 'Parfumerie de niche',
      en: 'Niche perfumery',
      ar: 'عطور نيش',
    },
    ...asset('desora-beauty', 'png'),
  },
  {
    slug: 'dar-souiri',
    name: 'Dar Souiri',
    href: 'https://www.instagram.com/associationessaouiramogador/',
    sector: {
      fr: 'Culture et patrimoine, Essaouira',
      en: 'Culture and heritage, Essaouira',
      ar: 'الثقافة والتراث، الصويرة',
    },
    ...asset('dar-souiri', 'png'),
    aliases: ['Riad Dar Souiri', 'Association Essaouira Mogador'],
  },
  {
    slug: 'motor-zone',
    name: 'Motor Zone',
    href: 'https://www.instagram.com/motorzone.automotive/',
    sector: {
      fr: 'Automobile',
      en: 'Automotive',
      ar: 'السيارات',
    },
    ...asset('motor-zone', 'png'),
    aliases: ['MoteurZone', 'Moteur Zone'],
    tile: true,
  },
  {
    slug: 'oversize',
    name: 'Oversize',
    href: 'https://www.instagram.com/oversize.ma/',
    sector: {
      fr: 'Streetwear, made in Morocco',
      en: 'Streetwear, made in Morocco',
      ar: 'ملابس ستريت وير مغربية',
    },
    ...asset('oversize', 'png'),
    aliases: ["L'Oversized", 'Oversized'],
    tile: true,
  },
];

/** Marks whose file we have. Anything without a verified logo never reaches
 *  the wall: a gap is honest, an invented mark is not. */
export const clientLogos = clients;

const bySlug = new Map(clients.map((c) => [c.slug, c]));

export function clientBySlug(slug: string): ClientEntry | undefined {
  return bySlug.get(slug);
}

/** Case-study content names a client in prose ("Riad Dar Souiri", "MoteurZone"),
 *  which will not always match the roster slug. Normalise both sides and match
 *  on containment so a logo is found without duplicating the roster into every
 *  translated markdown file. Returns undefined rather than guessing. */
export function findClient(name: string): ClientEntry | undefined {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9]/g, '');

  const key = norm(name);
  if (!key) return undefined;

  return clients.find((c) => {
    const candidates = [c.slug, c.name, ...(c.aliases ?? [])].map(norm);
    return candidates.some(
      (cand) => cand.length > 2 && (key === cand || key.includes(cand) || cand.includes(key))
    );
  });
}
