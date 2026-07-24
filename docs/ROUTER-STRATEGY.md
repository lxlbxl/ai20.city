# ai20 — Region Router Strategy (Neutral Apex → US / EU)

**Goal:** `ai20.city` becomes a neutral entry point. Visitors either self-select or are gently routed to `eu.ai20.city` (existing EU business) or `us.ai20.city` (new US business). Choice must persist across subdomains and be SEO-safe.

---

## 1. Current state (what we're routing on top of)

| Layer | Reality today |
|---|---|
| Frontend | Static **Vite MPA** — every `*.html` is a Rollup input. Vanilla JS injects header/footer via `src/js/components.js`. React exists **only** in `src/admin/` (separate dashboard SPA). |
| Content gen | `generate_locations.py` builds **41 European city pages** + `generate_sitemap.py` at build time. Runs before `vite build`. |
| Backend | PHP + SQLite (`backend/api/*.php`) — leads, auth, roadmap gen. Vite proxies `/backend/api`. |
| Hosting | Vercel / Netlify / Cloudflare Pages, output `dist/`. |
| Region logic | **None exists.** Everything is hardcoded EU: title "AI Strategy Europe", `geo.region DE-BE`, EUR pricing, GDPR/EU AI Act framing, canonical → `ai20.city`. |

**Implication:** there is no "region" concept in the code yet. The cleanest path is to introduce one **build-time flag** rather than forking the repo.

---

## 2. Recommended approach — **one repo, region baked in at build, neutral apex chooser**

Do **not** fork the codebase into two repos (drift nightmare) and do **not** try to serve both regions from one build with runtime branching everywhere (SEO + complexity cost). Instead:

### 2.1 Parametrize the build with a `REGION` env var

```
REGION=eu  npm run build   →  deploy to  eu.ai20.city
REGION=us  npm run build   →  deploy to  us.ai20.city
(neutral)  npm run build   →  deploy to  ai20.city   (apex chooser only)
```

A single `src/js/region-config.js` (and a Python equivalent for the generators) holds everything that differs:

| Key | EU | US |
|---|---|---|
| `host` | `eu.ai20.city` | `us.ai20.city` |
| `currency` / symbol | EUR `€` | USD `$` |
| `locale` / hreflang | `en-GB` (+ `en`) | `en-US` |
| `cities` | 41 EU cities | US metros (see PRD) |
| `geo meta` | Berlin / DE-BE | e.g. Austin / US-TX (or none) |
| `compliance copy` | GDPR, EU AI Act | HIPAA / SOC 2 / CCPA / TCPA |
| `verticals` | 5 EU | 6–8 US (see PRD) |
| `offers pricing` | EUR table | USD table |

`generate_locations.py` already emits EU cities — gate the city list on `REGION` and reuse the same template engine for US metros. This is a **small, contained change**, not a rewrite.

### 2.2 The neutral apex (`ai20.city`)

A lightweight standalone `index.html` (its own tiny build, no verticals/pricing) that:

1. **Suggests** a region from an edge geo header — never hard-locks it.
2. Shows an explicit **US / EU chooser** (two large editorial cards, on-brand).
3. On choice, sets a cookie on the parent domain and redirects.

```js
// apex index — geo *suggestion* + manual choice, cookie shared across subdomains
const saved = getCookie('ai20_region');            // sticky choice wins
if (saved) location.replace(`https://${saved}.ai20.city`);

