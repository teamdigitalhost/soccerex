import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Handshake, Users, Clock, CalendarCheck, Rocket, Building2, Trophy, ChevronRight } from 'lucide-react'
import NetworkNodes from '../animations/NetworkNodes'
import PixelDivider from '../components/PixelDivider'

// ─── Scroll animations ──────────────────────────────────────────────────────
function useScrollAnimations() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }) },
      { threshold: 0.01, rootMargin: '0px 0px 200px 0px' }
    )
    document.querySelectorAll('.fade-up, .slide-left, .slide-right, .scale-up').forEach((el) => {
      if (!el.classList.contains('visible')) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])
}

const HOW_IT_WORKS = [
  {
    icon: Handshake,
    title: 'Curated Deal Facilitation',
    desc: 'Both sides submit priorities. Soccerex matches them and delivers a pre-scheduled meeting agenda before the event. No chance encounters, only engineered introductions.',
  },
  {
    icon: Users,
    title: 'Roundtables & Deal Lunches',
    desc: 'Structured Deal Network lunches and closed investor roundtables. Soccerex determines who sits at the table and why. Peer-level conversations, not open networking.',
  },
  {
    icon: Clock,
    title: 'Year-Round Concierge',
    desc: 'Between events, Soccerex acts as an ongoing broker, facilitating introductions, arranging curated meetings, and connecting participants through lunches and direct outreach.',
  },
]

const RIGHTSHOLDERS = [
  'Clubs & academies',
  'Leagues & competitions',
  'Federations & associations',
  'Governing bodies',
  'Player representatives',
]

const COMPANIES = [
  'Exhibitors & vendors',
  'Brands & sponsors',
  'Commercial partners',
  'Technology providers',
  'Investors & financial institutions',
]

const TIMELINE_STEPS = [
  { icon: Rocket, label: 'Enrollment', time: '6 weeks before' },
  { icon: Handshake, label: 'Matching', time: '4 weeks before' },
  { icon: CalendarCheck, label: 'Schedule Confirmation', time: '2 weeks before' },
  { icon: Trophy, label: 'Event Week + Year-Round', time: 'Ongoing' },
]

const INTEREST_OPTIONS = [
  'Rightsholder',
  'Company / Brand',
  'Investor',
  'Technology Provider',
  'Other',
]

