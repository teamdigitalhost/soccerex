/*
 * Miami 2026 after the event, written for the people who were there and the ones deciding
 * whether to come next time: who was in the room, what got done in it, and thank you.
 *
 * Served unlisted at /miami-2026-draft while Joel reviews it, and built to take over
 * /miami-2026 from Miami2026V2, whose design system it reuses.
 *
 * Photography and the Roc Nation reel live on the public asset bucket. Frames carry two
 * sizes: the grid loads -w800 and the lightbox loads the 1600px file.
 */
import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Calendar, MapPin, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HOME, MIAMI_2026_PRESS_RELEASE, EUROPE_2026, DEAL_NETWORK, INSIGHTS, bookCallUrl, eventAgenda } from '../lib/routes'
import PageMeta from '../components/PageMeta'
import SelectedSpeakers from '../components/SelectedSpeakers'
import BrandWall from '../components/BrandWall'
import InquiryModalButton from '../components/InquiryModalButton'
import { packRequestSchema } from '../lib/leadSchemas'
import useScrollAnimations from '../lib/useScrollAnimations'

const MIAMI_EVENT_SLUG = 'soccerex-miami-2026'
const GFX = '/events/miami/2026/graphics'
const ASSET = 'https://soccerex-public-assets.s3.amazonaws.com/events/miami-2026'
const frame = (slug, size = '') => `${ASSET}/frames/${slug}${size}.jpg`

/* From the CRM and the event app, September 2026. */
const NUMBERS = [
  { figure: '873', label: 'organizations' },
  { figure: '146', label: 'clubs, leagues and federations' },
  { figure: '92', label: 'speakers on stage' },
  { figure: '30', label: 'exhibitors on the floor' },
  { figure: '2,714', label: 'connections made' },
]

