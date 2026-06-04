import { useEffect, useState } from 'react'
import { ArrowLeft, MapPin, Calendar, Mail, Check, Users, Trophy, Briefcase, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import PixelDivider from '../components/PixelDivider'
import { HOME } from '../lib/routes'

const IMG = '/events/middle-east/2026'

const WHY_ATTEND = [
  { title: "Saudi Arabia's Football Moment", desc: 'Vision 2030, the Saudi Pro League transformation, and the road to the 2034 FIFA World Cup, in the city where the strategy is written.' },
  { title: 'Regional Power Room', desc: 'Federations, clubs, investors and partners from across the GCC, North Africa and West Asia, together in one place.' },
  { title: 'Capital Meets Football', desc: 'The most concentrated pool of football-focused capital in the world is in this region. Soccerex is how you meet it.' },
  { title: 'Misk City Experience', desc: "Headquartered inside the Kingdom's flagship cultural district, with a social programme built around Riyadh's new wave of hospitality." },
]

const THEMES = [
  'Saudi Pro League and club transformation',
  'The road to FIFA World Cup 2034',
  'Investment, ownership and sovereign capital',
  'Federations, governance and international football',
  'Infrastructure, stadia and host-city readiness',
  "Women's football in the Middle East",
  'Sport, entertainment and giga-project integration',
  'Commercial rights, broadcast and regional media',
]

const RIGHTS_HOLDER_POINTS = [
  'Connect with the brands, investors and solution providers expanding their football business across the Middle East.',
  'Discover the innovations and best practices shaping the Saudi Pro League, the 2034 World Cup and the wider regional game.',
  'Showcase your project to a senior room of decision-makers, sovereign partners and global operators.',
  'Build the credibility that opens doors across the ecosystem, from Jeddah to Doha to Dubai.',
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
        body: encode({ 'form-name': 'riyadh-preregister', ...form }),
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
        <p className="font-body text-white/65 text-sm leading-relaxed">We'll be in touch as soon as registration, tickets and the agenda for Soccerex Middle East 2027 are live.</p>
      </div>
    )
  }

  return (
    <form name="riyadh-preregister" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={submit} className="flex flex-col gap-3">
      <input type="hidden" name="form-name" value="riyadh-preregister" />
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

export default function Riyadh2027() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="event-page theme-riyadh" style={{ background: 'var(--event-bg-dark)' }}>

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="inner-hero relative overflow-hidden flex items-center">
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${IMG}/sections/riyadh-skyline.jpg)`,
          backgroundSize: 'cover', backgroundPosition: 'center', filter: 'saturate(0.6) brightness(0.3)',
        }} />
        <div className="absolute inset-0" style={{ background: 'var(--event-overlay)' }} />

        <div className="relative z-10 text-center w-full" style={{ padding: 'clamp(60px,7vw,110px) clamp(24px,5vw,80px) clamp(60px,8vw,100px)' }}>
          <Link to={HOME} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest mb-6" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <div className="flex justify-center mb-6">
            <span className="event-badge"><span className="event-badge-dot" /> Coming Soon, Riyadh</span>
          </div>

          <div className="inner-hero-crest inner-hero-crest--xl flex justify-center">
            <img
              src="/brand/crests/crest-main-white.svg"
              alt="Soccerex, Est. 1996, 30 Years"
              style={{ filter: 'drop-shadow(0 0 18px rgba(255,255,255,0.7)) drop-shadow(0 0 60px rgba(255,255,255,0.45)) drop-shadow(0 12px 40px rgba(0,0,0,0.5))' }}
            />
          </div>

          <h1 className="font-heading font-bold text-white leading-tight mb-2" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)', textShadow: '0 2px 30px rgba(0,0,0,0.5)' }}>
            RIYADH
          </h1>
          <h2 className="font-heading font-bold leading-tight mb-6" style={{ fontSize: 'clamp(1.3rem, 3vw, 2.4rem)', color: '#fff' }}>
            <span style={{ color: 'var(--event-primary)', WebkitTextStroke: '1px rgba(255,255,255,0.12)' }}>THE MIDDLE EAST, REWRITING THE FOOTBALL PLAYBOOK</span>
          </h2>

          <div className="flex items-center justify-center gap-12 mb-6 flex-wrap">
            <div className="text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-1"><MapPin size={12} className="inline mr-1" /> Venue</p>
              <p className="font-heading font-bold text-white text-xl">Misk City</p>
            </div>
            <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, transparent, var(--event-primary), transparent)' }} />
            <div className="text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-1"><Calendar size={12} className="inline mr-1" /> Date</p>
              <p className="font-heading font-bold text-white text-xl">January 2027</p>
            </div>
          </div>

          <p className="font-body text-white/70 leading-relaxed mx-auto mb-8" style={{ fontSize: '1.05rem', maxWidth: '740px' }}>
            Saudi Arabia is reshaping world football from the pitch up. Soccerex Middle East lands in Misk City, the Kingdom's flagship cultural district, for the definitive gathering of the clubs, federations, investors and innovators powering the region's next era of the game.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <a href="#pre-register" className="event-btn-primary"><Mail size={16} /> Pre-register</a>
            <Link to={HOME} className="event-btn-outline"><ArrowLeft size={16} /> Back to Soccerex</Link>
          </div>
        </div>
      </section>

      {/* ─── WHAT IS SOCCEREX MIDDLE EAST (White) ───────────────────────── */}
      <PixelDivider color="#031a10" layers={4} height={100} speed={0.6} />
      <section style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(140px,14vw,180px) clamp(24px,5vw,80px) clamp(60px,8vw,100px)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-12">
            <img src={`${IMG}/sections/riyadh-skyline.jpg`} alt="Riyadh skyline" style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', aspectRatio: '4/3' }} />
            <div>
              <h2 className="font-heading font-bold text-2xl mb-6" style={{ color: '#1a1a1a' }}>
                What Is <span style={{ color: 'var(--event-primary)' }}>Soccerex Middle East</span>?
              </h2>
              <p className="font-body leading-relaxed mb-4" style={{ fontSize: '1.05rem', color: '#444' }}>
                Soccerex Middle East is the region's definitive event for the business of football. Hosted at Misk City, the Kingdom's purpose-built cultural district, it brings together the people building the Saudi Pro League, preparing for the 2034 FIFA World Cup, and reshaping the global game from the region outwards.
              </p>
              <p className="font-body leading-relaxed" style={{ fontSize: '1.05rem', color: '#444' }}>
                Federations, clubs, ministries, investors, rights holders and solution providers meet in one room to set the agenda for the most closely watched football market on earth.
              </p>
            </div>
          </div>

          <h3 className="font-heading font-bold text-xl mb-6" style={{ color: '#1a1a1a' }}>A Focused Regional Agenda</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {THEMES.map((theme) => (
              <div key={theme} className="flex items-center gap-4 px-6 py-5 rounded-xl" style={{ background: 'rgba(15,143,82,0.10)', border: '1px solid rgba(15,143,82,0.28)' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--event-primary)', flexShrink: 0 }} />
                <span className="font-body font-medium" style={{ fontSize: '0.95rem', color: '#1a1a1a' }}>{theme}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY ATTEND ──────────────────────────────────────────────────── */}
      <PixelDivider color="#eae8e4" layers={4} height={100} speed={0.6} />
      <section style={{ background: 'linear-gradient(180deg, #031a10 0%, #06351f 50%, #031a10 100%)', padding: 'clamp(140px,14vw,180px) clamp(24px,5vw,80px) clamp(60px,8vw,100px)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 className="font-heading font-bold text-white text-2xl mb-8">Why Attend?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WHY_ATTEND.map((item, i) => {
              const Icons = [Star, Users, Briefcase, Trophy]
              const Icon = Icons[i]
              return (
                <div key={item.title} className="event-card">
                  <Icon size={28} style={{ color: 'var(--event-primary-light)', marginBottom: 14 }} />
                  <h3 className="font-heading font-bold uppercase tracking-wider mb-3" style={{ fontSize: '1.05rem', color: '#fff' }}>{item.title}</h3>
                  <p className="font-body leading-relaxed" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── PRE-REGISTER + RIGHTS HOLDERS ──────────────────────────────── */}
      <section id="pre-register" className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #031a10 0%, #06351f 40%, #031a10 100%)', padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="flex justify-center mb-3">
            <span className="event-badge"><span className="event-badge-dot" /> Early Access</span>
          </div>
          <h2 className="font-heading font-bold text-center text-white mb-3" style={{ fontSize: 'clamp(1.8rem, 3.6vw, 2.6rem)' }}>
            Be first in line for <span style={{ color: 'var(--event-primary-light)' }}>Soccerex Middle East</span>
          </h2>
          <p className="font-body text-center text-white/60 mx-auto mb-10" style={{ maxWidth: '640px' }}>
            Registration, tickets, agenda and speakers open soon. Pre-register to get the announcement before the public release, plus priority access for rights holders.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--event-primary-border)', borderRadius: '14px', padding: 'clamp(24px, 3vw, 36px)' }}>
              <h3 className="font-heading font-bold text-white text-xl mb-2 flex items-center gap-2">
                <Mail size={18} style={{ color: 'var(--event-primary-light)' }} /> Pre-register
              </h3>
              <p className="font-body text-white/60 text-sm mb-6">Join the list and we'll send the launch email as soon as tickets go live.</p>
              <PreRegisterForm />
            </div>

            <div style={{ background: 'linear-gradient(145deg, var(--event-primary-bg), rgba(255,255,255,0.02))', border: '1px solid var(--event-primary-border)', borderRadius: '14px', padding: 'clamp(24px, 3vw, 36px)' }}>
              <h3 className="font-heading font-bold text-white text-xl mb-2 flex items-center gap-2">
                <Trophy size={18} style={{ color: 'var(--event-primary-light)' }} /> Rights Holders
              </h3>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5" style={{ background: 'var(--event-primary)', color: '#031a10', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Complimentary Pass
              </div>
              <p className="font-body text-white/70 text-sm mb-5 leading-relaxed">
                Clubs, leagues, federations and national teams qualify for a complimentary delegate pass. Here's what you unlock:
              </p>
              <ul className="flex flex-col gap-3">
                {RIGHTS_HOLDER_POINTS.map((pt) => (
                  <li key={pt} className="flex gap-3 items-start">
                    <Check size={16} style={{ color: 'var(--event-primary-light)', marginTop: 2, flexShrink: 0 }} />
                    <span className="font-body text-white/75 text-sm leading-relaxed">{pt}</span>
                  </li>
                ))}
              </ul>
              <p className="font-body text-white/50 text-xs mt-6">
                Rights holder enquiries: <a href="mailto:enquiries@soccerex.com" style={{ color: 'var(--event-primary-light)', textDecoration: 'none' }}>enquiries@soccerex.com</a>
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
