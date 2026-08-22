/**
 * Central place for business-identity values that are still placeholders.
 * Replace these with DESORA's real details before launch — search the repo
 * for "PLACEHOLDER" to find every dependent usage.
 */
export const siteConfig = {
  name: 'DESORA',
  tagline: 'Beyond Ordinary Brands',
  domain: 'https://www.desora.net',

  email: 'desoragency@gmail.com',

  // WhatsApp Business number in E.164 (local 0687554060 → +212 687554060).
  whatsappNumber: '212687554060',
  get whatsappUrl() {
    return `https://wa.me/${this.whatsappNumber}`;
  },
  whatsappUrlWithMessage(message: string) {
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
  },

  social: {
    instagram: 'https://www.instagram.com/desoragency/',
    // PLACEHOLDER: confirm real LinkedIn company page.
    linkedin: 'https://linkedin.com/company/desora-agency',
    facebook: 'https://www.facebook.com/profile.php?id=100082532402499',
  },

  // PLACEHOLDER: confirm real city/office presence before publishing on Contact/footer.
  location: 'Maroc',
} as const;
