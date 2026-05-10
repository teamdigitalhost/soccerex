import { useEffect, useState } from 'react'
import {
  ArrowLeft, MapPin, Calendar, Mail, Check, Users, Trophy, Briefcase, Star,
  Lightbulb, Handshake, TrendingUp, Globe,
  Shield, Building2, Landmark, Wallet, GraduationCap, Volleyball,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PixelDivider from '../components/PixelDivider'

const IMG = '/events/miami/2026'

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

const ECOSYSTEM = [
  { label: 'Clubs', Icon: Shield },
  { label: 'Leagues', Icon: Trophy },
  { label: 'Federations', Icon: Globe },
  { label: 'Investors', Icon: Wallet },
  { label: 'Private Equity', Icon: TrendingUp },
  { label: 'Governments', Icon: Landmark },
  { label: "Women's Football", Icon: Volleyball },
  { label: 'Stadiums', Icon: Building2 },
  { label: 'Agencies', Icon: Briefcase },
  { label: 'Academies', Icon: GraduationCap },
]

const PILLARS = [
  { label: 'Insight', Icon: Lightbulb },
  { label: 'Network', Icon: Users },
  { label: 'Deals', Icon: Handshake },
  { label: 'Growth', Icon: TrendingUp },
  { label: 'Impact', Icon: Globe },
]

const RIGHTS_HOLDER_POINTS = [
  'Connect with brands, investors and solution providers ready to expand your football business across the Americas.',
  'Discover the innovations and best practices shaping MLS, Liga MX, CONCACAF and the road to the 2026 World Cup.',
  'Showcase your club, federation or league to a senior room of decision-makers and potential partners.',
  'Build the relationships that turn into deals long before the tournament kicks off.',
]

function encode(data) {
  return Object.keys(data)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
    .join('&')
}

function PreRegisterForm() {
  const [form, setForm] = useState({ 'full-name': '', email: '', company: '', role: '', country: '' })
  const [status, setStatus] = useState('idle')

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'miami-preregister', ...form }),
      })
      setStatus('success')
    } catch {
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
        <p className="font-body text-white/65 text-sm leading-relaxed">We'll be in touch as soon as registration, tickets and the agenda for Soccerex Miami 2026 are live.</p>
      </div>
    )
  }

  return (
    <form name="miami-preregister" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={submit} className="flex flex-col gap-3">
      <input type="hidden" name="form-name" value="miami-preregister" />
      <p hidden><label>Leave blank: <input name="bot-field" /></label></p>

      <label className="font-mono text-[10px] uppercase tracking-widest text-white/50">Full name
        <input required value={form['full-name']} onChange={update('full-name')} placeholder="Eve Moneypenny" className="pre-reg-input" />
      </label>
      <label className="font-mono text-[10px] uppercase tracking-widest text-white/50">Email
        <input required type="email" value={form.email} onChange={update('email')} placeholder="eve@example.com" className="pre-reg-input" />
      </label>
      <label className="font-mono text-[10px] uppercase tracking-widest text-white/50">Company / Organisation
        <input value={form.company} onChange={update('company')} placeholder="Organisation" className="pre-reg-input" />
      </label>
      <label className="font-mono text-[10px] uppercase tracking-widest text-white/50">Role
        <input value={form.role} onChange={update('role')} placeholder="Your role" className="pre-reg-input" />
      </label>
      <label className="font-mono text-[10px] uppercase tracking-widest text-white/50">Country
        <input value={form.country} onChange={update('country')} placeholder="Country" className="pre-reg-input" />
      </label>

      <button type="submit" disabled={status === 'submitting'} className="event-btn-primary mt-2 justify-center">
        {status === 'submitting' ? 'Sending, one moment' : 'Join the list'}
      </button>
      {status === 'error' && <p className="font-body text-xs" style={{ color: '#ff8080' }}>Something went wrong. Please email enquiries@soccerex.com and we'll add you manually.</p>}
    </form>
  )
}

/* Inline palm SVG, used as a positioned decorative element. */
function PalmSilhouette({ side = 'left', style = {} }) {
  const flip = side === 'right' ? { transform: 'scaleX(-1)' } : {}
  return (
    <svg viewBox="0 0 200 320" preserveAspectRatio="xMidYMax meet" aria-hidden="true"
      style={{ position: 'absolute', bottom: 0, [side]: 0, height: '78%', width: 'auto', opacity: 0.55, pointerEvents: 'none', ...flip, ...style }}>
      <path fill="#0D1B2A" d="
        M100 320 L98 180 L102 180 L100 320 Z
        M100 175
        C 80 152 50 144 18 156
        C 50 138 78 142 100 168 Z
        M100 175
        C 120 152 150 144 182 156
        C 150 138 122 142 100 168 Z
        M100 168
        C 86 140 64 110 30 92
        C 65 102 86 122 100 160 Z
        M100 168
        C 114 140 136 110 170 92
        C 135 102 114 122 100 160 Z
        M100 162
        C 96 130 100 80 118 38
        C 102 80 100 130 100 156 Z
        M100 162
        C 104 130 100 80 82 38
        C 98 80 100 130 100 156 Z
      "/>
    </svg>
  )
}

