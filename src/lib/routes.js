/**
 * Single source of truth for internal route paths.
 *
 * Two reasons this module exists:
 *   1. Renaming a route prefix becomes a one-file change instead of a
 *      project-wide grep.
 *   2. Builders that take slugs handle encoding consistently, so no
 *      caller needs to remember to call encodeURIComponent.
 *
 * Conventions:
 *   - Constants (UPPER_CASE) hold static paths used by Routes and Links.
 *   - Builder functions return a path string; they always encode dynamic
 *     segments.
 *   - Test-mode query (?test=1) is applied at the call site via
 *     withTestSearch() from ./testMode — keep this module test-agnostic
 *     so the same paths feed into both <Route path=...> declarations and
 *     <Link to=...> targets.
 */

/* ─── Top-level pages ──────────────────────────────────────────────────── */
export const HOME            = '/'
export const ABOUT           = '/about'
export const EVENTS          = '/events'
export const CONTACT         = '/contact'
export const GLOBAL_NETWORK  = '/global-network'
export const GALLERY         = '/gallery'
export const PAST_SPEAKERS   = '/past-speakers'
export const APP_PAGE        = '/app'
export const DEAL_NETWORK    = '/deal-network'
export const DEAL_NETWORK_APPLY = '/deal-network/apply'
// Preset the apply flow's entry side via ?track= (rightsholder | company |
// capital). The apply page reads it to pre-select the right capability grid.
export const dealNetworkApplyWithTrack = (track) =>
  track ? `${DEAL_NETWORK_APPLY}?track=${encodeURIComponent(track)}` : DEAL_NETWORK_APPLY
// External agenda-collaborator review (personal link with ?token=...).
// Distributed by email to invited advisors; not linked from site navigation.
export const AGENDA_COLLAB   = '/agenda-collab'
export const INVITE_PATTERN  = '/invite/:token'
export const buildInviteUrl  = (token) => `/invite/${encodeURIComponent(token)}`
// Public sales-call scheduler. Each salesperson shares a personal booking
// link (/schedule/{code}); not linked from site navigation.
export const SCHEDULE_CALL_PATTERN = '/schedule/:code'
export const scheduleCall    = (code) => `/schedule/${encodeURIComponent(code)}`

/* ─── Event landing pages ──────────────────────────────────────────────── */
export const MIAMI_2026      = '/miami-2026'
export const EUROPE_2026     = '/europe-2026'
export const RIYADH_2027     = '/riyadh-2027'

// Past-event recap pages (e.g. /miami-2025). Keeps the historical URLs from the
// previous site so old links resolve to a recap instead of a blank page.
export const EVENT_RECAP_PATTERN = '/:eventSlug'
export const eventRecap = (slug) => `/${slug}`

// Bespoke Miami press release page. Lives under /miami-2026 so the Miami
// theme (Oswald + Montserrat, pink/teal palette) applies automatically.
export const MIAMI_2026_PRESS_RELEASE = `${MIAMI_2026}/press-release`

// Miami travel + accommodations page (partner-hotel booking links). Lives under
// /miami-2026 so the Miami theme applies automatically. The misspelled variant
// redirects to the canonical page (see App.jsx) so typo'd links still resolve.
export const MIAMI_2026_ACCOMMODATIONS = `${MIAMI_2026}/accommodations`
export const MIAMI_2026_ACCOMMODATIONS_MISSPELLED = `${MIAMI_2026}/accomodations`

// Legacy Miami-scoped sponsor/exhibit paths. Kept only so old links redirect
// to the evergreen pages below (see App.jsx). Do not link to these directly.
export const MIAMI_2026_SPONSOR = `${MIAMI_2026}/sponsor`
export const MIAMI_2026_EXHIBIT = `${MIAMI_2026}/exhibit`

// Evergreen, platform-level sponsor + exhibitor landing pages. Not tied to any
// single event; both drive the same lead intake (sponsor -> inquiry_type
// 'partner', exhibit -> 'exhibit'). Event pages link here for their CTAs.
export const SPONSOR = '/sponsor'
export const EXHIBIT = '/exhibit'

// Natural-language aliases people actually type and link to (outreach copy and
// decks say "exhibitor information"/"sponsorship"). Without these the catch-all
// silently swallows them to /events, so a lead who clicked an exhibitor CTA lands
// on a generic listing with no exhibit content. Redirect to the canonical pages.
export const EXHIBITOR = '/exhibitor'
export const SPONSORSHIP = '/sponsorship'

