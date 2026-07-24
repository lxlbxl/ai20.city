"""
generate_offers.py — build an on-brand, region-aware detail page for every
productized offer into services/<id>.html.

Single source of truth: src/data/offers.json (via region_config). Pricing,
currency, ROI/anchor copy, and compliance framing all follow REGION. Core
strategic service pages (fractional-caio, ai-strategy, …) are NOT touched.

Run before `vite build` (see package.json). Output pages are then picked up as
Vite inputs and bundled like the rest of the site.
"""

import os
import html
import region_config as rc

OUT_DIR = "services"
CFG = rc.REGION_CFG
GUARANTEE = rc.GUARANTEE

VERTICAL_LABELS = {v["slug"]: v["label"] for v in CFG["verticals"]}
# Fall back to a readable label for verticals not surfaced on the homepage grid.
_FALLBACK_VLABEL = {
    "home-services": "Home Services",
    "healthcare": "Healthcare",
    "legal": "Legal",
    "finance": "Finance",
    "ecommerce": "E-commerce",
    "real-estate": "Real Estate",
}


def vlabel(slug):
    return VERTICAL_LABELS.get(slug) or _FALLBACK_VLABEL.get(slug, slug.replace("-", " ").title())


def esc(s):
    return html.escape(str(s), quote=True)


TIER_META = [
    ("DIY", "diy", "Self-serve setup. You run it, we hand you the keys."),
    ("DWY", "dwy", "We build, you co-pilot. Shared implementation."),
    ("DFY", "dfy", "Done-for-you. We build it and run it. Fully managed."),
]


def nav_html():
    switcher = "".join(
        f'<button data-region="{esc(r["key"])}" class="px-3 py-1.5 transition-colors '
        + ("bg-[#050505] text-[#f4f1ea]" if r["key"] == CFG["key"] else "text-[#050505]/60 hover:text-[#ff3300]")
        + f'">{esc(r["shortLabel"])}</button>'
        for r in rc.ALL_REGIONS.values()
    )
    return f"""<nav class="fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-6 flex justify-between items-center bg-[#f4f1ea]/90 backdrop-blur-sm" id="main-nav">
<a class="flex items-center gap-3 group cursor-pointer z-[101]" href="../index.html">
<div class="w-3 h-3 bg-[#ff3300] rotate-45 group-hover:rotate-0 transition-transform duration-500"></div>
<span class="font-serif-display text-2xl md:text-3xl tracking-tight font-medium italic text-[#050505]">ai20.</span>
</a>
<div class="hidden md:flex gap-10 font-sans-tech text-xs tracking-[0.2em] uppercase font-medium">
<a class="hover:text-[#ff3300] transition-colors" href="../services.html">Expertise</a>
<a class="hover:text-[#ff3300] transition-colors" href="../offers.html">Offers</a>
<a class="hover:text-[#ff3300] transition-colors" href="../locations.html">Markets</a>
<a class="hover:text-[#ff3300] transition-colors" href="../about.html">About</a>
</div>
<div class="flex items-center gap-4 z-[101]">
<div id="region-switcher" class="hidden md:flex items-center border border-[#050505]/20 rounded-full overflow-hidden text-[10px] uppercase tracking-widest font-sans-tech">{switcher}</div>
<a class="hidden md:block px-6 py-2 bg-[#ff3300] text-white text-[10px] uppercase tracking-widest hover:bg-[#050505] transition-colors duration-300" href="../quiz.html">Free Assessment</a>
</div>
</nav>"""


