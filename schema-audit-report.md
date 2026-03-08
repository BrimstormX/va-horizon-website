# VA Horizon — Schema Markup Audit Report
**Audit Date:** 2026-03-09
**Base URL:** https://www.vahorizon.site
**Pages Audited:** 11
**Auditor:** Claude Code (Schema.org Specialist)

---

## Executive Summary

| Severity | Count |
|---|---|
| CRITICAL | 3 |
| HIGH | 8 |
| MEDIUM | 6 |
| LOW | 4 |

Overall the schema foundation is solid for a site of this age. The @context and URL hygiene are correct across all pages. The most urgent issues are a deprecated HowTo block on the real-estate page, missing `author` Person nodes on blog posts, and missing Article-level schema on case study pages that only have a generic Article type without a `name`/`@id` to make them individually identifiable.

---

## Page-by-Page Findings

---

### PAGE 1 — index.html (Homepage)
**URL:** https://www.vahorizon.site/
**Schema blocks found:** Organization, WebSite, FAQPage (3 separate script tags)

#### Validation Results

| Block | Status | Notes |
|---|---|---|
| Organization | PASS with warnings | Valid. Has contactPoint, telephone, email, sameAs, areaServed. Missing: `@id`, `logo` is duplicated as both `logo` and `image` with the same value. `serviceType` is a scalar string but the Organization has multiple services — should be an array or replaced with hasOfferCatalog. |
| WebSite | FAIL | Present but critically bare. Only `name` and `url`. Missing `SearchAction` (strongly recommended for sitelinks search box eligibility). Missing `@id`. |
| FAQPage | CRITICAL FAIL | VA Horizon is not a government or healthcare authority site. FAQPage rich results were restricted to government and health authority sites only in August 2023. This schema will not generate a rich result and may be flagged during manual review. It should be removed or replaced with a standard WebPage schema. |

#### Missing Opportunities
- No `BreadcrumbList` on the homepage (not required but recommended).
- No `Service` schema describing the core cold calling VA service.
- The WebSite block should include a `potentialAction` SearchAction.

---

### PAGE 2 — blog/index.html (Blog Index)
**URL:** https://www.vahorizon.site/blog/
**Schema blocks found:** Blog, BreadcrumbList

#### Validation Results

| Block | Status | Notes |
|---|---|---|
| Blog | PASS with warnings | Valid type. Has `name`, `description`, `url`, `publisher`. Missing: `@id`, `inLanguage` (recommended). No `blogPost` array linking to individual posts (missed opportunity). |
| BreadcrumbList | PASS | Two items, correct structure, absolute URLs. |

#### Missing Opportunities
- The Blog block should include a `blogPost` property listing the two published articles so Googlebot can discover the relationship.
- No `WebPage` block declaring the page type explicitly.

---

### PAGE 3 — case-studies/index.html (Case Studies Index)
**URL:** https://www.vahorizon.site/case-studies/
**Schema blocks found:** CollectionPage, BreadcrumbList, ItemList

#### Validation Results

| Block | Status | Notes |
|---|---|---|
| CollectionPage | PASS with warnings | Valid. `publisher` present. Missing `@id`. The `hasPart` property (pointing to individual case study URLs) is more semantically accurate than relying solely on ItemList for a CollectionPage, but ItemList covers the functional need. |
| BreadcrumbList | PASS | Two items, correct. |
| ItemList | HIGH WARNING | `itemListElement` items use `ListItem` with `name` and `url`, which is valid. However, four of the six case study URLs (lead-manager-roi, scaling-outbound, highlevel-crm-buildout, dispo-follow-up, speed-to-lead) do not have individual Article schema on their destination pages. Only `va-replacement` has been confirmed to have its own schema. These are broken references in practice. |

#### Missing Opportunities
- Each case study in the ItemList should have a corresponding `Article` or `NewsArticle` block on its own page.

---

### PAGE 4 — crm/index.html
**URL:** https://www.vahorizon.site/crm/
**Schema blocks found:** SoftwareApplication, BreadcrumbList, FAQPage

#### Validation Results

