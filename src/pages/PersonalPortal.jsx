import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Edit3, LogOut, Loader2, AlertCircle, Calendar, Clock,
  MapPin, Mic, Ticket, Star, CheckCircle2, Circle, Users, FileText, Upload,
  Megaphone, Sparkles, Shield, Crown, ExternalLink, Bookmark, BookmarkCheck,
  UserCheck, EyeOff, Eye, Building2, Plus,
} from 'lucide-react'
import {
  getSpeakerPortal, getRightsHolderPortal, getDelegatePortal, getVipPortal,
  rsvpVipExperience, setDelegateSavedSession,
  getDelegateNetworking, updateDelegateNetworking,
  ApiError,
} from '../lib/soccerexApi'
import {
  readProfileAccessSession, clearProfileAccessSession,
} from '../lib/profileAccessAuth'
import { isTestModeFromUrl, withTestSearch } from '../lib/testMode'
import { PROFILE_ACCESS, PROFILE_EXPIRED, profileEditor } from '../lib/routes'
import { buildIcs, downloadIcs } from '../lib/ics'

/* PersonalPortal renders every role a single person profile has access to,
   in one stacked dashboard. Each role's endpoint is loaded in parallel and
   the section only renders when the endpoint returns data (404 / 403 / null
   collapse silently). This way a person who is BOTH speaker and delegate
   sees both panels; a delegate-only person sees only the delegate panel.

   The VIP banner is pinned at the top whenever vip-portal returns anything,
   because VIP layers on top of any other role per the brief. */

