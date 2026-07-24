/*
 * region-config.js — single runtime accessor for the active region.
 *
 * REGION is baked in at build time (vite defines import.meta.env.VITE_REGION
 * from process.env.REGION). Everything region-specific — currency, copy,
 * cities, verticals, pricing scale — flows from src/data/*.json through here.
 *
 * The same scaling logic is mirrored in region_config.py for the Python
 * generators. Keep them in sync.
 */

import regionsData from '../data/regions.json';
import citiesData from '../data/cities.json';

export const REGION =
    (import.meta.env && import.meta.env.VITE_REGION) ||
    (typeof globalThis !== 'undefined' && globalThis.__AI20_REGION__) ||
    regionsData.default ||
    'eu';

export const ALL_REGIONS = regionsData.regions;
export const region = regionsData.regions[REGION] || regionsData.regions[regionsData.default];

/** The other region(s) — used for the header switcher + hreflang. */
export function siblingRegions() {
    return Object.values(ALL_REGIONS).filter((r) => r.key !== region.key);
}

/** Round a scaled tier price to a clean `x,x97` point (EU base already ends in 97). */
function round97(value) {
    return Math.round(value / 100) * 100 - 3;
}

/** Round a scaled value-stack figure to the nearest 100. */
function round100(value) {
    return Math.round(value / 100) * 100;
}

/** Scale a base (EUR) tier amount into the active region (raw number). */
export function scaleTierAmount(baseAmount) {
    return round97(baseAmount * region.priceFactor);
}

/** Scale a base (EUR) value-stack figure into the active region (raw number). */
export function scaleValueAmount(baseAmount) {
    return round100(baseAmount * region.valueFactor);
}

/** Format a base (EUR) tier amount into the active region's currency. */
export function fmtPrice(baseAmount) {
    if (baseAmount == null) return '';
    return region.currency + scaleTierAmount(baseAmount).toLocaleString('en-US');
}

/** Format a base (EUR) annual value-stack figure into the active region's currency. */
export function fmtValue(baseAmount) {
    const scaled = round100(baseAmount * region.valueFactor);
    return region.currency + scaled.toLocaleString('en-US');
}

/** Total annual stack value, region-scaled and formatted. */
export function stackTotal(valueStack) {
    const total = valueStack.reduce((sum, v) => sum + v.value, 0);
    return fmtValue(total);
}

/** Pick the region-appropriate string from a { eu, us } map (falls back to eu). */
export function pickRegional(map) {
    if (map == null) return '';
    if (typeof map === 'string') return map;
    return map[region.key] || map.eu || '';
}

/** Cities for the active region. */
export function cities() {
    return citiesData[region.citiesKey] || citiesData.eu;
}

/** Whether an offer is offered in the active region. */
export function offerInRegion(offer) {
    return !offer.regions || offer.regions.includes(region.key);
}

/* ---- Cross-subdomain region switch (cookie shared on .ai20.city) ---- */

export const REGION_COOKIE = 'ai20_region';

export function setRegionCookie(key) {
    const isProd = /ai20\.city$/.test(location.hostname);
    const domain = isProd ? '; domain=.ai20.city' : '';
    document.cookie = `${REGION_COOKIE}=${key}; path=/${domain}; max-age=31536000; SameSite=Lax`;
}

export function getRegionCookie() {
    const m = document.cookie.match(new RegExp('(?:^|; )' + REGION_COOKIE + '=([^;]+)'));
    return m ? m[1] : null;
}

/** Switch the visitor to another region's subdomain, remembering the choice. */
export function switchRegion(key) {
    const target = ALL_REGIONS[key];
    if (!target) return;
    setRegionCookie(key);
    const dev = !/ai20\.city$/.test(location.hostname);
    // In production, cross to the sibling subdomain. In dev, just remember it.
    if (!dev) {
        location.href = `https://${target.host}${location.pathname}`;
    } else {
        location.reload();
    }
}
