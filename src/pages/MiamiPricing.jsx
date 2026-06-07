import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { Lock, Mail, ArrowRight, CheckCircle2, Check, X } from 'lucide-react'
import {
  pricingAccessStart, pricingAccessVerify, pricingPackages, pricingPreview, pricingCategories,
  pricingInterest, trackPageView,
} from '../lib/soccerexApi'
import { MIAMI_2026_PRICING } from '../lib/routes'

const NAVY = '#09203e'
const NAVY_DEEP = '#050d1a'
const EMAIL_KEY = 'sx_pricing_email'
const grantKey = (category) => `sx_pricing_grant_${category || 'all'}`
const PRICE_NOTE = 'Rates shown reflect current availability and may rise as the event nears. Securing early locks in the best value.'

function ls(key) { try { return window.localStorage.getItem(key) } catch { return null } }
function lsSet(key, v) { try { window.localStorage.setItem(key, v) } catch { /* ignore */ } }
function lsDel(key) { try { window.localStorage.removeItem(key) } catch { /* ignore */ } }
function titleCase(s) { return (s || '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) }

// Effective price (USD) for the budget filter. Null = unknown (never hidden).
function priceOf(p) {
  const v = p?.price_max ?? p?.price_min
  return typeof v === 'number' ? v : null
}

export default function MiamiPricing() {
  const { category } = useParams()
  const [params, setParams] = useSearchParams()
  const [phase, setPhase] = useState('loading') // loading | gate | sent | unlocked
  const [packages, setPackages] = useState([])
  const [grant, setGrant] = useState(null)
  const [revealMode, setRevealMode] = useState('open') // open | reveal_individual
  const [meta, setMeta] = useState({ label: titleCase(category), blurb: '' })
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [showTeam, setShowTeam] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [budget, setBudget] = useState('')
  const [activePkg, setActivePkg] = useState(null)

  const showPackages = useCallback((list, grantToken) => {
    setPackages(Array.isArray(list) ? list : [])
    setGrant(grantToken || ls(grantKey(category)))
    setPhase('unlocked')
  }, [category])

  useEffect(() => { window.scrollTo(0, 0) }, [])

  // Category label/blurb + reveal mode from the backend (config-driven; the
  // front hardcodes nothing). Display-only, so it never blocks unlock.
  useEffect(() => {
    let alive = true
    pricingCategories()
      .then((res) => {
        if (!alive) return
        if (res?.reveal_mode) setRevealMode(res.reveal_mode)
        const found = (res?.categories || []).find((c) => c.key === category)
        if (found) setMeta({ label: found.label, blurb: found.blurb })
      })
      .catch(() => { /* fall back to the title-cased slug + open mode */ })
    return () => { alive = false }
  }, [category])

  // Resolve access exactly once: token in URL > stored grant (this category) > gate.
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
          showPackages(res?.packages || [], res?.grant)
        } catch {
          setError('That access link is invalid or has expired. Enter your email to get a new one.')
          setPhase('gate')
        }
        return
      }
      const stored = ls(grantKey(category))
      if (stored) {
        try {
          const res = await pricingPackages(stored, { category })
          showPackages(res?.packages || [], stored)
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
      showPackages(res?.packages || [], res?.grant)
    } catch (err) {
      setError(err?.status === 403 ? 'That email or access code is not recognised.' : (err?.message || 'Could not verify. Please try again.'))
    } finally {
      setBusy(false)
    }
  }

  const openPackage = useCallback((p) => {
    setActivePkg(p)
    // Per-package interest signal (silent): which packages get opened.
    const e = (email || ls(EMAIL_KEY)) || undefined
    trackPageView({ path: `/miami-2026/pricing/${category}/${p.slug}`, title: p.name, email: e, source: 'pricing_overlay' })
  }, [category, email])

  function trackBudget() {
    const n = Number(budget)
    if (!n || n <= 0) return
    const e = (email || ls(EMAIL_KEY)) || undefined
    trackPageView({ path: `/miami-2026/pricing/${category}?budget=${n}`, title: `Budget ${n}`, email: e, source: 'budget_filter' })
  }

  const hidePrices = revealMode === 'reveal_individual'
  const budgetNum = Number(budget)
  const visible = (budgetNum > 0)
    ? packages.filter((p) => { const v = priceOf(p); return v === null || v <= budgetNum })
    : packages

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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(22px,3vw,32px)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="font-body" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#1f7a4d', fontSize: '0.85rem', fontWeight: 600 }}>
                  <CheckCircle2 size={16} /> Pricing unlocked
                </div>
                {packages.length > 0 && (
                  <BudgetFilter budget={budget} setBudget={setBudget} onCommit={trackBudget} count={visible.length} total={packages.length} />
                )}
              </div>

              {packages.length === 0
                ? <p className="font-body text-center" style={{ color: '#586778' }}>Pricing is being finalised. Please check back shortly.</p>
                : visible.length === 0
                  ? <p className="font-body text-center" style={{ color: '#586778' }}>No packages match that budget. Clear the filter to see all options.</p>
                  : <PackageGrid items={visible} hidePrices={hidePrices} onOpen={openPackage} />}

              <Link to={MIAMI_2026_PRICING} className="font-body" style={{ color: '#7a8694', fontSize: '0.85rem', textDecoration: 'none' }}>← See all package types</Link>
            </div>
          )}
        </div>
      </section>

      {activePkg && (
        <PackageOverlay
          p={activePkg}
          hidePrices={hidePrices}
          grant={grant}
          category={category}
          defaultName={name}
          budget={budgetNum > 0 ? budgetNum : null}
          onClose={() => setActivePkg(null)}
        />
      )}
    </main>
  )
}

