import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Rocket, TrendingUp, Crown, Cpu, DollarSign, Building2,
  User, Mail, MessageCircle, ChevronRight, Sparkles, Lock, Check,
} from 'lucide-react'
import NetworkNodes from '../animations/NetworkNodes'
import PixelDivider from '../components/PixelDivider'

// Scroll animations (same pattern as other pages)
function useScrollAnimations() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }) },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.fade-up, .slide-left, .slide-right, .scale-up').forEach((el) => {
      if (!el.classList.contains('visible')) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])
}

// Tier data
const TIERS = [
  {
    tier: 1,
    title: 'Open Application',
    badge: 'FREE ENTRY',
    badgeColor: '#22c55e',
    icon: Rocket,
    desc: 'Merit-based. Top 5 pitches on main stage. Winner receives featured speaking slot, media exposure, and extended platform visibility.',
  },
  {
    tier: 2,
    title: 'Capital Access Track',
    badge: 'PARTICIPATION FEE',
    badgeColor: '#bfb170',
    icon: TrendingUp,
    desc: 'Curated 1:1 investor meetings, structured pitch rooms, private capital roundtables, pre-event preparation, and investor profile matching.',
  },
  {
    tier: 3,
    title: 'Institutional Capital Layer',
    badge: 'BY INVITATION',
    badgeColor: '#a78bfa',
    icon: Crown,
    desc: 'Official Capital Committee with named PE, VC, and strategic operators. Institutional investor roundtables and sovereign capital pathways.',
  },
]

// Audience segments
const AUDIENCES = [
  {
    icon: Cpu,
    title: 'Football Tech Startups',
    desc: 'Companies with real traction in sports tech, data, analytics, and fan engagement.',
  },
  {
    icon: DollarSign,
    title: 'Investors & VCs',
    desc: 'PE, VC, and family offices deploying capital in football.',
  },
  {
    icon: Building2,
    title: 'Corporate Innovation',
    desc: 'Clubs, leagues, and brands scouting technology partnerships.',
  },
]

// Applicant type options
const APPLICANT_TYPES = [
  'Startup Founder',
  'Investor / VC',
  'Corporate Innovation',
  'Mentor / Advisor',
  'Other',
]

