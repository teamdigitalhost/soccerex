import { useEffect, useState } from 'react'
import { ArrowLeft, MapPin, Calendar, Mail, Check, Trophy, Users, Briefcase, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { preregisterLead, ApiError } from '../lib/soccerexApi'
import { isTestModeFromUrl } from '../lib/testMode'

const IMG = '/events/miami/2026'
const GFX = '/events/miami/2026/graphics'
const ICN = '/events/miami/2026/icons'

const ECOSYSTEM_BRAND = [
  { label: 'Clubs', icon: 'clubs' },
  { label: 'Leagues', icon: 'leagues' },
  { label: 'Federations', icon: 'federations' },
  { label: 'Investors', icon: 'investors' },
  { label: 'Private Equity', icon: 'private-equity' },
  { label: 'Governments', icon: 'governments' },
  { label: "Women's Football", icon: 'womens-football' },
  { label: 'Stadiums', icon: 'stadiums' },
  { label: 'Agencies', icon: 'agencies' },
  { label: 'Academies', icon: 'academies' },
]

const PILLARS_BRAND = [
  { label: 'Insight', icon: 'insight' },
  { label: 'Network', icon: 'network' },
  { label: 'Deals', icon: 'deals' },
  { label: 'Growth', icon: 'growth' },
  { label: 'Impact', icon: 'impact' },
]

const WHY_ATTEND = [
  { title: 'The Americas Converge', desc: 'MLS, Liga MX, CONCACAF, CONMEBOL and the investors reshaping football in the Western Hemisphere, in one room.' },
  { title: 'World Cup Launchpad', desc: 'Nine months before the 2026 FIFA World Cup kicks off next door, Miami is the pre-tournament business hub.' },
  { title: 'Executive Networking', desc: 'Curated introductions with clubs, federations, leagues, rights holders, brands and capital partners.' },
  { title: 'Signature Social Programme', desc: 'Evening receptions and VIP experiences set against the Miami waterfront and Freedom Park.' },
]

const THEMES = [
  'MLS, Liga MX and the CONCACAF growth engine',
  'Broadcasting, media rights and streaming',
  'Club ownership and investment in the Americas',
  'The 2026 World Cup: commercial and operational playbook',
  'Stadium development, Miami Freedom Park and matchday experience',
  "Women's football in the USA, Canada and Mexico",
  'Fan engagement, creator economy and brand activation',
  'Talent pathways across North, Central and South America',
]

const RIGHTS_HOLDER_POINTS = [
  'Connect with brands, investors and solution providers ready to expand your football business across the Americas.',
  'Discover the innovations and best practices shaping MLS, Liga MX, CONCACAF and the road to the 2026 World Cup.',
  'Showcase your club, federation or league to a senior room of decision-makers and potential partners.',
  'Build the relationships that turn into deals long before the tournament kicks off.',
]

function PreRegisterForm() {
  const [form, setForm] = useState({ fullName: '', email: '', companyOrOrganisation: '', role: '', country: '' })
  const [status, setStatus] = useState('idle') /* idle | submitting | success | error */
  const [errors, setErrors] = useState({})     /* field -> [messages] from Laravel 422 */
  const [topError, setTopError] = useState('') /* non-field-specific error message */

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    setErrors({})
    setTopError('')
    try {
      await preregisterLead({
        full_name: form.fullName,
        email: form.email,
        organisation: form.companyOrOrganisation,
        role: form.role,
        country: form.country,
        event_slug: 'soccerex-miami-2026',
        attendee_type: 'rights_holder',
        interest: 'Complimentary rights-holder pass',
        source: 'miami-event-preregister',
        source_url: typeof window !== 'undefined' ? window.location.href : undefined,
        marketing_opt_in: true,
      }, { test: isTestModeFromUrl() })
      setStatus('success')
    } catch (err) {
      if (err instanceof ApiError && err.status === 422 && err.body?.errors) {
        setErrors(err.body.errors)
        setTopError(err.body.message || 'Please fix the highlighted fields and try again.')
      } else {
        setTopError(err?.message || 'Something went wrong. Please try again, or email enquiries@soccerex.com.')
      }
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center text-center" style={{ padding: '32px 8px' }}>
        <div style={{ width: 56, height: 56, borderRadius: 999, background: 'var(--event-primary-bg)', border: '1px solid var(--event-primary-border)', display: 'grid', placeItems: 'center', marginBottom: 18 }}>
          <Check size={26} style={{ color: 'var(--event-primary-light)' }} />
        </div>
        <h4 className="font-heading font-bold text-white text-lg mb-2">You're on the list.</h4>
        <p className="font-body text-white/65 text-sm leading-relaxed">We'll send updates as registration opens.</p>
      </div>
    )
  }

  /* Laravel 422 returns errors keyed by the field name we POSTed. */
  const fieldError = (k) => errors[k]?.[0]

  return (
    <form onSubmit={submit} className="flex flex-col gap-3" noValidate>
      <label className="font-mono text-[10px] uppercase tracking-widest text-white/50">Full name
        <input required value={form.fullName} onChange={update('fullName')} placeholder="Eve Moneypenny"
          className="pre-reg-input" aria-invalid={!!fieldError('full_name')} />
        {fieldError('full_name') && <span className="font-body text-[11px]" style={{ color: '#ff8080' }}>{fieldError('full_name')}</span>}
      </label>
      <label className="font-mono text-[10px] uppercase tracking-widest text-white/50">Email
        <input required type="email" value={form.email} onChange={update('email')} placeholder="eve@example.com"
          className="pre-reg-input" aria-invalid={!!fieldError('email')} />
        {fieldError('email') && <span className="font-body text-[11px]" style={{ color: '#ff8080' }}>{fieldError('email')}</span>}
      </label>
      <label className="font-mono text-[10px] uppercase tracking-widest text-white/50">Company / Organisation
        <input value={form.companyOrOrganisation} onChange={update('companyOrOrganisation')} placeholder="Organisation"
          className="pre-reg-input" aria-invalid={!!fieldError('organisation')} />
        {fieldError('organisation') && <span className="font-body text-[11px]" style={{ color: '#ff8080' }}>{fieldError('organisation')}</span>}
      </label>
      <label className="font-mono text-[10px] uppercase tracking-widest text-white/50">Role
        <input value={form.role} onChange={update('role')} placeholder="Your role"
          className="pre-reg-input" aria-invalid={!!fieldError('role')} />
        {fieldError('role') && <span className="font-body text-[11px]" style={{ color: '#ff8080' }}>{fieldError('role')}</span>}
      </label>
      <label className="font-mono text-[10px] uppercase tracking-widest text-white/50">Country
        <input value={form.country} onChange={update('country')} placeholder="Country"
          className="pre-reg-input" aria-invalid={!!fieldError('country')} />
        {fieldError('country') && <span className="font-body text-[11px]" style={{ color: '#ff8080' }}>{fieldError('country')}</span>}
      </label>

      <button type="submit" disabled={status === 'submitting'} className="event-btn-primary mt-2 justify-center">
        {status === 'submitting' ? 'Sending, one moment' : 'Join the list'}
      </button>
      {status === 'error' && topError && (
        <p className="font-body text-xs" style={{ color: '#ff8080' }}>{topError}</p>
      )}
    </form>
  )
}

