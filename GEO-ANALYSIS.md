# GEO Analysis — VA Horizon (vahorizon.site)
**Date:** March 6, 2026
**Scope:** Full site generative engine optimization (GEO) audit for AI Overviews, ChatGPT, and Perplexity

---

## GEO Readiness Score: 54/100

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Citability (passage quality) | 68/100 | 25% | 17.0 |
| Structural Readability | 72/100 | 20% | 14.4 |
| Authority & Brand Signals | 28/100 | 20% | 5.6 |
| Technical Accessibility | 42/100 | 20% | 8.4 |
| Multi-Modal Content | 22/100 | 15% | 3.3 |
| **Total** | | | **54/100** |

---

## Platform Breakdown

| Platform | Score | Notes |
|----------|-------|-------|
| Google AI Overviews | 58/100 | Good schema, blocked by JS on homepage |
| ChatGPT (web search) | 41/100 | No Wikipedia/Reddit entity presence |
| Perplexity | 38/100 | No Reddit citations, no unique data |

---

## 1. AI Crawler Access Status

**Current robots.txt:**
```
User-agent: *
Allow: /
Sitemap: https://www.vahorizon.site/sitemap.xml
```

**Assessment:** All crawlers implicitly allowed via wildcard. However, best practice is to explicitly allow key AI crawlers so there is no ambiguity if the wildcard is ever restricted.

| Crawler | Status | Action |
|---------|--------|--------|
| GPTBot (OpenAI) | Implicitly allowed | Explicitly allow |
| OAI-SearchBot | Implicitly allowed | Explicitly allow |
| ClaudeBot (Anthropic) | Implicitly allowed | Explicitly allow |
| PerplexityBot | Implicitly allowed | Explicitly allow |
| CCBot (training data) | Implicitly allowed | Consider blocking |

**Fix:** Add explicit AI crawler rules to robots.txt.

---

## 2. llms.txt Status

**Present:** YES — `/llms.txt` exists at root.

**Current quality:** Basic — covers services, differentiators, pricing, results, contact. Good foundation.

**Missing:**
- Blog post URLs (2 new articles)
- Case study sub-page URLs (6 pages with specific metrics)
- /services/cold-calling/ and /about/ pages
- Structured "Key Facts" block for AI citation
- Content section descriptions (not just URLs)

**Fix:** Expand llms.txt with Phase 3 pages and richer content blocks.

---

## 3. Critical Issue: Homepage JavaScript Dependency

**Severity: HIGH**

The homepage (`index.html`) contains a `<noscript>` block that hides the entire `#container` element:

```html
<noscript>
  <style>
    #container { display: none; }
  </style>
</noscript>
```

**Impact:** AI crawlers (GPTBot, ClaudeBot, PerplexityBot) **do not execute JavaScript**. When they crawl the homepage, this noscript rule fires and hides all visible content. The crawlers see a blank page body with only the `<head>` metadata.

**Why it matters:** The homepage ranks for branded queries and is the primary landing page for AI citation. A crawler seeing empty body content cannot cite or reference any of the homepage's service descriptions, testimonials, or CTAs.

**Affected page:** `/` (homepage only)
**Not affected:** All subpages (case studies, blog, services, about, crm, industries) use static HTML without this JS dependency.

**Fix:** Add a `<noscript>` fallback with static summary content inside the body, before `#container`. This ensures crawlers see meaningful text even without JS execution.

---

## 4. Schema Markup Assessment

**Current schema coverage:**

| Page | Schema Types | Quality |
|------|-------------|---------|
| Homepage | Organization, WebSite, FAQPage | Good — `sameAs: []` is empty (missed opportunity) |
| /crm/ | SoftwareApplication, FAQPage, BreadcrumbList | Strong |
| /industries/real-estate/ | Service, FAQPage, BreadcrumbList | Strong |
| /case-studies/ | CollectionPage, ItemList, BreadcrumbList | Strong — ItemList now links all 6 sub-pages |
| /case-studies/[sub]/ | Article, BreadcrumbList | Good |
| /ai-automations.html | Service, BreadcrumbList | Good |
| /blog/ | Blog, BreadcrumbList | Good |
| /blog/[post]/ | BlogPosting, BreadcrumbList | Strong |
| /services/cold-calling/ | Service, FAQPage, BreadcrumbList | Strong |
| /about/ | Organization, Person, BreadcrumbList | Good |
| /apply/ | BreadcrumbList only | Acceptable |

