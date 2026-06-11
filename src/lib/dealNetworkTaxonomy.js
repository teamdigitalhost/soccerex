/* Mirror of backend App\Support\DealNetwork\SignalTaxonomy.
   Backend is authoritative and re-validates every key; keep these in sync.
   Order here is display order on the public form. */

export const NEED_OFFER_OPTIONS = [
  { key: 'sponsorship_inventory',         label: 'Sponsorship inventory' },
  { key: 'media_broadcast_rights',        label: 'Media & broadcast rights' },
  { key: 'content_ip',                    label: 'Content & IP' },
  { key: 'technology_platform',           label: 'Technology & platform' },
  { key: 'data_analytics',                label: 'Data & analytics' },
  { key: 'fan_audience_access',           label: 'Fan / audience access' },
  { key: 'hospitality_experiences',       label: 'Hospitality & experiences' },
  { key: 'investment_capital',            label: 'Investment / capital' },
  { key: 'ma_equity',                     label: 'M&A / equity' },
  { key: 'stadium_venue_infrastructure',  label: 'Stadium / venue / infrastructure' },
  { key: 'merchandising_licensing',       label: 'Merchandising & licensing' },
  { key: 'distribution_commercial_reach', label: 'Distribution & commercial reach' },
  { key: 'talent_representation',         label: 'Talent & representation' },
  { key: 'advisory_services',             label: 'Advisory & services' },
  // Capital-partner investment / deal-focus vocabulary (2026-06 tailored forms)
  { key: 'club_acquisition_majority',     label: 'Club acquisition (majority stake)' },
  { key: 'club_investment_minority',      label: 'Club investment (minority stake)' },
  { key: 'league_competition_investment', label: 'League or competition investment' },
  { key: 'impact_initiative',             label: 'Impact / mission-driven initiative' },
  { key: 'debt_financing',                label: 'Debt / financing' },
  { key: 'ma_advisory',                   label: 'M&A advisory' },
]

/* Per-type column validity for the capability grid (frontend-only).
   `looking` / `provide` say whether that checkbox renders for that side.
   Keyed by SignalTaxonomy need/offer key. Order here is the grid's row order:
   the top block is the typical non-reversible asymmetry (a property provides
   sponsorship inventory, a brand looks for it); the lower block is
   two-directional. A row is hidden for a side only if neither column is valid.
   Side keys: `property` (club/federation/rightsholder), `brand` (company), and
   `capital` (capital & impact partners). Capital is deliberately narrow and
   mandate-led: it provides investment / advisory and seeks M&A and
   infrastructure deal flow, so it complements a rightsholder that is looking
   for investment and providing equity / infrastructure. */
export const CAPABILITY_VALIDITY = [
  { key: 'sponsorship_inventory',         property: { looking: false, provide: true  }, brand: { looking: true,  provide: false }, capital: { looking: false, provide: false } },
  { key: 'fan_audience_access',           property: { looking: false, provide: true  }, brand: { looking: true,  provide: false }, capital: { looking: false, provide: false } },
  { key: 'hospitality_experiences',       property: { looking: false, provide: true  }, brand: { looking: true,  provide: false }, capital: { looking: false, provide: false } },
  { key: 'merchandising_licensing',       property: { looking: false, provide: true  }, brand: { looking: true,  provide: true  }, capital: { looking: false, provide: false } },
  { key: 'investment_capital',            property: { looking: true,  provide: false }, brand: { looking: false, provide: true  }, capital: { looking: false, provide: true  } },
  { key: 'technology_platform',           property: { looking: true,  provide: false }, brand: { looking: false, provide: true  }, capital: { looking: false, provide: false } },
  { key: 'media_broadcast_rights',        property: { looking: true,  provide: true  }, brand: { looking: true,  provide: true  }, capital: { looking: false, provide: false } },
  { key: 'content_ip',                    property: { looking: true,  provide: true  }, brand: { looking: true,  provide: true  }, capital: { looking: false, provide: false } },
  { key: 'data_analytics',                property: { looking: true,  provide: true  }, brand: { looking: true,  provide: true  }, capital: { looking: false, provide: false } },
  { key: 'talent_representation',         property: { looking: true,  provide: true  }, brand: { looking: true,  provide: true  }, capital: { looking: false, provide: false } },
  { key: 'stadium_venue_infrastructure',  property: { looking: true,  provide: true  }, brand: { looking: true,  provide: true  }, capital: { looking: true,  provide: true  } },
  { key: 'distribution_commercial_reach', property: { looking: true,  provide: true  }, brand: { looking: true,  provide: true  }, capital: { looking: false, provide: false } },
  { key: 'ma_equity',                     property: { looking: true,  provide: true  }, brand: { looking: true,  provide: true  }, capital: { looking: true,  provide: true  } },
  { key: 'advisory_services',             property: { looking: true,  provide: true  }, brand: { looking: true,  provide: true  }, capital: { looking: false, provide: true  } },
]

