import { promises as fs } from 'fs';
import path from 'path';

const rootDir = process.cwd();
const siteOrigin = 'https://www.vahorizon.site';
const sitemapPath = path.join(rootDir, 'sitemap.xml');
const minInboundLinks = 3;

const internalStart = '<!-- VAH_INTERNAL_LINKS_START -->';
const internalEnd = '<!-- VAH_INTERNAL_LINKS_END -->';
const breadcrumbStart = '<!-- VAH_BREADCRUMB_START -->';
const breadcrumbEnd = '<!-- VAH_BREADCRUMB_END -->';
const breadcrumbSchemaStart = '<!-- VAH_BREADCRUMB_SCHEMA_START -->';
const breadcrumbSchemaEnd = '<!-- VAH_BREADCRUMB_SCHEMA_END -->';

const primaryTargets = [
  '/',
  '/industries/real-estate/',
  '/services/',
  '/ai-automations/',
  '/crm/',
  '/case-studies/',
  '/guides/',
  '/blog/',
  '/tools/',
  '/compare/',
  '/alternatives/',
  '/glossary/',
  '/solutions/',
  '/meet-your-va/',
  '/about/',
  '/apply/',
  '/partner/',
];

const fixedLabels = new Map([
  ['/', 'Home'],
  ['/industries/real-estate/', 'Real Estate VAs'],
  ['/services/', 'Services'],
  ['/ai-automations/', 'SMS & Automations'],
  ['/crm/', 'CRM'],
  ['/case-studies/', 'Case Studies'],
  ['/guides/', 'Guides'],
  ['/blog/', 'Blog'],
  ['/tools/', 'Tools'],
  ['/compare/', 'Comparisons'],
  ['/alternatives/', 'Alternatives'],
  ['/glossary/', 'Glossary'],
  ['/solutions/', 'Solutions'],
  ['/meet-your-va/', 'Meet Your VA'],
  ['/about/', 'About'],
  ['/apply/', 'Apply'],
  ['/partner/', 'Partner Program'],
  ['/privacy/', 'Privacy Policy'],
  ['/refund-policy/', 'Refund Policy'],
  ['/terms/', 'Terms of Service'],
]);

const groupHubs = new Map([
  ['blog', '/blog/'],
  ['guides', '/guides/'],
  ['case-studies', '/case-studies/'],
  ['tools', '/tools/'],
  ['compare', '/compare/'],
  ['alternatives', '/alternatives/'],
  ['glossary', '/glossary/'],
  ['solutions', '/solutions/'],
  ['services', '/services/'],
  ['industries', '/industries/real-estate/'],
  ['locations', '/industries/real-estate/'],
]);

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function routeToSourceFile(route) {
  if (route === '/') return path.join(rootDir, 'index.html');
  return path.join(rootDir, route.slice(1), 'index.html');
}

function normalizeRoute(route) {
  if (!route.startsWith('/')) return null;
  let next = route.split('#')[0].split('?')[0];
  if (next.endsWith('/index.html')) next = next.slice(0, -'index.html'.length);
  if (next !== '/' && !next.endsWith('/')) next += '/';
  return next;
}

function stripHtml(value) {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&mdash;/g, '-')
    .replace(/&ndash;/g, '-')
    .replace(/&bull;/g, '-')
    .replace(/&#8212;/g, '-')
    .replace(/&#8211;/g, '-')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function cleanLabel(value) {
  return decodeEntities(stripHtml(value))
    .replace(/\s+\|\s+VA Horizon.*$/i, '')
    .replace(/\s+-\s+VA Horizon.*$/i, '')
    .replace(/\s+\|\s+Real Estate Wholesaling.*$/i, '')
    .replace(/\s+\(2026[^)]*\)/gi, '')
    .replace(/\s+2026\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function labelFromRoute(route) {
  if (fixedLabels.has(route)) return fixedLabels.get(route);
  const slug = route.split('/').filter(Boolean).at(-1) || 'Page';
  return slug
    .split('-')
    .map(part => part.length <= 3 ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
    .replace(/\bVA\b/g, 'VA')
    .replace(/\bCRM\b/g, 'CRM')
    .replace(/\bSMS\b/g, 'SMS');
}

function extractTitle(html, route) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) return cleanLabel(titleMatch[1]) || labelFromRoute(route);

  const h1Match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) return cleanLabel(h1Match[1]) || labelFromRoute(route);

  return labelFromRoute(route);
}

