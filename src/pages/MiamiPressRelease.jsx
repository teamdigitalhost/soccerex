import { useEffect } from 'react'
import { ArrowLeft, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MIAMI_2026 } from '../lib/routes'

// The downloadable original lives in public/ and is served at the site root.
const PDF_URL = '/events/miami/2026/soccerex-miami-2026-press-release.pdf'

const NAVY = '#0D1B2A'
const PINK = '#E91E63'
const TEAL = '#007C91'
const SLATE = '#4a5a6e'

const bodyStyle = { color: '#21364a', fontSize: 'clamp(1rem, 1.4vw, 1.0625rem)', lineHeight: 1.75, marginBottom: 20 }
const quoteStyle = { color: NAVY, fontSize: 'clamp(1.05rem, 1.7vw, 1.22rem)', lineHeight: 1.6, marginBottom: 14 }
const aboutStyle = { color: SLATE, fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 14 }
const sectionLabel = { color: PINK, fontSize: 13, letterSpacing: '0.24em', marginTop: 'clamp(36px, 4vw, 52px)', marginBottom: 14 }

// Body paragraphs after the dateline lead, verbatim from the release.
const BODY = [
  `The announcement represents a defining moment in Soccerex's continued evolution from a traditional event business into a year-round global platform focused on driving strategic connectivity, commercial growth, measurable business outcomes and long-term impact across the football ecosystem.`,
  `As football's influence across North America accelerates ahead of a transformative era for the sport in the region, Soccerex Miami 2026 will convene senior executives, investors, clubs, leagues, federations, brands, media groups, technology companies, rights holders and commercial stakeholders from across the international game in one of the world's fastest-growing football markets.`,
  `The multi-day gathering will feature industry-leading conferences, curated networking, strategic business meetings and high-level programming designed to facilitate meaningful partnerships, drive measurable outcomes and accelerate opportunities across the global football landscape.`,
  `Central to the event will be Soccerex's expanding Deal Network platform, a curated business ecosystem designed to connect decision-makers, investors, rights holders and strategic partners in more targeted and outcome-driven ways throughout the year. The platform reflects Soccerex's broader vision of transforming industry connections into measurable commercial opportunities, strategic relationships and long-term industry growth.`,
  `The event will also feature continued expansion of HerSoccerex, Soccerex's dedicated women's football initiative focused on accelerating investment, visibility, leadership opportunities and commercial growth across the women's game globally.`,
  `In addition to its business focus, Soccerex Miami 2026 will place significant emphasis on community engagement and impact initiatives designed to harness the power of football to create opportunity, inspire future generations and leave a meaningful legacy throughout the communities the sport touches.`,
]

const POST_QUOTE = [
  `Located within the transformative Miami Freedom Park, Nu Stadium represents the premier football and entertainment destinations in the Americas and provides a world-class backdrop for Soccerex's expanding international platform.`,
  `Soccerex Miami 2026 is expected to serve as a major convening point for conversations surrounding investment, infrastructure, sponsorship, media, fan engagement, technology, innovation, women's football and the continued globalization of the sport.`,
  `Additional announcements regarding speakers, strategic partners, community initiatives and industry activations will be released in the coming months.`,
]

const ABOUT_SOCCEREX = [
  `Founded in 1996, Soccerex is the leading global football business platform, connecting clubs, leagues, federations, brands, investors, media companies, technology providers, rights holders and senior decision-makers from across the international football ecosystem. For nearly three decades, Soccerex has served as a central meeting point for the global game, facilitating the relationships, strategic partnerships and high-level conversations that help shape the future of football.`,
  `Today, Soccerex is evolving beyond traditional events into a year-round platform designed to drive meaningful business outcomes, industry connectivity and long-term value creation across the sport. Through global events, curated executive experiences, Deal Network, HerSoccerex and strategic partnership initiatives, Soccerex brings together capital, commerce, innovation, media, technology and leadership to create measurable impact across both the football industry and the communities the game reaches worldwide.`,
]

