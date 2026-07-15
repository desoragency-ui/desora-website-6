export const locales = ['fr', 'en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

export const localeNames: Record<Locale, string> = {
  fr: 'FR',
  en: 'EN',
  ar: 'AR',
};

export const localeFullNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  ar: 'العربية',
};

export const rtlLocales: Locale[] = ['ar'];

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export function dirFor(locale: Locale): 'rtl' | 'ltr' {
  return isRtl(locale) ? 'rtl' : 'ltr';
}

// hreflang uses region-qualified tags where useful for SEO (fr-MA targets Morocco).
export const hreflangTags: Record<Locale, string> = {
  fr: 'fr-MA',
  en: 'en',
  ar: 'ar-MA',
};
