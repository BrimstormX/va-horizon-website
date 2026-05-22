# VA Horizon Source Layer

The production site is still static HTML, but deploys now come from the generated `_site/` directory instead of the repository root.

Use this directory as the source of truth for shared data, layout partials, and future page migrations. The current build copies the existing static pages into `_site` so the first maintainability refactor does not change the visual design.

Recommended migration order:

1. Move shared header, footer, head assets, and script includes into reusable templates.
2. Move repeated page metadata and schema into `src/_data/`.
3. Convert one page family at a time, starting with legal pages and index/listing pages before long-form guides.
4. Compare generated output against the current page before deleting a legacy static source page.
