/*
 * The Miami 2026 page, served at /miami-2026 and still reachable at /miami-2026/v2
 * for links already shared.
 *
 * It keeps the previous page's design system, marketing and structure, and adds
 * everything that has become true since: the district and its scale, the partners
 * announced publicly, twelve speakers instead of eight, the campaign line Nu Stadium
 * published with us, and the agenda itself, live from the API right under the hero.
 */
import { useEffect } from 'react'
import { ArrowLeft, ArrowRight, MapPin, Calendar, Mail, Trophy, Users, Briefcase, Star, FileText, Check, X, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HOME, MIAMI_2026, MIAMI_2026_V2, MIAMI_2026_ATTENDEE_GUIDE, MIAMI_2026_PRESS_RELEASE, ACCOMMODATIONS, SPONSOR, EXHIBIT, DEAL_NETWORK, REFUND_POLICY, bookCallUrl, eventAgenda } from '../lib/routes'
import PageMeta from '../components/PageMeta'
import { pageMeta } from '../lib/pageMeta'
import InquiryModalButton from '../components/InquiryModalButton'
import DeadlineBanner from '../components/DeadlineBanner'
import BrandWall from '../components/BrandWall'
import TestimonialsSection from '../components/TestimonialsSection'
import SelectedSpeakers from '../components/SelectedSpeakers'
import AgendaHighlight from '../components/AgendaHighlight'
import { rightsholderSchema } from '../lib/leadSchemas'
import useScrollAnimations from '../lib/useScrollAnimations'

const MIAMI_EVENT_SLUG = 'soccerex-miami-2026'
const IMG = '/events/miami/2026'
const GFX = '/events/miami/2026/graphics'
const ICN = '/events/miami/2026/icons'
const V2  = '/events/miami/2026/v2'

// The partners announced publicly. Garrett's note on the old layout was that four
// full-width bands made the partner list look thin, not that the partners should
// come down, so they run as one row of cards above the wall of everyone else.
// Flip SHOW_FEATURED_PARTNERS to false to take the row off the page without
// touching anything else. SPORTFIVE is always written in capitals, at the
// agency's request.
const SHOW_FEATURED_PARTNERS = true

const FEATURED_PARTNERS = [
  { name: 'Concacaf', file: 'concacaf.svg', href: 'https://www.concacaf.com', role: 'Official partner', mark: 'crest',
    note: 'The confederation and its 41 member associations, headquartered here in Miami, with executives on stage and a flagship stand on the floor.' },
  { name: 'Greater Miami & Miami Beach', file: 'gmcvb-corporate-aubergine.png', href: 'https://www.miamiandbeaches.com', role: 'Official partner', mark: 'wordmark',
    note: 'The destination itself works for you as hard as the agenda does: where to stay, where to take a meeting, where the industry ends up after hours.' },
  { name: 'Roc Nation Sports', file: 'roc-nation-wordmark-black.png', href: 'https://www.rocnation.com', role: 'Exhibitor and speaker', mark: 'wordmark',
    note: 'Bring them the brand, the rights or the roster you are trying to move. They are on stage on day one and on the floor alongside it.' },
  { name: 'FC Barcelona', file: 'fc-barcelona.svg', href: 'https://www.fcbarcelona.com', role: 'On stage, day two', mark: 'crest',
    note: 'How a club founded in 1899 makes the commercial decisions every other club studies. They explain them on day two.' },
  { name: 'SPORTFIVE', file: 'sportfive.svg', href: 'https://sportfive.com', role: 'Partner', mark: 'wordmark',
    note: 'The sports marketing agency building partnerships for brands, rightsholders and media platforms. Talk to them about selling your rights or finding the right property for your brand.' },
]

// Miami 2026's own sponsors and exhibitors, the five we hold artwork for out of
// forty on the floor. They lead the first row of the wall. Add the rest here as
// the logo pack comes in.
const MIAMI_BRANDS = [
  { src: '/images/global-network/FC_Barcelona_crest_svg_1.png', alt: 'FC Barcelona' },
  { src: '/images/global-network/logo_Miami_FC_2_copy_1.png', alt: 'Miami FC' },
  { src: '/images/sponsors/sports-com.webp', alt: 'Sports.com' },
  { src: '/images/sponsors/sun-global.png', alt: 'Sun Global Transportation' },
  { src: '/images/global-network/Concacaf_1.png', alt: 'Concacaf' },
]



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

