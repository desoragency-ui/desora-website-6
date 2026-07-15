import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/config';

/** Content collection ids are "{locale}/{slug}" thanks to the glob loader over src/content/<collection>/<locale>/. */
function stripLocalePrefix(id: string, locale: Locale): string | null {
  const prefix = `${locale}/`;
  return id.startsWith(prefix) ? id.slice(prefix.length) : null;
}

export async function getServices(locale: Locale) {
  const all = await getCollection('services');
  return all
    .map((entry) => {
      const slug = stripLocalePrefix(entry.id, locale);
      return slug ? { slug, ...entry.data } : null;
    })
    .filter((v): v is NonNullable<typeof v> => v !== null)
    .sort((a, b) => a.order - b.order);
}

export async function getServiceBySlug(locale: Locale, slug: string) {
  const all = await getCollection('services');
  const entry = all.find((e) => e.id === `${locale}/${slug}`);
  if (!entry) return null;
  return { slug, ...entry.data };
}

export async function getServiceSlugs(): Promise<string[]> {
  const all = await getCollection('services', (entry) => entry.id.startsWith('fr/'));
  return all.map((entry) => stripLocalePrefix(entry.id, 'fr')!).filter(Boolean);
}

export async function getBlogPosts(locale: Locale) {
  const all = await getCollection('blog');
  return all
    .map((entry) => {
      const slug = stripLocalePrefix(entry.id, locale);
      return slug ? { slug, entry } : null;
    })
    .filter((v): v is NonNullable<typeof v> => v !== null)
    .sort((a, b) => b.entry.data.publishDate.getTime() - a.entry.data.publishDate.getTime());
}

export async function getBlogPostBySlug(locale: Locale, slug: string) {
  const all = await getCollection('blog');
  const entry = all.find((e) => e.id === `${locale}/${slug}`);
  if (!entry) return null;
  return entry;
}

export function estimateReadingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** Blog categories are either a service slug or "marketing-general". Resolves each to a display label + icon. */
export async function getCategoryMeta(locale: Locale, category: string) {
  if (category === 'marketing-general') {
    const label = category; // resolved by caller via t('blog.category.marketingGeneral') to keep this file translation-free
    return { slug: category, label, icon: 'target' };
  }
  const services = await getServices(locale);
  const match = services.find((s) => s.slug === category);
  return { slug: category, label: match?.title ?? category, icon: match?.icon ?? 'target' };
}

export async function getAllCategories(locale: Locale) {
  const posts = await getBlogPosts(locale);
  const slugs = Array.from(new Set(posts.map((p) => p.entry.data.category)));
  return Promise.all(slugs.map((slug) => getCategoryMeta(locale, slug)));
}

export async function getHome(locale: Locale) {
  // The glob loader strips a trailing "/index" from generated ids, so
  // src/content/home/fr/index.md has id "fr", not "fr/index".
  const all = await getCollection('home');
  return all.find((e) => e.id === locale)?.data ?? null;
}

export async function getAbout(locale: Locale) {
  const all = await getCollection('about');
  return all.find((e) => e.id === locale)?.data ?? null;
}

export type ServiceEntry = CollectionEntry<'services'>;
export type BlogEntry = CollectionEntry<'blog'>;
