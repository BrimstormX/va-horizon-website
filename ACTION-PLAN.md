# VA Horizon SEO Action Plan
**Site:** https://www.vahorizon.site
**Generated:** March 5, 2026

---

## CRITICAL — Fix Immediately (This Week)

### 1. Add Meta Descriptions to All Pages
Every page is missing a meta description. These control your Google search snippet and directly affect CTR.

**Suggested meta descriptions:**

| Page | Meta Description |
|------|-----------------|
| Homepage | "VA Horizon provides trained cold calling VAs and AI automations for real estate wholesalers. 48-hour deployment, 5-day replacement guarantee. Book a call today." |
| /ai-automations.html | "Automate your wholesale pipeline with Lena AI — intelligent voice agents, SMS campaigns, and real-time campaign analytics built for real estate." |
| /crm/ | "VA Horizon's HighLevel-powered CRM is built for wholesalers — lead management, AI inbox, pipeline tracking, and buyer dispositions in one system." |
| /case-studies/ | "See how real estate wholesalers scaled from 1 to 4 deals/month, cut dispo time from 21 to 6 days, and boosted answer rates from 18% to 92% with VA Horizon." |
| /industries/real-estate/ | "Real estate wholesalers use VA Horizon to handle cold calling, list pulling, and CRM management — so you can focus on closing deals." |
| /partner/ | "Earn 30% in month one plus 10% recurring when you refer wholesalers to VA Horizon. Join the referral partner program." |

**How to add (static HTML):** In the `<head>` of each file, add:
```html
<meta name="description" content="YOUR DESCRIPTION HERE">
```

---

### 2. Add Title Tags to Missing Pages

Add `<title>` tags to the following pages:

| Page | Suggested Title |
|------|----------------|
| /ai-automations.html | "AI Voice & SMS Automations for Wholesalers \| VA Horizon" |
| /case-studies/ | "Real Estate Wholesaling VA Case Studies \| VA Horizon Results" |
| /industries/real-estate/ | "Real Estate Wholesaling VAs — Cold Calling & CRM \| VA Horizon" |
| /apply/ | "Apply for VA Horizon Services \| Real Estate Wholesale VAs" |

---

### 3. Add Canonical Tags to All Pages

In the `<head>` of every page, add the self-referencing canonical:

```html
<!-- On the homepage -->
<link rel="canonical" href="https://www.vahorizon.site/">

<!-- On /crm/ -->
<link rel="canonical" href="https://www.vahorizon.site/crm/">

<!-- On /ai-automations.html -->
<link rel="canonical" href="https://www.vahorizon.site/ai-automations.html">
```
(Use the exact URL as it appears in the sitemap for each page)

---

### 4. Fix Broken og:image on Real Estate Page

**File:** `/industries/real-estate/index.html`
**Current (broken):** `<meta property="og:image" content="../../social/va-horizon-og.png">`
**Fix — use absolute URL:**
```html
<meta property="og:image" content="https://www.vahorizon.site/social/va-horizon-og.png">
```

---

### 5. Add Open Graph + Twitter Card Tags to All Pages

Add to every page `<head>`:

```html
<!-- Open Graph (Facebook, LinkedIn, WhatsApp) -->
<meta property="og:title" content="PAGE TITLE HERE">
<meta property="og:description" content="META DESCRIPTION HERE">
<meta property="og:url" content="FULL PAGE URL HERE">
<meta property="og:type" content="website">
<meta property="og:image" content="https://www.vahorizon.site/social/va-horizon-og.png">
<meta property="og:site_name" content="VA Horizon">

<!-- Twitter/X Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="PAGE TITLE HERE">
<meta name="twitter:description" content="META DESCRIPTION HERE">
<meta name="twitter:image" content="https://www.vahorizon.site/social/va-horizon-og.png">
```

Make sure `va-horizon-og.png` exists at that path, is at least 1200x630px, and is under 8MB.

---

### 6. Remove offline.html from Sitemap

Edit `sitemap.xml` and delete the entry for `https://www.vahorizon.site/offline.html`. This page should never be indexed by Google.

---

## HIGH — Fix Within 1 Week

### 7. Add Security Headers via Cloudflare

Since the site runs on GitHub Pages, you cannot add server-side response headers directly. The fastest solution is to put Cloudflare in front (free plan works):

1. Move DNS to Cloudflare (free)
2. Add a Cloudflare Transform Rule to inject headers:

```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

Alternatively, add a `_headers` file if you migrate to Netlify or Vercel.

---

### 8. Expand Thin Content Pages

The following pages have fewer than 600 words and will struggle to rank:

**Priority order:**

**a) /crm/ (400-450 words → target 900+)**
Add sections:
- "Why wholesalers abandon generic CRMs" (problem section)
- Detailed feature breakdown with screenshots + explanations
- "How to set it up in 48 hours" walkthrough
- FAQ (3-5 questions specific to CRM setup for wholesalers)

**b) /industries/real-estate/ (450-500 words → target 1,000+)**
This should be your best-optimized page for "real estate VA" queries. Add:
- Deeper explanation of the cold calling workflow
- Before/after scenario for a typical wholesaler
- Integration details (PropStream, Batch, Pipedrive connections)
- Statistics and data points about VA ROI in wholesale

**c) /case-studies/ (550-650 words → target 1,200+)**
Expand each of the 6 case study cards into dedicated sub-pages or accordions with:
- Full narrative (challenge, solution, outcome)
- Client quote (even anonymized is fine)
- Timeline
- Specific metrics

---

### 9. Fix H1 on AI Automations Page

**Current H1:** "DOMINATE YOUR MARKET" — Generic, keyword-less, unhelpful for SEO
**Recommended H1:** "AI Voice & SMS Automations for Real Estate Wholesalers"
**File:** `ai-automations.html`

---

### 10. Add Schema to Service Pages

**For /ai-automations.html:**
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "AI Voice & SMS Automations for Wholesalers",
  "provider": {
    "@type": "Organization",
    "name": "VA Horizon"
  },
  "description": "AI-powered voice agents and SMS campaign automation for real estate wholesalers.",
  "serviceType": "AI Automation",
  "areaServed": "US"
}
```