export default function PersonalPortal() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [session, setSession] = useState(() => readProfileAccessSession())
  const [data, setData] = useState({ speaker: undefined, rightsHolder: undefined, delegate: undefined, vip: undefined })
  const [error, setError] = useState(null)

  /* Bounce to /profile-access if there's no edit_token */
  useEffect(() => {
    if (!session?.edit_token) navigate(PROFILE_ACCESS, { replace: true })
  }, [session, navigate])

  /* Test-mode URL preservation, mirrors editor + sponsor portal */
  useEffect(() => {
    if (!session?.is_test) return
    if (isTestModeFromUrl()) return
    const params = new URLSearchParams(location.search)
    params.set('test', '1')
    navigate({ pathname: location.pathname, search: `?${params.toString()}` }, { replace: true })
  }, [session, location.pathname, location.search, navigate])

  const editToken = session?.edit_token
  const isTest = !!session?.is_test

  useEffect(() => {
    if (!editToken) return
    let cancelled = false
    setError(null)
    setData({ speaker: undefined, rightsHolder: undefined, delegate: undefined, vip: undefined })

    /* Load each portal in parallel. 401 invalidates the whole session; 404
       (no role for this profile) just leaves that bucket null. */
    const wrap = (p) => p
      .then((d) => ({ ok: true, data: d }))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) throw err
        return { ok: false }
      })

    Promise.all([
      wrap(getSpeakerPortal(slug, editToken, { test: isTest })),
      wrap(getRightsHolderPortal(slug, editToken, { test: isTest })),
      wrap(getDelegatePortal(slug, editToken, { test: isTest })),
      wrap(getVipPortal(slug, editToken, { test: isTest })),
    ])
      .then(([speaker, rightsHolder, delegate, vip]) => {
        if (cancelled) return
        setData({
          speaker: speaker.ok ? speaker.data : null,
          rightsHolder: rightsHolder.ok ? rightsHolder.data : null,
          delegate: delegate.ok ? delegate.data : null,
          vip: vip.ok ? vip.data : null,
        })
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiError && err.status === 401) {
          clearProfileAccessSession(); setSession(null)
          navigate(PROFILE_EXPIRED, { replace: true })
          return
        }
        setError(err)
      })
    return () => { cancelled = true }
  }, [slug, editToken, isTest, navigate])

  const signOut = () => {
    clearProfileAccessSession()
    navigate(PROFILE_ACCESS, { replace: true })
  }

  const reloadSection = (key, loader) => {
    return loader().then((next) => setData((prev) => ({ ...prev, [key]: next })))
  }

  if (!editToken) return null

  /* Loading until all four parallel calls have settled, so the user never
     sees an interim "no roles yet" flash while the slower endpoints are
     still in-flight. */
  const loading = data.speaker === undefined
    || data.rightsHolder === undefined
    || data.delegate === undefined
    || data.vip === undefined
  const profile = data.speaker?.profile || data.delegate?.profile || data.rightsHolder?.profile || data.vip?.profile

  const hasSpeaker = !!data.speaker
  const hasRights  = !!data.rightsHolder
  const hasDelegate = !!data.delegate
  const hasVip = !!data.vip
  const noRoles = !loading && !hasSpeaker && !hasRights && !hasDelegate && !hasVip

  return (
    <div className="event-page theme-soccerex" style={{ background: '#FAFBFC', minHeight: '100vh', paddingTop: 'var(--app-top-offset)' }}>
      <PortalHeader profile={profile} session={session} onSignOut={signOut} slug={slug} />

      <section style={{ padding: 'clamp(24px,3vw,40px) clamp(24px,5vw,60px) clamp(80px,10vw,120px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {error && <ErrorBanner error={error} />}
          {loading && !error && <Loading label="Loading your portal" />}

          {/* VIP overlay — pinned above the rest. */}
          {hasVip && (
            <VipSection
              data={data.vip}
              slug={slug}
              editToken={editToken}
              isTest={isTest}
              onRefresh={() => reloadSection('vip', () => getVipPortal(slug, editToken, { test: isTest }))}
            />
          )}

          {noRoles && !error && <NoRoles />}

          {hasSpeaker && (
            <SpeakerSection data={data.speaker} slug={slug} />
          )}

          {hasRights && (
            <RightsHolderSection data={data.rightsHolder} slug={slug} />
          )}

          {hasDelegate && (
            <DelegateSection
              data={data.delegate}
              slug={slug}
              editToken={editToken}
              isTest={isTest}
              onRefresh={() => reloadSection('delegate', () => getDelegatePortal(slug, editToken, { test: isTest }))}
            />
          )}
        </div>
      </section>
    </div>
  )
}

/* ─── Header ───────────────────────────────────────────────────────────── */

function PortalHeader({ profile, session, onSignOut, slug }) {
  const expiresAt = session?.expires_at ? new Date(session.expires_at) : null
  return (
    <header style={{
      position: 'sticky', top: 'var(--app-top-offset)', zIndex: 20,
      background: '#FFFFFF',
      borderBottom: '1px solid rgba(13,27,42,0.08)',
      padding: 'clamp(14px, 2vw, 22px) clamp(24px, 5vw, 60px)',
      backdropFilter: 'blur(8px)',
    }}>
      <div className="flex items-center justify-between gap-6 flex-wrap" style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="flex items-center gap-4 flex-wrap">
          <Link to={withTestSearch(PROFILE_ACCESS)} className="inline-flex items-center gap-2 font-mono uppercase tracking-widest"
            style={{ fontSize: 11, color: '#0D1B2A', opacity: 0.55, textDecoration: 'none' }}>
            <ArrowLeft size={13} /> Profiles
          </Link>
          <span style={{ width: 1, height: 18, background: 'rgba(13,27,42,0.15)' }} />
          <div>
            <p className="font-mono uppercase" style={{ fontSize: 10, color: 'var(--event-primary)', letterSpacing: '0.2em' }}>
              Your portal
            </p>
            <p className="font-heading font-bold" style={{ fontSize: 16, color: '#0D1B2A' }}>
              {profile?.display_name || profile?.legal_name || profile?.name || '...'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Link to={withTestSearch(profileEditor(slug))} className="event-btn-outline-light" style={{ padding: '8px 14px', fontSize: 11 }}>
            <Edit3 size={12} /> Edit profile
          </Link>
          {expiresAt && (
            <span className="font-body" style={{ fontSize: 11, color: '#607186' }}>
              Session: {expiresAt.toLocaleString()}
            </span>
          )}
          <button onClick={onSignOut} className="inline-text-btn" style={{ fontSize: 12 }}>
            <LogOut size={12} style={{ display: 'inline', marginRight: 4 }} /> Sign out
          </button>
        </div>
      </div>
    </header>
  )
}

/* ─── VIP overlay (always on top, neutral premium tone) ────────────────── */

function VipSection({ data, slug, editToken, isTest, onRefresh }) {
  const experiences = Array.isArray(data?.experiences) ? data.experiences : []
  const upcoming = experiences.filter((e) => !e.rsvp || e.rsvp.status !== 'declined')
  const concierge = data?.concierge || null
  const lounges = Array.isArray(data?.lounges) ? data.lounges : []

  return (
    <section className="portal-section portal-section--vip mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #0D1B2A, #1f2f48)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <Crown size={18} style={{ color: 'var(--color-brand-accent, #bfb170)' }} />
        </div>
        <div>
          <p className="font-mono uppercase" style={{ fontSize: 10, color: 'var(--color-brand-accent)', letterSpacing: '0.24em' }}>VIP</p>
          <h2 className="font-heading font-bold" style={{ fontSize: '1.25rem', color: '#0D1B2A' }}>
            {data?.welcome_title || 'Welcome to the VIP program'}
          </h2>
        </div>
      </div>
      {data?.welcome_message && (
        <p className="font-body mb-5" style={{ fontSize: 14, color: '#3a4a5a' }}>{data.welcome_message}</p>
      )}

      {upcoming.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {upcoming.map((exp) => (
            <VipExperienceCard
              key={exp.id}
              experience={exp}
              slug={slug}
              editToken={editToken}
              isTest={isTest}
              onAfter={onRefresh}
            />
          ))}
        </div>
      )}

      {(concierge || lounges.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {concierge && (
            <Tile kicker="Concierge" title={concierge.name || 'Your VIP host'} body={concierge.bio || concierge.note} link={concierge.contact} />
          )}
          {lounges.map((l) => (
            <Tile key={l.id || l.name} kicker={l.kind || 'Lounge'} title={l.name} body={l.description || l.location} link={l.map_url} />
          ))}
        </div>
      )}
    </section>
  )
}

function VipExperienceCard({ experience: e, slug, editToken, isTest, onAfter }) {
  const [status, setStatus] = useState(e.rsvp?.status || 'pending') /* pending | confirmed | declined | waitlisted */
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState(e.rsvp?.notes || '')
  const [expanded, setExpanded] = useState(false)
  const capacity = e.capacity_state || (e.is_full ? 'waitlist' : 'available') /* available | waitlist | full */
  const confirmed = status === 'confirmed'

  const submit = async (next) => {
    setBusy(true)
    try {
      const res = await rsvpVipExperience(slug, editToken, e.id, { status: next, notes: note }, { test: isTest })
      const serverStatus = res?.rsvp?.status || next
      setStatus(serverStatus)
      if (typeof onAfter === 'function') onAfter()
    } catch {
      /* leave UI alone — user can retry */
    } finally {
      setBusy(false)
    }
  }

  const addToCalendar = () => {
    const ics = buildIcs({
      uid: `vip-${e.id}@soccerex`,
      title: e.title || e.name,
      description: e.description,
      location: e.location || e.venue,
      start: e.starts_at || e.start_time,
      end: e.ends_at || e.end_time,
    })
    downloadIcs(ics, `${(e.title || 'vip-experience').toLowerCase().replace(/\s+/g, '-')}.ics`)
  }

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.10)', padding: 18 }}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-heading font-bold" style={{ fontSize: 15, color: '#0D1B2A' }}>{e.title || e.name}</h3>
        <CapacityChip state={capacity} />
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
        {(e.starts_at || e.start_time) && (
          <span className="inline-flex items-center gap-1.5 font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', color: '#607186' }}>
            <Calendar size={11} /> {fmtDateTime(e.starts_at || e.start_time)}
          </span>
        )}
        {(e.location || e.venue) && (
          <span className="inline-flex items-center gap-1.5 font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', color: '#607186' }}>
            <MapPin size={11} /> {e.location || e.venue}
          </span>
        )}
      </div>
      {e.description && (
        <p className="font-body" style={{ fontSize: 13, color: '#3a4a5a' }}>{e.description}</p>
      )}

      {expanded && (
        <label className="block mt-3">
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: '0.2em', color: '#607186' }}>Optional note</span>
          <textarea rows={2} value={note} onChange={(ev) => setNote(ev.target.value)} className="prog-input"
            placeholder="Dietary, accessibility, or context note" />
        </label>
      )}

      <div className="flex flex-wrap gap-2 mt-3">
        {status === 'pending' && (
          <>
            <button disabled={busy} onClick={() => submit('confirmed')} className="event-btn-primary" style={{ padding: '8px 14px', fontSize: 11 }}>
              {busy ? <Loader2 size={12} className="prog-spin" /> : <CheckCircle2 size={12} />} {capacity === 'full' || capacity === 'waitlist' ? 'Join waitlist' : 'Confirm'}
            </button>
            <button disabled={busy} onClick={() => submit('declined')} className="event-btn-outline-light" style={{ padding: '8px 14px', fontSize: 11 }}>
              Decline
            </button>
          </>
        )}
        {status === 'confirmed' && (
          <>
            <span className="inline-flex items-center gap-1.5 font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.18em', color: '#10b981', background: 'rgba(16,185,129,0.10)', padding: '4px 10px' }}>
              <CheckCircle2 size={11} /> You're in
            </span>
            <button onClick={addToCalendar} className="event-btn-outline-light" style={{ padding: '8px 14px', fontSize: 11 }}>
              <Calendar size={12} /> Add to calendar
            </button>
          </>
        )}
        {status === 'waitlisted' && (
          <span className="inline-flex items-center gap-1.5 font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.18em', color: '#b45309', background: 'rgba(245,158,11,0.12)', padding: '4px 10px' }}>
            <Clock size={11} /> On waitlist
          </span>
        )}
        {(status === 'declined' || !confirmed) && status !== 'pending' && status !== 'waitlisted' && status !== 'confirmed' && (
          <button disabled={busy} onClick={() => submit('confirmed')} className="event-btn-primary" style={{ padding: '8px 14px', fontSize: 11 }}>
            Change to attending
          </button>
        )}
        <button onClick={() => setExpanded((x) => !x)} className="inline-text-btn" style={{ fontSize: 11 }}>
          {expanded ? 'Hide note' : 'Add note'}
        </button>
      </div>
    </div>
  )
}