/* key → label, sourced from NEED_OFFER_OPTIONS so the grid and chips never drift. */
export const NEED_OFFER_LABELS = Object.fromEntries(NEED_OFFER_OPTIONS.map((o) => [o.key, o.label]))

export const PAIN_OPTIONS = [
  { key: 'revenue_growth',        label: 'Revenue growth / new commercial income' },
  { key: 'unsold_inventory',      label: 'Unsold inventory' },
  { key: 'reaching_dms',          label: 'Reaching decision-makers' },
  { key: 'market_entry',          label: 'Market entry (new geography)' },
  { key: 'fan_audience_growth',   label: 'Fan / audience growth & engagement' },
  { key: 'capital_access',        label: 'Capital / funding access' },
  { key: 'tech_modernization',    label: 'Technology modernization' },
  { key: 'data_measurement_gaps', label: 'Data & measurement gaps' },
  { key: 'brand_visibility',      label: 'Brand visibility / credibility' },
  { key: 'talent_acquisition',    label: 'Talent acquisition / representation' },
  { key: 'operational_scale',     label: 'Operational scale / efficiency' },
  // Capital-partner problem vocabulary (2026-06 tailored forms)
  { key: 'deploying_capital',     label: 'Deploying capital into football' },
  { key: 'qualified_deal_flow',   label: 'Finding qualified deal flow' },
  { key: 'strategic_partnerships', label: 'Building strategic partnerships in the sport' },
  { key: 'impact_alignment',      label: 'Impact / social mission alignment' },
  { key: 'other',                 label: 'Other' },
]

/* ════ 2026-06 tailored intake forms (Deal Network Intake Forms doc) ══════
   Per-side vocabularies for the apply flow. Keys reference the shared
   taxonomy above (backend re-validates); labels may differ per side
   (e.g. a rightsholder LOOKS FOR "Sponsorship inventory buyers" while a
   commercial partner PROVIDES "Brand investment / sponsorship spend"). */

export const INTAKE_REGIONS = [
  'North America', 'Latin America', 'Europe', 'Middle East & North Africa',
  'Sub-Saharan Africa', 'Asia Pacific', 'Global',
]

