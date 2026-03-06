# VA Horizon — Site Structure & URL Architecture
**Generated:** March 2026
**Current Pages:** 12
**Target Pages (12 months):** 50+

---

## Current vs. Target Architecture

### Current Structure (March 2026)
```
vahorizon.site/
├── / (homepage)
├── /ai-automations.html          ← .html extension (inconsistent)
├── /crm/
├── /case-studies/
├── /industries/
│   └── /real-estate/
├── /leadgen/
├── /partner/
├── /apply/
├── /privacy.html                 ← .html extension (inconsistent)
├── /terms.html                   ← .html extension (inconsistent)
├── /refund-policy.html           ← .html extension (inconsistent)
└── /offline.html                 ← Should be removed from sitemap
```

**Issues:**
- Mixed URL formats (.html vs. directory/)
- No /services/ hub
- No /about/ section
- No /blog/
- No /vs/ comparison pages

---

### Target Structure (12 Months)
```
vahorizon.site/
│
├── / (homepage)
│
├── /services/
│   ├── /cold-calling/            ← NEW (Phase 3)
│   ├── /ai-automations/          ← RENAME from ai-automations.html (Phase 3)
│   ├── /crm/                     ← MOVE from /crm/ (Phase 3, lower priority)
│   ├── /list-pulling/            ← NEW (Phase 3)
│   └── /disposition/             ← NEW (Phase 3)
│
├── /industries/
│   └── /real-estate/             ← Expand content (Phase 2)
│   (future: /multifamily/, /brrr/, etc.)
│
├── /case-studies/                ← Expand index (Phase 2)
│   ├── /answer-rate-improvement/ ← NEW sub-page (Phase 3)
│   ├── /deals-per-month-scale/   ← NEW sub-page (Phase 3)
│   ├── /dispo-time-reduction/    ← NEW sub-page (Phase 3)
│   └── /[3 more case studies]/   ← NEW sub-pages (Phase 3)
│
├── /blog/                        ← NEW hub (Phase 2)
│   ├── /how-to-hire-cold-calling-va-real-estate-wholesaling/
│   ├── /highlevel-crm-setup-guide-real-estate-wholesalers/
│   ├── /ai-voice-agents-real-estate-wholesaling/
│   ├── /real-estate-va-vs-in-house-assistant-cost/
│   ├── /how-many-cold-calls-to-close-wholesale-deal/
│   ├── /propstream-vs-batch-leads-wholesalers/
│   └── /[12+ more posts]/
│
├── /vs/                          ← NEW (Phase 4)
│   ├── /myoutdesk/
│   ├── /reva-global/
│   └── /in-house-va/
│
├── /about/                       ← NEW (Phase 3)
│   └── /team/                    ← Optional
│
├── /partner/                     ← Existing (no change)
├── /apply/                       ← Existing (no change)
├── /leadgen/                     ← Consider noindex or move
│
├── /privacy/                     ← RENAME from privacy.html (Phase 3)
├── /terms/                       ← RENAME from terms.html (Phase 3)
├── /refund-policy/               ← RENAME from refund-policy.html (Phase 3)
│
└── llms.txt                      ← NEW (Phase 1, Week 3)
```

---

## URL Standardization Plan

### Step 1 — Identify inconsistent URLs
Current `.html` pages that need to become directory-style:

| Current URL | Target URL | Redirect Type |
|-------------|-----------|---------------|
| /ai-automations.html | /ai-automations/ | 301 |
| /privacy.html | /privacy/ | 301 |
| /terms.html | /terms/ | 301 |
| /refund-policy.html | /refund-policy/ | 301 |

### Step 2 — Implementation Method (GitHub Pages)

GitHub Pages does not natively support 301 redirects via config. Options:

**Option A: HTML redirect files (simplest)**
Create a `/ai-automations/index.html` that contains:
```html
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0; url=/ai-automations/">
  <link rel="canonical" href="https://www.vahorizon.site/ai-automations/">
</head>
</html>
```
Not ideal for SEO (meta refresh vs. 301) but workable for low-traffic pages.

**Option B: Cloudflare Redirect Rules (recommended if on Cloudflare)**
Create URL redirects in Cloudflare dashboard:
- `vahorizon.site/ai-automations.html` → `https://www.vahorizon.site/ai-automations/` (301)

**Option C: Migrate to Netlify/Vercel**
Supports `_redirects` file and native 301s. If considering migration:
```
/ai-automations.html  /ai-automations/  301
/privacy.html         /privacy/         301
/terms.html           /terms/           301
/refund-policy.html   /refund-policy/   301
```

