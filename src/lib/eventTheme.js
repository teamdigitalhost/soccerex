/**
 * Frontend-owned theme picker for the public programming pages.
 *
 * The slug carries the brand identity (e.g. soccerex-miami-2026,
 * soccerex-europe-2026), so we map it to one of the existing event
 * theme classes defined in src/styles/event-themes.css.
 *
 * Add new event brands by extending the THEME_RULES array. Each rule's
 * test runs on a lower-cased slug.
 */

const THEME_RULES = [
  { test: (s) => s.includes('miami'),                           theme: 'miami' },
  { test: (s) => s.includes('europe') || s.includes('amsterdam'), theme: 'europe' },
  { test: (s) => s.includes('middle-east') || s.includes('riyadh') || s.includes('saudi'), theme: 'riyadh' },
]

const DEFAULT_THEME = 'miami'

export function eventThemeFromSlug(slug) {
  if (!slug) return DEFAULT_THEME
  const s = String(slug).toLowerCase()
  const hit = THEME_RULES.find((r) => r.test(s))
  return hit ? hit.theme : DEFAULT_THEME
}

export function eventThemeClass(slug) {
  return `theme-${eventThemeFromSlug(slug)}`
}
