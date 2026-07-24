# Research Brief — Local Market Data (hand this to the research agent)

Copy everything below the line into the research agent. It is self-contained.

---

## TASK

Produce verified, sourced local-market data for 20 US city × trade combinations,
formatted as JSON that drops directly into a file called `local-markets.json`.

This data will be **published on a live commercial website as fact**. Every
number must be traceable to a named public dataset. Do not estimate, interpolate,
or infer any figure. If you cannot find a real value, leave it `null` — that is
a correct and expected outcome, not a failure.

## SCOPE — Phase 1

**4 metros:** `austin` (Austin, TX), `dallas` (Dallas, TX), `phoenix` (Phoenix, AZ), `tampa` (Tampa, FL)

**5 trades:** `hvac`, `plumbing`, `roofing`, `electrician`, `dentistry`

= 20 city × trade combinations. Use these exact slugs as JSON keys — they are
system identifiers, not display labels. Do not rename, pluralise, or reformat.

## FIELDS TO RESEARCH

For **each metro** (once, applies to all 5 trades in that metro):

| Field | Definition | Source |
|---|---|---|
| `metro_pop` | Metro area population | Census Bureau metro population estimates |
| `receptionist_salary` | **Annual mean wage**, occupation **43-4171 "Receptionists and Information Clerks"**, for that MSA. Integer, no decimals/currency symbol. | **BLS OES** (Occupational Employment and Wage Statistics), latest release, metropolitan area tables |

For **each metro × trade** (20 lookups):

| Field | Definition | Source |
|---|---|---|
| `business_count` | Number of **establishments** in that trade in that MSA | **Census County Business Patterns (CBP)**, latest year, by NAICS by MSA |
| `licensing` | The licensing requirement for that trade in that state, one sentence | State licensing board (e.g. Texas TDLR, Arizona ROC, Florida DBPR) |
| `peak_season` | Peak demand window, e.g. `"May–September"` | Trade/climate seasonality; leave null if not clearly seasonal |
| `seasonality_note` | ONE sentence on the local demand pattern, mentioning the city | Derived from the above |
| `avg_job_value` | Typical job ticket. **Only if from a named industry source.** Otherwise `null`. | Industry reports; leave null if none |

### NAICS codes for CBP lookups

| Trade | NAICS |
|---|---|
| `hvac` | 238220 |
| `plumbing` | 238220 |
| `roofing` | 238160 |
| `electrician` | 238210 |
| `dentistry` | 621210 |

**Important caveat on 238220:** NAICS 238220 is "Plumbing, Heating, and
Air-Conditioning Contractors" — it covers plumbing **and** HVAC in a single
code. It is therefore NOT a clean count for either trade alone.

Handle it like this: use the 238220 establishment count for both `hvac` and
`plumbing`, and in `source_note` for those two state plainly that the figure is
the combined plumbing + HVAC contractor count. **Do not split, halve, or
apportion it between the two trades** — that would be inventing a number. If you
find a more granular local source, use it and cite it.

## OUTPUT FORMAT

Return **only** valid JSON in exactly this structure (no prose, no markdown
fences around it, no commentary):

```json
{
  "us": {
    "austin": {
      "metro_pop": 2473275,
      "gbp_presence": false,
      "niches": {
        "hvac": {
          "verified": true,
          "source_note": "BLS OES May 2024, Austin-Round Rock-San Marcos MSA (occ 43-4171); Census CBP 2022, NAICS 238220 (combined plumbing + HVAC contractors)",
          "business_count": 640,
          "receptionist_salary": 41230,
          "avg_job_value": null,
          "peak_season": "May–September",
          "seasonality_note": "Austin summers drive a sharp rise in emergency AC calls from June through August.",
          "licensing": "Texas requires a TDLR-issued Air Conditioning and Refrigeration Contractor licence.",
          "local_note": null
        }
      }
    }
  }
}
```

### Rules for the output

1. **`verified`** — set `true` ONLY if `business_count` AND `receptionist_salary`
   are both real sourced figures. Otherwise `false`.
2. **`source_note`** — required whenever `verified` is `true`. Must name the
   dataset, the release year/vintage, and the exact geography used. This is the
   audit trail.
3. **`gbp_presence`** — always `false`. Do not research this; it is set manually.
4. Leave any field you could not source as `null`. Never guess.
5. Numbers must be plain integers: `41230`, not `"41,230"` or `"$41,230"`.
6. `seasonality_note` and `licensing` must be **one factual sentence each**, no
   marketing language, no adjectives like "booming" or "thriving".
7. If the MSA name in a dataset differs from the city label (e.g.
   "Dallas-Fort Worth-Arlington, TX"), use the MSA the city belongs to and record
   the exact MSA name in `source_note`.

## DELIVERABLES

1. The JSON block above, covering all 20 combinations.
2. A short table listing, per field, the dataset + vintage you used.
3. An explicit list of any figures you could **not** source (these stay `null`).

## WHAT NOT TO DO

- Do not use a national average where a metro figure is unavailable — leave `null`.
- Do not carry a figure from one metro to another.
- Do not source figures from marketing blogs, SEO listicles, lead-gen sites, or
  "top 10 contractors in X" pages. Government statistical agencies and named
  industry bodies only.
- Do not write promotional copy. Every string is a factual statement.
- Do not set `verified: true` to be helpful. An unverified entry is handled
  correctly by the system; a wrong one gets published as fact.
