# VA Horizon SEO Audit Report — March 9, 2026

Site: https://www.vahorizon.site | Pages: 23 | Business: Cold calling VA services + CRM for U.S. real estate wholesalers

## SEO Health Score: 68 / 100

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 25% | 68 | 17.0 |
| Content / E-E-A-T | 25% | 71 | 17.8 |
| On-Page SEO | 20% | 82 | 16.4 |
| Schema | 10% | 55 | 5.5 |
| Performance (CWV) | 10% | 65 | 6.5 |
| Images | 5% | 55 | 2.75 |
| AI Search Readiness | 5% | 58 | 2.9 |
| **Total** | | | **68.9 / 100** |

Fixing Critical + High items projects to ~87/100.

---

## What's Working

- Every indexable page has a unique title, meta description, canonical, OG tags, and mobile viewport
- robots.txt correctly allows GPTBot, ClaudeBot, PerplexityBot, anthropic-ai, OAI-SearchBot, Bytespider; blocks CCBot
- llms.txt is present and well-structured -- a strong AI discoverability signal
- Sitemap is valid XML with 23 URLs, all canonical, all with trailing slashes
- Legacy .html files carry noindex and meta refresh (though server-side 301s are still needed)
- Blog articles are genuinely substantive: 4,000-5,000 words each with specific industry details

---

## Critical Issues

### 1. Duplicate H1 on homepage
File: index.html (lines 253 and 339)

The noscript block emits a full H1 tag. The main rendered layout emits a second H1. Google processes noscript content -- both H1s are read by the crawler, creating conflicting topic signals.

Fix: Change the H1 inside the noscript block to H2.

---

### 2. FAQPage schema on 3 pages (generates zero rich results)
Files: index.html, crm/index.html, industries/real-estate/index.html

Google restricted FAQPage rich results to government and health authority sites in August 2023. These blocks produce no rich results. Remove the FAQPage entries from the @graph arrays.

---

### 3. HowTo schema on real-estate page (generates zero rich results)
File: industries/real-estate/index.html

Google permanently removed HowTo rich results in September 2023. Remove the HowTo block entirely.

---

### 4. Legal pages render unstyled
Files: privacy/index.html, terms/index.html, refund-policy/index.html

These pages load href="css/va-custom.css" -- a relative path that resolves to /privacy/css/va-custom.css. That directory does not exist. These pages render without styles in production.

Fix: Change to href="../css/va-custom.css" on all three files.

---

### 5. No named author on blog posts
Files: Both published blog articles

Both posts are attributed to "VA Horizon Team." Under Google's September 2025 Quality Rater Guidelines, guidance content covering hiring decisions and $1,000+/month services requires named authors. The founder Youssef Abi-Fadel has a LinkedIn profile -- his name should appear as author.

Fix: Add on-page author byline and change BlogPosting schema author from Organization to Person.

---

## High Priority Issues

### 6. Legacy .html files use client-side redirect, not server 301
Files: ai-automations.html, privacy.html, terms.html, refund-policy.html

Meta refresh is client-side and host-dependent. Server-side 301 redirects are needed to reliably transfer link equity and prevent crawl budget waste.

Fix: Create a _redirects file at project root with 301 rules for each. Delete index_formatted.html (0 bytes).

---

### 7. BreadcrumbList references non-existent /industries/ URL
File: industries/real-estate/index.html JSON-LD

The BreadcrumbList lists /industries/ as position 2. No such page exists. Google Search Console will flag this.

Fix: Use 2-level breadcrumb: Home > Real Estate Wholesaling VAs.

---

### 8. Service pages receive zero nav link equity
Neither /services/cold-calling/ nor /industries/real-estate/ is in the primary navigation. Nav links point to #services (a homepage anchor). Two high-value pages are not receiving direct PageRank flow.

Fix: Add /industries/real-estate/ as "Cold Calling VAs" in the primary nav on all pages.

---

### 9. Blog post schema author is Organization, not Person
Files: Both blog articles

Google requires author to be a Person type for Article rich results.

Replacement JSON:
  "author": {
    "@type": "Person",
    "name": "Youssef Abi-Fadel",
    "url": "https://www.vahorizon.site/about/",
    "sameAs": "https://www.linkedin.com/in/youssef-ahmed-255966380/"
  }

---

### 10. 5 of 6 case studies have no Article schema
Files: lead-manager-roi/, scaling-outbound/, highlevel-crm-buildout/, dispo-follow-up/, speed-to-lead/

Only va-replacement has individual Article schema. The other 5 need identical Article blocks with author, publisher, image.

---

### 11. fonts.css is synchronous and render-blocking with no font-display strategy
This is the primary LCP bottleneck. Loads synchronously with no preload, presumably no font-display: swap.

Fix: Add font-display: swap to every @font-face in fonts.css. Add rel="preload" for the primary Montserrat woff2 file.

---

### 12. Testimonial images have no width/height attributes (CLS)
File: index.html ~lines 1484-1527

All 6 testimonial images are missing width and height attributes. The browser cannot reserve space, causing layout shift as they lazy-load.

Fix: Add explicit width and height attributes. The existing cards.css rule img[width][height] { height: auto } will maintain aspect ratio.

---

### 13. Results metrics unattributed throughout the site
The four core metrics (18%->92% answer rate, 1->4 deals/month, 21->6 day dispo, $45k->$180k pipeline) appear on multiple pages with no link to the case study that produced them. AI citation engines cannot cite these without a verifiable source.

Fix: Link each metric instance to the corresponding case study.

---

### 14. Partner page external image + no dimensions
File: partner/index.html

Image hotlinked from ibb.co with no width/height. CLS risk + reliability risk (ibb.co images can be deleted externally).

Fix: Self-host the image. Add width and height.

---

## Medium Priority Issues

- /leadgen/ nav links all point to vahorizon.site generic; footer Privacy is a dead href="#" anchor
- /partner/ logo links to href="#top" instead of the main site homepage
- og:description missing on all three legal pages
- web-vitals library imported from unpkg CDN -- should be self-hosted
- Inline counter IIFE runs synchronously in body -- wrap in requestIdleCallback
- buttons.js injects style tags into head at runtime -- move to static CSS
- No physical address in schema or footer
- No _headers file for security header configuration (HSTS, X-Frame-Options, etc.)
- areaServed on Service schema uses string "US" instead of Country object
- SoftwareApplication offers on CRM page has no price field
- /services/cold-calling/ is 70-75% content overlap with /industries/real-estate/
- Dial count inconsistency: 200+ (service page) vs 800-1,000 (blog) -- needs context
- No external citations in either blog post

## Low Priority Issues

- og:image:width/height missing on /leadgen/ and /partner/
- XHTML xmlns attribute on html elements -- not needed for HTML5
- No @id on Organization schema block
- No founder photograph -- About page uses letter-initial avatar
- Homepage lastmod in sitemap is stale (2026-01-30)
- changefreq and priority tags in sitemap -- Google ignores both (46 tags to remove)
- Pricing toggle uses setTimeout(300) in click handler (INP risk)
- buttons.js uses per-element event listeners instead of delegation

---

## AI Search Readiness: 58 / 100

Strengths: All AI crawlers allowed; llms.txt present; blog posts contain highly specific quotable facts.
Weaknesses: Core metrics not attributed to named/dated events; author is "VA Horizon Team"; no external citations; no speakable schema.

---

See ACTION-PLAN.md for implementation details and code samples.