| Block | Status | Notes |
|---|---|---|
| SoftwareApplication | PASS with warnings | Valid. `applicationCategory`, `operatingSystem`, `offers`, `provider` all present. The `offers` block is missing `price` — when using `Offer`, Google requires either `price` or a clear `priceSpecification`. The current `description` field on the Offer is not a substitute. This will not generate a rich result for software pricing. Missing `@id`. |
| BreadcrumbList | PASS | Two items, correct. |
| FAQPage | CRITICAL FAIL | Same issue as homepage. FAQPage is restricted to government and health authority sites since August 2023. This will not produce FAQ rich results and should be removed or replaced. |

#### Missing Opportunities
- The CRM page describes a `Service` (CRM buildout and management), not just a software application. A `Service` block alongside `SoftwareApplication` would more accurately represent the offering.

---

### PAGE 5 — ai-automations/index.html
**URL:** https://www.vahorizon.site/ai-automations/
**Schema blocks found:** Service, BreadcrumbList

#### Validation Results

| Block | Status | Notes |
|---|---|---|
| Service | PASS with warnings | Valid type for a service page. Has `name`, `description`, `url`, `serviceType`, `areaServed`, `provider`. Missing: `@id`, `offers` (strongly recommended — Offer with at minimum `priceCurrency`), `hasOfferCatalog`. The `areaServed` value is the string `"US"` — should be `{"@type": "Country", "name": "United States"}` to match the correctly structured version on the homepage Organization block. |
| BreadcrumbList | PASS | Two items, correct. |

#### Missing Opportunities
- No WebPage block.
- No FAQ schema — the page likely has questions about the SMS blast service (consistent with similar pages on the site). If the page contains a Q&A section, note that FAQPage is restricted, so this is correctly absent.

---

### PAGE 6 — industries/real-estate/index.html
**URL:** https://www.vahorizon.site/industries/real-estate/
**Schema blocks found:** Service, BreadcrumbList, FAQPage, HowTo

#### Validation Results

| Block | Status | Notes |
|---|---|---|
| Service | PASS with warnings | Same `areaServed` string issue as ai-automations. Missing `@id`, `offers`. |
| BreadcrumbList | PASS | Three items, correct. The intermediate "Industries" breadcrumb item points to `https://www.vahorizon.site/industries/` which may or may not be a real page — confirm this URL resolves or remove the intermediate item. |
| FAQPage | CRITICAL FAIL | Restricted schema type. Same issue as homepage and CRM page. Must be removed. |
| HowTo | CRITICAL FAIL | HowTo rich results were permanently removed by Google in September 2023. This schema type is deprecated for rich result eligibility. It generates no rich result and adds dead markup weight. Must be removed. Replace with a plain `ItemList` if you want to mark up the sequential steps, or remove entirely. |

---

### PAGE 7 — about/index.html
**URL:** https://www.vahorizon.site/about/
**Schema blocks found:** Organization, BreadcrumbList

#### Validation Results

