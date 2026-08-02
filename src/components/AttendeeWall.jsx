import { useState, useEffect } from 'react'
import { getAttendeeWall } from '../lib/soccerexApi'
import LogoMarquee from './LogoMarquee'

/**
 * Live confirmed-attendee wall.
 * Fetches count + opted-in org logos from the backend on mount.
 * Falls back to staticCount / staticLogos if the API is unavailable.
 */
export default function AttendeeWall({ eventSlug, staticCount, staticLogos = [], roleLabel }) {
  const [count, setCount] = useState(staticCount)
  const [logos, setLogos] = useState(staticLogos)

  useEffect(() => {
    let cancelled = false
    getAttendeeWall(eventSlug).then((data) => {
      if (cancelled) return
      if (data && typeof data.confirmed_count === 'number') {
        setCount(data.confirmed_count)
      }
      if (data && Array.isArray(data.opted_in_orgs) && data.opted_in_orgs.length > 0) {
        const apiLogos = data.opted_in_orgs.map((org) => ({ src: org.logo_url, alt: org.name }))
        setLogos((prev) => {
          // Merge: API opt-ins first, then any static logos not already covered.
          const apiNames = new Set(apiLogos.map((l) => l.alt.toLowerCase()))
          const remaining = prev.filter((l) => !apiNames.has(l.alt.toLowerCase()))
          return [...apiLogos, ...remaining]
        })
      }
    }).catch(() => { /* silent fallback to static values */ })
    return () => { cancelled = true }
  }, [eventSlug])

  return (
    <section style={{ background: '#FAFBFC', padding: 'clamp(72px,9vw,120px) clamp(24px,5vw,80px)' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto', textAlign: 'center' }}>
        <p className="miami-kicker miami-kicker--pink">Already confirmed</p>
        <div className="fade-up" style={{ marginBottom: 'clamp(20px,3vw,32px)' }}>
          <p className="miami-headline" style={{ fontSize: 'clamp(4rem, 9vw, 7.5rem)', color: '#0D1B2A', lineHeight: 1, marginBottom: 8 }}>
            {count}
          </p>
          <p className="miami-subhead" style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1rem)', color: '#3a4a5a', letterSpacing: '0.18em' }}>
            CONFIRMED {roleLabel} FOR SOCCEREX MIAMI 2026
          </p>
        </div>
        <p className="miami-body fade-up mx-auto mb-12" style={{ fontSize: '1rem', color: '#3a4a5a', maxWidth: 580, lineHeight: 1.6 }}>
          FIFA, LaLiga, UEFA, MLS, CONCACAF, CONMEBOL, the top clubs, and {Math.max(0, count - 6)} more leagues, federations, and rightsholders are already registered. This is the network you arrive into.
        </p>
        {logos.length > 0 && (
          <LogoMarquee logos={logos} direction="left" speed={22} invert={false} height={44} />
        )}
      </div>
    </section>
  )
}
