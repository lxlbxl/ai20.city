/*
 * data.js — region-aware view models for the offers/services grids.
 *
 * The source of truth is src/data/offers.json (+ regions.json, cities.json),
 * consumed through region-config.js. This module maps that data into the exact
 * shapes the existing renderers in services.js and locations.js expect, so the
 * UI keeps working while currency, pricing, copy, and city lists follow REGION.
 */

import offersData from '../data/offers.json';
import {
    region,
    REGION,
    pickRegional,
    offerInRegion,
    scaleTierAmount,
    scaleValueAmount,
    stackTotal,
    cities as regionCities,
} from './region-config.js';

const currency = region.currency;

/** Core strategic services (region-aware price strings). */
export const coreServices = offersData.coreServices.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    category: s.category,
    benefits: s.benefits,
    price: {
        label: s.price.label,
        amount: pickRegional({ eu: s.price.eu, us: s.price.us }),
    },
}));

/** Productized offers, filtered to the active region and priced for it. */
export const offers = offersData.offers.filter(offerInRegion).map((o) => {
    const dfy = o.pricing.dfy;
    const dwy = o.pricing.dwy;
    return {
        id: o.id,
        category: o.category,
        title: o.title,
        tagline: o.tagline,
        description: o.description,
        tags: o.tags,
        verticals: o.verticals,
        priority: !!o.priority,
        flow: o.flow || 'default',
        price: {
            currency,
            // Headline uses the DFY tier; DWY stands in as the "discounted" anchor.
            setup: scaleTierAmount(dfy.setup),
            discountedSetup: scaleTierAmount(dwy.setup),
            monthly: scaleTierAmount(dfy.monthly),
        },
        valueStack: o.valueStack.map(
            (v) => `${v.label} (${currency}${scaleValueAmount(v.value).toLocaleString('en-US')}/yr)`
        ),
        stackTotal: stackTotal(o.valueStack),
        isProductized: true,
    };
});

/** City list for the active region. */
export const cities = regionCities();

export { REGION };
