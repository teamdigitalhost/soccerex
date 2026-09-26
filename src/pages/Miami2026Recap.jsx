/*
 * The Miami 2026 page after the event: what happened, who was in the room, and thank you.
 *
 * Served unlisted at /miami-2026-draft while Joel reviews it. When it is approved it takes
 * over /miami-2026 from Miami2026V2, which is why it reuses that page's design system rather
 * than inventing a second one.
 *
 * Photography lives on the public asset bucket, two sizes per frame: the grid loads -w800 and
 * the lightbox loads the 1600px original.
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
const V2 = '/events/miami/2026/v2'
const PHOTO = 'https://soccerex-public-assets.s3.amazonaws.com/events/miami-2026/gallery'

const photo = (n, size = '') => `${PHOTO}/miami-2026-${String(n).padStart(2, '0')}${size}.jpg`

/* The numbers come from the CRM and the event app on September 26, 2026. */
const NUMBERS = [
  { figure: '28', label: 'panels and fireside chats' },
  { figure: '92', label: 'speakers on stage' },
  { figure: '873', label: 'organizations in the room' },
  { figure: '146', label: 'clubs, leagues and federations' },
  { figure: '2,714', label: 'connections made in the app' },
]

const DAYS = [
  {
    date: 'Tuesday, September 23',
    title: 'Community Impact Event and the VIP reception',
    photo: 14,
    body: 'The week opened on the mini fields at Nu Stadium with young players from across Miami and the organizations that coach them, led by DaGrosa Capital Partners with clubs, charities and local brands from across the city. The evening moved to the Savoy for the VIP reception.',
  },
  {
    date: 'Wednesday, September 24',
    title: 'Day one on the main stage',
    photo: 5,
    body: 'Joseph DaGrosa Jr. and Heidi Pellerano opened the conference, and the day ran from football investment through the World Cup, media rights, the commercial power of women’s football and the Bundesliga in the Americas, finishing with Roc Nation on building the next generation agency.',
  },
  {
    date: 'Thursday, September 25',
    title: 'Day two and the close',
    photo: 11,
    body: 'Day two took in matchday revenue, brand building with Inter Miami CF, Royal Caribbean and Nu, the Argentina era, Mexico’s World Cup legacy, academies in the Americas, stadium infrastructure, technology in the front office and football with purpose.',
  },
]

/* Captions stay descriptive rather than naming everyone in frame, so a wrong name
   never ends up under a photograph. */
const GALLERY = [
  { n: 5, alt: 'Joseph DaGrosa Jr. and Heidi Pellerano open Soccerex Miami 2026 in front of a full room' },
  { n: 17, alt: 'Delegates watching a session from the stands at Nu Stadium' },
  { n: 1, alt: 'The State of Global Football Business in 2026 panel on the main stage' },
  { n: 4, alt: 'Speakers together on stage after Built, Not Bought' },
  { n: 13, alt: 'Guests and young players at the Community Impact Event' },
  { n: 21, alt: 'The Soccerex match ball on the pitch' },
  { n: 3, alt: 'The Commercial Power of Women’s Football panel' },
  { n: 8, alt: 'Delegates talking between sessions' },
  { n: 12, alt: 'Inside Nu Stadium, the Inter Miami lettering across the stands' },
  { n: 6, alt: 'Ali Curtis and Brad Guzan in conversation with Diego Arrioja' },
  { n: 20, alt: 'A full house for day two' },
  { n: 23, alt: 'A coaching session on the mini fields at the Community Impact Event' },
  { n: 0, alt: 'The Bundesliga Blueprint panel on the main stage' },
  { n: 19, alt: 'Delegates comparing notes on the concourse' },
  { n: 24, alt: 'Young players at the Community Impact Event' },
  { n: 7, alt: 'Building the Stage for the Modern Game, the stadium infrastructure panel' },
  { n: 2, alt: 'Roc Nation Sports International on stage on day one' },
  { n: 25, alt: 'The Soccerex sign at the VIP reception' },
  { n: 10, alt: 'Tech in Football: AI, performance and the modern front office' },
  { n: 16, alt: 'Delegates at the end of a session' },
  { n: 15, alt: 'Guests at the VIP reception' },
  { n: 18, alt: 'Football’s Media Future: rights, streaming and the new media era' },
  { n: 11, alt: 'Grassroots to Growth: football as a community catalyst' },
  { n: 22, alt: 'Delegates meeting between sessions' },
  { n: 9, alt: 'A day two panel on the main stage' },
  { n: 26, alt: 'Players at the Community Impact Event' },
]

/* Everyone the event was built with. Grouped so a reader can find their own name
   quickly rather than reading one long list. */
