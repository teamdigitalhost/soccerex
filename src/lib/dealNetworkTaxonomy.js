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
]

/* Per-type column validity for the capability grid (frontend-only).
   `looking` / `provide` say whether that checkbox renders for that side.
   Keyed by SignalTaxonomy need/offer key. Order here is the grid's row order:
   the top block is the typical non-reversible asymmetry (a property provides
   sponsorship inventory, a brand looks for it); the lower block is
   two-directional. A row is hidden for a side only if neither column is valid.
   Side keys: `property` (club/federation/rightsholder) and `brand` (company). */
export const CAPABILITY_VALIDITY = [
  { key: 'sponsorship_inventory',         property: { looking: false, provide: true  }, brand: { looking: true,  provide: false } },
  { key: 'fan_audience_access',           property: { looking: false, provide: true  }, brand: { looking: true,  provide: false } },
  { key: 'hospitality_experiences',       property: { looking: false, provide: true  }, brand: { looking: true,  provide: false } },
  { key: 'merchandising_licensing',       property: { looking: false, provide: true  }, brand: { looking: true,  provide: true  } },
  { key: 'investment_capital',            property: { looking: true,  provide: false }, brand: { looking: false, provide: true  } },
  { key: 'technology_platform',           property: { looking: true,  provide: false }, brand: { looking: false, provide: true  } },
  { key: 'media_broadcast_rights',        property: { looking: true,  provide: true  }, brand: { looking: true,  provide: true  } },
  { key: 'content_ip',                    property: { looking: true,  provide: true  }, brand: { looking: true,  provide: true  } },
  { key: 'data_analytics',                property: { looking: true,  provide: true  }, brand: { looking: true,  provide: true  } },
  { key: 'talent_representation',         property: { looking: true,  provide: true  }, brand: { looking: true,  provide: true  } },
  { key: 'stadium_venue_infrastructure',  property: { looking: true,  provide: true  }, brand: { looking: true,  provide: true  } },
  { key: 'distribution_commercial_reach', property: { looking: true,  provide: true  }, brand: { looking: true,  provide: true  } },
  { key: 'ma_equity',                     property: { looking: true,  provide: true  }, brand: { looking: true,  provide: true  } },
  { key: 'advisory_services',             property: { looking: true,  provide: true  }, brand: { looking: true,  provide: true  } },
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
  { key: 'other',                 label: 'Other' },
]
