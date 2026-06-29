# VA Horizon — Master Execution Plan (Overnight)
**Date:** 2026-06-29
**Author:** Claude (Opus 4.8), grounded in a 4-stream audit (technical, content/GEO, CRO/design ×2 cross-checked, off-site/authority) + direct repo verification + GSC data + all prior strategy docs.
**Status:** Plan only. Nothing in here is executed yet.

---

## Context — why this plan exists

VA Horizon is a **mature ~285-page site** (Node generator → gitignored `_site/` → Vercel, `trailingSlash:true`, `https://www.vahorizon.site/`). It already has: a programmatic generator, glossary/locations/solutions/compare/alternatives/reviews/guides sections, schema, `llms.txt`, sitewide Plausible (build-injected), self-hosted Montserrat, and **a large amount of drafted-but-unexecuted off-site collateral**.

The audit found the real needs are **not "more planning"** — many plans already exist and much is done. The gaps cluster into six buckets:

1. **A handful of revenue-critical on-site bugs** (Stripe checkout, dead buttons, trust inconsistency).
2. **The homepage is the only JS-rendered page** — bad for SEO/GEO on the most important URL.
3. **Zero conversion measurement** — Plausible tracks pageviews but no CTA/form/purchase events, so every optimization is blind.
4. **Off-site authority is the weakest dimension** (GEO Authority 28/100), and the collateral to fix it is *already written* — it just needs execution.
5. **A set of concrete CRO, schema, GEO/AEO, and design-consistency fixes.**
6. **Net-new content** for winnable clusters (GSC page-2 terms, state-law pages, remaining comparisons).

**Two rules this plan obeys (both are known footguns here):**
- **Source vs built.** Edits to source HTML/data do nothing until `npm run build` regenerates `_site/`. Several "issues" prior audits raised are source-only artifacts the build resolves (e.g., analytics *is* sitewide).
- **Drafted vs executed.** `backlinks/*.md`, `content/*` (90-day backlink plan, outreach templates, `reddit-quora-playbook.md`, `linkedin-posts-q2-2026.md`, `brand-entity-setup.md`) and the 3 statistics blog posts **exist**. The gap is human execution (account creation, submissions, reviews), not authoring.

**Baselines to beat:** SEO health **82/100** (May 25 audit), GEO readiness **54/100** (Mar 6: Citability 68, Structure 72, Authority 28, Technical 42, Multi-modal 22).

**GSC reality (last 6 months, the prioritization spine):**
- **Branded traffic dominates** — "va horizon" = 102 clicks (~56% of all clicks). Homepage = 192 clicks / 1,655 impr / pos 8.2.
- **US is the only buyer market** — 84 US clicks (77%); Egypt 41 / PH 29 / India / Kenya are **VA job-seeker recruitment noise**. Filter GSC to US.
- **Winnable page-2 clusters with no ranking page:** "real estate wholesaling virtual assistant" (8 impr, **pos 43.9**, 0 clicks — the head term, no dedicated pillar); "mao calculator" / "maximum allowable offer calculator" (**pos 32–38**, tool exists but unoptimized); "best CRM for wholesalers" (CRM page stuck at **pos 13.8**); "sms blast real estate" sits at **pos 2 but 0 CTR** (title/snippet problem).
- **Proven format:** `/compare/best-cold-calling-va-companies/` = 182 impr at pos 8. Roundups rank.
- **Thin signal:** `/glossary/pre-foreclosure/` at pos ~70 — glossary is templated/thin.
- Impressions climbing but average position drifting = "seen on more queries, not ranked"; **mobile converts far better than desktop**.

---

## How to read this plan

Every item is tagged:
- **[AGENT]** — I can execute autonomously tonight against the codebase (edit source, run generator, rebuild, verify).
- **[FOUNDER]** — needs a human: account creation, third-party submissions, asking clients, a billing decision, or proprietary data.
- **[DECIDE]** — a judgment call the founder should make first (listed in *Open Decisions* at the end); I proceed on the recommended default if not told otherwise.

Priorities: **P0** (do first — revenue/correctness/measurement), **P1** (high impact this cycle), **P2** (polish / longer horizon).

The site **must rebuild and pass gates after every batch**: `npm run build` → `npm run seo:audit` → `npm run lint` → `npm run links` → em-dash check (`node verify_emdash.py`). Never commit `css/tailwind.min.css` or `_site/`.

---