function classifyRoute(route) {
  if (route === '/') return 'home';
  if (route === '/blog/' || route === '/guides/' || route === '/case-studies/' || route === '/tools/' || route === '/compare/' || route === '/alternatives/' || route === '/glossary/' || route === '/solutions/' || route === '/services/') return 'hub';
  if (route.startsWith('/glossary/')) return 'glossary';
  if (route.startsWith('/solutions/')) return 'solutions';
  if (route.startsWith('/services/')) return 'services';
  if (route.startsWith('/blog/')) return 'blog';
  if (route.startsWith('/guides/')) return 'guides';
  if (route.startsWith('/case-studies/')) return 'case-studies';
  if (route.startsWith('/tools/')) return 'tools';
  if (route.startsWith('/compare/')) return 'compare';
  if (route.startsWith('/alternatives/')) return 'alternatives';
  if (route.startsWith('/locations/')) return 'locations';
  if (route.startsWith('/industries/') && route !== '/industries/real-estate/') return 'industries';
  return 'core';
}

function guideCluster(route) {
  const slug = route.toLowerCase();
  if (/(sms|a2p|10dlc|carrier-filtering)/.test(slug) && !slug.includes('registration-highlevel')) return 'SMS Marketing';
  if (/(highlevel|crm|pipeline|automation-workflows|custom-fields|reporting-dashboard|registration-highlevel)/.test(slug)) return 'HighLevel CRM';
  if (/(hire|where-to-find|vetting|training|performance|qa-framework|scaling-va-team)/.test(slug)) return 'Hiring & VA Operations';
  return 'Cold Calling';
}

function sortBySitemapOrder(routes, order) {
  return [...routes].sort((a, b) => order.get(a) - order.get(b));
}

function uniqueRoutes(routes, currentRoute, pages) {
  const seen = new Set();
  const clean = [];

  for (const route of routes) {
    const normalized = normalizeRoute(route);
    if (!normalized || normalized === currentRoute || seen.has(normalized) || !pages.has(normalized)) continue;
    seen.add(normalized);
    clean.push(normalized);
  }

  return clean;
}

function selectSiblings(currentRoute, routes, order, limit = 8) {
  const siblings = routes.filter(route => route !== currentRoute);
  if (siblings.length <= limit) return sortBySitemapOrder(siblings, order);

  const currentIndex = order.get(currentRoute);
  return siblings
    .map(route => ({ route, distance: Math.abs(order.get(route) - currentIndex) }))
    .sort((a, b) => a.distance - b.distance || order.get(a.route) - order.get(b.route))
    .slice(0, limit)
    .map(item => item.route);
}

function linkItem(route, pages) {
  return `<li><a href="${route}" class="text-va-dark/80 hover:text-va-gold transition-colors">${escapeHtml(pages.get(route).label)}</a></li>`;
}

function linkCard(route, pages) {
  return `<a href="${route}" class="block rounded-lg border border-va-divider bg-white p-4 text-sm font-semibold text-va-navy shadow-sm transition hover:-translate-y-0.5 hover:border-va-gold hover:text-va-gold">${escapeHtml(pages.get(route).label)}</a>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function breadcrumbTrail(route, pages) {
  if (route === '/') return [];

  const type = classifyRoute(route);
  const current = { label: pages.get(route).label, route };

  if (type === 'blog') return [{ label: 'Home', route: '/' }, { label: 'Blog', route: '/blog/' }, current];
  if (type === 'guides') return [{ label: 'Home', route: '/' }, { label: 'Guides', route: '/guides/' }, current];
  if (type === 'case-studies') return [{ label: 'Home', route: '/' }, { label: 'Case Studies', route: '/case-studies/' }, current];
  if (type === 'tools') return [{ label: 'Home', route: '/' }, { label: 'Tools', route: '/tools/' }, current];
  if (type === 'compare') return [{ label: 'Home', route: '/' }, { label: 'Compare', route: '/compare/' }, current];
  if (type === 'alternatives') return [{ label: 'Home', route: '/' }, { label: 'Alternatives', route: '/alternatives/' }, current];
  if (type === 'glossary') return [{ label: 'Home', route: '/' }, { label: 'Glossary', route: '/glossary/' }, current];
  if (type === 'solutions') return [{ label: 'Home', route: '/' }, { label: 'Solutions', route: '/solutions/' }, current];
  if (type === 'services') return [{ label: 'Home', route: '/' }, { label: 'Services', route: '/services/' }, current];
  if (type === 'industries') return [{ label: 'Home', route: '/' }, { label: 'Real Estate VAs', route: '/industries/real-estate/' }, current];
  if (type === 'locations') return [{ label: 'Home', route: '/' }, { label: 'Real Estate VAs', route: '/industries/real-estate/' }, current];

  return [{ label: 'Home', route: '/' }, current];
}

function renderBreadcrumb(route, pages) {
  const trail = breadcrumbTrail(route, pages);
  if (!trail.length) return '';

  const parts = trail.map((item, index) => {
    if (index === trail.length - 1) {
      return `<span class="inline-flex items-center rounded-full border border-va-gold/30 bg-white px-3 py-1 font-extrabold text-va-navy shadow-sm">${escapeHtml(item.label)}</span>`;
    }
    return `<a href="${item.route}" class="font-bold text-va-navy/75 transition-colors hover:text-va-gold">${escapeHtml(item.label)}</a>`;
  });

  return `${breadcrumbStart}
<div class="bg-[#F6F1E8] border-y border-[#e8e4dc] py-3">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <nav class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em]" aria-label="Breadcrumb">
      ${parts.join('\n      <span class="text-va-gold font-black">/</span>\n      ')}
    </nav>
  </div>
