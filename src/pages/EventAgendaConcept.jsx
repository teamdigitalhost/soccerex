import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Users, Megaphone, Layers, AlertCircle, Loader2 } from 'lucide-react'
import { getEvent, getAgendaConcept, clapConcept } from '../lib/soccerexApi'
import { isTestModeFromUrl, withTestSearch } from '../lib/testMode'
import { isPreviewFromUrl, withPreviewSearch } from '../lib/previewMode'
import { eventThemeClass } from '../lib/eventTheme'
import ProgrammingSubmissionForm from '../components/ProgrammingSubmissionForm'
import { HOME, eventAgendaConcept, eventAgenda, eventSpeakers } from '../lib/routes'

const STATUS_LABEL = {
  in_program: 'In program',
  approved: 'Approved concept',
  proposed: 'Proposed',
  archived: 'Archived',
}

const STATUS_STYLE = {
  in_program: { color: '#fff', bg: 'var(--event-primary)', border: 'transparent' },
  approved: { color: '#0D1B2A', bg: 'var(--event-tile-soft)', border: 'var(--event-primary-border)' },
  proposed: { color: '#0D1B2A', bg: 'rgba(106,57,198,0.08)', border: 'rgba(106,57,198,0.30)' },
  archived: { color: '#607186', bg: 'rgba(13,27,42,0.05)', border: 'rgba(13,27,42,0.15)' },
}