export default function DealNetwork() {
  useScrollAnimations()
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', company: '', role: '',
    interest: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`[Deal Network Interest] ${form.firstName} ${form.lastName}`)
    const body = encodeURIComponent([
      `Name: ${form.firstName} ${form.lastName}`,
      `Email: ${form.email}`,
      `Company: ${form.company}`,
      `Role: ${form.role}`,
      `Interest: ${form.interest}`,
      '',
      'Message:',
      form.message,
      '',
      '---',
      'Sent via soccerex.com Deal Network interest form',
    ].filter(Boolean).join('\n'))
    window.location.href = `mailto:partner@soccerex.com?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  /* shared input style */
  const inputStyle = {
    width: '100%', padding: '13px 14px', fontSize: '0.92rem',
    fontFamily: 'Inter, sans-serif', background: '#f8f7f4',
    border: '1px solid rgba(9,32,62,0.12)', borderRadius: '8px',
    color: '#09203e', outline: 'none', transition: 'border-color 0.2s',
  }
  const focusIn = (e) => { e.currentTarget.style.borderColor = '#bfb170' }
  const focusOut = (e) => { e.currentTarget.style.borderColor = 'rgba(9,32,62,0.12)' }

  return (
    <div style={{ background: '#050d1a' }}>

      {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden flex items-center justify-center" style={{ minHeight: '75vh' }}>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(5,13,26,0.6) 0%, rgba(9,32,62,0.8) 40%, rgba(5,13,26,0.95) 100%)',
        }} />
        <NetworkNodes color="#bfb170" nodeCount={30} opacity={0.15} />
        <div className="absolute pointer-events-none" style={{
          top: '15%', left: '50%', transform: 'translateX(-50%)',
          width: '800px', height: '800px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(191,177,112,0.12) 0%, transparent 60%)',
        }} />

        <div className="relative z-10 text-center" style={{ maxWidth: '900px', padding: 'clamp(140px,15vw,200px) clamp(24px,5vw,80px) clamp(60px,8vw,100px)' }}>
          <p className="section-label text-gold mb-5 fade-up">DEAL NETWORK</p>
          <h1 className="font-heading font-bold text-white leading-[1.05] mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)' }}>
            Structured Dealmaking,{' '}
            <span style={{ color: 'var(--color-gold)' }}>Not Just Networking.</span>
          </h1>
          <div className="fade-up mx-auto mb-8" style={{ width: '100px', height: '3px', background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }} />
          <p className="font-body text-white/70 leading-relaxed fade-up mx-auto mb-10" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.15rem)', maxWidth: '640px' }}>
            A structured dealmaking platform built on 30 years of trusted relationships in the global football business.
          </p>
          <Link to="#interest-form"
            onClick={(e) => { e.preventDefault(); document.getElementById('interest-form')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.12em] fade-up"
            style={{
              background: '#fff', color: '#09203e', padding: '16px 28px',
              fontSize: '0.82rem', textDecoration: 'none', borderRadius: '10px',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#bfb170' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
          >
            Register Interest <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <PixelDivider color="#f4f3f0" layers={4} height={90} speed={0.5} />

      {/* ═══ THE OPPORTUNITY ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(9,32,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10" style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div className="text-center mb-10">
            <p className="section-label mb-4 fade-up" style={{ color: '#09203e', fontWeight: 600 }}>THE OPPORTUNITY</p>
            <h2 className="font-heading font-bold leading-tight mb-6 fade-up" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', color: '#09203e' }}>
              Why the Deal Network{' '}
              <span style={{ color: '#bfb170' }}>Exists</span>
            </h2>
            <div className="fade-up mx-auto mb-8" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, #09203e, transparent)' }} />
          </div>
          <div className="fade-up" style={{
            borderLeft: '4px solid #bfb170', paddingLeft: '24px',
          }}>
            <p className="font-body leading-relaxed mb-5" style={{ fontSize: '1.05rem', color: '#333' }}>
              Football's most important deals happen through relationships. The decision-makers who run clubs, leagues, federations, and commercial operations need a structured environment that connects them to new opportunities with intention and preparation.
            </p>
            <p className="font-body leading-relaxed mb-5" style={{ fontSize: '1.05rem', color: '#333' }}>
              High-value participants expect to leave with actionable outcomes, not just business cards.
            </p>
            <p className="font-body leading-relaxed" style={{ fontSize: '1.05rem', color: '#333' }}>
              Soccerex already convenes the decision-makers. The Deal Network formalizes this into a premium, white-glove experience.
            </p>
          </div>
        </div>
      </section>

      <PixelDivider color="#eae8e4" layers={4} height={90} speed={0.5} />

      {/* ═══ HOW IT WORKS ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #09203e 0%, #0d2b52 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <NetworkNodes color="#bfb170" nodeCount={20} opacity={0.1} />
        <div className="relative z-10" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="text-center mb-16">
            <p className="section-label text-gold mb-4 fade-up">HOW IT WORKS</p>
            <h2 className="font-heading font-bold text-white leading-tight mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
              Engineered{' '}
              <span style={{ color: '#bfb170' }}>Introductions</span>
            </h2>
            <div className="fade-up mx-auto" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, #bfb170, transparent)' }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="scale-up" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(191,177,112,0.18)',
                    backdropFilter: 'blur(10px)',
                    padding: '36px 28px',
                    borderRadius: '16px',
                    height: '100%',
                    textAlign: 'center',
                    transition: 'transform 0.3s, border-color 0.3s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = 'rgba(191,177,112,0.5)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(191,177,112,0.18)' }}
                  >
                    <div style={{
                      width: '60px', height: '60px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #bfb170, #d4c78e)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 20px',
                    }}>
                      <Icon size={26} color="#09203e" strokeWidth={2} />
                    </div>
                    <h3 className="font-heading font-bold mb-3" style={{ fontSize: '1.15rem', color: '#fff' }}>{item.title}</h3>
                    <p className="font-body leading-relaxed" style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.65)' }}>{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <PixelDivider color="#0d2b52" layers={4} height={90} speed={0.5} />

      {/* ═══ THE TWO SIDES ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(9,32,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="text-center mb-14">
            <p className="section-label mb-4 fade-up" style={{ color: '#09203e', fontWeight: 600 }}>THE TWO SIDES</p>
            <h2 className="font-heading font-bold leading-tight mb-6 fade-up" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', color: '#09203e' }}>
              Supply Meets{' '}
              <span style={{ color: '#bfb170' }}>Demand</span>
            </h2>
            <div className="fade-up mx-auto" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, #09203e, transparent)' }} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Rightsholders */}
            <div className="slide-left">
              <div style={{
                background: '#fff', borderRadius: '16px',
                padding: 'clamp(28px,4vw,44px)',
                border: '1px solid rgba(9,32,62,0.08)',
                boxShadow: '0 20px 60px rgba(9,32,62,0.08)',
                height: '100%',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #bfb170, #d4c78e)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Trophy size={22} color="#09203e" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold" style={{ fontSize: '1.3rem', color: '#09203e' }}>Rightsholders</h3>
                    <p className="font-mono uppercase tracking-[0.1em]" style={{ fontSize: '0.65rem', color: '#bfb170', fontWeight: 600 }}>Supply Side</p>
                  </div>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px' }}>
                  {RIGHTSHOLDERS.map((item) => (
                    <li key={item} className="font-body flex items-center gap-3" style={{ padding: '10px 0', borderBottom: '1px solid rgba(9,32,62,0.06)', fontSize: '0.95rem', color: '#333' }}>
                      <ChevronRight size={14} color="#bfb170" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="font-body leading-relaxed" style={{ fontSize: '0.9rem', color: '#666' }}>
                  Invited and curated by Soccerex. They bring the assets, relationships, and deal interests that companies want access to. They do not pay.
                </p>
              </div>
            </div>

            {/* Companies */}
            <div className="slide-right">
              <div style={{
                background: '#fff', borderRadius: '16px',
                padding: 'clamp(28px,4vw,44px)',
                border: '1px solid rgba(9,32,62,0.08)',
                boxShadow: '0 20px 60px rgba(9,32,62,0.08)',
                height: '100%',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #09203e, #0d2b52)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Building2 size={22} color="#bfb170" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold" style={{ fontSize: '1.3rem', color: '#09203e' }}>Companies</h3>
                    <p className="font-mono uppercase tracking-[0.1em]" style={{ fontSize: '0.65rem', color: '#bfb170', fontWeight: 600 }}>Demand Side</p>
                  </div>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px' }}>
                  {COMPANIES.map((item) => (
                    <li key={item} className="font-body flex items-center gap-3" style={{ padding: '10px 0', borderBottom: '1px solid rgba(9,32,62,0.06)', fontSize: '0.95rem', color: '#333' }}>
                      <ChevronRight size={14} color="#bfb170" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="font-body leading-relaxed" style={{ fontSize: '0.9rem', color: '#666' }}>
                  Companies enroll in the Deal Network and pay to access structured introductions with matched rightsholders.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Digital Infrastructure subsection ─────────────────────────── */}
          <div className="fade-up" style={{ marginTop: '48px' }}>
            <div style={{
              background: 'rgba(9,32,62,0.05)', borderRadius: '16px',
              padding: 'clamp(28px,4vw,40px)',
              border: '1px solid rgba(9,32,62,0.1)',
            }}>
              <p className="font-mono uppercase tracking-[0.1em] mb-3" style={{ fontSize: '0.68rem', color: '#bfb170', fontWeight: 600 }}>DIGITAL INFRASTRUCTURE</p>
              <p className="font-body leading-relaxed" style={{ fontSize: '1rem', color: '#333' }}>
                A vertical focused on practical digital innovation in football: fan engagement, loyalty programs, digital ticketing, sponsorship measurement, and compliant monetization tools for clubs and leagues.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PixelDivider color="#eae8e4" layers={4} height={90} speed={0.5} />

      {/* ═══ TIMELINE ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #09203e 0%, #0d2b52 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <NetworkNodes color="#bfb170" nodeCount={15} opacity={0.08} />
        <div className="relative z-10" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="text-center mb-16">
            <p className="section-label text-gold mb-4 fade-up">TIMELINE</p>
            <h2 className="font-heading font-bold text-white leading-tight mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
              From Enrollment to{' '}
              <span style={{ color: '#bfb170' }}>Event Week</span>
            </h2>
            <div className="fade-up mx-auto" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, #bfb170, transparent)' }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIMELINE_STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.label} className="scale-up" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(191,177,112,0.18)',
                    backdropFilter: 'blur(10px)',
                    padding: '32px 24px',
                    borderRadius: '16px',
                    textAlign: 'center',
                    height: '100%',
                    transition: 'transform 0.3s, border-color 0.3s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = 'rgba(191,177,112,0.5)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(191,177,112,0.18)' }}
                  >
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #bfb170, #d4c78e)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}>
                      <Icon size={22} color="#09203e" strokeWidth={2} />
                    </div>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      border: '2px solid rgba(191,177,112,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 14px',
                    }}>
                      <span className="font-heading font-bold" style={{ fontSize: '0.85rem', color: '#bfb170' }}>{i + 1}</span>
                    </div>
                    <h3 className="font-heading font-bold mb-2" style={{ fontSize: '1.1rem', color: '#fff' }}>{step.label}</h3>
                    <p className="font-body" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)' }}>{step.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <PixelDivider color="#0d2b52" layers={4} height={90} speed={0.5} />

      {/* ═══ INTEREST FORM ══════════════════════════════════════════════════ */}
      <section id="interest-form" className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(9,32,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="text-center mb-12">
            <p className="section-label mb-4 fade-up" style={{ color: '#09203e', fontWeight: 600 }}>GET INVOLVED</p>
            <h2 className="font-heading font-bold leading-tight mb-4 fade-up" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#09203e' }}>
              Join the Deal{' '}
              <span style={{ color: '#bfb170' }}>Network</span>
            </h2>
            <div className="fade-up mx-auto mb-6" style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, transparent, #09203e, transparent)' }} />
            <p className="font-body fade-up" style={{ fontSize: '1rem', color: '#555' }}>
              Register your interest and our team will be in touch with next steps.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="fade-up" style={{
            background: '#fff', borderRadius: '16px',
            padding: 'clamp(28px,4vw,44px)',
            border: '1px solid rgba(9,32,62,0.08)',
            boxShadow: '0 20px 60px rgba(9,32,62,0.08)',
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="font-mono uppercase tracking-[0.1em] block mb-2" style={{ fontSize: '0.68rem', color: '#09203e', fontWeight: 600 }}>
                  First Name<span style={{ color: '#bfb170', marginLeft: '4px' }}>*</span>
                </label>
                <input type="text" required value={form.firstName}
                  onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))}
                  style={inputStyle} onFocus={focusIn} onBlur={focusOut}
                />
              </div>
              <div>
                <label className="font-mono uppercase tracking-[0.1em] block mb-2" style={{ fontSize: '0.68rem', color: '#09203e', fontWeight: 600 }}>
                  Last Name<span style={{ color: '#bfb170', marginLeft: '4px' }}>*</span>
                </label>
                <input type="text" required value={form.lastName}
                  onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
                  style={inputStyle} onFocus={focusIn} onBlur={focusOut}
                />
              </div>
              <div>
                <label className="font-mono uppercase tracking-[0.1em] block mb-2" style={{ fontSize: '0.68rem', color: '#09203e', fontWeight: 600 }}>
                  Email<span style={{ color: '#bfb170', marginLeft: '4px' }}>*</span>
                </label>
                <input type="email" required value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  style={inputStyle} onFocus={focusIn} onBlur={focusOut}
                />
              </div>
              <div>
                <label className="font-mono uppercase tracking-[0.1em] block mb-2" style={{ fontSize: '0.68rem', color: '#09203e', fontWeight: 600 }}>
                  Company<span style={{ color: '#bfb170', marginLeft: '4px' }}>*</span>
                </label>
                <input type="text" required value={form.company}
                  onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                  style={inputStyle} onFocus={focusIn} onBlur={focusOut}
                />
              </div>
              <div>
                <label className="font-mono uppercase tracking-[0.1em] block mb-2" style={{ fontSize: '0.68rem', color: '#09203e', fontWeight: 600 }}>
                  Role
                </label>
                <input type="text" value={form.role}
                  onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                  style={inputStyle} onFocus={focusIn} onBlur={focusOut}
                />
              </div>
              <div>
                <label className="font-mono uppercase tracking-[0.1em] block mb-2" style={{ fontSize: '0.68rem', color: '#09203e', fontWeight: 600 }}>
                  I'm Interested As<span style={{ color: '#bfb170', marginLeft: '4px' }}>*</span>
                </label>
                <select required value={form.interest}
                  onChange={e => setForm(p => ({ ...p, interest: e.target.value }))}
                  style={{ ...inputStyle, appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath d=\'M2 4l4 4 4-4\' fill=\'none\' stroke=\'%2309203e\' stroke-width=\'1.5\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                  onFocus={focusIn} onBlur={focusOut}
                >
                  <option value="" disabled>Select one...</option>
                  {INTEREST_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-6">
              <label className="font-mono uppercase tracking-[0.1em] block mb-2" style={{ fontSize: '0.68rem', color: '#09203e', fontWeight: 600 }}>
                Message
              </label>
              <textarea rows={4} value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                placeholder="Tell us about your interests or objectives..."
                style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                onFocus={focusIn} onBlur={focusOut}
              />
            </div>
            <button type="submit"
              className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em] w-full justify-center"
              style={{
                background: '#bfb170', color: '#09203e', padding: '16px 36px',
                fontSize: '0.85rem', border: 'none', cursor: 'pointer',
                borderRadius: '8px', transition: 'all 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#d4c78e' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#bfb170' }}
            >
              {submitted ? 'Sent!' : 'Submit Interest'} {!submitted && <ArrowRight size={16} />}
            </button>
          </form>

          {/* ─── Launch Note ───────────────────────────────────────────────── */}
          <div className="fade-up text-center" style={{ marginTop: '32px' }}>
            <p className="font-body" style={{ fontSize: '0.92rem', color: '#666', lineHeight: 1.7 }}>
              Launching at{' '}
              <span style={{ color: '#09203e', fontWeight: 600 }}>Soccerex Amsterdam, May 2026</span>.
              {' '}Complimentary for Amsterdam; commercial pricing from Miami onward.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
