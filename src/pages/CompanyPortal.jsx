import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Edit3, Upload, AlertCircle, Loader2, LogOut,
  Calendar, CheckCircle2, Circle, FileText, Ticket, Wallet, X, Plus,
  Building2, ExternalLink, UserPlus, Image, HelpCircle, MessageSquare, Send,
} from 'lucide-react'
import { getCompanyPortal, assignCompanyPass, postDeliverableUpdate, ApiError } from '../lib/soccerexApi'
import { readProfileAccessSession, clearProfileAccessSession } from '../lib/profileAccessAuth'
import { isTestModeFromUrl, withTestSearch } from '../lib/testMode'
import { PROFILE_ACCESS, PROFILE_EXPIRED, profileEditor } from '../lib/routes'
import DealNetworkPortalSection from '../components/DealNetworkPortalSection'

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
    if (!session?.edit_token) navigate(PROFILE_ACCESS, { replace: true })
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
          navigate(PROFILE_EXPIRED, { replace: true })
          return
        }
        setError(err)
      })
    return () => { cancelled = true }
  }, [slug, editToken, isTest, navigate])

  const signOut = () => {
    clearProfileAccessSession()
    navigate(PROFILE_ACCESS, { replace: true })
  }

  /* Reload the whole portal payload after a write (pass assignment,
     deliverable update). Cheaper than tracking each affected sub-tree. */
  const refresh = () => getCompanyPortal(slug, editToken, { test: isTest }).then(setPortal).catch(() => {})

  if (!editToken) return null
  const profile = portal?.profile || portal?.company || null

  return (
    <div className="event-page theme-soccerex" style={{ background: '#FAFBFC', minHeight: '100vh', paddingTop: 'var(--app-top-offset)' }}>
      <PortalHeader profile={profile} session={session} onSignOut={signOut} />

      <section style={{ padding: 'clamp(24px,3vw,40px) clamp(24px,5vw,60px) clamp(80px,10vw,120px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {error && <ErrorBanner error={error} />}
          {!error && !portal && <Loading label="Loading portal" />}

          {portal && (
            <div className="flex flex-col gap-6">
              <ProfileSummary profile={profile} slug={slug} />
              <NextActions actions={portal.next_actions} />
              <DealNetworkPortalSection
                slug={slug}
                editToken={editToken}
                isTest={isTest}
                onUnauthorized={signOut}
              />
              <Deliverables data={portal.deliverables} slug={slug} editToken={editToken} isTest={isTest} onRefresh={refresh} />
              <AssetLibrary data={portal.asset_library} slug={slug} />
              <PassAllocation
                data={portal.passes || portal.pass_allocation}
                events={portal.events || (portal.event ? [portal.event] : [])}
                slug={slug}
                editToken={editToken}
                isTest={isTest}
                onRefresh={refresh}
              />
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
  const editHref = withTestSearch(profileEditor(slug))
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

function Deliverables({ data, slug, editToken, isTest, onRefresh }) {
  const [acting, setActing] = useState(null) /* { deliverable, action } */
  const summary = data?.summary || {}
  const items = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : [])
  return (
    <>
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((d, i) => {
                const source = d.source || (d.deal_id ? 'deal' : 'agreement')
                const sourceId = d.source_id || d.deal_id || d.agreement_id || d.id
                const acted = !!d.acknowledged_at || d.status === 'acknowledged'
                return (
                  <tr key={d.id || i}>
                    <td>
                      <p className="miami-body" style={{ fontSize: 13, color: '#0D1B2A', fontWeight: 600 }}>{d.title || d.name}</p>
                      {d.description && <p className="miami-body" style={{ fontSize: 12, color: '#607186', marginTop: 2 }}>{d.description}</p>}
                    </td>
                    <td><Cell text={d.owner} /></td>
                    <td><Cell text={fmtDate(d.due_at || d.due_date)} mono /></td>
                    <td><StatusPill status={d.status} /></td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <DeliverableActions
                        deliverable={d}
                        source={source}
                        sourceId={sourceId}
                        acted={acted}
                        onPick={(action) => setActing({ deliverable: d, source, sourceId, action })}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <Empty icon={CheckCircle2} title="No deliverables logged yet" body="The Soccerex team will populate this as your agreement is finalised." />
        )}
      </Card>
      {acting && (
        <DeliverableActionDialog
          {...acting}
          slug={slug}
          editToken={editToken}
          isTest={isTest}
          onClose={() => setActing(null)}
          onSaved={() => { setActing(null); onRefresh && onRefresh() }}
        />
      )}
    </>
  )
}

function DeliverableActions({ deliverable, acted, onPick }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="inline-flex flex-wrap gap-1.5 justify-end" style={{ position: 'relative' }}>
      {!acted && (
        <button onClick={() => onPick('acknowledge')} className="event-btn-outline-light" style={{ padding: '6px 10px', fontSize: 10.5 }}>
          <CheckCircle2 size={11} /> Acknowledge
        </button>
      )}
      <button onClick={() => onPick('submit_evidence')} className="event-btn-outline-light" style={{ padding: '6px 10px', fontSize: 10.5 }}>
        <Upload size={11} /> Submit evidence
      </button>
      <button onClick={() => setOpen((x) => !x)} aria-label="More actions" className="event-btn-outline-light" style={{ padding: '6px 10px', fontSize: 10.5 }}>
        ⋯
      </button>
      {open && (
        <div onMouseLeave={() => setOpen(false)} style={{
          position: 'absolute', right: 0, top: '100%', marginTop: 4,
          background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.12)',
          boxShadow: '0 12px 30px -16px rgba(13,27,42,0.30)', minWidth: 180, zIndex: 5,
        }}>
          <ActionRow icon={MessageSquare} label="Add a note" onClick={() => { setOpen(false); onPick('add_note') }} />
          <ActionRow icon={HelpCircle}    label="Request help" onClick={() => { setOpen(false); onPick('request_help') }} />
          <ActionRow icon={Send}          label="Mark ready for review" onClick={() => { setOpen(false); onPick('ready_for_review') }} />
        </div>
      )}
    </div>
  )
}

function ActionRow({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 8, width: '100%',
      padding: '10px 12px', background: 'transparent', border: 0, textAlign: 'left',
      cursor: 'pointer', fontSize: 12, color: '#0D1B2A',
    }}>
      <Icon size={13} style={{ color: '#607186' }} /> {label}
    </button>
  )
}

function DeliverableActionDialog({ deliverable, source, sourceId, action, slug, editToken, isTest, onClose, onSaved }) {
  const [note, setNote] = useState('')
  const [files, setFiles] = useState([])
  const [urls, setUrls] = useState([''])
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [topError, setTopError] = useState('')
  const fieldError = (k) => Array.isArray(errors[k]) ? errors[k][0] : errors[k]

  const labels = {
    acknowledge:      { title: `Acknowledge: ${deliverable.title || deliverable.name}`,        cta: 'Acknowledge',       note: 'Optional confirmation note' },
    add_note:         { title: `Add note: ${deliverable.title || deliverable.name}`,            cta: 'Save note',         note: 'Note for the Soccerex team' },
    request_help:     { title: `Need help with: ${deliverable.title || deliverable.name}`,      cta: 'Send request',      note: 'Tell us what would unblock you' },
    ready_for_review: { title: `Ready for review: ${deliverable.title || deliverable.name}`,    cta: 'Mark ready',        note: 'Anything we should look at first?' },
    submit_evidence:  { title: `Submit evidence: ${deliverable.title || deliverable.name}`,     cta: 'Send for review',   note: 'Optional caption' },
  }
  const l = labels[action] || { title: 'Update', cta: 'Send', note: 'Note' }
  const requireNote = action === 'add_note' || action === 'request_help'
  const showEvidence = action === 'submit_evidence'

  const submit = async (e) => {
    e.preventDefault()
    if (requireNote && !note.trim()) return
    setSubmitting(true); setErrors({}); setTopError('')
    try {
      const cleanUrls = urls.map((u) => u.trim()).filter(Boolean)
      await postDeliverableUpdate(slug, editToken, source, sourceId, {
        action,
        note: note.trim() || undefined,
        files: showEvidence ? files : undefined,
        urls:  showEvidence ? cleanUrls : undefined,
      }, { test: isTest })
      onSaved()
    } catch (err) {
      if (err instanceof ApiError && err.status === 422 && err.body?.errors) {
        setErrors(err.body.errors)
        setTopError(err.body.message || 'Please fix the highlighted fields and try again.')
      } else {
        setTopError(err?.message || 'Could not submit update')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={l.title} onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <Field label={l.note + (requireNote ? ' *' : '')} error={fieldError('note')}>
          <textarea rows={action === 'request_help' ? 4 : 3} required={requireNote}
            value={note} onChange={(e) => setNote(e.target.value)} className="prog-input"
            aria-invalid={!!fieldError('note')} />
        </Field>

        {showEvidence && (
          <>
            <Field label="Files" error={fieldError('files') || fieldError('files.0')}>
              <div className="profile-uploader-drop">
                <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} />
                {files.length > 0 && (
                  <ul className="mt-2 flex flex-col gap-1">
                    {files.map((f, i) => (
                      <li key={i} className="flex items-center justify-between gap-2" style={{ fontSize: 12, color: '#3a4a5a' }}>
                        <span>{f.name} <span style={{ color: '#607186' }}>({(f.size / 1024).toFixed(0)} KB)</span></span>
                        <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#607186' }}><X size={14} /></button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Field>
            <Field label="Or link URLs" error={fieldError('urls') || fieldError('urls.0')}>
              <div className="flex flex-col gap-2">
                {urls.map((u, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input type="url" value={u} onChange={(e) => setUrls(urls.map((x, idx) => idx === i ? e.target.value : x))}
                      placeholder="https://" className="prog-input" />
                    {urls.length > 1 && (
                      <button type="button" onClick={() => setUrls(urls.filter((_, idx) => idx !== i))} style={removeBtnStyle}><X size={14} /></button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setUrls([...urls, ''])} className="event-btn-outline-light self-start" style={{ padding: '6px 10px', fontSize: 11 }}>
                  <Plus size={11} /> Add URL
                </button>
              </div>
            </Field>
          </>
        )}

        {topError && <p className="miami-body" style={{ fontSize: 12.5, color: '#b91c1c' }}>{topError}</p>}

        <div className="flex justify-end gap-2 mt-2">
          <button type="button" onClick={onClose} className="event-btn-outline-light" style={{ padding: '10px 14px', fontSize: 11 }}>Cancel</button>
          <button type="submit" disabled={submitting} className="event-btn-primary" style={{ padding: '10px 14px', fontSize: 11 }}>
            {submitting ? <><Loader2 size={12} className="prog-spin" /> Sending</> : <><Send size={12} /> {l.cta}</>}
          </button>
        </div>
      </form>
    </Modal>
  )
}

const removeBtnStyle = {
  background: 'rgba(13,27,42,0.04)', border: '1px solid rgba(13,27,42,0.10)',
  padding: '8px 10px', cursor: 'pointer', color: '#607186',
}

/* ─── Asset library ───────────────────────────────────────────────────── */

function AssetLibrary({ data, slug }) {
  const summary = data?.summary || {}
  const recent = Array.isArray(data?.recent) ? data.recent : []
  const editHref = withTestSearch(profileEditor(slug))
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

function PassAllocation({ data, events, slug, editToken, isTest, onRefresh }) {
  const [assignFor, setAssignFor] = useState(null) /* { passType, eventId? } */
  if (!data) return null
  /* The backend may either return a flat shape ({ allocated, assigned, ... })
     or a per-tier breakdown ({ delegate: {...}, vip: {...} }). Handle both. */
  const tiers = []
  if (data.delegate || data.vip) {
    if (data.delegate) tiers.push({ label: 'Delegate', key: 'delegate', ...data.delegate })
    if (data.vip)      tiers.push({ label: 'VIP',      key: 'vip',      ...data.vip })
  } else {
    tiers.push({ label: 'Passes', key: 'delegate', allocated: data.allocated, assigned: data.assigned, remaining: data.remaining })
  }
  const eventList = Array.isArray(events) ? events : []
  return (
    <>
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
                {remaining > 0 && (
                  <button onClick={() => setAssignFor({ passType: t.key })}
                    className="event-btn-outline-light mt-3" style={{ padding: '8px 14px', fontSize: 11 }}>
                    <Plus size={12} /> Assign a {t.label.toLowerCase()} pass
                  </button>
                )}
              </div>
            )
          })}
        </div>
        {Array.isArray(data.assignments) && data.assignments.length > 0 && (
          <div className="mt-5">
            <p className="miami-subhead mb-2" style={{ fontSize: 10, color: '#607186', letterSpacing: '0.22em' }}>Assigned passes</p>
            <table className="portal-table">
              <thead><tr><th>Attendee</th><th>Type</th><th>Email</th><th>Status</th></tr></thead>
              <tbody>
                {data.assignments.map((a, i) => (
                  <tr key={a.id || i}>
                    <td>
                      <p className="miami-body" style={{ fontSize: 13, color: '#0D1B2A', fontWeight: 600 }}>{a.attendee_name || a.holder_name || 'Unassigned'}</p>
                      {a.attendee_role && <p className="miami-body" style={{ fontSize: 12, color: '#607186', marginTop: 2 }}>{a.attendee_role}</p>}
                    </td>
                    <td><Cell text={a.pass_type || a.type} /></td>
                    <td><Cell text={a.attendee_email} /></td>
                    <td><StatusPill status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {assignFor && (
        <AssignPassDialog
          tier={assignFor}
          events={eventList}
          slug={slug}
          editToken={editToken}
          isTest={isTest}
          onClose={() => setAssignFor(null)}
          onSaved={() => { setAssignFor(null); onRefresh && onRefresh() }}
        />
      )}
    </>
  )
}

function AssignPassDialog({ tier, events, slug, editToken, isTest, onClose, onSaved }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [eventId, setEventId] = useState(events[0]?.id || events[0]?.event_id || '')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({}) /* { field: [msg, ...] } from Laravel 422 */
  const [topError, setTopError] = useState('')
  const fieldError = (k) => Array.isArray(errors[k]) ? errors[k][0] : errors[k]

  const submit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setSubmitting(true); setErrors({}); setTopError('')
    try {
      await assignCompanyPass(slug, editToken, {
        event_id: eventId || undefined,
        pass_type: tier.passType,
        attendee_name: name.trim(),
        attendee_email: email.trim(),
        attendee_role: role.trim() || undefined,
      }, { test: isTest })
      onSaved()
    } catch (err) {
      if (err instanceof ApiError && err.status === 422 && err.body?.errors) {
        setErrors(err.body.errors)
        setTopError(err.body.message || 'Please fix the highlighted fields and try again.')
      } else {
        setTopError(err?.message || 'Could not assign pass')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={`Assign ${tier.passType === 'vip' ? 'VIP' : 'delegate'} pass`} onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-3">
        {events.length > 1 && (
          <Field label="Event" error={fieldError('event_id')}>
            <select value={eventId} onChange={(e) => setEventId(e.target.value)} className="prog-input" aria-invalid={!!fieldError('event_id')}>
              {events.map((ev) => (
                <option key={ev.id || ev.event_id} value={ev.id || ev.event_id}>{ev.name || ev.title || ev.slug}</option>
              ))}
            </select>
          </Field>
        )}
        <Field label="Attendee name *" error={fieldError('attendee_name')}>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="prog-input" placeholder="Ana Rivera" aria-invalid={!!fieldError('attendee_name')} />
        </Field>
        <Field label="Attendee email *" error={fieldError('attendee_email')}>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="prog-input" placeholder="ana@company.com" aria-invalid={!!fieldError('attendee_email')} />
        </Field>
        <Field label="Role / title" error={fieldError('attendee_role')}>
          <input value={role} onChange={(e) => setRole(e.target.value)} className="prog-input" placeholder="Partnerships Director" aria-invalid={!!fieldError('attendee_role')} />
        </Field>
        {topError && <p className="miami-body" style={{ fontSize: 12.5, color: '#b91c1c' }}>{topError}</p>}
        <div className="flex justify-end gap-2 mt-2">
          <button type="button" onClick={onClose} className="event-btn-outline-light" style={{ padding: '10px 14px', fontSize: 11 }}>Cancel</button>
          <button type="submit" disabled={submitting} className="event-btn-primary" style={{ padding: '10px 14px', fontSize: 11 }}>
            {submitting ? <><Loader2 size={12} className="prog-spin" /> Assigning</> : <><Send size={12} /> Assign pass</>}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function Modal({ title, children, onClose }) {
  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', esc)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', esc)
      document.body.style.overflow = ''
    }
  }, [onClose])
  return (
    <div role="dialog" aria-modal="true" onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(13,27,42,0.55)', zIndex: 50,
      display: 'grid', placeItems: 'center', padding: 16,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.10)',
        width: 'min(560px, 100%)', maxHeight: '90vh', overflow: 'auto',
      }}>
        <div className="flex items-center justify-between gap-3" style={{ padding: '16px 22px', borderBottom: '1px solid rgba(13,27,42,0.08)' }}>
          <p className="miami-headline" style={{ fontSize: 15, color: '#0D1B2A' }}>{title}</p>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#607186' }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: 22 }}>{children}</div>
      </div>
    </div>
  )
}

function Field({ label, children, error }) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#607186' }}>{label}</span>}
      {children}
      {error && <span className="font-body" style={{ fontSize: 11, color: '#b91c1c' }}>{error}</span>}
    </label>
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
