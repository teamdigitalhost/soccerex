import { useEffect, useRef, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react'
import { pricingAccessStart, pricingAccessVerify, pricingPackages } from '../lib/soccerexApi'

const NAVY = '#09203e'
const NAVY_DEEP = '#050d1a'
const EVENT_SLUG = 'soccerex-miami-2026'
const RETURN_PATH = '/miami-2026/pricing'
const GRANT_KEY = 'sx_pricing_grant'
const EMAIL_KEY = 'sx_pricing_email'

function ls(key) { try { return window.localStorage.getItem(key) } catch { return null } }
function lsSet(key, v) { try { window.localStorage.setItem(key, v) } catch { /* ignore */ } }
function lsDel(key) { try { window.localStorage.removeItem(key) } catch { /* ignore */ } }

export default function MiamiPricing() {
  const [params, setParams] = useSearchParams()
  const [phase, setPhase] = useState('loading') // loading | gate | sent | unlocked
  const [packages, setPackages] = useState([])
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const showPackages = useCallback((list) => {
    setPackages(Array.isArray(list) ? list : [])
    setPhase('unlocked')
  }, [])

  useEffect(() => { window.scrollTo(0, 0) }, [])

  // Resolve access exactly once: token in URL > stored grant > gate.
  // The magic-link token is single-use, so this flow must not run twice. React
  // StrictMode double-invokes effects in dev, and any double-fire (a quick
  // refresh while in flight, a double-click) would consume the token on the
  // first call and 404 the second. The ref guard makes it strictly one-shot.
  const resolvedRef = useRef(false)
  useEffect(() => {
    if (resolvedRef.current) return
    resolvedRef.current = true
    const token = params.get('token')
    async function run() {
      if (token) {
        try {
          const res = await pricingAccessVerify(token)
          if (res?.grant) lsSet(GRANT_KEY, res.grant)
          // strip the token from the URL so a refresh doesn't re-verify
          params.delete('token'); setParams(params, { replace: true })
          showPackages(res?.packages || [])
        } catch {
          setError('That access link is invalid or has expired. Enter your email to get a new one.')
          setPhase('gate')
        }
        return
      }
      const grant = ls(GRANT_KEY)
      if (grant) {
        try {
          const res = await pricingPackages(grant, { eventSlug: EVENT_SLUG })
          showPackages(res?.packages || [])
          return
        } catch {
          lsDel(GRANT_KEY)
        }
      }
      setPhase('gate')
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleStart(e) {
    e.preventDefault()
    if (!email.trim()) return
    setBusy(true); setError('')
    try {
      lsSet(EMAIL_KEY, email.trim())
      await pricingAccessStart(email.trim(), { eventSlug: EVENT_SLUG, returnPath: RETURN_PATH })
      setPhase('sent')
    } catch (err) {
      setError(err?.message || 'Could not send your access link. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const sponsor = packages.filter((p) => p.package_type === 'sponsorship')
  const exhibitor = packages.filter((p) => p.package_type === 'exhibitor')

  return (
    <main style={{ background: NAVY_DEEP, minHeight: '100vh' }}>
      <section style={{ background: `radial-gradient(ellipse at top, #0d2b52 0%, ${NAVY_DEEP} 70%)`, padding: 'clamp(100px,11vw,150px) clamp(24px,5vw,80px) clamp(40px,5vw,70px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <p className="font-body uppercase" style={{ color: 'var(--color-brand-accent)', fontWeight: 600, letterSpacing: '0.18em', fontSize: '0.72rem', marginBottom: 14 }}>SOCCEREX MIAMI 2026</p>
          <h1 className="font-heading font-bold" style={{ fontSize: 'clamp(2rem,4.5vw,3.4rem)', color: '#fff', lineHeight: 1.1, marginBottom: 18 }}>
            Partnership & Exhibition <span style={{ color: 'var(--color-brand-accent)' }}>Packages</span>
          </h1>
          <p className="font-body mx-auto" style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)', maxWidth: 640, lineHeight: 1.6 }}>
            September 23 to 25, 2026 at Nu Stadium, Miami. Sponsorship and exhibition opportunities at the center of the post-World Cup business of football.
          </p>
        </div>
      </section>

      <section style={{ background: '#f4f3f0', padding: 'clamp(40px,6vw,80px) clamp(24px,5vw,80px) clamp(70px,9vw,120px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {phase === 'loading' && (
            <p className="font-body text-center" style={{ color: '#586778' }}>Loading…</p>
          )}

          {phase === 'gate' && (
            <div style={{ maxWidth: 460, margin: '0 auto', background: '#fff', borderRadius: 16, padding: 'clamp(28px,4vw,40px)', boxShadow: '0 20px 50px rgba(9,32,62,0.12)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(9,32,62,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lock size={22} color={NAVY} />
                </div>
              </div>
              <h2 className="font-heading font-bold text-center" style={{ fontSize: '1.4rem', color: NAVY, marginBottom: 8 }}>Unlock Miami 2026 pricing</h2>
              <p className="font-body text-center" style={{ fontSize: '0.95rem', color: '#586778', marginBottom: 22, lineHeight: 1.55 }}>
                Enter your email and we will send a secure link to view the full package pricing.
              </p>
              {error && <p className="font-body" style={{ color: '#b3261e', fontSize: '0.85rem', marginBottom: 14 }}>{error}</p>}
              <form onSubmit={handleStart} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input type="email" required placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="font-body" style={inputStyle} />
                <input type="text" placeholder="Your name (optional)" value={name} onChange={(e) => setName(e.target.value)}
                  className="font-body" style={inputStyle} />
                <input type="text" placeholder="Company (optional)" value={company} onChange={(e) => setCompany(e.target.value)}
                  className="font-body" style={inputStyle} />
                <button type="submit" disabled={busy} className="font-body font-semibold uppercase"
                  style={{ background: NAVY, color: '#fff', padding: '14px 24px', borderRadius: 10, letterSpacing: '0.1em', fontSize: '0.8rem', border: 'none', cursor: 'pointer', opacity: busy ? 0.6 : 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {busy ? 'Sending…' : <>Email me the pricing <ArrowRight size={15} /></>}
                </button>
              </form>
            </div>
          )}

          {phase === 'sent' && (
            <div style={{ maxWidth: 460, margin: '0 auto', background: '#fff', borderRadius: 16, padding: 'clamp(28px,4vw,40px)', textAlign: 'center', boxShadow: '0 20px 50px rgba(9,32,62,0.12)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <Mail size={40} color={NAVY} />
              </div>
              <h2 className="font-heading font-bold" style={{ fontSize: '1.4rem', color: NAVY, marginBottom: 8 }}>Check your inbox</h2>
              <p className="font-body" style={{ fontSize: '0.95rem', color: '#586778', lineHeight: 1.6 }}>
                We sent an access link to <strong>{email}</strong>. Click it to view the Miami 2026 pricing. The link expires in 30 minutes.
              </p>
            </div>
          )}

          {phase === 'unlocked' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(40px,5vw,64px)' }}>
              <div className="font-body" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#1f7a4d', fontSize: '0.85rem', fontWeight: 600 }}>
                <CheckCircle2 size={16} /> Pricing unlocked
              </div>
              <PackageGroup title="Sponsorship Opportunities" items={sponsor} />
              <PackageGroup title="Exhibitor Packages" items={exhibitor} />
              {sponsor.length === 0 && exhibitor.length === 0 && (
                <p className="font-body text-center" style={{ color: '#586778' }}>Pricing is being finalised. Please check back shortly.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

function PackageGroup({ title, items }) {
  if (!items || items.length === 0) return null
  return (
    <div>
      <h2 className="font-heading font-bold" style={{ fontSize: 'clamp(1.4rem,2.6vw,2rem)', color: NAVY, marginBottom: 4 }}>{title}</h2>
      <div style={{ width: 60, height: 3, background: 'var(--color-brand-accent)', marginBottom: 24 }} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((p) => (
          <div key={p.slug} style={{ background: '#fff', borderRadius: 12, padding: '22px 20px', boxShadow: '0 8px 24px rgba(9,32,62,0.08)', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <p className="font-heading font-bold" style={{ fontSize: '1.05rem', color: NAVY, lineHeight: 1.25 }}>{p.name}</p>
            {p.subtitle && <p className="font-body" style={{ fontSize: '0.82rem', color: '#7a8694' }}>{p.subtitle}</p>}
            <p className="font-heading font-bold" style={{ fontSize: '1.5rem', color: 'var(--color-brand-accent)', marginTop: 6 }}>{p.price_display || 'Contact for pricing'}</p>
            {typeof p.benefit_count === 'number' && p.benefit_count > 0 && (
              <p className="font-body" style={{ fontSize: '0.78rem', color: '#7a8694' }}>{p.benefit_count} inclusions</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const inputStyle = {
  border: '1px solid #d7dde8', borderRadius: 10, padding: '12px 14px', fontSize: '0.95rem',
  color: '#1f2937', background: '#fff', outline: 'none',
}
