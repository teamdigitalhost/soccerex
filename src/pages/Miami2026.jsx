import { useEffect, useState } from 'react'
import {
  ArrowLeft, MapPin, Calendar, Mail, Check, Users, Trophy, Briefcase, Star,
  Lightbulb, Handshake, TrendingUp, Globe,
  Shield, Building2, Landmark, Wallet, GraduationCap, Volleyball,
} from 'lucide-react'
import { Link } from 'react-router-dom'

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

export default function Miami2026() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="event-page theme-miami" style={{ background: 'var(--event-sand, #FFF1EB)' }}>

      {/* ─── HERO (light, sand-dominant) ─────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #FFF6EE 0%, #FFE6D2 60%, #FFF1EB 100%)' }}>
        {/* Sunset gradient blob top-right */}
        <div className="absolute pointer-events-none" style={{
          top: '-200px', right: '-200px', width: '720px', height: '720px',
          background: 'radial-gradient(circle, rgba(255,180,106,0.55) 0%, rgba(233,30,99,0.35) 40%, rgba(106,57,198,0.0) 70%)',
          filter: 'blur(20px)',
        }} />
        {/* Aqua mist blob bottom-left */}
        <div className="absolute pointer-events-none" style={{
          bottom: '-160px', left: '-160px', width: '520px', height: '520px',
          background: 'radial-gradient(circle, rgba(0,198,215,0.35) 0%, rgba(0,124,145,0.18) 50%, rgba(0,124,145,0) 70%)',
          filter: 'blur(20px)',
        }} />
        {/* Faint synthwave grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(13,27,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(13,27,42,0.06) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at 50% 30%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 30%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 75%)',
        }} />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(48px,6vw,96px) clamp(24px,5vw,80px) clamp(64px,8vw,120px)' }}>
          {/* Left: text */}
          <div className="lg:col-span-7">
            <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest mb-7" style={{ color: '#0D1B2A', opacity: 0.55, textDecoration: 'none' }}>
              <ArrowLeft size={14} /> Back to Home
            </Link>

            {/* 30 YEARS strip */}
            <div className="flex items-center gap-3 mb-7 flex-wrap">
              <span className="miami-headline" style={{ fontSize: '52px', lineHeight: 0.95, color: '#E91E63' }}>30</span>
              <div>
                <p className="miami-subhead" style={{ color: '#0D1B2A', fontSize: '11px', letterSpacing: '0.2em', lineHeight: 1.2 }}>YEARS OF BUILDING</p>
                <p className="miami-subhead" style={{ color: '#0D1B2A', fontSize: '11px', letterSpacing: '0.2em', lineHeight: 1.2 }}>THE GLOBAL GAME</p>
              </div>
              <div className="flex items-center gap-2 ml-2" style={{ color: '#0D1B2A', opacity: 0.6 }}>
                <span className="miami-subhead" style={{ fontSize: '11px' }}>1996</span>
                <span style={{ width: 56, height: 2, background: 'linear-gradient(90deg, #007C91, #E91E63)' }} />
                <span className="miami-subhead" style={{ fontSize: '11px' }}>2026</span>
              </div>
            </div>

            <h1 className="miami-headline mb-3" style={{ fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', color: '#0D1B2A', lineHeight: 1.05, letterSpacing: '0.005em' }}>
              The world came for<br />
              the World Cup.
              <br />
              <span style={{ color: '#E91E63' }}>Now it stays for Soccerex.</span>
            </h1>

            {/* Wordmark: SOCCEREX in navy + script Miami + 2026 gradient */}
            <div className="flex items-end flex-wrap gap-x-4 gap-y-1 my-7">
              <span className="miami-headline" style={{ fontSize: 'clamp(2.6rem, 6vw, 4.6rem)', lineHeight: 0.9, color: '#0D1B2A', letterSpacing: '0.02em' }}>
                SOCCEREX
              </span>
              <span className="miami-script" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', lineHeight: 0.85, color: '#E91E63' }}>Miami</span>
              <span className="miami-headline miami-text-gradient" style={{ fontSize: 'clamp(2rem, 4.4vw, 3.2rem)', lineHeight: 0.9, letterSpacing: '0.01em' }}>2026</span>
            </div>

            <p className="miami-subhead mb-8" style={{ color: '#0D1B2A', opacity: 0.7, fontSize: '12px', letterSpacing: '0.2em' }}>
              Football's most influential week returns home.
            </p>

            <div className="flex items-center gap-8 mb-8 flex-wrap">
              <div>
                <p className="miami-subhead mb-1" style={{ color: '#607186', fontSize: '10px' }}><MapPin size={12} className="inline mr-1" /> Venue</p>
                <p className="miami-headline" style={{ color: '#0D1B2A', fontSize: '1.15rem', letterSpacing: '0.04em' }}>Miami Freedom Park</p>
              </div>
              <div style={{ width: 60, height: 2, background: 'linear-gradient(90deg, transparent, #E91E63, transparent)' }} />
              <div>
                <p className="miami-subhead mb-1" style={{ color: '#607186', fontSize: '10px' }}><Calendar size={12} className="inline mr-1" /> Date</p>
                <p className="miami-headline" style={{ color: '#0D1B2A', fontSize: '1.15rem', letterSpacing: '0.04em' }}>23-25 September 2026</p>
              </div>
            </div>

            <p className="miami-body leading-relaxed mb-8" style={{ fontSize: '1.02rem', color: '#1a2a3a', maxWidth: '620px' }}>
              Nine months before the 2026 FIFA World Cup kicks off across North America, the global football industry lands in Miami. Three days of executive content, networking, and commercial opportunity at the city's new home of football, Miami Freedom Park.
            </p>

            <div className="flex flex-wrap gap-3">
              <a href="#pre-register" className="event-btn-primary"><Mail size={16} /> Pre-register</a>
              <Link to="/" className="event-btn-outline-light"><ArrowLeft size={16} /> Back to Soccerex</Link>
            </div>
          </div>

          {/* Right: image card */}
          <div className="lg:col-span-5">
            <div className="relative" style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 30px 80px -30px rgba(13,27,42,0.45), 0 12px 30px -10px rgba(233,30,99,0.25)', aspectRatio: '4/5' }}>
              <img src={`${IMG}/sections/miami-skyline.jpg`} alt="Miami skyline at sunset" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.1) contrast(1.05)' }} />
              {/* Gradient overlay on image */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(255,180,106,0.15) 0%, rgba(233,30,99,0.18) 50%, rgba(13,27,42,0.55) 100%)' }} />
              {/* Inner ring */}
              <div className="absolute inset-0 pointer-events-none" style={{ borderRadius: '20px', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)' }} />

              <div className="absolute left-0 right-0 bottom-0 p-6 text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3" style={{ background: 'rgba(13,27,42,0.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: '#E91E63', boxShadow: '0 0 10px rgba(233,30,99,0.8)' }} />
                  <span className="miami-subhead" style={{ fontSize: '10px' }}>Coming Soon</span>
                </div>
                <p className="miami-headline" style={{ fontSize: '1.6rem', letterSpacing: '0.03em' }}>Miami, USA</p>
                <p className="miami-body" style={{ fontSize: '0.85rem', opacity: 0.8 }}>Three days at the city's new home of football.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHAT IS SOCCEREX MIAMI ─────────────────────────────────────── */}
      <section style={{ background: '#FFFFFF', padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start mb-16">
            <div className="relative">
              <img src={`${IMG}/sections/miami-night.jpg`} alt="Miami at night" style={{ width: '100%', borderRadius: '16px', objectFit: 'cover', aspectRatio: '4/3', boxShadow: '0 24px 60px -28px rgba(13,27,42,0.45)' }} />
              <div className="absolute" style={{ left: -14, top: -14, width: 64, height: 64, background: 'var(--miami-sunset)', borderRadius: '16px', zIndex: -1, opacity: 0.9 }} />
              <div className="absolute" style={{ right: -14, bottom: -14, width: 96, height: 96, border: '2px solid #007C91', borderRadius: '16px', zIndex: -1 }} />
            </div>
            <div>
              <p className="miami-subhead mb-3" style={{ color: '#007C91', fontSize: '11px' }}>Where global football meets Miami</p>
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
              <div key={theme} className="flex items-center gap-4 px-5 py-4 rounded-xl" style={{ background: '#FFF1EB', border: '1px solid rgba(13,27,42,0.06)' }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--miami-sunset)', flexShrink: 0 }} />
                <span className="miami-body font-medium" style={{ fontSize: '0.95rem', color: '#0D1B2A' }}>{theme}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ECOSYSTEM (light, sand) ────────────────────────────────────── */}
      <section style={{ background: '#FFF1EB', padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div className="text-center mb-12">
            <p className="miami-subhead mb-3" style={{ color: '#007C91', fontSize: '11px' }}>Who's in the room</p>
            <h2 className="miami-headline" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#0D1B2A' }}>
              The <span className="miami-text-gradient">Soccerex Ecosystem</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {ECOSYSTEM.map(({ label, Icon }) => (
              <div key={label} className="miami-cell-light">
                <Icon size={28} style={{ color: '#007C91', margin: '0 auto 12px' }} />
                <p className="miami-subhead" style={{ color: '#0D1B2A', fontSize: '11px' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY ATTEND (white) ──────────────────────────────────────────── */}
      <section style={{ background: '#FFFFFF', padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <h2 className="miami-headline mb-10" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#0D1B2A' }}>Why Attend?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WHY_ATTEND.map((item, i) => {
              const Icons = [Users, Trophy, Briefcase, Star]
              const Icon = Icons[i]
              return (
                <div key={item.title} className="miami-card-light">
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0,124,145,0.08)', border: '1px solid rgba(0,124,145,0.2)', display: 'grid', placeItems: 'center', marginBottom: 16 }}>
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
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--event-primary-border)', borderRadius: '14px', padding: 'clamp(24px, 3vw, 36px)' }}>
              <h3 className="miami-subhead text-white mb-2 flex items-center gap-2" style={{ fontSize: '1.05rem', letterSpacing: '0.1em' }}>
                <Mail size={18} style={{ color: 'var(--event-primary-light)' }} /> Pre-register
              </h3>
              <p className="miami-body text-white/65 text-sm mb-6">Join the list and we'll send the launch email as soon as tickets go live.</p>
              <PreRegisterForm />
            </div>

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