function CapacityChip({ state }) {
  if (state === 'full' || state === 'waitlist') {
    return <Pill tone="warning">Waitlist</Pill>
  }
  if (state === 'closed') return <Pill tone="muted">Closed</Pill>
  return <Pill tone="success">Available</Pill>
}

/* ─── Speaker section ──────────────────────────────────────────────────── */

function SpeakerSection({ data, slug }) {
  const readiness = data?.readiness || data?.profile_readiness
  const sessions = Array.isArray(data?.sessions) ? data.sessions : []
  const nextActions = Array.isArray(data?.next_actions) ? data.next_actions : []

  return (
    <section className="portal-section mb-6">
      <SectionHeader Icon={Mic} kicker="Speaker" title="Your speaker portal" />
      {readiness && <Readiness data={readiness} editLink={withTestSearch(profileEditor(slug))} />}

      {nextActions.length > 0 && (
        <Subsection title="Next actions">
          <NextActions actions={nextActions} />
        </Subsection>
      )}

      {sessions.length > 0 ? (
        <Subsection title="Your sessions">
          <div className="flex flex-col gap-3">
            {sessions.map((s) => <SpeakerSessionCard key={s.id || s.slug} session={s} />)}
          </div>
        </Subsection>
      ) : (
        <Empty icon={Mic} title="No sessions assigned yet" body="When the program team confirms a session for you, it'll show up here with green-room and AV details." />
      )}
    </section>
  )
}

