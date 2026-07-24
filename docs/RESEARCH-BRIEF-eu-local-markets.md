# Research Brief — EU Local Market Data (hand this to the research agent)

Copy everything below the line. It is self-contained.

---

## TASK

Produce verified, sourced local-market data for **41 European cities × 6
professional niches (246 combinations)**, formatted as JSON that drops directly
into a file called `local-markets.json`.

This data is **published on a live commercial website as fact**. Every number
must be traceable to a named public dataset. Do not estimate, interpolate,
average, or infer any figure. If you cannot source a value, return `null`.
**`null` is a correct and expected outcome here — far more often than in a US
dataset.** Read the next section to understand why.

## READ THIS FIRST — EUROPE IS NOT THE US

Do not apply a US methodology. There is no European equivalent of BLS OEWS or
Census County Business Patterns. Specifically:

1. **There is no single source.** These 41 cities span **23 countries**.
   Eurostat covers EU members; **11 of the cities are not in the EU** (7 UK,
   Zurich, Geneva, Oslo, Reykjavik) and need national sources instead.
2. **Geography is NUTS, not "metro areas."** Business counts by detailed NACE ×
   NUTS-3 are **frequently suppressed or simply unpublished**. Expect nulls.
3. **There is no metro-level wage series.** Eurostat's Structure of Earnings
   Survey is quadrennial with poor occupation × region granularity. In most
   countries the honest answer is a **country-level** wage. That is acceptable —
   but it must be labelled as country-level in `source_note`, never presented as
   city-level.
4. **A country-level wage will not differentiate cities within one country.**
   Paris, Lyon and Marseille will share a wage figure. Their differentiation
   must come from `business_count` and from a genuinely city-specific
   `local_note`. See the LOCAL_NOTE requirement below — it is mandatory wherever
   the wage is country-level.
5. **Currency is per city, not per region.** Report every monetary figure in the
   city's own currency, listed in the scope table. **Do not convert anything to
   EUR.**

An honest dataset with many nulls is worth far more than a complete-looking one.
A previous US batch returned `verified: true` on 100% of rows with zero nulls
and no suppression list; at 246 rows across 23 statistical systems, that outcome
would not be credible.

## SCOPE

Six niches, for every city. **Use these exact ids as JSON keys** — they are
system identifiers, not labels. Do not rename, translate, or pluralise them.

`dental-practices` · `medical-clinics` · `law-firm` · `accounting` · `ecommerce` · `real-estate`

Cities, grouped by country, with the currency to report in:

| Country | Currency | City slugs |
|---|---|---|
| UK | **GBP** | london, manchester, birmingham, edinburgh, leeds, cambridge, oxford |
| Germany | EUR | berlin, munich, hamburg, frankfurt, cologne |
| France | EUR | paris, lyon, marseille |
| Spain | EUR | madrid, barcelona, valencia |
| Netherlands | EUR | amsterdam, rotterdam, the-hague |
| Italy | EUR | milan, rome |
| Switzerland | **CHF** | zurich, geneva |
| Sweden | **SEK** | stockholm |
| Denmark | **DKK** | copenhagen |
| Norway | **NOK** | oslo |
| Poland | **PLN** | warsaw |
| Czech Republic | **CZK** | prague |
| Iceland | **ISK** | reykjavik |
| Austria | EUR | vienna |
| Belgium | EUR | brussels |
| Ireland | EUR | dublin |
| Portugal | EUR | lisbon |
| Finland | EUR | helsinki |
| Estonia | EUR | tallinn |
| Latvia | EUR | riga |
| Lithuania | EUR | vilnius |
| Luxembourg | EUR | luxembourg |
| Malta | EUR | malta |

### Deliver in batches, in this order

Do not attempt one monolithic pass. Deliver and stop between batches:

- **Batch 1 — UK** (7 cities). Best data availability; establishes the pattern.
- **Batch 2 — DE, FR, NL** (11 cities). Strong national statistics offices.
- **Batch 3 — ES, IT, AT, BE, IE, PT** (11 cities).
- **Batch 4 — Nordics + CH** (stockholm, copenhagen, oslo, helsinki, zurich, geneva).
- **Batch 5 — CEE + small states** (warsaw, prague, tallinn, riga, vilnius, luxembourg, malta, reykjavik). Expect the most nulls here; say so.

## FIELDS

Per **city** (once, applies to all six niches in that city):

| Field | Definition |
|---|---|
| `metro_pop` | Population of the metropolitan/NUTS-3 area containing the city |
| `receptionist_salary` | **Annual gross** pay for a receptionist / front-desk administrator, **in the city's own currency**, as a plain integer. ISCO-08 **4226 "Receptionists (general)"** where the source uses ISCO. Country-level is acceptable **if labelled as such**. |

Per **city × niche** (246 rows):

| Field | Definition |
|---|---|
| `business_count` | Number of **enterprises or local units** in that activity in that city's NUTS-3/metro area |
| `licensing` | The registration or licensing body governing that profession in that country, one sentence |
| `local_note` | **See mandatory requirement below** |
| `peak_season` | Only where a genuine seasonal pattern exists, else `null` |
| `seasonality_note` | One factual sentence, naming the city, else `null` |
| `avg_job_value` | Only from a named industry source, else `null` |

