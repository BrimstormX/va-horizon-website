# VA Horizon Page Generator

Data-driven static page generator. Turns `data/*.json` + templates into committed
`index.html` files, keeping the existing GitHub Pages / `.nojekyll` hosting model.
This is the systemization layer from `../PROGRAMMATIC-SEO-PLAN.md` — scaling pages
becomes data entry, not HTML authoring.

## How it fits the existing pipeline

The generator owns the **page body, `<head>`, and page-type JSON-LD**. The existing
`scripts/generate-internal-links.mjs` post-processor owns the **visible breadcrumb,
the `VAH_INTERNAL_LINKS` block, and breadcrumb schema** (injected from `sitemap.xml`).
They compose — never hand-author those managed blocks in a template.

```
edit data/*.json  ->  node generator/build.mjs  ->  npm run internal-links
                      (writes pages, quality gate)   (breadcrumb + internal links)
```

## Commands

```bash
node generator/build.mjs                 # build all registered page types
node generator/build.mjs --only=locations
npm run internal-links                   # decorate breadcrumb + internal links
```

## Quality gate (build fails if any page violates)

- All `requiredFields` present and non-empty.
- Minimum word count per type (locations: 600).
- City-specific signal: >= 3 target areas, >= 5 FAQ entries.
- Near-duplicate detection: Jaccard similarity over 3-word shingles; > 80% fails.

If any page fails, **nothing is written** for that type — fix the data and re-run.

## Layout

```
generator/
├── build.mjs              # entry + quality gate + page registry
├── lib/html.mjs           # esc(), canonicalFromSlug(), jsonLd()
├── partials/              # single source of truth, extracted from production
│   ├── head.mjs           # token-driven; canonical/OG ALWAYS derived from slug
│   ├── nav.mjs
│   └── footer.mjs
├── templates/
│   └── location.mjs       # location record -> full HTML document
├── data/
│   └── locations.json     # 10 cities (bootstrapped from existing pages)
└── scripts/
    └── extract-locations.mjs   # one-time: reverse-engineered data from old HTML
```

## Canonical bug fixed in Phase 0

`canonical`/`og:url`/JSON-LD URLs are derived from the slug in `head.mjs`, so a page
at `/locations/<slug>/` always self-canonicalizes correctly. The pre-existing bug
(all location pages canonicalizing to a 404 under `/industries/real-estate/...`) was
being injected by `scripts/generate-internal-links.mjs::normalizeExistingLinks` — its
broad `/locations/` -> `/industries/real-estate/` URL rewrite caught the canonical.
That rewrite is now scoped to the bare hub link only.

## Adding a new page type

1. Add `data/<type>.json` and `templates/<type>.mjs` (export a `render(record)`).
2. Register it in `build.mjs` `registry` with `requiredFields` + `minWords`.
3. Add the URLs to `sitemap.xml` so the post-processor links them.
4. `node generator/build.mjs --only=<type> && npm run internal-links`.
