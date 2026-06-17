# VA Horizon — 35-Page Commercial Expansion Plan

**Created:** June 17, 2026
**Owner:** Youssef Ahmed (founder)
**Goal:** Add 35 net-new bottom-funnel commercial pages that capture high-intent buyer queries the site is already getting impressions for, push winnable pages from page-2 onto page-1, and funnel qualified US wholesalers to `/apply/` and `/pricing/`.
**Execution:** Codex builds in template-grouped batches; Claude QA-gates each batch before the next ships. Nothing committed until the founder asks.

---

## 1. Why these 35 (grounded in GSC, not guesses)

Source data: GSC exports in `Desktop\Charts\` (Queries, Pages, Countries, Devices, daily Chart), last ~6 months.

Key findings driving the selection:
- **US is the only commercial market** (2,502 impressions, avg pos 10.9, 3.36% CTR). Egypt/PH/India impressions are VA job-seeker noise, ignored.
- **Biggest untapped commercial term:** "real estate wholesaling virtual assistant" (6 variants, pos 27–45, no dedicated page).
- **Roundups proven** (`/compare/best-cold-calling-va-companies/` = 182 impr at pos 8). "best real estate cold calling companies" pos 69; "best crm for wholesalers" / "wholesaler crm" pos 20–49.
- **Competitor brand searches uncaptured:** getcallers (pos 13), ak callers reviews (6), no accent callers reviews (6).
- **`readymode official dialer` already at pos 10** — a firsthand review should reach page 1.
- **MAO cluster unclaimed:** mao calculator / formula / meaning, pos 30–55. `/tools/mao-calculator/` stuck at pos 27.
- **Cost intent:** "real estate va pricing for teams," "are wholesale virtual assistants cost-effective."
- **Locations barely register** (most 1–3 impr). Kept to 4, shipped last.
- Impressions rising fast but positions drifting to 12–17: the job is to RANK winnable commercial pages, not add more impressions.

---

## 2. Non-negotiable quality bar (anti-AI-slop)

Every page is QA-gated against these. A page that fails does not ship.

1. **Firsthand reviews only.** Only review/score tools VA Horizon actually operates: Readymode (dialer), HighLevel (CRM), PropStream + BatchLeads (lists/skip trace), Launch Control (SMS). No invented hands-on experience. For tools we don't run (REsimpli, Podio, DealMachine, competitor services), frame as an honest *comparison/evaluation* with a clear "why we chose X instead" stance, never a fake firsthand verdict.
2. **Real numbers only**, pulled from `va-horizon-operations.md`. Never invent stats, metrics, testimonials, or client names. Approved facts:
   - Egyptian VAs (not Filipino); no-accent-fluent; prior real-estate cold-calling experience required.
   - 800–1,000 dials per 8-hour shift; 8–15% contact rate with predictive dialer.
   - **30 qualified leads/month guarantee** per cold-calling engagement.
   - Readymode dialer; 3–5 seat minimum (agency-only access is the differentiator).
   - HighLevel (GHL) CRM buildout included at no extra cost.
   - Onboarding: VA dialing within 48–72 hours (vs 2–4 weeks freelance).
   - Pricing: 1 VA $960 + $200 dialer = **$1,160/mo**; 3+ VAs $800 + $200 = **$1,000/mo each**; Acquisition Mgr & Dispo Mgr **$1,440/mo**; Lead Mgr **$1,120/mo**; SMS: $600 setup + $100/mo + $0.00125/segment (first 10k included) + $30/number.
   - AM hiring criteria: 1+ yr cold calling, 6+ mo vetted AM experience, 2+ closed deals.
   - US market rates for comparison: AM/Dispo $3,500–$6,000/mo or $60–80k/yr W2.
3. **No em dashes** in any visible copy (headings, body, lists, CTAs, alt text). Replace per `va-horizon-operations.md` rules. Em dashes allowed only in `<title>`, meta, JSON-LD (not user-visible). Run `verify_emdash.py` before passing a batch.
4. **No AI-slop patterns:** no "Whether you're X or Y…", no "not just X, it's Y" parallelism, no "unlock/elevate/seamless/robust/in today's fast-paced," no rule-of-three padding, no vague "studies show." Every claim is specific and attributable. Run the `humanizer` skill read on each page.
5. **Named author** Youssef Ahmed + Organization publisher on all editorial pages (matches existing pattern).
6. **Original angle per page.** No two pages may be 70%+ the same copy. Comparison/alternatives/roundup pages must use genuinely different competitor framings. Location pages must pass the quality gate (300+ words unique market commentary + state wholesaling-law note + local-fit reasoning).
7. **Honest comparisons.** When ranking VA Horizon #1 on roundups, the reasoning must be defensible (managed service, Readymode access, Egyptian-VA fit, 30-leads guarantee, GHL included). Give competitors fair, accurate descriptions. No straw-manning.

---

## 3. Shared technical contract (every hand-authored page)

Codex must replicate the existing production pattern. Reference live examples: `compare/best-cold-calling-va-companies/index.html` (roundup), `compare/va-horizon-vs-myoutdesk/index.html` (vs), `services/cold-calling/index.html` (service). And `DESIGN_SYSTEM.md` (mandatory).

**`<head>` block (in order):**
- `<title>` keyword-first, brand last.
- `<meta name="description">` 150–160 chars, keyword-led, do not pad.
- `<link rel="canonical">` absolute, **trailing slash**: `https://www.vahorizon.site/<path>/`.
- OG (`og:type` = article/website, title, description, url, site_name, image `https://www.vahorizon.site/social/va-horizon-og.png` 1200×630) + Twitter `summary_large_image`.
- Favicons block (copy from existing pages).
- Stylesheets in this exact order:
  ```
  /fonts.css
  /VAHorizonWebsiteStyle/_components/v1/93bdfffda6e0bf9a7fd91429ea912af65458e738.css?v=3
  /cards.css?v=3
  /css/va-custom.css?v=navfix-20260525
  /css/tailwind.min.css
  ```
