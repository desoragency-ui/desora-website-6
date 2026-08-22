import { findClient } from './clients';
import { getMedia } from './media';
import { getCaseStudies } from './case-studies';
import type { Locale } from '../i18n/config';
import type { ShowcaseItem } from '../components/home/WorkShowcase.astro';

/** A case-study entry as authored in the content collections. */
export interface CaseStudyContent {
  client: string;
  sector: string;
  challenge: string;
  result: string;
  metric: { value: string; label: string };
  serviceSlug: string;
}

function decorate(item: Partial<ShowcaseItem> & { client: string; sector: string }): ShowcaseItem {
  const client = findClient(item.client);
  const slug = client?.slug;

  return {
    challenge: '',
    result: '',
    metric: { value: '', label: '' },
    serviceSlug: '',
    ...item,
    logoInk: client?.ink,
    builtByDesora: client?.builtByDesora,
    image: slug ? getMedia(`case-${slug}`) : undefined,
    imageAlt: client ? `${client.name}, ${item.sector}` : item.client,
  } as ShowcaseItem;
}

/**
 * The work rail's contents, in one place so the three localised homepages
 * cannot drift apart.
 *
 * Two sources feed it:
 *  1. The three projects DESORA delivered directly (src/lib/case-studies.ts).
 *     These lead, they carry a `caseSlug` and link through to a full page.
 *  2. The case studies authored in the home content collection.
 *
 * The logo, the "built by DESORA" badge, and the plate are resolved from the
 * client name rather than duplicated into every translated markdown file. A
 * missing logo or plate is not an error: the panel falls back to type and a
 * crimson wash, which is the honest outcome when we have no verified asset.
 */
export function buildShowcase(locale: Locale, authored: CaseStudyContent[]): ShowcaseItem[] {
  const delivered = getCaseStudies(locale).map((c) =>
    decorate({
      client: c.client,
      sector: c.sector,
      summary: c.summary,
      challenge: '',
      result: '',
      metric: c.metrics[0],
      serviceSlug: c.serviceSlug,
      caseSlug: c.slug,
    })
  );

  // Drop any authored entry that names a client already covered by a full case
  // study, so the rail never shows the same client twice.
  const covered = new Set(delivered.map((d) => findClient(d.client)?.slug).filter(Boolean));
  const rest = authored
    .filter((a) => {
      const slug = findClient(a.client)?.slug;
      return !slug || !covered.has(slug);
    })
    .map((a) => decorate(a));

  return [...delivered, ...rest];
}
