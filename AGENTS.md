# VA Horizon - Codex Project Instructions

Read before touching any file. This file mirrors the project rules in `CLAUDE.md` for Codex/agent workflows.

## Reference Docs

| File | Purpose |
|------|---------|
| `DESIGN_SYSTEM.md` | Colors, typography, components, CSS patterns - mandatory |
| `SITE-STRUCTURE.md` | URL architecture, page inventory, nav/footer conventions |
| `va-horizon-operations.md` | Business context, services, pricing, differentiators |

## Brand Rules

- Font: Montserrat only (`/fonts.css`). No Google Fonts, no other typefaces.
- Colors: Navy `#082541`/`#071e35`, Gold `#D4A02F`, Warm `#F6F1E8`. No new brand colors.
- CSS load order: `fonts.css -> cards.css -> va-custom.css -> tailwind.min.css -> page <style>`.
- Headings: `font-montserrat text-Xyl font-black` plus `style="letter-spacing:-0.02em;"`. Never merge class names.

## Page Template

Every page requires:

- Hero with dot-grid texture and section label pill.
- Stats bar below hero.
- Gold pills (`section-label`) above each section heading.
- FAQ accordion, not static FAQ text.
- CTA section with gold rule and radial glow.
- Shared navbar, sticky navy.
- Shared footer, 4-column grid.

## SEO Baseline

- Required meta: `<title>`, `<meta description>`, `<link canonical>`, OG tags, Twitter tags, and JSON-LD.
- Canonical URLs must be absolute and use a trailing slash: `https://www.vahorizon.site/path/`.
- Schema types: `Service` for VA pages, `SoftwareApplication` for CRM, `FAQPage`, and `BreadcrumbList`.
- Do not shorten existing meta descriptions; they are keyword-optimized.
- Always update `sitemap.xml` when adding, modifying, or removing pages.

## Conventions

- Page URLs use directory format (`/page/`), not `.html`.
- Page styles live in a `<style>` block in `<head>` after stylesheet links.
- Images: `/logo.png`, `/va-horizon.png`, `/tagline.png`, `/social/va-horizon-og.png`, `/img/*`.
- Scripts: `/buttons.js` with `defer`, plus page-specific `<script>` before `</body>`.
- Mobile menu is handled by `buttons.js`; do not inline menu JavaScript.

## Codex Workflow

- Check `git status --short` before editing and preserve unrelated user changes.
- Prefer small, focused edits that match nearby HTML, CSS, and JavaScript patterns.
- Use `rg`/`rg --files` for repo search when available.
- Run the narrowest relevant validation after changes. For broad site changes, prefer `npm run build`, `npm run lint`, or `npm run check` as appropriate.
- Do not commit unless explicitly asked.

## Don'ts

- Do not add pages without checking `SITE-STRUCTURE.md`.
- Do not change navbar/footer without checking all pages that share the pattern.
- Do not remove JSON-LD schema.
- Do not introduce new brand colors, fonts, or ad hoc layout patterns.
- Do not commit unless asked.
