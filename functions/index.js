/**
 * Cloudflare Pages Function for the bare root, `https://desora.net/`.
 *
 * Astro can only emit ONE static redirect for `/`, which is why the root used to
 * dump every visitor on `/fr` regardless of who they were. This function reads
 * the request instead and sends each visitor to the language they actually read,
 * falling back to French (the Moroccan default) when nothing matches.
 *
 * Precedence, highest first:
 *   1. `?lang=xx`            explicit override, also persists the choice
 *   2. `desora-lang` cookie  a language the visitor picked on a previous visit
 *   3. `Accept-Language`     the browser's own ranked preference, q-values honoured
 *   4. `fr`
 *
 * Only `/` is handled here. Every other route is a static Astro page, so nothing
 * else pays for this hop.
 */

const LOCALES = ['fr', 'en', 'ar'];
const DEFAULT_LOCALE = 'fr';
const COOKIE = 'desora-lang';

/** Map a BCP-47 tag onto one of our locales. `en-GB` -> `en`, `ar-MA` -> `ar`. */
function normalize(tag) {
  const base = String(tag || '').trim().toLowerCase().split('-')[0];
  return LOCALES.includes(base) ? base : null;
}

/**
 * Parse `Accept-Language` and return the best supported locale.
 * Handles quality values, so `ar;q=0.9, en;q=1.0` correctly prefers English.
 */
function fromAcceptLanguage(header) {
  if (!header) return null;
  const ranked = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.split(';').map((s) => s.trim());
      const q = params
        .map((p) => /^q=([\d.]+)$/i.exec(p))
        .find(Boolean);
      return { locale: normalize(tag), q: q ? parseFloat(q[1]) : 1 };
    })
    .filter((entry) => entry.locale && isFinite(entry.q) && entry.q > 0)
    .sort((a, b) => b.q - a.q);

  return ranked.length ? ranked[0].locale : null;
}

function fromCookie(header) {
  if (!header) return null;
  const match = /(?:^|;\s*)desora-lang=([^;]+)/.exec(header);
  return match ? normalize(decodeURIComponent(match[1])) : null;
}

export const onRequestGet = ({ request }) => {
  const url = new URL(request.url);

  const explicit = normalize(url.searchParams.get('lang'));
  const locale =
    explicit ||
    fromCookie(request.headers.get('cookie')) ||
    fromAcceptLanguage(request.headers.get('accept-language')) ||
    DEFAULT_LOCALE;

  const target = new URL(`/${locale}`, url.origin);

  const headers = new Headers({
    Location: target.toString(),
    // The chosen language varies by request header, so shared caches must not
    // serve one visitor's redirect to the next.
    Vary: 'Accept-Language, Cookie',
    'Cache-Control': 'no-store',
  });

  if (explicit) {
    headers.append(
      'Set-Cookie',
      `${COOKIE}=${explicit}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`
    );
  }

  return new Response(null, { status: 302, headers });
};
