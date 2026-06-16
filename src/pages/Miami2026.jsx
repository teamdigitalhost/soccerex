import { useEffect } from 'react'
import { ArrowLeft, ArrowRight, MapPin, Calendar, Mail, Trophy, Users, Briefcase, Star, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HOME, MIAMI_2026_PRESS_RELEASE } from '../lib/routes'
import InquiryModalButton from '../components/InquiryModalButton'
import { sponsorshipSchema } from '../lib/leadSchemas'

const IMG = '/events/miami/2026'
const GFX = '/events/miami/2026/graphics'
const ICN = '/events/miami/2026/icons'

const ECOSYSTEM_BRAND = [
  { label: 'Clubs', icon: 'clubs' },
  { label: 'Leagues', icon: 'leagues' },
  { label: 'Federations', icon: 'federations' },
  { label: 'Confederations', icon: 'federations' },
  { label: 'Investors', icon: 'investors' },
  { label: 'Governments', icon: 'governments' },
  { label: "Women's Football", icon: 'womens-football' },
  { label: 'Stadiums', icon: 'stadiums' },
  { label: 'Agencies', icon: 'agencies' },
  { label: 'Academies', icon: 'academies' },
  // Impact chip added per GN revisions doc — covers non-profits, foundations,
  // and impact-driven orgs working at the intersection of football + community.
  { label: 'Impact', icon: 'impact' },
]

const PILLARS_BRAND = [
  { label: 'Insight', icon: 'insight' },
  { label: 'Network', icon: 'network' },
  { label: 'Deals', icon: 'deals' },
  { label: 'Growth', icon: 'growth' },
  { label: 'Impact', icon: 'impact' },
]

const WHY_ATTEND = [
  { title: 'The Soccerex Platform in One Market', desc: 'Miami brings the football business ecosystem together at a defining moment, connecting clubs, leagues, federations, rightsholders, brands, investors, technology leaders, innovators, and impact-driven organizations.' },
  { title: 'Where Momentum Becomes Opportunity', desc: 'Set in the wake of the 2026 FIFA World Cup, Soccerex Miami turns global attention into partnerships, investment conversations, commercial growth, innovation, and measurable impact across the Americas.' },
  { title: 'Deal Network Access', desc: 'Through Soccerex Deal Network, attendees gain curated access to qualified counterparties, including decision-makers, capital partners, strategic investors, family offices, funds, sponsors, and commercial partners focused on real outcomes.' },
  { title: 'Capital, Innovation & Impact', desc: 'Soccerex Miami brings capital closer to football, helping fund growth, support women’s football, accelerate innovation, expand commercial opportunity, and create lasting impact across the game.' },
]

const THEMES = [
  { title: 'The Global Football Economy', desc: 'Clubs, leagues, federations, brands, investors, rightsholders, and the business models shaping football’s future.' },
  { title: 'Capital, Investment & Club Ownership', desc: 'Private equity, family offices, funds, strategic investors, M&A, multi-club ownership, and the financial future of football.' },
  { title: 'Soccerex Deal Network', desc: 'Curated introductions, qualified counterparties, strategic partnerships, and commercial opportunities designed to move from access to outcomes.' },
  { title: 'World Cup 2026 & Beyond', desc: 'The commercial, cultural, infrastructure, tourism, and legacy opportunities created by football’s biggest global moment.' },
  { title: 'Media, Content & Digital Revenue', desc: 'Broadcast, streaming, fan engagement, digital platforms, data, content, and new models for monetizing the global game.' },
  { title: 'Stadiums, Venues & Host Cities', desc: 'Venue development, matchday experience, infrastructure, destination strategy, and host city growth.' },
  { title: 'HerSoccerex', desc: 'Women’s football commercialization, investment, leadership, sponsorship, media, and long-term ecosystem growth.' },
  { title: 'Innovation, Impact & Future Growth', desc: 'Technology, startups, brand activation, purpose-driven investment, community impact, and the next wave of football opportunity.' },
]