</div>
${breadcrumbEnd}`;
}

function renderBreadcrumbSchema(route, pages) {
  const trail = breadcrumbTrail(route, pages);
  if (!trail.length) return '';

  const itemListElement = trail.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    item: `${siteOrigin}${item.route}`,
  }));

  return `${breadcrumbSchemaStart}
<script type="application/ld+json">
${JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement }, null, 2)}
</script>
${breadcrumbSchemaEnd}`;
}

function renderLinkList(title, routes, pages) {
  if (!routes.length) return '';
  return `<div>
      <h2 class="text-sm font-extrabold uppercase tracking-wide text-va-gold">${escapeHtml(title)}</h2>
      <ul class="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-1">
        ${routes.map(route => linkItem(route, pages)).join('\n        ')}
      </ul>
    </div>`;
}

function renderLinkCards(title, routes, pages) {
  if (!routes.length) return '';
  return `<div>
      <h2 class="text-sm font-extrabold uppercase tracking-wide text-va-gold">${escapeHtml(title)}</h2>
      <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        ${routes.map(route => linkCard(route, pages)).join('\n        ')}
      </div>
    </div>`;
}

function renderGuideGroups(groupsConfig, pages) {
  return `<div>
      <h2 class="text-sm font-extrabold uppercase tracking-wide text-va-gold">Guides by Topic</h2>
      <div class="mt-4 grid gap-4 sm:grid-cols-2">
        ${groupsConfig.map(group => `<div class="rounded-lg border border-va-divider bg-white p-5 shadow-sm">
          <h3 class="text-base font-black text-va-navy" style="letter-spacing:-0.02em;">${escapeHtml(group.title)}</h3>
          <ul class="mt-3 space-y-2 text-sm">
            ${group.routes.filter(route => pages.has(route)).map(route => linkItem(route, pages)).join('\n            ')}
          </ul>
        </div>`).join('\n        ')}
      </div>
      <a href="/guides/" class="mt-5 inline-flex items-center rounded-md border border-va-divider bg-white px-4 py-2 text-sm font-extrabold text-va-navy transition hover:border-va-gold hover:text-va-gold">View all guides</a>
    </div>`;
}

function buildSections(page, pages, groups, order) {
  const route = page.route;
  const type = classifyRoute(route);
  const sections = [];
  const commercial = uniqueRoutes(['/industries/real-estate/', '/ai-automations/', '/crm/', '/case-studies/', '/apply/'], route, pages);

  if (type === 'hub') {
    if (route === '/guides/') {
      sections.push({
        title: 'Guides by Topic',
        variant: 'guide-groups',
        groups: [
          {
            title: 'Cold Calling',
            routes: [
              '/guides/cold-calling-real-estate-wholesaling/',
              '/guides/cold-calling-scripts-real-estate-wholesaling/',
              '/guides/dialer-setup-real-estate-wholesalers/',
              '/guides/cold-calling-kpi-benchmarks-wholesalers/',
            ],
          },
          {
            title: 'HighLevel CRM',
            routes: [
              '/guides/highlevel-crm-wholesalers/',
              '/guides/highlevel-pipeline-design-wholesalers/',
              '/guides/highlevel-automation-workflows-wholesaling/',
              '/guides/highlevel-reporting-dashboard-wholesalers/',
            ],
          },
          {
            title: 'SMS Marketing',
            routes: [
              '/guides/sms-blast-real-estate/',
              '/guides/a2p-10dlc-compliance-real-estate/',
              '/guides/sms-templates-real-estate-wholesaling/',
              '/guides/carrier-filtering-real-estate-sms/',
            ],
          },
          {
            title: 'Hiring & VA Ops',
            routes: [
              '/guides/hire-real-estate-va/',
              '/guides/vetting-cold-calling-vas/',
              '/guides/va-performance-kpis/',
              '/guides/va-qa-framework/',
            ],
          },
        ],
      });
      sections.push({ title: 'High-Intent Pages', routes: commercial, variant: 'list' });
      return sections;
    }

    const group = route === '/blog/' ? 'blog'
      : route === '/guides/' ? 'guides'
      : route === '/case-studies/' ? 'case-studies'
      : route === '/tools/' ? 'tools'
      : route === '/compare/' ? 'compare'
      : route === '/alternatives/' ? 'alternatives'
      : route === '/glossary/' ? 'glossary'
      : route === '/services/' ? 'services'
      : null;
    const children = group ? sortBySitemapOrder(groups.get(group) || [], order) : [];
    sections.push({ title: `${page.label} Library`, routes: children, variant: 'cards' });
    sections.push({ title: 'High-Intent Pages', routes: commercial, variant: 'list' });
    return sections;
  }

  if (type === 'home' || type === 'core') {
    if (route === '/industries/real-estate/') {
      sections.push({ title: 'Real Estate Industry Systems', routes: uniqueRoutes(sortBySitemapOrder(groups.get('industries') || [], order), route, pages), variant: 'cards' });
      sections.push({ title: 'Cold Calling VA Markets', routes: uniqueRoutes(sortBySitemapOrder(groups.get('locations') || [], order), route, pages), variant: 'cards' });
      sections.push({ title: 'Proof & Resources', routes: uniqueRoutes(['/case-studies/speed-to-lead/', '/case-studies/highlevel-crm-buildout/', '/guides/cold-calling-real-estate-wholesaling/', '/tools/cold-call-volume-calculator/', '/apply/'], route, pages), variant: 'list' });
      return sections;
    }

    sections.push({ title: 'Core Pages', routes: uniqueRoutes(primaryTargets, route, pages), variant: 'cards' });
    sections.push({ title: 'Proof & Resources', routes: uniqueRoutes(['/case-studies/speed-to-lead/', '/case-studies/highlevel-crm-buildout/', '/guides/cold-calling-real-estate-wholesaling/', '/tools/cold-call-volume-calculator/', '/compare/best-cold-calling-va-companies/'], route, pages), variant: 'list' });
    return sections;
  }

  if (type === 'guides') {
    const sameCluster = sortBySitemapOrder((groups.get('guides') || []).filter(candidate => guideCluster(candidate) === guideCluster(route)), order);
    sections.push({ title: `${guideCluster(route)} Guides`, routes: uniqueRoutes([groupHubs.get(type), ...selectSiblings(route, sameCluster, order, 8)], route, pages), variant: 'cards' });
    const cross = guideCluster(route) === 'SMS Marketing'
      ? ['/ai-automations/', '/tools/sms-compliance-checker/', '/blog/sms-blast-real-estate-wholesaling/', '/apply/']
      : guideCluster(route) === 'HighLevel CRM'
        ? ['/crm/', '/case-studies/highlevel-crm-buildout/', '/tools/wholesale-deal-roi-calculator/', '/apply/']
        : guideCluster(route) === 'Hiring & VA Operations'
          ? ['/meet-your-va/', '/about/', '/compare/best-cold-calling-va-companies/', '/apply/']
          : ['/industries/real-estate/', '/tools/cold-call-volume-calculator/', '/case-studies/speed-to-lead/', '/apply/'];
    sections.push({ title: 'Next Steps', routes: uniqueRoutes(cross, route, pages), variant: 'list' });
    return sections;
  }

  if (type === 'blog') {
    sections.push({ title: 'More Blog Posts', routes: uniqueRoutes([groupHubs.get(type), ...selectSiblings(route, groups.get('blog') || [], order, 8)], route, pages), variant: 'cards' });
    sections.push({ title: 'Related Resources', routes: uniqueRoutes(blogCrossLinks(route), route, pages), variant: 'list' });
    return sections;
  }

  if (type === 'case-studies') {
    sections.push({ title: 'More Case Studies', routes: uniqueRoutes([groupHubs.get(type), ...sortBySitemapOrder((groups.get('case-studies') || []).filter(candidate => candidate !== route), order)], route, pages), variant: 'cards' });
    sections.push({ title: 'Services Behind These Results', routes: uniqueRoutes(['/industries/real-estate/', '/ai-automations/', '/crm/', '/meet-your-va/', '/apply/'], route, pages), variant: 'list' });
    return sections;
  }

  if (type === 'tools') {
    sections.push({ title: 'More Wholesaling Tools', routes: uniqueRoutes([groupHubs.get(type), ...sortBySitemapOrder((groups.get('tools') || []).filter(candidate => candidate !== route), order)], route, pages), variant: 'cards' });
    sections.push({ title: 'Use This With', routes: uniqueRoutes(toolCrossLinks(route), route, pages), variant: 'list' });
    return sections;
  }

  if (type === 'compare') {
    sections.push({ title: 'More Comparisons', routes: uniqueRoutes([groupHubs.get(type), ...sortBySitemapOrder((groups.get('compare') || []).filter(candidate => candidate !== route), order)], route, pages), variant: 'cards' });
    sections.push({ title: 'Evaluate VA Horizon', routes: uniqueRoutes(['/industries/real-estate/', '/meet-your-va/', '/case-studies/', '/apply/'], route, pages), variant: 'list' });
    return sections;
  }

  if (type === 'alternatives') {
    const siblings = (groups.get('alternatives') || []).filter(candidate => candidate !== route);
    sections.push({ title: 'More Alternatives', routes: uniqueRoutes([groupHubs.get(type), ...selectSiblings(route, siblings, order, 8)], route, pages), variant: 'cards' });
    sections.push({ title: 'Compare the System', routes: uniqueRoutes(['/compare/', '/industries/real-estate/', '/meet-your-va/', '/case-studies/', '/apply/'], route, pages), variant: 'list' });
    return sections;
  }

  if (type === 'locations') {
    sections.push({ title: 'More Cold Calling VA Markets', routes: uniqueRoutes(sortBySitemapOrder((groups.get('locations') || []).filter(candidate => candidate !== route), order), route, pages), variant: 'cards' });
    sections.push({ title: 'Start With VA Horizon', routes: uniqueRoutes(['/industries/real-estate/', '/case-studies/', '/guides/cold-calling-real-estate-wholesaling/', '/apply/'], route, pages), variant: 'list' });
    return sections;
  }

  if (type === 'glossary') {
    const siblings = (groups.get('glossary') || []).filter(candidate => candidate !== route);
    sections.push({ title: 'More Glossary Terms', routes: uniqueRoutes([groupHubs.get(type), ...selectSiblings(route, siblings, order, 8)], route, pages), variant: 'cards' });
    sections.push({ title: 'Put It Into Practice', routes: uniqueRoutes(['/industries/real-estate/', '/guides/cold-calling-real-estate-wholesaling/', '/tools/mao-calculator/', '/apply/'], route, pages), variant: 'list' });
    return sections;
  }

  if (type === 'solutions') {
    const siblings = (groups.get('solutions') || []).filter(candidate => candidate !== route);
    sections.push({ title: 'More Solutions', routes: uniqueRoutes([groupHubs.get(type), ...selectSiblings(route, siblings, order, 8)], route, pages), variant: 'cards' });
    sections.push({ title: 'Build the Team', routes: uniqueRoutes(['/industries/real-estate/', '/case-studies/', '/guides/hire-real-estate-va/', '/apply/'], route, pages), variant: 'list' });
    return sections;
  }

  if (type === 'services') {
    const siblings = (groups.get('services') || []).filter(candidate => candidate !== route);
    sections.push({ title: 'More Services', routes: uniqueRoutes([groupHubs.get(type), ...selectSiblings(route, siblings, order, 8)], route, pages), variant: 'cards' });
    sections.push({ title: 'Build the Team', routes: uniqueRoutes(['/industries/real-estate/', '/solutions/', '/case-studies/', '/apply/'], route, pages), variant: 'list' });
    return sections;
  }

  if (type === 'industries') {
    const siblings = (groups.get('industries') || []).filter(candidate => candidate !== route);
    sections.push({ title: 'More Industry Systems', routes: uniqueRoutes([groupHubs.get(type), ...selectSiblings(route, siblings, order, 8)], route, pages), variant: 'cards' });
    sections.push({ title: 'Services That Support This', routes: uniqueRoutes(['/services/', '/services/cold-calling/', '/services/lead-manager/', '/solutions/', '/case-studies/', '/apply/'], route, pages), variant: 'list' });
    return sections;
  }

  return sections;
}

function blogCrossLinks(route) {
  if (/(sms|blast)/.test(route)) {
    return ['/ai-automations/', '/guides/sms-blast-real-estate/', '/tools/sms-compliance-checker/', '/case-studies/speed-to-lead/', '/apply/'];
  }
  if (/(highlevel|crm)/.test(route)) {
    return ['/crm/', '/guides/highlevel-crm-wholesalers/', '/case-studies/highlevel-crm-buildout/', '/tools/wholesale-deal-roi-calculator/', '/apply/'];
  }
  if (/(cost|budget|startup)/.test(route)) {
    return ['/industries/real-estate/', '/tools/wholesaling-startup-budget-calculator/', '/tools/va-vs-in-house-cost-calculator/', '/compare/va-horizon-vs-in-house-va/', '/apply/'];
  }
  if (/(propstream|batchleads)/.test(route)) {
    return ['/guides/cold-calling-real-estate-wholesaling/', '/tools/mao-calculator/', '/tools/wholesale-deal-roi-calculator/', '/industries/real-estate/', '/apply/'];
  }
  return ['/industries/real-estate/', '/guides/hire-real-estate-va/', '/meet-your-va/', '/case-studies/va-replacement/', '/apply/'];
}

function toolCrossLinks(route) {
  if (route.includes('sms')) {
    return ['/ai-automations/', '/guides/a2p-10dlc-compliance-real-estate/', '/guides/sms-templates-real-estate-wholesaling/', '/apply/'];
  }
  if (route.includes('cold-call')) {
    return ['/industries/real-estate/', '/guides/cold-calling-real-estate-wholesaling/', '/case-studies/speed-to-lead/', '/apply/'];
  }
  if (route.includes('in-house')) {
    return ['/compare/va-horizon-vs-in-house-va/', '/meet-your-va/', '/industries/real-estate/', '/apply/'];
  }
  if (route.includes('budget')) {
    return ['/blog/wholesaling-real-estate-startup-budget/', '/guides/hire-real-estate-va/', '/industries/real-estate/', '/apply/'];
  }
  return ['/guides/cold-calling-real-estate-wholesaling/', '/blog/how-many-cold-calls-to-close-wholesale-deal/', '/industries/real-estate/', '/apply/'];
}

function renderInternalLinks(page, pages, groups, order) {
  const sections = buildSections(page, pages, groups, order);
  const globalRoutes = uniqueRoutes(primaryTargets, page.route, pages);
  const ctaRoute = page.route === '/apply/' ? '/industries/real-estate/' : '/apply/';
  const ctaLabel = page.route === '/apply/' ? 'Explore Real Estate VA Services' : 'Apply to Work With Us';

  const sectionHtml = sections
    .filter(section => section.variant === 'guide-groups' ? section.groups.length : section.routes.length)
    .map(section => section.variant === 'cards'
      ? renderLinkCards(section.title, section.routes, pages)
      : section.variant === 'guide-groups'
        ? renderGuideGroups(section.groups, pages)
      : renderLinkList(section.title, section.routes, pages))
    .join('\n\n    ');

  const globalHtml = renderLinkList('Explore VA Horizon', globalRoutes, pages);

  return `${internalStart}