export default function Miami2026() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="event-page theme-miami" style={{ background: '#FFF8F4' }}>

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="miami-hero relative overflow-hidden">
        {/* Soft retro grid */}
        <div className="absolute inset-0 pointer-events-none miami-hero-grid" />

        {/* Sun behind the skyline */}
        <img src={`${GFX}/sun.svg`} alt="" aria-hidden className="miami-hero-sun" />

        {/* City skyline silhouette across the bottom */}
        <img src={`${GFX}/skyline.png`} alt="" aria-hidden className="miami-hero-skyline" />

        {/* Single palm on the right — left side stays clean so the logo reads */}
        <img src={`${GFX}/tree3.svg`} alt="" aria-hidden className="miami-hero-palm-right" />

        {/* Cyan brush stroke filling the empty top-right corner. Using
            the tapered Asset 44 stroke (soft brushy edges all round) so it
            can simply overflow off-screen at top + right without needing
            a hard clip mask. */}
        <img src={`${GFX}/brush-stroke-cyan.svg`} alt="" aria-hidden className="miami-hero-brush" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-10 items-center" style={{ maxWidth: '1360px', margin: '0 auto', padding: 'clamp(28px,4vw,56px) clamp(24px,5vw,72px) clamp(180px,18vw,280px)' }}>
          {/* Left: brand lockup + meta */}
          <div className="lg:col-span-7">
            <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest mb-8" style={{ color: '#0D1B2A', opacity: 0.6, textDecoration: 'none' }}>
              <ArrowLeft size={14} /> Back to Home
            </Link>

            {/* Date strip */}
            <div className="flex items-center gap-4 mb-7" style={{ color: '#0D1B2A' }}>
              <span className="miami-subhead" style={{ fontSize: '12px', letterSpacing: '0.24em', color: '#0D1B2A' }}>23-25 SEPTEMBER 2026</span>
              <span style={{ width: 7, height: 7, background: '#E91E63' }} />
              <span className="miami-subhead" style={{ fontSize: '12px', letterSpacing: '0.24em', color: '#007C91' }}>MIAMI, USA</span>
            </div>

            {/* Primary brand lockup */}
            <img src={`${GFX}/logo-primary.svg`} alt="Soccerex Miami 2026" className="miami-hero-logo" />

            {/* Tagline */}
            <p className="miami-subhead mt-7 mb-2" style={{ color: '#007C91', fontSize: 'clamp(11px, 1vw, 13px)', letterSpacing: '0.28em' }}>
              Where Global Football Meets Miami
            </p>
            <h1 className="miami-headline mb-8" style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2rem)', color: '#0D1B2A', lineHeight: 1.15, letterSpacing: '0.01em', maxWidth: '640px' }}>
              The world came for the World Cup.<br />
              <span style={{ color: '#E91E63' }}>The industry stays for Soccerex.</span>
            </h1>

            <div className="flex items-center gap-6 lg:gap-8 mb-8 flex-wrap">
              <div>
                <p className="miami-subhead mb-1" style={{ color: '#607186', fontSize: '10px' }}><MapPin size={12} className="inline mr-1" /> Venue</p>
                <p className="miami-headline" style={{ color: '#0D1B2A', fontSize: '1.05rem', letterSpacing: '0.04em' }}>Miami Freedom Park</p>
              </div>
              <div style={{ width: 7, height: 7, background: '#E91E63' }} />
              <div>
                <p className="miami-subhead mb-1" style={{ color: '#607186', fontSize: '10px' }}><Calendar size={12} className="inline mr-1" /> Date</p>
                <p className="miami-headline" style={{ color: '#0D1B2A', fontSize: '1.05rem', letterSpacing: '0.04em' }}>23-25 September 2026</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <a href="#pre-register" className="miami-pill-primary"><Mail size={15} /> Pre-register Now</a>
              <a href="#pre-register" className="miami-pill-outline">Reserve Your Place &rarr;</a>
            </div>
          </div>

          {/* Right: anniversary + speaker card */}
          <div className="lg:col-span-5 lg:pl-4">
            {/* 30 YEARS anniversary block */}
            <div className="miami-anniv mb-6">
              <div className="flex items-end gap-4">
                <span className="miami-headline" style={{ fontSize: 'clamp(72px, 8vw, 110px)', lineHeight: 0.85, color: '#E91E63' }}>30</span>
                <div style={{ marginBottom: 10 }}>
                  <p className="miami-subhead" style={{ color: '#0D1B2A', fontSize: '12px', letterSpacing: '0.22em', lineHeight: 1.3 }}>YEARS</p>
                  <p className="miami-subhead" style={{ color: '#0D1B2A', fontSize: '12px', letterSpacing: '0.22em', lineHeight: 1.3 }}>OF BUILDING</p>
                  <p className="miami-subhead" style={{ color: '#0D1B2A', fontSize: '12px', letterSpacing: '0.22em', lineHeight: 1.3 }}>THE GLOBAL GAME</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4" style={{ color: '#0D1B2A' }}>
                <span className="miami-subhead" style={{ fontSize: '11px', color: '#607186' }}>1996</span>
                <span style={{ flex: 1, height: 2, background: 'linear-gradient(90deg, #007C91, #E91E63)' }} />
                <span className="miami-subhead" style={{ fontSize: '11px', color: '#E91E63' }}>2026</span>
              </div>
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { num: '3', label: 'Days' },
                { num: '100+', label: 'Speakers' },
                { num: '50+', label: 'Countries' },
              ].map((s) => (
                <div key={s.label} className="text-center px-3 py-4" style={{ background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.08)', boxShadow: '0 4px 14px -8px rgba(13,27,42,0.18)' }}>
                  <p className="miami-headline" style={{ fontSize: '1.4rem', color: '#0D1B2A', lineHeight: 1 }}>{s.num}</p>
                  <p className="miami-subhead mt-1" style={{ fontSize: '10px', color: '#607186', letterSpacing: '0.18em' }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Pillars strip — uses real brand icons */}
            <div className="miami-pillar-strip mt-5">
              {PILLARS_BRAND.map((p) => (
                <div key={p.label} className="miami-pillar-mini">
                  <img src={`${ICN}/${p.icon}.svg`} alt="" aria-hidden />
                  <span className="miami-subhead">{p.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHAT IS SOCCEREX MIAMI ─────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#FFFFFF', padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)' }}>
        {/* Faded Miami script watermark behind the section */}
        <div className="miami-script-watermark" style={{ top: '8%', right: '-6%', width: 'min(120%, 1400px)', height: '60%' }} />
        <div className="relative" style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start mb-16">
            <div className="relative">
              <img src={`${IMG}/sections/miami-night.jpg`} alt="Miami at night" style={{ width: '100%', objectFit: 'cover', aspectRatio: '4/3', boxShadow: '0 24px 60px -28px rgba(13,27,42,0.45)' }} />
              <div className="absolute" style={{ left: -14, top: -14, width: 64, height: 64, background: 'var(--miami-sunset)', zIndex: -1, opacity: 0.9 }} />
              <div className="absolute" style={{ right: -14, bottom: -14, width: 96, height: 96, border: '2px solid #007C91', zIndex: -1 }} />
            </div>
            <div>
              <p className="miami-kicker">Where global football meets Miami</p>
              <h2 className="miami-headline mb-5" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#0D1B2A' }}>
                What is <span style={{ color: '#E91E63' }}>Soccerex Miami</span>?
              </h2>
              <p className="miami-body leading-relaxed mb-4" style={{ fontSize: '1.05rem', color: '#1a2a3a' }}>
                Soccerex Miami is the flagship gathering for the business of football across the Americas. Three days of high-impact content, executive networking, brand activation and industry insight, hosted at the new Miami Freedom Park on the doorstep of the 2026 FIFA World Cup.
              </p>
              <p className="miami-body leading-relaxed" style={{ fontSize: '1.05rem', color: '#1a2a3a' }}>
                Clubs, leagues, federations, investors, rights holders and solution providers from across North, Central and South America come together to shape the commercial future of the sport in the region driving its next chapter.
              </p>
            </div>
          </div>

          <h3 className="miami-headline mb-6" style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', color: '#0D1B2A' }}>Three Days of Insightful Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {THEMES.map((theme) => (
              <div key={theme} className="flex items-center gap-4 px-5 py-4" style={{ background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.08)' }}>
                <div style={{ width: 8, height: 8, background: 'var(--miami-sunset)', flexShrink: 0 }} />
                <span className="miami-body font-medium" style={{ fontSize: '0.95rem', color: '#0D1B2A' }}>{theme}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand divider */}
      <hr className="miami-divider" aria-hidden style={{ margin: '0 auto' }} />

      {/* ─── ECOSYSTEM (crisp white) ────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#FAFBFC', padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div className="text-center mb-12 flex flex-col items-center">
            <p className="miami-kicker">Who's in the room</p>
            <h2 className="miami-headline" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#0D1B2A' }}>
              The <span className="miami-text-gradient">Soccerex Ecosystem</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {ECOSYSTEM_BRAND.map(({ label, icon }) => (
              <div key={label} className="miami-cell-light">
                <img src={`${ICN}/${icon}.svg`} alt="" aria-hidden style={{ width: 40, height: 40, margin: '0 auto 12px', display: 'block' }} />
                <p className="miami-subhead" style={{ color: '#0D1B2A', fontSize: '11px' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand divider */}
      <hr className="miami-divider" aria-hidden style={{ margin: '0 auto' }} />

      {/* ─── WHY ATTEND (white) ──────────────────────────────────────────── */}
      <section style={{ background: '#FFFFFF', padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <p className="miami-kicker miami-kicker--pink">Built for the deal-makers</p>
          <h2 className="miami-headline mb-10" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#0D1B2A' }}>Why Attend?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WHY_ATTEND.map((item, i) => {
              const Icons = [Users, Trophy, Briefcase, Star]
              const Icon = Icons[i]
              return (
                <div key={item.title} className="miami-card-light">
                  <div style={{ width: 44, height: 44, background: 'rgba(0,124,145,0.08)', border: '1px solid rgba(0,124,145,0.2)', display: 'grid', placeItems: 'center', marginBottom: 16 }}>
                    <Icon size={22} style={{ color: '#007C91' }} />
                  </div>
                  <h3 className="miami-subhead mb-3" style={{ fontSize: '1rem', color: '#0D1B2A', letterSpacing: '0.1em' }}>{item.title}</h3>
                  <p className="miami-body leading-relaxed" style={{ fontSize: '0.95rem', color: '#3a4a5a' }}>{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── TAGLINE STRIP (sunset, the one vibrant moment) ─────────────── */}
      <section className="relative overflow-hidden" style={{ background: 'var(--miami-sunset)', padding: 'clamp(70px,9vw,120px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }} />
        <div className="relative z-10 text-center" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 className="miami-headline" style={{ fontSize: 'clamp(1.6rem, 3.6vw, 2.8rem)', color: '#fff', textShadow: '0 4px 24px rgba(13,27,42,0.4)', lineHeight: 1.15 }}>
            From Conventions, to Platforms.<br />
            From Conversations, to <span style={{ color: '#0D1B2A' }}>Outcomes</span>.
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 mt-10">
            {PILLARS_BRAND.map(({ label, icon }) => (
              <div key={label} className="miami-pillar">
                <img src={`${ICN}/${icon}.svg`} alt="" aria-hidden
                  style={{ width: 48, height: 48, filter: 'brightness(0) invert(1)' }} />
                <span className="miami-subhead" style={{ color: '#fff', fontSize: '12px', letterSpacing: '0.18em' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRE-REGISTER + RIGHTS HOLDERS (dark for form contrast) ─────── */}
      <section id="pre-register" className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0D1B2A 0%, #102538 100%)', padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 miami-grid" style={{ opacity: 0.3 }} />
        <div className="relative z-10" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="flex justify-center mb-3">
            <span className="event-badge"><span className="event-badge-dot" /> Early Access</span>
          </div>
          <h2 className="miami-headline text-center text-white mb-3" style={{ fontSize: 'clamp(1.8rem, 3.6vw, 2.6rem)' }}>
            Be first in line for <span className="miami-text-gradient">Soccerex Miami</span>
          </h2>
          <p className="miami-body text-center text-white/70 mx-auto mb-10" style={{ maxWidth: '640px' }}>
            Registration, tickets, agenda and speakers open soon. Pre-register to get the announcement before the public release, plus priority access for rights holders.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--event-primary-border)', padding: 'clamp(24px, 3vw, 36px)' }}>
              <h3 className="miami-subhead text-white mb-2 flex items-center gap-2" style={{ fontSize: '1.05rem', letterSpacing: '0.1em' }}>
                <Mail size={18} style={{ color: 'var(--event-primary-light)' }} /> Pre-register
              </h3>
              <p className="miami-body text-white/65 text-sm mb-6">Join the list and we'll send the launch email as soon as tickets go live.</p>
              <PreRegisterForm />
            </div>

            <div style={{ background: 'linear-gradient(145deg, var(--event-primary-bg), rgba(255,255,255,0.02))', border: '1px solid var(--event-primary-border)', padding: 'clamp(24px, 3vw, 36px)' }}>
              <h3 className="miami-subhead text-white mb-2 flex items-center gap-2" style={{ fontSize: '1.05rem', letterSpacing: '0.1em' }}>
                <Trophy size={18} style={{ color: 'var(--event-primary-light)' }} /> Rights Holders
              </h3>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5" style={{ background: 'var(--event-primary)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Complimentary Pass
              </div>
              <p className="miami-body text-white/75 text-sm mb-5 leading-relaxed">
                Clubs, leagues, federations and national teams qualify for a complimentary delegate pass. Here's what you unlock:
              </p>
              <ul className="flex flex-col gap-3">
                {RIGHTS_HOLDER_POINTS.map((pt) => (
                  <li key={pt} className="flex gap-3 items-start">
                    <Check size={16} style={{ color: 'var(--event-primary-light)', marginTop: 2, flexShrink: 0 }} />
                    <span className="miami-body text-white/80 text-sm leading-relaxed">{pt}</span>
                  </li>
                ))}
              </ul>
              <p className="miami-body text-white/55 text-xs mt-6">
                Rights holder enquiries: <a href="mailto:enquiries@soccerex.com" style={{ color: 'var(--event-primary-light)', textDecoration: 'none' }}>enquiries@soccerex.com</a>
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