function SpeakerSessionCard({ session: s }) {
  const status = s.status || s.role_status || 'invited'
  const Icon = /(confirmed|accepted)/i.test(status) ? CheckCircle2 : Clock
  const coSpeakers = Array.isArray(s.co_speakers) ? s.co_speakers : []
  const logistics = s.logistics || s.attributes || {}

  const onAddToCalendar = () => {
    if (!s.starts_at && !s.start_time) return
    const start = s.starts_at || s.start_time
    const end = s.ends_at || s.end_time || start
    const ics = buildIcs({
      uid: `soccerex-speaker-session-${s.id || s.slug}@soccerex.com`,
      title: s.title || s.topic || 'Soccerex session',
      start, end,
      location: s.stage || s.venue || s.location || '',
      description: [
        s.role ? `Role: ${s.role}` : null,
        s.event_name || s.event?.name || null,
        s.notes || null,
      ].filter(Boolean).join('\n\n'),
    })
    downloadIcs(ics, `${(s.title || 'session').toLowerCase().replace(/\s+/g, '-').slice(0, 60)}.ics`)
  }

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.10)', padding: 18 }}>
      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
        <div style={{ minWidth: 0 }}>
          <p className="font-heading font-bold" style={{ fontSize: 16, color: '#0D1B2A' }}>{s.title || s.topic}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
            {(s.starts_at || s.start_time) && (
              <span className="inline-flex items-center gap-1.5 font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', color: '#607186' }}>
                <Calendar size={11} /> {fmtDateTime(s.starts_at || s.start_time)}
              </span>
            )}
            {(s.stage || s.venue || s.location) && (
              <span className="inline-flex items-center gap-1.5 font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', color: '#607186' }}>
                <MapPin size={11} /> {s.stage || s.venue || s.location}
              </span>
            )}
            {(s.event_name || s.event?.name) && (
              <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', color: '#607186' }}>
                {s.event_name || s.event?.name}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 font-mono uppercase" style={{
            fontSize: 10, letterSpacing: '0.18em',
            background: /(confirmed|accepted)/i.test(status) ? 'rgba(16,185,129,0.10)' : 'rgba(245,158,11,0.12)',
            color: /(confirmed|accepted)/i.test(status) ? '#10b981' : '#b45309',
            padding: '4px 10px',
          }}>
            <Icon size={11} /> {String(status).replace(/_/g, ' ')}
          </span>
          {(s.starts_at || s.start_time) && (
            <button
              type="button"
              onClick={onAddToCalendar}
              className="inline-flex items-center gap-1.5 font-mono uppercase hover:opacity-80 transition-opacity"
              style={{
                fontSize: 10, letterSpacing: '0.18em',
                background: 'rgba(13,27,42,0.06)', color: '#0D1B2A',
                padding: '4px 10px', cursor: 'pointer',
              }}
            >
              <Calendar size={11} /> Add to calendar
            </button>
          )}
        </div>
      </div>

      {s.role && <p className="font-body" style={{ fontSize: 12, color: '#607186', marginTop: 4 }}>Role: <span style={{ color: '#0D1B2A' }}>{s.role}</span></p>}
      {s.notes && (
        <p className="font-body mt-2" style={{ fontSize: 13, color: '#3a4a5a', background: '#FAFBFC', borderLeft: '2px solid var(--event-primary)', padding: '8px 12px' }}>{s.notes}</p>
      )}

      {(logistics.green_room || logistics.av_check_at || logistics.producer_contact || logistics.arrival_notes) && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2" style={{ fontSize: 12 }}>
          {logistics.av_check_at && <Meta label="AV check" value={fmtDateTime(logistics.av_check_at)} mono />}
          {logistics.green_room && <Meta label="Green room" value={logistics.green_room} />}
          {logistics.producer_contact && <Meta label="Producer" value={logistics.producer_contact} />}
          {logistics.arrival_notes && <Meta label="Arrival" value={logistics.arrival_notes} />}
        </div>
      )}

      {coSpeakers.length > 0 && (
        <div className="mt-3">
          <p className="font-mono uppercase mb-1" style={{ fontSize: 9, letterSpacing: '0.2em', color: '#607186' }}>With</p>
          <div className="flex flex-wrap gap-2">
            {coSpeakers.map((c) => (
              <span key={c.slug || c.name} className="inline-flex items-center gap-2" style={{ background: '#FAFBFC', border: '1px solid rgba(13,27,42,0.08)', padding: '4px 10px', fontSize: 12, color: '#0D1B2A' }}>
                {c.featured_image && <img src={c.featured_image} alt="" style={{ width: 18, height: 18, borderRadius: 999, objectFit: 'cover' }} />}
                {c.name || c.display_name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Rights-Holder section ────────────────────────────────────────────── */

function RightsHolderSection({ data, slug }) {
  const status = data?.application?.status || data?.review?.status || 'pending'
  const passes = Array.isArray(data?.passes) ? data.passes : (data?.complimentary_pass ? [data.complimentary_pass] : [])
  const order  = data?.order || data?.zero_dollar_order
  const agenda = Array.isArray(data?.agenda) ? data.agenda : []
  const next   = Array.isArray(data?.next_actions) ? data.next_actions : []

  return (
    <section className="portal-section mb-6">
      <SectionHeader Icon={Shield} kicker="Rightsholder" title="Application & complimentary pass" />

      <ApplicationStatus status={status} review={data?.review || data?.application} />

      {passes.length > 0 && (
        <Subsection title="Your complimentary pass">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {passes.map((p, i) => <CompPassCard key={p.id || i} pass={p} />)}
          </div>
        </Subsection>
      )}

      {order && (
        <Subsection title="Receipt">
          <OrderRow order={order} compNote="This is a complimentary rightsholder pass, no payment is required." />
        </Subsection>
      )}

      {agenda.length > 0 && (
        <Subsection title="Published agenda">
          <AgendaList items={agenda} />
        </Subsection>
      )}

      {next.length > 0 && (
        <Subsection title="Next actions">
          <NextActions actions={next} />
        </Subsection>
      )}
    </section>
  )
}

function ApplicationStatus({ status, review }) {
  const norm = String(status).toLowerCase()
  const tone =
    /(approved|accepted|confirmed|active)/.test(norm) ? { bg: 'rgba(16,185,129,0.10)', color: '#10b981', label: 'Approved', Icon: CheckCircle2 } :
    /(declined|rejected|denied)/.test(norm) ? { bg: 'rgba(220,38,38,0.10)', color: '#b91c1c', label: 'Not approved', Icon: AlertCircle } :
    { bg: 'rgba(245,158,11,0.12)', color: '#b45309', label: 'Under review', Icon: Clock }

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.10)', padding: 18, marginBottom: 14 }}>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 font-mono uppercase" style={{
          fontSize: 11, letterSpacing: '0.18em', padding: '6px 12px', background: tone.bg, color: tone.color,
        }}>
          <tone.Icon size={13} /> {tone.label}
        </span>
        {review?.recommendation && (
          <span className="font-body" style={{ fontSize: 12, color: '#607186' }}>
            Recommendation: <span style={{ color: '#0D1B2A' }}>{review.recommendation}</span>
            {typeof review.confidence === 'number' && (
              <> · {Math.round(review.confidence * 100)}% confidence</>
            )}
          </span>
        )}
      </div>
      {review?.reason && (
        <p className="font-body mt-3" style={{ fontSize: 13, color: '#3a4a5a' }}>{review.reason}</p>
      )}
      {review?.notes && (
        <p className="font-body mt-2" style={{ fontSize: 12, color: '#607186', fontStyle: 'italic' }}>{review.notes}</p>
      )}
    </div>
  )
}

function CompPassCard({ pass: p }) {
  return (
    <div style={{ background: 'linear-gradient(160deg, #0D1B2A 0%, #1a2f4a 100%)', color: '#fff', padding: 22 }}>
      <p className="font-mono uppercase" style={{ fontSize: 10, color: 'var(--color-brand-accent, #bfb170)', letterSpacing: '0.2em' }}>Complimentary</p>
      <p className="font-heading font-bold mt-1" style={{ fontSize: 18, lineHeight: 1.15 }}>
        {p.pass_type || p.type || 'Delegate pass'}
      </p>
      <div className="mt-3 font-body" style={{ fontSize: 12, opacity: 0.8 }}>
        {p.event_name && <>{p.event_name}<br /></>}
        {p.code && <span className="font-mono">Pass code: {p.code}</span>}
      </div>
      <div className="flex gap-2 mt-4 flex-wrap">
        {p.qr_url && (
          <a href={p.qr_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5"
            style={{ fontSize: 11, color: 'var(--color-brand-accent)', textDecoration: 'none', border: '1px solid rgba(191,177,112,0.4)', padding: '6px 12px' }}>
            <ExternalLink size={11} /> View pass
          </a>
        )}
      </div>
    </div>
  )
}

function OrderRow({ order, compNote }) {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.10)', padding: 16 }}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-body" style={{ fontSize: 13, color: '#0D1B2A' }}>
            {order.reference || order.number || 'Order'} · {fmtDate(order.placed_at || order.created_at)}
          </p>
          {compNote && <p className="font-body" style={{ fontSize: 12, color: '#607186' }}>{compNote}</p>}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono" style={{ fontSize: 13, color: '#0D1B2A' }}>{fmtMoney(order) || 'Complimentary'}</span>
          {order.url && <a href={order.url} target="_blank" rel="noreferrer" className="inline-text-btn" style={{ fontSize: 12 }}>View receipt</a>}
        </div>
      </div>
    </div>
  )
}

/* ─── Delegate section ─────────────────────────────────────────────────── */

function DelegateSection({ data, slug, editToken, isTest, onRefresh }) {
  const tickets = Array.isArray(data?.tickets) ? data.tickets : []
  const orders = Array.isArray(data?.orders) ? data.orders : []
  const readiness = data?.readiness || data?.profile_readiness
  const schedule = Array.isArray(data?.schedule?.items) ? data.schedule.items : (Array.isArray(data?.schedule) ? data.schedule : [])
  const summary = data?.schedule?.summary || data?.summary || {}
  const next = Array.isArray(data?.next_actions) ? data.next_actions : []

  return (
    <section className="portal-section mb-6">
      <SectionHeader Icon={Ticket} kicker="Delegate" title="Your delegate portal" />

      {tickets.length > 0 && (
        <Subsection title="Your tickets">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tickets.map((t, i) => <TicketCard key={t.id || i} ticket={t} />)}
          </div>
        </Subsection>
      )}

      {readiness && <Readiness data={readiness} editLink={withTestSearch(profileEditor(slug))} />}

      <Subsection title={`Saved schedule${summary.saved_sessions != null ? ` (${summary.saved_sessions})` : ''}`}>
        {schedule.length > 0 ? (
          <ScheduleList
            items={schedule}
            slug={slug}
            editToken={editToken}
            isTest={isTest}
            onAfter={onRefresh}
          />
        ) : (
          <Empty icon={Calendar} title="Schedule not published yet" body="Once sessions are published, you'll be able to save the ones you want to attend right from here." />
        )}
      </Subsection>

      <NetworkingPanel slug={slug} editToken={editToken} isTest={isTest} delegateData={data} />

      {orders.length > 0 && (
        <Subsection title="Orders & receipts">
          <div className="flex flex-col gap-2">
            {orders.map((o, i) => <OrderRow key={o.id || i} order={o} />)}
          </div>
        </Subsection>
      )}

      {next.length > 0 && (
        <Subsection title="Next actions">
          <NextActions actions={next} />
        </Subsection>
      )}
    </section>
  )
}

