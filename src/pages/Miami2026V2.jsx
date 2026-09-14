/*
 * Miami 2026, second version, unlisted at /miami-2026/v2.
 *
 * The live page's design system, marketing and structure, kept intact. What is
 * added is everything that has become true since it was written: the district and
 * its scale, the partners announced publicly, twelve speakers instead of eight,
 * and the campaign line Nu Stadium published with us.
 *
 * Linked from nowhere, out of the sitemap, served noindex.
 */
import { useEffect } from 'react'
import { ArrowLeft, ArrowRight, MapPin, Calendar, Mail, Trophy, Users, Briefcase, Star, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HOME, MIAMI_2026, MIAMI_2026_V2, MIAMI_2026_PRESS_RELEASE, ACCOMMODATIONS, SPONSOR, EXHIBIT, bookCallUrl, eventAgendaConcept } from '../lib/routes'
import PageMeta from '../components/PageMeta'
import InquiryModalButton from '../components/InquiryModalButton'
import DeadlineBanner from '../components/DeadlineBanner'
import LogoMarquee from '../components/LogoMarquee'
import TestimonialsSection from '../components/TestimonialsSection'
import SelectedSpeakers from '../components/SelectedSpeakers'
import { sponsorshipSchema, rightsholderSchema } from '../lib/leadSchemas'
import useScrollAnimations from '../lib/useScrollAnimations'

const MIAMI_EVENT_SLUG = 'soccerex-miami-2026'
const IMG = '/events/miami/2026'
const GFX = '/events/miami/2026/graphics'
const ICN = '/events/miami/2026/icons'
const V2  = '/events/miami/2026/v2'

// Designations are what the record actually supports, not what reads best.
// Concacaf and Greater Miami are announced official partners. Roc Nation is a
// confirmed exhibitor with a session of its own. Barcelona has a session and no
// event role, so it is billed as what it is: on the stage.
const PARTNER_LINK = {
  concacaf:  'https://www.concacaf.com',
  gmcvb:     'https://www.miamiandbeaches.com',
  rocnation: 'https://www.rocnation.com',
  barcelona: 'https://www.fcbarcelona.com',
}

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
  // Impact chip added per GN revisions doc: covers non-profits, foundations,
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

// Every figure verifiable from a public source: the venue's press material and
// the Miami Freedom Park development site.
const DISTRICT = [
  ['131', 'acre district'],
  ['26,700', 'seats, opened April 2026'],
  ['500K', 'sq ft retail & hospitality'],
  ['1M', 'sq ft office at full build'],
  ['58', 'acre public park'],
  ['2', 'minutes from MIA'],
]

// Announced publicly. Concacaf first: a strategic partnership with programming
// attached, not a logo placement.
const ANNOUNCED = [
  { name: 'Concacaf', file: 'concacaf.svg', note: 'Official partner. 41 member associations, headquartered here in Miami, with a flagship exhibition presence.' },
  { name: 'Greater Miami & Miami Beach', file: 'gmcvb-corp-logo-blue.png', note: 'Official partner, opening the city itself to the global football industry.' },
  { name: 'Roc Nation Sports', file: 'roc-nation-wordmark-black.png', note: 'Where sport, business and culture meet. On stage on day one.' },
  { name: 'FC Barcelona', file: 'fc-barcelona.svg', note: 'Founded 1899. On stage on day two.' },
]

const WHY_ATTEND = [
  { title: 'Everyone You Need, In One Place', desc: 'Two full days of sessions inside Nu Stadium with the clubs, leagues, federations, investors and brands you have spent the year trying to get an hour with, opening the night before at the VIP reception.' },
  { title: 'The World Cup Just Happened Here', desc: 'Miami hosted seven matches this summer, a quarterfinal and the bronze final among them. The commercial questions the tournament opened are still open, and this is where the industry works through them.' },
  { title: 'Meetings Booked Before Day One', desc: 'Soccerex Deal Network puts you in front of counterparties chosen for what you are actually trying to do, so your first day starts with a diary rather than a floor plan.' },
  { title: 'Capital In The Room', desc: 'Investors, funds and family offices come to Miami looking for football exposure. If you are raising, or selling, or building something that needs backing, they are here for three days.' },
]


