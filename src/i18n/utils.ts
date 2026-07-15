import { defaultLocale, locales, type Locale } from './config';
import { ui, type UiKey } from './ui';

export function getLangFromUrl(url: URL): Locale {
  const [, maybeLocale] = url.pathname.split('/');
  if (locales.includes(maybeLocale as Locale)) {
    return maybeLocale as Locale;
  }
  return defaultLocale;
}

export function useTranslations(locale: Locale) {
  return function t(key: UiKey, vars?: Record<string, string>): string {
    let str: string = ui[locale][key] ?? ui[defaultLocale][key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(`{${k}}`, v);
      }
    }
    return str;
  };
}

/** Swap the locale segment of a path, preserving the rest (e.g. /fr/services/seo -> /en/services/seo). */
export function switchLocalePath(pathname: string, newLocale: Locale): string {
  const segments = pathname.split('/');
  if (locales.includes(segments[1] as Locale)) {
    segments[1] = newLocale;
  } else {
    segments.splice(1, 0, newLocale);
  }
  return segments.join('/') || '/';
}

export function localizedPath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `/${locale}${clean ? `/${clean}` : ''}`;
}
