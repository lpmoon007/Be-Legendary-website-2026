import type { APIRoute } from 'astro';
import { SITE_URL, SLUGS, WORKOUTS, workoutPath } from '../lib/site';

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
  [SLUGS.glossary]: ['0.7', 'monthly'],
  [SLUGS.privacy]: ['0.3', 'yearly'],
  // For Leaders hubs + flagship
  [SLUGS.leaders]: ['0.9', 'weekly'],
  [SLUGS.workouts]: ['0.9', 'weekly'],
  [SLUGS.challenge]: ['0.8', 'monthly'],
  [SLUGS.leadersGlossary]: ['0.7', 'monthly'],
  [SLUGS.legendaryLeader]: ['0.8', 'monthly'],
  [SLUGS.executiveTeamBuilding]: ['0.8', 'monthly'],
};
const DEFAULT: [string, string] = ['0.7', 'monthly'];

// Retreats (and the experiential days, retreat guides and retreat case studies)
// moved to legendary-retreats.com on 2026-10-17. Their slugs still exist in SLUGS
// so in-page references resolve to the belegendary.org path, which 301s to the new
// domain via public/.htaccess — but those paths must NOT appear in this sitemap
// (they return a 301, not a 200). Excluded by value below.
const MOVED_TO_RETREATS = new Set<string>([
  SLUGS.teamRetreats, SLUGS.destinations, SLUGS.retreatFormats, SLUGS.waysToWorkTogether,
  SLUGS.forExecutiveAssistants,
  SLUGS.caseStudies, SLUGS.caseAutoRetailer, SLUGS.caseSanJuan, SLUGS.caseEverglades,
  SLUGS.caseFederalFiscal, SLUGS.caseAlaska,
  SLUGS.sailingTeamBuilding, SLUGS.offRoadImmersion, SLUGS.retreatKit,
  SLUGS.corporateRetreatIdeas, SLUGS.executiveOffsiteIdeas, SLUGS.leadershipRetreatIdeas,
  SLUGS.luxuryExecutiveRetreat,
  SLUGS.executiveImmersion, SLUGS.eiExpedition, SLUGS.eiCity, SLUGS.eiOwnership,
  SLUGS.eiCityNeverSleeps,
  SLUGS.howToPlanRetreat, SLUGS.offsiteAgenda, SLUGS.executiveOffsite,
  SLUGS.offsiteFacilitator, SLUGS.offsitesDontStick,
]);

// Lost Disciplines of Leadership book launch site (hosted at /lost-disciplines/).
const BOOK_PATHS = [
  '/lost-disciplines/',
  '/lost-disciplines/the-book/',
  '/lost-disciplines/about-james/',
  '/lost-disciplines/praise/',
  '/lost-disciplines/bulk-and-speaking/',
];
const BOOK_META: Record<string, [string, string]> = {
  '/lost-disciplines/': ['0.8', 'weekly'],
  '/lost-disciplines/the-book/': ['0.7', 'monthly'],
  '/lost-disciplines/about-james/': ['0.6', 'monthly'],
  '/lost-disciplines/praise/': ['0.5', 'monthly'],
  '/lost-disciplines/bulk-and-speaking/': ['0.5', 'monthly'],
};

export const GET: APIRoute = () => {
  // All SLUGS routes + the 18 workout pages, de-duplicated (SLUGS.library aliases
  // /leaders/). Sorted so the output is stable across builds.
  const paths = Array.from(
    new Set([...Object.values(SLUGS), ...WORKOUTS.map(workoutPath), ...BOOK_PATHS])
  )
    // Exclude the challenge app (SLUGS.challenge is the absolute app URL, not a
    // canonical 200 page on this host) and every path that now 301s to
    // legendary-retreats.com, so the sitemap stays clean (200s only).
    .filter((p) => p !== SLUGS.challenge && !MOVED_TO_RETREATS.has(p))
    .sort();
  const urls = paths
    .map((path) => {
      const [priority, changefreq] = BOOK_META[path] ?? meta[path] ?? DEFAULT;
      return `  <url><loc>${SITE_URL}${path}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
