import type { APIRoute } from 'astro';
import { getServices, getBlogPosts } from '../lib/content';
import { caseStudies } from '../lib/case-studies';
import { siteConfig } from '../lib/site-config';
import { locales, localeFullNames, type Locale } from '../i18n/config';

/**
 * /llms.txt, following the llmstxt.org format: a plain-Markdown map of the site
 * for AI assistants (ChatGPT, Claude, Perplexity, Gemini...) that read it to
 * understand who DESORA is and which page answers what.
 *
 * Generated from the same content collections that build the pages, so a new
 * service, post or case study appears here on the next build with no second
 * place to update. Every fact below comes from the site's own content: nothing
 * is added here that a visitor could not read on the pages themselves.
 */

const abs = (path: string) => new URL(path, siteConfig.domain).toString();

const sectionTitle: Record<Locale, { services: string; work: string; blog: string; pages: string }> = {
  fr: { services: 'Services', work: 'Réalisations', blog: 'Articles', pages: 'Pages' },
  en: { services: 'Services', work: 'Case studies', blog: 'Articles', pages: 'Pages' },
  ar: { services: 'الخدمات', work: 'الأعمال', blog: 'المقالات', pages: 'الصفحات' },
};

const pageNames: Record<Locale, { home: string; about: string; contact: string; blog: string }> = {
  fr: { home: 'Accueil', about: 'À propos', contact: 'Contact', blog: 'Blog' },
  en: { home: 'Home', about: 'About', contact: 'Contact', blog: 'Blog' },
  ar: { home: 'الرئيسية', about: 'من نحن', contact: 'اتصل بنا', blog: 'المدونة' },
};

async function localeBlock(locale: Locale): Promise<string> {
  const t = sectionTitle[locale];
  const n = pageNames[locale];
  const services = await getServices(locale);
  const posts = await getBlogPosts(locale);
  const work = caseStudies[locale];

  const lines: string[] = [];
  lines.push(`## ${localeFullNames[locale]} (${locale})`, '');

  lines.push(`### ${t.pages}`, '');
  lines.push(`- [${n.home}](${abs(`/${locale}`)})`);
  lines.push(`- [${n.about}](${abs(`/${locale}/a-propos`)})`);
  lines.push(`- [${n.contact}](${abs(`/${locale}/contact`)})`);
  lines.push(`- [${n.blog}](${abs(`/${locale}/blog`)})`, '');

  lines.push(`### ${t.services}`, '');
  for (const s of services) {
    lines.push(`- [${s.title}](${abs(`/${locale}/services/${s.slug}`)}): ${s.seoDescription}`);
  }
  lines.push('');

  if (work.length) {
    lines.push(`### ${t.work}`, '');
    for (const c of work) {
      lines.push(`- [${c.client}](${abs(`/${locale}/realisations/${c.slug}`)}): ${c.sector}. ${c.summary}`);
    }
    lines.push('');
  }

  if (posts.length) {
    lines.push(`### ${t.blog}`, '');
    for (const p of posts) {
      lines.push(`- [${p.entry.data.title}](${abs(`/${locale}/blog/${p.slug}`)}): ${p.entry.data.excerpt}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

export const GET: APIRoute = async () => {
  const services = await getServices('en');
  const social = [siteConfig.social.instagram, siteConfig.social.facebook];

  const header = [
    `# ${siteConfig.name}`,
    '',
    `> ${siteConfig.name} is a founder-led digital marketing agency in Morocco. It builds brand identities, custom websites, Meta Ads campaigns, lead generation, SEO, social media content and email marketing for Moroccan businesses, and works in French, English and Arabic. Signature: "${siteConfig.tagline}".`,
    '',
    '## Key facts',
    '',
    `- Name: ${siteConfig.name}`,
    '- Type: digital marketing agency, founder-led: clients deal directly with the founder, from the first brief to the results.',
    '- Market served: Morocco',
    '- Working languages: French, English, Arabic (the whole site exists in all three)',
    `- Services: ${services.map((s) => s.title).join(', ')}`,
    '- Offer structure: three packs per service (Essentiel, Croissance, Signature). Prices are quoted per project, not published.',
    `- Contact: ${siteConfig.email}, WhatsApp +${siteConfig.whatsappNumber} (${siteConfig.whatsappUrl})`,
    `- Website: ${siteConfig.domain}`,
    `- Social profiles: ${social.join(', ')}`,
    '',
  ].join('\n');

  const blocks = await Promise.all(locales.map(localeBlock));

  const body = `${header}\n${blocks.join('\n')}`.trimEnd() + '\n';

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