export default function MiamiPressRelease() {
  useEffect(() => {
    window.scrollTo(0, 0)
    const prev = document.title
    document.title = 'Press Release: Soccerex Miami 2026 at Nu Stadium | Soccerex'
    return () => { document.title = prev }
  }, [])

  return (
    <div className="event-page theme-miami" style={{ background: '#FFF8F4', color: NAVY }}>

      {/* ─── Navy masthead (mirrors the official release header) ─────────── */}
      <section style={{ background: NAVY, position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 920, margin: '0 auto', padding: 'clamp(110px,12vw,150px) clamp(24px,5vw,64px) clamp(40px,5vw,58px)' }}>
          <Link
            to={MIAMI_2026}
            className="inline-flex items-center gap-2 font-mono"
            style={{ color: '#fff', opacity: 0.6, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none', marginBottom: 30 }}
          >
            <ArrowLeft size={14} /> Soccerex Miami 2026
          </Link>
          <img
            src="/logos/soccerex---logo-landscape-white.svg"
            alt="Soccerex"
            style={{ height: 'clamp(32px,4.5vw,44px)', width: 'auto', display: 'block' }}
          />
        </div>
        {/* Teal → aqua → pink signature rule */}
        <div style={{ height: 4, background: 'linear-gradient(90deg, #007C91 0%, #00C6D7 35%, #E91E63 100%)' }} />
      </section>

      {/* ─── Article ─────────────────────────────────────────────────────── */}
      <article style={{ maxWidth: 820, margin: '0 auto', padding: 'clamp(40px,5vw,64px) clamp(24px,5vw,64px) clamp(72px,8vw,112px)' }}>

        <p className="miami-subhead" style={{ color: PINK, fontSize: 13, letterSpacing: '0.3em', marginBottom: 18 }}>PRESS RELEASE</p>

        <h1 className="miami-headline" style={{ color: NAVY, textTransform: 'none', fontSize: 'clamp(1.9rem, 4vw, 3rem)', lineHeight: 1.08, marginBottom: 18 }}>
          Soccerex Brings the Global Football Industry to Miami&rsquo;s Nu Stadium in Landmark 2026 Announcement
        </h1>

        <p className="miami-body" style={{ color: TEAL, fontStyle: 'italic', fontSize: 'clamp(1.05rem,1.7vw,1.28rem)', lineHeight: 1.5, marginBottom: 28 }}>
          The world&rsquo;s leading football business platform selects Nu Stadium as the home of its flagship global gathering.
        </p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3" style={{ marginBottom: 28 }}>
          <span className="miami-subhead" style={{ fontSize: 12, letterSpacing: '0.2em', color: NAVY }}>MAY 29, 2026</span>
          <span style={{ width: 6, height: 6, background: PINK }} />
          <span className="miami-subhead" style={{ fontSize: 12, letterSpacing: '0.2em', color: TEAL }}>MIAMI, USA</span>
        </div>

        <a href={PDF_URL} download className="miami-pill-primary">
          <Download size={16} /> Download the full release (PDF)
        </a>

        <div style={{ height: 1, background: 'rgba(13,27,42,0.12)', margin: 'clamp(30px,4vw,44px) 0' }} />

        {/* Dateline lead */}
        <p className="miami-body" style={bodyStyle}>
          <strong style={{ color: NAVY }}>MIAMI, May 29, 2026.</strong> Soccerex, the leading global football business platform connecting the worldwide football industry through events, strategic relationships and year-round business opportunities, today announced that its flagship global gathering will take place September 23-25, 2026 at Nu Stadium within the Miami Freedom Park site in Miami, Florida.
        </p>

        {BODY.map((t, i) => (
          <p key={i} className="miami-body" style={bodyStyle}>{t}</p>
        ))}

        {/* Pull quote */}
        <blockquote style={{ borderLeft: `4px solid ${PINK}`, paddingLeft: 'clamp(20px,3vw,28px)', margin: 'clamp(32px,4vw,46px) 0' }}>
          <p className="miami-body" style={{ ...quoteStyle, fontWeight: 600 }}>
            &ldquo;Miami has become one of the most important crossroads in global football,&rdquo; said Garrett Navia.
          </p>
          <p className="miami-body" style={quoteStyle}>
            &ldquo;The city sits at the intersection of the Americas, international business, culture, investment and the future growth of the sport itself. Bringing Soccerex to Nu Stadium is not just about hosting another event, it is about establishing a long-term home for the global football industry in one of the most dynamic football markets anywhere in the world.
          </p>
          <p className="miami-body" style={quoteStyle}>
            For nearly 30 years, Soccerex has connected the global game. What we are building now is much bigger, a year-round platform designed to create business opportunities, strategic relationships and measurable outcomes across football while also using the reach and influence of the sport to create meaningful impact and lasting legacy within the communities it touches.&rdquo;
          </p>
          <p className="miami-subhead" style={{ color: NAVY, fontSize: 13, letterSpacing: '0.14em', marginTop: 16 }}>
            Garrett Navia, <span style={{ color: SLATE }}>Managing Director, Soccerex</span>
          </p>
        </blockquote>

        {POST_QUOTE.map((t, i) => (
          <p key={i} className="miami-body" style={bodyStyle}>{t}</p>
        ))}

        {/* About Soccerex */}
        <h2 className="miami-subhead" style={sectionLabel}>About Soccerex</h2>
        {ABOUT_SOCCEREX.map((t, i) => (
          <p key={i} className="miami-body" style={aboutStyle}>{t}</p>
        ))}

        {/* About Nu Stadium */}
        <h2 className="miami-subhead" style={sectionLabel}>About Nu Stadium</h2>
        <p className="miami-body" style={aboutStyle}>
          Nu Stadium is South Florida&rsquo;s newest world-class venue for year-round sports and entertainment, serving as the home of reigning MLS champions Inter Miami CF. Inaugurated on April 4, 2026, in front of a packed house, the 26,700-seat state-of-the-art stadium located in the heart of Miami is designed to host a wide range of premium events, including international f&uacute;tbol matches, concerts, and corporate and private gatherings. Built to provide the best fan experience, Nu Stadium features a unified seating bowl enhancing crowd energy, the largest Team Store in MLS, and iconic grand staircases that open into a 360-degree open-air concourse with panoramic views of downtown Miami and Miami Freedom Park, the largest active real estate development in Miami, set to include the largest new public park in the City of Miami in generations, the Jorge Mas Canosa Park, alongside retail, dining, entertainment, youth fields, and more. Located adjacent to Miami International Airport and steps from the Miami Intermodal Center, Nu Stadium offers unmatched accessibility for fans and visitors alike. For more information, please visit{' '}
          <a href="https://www.nustadium.com" target="_blank" rel="noopener noreferrer" style={{ color: PINK, textDecoration: 'underline' }}>www.nustadium.com</a>.
        </p>

        {/* Media contact */}
        <div style={{ marginTop: 'clamp(36px,4vw,48px)', paddingTop: 22, borderTop: '1px solid rgba(13,27,42,0.12)' }}>
          <p className="miami-body" style={{ fontSize: 14, color: SLATE, marginBottom: 4 }}>
            <strong style={{ color: NAVY }}>Media contact:</strong>{' '}
            <a href="mailto:enquiries@soccerex.com" style={{ color: PINK }}>enquiries@soccerex.com</a>
          </p>
          <p className="miami-body" style={{ fontSize: 14, color: SLATE }}>Soccerex &middot; soccerex.com &middot; Founded 1996</p>
        </div>

        {/* Bottom actions */}
        <div className="flex flex-wrap items-center gap-3" style={{ marginTop: 'clamp(34px,4vw,46px)' }}>
          <a href={PDF_URL} download className="miami-pill-primary">
            <Download size={16} /> Download PDF
          </a>
          <Link to={MIAMI_2026} className="miami-pill-outline">
            <ArrowLeft size={15} /> Back to Soccerex Miami 2026
          </Link>
        </div>
      </article>
    </div>
  )
}
