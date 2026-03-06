# VA Horizon SEO Full Audit Report
**Site:** https://www.vahorizon.site
**Audit Date:** March 5, 2026
**Auditor:** Claude Code SEO Audit
**Pages Crawled:** 12 (full sitemap coverage)

---

## Executive Summary

**Overall SEO Health Score: 52/100**

| Category | Score | Weight | Weighted |
|----------|-------|--------|---------|
| Technical SEO | 60/100 | 25% | 15.0 |
| Content Quality | 58/100 | 25% | 14.5 |
| On-Page SEO | 35/100 | 20% | 7.0 |
| Schema / Structured Data | 65/100 | 10% | 6.5 |
| Performance (CWV) | 55/100 | 10% | 5.5 |
| Images | 50/100 | 5% | 2.5 |
| AI Search Readiness | 45/100 | 5% | 2.25 |
| **Total** | | | **53.25** |

**Business Type Detected:** B2B Virtual Assistant Staffing — Real Estate Wholesaling Niche
**Hosting:** GitHub Pages + Fastly CDN
**CMS:** Static HTML

### Top 5 Critical Issues
1. Most pages are missing title tags, meta descriptions, and canonical tags
2. Open Graph / Twitter Card tags absent on nearly all pages
3. No security headers (X-Frame-Options, CSP, X-Content-Type-Options, etc.)
4. Broken og:image using relative path on the /industries/real-estate/ page
5. offline.html included in sitemap (should be excluded)

### Top 5 Quick Wins
1. Add meta descriptions to all 12 pages (1-2 hours of work, immediate ranking signal)
2. Add canonical tags sitewide (prevents duplicate content issues)
3. Add Open Graph + Twitter Card tags to all pages (boosts social CTR)
4. Remove offline.html from sitemap.xml
5. Fix the broken og:image relative path on the real-estate industry page

---

## Technical SEO

### Crawlability
- **robots.txt:** Configured correctly. `User-agent: * / Allow: /` — all crawlers permitted.
- **Sitemap reference in robots.txt:** Points to `https://www.vahorizon.site/sitemap.xml` — correct www version.
- **Non-www redirect:** `vahorizon.site` 301-redirects to `www.vahorizon.site` — correct canonical domain consolidation.
- **HTTPS:** Fully enforced — HTTP redirects to HTTPS automatically.

### Indexability
- **Sitemap:** 12 URLs, all dated January 30, 2026. Well-structured with priority and lastmod values.
- **ISSUE — offline.html in sitemap:** `https://www.vahorizon.site/offline.html` (priority 0.1) should never be indexed. Remove it from the sitemap immediately.
- **ISSUE — leadgen/ indexability:** The `/leadgen/` page is a job/contractor posting with a JobPosting schema. If intended for external contractors, it may generate unwanted traffic. Consider `noindex` or moving to a dedicated careers domain unless you want SEO traffic for "commission-based VA jobs."

### URL Structure
- **INCONSISTENCY:** Mixed URL formats. Some pages use `.html` extensions (`ai-automations.html`, `privacy.html`, `terms.html`, `refund-policy.html`) while others use directory-style trailing slashes (`/crm/`, `/case-studies/`, `/apply/`, `/industries/real-estate/`).
- This inconsistency is not a penalty but creates a fragmented internal linking structure and complicates canonicalization.
- **Recommendation:** Standardize to trailing-slash directory URLs for all content pages.

### Security Headers (CRITICAL GAP)
Checking the response headers, the following security headers are **missing**:

| Header | Status | Impact |
|--------|--------|--------|
| X-Content-Type-Options | MISSING | Allows MIME sniffing |
| X-Frame-Options | MISSING | Clickjacking risk |
| Content-Security-Policy | MISSING | XSS risk |
| Referrer-Policy | MISSING | Data leakage risk |
| Permissions-Policy | MISSING | Feature access control |
| Strict-Transport-Security | MISSING | HSTS not enforced |

- **Note:** GitHub Pages does not natively support custom response headers. You would need Cloudflare (free tier) in front of GitHub Pages to add these headers via Transform Rules.
- These do NOT directly affect rankings but affect site trust signals and can trigger security audit warnings in Chrome.

### Performance
- **Hosting:** GitHub Pages + Fastly CDN — good global CDN coverage.
- **Homepage HTML size:** 151,518 bytes (~148KB) — large for a static HTML file. Likely includes inline CSS/JS.
- **Cache-Control:** `max-age=600` (10 minutes) — relatively short for static assets. Recommend 86400+ for static HTML.
- **Core Web Vitals:** Could not measure directly (no Playwright available), but large HTML payload is a LCP risk.

---

