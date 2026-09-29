/*
 * Miami 2026 after the event, written for the people deciding whether to be in the room next
 * time: what the week was, who was in it, what it produced, and the two ways back in.
 *
 * Served unlisted at /miami-2026-draft while Joel reviews it, and built to take over
 * /miami-2026 from Miami2026V2, whose design system it reuses.
 *
 * Scale figures are the rounded set used across the whole page (850+, nearly 150, 90+, 30,
 * 2,700+), so a reader never has to reconcile two counts of the same thing.
 *
 * Photography and the Roc Nation reel live on the public asset bucket. Frames carry two
 * sizes: the grid loads -w800 and the lightbox loads the 1600px file. The gallery opens on
 * twelve curated frames and unfolds to the full set on request.
 */
import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Calendar, MapPin, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HOME, MIAMI_2026_PRESS_RELEASE, EUROPE_2026, DEAL_NETWORK, HERSOCCEREX, INSIGHTS, CONTACT, bookCallUrl, eventAgenda } from '../lib/routes'
import PageMeta from '../components/PageMeta'
import SelectedSpeakers from '../components/SelectedSpeakers'
import BrandWall from '../components/BrandWall'
import InquiryModalButton from '../components/InquiryModalButton'
import { packRequestSchema, sponsorshipSchema } from '../lib/leadSchemas'
import useScrollAnimations from '../lib/useScrollAnimations'

const MIAMI_EVENT_SLUG = 'soccerex-miami-2026'
const GFX = '/events/miami/2026/graphics'
const ASSET = 'https://soccerex-public-assets.s3.amazonaws.com/events/miami-2026'
const FRAME_V = 3 // bump when a frame is recropped under the same name
const frame = (slug, size = '') => `${ASSET}/frames/${slug}${size}.jpg?v=${FRAME_V}`

/* Ivan's rounded set, used everywhere the page states scale. */
const NUMBERS = [
  { figure: '850+', label: 'Organizations represented' },
  { figure: '150+', label: 'Clubs, leagues & federations' },
  { figure: '90+', label: 'Speakers on stage' },
  { figure: '30+', label: 'Exhibitors on the floor' },
  { figure: '2,700+', label: 'Connections through the event app' },
]

/* Named, because the delegate list is the product. Everyone here was on stage or on the floor. */
const COHORTS = [
  {
    heading: 'Football’s institutions',
    names: 'Concacaf, FIFA World Cup 26 leadership from the United States, Mexico and Canada, Federación Mexicana de Fútbol, the Argentine Football Association and Qatar’s Supreme Committee for Delivery and Legacy.',
  },
  {
    heading: 'The clubs building the game',
    names: 'Inter Miami CF, FC Barcelona, FC Bayern, RB Leipzig, Club América, Chivas, Brighton and Hove Albion, Orlando City SC, Vancouver Whitecaps FC, Napoli Women, Nashville SC, Atlanta United and Miami FC.',
  },
  {
    heading: 'The voices shaping reach, rights and culture',
    names: 'LaLiga North America, Bundesliga Americas, NWSL, MLS NEXT PRO, FOX Sports, Telemundo, TelevisaUnivision and Ateme.',
  },
  {
    heading: 'The capital, brands and innovators moving football forward',
    names: 'Roc Nation Sports International, Royal Caribbean, Nu, Fortress Investment Group, Catapult, Gemini Sports AI, LaBella Associates, Meis+, Gensler and Buro Happold.',
  },
]

/* Why each part of the room came, in the order they weigh it. */
const RETURNS = [
  'Clubs, leagues and federations met investors, commercial partners, peers and the technology providers shaping the game.',
  'Investors heard from decision-makers directly, deepened relationships and read the market from inside the industry.',
  'Sponsors and exhibitors put their brands, services and ideas in front of a concentrated football business audience.',
  'Delegates turned three days of insight and curated introductions into relationships that otherwise take months to build.',
  'Women and young players connected to new leadership, opportunity and support through HerSoccerex and Soccerex Impact.',
]

/* The agenda by argument rather than by day, which is how anyone deciding to come reads it. */
const THEMES = [
  {
    title: 'Football’s investment future',
    photo: 'investment-panel',
    body: 'Joseph DaGrosa Jr. and Suvin Malik of Fortress Investment Group opened the conference with Football Investment Strategies, bringing serious capital and football expertise into the same conversation on the game’s next era of ownership, growth and value creation.',
  },
  {
    title: 'A historic World Cup conversation',
    photo: 'argentina',
    body: 'For the first time, the FIFA World Cup 26 Chief Tournament Officers representing all three host nations, the United States, Mexico and Canada, shared one Soccerex stage together. It was a defining conversation about legacy, infrastructure and the opportunity ahead for football across North America.',
  },
  {
    title: 'Media, rights and the modern fan',
    photo: 'media',
    body: 'Alexi Lalas, alongside leaders from Bundesliga Americas and Concacaf, explored football’s media future: rights, streaming, reach and how the game connects to a new generation of fans.',
  },
  {
    title: 'The commercial power of the women’s game',
    photo: 'women',
    body: 'Paul Barber OBE, Alessandra Nencioni of Napoli Women, Amanda Vandervort and Heidi Pellerano led a direct conversation on the commercial opportunity in women’s football, one of the most dynamic growth stories in global sport.',
  },
  {
    title: 'Building football’s future, from the ground up',
    photo: 'barca',
    body: 'From FC Barcelona’s Americas strategy and academy development to modern stadium infrastructure, surfaces and the front office, the agenda paired the people setting the standard with the people building what comes next.',
  },
  {
    title: 'A Miami moment no one expected',
    photo: 'khaled-room',
    body: 'Roc Nation Sports International closed day one with Built, Not Bought, a packed conversation on building a modern football agency. When DJ Khaled joined Michael Yormark, Frederico Peña, Nathan Campbell, Rob Simpkins and Alan Redmond on stage, the room erupted.',
  },
]

