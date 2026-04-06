import { useEffect, useState } from 'react'
import { ArrowRight, Download, Search, Mail, Smartphone, ShieldCheck, HelpCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import NetworkNodes from '../animations/NetworkNodes'
import PixelDivider from '../components/PixelDivider'

const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.teks.eventify&hl=en_US'
const APP_STORE = 'https://apps.apple.com/us/app/soccerex-events/id6737689519'
const WEB_PORTAL = 'https://soccerexmena2025.eventify.io'

const STEPS = [
  { icon: Download, title: 'Download the App', desc: 'Locate and download the app from the App Store or Google Play Store.' },
  { icon: Search, title: 'Search Soccerex', desc: 'Open the app and search for "Soccerex" to find your event.' },
  { icon: Mail, title: 'Enter Your Email', desc: 'Select your event and enter your registered email address.' },
  { icon: ShieldCheck, title: 'Get Your Passcode', desc: 'Your passcode will be emailed to you. Enter it to access the event.' },
]

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

export default function SoccerexApp() {
  useScrollAnimations()
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const [supportForm, setSupportForm] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSupport = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`[App Support] ${supportForm.firstName} ${supportForm.lastName}`)
    const body = encodeURIComponent([
      `Name: ${supportForm.firstName} ${supportForm.lastName}`,
      `Email: ${supportForm.email}`,
      supportForm.phone ? `Phone: ${supportForm.phone}` : '',
      '',
      'Message:',
      supportForm.message,
      '',
      '---',
      'Sent via soccerex.com/app support form',
    ].filter(Boolean).join('\n'))
    window.location.href = `mailto:enquiries@soccerex.com?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  return (
    <div style={{ background: '#050d1a' }}>

      {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden flex items-center justify-center" style={{ minHeight: '75vh' }}>
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(/images/app/hero-bg.png)',
          backgroundSize: 'cover', backgroundPosition: 'center top',
          filter: 'saturate(0.6) brightness(0.4)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(5,13,26,0.5) 0%, rgba(9,32,62,0.7) 40%, rgba(5,13,26,0.95) 100%)',
        }} />
        <NetworkNodes color="#bfb170" nodeCount={30} opacity={0.15} />
        <div className="absolute pointer-events-none" style={{ top: '15%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '800px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,177,112,0.1) 0%, transparent 60%)' }} />

        <div className="relative z-10 text-center" style={{ maxWidth: '900px', padding: 'clamp(140px,15vw,200px) clamp(24px,5vw,80px) clamp(60px,8vw,100px)' }}>
          <p className="section-label text-gold mb-5 fade-up">OUR APP</p>
          <h1 className="font-heading font-bold text-white leading-[1.05] mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)' }}>
            The Official{' '}
            <span style={{ color: 'var(--color-gold)' }}>Soccerex Events</span>{' '}App
          </h1>
          <div className="fade-up mx-auto mb-8" style={{ width: '100px', height: '3px', background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }} />
          <p className="font-body text-white/70 leading-relaxed fade-up mx-auto mb-10" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.15rem)', maxWidth: '640px' }}>
            Stay connected and enhance your Soccerex event experience. Access schedules, speaker details, networking opportunities, and more.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 fade-up">
            <a href={PLAY_STORE} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-body font-semibold uppercase tracking-[0.12em]"
              style={{ background: '#fff', color: '#09203e', padding: '16px 28px', fontSize: '0.82rem', textDecoration: 'none', borderRadius: '10px', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#bfb170' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
            >
              <img src="/images/app/google-play-icon.webp" alt="Google Play" style={{ height: '22px', width: 'auto' }} />
              Play Store
            </a>
            <a href={APP_STORE} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-body font-semibold uppercase tracking-[0.12em]"
              style={{ background: '#fff', color: '#09203e', padding: '16px 28px', fontSize: '0.82rem', textDecoration: 'none', borderRadius: '10px', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#bfb170' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
            >
              <img src="/images/app/apple-icon.png" alt="App Store" style={{ height: '22px', width: 'auto' }} />
              App Store
            </a>
          </div>
        </div>
      </section>

      <PixelDivider color="#f4f3f0" layers={4} height={90} speed={0.5} />

      {/* ═══ DOWNLOAD SECTION ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(9,32,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Phone mockup */}
          <div className="slide-left">
            <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
              <img src="/images/app/phone-mockups.jpg" alt="Soccerex Events app on phones" style={{
                width: '100%', display: 'block', borderRadius: '16px',
                boxShadow: '0 30px 80px rgba(9,32,62,0.2)',
              }} />
            </div>
          </div>
          {/* Copy */}
          <div className="slide-right">
            <div style={{ borderLeft: '4px solid #bfb170', paddingLeft: '24px', marginBottom: '32px' }}>
              <h2 className="font-heading font-bold leading-tight fade-up" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#09203e' }}>
                Download the Official Soccerex Events App
              </h2>
            </div>
            <p className="font-body leading-relaxed mb-6 fade-up" style={{ fontSize: '1.05rem', color: '#333' }}>
              Stay connected and enhance your Soccerex event experience with the official app. Access schedules, speaker details, networking opportunities, and more.
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-8 fade-up">
              <a href={PLAY_STORE} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3"
                style={{
                  background: '#09203e', color: '#fff', padding: '14px 24px',
                  fontSize: '0.85rem', textDecoration: 'none', borderRadius: '10px',
                  fontFamily: 'Inter, sans-serif', fontWeight: 600, transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#0d2b52' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#09203e' }}
              >
                <img src="/images/app/google-play-icon.webp" alt="" style={{ height: '20px', width: 'auto' }} />
                <span>Available on <strong>Playstore</strong></span>
              </a>
              <a href={APP_STORE} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3"
                style={{
                  background: '#fff', color: '#09203e', padding: '14px 24px',
                  fontSize: '0.85rem', textDecoration: 'none', borderRadius: '10px',
                  border: '1.5px solid #09203e',
                  fontFamily: 'Inter, sans-serif', fontWeight: 600, transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f0eeeb' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
              >
                <img src="/images/app/apple-icon.png" alt="" style={{ height: '20px', width: 'auto' }} />
                <span>Available on <strong>Appstore</strong></span>
              </a>
            </div>
            <p className="font-body fade-up" style={{ fontSize: '0.9rem', color: '#666' }}>
              Or, visit the web portal at{' '}
              <a href={WEB_PORTAL} target="_blank" rel="noopener noreferrer" style={{ color: '#bfb170', textDecoration: 'underline', fontWeight: 600 }}>
                soccerexmena2025.eventify.io
              </a>
            </p>
          </div>
        </div>
      </section>

      <PixelDivider color="#eae8e4" layers={4} height={90} speed={0.5} />

      {/* ═══ HOW TO ACCESS ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #09203e 0%, #0d2b52 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <NetworkNodes color="#bfb170" nodeCount={20} opacity={0.1} />
        <div className="relative z-10" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="text-center mb-16">
            <p className="section-label text-gold mb-4 fade-up">GETTING STARTED</p>
            <h2 className="font-heading font-bold text-white leading-tight mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
              How to Access the{' '}
              <span style={{ color: '#bfb170' }}>Soccerex Events</span>
            </h2>
            <div className="fade-up mx-auto" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, #bfb170, transparent)' }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.title} className="scale-up" style={{ transitionDelay: `${i * 80}ms` }}>
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
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid rgba(191,177,112,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <span className="font-heading font-bold" style={{ fontSize: '0.85rem', color: '#bfb170' }}>{i + 1}</span>
                    </div>
                    <h3 className="font-heading font-bold mb-3" style={{ fontSize: '1.15rem', color: '#fff' }}>{step.title}</h3>
                    <p className="font-body leading-relaxed" style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.65)' }}>{step.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <PixelDivider color="#0d2b52" layers={4} height={90} speed={0.5} />

      {/* ═══ APP SUPPORT FORM ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(9,32,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="text-center mb-12">
            <div className="fade-up" style={{ display: 'inline-flex', width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, #bfb170, #d4c78e)', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <HelpCircle size={26} color="#09203e" strokeWidth={2.2} />
            </div>
            <p className="section-label mb-4 fade-up" style={{ color: '#09203e', fontWeight: 600 }}>NEED HELP?</p>
            <h2 className="font-heading font-bold leading-tight mb-4 fade-up" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#09203e' }}>
              Soccerex App{' '}
              <span style={{ color: '#bfb170' }}>Support</span>
            </h2>
            <div className="fade-up mx-auto mb-6" style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, transparent, #09203e, transparent)' }} />
            <p className="font-body fade-up" style={{ fontSize: '1rem', color: '#555' }}>
              Need assistance? Fill out the form below and our team will get back to you.
            </p>
          </div>
          <form onSubmit={handleSupport} className="fade-up" style={{
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
                <input type="text" required value={supportForm.firstName}
                  onChange={e => setSupportForm(p => ({ ...p, firstName: e.target.value }))}
                  style={{ width: '100%', padding: '13px 14px', fontSize: '0.92rem', fontFamily: 'Inter, sans-serif', background: '#f8f7f4', border: '1px solid rgba(9,32,62,0.12)', borderRadius: '8px', color: '#09203e', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#bfb170' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(9,32,62,0.12)' }}
                />
              </div>
              <div>
                <label className="font-mono uppercase tracking-[0.1em] block mb-2" style={{ fontSize: '0.68rem', color: '#09203e', fontWeight: 600 }}>
                  Last Name<span style={{ color: '#bfb170', marginLeft: '4px' }}>*</span>
                </label>
                <input type="text" required value={supportForm.lastName}
                  onChange={e => setSupportForm(p => ({ ...p, lastName: e.target.value }))}
                  style={{ width: '100%', padding: '13px 14px', fontSize: '0.92rem', fontFamily: 'Inter, sans-serif', background: '#f8f7f4', border: '1px solid rgba(9,32,62,0.12)', borderRadius: '8px', color: '#09203e', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#bfb170' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(9,32,62,0.12)' }}
                />
              </div>
              <div>
                <label className="font-mono uppercase tracking-[0.1em] block mb-2" style={{ fontSize: '0.68rem', color: '#09203e', fontWeight: 600 }}>
                  Email<span style={{ color: '#bfb170', marginLeft: '4px' }}>*</span>
                </label>
                <input type="email" required value={supportForm.email}
                  onChange={e => setSupportForm(p => ({ ...p, email: e.target.value }))}
                  style={{ width: '100%', padding: '13px 14px', fontSize: '0.92rem', fontFamily: 'Inter, sans-serif', background: '#f8f7f4', border: '1px solid rgba(9,32,62,0.12)', borderRadius: '8px', color: '#09203e', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#bfb170' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(9,32,62,0.12)' }}
                />
              </div>
              <div>
                <label className="font-mono uppercase tracking-[0.1em] block mb-2" style={{ fontSize: '0.68rem', color: '#09203e', fontWeight: 600 }}>
                  Mobile Number
                </label>
                <input type="tel" value={supportForm.phone}
                  onChange={e => setSupportForm(p => ({ ...p, phone: e.target.value }))}
                  style={{ width: '100%', padding: '13px 14px', fontSize: '0.92rem', fontFamily: 'Inter, sans-serif', background: '#f8f7f4', border: '1px solid rgba(9,32,62,0.12)', borderRadius: '8px', color: '#09203e', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#bfb170' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(9,32,62,0.12)' }}
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="font-mono uppercase tracking-[0.1em] block mb-2" style={{ fontSize: '0.68rem', color: '#09203e', fontWeight: 600 }}>
                Your Message<span style={{ color: '#bfb170', marginLeft: '4px' }}>*</span>
              </label>
              <textarea required rows={5} value={supportForm.message}
                onChange={e => setSupportForm(p => ({ ...p, message: e.target.value }))}
                placeholder="Describe the issue you're experiencing..."
                style={{ width: '100%', padding: '13px 14px', fontSize: '0.92rem', fontFamily: 'Inter, sans-serif', background: '#f8f7f4', border: '1px solid rgba(9,32,62,0.12)', borderRadius: '8px', color: '#09203e', outline: 'none', resize: 'vertical', minHeight: '120px', transition: 'border-color 0.2s' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#bfb170' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(9,32,62,0.12)' }}
              />
            </div>
            <button type="submit" className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em] w-full justify-center"
              style={{ background: '#bfb170', color: '#09203e', padding: '16px 36px', fontSize: '0.85rem', border: 'none', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#d4c78e' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#bfb170' }}
            >
              {submitted ? 'Sent!' : 'Submit Form'} {!submitted && <ArrowRight size={16} />}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