export default function Miami2026() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="event-page theme-miami" style={{ background: '#FFF8F4' }}>

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="miami-hero relative overflow-hidden">
        {/* Soft retro grid */}
        <div className="absolute inset-0 pointer-events-none miami-hero-grid" />

        {/* Sun behind the skyline */}
        <img src={`${GFX}/sun.svg`} alt="" aria-hidden className="miami-hero-sun" />

        {/* City skyline silhouette across the bottom */}
        <img src={`${GFX}/skyline.png`} alt="" aria-hidden className="miami-hero-skyline" />

        {/* Single palm on the right — left side stays clean so the logo reads */}
        <img src={`${GFX}/tree3.svg`} alt="" aria-hidden className="miami-hero-palm-right" />

        {/* Cyan brush stroke filling the empty top-right corner. Using
            the tapered Asset 44 stroke (soft brushy edges all round) so it
            can simply overflow off-screen at top + right without needing
            a hard clip mask. */}
        <img src={`${GFX}/brush-stroke-cyan.svg`} alt="" aria-hidden className="miami-hero-brush" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-10 items-center" style={{ maxWidth: '1360px', margin: '0 auto', padding: 'clamp(28px,4vw,56px) clamp(24px,5vw,72px) clamp(140px,15vw,220px)' }}>
          {/* Left: brand lockup + meta */}
          <div className="lg:col-span-7">
            <Link to={HOME} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest mb-8" style={{ color: '#0D1B2A', opacity: 0.6, textDecoration: 'none' }}>
              <ArrowLeft size={14} /> Back to Home
            </Link>

            {/* Date strip */}
            <div className="flex items-center gap-4 mb-7" style={{ color: '#0D1B2A' }}>
              <span className="miami-subhead" style={{ fontSize: '12px', letterSpacing: '0.24em', color: '#0D1B2A' }}>23-25 SEPTEMBER 2026</span>
              <span style={{ width: 7, height: 7, background: '#E91E63' }} />
              <span className="miami-subhead" style={{ fontSize: '12px', letterSpacing: '0.24em', color: '#007C91' }}>MIAMI, USA</span>
            </div>

            {/* Primary brand lockup */}
            <img src={`${GFX}/logo-primary.svg`} alt="Soccerex Miami 2026" className="miami-hero-logo" />

            {/* Tagline removed per GN revisions doc. Hero now goes straight
                from the brand lockup into the headline. */}
            <h1 className="miami-headline mt-7 mb-8" style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2rem)', color: '#0D1B2A', lineHeight: 1.15, letterSpacing: '0.01em', maxWidth: '640px' }}>
              The World Comes for the World Cup.<br />
              <span style={{ color: '#E91E63' }}>The Industry Builds at Soccerex.</span>
            </h1>

            <div className="flex items-center gap-6 lg:gap-8 mb-8 flex-wrap">
              <div>
                <p className="miami-subhead mb-1" style={{ color: '#607186', fontSize: '10px' }}><MapPin size={12} className="inline mr-1" /> Venue</p>
                <p className="miami-headline" style={{ color: '#0D1B2A', fontSize: '1.05rem', letterSpacing: '0.04em', textTransform: 'none' }}>Nu Stadium</p>
              </div>
              <div style={{ width: 7, height: 7, background: '#E91E63' }} />
              <div>
                <p className="miami-subhead mb-1" style={{ color: '#607186', fontSize: '10px' }}><Calendar size={12} className="inline mr-1" /> Date</p>
                <p className="miami-headline" style={{ color: '#0D1B2A', fontSize: '1.05rem', letterSpacing: '0.04em' }}>23-25 September 2026</p>
              </div>
            </div>

            <Link
              to={MIAMI_2026_PRESS_RELEASE}
              className="inline-flex items-center gap-2 mb-4"
              style={{ textDecoration: 'none', background: '#0D1B2A', color: '#fff', padding: '14px 26px', fontFamily: "'Oswald', 'Space Grotesk', sans-serif", fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 14 }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#E91E63' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#0D1B2A' }}
            >
              <FileText size={16} /> Read the Announcement <ArrowRight size={16} />
            </Link>

            <div className="flex flex-wrap gap-3 items-center">
              <a
                href="https://soccerexmiami2026.eventify.io/t2/tickets/"
                target="_blank"
                rel="noopener noreferrer"
                className="miami-pill-primary"
              >
                <Mail size={15} /> Register Now
              </a>
              <a
                href="https://soccerexmiami2026.eventify.io/t2/tickets/79DF37"
                target="_blank"
                rel="noopener noreferrer"
                className="miami-pill-outline"
              >
                <Trophy size={15} /> Apply for Rightsholder Pass
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5" style={{ maxWidth: 420 }}>
              <InquiryModalButton
                kind="sponsorship-inquiry"
                label="Sponsor"
                modalTitle="Sponsor Soccerex Miami"
                eyebrow="Sponsorship inquiry"
                intro="Tell us about your brand and what you want to achieve in Miami. We will send the right sponsorship pack."
                schema={sponsorshipSchema}
                extraPayload={{ event_slug: 'soccerex-miami-2026', inquiry_intent: 'sponsor', source: 'miami-hero-sponsor' }}
                submitLabel="Send inquiry"
                successTitle="Inquiry received."
                successBody="A partnerships lead will follow up by email."
                buttonClassName="miami-cta-box"
              />
              <InquiryModalButton
                kind="sponsorship-inquiry"
                label="Exhibit"
                modalTitle="Exhibit at Soccerex Miami"
                eyebrow="Exhibitor inquiry"
                intro="Tell us about your stand needs and product mix. We will send the exhibitor pack and floor plan."
                schema={sponsorshipSchema}
                extraPayload={{ event_slug: 'soccerex-miami-2026', inquiry_intent: 'exhibit', source: 'miami-hero-exhibit' }}
                submitLabel="Send inquiry"
                successTitle="Inquiry received."
                successBody="An exhibitor lead will follow up by email."
                buttonClassName="miami-cta-box"
              />
              {/* Speaker CTA removed per GN revisions doc — Miami hero now
                  surfaces Sponsor + Exhibit only. */}
            </div>
          </div>

          {/* Right: anniversary + speaker card */}
          <div className="lg:col-span-5 lg:pl-4">
            {/* 30 YEARS anniversary block */}
            <div className="miami-anniv mb-6">
              <div className="flex items-end gap-4">
                <span className="miami-headline" style={{ fontSize: 'clamp(72px, 8vw, 110px)', lineHeight: 0.85, color: '#E91E63' }}>30</span>
                <div style={{ marginBottom: 10 }}>
                  <p className="miami-subhead" style={{ color: '#0D1B2A', fontSize: '12px', letterSpacing: '0.22em', lineHeight: 1.3 }}>YEARS</p>
                  <p className="miami-subhead" style={{ color: '#0D1B2A', fontSize: '12px', letterSpacing: '0.22em', lineHeight: 1.3 }}>OF BUILDING</p>
                  <p className="miami-subhead" style={{ color: '#0D1B2A', fontSize: '12px', letterSpacing: '0.22em', lineHeight: 1.3 }}>THE GLOBAL GAME</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4" style={{ color: '#0D1B2A' }}>
                <span className="miami-subhead" style={{ fontSize: '11px', color: '#607186' }}>1996</span>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#007C91', flexShrink: 0 }} />
                <span style={{ flex: 1, height: 2, background: 'linear-gradient(90deg, #007C91, #E91E63)' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E91E63', flexShrink: 0 }} />
                <span className="miami-subhead" style={{ fontSize: '11px', color: '#E91E63' }}>2026</span>
              </div>
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { num: '3', label: 'Days' },
                { num: '100+', label: 'Speakers' },
                { num: '50+', label: 'Countries' },
              ].map((s) => (
                <div key={s.label} className="text-center px-3 py-4" style={{ background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.08)', boxShadow: '0 4px 14px -8px rgba(13,27,42,0.18)' }}>
                  <p className="miami-headline" style={{ fontSize: '1.4rem', color: '#0D1B2A', lineHeight: 1 }}>{s.num}</p>
                  <p className="miami-subhead mt-1" style={{ fontSize: '10px', color: '#607186', letterSpacing: '0.18em' }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Pillars strip — uses real brand icons */}
            <div className="miami-pillar-strip mt-5">
              {PILLARS_BRAND.map((p) => (
                <div key={p.label} className="miami-pillar-mini">
                  <img src={`${ICN}/${p.icon}.svg`} alt="" aria-hidden />
                  <span className="miami-subhead">{p.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHAT IS SOCCEREX MIAMI ─────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#FFFFFF', padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)' }}>
        {/* Faded Miami script watermark behind the section */}
        <div className="miami-script-watermark" style={{ top: '8%', right: '-6%', width: 'min(120%, 1400px)', height: '60%' }} />
        <div className="relative" style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start mb-16">
            <div className="relative">
              <img src={`${IMG}/sections/nu-stadium-exterior.jpg`} alt="NU Stadium at Miami Freedom Park, future home of Inter Miami CF" style={{ width: '100%', objectFit: 'cover', aspectRatio: '16/10', boxShadow: '0 24px 60px -28px rgba(13,27,42,0.45)' }} />
              <div className="absolute" style={{ left: -14, top: -14, width: 64, height: 64, background: 'var(--miami-sunset)', zIndex: -1, opacity: 0.9 }} />
              <div className="absolute" style={{ right: -14, bottom: -14, width: 96, height: 96, border: '2px solid #007C91', zIndex: -1 }} />
            </div>
            <div>
              <h2 className="miami-headline mb-5" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#0D1B2A' }}>
                WHAT IS <span style={{ color: '#E91E63' }}>SOCCEREX MIAMI?</span>
              </h2>
              <p className="miami-body leading-relaxed mb-4" style={{ fontSize: '1.05rem', color: '#1a2a3a' }}>
                Soccerex Miami is the Americas anchor event of the Soccerex platform, bringing together clubs, leagues, federations, investors, brands, rightsholders, solution providers, innovators, and financial leaders at a defining moment for the global game.
              </p>
              <p className="miami-body leading-relaxed mb-4" style={{ fontSize: '1.05rem', color: '#1a2a3a' }}>
                Set in the wake of the 2026 FIFA World Cup, Soccerex Miami creates the environment where access turns into partnerships, investment, innovation, impact, and commercial opportunity. Through world-class content, curated executive networking, brand activation, market insight, and Soccerex Deal Network, Miami connects the football business ecosystem with the people and capital shaping what comes next.
              </p>
              <p className="miami-body leading-relaxed" style={{ fontSize: '1.05rem', color: '#1a2a3a' }}>
                This is where football’s next chapter in the Americas is built, funded, and accelerated.
              </p>
            </div>
          </div>

          <h3 className="miami-headline mb-3" style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', color: '#0D1B2A' }}>Three Days Where Football Business Moves Forward</h3>
          <p className="miami-body leading-relaxed mb-6" style={{ fontSize: '1rem', color: '#3a4a5a', maxWidth: 760 }}>
            Soccerex Miami brings the global football ecosystem together around the conversations, capital, partnerships, and opportunities shaping the next decade of the game.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {THEMES.map((theme) => (
              <div key={theme.title} className="flex items-start gap-4 px-5 py-4" style={{ background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.08)' }}>
                <div style={{ width: 8, height: 8, background: 'var(--miami-sunset)', flexShrink: 0 }} />
                <div>
                  <h4 className="miami-subhead mb-1" style={{ color: '#0D1B2A', fontSize: '0.82rem', letterSpacing: '0.09em' }}>{theme.title}</h4>
                  <p className="miami-body" style={{ fontSize: '0.9rem', color: '#3a4a5a', lineHeight: 1.45 }}>{theme.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand divider */}
      <hr className="miami-divider" aria-hidden style={{ margin: '0 auto' }} />

      {/* ─── ECOSYSTEM (crisp white) ────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#FAFBFC', padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div className="text-center mb-12 flex flex-col items-center">
            <p className="miami-kicker">BUILT FOR THE FOOTBALL BUSINESS ECOSYSTEM</p>
            <h2 className="miami-headline" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#0D1B2A' }}>
              The <span className="miami-text-gradient">Soccerex Ecosystem</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {ECOSYSTEM_BRAND.map(({ label, icon }) => (
              <div key={label} className="miami-cell-light">
                <img src={`${ICN}/${icon}.svg`} alt="" aria-hidden style={{ width: 40, height: 40, margin: '0 auto 12px', display: 'block' }} />
                <p className="miami-subhead" style={{ color: '#0D1B2A', fontSize: '11px' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand divider */}
      <hr className="miami-divider" aria-hidden style={{ margin: '0 auto' }} />

      {/* ─── WHY ATTEND (white) ──────────────────────────────────────────── */}
      <section style={{ background: '#FFFFFF', padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <p className="miami-kicker miami-kicker--pink">BUILT FOR THE FOOTBALL BUSINESS ECOSYSTEM</p>
          <h2 className="miami-headline mb-10" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#0D1B2A' }}>Why Attend Soccerex Miami?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WHY_ATTEND.map((item, i) => {
              const Icons = [Users, Trophy, Briefcase, Star]
              const Icon = Icons[i]
              return (
                <div key={item.title} className="miami-card-light">
                  <div style={{ width: 44, height: 44, background: 'rgba(0,124,145,0.08)', border: '1px solid rgba(0,124,145,0.2)', display: 'grid', placeItems: 'center', marginBottom: 16 }}>
                    <Icon size={22} style={{ color: '#007C91' }} />
                  </div>
                  <h3 className="miami-subhead mb-3" style={{ fontSize: '1rem', color: '#0D1B2A', letterSpacing: '0.1em' }}>{item.title}</h3>
                  <p className="miami-body leading-relaxed" style={{ fontSize: '0.95rem', color: '#3a4a5a' }}>{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── TAGLINE STRIP (sunset, the one vibrant moment) ─────────────── */}
      <section className="relative overflow-hidden" style={{ background: 'var(--miami-sunset)', padding: 'clamp(70px,9vw,120px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }} />
        <div className="relative z-10 text-center" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 className="miami-headline" style={{ fontSize: 'clamp(1.6rem, 3.6vw, 2.8rem)', color: '#fff', textShadow: '0 4px 24px rgba(13,27,42,0.4)', lineHeight: 1.15 }}>
            From Conventions, to Platforms.<br />
            From Conversations, to <span style={{ color: '#0D1B2A' }}>Outcomes</span>.
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 mt-10">
            {PILLARS_BRAND.map(({ label, icon }) => (
              <div key={label} className="miami-pillar">
                <img src={`${ICN}/${icon}.svg`} alt="" aria-hidden
                  style={{ width: 48, height: 48, filter: 'brightness(0) invert(1)' }} />
                <span className="miami-subhead" style={{ color: '#fff', fontSize: '12px', letterSpacing: '0.18em' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REGISTRATION + PARTNERSHIP + RIGHTS HOLDERS ──────────────── */}
      <section id="tickets" className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0D1B2A 0%, #102538 100%)', padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 miami-grid" style={{ opacity: 0.3 }} />
        <div className="relative z-10" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="flex justify-center mb-3">
            <span className="event-badge"><span className="event-badge-dot" /> Registration now open</span>
          </div>
          <h2 className="miami-headline text-center text-white mb-3" style={{ fontSize: 'clamp(1.8rem, 3.6vw, 2.6rem)' }}>
            Secure Your Place at <span className="miami-text-gradient">Soccerex Miami</span>
          </h2>
          <p className="miami-body text-center text-white/70 mx-auto mb-10" style={{ maxWidth: '640px' }}>
            Join the Americas anchor point of the Soccerex platform, where football’s leaders, rightsholders, capital, brands, innovators, and strategic partners come together to turn access into opportunity.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--event-primary-border)', padding: 'clamp(24px, 3vw, 36px)' }}>
              <h3 className="miami-subhead text-white mb-2 flex items-center gap-2" style={{ fontSize: '1.05rem', letterSpacing: '0.1em' }}>
                <Mail size={18} style={{ color: 'var(--event-primary-light)' }} /> Delegate Registration
              </h3>
              <p className="miami-body text-white/65 text-sm mb-6">
                For brands, agencies, investors, technology providers, service providers, commercial partners, and football business professionals looking to access the Soccerex Miami platform.
              </p>
              <a
                href="https://soccerexmiami2026.eventify.io/t2/tickets/"
                target="_blank"
                rel="noopener noreferrer"
                className="miami-pill-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Register Now <ArrowLeft size={15} style={{ transform: 'rotate(180deg)' }} />
              </a>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--event-primary-border)', padding: 'clamp(24px, 3vw, 36px)' }}>
              <h3 className="miami-subhead text-white mb-2 flex items-center gap-2" style={{ fontSize: '1.05rem', letterSpacing: '0.1em' }}>
                <Briefcase size={18} style={{ color: 'var(--event-primary-light)' }} /> Sponsorship & Partnership Opportunities
              </h3>
              <p className="miami-body text-white/65 text-sm mb-6">
                For brands, sponsors, agencies, investors, and strategic partners seeking visibility, executive access, activation opportunities, and year-round platform integration across Soccerex Miami.
              </p>
              <InquiryModalButton
                kind="sponsorship-inquiry"
                label="Explore Partnership Opportunities"
                modalTitle="Partner with Soccerex Miami"
                eyebrow="Sponsorship & partnership"
                intro="Tell us a little about your organisation and what you'd like to achieve. We'll send the right partnership pack."
                schema={sponsorshipSchema}
                extraPayload={{ event_slug: 'soccerex-miami-2026', source: 'miami-registration-partnership' }}
                submitLabel="Send inquiry"
                successTitle="Inquiry received."
                successBody="A partnerships lead will follow up by email."
                buttonClassName="miami-pill-primary"
                buttonStyle={{ width: '100%', justifyContent: 'center' }}
              />
            </div>

            <div style={{ background: 'linear-gradient(145deg, var(--event-primary-bg), rgba(255,255,255,0.02))', border: '1px solid var(--event-primary-border)', padding: 'clamp(24px, 3vw, 36px)' }}>
              <h3 className="miami-subhead text-white mb-2 flex items-center gap-2" style={{ fontSize: '1.05rem', letterSpacing: '0.1em' }}>
                <Trophy size={18} style={{ color: 'var(--event-primary-light)' }} /> Rightsholder Access
              </h3>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4" style={{ background: 'var(--event-primary)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Complimentary pass
              </div>
              <p className="miami-body text-white/75 text-sm mb-5 leading-relaxed">
                Clubs, leagues, federations, national teams, competitions, and qualifying rightsholders may apply for a complimentary delegate pass.
              </p>
              <a
                href="https://soccerexmiami2026.eventify.io/t2/tickets/79DF37"
                target="_blank"
                rel="noopener noreferrer"
                className="miami-pill-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Apply for Rightsholder Pass <ArrowLeft size={15} style={{ transform: 'rotate(180deg)' }} />
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
