/**
 * Central place for business-identity values that are still placeholders.
 * Replace these with DESORA's real details before launch — search the repo
 * for "PLACEHOLDER" to find every dependent usage.
 */
export const siteConfig = {
  name: 'DESORA',
  tagline: 'Beyond Ordinary Brands',
  domain: 'https://desora.ma', // PLACEHOLDER: confirm real production domain

  email: 'desoragency@gmail.com',

  // PLACEHOLDER: replace with the real WhatsApp Business number (E.164, no spaces).
  whatsappNumber: '212600000000',
  get whatsappUrl() {
    return `https://wa.me/${this.whatsappNumber}`;
  },
  whatsappUrlWithMessage(message: string) {
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
  },

  social: {
    // PLACEHOLDER: confirm real handles/URLs.
    instagram: 'https://instagram.com/desora.agency',
    linkedin: 'https://linkedin.com/company/desora-agency',
    facebook: 'https://facebook.com/desora.agency',
  },

  // PLACEHOLDER: confirm real city/office presence before publishing on Contact/footer.
  location: 'Maroc',
} as const;
