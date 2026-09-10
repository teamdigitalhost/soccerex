import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Calendar, ArrowRight, Plane, Train } from 'lucide-react'
import { MIAMI_2026, MIAMI_2026_PRESS_RELEASE, ACCOMMODATIONS, eventSpeakers } from '../lib/routes'
import PageMeta from '../components/PageMeta'
import SelectedSpeakers from '../components/SelectedSpeakers'
import { getAgenda } from '../lib/soccerexApi'

/*
 * Miami 2026, second version. Unlisted: linked from nowhere, kept out of the
 * sitemap, and served with noindex so it can be shared for review without
 * being found. The live page at /miami-2026 is untouched.
 *
 * The argument the page makes, in order: the venue is enormous, the room is
 * full of people you would want to meet, the programme is already written, and
 * the World Cup happened here ten weeks ago. Everything on it is public and
 * verifiable today.
 *
 * Speakers come from the API rather than a hardcoded list, because the roster is
 * still moving: four names were announced on LinkedIn after this page was
 * planned. SelectedSpeakers already handles ranking, skipping anyone without a
 * headshot, and showing the real total on the button.
 */

const V2 = '/events/miami/2026/v2'
const SLUG = 'soccerex-miami-2026'

const NAVY = '#0b1f3a'
const PINK = '#e6236e'
const CYAN = '#22c9d6'
const SAND = '#f6f4f0'

// Counted, never claimed. Each of these is verifiable from a public source.
const PROOF = [
  { n: '26,700', l: 'Seat stadium' },
  { n: '131', l: 'Acre district' },
  { n: '70+', l: 'Speakers' },
  { n: '32', l: 'Sessions' },
  { n: '41', l: 'Concacaf members' },
  { n: '30', l: 'Years of Soccerex' },
]

const DISTRICT = [
  ['131 acres', 'The Miami Freedom Park site'],
  ['500,000 sq ft', 'Retail, hospitality and entertainment'],
  ['1,000,000 sq ft', 'Office, at full build'],
  ['58 acres', 'Jorge Mas Canosa Park, with a one mile loop'],
  ['26,700', 'Seats, opened April 4, 2026'],
  ['Largest in MLS', 'The Inter Miami team store'],
]

// Announced publicly. Concacaf leads because it is a strategic partnership with
// programming attached, not a logo placement.
const PARTNERS = [
  { name: 'Concacaf', file: 'concacaf.svg', note: 'Official partner. 41 member associations, headquartered in Miami. Flagship exhibition presence and its own session.' },
  { name: 'GMCVB', file: 'gmcvb-corp-logo-blue.png', note: 'Official partner. Greater Miami and Miami Beach, connecting the industry to the host destination.' },
  { name: 'Roc Nation Sports', file: 'roc-nation-wordmark-black.png', note: 'Talent representation, commercial opportunities and athlete brands. Programmed session on day one.' },
  { name: 'FC Barcelona', file: 'fc-barcelona.svg', note: 'Founded 1899. Session on day two.' },
]

const ACTIVATIONS = [
  ['Freestyle show', 'Day one. The most watchable thing on the floor.'],
  ['HerSoccerex', "The commercial power of women's football, and the road to Brazil 2027."],
  ['Football with Purpose', 'Two sessions across both days on inclusion, community and impact.'],
  ['Deal Network', 'Curated introductions to counterparties who can actually transact.'],
]

function Stat({ n, l }) {
  return (
    <div style={{ textAlign: 'center', padding: '0 clamp(8px,2vw,20px)' }}>
      <div style={{ fontSize: 'clamp(1.5rem,3.4vw,2.4rem)', fontWeight: 800, color: NAVY, lineHeight: 1.05, fontVariantNumeric: 'tabular-nums' }}>{n}</div>
      <div style={{ fontSize: 'clamp(0.6rem,1vw,0.72rem)', letterSpacing: '0.13em', textTransform: 'uppercase', color: '#6b7480', marginTop: 6 }}>{l}</div>
    </div>
  )
}

