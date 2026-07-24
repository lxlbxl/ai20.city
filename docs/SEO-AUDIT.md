# SEO Audit — eu.ai20.city + us.ai20.city

> **STATUS 2026-07-24:** the code-side findings below are now FIXED in the
> build (see `docs/LOCAL-SEO-STRATEGY.md`). Remaining work is server-side
> (HTTPS 301 + Tier C 301s, both in `docs/DEPLOY-VPS.md`) and asset creation
> (favicon/OG images). Fixed: scaled thin content (2,486 -> 86 indexable URLs),
> robots.txt/sitemap (were stale + pointing at a 404), JS-only internal links
> (homepage 9 -> 35 anchors, offers.html 1 -> 71).

**Audited:** 2026-07-24, against the live deployment (nginx VPS).
Both regions run the same codebase, so unless stated otherwise **every finding
applies to both**. Counts differ only in page volume.

## Verdict

The regional architecture itself is clean — canonicals, hreflang, sitemap
isolation and TLS are all correct, which is the hard part and it's done right.

The risk is **content strategy, not plumbing**. 98% of the indexable surface is
near-duplicate programmatic location pages on a brand-new domain. That single
issue outweighs everything else in this document.

---

## P0 — Critical

### 1. Scaled near-duplicate content (98% of the site)

| | US | EU |
|---|---|---|
| Total sitemap URLs | 2,486 | 2,546 |
| Location pages | **2,440 (98.1%)** | ~2,500 |
| Real service/offer pages | 30 | 30 |
| Industry pages | 6 | 5 |

Measured on live pages:

- `locations/austin.html` and `locations/dallas.html` — **200 words each**,
  **100% token overlap** once the city name is normalised. Literally the same
  page with a find-and-replace.
- Deep niche pages (`locations/austin/hvac/`) — 355 words, same template.

Titles *are* unique (`AI Agency Austin`, `AI for HVAC in Dallas`), which is good,
but the body is identical. This is the definition of doorway pages, and it sits
squarely inside Google's **scaled content abuse** policy (March 2024 spam
update). On a domain with no authority or backlink profile, the realistic
outcome is not "these pages rank a bit worse" — it's sitewide suppression or
mass deindexing that drags the 30 pages you actually care about down with it.

**Recommendation — pick one:**

- **(a) Prune hard (recommended).** Ship 20–40 genuinely differentiated city
  pages for markets you actually serve. Each needs real local substance: named
  local clients or case studies, local regulations, local pricing, local team,
  local partners. `noindex` the rest, or drop them from the sitemap and let them
  404/410.
- **(b) Keep the volume but earn it.** Requires unique research/data per city —
  realistically not viable at 2,400 pages.
- **(c) Interim, do this today regardless:** remove the `locations/*/*` niche
  tier from the sitemap and `noindex` it, keeping only the top-level city pages.
  Cuts indexable surface ~10x while you decide.

The 30 offer/service pages are strong, genuinely differentiated, and
region-aware. They are the asset. Don't let 2,400 template pages bury them.

### 2. HTTP serves 200 — no HTTPS redirect

```bash
curl -sI http://us.ai20.city/   # → HTTP/1.1 200 OK  (should be 301)
```

Every URL is reachable on both `http://` and `https://`, duplicating the entire
site. It also silently defeats the HSTS header already being sent.

**Fix (nginx, all three vhosts):**

```nginx
server {
    listen 80;
    server_name ai20.city www.ai20.city eu.ai20.city us.ai20.city;
    return 301 https://$host$request_uri;
}
```

---

## P1 — High

### 3. robots.txt points every region at a 404 sitemap

Both `eu.ai20.city/robots.txt` and `us.ai20.city/robots.txt` contain:

```
Sitemap: https://ai20.city/sitemap.xml     # ← 404, apex has no sitemap
```

Each region must advertise **its own** sitemap. The apex has neither robots.txt
nor sitemap.xml (both 404).

**Fix** — per-region `robots.txt`:

```
User-agent: *
Allow: /
Sitemap: https://us.ai20.city/sitemap.xml     # eu.ai20.city on the EU build
```

Apex `robots.txt`:

```
User-agent: *
Allow: /
Sitemap: https://eu.ai20.city/sitemap.xml
Sitemap: https://us.ai20.city/sitemap.xml
```

