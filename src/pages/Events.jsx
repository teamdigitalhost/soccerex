import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, MapPin } from 'lucide-react'
import NetworkNodes from '../animations/NetworkNodes'
import PixelDivider from '../components/PixelDivider'
import { EUROPE_2026, MIAMI_2026 } from '../lib/routes'
import InquiryModalButton from '../components/InquiryModalButton'
import { sponsorshipSchema } from '../lib/leadSchemas'
import { useScrollAnimations } from '../lib/useScrollAnimations'

// ═══ UPCOMING EVENTS (2 featured) ════════════════════════════════════════════
const UPCOMING = [
  {
    logo: '/images/events/logos/miami.webp',
    label: 'SOCCEREX MIAMI',
    dates: 'September 23-25, 2026',
    city: 'Miami, USA',
    venue: 'Nu Stadium',
    image: '/events/miami/2026/sections/nu-stadium-miami-freedom-park.jpg',
    accent: '#E91E63',
    copy: 'The Americas event of the Soccerex platform, bringing football’s leaders, rightsholders, capital, brands, innovators, and strategic partners together at the center of the game’s biggest global moment.',
    comingSoon: true,
    detailsLink: MIAMI_2026,
  },
  {
    logo: '/events/middle-east/riyadh-logo-horizontal-placeholder.jpg',
    label: 'SOCCEREX RIYADH',
    dates: 'January 2027',
    city: 'Riyadh, Saudi Arabia',
    venue: 'Misk City',
    image: '/events/middle-east/2026/sections/riyadh-skyline.jpg',
    accent: '#0f8f52',
    copy: 'The Middle East anchor event of the Soccerex platform, connecting football’s global ecosystem with one of the world’s fastest-growing sports markets and a region driving major investment, innovation, infrastructure, and long-term football growth.',
    comingSoon: true,
  },
]