### Step 3 — After redirects are live
- [ ] Update all internal links site-wide to use new URL
- [ ] Update sitemap.xml with new URLs
- [ ] Update canonical tags
- [ ] Update OG url tags
- [ ] Submit new sitemap to GSC and request re-crawl

---

## Internal Linking Architecture

### Link Flow Diagram
```
Homepage
├── → /services/cold-calling/
├── → /ai-automations/
├── → /crm/
├── → /case-studies/ (and individual case study pages)
├── → /industries/real-estate/
├── → /apply/
└── → /partner/

/services/cold-calling/
├── → /crm/ (cross-sell)
├── → /ai-automations/ (cross-sell)
├── → /case-studies/ (proof)
└── → /apply/ (CTA)

/ai-automations/
├── → /crm/ (cross-sell — Lena + HighLevel)
├── → /case-studies/ (proof)
└── → /apply/ (CTA)

/crm/
├── → /ai-automations/ (cross-sell)
├── → /services/cold-calling/ (cross-sell)
└── → /apply/ (CTA)

/case-studies/
├── → Individual case study pages
├── → Relevant service page per case study
└── → /apply/ (CTA)

/blog/ posts
├── → Relevant service page (mandatory — 1 per post)
├── → /case-studies/ (proof links)
└── → /apply/ or /partner/ (CTA)
```

### Link Equity Priority
High-priority pages that should receive the most internal links:
1. Homepage (already high)
2. /apply/ (conversion page — link from every service page and blog post)
3. /services/cold-calling/ (highest commercial intent)
4. /industries/real-estate/ (most specific landing page for target buyer)

---

## Page Type Templates

### Service Page (min 900 words)
```
<head>
  <title>[Service] for Real Estate Wholesalers | VA Horizon</title>
  <meta name="description" content="[150-160 char description with keyword]">
  <link rel="canonical" href="https://www.vahorizon.site/[service]/">
  <!-- OG + Twitter Cards -->
  <!-- Service schema JSON-LD -->
  <!-- BreadcrumbList JSON-LD -->
</head>

Structure:
- H1: [Keyword-rich service name]
- Problem section (why wholesalers need this)
- How it works (VA Horizon's process)
- Feature breakdown
- Metrics / results teaser (link to case studies)
- FAQ section (FAQPage schema)
- CTA: Book a call / Apply
```

### Blog Post (min 1,400 words)
```
<head>
  <title>[Post Title] | VA Horizon</title>
  <meta name="description" content="[150-160 char]">
  <link rel="canonical" href="https://www.vahorizon.site/blog/[slug]/">
  <!-- OG + Twitter Cards -->
  <!-- BlogPosting JSON-LD -->
  <!-- BreadcrumbList JSON-LD -->
</head>

Structure:
- H1: [Exact target keyword phrase or close variant]
- Intro (problem + what article covers)
- Body with H2/H3 subheadings
- Tables, lists, stats in structured format
- Internal link to service page (contextual, natural)
- FAQ section (optional, adds FAQPage schema opportunity)
- CTA at bottom (book a call or apply)
- Author bio with photo
```

### Case Study Page (min 1,000 words)
```
Structure:
- H1: [Client Profile] — [Key Metric Achieved]
- Executive Summary (100 words, with key metric highlighted)
- Client Background (anonymous is fine)
- The Challenge
- VA Horizon's Solution
- Implementation Process
- Results (table: Before vs. After)
- Client Quote / Testimonial
- Related Services
- CTA
```

---

## Sitemap Strategy

### Current Sitemap (12 URLs)
All dated January 30, 2026. Remove offline.html immediately.

### Target Sitemap (12 months)
After full buildout, sitemap should include 50+ URLs:
- All service pages
- All industry pages
- All case study pages
- All blog posts
- /about/, /partner/, /apply/, /leadgen/
- Legal pages

**Exclude from sitemap:**
- /offline.html
- /leadgen/ (if noindexed)
- Thank-you pages or form confirmation pages
- Any duplicate/redirect URLs

### Sitemap Update Process
Each time a new page is added:
1. Add URL to sitemap.xml with correct `<lastmod>` date and `<priority>`
2. Submit sitemap to GSC
3. Request indexing of new URL via GSC URL Inspection

---

## Priority / Lastmod Values (sitemap.xml)

| Page Type | Priority | Change Frequency |
|-----------|----------|-----------------|
| Homepage | 1.0 | monthly |
| Service pages | 0.9 | monthly |
| Industry pages | 0.8 | monthly |
| Case studies | 0.8 | yearly |
| Blog posts | 0.7 | yearly |
| About/Partner | 0.6 | yearly |
| Legal pages | 0.3 | yearly |
