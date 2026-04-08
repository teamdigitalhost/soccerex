import { useEffect, useRef } from 'react'
import { ArrowRight, Globe, Users, Mic, Newspaper, Shield, Network as NetworkIcon, Brain, Target, Award } from 'lucide-react'
import { Link } from 'react-router-dom'
import NetworkNodes from '../animations/NetworkNodes'
import PixelDivider from '../components/PixelDivider'

// ─── Timeline data ──────────────────────────────────────────────────────────
const TIMELINE = [
  { year: '1996', title: 'Soccerex Takes Root in London', desc: 'The first-ever football business event launches at Wembley Stadium, laying the groundwork for a global network.' },
  { year: '1998', title: 'Paris Welcomes Soccerex', desc: 'Expanding into mainland Europe, strengthening the organization\'s continental footprint.' },
  { year: '1999', title: 'American Shores', desc: 'First event in Los Angeles creates a vital bridge between European and American football professionals.' },
  { year: '2000', title: 'Manchester Era Begins', desc: 'A city deeply ingrained in football history becomes Soccerex\'s UK home for years to come.' },
  { year: '2001', title: 'Dubai Debut', desc: 'First foothold in the Middle East, fostering connections in a rapidly growing football market.' },
  { year: '2007', title: 'Africa Calls', desc: 'Johannesburg hosts the first African event, a major milestone ahead of the 2010 FIFA World Cup.' },
  { year: '2009', title: 'South America Launch', desc: 'Brasilia hosts the first South American forum, establishing deep roots in Brazilian football.' },
  { year: '2010', title: 'Asia Opens', desc: 'Singapore hosts the inaugural Asian Forum, breaking new ground for football business in the region.' },
  { year: '2010', title: 'Rio de Janeiro', desc: 'The Global Convention moves to Rio for three years. Presentations from Neymar, Ronaldo, and Roy Hodgson.' },
  { year: '2014', title: 'Americas Forum, Barbados', desc: 'The beautiful island hosts the inaugural Americas Forum with MLS Commissioner Don Garber.' },
  { year: '2014', title: 'Jordan, Dead Sea', desc: 'The Asian Forum welcomes Diego Maradona for an exclusive interview with Guillem Balague.' },
  { year: '2016', title: 'Mexico and Qatar', desc: 'The Americas Forum draws 860+ delegates in Mexico. Qatar hosts the Asian Forum ahead of the 2022 World Cup.' },
  { year: '2018', title: 'Miami and China', desc: 'Soccerex Americas launches at Marlins Park in Miami. Soccerex China debuts in Zhuhai.' },
  { year: '2020', title: 'Digital Innovation', desc: 'Soccerex Connected launches as a digital event trilogy, reaching 2,000+ delegates across 100+ countries.' },
  { year: '2022', title: 'The Return', desc: 'Back to Miami Beach Convention Center with 2,000+ delegates, 650 rightsholders, and 100+ speakers.' },
  { year: '2024', title: 'Amsterdam and Miami', desc: 'Record-breaking events in both cities. Soccerex Europe launches at the Johan Cruijff ArenA.' },
  { year: '2025', title: 'Three Continents', desc: 'MENA in Cairo, Europe in Amsterdam, Americas in Miami. The most ambitious year yet.' },
  { year: '2026', title: '30th Anniversary', desc: 'Soccerex celebrates 30 years. Europe returns to the Johan Cruijff ArenA. The platform evolves beyond events into a year-round business solution.' },
]

// ─── ROI case studies ───────────────────────────────────────────────────────
const ROI_CASES = [
  { name: 'Future Lions and Just4Keepers', img: '/images/about/future-lions.png' },
  { name: 'EventsTag', img: '/images/about/roi/eventstag.jpg' },
  { name: 'Visual Sports', img: '/images/about/roi/visual-sports.jpg' },
  { name: 'Terraplas', img: '/images/about/roi/terraplas.jpg' },
  { name: 'Supportershop', img: '/images/about/roi/supportershop.jpg' },
  { name: 'Sport Global Management', img: '/images/about/roi/sgm.jpg' },
  { name: 'Real Madrid CF and bwin', img: '/images/about/roi/real-madrid-bwin.jpg' },
  { name: 'MatchVision and Sporsa+', img: '/images/about/roi/matchvision-sporsa.jpg' },
  { name: 'Lidio Carraro and FIFA World Cup 2014', img: '/images/about/roi/lidio-carraro.jpg' },
  { name: 'FiberLok and Cerro Porteno', img: '/images/about/roi/fiberlok.jpg' },
  { name: 'Champions Travel and talkSPORT', img: '/images/about/roi/champions-travel.jpg' },
  { name: 'Arjowiggins and FIFA World Cup 2014', img: '/images/about/roi/arjowiggins.jpg' },
]

