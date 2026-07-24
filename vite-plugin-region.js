/*
 * vite-plugin-region.js — bakes the active REGION into every static HTML page
 * at build time so there is no client-side flash and SEO is clean.
 *
 * For each HTML input it:
 *   1. Rewrites the production host (https://ai20.city -> region origin) in
 *      canonical/OG/Twitter/schema URLs.
 *   2. Injects the <link rel="alternate" hreflang> cluster (+ x-default) before
 *      </head>, keyed to the page's own path.
 *   3. Replaces %%TOKENS%% (title, meta, hero copy, geo, marquee, verticals…)
 *      from src/data/regions.json.
 *
 * REGION comes from process.env.REGION (default: regions.json "default").
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, 'src', 'data');

const regionsData = JSON.parse(fs.readFileSync(path.join(DATA, 'regions.json'), 'utf-8'));
const citiesData = JSON.parse(fs.readFileSync(path.join(DATA, 'cities.json'), 'utf-8'));

/** JSON-LD hasPart entries for the region's top hub cities. */
function locationsSchema(cfg) {
    const list = (citiesData[cfg.citiesKey] || []).slice(0, 6);
    return JSON.stringify(
        list.map((c) => ({
            '@type': 'ProfessionalService',
            name: `ai20 ${c.city}`,
            address: {
                '@type': 'PostalAddress',
                addressLocality: c.city,
                addressCountry: c.country,
            },
        })),
        null,
        2
    );
}

export function resolveRegion() {
    const key = (process.env.REGION || regionsData.default || 'eu').toLowerCase();
    return regionsData.regions[key] ? key : regionsData.default;
}

function marqueeHtml(words) {
    const span = (w) =>
        `<span class="text-4xl md:text-6xl font-serif-display italic px-8">${w} <span class="opacity-50 mx-4 font-sans-tech text-sm not-italic tracking-widest uppercase">/</span></span>`;
    // Duplicate the set for a seamless loop.
    return [...words, ...words].map(span).join('\n');
}

function verticalsHtml(verticals) {
    return verticals
        .map(
            (v) => `<a href="./industries/${v.slug}.html"
            class="p-8 border border-[#050505]/10 hover:bg-[#050505] hover:text-[#f4f1ea] transition-all duration-300 group text-center flex flex-col items-center justify-center gap-4 h-48">
            <i data-lucide="${v.icon}" class="opacity-50 group-hover:opacity-100 transition-opacity"></i>
            <span class="font-serif-display text-xl italic">${v.label}</span>
          </a>`
        )
        .join('\n');
}

function caseStudiesHtml(studies) {
    return studies
        .map(
            (s) => `<div class="group border border-[#050505]/10 hover:border-[#ff3300] transition-colors bg-white/30 overflow-hidden">
  <div class="h-48 bg-gradient-to-br from-[#050505]/5 to-[#ff3300]/10 flex items-center justify-center">
    <span class="font-serif-display text-4xl italic opacity-20 px-4 text-center">${s.vertical}</span>
  </div>
  <div class="p-6">
    <span class="font-sans-tech text-[10px] uppercase tracking-widest text-[#ff3300]">${s.vertical}</span>
    <h3 class="font-serif-display text-2xl italic mt-2 mb-4 group-hover:text-[#ff3300] transition-colors">${s.metric}</h3>
    <p class="font-sans-tech text-sm opacity-70 mb-4">${s.body}</p>
    <span class="font-sans-tech text-[10px] uppercase tracking-widest opacity-40 border border-[#050505]/20 px-2 py-1">Illustrative Scenario</span>
  </div>
</div>`
        )
        .join('\n');
}

function hreflangCluster(pagePath) {
    const links = Object.values(regionsData.regions).map(
        (r) => `  <link rel="alternate" hreflang="${r.hreflang}" href="https://${r.host}${pagePath}">`
    );
    links.push(`  <link rel="alternate" hreflang="x-default" href="https://ai20.city${pagePath}">`);
    return links.join('\n');
}

function pagePathFrom(ctx) {
    // ctx.path is like "/index.html", "/services.html", "/services/ai-sdr.html".
    let p = (ctx && ctx.path) || '/index.html';
    p = p.split('?')[0];
    if (p.endsWith('/index.html')) p = p.slice(0, -'index.html'.length); // "/foo/" or "/"
    if (p === '') p = '/';
    return p;
}

