# VA Horizon — SEO Implementation Roadmap
**Generated:** March 2026
**Duration:** 12 months (March 2026 – February 2027)
**Based On:** Full Site Audit (52/100) + SEO Strategy

---

## Phase Overview

| Phase | Timeline | Focus | Expected Score Lift |
|-------|----------|-------|-------------------|
| 1 — Foundation | Weeks 1-4 (Mar 2026) | Fix all critical technical + on-page issues | 52 → 70 |
| 2 — Content | Weeks 5-12 (Apr-May 2026) | Expand thin pages, launch blog, publish first 4 posts | 70 → 76 |
| 3 — Scale | Weeks 13-24 (Jun-Sep 2026) | Blog cadence, case study pages, link building | 76 → 83 |
| 4 — Authority | Months 7-12 (Oct 2026-Feb 2027) | Comparison pages, PR, original research, GEO | 83 → 90+ |

---

## Phase 1 — Foundation (Weeks 1-4)

**Goal:** Eliminate all Critical and most High-severity audit issues. Get the technical floor right before creating more content.

### Week 1 — On-Page Metadata (Highest ROI, Lowest Effort)

**Day 1-2:**
- [ ] Add `<meta name="description">` to all 12 pages (see ACTION-PLAN.md for exact copy)
- [ ] Add missing `<title>` tags to: ai-automations.html, case-studies/, industries/real-estate/, apply/
- [ ] Add `<link rel="canonical">` to all pages (self-referencing absolute URLs)

**Day 3-4:**
- [ ] Add Open Graph tags to all pages (og:title, og:description, og:url, og:type, og:image, og:site_name)
- [ ] Add Twitter Card tags to all pages (twitter:card, twitter:title, twitter:description, twitter:image)
- [ ] Fix broken og:image on /industries/real-estate/ — change from relative to absolute URL

**Day 5:**
- [ ] Fix H1 on ai-automations.html — change "DOMINATE YOUR MARKET" to "AI Voice & SMS Automations for Real Estate Wholesalers"
- [ ] Remove offline.html from sitemap.xml
- [ ] Verify sitemap at https://www.vahorizon.site/sitemap.xml

**Verification:**
- Run each page through https://www.opengraph.xyz/ to check OG tags
- Validate sitemap in Google Search Console

---

### Week 2 — Schema + Security

**Day 1-2: Add schema to service pages**
- [ ] Add `Service` schema to /ai-automations.html (see ACTION-PLAN.md for JSON-LD)
- [ ] Add `SoftwareApplication` + `Service` schema to /crm/
- [ ] Add `BreadcrumbList` schema to all pages
- [ ] Upgrade homepage Organization schema to `ProfessionalService`

**Day 3-4: Cloudflare setup**
- [ ] Move DNS to Cloudflare (free plan)
- [ ] Enable Cloudflare proxy for www.vahorizon.site
- [ ] Add Transform Rule to inject security headers:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: SAMEORIGIN
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy: geolocation=(), microphone=()
  - Strict-Transport-Security: max-age=31536000; includeSubDomains
- [ ] Set Cache-Control rules: HTML = 1 hour, CSS/JS/images = 1 year

**Day 5:**
- [ ] Validate all schema with Google's Rich Results Test
- [ ] Check headers at https://securityheaders.com/

---

### Week 3 — Images + Technical Cleanup

- [ ] Download image from imgbb (i.ibb.co/99QTP0vd/unnamed8.png) and host in /assets/images/
- [ ] Update ai-automations.html src to point to self-hosted path
- [ ] Audit all image alt text across site — add descriptive alt text where missing
- [ ] Create /social/va-horizon-og.png if it doesn't exist (1200x630px, brand OG image)
- [ ] Add `llms.txt` to site root (see ACTION-PLAN.md for content)

---

### Week 4 — Analytics + Tracking Setup

- [ ] Verify Google Search Console ownership (or set up if missing)
- [ ] Submit sitemap in GSC
- [ ] Confirm GA4 is installed and firing correctly
- [ ] Set up GA4 conversion events: form_submit, click_to_call, apply_click
- [ ] Set up weekly rank tracking in Ahrefs/Semrush for 20 target keywords
- [ ] Baseline screenshot: record current GSC impressions, clicks, avg position

**Phase 1 Success Criteria:**
- All pages have title tag, meta description, canonical, OG tags
- Zero Critical issues in next crawl audit
- Security headers score B+ or above at securityheaders.com
- GSC showing all pages indexed (except offline.html)
- Schema validating with no errors in Rich Results Test

---

## Phase 2 — Content Expansion (Weeks 5-12)

