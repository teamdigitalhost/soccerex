import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Globe, Handshake, Megaphone, ArrowRight, Mail, Newspaper } from 'lucide-react'
import NetworkNodes from '../animations/NetworkNodes'
import PixelDivider from '../components/PixelDivider'
import { INSIGHTS, GLOBAL_NETWORK } from '../lib/routes'
import { submitLead } from '../lib/soccerexApi'
import { isTestModeFromUrl } from '../lib/testMode'
import { Check } from 'lucide-react'
import { useScrollAnimations } from '../lib/useScrollAnimations'
import { NETWORK_LOGOS, shuffleLogos } from '../data/networkLogos'
import PageMeta from '../components/PageMeta'
import { pageMeta } from '../lib/pageMeta'

// ─── Full logo inventory (228 logos from soccerex.com/global-network) ───────
const LOGOS = NETWORK_LOGOS

const shuffle = shuffleLogos

// Split into marquee rows
const ROW_SIZE = Math.ceil(LOGOS.length / 4)
const ROW_1 = shuffle(LOGOS, 7).slice(0, ROW_SIZE)
const ROW_2 = shuffle(LOGOS, 23).slice(0, ROW_SIZE)
const ROW_3 = shuffle(LOGOS, 41).slice(0, ROW_SIZE)
const ROW_4 = shuffle(LOGOS, 59).slice(0, ROW_SIZE)

// Featured/marquee grouping for grid section (all logos, shuffled for balance)
const ALL_SHUFFLED = shuffle(LOGOS, 101)

// Pillars of engagement (flip to show contextual event imagery per pillar)
const PILLARS = [
  { icon: Users,     label: 'ATTEND',  desc: 'Join the football leaders, rightsholders, investors, brands, innovators, and strategic partners shaping the future of the game.', img: '/hero/160-NEW6-europe-packed-audience-soccerex-branding.jpg' },
  { icon: Megaphone, label: 'SPONSOR', desc: 'Position your brand inside the global football business ecosystem through high-value visibility, executive access, strategic activation, and year-round platform integration.', img: '/events/europe/2026/sections/event-vip-reception.webp' },
  { icon: Globe,     label: 'EXHIBIT', desc: 'Showcase your products, services, technology, and solutions to the decision-makers driving commercial growth across global football.', img: '/events/europe/2026/sections/event-exhibitor.jpg' },
  { icon: Handshake, label: 'CONNECT', desc: 'Use the Soccerex Deal Network to access curated introductions, qualified counterparties, and strategic conversations designed to move from access to outcomes.', img: '/hero/174-NEW6-miami-networking-blue-purple-outdoor.jpg' },
]

// Stats bar numbers
// Standardized to the GN revisions doc stats line:
// "30 Years · 57 Events · 75K+ Delegates · 5K+ Brands". The fifth tagline
// segment ("One Global Football Business Platform") renders inline under
// the hero, not as a stat tile.
const NETWORK_STATS = [
  { num: '30', label: 'Years' },
  { num: '57', label: 'Events' },
  { num: '75K+', label: 'Delegates' },
  { num: '5K+', label: 'Brands' },
]

// ─── Animated counter ──────────────────────────────────────────────────────
function AnimatedCounter({ target }) {
  const ref = useRef(null)
  const counted = useRef(false)
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted.current) {
        counted.current = true
        const numericTarget = parseInt(target.replace(/[^0-9]/g, ''))
        const hasPlus = target.includes('+')
        const hasK = target.includes('k')
        const duration = 2000
        const start = performance.now()
        const animate = (now) => {
          const elapsed = now - start
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          const current = Math.floor(numericTarget * eased)
          el.textContent = current + (hasK ? 'k' : '') + (hasPlus ? '+' : '')
          if (progress < 1) requestAnimationFrame(animate)
          else el.textContent = target
        }
        requestAnimationFrame(animate)
      }
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])
  return <span ref={ref}>0</span>
}


