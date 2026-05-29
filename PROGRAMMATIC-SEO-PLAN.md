# VA Horizon — Programmatic SEO & Platform Scale Plan

**Created:** 2026-05-29
**Owner:** Youssef
**Goal:** Scale vahorizon.site from ~75 hand-authored pages into a templated, data-driven wholesaling platform that owns the real estate wholesaling keyword universe and earns AI citations, without thin-content penalties.

**Decisions locked (2026-05-29):**
- **Scope:** SEO content & tools at scale **+** interactive data products (directories, state-law pages). Stays a marketing site; no app build required for v1.
- **Engine:** Data-driven generator that keeps static GitHub Pages hosting (`.nojekyll` stays). No SSG migration, no server.
- **First playbook:** Glossary, then Locations expansion, then Personas, then State-law/data pages + directories.

---

## 1. Current State (Audit)

| Section | Pages | Notes |
|---------|-------|-------|
| Core | 11 | home, about, meet-your-va, ai-automations, apply, crm, industries/real-estate, partner, legal |
| Blog | 7 | BlogPosting |
| Case studies | 7 | proof assets |
| Comparison (`/compare/`) | 7 | vs MyOutdesk, REVA, in-house, Upwork, OnlineJobs.ph + "best" listicle |
| Tools (`/tools/`) | 7 | ROI, cost, budget, call-volume, MAO, SMS-compliance calculators |
| Locations (`/locations/`) | 10 | cold-calling-va-[city] |
| Guides (`/guides/`) | ~28 | 4 hubs: Cold Calling, HighLevel CRM, SMS Marketing, Hire a Real Estate VA |
| **Total** | **~75** | Strong topical base across the funnel |

### What is working
- Real topical authority across 4 guide hubs with internal linking + breadcrumb/FAQ schema.
- Comparison and tools pages capture commercial + tool intent.
- `llms.txt` maintained for AI crawlers; design system is consistent and on-brand.

### What blocks scale (the core problem)
1. **Every page is a standalone HTML file** with nav, footer, head, schema, and styles inlined. There is no SSG (`.nojekyll` present; no `_config.yml`, `_layouts`, `_data`). Shared edits are pushed with brittle Python find/replace scripts (`update_header.py`, `update_links.py`). Producing 100+ location/persona/glossary pages this way is not viable.
2. **Silent systematic errors.** Example: `/locations/cold-calling-va-atlanta/` ships a canonical of `https://www.vahorizon.site/industries/real-estate/cold-calling-va-atlanta/` — a URL that does not match where the page lives or what the sitemap lists. This canonical/sitemap mismatch is exactly the bug class a generator removes by computing canonical from the slug.
3. **No data layer.** City stats, term definitions, persona pain points, and state rules live as prose copy-pasted per page. There is no single source of truth, so updates do not propagate and uniqueness is unverifiable.
4. **Manual sitemap + internal-link + llms.txt upkeep.** Each new page requires hand-editing three files; drift is already visible in past sessions.

**Conclusion:** Before adding volume, install a generation system. Then scaling is data entry, not HTML authoring.

---

## 2. Vision — "Full Wholesaling Platform"

Position vahorizon.site as the **operating reference for real estate wholesaling**, not just a VA agency landing site. Two layers:

- **Layer A — Topical authority at scale (SEO content & tools).** Own every meaningful query a wholesaler types: definitions, how-tos, city/service intent, persona intent, comparisons, and free calculators. This is the demand-capture engine.
- **Layer B — Interactive data products (defensible).** Pages backed by structured data that competitors cannot trivially copy: a wholesaling glossary, TCPA / cold-calling rules by state, wholesaling-legality by state, and curated directories (cash buyers, title companies, REIA groups by metro). These earn links and AI citations and feed Layer A's internal linking.

Every page, in both layers, routes to one conversion: **book a call / apply**.

---

## 3. The Systemization Engine (build this first)

A zero-runtime **Node generator** that turns data files + templates into committed static HTML. It runs locally (or in CI), writes `index.html` files into the existing directory structure, and regenerates `sitemap.xml`, internal-link blocks, and `llms.txt` entries. Hosting stays exactly as-is (GitHub Pages, `.nojekyll`). Node is chosen because `package.json` + `node_modules` already exist; Python scripts get retired.

