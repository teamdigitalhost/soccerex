import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, MapPin, Calendar, BedDouble, ShieldCheck, Lock,
  Plane, Clock, Globe2, Car, ExternalLink, BadgeCheck,
} from 'lucide-react'
import { HOME, MIAMI_2026 } from '../lib/routes'

const HERO_IMG = '/events/miami/2026/sections/miami-night.jpg'
const SKYLINE_IMG = '/events/miami/2026/sections/miami-skyline.jpg'

/*
 * Partner-hotel booking links. Each opens the hotel's own secure site in a new
 * tab. Keep these as single constants so they are trivial to update.
 *
 * ⚠ IHG DATE FIX: the link supplied by the hotel targeted AUGUST 22-26, 2026
 * (checkInMonthYear=082026), a month before the event. Corrected here to
 * SEPTEMBER (092026) so delegates land on the right dates. Confirm with the
 * property that the Soccerex group rate (GPC=SMM) covers 22-26 September 2026.
 */
/*
 * Ordered closest-to-venue first. Property identities confirmed to high
 * confidence (each link's live group block names the exact hotel). Distances
 * are approximate estimates from mapped addresses, phrased as such. `image` is
 * null until official partner-hotel photos are supplied; the card renders a
 * branded header placeholder in the meantime, and a photo drops straight in.
 */
const HOTELS = [
  {
    key: 'marriott',
    brand: 'Marriott',
    name: 'Fairfield by Marriott Miami Airport South',
    tag: 'Closest to the venue',
    neighborhood: 'Miami Airport, Grapeland Heights',
    venue: 'Under 10 min drive',
    mia: 'About 1 mi · free shuttle',
    rating: '3-star',
    tier: '$$',
    amenities: ['Free MIA shuttle', 'Free hot breakfast', 'Outdoor pool', '24h fitness'],
    note: 'On the airport’s doorstep and the shortest run to the stadium of our partner hotels.',
    site: 'Marriott.com',
    image: '/hotels/fairfield.jpg',
    url: 'https://www.marriott.com/event-reservations/reservation-link.mi?id=1785357856119&key=GRP&app=resvlink',
  },
  {
    key: 'moxy',
    brand: 'Moxy by Marriott',
    name: 'Moxy Miami Wynwood',
    tag: 'Group rate · $114/night',
    neighborhood: 'Wynwood Arts District',
    venue: 'About 15 to 20 min drive',
    mia: 'About 6 mi · rideshare',
    rating: '4-star',
    tier: '$$',
    amenities: ['Rooftop pool + bar', 'Bars & restaurants on site', '24h fitness', 'Walk to galleries & murals'],
    note: 'The city option: a special Soccerex group rate at Moxy’s playful Wynwood base, in the middle of Miami’s murals, galleries and nightlife.',
    site: 'Marriott.com',
    image: null,
    url: 'https://www.marriott.com/event-reservations/reservation-link.mi?id=1785507819738&key=GRP&app=resvlink&_branch_match_id=1603047272973469168&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXTywo0MtNLCrKzC8p0UvOz9UvSi0uy0wtN7IHytiCODmZedlqmSm2huYWpqYG5haGlubGFmrZqZW27kEBanVFqWmpQO156fFJRfnlxalFts4ZRfm5qQDayio1YQAAAA%3D%3D',
  },
  {
    key: 'ihg',
    brand: 'Holiday Inn',
    name: 'Holiday Inn Miami-International Airport',
    tag: 'By the airport',
    neighborhood: 'Miami Springs, by MIA',
    venue: 'About 12 to 18 min drive',
    mia: 'About 2.7 mi · free 24h shuttle',
    rating: '3-star',
    tier: '$$',
    amenities: ['Free 24h MIA shuttle', 'Outdoor pool', 'On-site restaurant', '24h fitness'],
    note: 'A relaxed airport-area base in Miami Springs with a round-the-clock shuttle.',
    site: 'IHG.com',
    image: '/hotels/holiday-inn.webp',
    url: 'https://www.ihg.com/redirect?path=rates&brandCode=HI&localeCode=en&regionCode=1&hotelCode=MIAIA&checkInDate=22&checkInMonthYear=092026&checkOutDate=26&checkOutMonthYear=092026&_PMID=99801505&GPC=SMM&cn=no&adjustMonth=false&showApp=true&monthIndex=00',
  },
  {
    key: 'hilton',
    brand: 'Hilton',
    name: 'DoubleTree by Hilton Miami Airport',
    tag: 'Full-service',
    neighborhood: 'Airport West, Blue Lagoon',
    venue: 'About 12 to 20 min drive',
    mia: 'About 2 to 3 mi · free shuttle',
    rating: '3-star',
    tier: '$$',
    amenities: ['Free MIA shuttle', 'Heated pool + hot tub', 'On-site restaurants', 'Fitness center'],
    note: 'A full-service DoubleTree next to the Miami Airport Convention Center.',
    site: 'Hilton.com',
    image: '/hotels/doubletree.jpg',
    url: 'https://www.hilton.com/en/attend-my-event/soccerex-miami-florida/',
  },
]

