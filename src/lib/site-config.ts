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

  /**
   * Google Apps Script Web App that receives the brief quiz.
   *
   * It owns the spreadsheet write, the Drive upload and the WhatsApp
   * notification, which keeps every credential inside the DESORA Google
   * account. Nothing secret is shipped in the browser bundle: this URL is a
   * public write-only endpoint, exactly like a form action.
   *
   * Paste the deployment URL here after running the setup in
   * apps-script/README.md. While it is empty the quiz still runs and simply
   * shows its "could not send" panel with the WhatsApp fallback.
   */
  quizEndpoint:
    'https://script.google.com/macros/s/AKfycbyeD1WTE5C0c54Fl0ky2FGv1cqtwu44NxQr4oG7E6uHnTqjGAIR-UgjNAN7AypWAKTLpQ/exec',
} as const;
