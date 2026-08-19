import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Gift, FileCheck2, Ticket, BedDouble, Mail, ScrollText,
} from 'lucide-react'
import { MIAMI_2026, ACCOMMODATIONS, DEAL_NETWORK_APPLY } from '../lib/routes'

const HERO_IMG = '/hotels/ritz-south-beach-lobby.jpg'

/*
 * Every operational fact of the promotion lives in this one block so the terms
 * can be updated without touching the page structure. Dates, the entry cap,
 * the prize value, and the contact address are the lines legal/marketing will
 * want to confirm before this goes wide.
 */
const PROMO = {
  sponsorLine: 'Soccerex ("the Sponsor"), the organiser of Soccerex Miami 2026.',
  entryOpens: '20 August 2026',
  entryCloses: '11:59 PM Eastern Time on 18 September 2026',
  entryCap: 100,
  drawDate: 'on or about 19 September 2026',
  prizeNights: 'three nights, checking in 22 September and checking out 25 September 2026',
  prizeValue: 'US$3,000',
  responseWindow: '48 hours',
  contactEmail: 'enquiries@soccerex.com',
}

const HOW_IT_WORKS = [
  {
    icon: FileCheck2,
    title: 'Complete your application',
    body: 'Submit a completed Soccerex Deal Network application. The application is free, and every completed application also receives a private 30% off code for Soccerex Miami 2026.',
  },
  {
    icon: Ticket,
    title: 'Be among the first 100',
    body: `The first ${PROMO.entryCap} completed applications received during the entry period are automatically entered into the drawing. No separate entry step, no purchase.`,
  },
  {
    icon: BedDouble,
    title: 'One winner stays at the Ritz',
    body: 'One entrant is selected at random to receive a Soccerex-covered stay at The Ritz-Carlton, South Beach during Soccerex Miami 2026.',
  },
]

const TERMS = [
  {
    title: 'The promotion',
    body: [
      'These terms govern the Ritz-Carlton, South Beach stay drawing (the "Drawing") run in connection with applications to the Soccerex Deal Network for Soccerex Miami 2026, held 23 to 25 September 2026 at Nu Stadium, Miami.',
      'By submitting a completed Deal Network application during the entry period, you accept these terms in full.',
    ],
  },
  {
    title: 'Sponsor',
    body: [
      `The Drawing is operated by ${PROMO.sponsorLine}`,
      'The Ritz-Carlton, South Beach and Marriott International are not sponsors of, and are not affiliated with, this promotion.',
    ],
  },
  {
    title: 'Eligibility',
    body: [
      'The Drawing is open to individuals aged 18 or over who submit a completed Deal Network application on behalf of an organisation they are authorised to represent.',
      'Employees of Soccerex, their immediate families, and anyone professionally engaged in organising Soccerex Miami 2026 are not eligible.',
      'The Drawing is void where prohibited or restricted by law.',
    ],
  },
  {
    title: 'How to enter and entry period',
    body: [
      `The entry period opens on ${PROMO.entryOpens} and closes at ${PROMO.entryCloses}, or earlier at the moment the first ${PROMO.entryCap} completed applications have been received, whichever comes first.`,
      'To enter, complete and submit the Soccerex Deal Network application. An application counts as completed when every required field has been submitted and the application has been received by Soccerex.',
      'One entry per person and per organisation. Entry is free: no purchase or payment of any kind is necessary to enter or win, and a purchase does not improve the chances of winning.',
    ],
  },
  {
    title: 'The prize',
    body: [
      `One (1) winner receives a stay at The Ritz-Carlton, South Beach, Miami Beach, Florida of ${PROMO.prizeNights}, in a standard room, with room rate and room taxes covered by the Sponsor. The approximate retail value of the prize is ${PROMO.prizeValue}.`,
      'Travel to and from Miami, airport transfers, resort incidentals, meals, and any other expenses not expressly stated are the winner’s responsibility.',
      'The prize is non-transferable, cannot be exchanged for cash or credit, and must be used on the stated dates. The stay is subject to the hotel’s availability and standard policies.',
    ],
  },
  {
    title: 'Winner selection and odds',
    body: [
      `The winner is selected by randomized drawing from all eligible entries ${PROMO.drawDate}.`,
      `Odds of winning depend on the number of completed applications received during the entry period and are never worse than 1 in ${PROMO.entryCap}.`,
    ],
  },
  {
    title: 'Notification and claiming the prize',
    body: [
      `The winner is notified by email at the address on their application within one business day of the drawing, and must confirm acceptance within ${PROMO.responseWindow} of notification.`,
      'If the winner cannot be reached, does not respond in time, or is found ineligible, an alternate winner is drawn from the remaining eligible entries.',
    ],
  },
  {
    title: 'Publicity',
    body: [
      'The Sponsor may announce the winner’s name and organisation in connection with Soccerex Miami 2026, with the winner’s consent where that consent is required by law.',
    ],
  },
  {
    title: 'General conditions',
    body: [
      'The Sponsor may suspend, modify, or cancel the Drawing if it cannot run as planned for reasons beyond the Sponsor’s reasonable control; in that case these terms will be updated on this page.',
      'The Sponsor’s decisions on all matters relating to the Drawing are final.',
      'To the fullest extent permitted by law, the Sponsor is not responsible for travel disruptions, hotel service matters, or any loss arising from acceptance or use of the prize.',
      'The Drawing and these terms are governed by the laws of the State of Florida.',
    ],
  },
  {
    title: 'Contact',
    body: [
      `Questions about the Drawing or these terms: ${PROMO.contactEmail}.`,
    ],
  },
]

