import { useEffect, useState } from 'react'
import { ArrowLeft, MapPin, Calendar, Mail, Check, Users, Trophy, Briefcase, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import PixelDivider from '../components/PixelDivider'
import { HOME } from '../lib/routes'
import { preregisterLead } from '../lib/soccerexApi'
import { isTestModeFromUrl } from '../lib/testMode'

const IMG = '/events/middle-east/2026'

const WHY_ATTEND = [
  { title: 'The Region Where Football Is Accelerating', desc: "Saudi Arabia's football transformation, Vision 2030, the Saudi Pro League, and the road to the 2034 FIFA World Cup make Riyadh one of the most important markets in the global game." },
  { title: 'The Middle East Football Business Ecosystem', desc: "Federations, clubs, ministries, investors, brands, rightsholders, innovators, and strategic partners come together to shape the region's next phase of football growth." },
  { title: 'Capital Meets Football', desc: "Soccerex Middle East connects football's global ecosystem with the capital, ownership groups, funds, family offices, and strategic investors driving growth across the region." },
  { title: 'Misk City Experience', desc: "Hosted inside the Kingdom's flagship cultural district, Soccerex Middle East creates a premium setting for executive networking, curated conversations, relationship-building, and long-term commercial opportunity." },
]

const THEMES = [
  { title: 'Saudi Pro League & Club Transformation', desc: 'Club growth, ownership models, commercial strategy, talent development, and the next phase of league evolution.' },
  { title: 'FIFA World Cup 2034 & Long-Term Legacy', desc: "The commercial, infrastructure, tourism, development, and legacy opportunities created by Saudi Arabia's World Cup journey." },
  { title: 'Investment, Ownership & Strategic Capital', desc: "Sovereign capital, private investment, club ownership, multi-club strategy, funds, family offices, and football's financial future." },
  { title: 'Federations, Governance & International Football', desc: 'Regional football development, institutional growth, global alignment, regulation, and the role of federations in the next era.' },
  { title: 'Stadiums, Infrastructure & Host City Readiness', desc: 'Venue development, matchday experience, mobility, hospitality, city planning, and major-event readiness.' },
  { title: "Women's Football in the Middle East", desc: 'Commercialization, participation, leadership, investment, sponsorship, and long-term ecosystem development.' },
  { title: 'Sport, Entertainment & Giga-Project Integration', desc: 'How football connects with tourism, entertainment, culture, destination strategy, and large-scale national development projects.' },
  { title: 'Commercial Rights, Media & Fan Engagement', desc: 'Broadcast, sponsorship, content, digital platforms, data, fan experience, and new revenue models across the region.' },
]

const RIGHTS_HOLDER_POINTS = [
  'Connect with brands, investors, solution providers, and strategic partners active across the Middle East football ecosystem.',
  'Access conversations around club growth, infrastructure, governance, media, innovation, women’s football, and the road to FIFA World Cup 2034.',
  'Showcase your organization, project, or market opportunity to a senior audience of decision-makers, capital partners, and global football operators.',
  'Build relationships across the Soccerex platform before, during, and after Riyadh.',
]

function PreRegisterForm() {
  const [form, setForm] = useState({ name: '', email: '', company: '', role: '', country: '' })
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')
    try {
      // Goes to the Soccerex backend (not Netlify Forms). The backend writes
      // a LeadSubmission row, forwards to HubSpot, and sends an SES
      // notification to maven@soccerex.com and enquiries@soccerex.com.
      await preregisterLead({
        name: form.name,
        email: form.email,
        company: form.company || undefined,
        role: form.role || undefined,
        country: form.country || undefined,
        event_slug: 'soccerex-mena-2027',
        attendee_type: 'delegate',
        source: 'riyadh-2027-preregister',
        source_url: typeof window !== 'undefined' ? window.location.href : undefined,
        marketing_opt_in: true,
      }, { test: isTestModeFromUrl() })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err?.message || 'We could not submit your details. Please email enquiries@soccerex.com.')
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
    <form onSubmit={submit} className="flex flex-col gap-3" noValidate>
      <label className="font-mono text-[10px] uppercase tracking-widest text-white/50">Full name
        <input required value={form.name} onChange={update('name')} placeholder="Eve Moneypenny" className="pre-reg-input" />
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

      {status === 'error' && errorMsg && (
        <p className="font-body text-sm" style={{ color: '#ffb1b1' }}>{errorMsg}</p>
      )}

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
            <span style={{ color: 'var(--event-primary)', WebkitTextStroke: '1px rgba(255,255,255,0.12)' }}>THE MIDDLE EAST ANCHOR EVENT OF THE SOCCEREX PLATFORM</span>
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

          <p className="font-body text-white/70 leading-relaxed mx-auto mb-8" style={{ fontSize: '1.05rem', maxWidth: '760px' }}>
            Soccerex Riyadh connects football&#x2019;s global ecosystem with one of the world&#x2019;s most ambitious sports markets, bringing clubs, federations, investors, brands, innovators, rightsholders, and strategic partners together in a region driving major investment, infrastructure, innovation, and long-term football growth.
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
                Soccerex Middle East is the regional event of the Soccerex platform, connecting football&#x2019;s global ecosystem with one of the world&#x2019;s most ambitious sports markets. Hosted at Misk City in Riyadh, it brings together federations, clubs, leagues, ministries, investors, rightsholders, brands, innovators, and solution providers at the center of the region&#x2019;s football growth story.
              </p>
              <p className="font-body leading-relaxed" style={{ fontSize: '1.05rem', color: '#444' }}>
                As Saudi Arabia builds toward the 2034 FIFA World Cup and continues investing across clubs, infrastructure, talent, media, technology, and fan engagement, Soccerex Middle East creates the environment where access turns into partnerships, investment, innovation, impact, and long-term commercial opportunity.
              </p>
            </div>
          </div>

          <p className="font-mono uppercase tracking-[0.18em] mb-2" style={{ fontSize: '0.72rem', color: 'var(--event-primary)', fontWeight: 600 }}>Where the Middle East Football Opportunity Comes Into Focus</p>
          <h3 className="font-heading font-bold mb-6" style={{ fontSize: 'clamp(1.3rem, 2.4vw, 1.9rem)', color: '#1a1a1a', maxWidth: '760px' }}>
            Soccerex Middle East brings the region&#x2019;s football business ecosystem together around the investment, infrastructure, governance, media, innovation, women&#x2019;s football, and commercial growth priorities shaping the next decade of the game.
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {THEMES.map((theme) => (
              <div key={theme.title} className="px-6 py-5 rounded-xl" style={{ background: 'rgba(15,143,82,0.10)', border: '1px solid rgba(15,143,82,0.28)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--event-primary)', flexShrink: 0 }} />
                  <span className="font-heading font-bold" style={{ fontSize: '1rem', color: '#1a1a1a' }}>{theme.title}</span>
                </div>
                <p className="font-body" style={{ fontSize: '0.9rem', color: '#444', lineHeight: 1.5 }}>{theme.desc}</p>
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
            Request Access to <span style={{ color: 'var(--event-primary-light)' }}>Soccerex Middle East</span>
          </h2>
          <p className="font-body text-center text-white/60 mx-auto mb-10" style={{ maxWidth: '720px' }}>
            Pre-register for the Middle East anchor point of the Soccerex platform, where football&#x2019;s global ecosystem connects with the capital, partners, innovators, and institutions shaping the region&#x2019;s next era of growth.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--event-primary-border)', borderRadius: '14px', padding: 'clamp(24px, 3vw, 36px)' }}>
              <h3 className="font-heading font-bold text-white text-xl mb-2 flex items-center gap-2">
                <Mail size={18} style={{ color: 'var(--event-primary-light)' }} /> Pre-register
              </h3>
              <p className="font-body text-white/60 text-sm mb-6">Join the priority list to receive launch updates, registration access, agenda announcements, speaker releases, and partnership opportunities as Soccerex Middle East opens.</p>
              <PreRegisterForm />
            </div>

            <div style={{ background: 'linear-gradient(145deg, var(--event-primary-bg), rgba(255,255,255,0.02))', border: '1px solid var(--event-primary-border)', borderRadius: '14px', padding: 'clamp(24px, 3vw, 36px)' }}>
              <h3 className="font-heading font-bold text-white text-xl mb-2 flex items-center gap-2">
                <Trophy size={18} style={{ color: 'var(--event-primary-light)' }} /> Rightsholder Access
              </h3>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5" style={{ background: 'var(--event-primary)', color: '#031a10', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Complimentary Pass
              </div>
              <p className="font-body text-white/70 text-sm mb-5 leading-relaxed">
                Clubs, leagues, federations, national teams, competitions, and qualifying rightsholders may apply for complimentary access to Soccerex Middle East. Here&#x2019;s what you unlock:
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
                Rightsholder enquiries: <a href="mailto:enquiries@soccerex.com" style={{ color: 'var(--event-primary-light)', textDecoration: 'none' }}>enquiries@soccerex.com</a>
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