/* Lifeguard tower silhouette */
function LifeguardTower({ style = {} }) {
  return (
    <svg viewBox="0 0 220 180" preserveAspectRatio="xMidYMax meet" aria-hidden="true"
      style={{ position: 'absolute', height: '38%', width: 'auto', opacity: 0.85, pointerEvents: 'none', ...style }}>
      {/* legs */}
      <path d="M50 170 L72 70 M170 170 L148 70 M65 170 L88 70 M155 170 L132 70" stroke="#00C6D7" strokeWidth="3" fill="none" />
      {/* main hut */}
      <rect x="58" y="60" width="104" height="44" rx="2" fill="#00C6D7" />
      <rect x="58" y="60" width="104" height="10" fill="#E91E63" />
      <rect x="68" y="76" width="22" height="22" fill="#0D1B2A" opacity="0.8" />
      <rect x="100" y="76" width="22" height="22" fill="#0D1B2A" opacity="0.8" />
      <rect x="132" y="76" width="22" height="22" fill="#0D1B2A" opacity="0.8" />
      {/* roof */}
      <path d="M50 60 L110 28 L170 60 Z" fill="#E91E63" />
      {/* deck */}
      <rect x="40" y="104" width="140" height="6" fill="#FFB46A" />
      {/* ladder */}
      <path d="M170 110 L180 170 M178 110 L188 170 M170 120 L180 122 M170 140 L181 142 M170 160 L182 162" stroke="#0D1B2A" strokeWidth="2" fill="none" opacity="0.7" />
    </svg>
  )
}

