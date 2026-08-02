import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Target, Rocket, CalendarCheck, LayoutGrid, Download,
  Building2, BadgeCheck, Users, Ticket, Handshake, CalendarDays,
} from 'lucide-react'
import { HOME, EVENTS, SPONSOR, MIAMI_2026_PRICING, EXHIBIT } from '../lib/routes'
import PageMeta from '../components/PageMeta'
import InquiryModalButton from '../components/InquiryModalButton'
import LeadForm from '../components/LeadForm'
import { sponsorshipSchema } from '../lib/leadSchemas'

const HERO_IMG = '/hero/266-NEW9-miami-exhibition-floor-wide.jpg'

/* Shared lead intake. `inquiry_type: 'exhibit'` maps to KIND_EXHIBITOR_INQUIRY;
   `event_slug` surfaces in the CRM so sales knows this is Miami 2026 without
   a qualification round-trip. */
const EXHIBIT_PAYLOAD = { inquiry_type: 'exhibit', event_slug: 'miami-2026' }

/* Downloadable exhibitor pack. Set to the public path once the file is added
   (e.g. '/decks/soccerex-exhibitor-pack.pdf'); the download CTA renders only
   when this is set, so nothing ships as a broken link. */
const EXHIBIT_DECK = null

/* Value-led reasons to take a stand: traffic quality, global reach, pre-booked
   meetings, and standing out. */
const REASONS = [
  {
    icon: Target,
    title: 'Foot traffic that converts',
    body: 'The delegates walking the Soccerex floor are buyers and decision-makers, not passers-by collecting tote bags. Every conversation at your stand can become a contract.',
  },
  {
    icon: Rocket,
    title: 'Reach every market that matters',
    body: 'Soccerex runs across Europe, the Americas, and the Middle East, so a stand puts your product in front of buyers from the exact markets you are trying to win.',
  },
  {
    icon: CalendarCheck,
    title: 'Meetings booked before you arrive',
    body: 'Through Soccerex Deal Network we connect you with qualified counterparties ahead of the event, so your calendar is filling before you have unpacked the stand.',
  },
  {
    icon: LayoutGrid,
    title: 'Room to stand out',
    body: 'From stand space to signage to a place in the program, Soccerex gives your brand the visibility that makes buyers seek you out on a busy floor.',
  },
]

/* What a stand includes, framed by value. Sales tailors size and price after
   the inquiry, so no figures are published here. */
const INCLUDED = [
  { icon: Building2, title: 'Stand space on the exhibition floor', body: 'A footprint in the heart of where clubs, leagues, and brands come to find what moves them forward.' },
  { icon: BadgeCheck, title: 'Brand presence across the event', body: 'Your name across signage and the program, so delegates know exactly where to find you.' },
  { icon: Users, title: 'Delegate passes for your team', body: 'Get the right people on the floor and in the sessions where relationships start.' },
  { icon: Handshake, title: 'Deal Network access', body: 'Pre-arranged introductions to qualified counterparties, matched to what you sell.' },
  { icon: Ticket, title: 'Lead capture built in', body: 'Every conversation is logged and followed up, so nothing you started slips away.' },
]

const STATS = [
  { num: '30', label: 'Years' },
  { num: '57', label: 'Events' },
  { num: '75K+', label: 'Delegates' },
  { num: '5K+', label: 'Brands' },
]

const PAST_BRANDS = [
  'FIFA', 'LaLiga', 'Mastercard', 'Adidas', 'Telemundo', 'Avanade',
]

const GALLERY = [
  { src: '/hero/141-MISC-fifa-booth-soccerex-exhibition.jpg', caption: 'The Soccerex floor' },
  { src: '/hero/270-NEW9-miami-exhibition-branding.jpg', caption: 'Brand presence that gets noticed' },
  { src: '/hero/178-NEW6-miami-networking-exhibition-floor.jpg', caption: 'Conversations that convert' },
  { src: '/hero/251-NEW9-exhibition-floor-football-display.jpg', caption: 'Products in front of buyers' },
  { src: '/hero/258-NEW9-vr-soccer-booth.jpg', caption: 'Innovation on display' },
]