def footer_html():
    return f"""<footer class="bg-[#f4f1ea] border-t border-[#050505]/10 pt-24 pb-12 px-6 md:px-12 mt-auto">
<div class="max-w-[1400px] mx-auto">
<div class="flex flex-col lg:flex-row justify-between items-start gap-16 mb-16">
<div class="w-full lg:w-1/3">
<h3 class="font-serif-display text-4xl italic mb-6">ai20.</h3>
<p class="font-sans-tech text-sm leading-relaxed max-w-xs opacity-70">{esc(CFG['footerBlurb'])}</p>
<p class="font-sans-tech text-[10px] uppercase tracking-widest opacity-50 mt-6">{esc(CFG['complianceLine'])}</p>
</div>
<div class="grid grid-cols-2 md:grid-cols-3 gap-12 w-full lg:w-2/3">
<div class="flex flex-col gap-4">
<span class="font-sans-tech text-[10px] uppercase tracking-widest border-b border-[#050505] pb-2 w-fit">Expertise</span>
<a class="font-serif-display text-xl italic hover:text-[#ff3300]" href="../offers.html">All Offers</a>
<a class="font-serif-display text-xl italic hover:text-[#ff3300]" href="../services.html">Services</a>
<a class="font-serif-display text-xl italic hover:text-[#ff3300]" href="../locations.html">Markets</a>
</div>
<div class="flex flex-col gap-4">
<span class="font-sans-tech text-[10px] uppercase tracking-widest border-b border-[#050505] pb-2 w-fit">Start</span>
<a class="font-serif-display text-xl italic hover:text-[#ff3300]" href="../quiz.html">Free Assessment</a>
<a class="font-serif-display text-xl italic hover:text-[#ff3300]" href="../audit.html">AI Opportunity Audit</a>
<a class="font-serif-display text-xl italic hover:text-[#ff3300]" href="../contact.html">Contact</a>
</div>
<div class="flex flex-col gap-4">
<span class="font-sans-tech text-[10px] uppercase tracking-widest border-b border-[#050505] pb-2 w-fit">Company</span>
<a class="font-serif-display text-xl italic hover:text-[#ff3300]" href="../about.html">About</a>
<a class="font-serif-display text-xl italic hover:text-[#ff3300]" href="../case-studies.html">Case Studies</a>
</div>
</div>
</div>
<div class="flex flex-col md:flex-row justify-between items-end border-t border-[#050505]/10 pt-8 font-sans-tech text-[10px] uppercase tracking-widest opacity-40">
<p>© 2026 ai20.</p><p>{esc(CFG['madeIn'])}</p>
</div>
</div>
</footer>"""


def pricing_cards(offer):
    cards = []
    for name, key, blurb in TIER_META:
        tier = offer["pricing"][key]
        is_dfy = key == "dfy"
        wrap = (
            "bg-[#050505] text-[#f4f1ea] border-[#050505]"
            if is_dfy
            else "bg-[#f4f1ea] text-[#050505] border-[#050505]/10"
        )
        badge = (
            '<span class="absolute -top-3 left-6 bg-[#ff3300] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest">Most Popular</span>'
            if is_dfy
            else ""
        )
        opacity = "opacity-100" if is_dfy else "opacity-70"
        cards.append(
            f"""<div class="relative border {wrap} p-8 flex flex-col">
{badge}
<span class="font-sans-tech text-[10px] uppercase tracking-[0.2em] {opacity} mb-2">{name}</span>
<p class="font-sans-tech text-xs {opacity} mb-6 min-h-[2.5rem]">{esc(blurb)}</p>
<div class="mb-1"><span class="font-serif-display text-4xl">{esc(rc.fmt_price(tier['setup']))}</span><span class="font-sans-tech text-xs {opacity}"> setup</span></div>
<div class="font-sans-tech text-sm {opacity} mb-8">+ {esc(rc.fmt_price(tier['monthly']))}/mo</div>
<button class="offer-cta mt-auto w-full py-3 text-xs uppercase tracking-widest transition-colors {'bg-[#ff3300] text-white hover:bg-white hover:text-[#050505]' if is_dfy else 'bg-[#050505] text-[#f4f1ea] hover:bg-[#ff3300]'}">Get Started</button>
</div>"""
        )
    return "\n".join(cards)


def value_stack_html(offer):
    items = "".join(
        f'<li class="flex items-center justify-between gap-4 py-3 border-b border-[#050505]/10">'
        f'<span class="font-sans-tech text-sm">{esc(v["label"])}</span>'
        f'<span class="font-sans-tech text-xs text-[#ff3300] whitespace-nowrap">{esc(rc.fmt_value(v["value"]))}/yr</span></li>'
        for v in offer["valueStack"]
    )
    total = rc.stack_total(offer["valueStack"])
    dfy_monthly = rc.fmt_price(offer["pricing"]["dfy"]["monthly"])
    return f"""<ul class="mb-6">{items}</ul>
<div class="flex items-center justify-between border-t-2 border-[#050505] pt-4">
<span class="font-sans-tech text-xs uppercase tracking-widest">Total Value</span>
<span class="font-serif-display text-2xl">{esc(total)}/yr</span>
</div>
<p class="font-sans-tech text-xs opacity-60 mt-3">Your DFY investment: {esc(dfy_monthly)}/mo — a fraction of the value delivered.</p>"""


def pains_html(offer):
    return "".join(
        f'<li class="flex items-start gap-3 text-sm"><span class="text-[#ff3300] mt-1">✕</span><span class="opacity-80">{esc(p)}</span></li>'
        for p in offer.get("pains", [])
    )


def vertical_links(offer):
    # Only link verticals that have an industry page in THIS region (avoids
    # 404s, e.g. home-services exists in US but not EU).
    region_slugs = {v["slug"] for v in CFG["verticals"]}
    slugs = [s for s in offer.get("verticals", []) if s in region_slugs]
    if not slugs:
        slugs = [v["slug"] for v in CFG["verticals"][:3]]
    return "".join(
        f'<a class="px-4 py-2 border border-[#050505]/20 hover:bg-[#050505] hover:text-white transition-colors text-xs uppercase tracking-widest" href="../industries/{esc(s)}.html">{esc(vlabel(s))}</a>'
        for s in slugs
    )


