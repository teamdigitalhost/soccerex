import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, Users } from 'lucide-react'
import { getAgenda } from '../lib/soccerexApi'
import { eventAgenda, eventSpeakers } from '../lib/routes'

/*
 * The running order, high on the page, because that is what people come for once
 * the agenda is out. It reads the live agenda API, so panels that move or get
 * added show here without anyone editing this file, and it prints nothing at all
 * if the API is unreachable rather than leaving an empty shell on the page.
 *
 * Times come straight off the ISO string rather than through Date(), so a visitor
 * in London still reads Miami's own start times.
 */

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function eventClock(iso) {
  const [, hh, mm] = /T(\d{2}):(\d{2})/.exec(iso || '') || []
  if (!hh) return ''
  const hour = Number(hh)
  return `${((hour + 11) % 12) + 1}:${mm} ${hour < 12 ? 'AM' : 'PM'}`
}

function eventDate(iso) {
  const [y, m, d] = (iso || '').slice(0, 10).split('-').map(Number)
  if (!y) return { key: '', label: '' }
  const at = new Date(Date.UTC(y, m - 1, d))
  return { key: (iso || '').slice(0, 10), label: `${DAY_NAMES[at.getUTCDay()]}, ${MONTHS[m - 1]} ${d}` }
}

export default function AgendaHighlight({ slug, perDay = 7, lead = 'The Full Agenda for', highlight = 'Miami 2026' }) {
  const [sessions, setSessions] = useState(null)
  // The rest of each day opens in place, so nobody has to leave the page to read the running order.
  const [openDays, setOpenDays] = useState([])

  useEffect(() => {
    let cancelled = false
    getAgenda(slug)
      .then((rows) => { if (!cancelled) setSessions(Array.isArray(rows) ? rows : []) })
      .catch(() => { if (!cancelled) setSessions([]) })
    return () => { cancelled = true }
  }, [slug])

  if (!sessions || sessions.length === 0) return null

  const ordered = [...sessions].sort((a, b) => String(a.starts_at).localeCompare(String(b.starts_at)))
  const days = []
  ordered.forEach((s) => {
    const { key, label } = eventDate(s.starts_at)
    const day = days.find((d) => d.key === key)
    if (day) day.rows.push(s)
    else days.push({ key, label, rows: [s] })
  })
  const speakerCount = new Set(ordered.flatMap((s) => (s.speakers || []).map((p) => p.slug || p.display_name))).size

  return (
    <section className="relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #0D1B2A 0%, #102538 100%)',
      padding: 'clamp(64px,8vw,104px) clamp(24px,5vw,80px)',
    }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }} />

      <div className="relative z-10" style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <div className="text-center" style={{ marginBottom: 'clamp(32px,4vw,48px)' }}>
          <h2 className="font-heading font-bold text-white" style={{ fontSize: 'clamp(1.9rem, 3.6vw, 2.8rem)', lineHeight: 1.1, textWrap: 'balance' }}>
            {lead}{' '}
            <span style={{ color: '#E91E63' }}>{highlight}</span>
          </h2>
          <p className="font-body mt-4 mx-auto" style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.72)', maxWidth: 640, lineHeight: 1.6 }}>
            {ordered.length} panels across {days.length} days at Nu Stadium, with {speakerCount} speakers on stage.
            Here is the running order as it stands today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'clamp(20px,2.5vw,32px)' }}>
          {days.map((day, i) => (
            <div key={day.key} style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: 'clamp(20px,2.4vw,30px)',
            }}>
              <div className="flex items-baseline gap-3" style={{ marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                <span className="font-heading font-bold" style={{ fontSize: '1.15rem', color: '#FFFFFF', letterSpacing: '0.02em' }}>Day {i + 1}</span>
                <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: '#5BC8D6' }}>{day.label}</span>
              </div>

              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {(openDays.includes(day.key) ? day.rows : day.rows.slice(0, perDay)).map((s) => (
                  <li key={s.id || s.slug} className="flex gap-4" style={{ padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <span className="font-mono" style={{ fontSize: 12, color: '#E91E63', whiteSpace: 'nowrap', paddingTop: 2, minWidth: 68, fontVariantNumeric: 'tabular-nums' }}>
                      {eventClock(s.starts_at)}
                    </span>
                    <span className="font-body" style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.92)', lineHeight: 1.4 }}>
                      {s.title}
                      {s.speakers?.length > 0 && (
                        <span className="block mt-1" style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                          <Users size={11} className="inline mr-1.5" style={{ verticalAlign: '-1px' }} />
                          {s.speakers.slice(0, 3).map((p) => p.display_name).join(', ')}
                          {s.speakers.length > 3 ? ` and ${s.speakers.length - 3} more` : ''}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              {day.rows.length > perDay && (
                <button
                  type="button"
                  aria-expanded={openDays.includes(day.key)}
                  onClick={() => setOpenDays((open) => (open.includes(day.key) ? open.filter((k) => k !== day.key) : [...open, day.key]))}
                  className="font-mono uppercase inline-flex items-center gap-2"
                  style={{
                    fontSize: 11, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.72)', marginTop: 14,
                    background: 'transparent', border: 0, padding: '4px 0', cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#5BC8D6' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.72)' }}
                >
                  {openDays.includes(day.key)
                    ? 'Show fewer'
                    : `Show all ${day.rows.length} panels`}
                  <ChevronDown size={13} style={{ transform: openDays.includes(day.key) ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4" style={{ marginTop: 'clamp(28px,3.5vw,42px)' }}>
          <Link
            to={eventAgenda(slug)}
            className="inline-flex items-center gap-2 font-body font-semibold text-sm uppercase tracking-[0.15em] px-8 py-4 transition-all duration-200"
            style={{ background: '#E91E63', color: '#FFFFFF', textDecoration: 'none', border: '1px solid #E91E63' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#c81b58'; e.currentTarget.style.borderColor = '#c81b58' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#E91E63'; e.currentTarget.style.borderColor = '#E91E63' }}
          >
            See the full agenda <ArrowRight size={15} />
          </Link>
          <Link
            to={eventSpeakers(slug)}
            className="inline-flex items-center gap-2 font-body font-semibold text-sm uppercase tracking-[0.15em] px-8 py-4 transition-all duration-200"
            style={{ background: 'transparent', color: '#FFFFFF', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.35)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#5BC8D6'; e.currentTarget.style.color = '#5BC8D6' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.color = '#FFFFFF' }}
          >
            Meet the speakers
          </Link>
        </div>
      </div>
    </section>
  )
}
