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
const offersData = JSON.parse(fs.readFileSync(path.join(DATA, 'offers.json'), 'utf-8'));

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


/* ---------------------------------------------------------------------------
 * Server-rendered chrome.
 *
 * The nav, footer and offer grid used to be injected client-side by
 * components.js / services.js, so the raw HTML carried only 9 anchors on the
 * homepage and 1 on offers.html - every commercial page was effectively
 * orphaned for crawlers. Rendering them at build time makes all internal links
 * crawlable; the JS now only binds behaviour.
 * ------------------------------------------------------------------------- */

function regionSwitcher(cfg, idSuffix, dark) {
    idSuffix = idSuffix || '';
    var border = dark ? 'border-[#f4f1ea]/30' : 'border-[#050505]/20';
    var buttons = Object.values(regionsData.regions)
        .map(function (r) {
            var active = r.key === cfg.key;
            var activeCls = dark ? 'bg-[#f4f1ea] text-[#050505]' : 'bg-[#050505] text-[#f4f1ea]';
            var idleCls = dark ? 'text-[#f4f1ea]/70' : 'text-[#050505]/60';
            var cls = active ? activeCls : idleCls + ' hover:text-[#ff3300]';
            return '<button data-region="' + r.key + '" aria-label="Switch to ' + r.label +
                '" class="px-3 py-1.5 transition-colors ' + cls + '">' + r.shortLabel + '</button>';
        })
        .join('');
    return '<div id="region-switcher' + idSuffix + '" class="flex items-center border ' + border +
        ' rounded-full overflow-hidden text-[10px] uppercase tracking-widest font-sans-tech">' + buttons + '</div>';
}

var NAV_LINKS = [
    ['./services.html', 'Expertise'],
    ['./offers.html', 'Offers'],
    ['./locations.html', 'Markets'],
    ['./case-studies.html', 'Case Studies'],
    ['./about.html', 'About'],
];

function headerHtml(cfg) {
    var desktop = NAV_LINKS.map(function (x) {
        return '<a href="' + x[0] + '" class="hover:text-[#ff3300] transition-colors">' + x[1] + '</a>';
    }).join('\n    ');

    var mobileLinks = NAV_LINKS.concat([['./contact.html', 'Contact']]);
    var mobile = mobileLinks.map(function (x, i) {
        return '<a href="' + x[0] + '" class="mobile-link block font-serif-display text-5xl md:text-7xl opacity-0 translate-x-[-20px] transition-all duration-500 delay-[' +
            (i * 50) + 'ms] hover:text-[#ff3300] hover:italic">' + x[1] + '</a>';
    }).join('\n             ');

    return '<nav class="fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-6 transition-all duration-500 flex justify-between items-center bg-[#f4f1ea]/90 backdrop-blur-sm" id="main-nav">\n' +
'  <a href="./index.html" class="flex items-center gap-3 group cursor-pointer z-[101]">\n' +
'    <div class="w-3 h-3 bg-[#ff3300] rotate-45 group-hover:rotate-0 transition-transform duration-500"></div>\n' +
'    <span class="font-serif-display text-2xl md:text-3xl tracking-tight font-medium italic text-[#050505]">ai20.</span>\n' +
'  </a>\n' +
'  <div class="hidden md:flex gap-10 font-sans-tech text-xs tracking-[0.2em] uppercase font-medium">\n    ' + desktop + '\n  </div>\n' +
'  <div class="flex items-center gap-4 z-[101]">\n' +
'    <div class="hidden md:block">' + regionSwitcher(cfg) + '</div>\n' +
'    <a href="./quiz.html" class="hidden md:block px-6 py-2 bg-[#ff3300] text-white text-[10px] uppercase tracking-widest hover:bg-[#050505] transition-colors duration-300">Free Assessment</a>\n' +
'    <button class="md:hidden flex items-center gap-2 group relative z-50 text-[#050505]" id="mobile-menu-btn" aria-label="Open menu">\n' +
'      <span class="font-sans-tech text-[10px] uppercase tracking-widest font-bold transition-colors duration-300" id="menu-text">Menu</span>\n' +
'      <div class="flex flex-col gap-1.5 w-8">\n' +
'          <div class="w-full h-0.5 bg-current transition-all duration-300 origin-center" id="hamburger-top"></div>\n' +
'          <div class="w-full h-0.5 bg-current transition-all duration-300 origin-center" id="hamburger-bottom"></div>\n' +
'      </div>\n' +
'    </button>\n' +
'  </div>\n' +
'</nav>\n\n' +
'<div id="mobile-menu" class="fixed inset-0 bg-[#050505] text-[#f4f1ea] z-[90] translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] flex flex-col justify-center px-6 md:px-12">\n' +
'    <div class="grid grid-cols-1 w-full max-w-7xl mx-auto gap-8">\n' +
'        <div class="flex flex-col gap-2" id="mobile-links">\n             ' + mobile + '\n        </div>\n' +
'        <div class="border-t border-[#f4f1ea]/10 pt-8 opacity-0 transition-all duration-500 delay-[300ms]" id="mobile-footer">\n' +
'            <div class="flex flex-col gap-4">\n' +
'                <div class="flex items-center justify-between">\n' +
'                    <p class="font-sans-tech text-xs uppercase tracking-widest text-[#ff3300]">Region</p>\n                    ' +
regionSwitcher(cfg, '-mobile', true) + '\n                </div>\n' +
'                <p class="font-serif-display text-2xl opacity-80 max-w-sm">"' + cfg.focusQuote + '"</p>\n' +
'                <a href="./quiz.html" class="mt-4 px-8 py-4 bg-[#ff3300] text-white text-xs uppercase tracking-widest hover:bg-white hover:text-[#050505] transition-colors w-fit">Start Assessment</a>\n' +
'            </div>\n        </div>\n    </div>\n</div>';
}

