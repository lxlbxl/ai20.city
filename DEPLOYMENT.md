# Deployment Strategy

ai20 ships from **one repository** as **three deployments**, driven by a single
`REGION` environment variable. The neutral apex routes visitors; each region is
a full build of the same code with its own currency, copy, verticals, pricing,
and city pages.

| Deployment | Host | `REGION` | Serves |
|---|---|---|---|
| Apex (chooser) | `ai20.city` / `www.ai20.city` | _unset_ | `region-select.html` as `/` + edge geo routing |
| Europe | `eu.ai20.city` | `eu` | Full EU site (EUR, GDPR/EU AI Act, 41 EU cities) |
| United States | `us.ai20.city` | `us` | Full US site (USD, HIPAA/SOC2/TCPA, ~40 US metros) |

Everything region-specific lives in `src/data/*.json` and flows through
`src/js/region-config.js` (runtime) and `region_config.py` (generators). See
`docs/ROUTER-STRATEGY.md` and `docs/US-MARKET-PRD.md` for the full rationale.

## How the build works

`package.json` runs the Python generators before Vite, all region-aware via the
`REGION` env var:

```json
"build": "python generate_locations.py && python generate_offers.py && python generate_sitemap.py && vite build"
```

- `generate_locations.py` — city, industry, core-service, and local-niche pages for the region's cities.
- `generate_offers.py` — a full detail page for every offer (region pricing, value stack, DIY/DWY/DFY, ROI, guarantee, funnel CTA).
- `generate_sitemap.py` — region-host-correct sitemap.
- `vite-plugin-region.js` — at build time rewrites the host in canonical/OG URLs, injects the `hreflang` cluster, and replaces `%%TOKENS%%` from `regions.json`.

The generated `locations/`, `services/*` offer pages, `sitemap.xml`, and `dist/`
are **not committed** — they are regenerated per region at deploy time.

## Deploying (Vercel / Netlify / Cloudflare Pages)

Create **three projects/sites** from this same repo:

1. **`eu.ai20.city`** — Build command `npm run build`, output `dist`, env `REGION=eu`.
2. **`us.ai20.city`** — Build command `npm run build`, output `dist`, env `REGION=us`.
3. **`ai20.city` (apex)** — Build command `npm run build`, output `dist`, no `REGION` (defaults to `eu` for the bundle, but the apex only serves the neutral chooser). Configure the platform to serve `region-select.html` at `/` (e.g. a redirect/rewrite of `/` → `/region-select.html`).

Common settings for all three:
- Framework preset: **Vite**
- Python 3 must be available in the build image (standard on Vercel/Netlify/CF).

### Edge geo routing (apex only)

`functions/_middleware.js` is a Cloudflare Pages Function. It is a no-op on the
subdomains and only acts on the apex:
- Honors a prior `ai20_region` cookie with a fast 302 to that subdomain.
- Otherwise sets a soft `ai20_geo` hint cookie from the visitor's country, which
  `region-select.html` uses to highlight the suggested region (never forced).

The `ai20_region` cookie is written on the `.ai20.city` parent domain so the
choice — and the in-site `US | EU` header switcher — persists across subdomains.

For **Vercel**, use `middleware.ts` reading `geo.country` from `@vercel/functions`
instead; for **Netlify**, an Edge Function reading `context.geo.country`. Same
logic, same cookie names.

## Running locally

```bash
REGION=us npm run build   # or REGION=eu; unset defaults to eu
npm run preview
```

For the dev server (`npm run dev`), the region defaults to `eu`; set `REGION`
to preview the US build. The `US | EU` switcher reloads in place during local dev
(it only cross-navigates subdomains in production).

### Note on Windows
The generators print only ASCII, and are UTF-8 safe. The build itself is
platform-agnostic; production builds run on the host's Linux image.