### 3.1 Directory layout
```
/generator/
├── build.mjs                 # entry: reads data + templates → writes pages
├── lib/
│   ├── render.mjs            # tiny template engine (Eta or Mustache; logic-light)
│   ├── sitemap.mjs           # regenerates /sitemap.xml from a manifest
│   ├── llms.mjs              # regenerates /llms.txt sections
│   ├── links.mjs            # builds VAH_INTERNAL_LINKS blocks (hub/spoke rules)
│   └── lint.mjs              # thin-content + uniqueness + canonical/meta linter
├── partials/                 # extracted ONCE from existing pages
│   ├── head.html             # meta/OG/twitter/favicons/CSS (token-driven)
│   ├── nav.html              # the shared site-header
│   ├── footer.html           # the shared footer
│   ├── breadcrumb.html
│   ├── faq.html              # accordion, loops over faq[]
│   ├── cta.html
│   └── internal-links.html
├── templates/
│   ├── glossary-term.html
│   ├── location.html
│   ├── persona.html
│   ├── state-law.html
│   └── directory.html
└── data/
    ├── glossary.json
    ├── locations.json
    ├── personas.json
    ├── states.json
    └── directories/*.json
```

### 3.2 How it works
1. `build.mjs` loads each `data/*.json` (an array of page records).
2. For each record it renders `templates/<type>.html`, which `include`s the shared partials. Tokens like `{{title}}`, `{{city}}`, `{{canonical}}` are filled from the record; `canonical` is **derived from the slug**, never typed by hand (kills the Atlanta-style bug).
3. Output is written to the record's directory (e.g. `/glossary/assignment-contract/index.html`).
4. After all pages render, the generator regenerates `sitemap.xml` (segmented), the `VAH_INTERNAL_LINKS` blocks site-wide, and the relevant `llms.txt` sections from the same manifest. One source of truth, three artifacts always in sync.
5. `lint.mjs` runs as a gate (see §6) and fails the build on thin/duplicate/missing-meta pages.

### 3.3 Partials = the end of `update_header.py`
Extract the current nav and footer into `partials/nav.html` and `partials/footer.html` **once**. From then on, a nav change is one edit + rebuild, propagated to every generated page. (Existing hand-authored pages can be migrated into the generator incrementally; start with new programmatic pages.)

### 3.4 npm scripts
```jsonc
"scripts": {
  "gen": "node generator/build.mjs",          // build all page types
  "gen:glossary": "node generator/build.mjs --only=glossary",
  "lint:seo": "node generator/lib/lint.mjs",   // thin-content + canonical/meta checks
  "sitemap": "node generator/lib/sitemap.mjs"
}
```

**Acceptance for the engine:** regenerating a single existing location page from data produces byte-equivalent on-brand HTML (same CSS order, nav, footer, schema graph) with a correct self-referencing canonical, and `npm run gen` rebuilds sitemap + internal links + llms.txt with zero manual edits.

---

## 4. Playbook Roadmap (with page-count math)

Priority order matches the locked decision. Each playbook = one template + one data file.

### Phase 1 — Glossary (`/glossary/[term]/`) — FIRST
- **Pattern:** "what is [term]", "[term] meaning", "[term] in real estate".
- **Volume:** ~80–150 terms (ARV, MAO, assignment contract, double close, wholetail, novation, subject-to, EMD, POF, dispo, JV, driving for dollars, skip tracing, absentee owner, etc.).
- **Data fields:** `slug, term, aliases[], short_definition (40–60 words, citation-ready), long_explanation, formula?, example, related_terms[], related_guides[], faq[]`.
- **Schema:** `DefinedTerm` + `BreadcrumbList` + `FAQPage`. Wrap the hub in `DefinedTermSet`.
- **Why first:** most templatable, lowest risk, highest internal-link surface (every term links to relevant guides/tools/locations), and the strongest AI-citation play (LLMs love crisp definitions). It validates the engine on the safest content type.
- **Internal linking:** each term → 2–4 related terms + 1–2 guides + 1 tool where relevant (e.g. MAO → MAO calculator; ARV → ROI calculator).

