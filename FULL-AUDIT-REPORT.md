# VA Horizon SEO Audit Report - May 25, 2026

Audit target: local repo and refreshed `_site` build  
Site origin: `https://www.vahorizon.site`  
Business type: managed virtual assistant agency for real estate wholesalers  
Local build: 199 public files, 86 HTML files, 80 indexable sitemap URLs

## SEO Health Score: 82 / 100

| Category | Weight | Score | Weighted |
|---|---:|---:|---:|
| Technical SEO | 25% | 86 | 21.5 |
| Content / E-E-A-T | 25% | 85 | 21.3 |
| On-Page SEO | 20% | 82 | 16.4 |
| Schema / Structured Data | 10% | 84 | 8.4 |
| Performance (CWV proxy) | 10% | 62 | 6.2 |
| Images | 5% | 82 | 4.1 |
| AI Search Readiness | 5% | 86 | 4.3 |
| **Total** | | | **82.2 / 100** |

The site has moved well beyond the older March audit state: sitemap parity is clean, JSON-LD parses across indexable pages, CSP is present in generated pages, image dimensions pass, and the local SEO gate reports zero blocking issues.

## Executive Summary

### What Passed

- `node scripts/build-site.mjs` completed: `_site` contains 86 HTML files.
- `npm.cmd run seo:audit` passed: 86 HTML files checked, 0 blocking issues.
- `npm.cmd run images:check` passed.
- `npm.cmd run links` scanned 142 local links and returned all 200 responses.
- Sitemap has 80 URLs, all matched by indexable canonical pages.
- No indexable page has missing JSON-LD, missing CSP, invalid canonical parity, or multiple H1s.
- Robots.txt allows major AI search crawlers and points to the canonical sitemap.

### Top Current Risks

1. `_site` currently includes local/tool artifacts such as `.playwright-cli/` and `output/playwright/`, plus build/audit scripts. These should not ship.
2. Large legacy homepage assets remain in `_site`, including a 1.55 MB Figma component JS bundle and a 629 KB runtime bundle.
3. Several meta descriptions are truncated or overly long, including `/leadgen/`, `/tools/`, and `/case-studies/highlevel-crm-buildout/`.
4. Blog post schema still uses `Organization: VA Horizon` as author even though visible bylines say Youssef Ahmed.
5. Desktop headers are cramped on subpage templates, and the mobile floating "Book Now" button can overlap above-fold content.

### Measurement Notes

- Playwright Chromium was installed and used for local screenshots.
- Screenshots were captured for homepage, service, CRM, blog, guide, tool, comparison, case study, and legal templates in `output/playwright/`.
- A local Lighthouse run was attempted, but `npx lighthouse` failed during package fetch with `ECONNRESET`. Performance scoring is therefore based on asset inspection, rendered screenshots, and local checks rather than fresh Lighthouse metrics.

## Technical SEO

### Strengths

- 80 sitemap URLs exactly match the 80 indexable canonical routes.
- Redirect/noindex pages are correctly excluded from the sitemap: `/ai-automations.html`, `/privacy.html`, `/refund-policy.html`, `/terms.html`, and `/services/cold-calling/`.
- All indexable pages have canonical URLs, meta descriptions, Twitter cards, OG images, BreadcrumbList schema, and one H1.
- CSP meta tags are present in generated `_site` pages.
- Organization schema URLs use the trailing slash canonical form.

### Issues

- The generated `_site` includes non-public directories/files:
  - `.playwright-cli/`
  - `output/playwright/`
  - root `.gitignore`
  - `scripts/` files such as audit and hardening utilities
  - `security-headers.conf`
- `sitemap.xml` has 80 identical `<lastmod>` values: `2026-05-25`. This is not a blocker, but it weakens lastmod usefulness.
- Linkinator only discovered 142 local links from `_site`, which is low relative to the 80-page footprint and suggests many routes rely on sitemap/nav discovery more than contextual internal links.

## Content / E-E-A-T

### Strengths

- Blog, guide, comparison, and case study content is substantial and niche-specific.
- All 29 guides inspected have visible Youssef Ahmed bylines and external citations.
- Comparison pages include disclosures and external references.
- Legal pages now have JSON-LD and are indexable directory URLs.

### Issues

- 7 blog posts show visible Youssef Ahmed bylines but use `Organization: VA Horizon` in schema author fields.
- `/apply/` has about 217 visible words and `/refund-policy/` has about 147 visible words. These are acceptable utility pages but thin by SEO content standards.
- `llms.txt` references 74 of 80 sitemap URLs. Missing sitemap routes: `/meet-your-va/`, `/leadgen/`, `/partner/`, `/privacy/`, `/refund-policy/`, and `/terms/`.
- Case study metrics are strong, but some high-impact claims would benefit from clearer source/case-study cross-links near the claims.