export default function EventAgendaConcept() {
  const { slug } = useParams()
  const [event, setEvent] = useState(null)
  const [topics, setTopics] = useState(null)
  const [error, setError] = useState(null)
  const [activeTheme, setActiveTheme] = useState(null)
  const [submissionTopic, setSubmissionTopic] = useState(null)
  const [submissionOpen, setSubmissionOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    setEvent(null); setTopics(null); setError(null)
    const test = isTestModeFromUrl()
    Promise.all([getEvent(slug, { test }), getAgendaConcept(slug, { test })])
      .then(([e, t]) => { if (!cancelled) { setEvent(e); setTopics(t || []) } })
      .catch((err) => { if (!cancelled) setError(err) })
    return () => { cancelled = true }
  }, [slug])

  const themes = useMemo(() => {
    if (!topics) return []
    const seen = new Map()
    topics.forEach((t) => {
      if (!t.theme) return
      if (!seen.has(t.theme)) seen.set(t.theme, 0)
      seen.set(t.theme, seen.get(t.theme) + 1)
    })
    return Array.from(seen.entries()).map(([name, count]) => ({ name, count }))
  }, [topics])

  const filteredTopics = useMemo(() => {
    if (!topics) return []
    if (!activeTheme) return topics
    return topics.filter((t) => t.theme === activeTheme)
  }, [topics, activeTheme])

  const openSubmissionFor = (topic) => {
    setSubmissionTopic(topic ? { slug: topic.slug, title: topic.title } : null)
    setSubmissionOpen(true)
  }

  return (
    <div className={`event-page ${eventThemeClass(slug)}`} style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <EventHeader event={event} slug={slug} active="agenda-concept" loading={!event && !error} />

      <section style={{ padding: 'clamp(40px,6vw,80px) clamp(24px,5vw,80px) clamp(80px,10vw,120px)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

          <div className="mb-10">
            <p className="miami-subhead mb-3" style={{ color: 'var(--event-secondary)', fontSize: 11 }}>Program themes</p>
            <h1 className="miami-headline" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0D1B2A', lineHeight: 1.05, marginBottom: 16 }}>
              The shape of the <span className="miami-text-gradient">conversation</span>
            </h1>
            <p className="miami-body" style={{ fontSize: '1.05rem', color: '#3a4a5a', maxWidth: 720, lineHeight: 1.6 }}>
              These are the topics our program team is shaping for {event?.name || 'this event'}. Some are already in the running order, others are approved concepts looking for the right voices. If a topic looks like yours, suggest a speaker, or pitch your own session.
            </p>
          </div>

          {error && <ErrorState error={error} />}
          {!error && topics === null && <LoadingState label="Loading program themes" />}

          {topics && topics.length === 0 && (
            <EmptyState message="No topics published yet for this event." />
          )}

          {topics && topics.length > 0 && (
            <>
              {/* Theme filter chips */}
              {themes.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  <ThemeChip
                    label={`All themes (${topics.length})`}
                    active={activeTheme === null}
                    onClick={() => setActiveTheme(null)}
                  />
                  {themes.map((t) => (
                    <ThemeChip
                      key={t.name}
                      label={`${t.name} (${t.count})`}
                      active={activeTheme === t.name}
                      onClick={() => setActiveTheme(t.name)}
                    />
                  ))}
                </div>
              )}

              {/* Topic grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredTopics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} slug={slug} />
                ))}
              </div>

              {/* One place to get involved — no "suggest a speaker" on every topic.
                  The form's kind chooser (speaker / topic / session) asks only the
                  questions relevant to what they pick. */}
              <div className="mt-12 p-7 rounded-2xl text-center" style={{ background: 'var(--event-tile-soft)', border: '1px solid rgba(13,27,42,0.06)' }}>
                <p className="miami-subhead mb-2" style={{ color: 'var(--event-primary)', fontSize: 11 }}>Want to be part of the programme?</p>
                <h3 className="miami-headline mb-2" style={{ fontSize: '1.4rem', color: '#0D1B2A' }}>Suggest a speaker or a topic</h3>
                <p className="miami-body mb-5" style={{ fontSize: '0.95rem', color: '#3a4a5a', maxWidth: 560, margin: '0 auto 20px' }}>
                  Have someone in mind for the stage, a theme we have not listed, or a session you would like to lead? Tell the Soccerex program team here — we will ask only what is relevant to your idea.
                </p>
                <button type="button" onClick={() => openSubmissionFor(null)} className="miami-pill-primary" style={{ display: 'inline-flex' }}>
                  <Megaphone size={15} /> Suggest a speaker or topic
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      <ProgrammingSubmissionForm
        open={submissionOpen}
        onClose={() => setSubmissionOpen(false)}
        eventSlug={slug}
        topic={submissionTopic}
        defaultKind="speaker_interest"
      />
    </div>
  )
}

function TopicCard({ topic, slug }) {
  const status = STATUS_STYLE[topic.status] || STATUS_STYLE.proposed
  const statusLabel = STATUS_LABEL[topic.status] || topic.status

  return (
    <article style={{
      background: '#FFFFFF',
      border: '1px solid rgba(13,27,42,0.10)',
      borderRadius: 14,
      padding: 'clamp(20px, 2vw, 28px)',
      display: 'flex', flexDirection: 'column', gap: 14,
      position: 'relative', overflow: 'hidden',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--event-sunset)' }} />

      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 999,
            fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: status.color, background: status.bg,
            border: status.border === 'transparent' ? 'none' : `1px solid ${status.border}`,
            fontFamily: 'Montserrat, sans-serif',
          }}>
            {statusLabel}
          </span>
          {topic.theme && (
            <span className="miami-subhead" style={{ color: 'var(--event-secondary)', fontSize: 10 }}>{topic.theme}</span>
          )}
        </div>
      </div>

      <h3 className="miami-headline" style={{ fontSize: 'clamp(1.15rem, 1.8vw, 1.4rem)', color: '#0D1B2A', lineHeight: 1.15 }}>
        {topic.title}
      </h3>

      {topic.summary && (
        <p className="miami-body" style={{ fontSize: '0.95rem', color: '#3a4a5a', lineHeight: 1.55 }}>
          {topic.summary}
        </p>
      )}

      <dl className="grid grid-cols-1 gap-2 mt-1" style={{ fontSize: 12 }}>
        {topic.audience && (
          <Meta icon={Users} label="Audience">{topic.audience}</Meta>
        )}
        {topic.keywords?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {topic.keywords.map((kw) => (
              <span key={kw} className="miami-body" style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 4,
                background: 'rgba(13,27,42,0.05)', color: '#3a4a5a',
              }}>#{kw}</span>
            ))}
          </div>
        )}
      </dl>

      <div className="flex items-center justify-end gap-3 mt-2 pt-4" style={{ borderTop: '1px solid rgba(13,27,42,0.08)' }}>
        <ClapButton topic={topic} slug={slug} />
      </div>
    </article>
  )
}

