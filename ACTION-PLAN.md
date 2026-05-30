# VA Horizon SEO Action Plan - May 25, 2026

Prioritized fixes from the local `_site` audit. The current site has no blocking crawl/indexing failures; the highest-impact work is deployment hygiene, performance cleanup, metadata polish, and schema consistency.

## Status — updated 2026-05-30

- ✅ **Item 1** (build artifact exclusions): already implemented in `scripts/build-site.mjs`; `_site` is clean of `.playwright-cli/`, `output/`, `scripts/`, `.gitignore`, `security-headers.conf`.
- ✅ **Item 3** (truncated meta descriptions): verified — flagged pages (`/tools/`, case studies, legal) all have complete, readable descriptions. No truncation remains.
- ✅ **Item 4** (blog author → Person): all 10 blog posts use `Person: Youssef Ahmed` author schema.
- ✅ **Item 8** (llms.txt full coverage): expanded from 73 → 137 URLs. Added full Glossary section (47 terms + hub), 3 new blog posts, Solutions-by-Audience section (8 persona pages), Meet Your VA, Partner, and a Legal section.
- ✅ **Item 7** (long titles): 38 source pages shortened from 71-91 chars to ≤74 chars. `<title>`, `og:title`, and `twitter:title` updated in all affected files. Descriptions left as-is (keyword-optimized, no truncation found).
- ✅ **Item 10** (Organization `@id`): 20 source pages patched. All Service, Article, BlogPosting, SoftwareApplication, and WebApplication schemas now reference `https://www.vahorizon.site/#organization` with full logo. Two hub pages (guides, tools) had ItemList-embedded schemas that required a separate patch.
- ✅ **Item 9** (internal linking): 106 contextual links added across 40 source pages (blog, guides, case studies, compare). First-mention strategy: TCPA, A2P 10DLC, skip tracing, glossary terms, tools, and case study proof claims all now link to their dedicated pages.
- ✅ **Item 13** (sitemap lastmod): 139 entries updated from blanket `2026-05-26` to per-page git last-commit dates (128 × 2026-05-29, 11 × 2026-05-30). Re-run after next commit to capture today's title/schema/link changes.
- ⏳ Remaining: items 2, 5, 6, 11, 12, 14, 15 (visual/CSS, image formats, Lighthouse) — require visual QA, network, or are lower priority.

## Critical - Fix Before Next Deploy

### 1. Stop copying tool and audit artifacts into `_site`

**Files:** `scripts/build-site.mjs`

Add `.playwright-cli`, `output`, and other local-only artifact directories to the build exclusion list. Also exclude root dev-only files such as `.gitignore`, `security-headers.conf`, and non-runtime scripts that should not be publicly served.

**Evidence:** Current `_site` contains `.playwright-cli/`, `output/playwright/`, `.gitignore`, `scripts/`, and `security-headers.conf`.

### 2. Remove legacy Figma runtime assets if no longer needed

**Files:** homepage and build/public asset pipeline

Confirm whether `VAHorizonWebsiteStyle` is still required. If it is not needed, remove it from the public build. If it is still required, limit it to the pages that actually depend on it and avoid loading or publishing unused component/runtime bundles.

**Evidence:** `_site` includes a 1.55 MB component JS bundle and a 629 KB runtime bundle.

## High - Fix Within 1 Week

### 3. Repair truncated meta descriptions

**Files:** affected page HTML

Rewrite obviously broken descriptions while preserving keyword intent:

- `/case-studies/highlevel-crm-buildout/`
- `/tools/`
- `/case-studies/speed-to-lead/`
- `/privacy/`
- `/refund-policy/`

**Acceptance:** Each affected page has a complete, human-readable meta description around 120-170 characters unless intentionally shorter for legal pages.

### 4. Convert blog author schema to Person

**Files:** all 7 `blog/*/index.html` posts

Change `BlogPosting.author` from `Organization: VA Horizon` to `Person: Youssef Ahmed`, matching the visible bylines. Include the about-page URL for entity consistency.

