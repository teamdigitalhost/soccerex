import { useEffect } from 'react'
import { ArrowLeft, ArrowRight, MapPin, Calendar, Ticket, FileText, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import PixelDivider from '../components/PixelDivider'

const IMG = '/events/europe/2026'

const SPEAKERS = [
  { name: 'Javier Tebas', role: 'President, LALIGA', img: `${IMG}/speakers/javier-tebas.jpg` },
  { name: 'Dani', role: 'Former AFC Ajax and Portugal International', img: `${IMG}/speakers/dani.jpg` },
  { name: 'Demy de Zeeuw', role: 'Founder, 433 (Former Ajax International)', img: `${IMG}/speakers/demy-de-zeeuw.jpg` },
  { name: 'Sebastien Bassong', role: 'Former Premier League Player and Performance Coach', img: `${IMG}/speakers/sebastien-bassong.jpg` },
  { name: 'Nicola Legrottaglie', role: 'Former Italian International and Coach', img: `${IMG}/speakers/nicola-legrottaglie.jpg` },
  { name: 'Paul Barber OBE', role: 'Chief Executive and Deputy Chairman, Brighton and Hove Albion FC', img: `${IMG}/speakers/paul-barber.jpg` },
  { name: 'Gijs de Jong', role: 'General Secretary, Royal Netherlands Football Association', img: `${IMG}/speakers/gijs-de-jong.jpg` },
  { name: 'Sarah Guilfoyle', role: 'Managing Director, Wigan Athletic FC', img: `${IMG}/speakers/sarah-guilfoyle.jpg` },
  { name: 'Mark Miles', role: 'Managing Director, West Bromwich Albion FC', img: `${IMG}/speakers/mark-miles.jpg` },
  { name: 'Peter Ridsdale', role: 'CEO, Preston North End FC', img: `${IMG}/speakers/peter-ridsdale.jpg` },
  { name: 'Andy Scoulding', role: 'Head of Loans and Pathways, Tottenham Hotspur', img: `${IMG}/speakers/andy-scoulding.jpg` },
  { name: 'Rini De Groot', role: 'Head of Scouting, PSV', img: `${IMG}/speakers/rini-de-groot.jpg` },
  { name: 'Luke Wilson', role: 'Chief Commercial Officer, Millwall FC', img: `${IMG}/speakers/luke-wilson.jpg` },
  { name: 'Rob Pilgrim', role: 'Head of Sport, YouTube EMEA', img: `${IMG}/speakers/rob-pilgrim.jpg` },
  { name: 'Tim Edwards', role: 'Sports Partnerships Lead, TikTok', img: `${IMG}/speakers/tim-edwards.jpg` },
  { name: 'Misha Sher', role: 'Head of Football, WPP', img: `${IMG}/speakers/misha-sher.jpg` },
  { name: 'Maurits Schon', role: 'Managing Director and COO, OneFootball', img: `${IMG}/speakers/maurits-schon.jpg` },
  { name: 'Hidde Salverda', role: 'COO, Johan Cruijff ArenA', img: `${IMG}/speakers/hidde-salverda.jpg` },
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
      <section className="relative overflow-hidden flex items-center" style={{ minHeight: '65vh' }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${IMG}/sections/arena-interior.webp)`,
          backgroundSize: 'cover', backgroundPosition: 'center', filter: 'saturate(0.4) brightness(0.25)',
        }} />
        <div className="absolute inset-0" style={{ background: 'var(--event-overlay)' }} />

        <div className="relative z-10 text-center w-full" style={{ padding: 'clamp(140px,15vw,200px) clamp(24px,5vw,80px) clamp(80px,10vw,120px)' }}>
          <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest mb-6" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <div className="flex justify-center mb-6">
            <span className="event-badge"><span className="event-badge-dot" /> Amsterdam</span>
          </div>

          <h1 className="font-heading font-bold text-white leading-tight mb-2" style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', textShadow: '0 2px 30px rgba(0,0,0,0.5)' }}>
            AMSTERDAM
          </h1>
          <h2 className="font-heading font-bold leading-tight mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#fff', textShadow: '0 0 40px rgba(200,48,44,0.6), 0 2px 20px rgba(0,0,0,0.4)' }}>
            <span style={{ color: 'var(--event-primary)', WebkitTextStroke: '1px rgba(255,255,255,0.15)' }}>WELCOMES THE</span><br />
            <span style={{ color: 'var(--event-primary)', WebkitTextStroke: '1px rgba(255,255,255,0.15)' }}>FOOTBALL WORLD</span>
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
            <Link to="/europe-2026/press" className="event-btn-outline"><FileText size={16} /> Press Release</Link>
            <a href="https://soccerexeurope2026.eventify.io/t2/tickets/79DF37" target="_blank" rel="noopener noreferrer" className="event-btn-outline"><ExternalLink size={16} /> Rightsholder Registration</a>
            <a href="/events/europe/2026/selection-of-attendees.pdf" target="_blank" rel="noopener noreferrer" className="event-btn-outline"><FileText size={16} /> Selection of Attendees</a>
          </div>

          <a href="/events/europe/2026/agenda-concept.pdf" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 px-8 py-4 font-heading font-bold text-sm uppercase tracking-widest"
            style={{ background: '#09203e', color: '#fff', textDecoration: 'none', border: '2px solid rgba(255,255,255,0.2)' }}>
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

          <h3 className="font-heading font-bold text-xl mb-4" style={{ color: '#1a1a1a' }}>Two Days of Insightful Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            {THEMES.map((theme) => (
              <div key={theme} className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: '#f9f8f6', border: '1px solid #e0ddd8' }}>
                <span style={{ color: 'var(--event-primary)', fontWeight: 700 }}>&#9656;</span>
                <span className="font-body text-sm" style={{ color: '#333' }}>{theme}</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHY_ATTEND.map((item) => (
              <div key={item.title} style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', aspectRatio: '3/4' }}>
                <img src={item.img} alt={item.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px' }}>
                  <h3 className="font-heading font-bold text-sm uppercase tracking-wider mb-2" style={{ color: '#fff' }}>{item.title}</h3>
                  <p className="font-body text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark to white pixel glitch divider */}
      <PixelDivider color="#200808" layers={4} height={100} speed={0.6} />

      {/* ─── PAST SPEAKERS (White section) ──────────────────────────────── */}
      <section style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(160px,16vw,200px) clamp(24px,5vw,80px) clamp(60px,8vw,100px)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="flex justify-center mb-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full" style={{ background: 'rgba(200,48,44,0.08)', border: '1px solid rgba(200,48,44,0.2)', color: 'var(--event-primary)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--event-primary)' }} />
              Past Speakers
            </span>
          </div>
          <h2 className="font-heading font-bold text-center text-2xl mb-8" style={{ color: '#1a1a1a' }}>
            Legends of the Game, <span style={{ color: 'var(--event-primary)' }}>United at Soccerex</span>
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