function BudgetFilter({ budget, setBudget, onCommit, count, total }) {
  const active = budget !== '' && Number(budget) > 0
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <label className="font-body" style={{ fontSize: '0.85rem', color: '#586778' }}>Show options up to</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#7a8694', fontSize: '0.95rem' }}>$</span>
        <input
          type="number" min="0" step="500" inputMode="numeric" placeholder="budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          onBlur={onCommit}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.currentTarget.blur() } }}
          className="font-body"
          style={{ ...inputStyle, padding: '10px 12px 10px 24px', width: 140 }}
        />
      </div>
      {active && (
        <>
          <span className="font-body" style={{ fontSize: '0.8rem', color: '#7a8694' }}>{count} of {total}</span>
          <button type="button" onClick={() => setBudget('')} className="font-body"
            style={{ background: 'none', border: '1px solid #d7dde8', borderRadius: 8, padding: '8px 12px', fontSize: '0.8rem', color: NAVY, cursor: 'pointer' }}>
            Clear filter
          </button>
        </>
      )}
    </div>
  )
}

function PackageGrid({ items, hidePrices, onOpen }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
      {items.map((p) => <PackageCard key={p.slug} p={p} hidePrices={hidePrices} onOpen={onOpen} />)}
    </div>
  )
}

function PackageCard({ p, hidePrices, onOpen }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '22px 20px', boxShadow: '0 8px 24px rgba(9,32,62,0.08)', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p className="font-heading font-bold" style={{ fontSize: '1.05rem', color: NAVY, lineHeight: 1.25 }}>{p.name}</p>
      {p.summary && (
        <p className="font-body" style={{ fontSize: '0.9rem', color: '#3f5066', lineHeight: 1.5, flexGrow: 1 }}>{p.summary}</p>
      )}
      {!hidePrices && (
        <p className="font-heading font-bold" style={{ fontSize: '1.5rem', color: 'var(--color-brand-accent)', marginTop: 2 }}>{p.price_display || 'Contact for pricing'}</p>
      )}
      <button type="button" onClick={() => onOpen(p)} className="font-body font-semibold"
        style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px 16px', borderRadius: 9, border: `1px solid ${NAVY}`, background: '#fff', color: NAVY, cursor: 'pointer', fontSize: '0.85rem' }}>
        Expand details <ArrowRight size={15} />
      </button>
    </div>
  )
}

