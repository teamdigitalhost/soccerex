import { useEffect, useState } from 'react'
import { ArrowLeft, MapPin, Calendar, Mail, Trophy, Users, Briefcase, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HOME } from '../lib/routes'
import LeadForm from '../components/LeadForm'
import InquiryModalButton from '../components/InquiryModalButton'
import { sponsorshipSchema, speakerSchema } from '../lib/leadSchemas'

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
]

const PILLARS_BRAND = [
  { label: 'Insight', icon: 'insight' },
  { label: 'Network', icon: 'network' },
  { label: 'Deals', icon: 'deals' },
  { label: 'Growth', icon: 'growth' },
  { label: 'Impact', icon: 'impact' },
]

const WHY_ATTEND = [
  { title: 'Global Football in One Room', desc: 'Clubs, leagues, federations, rightsholders, brands, investors, financial institutions, technology leaders, and impact-driven organizations come together to shape the future of the global football economy.' },
  { title: 'Where Momentum Becomes Business', desc: 'In the wake of the 2026 FIFA World Cup, Soccerex Miami turns global attention into commercial growth, strategic partnerships, investment opportunities, closed business, and measurable impact.' },
  { title: 'Deal Network Access', desc: 'Through Soccerex Deal Network, attendees gain curated access to decision-makers, capital partners, strategic investors, family offices, funds, lenders, sponsors, and commercial counterparties focused on real outcomes.' },
  { title: 'Capital, Impact, and Growth', desc: "Soccerex brings the financial industry closer to the business of football, creating a platform to fund growth, share insight, expand women's football, support innovation, and drive lasting commercial and social impact." },
]

const THEMES = [
  'The Global Football Economy: Clubs, Leagues, Federations, Brands, Investors, and Rightsholders',
  'Capital, Investment, Club Ownership, and the Financial Future of Football',
  'Soccerex Deal Network: Curated Introductions, Strategic Partnerships, and Closed Business',
  'The 2026 FIFA World Cup and Beyond: Commercial Growth, Legacy, and Global Opportunity',
  'Media Rights, Streaming, Content, Technology, and New Revenue Models',
  'Stadiums, Venues, Matchday Experience, and Host City Development',
  "HerSoccerex: Women's Football, Investment, Leadership, and Commercial Growth",
  'Innovation, Impact, Fan Engagement, Brand Activation, and the Future of the Game',
]

/* Generic Miami pre-register — quick path. Anyone who wants the launch ping. */
function PreRegisterForm() {
  return (
    <LeadForm
      kind="preregister"
      theme="dark"
      submitLabel="Join the list"
      successTitle="You're on the list."
      successBody="We'll send updates as registration opens."
      extraPayload={{
        event_slug: 'soccerex-miami-2026',
        attendee_type: 'delegate',
        source: 'miami-event-preregister',
        marketing_opt_in: true,
      }}
      /* Field names follow the handoff doc's primary payload shape: `name`,
         `email`, `company`, `role`, `country`. The backend accepts the
         US-spelled and longer aliases too. */
      schema={[{
        fields: [
          { name: 'name',    label: 'Full name *',         required: true, placeholder: 'Eve Moneypenny', autoFocus: true, autoComplete: 'name' },
          { name: 'email',   label: 'Work email *',         required: true, type: 'email', placeholder: 'eve@example.com', autoComplete: 'email' },
          { name: 'company', label: 'Company / organisation', placeholder: 'Organisation' },
          { name: 'role',    label: 'Role',                 placeholder: 'Your role' },
          { name: 'country', label: 'Country',              placeholder: 'Country',
            suggest: ['United States', 'United Kingdom', 'Spain', 'Brazil', 'Mexico', 'Argentina', 'Germany', 'France', 'Canada'] },
        ],
      }]}
    />
  )
}

/* Rights-holder application — fuller multi-step form. The backend's Lead
   Inbox reviews these and approves a complimentary delegate pass when the
   organisation type and official email check out. */
const ORG_TYPES = [
  { value: 'club',        label: 'Club' },
  { value: 'league',      label: 'League' },
  { value: 'federation',  label: 'Federation / national team' },
  { value: 'confederation', label: 'Confederation' },
  { value: 'players_union', label: "Players' union" },
  { value: 'governing_body', label: 'Other governing body' },
  { value: 'other',       label: 'Other (please specify)' },
]