# WORKSTREAM A — Revenue-critical P0 fixes (do first)

| # | Item | Tag | Notes / files |
|---|------|-----|---------------|
| A1 | **Stripe checkout link duplication** — homepage uses the *same* link `buy.stripe.com/4gMfZafNHgMIfn4dn1aMU04` for both the $1,160 single-seat and $1,000/seat 3+ cards (`index.html` ×2; `buttons.js` pricingData; verify `pricing/index.html`). Risk: customers charged the wrong amount. | **[FOUNDER-VERIFY]** then [AGENT] | Confirm in Stripe whether one link handles quantity, or two distinct products are needed. Then wire correct per-plan links. |
| A2 | **Homepage GEO/JS-render** — homepage is the *only* non-static page; a `<noscript>` hides `#container` (`index.html:17-25`) with a large static fallback at `index.html:900-1014`. Verify the fallback is comprehensive and current; **recommended: migrate homepage hero/services/pricing/testimonials to static HTML** like every subpage so AI crawlers and Google see real content, not a JS app. | [AGENT] **[DECIDE]** (full rebuild vs. harden fallback) | Biggest single GEO lever. GEO doc estimates +8–12 points. |
| A3 | **Conversion events (measurement)** — add Plausible custom events: `BookCall` (all Calendly links), `FormSubmit` (hero + `apply/` submit handlers), `CheckoutClick` (all Stripe links), `Purchase` (on `/thank-you/` load), `ToolUsed` (calculator results). Add the `?outbound-links` Plausible variant. | [AGENT] + [FOUNDER] (define Goals in Plausible dashboard) | `buttons.js`, `js/extracted/apply-1.js`, `thank-you/index.html`, `scripts/build-site.mjs` analyticsSnippet. Without this, all CRO work is unmeasurable. |
| A4 | **Trustpilot trust inconsistency** — homepage shows "100%" next to "TrustScore 4.0" (a 4.0 ≠ 100%). Fix copy to "4.0 / 5" or accurate star language. | [AGENT] | `index.html` (~line 2159). Trust-damaging on primary social proof. |
| A5 | **Dead "Book a Call" button** — `apply/` success state renders a `<button>` with no `href`/handler. | [AGENT] | `apply/index.html` (~line 471) → make it the Calendly `<a>`. |
| A6 | **ai-automations broken nav** — custom `ai-nav` lacks Pricing/Apply/Book-a-Call, trapping organic landers. | [AGENT] | `ai-automations/index.html` — add the missing CTAs or restore standard `site-header`. |

---

# WORKSTREAM B — Technical SEO & infrastructure

| # | Item | Tag | P |
|---|------|-----|---|
| **B1** | **🔴 Public file exposure (security/competitive-intel leak)** — the build copies `generator/` and `backlinks/` into `_site/`, so **`https://www.vahorizon.site/generator/data/locations.json`, `.../backlinks/journalist-pitches.md`, `.../backlinks/directory-listing-content.md`, `/skills-lock.json`, `/vercel.json` are all live and crawlable.** This exposes the entire template data layer + outreach playbook to competitors and search engines. **Fix:** add `'generator'`, `'backlinks'`, `content/` to `excludedDirs` and `skills-lock.json`, `vercel.json`, `audio/README.md` to `excludedRootFiles` in `scripts/build-site.mjs`; rebuild; confirm 404s. | [AGENT] | **P0** |
| **B2** | **🔴 Security headers not served + no HSTS** — `vercel.json` has **no `headers` block**; `security-headers.conf`/`SECURITY_HEADERS.md` exist but target *nginx/Cloudflare* and never reach Vercel (the doc is wrong about the host). The only live CSP is the meta tag (which cannot enforce `frame-ancestors`). **Fix:** add a `headers` array to `vercel.json` with `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`, a real `Content-Security-Policy` (reconcile with the injected meta CSP), `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`. Update `SECURITY_HEADERS.md` to Vercel. | [AGENT] | **P0** |
| B3 | **Legacy `.html` handling** — `ai-automations.html`, `privacy.html`, `terms.html`, `refund-policy.html` already carry `noindex` + meta-refresh and are out of the sitemap (good), but a true **301** in `vercel.json` is cleaner than meta-refresh. `offline.html` = PWA fallback, keep `noindex`. | [AGENT] | P1 |
| B4 | **`/locations/` hub missing** — 29 `/locations/*` children exist with **no parent hub page and no `/locations/` sitemap entry**, so they float without topical-authority consolidation or breadcrumb parent. Build `locations/index.html` (generator), add to sitemap, link from nav/footer. | [AGENT] | P1 |
| B5 | **Sitemap hygiene** — 284 `<loc>` correctly == indexable pages (only `thank-you` excluded, verified). Tidy: `changefreq`/`priority` are on only ~10% of entries — apply consistently or drop entirely. Resubmit in GSC after deploy. | [AGENT] + [FOUNDER] (GSC) | P2 |
| B6 | **Performance / CWV — homepage P0:** the homepage ships **dual Tailwind** (~139KB inline v4 from the Figma export *and* 36KB external v3) plus 125KB Figma component CSS = ~175KB+ render-blocking CSS on the LCP path (146KB HTML). Remove one Tailwind; scope/trim the Figma bundle (only the homepage uses its Radix dialogs — pairs with F3). **Sitewide P1:** consume the WebP the pipeline already generates via `<picture>` (only 3 of 285 pages do); compress 2.0MB/1.8MB call-sample MP3s (already `preload="none"`). Re-run Lighthouse after deploy (prior run failed on ECONNRESET). | [AGENT] (homepage P0) + [FOUNDER] (PSI) | P0/P1 |
| B7 | **robots.txt** — already allows AI crawlers + blocks CCBot. After B1, also `Disallow` any sensitive paths as belt-and-suspenders. | [AGENT] | P2 |
| B8 | **IndexNow + service worker** — confirm IndexNow key pings on publish (fast AI/Bing indexing); automate `sw.js` `CACHE_VERSION` bump on deploy (currently manual `v3` → stale-content risk). | [AGENT] | P2 |