## On-Page SEO

### Strengths

- Every indexable page has exactly one H1.
- Canonicals and OG URLs are aligned with directory-format routes.
- No content images are missing alt text.
- Breadcrumbs are present across indexable pages.

### Issues

- Short or truncated meta descriptions:
  - `/case-studies/highlevel-crm-buildout/` - 24 chars: "How a Houston wholesaler"
  - `/leadgen/` - 20 chars: "Apply for VA Horizon"
  - `/tools/` - 38 chars
  - `/privacy/`, `/refund-policy/`, `/case-studies/speed-to-lead/` are under 100 chars.
- 32 pages have descriptions above 180 chars. Many may still be intentional keyword descriptions, but SERP snippets will likely truncate.
- 41 pages have titles above 70 chars, mostly guide, comparison, location, and tool pages.
- Legal page titles are short but acceptable; they are low commercial priority.

## Schema & Structured Data

### Current Implementation

Schema types detected in `_site` include:

- `BreadcrumbList`: 81
- `FAQPage`: 36
- `BlogPosting`: 35
- `Service`: 13
- `Article`: 12
- `WebPage`: 8
- `SoftwareApplication`: 6
- `Organization`: 2
- `ContactPage`, `Blog`, `CollectionPage`, `ItemList`, `WebSite`, `JobPosting`, `WebApplication`

### Issues

- Blog posts should use a `Person` author in `BlogPosting` schema to match visible bylines.
- FAQPage schema is widespread. It is not harmful, but Google FAQ rich result visibility is limited; keep it only where FAQ content is visible and useful.
- High-value service and comparison pages should consistently reference the same Organization `@id` for entity disambiguation.

## Performance

### Current Risk Profile

- Largest local assets:
  - `audio/agent-elijah-coldcall-02.mp3` - 2.0 MB
  - `audio/agent-jeffrey-coldcall-01.mp3` - 1.8 MB
  - Figma component JS bundle - 1.55 MB
  - Figma sites runtime - 629 KB
  - Homepage HTML - 170 KB
- Largest images are mostly 100-240 KB PNG/JPG assets. No image dimension issues were found.
- `fonts.css` is now small, and critical Montserrat font preloads are present in generated HTML.

### Issues

- The legacy `VAHorizonWebsiteStyle` assets are still copied to `_site`. Even if not render-blocking on every page, they are a deployment weight and cache cost.
- `_site` includes old screenshot artifacts, which inflate the publish directory and can expose internal audit output.
- Lighthouse could not be freshly measured because npm failed to fetch Lighthouse with `ECONNRESET`.

## Images

### Strengths

- `npm.cmd run images:check` passed.
- Parsed image audit found 485 images with 0 missing alt text and 0 missing explicit dimensions.

### Issues

- Many CRM/proof/testimonial images are still PNG/JPG. WebP/AVIF versions would reduce transfer size.
- Duplicate image families exist in both `CRM_PICS/` and `img/`.
- Testimonial images remain image-based content; any important testimonial text should also exist as crawlable HTML.

## Visual / Mobile

Representative screenshots were captured for:

- Homepage desktop and mobile
- `/industries/real-estate/`
- `/crm/`
- `/blog/`
- `/guides/cold-calling-real-estate-wholesaling/`
- `/tools/mao-calculator/`
- `/compare/va-horizon-vs-myoutdesk/`
- `/case-studies/speed-to-lead/`
- `/privacy/`

Findings:

- Homepage desktop and mobile render correctly above the fold.
- Subpage desktop nav is cramped; the first nav item touches or overlaps the logo area on service/comparison templates.
- Header CTA text wraps to two lines on several desktop subpage screenshots.
- Mobile floating "Book Now" can overlap content near the lower-right viewport, especially on the homepage hero/form transition.
- Legal mobile page is readable and properly spaced.

## AI Search Readiness

### Strengths

- `robots.txt` explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, anthropic-ai, PerplexityBot, and Bytespider.
- `llms.txt` is present and covers most indexable routes.
- Guides and comparisons include specific, quotable claims, bylines, and external citations.
- Structured data exists across every indexable page.

### Issues

- `llms.txt` is missing 6 sitemap routes.
- Blog author schema should be upgraded from Organization to Person.
- Some proof points and performance claims should be linked more directly to named case studies.

## Verification Log

- Build: passed (`node scripts/build-site.mjs`)
- Static SEO audit: passed (`npm.cmd run seo:audit`)
- Image dimension check: passed (`npm.cmd run images:check`)
- Local link crawl: passed (`npm.cmd run links`)
- Local server: passed at `http://127.0.0.1:4173/`
- Playwright screenshots: passed after installing Chromium
- Lighthouse: blocked by npm `ECONNRESET`

See `ACTION-PLAN.md` for prioritized implementation details.