| Block | Status | Notes |
|---|---|---|
| Organization | PASS with warnings | Has `founder` with a `Person` node inline. This is correct and good. The `Person` node has `name`, `jobTitle`, `worksFor`, `sameAs`. Missing on the Person: `url` (the about page itself would be appropriate as the Person's URL). Missing on Organization: `@id`, `logo`. The `serviceType` property is used as an array of strings — this is correct JSON-LD but `serviceType` is not a standard Organization property in Schema.org. Use `hasOfferCatalog` or move service descriptions to dedicated `Service` blocks. |
| BreadcrumbList | PASS | Two items, correct. |

#### Missing Opportunities
- The `Person` (Youssef Abi-Fadel) does not have a standalone `Person` schema block. The inline `founder` node works but a top-level `Person` block with `@id` would enable richer entity disambiguation for Google's Knowledge Graph.
- No `AboutPage` typed WebPage block.

---

### PAGE 8 — blog/how-to-hire-cold-calling-va-real-estate-wholesaling/index.html
**URL:** https://www.vahorizon.site/blog/how-to-hire-cold-calling-va-real-estate-wholesaling/
**Schema blocks found:** BlogPosting, BreadcrumbList

#### Validation Results

| Block | Status | Notes |
|---|---|---|
| BlogPosting | HIGH FAIL | The `author` is typed as `Organization`, not `Person`. Google's structured data documentation for Article/BlogPosting explicitly requires `author` to be a `Person` for rich result eligibility. An organization as author is valid Schema.org but Google will not use it for the article rich result. |
| BlogPosting | HIGH WARNING | `datePublished` and `dateModified` are both `"2026-03-06"` which is correct ISO 8601 date format. However, the values are identical — when the post is updated, `dateModified` must be updated. Flag for process. |
| BlogPosting | MEDIUM WARNING | Missing `wordCount`, `mainEntityOfPage`, and `inLanguage`. These are recommended, not required, but improve entity confidence. |
| BreadcrumbList | PASS | Three items, correct, absolute URLs. |

---

### PAGE 9 — blog/highlevel-crm-setup-guide-real-estate-wholesalers/index.html
**URL:** https://www.vahorizon.site/blog/highlevel-crm-setup-guide-real-estate-wholesalers/
**Schema blocks found:** BlogPosting, BreadcrumbList

#### Validation Results

| Block | Status | Notes |
|---|---|---|
| BlogPosting | HIGH FAIL | Same `author` as Organization issue. Must be a `Person` for Google's Article rich result eligibility. |
| BlogPosting | PASS | Has `headline`, `description`, `url`, `datePublished`, `dateModified`, `publisher` with logo (ImageObject), `image`, `articleSection`, `keywords`. This is the best-structured blog post schema of the two posts. |
| BreadcrumbList | PASS | Three items, correct. |

---

### PAGE 10 — case-studies/va-replacement/index.html
**URL:** https://www.vahorizon.site/case-studies/va-replacement/
**Schema blocks found:** Article, BreadcrumbList

#### Validation Results

| Block | Status | Notes |
|---|---|---|
| Article | HIGH FAIL | Missing `author` entirely. The `author` property is required by Google for Article rich results. Without it, this Article block cannot generate a rich result. |
| Article | HIGH WARNING | The `@type` is `Article`. For a case study that reads like editorial content about a client outcome, `Article` is acceptable. However, the more specific `NewsArticle` or a custom subtype is not needed — `Article` is correct here. What is missing is a `name` property (synonymous with `headline` at the Article level — `headline` is the correct property and it is present). This passes. |
| Article | MEDIUM WARNING | Missing `image`. Google's Article rich result requires an `image` property. Without it the article is ineligible for the image-enhanced rich result display. |
| Article | MEDIUM WARNING | Missing `publisher.logo` ImageObject. Present on blog posts but absent here. |
| BreadcrumbList | PASS | Three items, correct. |

#### Missing Opportunities
- The case study could benefit from a `Review` or structured outcome data, but there is no standard schema type for "case study results." The `Article` type is the correct approach. Adding `author` and `image` are the priority fixes.

---

### PAGE 11 — compare/va-horizon-vs-myoutdesk/index.html
**URL:** https://www.vahorizon.site/compare/va-horizon-vs-myoutdesk/
**Schema blocks found:** Article, BreadcrumbList

#### Validation Results

| Block | Status | Notes |
|---|---|---|
| Article | PASS with warnings | This is the best-structured Article page. Has `author` as `Person` (correctly), `publisher` with logo ImageObject, `datePublished`, `dateModified`, `headline`, `description`, `url`. Missing: `image`, `mainEntityOfPage`, `inLanguage`. |
| Article | LOW WARNING | The `author.url` points to `https://www.vahorizon.site/about/` — this is appropriate. However, `sameAs` with the LinkedIn URL (present on the about page Organization block) should be added to this Person node as well for entity consistency. |
| BreadcrumbList | PASS with warning | Three items. The second item points to `https://www.vahorizon.site/compare/` — confirm this URL resolves to a real page or remove the intermediate breadcrumb item. |

---

## Cross-Site Issues Summary

### CRITICAL Issues (Fix Immediately)

1. **FAQPage on 3 pages (index, crm, industries/real-estate)** — FAQPage rich results are restricted to government and health authority sites since August 2023. VA Horizon is a B2B VA services company and does not qualify. These blocks generate zero rich results and should be removed from all three pages. The on-page Q&A content can remain — only the schema markup needs to be removed.

2. **HowTo on industries/real-estate** — HowTo rich results were permanently removed in September 2023. The schema block is dead markup. Remove it.

3. **FAQPage repeated on crm/index.html** — same as issue 1.

### HIGH Issues

4. **Blog post `author` is Organization, not Person** — Both blog posts use `"@type": "Organization"` for the `author` field. Google requires `Person` for Article rich result eligibility. Change to `Person` with `name`, `url`, and `sameAs`.

5. **Case study (va-replacement) missing `author`** — The Article block has no `author` property. Required for rich results.

6. **Case study (va-replacement) missing `image`** — Required for the image-enhanced Article rich result.

7. **Five of six case studies in the ItemList have no individual schema** — The CollectionPage ItemList links to six case study URLs, but only `va-replacement` has confirmed Article schema. The other five pages were not audited but should each have their own Article block.

8. **WebSite block on homepage is bare** — Only `name` and `url`. Missing `SearchAction` for Sitelinks Searchbox eligibility.

### MEDIUM Issues

9. **`areaServed` uses string "US" on Service blocks** — Should be `{"@type": "Country", "name": "United States"}` for consistency and better entity resolution.

10. **SoftwareApplication `offers` missing `price`** — The Offer block on crm/index.html has no `price` value. Add `"price": "0"` with a note that it's included in service plans, or add `priceSpecification`.

11. **Article blocks missing `image`** — Both the va-replacement case study and the compare page are missing the `image` property which Google uses for Article rich result display.

12. **No `@id` identifiers on any blocks** — None of the schema blocks across any page use `@id` for entity disambiguation. This is not required but is strongly recommended for Knowledge Graph entity linking. At minimum the main Organization block should have `"@id": "https://www.vahorizon.site/#organization"`.

13. **`compare/` and `industries/` intermediate breadcrumb URLs** — The BreadcrumbList on the compare page references `/compare/` and the real-estate page references `/industries/` as intermediate items. If these are not real, indexable pages, Google will be unable to validate the breadcrumb chain.

14. **Blog index has no `blogPost` links** — The Blog block on `blog/index.html` should reference the published posts via `blogPost` property.

### LOW Issues

15. **No `inLanguage` on any Article/BlogPosting** — Recommended for international SEO clarity.

16. **No `mainEntityOfPage` on blog posts** — Helps Google understand the primary subject of the page.

17. **`serviceType` used on Organization (about page)** — Not a standard Organization property. Use `hasOfferCatalog` instead.

18. **Duplicate `logo`/`image` on homepage Organization** — Both properties point to the same URL. `logo` should be an `ImageObject`, not a bare URL string.

---

## Recommended JSON-LD Additions and Fixes

All blocks below are ready to drop in as `<script type="application/ld+json">` tags.

---

### FIX 1: Homepage — Replace bare WebSite block

Replace the existing WebSite script tag on `index.html` with this. Also adds `@id` to Organization.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.vahorizon.site/#organization",
      "name": "VA Horizon",
      "legalName": "VA Horizon LLC",
      "url": "https://www.vahorizon.site/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.vahorizon.site/logo.png"
      },
      "description": "VA Horizon provides trained virtual assistants for U.S. real estate wholesalers, specializing in cold calling, skip tracing, CRM setup, and lead management.",
      "foundingDate": "2024",
      "email": "youssef@vahorizon.site",
      "telephone": "+1-512-580-5821",
      "areaServed": {
        "@type": "Country",
        "name": "United States"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+1-512-580-5821",
          "email": "youssef@vahorizon.site",
          "contactType": "customer support",
          "areaServed": "US",
          "availableLanguage": "English"
        }
      ],
      "sameAs": [
        "https://www.linkedin.com/in/youssef-ahmed-255966380/"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://www.vahorizon.site/#website",
      "name": "VA Horizon",
      "url": "https://www.vahorizon.site/",
      "publisher": {
        "@id": "https://www.vahorizon.site/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://www.vahorizon.site/?s={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    }
  ]
}
```

**Also remove the FAQPage script block from `index.html` entirely.**

---

### FIX 2: Homepage — Add Service schema

Add this as a new script tag on `index.html` to describe the core business offering.

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.vahorizon.site/#service-cold-calling",
  "name": "Cold Calling VA Services for Real Estate Wholesalers",
  "description": "Trained, accent-neutral cold calling virtual assistants for U.S. real estate wholesalers — handling outbound calls, appointment setting, list pulling, skip tracing, SMS follow-up, and HighLevel CRM management.",
  "url": "https://www.vahorizon.site/industries/real-estate/",
  "serviceType": "Virtual Assistant Staffing",
  "areaServed": {
    "@type": "Country",
    "name": "United States"
  },
  "provider": {
    "@id": "https://www.vahorizon.site/#organization"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "640",
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "priceCurrency": "USD",
      "minPrice": "640",
      "maxPrice": "800",
      "unitText": "per month"
    }
  }
}
```

