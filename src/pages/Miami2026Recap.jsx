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

/* Rounded from Soccerex registration, program and event-app figures, September 2026. */
const NUMBERS = [
  { figure: '850+', label: 'organizations represented' },
  { figure: 'Nearly 150', label: 'clubs, leagues and federations' },
  { figure: '90+', label: 'speakers on stage' },
  { figure: '30', label: 'exhibitors on the floor' },
  { figure: '2,700+', label: 'connections through the event app' },
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
    title: 'Where the money goes next',
    photo: 'investment',
    body: 'Football Investment Strategies opened the conference with Joseph DaGrosa Jr. and Suvin Malik of Fortress Investment Group, and the thread ran through the week into State of Global Football Business in 2026.',
  },
  {
    title: 'What a World Cup leaves behind',
    photo: 'argentina',
    body: 'For the first time the FIFA World Cup 26 Chief Tournament Officers for the United States, Mexico and Canada shared one Soccerex stage, and Mexico’s legacy panel brought the federation, TelevisaUnivision and the host committee into the same argument.',
  },
  {
    title: 'Who pays for the broadcast',
    photo: 'media',
    body: 'Alexi Lalas took Football’s Media Future through rights, streaming and what the new media era costs, with Bundesliga Americas and Concacaf on the panel.',
  },
  {
    title: 'The commercial case for women’s football',
    photo: 'women',
    body: 'Paul Barber OBE, Alessandra Nencioni of Napoli Women, Amanda Vandervort and Heidi Pellerano made it, and Road to Brazil 2027 picked it up the next morning.',
  },
  {
    title: 'Building the next generation',
    photo: 'barca',
    body: 'FC Barcelona explained how it makes commercial decisions in the Americas, the academies panel put Barça Academy, Orlando City and the Global Institute of Sport side by side, and Roc Nation closed day one on how to build a football agency.',
  },
  {
    title: 'Stadiums, surfaces and the front office',
    photo: 'stadiums',
    body: 'Dan Meis, GMP Architekten, Buro Happold, Landtek and LaBella took apart what a modern venue costs to build and to run, and Tech in Football did the same for the front office.',
  },
]