const TRUST = [
  { icon: BadgeCheck, title: 'Lined up for delegates', body: 'Rooms and rates set up for Soccerex Miami, booked straight from the event’s own hotel links.' },
  { icon: Lock, title: 'Secure booking, direct', body: 'Every link goes to the hotel’s own website. Your details and payment stay with the hotel.' },
  { icon: MapPin, title: 'Airport-corridor options', body: 'Choices across Miami, including hotels right by the airport corridor near Miami Freedom Park.' },
  { icon: ShieldCheck, title: 'No middlemen', body: 'No third-party booking sites and no booking-site markups. Just you and the hotel.' },
]

const GETTING_AROUND = [
  { icon: Plane, title: 'Fly into MIA', body: 'Miami International Airport is the main gateway and sits close to Miami Freedom Park. Fort Lauderdale (FLL) is a second option for some routes.' },
  { icon: Car, title: 'Airport transfers', body: 'Rideshare and taxis run around the clock at MIA. Many partner hotels are a short hop from the terminals.' },
  { icon: MapPin, title: 'Getting to the venue', body: 'Nu Stadium at Miami Freedom Park is near the airport corridor, so a hotel in that area keeps your daily commute short.' },
]

export default function MiamiAccommodations() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Accommodations | Soccerex Miami 2026'
  }, [])

  return (
    <div className="event-page theme-miami" style={{ background: '#FFF8F4' }}>

      {/* ─── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#0D1B2A', minHeight: 'min(82vh, 720px)', display: 'flex', alignItems: 'flex-end' }}>
        <img src={HERO_IMG} alt="Miami skyline at dusk over Biscayne Bay" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.62 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,27,42,0.5) 0%, rgba(13,27,42,0.35) 38%, rgba(13,27,42,0.95) 100%)' }} />

        <div className="relative z-10" style={{ maxWidth: '1180px', margin: '0 auto', width: '100%', padding: 'clamp(90px,12vw,130px) clamp(24px,5vw,72px) clamp(44px,6vw,68px)' }}>
          <Link to={MIAMI_2026} className="inline-flex items-center gap-2 font-mono uppercase mb-8" style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, letterSpacing: '0.2em', textDecoration: 'none', textShadow: '0 1px 10px rgba(0,0,0,0.65)' }}>
            <ArrowLeft size={14} /> Back to Soccerex Miami
          </Link>

          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="miami-subhead" style={{ fontSize: 12, letterSpacing: '0.24em', color: '#fff' }}><Calendar size={12} className="inline mr-1.5" style={{ marginTop: -2 }} />23-25 SEPTEMBER 2026</span>
            <span style={{ width: 7, height: 7, background: '#E91E63' }} />
            <span className="miami-subhead" style={{ fontSize: 12, letterSpacing: '0.24em', color: '#00C6D7' }}><MapPin size={12} className="inline mr-1.5" style={{ marginTop: -2 }} />NU STADIUM, MIAMI</span>
          </div>

          <p className="miami-kicker" style={{ color: '#00C6D7' }}>Travel &amp; Stay</p>
          <h1 className="miami-headline" style={{ fontSize: 'clamp(2rem, 5vw, 3.6rem)', color: '#fff', lineHeight: 1.08, maxWidth: 900, textWrap: 'balance' }}>
            Your Soccerex Miami hotel,<br />
            <span className="miami-text-gradient">sorted in minutes.</span>
          </h1>
          <p className="miami-body mt-6 mb-9" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)', color: 'rgba(255,255,255,0.85)', maxWidth: 660, lineHeight: 1.6 }}>
            We have lined up trusted hotels for Soccerex Miami delegates, with partner rates and secure booking on each hotel’s own site. Choose your hotel, tap through, and your stay is handled.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a href="#hotels" className="miami-pill-primary">
              <BedDouble size={16} /> Choose your hotel
            </a>
            <a href="#travel" className="miami-pill-outline" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
              Travel tips <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ─── HOTELS (conversion core) ────────────────────────────────────── */}
      <section id="hotels" style={{ background: '#FFFFFF', padding: 'clamp(64px,8vw,110px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div className="text-center mb-3 flex flex-col items-center">
            <p className="miami-kicker miami-kicker--pink">Partner hotels</p>
            <h2 className="miami-headline" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.5rem)', color: '#0D1B2A' }}>
              Book your room in <span className="miami-text-gradient">a few steps</span>
            </h2>
          </div>
          <p className="miami-body text-center mx-auto mb-11" style={{ fontSize: '1.05rem', color: '#3a4a5a', maxWidth: 660 }}>
            Three sit in the Miami International Airport cluster, the closest area to Nu Stadium, each with a free airport shuttle — plus a group-rate pick in Wynwood for staying in the city. Every option books directly on the hotel’s own secure website, so pick your spot and reserve.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOTELS.map((h) => (
              <div key={h.key} className="flex flex-col" style={{ background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.10)', boxShadow: '0 18px 44px -30px rgba(13,27,42,0.5)' }}>
                {/* Image slot / branded header — real photo drops in when h.image is set */}
                <div style={{ position: 'relative', height: 168, overflow: 'hidden', background: h.image ? '#0D1B2A' : 'linear-gradient(135deg, #0D1B2A 0%, #007C91 55%, #E91E63 125%)' }}>
                  {h.image && <img src={h.image} alt={h.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                  <div className="absolute inset-0 miami-grid" style={{ opacity: 0.22 }} aria-hidden />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,27,42,0.10) 0%, rgba(13,27,42,0.74) 100%)' }} />
                  <span className="event-badge" style={{ position: 'absolute', top: 12, right: 12, zIndex: 2, fontSize: 9.5 }}><span className="event-badge-dot" /> {h.tag}</span>
                  <div style={{ position: 'absolute', left: 18, right: 18, bottom: 15, zIndex: 2 }}>
                    <p className="miami-subhead" style={{ color: '#7FE9F5', fontSize: 9, letterSpacing: '0.22em', marginBottom: 3 }}>{h.brand}</p>
                    <h3 className="miami-headline" style={{ color: '#fff', fontSize: '1.02rem', lineHeight: 1.14, textTransform: 'none', letterSpacing: '0.01em' }}>{h.name}</h3>
                  </div>
                </div>
                {/* Body */}
                <div className="flex flex-col flex-1" style={{ padding: '18px 20px 22px' }}>
                  <p className="flex items-center gap-1.5 mb-3.5" style={{ fontSize: 12, color: '#607186' }}>
                    <MapPin size={13} style={{ color: '#E91E63', flexShrink: 0 }} /> {h.neighborhood}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div style={{ background: '#FAFBFC', border: '1px solid rgba(13,27,42,0.07)', padding: '9px 11px' }}>
                      <p className="miami-subhead flex items-center gap-1" style={{ fontSize: 8.5, letterSpacing: '0.12em', color: '#607186', marginBottom: 3 }}><MapPin size={10} /> To venue</p>
                      <p style={{ fontSize: 12.5, color: '#0D1B2A', fontWeight: 600, lineHeight: 1.2 }}>{h.venue}</p>
                    </div>
                    <div style={{ background: '#FAFBFC', border: '1px solid rgba(13,27,42,0.07)', padding: '9px 11px' }}>
                      <p className="miami-subhead flex items-center gap-1" style={{ fontSize: 8.5, letterSpacing: '0.12em', color: '#607186', marginBottom: 3 }}><Plane size={10} /> To airport</p>
                      <p style={{ fontSize: 12.5, color: '#0D1B2A', fontWeight: 600, lineHeight: 1.2 }}>{h.mia}</p>
                    </div>
                  </div>
                  <p className="miami-subhead mb-2.5" style={{ fontSize: 11, letterSpacing: '0.08em', color: '#0D1B2A' }}>{h.rating} &middot; {h.tier}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {h.amenities.map((a) => (
                      <span key={a} style={{ fontSize: 11, color: '#3a4a5a', background: 'rgba(0,124,145,0.06)', border: '1px solid rgba(0,124,145,0.15)', padding: '3px 8px' }}>{a}</span>
                    ))}
                  </div>
                  <p className="miami-body flex-1" style={{ fontSize: 12.5, color: '#607186', lineHeight: 1.5, marginBottom: 16 }}>{h.note}</p>
                  <a href={h.url} target="_blank" rel="noopener noreferrer" aria-label={`Book your room at ${h.name}`} className="miami-pill-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }}>
                    Book your room <ArrowRight size={15} />
                  </a>
                  <p className="miami-subhead flex items-center justify-center gap-1.5" style={{ fontSize: 10, color: '#607186', letterSpacing: '0.12em' }}>
                    <Lock size={11} /> Secure booking on {h.site}
                    <ExternalLink size={10} style={{ opacity: 0.6 }} />
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="miami-body text-center mx-auto mt-8" style={{ fontSize: '0.9rem', color: '#607186', maxWidth: 620 }}>
            Booking opens in a new tab on the hotel’s official website. Distances are approximate. Rates, availability, and cancellation terms are set and managed by each hotel.
          </p>
        </div>
      </section>

      {/* ─── WHY BOOK THROUGH THESE ──────────────────────────────────────── */}
      <section style={{ background: '#FAFBFC', padding: 'clamp(64px,8vw,110px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <p className="miami-kicker miami-kicker--pink">Why book through these</p>
          <h2 className="miami-headline mb-10" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.3rem)', color: '#0D1B2A' }}>The easy call for a busy trip</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRUST.map(({ icon: Icon, title, body }) => (
              <div key={title} className="miami-card-light">
                <Icon size={22} style={{ color: '#E91E63', marginBottom: 14 }} />
                <h3 className="miami-subhead mb-2" style={{ fontSize: '0.9rem', color: '#0D1B2A', letterSpacing: '0.06em' }}>{title}</h3>
                <p className="miami-body" style={{ fontSize: '0.9rem', color: '#3a4a5a', lineHeight: 1.5 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="miami-divider" aria-hidden />

      {/* ─── TRAVEL HELP ─────────────────────────────────────────────────── */}
      <section id="travel" className="relative overflow-hidden" style={{ padding: 'clamp(64px,8vw,110px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative">
              <img src={SKYLINE_IMG} alt="Aerial view of the Miami coastline" style={{ width: '100%', objectFit: 'cover', aspectRatio: '16/11', boxShadow: '0 24px 60px -30px rgba(13,27,42,0.5)' }} />
              <div className="absolute" style={{ left: -14, top: -14, width: 64, height: 64, background: 'var(--miami-sunset)', zIndex: -1, opacity: 0.9 }} />
            </div>
            <div>
              <p className="miami-kicker miami-kicker--pink">Getting there &amp; around</p>
              <h2 className="miami-headline mb-5" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.3rem)', color: '#0D1B2A' }}>Arriving in Miami is the easy part</h2>
              <div className="flex flex-col gap-5">
                {GETTING_AROUND.map(({ icon: Icon, title, body }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div style={{ width: 40, height: 40, background: 'rgba(233,30,99,0.07)', border: '1px solid rgba(233,30,99,0.18)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <Icon size={19} style={{ color: '#E91E63' }} />
                    </div>
                    <div>
                      <h3 className="miami-subhead mb-1" style={{ fontSize: '0.9rem', color: '#0D1B2A', letterSpacing: '0.06em' }}>{title}</h3>
                      <p className="miami-body" style={{ fontSize: '0.92rem', color: '#3a4a5a', lineHeight: 1.5 }}>{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* When to book + international, side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="miami-card-light" style={{ display: 'flex', flexDirection: 'column' }}>
              <Clock size={22} style={{ color: '#007C91', marginBottom: 14 }} />
              <h3 className="miami-subhead mb-2" style={{ fontSize: '1rem', color: '#0D1B2A', letterSpacing: '0.06em' }}>When to book</h3>
              <p className="miami-body mb-5" style={{ fontSize: '0.95rem', color: '#3a4a5a', lineHeight: 1.55 }}>
                Group room blocks are limited and fill quickly for a major event. Book early to hold the rate and location that work best for you.
              </p>
              <a href="#hotels" className="miami-pill-outline" style={{ alignSelf: 'flex-start' }}>
                Back to hotels <ArrowRight size={15} />
              </a>
            </div>
            <div className="miami-card-light">
              <Globe2 size={22} style={{ color: '#007C91', marginBottom: 14 }} />
              <h3 className="miami-subhead mb-2" style={{ fontSize: '1rem', color: '#0D1B2A', letterSpacing: '0.06em' }}>Traveling from abroad</h3>
              <p className="miami-body mb-3" style={{ fontSize: '0.95rem', color: '#3a4a5a', lineHeight: 1.55 }}>
                Most international visitors need an approved ESTA or a US visa before they fly. Check the requirements for your country early and apply in good time.
              </p>
              <div className="flex flex-wrap gap-2">
                <a href="https://esta.cbp.dhs.gov/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5" style={{ fontSize: 12.5, fontWeight: 600, color: '#E91E63', textDecoration: 'none', padding: '9px 14px', border: '1px solid rgba(233,30,99,0.35)' }}>
                  Apply for ESTA <ExternalLink size={13} />
                </a>
                <a href="https://travel.state.gov/content/travel/en/us-visas.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5" style={{ fontSize: 12.5, fontWeight: 600, color: '#E91E63', textDecoration: 'none', padding: '9px 14px', border: '1px solid rgba(233,30,99,0.35)' }}>
                  US visa information <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CLOSING CTA ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0D1B2A 0%, #102538 100%)', padding: 'clamp(64px,8vw,110px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 miami-grid" style={{ opacity: 0.3 }} />
        <div className="relative z-10 text-center" style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div className="inline-flex mb-4">
            <span className="event-badge"><span className="event-badge-dot" /> Book early</span>
          </div>
          <h2 className="miami-headline text-white mb-4" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.5rem)' }}>
            Secure your room, then get <span className="miami-text-gradient">back to business</span>
          </h2>
          <p className="miami-body mx-auto mb-8" style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: 520 }}>
            Lock in your stay for Soccerex Miami now, while the group rates and best locations are still open. Book directly with any of our partner hotels.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {HOTELS.map((h) => (
              <a key={h.key} href={h.url} target="_blank" rel="noopener noreferrer" aria-label={`Book your room at ${h.name}`} className="miami-pill-primary">
                <BedDouble size={15} /> {h.brand}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer nav strip */}
      <div style={{ background: '#0D1B2A', padding: '18px 24px', textAlign: 'center' }}>
        <Link to={MIAMI_2026} className="font-mono uppercase" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: '0.2em', textDecoration: 'none' }}>
          Soccerex Miami &middot; 23-25 September 2026
        </Link>
      </div>
    </div>
  )
}
