import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Edit3, Upload, AlertCircle, Loader2, LogOut,
  Calendar, CheckCircle2, Circle, FileText, Ticket, Wallet,
  Building2, ExternalLink, UserPlus, Image,
} from 'lucide-react'
import { getCompanyPortal, ApiError } from '../lib/soccerexApi'
import { readProfileAccessSession, clearProfileAccessSession } from '../lib/profileAccessAuth'
import { isTestModeFromUrl, withTestSearch } from '../lib/testMode'

/* The portal payload is rendered as-is. The backend strips internal-only
   fields (deal margin, staff notes) before serialising; this view never
   looks for them. Any field listed as "context only" by the backend can
   appear here — we treat it as ambient context, not actionable. */

export default function CompanyPortal() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [session, setSession] = useState(() => readProfileAccessSession())
  const [portal, setPortal] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!session?.edit_token) navigate('/profile-access', { replace: true })
  }, [session, navigate])

  /* Keep ?test=1 in the URL when the session was created in test mode and
     the user pasted the portal URL without it — mirrors ProfileEditor. */
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
    setPortal(null); setError(null)
    getCompanyPortal(slug, editToken, { test: isTest })
      .then((data) => { if (!cancelled) setPortal(data) })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiError && err.status === 401) {
          clearProfileAccessSession(); setSession(null)
          navigate('/profile-access?expired=1', { replace: true })
          return
        }
        setError(err)
      })
    return () => { cancelled = true }
  }, [slug, editToken, isTest, navigate])

  const signOut = () => {
    clearProfileAccessSession()
    navigate('/profile-access', { replace: true })
  }

  if (!editToken) return null
  const profile = portal?.profile || portal?.company || null

  return (
    <div className="event-page theme-soccerex" style={{ background: '#FAFBFC', minHeight: '100vh' }}>
      <PortalHeader profile={profile} session={session} onSignOut={signOut} />

      <section style={{ padding: 'clamp(24px,3vw,40px) clamp(24px,5vw,60px) clamp(80px,10vw,120px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {error && <ErrorBanner error={error} />}
          {!error && !portal && <Loading label="Loading portal" />}

          {portal && (
            <div className="flex flex-col gap-6">
              <ProfileSummary profile={profile} slug={slug} />
              <NextActions actions={portal.next_actions} />
              <Deliverables data={portal.deliverables} />
              <AssetLibrary data={portal.asset_library} slug={slug} />
              <PassAllocation data={portal.passes || portal.pass_allocation} />
              <CommercialOverview
                agreements={portal.agreements}
                invoices={portal.invoices}
                paymentSchedule={portal.payment_schedule}
              />
              <OrdersAndTickets orders={portal.orders} tickets={portal.tickets} />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

/* ─── Header ───────────────────────────────────────────────────────────── */

function PortalHeader({ profile, session, onSignOut }) {
  const expiresAt = session?.expires_at ? new Date(session.expires_at) : null
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 20,
      background: '#FFFFFF',
      borderBottom: '1px solid rgba(13,27,42,0.08)',
      padding: 'clamp(14px, 2vw, 22px) clamp(24px, 5vw, 60px)',
      backdropFilter: 'blur(8px)',
    }}>
      <div className="flex items-center justify-between gap-6 flex-wrap" style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="flex items-center gap-4 flex-wrap">
          <Link to={withTestSearch('/profile-access')} className="inline-flex items-center gap-2 font-mono uppercase tracking-widest"
            style={{ fontSize: 11, color: '#0D1B2A', opacity: 0.55, textDecoration: 'none' }}>
            <ArrowLeft size={13} /> Profiles
          </Link>
          <span style={{ width: 1, height: 18, background: 'rgba(13,27,42,0.15)' }} />
          <div>
            <p className="miami-subhead" style={{ fontSize: 10, color: 'var(--event-primary)', letterSpacing: '0.2em' }}>
              Sponsor / Exhibitor Portal
            </p>
            <p className="miami-headline" style={{ fontSize: 16, color: '#0D1B2A' }}>
              {profile?.display_name || profile?.legal_name || profile?.name || '...'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {expiresAt && (
            <span className="miami-body" style={{ fontSize: 11, color: '#607186' }}>
              Session: {expiresAt.toLocaleString()}
            </span>
          )}
          <button onClick={onSignOut} className="inline-text-btn" style={{ fontSize: 12 }}>
            <LogOut size={12} style={{ display: 'inline', marginRight: 4 }} /> Sign out
          </button>
        </div>
      </div>
    </header>
  )
}

/* ─── Profile summary ─────────────────────────────────────────────────── */

function ProfileSummary({ profile, slug }) {
  if (!profile) return null
  const editHref = withTestSearch(`/profile-access/edit/${encodeURIComponent(slug)}`)
  return (
    <Card kicker="Company" title="Profile summary" action={
      <Link to={editHref} className="event-btn-outline-light" style={{ padding: '10px 18px', fontSize: 12 }}>
        <Edit3 size={13} /> Edit profile
      </Link>
    }>
      <div className="flex items-start gap-5 flex-wrap">
        {profile.logo_url || profile.featured_logo ? (
          <div style={{ width: 88, height: 88, border: '1px solid rgba(13,27,42,0.08)', display: 'grid', placeItems: 'center', background: '#FFFFFF' }}>
            <img src={profile.logo_url || profile.featured_logo} alt="" style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
          </div>
        ) : (
          <div style={{ width: 88, height: 88, border: '1px dashed rgba(13,27,42,0.18)', display: 'grid', placeItems: 'center' }}>
            <Building2 size={32} style={{ color: '#9aa6b3' }} />
          </div>
        )}
        <div className="flex flex-col gap-2" style={{ flex: '1 1 280px' }}>
          {profile.headline && (
            <p className="miami-body" style={{ fontSize: 14, color: '#0D1B2A' }}>{profile.headline}</p>
          )}
          <div className="flex flex-wrap gap-x-5 gap-y-1.5">
            {profile.website_url && (
              <MetaLink href={profile.website_url} icon={ExternalLink} label="Website" value={prettyUrl(profile.website_url)} />
            )}
            {profile.email && (
              <MetaLink href={`mailto:${profile.email}`} icon={UserPlus} label="Primary email" value={profile.email} />
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

/* ─── Next actions ────────────────────────────────────────────────────── */

function NextActions({ actions }) {
  const list = Array.isArray(actions) ? actions : []
  if (list.length === 0) {
    return (
      <Card kicker="What's next" title="Next actions">
        <Empty icon={CheckCircle2} title="You're all caught up" body="No outstanding actions. The Soccerex team will surface new tasks here as the event approaches." />
      </Card>
    )
  }
  return (
    <Card kicker="What's next" title="Next actions">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {list.map((a, i) => <ActionCard key={a.id || i} action={a} />)}
      </div>
    </Card>
  )
}

function ActionCard({ action }) {
  const Icon = action.completed ? CheckCircle2 : Circle
  const due = action.due_at || action.due_date
  const body = (
    <>
      <div className="flex items-start gap-3">
        <Icon size={18} style={{ color: action.completed ? '#10b981' : 'var(--event-primary, #ff6b35)', marginTop: 2, flexShrink: 0 }} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <p className="miami-headline" style={{ fontSize: 14, color: '#0D1B2A', textDecoration: action.completed ? 'line-through' : 'none' }}>
            {action.title || action.label}
          </p>
          {action.description && (
            <p className="miami-body mt-1.5" style={{ fontSize: 12.5, color: '#3a4a5a' }}>{action.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
            {due && (
              <span className="inline-flex items-center gap-1.5 font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', color: '#607186' }}>
                <Calendar size={11} /> Due {fmtDate(due)}
              </span>
            )}
            {action.owner && (
              <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', color: '#607186' }}>
                Owner: <span style={{ color: '#0D1B2A' }}>{action.owner}</span>
              </span>
            )}
            {action.status && !action.completed && (
              <StatusPill status={action.status} />
            )}
          </div>
        </div>
        {action.cta_url && <ArrowRight size={14} style={{ color: 'var(--event-primary)', flexShrink: 0, marginTop: 4 }} />}
      </div>
    </>
  )
  const cardStyle = {
    background: '#FFFFFF',
    border: '1px solid rgba(13,27,42,0.08)',
    padding: 16,
    textDecoration: 'none',
    display: 'block',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  }
  if (action.cta_url) {
    const external = /^https?:\/\//.test(action.cta_url)
    return external
      ? <a href={action.cta_url} target="_blank" rel="noreferrer" style={cardStyle}>{body}</a>
      : <Link to={action.cta_url} style={cardStyle}>{body}</Link>
  }
  return <div style={cardStyle}>{body}</div>
}

/* ─── Deliverables ────────────────────────────────────────────────────── */

function Deliverables({ data }) {
  const summary = data?.summary || {}
  const items = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : [])
  return (
    <Card kicker="Deliverables" title="What we owe each other">
      <SummaryStrip stats={[
        { label: 'Total', value: summary.total ?? items.length },
        { label: 'Completed', value: summary.completed, tone: 'success' },
        { label: 'In progress', value: summary.in_progress },
        { label: 'Overdue', value: summary.overdue, tone: summary.overdue ? 'danger' : 'default' },
      ]} />
      {items.length > 0 ? (
        <table className="portal-table">
          <thead>
            <tr>
              <th>Deliverable</th>
              <th>Owner</th>
              <th>Due</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((d, i) => (
              <tr key={d.id || i}>
                <td>
                  <p className="miami-body" style={{ fontSize: 13, color: '#0D1B2A', fontWeight: 600 }}>{d.title || d.name}</p>
                  {d.description && <p className="miami-body" style={{ fontSize: 12, color: '#607186', marginTop: 2 }}>{d.description}</p>}
                </td>
                <td><Cell text={d.owner} /></td>
                <td><Cell text={fmtDate(d.due_at || d.due_date)} mono /></td>
                <td><StatusPill status={d.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Empty icon={CheckCircle2} title="No deliverables logged yet" body="The Soccerex team will populate this as your agreement is finalised." />
      )}
    </Card>
  )
}

/* ─── Asset library ───────────────────────────────────────────────────── */

function AssetLibrary({ data, slug }) {
  const summary = data?.summary || {}
  const recent = Array.isArray(data?.recent) ? data.recent : []
  const editHref = withTestSearch(`/profile-access/edit/${encodeURIComponent(slug)}`)
  return (
    <Card kicker="Brand & creative" title="Asset library" action={
      <Link to={editHref} className="event-btn-outline-light" style={{ padding: '10px 18px', fontSize: 12 }}>
        <Upload size={13} /> Upload assets
      </Link>
    }>
      <SummaryStrip stats={[
        { label: 'Total assets', value: summary.total },
        { label: 'Logos', value: summary.logos ?? summary.logo },
        { label: 'Banners', value: summary.banners ?? summary.banner },
        { label: 'Decks / docs', value: (summary.decks ?? 0) + (summary.pdfs ?? 0) || summary.documents },
      ]} />
      {recent.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-1">
          {recent.slice(0, 8).map((a, i) => <AssetThumb key={a.id || a.url || i} asset={a} />)}
        </div>
      ) : (
        <Empty icon={Image} title="No assets uploaded yet"
          body="Drop your logo, banner, and any artwork your sponsorship pack calls for. Featured logo / banner changes go through review." />
      )}
    </Card>
  )
}

function AssetThumb({ asset }) {
  const isImage = (asset.kind && ['logo', 'photo', 'headshot', 'banner', 'artwork', 'signage'].includes(asset.kind))
    || /\.(png|jpe?g|webp|gif|svg|avif)$/i.test(asset.url || asset.path || '')
  return (
    <div style={{ border: '1px solid rgba(13,27,42,0.10)', padding: 10, background: '#FFFFFF' }}>
      <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: 'rgba(13,27,42,0.06)', display: 'grid', placeItems: 'center' }}>
        {isImage && asset.url
          ? <img src={asset.url} alt={asset.alt_text || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <FileText size={26} style={{ color: '#607186' }} />}
      </div>
      <p className="miami-subhead mt-2" style={{ fontSize: 10, color: '#0D1B2A', textTransform: 'capitalize' }}>
        {asset.kind || 'file'}
      </p>
    </div>
  )
}

/* ─── Pass allocation ─────────────────────────────────────────────────── */

function PassAllocation({ data }) {
  if (!data) return null
  /* The backend may either return a flat shape ({ allocated, assigned, ... })
     or a per-tier breakdown ({ delegate: {...}, vip: {...} }). Handle both. */
  const tiers = []
  if (data.delegate || data.vip) {
    if (data.delegate) tiers.push({ label: 'Delegate', ...data.delegate })
    if (data.vip)      tiers.push({ label: 'VIP',      ...data.vip })
  } else {
    tiers.push({ label: 'Passes', allocated: data.allocated, assigned: data.assigned, remaining: data.remaining })
  }
  return (
    <Card kicker="Pass allocation" title="Delegate & VIP passes">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tiers.map((t) => {
          const allocated = numericOr(t.allocated, 0)
          const assigned = numericOr(t.assigned, 0)
          const remaining = t.remaining != null ? Number(t.remaining) : Math.max(0, allocated - assigned)
          const pct = allocated > 0 ? Math.min(100, Math.round((assigned / allocated) * 100)) : 0
          return (
            <div key={t.label} style={{ border: '1px solid rgba(13,27,42,0.08)', background: '#FFFFFF', padding: 18 }}>
              <div className="flex items-baseline justify-between mb-3">
                <p className="miami-subhead" style={{ fontSize: 11, color: 'var(--event-primary)', letterSpacing: '0.18em' }}>{t.label}</p>
                <p className="miami-headline" style={{ fontSize: 22, color: '#0D1B2A', lineHeight: 1 }}>
                  {assigned}<span style={{ color: '#9aa6b3', fontSize: 16 }}> / {allocated}</span>
                </p>
              </div>
              <div style={{ height: 6, background: 'rgba(13,27,42,0.08)', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: 'var(--event-primary, #ff6b35)' }} />
              </div>
              <div className="flex justify-between mt-3 font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.18em', color: '#607186' }}>
                <span>Assigned <span style={{ color: '#0D1B2A' }}>{assigned}</span></span>
                <span>Remaining <span style={{ color: '#0D1B2A' }}>{remaining}</span></span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

/* ─── Commercial: agreements, invoices, payment schedule ──────────────── */

function CommercialOverview({ agreements, invoices, paymentSchedule }) {
  const a = Array.isArray(agreements) ? agreements : []
  const inv = Array.isArray(invoices) ? invoices : []
  const sched = Array.isArray(paymentSchedule) ? paymentSchedule : []
  if (a.length === 0 && inv.length === 0 && sched.length === 0) return null
  return (
    <Card kicker="Commercial" title="Agreements, invoices & payment schedule">
      {a.length > 0 && (
        <>
          <SubHeading>Agreements</SubHeading>
          <table className="portal-table">
            <thead>
              <tr><th>Reference</th><th>Type</th><th>Effective</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {a.map((row, i) => (
                <tr key={row.id || i}>
                  <td><Cell text={row.reference || row.number || row.id} mono /></td>
                  <td><Cell text={row.type || row.kind} /></td>
                  <td><Cell text={fmtDate(row.effective_at || row.signed_at)} mono /></td>
                  <td><StatusPill status={row.status} /></td>
                  <td style={{ textAlign: 'right' }}>{row.url && <DownloadLink href={row.url} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {inv.length > 0 && (
        <>
          <SubHeading>Invoices</SubHeading>
          <table className="portal-table">
            <thead>
              <tr><th>Invoice</th><th>Issued</th><th>Due</th><th>Amount</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {inv.map((row, i) => (
                <tr key={row.id || i}>
                  <td><Cell text={row.number || row.reference || row.id} mono /></td>
                  <td><Cell text={fmtDate(row.issued_at || row.issued_on)} mono /></td>
                  <td><Cell text={fmtDate(row.due_at || row.due_on)} mono /></td>
                  <td><Cell text={fmtMoney(row)} mono /></td>
                  <td><StatusPill status={row.status} /></td>
                  <td style={{ textAlign: 'right' }}>{row.url && <DownloadLink href={row.url} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {sched.length > 0 && (
        <>
          <SubHeading>Payment schedule</SubHeading>
          <table className="portal-table">
            <thead>
              <tr><th>Milestone</th><th>Due</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {sched.map((row, i) => (
                <tr key={row.id || i}>
                  <td><Cell text={row.label || row.milestone || `Payment ${i + 1}`} /></td>
                  <td><Cell text={fmtDate(row.due_at || row.due_on)} mono /></td>
                  <td><Cell text={fmtMoney(row)} mono /></td>
                  <td><StatusPill status={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </Card>
  )
}

/* ─── Orders & tickets ────────────────────────────────────────────────── */

function OrdersAndTickets({ orders, tickets }) {
  const o = Array.isArray(orders) ? orders : []
  const t = Array.isArray(tickets) ? tickets : []
  if (o.length === 0 && t.length === 0) return null
  return (
    <Card kicker="Fulfilment" title="Orders & assigned tickets">
      {o.length > 0 && (
        <>
          <SubHeading>Orders</SubHeading>
          <table className="portal-table">
            <thead>
              <tr><th>Order</th><th>Placed</th><th>Items</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {o.map((row, i) => (
                <tr key={row.id || i}>
                  <td><Cell text={row.reference || row.number || row.id} mono /></td>
                  <td><Cell text={fmtDate(row.placed_at || row.created_at)} mono /></td>
                  <td><Cell text={row.item_count != null ? `${row.item_count}` : (Array.isArray(row.items) ? `${row.items.length}` : '—')} /></td>
                  <td><Cell text={fmtMoney(row)} mono /></td>
                  <td><StatusPill status={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {t.length > 0 && (
        <>
          <SubHeading>Tickets</SubHeading>
          <table className="portal-table">
            <thead>
              <tr><th>Holder</th><th>Type</th><th>Pass code</th><th>Status</th></tr>
            </thead>
            <tbody>
              {t.map((row, i) => (
                <tr key={row.id || i}>
                  <td>
                    <p className="miami-body" style={{ fontSize: 13, color: '#0D1B2A', fontWeight: 600 }}>
                      {row.holder_name || row.attendee_name || row.name || 'Unassigned'}
                    </p>
                    {(row.holder_email || row.email) && (
                      <p className="miami-body" style={{ fontSize: 12, color: '#607186', marginTop: 2 }}>{row.holder_email || row.email}</p>
                    )}
                  </td>
                  <td><Cell text={row.pass_type || row.type || row.tier} /></td>
                  <td><Cell text={row.code || row.pass_code || row.reference} mono /></td>
                  <td><StatusPill status={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </Card>
  )
}

/* ─── Primitives ──────────────────────────────────────────────────────── */

function Card({ kicker, title, action, children }) {
  return (
    <section style={{ background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.08)', padding: 'clamp(20px, 3vw, 30px)' }}>
      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          {kicker && <p className="miami-subhead" style={{ fontSize: 10, color: 'var(--event-primary)', letterSpacing: '0.22em', marginBottom: 6 }}>{kicker}</p>}
          <h2 className="miami-headline" style={{ fontSize: '1.15rem', color: '#0D1B2A' }}>{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function SubHeading({ children }) {
  return (
    <p className="miami-subhead mt-5 mb-2" style={{ fontSize: 10, color: '#607186', letterSpacing: '0.22em' }}>{children}</p>
  )
}

function SummaryStrip({ stats }) {
  const visible = stats.filter((s) => s.value != null && s.value !== '')
  if (visible.length === 0) return null
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      {visible.map((s) => (
        <div key={s.label} style={{ background: '#FAFBFC', border: '1px solid rgba(13,27,42,0.06)', padding: 14 }}>
          <p className="miami-subhead" style={{ fontSize: 10, color: '#607186', letterSpacing: '0.18em' }}>{s.label}</p>
          <p className="miami-headline mt-1" style={{
            fontSize: 22,
            color: s.tone === 'danger' ? '#b91c1c' : s.tone === 'success' ? '#10b981' : '#0D1B2A',
            lineHeight: 1,
          }}>{s.value}</p>
        </div>
      ))}
    </div>
  )
}

function StatusPill({ status }) {
  if (!status) return <span style={{ color: '#9aa6b3' }}>—</span>
  const key = String(status).toLowerCase()
  const tone =
    /(paid|completed|done|signed|approved|fulfilled)/.test(key) ? { bg: 'rgba(16,185,129,0.10)', color: '#10b981' } :
    /(overdue|failed|cancelled|rejected)/.test(key) ? { bg: 'rgba(220,38,38,0.10)', color: '#b91c1c' } :
    /(progress|pending|review|sent|due)/.test(key) ? { bg: 'rgba(245,158,11,0.12)', color: '#b45309' } :
    { bg: 'rgba(13,27,42,0.06)', color: '#3a4a5a' }
  return (
    <span className="font-mono uppercase" style={{
      display: 'inline-block', fontSize: 10, letterSpacing: '0.16em',
      padding: '3px 8px', background: tone.bg, color: tone.color,
    }}>
      {String(status).replace(/_/g, ' ')}
    </span>
  )
}

function Cell({ text, mono }) {
  if (!text && text !== 0) return <span style={{ color: '#9aa6b3' }}>—</span>
  return (
    <span className={mono ? 'font-mono' : 'miami-body'} style={{ fontSize: mono ? 12 : 13, color: '#0D1B2A' }}>
      {text}
    </span>
  )
}

function MetaLink({ href, icon: Icon, label, value }) {
  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
      className="inline-flex items-center gap-2" style={{ fontSize: 12.5, color: '#0D1B2A', textDecoration: 'none' }}>
      <Icon size={13} style={{ color: '#607186' }} />
      <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: '0.18em', color: '#607186' }}>{label}</span>
      <span>{value}</span>
    </a>
  )
}

function DownloadLink({ href }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5"
      style={{ fontSize: 11, color: 'var(--event-primary)', textDecoration: 'none' }}>
      <FileText size={12} /> Open
    </a>
  )
}

function Empty({ icon: Icon, title, body }) {
  return (
    <div style={{ border: '1px dashed rgba(13,27,42,0.18)', padding: 28, textAlign: 'center' }}>
      <Icon size={26} style={{ color: '#9aa6b3', margin: '0 auto 12px' }} />
      <p className="miami-headline mb-1" style={{ fontSize: 14, color: '#0D1B2A' }}>{title}</p>
      <p className="miami-body" style={{ fontSize: 12.5, color: '#607186', maxWidth: 520, margin: '0 auto' }}>{body}</p>
    </div>
  )
}

function Loading({ label }) {
  return (
    <div className="flex items-center justify-center gap-3 py-20" style={{ color: '#607186' }}>
      <Loader2 size={20} className="prog-spin" />
      <span className="miami-subhead" style={{ fontSize: 12 }}>{label}</span>
    </div>
  )
}

function ErrorBanner({ error }) {
  return (
    <div className="flex items-start gap-3 p-5" style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.25)' }}>
      <AlertCircle size={20} style={{ color: '#b91c1c', flexShrink: 0 }} />
      <div>
        <p className="miami-headline" style={{ fontSize: 14, color: '#7c1d1d' }}>Could not load this portal</p>
        <p className="miami-body mt-1" style={{ fontSize: 13, color: '#7c1d1d' }}>{error?.message || 'Unknown error'}</p>
      </div>
    </div>
  )
}

/* ─── Utilities ───────────────────────────────────────────────────────── */

function fmtDate(v) {
  if (!v) return null
  try {
    const d = typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v) ? new Date(v) : new Date(v)
    if (Number.isNaN(d.getTime())) return v
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch { return v }
}
function fmtMoney(row) {
  const amount = row.amount ?? row.total ?? row.value
  if (amount == null) return null
  const currency = row.currency || row.currency_code || 'USD'
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(Number(amount))
  } catch {
    return `${currency} ${amount}`
  }
}
function numericOr(v, fallback) { const n = Number(v); return Number.isFinite(n) ? n : fallback }
function prettyUrl(url) { try { return new URL(url).host.replace(/^www\./, '') } catch { return url } }
