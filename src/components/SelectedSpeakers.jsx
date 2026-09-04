import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getEventSpeakers } from '../lib/soccerexApi'
import { eventSpeakers, eventSpeaker } from '../lib/routes'

/*
 * A short, ranked preview of an event's speakers, with a way through to the
 * full list.
 *
 * Order comes from the API, which returns the events desk's running order
 * (event_roles.display_order), so the headline names lead here exactly as they
 * do on the speakers page. Anyone without a headshot is skipped: this block is
 * a showcase, and an initials tile next to nine portraits reads as an omission.
 * The count on the button is the REAL total, not the number shown.
 *
 * Renders nothing at all until it has speakers, so a slow or failed API leaves
 * the page as it was rather than showing an empty shell.
 */
export default function SelectedSpeakers({ slug, limit = 8 }) {
  const [speakers, setSpeakers] = useState(null)

  useEffect(() => {
    let alive = true
    getEventSpeakers(slug)
      .then((rows) => { if (alive) setSpeakers(Array.isArray(rows) ? rows : []) })
      .catch(() => { if (alive) setSpeakers([]) })
    return () => { alive = false }
  }, [slug])

  const withPhotos = (speakers || []).filter((s) => s.photo_url)
  const shown = withPhotos.slice(0, limit)

  if (shown.length === 0) return null

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0D1B2A 0%, #102538 100%)',
        padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)',
      }}
    >
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <h2 className="miami-headline" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#FFFFFF', lineHeight: 1.1 }}>
            The voices shaping <span className="miami-text-gradient">Miami 2026</span>
          </h2>
          <Link
            to={eventSpeakers(slug)}
            className="inline-flex items-center gap-2 shrink-0"
            style={{
              textDecoration: 'none', color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.28)', padding: '12px 22px',
              fontFamily: "'Oswald', 'Space Grotesk', sans-serif", fontWeight: 600,
              letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 13,
              transition: 'background 0.25s, border-color 0.25s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.55)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)' }}
          >
            All {speakers.length} speakers <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {shown.map((s) => (
            <Link
              key={s.slug}
              to={eventSpeaker(slug, s.slug)}
              className="selected-speaker"
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <div style={{
                position: 'relative', aspectRatio: '4/5', overflow: 'hidden',
                background: '#0a1522', marginBottom: 12,
              }}>
                <img
                  src={s.photo_url}
                  alt={s.display_name}
                  loading="lazy"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <p className="miami-headline" style={{ fontSize: '1rem', color: '#FFFFFF', letterSpacing: '0.01em', lineHeight: 1.2, marginBottom: 4 }}>
                {s.display_name}
              </p>
              {s.headline && (
                <p className="miami-body" style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.62)', lineHeight: 1.45 }}>
                  {s.headline}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .selected-speaker img { transition: transform 0.5s ease; }
        .selected-speaker:hover img { transform: scale(1.05); }
      `}</style>
    </section>
  )
}
