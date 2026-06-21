// Be Legendary — central site constants.
// Single source of truth for the CTA, HubSpot wiring, and the slug map that
// every internal link resolves through (design files used flat .dc.html names).

export const SITE_URL = 'https://www.belegendary.org';
export const CTA_URL = 'https://meetings.hubspot.com/jcarter28';
export const CTA_LABEL = 'Book a Calibration Call';

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
  // Legal
  privacy: '/privacy/',
} as const;