export const INTAKE_FORMS = {
  property: {
    sideLabel: 'Rightsholder',
    orgTypeLabel: 'Type of Rightsholder',
    orgTypes: ["Professional Club (men's)", "Professional Club (women's)", 'National Federation / Football Association', 'League or Competition', 'Stadium / Venue', 'Agency / Management Company'],
    leagueLevels: ['Top flight (Tier 1)', 'Second division (Tier 2)', 'Third division or below', 'Continental / International', 'Independent / Non-league', 'N/A'],
    pitchLabel: "Pitch (who you are and what you're looking to do in football)",
    pitchPlaceholder: 'e.g., We are a Tier 2 Spanish club with 40,000 matchday fans and strong regional brand recognition. We are looking to bring in a commercial partner to help us monetize our digital audience and expand our shirt sponsorship into the North American market ahead of the 2026/27 season.',
    lookingFor: [
      ['sponsorship_inventory', 'Sponsorship inventory buyers'],
      ['fan_audience_access', 'Fan / audience access'],
      ['hospitality_experiences', 'Hospitality & experiences'],
      ['merchandising_licensing', 'Merchandising & licensing'],
      ['investment_capital', 'Investment / capital'],
      ['technology_platform', 'Technology & platform solutions'],
      ['media_broadcast_rights', 'Media & broadcast rights buyers'],
      ['content_ip', 'Content & IP partners'],
      ['data_analytics', 'Data & analytics'],
      ['talent_representation', 'Talent & representation'],
      ['distribution_commercial_reach', 'Distribution & commercial reach'],
      ['ma_equity', 'M&A / equity'],
      ['advisory_services', 'Advisory & services'],
    ],
    canProvide: [
      ['sponsorship_inventory', 'Sponsorship inventory'],
      ['fan_audience_access', 'Fan / audience access'],
      ['hospitality_experiences', 'Hospitality & experiences'],
      ['merchandising_licensing', 'Merchandising & licensing'],
      ['media_broadcast_rights', 'Media & broadcast rights'],
      ['content_ip', 'Content & IP'],
      ['stadium_venue_infrastructure', 'Stadium / venue / infrastructure'],
      ['distribution_commercial_reach', 'Distribution & commercial reach'],
    ],
    pains: ['revenue_growth', 'unsold_inventory', 'reaching_dms', 'market_entry', 'fan_audience_growth', 'capital_access', 'tech_modernization', 'data_measurement_gaps', 'brand_visibility', 'talent_acquisition', 'operational_scale'],
    dealTypes: ['Sponsorship', 'Media rights', 'Content partnership', 'Technology / platform', 'Hospitality / experiences', 'Investment / M&A', 'Stadium / venue', 'Data / analytics', 'Merchandising / licensing'],
    dealStructures: ['Fixed fee', 'Revenue share', 'Equity stake', 'Multi-year partnership', 'Pilot then scale'],
    budgets: ['Under $50K', '$50K–$250K', '$250K–$1M', '$1M–$5M', '$5M+', 'Flexible / open to discussion'],
    budgetLabel: 'Budget range / deal size',
    counterpartLabel: 'Ideal counterpart (the kind of company / role you want to meet)',
    counterpartPlaceholder: 'e.g., Mid-major MLS club head of partnerships',
  },
  brand: {
    sideLabel: 'Commercial Partner',
    orgTypeLabel: 'Type of Commercial Partner',
    orgTypes: ['Brand / Sponsor', 'Technology Provider', 'Media & Content Platform', 'Agency / Operator', 'Startup / Innovator', 'Service Provider / Vendor'],
    industries: ['Consumer Goods & Retail', 'Financial Services', 'Technology & Software', 'Telecommunications', 'Media & Entertainment', 'Travel & Hospitality', 'Automotive', 'Healthcare & Wellness', 'Energy & Sustainability'],
    pitchLabel: "Pitch (who you are and what you're looking to do in football)",
    pitchPlaceholder: 'e.g., We are a global fintech brand looking to enter the Latin American football market through a regional shirt sponsorship or stadium naming rights deal with a top-flight club ahead of the 2026/27 season.',
    lookingFor: [
      ['sponsorship_inventory', 'Sponsorship inventory'],
      ['fan_audience_access', 'Fan / audience access'],
      ['hospitality_experiences', 'Hospitality & experiences'],
      ['merchandising_licensing', 'Merchandising & licensing opportunities'],
      ['media_broadcast_rights', 'Media & broadcast rights'],
      ['content_ip', 'Content & IP'],
      ['stadium_venue_infrastructure', 'Stadium / venue / infrastructure'],
      ['distribution_commercial_reach', 'Distribution & commercial reach'],
      ['data_analytics', 'Data & analytics'],
      ['talent_representation', 'Talent & representation'],
    ],
    canProvide: [
      ['investment_capital', 'Brand investment / sponsorship spend'],
      ['technology_platform', 'Technology & platform solutions'],
      ['media_broadcast_rights', 'Media & broadcast distribution'],
      ['content_ip', 'Content production & IP'],
      ['data_analytics', 'Data & analytics tools'],
      ['distribution_commercial_reach', 'Marketing & audience reach'],
      ['merchandising_licensing', 'Merchandising & licensing capabilities'],
      ['advisory_services', 'Advisory & consulting services'],
    ],
    pains: ['brand_visibility', 'market_entry', 'fan_audience_growth', 'reaching_dms', 'revenue_growth', 'tech_modernization', 'data_measurement_gaps', 'talent_acquisition', 'operational_scale'],
    dealTypes: ['Sponsorship', 'Media rights', 'Content partnership', 'Technology / platform', 'Hospitality / experiences', 'Data / analytics', 'Merchandising / licensing'],
    dealStructures: ['Fixed fee', 'Revenue share', 'Multi-year partnership', 'Pilot then scale'],
    budgets: ['Under $50K', '$50K–$250K', '$250K–$1M', '$1M–$5M', '$5M+', 'Flexible / open to discussion'],
    budgetLabel: 'Budget range / deal size',
    counterpartLabel: 'Ideal counterpart (the kind of rightsholder / asset you want to partner with)',
    counterpartPlaceholder: "e.g., A top-flight women's club in the US or UK with an active commercial team and 100K+ social following",
  },
  capital: {
    sideLabel: 'Capital Partner / Nonprofit',
    orgTypeLabel: 'Type of Capital Partner',
    orgTypes: ['Private Equity Group', 'Fund / Strategic Investor', 'Family Office', 'Financial Institution', 'Foundation / Nonprofit', 'Impact-Focused Brand'],
    aumRanges: ['Under $10M', '$10M–$50M', '$50M–$250M', '$250M–$1B', '$1B+', 'Prefer not to say'],
    pitchLabel: "Mandate / thesis (who you are and what you're looking to do in football)",
    pitchPlaceholder: 'e.g., We are a Miami-based family office deploying $5–20M into minority equity stakes in lower-league European clubs with strong commercial upside and a clear path to promotion.',
    lookingFor: [
      ['club_acquisition_majority', 'Club acquisition (majority stake)'],
      ['club_investment_minority', 'Club investment (minority stake)'],
      ['stadium_venue_infrastructure', 'Stadium / venue / infrastructure'],
      ['league_competition_investment', 'League or competition investment'],
      ['technology_platform', 'Football technology & platform'],
      ['media_broadcast_rights', 'Media & broadcast rights'],
      ['impact_initiative', 'Impact / mission-driven initiative'],
      ['debt_financing', 'Debt / financing'],
      ['ma_advisory', 'M&A advisory'],
    ],
    lookingForLabel: 'Investment / deal focus',
    canProvide: null, // capital implicitly provides investment_capital
    pains: ['deploying_capital', 'qualified_deal_flow', 'reaching_dms', 'market_entry', 'strategic_partnerships', 'impact_alignment'],
    painLabels: { reaching_dms: 'Reaching decision-makers at clubs or federations' },
    dealTypes: ['Equity investment', 'Debt / financing', 'M&A', 'Joint venture', 'Infrastructure / project finance', 'Impact / mission-driven'],
    dealTypesLabel: 'Deal structures you pursue',
    dealStructures: null,
    budgets: ['Under $1M', '$1M–$5M', '$5M–$20M', '$20M–$100M', '$100M+', 'Flexible / deal dependent'],
    budgetLabel: 'Typical ticket size',
    counterpartLabel: 'Ideal counterpart (the kind of rightsholder / asset you want to invest in or partner with)',
    counterpartPlaceholder: 'e.g., A lower-league European club with a clear commercial growth plan and openness to a minority equity partner',
  },
}