// Form field helper (matches Contact page pattern)
function FormField({ icon: Icon, label, placeholder, type = 'text', required, textarea, rows = 3, value, onChange }) {
  return (
    <div>
      <label className="font-mono uppercase tracking-[0.1em] block mb-2" style={{ fontSize: '0.68rem', color: '#09203e', fontWeight: 600 }}>
        {label}{required && <span style={{ color: '#bfb170', marginLeft: '4px' }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && !textarea && (
          <Icon size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#bfb170', pointerEvents: 'none' }} />
        )}
        {textarea ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            required={required}
            style={{
              width: '100%', padding: '13px 14px',
              fontSize: '0.92rem', fontFamily: 'Inter, sans-serif',
              background: '#f8f7f4',
              border: '1px solid rgba(9,32,62,0.12)',
              borderRadius: '8px', color: '#09203e',
              outline: 'none', transition: 'border-color 0.2s, background 0.2s',
              resize: 'vertical', minHeight: '100px',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#bfb170'; e.currentTarget.style.background = '#fff' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(9,32,62,0.12)'; e.currentTarget.style.background = '#f8f7f4' }}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            style={{
              width: '100%', padding: '13px 14px 13px 38px',
              fontSize: '0.92rem', fontFamily: 'Inter, sans-serif',
              background: '#f8f7f4',
              border: '1px solid rgba(9,32,62,0.12)',
              borderRadius: '8px', color: '#09203e',
              outline: 'none', transition: 'border-color 0.2s, background 0.2s',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#bfb170'; e.currentTarget.style.background = '#fff' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(9,32,62,0.12)'; e.currentTarget.style.background = '#f8f7f4' }}
          />
        )}
      </div>
    </div>
  )
}

export default function ThePitch() {
  useScrollAnimations()
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const [form, setForm] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const lines = [
      'The Pitch Application',
      '',
      `Name: ${form.firstName || ''} ${form.lastName || ''}`.trim(),
      `Email: ${form.email || ''}`,
      `Company: ${form.company || ''}`,
      `Role: ${form.role || ''}`,
      `Applying as: ${form.applicantType || ''}`,
    ]
    if (form.description) {
      lines.push('')
      lines.push('Company / Fund Description:')
      lines.push(form.description)
    }
    if (form.message) {
      lines.push('')
      lines.push('Message:')
      lines.push(form.message)
    }
    lines.push('')
    lines.push('---')
    lines.push('Sent via soccerex.com/the-pitch')

    const subject = encodeURIComponent(`[The Pitch] Application from ${form.firstName || ''} ${form.lastName || ''}`.trim())
    const body = encodeURIComponent(lines.join('\n'))
    window.location.href = `mailto:partner@soccerex.com?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  return (
    <div style={{ background: '#050d1a' }}>

      {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden flex items-center justify-center" style={{ minHeight: '80vh' }}>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at top, #0d2b52 0%, #050d1a 70%)',
        }} />
        <NetworkNodes color="#bfb170" nodeCount={35} opacity={0.15} />
        <div className="absolute pointer-events-none" style={{ top: '10%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '800px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,177,112,0.1) 0%, transparent 60%)' }} />

        <div className="relative z-10 text-center" style={{ maxWidth: '900px', padding: 'clamp(140px,15vw,200px) clamp(24px,5vw,80px) clamp(80px,10vw,120px)' }}>
          <p className="section-label text-gold mb-6 fade-up">THE PITCH</p>
          <h1 className="font-heading font-bold text-white leading-[1.05] mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.8rem)' }}>
            Where Football Innovation Meets{' '}
            <span style={{ color: 'var(--color-gold)' }}>Institutional Capital.</span>
          </h1>
          <div className="fade-up mx-auto mb-6" style={{ width: '100px', height: '3px', background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }} />
          <p className="font-body text-white/70 leading-relaxed fade-up mx-auto" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.15rem)', maxWidth: '700px' }}>
            Football startups with real traction need more than exposure and mentorship. They need structured access to institutional capital and investor matchmaking.
          </p>
        </div>
      </section>

      <PixelDivider color="#f4f3f0" layers={4} height={90} speed={0.5} />

      {/* ═══ THE OPPORTUNITY ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(9,32,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p className="section-label mb-4 fade-up text-center" style={{ color: '#09203e', fontWeight: 600 }}>THE OPPORTUNITY</p>
          <h2 className="font-heading font-bold leading-tight mb-4 fade-up text-center" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#09203e' }}>
            From Visibility to <span style={{ color: '#bfb170' }}>Funded</span>
          </h2>
          <div className="fade-up mx-auto mb-10" style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, transparent, #09203e, transparent)' }} />

          <p className="font-body leading-relaxed mb-5 slide-left" style={{ fontSize: '1.1rem', color: '#333', fontWeight: 500, textAlign: 'center' }}>
            Soccerex has the network, credibility, and institutional relationships to create a true capital marketplace for football technology.
          </p>
          <p className="font-body leading-relaxed slide-right" style={{ fontSize: '1.05rem', color: '#555', textAlign: 'center' }}>
            The Pitch is a three-layer structure designed to move startups from visibility to funded.
          </p>
        </div>
      </section>

      <PixelDivider color="#eae8e4" layers={4} height={90} speed={0.5} />

      {/* ═══ THREE TIERS ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #061729 0%, #09203e 50%, #0e2a4f 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <NetworkNodes color="#bfb170" nodeCount={30} opacity={0.1} />
        <div className="absolute pointer-events-none" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,177,112,0.06) 0%, transparent 70%)' }} />

        <div className="relative z-10" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p className="section-label text-gold mb-4 fade-up text-center">THREE TIERS</p>
          <h2 className="font-heading font-bold text-white leading-tight mb-4 fade-up text-center" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            A Structured Path to <span style={{ color: 'var(--color-gold)' }}>Capital</span>
          </h2>
          <div className="fade-up mx-auto mb-14" style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {TIERS.map((t, i) => {
              const Icon = t.icon
              return (
                <div key={t.tier} className="scale-up transition-all duration-300" style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(191,177,112,0.15)',
                  borderRadius: '16px',
                  padding: 'clamp(28px,3vw,40px)',
                  backdropFilter: 'blur(10px)',
                  transitionDelay: `${i * 100}ms`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(191,177,112,0.08)'; e.currentTarget.style.borderColor = 'rgba(191,177,112,0.35)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(191,177,112,0.15)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  {/* Tier number watermark */}
                  <div className="absolute pointer-events-none select-none" style={{
                    right: '-10px', top: '-20px', fontFamily: 'Space Grotesk', fontWeight: 800,
                    fontSize: '8rem', lineHeight: 1, color: 'rgba(191,177,112,0.04)',
                  }}>{t.tier}</div>

                  {/* Badge */}
                  <div className="mb-5" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '5px 12px', borderRadius: '6px',
                    background: `${t.badgeColor}15`,
                    border: `1px solid ${t.badgeColor}40`,
                  }}>
                    {t.tier === 3 && <Lock size={11} style={{ color: t.badgeColor }} />}
                    <span className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: '0.62rem', color: t.badgeColor, fontWeight: 700 }}>
                      {t.badge}
                    </span>
                  </div>

                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{
                    background: 'linear-gradient(135deg, rgba(191,177,112,0.15), rgba(9,32,62,0.3))',
                    border: '1px solid rgba(191,177,112,0.25)',
                  }}>
                    <Icon size={24} style={{ color: '#bfb170' }} />
                  </div>

                  <p className="font-mono uppercase tracking-[0.12em] mb-2" style={{ fontSize: '0.68rem', color: '#bfb170', fontWeight: 600 }}>
                    Tier {t.tier}
                  </p>
                  <h3 className="font-heading font-bold text-white mb-4" style={{ fontSize: '1.3rem' }}>
                    {t.title}
                  </h3>
                  <p className="font-body text-white/60 leading-relaxed" style={{ fontSize: '0.95rem' }}>
                    {t.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <PixelDivider color="#061729" layers={4} height={90} speed={0.6} />

      {/* ═══ WHO IT'S FOR ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(9,32,62,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.025) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p className="section-label mb-4 fade-up text-center" style={{ color: '#09203e', fontWeight: 600 }}>WHO IT'S FOR</p>
          <h2 className="font-heading font-bold leading-tight mb-4 fade-up text-center" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#09203e' }}>
            Built for the <span style={{ color: '#bfb170' }}>Ecosystem</span>
          </h2>
          <div className="fade-up mx-auto mb-14" style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, transparent, #09203e, transparent)' }} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AUDIENCES.map((a, i) => {
              const Icon = a.icon
              return (
                <div key={a.title} className="scale-up transition-all duration-300" style={{
                  background: '#fff', borderRadius: '14px', padding: '32px 28px',
                  border: '1px solid #e8e5e0', transitionDelay: `${i * 80}ms`,
                  boxShadow: '0 4px 20px rgba(9,32,62,0.04)',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(9,32,62,0.12)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(9,32,62,0.04)' }}
                >
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{
                    background: 'linear-gradient(135deg, rgba(191,177,112,0.15), rgba(9,32,62,0.1))',
                    border: '1px solid rgba(191,177,112,0.3)',
                  }}>
                    <Icon size={24} style={{ color: '#09203e' }} />
                  </div>
                  <h3 className="font-heading font-semibold mb-3" style={{ color: '#09203e', fontSize: '1.15rem' }}>{a.title}</h3>
                  <p className="font-body leading-relaxed" style={{ color: '#666', fontSize: '0.95rem' }}>{a.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <PixelDivider color="#eae8e4" layers={4} height={90} speed={0.5} />

      {/* ═══ INTEREST FORM ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #09203e 0%, #0d2b52 100%)', padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)' }}>
        <NetworkNodes color="#bfb170" nodeCount={20} opacity={0.1} />
        <div className="relative z-10" style={{ maxWidth: '720px', margin: '0 auto' }}>
          <p className="section-label text-gold mb-4 fade-up text-center">APPLY NOW</p>
          <h2 className="font-heading font-bold text-white leading-tight mb-4 fade-up text-center text-glow" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Apply to <span style={{ color: '#bfb170' }}>The Pitch</span>
          </h2>
          <div className="fade-up mx-auto mb-10" style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, transparent, #bfb170, transparent)' }} />

          <form onSubmit={handleSubmit} className="fade-up" style={{
            background: '#fff',
            borderRadius: '16px',
            padding: 'clamp(28px,4vw,48px)',
            border: '1px solid rgba(9,32,62,0.08)',
            boxShadow: '0 20px 60px rgba(9,32,62,0.08)',
          }}>
            {/* Name row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField icon={User} label="First Name" required placeholder="First name" value={form.firstName || ''} onChange={(v) => updateField('firstName', v)} />
              <FormField icon={User} label="Last Name" required placeholder="Last name" value={form.lastName || ''} onChange={(v) => updateField('lastName', v)} />
            </div>

            {/* Email + Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField icon={Mail} label="Email" type="email" required placeholder="you@company.com" value={form.email || ''} onChange={(v) => updateField('email', v)} />
              <FormField icon={Building2} label="Company" required placeholder="Company or fund name" value={form.company || ''} onChange={(v) => updateField('company', v)} />
            </div>

            {/* Role + Applicant type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField icon={User} label="Role" required placeholder="Your title or position" value={form.role || ''} onChange={(v) => updateField('role', v)} />
              <div>
                <label className="font-mono uppercase tracking-[0.1em] block mb-2" style={{ fontSize: '0.68rem', color: '#09203e', fontWeight: 600 }}>
                  I'm Applying As<span style={{ color: '#bfb170', marginLeft: '4px' }}>*</span>
                </label>
                <select
                  required
                  value={form.applicantType || ''}
                  onChange={(e) => updateField('applicantType', e.target.value)}
                  style={{
                    width: '100%', padding: '13px 14px',
                    fontSize: '0.92rem', fontFamily: 'Inter, sans-serif',
                    background: '#f8f7f4',
                    border: '1px solid rgba(9,32,62,0.12)',
                    borderRadius: '8px', color: '#09203e',
                    outline: 'none', transition: 'border-color 0.2s, background 0.2s',
                    cursor: 'pointer',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#bfb170'; e.currentTarget.style.background = '#fff' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(9,32,62,0.12)'; e.currentTarget.style.background = '#f8f7f4' }}
                >
                  <option value="">Select a category</option>
                  {APPLICANT_TYPES.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Optional description */}
            <div className="mb-4">
              <FormField
                icon={null}
                label="Brief Description of Your Company or Fund (Optional)"
                textarea
                rows={3}
                placeholder="What does your company or fund do?"
                value={form.description || ''}
                onChange={(v) => updateField('description', v)}
              />
            </div>

            {/* Message */}
            <div className="mb-6">
              <FormField
                icon={null}
                label="Message"
                required
                textarea
                rows={4}
                placeholder="Tell us why you want to participate in The Pitch..."
                value={form.message || ''}
                onChange={(v) => updateField('message', v)}
              />
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              <p className="font-body" style={{ fontSize: '0.78rem', color: '#888', maxWidth: '400px', lineHeight: 1.5 }}>
                By submitting, your application opens in your email client ready to send to{' '}
                <span style={{ color: '#bfb170', fontWeight: 600 }}>partner@soccerex.com</span>.
              </p>
              <button type="submit" className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em] whitespace-nowrap"
                style={{ background: '#bfb170', color: '#09203e', padding: '16px 36px', fontSize: '0.82rem', border: 'none', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.25s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#d4c78e' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#bfb170' }}
              >
                {submitted ? <><Check size={16} /> Sent</> : <>Apply Now <ArrowRight size={16} /></>}
              </button>
            </div>
          </form>
        </div>
      </section>

      <PixelDivider color="#eae8e4" layers={4} height={90} speed={0.6} />

      {/* ═══ LAUNCH NOTE / CTA ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #09203e 0%, #0e2a4f 50%, #061729 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)', textAlign: 'center' }}>
        <NetworkNodes color="#bfb170" nodeCount={25} opacity={0.1} />
        <div className="absolute pointer-events-none" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,177,112,0.08) 0%, transparent 60%)' }} />

        <div className="relative z-10" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="fade-up mb-6 flex justify-center">
            <Sparkles size={32} style={{ color: '#bfb170' }} />
          </div>
          <h2 className="font-heading font-bold text-white mb-4 fade-up text-glow" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            The Pitch Debuts at <span style={{ color: 'var(--color-gold)' }}>Soccerex Amsterdam</span>
          </h2>
          <div className="fade-up mx-auto mb-6" style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }} />
          <p className="font-body text-white/65 mb-10 fade-up leading-relaxed" style={{ fontSize: '1.05rem' }}>
            May 2026. The first edition of a new capital marketplace for football technology.
          </p>
          <div className="flex flex-wrap justify-center gap-4 fade-up">
            <Link to="/europe-2026" className="inline-flex items-center gap-2 font-body font-semibold text-sm uppercase tracking-widest px-8 py-4 cursor-pointer transition-all duration-300"
              style={{ background: 'var(--color-gold)', color: '#09203e', textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#d4c78e'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#bfb170'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Soccerex Europe 2026 <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 font-body font-semibold text-sm uppercase tracking-widest px-8 py-4 cursor-pointer transition-all duration-300"
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
