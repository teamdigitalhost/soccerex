/**
 * Soccerex public API client.
 *
 * Reads from import.meta.env.VITE_SOCCEREX_API_BASE_URL. Set that variable when
 * the backend moves domains; the fallback is only the current Laravel Cloud
 * platform service URL.
 *
 * Endpoint shapes (sampled 2026-05-10):
 *   GET /events/{slug}                         -> { data: Event }
 *   GET /events/{slug}/agenda-concept          -> Topic[]    (raw array)
 *   GET /events/{slug}/agenda                  -> Session[]  (raw array)
 *   GET /events/{slug}/speakers                -> Speaker[]  (raw array)
 *   POST /events/{slug}/program-submissions    -> { data: Submission }, 201
 */

const DEFAULT_BASE = 'https://soccerex.digitalhost.co/api/v1'

export const API_BASE_URL =
  (import.meta.env && import.meta.env.VITE_SOCCEREX_API_BASE_URL) || DEFAULT_BASE

class ApiError extends Error {
  constructor(message, { status, body } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

async function request(path, { method = 'GET', body, signal } = {}) {
  const url = `${API_BASE_URL}${path}`
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  let res
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch (err) {
    if (err && err.name === 'AbortError') throw err
    throw new ApiError(`Network error contacting Soccerex API: ${err.message}`, { status: 0 })
  }

  let parsed = null
  const text = await res.text()
  if (text) {
    try { parsed = JSON.parse(text) } catch { /* leave parsed null on non-JSON */ }
  }

  if (!res.ok) {
    const message = (parsed && (parsed.message || parsed.error)) || `Request failed: ${res.status} ${res.statusText}`
    throw new ApiError(message, { status: res.status, body: parsed })
  }
  return parsed
}

/* Most list endpoints return a raw array; the event detail endpoint wraps in
   { data }. unwrap() handles both so callers don't have to care. */
function unwrap(payload) {
  if (payload && typeof payload === 'object' && 'data' in payload) return payload.data
  return payload
}

export async function getEvent(slug, opts = {}) {
  return unwrap(await request(`/events/${encodeURIComponent(slug)}`, opts))
}

export async function getAgendaConcept(slug, opts = {}) {
  return unwrap(await request(`/events/${encodeURIComponent(slug)}/agenda-concept`, opts))
}

export async function getAgenda(slug, opts = {}) {
  return unwrap(await request(`/events/${encodeURIComponent(slug)}/agenda`, opts))
}

export async function getEventSpeakers(slug, opts = {}) {
  return unwrap(await request(`/events/${encodeURIComponent(slug)}/speakers`, opts))
}

export async function getEventSpeaker(eventSlug, speakerSlug, opts = {}) {
  return unwrap(await request(
    `/events/${encodeURIComponent(eventSlug)}/speakers/${encodeURIComponent(speakerSlug)}`,
    opts,
  ))
}

/**
 * payload shape:
 *   { kind: 'speaker_interest' | 'topic_suggestion' | 'session_proposal',
 *     topic_slug?: string, name: string, email: string,
 *     company?, role?, proposal?, bio? }
 */
export async function submitProgrammingProposal(slug, payload, opts = {}) {
  return unwrap(await request(`/events/${encodeURIComponent(slug)}/program-submissions`, {
    method: 'POST',
    body: payload,
    ...opts,
  }))
}

export { ApiError }
