import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Calendar, Clock, MapPin, Car, Check, Loader2 } from 'lucide-react'
import PageMeta from '../components/PageMeta'
import { submitEventRsvp } from '../lib/soccerexApi'
import { MIAMI_2026, MIAMI_2026_RSVP } from '../lib/routes'

/*
 * The welcome night invitation and its reply form. Reached from an email to VIP
 * guests, so it answers the four things an invitation has to answer before it
 * asks for anything: what, when, where, and how to get there.
 *
 * Name and email are all anyone has to give. Company and job title help the team
 * work the room, and a guest who skips them is on the list all the same.
 */

const EVENT_SLUG = 'soccerex-miami-2026'
const HERO = '/events/miami/2026/sections/miami-night.jpg'

const DETAILS = [
  { icon: Calendar, label: 'Date', value: 'Wednesday, September 23, 2026' },
  { icon: Clock, label: 'Time', value: '7:00 PM to 10:00 PM' },
  { icon: MapPin, label: 'Where', value: 'Savoy Hotel and Beach Club, Miami Beach' },
  { icon: Car, label: 'Getting there', value: 'Parking at the hotel is limited. A ride share is the easier arrival.' },
]

const NAVY = '#0D1B2A'

function Field({ label, value, onChange, type = 'text', required = false, placeholder, disabled, autoComplete }) {
  return (
    <label style={{ display: 'block', marginBottom: 16 }}>
      <span className="font-mono uppercase" style={{ display: 'block', fontSize: 11, letterSpacing: '0.14em', color: NAVY, fontWeight: 700, marginBottom: 6 }}>
        {label}{required ? <span style={{ color: '#E91E63' }}> *</span> : <span style={{ color: '#8b98a5', fontWeight: 500, letterSpacing: '0.06em' }}> (optional)</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        style={{
          width: '100%', padding: '13px 14px', fontSize: '1rem',
          background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.16)', borderRadius: 8,
          color: NAVY, outline: 'none',
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = '#007C91'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,124,145,0.12)' }}
        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(13,27,42,0.16)'; e.currentTarget.style.boxShadow = 'none' }}
      />
    </label>
  )
}

export default function MiamiWelcomeNight() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [position, setPosition] = useState('')
  const [website, setWebsite] = useState('') // honeypot, hidden from people
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (busy) return
    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanName || !cleanEmail) {
      setError('Please give us a name and an email so we can put you on the list.')

      return
    }

    setBusy(true); setError('')
    try {
      await submitEventRsvp(EVENT_SLUG, {
        name: cleanName,
        email: cleanEmail,
        company: company.trim() || undefined,
        position: position.trim() || undefined,
        website: website || undefined,
      })
      setDone({ name: cleanName, email: cleanEmail })
    } catch {
      setError('We could not save that just now. Try again in a moment, or reply to the email that brought you here.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="event-page theme-miami" style={{ background: '#FFF8F4', minHeight: '100vh' }}>
      <PageMeta
        title="Soccerex Miami Welcome Night | September 23 at the Savoy"
        description="The night before Soccerex Miami 2026 opens: drinks on the sand at the Savoy Hotel and Beach Club, Miami Beach, from 7:00 PM. Places are limited, so please reply."
        path={MIAMI_2026_RSVP}
        noindex
      />

      {/* ─── INVITATION ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: NAVY }}>
        <img src={HERO} alt="" aria-hidden
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', opacity: 0.45 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,27,42,0.72) 0%, rgba(13,27,42,0.6) 40%, rgba(13,27,42,0.94) 100%)' }} />

        <div className="relative z-10" style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(70px,10vw,110px) clamp(24px,5vw,72px) clamp(48px,7vw,80px)' }}>
          <Link to={MIAMI_2026} className="inline-flex items-center gap-2 font-mono uppercase" style={{ color: 'rgba(255,255,255,0.88)', fontSize: 11, letterSpacing: '0.2em', textDecoration: 'none', marginBottom: 28 }}>
            <ArrowLeft size={14} /> Soccerex Miami 2026
          </Link>

          <h1 className="miami-headline" style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', color: '#FFFFFF', lineHeight: 1.08, maxWidth: 900, textWrap: 'balance' }}>
            Start Miami on the Sand,<br />
            <span className="miami-text-gradient">the Night Before It All Begins</span>
          </h1>

          <p className="miami-body" style={{ fontSize: 'clamp(1rem, 1.6vw, 1.15rem)', color: 'rgba(255,255,255,0.86)', maxWidth: 680, lineHeight: 1.65, marginTop: 22 }}>
            You are invited to the Soccerex Miami welcome night at the Savoy Hotel and Beach Club.
            An evening with the people you came to meet, before a single session starts.
          </p>
        </div>
      </section>

      {/* ─── THE DETAILS AND THE REPLY ───────────────────────────────────── */}
      <section style={{ padding: 'clamp(48px,7vw,84px) clamp(24px,5vw,72px) clamp(64px,9vw,110px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 'clamp(28px,4vw,56px)', gridTemplateColumns: 'minmax(0,1fr)' }} className="rsvp-grid">
          <div>
            <dl style={{ display: 'grid', gap: 18, margin: 0 }}>
              {DETAILS.map((detail) => {
                const Icon = detail.icon
                const { label, value } = detail

                return (
                <div key={label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ width: 38, height: 38, flexShrink: 0, background: 'rgba(0,124,145,0.09)', border: '1px solid rgba(0,124,145,0.22)', display: 'grid', placeItems: 'center', borderRadius: 8 }}>
                    <Icon size={17} style={{ color: '#007C91' }} />
                  </span>
                  <span>
                    <dt className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', color: '#607186', marginBottom: 3 }}>{label}</dt>
                    <dd className="miami-body" style={{ fontSize: '1rem', color: NAVY, margin: 0, lineHeight: 1.5 }}>{value}</dd>
                  </span>
                </div>
                )
              })}
            </dl>

            <p className="miami-body" style={{ fontSize: '1rem', color: '#3a4a5a', lineHeight: 1.65, marginTop: 28, maxWidth: 520 }}>
              The beach club holds a set number of people, and places are confirmed in the order
              replies come in. Let us know you are coming and we will hold yours.
            </p>
          </div>

          {/* The reply */}
          <div style={{ background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.10)', borderRadius: 14, padding: 'clamp(24px,3.5vw,36px)', boxShadow: '0 24px 60px -30px rgba(13,27,42,0.35)' }}>
            {done ? (
              <div>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#d9f2e4', color: '#166534', display: 'grid', placeItems: 'center', marginBottom: 18 }}>
                  <Check size={23} />
                </div>
                <h2 className="miami-headline" style={{ fontSize: '1.5rem', color: NAVY, marginBottom: 10 }}>
                  You are on the list, {done.name.split(' ')[0]}
                </h2>
                <p className="miami-body" style={{ fontSize: '0.98rem', color: '#3a4a5a', lineHeight: 1.6 }}>
                  We have your reply at <span style={{ color: NAVY, fontWeight: 600 }}>{done.email}</span>.
                  It is the Savoy Hotel and Beach Club on Wednesday, September 23, from 7:00 PM.
                  Bring a colleague's name to the door and we will do what we can.
                </p>
                <Link to={MIAMI_2026} className="inline-flex items-center gap-2 font-body font-semibold uppercase" style={{ marginTop: 22, fontSize: 12, letterSpacing: '0.14em', color: '#007C91', textDecoration: 'none' }}>
                  See what else is on <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h2 className="miami-headline" style={{ fontSize: '1.4rem', color: NAVY, marginBottom: 6 }}>Reply to the invitation</h2>
                <p className="miami-body" style={{ fontSize: '0.92rem', color: '#607186', marginBottom: 22, lineHeight: 1.55 }}>
                  A name and an email is all we need.
                </p>

                <Field label="Your name" value={name} onChange={setName} required placeholder="Jane Doe" disabled={busy} autoComplete="name" />
                <Field label="Email" value={email} onChange={setEmail} type="email" required placeholder="you@company.com" disabled={busy} autoComplete="email" />
                <Field label="Company" value={company} onChange={setCompany} placeholder="Where you work" disabled={busy} autoComplete="organization" />
                <Field label="Position" value={position} onChange={setPosition} placeholder="What you do there" disabled={busy} autoComplete="organization-title" />

                {/* Left empty by every person who ever sees this page. */}
                <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off"
                  aria-hidden style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />

                {error && (
                  <p className="miami-body" style={{ fontSize: '0.9rem', color: '#b3261e', marginBottom: 14, lineHeight: 1.5 }}>{error}</p>
                )}

                <button type="submit" disabled={busy}
                  className="w-full inline-flex items-center justify-center gap-2 font-body font-semibold uppercase"
                  style={{ background: '#E91E63', color: '#FFFFFF', padding: '15px 22px', fontSize: 13, letterSpacing: '0.15em', border: 'none', borderRadius: 6, cursor: busy ? 'wait' : 'pointer', marginTop: 6 }}
                >
                  {busy ? <><Loader2 size={15} className="animate-spin" /> Saving your place</> : <>Save my place <ArrowRight size={15} /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @media (min-width: 900px) {
          .rsvp-grid { grid-template-columns: minmax(0, 1fr) minmax(0, 460px); align-items: start; }
        }
      `}</style>
    </div>
  )
}