/* Named, because the delegate list is the product. Everyone here was on stage or on the floor. */
const COHORTS = [
  {
    heading: 'Federations and the World Cup',
    names: 'Concacaf, FIFA World Cup 26 in Mexico, the United States and Canada, Federación Mexicana de Fútbol, the Argentine Football Association, and Qatar’s Supreme Committee for Delivery and Legacy.',
  },
  {
    heading: 'Clubs',
    names: 'Inter Miami CF, FC Barcelona, FC Bayern, RB Leipzig, Club América, Chivas, Brighton and Hove Albion, Orlando City SC, Vancouver Whitecaps FC, Napoli Women, Nashville SC, Atlanta United and Miami FC.',
  },
  {
    heading: 'Leagues, media and rights',
    names: 'LaLiga North America, Bundesliga Americas, NWSL, MLS NEXT PRO, UPSL, FOX Sports, Telemundo, TelevisaUnivision and Ateme.',
  },
  {
    heading: 'Brands, investors and agencies',
    names: 'Roc Nation Sports International, Royal Caribbean, Nu, Fortress Investment Group, Catapult, Gemini Sports AI, LaBella Associates, Meis+, Gensler and Buro Happold.',
  },
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
    body: 'The tournament officers for Mexico, the United States and Canada sat together on Sustaining Momentum after the FIFA World Cup, and Mexico’s legacy panel brought the federation, TelevisaUnivision and the host committee into the same argument.',
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

const GALLERY = [
  { slug: 'open', alt: 'A full room for the opening of Soccerex Miami 2026' },
  { slug: 'khaled-mic', alt: 'DJ Khaled on stage at Nu Stadium with the Roc Nation Sports International panel' },
  { slug: 'stands', alt: 'Delegates watching a session from the stands at Nu Stadium' },
  { slug: 'meeting', alt: 'Two delegates in conversation on the concourse' },
  { slug: 'investment', alt: 'The Football Investment Strategies panel on the main stage' },
  { slug: 'khaled-room', alt: 'The room on its feet for the Built, Not Bought panel' },
  { slug: 'floor-group', alt: 'Delegates on the exhibition floor' },
  { slug: 'women', alt: 'The Commercial Power of Women’s Football panel' },
  { slug: 'concourse', alt: 'Delegates talking between sessions' },
  { slug: 'global', alt: 'State of Global Football Business in 2026 on the main stage' },
  { slug: 'venue', alt: 'Inside Nu Stadium' },
  { slug: 'media', alt: 'Football’s Media Future: rights, streaming and the new media era' },
  { slug: 'networking', alt: 'Delegates meeting between sessions' },
  { slug: 'fireside', alt: 'Ali Curtis and Brad Guzan in conversation with Diego Arrioja' },
  { slug: 'audience', alt: 'A full house on day two' },
  { slug: 'khaled-artwork', alt: 'Roc Nation Sports International presented with a commissioned artwork on stage' },
  { slug: 'stadiums', alt: 'Building the Stage for the Modern Game, the stadium infrastructure panel' },
  { slug: 'greeting', alt: 'Two delegates greeting each other between sessions' },
  { slug: 'tech', alt: 'Tech in Football: AI, performance and the modern front office' },
  { slug: 'ball', alt: 'The Soccerex match ball on the pitch at Nu Stadium' },
  { slug: 'barca', alt: 'Evolving Barça in the Americas on the main stage' },
  { slug: 'merch', alt: 'A delegate collecting merchandise on the exhibition floor' },
  { slug: 'argentina', alt: 'The Argentina Era panel on day two' },
  { slug: 'khaled-phones', alt: 'Phones up across the room as DJ Khaled takes the stage' },
  { slug: 'vip', alt: 'The Soccerex sign at the VIP reception' },
  { slug: 'impact', alt: 'Young players at the Community Impact Event on the mini fields at Nu Stadium' },
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
    body: '92 speakers across 28 panels and fireside chats, several of them flying in for a single session and going straight back to the airport.',
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

export default function Miami2026Recap() {
  useScrollAnimations()
  const [open, setOpen] = useState(null)
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const move = useCallback((dir) => setOpen((i) => (i + dir + GALLERY.length) % GALLERY.length), [])

  return (
    <div className="event-page theme-miami" style={{ background: '#FFF8F4' }}>
      <PageMeta
        title="Soccerex Miami 2026: thank you"
        description="873 organizations, 146 of them clubs, leagues and federations, and 92 speakers spent three days at Nu Stadium. The room, the business and the moment Roc Nation brought DJ Khaled out."
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

          <h1 className="miami-headline" style={{ fontSize: 'clamp(2.1rem, 5vw, 3.6rem)', color: '#FFFFFF', lineHeight: 1.05, maxWidth: 940, marginBottom: 'clamp(18px,2.4vw,26px)' }}>
            Thank you, <span style={{ color: '#FF4D8D' }}>Miami</span>
          </h1>
          <p className="miami-body" style={{ fontSize: 'clamp(1.02rem, 1.4vw, 1.18rem)', color: 'rgba(255,255,255,0.84)', lineHeight: 1.65, maxWidth: 700 }}>
            873 organizations spent three days at Nu Stadium, ten weeks after the World Cup. 146 of them were clubs, leagues and federations, and the rest were the brands, investors, agencies and broadcasters who do business with them.
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
        </div>
      </section>

      {/* ─── THE ROOM ────────────────────────────────────────────────────── */}
      <section style={{ background: '#FFFFFF', padding: 'clamp(64px,8vw,100px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div className="grid gap-y-10 gap-x-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: 'clamp(48px,6vw,72px)' }}>
            {NUMBERS.map((n) => (
              <div key={n.label} className="text-center">
                <p className="miami-headline" style={{ fontSize: 'clamp(2rem, 3.6vw, 2.9rem)', color: '#E91E63', lineHeight: 1 }}>{n.figure}</p>
                <p className="miami-body" style={{ fontSize: '0.9rem', color: '#3a4a5a', marginTop: 10 }}>{n.label}</p>
              </div>
            ))}
          </div>

          <h2 className="miami-headline" style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: '#0D1B2A', marginBottom: 'clamp(28px,3.5vw,40px)' }}>
            You were in the room with these people
          </h2>
          <div className="grid gap-x-10 gap-y-9" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {COHORTS.map((c) => (
              <div key={c.heading}>
                <h3 className="miami-headline" style={{ fontSize: '1rem', color: '#007C91', marginBottom: 10, textTransform: 'none', letterSpacing: '0.02em' }}>{c.heading}</h3>
                <p className="miami-body leading-relaxed" style={{ fontSize: '0.94rem', color: '#3a4a5a' }}>{c.names}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHAT IT WAS FOR ─────────────────────────────────────────────── */}
      <section style={{ background: '#FFF8F4', padding: 'clamp(64px,8vw,104px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gap: 'clamp(28px,4vw,56px)', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center' }}>
          <div>
            <h2 className="miami-headline" style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: '#0D1B2A', marginBottom: 18 }}>
              Nobody flies to Miami for the slides
            </h2>
            <p className="miami-body leading-relaxed" style={{ fontSize: '1rem', color: '#3a4a5a', marginBottom: 16 }}>
              Delegates made 2,714 connections and sent 5,305 messages through the event app across the three days, on top of everything agreed on the floor, in the green room and at the Savoy.
            </p>
            <p className="miami-body leading-relaxed" style={{ fontSize: '1rem', color: '#3a4a5a', marginBottom: 26 }}>
              Those conversations do not stop when the room empties. The Soccerex Deal Network carries the introductions on through the year, and a person reviews every approach before it is sent.
            </p>
            <Link to={DEAL_NETWORK} className="miami-pill-primary">
              See the Deal Network <ArrowRight size={15} />
            </Link>
          </div>
          <div>
            <img src={frame('meeting', '-w800')} alt="Two delegates in conversation on the concourse at Nu Stadium"
              loading="lazy" style={{ width: '100%', aspectRatio: '3 / 2', objectFit: 'cover', borderRadius: 8, display: 'block' }} />
          </div>
        </div>
      </section>

      {/* ─── THE MOMENT ──────────────────────────────────────────────────── */}
      <section style={{ background: '#0D1B2A', padding: 'clamp(72px,9vw,120px) clamp(24px,5vw,80px)', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ display: 'grid', gap: 'clamp(28px,4vw,56px)', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center' }}>
            <div>
              <h2 className="miami-headline" style={{ fontSize: 'clamp(1.8rem, 3.6vw, 2.7rem)', color: '#FFFFFF', lineHeight: 1.1, marginBottom: 'clamp(16px,2vw,22px)' }}>
                Then DJ <span style={{ color: '#FF4D8D' }}>Khaled walked out</span>
              </h2>
              <p className="miami-body leading-relaxed" style={{ fontSize: '1.02rem', color: 'rgba(255,255,255,0.84)', marginBottom: 16 }}>
                Roc Nation Sports International closed the first day with Built, Not Bought, their case for how a modern football agency gets built. They opened it with the World Cup film Khaled fronts for them, and he came out at the end of it in an Inter Miami shirt, sat down with the panel and handed it to Michael Yormark.
              </p>
              <p className="miami-body leading-relaxed" style={{ fontSize: '1.02rem', color: 'rgba(255,255,255,0.84)' }}>
                Every phone in the room went up. It is the clip that traveled furthest from the week, and it put an agency’s argument in front of an audience that does not usually stand up for one.
              </p>
            </div>
            <div style={{ justifySelf: 'center', width: '100%', maxWidth: 360 }}>
              <video controls playsInline preload="none"
                poster={`${ASSET}/video/dj-khaled-poster.jpg`}
                style={{ width: '100%', aspectRatio: '9 / 16', borderRadius: 10, display: 'block', background: '#000', boxShadow: '0 24px 60px rgba(0,0,0,0.45)' }}>
                <source src={`${ASSET}/video/dj-khaled-soccerex-miami-2026.mp4`} type="video/mp4" />
                Your browser cannot play this video.
              </video>
              <p className="miami-body text-center" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: 12 }}>
                Film by Cinco Creative
              </p>
            </div>
          </div>

          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginTop: 'clamp(32px,4vw,48px)' }}>
            {[
              ['khaled-mic', 'DJ Khaled on stage with the Roc Nation Sports International panel'],
              ['khaled-phones', 'Phones up across the room as he takes the stage'],
              ['khaled-artwork', 'Roc Nation presented with a commissioned artwork on stage'],
            ].map(([slug, alt]) => (
              <img key={slug} src={frame(slug, '-w800')} alt={alt} loading="lazy"
                style={{ width: '100%', aspectRatio: '3 / 2', objectFit: 'cover', borderRadius: 6, display: 'block' }} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── ON STAGE ────────────────────────────────────────────────────── */}
      <section style={{ background: '#FFFFFF', padding: 'clamp(72px,9vw,120px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div className="flex flex-wrap items-end justify-between gap-4" style={{ marginBottom: 'clamp(32px,4vw,48px)' }}>
            <h2 className="miami-headline" style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: '#0D1B2A', maxWidth: 620 }}>
              Six arguments worth flying in for
            </h2>
            <Link to={eventAgenda(MIAMI_EVENT_SLUG)} className="miami-pill-outline">
              The full running order <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid gap-7" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {THEMES.map((t) => (
              <article key={t.title} className="miami-card-light" style={{ overflow: 'hidden', padding: 0 }}>
                <img src={frame(t.photo, '-w800')} alt="" loading="lazy" style={{ width: '100%', aspectRatio: '3 / 2', objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: 'clamp(20px,2.2vw,28px)' }}>
                  <h3 className="miami-headline" style={{ fontSize: '1.1rem', color: '#0D1B2A', marginBottom: 10, textTransform: 'none', letterSpacing: '0.01em' }}>{t.title}</h3>
                  <p className="miami-body leading-relaxed" style={{ fontSize: '0.93rem', color: '#3a4a5a' }}>{t.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GALLERY ─────────────────────────────────────────────────────── */}
      <section id="gallery" style={{ background: '#FFF8F4', padding: 'clamp(72px,9vw,120px) clamp(24px,5vw,80px)', scrollMarginTop: 80 }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ marginBottom: 'clamp(28px,3.5vw,44px)', maxWidth: 680 }}>
            <h2 className="miami-headline" style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: '#0D1B2A', marginBottom: 14 }}>
              Look for yourself in the crowd
            </h2>
            <p className="miami-body" style={{ fontSize: '1rem', color: '#3a4a5a', lineHeight: 1.6 }}>
              Select any frame to see it full size. Press and partners can request the full set at{' '}
              <a href="mailto:press@soccerex.com" style={{ color: '#E91E63' }}>press@soccerex.com</a>.
            </p>
          </div>

          <div className="miami-gallery-grid">
            {GALLERY.map((g, i) => (
              <button key={g.slug} onClick={() => setOpen(i)} className="miami-gallery-tile" aria-label={`Open photograph: ${g.alt}`}>
                <img src={frame(g.slug, '-w800')} alt={g.alt} loading="lazy" />
              </button>
            ))}
          </div>
          <style>{`
            .miami-gallery-grid { display: grid; gap: 12px; grid-template-columns: repeat(2, 1fr); }
            @media (min-width: 720px)  { .miami-gallery-grid { grid-template-columns: repeat(3, 1fr); } }
            @media (min-width: 1100px) { .miami-gallery-grid { grid-template-columns: repeat(4, 1fr); } }
            .miami-gallery-tile { padding: 0; border: none; background: #0D1B2A; cursor: pointer; overflow: hidden; border-radius: 4px; display: block; }
            .miami-gallery-tile img { width: 100%; aspect-ratio: 3 / 2; object-fit: cover; display: block; transition: transform .45s ease, opacity .3s ease; }
            .miami-gallery-tile:hover img, .miami-gallery-tile:focus-visible img { transform: scale(1.04); opacity: 0.92; }
          `}</style>
        </div>
      </section>

      {/* ─── THE PEOPLE ON STAGE ─────────────────────────────────────────── */}
      <SelectedSpeakers
        slug={MIAMI_EVENT_SLUG}
        limit={12}
        heading={<>You Shared a Room With <span className="miami-text-gradient">These People</span></>}
      />

      <BrandWall
        heading={<>Every One of These Companies <span style={{ color: '#E91E63' }}>Showed Up for Miami</span></>}
        intro="Clubs, leagues, federations and brands from across the Soccerex network."
      />

      {/* ─── THANK YOU ───────────────────────────────────────────────────── */}
      <section style={{ background: '#0D1B2A', padding: 'clamp(72px,9vw,120px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <h2 className="miami-headline" style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: '#FFFFFF', marginBottom: 'clamp(14px,2vw,20px)' }}>
            Soccerex would like to thank
          </h2>
          <p className="miami-body" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.65, maxWidth: 720, marginBottom: 'clamp(36px,4.5vw,54px)' }}>
            A few hundred people spent the better part of a year building this week. These are the ones who made it what it was.
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
          <h2 className="miami-headline" style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: '#0D1B2A', marginBottom: 'clamp(28px,3.5vw,42px)' }}>
            Take Miami with you
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
        <div className="text-center" style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 className="miami-headline" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#FFFFFF', marginBottom: 18 }}>
            We are already planning the next one
          </h2>
          <p className="miami-body" style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.65, marginBottom: 30 }}>
            We are setting the dates for the next Miami edition now. Tell us you want to be there and we will come to you first, with the delegate rate we hold for the people who were with us this year.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <InquiryModalButton
              kind="preregister"
              label="Register your interest"
              modalTitle="Register your interest"
              eyebrow="Miami 2027"
              intro="Leave your details and we will send the dates, the venue and the delegate rate before they go public."
              schema={packRequestSchema}
              extraPayload={{ event_slug: 'miami-2027', interest: 'Miami 2027 pre-registration', source: 'miami-2026-recap', marketing_opt_in: true }}
              submitLabel="Register interest"
              successTitle="You are on the list."
              successBody="We will be in touch with dates for the next Miami edition before they go public."
              bookingUrl={bookCallUrl('success-miami-2027')}
              buttonClassName="miami-pill-primary"
            >
              Register your interest <ArrowRight size={15} />
            </InquiryModalButton>
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