// ═══ RECENT EVENTS (past) ═════════════════════════════════════════════════════
const RECENT = [
  {
    logo: '/images/events/logos/europe.webp',
    label: 'SOCCEREX EUROPE 2026',
    dates: 'May 12-13, 2026',
    city: 'Johan Cruijff ArenA, Amsterdam',
    image: '/images/events/events/europe-ajax-arena.webp',
    copy: 'The 30th anniversary edition of Soccerex Europe wrapped a record-breaking gathering at the Johan Cruijff ArenA, bringing federations, leagues, clubs, brands, media, governing bodies, and football legends together to mark three decades of the platform.',
    link: '/europe-2026',
    internal: true,
  },
  {
    logo: '/images/events/logos/miami.webp',
    label: 'SOCCEREX MIAMI 2025',
    dates: 'November 11th - 13th, 2025',
    city: 'Miami Beach Convention Center',
    image: '/images/events/events/miami-2025-stage.jpg', // verified: shows "SOCCEREX MIAMI" on screen
    copy: 'In 2025, we hosted three large-scale events for the first time since 2019, marking a major milestone for the global football business industry. The trifecta of major gatherings continued with Soccerex Miami, which took place from 11th to 13th November at the Miami Beach Convention Center. Bringing together key stakeholders from across the football ecosystem, the event served as a global platform for innovation, collaboration, and shaping the future of the game.',
    link: 'https://soccerex.com/miami-2025/',
  },
  {
    logo: '/images/events/logos/europe.webp',
    label: 'SOCCEREX EUROPE 2025',
    dates: 'May 19th - 21st, 2025',
    city: 'Johan Cruijff ArenA, Amsterdam',
    image: '/images/events/events/europe-2025-knvb-stage.jpg', // VERIFIED: KNVB-branded Soccerex Europe 2025 stage, Amsterdam
    copy: 'Building on the success of Soccerex Europe 2024, which featured an insightful session on how AI was transforming football and standout discussions with speakers from TikTok, Ajax, and LALIGA, the football industry\'s premier European event returned to Amsterdam in 2025. Amsterdam, full of football innovation and rich history, provided the perfect backdrop for Soccerex Europe 2025. The renowned Johan Cruijff ArenA, an international leader in sustainability and fan experience, was the ideal venue for an event that celebrated and shaped the future of the beautiful game. Having previously staged Champions League finals and UEFA Euro 2000, this year\'s event proved to be a landmark gathering for federations, leagues, clubs, brands, media, governing bodies, and legends from across the globe.',
    link: 'https://soccerex.com/europe-2025/',
  },
  {
    logo: '/images/events/logos/mena.webp',
    label: 'SOCCEREX MENA 2025',
    dates: 'February 23rd - 26th, 2025',
    city: 'Cairo, Egypt',
    image: '/images/events/events/mena-2025-cairo-signing.jpg', // VERIFIED: MENA Cairo 2025 signing ceremony
    copy: 'Following the success of Soccerex Europe and Miami in 2024, 2025 saw us host three large-scale events for the first time since 2019. The football business industry\'s trifecta of major gatherings began with Soccerex MENA, in partnership with Sports Expo, held from February 23-26. This event was hosted in Cairo, Egypt, home of "The Pharaohs," the most successful national team in Africa Cup of Nations history.',
    link: 'https://soccerex.com/mena-2025/',
  },
  {
    logo: '/images/events/logos/miami.webp',
    label: 'SOCCEREX MIAMI 2024',
    dates: 'November 13th - 14th, 2024',
    city: 'Miami, USA',
    image: '/images/events/events/miami-2024-verified.jpg', // VERIFIED: packed keynote in hotel ballroom, Miami
    copy: 'After our fourth and most recent instalment in the magic city in November 2023 which saw 29-year-old Soccerex records shattered, it was confirmed that the USA is truly the beautiful games\' adopted home. With a World Cup to look forward to in under two years (by the time of the event), broadcasting figures at an all-time high and the MLS becoming a truly global product (even being home to arguably the greatest player in history), it is a remarkably exciting time for Soccer in the Americas.',
    link: 'https://soccerex.com/miami-2024/',
  },
  {
    logo: '/images/events/logos/europe.webp',
    label: 'SOCCEREX EUROPE 2024',
    dates: 'May 30th - 31st, 2024',
    city: 'Johan Cruijff ArenA, Amsterdam',
    image: '/images/events/events/europe-2025-verified.jpg', // VERIFIED: packed keynote, blue lit venue, Europe
    copy: 'It was a memorable occasion as football returned to European soil for the first time since 2019, hosted at the iconic home of AFC Ajax. After nearly 5 years, Soccerex brought the football business community together again in Amsterdam, just before the start of the European Championships in Germany.',
    link: 'https://soccerex.com/europe-2024/',
  },
  {
    logo: '/images/events/logos/miami.webp',
    label: 'SOCCEREX MIAMI 2023',
    dates: 'November 14th - 15th, 2023',
    city: 'Mana Wynwood Convention Center, Miami',
    image: '/images/events/events/miami-2023-verified.jpg', // VERIFIED: outdoor "SOCCEREX MIAMI" banner with crowd
    copy: 'Soccerex Miami will be held at the wonderful Mana Wynwood Convention Center, a venue that has been leading the way in the entertainment and arts industries since 2010. 70+ speakers will take the main stage, providing insight on a myriad of topics including but not limited to, performance, broadcasting, good governance, fan engagement, athlete development, technology, analytics, and major tournaments.',
    link: 'https://soccerex.com/miami-2023/',
  },
]

// BROCHURES constant retired along with the "Soccerex in Action" section.

