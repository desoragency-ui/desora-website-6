import { siteConfig } from './site-config';
import { hreflangTags, type Locale } from '../i18n/config';

/**
 * JSON-LD builders for the site's structured data.
 *
 * Every page prints one @graph. Nodes point at each other through stable @id
 * URIs, so search engines and AI assistants read one connected entity (DESORA)
 * behind every page instead of a loose pile of objects.
 *
 * Only facts that are visible on the site go in here. No street address, no
 * founder name, no ratings or reviews: none of those are published yet, and
 * structured data that does not match the page is a manual-action risk.
 */

export type SchemaNode = Record<string, unknown>;

const SITE = siteConfig.domain;

export const ORG_ID = `${SITE}/#organization`;
export const WEBSITE_ID = `${SITE}/#website`;
export const LOGO_ID = `${SITE}/#logo`;

export const abs = (path: string) => new URL(path, SITE).toString();

const telephone = `+${siteConfig.whatsappNumber}`;
const morocco = { '@type': 'Country', name: 'Morocco' };

export function organization(description: string, serviceNames: string[]): SchemaNode {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: siteConfig.name,
    alternateName: 'ديزورا',
    url: SITE,
    logo: {
      '@type': 'ImageObject',
      '@id': LOGO_ID,
      url: abs('/brand/icon.png'),
      contentUrl: abs('/brand/icon.png'),
      width: 512,
      height: 512,
      caption: siteConfig.name,
    },
    image: { '@id': LOGO_ID },
    description,
    slogan: siteConfig.tagline,
    email: siteConfig.email,
    telephone,
    address: { '@type': 'PostalAddress', addressCountry: 'MA' },
    areaServed: morocco,
    knowsLanguage: ['fr', 'en', 'ar'],
    knowsAbout: serviceNames,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone,
      email: siteConfig.email,
      url: siteConfig.whatsappUrl,
      availableLanguage: ['French', 'English', 'Arabic'],
      areaServed: 'MA',
    },
    // LinkedIn stays out until the real company page is confirmed in site-config.
    sameAs: [siteConfig.social.instagram, siteConfig.social.facebook],
  };
}

export function website(): SchemaNode {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE,
    name: siteConfig.name,
    alternateName: 'ديزورا',
    inLanguage: Object.values(hreflangTags),
    publisher: { '@id': ORG_ID },
  };
}

export type PageType = 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage';

export function webPage(opts: {
  url: string;
  name: string;
  description: string;
  locale: Locale;
  type: PageType;
  hasBreadcrumb: boolean;
  mainEntityId?: string;
}): SchemaNode {
  return {
    '@type': opts.type,
    '@id': `${opts.url}#webpage`,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    inLanguage: hreflangTags[opts.locale],
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    ...(opts.hasBreadcrumb ? { breadcrumb: { '@id': `${opts.url}#breadcrumb` } } : {}),
    ...(opts.mainEntityId ? { mainEntity: { '@id': opts.mainEntityId } } : {}),
  };
}

/** Items in order from the home page to the current page. The last item is the page itself. */
export function breadcrumbList(url: string, items: { name: string; url: string }[]): SchemaNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function service(opts: {
  url: string;
  name: string;
  description: string;
  subServices: { title: string; description: string }[];
}): SchemaNode {
  return {
    '@type': 'Service',
    '@id': `${opts.url}#service`,
    name: opts.name,
    serviceType: opts.name,
    description: opts.description,
    url: opts.url,
    provider: { '@id': ORG_ID },
    areaServed: morocco,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: opts.name,
      itemListElement: opts.subServices.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, description: s.description },
      })),
    },
  };
}

/**
 * Mirrors the FAQ accordion printed on the same page. Google no longer shows
 * FAQ rich results for most sites, but the markup stays valid and gives AI
 * answer engines clean question/answer pairs to quote.
 */
export function faqPage(url: string, items: { question: string; answer: string }[]): SchemaNode {
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    isPartOf: { '@id': `${url}#webpage` },
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function blogPosting(opts: {
  url: string;
  headline: string;
  description: string;
  locale: Locale;
  datePublished: Date;
  section: string;
  wordCount: number;
  image?: string;
}): SchemaNode {
  const date = opts.datePublished.toISOString().slice(0, 10);
  return {
    '@type': 'BlogPosting',
    '@id': `${opts.url}#article`,
    headline: opts.headline,
    description: opts.description,
    inLanguage: hreflangTags[opts.locale],
    datePublished: date,
    dateModified: date,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@id': `${opts.url}#webpage` },
    articleSection: opts.section,
    wordCount: opts.wordCount,
    ...(opts.image ? { image: [opts.image] } : {}),
  };
}

export function caseStudyArticle(opts: {
  url: string;
  headline: string;
  description: string;
  locale: Locale;
  client: string;
  sector: string;
}): SchemaNode {
  return {
    '@type': 'Article',
    '@id': `${opts.url}#article`,
    headline: opts.headline,
    description: opts.description,
    inLanguage: hreflangTags[opts.locale],
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@id': `${opts.url}#webpage` },
    about: { '@type': 'Organization', name: opts.client, description: opts.sector },
  };
}

/** Serialises a graph for a <script type="application/ld+json">, safe against "</script>" in content. */
export function toJsonLd(nodes: SchemaNode[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c');
}
