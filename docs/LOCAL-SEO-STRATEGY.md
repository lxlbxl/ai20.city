# Local SEO Strategy — rebuilding the location pages

**Goal (unchanged):** rank in target cities and capture local demand.
**Problem:** the current build pursues that with 2,501 near-identical pages,
which risks the whole domain under Google's scaled-content-abuse policy.
**This document:** how to achieve the same commercial goal defensibly.

---

## 1. First, separate the two things called "local SEO"

| | Google Local Pack (map results) | Organic local results |
|---|---|---|
| What ranks | **Google Business Profile** listings | Web pages |
| Driven by | Verified presence in/near the city, proximity to searcher, reviews, categories, citations (NAP consistency) | Content relevance, depth, links, internal linking |
| Can a landing page win it? | **No** | **Yes** |
| Example query | "ai agency near me" | "AI receptionist for plumbers Austin" |

Landing pages cannot rank in the map pack. This matters because the current
2,501 pages are implicitly aiming at a target they structurally cannot hit.

**Consequence:** the page strategy should target *organic* long-tail local
intent, and the map pack should be pursued separately via GBP — only in cities
where there is a genuine presence.

### Honesty constraint (non-negotiable)

Do **not** create GBP listings with addresses you don't occupy, rented
virtual-office addresses used solely for listings, or local phone numbers with
no local operation. That is GBP suspension territory and it's deceptive to
searchers. Service-area businesses are a legitimate GBP type and don't require a
public address — but they still require a real operating presence in the region.

Realistically: **map-pack ambitions belong to the cities where you actually
operate** (Berlin for EU, Austin for US today). Everywhere else, compete
organically. That's still a large, winnable surface.

---

## 2. Restructure: kill the multiplication, keep the coverage

Current matrix (per region): `41 cities × 10 niches × 5 offers`

| Tier | Pattern | Count | Action |
|---|---|---|---|
| A — City hub | `/locations/austin.html` | 41 | **Keep**, enrich |
| B — City × Niche | `/locations/austin/hvac/` | 410 | **Keep — this is the money tier**, rebuild with real data |
| C — City × Niche × Offer | `/locations/austin/hvac/ai-receptionist.html` | **2,050** | **Remove**, 301 → Tier B |

Result: **~451 pages per region instead of 2,501** — an 82% cut with no loss of
commercial coverage, because Tier C never targeted a query anyone searches.
"ai voice receptionist for plumbing in amsterdam" has no search volume; "plumber
answering service amsterdam" does — and that's a Tier B query.

**Migration:** 301 each Tier C URL to its Tier B parent. Do not 404 them — a
redirect consolidates any accumulated signals and avoids 2,050 simultaneous soft
404s, which is itself a quality signal.

---

## 3. Make Tier B genuinely unique — the data model

A city × niche page must answer "why is this page different from the Dallas
one?" with facts, not synonyms. Your own value proposition is city-variable,
which makes this tractable.

### `src/data/local-markets.json`

```json
{
  "us": {
    "austin": {
      "city": "Austin",
      "state": "TX",
      "metro_pop": 2400000,
      "gbp_presence": true,
      "niches": {
        "hvac": {
          "business_count": 640,
          "receptionist_salary": 41000,
          "avg_job_value": 380,
          "peak_season": "May–September",
          "seasonality_note": "Austin summers push emergency call volume roughly 3x from June to August — precisely when after-hours calls go unanswered.",
          "licensing": "Texas requires a TDLR contractor licence for HVAC work.",
          "local_competitors": ["regional answering services charge $1.20–2.00/min"]
        }
      }
    }
  }
}
```

### Where the data legitimately comes from (all free)

| Field | Source |
|---|---|
| `receptionist_salary` | **BLS OES** — wages by occupation **by metro area** (US) |
| `business_count` | **Census County Business Patterns** — establishments by NAICS by metro (US) |
| EU equivalents | **Eurostat** SBS + national statistics offices |
| `licensing` | State/national licensing boards |
| `peak_season`, `seasonality_note` | NOAA/climate data + domain knowledge |

These are cite-able, genuinely differ by city, and directly reinforce the offer's
ROI argument. That is the difference between programmatic SEO and doorway pages:
**a unique data asset per page.**

### What each Tier B page then contains

1. **H1:** `AI Answering & Booking for HVAC Contractors in Austin`
2. **Local market paragraph** — business count, metro size, seasonality (unique numbers)
3. **The local ROI calculation** — "a front-desk hire in Austin runs ~$41,000/yr vs $997/mo" (unique per city)
4. **Local regulatory note** — licensing, and TCPA/GDPR for outreach
5. **Local proof** — case study, testimonial, or named client *if you have one*; otherwise omit rather than invent
6. **City-specific FAQ** — 3–4 questions referencing local conditions
7. **Internal links** — up to the city hub, across to the offer page, sideways to 2–3 related niches in the same city

Rule of thumb: **≥600 words, of which ≥40% is city-or-niche-specific**. If you
can swap the city name and the page still reads correctly, it isn't ready.

---

## 4. Sequencing (don't publish 410 at once)

Publishing 410 pages overnight from a domain with no history is itself a spam
signal.

1. **Now:** `noindex` + remove Tier C from the sitemap; 301 to Tier B.
2. **Phase 1:** rebuild **20 pages** — your top 4 metros × top 5 niches. Fully
   researched. Let them index and measure.
3. **Phase 2:** if they rank, scale to ~120 (12 metros × 10 niches) over 6–8 weeks.
4. **Phase 3:** full 410 only once the pattern is proven to rank.

Tier A city hubs (41) can stay indexed throughout, but should be enriched with
the same local data.

---

## 5. The genuine Local Pack play (parallel track)

For the cities where you *do* operate:

1. Create/verify **Google Business Profile** — service-area type if no public office.
2. Categories: "Marketing agency" / "Software company" / "Business management consultant".
3. **Reviews are the dominant lever** — build a systematic review request into
   client offboarding. This outweighs almost everything else in the map pack.
4. **NAP consistency** — identical name/address/phone across GBP, the site
   footer, and citations. Today the site's schema uses placeholder values
   (`Torstraße 1` / `600 Congress Ave`, `+49 30 12345678` / `+1 512 555 0120`) —
   these must become real before any citation building, or you'll cement
   inconsistent NAP.
5. Embed the GBP-linked map + real NAP on the city hub page for that metro only.

---

## 6. Supporting technical fixes (from the SEO audit)

These disproportionately affect the location tier:

- **Internal links are JS-rendered** — Tier B pages need static, crawlable links
  from the city hub and the offer pages. Currently the nav and offer grid are
  client-side only, so link equity doesn't flow to any location page.
- **`LocalBusiness` schema** — use `areaServed` for service-area cities; only
  emit a `PostalAddress` where you genuinely have one. Never fabricate.
- **Per-region robots.txt + sitemap** (currently points at a 404).
- Keep the unique `<title>` pattern — that part is already right.

---

## 7. Expected outcome

| | Now | After |
|---|---|---|
| Indexable URLs (US) | 2,486 | ~450 → phased from 60 |
| Thin/duplicate share | 98% | ~0% |
| Pages targeting real queries | 36 | ~450 |
| Scaled-content-abuse risk | **High** | Low |
| Map-pack eligibility | None | Real, in operating cities |

You lose nothing commercially: the deleted tier targeted queries with no search
volume. You gain pages that can actually rank, and you remove the risk of the
2,400 template pages dragging down the 30 offer pages that convert.