/* The first twelve are the curated set the page opens on; the rest unfold on request. */
const FEATURED_COUNT = 12
const GALLERY = [
  /* The twelve the page opens on, pulled across every source in the shoot so the
     set does not read as one photographer's stage coverage. Captions say only what
     the frame shows or what its own name card on the LED wall says. */
  { slug: 'worldcup', alt: 'The FIFA World Cup 26 chief tournament officers for the United States, Mexico and Canada on one stage' },
  { slug: 'registration', alt: 'Delegates arriving at Nu Stadium' },
  { slug: 'lalas', alt: 'Alexi Lalas of FOX Sports on the main stage' },
  { slug: 'sponsor-board', alt: 'The sponsor board on the screen at Nu Stadium' },
  { slug: 'floor-group', alt: 'Delegates meeting on the exhibition floor' },
  { slug: 'guzan', alt: 'Brad Guzan, sporting advisor and club ambassador at Atlanta United' },
  { slug: 'freestyle-ball', alt: 'A freestyler with the match ball at Nu Stadium' },
  { slug: 'barca-booth', alt: 'The FC Barcelona stand serving delegates on the exhibition floor' },
  { slug: 'dagrosa', alt: 'Joseph DaGrosa Jr., chairman of Soccerex, on the main stage' },
  { slug: 'coffee', alt: 'A Soccerex Miami coffee at Nu Stadium' },
  { slug: 'impact-joy', alt: 'Young players at the Soccerex Community Impact Event' },
  { slug: 'vip-evening', alt: 'Guests at the VIP evening at the Savoy Hotel and Beach Club' },

  /* Behind View more. Nothing here appears anywhere else on the page, and no two
     frames are the same moment: the audience block, the panel wides and the youth
     pitches each keep one frame, not four.

     Keep the total a multiple of twelve. The grid runs two columns on a phone and
     three from 760px, so any other count leaves the last row short. */
  { slug: 'curtis', alt: 'Ali Curtis, president of MLS NEXT PRO, alongside Brad Guzan' },
  { slug: 'pellerano', alt: 'Heidi Pellerano, chief commercial officer of Concacaf, on the main stage' },
  { slug: 'dorrance', alt: 'Anson Dorrance, coach emeritus of the United States and UNC women’s soccer' },
  { slug: 'meis', alt: 'The architect Dan Meis on the stadium panel' },
  { slug: 'open', alt: 'The conference opens at Nu Stadium' },
  { slug: 'concourse', alt: 'Delegates talking between sessions' },
  { slug: 'greeting', alt: 'Two delegates greeting each other between sessions' },
  { slug: 'navia-floor', alt: 'Guests in front of the Miami 2026 partner backdrop' },
  { slug: 'venue', alt: 'Inside Nu Stadium' },
  { slug: 'ball', alt: 'The Soccerex match ball on the pitch at Nu Stadium' },
  { slug: 'impact', alt: 'The mini fields at Nu Stadium during the Community Impact Event' },
  { slug: 'vip', alt: 'The Soccerex sign at the VIP evening at the Savoy Hotel and Beach Club' },
]

const THANKS = [
  {
    heading: 'Inter Miami CF and Nu Stadium',
    body: 'They gave us the newest stadium in Major League Soccer for three days, from the main stage to the mini fields, and worked alongside our team from the first walkthrough to the last session.',
  },
  {
    heading: 'Our partners',
    body: 'Concacaf, the Greater Miami Convention and Visitors Bureau, Roc Nation Sports International, FC Barcelona and SPORTFIVE backed the event publicly and put their people on stage and on the floor.',
  },
  {
    heading: 'Our sponsors and exhibitors',
    body: '30+ exhibitors took stands and made the exhibition what delegates spent their breaks in, from elite performance and technology to architecture, infrastructure, investment and mobility.',
  },
  {
    heading: 'Everyone who took the stage',
    body: 'More than 90 speakers across 28 panels and fireside chats, several of them flying in for a single session and going straight back to the airport.',
  },
  {
    heading: 'The Community Impact Event',
    body: 'DaGrosa Capital Partners led the opening day on the mini fields with Fútbol con Corazón, Royal Caribbean, Baptist Health and the coaches who ran the sessions for the young players who filled them.',
  },
  {
    heading: 'Our volunteers and crew',
    body: 'Volunteers, stage crew, photographers and production ran registration, kept 28 sessions on time and stayed long after the room emptied. Soccer United and TAPEDESIGN sent a gear donation for the week.',
  },
]

const navButton = {
  position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: 46, height: 46, borderRadius: 999,
  background: 'rgba(255,255,255,0.12)', color: '#fff', display: 'grid', placeItems: 'center', border: 'none', cursor: 'pointer',
}

function Lightbox({ index, onClose, onMove }) {
  const item = GALLERY[index]
  useEffect(() => {
    const key = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onMove(1)
      if (e.key === 'ArrowLeft') onMove(-1)
    }
    window.addEventListener('keydown', key)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', key); document.body.style.overflow = '' }
  }, [onClose, onMove])

  return (
    <div
      role="dialog" aria-modal="true" aria-label="Photograph"
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 120, background: 'rgba(8,12,20,0.94)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px,4vw,56px)' }}
    >
      <button onClick={(e) => { e.stopPropagation(); onClose() }} aria-label="Close"
        style={{ position: 'absolute', top: 18, right: 18, width: 44, height: 44, borderRadius: 999,
          background: 'rgba(255,255,255,0.12)', color: '#fff', display: 'grid', placeItems: 'center', border: 'none', cursor: 'pointer' }}>
        <X size={20} />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onMove(-1) }} aria-label="Previous photograph" style={{ ...navButton, left: 14 }}>
        <ChevronLeft size={22} />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onMove(1) }} aria-label="Next photograph" style={{ ...navButton, right: 14 }}>
        <ChevronRight size={22} />
      </button>
      <figure onClick={(e) => e.stopPropagation()} style={{ margin: 0, maxWidth: 1180, width: '100%' }}>
        <img src={frame(item.slug)} alt={item.alt}
          style={{ width: '100%', height: 'auto', maxHeight: '78vh', objectFit: 'contain', borderRadius: 6, display: 'block', margin: '0 auto' }} />
      </figure>
    </div>
  )
}

/* The two moves every call to action on this page reinforces: business now, or the next edition.
   The outline pill is white on pink, so it carries on the navy and sunset sections too. */