export default function RitzDrawingTerms() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Ritz-Carlton Drawing | Soccerex Miami 2026'
  }, [])

  return (
    <div className="event-page theme-miami" style={{ background: '#FFF8F4' }}>

      {/* ─── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#0D1B2A', minHeight: 'min(62vh, 560px)', display: 'flex', alignItems: 'flex-end' }}>
        <img src={HERO_IMG} alt="The lobby of The Ritz-Carlton, South Beach" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.55 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,27,42,0.55) 0%, rgba(13,27,42,0.4) 38%, rgba(13,27,42,0.95) 100%)' }} />

        <div className="relative z-10" style={{ maxWidth: '1180px', margin: '0 auto', width: '100%', padding: 'clamp(90px,12vw,130px) clamp(24px,5vw,72px) clamp(44px,6vw,68px)' }}>
          <Link to={MIAMI_2026} className="inline-flex items-center gap-2 font-mono uppercase mb-8" style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, letterSpacing: '0.2em', textDecoration: 'none', textShadow: '0 1px 10px rgba(0,0,0,0.65)' }}>
            <ArrowLeft size={14} /> Back to Soccerex Miami
          </Link>

          <h1 className="miami-headline" style={{ fontSize: 'clamp(1.9rem, 4.6vw, 3.2rem)', color: '#fff', lineHeight: 1.1, maxWidth: 880, textWrap: 'balance' }}>
            The Ritz-Carlton South Beach drawing:<br />
            <span className="miami-text-gradient">official terms</span>
          </h1>
          <p className="miami-body mt-6 mb-9" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)', color: 'rgba(255,255,255,0.85)', maxWidth: 660, lineHeight: 1.6 }}>
            The first {PROMO.entryCap} completed Soccerex Deal Network applications are entered into a randomized drawing for a Soccerex-covered stay at The Ritz-Carlton, South Beach during Soccerex Miami 2026. Everything about how it works, on one page.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link to={DEAL_NETWORK_APPLY} className="miami-pill-primary">
              <Gift size={16} /> Apply to the Deal Network
            </Link>
            <a href="#terms" className="miami-pill-outline" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
              Read the terms <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section style={{ background: '#FFFFFF', padding: 'clamp(64px,8vw,100px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <h2 className="miami-headline text-center mb-3" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.5rem)', color: '#0D1B2A' }}>
            How the drawing <span className="miami-text-gradient">works</span>
          </h2>
          <p className="miami-body text-center mx-auto mb-11" style={{ fontSize: '1.05rem', color: '#3a4a5a', maxWidth: 640 }}>
            Three steps, no purchase, no separate entry form. Your completed application is your entry.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map(({ icon: Icon, title, body }, i) => (
              <div key={title} className="miami-card-light" style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', top: 18, right: 20, fontSize: 40, lineHeight: 1, fontWeight: 700, color: 'rgba(13,27,42,0.07)' }}>{i + 1}</span>
                <Icon size={22} style={{ color: '#E91E63', marginBottom: 14 }} />
                <h3 className="miami-subhead mb-2" style={{ fontSize: '0.9rem', color: '#0D1B2A', letterSpacing: '0.06em' }}>{title}</h3>
                <p className="miami-body" style={{ fontSize: '0.9rem', color: '#3a4a5a', lineHeight: 1.55 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OFFICIAL TERMS ──────────────────────────────────────────────── */}
      <section id="terms" style={{ background: '#FAFBFC', padding: 'clamp(64px,8vw,100px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div className="flex items-center gap-3 mb-3">
            <ScrollText size={22} style={{ color: '#E91E63' }} />
            <h2 className="miami-headline" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.3rem)', color: '#0D1B2A' }}>Official terms</h2>
          </div>
          <p className="miami-body mb-10" style={{ fontSize: '0.95rem', color: '#607186' }}>
            Last updated 19 August 2026. These terms apply to the Ritz-Carlton stay drawing only; the 30% off code is provided to every completed application and is not part of the Drawing.
          </p>

          <ol style={{ listStyle: 'none', margin: 0, padding: 0, counterReset: 'terms' }}>
            {TERMS.map((section, i) => (
              <li key={section.title} style={{ background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.10)', padding: 'clamp(18px,2.6vw,26px)', marginBottom: 14 }}>
                <h3 className="miami-subhead mb-3" style={{ fontSize: '0.95rem', color: '#0D1B2A', letterSpacing: '0.06em' }}>
                  <span style={{ color: '#E91E63', marginRight: 10 }}>{i + 1}.</span>{section.title}
                </h3>
                {section.body.map((para) => (
                  <p key={para} className="miami-body" style={{ fontSize: '0.92rem', color: '#3a4a5a', lineHeight: 1.6, marginBottom: 8 }}>{para}</p>
                ))}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── CLOSING CTA ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0D1B2A 0%, #102538 100%)', padding: 'clamp(64px,8vw,100px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 miami-grid" style={{ opacity: 0.3 }} />
        <div className="relative z-10 text-center" style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 className="miami-headline text-white mb-4" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.4rem)' }}>
            Your application is <span className="miami-text-gradient">your entry</span>
          </h2>
          <p className="miami-body mx-auto mb-8" style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: 520 }}>
            Complete your Soccerex Deal Network application while the first {PROMO.entryCap} places are open, and get your private 30% off code either way.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to={DEAL_NETWORK_APPLY} className="miami-pill-primary">
              <Gift size={15} /> Apply now
            </Link>
            <Link to={ACCOMMODATIONS} className="miami-pill-outline" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
              <BedDouble size={15} /> See the Ritz on our hotels page
            </Link>
            <a href={`mailto:${PROMO.contactEmail}`} className="miami-pill-outline" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
              <Mail size={15} /> Questions
            </a>
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