export default function regionPlugin() {
    const key = resolveRegion();
    const cfg = regionsData.regions[key];

    const tokens = {
        '%%REGION_KEY%%': cfg.key,
        '%%REGION_LABEL%%': cfg.label,
        '%%HOST%%': cfg.host,
        '%%ORIGIN%%': cfg.origin,
        '%%HTML_LANG%%': cfg.htmlLang,
        '%%LOCALE%%': cfg.locale,
        '%%TITLE%%': cfg.title,
        '%%META_DESC%%': cfg.metaDescription,
        '%%KEYWORDS%%': cfg.keywords,
        '%%CURRENCY%%': cfg.currency,
        '%%PRICE_RANGE%%': cfg.currency.repeat(4),
        '%%HERO_TAGLINE%%': cfg.hero.tagline,
        '%%HERO_SUBHEAD%%': cfg.hero.subhead,
        '%%HERO_EYEBROW_LEFT%%': cfg.hero.eyebrowLeft,
        '%%HERO_EYEBROW_MID%%': cfg.hero.eyebrowMid,
        '%%MARQUEE%%': marqueeHtml(cfg.hero.marquee),
        '%%VERTICALS%%': verticalsHtml(cfg.verticals),
        '%%MARKETS_LABEL%%': cfg.marketsLabel,
        '%%MARKETS_HEADLINE%%': cfg.marketsHeadline,
        '%%MARKETS_BLURB%%': cfg.marketsBlurb,
        '%%COVERAGE_LINE%%': cfg.coverageLine,
        '%%OFFICE_LINE%%': cfg.officeLine,
        '%%LOCATIONS_SCHEMA%%': locationsSchema(cfg),
        '%%CASE_STUDIES%%': caseStudiesHtml(cfg.caseStudies),
        '%%CASE_STUDIES_INTRO%%': cfg.caseStudiesIntro,
        '%%AUDIT_PRICE%%': cfg.auditPrice,
        '%%COMPLIANCE_LINE%%': cfg.complianceLine,
        '%%FOCUS_QUOTE%%': cfg.focusQuote,
        '%%ABOUT_HEADLINE_TOP%%': cfg.about.headlineTop,
        '%%ABOUT_HEADLINE_ACCENT%%': cfg.about.headlineAccent,
        '%%ABOUT_INTRO%%': cfg.about.intro,
        '%%ABOUT_STORY_A%%': cfg.about.storyA,
        '%%ABOUT_STORY_B%%': cfg.about.storyB,
        '%%GEO_REGION%%': cfg.geo.region,
        '%%GEO_PLACENAME%%': cfg.geo.placename,
        '%%GEO_LAT%%': cfg.geo.lat,
        '%%GEO_LNG%%': cfg.geo.lng,
        '%%GEO_STREET%%': cfg.geo.streetAddress,
        '%%GEO_LOCALITY%%': cfg.geo.addressLocality,
        '%%GEO_POSTAL%%': cfg.geo.postalCode,
        '%%GEO_COUNTRY%%': cfg.geo.addressCountry,
        '%%GEO_TEL%%': cfg.geo.telephone,
        '%%CURRENCY_CODE%%': cfg.currencyCode,
    };

    return {
        name: 'ai20-region',
        transformIndexHtml: {
            order: 'pre',
            handler(html, ctx) {
                let out = html;

                // 1. Token replacement.
                for (const [tok, val] of Object.entries(tokens)) {
                    if (out.includes(tok)) out = out.split(tok).join(val);
                }

                // 2. Host rewrite for canonical / OG / schema (skip the neutral apex chooser).
                if (!/region-select\.html$/.test((ctx && ctx.filename) || '')) {
                    out = out.split('https://ai20.city').join(cfg.origin);
                }

                // 3. hreflang cluster (only if not already present and there is a <head>).
                if (!out.includes('hreflang=') && out.includes('</head>')) {
                    out = out.replace('</head>', `${hreflangCluster(pagePathFrom(ctx))}\n</head>`);
                }

                // 4. <html lang> to region.
                out = out.replace(/<html\s+lang="[^"]*"/i, `<html lang="${cfg.htmlLang}"`);

                return out;
            },
        },
    };
}
