import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, MapPin, Calendar, Car, Navigation, TrainFront, Plane,
  BadgeCheck, Smartphone, BedDouble, Mail, FileText, Clock, ExternalLink,
} from 'lucide-react'
import PageMeta from '../components/PageMeta'
import { pageMeta } from '../lib/pageMeta'
import {
  MIAMI_2026, MIAMI_2026_VIP_NIGHT, MIAMI_2026_ATTENDEE_GUIDE, ACCOMMODATIONS, APP_PAGE, eventAgenda,
} from '../lib/routes'
import { getAgenda, eventAgendaPdfUrl } from '../lib/soccerexApi'

const EVENT_SLUG = 'soccerex-miami-2026'
const HERO_IMG = '/events/miami/2026/sections/nu-stadium-exterior.jpg'

/* Inter Miami's own routes to the Audi Black Lot, entering from NW 37th Avenue.
   The LeJeune Road link is their second route, for anyone coming from the west. */
const ROUTES = {
  google: 'https://maps.app.goo.gl/1c59AosB5daCWrVu6',
  apple: 'https://maps.apple/p/LUA03DW9KiIFRS',
  waze: 'https://www.waze.com/ul?ll=25.79314000%2C-80.26075000&navigate=yes',
  wazeWest: 'https://www.waze.com/ul?ll=25.79271000%2C-80.26400000&navigate=yes',
  parkingMap: 'https://www.intermiamicf.com/nu-stadium/parking',
}

/* Blacklane is the event's Official Chauffeur Partner (Joel's wording, which
   replaces the contract's "Preferred Chauffeur Transport Partner" on the site).
   The contract names the three things to promote: booking ahead, airport
   transfers and cars during the event. The link carries our campaign tags so Blacklane can see
   bookings that came from Soccerex. Every use of Blacklane's name or logo needs
   their written approval before it is published. */
const BLACKLANE = {
  book: 'https://www.blacklane.com/en/?utm_source=soccerex&utm_medium=partner&utm_campaign=soccerex-miami-2026',
  logo: '/images/partners/blacklane-wordmark-light.svg',
  black: '#0F1319',
  blue: '#B3DBF5',
}

const APP_STORE = 'https://apps.apple.com/us/app/soccerex-events/id6737689519'
const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.teks.eventify&hl=en_US'

const HELP_EMAIL = 'registrations@soccerex.com'

/* Read the day's opening and closing times off the live agenda, so this page
   moves when the running order does. Only panels count: registration, the
   receptions and the Social Evening carry their own times below. */
function dayWindows(sessions) {
  const byDay = {}
  for (const s of sessions || []) {
    if (!s.starts_at || s.format !== 'panel') continue
    const day = s.starts_at.slice(0, 10)
    const start = s.starts_at.slice(11, 16)
    const end = (s.ends_at || s.starts_at).slice(11, 16)
    const d = byDay[day] || (byDay[day] = { start, end })
    if (start < d.start) d.start = start
    if (end > d.end) d.end = end
  }
  return byDay
}

/* One named agenda entry (the Social Evening, say) as times and a room, or
   the fallback while the agenda is loading or if the entry is not there. */
function agendaEntry(sessions, title, fallback) {
  const s = (sessions || []).find((row) => row.title === title && row.starts_at)
  if (!s) return fallback
  return {
    start: s.starts_at.slice(11, 16),
    end: (s.ends_at || s.starts_at).slice(11, 16),
    room: (s.stage?.name || fallback.room).replace(/^Nu Stadium /u, ''),
  }
}

/* "13:05" to "1:05 PM". The agenda API sends event-local times, so there is
   no timezone conversion to do and none is done. */