<section class="bg-va-smoke py-12 border-t border-va-divider" aria-labelledby="vah-internal-links-heading">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="mb-8 max-w-3xl">
      <p class="text-xs font-extrabold uppercase tracking-[0.2em] text-va-gold">Internal resources</p>
      <h2 id="vah-internal-links-heading" class="mt-2 text-2xl font-black text-va-navy">Keep exploring VA Horizon</h2>
    </div>
    <div class="grid gap-10 lg:grid-cols-3">
      <div class="lg:col-span-2 space-y-10">
        ${sectionHtml}
      </div>
      <aside class="rounded-lg border border-va-divider bg-white p-6 shadow-sm">
        ${globalHtml}
        <a href="${ctaRoute}" class="mt-6 inline-flex w-full items-center justify-center rounded-md bg-va-gold px-5 py-3 text-sm font-extrabold text-va-navy transition hover:bg-va-navy hover:text-white">${ctaLabel}</a>
      </aside>
    </div>
  </div>
</section>
${internalEnd}`;
}

function removeManagedBlocks(html) {
  return html
    .replace(new RegExp(`${escapeRegExp(internalStart)}[\\s\\S]*?${escapeRegExp(internalEnd)}\\s*`, 'g'), '')
    .replace(new RegExp(`${escapeRegExp(breadcrumbStart)}[\\s\\S]*?${escapeRegExp(breadcrumbEnd)}\\s*`, 'g'), '')
    .replace(new RegExp(`${escapeRegExp(breadcrumbSchemaStart)}[\\s\\S]*?${escapeRegExp(breadcrumbSchemaEnd)}\\s*`, 'g'), '');
}

function removeVisibleBreadcrumbBlocks(html) {
  return html
    .replace(/<!--\s*Breadcrumb\s*-->\s*<div class="bg-va-smoke border-b border-va-divider py-3">[\s\S]*?<\/div>\s*<\/div>\s*/gi, '')
    .replace(/<div class="bg-va-smoke border-b border-va-divider py-3">\s*<div class="container mx-auto px-4 sm:px-6 lg:px-8">\s*<nav class="text-sm text-va-dark\/60" aria-label="Breadcrumb">[\s\S]*?<\/nav>\s*<\/div>\s*<\/div>\s*/gi, '')
    .replace(/<div class="bg-va-smoke border-b border-va-divider py-3">\s*<div class="container mx-auto px-4 sm:px-6 lg:px-8">\s*<nav class="text-sm text-va-dark\/60">[\s\S]*?<\/nav>\s*<\/div>\s*<\/div>\s*/gi, '')
    .replace(/<!--\s*[─\s]*Breadcrumb[─\s]*-->\s*<nav class="bg-va-smoke border-b border-va-divider py-3" aria-label="Breadcrumb">[\s\S]*?<\/nav>\s*/gi, '');
}

function normalizeExistingLinks(html, route) {
  if (!route.startsWith('/locations/')) return html;

  return html
    // Rewrite ONLY the bare /locations/ hub link (it has no index page); the hub
    // for location pages is /industries/real-estate/. Individual /locations/<slug>/
    // page URLs (canonical, og:url, breadcrumb item, Service url, sibling links)
    // must be preserved - they are where the pages actually live and what the
    // sitemap lists. The (?=["']) lookahead matches only the bare hub.
    .replace(/href=["']\/locations\/["']/gi, 'href="/industries/real-estate/"')
    .replace(/https:\/\/www\.vahorizon\.site\/locations\/(?=["'])/gi, 'https://www.vahorizon.site/industries/real-estate/')
    .replace(/>Locations<\/a>/g, '>Real Estate VAs</a>')
    .replace(/"name"\s*:\s*"Locations"/g, '"name": "Real Estate VAs"');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasVisibleBreadcrumb(html) {
  return /aria-label=["']Breadcrumb["']/i.test(html) || /<!--\s*Breadcrumb\s*-->[\s\S]{0,1500}<nav\b/i.test(html);
}

function hasBreadcrumbSchema(html) {
  return /"@type"\s*:\s*"BreadcrumbList"/i.test(html);
}

function insertAfterMainStart(html, snippet) {
  if (!snippet) return html;
  if (/<main\b[^>]*>/i.test(html)) {
    return html.replace(/<main\b[^>]*>/i, match => `${match}\n${snippet}\n`);
  }
  if (/<body\b[^>]*>/i.test(html)) {
    return html.replace(/<body\b[^>]*>/i, match => `${match}\n${snippet}\n`);
  }
  return `${snippet}\n${html}`;
}

function insertBeforeMainEnd(html, snippet) {
  if (/<\/main>/i.test(html)) {
    return html.replace(/<\/main>/i, `${snippet}\n</main>`);
  }
  if (/<footer\b/i.test(html)) {
    return html.replace(/<footer\b/i, `${snippet}\n<footer`);
  }
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${snippet}\n</body>`);
  }
  return `${html}\n${snippet}`;
}

