/**
 * IndexNow ping, run after every production build on Vercel (npm "postbuild").
 *
 * Tells Bing (and through it ChatGPT search and Copilot), Yandex, Seznam and
 * Naver which pages changed, so they recrawl in minutes instead of waiting for
 * their next sitemap visit. Google does not use IndexNow; it reads the sitemap.
 *
 * Only pages whose visible content changed since the last deploy are sent:
 * a hash of each page's <main> is kept in the Vercel build cache
 * (node_modules/.cache). If that cache is gone, every page is sent once, which
 * IndexNow accepts. Nothing here can fail the build: any error is logged and
 * the script exits 0.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const KEY = '3927eb5441a269bd825c5fa91c31a88f';
const HOST = 'www.desora.net';
const SITE = `https://${HOST}`;
const CACHE = path.join('node_modules', '.cache', 'indexnow.json');

async function main() {
  if (process.env.VERCEL_ENV !== 'production') {
    console.log('[indexnow] not a production deploy, skipped');
    return;
  }

  const sitemap = readFileSync('dist/sitemap-0.xml', 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  const previous = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};
  const current = {};
  const changed = [];

  for (const url of urls) {
    const rel = new URL(url).pathname.replace(/^\//, '');
    const file = path.join('dist', rel, 'index.html');
    if (!existsSync(file)) continue;
    const html = readFileSync(file, 'utf8');
    const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
    const hash = createHash('sha1').update(main).digest('hex');
    current[url] = hash;
    if (previous[url] !== hash) changed.push(url);
  }

  if (!changed.length) {
    console.log('[indexnow] no content changes, nothing sent');
  } else {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: changed }),
    });
    console.log(`[indexnow] sent ${changed.length} URL(s), HTTP ${res.status}`);
    if (!res.ok && res.status !== 202) return; // keep old hashes so they are retried next deploy
  }

  mkdirSync(path.dirname(CACHE), { recursive: true });
  writeFileSync(CACHE, JSON.stringify(current));
}

main().catch((err) => console.log('[indexnow] skipped:', err.message));
