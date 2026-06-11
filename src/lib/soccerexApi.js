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
  const apiTestSecret = getApiTestSecret(url)
  if (apiTestSecret) headers['X-Soccerex-Test-Secret'] = apiTestSecret

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

function getApiTestSecret(url) {
  if (!/[?&]test=1(?:&|$)/.test(url) || typeof window === 'undefined') return ''
  try {
    return window.sessionStorage.getItem('soccerexApiTestSecret') || ''
  } catch {
    return ''
  }
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

/* ───── Insights CMS: articles + internal editorial labels + social posts ─
   Articles are the public content type. Editorial labels remain an internal
   planning taxonomy for filtering and social strategy, not a public section. */

export async function getArticles(filters = {}, opts = {}) {
  const { test: filterTest, ...queryFilters } = filters
  const { test = filterTest, signal } = opts
  const qs = new URLSearchParams()

  Object.entries(queryFilters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    qs.set(key, String(value))
  })

  const path = qs.toString() ? `/articles?${qs.toString()}` : '/articles'
  return unwrap(await request(path, { test, signal }))
}

export async function getContentPillars(opts = {}) {
  return unwrap(await request('/content-pillars', opts))
}

export async function getContentPillar(slug, opts = {}) {
  return unwrap(await request(`/content-pillars/${encodeURIComponent(slug)}`, opts))
}

export async function getArticlesByPillar(slug, opts = {}) {
  return getArticles({ label: slug }, opts)
}

export async function getArticle(slug, opts = {}) {
  return unwrap(await request(`/articles/${encodeURIComponent(slug)}`, opts))
}

/* ───── Invitation accept flow ──────────────────────────────────────────────
 * Backend issues an invite_token via email. The recipient lands on
 * /invite/:token on the React frontend, which previews via GET and accepts
 * via POST. The accept response returns a backend magic-link URL that the
 * browser is redirected to in order to actually establish the session.
 */
export async function previewInvitation(token, opts = {}) {
  return unwrap(await request(`/invitations/${encodeURIComponent(token)}`, opts))
}

export async function acceptInvitation(token, opts = {}) {
  return unwrap(await request(`/invitations/${encodeURIComponent(token)}/accept`, {
    method: 'POST',
    body: {},
    test: opts.test,
  }))
}

export async function declineInvitation(token, opts = {}) {
  return unwrap(await request(`/invitations/${encodeURIComponent(token)}/decline`, {
    method: 'POST',
    body: {},
    test: opts.test,
  }))
}

/* ───── Deal Network unlisted apply flow ────────────────────────────────── */

export async function dealNetworkApplyStart(email, opts = {}) {
  const payload = await request('/deal-network/apply/start', {
    method: 'POST',
    body: { email },
    test: opts.test,
  })
  const data = unwrap(payload)
  return payload?.debug && data && typeof data === 'object'
    ? { ...data, debug: payload.debug }
    : data
}

export async function dealNetworkApplyPreview(token, opts = {}) {
  return unwrap(await request('/deal-network/apply/preview', {
    method: 'POST',
    body: { token },
    test: opts.test,
  }))
}

export async function dealNetworkSearchCompanies(token, q, opts = {}) {
  return unwrap(await request('/deal-network/apply/search-companies', {
    method: 'POST',
    body: { token, q },
    test: opts.test,
  }))
}

export async function dealNetworkApplyClaim(payload, opts = {}) {
  return unwrap(await request('/deal-network/apply/claim', {
    method: 'POST',
    body: payload,
    test: opts.test,
  }))
}

/* ── Email-gated pricing access (magic-link + profile creation) ─────────── */

// Public: the gated categories + reveal mode (config-driven on the backend).
// Returns { event_slug, reveal_mode, categories: [{ key, label, blurb, path }] }.
export async function pricingCategories({ test } = {}) {
  return unwrap(await request('/pricing/categories', { test }))
}

// Step 1: send the magic link for a category. Returns { ok, message }.
export async function pricingAccessStart(email, { eventSlug, returnPath, category, test } = {}) {
  return unwrap(await request('/pricing/access/start', {
    method: 'POST',
    body: { email, event_slug: eventSlug, return_path: returnPath, category },
    test,
  }))
}

// Step 2: verify the clicked link. Returns { access, profile, grant, category, packages }.
export async function pricingAccessVerify(token, { name, company, test } = {}) {
  return unwrap(await request('/pricing/access/verify', {
    method: 'POST',
    body: { token, name, company },
    test,
  }))
}

// Team preview: allowlisted email + passcode unlock a category, no email round-trip
// and no lead created. Returns { access, preview, grant, category, packages }.
export async function pricingPreview(email, passcode, category, { test } = {}) {
  return unwrap(await request('/pricing/access/preview', {
    method: 'POST',
    body: { email, passcode, category },
    test,
  }))
}

