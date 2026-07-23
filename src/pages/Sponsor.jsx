import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Users, Trophy, Download,
  TrendingUp, BadgeCheck, Globe2, Megaphone, Mic, Star, Sparkles, Handshake, CalendarDays,
} from 'lucide-react'
import { HOME, EVENTS, EXHIBIT } from '../lib/routes'
import InquiryModalButton from '../components/InquiryModalButton'
import LeadForm from '../components/LeadForm'
import { sponsorshipSchema } from '../lib/leadSchemas'

const HERO_IMG = '/hero/177-NEW6-miami-packed-diverse-audience.jpg'
const ICN = '/events/miami/2026/icons'

/* Lead intake shared across every CTA. `inquiry_type: 'partner'` is the value
   the backend LeadController maps to KIND_SPONSORSHIP_INQUIRY; `source` keeps
   each placement attributable. No event_slug — this page is platform-level, so
   sales qualifies which event(s) the brand wants after the inquiry. */
const SPONSOR_PAYLOAD = { inquiry_type: 'partner' }

/* Downloadable sponsorship deck. Set to the public path once the file is added
   (e.g. '/decks/soccerex-sponsorship-deck.pdf'); the download CTA renders only
   when this is set, so nothing ships as a broken link. */
const SPONSOR_DECK = null

/* Value-led reasons a brand partners with the platform: reach, credibility,
   pipeline, and global footprint. */
const REASONS = [
  {
    icon: Users,
    title: 'Reach the people who sign the deals',
    body: 'Your team spends months trying to get in front of club owners, league executives, and federation leaders. At Soccerex they are already in the room, on the same floor and in the same sessions as you.',
  },
  {
    icon: BadgeCheck,
    title: 'Credibility you can put to work on day one',
    body: 'Thirty years and a global roster of clubs, leagues, and federations stand behind the Soccerex name. Aligning your brand with the platform signals that you belong at football’s top table.',
  },
  {
    icon: TrendingUp,
    title: 'Turn visibility into a pipeline',
    body: 'Through Soccerex Deal Network, your presence connects to qualified counterparties and warm introductions, so the conversations you start keep moving long after the event closes.',
  },
  {
    icon: Globe2,
    title: 'One platform, every major market',
    body: 'Soccerex convenes the industry across Europe, the Americas, the Middle East, and beyond. One partnership plugs your brand into the football business calendar wherever the game’s decisions are being made.',
  },
]

/* Partnership shapes, framed by outcome rather than price. Sales tailors the
   real pack after the inquiry, so no figures are published here. */
const PARTNERSHIPS = [
  { icon: Sparkles, title: 'Presenting & Headline Partner', body: 'Top-tier association across the event, from the main stage to the moments everyone remembers.' },
  { icon: Trophy, title: 'Category Partner', body: 'Own your sector as the definitive Soccerex partner in your space.' },
  { icon: Megaphone, title: 'Activation & Experience', body: 'Bring your brand to life on the floor, in hospitality, and everywhere delegates gather.' },
  { icon: Mic, title: 'Content & Thought Leadership', body: 'Put your experts on stage and your point of view into the program.' },
  { icon: Star, title: 'Hospitality & VIP', body: 'Host the rooms where the highest-value relationships are built.' },
]

const AUDIENCE = [
  { label: 'Clubs', icon: 'clubs' },
  { label: 'Leagues', icon: 'leagues' },
  { label: 'Federations', icon: 'federations' },
  { label: 'Investors', icon: 'investors' },
  { label: 'Governments', icon: 'governments' },
  { label: "Women's Football", icon: 'womens-football' },
  { label: 'Stadiums', icon: 'stadiums' },
  { label: 'Agencies', icon: 'agencies' },
]

const STATS = [
  { num: '30', label: 'Years' },
  { num: '57', label: 'Events' },
  { num: '75K+', label: 'Delegates' },
  { num: '5K+', label: 'Brands' },
]

const GALLERY = [
  { src: '/hero/25-NEW-packed-keynote-miami.jpg', caption: 'A packed keynote' },
  { src: '/hero/170-NEW6-miami-two-speakers-soccerex-branding.jpg', caption: 'Your brand on the stage' },
  { src: '/hero/147-MISC-infantino-wide-shot-soccerex-branding.jpg', caption: 'The names that move the game' },
  { src: '/hero/173-NEW6-miami-speaker-purple-lighting-mic.jpg', caption: 'The main-stage moment' },
  { src: '/hero/157-MISC-diverse-crowd-rooftop-networking.jpg', caption: 'Where relationships are built' },
]

