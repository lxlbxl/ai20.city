
import os
import json
import shutil
import region_config as rc
from local_data import LOCAL_NICHES, LOCAL_OFFERS

# --- CONFIGURATION & DATA ---

CONFIG = {
    "site_name": "ai20",
    "domain": rc.REGION_CFG["origin"],  # region-aware host (eu./us.ai20.city)
    "gtm_id": "GTM-XXXXXX"  # Placeholder
}

# Embedded Data (Mirrors src/js/data.js)
CORE_SERVICES = [
    {
        "id": "fractional-caio",
        "title": "Fractional Chief AI Officer (fCAIO)",
        "category": "Strategic Leadership",
        "description": "Executive leadership without the headcount. We provide strategic AI governance, board advisory, and technical roadmap development for mid-market to enterprise organizations.",
        "benefits": ["Board-level strategy", "Technical roadmap", "Vendor selection", "Risk & compliance"],
        "price": {"label": "Monthly Retainer", "amount": "From €3,500/mo"}
    },
    {
        "id": "ai-strategy",
        "title": "AI Strategy Consulting",
        "category": "Consulting",
        "description": "Project-based consultancy to align artificial intelligence initiatives with your overarching business objectives.",
        "benefits": ["Opportunity assessment", "ROI analysis", "Buy-vs-build strategy", "Market positioning"],
        "price": {"label": "Project Based", "amount": "From €5,000"}
    },
    {
        "id": "ai-implementation",
        "title": "AI Implementation (DFY)",
        "category": "Implementation",
        "description": "End-to-end execution of AI systems. Done-for-you automation pipelines, RAG systems, and custom internal tools.",
        "benefits": ["Custom development", "System integration", "Testing & QA", "Deployment management"],
        "price": {"label": "Project Based", "amount": "Custom Quote"}
    },
    {
        "id": "ai-training",
        "title": "AI Training & Enablement (DWY)",
        "category": "Training",
        "description": "Upskilling your workforce to leverage generative AI safely. Done-with-you programs including prompt engineering workshops and executive briefings.",
        "benefits": ["Team workshops", "Prompt libraries", "Policy development", "Skill certification"],
        "price": {"label": "Per Workshop", "amount": "From €2,500"}
    },
    {
        "id": "ai-audit",
        "title": "AI Audit & Roadmap (DIY)",
        "category": "Audit",
        "description": "Comprehensive analysis of your current technical infrastructure, data readiness, and regulatory exposure under the EU AI Act.",
        "benefits": ["Gap analysis", "Compliance check", "Data readiness score", "Actionable roadmap"],
        "price": {"label": "One-Time Fee", "amount": "€1,997"}
    },
    {
        "id": "custom-ai-solutions",
        "title": "Custom AI Solutions",
        "category": "Development",
        "description": "Bespoke development of proprietary AI models and applications tailored specifically to your unique industry challenges.",
        "benefits": ["Proprietary models", "IP ownership", "Competitive advantage", "Deep integration"],
        "price": {"label": "Project Based", "amount": "Custom Quote"}
    },
    {
        "id": "process-automation",
        "title": "AI Process Automation",
        "category": "Automation",
        "description": "Streamline workflows by replacing manual repetitive tasks with intelligent, self-healing automation agents.",
        "benefits": ["Cost reduction", "Error elimination", "24/7 operation", "Scalability"],
        "price": {"label": "Project Based", "amount": "From €3,000"}
    },
    {
        "id": "analytics-insights",
        "title": "AI-Powered Analytics & Insights",
        "category": "Analytics",
        "description": "Unlock the value of your data with predictive modeling and automated business intelligence dashboards.",
        "benefits": ["Predictive modeling", "Real-time dashboards", "Customer insights", "Trend forecasting"],
        "price": {"label": "Project Based", "amount": "From €4,000"}
    }
]

OFFERS = [
    {
        "id": "ai-exec-assistant",
        "category": "Administrative & Operations",
        "title": "AI Executive Assistant",
        "description": "Complete virtual AI assistant handling emails, scheduling, document management, and routine tasks. Perfect for busy executives.",
        "price": {"setup": 5997, "monthly": 797, "currency": "€", "discountedSetup": 2997},
        "valueStack": ["AI Email Assistant (€3,600/yr)", "Smart Calendar (€2,400/yr)", "Doc Organization (€1,800/yr)"]
    },
    {
        "id": "meeting-intelligence",
        "category": "Administrative & Operations",
        "title": "Meeting Intelligence System",
        "description": "AI-powered meeting recording, transcription, summary, and action item extraction. Never miss a detail again.",
        "price": {"setup": 2997, "monthly": 497, "currency": "€", "discountedSetup": 1497},
        "valueStack": ["Meeting Recordings", "AI Transcription", "Smart Summaries"]
    },
    {
        "id": "ai-sdr",
        "category": "Sales & Marketing",
        "title": "AI Sales Development Rep (SDR)",
        "description": "AI system that handles lead qualification, outreach, follow-ups, and meeting booking. Works 24/7, never takes a day off.",
        "price": {"setup": 12997, "monthly": 2497, "currency": "€", "discountedSetup": 6497},
        "valueStack": ["Lead Qualification", "Email Sequences", "Smart Follow-ups", "LinkedIn Automation"]
    },
    {
        "id": "content-machine",
        "category": "Sales & Marketing",
        "title": "Content Marketing Machine",
        "description": "AI system that creates blogs, social posts, newsletters, and SEO content at scale.",
        "price": {"setup": 6997, "monthly": 1497, "currency": "€", "discountedSetup": 3497},
        "valueStack": ["40 Blogs/Month", "60 Social Posts/Month", "4 Long-Form Guides"]
    },
    {
        "id": "ai-support-agent",
        "category": "Customer Service",
        "title": "AI Customer Support Agent",
        "description": "24/7 AI chatbot + email support handling 80% of customer inquiries automatically.",
        "price": {"setup": 9997, "monthly": 1497, "currency": "€", "discountedSetup": 4997},
        "valueStack": ["24/7 Chat Support", "Email Automation", "Multi-language Support"]
    },
    {
        "id": "ai-bookkeeping",
        "category": "Finance & Accounting",
        "title": "AI Bookkeeping & Expense Management",
        "description": "Automated expense tracking, receipt processing, and bookkeeping.",
        "price": {"setup": 2997, "monthly": 697, "currency": "€", "discountedSetup": 1497},
        "valueStack": ["Expense Tracking", "Receipt Scanning", "Tax Reports"]
    },
    {
        "id": "ai-recruitment",
        "category": "HR & Recruitment",
        "title": "AI Recruitment & Hiring System",
        "description": "Automated job posting, AI resume screening, interview scheduling, and applicant tracking.",
        "price": {"setup": 9997, "monthly": 1697, "currency": "€", "discountedSetup": 4997},
        "valueStack": ["Multi-Platform Posting", "AI Resume Screening", "Interview Scheduling"]
    },
    {
        "id": "medical-practice-ai",
        "category": "Healthcare",
        "title": "Medical Practice Management AI",
        "description": "Complete practice automation: patient intake, insurance verification, appointment management, and billing.",
        "price": {"setup": 14997, "monthly": 2497, "currency": "€", "discountedSetup": 7497},
        "valueStack": ["Patient Intake", "Insurance Verification", "Billing Automation"]
    },
    {
        "id": "legal-research-ai",
        "category": "Legal Automation",
        "title": "Legal Research & Case Analysis AI",
        "description": "AI 'Paralegal' that scans case law, summarizes precedents, and drafts research memos.",
        "price": {"setup": 12997, "monthly": 1997, "currency": "€", "discountedSetup": 6497},
        "valueStack": ["Case Law Search", "Memo Drafting", "Precedent Analysis"]
    },
    {
        "id": "dynamic-pricing",
        "category": "E-commerce & Retail",
        "title": "Dynamic Pricing Engine",
        "description": "AI that adjusts prices based on demand/competitors and predicts stock needs.",
        "price": {"setup": 7997, "monthly": 1297, "currency": "€", "discountedSetup": 3997},
        "valueStack": ["Competitor Tracking", "Demand Forecasting", "Auto Reordering"]
    }
]