**For /crm/:**
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "VA Horizon Wholesaler CRM",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Included with VA Horizon service plans"
  }
}
```

**For /case-studies/ — add AggregateRating to Organization schema on homepage:**
```json
{
  "@type": "Organization",
  "name": "VA Horizon",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "6",
    "reviewCount": "6"
  }
}
```
(Only use if you can verify these ratings)

---

## MEDIUM — Fix Within 1 Month

### 11. Host Images on Your Own Domain

The Lena AI image on the ai-automations page is hosted on imgbb (`i.ibb.co`). If that service goes down or removes the image, it breaks. Move all images into a `/assets/images/` folder in your GitHub repo.

### 12. Start a Blog / Resource Section

Target 4-6 articles to capture long-tail search traffic:

**Recommended first articles (ranked by search opportunity):**
1. "How to Hire a Cold Calling VA for Real Estate Wholesaling" — targets informational intent buyers
2. "HighLevel CRM Setup Guide for Real Estate Wholesalers" — targets your CRM page keywords
3. "AI Voice Agents for Real Estate: What Wholesalers Need to Know" — targets ai-automations
4. "How Many Cold Calls Does It Take to Close a Wholesale Deal?" — data-driven, highly linkable
5. "Real Estate VA vs. In-House Assistant: Cost Comparison" — comparison query

### 13. Standardize URL Format

Choose one format and stick to it:
- **Recommended:** Directory-style with trailing slashes (`/crm/`, `/ai-automations/`)
- Create 301 redirects from `/ai-automations.html` → `/ai-automations/`
- Update sitemap, internal links, and canonical tags after redirect

### 14. Add llms.txt for AI Search Engines

Create `https://www.vahorizon.site/llms.txt`:

```
# VA Horizon

VA Horizon provides trained virtual assistants and AI automations for U.S. real estate wholesalers.

## Services
- Cold calling VAs (accent-neutral, script-trained)
- AI voice agent (Lena) for autonomous outbound/inbound
- HighLevel CRM buildout and management
- List pulling and skip tracing
- Buyer disposition and follow-up VAs

## Pricing
Starting at $1,000/month per VA, with setup fees.

## Contact
Email: youssef@vahorizon.site
Phone: +1 (512) 580-5821
Hours: Mon-Fri 9am-6pm CST

## More Information
Full site: https://www.vahorizon.site
```

### 15. Increase Cache TTL

In GitHub Pages, you cannot directly control Cache-Control. With Cloudflare (see item 7), set:
- HTML files: `max-age=3600` (1 hour)
- CSS/JS/Images: `max-age=31536000` (1 year, with versioned filenames)

---

## LOW — Backlog

### 16. Add BreadcrumbList Schema to All Pages

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.vahorizon.site/"},
    {"@type": "ListItem", "position": 2, "name": "CRM", "item": "https://www.vahorizon.site/crm/"}
  ]
}
```

### 17. Add Social Media Profiles

Add links to LinkedIn, Twitter/X, YouTube (if applicable) in both the footer and the Organization schema:

```json
"sameAs": [
  "https://www.linkedin.com/company/vahorizon",
  "https://twitter.com/vahorizon"
]
```

### 18. Add HowTo Schema to the "How It Works" Section

The 3-step process (Audit → Launch → Scale) is a perfect candidate for HowTo schema, which can earn a rich result in Google.

### 19. Audit Internal Linking

Manually add contextual internal links:
- From Homepage → /crm/ and /ai-automations.html within body copy
- From /ai-automations.html → /crm/ (natural cross-sell)
- From /case-studies/ → relevant service pages based on each case study

---

## Estimated Impact by Category

| Fix Category | Est. Time | Est. Ranking Impact |
|-------------|-----------|-------------------|
| Meta descriptions + title tags | 2-3 hours | Medium (CTR improvement) |
| Canonical + OG tags | 1-2 hours | Medium (duplicate content prevention) |
| Fix broken og:image | 15 min | Low-Medium (social sharing) |
| Remove offline.html from sitemap | 5 min | Low |
| Security headers via Cloudflare | 1-2 hours | Low (trust signal) |
| Expand thin content pages | 4-8 hours | High (organic ranking) |
| Fix H1s | 30 min | Medium |
| Add schema to service pages | 1-2 hours | Medium (rich results) |
| Start blog (4-6 articles) | Weeks | High (long-term) |
| llms.txt | 15 min | Low-Medium (AI search) |