function PackageOverlay({ p, hidePrices, grant, category, defaultName, budget, onClose }) {
  const benefits = Array.isArray(p.benefits) ? p.benefits : []

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(5,13,26,0.62)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 'clamp(16px,5vh,64px) 16px', zIndex: 1000, overflowY: 'auto' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label={p.name}
        style={{ background: '#fff', borderRadius: 16, maxWidth: 560, width: '100%', boxShadow: '0 30px 80px rgba(5,13,26,0.5)', overflow: 'hidden' }}
      >
        <div style={{ position: 'relative', padding: 'clamp(24px,4vw,34px)' }}>
          <button type="button" onClick={onClose} aria-label="Close"
            style={{ position: 'absolute', top: 16, right: 16, width: 34, height: 34, borderRadius: 8, border: 'none', background: '#f1f3f6', color: NAVY, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>

          <h2 className="font-heading font-bold" style={{ fontSize: '1.5rem', color: NAVY, lineHeight: 1.2, marginRight: 40, marginBottom: 8 }}>{p.name}</h2>
          {p.summary && <p className="font-body" style={{ fontSize: '0.95rem', color: '#3f5066', lineHeight: 1.55, marginBottom: 16 }}>{p.summary}</p>}

          <div style={{ background: '#f7f8fa', borderRadius: 12, padding: '16px 18px', marginBottom: 18 }}>
            <p className="font-heading font-bold" style={{ fontSize: '1.7rem', color: 'var(--color-brand-accent)' }}>{p.price_display || 'Contact for pricing'}</p>
            <p className="font-body" style={{ fontSize: '0.74rem', color: '#7a8694', lineHeight: 1.45, marginTop: 6 }}>{PRICE_NOTE}</p>
          </div>

          {p.body && <p className="font-body" style={{ fontSize: '0.85rem', color: '#586778', lineHeight: 1.6, marginBottom: 16 }}>{p.body}</p>}

          {benefits.length > 0 && (
            <>
              <p className="font-heading font-bold" style={{ fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: NAVY, marginBottom: 10 }}>What's included</p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 9, listStyle: 'none', padding: 0, margin: '0 0 8px' }}>
                {benefits.map((b, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <Check size={15} color="#1f7a4d" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span className="font-body" style={{ fontSize: '0.84rem', color: '#3f5066', lineHeight: 1.45 }}>
                      <span style={{ fontWeight: 600, color: NAVY }}>{b.label}{b.quantity > 1 ? ` ×${b.quantity}` : ''}</span>
                      {b.note ? <span style={{ color: '#7a8694' }}>{`: ${b.note}`}</span> : null}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <InterestForm grant={grant} packageSlug={p.slug} packageName={p.name} defaultName={defaultName} budget={budget} />
        </div>
      </div>
    </div>
  )
}

function InterestForm({ grant, packageSlug, packageName, defaultName, budget }) {
  const [stage, setStage] = useState('idle') // idle | form | sending | done | error
  const [contactMethod, setContactMethod] = useState('email')
  const [name, setName] = useState(defaultName || '')
  const [phone, setPhone] = useState('')
  const [bestTime, setBestTime] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  const wantsPhone = contactMethod === 'phone' || contactMethod === 'either'

  async function submit(e) {
    e.preventDefault()
    if (wantsPhone && !phone.trim()) { setError('Please add a phone number, or choose email.'); return }
    setStage('sending'); setError('')
    try {
      await pricingInterest({
        grant,
        package_slug: packageSlug,
        contact_method: contactMethod,
        phone: wantsPhone ? phone.trim() : undefined,
        best_time: wantsPhone ? (bestTime.trim() || undefined) : undefined,
        name: name.trim() || undefined,
        note: note.trim() || undefined,
        budget: budget || undefined,
      })
      setStage('done')
    } catch (err) {
      setError(err?.message || 'Could not send your request. Please try again.')
      setStage('form')
    }
  }

  if (stage === 'done') {
    return (
      <div style={{ marginTop: 20, borderTop: '1px solid #eef1f5', paddingTop: 18, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <CheckCircle2 size={20} color="#1f7a4d" style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <p className="font-heading font-bold" style={{ fontSize: '1rem', color: NAVY }}>Thanks{name ? `, ${name.split(' ')[0]}` : ''}!</p>
          <p className="font-body" style={{ fontSize: '0.86rem', color: '#586778', lineHeight: 1.55 }}>
            Your interest in {packageName} is in. A member of our team will follow up
            {contactMethod === 'phone' ? ' by phone' : contactMethod === 'either' ? ' by email or phone' : ' by email'}
            {wantsPhone && bestTime ? ` around your preferred time (${bestTime})` : ''}.
          </p>
        </div>
      </div>
    )
  }

  if (stage === 'idle') {
    return (
      <div style={{ marginTop: 20, borderTop: '1px solid #eef1f5', paddingTop: 18 }}>
        <button type="button" onClick={() => setStage('form')} className="font-body font-semibold uppercase" style={primaryBtn(false)}>
          Register interest <ArrowRight size={15} />
        </button>
        <p className="font-body" style={{ fontSize: '0.74rem', color: '#9aa4b1', marginTop: 8 }}>No obligation. We will reach out about this package.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} style={{ marginTop: 20, borderTop: '1px solid #eef1f5', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p className="font-heading font-bold" style={{ fontSize: '0.95rem', color: NAVY }}>Register interest in {packageName}</p>
      {error && <p className="font-body" style={{ color: '#b3261e', fontSize: '0.82rem' }}>{error}</p>}

      <div>
        <p className="font-body" style={{ fontSize: '0.8rem', color: '#586778', marginBottom: 6 }}>How should we reach you?</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[['email', 'Email'], ['phone', 'Phone'], ['either', 'Either']].map(([val, lbl]) => (
            <label key={val} className="font-body" style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem',
              border: `1px solid ${contactMethod === val ? NAVY : '#d7dde8'}`, background: contactMethod === val ? 'rgba(9,32,62,0.05)' : '#fff', color: NAVY,
            }}>
              <input type="radio" name="contact_method" value={val} checked={contactMethod === val} onChange={() => setContactMethod(val)} style={{ accentColor: NAVY }} />
              {lbl}
            </label>
          ))}
        </div>
      </div>

      <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="font-body" style={inputStyle} />

      {wantsPhone && (
        <>
          <input type="tel" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className="font-body" style={inputStyle} />
          <input type="text" placeholder="Best time to reach you (e.g. weekday mornings ET)" value={bestTime} onChange={(e) => setBestTime(e.target.value)} className="font-body" style={inputStyle} />
        </>
      )}

      <textarea placeholder="Comments or questions" value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="font-body" style={{ ...inputStyle, resize: 'vertical' }} />

      <button type="submit" disabled={stage === 'sending'} className="font-body font-semibold uppercase" style={primaryBtn(stage === 'sending')}>
        {stage === 'sending' ? 'Sending…' : <>Send request <ArrowRight size={15} /></>}
      </button>
    </form>
  )
}

const inputStyle = {
  border: '1px solid #d7dde8', borderRadius: 10, padding: '12px 14px', fontSize: '0.95rem',
  color: '#1f2937', background: '#fff', outline: 'none',
}
function primaryBtn(busy) {
  return { background: NAVY, color: '#fff', padding: '14px 24px', borderRadius: 10, letterSpacing: '0.1em', fontSize: '0.8rem', border: 'none', cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.6 : 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }
}