/* The first twelve are the curated set the page opens on; the rest unfold on request. */
const FEATURED_COUNT = 12
const GALLERY = [
  /* The twelve the page opens on: the names people flew in to hear and the
     moments that tell the week, and none of them reused from the sections
     above. Captions say only what the frame shows or what its own name card
     on the LED wall says. */
  { slug: 'worldcup', alt: 'The FIFA World Cup 26 chief tournament officers for the United States, Mexico and Canada on one stage' },
  { slug: 'dagrosa', alt: 'Joseph DaGrosa Jr., chairman of Soccerex, on the main stage' },
  { slug: 'lalas', alt: 'Alexi Lalas of FOX Sports on the main stage' },
  { slug: 'guzan', alt: 'Brad Guzan, sporting advisor and club ambassador at Atlanta United' },
  { slug: 'curtis', alt: 'Ali Curtis, president of MLS NEXT PRO, alongside Brad Guzan' },
  { slug: 'pellerano', alt: 'Heidi Pellerano, chief commercial officer of Concacaf, on the main stage' },
  { slug: 'dorrance', alt: 'Anson Dorrance, coach emeritus of the United States and UNC women’s soccer' },
  { slug: 'meis', alt: 'The architect Dan Meis on the stadium panel' },
  { slug: 'navia-floor', alt: 'Guests in front of the Miami 2026 partner backdrop' },
  { slug: 'barca-booth', alt: 'The FC Barcelona stand serving delegates on the exhibition floor' },
  { slug: 'impact-joy', alt: 'Young players at the Soccerex Community Impact Event' },
  { slug: 'vip-evening', alt: 'Guests at the VIP evening at The Savoy' },

  /* Everything else, behind View more. */
  { slug: 'khaled-mic', alt: 'DJ Khaled on stage at Nu Stadium with the Roc Nation Sports International panel' },
  { slug: 'khaled-room', alt: 'The room on its feet for the Built, Not Bought panel' },
  { slug: 'khaled-artwork', alt: 'Roc Nation Sports International presented with a commissioned artwork on stage' },
  { slug: 'concacaf-booth-2', alt: 'The Concacaf stand on the exhibition floor at Nu Stadium' },
  { slug: 'barca-booth-2', alt: 'The FC Barcelona stand on the exhibition floor' },
  { slug: 'lalas-panel', alt: 'Football’s Media Future on the main stage, with FOX Sports and Bundesliga Americas on the panel' },
  { slug: 'fireside-wide', alt: 'Ali Curtis and Brad Guzan in conversation with Diego Arrioja of Telemundo' },
  { slug: 'women', alt: 'The Commercial Power of Women’s Football panel' },
  { slug: 'barber', alt: 'The Commercial Power of Women’s Football panel on the main stage' },
  { slug: 'investment', alt: 'The Football Investment Strategies panel on the main stage' },
  { slug: 'global', alt: 'State of Global Football Business in 2026 on the main stage' },
  { slug: 'media', alt: 'Football’s Media Future: rights, streaming and the new media era' },
  { slug: 'stadiums', alt: 'Building the Stage for the Modern Game, the stadium infrastructure panel' },
  { slug: 'tech', alt: 'Tech in Football: AI, performance and the modern front office' },
  { slug: 'barca', alt: 'Evolving Barça in the Americas on the main stage' },
  { slug: 'argentina', alt: 'The Argentina Era panel on day two' },
  { slug: 'stands', alt: 'Delegates watching a session from the stands at Nu Stadium' },
  { slug: 'packed', alt: 'A packed house watching a session at Nu Stadium' },
  { slug: 'audience', alt: 'The room on day two' },
  { slug: 'floor-group', alt: 'Delegates on the exhibition floor' },
  { slug: 'merch', alt: 'A delegate with a painting at Nu Stadium' },
  { slug: 'open', alt: 'The conference opens at Nu Stadium' },
  { slug: 'biondo', alt: 'A freestyle performance on the Soccerex stage' },
  { slug: 'concourse', alt: 'Delegates talking between sessions' },
  { slug: 'networking', alt: 'Delegates meeting between sessions' },
  { slug: 'meeting', alt: 'Two delegates in conversation on the concourse' },
  { slug: 'greeting', alt: 'Two delegates greeting each other between sessions' },
  { slug: 'venue', alt: 'Inside Nu Stadium' },
  { slug: 'ball', alt: 'The Soccerex match ball on the pitch at Nu Stadium' },
  { slug: 'impact', alt: 'The mini fields at Nu Stadium set up for the Community Impact Event' },
  { slug: 'impact-youth', alt: 'Young players lining up at the Soccerex Community Impact Event' },
  { slug: 'vip', alt: 'The Soccerex sign at the VIP evening at The Savoy' },
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
    body: '30 companies took stands and made the exhibition what delegates spent their breaks in. neaū water kept the room going across all three days, and Blacklane, our Official Chauffeur Partner, moved delegates between the airport, the hotels and the stadium.',
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
        <figcaption className="font-body text-center" style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.86rem', marginTop: 14 }}>
          {item.alt}
          <span style={{ color: 'rgba(255,255,255,0.4)', marginLeft: 10 }}>{index + 1} / {GALLERY.length}</span>
        </figcaption>
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
        description="More than 850 organizations, nearly 150 clubs, leagues and federations, 90 speakers and 30 exhibitors came to Nu Stadium for Soccerex Miami 2026. See who was in the room, and how the introductions carry on."
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
            A year’s worth of networking happened in three days. At Nu Stadium, the people running clubs, leagues,
            federations, investment, media and brands met on the main stage, on the exhibition floor and in the
            conversations between them, and the momentum carries on through the Soccerex Deal Network.
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

          <div style={{ marginTop: 'clamp(28px,3.5vw,40px)' }}>
            <NextMoves source="miami-2026-recap-hero" />
          </div>
        </div>
      </section>

      {/* ─── THE PROOF BAR ───────────────────────────────────────────────── */}
      <section style={{ background: '#FFFFFF', padding: 'clamp(48px,6vw,72px) clamp(24px,5vw,80px) clamp(40px,5vw,60px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div className="grid gap-y-10 gap-x-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
            {NUMBERS.map((n) => (
              <div key={n.label} className="text-center">
                <p className="miami-headline" style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.6rem)', color: '#E91E63', lineHeight: 1.05 }}>{n.figure}</p>
                <p className="miami-body" style={{ fontSize: '0.9rem', color: '#3a4a5a', marginTop: 10 }}>{n.label}</p>
              </div>
            ))}
          </div>
          <p className="miami-body text-center" style={{ fontSize: '0.82rem', color: '#8a97a5', marginTop: 22 }}>
            Rounded from Soccerex registration, program and event app figures.
          </p>
        </div>
      </section>

      {/* ─── THE ROOM ────────────────────────────────────────────────────── */}
      <section style={{ background: '#FFFFFF', padding: '0 clamp(24px,5vw,80px) clamp(64px,8vw,100px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <h2 className="miami-headline" style={{ textWrap: 'balance', fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: '#0D1B2A', marginBottom: 'clamp(18px,2.4vw,24px)' }}>
            The room everyone in football was talking about
          </h2>
          <p className="miami-body" style={{ fontSize: '1rem', color: '#3a4a5a', lineHeight: 1.6, maxWidth: 760, marginBottom: 14 }}>
            Leaders who can spend months trying to reach one another were shoulder to shoulder at Nu Stadium for
            three days. The World Cup, global federations, major clubs, investors, broadcasters and the companies
            building football’s future were in the same building, on the stage and across the exhibition floor.
          </p>
          <p className="miami-body" style={{ fontSize: '1rem', color: '#3a4a5a', lineHeight: 1.6, maxWidth: 760, marginBottom: 'clamp(30px,3.6vw,42px)' }}>
            These are some of the names that had someone on the stage or on the floor, out of more than 850
            organizations in the building. The delegate list ran to thirty nine pages.
          </p>
          <div className="miami-cohorts">
            {COHORTS.map((c) => (
              <div key={c.heading}>
                <h3 className="miami-headline" style={{ fontSize: '1rem', color: '#007C91', marginBottom: 10, textTransform: 'none', letterSpacing: '0.02em' }}>{c.heading}</h3>
                <p className="miami-body leading-relaxed" style={{ fontSize: '0.94rem', color: '#3a4a5a' }}>{c.names}</p>
              </div>
            ))}
          </div>
          <style>{`
            .miami-cohorts { display: grid; gap: 34px 48px; grid-template-columns: 1fr; }
            @media (min-width: 760px) { .miami-cohorts { grid-template-columns: 1fr 1fr; } }
          `}</style>

          <div className="miami-floor-two" style={{ marginTop: 'clamp(40px,5vw,64px)' }}>
            <figure style={{ margin: 0 }}>
              <img src={frame('concacaf-booth-2', '-w800')} alt="The Concacaf stand on the exhibition floor at Nu Stadium" loading="lazy" />
              <figcaption className="miami-body" style={{ fontSize: '0.88rem', color: '#607186', marginTop: 10 }}>
                Concacaf built a stand with its own coffee bar and a wall of Gold Cup artwork, and ran meetings out of it for three days.
              </figcaption>
            </figure>
            <figure style={{ margin: 0 }}>
              <img src={frame('barca-booth-2', '-w800')} alt="The FC Barcelona stand on the exhibition floor at Nu Stadium" loading="lazy" />
              <figcaption className="miami-body" style={{ fontSize: '0.88rem', color: '#607186', marginTop: 10 }}>
                FC Barcelona took the stand across from it. Thirty companies built on that floor, and the coffee between them ran all day.
              </figcaption>
            </figure>
          </div>
          <style>{`
            .miami-floor-two { display: grid; gap: 22px; grid-template-columns: 1fr; }
            @media (min-width: 760px) { .miami-floor-two { grid-template-columns: 1fr 1fr; gap: 28px; } }
            .miami-floor-two img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 8px; display: block; }
          `}</style>
        </div>
      </section>

      {/* ─── WHAT THE ROOM RETURNED ──────────────────────────────────────── */}
      <section style={{ background: '#FFF8F4', padding: 'clamp(64px,8vw,104px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <h2 className="miami-headline" style={{ textWrap: 'balance', fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: '#0D1B2A', marginBottom: 'clamp(18px,2.4vw,26px)', maxWidth: 780 }}>
            Every part of the game had a different reason to be there
          </h2>
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
            More than 2,700 connections and 5,300 messages went through the official event app, and 1,580 delegates
            registered on it. What those figures measure is the time taken out of the middle: the months it usually
            costs to get two people who should be doing business into the same conversation.
          </p>
        </div>
      </section>

      {/* ─── DEAL NETWORK ────────────────────────────────────────────────── */}
      <section style={{ background: '#0D1B2A', padding: 'clamp(72px,9vw,118px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gap: 'clamp(28px,4vw,56px)', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center' }}>
          <div>
            <h2 className="miami-headline" style={{ textWrap: 'balance', fontSize: 'clamp(1.8rem, 3.4vw, 2.5rem)', color: '#FFFFFF', lineHeight: 1.1, marginBottom: 'clamp(16px,2vw,22px)' }}>
              The introductions that change <span style={{ color: '#FF4D8D' }}>what happens next</span>
            </h2>
            <p className="miami-body leading-relaxed" style={{ fontSize: '1.02rem', color: 'rgba(255,255,255,0.84)', marginBottom: 16 }}>
              The most valuable part of Miami was not confined to the stage. It happened between sessions, on the
              exhibition floor, in private meetings and across the city, when the people behind football’s biggest
              opportunities could finally meet face to face.
            </p>
            <p className="miami-body leading-relaxed" style={{ fontSize: '1.02rem', color: 'rgba(255,255,255,0.84)', marginBottom: 16 }}>
              The Soccerex Deal Network carries that week forward all year. It is a curated introduction platform
              across clubs, leagues, federations, investors, brands, technology and media, and a person reviews every
              approach before it is made, which is what protects the relevance of each one.
            </p>
            <p className="miami-body leading-relaxed" style={{ fontSize: '1.02rem', color: 'rgba(255,255,255,0.84)', marginBottom: 26 }}>
              Miami made the access immediate. The Deal Network keeps it open.
            </p>
            <NextMoves source="miami-2026-recap-deal-network" />
          </div>
          <div>
            <img src={frame('networking', '-w800')} alt="Delegates meeting between sessions at Nu Stadium"
              loading="lazy" style={{ width: '100%', aspectRatio: '3 / 2', objectFit: 'cover', borderRadius: 10, display: 'block', boxShadow: '0 24px 60px rgba(0,0,0,0.45)' }} />
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
              ['khaled-room', 'The Built, Not Bought panel in front of a full room at Nu Stadium'],
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

      {/* ─── ON STAGE ────────────────────────────────────────────────────── */}
      <section style={{ background: '#FFF8F4', padding: 'clamp(72px,9vw,120px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ marginBottom: 'clamp(32px,4vw,48px)' }}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="miami-headline" style={{ textWrap: 'balance', fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: '#0D1B2A', maxWidth: 720 }}>
                The stage where three World Cup host nations sat down together
              </h2>
              <Link to={eventAgenda(MIAMI_EVENT_SLUG)} className="miami-pill-outline">
                The full agenda and speakers <ArrowRight size={15} />
              </Link>
            </div>
            <p className="miami-body" style={{ fontSize: '1rem', color: '#3a4a5a', lineHeight: 1.6, maxWidth: 680, marginTop: 14 }}>
              More than 90 speakers took 28 sessions over three days, and the people running the properties did the
              talking. These six show the level of the room.
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

      {/* ─── PARTNERS AND EXHIBITORS ─────────────────────────────────────── */}
      <section style={{ background: '#FFFFFF', padding: 'clamp(72px,9vw,118px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <h2 className="miami-headline" style={{ textWrap: 'balance', fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: '#0D1B2A', marginBottom: 'clamp(18px,2.4vw,26px)', maxWidth: 820 }}>
            Put your brand where football’s decision-makers gather
          </h2>
          <div className="miami-partner-grid">
            <div>
              <p className="miami-body leading-relaxed" style={{ fontSize: '1rem', color: '#3a4a5a', marginBottom: 16 }}>
                Concacaf, Roc Nation Sports International, FC Barcelona, SPORTFIVE, Inter Miami CF and Nu Stadium
                shaped the experience. Across the exhibition floor, 30 companies brought the ecosystem to life, from
                elite performance and technology to architecture, infrastructure, investment and mobility.
              </p>
              <p className="miami-body leading-relaxed" style={{ fontSize: '1rem', color: '#3a4a5a', marginBottom: 16 }}>
                Concacaf hosted conversations from its Gold Cup stand and FC Barcelona activated directly across
                the way, with Catapult, LaBella Associates, LandTek, Terraplas, ICONS and Scout Lab AI among the
                companies that took the rest of the floor.
              </p>
              <p className="miami-body leading-relaxed" style={{ fontSize: '1rem', color: '#3a4a5a', marginBottom: 26 }}>
                A stand at Soccerex puts a brand inside the conversation rather than beside it, and the Deal Network
                keeps those relationships running after Miami.
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
            <div className="miami-partner-shots">
              <img src={frame('floor-group', '-w800')} alt="Delegates meeting on the exhibition floor at Nu Stadium" loading="lazy" />
              <img src={frame('stands', '-w800')} alt="Delegates watching a session from the stands at Nu Stadium" loading="lazy" />
            </div>
          </div>
          <style>{`
            .miami-partner-grid { display: grid; gap: clamp(28px,4vw,52px); grid-template-columns: 1fr; align-items: center; }
            @media (min-width: 900px) { .miami-partner-grid { grid-template-columns: 1.05fr 1fr; } }
            .miami-partner-shots { display: grid; gap: 14px; }
            .miami-partner-shots img { width: 100%; aspect-ratio: 3 / 2; object-fit: cover; border-radius: 8px; display: block; }
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
              HerSoccerex: a new room for the women leading the game
            </h2>
            <p className="miami-body leading-relaxed" style={{ fontSize: '1rem', color: '#3a4a5a', marginBottom: 16 }}>
              Miami marked the launch of HerSoccerex, a platform built to bring together the women shaping the
              future of football. The inaugural Founding Table Afternoon Tea at The Savoy gathered leaders,
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
              The game gave back before the business started
            </h2>
            <p className="miami-body leading-relaxed" style={{ fontSize: '1rem', color: '#3a4a5a', marginBottom: 16 }}>
              Before the conference took over Nu Stadium, the Soccerex Community Impact Event filled the mini
              pitches with at-risk youth for an afternoon of football, confidence and connection, run with Fútbol
              con Corazón, Miami Scores, love.fútbol and Special Olympics.
            </p>
            <p className="miami-body leading-relaxed" style={{ fontSize: '1rem', color: '#3a4a5a', marginBottom: 26 }}>
              DaGrosa Capital Partners, Royal Caribbean, Baptist Health, Soccer United and TAPEDESIGN backed the
              day with coaching, play, equipment and the kind of experience every young player deserves to have
              around the game.
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
              Everybody in these frames blocked out the same three days for Miami. Club owners, federation
              leadership, broadcasters and the people who never reply to a cold email were all in one building,
              a coffee table apart.
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
            The next room is yours to enter
          </h2>
          <p className="miami-body" style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.65, marginBottom: 30 }}>
            Miami set the standard the next edition will build on, with more access, more opportunity and more of
            the global game in the building. We are setting the dates now, and this list hears them first, along
            with the delegate rates when they open.
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