function RightsHolderForm() {
  return (
    <LeadForm
      kind="preregister"
      theme="dark"
      submitLabel="Submit application"
      successTitle="Application received."
      successBody="The Soccerex team reviews rightsholder eligibility and will email you. Passes are not issued automatically."
      extraPayload={{
        event_slug: 'soccerex-miami-2026',
        attendee_type: 'rights_holder',
        interest: 'Complimentary rights-holder pass',
        source: 'miami-rights-holder-apply',
        marketing_opt_in: true,
      }}
      /* Same primary keys as the quick pre-register schema, plus extra
         rights-holder context. `organisation_type` and `organisation_type_other`
         are written through to the lead payload column (free-form) — see
         backend handoff for storage. */
      schema={[
        {
          fields: [
            { name: 'organisation_type', label: 'Type of organisation *', required: true, type: 'select', options: ORG_TYPES, span: 'full', autoFocus: true },
            { name: 'organisation_type_other', label: 'Tell us more', placeholder: 'e.g. national association', span: 'full',
              requires: { field: 'organisation_type', equals: 'other' } },
            { name: 'company', label: 'Organisation name *', required: true, placeholder: 'Official club / league name', span: 'full' },
            { name: 'country', label: 'Country', placeholder: 'Country',
              suggest: ['United States', 'Mexico', 'Canada', 'Brazil', 'Argentina', 'Spain', 'England', 'Germany', 'France'] },
          ],
        },
        {
          fields: [
            { name: 'name', label: 'Your name *', required: true, placeholder: 'Eve Moneypenny', autoComplete: 'name' },
            { name: 'role', label: 'Your role *', required: true, placeholder: 'Commercial Director' },
            { name: 'email', label: 'Official organisation email *', required: true, type: 'email', placeholder: 'eve@officialclub.com', autoComplete: 'email',
              hint: 'Use the email at your organisation\'s official domain. This helps us verify eligibility.', span: 'full',
              /* Anchor the personal-domain test so subdomains like
                 ops.officialclub.com aren't false-positives. */
              validate: (v) => /@(gmail|yahoo|hotmail|outlook|icloud|me|live|aol|proton(mail)?)\.[a-z.]+$/i.test(v || '') ? 'Please use your organisation email, not a personal address.' : undefined },
            { name: 'phone', label: 'Phone (optional)', type: 'tel', placeholder: '+1 305…' },
            { name: 'message', label: 'Anything else?', type: 'textarea', rows: 3, span: 'full',
              placeholder: 'A line about why you\'re attending or what you\'d like to get out of the week.' },
          ],
        },
      ]}
    />
  )
}

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
              The world came for the World Cup.<br />
              <span style={{ color: '#E91E63' }}>The industry stays for Soccerex.</span>
            </h1>

            <div className="flex items-center gap-6 lg:gap-8 mb-8 flex-wrap">
              <div>
                <p className="miami-subhead mb-1" style={{ color: '#607186', fontSize: '10px' }}><MapPin size={12} className="inline mr-1" /> Venue</p>
                <p className="miami-headline" style={{ color: '#0D1B2A', fontSize: '1.05rem', letterSpacing: '0.04em' }}>Venue to be announced</p>
              </div>
              <div style={{ width: 7, height: 7, background: '#E91E63' }} />
              <div>
                <p className="miami-subhead mb-1" style={{ color: '#607186', fontSize: '10px' }}><Calendar size={12} className="inline mr-1" /> Date</p>
                <p className="miami-headline" style={{ color: '#0D1B2A', fontSize: '1.05rem', letterSpacing: '0.04em' }}>23-25 September 2026</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <a
                href="https://soccerexmiami2026.eventify.io/t2/tickets/"
                target="_blank"
                rel="noopener noreferrer"
                className="miami-pill-primary"
              >
                <Mail size={15} /> Buy Tickets
              </a>
              <a
                href="https://soccerexmiami2026.eventify.io/t2/tickets/79DF37"
                target="_blank"
                rel="noopener noreferrer"
                className="miami-pill-outline"
              >
                <Trophy size={15} /> Rightsholder Tickets
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
              <img src={`${IMG}/sections/miami-night.jpg`} alt="Miami at night" style={{ width: '100%', objectFit: 'cover', aspectRatio: '4/3', boxShadow: '0 24px 60px -28px rgba(13,27,42,0.45)' }} />
              <div className="absolute" style={{ left: -14, top: -14, width: 64, height: 64, background: 'var(--miami-sunset)', zIndex: -1, opacity: 0.9 }} />
              <div className="absolute" style={{ right: -14, bottom: -14, width: 96, height: 96, border: '2px solid #007C91', zIndex: -1 }} />
            </div>
            <div>
              <h2 className="miami-headline mb-5" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#0D1B2A' }}>
                What is <span style={{ color: '#E91E63' }}>Soccerex Miami</span>?
              </h2>
              <p className="miami-body leading-relaxed mb-4" style={{ fontSize: '1.05rem', color: '#1a2a3a' }}>
                Soccerex Miami is the flagship business platform for football across the Americas, bringing together clubs, leagues, federations, investors, brands, rightsholders, solution providers, and financial leaders at a defining moment for the game.
              </p>
              <p className="miami-body leading-relaxed mb-4" style={{ fontSize: '1.05rem', color: '#1a2a3a' }}>
                Across three days of world-class content, curated executive networking, brand activation, market insight, and dealmaking, Soccerex Miami creates the environment where relationships turn into partnerships and opportunities turn into closed business. Through Soccerex Deal Network, the event connects football decision-makers with capital, strategic partners, and the broader financial industry, helping drive commercial growth, investment, innovation, and measurable impact across the region.
              </p>
              <p className="miami-body leading-relaxed" style={{ fontSize: '1.05rem', color: '#1a2a3a' }}>
                In the wake of the 2026 FIFA World Cup, Soccerex Miami will be where the next chapter of football is shaped, funded, and accelerated.
              </p>
            </div>
          </div>

          <h3 className="miami-headline mb-6" style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', color: '#0D1B2A' }}>Three Days of Global Football Business, Dealmaking, and Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {THEMES.map((theme) => (
              <div key={theme} className="flex items-center gap-4 px-5 py-4" style={{ background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.08)' }}>
                <div style={{ width: 8, height: 8, background: 'var(--miami-sunset)', flexShrink: 0 }} />
                <span className="miami-body font-medium" style={{ fontSize: '0.95rem', color: '#0D1B2A' }}>{theme}</span>
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
            <p className="miami-kicker">Who's in the room</p>
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
          <p className="miami-kicker miami-kicker--pink">Built for the deal-makers</p>
          <h2 className="miami-headline mb-10" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#0D1B2A' }}>Why Attend?</h2>
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

      {/* ─── TICKETS + RIGHTS HOLDERS (dark for contrast) ──────────────── */}
      <section id="tickets" className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0D1B2A 0%, #102538 100%)', padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 miami-grid" style={{ opacity: 0.3 }} />
        <div className="relative z-10" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="flex justify-center mb-3">
            <span className="event-badge"><span className="event-badge-dot" /> Now on sale</span>
          </div>
          <h2 className="miami-headline text-center text-white mb-3" style={{ fontSize: 'clamp(1.8rem, 3.6vw, 2.6rem)' }}>
            Get your tickets to <span className="miami-text-gradient">Soccerex Miami</span>
          </h2>
          <p className="miami-body text-center text-white/70 mx-auto mb-10" style={{ maxWidth: '640px' }}>
            Tickets are live. Buy now to secure your place, or apply for a complimentary delegate pass if your organisation qualifies as a rightsholder.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--event-primary-border)', padding: 'clamp(24px, 3vw, 36px)' }}>
              <h3 className="miami-subhead text-white mb-2 flex items-center gap-2" style={{ fontSize: '1.05rem', letterSpacing: '0.1em' }}>
                <Mail size={18} style={{ color: 'var(--event-primary-light)' }} /> General Tickets
              </h3>
              <p className="miami-body text-white/65 text-sm mb-6">
                Open to all delegates: brands, agencies, investors, service providers, and football industry professionals.
              </p>
              <a
                href="https://soccerexmiami2026.eventify.io/t2/tickets/"
                target="_blank"
                rel="noopener noreferrer"
                className="miami-pill-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Buy Tickets <ArrowLeft size={15} style={{ transform: 'rotate(180deg)' }} />
              </a>
            </div>

            <div style={{ background: 'linear-gradient(145deg, var(--event-primary-bg), rgba(255,255,255,0.02))', border: '1px solid var(--event-primary-border)', padding: 'clamp(24px, 3vw, 36px)' }}>
              <h3 className="miami-subhead text-white mb-2 flex items-center gap-2" style={{ fontSize: '1.05rem', letterSpacing: '0.1em' }}>
                <Trophy size={18} style={{ color: 'var(--event-primary-light)' }} /> Rightsholders
              </h3>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4" style={{ background: 'var(--event-primary)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Complimentary pass
              </div>
              <p className="miami-body text-white/75 text-sm mb-5 leading-relaxed">
                Clubs, leagues, federations and national teams qualify for a complimentary delegate pass. Use the rightsholder link to register.
              </p>
              <a
                href="https://soccerexmiami2026.eventify.io/t2/tickets/79DF37"
                target="_blank"
                rel="noopener noreferrer"
                className="miami-pill-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Rightsholder Tickets <ArrowLeft size={15} style={{ transform: 'rotate(180deg)' }} />
              </a>
            </div>
          </div>

          {/* Other ways to be there — sponsorship & speaker pitches */}
          <div className="mt-12 pt-10 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}>
            <p className="miami-subhead mb-3" style={{ color: 'var(--event-primary-light)', fontSize: '11px' }}>Other ways to be there</p>
            <h3 className="miami-headline text-white mb-3" style={{ fontSize: 'clamp(1.4rem, 2.4vw, 1.8rem)' }}>
              Bring your brand.
            </h3>
            <p className="miami-body mx-auto mb-6 text-white/70" style={{ maxWidth: 560, fontSize: 14 }}>
              Partner with us or exhibit on the floor.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <InquiryModalButton
                kind="sponsorship-inquiry"
                label="Partner with Soccerex Miami"
                modalTitle="Partner with Soccerex Miami"
                eyebrow="Sponsorship & exhibition"
                intro="Tell us a little about your organisation and what you'd like to achieve. We'll send the right partnership pack."
                schema={sponsorshipSchema}
                extraPayload={{ event_slug: 'soccerex-miami-2026', source: 'miami-sponsor-cta' }}
                submitLabel="Send inquiry"
                successTitle="Inquiry received."
                successBody="A partnerships lead will follow up by email."
                buttonClassName="miami-pill-primary"
              />
              {/* "Speak in Miami" CTA removed per GN revisions doc. */}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
