import { useEffect, useState } from 'react'
import { Users, MessageSquare, Globe, KeyRound, MapPin, Mail, ArrowRight, Calendar, Ticket, FileText, ExternalLink, Handshake, Heart, Rocket, Shield, Network, Brain, Target, Award } from 'lucide-react'
import { feature } from 'topojson-client'
import { Link, useLocation } from 'react-router-dom'
import NetworkNodes from '../animations/NetworkNodes'
import TopoDivider from '../components/TopoDivider'
import PixelDivider from '../components/PixelDivider'
import HeroSlideshow from '../components/HeroSlideshow'
import { EVENTS, CONTACT, EUROPE_2026, MIAMI_2026, MIAMI_2026_PRESS_RELEASE, GALLERY, eventSpeakers, pressRelease, PAST_SPEAKERS } from '../lib/routes'
import { FEATURED_SPEAKERS as HOME_SPEAKERS } from '../data/speakers'
import ImageGrid from '../components/ImageGrid'
import { useScrollAnimations } from '../lib/useScrollAnimations'
import { lazy, Suspense } from 'react'
const InteractiveGlobe = lazy(() => import('../components/InteractiveGlobe'))

const NU_STADIUM_IMAGE = '/events/miami/2026/sections/nu-stadium-miami-freedom-park.jpg'

// ─── SECTION 1: HERO ─────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative overflow-hidden flex items-center justify-center" style={{
      minHeight: '100dvh',
      background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF8F4 60%, #FFF1EB 100%)',
    }}>
      {/* Soft retro grid — barely there for crispness */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(13,27,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(13,27,42,0.04) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
        maskImage: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.2) 100%)',
        WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.2) 100%)',
      }} />
      {/* Soft gold radial wash, top-center */}
      <div className="absolute pointer-events-none" style={{
        top: '10%', left: '50%', transform: 'translateX(-50%)',
        width: '900px', height: '900px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(191,177,112,0.18) 0%, rgba(191,177,112,0.08) 35%, transparent 65%)',
      }} />
      {/* Faint network nodes in navy so it reads on the white field */}
      <NetworkNodes color="#0D1B2A" accentColor="var(--color-brand-accent)" nodeCount={28} opacity={0.08} />

      <div className="relative z-10 text-center" style={{ maxWidth: '900px', padding: 'clamp(120px,15vw,180px) clamp(24px,5vw,80px) clamp(80px,10vw,120px)' }}>
        {/* Anniversary kicker — squared filled marker echoes the Miami brand bar */}
        <div className="flex items-center justify-center gap-3 mb-6 fade-up">
          <span style={{ width: 7, height: 7, background: 'var(--color-brand-accent)' }} />
          <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.28em', color: '#0D1B2A' }}>
            Soccerex · Est. 1996 · 30 years
          </p>
          <span style={{ width: 7, height: 7, background: 'var(--color-brand-accent)' }} />
        </div>
        <h1 className="font-heading font-bold leading-[1.06] mb-6 fade-up" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.4rem)', color: '#0D1B2A' }}>
          <span style={{ color: 'var(--color-brand-accent)' }}>30 Years</span> at the Center of the<br className="hidden sm:block" /> Business of Football
        </h1>
        <p className="font-body leading-relaxed mb-4 fade-up mx-auto" style={{ fontSize: 'clamp(1rem, 1.6vw, 1.18rem)', color: '#1a2a3a', maxWidth: '720px' }}>
          For three decades, Soccerex has brought together the people shaping the global game — clubs and leagues, investors, brands and innovators.
        </p>
        <p className="font-body leading-relaxed mb-10 fade-up mx-auto" style={{ fontSize: 'clamp(0.92rem, 1.4vw, 1.02rem)', color: '#3a4a5a', maxWidth: '680px' }}>
          What started as an event has become a global meeting point for the football industry, where relationships are built, ideas are tested, and opportunities take shape.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 fade-up">
          <Link to={EVENTS}
            className="inline-flex items-center gap-2 font-body font-semibold text-sm uppercase tracking-[0.15em] px-8 py-4 transition-all duration-300 cursor-pointer border-none"
            style={{ background: 'var(--color-brand-accent)', color: '#fff', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.background = '#d4c78e'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--color-brand-accent)'}>
            Explore Events
            <ArrowRight size={16} />
          </Link>
          <Link to={CONTACT}
            className="inline-flex items-center gap-2 font-body font-semibold text-sm uppercase tracking-[0.15em] px-8 py-4 transition-all duration-300 cursor-pointer"
            style={{ background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.20)', color: '#0D1B2A', textDecoration: 'none' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-brand-accent)'; e.currentTarget.style.color = 'var(--color-brand-accent)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(13,27,42,0.20)'; e.currentTarget.style.color = '#0D1B2A' }}>
            Join Soccerex
          </Link>
        </div>
      </div>

      {/* Soft fade to next section so the hand-off doesn't read as a hard cut */}
      <div className="absolute pointer-events-none" style={{
        bottom: 0, left: 0, right: 0, height: 140,
        background: 'linear-gradient(to bottom, transparent, #FFFFFF)',
      }} />
    </section>
  )
}

// ─── UPCOMING EVENT: SOCCEREX MIAMI 2026 ────────────────────────────────────
/* Forward-facing feature for the next event. Mirrors the Miami event page's
   white-crisp aesthetic but stays compact for the homepage. The Amsterdam
   recap (past tense) now lives in its own slim band lower on the page. */
