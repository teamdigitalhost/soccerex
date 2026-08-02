import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Loader2, Mail, ArrowRight, ShieldCheck, AlertTriangle, Building2, Handshake } from 'lucide-react'
import { previewInvitation, acceptInvitation, declineInvitation } from '../lib/soccerexApi'
import { HOME, CONTACT } from '../lib/routes'

/* Soccerex invitation accept page.
 *
 * The backend emails a magic link like /invite/{token}. This page:
 *   1. Loads invitation details (no auth) via GET /api/v1/invitations/{token}
 *   2. Shows a welcome card with company name, role, and inviter
 *   3. On accept: POSTs to /accept, redirects browser to the returned
 *      backend magic-link URL which sets the session and forwards to the
 *      correct portal panel.
 *   4. On decline: POSTs to /decline, shows a closed-state.
 */

const NAVY = '#09203e'
const NAVY_DEEP = '#050d1a'

const ROLE_LABELS = {
  owner: 'Owner',
  editor: 'Editor',
  viewer: 'Viewer',
}

const TYPE_BADGE = {
  brand: { label: 'Brand / Sponsor', icon: Building2, tone: '#bfb170' },
  club: { label: 'Club', icon: Handshake, tone: '#6b3aa8' },
  federation: { label: 'Federation', icon: Handshake, tone: '#6b3aa8' },
  person: { label: 'Speaker / Delegate', icon: Mail, tone: '#bfb170' },
}

export default function InviteAccept() {
  const { token } = useParams()
  const [state, setState] = useState('loading') // 'loading' | 'preview' | 'accepting' | 'declined' | 'error'
  const [data, setData] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Soccerex Invitation'
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await previewInvitation(token)
        if (cancelled) return
        setData(res)
        setState('preview')
      } catch (err) {
        if (cancelled) return
        setErrorMsg(err?.message || 'This invitation could not be loaded.')
        setState('error')
      }
    }
    load()
    return () => { cancelled = true }
  }, [token])

  async function handleAccept() {
    setState('accepting')
    try {
      const res = await acceptInvitation(token)
      if (res?.magic_link_url) {
        // Validate origin before redirect so a tampered API response can't send the user off-site.
        try {
          const target = new URL(res.magic_link_url, window.location.origin)
          if (target.origin !== window.location.origin) throw new Error('unexpected origin')
          window.location.href = target.href
        } catch {
          setErrorMsg('Accepted but the sign-in link was invalid. Contact the team.')
          setState('error')
        }
        return
      }
      setErrorMsg('Accepted but could not generate a sign-in link. Contact the team.')
      setState('error')
    } catch (err) {
      setErrorMsg(err?.message || 'We could not accept the invitation. It may have expired.')
      setState('error')
    }
  }

  async function handleDecline() {
    if (! window.confirm('Decline this invitation? You will no longer be able to use this link.')) return
    try {
      await declineInvitation(token)
      setState('declined')
    } catch (err) {
      setErrorMsg(err?.message || 'We could not decline this invitation.')
      setState('error')
    }
  }

  return (
    <div style={{ background: NAVY_DEEP, minHeight: '100vh' }}>
      <section className="relative overflow-hidden flex items-center justify-center" style={{ minHeight: '100vh' }}>
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse at top, #0d2b52 0%, ${NAVY_DEEP} 70%)`,
        }} />
        <div className="absolute pointer-events-none" style={{
          top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: '900px', height: '900px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(191,177,112,0.12) 0%, transparent 60%)',
        }} />

        <div className="relative z-10 w-full" style={{ maxWidth: '560px', padding: 'clamp(40px,6vw,80px) clamp(20px,4vw,40px)' }}>
          <div className="flex justify-center mb-8">
            <img src="/brand/crests/crest-main-white.svg" alt="Soccerex" style={{ height: 56, filter: 'drop-shadow(0 8px 40px rgba(233,30,99,0.3))' }} />
          </div>

          {state === 'loading' && <LoadingCard />}
          {state === 'preview' && data && (
            <PreviewCard
              data={data}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          )}
          {state === 'accepting' && <LoadingCard message="Signing you in…" />}
          {state === 'declined' && <DeclinedCard />}
          {state === 'error' && <ErrorCard message={errorMsg} />}
        </div>
      </section>
    </div>
  )
}