function clock(hhmm) {
  if (!hhmm) return ''
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`
}

export default function MiamiAttendeeGuide() {
  const [sessions, setSessions] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    let cancelled = false
    getAgenda(EVENT_SLUG)
      .then((rows) => { if (!cancelled) setSessions(rows || []) })
      .catch(() => { if (!cancelled) setSessions([]) })
    return () => { cancelled = true }
  }, [])

  const windows = useMemo(() => dayWindows(sessions), [sessions])
  /* Until the agenda loads, or if it cannot, the published times stand in. */
  const thursday = windows['2026-09-24'] || { start: '09:20', end: '18:40' }
  const friday = windows['2026-09-25'] || { start: '09:30', end: '16:50' }
  const impact = agendaEntry(sessions, 'Soccerex Impact Event', { start: '15:00', end: '18:00', room: 'Mini Fields' })
  const social = agendaEntry(sessions, 'Social Evening', { start: '19:00', end: '20:00', room: 'East Club' })

  return (
    <div className="event-page theme-miami" style={{ background: '#FFF8F4' }}>
      <PageMeta {...pageMeta(MIAMI_2026_ATTENDEE_GUIDE)} />

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#0D1B2A', padding: 'clamp(96px,11vw,150px) clamp(24px,5vw,80px) clamp(64px,8vw,100px)' }}>
        <img src={HERO_IMG} alt="" aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.32 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,27,42,0.55) 0%, rgba(13,27,42,0.92) 100%)' }} />
        <div className="relative" style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <Link to={MIAMI_2026} className="inline-flex items-center gap-2 mb-8 miami-body" style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Back to Soccerex Miami
          </Link>
          <h1 className="miami-headline" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', lineHeight: 1.08, maxWidth: 880, textWrap: 'balance' }}>
            Everything you need for <span className="miami-text-gradient">three days at Nu Stadium</span>
          </h1>
          <p className="miami-body mt-6 mb-9" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.12rem)', color: 'rgba(255,255,255,0.86)', maxWidth: 680, lineHeight: 1.6 }}>
            Soccerex Miami opens on September 23, with sessions on September 24 and 25 at Nu Stadium in Miami Freedom Park. This guide walks you through getting there, getting in and what is on each day, so you can arrive and go straight to your meetings.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a href={ROUTES.google} target="_blank" rel="noopener noreferrer" className="miami-pill-primary">
              <Navigation size={16} /> Directions to parking
            </a>
            <Link to={eventAgenda(EVENT_SLUG)} className="miami-pill-outline" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
              See the running order <ArrowRight size={15} />
            </Link>
          </div>

          {/* The four things people look for first, as labeled values. */}
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-12">
            {[
              { icon: MapPin, label: 'Venue', value: '1900 NW 37th Avenue, Miami, FL 33125' },
              { icon: Car, label: 'Parking', value: 'Audi Black Lot' },
              { icon: Clock, label: 'Registration opens', value: '8:00 AM, Thursday, September 24' },
              { icon: Mail, label: 'Questions', value: <>registrations<wbr />@soccerex.com</>, href: `mailto:${HELP_EMAIL}` },
            ].map((fact) => {
              const FactIcon = fact.icon
              return (
                <div key={fact.label} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', padding: '14px 16px' }}>
                  <dt className="flex items-center gap-1.5 miami-body" style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 4 }}>
                    <FactIcon size={13} style={{ color: '#00C6D7' }} /> {fact.label}
                  </dt>
                  <dd style={{ fontSize: 15, color: '#fff', fontWeight: 600, lineHeight: 1.3, wordBreak: 'break-word' }}>
                    {fact.href ? <a href={fact.href} style={{ color: '#fff' }}>{fact.value}</a> : fact.value}
                  </dd>
                </div>
              )
            })}
          </dl>
        </div>
      </section>

      {/* ─── GETTING THERE ────────────────────────────────────────────── */}
      <section id="getting-there" style={{ background: '#FFFFFF', padding: 'clamp(64px,8vw,110px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <h2 className="miami-headline" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.5rem)', color: '#0D1B2A', marginBottom: 14 }}>
            How do I get to <span className="miami-text-gradient">Nu Stadium?</span>
          </h2>
          <p className="miami-body mb-10" style={{ fontSize: '1.05rem', color: '#3a4a5a', maxWidth: 720, lineHeight: 1.6 }}>
            Nu Stadium sits at Miami Freedom Park, two minutes from Miami International Airport, so most people drive, take a rideshare or come straight from a flight. Here is the easiest way in for each.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <GuideCard icon={Car} title="Driving and parking">
              <p>
                Park in the <strong>Audi Black Lot</strong>. Enter the park from NW 37th Avenue, across from NW 19th Terrace, and follow the signs for the Audi Black Lot. It sits on the west side of the stadium, right beside the West Club VIP Entrance you will walk in through.
              </p>
              <p className="mt-3">
                Parking in the Audi Black Lot is free for Soccerex delegates, and our staff will be there to help with directions when you arrive.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <MapLink href={ROUTES.google}>Google Maps</MapLink>
                <MapLink href={ROUTES.apple}>Apple Maps</MapLink>
                <MapLink href={ROUTES.waze}>Waze</MapLink>
              </div>
              <p className="mt-4" style={{ fontSize: 13.5, color: '#607186' }}>
                Coming from the west on LeJeune Road? <a href={ROUTES.wazeWest} target="_blank" rel="noopener noreferrer" style={{ color: '#007C91', fontWeight: 600 }}>Use this Waze route</a> instead. Inter Miami also has a <a href={ROUTES.parkingMap} target="_blank" rel="noopener noreferrer" style={{ color: '#007C91', fontWeight: 600 }}>map of the lots</a>.
              </p>
            </GuideCard>

            <GuideCard icon={Navigation} title="Rideshare">
              {/* Blacklane leads the card as the event's chauffeur partner, with
                  the everyday apps underneath. */}
              <div style={{ background: BLACKLANE.black, padding: '18px 20px', marginBottom: 16 }}>
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <img src={BLACKLANE.logo} alt="Blacklane" width={1504} height={291} style={{ width: 118, height: 'auto', display: 'block' }} />
                  <span style={{ color: BLACKLANE.blue, fontSize: 13, fontWeight: 700 }}>Official Chauffeur Partner</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.82)', marginTop: 12 }}>
                  Book a professional chauffeur ahead of time to meet you at the airport, take you from your hotel to Nu Stadium, or wait between meetings.
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2" style={{ marginTop: 14 }}>
                  <a href={BLACKLANE.book} target="_blank" rel="noopener" className="inline-flex items-center gap-2" style={{ background: BLACKLANE.blue, color: BLACKLANE.black, padding: '10px 18px', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                    Book with Blacklane <ExternalLink size={14} />
                  </a>
                  <a href="#blacklane" style={{ color: BLACKLANE.blue, fontWeight: 600, fontSize: 14 }}>What you can book</a>
                </div>
              </div>
              <p>
                For Uber or Lyft, choose <strong>Miami Freedom Park</strong> as your destination. Drivers use the park&rsquo;s own pickup and drop-off area, a short walk from the stadium, and it is the simplest option if you are coming from a hotel on the beach.
              </p>
            </GuideCard>

            <GuideCard icon={TrainFront} title="Train">
              <p>
                Take Metrorail&rsquo;s Orange Line or Tri-Rail to the <strong>Miami Intermodal Center</strong>. Metrorail lists it as Miami International Airport and Tri-Rail as Miami Airport. From the station, walk south to NW 21st Street, cross at NW 38th Court and follow the signs over the pedestrian bridge into the park.
              </p>
            </GuideCard>

            <GuideCard icon={Plane} title="Flying in">
              <p>
                Miami International Airport is next door. From the terminal it is a short rideshare or a <a href="#blacklane" style={{ color: '#007C91', fontWeight: 600 }}>Blacklane transfer</a>, or take the MIA Mover to the Miami Intermodal Center and follow the walking route above. Hotels in the airport cluster run free shuttles to the terminal.
              </p>
            </GuideCard>
          </div>
        </div>
      </section>

      {/* ─── BLACKLANE ────────────────────────────────────────────────── */}
      <section id="blacklane" style={{ background: BLACKLANE.black, padding: 'clamp(64px,8vw,110px) clamp(24px,5vw,80px)', scrollMarginTop: 72 }}>
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-center" style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div>
            <img src={BLACKLANE.logo} alt="Blacklane" width={1504} height={291} style={{ width: 'min(220px, 60vw)', height: 'auto', display: 'block', marginBottom: 32 }} />
            <h2 className="miami-headline" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.5rem)', color: '#FFFFFF', marginBottom: 14 }}>
              Book a chauffeur for the whole trip
            </h2>
            <p className="miami-body" style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.6, maxWidth: 520 }}>
              Blacklane is the Official Chauffeur Partner of Soccerex Miami 2026. Book ahead and a professional chauffeur will be ready when you land, when the sessions end and whenever you have a meeting across town.
            </p>
            <a href={BLACKLANE.book} target="_blank" rel="noopener" className="inline-flex items-center gap-2 mt-8" style={{ background: BLACKLANE.blue, color: BLACKLANE.black, padding: '14px 26px', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none' }}>
              Book with Blacklane <ExternalLink size={15} />
            </a>
          </div>
          <dl className="grid grid-cols-1 gap-3">
            {[
              { label: 'Airport transfers', body: 'From Miami International or Fort Lauderdale to your hotel, booked before you fly.' },
              { label: 'Hotel to stadium', body: 'To Nu Stadium in the morning and back after the last session or the Social Evening.' },
              { label: 'By the hour', body: 'A car and chauffeur for as long as you need one, between meetings, dinners and the VIP Welcome Night on Miami Beach.' },
            ].map((item) => (
              <div key={item.label} style={{ border: '1px solid rgba(179,219,245,0.22)', padding: '18px 20px' }}>
                <dt className="miami-body" style={{ color: BLACKLANE.blue, fontWeight: 700, fontSize: '1.02rem', marginBottom: 4 }}>{item.label}</dt>
                <dd className="miami-body" style={{ color: 'rgba(255,255,255,0.78)', fontSize: '0.98rem', lineHeight: 1.55 }}>{item.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ─── ARRIVING ─────────────────────────────────────────────────── */}
      <section id="arriving" style={{ background: '#FAFBFC', padding: 'clamp(64px,8vw,110px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <h2 className="miami-headline" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.5rem)', color: '#0D1B2A', marginBottom: 14 }}>
            What happens <span className="miami-text-gradient">when I arrive?</span>
          </h2>
          <p className="miami-body mb-10" style={{ fontSize: '1.05rem', color: '#3a4a5a', maxWidth: 720, lineHeight: 1.6 }}>
            Getting in takes a few minutes. Plan to arrive a little before your first session on Thursday, since that is when everyone picks up a badge.
          </p>

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { n: 1, title: 'Park and walk in', body: 'Leave the car in the Audi Black Lot and walk to the West Club VIP Entrance on the west side of the stadium, right beside the lot.' },
              { n: 2, title: 'Pick up your badge', body: 'Registration sits at the entrance and opens at 8:00 AM on Thursday. Bring photo ID that matches the name on your pass, and have your QR code open in your welcome email or the Soccerex Events app so the team can print your badge.' },
              { n: 3, title: 'Wear it both days', body: 'Your badge gets you into the sessions, the exhibition and Thursday\u2019s Social Evening, and you will need it again on Friday.' },
            ].map(({ n, title, body }) => (
              <li key={n} className="miami-card-light">
                <span className="miami-headline" style={{ fontSize: 30, color: '#E91E63', lineHeight: 1 }}>{n}</span>
                <h3 className="miami-headline mt-3 mb-2" style={{ fontSize: '1.15rem', color: '#0D1B2A' }}>{title}</h3>
                <p className="miami-body" style={{ fontSize: '0.95rem', color: '#3a4a5a', lineHeight: 1.55 }}>{body}</p>
              </li>
            ))}
          </ol>

          <h3 className="miami-headline mt-14 mb-5" style={{ fontSize: '1.35rem', color: '#0D1B2A' }}>Where things are inside</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { place: 'Main Stage', what: 'Every session on the agenda.' },
              { place: 'West Club', what: 'The exhibition, with our partners and exhibitors.' },
              { place: 'Nu Club and West Club', what: 'Live feeds of the panels, so you can follow a session while you meet.' },
              { place: social.room, what: 'The Social Evening, straight after Thursday\u2019s last session.' },
            ].map(({ place, what }) => (
              <div key={place} style={{ background: '#fff', border: '1px solid rgba(13,27,42,0.08)', padding: '16px 18px' }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#0D1B2A', marginBottom: 4 }}>{place}</p>
                <p className="miami-body" style={{ fontSize: 14, color: '#3a4a5a', lineHeight: 1.5 }}>{what}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EACH DAY ─────────────────────────────────────────────────── */}
      <section id="each-day" style={{ background: '#FFFFFF', padding: 'clamp(64px,8vw,110px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <h2 className="miami-headline" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.5rem)', color: '#0D1B2A', marginBottom: 14 }}>
            What is on <span className="miami-text-gradient">each day?</span>
          </h2>
          <p className="miami-body mb-10" style={{ fontSize: '1.05rem', color: '#3a4a5a', maxWidth: 720, lineHeight: 1.6 }}>
            Wednesday brings the Community Impact Event at the stadium and a VIP reception on Miami Beach, followed by two full days of sessions at Nu Stadium.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <DayCard day="Wednesday" date="September 23">
              <DayItem time={`${clock(impact.start)} to ${clock(impact.end)}`} title="Community Impact Event">
                On the {impact.room.toLowerCase()} at Nu Stadium, an afternoon for young players from across Miami and the organizations that coach them.
              </DayItem>
              <DayItem time="7:00 to 10:00 PM" title="VIP Welcome Night">
                At the Savoy Hotel and Beach Club, 425 Ocean Drive, Miami Beach, for VIP pass holders. Parking at the hotel is limited, so a rideshare or a <a href="#blacklane" style={{ color: '#007C91', fontWeight: 600 }}>Blacklane chauffeur</a> is easier, and please <Link to={MIAMI_2026_VIP_NIGHT} style={{ color: '#007C91', fontWeight: 600 }}>let us know you are coming</Link>. Bring your QR code and check in at the registration desk in the lobby when you arrive.
              </DayItem>
            </DayCard>

            <DayCard day="Thursday" date="September 24">
              <DayItem time="From 8:00 AM" title="Registration">
                Pick up your badge at the entrance.
              </DayItem>
              <DayItem time={`${clock(thursday.start)} to ${clock(thursday.end)}`} title="Sessions">
                The first day of the program on the Main Stage, with the exhibition open in the West Club.
              </DayItem>
              <DayItem time={`${clock(social.start)} to ${clock(social.end)}`} title="Social Evening">
                Drinks and networking in the {social.room} once the last session ends, open to every pass.
              </DayItem>
            </DayCard>

            <DayCard day="Friday" date="September 25">
              <DayItem time={`${clock(friday.start)} to ${clock(friday.end)}`} title="Sessions">
                The second day of the program, with the exhibition open alongside it.
              </DayItem>
            </DayCard>
          </div>

          <div className="flex flex-wrap gap-3 mt-10">
            <Link to={eventAgenda(EVENT_SLUG)} className="miami-pill-primary">
              <Calendar size={16} /> See the full running order
            </Link>
            <a href={eventAgendaPdfUrl(EVENT_SLUG)} className="miami-pill-outline">
              <FileText size={15} /> Download the agenda (PDF)
            </a>
          </div>
        </div>
      </section>

      {/* ─── APP ──────────────────────────────────────────────────────── */}
      <section id="app" style={{ background: '#0D1B2A', padding: 'clamp(64px,8vw,110px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="miami-headline" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.5rem)', color: '#fff', marginBottom: 14 }}>
              Carry the event in <span className="miami-text-gradient">your pocket</span>
            </h2>
            <p className="miami-body mb-8" style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', maxWidth: 520, lineHeight: 1.6 }}>
              The Soccerex Events app has the agenda, the speakers, the exhibitors and everyone else who is attending, so you can find the people you came to meet while you are in the building.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={APP_STORE} target="_blank" rel="noopener noreferrer" className="miami-pill-primary"><Smartphone size={16} /> App Store</a>
              <a href={PLAY_STORE} target="_blank" rel="noopener noreferrer" className="miami-pill-outline" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}><Smartphone size={16} /> Google Play</a>
            </div>
            <p className="miami-body mt-5" style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
              More help on the <Link to={APP_PAGE} style={{ color: '#7FE9F5', fontWeight: 600 }}>app page</Link>.
            </p>
          </div>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0 }} className="flex flex-col gap-3">
            {[
              'Download Soccerex Events from the App Store or Google Play.',
              'Open it and search for "Soccerex" to find Soccerex Miami 2026.',
              'Enter the email address you registered with.',
              'Type in the passcode we email you, and you are in.',
            ].map((step, i) => (
              <li key={step} className="flex gap-4 items-start" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', padding: '14px 16px' }}>
                <span className="miami-headline" style={{ fontSize: 22, color: '#E91E63', lineHeight: 1, minWidth: 18 }}>{i + 1}</span>
                <span className="miami-body" style={{ fontSize: 15, color: '#fff', lineHeight: 1.5 }}>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── STAY AND HELP ───────────────────────────────────────────── */}
      <section style={{ background: '#FFF8F4', padding: 'clamp(64px,8vw,110px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <GuideCard icon={BedDouble} title="Still need a hotel?">
            <p>
              Our partner hotels run from the airport cluster, minutes from the stadium, to oceanfront South Beach. Rates and booking links are on the Travel and Stay page.
            </p>
            <Link to={ACCOMMODATIONS} className="miami-pill-primary mt-5" style={{ display: 'inline-flex' }}>
              Travel and Stay <ArrowRight size={15} />
            </Link>
          </GuideCard>
          <GuideCard icon={BadgeCheck} title="Something about your pass?">
            <p>
              Email <a href={`mailto:${HELP_EMAIL}`} style={{ color: '#007C91', fontWeight: 600 }}>{HELP_EMAIL}</a> with the name you registered under and the team will sort it out, whether it is a change of name, a missing confirmation or a question about what your pass includes.
            </p>
          </GuideCard>
        </div>
      </section>
    </div>
  )
}

function GuideCard({ icon, title, children }) {
  const CardIcon = icon
  return (
    <div className="miami-card-light" style={{ height: '100%' }}>
      <CardIcon size={24} style={{ color: '#E91E63', marginBottom: 14 }} />
      <h3 className="miami-headline mb-3" style={{ fontSize: '1.2rem', color: '#0D1B2A' }}>{title}</h3>
      <div className="miami-body" style={{ fontSize: '0.98rem', color: '#3a4a5a', lineHeight: 1.6 }}>{children}</div>
    </div>
  )
}

function MapLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5"
      style={{ fontSize: 14, fontWeight: 600, color: '#0D1B2A', border: '1px solid rgba(13,27,42,0.18)', padding: '7px 12px', textDecoration: 'none' }}>
      {children} <ExternalLink size={12} style={{ opacity: 0.6 }} />
    </a>
  )
}

function DayCard({ day, date, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid rgba(13,27,42,0.10)', boxShadow: '0 18px 44px -32px rgba(13,27,42,0.5)' }}>
      <div style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1E3350 100%)', padding: '18px 22px' }}>
        <h3 className="miami-headline" style={{ fontSize: '1.4rem', color: '#fff', lineHeight: 1.1 }}>{day}</h3>
        <p className="miami-body" style={{ fontSize: 14, color: '#7FE9F5', marginTop: 2 }}>{date}</p>
      </div>
      <div className="flex flex-col" style={{ padding: '8px 22px 18px' }}>{children}</div>
    </div>
  )
}

function DayItem({ time, title, children }) {
  return (
    <div style={{ padding: '14px 0', borderBottom: '1px solid rgba(13,27,42,0.07)' }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#E91E63', marginBottom: 2 }}>{time}</p>
      <p style={{ fontSize: 16, fontWeight: 700, color: '#0D1B2A', marginBottom: 4 }}>{title}</p>
      <p className="miami-body" style={{ fontSize: 14.5, color: '#3a4a5a', lineHeight: 1.5 }}>{children}</p>
    </div>
  )
}