---

# WORKSTREAM C — Schema / structured data

Current detected counts (from `_site`, June): BreadcrumbList 284, FAQPage **257**, DefinedTerm 160, Person 109, Article 74, Service 66, BlogPosting 53, ItemList 15, Review 6, WebSite 5.

| # | Item | Tag | P |
|---|------|-----|---|
| C1 | **Expand `Organization.sameAs`** — currently `["linkedin.com/company/vahorizon"]` only. Add founder LinkedIn, Trustpilot profile, and (after H) Clutch/G2/Crunchbase/Capterra. Keep one consistent `Organization @id` (`#organization`) referenced across pages. | [AGENT] (+ re-update after H) | P1 |
| C2 | **FAQPage scope correction** — it's on **257/285 pages** (incl. blog/case-study/compare that have no real FAQ), and worse, `scripts/audit-seo.mjs` *enforces* FAQPage on 10 routes (`expectedFaqRoutes`, lines 25-36) — a **circular dependency** that would block the build if you removed it. Reality: FAQPage is *inert-not-harmful* (no rich results for non-gov/health since Aug 2023) but **still aids AEO parsing**. **Fix:** keep it only where visible FAQ content exists & matches; remove from pages with no FAQ; **update `audit-seo.mjs` to stop mandating it**. Don't "panic-remove" everywhere. | [AGENT] | P1 |
| C3 | **Concrete schema fixes (from audit):** WebSite block is bare → add `@id` + `potentialAction` SearchAction (`index.html:888`); all **10 case-study Article blocks miss `author` + `image`** → add Person author (`#youssef`) + ImageObject; **compare pages miss Article `image`** + `mainEntityOfPage`; **HowTo still on `guides/how-to-calculate-mao-real-estate/` (line 79)** → remove (no rich result since Sept 2023) or convert to ItemList; **about-page `Person` nodes need `@id`** (`#youssef`, `#malak`) so 53 BlogPosting + 74 Article authors disambiguate; `areaServed` string `"US"` → Country object; `offers.price` on `crm` SoftwareApplication; add `Review`/`reviewRating` to testimonials (honest, no fake aggregate); add `AggregateRating` inside the 6 software `reviews/` `SoftwareApplication` blocks. | [AGENT] | P1 |
| C4 | **Location pages** — add `Service.areaServed` = the city to each `/locations/*` (generator) for a geo signal without a physical address. | [AGENT] (generator) | P2 |
| C5 | **Speakable** (forward-looking, voice/AI) on homepage + top guides/glossary. | [AGENT] | P2 |

---

# WORKSTREAM D — GEO / AEO (answer-engine optimization)

Target: raise GEO 54→75+, Authority 28→50+, by making passages extractable and the entity unambiguous. (The user explicitly named GEO — this is a headline workstream.)