function PreviewCard({ data, onAccept, onDecline }) {
  const typeKey = data?.profile?.type ?? 'person'
  const typeMeta = TYPE_BADGE[typeKey] || TYPE_BADGE.person
  const TypeIcon = typeMeta.icon
  const alreadyAccepted = data?.already_accepted

  return (
    <div style={{
      background: '#fff', borderRadius: 16,
      padding: 'clamp(28px,4vw,40px)',
      boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
    }}>
      <p className="font-mono uppercase tracking-[0.18em]" style={{ fontSize: '0.66rem', color: 'var(--color-brand-accent)', fontWeight: 700, marginBottom: 8 }}>
        Soccerex Invitation
      </p>
      <h1 className="font-heading font-bold" style={{ fontSize: 'clamp(1.6rem, 3vw, 2rem)', color: NAVY, lineHeight: 1.2, marginBottom: 8 }}>
        You have been invited to manage<br />
        <span style={{ color: 'var(--color-brand-accent)' }}>{data?.profile?.display_name ?? 'a Soccerex profile'}</span>
      </h1>
      <p className="font-body" style={{ fontSize: '0.95rem', color: '#586778', lineHeight: 1.6, marginBottom: 18 }}>
        {data?.inviter?.name
          ? <>Invited by <strong style={{ color: NAVY }}>{data.inviter.name}</strong>{data.inviter.email ? ` (${data.inviter.email})` : ''}.</>
          : <>Invited by the Soccerex team.</>}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ marginBottom: 24 }}>
        <Stat icon={TypeIcon} tint={typeMeta.tone} label="Profile type" value={typeMeta.label} />
        <Stat icon={ShieldCheck} tint={NAVY} label="Your role" value={ROLE_LABELS[data?.role] ?? data?.role ?? 'Editor'} />
      </div>

      <div style={{ background: '#fafaf7', borderRadius: 10, padding: '14px 16px', border: '1px solid rgba(9,32,62,0.08)', marginBottom: 22 }}>
        <div className="text-xs text-gray-500 mb-1">Sending to</div>
        <div className="font-mono text-sm text-gray-900">{data?.invited_email}</div>
      </div>

      {alreadyAccepted && (
        <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10, padding: '12px 14px', marginBottom: 18, color: '#166534', fontSize: '0.85rem' }}>
          You have already accepted this invitation. Accepting again will sign you back in.
        </div>
      )}

      <button
        type="button"
        onClick={onAccept}
        className="w-full inline-flex items-center justify-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
        style={{
          background: 'var(--color-brand-accent)', color: NAVY,
          padding: '16px 24px', fontSize: '0.82rem', border: 'none', cursor: 'pointer',
          borderRadius: 4,
        }}
      >
        Accept and sign in <ArrowRight size={16} />
      </button>

      <button
        type="button"
        onClick={onDecline}
        className="w-full mt-3 inline-flex items-center justify-center gap-2 font-body font-medium"
        style={{
          background: 'transparent', color: '#7a8896',
          padding: '12px 24px', fontSize: '0.85rem', border: '1px solid rgba(9,32,62,0.12)',
          cursor: 'pointer', borderRadius: 4,
        }}
      >
        Decline invitation
      </button>

      <p className="font-body text-center" style={{ fontSize: '0.75rem', color: '#9aa6b3', marginTop: 18, lineHeight: 1.5 }}>
        By accepting, you agree to Soccerex's <Link to="/terms" style={{ color: NAVY, textDecoration: 'underline' }}>Terms</Link> and <Link to="/privacy-policy" style={{ color: NAVY, textDecoration: 'underline' }}>Privacy Policy</Link>.
      </p>
    </div>
  )
}

function Stat({ icon: Icon, tint, label, value }) {
  return (
    <div style={{ background: '#fafaf7', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(9,32,62,0.08)' }}>
      <div className="flex items-center gap-2 mb-1">
        <span style={{ width: 26, height: 26, borderRadius: 7, background: `${tint}22`, display: 'grid', placeItems: 'center' }}>
          <Icon size={14} color={tint} strokeWidth={2.2} />
        </span>
        <div className="text-[10px] uppercase tracking-wide text-gray-500">{label}</div>
      </div>
      <div className="font-heading font-semibold" style={{ fontSize: '0.95rem', color: NAVY }}>{value}</div>
    </div>
  )
}

function LoadingCard({ message = 'Loading your invitation…' }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '48px 32px', textAlign: 'center', boxShadow: '0 30px 80px rgba(0,0,0,0.45)' }}>
      <Loader2 className="inline-block animate-spin" size={28} style={{ color: NAVY }} />
      <p className="font-body mt-4" style={{ color: '#586778' }}>{message}</p>
    </div>
  )
}

function DeclinedCard() {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(28px,4vw,40px)', boxShadow: '0 30px 80px rgba(0,0,0,0.45)' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(9,32,62,0.08)', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
        <CheckCircle2 size={28} color={NAVY} />
      </div>
      <h1 className="font-heading font-bold text-center" style={{ fontSize: '1.4rem', color: NAVY, marginBottom: 10 }}>Invitation declined</h1>
      <p className="font-body text-center" style={{ fontSize: '0.95rem', color: '#586778', lineHeight: 1.6, marginBottom: 22 }}>
        We have closed this invitation. If this was a mistake, ask the inviter to send a fresh link.
      </p>
      <Link to={HOME} className="block text-center font-body font-semibold uppercase tracking-[0.15em]"
        style={{ background: 'var(--color-brand-accent)', color: NAVY, padding: '14px', fontSize: '0.78rem', textDecoration: 'none', borderRadius: 4 }}>
        Back to Soccerex
      </Link>
    </div>
  )
}

function ErrorCard({ message }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(28px,4vw,40px)', boxShadow: '0 30px 80px rgba(0,0,0,0.45)' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(239,68,68,0.12)', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
        <AlertTriangle size={28} color="#dc2626" />
      </div>
      <h1 className="font-heading font-bold text-center" style={{ fontSize: '1.4rem', color: NAVY, marginBottom: 10 }}>Something went wrong</h1>
      <p className="font-body text-center" style={{ fontSize: '0.92rem', color: '#586778', lineHeight: 1.6, marginBottom: 22 }}>
        {message || 'This invitation is no longer valid.'}
      </p>
      <Link to={CONTACT} className="block text-center font-body font-semibold uppercase tracking-[0.15em]"
        style={{ background: NAVY, color: '#fff', padding: '14px', fontSize: '0.78rem', textDecoration: 'none', borderRadius: 4 }}>
        Contact the Soccerex team
      </Link>
    </div>
  )
}
