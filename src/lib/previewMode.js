/**
 * Draft-preview mode.
 *
 * The site shows published work only. A preview token in the URL
 * (?preview=<token>) lets the team read an event's schedule, program themes and
 * speakers exactly as an attendee will, before any of it is published.
 *
 * The token is minted by the backend, is unlisted and expires on its own. It is
 * scoped to one event and grants nothing but read access to those pages, so the
 * rule here is simply: whatever token the page URL carries, forward it on every
 * API call and keep it on internal links, so a preview session survives
 * navigation between the three views.
 *
 * Read from window.location at call time, so it follows the URL without a reload.
 */

const PARAM = 'preview'

/** The preview token in the current URL, or '' when not previewing. */
export function previewTokenFromUrl() {
  if (typeof window === 'undefined') return ''
  try {
    return new URLSearchParams(window.location.search).get(PARAM) || ''
  } catch {
    return ''
  }
}

/** True when the current URL carries a preview token. */
export function isPreviewFromUrl() {
  return previewTokenFromUrl() !== ''
}

/**
 * Append the preview token to an outgoing API URL.
 *
 * @param {string} url absolute or relative URL
 * @param {{ preview?: string }} [opts] explicit per-request override
 */
export function withPreviewParam(url, opts = {}) {
  const token = opts.preview || previewTokenFromUrl()
  if (!token) return url
  if (new RegExp(`[?&]${PARAM}=`).test(url)) return url
  return url + (url.includes('?') ? '&' : '?') + `${PARAM}=${encodeURIComponent(token)}`
}

/** Carry the preview token across client-side navigation links. */
export function withPreviewSearch(pathOrUrl) {
  const token = previewTokenFromUrl()
  if (!token) return pathOrUrl
  if (new RegExp(`[?&]${PARAM}=`).test(pathOrUrl)) return pathOrUrl
  return pathOrUrl + (pathOrUrl.includes('?') ? '&' : '?') + `${PARAM}=${encodeURIComponent(token)}`
}
