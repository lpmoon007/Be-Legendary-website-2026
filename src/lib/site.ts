// Be Legendary — central site constants.
// Single source of truth for the CTA, HubSpot wiring, and the slug map that
// every internal link resolves through (design files used flat .dc.html names).

export const SITE_URL = 'https://www.belegendary.org';
// Site CTAs point at the on-domain /book/ page (which embeds the scheduler with
// our reassurance copy) instead of throwing visitors straight to HubSpot.
export const CTA_URL = '/book/';
export const CTA_LABEL = 'Book a free 15-minute call';

// The real HubSpot Meetings scheduler (region na2). Embedded on /book/, and used
// where an off-domain booking link is genuinely needed (generated PDFs, the
// Organization contactPoint in schema).
export const BOOKING_URL = 'https://meetings-na2.hubspot.com/jcarter28';

// Public contact address — used for the footer/privacy contact path and as the
// mailto fallback when a form's HubSpot POST fails or a GUID isn't wired yet, so
// a lead is never silently lost. Swap for a shared alias (e.g. hello@) if preferred.
export const CONTACT_EMAIL = 'jcarter@belegendary.org';

// GA4 Measurement ID. Not a secret (it ships in the client). Override per-build
// with the PUBLIC_GA_ID env var if needed; otherwise this baked-in value is used.
export const GA_MEASUREMENT_ID = import.meta.env.PUBLIC_GA_ID || 'G-M0Q17HCKMM';

// Microsoft Clarity project ID (free heatmaps + session recordings). Not a
// secret (ships client-side). Loaded lazily by Analytics.astro on first
// interaction/idle. Override per-build with PUBLIC_CLARITY_ID if needed.
export const CLARITY_ID = import.meta.env.PUBLIC_CLARITY_ID || 'xp6res7ssv';

// HubSpot forms (region na2, portal 20276071)
export const HUBSPOT = {
  portalId: '20276071',
  region: 'na2',
  breakPointFormGuid: '8e01345a-ccef-43b8-8598-e3bb6d7397f1',
  newsletterFormGuid: 'f744639b-16b8-4f45-a141-1637e135cdc7',
  // ── Lost Disciplines book launch ──
  // Waitlist / free first chapter (email only) → the dedicated HubSpot
  // "Lost Disciplines Chapter Download" form. Its follow-up (chapter email /
  // workflow) is configured in HubSpot, so a successful submit triggers delivery.
  ldolWaitlistFormGuid: 'a74b3d8b-2e1a-48fc-95d9-712b6ae3781f',
  // Bulk/Speaking enquiry: needs a form with fields email, firstname, company,
  // message, intent. Create it in HubSpot and paste the GUID here to go live.
  // While empty, the form still confirms to the user but does not POST.
  ldolEnquiryFormGuid: '',
  // Contact page "send a message" form — rendered via the HubSpot embed
  // script on /contact/, so fields/validation/workflows are whatever is
  // configured in HubSpot for this form.
  contactFormGuid: 'bad3be34-c7d6-4d32-933c-508ecb972054',
  // Complete Retreat Planning Kit lead magnet (embedded on /retreat-planning-kit/).
  // Submit triggers the HubSpot follow-up workflow that emails the ungated
  // download link (RETREAT_KIT_URL below). The download itself is not gated —
  // the form only captures the lead so the link can be sent + tracked.
  retreatKitFormGuid: 'c4bf79e3-be0f-4cdb-ac08-d3f2a146f949',
};

// Direct, ungated download for the Complete Retreat Planning Kit. Lives in the
// repo at public/assets/downloads/ so it ships with the static build. Keep this
// path STABLE — it's baked into the emailed link and any on-site download button.
export const RETREAT_KIT_URL = '/assets/downloads/complete-retreat-planning-kit.pdf';

// Direct-download URL for the free first chapter. Empty until the PDF is
// uploaded (e.g. to public/assets/ldol-first-chapter.pdf → '/assets/ldol-first-chapter.pdf').
// When set, the waitlist success state shows a "Download the first chapter" link.
export const LDOL_CHAPTER_URL = '';

