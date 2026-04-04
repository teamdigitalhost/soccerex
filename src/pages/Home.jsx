import { useEffect, useState, useCallback, useRef } from 'react'
import { Users, MessageSquare, Globe, KeyRound, MapPin, ArrowRight, Calendar, Ticket, FileText, ExternalLink } from 'lucide-react'
import { feature } from 'topojson-client'
import { Link } from 'react-router-dom'
import NetworkNodes from '../animations/NetworkNodes'
import TopoDivider from '../components/TopoDivider'
import PixelDivider from '../components/PixelDivider'
import HeroSlideshow from '../components/HeroSlideshow'
import ImageGrid from '../components/ImageGrid'
import InteractiveGlobe from '../components/InteractiveGlobe'

// Intersection Observer for fade-up animations
function useScrollAnimations() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    document.querySelectorAll('.fade-up, .slide-left, .slide-right, .scale-up, .blur-reveal, .underline-grow, .section-divider').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])
}

// ─── SECTION 1: HERO ─────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative overflow-hidden flex items-center justify-center" style={{ minHeight: '100dvh', background: 'linear-gradient(135deg, #050d1a 0%, #09203e 40%, #0e2a4f 70%, #061729 100%)' }}>
      <NetworkNodes color="#1a3fbf" nodeCount={35} opacity={0.12} />
      {/* Radial glow */}
      <div className="absolute pointer-events-none" style={{ top: '10%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '800px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,177,112,0.06) 0%, transparent 60%)' }} />
      <div className="absolute pointer-events-none" style={{ bottom: '0', left: '0', right: '0', height: '200px', background: 'linear-gradient(to bottom, transparent, #09203e)' }} />

      <div className="relative z-10 text-center" style={{ maxWidth: '850px', padding: 'clamp(120px,15vw,180px) clamp(24px,5vw,80px) clamp(80px,10vw,120px)' }}>
        <p className="section-label text-gold mb-6 fade-up">SOCCEREX &middot; EST. 1996</p>
        <h1 className="font-heading font-bold text-white text-glow leading-[1.08] mb-6 fade-up gold-underline" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4rem)' }}>
          30 Years at the Center of the Business of Football
        </h1>
        <p className="font-body text-white/80 leading-relaxed mb-4 fade-up" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)' }}>
          For three decades, Soccerex has brought together the people shaping the global game. From clubs and leagues to investors, brands, and innovators.
        </p>
        <p className="font-body text-white/60 leading-relaxed mb-10 fade-up" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
          What started as an event has become a global meeting point for the football industry, where relationships are built, ideas are tested, and opportunities take shape.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 fade-up">
          <button onClick={() => document.querySelector('#events')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 font-body font-semibold text-sm uppercase tracking-[0.15em] px-8 py-4 transition-all duration-300 cursor-pointer border-none"
            style={{ background: '#bfb170', color: '#09203e' }}
            onMouseEnter={e => e.currentTarget.style.background = '#d4c78e'}
            onMouseLeave={e => e.currentTarget.style.background = '#bfb170'}>
            Explore Events
            <ArrowRight size={16} />
          </button>
          <button onClick={() => document.querySelector('#partner')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 font-body font-semibold text-sm uppercase tracking-[0.15em] px-8 py-4 transition-all duration-300 cursor-pointer text-white"
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#bfb170'; e.currentTarget.style.color = '#bfb170' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = 'white' }}>
            Partner with Soccerex
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── UPCOMING EVENT: SOCCEREX EUROPE 2026 ───────────────────────────────────
function UpcomingEventSection() {
  const eventLinks = [
    { label: 'Get Your Ticket', href: 'https://soccerexeurope2026.eventify.io/t2/tickets/', external: true, icon: Ticket, primary: true },
    { label: 'Official Press Release', href: '/press/soccerex-europe-amsterdam-may-2026', external: false, icon: FileText },
    { label: 'Rightsholder Registration', href: 'https://soccerexeurope2026.eventify.io/t2/tickets/79DF37', external: true, icon: ExternalLink },
    { label: 'Selection of Attendees', href: '/events/europe/2026/selection-of-attendees.pdf', external: true, icon: FileText },
  ]

  return (
    <section className="upcoming-event relative overflow-hidden" style={{ background: '#1a0000' }}>
      {/* Background image with Amsterdam red treatment */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'url(/hero/279-NEW9-cruyff-arena-interior-daylight.jpg)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'saturate(0.4) brightness(0.25)',
      }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(140,20,20,0.6) 0%, rgba(50,5,5,0.65) 40%, rgba(20,0,0,0.85) 100%)' }} />

      <div className="relative z-10" style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(80px,10vw,120px) clamp(24px,5vw,80px)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: headline */}
          <div>
            <div className="fade-up" style={{ marginBottom: '1.5rem' }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-widest rounded-full" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff' }}>
                <span className="w-2 h-2 rounded-full" style={{ background: '#c8302c', boxShadow: '0 0 12px #c8302c', animation: 'node-pulse 2s infinite' }} />
                30th Anniversary Edition
              </span>
            </div>
            <h2 className="font-heading font-bold text-white leading-[1.05] mb-4 fade-up" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}>
              Total Football.{' '}<span style={{ color: '#c8302c' }}>Coming Home</span>{' '}for Business.
            </h2>
            <p className="font-body text-white/50 uppercase tracking-widest text-sm mb-6 fade-up">Connect. Lead. Innovate.</p>
            <p className="font-body text-white/70 leading-relaxed mb-8 fade-up" style={{ fontSize: '1.05rem', maxWidth: '520px' }}>
              In the year we celebrate our 30th birthday, Soccerex Europe returns to Amsterdam for its third consecutive edition, bringing together the world's most influential football executives, clubs, leagues, federations, brands, investors, and innovators to shape the future of the sport.
            </p>
            <div className="flex flex-wrap gap-3 fade-up">
              <a href="/events/europe/2026/agenda-concept.pdf" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 font-body font-semibold text-sm uppercase tracking-widest px-8 py-4 transition-all duration-300 cursor-pointer"
                style={{ background: '#c8302c', border: 'none', color: '#fff', textDecoration: 'none' }}>
                <FileText size={18} /> Agenda Concept
              </a>
              <Link to="/europe-2026"
                className="inline-flex items-center gap-3 font-body font-semibold text-sm uppercase tracking-widest px-8 py-4 transition-all duration-300 cursor-pointer"
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.35)', color: '#fff', textDecoration: 'none' }}>
                <Globe size={18} /> Event Info
              </Link>
            </div>
          </div>

          {/* Right: event card */}
          <div className="fade-up">
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
              backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px', padding: 'clamp(32px, 5vw, 48px)', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #c8302c, rgba(200,48,44,0.2))' }} />
              <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full mb-4" style={{ background: 'rgba(200,48,44,0.15)', border: '1px solid rgba(200,48,44,0.5)', color: '#e8504c' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#c8302c', animation: 'node-pulse 2s infinite' }} />
                Upcoming Event
              </span>
              <h3 className="font-heading font-bold text-white mb-2" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>11-13th May 2026</h3>
              <p className="font-heading font-semibold text-white/90 text-lg mb-4">Johan Cruyff Arena</p>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6" style={{ background: 'rgba(200,48,44,0.1)', border: '1px solid rgba(200,48,44,0.2)' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #a02020, #c8302c)' }}>
                  <MapPin size={18} color="#fff" />
                </div>
                <div>
                  <p className="font-body text-white/90 font-medium text-sm">Amsterdam</p>
                  <p className="font-body text-white/50 text-xs">Europe's Football Capital</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {eventLinks.map((link) => {
                  const Icon = link.icon
                  const Tag = link.external ? 'a' : Link
                  const props = link.external ? { href: link.href, target: '_blank', rel: 'noopener noreferrer' } : { to: link.href }
                  return (
                    <Tag key={link.label} {...props}
                      className="flex items-center justify-between gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-widest transition-all duration-200 cursor-pointer"
                      style={{
                        textDecoration: 'none', borderRadius: '8px',
                        background: link.primary ? '#c8302c' : 'rgba(255,255,255,0.05)',
                        color: link.primary ? '#fff' : 'rgba(255,255,255,0.7)',
                        border: link.primary ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      }}>
                      <span className="flex items-center gap-2"><Icon size={14} /> {link.label}</span>
                      <ArrowRight size={14} />
                    </Tag>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-8 mt-12 pt-10 fade-up" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {[{ num: '55', label: 'Physical Events' }, { num: '79.3k+', label: 'Attendees' }, { num: '23', label: 'Cities' }].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading font-bold" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#fff' }}>{stat.num}</p>
              <p className="font-body text-white/50 text-xs uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── SECTION 2: MEETING POINT ────────────────────────────────────────────────
function MeetingPointSection() {
  const bullets = [
    { icon: Users, text: 'Club executives and owners' },
    { icon: Users, text: 'League and federation leaders' },
    { icon: KeyRound, text: 'Investors and family offices' },
    { icon: Globe, text: 'Brands, media, and technology companies' },
  ]

  return (
    <section id="about" className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(9,32,62,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.04) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />
      {/* Section number watermark */}
      <div className="absolute top-8 right-8 font-heading font-bold pointer-events-none select-none" style={{ fontSize: 'clamp(8rem, 20vw, 16rem)', lineHeight: 1, color: 'rgba(9,32,62,0.04)' }}>01</div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20" style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div>
          <p className="section-label mb-4" style={{ color: '#09203e', fontWeight: 600 }}>01 &middot; THE PLATFORM</p>
          <h2 className="font-heading font-bold leading-tight mb-6" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#09203e' }}>
            The Meeting Point for Global Football Business
          </h2>
          <div style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, #09203e, rgba(9,32,62,0.3))' }} />
        </div>
        <div>
          <p className="font-body leading-relaxed mb-4" style={{ fontSize: '1.05rem', color: '#333' }}>
            Soccerex connects the people who drive the game forward.
          </p>
          <p className="font-body leading-relaxed mb-6" style={{ fontSize: '0.95rem', color: '#666' }}>
            Across every event, we bring together:
          </p>
          <div className="space-y-4 mb-8">
            {bullets.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(9,32,62,0.08)', border: '1px solid rgba(9,32,62,0.12)' }}>
                  <item.icon size={18} style={{ color: '#09203e' }} />
                </div>
                <p className="font-body" style={{ fontSize: '0.95rem', color: '#222' }}>{item.text}</p>
              </div>
            ))}
          </div>
          <p className="font-body leading-relaxed" style={{ fontSize: '0.95rem', color: '#555' }}>
            Our role is simple: <span style={{ color: '#09203e', fontWeight: 600 }}>Create an environment where the right conversations happen.</span>
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── SECTION 3: VALUE PILLARS ────────────────────────────────────────────────
function ValuePillarsSection() {
  const cards = [
    { title: 'Meaningful Connections', body: 'We prioritize quality over volume, bringing together individuals who are actively building, investing in, and shaping football.' },
    { title: 'Relevant Conversations', body: 'Our programming focuses on the real topics driving the industry: commercial growth to ownership, infrastructure, and innovation.' },
    { title: 'Global Perspective', body: 'With participants from across every major football market, Soccerex reflects the true scale of the game.' },
    { title: 'Access That Matters', body: 'We don\'t just create space. We help facilitate the right introductions and interactions.' },
  ]

  return (
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0e2a4f 0%, #09203e 100%)' }}>
      {/* Section number watermark */}
      <div className="absolute top-8 left-8 font-heading font-bold text-white/[0.03] pointer-events-none select-none" style={{ fontSize: 'clamp(8rem, 20vw, 16rem)', lineHeight: 1 }}>02</div>

      <div className="relative z-10" style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="text-center mb-16">
          <p className="section-label text-gold mb-4 fade-up">02 &middot; WHAT WE DO</p>
          <h2 className="font-heading font-bold text-white leading-tight fade-up gold-underline mx-auto" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', maxWidth: '600px' }}>
            Built Around How the Game Actually Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, i) => (
            <div key={i} className="card-hover fade-up p-8 rounded-sm" style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(191,177,112,0.12)',
              backdropFilter: 'blur(10px)',
            }}>
              <div className="w-1 h-8 mb-4 rounded-full" style={{ background: 'linear-gradient(to bottom, #bfb170, rgba(191,177,112,0.2))' }} />
              <h3 className="font-heading font-semibold text-white text-lg mb-3">{card.title}</h3>
              <p className="font-body text-white/65 leading-relaxed" style={{ fontSize: '0.95rem' }}>{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── SECTION 4: EVENTS ──────────────────────────────────────────────────────
function EventsSection() {
  const events = [
    { name: 'Soccerex Europe', city: 'Amsterdam', desc: 'The meeting point for European football leaders, commercial partners, and investors navigating one of the most mature and competitive markets in the game.' },
    { name: 'Soccerex Miami', city: 'Miami', desc: 'A global gateway connecting North America, Latin America, and international football stakeholders across investment, growth, and innovation.' },
    { name: 'Soccerex Middle East', city: 'Riyadh', desc: 'Positioned at the center of one of the fastest-growing regions in global sport, bringing together capital, infrastructure, and football leadership.' },
  ]

  return (
    <section id="events" className="relative overflow-hidden" style={{ background: '#061729' }}>
      {/* Stadium-style gradient overlay */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center top, rgba(26,63,191,0.08) 0%, transparent 60%)' }} />
      {/* Section number watermark */}
      <div className="absolute top-8 right-8 font-heading font-bold text-white/[0.03] pointer-events-none select-none" style={{ fontSize: 'clamp(8rem, 20vw, 16rem)', lineHeight: 1 }}>03</div>

      <div className="relative z-10" style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="text-center mb-16">
          <p className="section-label text-gold mb-4 fade-up">03 &middot; EVENTS</p>
          <h2 className="font-heading font-bold text-white leading-tight mb-4 fade-up gold-underline mx-auto" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            Global Events. Real Industry Access.
          </h2>
          <p className="font-body text-white/65 leading-relaxed fade-up mx-auto" style={{ fontSize: '1.05rem', maxWidth: '650px' }}>
            Each Soccerex event is designed around a specific market and audience, bringing together the key stakeholders shaping football in that region.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event, i) => (
            <div key={i} className="card-hover fade-up group relative overflow-hidden rounded-sm" style={{
              background: 'linear-gradient(135deg, rgba(14,42,79,0.8) 0%, rgba(9,32,62,0.9) 100%)',
              border: '1px solid rgba(191,177,112,0.12)',
            }}>
              {/* Top accent bar */}
              <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #bfb170, rgba(26,63,191,0.6))' }} />
              <div className="p-8">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={14} className="text-gold" />
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">{event.city}</span>
                </div>
                <h3 className="font-heading font-semibold text-white text-xl mb-4">{event.name}</h3>
                <p className="font-body text-white/60 leading-relaxed" style={{ fontSize: '0.9rem' }}>{event.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 fade-up">
          <button className="inline-flex items-center gap-2 font-body font-semibold text-sm uppercase tracking-[0.15em] px-8 py-4 transition-all duration-300 cursor-pointer text-white border-none"
            style={{ background: 'rgba(191,177,112,0.15)', border: '1px solid rgba(191,177,112,0.3)' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#bfb170'; e.currentTarget.style.color = '#09203e' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(191,177,112,0.15)'; e.currentTarget.style.color = 'white' }}>
            View All Events
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── SECTION 5: FEATURED PARTNERS & SPONSORS ────────────────────────────────
// Logos that need extra brightness because they're dark/colored on transparent
const BRIGHT_LOGOS = new Set(['AFA Argentina', 'Street Child United', 'Mas+ by Messi', 'FC Business', 'Grenada Football Association'])

const SPONSOR_LOGOS = [
  { src: '/images/sponsors/neau-water.png', alt: 'Neau Water' },
  { src: '/images/sponsors/value-4-sports.png', alt: 'Value 4 Sports' },
  { src: '/images/sponsors/afa-argentina.png', alt: 'AFA Argentina' },
  { src: '/images/sponsors/sports-com.webp', alt: 'Sports.com' },
  { src: '/images/sponsors/capillary-flow.webp', alt: 'CapillaryFlow' },
  { src: '/images/sponsors/sports-illustrated-tickets.png', alt: 'Sports Illustrated Tickets' },
  { src: '/images/sponsors/street-child-united.png', alt: 'Street Child United' },
  { src: '/images/sponsors/mas-by-messi.png', alt: 'Mas+ by Messi', whiteBg: true },
  { src: '/images/sponsors/fc-business.png', alt: 'FC Business', whiteBg: true },
  { src: '/images/sponsors/waff-foundation.png', alt: 'WAFF Foundation' },
  { src: '/images/sponsors/conifa.png', alt: 'CONIFA' },
  { src: '/images/sponsors/soccer5s.png', alt: 'Soccer5s' },
  { src: '/images/sponsors/sun-global.png', alt: 'Sun Global Transportation' },
  { src: '/images/sponsors/grenada-fa.png', alt: 'Grenada Football Association' },
]

const EXHIBITOR_LOGOS = [
  { src: '/images/exhibitors/squire-patton-boggs.png', alt: 'Squire Patton Boggs' },
  { src: '/images/exhibitors/liveu.png', alt: 'LiveU' },
  { src: '/images/exhibitors/sofascore.png', alt: 'Sofascore' },
  { src: '/images/exhibitors/balancebox.png', alt: 'BalanceBox' },
  { src: '/images/exhibitors/wicket.webp', alt: 'Wicket' },
]

const ORG_LOGOS = [
  { src: '/images/organisations/img.webp', alt: 'IMG' },
  { src: '/images/organisations/livescore.webp', alt: 'LiveScore' },
  { src: '/images/organisations/elite-football-academy.webp', alt: 'Elite Football Academy Ghana' },
  { src: '/images/organisations/challenger-sports.webp', alt: 'Challenger Sports' },
  { src: '/images/organisations/cbf-usa.webp', alt: 'CBF USA' },
]

function LogoMarquee({ logos, direction = 'left', speed = 30, invert = true, height = 50 }) {
  const tripled = [...logos, ...logos, ...logos]
  return (
    <div className="overflow-hidden" style={{
      maskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
    }}>
      <div
        className="flex items-center"
        style={{
          gap: `clamp(40px, 6vw, 80px)`,
          animation: `marquee-${direction} ${speed}s linear infinite`,
          width: 'max-content',
        }}
      >
        {tripled.map((logo, i) => (
          <img
            key={`${logo.alt}-${i}`}
            src={logo.src}
            alt={logo.alt}
            style={{ height: `${height}px`, width: 'auto', objectFit: 'contain', filter: invert ? 'grayscale(1) brightness(0) invert(1)' : 'none', opacity: invert ? 0.5 : 0.8 }}
          />
        ))}
      </div>
    </div>
  )
}

function SocialProofSection() {
  return (
    <section className="relative overflow-hidden" style={{ background: '#09203e' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(191,177,112,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(191,177,112,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />
      <div className="absolute top-8 left-8 font-heading font-bold text-white/[0.03] pointer-events-none select-none" style={{ fontSize: 'clamp(8rem, 20vw, 16rem)', lineHeight: 1 }}>04</div>

      <div className="relative z-10" style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="text-center mb-16">
          <p className="section-label text-gold mb-4 fade-up">04 &middot; TRUSTED</p>
          <h2 className="font-heading font-bold text-white leading-tight mb-4 fade-up gold-underline mx-auto" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            Featured Partners & Sponsors
          </h2>
          <p className="font-body text-white/65 leading-relaxed fade-up mx-auto" style={{ fontSize: '1.05rem', maxWidth: '650px' }}>
            For 30 years, Soccerex has worked with the organizations shaping football at every level. From clubs and leagues to brands and governing bodies.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 fade-up">
          {SPONSOR_LOGOS.map((logo) => (
            <div
              key={logo.alt}
              className="flex items-center justify-center px-5 py-3 rounded-lg transition-all duration-300"
              style={{ background: logo.whiteBg ? '#fff' : 'linear-gradient(135deg, #f0eeeb 0%, #e4e2de 100%)', border: '1px solid #dddbd7', borderRadius: '10px' }}
              onMouseEnter={e => { if (!logo.whiteBg) e.currentTarget.style.background = 'linear-gradient(135deg, #f5f3f0 0%, #eae8e4 100%)'; e.currentTarget.style.borderColor = '#d0cec9' }}
              onMouseLeave={e => { if (!logo.whiteBg) e.currentTarget.style.background = 'linear-gradient(135deg, #f0eeeb 0%, #e4e2de 100%)'; e.currentTarget.style.borderColor = '#dddbd7' }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                style={{
                  height: '32px', width: 'auto', objectFit: 'contain',
                }}
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── EXHIBITORS (White section) ──────────────────────────────────────────────
function ExhibitorsSection() {
  return (
    <section style={{ background: '#fff', padding: 'clamp(80px,10vw,120px) 0' }}>
      <h2 className="font-heading font-bold text-center uppercase leading-tight mb-12 fade-up" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#09203e', letterSpacing: '0.02em' }}>
        Exhibitors
      </h2>
      <LogoMarquee logos={EXHIBITOR_LOGOS} direction="left" speed={18} invert={false} height={38} />
    </section>
  )
}

// ─── ORGANISATIONS IN ATTENDANCE (White section) ─────────────────────────────
function OrganisationsSection() {
  return (
    <section style={{ background: '#fff', borderTop: '1px solid #eee', padding: 'clamp(80px,10vw,120px) 0' }}>
      <h2 className="font-heading font-bold text-center uppercase leading-tight mb-12 fade-up" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#09203e', letterSpacing: '0.02em' }}>
        Organisations in Attendance
      </h2>
      <LogoMarquee logos={ORG_LOGOS} direction="right" speed={20} invert={false} height={40} />
    </section>
  )
}

// ─── PROUD SPONSOR (Video banner) ────────────────────────────────────────────
function ProudSponsorSection() {
  return (
    <section style={{ background: '#fff', borderTop: '1px solid #eee', padding: 'clamp(80px,10vw,120px) clamp(24px,5vw,80px) 0' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
        <h2 className="font-heading font-bold uppercase leading-tight mb-4 fade-up" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#09203e', letterSpacing: '0.02em' }}>
          Proud Sponsor of Soccerex
        </h2>
        <p className="font-body leading-relaxed fade-up mx-auto" style={{ fontSize: '1.05rem', color: '#555', maxWidth: '700px' }}>
          <span style={{ color: '#c8302c', fontWeight: 700 }}>SPORTS.COM</span> is proud to be an official sponsor of three major Soccerex events in 2025, supporting the global sports business community through innovation, media, and strategic partnerships.
        </p>
      </div>
      {/* Full-width video banner */}
      <div className="relative fade-up" style={{ width: '100%', aspectRatio: '21/9', overflow: 'hidden', borderRadius: '16px 16px 0 0', maxWidth: '1200px', margin: '0 auto' }}>
        <video
          autoPlay muted loop playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        >
          <source src="/images/partners/sports-com-bg.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,32,62,0.9) 0%, rgba(9,32,62,0.3) 50%, transparent 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 text-center" style={{ padding: 'clamp(24px, 4vw, 48px)' }}>
          <p className="font-heading font-bold uppercase text-white/60 tracking-[0.15em] mb-2" style={{ fontSize: '0.85rem' }}>Sponsored By</p>
          <img src="/images/partners/sports-com-logo-full.png" alt="Sports.com" style={{ height: '32px', width: 'auto', margin: '0 auto', filter: 'brightness(0) invert(1)' }} />
        </div>
      </div>
    </section>
  )
}

// ─── TESTIMONIALS (Gold cards with photos) ───────────────────────────────────
const TESTIMONIALS = [
  { quote: 'Soccerex is legendary. It is a collection of incredible minds and people from the industry.', author: 'Alexi Lalas', role: 'Fox Sports, Former USMNT', img: '/images/testimonials/alexi-lalas.webp' },
  { quote: 'Soccerex is a great event, I am very happy to be here again.', author: 'Gianni Infantino', role: 'FIFA President', img: '/images/testimonials/gianni-infantino.webp' },
  { quote: "Soccerex brings football together; generally people meeting each other, businesses with organisations, associations, with clubs; it's important, football is absolutely huge, the power of football to pull people together around the world and to connect with people is enormous.", author: 'Gary Neville', role: 'Sky Sports, Former England International', img: '/images/testimonials/gary-neville.webp' },
  { quote: "Soccerex is not just a good idea it is necessary, it's part of the football calendar.", author: 'Guillem Ballague', role: 'Football Journalist, Author', img: '/images/testimonials/guillem-ballague.webp' },
  { quote: 'Soccerex to me is about exchange, an exchange of ideas, an exchange of opportunities.', author: 'Jason Roberts MBE', role: 'CONCACAF Director of Development', img: '/images/testimonials/jason-roberts.webp' },
  { quote: 'For LaLiga, being at Soccerex, it is not only important, it is essential.', author: 'Javier Tebas', role: 'LaLiga President', img: '/images/testimonials/javier-tebas.webp' },
  { quote: "To come here and meet the people and learn the things that I've learnt in the sessions, in networking moments, and even in the cafe, it's absolutely blown me away.", author: 'Amanda Vandervort', role: 'USL Super League President', img: '/images/testimonials/amanda-vandervort.webp' },
  { quote: "Any time I get to be surrounded by people who have the same passion for the game that I do, the conversations that teach you and help you grow and learn, that's why I love it.", author: 'Karina La Blanc', role: 'Portland Thorns GM', img: '/images/testimonials/karina-la-blanc.webp' },
]

function TestimonialsSection() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(prev => (prev + 1) % TESTIMONIALS.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const t = TESTIMONIALS[active]

  return (
    <section style={{ background: '#fff', padding: 'clamp(80px,10vw,120px) clamp(24px,5vw,80px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Heading with gold left border */}
        <div className="flex items-start gap-4 mb-12 fade-up">
          <div style={{ width: '6px', height: 'clamp(50px, 8vw, 80px)', background: '#bfb170', borderRadius: '3px', flexShrink: 0, marginTop: '4px' }} />
          <h2 className="font-heading font-bold uppercase leading-none" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#09203e', letterSpacing: '0.02em' }}>
            Testimonials
          </h2>
        </div>

        {/* Testimonial card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 fade-up" style={{ borderRadius: '16px', overflow: 'hidden', minHeight: '400px' }}>
          {/* Photo side */}
          <div className="md:col-span-5 relative" style={{ minHeight: '300px' }}>
            {TESTIMONIALS.map((item, i) => (
              <img
                key={item.author}
                src={item.img}
                alt={item.author}
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                  opacity: i === active ? 1 : 0,
                  transition: 'opacity 0.8s ease',
                }}
              />
            ))}
          </div>

          {/* Quote side */}
          <div className="md:col-span-7 relative" style={{ background: '#bfb170', padding: 'clamp(32px, 5vw, 56px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* Decorative quote marks */}
            <span className="font-heading font-bold absolute" style={{ top: 'clamp(16px, 3vw, 32px)', left: 'clamp(24px, 4vw, 48px)', fontSize: 'clamp(3rem, 5vw, 5rem)', color: 'rgba(9,32,62,0.15)', lineHeight: 1 }}>"</span>
            <span className="font-heading font-bold absolute" style={{ bottom: 'clamp(16px, 3vw, 32px)', right: 'clamp(24px, 4vw, 48px)', fontSize: 'clamp(3rem, 5vw, 5rem)', color: 'rgba(9,32,62,0.15)', lineHeight: 1 }}>"</span>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <p className="font-body leading-relaxed mb-8" style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)', color: '#1a1a1a' }}>
                {t.quote}
              </p>
              <p className="font-heading font-bold uppercase" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.3rem)', color: '#09203e', letterSpacing: '0.02em' }}>
                {t.author}
              </p>
              <p className="font-body uppercase tracking-[0.1em]" style={{ fontSize: '0.8rem', color: 'rgba(9,32,62,0.6)', marginTop: '4px' }}>
                {t.role}
              </p>
            </div>

            {/* Navigation dots */}
            <div className="flex gap-2 mt-8">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="border-none cursor-pointer transition-all duration-300"
                  style={{
                    width: i === active ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: i === active ? '#09203e' : 'rgba(9,32,62,0.25)',
                  }}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── SOCCEREX HERITAGE (World map with react-simple-maps) ────────────────────
const HERITAGE_CITIES = [
  { name: 'London', coords: [-0.12, 51.51] },
  { name: 'Manchester', coords: [-2.24, 53.48] },
  { name: 'Amsterdam', coords: [4.9, 52.37] },
  { name: 'Paris', coords: [2.35, 48.86] },
  { name: 'Lisbon', coords: [-9.14, 38.74] },
  { name: 'Rio de Janeiro', coords: [-43.17, -22.91] },
  { name: 'Brasilia', coords: [-47.93, -15.78] },
  { name: 'Belem', coords: [-48.50, -1.46] },
  { name: 'Johannesburg', coords: [28.05, -26.20] },
  { name: 'Durban', coords: [31.05, -29.86] },
  { name: 'Dubai', coords: [55.27, 25.20] },
  { name: 'Doha', coords: [51.53, 25.29] },
  { name: 'Cairo', coords: [31.24, 30.04] },
  { name: 'Lagos', coords: [3.38, 6.45] },
  { name: 'Singapore', coords: [103.82, 1.35] },
  { name: 'Zhuhai', coords: [113.58, 22.28] },
  { name: 'Jordan', coords: [35.93, 31.95] },
  { name: 'Miami', coords: [-80.19, 25.76] },
  { name: 'Los Angeles', coords: [-118.24, 34.05] },
  { name: 'Mexico City', coords: [-99.13, 19.43] },
  { name: 'Barbados', coords: [-59.60, 13.19] },
]

function HeritageSvgMap() {
  const [paths, setPaths] = useState([])
  const [hoveredCity, setHoveredCity] = useState(null)

  function proj(lon, lat) {
    const x = ((lon + 180) / 360) * 960
    const latRad = (lat * Math.PI) / 180
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2))
    const y = 280 - (960 * mercN) / (2 * Math.PI)
    return [x, y]
  }

  function ringToPath(ring) {
    return ring.map(([lon, lat], i) => {
      const [x, y] = proj(lon, lat)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    }).join('') + 'Z'
  }

  useEffect(() => {
    fetch('/data/land-110m.json')
      .then(r => r.json())
      .then(topo => {
        const land = feature(topo, topo.objects.land)
        const features = land.type === 'FeatureCollection' ? land.features : [land]
        const allPaths = []
        features.forEach(f => {
          const geom = f.geometry || f
          const polys = geom.type === 'MultiPolygon' ? geom.coordinates : [geom.coordinates]
          polys.forEach(polygon => {
            polygon.forEach(ring => {
              allPaths.push(ringToPath(ring))
            })
          })
        })
        setPaths(allPaths)
      })
  }, [])

  return (
    <svg viewBox="0 40 960 480" style={{ width: '100%', height: 'auto', maxWidth: '1000px', margin: '0 auto', display: 'block' }}>
      {paths.map((d, i) => (
        <path key={i} d={d} fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      ))}
      {HERITAGE_CITIES.map(city => {
        const [cx, cy] = proj(city.coords[0], city.coords[1])
        const isHovered = hoveredCity === city.name
        return (
          <g key={city.name}
            onMouseEnter={() => setHoveredCity(city.name)}
            onMouseLeave={() => setHoveredCity(null)}
            style={{ cursor: 'pointer' }}
          >
            <circle cx={cx} cy={cy} r={8} fill="rgba(74,144,217,0.15)" />
            <circle cx={cx} cy={cy} r={4} fill="#4a90d9" stroke="rgba(74,144,217,0.4)" strokeWidth={2}>
              {isHovered && <animate attributeName="r" from="4" to="7" dur="0.3s" fill="freeze" />}
            </circle>
            {isHovered && (
              <g>
                <rect x={cx - city.name.length * 3.5 - 6} y={cy - 26} width={city.name.length * 7 + 12} height={18} rx={4} fill="rgba(9,32,62,0.95)" stroke="rgba(74,144,217,0.3)" strokeWidth={0.5} />
                <text x={cx} y={cy - 14} textAnchor="middle" fill="#fff" fontSize="9" fontFamily="Inter, sans-serif">{city.name}</text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function HeritageMapSection() {
  return (
    <section className="relative" style={{ background: 'linear-gradient(135deg, #050d1a 0%, #0B213D 50%, #061729 100%)', overflow: 'visible' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center', padding: 'clamp(60px,8vw,100px) clamp(24px,5vw,80px) 0', position: 'relative', zIndex: 3 }}>
        <p className="section-label text-gold mb-4 fade-up">GLOBAL REACH</p>
        <h2 className="font-heading font-bold text-white leading-tight mb-4 fade-up gold-underline mx-auto" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
          55 Events. 21 Cities. 30 Years.
        </h2>
        <p className="font-body text-white/60 leading-relaxed fade-up mx-auto" style={{ fontSize: '1.05rem', maxWidth: '650px' }}>
          Since 1996, Soccerex has brought the football business world together across six continents. From Wembley to the Maracana, from Amsterdam to Miami, the game's leaders gather wherever Soccerex goes.
        </p>
      </div>

      <div className="fade-up" style={{ marginTop: '-6vw' }}>
        <InteractiveGlobe />
      </div>
    </section>
  )
}

// ─── SECTION 6: WHY SOCCEREX ────────────────────────────────────────────────
function WhySoccerexSection() {
  return (
    <section id="why-soccerex" className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #061729 0%, #0e2a4f 50%, #09203e 100%)' }}>
      <NetworkNodes color="#bfb170" nodeCount={20} opacity={0.08} />
      {/* Section number watermark */}
      <div className="absolute top-8 right-8 font-heading font-bold text-white/[0.03] pointer-events-none select-none" style={{ fontSize: 'clamp(8rem, 20vw, 16rem)', lineHeight: 1 }}>05</div>

      <div className="relative z-10" style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <p className="section-label text-gold mb-4 fade-up">05 &middot; WHY SOCCEREX</p>
        <h2 className="font-heading font-bold text-white leading-tight mb-8 fade-up gold-underline" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
          Why Soccerex
        </h2>
        <p className="font-body text-white/80 leading-relaxed mb-4 fade-up" style={{ fontSize: '1.1rem' }}>
          In an industry built on relationships, access matters.
        </p>
        <p className="font-body text-white/70 leading-relaxed mb-4 fade-up" style={{ fontSize: '1.05rem' }}>
          Soccerex exists to bring together the people who move the game forward, and give them a reason to engage.
        </p>
        <p className="font-body text-white/65 leading-relaxed mb-2 fade-up" style={{ fontSize: '1.05rem' }}>
          We are not built around scale for the sake of it.
        </p>
        <p className="font-heading font-semibold text-gold leading-relaxed fade-up" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)' }}>
          We are built around relevance.
        </p>
      </div>
    </section>
  )
}

// ─── SECTION 7: HERITAGE GALLERY ────────────────────────────────────────────
const HERITAGE_IMAGES = [
  { src: '/hero/04-TIER1-bobby-charlton-handprints.jpg', caption: 'Sir Bobby Charlton', event: 'A legend honored at Soccerex', categories: ['heritage'] },
  { src: '/hero/01-TIER1-ronaldo.jpg', caption: 'Ronaldo', event: 'Where legends meet the business of football', categories: ['heritage'] },
  { src: '/hero/02-TIER1-vieira-soccerex07.jpg', caption: 'Patrick Vieira', event: 'Champions shaping the next generation', categories: ['heritage'] },
  { src: '/hero/03-TIER1-infantino-fifa-president.jpg', caption: 'Gianni Infantino', event: 'Global leadership, one conversation at a time', categories: ['heritage'] },
  { src: '/hero/05-TIER1-jordi-cruyff-14.jpg', caption: 'Jordi Cruyff', event: 'Legacy runs deep at Soccerex', categories: ['heritage'] },
  { src: '/hero/06-TIER1-juan-mata-shirt.jpg', caption: 'Juan Mata', event: 'Players who care about the game beyond the pitch', categories: ['heritage'] },
  { src: '/hero/07-TIER1-van-der-sar.jpg', caption: 'Edwin van der Sar', event: 'From the pitch to the boardroom', categories: ['heritage'] },
  { src: '/hero/11-TIER1-alexi-lalas.jpg', caption: 'On Stage at Soccerex', event: 'The conversations that shape football', categories: ['heritage'] },
  { src: '/hero/15-TIER2-asian-forum-panel.jpg', caption: 'Soccerex Asian Forum', event: 'Connecting football across continents', categories: ['heritage'] },
  { src: '/hero/16-TIER2-football-for-hope-youth.jpg', caption: 'Football for Hope', event: 'The game\'s power to change lives', categories: ['heritage'] },
  { src: '/hero/22-NEW-soccerex-brasil-auditorium.jpg', caption: 'Soccerex Global Convention', event: 'Thousands gathering for the love of the game', categories: ['heritage'] },
  { src: '/hero/09-TIER1-jenny-chiu-diverse-panel.jpg', caption: 'Connecting the Industry', event: 'Where the football world comes together', categories: ['heritage'] },
]

function HeritageGallerySection() {
  return (
    <section className="relative overflow-hidden" style={{ background: '#0c1a2e' }}>
      {/* Large 30 watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-heading font-bold" style={{ fontSize: 'clamp(15rem, 40vw, 35rem)', lineHeight: 1, color: 'rgba(191,177,112,0.04)' }}>30</span>
      </div>
      <div className="absolute top-8 left-8 font-heading font-bold text-white/[0.03] pointer-events-none select-none" style={{ fontSize: 'clamp(8rem, 20vw, 16rem)', lineHeight: 1 }}>06</div>

      <div className="relative z-10" style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)' }}>
        {/* Header */}
        <div style={{ maxWidth: '700px', marginBottom: 'clamp(2rem, 4vw, 3.5rem)' }}>
          <p className="section-label text-gold mb-4 fade-up">06 &middot; HERITAGE</p>
          <h2 className="font-heading font-bold text-white leading-tight mb-6 fade-up gold-underline" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            Three Decades of Serving the Game
          </h2>
          <p className="font-body text-white/75 leading-relaxed fade-up" style={{ fontSize: '1.05rem' }}>
            For 30 years, we've had the privilege of bringing together the people who shape football. We couldn't be prouder of the community that's grown around Soccerex. Every handshake, every conversation, every partnership has been an honor.
          </p>
        </div>

        {/* Heritage image grid */}
        <div className="fade-up">
          <ImageGrid images={HERITAGE_IMAGES} columns={3} showCaptions={true} maxItems={12} />
        </div>

        {/* CTA */}
        <div className="text-center fade-up" style={{ marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 font-body font-semibold text-sm uppercase tracking-[0.15em] px-8 py-4 transition-all duration-300 cursor-pointer border-none"
            style={{ background: 'transparent', border: '1px solid rgba(191,177,112,0.4)', color: 'var(--color-gold)', textDecoration: 'none' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#bfb170'; e.currentTarget.style.background = 'rgba(191,177,112,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(191,177,112,0.4)'; e.currentTarget.style.background = 'transparent' }}
          >
            Explore the Full Gallery
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── SECTION 8: FINAL CTA ──────────────────────────────────────────────────
function FinalCTASection() {
  return (
    <section id="partner" className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #09203e 0%, #0e2a4f 50%, #061729 100%)' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(191,177,112,0.06) 0%, transparent 60%)' }} />

      <div className="relative z-10 text-center" style={{ maxWidth: '700px', margin: '0 auto', padding: 'clamp(80px,12vw,140px) clamp(24px,5vw,80px)' }}>
        <h2 className="font-heading font-bold text-white leading-tight mb-8 fade-up text-glow" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          Be Part of What's Next in Football
        </h2>
        <div className="fade-up">
          <button className="inline-flex items-center gap-2 font-body font-semibold text-sm uppercase tracking-[0.15em] px-10 py-5 transition-all duration-300 cursor-pointer border-none"
            style={{ background: '#bfb170', color: '#09203e', fontSize: '0.95rem' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#d4c78e'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#bfb170'; e.currentTarget.style.transform = 'translateY(0)' }}>
            Join Soccerex
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── FOOTER ─────────────────────────────────────────────────────────────────
function Footer() {
  const footerLinks = ['Events', 'About', 'Attend', 'Partner', 'Content']

  return (
    <footer className="relative" style={{ background: '#050d1a', borderTop: '1px solid rgba(191,177,112,0.1)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(48px,6vw,80px) clamp(24px,5vw,80px)' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Logo + tagline */}
          <div>
            <span className="font-heading font-bold text-white tracking-[0.08em] text-xl block mb-3">SOCCEREX</span>
            <p className="font-mono text-xs text-white/40 uppercase tracking-[0.15em]">30 Years of Football Business</p>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 md:justify-center">
            {footerLinks.map((link) => (
              <span key={link} className="font-body text-sm text-white/50 hover:text-white/80 transition-colors cursor-pointer">{link}</span>
            ))}
          </div>

          {/* Social placeholders + copyright */}
          <div className="md:text-right">
            <div className="flex gap-3 mb-4 md:justify-end">
              {['X', 'LI', 'IG'].map((s) => (
                <div key={s} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono text-white/30 cursor-pointer hover:text-white/60 transition-colors" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                  {s}
                </div>
              ))}
            </div>
            <p className="font-body text-xs text-white/30">&copy; 2026 Soccerex. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── HOME PAGE ──────────────────────────────────────────────────────────────
export default function Home() {
  useScrollAnimations()

  return (
    <>
      <HeroSlideshow />
      <UpcomingEventSection />
      <PixelDivider color="#1a0000" layers={4} height={90} speed={0.6} />
      <MeetingPointSection />
      <TopoDivider color="#0e2a4f" bgColor="#0c1a2e" lineOnly />
      <ValuePillarsSection />
      <PixelDivider color="#09203e" layers={4} height={90} speed={0.5} />
      <EventsSection />
      <TopoDivider color="#09203e" bgColor="#061729" lineOnly />
      <SocialProofSection />
      <PixelDivider color="#09203e" layers={4} height={90} speed={0.7} />
      <ExhibitorsSection />
      <OrganisationsSection />
      <ProudSponsorSection />
      <TestimonialsSection />
      <HeritageMapSection />
      <WhySoccerexSection />
      <TopoDivider color="#0c1a2e" bgColor="#061729" lineOnly />
      <HeritageGallerySection />
      <PixelDivider color="#0c1a2e" layers={4} height={90} speed={0.5} />
      <FinalCTASection />
      <Footer />
    </>
  )
}
