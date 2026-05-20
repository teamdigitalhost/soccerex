import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ExternalLink, Search, Globe2, Building2 } from 'lucide-react'
import { getEvent, getEventSpeakers } from '../lib/soccerexApi'
import { isTestModeFromUrl, withTestSearch } from '../lib/testMode'
import { eventSpeaker } from '../lib/routes'
import { eventThemeClass } from '../lib/eventTheme'
import { EventHeader, LoadingState, ErrorState, EmptyState } from './EventAgendaConcept'

const ROLE_STATUS_LABEL = {
  confirmed: 'Confirmed',
  invited: 'Invited',
  in_discussion: 'In discussion',
  agreed: 'Agreed',
  declined: 'Declined',
  no_response: 'No response',
  cancelled: 'Cancelled',
  completed: 'Completed',
}

export default function EventSpeakers() {
  const { slug } = useParams()
  const location = useLocation()
  const [event, setEvent] = useState(null)
  const [speakers, setSpeakers] = useState(null)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [highlightSlug, setHighlightSlug] = useState(null)

  useEffect(() => {
    let cancelled = false
    setEvent(null); setSpeakers(null); setError(null)
    const test = isTestModeFromUrl()
    Promise.all([getEvent(slug, { test }), getEventSpeakers(slug, { test })])
      .then(([e, s]) => { if (!cancelled) { setEvent(e); setSpeakers(s || []) } })
      .catch((err) => { if (!cancelled) setError(err) })
    return () => { cancelled = true }
  }, [slug])

  /* When the page lands with a #speaker-slug hash (e.g. linked from the
     agenda), wait for cards to render then scroll to the matching one and
     pulse a temporary highlight ring. */
  useEffect(() => {
    if (!speakers || !location.hash) return
    const target = location.hash.slice(1)
    if (!target) return
    /* Defer until after layout */
    const id = window.requestAnimationFrame(() => {
      const el = document.getElementById(`speaker-${target}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setHighlightSlug(target)
        const timer = setTimeout(() => setHighlightSlug(null), 2200)
        return () => clearTimeout(timer)
      }
    })
    return () => window.cancelAnimationFrame(id)
  }, [speakers, location.hash])

  const isPast = useMemo(() => {
    if (!event?.ends_on) return false
    return new Date(event.ends_on) < new Date()
  }, [event])

  const filteredSpeakers = useMemo(() => {
    if (!speakers) return []
    if (!query.trim()) return speakers
    const q = query.trim().toLowerCase()
    return speakers.filter((s) =>
      [s.display_name, s.headline, s.company, s.country]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    )
  }, [speakers, query])

  return (
    <div className={`event-page ${eventThemeClass(slug)}`} style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <EventHeader event={event} slug={slug} active="speakers" loading={!event && !error} />

      <section style={{ padding: 'clamp(40px,6vw,80px) clamp(24px,5vw,80px) clamp(80px,10vw,120px)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

          <div className="mb-10">
            <p className="miami-subhead mb-3" style={{ color: 'var(--event-secondary)', fontSize: 11 }}>
              {isPast ? 'Speaker archive' : 'Speakers'}
            </p>
            <h1 className="miami-headline" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0D1B2A', lineHeight: 1.05, marginBottom: 16 }}>
              {isPast ? (
                <>The voices on the <span className="miami-text-gradient">{event?.cycle || 'event'}</span> stage</>
              ) : (
                <>The voices shaping <span className="miami-text-gradient">{event?.cycle || 'this event'}</span></>
              )}
            </h1>
            <p className="miami-body" style={{ fontSize: '1.05rem', color: '#3a4a5a', maxWidth: 720, lineHeight: 1.6 }}>
              {isPast
                ? 'A look back at the speakers who joined us. Use the search to find a name, company, or country.'
                : 'Confirmed and invited voices in this year\'s program. More are added as the schedule firms up.'}
            </p>
          </div>

          {error && <ErrorState error={error} />}
          {!error && speakers === null && <LoadingState label="Loading speakers" />}

          {speakers && speakers.length === 0 && (
            <EmptyState message="No speakers published yet for this event." />
          )}

          {speakers && speakers.length > 0 && (
            <>
              <div className="flex items-center gap-3 mb-8">
                <div className="relative flex-1 max-w-md">
                  <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#607186' }} />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search speakers, companies, countries"
                    className="prog-input"
                    style={{ paddingLeft: 38 }}
                  />
                </div>
                <span className="miami-subhead" style={{ fontSize: 11, color: '#607186', letterSpacing: '0.16em' }}>
                  {filteredSpeakers.length} of {speakers.length}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSpeakers.map((s) => (
                  <SpeakerCard key={s.slug} speaker={s} archived={isPast} highlighted={highlightSlug === s.slug} eventSlug={slug} />
                ))}
              </div>

              {filteredSpeakers.length === 0 && (
                <p className="text-center miami-body py-12" style={{ color: '#607186' }}>
                  No speakers match "{query}".
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

function SpeakerCard({ speaker, archived, highlighted, eventSlug }) {
  const initials = (speaker.display_name || '?')
    .split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
  const roleStatus = ROLE_STATUS_LABEL[speaker.role_status] || speaker.role_status
  /* Prefer the API-provided profile_path; fall back to the canonical pattern. */
  const rawProfileHref = speaker.profile_path
    || (eventSlug && speaker.slug ? eventSpeaker(eventSlug, speaker.slug) : null)
  /* Preserve ?test=1 across navigation so the test-mode banner stays
     pinned and the next page's API calls keep their test-data scope. */
  const profileHref = rawProfileHref ? withTestSearch(rawProfileHref) : null

  const cardStyle = {
    background: '#FFFFFF',
    border: highlighted ? '1px solid var(--event-primary)' : '1px solid rgba(13,27,42,0.10)',
    boxShadow: highlighted ? '0 0 0 4px var(--event-primary-bg), 0 18px 40px -22px var(--event-primary-glow)' : 'none',
    borderRadius: 14,
    overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
    transition: 'border-color 0.4s ease, box-shadow 0.4s ease, transform 0.2s ease',
    filter: archived ? 'saturate(0.85)' : 'none',
    scrollMarginTop: '120px',
    color: 'inherit', textDecoration: 'none',
  }

  const body = (
    <>
      {/* Photo / placeholder */}
      <div style={{
        position: 'relative', aspectRatio: '4/3',
        background: speaker.photo_url ? '#0D1B2A' : 'var(--event-sunset)',
      }}>
        {speaker.photo_url ? (
          <img src={speaker.photo_url} alt={speaker.display_name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
              filter: archived ? 'grayscale(0.4)' : 'none' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
            <span className="miami-headline" style={{ fontSize: '3.4rem', color: '#fff', opacity: 0.95, letterSpacing: '0.05em' }}>
              {initials}
            </span>
          </div>
        )}
        {roleStatus && (
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 999,
              fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
              background: 'rgba(13,27,42,0.65)', backdropFilter: 'blur(6px)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              fontFamily: 'Montserrat, sans-serif',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: speaker.role_status === 'confirmed' ? '#10b981' : 'var(--event-primary)' }} />
              {roleStatus}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-2">
        <h3 className="miami-headline" style={{ fontSize: '1.15rem', color: '#0D1B2A', letterSpacing: '0.005em' }}>
          {speaker.display_name}
        </h3>
        {speaker.headline && (
          <p className="miami-body" style={{ fontSize: 13, color: '#3a4a5a', lineHeight: 1.45 }}>
            {speaker.headline}
          </p>
        )}

        {(speaker.company || speaker.country) && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1" style={{ fontSize: 12, color: '#607186' }}>
            {speaker.company && (
              <span className="flex items-center gap-1.5"><Building2 size={11} /> {speaker.company}</span>
            )}
            {speaker.country && (
              <span className="flex items-center gap-1.5"><Globe2 size={11} /> {speaker.country}</span>
            )}
          </div>
        )}

        {speaker.bio && (
          <p className="miami-body mt-2" style={{ fontSize: 12, color: '#3a4a5a', lineHeight: 1.55 }}>
            {speaker.bio}
          </p>
        )}

        {profileHref && (
          <span className="miami-subhead mt-3 inline-flex items-center gap-1.5"
            style={{ fontSize: 11, color: 'var(--event-primary)', letterSpacing: '0.14em' }}>
            View profile <ExternalLink size={11} />
          </span>
        )}
      </div>
    </>
  )

  if (profileHref) {
    return (
      <Link to={profileHref} id={`speaker-${speaker.slug}`} className="speaker-card-link" style={cardStyle}>
        {body}
      </Link>
    )
  }
  return (
    <article id={`speaker-${speaker.slug}`} style={cardStyle}>{body}</article>
  )
}