function UpcomingEventSection() {
  // Internal naming note: what we surface to the public as "Program Themes" is
  // referred to internally and in routes/services as the "Agenda Concept"
  // (see src/lib/routes.js -> eventAgendaConcept). The public-facing button
  // for it was removed at Soccerex's request; the page itself still exists
  // and is linked from the event-page tabs and from the Europe2026 callout.
  const eventLinks = [
    { label: 'Register Now',         href: 'https://soccerexmiami2026.eventify.io/t2/tickets/', external: true, primary: true, icon: Mail },
    { label: 'Event Info',           to: MIAMI_2026,                                                 icon: Globe },
  ]

  return (
    <section className="relative overflow-hidden" style={{
      /* Starts at the hero's cream dissolve colour so there's no seam
         between the slideshow and this section, then transitions to a
         purer white as you scroll into the content. */
      background: 'linear-gradient(180deg, #FFF8F4 0%, #FFFAF6 35%, #FFFFFF 100%)',
    }}>
      {/* Faint retro grid + Miami-pink/aqua corner washes for warmth without dominating */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(13,27,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(13,27,42,0.04) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
        maskImage: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)',
        WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)',
      }} />
      <div className="absolute pointer-events-none" style={{
        top: '-220px', right: '-220px', width: '700px', height: '700px',
        background: 'radial-gradient(circle, rgba(233,30,99,0.10) 0%, rgba(233,30,99,0.04) 45%, transparent 70%)',
      }} />
      <div className="absolute pointer-events-none" style={{
        bottom: '-200px', left: '-200px', width: '620px', height: '620px',
        background: 'radial-gradient(circle, rgba(0,198,215,0.10) 0%, rgba(0,124,145,0.04) 50%, transparent 72%)',
      }} />

      <div className="relative z-10" style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(80px,10vw,120px) clamp(24px,5vw,80px)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: headline + meta + CTAs */}
          <div className="lg:col-span-7 fade-up">
            <div className="flex items-center gap-3 mb-5">
              <span style={{ width: 7, height: 7, background: '#E91E63' }} />
              <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.24em', color: '#0D1B2A' }}>
                Next event · 23–25 September 2026
              </p>
            </div>
            <h2 className="font-heading font-bold leading-[1.05] mb-5" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', color: '#0D1B2A' }}>
              The World Comes for the World Cup.<br />
              <span style={{ color: '#E91E63' }}>The Industry Builds at Soccerex.</span>
            </h2>
            <p className="font-body leading-relaxed mb-4" style={{ fontSize: '1.05rem', color: '#1a2a3a', maxWidth: '560px' }}>
              Miami 2026 places Soccerex at the center of football&#x2019;s biggest global moment, bringing leaders, capital, brands, innovators, and rightsholders together to shape what comes next.
            </p>
            <p className="font-body leading-relaxed mb-7" style={{ fontSize: '1.05rem', color: '#1a2a3a', maxWidth: '560px' }}>
              Across investment, sponsorship, technology, women&#x2019;s football, media, development, and impact, Soccerex Miami turns global attention into commercial opportunity.
            </p>
            <div className="flex flex-wrap gap-3">
              {eventLinks.map((link) => {
                const Icon = link.icon
                const Tag = link.external ? 'a' : Link
                const props = link.external ? { href: link.href, target: '_blank', rel: 'noopener noreferrer' } : { to: link.to }
                return (
                  <Tag key={link.label} {...props}
                    className="inline-flex items-center gap-2 font-body font-semibold text-sm uppercase tracking-[0.15em] px-7 py-3.5 transition-all duration-200 cursor-pointer"
                    style={{
                      textDecoration: 'none',
                      background: link.primary ? '#E91E63' : '#FFFFFF',
                      color: link.primary ? '#FFFFFF' : '#0D1B2A',
                      border: link.primary ? '1px solid #E91E63' : '1px solid rgba(13,27,42,0.18)',
                    }}
                    onMouseEnter={(e) => {
                      if (link.primary) {
                        e.currentTarget.style.background = '#c81b58'
                        e.currentTarget.style.borderColor = '#c81b58'
                      } else {
                        e.currentTarget.style.borderColor = '#E91E63'
                        e.currentTarget.style.color = '#E91E63'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (link.primary) {
                        e.currentTarget.style.background = '#E91E63'
                        e.currentTarget.style.borderColor = '#E91E63'
                      } else {
                        e.currentTarget.style.borderColor = 'rgba(13,27,42,0.18)'
                        e.currentTarget.style.color = '#0D1B2A'
                      }
                    }}
                  >
                    <Icon size={15} /> {link.label}
                  </Tag>
                )
              })}
            </div>
            {/* Prominent press-release callout */}
            <Link
              to={MIAMI_2026_PRESS_RELEASE}
              className="inline-flex items-center gap-2 font-body font-semibold text-sm uppercase tracking-[0.15em] px-7 py-3.5 mt-3 transition-all duration-200"
              style={{ textDecoration: 'none', background: '#0D1B2A', color: '#FFFFFF', border: '1px solid #0D1B2A' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#E91E63'; e.currentTarget.style.borderColor = '#E91E63' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#0D1B2A'; e.currentTarget.style.borderColor = '#0D1B2A' }}
            >
              <FileText size={15} /> Read the Announcement <ArrowRight size={15} />
            </Link>
          </div>

          {/* Right: brand-asset card with logo lockup + dates */}
          <div className="lg:col-span-5 fade-up">
            <div style={{
              position: 'relative',
              background: '#FFFFFF',
              border: '1px solid rgba(13,27,42,0.08)',
              padding: 'clamp(28px, 3.5vw, 44px)',
              boxShadow: '0 30px 70px -34px rgba(13,27,42,0.30)',
            }}>
              {/* Pink + cyan top stripe echoes the Miami brand bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #007C91 0%, #00C6D7 35%, #E91E63 100%)' }} />
              <img src="/events/miami/2026/graphics/logo-primary.svg" alt="Soccerex Miami 2026"
                style={{ display: 'block', width: 'clamp(220px, 26vw, 320px)', maxWidth: '100%', height: 'auto', margin: '4px 0 22px' }} />
              <div className="flex items-baseline gap-3 mb-3">
                <span className="font-heading font-bold" style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', color: '#E91E63', lineHeight: 1 }}>23–25</span>
                <span className="font-mono uppercase" style={{ fontSize: 12, letterSpacing: '0.22em', color: '#0D1B2A' }}>September 2026</span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <MapPin size={16} style={{ color: '#007C91' }} />
                <div>
                  <p className="font-heading font-semibold" style={{ fontSize: 15, color: '#0D1B2A' }}>Nu Stadium</p>
                  <p className="font-body" style={{ fontSize: 12.5, color: '#607186' }}>Miami, USA</p>
                </div>
              </div>
              {/* Anniversary line — keeps the 30-years thread visible */}
              <div className="flex items-center gap-3 mt-6 pt-5" style={{ borderTop: '1px solid rgba(13,27,42,0.08)' }}>
                <span className="font-heading font-bold" style={{ fontSize: 28, color: '#E91E63', lineHeight: 1 }}>30</span>
                <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.22em', color: '#0D1B2A', lineHeight: 1.4 }}>
                  Years of<br />building the<br />global game
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── BY THE NUMBERS (WFS-style stat tiles with background imagery) ──────────
// Heading uses the canonical stats line "57 Events. 21 Cities. 30 Years.";
// the platform framing carries in the paragraph below it.
function ByTheNumbersSection() {
  const stats = [
    { num: '30',   label: 'Years',     bg: '/hero/04-TIER1-bobby-charlton-handprints.jpg' },
    { num: '57',   label: 'Events',    bg: '/hero/15-TIER2-asian-forum-panel.jpg' },
    { num: '75K+', label: 'Delegates', bg: '/hero/22-NEW-soccerex-brasil-auditorium.jpg' },
    { num: '5K+',  label: 'Brands',    bg: '/hero/09-TIER1-jenny-chiu-diverse-panel.jpg' },
  ]

  return (
    <section className="relative overflow-hidden" style={{ background: '#FFFFFF', padding: 'clamp(80px,10vw,130px) clamp(24px,5vw,80px) clamp(28px,3.5vw,44px)' }}>
      <NetworkNodes color="#0D1B2A" accentColor="var(--color-brand-accent)" nodeCount={20} opacity={0.06} />
      <div className="relative z-10" style={{ maxWidth: '1300px', margin: '0 auto' }}>
        <div className="mb-14">
          <p className="section-label mb-4 fade-up" style={{ color: 'var(--color-brand-accent)', fontWeight: 600 }}>SOCCEREX BY THE NUMBERS</p>
          <h2 className="font-heading font-bold leading-tight fade-up" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', color: '#0D1B2A' }}>
            30 Years. 57 Events. <span style={{ color: 'var(--color-brand-accent)' }}>One Global Football Business Platform.</span>
          </h2>
          <p className="font-body fade-up mt-4" style={{ fontSize: '1.05rem', color: '#3a4a5a', maxWidth: '720px' }}>
            Since 1996, Soccerex has brought football&#x2019;s leaders together across the world&#x2019;s most important markets. That history now powers a year-round platform built to turn access into partnerships, investment, innovation, impact, and commercial opportunity.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={s.label} className="relative overflow-hidden fade-up"
              style={{
                aspectRatio: '4/5',
                borderRadius: '12px',
                border: '1px solid rgba(13,27,42,0.08)',
                boxShadow: '0 12px 32px -16px rgba(13,27,42,0.18)',
                transitionDelay: `${i * 40}ms`,
              }}
            >
              {/* Background image — light treatment: bright + slightly
                  desaturated so the photo reads as airy texture under
                  the cream wash above. */}
              <img src={s.bg} alt=""
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover', filter: 'saturate(0.75) brightness(1.05) contrast(0.92)',
                }}
              />
              {/* Cream wash overlay — lighter at top, fuller at the bottom
                  where the number + label sit so they always have a
                  legible backdrop regardless of which photo is behind. */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(255,250,245,0.55) 0%, rgba(255,250,245,0.78) 55%, rgba(255,250,245,0.96) 100%)' }} />
              {/* Content: number stacked above label, left-aligned, roomy padding */}
              <div style={{
                position: 'relative',
                padding: 'clamp(20px, 2.2vw, 32px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                height: '100%',
                gap: '10px',
              }}>
                <span className="font-heading font-bold" style={{
                  color: 'var(--color-brand-accent)',
                  fontSize: 'clamp(3rem, 5.5vw, 4.25rem)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.03em',
                  textShadow: '0 1px 0 rgba(255,250,245,0.6), 0 2px 14px rgba(255,250,245,0.45)',
                }}>
                  {s.num}
                </span>
                <span className="font-heading uppercase tracking-widest" style={{
                  color: '#0D1B2A',
                  fontSize: 'clamp(0.85rem, 1vw, 1rem)',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textShadow: '0 1px 0 rgba(255,250,245,0.5)',
                }}>
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* Standard platform tagline, GN revisions doc. */}
        <p className="font-mono uppercase fade-up mt-10 text-center" style={{ fontSize: 'clamp(0.78rem, 1vw, 0.88rem)', letterSpacing: '0.18em', color: '#0D1B2A' }}>
          One Global Football Business Platform
        </p>
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
          <p className="section-label mb-4 fade-up" style={{ color: '#09203e', fontWeight: 600 }}>01 &middot; THE PLATFORM</p>
          <h2 className="font-heading font-bold leading-tight mb-6 fade-up" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#09203e' }}>
            The Meeting Point for Global Football Business
          </h2>
          <div className="fade-up" style={{ width: '60px', height: '3px', background: 'linear-gradient(90deg, #09203e, rgba(9,32,62,0.3))' }} />

          <div className="fade-up" style={{ marginTop: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
            <Globe size={48} style={{ color: 'rgba(9,32,62,0.15)' }} />
          </div>
        </div>
        <div>
          <p className="font-body leading-relaxed mb-4 fade-up" style={{ fontSize: '1.05rem', color: '#333' }}>
            Soccerex connects the people who drive the game forward.
          </p>
          <p className="font-body leading-relaxed mb-6 fade-up" style={{ fontSize: '0.95rem', color: '#666' }}>
            Across every event, we bring together:
          </p>
          <div className="space-y-4 mb-8">
            {bullets.map((item, i) => (
              <div key={i} className="flex items-center gap-4 fade-up">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(9,32,62,0.08)', border: '1px solid rgba(9,32,62,0.12)' }}>
                  <item.icon size={18} style={{ color: '#09203e' }} />
                </div>
                <p className="font-body" style={{ fontSize: '0.95rem', color: '#222' }}>{item.text}</p>
              </div>
            ))}
          </div>
          <p className="font-body leading-relaxed fade-up" style={{ fontSize: '0.95rem', color: '#555' }}>
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
          <p className="section-label text-brand-accent mb-4 fade-up">02 &middot; WHAT WE DO</p>
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
              <div className="w-1 h-8 mb-4 rounded-full" style={{ background: 'linear-gradient(to bottom, var(--color-brand-accent), rgba(191,177,112,0.2))' }} />
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
    {
      city: 'AMSTERDAM',
      name: 'Soccerex Europe',
      dates: '12-13 May 2026',
      venue: 'Johan Cruijff ArenA',
      img: '/events/europe/2026/sections/arena-interior.webp',
      crest: '/brand/crests/crest-europe-white.svg',
      learnMoreTo: '/europe-2026',
      status: 'past',
      pastLabel: 'Thank you!',
      accent: '#c8302c',
      ctaTextColor: '#fff',
    },
    {
      city: 'MIAMI',
      name: 'Soccerex Miami',
      dates: '23-25 September 2026',
      venue: 'Nu Stadium',
      img: NU_STADIUM_IMAGE,
      crest: '/brand/crests/crest-miami-white.svg',
      learnMoreTo: '/miami-2026',
      ctaLabel: 'Register Now',
      ctaHref: 'https://soccerexmiami2026.eventify.io/t2/tickets/',
      ctaExternal: true,
      status: 'soon',
      accent: '#E91E63',
      ctaTextColor: '#fff',
    },
    {
      city: 'RIYADH',
      name: 'Soccerex Middle East',
      dates: 'To Be Announced',
      venue: '',
      img: '/events/middle-east/2026/sections/riyadh-skyline.jpg',
      crest: '/brand/crests/crest-riyadh-white.svg',
      learnMoreTo: null,
      status: 'soon',
      accent: '#0f8f52',
      ctaTextColor: '#fff',
    },
  ]

  return (
    <section id="events" className="relative overflow-hidden" style={{ background: '#FFFFFF' }}>
      <div className="relative z-10" style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="mb-14">
          <p className="section-label mb-4 fade-up" style={{ color: 'var(--color-brand-accent)', fontWeight: 600 }}>THE SOCCEREX GLOBAL CALENDAR</p>
          <h2 className="font-heading font-bold leading-tight fade-up" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', color: '#0D1B2A' }}>
            Three Anchor Events. <span style={{ color: 'var(--color-brand-accent)' }}>One Year-Round Platform.</span>
          </h2>
          <p className="font-body fade-up mt-4" style={{ fontSize: '1.05rem', color: '#3a4a5a', maxWidth: '720px' }}>
            Miami anchors the Americas. Riyadh connects the Middle East. Amsterdam serves as a European gateway. Each Soccerex edition brings the football business ecosystem into a strategic market and feeds a wider platform built around dealmaking, investment, partnerships, innovation, women&#x2019;s football, impact, and commercial opportunity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {events.map((event) => {
            const isMiami = event.city === 'MIAMI'
            const isRiyadh = event.city === 'RIYADH'
            const isPast = event.status === 'past'
            const cityColor = event.accent
            const accentStripe = isMiami
              ? 'linear-gradient(90deg, #007C91 0%, #E91E63 50%, #FFB46A 100%)'
              : isPast
                ? 'rgba(255,255,255,0.35)'
                : event.accent
            const overlayGradient = isMiami
              ? 'linear-gradient(180deg, rgba(13,27,42,0.45) 0%, rgba(13,27,42,0.30) 28%, rgba(233,30,99,0.30) 60%, rgba(13,27,42,0.97) 100%)'
              : isPast
                ? 'linear-gradient(180deg, rgba(5,13,26,0.55) 0%, rgba(5,13,26,0.65) 40%, rgba(5,13,26,0.95) 100%)'
                : 'linear-gradient(180deg, rgba(5,13,26,0.2) 0%, rgba(5,13,26,0.5) 50%, rgba(5,13,26,0.95) 100%)'
            const imageFilter = isMiami
              ? 'saturate(1.15) brightness(0.72) hue-rotate(-6deg)'
              : isPast
                ? 'grayscale(0.55) brightness(0.7) contrast(1.05)'
                : 'saturate(1.1) brightness(0.85)'
            /* Photoshop-style stacked outer glow behind each card. The
               cards sit on a white section, so without a glow they
               read as noisy color blocks. Stack a tight drop-shadow
               for grounding + two wider tinted halos for brand lift.
               Miami leans pink (matches its accent), Riyadh leans
               warm gold, Amsterdam stays neutral cool to read as a
               recap. */
            const cardGlow = isMiami
              ? '0 32px 72px -20px rgba(13,27,42,0.32), 0 0 48px rgba(233,30,99,0.42), 0 0 120px rgba(255,180,106,0.30)'
              : isRiyadh
                ? '0 32px 72px -20px rgba(13,27,42,0.30), 0 0 48px rgba(15,143,82,0.32), 0 0 110px rgba(15,143,82,0.20)'
                : '0 28px 60px -20px rgba(13,27,42,0.32), 0 0 48px rgba(13,27,42,0.18), 0 0 110px rgba(13,27,42,0.10)'
            return (
              <div
                key={event.city}
                className="fade-up"
                style={{ containerType: 'inline-size' }}
              >
                <div
                  className="group relative overflow-hidden"
                  style={{
                    aspectRatio: '3/4',
                    width: '100%',
                    borderRadius: '14px',
                    display: 'block',
                    boxShadow: cardGlow,
                  }}
                >
                  {/* Background image */}
                  <img
                    src={event.img}
                    alt={event.city}
                    style={{
                      position: 'absolute', inset: 0, width: '100%', height: '100%',
                      objectFit: 'cover',
                      filter: imageFilter,
                      transition: 'transform 0.6s ease',
                    }}
                  />
                  {/* Gradient overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: overlayGradient }} />
                  {/* Accent top edge */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: accentStripe }} />

                  {/* Top strip — badge gets the FULL top strip now (chip moved to
                      bottom CTA zone). Height caps at ~62% of card width (~47%
                      card height given 3/4 aspect) so the title stays clear. */}
                  {event.crest && (
                    <img
                      src={event.crest}
                      alt={`Soccerex ${event.city} — Est. 1996, 30 Years`}
                      style={{
                        position: 'absolute',
                        /* On small cards (narrow) sit near the top edge; on large
                           cards pull the badge further up so its clipped top
                           whitespace lands above the card and the visible content
                           centers in the available top area. */
                        top: 'clamp(-60px, calc(-11cqw + 14px), 6px)',
                        left: 'clamp(-20px, calc(-4cqw + 10px), 12px)',
                        /* Crank height so the ribbon text ("EST.1996 | 30 YEARS") is legible.
                           95cqw ≈ 71% of card height — fills the top area without touching
                           the title row below. Width auto-sizes to near-full card width. */
                        maxHeight: '95cqw',
                        maxWidth: 'calc(100% - clamp(12px, 4cqw, 32px))',
                        height: 'auto',
                        width: 'auto',
                        objectFit: 'contain',
                        clipPath: 'inset(14% 0 14% 0)',
                        filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.6)) drop-shadow(0 2px 8px rgba(0,0,0,0.45))',
                        zIndex: 5,
                        pointerEvents: 'none',
                      }}
                    />
                  )}

                  {/* Content — fixed-height metadata rail so city names align across cards */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px', display: 'flex', flexDirection: 'column' }}>
                    {/* Status chip sits above the city name, out of the top strip */}
                    {event.status === 'soon' && (
                      <div style={{
                        alignSelf: 'flex-start', marginBottom: '10px', padding: '5px 12px',
                        background: isMiami ? '#E91E63' : isRiyadh ? '#0f8f52' : 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(8px)',
                        border: isMiami ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '100px',
                        color: '#fff', fontSize: '10px', fontWeight: 700,
                        letterSpacing: '0.15em', textTransform: 'uppercase',
                        /* Stacked outer glow so the pill reads against any
                           photo frame underneath. Miami pill gets a pink
                           glow that matches its fill; others get a white
                           glow to lift against dark imagery. */
                        boxShadow: isMiami
                          ? '0 0 0 1px rgba(255,255,255,0.25), 0 2px 8px rgba(0,0,0,0.35), 0 0 16px rgba(233,30,99,0.55), 0 0 36px rgba(233,30,99,0.40), 0 0 72px rgba(233,30,99,0.22)'
                          : '0 2px 8px rgba(0,0,0,0.35), 0 0 14px rgba(255,255,255,0.30), 0 0 36px rgba(255,255,255,0.18)',
                      }}>
                        Coming Soon
                      </div>
                    )}
                    {event.status === 'open' && (
                      <div style={{ alignSelf: 'flex-start', marginBottom: '10px', padding: '5px 12px', background: 'var(--color-brand-accent)', borderRadius: '100px', color: '#fff', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        Registration Open
                      </div>
                    )}
                    {event.status === 'past' && (
                      <div style={{ alignSelf: 'flex-start', marginBottom: '10px', padding: '5px 12px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '100px', color: 'rgba(255,255,255,0.85)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                        {event.pastLabel || 'Event Concluded'}
                      </div>
                    )}
                    <h3 className="font-heading font-bold leading-none" style={{
                      fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
                      color: cityColor,
                      textShadow: isMiami
                        ? '0 2px 8px rgba(13,27,42,0.7), 0 2px 24px rgba(13,27,42,0.5)'
                        : '0 2px 20px rgba(0,0,0,0.4)',
                      marginBottom: '12px',
                      letterSpacing: '-0.02em',
                    }}>
                      {event.city}
                    </h3>
                    <p style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px' }}>
                      {event.dates}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem' }}>
                      {event.venue}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.18em', marginTop: '14px' }}>
                      {event.name}
                    </p>
                    {/* CTA row: only when the event has a destination. Riyadh (TBA)
                        has no details link and no register CTA, so it shows none. */}
                    {(event.learnMoreTo || event.ctaLabel) && (
                      <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: (event.learnMoreTo && event.ctaLabel) ? '1fr 1fr' : '1fr', gap: '8px', position: 'relative', zIndex: 6 }}>
                        {event.learnMoreTo && (
                          <Link
                            to={event.learnMoreTo}
                            className="home-event-cta home-event-cta--ghost"
                          >
                            Learn more
                          </Link>
                        )}
                        {event.ctaLabel && (event.ctaExternal ? (
                          <a
                            href={event.ctaHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="home-event-cta home-event-cta--solid"
                            style={{ background: event.accent, borderColor: event.accent, color: event.ctaTextColor }}
                          >
                            {event.ctaLabel}
                          </a>
                        ) : (
                          <Link
                            to={event.ctaHref}
                            className="home-event-cta home-event-cta--solid"
                            style={{ background: event.accent, borderColor: event.accent, color: event.ctaTextColor }}
                          >
                            {event.ctaLabel}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
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
  { src: '/images/global-network/nike.jpg', alt: 'Nike' },
  { src: '/images/global-network/Adidas.jpg', alt: 'Adidas' },
  { src: '/images/global-network/paramount_plus_logo_1_1.png', alt: 'Paramount+' },
  { src: '/images/global-network/The_Economist_Logo_svg_1_1.png', alt: 'The Economist' },
  { src: '/images/global-network/Forbes_Logo_1.png', alt: 'Forbes' },
  { src: '/images/global-network/Yahoo_Sports_New_Logo_1.png', alt: 'Yahoo Sports' },
]

const EXHIBITOR_LOGOS = [
  { src: '/images/exhibitors/squire-patton-boggs.png', alt: 'Squire Patton Boggs' },
  { src: '/images/exhibitors/liveu.png', alt: 'LiveU' },
  { src: '/images/exhibitors/sofascore.png', alt: 'Sofascore' },
  { src: '/images/exhibitors/balancebox.png', alt: 'BalanceBox' },
  { src: '/images/exhibitors/wicket.webp', alt: 'Wicket' },
  { src: '/images/global-network/Sportfive_logo_2021_svg_1.png', alt: 'Sportfive' },
  { src: '/images/global-network/OneFootball.png', alt: 'OneFootball' },
  { src: '/images/global-network/electronic_arts_1_logo_png_transparent_1.png', alt: 'EA Sports' },
  { src: '/images/global-network/TikTok_logo_svg_1.png', alt: 'TikTok' },
  { src: '/images/global-network/Sport_Business_1.png', alt: 'SportBusiness' },
  { src: '/images/global-network/IMG_GradLogo_Black_RGB_1.png', alt: 'IMG' },
  { src: '/images/global-network/Samba_Digital_1.png', alt: 'Samba Digital' },
  { src: '/images/global-network/Rezzil_Logo_1.png', alt: 'Rezzil' },
  { src: '/images/global-network/Sponsor_United_Logo_1.png', alt: 'SponsorUnited' },
]

const ORG_LOGOS = [
  { src: '/images/organisations/img.webp', alt: 'IMG' },
  { src: '/images/organisations/livescore.webp', alt: 'LiveScore' },
  { src: '/images/organisations/elite-football-academy.webp', alt: 'Elite Football Academy' },
  { src: '/images/organisations/challenger-sports.webp', alt: 'Challenger Sports' },
  { src: '/images/organisations/cbf-usa.webp', alt: 'CBF USA' },
  { src: '/images/global-network/FIFA_logo_without_slogan_svg_1.png', alt: 'FIFA' },
  { src: '/images/global-network/La_liga_new_logo_1.png', alt: 'LaLiga' },
  { src: '/images/global-network/UEFA_logo_1.png', alt: 'UEFA' },
  { src: '/images/global-network/mls_logo_png_transparent_1.png', alt: 'MLS' },
  { src: '/images/global-network/Concacaf_1.png', alt: 'CONCACAF' },
  { src: '/images/global-network/commebol.png', alt: 'CONMEBOL' },
  { src: '/images/global-network/NWSL.png', alt: 'NWSL' },
  { src: '/images/global-network/Fox_SportsLogo_1.png', alt: 'Fox Sports' },
  { src: '/images/global-network/CBS_1.png', alt: 'CBS Sports' },
  { src: '/images/global-network/Bein_mediagroup_logo_1.png', alt: 'beIN Media' },
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

/* ─── BRAND ECOSYSTEM (WFS-style scrolling carousels per category) ────────── */
/* EVERY logo below has been cross-referenced against the live Soccerex Global */
/* Network page (soccerex.com/global-network) or the Europe 2026 partners list.  */
/* No speculative or unverified brands. Dated: April 2026.                      */
const BRAND_ECOSYSTEM = [
  {
    category: 'Rightsholders',
    logos: [
      { src: '/images/global-network/FIFA_logo_without_slogan_svg_1.png', alt: 'FIFA' },
      { src: '/images/global-network/La_liga_new_logo_1.png', alt: 'LaLiga' },
      { src: '/images/global-network/UEFA_logo_1.png', alt: 'UEFA' },
      { src: '/images/global-network/Concacaf_1.png', alt: 'CONCACAF' },
      { src: '/images/global-network/commebol.png', alt: 'CONMEBOL' },
      { src: '/images/global-network/mls_logo_png_transparent_1.png', alt: 'MLS' },
      { src: '/images/global-network/NWSL.png', alt: 'NWSL' },
      { src: '/images/global-network/2026_FIFA_World_Cup_emblem_svg_1.png', alt: 'FIFA World Cup 2026' },
      { src: '/images/global-network/2024_Copa_Am_rica_logo_svg_1.png', alt: 'Copa America 2024' },
      { src: '/images/global-network/IFFHS_HD_logo_1.png', alt: 'IFFHS' },
      { src: '/images/global-network/MLS_Next_logo_1.png', alt: 'MLS Next' },
    ],
  },
  {
    category: 'Federations',
    logos: [
      { src: '/images/global-network/Royal_Netherlands_Football_Association_Logo_svg_1.png', alt: 'KNVB (Royal Netherlands FA)' },
      { src: '/images/global-network/Qatar_Football_Association_logo_svg_1.png', alt: 'Qatar FA' },
      { src: '/images/global-network/Saudi_Arabia_national_football_team_logo_svg_1.png', alt: 'Saudi Arabia FA' },
      { src: '/images/global-network/Scottish_Football_Association_Logo_svg_1.png', alt: 'Scottish FA' },
      { src: '/images/global-network/Belgium_National_Football_Team_Logo_1.png', alt: 'Belgium FA' },
      { src: '/images/global-network/FKF_LOGO_1.png', alt: 'Football Kenya Federation' },
      { src: '/images/global-network/Nigeria.png', alt: 'Nigeria FA' },
      { src: '/images/global-network/Egyptian.png', alt: 'Egyptian FA' },
      { src: '/images/global-network/Liberia_FA_1.png', alt: 'Liberia FA' },
    ],
  },
  {
    category: 'Clubs',
    logos: [
      { src: '/images/global-network/FC_Barcelona_crest_svg_1.png', alt: 'FC Barcelona' },
      { src: '/images/global-network/Real_Madrid2.png', alt: 'Real Madrid' },
      { src: '/images/global-network/Manchester_City_FC_badge_svg_1.png', alt: 'Manchester City' },
      { src: '/images/global-network/Liverpool_FC_1.png', alt: 'Liverpool FC' },
      { src: '/images/global-network/Arsenal_FC_1.png', alt: 'Arsenal' },
      { src: '/images/global-network/Tottenham_Hotspur_1.png', alt: 'Tottenham Hotspur' },
      { src: '/images/global-network/Juventus_FC_2017_logo_1.png', alt: 'Juventus' },
      { src: '/images/global-network/FC_Internazionale_Milano_2021_svg_1.png', alt: 'Inter Milan' },
      { src: '/images/global-network/Ajax_Amsterdam_svg_1.png', alt: 'Ajax' },
      { src: '/images/global-network/PSG_logo_1.png', alt: 'PSG' },
      { src: '/images/global-network/Borussia_Dortmund_1.png', alt: 'Borussia Dortmund' },
      { src: '/images/global-network/FC_Porto_1.png', alt: 'FC Porto' },
      { src: '/images/global-network/500px_SL_Benfica_logo_svg_1.png', alt: 'SL Benfica' },
      { src: '/images/global-network/atletico_de_madrid_1.png', alt: 'Atletico Madrid' },
      { src: '/images/global-network/Astonvilla.png', alt: 'Aston Villa' },
      { src: '/images/global-network/Brighton_and_Hove_Albion_FC_crest_svg_1.png', alt: 'Brighton and Hove Albion' },
      { src: '/images/global-network/Crystal_Palace_FC_logo_2022_svg_1.png', alt: 'Crystal Palace' },
      { src: '/images/global-network/Eintracht_Frankfurt_Logo_svg_1.png', alt: 'Eintracht Frankfurt' },
      { src: '/images/global-network/VfB_Stuttgart_logo_1.png', alt: 'VfB Stuttgart' },
      { src: '/images/global-network/psv_eindhoven_logo_C72631179E_seeklogo_com_1.png', alt: 'PSV Eindhoven' },
      { src: '/images/global-network/inter_miami_cf_logo_3D46B8A7DE_seeklogo_com_1.png', alt: 'Inter Miami CF' },
    ],
  },
  {
    category: 'Brands',
    logos: [
      { src: '/images/global-network/nike.jpg', alt: 'Nike' },
      { src: '/images/global-network/Adidas.jpg', alt: 'Adidas' },
      { src: '/images/global-network/TikTok_logo_svg_1.png', alt: 'TikTok' },
      { src: '/images/global-network/electronic_arts_1_logo_png_transparent_1.png', alt: 'EA Sports' },
      { src: '/images/sponsors/mas-by-messi.png', alt: 'Mas+ by Messi' },
      { src: '/images/sponsors/neau-water.png', alt: 'Neau Water' },
      { src: '/images/sponsors/sports-illustrated-tickets.png', alt: 'SI Tickets' },
      { src: '/images/sponsors/capillary-flow.webp', alt: 'CapillaryFlow' },
      { src: '/images/global-network/Kwikgoal_1.png', alt: 'Kwikgoal' },
    ],
  },
  {
    category: 'Service Providers',
    logos: [
      { src: '/images/global-network/IMG_GradLogo_Black_RGB_1.png', alt: 'IMG' },
      { src: '/images/global-network/IMG_Arena_1.png', alt: 'IMG Arena' },
      { src: '/images/global-network/OneFootball.png', alt: 'OneFootball' },
      { src: '/images/global-network/Sportfive_logo_2021_svg_1.png', alt: 'Sportfive' },
      { src: '/images/global-network/Samba_Digital_1.png', alt: 'Samba Digital' },
      { src: '/images/global-network/Sponsor_United_Logo_1.png', alt: 'SponsorUnited' },
      { src: '/images/global-network/Rezzil_Logo_1.png', alt: 'Rezzil' },
      { src: '/images/global-network/LiveU_Logo_On_Whtite_1.png', alt: 'LiveU' },
      { src: '/images/global-network/Statathlon_Logo_Web_2.png', alt: 'Statathlon' },
      { src: '/images/global-network/Sportian_1.png', alt: 'Sportian' },
    ],
  },
  {
    category: 'Media',
    logos: [
      { src: '/images/global-network/Fox_SportsLogo_1.png', alt: 'Fox Sports' },
      { src: '/images/global-network/CBS_1.png', alt: 'CBS Sports' },
      { src: '/images/global-network/Bein_mediagroup_logo_1.png', alt: 'beIN Media' },
      { src: '/images/global-network/Forbes_Logo_1.png', alt: 'Forbes' },
      { src: '/images/global-network/Yahoo_Sports_New_Logo_1.png', alt: 'Yahoo Sports' },
      { src: '/images/global-network/The_Economist_Logo_svg_1_1.png', alt: 'The Economist' },
      { src: '/images/global-network/paramount_plus_logo_1_1.png', alt: 'Paramount+' },
      { src: '/images/global-network/Sport_Business_1.png', alt: 'SportBusiness' },
      { src: '/images/global-network/Telemundo_logo_2018_svg_1.png', alt: 'Telemundo' },
      { src: '/images/global-network/Logo_Univision_2019_svg_1.png', alt: 'Univision' },
      { src: '/images/global-network/The_Players_Tribune_logo_svg_1.png', alt: "The Players' Tribune" },
    ],
  },
  {
    category: 'Soccerex Partners',
    logos: [
      { src: '/images/sponsors/neau-water.png', alt: 'Neau Water' },
      { src: '/images/sponsors/value-4-sports.png', alt: 'Value 4 Sports' },
      { src: '/images/sponsors/afa-argentina.png', alt: 'AFA Argentina' },
      { src: '/images/sponsors/sports-com.webp', alt: 'Sports.com' },
      { src: '/images/sponsors/capillary-flow.webp', alt: 'CapillaryFlow' },
      { src: '/images/sponsors/sports-illustrated-tickets.png', alt: 'SI Tickets' },
      { src: '/images/sponsors/mas-by-messi.png', alt: 'Mas+ by Messi' },
      { src: '/images/sponsors/conifa.png', alt: 'CONIFA' },
      { src: '/images/sponsors/fc-business.png', alt: 'FC Business' },
      { src: '/images/sponsors/waff-foundation.png', alt: 'WAFF Foundation' },
      { src: '/images/sponsors/grenada-fa.png', alt: 'Grenada FA' },
      { src: '/images/sponsors/sun-global.png', alt: 'Sun Global' },
    ],
  },
]

/* ─── WFS-style: scrolling carousels per category on white/gradient cards ── */
function EcosystemRow({ category, logos, direction = 'left', speed = 32 }) {
  const tripled = [...logos, ...logos, ...logos]
  return (
    <div
      className="sx-ecosystem-row fade-up"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f3f4f7 70%, #e7eaef 100%)',
        borderRadius: '14px',
        boxShadow: '0 12px 32px rgba(6, 10, 24, 0.35), 0 1px 0 rgba(255,255,255,0.4) inset',
        border: '1px solid rgba(9,32,62,0.08)',
        minHeight: '116px',
        overflow: 'hidden',
      }}
    >
      {/* Left: category label */}
      <div className="sx-ecosystem-left" style={{
        padding: 'clamp(20px, 2vw, 28px) clamp(20px, 2.5vw, 32px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, rgba(9,32,62,0.02) 0%, rgba(9,32,62,0.04) 100%)',
      }}>
        <span style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(1.3rem, 1.7vw, 1.7rem)',
          fontWeight: 700,
          lineHeight: 1.1,
          color: '#09203e',
          letterSpacing: '-0.01em',
        }}>
          {category}
        </span>
      </div>

      {/* Right: infinite scrolling carousel */}
      <div
        className="sx-ecosystem-carousel"
        style={{
          position: 'relative',
          overflow: 'hidden',
          maskImage: 'linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(36px, 4vw, 64px)',
            width: 'max-content',
            animation: `marquee-${direction} ${speed}s linear infinite`,
            padding: '0 40px',
            height: '100%',
            minHeight: '80px',
          }}
        >
          {tripled.map((logo, i) => (
            <img
              key={`${category}-${i}`}
              src={logo.src}
              alt={logo.alt}
              loading="lazy"
              style={{
                height: 'clamp(36px, 3.4vw, 48px)',
                width: 'auto',
                maxWidth: 'clamp(120px, 10vw, 160px)',
                objectFit: 'contain',
                filter: 'none',
                opacity: 0.9,
                flexShrink: 0,
                transition: 'opacity 0.3s, transform 0.3s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1.08)' }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'scale(1)' }}
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function SocialProofSection() {
  return (
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #050d1a 0%, #081528 50%, #050d1a 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />
      <div className="absolute top-8 left-8 font-heading font-bold text-white/[0.03] pointer-events-none select-none" style={{ fontSize: 'clamp(8rem, 20vw, 16rem)', lineHeight: 1 }}>04</div>

      <div className="relative z-10" style={{ maxWidth: '1360px', margin: '0 auto', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="mb-14">
          <h2 className="font-heading font-bold text-white leading-tight fade-up" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)' }}>
            The Soccerex <span style={{ color: 'var(--color-brand-accent)' }}>Ecosystem</span>
          </h2>
          <p className="font-body text-white/55 leading-relaxed fade-up mt-4" style={{ fontSize: '1rem', maxWidth: '720px' }}>
            Built over 30 years, the Soccerex ecosystem connects the people, capital, companies, and institutions shaping football&#x2019;s future, creating the foundation for events, dealmaking, investment, innovation, women&#x2019;s football, and impact.
          </p>
          <p className="font-body text-white/55 leading-relaxed fade-up mt-4" style={{ fontSize: '1rem', maxWidth: '720px' }}>
            For 30 years, Soccerex has connected football&#x2019;s global ecosystem, turning access into partnerships, investment, innovation, impact, and commercial opportunity.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {BRAND_ECOSYSTEM.map((row, i) => (
            <EcosystemRow
              key={row.category}
              category={row.category}
              logos={row.logos}
              direction={i % 2 === 0 ? 'left' : 'right'}
              speed={34 + (i * 3)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── SPEAKERS SHOWCASE (Home page highlight) ────────────────────────────────
// HOME_SPEAKERS (the curated famous-first set) lives in ../data/speakers and is
// imported at the top of this file so the /past-speakers page shares it.

function SpeakersShowcase() {
  return (
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(9,32,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      <div className="relative z-10" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="text-center mb-16">
          <p className="section-label mb-4 fade-up" style={{ color: '#09203e', fontWeight: 600 }}>THE VOICES OF THE GAME</p>
          <h2 className="font-heading font-bold leading-tight mb-6 fade-up" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', color: '#09203e' }}>
            Soccerex{' '}
            <span style={{ color: 'var(--color-brand-accent)' }}>Speakers</span>
          </h2>
          <div className="fade-up mx-auto mb-6" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, #09203e, transparent)' }} />
          <p className="font-body fade-up mx-auto" style={{ fontSize: '1.05rem', color: '#555', maxWidth: '680px' }}>
            Football’s decision-makers do not just gather at Soccerex. They shape what comes next.
          </p>
          <p className="font-body fade-up mx-auto mt-4" style={{ fontSize: '1.05rem', color: '#555', maxWidth: '680px' }}>
            From presidents and commissioners to owners, investors, legends, operators, and innovators, the Soccerex stage brings together the voices driving the future of the global game.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {HOME_SPEAKERS.map((s, i) => (
            <div key={s.name} className="scale-up" style={{ transitionDelay: `${i * 40}ms` }}>
              <div style={{
                position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '3/4',
                boxShadow: '0 10px 30px rgba(9,32,62,0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(9,32,62,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(9,32,62,0.1)' }}
              >
                <img src={s.img} alt={s.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 45%, rgba(9,32,62,0.95) 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 12px' }}>
                  <p className="font-heading font-bold" style={{ fontSize: '0.88rem', color: '#fff', lineHeight: 1.2, marginBottom: '2px' }}>{s.name}</p>
                  <p className="font-body" style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.3 }}>{s.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12 fade-up">
          <Link
            to={PAST_SPEAKERS}
            className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em] cursor-pointer"
            style={{ background: '#09203e', color: '#fff', padding: '16px 34px', fontSize: '0.82rem', textDecoration: 'none', transition: 'all 0.3s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#0d2b52' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#09203e' }}
          >
            View all past speakers <ArrowRight size={15} />
          </Link>
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
    <section style={{ background: '#fff', borderTop: '1px solid #eee', padding: 'clamp(80px,10vw,120px) clamp(24px,5vw,80px) clamp(60px,8vw,100px)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
        <h2 className="font-heading font-bold uppercase leading-tight mb-4 fade-up" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#09203e', letterSpacing: '0.02em' }}>
          Proud Sponsor of Soccerex
        </h2>
        <p className="font-body leading-relaxed fade-up mx-auto" style={{ fontSize: '1.05rem', color: '#555', maxWidth: '700px' }}>
          <span style={{ color: 'var(--color-red)', fontWeight: 700 }}>SPORTS.COM</span> is proud to be an official sponsor of Soccerex events in 2026, supporting the global sports business community through innovation, media, and strategic partnerships.
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
          <p className="font-heading font-bold uppercase text-white/60 tracking-[0.15em] mb-2" style={{ fontSize: 'clamp(0.6rem, 1.6vw, 0.85rem)' }}>Sponsored By</p>
          <img src="/images/partners/sports-com-logo-full.png" alt="Sports.com" style={{ height: 'clamp(22px, 4vw, 32px)', width: 'auto', margin: '0 auto', filter: 'brightness(0) invert(1)' }} />
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
  { quote: "Any time I get to be surrounded by people who have the same passion for the game that I do, the conversations that teach you and help you grow and learn, that's why I love it.", author: 'Karina LeBlanc', role: 'Portland Thorns GM', img: '/images/testimonials/karina-la-blanc.webp' },
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
          <div style={{ width: '6px', height: 'clamp(50px, 8vw, 80px)', background: 'var(--color-brand-accent)', borderRadius: '3px', flexShrink: 0, marginTop: '4px' }} />
          <h2 className="font-heading font-bold uppercase leading-none" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#09203e', letterSpacing: '0.02em' }}>
            Testimonials
          </h2>
        </div>

        {/* Testimonial card — pink rim, white fill */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 fade-up" style={{ borderRadius: '16px', overflow: 'hidden', minHeight: '400px', border: '2px solid var(--color-brand-accent)', boxShadow: '0 18px 48px -28px rgba(233,30,99,0.45)' }}>
          {/* Photo side */}
          <div className="md:col-span-5 relative" style={{ minHeight: '300px' }}>
            {TESTIMONIALS.map((item, i) => {
              // Only render active + next for performance (2 instead of 8)
              const next = (active + 1) % TESTIMONIALS.length
              if (i !== active && i !== next) return null
              return (
                <img
                  key={item.author}
                  src={item.img}
                  alt={item.author}
                  loading="lazy"
                  style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                    opacity: i === active ? 1 : 0,
                    transition: 'opacity 0.8s ease',
                  }}
                />
              )
            })}
          </div>

          {/* Quote side */}
          <div className="md:col-span-7 relative" style={{ background: '#FFFFFF', padding: 'clamp(40px, 6vw, 72px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* Decorative quote marks — now pink so they pick up the brand
                accent against the white fill (was dark navy at 0.08 alpha,
                which disappears on white). */}
            <span className="font-heading font-bold absolute pointer-events-none" style={{ top: '10px', left: '16px', fontSize: 'clamp(4rem, 6vw, 6rem)', color: 'var(--color-brand-accent)', opacity: 0.18, lineHeight: 1 }}>"</span>
            <span className="font-heading font-bold absolute pointer-events-none" style={{ bottom: '10px', right: '16px', fontSize: 'clamp(4rem, 6vw, 6rem)', color: 'var(--color-brand-accent)', opacity: 0.18, lineHeight: 1 }}>"</span>

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
      {/* Top padding must clear the white wavy divider above, or the GLOBAL
          REACH eyebrow tucks under the wave. */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center', padding: 'clamp(88px,9vw,120px) clamp(24px,5vw,80px) 0', position: 'relative', zIndex: 3 }}>
        <p className="section-label text-brand-accent mb-4 fade-up">GLOBAL REACH</p>
        <h2 className="font-heading font-bold text-white leading-tight mb-4 fade-up gold-underline mx-auto" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
          57 Events. 21 Cities. 30 Years.
        </h2>
        <p className="font-body text-white/60 leading-relaxed fade-up mx-auto" style={{ fontSize: '1.05rem', maxWidth: '650px' }}>
          Since 1996, Soccerex has brought the global football business community together. From Wembley to the Maracana, from Amsterdam to Miami, the game's leaders gather wherever Soccerex goes.
        </p>
      </div>

      <div className="fade-up" style={{ marginTop: '-6vw' }}>
        <Suspense fallback={<div style={{ height: '600px' }} />}>
          <InteractiveGlobe />
        </Suspense>
      </div>
    </section>
  )
}

// ─── SECTION 6: WHY SOCCEREX ────────────────────────────────────────────────
function WhySoccerexSection() {
  return (
    <section id="why-soccerex" className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #061729 0%, #0e2a4f 50%, #09203e 100%)' }}>
      <NetworkNodes color="#ffffff" accentColor="var(--color-brand-accent)" nodeCount={20} opacity={0.08} />
      {/* Section number watermark */}
      <div className="absolute top-8 right-8 font-heading font-bold text-white/[0.03] pointer-events-none select-none" style={{ fontSize: 'clamp(8rem, 20vw, 16rem)', lineHeight: 1 }}>05</div>

      <div className="relative z-10" style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <p className="section-label text-brand-accent mb-4 fade-up">05 &middot; WHY SOCCEREX</p>
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
        <p className="font-heading font-semibold text-brand-accent leading-relaxed fade-up" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)' }}>
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
          <p className="section-label text-brand-accent mb-4 fade-up">06 &middot; HERITAGE</p>
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
            to={GALLERY}
            className="inline-flex items-center gap-2 font-body font-semibold text-sm uppercase tracking-[0.15em] px-8 py-4 transition-all duration-300 cursor-pointer border-none"
            style={{ background: 'transparent', border: '1px solid rgba(191,177,112,0.4)', color: 'var(--color-brand-accent)', textDecoration: 'none' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-brand-accent)'; e.currentTarget.style.background = 'rgba(191,177,112,0.08)' }}
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

      <div className="relative z-10 text-center" style={{ maxWidth: '780px', margin: '0 auto', padding: 'clamp(80px,12vw,140px) clamp(24px,5vw,80px)' }}>
        <h2 className="font-heading font-bold text-white leading-tight mb-5 fade-up text-glow" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          The Global Football Business Platform
        </h2>
        <p className="font-body text-white/75 leading-relaxed mb-10 fade-up mx-auto" style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.25rem)', maxWidth: '620px' }}>
          Where deals, partnerships, and impact come to life.
        </p>
        <div className="fade-up">
          <Link to={CONTACT} className="inline-flex items-center gap-2 font-body font-semibold text-sm uppercase tracking-[0.15em] px-10 py-5 transition-all duration-300 cursor-pointer border-none"
            style={{ background: 'var(--color-brand-accent)', color: '#fff', fontSize: '0.95rem', textDecoration: 'none' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#d4c78e'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-brand-accent)'; e.currentTarget.style.transform = 'translateY(0)' }}>
            Join Soccerex
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}


// ─── SOCCEREX 2.0 PLATFORM SECTION ──────────────────────────────────────────
const PLATFORM_PILLARS = [
  { icon: Shield, title: 'Neutrality & Trust', desc: 'A platform where clubs, leagues, brands, and investors engage openly, without agenda or bias.' },
  { icon: Network, title: 'Global Connectivity', desc: 'A single point of connection across markets, bringing together decision-makers from every part of the global football ecosystem.' },
  { icon: Brain, title: 'Institutional Memory', desc: 'Long-standing relationships and accumulated insight ensure conversations and partnerships build over time, not from scratch.' },
  { icon: Target, title: 'Commercial Gravity', desc: 'Soccerex attracts the industry\'s most relevant stakeholders, creating a concentrated environment where opportunities naturally emerge.' },
  { icon: Award, title: 'Credibility Through Consistency', desc: 'A proven track record of delivery across global markets has established Soccerex as a trusted and reliable platform.' },
]

function PlatformSection() {
  return (
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(9,32,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      <div className="relative z-10" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div className="text-center mb-16">
          <p className="section-label mb-4 fade-up" style={{ color: '#09203e', fontWeight: 600 }}>SOCCEREX 2.0</p>
          <h2 className="font-heading font-bold leading-tight mb-6 fade-up" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#09203e' }}>
            To Fuel The Global Growth of the{' '}
            <span style={{ color: 'var(--color-brand-accent)' }}>Football Community</span>
          </h2>
          <div className="fade-up mx-auto mb-8" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, #09203e, transparent)' }} />
          <p className="font-body leading-relaxed fade-up mx-auto" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.15rem)', color: '#444', maxWidth: '740px' }}>
            On our 30th anniversary, Soccerex is evolving. From an events company to a year-round platform. From a place where relationships begin to a system that ensures results for our constituents. Through world-class events, insights, and partnerships.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {PLATFORM_PILLARS.map((p, i) => {
            const Icon = p.icon
            return (
              <div key={p.title} className="scale-up" style={{ transitionDelay: `${i * 60}ms` }}>
                <div style={{
                  background: '#fff', padding: '28px 22px', borderRadius: '14px',
                  border: '1px solid rgba(9,32,62,0.06)',
                  boxShadow: '0 8px 30px rgba(9,32,62,0.06)',
                  height: '100%', transition: 'transform 0.3s, box-shadow 0.3s',
                  textAlign: 'center',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(9,32,62,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(9,32,62,0.06)' }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--color-brand-accent), #d4c78e)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Icon size={22} color="#09203e" strokeWidth={2} />
                  </div>
                  <h3 className="font-heading font-bold mb-2" style={{ fontSize: '0.95rem', color: '#09203e' }}>{p.title}</h3>
                  <p className="font-body" style={{ fontSize: '0.82rem', color: '#666', lineHeight: 1.5 }}>{p.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── THREE VERTICALS SHOWCASE ───────────────────────────────────────────────
const VERTICALS = [
  { icon: Handshake, title: 'Deal Network', tagline: 'Structured dealmaking, not just networking.', to: '/deal-network' },
  { icon: Heart, title: 'HerSoccerex', tagline: 'Women\'s football business vertical.', to: '/hersoccerex' },
  { icon: Rocket, title: 'The Pitch', tagline: 'Football innovation meets institutional capital.', to: '/the-pitch' },
]

function VerticalsShowcase() {
  return (
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #09203e 0%, #0d2b52 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
      <NetworkNodes color="#ffffff" accentColor="var(--color-brand-accent)" nodeCount={25} opacity={0.1} />
      <div className="relative z-10" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div className="text-center mb-14">
          <p className="section-label text-brand-accent mb-4 fade-up">NEW VERTICALS</p>
          <h2 className="font-heading font-bold text-white leading-tight mb-6 fade-up text-glow" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
            Introducing the{' '}
            <span style={{ color: 'var(--color-brand-accent)' }}>Soccerex Platform</span>
          </h2>
          <div className="fade-up mx-auto mb-6" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, var(--color-brand-accent), transparent)' }} />
          <p className="font-body text-white/65 leading-relaxed fade-up mx-auto" style={{ fontSize: '1rem', maxWidth: '640px' }}>
            Four verticals transforming Soccerex from an events platform to a comprehensive business solution for the global football community.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VERTICALS.map((v, i) => {
            const Icon = v.icon
            return (
              <Link key={v.title} to={v.to} className="scale-up block" style={{ textDecoration: 'none', transitionDelay: `${i * 80}ms` }}>
                <div style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(191,177,112,0.2)',
                  backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '40px 32px',
                  height: '100%', textAlign: 'center',
                  transition: 'transform 0.3s, border-color 0.3s, background 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = 'var(--color-brand-accent)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(191,177,112,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                >
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-brand-accent), #d4c78e)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Icon size={26} color="#09203e" strokeWidth={2} />
                  </div>
                  <span className="inline-block font-mono uppercase tracking-[0.15em] mb-4" style={{ fontSize: '0.6rem', color: 'var(--color-brand-accent)', background: 'rgba(191,177,112,0.12)', padding: '4px 12px', borderRadius: '4px', fontWeight: 600 }}>New</span>
                  <h3 className="font-heading font-bold mb-3" style={{ fontSize: '1.4rem', color: '#fff' }}>{v.title}</h3>
                  <p className="font-body mb-6" style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{v.tagline}</p>
                  <span className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.12em]" style={{ fontSize: '0.78rem', color: 'var(--color-brand-accent)' }}>
                    Learn more <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── HOME PAGE ──────────────────────────────────────────────────────────────
/* ─── A LOOK BACK: SOCCEREX EUROPE 2026 ───────────────────────────────────
   Past-tense recap of Amsterdam. Slim white band that points visitors to
   the press release and gallery without competing with the Miami feature
   up top. Intentionally low-volume — gratitude + a link, not a hard sell. */
function EuropeRecapSection() {
  return (
    <section className="relative overflow-hidden" style={{ background: '#FFFFFF', borderTop: '1px solid rgba(13,27,42,0.06)', borderBottom: '1px solid rgba(13,27,42,0.06)' }}>
      <div className="relative z-10" style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(72px,9vw,120px) clamp(24px,5vw,80px)' }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-5 fade-up">
            <div className="relative" style={{ aspectRatio: '4/3', overflow: 'hidden', border: '1px solid rgba(13,27,42,0.08)' }}>
              <img src="/hero/279-NEW9-cruyff-arena-interior-daylight.jpg" alt="Johan Cruijff ArenA"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.35) brightness(0.92)' }} />
              <div className="absolute" style={{ left: 16, top: 16 }}>
                <span className="font-mono uppercase" style={{
                  fontSize: 10, letterSpacing: '0.22em',
                  background: 'rgba(255,255,255,0.92)', color: '#0D1B2A',
                  padding: '5px 10px',
                }}>
                  Event concluded · May 2026
                </span>
              </div>
            </div>
          </div>
          <div className="md:col-span-7 fade-up">
            <div className="flex items-center gap-3 mb-4">
              <span style={{ width: 7, height: 7, background: '#c8302c' }} />
              <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.24em', color: '#0D1B2A' }}>
                A look back · Soccerex Europe 2026
              </p>
            </div>
            <h2 className="font-heading font-bold leading-tight mb-4" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.4rem)', color: '#0D1B2A' }}>
              Amsterdam closed our European chapter.
            </h2>
            <p className="font-body leading-relaxed mb-3" style={{ fontSize: '1rem', color: '#3a4a5a', maxWidth: '600px' }}>
              Three days at the Johan Cruijff ArenA brought together federations, leagues, clubs, brands, media and football legends to mark the 30th anniversary edition. Thank you to everyone who joined.
            </p>
            <p className="font-body leading-relaxed mb-6" style={{ fontSize: '0.95rem', color: '#607186', maxWidth: '600px' }}>
              The conversations continue in Miami this September.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to={pressRelease('soccerex-europe-amsterdam-may-2026')}
                className="inline-flex items-center gap-2 font-body font-semibold text-sm uppercase tracking-[0.15em] px-6 py-3 transition-all duration-200"
                style={{ background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.20)', color: '#0D1B2A', textDecoration: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#c8302c'; e.currentTarget.style.color = '#c8302c' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(13,27,42,0.20)'; e.currentTarget.style.color = '#0D1B2A' }}>
                <FileText size={14} /> Press release
              </Link>
              <Link to={EUROPE_2026}
                className="inline-flex items-center gap-2 font-body font-semibold text-sm uppercase tracking-[0.15em] px-6 py-3 transition-all duration-200"
                style={{ background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.20)', color: '#0D1B2A', textDecoration: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#c8302c'; e.currentTarget.style.color = '#c8302c' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(13,27,42,0.20)'; e.currentTarget.style.color = '#0D1B2A' }}>
                Event recap <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  useScrollAnimations()
  const location = useLocation()

  // If navigated from Navbar with a scroll target, scroll to it once mounted
  useEffect(() => {
    const target = location.state?.scrollTo
    if (target) {
      const t = setTimeout(() => {
        const el = document.querySelector(target)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      return () => clearTimeout(t)
    }
  }, [location.state])

  return (
    <>
      <HeroSlideshow />
      {/* No wave divider here. A photographic slideshow ends in arbitrary
          pixel content — any wave/edge effect inevitably reveals a seam.
          The hero's overlay already feathers softly into white at its base. */}
      <UpcomingEventSection />
      <EventsSection />
      <ByTheNumbersSection />
      <PixelDivider color="#FFFFFF" layers={4} height={110} speed={0.6} />
      <HeritageMapSection />
      <PixelDivider color="#0c1a2e" layers={4} height={90} speed={0.5} />
      <SpeakersShowcase />
      <PixelDivider color="#eae8e4" layers={4} height={90} speed={0.5} />
      {/* Soccerex Ecosystem moved above Testimonials per the GN revisions
          doc so visitors see the breadth of the network before the social
          proof / quotes. */}
      <SocialProofSection />
      <TestimonialsSection />
      {/* Amsterdam past-tense recap sits down here — out of the upcoming
          flow, points to press release + event page. */}
      <EuropeRecapSection />
      <ProudSponsorSection />
      {/* White waves cresting down into the navy FinalCTA. `color` is the
          divider's solid fill — match it to the section ABOVE (white)
          so the solid top blends seamlessly with ProudSponsor and only
          the wavy crest is visible against the navy below. */}
      <PixelDivider color="#FFFFFF" layers={4} height={90} speed={0.5} />
      <FinalCTASection />
    </>
  )
}