CITIES = [
    # Tier 1: UK
    {"city": "London", "country": "UK", "slug": "london"},
    {"city": "Manchester", "country": "UK", "slug": "manchester"},
    {"city": "Birmingham", "country": "UK", "slug": "birmingham"},
    {"city": "Edinburgh", "country": "UK", "slug": "edinburgh"},
    {"city": "Leeds", "country": "UK", "slug": "leeds"},
    # Tier 1: Germany
    {"city": "Berlin", "country": "Germany", "slug": "berlin"},
    {"city": "Munich", "country": "Germany", "slug": "munich"},
    {"city": "Hamburg", "country": "Germany", "slug": "hamburg"},
    {"city": "Frankfurt", "country": "Germany", "slug": "frankfurt"},
    {"city": "Cologne", "country": "Germany", "slug": "cologne"},
    # Tier 1: France
    {"city": "Paris", "country": "France", "slug": "paris"},
    {"city": "Lyon", "country": "France", "slug": "lyon"},
    {"city": "Marseille", "country": "France", "slug": "marseille"},
    # Tier 1: Netherlands
    {"city": "Amsterdam", "country": "Netherlands", "slug": "amsterdam"},
    {"city": "Rotterdam", "country": "Netherlands", "slug": "rotterdam"},
    {"city": "The Hague", "country": "Netherlands", "slug": "the-hague"},
    # Tier 1: Spain
    {"city": "Madrid", "country": "Spain", "slug": "madrid"},
    {"city": "Barcelona", "country": "Spain", "slug": "barcelona"},
    {"city": "Valencia", "country": "Spain", "slug": "valencia"},
    # Tier 1: Italy
    {"city": "Milan", "country": "Italy", "slug": "milan"},
    {"city": "Rome", "country": "Italy", "slug": "rome"},
    # Tier 2: Nordics
    {"city": "Stockholm", "country": "Sweden", "slug": "stockholm"},
    {"city": "Copenhagen", "country": "Denmark", "slug": "copenhagen"},
    {"city": "Helsinki", "country": "Finland", "slug": "helsinki"},
    {"city": "Oslo", "country": "Norway", "slug": "oslo"},
    # Tier 2: Central Europe
    {"city": "Zurich", "country": "Switzerland", "slug": "zurich"},
    {"city": "Geneva", "country": "Switzerland", "slug": "geneva"},
    {"city": "Vienna", "country": "Austria", "slug": "vienna"},
    {"city": "Brussels", "country": "Belgium", "slug": "brussels"},
    # Tier 2: Ireland
    {"city": "Dublin", "country": "Ireland", "slug": "dublin"},
    # Tier 2: Poland
    {"city": "Warsaw", "country": "Poland", "slug": "warsaw"},
    # Tier 3: Baltics & Emerging
    {"city": "Tallinn", "country": "Estonia", "slug": "tallinn"},
    {"city": "Vilnius", "country": "Lithuania", "slug": "vilnius"},
    {"city": "Riga", "country": "Latvia", "slug": "riga"},
    {"city": "Prague", "country": "Czech Republic", "slug": "prague"},
    {"city": "Lisbon", "country": "Portugal", "slug": "lisbon"},
    # Specialty
    {"city": "Cambridge", "country": "UK", "slug": "cambridge"},
    {"city": "Oxford", "country": "UK", "slug": "oxford"},
    {"city": "Luxembourg", "country": "Luxembourg", "slug": "luxembourg"},
    {"city": "Malta", "country": "Malta", "slug": "malta"},
    {"city": "Reykjavik", "country": "Iceland", "slug": "reykjavik"},
]

# --- Region override: swap the EU defaults above for the active region's data. ---
CITIES = [{"city": c["city"], "country": c["country"], "slug": c["slug"]} for c in rc.cities()]

_INDUSTRY_DESC = {
    "home-services": "AI receptionists, speed-to-lead, and dispatch automation for HVAC, plumbing, roofing, and the trades.",
    "healthcare": "HIPAA-aware automation for patient intake, scheduling, and billing.",
    "legal": "Automate case research, contract review, and client communication.",
    "finance": "Automated bookkeeping, collections, and compliance-ready reporting.",
    "ecommerce": "Hyper-personalization and dynamic pricing engines for modern retail.",
    "real-estate": "Predictive market analysis, speed-to-lead, and automated transaction coordination.",
}
INDUSTRIES = [
    {"name": v["label"], "slug": v["slug"], "desc": _INDUSTRY_DESC.get(v["slug"], "Industry-specific AI, done for you.")}
    for v in rc.REGION_CFG["verticals"]
]

