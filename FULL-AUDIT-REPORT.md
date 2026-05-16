# VA Horizon SEO Audit Report — March 19, 2026

Site: https://www.vahorizon.site | Pages: 28 canonical + 4 legacy redirects | Business: Managed VA agency for real estate wholesalers

## SEO Health Score: 72 / 100

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 25% | 78 | 19.5 |
| Content / E-E-A-T | 25% | 72 | 18.0 |
| On-Page SEO | 20% | 88 | 17.6 |
| Schema | 10% | 75 | 7.5 |
| Performance (CWV) | 10% | 40 | 4.0 |
| Images | 5% | 50 | 2.5 |
| AI Search Readiness | 5% | 68 | 3.4 |
| **Total** | | | **72.5 / 100** |

Fixing Critical + High items projects to ~90/100.

---

## What's Working

- Every indexable page has a unique title (48-81 chars), meta description (85-217 chars), canonical URL, OG tags, Twitter cards, and mobile viewport
- robots.txt allows GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, ChatGPT-User, Bytespider; blocks CCBot
- llms.txt present and well-structured for AI discoverability
- Sitemap valid XML with 29 URLs, all canonical, all trailing slashes
- Legacy .html files carry noindex + canonical + meta-refresh (best available on GitHub Pages)
- Blog posts are substantive: 1,500-5,000 words each with industry-specific data
- All 7 blog posts have BlogPosting + BreadcrumbList schema
- All 6 case studies have Article + BreadcrumbList schema
- CRM page uses SoftwareApplication schema (correct per business type)
- Service pages use Service schema
- Case studies index uses CollectionPage + ItemList
- Compare roundup uses Article + ItemList
- Organization schema includes sameAs with LinkedIn URL
- HowTo schema removed from real estate page (fixed since last audit)
- font-display: swap added to @font-face rules (fixed since last audit)
- Testimonial images now have width/height (fixed since last audit)

---

## Critical Issues

### 1. Homepage JS rendering dependency
File: index.html

The homepage content is rendered client-side via a 1.55 MB JS bundle (VAHorizonWebsiteStyle). The `<noscript>` in `<head>` hides `#container` when JS is disabled. AI crawlers (GPTBot, ClaudeBot, PerplexityBot) do not execute JavaScript. A body-level noscript fallback exists with static content (H2 tags, links), which partially mitigates this. All other pages are fully static HTML.

Impact: LCP estimated 3.5-5.0s. AI crawlers see fallback content only, not the full page.

Fix: Pre-render the homepage to static HTML like all other pages, or ensure the noscript fallback contains all key content passages.

---

### 2. fonts.css is 203 KB render-blocking
File: fonts.css

Contains 4 Montserrat weights with base64-encoded font data inlined directly into the CSS. This single file must fully download and parse before any text renders. On mobile connections this adds 1-2 seconds to LCP.

Fix: Extract base64 data into separate .woff2 files in /fonts/ directory. Replace fonts.css with ~3 KB @font-face declarations. Preload the 2 most critical weights.

---

### 3. Homepage has two H1 tags
File: index.html (~line 677 and ~line 775)

The noscript body fallback contains an H1 and the main JS-rendered content contains another H1. Search engines parse the full HTML, finding two competing H1 tags.

Fix: Change the noscript H1 to H2.

---

### 4. Deprecated HowTo schema on real estate page
File: industries/real-estate/index.html (~line 562)

**STATUS: NEEDS VERIFICATION** -- This was reported as removed in the GEO analysis but the technical audit still flags it. Verify and delete if present.

---

### 5. Author name mismatch across schema
Files: about/index.html uses "Youssef Ahmed"; compare/best-cold-calling-va-companies/index.html and compare/va-horizon-vs-myoutdesk/index.html use "Youssef Abi-Fadel"

This factual inconsistency is an immediate E-E-A-T risk. One canonical name must be used everywhere.

Fix: Standardize to one name across all schema and visible bylines.

---

## High Priority Issues

