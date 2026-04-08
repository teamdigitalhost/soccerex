import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, MapPin, Download, Quote, Globe } from 'lucide-react'
import NetworkNodes from '../animations/NetworkNodes'
import PixelDivider from '../components/PixelDivider'

// ═══ UPCOMING EVENTS (2 featured) ════════════════════════════════════════════
const UPCOMING = [
  {
    logo: '/images/events/logos/europe.webp',
    label: 'SOCCEREX EUROPE',
    dates: 'May 11th - 13th, 2026',
    city: 'Amsterdam, Netherlands',
    image: '/images/events/events/europe-ajax-arena.webp',
    copy: [
      'Following the success of Soccerex Europe 2025, which highlighted how AI is reshaping football through insightful sessions and high-profile discussions featuring speakers from TikTok, Ajax, and LALIGA, the football industry\'s leading European event will return to Amsterdam in 2026.',
      'Amsterdam, one of Europe\'s most influential football cities, will set the stage for Soccerex Europe 2026. Blending rich football heritage with cutting-edge innovation, the city will provide the perfect backdrop for the event at the iconic Johan Cruijff ArenA. Globally recognised for its leadership in sustainability and fan experience, the venue will host an event designed to shape the future of the beautiful game.',
      'With a legacy that includes hosting Champions League finals and UEFA Euro 2000, the 2026 edition is poised to unite federations, leagues, clubs, brands, media, governing bodies, and football legends from around the world.',
    ],
    link: '/europe-2026',
    internal: true,
  },
  {
    logo: '/images/events/logos/miami.webp',
    label: 'SOCCEREX MIAMI',
    dates: '2026',
    city: 'Miami, USA',
    image: '/images/events/events/miami-2025-1.jpg',
    copy: 'Details coming soon.',
    comingSoon: true,
  },
]

// ═══ RECENT EVENTS (7 past) ═══════════════════════════════════════════════════
const RECENT = [
  {
    logo: '/images/events/logos/miami.webp',
    label: 'SOCCEREX MIAMI 2025',
    dates: 'November 11th - 13th, 2025',
    city: 'Miami Beach Convention Center',
    image: '/images/events/events/miami-2025-whatsapp.jpeg',
    copy: 'In 2025, we hosted three large-scale events for the first time since 2019, marking a major milestone for the global football business industry. The trifecta of major gatherings continued with Soccerex Miami, which took place from 11th to 13th November at the Miami Beach Convention Center. Bringing together key stakeholders from across the football ecosystem, the event served as a global platform for innovation, collaboration, and shaping the future of the game.',
    link: 'https://soccerex.com/miami-2025/',
  },
  {
    logo: '/images/events/logos/europe.webp',
    label: 'SOCCEREX EUROPE 2025',
    dates: 'May 19th - 21st, 2025',
    city: 'Johan Cruijff ArenA, Amsterdam',
    image: '/images/events/events/europe-2025-2.webp',
    copy: 'Building on the success of Soccerex Europe 2024, which featured an insightful session on how AI was transforming football and standout discussions with speakers from TikTok, Ajax, and LALIGA, the football industry\'s premier European event returned to Amsterdam in 2025. Amsterdam, full of football innovation and rich history, provided the perfect backdrop for Soccerex Europe 2025. The renowned Johan Cruijff ArenA, an international leader in sustainability and fan experience, was the ideal venue for an event that celebrated and shaped the future of the beautiful game. Having previously staged Champions League finals and UEFA Euro 2000, this year\'s event proved to be a landmark gathering for federations, leagues, clubs, brands, media, governing bodies, and legends from across the globe.',
    link: 'https://soccerex.com/europe-2025/',
  },
  {
    logo: '/images/events/logos/miami.webp',
    label: 'SOCCEREX MIAMI 2024',
    dates: 'November 13th - 14th, 2024',
    city: 'Miami, USA',
    image: '/images/events/events/miami-2024-2.webp',
    copy: 'After our fourth and most recent instalment in the magic city in November 2023 which saw 29-year-old Soccerex records shattered, it was confirmed that the USA is truly the beautiful games\' adopted home. With a World Cup to look forward to in under two years (by the time of the event), broadcasting figures at an all-time high and the MLS becoming a truly global product (even being home to arguably the greatest player in history), it is a remarkably exciting time for Soccer in the Americas.',
    link: 'https://soccerex.com/miami-2024/',
  },
  {
    logo: '/images/events/logos/europe.webp',
    label: 'SOCCEREX EUROPE 2024',
    dates: 'May 30th - 31st, 2024',
    city: 'Johan Cruijff ArenA, Amsterdam',
    image: '/images/events/events/europe-2025-4.webp',
    copy: 'It was a memorable occasion as football returned to European soil for the first time since 2019, hosted at the iconic home of AFC Ajax. After nearly 5 years, Soccerex brought the football business community together again in Amsterdam, just before the start of the European Championships in Germany.',
    link: 'https://soccerex.com/europe-2024/',
  },
  {
    logo: '/images/events/logos/miami.webp',
    label: 'SOCCEREX MIAMI 2023',
    dates: 'November 14th - 15th, 2023',
    city: 'Mana Wynwood Convention Center, Miami',
    image: '/images/events/events/miami-2023-2.webp',
    copy: 'Soccerex Miami will be held at the wonderful Mana Wynwood Convention Center, a venue that has been leading the way in the entertainment and arts industries since 2010. 70+ speakers will take the main stage, providing insight on a myriad of topics including but not limited to, performance, broadcasting, good governance, fan engagement, athlete development, technology, analytics, and major tournaments.',
    link: 'https://soccerex.com/miami-2023/',
  },
]