const THEMES = [
  { title: 'The Global Football Economy', desc: 'Where the money is moving in the game right now, who is moving it, and what that means for your next deal.' },
  { title: 'Capital, Investment & Club Ownership', desc: 'What clubs are selling for, how multi club groups get put together, and who is buying next.' },
  { title: 'Soccerex Deal Network', desc: 'Meetings with counterparties who can actually transact, matched to what you are trying to do and set up before you land.' },
  { title: 'World Cup 2026 & Beyond', desc: 'What the tournament left behind in this region, and how to build a business on top of it.' },
  { title: 'Media, Content & Digital Revenue', desc: 'How rights are being sold now, what streaming has changed, and where the next revenue is coming from.' },
  { title: 'Stadiums, Venues & Host Cities', desc: 'What it costs to build one, what it gives back, and how a venue reshapes the city around it.' },
  { title: 'HerSoccerex', desc: 'Where the money is going in women\u2019s football, what it is buying, and who is getting there first.' },
  { title: 'Innovation, Impact & Future Growth', desc: 'The technology changing how clubs operate, and the community work that keeps them welcome in their own city.' },
]


const MIAMI_OG_IMG = '/events/miami/2026/sections/nu-stadium-miami-freedom-park.jpg'

// 87 verified confirmed rightsholders for Miami 2026 as of 2026-08-01.