function footerCol(title, links) {
    return '<div class="flex flex-col gap-6">\n' +
'                    <span class="font-sans-tech text-[10px] uppercase tracking-widest border-b border-[#050505] pb-2 w-fit">' + title + '</span>\n                    ' +
links.map(function (x) {
    return '<a href="' + x[0] + '" class="font-serif-display text-xl italic hover:text-[#ff3300] transition-colors">' + x[1] + '</a>';
}).join('\n                    ') + '\n                </div>';
}

function footerHtml(cfg) {
    return '<footer class="bg-[#f4f1ea] border-t border-[#050505]/10 pt-24 pb-12 px-6 md:px-12">\n' +
'    <div class="max-w-[1400px] mx-auto">\n' +
'        <div class="flex flex-col lg:flex-row justify-between items-start gap-16 mb-24">\n' +
'            <div class="w-full lg:w-1/3">\n' +
'                <h3 class="font-serif-display text-4xl italic mb-6">ai20.</h3>\n' +
'                <p class="font-sans-tech text-sm leading-relaxed max-w-xs opacity-70">' + cfg.footerBlurb + '</p>\n' +
'                <p class="font-sans-tech text-[10px] uppercase tracking-widest opacity-50 mt-6">' + cfg.complianceLine + '</p>\n' +
'            </div>\n' +
'            <div class="grid grid-cols-2 md:grid-cols-4 gap-12 w-full lg:w-2/3">\n                ' +
footerCol('Expertise', [['./services.html', 'All Services'], ['./offers.html', 'Offers'], ['./locations.html', 'Markets']]) + '\n                ' +
footerCol('Company', [['./about.html', 'About'], ['./contact.html', 'Contact'], ['./audit.html', 'AI Audit'], ['./quiz.html', 'Assessment']]) + '\n                ' +
footerCol('Legal', [['./contact.html', 'Privacy'], ['./contact.html', 'Terms'], ['./contact.html', 'Compliance']]) + '\n                ' +
footerCol('Social', [['https://linkedin.com', 'LinkedIn'], ['https://twitter.com', 'Twitter/X']]) + '\n' +
'            </div>\n        </div>\n' +
'        <div class="flex flex-col md:flex-row justify-between items-end border-t border-[#050505]/10 pt-8 font-sans-tech text-[10px] uppercase tracking-widest opacity-40">\n' +
'            <div class="flex flex-col gap-1"><p>&copy; 2026 ai20.</p><p>' + cfg.madeIn + '</p></div>\n' +
'            <p class="mt-4 md:mt-0">All Rights Reserved.</p>\n' +
'        </div>\n    </div>\n</footer>';
}

function round97(v) {
    return Math.round(v / 100) * 100 - 3;
}

