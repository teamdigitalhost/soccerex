import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import HerSoccerexDocument from './HerSoccerexDocument'
import { HERSOCCEREX } from '../lib/routes'
import { HER, HER_SERIF, HER_ASSETS, herPill } from '../lib/hersoccerexTheme'

/* HerSoccerex on the home page, in its own look, with the founding document
   beside it to download or pass on. */
export default function HerSoccerexHomeSection() {
  return (
    <section className="relative overflow-hidden" style={{ background: HER.paper, borderTop: `1px solid ${HER.line}`, padding: 'clamp(88px, 10vw, 140px) clamp(20px, 5vw, 80px)', color: HER.body }}>
      <img
        src={`${HER_ASSETS}/floral-top-left.webp`} alt="" aria-hidden loading="lazy"
        style={{ position: 'absolute', top: 0, left: 0, width: 'clamp(90px, 13vw, 190px)', height: 'auto', pointerEvents: 'none' }}
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center" style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div>
          <img
            src={`${HER_ASSETS}/hersoccerex-wellness-universe.webp`}
            alt="HerSoccerex, in collaboration with Wellness Universe Corporate"
            width={800} height={413} loading="lazy"
            style={{ width: 'min(280px, 70vw)', height: 'auto', display: 'block' }}
          />
          <h2 style={{ fontFamily: HER_SERIF, fontWeight: 500, color: HER.ink, fontSize: 'clamp(2.1rem, 4vw, 3.1rem)', lineHeight: 1.1, marginTop: 32 }}>
            A community for women across the business of soccer
          </h2>
          <p style={{ fontSize: 'clamp(1.02rem, 1.35vw, 1.12rem)', lineHeight: 1.7, marginTop: 18, maxWidth: 580 }}>
            <span style={{ color: HER.pink }}>Her</span>Soccerex brings together women who influence the game, women building their careers in it, and the allies who can open doors for both. It begins with a Founding Table of 40 women, and it turns those relationships into introductions, careers and business.
          </p>
          <figure style={{ margin: '28px 0 0', borderLeft: `3px solid ${HER.pink}`, paddingLeft: 20, maxWidth: 560 }}>
            <blockquote style={{ fontFamily: HER_SERIF, fontStyle: 'italic', fontSize: 'clamp(1.3rem, 2vw, 1.55rem)', lineHeight: 1.4, color: HER.navy }}>
              &ldquo;What could we accomplish together that we couldn&rsquo;t accomplish alone?&rdquo;
            </blockquote>
            <figcaption style={{ marginTop: 8, fontSize: '0.9rem', color: HER.gold, fontWeight: 600 }}>Our founding question</figcaption>
          </figure>
          <div className="flex flex-wrap gap-3" style={{ marginTop: 32 }}>
            <Link to={HERSOCCEREX} style={herPill(true)}>Explore HerSoccerex <ArrowRight size={16} /></Link>
            <Link to={`${HERSOCCEREX}#join`} style={herPill(false)}>Join the community</Link>
          </div>
        </div>

        <HerSoccerexDocument />
      </div>
    </section>
  )
}
