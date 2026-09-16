import LogoMarquee from './LogoMarquee'
import { NETWORK_LOGOS, shuffleLogos } from '../data/networkLogos'

/*
 * Four rows of organization logos, scrolling in opposite directions, drawn from
 * the same inventory as the Global Network page. Miami's own sponsors and
 * exhibitors slot in through the `featured` list as their artwork arrives, and
 * they lead the first row so they read first.
 */

const ROWS = 4

export default function BrandWall({
  featured = [],
  heading,
  intro,
  background = '#FAFBFC',
}) {
  const featuredSrcs = new Set(featured.map((l) => l.src))
  const pool = NETWORK_LOGOS.filter((src) => !featuredSrcs.has(src)).map((src) => ({ src, alt: '' }))
  const size = Math.ceil(pool.length / ROWS)
  const rows = [7, 23, 41, 59].map((seed, i) => {
    const row = shuffleLogos(pool, seed).slice(0, size)
    return i === 0 ? [...featured, ...row] : row
  })

  return (
    <section className="relative overflow-hidden" style={{ background, padding: 'clamp(72px,9vw,120px) 0' }}>
      <div className="text-center" style={{ maxWidth: '900px', margin: '0 auto clamp(40px,5vw,60px)', padding: '0 clamp(24px,5vw,80px)' }}>
        <h2 className="miami-headline" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: '#0D1B2A', textWrap: 'balance' }}>
          {heading}
        </h2>
        {intro && (
          <p className="miami-body mt-5 mx-auto" style={{ fontSize: '1.05rem', color: '#3a4a5a', maxWidth: 720, lineHeight: 1.6 }}>
            {intro}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(18px,2.4vw,30px)' }}>
        {rows.map((row, i) => (
          <LogoMarquee
            key={i}
            logos={row}
            direction={i % 2 === 0 ? 'left' : 'right'}
            speed={[70, 86, 96, 78][i]}
            invert={false}
            height={42}
          />
        ))}
      </div>
    </section>
  )
}
