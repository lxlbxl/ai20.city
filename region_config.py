"""
region_config.py — Python mirror of src/js/region-config.js.

The Python generators (generate_offers.py, generate_locations.py,
generate_sitemap.py) import this to stay region-aware. REGION comes from the
environment; everything else flows from src/data/*.json — the same files the JS
runtime reads. Keep the scaling logic in sync with region-config.js.
"""

import os
import json

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src", "data")


def _load(name):
    with open(os.path.join(DATA_DIR, name), "r", encoding="utf-8") as f:
        return json.load(f)


REGIONS_DATA = _load("regions.json")
CITIES_DATA = _load("cities.json")
OFFERS_DATA = _load("offers.json")
LOCAL_MARKETS = _load("local-markets.json")

REGION = os.environ.get("REGION", REGIONS_DATA.get("default", "eu")).lower()
if REGION not in REGIONS_DATA["regions"]:
    REGION = REGIONS_DATA.get("default", "eu")

REGION_CFG = REGIONS_DATA["regions"][REGION]
ALL_REGIONS = REGIONS_DATA["regions"]

GUARANTEE = OFFERS_DATA.get("guarantee", "")
OFFERS = OFFERS_DATA["offers"]
CORE_SERVICES = OFFERS_DATA["coreServices"]


def sibling_regions():
    return [r for k, r in ALL_REGIONS.items() if k != REGION]


def _round97(value):
    return round(value / 100) * 100 - 3


def _round100(value):
    return round(value / 100) * 100


def fmt_price(base_amount):
    """Format a base (EUR) tier amount into the active region's currency."""
    if base_amount is None:
        return ""
    scaled = _round97(base_amount * REGION_CFG["priceFactor"])
    return REGION_CFG["currency"] + f"{scaled:,}"


def fmt_value(base_amount):
    """Format a base (EUR) annual value-stack figure into the region currency."""
    scaled = _round100(base_amount * REGION_CFG["valueFactor"])
    return REGION_CFG["currency"] + f"{scaled:,}"


def stack_total(value_stack):
    total = sum(v["value"] for v in value_stack)
    return fmt_value(total)


def pick_regional(value):
    """Pick region-appropriate string from a {eu, us} map or a plain string."""
    if value is None:
        return ""
    if isinstance(value, str):
        return value
    return value.get(REGION) or value.get("eu") or ""


def cities():
    return CITIES_DATA.get(REGION_CFG["citiesKey"], CITIES_DATA["eu"])


def offer_in_region(offer):
    return "regions" not in offer or REGION in offer["regions"]


def offers_for_region():
    return [o for o in OFFERS if offer_in_region(o)]


def hreflang_block(path="/"):
    """Build the <link rel=alternate hreflang> cluster for a given page path."""
    if not path.startswith("/"):
        path = "/" + path
    lines = []
    for r in ALL_REGIONS.values():
        lines.append(
            f'<link rel="alternate" hreflang="{r["hreflang"]}" href="https://{r["host"]}{path}">'
        )
    lines.append(f'<link rel="alternate" hreflang="x-default" href="https://ai20.city{path}">')
    return "\n".join(lines)


# --- Local market data (Tier B city x niche pages) ---------------------------
# A city x niche page may only be indexed once it carries genuinely local,
# sourced facts. Everything else is generated noindex and kept out of the
# sitemap, which is what phases the rollout. See src/data/local-markets.json.

# Populated fields required (in addition to verified: true) before a page is
# considered substantive enough to index.
MIN_LOCAL_SIGNALS = 3

_LOCAL_FIELDS = (
    "business_count",
    "receptionist_salary",
    "avg_job_value",
    "peak_season",
    "seasonality_note",
    "licensing",
    "local_note",
)


def local_market(city_slug, niche_id):
    """Return the local data dict for a city x niche, or {} if unresearched."""
    region = LOCAL_MARKETS.get(REGION) or {}
    city = region.get(city_slug) or {}
    return (city.get("niches") or {}).get(niche_id) or {}


def local_signal_count(data):
    """How many genuinely local fields are populated."""
    return sum(1 for f in _LOCAL_FIELDS if data.get(f) not in (None, "", []))


def is_indexable(city_slug, niche_id):
    """True when the page has verified local data worth indexing."""
    data = local_market(city_slug, niche_id)
    if not data.get("verified"):
        return False
    return local_signal_count(data) >= MIN_LOCAL_SIGNALS


def city_meta(city_slug):
    region = LOCAL_MARKETS.get(REGION) or {}
    return region.get(city_slug) or {}