// ═══ BROCHURES (8 brochure covers) ════════════════════════════════════════════
const BROCHURES = [
  { img: '/images/events/brochures/box1.webp', label: 'Brochure 1' },
  { img: '/images/events/brochures/box2.webp', label: 'Brochure 2' },
  { img: '/images/events/brochures/box3.webp', label: 'Brochure 3' },
  { img: '/images/events/brochures/box4.webp', label: 'Brochure 4' },
  { img: '/images/events/brochures/mbox1.webp', label: 'Brochure 5' },
  { img: '/images/events/brochures/mbox2.webp', label: 'Brochure 6' },
  { img: '/images/events/brochures/mbox3.webp', label: 'Brochure 7' },
  { img: '/images/events/brochures/mbox4.webp', label: 'Brochure 8' },
]

// ═══ TESTIMONIALS (5 unique) ══════════════════════════════════════════════════
const TESTIMONIALS = [
  { quote: 'For LaLiga, being at Soccerex is not just important, it is essential.', name: 'Javier Tebas', title: 'President, LaLiga' },
  { quote: 'Soccerex is legendary, a collection of incredible minds and people from the industry.', name: 'Alexi Lalas', title: 'Anchor, Fox Sports' },
  { quote: 'Soccerex is in my opinion the premier football conference event. It\'s a great opportunity to meet with lots of people from within the industry and that\'s good for our business and good for us as a football club.', name: 'Ian Ayre', title: 'Former CEO, Liverpool FC' },
  { quote: 'I\'ve been a big supporter of Soccerex since I came into the industry many years ago. It\'s great not just for the MLS, but for the global football soccer industry.', name: 'Don Garber', title: 'Commissioner, MLS' },
  { quote: 'Soccerex is definitely the number one event that pulls the football industry together.', name: 'Fatma Samoura', title: 'General Secretary, FIFA' },
]