**Goal:** Fix thin content pages, launch blog, publish first 4 posts, build topical relevance.

### Week 5-6 — Expand /crm/ Page

Target: 400 words → 900+ words

**Add sections:**
- [ ] "Why wholesalers abandon generic CRMs" (problem setup, ~150 words)
- [ ] Feature breakdown: AI inbox, pipeline stages, automation triggers, buyer dispo (300 words + screenshots)
- [ ] "How to set it up in 48 hours" — 3-step process box
- [ ] FAQ section: 4-5 questions with answers
- [ ] Internal links to /ai-automations/ and homepage
- [ ] Add FAQPage schema to the new FAQ section

---

### Week 5-6 — Expand /industries/real-estate/ Page

Target: 450 words → 1,000+ words

**Add sections:**
- [ ] "The cold calling workflow" — step-by-step with VA Horizon process (200 words)
- [ ] "Before vs. After" scenario for a typical wholesaler (table format)
- [ ] Integration callouts: PropStream, Batch, Pipedrive, HighLevel — how VAs use each
- [ ] ROI statistics: cost of VA vs. cost of missed deals
- [ ] Internal links to /crm/, /case-studies/, /apply/

---

### Week 7-8 — Expand /case-studies/ + Blog Setup

**Case Studies:**
- [ ] Expand each of the 6 case study cards into accordion/expandable sections with:
  - Full narrative (challenge → solution → outcome)
  - Timeline
  - Specific metrics in table format
  - Client quote (even anonymized)

**Blog Setup:**
- [ ] Create /blog/ directory with index page listing all posts
- [ ] Design blog post template with: author bio, date, schema, OG, CTA
- [ ] Add /blog/ to main navigation
- [ ] Add /blog/ to sitemap.xml
- [ ] Write founder author bio (used as byline on all posts)

---

### Week 9-10 — Blog Posts 1 & 2

- [ ] Write + publish: "How to Hire a Cold Calling VA for Real Estate Wholesaling"
- [ ] Write + publish: "HighLevel CRM Setup Guide for Real Estate Wholesalers"
- [ ] Submit new URLs to GSC via URL Inspection tool
- [ ] Share posts in 2-3 wholesaling Facebook groups

---

### Week 11-12 — Blog Posts 3 & 4 + /ai-automations/ Expansion

**Blog:**
- [ ] Write + publish: "AI Voice Agents for Real Estate Wholesaling"
- [ ] Write + publish: "Real Estate VA vs. In-House Assistant: Cost Comparison"

**AI Automations page expansion:**
- [ ] Fix H1 (already done in Phase 1)
- [ ] Expand to 1,500+ words with Lena use-case breakdown + FAQ
- [ ] Add Service schema
- [ ] Add FAQPage schema

**Phase 2 Success Criteria:**
- /crm/, /industries/real-estate/, /ai-automations/ all at 900+ words
- Blog live with 4 published posts, all indexed in GSC
- No thin content pages (<600 words) remaining
- First keyword movements visible in rank tracker

---

## Phase 3 — Scale (Weeks 13-24 / June – September 2026)

**Goal:** Maintain blog cadence (2/month), build case study sub-pages, start link building.

### Ongoing — Monthly Blog Posts (2/month)

Follow CONTENT-CALENDAR.md schedule. Each post must pass pre-publish checklist:
- [ ] Title tag and meta desc written
- [ ] Keyword in H1 and intro paragraph
- [ ] Internal link to at least one service page
- [ ] BlogPosting schema
- [ ] OG tags set
- [ ] CTA at bottom
- [ ] Added to sitemap and submitted to GSC

---

### Month 4 (June) — Individual Case Study Pages

- [ ] Create /case-studies/answer-rate-improvement/ (1,000+ words, Article schema)
- [ ] Create /case-studies/deals-per-month-scale/ (1,000+ words)
- [ ] Add ItemList schema to /case-studies/ index page linking to sub-pages
- [ ] Internal link from homepage "Case Studies" section to individual pages

---

### Month 5 (July) — Link Building Outreach Begin

**Tier 1 — Quick Wins:**
- [ ] Submit to HighLevel partner/agency directory
- [ ] Create Clutch.co profile and request 3 client reviews
- [ ] Create G2 profile for CRM product
- [ ] Add consistent NAP (Name, Address, Phone) to: Google Business, Bing Places, Apple Maps

**Tier 2 — Outreach:**
- [ ] Pitch guest post to BiggerPockets (topic: AI + VA in wholesaling)
- [ ] Contact PropStream about integration partner page/mention
- [ ] Contact BatchLeads about integration partner mention
- [ ] Identify 3 RE podcasts and pitch founder as guest