function TicketCard({ ticket: t }) {
  const isVip = /vip/i.test(t.pass_type || t.tier || t.type || '')
  return (
    <div style={{
      background: isVip ? 'linear-gradient(160deg, #0D1B2A 0%, #1a2f4a 100%)' : '#FFFFFF',
      color: isVip ? '#fff' : '#0D1B2A',
      border: isVip ? 'none' : '1px solid rgba(13,27,42,0.10)',
      padding: 22,
    }}>
      <p className="font-mono uppercase" style={{ fontSize: 10, color: isVip ? 'var(--color-brand-accent)' : 'var(--event-primary)', letterSpacing: '0.2em' }}>
        {isVip ? 'VIP pass' : 'Delegate pass'}
      </p>
      <p className="font-heading font-bold mt-1" style={{ fontSize: 17 }}>
        {t.holder_name || t.attendee_name || 'You'}
      </p>
      <div className="mt-3 font-body" style={{ fontSize: 12, opacity: isVip ? 0.8 : 0.7 }}>
        {t.event_name && <>{t.event_name}<br /></>}
        {t.code && <span className="font-mono">{t.code}</span>}
      </div>
    </div>
  )
}

function ScheduleList({ items, slug, editToken, isTest, onAfter }) {
  const [busyId, setBusyId] = useState(null)

  const toggle = async (item, next) => {
    setBusyId(item.id)
    try {
      await setDelegateSavedSession(slug, editToken, item.id, { saved: next, notes: item.notes }, { test: isTest })
      if (typeof onAfter === 'function') await onAfter()
    } catch {
      /* swallow; rely on next refresh */
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((it) => {
        const saved = !!(it.is_saved ?? it.saved)
        return (
          <div key={it.id} style={{ background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.10)', padding: 14, display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p className="font-heading font-bold" style={{ fontSize: 14, color: '#0D1B2A' }}>{it.title || it.session_title || it.topic}</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                {(it.starts_at || it.start_time) && (
                  <span className="inline-flex items-center gap-1.5 font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', color: '#607186' }}>
                    <Calendar size={11} /> {fmtDateTime(it.starts_at || it.start_time)}
                  </span>
                )}
                {(it.stage || it.location) && (
                  <span className="inline-flex items-center gap-1.5 font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', color: '#607186' }}>
                    <MapPin size={11} /> {it.stage || it.location}
                  </span>
                )}
              </div>
            </div>
            <button disabled={busyId === it.id} onClick={() => toggle(it, !saved)}
              className={saved ? 'event-btn-primary' : 'event-btn-outline-light'}
              style={{ padding: '8px 14px', fontSize: 11 }}>
              {busyId === it.id ? <Loader2 size={12} className="prog-spin" /> : (saved ? <BookmarkCheck size={12} /> : <Bookmark size={12} />)}
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>
        )
      })}
    </div>
  )
}