### Phase 2 — Locations expansion (`/locations/[service]-va-[city]/`)
- **Pattern:** "[service] VA in [city]", "real estate cold caller [city]".
- **Volume:** Matrix of services × cities. Start by lifting the 10 cities to a clean data model, fix the canonical bug, then expand to 40–60 metros and add services beyond cold calling (acquisitions manager, dispo manager, lead manager, SMS). 4 services × 40 cities = up to 160 pages — gate by real demand, not the full cartesian product.
- **Data fields:** `slug, service, city, state, county_list[], median_price, target_zips[], market_notes[], faq[]`.
- **Schema:** `Service` with `areaServed: City` + `BreadcrumbList` + `FAQPage`.
- **Thin-content guard:** require ≥3 city-specific data points (zips, counties, median price, market note) per page or the linter rejects it. No "swap the city name" pages.
- **Fix on migration:** canonical derived from slug; choose ONE canonical path (`/locations/...`) and 301/standardize away from the `/industries/real-estate/...` variant.

### Phase 3 — Personas (`/real-estate-va-for-[audience]/` or `/solutions/[audience]/`)
- **Pattern:** "[VA/service] for [audience]".
- **Volume:** ~8–15 audiences: wholesalers, fix-and-flippers, buy-and-hold landlords, agents/teams, novation investors, creative-finance investors, land investors, short-term-rental operators, new investors.
- **Data fields:** `slug, audience, pain_points[], workflow_fit, which_roles[] (cold caller / AM / dispo / lead mgr), proof_case_study, faq[]`.
- **Schema:** `Service` + `BreadcrumbList` + `FAQPage`.

### Phase 4 — State-law / data pages + directories (Layer B, defensible)
- **State law pages** `/wholesaling-laws/[state]/` and `/tcpa-cold-calling-rules/[state]/` — wholesaling legality, licensing nuance, and calling/SMS rules per state (50 each = up to 100 pages). High link/citation value. **Requires a fact-checking pass**; mark clearly as informational, not legal advice.
- **Directories** `/directory/cash-buyers/[metro]/`, `/directory/title-companies/[state]/`, `/directory/reia-groups/[metro]/` — curated structured listings (`ItemList` schema). Strongest defensibility; build only where you can source/maintain accurate data.
- **Data fields (state):** `slug, state, legal_status, licensing_notes, assignment_rules, sms_call_rules, last_reviewed, sources[], faq[]`.
- **Schema:** `Article`/`FAQPage` for law pages; `ItemList` for directories; `BreadcrumbList` throughout.

### Volume summary (demand-gated, not max)
| Phase | Playbook | Realistic page count |
|-------|----------|----------------------|
| 1 | Glossary | 80–150 |
| 2 | Locations (svc × city) | 60–160 |
| 3 | Personas | 8–15 |
| 4 | State law + directories | 100–200 |
| | **New pages** | **~250–500** on top of current 75 |

---

## 5. Internal Linking Architecture

Hub-and-spoke, generated automatically from the manifest (no hand-linking):
- **Hubs:** `/glossary/`, `/locations/`, `/solutions/` (personas), `/wholesaling-laws/`, `/directory/`, plus existing `/guides/`, `/tools/`, `/compare/`.
- **Spoke rules (encoded in `links.mjs`):**
  - Every spoke links up to its hub + 3–6 sibling spokes (the `VAH_INTERNAL_LINKS` block).
  - Cross-type links by tag: glossary term ↔ matching guide ↔ matching tool ↔ matching location (e.g. MAO term ↔ MAO calculator ↔ MAO section in offer guide).
  - Every page links to one conversion page (`/apply/` or Calendly).
- **No orphans:** the linter fails any page with <2 inbound internal links once the manifest is built.
- **Breadcrumbs:** generated with matching `BreadcrumbList` JSON-LD on every page.

---

## 6. Thin-Content & Quality Safeguards (non-negotiable for pSEO)

`lint.mjs` runs on every build and **fails the build** on:
- **Min unique content:** glossary ≥250 words, location/persona ≥600, state ≥700, with a uniqueness check (shingling/similarity) flagging any two pages >80% similar.
- **Required unique fields per type** (e.g. location must have city-specific zips + counties + a market note; empty/placeholder = reject).
- **Meta integrity:** unique `<title>` and `<meta description>` per page; canonical must equal the page's own absolute URL with trailing slash; OG/Twitter present.
- **Schema present and valid** for the page type.
- **Index control:** any page that cannot meet the uniqueness/data bar is emitted with `noindex` (or not generated). Better 150 strong pages than 500 thin ones.