| # | Item | Tag | P |
|---|------|-----|---|
| D1 | **Homepage static content** (= A2). Non-JS crawlers must read the hero value prop, services, guarantee, pricing. | [AGENT] | P0 |
| D2 | **`llms.txt` refresh** — currently **172 URLs vs 284 pages**. Expand to full coverage, grouped by section, plus a **"Key Facts" block** (pricing, 30-leads guarantee, Egyptian VAs, Readymode, 48–72h onboarding) and external profile URLs. Regenerate from the generator so it stays current. | [AGENT] | P1 |
| D3 | **Passage citability** — add a 40–60-word **direct-answer TL;DR / "Key Takeaways" block** immediately under the H1/first H2 on: guides, case studies, compare/vs, alternatives, reviews, top services, and glossary terms. Use **question-based H2s** ("How much does a cold calling VA cost?", "What is the 70% rule?"). This is the single biggest AEO lever after D1. | [AGENT] (templates + generator) | P1 |
| D4 | **Definition/cost/comparison formatting** — ensure every "what is X", "how much does X cost", "X vs Y" page leads with the answer, then a comparison table, then supporting detail. Glossary terms each open with a 1-sentence definition. | [AGENT] | P1 |
| D5 | **Entity consistency** — consistent NAP + Organization across pages; `sameAs` (C1); this compounds with off-site entity building (H). | [AGENT] | P1 |
| D6 | **Proprietary data asset** — build a "State of Cold Calling VAs 2026" stats/research page from VA Horizon's *own* dialer data (the existing 3 stat posts aggregate third-party sources; AI engines and journalists prefer unique data). Strongest GEO + backlink magnet. | [AGENT] builds page · [FOUNDER] supplies anonymized data | P1 |

---

# WORKSTREAM E — Content / page expansion (net-new, generator-driven)

Build via `/generator/` (data + Eta templates), then `npm run gen` + `internal-links`. Hold the quality gate (`generator/lib/lint.mjs`): 300+ unique words, unique title/description, self-canonical, no near-duplicates.

| # | Item | Tag | P |
|---|------|-----|---|
| E1 | **Head-term pillar (highest-value gap)** — "real estate wholesaling virtual assistant" gets 8 impr at **pos 43.9 with no dedicated page** (coverage is fragmented across services/solutions/blog). Build a 2,500–3,500w pillar `/guides/real-estate-wholesaling-virtual-assistant/` that internally links cold-calling, acquisition, dispo, SMS, CRM; link from homepage + nav. | [AGENT] | P1 |
| E2 | **MAO cluster** — "mao calculator"/"maximum allowable offer calculator" at **pos 32–38**, tool exists but underranks. Build a supporting guide (`how-to-calculate-mao`) with worked examples + embedded calculator; interlink the tool. Also surface the other 6 calculators with supporting guides. | [AGENT] | P1 |
| E3 | **Fix ranking-but-0-CTR pages (cheap wins)** — several pages rank pos 2–8 with **0 clicks**: "sms blast real estate" (pos 2), competitor compares (ak-callers/no-accent-callers/reva pos 5–7), `/industries/real-estate/` (769 impr, 1.69% CTR), CRM (pos 13.8). Rewrite **titles + meta descriptions** for CTR and push CRM onto page 1 ("best CRM for wholesalers"). No new pages — pure SERP-snippet optimization. | [AGENT] | P1 |
| E4 | **Remaining comparison pages** — `va-horizon-vs-{televista, virtual-latinos, stealth-agents, lead-mining-pros}`; a "best real estate VA companies" definitive resource page (linkable). | [AGENT] | P1 |
| E5 | **Glossary — quality-first, not quantity.** 80 terms exist but are **~520w, near-identical templates, no author/date** (pos ~70 = thin signal). Before adding terms: differentiate the top ~20 (by impressions) with unique examples + sources + author/date + question-H2 + a 1-sentence lead definition; trim boilerplate repeated FAQ. *Then* expand the set. | [AGENT] | P2 |
| E6 | **Programmatic Phase 4** — state-law / TCPA / cold-calling-legality-by-state pages (last unbuilt programmatic phase). High informational + AEO value; link to services. | [AGENT] | P2 |
| E7 | **Locations** — complete Tier-2 metros *only* with genuine local market data (hold the quality gate; add the `/locations/` hub from B4); add city-specific OG images for top 10. | [AGENT] | P2 |
| E8 | **New informational/cluster pages** — cold-calling-scripts cluster + objection-handling series; wholesaling-startup-budget pillar; lead-manager role guide; "why use a real estate VA"; Readymode setup how-to (with video); ops-hub index. Sequence by GSC impressions. | [AGENT] | P2 |
| E9 | **Lead magnets** — author "The Wholesaler's VA Hiring/Onboarding Checklist" (+ "30-Leads System" PDF) as gated assets for email capture (see F9). | [AGENT] builds · [FOUNDER] email tool | P1 |
| E10 | **Content E-E-A-T** — add visible author + "last reviewed" date to glossary (80) + locations (29) + compare pages; add real client quote/title to case studies; deepen founder bio (years in RE, track record) on `/about/`. | [AGENT] | P1 |
| E11 | **Em-dash regression cleanup** — the no-em-dash brand rule has regressed: visible em dashes on the **homepage** ("minimum floor — not ceiling", "expected volume — but…") + 2 guides. Run `node verify_emdash.py`, fix all visible instances. | [AGENT] | P1 |

