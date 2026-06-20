import { promises as fs } from 'fs';
import path from 'path';

const targets = [
  'guides/a2p-10dlc-registration-highlevel',
  'guides/carrier-filtering-real-estate-sms',
  'guides/cold-calling-real-estate-wholesaling',
  'guides/cold-calling-scripts-real-estate-wholesaling',
  'guides/dialer-setup-real-estate-wholesalers',
  'guides/highlevel-custom-fields-wholesalers',
  'guides/highlevel-reporting-dashboard-wholesalers',
  'guides/highlevel-sms-sequences-real-estate',
  'guides/sms-blast-real-estate',
  'guides/sms-blast-response-rates-real-estate',
  'guides/sms-drip-campaigns-wholesalers',
  'guides/sms-templates-real-estate-wholesaling',
  'guides/sms-vs-cold-calling-real-estate',
  'guides/voicemail-strategy-real-estate-cold-calling',
  'guides/cold-calling-va-turnover-backup-coverage',
  'blog/ai-vs-human-cold-calling-real-estate-wholesaling',
];

function stripTags(html) {
  return html
    .replace(/<span[^>]*class="[^"]*faq-icon[^"]*"[^>]*>[\s\S]*?<\/span>/gi, '')
    .replace(/<span[^>]*>\s*\+\s*<\/span>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#10003;/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '-')
    .replace(/&ndash;/g, '-')
    .replace(/&bull;/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

let report = [];

for (const rel of targets) {
  const file = path.join(process.cwd(), rel, 'index.html');
  const html = await fs.readFile(file, 'utf8');

  const detailsBlocks = [...html.matchAll(/<details\b[^>]*>([\s\S]*?)<\/details>/gi)];
  if (detailsBlocks.length === 0) {
    report.push(`SKIP (no <details>): ${rel}`);
    continue;
  }

  const qa = [];
  for (const m of detailsBlocks) {
    const block = m[1];
    const summaryMatch = block.match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/i);
    if (!summaryMatch) continue;
    const question = stripTags(summaryMatch[1]);
    const rest = block.slice(summaryMatch.index + summaryMatch[0].length);
    const answer = stripTags(rest);
    if (question && answer) qa.push({ question, answer });
  }

  if (qa.length === 0) {
    report.push(`SKIP (no parsable Q&A): ${rel}`);
    continue;
  }

  const scriptMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!scriptMatch) {
    report.push(`SKIP (no JSON-LD found): ${rel}`);
    continue;
  }

  let data;
  try {
    data = JSON.parse(scriptMatch[1]);
  } catch (e) {
    report.push(`SKIP (JSON parse error): ${rel} - ${e.message}`);
    continue;
  }

  if (!Array.isArray(data['@graph'])) {
    report.push(`SKIP (no @graph array): ${rel}`);
    continue;
  }

  if (data['@graph'].some(node => node['@type'] === 'FAQPage')) {
    report.push(`SKIP (already has FAQPage): ${rel}`);
    continue;
  }

  const faqPage = {
    '@type': 'FAQPage',
    mainEntity: qa.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  data['@graph'].push(faqPage);

  const newJson = JSON.stringify(data, null, 1);
  const newHtml = html.replace(scriptMatch[0], `<script type="application/ld+json">\n${newJson}\n</script>`);

  await fs.writeFile(file, newHtml, 'utf8');
  report.push(`OK (${qa.length} Q&A added): ${rel}`);
}

console.log(report.join('\n'));