function ClapButton({ topic, slug }) {
  const [claps, setClaps] = useState(topic.claps || 0)
  const [bump, setBump] = useState(false)
  const pending = useRef(0)
  const timer = useRef(null)

  const flush = () => {
    const n = pending.current
    pending.current = 0
    if (n > 0) {
      clapConcept(slug, topic.slug, n)
        .then((r) => { if (r && typeof r.claps === 'number') setClaps(r.claps) })
        .catch(() => {})
    }
  }

  // Don't lose un-sent claps if they navigate away mid-applause.
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
    if (pending.current > 0) clapConcept(slug, topic.slug, pending.current).catch(() => {})
  }, [slug, topic.slug])

  const clap = () => {
    setClaps((c) => c + 1)
    pending.current += 1
    setBump(true)
    setTimeout(() => setBump(false), 160)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(flush, 700)
  }

  return (
    <button type="button" onClick={clap} aria-label="Clap for this concept"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: '6px 13px', borderRadius: 999, cursor: 'pointer',
        border: '1px solid rgba(13,27,42,0.12)', background: '#fff',
        fontFamily: 'Montserrat, sans-serif', fontSize: 12.5, fontWeight: 600, color: '#3a4a5a',
        transition: 'border-color .15s, box-shadow .15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--event-primary)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(13,27,42,0.08)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(13,27,42,0.12)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <span style={{ fontSize: 15, display: 'inline-block', transform: bump ? 'scale(1.35) rotate(-8deg)' : 'scale(1)', transition: 'transform .16s' }}>👏</span>
      {claps > 0 ? <span style={{ fontVariantNumeric: 'tabular-nums' }}>{claps.toLocaleString()}</span> : <span>Clap for this</span>}
    </button>
  )
}

function Meta({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={14} style={{ color: '#607186', marginTop: 2, flexShrink: 0 }} />
      <div>
        <span className="miami-subhead" style={{ fontSize: 9, color: '#607186', letterSpacing: '0.18em', display: 'block' }}>{label}</span>
        <span className="miami-body" style={{ fontSize: 12, color: '#0D1B2A' }}>{children}</span>
      </div>
    </div>
  )
}

function ThemeChip({ label, active, onClick }) {
  return (
    <button type="button" onClick={onClick} className="miami-subhead" style={{
      padding: '8px 14px', borderRadius: 999,
      fontSize: 11, letterSpacing: '0.16em',
      background: active ? '#0D1B2A' : 'rgba(13,27,42,0.04)',
      color: active ? '#fff' : '#0D1B2A',
      border: active ? '1px solid #0D1B2A' : '1px solid rgba(13,27,42,0.10)',
      cursor: 'pointer', transition: 'all 0.15s',
    }}>{label}</button>
  )
}