function insertBeforeHeadEnd(html, snippet) {
  if (!snippet) return html;
  if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, `${snippet}\n</head>`);
  return `${snippet}\n${html}`;
}

function extractInternalLinks(html) {
  const links = new Set();

  for (const match of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)) {
    const href = match[1];
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || /^https?:\/\//i.test(href)) continue;
    const route = normalizeRoute(href);
    if (route) links.add(route);
  }

  return links;
}

function buildGraph(pages, htmlByRoute) {
  const graph = new Map([...pages.keys()].map(route => [route, { inbound: new Set(), outbound: new Set() }]));

  for (const route of pages.keys()) {
    const links = extractInternalLinks(htmlByRoute.get(route) || '');
    for (const link of links) {
      if (!pages.has(link) || link === route) continue;
      graph.get(route).outbound.add(link);
      graph.get(link).inbound.add(route);
    }
  }

  return graph;
}

function summarizeGraph(graph) {
  const orphanPages = [];
  const lowInboundPages = [];
  const zeroOutboundPages = [];

  for (const [route, node] of graph.entries()) {
    if (route !== '/' && node.inbound.size === 0) orphanPages.push(route);
    if (route !== '/' && node.inbound.size < minInboundLinks) lowInboundPages.push(`${route} (${node.inbound.size})`);
    if (node.outbound.size === 0) zeroOutboundPages.push(route);
  }

  return { orphanPages, lowInboundPages, zeroOutboundPages };
}