---

# WORKSTREAM F — CRO / conversion

| # | Item | Tag | P |
|---|------|-----|---|
| F1 | **Hero leads with the guarantee + ICP** — put "30 Qualified Leads/Month, Guaranteed" above the fold and name *wholesalers* in the H1. Add a reusable **guarantee badge** (shield, gold) by the hero CTA and every "Get Started". | [AGENT] | P0 |
| F2 | **Stats bar swap** — replace ambiguous "87% Pilot Success Rate" with "30 Leads/Month Guaranteed"; keep 48h / 800+ dials / 5-day replacement. | [AGENT] | P1 |
| F3 | **Service cards → real links** — homepage service cards open JS dialogs instead of linking to `/services/*`. Convert to `<a href>` (also lets B6 drop the Figma bundle and feeds internal-link equity). | [AGENT] | P1 |
| F4 | **Integration logos = real stack** — swap Pipedrive/Podio/Airtable for **Readymode, HighLevel, PropStream, BatchLeads, Launch Control** (the tools that justify the price). | [AGENT] | P1 |
| F5 | **Hero form friction** — cut to 3 fields (Name, Email, Phone) + SMS consent; move qualifying dropdowns to `/apply/`; button "Submit Form" → "Get My VA Recommendation"; add microcopy ("No commitment. We reply within a few business hours."). | [AGENT] | P0 |
| F6 | **`/apply/` redesign** — multi-step with progress indicator; add social proof + guarantee reassurance beside the form; design-system dot-grid hero (see G1). | [AGENT] | P1 |
| F7 | **`/pricing/` conviction** — add testimonials/case-study quote at the decision point; surface ROI calculator; guarantee badge by each "Get Started"; one line of checkout reassurance ("secure Stripe checkout"). | [AGENT] | P1 |
| F8 | **`/crm/` price anchor** — state clearly that CRM buildout is **included** in the VA price; add a pricing CTA. | [AGENT] | P1 |
| F9 | **Email list / lead capture** — no list-building exists. Add lead-magnet opt-in (E6) + optional exit-intent; route the 7 calculators toward soft email capture. | [AGENT] builds · [FOUNDER] email tool (MailerLite/etc.) | P1 |
| F10 | **Mobile persistent CTA** — `#book-btn` is `display:none` <768px (most traffic). Re-enable a gold "Book a Call" pill revealed after the hero via IntersectionObserver; add `aria-label`. | [AGENT] | P1 |
| F11 | **Testimonials crawlable** — add `<blockquote>`/`<figcaption>` text + descriptive alt (name + outcome) for the 6 images; add `Review` schema (C3). | [AGENT] | P1 |
| F12 | **Surface `/compare/` + final CTA fix** — link key vs-pages in the conversion flow; change homepage final secondary CTA from "View Services" (`/industries/real-estate/`) to `/apply/`. | [AGENT] | P2 |

---

# WORKSTREAM G — Design / UX consistency & accessibility