---

### FIX 3: industries/real-estate — Remove HowTo and FAQPage, fix areaServed

Remove both the `HowTo` and `FAQPage` blocks from the `@graph` array entirely.

Update the Service block's `areaServed` from the string `"US"` to:

```json
"areaServed": {
  "@type": "Country",
  "name": "United States"
}
```

---

### FIX 4: crm/index.html — Remove FAQPage, fix Offer, add @id

Remove the `FAQPage` block from the `@graph` array.

Update the `SoftwareApplication` block's `offers` to:

```json
"offers": {
  "@type": "Offer",
  "description": "Included with VA Horizon service plans",
  "priceCurrency": "USD",
  "price": "0",
  "eligibleCustomerType": "https://schema.org/Business"
}
```

---

### FIX 5: Blog posts — Fix author to Person

Replace the `author` block on both blog posts. Currently both have:

```json
"author": {
  "@type": "Organization",
  "name": "VA Horizon",
  "url": "https://www.vahorizon.site"
}
```

Replace with:

```json
"author": {
  "@type": "Person",
  "name": "Youssef Abi-Fadel",
  "url": "https://www.vahorizon.site/about/",
  "sameAs": "https://www.linkedin.com/in/youssef-ahmed-255966380/"
},
"mainEntityOfPage": {
  "@type": "WebPage",
  "@id": "https://www.vahorizon.site/blog/how-to-hire-cold-calling-va-real-estate-wholesaling/"
}
```