This is the difference between a moat and a Google penalty. Treat the linter as a release gate, not a suggestion.

---

## 7. Indexation Strategy
- **Segmented sitemaps:** `sitemap-core.xml`, `sitemap-guides.xml`, `sitemap-glossary.xml`, `sitemap-locations.xml`, `sitemap-personas.xml`, `sitemap-states.xml`, `sitemap-directory.xml`, tied together by a `sitemap-index.xml`. All regenerated by `sitemap.mjs`.
- **Phased submission:** ship and index one playbook at a time so you can read GSC signal per type before scaling the next.
- **Crawl budget:** keep `robots.txt` clean; noindex any utility/thin variants; avoid faceted URL explosion (gate the service×city matrix by demand).
- **AI crawlers:** regenerate `llms.txt` sections per playbook so GPTBot/ClaudeBot/PerplexityBot get the new hubs.

---

## 8. Schema Templates (per type)
| Page type | Primary schema | Plus |
|-----------|----------------|------|
| Glossary term | `DefinedTerm` (hub: `DefinedTermSet`) | `BreadcrumbList`, `FAQPage` |
| Location | `Service` + `areaServed:City` | `BreadcrumbList`, `FAQPage` |
| Persona | `Service` | `BreadcrumbList`, `FAQPage` |
| State law | `Article` | `BreadcrumbList`, `FAQPage` |
| Directory | `ItemList` | `BreadcrumbList` |
| Tools (existing) | `SoftwareApplication` | `BreadcrumbList`, `FAQPage` |

All emitted as a single `@graph` JSON-LD block by the template, referencing the shared `#organization` node.

---

## 9. Measurement / KPIs
- **Indexation rate** per sitemap segment (GSC coverage).
- **Ranking + impressions** per playbook (track head terms per type).
- **AI citations** (brand mentions / Perplexity / AI Overview appearances) for glossary + state pages.
- **Engagement:** scroll/dwell on programmatic pages vs hand-authored baseline.
- **Conversions:** calls booked / applies attributed to programmatic entry pages.
- **Quality watch:** thin-content warnings, ranking drops, crawl errors, manual actions.

---

## 10. Phased Execution Timeline

| Phase | Work | Outcome |
|-------|------|---------|
| **0 — Engine** | Build `/generator/`; extract nav/footer/head partials; port the 10 location pages into `locations.json` + `location.html`; wire sitemap/links/llms regeneration + linter. | Generator proven against existing pages; canonical bug fixed. |
| **1 — Glossary** | Write `glossary.json` (start 40 terms, grow to 100+), `glossary-term.html`, `/glossary/` hub; generate; submit `sitemap-glossary.xml`. | First programmatic playbook live; AI-citation surface. |
| **2 — Locations** | Expand cities + services in data; regenerate; standardize canonical to `/locations/`. | Demand-gated city×service coverage. |
| **3 — Personas** | `personas.json` + template; `/solutions/` hub. | Segment-intent capture. |
| **4 — State + directories** | Fact-checked `states.json`; curated directory data; `ItemList` pages. | Defensible Layer-B moat. |
| **Ongoing** | Add data rows; linter gates quality; monitor GSC per segment. | Scaling = data entry. |

---

## 11. Immediate Quick Wins (independent of the engine)
1. **Fix the location canonical mismatch** (`/locations/...` pages canonicalizing to `/industries/real-estate/...`). Pick one path, fix canonical + sitemap + internal links.
2. **Confirm `/locations/` vs `/industries/real-estate/` canonical home** for city pages and 301 the loser.
3. **Decide the glossary URL pattern** now (`/glossary/[term]/`) so internal links from guides can start pointing at it.

---

## 12. Open Questions to Resolve Before Phase 0
- Generator language confirmed Node (retire the Python scripts)? Recommended yes.
- Template lib preference: zero-dep string replace vs Eta/Mustache? Recommend **Eta** (fast, logic-light, partial includes).
- Migrate existing 75 pages into the generator over time, or only generate net-new programmatic pages and leave legacy as-is? Recommend incremental migration starting with locations.

---

*This plan keeps every brand, CSS-order, schema, and "no em dash" rule in `CLAUDE.md`, `DESIGN_SYSTEM.md`, and `va-horizon-operations.md`. The generator encodes those rules so compliance is automatic rather than manual.*