// Miami 2026 pricing. `/pricing` is the public chooser; each category
// (partnership | exhibition) is its own independently-gated page. Category keys
// + labels come from the backend, so this just builds the route shape.
export const MIAMI_2026_PRICING = `${MIAMI_2026}/pricing`
export const MIAMI_2026_PRICING_CATEGORY = `${MIAMI_2026_PRICING}/:category`
export const miamiPricingCategory = (category) => `${MIAMI_2026_PRICING}/${encodeURIComponent(category)}`

/* ─── Per-event API-driven pages ───────────────────────────────────────── */
// Public label for this page is "Program Themes". Internally and in the URL
// it stays "agenda-concept" — that is Soccerex's planning-vocabulary name
// for the upcoming program of themes. Keep the slug stable so external
// links + internal scripts don't break.
export const eventAgendaConcept = (slug) => `${EVENTS}/${encodeURIComponent(slug)}/agenda-concept`
export const eventTopics        = (slug) => `${EVENTS}/${encodeURIComponent(slug)}/topics`
export const eventAgenda        = (slug) => `${EVENTS}/${encodeURIComponent(slug)}/agenda`
export const eventSchedule      = (slug) => `${EVENTS}/${encodeURIComponent(slug)}/schedule`
export const eventSpeakers      = (slug) => `${EVENTS}/${encodeURIComponent(slug)}/speakers`
export const eventSpeaker       = (slug, speakerSlug) =>
  `${EVENTS}/${encodeURIComponent(slug)}/speakers/${encodeURIComponent(speakerSlug)}`

/* ─── Press ────────────────────────────────────────────────────────────── */
export const PRESS           = '/press'
export const pressRelease    = (slug) => `${PRESS}/${encodeURIComponent(slug)}`

/* ─── Insights / content hub ───────────────────────────────────────────── */
export const INSIGHTS        = '/insights'
export const insightArticle  = (slug) => `${INSIGHTS}/${encodeURIComponent(slug)}`

/* ─── Profile self-service + sponsor portal ────────────────────────────── */
export const PROFILE_ACCESS  = '/profile-access'
export const PROFILE_EXPIRED = `${PROFILE_ACCESS}?expired=1`
export const profileEditor   = (slug) => `${PROFILE_ACCESS}/edit/${encodeURIComponent(slug)}`
/* Read-only profile card — what the profile looks like, without edit chrome. */
export const profileView     = (slug) => `${PROFILE_ACCESS}/view/${encodeURIComponent(slug)}`
export const companyPortal   = (slug) => `${PROFILE_ACCESS}/portal/${encodeURIComponent(slug)}`
/* Admin-only signed preview of a pending profile revision, ungated (see ProfilePreview). */
export const PROFILE_PREVIEW = '/profile-preview'

/* Signed, shareable preview of an article draft, ungated (see ArticlePreview). */
export const ARTICLE_PREVIEW = '/article-preview'
/* Personal portal: aggregates speaker / delegate / rights-holder / VIP roles
   for a single person profile into one neutral, timeless dashboard. */
export const personalPortal  = (slug) => `${PROFILE_ACCESS}/me/${encodeURIComponent(slug)}`

/* ─── Policy pages ─────────────────────────────────────────────────────── */
export const PRIVACY_POLICY  = '/privacy-policy'
export const TERMS           = '/terms'
export const COOKIE_POLICY   = '/cookie-policy'
export const REFUND_POLICY   = '/refund-policy'

/* ─── Route declarations (for App.jsx <Route path=...>) ────────────────── */
/* These mirror the constants above but expose React-Router param shapes
   (":slug") where the builders above accept a real slug. */
export const ROUTE_PATTERNS = {
  insightArticle:      `${INSIGHTS}/:slug`,
  profileEditor:       `${PROFILE_ACCESS}/edit/:slug`,
  profileView:         `${PROFILE_ACCESS}/view/:slug`,
  profilePreview:      `${PROFILE_PREVIEW}/:revisionId`,
  articlePreview:      `${ARTICLE_PREVIEW}/:articleId`,
  companyPortal:       `${PROFILE_ACCESS}/portal/:slug`,
  personalPortal:      `${PROFILE_ACCESS}/me/:slug`,
  pressRelease:        `${PRESS}/:slug`,
  eventAgendaConcept:  `${EVENTS}/:slug/agenda-concept`,
  eventTopics:         `${EVENTS}/:slug/topics`,
  eventAgenda:         `${EVENTS}/:slug/agenda`,
  eventSchedule:       `${EVENTS}/:slug/schedule`,
  eventSpeakers:       `${EVENTS}/:slug/speakers`,
  eventSpeaker:        `${EVENTS}/:slug/speakers/:speakerSlug`,
}