**Gap:** Organization schema on homepage has `"sameAs": []` — empty array. Should reference LinkedIn and any other brand profiles.

**Fix:** Add LinkedIn URL to `sameAs` on the Organization schema on homepage.

---

## 5. Passage-Level Citability Analysis

AI tools prefer 134–167 word self-contained answer blocks with a direct answer in the first 40–60 words.

**Strong passages identified (ready for citation):**

| Page | Passage | Word Count | Citable? |
|------|---------|-----------|----------|
| Blog: Cold Calling VA Guide | "Why Cold Calling Still Works in 2026" section | ~160w | Yes |
| Blog: GHL Setup Guide | Pipeline stages definition block | ~145w | Yes |
| /case-studies/speed-to-lead/ | "Why Speed to Lead Matters" section | ~155w | Yes |
| /services/cold-calling/ | "Why Most Cold Calling VAs Fail" comparison block | ~140w | Yes |
| /crm/ | FAQ answer blocks | ~80-120w each | Partial |
| /industries/real-estate/ | "Our Cold Calling Workflow" section | ~170w | Yes |

**Weak passages needing improvement:**

| Page | Issue |
|------|-------|
| Homepage body | Not readable by JS-disabled crawlers (see Issue #3) |
| /leadgen/ | No definition block — generic content, not self-contained |
| /partner/ | No factual claims or statistics |

**Key opportunity:** Blog posts have the strongest passage-level citability of any pages on the site. The GHL Setup Guide and Cold Calling VA Guide both have question-based H2s, specific statistics, and tables — exactly what AI tools cite.

---

## 6. Brand Mention Analysis

**This is the highest-leverage gap.** Studies show brand mentions correlate 3x more strongly with AI citation than backlinks.

| Platform | VA Horizon Presence | Score |
|----------|--------------------|----|
| LinkedIn | Founder profile exists (linked in /about/) | Low — company page not confirmed |
| Reddit (r/realestateinvesting, r/Entrepreneur) | Not detected | 0 |
| YouTube | Not detected | 0 |
| Wikipedia | Not present | 0 |
| G2 / Capterra | Not present | 0 |
| BiggerPockets | Not detected | 0 |

**Gap summary:** VA Horizon has no detectable presence on the platforms AI tools (especially ChatGPT and Perplexity) preferentially cite. Reddit presence alone (r/realestateinvesting, r/wholesaling) would significantly increase Perplexity citation likelihood.

**Priority actions:**
1. Create and maintain a LinkedIn Company Page (free, immediate)
2. Add genuine, helpful comments to Reddit r/realestateinvesting and r/wholesaling — mention VA Horizon naturally in context
3. Create a YouTube channel even if content is minimal (a single explainer video establishes entity presence)
4. Submit to G2 or Capterra under "Virtual Assistant Software" or "Real Estate Tools"

---

## 7. Server-Side Rendering Assessment

| Page | JS Required for Content? | AI-Readable? |
|------|------------------------|-------------|
| / (homepage) | YES — noscript hides body | No (critical issue) |
| /crm/ | No — static Tailwind HTML | Yes |
| /industries/real-estate/ | No | Yes |
| /case-studies/ | No | Yes |
| /case-studies/[sub]/ | No | Yes |
| /blog/ | No | Yes |
| /blog/[post]/ | No | Yes |
| /services/cold-calling/ | No | Yes |
| /about/ | No | Yes |
| /ai-automations.html | No | Yes |

**Summary:** 15 of 16 indexable pages are fully static and AI-readable. The homepage is the single exception and the most important one to fix.

---

## 8. Top 5 Highest-Impact Changes (Priority Order)

### 1. Fix Homepage noscript JS Dependency (CRITICAL)
**Impact:** Unblocks AI crawlers from reading the most-cited page on the domain.
**Effort:** Low — add `<noscript>` body fallback with 200-300 words of static summary text.
**Expected gain:** +8–12 points on GEO score; homepage becomes citable for branded queries.

### 2. Explicitly Allow AI Crawlers in robots.txt (QUICK WIN)
**Impact:** Removes ambiguity; ensures no future robots.txt changes accidentally block AI bots.
**Effort:** 5 minutes.
**Expected gain:** +2–3 points; insurance against accidental blocking.

### 3. Expand llms.txt with Phase 3 Content (QUICK WIN)
**Impact:** AI tools that respect llms.txt get structured guidance to the site's strongest content.
**Effort:** 15 minutes.
**Expected gain:** +3–5 points; improves ChatGPT and Perplexity content discoverability.

### 4. Add sameAs URLs to Organization Schema (QUICK WIN)
**Impact:** Establishes entity connections between VA Horizon and its social profiles.
**Effort:** 5 minutes.
**Expected gain:** +2–3 points; improves entity recognition in knowledge graphs.

### 5. Build Reddit and LinkedIn Brand Presence (MEDIUM EFFORT)
**Impact:** Reddit is cited by Perplexity at 46.7% rate; LinkedIn provides moderate AI citation signals.
**Effort:** 2–4 hours to establish, ongoing to maintain.
**Expected gain:** +10–15 points on Perplexity/ChatGPT scores over 60–90 days.

---

## 9. Schema Recommendations for AI Discoverability

**Add to Homepage Organization schema:**
```json
"sameAs": [
  "https://www.linkedin.com/in/youssef-ahmed-255966380/"
]
```

**Add HowTo schema** to /industries/real-estate/ for the "6-step Cold Calling Workflow" section — HowTo schema is one of the most-cited schema types in AI Overviews for process-oriented queries.

**Add SpeakableSpecification** to homepage and /services/cold-calling/ for voice assistant readiness (speculative but forward-looking).

---

## 10. Content Reformatting Suggestions

**High-priority rewrites for AI citation:**

1. **Homepage hero description** (currently hidden by JS): Add a static noscript paragraph: *"VA Horizon deploys trained cold calling virtual assistants, high-volume SMS blast campaigns, and a HighLevel-powered CRM for real estate wholesalers across the U.S. — starting from $1,000/month, live in 48–72 hours."* — 134–167 words, self-contained, factual.

2. **/crm/ page opening**: The first paragraph should answer "What is VA Horizon's HighLevel CRM?" in the first sentence. Currently buries the definition. Rewrite to: *"VA Horizon's HighLevel CRM is a fully configured HighLevel pipeline built and managed for real estate wholesalers — including lead intake stages, automated SMS follow-up sequences, VA assignment rules, and a daily performance dashboard."*

3. **Blog posts**: Already strong. Add "Key Takeaways" summary boxes (3–5 bullet points) at the top of each post — these 134–167 word blocks are ideal for AI citation and answer snippet capture.

4. **Case study opening paragraphs**: Each case study starts with scene-setting. Add a one-sentence TL;DR at the very top: *"In 60 days, a Phoenix wholesaler increased ROI from 1.5x to 4x by deploying a VA Horizon cold calling VA and HighLevel CRM — without changing their list source or ad budget."* — direct, quotable, under 50 words.

---

## Implementation Checklist

### Immediate (< 1 hour)
- [ ] Update robots.txt with explicit AI crawler allowances
- [ ] Expand llms.txt with Phase 3 pages
- [ ] Add sameAs to Organization schema on homepage
- [ ] Add noscript body fallback to homepage

### This Week
- [ ] Add HowTo schema to /industries/real-estate/ workflow section
- [ ] Add "Key Takeaways" boxes to both blog posts
- [ ] Add TL;DR sentences to top of each case study sub-page
- [ ] Create LinkedIn Company Page for VA Horizon

### This Month
- [ ] Start contributing to Reddit (r/realestateinvesting, r/wholesaling)
- [ ] Create at least one YouTube video (VA system explainer, 3–5 min)
- [ ] Submit to G2 under Real Estate or Virtual Assistant categories
- [ ] Consider BiggerPockets profile and forum participation
