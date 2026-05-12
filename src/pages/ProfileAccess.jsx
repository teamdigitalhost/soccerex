import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Check, Loader2, AlertCircle, LogOut, KeyRound, Shield } from 'lucide-react'
import {
  requestProfileAccess, previewProfileAccess, exchangeProfileAccess, ApiError,
} from '../lib/soccerexApi'
import {
  readProfileAccessSession, writeProfileAccessSession, clearProfileAccessSession,
} from '../lib/profileAccessAuth'
import { isTestModeFromUrl, withTestSearch } from '../lib/testMode'
import { HOME, CONTACT, PRIVACY_POLICY, profileEditor, companyPortal, personalPortal } from '../lib/routes'

export default function ProfileAccess() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token')

  const [session, setSession] = useState(() => readProfileAccessSession())

  /* Three view states: token-landing (token in URL), authed (session present),
     anonymous (no token, no session). The token-landing flow takes priority
     so the email link "just works" even if a stale session is around. */
  if (token) {
    return <TokenLanding token={token} onExchanged={(payload) => {
      const stored = writeProfileAccessSession({
        ...payload,
        persist: payload.persist ?? false,
        is_test: isTestModeFromUrl(),
      })
      setSession(stored)
      /* Remove the token from the URL once exchanged so a back-button doesn't
         re-trigger the preview/exchange flow. Keep test=1 if it was there. */
      const next = new URLSearchParams(params)
      next.delete('token')
      setParams(next, { replace: true })
    }} onSignOut={() => {
      clearProfileAccessSession()
      setSession(null)
      const next = new URLSearchParams(params)
      next.delete('token')
      setParams(next, { replace: true })
    }} />
  }

  if (session && session.edit_token) {
    return <ProfileChooser session={session} onSignOut={() => {
      clearProfileAccessSession()
      setSession(null)
    }}
      onPick={(slug, profile) => {
        /* Companies → sponsor portal. Persons → unified personal portal that
           pulls speaker / delegate / rights-holder / VIP roles in parallel. */
        const isCompany = profile?.profile_kind === 'company' || profile?.is_company === true
        const target = isCompany ? companyPortal(slug) : personalPortal(slug)
        navigate(withTestSearch(target))
      }}
      onEdit={(slug) => navigate(withTestSearch(profileEditor(slug)))} />
  }

  return <RequestForm />
}

/* ─── Email request ─────────────────────────────────────────────────────── */

function RequestForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  const submit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('submitting')
    try {
      await requestProfileAccess({ email: email.trim() }, { test: isTestModeFromUrl() })
      setStatus('sent')
    } catch {
      /* Endpoint always returns 202; only network failures fall here. */
      setStatus('sent') /* still show "sent" — never reveal whether an account exists */
    }
  }

  return (
    <Shell>
      <Header />
      <div className="card">
        {status === 'sent' ? (
          <div className="text-center">
            <Avatar Icon={Check} tone="success" />
            <h1 className="miami-headline" style={titleStyle}>Check your inbox</h1>
            <p className="miami-body" style={leadStyle}>
              If <strong>{email}</strong> can edit a Soccerex profile, a secure link is on its way. The link will expire in a short window — open it on the device you want to keep editing on.
            </p>
            <p className="miami-body" style={{ ...metaStyle, marginTop: 18 }}>
              Did not arrive? Check spam, or <button type="button" onClick={() => setStatus('idle')} className="inline-text-btn">request a new link</button>.
            </p>
          </div>
        ) : (
          <>
            <Avatar Icon={KeyRound} />
            <h1 className="miami-headline" style={titleStyle}>Edit your Soccerex profile</h1>
            <p className="miami-body" style={leadStyle}>
              Enter the email associated with your Soccerex profile and we will send you a secure link to edit it.
            </p>
            <form onSubmit={submit} className="flex flex-col gap-3 mt-6">
              <label className="font-mono" style={labelStyle}>Email
                <input required type="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" className="prog-input" />
              </label>
              <button type="submit" disabled={status === 'submitting'} className="miami-pill-primary justify-center">
                {status === 'submitting' ? <><Loader2 size={15} className="prog-spin" /> Sending</> : <>Send me a link <ArrowRight size={15} /></>}
              </button>
            </form>
            <p className="miami-body" style={{ ...metaStyle, marginTop: 18 }}>
              <Shield size={11} style={{ display: 'inline', marginRight: 4 }} />
              We never reveal whether an email has an account here.
            </p>
          </>
        )}
      </div>
      <FooterLinks />
    </Shell>
  )
}