// ═══ SPEAKERS (54, titles in "Role, Organization" format) ═════════════════════
const SPEAKERS = [
  { name: 'Gianni Infantino', title: 'President, FIFA' },
  { name: 'Javier Tebas', title: 'President, LaLiga' },
  { name: 'Victor Montagliani', title: 'President, CONCACAF; Vice President, FIFA' },
  { name: 'Don Garber', title: 'Commissioner, MLS' },
  { name: 'Alessandro Del Piero', title: 'Former Footballer, Italy' },
  { name: 'Philippe Moggio', title: 'General Secretary, CONCACAF' },
  { name: 'Jorge Mas', title: 'Managing Owner, Inter Miami CF' },
  { name: 'Luigi De Siervo', title: 'CEO, Lega Serie A' },
  { name: 'Romy Gai', title: 'Chief Business Officer, FIFA' },
  { name: 'Juan Sebastián Verón', title: 'Former Footballer, Argentina' },
  { name: 'Bora Milutinovic', title: 'Former Manager, USMNT' },
  { name: 'Jason Roberts', title: 'Chief Football Development Officer, CONCACAF' },
  { name: 'Gilberto Silva', title: 'Ambassador, Arsenal & FIFA' },
  { name: 'Karina LeBlanc', title: 'Executive VP, RAJ Sports' },
  { name: 'Amanda Vandervort', title: 'President, USL Super League' },
  { name: 'Peter Moore', title: 'Founding Owner, Santa Barbara Sky FC' },
  { name: 'Ronald de Boer', title: 'Youth Coach, Ajax' },
  { name: 'Mikael Silvestre', title: 'Former Footballer, Manchester United' },
  { name: 'Sunday Oliseh', title: 'Former Footballer, Nigeria' },
  { name: 'Eni Aluko', title: 'Broadcaster & Sporting Director' },
  { name: 'Paul Barber OBE', title: 'Chief Executive, Brighton & Hove Albion FC' },
  { name: 'Kate Abdo', title: 'Broadcaster, CBS Sports' },
  { name: 'Nedum Onuoha', title: 'Former Footballer & Broadcaster' },
  { name: 'Gijs de Jong', title: 'General Secretary, KNVB' },
  { name: 'Brad Friedel', title: 'Former Footballer, USMNT' },
  { name: 'Anthony Taylor', title: 'Elite Referee, PGMOL' },
  { name: 'Eric Wynalda', title: 'CEO, The Wynalda Group' },
  { name: 'Oguchi Onyewu', title: 'Vice President of Sporting, U.S. Soccer Federation' },
  { name: 'Alexi Lalas', title: 'Broadcaster, FOX Sports' },
  { name: 'Marlo Sweatman', title: 'Former Footballer, Jamaica' },
  { name: 'Rafaela Pimenta', title: 'Agent, Tatica' },
  { name: 'Thomas Rongen', title: 'Broadcaster, CBS & Inter Miami CF' },
  { name: 'Tony Cherchi', title: 'Show Host & Match Analyst, MLS' },
  { name: 'Sander van Stiphout', title: 'Director International, Johan Cruijff ArenA' },
  { name: 'James Johnson', title: 'Group CEO, Canadian Soccer Media & Entertainment' },
  { name: 'Kyle Martino', title: 'Founder, Over Under Initiative' },
  { name: 'Xavier Asensi', title: 'Co-President & CBO, Inter Miami CF' },
  { name: 'Eddy Cue', title: 'Senior Vice President of Services, Apple' },
  { name: 'Ed Foster-Simeon', title: 'President & CEO, U.S. Soccer Foundation' },
  { name: 'Julie Uhrman', title: 'CEO & Co-Founder, Angel City Football Club' },
  { name: 'Hassan El Kamah', title: 'Commercial Director, CAF' },
  { name: 'Leandro Petersen', title: 'Chief Commercial and Marketing Officer, AFA' },
  { name: 'Rasha Elghorour', title: 'Head of Women\'s Football, Kuwait Football Association' },
  { name: 'Yara Abdallah', title: 'Media Ticketing Operations Manager, FIFA' },
  { name: 'Ruba Sbeah', title: 'Sr. Director of Brand Marketing, MLS' },
  { name: 'Amira Yousif', title: 'Women\'s Head Coach, Egyptian Football Association' },
  { name: 'Toan Ravenscroft', title: 'Managing Partner, MSQ Sport' },
  { name: 'Giulio Tedeschi', title: 'CEO & Founder, Tedeschi & Partners' },
  { name: 'Corné Groenendijk', title: 'Manager, Ajax Coaching Academy' },
  { name: 'Danita Johnson', title: 'President, Business Operations, DC United' },
  { name: 'Guillem Balague', title: 'Broadcaster' },
  { name: 'Jill Ellis', title: 'Chief Football Officer, FIFA' },
  { name: 'Francis Suarez', title: 'Former Mayor, Miami' },
  { name: 'Maurice Ouderland', title: 'International Sports Business Consultant, Sports NL' },
]