/* ─── Shared event header (used by all 3 programming pages) ─────────────── */
export function EventHeader({ event, slug, active, loading }) {
  const isPast = event && (() => {
    const ends = event.ends_on
    if (!ends) return false
    return new Date(ends) < new Date()
  })()

  return (
    <>
      {/* Spacer clears the fixed 72px global navbar so this sub-nav (and its
          Program themes / Schedule / Speakers tabs) is never hidden behind it. */}
      <div aria-hidden="true" style={{ height: 72 }} />
      {/* A preview shows unpublished work. Say so on every page of it, so a
          screenshot of a draft can never be mistaken for the live site. */}
      {isPreviewFromUrl() && (
        <div role="status" style={{
          background: '#7A1FA2', color: '#FFFFFF', textAlign: 'center',
          padding: '8px 16px', fontFamily: 'monospace', fontSize: 12,
          letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>
          Draft preview, not published. Includes unconfirmed speakers and unpublished sessions.
        </div>
      )}
    <header style={{
      borderBottom: '1px solid rgba(13,27,42,0.08)',
      background: '#FFFFFF',
      padding: 'clamp(20px, 3vw, 32px) clamp(24px, 5vw, 80px)',
      position: 'sticky', top: 72, zIndex: 20, backdropFilter: 'blur(8px)',
    }}>
      <div className="flex items-center justify-between gap-6 flex-wrap" style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div className="flex items-center gap-4 flex-wrap">
          <Link to={HOME} className="inline-flex items-center gap-2 font-mono uppercase tracking-widest"
            style={{ fontSize: 11, color: '#0D1B2A', opacity: 0.55, textDecoration: 'none' }}>
            <ArrowLeft size={13} /> Soccerex
          </Link>
          <span style={{ width: 1, height: 18, background: 'rgba(13,27,42,0.15)' }} />
          <div>
            <p className="miami-subhead" style={{ fontSize: 10, color: 'var(--event-primary)', letterSpacing: '0.2em' }}>
              {loading ? 'Loading' : (event?.cycle || event?.name || slug)}
            </p>
            <p className="miami-headline" style={{ fontSize: 16, color: '#0D1B2A' }}>
              {event?.name || slug}
            </p>
            {event && (
              <p className="miami-body" style={{ fontSize: 12, color: '#607186', marginTop: 2 }}>
                <Calendar size={11} style={{ display: 'inline', marginRight: 4 }} />
                {formatDateRange(event.starts_on, event.ends_on)}
                {event.venue?.name && (
                  <>{' '}<MapPin size={11} style={{ display: 'inline', margin: '0 4px 0 8px' }} />{event.venue.name}</>
                )}
                {isPast && <span style={{ marginLeft: 10, color: 'var(--event-primary)', fontWeight: 600 }}>· Concluded</span>}
              </p>
            )}
          </div>
        </div>

        <nav className="flex gap-1 flex-wrap" aria-label="Programming sections">
          <NavTab to={withPreviewSearch(withTestSearch(eventAgendaConcept(slug)))} active={active === 'agenda-concept'}>Program themes</NavTab>
          <NavTab to={withPreviewSearch(withTestSearch(eventAgenda(slug)))} active={active === 'agenda'}>Schedule</NavTab>
          <NavTab to={withPreviewSearch(withTestSearch(eventSpeakers(slug)))} active={active === 'speakers'}>Speakers</NavTab>
        </nav>
      </div>
    </header>
    </>
  )
}

function NavTab({ to, active, children }) {
  return (
    <Link to={to} className="miami-subhead" style={{
      padding: '8px 14px', borderRadius: 999,
      fontSize: 11, letterSpacing: '0.16em',
      background: active ? '#0D1B2A' : 'transparent',
      color: active ? '#fff' : '#0D1B2A',
      border: active ? '1px solid #0D1B2A' : '1px solid transparent',
      textDecoration: 'none', transition: 'all 0.15s',
    }}>{children}</Link>
  )
}

export function LoadingState({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-20" style={{ color: '#607186' }}>
      <Loader2 size={20} className="prog-spin" />
      <span className="miami-subhead" style={{ fontSize: 12 }}>{label}</span>
    </div>
  )
}

export function ErrorState({ error }) {
  return (
    <div className="flex items-start gap-3 p-5 rounded-xl" style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.25)' }}>
      <AlertCircle size={20} style={{ color: '#b91c1c', flexShrink: 0 }} />
      <div>
        <p className="miami-headline" style={{ fontSize: 14, color: '#7c1d1d', letterSpacing: '0.04em' }}>Could not load programming data</p>
        <p className="miami-body mt-1" style={{ fontSize: 13, color: '#7c1d1d' }}>
          {error?.message || 'Unknown error'}
        </p>
      </div>
    </div>
  )
}

export function EmptyState({ message }) {
  return (
    <div className="text-center py-16 rounded-xl" style={{ background: '#FFF1EB', border: '1px dashed rgba(13,27,42,0.15)' }}>
      <p className="miami-body" style={{ fontSize: 14, color: '#607186' }}>{message}</p>
    </div>
  )
}

export function formatDateRange(startsOn, endsOn) {
  if (!startsOn) return ''
  const s = new Date(startsOn + 'T00:00:00')
  const e = endsOn ? new Date(endsOn + 'T00:00:00') : null
  const opts = { month: 'short', day: 'numeric', year: 'numeric' }
  if (!e || s.toDateString() === e.toDateString()) {
    return s.toLocaleDateString('en-US', opts)
  }
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    return `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${e.getDate()}, ${s.getFullYear()}`
  }
  return `${s.toLocaleDateString('en-US', opts)} - ${e.toLocaleDateString('en-US', opts)}`
}