def location_links(offer):
    cities = rc.cities()[:4]
    return "".join(
        f'<li><a class="opacity-60 hover:opacity-100 hover:text-[#ff3300] hover:underline" href="../locations/{esc(c["slug"])}.html">{esc(offer["title"])} in {esc(c["city"])} →</a></li>'
        for c in cities
    )


def other_offers(current, all_offers):
    others = [o for o in all_offers if o["id"] != current["id"]][:4]
    return "".join(
        f'<a class="p-6 border border-[#050505]/10 hover:bg-[#ff3300] hover:text-white transition-colors group" href="../services/{esc(o["id"])}.html">'
        f'<span class="block font-serif-display text-xl italic mb-2">{esc(o["title"])}</span>'
        f'<span class="text-[10px] uppercase tracking-widest opacity-50 group-hover:opacity-100">View Details →</span></a>'
        for o in others
    )


def faq_html(offer):
    compliance = esc(CFG["complianceLine"])
    return f"""<div>
<h4 class="font-bold mb-2">How fast can this go live?</h4>
<p class="opacity-70 text-sm">Done-For-You deployments are live within 30 days — backed by our guarantee: if it isn't, we cover your first month.</p>
</div>
<div>
<h4 class="font-bold mb-2">Is it compliant for my industry?</h4>
<p class="opacity-70 text-sm">Yes. {compliance} We scope the right controls for your vertical before anything goes live.</p>
</div>
<div>
<h4 class="font-bold mb-2">Do you integrate with our existing tools?</h4>
<p class="opacity-70 text-sm">We connect to your CRM, phone system, and stack. Tell us what you run and we map the integration in the assessment.</p>
</div>"""


PAGE = """<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>{title} | ai20 {region_label}</title>
<meta name="description" content="{meta_desc}"/>
<meta property="og:title" content="{title} | ai20 {region_label}"/>
<meta property="og:description" content="{meta_desc}"/>
<meta property="og:type" content="website"/>
<meta property="og:locale" content="{locale}"/>
<link rel="canonical" href="{origin}/services/{oid}.html"/>
{hreflang}
<script src="../src/js/main.js" type="module"></script>
<script type="application/ld+json">{schema}</script>
<style>body {{ background-color:#f4f1ea; color:#050505; }}</style>
</head>
<body class="bg-alabaster text-obsidian overflow-x-hidden relative min-h-screen flex flex-col">
{nav}
<main class="max-w-[1400px] mx-auto px-6 md:px-12 py-20 w-full">
<div class="mb-16 pt-8">
<a class="text-[#ff3300] font-sans-tech text-xs uppercase tracking-widest hover:underline mb-4 block" href="../offers.html">← All Offers</a>
<span class="inline-block border border-[#050505] px-3 py-1 rounded-full text-[#050505] font-sans-tech text-[10px] uppercase tracking-[0.2em] mb-6">{category}</span>
<h1 class="font-serif-display text-5xl md:text-7xl italic mb-4">{title}</h1>
<p class="font-serif-display text-2xl italic text-[#ff3300] mb-6">{tagline}</p>
<p class="text-lg md:text-xl opacity-70 max-w-3xl leading-relaxed">{description}</p>
<div class="mt-8 inline-flex items-center gap-3 bg-[#050505] text-[#f4f1ea] px-5 py-3">
<span class="font-sans-tech text-[10px] uppercase tracking-widest opacity-60">Replaces</span>
<span class="font-sans-tech text-sm">{anchor}</span>
</div>
</div>

<div class="grid lg:grid-cols-2 gap-16 items-start mb-24">
<div>
<h2 class="font-serif-display text-3xl italic mb-6">The problem it kills</h2>
<ul class="space-y-4 mb-10">{pains}</ul>
<div class="bg-[#f4f1ea] border border-[#ff3300]/30 p-6">
<span class="font-sans-tech text-[10px] uppercase tracking-widest text-[#ff3300]">The math</span>
<p class="font-serif-display text-2xl italic mt-2">{roi}</p>
</div>
</div>
<div class="bg-white/50 border border-[#050505]/10 p-8">
<h2 class="font-serif-display text-3xl italic mb-8">What's inside</h2>
{value_stack}
</div>
</div>

<div class="mb-24">
<div class="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
<h2 class="font-serif-display text-4xl italic">Choose your delivery model</h2>
<p class="font-sans-tech text-xs opacity-60 max-w-sm">Every plan is priced in {currency_code}. Setup + monthly. Cancel anytime.</p>
</div>
<div class="grid md:grid-cols-3 gap-6">{pricing}</div>
<div class="mt-8 flex items-center gap-3 bg-[#ff3300]/10 border border-[#ff3300]/30 px-6 py-4">
<span class="text-[#ff3300] text-xl">✓</span>
<p class="font-sans-tech text-sm">{guarantee}</p>
</div>
</div>

<div class="grid lg:grid-cols-3 gap-12 mb-24">
<div class="lg:col-span-2">
<h2 class="font-serif-display text-3xl italic mb-8">Frequently Asked Questions</h2>
<div class="space-y-8">{faq}</div>
<div class="mt-12">
<h3 class="font-serif-display text-2xl italic mb-4">Built for</h3>
<div class="flex flex-wrap gap-3">{verticals}</div>
</div>
</div>
<div class="sticky top-32">
<div class="bg-[#050505] text-[#f4f1ea] p-8">
<h3 class="font-serif-display text-3xl italic mb-2">Get your plan</h3>
<p class="opacity-60 text-sm mb-8">Answer a few questions and we'll scope this to your business — free.</p>
<button class="offer-cta w-full bg-[#ff3300] text-white py-4 text-sm uppercase tracking-widest hover:bg-white hover:text-[#050505] transition-colors font-bold">Start Free Assessment</button>
<a href="../audit.html" class="block text-center mt-4 text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100">Or book a paid deep-dive audit →</a>
</div>
<div class="mt-6 p-6 bg-[#f4f1ea] border border-[#050505]/10">
<h4 class="font-sans-tech text-xs uppercase tracking-widest mb-4">{markets_label}</h4>
<ul class="text-sm space-y-2">{locations}</ul>
</div>
</div>
</div>

<div class="pt-16 border-t border-[#050505]/10">
<h2 class="font-serif-display text-4xl italic mb-8">Explore other offers</h2>
<div class="grid grid-cols-2 md:grid-cols-4 gap-4">{others}</div>
</div>
</main>
{footer}
<script>
document.querySelectorAll('.offer-cta').forEach(function(btn){{
  btn.addEventListener('click', function(){{
    if (window.AI20Quiz) {{
      window.AI20Quiz.open({{ niche: "{flow}", serviceId: "{oid}", title: "{title_js}", source: "offer_page" }});
    }}
  }});
}});
</script>
</body>
</html>
"""