| # | Item | Tag | P |
|---|------|-----|---|
| G1 | `/apply/` hero uses a flat gradient — rebuild to the design-system dot-grid + dual radial glow + section-label pill. | [AGENT] | P1 |
| G2 | `/pricing/` and `/services/` FAQ use native `<details>` — convert to the mandated `.faq-trigger/.faq-body` accordion (first item open). | [AGENT] | P1 |
| G3 | `/pricing/` stats bar is dark navy vs the design system's white — normalize (or document the dark variant in `DESIGN_SYSTEM.md`). | [AGENT] | P2 |
| G4 | `VAH_INTERNAL_LINKS` blocks use `<h2>` for "Core Pages"/etc. — demote to `<h3>/<h4>` in `scripts/generate-internal-links.mjs` template, rebuild. | [AGENT] | P2 |
| G5 | `#book-btn` desktop is navy not gold, sits after `</main>`, no `aria-label` — restyle gold + fix semantics (ties to F10). | [AGENT] | P2 |
| G6 | `#mobile-menu` empty div has `role="dialog"` — correct role/focus management. | [AGENT] | P2 |
| G7 | A11y sweep — alt text, heading order, focus states, contrast, Radix dialog keyboard/focus-trap audit. | [AGENT] | P1 |

---

# WORKSTREAM H — Off-site authority, reputation & measurement (the weakest dimension)

**Almost everything here is already drafted** in `backlinks/` and `content/`. The bottleneck is execution (founder/accounts). I build the on-site pieces; the founder runs the submissions.

| # | Item | Tag | P |
|---|------|-----|---|
| H1 | **Directory submissions** — Clutch, G2, Capterra, Crunchbase, GoodFirms, UpCity, Bark, **BiggerPockets Vendor (DR 82)** using ready copy in `backlinks/directory-listing-content.md` + `content/brand-entity-setup.md`. Keep NAP consistent. | [FOUNDER] | P0 |
| H2 | **Google Business Profile** — create as a service-area business (Delaware LLC address, US-nationwide). Unlocks Google reviews + geo entity node. | [FOUNDER] | P0 |
| H3 | **Reviews push** — email active clients for honest Trustpilot reviews (target 10+ → >4.5); seed 5 phone-verified Clutch + 5 G2 reviews; build a `/reviews/leave-a-review/` page; automate the ask at the 30-day client milestone. | [FOUNDER] (asks) · [AGENT] (builds page + email copy) | P0 |
| H4 | **Digital PR / HARO** — sign up for Connectively/Featured.com/SourceBottle; send the ready pitches in `backlinks/journalist-pitches.md`; pair with the D6 proprietary data asset for pick-up. | [FOUNDER] | P1 |
| H5 | **Podcast tour** — pitch Wholesaling Inc, Real Estate Disruptors, REI Mastery (templates in `backlinks/podcast-pitches.md`). Highest off-site ROI (DR 50–90 show-notes links + exact audience). | [FOUNDER] | P1 |
| H6 | **Community** — execute `content/reddit-quora-playbook.md` (Perplexity cites Reddit ~46%); join 5 REI Facebook groups; post the ready `content/linkedin-posts-q2-2026.md` 2×/week. | [FOUNDER] | P1 |
| H7 | **YouTube** — launch with the founding videos (live cold-call sample, Egypt office tour) for E-E-A-T + multi-modal entity (GEO multi-modal = 22/100, the lowest sub-score). | [FOUNDER] | P2 |
| H8 | **Update `sameAs` + `llms.txt`** once profiles are live (loops back to C1/D2). | [AGENT] | P1 |
| H9 | **Measurement stack** — verify **GSC** ownership (add `google-site-verification` meta if needed); define Plausible **Goals** for the A3 events; build a **UTM link library** for every external profile; consider call tracking for "Book a Call". | [FOUNDER] (GSC/dashboard) · [AGENT] (meta tag, UTM doc) | P0 |
| H10 | **HighLevel partner / PropStream partner directory** listings (integration-partner links VA Horizon already qualifies for). | [FOUNDER] | P2 |

---

# Suggested overnight execution sequence (what I'd do tonight, if approved)

Batched so each ends in a green build. Off-site `[FOUNDER]` items run in parallel on the founder's side.

