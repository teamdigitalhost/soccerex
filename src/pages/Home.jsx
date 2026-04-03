import { useEffect } from 'react'
import { Users, MessageSquare, Globe, KeyRound, MapPin, ArrowRight } from 'lucide-react'
import NetworkNodes from '../animations/NetworkNodes'
import TopoDivider from '../components/TopoDivider'
import HeroSlideshow from '../components/HeroSlideshow'

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
          For three decades, Soccerex has brought together the people shaping the global game — from clubs and leagues to investors, brands, and innovators.
        </p>
        <p className="font-body text-white/60 leading-relaxed mb-10 fade-up" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
          What started as an event has become a global meeting point for the football industry — where relationships are built, ideas are tested, and opportunities take shape.
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

// ─── SECTION 2: MEETING POINT ────────────────────────────────────────────────
function MeetingPointSection() {
  const bullets = [
    { icon: Users, text: 'Club executives and owners' },
    { icon: Users, text: 'League and federation leaders' },
    { icon: KeyRound, text: 'Investors and family offices' },
    { icon: Globe, text: 'Brands, media, and technology companies' },
  ]

  return (
    <section id="about" className="relative overflow-hidden" style={{ background: '#0c1a2e' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(26,63,191,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(26,63,191,0.05) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />
      {/* Section number watermark */}
      <div className="absolute top-8 right-8 font-heading font-bold text-white/[0.03] pointer-events-none select-none" style={{ fontSize: 'clamp(8rem, 20vw, 16rem)', lineHeight: 1 }}>01</div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20" style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(80px,10vw,130px) clamp(24px,5vw,80px)' }}>
        <div>
          <p className="section-label text-gold mb-4 fade-up">01 &middot; THE PLATFORM</p>
          <h2 className="font-heading font-bold text-white leading-tight mb-6 fade-up gold-underline" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            The Meeting Point for Global Football Business
          </h2>
        </div>
        <div>
          <p className="font-body text-white/80 leading-relaxed mb-4 fade-up" style={{ fontSize: '1.05rem' }}>
            Soccerex connects the people who drive the game forward.
          </p>
          <p className="font-body text-white/60 leading-relaxed mb-6 fade-up" style={{ fontSize: '0.95rem' }}>
            Across every event, we bring together:
          </p>
          <div className="space-y-4 mb-8">
            {bullets.map((item, i) => (
              <div key={i} className="flex items-center gap-4 fade-up">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(191,177,112,0.1)', border: '1px solid rgba(191,177,112,0.2)' }}>
                  <item.icon size={18} className="text-gold" />
                </div>
                <p className="font-body text-white/85" style={{ fontSize: '0.95rem' }}>{item.text}</p>
              </div>
            ))}
          </div>
          <p className="font-body text-white/70 leading-relaxed fade-up" style={{ fontSize: '0.95rem' }}>
            Our role is simple — <span className="text-gold font-medium">Create an environment where the right conversations happen.</span>
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── SECTION 3: VALUE PILLARS ────────────────────────────────────────────────
function ValuePillarsSection() {
  const cards = [
    { title: 'Meaningful Connections', body: 'We prioritize quality over volume — bringing together individuals who are actively building, investing in, and shaping football.' },
    { title: 'Relevant Conversations', body: 'Our programming focuses on the real topics driving the industry — from commercial growth to ownership, infrastructure, and innovation.' },
    { title: 'Global Perspective', body: 'With participants from across every major football market, Soccerex reflects the true scale of the game.' },
    { title: 'Access That Matters', body: 'We don\'t just create space — we help facilitate the right introductions and interactions.' },
  ]

  return (
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0e2a4f 0%, #09203e 100%)' }}>
      {/* Section number watermark */}
      <div className="absolute top-8 left-8 font-heading font-bold text-white/[0.03] pointer-events-none select-none" style={{ fontSize: 'clamp(8rem, 20vw, 16rem)', lineHeight: 1 }}>02</div>

      <div className="relative z-10" style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(80px,10vw,130px) clamp(24px,5vw,80px)' }}>
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

      <div className="relative z-10" style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(80px,10vw,130px) clamp(24px,5vw,80px)' }}>
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

// ─── SECTION 5: SOCIAL PROOF ────────────────────────────────────────────────
function SocialProofSection() {
  return (
    <section className="relative overflow-hidden" style={{ background: '#09203e' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(191,177,112,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(191,177,112,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />
      {/* Section number watermark */}
      <div className="absolute top-8 left-8 font-heading font-bold text-white/[0.03] pointer-events-none select-none" style={{ fontSize: 'clamp(8rem, 20vw, 16rem)', lineHeight: 1 }}>04</div>

      <div className="relative z-10" style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(80px,10vw,130px) clamp(24px,5vw,80px)' }}>
        <div className="text-center mb-16">
          <p className="section-label text-gold mb-4 fade-up">04 &middot; TRUSTED</p>
          <h2 className="font-heading font-bold text-white leading-tight mb-4 fade-up gold-underline mx-auto" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            Trusted Across the Global Game
          </h2>
          <p className="font-body text-white/65 leading-relaxed fade-up mx-auto" style={{ fontSize: '1.05rem', maxWidth: '650px' }}>
            For 30 years, Soccerex has worked with the organizations shaping football at every level — from clubs and leagues to brands and governing bodies.
          </p>
        </div>

        {/* Partner logo placeholder grid */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 fade-up">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center rounded-sm" style={{
              height: '80px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <span className="font-mono text-xs text-white/20 uppercase tracking-wider">Partner</span>
            </div>
          ))}
        </div>
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

      <div className="relative z-10" style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(80px,10vw,130px) clamp(24px,5vw,80px)' }}>
        <p className="section-label text-gold mb-4 fade-up">05 &middot; WHY SOCCEREX</p>
        <h2 className="font-heading font-bold text-white leading-tight mb-8 fade-up gold-underline" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
          Why Soccerex
        </h2>
        <p className="font-body text-white/80 leading-relaxed mb-4 fade-up" style={{ fontSize: '1.1rem' }}>
          In an industry built on relationships, access matters.
        </p>
        <p className="font-body text-white/70 leading-relaxed mb-4 fade-up" style={{ fontSize: '1.05rem' }}>
          Soccerex exists to bring together the people who move the game forward — and give them a reason to engage.
        </p>
        <p className="font-body text-white/65 leading-relaxed mb-2 fade-up" style={{ fontSize: '1.05rem' }}>
          We are not built around scale for the sake of it —
        </p>
        <p className="font-heading font-semibold text-gold leading-relaxed fade-up" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)' }}>
          We are built around relevance.
        </p>
      </div>
    </section>
  )
}

// ─── SECTION 7: 30 YEARS ────────────────────────────────────────────────────
function HeritageSection() {
  return (
    <section className="relative overflow-hidden" style={{ background: '#0c1a2e' }}>
      {/* Large 30 watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-heading font-bold" style={{ fontSize: 'clamp(15rem, 40vw, 35rem)', lineHeight: 1, color: 'rgba(191,177,112,0.04)' }}>30</span>
      </div>
      {/* Section number watermark */}
      <div className="absolute top-8 left-8 font-heading font-bold text-white/[0.03] pointer-events-none select-none" style={{ fontSize: 'clamp(8rem, 20vw, 16rem)', lineHeight: 1 }}>06</div>

      <div className="relative z-10" style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <p className="section-label text-gold mb-4 fade-up">06 &middot; HERITAGE</p>
        <h2 className="font-heading font-bold text-white leading-tight mb-8 fade-up gold-underline" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
          30 Years of Soccerex
        </h2>
        <p className="font-body text-white/80 leading-relaxed mb-4 fade-up" style={{ fontSize: '1.1rem' }}>
          Since 1996, Soccerex has been at the center of the football business landscape.
        </p>
        <p className="font-body text-white/70 leading-relaxed mb-4 fade-up" style={{ fontSize: '1.05rem' }}>
          From the early days of industry gatherings to today's global platform, we've evolved alongside the game — connecting generations of leaders, innovators, and partners.
        </p>
        <p className="font-body text-white/65 leading-relaxed mb-2 fade-up" style={{ fontSize: '1.05rem' }}>
          This year marks 30 years of bringing the football world together —
        </p>
        <p className="font-heading font-semibold text-gold leading-relaxed fade-up" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)' }}>
          and we're just getting started.
        </p>
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
      <TopoDivider color="#0c1a2e" bgColor="#09203e" />
      <MeetingPointSection />
      <TopoDivider color="#0e2a4f" bgColor="#0c1a2e" lineOnly />
      <ValuePillarsSection />
      <TopoDivider color="#061729" bgColor="#09203e" />
      <EventsSection />
      <TopoDivider color="#09203e" bgColor="#061729" lineOnly />
      <SocialProofSection />
      <TopoDivider color="#061729" bgColor="#09203e" />
      <WhySoccerexSection />
      <TopoDivider color="#0c1a2e" bgColor="#061729" lineOnly />
      <HeritageSection />
      <TopoDivider color="#09203e" bgColor="#0c1a2e" />
      <FinalCTASection />
      <Footer />
    </>
  )
}