(Adjust `@id` URL for each respective post.)

---

### FIX 6: case-studies/va-replacement — Add author, image, publisher logo

Replace the current Article block with this complete version:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Replacing a VA in 5 Days: From 12% to 28% Close Rate",
      "description": "How a Memphis wholesaler replaced an underperforming cold calling VA in 5 days using VA Horizon — and saw their close rate jump from 12% to 28% within 45 days.",
      "url": "https://www.vahorizon.site/case-studies/va-replacement/",
      "datePublished": "2026-03-06",
      "dateModified": "2026-03-06",
      "inLanguage": "en-US",
      "image": {
        "@type": "ImageObject",
        "url": "https://www.vahorizon.site/social/va-horizon-og.png",
        "width": 1200,
        "height": 630
      },
      "author": {
        "@type": "Person",
        "name": "Youssef Abi-Fadel",
        "url": "https://www.vahorizon.site/about/",
        "sameAs": "https://www.linkedin.com/in/youssef-ahmed-255966380/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "VA Horizon",
        "url": "https://www.vahorizon.site",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.vahorizon.site/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://www.vahorizon.site/case-studies/va-replacement/"
      },
      "articleSection": "Case Studies"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.vahorizon.site/" },
        { "@type": "ListItem", "position": 2, "name": "Case Studies", "item": "https://www.vahorizon.site/case-studies/" },
        { "@type": "ListItem", "position": 3, "name": "Replacing a VA in 5 Days: 12% to 28% Close Rate", "item": "https://www.vahorizon.site/case-studies/va-replacement/" }
      ]
    }
  ]
}
```

---

### FIX 7: compare page — Add image and sameAs to author Person

Add to the existing Article block on `compare/va-horizon-vs-myoutdesk/index.html`:

```json
"image": {
  "@type": "ImageObject",
  "url": "https://www.vahorizon.site/social/va-horizon-og.png",
  "width": 1200,
  "height": 630
},
"mainEntityOfPage": {
  "@type": "WebPage",
  "@id": "https://www.vahorizon.site/compare/va-horizon-vs-myoutdesk/"
},
"inLanguage": "en-US"
```

And update the `author` Person node to include `sameAs`:

```json
"author": {
  "@type": "Person",
  "name": "Youssef Abi-Fadel",
  "jobTitle": "Founder, VA Horizon",
  "url": "https://www.vahorizon.site/about/",
  "sameAs": "https://www.linkedin.com/in/youssef-ahmed-255966380/"
}
```

---

### FIX 8: about/index.html — Add standalone Person block

Add this as a new script tag on `about/index.html`. This creates a named entity node for the founder that can be referenced from other pages.

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://www.vahorizon.site/about/#youssef",
  "name": "Youssef Abi-Fadel",
  "jobTitle": "Founder & CEO",
  "url": "https://www.vahorizon.site/about/",
  "worksFor": {
    "@id": "https://www.vahorizon.site/#organization"
  },
  "sameAs": [
    "https://www.linkedin.com/in/youssef-ahmed-255966380/"
  ]
}
```