export default function Sponsor() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Sponsor Soccerex | Partnership Opportunities'
  }, [])

  return (
    <div className="event-page theme-miami" style={{ background: '#FFF8F4' }}>

      {/* ─── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#0D1B2A', minHeight: 'min(88vh, 760px)', display: 'flex', alignItems: 'flex-end' }}>
        <img src={HERO_IMG} alt="A packed room of football industry delegates at a Soccerex session" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '65% center', opacity: 0.5 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,27,42,0.55) 0%, rgba(13,27,42,0.35) 40%, rgba(13,27,42,0.94) 100%)' }} />

        <div className="relative z-10" style={{ maxWidth: '1180px', margin: '0 auto', width: '100%', padding: 'clamp(90px,12vw,130px) clamp(24px,5vw,72px) clamp(48px,6vw,72px)' }}>
          <Link to={HOME} className="inline-flex items-center gap-2 font-mono uppercase mb-8" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, letterSpacing: '0.2em', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Back to Soccerex
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <span className="miami-subhead" style={{ fontSize: 12, letterSpacing: '0.24em', color: '#fff' }}>SOCCEREX</span>
            <span style={{ width: 7, height: 7, background: '#E91E63' }} />
            <span className="miami-subhead" style={{ fontSize: 12, letterSpacing: '0.24em', color: '#00C6D7' }}>THE GLOBAL FOOTBALL BUSINESS PLATFORM</span>
          </div>

          <p className="miami-kicker" style={{ color: '#00C6D7' }}>Sponsorship &amp; Partnership</p>
          <h1 className="miami-headline" style={{ fontSize: 'clamp(2rem, 5vw, 3.6rem)', color: '#fff', lineHeight: 1.08, maxWidth: 900, textWrap: 'balance' }}>
            The whole football industry,<br />
            in one room.<br />
            <span className="miami-text-gradient">Your brand, in the middle of it.</span>
          </h1>
          <p className="miami-body mt-6 mb-9" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)', color: 'rgba(255,255,255,0.82)', maxWidth: 680, lineHeight: 1.6 }}>
            Soccerex brings club owners, league executives, federation leaders, investors, and rightsholders together across the game&rsquo;s most important markets. Partnering with the platform gives your brand a direct line to the people who decide where football&rsquo;s money goes next, backed by thirty years of credibility.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <InquiryModalButton
              kind="sponsorship-inquiry"
              schema={sponsorshipSchema}
              label="Request the sponsorship pack"
              modalTitle="Sponsor Soccerex"
              eyebrow="Sponsorship inquiry"
              intro="Tell us about your brand and what you want to achieve. We will send the right sponsorship pack and follow up personally."
              extraPayload={{ ...SPONSOR_PAYLOAD, source: 'sponsor-hero' }}
              submitLabel="Send inquiry"
              successTitle="Inquiry received."
              successBody="A partnerships lead will follow up by email with the right pack for your goals."
              buttonClassName="miami-pill-primary"
            />
            {SPONSOR_DECK && (
              <a href={SPONSOR_DECK} download className="miami-pill-outline" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
                <Download size={15} /> Download the deck
              </a>
            )}
            <a href="#partner" className="miami-pill-outline" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
              See how brands partner <ArrowRight size={15} />
            </a>
          </div>

          {/* Trust strip — evergreen platform stats */}
          <div className="flex flex-wrap gap-x-10 gap-y-4 mt-11">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="miami-headline" style={{ fontSize: '1.9rem', color: '#fff', lineHeight: 1 }}>{s.num}</p>
                <p className="miami-subhead mt-1" style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.16em' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY PARTNER ─────────────────────────────────────────────────── */}
      <section id="partner" style={{ background: '#FFFFFF', padding: 'clamp(72px,9vw,120px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <p className="miami-kicker miami-kicker--pink">Why brands partner with Soccerex</p>
          <h2 className="miami-headline mb-4" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.5rem)', color: '#0D1B2A', maxWidth: 720 }}>
            Sponsorship that reaches the people who decide
          </h2>
          <p className="miami-body leading-relaxed mb-10" style={{ fontSize: '1.05rem', color: '#3a4a5a', maxWidth: 680 }}>
            Football sponsorship usually buys you attention. Soccerex buys you access. Here is what your brand gets in the room.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {REASONS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="miami-card-light">
                <div style={{ width: 44, height: 44, background: 'rgba(0,124,145,0.08)', border: '1px solid rgba(0,124,145,0.2)', display: 'grid', placeItems: 'center', marginBottom: 16 }}>
                  <Icon size={22} style={{ color: '#007C91' }} />
                </div>
                <h3 className="miami-subhead mb-3" style={{ fontSize: '1rem', color: '#0D1B2A', letterSpacing: '0.08em' }}>{title}</h3>
                <p className="miami-body leading-relaxed" style={{ fontSize: '0.95rem', color: '#3a4a5a' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="miami-divider" aria-hidden />

      {/* ─── WHO YOU'LL STAND NEXT TO ────────────────────────────────────── */}
      <section style={{ background: '#FAFBFC', padding: 'clamp(72px,9vw,120px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div className="text-center mb-10 flex flex-col items-center">
            <p className="miami-kicker">Who you&rsquo;ll be standing next to</p>
            <h2 className="miami-headline" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.5rem)', color: '#0D1B2A' }}>
              The room your brand <span className="miami-text-gradient">wants to be in</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
            {AUDIENCE.map(({ label, icon }) => (
              <div key={label} className="miami-cell-light">
                <img src={`${ICN}/${icon}.svg`} alt="" aria-hidden style={{ width: 38, height: 38, margin: '0 auto 12px', display: 'block' }} />
                <p className="miami-subhead" style={{ color: '#0D1B2A', fontSize: 11 }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Image strip */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {GALLERY.map((img, i) => (
              <figure key={img.src} className="relative overflow-hidden" style={{ margin: 0, aspectRatio: i === 0 ? '16/10' : '4/3', gridColumn: i === 0 ? 'span 2' : 'span 1' }}>
                <img src={img.src} alt={img.caption} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <figcaption className="miami-subhead" style={{ position: 'absolute', left: 12, bottom: 10, color: '#fff', fontSize: 10, letterSpacing: '0.12em', textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>{img.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <hr className="miami-divider" aria-hidden />

      {/* ─── WAYS TO PARTNER ─────────────────────────────────────────────── */}
      <section style={{ background: '#FFFFFF', padding: 'clamp(72px,9vw,120px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <p className="miami-kicker miami-kicker--pink">Ways to partner</p>
          <h2 className="miami-headline mb-4" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.5rem)', color: '#0D1B2A' }}>Built around what you want to achieve</h2>
          <p className="miami-body leading-relaxed mb-10" style={{ fontSize: '1.05rem', color: '#3a4a5a', maxWidth: 680 }}>
            Every partnership starts with your objective. Tell us the outcome you are after and we will shape the rest, from stage presence to hospitality to year-round platform integration.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PARTNERSHIPS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-start gap-4 px-5 py-5" style={{ background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.08)' }}>
                <Icon size={20} style={{ color: '#E91E63', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h3 className="miami-subhead mb-1.5" style={{ color: '#0D1B2A', fontSize: '0.85rem', letterSpacing: '0.06em' }}>{title}</h3>
                  <p className="miami-body" style={{ fontSize: '0.9rem', color: '#3a4a5a', lineHeight: 1.5 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CLOSING CTA + INLINE FORM ───────────────────────────────────── */}
      <section id="inquire" className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0D1B2A 0%, #102538 100%)', padding: 'clamp(72px,9vw,120px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 miami-grid" style={{ opacity: 0.3 }} />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start" style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div>
            <div className="inline-flex mb-4">
              <span className="event-badge"><span className="event-badge-dot" /> Partnerships open</span>
            </div>
            <h2 className="miami-headline text-white mb-4" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.5rem)' }}>
              Let&rsquo;s build your <span className="miami-text-gradient">presence at Soccerex</span>
            </h2>
            <p className="miami-body mb-6" style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: 460 }}>
              Share a little about your brand and what a win looks like for you. A partnerships lead will come back with the right pack, tailored to your goals and the events that fit.
            </p>
            {SPONSOR_DECK && (
              <a href={SPONSOR_DECK} download className="miami-pill-outline mb-6" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
                <Download size={15} /> Download the sponsorship deck
              </a>
            )}
            <p className="miami-body mb-3" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>
              <Handshake size={15} className="inline mr-2" style={{ color: 'var(--event-primary-light, #ff6fa0)' }} />
              Looking to take a stand instead? <Link to={EXHIBIT} style={{ color: '#00C6D7', textDecoration: 'underline' }}>Exhibit at Soccerex</Link>.
            </p>
            <p className="miami-body" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>
              <CalendarDays size={15} className="inline mr-2" style={{ color: 'var(--event-primary-light, #ff6fa0)' }} />
              <Link to={EVENTS} style={{ color: '#00C6D7', textDecoration: 'underline' }}>See the full Soccerex calendar</Link> to choose where to activate.
            </p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--event-primary-border, rgba(233,30,99,0.25))', padding: 'clamp(22px, 3vw, 32px)' }}>
            <LeadForm
              kind="sponsorship-inquiry"
              schema={sponsorshipSchema}
              extraPayload={{ ...SPONSOR_PAYLOAD, source: 'sponsor-cta' }}
              submitLabel="Send inquiry"
              successTitle="Inquiry received."
              successBody="A partnerships lead will follow up by email with the right pack for your goals."
              theme="dark"
            />
          </div>
        </div>
      </section>

      {/* Footer nav strip */}
      <div style={{ background: '#0D1B2A', padding: '18px 24px', textAlign: 'center' }}>
        <Link to={HOME} className="font-mono uppercase" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: '0.2em', textDecoration: 'none' }}>
          Soccerex &middot; 30 years of connecting the game
        </Link>
      </div>
    </div>
  )
}
