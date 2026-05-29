// Shared HTML helpers for the page generator.
// Matches the zero-dependency, template-literal style used in scripts/generate-internal-links.mjs.

export const SITE_ORIGIN = 'https://www.vahorizon.site';

// Escape text destined for HTML body / attribute context.
export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Escape a string for safe embedding inside a JSON-LD string value.
// JSON.stringify already handles quoting; this is used when we build graphs as objects.
export function canonicalFromSlug(dir, slug) {
  const path = `/${dir}/${slug}/`.replace(/\/+/g, '/');
  return `${SITE_ORIGIN}${path}`;
}

export function routeFromSlug(dir, slug) {
  return `/${dir}/${slug}/`.replace(/\/+/g, '/');
}

// Render a JSON-LD <script> block from a JS object/graph.
export function jsonLd(graph) {
  return `<script type="application/ld+json">\n${JSON.stringify(graph, null, 1)}\n</script>`;
}