# --- TEMPLATES ---

HEAD_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <meta name="description" content="{description}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{description}">
    <meta property="og:type" content="website">
    
    <!-- Assets -->
    <script type="module" src="{root_path}src/js/main.js"></script>
    <script type="module" src="https://unpkg.com/lucide@latest"></script>
    
    {schema}
    
    <style>
        /* Minimal Critical CSS to prevent FOUC */
        body {{ background-color: #f4f1ea; color: #050505; }}
    </style>
</head>
<body class="bg-alabaster text-obsidian overflow-x-hidden relative min-h-screen flex flex-col">
"""

NAV_TEMPLATE = """
<nav class="fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-6 transition-all duration-500 flex justify-between items-center bg-[#f4f1ea]/90 backdrop-blur-sm" id="main-nav">
  <a href="{root_path}index.html" class="flex items-center gap-3 group cursor-pointer z-[101]">
    <div class="w-3 h-3 bg-[#ff3300] rotate-45 group-hover:rotate-0 transition-transform duration-500"></div>
    <span class="font-serif-display text-2xl md:text-3xl tracking-tight font-medium italic text-[#050505]">ai20.</span>
  </a>

  <div class="hidden md:flex gap-10 font-sans-tech text-xs tracking-[0.2em] uppercase font-medium">
    <a href="{root_path}services.html" class="hover:text-[#ff3300] transition-colors">Expertise</a>
    <a href="{root_path}locations.html" class="hover:text-[#ff3300] transition-colors">Markets</a>
    <a href="{root_path}case-studies.html" class="hover:text-[#ff3300] transition-colors">Case Studies</a>
    <a href="{root_path}about.html" class="hover:text-[#ff3300] transition-colors">About</a>
  </div>

  <div class="flex items-center gap-6 z-[101]">
    <a href="{root_path}quiz.html" class="hidden md:block px-6 py-2 bg-[#ff3300] text-white text-[10px] uppercase tracking-widest hover:bg-[#050505] transition-colors duration-300">
      Free Assessment
    </a>
    <button class="md:hidden flex items-center gap-2 group relative z-50 text-[#050505]" id="mobile-menu-btn">
      <span class="font-sans-tech text-[10px] uppercase tracking-widest font-bold transition-colors duration-300" id="menu-text">Menu</span>
      <div class="flex flex-col gap-1.5 w-8">
          <div class="w-full h-0.5 bg-current transition-all duration-300 origin-center" id="hamburger-top"></div>
          <div class="w-full h-0.5 bg-current transition-all duration-300 origin-center" id="hamburger-bottom"></div>
      </div>
    </button>
  </div>
</nav>

<!-- Mobile Menu Overlay -->
<div id="mobile-menu" class="fixed inset-0 bg-[#050505] text-[#f4f1ea] z-[90] translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] flex flex-col justify-center px-6 md:px-12">
    <div class="grid grid-cols-1 w-full max-w-7xl mx-auto gap-8">
        <div class="flex flex-col gap-2" id="mobile-links">
             <a href="{root_path}services.html" class="mobile-link block font-serif-display text-5xl md:text-7xl opacity-0 translate-x-[-20px] transition-all duration-500 hover:text-[#ff3300] hover:italic">Expertise</a>
             <a href="{root_path}locations.html" class="mobile-link block font-serif-display text-5xl md:text-7xl opacity-0 translate-x-[-20px] transition-all duration-500 delay-[50ms] hover:text-[#ff3300] hover:italic">Markets</a>
             <a href="{root_path}case-studies.html" class="mobile-link block font-serif-display text-5xl md:text-7xl opacity-0 translate-x-[-20px] transition-all duration-500 delay-[100ms] hover:text-[#ff3300] hover:italic">Case Studies</a>
             <a href="{root_path}about.html" class="mobile-link block font-serif-display text-5xl md:text-7xl opacity-0 translate-x-[-20px] transition-all duration-500 delay-[150ms] hover:text-[#ff3300] hover:italic">About</a>
             <a href="{root_path}contact.html" class="mobile-link block font-serif-display text-5xl md:text-7xl opacity-0 translate-x-[-20px] transition-all duration-500 delay-[200ms] hover:text-[#ff3300] hover:italic">Contact</a>
        </div>
        
        <div class="border-t border-[#f4f1ea]/10 pt-8 opacity-0 transition-all duration-500 delay-[300ms]" id="mobile-footer">
            <div class="flex flex-col gap-4">
                <p class="font-sans-tech text-xs uppercase tracking-widest text-[#ff3300]">Focus</p>
                <p class="font-serif-display text-2xl opacity-80 max-w-sm">"Navigating the EU AI Act: A strategic roadmap for 2026."</p>
                <a href="{root_path}quiz.html" class="mt-4 px-8 py-4 bg-[#ff3300] text-white text-xs uppercase tracking-widest hover:bg-white hover:text-[#050505] transition-colors w-fit">
                    Start Assessment
                </a>
            </div>
        </div>
    </div>
</div>
"""

FOOTER_TEMPLATE = """
<footer class="bg-[#f4f1ea] border-t border-[#050505]/10 pt-24 pb-12 px-6 md:px-12 mt-auto">
    <div class="max-w-[1400px] mx-auto">
        <div class="flex flex-col lg:flex-row justify-between items-start gap-16 mb-24">
            <div class="w-full lg:w-1/3">
                <h3 class="font-serif-display text-4xl italic mb-6">ai20.</h3>
                <p class="font-sans-tech text-sm leading-relaxed max-w-xs opacity-70">
                    Architecting the future of European enterprise through applied artificial intelligence and strategic governance.
                </p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-12 w-full lg:w-2/3">
                <div class="flex flex-col gap-6">
                    <span class="font-sans-tech text-[10px] uppercase tracking-widest border-b border-[#050505] pb-2 w-fit">Expertise</span>
                    <a href="{root_path}services.html" class="font-serif-display text-xl italic hover:text-[#ff3300]">Services</a>
                    <a href="{root_path}locations.html" class="font-serif-display text-xl italic hover:text-[#ff3300]">Markets</a>
                </div>
                <div class="flex flex-col gap-6">
                    <span class="font-sans-tech text-[10px] uppercase tracking-widest border-b border-[#050505] pb-2 w-fit">Company</span>
                    <a href="{root_path}about.html" class="font-serif-display text-xl italic hover:text-[#ff3300]">About</a>
                    <a href="{root_path}contact.html" class="font-serif-display text-xl italic hover:text-[#ff3300]">Contact</a>
                </div>
            </div>
        </div>
        <div class="flex flex-col md:flex-row justify-between items-end border-t border-[#050505]/10 pt-8 font-sans-tech text-[10px] uppercase tracking-widest opacity-40">
            <p>© 2026 ai20. Made in Berlin.</p>
        </div>
    </div>
</footer>
</body>
</html>
"""

# --- REGION OVERRIDES -------------------------------------------------------
# The templates above are authored EU-first. Swap the region-specific strings
# once here so every generated page (locations, niches, industries, core
# services) follows REGION without touching the many .format() call sites.

_REGION_SWITCHER = '<div id="region-switcher" class="hidden md:flex items-center border border-[#050505]/20 rounded-full overflow-hidden text-[10px] uppercase tracking-widest font-sans-tech">' + "".join(
    f'<button data-region="{r["key"]}" class="px-3 py-1.5 transition-colors '
    + ("bg-[#050505] text-[#f4f1ea]" if r["key"] == rc.REGION else "text-[#050505]/60 hover:text-[#ff3300]")
    + f'">{r["shortLabel"]}</button>'
    for r in rc.ALL_REGIONS.values()
) + "</div>"

# Nav: region focus quote, an Offers link, and the US|EU switcher.
NAV_TEMPLATE = NAV_TEMPLATE.replace(
    '"Navigating the EU AI Act: A strategic roadmap for 2026."',
    '"' + rc.REGION_CFG["focusQuote"] + '"',
).replace(
    '<a href="{root_path}locations.html" class="hover:text-[#ff3300] transition-colors">Markets</a>',
    '<a href="{root_path}offers.html" class="hover:text-[#ff3300] transition-colors">Offers</a>\n'
    '    <a href="{root_path}locations.html" class="hover:text-[#ff3300] transition-colors">Markets</a>',
).replace(
    '<a href="{root_path}quiz.html" class="hidden md:block px-6 py-2',
    _REGION_SWITCHER + '\n    <a href="{root_path}quiz.html" class="hidden md:block px-6 py-2',
)

FOOTER_TEMPLATE = FOOTER_TEMPLATE.replace(
    "Architecting the future of European enterprise through applied artificial intelligence and strategic governance.",
    rc.REGION_CFG["footerBlurb"] + "</p>\n                <p class=\"font-sans-tech text-[10px] uppercase tracking-widest opacity-50 mt-6\">"
    + rc.REGION_CFG["complianceLine"],
).replace(
    "© 2026 ai20. Made in Berlin.",
    "© 2026 ai20. " + rc.REGION_CFG["madeIn"],
)

# Core services: use the shared JSON source (region pricing + region-neutral copy).
CORE_SERVICES = [
    {
        "id": s["id"],
        "title": s["title"],
        "category": s["category"],
        "description": s["description"],
        "benefits": s["benefits"],
        "price": {
            "label": s["price"]["label"],
            "amount": rc.pick_regional({"eu": s["price"]["eu"], "us": s["price"]["us"]}),
        },
    }
    for s in rc.CORE_SERVICES
]


# Local offer teasers map onto real offers in offers.json, so the local pages
# link to a genuine (region-priced) offer page instead of a thin duplicate.
LOCAL_OFFER_MAP = {
    "ai-receptionist": "ai-receptionist",
    "lead-reactivation": "ai-sdr",
    "review-management": "reputation-ai",
    "missed-call-text-back": "ai-receptionist",
    "smart-quoting": "appointment-booking",
}
_OFFERS_BY_ID = {o["id"]: o for o in rc.OFFERS}


def local_offer_target(local_id):
    return LOCAL_OFFER_MAP.get(local_id, "ai-receptionist")


def local_offer_price(local_id):
    offer = _OFFERS_BY_ID.get(local_offer_target(local_id))
    if not offer:
        return ""
    return f"From {rc.fmt_price(offer['pricing']['dfy']['monthly'])}/mo"



def local_market_section(city, niche, data):
    """Render the genuinely-local part of a city x niche page.

    Only emits blocks for fields that are actually populated, so an
    unresearched city produces no fabricated claims.
    """
    if not data:
        return ""

    blocks = []
    cityname = city["city"]

    count = data.get("business_count")
    if count:
        blocks.append(
            f'<div class="p-6 border border-[#050505]/10 bg-white">'
            f'<span class="block font-serif-display text-4xl italic text-[#ff3300]">{count:,}</span>'
            f'<p class="text-xs uppercase tracking-widest opacity-60 mt-1">{niche["name"]} businesses in {cityname}</p></div>'
        )

    salary = data.get("receptionist_salary")
    if salary:
        blocks.append(
            f'<div class="p-6 border border-[#050505]/10 bg-white">'
            f'<span class="block font-serif-display text-4xl italic text-[#ff3300]">{rc.REGION_CFG["currency"]}{salary:,}</span>'
            f'<p class="text-xs uppercase tracking-widest opacity-60 mt-1">Local cost of the role AI replaces</p></div>'
        )

    ticket = data.get("avg_job_value")
    if ticket:
        blocks.append(
            f'<div class="p-6 border border-[#050505]/10 bg-white">'
            f'<span class="block font-serif-display text-4xl italic text-[#ff3300]">{rc.REGION_CFG["currency"]}{ticket:,}</span>'
            f'<p class="text-xs uppercase tracking-widest opacity-60 mt-1">Typical job value - one recovered call</p></div>'
        )

    prose = []
    if data.get("seasonality_note"):
        prose.append(data["seasonality_note"])
    if data.get("peak_season"):
        prose.append(f'Peak demand runs {data["peak_season"]}.')
    if data.get("licensing"):
        prose.append(data["licensing"])
    if data.get("local_note"):
        prose.append(data["local_note"])

    if not blocks and not prose:
        return ""

    stats_html = (
        f'<div class="grid sm:grid-cols-3 gap-4 mb-8">{"".join(blocks)}</div>' if blocks else ""
    )
    prose_html = (
        f'<p class="text-lg opacity-75 leading-relaxed max-w-3xl">{" ".join(prose)}</p>' if prose else ""
    )
    source = data.get("source_note")
    source_html = (
        f'<p class="text-[10px] uppercase tracking-widest opacity-40 mt-6">Source: {source}</p>'
        if source and data.get("verified")
        else ""
    )

    return f"""
            <section class="mb-24">
                <h2 class="font-serif-display text-4xl italic mb-8">The {niche['name']} market in {cityname}</h2>
                {stats_html}
                {prose_html}
                {source_html}
            </section>
    """


# --- GENERATORS ---

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

def generate_core_services():
    ensure_dir("services")
    for service in CORE_SERVICES:
        slug = service['id']
        root_path = "../"
        
        # Schema
        schema = {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": service['title'],
            "provider": {"@type": "Organization", "name": "ai20"},
            "description": service['description'],
            "offers": {
                "@type": "Offer",
                "price": service['price']['amount'],
                "priceCurrency": rc.REGION_CFG["currencyCode"]
            }
        }
        
        # Content
        import random
        random_cities = random.sample(CITIES, 4)
        random_industries = random.sample(INDUSTRIES, 3)

        content = f"""
        <main class="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
            <div class="mb-20">
                <a href="{root_path}services.html" class="text-[#ff3300] font-sans-tech text-xs uppercase tracking-widest hover:underline mb-4 block">← Back to Services</a>
                <span class="inline-block border border-[#050505] px-3 py-1 rounded-full text-[#050505] font-sans-tech text-[10px] uppercase tracking-[0.2em] mb-6">
                    {service['category']}
                </span>
                <h1 class="font-serif-display text-6xl md:text-8xl italic mb-8">{service['title']}</h1>
                <p class="text-xl md:text-2xl opacity-70 max-w-3xl leading-relaxed">{service['description']}</p>
            </div>
            
            <div class="grid lg:grid-cols-2 gap-24 items-start">
                <div class="space-y-16">
                    <div>
                        <h2 class="font-serif-display text-4xl italic mb-8">Strategic Impact</h2>
                        <ul class="space-y-6">
                            {''.join([f'<li class="flex items-start gap-4 text-lg"><span class="text-[#ff3300] mt-1.5">•</span> {item}</li>' for item in service['benefits']])}
                        </ul>
                    </div>
                    
                    <div class="bg-[#f4f1ea] border border-[#050505]/10 p-12">
                        <h3 class="font-serif-display text-3xl italic mb-6">Project Structure</h3>
                         <div class="space-y-8 relative before:absolute before:left-[7px] before:top-2 before:h-full before:w-[1px] before:bg-[#050505]/20">
                            <div class="relative pl-8">
                                <div class="absolute left-0 top-2 w-4 h-4 rounded-full bg-[#ff3300] border-2 border-[#f4f1ea]"></div>
                                <h4 class="font-sans-tech text-xs uppercase tracking-widest mb-2 font-bold">Phase 1: Discovery</h4>
                                <p class="opacity-70 text-sm">Deep dive into current infrastructure and business goals.</p>
                            </div>
                            <div class="relative pl-8">
                                <div class="absolute left-0 top-2 w-4 h-4 rounded-full bg-[#050505] border-2 border-[#f4f1ea]"></div>
                                <h4 class="font-sans-tech text-xs uppercase tracking-widest mb-2 font-bold">Phase 2: Strategy/Build</h4>
                                <p class="opacity-70 text-sm">Developing the roadmap or implementing the solution.</p>
                            </div>
                            <div class="relative pl-8">
                                <div class="absolute left-0 top-2 w-4 h-4 rounded-full bg-[#050505] border-2 border-[#f4f1ea]"></div>
                                <h4 class="font-sans-tech text-xs uppercase tracking-widest mb-2 font-bold">Phase 3: Adoption</h4>
                                <p class="opacity-70 text-sm">Training, handover, and performance monitoring.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Clever Interlinking: Industries -->
                    <div>
                         <h3 class="font-serif-display text-2xl italic mb-6">Vertical Expertise</h3>
                         <p class="mb-6 opacity-70">This service is particularly relevant for:</p>
                         <div class="flex flex-wrap gap-4">
                            {''.join([f'<a href="{root_path}industries/{ind["slug"]}.html" class="px-4 py-2 border border-[#050505]/20 hover:bg-[#050505] hover:text-white transition-colors text-xs uppercase tracking-widest">{ind["name"]}</a>' for ind in random_industries])}
                         </div>
                    </div>

                    <!-- FAQ Section -->
                    <div class="border-t border-[#050505]/10 pt-12">
                        <h3 class="font-serif-display text-3xl italic mb-8">Frequently Asked Questions</h3>
                        <div class="space-y-8">
                            <div>
                                <h4 class="font-bold mb-2">How quickly can we start?</h4>
                                <p class="opacity-70 text-sm">We typically begin with a discovery call within 48 hours. Strategic roadmaps are delivered in 2-3 weeks.</p>
                            </div>
                            <div>
                                <h4 class="font-bold mb-2">Is this compliant for my industry?</h4>
                                <p class="opacity-70 text-sm">Yes. {rc.REGION_CFG['complianceLine']} We scope the right controls for your vertical before anything goes live.</p>
                            </div>
                             <div>
                                <h4 class="font-bold mb-2">Do you work with existing teams?</h4>
                                <p class="opacity-70 text-sm">Absolutely. Our DWY (Done-With-You) approach ensures your internal team is upskilled throughout the process.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="sticky top-32">
                    <div class="bg-[#050505] text-[#f4f1ea] p-12">
                        <div class="mb-12">
                            <h3 class="font-serif-display text-3xl italic mb-2">Start Engagement</h3>
                            <p class="opacity-60 text-sm">Book a confidential consultation to discuss requirements.</p>
                        </div>
                        
                        <div class="space-y-8 mb-12 border-t border-[#f4f1ea]/20 pt-8">
                            <div>
                                <span class="block text-xs uppercase tracking-widest opacity-50 mb-1">Engagement Model</span>
                                <span class="font-serif-display text-2xl">{service['price']['label']}</span>
                            </div>
                             <div>
                                <span class="block text-xs uppercase tracking-widest opacity-50 mb-1">Investment</span>
                                <span class="font-serif-display text-2xl">{service['price']['amount']}</span>
                            </div>
                        </div>

                        <button onclick="window.AI20Quiz.open({{ 'serviceId': '{slug}', 'title': '{service['title']}', 'source': 'core_service_page' }})" class="w-full bg-[#ff3300] text-white py-5 text-sm uppercase tracking-widest hover:bg-white hover:text-[#050505] transition-colors font-bold">
                            Book Consultation
                        </button>
                        
                        <p class="mt-6 text-[10px] opacity-40 text-center uppercase tracking-widest">
                            Limited Availability for Q1 2026
                        </p>
                    </div>

                    <!-- Clever Interlinking: Locations -->
                    <div class="mt-8 p-8 bg-[#f4f1ea] border border-[#050505]/10">
                         <h4 class="font-sans-tech text-xs uppercase tracking-widest mb-4">Available in Top Hubs</h4>
                         <ul class="text-sm space-y-2">
                             {''.join([f'<li><a href="{root_path}locations/{city["slug"]}.html" class="opacity-60 hover:opacity-100 hover:text-[#ff3300] hover:underline">Deploy {service["title"]} in {city["city"]} →</a></li>' for city in random_cities])}
                         </ul>
                    </div>
                </div>
            </div>
            
            <div class="mt-32 pt-20 border-t border-[#050505]/10">
                 <h2 class="font-serif-display text-4xl italic mb-12">Explore Other Services</h2>
                 <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {''.join([f'<a href="{root_path}services/{s["id"]}.html" class="p-6 border border-[#050505]/10 hover:bg-[#ff3300] hover:text-white transition-colors group"><span class="block font-serif-display text-xl italic mb-2">{s["title"]}</span><span class="text-[10px] uppercase tracking-widest opacity-50 group-hover:opacity-100">View Details →</span></a>' for s in (CORE_SERVICES[:4] if slug != CORE_SERVICES[0]['id'] else CORE_SERVICES[4:])])}
                 </div>
            </div>
        </main>
        """
        
        full_html = HEAD_TEMPLATE.format(
            title=f"{service['title']} | ai20 Strategic Services",
            description=service['description'],
            root_path=root_path,
            schema=f'<script type="application/ld+json">{json.dumps(schema)}</script>'
        ) + NAV_TEMPLATE.format(root_path=root_path) + content + FOOTER_TEMPLATE.format(root_path=root_path)
        
        with open(f"services/{slug}.html", "w", encoding="utf-8") as f:
            f.write(full_html)


def generate_services():
    ensure_dir("services")
    for offer in OFFERS:
        slug = offer['id']
        root_path = "../"
        
        # Schema
        schema = {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": offer['title'],
            "provider": {"@type": "Organization", "name": "ai20"},
            "description": offer['description'],
            "offers": {
                "@type": "Offer",
                "price": offer['price']['discountedSetup'],
                "priceCurrency": rc.REGION_CFG["currencyCode"]
            }
        }
        
        # Content
        content = f"""
        <main class="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
            <div class="mb-16">
                <a href="{root_path}services.html" class="text-[#ff3300] font-sans-tech text-xs uppercase tracking-widest hover:underline mb-4 block">← Back to Services</a>
                <h1 class="font-serif-display text-6xl md:text-7xl italic mb-8">{offer['title']}</h1>
                <p class="text-xl opacity-70 max-w-2xl leading-relaxed">{offer['description']}</p>
            </div>
            
            <div class="grid lg:grid-cols-2 gap-16 items-start">
                <div class="bg-white/50 border border-[#050505]/10 p-12 rounded-sm">
                    <h2 class="font-serif-display text-3xl italic mb-8">What's Included</h2>
                    <ul class="space-y-4 font-sans-tech text-sm">
                        {''.join([f'<li class="flex items-center gap-3"><i data-lucide="check" class="text-[#ff3300] w-5 h-5"></i> {item}</li>' for item in offer['valueStack']])}
                    </ul>
                    <div class="mt-12 pt-8 border-t border-[#050505]/10">
                        <div class="flex items-baseline gap-4 mb-2">
                            <span class="text-3xl font-bold text-[#ff3300]">€{offer['price']['discountedSetup']:,}</span>
                            <span class="text-sm opacity-50 line-through">€{offer['price']['setup']:,}</span>
                        </div>
                        <p class="text-xs opacity-60 uppercase tracking-widest mb-8">+ €{offer['price']['monthly']}/mo management</p>
                        <button onclick="window.AI20Quiz.open({{ 'serviceId': '{slug}', 'title': '{offer['title']}', 'source': 'service_page' }})" class="w-full bg-[#050505] text-[#f4f1ea] py-4 text-xs uppercase tracking-widest hover:bg-[#ff3300] transition-colors">
                            Request Implementation
                        </button>
                    </div>
                </div>
                
                <div>
                    <h3 class="font-serif-display text-3xl italic mb-8">Why Automate This?</h3>
                    <div class="space-y-8">
                        <div>
                            <h4 class="font-sans-tech text-xs uppercase tracking-widest mb-2 text-[#ff3300]">Efficiency</h4>
                            <p class="opacity-70 text-sm">Reduce manual hours by up to 90%. Our systems work 24/7 without breaks.</p>
                        </div>
                        <div>
                            <h4 class="font-sans-tech text-xs uppercase tracking-widest mb-2 text-[#ff3300]">Scalability</h4>
                            <p class="opacity-70 text-sm">Handle infinite volume without hiring more staff. Scale instantly as you grow.</p>
                        </div>
                        <div>
                            <h4 class="font-sans-tech text-xs uppercase tracking-widest mb-2 text-[#ff3300]">Accuracy</h4>
                            <p class="opacity-70 text-sm">Eliminate human error in repetitive tasks. Ensure 100% compliance and consistency.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        """
        
        full_html = HEAD_TEMPLATE.format(
            title=f"{offer['title']} | ai20 Services",
            description=offer['description'],
            root_path=root_path,
            schema=f'<script type="application/ld+json">{json.dumps(schema)}</script>'
        ) + NAV_TEMPLATE.format(root_path=root_path) + content + FOOTER_TEMPLATE.format(root_path=root_path)
        
        with open(f"services/{slug}.html", "w", encoding="utf-8") as f:
            f.write(full_html)

def generate_local_pages(city):
    """Generates the Granular Local Pages"""
    # Create directory for city niches if not exists
    city_dir = f"locations/{city['slug']}"
    ensure_dir(city_dir)

    for niche in LOCAL_NICHES:
        niche_slug = niche['id']
        niche_dir = f"{city_dir}/{niche_slug}"
        ensure_dir(niche_dir)
        
        root_path = "../../../"

        local_data = rc.local_market(city["slug"], niche_slug)
        indexable = rc.is_indexable(city["slug"], niche_slug)
        # Pages without verified local data must not be indexed - this is what
        # phases the rollout as research lands.
        head_extra = "" if indexable else '<meta name="robots" content="noindex,follow">'
        
        # 1. Generate Niche Page (locations/{city}/{niche}/index.html)
        
        niche_content = f"""
        <main class="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
            <div class="mb-16 text-center">
                <a href="{root_path}locations/{city['slug']}.html" class="text-[#ff3300] font-sans-tech text-xs uppercase tracking-widest hover:underline mb-4 block">← Back to {city['city']}</a>
                <span class="inline-block border border-[#050505] px-3 py-1 rounded-full text-[#050505] font-sans-tech text-[10px] uppercase tracking-[0.2em] mb-6">
                    AI for {niche['category']}
                </span>
                <h1 class="font-serif-display text-5xl md:text-7xl italic mb-8">
                    Artificial Intelligence for <br/>
                    <span class="text-[#ff3300]">{niche['name']} in {city['city']}</span>.
                </h1>
                <p class="text-xl opacity-70 max-w-2xl mx-auto leading-relaxed">
                    Local {niche['name'].lower()} businesses in {city['city']} are automating operations to cut costs and dominate the market. Don't get left behind.
                </p>
            </div>

            <!-- Pain Points -->
            <div class="grid md:grid-cols-3 gap-8 mb-24">
                 {''.join([f'''
                <div class="p-8 bg-white border border-[#050505]/10">
                    <div class="w-10 h-10 bg-[#ff3300]/10 flex items-center justify-center mb-4 rounded-full text-[#ff3300]">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </div>
                    <h3 class="font-bold mb-2">{title}</h3>
                    <p class="text-sm opacity-70">Stop losing revenue to this common industry problem.</p>
                </div>
                ''' for title in niche['pain_points']])}
            </div>

            {local_market_section(city, niche, local_data)}

            <!-- Offers Grid -->
            <h2 class="font-serif-display text-4xl italic mb-12 text-center">Recommended AI Solutions</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                 {''.join([f'''
                <div class="border border-[#050505]/10 p-8 hover:border-[#ff3300] transition-all group flex flex-col h-full bg-white">
                    <h3 class="font-serif-display text-2xl italic mb-2 group-hover:text-[#ff3300] transition-colors">{offer['title']}</h3>
                    <p class="text-xs uppercase tracking-widest opacity-50 mb-4">{offer['tagline']}</p>
                    <p class="text-sm opacity-70 mb-6 flex-grow">{offer['description']}</p>
                    <div class="mt-auto border-t border-[#050505]/10 pt-6">
                        <span class="block text-xs font-bold text-[#ff3300] mb-2">{local_offer_price(offer['id'])}</span>
                        <a href="{root_path}services/{local_offer_target(offer['id'])}.html" class="block w-full text-center py-3 bg-[#050505] text-[#f4f1ea] text-[10px] uppercase tracking-widest hover:bg-[#ff3300] transition-colors">
                            View Offer
                        </a>
                    </div>
                </div>
                ''' for offer in LOCAL_OFFERS])}
            </div>
            
            <!-- Book CTA -->
             <div class="bg-[#050505] text-[#f4f1ea] p-12 md:p-24 text-center">
                <h2 class="font-serif-display text-4xl md:text-5xl italic mb-8 mx-auto max-w-3xl">
                    Exclusive Beta for {niche['name']} Businesses in {city['city']}?
                </h2>
                <p class="text-lg opacity-70 mb-12 max-w-xl mx-auto">
                    We are looking for 3 partners in {city['city']} to deploy our full AI stack at a preferential rate in exchange for a case study.
                </p>
                <button onclick="window.AI20Quiz.open({{ 'city': '{city['city']}', 'niche': '{niche['name']}', 'source': 'niche_page' }})" class="bg-[#ff3300] text-white px-8 py-4 text-xs uppercase tracking-widest hover:bg-white hover:text-[#050505] transition-colors">
                    Apply for Beta Access
                </button>
            </div>
        </main>
        """
        
        full_html = HEAD_TEMPLATE.format(
            title=f"AI for {niche['name']} in {city['city']} | ai20 Local",
            description=f"Automate your {niche['name']} business in {city['city']} with AI. {niche['description']}",
            root_path=root_path,
            schema=head_extra
        ) + NAV_TEMPLATE.format(root_path=root_path) + niche_content + FOOTER_TEMPLATE.format(root_path=root_path)

        with open(f"{niche_dir}/index.html", "w", encoding="utf-8") as f:
            f.write(full_html)
            

def generate_locations():
    ensure_dir("locations")
    for city in CITIES:
        slug = city['slug']
        root_path = "../"
        
        # Schema
        schema = {
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": f"ai20 {city['city']}",
            "description": f"Premier AI Agency serving {city['city']}, {city['country']}.",
            "areaServed": {
                "@type": "City",
                "name": city['city']
            }
        }
        
        # Generate Sub-pages
        generate_local_pages(city)
        
        content = f"""
        <main class="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
            <div class="text-center mb-24">
                <span class="text-[#ff3300] font-sans-tech text-xs uppercase tracking-widest mb-4 block">{city['country']} Network</span>
                <h1 class="font-serif-display text-6xl md:text-8xl italic mb-8">ai20 {city['city']}.</h1>
                <p class="text-xl opacity-70 max-w-2xl mx-auto leading-relaxed">
                    Bringing Silicon Valley-grade artificial intelligence infrastructure to <span class="text-[#050505] font-medium">{city['city']}'s</span> leading enterprises.
                </p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-8 mb-24">
                <div class="p-8 border border-[#050505]/10 hover:border-[#ff3300] transition-colors group">
                    <h3 class="font-serif-display text-2xl italic mb-4">Local Strategy</h3>
                    <p class="text-sm opacity-70">Tailored AI implementation roadmaps designed for the {city['city']} market landscape.</p>
                </div>
                <div class="p-8 border border-[#050505]/10 hover:border-[#ff3300] transition-colors group">
                    <h3 class="font-serif-display text-2xl italic mb-4">Compliance</h3>
                    <p class="text-sm opacity-70">{rc.REGION_CFG['complianceLine']} Secure by default.</p>
                </div>
                <div class="p-8 border border-[#050505]/10 hover:border-[#ff3300] transition-colors group">
                    <h3 class="font-serif-display text-2xl italic mb-4">24/7 Support</h3>
                    <p class="text-sm opacity-70">Round-the-clock monitoring and optimization for your AI infrastructure.</p>
                </div>
            </div>
            
            <div class="bg-[#050505] text-[#f4f1ea] p-12 md:p-24 text-center">
                <h2 class="font-serif-display text-4xl md:text-5xl italic mb-8">Ready to modernize your {city['city']} business?</h2>
                <button onclick="window.AI20Quiz.open({{ 'city': '{city['city']}', 'source': 'location_page' }})" class="bg-[#ff3300] text-white px-8 py-4 text-xs uppercase tracking-widest hover:bg-white hover:text-[#050505] transition-colors">
                    Get Your AI Roadmap
                </button>
            </div>
            
            <div class="mt-24">
                <h3 class="font-serif-display text-3xl italic mb-8 text-center">Enterprise Solutions</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
                    {''.join([f'<a href="{root_path}services/{o["id"]}.html" class="p-4 border border-[#050505]/10 text-xs font-sans-tech hover:bg-[#ff3300] hover:text-white transition-colors">{o["title"]}</a>' for o in OFFERS[:8]])}
                </div>
                
                <h3 class="font-serif-display text-3xl italic mb-8 text-center">Local Industry Solutions</h3>
                <p class="text-center opacity-60 mb-8 max-w-2xl mx-auto">Specific AI tools designed for local {city['city']} service providers.</p>
                <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {''.join([f'<a href="{city["slug"]}/{n["id"]}/index.html" class="p-4 border border-[#050505]/10 text-xs font-sans-tech hover:bg-[#ff3300] hover:text-white transition-colors text-center block">{n["name"]}</a>' for n in LOCAL_NICHES])}
                </div>
            </div>
        </main>
        """
        
        full_html = HEAD_TEMPLATE.format(
            title=f"AI Agency {city['city']} | ai20",
            description=f"Leading AI Agency in {city['city']}, {city['country']}. Enterprise-grade automation and AI implementation.",
            root_path=root_path,
            schema=f'<script type="application/ld+json">{json.dumps(schema)}</script>'
        ) + NAV_TEMPLATE.format(root_path=root_path) + content + FOOTER_TEMPLATE.format(root_path=root_path)
        
        with open(f"locations/{slug}.html", "w", encoding="utf-8") as f:
            f.write(full_html)

def generate_industries():
    ensure_dir("industries")
    for ind in INDUSTRIES:
        slug = ind['slug']
        root_path = "../"
        
        content = f"""
        <main class="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
            <div class="mb-24">
                <span class="text-[#ff3300] font-sans-tech text-xs uppercase tracking-widest mb-4 block">Industry Solutions</span>
                <h1 class="font-serif-display text-6xl md:text-8xl italic mb-8">AI for {ind['name']}.</h1>
                <p class="text-xl opacity-70 max-w-2xl leading-relaxed">{ind['desc']}</p>
            </div>
            
            <div class="grid md:grid-cols-2 gap-12">
                <div class="p-12 bg-white border border-[#050505]/10">
                    <h3 class="font-serif-display text-3xl italic mb-6">Key Capabilities</h3>
                    <ul class="space-y-4 font-sans-tech text-sm opacity-80">
                        <li class="flex items-center gap-3"><span class="w-1.5 h-1.5 bg-[#ff3300]"></span> Process Automation</li>
                        <li class="flex items-center gap-3"><span class="w-1.5 h-1.5 bg-[#ff3300]"></span> Predictive Analytics</li>
                        <li class="flex items-center gap-3"><span class="w-1.5 h-1.5 bg-[#ff3300]"></span> Customer Personalization</li>
                        <li class="flex items-center gap-3"><span class="w-1.5 h-1.5 bg-[#ff3300]"></span> Regulatory Compliance</li>
                    </ul>
                </div>
                <div class="flex flex-col justify-center items-start">
                    <h2 class="font-serif-display text-4xl italic mb-6">Transform your {ind['name']} business.</h2>
                    <p class="text-sm opacity-70 mb-8 max-w-md">Our specialized AI models are trained on industry-specific data to ensure maximum relevance and accuracy.</p>
                    <a href="#" onclick="window.AI20Quiz.open({{ 'industry': '{ind['name']}', 'source': 'industry_page' }}); return false;" class="px-8 py-4 bg-[#050505] text-[#f4f1ea] text-xs uppercase tracking-widest hover:bg-[#ff3300] transition-colors">
                        Book Consultation
                    </a>
                </div>
            </div>
        </main>
        """
        
        full_html = HEAD_TEMPLATE.format(
            title=f"AI Solutions for {ind['name']} | ai20",
            description=ind['desc'],
            root_path=root_path,
            schema=""
        ) + NAV_TEMPLATE.format(root_path=root_path) + content + FOOTER_TEMPLATE.format(root_path=root_path)
        
        with open(f"industries/{slug}.html", "w", encoding="utf-8") as f:
            f.write(full_html)

def clean_generated():
    """Remove the previous region's output.

    Without this, switching REGION locally leaves the old region's city pages
    (and industry pages for verticals this region doesn't have) on disk, where
    Vite's HTML glob happily bundles them into the wrong regional site.
    """
    if os.path.isdir("locations"):
        shutil.rmtree("locations")

    # Drop industry pages for verticals not in this region (e.g. home-services in EU).
    keep = {v["slug"] for v in rc.REGION_CFG["verticals"]}
    if os.path.isdir("industries"):
        for f in os.listdir("industries"):
            if f.endswith(".html") and f[:-5] not in keep:
                os.remove(os.path.join("industries", f))


if __name__ == "__main__":
    print("Generating SEO pages...")
    clean_generated()
    print("- Cleaned previous region output")
    generate_core_services()
    print("- Core Services Generated")
    generate_services()
    print("- Productized Services Generated")
    generate_locations()
    print("- Locations & Local Niches Generated")
    generate_industries()
    print("- Industries Generated")
    print(f"Done! (region: {rc.REGION})")
