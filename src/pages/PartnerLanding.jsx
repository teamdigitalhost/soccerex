import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2, Check, MapPin, Calendar, ArrowRight, ShieldCheck } from 'lucide-react'
import PageMeta from '../components/PageMeta'
import { getReferralPartner, captureReferral } from '../lib/soccerexApi'
import sxLogo from '../assets/soccerex---logo-landscape-blue.svg'
import sxLogoWhite from '../assets/soccerex---logo-landscape-white.svg'

/*
 * Co-branded referral capture page: /partners/{slug}.
 *
 * One component serves every partner. Brand (logo, two colors) and offer come
 * from the referral_partners row; everything below the fold is rendered from
 * the LINKED EVENT, so these pages follow the event calendar without anyone
 * editing them. Adding a partner is a database row, not a deploy.
 *
 * Laid out for conversion: the form sits above the fold on desktop and
 * immediately under a short pitch on mobile, the page carries no site
 * navigation to leak clicks, and there is exactly one action on it.
 */

const NAVY = '#0D1B2A'
const INK = '#1a2a3a'

const FIELDS = [
  { name: 'name', label: 'Full name', type: 'text', autoComplete: 'name', required: true },
  { name: 'email', label: 'Work email', type: 'email', autoComplete: 'email', required: true },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel', required: false },
  { name: 'company', label: 'Company', type: 'text', autoComplete: 'organization', required: true },
  { name: 'position', label: 'Position', type: 'text', autoComplete: 'organization-title', required: true },
  { name: 'referrer', label: 'Referred by', type: 'text', autoComplete: 'off', required: false, hint: 'Who told you about this' },
]

const EMPTY = { name: '', email: '', phone: '', company: '', position: '', referrer: '' }

/**
 * Text color that stays legible on an arbitrary partner color.
 *
 * Partner palettes are supplied per row and some of the best accents are light:
 * Women in Soccer's magenta and The Players Network's sand both fail against
 * white but read cleanly with near-black, which is also how both brands use
 * them. Picking per color beats hardcoding white and beats asking every future
 * partner to supply a foreground.
 */
