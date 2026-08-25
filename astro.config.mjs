import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// TODO: replace with the real production domain before going live.
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
      // The brief quiz is sent privately to a client once a project is agreed.
      // It should never appear in search results or the sitemap.
      filter: (page) => !page.includes('/brief'),
      i18n: {
        defaultLocale: 'fr',
        locales: {
          fr: 'fr-MA',
          en: 'en',
          ar: 'ar',
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