### 6. Organization priceRange is incorrect
File: index.html (Organization schema)

Schema says "$640-$800 USD/month" but actual pricing is $960/mo ($6/hr) for cold calling VAs.

Fix: Update to "$960-$1,440 USD/month" to reflect current service range.

---

### 7. Organization URL missing trailing slash (~20 pages)
Every page's Organization reference uses `"url": "https://www.vahorizon.site"` instead of `"url": "https://www.vahorizon.site/"`. Inconsistent with canonical URLs.

Fix: Add trailing slash to Organization URL across all pages.

---

### 8. Broken breadcrumb links on blog + case study pages
Files: All 13 blog + case study pages

Breadcrumb links for "Blog" and "Case Studies" point to `/` instead of `/blog/` and `/case-studies/`.

Fix: Update breadcrumb href values in both HTML and BreadcrumbList schema.

---

### 9. Redirect page in sitemap
File: sitemap.xml

`/services/cold-calling/` is in the sitemap but the page is a meta-refresh redirect to `/industries/real-estate/`. Only canonical URLs belong in sitemaps.

Fix: Remove the /services/cold-calling/ entry from sitemap.xml.

---

### 10. 14 of 19 homepage images missing width/height
File: index.html

Most content images (beyond testimonials, which were fixed) lack explicit width and height attributes. Primary source of CLS (estimated 0.1-0.2).

Fix: Add width and height to all images.

---

### 11. Dead monitoring.js loads Sentry with placeholder DSN
File: scripts/monitoring.js (loaded on multiple pages)

Downloads the Sentry SDK bundle but uses `"YOUR_DSN"` as the DSN -- pure dead code adding to page weight.

Fix: Remove all references to monitoring.js from HTML files, or configure a real DSN.

---

### 12. CSP meta tag only on homepage
File: index.html has CSP; all 25+ subpages lack it

GitHub Pages doesn't support custom HTTP headers, so CSP must be in each HTML file's `<head>`.

Fix: Copy CSP meta tag to every page.

---

### 13. Playfair Display font violation on real estate page
File: industries/real-estate/index.html

`.why-number` CSS class uses `font-family: 'Playfair Display'`, violating the Montserrat-only brand rule in CLAUDE.md.

Fix: Replace with `font-family: 'Montserrat', sans-serif`.

---