function NextMoves({ source }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link to={DEAL_NETWORK} className="miami-pill-primary">
        Explore the Deal Network <ArrowRight size={15} />
      </Link>
      <InquiryModalButton
        kind="preregister"
        label="Register your interest"
        modalTitle="Register your interest"
        eyebrow="The next Miami edition"
        intro="Leave your details and we will send the dates, the venue and the delegate rate before they go public."
        schema={packRequestSchema}
        extraPayload={{ event_slug: 'miami-2027', interest: 'Miami 2027 pre-registration', source, marketing_opt_in: true }}
        submitLabel="Register interest"
        successTitle="You are on the list."
        successBody="We will be in touch with dates for the next Miami edition before they go public."
        bookingUrl={bookCallUrl('success-miami-2027')}
        buttonClassName="miami-pill-outline"
      >
        Register your interest <ArrowRight size={15} />
      </InquiryModalButton>
    </div>
  )
}

export default function Miami2026Recap() {
  useScrollAnimations()
  const [open, setOpen] = useState(null)
  const [showAllFrames, setShowAllFrames] = useState(false)
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const move = useCallback((dir) => setOpen((i) => (i + dir + GALLERY.length) % GALLERY.length), [])
  const visibleFrames = showAllFrames ? GALLERY : GALLERY.slice(0, FEATURED_COUNT)

  return (
    <div className="event-page theme-miami" style={{ background: '#FFF8F4' }}>
      <PageMeta
        title="Soccerex Miami 2026 | The New Standard for Football Business"
        description="More than 850 organizations, 150+ clubs, leagues and federations, 90+ speakers and 30+ exhibitors came to Nu Stadium for Soccerex Miami 2026. See who was in the room, and how the introductions carry on."
        image={frame('khaled-mic')}
        path="/miami-2026-draft"
        noindex
      />

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#0D1B2A' }}>
        <img src={frame('khaled-room')} alt="" aria-hidden
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.32 }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,27,42,0.74) 0%, rgba(13,27,42,0.9) 100%)' }} />
        <div className="relative z-10" style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(96px,12vw,150px) clamp(24px,5vw,72px) clamp(64px,8vw,96px)' }}>
          <Link to={HOME} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest mb-10" style={{ color: 'rgba(255,255,255,0.72)', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <img src={`${GFX}/logo-primary.svg`} alt="Soccerex Miami 2026" style={{ width: 'min(420px, 72vw)', marginBottom: 'clamp(28px,4vw,40px)', filter: 'brightness(0) invert(1)' }} />

          <h1 className="miami-headline" style={{ textWrap: 'balance', fontSize: 'clamp(2.1rem, 5vw, 3.6rem)', color: '#FFFFFF', lineHeight: 1.05, maxWidth: 980, marginBottom: 'clamp(18px,2.4vw,26px)' }}>
            The most consequential Soccerex in decades, <span style={{ color: '#FF4D8D' }}>and the next one will build on it</span>
          </h1>
          <p className="miami-body" style={{ fontSize: 'clamp(1.02rem, 1.4vw, 1.18rem)', color: 'rgba(255,255,255,0.84)', lineHeight: 1.65, maxWidth: 720 }}>
            For three days, Miami was where football’s global decision-makers came to meet, be seen and move
            business forward. At Nu Stadium, the leaders shaping clubs, leagues, federations, investment, media,
            technology and brands met across the main stage, the exhibition floor and the private conversations
            between them.
          </p>
          <p className="miami-body" style={{ fontSize: 'clamp(1.02rem, 1.4vw, 1.18rem)', color: 'rgba(255,255,255,0.84)', lineHeight: 1.65, maxWidth: 720, marginTop: 16 }}>
            Soccerex Miami 2026 reset what the business of football can feel like when the right people are in the
            room, and the momentum is carrying forward through the Soccerex Deal Network and into what comes next.
          </p>
          <p className="miami-headline" style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)', color: '#FF4D8D', lineHeight: 1.5, maxWidth: 760, marginTop: 'clamp(18px,2.2vw,24px)', textTransform: 'none', letterSpacing: '0.01em' }}>
            850+ organizations. 150+ clubs, leagues and federations. 90+ speakers. 30+ exhibitors.
            One stadium full of possibility.
          </p>

          <div className="flex flex-wrap items-center gap-6 lg:gap-8" style={{ marginTop: 'clamp(30px,4vw,44px)' }}>
            <div>
              <p className="miami-subhead mb-1" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10 }}><Calendar size={12} className="inline mr-1" /> Dates</p>
              <p className="miami-headline" style={{ color: '#fff', fontSize: '1.05rem', letterSpacing: '0.04em' }}>September 23 to 25, 2026</p>
            </div>
            <span aria-hidden style={{ width: 7, height: 7, background: '#E91E63' }} />
            <div>
              <p className="miami-subhead mb-1" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10 }}><MapPin size={12} className="inline mr-1" /> Venue</p>
              <p className="miami-headline" style={{ color: '#fff', fontSize: '1.05rem', letterSpacing: '0.04em', textTransform: 'none' }}>Nu Stadium, Miami</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3" style={{ marginTop: 'clamp(28px,3.5vw,40px)' }}>
            <a href="#the-room" className="miami-pill-primary">
              Explore the 2026 experience <ArrowRight size={15} />
            </a>
            <InquiryModalButton
              kind="preregister"
              label="Join the next edition"
              modalTitle="Join the next edition"
              eyebrow="The next Miami edition"
              intro="Leave your details and we will send the dates, the venue and the delegate rate before they go public."
              schema={packRequestSchema}
              extraPayload={{ event_slug: 'miami-2027', interest: 'Miami 2027 pre-registration', source: 'miami-2026-recap-hero', marketing_opt_in: true }}
              submitLabel="Register interest"
              successTitle="You are on the list."
              successBody="We will be in touch with dates for the next Miami edition before they go public."
              bookingUrl={bookCallUrl('success-miami-2027')}
              buttonClassName="miami-pill-outline"
            >
              Join the next edition <ArrowRight size={15} />
            </InquiryModalButton>
          </div>
        </div>
      </section>

      {/* ─── THE PROOF BAR ───────────────────────────────────────────────── */}
      <section style={{ background: '#FFF8F4', padding: 'clamp(40px,5vw,64px) clamp(24px,5vw,80px) clamp(34px,4vw,48px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div className="miami-proof">
            {NUMBERS.map((n) => (
              <div key={n.label}>
                <p className="miami-headline miami-proof-figure">{n.figure}</p>
                <p className="miami-body miami-proof-label">{n.label}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          .miami-proof { display: grid; grid-template-columns: 1fr 1fr; gap: 22px 18px; }
          .miami-proof > div { border-top: 2px solid rgba(13,27,42,0.12); padding-top: 12px; }
          .miami-proof > div:last-child { grid-column: 1 / -1; }
          .miami-proof-figure { font-size: 1.5rem; line-height: 1.05; color: #0D1B2A; }
          .miami-proof-label { font-size: 0.82rem; color: #5b6b7c; margin-top: 6px; line-height: 1.4; }
          @media (min-width: 720px) {
            .miami-proof { grid-template-columns: repeat(5, 1fr); gap: 26px; }
            .miami-proof > div:last-child { grid-column: auto; }
            .miami-proof-figure { font-size: clamp(1.7rem, 2.6vw, 2.2rem); }
            .miami-proof-label { font-size: 0.88rem; }
          }
        `}</style>
      </section>

      {/* ─── THE ROOM ────────────────────────────────────────────────────── */}
      <section id="the-room" style={{ scrollMarginTop: 72, background: '#FFFFFF', padding: 'clamp(30px,4vw,48px) clamp(24px,5vw,80px) clamp(64px,8vw,100px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <h2 className="miami-headline" style={{ textWrap: 'balance', fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: '#0D1B2A', marginBottom: 'clamp(18px,2.4vw,24px)' }}>
            The room everyone in football was talking about
          </h2>
          <p className="miami-body" style={{ fontSize: '1rem', color: '#3a4a5a', lineHeight: 1.6, maxWidth: 760, marginBottom: 14 }}>
            Leaders who can spend months trying to reach one another were shoulder to shoulder at Nu Stadium for
            three days. The World Cup, global federations, major clubs, investors, broadcasters and the companies
            building football’s future were in the same building, on the stage and across the exhibition floor.
          </p>
          <p className="miami-body" style={{ fontSize: '1rem', color: '#3a4a5a', lineHeight: 1.6, maxWidth: 760, marginBottom: 'clamp(28px,3.4vw,38px)' }}>
            The result was bigger than a conference agenda. It was a rare concentration of influence, ambition and
            access, and a new benchmark for bringing football’s business community together.
          </p>
          <h3 className="miami-headline" style={{ fontSize: '1.05rem', color: '#0D1B2A', marginBottom: 12, textTransform: 'none', letterSpacing: '0.02em' }}>
            The global game, in one place
          </h3>
          <p className="miami-body" style={{ fontSize: '1rem', color: '#3a4a5a', lineHeight: 1.6, maxWidth: 820, marginBottom: 'clamp(30px,3.6vw,42px)' }}>
            From the leaders delivering FIFA World Cup 26 across all three host nations to global club brands,
            influential leagues, broadcasters, institutional capital and the companies building football’s future,
            Soccerex Miami put the people shaping the game within a few steps of one another. The room spanned:
          </p>
          <div className="miami-cohorts">
            {COHORTS.map((c) => (
              <div key={c.heading}>
                <h3 className="miami-headline" style={{ fontSize: '1rem', color: '#007C91', marginBottom: 10, textTransform: 'none', letterSpacing: '0.02em' }}>{c.heading}</h3>
                <p className="miami-body leading-relaxed" style={{ fontSize: '0.94rem', color: '#3a4a5a' }}>{c.names}</p>
              </div>
            ))}
          </div>
          <p className="miami-body" style={{ fontSize: '1rem', color: '#3a4a5a', lineHeight: 1.65, maxWidth: 820, marginTop: 'clamp(28px,3.4vw,38px)' }}>
            Together these names signal the breadth of a gathering that brought more than 850 organizations into one
            place: football leadership, capital, media and innovation rarely found under one roof.
          </p>
          <style>{`
            .miami-cohorts { display: grid; gap: 34px 48px; grid-template-columns: 1fr; }
            @media (min-width: 760px) { .miami-cohorts { grid-template-columns: 1fr 1fr; } }
          `}</style>


        </div>
      </section>

      {/* ─── WHAT THE ROOM RETURNED ──────────────────────────────────────── */}
      <section style={{ background: '#FFF8F4', padding: 'clamp(64px,8vw,104px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <h3 className="miami-headline" style={{ fontSize: '1.05rem', color: '#0D1B2A', marginBottom: 12, textTransform: 'none', letterSpacing: '0.02em' }}>
            Being in the room put organizations in the story
          </h3>
          <p className="miami-body" style={{ fontSize: '1rem', color: '#3a4a5a', lineHeight: 1.65, maxWidth: 820, marginBottom: 'clamp(32px,4vw,48px)' }}>
            Visibility at Soccerex Miami came from proximity to the people and the conversations shaping football.
            Organizations appeared inside a shared global showcase across the conference, the exhibition floor and
            the coverage that carries Miami forward, so a club, federation, investor or brand could be found in
            context, alongside the leaders, partners and opportunities it came to Miami to reach. The Deal Network
            extends that visibility into an ongoing channel for relevant introductions.
          </p>

          <h2 className="miami-headline" style={{ textWrap: 'balance', fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: '#0D1B2A', marginBottom: 'clamp(18px,2.4vw,26px)', maxWidth: 780 }}>
            A clear return on being in the room
          </h2>
          <p className="miami-body" style={{ fontSize: '1rem', color: '#3a4a5a', lineHeight: 1.6, maxWidth: 820, marginBottom: 'clamp(20px,2.4vw,28px)' }}>
            The case was built into the room, and each part of the football ecosystem had a different reason to be there.
          </p>
          <ul className="miami-returns">
            {RETURNS.map((r) => (
              <li key={r} className="miami-body" style={{ fontSize: '0.98rem', color: '#3a4a5a', lineHeight: 1.6 }}>{r}</li>
            ))}
          </ul>
          <style>{`
            .miami-returns { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; max-width: 900px; }
            .miami-returns li { padding-left: 20px; position: relative; }
            .miami-returns li::before { content: ''; position: absolute; left: 0; top: 9px; width: 7px; height: 7px; background: #E91E63; }
          `}</style>
          <p className="miami-body" style={{ fontSize: '1rem', color: '#3a4a5a', lineHeight: 1.65, maxWidth: 820, marginTop: 'clamp(24px,3vw,34px)' }}>
            More than 2,700 app connections and 5,300 messages captured part of that activity. The larger return was
            the time and the distance removed between people who could do meaningful business together. Soccerex
            compressed months of relationship building into three days and gave those relationships a way to
            continue afterward. Not every return appears as a deal before the doors close; many begin as access,
            insight, visibility and an introduction that keeps working after Miami.
          </p>
        </div>
      </section>

      {/* ─── DEAL NETWORK ────────────────────────────────────────────────── */}
      <section style={{ background: '#0D1B2A', padding: 'clamp(72px,9vw,118px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gap: 'clamp(28px,4vw,56px)', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center' }}>
          <div>
            <h2 className="miami-headline" style={{ textWrap: 'balance', fontSize: 'clamp(1.8rem, 3.4vw, 2.5rem)', color: '#FFFFFF', lineHeight: 1.1, marginBottom: 'clamp(16px,2vw,22px)' }}>
              The introductions that can change <span style={{ color: '#FF4D8D' }}>what happens next</span>
            </h2>
            <p className="miami-body leading-relaxed" style={{ fontSize: '1.02rem', color: 'rgba(255,255,255,0.84)', marginBottom: 16 }}>
              The most valuable part of Miami was not confined to the stage. It happened between sessions, on the
              exhibition floor, in private meetings and across the city, when the people behind football’s biggest
              opportunities could finally meet face to face.
            </p>
            <p className="miami-body leading-relaxed" style={{ fontSize: '1.02rem', color: 'rgba(255,255,255,0.84)', marginBottom: 16 }}>
              Over three days, delegates made more than 2,700 connections and exchanged more than 5,300 messages
              through the official event app. The value sits in the quality behind those numbers: access to
              football’s decision-makers, strategic capital, commercial partners and people able to open a door or
              move an idea forward. When the right people meet in the right setting, a first conversation can become
              the relationship that changes the next year of business.
            </p>
            <p className="miami-body leading-relaxed" style={{ fontSize: '1.02rem', color: 'rgba(255,255,255,0.84)', marginBottom: 16 }}>
              That momentum does not end when the doors close. The Soccerex Deal Network carries that week forward all year. It is a curated introduction platform
              across clubs, leagues, federations, investors, brands, technology and media, and a person reviews every
              approach before it is made, which is what protects the relevance of each one.
            </p>
            <p className="miami-body leading-relaxed" style={{ fontSize: '1.02rem', color: 'rgba(255,255,255,0.84)', marginBottom: 26 }}>
              Miami made access immediate. The Deal Network keeps the opportunity alive.
            </p>
            <NextMoves source="miami-2026-recap-deal-network" />
          </div>
          <div>
            <img src={frame('networking', '-w800')} alt="Delegates meeting between sessions at Nu Stadium"
              loading="lazy" style={{ width: '100%', aspectRatio: '3 / 2', objectFit: 'cover', borderRadius: 10, display: 'block', boxShadow: '0 24px 60px rgba(0,0,0,0.45)' }} />
          </div>
        </div>
      </section>

      {/* ─── ON STAGE ────────────────────────────────────────────────────── */}
      <section style={{ background: '#FFF8F4', padding: 'clamp(72px,9vw,120px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ marginBottom: 'clamp(32px,4vw,48px)' }}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="miami-headline" style={{ textWrap: 'balance', fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: '#0D1B2A', maxWidth: 720 }}>
                The stage that brought football’s biggest conversations to Miami
              </h2>
              <Link to={eventAgenda(MIAMI_EVENT_SLUG)} className="miami-pill-outline">
                The full agenda and speakers <ArrowRight size={15} />
              </Link>
            </div>
            <p className="miami-body" style={{ fontSize: '1rem', color: '#3a4a5a', lineHeight: 1.6, maxWidth: 680, marginTop: 14 }}>
              Soccerex Miami delivered the kind of programming the industry talks about long after the event: global
              perspectives, hard business conversations and people with real authority in the room. More than 90
              speakers took part across 28 sessions, with leaders from football’s most influential properties sharing
              the stage with the investors, innovators and commercial minds reshaping the game.
            </p>
          </div>
          <div className="grid gap-7" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {THEMES.map((t) => (
              <article key={t.title} className="miami-card-light" style={{ overflow: 'hidden', padding: 0 }}>
                <img src={frame(t.photo, '-w800')} alt="" aria-hidden loading="lazy"
                  style={{ width: '100%', aspectRatio: '3 / 2', objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: 'clamp(20px,2.2vw,28px)' }}>
                  <h3 className="miami-headline" style={{ fontSize: '1.1rem', color: '#0D1B2A', marginBottom: 10, textTransform: 'none', letterSpacing: '0.01em' }}>{t.title}</h3>
                  <p className="miami-body leading-relaxed" style={{ fontSize: '0.93rem', color: '#3a4a5a' }}>{t.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── THE MOMENT ──────────────────────────────────────────────────── */}
      <section style={{ background: '#FFFFFF', padding: 'clamp(72px,9vw,120px) clamp(24px,5vw,80px)', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div className="miami-moment-top">
            <div>
              <h2 className="miami-headline" style={{ textWrap: 'balance', fontSize: 'clamp(1.8rem, 3.6vw, 2.7rem)', color: '#0D1B2A', lineHeight: 1.1, marginBottom: 'clamp(16px,2vw,22px)' }}>
                DJ Khaled joined Roc Nation <span style={{ color: '#E91E63' }}>on the Soccerex stage</span>
              </h2>
              <p className="miami-body leading-relaxed" style={{ fontSize: '1.02rem', color: '#3a4a5a', marginBottom: 16 }}>
                Roc Nation Sports International closed the first day with Built, Not Bought, their case for how a modern football agency gets built. They opened it with the film from their World Cup campaign, the one Khaled fronts, and he came out at the end of it in an Inter Miami shirt, sat down with the panel and handed it to Michael Yormark.
              </p>
              <p className="miami-body leading-relaxed" style={{ fontSize: '1.02rem', color: '#3a4a5a' }}>
                Phones went up across the room. Michael Yormark, Frederico Pena, Nathan Campbell, Rob Simpkins and Alan Redmond then spent half an hour on how they build a roster, with Diego Arrioja of Telemundo hosting.
              </p>
            </div>
            <div>
              <img src={frame('khaled-mic')} alt="DJ Khaled on stage at Nu Stadium with Michael Yormark and the Roc Nation Sports International panel"
                loading="lazy" style={{ width: '100%', aspectRatio: '3 / 2', objectFit: 'cover', borderRadius: 10, display: 'block', boxShadow: '0 24px 60px rgba(13,27,42,0.22)' }} />
            </div>
          </div>
          <style>{`
            .miami-moment-top { display: grid; gap: clamp(28px,4vw,56px); grid-template-columns: 1fr; align-items: start; }
            @media (min-width: 900px) { .miami-moment-top { grid-template-columns: 1fr 1fr; } }
          `}</style>

          <div className="miami-moment-strip">
            <video controls playsInline preload="none" poster={`${ASSET}/video/dj-khaled-poster.jpg`}>
              <source src={`${ASSET}/video/dj-khaled-soccerex-miami-2026.mp4`} type="video/mp4" />
              Your browser cannot play this video.
            </video>
            {[
              ['khaled-phones', 'The room filming the Built, Not Bought panel'],
              ['khaled-arrioja', 'DJ Khaled on stage with Diego Arrioja of Telemundo, who hosted the panel'],
              ['khaled-artwork', 'Roc Nation Sports International presented with a commissioned artwork on stage'],
            ].map(([slug, alt]) => (
              <img key={slug} src={frame(slug, '-w800')} alt={alt} loading="lazy" />
            ))}
          </div>
          <style>{`
            .miami-moment-strip { --row: clamp(150px, 15vw, 205px); display: grid; gap: 12px; margin-top: clamp(28px,3.5vw,44px);
              grid-template-columns: 1fr 1fr; align-items: stretch; }
            @media (min-width: 820px) { .miami-moment-strip { grid-template-columns: calc(var(--row) * 9 / 16) repeat(3, 1fr); } }
            .miami-moment-strip img, .miami-moment-strip video { width: 100%; height: var(--row); object-fit: cover;
              border-radius: 6px; display: block; background: #000; }
          `}</style>
        </div>
      </section>

      {/* ─── PARTNERS AND EXHIBITORS ─────────────────────────────────────── */}
      <section style={{ background: '#FFFFFF', padding: 'clamp(72px,9vw,118px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <h2 className="miami-headline" style={{ textWrap: 'balance', fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: '#0D1B2A', marginBottom: 'clamp(18px,2.4vw,26px)', maxWidth: 820 }}>
            Put your brand where football’s decision-makers gather
          </h2>
          <div className="miami-partner-grid">
            <div>
              <p className="miami-body leading-relaxed" style={{ fontSize: '1rem', color: '#3a4a5a', marginBottom: 16 }}>
                Soccerex Miami was a live platform for visibility, connection and relevance, placing partners and
                exhibitors inside the environment where clubs, leagues, federations, investors, broadcasters and
                brands were already meeting.
              </p>
              <p className="miami-body leading-relaxed" style={{ fontSize: '1rem', color: '#3a4a5a', marginBottom: 16 }}>
                Concacaf, Roc Nation Sports International, FC Barcelona, SPORTFIVE, Inter Miami CF and Nu Stadium
                shaped the experience. Across the exhibition floor, 30+ exhibitors brought the ecosystem to life, from
                elite performance and technology to architecture, infrastructure, investment and mobility.
              </p>
              <p className="miami-body leading-relaxed" style={{ fontSize: '1rem', color: '#3a4a5a', marginBottom: 16 }}>
                Concacaf hosted conversations from its Gold Cup stand and FC Barcelona activated directly across
                the way, with Catapult, LaBella Associates, LandTek, Terraplas and Scout Lab AI among the
                companies that took the rest of the floor.
              </p>
              <p className="miami-body leading-relaxed" style={{ fontSize: '1rem', color: '#3a4a5a', marginBottom: 26 }}>
                For participating brands, the value was being visible in the middle of the action: in a stadium full
                of football’s business community, alongside a major conference program and an active exhibition
                floor. This is the Soccerex opportunity, to give a brand a place in the conversation and to keep
                building those relationships after Miami through the Deal Network.
              </p>
              <p className="miami-body leading-relaxed" style={{ fontSize: '1rem', color: '#3a4a5a', marginBottom: 26 }}>
                Thank you to neaū water for keeping the community moving all week, and to Blacklane, Official
                Chauffeur Partner, for moving delegates between the airport, the hotels and Nu Stadium.
              </p>
              <InquiryModalButton
                kind="sponsorship-inquiry"
                label="Partner with Soccerex"
                modalTitle="Partner with Soccerex"
                eyebrow="Partnership and exhibition"
                intro="Tell us what you want to reach in Miami and we will come back with the formats and the rates."
                schema={sponsorshipSchema}
                extraPayload={{ event_slug: MIAMI_EVENT_SLUG, interest: 'Partnership', source: 'miami-2026-recap-partners' }}
                submitLabel="Send inquiry"
                successTitle="Thank you."
                successBody="Our partnerships team will come back to you with formats and availability."
                bookingUrl={bookCallUrl('success-partnership')}
                buttonClassName="miami-pill-primary"
              >
                Partner with Soccerex <ArrowRight size={15} />
              </InquiryModalButton>
            </div>
            <div className="miami-booths">
              {[
                ['concacaf-booth-2', 'The Concacaf stand on the exhibition floor at Nu Stadium'],
                ['barca-booth-2', 'The FC Barcelona stand on the exhibition floor'],
                ['striker-booth', 'The Striker and PES Pro Event Solutions shooting activation'],
                ['gis-stand', 'The Global Institute of Sport stand'],
                ['art-stand', 'The art stand on the exhibition floor'],
                ['concacaf-lounge', 'The Concacaf lounge on the exhibition floor'],
              ].map(([slug, alt]) => (
                <img key={slug} src={frame(slug, '-w800')} alt={alt} loading="lazy" />
              ))}
            </div>
          </div>
          <style>{`
            .miami-partner-grid { display: grid; gap: clamp(28px,4vw,52px); grid-template-columns: 1fr; align-items: center; }
            @media (min-width: 900px) { .miami-partner-grid { grid-template-columns: 1.05fr 1fr; } }
            .miami-booths { display: grid; gap: 10px; grid-template-columns: 1fr 1fr; }
            .miami-booths img { width: 100%; aspect-ratio: 3 / 2; object-fit: cover; border-radius: 6px; display: block; }
          `}</style>
        </div>
      </section>

      {/* ─── HERSOCCEREX ─────────────────────────────────────────────────── */}
      <section style={{ background: '#FFF8F4', padding: 'clamp(72px,9vw,118px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gap: 'clamp(28px,4vw,56px)', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center' }}>
          <div>
            <img src={frame('women', '-w800')} alt="The Commercial Power of Women’s Football panel at Nu Stadium"
              loading="lazy" style={{ width: '100%', aspectRatio: '3 / 2', objectFit: 'cover', borderRadius: 10, display: 'block' }} />
          </div>
          <div>
            <h2 className="miami-headline" style={{ textWrap: 'balance', fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: '#0D1B2A', marginBottom: 'clamp(16px,2vw,22px)' }}>
              HerSoccerex: a new room for women leading the game
            </h2>
            <p className="miami-body leading-relaxed" style={{ fontSize: '1rem', color: '#3a4a5a', marginBottom: 16 }}>
              Miami marked the launch of HerSoccerex, a platform built to bring together the women shaping the
              future of football. The inaugural Founding Table Afternoon Tea at the Savoy Hotel and Beach Club gathered leaders,
              executives, players and rising voices for honest conversation and introductions that lead somewhere.
            </p>
            <p className="miami-body leading-relaxed" style={{ fontSize: '1rem', color: '#3a4a5a', marginBottom: 16 }}>
              It was intimate by design, and the objective was a room where conversations turn into mentorship,
              collaboration, commercial opportunity and a stronger pathway for women across the game. Heidi
              Pellerano, Amanda Vandervort and Laura Biondo helped set the tone.
            </p>
            <p className="miami-body leading-relaxed" style={{ fontSize: '1rem', color: '#3a4a5a', marginBottom: 26 }}>
              HerSoccerex is a long-term commitment to making sure the women building football are seen, connected
              and supported.
            </p>
            <Link to={HERSOCCEREX} className="miami-pill-primary">
              Discover HerSoccerex <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── IMPACT ──────────────────────────────────────────────────────── */}
      <section style={{ background: '#FFFFFF', padding: 'clamp(72px,9vw,118px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gap: 'clamp(28px,4vw,56px)', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center' }}>
          <div>
            <h2 className="miami-headline" style={{ textWrap: 'balance', fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: '#0D1B2A', marginBottom: 'clamp(16px,2vw,22px)' }}>
              The game gave back
            </h2>
            <p className="miami-body leading-relaxed" style={{ fontSize: '1rem', color: '#3a4a5a', marginBottom: 16 }}>
              Before the conference took over Nu Stadium, Soccerex Impact brought football back to what matters
              most: young people, opportunity and community. The Soccerex Community Impact Event filled the stadium
              mini pitches with at-risk youth for an afternoon of football, confidence and connection, created with
              Fútbol con Corazón, Miami Scores, love.fútbol and Special Olympics.
            </p>
            <p className="miami-body leading-relaxed" style={{ fontSize: '1rem', color: '#3a4a5a', marginBottom: 26 }}>
              DaGrosa Capital Partners, Royal Caribbean, Baptist Health, Soccer United and TAPEDESIGN backed the
              day with coaching, play, equipment and the kind of experience every young player deserves to have
              around the game.
            </p>
            <p className="miami-body leading-relaxed" style={{ fontSize: '1rem', color: '#3a4a5a', marginBottom: 26 }}>
              Soccerex Miami opened its doors to the future of the game as well as to its business.
            </p>
            <InquiryModalButton
              kind="sponsorship-inquiry"
              label="Support Soccerex Impact"
              modalTitle="Support Soccerex Impact"
              eyebrow="Soccerex Impact"
              intro="Tell us how your organization wants to take part and we will come back with the ways in."
              schema={sponsorshipSchema}
              extraPayload={{ event_slug: MIAMI_EVENT_SLUG, interest: 'Soccerex Impact', source: 'miami-2026-recap-impact' }}
              submitLabel="Send inquiry"
              successTitle="Thank you."
              successBody="We will be in touch about taking part in the next Community Impact Event."
              bookingUrl={bookCallUrl('success-impact')}
              buttonClassName="miami-pill-primary"
            >
              Support Soccerex Impact <ArrowRight size={15} />
            </InquiryModalButton>
          </div>
          <div>
            <img src={frame('impact-youth', '-w800')} alt="Young players at the Soccerex Community Impact Event"
              loading="lazy" style={{ width: '100%', aspectRatio: '3 / 2', objectFit: 'cover', borderRadius: 10, display: 'block' }} />
          </div>
        </div>
      </section>

      {/* ─── GALLERY ─────────────────────────────────────────────────────── */}
      <section id="gallery" style={{ background: '#FFF8F4', padding: 'clamp(72px,9vw,120px) clamp(24px,5vw,80px)', scrollMarginTop: 80 }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ marginBottom: 'clamp(28px,3.5vw,44px)', maxWidth: 700 }}>
            <h2 className="miami-headline" style={{ textWrap: 'balance', fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: '#0D1B2A', marginBottom: 14 }}>
              Look what happens when football’s world comes together
            </h2>
            <p className="miami-body" style={{ fontSize: '1rem', color: '#3a4a5a', lineHeight: 1.6 }}>
              The packed rooms, the unexpected introductions, the conversations on the concourse, the energy on the
              exhibition floor and the big-stage moments that made Miami feel like the center of the football
              universe. This is Soccerex Miami 2026.
            </p>
          </div>

          <div className="miami-gallery-grid">
            {visibleFrames.map((g, i) => (
              <button key={g.slug} onClick={() => setOpen(i)} className="miami-gallery-tile" aria-label={`Open photograph: ${g.alt}`}>
                <img src={frame(g.slug, '-w800')} alt={g.alt} loading="lazy" />
              </button>
            ))}
          </div>
          <style>{`
            .miami-gallery-grid { display: grid; gap: 14px; grid-template-columns: repeat(2, 1fr); }
            @media (min-width: 760px)  { .miami-gallery-grid { grid-template-columns: repeat(3, 1fr); } }
            .miami-gallery-tile { padding: 0; border: none; background: #0D1B2A; cursor: pointer; overflow: hidden; border-radius: 4px; display: block; }
            .miami-gallery-tile img { width: 100%; aspect-ratio: 3 / 2; object-fit: cover; display: block; transition: transform .45s ease, opacity .3s ease; }
            .miami-gallery-tile:hover img, .miami-gallery-tile:focus-visible img { transform: scale(1.04); opacity: 0.92; }
          `}</style>

          <div className="flex flex-wrap items-center gap-4" style={{ marginTop: 26 }}>
            {!showAllFrames && (
              <button type="button" onClick={() => setShowAllFrames(true)} className="miami-pill-outline">
                View more <ArrowRight size={15} />
              </button>
            )}
            <p className="miami-body" style={{ fontSize: '0.82rem', color: '#8a97a5' }}>
              Press and partners can{' '}
              <Link to={`${CONTACT}?type=press`} style={{ color: '#8a97a5', textDecoration: 'underline' }}>request the full set</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* ─── THE PEOPLE ON STAGE ─────────────────────────────────────────── */}
      <SelectedSpeakers
        slug={MIAMI_EVENT_SLUG}
        limit={12}
        heading={<>The Voices People <span className="miami-text-gradient">Flew In to Hear</span></>}
      />

      <BrandWall
        heading={<>Thirty Years of Building <span style={{ color: '#E91E63' }}>This Room</span></>}
        intro="Clubs, leagues, federations and brands from across the Soccerex network."
      />

      {/* ─── THE PEOPLE WHO BUILT IT ─────────────────────────────────────── */}
      <section style={{ background: '#0D1B2A', padding: 'clamp(72px,9vw,120px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <h2 className="miami-headline" style={{ textWrap: 'balance', fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: '#FFFFFF', marginBottom: 'clamp(14px,2vw,20px)' }}>
            The people who built the week
          </h2>
          <p className="miami-body" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.65, maxWidth: 720, marginBottom: 'clamp(36px,4.5vw,54px)' }}>
            A few hundred people spent the better part of a year on this week. These are the ones who made it what it was.
          </p>
          <div className="grid gap-x-10 gap-y-9" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {THANKS.map((t) => (
              <div key={t.heading}>
                <h3 className="miami-headline" style={{ fontSize: '1rem', color: '#FF4D8D', marginBottom: 10, textTransform: 'none', letterSpacing: '0.02em' }}>{t.heading}</h3>
                <p className="miami-body leading-relaxed" style={{ fontSize: '0.93rem', color: 'rgba(255,255,255,0.78)' }}>{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── KEEP READING ────────────────────────────────────────────────── */}
      <section style={{ background: '#FFFFFF', padding: 'clamp(64px,8vw,104px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <h2 className="miami-headline" style={{ textWrap: 'balance', fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: '#0D1B2A', marginBottom: 'clamp(28px,3.5vw,42px)' }}>
            What the week left behind
          </h2>
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {[
              { to: eventAgenda(MIAMI_EVENT_SLUG), title: 'Every session, every speaker', body: 'The running order as it was delivered, with the people who sat on each panel.' },
              { to: MIAMI_2026_PRESS_RELEASE, title: 'The announcements', body: 'What we published in the run up to the event and during it.' },
              { to: INSIGHTS, title: 'Insights', body: 'Reporting from the Soccerex desk, including the partner news out of Miami.' },
              { to: DEAL_NETWORK, title: 'Deal Network', body: 'The introductions carry on through the year, reviewed by a person before they go.' },
            ].map((c) => (
              <Link key={c.title} to={c.to} className="miami-card-light" style={{ textDecoration: 'none', padding: 'clamp(22px,2.4vw,28px)', display: 'block' }}>
                <h3 className="miami-headline" style={{ fontSize: '1.02rem', color: '#0D1B2A', marginBottom: 10, textTransform: 'none', letterSpacing: '0.02em' }}>{c.title}</h3>
                <p className="miami-body" style={{ fontSize: '0.92rem', color: '#3a4a5a', lineHeight: 1.6 }}>{c.body}</p>
                <span className="miami-subhead inline-flex items-center gap-1.5" style={{ color: '#E91E63', fontSize: 11, marginTop: 16 }}>
                  Open <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEXT ────────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--miami-sunset)', padding: 'clamp(70px,9vw,118px) clamp(24px,5vw,80px)' }}>
        <div className="text-center" style={{ maxWidth: 780, margin: '0 auto' }}>
          <h2 className="miami-headline" style={{ textWrap: 'balance', fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#FFFFFF', marginBottom: 18 }}>
            If you were there, you know. If you missed it, the next room is yours to enter
          </h2>
          <p className="miami-body" style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.65, marginBottom: 30 }}>
            Soccerex Miami 2026 was a starting point. The people who were there are already carrying the
            conversations forward, and the next edition will build on the standard Miami set, with more access, more
            opportunity and even more of the global game in the room.
          </p>
          <p className="miami-body" style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.65, marginBottom: 30 }}>
            The relationships formed in Miami continue through the Soccerex Deal Network, and the conversations on
            investment, women’s football, media, infrastructure, technology and the 2026 World Cup legacy are only
            getting started. Be first to hear the next dates, priority delegate opportunities and partnership news.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <InquiryModalButton
              kind="preregister"
              label="Register your interest"
              modalTitle="Register your interest"
              eyebrow="The next Miami edition"
              intro="Leave your details and we will send the dates, the venue and the delegate rate before they go public."
              schema={packRequestSchema}
              extraPayload={{ event_slug: 'miami-2027', interest: 'Miami 2027 pre-registration', source: 'miami-2026-recap-footer', marketing_opt_in: true }}
              submitLabel="Register interest"
              successTitle="You are on the list."
              successBody="We will be in touch with dates for the next Miami edition before they go public."
              bookingUrl={bookCallUrl('success-miami-2027')}
              buttonClassName="miami-pill-primary"
            >
              Register your interest <ArrowRight size={15} />
            </InquiryModalButton>
            <Link to={DEAL_NETWORK} className="miami-pill-outline">
              Explore the Deal Network <ArrowRight size={15} />
            </Link>
            <Link to={EUROPE_2026} className="miami-pill-outline">
              Soccerex Europe 2026
            </Link>
          </div>
        </div>
      </section>

      {open !== null && <Lightbox index={open} onClose={() => setOpen(null)} onMove={move} />}
    </div>
  )
}