function offerGridHtml(cfg) {
    var offers = offersData.offers.filter(function (o) {
        return !o.regions || o.regions.indexOf(cfg.key) !== -1;
    });
    return offers.map(function (o, i) {
        var dfy = o.pricing.dfy;
        var setup = round97(dfy.setup * cfg.priceFactor).toLocaleString('en-US');
        var monthly = round97(dfy.monthly * cfg.priceFactor).toLocaleString('en-US');
        var tags = o.tags.map(function (t) {
            return '<span class="px-2 py-1 border border-[#050505]/20 text-[10px] uppercase tracking-wider rounded-full">' + t + '</span>';
        }).join('');
        var href = './services/' + o.id + '.html';
        return '<div class="group border-b border-[#050505]/10 pb-8 p-6 rounded-sm">\n' +
'  <div class="flex flex-col md:flex-row gap-8 justify-between items-start">\n' +
'    <div class="flex-1">\n' +
'      <div class="flex items-center gap-4 mb-4">\n' +
'        <span class="text-[#ff3300] font-sans-tech text-xs uppercase tracking-widest">' + String(i + 1).padStart(2, '0') + '</span>\n' +
'        <h3 class="font-serif-display text-3xl italic"><a href="' + href + '" class="hover:text-[#ff3300] transition-colors">' + o.title + '</a></h3>\n' +
'      </div>\n' +
'      <p class="font-sans-tech text-sm opacity-70 max-w-xl mb-6 leading-relaxed">' + o.description + '</p>\n' +
'      <div class="flex flex-wrap gap-2 mb-6">' + tags + '</div>\n' +
'    </div>\n' +
'    <div class="w-full md:w-80">\n' +
'      <div class="p-4 bg-[#f4f1ea] border border-[#ff3300]/20 rounded-sm">\n' +
'        <div class="flex flex-col font-sans-tech">\n' +
'          <span class="text-xl font-bold text-[#ff3300]">' + cfg.currency + setup + ' Setup</span>\n' +
'          <span class="text-xs opacity-60">+ ' + cfg.currency + monthly + '/mo</span>\n' +
'        </div>\n      </div>\n' +
'      <a href="' + href + '" class="block text-center mt-4 font-sans-tech text-[10px] uppercase tracking-widest opacity-70 hover:opacity-100 hover:text-[#ff3300] transition-colors">Learn More &rarr;</a>\n' +
'    </div>\n  </div>\n</div>';
    }).join('\n');
}


function coreGridHtml(cfg) {
    return offersData.coreServices.map(function (svc) {
        var amount = svc.price[cfg.key] || svc.price.eu || '';
        var href = './services/' + svc.id + '.html';
        var benefits = svc.benefits.slice(0, 3).map(function (b) {
            return '<li class="flex items-center gap-2 text-xs font-sans-tech opacity-60"><span class="w-1 h-1 bg-[#ff3300] rounded-full"></span> ' + b + '</li>';
        }).join('');
        return '<div class="group border border-[#050505]/10 p-8 hover:bg-[#050505] hover:text-[#f4f1ea] transition-all duration-500 flex flex-col justify-between min-h-[400px]">\n' +
'  <div>\n' +
'    <div class="flex justify-between items-start mb-6">\n' +
'      <span class="font-sans-tech text-[10px] uppercase tracking-widest border border-[#050505] px-2 py-1 rounded-full group-hover:border-[#f4f1ea] transition-colors">' + svc.category + '</span>\n' +
'    </div>\n' +
'    <h3 class="font-serif-display text-4xl italic mb-6 leading-tight"><a href="' + href + '" class="hover:text-[#ff3300] transition-colors">' + svc.title + '</a></h3>\n' +
'    <p class="font-sans-tech text-sm opacity-70 mb-8 leading-relaxed max-w-md">' + svc.description + '</p>\n' +
'    <ul class="space-y-2 mb-8 border-t border-[#050505]/10 group-hover:border-[#f4f1ea]/20 pt-6">' + benefits + '</ul>\n' +
'  </div>\n' +
'  <div class="flex items-center justify-between border-t border-[#050505]/10 group-hover:border-[#f4f1ea]/20 pt-6 mt-auto">\n' +
'    <div class="flex flex-col">\n' +
'      <span class="text-[10px] uppercase tracking-widest opacity-50">' + svc.price.label + '</span>\n' +
'      <span class="font-serif-display text-lg">' + amount + '</span>\n' +
'    </div>\n' +
'    <a href="' + href + '" class="bg-[#ff3300] text-white px-6 py-2 text-[10px] uppercase tracking-widest hover:bg-white hover:text-[#050505] transition-colors">View Logic</a>\n' +
'  </div>\n</div>';
    }).join('\n');
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
        '%%OFFICE_LABEL%%': cfg.officeLabel,
        '%%LOCATIONS_SCHEMA%%': locationsSchema(cfg),
        '%%CASE_STUDIES%%': caseStudiesHtml(cfg.caseStudies),
        '%%OFFER_GRID%%': offerGridHtml(cfg),
        '%%CORE_GRID%%': coreGridHtml(cfg),
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

                // 1b. Server-render the header/footer into their placeholders so
                // every nav link exists in the raw HTML for crawlers.
                out = out.replace(
                    '<div id="header-placeholder"></div>',
                    '<div id="header-placeholder">' + headerHtml(cfg) + '</div>'
                );
                out = out.replace(
                    '<div id="footer-placeholder"></div>',
                    '<div id="footer-placeholder">' + footerHtml(cfg) + '</div>'
                );

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