// ─── Network categories ─────────────────────────────────────────────────────
const NETWORK = [
  'Club executives and owners', 'League and federation leaders', 'Investors and family offices',
  'Brands and sponsors', 'Media and broadcasters', 'Technology companies',
  'Agents and intermediaries', 'Legal and financial advisors', 'Government and tourism bodies',
  'Stadia and infrastructure', 'Performance and medical', 'Academy and youth development',
]

// ─── Animated counter ──────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }) {
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
          el.textContent = current + (hasK ? 'k' : '') + (hasPlus ? '+' : '') + suffix
          if (progress < 1) requestAnimationFrame(animate)
          else el.textContent = target + suffix
        }
        requestAnimationFrame(animate)
      }
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, suffix])

  return <span ref={ref}>0</span>
}

// ─── Scroll animations ─────────────────────────────────────────────────────
function useScrollAnimations() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }) },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.fade-up, .slide-left, .slide-right, .scale-up, .blur-reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

export default function About() {
  useScrollAnimations()
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div style={{ background: '#050d1a' }}>

      {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden flex items-center justify-center" style={{ minHeight: '80vh' }}>
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(/images/about/discover-soccerex.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'saturate(0.3) brightness(0.3)',
        }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,13,26,0.5) 0%, rgba(9,32,62,0.85) 100%)' }} />
        <NetworkNodes color="#bfb170" nodeCount={35} opacity={0.15} />
        {/* Radial gold glow */}
        <div className="absolute pointer-events-none" style={{ top: '10%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '800px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,177,112,0.08) 0%, transparent 60%)' }} />

        <div className="relative z-10 text-center" style={{ maxWidth: '900px', padding: 'clamp(140px,15vw,200px) clamp(24px,5vw,80px) clamp(80px,10vw,120px)' }}>
          <p className="section-label text-gold mb-6 fade-up">ABOUT US</p>
          <h1 className="font-heading font-bold text-white leading-[1.05] mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.8rem)' }}>
            The Global Leader in the{' '}
            <span style={{ color: 'var(--color-gold)' }}>Business of Football</span>
          </h1>
          <div className="fade-up mx-auto mb-6" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }} />
          <p className="font-body text-white/65 leading-relaxed fade-up font-mono uppercase tracking-widest" style={{ fontSize: '0.85rem' }}>
            Since 1996
          </p>
        </div>
      </section>

      {/* Wave divider: hero → mission */}
      <PixelDivider color="#f4f3f0" layers={4} height={90} speed={0.5} />

      {/* ═══ MISSION & PLATFORM PILLARS ════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(9,32,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="text-center mb-16">
            <p className="section-label mb-4 fade-up" style={{ color: '#09203e', fontWeight: 600 }}>OUR MISSION</p>
            <h2 className="font-heading font-bold leading-tight mb-6 fade-up" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)', color: '#09203e' }}>
              To Fuel The Global Growth of the{' '}
              <span style={{ color: '#bfb170' }}>Football Community</span>{' '}
              Through World-Class Events, Insights, and Partnerships.
            </h2>
            <div className="fade-up mx-auto mb-8" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, #09203e, transparent)' }} />
            <p className="font-body leading-relaxed fade-up mx-auto" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.1rem)', color: '#444', maxWidth: '720px' }}>
              Celebrating 30 years as the longest-running dedicated football business platform in the world, Soccerex has earned its position as the neutral ground where the global football community comes together. On our 30th anniversary, we continue to evolve. From an events company to a year-round platform. From a place where relationships begin to a system that ensures results.
            </p>
          </div>
          <p className="font-mono uppercase tracking-[0.15em] text-center mb-6 fade-up" style={{ fontSize: '0.72rem', color: '#bfb170', fontWeight: 600 }}>
            Core Values
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              { icon: Shield, title: 'Neutrality & Trust', desc: 'Clubs, leagues, brands, and investors engage openly, without agenda or bias.' },
              { icon: NetworkIcon, title: 'Global Connectivity', desc: 'Decision-makers from every part of the global football ecosystem, connected.' },
              { icon: Brain, title: 'Institutional Memory', desc: 'Relationships and partnerships build over time, not from scratch.' },
              { icon: Target, title: 'Commercial Gravity', desc: 'A concentrated environment where opportunities naturally emerge.' },
              { icon: Award, title: 'Credibility', desc: 'A proven track record across global markets over three decades.' },
            ].map((p, i) => {
              const Icon = p.icon
              return (
                <div key={p.title} className="scale-up" style={{ transitionDelay: `${i * 50}ms` }}>
                  <div style={{ background: '#fff', padding: '32px 24px', borderRadius: '14px', border: '1px solid rgba(9,32,62,0.06)', boxShadow: '0 8px 28px rgba(9,32,62,0.06)', height: '100%', textAlign: 'center', transition: 'transform 0.3s, box-shadow 0.3s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(9,32,62,0.12)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(9,32,62,0.06)' }}
                  >
                    <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'linear-gradient(135deg, #bfb170, #d4c78e)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <Icon size={24} color="#09203e" strokeWidth={2} />
                    </div>
                    <h4 className="font-heading font-bold mb-3" style={{ fontSize: '0.95rem', color: '#09203e' }}>{p.title}</h4>
                    <p className="font-body" style={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.5 }}>{p.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Wave divider: mission → discover */}
      <PixelDivider color="#eae8e4" layers={4} height={90} speed={0.5} />

      {/* ═══ DISCOVER SOCCEREX ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(9,32,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p className="section-label mb-4 fade-up" style={{ color: '#09203e', fontWeight: 600 }}>DISCOVER SOCCEREX</p>
          <h2 className="font-heading font-bold leading-tight mb-4 fade-up" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#09203e' }}>
            We Are Football, <span style={{ color: '#bfb170' }}>Connected.</span>
          </h2>
          <div className="fade-up mb-10" style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, #09203e, rgba(9,32,62,0.3))' }} />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3">
              <p className="font-body leading-relaxed mb-5 slide-left" style={{ fontSize: '1.1rem', color: '#333', fontWeight: 500 }}>
                Soccerex was launched in 1996 by Duncan Revie, son of the legendary former England manager Don Revie. The first football business event of its kind took place at the iconic home of English football, Wembley Stadium.
              </p>
              <p className="font-body leading-relaxed mb-5 slide-left" style={{ fontSize: '1.02rem', color: '#555' }}>
                Since then, we have remained at the top of the table in the football business arena, hosting large scale physical events around the world, providing incomparable networking opportunities, sharing thought leadership and insight, and broadcasting digital events to over 100 countries.
              </p>
              <p className="font-body leading-relaxed slide-left" style={{ fontSize: '1.02rem', color: '#09203e', fontWeight: 600 }}>
                We remain as committed as ever to growing the beautiful game around the globe. Our love of football is at the heart of everything we do.
              </p>
            </div>
            <div className="lg:col-span-2 slide-right">
              <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(9,32,62,0.2)' }}>
                <img src="/images/about/discover-soccerex.jpg" alt="Soccerex event" loading="lazy" style={{ width: '100%', display: 'block', filter: 'saturate(0.9)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(9,32,62,0.1) 0%, transparent 100%)' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave divider: discover → stats */}
      <PixelDivider color="#eae8e4" layers={4} height={90} speed={0.5} />

      {/* ═══ STATS BAR ═════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden flex items-center" style={{ background: '#09203e', padding: 'clamp(80px,10vw,120px) clamp(24px,5vw,80px)' }}>
        <NetworkNodes color="#bfb170" nodeCount={20} opacity={0.1} />
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 w-full" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {[
            { num: '75000+', display: '75,000+', label: 'Attendees', sub: 'Industry professionals across six continents' },
            { num: '57', display: '57', label: 'Events', sub: 'In major football markets worldwide' },
            { num: '24', display: '24', label: 'Cities', sub: 'Global footprint from Miami to Macau' },
            { num: '6', display: '6', label: 'Continents', sub: 'Engaging every major football region' },
          ].map((s) => (
            <div key={s.label} className="text-center scale-up">
              <p className="font-heading font-bold text-gold" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1 }}>
                <AnimatedCounter target={s.display || s.num} />
              </p>
              <p className="font-heading font-bold text-white text-sm uppercase tracking-widest mt-3">{s.label}</p>
              <p className="font-body text-white/40 text-xs mt-1" style={{ lineHeight: 1.4 }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Wave divider: stats → audience reach */}
      <PixelDivider color="#09203e" layers={4} height={90} speed={0.6} />

      {/* ═══ AUDIENCE REACH ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(80px,10vw,120px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(9,32,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="text-center mb-14">
            <p className="section-label mb-4 fade-up" style={{ color: '#09203e', fontWeight: 600 }}>WHO WE REACH</p>
            <h2 className="font-heading font-bold leading-tight mb-6 fade-up" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#09203e' }}>
              Audience{' '}
              <span style={{ color: '#bfb170' }}>Reach</span>
            </h2>
            <div className="fade-up mx-auto" style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, transparent, #09203e, transparent)' }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Global Football Institutional Partners', desc: 'FIFA, LaLiga, CONCACAF, Premier League, Serie A, UEFA, MLS, and National Football Federations (U.S. Soccer, CBF, FA, and more).', icon: Globe },
              { title: 'Industry Operators and Commercial Drivers', desc: 'Clubs across Europe, the Americas, Africa, and Asia. League executives and rightsholders. Major sponsors (Adidas, Puma, Coca-Cola). Broadcasters and media platforms (Sky, ESPN, Globo). Event managers, consultants, and agents.', icon: Users },
              { title: 'Emerging Players and Economy Builders', desc: 'Sports tech startups. Investors and fund managers. Commercial advisors and dealmakers. Digital platforms and fan engagement apps. Academies, grassroots organizers, and NGO programs.', icon: ArrowRight },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="scale-up" style={{ transitionDelay: `${i * 60}ms` }}>
                  <div style={{
                    background: '#fff', padding: '32px 26px', borderRadius: '14px',
                    border: '1px solid rgba(9,32,62,0.06)',
                    boxShadow: '0 8px 28px rgba(9,32,62,0.06)',
                    height: '100%', transition: 'transform 0.3s, box-shadow 0.3s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(9,32,62,0.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(9,32,62,0.06)' }}
                  >
                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'linear-gradient(135deg, #bfb170, #d4c78e)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                      <Icon size={20} color="#09203e" strokeWidth={2} />
                    </div>
                    <h3 className="font-heading font-bold mb-3" style={{ fontSize: '1.05rem', color: '#09203e' }}>{item.title}</h3>
                    <p className="font-body leading-relaxed" style={{ fontSize: '0.9rem', color: '#555' }}>{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <PixelDivider color="#eae8e4" layers={4} height={90} speed={0.5} />

      {/* ═══ TIMELINE ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        {/* Huge "30" watermark */}
        <div className="absolute pointer-events-none select-none" style={{
          right: '-5%', top: '10%', fontFamily: 'Space Grotesk', fontWeight: 800,
          fontSize: 'clamp(20rem, 40vw, 40rem)', lineHeight: 1, color: 'rgba(9,32,62,0.025)',
        }}>30</div>

        <div className="relative z-10" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p className="section-label mb-4 fade-up text-center" style={{ color: '#09203e', fontWeight: 600 }}>OUR HISTORY</p>
          <h2 className="font-heading font-bold leading-tight mb-4 fade-up text-center" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#09203e' }}>
            30 Years of <span style={{ color: '#bfb170' }}>Milestones</span>
          </h2>
          <div className="fade-up mx-auto mb-12" style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, transparent, #09203e, transparent)' }} />

          <div className="relative" style={{ paddingLeft: 'clamp(32px, 5vw, 50px)' }}>
            {/* Vertical timeline line */}
            <div className="absolute top-0 bottom-0" style={{
              left: 'clamp(10px, 2vw, 18px)', width: '2px',
              background: 'linear-gradient(180deg, rgba(9,32,62,0.1) 0%, rgba(191,177,112,0.4) 50%, rgba(9,32,62,0.1) 100%)',
            }} />

            {TIMELINE.map((item, i) => (
              <div key={i} className="relative mb-10 slide-left" style={{ paddingLeft: 'clamp(24px, 4vw, 36px)' }}>
                {/* Dot with ring */}
                <div className="absolute" style={{
                  left: 'clamp(-6px, -0.8vw, -2px)', top: '6px', width: '14px', height: '14px',
                  borderRadius: '50%',
                  background: i === TIMELINE.length - 1 ? '#bfb170' : '#09203e',
                  border: '3px solid #f4f3f0',
                  boxShadow: i === TIMELINE.length - 1
                    ? '0 0 0 4px rgba(191,177,112,0.2), 0 0 20px rgba(191,177,112,0.4)'
                    : '0 0 0 4px rgba(9,32,62,0.08)',
                }} />
                <span className="font-mono text-xs uppercase tracking-widest" style={{ color: '#bfb170', fontWeight: 700 }}>{item.year}</span>
                <h3 className="font-heading font-semibold mt-1 mb-2" style={{ fontSize: '1.15rem', color: '#09203e' }}>{item.title}</h3>
                <p className="font-body leading-relaxed" style={{ fontSize: '0.92rem', color: '#666' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave divider: timeline → pillars */}
      <PixelDivider color="#eae8e4" layers={4} height={90} speed={0.5} />

      {/* ═══ WHAT WE OFFER (4 pillars) ════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(9,32,62,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.025) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p className="section-label mb-4 fade-up text-center" style={{ color: '#09203e', fontWeight: 600 }}>WHAT WE OFFER</p>
          <h2 className="font-heading font-bold leading-tight mb-4 fade-up text-center" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#09203e' }}>
            Four Pillars of the <span style={{ color: '#bfb170' }}>Soccerex Experience</span>
          </h2>
          <div className="fade-up mx-auto mb-14" style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, transparent, #09203e, transparent)' }} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: 'Social and Networking', desc: 'From VIP receptions to Happy Hours, iconic social evenings, and a dedicated Luna Lounge, our social platforms provide the perfect opportunity to connect.' },
              { icon: Mic, title: 'Insight Conference', desc: 'Conference programmes packed with insight sessions delivered by thought leaders, designed to give your business a competitive edge.' },
              { icon: Newspaper, title: 'Market Insight', desc: 'In-depth market insight on the game\'s hottest topics, spotlight interviews with industry figures, and daily football business news.' },
              { icon: Globe, title: 'Social Media', desc: 'Follow the Soccerex social media channels for updates and weekly analysis of the latest football business news.' },
            ].map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <div key={pillar.title} className="scale-up transition-all duration-300" style={{
                  background: '#fff', borderRadius: '14px', padding: '32px 28px',
                  border: '1px solid #e8e5e0', transitionDelay: `${i * 80}ms`,
                  boxShadow: '0 4px 20px rgba(9,32,62,0.04)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(9,32,62,0.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(9,32,62,0.04)' }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ background: 'linear-gradient(135deg, rgba(191,177,112,0.15), rgba(9,32,62,0.1))', border: '1px solid rgba(191,177,112,0.3)' }}>
                    <Icon size={24} style={{ color: '#09203e' }} />
                  </div>
                  <h3 className="font-heading font-semibold mb-3" style={{ color: '#09203e', fontSize: '1.15rem' }}>{pillar.title}</h3>
                  <p className="font-body leading-relaxed" style={{ color: '#666', fontSize: '0.92rem' }}>{pillar.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Wave divider: pillars → ethos */}
      <PixelDivider color="#eae8e4" layers={4} height={90} speed={0.5} />

      {/* ═══ ETHOS QUOTE ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(/images/about/stadium-ball.webp)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'saturate(0.3) brightness(0.25)',
        }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(9,32,62,0.9) 0%, rgba(5,13,26,0.85) 100%)' }} />
        <NetworkNodes color="#bfb170" nodeCount={25} opacity={0.1} />

        <div className="relative z-10 text-center" style={{ maxWidth: '850px', margin: '0 auto' }}>
          {/* Quote marks */}
          <div className="fade-up mb-6" style={{ fontSize: '5rem', color: 'rgba(191,177,112,0.3)', lineHeight: 0.5, fontFamily: 'Space Grotesk', fontWeight: 800 }}>"</div>
          <blockquote className="fade-up">
            <p className="font-heading font-bold text-white leading-snug mb-6 text-glow" style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.5rem)' }}>
              "Take care of the game and the business takes care of itself."
            </p>
            <div style={{ width: '60px', height: '2px', background: 'var(--color-gold)', margin: '0 auto 2rem' }} />
          </blockquote>
          <p className="font-body text-white/70 leading-relaxed fade-up mx-auto mb-4" style={{ fontSize: '1.05rem', maxWidth: '720px' }}>
            It is this ethos, implemented for the first time in 1996 and carried since, that has ensured Soccerex kept its position as the number one global football business event.
          </p>
          <p className="font-body text-white/60 leading-relaxed fade-up mx-auto" style={{ fontSize: '1rem', maxWidth: '720px' }}>
            Now entering our 30th year of operations, we have hosted 57 events in 24 cities around the world, welcoming over 75,000 delegates.
          </p>
        </div>
      </section>

      {/* Wave divider: ethos → ROI */}
      <PixelDivider color="#050d1a" layers={4} height={90} speed={0.5} />

      {/* ═══ ROI / PROVEN RESULTS ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(9,32,62,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.025) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p className="section-label mb-4 fade-up text-center" style={{ color: '#09203e', fontWeight: 600 }}>PROVEN RETURN ON INVESTMENT</p>
          <h2 className="font-heading font-bold leading-tight mb-4 fade-up text-center" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#09203e' }}>
            Deals That Got Done at <span style={{ color: '#bfb170' }}>Soccerex</span>
          </h2>
          <div className="fade-up mx-auto mb-6" style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, transparent, #09203e, transparent)' }} />
          <p className="font-body leading-relaxed mb-14 fade-up text-center mx-auto" style={{ color: '#666', maxWidth: '650px', fontSize: '1.02rem' }}>
            Over 30 years, Soccerex attendees have formed high quality business partnerships. Here are just a few examples.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {ROI_CASES.map((c, i) => (
              <div key={c.name} className="scale-up overflow-hidden transition-all duration-300 cursor-pointer" style={{
                background: '#fff', borderRadius: '12px', border: '1px solid #e8e5e0',
                transitionDelay: `${i * 40}ms`,
                boxShadow: '0 2px 12px rgba(9,32,62,0.04)',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(9,32,62,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(9,32,62,0.04)' }}>
                <div style={{ width: '100%', height: '140px', overflow: 'hidden', position: 'relative' }}>
                  <img src={c.img} alt={c.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
                </div>
                <div style={{ padding: '14px 18px' }}>
                  <p className="font-body font-semibold text-sm leading-tight" style={{ color: '#09203e' }}>{c.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave divider: ROI → CTA */}
      <PixelDivider color="#eae8e4" layers={4} height={90} speed={0.6} />

      {/* ═══ CTA ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #09203e 0%, #0e2a4f 50%, #061729 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)', textAlign: 'center' }}>
        <NetworkNodes color="#bfb170" nodeCount={25} opacity={0.1} />
        <div className="absolute pointer-events-none" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,177,112,0.08) 0%, transparent 60%)' }} />

        <div className="relative z-10" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 className="font-heading font-bold text-white mb-4 fade-up text-glow" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Be Part of What's <span style={{ color: 'var(--color-gold)' }}>Next</span>
          </h2>
          <div className="fade-up mx-auto mb-6" style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }} />
          <p className="font-body text-white/65 mb-10 fade-up leading-relaxed" style={{ fontSize: '1.05rem' }}>
            To enquire about hosting a Soccerex in your city, or to join our next event, get in touch.
          </p>
          <div className="flex flex-wrap justify-center gap-4 fade-up">
            <Link to="/europe-2026" className="inline-flex items-center gap-2 font-body font-semibold text-sm uppercase tracking-widest px-8 py-4 cursor-pointer transition-all duration-300"
              style={{ background: 'var(--color-gold)', color: '#09203e', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#d4c78e'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#bfb170'; e.currentTarget.style.transform = 'translateY(0)' }}>
              Next Event <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 font-body font-semibold text-sm uppercase tracking-widest px-8 py-4 cursor-pointer transition-all duration-300"
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}>
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