- Page `<style>` block after stylesheets.
- JSON-LD `@graph` (see per-template schema below). Author = Person "Youssef Ahmed", jobTitle "Founder, VA Horizon", url `/about/`. Publisher = Organization `@id` `https://www.vahorizon.site/#organization`.

**Design system (from `DESIGN_SYSTEM.md`):** navy `#082541`/`#071e35` + gold `#D4A02F` + warm `#F6F1E8` only; Montserrat only; hero with dot-grid + radial glow + section-label pill; stats bar (4 numbers) after hero; gold `section-label` pill above every H2; `why-card`/`workflow-step`/comparison-table/`tool-badge` components; **interactive FAQ accordion** (not static); CTA section (gold rule + radial glow) last before footer; section background rotation for rhythm. Shared sticky navy navbar + 4-col footer copied from an existing page (do not redesign nav/footer).

**Internal links + breadcrumbs:** include the marker comments so `scripts/generate-internal-links.mjs` injects them:
`<!-- VAH_INTERNAL_LINKS_START --> … <!-- VAH_INTERNAL_LINKS_END -->`, `<!-- VAH_BREADCRUMB_START --> … END`, `<!-- VAH_BREADCRUMB_SCHEMA_START --> … END`. Plus each page hard-codes its own contextual internal links (see per-page briefs). Every page links to `/apply/` and `/pricing/` at minimum, plus 2–4 contextual related pages.

**Scripts:** `/buttons.js` deferred (mobile menu) + page `<script>` (FAQ accordion JS from DESIGN_SYSTEM) before `</body>`. Do not inline mobile-menu JS.

**Registration per new page (all required):**
1. Add `<url>` to `sitemap.xml` with correct priority/changefreq (service 0.9, compare/reviews/guides 0.7, locations 0.6) and `<lastmod>` = build date.
2. Add to `llms.txt` under the right section.
3. Run `npm run internal-links` so it joins the hub-and-spoke graph.
4. `npm run build` (source → `_site/`). The site serves from `_site/`; edits not built do not show.

**Word-count minimums:** roundups 1,600+; vs/alternatives 1,400+; reviews 1,500+; cost guides 1,400+; MAO guide 1,600+; service pages 1,000+; location pages 700+ (300+ unique market commentary).

---

## 4. New `/reviews/` section setup (one-time, before Batch 4)