function Section({ children, bg = '#fff', pad = 'clamp(56px,7vw,96px)' }) {
  return (
    <section style={{ background: bg, padding: `${pad} clamp(20px,5vw,64px)` }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>{children}</div>
    </section>
  )
}

function H2({ children, light = false }) {
  return (
    <h2 style={{ fontSize: 'clamp(1.55rem,3.2vw,2.5rem)', fontWeight: 800, lineHeight: 1.12, color: light ? '#fff' : NAVY, margin: '0 0 clamp(14px,2vw,22px)', textWrap: 'balance' }}>{children}</h2>
  )
}

function Lede({ children, light = false }) {
  return (
    <p style={{ fontSize: 'clamp(1rem,1.5vw,1.15rem)', lineHeight: 1.65, color: light ? 'rgba(255,255,255,0.82)' : '#3d4a58', maxWidth: '62ch', margin: '0 0 clamp(20px,3vw,34px)' }}>{children}</p>
  )
}

export default function Miami2026V2() {
  const [agenda, setAgenda] = useState(null)

  useEffect(() => {
    let alive = true
    getAgenda(SLUG)
      .then((r) => { if (alive) setAgenda(r) })
      .catch(() => { if (alive) setAgenda([]) })
    return () => { alive = false }
  }, [])

  // The API shape varies by endpoint version, so normalize defensively rather
  // than letting a missing key blank the section.
  const sessions = Array.isArray(agenda) ? agenda : (agenda?.data || agenda?.sessions || [])
  const byDay = sessions.reduce((acc, s) => {
    const when = s.starts_at || s.startsAt || ''
    const day = String(when).slice(0, 10)
    if (!day) return acc
    ;(acc[day] = acc[day] || []).push(s)
    return acc
  }, {})
  const days = Object.keys(byDay).sort()

  return (
    <>
      <PageMeta
        title="Soccerex Miami 2026 | Nu Stadium, 23-25 September"
        description="The global football industry reconvenes at Nu Stadium, Miami, 23 to 25 September 2026."
        noindex
      />

      {/* HERO. The district render carries the scale argument before a word is read. */}
      <section style={{ position: 'relative', minHeight: 'clamp(520px,78vh,760px)', display: 'flex', alignItems: 'flex-end', background: NAVY, overflow: 'hidden' }}>
        <img
          src={`${V2}/venue/mfp-aerial-render.jpg`}
          alt="Nu Stadium and the Miami Freedom Park district, with the Miami skyline behind"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.62 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(11,31,58,0.30) 0%, rgba(11,31,58,0.62) 55%, rgba(11,31,58,0.94) 100%)` }} />
        <div style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', padding: 'clamp(28px,5vw,64px) clamp(20px,5vw,64px)', width: '100%' }}>
          <div style={{ display: 'flex', gap: 'clamp(10px,2vw,20px)', flexWrap: 'wrap', marginBottom: 18, fontSize: 'clamp(0.72rem,1.1vw,0.84rem)', letterSpacing: '0.1em', textTransform: 'uppercase', color: CYAN, fontWeight: 700 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><MapPin size={14} /> Nu Stadium, Miami</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><Calendar size={14} /> September 23 to 25, 2026</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.1rem,6vw,4.4rem)', lineHeight: 1.02, fontWeight: 900, color: '#fff', margin: '0 0 16px', maxWidth: '17ch', textWrap: 'balance' }}>
            The world came for the World Cup.
            <span style={{ color: PINK }}> The industry stays for Soccerex.</span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem,1.7vw,1.25rem)', lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', maxWidth: '54ch', margin: '0 0 28px' }}>
            Three days inside a stadium that opened this year, in the city that hosted the tournament, with the people who ran it.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="https://soccerexmiami2026.eventify.io/t2/tickets/" target="_blank" rel="noopener noreferrer"
              style={{ background: PINK, color: '#fff', padding: '15px 30px', borderRadius: 4, fontWeight: 800, textDecoration: 'none', fontSize: '0.95rem', letterSpacing: '0.04em' }}>
              Register to attend
            </a>
            <Link to={eventSpeakers(SLUG)}
              style={{ border: '1.5px solid rgba(255,255,255,0.55)', color: '#fff', padding: '15px 30px', borderRadius: 4, fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
              See who is speaking
            </Link>
          </div>
        </div>
      </section>

      {/* PROOF STRIP */}
      <div style={{ background: SAND, borderBottom: '1px solid #e6e2db', padding: 'clamp(22px,3vw,34px) clamp(16px,4vw,48px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 'clamp(12px,2vw,20px)' }}>
          {PROOF.map((p) => <Stat key={p.l} {...p} />)}
        </div>
      </div>

      {/* SPEAKERS. Reused component: ranked from the API, real total on the button. */}
      <SelectedSpeakers slug={SLUG} limit={12} />

      {/* THE WORLD CUP BRIDGE */}
      <Section bg={NAVY}>
        <H2 light>The tournament happened here. The consequences have not been worked out yet.</H2>
        <Lede light>
          The Chief Tournament Officers who delivered the World Cup in the United States, Canada
          and Mexico are all speaking, alongside the executives who ran Qatar 2022. No other
          gathering this year puts that group in one room, ten weeks after the final.
        </Lede>
      </Section>

      {/* THE VENUE AT SCALE */}
      <Section>
        <H2>A stadium inside a 131 acre district</H2>
        <Lede>
          Nu Stadium opened on April 4, 2026 and is the home of Inter Miami CF. It sits inside
          Miami Freedom Park, the largest active real estate development in the city.
        </Lede>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 'clamp(14px,2vw,22px)', marginBottom: 'clamp(24px,3vw,36px)' }}>
          {DISTRICT.map(([n, l]) => (
            <div key={l} style={{ borderLeft: `3px solid ${CYAN}`, paddingLeft: 16 }}>
              <div style={{ fontSize: 'clamp(1.15rem,2vw,1.5rem)', fontWeight: 800, color: NAVY, fontVariantNumeric: 'tabular-nums' }}>{n}</div>
              <div style={{ fontSize: '0.88rem', color: '#5b6672', lineHeight: 1.5, marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 12 }}>
          {['mfp-district-view.jpg', 'nu-stadium-grand-staircase.jpg', 'nu-stadium-entrance.jpg'].map((f) => (
            <img key={f} src={`${V2}/venue/${f}`} alt="" loading="lazy"
              style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 6, display: 'block' }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 'clamp(16px,3vw,40px)', flexWrap: 'wrap', marginTop: 'clamp(22px,3vw,32px)', color: '#3d4a58', fontSize: '0.95rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}><Plane size={17} color={PINK} /> Adjacent to Miami International Airport</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}><Train size={17} color={PINK} /> Steps from the Miami Intermodal Center</span>
        </div>
      </Section>

      {/* PARTNERS */}
      <Section bg={SAND}>
        <H2>Who is behind it</H2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 'clamp(14px,2vw,20px)' }}>
          {PARTNERS.map((p) => (
            <div key={p.name} style={{ background: '#fff', border: '1px solid #e6e2db', borderRadius: 8, padding: 'clamp(18px,2.4vw,26px)' }}>
              <div style={{ height: 46, display: 'flex', alignItems: 'center', marginBottom: 14 }}>
                <img src={`${V2}/partners/${p.file}`} alt={p.name} loading="lazy"
                  style={{ maxHeight: 42, maxWidth: 168, objectFit: 'contain' }} />
              </div>
              <div style={{ fontWeight: 800, color: NAVY, marginBottom: 6, fontSize: '1rem' }}>{p.name}</div>
              <p style={{ fontSize: '0.86rem', lineHeight: 1.55, color: '#5b6672', margin: 0 }}>{p.note}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* PROGRAMME, straight from the schedule API.
          Renders only once sessions are published: the public agenda endpoint hides
          drafts, and all 32 Miami sessions are still draft. Nothing to fix here, the
          section appears by itself the day the events desk publishes them. */}
      {days.length > 0 && (
        <Section>
          <H2>{sessions.length} sessions, already scheduled</H2>
          <Lede>The programme is written. These are the conversations, by day.</Lede>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit,minmax(300px,1fr))`, gap: 'clamp(18px,3vw,32px)' }}>
            {days.map((d) => (
              <div key={d}>
                <div style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: PINK, fontWeight: 800, marginBottom: 12 }}>
                  {new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {byDay[d]
                    .slice()
                    .sort((a, b) => String(a.starts_at || '').localeCompare(String(b.starts_at || '')))
                    .map((s, i) => (
                      <li key={i} style={{ padding: '10px 0', borderBottom: '1px solid #eceae5', color: NAVY, fontSize: '0.95rem', lineHeight: 1.45 }}>
                        {s.title}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ACTIVATIONS */}
      <Section bg={NAVY}>
        <H2 light>Not only panels</H2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 'clamp(16px,2.4vw,26px)' }}>
          {ACTIVATIONS.map(([t, d]) => (
            <div key={t} style={{ borderTop: `2px solid ${CYAN}`, paddingTop: 14 }}>
              <div style={{ fontWeight: 800, color: '#fff', marginBottom: 7, fontSize: '1.02rem' }}>{t}</div>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.55, color: 'rgba(255,255,255,0.72)', margin: 0 }}>{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CLOSE */}
      <Section bg={SAND}>
        <div style={{ textAlign: 'center', maxWidth: '58ch', margin: '0 auto' }}>
          <H2>September 23 to 25, 2026</H2>
          <Lede>
            <span style={{ display: 'block', textAlign: 'center', margin: '0 auto' }}>
              Nu Stadium, Miami Freedom Park. Three days with the people who decide what
              happens next in the game.
            </span>
          </Lede>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://soccerexmiami2026.eventify.io/t2/tickets/" target="_blank" rel="noopener noreferrer"
              style={{ background: PINK, color: '#fff', padding: '15px 32px', borderRadius: 4, fontWeight: 800, textDecoration: 'none' }}>
              Register to attend
            </a>
            <Link to={ACCOMMODATIONS} style={{ border: `1.5px solid ${NAVY}`, color: NAVY, padding: '15px 32px', borderRadius: 4, fontWeight: 700, textDecoration: 'none' }}>
              Where to stay
            </Link>
          </div>
          <p style={{ marginTop: 26, fontSize: '0.82rem', color: '#7a838d' }}>
            <Link to={MIAMI_2026} style={{ color: '#7a838d' }}>Current page</Link>
            {'  ·  '}
            <Link to={MIAMI_2026_PRESS_RELEASE} style={{ color: '#7a838d' }}>Press release</Link>
          </p>
        </div>
      </Section>
    </>
  )
}