1. **Batch 1 — P0 leak + measurement + correctness** (B1 public-file exposure, B2 security headers, A3 events, A4 Trustpilot, A5 dead button, A6 ai-automations nav, H9 meta/UTM). Rebuild + verify 404s on `/generator/*` & `/backlinks/*`. *Now nothing leaks and every later change is measurable.*
2. **Batch 2 — Homepage GEO + perf** (A2/D1 static content; B6 dual-Tailwind) — the highest-leverage single page; migrate to static or harden the noscript fallback. Verify with a JS-disabled fetch of `_site/index.html`.
3. **Batch 3 — Technical/infra** (B3 redirects, B4 `/locations/` hub, B5 sitemap tidy, B7/B8).
4. **Batch 4 — Schema + GEO/AEO** (C1–C5 incl. the concrete schema fixes + `audit-seo.mjs` FAQ de-coupling, D2 llms.txt→full, D3/D4 citability blocks + question H2s, E11 em-dash cleanup).
5. **Batch 5 — CRO** (F1–F12) + **Design/E-E-A-T** (G1–G7, E10).
6. **Batch 6 — Content** (E1 head-term pillar, E2 MAO, E3 CTR rewrites, E4 compares, E6 Phase-4, E5 glossary differentiation, B6 images, D6 data-asset shell).
7. **Stripe (A1)** applied as soon as the founder confirms the billing model.
8. Final full gate: `build` → `seo:audit` (after de-coupling the FAQ check) → `lint` → `links` → `node verify_emdash.py` → spot-check `_site` for homepage static content, event wiring, and no leaked dirs.

---

# Verification (end-to-end)

- `npm run build` (regenerates `_site/` + `tailwind.min.css`; revert tailwind.min.css before any commit).
- `npm run seo:audit` → 0 blocking. `npm run lint` (html/css/js) clean. `npm run links` → 0 broken. `node verify_emdash.py` → 0 visible em dashes.
- **GEO check:** fetch `_site/index.html` and confirm hero/value-prop/guarantee text is present without executing JS.
- **Events check:** grep `_site` for the Plausible event calls on CTAs/forms/thank-you; click-test in a browser with the Plausible dashboard open.
- **Schema:** validate changed JSON-LD (Rich Results / schema validator); confirm `sameAs`, `Review`, `areaServed` object, `offers.price`.
- **Headers:** after deploy, check response headers for HSTS/CSP/X-Content-Type-Options; confirm `/privacy.html` 301s to `/privacy/`.
- **CWV:** PSI/Lighthouse on homepage + a service + a location (mobile + desktop) post-deploy.
- **Founder loop:** resubmit sitemap in GSC; define Plausible Goals; confirm directory/review submissions.

---

# Open decisions for the founder ([DECIDE] items)

1. **Stripe billing (A1)** — does the single checkout link handle seat quantity, or do we need distinct payment links per plan? (Blocks A1; potential mischarge until resolved.)
2. **Homepage (A2)** — full migration to static HTML (best for SEO/GEO, removes dual-Tailwind, more work) **vs.** harden the existing `<noscript>` fallback (faster, keeps the Figma layout). *Recommended: migrate to static.*
3. **AI agent name (Lena vs Emily)** — split is real: "Lena" dominates the product surface (`ai-automations` ~21, `compare/best-ai-cold-calling` ~21) and "Emily" is the deployed client agent in 3 case studies (~10). Pick one canonical name, or keep the split with a one-line explainer. *Recommended: standardize on "Lena" as the product; note client-custom names where relevant.*
4. **FAQPage scope (C2)** — keep FAQPage only where there's visible FAQ content (and de-couple `audit-seo.mjs`), **or** keep it broadly for AEO. *Recommended: keep-where-visible + de-couple the build gate.*
5. **Glossary (E5)** — differentiate/enrich the existing 80 thin terms first, **or** keep them lean and prioritize net-new commercial pages. *Recommended: enrich top-20 by impressions, then expand.*
6. **Lead-magnet email tool** — which provider (MailerLite free tier / formsubmit / HighLevel itself)? Needed for E9/F9 delivery.
7. **Scope for tonight** — execute all `[AGENT]` workstreams, or a chosen subset (e.g., P0 + GEO + measurement first)?

---

## What's already DONE (so this plan doesn't redo it)
Generator engine; glossary (81), locations (29, canonical bug fixed), solutions/personas (15), compare (36), alternatives (10), reviews (7), guides (39, cost guides incl.), 3 statistics blog posts; `/pricing/` + `/thank-you/` + Stripe; sitewide build-injected Plausible (pageviews) + 900-weight fonts + font preloads; em-dash purge; WebP for testimonials/CRM/partner; Organization `@id`; blog author→Person; internal-link generator; robots.txt AI-crawler rules; ACTION-PLAN items 1/3/4/7/8/9/10/13. **All off-site collateral is drafted** (`backlinks/`, `content/`) — pending execution only.
