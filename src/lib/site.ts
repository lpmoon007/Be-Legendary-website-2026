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
  // ── For Leaders universe (individual-leader development) ──────────────────
  // /leaders/ is the canonical home. The 4 concept pages migrated from /library/
  // (design intent), with 301s in public/.htaccess.
  leaders: '/leaders/',
  mindset: '/leaders/mindset-of-a-legend/',
  goldenBuddha: '/leaders/the-golden-buddha/',
  roadmap: '/leaders/roadmap-to-legendary/',
  legendaryIntent: '/leaders/legendary-intent/',
  // The Mindset Workouts "gym"
  workouts: '/leaders/workouts/',
  challenge: '/leaders/30-day-challenge/',
  leadersGlossary: '/leaders/glossary/',
  // SEO/GEO clusters under /leaders/
  habitStacking: '/leaders/what-is-habit-stacking/',
  howToBuildHabit: '/leaders/how-to-build-a-habit/',
  implementationIntentions: '/leaders/implementation-intentions/',
  whyHabitsFail: '/leaders/why-habits-fail/',
  leadVsLag: '/leaders/lead-vs-lag-measures/',
  whatIsKintsugi: '/leaders/what-is-kintsugi/',
  goldenBuddhaStory: '/leaders/the-golden-buddha-story/',
  whatIsShakubuku: '/leaders/what-is-shakubuku/',
  abcsOfMindset: '/leaders/abcs-of-mindset/',
  whatIsMisogi: '/leaders/what-is-a-misogi/',
  legendaryLeader: '/leaders/the-legendary-leader/',
  actionableCoaching: '/leaders/actionable-coaching/',
  gratitude: '/leaders/gratitude/',
  legendsJourney: '/leaders/workouts/legends-journey/',
  // Leader SEO/GEO cluster — leadership definitional + recharge/retreat (individual)
  whatIsExecutiveCoaching: '/leaders/what-is-executive-coaching/',
  whatIsLeadership: '/leaders/what-is-leadership/',
  whatMakesGoodLeader: '/leaders/what-makes-a-good-leader/',
  leadershipQualities: '/leaders/leadership-qualities/',
  improveLeadershipSkills: '/leaders/improve-leadership-skills/',
  leadershipPlateau: '/leaders/leadership-plateau/',
  executiveImposterSyndrome: '/leaders/executive-imposter-syndrome/',
  successfulButUnfulfilled: '/leaders/successful-but-unfulfilled/',
  whatsNextAfterSuccess: '/leaders/whats-next-after-success/',
  whoAmIWithoutTitle: '/leaders/who-am-i-without-my-title/',
  executiveBurnoutRetreat: '/leaders/executive-burnout-retreat/',
  stressManagementRetreat: '/leaders/stress-management-retreat/',
  wildernessTherapy: '/leaders/wilderness-therapy-for-executives/',
  whereExecutivesRecharge: '/leaders/where-executives-recharge/',
  type2Fun: '/leaders/type-2-fun/',

  // ── For Teams — retreats, diagnostic, and team-side SEO (/teams/…) ─────────
  teamRetreats: '/teams/retreats/',
  destinations: '/teams/retreats/destinations/',
  retreatFormats: '/teams/retreats/formats/',
  waysToWorkTogether: '/teams/retreats/ways-to-work-together/',
  forExecutiveAssistants: '/teams/retreats/for-executive-assistants/',
  teamDiagnostic: '/teams/diagnostic/',
  followership: '/teams/followership/',
  corporateRetreatIdeas: '/teams/corporate-retreat-ideas/',
  executiveOffsiteIdeas: '/teams/executive-offsite-ideas/',
  leadershipRetreatIdeas: '/teams/leadership-retreat-ideas/',
  luxuryExecutiveRetreat: '/teams/luxury-executive-retreat/',

  // Legacy Library alias → the For Leaders home (old /library/ 301s here).
  library: '/leaders/',
  // Legal
  privacy: '/privacy/',
} as const;

// The live 30-Day Challenge app (separate Next.js app on Vercel).
export const CHALLENGE_URL = 'https://challenge.belegendary.org';

// Workout gym slug → canonical route.
export const workoutPath = (slug: string) => `/leaders/workouts/${slug}/`;

// The 18 Mindset Workouts (canonical slugs) — used for the sitemap + any listing.
export const WORKOUTS = [
  'go-for-it', 'mindset-of-a-legend', '5-whys', 'big-rocks', 'choices',
  'count-your-blessings', 'design-your-misogi', 'find-your-why', 'kintsugi-wabi-sabi',
  'legendary-intent', 'let-go-of-negativity', 'making-change-stick', 'pre-mortem',
  'sit-down-shut-up-learn', 'the-golden-buddha', 'villain-or-hero', 'what-the-beep',
  'whats-your-story',
] as const;

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