## On-Page SEO (MOST CRITICAL CATEGORY)

This is the single largest gap on the site. Most pages are missing fundamental on-page tags.

### Title Tags

| Page | Title Tag | Assessment |
|------|-----------|------------|
| Homepage (/) | "VA Horizon \| Wholesaling VAs + AI & Automations" | OK — could be more keyword-rich |
| /ai-automations.html | **MISSING** | Critical |
| /crm/ | "Wholesaler CRM \| VA Horizon \| HighLevel Powered" | Good |
| /case-studies/ | **MISSING** | Critical |
| /industries/real-estate/ | **MISSING** | Critical |
| /leadgen/ | "VA Horizon Lead Generator — Commission-Based Real Estate VA Role" | OK |
| /partner/ | "VA Horizon Referral Partner Program — Earn 30% + 10% on VA Placements" | Good |
| /apply/ | Not checked | Unknown |

### Meta Descriptions

| Page | Meta Description | Assessment |
|------|-----------------|------------|
| Homepage (/) | **MISSING** | Critical — homepage has no meta description |
| /ai-automations.html | **MISSING** | Critical |
| /crm/ | **MISSING** | Critical |
| /case-studies/ | **MISSING** | Critical |
| /industries/real-estate/ | **MISSING** | Critical |
| /leadgen/ | **MISSING** | Critical |
| /partner/ | **MISSING** | Critical |

**Every page on this site is missing a meta description.** Google will auto-generate snippets from page content, which reduces CTR control significantly.

### Canonical Tags
- **MISSING on all pages checked.** Without canonicals, if Google finds any URL variations (HTTP vs HTTPS, www vs non-www, trailing slashes), it may create duplicate content issues.

### Open Graph / Social Meta Tags

| Page | OG Tags | Twitter Cards |
|------|---------|---------------|
| Homepage | MISSING | MISSING |
| /ai-automations.html | MISSING | MISSING |
| /crm/ | MISSING | MISSING |
| /case-studies/ | MISSING | MISSING |
| /industries/real-estate/ | Has og:image ONLY (broken relative path) | MISSING |
| /partner/ | MISSING | MISSING |

- **Broken og:image on /industries/real-estate/:** Uses relative path `../../social/va-horizon-og.png` — this is invalid in OG tags, which require absolute URLs. The image will not render when shared on Facebook, LinkedIn, or Twitter.

### Heading Structure

| Page | H1 | Assessment |
|------|----|------------|
| Homepage | "Real Estate VAs That Actually Book Appointments" | Strong, keyword-rich |
| /ai-automations.html | "DOMINATE YOUR MARKET" | Weak — generic, no keyword targeting |
| /crm/ | "The CRM Built for Wholesalers" | Good |
| /case-studies/ | "Case Studies" | Thin — too generic |
| /industries/real-estate/ | "Build a Pipeline Without Living on the Dialer" | OK but low keyword relevance |
| /leadgen/ | "Commission-Based Remote Real Estate Wholesaling Lead Generator..." | Too long, unfocused |
| /partner/ | "Refer wholesalers. Get paid. We handle the rest." | Benefit-focused, OK |

---

## Content Quality (E-E-A-T Assessment)

### Word Count by Page

| Page | Est. Word Count | Assessment |
|------|----------------|------------|
| Homepage | 1,800-2,200 | Good |
| /ai-automations.html | 1,000-1,200 | Moderate |
| /crm/ | 400-450 | THIN |
| /case-studies/ | 550-650 | Thin |
| /industries/real-estate/ | 450-500 | THIN |
| /leadgen/ | 1,200-1,400 | Good |
| /partner/ | 700-800 | Moderate |

Pages under 600 words on competitive B2B topics are considered thin content and will struggle to rank.

### E-E-A-T Signals

**Experience:**
- Real case studies with specific metrics (1 → 4 deals/month, 18% → 92% answer rate) — Strong
- Audio call samples referenced — Good
- "Built by Wholesalers. For Wholesalers." messaging — Good

**Expertise:**
- No author bios or founder credentials
- No industry certifications or affiliations mentioned
- No blog or thought leadership content
- Pricing transparency helps credibility

**Authoritativeness:**
- No backlink profile data available (external audit needed)
- No press mentions, podcast appearances, or industry recognition visible
- No integration partner badges (PropStream, Batch) with verifiable logos

**Trustworthiness:**
- Legal pages exist (Terms, Privacy, Refund Policy) — Good
- Physical contact info (phone, email, hours) — Good
- LLC registration signaled — Good
- No security trust badges (SSL visible but no seals)
- No Google reviews integration or verified review platform