Once this block exists, update the `author` property on blog posts and case studies to reference `"@id": "https://www.vahorizon.site/about/#youssef"` instead of repeating the full Person node each time.

---

### FIX 9: ai-automations/index.html — Fix areaServed

Update `areaServed` from `"US"` to:

```json
"areaServed": {
  "@type": "Country",
  "name": "United States"
}
```

---

### FIX 10: blog/index.html — Add blogPost references

Add a `blogPost` array to the existing Blog block:

```json
"blogPost": [
  {
    "@type": "BlogPosting",
    "headline": "How to Hire a Cold Calling VA for Real Estate Wholesaling (2026 Guide)",
    "url": "https://www.vahorizon.site/blog/how-to-hire-cold-calling-va-real-estate-wholesaling/",
    "datePublished": "2026-03-06"
  },
  {
    "@type": "BlogPosting",
    "headline": "HighLevel CRM Setup Guide for Real Estate Wholesalers (2026)",
    "url": "https://www.vahorizon.site/blog/highlevel-crm-setup-guide-real-estate-wholesalers/",
    "datePublished": "2026-03-06"
  }
]
```

---

## Prioritized Action Plan

### Do First (Critical — removes invalid markup)
1. Remove all three `FAQPage` blocks (homepage, crm, industries/real-estate)
2. Remove `HowTo` block from industries/real-estate

### Do Second (High — enables rich results)
3. Fix `author` to `Person` on both blog posts
4. Add `author`, `image`, and `publisher.logo` to va-replacement Article block
5. Add `SearchAction` to homepage WebSite block

### Do Third (Medium — improves entity quality)
6. Add `@id` to Organization block on homepage
7. Add standalone Person block on about page
8. Fix `areaServed` on Service blocks (ai-automations, industries/real-estate)
9. Add `image` to compare page Article block
10. Fix `offers.price` on crm SoftwareApplication

### Do Fourth (Low — recommended enhancements)
11. Add `inLanguage` and `mainEntityOfPage` to all Article/BlogPosting blocks
12. Add `blogPost` array to blog index
13. Confirm `/compare/` and `/industries/` URLs resolve before next site audit
14. Add Service schema to homepage

---

## Files Modified by This Audit

No files were modified. All recommended changes are documented above for manual implementation.

**Report generated:** 2026-03-09
**Audited by:** Claude Code Schema.org Specialist
