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
export const APP_PAGE        = '/app'
export const DEAL_NETWORK    = '/deal-network'
export const DEAL_NETWORK_APPLY = '/deal-network/apply'
// Preset the apply flow's entry side via ?track= (rightsholder | company |
// capital). The apply page reads it to pre-select the right capability grid.
export const dealNetworkApplyWithTrack = (track) =>
  track ? `${DEAL_NETWORK_APPLY}?track=${encodeURIComponent(track)}` : DEAL_NETWORK_APPLY
export const INVITE_PATTERN  = '/invite/:token'
export const buildInviteUrl  = (token) => `/invite/${encodeURIComponent(token)}`

/* ─── Event landing pages ──────────────────────────────────────────────── */
export const MIAMI_2026      = '/miami-2026'
export const EUROPE_2026     = '/europe-2026'
export const RIYADH_2027     = '/riyadh-2027'

// Bespoke Miami press release page. Lives under /miami-2026 so the Miami
// theme (Oswald + Montserrat, pink/teal palette) applies automatically.
export const MIAMI_2026_PRESS_RELEASE = `${MIAMI_2026}/press-release`

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
export const companyPortal   = (slug) => `${PROFILE_ACCESS}/portal/${encodeURIComponent(slug)}`
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
