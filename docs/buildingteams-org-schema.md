# buildingteams.com — mirrored Organization block

Building Teams is a DBA of the same legal entity as Be Legendary (Repario Ltd).
To make **both domains resolve to one entity** in the knowledge graph, serve the
**identical canonical Organization node** on buildingteams.com — same `@id`, same
Wikidata `sameAs` — with the cross-references flipped so this block points back
to belegendary.org.

Paste this into the `<head>` of the buildingteams.com home page (and ideally the
About page).

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.belegendary.org/#org",
  "name": "Be Legendary",
  "alternateName": ["Repario", "Building Teams", "Repario Ltd Inc"],
  "url": "https://www.belegendary.org/",
  "logo": {
    "@type": "ImageObject",
    "url": "https://www.belegendary.org/assets/favicon-snail.png",
    "width": 512,
    "height": 512
  },
  "image": "https://www.belegendary.org/assets/share-card.png",
  "description": "An executive-team diagnostic and performance firm. We rebuild the disciplines of the Flag Model that turn a stalled leadership team into one that executes.",
  "slogan": "Where does your executive team break first?",
  "founder": { "@id": "https://www.belegendary.org/#james" },
  "foundingDate": "2003",
  "areaServed": "US",
  "location": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Denver",
      "addressRegion": "CO",
      "addressCountry": "US"
    }
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "sales",
    "telephone": "+1-800-513-8759",
    "url": "https://meetings-na2.hubspot.com/jcarter28"
  },
  "subOrganization": {
    "@type": "Organization",
    "name": "Prove",
    "url": "https://www.provecq.com/"
  },
  "knowsAbout": [
    "executive team performance",
    "leadership team alignment",
    "decision-making",
    "organizational execution",
    "leadership development",
    "executive facilitation",
    "leadership offsites",
    "team accountability"
  ],
  "sameAs": [
    "https://www.wikidata.org/wiki/Q140513581",
    "https://www.belegendary.org/",
    "https://www.linkedin.com/company/repario-and-be-legendary/",
    "https://www.amazon.com/stores/James-Carter/author/B009FAZ2NG"
  ]
}
</script>
```

## Why it's built this way

- **Same `@id` (`belegendary.org/#org`) on both domains.** This is the single
  strongest consolidation signal — it tells crawlers the two pages describe the
  *same node*, not two look-alike orgs. Reinforced by the shared Wikidata
  `@id` in `sameAs`.
- **`sameAs` flipped to point back at belegendary.org.** The self-domain
  (buildingteams.com) is omitted from `sameAs` — a node shouldn't list itself.
  Wikidata stays first as the anchor.
- **`name` stays "Be Legendary."** For one entity you pick one canonical name;
  "Building Teams" rides along in `alternateName`. See the decision below if you'd
  rather lead with the Building Teams brand on its own domain.

## Decisions worth a look before you paste

1. **Entity name on the Building Teams domain.** As written, the node is named
   "Be Legendary" (with Building Teams as an `alternateName`). That's cleanest
   for graph consolidation but may feel odd on that site's own pages. Alternative:
   set `"name": "Building Teams"` and `"alternateName": ["Repario", "Be Legendary",
   "Repario Ltd Inc"]`. Keep the same `@id` either way — but don't run two
   *different* `name` values against the same `@id` across pages long-term; pick one.
2. **`description` / `contactPoint`.** Both are Be Legendary's (executive-team
   framing, the jcarter28 sales calendar). If Building Teams books through a
   different line or inbox, swap the `contactPoint`; if the team-building framing
   matters on that domain, use a brand-neutral entity description instead.
3. **`url`.** Points to belegendary.org (the entity's primary site). Leave it if
   belegendary.org is the flagship; that's the intended reading.

## Matching Person block

buildingteams.com already hosts a James Carter bio (`/about/james-carter/`), so
mirror the **Person** node there — same `@id` (`belegendary.org/#james`) and
Wikidata `Q140514540`, with `sameAs` flipped to point at the belegendary.org
profile. The buildingteams bio is the self-page, so it is correctly omitted from
`sameAs`. Best placed on `/about/james-carter/`.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://www.belegendary.org/#james",
  "name": "James Carter",
  "givenName": "James",
  "familyName": "Carter",
  "alternateName": "James L. Carter",
  "jobTitle": "Founder",
  "worksFor": { "@id": "https://www.belegendary.org/#org" },
  "description": "Founder of Be Legendary and creator of the Flag Model. Sole author of the forthcoming Lost Disciplines of Leadership; a collaborative author featured on the cover of Roadmap to Success (2012) alongside Deepak Chopra and Ken Blanchard; and co-author of Discover Your Inner Strength (2009) alongside Brian Tracy, Ken Blanchard and Stephen Covey. Twenty-five years working with hundreds of executive teams; featured in CNN, CNN Money and Business Insider.",
  "url": "https://www.belegendary.org/about/james-carter/",
  "knowsAbout": [
    "executive team performance",
    "leadership team alignment",
    "the Flag Model",
    "organizational execution",
    "leadership development",
    "executive facilitation",
    "leadership offsites",
    "team accountability",
    "decision-making",
    "leadership mindset",
    "personal transformation"
  ],
  "sameAs": [
    "https://www.wikidata.org/wiki/Q140514540",
    "https://www.belegendary.org/about/james-carter/",
    "https://www.linkedin.com/in/jlcarter/",
    "https://www.amazon.com/stores/James-Carter/author/B009FAZ2NG",
    "https://www.crunchbase.com/person/james-carter-5417"
  ]
}
</script>
```

Note: `url` stays the belegendary.org profile (the entity's primary), and
`worksFor` resolves to the same `#org` node — so if you place both blocks on the
same buildingteams.com page they link cleanly via `@id`.

## After you paste

1. Validate in Google's Rich Results Test + schema.org validator; confirm no
   errors and that the `@id`s resolve as linked.
2. Wikidata bidirectional cross-links: **P112** (founded by) on the company item
   `Q140513581` → James Carter; **P108** (employer) on the person item
   `Q140514540` → the company. Add the belegendary.org + buildingteams.com URLs
   as official-website / described-at-URL on the company item so Wikidata points
   back through the same profile set.
