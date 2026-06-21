import type { APIRoute } from 'astro';
import { SITE_URL, SLUGS } from '../lib/site';

// Build-time sitemap so <lastmod> is always the build date (never drifts), while
// keeping curated priorities. Served at /sitemap.xml; robots.txt + JSON-LD point here.
const lastmod = new Date().toISOString().split('T')[0];

// path -> [priority, changefreq]
const meta: Record<string, [string, string]> = {
  [SLUGS.home]: ['1.0', 'weekly'],
  [SLUGS.flagModel]: ['0.9', 'monthly'],
  [SLUGS.breakPointAssessment]: ['0.9', 'monthly'],
  [SLUGS.costCalculator]: ['0.9', 'monthly'],
  [SLUGS.elfs]: ['0.8', 'monthly'],
  [SLUGS.about]: ['0.8', 'monthly'],
  [SLUGS.resources]: ['0.8', 'weekly'],
  [SLUGS.fieldNotes]: ['0.8', 'weekly'],
  [SLUGS.research]: ['0.8', 'yearly'],
  [SLUGS.caseStudies]: ['0.7', 'monthly'],
  [SLUGS.glossary]: ['0.7', 'monthly'],
  [SLUGS.privacy]: ['0.3', 'yearly'],
};
const DEFAULT: [string, string] = ['0.7', 'monthly'];

export const GET: APIRoute = () => {
  const urls = Object.values(SLUGS)
    .map((path) => {
      const [priority, changefreq] = meta[path] ?? DEFAULT;
      return `  <url><loc>${SITE_URL}${path}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