Mirror how `/pricing/` was added:
1. Create `reviews/index.html` hub page (lists all reviews, design-system compliant, `CollectionPage` + `BreadcrumbList` schema).
2. In `scripts/generate-internal-links.mjs`: add `/reviews/` to `primaryTargets`; add `['/reviews/', 'Reviews']` to `fixedLabels`; add `['reviews', '/reviews/']` to `groupHubs`.
3. Add `/reviews/` + each review URL to `sitemap.xml` and `llms.txt`.
4. Add a "Reviews" link to the **footer Resources column only** (NOT the top nav — avoid a sitewide nav change across 237 pages). Link to `/reviews/` from the `/compare/` hub and contextually from relevant pages.
5. `npm run internal-links` + `npm run build`.

---

## 5. The 35 page briefs (grouped by template)

> KW = primary keyword. Each brief lists the unique angle, required sections, and the ops-data points to cite. Titles/metas are starting points; refine for length.

### Template A — "Best X" Roundups (7) · `/compare/` · schema: Article + ItemList + FAQPage + BreadcrumbList

Shared structure: H1 with year; 130–160 word answer block (direct "best for X" verdict) right under H1; "How we evaluated" methodology box; comparison table (price, specialization, onboarding, guarantee, best-for); ranked cards (VA Horizon framed as the managed answer where honest, or clearly positioned among tools); FAQ (4–6 Q); CTA. Each links to the matching service/vs/review pages + `/pricing/` + `/apply/`.

