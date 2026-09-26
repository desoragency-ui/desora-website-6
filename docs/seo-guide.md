# DESORA: SEO, GEO and AEO owner guide

What is already done in the code, what you do in dashboards, and what only you can supply.
Site: https://www.desora.net

---

## 1. Already done on the site (nothing to do)

| Area | What is live |
|---|---|
| Crawling | `robots.txt` (all search engines and AI crawlers allowed), sitemap with 57 pages, `llms.txt` for AI assistants |
| Duplicates | `desora.net` and `/page/` both redirect (308) to the one real URL `https://www.desora.net/page` |
| Structured data | Organization, WebSite, WebPage, Breadcrumbs on every page; Service + FAQ on services; BlogPosting on posts; Article on case studies |
| Sharing | Every page has a 1200x630 preview image, title and description for WhatsApp, LinkedIn, Facebook, X |
| On-page | One H1 per page, unique titles and descriptions in FR, EN and AR |
| AI answers | Every blog post opens with an "In short" box that answer engines can quote |
| Bing / ChatGPT | IndexNow: each deploy tells Bing which pages changed |

Everything regenerates on each deploy. A new article is added to the sitemap, llms.txt and IndexNow automatically.

---

## 2. Google Search Console (https://search.google.com/search-console)

**Once**
1. **Property type.** Top-left selector must show `desora.net` (Domain property). If it shows `https://desora.net/`, add a new property, choose **Domain**, enter `desora.net`, verify with the DNS TXT record.
2. **Sitemaps.** Keep only `sitemap-index.xml`. Remove `/robots.txt` and `/llms.txt` (⋮ > Remove sitemap). Never resubmit it.
3. **Request indexing** for the key pages (URL Inspection bar at the top > paste URL > Request indexing). Google allows about 10 a day:
   - Day 1: `/fr`, `/en`, `/ar`, `/fr/services/creation-site-web`, `/fr/services/publicite-meta-ads`, `/fr/services/seo`, `/fr/services/identite-de-marque`, `/fr/services/generation-de-leads`, `/fr/services/reseaux-sociaux`, `/fr/services/email-marketing`
   - Day 2: `/fr/a-propos`, `/fr/contact`, `/fr/blog`, the 3 French case studies, the 3 French blog posts
   - Day 3: the English and Arabic service pages
4. **Link Google Analytics.** GA4 > Admin > Product links > Search Console links > Link > pick `desora.net`.
5. **Users.** Settings > Users and permissions: add anyone who should see reports.

**Weekly (10 minutes)**
- **Pages** report: "Indexed" should grow toward 57. "Crawled / Discovered, currently not indexed" is normal for a new site in the first weeks.
- **Performance** report: look at *Queries*. Any query with impressions but position 8 to 20 is a page to strengthen, or a new article to write.
- **Enhancements** (left menu, appears within 1 to 2 weeks): Breadcrumbs must show 0 invalid items.
- **Settings > robots.txt**: should list `https://www.desora.net/robots.txt` as Fetched.

**Each new article**: after it goes live, URL Inspection > Request indexing. Optional, it only speeds things up.

---

## 3. Bing Webmaster Tools (feeds ChatGPT search and Copilot)

1. https://www.bing.com/webmasters > sign in > **Import from Google Search Console**. No extra verification.
2. Check **Sitemaps** lists `https://www.desora.net/sitemap-index.xml`.
3. After the next deploy, **IndexNow** (left menu) shows the URLs the site submitted automatically.

---

## 4. Google Business Profile (the biggest local lever)

https://business.google.com
1. Business name: `DESORA` (exactly, no keywords added: stuffing the name gets profiles suspended).
2. Category: **Marketing agency**. Secondary: *Internet marketing service*, *Website designer*, *Advertising agency*.
3. **Service-area business**: hide the street address if clients do not visit you, list the cities you really serve.
4. Phone: +212 702 243 374. Website: `https://www.desora.net/fr`.
5. Description: reuse the home page description. Add services, opening hours, logo, cover, 10+ real work photos.
6. **Reviews**: ask Fastway, Wolcons and Centre Dentaire Messnana for a Google review, and answer every review.
7. Post an update every 2 weeks (a new project, a new article).

Once the profile exists, send me its link: it goes into the site's structured data (`sameAs`).

---

## 5. Off-site: what makes AI assistants recommend you

ChatGPT, Perplexity and Gemini recommend businesses that are *described consistently in many independent places*.
- Same name, phone, email, one-sentence description everywhere.
- Create or complete: **LinkedIn company page**, **Clutch**, **Sortlist**, **GoodFirms**, **DesignRush** (agency directories that AI tools read), and Moroccan directories such as **Telecontact** and **Kerix**.
- Get mentioned: guest articles, interviews, client case studies published on the client's side, local press.
- Ask happy clients to name DESORA when they talk about their project online.

---

## 6. What only you can provide (send these to me)

| # | Item | Why it matters |
|---|---|---|
| 1 | **Founder's full name, photo, 3-line bio, personal LinkedIn** | Named expert = E-E-A-T. Becomes the article author and a `Person` in structured data |
| 2 | **City** (and street address if clients can visit) | Local SEO, `LocalBusiness` markup, matches Google Business Profile |
| 3 | **Real LinkedIn company page URL** | The one in the config is unconfirmed, so it is left out |
| 4 | **Legal details**: company name, legal form, ICE, RC, registered address | The "Mentions légales" page still shows placeholders: a trust signal for users and Google |
| 5 | **Google Business Profile link** (after step 4) | Added to `sameAs`, ties the site to the map listing |
| 6 | **Real client quotes** with permission (name, role) | Testimonials and reviews are never invented on this site |
| 7 | **Real numbers you can prove** (results, projects delivered, years active) | Specific facts are what AI answers quote |
| 8 | **Directory profile links** once created (Clutch, Sortlist...) | Added to `sameAs` |

---

## 7. Rhythm that ranks

- 2 new articles a month, each in FR, EN and AR, each answering one real search query.
- Refresh an old article every month (new facts, new date).
- Internal link from every new article to the matching service page.
- Check Search Console weekly, Bing monthly.