function NetworkingPanel({ slug, editToken, isTest, delegateData }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const eventSlug = delegateData?.event?.slug || delegateData?.events?.[0]?.slug

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getDelegateNetworking(slug, editToken, eventSlug ? { event_slug: eventSlug } : {}, { test: isTest })
      .then((d) => { if (!cancelled) setData(d) })
      .catch(() => { /* directory may be empty pre-launch */ })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [slug, editToken, isTest, eventSlug])

  const prefs = data?.preferences || {}
  const directory = Array.isArray(data?.directory) ? data.directory : []

  const togglePrefs = async (next) => {
    setSaving(true)
    try {
      const res = await updateDelegateNetworking(slug, editToken, next, { test: isTest })
      setData((prev) => ({ ...prev, preferences: res?.preferences || res || next }))
    } catch {
      /* surface in UI later if needed */
    } finally {
      setSaving(false)
    }
  }

  return (
    <Subsection title="Networking">
      <div style={{ background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.10)', padding: 18, marginBottom: 12 }}>
        <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
          <div>
            <p className="font-heading font-bold" style={{ fontSize: 14, color: '#0D1B2A' }}>Be discoverable</p>
            <p className="font-body" style={{ fontSize: 12.5, color: '#607186', maxWidth: 520 }}>
              When you're discoverable, other opted-in delegates can find you in the directory by interest, goals, and what you're looking for. We never share your email or phone.
            </p>
          </div>
          <button disabled={saving} onClick={() => togglePrefs({ ...prefs, visible: !prefs.visible })}
            className={prefs.visible ? 'event-btn-primary' : 'event-btn-outline-light'}
            style={{ padding: '8px 14px', fontSize: 11 }}>
            {saving ? <Loader2 size={12} className="prog-spin" /> : (prefs.visible ? <Eye size={12} /> : <EyeOff size={12} />)}
            {prefs.visible ? 'Discoverable' : 'Hidden'}
          </button>
        </div>
        {prefs.visible && (
          <NetworkingForm prefs={prefs} onSave={togglePrefs} saving={saving} />
        )}
      </div>

      {loading ? (
        <Loading label="Loading directory" />
      ) : directory.length > 0 ? (
        <>
          <p className="font-mono uppercase mb-2" style={{ fontSize: 10, letterSpacing: '0.2em', color: '#607186' }}>
            Opted-in delegates · {directory.length}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {directory.map((d) => <DirectoryCard key={d.slug || d.id} entry={d} />)}
          </div>
        </>
      ) : (
        <Empty icon={Users} title="Directory is quiet right now"
          body="Once other delegates opt in to be discoverable, they'll appear here. Be the first." />
      )}
    </Subsection>
  )
}

function NetworkingForm({ prefs, onSave, saving }) {
  const [interests, setInterests] = useState(Array.isArray(prefs.interests) ? prefs.interests.join(', ') : '')
  const [goals, setGoals] = useState(prefs.goals || '')
  const [looking, setLooking] = useState(prefs.looking_for || '')
  const [avail, setAvail] = useState(prefs.availability_note || '')

  const submit = (e) => {
    e.preventDefault()
    onSave({
      visible: true,
      interests: interests.split(/[,\n]/).map((s) => s.trim()).filter(Boolean),
      goals,
      looking_for: looking,
      availability_note: avail,
    })
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 mt-1">
      <label>
        <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: '0.2em', color: '#607186' }}>Interests</span>
        <input value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="sponsorship, broadcasting, venues" className="prog-input" />
      </label>
      <label>
        <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: '0.2em', color: '#607186' }}>What I'm working on</span>
        <textarea rows={2} value={goals} onChange={(e) => setGoals(e.target.value)} placeholder="Building partnership pipeline for our Americas push." className="prog-input" />
      </label>
      <label>
        <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: '0.2em', color: '#607186' }}>Looking to meet</span>
        <textarea rows={2} value={looking} onChange={(e) => setLooking(e.target.value)} placeholder="Brand-side decision-makers and venue operators." className="prog-input" />
      </label>
      <label>
        <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: '0.2em', color: '#607186' }}>Availability note</span>
        <input value={avail} onChange={(e) => setAvail(e.target.value)} placeholder="Free after lunch on day two." className="prog-input" />
      </label>
      <button type="submit" disabled={saving} className="event-btn-primary self-start" style={{ padding: '8px 14px', fontSize: 11 }}>
        {saving ? <Loader2 size={12} className="prog-spin" /> : <UserCheck size={12} />} Save preferences
      </button>
    </form>
  )
}