const BROCHURE_LINK = 'https://soccerex.hflip.co/ebrochure.html'

// ─── Scroll animations ──────────────────────────────────────────────────────
function useScrollAnimations(dep) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }) },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.fade-up, .slide-left, .slide-right, .scale-up, .blur-reveal').forEach((el) => {
      if (!el.classList.contains('visible')) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [dep])
}

// ─── Event card (large, alternating layout) ────────────────────────────────
function EventCard({ event, index, dark = false }) {
  const isEven = index % 2 === 0
  const CopyArray = Array.isArray(event.copy) ? event.copy : [event.copy]
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center mb-20 lg:mb-28">
      <div className={`${isEven ? 'lg:order-1 slide-left' : 'lg:order-2 slide-right'}`}>
        <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', boxShadow: dark ? '0 25px 70px rgba(0,0,0,0.5)' : '0 25px 70px rgba(9,32,62,0.25)' }}>
          <img src={event.image} alt={event.label} style={{ width: '100%', display: 'block', aspectRatio: '4/3', objectFit: 'cover' }} loading="lazy" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(9,32,62,0.15) 0%, transparent 50%, rgba(9,32,62,0.35) 100%)' }} />
          {event.logo && (
            <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.92)', padding: '10px 16px', borderRadius: '8px', backdropFilter: 'blur(8px)' }}>
              <img src={event.logo} alt="" style={{ height: '32px', width: 'auto', display: 'block' }} />
            </div>
          )}
        </div>
      </div>
      <div className={`${isEven ? 'lg:order-2 slide-right' : 'lg:order-1 slide-left'}`}>
        <p className="font-mono uppercase tracking-[0.18em] mb-3 fade-up" style={{ fontSize: '0.72rem', color: '#bfb170', fontWeight: 600 }}>
          {event.label}
        </p>
        <h3 className="font-heading font-bold leading-tight mb-4 fade-up" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: dark ? '#fff' : '#09203e' }}>
          {event.dates}
        </h3>
        <div className="flex items-center gap-2 mb-6 fade-up" style={{ color: dark ? 'rgba(255,255,255,0.65)' : '#555' }}>
          <MapPin size={16} style={{ color: '#bfb170' }} />
          <span className="font-body" style={{ fontSize: '0.95rem' }}>{event.city}</span>
        </div>
        <div className="mb-8 fade-up" style={{ width: '60px', height: '3px', background: dark ? 'linear-gradient(90deg, #bfb170, rgba(191,177,112,0.3))' : 'linear-gradient(90deg, #09203e, rgba(9,32,62,0.3))' }} />
        {CopyArray.map((p, i) => (
          <p key={i} className="font-body leading-relaxed mb-4 fade-up" style={{ fontSize: '1rem', color: dark ? 'rgba(255,255,255,0.75)' : '#444' }}>
            {p}
          </p>
        ))}
        {event.comingSoon && (
          <span className="inline-flex items-center gap-2 font-mono uppercase tracking-[0.15em] fade-up mt-4" style={{ fontSize: '0.72rem', color: '#bfb170', background: 'rgba(191,177,112,0.1)', padding: '8px 16px', borderRadius: '6px', fontWeight: 600 }}>
            Coming Soon
          </span>
        )}
        {event.link && !event.comingSoon && (
          event.internal ? (
            <Link to={event.link} className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em] fade-up mt-4"
              style={{ background: '#bfb170', color: '#09203e', padding: '16px 36px', fontSize: '0.8rem', textDecoration: 'none', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#d4c78e' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#bfb170' }}
            >
              View Details <ArrowRight size={16} />
            </Link>
          ) : (
            <a href={event.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em] fade-up mt-4"
              style={{
                background: dark ? 'transparent' : '#09203e',
                color: dark ? '#bfb170' : '#fff',
                padding: '16px 36px',
                fontSize: '0.8rem',
                textDecoration: 'none',
                border: dark ? '1px solid #bfb170' : '1px solid #09203e',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => {
                if (dark) { e.currentTarget.style.background = '#bfb170'; e.currentTarget.style.color = '#09203e' }
                else { e.currentTarget.style.background = '#0d2b52' }
              }}
              onMouseLeave={e => {
                if (dark) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#bfb170' }
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
        <Quote size={28} style={{ color: '#bfb170', marginBottom: '16px' }} strokeWidth={2} />
        <p className="font-body leading-relaxed mb-6" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)', fontStyle: 'italic' }}>
          "{t.quote}"
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
  const [showAllSpeakers, setShowAllSpeakers] = useState(false)
  useScrollAnimations(showAllSpeakers)
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const visibleSpeakers = showAllSpeakers ? SPEAKERS : SPEAKERS.slice(0, 24)

  return (
    <div style={{ background: '#050d1a' }}>

      {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden flex items-center justify-center" style={{ minHeight: '85vh' }}>
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(/hero/12-TIER1-packed-keynote.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'saturate(0.55) brightness(0.35)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(5,13,26,0.65) 0%, rgba(9,32,62,0.75) 40%, rgba(5,13,26,0.95) 100%)',
        }} />
        <NetworkNodes color="#bfb170" nodeCount={45} opacity={0.18} />
        <div className="absolute pointer-events-none" style={{ top: '15%', left: '50%', transform: 'translateX(-50%)', width: '900px', height: '900px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,177,112,0.1) 0%, transparent 60%)' }} />

        <div className="relative z-10 text-center" style={{ maxWidth: '1000px', padding: 'clamp(140px,15vw,200px) clamp(24px,5vw,80px) clamp(80px,10vw,120px)' }}>
          <p className="section-label text-gold mb-6 fade-up">OUR EVENTS</p>
          <h1 className="font-heading font-bold text-white leading-[1.02] mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)' }}>
            Where the Football{' '}
            <span style={{ color: 'var(--color-gold)' }}>World Meets</span>
          </h1>
          <div className="fade-up mx-auto mb-8" style={{ width: '100px', height: '3px', background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }} />
          <p className="font-body text-white/75 leading-relaxed fade-up mx-auto" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', maxWidth: '740px' }}>
            Each Soccerex event is built as a global gateway, connecting international stakeholders to key markets and the people shaping the future of football within them.
          </p>
        </div>
      </section>

      <PixelDivider color="#09203e" layers={4} height={90} speed={0.5} />

      {/* ═══ GLOBAL GATEWAYS ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #09203e 0%, #0d2b52 100%)', padding: 'clamp(80px,10vw,120px) clamp(24px,5vw,80px)' }}>
        <NetworkNodes color="#bfb170" nodeCount={20} opacity={0.1} />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {[
            { label: 'Soccerex Europe', desc: 'A global meeting point for stakeholders looking to access and engage with the European football market, one of the most mature and competitive in the world.', icon: Globe },
            { label: 'Soccerex Miami', desc: 'A strategic gateway connecting global stakeholders to opportunities across North America, Latin America, and the wider international football ecosystem.', icon: MapPin },
            { label: 'Soccerex Middle East', desc: 'A high-growth hub bringing together global leaders to access one of the fastest-evolving regions in world football, driven by investment, infrastructure, and innovation.', icon: Calendar },
          ].map((g, i) => {
            const Icon = g.icon
            return (
              <div key={g.label} className="scale-up" style={{ transitionDelay: `${i * 80}ms` }}>
                <div style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(191,177,112,0.2)',
                  backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '36px 28px',
                  height: '100%', transition: 'transform 0.3s, border-color 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = '#bfb170' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(191,177,112,0.2)' }}
                >
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #bfb170, #d4c78e)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                    <Icon size={24} color="#09203e" strokeWidth={2} />
                  </div>
                  <h3 className="font-heading font-bold text-white mb-3" style={{ fontSize: '1.3rem' }}>{g.label}</h3>
                  <p className="font-body leading-relaxed" style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.7)' }}>{g.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <PixelDivider color="#0d2b52" layers={4} height={90} speed={0.5} />

      {/* ═══ UPCOMING EVENTS ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(9,32,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10" style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div className="text-center mb-20">
            <p className="section-label mb-4 fade-up" style={{ color: '#09203e', fontWeight: 600 }}>SOCCEREX 2026</p>
            <h2 className="font-heading font-bold leading-tight mb-6 fade-up" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', color: '#09203e' }}>
              Upcoming{' '}
              <span style={{ color: '#bfb170' }}>Events</span>
            </h2>
            <div className="fade-up mx-auto" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, #09203e, transparent)' }} />
          </div>
          {UPCOMING.map((e, i) => <EventCard key={e.label} event={e} index={i} dark={false} />)}
        </div>
      </section>

      <PixelDivider color="#eae8e4" layers={4} height={90} speed={0.5} />

      {/* ═══ EVENT BROCHURES ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #09203e 0%, #0d2b52 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <NetworkNodes color="#bfb170" nodeCount={28} opacity={0.12} />
        <div className="relative z-10" style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div className="text-center mb-16">
            <p className="section-label text-gold mb-4 fade-up">DOWNLOAD</p>
            <h2 className="font-heading font-bold text-white leading-tight mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
              Event{' '}
              <span style={{ color: '#bfb170' }}>Brochures</span>
            </h2>
            <div className="fade-up mx-auto mb-6" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, #bfb170, transparent)' }} />
            <p className="font-body fade-up mx-auto" style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', maxWidth: '640px' }}>
              Explore the complete story of each flagship event, agenda, speakers, sponsors, venue details, and more.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {BROCHURES.map((b, i) => (
              <a key={b.label} href={BROCHURE_LINK} target="_blank" rel="noopener noreferrer" className="scale-up group block" style={{ transitionDelay: `${i * 40}ms`, textDecoration: 'none' }}>
                <div style={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(191,177,112,0.2)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  transition: 'transform 0.3s, border-color 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = '#bfb170'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(191,177,112,0.2)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)' }}
                >
                  <img src={b.img} alt={b.label} style={{ width: '100%', display: 'block', aspectRatio: '3/4', objectFit: 'cover' }} loading="lazy" />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 60%, rgba(9,32,62,0.92) 100%)' }} />
                  <div style={{ position: 'absolute', bottom: '14px', left: '14px', right: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <span className="font-mono uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.12em', color: '#bfb170' }}>Download</span>
                    <Download size={16} color="#bfb170" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <PixelDivider color="#0d2b52" layers={4} height={90} speed={0.5} />

      {/* ═══ RECENT EVENTS ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(9,32,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10" style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div className="text-center mb-20">
            <p className="section-label mb-4 fade-up" style={{ color: '#09203e', fontWeight: 600 }}>LEGACY</p>
            <h2 className="font-heading font-bold leading-tight mb-6 fade-up" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', color: '#09203e' }}>
              Recent{' '}
              <span style={{ color: '#bfb170' }}>Events</span>
            </h2>
            <div className="fade-up mx-auto" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, #09203e, transparent)' }} />
          </div>
          {RECENT.map((e, i) => <EventCard key={e.label} event={e} index={i} dark={false} />)}
        </div>
      </section>

      <PixelDivider color="#eae8e4" layers={4} height={90} speed={0.5} />

      {/* ═══ TESTIMONIALS ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #09203e 0%, #050d1a 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <NetworkNodes color="#bfb170" nodeCount={30} opacity={0.12} />
        <div className="relative z-10" style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div className="text-center mb-16">
            <p className="section-label text-gold mb-4 fade-up">TESTIMONIALS</p>
            <h2 className="font-heading font-bold text-white leading-tight mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
              What the Industry{' '}
              <span style={{ color: '#bfb170' }}>Says</span>
            </h2>
            <div className="fade-up mx-auto" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, #bfb170, transparent)' }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => <TestimonialCard key={t.name} t={t} delay={i * 60} />)}
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
        <NetworkNodes color="#bfb170" nodeCount={25} opacity={0.12} />
        <div className="relative z-10 flex items-center justify-center" style={{ minHeight: '55vh', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
          <div className="text-center" style={{ maxWidth: '1000px' }}>
            <Quote size={48} style={{ color: '#bfb170', margin: '0 auto 28px' }} strokeWidth={2} className="fade-up" />
            <h2 className="font-heading font-bold text-white leading-[1.2] fade-up text-glow" style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', fontStyle: 'italic' }}>
              "Take care of the game and the{' '}
              <span style={{ color: '#bfb170' }}>business will take care of itself</span>."
            </h2>
            <div className="fade-up mx-auto mt-8" style={{ width: '100px', height: '3px', background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }} />
          </div>
        </div>
      </section>

      <PixelDivider color="#f4f3f0" layers={4} height={90} speed={0.5} />

      {/* ═══ SPEAKERS GRID ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(9,32,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10" style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div className="text-center mb-16">
            <p className="section-label mb-4 fade-up" style={{ color: '#09203e', fontWeight: 600 }}>THE VOICES OF THE GAME</p>
            <h2 className="font-heading font-bold leading-tight mb-6 fade-up" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', color: '#09203e' }}>
              Soccerex{' '}
              <span style={{ color: '#bfb170' }}>Speakers</span>
            </h2>
            <div className="fade-up mx-auto mb-6" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, #09203e, transparent)' }} />
            <p className="font-body fade-up mx-auto" style={{ fontSize: '1.05rem', color: '#555', maxWidth: '720px' }}>
              Presidents, commissioners, legends, operators, and innovators. The people shaping the future of football share the Soccerex stage.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {visibleSpeakers.map((s, i) => (
              <div key={s.name + i} className="group">
                <div style={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  aspectRatio: '3/4',
                  background: '#fff',
                  boxShadow: '0 10px 30px rgba(9,32,62,0.1)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(9,32,62,0.22)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(9,32,62,0.1)' }}
                >
                  <img src={`/images/events/speakers/speaker${i + 1 + (showAllSpeakers ? 0 : 0)}.webp`} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'saturate(0.9)', transition: 'transform 0.5s, filter 0.3s' }} loading="lazy"
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.filter = 'saturate(1.1)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'saturate(0.9)' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(9,32,62,0.95) 100%)' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 14px' }}>
                    <p className="font-heading font-bold" style={{ fontSize: '0.92rem', color: '#fff', lineHeight: 1.25, marginBottom: '3px' }}>{s.name}</p>
                    <p className="font-body" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.35 }}>{s.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {!showAllSpeakers && SPEAKERS.length > 24 && (
            <div className="text-center mt-12 fade-up">
              <button
                onClick={() => setShowAllSpeakers(true)}
                className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em] cursor-pointer border-none"
                style={{ background: '#09203e', color: '#fff', padding: '16px 36px', fontSize: '0.85rem', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#0d2b52' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#09203e' }}
              >
                Show more speakers <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      <PixelDivider color="#eae8e4" layers={4} height={90} speed={0.5} />

      {/* ═══ CTA ════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #09203e 0%, #0d2b52 50%, #09203e 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <NetworkNodes color="#bfb170" nodeCount={35} opacity={0.15} />
        <div className="absolute pointer-events-none" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '900px', height: '900px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,177,112,0.1) 0%, transparent 60%)' }} />
        <div className="relative z-10 text-center" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Calendar size={40} color="#bfb170" strokeWidth={2} className="mx-auto mb-6 fade-up" />
          <p className="section-label text-gold mb-4 fade-up">JOIN US IN AMSTERDAM</p>
          <h2 className="font-heading font-bold text-white leading-tight mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
            Soccerex Europe 2026{' '}
            <span style={{ color: '#bfb170' }}>Awaits</span>
          </h2>
          <div className="fade-up mx-auto mb-8" style={{ width: '100px', height: '3px', background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }} />
          <p className="font-body text-white/75 leading-relaxed fade-up mb-10 mx-auto" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.2rem)', maxWidth: '720px' }}>
            May 11 to 13, 2026. Johan Cruijff ArenA. Federations, leagues, clubs, brands, media, and football legends, together.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 fade-up">
            <Link to="/europe-2026" className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
              style={{ background: '#bfb170', color: '#09203e', padding: '18px 40px', fontSize: '0.85rem', textDecoration: 'none', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#d4c78e' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#bfb170' }}
            >
              Event Details <ArrowRight size={16} />
            </Link>
            <a href="mailto:partner@soccerex.com" className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
              style={{ background: 'transparent', color: '#fff', padding: '18px 40px', fontSize: '0.85rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#bfb170'; e.currentTarget.style.color = '#bfb170' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = '#fff' }}
            >
              Partner With Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
