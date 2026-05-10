/**
 * Frontend test-mode helpers.
 *
 * Rule: when the current URL contains ?test=1, every Soccerex API request
 * must also include test=1. The backend then routes to the evaluation /
 * test schema rather than production data.
 *
 * Detection is read from window.location at call time (no caching), so the
 * setting follows the URL without a reload. Per-request overrides are
 * supported so an authenticated profile-editor session in test mode can
 * keep test=1 on its API calls even if the user momentarily lands on a
 * URL that doesn't carry the flag.
 */

/** True if window.location.search currently has test=1. */
export function isTestModeFromUrl() {
  if (typeof window === 'undefined') return false
  try {
    return new URLSearchParams(window.location.search).get('test') === '1'
  } catch {
    return false
  }
}

/** '?test=1' when active, '' otherwise. Use when constructing share links. */
export function testSearchSuffix() {
  return isTestModeFromUrl() ? '?test=1' : ''
}

/**
 * Append test=1 to an outgoing API URL.
 *
 * @param {string} url   absolute or relative URL
 * @param {{ test?: boolean }} [opts] explicit per-request override
 */
export function withTestParam(url, opts = {}) {
  const active = opts.test === true || isTestModeFromUrl()
  if (!active) return url
  /* Don't double-add. */
  if (/[?&]test=1(?:&|$)/.test(url)) return url
  return url + (url.includes('?') ? '&' : '?') + 'test=1'
}

/**
 * Merge ?test=1 into a target URL (used for client-side navigation links).
 * Preserves an existing ?test=1 if already there.
 */
export function withTestSearch(pathOrUrl) {
  if (!isTestModeFromUrl()) return pathOrUrl
  if (/[?&]test=1(?:&|$)/.test(pathOrUrl)) return pathOrUrl
  return pathOrUrl + (pathOrUrl.includes('?') ? '&' : '?') + 'test=1'
}
