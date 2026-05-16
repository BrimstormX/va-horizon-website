# VA Horizon SEO Action Plan — March 19, 2026

Prioritized fixes from the full SEO audit. Each item includes the file(s) to modify.

---

## Critical — Fix Immediately

### 1. Extract base64 fonts from fonts.css into .woff2 files
**File:** `fonts.css` -> new `/fonts/*.woff2` files
**What:** Replace 203 KB render-blocking CSS (base64 fonts) with ~3 KB @font-face declarations pointing to external .woff2 files. Preload the 2 most critical weights (Bold, Black).
**Impact:** LCP improvement from 3.5-5.0s to under 2.5s. Largest single performance win.

### 2. Remove/defer 1.55 MB VAHorizonWebsiteStyle JS preload
**File:** `index.html` (and any page with this preload)
**What:** Audit whether the Figma-exported JS runtime is needed. If so, load with `defer` at bottom of `<body>` instead of `<link rel="preload">` in `<head>`. If not needed, remove entirely.
**Impact:** LCP -1s on homepage.

### 3. Fix homepage dual H1
**File:** `index.html` (~line 677)
**What:** Change noscript body H1 to H2.
**Impact:** Single clear H1 for search engines.

### 4. Delete deprecated HowTo schema (if still present)
**File:** `industries/real-estate/index.html` (~line 562)
**What:** Remove the entire HowTo block from the @graph array. Keep Service, BreadcrumbList, and FAQPage schemas.
**Impact:** Eliminates schema validation errors.

### 5. Fix author name mismatch
**Files:** `about/index.html`, `compare/best-cold-calling-va-companies/index.html`, `compare/va-horizon-vs-myoutdesk/index.html`
**What:** Standardize to one canonical name across all schema and visible content.
**Impact:** E-E-A-T factual consistency.

---

## High — Fix Within 1 Week

### 6. Fix priceRange in Organization schema
**File:** `index.html` (Organization JSON-LD)
**What:** Change `"$640-$800 USD/month"` to `"$960-$1,440 USD/month"`.

### 7. Fix Organization URL trailing slash site-wide
**Files:** ~20 HTML files with Organization schema
**What:** Change `"url": "https://www.vahorizon.site"` to `"url": "https://www.vahorizon.site/"`.

### 8. Fix broken breadcrumb links on blog + case study pages
**Files:** All 13 `blog/*/index.html` and `case-studies/*/index.html`
**What:** Breadcrumb "Blog" href from `/` to `/blog/`; "Case Studies" href from `/` to `/case-studies/`. Fix both HTML and BreadcrumbList schema.

### 9. Remove /services/cold-calling/ from sitemap
**File:** `sitemap.xml`
**What:** Delete the `<url>` entry for `https://www.vahorizon.site/services/cold-calling/` (redirect page).

### 10. Add width/height to all images missing dimensions
**File:** `index.html` (14 images), plus check all other pages
**What:** Add explicit `width` and `height` attributes. Also self-host the partner page image from ibb.co.
**Impact:** CLS from 0.1-0.2 to <0.05.

### 11. Remove dead monitoring.js
**Files:** All pages loading `scripts/monitoring.js`
**What:** Remove `<script>` tags referencing monitoring.js. The script loads Sentry with placeholder DSN.

### 12. Add CSP meta tag to all subpages
**Files:** 25+ HTML files
**What:** Copy the `<meta http-equiv="Content-Security-Policy">` from index.html to every page's `<head>`.

### 13. Fix Playfair Display font violation
**File:** `industries/real-estate/index.html`
**What:** Replace `font-family: 'Playfair Display'` in `.why-number` with `font-family: 'Montserrat', sans-serif`.

### 14. Change blog author schema from Organization to Person
**Files:** All 7 `blog/*/index.html`
**What:** Replace `"author": {"@type": "Organization", "name": "VA Horizon"}` with:
```json
"author": {
  "@type": "Person",
  "name": "Youssef Ahmed",
  "url": "https://www.vahorizon.site/about/",
  "sameAs": "https://www.linkedin.com/in/youssef-ahmed-255966380/"
}
```
Also add visible author byline to the HTML body of each post.

### 15. Fix unattributed metrics
**Files:** Homepage, service pages, case study pages
**What:** Link every instance of "18% to 92%" to `/case-studies/speed-to-lead/`, "1 to 4 deals/month" to `/case-studies/scaling-outbound/`, etc.

---

## Medium — Fix Within 1 Month

### 16. Add JSON-LD schema to legal pages
**Files:** `privacy/index.html`, `terms/index.html`, `refund-policy/index.html`
**What:** Add WebPage + BreadcrumbList JSON-LD blocks.