/* ─── Token landing (?token=...) ────────────────────────────────────────── */

function TokenLanding({ token, onExchanged, onSignOut }) {
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const [exchanging, setExchanging] = useState(false)
  const [persist, setPersist] = useState(false)

  useEffect(() => {
    let cancelled = false
    setPreview(null); setError(null)
    /* The magic link carries the test=1 query when issued from a test-mode
       session, so the preview call must respect it — otherwise the backend
       can't find the test-issued token (handoff: "A test token cannot be
       used in production mode"). */
    previewProfileAccess(token, { test: isTestModeFromUrl() })
      .then((data) => { if (!cancelled) setPreview(data) })
      .catch((err) => { if (!cancelled) setError(err) })
    return () => { cancelled = true }
  }, [token])

  const exchange = async () => {
    setExchanging(true)
    try {
      const result = await exchangeProfileAccess(token, { test: isTestModeFromUrl() })
      onExchanged({ ...result, persist })
    } catch (err) {
      setError(err)
      setExchanging(false)
    }
  }

  if (error) {
    return (
      <Shell>
        <Header />
        <div className="card">
          <Avatar Icon={AlertCircle} tone="danger" />
          <h1 className="miami-headline" style={titleStyle}>This link will not work</h1>
          <p className="miami-body" style={leadStyle}>
            {error?.message || 'The link may have expired or already been used.'}
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <button onClick={onSignOut} className="miami-pill-primary">Request a new link</button>
          </div>
        </div>
        <FooterLinks />
      </Shell>
    )
  }

  if (!preview) {
    return (
      <Shell>
        <Header />
        <div className="card">
          <Avatar Icon={Loader2} spinning />
          <h1 className="miami-headline" style={titleStyle}>Checking your link</h1>
          <p className="miami-body" style={leadStyle}>One moment.</p>
        </div>
      </Shell>
    )
  }

  const profiles = Array.isArray(preview.profiles) ? preview.profiles
    : preview.profile ? [preview.profile]
    : []

  return (
    <Shell>
      <Header />
      <div className="card">
        <Avatar Icon={Check} tone="success" />
        <h1 className="miami-headline" style={titleStyle}>Welcome back</h1>
        {preview.email && (
          <p className="miami-body" style={leadStyle}>
            Signed in as <strong>{preview.email}</strong>.
          </p>
        )}
        {profiles.length > 0 ? (
          <>
            <p className="miami-body" style={{ ...metaStyle, marginTop: 18 }}>
              You can edit:
            </p>
            <ul className="flex flex-col gap-2 mt-3 text-left">
              {profiles.map((p) => (
                <li key={p.slug} className="profile-pick">
                  <div>
                    <p className="miami-headline" style={{ fontSize: 14, color: '#0D1B2A' }}>{p.display_name || p.legal_name || p.slug}</p>
                    {(p.profile_kind || p.type) && (
                      <p className="miami-body" style={{ fontSize: 11, color: '#607186', textTransform: 'capitalize' }}>
                        {[p.profile_kind, p.type].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(' · ')}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="miami-body" style={metaStyle}>
            We will load your editable profiles once you continue.
          </p>
        )}

        <label className="flex items-center gap-2 mt-6" style={{ fontSize: 12, color: '#3a4a5a' }}>
          <input type="checkbox" checked={persist} onChange={(e) => setPersist(e.target.checked)} />
          Keep this browser signed in until the session expires
        </label>

        <div className="flex flex-wrap gap-3 mt-6">
          <button onClick={exchange} disabled={exchanging} className="miami-pill-primary" style={{ flex: '1 1 auto', justifyContent: 'center' }}>
            {exchanging ? <><Loader2 size={15} className="prog-spin" /> Continuing</> : <>Edit profile <ArrowRight size={15} /></>}
          </button>
          <button onClick={onSignOut} className="event-btn-outline-light">Not me</button>
        </div>
      </div>
      <FooterLinks />
    </Shell>
  )
}

/* ─── Signed-in chooser ─────────────────────────────────────────────────── */

function ProfileChooser({ session, onSignOut, onPick, onEdit }) {
  const profiles = Array.isArray(session.profiles) ? session.profiles : []
  const expiresAt = session.expires_at ? new Date(session.expires_at) : null

  return (
    <Shell>
      <Header />
      <div className="card">
        <Avatar Icon={Check} tone="success" />
        <h1 className="miami-headline" style={titleStyle}>You are signed in</h1>
        {session.email && (
          <p className="miami-body" style={leadStyle}>
            As <strong>{session.email}</strong>. Choose a profile to manage.
          </p>
        )}
        {profiles.length > 0 ? (
          <ul className="flex flex-col gap-2 mt-5 text-left">
            {profiles.map((p) => (
              <li key={p.slug}>
                <div className="profile-pick" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
                  <div className="flex items-center justify-between gap-3" style={{ width: '100%' }}>
                    <div>
                      <p className="miami-headline" style={{ fontSize: 14, color: '#0D1B2A' }}>{p.display_name || p.legal_name || p.slug}</p>
                      {(p.profile_kind || p.type) && (
                        <p className="miami-body" style={{ fontSize: 11, color: '#607186', textTransform: 'capitalize' }}>
                          {[p.profile_kind, p.type].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(' · ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2" style={{ width: '100%' }}>
                    <button type="button" onClick={() => onPick(p.slug, p)}
                      className="event-btn-outline-light"
                      style={{ flex: '2 1 0', justifyContent: 'center', padding: '10px 14px', fontSize: 11, background: 'var(--event-primary, #ff6b35)', color: '#fff', borderColor: 'var(--event-primary, #ff6b35)' }}>
                      Open portal <ArrowRight size={13} />
                    </button>
                    <button type="button" onClick={() => onEdit(p.slug)}
                      className="event-btn-outline-light"
                      style={{ flex: '1 1 0', justifyContent: 'center', padding: '10px 14px', fontSize: 11 }}>
                      Edit profile
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="miami-body" style={metaStyle}>No profiles linked yet.</p>
        )}

        {expiresAt && (
          <p className="miami-body" style={{ ...metaStyle, marginTop: 24, fontSize: 11 }}>
            Session expires {expiresAt.toLocaleString()}
          </p>
        )}

        <div className="flex justify-center mt-4">
          <button onClick={onSignOut} className="inline-text-btn" style={{ fontSize: 12 }}>
            <LogOut size={12} style={{ display: 'inline', marginRight: 4 }} /> Sign out
          </button>
        </div>
      </div>
      <FooterLinks />
    </Shell>
  )
}

/* ─── Shared layout pieces ──────────────────────────────────────────────── */

function Shell({ children }) {
  return (
    <div className="event-page theme-soccerex" style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFBFC 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      /* Reserve room for the fixed navbar (+ test banner when active) so
         the page chrome doesn't tuck under it. */
      padding: 'calc(var(--app-top-offset) + clamp(40px,6vw,80px)) clamp(24px,4vw,40px) clamp(40px,6vw,80px)',
    }}>
      {children}
    </div>
  )
}

function Header() {
  return (
    <div style={{ width: '100%', maxWidth: 520, marginBottom: 24, textAlign: 'center' }}>
      <Link to={HOME} className="font-mono uppercase tracking-widest" style={{ fontSize: 11, color: '#0D1B2A', opacity: 0.55, textDecoration: 'none' }}>
        Soccerex
      </Link>
    </div>
  )
}

function FooterLinks() {
  return (
    <div className="flex gap-4 mt-8" style={{ fontSize: 11 }}>
      <Link to={PRIVACY_POLICY} style={{ color: '#607186', textDecoration: 'none' }}>Privacy</Link>
      <Link to={CONTACT} style={{ color: '#607186', textDecoration: 'none' }}>Get help</Link>
    </div>
  )
}

function Avatar({ Icon, tone = 'brand', spinning }) {
  const tones = {
    brand: { bg: 'var(--event-tile-soft)', color: 'var(--event-primary)', border: 'var(--event-primary-border)' },
    success: { bg: 'rgba(16,185,129,0.10)', color: '#10b981', border: 'rgba(16,185,129,0.30)' },
    danger: { bg: 'rgba(220,38,38,0.08)', color: '#b91c1c', border: 'rgba(220,38,38,0.25)' },
  }
  const t = tones[tone] || tones.brand
  return (
    <div style={{
      width: 64, height: 64, borderRadius: 999,
      background: t.bg, border: `1px solid ${t.border}`,
      display: 'grid', placeItems: 'center',
      margin: '0 auto 22px',
    }}>
      <Icon size={26} style={{ color: t.color }} className={spinning ? 'prog-spin' : undefined} />
    </div>
  )
}

const titleStyle = { fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', color: '#0D1B2A', textAlign: 'center', marginBottom: 12 }
const leadStyle = { fontSize: 15, color: '#3a4a5a', lineHeight: 1.55, textAlign: 'center' }
const metaStyle = { fontSize: 12, color: '#607186', textAlign: 'center' }
const labelStyle = { fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#607186', display: 'flex', flexDirection: 'column', gap: 6 }
