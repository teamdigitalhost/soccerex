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