### 17. Add og:description + twitter:description to legal pages
**Files:** Same 3 legal page files.
**What:** Add `<meta property="og:description">` and `<meta name="twitter:description">` matching the existing meta description.

### 18. Add ContactPage schema to /apply/
**File:** `apply/index.html`
**What:** Add `"@type": "ContactPage"` to the existing JSON-LD.

### 19. Add schema to /partner/ and /leadgen/
**Files:** `partner/index.html`, `leadgen/index.html`
**What:** Partner: WebPage + BreadcrumbList. Leadgen: JobPosting + BreadcrumbList.

### 20. Add price to CRM SoftwareApplication Offer
**File:** `crm/index.html`
**What:** Add `"price": "0"` to the Offer block (CRM is included with VA service).

### 21. Set accurate lastmod dates in sitemap
**File:** `sitemap.xml`
**What:** Replace blanket 2026-03-10 with actual per-page modification dates. Use git log to determine real dates.

### 22. Remove FAQPage schema (generates zero rich results)
**Files:** `index.html`, `crm/index.html`, `industries/real-estate/index.html`, `partner/index.html`
**What:** Remove FAQPage entries from @graph arrays. Keep FAQ accordion UI for UX.

### 23. Expand llms.txt to 100% page coverage
**File:** `llms.txt`
**What:** Add all 5 missing blog posts, both comparison pages, and a structured "Key Facts" block.

### 24. Add external citations to blog posts
**Files:** All 7 `blog/*/index.html`
**What:** Add 2-3 external source citations per post (NAR stats, PropStream docs, HighLevel docs, BiggerPockets data).

### 25. Convert images to WebP with picture fallbacks
**Files:** All image assets in `/img/`, `/social/`, `/CRM_PICS/`, `/proof/`
**What:** Create WebP versions, use `<picture>` elements with PNG/JPG fallback. Expected 60-80% size reduction.

### 26. Move FAQ content from JS injection to static HTML
**File:** `buttons.js` -> HTML files
**What:** FAQ answers are currently injected by buttons.js at runtime. Move to static HTML in each page for instant rendering and AI crawlability.

### 27. Add author bylines to blog posts
**Files:** All 7 blog post HTML files
**What:** Add visible "By Youssef Ahmed" byline with link to /about/.

### 28. Convert testimonials from images to indexable text
**Files:** Homepage and relevant service pages
**What:** Replace image-based testimonials with HTML text. Keep photos as decorative avatars.

### 29. Add font-display: swap verification
**File:** `fonts.css`
**What:** Verify all @font-face rules have font-display: swap. Add font metric overrides (size-adjust, ascent-override) for FOUT prevention.

---

## Low — Backlog

### 30. Remove priority and changefreq from sitemap
**File:** `sitemap.xml`
Google ignores both tags. Removing them reduces maintenance overhead.

### 31. Self-host web-vitals library
**File:** `scripts/webvitals.js`
Replace unpkg.com import with self-hosted copy.

### 32. Add preconnect for Plausible analytics
**Files:** All pages
Add `<link rel="preconnect" href="https://plausible.io">`.

### 33. Reduce homepage HTML size (171 KB)
**File:** `index.html`
Move inline `<style>` blocks into external stylesheet. Remove duplicate Tailwind property layer.

### 34. Stagger blog/case study publish dates
All 13 pieces were published in a 4-day window (March 6-10). Consider updating `datePublished` in schema to reflect a more natural cadence. Update `dateModified` to current date when content is refreshed.

### 35. Fix internal linking gaps
- Add /industries/real-estate/ to primary nav
- Fix /leadgen/ footer Privacy dead href
- Fix /partner/ logo href="#top" to href="/"
- Add blog-to-blog cross-links
- Add case study to blog post links

### 36. Remove XHTML xmlns attributes
Unnecessary for HTML5 doctype.

### 37. Add @id to Organization schema
Add `"@id": "https://www.vahorizon.site/#organization"` for entity disambiguation.

### 38. Fix pricing toggle INP risk
Replace setTimeout(300) with CSS transition or requestAnimationFrame.

---

## Verification Checklist

After implementing fixes:

- [ ] Google Rich Results Test: zero errors on all modified pages
- [ ] Lighthouse: Performance 70+, SEO 95+, Best Practices 90+
- [ ] XML Sitemaps Validator: sitemap.xml passes validation
- [ ] Chrome DevTools: LCP <2.5s, CLS <0.1, INP <200ms
- [ ] Google Search Console: no new indexing errors
- [ ] Internal links: `grep -r 'href="/"' blog/ case-studies/` returns zero broken breadcrumbs
- [ ] Schema: all Organization URLs end with trailing slash
- [ ] Author: all blog posts show Person author in schema and visible byline
