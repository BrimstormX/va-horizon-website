# VA Horizon — Project Instructions

Read before touching any file.

## Reference Docs

| File | Purpose |
|------|---------|
| `DESIGN_SYSTEM.md` | Colors, typography, components, CSS patterns — **mandatory** |
| `SITE-STRUCTURE.md` | URL architecture, page inventory, nav/footer conventions |
| `va-horizon-operations.md` | Business context, services, pricing, differentiators |

---

## Brand Rules

- **Font:** Montserrat only (`/fonts.css`). No Google Fonts, no other typefaces.
- **Colors:** Navy `#082541`/`#071e35` · Gold `#D4A02F` · Warm `#F6F1E8`. No new brand colors.
- **CSS load order:** `fonts.css → cards.css → va-custom.css → tailwind.min.css → page <style>`
- **Headings:** `font-montserrat text-Xyl font-black` + `style="letter-spacing:-0.02em;"` — never merge class names.

## Page Template

Every page requires:
- Hero w/ dot-grid texture + section label pill
- Stats bar below hero
- Gold pills (`section-label`) above each section heading
- FAQ accordion (not static)
- CTA section: gold rule + radial glow
- Shared navbar (sticky, navy) + footer (4-col grid)

## SEO Baseline

- Required meta: `<title>`, `<meta description>`, `<link canonical>`, OG + Twitter tags, JSON-LD
- Canonical = absolute URL w/ trailing slash (`https://www.vahorizon.site/path/`)
- Schema types: `Service` (VA pages), `SoftwareApplication` (CRM), `FAQPage`, `BreadcrumbList`
- Don't shorten existing meta descriptions — they're keyword-optimized.
- **Always update `sitemap.xml` when adding, modifying, or removing pages.**

## Conventions

- Page URLs: directory format (`/page/`), not `.html`
- Page styles: `<style>` block in `<head>` after stylesheet links
- Images: `/logo.png`, `/va-horizon.png`, `/tagline.png`, `/social/va-horizon-og.png`, `/img/*`
- Scripts: `/buttons.js` (deferred) + page `<script>` before `</body>`
- Mobile menu: handled by `buttons.js` — don't inline menu JS

## Don'ts

- Don't add pages without checking `SITE-STRUCTURE.md`
- Don't change navbar/footer without checking all pages (shared pattern)
- Don't remove JSON-LD schema
- Don't commit unless asked
