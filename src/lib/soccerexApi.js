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

import { withTestParam } from './testMode'

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

async function request(path, { method = 'GET', body, signal, test } = {}) {
  const url = withTestParam(`${API_BASE_URL}${path}`, { test })
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

/* ───── Marketing CMS: content pillars + articles + social posts ─────────
   The pillar is the strategy layer. Articles are owned long-form content
   tied to a pillar. Social posts are platform-specific satellites of
   either a pillar or an article. */

export async function getContentPillars(opts = {}) {
  return unwrap(await request('/content-pillars', opts))
}

export async function getContentPillar(slug, opts = {}) {
  return unwrap(await request(`/content-pillars/${encodeURIComponent(slug)}`, opts))
}

export async function getArticlesByPillar(slug, opts = {}) {
  return unwrap(await request(`/articles?pillar=${encodeURIComponent(slug)}`, opts))
}

/** platform: 'linkedin' | 'instagram' | 'x' */
export async function getSocialPostsByPillar(slug, platform, opts = {}) {
  const qs = new URLSearchParams({ pillar: slug })
  if (platform) qs.set('platform', platform)
  return unwrap(await request(`/social-posts?${qs.toString()}`, opts))
}

/**
 * Lead pre-register submission. Used by event pre-register / rights-holder forms.
 * Backend creates a lead row only; admins qualify and convert later.
 *
 * Required: { email }. Recommended: full_name, organisation, role, country,
 * event_slug, attendee_type, interest, source, source_url, marketing_opt_in.
 *
 * Backend accepts the US-spelled and shorter aliases too: name / company /
 * organization. Returns { id, kind, status, received_at } at HTTP 201.
 *
 * On 422 the caller gets an ApiError whose .body.errors is a
 * Laravel field -> string[] map.
 */
export async function preregisterLead(payload, opts = {}) {
  return unwrap(await request('/leads/preregister', {
    method: 'POST',
    body: payload,
    test: opts.test,
  }))
}

/* ───── Profile self-service (auth via short-lived edit_token) ───────────── */

async function authedRequest(path, { method = 'GET', body, token, signal, formData, test } = {}) {
  const url = withTestParam(`${API_BASE_URL}${path}`, { test })
  const headers = { Accept: 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  let fetchBody
  if (formData) {
    fetchBody = formData /* let the browser set the multipart boundary */
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    fetchBody = JSON.stringify(body)
  }

  let res
  try {
    res = await fetch(url, { method, headers, body: fetchBody, signal })
  } catch (err) {
    if (err && err.name === 'AbortError') throw err
    throw new ApiError(`Network error contacting Soccerex API: ${err.message}`, { status: 0 })
  }

  let parsed = null
  const text = await res.text()
  if (text) { try { parsed = JSON.parse(text) } catch { /* leave parsed null */ } }

  if (!res.ok) {
    const message = (parsed && (parsed.message || parsed.error)) || `Request failed: ${res.status} ${res.statusText}`
    throw new ApiError(message, { status: res.status, body: parsed })
  }
  return parsed
}

export async function requestProfileAccess({ email, profile_slug } = {}, opts = {}) {
  return await authedRequest('/profile-access/request', {
    method: 'POST',
    body: profile_slug ? { email, profile_slug } : { email },
    test: opts.test,
  })
}

export async function previewProfileAccess(token, opts = {}) {
  return unwrap(await authedRequest('/profile-access/preview', {
    method: 'POST', body: { token }, test: opts.test,
  }))
}

export async function exchangeProfileAccess(token, opts = {}) {
  /* Spec gives { edit_token, expires_at, ... }. We pass the parsed payload
     through as-is so the caller can stash it (including profiles + email
     for the chooser UI). */
  const payload = await authedRequest('/profile-access/exchange', {
    method: 'POST', body: { token }, test: opts.test,
  })
  return (payload && 'data' in payload) ? payload.data : payload
}

export async function getEditableProfile(slug, editToken, opts = {}) {
  return unwrap(await authedRequest(
    `/profile-access/profiles/${encodeURIComponent(slug)}`,
    { token: editToken, test: opts.test },
  ))
}

export async function updateEditableProfile(slug, editToken, patch, opts = {}) {
  return unwrap(await authedRequest(
    `/profile-access/profiles/${encodeURIComponent(slug)}`,
    { method: 'PATCH', body: patch, token: editToken, test: opts.test },
  ))
}

/**
 * Upload one or more files to a profile.
 * fields: { kind, featured?, alt_text?, tags?: string[], files: File[] }
 */
export async function uploadProfileAssets(slug, editToken, fields, opts = {}) {
  const fd = new FormData()
  fd.append('kind', fields.kind)
  if (fields.featured !== undefined) fd.append('featured', fields.featured ? '1' : '0')
  if (fields.alt_text) fd.append('alt_text', fields.alt_text)
  if (Array.isArray(fields.tags)) {
    fields.tags.forEach((t) => fd.append('tags[]', t))
  }
  ;(fields.files || []).forEach((f) => fd.append('files[]', f))
  return unwrap(await authedRequest(
    `/profile-access/profiles/${encodeURIComponent(slug)}/assets`,
    { method: 'POST', formData: fd, token: editToken, test: opts.test },
  ))
}

export { ApiError }
