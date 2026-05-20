/**
 * Reusable schemas for the LeadForm component.
 *
 * Keep these here so every placement of the same form (sponsorship inquiry
 * on Events vs Miami vs Amsterdam, speaker interest on About vs Miami vs
 * EventAgendaConcept, etc.) submits the same shape to the backend and the
 * UX doesn't drift between contexts.
 */

const COUNTRY_SUGGEST = [
  'United States', 'United Kingdom', 'Spain', 'Brazil', 'Mexico',
  'Argentina', 'Germany', 'France', 'Canada', 'Netherlands', 'Saudi Arabia',
]

const ORG_TYPE_OPTIONS = [
  { value: 'club',             label: 'Club' },
  { value: 'league',           label: 'League' },
  { value: 'federation',       label: 'Federation / national team' },
  { value: 'brand',            label: 'Brand' },
  { value: 'agency',           label: 'Agency' },
  { value: 'media',            label: 'Media / broadcaster' },
  { value: 'tech',             label: 'Tech / service provider' },
  { value: 'investor',         label: 'Investor / private equity' },
  { value: 'other',            label: 'Other' },
]

/* Sponsorship / exhibitor inquiry — two short steps. Field names follow the
   handoff doc primary shape: `name`, `email`, `company`. */
export const sponsorshipSchema = [
  {
    fields: [
      { name: 'organisation_type', label: 'Type of organisation *', required: true, type: 'select', options: ORG_TYPE_OPTIONS, span: 'full', autoFocus: true },
      { name: 'company', label: 'Organisation *', required: true, placeholder: 'Company name', span: 'full' },
      { name: 'budget_range', label: 'Approximate budget (USD)', type: 'select', span: 'full',
        options: [
          { value: 'under-25k', label: 'Under $25k' },
          { value: '25-75k',    label: '$25k–$75k' },
          { value: '75-150k',   label: '$75k–$150k' },
          { value: '150-300k',  label: '$150k–$300k' },
          { value: '300k+',     label: '$300k or more' },
          { value: 'unsure',    label: 'Not sure yet' },
        ],
        hint: 'A rough range helps us send the right partnership pack. We never use this for a price tag.',
      },
    ],
  },
  {
    fields: [
      { name: 'name',    label: 'Your name *', required: true, placeholder: 'Eve Moneypenny', autoComplete: 'name' },
      { name: 'role',    label: 'Your role *', required: true, placeholder: 'Head of Partnerships' },
      { name: 'email',   label: 'Work email *', required: true, type: 'email', placeholder: 'eve@brand.com', autoComplete: 'email', span: 'full' },
      { name: 'phone',   label: 'Phone (optional)', type: 'tel', placeholder: '+1 305…' },
      { name: 'country', label: 'Country', placeholder: 'Country', suggest: COUNTRY_SUGGEST },
      { name: 'message', label: 'What company pain points can Soccerex help solve?', type: 'textarea', rows: 3, span: 'full',
        placeholder: 'A line or two about the commercial gaps you want Soccerex to help close (audience reach, dealmaking, market entry, brand visibility, etc.).' },
    ],
  },
]

/* Speaker interest — single short step. The full program submission
   form on EventAgendaConcept stays for event-specific session pitches. */
export const speakerSchema = [
  {
    fields: [
      { name: 'name',     label: 'Your name *', required: true, placeholder: 'Eve Moneypenny', autoFocus: true, autoComplete: 'name' },
      { name: 'email',    label: 'Email *', required: true, type: 'email', placeholder: 'eve@example.com', autoComplete: 'email' },
      { name: 'company',  label: 'Organisation', placeholder: 'Where you work' },
      { name: 'role',     label: 'Role', placeholder: 'Your role' },
      { name: 'topic',    label: 'What would you talk about? *', required: true, type: 'textarea', rows: 3, span: 'full',
        placeholder: 'A one-line topic, and a line or two about why you\'re the right voice for it.' },
      { name: 'linkedin', label: 'LinkedIn (optional)', type: 'url', placeholder: 'https://linkedin.com/in/…', span: 'full' },
    ],
  },
]

/* Generic newsletter, used by quick capture forms. */
export const newsletterSchema = [
  {
    fields: [
      { name: 'email', label: 'Email *', required: true, type: 'email', placeholder: 'you@example.com', autoComplete: 'email', span: 'full', autoFocus: true },
    ],
  },
]