function DirectoryCard({ entry }) {
  const interests = Array.isArray(entry.interests) ? entry.interests : []
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.10)', padding: 16, display: 'flex', gap: 14 }}>
      {entry.featured_image
        ? <img src={entry.featured_image} alt="" style={{ width: 56, height: 56, objectFit: 'cover', flexShrink: 0 }} />
        : <div style={{ width: 56, height: 56, background: '#FAFBFC', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Users size={20} style={{ color: '#9aa6b3' }} /></div>}
      <div style={{ minWidth: 0, flex: 1 }}>
        <p className="font-heading font-bold" style={{ fontSize: 14, color: '#0D1B2A' }}>{entry.display_name || entry.name}</p>
        {entry.headline && <p className="font-body" style={{ fontSize: 12, color: '#607186' }}>{entry.headline}</p>}
        {entry.looking_for && <p className="font-body mt-2" style={{ fontSize: 12, color: '#3a4a5a' }}><span style={{ color: '#607186' }}>Looking for:</span> {entry.looking_for}</p>}
        {interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {interests.slice(0, 5).map((t) => (
              <span key={t} className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: '0.14em', color: '#607186', background: '#FAFBFC', border: '1px solid rgba(13,27,42,0.06)', padding: '2px 8px' }}>{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Shared primitives ────────────────────────────────────────────────── */

function SectionHeader({ Icon, kicker, title }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div style={{ width: 38, height: 38, background: '#FAFBFC', border: '1px solid rgba(13,27,42,0.08)', display: 'grid', placeItems: 'center' }}>
        <Icon size={18} style={{ color: 'var(--event-primary, #E91E63)' }} />
      </div>
      <div>
        <p className="font-mono uppercase" style={{ fontSize: 10, color: 'var(--event-primary)', letterSpacing: '0.24em' }}>{kicker}</p>
        <h2 className="font-heading font-bold" style={{ fontSize: '1.25rem', color: '#0D1B2A' }}>{title}</h2>
      </div>
    </div>
  )
}

function Subsection({ title, children }) {
  return (
    <div className="mb-5">
      <p className="font-mono uppercase mb-2" style={{ fontSize: 10, letterSpacing: '0.22em', color: '#607186' }}>{title}</p>
      {children}
    </div>
  )
}

function Readiness({ data, editLink }) {
  const pct = typeof data.percent === 'number' ? data.percent : (typeof data.score === 'number' ? data.score : null)
  const items = Array.isArray(data.items) ? data.items : (Array.isArray(data.checklist) ? data.checklist : [])
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.10)', padding: 18, marginBottom: 12 }}>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
        <div>
          <p className="font-heading font-bold" style={{ fontSize: 14, color: '#0D1B2A' }}>Profile readiness</p>
          {pct != null && <p className="font-body" style={{ fontSize: 12, color: '#607186' }}>{Math.round(pct)}% complete</p>}
        </div>
        {editLink && <Link to={editLink} className="event-btn-outline-light" style={{ padding: '8px 14px', fontSize: 11 }}><Edit3 size={12} /> Edit profile</Link>}
      </div>
      {pct != null && (
        <div style={{ height: 6, background: 'rgba(13,27,42,0.08)' }}>
          <div style={{ width: `${Math.max(0, Math.min(100, pct))}%`, height: '100%', background: 'var(--event-primary, #E91E63)' }} />
        </div>
      )}
      {items.length > 0 && (
        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
          {items.map((it, i) => {
            const ok = !!(it.complete ?? it.done ?? it.ok)
            return (
              <li key={it.key || i} className="flex items-center gap-2" style={{ fontSize: 12.5 }}>
                {ok ? <CheckCircle2 size={14} style={{ color: '#10b981' }} /> : <Circle size={14} style={{ color: '#9aa6b3' }} />}
                <span style={{ color: ok ? '#0D1B2A' : '#3a4a5a' }}>{it.label || it.title}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function NextActions({ actions }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {actions.map((a, i) => {
        const body = (
          <div className="flex items-start gap-3">
            <Sparkles size={16} style={{ color: 'var(--event-primary)', marginTop: 2, flexShrink: 0 }} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <p className="font-heading font-bold" style={{ fontSize: 13.5, color: '#0D1B2A' }}>{a.title || a.label}</p>
              {a.description && <p className="font-body mt-1" style={{ fontSize: 12.5, color: '#3a4a5a' }}>{a.description}</p>}
              {(a.due_at || a.due_date) && (
                <p className="font-mono uppercase mt-2" style={{ fontSize: 10, letterSpacing: '0.16em', color: '#607186' }}>
                  <Calendar size={10} style={{ display: 'inline', marginRight: 4 }} /> Due {fmtDate(a.due_at || a.due_date)}
                </p>
              )}
            </div>
            {a.cta_url && <ArrowRight size={14} style={{ color: 'var(--event-primary)', flexShrink: 0, marginTop: 4 }} />}
          </div>
        )
        const style = {
          background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.08)', padding: 14,
          textDecoration: 'none', display: 'block',
        }
        if (a.cta_url) {
          const external = /^https?:\/\//.test(a.cta_url)
          return external
            ? <a key={a.id || i} href={a.cta_url} target="_blank" rel="noreferrer" style={style}>{body}</a>
            : <Link key={a.id || i} to={a.cta_url} style={style}>{body}</Link>
        }
        return <div key={a.id || i} style={style}>{body}</div>
      })}
    </div>
  )
}

function AgendaList({ items }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((it, i) => (
        <div key={it.id || i} style={{ background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.10)', padding: 14 }}>
          <p className="font-heading font-bold" style={{ fontSize: 14, color: '#0D1B2A' }}>{it.title || it.session_title}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
            {(it.starts_at || it.start_time) && (
              <span className="inline-flex items-center gap-1.5 font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', color: '#607186' }}>
                <Calendar size={11} /> {fmtDateTime(it.starts_at || it.start_time)}
              </span>
            )}
            {(it.stage || it.location) && (
              <span className="inline-flex items-center gap-1.5 font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', color: '#607186' }}>
                <MapPin size={11} /> {it.stage || it.location}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function NoRoles() {
  return (
    <div style={{ border: '1px dashed rgba(13,27,42,0.18)', padding: 32, textAlign: 'center', background: '#FFFFFF' }}>
      <Users size={28} style={{ color: '#9aa6b3', margin: '0 auto 12px' }} />
      <p className="font-heading font-bold mb-2" style={{ fontSize: 15, color: '#0D1B2A' }}>Your profile is here, but no event roles yet</p>
      <p className="font-body" style={{ fontSize: 13, color: '#607186', maxWidth: 520, margin: '0 auto 14px' }}>
        Once the Soccerex team confirms you for a session, ticket, or invitation, your tools for it will appear here automatically.
      </p>
    </div>
  )
}

function Pill({ tone, children }) {
  const tones = {
    success: { bg: 'rgba(16,185,129,0.10)', color: '#10b981' },
    warning: { bg: 'rgba(245,158,11,0.12)', color: '#b45309' },
    muted:   { bg: 'rgba(13,27,42,0.06)', color: '#3a4a5a' },
  }
  const t = tones[tone] || tones.muted
  return (
    <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', background: t.bg, color: t.color, padding: '3px 8px', display: 'inline-block' }}>
      {children}
    </span>
  )
}

function Tile({ kicker, title, body, link }) {
  const inner = (
    <>
      <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--event-primary)' }}>{kicker}</p>
      <p className="font-heading font-bold" style={{ fontSize: 14, color: '#0D1B2A' }}>{title}</p>
      {body && <p className="font-body mt-1" style={{ fontSize: 12.5, color: '#3a4a5a' }}>{body}</p>}
    </>
  )
  const style = { background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.10)', padding: 14, textDecoration: 'none', display: 'block' }
  return link
    ? <a href={link} target={link.startsWith('http') ? '_blank' : undefined} rel="noreferrer" style={style}>{inner}</a>
    : <div style={style}>{inner}</div>
}

function Meta({ label, value, mono }) {
  return (
    <div className={mono ? 'font-mono' : 'font-body'} style={{ fontSize: 12, color: '#0D1B2A' }}>
      <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: '0.18em', color: '#607186', marginRight: 6 }}>{label}</span>
      {value}
    </div>
  )
}

function Empty({ icon: Icon, title, body }) {
  return (
    <div style={{ border: '1px dashed rgba(13,27,42,0.18)', padding: 24, textAlign: 'center', background: '#FFFFFF' }}>
      <Icon size={22} style={{ color: '#9aa6b3', margin: '0 auto 10px' }} />
      <p className="font-heading font-bold mb-1" style={{ fontSize: 13.5, color: '#0D1B2A' }}>{title}</p>
      <p className="font-body" style={{ fontSize: 12.5, color: '#607186', maxWidth: 520, margin: '0 auto' }}>{body}</p>
    </div>
  )
}

function Loading({ label }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12" style={{ color: '#607186' }}>
      <Loader2 size={18} className="prog-spin" />
      <span className="font-mono uppercase" style={{ fontSize: 12, letterSpacing: '0.2em' }}>{label}</span>
    </div>
  )
}

function ErrorBanner({ error }) {
  return (
    <div className="flex items-start gap-3 p-5 mb-6" style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.25)' }}>
      <AlertCircle size={20} style={{ color: '#b91c1c', flexShrink: 0 }} />
      <div>
        <p className="font-heading font-bold" style={{ fontSize: 14, color: '#7c1d1d' }}>Could not load your portal</p>
        <p className="font-body mt-1" style={{ fontSize: 13, color: '#7c1d1d' }}>{error?.message || 'Unknown error'}</p>
      </div>
    </div>
  )
}

/* ─── Formatters ───────────────────────────────────────────────────────── */
function fmtDate(v) {
  if (!v) return null
  try { const d = new Date(v); return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) }
  catch { return v }
}
function fmtDateTime(v) {
  if (!v) return null
  try { const d = new Date(v); return Number.isNaN(d.getTime()) ? v : d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) }
  catch { return v }
}
function fmtMoney(row) {
  const amount = row.amount ?? row.total ?? row.value
  if (amount == null) return null
  /* Treat zero as "no money changed hands" — surface complimentary copy
     instead of "$0.00", which would contradict the rights-holder rule
     "Do not show checkout/payment language for complimentary passes." */
  const n = Number(amount)
  if (!Number.isFinite(n) || n === 0) return null
  const currency = row.currency || row.currency_code || 'USD'
  try { return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(n) }
  catch { return `${currency} ${amount}` }
}