// Theme descriptions written by Garrett, September 15, 2026. Order set by Joel the same night:
// HerSoccerex second, impact high on the list rather than last.
const THEMES = [
  { title: 'The Global Football Economy', desc: 'Hear from the leaders shaping football\u2019s global business, with insights into the markets, partnerships and commercial opportunities driving its next chapter.' },
  { title: 'HerSoccerex', desc: 'Champion women across football through leadership, investment and collaboration, creating meaningful opportunities to connect, lead and shape the future of the sport.' },
  { title: 'Capital, Investment & Club Ownership', desc: 'Connect with investors, club owners and financial leaders to explore acquisitions, ownership strategies and the capital powering football\u2019s growth.' },
  { title: 'Innovation, Impact & Future Growth', desc: 'Meet the ideas and people advancing football through technology, youth development and community impact, building a stronger game on and off the pitch.' },
  { title: 'Soccerex Deal Network', desc: 'Turn connections into opportunity through curated introductions and meetings that bring clubs, investors, brands and rightsholders together to move business forward.' },
  { title: 'World Cup 2026 & Beyond', desc: 'Explore how football can translate the World Cup\u2019s momentum into lasting investment, stronger partnerships and sustained growth across the Americas.' },
  { title: 'Media, Content & Digital Revenue', desc: 'Discover how media rights, original content and digital platforms are helping football reach new audiences, deepen fan relationships and grow revenue.' },
  { title: 'Stadiums, Venues & Host Cities', desc: 'Explore how stadiums and major events can generate year-round revenue, attract investment and create lasting value for clubs, cities and communities.' },
]


const TICKETS_URL = 'https://soccerexmiami2026.eventify.io/t2/tickets/'

// Today's public prices from the ticket shop. Soccerex prices dynamically and
// today's price is always the lowest one on offer, so these only ever move up:
// change them here when the shop does. Never shown struck through against a
// "was" price, because neither pass has been sold at any higher figure.
const PASSES = [
  { slug: 'delegate', name: 'Delegate Pass', price: '$295' },
  { slug: 'vip', name: 'VIP Pass', price: '$595', featured: true },
]

// One list for both passes, taken from the ticket shop's own inclusions, except the
// Soccerex Social Evening: it is open to every pass holder, though the shop lists it
// under VIP only. What a pass lacks stays visible and dimmed.
const PASS_INCLUSIONS = [
  { label: 'Every session inside Nu Stadium, September 24 and 25', tiers: ['delegate', 'vip'] },
  { label: 'The exhibition hall and the Studio area', tiers: ['delegate', 'vip'] },
  { label: 'The networking lounge', tiers: ['delegate', 'vip'] },
  { label: 'The event app, before and after the event', tiers: ['delegate', 'vip'] },
  { label: 'The Soccerex Social Evening', tiers: ['delegate', 'vip'] },
  { label: 'The VIP lounge, with catering included', tiers: ['vip'] },
  { label: 'The VIP reception on September 23', tiers: ['vip'] },
]

const RIGHTSHOLDER_MODAL = {
  kind: 'preregister',
  label: 'Apply for a Complimentary Pass',
  modalTitle: 'Apply for Rightsholder Pass',
  eyebrow: 'Complimentary pass',
  intro: 'Clubs, leagues, federations, national teams, competitions, and qualifying rightsholders may apply for a complimentary delegate pass to Soccerex Miami 2026.',
  schema: rightsholderSchema,
  extraPayload: {
    event_slug: 'miami-2026',
    attendee_type: 'rights_holder',
    interest: 'Complimentary rightsholder pass',
    source: 'miami-2026-v2-passes',
    marketing_opt_in: true,
  },
  submitLabel: 'Submit application',
  successTitle: 'Application received.',
  successBody: 'Your application is under review. The Soccerex team will follow up by email to confirm eligibility.',
  bookingUrl: bookCallUrl('success-miami-rightsholder'),
}

