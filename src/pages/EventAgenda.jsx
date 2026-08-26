import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Calendar, Clock, MapPin, List, LayoutGrid, Star, Video } from 'lucide-react'
import { getEvent, getAgenda } from '../lib/soccerexApi'
import { isTestModeFromUrl, withTestSearch } from '../lib/testMode'
import { withPreviewSearch } from '../lib/previewMode'
import { eventSpeaker } from '../lib/routes'
import { eventThemeClass } from '../lib/eventTheme'
import { EventHeader, LoadingState, ErrorState, EmptyState } from './EventAgendaConcept'

export default function EventAgenda() {
  const { slug } = useParams()
  const [event, setEvent] = useState(null)
  const [sessions, setSessions] = useState(null)
  const [error, setError] = useState(null)
  const [view, setView] = useState('timeline') // 'timeline' | 'list'
  const [activeDay, setActiveDay] = useState(null)

  useEffect(() => {
    let cancelled = false
    setEvent(null); setSessions(null); setError(null)
    const test = isTestModeFromUrl()
    Promise.all([getEvent(slug, { test }), getAgenda(slug, { test })])
      .then(([e, s]) => { if (!cancelled) { setEvent(e); setSessions(s || []) } })
      .catch((err) => { if (!cancelled) setError(err) })
    return () => { cancelled = true }
  }, [slug])

  const grouped = useMemo(() => groupByDayAndStage(sessions || [], slug), [sessions, slug])
  const days = grouped.map((g) => g.day)

  /* Default-select first day once data lands */
  useEffect(() => {
    if (days.length > 0 && !activeDay) setActiveDay(days[0])
  }, [days, activeDay])

  const activeGroup = grouped.find((g) => g.day === activeDay) || grouped[0]

  return (
    <div className={`event-page ${eventThemeClass(slug)}`} style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <EventHeader event={event} slug={slug} active="agenda" loading={!event && !error} />

      <section style={{ padding: 'clamp(40px,6vw,80px) clamp(24px,5vw,80px) clamp(80px,10vw,120px)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

          <div className="mb-10">
            <p className="miami-subhead mb-3" style={{ color: 'var(--event-secondary)', fontSize: 11 }}>Schedule</p>
            <h1 className="miami-headline" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0D1B2A', lineHeight: 1.05, marginBottom: 16 }}>
              The <span className="miami-text-gradient">running order</span>
            </h1>
            <p className="miami-body" style={{ fontSize: '1.05rem', color: '#3a4a5a', maxWidth: 720, lineHeight: 1.6 }}>
              {sessions && sessions.length > 0
                ? `${sessions.length} session${sessions.length === 1 ? '' : 's'} across ${grouped.length} day${grouped.length === 1 ? '' : 's'}, grouped by stage. All times shown in event time.`
                : 'Live program schedule, grouped by day and stage.'}
            </p>
          </div>

          {error && <ErrorState error={error} />}
          {!error && sessions === null && <LoadingState label="Loading schedule" />}

          {sessions && sessions.length === 0 && (
            <EmptyState message="No sessions published yet for this event." />
          )}

          {sessions && sessions.length > 0 && (
            <>
              <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
                <div className="flex flex-wrap gap-2">
                  {grouped.map((g, i) => (
                    <button key={g.day} type="button" onClick={() => setActiveDay(g.day)} className="miami-subhead" style={{
                      padding: '10px 16px', borderRadius: 12,
                      fontSize: 11, letterSpacing: '0.14em',
                      background: activeDay === g.day ? '#0D1B2A' : '#FFFFFF',
                      color: activeDay === g.day ? '#fff' : '#0D1B2A',
                      border: '1px solid ' + (activeDay === g.day ? '#0D1B2A' : 'rgba(13,27,42,0.10)'),
                      cursor: 'pointer', transition: 'all 0.15s',
                      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2,
                    }}>
                      <span style={{ fontSize: 9, opacity: 0.7 }}>Day {i + 1}</span>
                      <span style={{ fontSize: 13 }}>{formatDayLabel(g.day)}</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-1" role="tablist" aria-label="View toggle">
                  <ViewBtn active={view === 'timeline'} onClick={() => setView('timeline')} icon={LayoutGrid} label="Timeline" />
                  <ViewBtn active={view === 'list'} onClick={() => setView('list')} icon={List} label="List" />
                </div>
              </div>

              {activeGroup && (
                view === 'timeline'
                  ? <TimelineView group={activeGroup} />
                  : <ListView group={activeGroup} />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

function ViewBtn({ active, onClick, icon: Icon, label }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '8px 12px', borderRadius: 8,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
      background: active ? '#0D1B2A' : '#FFFFFF',
      color: active ? '#fff' : '#0D1B2A',
      border: '1px solid ' + (active ? '#0D1B2A' : 'rgba(13,27,42,0.10)'),
      cursor: 'pointer', fontFamily: 'Montserrat, sans-serif',
    }}>
      <Icon size={13} /> {label}
    </button>
  )
}

function TimelineView({ group }) {
  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${Math.max(1, group.stages.length)}, minmax(260px, 1fr))` }}>
      {group.stages.map((stage) => {
        const isTvStudio = stage.kind === 'tv_studio'
        return (
        <div key={stage.slug || stage.name} style={{
          background: '#FAFBFC',
          border: isTvStudio ? '1.5px solid var(--event-primary)' : '1px solid rgba(13,27,42,0.08)',
          borderRadius: 14, padding: 16, minWidth: 0,
        }}>
          <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid rgba(13,27,42,0.08)' }}>
            {isTvStudio
              ? <Video size={14} style={{ color: 'var(--event-primary)' }} />
              : <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--event-primary)' }} />}
            <p className="miami-headline" style={{ fontSize: 13, color: '#0D1B2A', letterSpacing: '0.04em' }}>{stage.name}</p>
            {isTvStudio && (
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: '#fff', background: 'var(--event-primary)', padding: '2px 6px', borderRadius: 4,
                fontFamily: 'Montserrat, sans-serif',
              }}>TV Studio</span>
            )}
            <span className="miami-body" style={{ fontSize: 11, color: '#607186', marginLeft: 'auto' }}>{stage.sessions.length}</span>
          </div>
          <div className="flex flex-col gap-2">
            {stage.sessions.map((s) => <SessionCard key={s.id} session={s} compact />)}
          </div>
        </div>
        )
      })}
    </div>
  )
}

function ListView({ group }) {
  return (
    <div className="flex flex-col gap-3">
      {group.flatSessions.map((s) => <SessionCard key={s.id} session={s} />)}
    </div>
  )
}

function SessionCard({ session, compact }) {
  const featured = !!session.is_featured
  return (
    <article style={{
      background: featured ? 'var(--event-tile-soft, #FFFFFF)' : '#FFFFFF',
      border: featured ? '1.5px solid var(--event-primary)' : '1px solid rgba(13,27,42,0.10)',
      borderRadius: 12,
      padding: compact ? 14 : 18,
      display: 'flex', flexDirection: 'column', gap: 10,
      boxShadow: featured ? '0 6px 20px rgba(13,27,42,0.10)' : 'none',
    }}>
      <div className="flex items-center gap-3 flex-wrap">
        <span className="miami-subhead" style={{
          fontSize: 11, letterSpacing: '0.14em', color: 'var(--event-primary)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          <Clock size={11} style={{ display: 'inline', marginRight: 4 }} />
          {formatTime(session.starts_at)} - {formatTime(session.ends_at)}
        </span>
        {featured && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 8px', borderRadius: 4,
            fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
            color: '#FFFFFF', background: 'var(--event-primary)',
            fontFamily: 'Montserrat, sans-serif',
          }}>
            <Star size={10} style={{ fill: 'currentColor' }} />
            Featured
          </span>
        )}
        {session.format && (
          <span style={{
            padding: '2px 8px', borderRadius: 4,
            fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'var(--event-secondary)', background: 'var(--event-tile-soft)',
            fontFamily: 'Montserrat, sans-serif',
          }}>
            {session.format}
          </span>
        )}
        {!compact && session.stage?.name && (
          <span className="miami-body" style={{ fontSize: 11, color: '#607186' }}>
            <MapPin size={11} style={{ display: 'inline', marginRight: 3 }} />
            {session.stage.name}
          </span>
        )}
      </div>

      <h3 className="miami-headline" style={{ fontSize: compact ? '0.95rem' : '1.1rem', color: '#0D1B2A', lineHeight: 1.2, letterSpacing: '0.005em' }}>
        {session.title}
      </h3>

      {!compact && session.abstract && (
        <p className="miami-body" style={{ fontSize: 13, color: '#3a4a5a', lineHeight: 1.55 }}>
          {session.abstract}
        </p>
      )}

      {session.topic && (
        <p className="miami-body" style={{ fontSize: 11, color: '#607186' }}>
          Topic: <span style={{ color: '#0D1B2A' }}>{session.topic.title}</span>
          {session.topic.theme && <span style={{ color: '#607186' }}> · {session.topic.theme}</span>}
        </p>
      )}

      {session.speakers?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {session.speakers.map((sp) => (
            <SpeakerChip key={sp.slug} speaker={sp} eventSlug={session._eventSlug} />
          ))}
        </div>
      )}
    </article>
  )
}

function SpeakerChip({ speaker, eventSlug }) {
  const initials = (speaker.display_name || '?')
    .split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
  /* Prefer the API-provided profile_path (event-scoped speaker profile).
     Fall back to constructing the same path from the event + speaker slugs
     if the older agenda payload didn't include it. */
  /* Prefer the route builder so the path is consistent with App.jsx routes
     and so withTestSearch() can preserve ?test=1 from the agenda URL into
     the speaker profile URL. */
  const rawHref = speaker.profile_path
    || (eventSlug && speaker.slug ? eventSpeaker(eventSlug, speaker.slug) : null)
  const href = rawHref ? withPreviewSearch(withTestSearch(rawHref)) : null

  const inner = (
    <>
      {speaker.photo_url ? (
        <img src={speaker.photo_url} alt="" style={{ width: 22, height: 22, borderRadius: 999, objectFit: 'cover' }} />
      ) : (
        <span style={{
          width: 22, height: 22, borderRadius: 999,
          background: 'var(--event-text-gradient)',
          color: '#fff', display: 'grid', placeItems: 'center',
          fontSize: 10, fontWeight: 700, fontFamily: 'Oswald, sans-serif',
        }}>{initials}</span>
      )}
      <span className="miami-body" style={{ color: '#0D1B2A' }}>{speaker.display_name}</span>
      {speaker.role && speaker.role !== 'speaker' && (
        <span className="miami-subhead" style={{ fontSize: 9, color: 'var(--event-primary)', letterSpacing: '0.14em' }}>{speaker.role}</span>
      )}
    </>
  )

  const baseStyle = {
    padding: '4px 10px 4px 4px', borderRadius: 999,
    background: 'rgba(13,27,42,0.04)',
    border: '1px solid rgba(13,27,42,0.08)',
    fontSize: 12,
    transition: 'background 0.15s, border-color 0.15s',
  }

  if (!href) {
    return <span className="flex items-center gap-2" style={baseStyle}>{inner}</span>
  }
  return (
    <Link to={href} className="speaker-chip flex items-center gap-2"
      style={{ ...baseStyle, textDecoration: 'none', cursor: 'pointer' }}>
      {inner}
    </Link>
  )
}

/* ─── Helpers ───────────────────────────────────────────────────────────── */

function groupByDayAndStage(sessions, eventSlug) {
  const byDay = new Map()
  for (const raw of sessions) {
    if (!raw.starts_at) continue
    const s = { ...raw, _eventSlug: eventSlug }
    /* Use the YYYY-MM-DD prefix of the ISO string. starts_at already carries
       the event-zone offset, so this groups by the actual event-local day. */
    const day = s.starts_at.slice(0, 10)
    if (!byDay.has(day)) byDay.set(day, [])
    byDay.get(day).push(s)
  }

  const result = []
  for (const [day, daySessions] of Array.from(byDay.entries()).sort()) {
    daySessions.sort((a, b) => a.starts_at.localeCompare(b.starts_at))
    const byStage = new Map()
    for (const s of daySessions) {
      const key = s.stage?.slug || s.stage?.name || 'unscheduled'
      if (!byStage.has(key)) byStage.set(key, { slug: key, name: s.stage?.name || 'Unscheduled', kind: s.stage?.kind, sessions: [] })
      byStage.get(key).sessions.push(s)
    }
    result.push({
      day,
      stages: Array.from(byStage.values()),
      flatSessions: daySessions,
    })
  }
  return result
}

function formatTime(iso) {
  if (!iso) return ''
  /* The serialized ISO already includes the event timezone offset. We extract
     the literal HH:MM from the string so the displayed time matches what the
     event program actually says, regardless of the user's local timezone. */
  const m = iso.match(/T(\d{2}):(\d{2})/)
  if (!m) return ''
  let [, h, mm] = m
  let hour = parseInt(h, 10)
  const period = hour >= 12 ? 'PM' : 'AM'
  hour = hour % 12 || 12
  return `${hour}:${mm} ${period}`
}

function formatDayLabel(yyyymmdd) {
  if (!yyyymmdd) return ''
  const d = new Date(yyyymmdd + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}