// else: highlight suggested card from edge header (CF-IPCountry / x-vercel-ip-country),
// but require a click. On click:
function choose(region){                            // 'us' | 'eu'
  document.cookie = `ai20_region=${region};domain=.ai20.city;path=/;max-age=31536000;secure;samesite=Lax`;
  location.href = `https://${region}.ai20.city`;
}
```

> Cookie domain `.ai20.city` is the key detail — it makes the choice persist when the user moves between `us.` and `eu.` subdomains.

### 2.3 Persistent switcher in the header

Add a small `US | EU` toggle to the injected header (`components.js`). It writes the same `.ai20.city` cookie and cross-navigates, so a US visitor can jump to EU and stay there. This ships once, works on both subdomain builds.

### 2.4 Edge geo detection (host-specific, optional but recommended)

Pick based on where you actually deploy:

- **Cloudflare Pages** → a Pages Function / Worker reading `request.cf.country` (or `CF-IPCountry`).
- **Vercel** → Edge Middleware reading `x-vercel-ip-country` (`geo.country`).
- **Netlify** → Edge Function reading `context.geo.country`.

Rule: **suggest, don't force.** Geo-IP is wrong often enough (VPNs, travelers, EU HQ buying for US ops) that a hard redirect frustrates real buyers and can hurt SEO if bots get bounced. Redirect only when a cookie exists; otherwise show the chooser with the suggested region pre-highlighted.

### 2.5 SEO — avoid duplicate-content penalties

The two subdomains will share a lot of structure, so:

- **Per-region canonicals**: EU pages canonical to `eu.ai20.city/...`, US to `us.ai20.city/...`.
- **hreflang cluster** on every equivalent page:
  ```html
  <link rel="alternate" hreflang="en-gb" href="https://eu.ai20.city/services.html">
  <link rel="alternate" hreflang="en-us" href="https://us.ai20.city/services.html">
  <link rel="alternate" hreflang="x-default" href="https://ai20.city/">
  ```
- **Separate sitemaps** per subdomain (extend `generate_sitemap.py` to emit host-correct URLs).
- Differentiate content enough (currency, verticals, compliance framing, city pages) that Google treats them as genuinely regional — which they are.
- Apex `ai20.city` = `x-default`, thin chooser page, `noindex` optional or minimal.

---

## 3. Why this over the alternatives

| Option | Verdict |
|---|---|
| **Two forked repos** | ❌ Guaranteed drift; every shared fix done twice. |
| **Pure client-side redirect only** (no build flag) | ❌ Flash of wrong content, weak SEO, currency/copy can't truly diverge. |
| **Path prefixes `/us` `/eu` on one domain** | ❌ You explicitly want subdomains; also weaker regional SEO signal than subdomains. |
| **✅ One repo + `REGION` build flag + neutral apex chooser + shared cookie** | Minimal code change, clean SEO, no drift, fits existing Vite + Python pipeline. |

---

## 4. Implementation checklist — ✅ BUILT

- [x] `src/data/{regions,offers,cities}.json` — single source of truth for both runtime and generators.
- [x] `src/js/region-config.js` + `region_config.py` (shared per-region values + price scaling).
- [x] `REGION` read in `vite.config.js`; exposed via `define` (`import.meta.env.VITE_REGION`).
- [x] `vite-plugin-region.js` — host rewrite + hreflang injection + `%%TOKEN%%` replacement at build.
- [x] Region-aware `index.html`, `offers.html`, `about.html`, `components.js` (header/footer), `data.js`.
- [x] `generate_locations.py` gated on `REGION`; US metro list added (`cities.json`).
- [x] `generate_offers.py` — full region-aware detail page for every offer.
- [x] `generate_sitemap.py` host-aware; hreflang emitted on all pages.
- [x] Neutral apex chooser `region-select.html` (own deploy target).
- [x] `US | EU` switcher in header, cookie on `.ai20.city` (`switchRegion` in region-config).
- [x] Edge geo suggestion: `functions/_middleware.js` (Cloudflare Pages; Vercel/Netlify notes in DEPLOYMENT.md).
- [x] 3 deploy targets documented in `DEPLOYMENT.md`: apex (no `REGION`), `REGION=eu`, `REGION=us`.
- [x] QA: full US + EU builds pass; zero stray tokens; hreflang + canonicals + USD/EUR pricing verified.

---
*Companion doc: `docs/US-MARKET-PRD.md` — business model, offers, and verticals for the US build.*
