import { useEffect } from 'react'
import { ArrowLeft, ArrowRight, Calendar, FileText, Mic, Users, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import PixelDivider from '../components/PixelDivider'
import {
  HOME, MIAMI_2026, pressRelease, eventSpeakers, eventAgenda, eventAgendaConcept,
} from '../lib/routes'

const EVENT_API_SLUG = 'soccerex-europe-2026'

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

const HIGHLIGHTS = [
  { title: 'Unrivalled Content', desc: 'Global decision-makers from clubs, leagues, federations, and brands took the stage across two packed days.', img: `${IMG}/sections/event-group-photo.jpg` },
  { title: 'Strategic Networking', desc: 'New relationships were built with the people shaping football\'s commercial and operational landscape.', img: `${IMG}/sections/event-networking.jpg` },
  { title: 'Exhibitor Floor and Activations', desc: 'Solution providers showcased innovation and forged partnerships across the exhibitor floor.', img: `${IMG}/sections/event-exhibitor.jpg` },
  { title: 'Social Program and VIP Experiences', desc: 'Evening receptions and curated experiences turned conversations into commitments.', img: `${IMG}/sections/event-vip-reception.webp` },
]

const TIMELINE = [
  { day: 'Day 0', date: '11th May', title: 'VIP Reception', time: 'Evening', highlight: 'Royal Lounge, Floor 6, with views of the pitch' },
  { day: 'Day 1', date: '12th May', title: 'Conference Day 1', time: 'Full day', highlight: 'Program sessions plus the evening social' },
  { day: 'Day 2', date: '13th May', title: 'Conference Day 2', time: 'Full day', highlight: 'Final panels and farewell program' },
]

const THEMES = [
  'Commercial growth and sponsorship', 'Governance and strategy', 'Technology in football',
  'Fan engagement and media innovation', 'Infrastructure and stadia development',
  'Performance and medical advances', 'Talent pathways and academy focus', "Women's football",
]

const STATS = [
  { num: '40+',  label: 'Speakers on stage' },
  { num: '2',    label: 'Days of program' },
  { num: '8',    label: 'Themes explored' },
  { num: '30+',  label: 'Countries represented' },
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
          <Link to={HOME} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest mb-6" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <div className="flex justify-center mb-6">
            <span className="event-badge" style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)' }}>
              <CheckCircle2 size={12} style={{ color: '#86efac' }} /> Concluded &middot; 12-13 May 2026
            </span>
          </div>

          {/* Main Soccerex 30-year badge as the hero lockup */}
          <div className="inner-hero-crest inner-hero-crest--xl flex justify-center">
            <img
              src="/brand/crests/crest-main-white.svg"
              alt="Soccerex, Est. 1996, 30 Years"
              style={{
                filter: 'drop-shadow(0 0 18px rgba(255,255,255,0.7)) drop-shadow(0 0 60px rgba(255,255,255,0.45)) drop-shadow(0 12px 40px rgba(0,0,0,0.5))',
              }}
            />
          </div>

          <h1 className="font-heading font-bold text-white leading-tight mb-2" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)', textShadow: '0 2px 30px rgba(0,0,0,0.5)' }}>
            AMSTERDAM
          </h1>
          <h2 className="font-heading font-bold leading-tight mb-6" style={{ fontSize: 'clamp(1.4rem, 3.2vw, 2.6rem)', color: '#fff', textShadow: '0 0 40px rgba(200,48,44,0.6), 0 2px 20px rgba(0,0,0,0.4)' }}>
            <span style={{ color: 'var(--event-primary)', WebkitTextStroke: '1px rgba(255,255,255,0.15)' }}>WELCOMED THE FOOTBALL WORLD</span>
          </h2>

          <div className="flex items-center justify-center gap-12 mb-6 flex-wrap">
            <div className="text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-1">Venue</p>
              <p className="font-heading font-bold text-white text-xl">Johan Cruijff ArenA</p>
            </div>
            <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, transparent, var(--event-primary), transparent)' }} />
            <div className="text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-1">Date</p>
              <p className="font-heading font-bold text-white text-xl">11-13 May 2026</p>
            </div>
          </div>

          <p className="font-body text-white/75 leading-relaxed mx-auto mb-3" style={{ fontSize: '1.1rem', maxWidth: '700px' }}>
            Thank you to everyone who joined us in Amsterdam.
          </p>
          <p className="font-body text-white/65 leading-relaxed mx-auto mb-8" style={{ fontSize: '1rem', maxWidth: '720px' }}>
            Two days of high-impact content, executive networking, brand activations, and industry insight at the Johan Cruijff ArenA. The football world came to Amsterdam, and the conversations carry forward.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link to={MIAMI_2026} className="event-btn-primary">
              Next: Miami 2026 <ArrowRight size={16} />
            </Link>
            <Link to={eventSpeakers(EVENT_API_SLUG)} className="event-btn-outline"><Mic size={16} /> Who Spoke</Link>
            <Link to={eventAgenda(EVENT_API_SLUG)} className="event-btn-outline"><Calendar size={16} /> The Agenda</Link>
            <Link to={pressRelease('soccerex-europe-amsterdam-may-2026')} className="event-btn-outline"><FileText size={16} /> Press Release</Link>
          </div>
        </div>
      </section>

      {/* ─── BY THE NUMBERS (post-event stat strip) ───────────────────────── */}
      <section style={{ background: 'linear-gradient(180deg, #200808 0%, #2a0e0e 40%, #1a0505 100%)', padding: 'clamp(60px,8vw,100px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="flex justify-center mb-8">
            <span className="event-badge"><span className="event-badge-dot" /> Amsterdam, by the numbers</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {STATS.map((s) => (
              <div key={s.label} className="event-card" style={{ textAlign: 'center', padding: '24px 16px' }}>
                <span className="font-heading font-bold" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--event-primary-light)', lineHeight: 1, display: 'block' }}>{s.num}</span>
                <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.6)', display: 'block', marginTop: 8 }}>{s.label}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-center mb-6">
            <span className="event-badge"><span className="event-badge-dot" /> How it unfolded</span>
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
              <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--event-primary)', letterSpacing: '0.2em' }}>Amsterdam, May 2026</p>
              <h2 className="font-heading font-bold text-2xl mb-6" style={{ color: '#1a1a1a' }}>
                A two-day convergence at <span style={{ color: 'var(--event-primary)' }}>Johan Cruijff ArenA</span>
              </h2>
              <p className="font-body leading-relaxed mb-4" style={{ fontSize: '1.05rem', color: '#444' }}>
                Soccerex Europe is the premier global event for football's commercial and strategic community. In May, the 2026 edition gathered that community for two days of high-impact content, executive networking, brand activations, and industry insight at the iconic Johan Cruijff ArenA.
              </p>
              <p className="font-body leading-relaxed" style={{ fontSize: '1.05rem', color: '#444' }}>
                Thought-leadership sessions, forward-thinking panel discussions, curated networking, and international exhibitor showcases brought together the leaders powering the sport's evolution. The conversations that started in Amsterdam continue in Miami in September.
              </p>
            </div>
          </div>

          <h3 className="font-heading font-bold text-xl mb-6" style={{ color: '#1a1a1a' }}>The themes we explored</h3>
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

      {/* ─── WHAT MADE IT SPECIAL (Dark section for contrast rhythm) ───── */}
      <section style={{ background: 'linear-gradient(180deg, #1a0505 0%, #200808 35%, #2a0e0e 70%, #200808 100%)', padding: 'clamp(160px,16vw,200px) clamp(24px,5vw,80px) clamp(60px,8vw,100px)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--event-primary-light)', letterSpacing: '0.2em' }}>Across the two days</p>
          <h2 className="font-heading font-bold text-white text-2xl mb-8">What Amsterdam Delivered</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {HIGHLIGHTS.map((item) => (
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

      {/* ─── SPEAKERS (White section, archive treatment) ─────────────────── */}
      <section style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(160px,16vw,200px) clamp(24px,5vw,80px) clamp(60px,8vw,100px)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="flex justify-center mb-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full" style={{ background: 'rgba(200,48,44,0.08)', border: '1px solid rgba(200,48,44,0.2)', color: 'var(--event-primary)' }}>
              <Users size={11} /> Speaker Archive
            </span>
          </div>
          <h2 className="font-heading font-bold text-center text-2xl mb-3" style={{ color: '#1a1a1a' }}>
            The voices on the <span style={{ color: 'var(--event-primary)' }}>Amsterdam</span> stage
          </h2>
          <p className="font-body text-center mb-8" style={{ color: '#666', maxWidth: '640px', margin: '0 auto 32px' }}>
            Who spoke, what they covered, and where to dig deeper. The full searchable directory lives on the speaker archive page.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {SPEAKERS.map((s) => (
              <div key={s.name} style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', aspectRatio: '3/4', cursor: 'default' }}>
                <img src={s.img} alt={s.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.9)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,32,62,0.95) 0%, rgba(9,32,62,0.4) 45%, transparent 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px' }}>
                  <p className="font-heading font-bold text-sm uppercase tracking-wide" style={{ color: '#fff' }}>{s.name}</p>
                  <p className="font-body text-xs mt-1" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{s.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to={eventSpeakers(EVENT_API_SLUG)}
              className="inline-flex items-center gap-2 px-6 py-3 font-body font-semibold text-xs uppercase tracking-widest"
              style={{ background: '#fff', color: 'var(--event-primary)', border: '1px solid rgba(200,48,44,0.3)', borderRadius: '4px', textDecoration: 'none' }}>
              <Mic size={15} /> Open the speaker archive <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── EVENT ARCHIVE (White) ───────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(180deg, #eae8e4 0%, #e2dfda 50%, #eae8e4 100%)', padding: 'clamp(60px,8vw,100px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="font-heading font-bold text-2xl mb-4" style={{ color: '#1a1a1a' }}>Event Archive</h2>
          <p className="font-body mb-8" style={{ color: '#666' }}>Materials and the press record from Soccerex Europe 2026.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={eventAgenda(EVENT_API_SLUG)} className="event-btn-primary">
              <Calendar size={16} /> Program &amp; sessions
            </Link>
            <a href="/events/europe/2026/agenda-concept.pdf" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 font-body font-semibold text-xs uppercase tracking-widest cursor-pointer"
              style={{ background: '#fff', color: 'var(--event-primary)', border: '1px solid rgba(200,48,44,0.3)', borderRadius: '4px', textDecoration: 'none' }}>
              <FileText size={16} /> Agenda concept (PDF)
            </a>
            <a href="/events/europe/2026/selection-of-attendees.pdf" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 font-body font-semibold text-xs uppercase tracking-widest cursor-pointer"
              style={{ background: '#fff', color: 'var(--event-primary)', border: '1px solid rgba(200,48,44,0.3)', borderRadius: '4px', textDecoration: 'none' }}>
              <FileText size={16} /> Attendee snapshot (PDF)
            </a>
            <Link to={pressRelease('soccerex-europe-amsterdam-may-2026')}
              className="inline-flex items-center gap-2 px-6 py-3 font-body font-semibold text-xs uppercase tracking-widest cursor-pointer"
              style={{ background: '#fff', color: '#333', border: '1px solid #ddd', borderRadius: '4px', textDecoration: 'none' }}>
              <FileText size={16} /> Press release
            </Link>
          </div>
        </div>
      </section>

      {/* White to dark pixel glitch divider */}
      <PixelDivider color="#eae8e4" layers={4} height={100} speed={0.6} />

      {/* ─── NEXT GATHERING CTA (Amsterdam concluded -> Miami 2026) ──────── */}
      <section className="relative overflow-hidden" style={{ padding: 'clamp(180px,18vw,240px) clamp(24px,5vw,80px) clamp(80px,10vw,140px)', textAlign: 'center' }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${IMG}/sections/cta-background.jpeg)`,
          backgroundSize: 'cover', backgroundPosition: 'center', filter: 'saturate(0.3) brightness(0.2)',
        }} />
        <div className="absolute inset-0" style={{ background: 'var(--event-overlay)' }} />

        <div className="relative z-10" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.22em' }}>The conversation continues</p>
          <h2 className="font-heading font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Next stop: Miami, September 2026
          </h2>
          <p className="font-body text-white/65 mb-8" style={{ fontSize: '1.05rem' }}>
            Nine months before the FIFA World Cup, the global football industry lands in Miami. Three days of executive content, networking, and commercial opportunity at Miami Freedom Park.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to={MIAMI_2026} className="event-btn-primary" style={{ padding: '18px 36px', fontSize: '15px' }}>
              Explore Miami 2026 <ArrowRight size={18} />
            </Link>
            <Link to={`${MIAMI_2026}#pre-register`} className="event-btn-outline" style={{ padding: '18px 36px', fontSize: '15px' }}>
              Pre-register
            </Link>
          </div>
          <p className="font-body text-white/40 text-sm mt-8">
            Want to be on stage in Miami? <Link to={eventAgendaConcept('soccerex-miami-2026')} style={{ color: 'var(--event-primary-light)', textDecoration: 'none' }}>Browse the program themes</Link>.
          </p>
          <p className="font-body text-white/30 text-xs mt-3">
            Partner enquiries: <a href="mailto:enquiries@soccerex.com" style={{ color: 'var(--event-primary-light)', textDecoration: 'none' }}>enquiries@soccerex.com</a>
          </p>
        </div>
      </section>
    </div>
  )
}
