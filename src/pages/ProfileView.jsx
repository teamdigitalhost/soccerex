import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Edit3, Loader2, AlertCircle, Mail, Phone, Globe,
  User, Building2, Eye, EyeOff, Link2,
} from 'lucide-react'
import { getEditableProfile, ApiError } from '../lib/soccerexApi'
import {
  readProfileAccessSession, clearProfileAccessSession,
} from '../lib/profileAccessAuth'
import { isTestModeFromUrl, withTestSearch } from '../lib/testMode'
import {
  PROFILE_ACCESS, PROFILE_EXPIRED, profileEditor, companyPortal, personalPortal,
} from '../lib/routes'

/* Read-only "View profile" page. Shows the same payload the editor consumes
   (getEditableProfile) as a clean profile card — for both person and company
   profiles — without any edit chrome. Auth mirrors PersonalPortal: bounce to
   /profile-access when no edit_token, 401 invalidates the session. */

export default function ProfileView() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [session, setSession] = useState(() => readProfileAccessSession())
  /* Result is keyed by the slug it was loaded for, so navigating between
     profiles never flashes the previous profile while the next one loads
     (no synchronous reset needed inside the effect). */
  const [result, setResult] = useState({ slug: null, profile: null, error: null })

  /* Bounce to /profile-access if there's no edit_token */
  useEffect(() => {
    if (!session?.edit_token) navigate(PROFILE_ACCESS, { replace: true })
  }, [session, navigate])

  /* Test-mode URL preservation, mirrors editor + portals */
  useEffect(() => {
    if (!session?.is_test) return
    if (isTestModeFromUrl()) return
    const params = new URLSearchParams(location.search)
    params.set('test', '1')
    navigate({ pathname: location.pathname, search: `?${params.toString()}` }, { replace: true })
  }, [session, location.pathname, location.search, navigate])

  const editToken = session?.edit_token
  const isTest = !!session?.is_test

  useEffect(() => {
    if (!editToken) return
    let cancelled = false
    getEditableProfile(slug, editToken, { test: isTest })
      .then((data) => { if (!cancelled) setResult({ slug, profile: data, error: null }) })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiError && err.status === 401) {
          clearProfileAccessSession(); setSession(null)
          navigate(PROFILE_EXPIRED, { replace: true })
          return
        }
        setResult({ slug, profile: null, error: err })
      })
    return () => { cancelled = true }
  }, [slug, editToken, isTest, navigate])

  if (!editToken) return null

  const profile = result.slug === slug ? result.profile : null
  const error = result.slug === slug ? result.error : null

  /* Prefer profile_kind / is_company; older payloads may carry neither, in
     which case we render the neutral person treatment. */
  const isCompany = profile?.profile_kind
    ? profile.profile_kind === 'company'
    : !!profile?.is_company

  return (
    <div className="event-page theme-soccerex" style={{ background: '#FAFBFC', minHeight: '100vh', paddingTop: 'var(--app-top-offset)' }}>
      <ViewHeader profile={profile} slug={slug} isCompany={isCompany} />

      <section style={{ padding: 'clamp(24px,3vw,40px) clamp(24px,5vw,60px) clamp(80px,10vw,120px)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {error && <ErrorBanner error={error} />}
          {!error && !profile && <Loading label="Loading profile" />}
          {profile && <ProfileCard profile={profile} isCompany={isCompany} />}
        </div>
      </section>
    </div>
  )
}

/* ─── Header ───────────────────────────────────────────────────────────── */

function ViewHeader({ profile, slug, isCompany }) {
  const portalPath = isCompany ? companyPortal(slug) : personalPortal(slug)
  return (
    <header style={{
      position: 'sticky', top: 'var(--app-top-offset)', zIndex: 20,
      background: '#FFFFFF',
      borderBottom: '1px solid rgba(13,27,42,0.08)',
      padding: 'clamp(14px, 2vw, 22px) clamp(24px, 5vw, 60px)',
      backdropFilter: 'blur(8px)',
    }}>
      <div className="flex items-center justify-between gap-6 flex-wrap" style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="flex items-center gap-4 flex-wrap">
          <Link to={withTestSearch(PROFILE_ACCESS)} className="inline-flex items-center gap-2 font-mono uppercase tracking-widest"
            style={{ fontSize: 11, color: '#0D1B2A', opacity: 0.55, textDecoration: 'none' }}>
            <ArrowLeft size={13} /> Profiles
          </Link>
          <span style={{ width: 1, height: 18, background: 'rgba(13,27,42,0.15)' }} />
          <div>
            <p className="font-mono uppercase" style={{ fontSize: 10, color: 'var(--event-primary)', letterSpacing: '0.2em' }}>
              View profile
            </p>
            <p className="font-heading font-bold" style={{ fontSize: 16, color: '#0D1B2A' }}>
              {profile?.display_name || profile?.legal_name || profile?.name || '...'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Link to={withTestSearch(profileEditor(slug))} className="event-btn-outline-light" style={{ padding: '8px 14px', fontSize: 11 }}>
            <Edit3 size={12} /> Edit profile
          </Link>
          <Link to={withTestSearch(portalPath)} className="event-btn-outline-light" style={{ padding: '8px 14px', fontSize: 11 }}>
            Open portal <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </header>
  )
}

/* ─── Profile card ─────────────────────────────────────────────────────── */

function ProfileCard({ profile: p, isCompany }) {
  const socials = Object.entries(p.socials || {}).filter(([, url]) => !!url)
  /* The Brand Assets editor stores its shared asset URLs in links with
     category "asset" — those are internal, so only public links show here. */
  const links = (Array.isArray(p.links) ? p.links : []).filter((l) => l && l.url && l.category !== 'asset')
  const tags = Array.isArray(p.search_tags)
    ? p.search_tags
    : String(p.search_tags || '').split(',').map((t) => t.trim()).filter(Boolean)
  const isPrivate = p.visibility != null && /private|hidden|unlisted/i.test(String(p.visibility))

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.10)' }}>
      {p.banner_url && (
        <div style={{ height: 'clamp(120px, 22vw, 200px)', background: '#0D1B2A', overflow: 'hidden' }}>
          <img src={p.banner_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      <div style={{ padding: 'clamp(20px, 3vw, 32px)' }}>
        <div className="flex items-start gap-5 flex-wrap">
          <ProfileImage profile={p} isCompany={isCompany} />
          <div style={{ flex: '1 1 280px', minWidth: 0 }}>
            <h1 className="font-heading font-bold" style={{ fontSize: 'clamp(1.3rem, 3vw, 1.7rem)', color: '#0D1B2A', lineHeight: 1.15 }}>
              {p.display_name || p.legal_name || '...'}
            </h1>
            {p.legal_name && p.display_name && p.legal_name !== p.display_name && (
              <p className="font-body" style={{ fontSize: 12.5, color: '#607186', marginTop: 2 }}>{p.legal_name}</p>
            )}
            {p.headline && (
              <p className="font-body" style={{ fontSize: 14.5, color: '#3a4a5a', marginTop: 6 }}>{p.headline}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              <Chip Icon={isCompany ? Building2 : User}>{isCompany ? 'Company' : 'Person'}</Chip>
              {p.visibility != null && (
                <Chip Icon={isPrivate ? EyeOff : Eye} tone={isPrivate ? 'muted' : 'success'}>
                  {isPrivate ? 'Private profile' : 'Public profile'}
                </Chip>
              )}
            </div>
          </div>
        </div>

        {p.bio && (
          <Block title="About">
            <p className="font-body" style={{ fontSize: 13.5, color: '#3a4a5a', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{p.bio}</p>
          </Block>
        )}

        {(p.email || p.phone || p.website_url) && (
          <Block title="Contact">
            <div className="flex flex-col gap-2">
              {p.email && <ContactRow Icon={Mail} href={`mailto:${p.email}`} value={p.email} />}
              {p.phone && <ContactRow Icon={Phone} href={`tel:${p.phone}`} value={p.phone} />}
              {p.website_url && <ContactRow Icon={Globe} href={p.website_url} value={prettyUrl(p.website_url)} external />}
            </div>
          </Block>
        )}

        {(socials.length > 0 || links.length > 0) && (
          <Block title="Socials & links">
            <div className="flex flex-col gap-2">
              {socials.map(([key, url]) => (
                <ContactRow key={key} Icon={Link2} href={url} label={prettyKey(key)} value={prettyUrl(url)} external />
              ))}
              {links.map((l, i) => (
                <ContactRow key={`${l.url}-${i}`} Icon={Link2} href={l.url} label={l.label} value={prettyUrl(l.url)} external />
              ))}
            </div>
          </Block>
        )}

        {tags.length > 0 && (
          <Block title="Tags">
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span key={t} className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: '0.14em', color: '#607186', background: '#FAFBFC', border: '1px solid rgba(13,27,42,0.06)', padding: '2px 8px' }}>{t}</span>
              ))}
            </div>
          </Block>
        )}
      </div>
    </div>
  )
}

function ProfileImage({ profile: p, isCompany }) {
  const src = isCompany ? (p.logo_url || p.photo_url) : (p.photo_url || p.logo_url)
  if (!src) {
    return (
      <div style={{ width: 96, height: 96, border: '1px dashed rgba(13,27,42,0.18)', display: 'grid', placeItems: 'center', background: '#FAFBFC', flexShrink: 0 }}>
        {isCompany ? <Building2 size={34} style={{ color: '#9aa6b3' }} /> : <User size={34} style={{ color: '#9aa6b3' }} />}
      </div>
    )
  }
  /* Companies show a contained logo on white; people get a cover-cropped photo. */
  return isCompany ? (
    <div style={{ width: 96, height: 96, border: '1px solid rgba(13,27,42,0.08)', display: 'grid', placeItems: 'center', background: '#FFFFFF', flexShrink: 0 }}>
      <img src={src} alt="" style={{ maxWidth: '82%', maxHeight: '82%', objectFit: 'contain' }} />
    </div>
  ) : (
    <img src={src} alt="" style={{ width: 96, height: 96, objectFit: 'cover', border: '1px solid rgba(13,27,42,0.08)', flexShrink: 0 }} />
  )
}

/* ─── Shared primitives ────────────────────────────────────────────────── */

function Block({ title, children }) {
  return (
    <div className="mt-6">
      <p className="font-mono uppercase mb-2" style={{ fontSize: 10, letterSpacing: '0.22em', color: '#607186' }}>{title}</p>
      {children}
    </div>
  )
}

function Chip({ Icon, tone, children }) {
  const tones = {
    success: { bg: 'rgba(16,185,129,0.10)', color: '#10b981' },
    muted:   { bg: 'rgba(13,27,42,0.06)', color: '#3a4a5a' },
  }
  const t = tones[tone] || { bg: 'var(--event-tile-soft, rgba(233,30,99,0.08))', color: 'var(--event-primary, #E91E63)' }
  return (
    <span className="inline-flex items-center gap-1.5 font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', background: t.bg, color: t.color, padding: '4px 10px' }}>
      {Icon && <Icon size={11} />} {children}
    </span>
  )
}

function ContactRow({ Icon, href, label, value, external }) {
  return (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}
      className="inline-flex items-center gap-2.5 font-body" style={{ fontSize: 13, color: '#0D1B2A', textDecoration: 'none' }}>
      {Icon && <Icon size={14} style={{ color: 'var(--event-primary, #E91E63)', flexShrink: 0 }} />}
      {label && <span style={{ color: '#607186' }}>{label}:</span>}
      <span style={{ wordBreak: 'break-all' }}>{value}</span>
    </a>
  )
}

function Loading({ label }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12" style={{ color: '#607186' }}>
      <Loader2 size={18} className="prog-spin" />
      <span className="font-mono uppercase" style={{ fontSize: 12, letterSpacing: '0.2em' }}>{label}</span>
    </div>
  )
}

function ErrorBanner({ error }) {
  return (
    <div className="flex items-start gap-3 p-5 mb-6" style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.25)' }}>
      <AlertCircle size={20} style={{ color: '#b91c1c', flexShrink: 0 }} />
      <div>
        <p className="font-heading font-bold" style={{ fontSize: 14, color: '#7c1d1d' }}>Could not load this profile</p>
        <p className="font-body mt-1" style={{ fontSize: 13, color: '#7c1d1d' }}>{error?.message || 'Unknown error'}</p>
      </div>
    </div>
  )
}

/* ─── Formatters ───────────────────────────────────────────────────────── */

function prettyUrl(url) {
  try { return String(url).replace(/^https?:\/\//, '').replace(/\/$/, '') } catch { return url }
}

function prettyKey(key) {
  return String(key).replace(/[_-]+/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
}
