import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { pricingCategories } from '../lib/soccerexApi'
import { miamiPricingCategory } from '../lib/routes'

const NAVY_DEEP = '#050d1a'
const NAVY = '#09203e'
// Delegate prices live on Eventify (Joel, 2026-08-03): we link, we do not host.
const EVENTIFY_TICKETS = 'https://soccerexmiami2026.eventify.io/t2/tickets/'

/**
 * Public chooser for the Miami 2026 pricing. Lists the gated categories
 * (Partnership / Exhibition) straight from the backend config and routes the
 * visitor to that category's gated page. The category page-view beacon records
 * which one they picked, so interest is tracked before they even unlock.
 * Delegate passes are a static third tile straight to Eventify, rendered even
 * when the category fetch fails so the page is never a dead end.
 */
export default function PricingChooser() {
  const [categories, setCategories] = useState([])
  const [state, setState] = useState('loading') // loading | ready | error

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    let alive = true
    pricingCategories()
      .then((res) => {
        if (!alive) return
        setCategories(Array.isArray(res?.categories) ? res.categories : [])
        setState('ready')
      })
      .catch(() => { if (alive) setState('error') })
    return () => { alive = false }
  }, [])

  return (
    <main style={{ background: NAVY_DEEP, minHeight: '100vh' }}>
      <section style={{ background: `radial-gradient(ellipse at top, #0d2b52 0%, ${NAVY_DEEP} 70%)`, padding: 'clamp(100px,11vw,150px) clamp(24px,5vw,80px) clamp(40px,5vw,70px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <p className="font-body uppercase" style={{ color: 'var(--color-brand-accent)', fontWeight: 600, letterSpacing: '0.18em', fontSize: '0.72rem', marginBottom: 14 }}>SOCCEREX MIAMI 2026</p>
          <h1 className="font-heading font-bold" style={{ fontSize: 'clamp(2rem,4.5vw,3.4rem)', color: '#fff', lineHeight: 1.1, marginBottom: 18 }}>
            Packages & <span style={{ color: 'var(--color-brand-accent)' }}>Passes</span>
          </h1>
          <p className="font-body mx-auto" style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)', maxWidth: 640, lineHeight: 1.6 }}>
            September 23 to 25, 2026 at Nu Stadium, Miami. Choose what you are exploring and we will share the relevant pricing.
          </p>
        </div>
      </section>

      <section style={{ background: '#f4f3f0', padding: 'clamp(40px,6vw,80px) clamp(24px,5vw,80px) clamp(70px,9vw,120px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {state === 'loading' && (
            <p className="font-body text-center" style={{ color: '#586778' }}>Loading…</p>
          )}
          {state === 'error' && (
            <p className="font-body text-center" style={{ color: '#b3261e', marginBottom: 28 }}>We could not load the package options right now. Delegate passes are always available below.</p>
          )}
          {state !== 'loading' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {categories.map((c) => (
                <Link key={c.key} to={miamiPricingCategory(c.key)} className="group"
                  style={{ display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 16, padding: 'clamp(28px,4vw,40px)', boxShadow: '0 16px 44px rgba(9,32,62,0.10)', textDecoration: 'none', minHeight: 220 }}>
                  <h2 className="font-heading font-bold" style={{ fontSize: '1.5rem', color: NAVY, marginBottom: 4 }}>{c.label}</h2>
                  <div style={{ width: 56, height: 3, background: 'var(--color-brand-accent)', marginBottom: 18 }} />
                  <p className="font-body" style={{ fontSize: '0.98rem', color: '#586778', lineHeight: 1.6, flex: 1 }}>{c.blurb}</p>
                  <span className="font-body font-semibold uppercase" style={{ marginTop: 22, display: 'inline-flex', alignItems: 'center', gap: 8, color: NAVY, letterSpacing: '0.08em', fontSize: '0.8rem' }}>
                    View packages <ArrowRight size={15} />
                  </span>
                </Link>
              ))}
              <a key="delegate" href={EVENTIFY_TICKETS} target="_blank" rel="noopener" className="group"
                style={{ display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 16, padding: 'clamp(28px,4vw,40px)', boxShadow: '0 16px 44px rgba(9,32,62,0.10)', textDecoration: 'none', minHeight: 220 }}>
                <h2 className="font-heading font-bold" style={{ fontSize: '1.5rem', color: NAVY, marginBottom: 4 }}>Delegate Passes</h2>
                <div style={{ width: 56, height: 3, background: 'var(--color-brand-accent)', marginBottom: 18 }} />
                <p className="font-body" style={{ fontSize: '0.98rem', color: '#586778', lineHeight: 1.6, flex: 1 }}>Access to all three days of Soccerex Miami. Live pricing and instant checkout on Eventify.</p>
                <span className="font-body font-semibold uppercase" style={{ marginTop: 22, display: 'inline-flex', alignItems: 'center', gap: 8, color: NAVY, letterSpacing: '0.08em', fontSize: '0.8rem' }}>
                  See prices on Eventify <ArrowRight size={15} />
                </span>
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