const THANKS = [
  {
    heading: 'Our hosts',
    body: 'Inter Miami CF and Nu Stadium gave Soccerex the newest stadium in Major League Soccer for three days, from the main stage to the mini fields, and their team worked alongside ours from the first walkthrough to the last session.',
  },
  {
    heading: 'Our partners',
    body: 'Concacaf, the Greater Miami Convention and Visitors Bureau, Roc Nation Sports International, FC Barcelona and SPORTFIVE backed the event publicly and put their people on stage and on the floor.',
  },
  {
    heading: 'Our sponsors and exhibitors',
    body: '30 companies took stands on the floor and made the exhibition what delegates spent their breaks in. neaū water kept the room hydrated across all three days, and Blacklane, our Official Chauffeur Partner, moved delegates between the airport, the hotels and the stadium.',
  },
  {
    heading: 'Our speakers',
    body: '92 executives took the stage across 28 panels and fireside chats, several of them flying in for a single session and going straight back to the airport.',
  },
  {
    heading: 'The Community Impact Event',
    body: 'DaGrosa Capital Partners led the opening day on the mini fields, with Fútbol con Corazón, Royal Caribbean, Baptist Health and the coaches and volunteers who ran the sessions for the young players who filled them.',
  },
  {
    heading: 'Soccer United and TAPEDESIGN',
    body: 'Soccer United and TAPEDESIGN sent a gear donation for the event, and supported the week beyond it.',
  },
  {
    heading: 'Our volunteers and crew',
    body: 'The volunteers, stage crew, photographers and production team ran registration, kept 28 sessions on time and stayed long after the room emptied each evening.',
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
      <button
        onClick={(e) => { e.stopPropagation(); onClose() }}
        aria-label="Close"
        style={{ position: 'absolute', top: 18, right: 18, width: 44, height: 44, borderRadius: 999,
          background: 'rgba(255,255,255,0.12)', color: '#fff', display: 'grid', placeItems: 'center', border: 'none', cursor: 'pointer' }}
      >
        <X size={20} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onMove(-1) }}
        aria-label="Previous photograph"
        style={{ ...navButton, left: 14 }}
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onMove(1) }}
        aria-label="Next photograph"
        style={{ ...navButton, right: 14 }}
      >
        <ChevronRight size={22} />
      </button>
      <figure onClick={(e) => e.stopPropagation()} style={{ margin: 0, maxWidth: 1180, width: '100%' }}>
        <img
          src={photo(item.n + 1)} alt={item.alt}
          style={{ width: '100%', height: 'auto', maxHeight: '78vh', objectFit: 'contain', borderRadius: 6, display: 'block', margin: '0 auto' }}
        />
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
        description="Soccerex Miami 2026 ran September 23 to 25 at Nu Stadium: 28 panels, 92 speakers and 873 organizations. Photographs from the three days and thank you to everyone who built it."
        image={photo(6)}
        path="/miami-2026-draft"
        noindex
      />

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#0D1B2A' }}>
        <img
          src={photo(6)} alt="" aria-hidden
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.38 }}
        />
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,27,42,0.72) 0%, rgba(13,27,42,0.86) 100%)' }} />
        <div className="relative z-10" style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(96px,12vw,150px) clamp(24px,5vw,72px) clamp(64px,8vw,96px)' }}>
          <Link to={HOME} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest mb-10" style={{ color: 'rgba(255,255,255,0.72)', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <img src={`${GFX}/logo-primary.svg`} alt="Soccerex Miami 2026" style={{ width: 'min(420px, 72vw)', marginBottom: 'clamp(28px,4vw,40px)', filter: 'brightness(0) invert(1)' }} />

          <h1 className="miami-headline" style={{ fontSize: 'clamp(2.1rem, 5vw, 3.6rem)', color: '#FFFFFF', lineHeight: 1.05, maxWidth: 900, marginBottom: 'clamp(18px,2.4vw,26px)' }}>
            Thank you, <span style={{ color: '#FF4D8D' }}>Miami</span>
          </h1>
          <p className="miami-body" style={{ fontSize: 'clamp(1.02rem, 1.4vw, 1.18rem)', color: 'rgba(255,255,255,0.82)', lineHeight: 1.65, maxWidth: 680 }}>
            Three days at Nu Stadium, ten weeks after the World Cup, with the clubs, leagues, federations, brands and investors shaping football in the Americas. To everyone who spoke, exhibited, volunteered and showed up: thank you.
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

      {/* ─── THE NUMBERS ─────────────────────────────────────────────────── */}
      <section style={{ background: '#FFFFFF', padding: 'clamp(56px,7vw,88px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div className="grid gap-y-10 gap-x-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}>
            {NUMBERS.map((n) => (
              <div key={n.label} className="text-center">
                <p className="miami-headline" style={{ fontSize: 'clamp(2rem, 3.6vw, 2.9rem)', color: '#E91E63', lineHeight: 1 }}>{n.figure}</p>
                <p className="miami-body" style={{ fontSize: '0.92rem', color: '#3a4a5a', marginTop: 10 }}>{n.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── THE THREE DAYS ──────────────────────────────────────────────── */}
      <section style={{ background: '#FFF8F4', padding: 'clamp(72px,9vw,120px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <h2 className="miami-headline" style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: '#0D1B2A', marginBottom: 'clamp(32px,4vw,48px)' }}>
            How the three days ran
          </h2>
          <div className="grid gap-7" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {DAYS.map((d) => (
              <article key={d.date} className="miami-card-light" style={{ overflow: 'hidden', padding: 0 }}>
                <img src={photo(d.photo + 1, '-w800')} alt="" loading="lazy" style={{ width: '100%', aspectRatio: '3 / 2', objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: 'clamp(22px,2.4vw,30px)' }}>
                  <h3 className="miami-headline" style={{ fontSize: '1.15rem', color: '#0D1B2A', marginBottom: 6, textTransform: 'none', letterSpacing: '0.01em' }}>{d.title}</h3>
                  <p className="miami-body" style={{ fontSize: '0.86rem', color: '#007C91', marginBottom: 12 }}>{d.date}</p>
                  <p className="miami-body leading-relaxed" style={{ fontSize: '0.94rem', color: '#3a4a5a' }}>{d.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GALLERY ─────────────────────────────────────────────────────── */}
      <section id="gallery" style={{ background: '#FFFFFF', padding: 'clamp(72px,9vw,120px) clamp(24px,5vw,80px)', scrollMarginTop: 80 }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ marginBottom: 'clamp(28px,3.5vw,44px)', maxWidth: 680 }}>
            <h2 className="miami-headline" style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: '#0D1B2A', marginBottom: 14 }}>
              Three days in photographs
            </h2>
            <p className="miami-body" style={{ fontSize: '1rem', color: '#3a4a5a', lineHeight: 1.6 }}>
              Select any frame to see it full size. Press and partners can request the full set at{' '}
              <a href="mailto:press@soccerex.com" style={{ color: '#E91E63' }}>press@soccerex.com</a>.
            </p>
          </div>

          <div className="miami-gallery-grid">
            {GALLERY.map((g, i) => (
              <button
                key={g.n}
                onClick={() => setOpen(i)}
                className="miami-gallery-tile"
                aria-label={`Open photograph: ${g.alt}`}
              >
                <img src={photo(g.n + 1, '-w800')} alt={g.alt} loading="lazy" />
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

      {/* ─── THANK YOU ───────────────────────────────────────────────────── */}
      <section style={{ background: '#0D1B2A', padding: 'clamp(76px,9vw,124px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <h2 className="miami-headline" style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: '#FFFFFF', marginBottom: 'clamp(14px,2vw,20px)' }}>
            Soccerex would like to thank
          </h2>
          <p className="miami-body" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.65, maxWidth: 720, marginBottom: 'clamp(36px,4.5vw,54px)' }}>
            An event of this size is the work of a few hundred people over the better part of a year. These are the ones who made Miami 2026 what it was.
          </p>
          <div className="grid gap-x-10 gap-y-9" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {THANKS.map((t) => (
              <div key={t.heading}>
                <h3 className="miami-headline" style={{ fontSize: '1.02rem', color: '#FF4D8D', marginBottom: 10, textTransform: 'none', letterSpacing: '0.02em' }}>{t.heading}</h3>
                <p className="miami-body leading-relaxed" style={{ fontSize: '0.94rem', color: 'rgba(255,255,255,0.78)' }}>{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── THE PEOPLE ON STAGE ─────────────────────────────────────────── */}
      <SelectedSpeakers
        slug={MIAMI_EVENT_SLUG}
        limit={12}
        heading={<>The Executives Who Took <span className="miami-text-gradient">the Stage in Miami</span></>}
      />

      <BrandWall
        heading={<>The Companies That Made Miami 2026 <span style={{ color: '#E91E63' }}>Happen</span></>}
        intro="Clubs, leagues, federations and brands from across the Soccerex network."
      />

      {/* ─── WHAT CAME OUT OF IT ─────────────────────────────────────────── */}
      <section style={{ background: '#FFF8F4', padding: 'clamp(72px,9vw,116px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <h2 className="miami-headline" style={{ fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)', color: '#0D1B2A', marginBottom: 'clamp(28px,3.5vw,42px)' }}>
            Keep reading
          </h2>
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {[
              { to: eventAgenda(MIAMI_EVENT_SLUG), title: 'The full running order', body: 'Every panel, every speaker and the stage they ran on.' },
              { to: MIAMI_2026_PRESS_RELEASE, title: 'The announcements', body: 'What we published in the run up to the event and during it.' },
              { to: INSIGHTS, title: 'Insights', body: 'Reporting and analysis from the Soccerex desk, including partner news from Miami.' },
              { to: DEAL_NETWORK, title: 'Deal Network', body: 'The introductions carry on after the event through the Soccerex Deal Network.' },
            ].map((c) => (
              <Link key={c.title} to={c.to} className="miami-card-light" style={{ textDecoration: 'none', padding: 'clamp(22px,2.4vw,28px)', display: 'block' }}>
                <h3 className="miami-headline" style={{ fontSize: '1.05rem', color: '#0D1B2A', marginBottom: 10, textTransform: 'none', letterSpacing: '0.02em' }}>{c.title}</h3>
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
            Soccerex returns
          </h2>
          <p className="miami-body" style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.65, marginBottom: 30 }}>
            Dates for the next Miami edition are being set now. Tell us you want to be there and we will come to you first, with the delegate rate that goes to the people who were with us this year.
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