export default function Miami2026() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="event-page theme-miami" style={{ background: 'var(--event-bg-dark)' }}>

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="inner-hero relative overflow-hidden flex items-center" style={{ minHeight: '92vh' }}>
        {/* Sunset sky gradient */}
        <div className="absolute inset-0" style={{ background: 'var(--miami-sky)', opacity: 0.85 }} />
        {/* Skyline image, multiplied for silhouette feel */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${IMG}/sections/miami-skyline.jpg)`,
          backgroundSize: 'cover', backgroundPosition: 'center bottom',
          mixBlendMode: 'multiply',
          filter: 'saturate(0.75) contrast(1.15) brightness(0.65)',
          opacity: 0.85,
        }} />
        {/* Synthwave grid */}
        <div className="absolute inset-0 miami-grid" />
        {/* Bottom navy fade so text settles */}
        <div className="absolute inset-x-0 bottom-0" style={{ height: '55%', background: 'linear-gradient(180deg, rgba(13,27,42,0) 0%, rgba(13,27,42,0.6) 50%, rgba(13,27,42,0.95) 100%)' }} />
        {/* Decorative palms */}
        <PalmSilhouette side="left" style={{ left: '-30px' }} />
        <PalmSilhouette side="right" style={{ right: '-30px' }} />
        {/* Lifeguard tower bottom-left */}
        <LifeguardTower style={{ left: 'clamp(20px, 6vw, 80px)', bottom: '8%' }} />

        <div className="relative z-10 text-center w-full" style={{ padding: 'clamp(60px,7vw,110px) clamp(24px,5vw,80px) clamp(60px,8vw,100px)' }}>
          <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest mb-6" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <div className="flex justify-center mb-5">
            <span className="event-badge"><span className="event-badge-dot" /> Coming Soon, Miami</span>
          </div>

          {/* 30 YEARS / 1996 - 2026 timeline strip */}
          <div className="flex items-center justify-center gap-3 mb-7" style={{ opacity: 0.95 }}>
            <span className="miami-subhead text-white/70" style={{ fontSize: 'clamp(10px, 1vw, 12px)' }}>1996</span>
            <span style={{ width: '36px', height: '2px', background: 'linear-gradient(90deg, var(--event-secondary-light), var(--event-primary))' }} />
            <span className="miami-headline" style={{ fontSize: 'clamp(14px, 1.4vw, 16px)', color: '#fff', letterSpacing: '0.18em' }}>
              30 YEARS &middot; BUILDING THE GLOBAL GAME
            </span>
            <span style={{ width: '36px', height: '2px', background: 'linear-gradient(90deg, var(--event-primary), var(--event-secondary-light))' }} />
            <span className="miami-subhead text-white/70" style={{ fontSize: 'clamp(10px, 1vw, 12px)' }}>2026</span>
          </div>

          <div className="inner-hero-crest inner-hero-crest--xl flex justify-center fade-up" style={{ marginBottom: 'clamp(18px, 2vw, 28px)' }}>
            <img
              src="/brand/crests/crest-miami-white.svg"
              alt="Soccerex Miami, Est. 1996, 30 Years"
              style={{ filter: 'drop-shadow(0 10px 50px rgba(233, 30, 99, 0.55)) drop-shadow(0 0 110px rgba(233, 30, 99, 0.25))' }}
            />
          </div>

          {/* SOCCEREX wordmark, then "Miami" script + "2026", echoing the brand sheet */}
          <h1 className="miami-headline mb-1" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.6rem)', color: '#fff', textShadow: '0 2px 30px rgba(0,0,0,0.5)', letterSpacing: '0.08em' }}>
            SOCCEREX
          </h1>
          <div className="flex items-baseline justify-center gap-3 mb-6">
            <span className="miami-script" style={{ fontSize: 'clamp(2.6rem, 6.5vw, 5.2rem)', lineHeight: 1, color: 'var(--event-primary)', textShadow: '0 4px 24px rgba(233,30,99,0.45)' }}>
              Miami
            </span>
            <span className="miami-script" style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', lineHeight: 1, color: 'var(--event-secondary-light)' }}>
              2026
            </span>
          </div>

          <h2 className="miami-subhead mb-7 mx-auto" style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.25rem)', color: '#fff', maxWidth: '820px', lineHeight: 1.35 }}>
            <span style={{ color: 'var(--event-secondary-light)' }}>The world came for the World Cup.</span>{' '}
            <span style={{ color: 'var(--event-primary-light)' }}>Now it stays for Soccerex.</span>
          </h2>

          <div className="flex items-center justify-center gap-12 mb-7 flex-wrap">
            <div className="text-center">
              <p className="miami-subhead text-white/60 mb-1" style={{ fontSize: '11px' }}><MapPin size={12} className="inline mr-1" /> Venue</p>
              <p className="miami-headline text-white" style={{ fontSize: '1.25rem', letterSpacing: '0.04em' }}>Miami Freedom Park</p>
            </div>
            <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, transparent, var(--event-primary), transparent)' }} />
            <div className="text-center">
              <p className="miami-subhead text-white/60 mb-1" style={{ fontSize: '11px' }}><Calendar size={12} className="inline mr-1" /> Date</p>
              <p className="miami-headline text-white" style={{ fontSize: '1.25rem', letterSpacing: '0.04em' }}>23-25 September 2026</p>
            </div>
          </div>

          <p className="miami-body text-white/80 leading-relaxed mx-auto mb-8" style={{ fontSize: '1.05rem', maxWidth: '740px' }}>
            Nine months before the 2026 FIFA World Cup kicks off across North America, the global football industry lands in Miami. Three days of executive content, networking, and commercial opportunity at the city's new home of football, Miami Freedom Park.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <a href="#pre-register" className="event-btn-primary"><Mail size={16} /> Pre-register</a>
            <Link to="/" className="event-btn-outline"><ArrowLeft size={16} /> Back to Soccerex</Link>
          </div>
        </div>
      </section>

      {/* ─── WHAT IS SOCCEREX MIAMI (White) ─────────────────────────────────── */}
      <PixelDivider color="#0D1B2A" layers={4} height={100} speed={0.6} />
      <section style={{ background: 'linear-gradient(180deg, #FFF1EB 0%, #f3ece5 100%)', padding: 'clamp(140px,14vw,180px) clamp(24px,5vw,80px) clamp(60px,8vw,100px)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-12">
            <img src={`${IMG}/sections/miami-night.jpg`} alt="Miami at night" style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', aspectRatio: '4/3', boxShadow: '0 24px 60px -28px rgba(13,27,42,0.45)' }} />
            <div>
              <p className="miami-subhead mb-3" style={{ color: 'var(--event-secondary)', fontSize: '11px' }}>Where global football meets Miami</p>
              <h2 className="miami-headline mb-2" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#0D1B2A' }}>
                What is <span style={{ color: 'var(--event-primary)' }}>Soccerex Miami</span>?
              </h2>
              <p className="miami-body leading-relaxed mt-4 mb-4" style={{ fontSize: '1.05rem', color: '#1a2a3a' }}>
                Soccerex Miami is the flagship gathering for the business of football across the Americas. Three days of high-impact content, executive networking, brand activation and industry insight, hosted at the new Miami Freedom Park on the doorstep of the 2026 FIFA World Cup.
              </p>
              <p className="miami-body leading-relaxed" style={{ fontSize: '1.05rem', color: '#1a2a3a' }}>
                Clubs, leagues, federations, investors, rights holders and solution providers from across North, Central and South America come together to shape the commercial future of the sport in the region driving its next chapter.
              </p>
            </div>
          </div>

          <h3 className="miami-headline mb-6" style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', color: '#0D1B2A' }}>Three Days of Insightful Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            {THEMES.map((theme) => (
              <div key={theme} className="flex items-center gap-4 px-6 py-5 rounded-xl" style={{ background: 'rgba(0,124,145,0.06)', border: '1px solid rgba(233,30,99,0.22)' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--miami-sunset)', flexShrink: 0 }} />
                <span className="miami-body font-medium" style={{ fontSize: '0.95rem', color: '#0D1B2A' }}>{theme}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ECOSYSTEM GRID ────────────────────────────────────────────────── */}
      <PixelDivider color="#f3ece5" layers={4} height={100} speed={0.6} />
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0D1B2A 0%, #102538 100%)', padding: 'clamp(140px,14vw,180px) clamp(24px,5vw,80px) clamp(80px,10vw,120px)' }}>
        <div className="absolute inset-0 miami-grid" style={{ opacity: 0.45 }} />
        <div className="relative z-10" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="text-center mb-12">
            <p className="miami-subhead mb-3" style={{ color: 'var(--event-secondary-light)', fontSize: '11px' }}>Who's in the room</p>
            <h2 className="miami-headline" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#fff' }}>
              The <span className="miami-text-gradient">Soccerex Ecosystem</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {ECOSYSTEM.map(({ label, Icon }) => (
              <div key={label} className="miami-cell">
                <Icon size={28} style={{ color: 'var(--event-secondary-light)', margin: '0 auto 12px' }} />
                <p className="miami-subhead" style={{ color: '#fff', fontSize: '12px' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY ATTEND ──────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(180deg, #102538 0%, #0a1622 100%)', padding: 'clamp(80px,10vw,120px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 className="miami-headline text-white mb-8" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)' }}>Why Attend?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WHY_ATTEND.map((item, i) => {
              const Icons = [Users, Trophy, Briefcase, Star]
              const Icon = Icons[i]
              return (
                <div key={item.title} className="event-card">
                  <Icon size={28} style={{ color: 'var(--event-secondary-light)', marginBottom: 14 }} />
                  <h3 className="miami-subhead mb-3" style={{ fontSize: '1.05rem', color: '#fff', letterSpacing: '0.1em' }}>{item.title}</h3>
                  <p className="miami-body leading-relaxed" style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.75)' }}>{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── TAGLINE STRIP ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: 'var(--miami-sunset)', padding: 'clamp(70px,9vw,110px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 miami-grid" style={{ opacity: 0.35 }} />
        <PalmSilhouette side="left" style={{ left: '-40px', height: '120%', opacity: 0.35 }} />
        <PalmSilhouette side="right" style={{ right: '-40px', height: '120%', opacity: 0.35 }} />
        <div className="relative z-10 text-center" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 className="miami-headline" style={{ fontSize: 'clamp(1.6rem, 3.6vw, 2.8rem)', color: '#fff', textShadow: '0 4px 24px rgba(13,27,42,0.4)', lineHeight: 1.15 }}>
            From Conventions, to Platforms.<br />
            From Conversations, to <span style={{ color: '#0D1B2A' }}>Outcomes</span>.
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-10">
            {PILLARS.map(({ label, Icon }) => (
              <div key={label} className="miami-pillar">
                <div className="miami-pillar-icon" style={{ background: 'rgba(13,27,42,0.25)', borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>
                  <Icon size={22} />
                </div>
                <span className="miami-subhead" style={{ color: '#fff', fontSize: '12px', letterSpacing: '0.18em' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRE-REGISTER + RIGHTS HOLDERS ──────────────────────────────── */}
      <section id="pre-register" className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a1622 0%, #102538 40%, #0D1B2A 100%)', padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)' }}>
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
            {/* Pre-register card */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--event-primary-border)', borderRadius: '14px', padding: 'clamp(24px, 3vw, 36px)' }}>
              <h3 className="miami-subhead text-white mb-2 flex items-center gap-2" style={{ fontSize: '1.05rem', letterSpacing: '0.1em' }}>
                <Mail size={18} style={{ color: 'var(--event-primary-light)' }} /> Pre-register
              </h3>
              <p className="miami-body text-white/65 text-sm mb-6">Join the list and we'll send the launch email as soon as tickets go live.</p>
              <PreRegisterForm />
            </div>

            {/* Rights holders card */}
            <div style={{ background: 'linear-gradient(145deg, var(--event-primary-bg), rgba(255,255,255,0.02))', border: '1px solid var(--event-primary-border)', borderRadius: '14px', padding: 'clamp(24px, 3vw, 36px)' }}>
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