// ═══ TESTIMONIALS (5 unique) ══════════════════════════════════════════════════
const TESTIMONIALS = [
  { quote: 'For LaLiga, being at Soccerex is not just important, it is essential.', name: 'Javier Tebas', title: 'President, LaLiga' },
  { quote: 'Soccerex is legendary, a collection of incredible minds and people from the industry.', name: 'Alexi Lalas', title: 'Anchor, Fox Sports' },
  { quote: 'Soccerex is in my opinion the premier football conference event. It\'s a great opportunity to meet with lots of people from within the industry and that\'s good for our business and good for us as a football club.', name: 'Ian Ayre', title: 'Former CEO, Liverpool FC' },
  { quote: 'I\'ve been a big supporter of Soccerex since I came into the industry many years ago. It\'s great not just for the MLS, but for the global football soccer industry.', name: 'Don Garber', title: 'Commissioner, MLS' },
  { quote: 'Soccerex is definitely the number one event that pulls the football industry together.', name: 'Fatma Samoura', title: 'General Secretary, FIFA' },
]

// ─── Event card (large, alternating layout) ────────────────────────────────
function EventCard({ event, index, dark = false }) {
  const isEven = index % 2 === 0
  const CopyArray = Array.isArray(event.copy) ? event.copy : [event.copy]
  const accent = event.accent || 'var(--color-brand-accent)'
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center mb-20 lg:mb-28">
      <div className={`${isEven ? 'lg:order-1 slide-left' : 'lg:order-2 slide-right'}`}>
        <div className="ev-card-glow" style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: dark ? '0 25px 70px rgba(0,0,0,0.5)' : '0 25px 70px rgba(9,32,62,0.2)', transition: 'box-shadow 0.4s' }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = dark ? '0 35px 90px rgba(0,0,0,0.6)' : '0 35px 90px rgba(9,32,62,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = dark ? '0 25px 70px rgba(0,0,0,0.5)' : '0 25px 70px rgba(9,32,62,0.2)' }}
        >
          <img src={event.image} alt={event.label} style={{ width: '100%', display: 'block', aspectRatio: '4/3', objectFit: 'cover', transition: 'transform 0.6s' }}
            loading="lazy"
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(9,32,62,0.15) 0%, transparent 50%, rgba(9,32,62,0.35) 100%)' }} />
          {event.logo && (
            <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.95)', padding: '10px 16px', borderRadius: '8px', backdropFilter: 'blur(8px)', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
              <img src={event.logo} alt="" style={{ height: '32px', width: 'auto', display: 'block' }} />
            </div>
          )}
        </div>
      </div>
      <div className={`${isEven ? 'lg:order-2 slide-right' : 'lg:order-1 slide-left'}`}>
        <p className="font-mono uppercase tracking-[0.18em] mb-3 fade-up" style={{ fontSize: '0.72rem', color: accent, fontWeight: 600 }}>
          {event.label}
        </p>
        <h3 className="font-heading font-bold leading-tight mb-4 fade-up" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: dark ? '#fff' : '#09203e' }}>
          {event.dates}
        </h3>
        <div className="flex items-center gap-2 mb-6 fade-up" style={{ color: dark ? 'rgba(255,255,255,0.65)' : '#555' }}>
          <MapPin size={16} style={{ color: accent }} />
          <span className="font-body" style={{ fontSize: '0.95rem' }}>{event.city}</span>
        </div>
        <div className="mb-8 fade-up" style={{ width: '60px', height: '3px', background: dark ? `linear-gradient(90deg, ${accent}, rgba(191,177,112,0.3))` : 'linear-gradient(90deg, #09203e, rgba(9,32,62,0.3))' }} />
        {CopyArray.map((p, i) => (
          <p key={i} className="font-body leading-relaxed mb-4 fade-up" style={{ fontSize: '1rem', color: dark ? 'rgba(255,255,255,0.75)' : '#444' }}>
            {p}
          </p>
        ))}
        {event.comingSoon && (
          event.detailsLink ? (
            <Link to={event.detailsLink} className="inline-flex items-center gap-2 font-mono uppercase tracking-[0.15em] fade-up mt-4" style={{ fontSize: '0.72rem', color: accent, background: 'rgba(255,255,255,0.08)', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}>
              Coming Soon <ArrowRight size={14} />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-2 font-mono uppercase tracking-[0.15em] fade-up mt-4" style={{ fontSize: '0.72rem', color: accent, background: 'rgba(255,255,255,0.08)', padding: '8px 16px', borderRadius: '6px', fontWeight: 600 }}>
              Coming Soon
            </span>
          )
        )}
        {event.link && !event.comingSoon && (
          event.internal ? (
            <Link to={event.link} className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em] fade-up mt-4"
              style={{ background: 'var(--color-brand-accent)', color: '#fff', padding: '16px 36px', fontSize: '0.8rem', textDecoration: 'none', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#d4c78e' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-brand-accent)' }}
            >
              View Details <ArrowRight size={16} />
            </Link>
          ) : (
            <a href={event.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em] fade-up mt-4"
              style={{
                background: dark ? 'transparent' : '#09203e',
                color: dark ? 'var(--color-brand-accent)' : '#fff',
                padding: '16px 36px',
                fontSize: '0.8rem',
                textDecoration: 'none',
                border: dark ? '1px solid var(--color-brand-accent)' : '1px solid #09203e',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => {
                if (dark) { e.currentTarget.style.background = 'var(--color-brand-accent)'; e.currentTarget.style.color = '#09203e' }
                else { e.currentTarget.style.background = '#0d2b52' }
              }}
              onMouseLeave={e => {
                if (dark) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-brand-accent)' }
                else { e.currentTarget.style.background = '#09203e' }
              }}
            >
              View Details <ArrowRight size={16} />
            </a>
          )
        )}
      </div>
    </div>
  )
}

