/**
 * Single source of truth for internal route paths.
 *
 * Two reasons this module exists:
 *   1. Renaming a route prefix (e.g. /profile-access → /portal) becomes a
 *      one-file change instead of a project-wide grep.
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

/* ─── Insights / content hub ───────────────────────────────────────────── */
export const INSIGHTS        = '/insights'
export const insightArticle  = (slug) => `${INSIGHTS}/${encodeURIComponent(slug)}`

/* ─── Profile self-service + sponsor portal ────────────────────────────── */
export const PROFILE_ACCESS  = '/profile-access'
export const PROFILE_EXPIRED = `${PROFILE_ACCESS}?expired=1`
export const profileEditor   = (slug) => `${PROFILE_ACCESS}/edit/${encodeURIComponent(slug)}`
export const companyPortal   = (slug) => `${PROFILE_ACCESS}/portal/${encodeURIComponent(slug)}`

/* ─── Route declarations (for App.jsx <Route path=...>) ────────────────── */
/* These mirror the constants above but expose React-Router param shapes
   (":slug") where the builders above accept a real slug. */
export const ROUTE_PATTERNS = {
  insightArticle: `${INSIGHTS}/:slug`,
  profileEditor:  `${PROFILE_ACCESS}/edit/:slug`,
  companyPortal:  `${PROFILE_ACCESS}/portal/:slug`,
}
