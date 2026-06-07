import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { Lock, Mail, ArrowRight, CheckCircle2, ChevronDown, Check } from 'lucide-react'
import {
  pricingAccessStart, pricingAccessVerify, pricingPackages, pricingPreview, pricingCategories,
} from '../lib/soccerexApi'
import { MIAMI_2026_PRICING } from '../lib/routes'

const NAVY = '#09203e'
const NAVY_DEEP = '#050d1a'
const EMAIL_KEY = 'sx_pricing_email'
const grantKey = (category) => `sx_pricing_grant_${category || 'all'}`

function ls(key) { try { return window.localStorage.getItem(key) } catch { return null } }
function lsSet(key, v) { try { window.localStorage.setItem(key, v) } catch { /* ignore */ } }
function lsDel(key) { try { window.localStorage.removeItem(key) } catch { /* ignore */ } }
function titleCase(s) { return (s || '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) }

export default function MiamiPricing() {
  const { category } = useParams()
  const [params, setParams] = useSearchParams()
  const [phase, setPhase] = useState('loading') // loading | gate | sent | unlocked
  const [packages, setPackages] = useState([])
  const [meta, setMeta] = useState({ label: titleCase(category), blurb: '' })
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [showTeam, setShowTeam] = useState(false)
  const [passcode, setPasscode] = useState('')

  const showPackages = useCallback((list) => {
    setPackages(Array.isArray(list) ? list : [])
    setPhase('unlocked')
  }, [])

  useEffect(() => { window.scrollTo(0, 0) }, [])

  // Pull the category label/blurb from the backend (config-driven; the front
  // hardcodes nothing about categories). Display-only, so it never blocks unlock.
  useEffect(() => {
    let alive = true
    pricingCategories()
      .then((res) => {
        if (!alive) return
        const found = (res?.categories || []).find((c) => c.key === category)
        if (found) setMeta({ label: found.label, blurb: found.blurb })
      })
      .catch(() => { /* fall back to the title-cased slug */ })
    return () => { alive = false }
  }, [category])

  // Resolve access exactly once: token in URL > stored grant (this category) > gate.
  // Single-use token, so the flow must not run twice (StrictMode / double-fire).
  const resolvedRef = useRef(false)
  useEffect(() => {
    if (resolvedRef.current) return
    resolvedRef.current = true
    const token = params.get('token')
    async function run() {
      if (token) {
        try {
          const res = await pricingAccessVerify(token)
          if (res?.grant) lsSet(grantKey(res?.category || category), res.grant)
          params.delete('token'); setParams(params, { replace: true })
          showPackages(res?.packages || [])
        } catch {
          setError('That access link is invalid or has expired. Enter your email to get a new one.')
          setPhase('gate')
        }
        return
      }
      const grant = ls(grantKey(category))
      if (grant) {
        try {
          const res = await pricingPackages(grant, { category })
          showPackages(res?.packages || [])
          return
        } catch {
          lsDel(grantKey(category))
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
      await pricingAccessStart(email.trim(), { category })
      setPhase('sent')
    } catch (err) {
      setError(err?.message || 'Could not send your access link. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function handlePreview(e) {
    e.preventDefault()
    if (!email.trim() || !passcode.trim()) return
    setBusy(true); setError('')
    try {
      const res = await pricingPreview(email.trim(), passcode.trim(), category)
      lsSet(EMAIL_KEY, email.trim())
      if (res?.grant) lsSet(grantKey(res?.category || category), res.grant)
      showPackages(res?.packages || [])
    } catch (err) {
      setError(err?.status === 403 ? 'That email or access code is not recognised.' : (err?.message || 'Could not verify. Please try again.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <main style={{ background: NAVY_DEEP, minHeight: '100vh' }}>
      <section style={{ background: `radial-gradient(ellipse at top, #0d2b52 0%, ${NAVY_DEEP} 70%)`, padding: 'clamp(100px,11vw,150px) clamp(24px,5vw,80px) clamp(40px,5vw,70px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <Link to={MIAMI_2026_PRICING} className="font-body uppercase" style={{ color: 'var(--color-brand-accent)', fontWeight: 600, letterSpacing: '0.18em', fontSize: '0.72rem', marginBottom: 14, display: 'inline-block', textDecoration: 'none' }}>SOCCEREX MIAMI 2026</Link>
          <h1 className="font-heading font-bold" style={{ fontSize: 'clamp(2rem,4.5vw,3.4rem)', color: '#fff', lineHeight: 1.1, marginBottom: 18 }}>
            {meta.label}
          </h1>
          <p className="font-body mx-auto" style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)', maxWidth: 640, lineHeight: 1.6 }}>
            {meta.blurb || 'September 23 to 25, 2026 at Nu Stadium, Miami.'}
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
              <h2 className="font-heading font-bold text-center" style={{ fontSize: '1.4rem', color: NAVY, marginBottom: 8 }}>Unlock {meta.label}</h2>
              <p className="font-body text-center" style={{ fontSize: '0.95rem', color: '#586778', marginBottom: 22, lineHeight: 1.55 }}>
                Enter your email and we will send a secure link to view the pricing.
              </p>
              {error && <p className="font-body" style={{ color: '#b3261e', fontSize: '0.85rem', marginBottom: 14 }}>{error}</p>}

              {!showTeam ? (
                <form onSubmit={handleStart} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input type="email" required placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)} className="font-body" style={inputStyle} />
                  <input type="text" placeholder="Your name (optional)" value={name} onChange={(e) => setName(e.target.value)} className="font-body" style={inputStyle} />
                  <input type="text" placeholder="Company (optional)" value={company} onChange={(e) => setCompany(e.target.value)} className="font-body" style={inputStyle} />
                  <button type="submit" disabled={busy} className="font-body font-semibold uppercase" style={primaryBtn(busy)}>
                    {busy ? 'Sending…' : <>Email me the pricing <ArrowRight size={15} /></>}
                  </button>
                </form>
              ) : (
                <form onSubmit={handlePreview} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input type="email" required placeholder="Soccerex email" value={email} onChange={(e) => setEmail(e.target.value)} className="font-body" style={inputStyle} />
                  <input type="password" required placeholder="Access code" value={passcode} onChange={(e) => setPasscode(e.target.value)} className="font-body" style={inputStyle} />
                  <button type="submit" disabled={busy} className="font-body font-semibold uppercase" style={primaryBtn(busy)}>
                    {busy ? 'Checking…' : <>Preview pricing <ArrowRight size={15} /></>}
                  </button>
                </form>
              )}

              <button type="button" onClick={() => { setShowTeam((v) => !v); setError('') }} className="font-body"
                style={{ marginTop: 16, background: 'none', border: 'none', color: '#7a8694', fontSize: '0.8rem', cursor: 'pointer', width: '100%', textAlign: 'center' }}>
                {showTeam ? '← Back to email access' : 'Soccerex team? Preview with an access code'}
              </button>
            </div>
          )}

          {phase === 'sent' && (
            <div style={{ maxWidth: 460, margin: '0 auto', background: '#fff', borderRadius: 16, padding: 'clamp(28px,4vw,40px)', textAlign: 'center', boxShadow: '0 20px 50px rgba(9,32,62,0.12)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <Mail size={40} color={NAVY} />
              </div>
              <h2 className="font-heading font-bold" style={{ fontSize: '1.4rem', color: NAVY, marginBottom: 8 }}>Check your inbox</h2>
              <p className="font-body" style={{ fontSize: '0.95rem', color: '#586778', lineHeight: 1.6 }}>
                We sent an access link to <strong>{email}</strong>. Click it to view the {meta.label}. The link expires in 30 minutes.
              </p>
            </div>
          )}

          {phase === 'unlocked' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(28px,4vw,44px)' }}>
              <div className="font-body" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#1f7a4d', fontSize: '0.85rem', fontWeight: 600 }}>
                <CheckCircle2 size={16} /> Pricing unlocked
              </div>
              {packages.length === 0
                ? <p className="font-body text-center" style={{ color: '#586778' }}>Pricing is being finalised. Please check back shortly.</p>
                : <PackageGrid items={packages} />}
              <Link to={MIAMI_2026_PRICING} className="font-body" style={{ color: '#7a8694', fontSize: '0.85rem', textDecoration: 'none' }}>← See all package types</Link>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

function PackageGrid({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
      {items.map((p) => <PackageCard key={p.slug} p={p} />)}
    </div>
  )
}

function PackageCard({ p }) {
  const [open, setOpen] = useState(false)
  const benefits = Array.isArray(p.benefits) ? p.benefits : []
  const count = benefits.length || p.benefit_count || 0
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '22px 20px', boxShadow: '0 8px 24px rgba(9,32,62,0.08)', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p className="font-heading font-bold" style={{ fontSize: '1.05rem', color: NAVY, lineHeight: 1.25 }}>{p.name}</p>
      {p.summary && (
        <p className="font-body" style={{ fontSize: '0.9rem', color: '#3f5066', lineHeight: 1.5 }}>{p.summary}</p>
      )}
      <p className="font-heading font-bold" style={{ fontSize: '1.5rem', color: 'var(--color-brand-accent)', marginTop: 2 }}>{p.price_display || 'Contact for pricing'}</p>

      {count > 0 && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="font-body"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 4, padding: '8px 0', background: 'none', border: 'none', borderTop: '1px solid #eef1f5', cursor: 'pointer', color: NAVY, fontSize: '0.82rem', fontWeight: 600 }}
        >
          <span>{open ? "What's included" : `What's included (${count})`}</span>
          <ChevronDown size={16} style={{ transition: 'transform 150ms ease', transform: open ? 'rotate(180deg)' : 'none' }} />
        </button>
      )}

      {open && benefits.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {p.body && (
            <p className="font-body" style={{ fontSize: '0.82rem', color: '#586778', lineHeight: 1.55 }}>{p.body}</p>
          )}
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', padding: 0, margin: 0 }}>
            {benefits.map((b, i) => (
              <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <Check size={15} color="#1f7a4d" style={{ flexShrink: 0, marginTop: 2 }} />
                <span className="font-body" style={{ fontSize: '0.82rem', color: '#3f5066', lineHeight: 1.45 }}>
                  <span style={{ fontWeight: 600, color: NAVY }}>
                    {b.label}{b.quantity > 1 ? ` ×${b.quantity}` : ''}
                  </span>
                  {b.note ? <span style={{ color: '#7a8694' }}>{`: ${b.note}`}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const inputStyle = {
  border: '1px solid #d7dde8', borderRadius: 10, padding: '12px 14px', fontSize: '0.95rem',
  color: '#1f2937', background: '#fff', outline: 'none',
}
function primaryBtn(busy) {
  return { background: NAVY, color: '#fff', padding: '14px 24px', borderRadius: 10, letterSpacing: '0.1em', fontSize: '0.8rem', border: 'none', cursor: 'pointer', opacity: busy ? 0.6 : 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }
}