### 14. Blog post author schema uses Organization, not Person
Files: All 7 blog/*/index.html

Google requires author `@type: Person` for Article rich results eligibility.

Fix: Change to `"@type": "Person", "name": "Youssef Abi-Fadel", "url": "https://www.vahorizon.site/about/"`. Add visible author bylines to HTML.

---

### 15. Service pages receive zero nav link equity
Neither /industries/real-estate/ nor /ai-automations/ is in the primary navigation. Nav links point to #services (homepage anchor). High-value pages miss direct PageRank flow.

Fix: Add /industries/real-estate/ as "Cold Calling VAs" in the primary nav.

---

## Medium Priority Issues

### Schema Gaps
- /privacy/, /terms/, /refund-policy/ have zero JSON-LD -- need WebPage + BreadcrumbList
- /apply/ has only BreadcrumbList -- needs ContactPage schema
- /partner/ needs WebPage + BreadcrumbList schema
- /leadgen/ needs JobPosting + BreadcrumbList schema
- /crm/ SoftwareApplication Offer missing `"price": "0"`

### Social/OG Gaps
- Legal pages (privacy, terms, refund-policy) missing og:description and twitter:description
- Legal pages use `summary` Twitter card instead of `summary_large_image`

### Content Issues
- All 13 blog posts + case studies published in 4-day window (March 6-10) -- triggers bulk content pattern
- No external citations in any blog post
- No visible author bylines on blog posts
- Results metrics (18%->92%, 1->4 deals/month, etc.) unattributed -- not linked to case studies

### Technical Issues
- Sitemap lastmod dates all identical (2026-03-10) -- Google may ignore signal
- `<priority>` and `<changefreq>` in sitemap (Google ignores both)
- 1.55 MB VAHorizonWebsiteStyle JS preloaded in `<head>` -- steals bandwidth from render-blocking CSS
- buttons.js dynamically injects FAQ answers and content at runtime -- should be static HTML
- web-vitals loaded from unpkg.com CDN -- should self-host
- Homepage HTML is 171 KB (bloated by inline styles + duplicate Tailwind layer)
- No images use WebP or AVIF format
- Partner page hotlinks image from ibb.co -- reliability risk

### Internal Linking
- No blog-to-blog cross-links (posts only link to service pages)
- Case studies don't link to relevant blog posts
- /leadgen/ footer Privacy link is dead href="#"
- /partner/ logo links to href="#top" instead of homepage

---

## Low Priority Issues

- og:image:width/height missing on /leadgen/ and /partner/
- XHTML xmlns attribute on html elements (not needed for HTML5)
- No @id on Organization schema block
- No founder photograph (About page uses letter-initial avatar)
- Pricing toggle uses setTimeout(300) in click handler (INP risk)
- buttons.js uses per-element event listeners instead of delegation
- No physical address in schema or footer
- Inline counter IIFE runs synchronously -- wrap in requestIdleCallback
- buttons.js injects style tags into head at runtime -- move to static CSS
- areaServed on Service schema uses string "US" instead of Country object

---

## Performance Assessment

| Metric | Estimate | Rating | Threshold |
|--------|----------|--------|-----------|
| LCP | 3.5-5.0s | POOR | 2.5s |
| INP | <200ms | GOOD | 200ms |
| CLS | 0.1-0.2 | NEEDS IMPROVEMENT | 0.1 |

Estimated Lighthouse Performance Score: 35-50 / 100

### Root Causes (ordered by impact)
1. fonts.css = 203 KB render-blocking (base64 fonts)
2. VAHorizonWebsiteStyle JS = 1.55 MB preloaded
3. Homepage HTML = 171 KB (inline styles + duplicate Tailwind)
4. 14 images missing width/height -> CLS
5. All images PNG/JPG -- no WebP/AVIF
6. buttons.js injects content at runtime -> layout shifts
7. monitoring.js loads dead Sentry SDK

### Projected Improvement
Fixing items 1-4 projects LCP from 3.5-5.0s to 1.5-2.5s (GOOD), CLS from 0.1-0.2 to <0.05 (GOOD), Lighthouse score to 70-85.

---

## AI Search Readiness: 68 / 100

### Strengths
- robots.txt explicitly allows all major AI crawlers
- llms.txt present with structured business info
- Blog posts contain specific, quotable facts and statistics
- JSON-LD structured data on 25 of 28 pages
- Organization schema includes sameAs LinkedIn

### Weaknesses
- Homepage JS-rendered -- AI crawlers see fallback content only
- llms.txt missing 5 of 7 blog posts and both comparison pages
- No external authority signals (no G2/Capterra, no press, no guest posts)
- No LinkedIn Company Page, Reddit presence, or YouTube channel
- Testimonials stored as images (not indexable text)
- Comparison tables use div styling instead of semantic `<table>` HTML
- Core metrics not attributed to named/dated case studies
- Author is Organization, not Person -- lower AI citation credibility

---

## Category Scorecard

| Category | Score | Status |
|----------|-------|--------|
| Crawlability | 85/100 | Good |
| Indexability | 72/100 | Needs Work |
| Security | 60/100 | Needs Work (platform limitation) |
| URL Structure | 82/100 | Good |
| Mobile | 90/100 | Good |
| Core Web Vitals | 40/100 | Poor |
| Structured Data | 75/100 | Needs Work |
| JavaScript Rendering | 70/100 | Needs Work |
| On-Page SEO | 88/100 | Good |
| Content Quality | 72/100 | Needs Work |
| AI Search Readiness | 68/100 | Needs Work |

---

See ACTION-PLAN.md for prioritized implementation details.