// Production slug map: design-file name -> route.
export const SLUGS = {
  home: '/',
  flagModel: '/flag-model/',
  roadmapToSuccess: '/roadmap-to-success/',
  discoverInnerStrength: '/discover-your-inner-strength/',
  aboutIndex: '/about/',
  about: '/about/james-carter/',
  contact: '/contact/',
  breakPointAssessment: '/break-point-self-assessment/',
  costCalculator: '/cost-of-lost-disciplines-calculator/',
  research: '/state-of-executive-team-execution/',
  caseStudies: '/case-studies/',
  // Retreat case studies ported from the legendary-retreats.com handoff. Slugs
  // match the old URLs so the cross-domain 301s recover their search equity.
  caseAutoRetailer: '/case-studies/online-auto-retailer-leadership-team/',
  caseSanJuan: '/case-studies/san-juan-mountains-work-ethic/',
  caseEverglades: '/case-studies/everglades-abundance-mindset/',
  caseFederalFiscal: '/case-studies/federal-fiscal-leadership-team/',
  caseAlaska: '/case-studies/alaska-executive-vulnerability/',
  howWeWorkTogether: '/how-we-work-together/',
  pricing: '/pricing/',
  elfs: '/elfs/',
  glossary: '/glossary/',
  resources: '/resources/',
  fieldNotes: '/field-notes/',
  researchNotes: '/research-notes/',
  press: '/press/',
  // Field Notes cluster
  feedbackVacuum: '/field-notes/the-feedback-vacuum/',
  feedbackVacuumWhat: '/field-notes/what-is-the-feedback-vacuum/',
  truthStopsTraveling: '/field-notes/why-my-team-tells-me-what-i-want-to-hear/',
  crisisBrief: '/executive-team-crisis-brief/',
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
  vsEos: '/flag-model-vs-eos/',
  vsOkrs: '/flag-model-vs-okrs/',
  vsScalingUp: '/flag-model-vs-scaling-up/',
  // Buyer's guides
  alignmentConsultant: '/executive-team-alignment-consultant/',
  offsiteFacilitator: '/leadership-team-offsite-facilitator/',
  coachingCost: '/executive-team-coaching-cost/',
  // How-to guides (bottom-funnel, mapped to the four disciplines)
  howToAccountable: '/how-to-hold-your-leadership-team-accountable/',
  executiveTeamMeeting: '/how-to-run-an-executive-team-meeting/',
  boardMeeting: '/how-to-run-a-board-meeting/',
  decisionMaking: '/executive-team-decision-making/',
  highPerformingTeam: '/how-to-build-a-high-performing-leadership-team/',
  strategyExecutionGap: '/strategy-execution-gap/',
  alignLeadershipTeam: '/how-to-align-a-leadership-team/',
  howToPlanRetreat: '/how-to-plan-a-leadership-retreat/',
  offsiteAgenda: '/leadership-offsite-agenda/',
  executiveOffsite: '/how-to-plan-an-executive-offsite/',
  measureTeamPerformance: '/how-to-measure-leadership-team-performance/',
  signsDysfunction: '/signs-of-a-dysfunctional-leadership-team/',
  meetingAgenda: '/leadership-team-meeting-agenda/',
  leadershipScorecard: '/leadership-scorecard/',
  coachingQuestions: '/leadership-coaching-questions/',
  fixDysfunctionalTeam: '/how-to-fix-a-dysfunctional-leadership-team/',
  disagreeAndCommit: '/disagree-and-commit/',
  setPriorities: '/how-to-set-leadership-team-priorities/',
  // Consolidated off-road immersion (was two near-duplicate geo pages, Denver +
  // Sedona, now one location-neutral page; both old URLs 301 here via .htaccess).
  offRoadImmersion: '/executive-off-road-immersion/',
  // Lead-magnet landing page — embeds the HubSpot form that delivers the
  // Complete Retreat Planning Kit download link by email.
  retreatKit: '/retreat-planning-kit/',
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
  // Links straight to the challenge app so no page takes a 301 hop through the
  // branded /leaders/30-day-challenge/ path (which still 301s to this URL via
  // .htaccess for any legacy/shared inbound links). Absolute-by-design: the
  // sitemap builder filters this value out (it's not a canonical 200 page).
  challenge: 'https://challenge.belegendary.org/',
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

  // ── For Teams — hub, retreats, diagnostic, and team-side SEO (/teams/…) ────
  teams: '/teams/',
  // Hub that captures "executive team building / offsite" search demand and
  // reframes it toward the serious diagnostic offering (buildingteams.com/
  // executive-team-building/ 301s here). Deliberately NOT in the header nav.
  executiveTeamBuilding: '/executive-team-building/',
  // Sailing spoke off the executive-team-building hub — executive sailing on
  // San Francisco Bay, reframed as a behavioral laboratory (not an event).
  sailingTeamBuilding: '/sailing-team-building/',
  // Sibling hub to executive-team-building, targeting the "executive team
  // development" cluster (programs / coaching / plan). Differentiated: building
  // = the intervention/experience; development = the ongoing, evidence-based
  // process of building the team's collective capability. Evidence-anchored.
  executiveTeamDevelopment: '/executive-team-development/',
  teamRetreats: '/teams/retreats/',
  destinations: '/teams/retreats/destinations/',
  retreatFormats: '/teams/retreats/formats/',
  waysToWorkTogether: '/teams/retreats/ways-to-work-together/',
  forExecutiveAssistants: '/teams/retreats/for-executive-assistants/',
  briefYourPrincipal: '/brief-your-principal/',
  // The canonical Team LFS page — the instrumented, measured read on the team
  // (behavioral simulation). Was /teams/diagnostic/, 301'd in public/.htaccess.
  teamLfs: '/teams/team-lfs/',
  followership: '/teams/followership/',
  corporateRetreatIdeas: '/teams/corporate-retreat-ideas/',
  executiveOffsiteIdeas: '/teams/executive-offsite-ideas/',
  leadershipRetreatIdeas: '/teams/leadership-retreat-ideas/',
  luxuryExecutiveRetreat: '/teams/luxury-executive-retreat/',
  // ── Executive Immersion — a single engineered day, built from the same logic
  // as a retreat but compressed into one impossible-feeling mission. Hub +
  // three format pages (Expedition / City / Ownership). Ported from the
  // legendary-retreats handoff. Category is "Executive Immersion"; the format
  // at its center is "One Crazy Day". (The Reno day was "Systems" in the
  // handoff, renamed to "Ownership".)
  executiveImmersion: '/teams/executive-immersion/',
  eiExpedition: '/teams/executive-immersion/expedition/',
  eiCity: '/teams/executive-immersion/city/',
  eiOwnership: '/teams/executive-immersion/ownership/',
  // "The City Never Sleeps" — the larger command-center city simulation,
  // illustrated with the six NYC renders. A distinct format from the City day.
  eiCityNeverSleeps: '/teams/executive-immersion/the-city-never-sleeps/',

  // Legacy Library alias → the For Leaders home (old /library/ 301s here).
  library: '/leaders/',
  search: '/search/',
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
export const OFFERCATALOG_ID = `${SITE_URL}/#offercatalog`;

// Public-facing offerings only (GEO / entity understanding). Deliberately
// excludes the confidential diagnostic audit and the behind-the-trust-wall
// advisory (Performance Partnership, Discipline Sprint) — those stay out of
// structured data. Prices live on /pricing/; only the free Calibration Call
// carries a numeric price here.
export const OFFER_CATALOG = {
  '@type': 'OfferCatalog',
  '@id': OFFERCATALOG_ID,
  name: 'Ways to work with Be Legendary',
  url: `${SITE_URL}${SLUGS.pricing}`,
  itemListElement: [
    { '@type': 'Offer', category: 'Diagnostic', priceSpecification: { '@type': 'PriceSpecification', price: 0, priceCurrency: 'USD' }, itemOffered: { '@type': 'Service', name: 'Calibration Call', serviceType: 'Executive-team fit call', url: `${SITE_URL}${CTA_URL}`, provider: { '@id': ORG_ID }, description: 'A free 15-minute call to name your team’s first break point. A calibration, not a pitch.' } },
    { '@type': 'Offer', category: 'Diagnostic', itemOffered: { '@type': 'Service', name: 'Team LFS — Leadership Failure Simulation', serviceType: 'Executive-team diagnostic simulation', url: `${SITE_URL}${SLUGS.teamLfs}`, provider: { '@id': ORG_ID }, description: 'A live, instrumented behavioral read that shows exactly where an executive team breaks, with a FlagScore baseline.' } },
    { '@type': 'Offer', category: 'Experience', itemOffered: { '@type': 'Service', name: 'Leadership Retreats', serviceType: 'Executive leadership retreat', url: `${SITE_URL}${SLUGS.teamRetreats}`, provider: { '@id': ORG_ID }, description: 'Facilitated multi-day experiential retreats engineered around one outcome and reinforced afterward — Focused, Signature and Bespoke tiers.' } },
    { '@type': 'Offer', category: 'For Leaders', itemOffered: { '@type': 'Service', name: 'For Leaders — Mindset development', serviceType: 'Leadership development program', url: `${SITE_URL}${SLUGS.leaders}`, provider: { '@id': ORG_ID }, description: 'The individual-leader track: Mindset Workouts and Your 30-Day Challenge that turn the legendary mindset into daily reps.' } },
  ],
};

export const ORG_NODE = {
  // Plain Organization — not ProfessionalService/LocalBusiness, which would
  // require a full street PostalAddress and flag a structured-data error on
  // every page (we're a consulting firm, no walk-in address). `location`
  // carries locality-only (Denver, CO) — enough to place the entity without
  // asserting a storefront.
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Be Legendary',
  // Building Teams is the same legal entity (a DBA), so it lives here and in
  // sameAs — NOT as a subOrganization, which would assert a separate child.
  alternateName: ['Repario', 'Building Teams', 'Repario Ltd Inc'],
  url: `${SITE_URL}/`,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/favicon-snail.png`, width: 512, height: 512 },
  image: `${SITE_URL}/assets/share-card.png`,
  description: 'An executive-team diagnostic and performance firm. We rebuild the disciplines of the Flag Model that turn a stalled leadership team into one that executes.',
  slogan: 'Where does your executive team break first?',
  founder: { '@id': PERSON_ID },
  foundingDate: '2003',
  areaServed: 'US',
  location: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Denver', addressRegion: 'CO', addressCountry: 'US' } },
  contactPoint: { '@type': 'ContactPoint', contactType: 'sales', telephone: '+1-800-513-8759', url: 'https://meetings-na2.hubspot.com/jcarter28' },
  // Prove only — a genuinely separate product brand. Building Teams (a DBA of
  // this same entity) was removed to resolve the same-entity-vs-child conflict.
  subOrganization: { '@type': 'Organization', name: 'Prove', url: 'https://www.provecq.com/', description: 'Prove measures who delivers — the Commitment Quotient (CQ), a behavioral measurement of Initiative, Follow-Through, and Learnability. The individual-capacity companion to the Flag Model.' },
  knowsAbout: ['executive team performance', 'leadership team alignment', 'decision-making', 'organizational execution', 'leadership development', 'executive facilitation', 'leadership offsites', 'team accountability'],
  hasOfferCatalog: OFFER_CATALOG,
  // Wikidata first — the anchor that resolves belegendary.org, buildingteams.com
  // and the Wikidata item to one entity (bidirectional via P112 on the item).
  sameAs: ['https://www.wikidata.org/wiki/Q140513581', 'https://www.linkedin.com/company/repario-and-be-legendary/', 'https://www.buildingteams.com/', 'https://www.amazon.com/stores/James-Carter/author/B009FAZ2NG'],
};

export const PERSON_NODE = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'James Carter',
  // givenName/familyName + "James L. Carter" disambiguate from the other two
  // James Carters that already hold Wikidata/Crunchbase entities.
  givenName: 'James',
  familyName: 'Carter',
  alternateName: 'James L. Carter',
  jobTitle: 'Founder',
  description:
    'Founder of Be Legendary and creator of the Flag Model. Sole author of the forthcoming Lost Disciplines of Leadership; a collaborative author featured on the cover of Roadmap to Success (2012) alongside Deepak Chopra and Ken Blanchard; and co-author of Discover Your Inner Strength (2009) alongside Brian Tracy, Ken Blanchard and Stephen Covey. Twenty-five years working with hundreds of executive teams; featured in CNN, CNN Money and Business Insider.',
  knowsAbout: [
    'executive team performance', 'leadership team alignment', 'the Flag Model',
    'organizational execution', 'leadership development', 'executive facilitation',
    'leadership offsites', 'team accountability', 'decision-making', 'leadership mindset',
    'personal transformation',
  ],
  url: `${SITE_URL}/about/james-carter/`,
  worksFor: { '@id': ORG_ID },
  sameAs: [
    'https://www.wikidata.org/wiki/Q140514540',
    'https://www.linkedin.com/in/jlcarter/',
    'https://www.amazon.com/stores/James-Carter/author/B009FAZ2NG',
    'https://www.crunchbase.com/person/james-carter-5417',
    'https://www.buildingteams.com/about/james-carter/',
  ],
};

export const WEBSITE_NODE = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: 'Be Legendary',
  publisher: { '@id': ORG_ID },
};

