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
   handoff doc primary shape: `name`, `email`, `company`.
   Budget dropdown removed: every placement of this form is awareness-stage
   (home → event page → inquiry), and a budget question that early reads as
   pretentious / scares off interest. Sales follow up by email anyway. */
export const sponsorshipSchema = [
  {
    fields: [
      { name: 'organisation_type', label: 'Type of organisation *', required: true, type: 'select', options: ORG_TYPE_OPTIONS, span: 'full', },
      { name: 'company', label: 'Organisation *', required: true, placeholder: 'Company name', span: 'full' },
    ],
  },
  {
    fields: [
      { name: 'name',    label: 'Your name *', required: true, placeholder: 'Your full name', autoComplete: 'name' },
      { name: 'role',    label: 'Your role *', required: true, placeholder: 'Head of Partnerships' },
      { name: 'email',   label: 'Work email *', required: true, type: 'email', placeholder: 'you@company.com', autoComplete: 'email', span: 'full' },
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
      { name: 'name',     label: 'Your name *', required: true, placeholder: 'Your full name', autoFocus: true, autoComplete: 'name' },
      { name: 'email',    label: 'Email *', required: true, type: 'email', placeholder: 'you@company.com', autoComplete: 'email' },
      { name: 'company',  label: 'Organisation', placeholder: 'Where you work' },
      { name: 'role',     label: 'Role', placeholder: 'Your role' },
      { name: 'topic',    label: 'What would you talk about? *', required: true, type: 'textarea', rows: 3, span: 'full',
        placeholder: 'A one-line topic, and a line or two about why you\'re the right voice for it.' },
      { name: 'linkedin', label: 'LinkedIn (optional)', type: 'url', placeholder: 'https://linkedin.com/in/…', span: 'full' },
    ],
  },
]

/* Rightsholder pass application — clubs, leagues, federations, national teams,
   competitions, and other qualifying rightsholders applying for a complimentary
   delegate pass. Success copy must say "application under review" — never grant
   access or show a registration link. Used on Miami2026 and Riyadh2027. */
export const rightsholderSchema = [
  {
    fields: [
      { name: 'organisation_type', label: 'Type of organisation *', required: true, type: 'select', span: 'full', autoFocus: true, options: [
        { value: 'club',          label: 'Club' },
        { value: 'league',        label: 'League' },
        { value: 'federation',    label: 'Federation / national team' },
        { value: 'competition',   label: 'Competition' },
        { value: 'governing_body',label: 'Governing body' },
        { value: 'other',         label: 'Other qualifying rightsholder' },
      ] },
      { name: 'company', label: 'Organisation name *', required: true, placeholder: 'Organisation name', span: 'full' },
      { name: 'country', label: 'Country', placeholder: 'Country' },
    ],
  },
  {
    fields: [
      { name: 'name',  label: 'Your name *', required: true, placeholder: 'Your full name', autoComplete: 'name' },
      { name: 'role',  label: 'Your role *', required: true, placeholder: 'Your role' },
      { name: 'email', label: 'Official organisation email *', required: true, type: 'email', placeholder: 'you@organisation.com', autoComplete: 'email', span: 'full',
        hint: 'Eligibility is verified against your organisation, so personal addresses (Gmail, Hotmail, AOL and similar) do not qualify.',
        validate: (v) => {
          const domain = String(v || '').toLowerCase().split('@')[1] || ''
          // First-line check only; the API enforces the full list server-side.
          const freemail = ['gmail.com', 'googlemail.com', 'hotmail.com', 'outlook.com', 'live.com', 'msn.com',
            'yahoo.com', 'ymail.com', 'aol.com', 'icloud.com', 'me.com', 'protonmail.com', 'proton.me', 'gmx.com', 'mail.com']
          return freemail.includes(domain)
            ? 'Please use your official organisation email; personal addresses do not qualify for the free pass.'
            : undefined
        } },
      { name: 'message', label: 'Anything else?', type: 'textarea', rows: 3, span: 'full', placeholder: 'Tell us what you want to access or showcase.' },
    ],
  },
]

/* Sponsor/exhibitor pack request: the gated, tracked pricing download.
   Pricing lives inside the PDF, not on the landing page (Joel, 2026-08-03).
   The response may carry a signed download_url; LeadForm starts it and keeps
   a retry button on the success screen. */
export const packRequestSchema = [
  {
    fields: [
      { name: 'name',    label: 'Your name *', required: true, placeholder: 'Your full name', autoComplete: 'name', autoFocus: true },
      { name: 'role',    label: 'Role', placeholder: 'Your role' },
      { name: 'email',   label: 'Work email *', required: true, type: 'email', placeholder: 'you@company.com', autoComplete: 'email', span: 'full' },
      { name: 'company', label: 'Company *', required: true, placeholder: 'Company / organisation', span: 'full' },
    ],
  },
]

/* Generic newsletter, used by quick capture forms. */
export const newsletterSchema = [
  {
    fields: [
      { name: 'email', label: 'Email *', required: true, type: 'email', placeholder: 'Your email address', autoComplete: 'email', span: 'full', autoFocus: true },
    ],
  },
]