---

### Month 6 (August) — Remaining Case Study Pages + URL Standardization

- [ ] Create remaining 3-4 case study sub-pages
- [ ] Plan URL standardization: /ai-automations/ → /ai-automations/ (already a directory? confirm)
  - If ai-automations.html exists as a file, create directory version and 301 redirect
  - Update all internal links and sitemap
- [ ] Add /services/ hub page if not exists (links to all service sub-pages)

---

### Month 7 (September) — Services Architecture Expansion

- [ ] Create /services/cold-calling/ page (new, 1,000+ words)
- [ ] Create /services/list-pulling/ page (new, 800+ words)
- [ ] Create /services/disposition/ page (new, 800+ words)
- [ ] Create /about/ page with founder bio (if not exists)
- [ ] Add Person schema to founder page/bio with sameAs LinkedIn

**Phase 3 Success Criteria:**
- 10+ blog posts live, 2+ ranking in top 20 for target keywords
- 5+ backlinks from relevant domains (HighLevel, Clutch, PropStream, etc.)
- Case study sub-pages indexed and ranking for case study queries
- Organic traffic trending upward in GSC (target 200+ sessions/month)

---

## Phase 4 — Authority (Months 7-12 / October 2026 – February 2027)

**Goal:** Build domain authority, establish thought leadership, capture comparison traffic, optimize for AI search.

### Month 8 (October) — Comparison Pages

- [ ] Create /vs/myoutdesk/ — VA Horizon vs MyOutDesk (1,200+ words)
- [ ] Create /vs/in-house-va/ — VA Horizon vs hiring directly (1,000+ words)
- [ ] Add to sitemap and internal linking

---

### Month 9 (November) — Original Research

- [ ] Plan and publish "State of Real Estate VA Hiring: 2026 Report"
  - Survey 20-30 current/past clients
  - Compile metrics: cost, ROI, deal velocity improvement
  - Publish as long-form page + PDF download
  - Use for PR outreach and link building

---

### Month 10 (December) — GEO Optimization Pass

- [ ] Audit all pages for AI-extractable content (tables, lists, quotable stats)
- [ ] Ensure all quantified case study results are in structured formats
- [ ] Add FAQPage schema to all service pages
- [ ] Monitor VA Horizon mention in ChatGPT, Perplexity, Google AI Overviews
- [ ] Update llms.txt with any new services or pricing

---

### Month 11-12 (January-February 2027) — Authority Consolidation

- [ ] Review all 12-month keyword rankings vs. baseline
- [ ] Identify top-performing content and build additional internal links to it
- [ ] Refresh any blog posts older than 6 months with updated data
- [ ] Plan Year 2 SEO strategy based on GSC + ranking data
- [ ] Conduct fresh crawl audit and fix new issues

**Phase 4 Success Criteria:**
- Organic sessions: 1,000+ /month
- 5+ keywords ranking in top 10
- Domain Authority (Ahrefs DR): 15+
- Original research piece earning backlinks
- Brand mentioned in at least 2 AI search results for relevant queries

---

## Resource Requirements

| Phase | Estimated Hours | Skills Needed |
|-------|----------------|--------------|
| Phase 1 — Foundation | 12-18 hours | HTML editing, DNS/Cloudflare setup |
| Phase 2 — Content | 20-30 hours | Copywriting, HTML, schema |
| Phase 3 — Scale | 30-40 hours | Copywriting, outreach, HTML |
| Phase 4 — Authority | 20-30 hours | Copywriting, PR, data analysis |
| **Total Year 1** | **~90-120 hours** | |

---

## Weekly Maintenance Checklist (Ongoing)

- [ ] Check GSC for new crawl errors
- [ ] Review rank tracker for significant movement (+/- 5 positions)
- [ ] Respond to any new reviews (Clutch, G2)
- [ ] One outreach email per week (links/partnerships)
- [ ] Track 1-2 competitor content pieces published

---

## Milestone Summary

| Date | Milestone |
|------|-----------|
| Mar 2026 | All critical on-page issues fixed, Cloudflare live |
| Apr 2026 | Blog live, first 2 posts published |
| May 2026 | All thin pages expanded, 4 blog posts live |
| Jun 2026 | Case study sub-pages live, 6 blog posts live |
| Jul 2026 | Link building started, HighLevel directory listed |
| Sep 2026 | 10+ blog posts, 5+ backlinks, organic traffic 200+/mo |
| Nov 2026 | Original research published, comparison pages live |
| Feb 2027 | Full 12-month review, organic traffic 1,000+/mo target |