### Competitive Keyword Gaps
The site targets "real estate VAs" and "wholesaling VAs" — these are niche but growing queries. No dedicated blog section means zero long-tail content coverage for:
- "how to hire a cold calling VA for real estate"
- "best CRM for real estate wholesalers"
- "AI voice agent for real estate"
- "HighLevel setup for wholesalers"

---

## Schema / Structured Data

| Page | Schema Types | Status |
|------|-------------|--------|
| Homepage | Organization, WebSite, FAQPage | Good |
| /ai-automations.html | None | Missing |
| /crm/ | None | Missing |
| /case-studies/ | None | Missing |
| /industries/real-estate/ | None | Missing |
| /leadgen/ | JobPosting | Present |
| /partner/ | BreadcrumbList, FAQPage | Good |

### Schema Opportunities Missed
- **Service schema** on each service page (ai-automations, crm)
- **Review/AggregateRating schema** using testimonials from case studies
- **HowTo schema** on the "How It Works" process section
- **VideoObject** if call sample audio clips are embedded
- **BreadcrumbList** on all pages (only on /partner/)

---

## Images

- **Homepage logo:** Alt text "VA Horizon logo" — OK
- **AI Automations page:** Image at `https://i.ibb.co/99QTP0vd/unnamed8.png` — hosted on third-party (imgbb). No descriptive alt text.
- **CRM page:** Screenshots labeled by feature names in surrounding text but alt text status unclear
- **Real Estate page:** og:image using broken relative path
- **Testimonial images:** 5 present, alt text status unknown
- **Integration logos:** Pipedrive, Podio, Airtable — need descriptive alt text

### Key Issues
1. Images hosted on imgbb (third-party CDN) can go offline — host images on your own domain or GitHub repo
2. Broken og:image on real-estate page
3. Generic/missing alt text on several images

---

## AI Search Readiness (GEO)

### Current State
- Organization schema on homepage — helps AI crawlers understand business
- FAQPage schema on homepage and /partner/ — good for featured snippets and AI citations
- No llms.txt file — AI crawlers have no structured guidance
- No robots.txt blocking of AI crawlers (GPTBot, ClaudeBot, PerplexityBot) — accessible

### Citability Assessment
- Case study metrics are highly citable ("18% → 92% answer rate") — these are the kind of specific, verifiable stats AI Overviews and ChatGPT pull
- No long-form content (blog posts, guides) limits topical authority for AI citations
- Testimonials without verified attribution limit trust signal value

### Recommendations
1. Add `llms.txt` at the root (`https://www.vahorizon.site/llms.txt`) with a plain-text summary of services
2. Create at least 4-6 blog posts targeting informational queries in your niche
3. Ensure all quantified results are on-page in structured formats (tables, numbered lists) for AI extraction

---

## Internal Linking

- Homepage links to all major sections via navigation
- Footer contains comprehensive sitelinks — Good
- No internal blog content to create topical clusters
- /apply/ and /industries/real-estate/ appear isolated with limited inbound internal links
- Cross-linking between service pages (CRM → AI Automations → Cold Calling) could be improved

---

## Full Issues Register

| # | Issue | Page(s) | Severity |
|---|-------|---------|----------|
| 1 | Missing meta description | All 12 pages | Critical |
| 2 | Missing title tag | ai-automations, case-studies, real-estate, apply | Critical |
| 3 | Missing canonical tags | All pages | Critical |
| 4 | Missing Open Graph tags | All pages except partial on real-estate | Critical |
| 5 | Broken og:image (relative path) | /industries/real-estate/ | Critical |
| 6 | offline.html in sitemap | sitemap.xml | High |
| 7 | Missing security headers | Site-wide | High |
| 8 | Thin content (<600 words) | /crm/, /case-studies/, /industries/real-estate/ | High |
| 9 | Weak H1 on AI Automations page | /ai-automations.html | High |
| 10 | Missing Schema on service pages | /ai-automations.html, /crm/, /case-studies/ | High |
| 11 | No Twitter Card meta tags | All pages | High |
| 12 | Images hosted on third-party CDN | /ai-automations.html | Medium |
| 13 | Inconsistent URL format (.html vs /) | Site-wide | Medium |
| 14 | No blog/content hub | Site-wide | Medium |
| 15 | No AggregateRating schema from testimonials | Homepage | Medium |
| 16 | No llms.txt | Site root | Medium |
| 17 | Short cache TTL (max-age=600) | Site-wide | Medium |
| 18 | Large homepage HTML (148KB) | Homepage | Medium |
| 19 | Missing BreadcrumbList schema | Most pages | Low |
| 20 | No social media profile links | Site-wide | Low |
| 21 | Copyright year shows 2026 but "Last-Modified" Feb 8, 2026 | Site-wide | Low |
