// Shared <head> partial. Token-driven so canonical/OG/Twitter are always derived,
// never hand-typed (this is what kills the /locations vs /industries canonical bug).
import { esc } from '../lib/html.mjs';

const OG_IMAGE = 'https://www.vahorizon.site/social/va-horizon-og.png';

/**
 * @param {object} d
 * @param {string} d.title          full <title> text
 * @param {string} d.description     meta description
 * @param {string} d.canonical      absolute canonical URL (trailing slash)
 * @param {string} [d.twitterDescription]
 * @param {string} d.styleBlock     page-type <style> block (raw CSS, no <style> tag)
 * @param {string} d.schema         raw JSON-LD <script> block(s)
 */
export function head(d) {
  const twDesc = d.twitterDescription || d.description;
  return `<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>${esc(d.title)}</title>
 <meta name="description" content="${esc(d.description)}">
 <link rel="canonical" href="${esc(d.canonical)}">
 <meta property="og:type" content="website">
 <meta property="og:title" content="${esc(d.title)}">
 <meta property="og:description" content="${esc(d.description)}">
 <meta property="og:url" content="${esc(d.canonical)}">
 <meta property="og:site_name" content="VA Horizon">
 <meta property="og:image" content="${OG_IMAGE}">
 <meta property="og:image:width" content="1200">
 <meta property="og:image:height" content="630">
 <meta name="twitter:card" content="summary_large_image">
 <meta name="twitter:title" content="${esc(d.title)}">
 <meta name="twitter:description" content="${esc(twDesc)}">
 <meta name="twitter:image" content="${OG_IMAGE}">

 <!-- Favicons -->
 <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
 <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
 <link rel="apple-touch-icon" sizes="192x192" href="/favicon-192x192.png">

 <!-- CSS load order - mandatory -->
 <link rel="stylesheet" href="/fonts.css">
 <link rel="stylesheet" href="/VAHorizonWebsiteStyle/_components/v1/93bdfffda6e0bf9a7fd91429ea912af65458e738.css?v=3">
 <link rel="stylesheet" href="/cards.css?v=3">
 <link rel="stylesheet" href="/css/va-custom.css?v=navfix-20260525">
 <link rel="stylesheet" href="/css/tailwind.min.css">

 <style>
${d.styleBlock}
 </style>

${d.schema}
</head>`;
}