**Acceptance:** Parsed schema no longer reports `Organization:VA Horizon` as blog author.

### 5. Fix desktop header crowding on subpage templates

**Files:** shared header styles/templates used by subpages

Increase logo/nav spacing, prevent nav overlap with the logo, and ensure the "Book a Call Today" CTA does not wrap at common desktop widths.

**Evidence:** Playwright screenshots show cramped nav on service and comparison desktop pages.

### 6. Adjust the mobile floating "Book Now" button

**Files:** shared floating CTA styles/scripts

Prevent the floating button from covering hero/form content on mobile. Use route-aware hiding, lower z-index, bottom spacing, or delayed display after the first viewport.

**Evidence:** Mobile homepage screenshot shows the button overlapping content near the hero/form transition.

## Medium - Fix Within 1 Month

### 7. Tighten long titles and descriptions on priority pages

**Files:** guide, compare, location, case study, and tool pages

Prioritize pages with titles above 80 characters and descriptions above 180 characters. Do not shorten keyword-rich descriptions blindly; rewrite them into complete, SERP-friendly snippets.

**Acceptance:** Commercial pages have clean titles under roughly 70 characters where practical and descriptions that avoid awkward truncation.

### 8. Expand `llms.txt` to full sitemap coverage

**File:** `llms.txt`

Add the 6 missing sitemap routes:

- `/meet-your-va/`
- `/partner/`
- `/privacy/`
- `/refund-policy/`
- `/terms/`

### 9. Improve contextual internal linking

**Files:** blog, guide, case study, compare, and service pages

Add more contextual links between guides, blog posts, case studies, and commercial pages. Link major proof claims to the matching case study near the claim.

**Evidence:** Linkinator found only 142 local links across an 80-route sitemap.

### 10. Add durable Organization `@id` references

**Files:** shared schema blocks and high-value page JSON-LD

Use a consistent Organization entity ID such as `https://www.vahorizon.site/#organization` and reference it from Service, Article, BlogPosting, and SoftwareApplication schema where appropriate.

### 11. Convert heavy PNG/JPG assets to modern formats

**Files:** `img/`, `CRM_PICS/`, `proof/`, `signatures/`, testimonial assets

Generate WebP/AVIF variants and use `<picture>` where fallback support matters. Remove duplicate public copies where a single canonical asset can serve the same role.

### 12. Make testimonial text crawlable

**Files:** homepage and proof/testimonial sections

Keep testimonial images only where they add trust visually; move important testimonial copy into HTML text so search and AI crawlers can quote it.

## Low - Backlog

### 13. Improve sitemap `lastmod` precision

**File:** `sitemap.xml`

Replace the blanket `2026-05-25` date with meaningful per-page dates when content is materially changed.

### 14. Re-run Lighthouse when npm/network is stable

**Command:** `npx.cmd lighthouse http://127.0.0.1:4173/ --output=json --output-path=output/playwright/lighthouse-home.json --chrome-flags="--headless --no-sandbox"`

The May 25 attempt failed during package fetch with `ECONNRESET`, so fresh Core Web Vitals lab metrics are still missing.

### 15. Keep FAQPage schema only where it adds value

**Files:** FAQ-bearing templates

FAQPage schema appears on 36 generated pages. Keep it where the FAQ is visible and page-specific; remove it from thin or repeated FAQ blocks if it becomes boilerplate.

## Verification Checklist

- [x] `node scripts/build-site.mjs` completes.
- [x] `_site` no longer contains `.playwright-cli/`, `output/`, dev scripts, or local audit artifacts.
- [x] `npm.cmd run seo:audit` passes.
- [ ] `npm.cmd run images:check` passes.
- [ ] `npm.cmd run links` passes.
- [ ] Representative Playwright screenshots show no desktop header overlap and no mobile floating CTA overlap.
- [x] Blog schema parser reports `Person:Youssef Ahmed` authors.
- [x] `llms.txt` covers all sitemap URLs or intentionally documents exclusions (137 URLs; bare hub roots `/`, `/blog/`, `/case-studies/` covered contextually).