export default function Exhibit() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="event-page theme-miami" style={{ background: '#FFF8F4' }}>
      <PageMeta
        title="Exhibit at Soccerex Miami 2026 | Reach Football's Buyers"
        description="Showcase your product or service to 1,500+ football industry professionals. Floor stands, stands packages, and branded spaces at Nu Stadium, Miami — 23-25 September 2026."
        image={HERO_IMG}
        path={EXHIBIT}
      />

      {/* ─── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#0D1B2A', minHeight: 'min(88vh, 760px)', display: 'flex', alignItems: 'flex-end' }}>
        <img src={HERO_IMG} alt="Wide view of the Soccerex exhibition floor with brand stands and delegates" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,27,42,0.55) 0%, rgba(13,27,42,0.35) 40%, rgba(13,27,42,0.94) 100%)' }} />

        <div className="relative z-10" style={{ maxWidth: '1180px', margin: '0 auto', width: '100%', padding: 'clamp(90px,12vw,130px) clamp(24px,5vw,72px) clamp(48px,6vw,72px)' }}>
          <Link to={HOME} className="inline-flex items-center gap-2 font-mono uppercase mb-8" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, letterSpacing: '0.2em', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Back to Soccerex
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <span className="miami-subhead" style={{ fontSize: 12, letterSpacing: '0.24em', color: '#fff' }}>SOCCEREX</span>
            <span style={{ width: 7, height: 7, background: '#E91E63' }} />
            <span className="miami-subhead" style={{ fontSize: 12, letterSpacing: '0.24em', color: '#00C6D7' }}>THE GLOBAL FOOTBALL BUSINESS PLATFORM</span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="miami-subhead" style={{ fontSize: 12, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.75)' }}>23-25 SEPTEMBER 2026</span>
            <span style={{ width: 5, height: 5, background: '#E91E63' }} />
            <span className="miami-subhead" style={{ fontSize: 12, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.75)' }}>NU STADIUM · MIAMI</span>
          </div>

          <p className="miami-kicker" style={{ color: '#00C6D7' }}>Exhibit at Soccerex</p>
          <h1 className="miami-headline" style={{ fontSize: 'clamp(2rem, 5vw, 3.6rem)', color: '#fff', lineHeight: 1.08, maxWidth: 900, textWrap: 'balance' }}>
            Put your product in front of the people who buy it.<br />
            <span className="miami-text-gradient">On the floor where football does business.</span>
          </h1>
          <p className="miami-body mt-6 mb-9" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)', color: 'rgba(255,255,255,0.82)', maxWidth: 680, lineHeight: 1.6 }}>
            The Soccerex exhibition floor is where clubs, leagues, federations, and brands come to find the products and partners that move them forward. A stand puts your technology, service, or idea directly in the path of buyers who arrived ready to do business.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <InquiryModalButton
              kind="sponsorship-inquiry"
              schema={sponsorshipSchema}
              label="Request the exhibitor pack"
              modalTitle="Exhibit at Soccerex"
              eyebrow="Exhibitor inquiry"
              intro="Tell us about your stand needs and what you sell. We will send the exhibitor pack and floor plan, and follow up personally."
              extraPayload={{ ...EXHIBIT_PAYLOAD, source: 'exhibit-hero' }}
              submitLabel="Send inquiry"
              successTitle="Inquiry received."
              successBody="An exhibitor lead will follow up by email with the pack and floor plan."
              buttonClassName="miami-pill-primary"
            />
            {EXHIBIT_DECK && (
              <a href={EXHIBIT_DECK} download className="miami-pill-outline" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
                <Download size={15} /> Download the pack
              </a>
            )}
            <Link to={MIAMI_2026_PRICING} className="miami-pill-outline" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
              See delegate pricing <ArrowRight size={15} />
            </Link>
            <a href="#floor" className="miami-pill-outline" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
              See the floor <ArrowRight size={15} />
            </a>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2" style={{ background: 'rgba(233,30,99,0.15)', border: '1px solid rgba(233,30,99,0.4)' }}>
            <span style={{ width: 6, height: 6, background: '#E91E63', borderRadius: '50%', display: 'inline-block' }} />
            <span className="miami-subhead" style={{ fontSize: 11, letterSpacing: '0.14em', color: '#ff6fa0' }}>FLOOR STAND EARLY RATE CLOSES 31 AUGUST 2026</span>
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

      {/* ─── WHY EXHIBIT ─────────────────────────────────────────────────── */}
      <section style={{ background: '#FFFFFF', padding: 'clamp(72px,9vw,120px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <p className="miami-kicker miami-kicker--pink">Why exhibit at Soccerex</p>
          <h2 className="miami-headline mb-4" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.5rem)', color: '#0D1B2A', maxWidth: 720 }}>
            A stand that fills your pipeline with buyers
          </h2>
          <p className="miami-body leading-relaxed mb-10" style={{ fontSize: '1.05rem', color: '#3a4a5a', maxWidth: 680 }}>
            Most exhibitions cost you a week and hand you a stack of business cards. Soccerex is built so the people at your stand are the ones you actually want to meet.
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

      {/* ─── THE FLOOR (gallery) ─────────────────────────────────────────── */}
      <section id="floor" style={{ background: '#FAFBFC', padding: 'clamp(72px,9vw,120px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div className="text-center mb-10 flex flex-col items-center">
            <p className="miami-kicker">The Soccerex floor</p>
            <h2 className="miami-headline" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.5rem)', color: '#0D1B2A' }}>
              Where products <span className="miami-text-gradient">meet buyers</span>
            </h2>
          </div>
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

      {/* ─── WHAT'S INCLUDED ─────────────────────────────────────────────── */}
      <section style={{ background: '#FFFFFF', padding: 'clamp(72px,9vw,120px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <p className="miami-kicker miami-kicker--pink">What a stand includes</p>
          <h2 className="miami-headline mb-4" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.5rem)', color: '#0D1B2A' }}>Sized to your goals and your team</h2>
          <p className="miami-body leading-relaxed mb-10" style={{ fontSize: '1.05rem', color: '#3a4a5a', maxWidth: 680 }}>
            Exhibitor packages flex to fit what you sell and who you need to meet. Tell us the outcome you are after and we will put together the right floor presence.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {INCLUDED.map(({ icon: Icon, title, body }) => (
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
              <span className="event-badge"><span className="event-badge-dot" /> Stands available</span>
            </div>
            <h2 className="miami-headline text-white mb-4" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.5rem)' }}>
              Claim your <span className="miami-text-gradient">space on the floor</span>
            </h2>
            <p className="miami-body mb-6" style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: 460 }}>
              Tell us what you sell and who you need to meet. An exhibitor lead will come back with the pack, the floor plan, and the options that fit your goals and the events that suit you.
            </p>
            {EXHIBIT_DECK && (
              <a href={EXHIBIT_DECK} download className="miami-pill-outline mb-6" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
                <Download size={15} /> Download the exhibitor pack
              </a>
            )}
            <p className="miami-body mb-3" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>
              <Handshake size={15} className="inline mr-2" style={{ color: 'var(--event-primary-light, #ff6fa0)' }} />
              Looking for brand-wide visibility instead? <Link to={SPONSOR} style={{ color: '#00C6D7', textDecoration: 'underline' }}>Sponsor Soccerex</Link>.
            </p>
            <p className="miami-body" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>
              <CalendarDays size={15} className="inline mr-2" style={{ color: 'var(--event-primary-light, #ff6fa0)' }} />
              <Link to={EVENTS} style={{ color: '#00C6D7', textDecoration: 'underline' }}>See the full Soccerex calendar</Link> to choose where to exhibit.
            </p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--event-primary-border, rgba(233,30,99,0.25))', padding: 'clamp(22px, 3vw, 32px)' }}>
            <LeadForm
              kind="sponsorship-inquiry"
              schema={sponsorshipSchema}
              extraPayload={{ ...EXHIBIT_PAYLOAD, source: 'exhibit-cta' }}
              submitLabel="Send inquiry"
              successTitle="Inquiry received."
              successBody="An exhibitor lead will follow up by email with the pack and floor plan."
              theme="dark"
            />
          </div>
        </div>
      </section>

      {/* ─── PAST BRAND PROOF ────────────────────────────────────────────── */}
      <section style={{ background: '#0D1B2A', padding: 'clamp(40px,5vw,60px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', textAlign: 'center' }}>
          <p className="miami-subhead mb-6" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)' }}>
            BRANDS THAT HAVE ACTIVATED WITH SOCCEREX
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {PAST_BRANDS.map((name) => (
              <span key={name} className="miami-subhead" style={{ fontSize: '1rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.55)', fontWeight: 700 }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer nav strip */}
      <div style={{ background: '#0D1B2A', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '18px 24px', textAlign: 'center' }}>
        <Link to={HOME} className="font-mono uppercase" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: '0.2em', textDecoration: 'none' }}>
          Soccerex &middot; 30 years of connecting the game
        </Link>
      </div>
    </div>
  )
}