// ─── Testimonial card ──────────────────────────────────────────────────────
function TestimonialCard({ t, delay = 0 }) {
  return (
    <div className="scale-up" style={{ transitionDelay: `${delay}ms` }}>
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(191,177,112,0.18)',
        backdropFilter: 'blur(10px)',
        padding: '36px 32px',
        borderRadius: '16px',
        height: '100%',
        transition: 'transform 0.3s, border-color 0.3s, background 0.3s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = 'rgba(191,177,112,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(191,177,112,0.18)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
      >
        <p className="font-body leading-relaxed mb-6" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)', fontStyle: 'italic' }}>
          &ldquo;{t.quote}&rdquo;
        </p>
        <div style={{ borderTop: '1px solid rgba(191,177,112,0.15)', paddingTop: '16px' }}>
          <p className="font-heading font-bold" style={{ fontSize: '1.05rem', color: '#fff' }}>{t.name}</p>
          <p className="font-body" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)' }}>{t.title}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Main Events component ─────────────────────────────────────────────────
export default function Events() {
  useScrollAnimations()
  useEffect(() => {
    if (window.location.hash) {
      const t = setTimeout(() => {
        const el = document.querySelector(window.location.hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 200)
      return () => clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [])

  return (
    <div style={{ background: '#050d1a' }}>

      {/* ═══ HERO (with floating orbs) ═══════════════════════════════════ */}
      <section className="inner-hero relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(/hero/12-TIER1-packed-keynote.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'saturate(0.55) brightness(0.3)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(5,13,26,0.6) 0%, rgba(9,32,62,0.7) 40%, rgba(5,13,26,0.95) 100%)',
        }} />
        <NetworkNodes color="#ffffff" accentColor="var(--color-brand-accent)" nodeCount={45} opacity={0.18} />
        {/* Floating color orbs (unique to Events) */}
        <div className="ev-orb" style={{ top: '10%', left: '15%', width: '400px', height: '400px', background: 'rgba(191,177,112,0.12)', animationDelay: '0s' }} />
        <div className="ev-orb" style={{ top: '50%', right: '10%', width: '350px', height: '350px', background: 'rgba(200,48,44,0.08)', animationDelay: '-7s' }} />
        <div className="ev-orb" style={{ bottom: '5%', left: '40%', width: '300px', height: '300px', background: 'rgba(26,63,191,0.07)', animationDelay: '-13s' }} />

        <div className="relative z-10 text-center" style={{ maxWidth: '1100px', padding: 'clamp(60px,7vw,110px) clamp(24px,5vw,80px) clamp(60px,8vw,100px)' }}>
          <div className="inner-hero-crest inner-hero-crest--xl flex justify-center fade-up">
            <img src="/brand/crests/crest-main-white.svg" alt="" aria-hidden="true"
              style={{ filter: 'drop-shadow(0 8px 40px rgba(233, 30, 99,0.3)) drop-shadow(0 0 90px rgba(255,183,3,0.15))' }} />
          </div>
          <p className="section-label text-brand-accent mb-6 fade-up">OUR EVENTS</p>
          <h1 className="font-heading font-bold text-white leading-[1.02] mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)' }}>
            Where the Soccerex Platform{' '}
            <span style={{ color: 'var(--color-brand-accent)' }}>Comes to Life</span>
          </h1>
          <div className="fade-up mx-auto mb-8" style={{ width: '100px', height: '3px', background: 'linear-gradient(90deg, transparent, var(--color-brand-accent), transparent)' }} />
          <p className="font-body text-white/75 leading-relaxed fade-up mx-auto" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', maxWidth: '740px' }}>
            Each Soccerex edition is an anchor point for the wider platform, bringing the football business ecosystem together in key global markets and turning access into partnerships, investment, innovation, impact, and year-round commercial opportunity.
          </p>
          {/* Live event pill */}
          <div className="fade-up mt-10">
            <Link to={MIAMI_2026} style={{ textDecoration: 'none' }}>
              <div className="ev-ring-pulse inline-flex items-center gap-3 px-6 py-3 rounded-full" style={{
                background: 'rgba(200,48,44,0.15)', border: '1px solid rgba(200,48,44,0.5)',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,48,44,0.25)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(200,48,44,0.15)' }}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-red)', boxShadow: '0 0 12px var(--color-red)', animation: 'node-pulse 2s infinite' }} />
                <span className="font-mono uppercase tracking-[0.15em] text-white" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                  Next: Miami, September 23-25 2026
                </span>
                <ArrowRight size={14} color="var(--color-red)" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <PixelDivider color="#050d1a" layers={4} height={90} speed={0.5} />

      {/* ═══ UPCOMING EVENTS — WFS-style city cards ══════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#050d1a', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <NetworkNodes color="#ffffff" accentColor="var(--color-brand-accent)" nodeCount={22} opacity={0.08} />
        <div className="relative z-10" style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="mb-14">
            <p className="section-label mb-4 fade-up" style={{ color: 'var(--color-brand-accent)', fontWeight: 600 }}>UPCOMING PLATFORM EVENTS</p>
            <h2 className="font-heading font-bold leading-tight fade-up" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', color: '#fff' }}>
              Upcoming <span style={{ color: 'var(--color-brand-accent)' }}>Platform Events</span>
            </h2>
            <p className="font-body text-white/60 leading-relaxed fade-up mt-4" style={{ fontSize: '1rem', maxWidth: '720px' }}>
              Three strategic markets. One Soccerex platform turning access into partnerships, investment, innovation, impact, and year-round commercial opportunity.
            </p>
          </div>

          {/* City cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
            {UPCOMING.map((e) => {
              const Wrapper = (e.link && e.internal) || e.detailsLink ? Link : e.link ? 'a' : 'div'
              const wrapperProps = e.detailsLink ? { to: e.detailsLink } : e.link && e.internal ? { to: e.link } : e.link ? { href: e.link, target: '_blank', rel: 'noopener noreferrer' } : {}
              const cityName = e.city.split(',')[0].toUpperCase()
              const accent = e.accent || 'var(--color-brand-accent)'
              return (
                <Wrapper
                  key={e.label}
                  {...wrapperProps}
                  className="fade-up group relative overflow-hidden"
                  style={{
                    aspectRatio: '3/4',
                    borderRadius: '14px',
                    cursor: e.link || e.detailsLink ? 'pointer' : 'default',
                    textDecoration: 'none',
                    display: 'block',
                  }}
                >
                  <img src={e.image} alt={cityName} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.1) brightness(0.85)' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,13,26,0.2) 0%, rgba(5,13,26,0.5) 50%, rgba(5,13,26,0.95) 100%)' }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: accent }} />
                  {e.comingSoon ? (
                    <div style={{ position: 'absolute', top: 20, right: 20, padding: '6px 12px', background: accent, backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '100px', color: '#fff', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                      Coming Soon
                    </div>
                  ) : (
                    <div style={{ position: 'absolute', top: 20, right: 20, padding: '6px 12px', background: 'var(--color-brand-accent)', borderRadius: '100px', color: '#fff', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                      Registration Open
                    </div>
                  )}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px', display: 'flex', flexDirection: 'column' }}>
                    <h3 className="font-heading font-bold leading-none" style={{
                      fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
                      color: accent,
                      textShadow: '0 2px 20px rgba(0,0,0,0.4)',
                      marginBottom: '12px',
                      letterSpacing: '-0.02em',
                    }}>
                      {cityName}
                    </h3>
                    <p style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px' }}>{e.dates}</p>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem' }}>{e.venue || e.city}</p>
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.18em', marginTop: '14px' }}>{e.label}</p>
                    <div style={{ marginTop: '14px', minHeight: '20px', display: 'flex', alignItems: 'center', gap: '6px', color: accent, fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                      {e.link && e.internal ? <>Explore event <ArrowRight size={14} /></> : null}
                    </div>
                  </div>
                </Wrapper>
              )
            })}
          </div>

          {/* Detailed event cards below */}
          {UPCOMING.map((e, i) => <EventCard key={`detail-${e.label}`} event={e} index={i} dark={true} />)}
        </div>
      </section>

      <PixelDivider color="#050d1a" layers={4} height={90} speed={0.5} />

      {/* ═══ PAST EVENTS ════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(9,32,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10" style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div className="text-center mb-20">
            <p className="section-label mb-4 fade-up" style={{ color: '#09203e', fontWeight: 600 }}>LEGACY</p>
            <h2 className="font-heading font-bold leading-tight mb-6 fade-up" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', color: '#09203e' }}>
              Past{' '}
              <span style={{ color: 'var(--color-brand-accent)' }}>Events</span>
            </h2>
            <div className="fade-up mx-auto" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, #09203e, transparent)' }} />
          </div>
          {RECENT.map((e, i) => <EventCard key={e.label} event={e} index={i} dark={false} />)}
        </div>
      </section>

      <PixelDivider color="#eae8e4" layers={4} height={90} speed={0.5} />

      {/* ═══ TESTIMONIALS (scrolling ticker) ═════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #09203e 0%, #050d1a 100%)', padding: 'clamp(80px,10vw,120px) 0' }}>
        <NetworkNodes color="#ffffff" accentColor="var(--color-brand-accent)" nodeCount={25} opacity={0.1} />
        {/* Floating orbs for testimonial section */}
        <div className="ev-orb" style={{ top: '20%', right: '5%', width: '250px', height: '250px', background: 'rgba(191,177,112,0.08)', animationDelay: '-5s' }} />
        <div className="ev-orb" style={{ bottom: '10%', left: '10%', width: '200px', height: '200px', background: 'rgba(200,48,44,0.06)', animationDelay: '-12s' }} />
        <div className="relative z-10">
          <div className="text-center mb-14 px-6">
            <p className="section-label text-brand-accent mb-4 fade-up">TESTIMONIALS</p>
            <h2 className="font-heading font-bold text-white leading-tight mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
              What the Industry{' '}
              <span style={{ color: 'var(--color-brand-accent)' }}>Says</span>
            </h2>
            <div className="fade-up mx-auto" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, var(--color-brand-accent), transparent)' }} />
          </div>
          {/* Horizontal ticker */}
          <div className="fade-up" style={{ overflow: 'hidden', maskImage: 'linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)', WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)' }}>
            <div className="ev-ticker-track" style={{ animationDuration: '60s' }}>
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                <div key={`${t.name}-${i}`} style={{
                  flexShrink: 0, width: '420px', maxWidth: '85vw',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(191,177,112,0.18)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px', padding: '32px 28px',
                }}>
                  <p className="font-body leading-relaxed mb-5" style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)', fontStyle: 'italic' }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ borderTop: '1px solid rgba(191,177,112,0.12)', paddingTop: '14px' }}>
                    <p className="font-heading font-bold" style={{ fontSize: '0.95rem', color: '#fff' }}>{t.name}</p>
                    <p className="font-body" style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>{t.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PixelDivider color="#050d1a" layers={4} height={90} speed={0.5} />

      {/* ═══ BIG QUOTE ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: '55vh' }}>
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(/images/events/custombg.webp)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.4) saturate(0.7)',
        }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(5,13,26,0.85) 0%, rgba(9,32,62,0.8) 100%)' }} />
        <NetworkNodes color="#ffffff" accentColor="var(--color-brand-accent)" nodeCount={25} opacity={0.12} />
        <div className="relative z-10 flex items-center justify-center" style={{ minHeight: '55vh', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
          <div className="text-center" style={{ maxWidth: '1000px' }}>
            <h2 className="font-heading font-bold text-white leading-[1.2] fade-up text-glow" style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', fontStyle: 'italic' }}>
              &ldquo;Take care of the game and the{' '}
              <span style={{ color: 'var(--color-brand-accent)' }}>business will take care of itself</span>.&rdquo;
            </h2>
            <div className="fade-up mx-auto mt-8" style={{ width: '100px', height: '3px', background: 'linear-gradient(90deg, transparent, var(--color-brand-accent), transparent)' }} />
          </div>
        </div>
      </section>

      {/* ═══ CTA (Miami pink theme) ═══════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a0010 0%, #3a0a2a 50%, #1a0010 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <NetworkNodes color="#ffffff" accentColor="#E91E63" nodeCount={35} opacity={0.12} />
        <div className="absolute pointer-events-none" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '900px', height: '900px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(233,30,99,0.1) 0%, transparent 60%)' }} />
        <div className="relative z-10 text-center" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Calendar size={40} color="#E91E63" strokeWidth={2} className="mx-auto mb-6 fade-up" />
          <p className="section-label mb-4 fade-up" style={{ color: '#E91E63' }}>JOIN US IN MIAMI</p>
          <h2 className="font-heading font-bold text-white leading-tight mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
            Soccerex Miami 2026{' '}
            <span style={{ color: '#E91E63' }}>Awaits</span>
          </h2>
          <div className="fade-up mx-auto mb-8" style={{ width: '100px', height: '3px', background: 'linear-gradient(90deg, transparent, #E91E63, transparent)' }} />
          <p className="font-body text-white/75 leading-relaxed fade-up mb-10 mx-auto" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.2rem)', maxWidth: '720px' }}>
            September 23 to 25, 2026. Where the Americas converge for the post-World Cup business of football.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 fade-up">
            <Link to={MIAMI_2026} className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
              style={{ background: '#E91E63', color: '#fff', padding: '18px 40px', fontSize: '0.85rem', textDecoration: 'none', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#c2185b' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#E91E63' }}
            >
              Event Details <ArrowRight size={16} />
            </Link>
            <InquiryModalButton
              kind="sponsorship-inquiry"
              label="Become a partner"
              modalTitle="Become a Soccerex partner"
              eyebrow="Sponsorship & exhibition"
              intro="Tell us a little about your organisation and what you'd like to achieve. We'll send the right partnership pack for your goals."
              schema={sponsorshipSchema}
              extraPayload={{ source: 'events-page-cta' }}
              submitLabel="Send inquiry"
              successTitle="Inquiry received."
              successBody="A partnerships lead will follow up by email with a tailored pack and next steps."
              buttonStyle={{ background: 'transparent', color: '#fff', padding: '18px 40px', fontSize: '0.85rem', border: '1px solid #c8302c', cursor: 'pointer', transition: 'all 0.3s' }}
              buttonClassName="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
