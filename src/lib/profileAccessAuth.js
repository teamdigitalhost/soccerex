/**
 * Storage for the short-lived edit_token returned by /profile-access/exchange.
 *
 * Default: sessionStorage (tab-scoped, cleared when the tab closes).
 * Opt-in: localStorage with the expires_at the API returned. We honor that
 * timestamp on every read and clear stale values eagerly.
 *
 * The edit_token never appears in a URL or query param.
 */

const KEY = 'soccerex.profileAccess.v1'

function pickStore(persist) {
  return persist ? window.localStorage : window.sessionStorage
}

function readFrom(store) {
  try {
    const raw = store.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || !parsed.edit_token) return null
    if (parsed.expires_at) {
      const exp = new Date(parsed.expires_at).getTime()
      if (Number.isFinite(exp) && exp < Date.now()) return null
    }
    return parsed
  } catch {
    return null
  }
}

export function readProfileAccessSession() {
  /* sessionStorage takes precedence if both present (a fresh exchange always
     writes session; localStorage is only used when the user opts in). */
  return readFrom(window.sessionStorage) || readFrom(window.localStorage)
}

export function writeProfileAccessSession({ edit_token, expires_at, profiles, email, persist = false, is_test = false }) {
  const payload = { edit_token, expires_at, profiles, email, persist, is_test, stored_at: new Date().toISOString() }
  const store = pickStore(persist)
  store.setItem(KEY, JSON.stringify(payload))
  /* If switching modes, clear the other store so we don't leave a stale copy. */
  const other = persist ? window.sessionStorage : window.localStorage
  other.removeItem(KEY)
  return payload
}

export function clearProfileAccessSession() {
  try { window.sessionStorage.removeItem(KEY) } catch { /* ignore */ }
  try { window.localStorage.removeItem(KEY) } catch { /* ignore */ }
}