// Re-fetch a category's packages on a later visit with a stored grant. Returns { category, packages }.
export async function pricingPackages(grant, { eventSlug, category, test } = {}) {
  return unwrap(await request('/pricing/packages', {
    method: 'POST',
    body: { grant, event_slug: eventSlug, category },
    test,
  }))
}

// Register interest in a specific package (high-intent: creates a scored lead +
// an assigned sales callback). Needs the unlock grant. Returns { ok, assigned, rep_name }.
export async function pricingInterest({ grant, package_slug, contact_method, phone, best_time, name, note, budget } = {}, { test } = {}) {
  return unwrap(await request('/pricing/interest', {
    method: 'POST',
    body: { grant, package_slug, contact_method, phone, best_time, name, note, budget },
    test,
  }))
}

// Fire-and-forget page-view beacon. Never throws (analytics must not break UX).
export async function trackPageView(payload, { test } = {}) {
  try {
    await request('/analytics/page-view', { method: 'POST', body: payload, test })
  } catch { /* swallow: analytics is best-effort */ }
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

/* ───── Deal Network (public concierge intake) ──────────────────────────────
 * Soccerex-curated commercial introductions. The public intake is open
 * (rate-limited server-side); the per-member portal lives behind the
 * profile-access edit_token below.
 */
export async function submitDealNetworkIntake(payload, opts = {}) {
  return unwrap(await request('/deal-network/intakes', {
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
/* Preview is read from the URL on a fresh tab (the link includes &test=1)
   so the caller in ProfileAccess.jsx now passes { test: isTestModeFromUrl() }
   — see fix at the call site in ProfileAccess.jsx. */

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

export async function deleteProfileAsset(slug, editToken, assetId, opts = {}) {
  return unwrap(await authedRequest(
    `/profile-access/profiles/${encodeURIComponent(slug)}/assets/${assetId}`,
    { method: 'DELETE', token: editToken, test: opts.test },
  ))
}

/**
 * Sponsor / exhibitor company portal — aggregates everything the company
 * needs to manage their participation: next_actions, deliverables, assets
 * summary, pass allocation, agreements + invoices, orders + tickets, plus
 * a compact profile summary.
 *
 * Authed with the same bearer edit_token used by the profile editor. Deal
 * margin and private staff notes are explicitly NOT in this response — the
 * backend hides them. The frontend never has to filter.
 */
export async function getCompanyPortal(slug, editToken, opts = {}) {
  return unwrap(await authedRequest(
    `/profile-access/profiles/${encodeURIComponent(slug)}/portal`,
    { token: editToken, test: opts.test },
  ))
}

/**
 * Assign one of the company's allocated passes to a named attendee.
 *
 * body: { event_id, pass_type: 'delegate' | 'vip', attendee_name, attendee_email, attendee_role? }
 */
export async function assignCompanyPass(slug, editToken, body, opts = {}) {
  return unwrap(await authedRequest(
    `/profile-access/profiles/${encodeURIComponent(slug)}/portal/pass-assignments`,
    { method: 'POST', body, token: editToken, test: opts.test },
  ))
}

/**
 * Manage an existing sponsor-allocated pass.
 *
 * action: 'resend' | 'cancel' | 'reassign'
 * For 'reassign', pass `new_attendee_name` and `new_attendee_email`.
 * Optional `reason` for cancel.
 */
/**
 * Stream the sponsor briefing pack PDF and trigger a browser download.
 * Optional opts.eventSlug to narrow to one event.
 */
export async function downloadBriefingPack(slug, editToken, opts = {}) {
  const params = new URLSearchParams()
  if (opts.eventSlug) params.set('event', opts.eventSlug)
  const qs = params.toString() ? `?${params.toString()}` : ''
  const url = withTestParam(
    `${API_BASE_URL}/profile-access/profiles/${encodeURIComponent(slug)}/portal/briefing-pack.pdf${qs}`,
    { test: opts.test },
  )
  const res = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${editToken}` },
  })
  if (! res.ok) {
    const text = await res.text().catch(() => '')
    throw new ApiError(res.status, text || `Download failed (${res.status})`)
  }
  const blob = await res.blob()
  const filename = (() => {
    const disp = res.headers.get('content-disposition') || ''
    const m = disp.match(/filename="?([^";]+)"?/i)
    return m ? m[1] : `briefing-${slug}.pdf`
  })()
  const objectUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = objectUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
}

export async function managePortalPass(slug, editToken, ticketId, body, opts = {}) {
  return unwrap(await authedRequest(
    `/profile-access/profiles/${encodeURIComponent(slug)}/portal/passes/${encodeURIComponent(ticketId)}/manage`,
    { method: 'POST', body, token: editToken, test: opts.test },
  ))
}

/**
 * Invite a teammate to co-manage this company profile. Returns refreshed
 * team list.
 *
 * body: { email, role?: 'owner' | 'editor' | 'viewer' }
 */
export async function inviteCompanyTeammate(slug, editToken, body, opts = {}) {
  return unwrap(await authedRequest(
    `/profile-access/profiles/${encodeURIComponent(slug)}/portal/team`,
    { method: 'POST', body, token: editToken, test: opts.test },
  ))
}

/**
 * Revoke a pending invitation or remove an accepted teammate by membership id.
 */
export async function revokeCompanyTeammate(slug, editToken, membershipId, opts = {}) {
  return unwrap(await authedRequest(
    `/profile-access/profiles/${encodeURIComponent(slug)}/portal/team/${encodeURIComponent(membershipId)}`,
    { method: 'DELETE', token: editToken, test: opts.test },
  ))
}

/**
 * Post a deliverable update from the company portal.
 *
 * source: 'deal' | 'agreement'
 * action: 'acknowledge' | 'add_note' | 'request_help' | 'submit_evidence' | 'ready_for_review'
 *
 * For 'submit_evidence', pass a `files` array (File[]) and/or `urls` array
 * (string[]) inside fields; we'll switch to multipart form data automatically.
 * Other actions accept a `note` (string).
 */
export async function postDeliverableUpdate(slug, editToken, source, sourceId, fields, opts = {}) {
  const path = `/profile-access/profiles/${encodeURIComponent(slug)}/portal/deliverables/${encodeURIComponent(source)}/${encodeURIComponent(sourceId)}/updates`
  const hasFiles = Array.isArray(fields.files) && fields.files.length > 0
  if (hasFiles) {
    const fd = new FormData()
    fd.append('action', fields.action)
    if (fields.note) fd.append('note', fields.note)
    fields.files.forEach((f) => fd.append('files[]', f))
    ;(fields.urls || []).forEach((u) => fd.append('urls[]', u))
    return unwrap(await authedRequest(path, { method: 'POST', formData: fd, token: editToken, test: opts.test }))
  }
  return unwrap(await authedRequest(path, {
    method: 'POST',
    body: { action: fields.action, note: fields.note, urls: fields.urls },
    token: editToken,
    test: opts.test,
  }))
}

/* ───── Speaker portal ─────────────────────────────────────────────────── */
export async function getSpeakerPortal(slug, editToken, opts = {}) {
  return unwrap(await authedRequest(
    `/profile-access/profiles/${encodeURIComponent(slug)}/speaker-portal`,
    { token: editToken, test: opts.test },
  ))
}

/* ───── Rights-holder portal ───────────────────────────────────────────── */
export async function getRightsHolderPortal(slug, editToken, opts = {}) {
  return unwrap(await authedRequest(
    `/profile-access/profiles/${encodeURIComponent(slug)}/rights-holder-portal`,
    { token: editToken, test: opts.test },
  ))
}

/* ───── Delegate portal + schedule + networking ────────────────────────── */
export async function getDelegatePortal(slug, editToken, opts = {}) {
  return unwrap(await authedRequest(
    `/profile-access/profiles/${encodeURIComponent(slug)}/delegate-portal`,
    { token: editToken, test: opts.test },
  ))
}

export async function setDelegateSavedSession(slug, editToken, sessionId, body, opts = {}) {
  return unwrap(await authedRequest(
    `/profile-access/profiles/${encodeURIComponent(slug)}/delegate-portal/schedule/${encodeURIComponent(sessionId)}`,
    { method: 'POST', body, token: editToken, test: opts.test },
  ))
}

export async function getDelegateNetworking(slug, editToken, filters = {}, opts = {}) {
  const qs = new URLSearchParams()
  if (filters.event_id) qs.set('event_id', filters.event_id)
  if (filters.event_slug) qs.set('event_slug', filters.event_slug)
  const suffix = qs.toString() ? `?${qs.toString()}` : ''
  return unwrap(await authedRequest(
    `/profile-access/profiles/${encodeURIComponent(slug)}/delegate-portal/networking${suffix}`,
    { token: editToken, test: opts.test },
  ))
}

export async function updateDelegateNetworking(slug, editToken, prefs, opts = {}) {
  return unwrap(await authedRequest(
    `/profile-access/profiles/${encodeURIComponent(slug)}/delegate-portal/networking`,
    { method: 'PATCH', body: prefs, token: editToken, test: opts.test },
  ))
}

/* ───── VIP overlay ────────────────────────────────────────────────────── */
export async function getVipPortal(slug, editToken, opts = {}) {
  return unwrap(await authedRequest(
    `/profile-access/profiles/${encodeURIComponent(slug)}/vip-portal`,
    { token: editToken, test: opts.test },
  ))
}

export async function rsvpVipExperience(slug, editToken, experienceId, body, opts = {}) {
  return unwrap(await authedRequest(
    `/profile-access/profiles/${encodeURIComponent(slug)}/vip-portal/experiences/${encodeURIComponent(experienceId)}/rsvp`,
    { method: 'POST', body, token: editToken, test: opts.test },
  ))
}

/* ───── Deal Network member portal ─────────────────────────────────────────
 * Aggregates membership, intakes (the user's briefs), curated matches, and
 * concierge-scheduled meetings for an authenticated profile manager. All
 * mutations return the refreshed portal payload alongside the changed entity.
 */
export async function getDealNetworkPortal(slug, editToken, opts = {}) {
  return unwrap(await authedRequest(
    `/profile-access/profiles/${encodeURIComponent(slug)}/deal-network-portal`,
    { token: editToken, test: opts.test },
  ))
}

export async function submitDealNetworkPortalIntake(slug, editToken, payload, opts = {}) {
  return unwrap(await authedRequest(
    `/profile-access/profiles/${encodeURIComponent(slug)}/deal-network-portal/intakes`,
    { method: 'POST', body: payload, token: editToken, test: opts.test },
  ))
}

export async function updateDealNetworkPortalIntake(slug, editToken, intakeId, patch, opts = {}) {
  return unwrap(await authedRequest(
    `/profile-access/profiles/${encodeURIComponent(slug)}/deal-network-portal/intakes/${encodeURIComponent(intakeId)}`,
    { method: 'PATCH', body: patch, token: editToken, test: opts.test },
  ))
}

export async function respondToDealNetworkMeeting(slug, editToken, meetingId, body, opts = {}) {
  return unwrap(await authedRequest(
    `/profile-access/profiles/${encodeURIComponent(slug)}/deal-network-portal/meetings/${encodeURIComponent(meetingId)}/response`,
    { method: 'POST', body, token: editToken, test: opts.test },
  ))
}

/* ───── Agenda collaboration portal (profile-access overview) ──────────────
 * Read-only summary of every agenda review the person has been invited to,
 * for the stacked personal portal. 404 = no collaborations for this profile.
 */
export async function getAgendaCollabPortal(slug, editToken, opts = {}) {
  return unwrap(await authedRequest(
    `/profile-access/profiles/${encodeURIComponent(slug)}/agenda-collab-portal`,
    { token: editToken, test: opts.test },
  ))
}

/* ───── Agenda collaborator review (external advisors, token link) ─────────
 * Outside advisors receive a personal link (/agenda-collab?token=...) to
 * review draft agenda topics: comment, star, and suggest edits / new topics.
 * Auth is the opaque token carried in each POST body — no bearer header.
 * 404 = unknown token, 403 = revoked; callers branch on ApiError.status.
 */
export async function getAgendaCollabSession(token, opts = {}) {
  return unwrap(await request('/agenda-collab/session', {
    method: 'POST',
    body: { token },
    test: opts.test,
    signal: opts.signal,
  }))
}

export async function postAgendaCollabComment({ token, topic_id, body, parent_id } = {}, opts = {}) {
  return unwrap(await request('/agenda-collab/comments', {
    method: 'POST',
    body: { token, topic_id, body, ...(parent_id ? { parent_id } : {}) },
    test: opts.test,
  }))
}

/**
 * payload shape:
 *   { token, type: 'new_topic' | 'edit',
 *     topic_id?  (required for 'edit'),
 *     title?     (required for 'new_topic'),
 *     summary?, theme?, audience?, note? }
 */
export async function submitAgendaCollabSuggestion(payload, opts = {}) {
  return unwrap(await request('/agenda-collab/suggestions', {
    method: 'POST',
    body: payload,
    test: opts.test,
  }))
}

export async function setAgendaCollabVote({ token, topic_id, vote } = {}, opts = {}) {
  return unwrap(await request('/agenda-collab/votes', {
    method: 'POST',
    body: { token, topic_id, vote },
    test: opts.test,
  }))
}

/**
 * Create the minimal Soccerex person profile for a collaborator and link it
 * to their invite. payload: { token, name, title? } → { profile }.
 */
export async function createAgendaCollabProfile(payload, opts = {}) {
  return unwrap(await request('/agenda-collab/profile', {
    method: 'POST',
    body: payload,
    test: opts.test,
  }))
}

/* ───── Public lead intake (unauthenticated; preregisterLead lives above) ── */
export async function submitLead(kind, payload, opts = {}) {
  return unwrap(await request(`/leads/${encodeURIComponent(kind)}`, {
    method: 'POST',
    body: payload,
    test: opts.test,
  }))
}

export { ApiError }
