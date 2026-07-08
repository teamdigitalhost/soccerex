import { useEffect, useState } from 'react'
import { Mail, Newspaper, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react'
import NetworkNodes from '../animations/NetworkNodes'
import { useScrollAnimations } from '../lib/useScrollAnimations'

export default function SoccerExpert() {
  useScrollAnimations()
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  function handleSubmit(e) {
    e.preventDefault()
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error')
      return
    }
    setStatus('submitting')
    // No backend wired yet — open pre-filled mailto so the user's email client
    // sends the sign-up to the Soccerex team. Replace with fetch() once the
    // newsletter platform (Mailchimp / HubSpot / etc.) is connected.
    const subject = encodeURIComponent('SoccerExpert Newsletter — Sign-Up')
    const body = encodeURIComponent(
      `Please add this address to the SoccerExpert mailing list.\n\nEmail: ${email}\n`
    )
    window.location.href = `mailto:enquiries@soccerex.com?subject=${subject}&body=${body}`
    setStatus('success')
  }

  const perks = [
    { icon: Newspaper, title: 'Weekly Commercial Briefing', desc: 'Deal flow, sponsorship moves, and broadcaster shifts. Every Monday.' },
    { icon: TrendingUp, title: 'Exclusive Industry Analysis', desc: 'Data-driven breakdowns from the Soccerex editorial team.' },
    { icon: Mail, title: 'Early Access', desc: 'First look at event agendas, speaker announcements, and ticket releases.' },
  ]

  return (
    <div style={{ background: '#050d1a' }}>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: '82vh', display: 'flex', alignItems: 'center' }}>
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(/images/global-network/sections/soccerex-boot.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'saturate(0.45) brightness(0.3)',
        }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,13,26,0.55) 0%, rgba(9,32,62,0.85) 100%)' }} />
        <NetworkNodes color="#ffffff" accentColor="var(--color-brand-accent)" nodeCount={30} opacity={0.15} />

        <div className="relative z-10 w-full" style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(120px,15vw,180px) clamp(24px,5vw,80px)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-mono uppercase tracking-[0.2em] mb-4 fade-up" style={{ color: 'var(--color-brand-accent)', fontSize: '0.8rem', fontWeight: 600 }}>
                The Football Business E-Newsletter
              </p>
              <h1 className="font-heading font-bold text-white leading-[1.02] fade-up mb-6" style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.2rem)', letterSpacing: '-0.02em' }}>
                SOCCER<span style={{ color: 'var(--color-brand-accent)' }}>EXPERT</span>
              </h1>
              <div className="fade-up mb-6" style={{ width: '120px', height: '3px', background: 'var(--color-brand-accent)' }} />
              <p className="font-body text-white/85 leading-relaxed fade-up mb-4" style={{ fontSize: 'clamp(1.15rem, 1.6vw, 1.3rem)', fontWeight: 500 }}>
                Three decades of commercial relationships. Now in your inbox.
              </p>
              <p className="font-body text-white/65 leading-relaxed fade-up" style={{ fontSize: '1.05rem', maxWidth: '520px', lineHeight: 1.65 }}>
                Subscribe to SoccerExpert for the latest commercial details, groundbreaking interviews, and industry analysis. Free, straight to your inbox.
              </p>
            </div>

            {/* Signup card */}
            <div className="fade-up">
              <form
                onSubmit={handleSubmit}
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                  backdropFilter: 'blur(18px)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: '18px',
                  padding: 'clamp(32px, 4vw, 48px)',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
                }}
              >
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '6px 12px', background: '#ffffff',
                  border: '1px solid rgba(9,32,62,0.10)', boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
                  borderRadius: '100px', color: 'var(--color-brand-accent)',
                  fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em',
                  textTransform: 'uppercase', marginBottom: '20px',
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-brand-accent)' }} />
                  Free forever
                </div>
                <h2 className="font-heading font-bold text-white mb-2" style={{ fontSize: 'clamp(1.4rem, 2.4vw, 1.9rem)' }}>
                  Join SoccerExpert
                </h2>
                <p className="font-body text-white/60 mb-6" style={{ fontSize: '0.95rem' }}>
                  Delivered weekly. Unsubscribe any time.
                </p>

                <label htmlFor="sx-email" style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'IBM Plex Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.55)', marginBottom: '8px' }}>
                  Email Address
                </label>
                <input
                  id="sx-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
                  placeholder="you@club.com"
                  required
                  autoComplete="email"
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.06)',
                    border: status === 'error' ? '1px solid #ff6b6b' : '1px solid rgba(255,255,255,0.14)',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    color: '#fff',
                    fontSize: '1rem',
                    outline: 'none',
                    marginBottom: '14px',
                  }}
                />

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full inline-flex items-center justify-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-brand-accent), var(--color-red))',
                    color: '#09203e',
                    padding: '16px 28px',
                    fontSize: '0.88rem',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: status === 'submitting' ? 'wait' : 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => { if (status !== 'submitting') { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 14px 30px rgba(233, 30, 99,0.35)' } }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <Mail size={16} /> Subscribe
                </button>

                {status === 'success' && (
                  <p style={{ marginTop: '14px', fontSize: '0.85rem', color: '#90ee90', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} /> Opening your email client to confirm...
                  </p>
                )}
                {status === 'error' && (
                  <p style={{ marginTop: '14px', fontSize: '0.85rem', color: '#ff9898' }}>
                    Please enter a valid email address.
                  </p>
                )}

                <p style={{ marginTop: '18px', fontSize: '0.74rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                  We respect your inbox. No spam, no sponsored plugs. Just industry-grade insight from the Soccerex editorial team.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section style={{ background: 'linear-gradient(180deg, #0a172b 0%, #050d1a 100%)', padding: 'clamp(80px,10vw,130px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="text-center mb-14">
            <p className="section-label mb-4 fade-up" style={{ color: 'var(--color-brand-accent)', fontWeight: 600 }}>WHAT YOU GET</p>
            <h2 className="font-heading font-bold text-white leading-tight fade-up" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Why subscribe to{' '}
              <span style={{ color: 'var(--color-brand-accent)' }}>SoccerExpert</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {perks.map((p, i) => {
              const Icon = p.icon
              return (
                <div key={p.title} className="scale-up" style={{ transitionDelay: `${i * 60}ms` }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '14px',
                    padding: '28px 26px',
                    height: '100%',
                  }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--color-brand-accent), var(--color-red))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                      <Icon size={22} color="#09203e" strokeWidth={2} />
                    </div>
                    <h3 className="font-heading font-bold mb-2" style={{ color: '#fff', fontSize: '1.1rem' }}>{p.title}</h3>
                    <p className="font-body leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.94rem' }}>{p.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
