import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const SITE_URL = 'https://www.desora.net';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'ar'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
  integrations: [
    sitemap({
      // Two kinds of URL stay out of the sitemap:
      // - the bare root, which only redirects to a language and is never a
      //   page Google can index (listing it reports as "Page with redirect");
      // - the brief quiz, sent privately to a client once a project is agreed.
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/$/, '');
        return path !== '' && !/\/brief$/.test(path);
      },
      // Must match the hreflang codes BaseLayout prints in <head>
      // (src/i18n/config.ts). Mismatched codes between the two are read by
      // Google as two conflicting annotations.
      i18n: {
        defaultLocale: 'fr',
        locales: {
          fr: 'fr-MA',
          en: 'en',
          ar: 'ar-MA',
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