// Every answer is one the event can stand behind: dates from the agenda, terms
// from the refund policy, the room block from Travel and Stay.
const FAQ_LINK = { color: '#007C91', fontWeight: 600, textDecoration: 'underline' }
const FAQS = [
  {
    q: 'When and where is Soccerex Miami 2026?',
    a: <>The VIP reception opens the event on the evening of September 23. Sessions run on September 24 and 25 inside Nu Stadium at Miami Freedom Park, two minutes from Miami International Airport. The <Link to={MIAMI_2026_ATTENDEE_GUIDE} style={FAQ_LINK}>attendee guide</Link> covers parking, getting in and what is on each day.</>,
  },
  {
    q: 'Who comes to Soccerex Miami?',
    a: <>Soccerex Miami brings together the people running the commercial side of football across the Americas: clubs, leagues and federations, along with the investors and brands who do business with them.</>,
  },
  {
    q: 'What is the difference between a Delegate and a VIP pass?',
    a: <>Both passes cover every session, the exhibition hall and the networking lounge on both days, plus the Soccerex Social Evening. VIP adds the VIP reception on September 23 and a catered VIP lounge to use between sessions.</>,
  },
  {
    q: 'Will the price go up?',
    a: <>Soccerex uses dynamic pricing, so today&rsquo;s price is the lowest price you will see for each pass.</>,
  },
  {
    q: 'Can clubs, leagues and federations get a complimentary pass?',
    a: <>Yes. Clubs, leagues, federations and other rightsholders can <a href="#passes" style={FAQ_LINK}>apply for a complimentary delegate pass</a>, and the team confirms eligibility by email.</>,
  },
  {
    q: 'Can I get a refund if my plans change?',
    a: <>All registrations are final. You can move the full value of your pass to a future Soccerex event by emailing <a href="mailto:registrations@soccerex.com" style={FAQ_LINK}>registrations@soccerex.com</a> at least seven days before the event, as the <Link to={REFUND_POLICY} style={FAQ_LINK}>refund policy</Link> sets out.</>,
  },
  {
    q: 'Can I set up meetings before I arrive?',
    a: <><Link to={DEAL_NETWORK} style={FAQ_LINK}>Soccerex Deal Network</Link> matches you with counterparties chosen for what you are trying to do, so you can arrive with meetings already in your calendar.</>,
  },
  {
    q: 'Where should I stay?',
    a: <>Soccerex holds an official room block covering September 22 to 26, and rooms in it are limited. <Link to={ACCOMMODATIONS} style={FAQ_LINK}>Travel and Stay</Link> has the hotel details, rates and booking links.</>,
  },
  {
    q: 'Can I register a group, sponsor or exhibit?',
    a: <>Yes. <a href={bookCallUrl('miami-v2-faq')} style={FAQ_LINK}>Book a call</a> with the Soccerex team to register a group, or see the <Link to={SPONSOR} style={FAQ_LINK}>sponsor</Link> and <Link to={EXHIBIT} style={FAQ_LINK}>exhibit</Link> options.</>,
  },
]


// 87 verified confirmed rightsholders for Miami 2026 as of 2026-08-01.