function readableOn(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec((hex || '').trim())
  if (!m) return '#ffffff'
  const int = parseInt(m[1], 16)
  const channel = (c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  const L = 0.2126 * channel((int >> 16) & 255)
    + 0.7152 * channel((int >> 8) & 255)
    + 0.0722 * channel(int & 255)
  // Contrast against white vs against near-black; take the better one.
  return (1.05 / (L + 0.05)) >= ((L + 0.05) / 0.05) ? '#ffffff' : '#111111'
}

/** "September 23-25, 2026" from two ISO dates, collapsing a same-month range. */
function formatRange(startsOn, endsOn) {
  if (!startsOn) return null
  const start = new Date(`${startsOn}T00:00:00`)
  const end = endsOn ? new Date(`${endsOn}T00:00:00`) : null
  const month = start.toLocaleDateString('en-US', { month: 'long' })
  const year = start.getFullYear()
  if (!end || start.getTime() === end.getTime()) {
    return `${month} ${start.getDate()}, ${year}`
  }
  if (start.getMonth() === end.getMonth()) {
    return `${month} ${start.getDate()}-${end.getDate()}, ${year}`
  }
  const endMonth = end.toLocaleDateString('en-US', { month: 'long' })
  return `${month} ${start.getDate()} to ${endMonth} ${end.getDate()}, ${year}`
}

export default function PartnerLanding() {
  const { slug } = useParams()
  const [partner, setPartner] = useState(null)
  const [state, setState] = useState('loading') // loading | ready | missing
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(null)
  const [failed, setFailed] = useState(null)
  const formRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    let alive = true
    getReferralPartner(slug)
      .then((data) => { if (alive) { setPartner(data); setState('ready') } })
      .catch(() => { if (alive) setState('missing') })
    return () => { alive = false }
  }, [slug])

  const primary = partner?.primary_color || NAVY
  const accent = partner?.accent_color || '#E91E63'
  const onPrimary = readableOn(primary)
  const onAccent = readableOn(accent)
  const event = partner?.event || null
  const dates = useMemo(() => formatRange(event?.starts_on, event?.ends_on), [event])

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: null } : prev))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (submitting) return

    const next = {}
    FIELDS.filter((f) => f.required).forEach((f) => {
      if (!form[f.name].trim()) next[f.name] = 'Required'
    })
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Enter a valid email'
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }

    setSubmitting(true)
    setFailed(null)
    try {
      const result = await captureReferral(slug, {
        ...form,
        source_url: window.location.href,
      })
      setDone(result)
      // Brief confirmation so the code is seen, then straight to checkout. The
      // button below is the fallback if the timer is cut short by a slow tab.
      window.setTimeout(() => { window.location.href = result.redirect_url }, 1400)
    } catch (err) {
      setFailed(err?.message || 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  if (state === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#fff' }}>
        <Loader2 size={26} className="animate-spin" style={{ color: NAVY }} />
      </div>
    )
  }

  if (state === 'missing') {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#fff', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '1.6rem', color: NAVY, marginBottom: 10 }}>
            This partner page is not available
          </h1>
          <p style={{ fontSize: 14, color: '#607186', lineHeight: 1.6, marginBottom: 20 }}>
            The link may have expired. Tickets are always available on the Soccerex site.
          </p>
          <a href="https://soccerex.com/miami-2026" style={{ color: accent, fontWeight: 600, fontSize: 14 }}>
            Go to Soccerex Miami 2026
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <PageMeta
        title={`${partner.name} at ${event?.name || 'Soccerex'} | Soccerex`}
        description={partner.subheadline}
        path={`/partners/${slug}`}
      />

      {/* ABOVE THE FOLD: pitch on the left, the form on the right. */}
      <section style={{ background: primary, color: onPrimary, padding: 'clamp(28px,4vw,44px) clamp(20px,5vw,64px) clamp(48px,7vw,80px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>

          {/* Co-brand lockup. Both marks sit at equal weight: this is a
              partnership, not a sponsorship. */}
          <div className="flex items-center" style={{ gap: 'clamp(11px,3vw,18px)', marginBottom: 'clamp(28px,4vw,44px)' }}>
            <img src={onPrimary === '#ffffff' ? sxLogoWhite : sxLogo} alt="Soccerex" style={{ height: 'clamp(21px,5.4vw,30px)', width: 'auto' }} />
            <span aria-hidden="true" style={{ width: 1, height: 'clamp(24px,6vw,32px)', flexShrink: 0, background: onPrimary, opacity: 0.3 }} />
            {partner.logo_url && (
              <img
                src={partner.logo_url}
                alt={partner.name}
                style={{ height: 'clamp(33px,8.5vw,46px)', width: 'auto', flexShrink: 0, borderRadius: 999 }}
              />
            )}
          </div>

          <div className="partner-hero-grid">
            {/* Pitch */}
            <div>
              <h1 style={{
                fontFamily: "'Oswald', 'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(2rem, 4.4vw, 3.3rem)',
                lineHeight: 1.04,
                letterSpacing: '0.005em',
                marginBottom: 18,
              }}>
                {partner.headline}
              </h1>

              <p style={{ fontSize: 'clamp(1rem, 1.4vw, 1.15rem)', lineHeight: 1.55, color: onPrimary, opacity: 0.88, maxWidth: 560, marginBottom: 26 }}>
                {partner.subheadline}
              </p>

              {(dates || event?.venue?.name) && (
                <div className="flex flex-wrap" style={{ gap: '10px 22px', marginBottom: 26, fontSize: 14, color: onPrimary, opacity: 0.85 }}>
                  {dates && (
                    <span className="inline-flex items-center" style={{ gap: 8 }}>
                      <Calendar size={15} style={{ color: accent }} /> {dates}
                    </span>
                  )}
                  {event?.venue?.name && (
                    <span className="inline-flex items-center" style={{ gap: 8 }}>
                      <MapPin size={15} style={{ color: accent }} />
                      {event.venue.name}{event.venue.city ? `, ${event.venue.city}` : ''}
                    </span>
                  )}
                </div>
              )}

              {partner.offer_label && (
                <div className="inline-flex items-center" style={{
                  gap: 10, padding: '10px 16px', borderRadius: 6,
                  background: accent, color: onAccent,
                  fontFamily: "'Oswald', sans-serif", fontWeight: 600,
                  letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: 13,
                }}>
                  <Check size={16} /> {partner.offer_label}
                </div>
              )}
            </div>

            {/* Form: the only action on the page. */}
            <div ref={formRef} style={{ scrollMarginTop: 24 }}>
              <div style={{
                background: '#fff', borderRadius: 14, padding: 'clamp(22px,3vw,32px)',
                boxShadow: '0 30px 70px -30px rgba(0,0,0,0.55)',
              }}>
                {done ? (
                  <div style={{ textAlign: 'center', padding: '18px 0' }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 999, background: '#10b981',
                      display: 'grid', placeItems: 'center', margin: '0 auto 16px',
                    }}>
                      <Check size={26} color="#fff" />
                    </div>
                    <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '1.35rem', color: NAVY, marginBottom: 8 }}>
                      You are on the list
                    </h2>
                    <p style={{ fontSize: 14, color: '#607186', lineHeight: 1.6, marginBottom: 18 }}>
                      Taking you to checkout with your {partner.name} rate applied.
                    </p>
                    {done.promo_code && (
                      <p style={{ fontSize: 13, color: INK, marginBottom: 18 }}>
                        Your code:{' '}
                        <strong style={{ fontFamily: "'IBM Plex Mono', monospace", background: '#f1f0ee', padding: '4px 9px', borderRadius: 5 }}>
                          {done.promo_code}
                        </strong>
                      </p>
                    )}
                    <a
                      href={done.redirect_url}
                      className="inline-flex items-center justify-center"
                      style={{
                        gap: 8, width: '100%', padding: '14px 20px', borderRadius: 8,
                        background: primary, color: onPrimary, textDecoration: 'none',
                        fontFamily: "'Oswald', sans-serif", fontWeight: 600,
                        letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: 14,
                      }}
                    >
                      Continue to tickets <ArrowRight size={16} />
                    </a>
                  </div>
                ) : (
                  <form onSubmit={submit} noValidate>
                    <h2 style={{
                      fontFamily: "'Oswald', 'Space Grotesk', sans-serif", fontWeight: 700,
                      fontSize: '1.4rem', color: NAVY, lineHeight: 1.2, marginBottom: 6,
                    }}>
                      Claim your rate
                    </h2>
                    <p style={{ fontSize: 13.5, color: '#607186', lineHeight: 1.5, marginBottom: 18 }}>
                      Verified as a {partner.audience_label}. Takes about a minute.
                    </p>

                    <div className="partner-form-grid">
                      {FIELDS.map((f) => (
                        <div key={f.name}>
                          <label
                            htmlFor={`pf-${f.name}`}
                            style={{
                              display: 'block', fontSize: 12, fontWeight: 600, color: INK,
                              marginBottom: 6, fontFamily: 'Montserrat, sans-serif',
                            }}
                          >
                            {f.label}
                            {!f.required && <span style={{ color: '#9aa7b4', fontWeight: 500 }}> (optional)</span>}
                          </label>
                          <input
                            id={`pf-${f.name}`}
                            name={f.name}
                            type={f.type}
                            autoComplete={f.autoComplete}
                            value={form[f.name]}
                            onChange={set(f.name)}
                            placeholder={f.hint || ''}
                            aria-invalid={errors[f.name] ? 'true' : undefined}
                            style={{
                              width: '100%', padding: '11px 13px', fontSize: 15,
                              border: `1px solid ${errors[f.name] ? '#dc2626' : '#d8dde3'}`,
                              borderRadius: 8, outline: 'none', color: INK, background: '#fff',
                              fontFamily: 'Inter, sans-serif',
                            }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = accent }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = errors[f.name] ? '#dc2626' : '#d8dde3' }}
                          />
                          {errors[f.name] && (
                            <p style={{ fontSize: 11.5, color: '#dc2626', marginTop: 5 }}>{errors[f.name]}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {failed && (
                      <p style={{ fontSize: 13, color: '#dc2626', marginTop: 14, lineHeight: 1.5 }}>{failed}</p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center"
                      style={{
                        gap: 9, width: '100%', marginTop: 20, padding: '15px 20px',
                        borderRadius: 8, border: 'none', cursor: submitting ? 'wait' : 'pointer',
                        background: accent, color: onAccent,
                        fontFamily: "'Oswald', sans-serif", fontWeight: 600,
                        letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 14.5,
                        opacity: submitting ? 0.75 : 1,
                      }}
                    >
                      {submitting
                        ? <><Loader2 size={17} className="animate-spin" /> Sending</>
                        : <>Get my discount <ArrowRight size={17} /></>}
                    </button>

                    <p className="flex items-start" style={{ gap: 7, fontSize: 11.5, color: '#8a97a4', marginTop: 14, lineHeight: 1.5 }}>
                      <ShieldCheck size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                      Your details go to Soccerex to process your registration. We do not sell your data.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BELOW THE FOLD: the event, rendered from the event record. */}
      {event && (
        <>
          <section style={{ padding: 'clamp(56px,7vw,88px) clamp(20px,5vw,64px)', background: '#fff' }}>
            <div style={{ maxWidth: 1080, margin: '0 auto' }}>
              <h2 style={{
                fontFamily: "'Oswald', 'Space Grotesk', sans-serif", fontWeight: 700,
                fontSize: 'clamp(1.5rem, 3vw, 2.3rem)', color: NAVY, lineHeight: 1.15, marginBottom: 16,
              }}>
                {event.name}
              </h2>
              {event.summary && (
                <p style={{ fontSize: 'clamp(0.98rem,1.3vw,1.1rem)', lineHeight: 1.65, color: '#3a4a5a', maxWidth: 760, marginBottom: 40 }}>
                  {event.summary}
                </p>
              )}

              <div className="partner-facts">
                {[
                  { label: 'Dates', value: dates },
                  { label: 'Venue', value: event.venue?.name },
                  { label: 'City', value: [event.venue?.city, event.venue?.country].filter(Boolean).join(', ') },
                ].filter((f) => f.value).map((f) => (
                  <div key={f.label} style={{ borderTop: `2px solid ${accent}`, paddingTop: 14 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8a97a4', marginBottom: 6, fontFamily: 'Montserrat, sans-serif' }}>
                      {f.label}
                    </p>
                    <p style={{ fontSize: 16, color: NAVY, fontWeight: 600, lineHeight: 1.35 }}>{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section style={{ padding: 'clamp(56px,7vw,88px) clamp(20px,5vw,64px)', background: '#f7f8f9' }}>
            <div style={{ maxWidth: 1080, margin: '0 auto' }}>
              <h2 style={{
                fontFamily: "'Oswald', 'Space Grotesk', sans-serif", fontWeight: 700,
                fontSize: 'clamp(1.4rem, 2.6vw, 2rem)', color: NAVY, lineHeight: 1.2, marginBottom: 32,
              }}>
                What your pass includes
              </h2>
              <div className="partner-benefits">
                {[
                  ['Three days of conference content', 'Executive programming across the business of football, from federations and clubs to media, capital and technology.'],
                  ['The Soccerex Deal Network', 'Curated introductions to decision-makers, investors and commercial partners who are actually in the room.'],
                  ['The exhibition floor', 'Meet the companies building the game, from rights and data to venues, ticketing and fan platforms.'],
                  ['Evening networking', 'The conversations that turn a conference into a deal happen after the last panel.'],
                ].map(([title, body]) => (
                  <div key={title}>
                    <h3 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: '1.05rem', color: NAVY, marginBottom: 8, lineHeight: 1.3 }}>
                      {title}
                    </h3>
                    <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#4a5a6a' }}>{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Closing CTA returns to the one action rather than adding a second. */}
          <section style={{ padding: 'clamp(48px,6vw,76px) clamp(20px,5vw,64px)', background: primary, color: onPrimary, textAlign: 'center' }}>
            <div style={{ maxWidth: 640, margin: '0 auto' }}>
              <h2 style={{
                fontFamily: "'Oswald', 'Space Grotesk', sans-serif", fontWeight: 700,
                fontSize: 'clamp(1.4rem, 2.8vw, 2.1rem)', lineHeight: 1.15, marginBottom: 14,
              }}>
                {partner.offer_label || 'Your partner rate'} is waiting
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: onPrimary, opacity: 0.85, marginBottom: 26 }}>
                Confirm your details and we will take you straight to checkout with the code applied.
              </p>
              <button
                type="button"
                onClick={() => {
                  formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  window.setTimeout(() => document.getElementById('pf-name')?.focus(), 500)
                }}
                className="inline-flex items-center justify-center"
                style={{
                  gap: 9, padding: '15px 32px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: accent, color: onAccent,
                  fontFamily: "'Oswald', sans-serif", fontWeight: 600,
                  letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 14.5,
                }}
              >
                Get my discount <ArrowRight size={17} />
              </button>
            </div>
          </section>
        </>
      )}

      <footer style={{ padding: '26px clamp(20px,5vw,64px)', background: '#fff', borderTop: '1px solid #e7eaed' }}>
        <div className="partner-footer" style={{ maxWidth: 1080, margin: '0 auto' }}>
          <img src={sxLogo} alt="Soccerex" style={{ height: 22, width: 'auto', opacity: 0.75 }} />
          <p style={{ fontSize: 12, color: '#8a97a4' }}>
            In partnership with{' '}
            {partner.website_url ? (
              <a href={partner.website_url} target="_blank" rel="noopener noreferrer" style={{ color: '#4a5a6a', textDecoration: 'underline' }}>
                {partner.name}
              </a>
            ) : partner.name}
          </p>
        </div>
      </footer>

      <style>{`
        .partner-hero-grid { display: grid; gap: clamp(28px, 4vw, 56px); grid-template-columns: 1fr; align-items: start; }
        .partner-form-grid { display: grid; gap: 13px; grid-template-columns: 1fr; }
        @media (min-width: 520px) { .partner-form-grid { grid-template-columns: 1fr 1fr; gap: 13px 14px; } }
        .partner-facts { display: grid; gap: 22px; grid-template-columns: 1fr; }
        .partner-benefits { display: grid; gap: 26px; grid-template-columns: 1fr; }
        .partner-footer { display: flex; flex-direction: column; gap: 10px; align-items: center; text-align: center; }
        @media (min-width: 720px) {
          .partner-facts { grid-template-columns: repeat(3, 1fr); }
          .partner-benefits { grid-template-columns: repeat(2, 1fr); gap: 30px 40px; }
          .partner-footer { flex-direction: row; justify-content: space-between; text-align: left; }
        }
        @media (min-width: 1000px) {
          .partner-hero-grid { grid-template-columns: 1.05fr 0.95fr; align-items: center; }
        }
      `}</style>
    </div>
  )
}