// ─── Marquee row ───────────────────────────────────────────────────────────
function LogoMarquee({ logos, direction = 'left', duration = 80 }) {
  return (
    <div className="gn-marquee" style={{ maskImage: 'linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)', WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)' }}>
      <div className={`gn-marquee-track ${direction === 'right' ? 'gn-marquee-reverse' : ''}`} style={{ animationDuration: `${duration}s` }}>
        {[...logos, ...logos].map((src, i) => (
          <div key={i} className="gn-marquee-item">
            <img src={src} alt="" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────
export default function GlobalNetwork() {
  const [showAll, setShowAll] = useState(false)
  const [nlStatus, setNlStatus] = useState('idle')
  const [nlError, setNlError] = useState('')
  useScrollAnimations(showAll)
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const visibleGrid = showAll ? ALL_SHUFFLED : ALL_SHUFFLED.slice(0, 96)

  return (
    <div style={{ background: '#050d1a' }}>
      <PageMeta {...pageMeta(GLOBAL_NETWORK)} />

      {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="inner-hero relative overflow-hidden flex items-center justify-center">
        {/* Background image */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(/hero/234-NEW8-aerial-diverse-crowd-networking.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'saturate(0.6) brightness(0.35)',
        }} />
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(5,13,26,0.65) 0%, rgba(9,32,62,0.75) 40%, rgba(5,13,26,0.9) 100%)',
        }} />
        <NetworkNodes color="#ffffff" accentColor="var(--color-brand-accent)" nodeCount={45} opacity={0.18} />
        {/* Radial gold glow */}
        <div className="absolute pointer-events-none" style={{ top: '15%', left: '50%', transform: 'translateX(-50%)', width: '900px', height: '900px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,177,112,0.1) 0%, transparent 60%)' }} />

        <div className="relative z-10 text-center" style={{ maxWidth: '1100px', padding: 'clamp(40px,6vw,82px) clamp(24px,5vw,80px) clamp(44px,6vw,76px)' }}>
          <div className="inner-hero-crest inner-hero-crest--xl flex justify-center fade-up">
            <img src="/brand/crests/crest-main-white.svg" alt="" aria-hidden="true"
              style={{ filter: 'drop-shadow(0 8px 40px rgba(233, 30, 99,0.3)) drop-shadow(0 0 90px rgba(255,183,3,0.15))' }} />
          </div>
          <p className="section-label text-brand-accent mb-6 fade-up">GLOBAL FOOTBALL BUSINESS PLATFORM</p>
          <h1 className="font-heading font-bold text-white leading-[1.02] mb-7 fade-up text-glow" style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)' }}>
            The Leading Platform Where Football{' '}
            <span style={{ color: 'var(--color-brand-accent)' }}>Business Gets Done</span>
          </h1>
          <div className="fade-up mx-auto mb-8" style={{ width: '120px', height: '3px', background: 'linear-gradient(90deg, transparent, var(--color-brand-accent), transparent)' }} />
          <p className="font-body text-white/85 leading-relaxed fade-up mx-auto mb-6" style={{ fontSize: 'clamp(1.15rem, 1.8vw, 1.4rem)', maxWidth: '880px', lineHeight: 1.55 }}>
            For 30 years, Soccerex has connected the global football ecosystem. Today, that legacy powers a year-round platform built to turn access into partnerships, investment, innovation, women’s football growth, impact, and commercial opportunity.
          </p>
          <p className="font-body text-white/60 fade-up mx-auto font-mono uppercase tracking-widest" style={{ fontSize: '0.82rem', letterSpacing: '0.22em' }}>
            30 Years &middot; 57 Events &middot; 75K+ Delegates &middot; 5K+ Brands &middot; One Global Football Business Platform
          </p>
        </div>
      </section>

      {/* Wave divider: hero → ecosystem */}
      <PixelDivider color="#f4f3f0" layers={4} height={90} speed={0.5} />

      {/* ═══ ECOSYSTEM INTRO ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(9,32,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10 text-center" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p className="section-label mb-6 fade-up" style={{ color: '#09203e', fontWeight: 600 }}>FROM ACCESS TO OUTCOMES</p>
          <h2 className="font-heading font-bold leading-tight mb-6 fade-up" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.3rem)', color: '#09203e' }}>
            A Platform Built Around Football{' '}
            <span style={{ color: 'var(--color-brand-accent)' }}>Business Outcomes</span>
          </h2>
          <div className="fade-up mx-auto mb-8" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, #09203e, transparent)' }} />
          <p className="font-body leading-relaxed fade-up mx-auto" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', color: '#333', maxWidth: '760px' }}>
            Soccerex connects the people, capital, companies, and institutions shaping the future of football, then activates that ecosystem through events, Deal Network, HerSoccerex, strategic partnerships, market insight, and impact.
          </p>
        </div>
      </section>

      {/* Wave divider: ecosystem → pillars */}
      <PixelDivider color="#09203e" layers={4} height={90} speed={0.5} />

      {/* ═══ FOUR PILLARS ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #09203e 0%, #0d2b52 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <NetworkNodes color="#ffffff" accentColor="var(--color-brand-accent)" nodeCount={28} opacity={0.12} />
        <div className="relative z-10" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="text-center mb-16">
            <p className="section-label text-brand-accent mb-4 fade-up">ENTER THE SOCCEREX PLATFORM</p>
            <h2 className="font-heading font-bold text-white leading-tight mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
              One ecosystem built to turn access into partnerships, investment, innovation, impact, and year-round commercial opportunity.
            </h2>
            <div className="fade-up mx-auto" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, var(--color-brand-accent), transparent)' }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((p) => {
              const Icon = p.icon
              return (
                <div key={p.label} className="sx-flip scale-up" style={{ perspective: '1000px', height: '370px' }}>
                  <div className="sx-flip-inner" style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transition: 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)' }}>
                    {/* Front */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                      background: 'rgba(255,255,255,0.04)', padding: '36px 30px', borderRadius: '16px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                      border: '1px solid rgba(191,177,112,0.15)',
                      backdropFilter: 'blur(10px)',
                    }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '14px', background: 'var(--color-brand-accent)', boxShadow: '0 8px 20px rgba(233, 30, 99,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                        <Icon size={30} color="#09203e" strokeWidth={2.2} />
                      </div>
                      <h3 className="font-heading font-bold mb-3" style={{ fontSize: '1.4rem', color: '#fff', letterSpacing: '0.02em' }}>{p.label}</h3>
                      <p className="font-body leading-relaxed" style={{ fontSize: '0.98rem', color: 'rgba(255,255,255,0.7)' }}>{p.desc}</p>
                    </div>
                    {/* Back */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      borderRadius: '16px', overflow: 'hidden',
                      boxShadow: '0 16px 50px rgba(0,0,0,0.5)',
                    }}>
                      <img src={p.img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(9,32,62,0.15) 40%, rgba(9,32,62,0.95) 100%)' }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px' }}>
                        <span style={{ display: 'inline-block', padding: '4px 10px', background: 'var(--color-brand-accent)', color: '#fff', borderRadius: '100px', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '12px' }}>
                          Live at Soccerex
                        </span>
                        <h3 className="font-heading font-bold" style={{ color: '#fff', fontSize: '1.25rem', letterSpacing: '0.02em' }}>{p.label}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Wave divider: pillars → stats */}
      <PixelDivider color="#09203e" layers={4} height={90} speed={0.5} />

      {/* ═══ STATS BAR ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#09203e', padding: 'clamp(60px,8vw,100px) clamp(24px,5vw,80px)' }}>
        <NetworkNodes color="#ffffff" accentColor="var(--color-brand-accent)" nodeCount={25} opacity={0.12} />
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {NETWORK_STATS.map((s) => (
            <div key={s.label} className="text-center scale-up">
              <p className="font-heading font-bold text-brand-accent" style={{ fontSize: 'clamp(3.4rem, 7vw, 6rem)', lineHeight: 0.95 }}>
                <AnimatedCounter target={s.num} />
              </p>
              <p className="font-heading font-semibold text-white/70 uppercase tracking-widest mt-4" style={{ fontSize: 'clamp(0.78rem, 1.2vw, 0.95rem)' }}>{s.label}</p>
            </div>
          ))}
        </div>
        <p className="relative z-10 font-mono uppercase text-center mt-10 fade-up" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', letterSpacing: '0.18em' }}>
          One Global Football Business Platform
        </p>
      </section>

      {/* Wave divider: stats → marquee */}
      <PixelDivider color="#09203e" layers={4} height={90} speed={0.6} />

      {/* ═══ LOGO MARQUEE ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(80px,10vw,140px) 0' }}>
        <div className="text-center mb-14 px-6">
          <p className="section-label mb-4 fade-up" style={{ color: '#09203e', fontWeight: 600 }}>THE SOCCEREX ECOSYSTEM</p>
          <h2 className="font-heading font-bold leading-tight mb-4 fade-up" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', color: '#09203e' }}>
            Connecting the Ecosystem That{' '}
            <span style={{ color: 'var(--color-brand-accent)' }}>Powers Football Business</span>
          </h2>
          <div className="fade-up mx-auto mb-6" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, #09203e, transparent)' }} />
          <p className="font-body fade-up mx-auto" style={{ fontSize: '1.05rem', color: '#555', maxWidth: '820px' }}>
            Soccerex brings together the people, capital, companies, and institutions shaping the future of football, from clubs, leagues, federations, and rightsholders to brands, broadcasters, investors, family offices, funds, technology innovators, agencies, advisors, women’s football leaders, venues, host cities, and impact-driven organizations.
          </p>
        </div>
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <LogoMarquee logos={ROW_1} direction="left" duration={100} />
          <LogoMarquee logos={ROW_2} direction="right" duration={120} />
          <LogoMarquee logos={ROW_3} direction="left" duration={140} />
          <LogoMarquee logos={ROW_4} direction="right" duration={110} />
        </div>
      </section>

      {/* Wave divider: marquee → grid */}
      <PixelDivider color="#eae8e4" layers={4} height={90} speed={0.5} />

      {/* ═══ LOGO GRID ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #09203e 0%, #050d1a 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <NetworkNodes color="#ffffff" accentColor="var(--color-brand-accent)" nodeCount={30} opacity={0.1} />
        <div className="relative z-10" style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div className="text-center mb-16" style={{ maxWidth: '960px', margin: '0 auto 64px' }}>
            <p className="section-label text-brand-accent mb-6 fade-up">THREE DECADES OF GLOBAL FOOTBALL BUSINESS</p>
            <h2 className="font-heading font-semibold text-white leading-[1.25] fade-up" style={{ fontSize: 'clamp(1.35rem, 2.4vw, 2.1rem)' }}>
              Soccerex is more than a gathering point. It is the platform turning football’s global ecosystem into partnerships, investment, innovation, impact, and commercial opportunity.
            </h2>
            <div className="fade-up mx-auto mt-8" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, var(--color-brand-accent), transparent)' }} />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
            {visibleGrid.map((src, i) => (
              <div key={src + i} className="gn-grid-cell">
                <img src={src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
          {!showAll && ALL_SHUFFLED.length > 96 && (
            <div className="text-center mt-12 fade-up">
              <button
                onClick={() => setShowAll(true)}
                className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em] cursor-pointer border-none"
                style={{ background: 'var(--color-brand-accent)', color: '#fff', padding: '16px 36px', fontSize: '0.85rem', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#d4c78e' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-brand-accent)' }}
              >
                Show more <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Wave divider: grid → newsletter */}
      <PixelDivider color="#050d1a" layers={4} height={90} speed={0.5} />

      {/* ═══ NEWSLETTER (SOCCER EXPERT) ═════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
          {/* Boot image */}
          <div className="slide-left" style={{ minHeight: '420px', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'url(/images/global-network/sections/soccerex-boot.jpg)',
              backgroundSize: 'cover', backgroundPosition: 'center',
            }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(9,32,62,0.1) 0%, transparent 100%)' }} />
          </div>
          {/* Form side */}
          <div className="slide-right flex items-center" style={{ padding: 'clamp(60px,8vw,120px) clamp(32px,6vw,90px)' }}>
            <div style={{ maxWidth: '520px' }}>
              <p className="section-label mb-4 fade-up" style={{ color: '#09203e', fontWeight: 600 }}>THE FOOTBALL BUSINESS E-NEWSLETTER</p>
              <h2 className="font-heading font-bold leading-tight mb-3 fade-up" style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', color: '#09203e', letterSpacing: '-0.01em' }}>
                SOCCER<span style={{ color: 'var(--color-brand-accent)' }}>EXPERT</span>
              </h2>
              <div className="fade-up mb-6" style={{ width: '60px', height: '3px', background: 'var(--color-brand-accent)' }} />
              <p className="font-body leading-relaxed mb-3 fade-up" style={{ fontSize: '1.15rem', color: '#09203e', fontWeight: 600 }}>
                Tap in to three decades of connections.
              </p>
              <p className="font-body leading-relaxed mb-8 fade-up" style={{ fontSize: '1rem', color: '#555' }}>
                Subscribe to get the latest commercial details, groundbreaking interviews, and industry analysis, free, straight to your inbox.
              </p>
              {nlStatus === 'success' ? (
                <div className="fade-up flex items-center gap-2 font-body" style={{ fontSize: '1rem', color: '#09203e', fontWeight: 600 }}>
                  <Check size={18} style={{ color: 'var(--color-brand-accent)' }} /> You're subscribed. Welcome to SoccerExpert.
                </div>
              ) : (
              <form
                className="fade-up"
                onSubmit={async (e) => {
                  e.preventDefault()
                  const email = e.target.email.value.trim()
                  setNlStatus('submitting'); setNlError('')
                  try {
                    await submitLead('newsletter', {
                      email,
                      list: 'soccerexpert',
                      source: 'global-network',
                      source_url: typeof window !== 'undefined' ? window.location.href : undefined,
                      marketing_opt_in: true,
                    }, { test: isTestModeFromUrl() })
                    setNlStatus('success')
                  } catch (err) {
                    setNlStatus('error')
                    setNlError(err?.message || "We couldn't subscribe you just now. Please try again.")
                  }
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '460px' }}
              >
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Your Email Address"
                  autoComplete="email"
                  style={{
                    width: '100%', padding: '14px 16px',
                    fontSize: '1rem', fontFamily: 'Inter, sans-serif',
                    background: '#fff',
                    border: '1px solid rgba(9,32,62,0.15)',
                    borderRadius: '8px', color: '#09203e', outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-brand-accent)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(9,32,62,0.15)' }}
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 font-body font-semibold uppercase tracking-[0.15em] cursor-pointer border-none"
                  style={{ background: '#09203e', color: '#fff', padding: '14px 24px', fontSize: '0.82rem', borderRadius: '8px', transition: 'all 0.3s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-brand-accent)'; e.currentTarget.style.color = '#09203e' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#09203e'; e.currentTarget.style.color = '#fff' }}
                >
                  <Mail size={15} /> {nlStatus === 'submitting' ? 'Subscribing…' : 'Subscribe'}
                </button>
                {nlStatus === 'error' && (
                  <p className="font-body" style={{ fontSize: '0.85rem', color: '#b3261e', margin: 0 }}>{nlError}</p>
                )}
              </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Wave divider: newsletter → insights */}
      <PixelDivider color="#eae8e4" layers={4} height={90} speed={0.5} />

      {/* ═══ INSIGHTS ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #09203e 0%, #050d1a 100%)' }}>
        <NetworkNodes color="#ffffff" accentColor="var(--color-brand-accent)" nodeCount={25} opacity={0.1} />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-stretch">
          {/* Copy */}
          <div className="slide-left flex items-center" style={{ padding: 'clamp(80px,10vw,140px) clamp(32px,6vw,90px)' }}>
            <div style={{ maxWidth: '560px' }}>
              <p className="section-label text-brand-accent mb-4 fade-up">THE FOOTBALL INDUSTRY'S PULSE</p>
              <h2 className="font-heading font-bold text-white leading-tight mb-4 fade-up text-glow" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                SOCCEREX INSIGHTS
              </h2>
              <h3 className="font-heading font-semibold leading-tight mb-6 fade-up" style={{ fontSize: 'clamp(1.4rem, 2.4vw, 1.9rem)', color: 'var(--color-brand-accent)' }}>
                Market Intelligence for the Football Business Ecosystem
              </h3>
              <div className="fade-up mb-6" style={{ width: '60px', height: '3px', background: 'var(--color-brand-accent)' }} />
              <p className="font-body leading-relaxed mb-8 fade-up" style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)' }}>
                Stay informed. Stay connected. Stay ahead.
              </p>
              <p className="font-body leading-relaxed mb-8 fade-up" style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)' }}>
                Soccerex Insights helps the football business community understand the trends, markets, capital flows, partnerships, innovation, women’s football growth, and impact initiatives shaping the future of the game.
              </p>
              <Link to={INSIGHTS} className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em] fade-up"
                style={{ background: 'var(--color-brand-accent)', color: '#fff', padding: '16px 36px', fontSize: '0.85rem', textDecoration: 'none', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#d4c78e' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-brand-accent)' }}
              >
                <Newspaper size={16} /> Read Soccerex Articles
              </Link>
            </div>
          </div>
          {/* Image */}
          <div className="slide-right" style={{ minHeight: '480px', position: 'relative', overflow: 'hidden', paddingTop: 'clamp(80px,10vw,140px)' }}>
            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 0, top: 'clamp(80px,10vw,140px)',
              backgroundImage: 'url(/images/global-network/sections/england-women.webp)',
              backgroundSize: 'cover', backgroundPosition: 'center',
            }} />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 'clamp(80px,10vw,140px)', background: 'linear-gradient(270deg, rgba(9,32,62,0) 0%, rgba(9,32,62,0.4) 100%)' }} />
          </div>
        </div>
      </section>

    </div>
  )
}