export default function Miami2026V2() {
  // TestimonialsSection renders fade-up blocks; without this observer they sit
  // at opacity 0 and the section is a giant void (Joel's Aug 4 screenshot).
  useScrollAnimations()
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="event-page theme-miami" style={{ background: '#FFF8F4' }}>
      <PageMeta {...pageMeta(MIAMI_2026)} />

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
            <h1 className="miami-headline mt-7 mb-4" style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2rem)', color: '#0D1B2A', lineHeight: 1.15, letterSpacing: '0.01em', maxWidth: '640px' }}>
              Three Days of Access to{' '}
              <span style={{ color: '#E91E63' }}>the People Who Run Football in the Americas</span>
            </h1>
            <p className="miami-body mb-8" style={{ fontSize: 'clamp(0.98rem, 1.2vw, 1.08rem)', color: '#3a4a5a', lineHeight: 1.6, maxWidth: '600px' }}>
              Soccerex Miami brings the clubs, leagues, investors and brands shaping the game into one room at Nu Stadium, ten weeks after the World Cup.
            </p>

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
              <a href="#passes" className="miami-pill-primary">
                Get Your Pass <ArrowRight size={15} />
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
              <Link to={eventAgenda(MIAMI_EVENT_SLUG)} className="miami-pill-outline">
                <Calendar size={15} /> See the Agenda
              </Link>
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
                { num: '70+', label: 'Speakers' },
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

      {/* ─── THE AGENDA ──────────────────────────────────────────────────
          First thing under the hero: the published running order, live from the
          agenda API, because the agenda is what people arrive for now that it is
          out in public. */}
      <AgendaHighlight slug={MIAMI_EVENT_SLUG} />

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
                Get Ahead of the Business <span style={{ color: '#E91E63' }}>the World Cup Left Behind</span>
              </h2>
              <p className="miami-body leading-relaxed mb-4" style={{ fontSize: '1.05rem', color: '#1a2a3a' }}>
                Soccerex Miami lands ten weeks after the World Cup, in the market the tournament just left. The people who ran it are on stage, the money that follows it is in the room, and Deal Network puts you in front of the ones you came for.
              </p>
              <p className="miami-body leading-relaxed" style={{ fontSize: '1.05rem', color: '#1a2a3a' }}>
                You spend three days with the people who run the clubs, hold the rights, write the checks and build the technology the game now depends on, all inside Nu Stadium.
              </p>
            </div>
          </div>

          <h3 className="miami-headline mb-3" style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', color: '#0D1B2A' }}>Find Out Where the Money in Football Goes Next</h3>
          <p className="miami-body leading-relaxed mb-6" style={{ fontSize: '1rem', color: '#3a4a5a', maxWidth: 760 }}>
            Eight themes run across the two days on stage, with one question behind all of them: where the money in this game goes next.
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


      {/* ─── PASSES ──────────────────────────────────────────────────────
          Price and value side by side, two scrolls in, so nobody has to leave
          the page to find out what a pass costs or what it buys. Both cards show
          the same list, with what Delegate lacks dimmed rather than removed. */}
      {/* The closing CTA that used to carry id="tickets" is gone, so the anchor
          moves here: any #tickets link already out in the world lands on the passes. */}
      <span id="tickets" aria-hidden style={{ display: 'block', scrollMarginTop: 80 }} />
      <section id="passes" className="relative overflow-hidden" style={{ background: '#FFF8F4', padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)', scrollMarginTop: 80 }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <h2 className="miami-headline text-center mb-4" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#0D1B2A', textWrap: 'balance' }}>
            Pick the Pass That Fits <span style={{ color: '#E91E63' }}>Your Three Days in Miami</span>
          </h2>
          <p className="miami-body text-center mx-auto mb-6" style={{ fontSize: '1.05rem', color: '#3a4a5a', maxWidth: 680, lineHeight: 1.6 }}>
            Both passes put you inside Nu Stadium for every session on September 24 and 25, and into the Soccerex Social Evening. VIP adds the VIP reception on September 23 and a catered lounge to meet in between sessions.
          </p>
          <div className="flex justify-center mb-10">
            <span className="miami-subhead inline-flex items-center gap-2" style={{ fontSize: 12, letterSpacing: '0.12em', color: '#0D1B2A', background: '#FFFFFF', border: '1px solid rgba(233,30,99,0.35)', padding: '9px 15px' }}>
              <span style={{ width: 7, height: 7, background: '#E91E63', flexShrink: 0 }} /> Today&rsquo;s price is the lowest price you will see
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PASSES.map((pass) => (
              <div key={pass.slug} style={{
                background: '#FFFFFF',
                border: pass.featured ? '2px solid #E91E63' : '1px solid rgba(13,27,42,0.14)',
                boxShadow: pass.featured ? '0 26px 60px -32px rgba(233,30,99,0.5)' : '0 18px 40px -30px rgba(13,27,42,0.35)',
                padding: 'clamp(24px,3vw,36px)', display: 'flex', flexDirection: 'column',
              }}>
                <h3 className="miami-headline mb-4" style={{ fontSize: '1.5rem', color: '#0D1B2A' }}>{pass.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="miami-subhead" style={{ fontSize: 12, letterSpacing: '0.14em', color: '#E91E63' }}>Today</span>
                  <span className="miami-headline" style={{ fontSize: 'clamp(2.2rem, 4vw, 2.8rem)', color: '#0D1B2A', lineHeight: 1 }}>{pass.price}</span>
                </div>
                <p className="miami-body mt-1 mb-6" style={{ fontSize: '0.8rem', color: '#8a97a4' }}>All charges included</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'grid', gap: 11, flex: 1 }}>
                  {PASS_INCLUSIONS.map((item) => {
                    const included = item.tiers.includes(pass.slug)
                    return (
                      <li key={item.label} className="flex items-start gap-3" style={{ opacity: included ? 1 : 0.4 }}>
                        {included
                          ? <Check size={17} aria-label="Included" style={{ color: '#007C91', flexShrink: 0, marginTop: 2 }} />
                          : <X size={17} aria-label="Not included" style={{ color: '#8a97a4', flexShrink: 0, marginTop: 2 }} />}
                        <span className="miami-body" style={{ fontSize: '0.92rem', color: '#1a2a3a', lineHeight: 1.45 }}>{item.label}</span>
                      </li>
                    )
                  })}
                </ul>
                <a href={TICKETS_URL} target="_blank" rel="noopener noreferrer" className="miami-pill-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Get Your {pass.name} <ArrowRight size={15} />
                </a>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div style={{ background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.14)', padding: 'clamp(20px,2.6vw,28px)' }}>
              <h3 className="miami-subhead mb-2" style={{ fontSize: '1.05rem', color: '#0D1B2A', letterSpacing: '0.06em' }}>Represent a club, league or federation?</h3>
              <p className="miami-body mb-5" style={{ fontSize: '0.92rem', color: '#3a4a5a', lineHeight: 1.55 }}>
                Rightsholders can apply for a complimentary delegate pass, and the team confirms eligibility by email.
              </p>
              <InquiryModalButton {...RIGHTSHOLDER_MODAL} buttonClassName="miami-pill-outline">
                <Trophy size={15} /> Apply for a Complimentary Pass
              </InquiryModalButton>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.14)', padding: 'clamp(20px,2.6vw,28px)' }}>
              <h3 className="miami-subhead mb-2" style={{ fontSize: '1.05rem', color: '#0D1B2A', letterSpacing: '0.06em' }}>Bringing a team or a brand?</h3>
              <p className="miami-body mb-5" style={{ fontSize: '0.92rem', color: '#3a4a5a', lineHeight: 1.55 }}>
                Talk to the Soccerex team about registering a group, sponsoring or exhibiting.
              </p>
              <a href={bookCallUrl('miami-v2-passes')} className="miami-pill-outline">
                <Briefcase size={15} /> Book a Call
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── THE VENUE, AT SCALE ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#0D1B2A', padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)' }}>
        <div className="relative" style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <h2 className="miami-headline mb-5" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#FFFFFF', maxWidth: 900, textWrap: 'balance' }}>
            Take Your Meetings Inside <span style={{ color: '#00C6D7' }}>the Newest Stadium in Major League Soccer</span>
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

      {/* ─── ECOSYSTEM (crisp white) ────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#FAFBFC', padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div className="text-center mb-12 flex flex-col items-center">
            <h2 className="miami-headline" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#0D1B2A', textWrap: 'balance' }}>
              Your Counterparts From <span className="miami-text-gradient">Across the Game</span> Will Be in the Room
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {ECOSYSTEM_BRAND.map(({ label, icon }) => (
              /* Impact is the eleventh of ten, so it takes the last row whole
                 rather than sitting alone in the first column of an empty one. */
              <div key={label} className={label === 'Impact' ? 'miami-cell-light col-span-2 sm:col-span-3 md:col-span-5' : 'miami-cell-light'}>
                <img src={`${ICN}/${icon}.svg`} alt="" aria-hidden style={{ width: 40, height: 40, margin: '0 auto 12px', display: 'block' }} />
                <p className="miami-subhead" style={{ color: '#0D1B2A', fontSize: '11px' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOCCEREX IMPACT ─────────────────────────────────────────────
          Sits directly under the Impact cell in the grid above, so the word
          lands and then the proof of it does. Artwork is cut from the
          Community Impact Event flyer. */}
      <section className="relative overflow-hidden" style={{ background: '#FFF8F4', padding: 'clamp(76px,9vw,124px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center" style={{ gap: 'clamp(28px,4vw,56px)' }}>
            <div className="lg:col-span-6">
              <img
                src={`${IMG}/impact/community-impact.jpg`}
                alt="Three young players in Bigger Than A Game shirts, arms around each other, looking out at the Miami skyline"
                style={{ width: '100%', height: 'auto', display: 'block' }}
                loading="lazy"
              />
            </div>

            <div className="lg:col-span-6">
              <h2 className="miami-headline" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#0D1B2A', textWrap: 'balance' }}>
                Soccerex Impact Is <span className="miami-text-gradient">Stronger Than Ever</span> This Year
              </h2>
              <p className="miami-body leading-relaxed mt-5" style={{ fontSize: '1.05rem', color: '#1a2a3a' }}>
                The week opens with the Community Impact Event on the mini fields at Nu Stadium, an afternoon
                for young players from across Miami and the organizations that coach them.
              </p>
              <p className="miami-body leading-relaxed mt-4" style={{ fontSize: '1.05rem', color: '#1a2a3a' }}>
                Dagrosa Capital Partners leads it, and clubs, charities and local brands from across the city
                are behind it.
              </p>

              <dl className="flex flex-wrap" style={{ gap: 'clamp(20px,3vw,40px)', marginTop: 'clamp(24px,3vw,34px)' }}>
                {[
                  ['DATE', 'Wednesday, September 23, 2026'],
                  ['TIME', '3:00 PM to 6:00 PM'],
                  ['WHERE', 'Nu Stadium, mini fields area'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="miami-subhead" style={{ fontSize: 10, letterSpacing: '0.16em', color: '#607186' }}>{label}</dt>
                    <dd className="miami-body" style={{ fontSize: '0.95rem', color: '#0D1B2A', marginTop: 4 }}>{value}</dd>
                  </div>
                ))}
              </dl>

              <p className="miami-subhead" style={{ fontSize: 12, letterSpacing: '0.14em', color: '#E91E63', marginTop: 'clamp(24px,3vw,32px)' }}>
                WHEN COMMUNITIES WIN, WE ALL WIN
              </p>
            </div>
          </div>

          <div style={{ marginTop: 'clamp(40px,5vw,64px)', paddingTop: 'clamp(28px,3.5vw,40px)', borderTop: '1px solid rgba(13,27,42,0.10)' }}>
            <img
              src={`${IMG}/impact/dagrosa-capital-partners.png`}
              alt="Dagrosa Capital Partners"
              style={{ height: 'clamp(38px,4.4vw,54px)', width: 'auto', display: 'block', margin: '0 auto clamp(22px,2.6vw,32px)' }}
              loading="lazy"
            />
            <img
              src={`${IMG}/impact/impact-partners.png`}
              alt="The organizations and brands supporting the Community Impact Event"
              style={{ width: '100%', maxWidth: 1030, height: 'auto', display: 'block', margin: '0 auto' }}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Brand divider */}
      <hr className="miami-divider" aria-hidden style={{ margin: '0 auto' }} />

      {/* Confirmed-attendee wall: taken down 2026-08-03 pending logo permissions
          from the listed organizations and a rendering fix. Re-enable by
          restoring the AttendeeWall block; consent lives in the admin
          per-event-role wall opt-in toggle. */}


      {/* ─── FEATURED PARTNERS ───────────────────────────────────────────
          One row of cards directly above the wall: the announced partners read
          as a lineup rather than separate bands. */}
      {SHOW_FEATURED_PARTNERS && (
        <section className="relative overflow-hidden" style={{ background: '#FFFFFF', padding: 'clamp(72px,9vw,120px) clamp(24px,5vw,80px)' }}>
          <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
            <style>{`
              .miami-featured-row { --fp-gap: clamp(16px,1.6vw,22px); display: flex; flex-wrap: wrap; justify-content: center; gap: var(--fp-gap); }
              .miami-featured-card { width: 100%; }
              @media (min-width: 640px)  { .miami-featured-card { width: calc((100% - var(--fp-gap)) / 2 - 1px); } }
              @media (min-width: 1024px) { .miami-featured-card { width: calc((100% - 2 * var(--fp-gap)) / 3 - 1px); } }
              @media (min-width: 1280px) { .miami-featured-card { width: calc((100% - 4 * var(--fp-gap)) / 5 - 1px); } }
            `}</style>
            <div className="text-center" style={{ marginBottom: 'clamp(32px,4vw,48px)' }}>
              <h2 className="miami-headline" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#0D1B2A', textWrap: 'balance' }}>
                Featured <span className="miami-text-gradient">Partners</span>
              </h2>
            </div>

            <div className="miami-featured-row">
              {FEATURED_PARTNERS.map((partner) => (
                <a key={partner.name} href={partner.href} target="_blank" rel="noopener noreferrer"
                  className="miami-card-light miami-featured-card flex flex-col"
                  style={{ textDecoration: 'none', padding: 'clamp(20px,2vw,26px)' }}
                  aria-label={`${partner.name}, opens in a new tab`}
                >
                  <div className="flex items-center justify-center" style={{ height: 86, marginBottom: 20 }}>
                    <img src={`${V2}/partners/${partner.file}`} alt={partner.name}
                      style={partner.mark === 'crest'
                        ? { maxHeight: 68, maxWidth: '70%', objectFit: 'contain' }
                        : { maxHeight: 44, maxWidth: '100%', objectFit: 'contain' }} />
                  </div>
                  <p className="miami-subhead" style={{ fontSize: 10, letterSpacing: '0.16em', color: '#007C91', marginBottom: 10 }}>
                    {partner.role.toUpperCase()}
                  </p>
                  <p className="miami-body leading-relaxed" style={{ fontSize: '0.92rem', color: '#3a4a5a', flexGrow: 1 }}>
                    {partner.note}
                  </p>
                  <span className="miami-subhead inline-flex items-center gap-1.5" style={{ color: '#0D1B2A', fontSize: 11, marginTop: 16 }}>
                    {partner.href.replace(/^https?:\/\/(www\.)?/, '')} <ArrowRight size={12} />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── BRAND WALL ──────────────────────────────────────────────────
          Replaces the four single-partner bands. Miami's own sponsors and
          exhibitors lead the first row; the rest of the wall is the wider
          Soccerex logo inventory, the same one behind the Global Network page.
          Add a Miami org to MIAMI_BRANDS as soon as its artwork lands. */}
      <BrandWall
        featured={MIAMI_BRANDS}
        heading={<>The Companies You Came to Meet Are <span style={{ color: '#E91E63' }}>Already Here</span></>}
        intro="Clubs, leagues, federations and brands from across the Soccerex network."
      />

      {/* ─── SELECTED SPEAKERS ───────────────────────────────────────────
          Answers "who is actually going to be there" right after the case for
          attending. Ranked by the events desk's running order, so the section
          re-orders itself as the lineup firms up. */}
      <SelectedSpeakers
        slug={MIAMI_EVENT_SLUG}
        limit={12}
        heading={<>Learn From the Executives<br className="hidden sm:inline" /> Behind <span className="miami-text-gradient">Football&rsquo;s Biggest Properties</span></>}
      />

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

      {/* ─── QUESTIONS ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#FFFFFF', padding: 'clamp(80px,10vw,130px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <h2 className="miami-headline text-center mb-10" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#0D1B2A' }}>
            Get Answers <span style={{ color: '#E91E63' }}>Before You Book</span>
          </h2>
          <div style={{ borderTop: '1px solid rgba(13,27,42,0.12)' }}>
            {FAQS.map((f) => (
              <details key={f.q} className="miami-faq" style={{ borderBottom: '1px solid rgba(13,27,42,0.12)' }}>
                <summary className="flex items-center justify-between gap-6" style={{ cursor: 'pointer', listStyle: 'none', padding: '20px 2px' }}>
                  <span className="miami-headline" style={{ fontSize: '1.05rem', color: '#0D1B2A', letterSpacing: '0.01em', textTransform: 'none', lineHeight: 1.35 }}>{f.q}</span>
                  <ChevronDown size={18} className="miami-faq-chevron" style={{ color: '#E91E63', flexShrink: 0 }} aria-hidden />
                </summary>
                <div className="miami-body" style={{ fontSize: '0.98rem', color: '#3a4a5a', lineHeight: 1.65, padding: '0 2px 22px' }}>{f.a}</div>
              </details>
            ))}
          </div>
        </div>
        <style>{`
          .miami-faq summary::-webkit-details-marker { display: none; }
          .miami-faq-chevron { transition: transform 0.2s ease; }
          .miami-faq[open] .miami-faq-chevron { transform: rotate(180deg); }
        `}</style>
      </section>

    </div>
  )
}
