import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Star, Loader2, AlertTriangle, Send, PencilLine, Plus, X,
  CalendarDays, MapPin, MessageSquare, CornerDownRight, CheckCircle2,
  Lightbulb, Users, UserPlus, UserCheck, Mail,
} from 'lucide-react'
import {
  getAgendaCollabSession,
  postAgendaCollabComment,
  submitAgendaCollabSuggestion,
  setAgendaCollabVote,
  createAgendaCollabProfile,
  requestProfileAccess,
} from '../lib/soccerexApi'
import { isTestModeFromUrl } from '../lib/testMode'

/* ═══ Agenda collaborator review ═════════════════════════════════════════
 * External advisors land here from a personal email link
 * (/agenda-collab?token=XYZ) to review draft agenda topics for an event:
 * read topics grouped by theme, comment (threaded, sees team replies),
 * star topics, suggest edits, and propose brand-new topics.
 *
 * Brand palette mirrors DealNetwork / DealNetworkApply:
 *   navy  #09203e   navy-deep #050d1a
 *   gold  var(--color-brand-accent)
 *   cream #f4f3f0 (light content area)
 */

const NAVY = '#09203e'
const NAVY_DEEP = '#050d1a'
const CREAM = '#f4f3f0'

/* status (machine key) → chip tint. Falls back to the label heuristic so an
 * unexpected key still renders something sensible. */
const STATUS_TINTS = {
  draft:       { bg: 'rgba(37,99,235,0.10)',  border: 'rgba(37,99,235,0.28)',  color: '#1d4ed8' },
  in_review:   { bg: 'rgba(234,88,12,0.10)',  border: 'rgba(234,88,12,0.30)',  color: '#c2410c' },
  approved:    { bg: 'rgba(22,163,74,0.10)',  border: 'rgba(22,163,74,0.28)',  color: '#15803d' },
  in_program:  { bg: 'rgba(22,163,74,0.10)',  border: 'rgba(22,163,74,0.28)',  color: '#15803d' },
}

function statusTint(status, label) {
  if (STATUS_TINTS[status]) return STATUS_TINTS[status]
  const l = String(label || status || '').toLowerCase()
  if (l.includes('review')) return STATUS_TINTS.in_review
  if (l.includes('approv') || l.includes('program')) return STATUS_TINTS.approved
  return STATUS_TINTS.draft
}

const SUGGESTION_TINTS = {
  open:      { bg: 'rgba(234,88,12,0.10)', border: 'rgba(234,88,12,0.30)', color: '#c2410c', label: 'Waiting review' },
  accepted:  { bg: 'rgba(22,163,74,0.10)', border: 'rgba(22,163,74,0.28)', color: '#15803d', label: 'Accepted' },
  dismissed: { bg: 'rgba(9,32,62,0.07)',   border: 'rgba(9,32,62,0.16)',   color: '#64748b', label: 'Not taken forward' },
}