async function loadSitemapRoutes() {
  const xml = await fs.readFile(sitemapPath, 'utf8');
  return [...xml.matchAll(/<loc>\s*https:\/\/www\.vahorizon\.site([^<]+)\s*<\/loc>/g)]
    .map(match => normalizeRoute(match[1]))
    .filter(Boolean);
}

async function assertRoutesExist(routes) {
  const missing = [];

  for (const route of routes) {
    try {
      await fs.access(routeToSourceFile(route));
    } catch {
      missing.push(`${route} -> ${toPosix(path.relative(rootDir, routeToSourceFile(route)))}`);
    }
  }

  if (missing.length) {
    throw new Error(`Sitemap routes are missing source HTML files:\n${missing.join('\n')}`);
  }
}

function buildGroups(routes) {
  const groups = new Map([
    ['blog', []],
    ['guides', []],
    ['case-studies', []],
    ['tools', []],
    ['compare', []],
    ['alternatives', []],
    ['glossary', []],
    ['solutions', []],
    ['services', []],
    ['industries', []],
    ['locations', []],
  ]);

  for (const route of routes) {
    const type = classifyRoute(route);
    if (groups.has(type)) groups.get(type).push(route);
  }

  return groups;
}

async function main() {
  const routes = await loadSitemapRoutes();
  await assertRoutesExist(routes);

  const order = new Map(routes.map((route, index) => [route, index]));
  const originalHtml = new Map();
  const pages = new Map();

  for (const route of routes) {
    const filePath = routeToSourceFile(route);
    const html = await fs.readFile(filePath, 'utf8');
    originalHtml.set(route, html);
    pages.set(route, {
      route,
      filePath,
      label: fixedLabels.get(route) || extractTitle(html, route),
    });
  }

  const groups = buildGroups(routes);
  const beforeGraph = buildGraph(pages, originalHtml);
  const beforeSummary = summarizeGraph(beforeGraph);

  let changedPages = 0;
  let breadcrumbsAdded = 0;
  let breadcrumbSchemasAdded = 0;
  let modulesUpdated = 0;
  const updatedHtml = new Map();

  for (const page of pages.values()) {
    const before = originalHtml.get(page.route);
    let next = normalizeExistingLinks(removeVisibleBreadcrumbBlocks(removeManagedBlocks(before)), page.route);

    const hadBreadcrumb = hasVisibleBreadcrumb(next);
    const hadSchema = hasBreadcrumbSchema(next);

    if (!hadSchema && page.route !== '/') {
      next = insertBeforeHeadEnd(next, renderBreadcrumbSchema(page.route, pages));
      breadcrumbSchemasAdded += 1;
    }

    if (!hadBreadcrumb && page.route !== '/' && page.route !== '/ai-automations/') {
      next = insertAfterMainStart(next, renderBreadcrumb(page.route, pages));
      breadcrumbsAdded += 1;
    }

    next = insertBeforeMainEnd(next, renderInternalLinks(page, pages, groups, order));
    modulesUpdated += 1;

    updatedHtml.set(page.route, next);

    if (next !== before) {
      await fs.writeFile(page.filePath, next, 'utf8');
      changedPages += 1;
    }
  }

  const afterGraph = buildGraph(pages, updatedHtml);
  const afterSummary = summarizeGraph(afterGraph);

  console.log(`Internal linking generator processed ${pages.size} canonical pages.`);
  console.log(`Changed pages: ${changedPages}`);
  console.log(`Breadcrumbs added: ${breadcrumbsAdded}`);
  console.log(`Breadcrumb schemas added: ${breadcrumbSchemasAdded}`);
  console.log(`Managed link modules updated: ${modulesUpdated}`);
  console.log(`Orphan pages before: ${beforeSummary.orphanPages.length}`);
  console.log(`Orphan pages after: ${afterSummary.orphanPages.length}`);
  console.log(`Pages below ${minInboundLinks} inbound links after: ${afterSummary.lowInboundPages.length}`);

  if (afterSummary.orphanPages.length) {
    console.log(`Orphans after: ${afterSummary.orphanPages.join(', ')}`);
  }

  if (afterSummary.lowInboundPages.length) {
    console.log(`Low inbound pages after: ${afterSummary.lowInboundPages.join(', ')}`);
  }

  if (afterSummary.zeroOutboundPages.length) {
    console.log(`Zero outbound pages after: ${afterSummary.zeroOutboundPages.join(', ')}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