> Note: `robots.txt` is currently a server-side file, not in the repo. Better to
> generate it per region alongside the sitemap so it can't drift again.

### 4. Every brand and social asset 404s

| Asset | Status | Referenced by |
|---|---|---|
| `/assets/og-image.jpg` | **404** | OG + Twitter cards, all pages |
| `/assets/og-services.jpg` | **404** | offers.html |
| `/assets/logo.png` | **404** | `ProfessionalService` schema `image` |
| `/favicon.ico` | **404** | browsers |

Every LinkedIn/X/Slack share renders a blank card — on precisely the channel a
B2B consultancy relies on for distribution. The schema `image` pointing at a 404
also weakens rich-result eligibility. Cheap, high-leverage fix.

### 5. Homepage `<h1>` is just the logotype

The only `<h1>` on the homepage is **"ai20"**. The actual positioning line
("Your AI Workforce, Institutionalized" / "Intelligence, Institutionalized") is
a `<p>`, and the subhead carrying every commercial keyword is also a `<p>`.

The single strongest on-page signal on the most important page is spent on a
two-character brand token.

**Fix:** promote the tagline to `<h1>` (keep the logotype visually as-is via a
`<span>`/`aria-label`), or make the `<h1>` the positioning statement and demote
the wordmark to a `<div>`. Purely a markup change — no visual impact.

### 6. Internal linking depends on JavaScript

Raw HTML anchor counts on the live site:

| Page | Anchors in raw HTML |
|---|---|
| `/` (homepage) | 9 |
| `/offers.html` | **1** |

The header nav, the footer, and the **entire 22-offer grid** are injected
client-side (`components.js`, `services.js`). So in raw HTML your 30 commercial
pages are effectively orphaned — discoverable only via sitemap.

Googlebot does render JS, but rendering is deferred and budgeted; on a new
domain with 2,400+ other URLs competing for crawl, the pages you most want
crawled are the ones behind the render queue. Internal links are also how
PageRank flows — none of it is flowing right now.

**Fix:** server-render the offer grid at build time (you already do exactly this
for the verticals grid, case studies and marquee via `vite-plugin-region.js` —
add a `%%OFFER_GRID%%` token the same way), and emit the header/footer nav as
static HTML with JS only for the mobile toggle and region switcher.

---

## P2 — Medium

### 7. Payload: 365 KB icon library for ~6 icons

| Asset | Size |
|---|---|
| `assets/lucide.js` | **365 KB** |
| `assets/data.js` | 28 KB |
| `assets/components.js` | 25 KB |
| `assets/modal-quiz.js` | 21 KB |
| `assets/style.css` | 51 KB |

~490 KB uncompressed on every page, dominated by shipping the *entire* Lucide
set to render a handful of icons. Icons also paint late, causing layout shift.

**Fix:** import only the icons used (`import { Activity, Scale } from 'lucide'`)
or inline them as SVG. Should drop ~350 KB sitewide. Direct Core Web Vitals win
(LCP + CLS), which is a ranking factor.

### 8. Apex chooser has no OG tags

`region-select.html` has no `og:*` or `twitter:*` tags, so shares of the bare
`ai20.city` domain — the URL people will paste most — render with no preview.

---

## What's already correct

Worth stating, because these are the things usually broken in a multi-region setup:

- **hreflang** — reciprocal `en-gb` / `en-us` / `x-default` clusters on all three hosts.
- **Canonicals** — self-referential and host-correct per region.
- **Sitemaps** — host-correct, region-isolated (no cross-region URL leakage), and correctly exclude `admin.html` and `region-select.html`.
- **Region isolation** — zero EU copy in the US build; currency, verticals and compliance framing all switch cleanly.
- **TLS** — valid Let's Encrypt cert covering all four SANs.
- **Titles** — unique across the location tier.
- **Apex** — `index,follow` with self-canonical and `x-default`; correct role.

---

## Suggested order of work

1. HTTPS 301 redirect *(nginx, minutes)*
2. Per-region robots.txt + apex robots.txt *(minutes)*
3. Add favicon + OG images *(design asset, then minutes)*
4. Homepage `<h1>` fix *(minutes)*
5. **Decide the location-page strategy** — biggest lever by far
6. Server-render offer grid + nav links
7. Tree-shake Lucide