function formatDate(iso) {
  if (!iso) return ''
  // Date-only strings ("2026-11-18") parse as UTC midnight and shift a day in
  // western timezones — anchor them to noon so the calendar date is stable.
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T12:00:00` : iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatDateTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AgendaCollab() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const testMode = isTestModeFromUrl()

  // No token in the URL at all → straight to the friendly invalid-link state.
  const [loading, setLoading] = useState(!!token)
  const [linkInvalid, setLinkInvalid] = useState(!token) // also set on 404 / 403
  const [error, setError] = useState('')
  const [session, setSession] = useState(null)
  const [profileJustCreated, setProfileJustCreated] = useState(false)

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Agenda Review — Soccerex'
    }
  }, [])

  useEffect(() => {
    if (!token) return
    let cancelled = false
    getAgendaCollabSession(token, { test: testMode })
      .then((res) => {
        if (cancelled) return
        setSession(res)
        setError('')
      })
      .catch((err) => {
        if (cancelled) return
        if (err?.status === 404 || err?.status === 403) setLinkInvalid(true)
        else setError(err?.message || 'Could not load the agenda review.')
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [token, testMode])

  /* ── per-topic optimistic mutators ─────────────────────────────────── */

  function patchTopic(topicId, patch) {
    setSession((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        topics: (prev.topics || []).map((t) =>
          t.id === topicId ? { ...t, ...(typeof patch === 'function' ? patch(t) : patch) } : t),
      }
    })
  }

  async function handleVote(topic) {
    const next = !topic.my_vote
    // optimistic flip; reconciled with the server payload below
    patchTopic(topic.id, (t) => ({
      my_vote: next,
      votes_count: Math.max(0, (t.votes_count || 0) + (next ? 1 : -1)),
    }))
    try {
      const res = await setAgendaCollabVote({ token, topic_id: topic.id, vote: next }, { test: testMode })
      if (res && typeof res.votes_count !== 'undefined') {
        patchTopic(topic.id, { my_vote: res.my_vote, votes_count: res.votes_count })
      }
    } catch {
      // roll back on failure
      patchTopic(topic.id, (t) => ({
        my_vote: !next,
        votes_count: Math.max(0, (t.votes_count || 0) + (next ? -1 : 1)),
      }))
    }
  }

  async function handleComment(topic, body, parentId) {
    const res = await postAgendaCollabComment(
      { token, topic_id: topic.id, body, parent_id: parentId || undefined },
      { test: testMode },
    )
    const collaboratorName = session?.collaborator?.name || 'You'
    patchTopic(topic.id, (t) => ({
      comments: [
        ...(t.comments || []),
        {
          id: res?.id ?? `tmp-${Date.now()}`,
          parent_id: parentId || null,
          author: collaboratorName,
          is_team: false,
          body,
          created_at: res?.created_at || new Date().toISOString(),
        },
      ],
    }))
  }

  async function handleSuggestion(payload) {
    const res = await submitAgendaCollabSuggestion({ token, ...payload }, { test: testMode })
    const { type, topic_id, ...fields } = payload
    setSession((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        my_suggestions: [
          {
            id: res?.id ?? `tmp-${Date.now()}`,
            type,
            topic_id: topic_id || null,
            payload: fields,
            status: 'open',
            resolution_note: null,
            created_at: res?.created_at || new Date().toISOString(),
            ...(res && typeof res === 'object' ? res : {}),
          },
          ...(prev.my_suggestions || []),
        ],
      }
    })
  }

  async function handleCreateProfile({ name, title }) {
    const res = await createAgendaCollabProfile(
      { token, name, ...(title ? { title } : {}) },
      { test: testMode },
    )
    setSession((prev) => (prev ? {
      ...prev,
      profile: res?.profile || prev.profile,
      needs_profile: false,
    } : prev))
    setProfileJustCreated(true)
  }

  /* group topics by theme, preserving server order */
  const themeGroups = useMemo(() => {
    const groups = []
    const index = new Map()
    for (const topic of session?.topics || []) {
      const theme = topic.theme || 'General'
      if (!index.has(theme)) {
        index.set(theme, groups.length)
        groups.push({ theme, topics: [] })
      }
      groups[index.get(theme)].topics.push(topic)
    }
    return groups
  }, [session])

  /* ── shell states ──────────────────────────────────────────────────── */

  if (loading) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: '60vh' }}>
          <Loader2 size={28} className="animate-spin" style={{ color: 'var(--color-brand-accent)' }} />
          <p className="font-body mt-4" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
            Loading your agenda review…
          </p>
        </div>
      </Shell>
    )
  }

  if (linkInvalid) {
    return (
      <Shell>
        <div className="flex items-center justify-center" style={{ minHeight: '60vh', padding: '0 20px' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(28px,4vw,44px)', maxWidth: 480, textAlign: 'center', boxShadow: '0 30px 80px rgba(0,0,0,0.45)' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(234,88,12,0.12)', color: '#c2410c', display: 'grid', placeItems: 'center', margin: '0 auto 18px' }}>
              <AlertTriangle size={26} />
            </div>
            <h1 className="font-heading font-bold" style={{ fontSize: '1.35rem', color: NAVY, marginBottom: 10 }}>
              This link isn't valid
            </h1>
            <p className="font-body" style={{ fontSize: '0.95rem', color: '#586778', lineHeight: 1.6 }}>
              Your review link may have expired or been revoked. Please contact the
              Soccerex team and we'll send you a fresh one.
            </p>
          </div>
        </div>
      </Shell>
    )
  }

  if (error || !session) {
    return (
      <Shell>
        <div className="flex items-center justify-center" style={{ minHeight: '60vh', padding: '0 20px' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(28px,4vw,44px)', maxWidth: 480, textAlign: 'center', boxShadow: '0 30px 80px rgba(0,0,0,0.45)' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(239,68,68,0.12)', color: '#b91c1c', display: 'grid', placeItems: 'center', margin: '0 auto 18px' }}>
              <AlertTriangle size={26} />
            </div>
            <h1 className="font-heading font-bold" style={{ fontSize: '1.35rem', color: NAVY, marginBottom: 10 }}>
              Something went wrong
            </h1>
            <p className="font-body" style={{ fontSize: '0.95rem', color: '#586778', lineHeight: 1.6 }}>
              {error || 'Could not load the agenda review.'} Please try again, or contact the Soccerex team.
            </p>
          </div>
        </div>
      </Shell>
    )
  }

  const { collaborator, event, profile, needs_profile: needsProfile, my_suggestions: mySuggestions = [] } = session

  return (
    <Shell>
      {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at top, #0d2b52 0%, ${NAVY_DEEP} 75%)` }} />
        <div className="absolute pointer-events-none" style={{ top: '-30%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,177,112,0.12) 0%, transparent 60%)' }} />

        <div className="relative z-10 mx-auto text-center" style={{ maxWidth: 880, padding: 'clamp(60px,8vw,110px) clamp(20px,5vw,60px) clamp(44px,6vw,72px)' }}>
          <div className="flex justify-center mb-7">
            <img src="/brand/crests/crest-main-white.svg" alt="Soccerex" style={{ height: 52 }} />
          </div>
          <p className="section-label mb-4" style={{ color: 'var(--color-brand-accent)' }}>Agenda review</p>
          <h1 className="font-heading font-bold text-white leading-[1.08] mb-5" style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3.1rem)' }}>
            {event?.name}
          </h1>
          <div className="mx-auto mb-6" style={{ width: 90, height: 3, background: 'linear-gradient(90deg, transparent, var(--color-brand-accent), transparent)' }} />
          <p className="font-body text-white/80 leading-relaxed mx-auto" style={{ fontSize: 'clamp(0.98rem, 1.4vw, 1.1rem)', maxWidth: 640 }}>
            Welcome{collaborator?.name ? `, ${collaborator.name}` : ''}
            {collaborator?.organization ? ` (${collaborator.organization})` : ''}.
            These are the draft topics we're shaping for the program. Star the ones
            that matter most, leave comments, and suggest changes or new topics.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-2" style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>
            {event?.starts_on && (
              <span className="inline-flex items-center gap-2 font-body">
                <CalendarDays size={14} style={{ color: 'var(--color-brand-accent)' }} /> {formatDate(event.starts_on)}
              </span>
            )}
            {event?.venue_name && (
              <span className="inline-flex items-center gap-2 font-body">
                <MapPin size={14} style={{ color: 'var(--color-brand-accent)' }} /> {event.venue_name}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ═══ CONTENT ════════════════════════════════════════════════════ */}
      <section style={{ background: CREAM }}>
        <div className="mx-auto" style={{ maxWidth: 860, padding: 'clamp(36px,5vw,64px) clamp(16px,4vw,40px) clamp(56px,7vw,90px)' }}>

          {/* ── Soccerex profile nudge / identity bar ────────────────── */}
          {needsProfile && !profile && (
            <CreateProfileCard
              defaultName={collaborator?.name || ''}
              onSubmit={handleCreateProfile}
            />
          )}
          {profile && (
            <IdentityBar
              profile={profile}
              email={collaborator?.email}
              justCreated={profileJustCreated}
              testMode={testMode}
            />
          )}

          {themeGroups.length === 0 && (
            <div className="text-center font-body" style={{ color: '#7a8896', padding: '40px 0' }}>
              No topics have been shared with you yet — check back soon.
            </div>
          )}

          {themeGroups.map(({ theme, topics }) => (
            <div key={theme} style={{ marginBottom: 36 }}>
              <div style={{ position: 'sticky', top: 0, zIndex: 5, background: CREAM, padding: '12px 0 10px', marginBottom: 6, borderBottom: '1px solid rgba(9,32,62,0.10)' }}>
                <h2 className="section-label" style={{ color: NAVY }}>{theme}</h2>
              </div>
              {topics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onVote={() => handleVote(topic)}
                  onComment={(body, parentId) => handleComment(topic, body, parentId)}
                  onSuggestEdit={(fields) => handleSuggestion({ type: 'edit', topic_id: topic.id, ...fields })}
                />
              ))}
            </div>
          ))}

          {/* ── Propose a new topic ──────────────────────────────────── */}
          <NewTopicCard onSubmit={(fields) => handleSuggestion({ type: 'new_topic', ...fields })} />

          {/* ── Your suggestions ─────────────────────────────────────── */}
          {mySuggestions.length > 0 && (
            <div style={{ marginTop: 44 }}>
              <div style={{ padding: '12px 0 10px', marginBottom: 14, borderBottom: '1px solid rgba(9,32,62,0.10)' }}>
                <h2 className="section-label" style={{ color: NAVY }}>Your suggestions</h2>
              </div>
              {mySuggestions.map((s) => (
                <SuggestionRow key={s.id} suggestion={s} topics={session.topics || []} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Shell>
  )
}

function Shell({ children }) {
  return <div style={{ background: NAVY_DEEP, minHeight: '100vh' }}>{children}</div>
}

/* ═══ Soccerex profile card (one-time, non-blocking) ═══════════════════ */

function CreateProfileCard({ defaultName, onSubmit }) {
  const [name, setName] = useState(defaultName)
  const [title, setTitle] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e?.preventDefault?.()
    if (busy || !name.trim()) return
    setBusy(true); setError('')
    try {
      await onSubmit({ name: name.trim(), title: title.trim() || undefined })
    } catch (err) {
      setError(err?.message || 'Could not create your profile.')
      setBusy(false)
    }
  }

  return (
    <div style={{ background: '#fff', border: '1px solid rgba(191,177,112,0.55)', borderRadius: 14, padding: 'clamp(18px,3vw,28px)', marginBottom: 28, boxShadow: '0 6px 24px rgba(9,32,62,0.06)' }}>
      <div className="flex items-start gap-3">
        <span style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(191,177,112,0.16)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <UserPlus size={18} style={{ color: 'var(--color-brand-accent)' }} />
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-bold" style={{ fontSize: '1.05rem', color: NAVY }}>
            One quick step — create your Soccerex profile
          </h3>
          <p className="font-body" style={{ fontSize: '0.85rem', color: '#7a8896', marginTop: 2 }}>
            Your profile connects your agenda feedback with everything else you do
            with Soccerex — speaking, the Deal Network, and event access.
          </p>
        </div>
      </div>

      <form onSubmit={submit} style={{ marginTop: 16 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <PanelField label="Name" value={name} onChange={setName} disabled={busy} required />
          <PanelField label="Title / role" value={title} onChange={setTitle} disabled={busy} placeholder="Optional — e.g. Commercial Director" />
        </div>
        {error && <p className="font-body mb-2" style={{ fontSize: '0.78rem', color: '#b91c1c' }}>{error}</p>}
        <button
          type="submit" disabled={busy || !name.trim()}
          className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.14em]"
          style={{
            background: name.trim() ? 'var(--color-brand-accent)' : 'rgba(9,32,62,0.14)',
            color: NAVY, padding: '10px 20px', fontSize: '0.7rem', border: 'none',
            borderRadius: 4, cursor: name.trim() && !busy ? 'pointer' : 'not-allowed',
          }}
        >
          {busy ? <><Loader2 size={13} className="animate-spin" /> Creating</> : <>Create my profile</>}
        </button>
      </form>
    </div>
  )
}

/* ═══ Identity bar (profile already linked) ════════════════════════════ */

function IdentityBar({ profile, email, justCreated, testMode }) {
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function requestPortalLink() {
    if (busy || sent || !email) return
    setBusy(true); setError('')
    try {
      await requestProfileAccess({ email }, { test: testMode })
      setSent(true)
    } catch (err) {
      setError(err?.message || 'Could not send your portal link.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ background: '#fff', border: '1px solid rgba(9,32,62,0.08)', borderRadius: 12, padding: '12px 18px', marginBottom: 28, boxShadow: '0 4px 16px rgba(9,32,62,0.05)' }}>
      <div className="flex flex-wrap items-center gap-3">
        <span style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(191,177,112,0.16)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          {justCreated
            ? <CheckCircle2 size={16} color="#15803d" />
            : <UserCheck size={16} style={{ color: 'var(--color-brand-accent)' }} />}
        </span>
        <span className="font-body flex-1 min-w-0" style={{ fontSize: '0.88rem', color: NAVY }}>
          {justCreated && <strong style={{ fontWeight: 600, color: '#15803d' }}>Profile created. </strong>}
          Connected as <strong style={{ fontWeight: 600 }}>{profile.display_name}</strong>
        </span>
        {sent ? (
          <span className="inline-flex items-center gap-2 font-body" style={{ fontSize: '0.82rem', color: '#15803d' }}>
            <CheckCircle2 size={14} /> Check your inbox — we emailed you a secure link to your Soccerex portal.
          </span>
        ) : (
          <button
            type="button" onClick={requestPortalLink} disabled={busy || !email}
            className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.14em]"
            style={{
              background: 'transparent', color: NAVY, padding: '8px 14px', fontSize: '0.66rem',
              border: '1px solid rgba(9,32,62,0.18)', borderRadius: 4,
              cursor: busy || !email ? 'not-allowed' : 'pointer', flexShrink: 0,
            }}
          >
            {busy ? <><Loader2 size={13} className="animate-spin" /> Sending</> : <><Mail size={13} style={{ color: 'var(--color-brand-accent)' }} /> Open my Soccerex portal</>}
          </button>
        )}
      </div>
      {error && <p className="font-body mt-1.5" style={{ fontSize: '0.78rem', color: '#b91c1c' }}>{error}</p>}
    </div>
  )
}

/* ═══ Topic card ═══════════════════════════════════════════════════════ */

function TopicCard({ topic, onVote, onComment, onSuggestEdit }) {
  const tint = statusTint(topic.status, topic.status_label)
  const [editOpen, setEditOpen] = useState(false)
  const comments = topic.comments || []

  return (
    <article style={{ background: '#fff', border: '1px solid rgba(9,32,62,0.08)', borderRadius: 14, padding: 'clamp(18px,3vw,28px)', marginBottom: 16, boxShadow: '0 6px 24px rgba(9,32,62,0.06)' }}>
      {/* header row: chip + star */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="font-mono uppercase tracking-[0.12em]" style={{
          fontSize: '0.62rem', fontWeight: 700, color: tint.color,
          background: tint.bg, border: `1px solid ${tint.border}`,
          borderRadius: 999, padding: '4px 10px', whiteSpace: 'nowrap',
        }}>
          {topic.status_label || topic.status}
        </span>
        <button
          type="button" onClick={onVote}
          aria-pressed={!!topic.my_vote}
          aria-label={topic.my_vote ? 'Remove star' : 'Star this topic'}
          className="inline-flex items-center gap-1.5"
          style={{
            background: topic.my_vote ? 'rgba(191,177,112,0.16)' : '#f8f7f4',
            border: '1px solid ' + (topic.my_vote ? 'var(--color-brand-accent)' : 'rgba(9,32,62,0.12)'),
            color: NAVY, borderRadius: 999, padding: '5px 12px',
            fontSize: '0.78rem', cursor: 'pointer', flexShrink: 0,
          }}
        >
          <Star size={14} style={{ color: 'var(--color-brand-accent)', fill: topic.my_vote ? 'var(--color-brand-accent)' : 'none' }} />
          <span className="font-body font-semibold">{topic.votes_count ?? 0}</span>
        </button>
      </div>

      <h3 className="font-heading font-bold" style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)', color: NAVY, lineHeight: 1.25, marginBottom: 8 }}>
        {topic.title}
      </h3>
      {topic.summary && (
        <p className="font-body" style={{ fontSize: '0.92rem', color: '#586778', lineHeight: 1.6, marginBottom: 10 }}>
          {topic.summary}
        </p>
      )}
      {topic.audience && (
        <p className="font-body inline-flex items-center gap-2" style={{ fontSize: '0.8rem', color: '#7a8896', marginBottom: 10 }}>
          <Users size={13} style={{ color: 'var(--color-brand-accent)', flexShrink: 0 }} />
          <span><strong style={{ color: NAVY, fontWeight: 600 }}>Audience:</strong> {topic.audience}</span>
        </p>
      )}
      {Array.isArray(topic.keywords) && topic.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {topic.keywords.map((kw) => (
            <span key={kw} className="font-mono" style={{ fontSize: '0.66rem', color: '#586778', background: '#f4f3f0', border: '1px solid rgba(9,32,62,0.08)', borderRadius: 999, padding: '3px 9px' }}>
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* actions */}
      <div className="flex flex-wrap items-center gap-3 mt-3 pt-3" style={{ borderTop: '1px solid rgba(9,32,62,0.07)' }}>
        <button
          type="button" onClick={() => setEditOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.12em]"
          style={{ fontSize: '0.66rem', fontWeight: 700, color: editOpen ? '#7a8896' : NAVY, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          {editOpen ? <><X size={13} /> Close suggestion</> : <><PencilLine size={13} style={{ color: 'var(--color-brand-accent)' }} /> Suggest changes</>}
        </button>
        <span className="inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.12em]" style={{ fontSize: '0.66rem', color: '#9aa6b3' }}>
          <MessageSquare size={13} /> {comments.length} comment{comments.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* inline suggest-changes panel */}
      {editOpen && (
        <SuggestEditPanel
          topic={topic}
          onCancel={() => setEditOpen(false)}
          onSubmit={async (fields) => {
            await onSuggestEdit(fields)
            setEditOpen(false)
          }}
        />
      )}

      {/* comment thread */}
      <CommentThread comments={comments} onComment={onComment} />
    </article>
  )
}

/* ═══ Comments ═════════════════════════════════════════════════════════ */

function CommentThread({ comments, onComment }) {
  const [body, setBody] = useState('')
  const [replyTo, setReplyTo] = useState(null) // comment object being replied to
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const topLevel = comments.filter((c) => !c.parent_id)
  const repliesFor = (id) => comments.filter((c) => c.parent_id === id)

  async function submit(e) {
    e?.preventDefault?.()
    const text = body.trim()
    if (!text || busy) return
    setBusy(true); setError('')
    try {
      await onComment(text, replyTo?.id)
      setBody('')
      setReplyTo(null)
    } catch (err) {
      setError(err?.message || 'Could not post your comment.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ marginTop: 14 }}>
      {topLevel.map((c) => (
        <div key={c.id}>
          <CommentItem comment={c} onReply={() => setReplyTo(c)} />
          {repliesFor(c.id).map((r) => (
            <div key={r.id} style={{ marginLeft: 26 }}>
              <CommentItem comment={r} />
            </div>
          ))}
        </div>
      ))}

      <form onSubmit={submit} style={{ marginTop: topLevel.length ? 12 : 4 }}>
        {replyTo && (
          <div className="flex items-center gap-2 mb-2 font-body" style={{ fontSize: '0.74rem', color: '#7a8896' }}>
            <CornerDownRight size={13} />
            Replying to <strong style={{ color: NAVY }}>{replyTo.is_team ? 'Soccerex team' : replyTo.author}</strong>
            <button type="button" onClick={() => setReplyTo(null)} style={{ background: 'transparent', border: 'none', color: '#9aa6b3', cursor: 'pointer', display: 'inline-flex', padding: 2 }} aria-label="Cancel reply">
              <X size={13} />
            </button>
          </div>
        )}
        <textarea
          value={body} onChange={(e) => setBody(e.target.value)}
          rows={2} disabled={busy}
          placeholder={replyTo ? 'Write your reply…' : 'Add a comment for the Soccerex team…'}
          style={{ width: '100%', padding: '10px 12px', fontSize: '0.88rem', background: '#f8f7f4', border: '1px solid rgba(9,32,62,0.12)', borderRadius: 8, color: NAVY, outline: 'none', resize: 'vertical' }}
        />
        {error && <p className="font-body mt-1" style={{ fontSize: '0.78rem', color: '#b91c1c' }}>{error}</p>}
        <div className="flex justify-end mt-2">
          <button
            type="submit" disabled={busy || !body.trim()}
            className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.14em]"
            style={{
              background: body.trim() ? 'var(--color-brand-accent)' : 'rgba(9,32,62,0.14)',
              color: NAVY, padding: '9px 18px', fontSize: '0.7rem', border: 'none',
              borderRadius: 4, cursor: body.trim() && !busy ? 'pointer' : 'not-allowed',
            }}
          >
            {busy ? <><Loader2 size={13} className="animate-spin" /> Posting</> : <><Send size={13} /> {replyTo ? 'Reply' : 'Comment'}</>}
          </button>
        </div>
      </form>
    </div>
  )
}

function CommentItem({ comment, onReply }) {
  const team = !!comment.is_team
  return (
    <div style={{
      background: team ? 'rgba(9,32,62,0.04)' : '#fbfaf8',
      borderLeft: team ? '3px solid var(--color-brand-accent)' : '3px solid rgba(9,32,62,0.10)',
      borderRadius: '0 8px 8px 0', padding: '10px 14px', marginBottom: 8,
    }}>
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="font-mono uppercase tracking-[0.12em]" style={{ fontSize: '0.6rem', fontWeight: 700, color: team ? 'var(--color-brand-accent)' : '#7a8896' }}>
          {team ? 'Soccerex team' : comment.author}
        </span>
        <span className="font-body" style={{ fontSize: '0.68rem', color: '#9aa6b3' }}>{formatDateTime(comment.created_at)}</span>
      </div>
      <p className="font-body" style={{ fontSize: '0.88rem', color: '#3c4b5c', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{comment.body}</p>
      {onReply && (
        <button type="button" onClick={onReply} className="inline-flex items-center gap-1 font-mono uppercase tracking-[0.12em] mt-1.5" style={{ fontSize: '0.6rem', fontWeight: 700, color: '#7a8896', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
          <CornerDownRight size={11} /> Reply
        </button>
      )}
    </div>
  )
}

/* ═══ Suggest-changes inline panel ═════════════════════════════════════ */

function SuggestEditPanel({ topic, onCancel, onSubmit }) {
  const [title, setTitle] = useState(topic.title || '')
  const [summary, setSummary] = useState(topic.summary || '')
  const [theme, setTheme] = useState(topic.theme || '')
  const [audience, setAudience] = useState(topic.audience || '')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function submit(e) {
    e?.preventDefault?.()
    if (busy) return
    setBusy(true); setError('')
    try {
      await onSubmit({
        title: title.trim() || undefined,
        summary: summary.trim() || undefined,
        theme: theme.trim() || undefined,
        audience: audience.trim() || undefined,
        note: note.trim() || undefined,
      })
      setDone(true)
    } catch (err) {
      setError(err?.message || 'Could not submit your suggestion.')
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div className="flex items-center gap-2 mt-3 p-3 rounded-lg" style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.25)' }}>
        <CheckCircle2 size={16} color="#15803d" />
        <span className="font-body" style={{ fontSize: '0.85rem', color: '#15803d' }}>Suggestion sent — the team will review it.</span>
      </div>
    )
  }

  return (
    <form onSubmit={submit} style={{ marginTop: 14, background: '#fbfaf8', border: '1px dashed rgba(9,32,62,0.18)', borderRadius: 10, padding: 'clamp(14px,2.5vw,20px)' }}>
      <div className="font-mono uppercase tracking-[0.16em] mb-3" style={{ fontSize: '0.62rem', color: 'var(--color-brand-accent)', fontWeight: 700 }}>
        Suggest changes to this topic
      </div>
      <PanelField label="Title" value={title} onChange={setTitle} disabled={busy} />
      <PanelField label="Summary" value={summary} onChange={setSummary} disabled={busy} textarea />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
        <PanelField label="Theme" value={theme} onChange={setTheme} disabled={busy} />
        <PanelField label="Audience" value={audience} onChange={setAudience} disabled={busy} />
      </div>
      <PanelField label="Why this change? (note to the team)" value={note} onChange={setNote} disabled={busy} textarea placeholder="Optional context for the Soccerex programming team" />
      {error && <p className="font-body mb-2" style={{ fontSize: '0.78rem', color: '#b91c1c' }}>{error}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit" disabled={busy}
          className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.14em]"
          style={{ background: 'var(--color-brand-accent)', color: NAVY, padding: '10px 20px', fontSize: '0.7rem', border: 'none', borderRadius: 4, cursor: busy ? 'wait' : 'pointer' }}
        >
          {busy ? <><Loader2 size={13} className="animate-spin" /> Sending</> : <>Send suggestion</>}
        </button>
        <button type="button" onClick={onCancel} disabled={busy} className="font-mono uppercase tracking-[0.12em]" style={{ fontSize: '0.66rem', color: '#9aa6b3', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </form>
  )
}

/* ═══ Propose a new topic ══════════════════════════════════════════════ */

function NewTopicCard({ onSubmit }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [theme, setTheme] = useState('')
  const [audience, setAudience] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function submit(e) {
    e?.preventDefault?.()
    if (busy || !title.trim()) return
    setBusy(true); setError('')
    try {
      await onSubmit({
        title: title.trim(),
        summary: summary.trim() || undefined,
        theme: theme.trim() || undefined,
        audience: audience.trim() || undefined,
        note: note.trim() || undefined,
      })
      setDone(true)
    } catch (err) {
      setError(err?.message || 'Could not submit your topic.')
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div style={{ background: '#fff', border: '1px solid rgba(22,163,74,0.25)', borderRadius: 14, padding: 'clamp(18px,3vw,28px)', textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(22,163,74,0.12)', color: '#15803d', display: 'grid', placeItems: 'center', margin: '0 auto 12px' }}>
          <CheckCircle2 size={24} />
        </div>
        <h3 className="font-heading font-bold" style={{ fontSize: '1.05rem', color: NAVY, marginBottom: 6 }}>Topic proposed</h3>
        <p className="font-body" style={{ fontSize: '0.88rem', color: '#586778' }}>
          Thanks — it's with the programming team and will appear under "Your suggestions".
        </p>
        <button
          type="button"
          onClick={() => { setDone(false); setOpen(true); setTitle(''); setSummary(''); setTheme(''); setAudience(''); setNote(''); setBusy(false) }}
          className="inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.12em] mt-3"
          style={{ fontSize: '0.66rem', fontWeight: 700, color: NAVY, background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <Plus size={13} style={{ color: 'var(--color-brand-accent)' }} /> Propose another
        </button>
      </div>
    )
  }

  return (
    <div style={{ background: '#fff', border: '1px dashed rgba(9,32,62,0.22)', borderRadius: 14, padding: 'clamp(18px,3vw,28px)' }}>
      <div className="flex items-start gap-3">
        <span style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(191,177,112,0.16)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <Lightbulb size={18} style={{ color: 'var(--color-brand-accent)' }} />
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-bold" style={{ fontSize: '1.05rem', color: NAVY }}>Propose a new topic</h3>
          <p className="font-body" style={{ fontSize: '0.85rem', color: '#7a8896', marginTop: 2 }}>
            Missing something the program should cover? Pitch it to the team.
          </p>
        </div>
        {!open && (
          <button
            type="button" onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 font-body font-semibold uppercase tracking-[0.14em]"
            style={{ background: 'var(--color-brand-accent)', color: NAVY, padding: '9px 16px', fontSize: '0.68rem', border: 'none', borderRadius: 4, cursor: 'pointer', flexShrink: 0 }}
          >
            <Plus size={13} /> Propose
          </button>
        )}
      </div>

      {open && (
        <form onSubmit={submit} style={{ marginTop: 16 }}>
          <PanelField label="Title" value={title} onChange={setTitle} disabled={busy} required placeholder="e.g. Broadcast rights in South American football" />
          <PanelField label="Summary" value={summary} onChange={setSummary} disabled={busy} textarea placeholder="What would this session cover?" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
            <PanelField label="Theme" value={theme} onChange={setTheme} disabled={busy} placeholder="e.g. Media & Broadcast" />
            <PanelField label="Audience" value={audience} onChange={setAudience} disabled={busy} placeholder="Who is this for?" />
          </div>
          <PanelField label="Note to the team" value={note} onChange={setNote} disabled={busy} textarea placeholder="Optional — why now, suggested speakers, etc." />
          {error && <p className="font-body mb-2" style={{ fontSize: '0.78rem', color: '#b91c1c' }}>{error}</p>}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit" disabled={busy || !title.trim()}
              className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.14em]"
              style={{
                background: title.trim() ? 'var(--color-brand-accent)' : 'rgba(9,32,62,0.14)',
                color: NAVY, padding: '10px 20px', fontSize: '0.7rem', border: 'none',
                borderRadius: 4, cursor: title.trim() && !busy ? 'pointer' : 'not-allowed',
              }}
            >
              {busy ? <><Loader2 size={13} className="animate-spin" /> Sending</> : <>Submit topic</>}
            </button>
            <button type="button" onClick={() => setOpen(false)} disabled={busy} className="font-mono uppercase tracking-[0.12em]" style={{ fontSize: '0.66rem', color: '#9aa6b3', background: 'transparent', border: 'none', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

/* ═══ Your suggestions ═════════════════════════════════════════════════ */

function SuggestionRow({ suggestion, topics }) {
  const tint = SUGGESTION_TINTS[suggestion.status] || SUGGESTION_TINTS.open
  const payload = suggestion.payload || {}
  const topic = suggestion.topic_id ? topics.find((t) => t.id === suggestion.topic_id) : null
  const isEdit = suggestion.type === 'edit'

  return (
    <div style={{ background: '#fff', border: '1px solid rgba(9,32,62,0.08)', borderRadius: 12, padding: '14px 18px', marginBottom: 10 }}>
      <div className="flex flex-wrap items-center gap-2 mb-1.5">
        <span className="font-mono uppercase tracking-[0.12em]" style={{ fontSize: '0.6rem', fontWeight: 700, color: tint.color, background: tint.bg, border: `1px solid ${tint.border}`, borderRadius: 999, padding: '3px 9px' }}>
          {tint.label}
        </span>
        <span className="font-mono uppercase tracking-[0.12em]" style={{ fontSize: '0.6rem', fontWeight: 600, color: '#9aa6b3' }}>
          {isEdit ? 'Edit suggestion' : 'New topic'}
        </span>
        {suggestion.created_at && (
          <span className="font-body" style={{ fontSize: '0.68rem', color: '#9aa6b3', marginLeft: 'auto' }}>
            {formatDateTime(suggestion.created_at)}
          </span>
        )}
      </div>
      <div className="font-heading font-semibold" style={{ fontSize: '0.95rem', color: NAVY }}>
        {payload.title || topic?.title || 'Untitled suggestion'}
      </div>
      {isEdit && topic && payload.title && payload.title !== topic.title && (
        <div className="font-body" style={{ fontSize: '0.76rem', color: '#9aa6b3', marginTop: 2 }}>
          On topic: {topic.title}
        </div>
      )}
      {payload.summary && (
        <p className="font-body" style={{ fontSize: '0.84rem', color: '#586778', lineHeight: 1.55, marginTop: 4 }}>{payload.summary}</p>
      )}
      {payload.note && (
        <p className="font-body" style={{ fontSize: '0.8rem', color: '#7a8896', marginTop: 4, fontStyle: 'italic' }}>"{payload.note}"</p>
      )}
      {suggestion.resolution_note && (
        <div className="font-body mt-2 px-3 py-2 rounded-md" style={{ fontSize: '0.8rem', color: '#3c4b5c', background: 'rgba(9,32,62,0.04)', borderLeft: '3px solid var(--color-brand-accent)' }}>
          <strong style={{ fontWeight: 600 }}>Soccerex team:</strong> {suggestion.resolution_note}
        </div>
      )}
    </div>
  )
}

/* ═══ Shared small field ═══════════════════════════════════════════════ */

function PanelField({ label, value, onChange, placeholder, required, textarea, disabled }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label className="block font-mono uppercase tracking-[0.1em]" style={{ fontSize: '0.64rem', color: NAVY, fontWeight: 600, marginBottom: 5 }}>
        {label}{required && <span style={{ color: 'var(--color-brand-accent)', marginLeft: 4 }}>*</span>}
      </label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} rows={3}
          style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', background: '#f8f7f4', border: '1px solid rgba(9,32,62,0.12)', borderRadius: 6, color: NAVY, outline: 'none', resize: 'vertical' }} />
      ) : (
        <input type="text" required={required} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
          style={{ width: '100%', padding: '9px 12px', fontSize: '0.88rem', background: '#f8f7f4', border: '1px solid rgba(9,32,62,0.12)', borderRadius: 6, color: NAVY, outline: 'none' }} />
      )}
    </div>
  )
}