### NACE Rev. 2 codes

| Niche | NACE | Note |
|---|---|---|
| `dental-practices` | **86.23** | Dental practice activities |
| `medical-clinics` | **86.21 + 86.22** | General + specialist medical practice. **Report the sum and say so in `source_note`.** Do not report only one. |
| `law-firm` | **69.10** | Legal activities |
| `accounting` | **69.20** | Accounting, bookkeeping, auditing, tax consultancy |
| `ecommerce` | **47.91** | Retail sale via mail order houses or via the Internet |
| `real-estate` | **68.31** | Real estate activities on a fee or contract basis |

### MANDATORY: `local_note`

Because the wage figure will often be country-level, `local_note` is what makes
one city's page different from another's in the same country. For **every row**,
provide one factual sentence that is **specific to that city**, not the country.
Acceptable material:

- the city's role in that sector (e.g. Frankfurt's banking concentration for `accounting`, Milan's fashion/D2C base for `ecommerce`)
- a city-level regulator, chamber or bar with jurisdiction there
- a documented local market condition (a city dental chamber's registered-practice count, a municipal register)

If you genuinely cannot produce a city-specific fact, set `local_note` to `null`
and list it in the gaps report. **Do not pad it with generic marketing copy.**

### Regulation is the strongest differentiator here — use it

Europe's advantage over US data is regulatory specificity. Prefer precise,
checkable regulatory facts in `licensing`, for example:

- **DE** — Zahnärztekammer / Ärztekammer registration; Rechtsanwaltskammer for lawyers; Wirtschaftsprüferkammer for auditors
- **FR** — Ordre national des chirurgiens-dentistes; Ordre des avocats; Ordre des experts-comptables
- **IT** — the relevant Ordine/Albo
- **UK** — GDC, GMC, SRA (E&W) vs Law Society of Scotland (Scotland — note Edinburgh differs from London), ICAEW/ACCA
- **NL** — BIG-register; Nederlandse orde van advocaten; NBA

Name the actual body. "Requires a licence" is not usable.

## OUTPUT FORMAT

Return only valid JSON, no prose around it:

```json
{
  "eu": {
    "berlin": {
      "metro_pop": 3878100,
      "gbp_presence": false,
      "niches": {
        "dental-practices": {
          "verified": true,
          "source_note": "Destatis Unternehmensregister <year>, NACE 86.23, Berlin (NUTS-3 DE300); wage: Eurostat SES <year> ISCO-08 4226, COUNTRY-LEVEL Germany, EUR",
          "business_count": 2410,
          "receptionist_salary": 32800,
          "currency_code": "EUR",
          "avg_job_value": null,
          "peak_season": null,
          "seasonality_note": null,
          "licensing": "Dentists in Germany must be registered with the Zahnärztekammer of their federal state.",
          "local_note": "Berlin's Zahnärztekammer district covers the highest concentration of registered practices of any German state."
        }
      }
    }
  }
}
```

### Rules

1. `verified` — `true` **only** if `business_count` and `receptionist_salary` are
   both real sourced figures. Otherwise `false`.
2. `source_note` — required when `verified` is `true`. Must name the dataset,
   the release vintage, the exact geography used, **and whether the wage is
   city-level or COUNTRY-LEVEL** (write the word `COUNTRY-LEVEL` explicitly).
3. `currency_code` — the ISO code of the currency the monetary figures are in.
   Must match the scope table (`GBP` for London, `CHF` for Zurich, and so on).
4. `gbp_presence` — always `false`. Do not research it.
5. Unsourceable field → `null`. Never substitute a national average for a
   missing city figure, and never carry a figure from one city to another.
6. Plain integers: `32800`, not `"32.800"`, `"€32,800"` or `32800.0`.
7. `licensing` and `seasonality_note` are one factual sentence each. No
   marketing language, no "leading", "thriving", "world-class".
8. Keys are system identifiers. Do not rename or translate them.

## MANDATORY DELIVERABLES (all four)

1. The JSON, per batch.
2. **Vintage table** — every dataset used, its exact release, and the date you accessed it.
3. **Gaps report** — every field you could not source, with the reason
   (suppressed cell, no NUTS-3 breakdown, no occupational wage published, etc.).
   Given 246 rows across 23 statistical systems, an empty gaps report is not
   credible; if it is genuinely empty, say explicitly that you checked for
   suppression and found none.
4. **Coverage summary** — for each country: which source supplied the business
   counts, which supplied the wage, and whether the wage is city- or
   country-level.

## WHAT NOT TO DO

- Do not use Eurostat for the UK, Switzerland, Norway or Iceland. Use ONS,
  BFS/OFS, SSB and Statistics Iceland respectively.
- Do not convert currencies. Report in the city's own currency.
- Do not present a country-level wage as a city figure.
- Do not report only NACE 86.21 or only 86.22 for `medical-clinics`.
- Do not source from marketing blogs, SEO listicles, lead-generation sites, or
  business-directory scrapes. National statistical institutes, Eurostat, and
  named professional bodies only.
- Do not fill `local_note` with generic copy to avoid a null.
- Do not set `verified: true` to be helpful. An unverified row is handled
  correctly by the receiving system; a wrong one is published as fact.