1. **`/compare/best-real-estate-cold-calling-services/`**
   - KW: best cold calling service for real estate investors / best real estate cold calling companies (pos 69 today)
   - Lineup: VA Horizon (#1, managed + 30-leads guarantee + Readymode), Call Motivated Sellers, Call Porter, Televista, REVA Global, Lead Mining Pros. **Differentiate from existing `/compare/best-cold-calling-va-companies/`** (that page = VA *staffing* firms; this = done-for-you *services*). Cross-link the two with a one-line "looking for staffing vs service?" note to prevent cannibalization.
   - Internal links: the 5 new vs pages for these competitors, `/services/cold-calling/`.
2. **`/compare/best-crm-for-real-estate-wholesalers/`**
   - KW: best crm for real estate wholesalers / wholesaler crm (pos 20–49)
   - Lineup: HighLevel (VA Horizon's pick, buildout included), REsimpli, InvestorFuse, REI BlackBook, DealMachine, Podio. Angle: most wholesalers don't need another tool, they need it *configured and run*.
   - Links: `/reviews/highlevel-for-wholesalers/`, `/compare/resimpli-vs-highlevel-wholesalers/`, `/compare/highlevel-vs-podio-wholesalers/`, `/crm/`.
3. **`/compare/best-dialer-real-estate-cold-calling/`**
   - KW: best dialer for real estate cold calling
   - Lineup: Readymode (VA Horizon's dialer, agency-only 3-seat access), Mojo, CallTools, BatchDialer, PhoneBurner, Kixie. Angle: predictive vs power; why solo operators can't access Readymode; STIR/SHAKEN + spam-flag reality.
   - Links: `/reviews/readymode/`, `/reviews/calltools/`, `/services/readymode-dialer-setup/`.
4. **`/compare/best-ai-cold-calling-real-estate/`**
   - KW: best ai cold calling software real estate / ai voice agent real estate
   - Lineup: VA Horizon's "Lena" human+AI hybrid, Bland AI, Retell AI, Synthflow, Aloware. Angle: AI for screening/follow-up, humans for the close; where AI breaks on motivated-seller calls.
   - Links: `/ai-automations/`, `/compare/va-horizon-vs-ai-voice-agent/`.
5. **`/compare/best-sms-platform-real-estate-wholesalers/`**
   - KW: best text blasting / sms software for real estate wholesalers
   - Lineup: managed SMS via VA Horizon (A2P + list + send done-for-you), Launch Control, Smarter Contact, Lead Sherpa, REI Reply. Angle: A2P 10DLC compliance burden; managed vs DIY.
   - Links: `/services/sms-blast-campaigns/`, `/reviews/launch-control/`, `/guides/a2p-10dlc-compliance-real-estate/`.
6. **`/compare/best-lead-list-software-wholesalers/`**
   - KW: best list pulling / lead list software for wholesalers
   - Lineup: PropStream, BatchLeads, ListSource, DealMachine, Privy. Angle: VA Horizon handles list pulling + stacking so the operator doesn't.
   - Links: `/reviews/propstream/`, `/reviews/batchleads/`, `/services/list-sourcing/`, `/services/skip-tracing-coordination/`.
7. **`/compare/best-real-estate-virtual-assistant-companies/`**
   - KW: best virtual assistant company for real estate investors
   - Lineup: VA Horizon, MyOutDesk, REVA Global, Virtual Latinos, Stealth Agents, Upwork/freelance. Broader than cold calling (acquisitions, dispo, admin, TC). Captures top-of-category.
   - Links: `/services/wholesaling-virtual-assistant/`, the relevant vs/alternatives pages.

### Template B — Head-to-head "vs" comparisons (8) · `/compare/` · schema: Article + FAQPage + BreadcrumbList

Shared structure: H1 "VA Horizon vs [X]"; answer block (one honest sentence on who each is for); at-a-glance comparison table; section per dimension (model, who calls, pricing, onboarding, guarantee, tools, best-for); honest "when [X] is the better choice" section (builds trust); FAQ; CTA. Accurate competitor descriptions.

8. **`/compare/va-horizon-vs-call-motivated-sellers/`** — Call Motivated Sellers = managed RE cold-calling service (EN/ES). Contrast: their pay model/lead handling vs VA Horizon dedicated Egyptian VAs + 30-leads guarantee + GHL included.
9. **`/compare/va-horizon-vs-call-porter/`** — Call Porter = inbound/appointment-setting + answering for investors. Contrast: inbound answering vs outbound dedicated dialing + acquisitions team.
10. **`/compare/va-horizon-vs-televista/`** — Televista = managed cold-calling (current SERP #1, ~$1,250/mo). Honest price/feature contrast.
11. **`/compare/va-horizon-vs-virtual-latinos/`** — Virtual Latinos = LatAm VA marketplace. Contrast: marketplace self-management vs fully managed + dialer + CRM + QA.
12. **`/compare/va-horizon-vs-stealth-agents/`** — Stealth Agents = general VA staffing. Contrast: generalist VA vs RE-cold-calling-specialist + managed ops.
13. **`/compare/va-horizon-vs-lead-mining-pros/`** — Lead Mining Pros = RE cold calling / lead gen. Contrast on guarantee, dialer access, CRM.
14. **`/compare/resimpli-vs-highlevel-wholesalers/`** — tool-vs-tool. Honest: REsimpli = fast out-of-box all-in-one ($149–599/mo); HighLevel = more powerful when built right (which VA Horizon does). Not a firsthand REsimpli review; an evaluation. Links `/reviews/highlevel-for-wholesalers/`, `/crm/`.
15. **`/compare/highlevel-vs-podio-wholesalers/`** — tool-vs-tool. Podio = legacy customizable but dated; GHL = modern + SMS/AI native. Authentic GHL stance.

### Template C — "Alternatives to X" listicles (3) · `/alternatives/` · schema: Article + ItemList + BreadcrumbList

Shared structure: H1 "[X] Alternatives for Real Estate [Investors/Wholesalers] (2026)"; answer block; why people look for alternatives to X (fair, specific); ranked list of 5 alternatives with VA Horizon #1 (defensible reasoning) + 4 real others; comparison table; FAQ; CTA. Distinct from the matching `/compare/va-horizon-vs-X/` page (listicle vs head-to-head).

16. **`/alternatives/getcallers/`** — GetCallers alternative (pos 13 brand demand). Alts: VA Horizon, Call Motivated Sellers, REVA Global, MyOutDesk, freelance.
17. **`/alternatives/ak-callers/`** — AK Callers alternative ("ak callers reviews" pos 6). Same alt set, AK-specific framing.
18. **`/alternatives/no-accent-callers/`** — No Accent Callers alternative ("no accent callers reviews" pos 6). Angle: Egyptian VAs deliver the same no-accent benefit + managed ops + guarantee.

### Template D — Authentic software reviews (6) · `/reviews/` · schema: Review (with Rating) + Article + BreadcrumbList + FAQPage

Shared structure: H1 "[Tool] Review for Real Estate Wholesalers (2026)"; answer block with verdict + rating; "who it's for"; firsthand pros/cons (only for tools we run); pricing table; "how VA Horizon uses it" (real workflow) or "what we use instead"; alternatives; FAQ; CTA. Review schema `itemReviewed` = SoftwareApplication, `author` = Youssef Ahmed, `reviewRating` honest.

19. **`/reviews/readymode/`** — FIRSTHAND. "readymode official dialer" pos 10. Predictive dialer, 3–5 seat min, 800–1,000 dials/shift in practice, why agency access matters. Links `/services/readymode-dialer-setup/`, `/compare/best-dialer-real-estate-cold-calling/`.
20. **`/reviews/highlevel-for-wholesalers/`** — FIRSTHAND. GHL as the managed CRM; pipelines, SMS automation, AI inbox; what to build first. Links `/crm/`, `/compare/best-crm-for-real-estate-wholesalers/`.
21. **`/reviews/propstream/`** — FIRSTHAND (list/skip stack). 153M+ records, filters, DNC scrubbing; how VAs pull lists. Links `/services/list-sourcing/`, `/compare/best-lead-list-software-wholesalers/`.
22. **`/reviews/batchleads/`** — FIRSTHAND. BatchLeads/BatchData lists + skip tracing pay-as-you-go; bulk workflow. Links `/services/skip-tracing-coordination/`.
23. **`/reviews/calltools/`** — Evaluation (we run Readymode). Honest contrast vs Readymode. Links `/compare/best-dialer-real-estate-cold-calling/`.
24. **`/reviews/launch-control/`** — FIRSTHAND (SMS). Deliverability, A2P, templates; managed-SMS angle. Links `/services/sms-blast-campaigns/`, `/compare/best-sms-platform-real-estate-wholesalers/`.

### Template E — Cost / pricing guides (4) + MAO guide (1) = 5 · `/guides/` · schema: Article + FAQPage + BreadcrumbList (+ HowTo on MAO)

Shared structure: H1 = the cost/how question; answer block with the actual number range; real cost breakdown table (agency vs freelance vs in-house vs US W2); hidden-cost section; VA Horizon's transparent number; FAQ; CTA to `/pricing/`.

25. **`/guides/real-estate-cold-calling-va-cost/`** — KW: how much does a real estate cold calling VA cost. Numbers: freelance $5–15/hr vs VA Horizon $1,160 (1) / $1,000 (3+) all-in incl. dialer + CRM + QA. Hidden costs of freelance (dialer access, management, turnover).
26. **`/guides/real-estate-virtual-assistant-cost/`** — KW: real estate virtual assistant cost / pricing for teams. Umbrella page; links to 25/27/28. Cost by role.
27. **`/guides/acquisition-manager-salary-cost/`** — KW: real estate acquisitions manager salary/cost. VA Horizon $1,440/mo vs US $3,500–6,000/mo or $60–80k W2. AM hiring criteria (1yr/6mo/2 deals). Links `/services/acquisition-manager/`.
28. **`/guides/disposition-manager-salary-cost/`** — KW: disposition manager salary/cost ("disposition manager" pos 9). $1,440/mo vs market. Links `/services/disposition-manager/`, `/blog/what-does-disposition-manager-do-wholesaling/`.
29. **`/guides/how-to-calculate-mao-real-estate/`** — KW: how to calculate mao / maximum allowable offer formula / what is mao (pos 30–55). MAO = ARV × 0.70 − repairs − wholesale fee, worked example, HowTo schema. Embeds/links `/tools/mao-calculator/` prominently. Links glossary `maximum-allowable-offer-mao`, `after-repair-value-arv`.

### Template F — Service / landing pages (2) · `/services/` · schema: Service + FAQPage + BreadcrumbList

30. **`/services/wholesaling-virtual-assistant/`** — **TOP PRIORITY.** KW: real estate wholesaling virtual assistant (+ variants, pos 27–45). Conversion-built category landing AND mini-hub linking every role service. Sections: what a wholesaling VA does (call/qualify/submit, narrowly scoped), what VA Horizon handles vs the VA, Egyptian-VA fit, the full role lineup (cold caller, AM, dispo, lead mgr) with links, onboarding 48–72h, 30-leads guarantee, pricing teaser, FAQ, CTA. **Differentiate from `/industries/real-estate/`** (that = broad real estate VA; this = wholesaling-specific role hub); cross-link, distinct H1/intent.
31. **`/services/appointment-setting-va/`** — KW: appointment setting real estate va / crm lead routing + follow up va / manage crm inbox va (pos 13–77). Inbound + appointment-setting + CRM-inbox role, distinct from outbound cold calling and from `/services/lead-manager/`. Links `/services/follow-up-automation/`, `/services/lead-manager/`, `/crm/`.

### Template G — Location pages (4) · `/locations/` · generated via `generator/build.mjs` · schema: Service + BreadcrumbList (existing location template)

Quality gate per page: 300+ words unique market commentary (median price, distressed/absentee volume, days on market), state wholesaling-law note, local-fit reasoning, 1 relevant case/quote. Build with the generator + data file, not hand-authored, to stay consistent with the existing 25. Confirm canonical resolves to the real URL (see prior location-canonical fix).

32. `/locations/cold-calling-va-oklahoma-city/`
33. `/locations/cold-calling-va-baltimore/`
34. `/locations/cold-calling-va-louisville/`
35. `/locations/cold-calling-va-milwaukee/`

---

## 6. Execution batches, sequence, and QA gate

Ship highest-ROI first. Each batch: Codex builds → Claude QA-gates → fix → next batch.

| Batch | Pages | Why this order |
|-------|-------|----------------|
| **1** | #30 wholesaling-virtual-assistant service page + Template A roundups #1–#3 (cold-calling-services, crm, dialer) | Highest-impression commercial terms; head-term page first |
| **2** | Template A roundups #4–#7 (ai, sms, list, va-companies) + #31 appointment-setting service | Finish roundups + 2nd service page |
| **3** | Template B vs pages #8–#15 (8) | Bottom-funnel competitor + tool comparisons |
| **4** | `/reviews/` section setup + Template D reviews #19–#24 (6) | New section + firsthand reviews (readymode first) |
| **5** | Template C alternatives #16–#18 (3) + Template E guides #25–#29 (5) | Competitor capture + cost/MAO |
| **6** | Template G locations #32–#35 (4) | Lowest volume, ship last |

**Per-batch QA gate (Claude runs, all must pass):**
1. `npm run build` succeeds; pages render from `_site/`.
2. `npm run seo:audit` → 0 blocking issues.
3. `npm run lint` (htmlhint + stylelint + eslint) clean.
4. `verify_emdash.py` → 0 visible em dashes.
5. `humanizer` skill read → no AI-slop patterns; rewrite if flagged.
6. Schema check: valid JSON-LD `@graph`, correct types, author/publisher present, canonical absolute + trailing slash, matches real URL.
7. Internal links: `npm run internal-links` ran; page is in the graph; links to `/apply/` + `/pricing/` + 2–4 contextual; `npm run links` → 0 broken.
8. Sitemap + llms.txt updated; `/reviews/` registered (batch 4).
9. Mobile + desktop visual spot-check (design-system compliant, both breakpoints).
10. Facts cross-checked against `va-horizon-operations.md`; no fabricated numbers/claims.

Only after all 10 pass does the next batch start. Commit only when the founder asks.

---

## 7. Codex guardrails (paste into every Codex brief)

- Read `CLAUDE.md`, `DESIGN_SYSTEM.md`, `va-horizon-operations.md`, and this file before writing.
- Copy the `<head>`, navbar, and footer from a current same-template page; change only what the brief specifies.
- Use only navy/gold/warm + Montserrat. Use the design-system components verbatim (hero dot-grid, stats bar, section-label pills, why-cards, FAQ accordion, CTA section).
- No em dashes in visible copy. No AI-slop phrasing. No invented facts, stats, testimonials, or client names — only `va-horizon-operations.md` facts.
- Every page: canonical (absolute, trailing slash), OG/Twitter, JSON-LD `@graph`, internal-link marker comments, `/apply/` + `/pricing/` CTAs, interactive FAQ.
- Do not touch the top navbar/footer markup beyond copying it. Do not remove JSON-LD. Do not add Google Fonts or new colors.
- After building a batch: update `sitemap.xml` + `llms.txt`, run `npm run internal-links` then `npm run build`. Do not commit.
- Stay strictly within the assigned batch's page list. Do not invent extra pages or refactor unrelated files.