def build_schema(offer):
    import json

    dfy = offer["pricing"]["dfy"]
    return json.dumps(
        {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": offer["title"],
            "provider": {"@type": "Organization", "name": "ai20"},
            "description": offer["description"],
            "areaServed": CFG["label"],
            "offers": {
                "@type": "Offer",
                "price": rc.fmt_price(dfy["monthly"]),
                "priceCurrency": CFG["currencyCode"],
            },
        }
    )


def render(offer, all_offers):
    return PAGE.format(
        lang=CFG["htmlLang"],
        title=esc(offer["title"]),
        title_js=offer["title"].replace('"', "'"),
        region_label=esc(CFG["label"]),
        meta_desc=esc(offer["description"]),
        locale=CFG["locale"],
        origin=CFG["origin"],
        oid=offer["id"],
        hreflang=rc.hreflang_block(f"/services/{offer['id']}.html"),
        schema=build_schema(offer),
        nav=nav_html(),
        footer=footer_html(),
        category=esc(offer["category"]),
        tagline=esc(offer.get("tagline", "")),
        description=esc(offer["description"]),
        anchor=esc(rc.pick_regional({"eu": offer.get("anchorEu"), "us": offer.get("anchorUs")})),
        pains=pains_html(offer),
        roi=esc(rc.pick_regional({"eu": offer.get("roiEu"), "us": offer.get("roiUs")})),
        value_stack=value_stack_html(offer),
        pricing=pricing_cards(offer),
        currency_code=CFG["currencyCode"],
        guarantee=esc(GUARANTEE),
        faq=faq_html(offer),
        verticals=vertical_links(offer),
        markets_label=esc(CFG["marketsLabel"]),
        locations=location_links(offer),
        others=other_offers(offer, all_offers),
        flow=offer.get("flow", "default"),
    )


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    offers = rc.offers_for_region()

    # Drop offer pages that belong to another region only, so switching REGION
    # never leaves a stale (wrong-currency) page behind for Vite to bundle.
    active = {o["id"] for o in offers}
    for other in rc.OFFERS:
        if other["id"] not in active:
            stale = os.path.join(OUT_DIR, f"{other['id']}.html")
            if os.path.exists(stale):
                os.remove(stale)

    for offer in offers:
        path = os.path.join(OUT_DIR, f"{offer['id']}.html")
        with open(path, "w", encoding="utf-8") as f:
            f.write(render(offer, offers))
    print(f"Generated {len(offers)} offer pages for region '{rc.REGION}' into {OUT_DIR}/")


if __name__ == "__main__":
    main()