export default function Miami2026V2() {
  // TestimonialsSection renders fade-up blocks; without this observer they sit
  // at opacity 0 and the section is a giant void (Joel's Aug 4 screenshot).
  useScrollAnimations()
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="event-page theme-miami" style={{ background: '#FFF8F4' }}>
      <PageMeta
        title="Soccerex Miami 2026 | Nu Stadium, 23-25 September"
        description="The global football business event returns to the Americas. Soccerex Miami 2026 at Nu Stadium brings together clubs, leagues, investors, brands, and innovators. 23-25 September 2026."
        image={MIAMI_OG_IMG}
        path={MIAMI_2026_V2}
        noindex
      />

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="miami-hero relative overflow-hidden">
        {/* Soft retro grid */}
        <div className="absolute inset-0 pointer-events-none miami-hero-grid" />

        {/* Sun behind the skyline */}
        <img src={`${GFX}/sun.svg`} alt="" aria-hidden className="miami-hero-sun" />

        {/* City skyline silhouette across the bottom */}
        <img src={`${GFX}/skyline.png`} alt="" aria-hidden className="miami-hero-skyline" />

        {/* Single palm on the right, so the left side stays clean and the logo reads */}
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
              The World Came for the World Cup.<br />
              <span style={{ color: '#E91E63' }}>The Industry Stays for Soccerex.</span>
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

            {/* One primary action; everything else holds equal, quiet weight.
                Row 1: the decisions. Row 2: a uniform utility grid. */}
            <div className="flex flex-wrap gap-3 items-center mb-4">
              <a
                href="https://soccerexmiami2026.eventify.io/t2/tickets/"
                target="_blank"
                rel="noopener noreferrer"
                className="miami-pill-primary"
              >
                <Mail size={15} /> Register Now
              </a>
              <InquiryModalButton
                kind="preregister"
                label="Apply for Rightsholder Pass"
                modalTitle="Apply for Rightsholder Pass"
                eyebrow="Complimentary pass"
                intro="Clubs, leagues, federations, national teams, competitions, and qualifying rightsholders may apply for a complimentary delegate pass to Soccerex Miami 2026."
                schema={rightsholderSchema}
                extraPayload={{
                  event_slug: 'miami-2026',
                  attendee_type: 'rights_holder',
                  interest: 'Complimentary rightsholder pass',
                  source: 'miami-2026-rightsholder-pass',
                  marketing_opt_in: true,
                }}
                submitLabel="Submit application"
                successTitle="Application received."
                successBody="Your application is under review. The Soccerex team will follow up by email to confirm eligibility."
                bookingUrl={bookCallUrl('success-miami-rightsholder')}
                buttonClassName="miami-pill-outline"
              >
                <Trophy size={15} /> Apply for Rightsholder Pass
              </InquiryModalButton>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" style={{ maxWidth: 640 }}>
              <a
                href="/events/miami/2026/selection-of-attendees.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="miami-cta-box"
              >
                Attendees (PDF)
              </a>
              <Link to={ACCOMMODATIONS} className="miami-cta-box">Travel &amp; Stay</Link>
              <Link to={SPONSOR} className="miami-cta-box">Sponsor</Link>
              <Link to={EXHIBIT} className="miami-cta-box">Exhibit</Link>
            </div>

            <Link
              to={MIAMI_2026_PRESS_RELEASE}
              className="inline-flex items-center gap-1.5 mt-4 miami-subhead"
              style={{ color: '#0D1B2A', fontSize: 12, letterSpacing: '0.12em', textDecoration: 'none', borderBottom: '2px solid #E91E63', paddingBottom: 2 }}
            >
              Read the announcement <ArrowRight size={13} />
            </Link>

            <div className="mt-5">
              <DeadlineBanner variant="general" />
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

            {/* Pillars strip, using the real brand icons */}
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
                CLUBS, RIGHTS AND CAPITAL, <span style={{ color: '#E91E63' }}>INSIDE NU STADIUM</span>
              </h2>
              <p className="miami-body leading-relaxed mb-4" style={{ fontSize: '1.05rem', color: '#1a2a3a' }}>
                Three days with the people who run the clubs, hold the rights, write the checks and build the technology the game now depends on, with the conference itself inside Nu Stadium.
              </p>
              <p className="miami-body leading-relaxed mb-4" style={{ fontSize: '1.05rem', color: '#1a2a3a' }}>
                It lands ten weeks after the World Cup, in the market the tournament just left. The people who ran it are on stage, the money that follows it is in the room, and Deal Network puts you in front of the ones you came for.
              </p>
              <p className="miami-body leading-relaxed" style={{ fontSize: '1.05rem', color: '#1a2a3a' }}>
                This is where football’s next chapter in the Americas is built, funded, and accelerated.
              </p>
            </div>
          </div>

          <h3 className="miami-headline mb-3" style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', color: '#0D1B2A' }}>Three Days Where Football Business Moves Forward</h3>
          <p className="miami-body leading-relaxed mb-6" style={{ fontSize: '1rem', color: '#3a4a5a', maxWidth: 760 }}>
            Eighteen published topics, three days, and one question behind all of them: where does the money in this game go next.
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


      {/* ─── THE VENUE, AT SCALE ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#0D1B2A', padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)' }}>
        <div className="relative" style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <h2 className="miami-headline mb-5" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#FFFFFF', maxWidth: 900, textWrap: 'balance' }}>
            THE INDUSTRY MEETS INSIDE THE <span style={{ color: '#00C6D7' }}>NEWEST STADIUM IN MLS</span>
          </h2>
          <p className="miami-body leading-relaxed mb-10" style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.78)', maxWidth: 760 }}>
            Nu Stadium opened this April as the home of Inter Miami CF, and most of the industry has still not been through the doors. Miami spent the summer hosting seven World Cup matches, a quarterfinal and the bronze final among them, and the city has not come down since. September puts you inside the newest building in the game while the attention is still here.
          </p>

          {/* Our own photography, already cleared and in production on the live page.
              The Miami Freedom Park aerial render is a Norm Li visualization owned by
              the developer: it is in the asset repo but stays off this page until the
              venue gives us written permission. */}
          <img src={`${IMG}/sections/nu-stadium-miami-freedom-park.jpg`} alt="Inside Nu Stadium on a matchday"
            style={{ width: '100%', objectFit: 'cover', aspectRatio: '16/9', boxShadow: '0 30px 80px -30px rgba(0,0,0,0.7)', marginBottom: 'clamp(28px,4vw,48px)' }} />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-8 gap-x-4">
            {DISTRICT.map(([n, l]) => (
              <div key={l}>
                <div className="event-stat-number" style={{ color: '#FFFFFF', fontSize: 'clamp(1.5rem,3vw,2.2rem)', lineHeight: 1 }}>{n}</div>
                <p className="miami-subhead mt-2" style={{ color: 'rgba(255,255,255,0.62)', fontSize: '10px', letterSpacing: '0.16em', lineHeight: 1.4 }}>{l.toUpperCase()}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-12">
            {['nu-stadium-exterior.jpg', 'miami-skyline.jpg', 'miami-night.jpg'].map((f) => (
              <img key={f} src={`${IMG}/sections/${f}`} alt="" aria-hidden loading="lazy"
                style={{ width: '100%', height: 200, objectFit: 'cover', opacity: 0.92 }} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── AGENDA CONCEPT (navy panel) ────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0D1B2A 0%, #102538 100%)', padding: 'clamp(64px,8vw,104px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 miami-grid" style={{ opacity: 0.3 }} />
        <div className="relative z-10 text-center" style={{ maxWidth: '880px', margin: '0 auto' }}>
          <h2 className="miami-headline text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)' }}>
            FROM INTER MIAMI'S PLAYBOOK TO <span className="miami-text-gradient">THE ROAD TO BRAZIL 2027</span>
          </h2>
          <p className="miami-body text-white/70 mx-auto mb-9" style={{ maxWidth: '660px' }}>
            Eighteen published topics shaping the Miami conversations, from Inter Miami&rsquo;s partnership model and the next decade of MLS to the road to Brazil 2027. Explore them online, or take the full concept with you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={eventAgendaConcept('soccerex-miami-2026')} className="miami-pill-primary">
              Explore the Agenda Concept <ArrowRight size={15} />
            </Link>
            <a href="/downloads/soccerex-miami-2026-agenda-concept.pdf" download className="miami-pill-outline">
              <FileText size={15} /> Download the PDF
            </a>
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
          <p className="miami-kicker miami-kicker--pink">FOUR REASONS TO BE HERE</p>
          <h2 className="miami-headline mb-10" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#0D1B2A' }}>
            Meet the People Who <span style={{ color: '#E91E63' }}>Run This Business</span>
          </h2>
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

      {/* Confirmed-attendee wall: taken down 2026-08-03 pending logo permissions
          from the listed organizations and a rendering fix. Re-enable by
          restoring the AttendeeWall block; consent lives in the admin
          per-event-role wall opt-in toggle. */}


      {/* ─── PARTNERS: one section each ──────────────────────────────────
          These are the four announced publicly. Each gets its own band rather
          than a logo tile, because a confederation of 41 member associations and
          a club founded in 1899 do not belong in the same 200px card.

          Logos: Roc Nation and Greater Miami came from the partners' own sites.
          Concacaf and Barcelona are set in type until we have their press-kit
          marks, because a trademarked crest lifted off Wikipedia is not cleared
          for a commercial page. */}

      {/* Concacaf */}
      <section className="relative overflow-hidden" style={{ background: '#FFFFFF', padding: 'clamp(72px,9vw,120px) clamp(24px,5vw,80px)' }}>
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center" style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div className="lg:col-span-5">
            <a href={PARTNER_LINK.concacaf} target="_blank" rel="noopener noreferrer" className="inline-block" aria-label="Concacaf, opens in a new tab">
              <img src={`${V2}/partners/concacaf.svg`} alt="Concacaf" style={{ height: 'clamp(120px,14vw,175px)', objectFit: 'contain' }} />
            </a>
            <p className="miami-kicker miami-kicker--pink mt-6">OFFICIAL PARTNER</p>
            <a href={PARTNER_LINK.concacaf} target="_blank" rel="noopener noreferrer"
              className="miami-subhead inline-flex items-center gap-1.5 mt-3" style={{ color: '#007C91', fontSize: '11px' }}>
              concacaf.com <ArrowRight size={12} />
            </a>
          </div>
          <div className="lg:col-span-7">
            <h2 className="miami-headline mb-5" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.3rem)', color: '#0D1B2A', textWrap: 'balance' }}>
              MEET THE CONFEDERATION, AND THE <span style={{ color: '#E91E63' }}>41 FEDERATIONS</span> BEHIND IT
            </h2>
            <p className="miami-body leading-relaxed mb-4" style={{ fontSize: '1.05rem', color: '#1a2a3a' }}>
              Concacaf brings its executives, its thinking and a flagship stand to Miami for the full run of the event. If your business needs a way into North America, Central America or the Caribbean, this is the shortest one you will find this year.
            </p>
            <p className="miami-body leading-relaxed" style={{ fontSize: '1.05rem', color: '#1a2a3a' }}>
              Its heads of commercial and finance take the stage, and the 41 member associations behind them are the market you are trying to reach.
            </p>
            <div className="flex flex-wrap gap-x-10 gap-y-4 mt-8">
              {[['41', 'MEMBER ASSOCIATIONS'], ['1', 'FLAGSHIP EXHIBITION'], ['MIAMI', 'HEADQUARTERS']].map(([n, l]) => (
                <div key={l}>
                  <div className="event-stat-number" style={{ color: '#007C91', fontSize: 'clamp(1.4rem,2.6vw,2rem)', lineHeight: 1 }}>{n}</div>
                  <p className="miami-subhead mt-1" style={{ color: '#607186', fontSize: '10px', letterSpacing: '0.16em' }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Roc Nation */}
      <section className="relative overflow-hidden" style={{ background: '#0D1B2A', padding: 'clamp(72px,9vw,120px) clamp(24px,5vw,80px)' }}>
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center" style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div className="lg:col-span-7 lg:order-2">
            <h2 className="miami-headline mb-5" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.3rem)', color: '#FFFFFF', textWrap: 'balance' }}>
              TAKE YOUR BRAND WHERE FOOTBALL AND <span style={{ color: '#E91E63' }}>CULTURE</span> ALREADY MEET
            </h2>
            <p className="miami-body leading-relaxed mb-4" style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.80)' }}>
              Roc Nation Sports represents the athletes and builds the partnerships that carry a club past its own supporters. Their team is on stage on day one and on the exhibition floor alongside it.
            </p>
            <p className="miami-body leading-relaxed" style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.80)' }}>
              Bring them the brand, the rights or the roster you are trying to move, in the city where football and culture already share an audience.
            </p>
          </div>
          <div className="lg:col-span-5 lg:order-1">
            <a href={PARTNER_LINK.rocnation} target="_blank" rel="noopener noreferrer" aria-label="Roc Nation, opens in a new tab"
              style={{ background: '#FFFFFF', padding: 'clamp(28px,4vw,44px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={`${V2}/partners/roc-nation-wordmark-black.png`} alt="Roc Nation Sports" style={{ width: '100%', maxWidth: 300, objectFit: 'contain' }} />
            </a>
            <p className="miami-kicker mt-6" style={{ color: '#00C6D7' }}>EXHIBITOR &amp; SPEAKER</p>
            <a href={PARTNER_LINK.rocnation} target="_blank" rel="noopener noreferrer"
              className="miami-subhead inline-flex items-center gap-1.5 mt-3" style={{ color: '#00C6D7', fontSize: '11px' }}>
              rocnation.com <ArrowRight size={12} />
            </a>
          </div>
        </div>
      </section>

      {/* Greater Miami & Miami Beach */}
      <section className="relative overflow-hidden" style={{ background: '#FFF8F4', padding: 'clamp(72px,9vw,120px) clamp(24px,5vw,80px)' }}>
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center" style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div className="lg:col-span-5">
            <a href={PARTNER_LINK.gmcvb} target="_blank" rel="noopener noreferrer" className="inline-block" aria-label="Greater Miami and Miami Beach, opens in a new tab">
              <img src={`${V2}/partners/gmcvb-corp-logo-blue.png`} alt="Greater Miami Convention &amp; Visitors Bureau" style={{ width: '100%', maxWidth: 320, objectFit: 'contain' }} />
            </a>
            <p className="miami-kicker miami-kicker--pink mt-6">OFFICIAL PARTNER</p>
            <a href={PARTNER_LINK.gmcvb} target="_blank" rel="noopener noreferrer"
              className="miami-subhead inline-flex items-center gap-1.5 mt-3" style={{ color: '#007C91', fontSize: '11px' }}>
              miamiandbeaches.com <ArrowRight size={12} />
            </a>
          </div>
          <div className="lg:col-span-7">
            <h2 className="miami-headline mb-5" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.3rem)', color: '#0D1B2A', textWrap: 'balance' }}>
              THE WHOLE CITY IS <span style={{ color: '#E91E63' }}>PART OF YOUR THREE DAYS</span>
            </h2>
            <p className="miami-body leading-relaxed mb-4" style={{ fontSize: '1.05rem', color: '#1a2a3a' }}>
              With the Greater Miami Convention &amp; Visitors Bureau as an official partner, the destination works for you as hard as the agenda does: where to stay, where to take a meeting, and where the industry ends up once the sessions finish.
            </p>
            <p className="miami-body leading-relaxed" style={{ fontSize: '1.05rem', color: '#1a2a3a' }}>
              Miami has spent a decade becoming one of the most important crossroads in the world game. For three days in September it is the room you want to be in.
            </p>
          </div>
        </div>
      </section>

      {/* FC Barcelona */}
      <section className="relative overflow-hidden" style={{ background: '#FFFFFF', padding: 'clamp(72px,9vw,120px) clamp(24px,5vw,80px)' }}>
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center" style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div className="lg:col-span-7 lg:order-2">
            <h2 className="miami-headline mb-5" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.3rem)', color: '#0D1B2A', textWrap: 'balance' }}>
              HEAR HOW <span style={{ color: '#E91E63' }}>BARCELONA</span> BUILDS A GLOBAL BUSINESS
            </h2>
            <p className="miami-body leading-relaxed mb-4" style={{ fontSize: '1.05rem', color: '#1a2a3a' }}>
              Barcelona's commercial decisions get studied by every club that wants to grow beyond its own market. On day two they explain how they make them.
            </p>
            <p className="miami-body leading-relaxed" style={{ fontSize: '1.05rem', color: '#1a2a3a' }}>
              They share the day with Club America, AFA, Bundesliga, MLS and Inter Miami, so you can compare five approaches to the same problem in a single afternoon.
            </p>
          </div>
          <div className="lg:col-span-5 lg:order-1 flex flex-col items-center">
            <a href={PARTNER_LINK.barcelona} target="_blank" rel="noopener noreferrer" aria-label="FC Barcelona, opens in a new tab">
              <img src={`${V2}/partners/fc-barcelona.svg`} alt="FC Barcelona" style={{ width: '100%', maxWidth: 240, objectFit: 'contain' }} />
            </a>
            <p className="miami-kicker miami-kicker--pink mt-6">ON STAGE, DAY TWO</p>
            <a href={PARTNER_LINK.barcelona} target="_blank" rel="noopener noreferrer"
              className="miami-subhead inline-flex items-center gap-1.5 mt-3" style={{ color: '#007C91', fontSize: '11px' }}>
              fcbarcelona.com <ArrowRight size={12} />
            </a>
          </div>
        </div>
      </section>

      {/* ─── SELECTED SPEAKERS ───────────────────────────────────────────
          Answers "who is actually going to be there" right after the case for
          attending. Ranked by the events desk's running order, so the section
          re-orders itself as the lineup firms up. */}
      <SelectedSpeakers slug={MIAMI_EVENT_SLUG} limit={12} />

      <TestimonialsSection background="#FFFFFF" />

      <hr className="miami-divider" aria-hidden style={{ margin: '0 auto' }} />

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
                Full conference access: every session, the exhibition floor, the networking, and Deal Network matching if you want meetings arranged before you arrive.
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
                intro="Tell us a little about your organization and what you'd like to achieve. We'll send the right partnership pack."
                schema={sponsorshipSchema}
                extraPayload={{ event_slug: 'soccerex-miami-2026', source: 'miami-registration-partnership' }}
                submitLabel="Send inquiry"
                successTitle="Inquiry received."
                successBody="A partnerships lead will follow up by email."
                bookingUrl={bookCallUrl('success-miami-partnership')}
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
              <InquiryModalButton
                kind="preregister"
                label="Apply for Rightsholder Pass"
                modalTitle="Apply for Rightsholder Pass"
                eyebrow="Complimentary pass"
                intro="Clubs, leagues, federations, national teams, competitions, and qualifying rightsholders may apply for a complimentary delegate pass to Soccerex Miami 2026."
                schema={rightsholderSchema}
                extraPayload={{
                  event_slug: 'miami-2026',
                  attendee_type: 'rights_holder',
                  interest: 'Complimentary rightsholder pass',
                  source: 'miami-2026-rightsholder-pass',
                  marketing_opt_in: true,
                }}
                submitLabel="Submit application"
                successTitle="Application received."
                successBody="Your application is under review. The Soccerex team will follow up by email to confirm eligibility."
                bookingUrl={bookCallUrl('success-miami-rightsholder')}
                buttonClassName="miami-pill-primary"
                buttonStyle={{ width: '100%', justifyContent: 'center' }}
              >
                Apply for Rightsholder Pass <ArrowLeft size={15} style={{ transform: 'rotate(180deg)' }} />
              </InquiryModalButton>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
