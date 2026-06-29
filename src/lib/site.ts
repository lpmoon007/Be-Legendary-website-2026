// Be Legendary — central site constants.
// Single source of truth for the CTA, HubSpot wiring, and the slug map that
// every internal link resolves through (design files used flat .dc.html names).

export const SITE_URL = 'https://www.belegendary.org';
export const CTA_URL = 'https://meetings.hubspot.com/jcarter28';
export const CTA_LABEL = 'Book a Calibration Call';

// GA4 Measurement ID. Not a secret (it ships in the client). Override per-build
// with the PUBLIC_GA_ID env var if needed; otherwise this baked-in value is used.
export const GA_MEASUREMENT_ID = import.meta.env.PUBLIC_GA_ID || 'G-M0Q17HCKMM';

// HubSpot forms (region na2, portal 20276071)
export const HUBSPOT = {
  portalId: '20276071',
  region: 'na2',
  breakPointFormGuid: '8e01345a-ccef-43b8-8598-e3bb6d7397f1',
  newsletterFormGuid: 'f744639b-16b8-4f45-a141-1637e135cdc7',
};

// Production slug map: design-file name -> route.
export const SLUGS = {
  home: '/',
  flagModel: '/flag-model/',
  about: '/about/james-carter/',
  breakPointAssessment: '/break-point-self-assessment/',
  costCalculator: '/cost-of-lost-disciplines-calculator/',
  research: '/state-of-executive-team-execution/',
  caseStudies: '/case-studies/',
  elfs: '/elfs/',
  glossary: '/glossary/',
  resources: '/resources/',
  fieldNotes: '/field-notes/',
  // Field Notes cluster
  whyNotExecuting: '/why-isnt-my-executive-team-executing/',
  wontDecide: '/leadership-team-wont-make-decisions-without-me/',
  initiativesNeverFinish: '/executive-team-initiatives-never-finish/',
  noAccountability: '/executive-team-no-accountability/',
  notAligned: '/executive-team-not-aligned/',
  sameMistakes: '/team-keeps-making-same-mistakes/',
  offsitesDontStick: '/why-leadership-offsites-dont-stick/',
  eosOkrs: '/eos-okrs-didnt-change-behavior/',
  // Comparisons
  vs4dx: '/flag-model-vs-4dx/',
  vsFiveDysfunctions: '/flag-model-vs-five-dysfunctions/',
  vsCoaching: '/flag-model-vs-executive-coaching/',
  // Buyer's guides
  alignmentConsultant: '/executive-team-alignment-consultant/',
  offsiteFacilitator: '/leadership-team-offsite-facilitator/',
  coachingCost: '/executive-team-coaching-cost/',
  // The Library (individual-leader content cluster)
  library: '/library/',
  mindset: '/library/mindset-of-a-legend/',
  goldenBuddha: '/library/the-golden-buddha/',
  roadmap: '/library/roadmap-to-legendary/',
  legendaryIntent: '/library/legendary-intent/',
  // Legal
  privacy: '/privacy/',
} as const;

// Sister sites (followed editorial cross-links, NOT nofollow — they pass authority)
export const SISTER = {
  retreats: 'https://www.legendary-retreats.com',
  buildingTeams: 'https://www.buildingteams.com',
  lpi: 'https://www.legendaryperformanceinstitute.com',
};

// ── Canonical entity nodes (GEO/E-E-A-T) ─────────────────────────────────────
// Stable @ids so every page's JSON-LD resolves the same Organization, founder
// Person, and WebSite. Injected on inner pages by BaseLayout; the homepage
// defines the full versions itself.
export const ORG_ID = `${SITE_URL}/#org`;
export const PERSON_ID = `${SITE_URL}/#james`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const ORG_NODE = {
  '@type': ['Organization', 'ProfessionalService'],
  '@id': ORG_ID,
  name: 'Be Legendary',
  alternateName: 'Repario',
  url: `${SITE_URL}/`,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/favicon-snail.png`, width: 512, height: 512 },
  image: `${SITE_URL}/assets/share-card.png`,
  description: 'An executive-team diagnostic and performance firm. We rebuild the disciplines of the Flag Model that turn a stalled leadership team into one that executes.',
  founder: { '@id': PERSON_ID },
  foundingDate: '2010',
  areaServed: 'US',
  sameAs: ['https://www.buildingteams.com/', 'https://www.legendary-retreats.com/', 'https://www.amazon.com/stores/James-Carter/author/B009FAZ2NG'],
};

export const PERSON_NODE = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'James Carter',
  jobTitle: 'Founder, Be Legendary',
  url: `${SITE_URL}/about/james-carter/`,
  worksFor: { '@id': ORG_ID },
  sameAs: ['https://www.linkedin.com/in/jlcarter/', 'https://www.buildingteams.com/about/james-carter/', 'https://www.amazon.com/stores/James-Carter/author/B009FAZ2NG'],
};

export const WEBSITE_NODE = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: 'Be Legendary',
  publisher: { '@id': ORG_ID },
};

