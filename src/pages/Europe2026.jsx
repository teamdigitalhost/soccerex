import { useEffect } from 'react'
import { ArrowLeft, ArrowRight, MapPin, Calendar, Ticket, FileText, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import PixelDivider from '../components/PixelDivider'

const IMG = '/events/europe/2026'
const SPK = '/images/speakers/europe-2026'

const SPEAKERS = [
  { name: 'Aaryaman Banerji', role: 'Lane Clark & Peacock, Head of Football Governance', img: `${SPK}/aaryaman-banerji.webp` },
  { name: 'Arron Ackerman', role: 'FIFA, Team Lead for Football Performance Analysis', img: `${SPK}/arron-ackerman.webp` },
  { name: 'Bianca Rech', role: "FC Bayern München, Director, Women's Football", img: `${SPK}/bianca-rech.webp` },
  { name: 'Blair McNally', role: 'Football Content Creator', img: `${SPK}/blair-mcnally.webp` },
  { name: 'Cecilia Lagos', role: 'ESPN, Sports Journalist', img: `${SPK}/cecilia-lagos.webp` },
  { name: 'Christian Nourry', role: 'Queens Park Rangers FC, CEO', img: `${SPK}/christian-nourry.webp` },
  { name: 'Dirk Schlünz', role: 'FC Nürnberg, Managing Director', img: `${SPK}/dirk-schlunz.webp` },
  { name: 'Dr. Ravi Gill', role: 'The OPSIS Group, CEO and Co-Founder', img: `${SPK}/dr-ravi-gill.webp` },
  { name: 'Dustin Boettger', role: 'Global Soccer Network, CEO', img: `${SPK}/dustin-boettger.webp` },
  { name: 'Eva Gerritse', role: 'Blauw Sponsorship Impact, CEO', img: `${SPK}/eva-gerritse.webp` },
  { name: 'Frederique de Laat', role: 'Branthlete, Founder', img: `${SPK}/frederique-de-laat.webp` },
  { name: 'Gareth Jennings', role: 'Harburg Group (Al Kholood, CF Cadiz), Group Sporting Director', img: `${SPK}/gareth-jennings.webp` },
  { name: 'Gennaro Giulio Tedeschi', role: "Tedeschi and Partners Women's Football Management, CEO and Founder", img: `${SPK}/gennaro-giulio-tedeschi.webp` },
  { name: 'Gilbert Martina', role: 'Curaçao Football Federation, President', img: `${SPK}/gilbert-martina.webp` },
  { name: 'Henning Bindzus', role: 'Hannover 96, CEO Business', img: `${SPK}/henning-bindzus.webp` },
  { name: 'Jan Willem van Dop', role: 'Go Ahead Eagles Voetbal B.V., CEO', img: `${SPK}/jan-willem-van-dop.webp` },
  { name: 'Jeff Lahart', role: 'Special Olympics, Lead, Global Football Development', img: `${SPK}/jeff-lahart.webp` },
  { name: 'Jim McCarthy', role: 'Impresario Strategic, Founder', img: `${SPK}/jim-mccarthy.webp` },
  { name: 'Kyle Israel', role: 'Momentous Sports and Magnolia Hill Partners, Co-Founder and External Relations', img: `${SPK}/kyle-israel.webp` },
  { name: 'Mauro Steentjes', role: 'The Stadium Consultancy, Stadium Specialist Consultant', img: `${SPK}/mauro-steentjes.webp` },
  { name: 'Miles Addy', role: 'The Content Club, Director', img: `${SPK}/miles-addy.webp` },
  { name: 'Nick Lewis', role: 'COPA90, Creative Director', img: `${SPK}/nick-lewis.webp` },
  { name: 'Ollie Cantrill', role: 'Insight Eleven, Founder', img: `${SPK}/ollie-cantrill.webp` },
  { name: 'Paul Rayment', role: 'Footballco, PR Manager', img: `${SPK}/paul-rayment.webp` },
  { name: 'Roy Vermeer', role: 'Vermeer Sports Law, Owner', img: `${SPK}/roy-vermeer.webp` },
  { name: 'Sanne Kramer', role: 'VB Voeding and PWC Zwolle, Co-Founder and First Team Nutritionist', img: `${SPK}/sanne-kramer.webp` },
  { name: 'Sébastien Bassong', role: 'Take What Is Yours, Founder', img: `${SPK}/sebastien-bassong.webp` },
  { name: 'Steyn Akkerman', role: 'MVV Maastricht, First Team Scout and Football Relations', img: `${SPK}/steyn-akkerman.webp` },
  { name: 'Terry Flewers', role: 'The Football Terrace, Founder', img: `${SPK}/terry-flewers.webp` },
  { name: 'Toan Ravenscroft', role: 'MSQ Sport and Entertainment, Managing Partner', img: `${SPK}/toan-ravenscroft.webp` },
  { name: 'Tom Gorringe', role: 'Swansea City Football Club, Chief Executive Officer', img: `${SPK}/tom-gorringe.webp` },
  { name: 'Tom Kopelman', role: 'The OPSIS Group, COO and Co-Founder', img: `${SPK}/tom-kopelman.webp` },
]

const WHY_ATTEND = [
  { title: 'Unrivalled Content', desc: 'Hear from global decision-makers across clubs, leagues, federations, and brands.', img: `${IMG}/sections/event-group-photo.jpg` },
  { title: 'Strategic Networking', desc: 'Build relationships with the people shaping the commercial and operational landscape.', img: `${IMG}/sections/event-networking.jpg` },
  { title: 'Exhibitor Floor and Activations', desc: 'Discover innovation and build partnerships with leading solution providers.', img: `${IMG}/sections/event-exhibitor.jpg` },
  { title: 'Social Events and VIP Experiences', desc: 'Connect in informal settings, from happy hours to curated evening programmes.', img: `${IMG}/sections/event-vip-reception.webp` },
]

const TIMELINE = [
  { day: 'Day 0', date: '11th May', title: 'VIP Reception Evening', time: '6:00 PM onwards', highlight: 'Royal Lounge, Floor 6 (with views of the pitch)' },
  { day: 'Day 1', date: '12th May', title: 'Event Day 1', time: '8:00 AM onwards', highlight: 'Full conference programme + social evening' },
  { day: 'Day 2', date: '13th May', title: 'Event Day 2', time: '9:00 AM onwards', highlight: 'First panel at 10am' },
]

const THEMES = [
  'Commercial growth and sponsorship', 'Governance and strategy', 'Technology in football',
  'Fan engagement and media innovation', 'Infrastructure and stadia development',
  'Performance and medical advances', 'Talent pathways and academy focus', "Women's football",
]

export default function Europe2026() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="event-page theme-europe" style={{ background: 'var(--event-bg-dark)' }}>

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="inner-hero relative overflow-hidden flex items-center">
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${IMG}/sections/arena-interior.webp)`,
          backgroundSize: 'cover', backgroundPosition: 'center', filter: 'saturate(0.4) brightness(0.25)',
        }} />
        <div className="absolute inset-0" style={{ background: 'var(--event-overlay)' }} />

        <div className="relative z-10 text-center w-full" style={{ padding: 'clamp(60px,7vw,110px) clamp(24px,5vw,80px) clamp(60px,8vw,100px)' }}>
          <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest mb-6" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <div className="flex justify-center mb-6">
            <span className="event-badge"><span className="event-badge-dot" /> Amsterdam</span>
          </div>

          {/* Europe-specific anniversary crest as the hero lockup */}
          <div className="inner-hero-crest inner-hero-crest--xl flex justify-center fade-up">
            <img
              src="/brand/crests/crest-europe-white.svg"
              alt="Soccerex Europe, Est. 1996, 30 Years"
              style={{
                filter: 'drop-shadow(0 10px 50px rgba(200, 48, 44, 0.5)) drop-shadow(0 0 110px rgba(200, 48, 44, 0.2))',
              }}
            />
          </div>

          <h1 className="font-heading font-bold text-white leading-tight mb-2" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)', textShadow: '0 2px 30px rgba(0,0,0,0.5)' }}>
            AMSTERDAM
          </h1>
          <h2 className="font-heading font-bold leading-tight mb-6" style={{ fontSize: 'clamp(1.4rem, 3.2vw, 2.6rem)', color: '#fff', textShadow: '0 0 40px rgba(200,48,44,0.6), 0 2px 20px rgba(0,0,0,0.4)' }}>
            <span style={{ color: 'var(--event-primary)', WebkitTextStroke: '1px rgba(255,255,255,0.15)' }}>WELCOMES THE FOOTBALL WORLD</span>
          </h2>

          <div className="flex items-center justify-center gap-12 mb-6 flex-wrap">
            <div className="text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-1">Venue</p>
              <p className="font-heading font-bold text-white text-xl">Johan Cruijff ArenA</p>
            </div>
            <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, transparent, var(--event-primary), transparent)' }} />
            <div className="text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-1">Date</p>
              <p className="font-heading font-bold text-white text-xl">11-13th May 2026</p>
            </div>
          </div>

          <p className="font-body text-white/70 leading-relaxed mx-auto mb-8" style={{ fontSize: '1.05rem', maxWidth: '700px' }}>
            Amsterdam, full of football innovation and rich history, will provide the perfect backdrop for Soccerex Europe 2026. The renowned Johan Cruijff ArenA, an international leader in sustainability and fan experience, will be the ideal venue for an event that will celebrate and shape the future of the beautiful game.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://soccerexeurope2026.eventify.io/t2/tickets/" target="_blank" rel="noopener noreferrer" className="event-btn-primary"><Ticket size={16} /> Get Your Ticket</a>
            <Link to="/press/soccerex-europe-amsterdam-may-2026" className="event-btn-outline"><FileText size={16} /> Press Release</Link>
            <a href="https://soccerexeurope2026.eventify.io/t2/tickets/79DF37" target="_blank" rel="noopener noreferrer" className="event-btn-outline"><ExternalLink size={16} /> Rightsholder Registration</a>
            <a href="/events/europe/2026/selection-of-attendees.pdf" target="_blank" rel="noopener noreferrer" className="event-btn-outline"><FileText size={16} /> Selection of Attendees</a>
          </div>

          <a href="/events/europe/2026/agenda-concept.pdf" target="_blank" rel="noopener noreferrer"
            className="event-btn-primary inline-flex items-center gap-2 mt-4 px-8 py-4 font-heading font-bold text-sm uppercase tracking-widest"
            style={{ textDecoration: 'none' }}>
            Agenda Concept
          </a>
        </div>
      </section>

      {/* ─── EVENT TIMELINE ───────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(180deg, #200808 0%, #2a0e0e 40%, #1a0505 100%)', padding: 'clamp(60px,8vw,100px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="flex justify-center mb-8">
            <span className="event-badge"><span className="event-badge-dot" /> Event Timeline</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIMELINE.map((item) => (
              <div key={item.day} className="event-card">
                <span className="font-mono text-xs uppercase tracking-widest event-accent-light">{item.day}</span>
                <h3 className="font-heading font-bold text-white text-2xl mt-2 mb-1">{item.date}</h3>
                <p className="font-heading font-semibold text-white/80 mb-3">{item.title}</p>
                <p className="font-body text-white/50 text-sm mb-2"><Calendar size={14} className="inline mr-1" />{item.time}</p>
                <p className="font-body text-white/40 text-sm">{item.highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark to white pixel glitch divider */}
      <PixelDivider color="#200808" layers={4} height={100} speed={0.6} />

      {/* ─── WHAT IS SOCCEREX EUROPE (White section) ────────────────────── */}
      <section style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(160px,16vw,200px) clamp(24px,5vw,80px) clamp(60px,8vw,100px)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-12">
            <img src={`${IMG}/sections/locker-room.webp`} alt="Johan Cruijff ArenA locker room" style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', aspectRatio: '4/3' }} />
            <div>
              <h2 className="font-heading font-bold text-2xl mb-6" style={{ color: '#1a1a1a' }}>
                What Is <span style={{ color: 'var(--event-primary)' }}>Soccerex Europe</span>?
              </h2>
              <p className="font-body leading-relaxed mb-4" style={{ fontSize: '1.05rem', color: '#444' }}>
                Soccerex Europe is the premier global event for football's commercial and strategic community. A two-day convergence of high-impact content, executive networking, brand activations, and industry insight at the iconic Johan Cruijff ArenA.
              </p>
              <p className="font-body leading-relaxed" style={{ fontSize: '1.05rem', color: '#444' }}>
                From thought-leadership sessions and forward-thinking panel discussions, to curated networking experiences and international exhibitor showcases, Soccerex Europe unites the leaders powering the sport's evolution.
              </p>
            </div>
          </div>

          <h3 className="font-heading font-bold text-xl mb-6" style={{ color: '#1a1a1a' }}>Two Days of Insightful Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {THEMES.map((theme) => (
              <div key={theme} className="flex items-center gap-4 px-6 py-5 rounded-xl transition-all duration-200" style={{ background: 'rgba(200,48,44,0.06)', border: '1px solid rgba(200,48,44,0.15)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,48,44,0.12)'; e.currentTarget.style.borderColor = 'rgba(200,48,44,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(200,48,44,0.06)'; e.currentTarget.style.borderColor = 'rgba(200,48,44,0.15)' }}
              >
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--event-primary)', flexShrink: 0 }} />
                <span className="font-body font-medium" style={{ fontSize: '0.95rem', color: '#1a1a1a' }}>{theme}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* White to dark pixel glitch divider */}
      <PixelDivider color="#eae8e4" layers={4} height={100} speed={0.6} />

      {/* ─── WHY ATTEND (Dark section for contrast rhythm) ─────────────── */}
      <section style={{ background: 'linear-gradient(180deg, #1a0505 0%, #200808 35%, #2a0e0e 70%, #200808 100%)', padding: 'clamp(160px,16vw,200px) clamp(24px,5vw,80px) clamp(60px,8vw,100px)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 className="font-heading font-bold text-white text-2xl mb-8">Why Attend?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WHY_ATTEND.map((item) => (
              <div key={item.title} style={{ borderRadius: '14px', overflow: 'hidden', position: 'relative', aspectRatio: '4/3', transition: 'transform 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <img src={item.img} alt={item.title} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px' }}>
                  <h3 className="font-heading font-bold uppercase tracking-wider mb-3" style={{ fontSize: '1.05rem', color: '#fff' }}>{item.title}</h3>
                  <p className="font-body leading-relaxed" style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark to white pixel glitch divider */}
      <PixelDivider color="#200808" layers={4} height={100} speed={0.6} />

      {/* ─── CURRENT SPEAKERS (White section) ────────────────────────────── */}
      <section style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(160px,16vw,200px) clamp(24px,5vw,80px) clamp(60px,8vw,100px)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="flex justify-center mb-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full" style={{ background: 'rgba(200,48,44,0.08)', border: '1px solid rgba(200,48,44,0.2)', color: 'var(--event-primary)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--event-primary)' }} />
              2026 Lineup
            </span>
          </div>
          <h2 className="font-heading font-bold text-center text-2xl mb-8" style={{ color: '#1a1a1a' }}>
            On Stage: <span style={{ color: 'var(--event-primary)' }}>Football's Sharpest Voices</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {SPEAKERS.map((s) => (
              <div key={s.name} style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', aspectRatio: '3/4', cursor: 'default' }}>
                <img src={s.img} alt={s.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,32,62,0.95) 0%, rgba(9,32,62,0.4) 45%, transparent 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px' }}>
                  <p className="font-heading font-bold text-sm uppercase tracking-wide" style={{ color: '#fff' }}>{s.name}</p>
                  <p className="font-body text-xs mt-1" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{s.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DOCUMENTS AND RESOURCES (White) ─────────────────────────────── */}
      <section style={{ background: 'linear-gradient(180deg, #eae8e4 0%, #e2dfda 50%, #eae8e4 100%)', padding: 'clamp(60px,8vw,100px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="font-heading font-bold text-2xl mb-4" style={{ color: '#1a1a1a' }}>Event Resources</h2>
          <p className="font-body mb-8" style={{ color: '#666' }}>Download documents and materials for Soccerex Europe 2026.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/events/europe/2026/agenda-concept.pdf" target="_blank" rel="noopener noreferrer" className="event-btn-primary"><FileText size={16} /> Agenda Concept</a>
            <a href="/events/europe/2026/selection-of-attendees.pdf" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 font-body font-semibold text-xs uppercase tracking-widest cursor-pointer"
              style={{ background: '#fff', color: 'var(--event-primary)', border: '1px solid rgba(200,48,44,0.3)', borderRadius: '4px', textDecoration: 'none' }}>
              <FileText size={16} /> Selection of Attendees
            </a>
            <Link to="/press/soccerex-europe-amsterdam-may-2026"
              className="inline-flex items-center gap-2 px-6 py-3 font-body font-semibold text-xs uppercase tracking-widest cursor-pointer"
              style={{ background: '#fff', color: '#333', border: '1px solid #ddd', borderRadius: '4px', textDecoration: 'none' }}>
              <FileText size={16} /> Press Release
            </Link>
          </div>
        </div>
      </section>

      {/* White to dark pixel glitch divider */}
      <PixelDivider color="#eae8e4" layers={4} height={100} speed={0.6} />

      {/* ─── REGISTER CTA ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ padding: 'clamp(180px,18vw,240px) clamp(24px,5vw,80px) clamp(80px,10vw,140px)', textAlign: 'center' }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${IMG}/sections/cta-background.jpeg)`,
          backgroundSize: 'cover', backgroundPosition: 'center', filter: 'saturate(0.3) brightness(0.2)',
        }} />
        <div className="absolute inset-0" style={{ background: 'var(--event-overlay)' }} />

        <div className="relative z-10" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 className="font-heading font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Secure Your Place
          </h2>
          <p className="font-body text-white/60 mb-6">Early bird tickets available. Limited exhibitor space.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://soccerexeurope2026.eventify.io/t2/tickets/" target="_blank" rel="noopener noreferrer" className="event-btn-primary" style={{ padding: '18px 36px', fontSize: '15px' }}>
              <Ticket size={18} /> Register Now
            </a>
          </div>
          <p className="font-body text-white/40 text-sm mt-6">
            Sponsorship and exhibitor enquiries: <a href="mailto:press@soccerex.com" style={{ color: 'var(--event-primary-light)', textDecoration: 'none' }}>press@soccerex.com</a>
          </p>
        </div>
      </section>
    </div>
  )
}
