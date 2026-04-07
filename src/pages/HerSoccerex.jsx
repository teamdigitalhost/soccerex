import { useEffect, useState } from 'react'
import { ArrowRight, Users, Eye, Radio, Film, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
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

const PILLARS = [
  {
    icon: Users,
    title: 'Panel Participation',
    desc: 'Dedicated women-focused panels at every Soccerex event addressing commercialization, governance, investment, and leadership. Women\'s voices centered in every session.',
  },
  {
    icon: Eye,
    title: 'Commercial Visibility',
    desc: 'Presenting sponsors, category sponsors, and exhibitors aligned with the growth of women\'s sport. Sponsor visibility across HerSoccerex programming, media assets, and the broader Soccerex event footprint.',
  },
  {
    icon: Radio,
    title: 'HerSoccerex Connect',
    desc: 'Year-round webinars, invite-only roundtables, a membership community, and a dedicated newsletter keeping women\'s football stakeholders engaged between events.',
  },
  {
    icon: Film,
    title: 'Representation & Media',
    desc: 'Executive interviews, panel highlight clips, data-driven editorial, and a growing content library that strengthens the HerSoccerex brand year-round.',
  },
]

const LEADERS = [
  { title: 'Women as Leaders', desc: 'Elevating female executives and decision-makers across the football industry.' },
  { title: 'Federation Decision-Makers', desc: 'National association leaders shaping governance and policy worldwide.' },
  { title: 'Commercial Directors', desc: 'Revenue architects driving sponsorship, licensing, and brand partnerships.' },
  { title: 'Board Members', desc: 'Directors and trustees influencing institutional strategy and oversight.' },
  { title: 'Investors', desc: 'Private equity, venture capital, and institutional investors deploying into women\'s football.' },
  { title: 'Media Leaders', desc: 'Broadcasters, digital platforms, and content creators amplifying the game\'s reach.' },
  { title: 'Club Owners', desc: 'Ownership groups building sustainable, high-performance women\'s football organizations.' },
  { title: 'Innovators & Tech Leaders', desc: 'Technology entrepreneurs transforming performance, fan experience, and operations.' },
]

const VISION = [
  'The global meeting place for women\'s football investment, governance, and commercial leadership',
  'The leading intellectual capital hub for women\'s football economics',
  'The neutral forum for governance, safeguarding, and institutional standards',
  'The industry\'s foundational reference point for women\'s football commercialization',
  'A standalone pillar within the Soccerex platform with a dedicated global partner network',
]

const INTEREST_OPTIONS = [
  'Federation/League Leader',
  'Club Owner/Executive',
  'Investor',
  'Brand/Sponsor',
  'Media/Content',
  'Speaker',
  'Other',
]

export default function HerSoccerex() {
  useScrollAnimations()
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', company: '', role: '', interest: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`[HerSoccerex Interest] ${form.firstName} ${form.lastName}`)
    const body = encodeURIComponent([
      `Name: ${form.firstName} ${form.lastName}`,
      `Email: ${form.email}`,
      `Company: ${form.company}`,
      `Role: ${form.role}`,
      `Interested as: ${form.interest}`,
      '',
      'Message:',
      form.message,
      '',
      '---',
      'Sent via soccerex.com/hersoccerex interest form',
    ].filter(Boolean).join('\n'))
    window.location.href = `mailto:partner@soccerex.com?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  const inputStyle = {
    width: '100%', padding: '13px 14px', fontSize: '0.92rem',
    fontFamily: 'Inter, sans-serif', background: '#f8f7f4',
    border: '1px solid rgba(9,32,62,0.12)', borderRadius: '8px',
    color: '#09203e', outline: 'none', transition: 'border-color 0.2s',
  }

  const focusHandler = (e) => { e.currentTarget.style.borderColor = '#bfb170' }
  const blurHandler = (e) => { e.currentTarget.style.borderColor = 'rgba(9,32,62,0.12)' }

  return (
    <div style={{ background: '#050d1a' }}>

      {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden flex items-center justify-center" style={{ minHeight: '85vh' }}>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(5,13,26,0.6) 0%, rgba(9,32,62,0.8) 40%, rgba(5,13,26,0.95) 100%)',
        }} />
        <NetworkNodes color="#bfb170" nodeCount={30} opacity={0.15} />
        <div className="absolute pointer-events-none" style={{
          top: '15%', left: '50%', transform: 'translateX(-50%)',
          width: '800px', height: '800px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(191,177,112,0.1) 0%, transparent 60%)',
        }} />

        <div className="relative z-10 text-center" style={{ maxWidth: '900px', padding: 'clamp(140px,15vw,200px) clamp(24px,5vw,80px) clamp(60px,8vw,100px)' }}>
          <p className="section-label text-gold mb-5 fade-up">HERSOCCEREX</p>
          <h1 className="font-heading font-bold text-white leading-[1.05] mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)' }}>
            Women's Football Is Entering Its{' '}
            <span style={{ color: 'var(--color-gold)' }}>Commercialization Era.</span>
          </h1>
          <div className="fade-up mx-auto mb-8" style={{ width: '100px', height: '3px', background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }} />
          <p className="font-body text-white/70 leading-relaxed fade-up mx-auto mb-10" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.15rem)', maxWidth: '680px' }}>
            A dedicated vertical within the Soccerex platform focused on the business, investment, governance, and leadership ecosystem of women's football.
          </p>
          <div className="fade-up">
            <a href="#interest-form"
              className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.12em]"
              style={{ background: '#bfb170', color: '#09203e', padding: '16px 32px', fontSize: '0.85rem', textDecoration: 'none', borderRadius: '10px', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#d4c78e' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#bfb170' }}
            >
              Register Your Interest <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <PixelDivider color="#f4f3f0" layers={4} height={90} speed={0.5} />

      {/* ═══ THE MARKET SHIFT ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(9,32,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="text-center mb-16">
            <p className="section-label mb-4 fade-up" style={{ color: '#09203e', fontWeight: 600 }}>THE MARKET SHIFT</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            {/* Left column */}
            <div className="slide-left">
              <div style={{ borderLeft: '4px solid #bfb170', paddingLeft: '24px', marginBottom: '28px' }}>
                <h2 className="font-heading font-bold leading-tight fade-up" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#09203e' }}>
                  A Structural Market Shift
                </h2>
              </div>
              <p className="font-body leading-relaxed mb-6 fade-up" style={{ fontSize: '1.05rem', color: '#333' }}>
                Women's football is shifting from development-driven momentum to structured commercial expansion.
              </p>
              <ul className="space-y-4 fade-up">
                {[
                  'Media rights valuations growing across major leagues and tournaments.',
                  'Institutional and private capital actively deploying into women\'s football.',
                  'Expanding sponsor investment mandates tied to women\'s sport.',
                  'League professionalization and governance reform accelerating globally.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <ChevronRight size={18} style={{ color: '#bfb170', flexShrink: 0, marginTop: '3px' }} />
                    <span className="font-body" style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.7 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Right column */}
            <div className="slide-right">
              <div style={{ borderLeft: '4px solid #bfb170', paddingLeft: '24px', marginBottom: '28px' }}>
                <h2 className="font-heading font-bold leading-tight fade-up" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#09203e' }}>
                  Why Soccerex Is Positioned to Lead
                </h2>
              </div>
              <ul className="space-y-4 fade-up">
                {[
                  '30 years as the neutral global convening platform for football business.',
                  'Existing relationships with federations, leagues, clubs, and commercial partners.',
                  'Integrated sponsorship architecture already serving major global brands.',
                  'Credibility to lead governance and safeguarding conversations.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <ChevronRight size={18} style={{ color: '#bfb170', flexShrink: 0, marginTop: '3px' }} />
                    <span className="font-body" style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.7 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <PixelDivider color="#eae8e4" layers={4} height={90} speed={0.5} />

      {/* ═══ BIG QUOTE ═════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #09203e 0%, #0d2b52 100%)', padding: 'clamp(80px,10vw,120px) clamp(24px,5vw,80px)' }}>
        <NetworkNodes color="#bfb170" nodeCount={15} opacity={0.08} />
        <div className="relative z-10 text-center fade-up" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="mx-auto mb-6" style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, transparent, #bfb170, transparent)' }} />
          <blockquote className="font-heading font-bold text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)' }}>
            "Not an initiative. Not a thematic track.{' '}
            <span style={{ color: '#bfb170' }}>A pillar.</span>"
          </blockquote>
          <div className="mt-6 mx-auto" style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, transparent, #bfb170, transparent)' }} />
        </div>
      </section>

      <PixelDivider color="#0d2b52" layers={4} height={90} speed={0.5} />

      {/* ═══ FOUR PILLARS ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #09203e 0%, #0d2b52 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <NetworkNodes color="#bfb170" nodeCount={20} opacity={0.1} />
        <div className="relative z-10" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="text-center mb-16">
            <p className="section-label text-gold mb-4 fade-up">WHAT WE DO</p>
            <h2 className="font-heading font-bold text-white leading-tight mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
              Four Pillars of{' '}
              <span style={{ color: '#bfb170' }}>HerSoccerex</span>
            </h2>
            <div className="fade-up mx-auto" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, #bfb170, transparent)' }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <div key={pillar.title} className="scale-up" style={{ transitionDelay: `${i * 80}ms` }}>
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
                    <h3 className="font-heading font-bold mb-3" style={{ fontSize: '1.15rem', color: '#fff' }}>{pillar.title}</h3>
                    <p className="font-body leading-relaxed" style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.65)' }}>{pillar.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <PixelDivider color="#0d2b52" layers={4} height={90} speed={0.5} />

      {/* ═══ LEADERSHIP GROUPS ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(9,32,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="text-center mb-16">
            <p className="section-label mb-4 fade-up" style={{ color: '#09203e', fontWeight: 600 }}>WHO IT'S FOR</p>
            <h2 className="font-heading font-bold leading-tight mb-6 fade-up" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', color: '#09203e' }}>
              Leadership{' '}
              <span style={{ color: '#bfb170' }}>Groups</span>
            </h2>
            <div className="fade-up mx-auto" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, #09203e, transparent)' }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {LEADERS.map((leader, i) => (
              <div key={leader.title} className="scale-up" style={{ transitionDelay: `${i * 60}ms` }}>
                <div style={{
                  background: '#fff',
                  border: '1px solid rgba(9,32,62,0.08)',
                  borderRadius: '16px',
                  padding: '32px 24px',
                  height: '100%',
                  boxShadow: '0 8px 30px rgba(9,32,62,0.06)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 50px rgba(9,32,62,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(9,32,62,0.06)' }}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #bfb170, #d4c78e)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '16px',
                  }}>
                    <span className="font-heading font-bold" style={{ fontSize: '1rem', color: '#09203e' }}>{i + 1}</span>
                  </div>
                  <h3 className="font-heading font-bold mb-2" style={{ fontSize: '1.05rem', color: '#09203e' }}>{leader.title}</h3>
                  <p className="font-body leading-relaxed" style={{ fontSize: '0.88rem', color: '#666' }}>{leader.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PixelDivider color="#eae8e4" layers={4} height={90} speed={0.5} />

      {/* ═══ LONG-TERM VISION ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #09203e 0%, #0d2b52 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <NetworkNodes color="#bfb170" nodeCount={20} opacity={0.1} />
        <div className="relative z-10" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="text-center mb-16">
            <p className="section-label text-gold mb-4 fade-up">LONG-TERM VISION</p>
            <h2 className="font-heading font-bold text-white leading-tight mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
              Where HerSoccerex{' '}
              <span style={{ color: '#bfb170' }}>Is Going</span>
            </h2>
            <div className="fade-up mx-auto" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, #bfb170, transparent)' }} />
          </div>
          <div className="space-y-5">
            {VISION.map((item, i) => (
              <div key={i} className="fade-up" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="flex items-start gap-5" style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(191,177,112,0.15)',
                  borderRadius: '14px',
                  padding: '24px 28px',
                  transition: 'border-color 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(191,177,112,0.4)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(191,177,112,0.15)' }}
                >
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #bfb170, #d4c78e)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span className="font-heading font-bold" style={{ fontSize: '1.1rem', color: '#09203e' }}>{i + 1}</span>
                  </div>
                  <p className="font-body leading-relaxed" style={{ fontSize: '1.02rem', color: 'rgba(255,255,255,0.8)', paddingTop: '8px' }}>{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PixelDivider color="#0d2b52" layers={4} height={90} speed={0.5} />

      {/* ═══ INTEREST FORM ═════════════════════════════════════════════════ */}
      <section id="interest-form" className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(9,32,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="text-center mb-12">
            <p className="section-label mb-4 fade-up" style={{ color: '#09203e', fontWeight: 600 }}>GET INVOLVED</p>
            <h2 className="font-heading font-bold leading-tight mb-4 fade-up" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#09203e' }}>
              Be Part of{' '}
              <span style={{ color: '#bfb170' }}>HerSoccerex</span>
            </h2>
            <div className="fade-up mx-auto mb-6" style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, transparent, #09203e, transparent)' }} />
            <p className="font-body fade-up" style={{ fontSize: '1rem', color: '#555' }}>
              Register your interest and our partnerships team will be in touch.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="fade-up" style={{
            background: '#fff',
            borderRadius: '16px',
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
                  style={inputStyle} onFocus={focusHandler} onBlur={blurHandler}
                />
              </div>
              <div>
                <label className="font-mono uppercase tracking-[0.1em] block mb-2" style={{ fontSize: '0.68rem', color: '#09203e', fontWeight: 600 }}>
                  Last Name<span style={{ color: '#bfb170', marginLeft: '4px' }}>*</span>
                </label>
                <input type="text" required value={form.lastName}
                  onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
                  style={inputStyle} onFocus={focusHandler} onBlur={blurHandler}
                />
              </div>
              <div>
                <label className="font-mono uppercase tracking-[0.1em] block mb-2" style={{ fontSize: '0.68rem', color: '#09203e', fontWeight: 600 }}>
                  Email<span style={{ color: '#bfb170', marginLeft: '4px' }}>*</span>
                </label>
                <input type="email" required value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  style={inputStyle} onFocus={focusHandler} onBlur={blurHandler}
                />
              </div>
              <div>
                <label className="font-mono uppercase tracking-[0.1em] block mb-2" style={{ fontSize: '0.68rem', color: '#09203e', fontWeight: 600 }}>
                  Company<span style={{ color: '#bfb170', marginLeft: '4px' }}>*</span>
                </label>
                <input type="text" required value={form.company}
                  onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                  style={inputStyle} onFocus={focusHandler} onBlur={blurHandler}
                />
              </div>
              <div>
                <label className="font-mono uppercase tracking-[0.1em] block mb-2" style={{ fontSize: '0.68rem', color: '#09203e', fontWeight: 600 }}>
                  Role
                </label>
                <input type="text" value={form.role}
                  onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                  style={inputStyle} onFocus={focusHandler} onBlur={blurHandler}
                />
              </div>
              <div>
                <label className="font-mono uppercase tracking-[0.1em] block mb-2" style={{ fontSize: '0.68rem', color: '#09203e', fontWeight: 600 }}>
                  I'm Interested As<span style={{ color: '#bfb170', marginLeft: '4px' }}>*</span>
                </label>
                <select required value={form.interest}
                  onChange={e => setForm(p => ({ ...p, interest: e.target.value }))}
                  style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%2309203e\' d=\'M6 8L1 3h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                  onFocus={focusHandler} onBlur={blurHandler}
                >
                  <option value="">Select one...</option>
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
                placeholder="Tell us about your interest in HerSoccerex..."
                style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                onFocus={focusHandler} onBlur={blurHandler}
              />
            </div>
            <button type="submit" className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em] w-full justify-center"
              style={{ background: '#bfb170', color: '#09203e', padding: '16px 36px', fontSize: '0.85rem', border: 'none', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#d4c78e' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#bfb170' }}
            >
              {submitted ? 'Sent!' : 'Register Interest'} {!submitted && <ArrowRight size={16} />}
            </button>
          </form>
        </div>
      </section>

      <PixelDivider color="#eae8e4" layers={4} height={90} speed={0.5} />

      {/* ═══ LAUNCH NOTE ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #09203e 0%, #0d2b52 100%)', padding: 'clamp(80px,10vw,120px) clamp(24px,5vw,80px)' }}>
        <NetworkNodes color="#bfb170" nodeCount={15} opacity={0.08} />
        <div className="relative z-10 text-center fade-up" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p className="section-label text-gold mb-6">COMING SOON</p>
          <p className="font-body text-white/80 leading-relaxed mb-4" style={{ fontSize: '1.1rem' }}>
            HerSoccerex programming debuts at <strong style={{ color: '#bfb170' }}>Amsterdam 2026</strong>.
          </p>
          <p className="font-body text-white/80 leading-relaxed mb-8" style={{ fontSize: '1.1rem' }}>
            HerSoccerex Connect membership launches ahead of <strong style={{ color: '#bfb170' }}>Miami</strong>.
          </p>
          <div className="mx-auto" style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, transparent, #bfb170, transparent)' }} />
        </div>
      </section>

    </div>
  )
}
